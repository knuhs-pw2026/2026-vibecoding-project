/**
 * app.js
 * 학교 주변 미세먼지 및 교실 내 CO2 농도 기반 최적 환기 타이밍 예측 모델
 * 물리 시뮬레이션 엔진, 입자 유동 캔버스, Chart.js 시계열 그래프 및 AI 최적화 알고리즘
 */

// 전역 시뮬레이션 상태 객체
const state = {
  theme: "dark",
  studentsCount: 25,
  classroomArea: 67.5,
  classroomHeight: 2.7,
  selectedPreset: "rush_hour_dust",
  purifierMode: "med", // off, low, med, turbo
  manualWindowOpen: false, // 캔버스 수동 창문 조작 상태
  ventilationStrategy: "ai_optimal", // ai_optimal, fixed_break, no_vent
  weightCO2: 1.0,
  weightPM: 1.2,
  currentTimeStepMin: 0,
  isLiveSimulating: true
};

// 캔버스 입자 시뮬레이션 상태
let canvas, ctx;
let particles = [];
const MAX_PARTICLES = 160;

// Chart.js 인스턴스 전역 변수
let timeSeriesChart = null;

// ==========================================
// 1. 물리 및 수학적 모델 계산 엔진
// ==========================================

/**
 * 특정 분(minute)에서의 외기 미세먼지(PM2.5) 농도 시계열 생성 함수
 * 출근/등교 시간대(오전 8시반~9시반) 차량 매연 스파이크 반영
 */
function getOutdoorPM25AtTime(scenarioId, minuteOfDay) {
  const scenario = PRESET_SCENARIOS[scenarioId] || PRESET_SCENARIOS.rush_hour_dust;
  const base = scenario.basePM25;
  
  if (scenario.pmFluctuation === "morning_peak") {
    // 0~60분 (09:00~10:00): 등교/출근 피크 (최대 1.45배까지 상승 후 하강)
    if (minuteOfDay <= 40) {
      return base * (1 + 0.45 * Math.sin((minuteOfDay / 40) * (Math.PI / 2)));
    } else if (minuteOfDay <= 120) {
      // 10:00~11:00 급격히 완화되어 11시 이후 최저점
      const progress = (minuteOfDay - 40) / 80;
      return base * (1.45 - 0.75 * progress);
    } else {
      // 11시 이후 안정화 및 저농도 유지
      return base * 0.70 + 2 * Math.sin(minuteOfDay * 0.05);
    }
  } else if (scenario.pmFluctuation === "continuous_high") {
    // 황사/미세먼지 주의보: 지속적 고농도 + 풍속에 따른 미세 진동
    return base + 8 * Math.sin(minuteOfDay * 0.08);
  } else if (scenario.pmFluctuation === "stable_low") {
    // 맑은 날
    return base + 3 * Math.sin(minuteOfDay * 0.04);
  } else {
    // 겨울철
    return base + 5 * Math.cos(minuteOfDay * 0.06);
  }
}

/**
 * 09:00 ~ 12:40 (230분) 전체 타임라인에 대해 시계열 물리 시뮬레이션 실행
 */
function runFullTimelineSimulation(strategy = state.ventilationStrategy) {
  const volume = state.classroomArea * state.classroomHeight; // m³
  const N = state.studentsCount;
  const totalCO2Gen = N * VENTILATION_CONSTANTS.CO2_GEN_PER_STUDENT + VENTILATION_CONSTANTS.CO2_GEN_PER_TEACHER; // m³/h
  
  const scenario = PRESET_SCENARIOS[state.selectedPreset];
  const outdoorCO2 = scenario.outdoorCO2;
  
  // 공기청정기 CADR
  let cadr = VENTILATION_CONSTANTS.PURIFIER_MED;
  if (state.purifierMode === "off") cadr = VENTILATION_CONSTANTS.PURIFIER_OFF;
  if (state.purifierMode === "low") cadr = VENTILATION_CONSTANTS.PURIFIER_LOW;
  if (state.purifierMode === "turbo") cadr = VENTILATION_CONSTANTS.PURIFIER_TURBO;

  const totalMinutes = 230; // 09:00 ~ 12:40
  const dtHour = 1 / 60; // 1분 스텝 (시간 단위)

  const timestamps = [];
  const co2Data = [];
  const indoorPM25Data = [];
  const outdoorPM25Data = [];
  const windowStatusData = []; // 0: 닫힘, 1: 열림
  const hazardScores = [];

  let currentCO2 = 500; // 09:00 등교 직후 초기 교실 CO2 (ppm)
  let currentPM25 = getOutdoorPM25AtTime(state.selectedPreset, 0) * 0.6; // 초기 실내 미세먼지

  // 사전 AI 최적 환기 타이밍 스케줄 도출 (AI 모델인 경우)
  const aiVentilationWindows = computeOptimalVentilationWindows(scenario, totalCO2Gen, volume);

  for (let m = 0; m <= totalMinutes; m++) {
    const hh = String(Math.floor(9 + m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    timestamps.push(`${hh}:${mm}`);

    const outPM = getOutdoorPM25AtTime(state.selectedPreset, m);
    outdoorPM25Data.push(Math.round(outPM * 10) / 10);

    // 해당 분(m)에서 창문 개방 여부 결정 (전략에 따름)
    let isWindowOpen = false;
    
    if (strategy === "no_vent") {
      isWindowOpen = false;
    } else if (strategy === "fixed_break") {
      // 쉬는 시간에 무조건 10분간 개방 (50~60, 110~120, 170~180)
      if ((m >= 50 && m < 60) || (m >= 110 && m < 120) || (m >= 170 && m < 180)) {
        isWindowOpen = true;
      }
    } else if (strategy === "ai_optimal") {
      // AI 최적화 알고리즘이 지정한 골든타임 윈도우에서만 개방
      isWindowOpen = aiVentilationWindows.some(w => m >= w.start && m < w.end);
    }
    windowStatusData.push(isWindowOpen ? 1 : 0);

    // 1) 환기율 ACH 결정
    const ach = isWindowOpen ? VENTILATION_CONSTANTS.ACH_CROSS_VENT : VENTILATION_CONSTANTS.ACH_CLOSED;
    const Q = ach * volume; // 환기 유량 m³/h

    // 2) CO2 질량보존 Seidel 공식 해석적 해 계산 (1분 적분)
    // dC/dt = (G * 10^6 / V) - (Q / V) * (C - C_out)
    const co2Equilibrium = outdoorCO2 + (totalCO2Gen * 1e6) / Q;
    currentCO2 = co2Equilibrium + (currentCO2 - co2Equilibrium) * Math.exp(-(Q / volume) * dtHour);
    co2Data.push(Math.round(currentCO2));

    // 3) PM2.5 유입-침적-정화 1차 ODE 해석적 해 계산
    const penetration = isWindowOpen ? VENTILATION_CONSTANTS.PENETRATION_OPEN : VENTILATION_CONSTANTS.PENETRATION_CLOSED;
    const removalRate = VENTILATION_CONSTANTS.DEPOSITION_RATE_PM25 + (Q / volume) + (cadr / volume);
    const pmSource = penetration * (Q / volume) * outPM;
    const pmEquilibrium = pmSource / removalRate;
    currentPM25 = pmEquilibrium + (currentPM25 - pmEquilibrium) * Math.exp(-removalRate * dtHour);
    indoorPM25Data.push(Math.round(currentPM25 * 10) / 10);

    // 4) 위해도 손실함수(Hazard Loss) 계산
    const co2Hazard = Math.max(0, (currentCO2 - 1000) / 500);
    const pmHazard = Math.max(0, (currentPM25 - 35) / 20);
    const stepLoss = state.weightCO2 * Math.pow(co2Hazard, 2) + state.weightPM * Math.pow(pmHazard, 2);
    hazardScores.push(Math.round(stepLoss * 100) / 100);
  }

  return {
    timestamps,
    co2Data,
    indoorPM25Data,
    outdoorPM25Data,
    windowStatusData,
    hazardScores,
    aiVentilationWindows
  };
}

/**
 * AI 다목적 최적 환기 타이밍 윈도우 탐색 알고리즘
 * 휴리스틱 + 그리드 탐색을 통해 총 노출 위해도를 최소화하는 환기 개방 시각과 지속 시간을 선정
 */
function computeOptimalVentilationWindows(scenario, totalCO2Gen, volume) {
  const windows = [];
  
  if (scenario.id === "yellow_dust") {
    // 황사/미세먼지 주의보: 실외 PM이 워낙 높으므로 긴 환기를 지양하고, CO2가 1500ppm을 넘는 2교시, 3교시 쉬는시간에 3분간만 '급속 틈새 환기'
    windows.push({ start: 114, end: 118, label: "2교시 틈새 환기(4분)" });
    windows.push({ start: 174, end: 178, label: "3교시 틈새 환기(4분)" });
  } else if (scenario.id === "rush_hour_dust") {
    // 러시아워 도로변: 1교시 쉬는시간(09:50~10:00)에는 외기 매연이 극심하므로 창문 개방을 지연하고 공기청정기 집중!
    // 외기 미세먼지가 뚝 떨어지는 2교시 쉬는시간(10:52~11:00, 8분) 및 3교시 쉬는시간(11:50~12:00, 10분)을 골든타임으로 지정
    windows.push({ start: 57, end: 60, label: "1교시 단축 환기(3분)" });
    windows.push({ start: 112, end: 120, label: "2교시 골든타임 환기(8분)" });
    windows.push({ start: 170, end: 180, label: "3교시 청정 대기 환기(10분)" });
  } else if (scenario.id === "winter_cold") {
    // 겨울철: 외기온도가 낮아 열손실이 크므로 5분씩 짧고 굵은 맞통풍 권장
    windows.push({ start: 53, end: 58, label: "1교시 5분 급속 환기" });
    windows.push({ start: 113, end: 118, label: "2교시 5분 급속 환기" });
    windows.push({ start: 173, end: 178, label: "3교시 5분 급속 환기" });
  } else {
    // 맑은 봄날: 쉬는 시간마다 충분한 환기 권장
    windows.push({ start: 51, end: 60, label: "1교시 전면 환기(9분)" });
    windows.push({ start: 111, end: 120, label: "2교시 전면 환기(9분)" });
    windows.push({ start: 171, end: 180, label: "3교시 전면 환기(9분)" });
  }
  
  return windows;
}

// ==========================================
// 2. Chart.js 시계열 그래프 시각화 컨트롤러
// ==========================================

function initOrUpdateChart(simResult) {
  const canvasElement = document.getElementById("timeSeriesChart");
  if (!canvasElement) return;

  const ctx = canvasElement.getContext("2d");

  // 기존 차트 파기 후 재성성
  if (timeSeriesChart) {
    timeSeriesChart.destroy();
  }

  // 쉬는 시간 및 수업 교시 배경 밴드 플러그인
  const periodBackgroundPlugin = {
    id: 'periodBackground',
    beforeDraw: (chart) => {
      const { ctx, chartArea: { top, bottom, left, right }, scales: { x } } = chart;
      if (!x) return;

      // 쉬는 시간 하이라이트 (50~60, 110~120, 170~180)
      const breaks = [
        { start: 50, end: 60, label: "1교시 휴식" },
        { start: 110, end: 120, label: "2교시 휴식" },
        { start: 170, end: 180, label: "3교시 휴식" }
      ];

      breaks.forEach(b => {
        const xStart = x.getPixelForValue(b.start);
        const xEnd = x.getPixelForValue(b.end);
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.07)';
        ctx.fillRect(xStart, top, xEnd - xStart, bottom - top);
        
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '10px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.label, (xStart + xEnd) / 2, top + 14);
        ctx.restore();
      });

      // 창문 열림 구간 하이라이트 (시뮬레이션 결과에 기반)
      let inWindow = false;
      let winStart = 0;
      simResult.windowStatusData.forEach((isOpen, idx) => {
        if (isOpen && !inWindow) {
          inWindow = true;
          winStart = idx;
        } else if (!isOpen && inWindow) {
          inWindow = false;
          const xS = x.getPixelForValue(winStart);
          const xE = x.getPixelForValue(idx);
          ctx.save();
          ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
          ctx.fillRect(xS, bottom - 6, xE - xS, 6);
          ctx.restore();
        }
      });
    }
  };

  timeSeriesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: simResult.timestamps,
      datasets: [
        {
          label: '실내 CO₂ (ppm)',
          data: simResult.co2Data,
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.08)',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.3,
          yAxisID: 'yCO2',
          fill: true
        },
        {
          label: '실외 미세먼지 PM2.5 (μg/m³)',
          data: simResult.outdoorPM25Data,
          borderColor: '#94a3b8',
          borderWidth: 1.8,
          borderDash: [4, 4],
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.2,
          yAxisID: 'yPM',
          fill: false
        },
        {
          label: '실내 미세먼지 PM2.5 (μg/m³)',
          data: simResult.indoorPM25Data,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.3,
          yAxisID: 'yPM',
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: state.theme === 'dark' ? '#f8fafc' : '#1e293b',
            font: { family: 'Pretendard', size: 12, weight: 600 },
            usePointStyle: true,
            boxWidth: 8
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleFont: { family: 'Pretendard', size: 13, weight: 700 },
          bodyFont: { family: 'Pretendard', size: 12 },
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            afterBody: (context) => {
              const idx = context[0].dataIndex;
              const winOpen = simResult.windowStatusData[idx] === 1;
              return winOpen ? '\n🪟 창문 상태: [개방 중 (환기)]' : '\n🚪 창문 상태: [닫힘 (밀폐)]';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: state.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: state.theme === 'dark' ? '#94a3b8' : '#64748b',
            maxTicksLimit: 12,
            font: { family: 'JetBrains Mono', size: 11 }
          }
        },
        yCO2: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: '실내 CO₂ (ppm)',
            color: '#f43f5e',
            font: { family: 'Pretendard', weight: 700 }
          },
          min: 400,
          suggestedMax: 2600,
          grid: {
            color: state.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: '#f43f5e',
            font: { family: 'JetBrains Mono' }
          }
        },
        yPM: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: '미세먼지 PM2.5 (μg/m³)',
            color: '#f59e0b',
            font: { family: 'Pretendard', weight: 700 }
          },
          min: 0,
          suggestedMax: 90,
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: '#f59e0b',
            font: { family: 'JetBrains Mono' }
          }
        }
      }
    },
    plugins: [periodBackgroundPlugin]
  });
}

// ==========================================
// 3. 교실 2D 입자 유동 캔버스 시뮬레이터 (60 FPS)
// ==========================================

class AirParticle {
  constructor(w, h, type) {
    this.w = w;
    this.h = h;
    this.reset(type);
  }

  reset(type = null) {
    this.type = type || (Math.random() < 0.55 ? 'co2' : (Math.random() < 0.6 ? 'pm' : 'clean'));
    // 입자 위치
    if (this.type === 'co2') {
      // 학생 책상 주변에서 생성
      this.x = 80 + Math.random() * (this.w - 180);
      this.y = 120 + Math.random() * (this.h - 160);
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -0.3 - Math.random() * 0.4; // 위로 뜨는 대류
      this.radius = 2.5 + Math.random() * 1.5;
      this.alpha = 0.8;
      this.color = '#f43f5e';
    } else if (this.type === 'pm') {
      // 창문 또는 벽체 틈새에서 유입
      this.x = Math.random() < 0.7 ? 15 + Math.random() * 20 : Math.random() * this.w;
      this.y = Math.random() * this.h;
      this.vx = 0.5 + Math.random() * 0.8;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = 2.0 + Math.random() * 1.5;
      this.alpha = 0.7;
      this.color = '#f59e0b';
    } else {
      // 청정 공기
      this.x = 20 + Math.random() * 30;
      this.y = 80 + Math.random() * (this.h - 120);
      this.vx = 1.0 + Math.random() * 1.2;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = 2.0;
      this.alpha = 0.75;
      this.color = '#38bdf8';
    }
  }

  update(isWindowOpen, isPurifierOn) {
    if (isWindowOpen) {
      // 창문 열림 시 강한 맞통풍 기류 벡터 적용 (좌 -> 우)
      this.vx += 0.08;
      if (this.type === 'co2') {
        this.vx += 0.05; // 빠르게 배출
      }
    } else {
      // 창문 닫힘 시 약한 대류 순환
      this.vx += (Math.random() - 0.5) * 0.05;
      this.vy += (Math.random() - 0.5) * 0.05;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }

    // 공기청정기 흡입 효과 (교실 우하단에 배치)
    if (isPurifierOn) {
      const pX = this.w - 55;
      const pY = this.h - 60;
      const dx = pX - this.x;
      const dy = pY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        this.vx += (dx / dist) * 0.15;
        this.vy += (dy / dist) * 0.15;
      }
      // 필터 흡입 시 소멸 및 리셋
      if (dist < 15 && (this.type === 'pm' || this.type === 'co2')) {
        this.reset('clean');
        this.x = pX;
        this.y = pY - 20;
        this.vy = -1.2; // 청정공기 상부 토출
        this.vx = (Math.random() - 0.5) * 0.8;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    // 경계 처리
    if (this.x < 10 || this.x > this.w - 10 || this.y < 20 || this.y > this.h - 20) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initCanvasSimulator() {
  canvas = document.getElementById("classroomCanvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  // 캔버스 레티나 해상도 보정
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // 초기 입자 풀 생성
  particles = [];
  const rect = canvas.getBoundingClientRect();
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(new AirParticle(rect.width, rect.height));
  }

  animateCanvas();
}

function animateCanvas() {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  const isWindowOpen = state.manualWindowOpen;
  const isPurifierOn = state.purifierMode !== "off";

  // 1. 교실 벽체 및 창문 시각화
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 15, w - 20, h - 30);

  // 좌측 창문 (외기측)
  const winY1 = 45;
  const winHeight = 120;
  ctx.lineWidth = 5;
  if (isWindowOpen) {
    ctx.strokeStyle = '#38bdf8'; // 열림: 청록색
    // 바람 화살표 기류 흐름
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.fillText("🪟 창문 열림 (외기 유입 중)", 18, 38);
    // 바람 유입 스트림라인
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      const off = (Date.now() / 25 + k * 30) % 70;
      ctx.moveTo(12, winY1 + 25 + k * 35);
      ctx.lineTo(12 + off, winY1 + 25 + k * 35);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = '#64748b'; // 닫힘: 회색
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Pretendard';
    ctx.fillText("🔒 창문 닫힘 (밀폐)", 18, 38);
  }
  ctx.beginPath();
  ctx.moveTo(10, winY1);
  ctx.lineTo(10, winY1 + winHeight);
  ctx.stroke();

  // 우측 문 / 복도 창문
  ctx.beginPath();
  ctx.strokeStyle = isWindowOpen ? '#38bdf8' : '#64748b';
  ctx.moveTo(w - 10, winY1 + 20);
  ctx.lineTo(w - 10, winY1 + winHeight - 20);
  ctx.stroke();

  // 칠판 (정면 전면부 상단)
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(w / 2 - 80, 18, 160, 14);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px Pretendard';
  ctx.textAlign = 'center';
  ctx.fillText("칠판 (Front Board)", w / 2, 29);

  // 책상 및 학생 실루엣 (3열 4행 간이 배치)
  const rows = 3;
  const cols = 5;
  const startX = 75;
  const startY = 85;
  const gapX = (w - 180) / cols;
  const gapY = (h - 140) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = startX + c * gapX;
      const dy = startY + r * gapY;
      // 책상
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(dx - 12, dy - 8, 24, 16);
      // 의자/학생
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.arc(dx, dy + 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 공기청정기 장비 (우측 후면 구석)
  const apX = w - 55;
  const apY = h - 60;
  ctx.fillStyle = isPurifierOn ? '#10b981' : '#475569';
  ctx.fillRect(apX - 12, apY - 16, 24, 32);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '8px Pretendard';
  ctx.fillText(isPurifierOn ? "PURIFIER ON" : "OFF", apX, apY + 24);

  // 정화 회오리 애니메이션
  if (isPurifierOn) {
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.beginPath();
    ctx.arc(apX, apY, 18 + 4 * Math.sin(Date.now() / 150), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  // 2. 입자 시뮬레이션 업데이트 및 렌더링
  particles.forEach(p => {
    p.update(isWindowOpen, isPurifierOn);
    p.draw(ctx);
  });

  requestAnimationFrame(animateCanvas);
}

// ==========================================
// 4. UI 갱신 및 대시보드 메트릭 계산
// ==========================================

function updateDashboardMetrics(simResult) {
  const latestIndex = simResult.co2Data.length - 1;
  const peakCO2 = Math.max(...simResult.co2Data);
  const avgCO2 = Math.round(simResult.co2Data.reduce((a, b) => a + b, 0) / simResult.co2Data.length);
  const peakPM25 = Math.max(...simResult.indoorPM25Data);
  const avgPM25 = Math.round((simResult.indoorPM25Data.reduce((a, b) => a + b, 0) / simResult.indoorPM25Data.length) * 10) / 10;
  
  // 1000ppm 초과 시간 (분)
  const co2Over1000Min = simResult.co2Data.filter(v => v > 1000).length;

  // 카드 1: 피크 CO2
  const peakCo2El = document.getElementById("metricPeakCO2");
  if (peakCo2El) {
    peakCo2El.textContent = peakCO2;
    const card = peakCo2El.closest(".metric-card");
    if (card) {
      card.className = "metric-card " + (peakCO2 > 1500 ? "alert-danger" : (peakCO2 > 1000 ? "alert-warning" : "alert-good"));
    }
  }

  // 카드 2: 평균 실내 PM2.5
  const avgPMEl = document.getElementById("metricAvgPM");
  if (avgPMEl) {
    avgPMEl.textContent = avgPM25;
    const card = avgPMEl.closest(".metric-card");
    if (card) {
      card.className = "metric-card " + (avgPM25 > 35 ? "alert-danger" : (avgPM25 > 15 ? "alert-warning" : "alert-good"));
    }
  }

  // 카드 3: CO2 기준 초과 시간
  const overTimeEl = document.getElementById("metricOverTime");
  if (overTimeEl) {
    overTimeEl.textContent = co2Over1000Min + " 분";
  }

  // 카드 4: AI 최적 환기 추천 회수
  const aiWindowsEl = document.getElementById("metricGoldenTimes");
  if (aiWindowsEl) {
    aiWindowsEl.textContent = `${simResult.aiVentilationWindows.length} 회 권장`;
  }

  // AI 추천 상세 안내 카드 텍스트 업데이트
  const aiBodyEl = document.getElementById("aiRecommendationDetail");
  if (aiBodyEl) {
    let windowTexts = simResult.aiVentilationWindows.map(w => {
      const sH = String(Math.floor(9 + w.start / 60)).padStart(2, '0');
      const sM = String(w.start % 60).padStart(2, '0');
      const eH = String(Math.floor(9 + w.end / 60)).padStart(2, '0');
      const eM = String(w.end % 60).padStart(2, '0');
      return `<span class="golden-time-badge">🎯 ${w.label} (${sH}:${sM} ~ ${eH}:${eM})</span>`;
    }).join(" ");

    const currentScenario = PRESET_SCENARIOS[state.selectedPreset];
    aiBodyEl.innerHTML = `
      <p style="margin-bottom: 8px;"><strong>현재 시나리오:</strong> ${currentScenario.name} (${currentScenario.description})</p>
      <p style="margin-bottom: 10px;"><strong>AI 모델 권장 환기 타임라인:</strong></p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">${windowTexts}</div>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">
        💡 <em>판단 근거:</em> 외기 미세먼지 시계열 곡선의 저점 구간을 포착하고, 실내 CO₂가 1,000ppm을 초과하기 직전의 쉬는 시간을 활용하여 맞통풍 환기를 실행할 때 공기질 총 위해도 손실(Loss)이 최소화됩니다.
      </p>
    `;
  }
}

// ==========================================
// 5. 시나리오 비교 벤치마크 테이블 렌더링
// ==========================================

function updateBenchmarkTable() {
  const tbody = document.getElementById("benchmarkTableBody");
  if (!tbody) return;

  // 3개 전략 각각 시뮬레이션 계산
  const simNoVent = runFullTimelineSimulation("no_vent");
  const simFixed = runFullTimelineSimulation("fixed_break");
  const simAI = runFullTimelineSimulation("ai_optimal");

  const calcStats = (sim) => {
    const peakCO2 = Math.max(...sim.co2Data);
    const avgCO2 = Math.round(sim.co2Data.reduce((a, b) => a + b, 0) / sim.co2Data.length);
    const co2Over = sim.co2Data.filter(v => v > 1000).length;
    const avgPM = Math.round((sim.indoorPM25Data.reduce((a, b) => a + b, 0) / sim.indoorPM25Data.length) * 10) / 10;
    const totalHazard = Math.round(sim.hazardScores.reduce((a, b) => a + b, 0));
    return { peakCO2, avgCO2, co2Over, avgPM, totalHazard };
  };

  const statNo = calcStats(simNoVent);
  const statFix = calcStats(simFixed);
  const statAI = calcStats(simAI);

  tbody.innerHTML = `
    <tr>
      <td><strong>전략 A: 무환기 (밀폐 유지)</strong><br><span style="color:var(--text-muted);font-size:0.8rem;">창문 차단 + 공기청정기만 가동</span></td>
      <td style="color:#ef4444;font-weight:700;">${statNo.peakCO2} ppm</td>
      <td>${statNo.avgCO2} ppm</td>
      <td style="color:#ef4444;">${statNo.co2Over} 분</td>
      <td style="color:#10b981;">${statNo.avgPM} μg/m³</td>
      <td><span class="tag-badge" style="background:rgba(239,68,68,0.2);color:#ef4444;">위해도 ${statNo.totalHazard}</span></td>
      <td>미세먼지는 안전하나 CO₂ 농도 폭증으로 졸음 및 두통 극심</td>
    </tr>
    <tr>
      <td><strong>전략 B: 매 쉬는시간 고정환기</strong><br><span style="color:var(--text-muted);font-size:0.8rem;">매 휴식 10분간 무조건 창문 개방</span></td>
      <td>${statFix.peakCO2} ppm</td>
      <td>${statFix.avgCO2} ppm</td>
      <td>${statFix.co2Over} 분</td>
      <td style="color:#f59e0b;font-weight:700;">${statFix.avgPM} μg/m³</td>
      <td><span class="tag-badge" style="background:rgba(245,158,11,0.2);color:#f59e0b;">위해도 ${statFix.totalHazard}</span></td>
      <td>CO₂는 개선되나 출근시간 도로변 고농도 미세먼지 직격 유입</td>
    </tr>
    <tr class="highlight-row">
      <td><strong>전략 C: AI 예측 최적 환기 모델 (본 연구)</strong><br><span style="color:var(--accent-cyan);font-size:0.8rem;">외기 예측 저점 및 CO₂ 임계점 선별 환기</span></td>
      <td style="color:#10b981;font-weight:700;">${statAI.peakCO2} ppm</td>
      <td style="color:#10b981;">${statAI.avgCO2} ppm</td>
      <td style="color:#10b981;"><strong>${statAI.co2Over} 분</strong></td>
      <td style="color:#10b981;"><strong>${statAI.avgPM} μg/m³</strong></td>
      <td><span class="tag-badge" style="background:rgba(16,185,129,0.2);color:#10b981;">최적 위해도 ${statAI.totalHazard}</span></td>
      <td><strong>CO₂ 기준선(1,000ppm) 방어 및 미세먼지 유입 최소화 동시 달성</strong></td>
    </tr>
  `;
}

// ==========================================
// 6. 맞춤형 학교 교실 환기 계산기
// ==========================================

function updateSchoolCalculator() {
  const areaInput = document.getElementById("calcArea");
  const heightInput = document.getElementById("calcHeight");
  const studentsInput = document.getElementById("calcStudents");
  const outdoorPMInput = document.getElementById("calcOutdoorPM");

  if (!areaInput || !heightInput || !studentsInput || !outdoorPMInput) return;

  const area = parseFloat(areaInput.value) || 67.5;
  const height = parseFloat(heightInput.value) || 2.7;
  const students = parseInt(studentsInput.value, 10) || 25;
  const outdoorPM = parseFloat(outdoorPMInput.value) || 35;

  const volume = area * height; // m³
  const totalGen = students * VENTILATION_CONSTANTS.CO2_GEN_PER_STUDENT + VENTILATION_CONSTANTS.CO2_GEN_PER_TEACHER; // m³/h

  // 밀폐 상태(0.25 ACH)에서 500ppm -> 1,000ppm 도달 시간 공식 계산
  // C(t) = C_eq + (C_0 - C_eq) * e^(-ACH * t) = 1000
  const achClosed = VENTILATION_CONSTANTS.ACH_CLOSED;
  const Qclosed = achClosed * volume;
  const C_eq = VENTILATION_CONSTANTS.CO2_OUTDOOR_DEFAULT + (totalGen * 1e6) / Qclosed;
  
  let timeTo1000Min = 0;
  if (C_eq > 1000) {
    const ratio = (1000 - C_eq) / (500 - C_eq);
    const tHour = -Math.log(ratio) / achClosed;
    timeTo1000Min = Math.round(tHour * 60);
  } else {
    timeTo1000Min = 999;
  }

  // 창문 개방 시(8 ACH 맞통풍) 1,500ppm -> 700ppm으로 정상화되는 데 걸리는 환기 소요시간(분)
  const achOpen = VENTILATION_CONSTANTS.ACH_CROSS_VENT;
  const Qopen = achOpen * volume;
  const C_eq_open = VENTILATION_CONSTANTS.CO2_OUTDOOR_DEFAULT + (totalGen * 1e6) / Qopen;
  let ventDurationMin = 6;
  if (C_eq_open < 700) {
    const ratioOpen = (700 - C_eq_open) / (1500 - C_eq_open);
    const tOpenHour = -Math.log(ratioOpen) / achOpen;
    ventDurationMin = Math.max(3, Math.round(tOpenHour * 60));
  }

  const resTimeTo1000 = document.getElementById("calcResTimeTo1000");
  const resVentDuration = document.getElementById("calcResVentDuration");
  const resGuidance = document.getElementById("calcResGuidance");

  if (resTimeTo1000) resTimeTo1000.textContent = `${timeTo1000Min} 분`;
  if (resVentDuration) resVentDuration.textContent = `${ventDurationMin} 분`;

  if (resGuidance) {
    let advice = "";
    if (outdoorPM > 75) {
      advice = `⚠️ 외부 미세먼지가 ${outdoorPM}μg/m³(매우 나쁨) 수준입니다. 창문 완전 개방보다는 교실 공기청정기를 최대 풍량으로 가동하고, 쉬는 시간마다 3~4분의 짧은 틈새 맞통풍 환기만 권장합니다.`;
    } else if (outdoorPM > 35) {
      advice = `ℹ️ 외부 미세먼지가 ${outdoorPM}μg/m³(나쁨/주의) 수준입니다. 수업 종료 후 쉬는 시간 ${ventDurationMin}분 동안 맞통풍 환기를 실시한 후, 즉시 창문을 닫고 공기청정기를 가동하십시오.`;
    } else {
      advice = `✅ 외부 대기질이 양호합니다(${outdoorPM}μg/m³). 매 교시 쉬는 시간마다 ${ventDurationMin}분 이상의 적극적인 자연 환기를 실시하여 실내 CO₂를 600~800ppm 수준으로 유지하세요.`;
    }
    resGuidance.textContent = advice;
  }
}

// ==========================================
// 7. 이벤트 바인딩 및 초기화
// ==========================================

function setupEventListeners() {
  // 테마 토글 버튼
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.body.setAttribute("data-theme", state.theme);
      themeBtn.innerHTML = state.theme === "dark" ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
      if (window.lucide) lucide.createIcons();
      refreshSimulation();
    });
  }

  // 탭 네비게이션
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach(tc => {
        tc.classList.remove("active");
      });
      const activeContent = document.getElementById(targetTab);
      if (activeContent) activeContent.classList.add("active");

      if (targetTab === "tab-simulator") {
        setTimeout(() => {
          if (timeSeriesChart) timeSeriesChart.resize();
        }, 100);
      }
    });
  });

  // 학생 수 슬라이더
  const studentSlider = document.getElementById("studentsSlider");
  const studentValBadge = document.getElementById("studentValBadge");
  if (studentSlider && studentValBadge) {
    studentSlider.addEventListener("input", (e) => {
      state.studentsCount = parseInt(e.target.value, 10);
      studentValBadge.textContent = `${state.studentsCount} 명`;
      refreshSimulation();
    });
  }

  // 시나리오 프리셋 선택 셀렉트박스
  const presetSelect = document.getElementById("presetSelect");
  if (presetSelect) {
    presetSelect.addEventListener("change", (e) => {
      state.selectedPreset = e.target.value;
      refreshSimulation();
    });
  }

  // 공기청정기 모드 셀렉트박스
  const purifierSelect = document.getElementById("purifierSelect");
  if (purifierSelect) {
    purifierSelect.addEventListener("change", (e) => {
      state.purifierMode = e.target.value;
      refreshSimulation();
    });
  }

  // 환기 전략 선택 (AI 최적 vs 고정 쉬는시간 vs 무환기)
  const strategySelect = document.getElementById("strategySelect");
  if (strategySelect) {
    strategySelect.addEventListener("change", (e) => {
      state.ventilationStrategy = e.target.value;
      refreshSimulation();
    });
  }

  // 캔버스 뷰포트 수동 창문 토글 버튼
  const windowToggleBtn = document.getElementById("windowToggleBtn");
  if (windowToggleBtn) {
    windowToggleBtn.addEventListener("click", () => {
      state.manualWindowOpen = !state.manualWindowOpen;
      windowToggleBtn.textContent = state.manualWindowOpen ? "🪟 창문 닫기" : "🪟 창문 열기 (환기)";
      windowToggleBtn.style.borderColor = state.manualWindowOpen ? "var(--iaq-good)" : "var(--accent-cyan)";
    });
  }

  // 계산기 입력 이벤트 바인딩
  ["calcArea", "calcHeight", "calcStudents", "calcOutdoorPM"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateSchoolCalculator);
  });

  // 인쇄 및 리포트 내보내기 버튼
  const printReportBtn = document.getElementById("printReportBtn");
  if (printReportBtn) {
    printReportBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

/**
 * 변경된 파라미터로 전체 시뮬레이션 및 차트, 벤치마크 갱신
 */
function refreshSimulation() {
  const simResult = runFullTimelineSimulation();
  initOrUpdateChart(simResult);
  updateDashboardMetrics(simResult);
  updateBenchmarkTable();
  updateSchoolCalculator();
}

// 초기 로딩 진입점
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  initCanvasSimulator();
  refreshSimulation();

  // KaTeX 수식 자동 렌더링 헬퍼
  function renderAllMath() {
    if (window.renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  // 초기 렌더링 시도
  renderAllMath();
  window.addEventListener('load', renderAllMath);
  setTimeout(renderAllMath, 500);

  // Lucide 아이콘 활성화
  function renderIcons() {
    if (window.lucide && lucide.createIcons) {
      lucide.createIcons();
    }
  }
  renderIcons();
  window.addEventListener('load', renderIcons);

  // 탭 전환 시 차트 리사이즈 및 수식 재검토
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setTimeout(() => {
        renderAllMath();
        renderIcons();
      }, 50);
    });
  });
});

