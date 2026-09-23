/**
 * 수학 공식 직접 유도 학습 앱 메인 컨트롤러 (app.js)
 * 15개정/22개정 교육과정 연계, 인터랙티브 단계별 유도, 자체 힌트 아코디언,
 * 초록(완료)/주황(진행중)/회색(미시작) 상태 관리 시스템
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  // 현재 필터 상태
  filters: {
    curriculum: "all", // 'all' | '22개정' | '15개정'
    grade: "all",      // 'all' | '중1' | '중2' | '중3' | '고1' | '고2' | '고3'
    status: "all",     // 'all' | 'completed' (초록) | 'in_progress' (주황) | 'untouched' (회색)
    search: ""
  },

  // 현재 열려있는 스튜디오 상태
  currentFormula: null,
  currentStepIndex: 0, // 0-based
  selectedOptionIndex: null,
  isCurrentStepSolved: false,

  // 오디오 피드백 컨텍스트 (Web Audio API)
  audioCtx: null,

  init() {
    this.checkInitialReset();
    this.initAudio();
    this.bindEvents();
    this.renderFormulas();
    this.updateStats();
    this.initKaTeXRenderer();
  },

  // 사용자 요청: 처음 상태로 깨끗하게 초기화
  checkInitialReset() {
    const initialized = localStorage.getItem("math_derivation_clean_v2");
    if (!initialized) {
      StudyStorage.clearAllProgress();
      localStorage.setItem("math_derivation_clean_v2", "true");
    }
  },

  // ==========================================================================
  // 오디오 피드백 (Web Audio API)
  // ==========================================================================
  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  },

  playChime(type = "correct") {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (type === "correct") {
      // 맑은 2음 벨소리 (E5 -> G5)
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "complete") {
      // 승리의 3화음 팡파르 (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const o = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        o.connect(g);
        g.connect(this.audioCtx.destination);
        o.type = "triangle";
        o.frequency.setValueAtTime(freq, now + idx * 0.1);
        g.gain.setValueAtTime(0.18, now + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        o.start(now + idx * 0.1);
        o.stop(now + idx * 0.1 + 0.4);
      });
    } else if (type === "wrong") {
      // 부드러운 저음 경고음
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  },

  // ==========================================================================
  // 이벤트 리스너 바인딩
  // ==========================================================================
  bindEvents() {
    // 교육과정 탭 클릭 (전체, 22개정, 15개정)
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filters.curriculum = btn.dataset.curriculum;
        this.renderFormulas();
      });
    });

    // 학년 칩 클릭
    document.querySelectorAll(".chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filters.grade = btn.dataset.grade;
        this.renderFormulas();
      });
    });

    // 상태별 필터 필 클릭 (핵심 #3: 초록/주황/회색 필터링)
    document.querySelectorAll(".status-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".status-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.filters.status = pill.dataset.status;
        this.renderFormulas();
      });
    });

    // 검색창 입력 이벤트
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
      this.filters.search = e.target.value.trim().toLowerCase();
      this.renderFormulas();
    });

    // 스튜디오 모달 닫기
    document.getElementById("btnCloseStudio").addEventListener("click", () => {
      this.closeStudio();
    });

    // 스튜디오 1단계부터 다시 시작
    document.getElementById("btnRestartFormula").addEventListener("click", () => {
      if (this.currentFormula && confirm("이 공식의 유도 과정을 1단계부터 다시 시작하시겠습니까?")) {
        StudyStorage.resetFormula(this.currentFormula.id, false);
        this.openStudio(this.currentFormula.id, 0);
      }
    });

    // 스튜디오 이전/다음 단계 버튼
    document.getElementById("btnPrevStep").addEventListener("click", () => {
      if (this.currentStepIndex > 0) {
        this.goToStep(this.currentStepIndex - 1);
      }
    });

    document.getElementById("btnCheckOrNext").addEventListener("click", () => {
      this.handleCheckOrNextAction();
    });

    // 단계별 힌트 아코디언 토글
    const btnToggleHint = document.getElementById("btnToggleHint");
    const hintContent = document.getElementById("hintContent");
    btnToggleHint.addEventListener("click", () => {
      btnToggleHint.classList.toggle("active");
      hintContent.classList.toggle("show");
    });

    // 유도 완료 후 버튼 액션들
    document.getElementById("btnReviewFormula").addEventListener("click", () => {
      this.goToStep(0);
    });

    document.getElementById("btnCompleteClose").addEventListener("click", () => {
      this.closeStudio();
    });

    // 처음 상태로 전체 초기화 버튼
    document.getElementById("btnResetAll").addEventListener("click", () => {
      this.confirmResetAll();
    });

    // 스토리지 업데이트 커스텀 이벤트 수신
    window.addEventListener("math_progress_updated", () => {
      this.updateStats();
      this.renderFormulas();
    });
  },

  // ==========================================================================
  // 통계 배너 및 카운터 갱신 (초록/주황/회색)
  // ==========================================================================
  updateStats() {
    const stats = StudyStorage.getStats(MATH_FORMULAS);

    // 카운터 숫자
    document.getElementById("statSuccessCount").textContent = stats.completed;
    document.getElementById("statWarningCount").textContent = stats.inProgress;
    document.getElementById("statUntouchedCount").textContent = stats.untouched;

    // 필터 버튼 내부 카운터
    document.getElementById("filterSuccessCount").textContent = stats.completed;
    document.getElementById("filterWarningCount").textContent = stats.inProgress;
    document.getElementById("filterUntouchedCount").textContent = stats.untouched;

    // 멀티 세그먼트 프로그레스 바 너비 설정
    const total = stats.total || 1;
    const successWidth = (stats.completed / total) * 100;
    const warningWidth = (stats.inProgress / total) * 100;
    const untouchedWidth = 100 - successWidth - warningWidth;

    document.getElementById("barSuccess").style.width = `${successWidth}%`;
    document.getElementById("barWarning").style.width = `${warningWidth}%`;
    document.getElementById("barUntouched").style.width = `${untouchedWidth}%`;

    // 텍스트 라벨
    document.getElementById("progressSummaryText").textContent = 
      `총 ${stats.total}개 공식 중 ${stats.completed}개 유도 완료 (${stats.completedPct}%)`;
    document.getElementById("progressWarningText").textContent = 
      `${stats.inProgress}개 유도 진행 중`;
  },

  // ==========================================================================
  // 공식 카드 목록 렌더링 (핵심 #1, #3)
  // ==========================================================================
  renderFormulas() {
    const grid = document.getElementById("formulasGrid");
    grid.innerHTML = "";

    const filtered = MATH_FORMULAS.filter(formula => {
      const state = StudyStorage.getFormulaState(formula.id);

      // 1. 교육과정 필터
      if (this.filters.curriculum !== "all") {
        if (!formula.curriculum.includes(this.filters.curriculum)) {
          return false;
        }
      }

      // 2. 학년 필터
      if (this.filters.grade !== "all") {
        if (formula.grade !== this.filters.grade) {
          return false;
        }
      }

      // 3. 상태 필터 (초록/주황/회색)
      if (this.filters.status !== "all") {
        if (state.status !== this.filters.status) {
          return false;
        }
      }

      // 4. 검색어 필터
      if (this.filters.search !== "") {
        const query = this.filters.search;
        const matchTitle = formula.title.toLowerCase().includes(query);
        const matchSubject = formula.subject.toLowerCase().includes(query);
        const matchUnit = formula.unit.toLowerCase().includes(query);
        const matchConcept = formula.coreConcept.toLowerCase().includes(query);
        const matchDesc = formula.description.toLowerCase().includes(query);
        if (!matchTitle && !matchSubject && !matchUnit && !matchConcept && !matchDesc) {
          return false;
        }
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <h3>조건에 맞는 공식이 없습니다.</h3>
          <p style="margin-top: 0.5rem; font-size: 0.88rem;">필터 조건을 변경하거나 검색어를 비워보세요.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(formula => {
      const state = StudyStorage.getFormulaState(formula.id);
      const card = this.createFormulaCardElement(formula, state);
      grid.appendChild(card);
    });

    this.renderKaTeXInContainer(grid);
  },

  // 카드 DOM 생성 (상태별 바탕색: 회색 / 주황색 / 초록색)
  createFormulaCardElement(formula, state) {
    const card = document.createElement("div");
    card.className = "formula-card";
    card.dataset.id = formula.id;

    // 상태 클래스 부여 (핵심 요구사항 #3)
    let statusClass = "card-untouched"; // 기본 회색 바탕
    let statusBadgeText = "미시작 (회색)";
    let statusBadgeIcon = "fa-circle-notch";
    let actionBtnText = "직접 유도 도전하기";
    let actionBtnIcon = "fa-arrow-right";

    if (state.status === "completed") {
      statusClass = "card-completed"; // 초록색 바탕
      statusBadgeText = "유도 완료 🎉";
      statusBadgeIcon = "fa-circle-check";
      actionBtnText = "다시 복습하기";
      actionBtnIcon = "fa-rotate-right";
    } else if (state.status === "in_progress") {
      statusClass = "card-in-progress"; // 주황색 바탕
      statusBadgeText = `진행 중 (Step ${state.currentStep || 1}/${formula.steps.length})`;
      statusBadgeIcon = "fa-spinner fa-spin";
      actionBtnText = "이어서 유도하기";
      actionBtnIcon = "fa-play";
    }

    card.classList.add(statusClass);

    // 교육과정 배지 태그들
    const curriculumTags = formula.curriculum
      .map(c => `<span class="badge-tag badge-curriculum">${c}</span>`)
      .join("");

    card.innerHTML = `
      <div>
        <div class="card-header">
          <div class="card-meta">
            <span class="badge-tag" style="background: rgba(255,255,255,0.1); color: #f8fafc; font-weight: 700;">${formula.grade}</span>
            <span class="badge-tag">${formula.subject}</span>
            ${curriculumTags}
          </div>
          <span class="status-badge">
            <i class="fa-solid ${statusBadgeIcon}"></i> ${statusBadgeText}
          </span>
        </div>

        <h3 class="card-title">${formula.title}</h3>
        <p style="font-size: 0.8rem; color: var(--text-dim); margin-top: 2px;">${formula.unit}</p>

        <div class="card-math-box" style="margin-top: 1rem;">
          <span class="katex-render">$$${formula.latex}$$</span>
        </div>
      </div>

      <div>
        <p class="card-concept">
          <strong>핵심 아이디어:</strong> ${formula.coreConcept}
        </p>

        <div class="card-footer">
          <span class="step-indicator-mini">
            <i class="fa-solid fa-stairs"></i> 총 ${formula.steps.length}단계 유도
          </span>
          <button class="btn-action" data-id="${formula.id}">
            <span>${actionBtnText}</span>
            <i class="fa-solid ${actionBtnIcon}"></i>
          </button>
        </div>
      </div>
    `;

    // 카드 클릭 시 유도 스튜디오 실행
    card.addEventListener("click", () => {
      this.handleFormulaClick(formula.id);
    });

    return card;
  },

  // 공식 클릭 시 유도 시작 (회색이면 즉시 주황색으로 상태 전환)
  handleFormulaClick(formulaId) {
    const state = StudyStorage.getFormulaState(formulaId);
    
    // 만약 한 번도 건들지 않은 공식(회색)이라면 즉시 주황색(진행 중)으로 전환!
    if (state.status === "untouched") {
      StudyStorage.startFormula(formulaId);
      this.updateStats();
      this.renderFormulas();
    }

    const updatedState = StudyStorage.getFormulaState(formulaId);
    const stepIdx = Math.max(0, (updatedState.currentStep || 1) - 1);
    this.openStudio(formulaId, stepIdx);
  },

  // ==========================================================================
  // 집중형 유도 스튜디오 모달
  // ==========================================================================
  openStudio(formulaId, initialStepIndex = 0) {
    const formula = MATH_FORMULAS.find(f => f.id === formulaId);
    if (!formula) return;

    this.currentFormula = formula;
    this.currentStepIndex = Math.min(initialStepIndex, formula.steps.length - 1);
    this.selectedOptionIndex = null;
    this.isCurrentStepSolved = false;

    // 헤더 정보 바인딩
    document.getElementById("studioFormulaTitle").textContent = formula.title;
    document.getElementById("studioFormulaLatex").innerHTML = `$${formula.latex}$`;
    document.getElementById("studioMetaBadges").innerHTML = `
      <span class="badge-tag">${formula.grade}</span>
      <span class="badge-tag">${formula.subject}</span>
    `;

    // 스텝퍼 바 생성
    this.renderStepStepper();

    // 활성 단계 로드
    this.loadCurrentStep();

    // 모달 표시
    const modal = document.getElementById("studioModal");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    // KaTeX 렌더링
    this.renderKaTeXInContainer(document.querySelector(".studio-container"));
  },

  closeStudio() {
    const modal = document.getElementById("studioModal");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    this.currentFormula = null;

    // 메인 화면 통계 및 카드 상태 갱신
    this.updateStats();
    this.renderFormulas();
  },

  // 단계 이동 네비게이션 칩스
  renderStepStepper() {
    const container = document.getElementById("stepStepperBar");
    container.innerHTML = "";

    const formula = this.currentFormula;
    const state = StudyStorage.getFormulaState(formula.id);

    formula.steps.forEach((step, idx) => {
      const chip = document.createElement("button");
      chip.className = "step-chip-item";
      if (idx === this.currentStepIndex) chip.classList.add("active");
      
      // 이미 해결했거나 현재 스텝보다 이전인 경우 체크 표시
      if (idx < (state.currentStep || 1) - 1 || state.status === "completed") {
        chip.classList.add("completed");
        chip.innerHTML = `<i class="fa-solid fa-check"></i> Step ${idx + 1}`;
      } else {
        chip.innerHTML = `<span>Step ${idx + 1}</span>`;
      }

      chip.addEventListener("click", () => {
        this.goToStep(idx);
      });

      container.appendChild(chip);
    });
  },

  // 특정 단계로 이동
  goToStep(stepIdx) {
    if (!this.currentFormula) return;
    this.currentStepIndex = stepIdx;
    this.selectedOptionIndex = null;
    this.isCurrentStepSolved = false;

    this.renderStepStepper();
    this.loadCurrentStep();
  },

  // 현재 유도 단계 로드 및 UI 표시
  loadCurrentStep() {
    const formula = this.currentFormula;
    const step = formula.steps[this.currentStepIndex];

    const activeCard = document.getElementById("activeStepCard");
    const celebrationView = document.getElementById("celebrationView");
    const feedbackAlert = document.getElementById("feedbackAlert");

    activeCard.style.display = "flex";
    celebrationView.classList.remove("show");
    feedbackAlert.classList.remove("show");
    feedbackAlert.className = "feedback-alert";

    // 힌트 아코디언 초기화 (접힌 상태로)
    const btnToggleHint = document.getElementById("btnToggleHint");
    const hintContent = document.getElementById("hintContent");
    btnToggleHint.classList.remove("active");
    hintContent.classList.remove("show");

    // 힌트 내용 바인딩
    const guidance = step.aiGuidance || {};
    document.getElementById("hintText").innerHTML = `$${guidance.hint || "식의 양변을 관찰하여 목표 식으로 이어지는 변형을 찾아보세요."}$`;
    document.getElementById("whyText").innerHTML = `$${guidance.why || formula.coreConcept}$`;
    document.getElementById("mistakeText").innerHTML = `$${guidance.commonMistake || "등식의 성질을 위배하지 않도록 주의하세요."}$`;

    // 단계 기본 정보
    document.getElementById("stepHeadlineTag").textContent = `STEP ${step.stepNumber}: ${step.title}`;
    document.getElementById("stepProgressRatio").textContent = `${step.stepNumber} / ${formula.steps.length}`;
    document.getElementById("stepGoalText").textContent = step.goal;

    // 시작 수식 및 목표 수식 흐름
    document.getElementById("flowStartExpr").innerHTML = `$${step.startExpr}$`;
    document.getElementById("flowTargetExpr").innerHTML = `$${step.targetExpr}$`;

    // 질문
    document.getElementById("challengeQuestion").textContent = step.question;

    // 선택지 리스트 렌더링
    const optionsContainer = document.getElementById("optionsList");
    optionsContainer.innerHTML = "";

    step.options.forEach((opt, idx) => {
      const item = document.createElement("div");
      item.className = "option-item";
      item.dataset.index = idx;

      item.innerHTML = `
        <div class="option-radio"></div>
        <div class="option-content">
          <span class="option-latex">$${opt.latex}$</span>
          <span class="option-desc">${opt.label}</span>
        </div>
      `;

      item.addEventListener("click", () => {
        if (this.isCurrentStepSolved) return;
        this.selectOption(idx);
      });

      optionsContainer.appendChild(item);
    });

    // 하단 버튼 상태 초기화
    document.getElementById("btnPrevStep").disabled = this.currentStepIndex === 0;
    const nextBtn = document.getElementById("btnCheckOrNext");
    nextBtn.disabled = true;
    nextBtn.innerHTML = `<span>선택지 확인</span> <i class="fa-solid fa-arrow-right"></i>`;

    this.renderKaTeXInContainer(activeCard);
  },

  // 선택지 선택
  selectOption(idx) {
    this.selectedOptionIndex = idx;
    document.querySelectorAll(".option-item").forEach((el, i) => {
      if (i === idx) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });

    const nextBtn = document.getElementById("btnCheckOrNext");
    nextBtn.disabled = false;
  },

  // 선택지 확인 또는 다음 단계 이동 처리
  handleCheckOrNextAction() {
    if (this.isCurrentStepSolved) {
      if (this.currentStepIndex < this.currentFormula.steps.length - 1) {
        this.goToStep(this.currentStepIndex + 1);
      } else {
        this.finishFormulaDerivation();
      }
      return;
    }

    if (this.selectedOptionIndex === null) return;

    const step = this.currentFormula.steps[this.currentStepIndex];
    const selected = step.options[this.selectedOptionIndex];
    const feedbackAlert = document.getElementById("feedbackAlert");
    const optionElements = document.querySelectorAll(".option-item");

    if (selected.isCorrect) {
      // 정답! 🟢
      this.isCurrentStepSolved = true;
      this.playChime("correct");

      optionElements[this.selectedOptionIndex].classList.add("correct");

      feedbackAlert.className = "feedback-alert success show";
      feedbackAlert.innerHTML = `<strong><i class="fa-solid fa-circle-check"></i> 정답입니다!</strong> ${selected.feedback}`;

      // 현재 진행도 저장 (주황색 유지 및 스텝 업데이트)
      StudyStorage.saveStep(this.currentFormula.id, this.currentStepIndex + 1);
      this.renderStepStepper();

      // 버튼을 '다음 단계로' 또는 '유도 완료하기'로 변경
      const nextBtn = document.getElementById("btnCheckOrNext");
      if (this.currentStepIndex < this.currentFormula.steps.length - 1) {
        nextBtn.innerHTML = `<span>다음 Step으로 이동</span> <i class="fa-solid fa-arrow-right"></i>`;
      } else {
        nextBtn.innerHTML = `<span>🎉 공식 유도 완료하기!</span> <i class="fa-solid fa-trophy"></i>`;
      }

    } else {
      // 오답! 🔴
      this.playChime("wrong");
      const wrongEl = optionElements[this.selectedOptionIndex];
      wrongEl.classList.add("wrong");
      setTimeout(() => wrongEl.classList.remove("wrong"), 500);

      feedbackAlert.className = "feedback-alert error show";
      feedbackAlert.innerHTML = `<strong><i class="fa-solid fa-triangle-exclamation"></i> 다시 생각해 보세요:</strong> ${selected.feedback}`;

      // 자동으로 힌트 아코디언 열기
      const btnToggleHint = document.getElementById("btnToggleHint");
      const hintContent = document.getElementById("hintContent");
      btnToggleHint.classList.add("active");
      hintContent.classList.add("show");
    }

    this.renderKaTeXInContainer(feedbackAlert);
    this.renderKaTeXInContainer(document.getElementById("hintContent"));
  },

  // 최종 공식 유도 완료 처리 (초록색 전환 🎉)
  finishFormulaDerivation() {
    const formula = this.currentFormula;
    StudyStorage.completeFormula(formula.id); // 🟢 초록색 완료 상태로 저장!

    this.playChime("complete");

    // 축하 Confetti 폭죽 이펙트
    if (typeof confetti === "function") {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    }

    // 축하 뷰 표시
    document.getElementById("activeStepCard").style.display = "none";
    const celebration = document.getElementById("celebrationView");
    celebration.classList.add("show");
    document.getElementById("celebrationFormulaDesc").innerHTML = `
      <strong>${formula.title}</strong>의 모든 유도 단계를 완벽하게 스스로 증명해 내셨습니다!<br>
      이제 이 공식은 단순히 외운 것이 아니라 <strong>당신의 온전한 수학적 지식</strong>이 되었습니다.<br>
      공식 상태가 🟢 <strong>유도 완료 (초록색)</strong>으로 기록되었습니다!
    `;

    document.getElementById("btnCheckOrNext").disabled = true;

    this.renderStepStepper();
    this.updateStats();
  },

  // 처음 상태로 전체 초기화
  confirmResetAll() {
    if (confirm("정말로 모든 공식의 유도 진도를 처음 상태(전체 회색 미시작)로 초기화하시겠습니까?")) {
      StudyStorage.clearAllProgress();
      this.updateStats();
      this.renderFormulas();
      alert("모든 공식이 처음 상태(회색 미시작)로 초기화되었습니다.");
    }
  },

  // ==========================================================================
  // KaTeX 수식 렌더러 헬퍼
  // ==========================================================================
  initKaTeXRenderer() {
    if (typeof renderMathInElement === "function") {
      this.renderKaTeXInContainer(document.body);
    } else {
      setTimeout(() => this.initKaTeXRenderer(), 200);
    }
  },

  renderKaTeXInContainer(container) {
    if (!container || typeof renderMathInElement !== "function") return;
    try {
      renderMathInElement(container, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX rendering warning:", e);
    }
  }
};
