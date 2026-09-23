/**
 * Study SoundGuard - Audio Engine
 * Web Audio API implementation for real-time microphone noise analysis
 * and procedural sound synthesis (White/Pink/Brown noise, Rain, Ambient, Generative Classical)
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.micStream = null;
    this.micSourceNode = null;
    this.analyserNode = null;
    this.micGainNode = null;

    // Generators and Output Routing
    this.masterSoundGain = null;
    this.activeSourceNode = null;
    this.activeFilterNodes = [];
    this.activeIntervals = [];

    // Current sound state
    this.currentSoundType = 'pink'; // 'pink', 'brown', 'white', 'rain', 'stream', 'ambient', 'binaural', 'custom'
    this.isPlaying = false;
    this.isMicActive = false;

    // Calibration and Analysis Data
    this.dbOffset = 100; // Calibrated offset to align dBFS with approximate SPL dB
    this.currentDb = 35.0;
    this.frequencyBands = { low: 0, mid: 0, high: 0 };
    this.customAudioBuffer = null;

    // Speaker Feedback Suppression
    this.speakerMode = false; // If true, applies feedback dampening
    this.lastOutputGain = 0.3;
  }

  /**
   * Initializes the AudioContext upon user interaction
   */
  async initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    if (!this.masterSoundGain) {
      this.masterSoundGain = this.audioCtx.createGain();
      this.masterSoundGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      this.masterSoundGain.connect(this.audioCtx.destination);
    }
  }

  /**
   * Starts microphone capture and real-time noise measurement
   */
  async startMicrophone() {
    await this.initContext();

    try {
      // Audio constraints: disable browser automatic filtering to obtain true raw room acoustics
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1
        }
      };

      this.micStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.micSourceNode = this.audioCtx.createMediaStreamSource(this.micStream);

      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 1024;
      this.analyserNode.smoothingTimeConstant = 0.3;

      this.micGainNode = this.audioCtx.createGain();
      this.micGainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime);

      this.micSourceNode.connect(this.micGainNode);
      this.micGainNode.connect(this.analyserNode);
      // Notice: AnalyserNode is NOT connected to destination to prevent mic feedback howling!

      this.isMicActive = true;
      return { success: true };
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      this.isMicActive = false;
      return { success: false, error: err.name || err.message };
    }
  }

  /**
   * Stops microphone input
   */
  stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.micSourceNode) {
      this.micSourceNode.disconnect();
      this.micSourceNode = null;
    }
    this.isMicActive = false;
  }

  /**
   * Measures current ambient noise decibels (SPL approx) and multi-band spectral power
   */
  analyzeNoise() {
    if (!this.isMicActive || !this.analyserNode) {
      return { db: this.currentDb, bands: this.frequencyBands, rawFft: [] };
    }

    const bufferLength = this.analyserNode.fftSize;
    const timeData = new Float32Array(bufferLength);
    this.analyserNode.getFloatTimeDomainData(timeData);

    // Calculate Root Mean Square (RMS) of audio frame
    let sumSquares = 0;
    for (let i = 0; i < bufferLength; i++) {
      const val = timeData[i];
      sumSquares += val * val;
    }
    const rms = Math.sqrt(sumSquares / bufferLength);

    // Convert RMS to dBFS (-Infinity to 0 dBFS)
    let dbFS = -100;
    if (rms > 0.000001) {
      dbFS = 20 * Math.log10(rms);
    }

    // Convert dBFS to approximate room SPL dB using calibration offset
    let measuredDb = dbFS + this.dbOffset;

    // If speaker mode is active and noise generator is playing, subtract estimated bleed
    if (this.speakerMode && this.isPlaying) {
      const bleedDampening = this.lastOutputGain * 14.0; // Approx speaker bleed estimation
      measuredDb = Math.max(30, measuredDb - bleedDampening);
    }

    // Clamp into reasonable human hearing indoor range (25 dB ~ 100 dB)
    measuredDb = Math.max(25, Math.min(105, measuredDb));

    // Smooth decibel reading
    this.currentDb = this.currentDb * 0.4 + measuredDb * 0.6;

    // Frequency Spectrum Analysis (FFT)
    const freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(freqData);

    // Compute Low, Mid, High band distributions
    // Sample rate typically 44100 or 48000. Bin width is SampleRate / fftSize (approx 43Hz ~ 47Hz)
    const sampleRate = this.audioCtx.sampleRate || 44100;
    const binSize = sampleRate / this.analyserNode.fftSize;

    const lowCutBin = Math.floor(250 / binSize);   // Up to 250 Hz (rumble, footstep)
    const midCutBin = Math.floor(2500 / binSize);  // 250 Hz - 2.5 kHz (speech, chair, murmur)
    const highCutBin = Math.min(freqData.length, Math.floor(12000 / binSize)); // 2.5 kHz+ (click, pen, rustle)

    let lowEnergy = 0, midEnergy = 0, highEnergy = 0;

    for (let i = 0; i < lowCutBin; i++) lowEnergy += freqData[i];
    for (let i = lowCutBin; i < midCutBin; i++) midEnergy += freqData[i];
    for (let i = midCutBin; i < highCutBin; i++) highEnergy += freqData[i];

    const lowAvg = lowEnergy / Math.max(1, lowCutBin);
    const midAvg = midEnergy / Math.max(1, (midCutBin - lowCutBin));
    const highAvg = highEnergy / Math.max(1, (highCutBin - midCutBin));

    this.frequencyBands = {
      low: Math.min(100, Math.round((lowAvg / 255) * 100)),
      mid: Math.min(100, Math.round((midAvg / 255) * 100)),
      high: Math.min(100, Math.round((highAvg / 255) * 100))
    };

    return {
      db: Math.round(this.currentDb * 10) / 10,
      bands: this.frequencyBands,
      rawFft: freqData
    };
  }

  /**
   * Sets master masking volume smoothly using Web Audio API ramp
   */
  setMaskingVolume(targetGain, transitionTime = 0.15) {
    if (!this.masterSoundGain || !this.audioCtx) return;
    this.lastOutputGain = targetGain;
    const now = this.audioCtx.currentTime;
    this.masterSoundGain.gain.cancelScheduledValues(now);
    this.masterSoundGain.gain.setTargetAtTime(targetGain, now, transitionTime);
  }

  /**
   * Stops any currently playing procedural sound
   */
  stopCurrentSound() {
    this.activeIntervals.forEach(id => clearInterval(id));
    this.activeIntervals = [];

    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch (e) {}
      this.activeSourceNode = null;
    }

    this.activeFilterNodes.forEach(filter => {
      try { filter.disconnect(); } catch (e) {}
    });
    this.activeFilterNodes = [];

    this.isPlaying = false;
  }

  /**
   * Plays the selected sound type
   */
  async playSound(type) {
    await this.initContext();
    this.stopCurrentSound();
    this.currentSoundType = type;

    switch (type) {
      case 'white':
        this.createWhiteNoise();
        break;
      case 'pink':
        this.createPinkNoise();
        break;
      case 'brown':
        this.createBrownNoise();
        break;
      case 'rain':
        this.createRainSound();
        break;
      case 'stream':
        this.createStreamSound();
        break;
      case 'ambient':
        this.createLibraryAmbient();
        break;
      case 'binaural':
        this.createBinauralAlphaBeats();
        break;
      case 'classical':
        this.createGenerativeClassical();
        break;
      case 'custom':
        if (this.customAudioBuffer) {
          this.playCustomBuffer();
        } else {
          // Fallback to pink noise if no custom file loaded
          this.createPinkNoise();
        }
        break;
      default:
        this.createPinkNoise();
        break;
    }

    this.isPlaying = true;
  }

  /* ---------------- Procedural Sound Generators ---------------- */

  /**
   * Generates continuous White Noise (Flat spectrum across all frequencies)
   */
  createWhiteNoise() {
    const bufferSize = this.audioCtx.sampleRate * 4; // 4 second loop
    const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    const whiteNode = this.audioCtx.createBufferSource();
    whiteNode.buffer = buffer;
    whiteNode.loop = true;
    whiteNode.connect(this.masterSoundGain);
    whiteNode.start(0);

    this.activeSourceNode = whiteNode;
  }

  /**
   * Generates Pink Noise using Paul Kellet's refined 1/f filter approximation (-3dB/octave)
   * The gold standard for cognitive masking, comfortable and soft.
   */
  createPinkNoise() {
    const bufferSize = this.audioCtx.sampleRate * 5;
    const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }

    const pinkNode = this.audioCtx.createBufferSource();
    pinkNode.buffer = buffer;
    pinkNode.loop = true;
    pinkNode.connect(this.masterSoundGain);
    pinkNode.start(0);

    this.activeSourceNode = pinkNode;
  }

  /**
   * Generates Brownian / Red Noise (1/f^2 falloff, -6dB/octave)
   * Deep, warm rumble. Superb for blocking footsteps, low thuds, and road rumble.
   */
  createBrownNoise() {
    const bufferSize = this.audioCtx.sampleRate * 5;
    const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5; // Gain scaling for warmth
      }
    }

    const brownNode = this.audioCtx.createBufferSource();
    brownNode.buffer = buffer;
    brownNode.loop = true;
    brownNode.connect(this.masterSoundGain);
    brownNode.start(0);

    this.activeSourceNode = brownNode;
  }

  /**
   * Generates Procedural Rain Shower
   * Pink noise filtered through dual bandpass resonant filters with subtle droplet modulations
   */
  createRainSound() {
    const bufferSize = this.audioCtx.sampleRate * 6;
    const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.08;
        b1 = 0.95 * b1 + white * 0.15;
        b2 = 0.85 * b2 + white * 0.3;
        // occasional micro drop transient
        const droplet = Math.random() > 0.9996 ? (Math.random() * 1.5 - 0.75) : 0;
        data[i] = (b0 + b1 + b2) * 0.25 + droplet;
      }
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Resonant bandpass filter to emulate rain surface texture
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(0.7, this.audioCtx.currentTime);

    const highpass = this.audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(120, this.audioCtx.currentTime);

    source.connect(highpass);
    highpass.connect(filter);
    filter.connect(this.masterSoundGain);
    source.start(0);

    this.activeSourceNode = source;
    this.activeFilterNodes = [filter, highpass];
  }

  /**
   * Generates Gentle Forest Stream & Cascading Water
   */
  createStreamSound() {
    const bufferSize = this.audioCtx.sampleRate * 6;
    const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + (0.05 * white)) / 1.05;
        data[i] = lastVal * 1.8;
      }
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Dynamic bandpass filter that simulates moving water bubbles
    const streamFilter = this.audioCtx.createBiquadFilter();
    streamFilter.type = 'bandpass';
    streamFilter.frequency.setValueAtTime(750, this.audioCtx.currentTime);
    streamFilter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

    // LFO modulator to simulate gentle current ebb and flow
    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.audioCtx.currentTime);
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(250, this.audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(streamFilter.frequency);
    lfo.start(0);

    source.connect(streamFilter);
    streamFilter.connect(this.masterSoundGain);
    source.start(0);

    this.activeSourceNode = source;
    this.activeFilterNodes = [streamFilter, lfoGain, lfo];
  }

  /**
   * Generates Library / Cafe Deep Ambient (Warm room harmonics and soft air murmurs)
   */
  createLibraryAmbient() {
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const subOsc = this.audioCtx.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110, this.audioCtx.currentTime); // A2

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(164.81, this.audioCtx.currentTime); // E3

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, this.audioCtx.currentTime); // A1

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

    const warmGain = this.audioCtx.createGain();
    warmGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(warmGain);
    warmGain.connect(this.masterSoundGain);

    osc1.start(0);
    osc2.start(0);
    subOsc.start(0);

    this.activeSourceNode = {
      stop: () => {
        try { osc1.stop(); osc2.stop(); subOsc.stop(); } catch(e) {}
      },
      disconnect: () => {
        try { osc1.disconnect(); osc2.disconnect(); subOsc.disconnect(); } catch(e) {}
      }
    };
    this.activeFilterNodes = [filter, warmGain];
  }

  /**
   * Generates Binaural Alpha Wave Beats (10Hz focus brainwave entrainment)
   * Left: 200 Hz, Right: 210 Hz
   */
  createBinauralAlphaBeats() {
    const merger = this.audioCtx.createChannelMerger(2);

    const oscLeft = this.audioCtx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(200, this.audioCtx.currentTime);

    const oscRight = this.audioCtx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(210, this.audioCtx.currentTime); // 10Hz Alpha difference

    const leftGain = this.audioCtx.createGain();
    leftGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    const rightGain = this.audioCtx.createGain();
    rightGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);

    oscLeft.connect(leftGain);
    leftGain.connect(merger, 0, 0); // Left channel

    oscRight.connect(rightGain);
    rightGain.connect(merger, 0, 1); // Right channel

    merger.connect(this.masterSoundGain);

    oscLeft.start(0);
    oscRight.start(0);

    this.activeSourceNode = {
      stop: () => {
        try { oscLeft.stop(); oscRight.stop(); } catch(e) {}
      },
      disconnect: () => {
        try { oscLeft.disconnect(); oscRight.disconnect(); merger.disconnect(); } catch(e) {}
      }
    };
  }

  /**
   * Generates Infinite Non-repeating Peaceful Ambient Classical Pad / Chords
   * Pentatonic scales (F, G, A, C, D) with lush reverb-like envelope swells
   */
  createGenerativeClassical() {
    // Beautiful peaceful chords (F major 9, Dm9, Bbmaj7, Cadd9)
    const chordProgressions = [
      [174.61, 220.00, 261.63, 329.63, 392.00], // F3, A3, C4, E4, G4 (Fmaj9)
      [146.83, 220.00, 261.63, 293.66, 349.23], // D3, A3, C4, D4, F4 (Dm9)
      [116.54, 174.61, 233.08, 293.66, 349.23], // Bb2, F3, Bb3, D4, F4 (Bbmaj7)
      [130.81, 196.00, 261.63, 293.66, 392.00]  // C3, G3, C4, D4, G4 (Cadd9)
    ];

    let chordIndex = 0;
    const activeChords = [];

    const playNextChord = () => {
      if (!this.isPlaying || this.currentSoundType !== 'classical') return;

      const chordNotes = chordProgressions[chordIndex % chordProgressions.length];
      chordIndex++;

      const now = this.audioCtx.currentTime;
      const duration = 6.0; // 6 seconds per chord progression

      chordNotes.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();
        const noteFilter = this.audioCtx.createBiquadFilter();

        osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Soft warm lowpass
        noteFilter.type = 'lowpass';
        noteFilter.frequency.setValueAtTime(600, now);

        // Gentle envelope: Slow attack (2s), Sustain (2s), Slow release (2s)
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.06, now + 2.0);
        noteGain.gain.exponentialRampToValueAtTime(0.04, now + 4.0);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(this.masterSoundGain);

        osc.start(now);
        osc.stop(now + duration + 0.5);

        activeChords.push({ osc, noteGain, noteFilter });
      });
    };

    playNextChord();
    const intervalId = setInterval(playNextChord, 4800); // Crossfade chords
    this.activeIntervals.push(intervalId);

    this.activeSourceNode = {
      stop: () => {
        activeChords.forEach(c => {
          try { c.osc.stop(); } catch(e) {}
        });
      },
      disconnect: () => {
        activeChords.forEach(c => {
          try { c.osc.disconnect(); c.noteGain.disconnect(); } catch(e) {}
        });
      }
    };
  }

  /**
   * Loads custom user MP3 / WAV audio file
   */
  async loadCustomAudioFile(file) {
    await this.initContext();
    const arrayBuffer = await file.arrayBuffer();
    this.customAudioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
    return { success: true, name: file.name, duration: this.customAudioBuffer.duration };
  }

  /**
   * Plays the loaded custom audio buffer looped
   */
  playCustomBuffer() {
    if (!this.customAudioBuffer) return;
    const source = this.audioCtx.createBufferSource();
    source.buffer = this.customAudioBuffer;
    source.loop = true;
    source.connect(this.masterSoundGain);
    source.start(0);
    this.activeSourceNode = source;
  }
}

// Export singleton or class
window.AudioEngine = AudioEngine;
