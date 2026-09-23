/**
 * sound-detector.js - Real-time Acoustic AI Analyzer & 360 Radar Tracking
 * EyeGlass AI Navigation System
 */

class SoundDetector {
  constructor(audioNavManager, spectrumCanvasId) {
    this.audioNav = audioNavManager;
    this.canvas = document.getElementById(spectrumCanvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.analyser = null;
    this.micStream = null;
    this.dataArray = null;
    this.activeSounds = [];
    this.isMicActive = false;
    this.ambientDb = 48;
    this.lastTriggerTime = 0;

    this.initAudioAnalyser();
  }

  initAudioAnalyser() {
    if (!this.audioNav.audioCtx) return;
    const ctx = this.audioNav.audioCtx;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  async startMicrophone() {
    try {
      this.audioNav.ensureAudioContext();
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioNav.audioCtx.createMediaStreamSource(this.micStream);
      source.connect(this.analyser);
      this.isMicActive = true;
      console.log('Real microphone stream connected to Acoustic AI');
      return true;
    } catch (err) {
      console.warn('Microphone access denied or unavailable. Fallback to AI simulated acoustics:', err);
      this.isMicActive = false;
      return false;
    }
  }

  stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    this.isMicActive = false;
  }

  /**
   * Set active sound events (from scenario or dynamic environment)
   */
  setSounds(soundList) {
    this.activeSounds = [...soundList];
    this.updateRadarDisplay();
    this.updateSoundEventsUI();
  }

  /**
   * Add a dynamic sound event (e.g., sudden horn or bike bell)
   */
  triggerSoundEvent(soundEvent) {
    // Add to active list
    this.activeSounds.unshift(soundEvent);
    if (this.activeSounds.length > 5) {
      this.activeSounds.pop();
    }

    // Calculate stereo pan based on angle (0 = front, 90 = right, 270 = left)
    const rad = (soundEvent.angle * Math.PI) / 180;
    const pan = Math.sin(rad); // -1.0 (left) ~ +1.0 (right)

    // Play 3D directional sound
    this.audioNav.synthesizeHazardSound(soundEvent.type, pan);

    // Speak audio alert if high/critical
    if (soundEvent.priority === 'critical' || soundEvent.priority === 'high') {
      this.audioNav.speak(soundEvent.alertMsg, soundEvent.priority);
    }

    this.updateRadarDisplay();
    this.updateSoundEventsUI();
  }

  /**
   * Main update loop called every animation frame
   */
  update(time) {
    // 1. Analyze frequency data
    if (this.analyser && this.isMicActive) {
      this.analyser.getByteFrequencyData(this.dataArray);
      this.detectRealAcousticThreats();
    } else {
      // Procedural synthetic frequency oscillation for visualization
      this.generateSyntheticFrequencyData(time);
    }

    // 2. Render spectrum
    this.drawSpectrum();
  }

  generateSyntheticFrequencyData(time) {
    if (!this.dataArray) return;
    const len = this.dataArray.length;
    const hasHazard = this.activeSounds.some(s => s.priority === 'critical');

    for (let i = 0; i < len; i++) {
      const base = Math.sin(time * 0.005 + i * 0.2) * 20 + 35;
      const noise = Math.random() * 15;
      const hazardBoost = hasHazard && (i > 15 && i < 40) ? 90 + Math.random() * 40 : 0;
      this.dataArray[i] = Math.min(255, base + noise + hazardBoost);
    }
  }

  detectRealAcousticThreats() {
    if (!this.dataArray) return;
    // Calculate RMS volume / peak energy
    let sum = 0;
    let maxVal = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const val = this.dataArray[i];
      sum += val;
      if (val > maxVal) maxVal = val;
    }
    const avg = sum / this.dataArray.length;
    this.ambientDb = Math.round(35 + (avg / 255) * 60);

    const dbEl = document.getElementById('ambientDb');
    if (dbEl) dbEl.textContent = `${this.ambientDb} dB`;

    // Sudden loud burst detection (> 210)
    const now = Date.now();
    if (maxVal > 215 && now - this.lastTriggerTime > 3000) {
      this.lastTriggerTime = now;
      console.log('Real Acoustic Spike Detected!', maxVal);
      this.triggerSoundEvent({
        id: 'real_snd_' + now,
        name: '주변 급격한 고소음 감지!',
        type: 'horn',
        angle: Math.random() > 0.5 ? 90 : 270,
        distance: 3.5,
        db: this.ambientDb,
        alertMsg: '주의! 주변에서 큰 충격음 또는 경음기가 감지되었습니다.',
        priority: 'high'
      });
    }
  }

  drawSpectrum() {
    if (!this.ctx || !this.dataArray) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const barCount = 32;
    const barWidth = (w / barCount) - 2;
    const step = Math.floor(this.dataArray.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const val = this.dataArray[i * step] || 0;
      const barHeight = (val / 255) * (h - 4);
      const x = i * (barWidth + 2);
      const y = h - barHeight;

      // Color gradation (Cyan to Red on spikes)
      if (val > 180) {
        ctx.fillStyle = '#ff3366';
      } else if (val > 120) {
        ctx.fillStyle = '#ffaa00';
      } else {
        ctx.fillStyle = '#00f0ff';
      }

      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }

  updateRadarDisplay() {
    const layer = document.getElementById('radarBlipsLayer');
    if (!layer) return;
    layer.innerHTML = '';

    // Radar radius in pixels (container is 160x160 -> radius 80)
    const r = 70;
    const cx = 80;
    const cy = 80;

    this.activeSounds.forEach(sound => {
      // Angle: 0 is North (top), 90 East (right), 180 South (bottom), 270 West (left)
      const rad = ((sound.angle - 90) * Math.PI) / 180;
      // Normalize distance (max ~15m)
      const normDist = Math.min(1.0, sound.distance / 15.0);
      const distPx = 15 + normDist * (r - 20);

      const bx = cx + Math.cos(rad) * distPx;
      const by = cy + Math.sin(rad) * distPx;

      const blip = document.createElement('div');
      blip.className = `radar-blip ${sound.priority === 'critical' ? 'danger' : sound.priority === 'high' ? 'warning' : 'info'}`;
      blip.style.left = `${(bx / 160) * 100}%`;
      blip.style.top = `${(by / 160) * 100}%`;
      blip.title = `${sound.name} (${sound.distance}m, ${sound.angle}°)`;
      layer.appendChild(blip);
    });
  }

  updateSoundEventsUI() {
    const list = document.getElementById('soundEventsList');
    if (!list) return;
    list.innerHTML = '';

    if (this.activeSounds.length === 0) {
      list.innerHTML = '<div style="font-size:11px;color:var(--text-dim);text-align:center;padding:8px;">특이 위험 소음 없음 (안전)</div>';
      return;
    }

    this.activeSounds.forEach(sound => {
      const item = document.createElement('div');
      const isDanger = sound.priority === 'critical';
      const isWarn = sound.priority === 'high';
      item.className = `sound-item ${isDanger ? 'danger-sound' : isWarn ? 'warning-sound' : ''}`;

      // Convert angle to clock face
      const clockHours = Math.round(sound.angle / 30);
      const clockStr = clockHours === 0 ? '12시' : `${clockHours}시`;

      item.innerHTML = `
        <span style="font-weight:700;">${sound.name}</span>
        <span style="font-family:var(--mono-font);color:var(--accent-cyan);">${clockStr} • ${sound.distance}m</span>
      `;
      list.appendChild(item);
    });
  }
}

window.SoundDetector = SoundDetector;
