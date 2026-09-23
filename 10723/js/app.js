/**
 * VocaMind AI - Application Controller
 * Manages UI interactions, quiz flow, audio synthesis, speech playback,
 * error clinic, word vault, and local state persistence.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Global App State
  const state = {
    currentTab: "dashboard",
    selectedRecommendMode: "smart",
    selectedCategory: "ALL",
    quiz: {
      active: false,
      questions: [],
      currentIndex: 0,
      isAnswered: false,
      currentAutopsy: null
    },
    vaultSearchQuery: "",
    vaultCategory: "ALL"
  };

  // DOM Elements - Navigation & Header
  const navButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanels = document.querySelectorAll(".tab-content-panel");
  const headerStreakVal = document.getElementById("header-streak-val");
  const headerXpVal = document.getElementById("header-xp-val");
  const btnToggleSound = document.getElementById("btn-toggle-sound");
  const soundIcon = document.getElementById("sound-icon");
  const btnOpenSettings = document.getElementById("btn-open-settings");

  // DOM Elements - Dashboard
  const modePills = document.querySelectorAll("#recommend-mode-group .mode-pill-btn");
  const selectCategoryFilter = document.getElementById("select-category-filter");
  const btnStartQuiz = document.getElementById("btn-start-recommended-quiz");
  const metricAccuracy = document.getElementById("metric-accuracy");
  const metricAccuracySub = document.getElementById("metric-accuracy-sub");
  const metricMastered = document.getElementById("metric-mastered");
  const metricWeak = document.getElementById("metric-weak");
  const retentionPercentText = document.getElementById("retention-percent-text");
  const retentionCircleFill = document.getElementById("retention-circle-fill");
  const retentionStatusLabel = document.getElementById("retention-status-label");
  const retentionStatusDesc = document.getElementById("retention-status-desc");
  const quickMistakeContainer = document.getElementById("quick-mistake-container");
  const btnGotoClinicLink = document.getElementById("btn-goto-clinic-link");

  // DOM Elements - Quiz Room
  const quizCurrIdx = document.getElementById("quiz-curr-idx");
  const quizTotalIdx = document.getElementById("quiz-total-idx");
  const quizProgressFill = document.getElementById("quiz-progress-fill");
  const btnExitQuiz = document.getElementById("btn-exit-quiz");
  const qTypeBadge = document.getElementById("q-type-badge");
  const qCategoryBadge = document.getElementById("q-category-badge");
  const qPromptContainer = document.getElementById("q-prompt-container");
  const qInteractiveArea = document.getElementById("q-interactive-area");
  const btnToggleHint = document.getElementById("btn-toggle-hint");
  const hintBox = document.getElementById("hint-box");
  const quizFeedbackBar = document.getElementById("quiz-feedback-bar");
  const feedbackStatusText = document.getElementById("feedback-status-text");
  const feedbackIcon = document.getElementById("feedback-icon");
  const feedbackMsg = document.getElementById("feedback-msg");
  const btnTriggerAutopsy = document.getElementById("btn-trigger-autopsy");
  const btnNextStep = document.getElementById("btn-next-step");

  // DOM Elements - Clinic
  const clinicWordsContainer = document.getElementById("clinic-words-container");
  const btnRetryClinicMistakes = document.getElementById("btn-retry-clinic-mistakes");

  // DOM Elements - Vault
  const vaultSearchInput = document.getElementById("vault-search-input");
  const vaultCategoryFilters = document.querySelectorAll("#vault-category-filters .vault-filter-btn");
  const btnOpenAddWordModal = document.getElementById("btn-open-add-word-modal");
  const vaultTableBody = document.getElementById("vault-table-body");

  // DOM Elements - Modals
  const modalAutopsy = document.getElementById("modal-autopsy");
  const btnCloseAutopsy = document.getElementById("btn-close-autopsy");
  const autopsyModalBody = document.getElementById("autopsy-modal-body");
  const autopsySourceTag = document.getElementById("autopsy-source-tag");

  const modalSettings = document.getElementById("modal-settings");
  const btnCloseSettings = document.getElementById("btn-close-settings");
  const inputGeminiKey = document.getElementById("input-gemini-key");
  const btnSaveSettings = document.getElementById("btn-save-settings");
  const btnResetData = document.getElementById("btn-reset-data");

  const modalAddWord = document.getElementById("modal-add-word");
  const btnCloseAddWord = document.getElementById("btn-close-add-word");
  const formAddWord = document.getElementById("form-add-word");

  // =========================================================================
  // 1. NAVIGATION & TAB SWITCHING
  // =========================================================================
  function switchTab(tabId) {
    state.currentTab = tabId;
    navButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle("active", panel.id === `tab-${tabId}`);
    });

    // Specific tab refresh logic
    if (tabId === "dashboard") {
      updateDashboardUI();
    } else if (tabId === "clinic") {
      renderErrorClinicUI();
    } else if (tabId === "vault") {
      renderWordVaultUI();
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.soundEngine.playClick();
      switchTab(btn.dataset.tab);
    });
  });

  btnGotoClinicLink.addEventListener("click", () => {
    window.soundEngine.playClick();
    switchTab("clinic");
  });

  // =========================================================================
  // 2. DASHBOARD UPDATE LOGIC
  // =========================================================================
  function updateDashboardUI() {
    const stats = window.aiEngine.getDashboardStats();

    headerStreakVal.textContent = stats.streak;
    headerXpVal.textContent = `${stats.xp} XP (Lv.${stats.level})`;

    metricAccuracy.textContent = `${stats.accuracy}%`;
    metricAccuracySub.textContent = `총 ${stats.totalAnswered}문제 풀이 완료`;
    metricMastered.textContent = stats.masteredCount;
    metricWeak.textContent = stats.weakCount;

    // Ebbinghaus Retention Circle
    const circumference = 2 * Math.PI * 42; // r=42 -> ~263.89
    const offset = circumference - (stats.retentionPercent / 100) * circumference;
    retentionCircleFill.style.strokeDashoffset = offset;
    retentionPercentText.textContent = `${stats.retentionPercent}%`;

    if (stats.retentionPercent >= 85) {
      retentionStatusLabel.textContent = "최적 기억 상태 ✨";
      retentionStatusDesc.textContent = "망각이 지연되고 있으며 장기 기억으로 순항 중입니다.";
    } else if (stats.retentionPercent >= 60) {
      retentionStatusLabel.textContent = "복습 권장 단계 ⏳";
      retentionStatusDesc.textContent = "망각 곡선 주기에 따라 골든타임 복습이 필요합니다.";
    } else {
      retentionStatusLabel.textContent = "기억 소실 위험 🚨";
      retentionStatusDesc.textContent = "단어들이 빠르게 잊혀지고 있습니다. 지금 바로 복습하세요!";
    }

    // Recent Mistakes Widget
    quickMistakeContainer.innerHTML = "";
    if (stats.recentMistakes.length === 0) {
      quickMistakeContainer.innerHTML = `
        <div style="color: var(--text-muted); font-size: 0.85rem; padding: 0.5rem 0;">
          아직 오답이 없습니다. 퀴즈를 풀어 실력을 확인해 보세요!
        </div>
      `;
    } else {
      stats.recentMistakes.slice(0, 4).forEach(m => {
        const item = document.createElement("div");
        item.className = "quick-mistake-item";
        item.innerHTML = `
          <div>
            <div class="w-word">${m.word}</div>
            <div class="w-meaning">${m.meaning}</div>
          </div>
          <span style="font-size: 0.75rem; color: #f87171; font-weight:700;">오답</span>
        `;
        quickMistakeContainer.appendChild(item);
      });
    }
  }

  // Dashboard Recommendation Mode pills
  modePills.forEach(pill => {
    pill.addEventListener("click", () => {
      window.soundEngine.playClick();
      modePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.selectedRecommendMode = pill.dataset.mode;
    });
  });

  selectCategoryFilter.addEventListener("change", (e) => {
    state.selectedCategory = e.target.value;
  });

  // Launch Recommended Quiz Button
  btnStartQuiz.addEventListener("click", () => {
    window.soundEngine.playClick();
    startQuizSession(state.selectedRecommendMode, state.selectedCategory);
  });

  // =========================================================================
  // 3. QUIZ SESSION & QUESTION ENGINE
  // =========================================================================
  function startQuizSession(mode = "smart", category = "ALL", customWordsList = null) {
    let targetWords = [];

    if (customWordsList && customWordsList.length > 0) {
      targetWords = customWordsList;
    } else {
      targetWords = window.aiEngine.getRecommendedWords(mode, 10, category);
    }

    if (targetWords.length === 0) {
      alert("출제 가능한 단어가 없습니다. 카테고리를 변경하거나 단어를 추가해 보세요!");
      return;
    }

    const questions = window.aiEngine.generateQuizQuestions(targetWords, "mixed");

    state.quiz = {
      active: true,
      questions: questions,
      currentIndex: 0,
      isAnswered: false,
      currentAutopsy: null
    };

    switchTab("quiz");
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    const q = state.quiz.questions[state.quiz.currentIndex];
    state.quiz.isAnswered = false;
    state.quiz.currentAutopsy = null;

    // Update Progress
    quizCurrIdx.textContent = state.quiz.currentIndex + 1;
    quizTotalIdx.textContent = state.quiz.questions.length;
    const progressPercent = ((state.quiz.currentIndex) / state.quiz.questions.length) * 100;
    quizProgressFill.style.width = `${progressPercent}%`;

    // Reset feedback bar & hint box
    quizFeedbackBar.style.display = "none";
    quizFeedbackBar.classList.remove("correct", "wrong");
    hintBox.style.display = "none";
    hintBox.textContent = q.hint || "힌트가 제공되지 않는 문제입니다.";

    qCategoryBadge.textContent = q.word.category;

    // Type Badge & Prompts
    if (q.type === "choice") {
      qTypeBadge.textContent = "사지선다 뜻 맞히기";
      qPromptContainer.innerHTML = `
        <div class="target-word-display">
          <span>${q.promptWord}</span>
          <button class="btn-tts-audio" data-word="${q.promptWord}" title="발음 듣기">🔊</button>
        </div>
        <div class="target-meta-row">
          <span class="pos-tag">${q.partOfSpeech}</span>
          <span>${q.phonetic}</span>
        </div>
      `;

      // Render 4 choices
      let optionsHtml = '<div class="options-grid">';
      q.options.forEach((opt, idx) => {
        optionsHtml += `
          <button class="option-btn" data-opt-id="${opt.id}" data-opt-text="${opt.text}">
            <span class="opt-index">${idx + 1}</span>
            <span>${opt.text}</span>
          </button>
        `;
      });
      optionsHtml += '</div>';
      qInteractiveArea.innerHTML = optionsHtml;

      // Attach option click listeners
      qInteractiveArea.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", () => handleChoiceAnswer(btn, q));
      });

    } else if (q.type === "cloze") {
      qTypeBadge.textContent = "문맥 예문 빈칸 채우기";
      qPromptContainer.innerHTML = `
        <div class="cloze-sentence-text">${q.promptSentence.replace(/______/g, '<span class="blank">______</span>')}</div>
        <div class="cloze-translation-text">${q.translation}</div>
      `;

      let optionsHtml = '<div class="options-grid">';
      q.options.forEach((opt, idx) => {
        optionsHtml += `
          <button class="option-btn" data-opt-id="${opt.id}" data-opt-text="${opt.text}">
            <span class="opt-index">${idx + 1}</span>
            <span><strong>${opt.text}</strong> <span style="font-size:0.85rem; color:var(--text-muted); margin-left:6px;">(${opt.meaning})</span></span>
          </button>
        `;
      });
      optionsHtml += '</div>';
      qInteractiveArea.innerHTML = optionsHtml;

      qInteractiveArea.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", () => handleChoiceAnswer(btn, q));
      });

    } else if (q.type === "spelling") {
      qTypeBadge.textContent = "스펠링 타이핑 챌린지";
      qPromptContainer.innerHTML = `
        <div style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">
          ${q.promptMeaning}
        </div>
        <div class="target-meta-row">
          <span class="pos-tag">${q.partOfSpeech}</span>
          <span>${q.phonetic}</span>
          <button class="btn-tts-audio" data-word="${q.word.word}" style="width:34px; height:34px; font-size:1rem;" title="발음 듣기">🔊</button>
        </div>
      `;

      qInteractiveArea.innerHTML = `
        <div class="spelling-box">
          <input type="text" class="spelling-input" id="spelling-text-input" placeholder="스펠링을 입력하세요" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
          <button class="btn-submit-spelling" id="btn-submit-spelling-answer">확인 (Enter)</button>
        </div>
      `;

      const input = document.getElementById("spelling-text-input");
      const submitBtn = document.getElementById("btn-submit-spelling-answer");

      input.focus();
      submitBtn.addEventListener("click", () => handleSpellingAnswer(input.value.trim(), q));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          handleSpellingAnswer(input.value.trim(), q);
        }
      });
    }

    // TTS button hooks
    qPromptContainer.querySelectorAll(".btn-tts-audio").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        speakWord(btn.dataset.word);
      });
    });

    // Auto pronounce on question load for better immersion
    speakWord(q.word.word);
  }

  // Answer Evaluation - Multiple Choice
  async function handleChoiceAnswer(selectedBtn, question) {
    if (state.quiz.isAnswered) return;
    state.quiz.isAnswered = true;

    // Disable all options
    const allBtns = qInteractiveArea.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.disabled = true);

    const chosenId = selectedBtn.dataset.optId;
    const chosenText = selectedBtn.dataset.optText;
    const isCorrect = (chosenId === question.correctOptionId);

    if (isCorrect) {
      selectedBtn.classList.add("correct");
      window.soundEngine.playCorrect();

      window.aiEngine.recordAnswer(question.word.id, true, chosenText);
      showFeedbackBar(true, "정답입니다! 뇌 기억 회로가 강화되었습니다.");

      // Check for combo streak sound
      const streak = window.aiEngine.userData.streak;
      if (streak > 0 && streak % 3 === 0) {
        setTimeout(() => window.soundEngine.playCombo(), 200);
      }
    } else {
      selectedBtn.classList.add("wrong");
      window.soundEngine.playWrong();

      // Highlight the correct one
      allBtns.forEach(b => {
        if (b.dataset.optId === question.correctOptionId) {
          b.classList.add("correct");
        }
      });

      window.aiEngine.recordAnswer(question.word.id, false, chosenText);
      showFeedbackBar(false, `오답입니다! 정답은 [${question.word.meaning}] 입니다.`);

      // Generate AI Error Autopsy asynchronously
      btnTriggerAutopsy.style.display = "inline-flex";
      btnTriggerAutopsy.innerHTML = `<span>⏳ AI 오답 분석 생성 중...</span>`;
      btnTriggerAutopsy.disabled = true;

      const autopsy = await window.aiEngine.generateErrorAutopsy(question.word, chosenText, question.type);
      state.quiz.currentAutopsy = autopsy;

      btnTriggerAutopsy.disabled = false;
      btnTriggerAutopsy.innerHTML = `<span>🔍 AI 오답 정밀 진단</span>`;
    }

    updateHeaderStats();
  }

  // Answer Evaluation - Spelling
  async function handleSpellingAnswer(userInput, question) {
    if (state.quiz.isAnswered) return;
    if (!userInput) return;
    state.quiz.isAnswered = true;

    const input = document.getElementById("spelling-text-input");
    if (input) input.disabled = true;

    const isCorrect = (userInput.toLowerCase() === question.correctWord.toLowerCase());

    if (isCorrect) {
      if (input) input.style.borderColor = "var(--color-success)";
      window.soundEngine.playCorrect();

      window.aiEngine.recordAnswer(question.word.id, true, userInput);
      showFeedbackBar(true, "완벽한 스펠링입니다! 완벽히 마스터했습니다.");
    } else {
      if (input) input.style.borderColor = "var(--color-error)";
      window.soundEngine.playWrong();

      window.aiEngine.recordAnswer(question.word.id, false, userInput);
      showFeedbackBar(false, `오답입니다! 정확한 철자는 [${question.correctWord}] 입니다.`);

      btnTriggerAutopsy.style.display = "inline-flex";
      btnTriggerAutopsy.innerHTML = `<span>⏳ AI 오답 분석 생성 중...</span>`;
      btnTriggerAutopsy.disabled = true;

      const autopsy = await window.aiEngine.generateErrorAutopsy(question.word, userInput, "spelling");
      state.quiz.currentAutopsy = autopsy;

      btnTriggerAutopsy.disabled = false;
      btnTriggerAutopsy.innerHTML = `<span>🔍 AI 오답 정밀 진단</span>`;
    }

    updateHeaderStats();
  }

  function showFeedbackBar(isCorrect, message) {
    quizFeedbackBar.style.display = "flex";
    quizFeedbackBar.classList.remove("correct", "wrong");
    quizFeedbackBar.classList.add(isCorrect ? "correct" : "wrong");

    feedbackIcon.textContent = isCorrect ? "✅" : "❌";
    feedbackMsg.textContent = message;

    if (isCorrect) {
      btnTriggerAutopsy.style.display = "none";
    }
  }

  // Next Question Button
  btnNextStep.addEventListener("click", () => {
    window.soundEngine.playClick();
    if (state.quiz.currentIndex < state.quiz.questions.length - 1) {
      state.quiz.currentIndex += 1;
      renderCurrentQuestion();
    } else {
      // Quiz Complete!
      finishQuizSession();
    }
  });

  function finishQuizSession() {
    quizProgressFill.style.width = "100%";
    window.soundEngine.playCombo();

    const stats = window.aiEngine.userData;
    qPromptContainer.innerHTML = `
      <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎉</div>
      <h2 style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">학습 세션 완료!</h2>
      <p style="color: var(--text-muted); font-size: 1rem; max-width: 480px; margin: 0 auto 1.5rem;">
        추천된 단어 학습을 훌륭하게 완수하셨습니다. 정답률과 망각 주기가 최신 상태로 업데이트되었습니다.
      </p>
      <div style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem;">
        <div class="stat-pill streak"><span class="icon">🔥</span> <span class="val">연속 스트릭: ${stats.streak}</span></div>
        <div class="stat-pill xp"><span class="icon">⭐</span> <span class="val">총 ${stats.xp} XP</span></div>
      </div>
      <div style="display: flex; justify-content: center; gap: 1rem;">
        <button class="btn-primary-launch" id="btn-quiz-done-dashboard">대시보드로 돌아가기</button>
        <button class="btn-primary-launch" id="btn-quiz-done-clinic" style="background: rgba(255,255,255,0.08); border: 1px solid var(--border-subtle); box-shadow:none;">오답 클리닉 가기</button>
      </div>
    `;

    qInteractiveArea.innerHTML = "";
    quizFeedbackBar.style.display = "none";

    document.getElementById("btn-quiz-done-dashboard").addEventListener("click", () => {
      switchTab("dashboard");
    });
    document.getElementById("btn-quiz-done-clinic").addEventListener("click", () => {
      switchTab("clinic");
    });
  }

  // Quit Quiz button
  btnExitQuiz.addEventListener("click", () => {
    if (confirm("현재 퀴즈 세션을 중단하고 나가시겠습니까?")) {
      switchTab("dashboard");
    }
  });

  // Toggle Hint
  btnToggleHint.addEventListener("click", () => {
    hintBox.style.display = (hintBox.style.display === "block") ? "none" : "block";
  });

  // =========================================================================
  // 4. AI ERROR CLINIC UI (오답 분석실)
  // =========================================================================
  function renderErrorClinicUI() {
    const allWords = window.aiEngine.getAllWords();
    const stats = window.aiEngine.userData.wordStats;

    // Filter words that have mistakes
    const mistakeWords = allWords.filter(w => {
      const s = stats[w.id];
      return s && s.wrong > 0;
    });

    clinicWordsContainer.innerHTML = "";

    if (mistakeWords.length === 0) {
      clinicWordsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🌟</div>
          <h3>오답 기록이 깨끗합니다!</h3>
          <p>틀린 단어가 없거나 모든 단어를 완벽하게 복습하셨습니다. 퀴즈를 풀어 취약 어휘를 점검해 보세요.</p>
        </div>
      `;
      btnRetryClinicMistakes.disabled = true;
      btnRetryClinicMistakes.style.opacity = "0.5";
      return;
    }

    btnRetryClinicMistakes.disabled = false;
    btnRetryClinicMistakes.style.opacity = "1";

    mistakeWords.forEach(word => {
      const stat = stats[word.id];
      const card = document.createElement("div");
      card.className = "clinic-card";

      // Build quick diagnosis snippet
      let snippet = word.mnemonic || word.etymology;

      card.innerHTML = `
        <div class="clinic-card-head">
          <div>
            <div class="clinic-card-word">${word.word}</div>
            <div class="clinic-card-meaning">${word.partOfSpeech} ${word.meaning}</div>
          </div>
          <span class="clinic-badge-wrong">❌ ${stat.wrong}회 틀림</span>
        </div>

        <div class="clinic-ai-insight">
          <div class="label">💡 AI 연상 기억 솔루션</div>
          <div class="text">${snippet}</div>
        </div>

        <div class="clinic-card-actions">
          <button class="btn-tts-audio" data-word="${word.word}" style="width:34px; height:34px; font-size:1rem;">🔊</button>
          <button class="btn-inspect-autopsy" data-word-id="${word.id}">🔬 심층 진단서 보기</button>
        </div>
      `;

      card.querySelector(".btn-tts-audio").addEventListener("click", () => speakWord(word.word));
      card.querySelector(".btn-inspect-autopsy").addEventListener("click", () => openAutopsyModalForWord(word));

      clinicWordsContainer.appendChild(card);
    });
  }

  // Retry mistakes only
  btnRetryClinicMistakes.addEventListener("click", () => {
    const allWords = window.aiEngine.getAllWords();
    const stats = window.aiEngine.userData.wordStats;
    const mistakeWords = allWords.filter(w => stats[w.id] && stats[w.id].wrong > 0);

    if (mistakeWords.length === 0) return;
    window.soundEngine.playClick();
    startQuizSession("weakness", "ALL", mistakeWords.slice(0, 10));
  });

  // =========================================================================
  // 5. AI AUTOPSY MODAL RENDERING (오답 정밀 진단서)
  // =========================================================================
  btnTriggerAutopsy.addEventListener("click", () => {
    if (state.quiz.currentAutopsy) {
      displayAutopsyModal(state.quiz.currentAutopsy);
    }
  });

  async function openAutopsyModalForWord(word) {
    const stat = window.aiEngine.userData.wordStats[word.id];
    const chosenAnswer = stat ? stat.lastUserAnswer || "오답 선택" : "오답 선택";
    const autopsy = await window.aiEngine.generateErrorAutopsy(word, chosenAnswer, "choice");
    displayAutopsyModal(autopsy);
  }

  function displayAutopsyModal(autopsy) {
    autopsySourceTag.textContent = autopsy.source || "VocaMind Neural Engine";

    let comparisonHtml = "";
    if (autopsy.confusableComparison) {
      const c = autopsy.confusableComparison;
      comparisonHtml = `
        <div class="autopsy-section">
          <div class="section-label">⚡ 선택 오답 vs 목표 정답 대조 분석</div>
          <div class="comparison-grid">
            <div class="compare-card wrong">
              <div class="compare-tag">내가 선택한 오답</div>
              <div class="compare-word">${c.selected.word}</div>
              <div class="compare-meaning">${c.selected.meaning}</div>
            </div>
            <div class="compare-card correct">
              <div class="compare-tag">올바른 목표 정답</div>
              <div class="compare-word">${c.target.word}</div>
              <div class="compare-meaning">${c.target.meaning}</div>
            </div>
          </div>
          <div style="font-size:0.88rem; color: #cbd5e1; margin-top:0.4rem; padding: 0.6rem 0.8rem; background:rgba(255,255,255,0.03); border-radius:6px;">
            📌 <strong>결정적 차이점:</strong> ${c.keyDifference}
          </div>
        </div>
      `;
    }

    let prescriptionsHtml = "";
    if (autopsy.prescription && autopsy.prescription.length > 0) {
      prescriptionsHtml = `
        <div class="autopsy-section">
          <div class="section-label">💊 AI 맞춤 암기 처방전</div>
          <div class="section-box">
            <ul class="prescription-list">
              ${autopsy.prescription.map(p => `<li>${p}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    }

    autopsyModalBody.innerHTML = `
      <div class="autopsy-word-banner">
        <div>
          <div class="aw-word">${autopsy.targetWord}</div>
          <div class="aw-meaning">${autopsy.correctMeaning}</div>
        </div>
        <button class="btn-tts-audio" data-word="${autopsy.targetWord}">🔊</button>
      </div>

      <div class="autopsy-section">
        <div class="section-label">🚨 오답 원인 인지 분석</div>
        <div class="section-box" style="border-left: 3px solid #ef4444;">
          <div style="font-weight:700; color:#f87171; margin-bottom: 0.3rem;">${autopsy.rootCauseType}</div>
          <div>${autopsy.causeExplanation}</div>
        </div>
      </div>

      ${comparisonHtml}

      <div class="autopsy-section">
        <div class="section-label">🧬 어원 및 구조 해체 (Etymological Anatomy)</div>
        <div class="section-box">
          ${autopsy.etymologyBreakdown || "어원 정보가 제공되지 않았습니다."}
        </div>
      </div>

      <div class="autopsy-section">
        <div class="section-label">💡 뇌 각인 연상 암기 비법 (Mnemonic Anchor)</div>
        <div class="section-box mnemonic-box">
          ${autopsy.mnemonicTip || "단어의 발음과 뜻을 연결하여 나만의 스토리를 상상해 보세요."}
        </div>
      </div>

      <div class="autopsy-section">
        <div class="section-label">📖 실전 콜로케이션 & 예문</div>
        <div class="section-box">
          <div style="font-weight:600; color:#fff; margin-bottom:0.2rem;">${autopsy.collocationGuide}</div>
          <div style="color:var(--text-muted); font-size:0.86rem;">${autopsy.collocationKo}</div>
        </div>
      </div>

      ${prescriptionsHtml}
    `;

    autopsyModalBody.querySelector(".btn-tts-audio").addEventListener("click", () => {
      speakWord(autopsy.targetWord);
    });

    modalAutopsy.classList.add("open");
  }

  btnCloseAutopsy.addEventListener("click", () => {
    modalAutopsy.classList.remove("open");
  });

  modalAutopsy.addEventListener("click", (e) => {
    if (e.target === modalAutopsy) modalAutopsy.classList.remove("open");
  });

  // =========================================================================
  // 6. WORD VAULT (단어 보관함 & 사용자 단어 추가)
  // =========================================================================
  function renderWordVaultUI() {
    const allWords = window.aiEngine.getAllWords();
    const stats = window.aiEngine.userData.wordStats;

    const query = state.vaultSearchQuery.toLowerCase().trim();
    const category = state.vaultCategory;

    const filtered = allWords.filter(w => {
      const matchCat = (category === "ALL" || w.category === category);
      const matchQuery = !query || 
        w.word.toLowerCase().includes(query) || 
        w.meaning.toLowerCase().includes(query) || 
        w.phonetic.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    vaultTableBody.innerHTML = "";

    if (filtered.length === 0) {
      vaultTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem;">
            일치하는 단어가 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(w => {
      const s = stats[w.id];
      let statusHtml = '<span class="status-pill" style="background:rgba(255,255,255,0.06); color:var(--text-muted);">미학습</span>';

      if (s && s.attempts > 0) {
        if (s.wrong >= 2 || (s.attempts >= 2 && s.wrong / s.attempts >= 0.5)) {
          statusHtml = '<span class="status-pill weak">취약</span>';
        } else if (s.srsStage >= 4) {
          statusHtml = '<span class="status-pill mastered">암기 완료</span>';
        } else {
          statusHtml = '<span class="status-pill learning">학습 중</span>';
        }
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="vault-word-cell">
            <span>${w.word}</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">${w.phonetic}</span>
          </div>
        </td>
        <td><span class="pos-tag">${w.partOfSpeech}</span></td>
        <td><strong>${w.meaning}</strong></td>
        <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 320px;">
          ${w.example}
        </td>
        <td>${statusHtml}</td>
        <td style="text-align: right;">
          <button class="btn-tts-audio" data-word="${w.word}" style="width:32px; height:32px; font-size:0.95rem;">🔊</button>
        </td>
      `;

      tr.querySelector(".btn-tts-audio").addEventListener("click", (e) => {
        e.stopPropagation();
        speakWord(w.word);
      });

      vaultTableBody.appendChild(tr);
    });
  }

  vaultSearchInput.addEventListener("input", (e) => {
    state.vaultSearchQuery = e.target.value;
    renderWordVaultUI();
  });

  vaultCategoryFilters.forEach(btn => {
    btn.addEventListener("click", () => {
      window.soundEngine.playClick();
      vaultCategoryFilters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.vaultCategory = btn.dataset.filter;
      renderWordVaultUI();
    });
  });

  // Add Custom Word Modal
  btnOpenAddWordModal.addEventListener("click", () => {
    modalAddWord.classList.add("open");
  });
  btnCloseAddWord.addEventListener("click", () => {
    modalAddWord.classList.remove("open");
  });
  modalAddWord.addEventListener("click", (e) => {
    if (e.target === modalAddWord) modalAddWord.classList.remove("open");
  });

  formAddWord.addEventListener("submit", (e) => {
    e.preventDefault();
    const word = document.getElementById("new-word-text").value;
    const pos = document.getElementById("new-word-pos").value;
    const cat = document.getElementById("new-word-category").value;
    const meaning = document.getElementById("new-word-meaning").value;
    const example = document.getElementById("new-word-example").value;
    const mnemonic = document.getElementById("new-word-mnemonic").value;

    window.aiEngine.addCustomWord({
      word,
      partOfSpeech: pos,
      category: cat,
      meaning,
      example,
      mnemonic
    });

    window.soundEngine.playCorrect();
    modalAddWord.classList.remove("open");
    formAddWord.reset();
    renderWordVaultUI();
    updateDashboardUI();
    alert(`'${word}' 단어가 나만의 단어장에 성공적으로 추가되었습니다!`);
  });

  // =========================================================================
  // 7. SETTINGS & SOUND TOGGLE
  // =========================================================================
  btnOpenSettings.addEventListener("click", () => {
    inputGeminiKey.value = window.aiEngine.getApiKey();
    modalSettings.classList.add("open");
  });
  btnCloseSettings.addEventListener("click", () => {
    modalSettings.classList.remove("open");
  });
  modalSettings.addEventListener("click", (e) => {
    if (e.target === modalSettings) modalSettings.classList.remove("open");
  });

  btnSaveSettings.addEventListener("click", () => {
    window.aiEngine.setApiKey(inputGeminiKey.value);
    modalSettings.classList.remove("open");
    alert("설정이 저장되었습니다.");
  });

  btnResetData.addEventListener("click", () => {
    if (confirm("정말로 모든 학습 이력과 오답 통계를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      localStorage.removeItem("vocamind_user_data_v1");
      window.aiEngine.userData = window.aiEngine.getDefaultUserData();
      window.aiEngine.saveUserData();
      modalSettings.classList.remove("open");
      updateDashboardUI();
      renderErrorClinicUI();
      renderWordVaultUI();
      alert("모든 학습 데이터가 초기화되었습니다.");
    }
  });

  btnToggleSound.addEventListener("click", () => {
    const isMuted = window.soundEngine.toggleMute();
    soundIcon.textContent = isMuted ? "🔇" : "🔊";
    btnToggleSound.title = isMuted ? "효과음 켜기" : "효과음 끄기";
  });

  function updateHeaderStats() {
    const stats = window.aiEngine.userData;
    headerStreakVal.textContent = stats.streak;
    headerXpVal.textContent = `${stats.xp} XP (Lv.${stats.level})`;
  }

  // =========================================================================
  // 8. TEXT-TO-SPEECH (TTS) NATIVE AUDIO
  // =========================================================================
  function speakWord(text) {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92; // Slightly natural articulate rate

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find(v => v.lang.includes("en-US") || v.lang.includes("en_US") || v.lang.startsWith("en"));
    if (usVoice) utterance.voice = usVoice;

    window.speechSynthesis.speak(utterance);
  }

  // Pre-load voices for TTS
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // Initial App Load
  updateDashboardUI();
});
