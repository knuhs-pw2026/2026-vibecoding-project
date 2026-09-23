/**
 * Study SoundGuard - Visualizer
 * Canvas & SVG rendering for real-time Decibel Arc Gauge,
 * FFT Frequency Spectrum Analyzer, and Dual-Track Adaptive Timeline Graph.
 */

class Visualizer {
  constructor() {
    // Elements
    this.gaugeCircle = document.getElementById('gaugeCircle');
    this.dbValueText = document.getElementById('currentDbDisplay');
    this.dbStatusBadge = document.getElementById('dbEnvironmentBadge');

    // Band Elements
    this.bandLowFill = document.getElementById('bandLowFill');
    this.bandMidFill = document.getElementById('bandMidFill');
    this.bandHighFill = document.getElementById('bandHighFill');
    this.bandLowVal = document.getElementById('bandLowVal');
    this.bandMidVal = document.getElementById('bandMidVal');
    this.bandHighVal = document.getElementById('bandHighVal');

    // Canvas Elements
    this.spectrumCanvas = document.getElementById('spectrumCanvas');
    this.spectrumCtx = this.spectrumCanvas ? this.spectrumCanvas.getContext('2d') : null;

    this.historyCanvas = document.getElementById('historyCanvas');
    this.historyCtx = this.historyCanvas ? this.historyCanvas.getContext('2d') : null;

    // Timeline History Data Buffer (Past 120 points ~ 15-20 seconds)
    this.historyMaxLength = 120;
    this.historyData = [];
    for (let i = 0; i < this.historyMaxLength; i++) {
      this.historyData.push({ db: 35, volume: 20, isMasking: false });
    }

    this.initCanvases();
    window.addEventListener('resize', () => this.resizeCanvases());
  }

  /**
   * Initializes high-DPI canvas scaling
   */
  initCanvases() {
    this.resizeCanvases();
  }

  resizeCanvases() {
    const dpr = window.devicePixelRatio || 1;

    if (this.spectrumCanvas) {
      const rect = this.spectrumCanvas.getBoundingClientRect();
      this.spectrumCanvas.width = rect.width * dpr;
      this.spectrumCanvas.height = rect.height * dpr;
      this.spectrumCtx.scale(dpr, dpr);
      this.spectrumWidth = rect.width;
      this.spectrumHeight = rect.height;
    }

    if (this.historyCanvas) {
      const rect = this.historyCanvas.getBoundingClientRect();
      this.historyCanvas.width = rect.width * dpr;
      this.historyCanvas.height = rect.height * dpr;
      this.historyCtx.scale(dpr, dpr);
      this.historyWidth = rect.width;
      this.historyHeight = rect.height;
    }
  }

  /**
   * Updates circular decibel gauge and badge
   */
  updateDecibelGauge(db) {
    if (!this.gaugeCircle || !this.dbValueText) return;

    this.dbValueText.textContent = db.toFixed(1);

    // SVG Circle circumference = 2 * PI * r = 2 * PI * 100 = 628.3
    const maxDb = 95;
    const minDb = 25;
    const clampedDb = Math.max(minDb, Math.min(maxDb, db));
    const percentage = (clampedDb - minDb) / (maxDb - minDb);

    const circumference = 628;
    const offset = circumference - (circumference * percentage);
    this.gaugeCircle.style.strokeDashoffset = offset;

    // Determine state color and badge text in Yacht Club palette
    let statusText = '조용한 환경 (Quiet)';
    let statusColor = '#245F73';
    let badgeBg = 'rgba(36, 95, 115, 0.12)';
    let badgeBorder = 'rgba(36, 95, 115, 0.35)';

    if (db >= 75) {
      statusText = '강한 소음 방해 (Loud)';
      statusColor = '#733E24';
      badgeBg = 'rgba(115, 62, 36, 0.2)';
      badgeBorder = 'rgba(115, 62, 36, 0.5)';
    } else if (db >= 60) {
      statusText = '주의: 소음 발생 (Elevated)';
      statusColor = '#9E5632';
      badgeBg = 'rgba(158, 86, 50, 0.16)';
      badgeBorder = 'rgba(158, 86, 50, 0.42)';
    } else if (db >= 46) {
      statusText = '일상 도서관 소음 (Moderate)';
      statusColor = '#387D94';
      badgeBg = 'rgba(56, 125, 148, 0.15)';
      badgeBorder = 'rgba(56, 125, 148, 0.4)';
    }

    if (this.dbStatusBadge) {
      this.dbStatusBadge.textContent = statusText;
      this.dbStatusBadge.style.color = statusColor;
      this.dbStatusBadge.style.backgroundColor = badgeBg;
      this.dbStatusBadge.style.borderColor = badgeBorder;
    }
  }

  /**
   * Updates frequency distribution bars
   */
  updateFrequencyBands(bands) {
    if (this.bandLowFill) {
      this.bandLowFill.style.width = `${bands.low}%`;
      this.bandLowVal.textContent = `${bands.low}%`;
    }
    if (this.bandMidFill) {
      this.bandMidFill.style.width = `${bands.mid}%`;
      this.bandMidVal.textContent = `${bands.mid}%`;
    }
    if (this.bandHighFill) {
      this.bandHighFill.style.width = `${bands.high}%`;
      this.bandHighVal.textContent = `${bands.high}%`;
    }
  }

  /**
   * Renders real-time FFT Spectrum Canvas
   */
  drawSpectrum(rawFft) {
    if (!this.spectrumCtx || !this.spectrumWidth || !this.spectrumHeight) return;

    const ctx = this.spectrumCtx;
    const w = this.spectrumWidth;
    const h = this.spectrumHeight;

    ctx.clearRect(0, 0, w, h);

    // Draw background subtle grid lines
    ctx.strokeStyle = 'rgba(36, 95, 115, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (!rawFft || rawFft.length === 0) {
      // Idle wave
      ctx.strokeStyle = 'rgba(36, 95, 115, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      return;
    }

    const barCount = 48;
    const barWidth = (w / barCount) - 2;
    const step = Math.floor(rawFft.length / (barCount * 1.5));

    // Gradient for spectrum bars in Yacht Club palette
    const gradient = ctx.createLinearGradient(0, h, 0, 0);
    gradient.addColorStop(0, '#245F73');     // Deep Nautical Teal
    gradient.addColorStop(0.45, '#3E7E94');  // Maritime Teal
    gradient.addColorStop(0.8, '#BBBDBC');   // Rigging Silver Mist
    gradient.addColorStop(1, '#733E24');     // Mahogany Teak

    ctx.fillStyle = gradient;

    for (let i = 0; i < barCount; i++) {
      const fftIndex = i * step;
      const value = rawFft[fftIndex] || 0;
      const barHeight = Math.max(3, (value / 255) * (h - 10));
      const x = i * (barWidth + 2);
      const y = h - barHeight;

      // Rounded bar top
      const r = Math.min(barWidth / 2, 4);
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, h);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Adds data point to history and draws dual timeline graph
   */
  drawHistory(currentDb, outputVolPercent, isMasking, thresholdDb) {
    if (!this.historyCtx || !this.historyWidth || !this.historyHeight) return;

    // Push new point
    this.historyData.push({
      db: currentDb,
      volume: outputVolPercent,
      isMasking: isMasking
    });
    if (this.historyData.length > this.historyMaxLength) {
      this.historyData.shift();
    }

    const ctx = this.historyCtx;
    const w = this.historyWidth;
    const h = this.historyHeight;

    ctx.clearRect(0, 0, w, h);

    // Subtle horizontal gridlines
    ctx.strokeStyle = 'rgba(36, 95, 115, 0.08)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(ratio => {
      ctx.beginPath();
      ctx.moveTo(0, h * ratio);
      ctx.lineTo(w, h * ratio);
      ctx.stroke();
    });

    // 1. Draw Threshold Reference Line (Rigging Silver Slate)
    const thresholdNorm = (thresholdDb - 25) / (90 - 25);
    const thresholdY = h - (thresholdNorm * h);
    ctx.strokeStyle = '#7B8F98';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, thresholdY);
    ctx.lineTo(w, thresholdY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // 2. Draw Ambient dB History Curve (Deep Nautical Teal #245F73)
    ctx.beginPath();
    const stepX = w / (this.historyMaxLength - 1);

    for (let i = 0; i < this.historyData.length; i++) {
      const pt = this.historyData[i];
      const normDb = Math.max(0, Math.min(1, (pt.db - 25) / 65));
      const x = i * stepX;
      const y = h - (normDb * h * 0.95);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#245F73';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Draw Masking Sound Volume % History Curve (Mahogany Teak #733E24)
    ctx.beginPath();
    for (let i = 0; i < this.historyData.length; i++) {
      const pt = this.historyData[i];
      const normVol = Math.max(0, Math.min(1, pt.volume / 100));
      const x = i * stepX;
      const y = h - (normVol * h * 0.95);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#733E24';
    ctx.lineWidth = 2.8;
    ctx.stroke();

    // Legend in upper corner (Yacht Club styling)
    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillStyle = '#245F73';
    ctx.fillText('● 소음 dB', 10, 16);

    ctx.fillStyle = '#733E24';
    ctx.fillText('● 백색소음 Vol %', 85, 16);

    ctx.fillStyle = '#7B8F98';
    ctx.fillText(`--- 임계치 (${thresholdDb}dB)`, 205, 16);
  }
}

// Export class
window.Visualizer = Visualizer;
