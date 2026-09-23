/**
 * particles.js - 비커 내부 화학 반응 Canvas 시각화 엔진
 * 액체 표면, 기포, 침전물, 불꽃, 연기 파티클 물리 렌더링
 */

class LabCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // 비커 형상 파라미터 (원추형 플라스크 / 비커 비율)
    this.beaker = {
      x: 70,
      y: 50,
      width: 260,
      height: 360,
      bottomRadius: 16,
      neckWidth: 200,
      lipWidth: 220
    };

    // 액체 상태
    this.targetFill = 0;       // 0 ~ 1
    this.currentFill = 0;
    this.targetColor = 'rgba(235, 245, 255, 0.2)';
    this.currentColor = 'rgba(235, 245, 255, 0.2)';
    this.wavePhase = 0;

    // 파티클 컬렉션
    this.bubbles = [];
    this.precipitates = [];
    this.sparks = [];
    this.smoke = [];
    this.flashAlpha = 0;
    this.flashColor = '#ffffff';

    // 활성 이펙트 모드
    this.effectConfig = {
      bubbles: 'none',
      precipitate: null,
      precipitateColor: '#ffffff',
      flame: null,
      smoke: null
    };

    this.sedimentHeight = 0;
    this.targetSedimentHeight = 0;
    this.sedimentColor = '#ffffff';

    this.isRunning = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;

    // 화면 비율에 맞춘 비커 좌표 자동 재계산
    const paddingX = Math.max(30, this.width * 0.15);
    const beakerW = this.width - paddingX * 2;
    const beakerH = Math.min(this.height * 0.72, 380);
    const beakerY = this.height * 0.18;

    this.beaker = {
      x: paddingX,
      y: beakerY,
      width: beakerW,
      height: beakerH,
      bottomRadius: 18,
      neckWidth: beakerW * 0.88,
      lipWidth: beakerW * 0.95
    };
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }
  }

  setLiquid(fillRatio, color) {
    this.targetFill = Math.min(Math.max(fillRatio, 0), 0.88);
    this.targetColor = color;
  }

  setEffect(config) {
    this.effectConfig = { ...this.effectConfig, ...config };
    if (config.precipitate) {
      this.targetSedimentHeight = 22;
      this.sedimentColor = config.precipitateColor || '#ffffff';
    } else {
      this.targetSedimentHeight = 0;
    }

    if (config.flame === 'explosion_blast' || config.flame === 'blinding_white') {
      this.flashAlpha = 0.9;
      this.flashColor = config.flame === 'blinding_white' ? '#ffffff' : '#fef08a';
    }
  }

  reset() {
    this.targetFill = 0;
    this.currentFill = 0;
    this.bubbles = [];
    this.precipitates = [];
    this.sparks = [];
    this.smoke = [];
    this.sedimentHeight = 0;
    this.targetSedimentHeight = 0;
    this.flashAlpha = 0;
    this.effectConfig = {
      bubbles: 'none',
      precipitate: null,
      precipitateColor: '#ffffff',
      flame: null,
      smoke: null
    };
  }

  // 액체 색상 파싱 및 LERP 보간
  lerpColor(c1, c2, factor) {
    // 단순화된 rgba 보간
    return c2; // 부드러운 전환을 위해 CSS 트랜지션 및 캔버스 혼합 활용
  }

  update() {
    // 액체 레벨 부드러운 접근
    this.currentFill += (this.targetFill - this.currentFill) * 0.08;
    this.sedimentHeight += (this.targetSedimentHeight - this.sedimentHeight) * 0.04;
    this.wavePhase += 0.05;

    if (this.flashAlpha > 0) {
      this.flashAlpha -= 0.04;
      if (this.flashAlpha < 0) this.flashAlpha = 0;
    }

    const liquidBottom = this.beaker.y + this.beaker.height;
    const liquidTop = liquidBottom - (this.beaker.height * this.currentFill);
    const b = this.beaker;

    // 1. 기포 발생 로직
    if (this.currentFill > 0.05 && this.effectConfig.bubbles !== 'none') {
      let spawnRate = 0;
      let maxSpeed = 2;
      switch (this.effectConfig.bubbles) {
        case 'light': spawnRate = 0.2; maxSpeed = 2.0; break;
        case 'steady': spawnRate = 0.5; maxSpeed = 3.0; break;
        case 'rapid': spawnRate = 1.2; maxSpeed = 4.5; break;
        case 'violent': spawnRate = 2.5; maxSpeed = 6.0; break;
        case 'effervescent': spawnRate = 2.8; maxSpeed = 5.0; break;
      }

      for (let i = 0; i < spawnRate; i++) {
        if (Math.random() < spawnRate) {
          const spawnX = b.x + 20 + Math.random() * (b.width - 40);
          this.bubbles.push({
            x: spawnX,
            y: liquidBottom - 10 - Math.random() * 20,
            radius: 2 + Math.random() * 5,
            speedY: 1.5 + Math.random() * maxSpeed,
            wobble: Math.random() * Math.PI * 2,
            alpha: 0.8
          });
        }
      }
    }

    // 기포 업데이트
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const p = this.bubbles[i];
      p.y -= p.speedY;
      p.wobble += 0.1;
      p.x += Math.sin(p.wobble) * 0.8;
      
      // 수면에 닿으면 터짐
      if (p.y <= liquidTop) {
        this.bubbles.splice(i, 1);
      }
    }

    // 2. 침전물 파티클
    if (this.effectConfig.precipitate && this.currentFill > 0.1) {
      if (Math.random() < 0.6) {
        this.precipitates.push({
          x: b.x + 25 + Math.random() * (b.width - 50),
          y: liquidTop + Math.random() * (liquidBottom - liquidTop) * 0.4,
          targetY: liquidBottom - Math.random() * Math.max(5, this.sedimentHeight),
          speedY: 0.8 + Math.random() * 1.5,
          radius: 1.5 + Math.random() * 2.5,
          color: this.effectConfig.precipitateColor || '#ffffff',
          alpha: 0.9
        });
      }
    }

    // 침전물 업데이트
    for (let i = this.precipitates.length - 1; i >= 0; i--) {
      const p = this.precipitates[i];
      if (p.y < p.targetY) {
        p.y += p.speedY;
      } else {
        p.alpha -= 0.005;
        if (p.alpha <= 0) this.precipitates.splice(i, 1);
      }
    }

    // 3. 불꽃 / 스파크
    if (this.effectConfig.flame) {
      const sparkCount = this.effectConfig.flame === 'blinding_white' ? 4 : 2;
      for (let i = 0; i < sparkCount; i++) {
        const originX = b.x + b.width * 0.5 + (Math.random() - 0.5) * 60;
        const originY = Math.max(liquidTop, b.y + 100);
        this.sparks.push({
          x: originX,
          y: originY,
          vx: (Math.random() - 0.5) * 6,
          vy: -3 - Math.random() * 5,
          radius: 2 + Math.random() * 3,
          color: this.effectConfig.flame === 'blinding_white' ? '#ffffff' : (Math.random() > 0.5 ? '#f59e0b' : '#ef4444'),
          life: 1.0,
          decay: 0.03 + Math.random() * 0.04
        });
      }
    }

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.15; // 중력
      s.life -= s.decay;
      if (s.life <= 0) this.sparks.splice(i, 1);
    }

    // 4. 연기 / 증기
    if (this.effectConfig.smoke) {
      if (Math.random() < 0.35) {
        this.smoke.push({
          x: b.x + b.width * 0.5 + (Math.random() - 0.5) * (b.width * 0.5),
          y: liquidTop - 5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -1.2 - Math.random() * 1.5,
          radius: 8 + Math.random() * 12,
          maxRadius: 28 + Math.random() * 20,
          alpha: 0.45,
          decay: 0.008 + Math.random() * 0.008
        });
      }
    }

    for (let i = this.smoke.length - 1; i >= 0; i--) {
      const sm = this.smoke[i];
      sm.x += sm.vx;
      sm.y += sm.vy;
      sm.radius += 0.3;
      sm.alpha -= sm.decay;
      if (sm.alpha <= 0) this.smoke.splice(i, 1);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const b = this.beaker;

    // 비커 내부 클리핑 패스 생성 (액체가 유리 벽을 벗어나지 않도록)
    this.ctx.save();
    this.createBeakerClipPath(this.ctx, b);
    this.ctx.clip();

    // 1. 비커 내부 배경 틴트 (유리 투명도)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.fillRect(b.x, b.y, b.width, b.height);

    // 2. 액체 렌더링
    if (this.currentFill > 0.01) {
      const liquidBottom = b.y + b.height;
      const liquidHeight = b.height * this.currentFill;
      const liquidTop = liquidBottom - liquidHeight;

      // 액체 그라데이션 본체
      const grad = this.ctx.createLinearGradient(0, liquidTop, 0, liquidBottom);
      grad.addColorStop(0, this.targetColor);
      grad.addColorStop(1, this.targetColor);
      this.ctx.fillStyle = grad;

      this.ctx.beginPath();
      this.ctx.moveTo(b.x - 10, liquidBottom);
      this.ctx.lineTo(b.x - 10, liquidTop);

      // 표면 파동 (Sine wave)
      const waveAmp = Math.min(4, this.currentFill * 6);
      const step = 20;
      for (let x = b.x - 10; x <= b.x + b.width + 10; x += step) {
        const y = liquidTop + Math.sin(this.wavePhase + x * 0.03) * waveAmp;
        this.ctx.lineTo(x, y);
      }
      this.ctx.lineTo(b.x + b.width + 10, liquidBottom);
      this.ctx.closePath();
      this.ctx.fill();

      // 수면 반사 하이라이트 라인
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      // 앙금 퇴적층 (Sediment on bottom)
      if (this.sedimentHeight > 0.5) {
        this.ctx.fillStyle = this.sedimentColor;
        this.ctx.beginPath();
        this.ctx.ellipse(
          b.x + b.width * 0.5,
          liquidBottom - 4,
          b.width * 0.42,
          this.sedimentHeight * 0.5 + 4,
          0, 0, Math.PI * 2
        );
        this.ctx.fill();
      }

      // 기포 그리기
      for (const p of this.bubbles) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
        this.ctx.fill();
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }

      // 침전물 파티클 그리기
      for (const p of this.precipitates) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }
    }

    this.ctx.restore(); // 클립 해제

    // 3. 비커 유리 외형 및 눈금선 그리기
    this.drawBeakerGlass(this.ctx, b);

    // 4. 연기/증기 (비커 바깥까지 피어오름)
    for (const sm of this.smoke) {
      this.ctx.beginPath();
      this.ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(240, 240, 250, ${sm.alpha})`;
      this.ctx.fill();
    }

    // 5. 스파크/불꽃 파티클 (발광 효과 포함)
    if (this.sparks.length > 0) {
      this.ctx.save();
      this.ctx.shadowBlur = 12;
      for (const s of this.sparks) {
        this.ctx.shadowColor = s.color;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);
        this.ctx.fillStyle = s.color;
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // 6. 섬광 플래시 (화면 전체 번쩍임)
    if (this.flashAlpha > 0) {
      this.ctx.fillStyle = this.flashColor;
      this.ctx.globalAlpha = this.flashAlpha;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.globalAlpha = 1.0;
    }
  }

  createBeakerClipPath(ctx, b) {
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x, b.y + b.height - b.bottomRadius);
    ctx.quadraticCurveTo(b.x, b.y + b.height, b.x + b.bottomRadius, b.y + b.height);
    ctx.lineTo(b.x + b.width - b.bottomRadius, b.y + b.height);
    ctx.quadraticCurveTo(b.x + b.width, b.y + b.height, b.x + b.width, b.y + b.height - b.bottomRadius);
    ctx.lineTo(b.x + b.width, b.y);
    ctx.closePath();
  }

  drawBeakerGlass(ctx, b) {
    ctx.save();

    // 비커 테두리 유리 라인 (글래스모피즘 네온 테두리)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    // 왼쪽 상단 주둥이(Pouring Lip)
    ctx.moveTo(b.x - 8, b.y - 4);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(b.x, b.y + b.height - b.bottomRadius);
    ctx.quadraticCurveTo(b.x, b.y + b.height, b.x + b.bottomRadius, b.y + b.height);
    ctx.lineTo(b.x + b.width - b.bottomRadius, b.y + b.height);
    ctx.quadraticCurveTo(b.x + b.width, b.y + b.height, b.x + b.width, b.y + b.height - b.bottomRadius);
    ctx.lineTo(b.x + b.width, b.y);
    ctx.lineTo(b.x + b.width + 6, b.y - 2);
    ctx.stroke();

    // 상단 림(Rim) 입체 광택선
    ctx.beginPath();
    ctx.ellipse(b.x + b.width * 0.5, b.y, b.width * 0.5, 8, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // 비커 왼쪽 유리의 세로 하이라이트 빛반사
    ctx.beginPath();
    ctx.moveTo(b.x + 8, b.y + 20);
    ctx.lineTo(b.x + 8, b.y + b.height - 30);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 눈금선 및 ml 단위 레이블 (과학 실험실 디테일)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    const tickSteps = [
      { label: '500ml', ratio: 0.8 },
      { label: '400ml', ratio: 0.65 },
      { label: '300ml', ratio: 0.5 },
      { label: '200ml', ratio: 0.35 },
      { label: '100ml', ratio: 0.2 }
    ];

    for (const tick of tickSteps) {
      const tickY = b.y + b.height - (b.height * tick.ratio);
      ctx.beginPath();
      ctx.moveTo(b.x + b.width - 24, tickY);
      ctx.lineTo(b.x + b.width - 6, tickY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillText(tick.label, b.x + b.width - 30, tickY + 3);
    }

    ctx.restore();
  }

  loop() {
    if (this.isRunning) {
      this.update();
      this.draw();
      requestAnimationFrame(this.loop);
    }
  }
}
