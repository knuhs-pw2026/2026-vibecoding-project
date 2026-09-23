/**
 * scenarios.js - Outdoor walking presets & dynamic procedural environment renderer
 * EyeGlass AI Navigation System
 */

const SCENARIOS = {
  sidewalk: {
    id: 'sidewalk',
    title: '시나리오 1: 도심 인도 보행 (장애물 회피)',
    mainGuidance: '전방 안전 보행 경로 진행 중',
    subGuidance: '12시 방향 직진 경로가 확보되었습니다. 5m 전방 좌측 볼라드 주의',
    distanceText: '직진 45m',
    statusType: 'safe',
    ocrText: 'CU 편의점 10m 앞 우측',
    objects: [
      {
        id: 'obj_braille',
        name: '점자블록 (안전 유도선)',
        type: 'braille',
        distance: 1.2,
        clockDir: '12시',
        dangerLevel: 'info',
        box: { x: 0.42, y: 0.65, w: 0.16, h: 0.32 },
        color: '#00ff9d',
        desc: '중앙 점자블록 일치'
      },
      {
        id: 'obj_bollard',
        name: '차량진입방지 볼라드',
        type: 'obstacle',
        distance: 2.8,
        clockDir: '11시',
        dangerLevel: 'warning',
        box: { x: 0.28, y: 0.52, w: 0.08, h: 0.25 },
        color: '#ffaa00',
        desc: '좌측 60cm 편향 보행 권장'
      },
      {
        id: 'obj_kickboard',
        name: '불법 방치 전동킥보드',
        type: 'obstacle',
        distance: 5.4,
        clockDir: '10시',
        dangerLevel: 'warning',
        box: { x: 0.18, y: 0.56, w: 0.14, h: 0.22 },
        color: '#ffaa00',
        desc: '인도 좌측 가장자리 방치'
      },
      {
        id: 'obj_tree',
        name: '가로수 화단 턱',
        type: 'structure',
        distance: 6.8,
        clockDir: '2시',
        dangerLevel: 'info',
        box: { x: 0.72, y: 0.46, w: 0.15, h: 0.4 },
        color: '#00f0ff',
        desc: '우측 가로수 및 돌출 턱'
      },
      {
        id: 'obj_pedestrian',
        name: '전방 맞은편 보행자',
        type: 'person',
        distance: 8.5,
        clockDir: '12시',
        dangerLevel: 'info',
        box: { x: 0.46, y: 0.44, w: 0.09, h: 0.28 },
        color: '#00f0ff',
        desc: '정면 서행 접근 중'
      }
    ],
    sounds: [
      {
        id: 'snd_ped_chatter',
        name: '주변 보행자 대화 및 발소리',
        type: 'ambient',
        angle: 45, // degrees: 0=front, 90=right, 180=rear, 270=left
        distance: 4.5,
        db: 52,
        alertMsg: '우측 전방 보행자 무리 이동 중',
        priority: 'low'
      },
      {
        id: 'snd_traffic_low',
        name: '차도 주행 차량 소음',
        type: 'traffic',
        angle: 280,
        distance: 12.0,
        db: 62,
        alertMsg: '좌측 차도 차량 서행 통과',
        priority: 'low'
      }
    ]
  },

  crosswalk: {
    id: 'crosswalk',
    title: '시나리오 2: 횡단보도 신호 대기 및 안전 횡단',
    mainGuidance: '보행 신호등 초록불 (잔여 18초)',
    subGuidance: '신호등이 녹색으로 바뀌었습니다. 음향신호기 안내에 따라 직진하세요.',
    distanceText: '횡단보도 14m',
    statusType: 'safe',
    ocrText: '강남대로 횡단보도 (8차선 도로)',
    trafficState: {
      color: 'green',
      countdown: 18,
      soundBeacon: true
    },
    objects: [
      {
        id: 'obj_light_green',
        name: '보행 신호등 [녹색 신호 🟢]',
        type: 'traffic_light',
        distance: 12.0,
        clockDir: '12시',
        dangerLevel: 'info',
        box: { x: 0.48, y: 0.22, w: 0.07, h: 0.20 },
        color: '#00ff9d',
        desc: '잔여 18초 • 안전 보행 가능'
      },
      {
        id: 'obj_crosswalk_stripes',
        name: '횡단보도 흰색 유도선',
        type: 'crosswalk',
        distance: 1.5,
        clockDir: '12시',
        dangerLevel: 'info',
        box: { x: 0.25, y: 0.62, w: 0.50, h: 0.38 },
        color: '#00f0ff',
        desc: '정중앙 직선 보행로 유지'
      },
      {
        id: 'obj_waiting_car',
        name: '정지선 대기 승용차',
        type: 'vehicle',
        distance: 7.2,
        clockDir: '10시',
        dangerLevel: 'info',
        box: { x: 0.12, y: 0.48, w: 0.22, h: 0.25 },
        color: '#00f0ff',
        desc: '차량 완전 정지 확인됨'
      }
    ],
    sounds: [
      {
        id: 'snd_crosswalk_beacon',
        name: '시각장애인용 횡단보도 음향신호기',
        type: 'beacon',
        angle: 5,
        distance: 12.0,
        db: 74,
        alertMsg: '🔊 삐- 뻐- 음향신호기 유도음 울림 중',
        priority: 'high'
      }
    ]
  },

  danger: {
    id: 'danger',
    title: '시나리오 3: 돌발 위험 (우측 자전거 + 후방 차량 경적)',
    mainGuidance: '긴급! 즉시 보행을 멈추고 제자리에 서세요!',
    subGuidance: '우측 전방 자전거 급접근 중 및 후방 차량 경적 감지',
    distanceText: '정지 권고 0m',
    statusType: 'danger',
    ocrText: '⚠️ 위험 구역 감지',
    urgentAlert: '🚨 2시 방향 자전거 2.5m 급접근! 좌측 후방 4m 차량 경적!',
    objects: [
      {
        id: 'obj_fast_bike',
        name: '급가속 전동 자전거',
        type: 'hazard',
        distance: 2.5,
        clockDir: '2시',
        dangerLevel: 'danger',
        box: { x: 0.68, y: 0.48, w: 0.22, h: 0.38 },
        color: '#ff3366',
        desc: '속도 24km/h • 충돌 위험 최고'
      },
      {
        id: 'obj_approaching_car',
        name: '후방 접근 택시',
        type: 'hazard',
        distance: 4.0,
        clockDir: '8시',
        dangerLevel: 'danger',
        box: { x: 0.05, y: 0.50, w: 0.20, h: 0.30 },
        color: '#ff3366',
        desc: '경적 울림 지속'
      }
    ],
    sounds: [
      {
        id: 'snd_bike_bell',
        name: '자전거 경고 벨 (따릉따릉!)',
        type: 'bell',
        angle: 65,
        distance: 2.8,
        db: 84,
        alertMsg: '🔔 2시 방향 자전거 벨 소리 감지!',
        priority: 'critical'
      },
      {
        id: 'snd_car_horn',
        name: '차량 경적 소리 (빵-빵!)',
        type: 'horn',
        angle: 240,
        distance: 4.2,
        db: 92,
        alertMsg: '🚗 좌측 후방 강한 차량 경적 발생!',
        priority: 'critical'
      }
    ]
  },

  construction: {
    id: 'construction',
    title: '시나리오 4: 인도 공사 구간 (우회 안전로 유도)',
    mainGuidance: '전방 공사 구간 진입 금지 - 우측 2시 방향 우회',
    subGuidance: '보도 굴착 공사 중입니다. 임시 점자 매트를 따라 우측으로 이동하세요.',
    distanceText: '우회전 6m',
    statusType: 'warning',
    ocrText: '보도블록 정비공사 안내 (보행자 우회)',
    objects: [
      {
        id: 'obj_barrier',
        name: '공사 안전 차단벽 & 펜스',
        type: 'obstacle',
        distance: 5.0,
        clockDir: '12시',
        dangerLevel: 'danger',
        box: { x: 0.32, y: 0.38, w: 0.36, h: 0.42 },
        color: '#ff3366',
        desc: '직진로 완전 차단됨'
      },
      {
        id: 'obj_excavator',
        name: '소형 굴착기 및 장비',
        type: 'hazard',
        distance: 8.5,
        clockDir: '11시',
        dangerLevel: 'warning',
        box: { x: 0.20, y: 0.30, w: 0.25, h: 0.35 },
        color: '#ffaa00',
        desc: '작업 반경 주의'
      },
      {
        id: 'obj_safe_detour',
        name: '임시 안전 보행로 (노란색 유도선)',
        type: 'safe_route',
        distance: 2.0,
        clockDir: '2시',
        dangerLevel: 'info',
        box: { x: 0.65, y: 0.58, w: 0.28, h: 0.35 },
        color: '#00ff9d',
        desc: '임시 발판 및 안전봉 설치'
      }
    ],
    sounds: [
      {
        id: 'snd_drill_noise',
        name: '포장 굴착기 및 타설 해머 소음',
        type: 'construction',
        angle: 340,
        distance: 6.0,
        db: 82,
        alertMsg: '🚧 전방 공사 현장 중장비 소음',
        priority: 'medium'
      }
    ]
  },

  camera: {
    id: 'camera',
    title: '실시간 사용자 웹캠 & 마이크 감지 모드',
    mainGuidance: '실시간 카메라 및 마이크 센서 활성화',
    subGuidance: '카메라 전방을 비추면 AI 비전 인식 및 마이크 사운드 분석이 실행됩니다.',
    distanceText: '실시간 탐색',
    statusType: 'safe',
    ocrText: '실시간 렌즈 전방 스캔 중...',
    objects: [
      {
        id: 'obj_cam_center',
        name: '전방 실시간 보행 경로',
        type: 'route',
        distance: 1.8,
        clockDir: '12시',
        dangerLevel: 'info',
        box: { x: 0.35, y: 0.55, w: 0.30, h: 0.35 },
        color: '#00ff9d',
        desc: '카메라 중앙 영역 스캔'
      }
    ],
    sounds: []
  }
};

/**
 * Procedural Dynamic Canvas Renderer
 * Draws realistic 3D street perspective walk simulation
 */
class SimulationRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stepOffset = 0;
    this.lastTime = performance.now();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  render(scenarioKey, time) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // Advance walking simulation step cycle
    this.stepOffset = (this.stepOffset + dt * 1.5) % 1;

    // Clear
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, w, h);

    // Horizon line
    const horizonY = h * 0.46;
    const vanishingX = w * 0.5;

    // 1. Sky & City Skyline
    this.drawSkyline(ctx, w, horizonY, time);

    // 2. Road & Sidewalk Perspective Ground
    this.drawGround(ctx, w, h, horizonY, vanishingX, scenarioKey);

    // 3. Scenario specific street elements
    if (scenarioKey === 'sidewalk') {
      this.drawSidewalkScene(ctx, w, h, horizonY, vanishingX, time);
    } else if (scenarioKey === 'crosswalk') {
      this.drawCrosswalkScene(ctx, w, h, horizonY, vanishingX, time);
    } else if (scenarioKey === 'danger') {
      this.drawDangerScene(ctx, w, h, horizonY, vanishingX, time);
    } else if (scenarioKey === 'construction') {
      this.drawConstructionScene(ctx, w, h, horizonY, vanishingX, time);
    }

    // 4. Glasses Head-Bobbing Camera Effect (Micro walk bob)
    // subtle ambient lighting vignette
    const grad = ctx.createRadialGradient(w/2, h/2, h * 0.3, w/2, h/2, Math.max(w, h) * 0.7);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.01)');
    grad.addColorStop(1, 'rgba(4, 7, 14, 0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  drawSkyline(ctx, w, horizonY, time) {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, '#0a1428');
    skyGrad.addColorStop(0.7, '#13223f');
    skyGrad.addColorStop(1, '#243b68');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY);

    // Distant buildings
    ctx.fillStyle = '#101d36';
    const buildingWidths = [60, 90, 70, 110, 80, 95, 75, 120, 85, 100, 130];
    let curX = 0;
    let bIdx = 0;
    while (curX < w) {
      const bw = buildingWidths[bIdx % buildingWidths.length];
      const bh = 70 + ((bIdx * 47) % 130);
      ctx.fillRect(curX, horizonY - bh, bw, bh);

      // Building windows
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      for (let wy = horizonY - bh + 10; wy < horizonY - 10; wy += 14) {
        for (let wx = curX + 8; wx < curX + bw - 8; wx += 12) {
          if ((wx + wy + bIdx) % 3 === 0) {
            ctx.fillRect(wx, wy, 5, 7);
          }
        }
      }
      ctx.fillStyle = '#101d36';
      curX += bw + 8;
      bIdx++;
    }
  }

  drawGround(ctx, w, h, horizonY, vanishingX, scenarioKey) {
    // Street Road on Left
    ctx.fillStyle = '#181e28';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w * 0.32, h);
    ctx.lineTo(vanishingX - 20, horizonY);
    ctx.lineTo(0, horizonY);
    ctx.fill();

    // Road lane dashed stripes
    ctx.strokeStyle = '#f0c040';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 18]);
    ctx.beginPath();
    ctx.moveTo(w * 0.16, h);
    ctx.lineTo(vanishingX - 80, horizonY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sidewalk on Right & Center
    ctx.fillStyle = '#2b3342';
    ctx.beginPath();
    ctx.moveTo(w * 0.32, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, horizonY);
    ctx.lineTo(vanishingX - 20, horizonY);
    ctx.fill();

    // Sidewalk Curb Stone line
    ctx.strokeStyle = '#5a687f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.32, h);
    ctx.lineTo(vanishingX - 20, horizonY);
    ctx.stroke();

    // Braille Block Line (Yellow Tactile paving for blind navigation)
    // Perspective trapezoid in sidewalk center
    ctx.fillStyle = '#d4aa00';
    ctx.beginPath();
    ctx.moveTo(w * 0.44, h);
    ctx.lineTo(w * 0.58, h);
    ctx.lineTo(vanishingX + 25, horizonY);
    ctx.lineTo(vanishingX + 8, horizonY);
    ctx.fill();

    // Braille block tactile dot texture stripes
    ctx.strokeStyle = '#ffe640';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const p = (i / 8 + this.stepOffset * 0.125) % 1;
      const y = horizonY + (h - horizonY) * (p * p); // quadratic perspective
      const bx1 = (vanishingX + 8) + (w * 0.44 - (vanishingX + 8)) * p;
      const bx2 = (vanishingX + 25) + (w * 0.58 - (vanishingX + 25)) * p;
      ctx.beginPath();
      ctx.moveTo(bx1, y);
      ctx.lineTo(bx2, y);
      ctx.stroke();
    }
  }

  drawSidewalkScene(ctx, w, h, horizonY, vanishingX, time) {
    // 1. Street Lamp / Trees on right
    ctx.fillStyle = '#3a4b35';
    ctx.fillRect(w * 0.76, h * 0.38, 22, h * 0.42);
    ctx.beginPath();
    ctx.arc(w * 0.77, h * 0.34, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#2d5a27';
    ctx.fill();

    // 2. Bollard at 11 o'clock
    const bx = w * 0.35;
    const by = h * 0.72;
    ctx.fillStyle = '#8f9ba8';
    ctx.fillRect(bx, by - 55, 18, 55);
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(bx, by - 45, 18, 10);
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(bx + 9, by - 55, 9, Math.PI, 0);
    ctx.fill();

    // 3. Electric Kickboard parked at 10 o'clock
    const kx = w * 0.22;
    const ky = h * 0.68;
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(kx, ky);
    ctx.lineTo(kx + 14, ky - 60);
    ctx.lineTo(kx + 35, ky - 58);
    ctx.stroke();
    // wheels
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(kx, ky, 8, 0, Math.PI * 2);
    ctx.arc(kx + 40, ky + 4, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCrosswalkScene(ctx, w, h, horizonY, vanishingX, time) {
    // White Zebra Stripes on Road
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 7; i++) {
      const y = horizonY + (h - horizonY) * (0.35 + i * 0.08);
      const stripeH = 12 + i * 4;
      ctx.fillRect(w * 0.28, y, w * 0.44, stripeH);
    }

    // Traffic Light Pole at 12 o'clock
    const poleX = vanishingX + 45;
    const poleY = horizonY - 140;
    ctx.fillStyle = '#333e4c';
    ctx.fillRect(poleX, poleY, 12, 140);
    ctx.fillRect(poleX - 25, poleY, 60, 48);

    // Red Light & Green Light
    const isGreen = true;
    ctx.fillStyle = '#3a1111';
    ctx.beginPath();
    ctx.arc(poleX - 8, poleY + 24, 10, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Green light
    ctx.fillStyle = '#00ff9d';
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(poleX + 18, poleY + 24, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Green pedestrian walking icon silhouette
    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.arc(poleX + 18, poleY + 18, 3, 0, Math.PI * 2);
    ctx.rect(poleX + 16, poleY + 22, 4, 7);
    ctx.fill();
  }

  drawDangerScene(ctx, w, h, horizonY, vanishingX, time) {
    // Bicycle rapidly approaching from 2 o'clock
    const bikeX = w * 0.72;
    const bikeY = h * 0.65;

    // Wheels
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(bikeX - 25, bikeY, 24, 0, Math.PI * 2);
    ctx.arc(bikeX + 35, bikeY, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Frame
    ctx.beginPath();
    ctx.moveTo(bikeX - 25, bikeY);
    ctx.lineTo(bikeX, bikeY - 35);
    ctx.lineTo(bikeX + 35, bikeY);
    ctx.lineTo(bikeX + 15, bikeY - 45);
    ctx.stroke();

    // Cyclist
    ctx.fillStyle = '#ff3366';
    ctx.beginPath();
    ctx.arc(bikeX + 5, bikeY - 58, 12, 0, Math.PI * 2);
    ctx.fill();

    // Speed lines
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(bikeX + 50 + i * 15, bikeY - 30 + i * 10);
      ctx.lineTo(bikeX + 90 + i * 15, bikeY - 30 + i * 10);
      ctx.stroke();
    }
  }

  drawConstructionScene(ctx, w, h, horizonY, vanishingX, time) {
    // Orange/White diagonal barrier fence at 12 o'clock
    const barX = w * 0.38;
    const barY = h * 0.48;
    const barW = w * 0.28;
    const barH = 70;

    ctx.fillStyle = '#e65100';
    ctx.fillRect(barX, barY, barW, barH);

    // Hazard stripes
    ctx.fillStyle = '#ffffff';
    for (let x = barX - 20; x < barX + barW; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, barY);
      ctx.lineTo(x + 15, barY);
      ctx.lineTo(x - 5, barY + barH);
      ctx.lineTo(x - 20, barY + barH);
      ctx.fill();
    }

    // Flashing warning beacon
    const flash = Math.sin(time * 0.01) > 0;
    ctx.fillStyle = flash ? '#ffaa00' : '#442200';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = flash ? 25 : 0;
    ctx.beginPath();
    ctx.arc(barX + barW * 0.5, barY - 10, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Detour Arrow Sign (Pointing Right)
    ctx.fillStyle = '#00ff9d';
    ctx.beginPath();
    const ax = w * 0.70;
    const ay = h * 0.60;
    ctx.moveTo(ax, ay - 20);
    ctx.lineTo(ax + 35, ay);
    ctx.lineTo(ax, ay + 20);
    ctx.lineTo(ax, ay + 8);
    ctx.lineTo(ax - 30, ay + 8);
    ctx.lineTo(ax - 30, ay - 8);
    ctx.lineTo(ax, ay - 8);
    ctx.fill();
  }
}

window.SCENARIOS = SCENARIOS;
window.SimulationRenderer = SimulationRenderer;
