/**
 * app.js - Main Application Orchestrator for EyeGlass AI Navigation
 * Coordinates Vision, Sound AI, Voice Guidance, HUD Rendering & Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Subsystems
  const audioNav = new AudioNavigationManager();
  const simRenderer = new SimulationRenderer(document.getElementById('simCanvas'));
  const soundDetector = new SoundDetector(audioNav, 'spectrumCanvas');
  const visionEngine = new VisionEngine(audioNav, 'hudCanvas', 'webcamVideo');

  // Application State
  let currentScenarioKey = 'sidewalk';
  let isHighContrast = false;
  let is3dAudioActive = true;
  let stepCounter = 438;
  let walkSpeedVal = 1.2;

  // DOM Elements Cache
  const navBanner = document.getElementById('navBanner');
  const guidanceMainMsg = document.getElementById('guidanceMainMsg');
  const guidanceSubMsg = document.getElementById('guidanceSubMsg');
  const distanceBadge = document.getElementById('distanceBadge');
  const urgentThreatAlert = document.getElementById('urgentThreatAlert');
  const urgentAlertText = document.getElementById('urgentAlertText');
  const bannerIconBox = document.getElementById('bannerIconBox');

  const voiceAssistantBtn = document.getElementById('voiceAssistantBtn');
  const voiceModal = document.getElementById('voiceModal');
  const voiceTranscript = document.getElementById('voiceTranscript');
  const closeVoiceModalBtn = document.getElementById('closeVoiceModalBtn');

  const ttsToggleBtn = document.getElementById('ttsToggleBtn');
  const ttsIcon = document.getElementById('ttsIcon');
  const ttsTxt = document.getElementById('ttsTxt');

  const highContrastBtn = document.getElementById('highContrastBtn');
  const spatialAudioBtn = document.getElementById('spatialAudioBtn');
  const triggerSoundBtn = document.getElementById('triggerSoundBtn');

  const sosBtn = document.getElementById('sosBtn');
  const sosModal = document.getElementById('sosModal');
  const cancelSosBtn = document.getElementById('cancelSosBtn');
  const confirmSosCallBtn = document.getElementById('confirmSosCallBtn');

  const helpBtn = document.getElementById('helpBtn');
  const helpDrawer = document.getElementById('helpDrawer');
  const closeHelpBtn = document.getElementById('closeHelpBtn');

  const liveClockEl = document.getElementById('liveClock');
  const stepCountEl = document.getElementById('stepCount');
  const walkSpeedEl = document.getElementById('walkSpeed');

  // Resize handler
  function handleResize() {
    simRenderer.resize();
    visionEngine.resize();
  }
  window.addEventListener('resize', handleResize);
  handleResize();

  // Clock & Telemetry updater
  setInterval(() => {
    const now = new Date();
    if (liveClockEl) {
      liveClockEl.textContent = now.toTimeString().split(' ')[0];
    }

    // Step counter simulation
    if (currentScenarioKey !== 'danger') {
      stepCounter += 1;
      if (stepCountEl) stepCountEl.textContent = stepCounter;
    }
  }, 1000);

  /**
   * Load and Apply Scenario
   */
  function applyScenario(scenarioKey) {
    currentScenarioKey = scenarioKey;
    const scen = SCENARIOS[scenarioKey];
    if (!scen) return;

    // Update active button state
    document.querySelectorAll('.scenario-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scenario === scenarioKey);
    });

    if (scenarioKey === 'camera') {
      visionEngine.startCamera();
      soundDetector.startMicrophone();
    } else {
      visionEngine.stopCamera();
    }

    // Update HUD Guidance Banner
    guidanceMainMsg.textContent = scen.mainGuidance;
    guidanceSubMsg.textContent = scen.subGuidance;
    distanceBadge.textContent = scen.distanceText;

    navBanner.className = `primary-nav-banner ${scen.statusType}`;

    // SVG icon updates based on type
    if (scen.statusType === 'danger') {
      bannerIconBox.innerHTML = `
        <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
      walkSpeedVal = 0.0;
      if (urgentThreatAlert && scen.urgentAlert) {
        urgentThreatAlert.classList.remove('hidden');
        urgentAlertText.textContent = scen.urgentAlert;
      }
    } else if (scen.statusType === 'warning') {
      bannerIconBox.innerHTML = `
        <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
      walkSpeedVal = 0.7;
      if (urgentThreatAlert) urgentThreatAlert.classList.add('hidden');
    } else {
      bannerIconBox.innerHTML = `
        <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 2v20M12 2l-7 7M12 2l7 7"/>
        </svg>
      `;
      walkSpeedVal = 1.2;
      if (urgentThreatAlert) urgentThreatAlert.classList.add('hidden');
    }

    if (walkSpeedEl) walkSpeedEl.textContent = walkSpeedVal.toFixed(1);

    // Feed subsystems
    visionEngine.setObjects(scen.objects, scen.ocrText);
    soundDetector.setSounds(scen.sounds);

    // Voice announcement of scenario change
    const voiceMsg = `${scen.mainGuidance}. ${scen.subGuidance}`;
    audioNav.speak(voiceMsg, scen.statusType === 'danger' ? 'critical' : 'normal');

    // Chime
    if (scen.statusType === 'danger') {
      audioNav.synthesizeHazardSound('horn', 0.5);
    } else {
      audioNav.playChime(580, 0.15, 0);
    }
  }

  // Bind Scenario Buttons
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audioNav.ensureAudioContext();
      applyScenario(btn.dataset.scenario);
    });
  });

  /**
   * Comprehensive Voice Status Briefing
   */
  function speakFullBriefing() {
    audioNav.ensureAudioContext();
    const scen = SCENARIOS[currentScenarioKey];
    if (!scen) return;

    let briefing = `현재 상태 브리핑입니다. ${scen.mainGuidance}. ${scen.subGuidance}. `;

    // Obstacle summary
    const hazards = scen.objects.filter(o => o.dangerLevel !== 'info');
    if (hazards.length > 0) {
      const hazardDesc = hazards.map(h => `${h.clockDir} 방향 ${h.distance}미터 앞 ${h.name}`).join(', ');
      briefing += `주의 장애물: ${hazardDesc}. `;
    } else {
      briefing += `전방에 직접적인 충돌 위험 장애물은 없습니다. `;
    }

    // Sound summary
    if (scen.sounds && scen.sounds.length > 0) {
      const highSounds = scen.sounds.filter(s => s.priority === 'critical' || s.priority === 'high');
      if (highSounds.length > 0) {
        briefing += `주변 소리 경고: ${highSounds.map(s => s.alertMsg).join(', ')}. `;
      }
    }

    if (scen.ocrText) {
      briefing += `인식된 간판: ${scen.ocrText}`;
    }

    audioNav.speak(briefing, scen.statusType === 'danger' ? 'critical' : 'normal');
  }

  /**
   * Voice Command Handler
   */
  function handleVoiceCommand(cmd) {
    if (voiceTranscript) voiceTranscript.textContent = `"${cmd}"`;

    if (cmd.includes('상태') || cmd.includes('어디') || cmd.includes('브리핑') || cmd.includes('상황')) {
      speakFullBriefing();
    } else if (cmd.includes('장애물') || cmd.includes('앞에')) {
      const scen = SCENARIOS[currentScenarioKey];
      const obs = scen.objects.map(o => `${o.clockDir} 방향 ${o.distance}미터에 ${o.name}`).join('. ');
      audioNav.speak(`전방 인식 사물 안내입니다: ${obs}`);
    } else if (cmd.includes('신호등')) {
      if (currentScenarioKey === 'crosswalk') {
        audioNav.speak('현재 보행 신호등 초록불입니다. 잔여 시간 18초 남았습니다. 횡단보도를 건너세요.');
      } else {
        audioNav.speak('현재 위치 전방 45미터 앞 횡단보도가 감지되었습니다.');
      }
    } else if (cmd.includes('소리') || cmd.includes('위험')) {
      const sounds = soundDetector.activeSounds;
      if (sounds.length > 0) {
        const desc = sounds.map(s => `${s.name} ${s.distance}미터 감지`).join(', ');
        audioNav.speak(`주변 사운드 탐지 현황: ${desc}`);
      } else {
        audioNav.speak('현재 주변에 특이한 위험 소리는 탐지되지 않았습니다.');
      }
    } else if (cmd.includes('도와줘') || cmd.includes('신고') || cmd.includes('sos')) {
      triggerSosEmergency();
    } else if (cmd.includes('고대비')) {
      toggleHighContrast();
    } else if (cmd.includes('1') || cmd.includes('보도')) {
      applyScenario('sidewalk');
    } else if (cmd.includes('2') || cmd.includes('횡단')) {
      applyScenario('crosswalk');
    } else if (cmd.includes('3') || cmd.includes('위험')) {
      applyScenario('danger');
    } else if (cmd.includes('4') || cmd.includes('공사')) {
      applyScenario('construction');
    } else if (cmd.includes('카메라') || cmd.includes('캠')) {
      applyScenario('camera');
    } else {
      audioNav.speak(`말씀하신 "${cmd}" 명령을 확인했습니다. 현재 전방 안전 보행을 계속 진행합니다.`);
    }

    setTimeout(() => {
      voiceModal.classList.add('hidden');
    }, 1800);
  }

  // Voice Assistant UI Trigger
  voiceAssistantBtn.addEventListener('click', () => {
    audioNav.ensureAudioContext();
    voiceModal.classList.remove('hidden');
    if (voiceTranscript) voiceTranscript.textContent = '음성을 듣고 있습니다... 말씀하세요';

    audioNav.startListening(
      (transcript, isFinal) => {
        if (voiceTranscript) voiceTranscript.textContent = `"${transcript}"`;
      },
      (isListening) => {
        const statusEl = document.getElementById('voiceStatusText');
        if (statusEl) statusEl.textContent = isListening ? '음성 분석 중...' : '클릭 또는 Space';
      },
      handleVoiceCommand
    );
  });

  closeVoiceModalBtn.addEventListener('click', () => {
    audioNav.stopListening();
    voiceModal.classList.add('hidden');
  });

  // Sample Query Chips inside Voice Modal
  document.querySelectorAll('.sample-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      handleVoiceCommand(q);
    });
  });

  /**
   * Sound Testing Trigger Button (Simulates Horn / Bell / Siren / Beacon)
   */
  let soundTestIndex = 0;
  const testSoundTypes = [
    { type: 'horn', name: '차량 경적 (빵빵)', angle: 260, dist: 4.0, alert: '좌측 후방 차량 경적 감지! 주의하세요!' },
    { type: 'bell', name: '자전거 벨 (따릉따릉)', angle: 75, dist: 3.2, alert: '우측 전방 2시 방향 자전거 벨 소리 감지!' },
    { type: 'beacon', name: '음향신호기 삐- 뻐-', angle: 0, dist: 8.0, alert: '전방 12시 방향 음향신호기 소리 유도 중' }
  ];

  triggerSoundBtn.addEventListener('click', () => {
    audioNav.ensureAudioContext();
    const test = testSoundTypes[soundTestIndex % testSoundTypes.length];
    soundTestIndex++;

    soundDetector.triggerSoundEvent({
      id: 'test_snd_' + Date.now(),
      name: test.name,
      type: test.type,
      angle: test.angle,
      distance: test.dist,
      db: 88,
      alertMsg: test.alert,
      priority: test.type === 'beacon' ? 'medium' : 'critical'
    });
  });

  /**
   * TTS Guidance Mute Toggle
   */
  ttsToggleBtn.addEventListener('click', () => {
    audioNav.ensureAudioContext();
    const muted = audioNav.toggleMute();
    ttsIcon.textContent = muted ? '🔇' : '🔊';
    ttsTxt.textContent = muted ? '음성 꺼짐' : '음성 켜짐';
    ttsToggleBtn.classList.toggle('active-state', !muted);
  });

  /**
   * Low-Vision High-Contrast Mode Toggle
   */
  function toggleHighContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('theme-high-contrast', isHighContrast);
    highContrastBtn.classList.toggle('active-state', isHighContrast);
    audioNav.speak(isHighContrast ? '저시력자용 초고대비 모드가 활성화되었습니다.' : '초고대비 모드가 해제되었습니다.');
  }
  highContrastBtn.addEventListener('click', toggleHighContrast);

  /**
   * 3D Spatial Audio Toggle
   */
  spatialAudioBtn.addEventListener('click', () => {
    is3dAudioActive = !is3dAudioActive;
    spatialAudioBtn.classList.toggle('active-state', is3dAudioActive);
    audioNav.playSpatialBeep(is3dAudioActive ? -0.8 : 0, 800, 0.15);
    setTimeout(() => {
      audioNav.playSpatialBeep(is3dAudioActive ? 0.8 : 0, 1000, 0.15);
    }, 180);
    audioNav.speak(is3dAudioActive ? '3D 입체 음향 활성화됨. 이어폰 양쪽 방향 구분이 작동합니다.' : '3D 입체 음향 비활성화됨.');
  });

  /**
   * Emergency SOS
   */
  function triggerSosEmergency() {
    audioNav.ensureAudioContext();
    sosModal.classList.remove('hidden');
    audioNav.speak('긴급 비상 SOS가 작동되었습니다! 현재 위치와 카메라 영상을 119 및 보호자에게 전송합니다!', 'critical');
    audioNav.synthesizeHazardSound('horn', 0);
  }

  sosBtn.addEventListener('click', triggerSosEmergency);

  cancelSosBtn.addEventListener('click', () => {
    sosModal.classList.add('hidden');
    audioNav.speak('SOS 비상 호출이 해제되었습니다.');
  });

  confirmSosCallBtn.addEventListener('click', () => {
    alert('보호자(010-XXXX-5678)에게 직접 전화 통화가 연결됩니다.');
    sosModal.classList.add('hidden');
  });

  /**
   * Help & Shortcut Drawer
   */
  helpBtn.addEventListener('click', () => helpDrawer.classList.remove('hidden'));
  closeHelpBtn.addEventListener('click', () => helpDrawer.classList.add('hidden'));

  /**
   * Keyboard Shortcuts
   */
  window.addEventListener('keydown', (e) => {
    // Avoid interfering if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    audioNav.ensureAudioContext();

    if (e.code === 'Space') {
      e.preventDefault();
      speakFullBriefing();
    } else if (e.key === '1') {
      applyScenario('sidewalk');
    } else if (e.key === '2') {
      applyScenario('crosswalk');
    } else if (e.key === '3') {
      applyScenario('danger');
    } else if (e.key === '4') {
      applyScenario('construction');
    } else if (e.key === '5' || e.key.toLowerCase() === 'c') {
      applyScenario('camera');
    } else if (e.key.toLowerCase() === 'h') {
      toggleHighContrast();
    } else if (e.key.toLowerCase() === 'm') {
      ttsToggleBtn.click();
    } else if (e.key.toLowerCase() === 's') {
      triggerSosEmergency();
    } else if (e.key.toLowerCase() === 't') {
      triggerSoundBtn.click();
    }
  });

  /**
   * Mobile Gesture: Double Tap anywhere on screen to speak Status Briefing
   */
  let lastTap = 0;
  document.body.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 400 && tapLength > 0) {
      e.preventDefault();
      speakFullBriefing();
    }
    lastTap = currentTime;
  });

  /**
   * Main Animation Loop (60 FPS)
   */
  function mainLoop(time) {
    // Render simulated 3D street background (only if not in real camera mode)
    if (currentScenarioKey !== 'camera') {
      simRenderer.render(currentScenarioKey, time);
    }

    // Render AR HUD overlay on top
    visionEngine.render(time);

    // Update Acoustic sound spectrum & radar
    soundDetector.update(time);

    requestAnimationFrame(mainLoop);
  }

  // Initial Scenario load
  applyScenario('sidewalk');

  // Start Animation Loop
  requestAnimationFrame(mainLoop);

  console.log('EyeGlass AI Navigation System initialized successfully.');
});
