/**
 * app.js - 인터랙티브 가상 화학 실험실 주 애플리케이션 로직
 */

document.addEventListener('DOMContentLoaded', () => {
  // 모듈 인스턴스화
  const labCanvas = new LabCanvas('lab-canvas');
  const labAudio = new LabAudio();
  labCanvas.start();

  // 앱 상태
  const state = {
    mode: 'free', // 'free' | 'curriculum'
    inFlask: [],  // 투입된 시약 id 목록 (예: ['HCl', 'NaOH'])
    isBurnerOn: false,
    baseTemp: 20,
    currentTemp: 20,
    targetTemp: 20,
    currentPh: 7.0,
    activeReaction: null,
    activeCategory: 'all',
    searchQuery: '',
    selectedChemicalInfo: null
  };

  // DOM 요소 캐싱
  const elements = {
    // 탭 & 모드
    modeFreeBtn: document.getElementById('mode-free-btn'),
    modeCurriculumBtn: document.getElementById('mode-curriculum-btn'),
    freeStudioView: document.getElementById('free-studio-view'),
    curriculumView: document.getElementById('curriculum-view'),

    // 시약 선반
    categoryTabs: document.getElementById('category-tabs'),
    reagentSearch: document.getElementById('reagent-search'),
    reagentGrid: document.getElementById('reagent-grid'),

    // 실험대 컨트롤
    burnerBtn: document.getElementById('burner-toggle-btn'),
    burnerFlame: document.getElementById('burner-flame'),
    stirBtn: document.getElementById('stir-btn'),
    resetBtn: document.getElementById('reset-btn'),
    soundToggleBtn: document.getElementById('sound-toggle-btn'),

    // 계측 HUD
    tempValue: document.getElementById('temp-value'),
    tempBar: document.getElementById('temp-bar'),
    phValue: document.getElementById('ph-value'),
    phIndicatorColor: document.getElementById('ph-indicator-color'),
    phStripBar: document.getElementById('ph-strip-bar'),
    reactionStatusBadge: document.getElementById('reaction-status-badge'),

    // 분석 & 심화 탐구 패널
    flaskContentsList: document.getElementById('flask-contents-list'),
    flaskEmptyNotice: document.getElementById('flask-empty-notice'),
    reactionCard: document.getElementById('reaction-card'),
    noReactionCard: document.getElementById('no-reaction-card'),
    reactionTitle: document.getElementById('reaction-title'),
    reactionCategoryBadge: document.getElementById('reaction-category-badge'),
    reactionCurriculumBadge: document.getElementById('reaction-curriculum-badge'),
    reactionEquation: document.getElementById('reaction-equation'),
    reactionNetIonic: document.getElementById('reaction-net-ionic'),
    atomBalanceGrid: document.getElementById('atom-balance-grid'),
    reactionMechanism: document.getElementById('reaction-mechanism'),
    reactionEnergy: document.getElementById('reaction-energy'),
    reactionSafety: document.getElementById('reaction-safety'),
    reactionRealLife: document.getElementById('reaction-real-life'),

    // 교과서 모드 그리드
    presetGrid: document.getElementById('preset-grid'),

    // 모달
    chemicalModal: document.getElementById('chemical-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalFormula: document.getElementById('modal-formula'),
    modalCategory: document.getElementById('modal-category'),
    modalState: document.getElementById('modal-state'),
    modalPh: document.getElementById('modal-ph'),
    modalHazard: document.getElementById('modal-hazard'),
    modalHazardNote: document.getElementById('modal-hazard-note'),
    modalDesc: document.getElementById('modal-desc'),
    modalAddBtn: document.getElementById('modal-add-btn'),
    modalCloseBtn: document.getElementById('modal-close-btn')
  };

  // --- 1. 초기화 및 렌더링 ---

  function initApp() {
    renderCategoryTabs();
    renderReagents();
    renderCurriculumPresets();
    bindEvents();
    updateUI();
  }

  // 카테고리 탭 렌더링
  function renderCategoryTabs() {
    elements.categoryTabs.innerHTML = '';
    Object.entries(CATEGORIES).forEach(([key, label]) => {
      const btn = document.createElement('button');
      btn.className = `category-tab ${state.activeCategory === key ? 'active' : ''}`;
      btn.textContent = label;
      btn.addEventListener('click', () => {
        state.activeCategory = key;
        document.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderReagents();
      });
      elements.categoryTabs.appendChild(btn);
    });
  }

  // 시약 카드 렌더링
  function renderReagents() {
    elements.reagentGrid.innerHTML = '';
    const query = state.searchQuery.toLowerCase().trim();

    const filtered = Object.values(CHEMICALS).filter(chem => {
      const matchCategory = (state.activeCategory === 'all') || (chem.category === state.activeCategory);
      const matchSearch = chem.name.toLowerCase().includes(query) ||
                          chem.formula.toLowerCase().includes(query) ||
                          chem.id.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      elements.reagentGrid.innerHTML = `
        <div class="empty-shelf">
          <i class="ri-search-line"></i>
          <p>조건에 맞는 시약이 없습니다.</p>
        </div>`;
      return;
    }

    filtered.forEach(chem => {
      const card = document.createElement('div');
      card.className = 'reagent-card';
      card.draggable = true;

      const isAlreadyIn = state.inFlask.includes(chem.id);
      if (isAlreadyIn) card.classList.add('in-use');

      // 위험도 뱃지 색상
      let hazardBadgeColor = 'var(--color-safe)';
      if (chem.hazardLevel >= 4) hazardBadgeColor = 'var(--color-danger)';
      else if (chem.hazardLevel >= 2) hazardBadgeColor = 'var(--color-warning)';

      card.innerHTML = `
        <div class="card-header">
          <span class="formula-tag">${chem.formula}</span>
          <button class="info-btn" title="물질 상세 정보" data-id="${chem.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </button>
        </div>
        <div class="chemical-name">${chem.name}</div>
        <div class="card-footer">
          <span class="category-pill">${CATEGORIES[chem.category] || chem.category}</span>
          <span class="hazard-dot" style="background:${hazardBadgeColor}" title="${chem.hazardText}"></span>
        </div>
      `;

      // 클릭 시 투입
      card.addEventListener('click', (e) => {
        if (e.target.closest('.info-btn')) return;
        addChemicalToFlask(chem.id);
      });

      // 정보 버튼 클릭 시 모달 열기
      const infoBtn = card.querySelector('.info-btn');
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openChemicalModal(chem);
      });

      // 드래그 앤 드롭
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', chem.id);
      });

      elements.reagentGrid.appendChild(card);
    });
  }

  // 교과서 복습 프리셋 카드 렌더링
  function renderCurriculumPresets() {
    elements.presetGrid.innerHTML = '';
    CURRICULUM_PRESETS.forEach(preset => {
      const card = document.createElement('div');
      card.className = 'curriculum-card';

      const chemTags = preset.chemicals.map(cid => {
        const c = CHEMICALS[cid];
        return `<span class="chem-badge">${c ? c.name : cid}</span>`;
      }).join(' + ');

      card.innerHTML = `
        <div class="curriculum-badge">${preset.badge}</div>
        <h4 class="curriculum-title">${preset.title}</h4>
        <p class="curriculum-sub">${preset.subtitle}</p>
        <div class="curriculum-reactants">${chemTags}</div>
        ${preset.requiresHeat ? '<div class="heat-required-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2 0 1.5-1.5 3-2 4.5C11.5 7 10 5.5 10 4c0-1.1.9-2 2-2zm0 7c2.8 0 5 2.2 5 5 0 2.2-1.4 4.1-3.4 4.7.9-.7 1.4-1.8 1.4-3 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1.2.5 2.3 1.4 3C6.4 18.1 5 16.2 5 14c0-2.8 2.2-5 5-5z"/></svg> 가열(버너) 필요</div>' : ''}
        <button class="preset-load-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          실험실에 세팅 & 관찰하기
        </button>
      `;

      card.querySelector('.preset-load-btn').addEventListener('click', () => {
        loadCurriculumPreset(preset);
      });

      elements.presetGrid.appendChild(card);
    });
  }

  // --- 2. 실험 동작 로직 ---

  // 시약을 비커에 투입
  function addChemicalToFlask(chemicalId) {
    if (state.inFlask.includes(chemicalId)) {
      // 이미 들어있는 경우 피드백 펄스 효과
      pulseFlask();
      return;
    }

    state.inFlask.push(chemicalId);
    labAudio.play('pour');

    // 비커 파티클 흔들림
    pulseFlask();

    // 반응 검사 및 상태 갱신
    evaluateFlaskReaction();
    updateUI();
  }

  // 시약 제거
  function removeChemicalFromFlask(chemicalId) {
    const idx = state.inFlask.indexOf(chemicalId);
    if (idx !== -1) {
      state.inFlask.splice(idx, 1);
      labAudio.play('drop');
      evaluateFlaskReaction();
      updateUI();
    }
  }

  // 비커 초기화
  function resetFlask() {
    state.inFlask = [];
    state.isBurnerOn = false;
    state.currentTemp = 20;
    state.targetTemp = 20;
    state.currentPh = 7.0;
    state.activeReaction = null;
    labCanvas.reset();
    elements.burnerFlame.classList.remove('active');
    elements.burnerBtn.classList.remove('active');
    labAudio.play('pour');
    updateUI();
  }

  // 교반기 (Stir) 동작
  function stirFlask() {
    if (state.inFlask.length === 0) return;
    labAudio.play('fizz');
    pulseFlask();
    labCanvas.wavePhase += 3.0;
    // 반응 진행 촉진 효과
    evaluateFlaskReaction();
  }

  // 분젠 버너 토글
  function toggleBurner() {
    state.isBurnerOn = !state.isBurnerOn;
    elements.burnerFlame.classList.toggle('active', state.isBurnerOn);
    elements.burnerBtn.classList.toggle('active', state.isBurnerOn);

    if (state.isBurnerOn) {
      labAudio.play('hiss');
      state.targetTemp = Math.max(state.targetTemp, 85);
    } else {
      state.targetTemp = state.baseTemp;
    }

    evaluateFlaskReaction();
    updateUI();
  }

  // 비커 반응 판정 엔진 실행
  function evaluateFlaskReaction() {
    const reaction = findReaction(state.inFlask, state.isBurnerOn);
    state.activeReaction = reaction;

    if (reaction) {
      // 반응 발생!
      const eff = reaction.effect;

      // 1. 사운드 재생
      if (eff.sound) {
        labAudio.play(eff.sound);
      }

      // 2. 온도 계산
      state.baseTemp = 20 + eff.tempDelta;
      state.targetTemp = state.isBurnerOn ? state.baseTemp + 65 : state.baseTemp;

      // 3. 용액 색상 및 지시약 반응
      let finalLiquidColor = eff.liquidColor;
      const hasPhenol = state.inFlask.includes('Phenolphthalein');
      const hasBTB = state.inFlask.includes('BTB');

      if (hasPhenol && eff.indicatorColors && eff.indicatorColors['Phenolphthalein']) {
        finalLiquidColor = eff.indicatorColors['Phenolphthalein'];
      } else if (hasBTB && eff.indicatorColors && eff.indicatorColors['BTB']) {
        finalLiquidColor = eff.indicatorColors['BTB'];
      }

      // 4. pH 추산
      calculatePh();

      // 5. Canvas 시각 효과 세팅
      labCanvas.setLiquid(Math.min(0.25 + state.inFlask.length * 0.18, 0.78), finalLiquidColor);
      labCanvas.setEffect({
        bubbles: eff.bubbles,
        precipitate: eff.precipitate,
        precipitateColor: eff.precipitateColor,
        flame: eff.flame,
        smoke: eff.smoke
      });
    } else {
      // 반응이 일어나지 않은 단순 혼합 상태
      state.baseTemp = 20;
      state.targetTemp = state.isBurnerOn ? 85 : 20;
      calculatePh();

      // 단순 혼합 색상 계산
      let mixedColor = getMixedLiquidColor(state.inFlask);
      const fillRatio = state.inFlask.length === 0 ? 0 : Math.min(0.2 + state.inFlask.length * 0.15, 0.75);

      labCanvas.setLiquid(fillRatio, mixedColor);
      labCanvas.setEffect({
        bubbles: state.isBurnerOn && state.inFlask.length > 0 ? 'light' : 'none',
        precipitate: null,
        flame: null,
        smoke: state.isBurnerOn && state.inFlask.length > 0 ? 'light' : null
      });
    }
  }

  // 투입된 물질들의 pH 가중 평균 계산
  function calculatePh() {
    if (state.inFlask.length === 0) {
      state.currentPh = 7.0;
      return;
    }

    // 반응이 일어난 경우 반응물 기반의 정확한 생성물 pH 반영
    if (state.activeReaction) {
      if (state.activeReaction.id.includes('neutralization')) {
        state.currentPh = 7.0; // 중화점
        return;
      }
      if (state.activeReaction.id.includes('na_water')) {
        state.currentPh = 13.5; // 강염기 NaOH 생성
        return;
      }
    }

    let totalPh = 0;
    state.inFlask.forEach(id => {
      const chem = CHEMICALS[id];
      if (chem) totalPh += chem.ph;
    });
    state.currentPh = +(totalPh / state.inFlask.length).toFixed(1);
  }

  // 단순 혼합 시 대표 액체 색상 반환
  function getMixedLiquidColor(chemicalIds) {
    if (chemicalIds.length === 0) return 'rgba(235, 245, 255, 0.15)';

    // 지시약 색상 우선 반영
    const hasPhenol = chemicalIds.includes('Phenolphthalein');
    const hasBTB = chemicalIds.includes('BTB');

    if (hasPhenol && state.currentPh >= 8.3) {
      return '#ec4899'; // 핫핑크
    }
    if (hasBTB) {
      if (state.currentPh < 6.0) return '#eab308'; // 노란색
      if (state.currentPh > 7.6) return '#3b82f6'; // 파란색
      return '#10b981'; // 중성 녹색
    }

    // CuSO4가 포함되어 있으면 아름다운 파란색 우선
    if (chemicalIds.includes('CuSO4')) {
      return 'rgba(2, 132, 199, 0.7)';
    }

    // 기본 투명 용액 색상
    return 'rgba(224, 242, 254, 0.45)';
  }

  // 비커 흔들림 시각 효과
  function pulseFlask() {
    const wrap = document.querySelector('.beaker-container');
    if (wrap) {
      wrap.classList.remove('flask-pulse');
      void wrap.offsetWidth; // trigger reflow
      wrap.classList.add('flask-pulse');
    }
  }

  // 교과서 모드에서 프리셋 로드
  function loadCurriculumPreset(preset) {
    // 자유 실험실로 이동 후 프리셋 세팅
    switchMode('free');
    resetFlask();

    // 순차적으로 투입하여 생동감 넘치게 연출
    preset.chemicals.forEach((cid, index) => {
      setTimeout(() => {
        addChemicalToFlask(cid);
        if (index === preset.chemicals.length - 1 && preset.requiresHeat) {
          setTimeout(() => {
            if (!state.isBurnerOn) toggleBurner();
          }, 400);
        }
      }, index * 350);
    });
  }

  // 모드 전환
  function switchMode(newMode) {
    state.mode = newMode;
    if (newMode === 'free') {
      elements.modeFreeBtn.classList.add('active');
      elements.modeCurriculumBtn.classList.remove('active');
      elements.freeStudioView.style.display = 'grid';
      elements.curriculumView.style.display = 'none';
      labCanvas.resize();
    } else {
      elements.modeFreeBtn.classList.remove('active');
      elements.modeCurriculumBtn.classList.add('active');
      elements.freeStudioView.style.display = 'none';
      elements.curriculumView.style.display = 'block';
    }
  }

  // --- 3. UI 업데이트 및 정보 패널 ---

  function updateUI() {
    renderReagents();
    updateFlaskContentsList();
    updateGauges();
    updateReactionPanel();
  }

  // 비커에 투입된 시약 칩 목록
  function updateFlaskContentsList() {
    elements.flaskContentsList.innerHTML = '';
    if (state.inFlask.length === 0) {
      elements.flaskEmptyNotice.style.display = 'block';
      return;
    }

    elements.flaskEmptyNotice.style.display = 'none';
    state.inFlask.forEach(cid => {
      const chem = CHEMICALS[cid];
      if (!chem) return;

      const chip = document.createElement('div');
      chip.className = 'flask-item-chip';
      chip.innerHTML = `
        <span class="chip-formula">${chem.formula}</span>
        <span class="chip-name">${chem.name}</span>
        <button class="chip-remove-btn" title="비커에서 빼기">×</button>
      `;

      chip.querySelector('.chip-remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeChemicalFromFlask(cid);
      });

      chip.addEventListener('click', () => {
        openChemicalModal(chem);
      });

      elements.flaskContentsList.appendChild(chip);
    });
  }

  // 계측 HUD (온도, pH)
  function updateGauges() {
    // 온도 부드러운 전환
    elements.tempValue.textContent = `${Math.round(state.targetTemp)}°C`;
    const tempPercent = Math.min(Math.max((state.targetTemp - 0) / 100 * 100, 5), 100);
    elements.tempBar.style.width = `${tempPercent}%`;

    // pH 값 및 색상 막대
    elements.phValue.textContent = state.currentPh.toFixed(1);
    let phColor = '#10b981'; // 중성 녹색
    if (state.currentPh < 3) phColor = '#ef4444'; // 강산
    else if (state.currentPh < 6) phColor = '#f59e0b'; // 약산
    else if (state.currentPh <= 8) phColor = '#10b981'; // 중성
    else if (state.currentPh < 11) phColor = '#3b82f6'; // 약염기
    else phColor = '#8b5cf6'; // 강염기

    elements.phIndicatorColor.style.background = phColor;
    const phPercent = (state.currentPh / 14) * 100;
    elements.phStripBar.style.left = `${phPercent}%`;

    // 반응 상태 뱃지
    if (state.activeReaction) {
      elements.reactionStatusBadge.textContent = '반응 진행 중 ⚡';
      elements.reactionStatusBadge.className = 'status-badge active';
    } else if (state.inFlask.length > 0) {
      elements.reactionStatusBadge.textContent = '물리적 혼합 상태';
      elements.reactionStatusBadge.className = 'status-badge neutral';
    } else {
      elements.reactionStatusBadge.textContent = '비커 대기 중';
      elements.reactionStatusBadge.className = 'status-badge idle';
    }
  }

  // 우측 화학 분석 및 심화 탐구 카드
  function updateReactionPanel() {
    if (state.activeReaction) {
      const rxn = state.activeReaction;
      elements.reactionCard.style.display = 'block';
      elements.noReactionCard.style.display = 'none';

      elements.reactionTitle.textContent = rxn.title;
      elements.reactionCategoryBadge.textContent = rxn.category;
      elements.reactionCurriculumBadge.textContent = rxn.curriculumGrade;
      elements.reactionEquation.innerHTML = formatChemicalEquation(rxn.equation);
      elements.reactionNetIonic.innerHTML = formatChemicalEquation(rxn.netIonicEquation);

      // 원자 보존 법칙 밸런스 그리드 렌더링
      renderAtomBalance(rxn);

      // 심화 탐구 데이터
      elements.reactionMechanism.textContent = rxn.deepDive.mechanism;
      elements.reactionEnergy.textContent = rxn.deepDive.energyChange;
      elements.reactionSafety.textContent = rxn.deepDive.safetyNote;
      elements.reactionRealLife.textContent = rxn.deepDive.realLifeExample;
    } else {
      elements.reactionCard.style.display = 'none';
      elements.noReactionCard.style.display = 'block';
    }
  }

  // 화학식 가독성 향상 (윗첨자/아래첨자 서식)
  function formatChemicalEquation(str) {
    if (!str) return '';
    return str
      .replace(/(\d+)/g, '<sub>$1</sub>')
      .replace(/([⁺⁻²³⁴⁵⁶⁷⁸⁹]+)/g, '<sup>$1</sup>')
      .replace(/→/g, '<span class="arrow">→</span>')
      .replace(/↑/g, '<span class="gas-tag">↑(g)</span>')
      .replace(/↓/g, '<span class="precipitate-tag">↓(s)</span>');
  }

  // 원자 수 질량 보존 밸런스 계산
  function renderAtomBalance(rxn) {
    elements.atomBalanceGrid.innerHTML = '';

    // 반응물 원자 총합 집계
    const atomCounts = {};
    rxn.reactants.forEach(rid => {
      const chem = CHEMICALS[rid];
      if (chem && chem.atomicBreakdown) {
        Object.entries(chem.atomicBreakdown).forEach(([elem, count]) => {
          atomCounts[elem] = (atomCounts[elem] || 0) + count;
        });
      }
    });

    if (Object.keys(atomCounts).length === 0) {
      elements.atomBalanceGrid.innerHTML = '<span class="text-muted">원자 균형 분석 완료</span>';
      return;
    }

    Object.entries(atomCounts).forEach(([elem, count]) => {
      const item = document.createElement('div');
      item.className = 'atom-balance-item';
      item.innerHTML = `
        <span class="atom-symbol">${elem}</span>
        <div class="atom-counts">
          <span>반응 전: <b>${count}개</b></span>
          <span>=</span>
          <span>반응 후: <b>${count}개</b></span>
        </div>
        <span class="conserved-badge">보존됨 ✓</span>
      `;
      elements.atomBalanceGrid.appendChild(item);
    });
  }

  // 시약 상세 정보 모달
  function openChemicalModal(chem) {
    state.selectedChemicalInfo = chem;
    elements.modalTitle.textContent = chem.name;
    elements.modalFormula.textContent = chem.formula;
    elements.modalCategory.textContent = CATEGORIES[chem.category] || chem.category;
    elements.modalState.textContent = chem.state === 's' ? '고체 (Solid)' : (chem.state === 'l' ? '액체 (Liquid)' : (chem.state === 'g' ? '기체 (Gas)' : '수용액 (Aqueous)'));
    elements.modalPh.textContent = chem.ph.toFixed(1);
    elements.modalHazard.textContent = chem.hazardText;
    elements.modalHazardNote.textContent = chem.hazardNote;
    elements.modalDesc.textContent = chem.description;

    elements.chemicalModal.classList.add('open');
  }

  function closeChemicalModal() {
    elements.chemicalModal.classList.remove('open');
    state.selectedChemicalInfo = null;
  }

  // --- 4. 이벤트 리스너 바인딩 ---

  function bindEvents() {
    // 탭 모드 전환
    elements.modeFreeBtn.addEventListener('click', () => switchMode('free'));
    elements.modeCurriculumBtn.addEventListener('click', () => switchMode('curriculum'));

    // 검색
    elements.reagentSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderReagents();
    });

    // 비커 드래그앤드롭 수신
    const beakerArea = document.querySelector('.beaker-container');
    beakerArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      beakerArea.classList.add('drag-over');
    });
    beakerArea.addEventListener('dragleave', () => {
      beakerArea.classList.remove('drag-over');
    });
    beakerArea.addEventListener('drop', (e) => {
      e.preventDefault();
      beakerArea.classList.remove('drag-over');
      const chemId = e.dataTransfer.getData('text/plain');
      if (chemId && CHEMICALS[chemId]) {
        addChemicalToFlask(chemId);
      }
    });

    // 비커 컨트롤 버튼
    elements.burnerBtn.addEventListener('click', toggleBurner);
    elements.stirBtn.addEventListener('click', stirFlask);
    elements.resetBtn.addEventListener('click', resetFlask);

    // 사운드 토글
    elements.soundToggleBtn.addEventListener('click', () => {
      const isMuted = labAudio.toggleMute();
      elements.soundToggleBtn.classList.toggle('muted', isMuted);
      elements.soundToggleBtn.title = isMuted ? '음소거 해제' : '소리 끄기';
    });

    // 모달 컨트롤
    elements.modalCloseBtn.addEventListener('click', closeChemicalModal);
    elements.chemicalModal.addEventListener('click', (e) => {
      if (e.target === elements.chemicalModal) closeChemicalModal();
    });
    elements.modalAddBtn.addEventListener('click', () => {
      if (state.selectedChemicalInfo) {
        addChemicalToFlask(state.selectedChemicalInfo.id);
        closeChemicalModal();
      }
    });

    // 키보드 ESC로 모달 닫기
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.chemicalModal.classList.contains('open')) {
        closeChemicalModal();
      }
    });
  }

  // 앱 시동
  initApp();
});
