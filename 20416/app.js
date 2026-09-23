/**
 * Study SoundGuard - Application Controller
 * Connects UI interactions, Web Audio engine, DSP controller, and visualizers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Subsystems
  const audioEngine = new AudioEngine();
  const adaptiveController = new AdaptiveController(audioEngine);
  const visualizer = new Visualizer();

  // 2. DOM Elements
  const masterStartBtn = document.getElementById('masterStartBtn');
  const masterStartText = document.getElementById('masterStartText');
  const systemStatusPill = document.getElementById('systemStatusPill');
  const systemStatusText = document.getElementById('systemStatusText');

  // Mode Toggles
  const headphoneModeToggle = document.getElementById('headphoneModeToggle');
  const audioDeviceModeLabel = document.getElementById('audioDeviceModeLabel');
  const audioDeviceModeSub = document.getElementById('audioDeviceModeSub');
  const freqAdaptiveToggle = document.getElementById('freqAdaptiveToggle');
  const adaptiveAutoToggle = document.getElementById('adaptiveAutoToggle');

  // Sliders and Displays
  const thresholdSlider = document.getElementById('thresholdSlider');
  const thresholdValDisplay = document.getElementById('thresholdValDisplay');
  const thresholdMarkLine = document.getElementById('thresholdMarkLine');

  const sensitivitySlider = document.getElementById('sensitivitySlider');
  const sensitivityValDisplay = document.getElementById('sensitivityValDisplay');

  const baseVolSlider = document.getElementById('baseVolSlider');
  const baseVolValDisplay = document.getElementById('baseVolValDisplay');

  const maxVolSlider = document.getElementById('maxVolSlider');
  const maxVolValDisplay = document.getElementById('maxVolValDisplay');

  const dbOffsetSlider = document.getElementById('dbOffsetSlider');
  const dbOffsetVal = document.getElementById('dbOffsetVal');

  // Engine Realtime Indicators
  const enginePulse = document.getElementById('enginePulse');
  const engineStatusTitle = document.getElementById('engineStatusTitle');
  const engineStatusSubtitle = document.getElementById('engineStatusSubtitle');
  const engineVolPercent = document.getElementById('engineVolPercent');
  const engineGainDelta = document.getElementById('engineGainDelta');
  const realtimeVolFill = document.getElementById('realtimeVolFill');

  // Sound Library
  const soundCards = document.querySelectorAll('.sound-card');
  const customAudioInput = document.getElementById('customAudioInput');
  const customFileNameText = document.getElementById('customFileNameText');

  // Presets
  const presetButtons = document.querySelectorAll('.btn-preset[data-preset]');
  const smoothButtons = document.querySelectorAll('.btn-preset[data-smooth]');
  const smoothingModeText = document.getElementById('smoothingModeText');

  // Timer Elements
  const timerDisplay = document.getElementById('timerDisplay');
  const timerToggleBtn = document.getElementById('timerToggleBtn');
  const timerToggleIcon = document.getElementById('timerToggleIcon');
  const timerBtnText = document.getElementById('timerBtnText');
  const timerResetBtn = document.getElementById('timerResetBtn');
  const timerPreset25Btn = document.getElementById('timerPreset25Btn');
  const timerPreset50Btn = document.getElementById('timerPreset50Btn');
  const timerPreset10Btn = document.getElementById('timerPreset10Btn');
  const timerStatusTag = document.getElementById('timerStatusTag');
  const timerProgressFill = document.getElementById('timerProgressFill');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // State
  let isRunning = false;
  let animationFrameId = null;
  let activePreset = 'library';

  // Timer State
  let timerDuration = 25 * 60; // seconds
  let timerRemaining = timerDuration;
  let timerInterval = null;
  let isTimerRunning = false;

  // ----------------------------------------------------
  // Toast Helper
  // ----------------------------------------------------
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeftColor = '#f43f5e';
    if (type === 'success') toast.style.borderLeftColor = '#10b981';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ----------------------------------------------------
  // Master Start / Stop Handler
  // ----------------------------------------------------
  async function toggleMasterSystem() {
    if (!isRunning) {
      // Start System
      masterStartBtn.disabled = true;
      masterStartText.textContent = '마이크 연결 중...';

      const micResult = await audioEngine.startMicrophone();
      if (!micResult.success) {
        showToast(`마이크 권한 오류: ${micResult.error}. 브라우저 마이크 접근을 허용해주세요.`, 'error');
        masterStartBtn.disabled = false;
        masterStartText.textContent = '시스템 시작';
        return;
      }

      // Start current sound
      const activeCard = document.querySelector('.sound-card.active');
      const soundType = activeCard ? activeCard.getAttribute('data-sound') : 'pink';
      await audioEngine.playSound(soundType);

      isRunning = true;
      masterStartBtn.disabled = false;
      masterStartBtn.classList.add('running');
      masterStartText.textContent = '시스템 정지';

      systemStatusPill.classList.add('active');
      systemStatusText.textContent = '실시간 소음 상쇄 작동 중';

      if (activeCard) activeCard.classList.add('playing');

      showToast(`적응형 소음 상쇄 엔진이 시작되었습니다 (${soundType.toUpperCase()})`, 'success');

      // Start RAF Loop
      startProcessingLoop();
    } else {
      // Stop System
      isRunning = false;
      audioEngine.stopMicrophone();
      audioEngine.stopCurrentSound();
      adaptiveController.reset();

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      masterStartBtn.classList.remove('running');
      masterStartText.textContent = '시스템 시작';

      systemStatusPill.classList.remove('active');
      systemStatusText.textContent = '대기 중 (Ready)';

      document.querySelectorAll('.sound-card').forEach(c => c.classList.remove('playing'));

      // Reset indicators
      engineStatusTitle.textContent = '상쇄 대기 중';
      engineStatusSubtitle.textContent = '시스템이 정지되었습니다';
      engineVolPercent.textContent = `${Math.round(adaptiveController.baseVolume * 100)}%`;
      engineGainDelta.textContent = '+0.0 dB';
      realtimeVolFill.style.width = `${Math.round(adaptiveController.baseVolume * 100)}%`;

      showToast('시스템이 안전하게 정지되었습니다.');
    }
  }

  masterStartBtn.addEventListener('click', toggleMasterSystem);

  // ----------------------------------------------------
  // Main DSP & Render Loop
  // ----------------------------------------------------
  function startProcessingLoop() {
    function loop() {
      if (!isRunning) return;

      // 1. Audio Engine measures mic acoustics
      const analysis = audioEngine.analyzeNoise();
      const currentDb = analysis.db;
      const bands = analysis.bands;
      const rawFft = analysis.rawFft;

      // 2. Adaptive DSP calculates target masking volume
      const result = adaptiveController.process(currentDb, bands);
      const outputVolume = result.outputVolume;
      const isMasking = result.isMaskingActive;
      const excessDb = result.dbDelta;
      const volPercent = Math.round(outputVolume * 100);

      // 3. Update Visualizations
      visualizer.updateDecibelGauge(currentDb);
      visualizer.updateFrequencyBands(bands);
      visualizer.drawSpectrum(rawFft);
      visualizer.drawHistory(currentDb, volPercent, isMasking, adaptiveController.thresholdDb);

      // 4. Update Engine Realtime Indicators
      engineVolPercent.textContent = `${volPercent}%`;
      realtimeVolFill.style.width = `${volPercent}%`;

      if (isMasking && excessDb > 0) {
        enginePulse.style.background = '#733E24';
        enginePulse.style.boxShadow = '0 0 14px rgba(115, 62, 36, 0.85)';
        engineStatusTitle.textContent = `소음 상쇄 강화 중 (+${excessDb.toFixed(1)} dB 감지)`;
        engineStatusSubtitle.textContent = `외부 소음 증가로 백색소음 볼륨이 자동 승강되었습니다`;
        engineGainDelta.textContent = `+${excessDb.toFixed(1)} dB 초과`;
        engineGainDelta.style.color = '#733E24';
      } else {
        enginePulse.style.background = '#245F73';
        enginePulse.style.boxShadow = '0 0 10px rgba(36, 95, 115, 0.6)';
        engineStatusTitle.textContent = '소음 상쇄 대기 (안정 소음)';
        engineStatusSubtitle.textContent = `소음이 ${adaptiveController.thresholdDb}dB 임계치 이하로 평온한 베이스 음량 유지 중`;
        engineGainDelta.textContent = '+0.0 dB';
        engineGainDelta.style.color = 'var(--text-muted)';
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    loop();
  }

  // ----------------------------------------------------
  // Sound Library Selection
  // ----------------------------------------------------
  soundCards.forEach(card => {
    card.addEventListener('click', async () => {
      soundCards.forEach(c => {
        c.classList.remove('active');
        c.classList.remove('playing');
      });
      card.classList.add('active');

      const soundType = card.getAttribute('data-sound');
      if (isRunning) {
        card.classList.add('playing');
        await audioEngine.playSound(soundType);
        showToast(`사운드 변경: ${card.querySelector('h3').textContent}`, 'info');
      }
    });
  });

  // Custom Audio File Loader
  customAudioInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    customFileNameText.textContent = `로드 중: ${file.name}`;
    try {
      const res = await audioEngine.loadCustomAudioFile(file);
      customFileNameText.textContent = `음원: ${file.name} (${Math.round(res.duration)}초)`;

      // Activate custom sound card or switch
      soundCards.forEach(c => c.classList.remove('active'));
      const activeCard = document.querySelector('.sound-card[data-sound="custom"]');
      if (activeCard) activeCard.classList.add('active');

      if (isRunning) {
        await audioEngine.playSound('custom');
      }
      showToast(`사용자 음원 로드 완료: ${file.name}`, 'success');
    } catch (err) {
      console.error(err);
      customFileNameText.textContent = '음원 로드 실패 (지원되지 않는 형식)';
      showToast('오디오 파일을 디코딩할 수 없습니다.', 'error');
    }
  });

  // ----------------------------------------------------
  // Slider Controls & Real-time Binding
  // ----------------------------------------------------
  function updateThreshold(val) {
    const v = parseFloat(val);
    thresholdSlider.value = v;
    thresholdValDisplay.textContent = `${v} dB`;
    adaptiveController.updateConfig({ thresholdDb: v });

    // Update threshold indicator bar on track
    const pct = Math.max(0, Math.min(100, ((v - 35) / 40) * 100));
    thresholdMarkLine.style.left = `${pct}%`;
  }

  thresholdSlider.addEventListener('input', (e) => {
    updateThreshold(e.target.value);
  });

  sensitivitySlider.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    sensitivityValDisplay.textContent = `${v.toFixed(1)}x`;
    adaptiveController.updateConfig({ sensitivity: v });
  });

  baseVolSlider.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    baseVolValDisplay.textContent = `${v}%`;
    adaptiveController.updateConfig({ baseVolume: v / 100 });
  });

  maxVolSlider.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    maxVolValDisplay.textContent = `${v}%`;
    adaptiveController.updateConfig({ maxVolume: v / 100 });
  });

  dbOffsetSlider.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    dbOffsetVal.textContent = `+${v} dB`;
    audioEngine.dbOffset = v;
  });

  // ----------------------------------------------------
  // Mode Switches
  // ----------------------------------------------------
  headphoneModeToggle.addEventListener('change', (e) => {
    const isHeadphone = e.target.checked;
    adaptiveController.updateConfig({ headphoneMode: isHeadphone });

    if (isHeadphone) {
      audioDeviceModeLabel.textContent = '이어폰 / 헤드폰 모드';
      audioDeviceModeSub.textContent = '출력음 마이크 피드백 없음';
      showToast('헤드폰 모드: 최적의 고감도 소음 측정이 적용됩니다.');
    } else {
      audioDeviceModeLabel.textContent = '노트북 스피커 모드';
      audioDeviceModeSub.textContent = '자체 스피커 소리 피드백 상쇄 보정';
      showToast('스피커 모드: 마이크 피드백 방지 필터링이 활성화되었습니다.');
    }
  });

  freqAdaptiveToggle.addEventListener('change', (e) => {
    adaptiveController.updateConfig({ frequencyAdaptive: e.target.checked });
    showToast(e.target.checked ? '주파수 맞춤 마스킹 켜짐' : '주파수 맞춤 마스킹 꺼짐');
  });

  adaptiveAutoToggle.addEventListener('change', (e) => {
    adaptiveController.updateConfig({ isEnabled: e.target.checked });
    showToast(e.target.checked ? '적응형 자동 볼륨 제어 켜짐' : '적응형 자동 볼륨 제어 꺼짐 (고정 음량)');
  });

  // ----------------------------------------------------
  // Room Presets
  // ----------------------------------------------------
  const presetConfigs = {
    library: { threshold: 45, sensitivity: 1.8, baseVol: 18, maxVol: 75, name: '독서실 / 조용한 도서관' },
    studycafe: { threshold: 52, sensitivity: 1.5, baseVol: 24, maxVol: 80, name: '스터디카페 / 잔잔한 소음' },
    home: { threshold: 58, sensitivity: 1.4, baseVol: 28, maxVol: 85, name: '가정집 / 생활소음' },
    exam: { threshold: 42, sensitivity: 2.2, baseVol: 15, maxVol: 70, name: '모의고사 집중 모드' }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.getAttribute('data-preset');
      const cfg = presetConfigs[presetKey];
      if (!cfg) return;

      activePreset = presetKey;
      updateThreshold(cfg.threshold);

      sensitivitySlider.value = cfg.sensitivity;
      sensitivityValDisplay.textContent = `${cfg.sensitivity.toFixed(1)}x`;

      baseVolSlider.value = cfg.baseVol;
      baseVolValDisplay.textContent = `${cfg.baseVol}%`;

      maxVolSlider.value = cfg.maxVol;
      maxVolValDisplay.textContent = `${cfg.maxVol}%`;

      adaptiveController.updateConfig({
        thresholdDb: cfg.threshold,
        sensitivity: cfg.sensitivity,
        baseVolume: cfg.baseVol / 100,
        maxVolume: cfg.maxVol / 100
      });

      showToast(`프리셋 적용: ${cfg.name}`);
    });
  });

  // Smoothing Presets
  const smoothConfigs = {
    'fast-attack': { attack: 0.18, release: 2.4, label: '빠른 반응 & 부드러운 복귀 (소음 즉각 차단, 180ms)' },
    'balanced': { attack: 0.35, release: 3.0, label: '균형 모드 (자연스러운 볼륨 페이드, 350ms)' },
    'gentle': { attack: 0.60, release: 4.2, label: '완만한 모드 (매우 완만한 볼륨 전환, 600ms)' }
  };

  smoothButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      smoothButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-smooth');
      const cfg = smoothConfigs[mode];
      if (!cfg) return;

      adaptiveController.updateConfig({
        attackTime: cfg.attack,
        releaseTime: cfg.release
      });
      smoothingModeText.textContent = cfg.label;
      showToast(`음량 반응 모드 변경: ${cfg.label}`);
    });
  });

  // ----------------------------------------------------
  // Pomodoro Focus Timer
  // ----------------------------------------------------
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerRemaining);
    if (timerProgressFill) {
      const pct = Math.max(0, Math.min(100, (timerRemaining / timerDuration) * 100));
      timerProgressFill.style.width = `${pct}%`;
    }
  }

  function setTimerChipActive(activeBtn) {
    [timerPreset25Btn, timerPreset50Btn, timerPreset10Btn].forEach(b => {
      if (b) b.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
  }

  function playChime() {
    try {
      const ctx = audioEngine.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch(e) {}
  }

  function toggleTimer() {
    if (!isTimerRunning) {
      isTimerRunning = true;
      if (timerBtnText) timerBtnText.textContent = '일시정지';
      timerToggleBtn.classList.add('running');
      if (timerToggleIcon) {
        timerToggleIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      }
      if (timerStatusTag) {
        timerStatusTag.textContent = '집중 진행 중';
        timerStatusTag.classList.add('running');
      }

      timerInterval = setInterval(() => {
        if (timerRemaining > 0) {
          timerRemaining--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          if (timerBtnText) timerBtnText.textContent = '시작';
          timerToggleBtn.classList.remove('running');
          if (timerToggleIcon) {
            timerToggleIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
          }
          if (timerStatusTag) {
            timerStatusTag.textContent = '세션 완료!';
            timerStatusTag.classList.remove('running');
          }
          playChime();
          showToast('🎉 집중 세션 완료! 편안한 휴식을 취하세요.', 'success');
        }
      }, 1000);
    } else {
      clearInterval(timerInterval);
      isTimerRunning = false;
      if (timerBtnText) timerBtnText.textContent = '재개';
      timerToggleBtn.classList.remove('running');
      if (timerToggleIcon) {
        timerToggleIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      }
      if (timerStatusTag) {
        timerStatusTag.textContent = '일시정지됨';
        timerStatusTag.classList.remove('running');
      }
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerRemaining = timerDuration;
    if (timerBtnText) timerBtnText.textContent = '시작';
    timerToggleBtn.classList.remove('running');
    if (timerToggleIcon) {
      timerToggleIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
    if (timerStatusTag) {
      timerStatusTag.textContent = '집중 준비';
      timerStatusTag.classList.remove('running');
    }
    updateTimerDisplay();
  }

  timerToggleBtn.addEventListener('click', toggleTimer);
  timerResetBtn.addEventListener('click', resetTimer);

  if (timerPreset25Btn) {
    timerPreset25Btn.addEventListener('click', () => {
      timerDuration = 25 * 60;
      setTimerChipActive(timerPreset25Btn);
      resetTimer();
      showToast('타이머 25분 집중으로 설정됨');
    });
  }

  if (timerPreset50Btn) {
    timerPreset50Btn.addEventListener('click', () => {
      timerDuration = 50 * 60;
      setTimerChipActive(timerPreset50Btn);
      resetTimer();
      showToast('타이머 50분 몰입으로 설정됨');
    });
  }

  if (timerPreset10Btn) {
    timerPreset10Btn.addEventListener('click', () => {
      timerDuration = 10 * 60;
      setTimerChipActive(timerPreset10Btn);
      resetTimer();
      showToast('타이머 10분 휴식으로 설정됨');
    });
  }

  // Initialize
  updateThreshold(48);
  updateTimerDisplay();
});
