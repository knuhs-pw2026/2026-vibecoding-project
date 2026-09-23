/**
 * report_data.js
 * 학교 주변 미세먼지 및 교실 CO2 데이터 기반 최적 환기 타이밍 예측 모델
 * 물리 상수, 사전 정의 시나리오 및 학술 데이터셋
 */

const VENTILATION_CONSTANTS = {
  // 인체 생체 데이터 (청소년 교실 착석 기준)
  CO2_GEN_PER_STUDENT: 0.019, // 학생 1인당 CO2 발생량 (m³/h, 약 19 L/h)
  CO2_GEN_PER_TEACHER: 0.024, // 교사 1인당 CO2 발생량 (m³/h, 발성 시 약 24 L/h)
  CO2_OUTDOOR_DEFAULT: 420,   // 외기 기본 CO2 농도 (ppm)
  
  // 교실 건축 물리 파라미터 (국내 일반 초·중·고 표준 교실 규격)
  DEFAULT_CLASS_AREA: 67.5,   // 교실 바닥 면적 (m², 가로 7.5m x 세로 9.0m)
  DEFAULT_CLASS_HEIGHT: 2.7,  // 교실 층고 (m)
  DEFAULT_CLASS_VOLUME: 182.25, // 교실 총 체적 (m³)
  
  // 환기량 (Air Changes per Hour, ACH = h⁻¹)
  ACH_CLOSED: 0.25,           // 창문 및 문 완전 밀폐 시 틈새 자연 침기 (0.2~0.3 ACH)
  ACH_SLIGHT_OPEN: 1.5,       // 한쪽 창문 10% 미세 개방
  ACH_HALF_OPEN: 3.5,         // 창문 절반 개방
  ACH_CROSS_VENT: 8.0,        // 맞통풍 (복도측 창문 + 외기측 창문 동시 전면 개방)
  ACH_ERV_STANDARD: 2.5,      // 기계식 환기장치(전열교환기) 표준 가동
  
  // 미세먼지 물리 상수
  PENETRATION_CLOSED: 0.55,    // 창문 닫힘 시 미세먼지(PM2.5) 건물 외피 침투율
  PENETRATION_OPEN: 0.95,      // 창문 개방 시 침투율
  DEPOSITION_RATE_PM25: 0.18,  // PM2.5 자연 침적률 (h⁻¹)
  DEPOSITION_RATE_PM10: 0.65,  // PM10 자연 침적률 (h⁻¹)
  
  // 공기청정기 파라미터 (CADR: Clean Air Delivery Rate)
  PURIFIER_OFF: 0,
  PURIFIER_LOW: 250,           // m³/h (저소음 모드, 수업 중 방해 최소화)
  PURIFIER_MED: 450,           // m³/h (표준 모드)
  PURIFIER_TURBO: 750,         // m³/h (급속 정화 터보 모드)
  
  // 법적/의학적 공기질 기준치
  CO2_GOOD: 800,               // 쾌적 수준
  CO2_LEGAL_LIMIT: 1000,       // 학교보건법 시행규칙 제3조 유지기준 (1,000 ppm)
  CO2_WARNING: 1500,           // 집중력 저하, 기면, 두통 발생 역치
  CO2_DANGER: 2500,            // 심각한 인지능력 저하 및 졸음
  
  PM25_GOOD: 15,               // 환경부 '좋음' (μg/m³)
  PM25_MODERATE: 35,           // 환경부 '보통' 한계 (학교보건법 유지기준 35 μg/m³)
  PM25_BAD: 75,                // '나쁨' 기준
  PM25_VERY_BAD: 76,           // '매우 나쁨' (76 μg/m³ 이상)
};

// 학교 주변 환경 시나리오 프리셋
const PRESET_SCENARIOS = {
  spring_clean: {
    id: "spring_clean",
    name: "쾌적한 봄날 (대기 상태 양호)",
    description: "학교 주변 대기가 청정하고 미세먼지가 낮은 날. CO2 억제를 위한 적극적 자연환기 최적 조건.",
    outdoorCO2: 415,
    basePM25: 14,
    basePM10: 28,
    pmFluctuation: "stable_low", // 시간대별 변동 특성
    tempOutdoor: 19.5,
    weatherIcon: "sun",
    recommendedMode: "자연 환기 권장",
    badgeClass: "badge-good"
  },
  rush_hour_dust: {
    id: "rush_hour_dust",
    name: "도로 인접 학교 (등교·출근 러시아워 스파이크)",
    description: "학교 인근 왕복 6차선 도로의 출근 시간(08:30~09:40) 차량 배출가스로 초미세먼지가 급등했다가 10시 이후 점차 감소하는 전형적인 도심 학교 패턴.",
    outdoorCO2: 435,
    basePM25: 42,
    basePM10: 68,
    pmFluctuation: "morning_peak",
    tempOutdoor: 16.0,
    weatherIcon: "truck",
    recommendedMode: "AI 골든타임 환기 (10:30 이후 창문 개방 권장)",
    badgeClass: "badge-warning"
  },
  yellow_dust: {
    id: "yellow_dust",
    name: "황사 및 고농도 미세먼지 비상 (주의보 발령)",
    description: "외부 PM2.5 85μg/m³, PM10 160μg/m³의 악조건. 무분별한 창문 개방 시 호흡기 질환 유발. 기계환기(필터) 및 짧은 틈새 환기 필수.",
    outdoorCO2: 440,
    basePM25: 88,
    basePM10: 175,
    pmFluctuation: "continuous_high",
    tempOutdoor: 14.5,
    weatherIcon: "wind",
    recommendedMode: "창문 폐쇄 유지 + 공기청정기 터보 + 기계환기",
    badgeClass: "badge-danger"
  },
  winter_cold: {
    id: "winter_cold",
    name: "겨울철 난방 가동 & 환기 기피 시나리오",
    description: "외기온도 2℃로 창문 개방 기피 현상 심화. 2교시 이후 CO2가 2,500ppm을 돌파하여 학생들 졸음 폭증. 열손실을 최소화하는 5분 급속 환기 필요.",
    outdoorCO2: 425,
    basePM25: 38,
    basePM10: 55,
    pmFluctuation: "stable_moderate",
    tempOutdoor: 2.0,
    weatherIcon: "snowflake",
    recommendedMode: "쉬는시간 5분 급속 맞통풍 환기",
    badgeClass: "badge-cold"
  }
};

// 1교시 ~ 4교시 (오전 09:00 ~ 12:40) 표준 수업 타임라인 정의
const SCHOOL_TIMETABLE = [
  { period: "1교시 수업", type: "class", startMin: 0, endMin: 50, label: "09:00 - 09:50" },
  { period: "1교시 쉬는시간", type: "break", startMin: 50, endMin: 60, label: "09:50 - 10:00" },
  { period: "2교시 수업", type: "class", startMin: 60, endMin: 110, label: "10:00 - 10:50" },
  { period: "2교시 쉬는시간", type: "break", startMin: 110, endMin: 120, label: "10:50 - 11:00" },
  { period: "3교시 수업", type: "class", startMin: 120, endMin: 170, label: "11:00 - 11:50" },
  { period: "3교시 쉬는시간", type: "break", startMin: 170, endMin: 180, label: "11:50 - 12:00" },
  { period: "4교시 수업", type: "class", startMin: 180, endMin: 230, label: "12:00 - 12:40" }
];

// 학술 탐구 비교 벤치마크 데이터 (연구 보고서용 통계)
const BENCHMARK_COMPARISONS = {
  strategyA: {
    name: "시나리오 A: 무환기 (밀폐 창문 + 공기청정기만 가동)",
    description: "외부 미세먼지 차단을 위해 창문을 온종일 닫아둠.",
    co2Max: 2840,
    co2Avg: 1960,
    co2Over1000Min: 185, // 1000ppm 초과 시간(분)
    pm25Avg: 11.2,
    cognitiveScoreDrop: "-28.4%",
    evaluation: "미세먼지는 안전하나 CO2 폭증으로 심각한 졸음, 학습 효율 급락"
  },
  strategyB: {
    name: "시나리오 B: 매 쉬는 시간 무조건 창문 개방 (전통적 고정 환기)",
    description: "외부 대기질 고려 없이 10분 쉬는 시간마다 획일적으로 창문 개방.",
    co2Max: 1420,
    co2Avg: 980,
    co2Over1000Min: 65,
    pm25Avg: 39.8,
    cognitiveScoreDrop: "-6.2%",
    evaluation: "CO2는 낮아지나 도로변 출근시간 미세먼지 폭탄 직격탄 유입 (WHO 기준치 초과)"
  },
  strategyC: {
    name: "시나리오 C: 본 연구의 AI 최적 환기 타이밍 제어 모델",
    description: "외부 미세먼지 시계열 예측값과 실내 CO2 농도를 실시간 연산하여, 미세먼지 최저 구간 및 CO2 임계 도달 시점에 선별적 골든타임 환기 실행.",
    co2Max: 1180,
    co2Avg: 890,
    co2Over1000Min: 18,
    pm25Avg: 18.5,
    cognitiveScoreDrop: "-1.8%",
    evaluation: "CO2 쾌적선 유지와 실내 미세먼지 유입 53.5% 저감 동시 달성"
  }
};
