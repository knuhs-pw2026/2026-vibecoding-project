/**
 * CineCraft AI - Core Application Logic
 * Feature 1: YouTube Technique Reverse-Engineering Analyzer
 * Feature 2: Big Data Viral Trend Radar & Retention Curves
 * Feature 3: Pro Technique Bezier Sandbox & Mask Simulator
 * Feature 4: School Life Record (생기부) Synthesis & Export Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State Management
  const state = {
    currentTab: 'analyzer',
    currentPreset: 'mrbeast',
    currentTool: 'premiere',
    activeMarkerId: 'm-cut-1',
    p1: 0.25,
    p2: 0.85,
    trendPlatform: 'all',
    trendCategory: 'entertainment',
    isAnalyzing: false,
    actorPos: 0,
    actorAnimId: null
  };

  /* ==========================================================================
     1. TAB NAVIGATION
     ========================================================================== */
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(tabId) {
    state.currentTab = tabId;
    navTabs.forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `view-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Special handlers when entering specific tabs
    if (tabId === 'trend') {
      setTimeout(drawRetentionChart, 50);
    } else if (tabId === 'sandbox') {
      setTimeout(() => {
        drawBezierCurve();
        startActorAnimation();
      }, 50);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  // Header quick export
  document.getElementById('btn-export-quick')?.addEventListener('click', () => {
    switchTab('proposal');
    showToast('생기부 기획서 및 포트폴리오 탭으로 이동했습니다.');
  });

  /* ==========================================================================
     2. FEATURE 01: YOUTUBE REVERSE-ENGINEERING ANALYZER
     ========================================================================== */

  // Presets Data
  const PRESET_DATA = {
    mrbeast: {
      title: "미스터비스트식 1.2초 초고속 훅",
      url: "https://www.youtube.com/watch?v=mrbeast_retention_hook_4k",
      genre: "SHORT-FORM VIRAL",
      headline: '"첫 3초에서 82% 이탈을 막는 3연속 점프컷 & SFX"',
      cutPace: "1.18초",
      cutPaceSub: "상위 1% 초고속 템포",
      hookScore: "96.8 / 100",
      hookSub: "첫 3초 이탈률 11.2%",
      sfxLayers: "5개 트랙",
      sfxSub: "우퍼 붐 + 라이저 + 우시",
      colorLut: "Hyper Vibrant",
      colorSub: "채도 +24%, 콘트라스트 극대화",
      timelineMarkers: [
        { id: 'm-cut-1', lane: 'cuts', time: '00:00.80', pct: 6, label: '0.8s 점프컷', type: 'cut', technique: 'jumpcut' },
        { id: 'm-zoom-1', lane: 'motion', time: '00:01.40', pct: 15, label: '140% 크런치 줌', type: 'zoom', technique: 'crashzoom' },
        { id: 'm-audio-1', lane: 'audio', time: '00:02.10', pct: 28, label: '-18dB 덕킹 + 붐', type: 'sfx', technique: 'audioduck' },
        { id: 'm-text-1', lane: 'text', time: '00:03.20', pct: 40, label: '키네틱 텍스트 팝업', type: 'text', technique: 'kinetictext' },
        { id: 'm-cut-2', lane: 'cuts', time: '00:04.50', pct: 55, label: '4.5s 리듬 컷', type: 'cut', technique: 'jumpcut' },
        { id: 'm-zoom-2', lane: 'motion', time: '00:06.80', pct: 72, label: '돌리 줌 왜곡', type: 'zoom', technique: 'crashzoom' },
        { id: 'm-audio-2', lane: 'audio', time: '00:08.50', pct: 86, label: 'BGM 피치 드롭', type: 'sfx', technique: 'audioduck' }
      ]
    },
    cinematic: {
      title: "감성 브이로그 스피드 램핑 & 매치컷",
      url: "https://www.youtube.com/watch?v=cinematic_travel_japan_8k",
      genre: "CINEMATIC TRAVEL",
      headline: '"도심 풍경에서 인물로 이어지는 매끄러운 시간 왜곡과 매치 컷"',
      cutPace: "2.65초",
      cutPaceSub: "감성적인 리듬감",
      hookScore: "89.2 / 100",
      hookSub: "시각적 미학 완벽도 우수",
      sfxLayers: "4개 트랙",
      sfxSub: "자연 앰비언스 + 로우파이 피아노",
      colorLut: "Teal & Orange",
      colorSub: "섀도우 청록 + 하이라이트 웜톤",
      timelineMarkers: [
        { id: 'm-zoom-c1', lane: 'motion', time: '00:01.20', pct: 12, label: '스피드 램핑 400%→30%', type: 'zoom', technique: 'speedramp' },
        { id: 'm-cut-c1', lane: 'cuts', time: '00:03.00', pct: 32, label: '모션 블러 매치컷', type: 'cut', technique: 'matchcut' },
        { id: 'm-audio-c1', lane: 'audio', time: '00:04.20', pct: 48, label: '공간계 리버브 전환', type: 'sfx', technique: 'audioduck' },
        { id: 'm-text-c1', lane: 'text', time: '00:06.50', pct: 68, label: '필름 타이포 트래킹', type: 'text', technique: 'kinetictext' },
        { id: 'm-zoom-c2', lane: 'motion', time: '00:08.80', pct: 88, label: '패스 마스킹 전환', type: 'zoom', technique: 'maskwipe' }
      ]
    },
    tech: {
      title: "M4 맥북 3D 모션 그래픽 B-Roll",
      url: "https://www.youtube.com/watch?v=m4_macbook_pro_cinematic_review",
      genre: "TECH REVIEW PRO",
      headline: '"제품 외관을 훑어내는 회전 매치컷과 3D 트래킹 스펙 자막"',
      cutPace: "1.85초",
      cutPaceSub: "정교한 비주얼 템포",
      hookScore: "93.4 / 100",
      hookSub: "정보 전달력 극대화",
      sfxLayers: "6개 트랙",
      sfxSub: "기계적 클릭음 + 하이테크 스위시",
      colorLut: "Clean High-Contrast",
      colorSub: "메탈릭 톤 & 다크 스튜디오",
      timelineMarkers: [
        { id: 'm-cut-t1', lane: 'cuts', time: '00:00.60', pct: 8, label: '0.6s B-Roll 컷', type: 'cut', technique: 'jumpcut' },
        { id: 'm-zoom-t1', lane: 'motion', time: '00:02.00', pct: 24, label: '360° 로테이션 줌', type: 'zoom', technique: 'speedramp' },
        { id: 'm-text-t1', lane: 'text', time: '00:03.80', pct: 42, label: '3D 모션 트래킹 스펙', type: 'text', technique: 'kinetictext' },
        { id: 'm-audio-t1', lane: 'audio', time: '00:05.40', pct: 60, label: '스위시 + 서브베이스', type: 'sfx', technique: 'audioduck' },
        { id: 'm-cut-t2', lane: 'cuts', time: '00:07.50', pct: 78, label: '포커스 풀 트랜지션', type: 'cut', technique: 'matchcut' }
      ]
    }
  };

  // Detailed Recipe Knowledge Base for Techniques & Tools
  const TECHNIQUE_RECIPES = {
    crashzoom: {
      badge: "카메라 워크 & 트랜지션 분석",
      title: "다이내믹 크런치 줌인 & 모션 블러 (Crash Zoom)",
      desc: "중요한 발언이나 반전 포인트에서 시청자의 시선을 0.3초 내에 고정시키는 카메라 왜곡 줌 기법입니다.",
      tip: "단순 Scale 확대는 화면을 어지럽힙니다. 베지에 곡선(Bezier S-Curve)으로 서서히 시작해 폭발적으로 당겨진 뒤 Shutter Angle 180도 블러를 적용해야 고급스럽습니다.",
      premiere: [
        { num: '01', title: '조정 레이어(Adjustment Layer) 생성', desc: '타임라인 컷 전환 지점 중심(앞 6프레임, 뒤 4프레임)에 조정 레이어를 배치합니다.' },
        { num: '02', title: '변형(Transform) 효과 적용', desc: '효과 창에서 <code>Transform</code>을 검색해 조정 레이어에 드롭합니다.' },
        { num: '03', title: '비율(Scale) 키프레임 & 셔터 각도', desc: '시작 <code>100%</code> → 끝 <code>140%</code> 키프레임을 생성하고 [컴포지션 셔터 각도 사용] 체크 해제 후 <code>300도</code> 입력합니다.' },
        { num: '04', title: '베지에 감속(Ease In/Out)', desc: '속도 그래프를 열고 곡선 핸들을 왼쪽 끝으로 당겨 폭발적 가속 후 멈추도록 조정합니다.' }
      ],
      davinci: [
        { num: '01', title: 'Adjustment Clip 생성 후 배치', desc: 'Effects 라이브러리에서 Adjustment Clip을 트랙 상단에 위치시킵니다.' },
        { num: '02', title: 'Fusion 페이지 진입 및 Transform 노드 추가', desc: '<code>Ctrl + Space</code>를 누르고 <code>Transform (Xf)</code> 노드를 연결합니다.' },
        { num: '03', title: 'Size 키프레임 및 Motion Blur 활성화', desc: 'Size 파라미터를 1.0에서 1.45로 키프레임 설정 후 Settings 탭에서 <code>Motion Blur: Quality 4, Shutter Angle: 180</code>을 켭니다.' },
        { num: '04', title: 'Spline 에디터 베지에 스무딩', desc: '<code>F4</code>를 눌러 Spline 패널을 열고 키프레임 선택 후 <code>S</code>를 눌러 매끄러운 S-커브로 가속도를 부여합니다.' }
      ],
      capcut: [
        { num: '01', title: '클립 분할 및 키프레임 지정', desc: '줌을 시작할 지점과 끝 지점에 재생헤드를 두고 <code>기본 > 위치 및 크기</code>의 키프레임(다이아몬드)을 클릭합니다.' },
        { num: '02', title: '종료 지점 크기 135% 확대', desc: '클립 끝 지점에서 배율을 <code>135%</code>로 늘리고 시선의 중심점(얼굴/눈)에 맞게 위치를 조정합니다.' },
        { num: '03', title: '효과 > 동영상 효과 > 모션 블러 추가', desc: '효과 탭에서 [모션 블러]를 검색하여 클립 구간에 올리고 <code>흐림 60, 가속 75</code>로 조절합니다.' }
      ]
    },
    jumpcut: {
      badge: "타임라인 템포 & 리듬 설계",
      title: "미세 공백 제거형 스마트 점프컷 (Fast Jump Cut)",
      desc: "음성과 음성 사이의 불필요한 숨소리(0.15초 이상)를 정밀하게 잘라내어 시청자 이탈을 원천 차단하는 핵심 바이럴 기법입니다.",
      tip: "단순 컷 편집을 넘어서 컷마다 프레임 스케일을 100% ↔ 115% 교차로 번갈아 배치하면 지루함 없는 다이내믹 인터뷰 영상이 완성됩니다.",
      premiere: [
        { num: '01', title: '오디오 파형 확대 및 리플 딜리트', desc: '단축키 <code>Q</code>(이전 공백 삭제), <code>W</code>(이후 공백 삭제)를 활용해 무음 구간을 0.05초 단위로 걷어냅니다.' },
        { num: '02', title: '스마트 펀치인(Punch-in) 적용', desc: '홀수 번째 클립은 Scale <code>100%</code>, 짝수 번째 클립은 Scale <code>112%</code>로 인물의 시선 높이에 맞춰 교차 배치합니다.' }
      ],
      davinci: [
        { num: '01', title: 'Cut 페이지의 Ripple Cut', desc: '단축키 <code>Shift + [</code> 및 <code>Shift + ]</code>를 사용하여 헤드/테일을 신속히 트리밍합니다.' },
        { num: '02', title: 'Inspector Transform 교차 줌', desc: 'Zoom 파라미터를 1.12배로 조절하여 점프 컷의 어색함을 카메라 앵글 전환 효과로 치환합니다.' }
      ],
      capcut: [
        { num: '01', title: '침묵 구간 자동 삭제 기능 활용', desc: '오디오 탭에서 [무음 구간 감지]를 켜서 0.2초 이하의 불필요한 쉼표 구간을 일괄 삭제합니다.' },
        { num: '02', title: '컷마다 캔버스 줌 교차 설정', desc: '화면 비율을 미세하게 당겨 점프컷의 튀는 느낌을 없앱니다.' }
      ]
    },
    audioduck: {
      badge: "사운드 디자인 & 엔지니어링",
      title: "자동 사이드체인 사운드 덕킹 (Audio Ducking)",
      desc: "내레이션 음성이 나올 때 BGM 볼륨이 -18dB~-22dB로 부드럽게 감쇄되고, 음성이 끝나면 0.2초 내로 복귀하는 음향 기술입니다.",
      tip: "BGM의 1kHz~3kHz 보컬 대역 주파수를 EQ로 3dB 정도 살짝 파내면(Notch Cut), 볼륨을 과하게 줄이지 않아도 목소리가 또렷하게 뚫고 나옵니다.",
      premiere: [
        { num: '01', title: '기본 사운드(Essential Sound) 패널', desc: '보컬 클립들을 모두 선택하고 오디오 유형을 [대화(Dialogue)]로 태그 지정합니다.' },
        { num: '02', title: 'BGM 클립 덕킹 체크', desc: '음악 클립을 선택 후 [음악(Music)] 태그를 누르고 <code>Ducking</code>을 체크합니다.' },
        { num: '03', title: '덕킹 감도 및 페이드 속도 파라미터', desc: '감도: <code>5.0</code>, 감쇄량: <code>-18dB</code>, 페이드 지속 시간: <code>400ms</code>로 설정하고 키프레임을 생성합니다.' }
      ],
      davinci: [
        { num: '01', title: 'Fairlight 페이지 진입', desc: '하단 페어라이트 오디오 탭으로 이동합니다.' },
        { num: '02', title: 'Dynamics Sidechain 활성화', desc: 'BGM 트랙의 Dynamics를 더블클릭하고 <code>Compressor</code>와 <code>SideChain Listen</code>을 활성화합니다.' },
        { num: '03', title: '보컬 트랙 Sidechain Send 연결', desc: '보컬 마이크 트랙에서 Send를 열고 BGM 트랙의 컴프레서 사이드체인으로 라우팅합니다.' }
      ],
      capcut: [
        { num: '01', title: 'BGM 클립 선택 후 오디오 탭 이동', desc: '배경음악 오디오 트랙을 클릭합니다.' },
        { num: '02', title: '사운드 덕킹(Audio Ducking) 스위치 켬', desc: '우측 속성 패널에서 [덕킹] 토글을 켜고 감도를 <code>85%</code>로 맞춥니다.' }
      ]
    },
    kinetictext: {
      badge: "모션 그래픽 & 텍스트 애니메이션",
      title: "바운스 팝업 키네틱 타이포 (Kinetic Pop-up)",
      desc: "단어 단위로 음절에 딱 맞춰 튀어나오며 시각적 리듬을 살리는 숏폼 바이럴 폰트 애니메이션입니다.",
      tip: "자막에 네온 글로우(Glow)와 3D 드롭 섀도우를 주고, 단어가 튀어나올 때 미세한 타자기/팝(Pop) SFX를 결합해야 몰입도가 배가됩니다.",
      premiere: [
        { num: '01', title: '기본 그래픽(Essential Graphics) 텍스트 입력', desc: '굵은 볼드 폰트(Pretendard Black 등)로 자막을 작성하고 텍스트 정렬을 중앙으로 둡니다.' },
        { num: '02', title: '스케일 키프레임 0% → 120% → 100%', desc: '0프레임: <code>0%</code>, 4프레임: <code>120%</code>, 7프레임: <code>100%</code>로 3단 바운스 키프레임을 배치합니다.' },
        { num: '03', title: '텍스트 트래킹 및 색상 하이라이트', desc: '강조할 핵심 키워드만 형광 옐로우(#FEF08A)로 색상을 변경합니다.' }
      ],
      davinci: [
        { num: '01', title: 'Text+ 도구 추가', desc: 'Effects에서 Text+를 타임라인으로 끌어옵니다.' },
        { num: '02', title: 'Modifier 탭의 Anim Curves 적용', desc: 'Size 파라미터 우클릭 후 <code>Modify With > Anim Curves</code>를 선택하고 Curve를 <code>Bounce</code>로 지정합니다.' }
      ],
      capcut: [
        { num: '01', title: '자동 캡션(Auto Captions) 추출', desc: '음성 인식으로 자막을 생성한 뒤 스타일을 [노란색 볼드 아웃라인]으로 일괄 적용합니다.' },
        { num: '02', title: '애니메이션 > 인(In) > 바운스 팝 선택', desc: '애니메이션 지속 시간을 0.2초로 짧게 주어 음절과 정확히 일치시킵니다.' }
      ]
    },
    speedramp: {
      badge: "시간 왜곡 & 타임 리매핑",
      title: "베지에 스피드 램핑 (Speed Ramping)",
      desc: "움직이는 피사체의 액션 전에는 400%로 가속했다가 타격/착지 순간 30% 슬로우모션으로 전환하는 영화적 기법입니다.",
      tip: "슬로우모션 구간은 최소 60fps 이상으로 촬영된 소스여야 끊김이 없습니다. 30fps 원본일 경우 Optical Flow(광학 흐름) 보간을 켜야 자연스럽습니다.",
      premiere: [
        { num: '01', title: '타임 리매핑(Time Remapping) 활성화', desc: '클립의 <code>fx</code> 버튼 우클릭 > <code>시간 다시 매핑 > 속도</code>를 선택합니다.' },
        { num: '02', title: 'Ctrl + 클릭으로 키프레임 생성', desc: '가속할 구간과 감속할 구간의 경계에 키프레임을 2개 만듭니다.' },
        { num: '03', title: '고무줄 바(Rubber band) 위아래 드래그', desc: '앞 구간은 <code>400%</code>로 올리고 중심 구간은 <code>30%</code>로 내립니다.' },
        { num: '04', title: '키프레임 분할(Split) 및 베지에 핸들 조정', desc: '키프레임 마커를 좌우로 벌려 램프 구간을 만들고 곡선 핸들을 꺾어 부드러운 가속을 만듭니다.' }
      ],
      davinci: [
        { num: '01', title: 'Retime Curve 열기', desc: '클립 우클릭 후 <code>Retime Curve</code>를 체크하여 트랙 아래 커브 창을 띄웁니다.' },
        { num: '02', title: 'Retime Speed 포인트 추가', desc: '스피드 포인트 핀을 꽂고 속도 그래프의 포인트를 곡선(Smooth) 모드로 전환합니다.' }
      ],
      capcut: [
        { num: '01', title: '속도 > 곡선(Curve) 탭 진입', desc: '속도 탭에서 [곡선]을 누르고 [사용자 지정]을 선택합니다.' },
        { num: '02', title: '포인트 높낮이 조절', desc: '타격 지점의 포인트를 0.3x로 낮추고 앞뒤 포인트를 4x로 올려 리듬을 만듭니다.' }
      ]
    },
    matchcut: {
      badge: "시각적 연속성 몽타주",
      title: "형태·모션 매치 컷 (Match Cut)",
      desc: "이전 씬의 움직임 방향(예: 좌에서 우로 이동)이나 피사체 형태(둥근 원)를 다음 씬과 완벽히 일치시켜 시각적 충격을 주는 연출입니다.",
      tip: "두 컷 사이의 정중앙에 모션 블러 트랜지션을 2프레임 정도 얇게 얹어주면 눈의 착시로 인해 한 호흡으로 이어지는 원테이크처럼 느껴집니다.",
      premiere: [
        { num: '01', title: '피사체 앵커 포인트 및 모션 방향 일치', desc: '이전 컷의 마지막 프레임과 다음 컷의 첫 프레임 피사체 중심 좌표를 일치시킵니다.' },
        { num: '02', title: '휩 팬(Whip Pan) 모션 오버레이', desc: '양 클립 교차점에 2프레임 길이의 방향 블러(Directional Blur, 90도)를 추가합니다.' }
      ],
      davinci: [
        { num: '01', title: 'Match Frame 기능으로 앵커 일치', desc: 'Edit 페이지에서 재생헤드를 두고 피사체의 벡터 속도값을 맞춥니다.' }
      ],
      capcut: [
        { num: '01', title: '트랜지션 > 카메라 이동 > 휩 좌/우 적용', desc: '0.1초 길이로 트랜지션을 극단적으로 짧게 걸어 매치컷을 완성합니다.' }
      ]
    },
    maskwipe: {
      badge: "오브젝트 마스킹 트랜지션",
      title: "오브젝트 패스 마스크 와이프 (Mask Wipe)",
      desc: "지나가는 기둥, 벽, 자동차 등 화면 전경을 가리는 물체의 경계선을 따라 다음 장면이 서서히 드러나는 착시 기법입니다.",
      tip: "마스크의 Feather(경계 부드러움) 값을 20px~35px 정도로 주어야 컴퓨터 그래픽 티가 나지 않고 렌즈 심도처럼 자연스럽습니다.",
      premiere: [
        { num: '01', title: '트랙 V1과 V2에 두 영상 겹쳐 배치', desc: 'V1에 들어올 영상 B, V2에 지나가는 영상 A를 배치합니다.' },
        { num: '02', title: '不투명도(Opacity) 펜 툴로 마스크 패스 생성', desc: '기둥 가장자리를 따라 펜으로 점을 찍어 마스크를 그립니다.' },
        { num: '03', title: '마스크 패스 키프레임 추적', desc: '기둥이 이동하는 프레임마다 마스크 위치를 옮겨주고 <code>마스크 페더: 25px</code>를 줍니다.' }
      ],
      davinci: [
        { num: '01', title: 'Color 페이지에서 파워 윈도우(Power Window) 생성', desc: 'Curve 도구로 물체 경계를 따고 트래커를 돌려 자동 추적합니다.' }
      ],
      capcut: [
        { num: '01', title: '마스크 > 분할/필름스트립 선택', desc: '키프레임으로 마스크 위치를 물체 이동에 맞춰 슬라이드합니다.' }
      ]
    }
  };

  // Render Preset into UI
  function loadPreset(presetKey) {
    state.currentPreset = presetKey;
    const data = PRESET_DATA[presetKey];
    if (!data) return;

    // Update preset buttons
    document.querySelectorAll('.preset-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === presetKey);
    });

    // Update Input
    const urlInput = document.getElementById('youtube-url-input');
    if (urlInput) urlInput.value = data.url;

    // Update Metric Cards
    document.getElementById('val-cut-pace').textContent = data.cutPace;
    document.querySelector('#val-cut-pace + .v-metric-sub').textContent = data.cutPaceSub;
    document.getElementById('val-hook-score').textContent = data.hookScore;
    document.querySelector('#val-hook-score + .v-metric-sub').textContent = data.hookSub;
    document.getElementById('val-sfx-layers').textContent = data.sfxLayers;
    document.querySelector('#val-sfx-layers + .v-metric-sub').textContent = data.sfxSub;
    document.getElementById('val-color-lut').textContent = data.colorLut;
    document.querySelector('#val-color-lut + .v-metric-sub').textContent = data.colorSub;

    // Update Video Mock Display
    document.getElementById('res-genre').textContent = data.genre;
    document.getElementById('res-headline').textContent = data.headline;

    // Render Timeline Markers
    renderTimelineMarkers(data.timelineMarkers);

    // Select first marker by default
    if (data.timelineMarkers.length > 0) {
      selectMarker(data.timelineMarkers[0].id, data.timelineMarkers[0].technique);
    }
  }

  // Render Markers on Multi-Track Timeline
  function renderTimelineMarkers(markers) {
    const lanes = {
      cuts: document.getElementById('lane-cuts'),
      motion: document.getElementById('lane-motion'),
      audio: document.getElementById('lane-audio'),
      text: document.getElementById('lane-text')
    };

    // Clear lanes
    Object.values(lanes).forEach(lane => {
      if (lane) lane.innerHTML = '';
    });

    markers.forEach(m => {
      const laneEl = lanes[m.lane];
      if (!laneEl) return;

      const markerEl = document.createElement('div');
      markerEl.className = `tl-marker marker-${m.type}`;
      markerEl.id = m.id;
      markerEl.style.left = `${m.pct}%`;
      markerEl.innerHTML = `<span>${m.label}</span>`;
      markerEl.title = `타임코드: ${m.time} | 클릭하여 재현 튜토리얼 확인`;

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        selectMarker(m.id, m.technique, m.pct, m.time);
      });

      laneEl.appendChild(markerEl);
    });
  }

  // Select marker and update right-side recipe guide
  function selectMarker(markerId, techniqueKey, pct = 20, timeStr = '00:02.00') {
    state.activeMarkerId = markerId;

    // Highlight timeline marker
    document.querySelectorAll('.tl-marker').forEach(m => m.classList.remove('active'));
    const targetMarker = document.getElementById(markerId);
    if (targetMarker) targetMarker.classList.add('active');

    // Update Scrubber Position
    const scrubberHandle = document.getElementById('scrubber-handle');
    const scrubberProgress = document.getElementById('scrubber-progress');
    const timeCurrent = document.getElementById('time-current');
    if (scrubberHandle && scrubberProgress) {
      scrubberHandle.style.left = `${pct}%`;
      scrubberProgress.style.width = `${pct}%`;
    }
    if (timeCurrent) timeCurrent.textContent = timeStr;

    // Update Recipe View
    renderTechniqueRecipe(techniqueKey);
  }

  // Render Recipe based on Selected Technique and Selected Tool
  function renderTechniqueRecipe(techniqueKey) {
    const recipe = TECHNIQUE_RECIPES[techniqueKey] || TECHNIQUE_RECIPES['crashzoom'];

    document.getElementById('guide-badge-type').textContent = recipe.badge;
    document.getElementById('guide-title-text').textContent = recipe.title;
    document.getElementById('guide-desc-text').textContent = recipe.desc;
    document.getElementById('protip-content').innerHTML = recipe.tip;

    // Update Detected Box in simulated player
    const detectedBox = document.getElementById('detected-box-element');
    if (detectedBox) {
      detectedBox.innerHTML = `<span class="tag-box">${recipe.title.split('(')[0].trim()}</span>`;
    }

    // Render Steps for current tool
    renderToolSteps(recipe);
  }

  function renderToolSteps(recipe) {
    const stepsContainer = document.getElementById('steps-container');
    if (!stepsContainer) return;
    stepsContainer.innerHTML = '';

    const currentToolKey = state.currentTool; // 'premiere', 'davinci', 'capcut'
    const toolSteps = recipe[currentToolKey] || recipe.premiere;

    toolSteps.forEach(step => {
      const stepCard = document.createElement('div');
      stepCard.className = 'step-card';
      stepCard.innerHTML = `
        <div class="step-badge">${step.num}</div>
        <div class="step-content">
          <div class="step-title">${step.title}</div>
          <div class="step-detail">${step.desc}</div>
        </div>
      `;
      stepsContainer.appendChild(stepCard);
    });
  }

  // Tool pills switcher (Pr / Dr / Cc)
  document.querySelectorAll('.tool-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentTool = btn.dataset.tool;

      // Re-render steps for current active marker
      const currentPresetData = PRESET_DATA[state.currentPreset];
      const activeMarker = currentPresetData?.timelineMarkers.find(m => m.id === state.activeMarkerId);
      const techKey = activeMarker ? activeMarker.technique : 'crashzoom';
      renderToolSteps(TECHNIQUE_RECIPES[techKey]);
      showToast(`${btn.textContent.trim()} 튜토리얼 스텝으로 전환되었습니다.`);
    });
  });

  // Preset Chips Clicks
  document.querySelectorAll('.preset-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      loadPreset(btn.dataset.preset);
      showToast(`'${btn.textContent.trim()}' 프리셋이 로드되었습니다.`);
    });
  });

  // Clear URL Button
  document.getElementById('btn-clear-url')?.addEventListener('click', () => {
    const input = document.getElementById('youtube-url-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  // Trigger Analysis Flow
  document.getElementById('btn-analyze')?.addEventListener('click', () => {
    runAnalysisSimulation();
  });

  function runAnalysisSimulation() {
    if (state.isAnalyzing) return;
    state.isAnalyzing = true;

    const loadingState = document.getElementById('analysis-loading');
    const resultsGrid = document.getElementById('analysis-results');
    const stageText = document.getElementById('loading-stage-text');
    const progressBar = document.getElementById('analysis-progress-bar');
    const percentCounter = document.getElementById('loading-percent-counter');
    const fpsCounter = document.getElementById('loading-fps-counter');

    if (loadingState && resultsGrid) {
      loadingState.style.display = 'flex';
      resultsGrid.style.opacity = '0.3';
      resultsGrid.style.pointerEvents = 'none';
    }

    const stages = [
      { pct: 18, text: "유튜브 비디오 스트림 다운로드 및 H.264 프레임 디코딩...", fps: "60 FPS 디코딩 완료" },
      { pct: 45, text: "옵티컬 플로우(Optical Flow) 장면 전환 및 점프컷 포인트 계산 중...", fps: "2,400개 프레임 벡터 추적" },
      { pct: 72, text: "FFT 오디오 주파수 대역 분석 및 사운드 덕킹 감쇄율 추출 중...", fps: "48kHz 스테레오 분석" },
      { pct: 92, text: "컬러 3D LUT 히스토그램 및 자막 모션 트래킹 좌표 매핑 완료...", fps: "신뢰도 98.7% 검증" },
      { pct: 100, text: "AI 역설계 분석 완료! 툴별 실행 가이드 렌더링 중...", fps: "분석 성공" }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < stages.length) {
        const cur = stages[step];
        if (progressBar) progressBar.style.width = `${cur.pct}%`;
        if (percentCounter) percentCounter.textContent = `${cur.pct}%`;
        if (stageText) stageText.textContent = cur.text;
        if (fpsCounter) fpsCounter.textContent = cur.fps;
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (loadingState && resultsGrid) {
            loadingState.style.display = 'none';
            resultsGrid.style.opacity = '1';
            resultsGrid.style.pointerEvents = 'auto';
          }
          state.isAnalyzing = false;
          showToast('영상 편집 기법 역설계 분석이 성공적으로 완료되었습니다!');
        }, 400);
      }
    }, 450);
  }

  // Copy Recipe Button
  document.getElementById('btn-copy-recipe')?.addEventListener('click', () => {
    const title = document.getElementById('guide-title-text')?.textContent || '';
    const desc = document.getElementById('guide-desc-text')?.textContent || '';
    const tip = document.getElementById('protip-content')?.textContent || '';
    const fullText = `[CineCraft AI 편집 기법 레시피]\n\n■ 기법명: ${title}\n■ 개요: ${desc}\n■ 프로 팁: ${tip}\n\n툴: Premiere Pro / DaVinci Resolve / CapCut 호환 가이드`;

    navigator.clipboard.writeText(fullText).then(() => {
      showToast('편집 기법 레시피가 클립보드에 복사되었습니다!');
    });
  });

  // Jump to Sandbox Direct Button
  document.getElementById('btn-open-sandbox-direct')?.addEventListener('click', () => {
    switchTab('sandbox');
    showToast('스피드 램핑 베지에 커브 샌드박스로 이동했습니다.');
  });


  /* ==========================================================================
     3. FEATURE 02: BIG DATA TREND RADAR & CHARTS
     ========================================================================== */

  // Trend Data Matrix by Category
  const TREND_DATA = {
    entertainment: {
      optCut: "1.15초",
      optCutDesc: "전년 대비 0.5초 단축 (초고속화)",
      hookSurv: "82.6%",
      hookDesc: "'3초 펀치 줌 + 자막' 적용 시 +28.4%",
      duckRate: "96.2%",
      topTrans: "다이내믹 크런치 줌",
      topTransRate: "이번 주 사용량 +48.2%",
      formulaTitle: '"엔터테인먼트 쇼츠 30초 풀 리텐션 아키텍처"',
      formulaDesc: "알고리즘 추천 30초 구간별 필수 편집 공식",
      blocks: [
        { phase: "phase-1", time: "00:00 ~ 00:03", title: "💥 3초 훅 앵커", desc: "시선 집중용 크런치 줌인 + 반전 질문 자막 + 우퍼 임팩트 사운드" },
        { phase: "phase-2", time: "00:03 ~ 00:10", title: "⚡ 1.2초 고속 컷", desc: "호흡 없는 점프컷 5회 연속 교차, BGM 비트에 싱크 맞춤" },
        { phase: "phase-3", time: "00:10 ~ 00:24", title: "🎯 가치 & 전개", desc: "핵심 스토리 전개, 보컬 사운드 덕킹 -18dB 유지 및 화면 회전 컷" },
        { phase: "phase-4", time: "00:24 ~ 00:30", title: "🔁 무한 루프 엔딩", desc: "영상의 첫 대사와 자연스럽게 이어지도록 설계된 루프 커넥터" }
      ],
      rankings: [
        { rank: 1, name: "첫 3초 크런치 줌 (Punch Zoom)", growth: "+48.2%", desc: "얼굴 또는 핵심 물체로 0.3초 내 급격한 확대" },
        { rank: 2, name: "비트 싱크 오디오 덕킹", growth: "+36.5%", desc: "음악 비트의 킥/스네어에 맞춘 자막 팝업" },
        { rank: 3, name: "3D 키네틱 타이포그래피", growth: "+31.0%", desc: "단어 단위로 입체 바운스 튀어나오는 자막" },
        { rank: 4, name: "화면 흑백 전환 + 긁는 효과음", growth: "+24.8%", desc: "당황/실수 상황에서 순식간에 채도 0% 전환" },
        { rank: 5, name: "모션 블러 휩 트랜지션", growth: "+19.3%", desc: "카메라를 빠르게 돌리는 듯한 씬 전환" }
      ]
    },
    vlog: {
      optCut: "2.80초",
      optCutDesc: "감성 몰입을 위한 안정적 템포",
      hookSurv: "74.1%",
      hookDesc: "'도심 앰비언스 + 매치컷' 조합 시 +19.5%",
      duckRate: "91.5%",
      topTrans: "마스킹 휩(Whip) 패스",
      topTransRate: "이번 주 사용량 +38.6%",
      formulaTitle: '"시네마틱 브이로그 감성 리듬 아키텍처"',
      formulaDesc: "빛과 공간의 미학을 극대화하는 슬로우 & 패스트 조화",
      blocks: [
        { phase: "phase-1", time: "00:00 ~ 00:05", title: "🌿 인트로 앰비언스", desc: "빗소리/도시 소음 ASMR과 함께 와이드 풍경 샷 슬로우 오픈" },
        { phase: "phase-2", time: "00:05 ~ 00:15", title: "☕ 스피드 램핑 매치컷", desc: "걸어가는 발걸음, 커피잔 놓는 모션에 맞춘 시간 가속 왜곡" },
        { phase: "phase-3", time: "00:15 ~ 00:35", title: "🎨 틸 앤 오렌지 룩", desc: "자연광 하이라이트 유지, 로우파이 피아노 곡과 부드러운 페이드" },
        { phase: "phase-4", time: "00:35 ~ 00:50", title: "🌅 페이드 아웃 여운", desc: "감성 타이틀 텍스트와 함께 잔잔한 리버브 사운드로 마무리" }
      ],
      rankings: [
        { rank: 1, name: "오브젝트 마스킹 휩 (Mask Wipe)", growth: "+38.6%", desc: "기둥이나 벽 뒤로 스쳐 지나가며 씬 교체" },
        { rank: 2, name: "베지에 스피드 램핑 (Speed Ramp)", growth: "+34.2%", desc: "400% 가속 후 30% 슬로우모션 완급 조절" },
        { rank: 3, name: "필름 번 & 라이트 리크 (Light Leak)", growth: "+28.7%", desc: "빈티지한 빛 번짐 아날로그 효과 오버레이" },
        { rank: 4, name: "공간계 리버브 잔향 페이드", growth: "+21.4%", desc: "실내에서 야외로 나갈 때 음향 공간감 확장" },
        { rank: 5, name: "틸 & 오렌지 2-Tone 컬러 그레이딩", growth: "+16.8%", desc: "헐리우드 영화풍 색감 보정 공식" }
      ]
    },
    tech: {
      optCut: "1.75초",
      optCutDesc: "정교한 정보 전달과 테크 B-Roll",
      hookSurv: "88.3%",
      hookDesc: "'제품 회전 매치컷' 조합 시 +32.1%",
      duckRate: "98.0%",
      topTrans: "360° 로테이션 B-Roll",
      topTransRate: "이번 주 사용량 +44.7%",
      formulaTitle: '"테크 리뷰 100% 신뢰도 극대화 아키텍처"',
      formulaDesc: "제품의 질감과 핵심 스펙을 선명하게 각인시키는 가이드",
      blocks: [
        { phase: "phase-1", time: "00:00 ~ 00:04", title: "🔍 충격적 결론 선제시", desc: "이 기기를 사야 하는 단 하나의 이유 요약 + 극적 매크로 샷" },
        { phase: "phase-2", time: "00:04 ~ 00:18", title: "⚙️ 3D 트래킹 스펙 B-Roll", desc: "제품이 회전할 때 본체 옆면에 증강현실처럼 따라붙는 스펙 자막" },
        { phase: "phase-3", time: "00:18 ~ 00:38", title: "📊 벤치마크 비교 그래프", desc: "경쟁사 대비 성능 격차 모션 그래픽 바 차트 애니메이션" },
        { phase: "phase-4", time: "00:38 ~ 00:50", title: "💡 추천 대상 요약 카드", desc: "누구에게 추천하는지 3가지 불릿 포인트 정리" }
      ],
      rankings: [
        { rank: 1, name: "360° 카메라 회전 매치 컷", growth: "+44.7%", desc: "시계 방향 회전 중 다음 앵글로 연속 전환" },
        { rank: 2, name: "3D 모션 트래킹 데이터 핀", growth: "+39.5%", desc: "물체 표면에 고정되어 함께 움직이는 텍스트" },
        { rank: 3, name: "기계음 마이크로 SFX (Mechanical Click)", growth: "+30.1%", desc: "버튼 클릭, 슬라이더 조작 시 고해상도 효과음" },
        { rank: 4, name: "다크 하이테크 스튜디오 조명 연출", growth: "+25.4%", desc: "매트 블랙 배경과 포인트 엣지 림라이트" },
        { rank: 5, name: "스플릿 스크린 듀얼 비교", growth: "+18.2%", desc: "A vs B 화면 5:5 분할 후 동시 재생" }
      ]
    },
    gaming: {
      optCut: "1.10초",
      optCutDesc: "초단위 킬 하이라이트 템포",
      hookSurv: "85.2%",
      hookDesc: "'클러치 순간 줌 + 우퍼' 시 +36.4%",
      duckRate: "95.0%",
      topTrans: "화면 쉐이크 & 글리치 컷",
      topTransRate: "이번 주 사용량 +52.1%",
      formulaTitle: '"게임 하이라이트 클러치 텐션 아키텍처"',
      formulaDesc: "스트리머의 리액션과 게임 속 명장면을 폭발시키는 구성",
      blocks: [
        { phase: "phase-1", time: "00:00 ~ 00:03", title: "😱 절체절명의 위기 훅", desc: "체력 1% 상황에서 스트리머의 비명 소리와 슬로우 줌인" },
        { phase: "phase-2", time: "00:03 ~ 00:12", title: "🎯 연속 킬 하이라이트", desc: "타격음마다 화면 흔들림(Camera Shake) + 타격 플래시" },
        { phase: "phase-3", time: "00:12 ~ 00:22", title: "😂 밈(Meme) 리액션 삽입", desc: "승리 직후 웃긴 밈 영상 0.5초 컷인으로 텐션 환기" },
        { phase: "phase-4", time: "00:22 ~ 00:30", title: "🏆 승리 자막 & 구독 유도", desc: "승리 모션 그래픽과 함께 다음 에피소드 예고" }
      ],
      rankings: [
        { rank: 1, name: "임팩트 카메라 쉐이크 (Camera Shake)", growth: "+52.1%", desc: "타격/폭발 순간 화면을 5프레임 흔드는 연출" },
        { rank: 2, name: "RGB 스플릿 글리치 (Glitch Cut)", growth: "+42.8%", desc: "색수차 왜곡을 주며 거칠게 넘어가는 컷전환" },
        { rank: 3, name: "슬로우모션 리플레이 펀치", growth: "+33.5%", desc: "결정적 순간을 다른 각도에서 0.5배속 재생" },
        { rank: 4, name: "서브 우퍼 베이스 드롭 (808 Bass)", growth: "+29.7%", desc: "저음역을 울려 타격감을 신체로 전달" },
        { rank: 5, name: "얼굴 캠 급확대 트래킹", growth: "+22.0%", desc: "스트리머의 눈동자나 입술로 급격히 줌인" }
      ]
    }
  };

  // Update Trend View based on Category
  function updateTrendData(categoryKey) {
    state.trendCategory = categoryKey;
    const catData = TREND_DATA[categoryKey] || TREND_DATA.entertainment;

    // Stat numbers
    document.getElementById('stat-opt-cut').textContent = catData.optCut;
    document.querySelector('#stat-opt-cut + .stat-change').innerHTML = `<i data-lucide="clock"></i> ${catData.optCutDesc}`;
    
    document.getElementById('stat-hook-survival').textContent = catData.hookSurv;
    document.querySelector('#stat-hook-survival + .stat-change').innerHTML = `<i data-lucide="zap"></i> ${catData.hookDesc}`;

    document.getElementById('stat-audio-duck').textContent = catData.duckRate;
    document.getElementById('stat-top-transition').textContent = catData.topTrans;
    document.querySelector('#stat-top-transition + .stat-change').innerHTML = `<i data-lucide="trending-up"></i> ${catData.topTransRate}`;

    // Blueprint Formula
    document.getElementById('formula-title').textContent = catData.formulaTitle;
    document.getElementById('formula-desc').textContent = catData.formulaDesc;

    const blueprintContainer = document.getElementById('blueprint-blocks');
    if (blueprintContainer) {
      blueprintContainer.innerHTML = '';
      catData.blocks.forEach(b => {
        const blk = document.createElement('div');
        blk.className = `blueprint-block ${b.phase}`;
        blk.innerHTML = `
          <div class="bb-time">${b.time}</div>
          <div class="bb-title">${b.title}</div>
          <div class="bb-desc">${b.desc}</div>
        `;
        blueprintContainer.appendChild(blk);
      });
    }

    // Top 5 Rankings
    const rankingList = document.getElementById('trend-ranking-list');
    if (rankingList) {
      rankingList.innerHTML = '';
      catData.rankings.forEach(r => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.innerHTML = `
          <div class="r-rank top-${r.rank}">#${r.rank}</div>
          <div class="r-info">
            <div class="r-name">${r.name} <span class="r-growth">${r.growth}</span></div>
            <div class="r-desc">${r.desc}</div>
          </div>
          <i data-lucide="chevron-right" style="width: 14px; height: 14px; color: #64748b;"></i>
        `;
        item.addEventListener('click', () => {
          showToast(`[${r.name}] 튜토리얼 레시피를 분석기에서 즉시 확인해보세요.`);
        });
        rankingList.appendChild(item);
      });
    }

    // Redraw Lucide icons
    if (window.lucide) window.lucide.createIcons();

    // Redraw Canvas Chart
    drawRetentionChart();
  }

  // Category select change
  document.getElementById('trend-category-select')?.addEventListener('change', (e) => {
    updateTrendData(e.target.value);
  });

  // Platform Toggle Buttons
  document.querySelectorAll('#platform-toggle .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#platform-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.trendPlatform = btn.dataset.platform;
      showToast(`'${btn.textContent.trim()}' 플랫폼 필터가 적용되었습니다.`);
      drawRetentionChart();
    });
  });

  // Draw Interactive Retention vs Cut Pace Chart on HTML5 Canvas
  function drawRetentionChart() {
    const canvas = document.getElementById('retention-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 600;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 35;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Draw Grid Lines & Y Labels (Retention: 0% ~ 100%)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    for (let r = 0; r <= 100; r += 25) {
      const y = padTop + plotH - (r / 100) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      ctx.fillText(`${r}%`, padLeft - 8, y + 3);
    }

    // X Labels: Cut Pace (0.5s, 1.0s, 1.5s, 2.0s, 3.0s, 4.0s, 5.0s)
    const xVals = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0];
    ctx.textAlign = 'center';
    xVals.forEach((val, idx) => {
      const x = padLeft + (idx / (xVals.length - 1)) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + plotH);
      ctx.stroke();
      ctx.fillText(`${val}s`, x, height - 12);
    });

    // Golden Zone Highlight Box (Between 1.0s and 1.8s)
    const goldStart = padLeft + (1 / 6) * plotW;
    const goldEnd = padLeft + (2.6 / 6) * plotW;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.fillRect(goldStart, padTop, goldEnd - goldStart, plotH);
    ctx.fillStyle = '#22d3ee';
    ctx.font = '10px Pretendard, sans-serif';
    ctx.fillText('황금 유지율 구간 (Golden Pacing)', (goldStart + goldEnd) / 2, padTop + 14);

    // Curve 1: Average Videos (Gray curve)
    const avgPoints = [
      { x: 0, y: 35 }, { x: 1, y: 55 }, { x: 2, y: 62 }, { x: 3, y: 58 }, { x: 4, y: 46 }, { x: 5, y: 32 }, { x: 6, y: 22 }
    ];

    // Curve 2: Top 5% Viral Videos (Neon Cyan Curve)
    const viralPoints = [
      { x: 0, y: 55 }, { x: 1, y: 84 }, { x: 2, y: 92 }, { x: 3, y: 88 }, { x: 4, y: 72 }, { x: 5, y: 52 }, { x: 6, y: 38 }
    ];

    function plotCurve(points, color, lineWidth, fillGradient = false) {
      ctx.beginPath();
      points.forEach((pt, i) => {
        const px = padLeft + (pt.x / 6) * plotW;
        const py = padTop + plotH - (pt.y / 100) * plotH;
        if (i === 0) ctx.moveTo(px, py);
        else {
          const prev = points[i - 1];
          const prevX = padLeft + (prev.x / 6) * plotW;
          const prevY = padTop + plotH - (prev.y / 100) * plotH;
          const cx1 = (prevX + px) / 2;
          ctx.bezierCurveTo(cx1, prevY, cx1, py, px, py);
        }
      });

      if (fillGradient) {
        ctx.lineTo(padLeft + plotW, padTop + plotH);
        ctx.lineTo(padLeft, padTop + plotH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke line after fill
        plotCurve(points, color, lineWidth, false);
        return;
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Draw Dots
      points.forEach(pt => {
        const px = padLeft + (pt.x / 6) * plotW;
        const py = padTop + plotH - (pt.y / 100) * plotH;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    plotCurve(avgPoints, '#64748b', 2, false);
    plotCurve(viralPoints, '#06b6d4', 3, true);
  }


  /* ==========================================================================
     4. FEATURE 03: PRO TECHNIQUE SANDBOX (BEZIER CURVE & MASKING)
     ========================================================================== */

  const bezierCanvas = document.getElementById('bezier-canvas');
  const sliderP1 = document.getElementById('slider-p1');
  const sliderP2 = document.getElementById('slider-p2');
  const valP1 = document.getElementById('val-p1');
  const valP2 = document.getElementById('val-p2');
  const bezierCssCode = document.getElementById('bezier-css-code');
  const speedActor = document.getElementById('speed-actor');
  const curSpeedVal = document.getElementById('cur-speed-val');
  const curAccelVal = document.getElementById('cur-accel-val');

  function drawBezierCurve() {
    if (!bezierCanvas) return;
    const ctx = bezierCanvas.getContext('2d');
    const width = bezierCanvas.parentElement.clientWidth || 440;
    const height = 200;
    bezierCanvas.width = width;
    bezierCanvas.height = height;

    const p1 = parseFloat(sliderP1?.value || state.p1);
    const p2 = parseFloat(sliderP2?.value || state.p2);
    state.p1 = p1;
    state.p2 = p2;

    if (valP1) valP1.textContent = p1.toFixed(2);
    if (valP2) valP2.textContent = p2.toFixed(2);
    if (bezierCssCode) bezierCssCode.textContent = `0.25, ${p1.toFixed(2)}, ${p2.toFixed(2)}, 1.00`;

    ctx.clearRect(0, 0, width, height);

    const pad = 35;
    const w = width - pad * 2;
    const h = height - pad * 2;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = pad + (i / 4) * w;
      const y = pad + (i / 4) * h;
      ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + w, y); ctx.stroke();
    }

    // Coordinate points: start (0, 1), end (1, 0) in canvas coords
    const x0 = pad, y0 = pad + h;
    const x3 = pad + w, y3 = pad;
    const x1 = pad + p1 * w, y1 = pad + h - (p1 * 0.8) * h;
    const x2 = pad + p2 * w, y2 = pad + h - (p2 * 1.1) * h;

    // Control Handle Lines
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
    ctx.moveTo(x3, y3); ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve Line
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    ctx.stroke();

    // Control Handles Handles
    ctx.fillStyle = '#ec4899';
    ctx.beginPath(); ctx.arc(x1, y1, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a855f7';
    ctx.beginPath(); ctx.arc(x2, y2, 5, 0, Math.PI * 2); ctx.fill();
  }

  // Animation Loop for Speed Ramping preview box
  let animTime = 0;
  function startActorAnimation() {
    if (state.actorAnimId) cancelAnimationFrame(state.actorAnimId);

    function stepAnim() {
      animTime = (animTime + 0.015) % 1;
      
      // Calculate cubic bezier timing approximation
      const p1 = state.p1;
      const p2 = state.p2;
      // standard cubic bezier approximation for t
      const t = animTime;
      const easePos = 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;

      if (speedActor) {
        const trackW = speedActor.parentElement.clientWidth - 26;
        speedActor.style.transform = `translateX(${easePos * trackW}px)`;
      }

      // Calculate instantaneous relative speed
      const speedPct = Math.round((easePos / (t + 0.001)) * 120);
      if (curSpeedVal) curSpeedVal.textContent = `${Math.min(speedPct, 450)}%`;
      if (curAccelVal) curAccelVal.textContent = `${((p2 - p1) * 9.8).toFixed(1)} m/s²`;

      state.actorAnimId = requestAnimationFrame(stepAnim);
    }

    state.actorAnimId = requestAnimationFrame(stepAnim);
  }

  sliderP1?.addEventListener('input', () => {
    drawBezierCurve();
  });
  sliderP2?.addEventListener('input', () => {
    drawBezierCurve();
  });

  // Bezier presets
  document.getElementById('btn-curve-preset-fast')?.addEventListener('click', () => {
    if (sliderP1) sliderP1.value = "0.05";
    if (sliderP2) sliderP2.value = "0.95";
    drawBezierCurve();
    showToast('슬로우모 펀치 베지에 곡선이 적용되었습니다.');
  });

  document.getElementById('btn-curve-preset-whip')?.addEventListener('click', () => {
    if (sliderP1) sliderP1.value = "0.75";
    if (sliderP2) sliderP2.value = "0.15";
    drawBezierCurve();
    showToast('휩 컷 급가속 베지에 곡선이 적용되었습니다.');
  });

  // Masking Simulator Trigger
  const btnReplayMask = document.getElementById('btn-replay-mask');
  const maskSceneB = document.getElementById('mask-scene-b');
  const maskPillar = document.getElementById('mask-pillar');

  function triggerMaskWipe() {
    if (!maskSceneB || !maskPillar) return;

    // Reset
    maskSceneB.style.transition = 'none';
    maskPillar.style.transition = 'none';
    maskSceneB.style.clipPath = 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)';
    maskPillar.style.left = '0%';

    setTimeout(() => {
      maskSceneB.style.transition = 'clip-path 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
      maskPillar.style.transition = 'left 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
      maskSceneB.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
      maskPillar.style.left = '92%';
    }, 50);
  }

  btnReplayMask?.addEventListener('click', triggerMaskWipe);

  // Auto trigger mask wipe every 4s if visible
  setInterval(() => {
    if (state.currentTab === 'sandbox') {
      triggerMaskWipe();
    }
  }, 4500);

  // Shortcuts Cheat Sheet Table Data
  const SHORTCUTS_DATA = [
    { name: "블레이드 / 컷 분할 (Split)", desc: "재생헤드 위치에서 선택된 클립 자르기", pr: "Ctrl + K / C", dr: "Ctrl + B", cc: "Ctrl + B" },
    { name: "리플 딜리트 (공백 삭제)", desc: "구간 삭제 후 뒤 클립을 앞으로 당겨 공백 제거", pr: "Shift + Del / Q, W", dr: "Shift + Backspace", cc: "Backspace" },
    { name: "재생 속도 / 듀레이션", desc: "클립의 속도를 조절하는 속도 패널 호출", pr: "Ctrl + R", dr: "Ctrl + R", cc: "우측 속도 탭" },
    { name: "타임라인 전체 확대/축소", desc: "타임라인을 전체 화면 길이에 맞게 피팅", pr: "\\ (역슬래시)", dr: "Shift + Z", cc: "Shift + Z" },
    { name: "오디오 게인(Gain) 조절", desc: "오디오 볼륨의 피크 데시벨(dB) 설정", pr: "G", dr: "Inspector Volume", cc: "볼륨 슬라이더" },
    { name: "마커(Marker) 추가", desc: "비트 또는 특정 타이밍에 핀 마커 생성", pr: "M", dr: "M", cc: "M" },
    { name: "키프레임 활성화 / 생성", desc: "선택된 파라미터에 애니메이션 키프레임 추가", pr: "스톱워치 아이콘", dr: "다이아몬드 클릭", cc: "다이아몬드 버튼" }
  ];

  function renderShortcuts(filterQuery = '') {
    const tbody = document.getElementById('shortcuts-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = SHORTCUTS_DATA.filter(item => 
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(filterQuery.toLowerCase())
    );

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.desc}</td>
        <td><span class="kbd-badge">${item.pr}</span></td>
        <td><span class="kbd-badge">${item.dr}</span></td>
        <td><span class="kbd-badge">${item.cc}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('shortcut-search')?.addEventListener('input', (e) => {
    renderShortcuts(e.target.value);
  });

  renderShortcuts();


  /* ==========================================================================
     5. FEATURE 04: SCHOOL LIFE RECORD (생기부) & PROPOSAL TAB
     ========================================================================== */

  // Copy Individual 생기부 Texts
  document.querySelectorAll('.btn-copy-st').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
          showToast('해당 교과 생기부 세특 문구가 복사되었습니다!');
        });
      }
    });
  });

  // Copy Entire Academic Proposal
  document.getElementById('btn-copy-proposal-text')?.addEventListener('click', () => {
    const reportEl = document.getElementById('printable-report');
    if (reportEl) {
      navigator.clipboard.writeText(reportEl.innerText).then(() => {
        showToast('전체 기획서 및 탐구 보고서 전문이 복사되었습니다!');
      });
    }
  });

  // Print / Save as PDF
  document.getElementById('btn-print-proposal')?.addEventListener('click', () => {
    window.print();
  });


  /* ==========================================================================
     6. GLOBAL TOAST HELPER
     ========================================================================== */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle-2"></i><span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Window resize handler for canvas redrawing
  window.addEventListener('resize', () => {
    if (state.currentTab === 'trend') drawRetentionChart();
    if (state.currentTab === 'sandbox') drawBezierCurve();
  });

  // Initial Boot
  loadPreset('mrbeast');
  updateTrendData('entertainment');
});
