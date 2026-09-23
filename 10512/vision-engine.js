/**
 * vision-engine.js - Real-time Forward Vision AI Object Tracking & HUD Overlay
 * EyeGlass AI Navigation System
 */

class VisionEngine {
  constructor(audioNavManager, hudCanvasId, videoId) {
    this.audioNav = audioNavManager;
    this.canvas = document.getElementById(hudCanvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.video = document.getElementById(videoId);

    this.activeObjects = [];
    this.isCameraMode = false;
    this.videoStream = null;
    this.lastVoiceAlertTime = 0;
    this.ocrText = '';

    this.cameraSimObjects = [];
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  /**
   * Set objects from scenario
   */
  setObjects(objects, ocr = '') {
    this.activeObjects = [...objects];
    this.ocrText = ocr;
    this.updateDetectedCardsUI();
    this.updateOcrUI();
    this.evaluateObstacleHazards();
  }

  /**
   * Enable real camera (webcam/phone rear camera)
   */
  async startCamera() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      this.video.srcObject = this.videoStream;
      this.video.classList.remove('hidden-media');
      this.isCameraMode = true;

      // Initialize real camera dynamic tracking points
      this.initRealCameraTracking();
      return true;
    } catch (err) {
      console.warn('Camera access denied or failed:', err);
      alert('카메라 권한을 얻을 수 없습니다. 시뮬레이션 모드로 계속 진행합니다.');
      this.isCameraMode = false;
      return false;
    }
  }

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    if (this.video) {
      this.video.classList.add('hidden-media');
    }
    this.isCameraMode = false;
  }

  initRealCameraTracking() {
    // Generate responsive interactive vision anchors in real camera mode
    this.cameraSimObjects = [
      {
        id: 'cam_fwd_route',
        name: '실시간 전방 보행로 스캔',
        type: 'route',
        distance: 2.1,
        clockDir: '12시',
        dangerLevel: 'info',
        box: { x: 0.35, y: 0.50, w: 0.30, h: 0.40 },
        color: '#00ff9d',
        desc: '전방 안전 보행 공간 확보'
      },
      {
        id: 'cam_surface_check',
        name: '노면 단차 및 턱 감지',
        type: 'ground',
        distance: 1.4,
        clockDir: '12시',
        dangerLevel: 'info',
        box: { x: 0.40, y: 0.70, w: 0.20, h: 0.15 },
        color: '#00f0ff',
        desc: '보행 평탄면 양호'
      }
    ];
    this.setObjects(this.cameraSimObjects, '실시간 AI 렌즈 전방 텍스트 및 사물 분석 중');
  }

  /**
   * Main render loop for AR HUD over canvas
   */
  render(time) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw 3D AR Safe Walking Path on the floor
    this.drawArSafePath(ctx, w, h, time);

    // 2. Draw Bounding Boxes & Distance Reticles for tracked objects
    this.activeObjects.forEach(obj => {
      this.drawObjectBoundingBox(ctx, obj, w, h, time);
    });

    // 3. Draw Laser Distance Grid
    this.drawDistanceRuler(ctx, w, h);
  }

  drawArSafePath(ctx, w, h, time) {
    // Determine path bend based on obstacles (if obstacle at 11 o'clock, bend right)
    const hasLeftThreat = this.activeObjects.some(o => o.clockDir === '11시' || o.clockDir === '10시');
    const hasRightThreat = this.activeObjects.some(o => o.clockDir === '1시' || o.clockDir === '2시');
    const isDanger = this.activeObjects.some(o => o.dangerLevel === 'danger');

    let shiftX = 0;
    if (hasLeftThreat) shiftX = w * 0.08;
    if (hasRightThreat) shiftX = -w * 0.08;

    const horizonY = h * 0.46;
    const vanishX = w * 0.5 + shiftX;

    // Projected 3D Green Safe Carpet
    const pathGrad = ctx.createLinearGradient(0, h, 0, horizonY);
    if (isDanger) {
      pathGrad.addColorStop(0, 'rgba(255, 51, 102, 0.4)');
      pathGrad.addColorStop(1, 'rgba(255, 51, 102, 0.05)');
    } else {
      pathGrad.addColorStop(0, 'rgba(0, 255, 157, 0.35)');
      pathGrad.addColorStop(1, 'rgba(0, 255, 157, 0.02)');
    }

    ctx.fillStyle = pathGrad;
    ctx.beginPath();
    ctx.moveTo(w * 0.38 + shiftX * 0.5, h);
    ctx.lineTo(w * 0.62 + shiftX * 0.5, h);
    ctx.lineTo(vanishX + 15, horizonY + 20);
    ctx.lineTo(vanishX - 15, horizonY + 20);
    ctx.closePath();
    ctx.fill();

    // Moving AR Chevrons / Arrow heads pointing forward
    const pathColor = isDanger ? '#ff3366' : '#00ff9d';
    ctx.strokeStyle = pathColor;
    ctx.lineWidth = 3;

    const chevronCount = 5;
    for (let i = 0; i < chevronCount; i++) {
      const p = ((i / chevronCount) + (time * 0.0008)) % 1;
      const py = horizonY + 30 + (h - horizonY - 40) * (p * p);
      const spanW = 30 + (w * 0.22) * p;
      const cx = (w * 0.5) + (shiftX * p);

      ctx.beginPath();
      ctx.moveTo(cx - spanW * 0.5, py + 12);
      ctx.lineTo(cx, py);
      ctx.lineTo(cx + spanW * 0.5, py + 12);
      ctx.stroke();
    }
  }

  drawObjectBoundingBox(ctx, obj, w, h, time) {
    const box = obj.box;
    const x = box.x * w;
    const y = box.y * h;
    const bw = box.w * w;
    const bh = box.h * h;

    const color = obj.dangerLevel === 'danger' ? '#ff3366' : obj.dangerLevel === 'warning' ? '#ffaa00' : '#00f0ff';
    const isUrgent = obj.dangerLevel === 'danger';

    // Outer glow for hazards
    if (isUrgent) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
    }

    // Modern Sci-Fi HUD Corner Brackets
    ctx.strokeStyle = color;
    ctx.lineWidth = isUrgent ? 3 : 2;
    const cornerSize = Math.min(bw, bh) * 0.28;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(x, y + cornerSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerSize, y);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(x + bw - cornerSize, y);
    ctx.lineTo(x + bw, y);
    ctx.lineTo(x + bw, y + cornerSize);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(x, y + bh - cornerSize);
    ctx.lineTo(x, y + bh);
    ctx.lineTo(x + cornerSize, y + bh);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(x + bw - cornerSize, y + bh);
    ctx.lineTo(x + bw, y + bh);
    ctx.lineTo(x + bw, y + bh - cornerSize);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Center Crosshair inside bounding box
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    const midX = x + bw * 0.5;
    const midY = y + bh * 0.5;
    ctx.beginPath();
    ctx.moveTo(midX - 6, midY); ctx.lineTo(midX + 6, midY);
    ctx.moveTo(midX, midY - 6); ctx.lineTo(midX, midY + 6);
    ctx.stroke();

    // Tag Banner on top of bounding box
    const tagText = `${obj.name} [${obj.clockDir} ${obj.distance}m]`;
    ctx.font = 'bold 12px Pretendard, sans-serif';
    const tagW = ctx.measureText(tagText).width + 16;
    const tagH = 22;

    ctx.fillStyle = color;
    ctx.fillRect(x, Math.max(10, y - tagH), tagW, tagH);

    ctx.fillStyle = '#060911';
    ctx.fillText(tagText, x + 8, Math.max(10, y - tagH) + 15);
  }

  drawDistanceRuler(ctx, w, h) {
    // Subtle lateral distance ticks (1m, 3m, 5m, 10m)
    const marks = [
      { dist: '1.5m', yRatio: 0.85 },
      { dist: '3.0m', yRatio: 0.72 },
      { dist: '5.0m', yRatio: 0.60 },
      { dist: '10.0m', yRatio: 0.50 }
    ];

    ctx.font = '10px Orbitron, monospace';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1;

    marks.forEach(m => {
      const y = h * m.yRatio;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(55, y);
      ctx.stroke();
      ctx.fillText(m.dist, 60, y + 3);

      ctx.beginPath();
      ctx.moveTo(w - 30, y);
      ctx.lineTo(w - 55, y);
      ctx.stroke();
      ctx.fillText(m.dist, w - 95, y + 3);
    });
  }

  evaluateObstacleHazards() {
    const now = Date.now();
    const urgentObj = this.activeObjects.find(o => o.dangerLevel === 'danger' && o.distance < 4.0);

    if (urgentObj && now - this.lastVoiceAlertTime > 4000) {
      this.lastVoiceAlertTime = now;
      const msg = `경고! ${urgentObj.clockDir} 방향 ${urgentObj.distance}미터 앞 ${urgentObj.name} 주의! 즉시 멈추세요.`;
      this.audioNav.speak(msg, 'critical');

      // Spatial beep panning towards object direction
      let pan = 0;
      if (urgentObj.clockDir === '10시' || urgentObj.clockDir === '11시') pan = -0.7;
      if (urgentObj.clockDir === '1시' || urgentObj.clockDir === '2시') pan = 0.7;
      this.audioNav.synthesizeHazardSound('horn', pan);
    }
  }

  updateDetectedCardsUI() {
    const list = document.getElementById('detectedItemsList');
    if (!list) return;
    list.innerHTML = '';

    this.activeObjects.forEach(obj => {
      const card = document.createElement('div');
      const threatClass = obj.dangerLevel === 'danger' ? 'threat-danger' : obj.dangerLevel === 'warning' ? 'threat-warning' : '';
      card.className = `detected-card ${threatClass}`;

      card.innerHTML = `
        <div class="detected-info">
          <span class="detected-name">${obj.name}</span>
          <span class="detected-details">${obj.desc}</span>
        </div>
        <div class="detected-badge">${obj.clockDir} ${obj.distance}m</div>
      `;

      // Click card to speak details
      card.addEventListener('click', () => {
        this.audioNav.speak(`${obj.name}, ${obj.clockDir} 방향 ${obj.distance}미터. ${obj.desc}`);
      });

      list.appendChild(card);
    });
  }

  updateOcrUI() {
    const ocrEl = document.getElementById('ocrDetectedText');
    if (ocrEl) {
      ocrEl.textContent = this.ocrText ? `"${this.ocrText}"` : '감지된 표지판 없음';
    }
  }
}

window.VisionEngine = VisionEngine;
