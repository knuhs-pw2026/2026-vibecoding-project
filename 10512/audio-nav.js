/**
 * audio-nav.js - Voice Assistant (TTS/STT), 3D Spatial Audio & Haptics
 * EyeGlass AI Navigation System
 */

class AudioNavigationManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.speechSynth = window.speechSynthesis;
    this.speechRecognizer = null;
    this.isListening = false;
    this.onVoiceCommandCallback = null;
    this.koreanVoice = null;
    this.lastSpokenText = '';
    this.lastSpokenTime = 0;

    this.initAudioContext();
    this.initTTS();
    this.initSTT();
  }

  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.audioCtx = new AudioContextClass();
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initTTS() {
    if (!this.speechSynth) return;

    const findVoice = () => {
      const voices = this.speechSynth.getVoices();
      // Prefer Google Korean or standard ko-KR
      this.koreanVoice = voices.find(v => v.lang.startsWith('ko')) || voices[0];
    };

    findVoice();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = findVoice;
    }
  }

  initSTT() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.speechRecognizer = new SpeechRec();
      this.speechRecognizer.continuous = false;
      this.speechRecognizer.interimResults = true;
      this.speechRecognizer.lang = 'ko-KR';

      this.speechRecognizer.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(res => res[0].transcript)
          .join('');

        const isFinal = event.results[0].isFinal;
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(transcript, isFinal);
        }

        if (isFinal) {
          this.processCommand(transcript);
        }
      };

      this.speechRecognizer.onerror = (e) => {
        console.warn('SpeechRecognition error:', e);
        this.isListening = false;
        if (this.onListenStateChange) this.onListenStateChange(false);
      };

      this.speechRecognizer.onend = () => {
        this.isListening = false;
        if (this.onListenStateChange) this.onListenStateChange(false);
      };
    }
  }

  startListening(onTranscript, onStateChange, onCommand) {
    if (!this.speechRecognizer) {
      alert('이 브라우저에서는 Web Speech API 음성 인식이 지원되지 않습니다. Chrome/Edge 브라우저를 권장합니다.');
      return;
    }
    this.onTranscriptUpdate = onTranscript;
    this.onListenStateChange = onStateChange;
    this.onVoiceCommandCallback = onCommand;

    try {
      this.speechRecognizer.start();
      this.isListening = true;
      if (this.onListenStateChange) this.onListenStateChange(true);
      this.playChime(660, 0.1, 0); // Start listening ear-con
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
    }
  }

  stopListening() {
    if (this.speechRecognizer && this.isListening) {
      this.speechRecognizer.stop();
      this.isListening = false;
      if (this.onListenStateChange) this.onListenStateChange(false);
    }
  }

  processCommand(rawText) {
    const text = rawText.trim().toLowerCase();
    console.log('Voice Command received:', text);

    if (this.onVoiceCommandCallback) {
      this.onVoiceCommandCallback(text);
    }
  }

  /**
   * Natural Korean Voice Output (TTS) with Priority & Throttling
   */
  speak(text, priority = 'normal') {
    if (this.isMuted || !this.speechSynth) return;

    const now = Date.now();
    // Prevent duplicate repeated spam within 2.5 seconds unless critical
    if (text === this.lastSpokenText && now - this.lastSpokenTime < 2500 && priority !== 'critical') {
      return;
    }

    if (priority === 'critical') {
      this.speechSynth.cancel(); // Interrupt existing chatter for emergency
      this.vibrate([150, 80, 200, 80, 250]);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.koreanVoice) {
      utterance.voice = this.koreanVoice;
    }
    utterance.lang = 'ko-KR';
    utterance.rate = priority === 'critical' ? 1.15 : 1.05; // Slightly faster for clarity
    utterance.pitch = priority === 'critical' ? 1.1 : 1.0;

    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    this.speechSynth.speak(utterance);

    // Also update screen reader live region
    const sr = document.getElementById('srAnnounce');
    if (sr) {
      sr.textContent = text;
    }
  }

  /**
   * 3D Binaural Spatial Sound Ear-con
   * Pan: -1.0 (Full Left) ~ 0.0 (Center) ~ +1.0 (Full Right)
   */
  playSpatialBeep(pan = 0, freq = 880, duration = 0.15, type = 'sine') {
    this.ensureAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      // Stereo Panning for directional sound
      if (this.audioCtx.createStereoPanner) {
        const panner = this.audioCtx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.audioCtx.destination);
      } else {
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
      }

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Audio ear-con for safe navigation chime
   */
  playChime(freq = 523, duration = 0.2, pan = 0) {
    this.playSpatialBeep(pan, freq, duration, 'sine');
  }

  /**
   * Synthesize Urgent Hazard Sound (Binaural Horn / Siren / Warning)
   */
  synthesizeHazardSound(soundType, pan = 0) {
    this.ensureAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (soundType === 'horn') {
      // Dual discordant tones for authentic car horn
      [420, 510].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        if (ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          panner.pan.setValueAtTime(pan, now);
          osc.connect(gain).connect(panner).connect(ctx.destination);
        } else {
          osc.connect(gain).connect(ctx.destination);
        }

        osc.start(now);
        osc.stop(now + 0.55);
      });
      this.vibrate([100, 50, 150]);
    } else if (soundType === 'bell') {
      // High pitch bicycle bell ping-ping
      [2400, 2650].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.22);

        if (ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          panner.pan.setValueAtTime(pan, now);
          osc.connect(gain).connect(panner).connect(ctx.destination);
        } else {
          osc.connect(gain).connect(ctx.destination);
        }

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.25);
      });
      this.vibrate([80, 40, 80]);
    } else if (soundType === 'beacon') {
      // Acoustic crosswalk beacon "Pee-Paw"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(550, now + 0.35);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(pan, now);
        osc.connect(gain).connect(panner).connect(ctx.destination);
      } else {
        osc.connect(gain).connect(ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.42);
    } else {
      // Generic warning tone
      this.playSpatialBeep(pan, 650, 0.3, 'triangle');
    }
  }

  /**
   * Haptic Vibration for wearable / mobile glasses companion
   */
  vibrate(pattern) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // silent catch
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.speechSynth) {
      this.speechSynth.cancel();
    }
    return this.isMuted;
  }
}

window.AudioNavigationManager = AudioNavigationManager;
