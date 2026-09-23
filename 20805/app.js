// app.js - PocketPassage 메인 애플리케이션 인터랙션 로직

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. 상태 관리 (State Management)
  // ==========================================
  let customPassages = [];
  try {
    const savedCustom = localStorage.getItem("pocket_custom_passages");
    if (savedCustom) customPassages = JSON.parse(savedCustom);
  } catch (e) {
    console.error("Failed to load custom passages", e);
  }

  const allPassages = [...PRESET_PASSAGES, ...customPassages];
  let currentPassageId = allPassages[0].id;
  let currentSentenceIndex = 0;

  // 옵션 상태
  let showChunking = true;
  let showGrammar = true;
  let isCompleteTransMode = false; // false = 직독직해 위주, true = 완역 위주
  let showTransBox = true;

  // 단어장 단어 한글 뜻 정제 헬퍼
  function sanitizeVocabulary(items) {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      // 만약 더미 텍스트나 빈 뜻이 들어있다면 dict.js를 통해 복원
      if (!item.meaning || item.meaning.includes("수능/모의고사") || item.meaning.includes("클릭하여") || item.meaning.includes("뜻 로딩 중")) {
        const dict = typeof findDictEntry === "function" ? findDictEntry(item.word) : null;
        if (dict) {
          item.meaning = dict.meaning;
          item.pos = dict.pos;
          item.phonetic = dict.phonetic || item.phonetic;
        }
      }
      return item;
    });
  }

  // 단어장 상태
  let vocabulary = [];
  try {
    const savedVoca = localStorage.getItem("pocket_voca_items");
    if (savedVoca) {
      vocabulary = sanitizeVocabulary(JSON.parse(savedVoca));
      localStorage.setItem("pocket_voca_items", JSON.stringify(vocabulary));
    } else {
      vocabulary = sanitizeVocabulary([...INITIAL_VOCABULARY]);
      localStorage.setItem("pocket_voca_items", JSON.stringify(vocabulary));
    }
  } catch (e) {
    vocabulary = sanitizeVocabulary([...INITIAL_VOCABULARY]);
  }

  let vocaMode = "flash"; // 'flash' | 'list'
  let flashcardIndex = 0;
  let isFlashFlipped = false;
  let alwaysShowMeaning = false; // 플래시카드 앞면에 뜻 상시 노출 여부
  let vocaFilter = "all"; // 'all' | 'unlearned'
  let vocaSearchQuery = "";

  // 퀴즈 상태
  let currentQuizType = "grammar"; // 'grammar' | 'blank' | 'order'
  let selectedQuizOption = null;

  // 테마 및 글자 크기
  let currentTheme = localStorage.getItem("pocket_theme") || "dark";
  document.body.setAttribute("data-theme", currentTheme);

  const fontSizes = ["1.05rem", "1.2rem", "1.35rem"];
  let fontSizeIndex = 1;
  document.documentElement.style.setProperty("--content-font-size", fontSizes[fontSizeIndex]);

  // ==========================================
  // 2. DOM 요소 참조
  // ==========================================
  const toastEl = document.getElementById("toast");
  const passageSelect = document.getElementById("passageSelect");
  const badgeCategory = document.getElementById("badgeCategory");
  const badgeDifficulty = document.getElementById("badgeDifficulty");
  const textSource = document.getElementById("textSource");

  // Focus Reader DOM
  const sentenceStepPill = document.getElementById("sentenceStepPill");
  const sentencePercentText = document.getElementById("sentencePercentText");
  const stepDotsContainer = document.getElementById("stepDotsContainer");
  const sentenceNumLabel = document.getElementById("sentenceNumLabel");
  const sentenceEnBox = document.getElementById("sentenceEnBox");
  const chunkBox = document.getElementById("chunkBox");
  const sentenceKoBox = document.getElementById("sentenceKoBox");
  const transBoxHeading = document.getElementById("transBoxHeading");
  const grammarCardsList = document.getElementById("grammarCardsList");
  const sentenceWordsStrip = document.getElementById("sentenceWordsStrip");
  const btnPrevSentence = document.getElementById("btnPrevSentence");
  const btnNextSentence = document.getElementById("btnNextSentence");
  const btnSpeakSentence = document.getElementById("btnSpeakSentence");

  // Toggles
  const toggleChunkingBtn = document.getElementById("toggleChunking");
  const toggleGrammarBtn = document.getElementById("toggleGrammar");
  const toggleTransModeBtn = document.getElementById("toggleTransMode");
  const transModeLabel = document.getElementById("transModeLabel");
  const btnToggleTransView = document.getElementById("btnToggleTransView");

  // Full Passage DOM
  const fullPassageSummary = document.getElementById("fullPassageSummary");
  const fullSentenceList = document.getElementById("fullSentenceList");
  const fullTranslationBox = document.getElementById("fullTranslationBox");

  // Vocabulary DOM
  const vocaStatsCount = document.getElementById("vocaStatsCount");
  const btnVocaModeFlash = document.getElementById("btnVocaModeFlash");
  const btnVocaModeList = document.getElementById("btnVocaModeList");
  const vocaFlashcardSub = document.getElementById("vocaFlashcardSub");
  const vocaListSub = document.getElementById("vocaListSub");
  const flashcard3D = document.getElementById("flashcard3D");
  const fcWord = document.getElementById("fcWord");
  const fcPhonetic = document.getElementById("fcPhonetic");
  const fcPos = document.getElementById("fcPos");
  const fcMeaning = document.getElementById("fcMeaning");
  const fcExample = document.getElementById("fcExample");
  const fcFrontMeaningBox = document.getElementById("fcFrontMeaningBox");
  const fcFrontHint = document.getElementById("fcFrontHint");
  const btnFcFlipFront = document.getElementById("btnFcFlipFront");
  const btnToggleAlwaysShowMeaning = document.getElementById("btnToggleAlwaysShowMeaning");
  const alwaysShowMeaningStatus = document.getElementById("alwaysShowMeaningStatus");
  const btnFcPrev = document.getElementById("btnFcPrev");
  const btnFcNext = document.getElementById("btnFcNext");
  const btnFcMemorized = document.getElementById("btnFcMemorized");
  const btnFcSpeak = document.getElementById("btnFcSpeak");
  const btnFcAudio = document.getElementById("btnFcAudio");
  const vocaListContainer = document.getElementById("vocaListContainer");
  const vocaSearchInput = document.getElementById("vocaSearchInput");
  const btnFilterAll = document.getElementById("btnFilterAll");
  const btnFilterUnlearned = document.getElementById("btnFilterUnlearned");

  // Quiz DOM
  const btnToggleParaphrase = document.getElementById("btnToggleParaphrase");
  const paraphraseContent = document.getElementById("paraphraseContent");
  const paraphraseIcon = document.getElementById("paraphraseIcon");
  const paraphrasedTextEn = document.getElementById("paraphrasedTextEn");
  const paraphrasedTextKo = document.getElementById("paraphrasedTextKo");
  const quizTabBtns = document.querySelectorAll(".quiz-tab-btn");
  const quizInstruction = document.getElementById("quizInstruction");
  const quizPassageBox = document.getElementById("quizPassageBox");
  const quizOptionsList = document.getElementById("quizOptionsList");
  const quizExplanationBox = document.getElementById("quizExplanationBox");
  const quizExplanationBody = document.getElementById("quizExplanationBody");

  // Modals
  const modalWord = document.getElementById("modalWord");
  const popWordTerm = document.getElementById("popWordTerm");
  const popWordPos = document.getElementById("popWordPos");
  const popWordPhonetic = document.getElementById("popWordPhonetic");
  const popWordMeaningInput = document.getElementById("popWordMeaningInput");
  const popWordExample = document.getElementById("popWordExample");
  const linkNaverDict = document.getElementById("linkNaverDict");
  const linkDaumDict = document.getElementById("linkDaumDict");
  const btnSaveToVoca = document.getElementById("btnSaveToVoca");
  const btnSaveToVocaText = document.getElementById("btnSaveToVocaText");
  const btnPopSpeak = document.getElementById("btnPopSpeak");
  const btnCloseWordModal = document.getElementById("btnCloseWordModal");

  const modalCustomPassage = document.getElementById("modalCustomPassage");
  const btnOpenNewPassageModal = document.getElementById("btnOpenNewPassageModal");
  const btnCloseCustomModal = document.getElementById("btnCloseCustomModal");
  const btnSubmitCustomPassage = document.getElementById("btnSubmitCustomPassage");
  const customTitleInput = document.getElementById("customTitleInput");
  const customTextInput = document.getElementById("customTextInput");

  const modalHelp = document.getElementById("modalHelp");
  const btnHelp = document.getElementById("btnHelp");
  const btnCloseHelpModal = document.getElementById("btnCloseHelpModal");

  // Header controls
  const btnThemeToggle = document.getElementById("btnThemeToggle");
  const btnFontSize = document.getElementById("btnFontSize");
  const brandBtn = document.getElementById("brandBtn");

  // Bottom Nav Tabs
  const navTabs = document.querySelectorAll(".nav-tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // ==========================================
  // 3. 헬퍼 & 유틸 함수
  // ==========================================
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2400);
  }

  function getCurrentPassage() {
    return allPassages.find(p => p.id === currentPassageId) || allPassages[0];
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      showToast("이 브라우저는 음성(TTS)을 지원하지 않습니다.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }

  function saveVocaToStorage() {
    localStorage.setItem("pocket_voca_items", JSON.stringify(vocabulary));
    updateVocaUI();
  }

  // ==========================================
  // 4. 지문 선택기 렌더링
  // ==========================================
  function renderPassageSelector() {
    passageSelect.innerHTML = "";
    allPassages.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `[${p.category}] ${p.title}`;
      if (p.id === currentPassageId) opt.selected = true;
      passageSelect.appendChild(opt);
    });

    const passage = getCurrentPassage();
    badgeCategory.textContent = passage.category;
    badgeCategory.className = `badge badge-${passage.badgeColor || 'purple'}`;
    badgeDifficulty.textContent = passage.difficulty;
    textSource.textContent = passage.source;
  }

  // ==========================================
  // 5. 1문장 포커스 뷰 (Focus Reader) 렌더링
  // ==========================================
  function renderFocusReader() {
    const passage = getCurrentPassage();
    const totalSentences = passage.sentences.length;
    if (currentSentenceIndex >= totalSentences) currentSentenceIndex = 0;
    if (currentSentenceIndex < 0) currentSentenceIndex = 0;

    const sentence = passage.sentences[currentSentenceIndex];

    // 진도율 업데이트
    const currentNum = currentSentenceIndex + 1;
    sentenceStepPill.textContent = `문장 ${currentNum} / ${totalSentences}`;
    const percent = Math.round((currentNum / totalSentences) * 100);
    sentencePercentText.textContent = `${percent}%`;

    // 스텝 도트 렌더링
    stepDotsContainer.innerHTML = "";
    for (let i = 0; i < totalSentences; i++) {
      const dot = document.createElement("div");
      dot.className = `dot ${i === currentSentenceIndex ? "active" : i < currentSentenceIndex ? "passed" : ""}`;
      dot.title = `${i + 1}번 문장으로 이동`;
      dot.addEventListener("click", () => {
        currentSentenceIndex = i;
        renderFocusReader();
      });
      stepDotsContainer.appendChild(dot);
    }

    sentenceNumLabel.textContent = `SENTENCE ${currentNum < 10 ? "0" + currentNum : currentNum}`;

    // 영어 본문 렌더링 (단어별 인터랙티브 칩)
    sentenceEnBox.innerHTML = "";
    const words = sentence.en.split(/(\s+)/);
    words.forEach(token => {
      if (/^\s+$/.test(token)) {
        sentenceEnBox.appendChild(document.createTextNode(token));
      } else {
        const cleanWord = token.replace(/^[^\w]+|[^\w]+$/g, "");
        const span = document.createElement("span");
        span.className = "word-chip";
        span.textContent = token;
        
        // 마우스 호버 시 툴팁으로 사전 뜻 미리보기
        const dict = typeof findDictEntry === "function" ? findDictEntry(cleanWord) : null;
        span.title = dict ? `${cleanWord}: ${dict.meaning}` : `단어 '${cleanWord}' 사전 검색`;

        span.addEventListener("click", (e) => {
          e.stopPropagation();
          openWordModal(cleanWord, sentence.en);
        });
        sentenceEnBox.appendChild(span);
      }
    });

    // 끊어읽기(청킹) 슬래시 렌더링
    chunkBox.innerHTML = "";
    if (showChunking && sentence.chunks && sentence.chunks.length > 0) {
      chunkBox.style.display = "flex";
      sentence.chunks.forEach((chk) => {
        const item = document.createElement("div");
        item.className = "chunk-item";
        item.innerHTML = `
          <div class="chunk-en">${chk.en} <span style="color:var(--chunk-slash); font-weight:800; margin-left:4px;">/</span></div>
          <div class="chunk-ko">${chk.ko}</div>
        `;
        chunkBox.appendChild(item);
      });
    } else {
      chunkBox.style.display = "none";
    }

    // 해석 렌더링
    if (isCompleteTransMode) {
      transBoxHeading.textContent = "자연스러운 전체 완역";
      sentenceKoBox.textContent = sentence.ko;
    } else {
      transBoxHeading.textContent = "직독직해 및 구문 번역";
      sentenceKoBox.textContent = sentence.ko;
    }
    sentenceKoBox.style.display = showTransBox ? "block" : "none";
    btnToggleTransView.textContent = showTransBox ? "해석 숨기기" : "해석 보기";

    // 어법 분석 렌더링
    grammarCardsList.innerHTML = "";
    const grammarSection = document.getElementById("grammarSection");
    if (showGrammar && sentence.grammar && sentence.grammar.length > 0) {
      grammarSection.style.display = "flex";
      sentence.grammar.forEach(item => {
        const card = document.createElement("div");
        card.className = "grammar-card";
        card.innerHTML = `
          <div class="grammar-header">
            <span class="grammar-tag" style="background:var(--tag-${item.type || 'rel'}-bg); color:var(--tag-${item.type || 'rel'}-text);">
              ${item.term}
            </span>
            <span class="grammar-target">${item.target}</span>
          </div>
          <div class="grammar-note">${item.note}</div>
        `;
        grammarCardsList.appendChild(card);
      });
    } else {
      grammarSection.style.display = "none";
    }

    // ★ 문장의 핵심 단어 & 한글 뜻 스트립 생성
    sentenceWordsStrip.innerHTML = "";
    
    // 1) 문장 내 모든 실질 단어 추출
    const rawTokens = sentence.en.replace(/[^\w\s-]/g, "").split(/\s+/).filter(w => w.length > 2);
    const uniqueTokens = [...new Set(rawTokens.map(t => t.toLowerCase()))];
    
    // 2) 등록된 words와 dict.js를 통합하여 단어 목록 구성
    const displayWordList = [];
    uniqueTokens.forEach(t => {
      const existing = (sentence.words || []).find(w => w.word.toLowerCase() === t);
      const dict = typeof findDictEntry === "function" ? findDictEntry(t) : null;
      
      const meaning = existing && !existing.meaning.includes("클릭") && !existing.meaning.includes("수능")
        ? existing.meaning
        : (dict ? dict.meaning : "터치하여 사전 검색");
      
      displayWordList.push({
        word: t,
        pos: existing ? existing.pos : (dict ? dict.pos : ""),
        meaning: meaning,
        phonetic: existing ? existing.phonetic : (dict ? dict.phonetic : "")
      });
    });

    displayWordList.forEach(w => {
      const chip = document.createElement("div");
      chip.className = "voca-chip";
      const isAlreadySaved = vocabulary.some(v => v.word.toLowerCase() === w.word.toLowerCase());
      
      chip.innerHTML = `
        <span style="color:${isAlreadySaved ? 'var(--accent-amber)' : 'var(--text-muted)'}; font-size:0.9rem;">${isAlreadySaved ? '★' : '☆'}</span>
        <span class="voca-chip-word">${w.word}</span>
        <span class="voca-chip-meaning-highlight">${w.meaning}</span>
      `;
      chip.addEventListener("click", () => {
        openWordModal(w.word, sentence.en, w);
      });
      sentenceWordsStrip.appendChild(chip);
    });

    // 버튼 활성/비활성화
    btnPrevSentence.disabled = currentSentenceIndex === 0;
    btnNextSentence.disabled = currentSentenceIndex === totalSentences - 1;
    if (currentSentenceIndex === totalSentences - 1) {
      btnNextSentence.textContent = "학습 완료 🎉";
    } else {
      btnNextSentence.innerHTML = `다음 문장 <span>→</span>`;
    }
  }

  // ==========================================
  // 6. 전체 지문 뷰 (Full Passage) 렌더링
  // ==========================================
  function renderFullPassage() {
    const passage = getCurrentPassage();
    fullPassageSummary.textContent = passage.summary;
    fullSentenceList.innerHTML = "";

    passage.sentences.forEach((s, idx) => {
      const item = document.createElement("div");
      item.className = `full-sentence-item ${idx === currentSentenceIndex ? "active" : ""}`;
      item.innerHTML = `
        <div class="full-s-en">
          <span style="color:var(--accent-primary); font-weight:800; margin-right:6px;">[${idx + 1}]</span>
          ${s.en}
        </div>
        <div class="full-s-ko">${s.ko}</div>
      `;
      item.addEventListener("click", () => {
        currentSentenceIndex = idx;
        switchTab("tabFocus");
        renderFocusReader();
      });
      fullSentenceList.appendChild(item);
    });

    fullTranslationBox.textContent = passage.sentences.map((s, i) => `(${i + 1}) ${s.ko}`).join(" ");
  }

  // ==========================================
  // 7. 단어장 (Vocabulary) 렌더링
  // ==========================================
  function updateVocaUI() {
    const totalCount = vocabulary.length;
    const memorizedCount = vocabulary.filter(v => v.memorized).length;
    vocaStatsCount.textContent = `저장 ${totalCount}단어 (외움 ${memorizedCount})`;

    // Flashcard 렌더링
    renderFlashcard();

    // List 렌더링
    renderVocaList();
  }

  function getFilteredVoca() {
    return vocabulary.filter(item => {
      const query = vocaSearchQuery.toLowerCase();
      const matchQuery = item.word.toLowerCase().includes(query) ||
                         (item.meaning && item.meaning.toLowerCase().includes(query));
      if (vocaFilter === "unlearned") {
        return matchQuery && !item.memorized;
      }
      return matchQuery;
    });
  }

  function renderFlashcard() {
    const filtered = getFilteredVoca();
    if (filtered.length === 0) {
      fcWord.textContent = "저장된 단어 없음";
      fcPhonetic.textContent = "";
      fcPos.textContent = "";
      fcMeaning.textContent = "지문에서 단어를 터치하여 추가하세요";
      fcExample.textContent = "";
      if (fcFrontMeaningBox) fcFrontMeaningBox.style.display = "none";
      btnFcMemorized.classList.remove("active");
      return;
    }

    if (flashcardIndex >= filtered.length) flashcardIndex = 0;
    if (flashcardIndex < 0) flashcardIndex = filtered.length - 1;

    const item = filtered[flashcardIndex];
    fcWord.textContent = item.word;
    fcPhonetic.textContent = item.phonetic || "";
    fcPos.textContent = item.pos ? `[${item.pos}]` : "";
    fcMeaning.textContent = item.meaning || "뜻 없음";
    fcExample.textContent = item.example || "예문이 등록되지 않았습니다.";

    // 상시 뜻 노출 토글 상태 반영
    if (fcFrontMeaningBox) {
      if (alwaysShowMeaning) {
        fcFrontMeaningBox.style.display = "inline-block";
        fcFrontMeaningBox.textContent = item.meaning;
        fcFrontHint.textContent = "뜻 상시 표시 모드 활성화됨 (클릭 시 예문 확인)";
      } else {
        fcFrontMeaningBox.style.display = "none";
        fcFrontHint.textContent = "터치하여 뜻 확인 (클릭 시 뒤집힘)";
      }
    }

    if (item.memorized) {
      btnFcMemorized.classList.add("active");
    } else {
      btnFcMemorized.classList.remove("active");
    }

    // 카드 앞면으로 리셋
    isFlashFlipped = false;
    flashcard3D.classList.remove("flipped");
  }

  function renderVocaList() {
    const filtered = getFilteredVoca();
    vocaListContainer.innerHTML = "";

    if (filtered.length === 0) {
      vocaListContainer.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--text-muted); font-size:0.85rem;">
          검색된 단어가 없습니다. 본문의 단어를 터치해 바로 단어장에 추가해보세요!
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement("div");
      row.className = `voca-list-item ${item.memorized ? "is-memorized" : ""}`;
      row.innerHTML = `
        <div class="voca-item-main" style="flex:1;">
          <div class="voca-item-word">
            ${item.word}
            ${item.pos ? `<span class="voca-item-pos">${item.pos}</span>` : ""}
            ${item.phonetic ? `<span style="font-size:0.75rem; color:var(--text-muted);">${item.phonetic}</span>` : ""}
          </div>
          <!-- 선명하고 확실한 한글 뜻 노출 -->
          <div class="voca-item-meaning" style="color:var(--text-primary); font-weight:700; font-size:0.95rem; margin-top:3px;">
            <span style="color:var(--accent-primary); font-weight:800; margin-right:4px;">▶</span>${item.meaning}
          </div>
        </div>
        <div class="voca-item-actions">
          <button class="btn-voca-check ${item.memorized ? 'checked' : ''}" title="암기 완료 토글">
            ${item.memorized ? '✓' : '○'}
          </button>
          <button class="icon-btn btn-row-speak" title="발음 듣기" style="width:32px; height:32px; font-size:0.85rem;">🔊</button>
          <button class="btn-voca-del" title="삭제">&times;</button>
        </div>
      `;

      // 이벤트 바인딩
      const checkBtn = row.querySelector(".btn-voca-check");
      checkBtn.addEventListener("click", () => {
        item.memorized = !item.memorized;
        saveVocaToStorage();
      });

      const audioBtn = row.querySelector(".btn-row-speak");
      audioBtn.addEventListener("click", () => {
        speak(item.word);
      });

      const delBtn = row.querySelector(".btn-voca-del");
      delBtn.addEventListener("click", () => {
        vocabulary = vocabulary.filter(v => v.id !== item.id);
        saveVocaToStorage();
        showToast(`단어 '${item.word}' 삭제됨`);
      });

      vocaListContainer.appendChild(row);
    });
  }

  // ==========================================
  // 8. 변형 퀴즈 & 유사 지문 렌더링
  // ==========================================
  function renderQuizSection() {
    const passage = getCurrentPassage();

    // 1. 유사 지문(Paraphrased) 렌더링
    paraphrasedTextEn.textContent = passage.paraphrased || "유사 지문 분석 로딩 중...";
    paraphrasedTextKo.textContent = passage.paraphrasedKo || "";

    // 2. 퀴즈 렌더링
    const variations = passage.variations || [];
    const question = variations.find(v => v.type === currentQuizType) || variations[0];

    // 선택 리셋
    selectedQuizOption = null;
    quizExplanationBox.classList.remove("show");

    if (!question) {
      quizInstruction.textContent = "준비된 변형 문제가 없습니다.";
      quizPassageBox.innerHTML = "";
      quizOptionsList.innerHTML = "";
      return;
    }

    quizInstruction.textContent = question.title + "\n" + (question.instruction || "");

    // 지문 맥락 표시
    if (question.type === "grammar") {
      quizPassageBox.innerHTML = question.passageWithUnderlines || passage.sentences.map(s => s.en).join(" ");
    } else if (question.type === "blank") {
      quizPassageBox.innerHTML = question.passageWithBlank || "";
    } else if (question.type === "order") {
      quizPassageBox.innerHTML = `
        <div style="font-weight:700; margin-bottom:10px;">[주어진 글]<br>${question.givenSentence}</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div><strong>(A)</strong> ${question.paragraphs.A}</div>
          <div><strong>(B)</strong> ${question.paragraphs.B}</div>
          <div><strong>(C)</strong> ${question.paragraphs.C}</div>
        </div>
      `;
    }

    // 보기 옵션 렌더링
    quizOptionsList.innerHTML = "";
    question.options.forEach((optText, optIdx) => {
      const optBtn = document.createElement("div");
      optBtn.className = "option-item";
      optBtn.textContent = optText;

      optBtn.addEventListener("click", () => {
        handleQuizAnswer(optIdx, question, optBtn);
      });

      quizOptionsList.appendChild(optBtn);
    });

    quizExplanationBody.textContent = question.explanation;
  }

  function handleQuizAnswer(selectedIdx, question) {
    if (selectedQuizOption !== null) return;
    selectedQuizOption = selectedIdx;

    const allOptions = quizOptionsList.querySelectorAll(".option-item");
    const isCorrect = selectedIdx === question.correctIndex;

    allOptions.forEach((btn, idx) => {
      if (idx === question.correctIndex) {
        btn.classList.add("selected-correct");
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add("selected-wrong");
      }
    });

    quizExplanationBox.classList.add("show");
    const explanationIcon = document.getElementById("explanationIcon");
    const explanationTitle = document.getElementById("explanationTitle");

    if (isCorrect) {
      explanationIcon.textContent = "🎉";
      explanationTitle.textContent = "정답입니다! 완벽한 구문 분석입니다.";
      showToast("정답입니다! 👏");
    } else {
      explanationIcon.textContent = "❌";
      explanationTitle.textContent = "아쉽네요! 오답 노트를 확인하세요.";
      showToast("오답입니다. 해설을 확인해보세요.");
    }
  }

  // ==========================================
  // 9. 원터치 사전 모달 & 단어 저장
  // ==========================================
  let currentActiveWordInfo = null;

  function openWordModal(word, contextSentence, existingWordObj = null) {
    if (!word) return;
    const cleanWord = word.trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
    if (!cleanWord) return;

    // 1) dict.js 영한 사전에서 검색 (형태소 분석 포함)
    const dictMatch = typeof findDictEntry === "function" ? findDictEntry(cleanWord) : null;

    // 2) 이미 단어장에 저장된 데이터 확인
    const savedMatch = vocabulary.find(v => v.word.toLowerCase() === cleanWord);

    // 3) 지문 내 프리셋 words 확인
    const passage = getCurrentPassage();
    let passageWord = existingWordObj;
    if (!passageWord) {
      for (let s of passage.sentences) {
        if (s.words) {
          const match = s.words.find(w => w.word.toLowerCase() === cleanWord);
          if (match) { passageWord = match; break; }
        }
      }
    }

    const term = cleanWord;
    const pos = passageWord ? passageWord.pos : (dictMatch ? dictMatch.pos : "단어");
    const phonetic = passageWord ? passageWord.phonetic : (dictMatch ? dictMatch.phonetic : "");
    
    // 뜻 우선순위: 사용자가 이미 수정한 뜻 > 지문 프리셋 뜻 > dict.js 사전 뜻 > 실시간 번역
    let initialMeaning = "뜻 검색 중...";
    if (savedMatch && savedMatch.meaning && !savedMatch.meaning.includes("수능/모의고사")) {
      initialMeaning = savedMatch.meaning;
    } else if (passageWord && passageWord.meaning && !passageWord.meaning.includes("클릭하여")) {
      initialMeaning = passageWord.meaning;
    } else if (dictMatch && dictMatch.meaning) {
      initialMeaning = dictMatch.meaning;
    }

    const example = contextSentence || (passageWord ? passageWord.example : "");

    currentActiveWordInfo = {
      id: "v-" + Date.now(),
      word: term,
      pos: pos,
      phonetic: phonetic,
      meaning: initialMeaning,
      example: example,
      memorized: false,
      savedAt: new Date().toISOString().split("T")[0]
    };

    popWordTerm.textContent = term;
    popWordPos.textContent = pos;
    popWordPhonetic.textContent = phonetic;
    popWordMeaningInput.value = initialMeaning;
    popWordExample.textContent = example ? `"${example}"` : "";

    // 외부 포털 사전 링크
    linkNaverDict.href = `https://en.dict.naver.com/#/search?query=${encodeURIComponent(term)}`;
    linkDaumDict.href = `https://dic.daum.net/search.do?q=${encodeURIComponent(term)}&dic=eng`;

    if (savedMatch) {
      btnSaveToVocaText.textContent = "단어장에 저장됨 (삭제하기)";
      btnSaveToVoca.style.background = "var(--accent-emerald)";
    } else {
      btnSaveToVocaText.textContent = "내 단어장에 저장";
      btnSaveToVoca.style.background = "var(--accent-primary)";
    }

    modalWord.classList.add("open");

    // 만약 사전에도 없거나 "뜻 검색 중..."인 경우 실시간 번역 API 호출
    if (initialMeaning === "뜻 검색 중..." || initialMeaning.includes("사전 검색")) {
      if (typeof fetchOnlineTranslation === "function") {
        fetchOnlineTranslation(term).then(transResult => {
          if (transResult && popWordTerm.textContent === term) {
            popWordMeaningInput.value = transResult;
            currentActiveWordInfo.meaning = transResult;
          }
        });
      }
    }
  }

  btnSaveToVoca.addEventListener("click", () => {
    if (!currentActiveWordInfo) return;
    const cleanWord = currentActiveWordInfo.word.toLowerCase();
    const existingIdx = vocabulary.findIndex(v => v.word.toLowerCase() === cleanWord);

    // 사용자가 입력 필드에서 직접 편집한 뜻 반영
    const finalMeaning = popWordMeaningInput.value.trim() || currentActiveWordInfo.meaning;
    currentActiveWordInfo.meaning = finalMeaning;

    if (existingIdx >= 0) {
      vocabulary.splice(existingIdx, 1);
      btnSaveToVocaText.textContent = "내 단어장에 저장";
      btnSaveToVoca.style.background = "var(--accent-primary)";
      showToast(`단어장 삭제: ${currentActiveWordInfo.word}`);
    } else {
      vocabulary.unshift(currentActiveWordInfo);
      btnSaveToVocaText.textContent = "단어장에 저장됨 (삭제하기)";
      btnSaveToVoca.style.background = "var(--accent-emerald)";
      showToast(`단어장에 저장되었습니다! (${finalMeaning}) ⭐`);
    }
    saveVocaToStorage();
    renderFocusReader();
  });

  btnPopSpeak.addEventListener("click", () => {
    if (currentActiveWordInfo) speak(currentActiveWordInfo.word);
  });

  btnCloseWordModal.addEventListener("click", () => {
    modalWord.classList.remove("open");
  });

  // ==========================================
  // 10. 탭 전환 관리
  // ==========================================
  function switchTab(tabId) {
    navTabs.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    tabContents.forEach(content => {
      content.classList.toggle("active", content.id === tabId);
    });

    if (tabId === "tabFocus") renderFocusReader();
    if (tabId === "tabFull") renderFullPassage();
    if (tabId === "tabVoca") updateVocaUI();
    if (tabId === "tabQuiz") renderQuizSection();
  }

  navTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });
  });

  brandBtn.addEventListener("click", () => {
    switchTab("tabFocus");
  });

  // ==========================================
  // 11. 인터랙션 이벤트 핸들러
  // ==========================================
  passageSelect.addEventListener("change", (e) => {
    currentPassageId = e.target.value;
    currentSentenceIndex = 0;
    renderPassageSelector();
    renderFocusReader();
    renderFullPassage();
    renderQuizSection();
    showToast("새 지문이 로드되었습니다.");
  });

  btnPrevSentence.addEventListener("click", () => {
    if (currentSentenceIndex > 0) {
      currentSentenceIndex--;
      renderFocusReader();
    }
  });

  btnNextSentence.addEventListener("click", () => {
    const passage = getCurrentPassage();
    if (currentSentenceIndex < passage.sentences.length - 1) {
      currentSentenceIndex++;
      renderFocusReader();
    } else {
      showToast("마지막 문장입니다. 변형 퀴즈를 풀어보세요!");
      switchTab("tabQuiz");
    }
  });

  btnSpeakSentence.addEventListener("click", () => {
    const passage = getCurrentPassage();
    const sentence = passage.sentences[currentSentenceIndex];
    if (sentence) {
      btnSpeakSentence.classList.add("playing");
      speak(sentence.en);
      setTimeout(() => {
        btnSpeakSentence.classList.remove("playing");
      }, 3500);
    }
  });

  toggleChunkingBtn.addEventListener("click", () => {
    showChunking = !showChunking;
    toggleChunkingBtn.classList.toggle("active", showChunking);
    renderFocusReader();
  });

  toggleGrammarBtn.addEventListener("click", () => {
    showGrammar = !showGrammar;
    toggleGrammarBtn.classList.toggle("active", showGrammar);
    renderFocusReader();
  });

  toggleTransModeBtn.addEventListener("click", () => {
    isCompleteTransMode = !isCompleteTransMode;
    toggleTransModeBtn.classList.toggle("active", isCompleteTransMode);
    transModeLabel.textContent = isCompleteTransMode ? "자연스러운 완역" : "직독직해 모드";
    renderFocusReader();
  });

  btnToggleTransView.addEventListener("click", () => {
    showTransBox = !showTransBox;
    sentenceKoBox.style.display = showTransBox ? "block" : "none";
    btnToggleTransView.textContent = showTransBox ? "해석 숨기기" : "해석 보기";
  });

  btnThemeToggle.addEventListener("click", () => {
    const themes = ["dark", "sepia", "light"];
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    currentTheme = themes[nextIdx];
    document.body.setAttribute("data-theme", currentTheme);
    localStorage.setItem("pocket_theme", currentTheme);
    showToast(`테마: ${currentTheme.toUpperCase()}`);
  });

  btnFontSize.addEventListener("click", () => {
    fontSizeIndex = (fontSizeIndex + 1) % fontSizes.length;
    document.documentElement.style.setProperty("--content-font-size", fontSizes[fontSizeIndex]);
    showToast(`글자 크기: ${fontSizeIndex === 0 ? '보통' : fontSizeIndex === 1 ? '크게' : '아주 크게'}`);
  });

  // 플래시카드 뒤집기
  flashcard3D.addEventListener("click", () => {
    isFlashFlipped = !isFlashFlipped;
    flashcard3D.classList.toggle("flipped", isFlashFlipped);
  });

  if (btnFcFlipFront) {
    btnFcFlipFront.addEventListener("click", (e) => {
      e.stopPropagation();
      isFlashFlipped = !isFlashFlipped;
      flashcard3D.classList.toggle("flipped", isFlashFlipped);
    });
  }

  // 플래시카드 앞면 뜻 상시 노출 토글
  if (btnToggleAlwaysShowMeaning) {
    btnToggleAlwaysShowMeaning.addEventListener("click", () => {
      alwaysShowMeaning = !alwaysShowMeaning;
      alwaysShowMeaningStatus.textContent = alwaysShowMeaning ? "ON" : "OFF";
      renderFlashcard();
      showToast(alwaysShowMeaning ? "뜻 앞면 상시 표시 켜짐" : "뜻 숨김 (뒤집기 모드)");
    });
  }

  btnFcPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    const filtered = getFilteredVoca();
    if (filtered.length > 0) {
      flashcardIndex = (flashcardIndex - 1 + filtered.length) % filtered.length;
      renderFlashcard();
    }
  });

  btnFcNext.addEventListener("click", (e) => {
    e.stopPropagation();
    const filtered = getFilteredVoca();
    if (filtered.length > 0) {
      flashcardIndex = (flashcardIndex + 1) % filtered.length;
      renderFlashcard();
    }
  });

  btnFcMemorized.addEventListener("click", (e) => {
    e.stopPropagation();
    const filtered = getFilteredVoca();
    if (filtered.length > 0) {
      const item = filtered[flashcardIndex];
      item.memorized = !item.memorized;
      saveVocaToStorage();
      showToast(item.memorized ? `'${item.word}' 외움 완료! ✨` : `'${item.word}' 미암기로 변경`);
    }
  });

  btnFcSpeak.addEventListener("click", (e) => {
    e.stopPropagation();
    const filtered = getFilteredVoca();
    if (filtered.length > 0) speak(filtered[flashcardIndex].word);
  });

  btnFcAudio.addEventListener("click", (e) => {
    e.stopPropagation();
    const filtered = getFilteredVoca();
    if (filtered.length > 0) speak(filtered[flashcardIndex].word);
  });

  btnVocaModeFlash.addEventListener("click", () => {
    vocaMode = "flash";
    btnVocaModeFlash.classList.add("active");
    btnVocaModeList.classList.remove("active");
    vocaFlashcardSub.style.display = "block";
    vocaListSub.style.display = "none";
  });

  btnVocaModeList.addEventListener("click", () => {
    vocaMode = "list";
    btnVocaModeList.classList.add("active");
    btnVocaModeFlash.classList.remove("active");
    vocaFlashcardSub.style.display = "none";
    vocaListSub.style.display = "block";
    renderVocaList();
  });

  btnFilterAll.addEventListener("click", () => {
    vocaFilter = "all";
    btnFilterAll.classList.add("active");
    btnFilterUnlearned.classList.remove("active");
    updateVocaUI();
  });

  btnFilterUnlearned.addEventListener("click", () => {
    vocaFilter = "unlearned";
    btnFilterUnlearned.classList.add("active");
    btnFilterAll.classList.remove("active");
    updateVocaUI();
  });

  vocaSearchInput.addEventListener("input", (e) => {
    vocaSearchQuery = e.target.value.trim();
    renderVocaList();
  });

  quizTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      quizTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentQuizType = btn.dataset.quizType;
      renderQuizSection();
    });
  });

  btnToggleParaphrase.addEventListener("click", () => {
    const isHidden = paraphraseContent.style.display === "none";
    paraphraseContent.style.display = isHidden ? "flex" : "none";
    paraphraseIcon.textContent = isHidden ? "▲" : "▼";
  });

  btnOpenNewPassageModal.addEventListener("click", () => {
    modalCustomPassage.classList.add("open");
  });

  btnCloseCustomModal.addEventListener("click", () => {
    modalCustomPassage.classList.remove("open");
  });

  btnSubmitCustomPassage.addEventListener("click", () => {
    const title = customTitleInput.value.trim() || "사용자 직접 입력 지문";
    const rawText = customTextInput.value.trim();

    if (!rawText || rawText.length < 15) {
      alert("지문 본문을 1문장 이상 영어로 충분히 입력해주세요.");
      return;
    }

    const newPassage = parseCustomPassage(rawText, title);
    if (!newPassage) {
      alert("지문을 파싱하는데 실패했습니다.");
      return;
    }

    allPassages.unshift(newPassage);
    customPassages.unshift(newPassage);
    localStorage.setItem("pocket_custom_passages", JSON.stringify(customPassages));

    currentPassageId = newPassage.id;
    currentSentenceIndex = 0;

    modalCustomPassage.classList.remove("open");
    customTitleInput.value = "";
    customTextInput.value = "";

    renderPassageSelector();
    renderFocusReader();
    renderFullPassage();
    renderQuizSection();
    switchTab("tabFocus");
    showToast("새 지문 분석이 완료되었습니다! ⚡");
  });

  btnHelp.addEventListener("click", () => {
    modalHelp.classList.add("open");
  });

  btnCloseHelpModal.addEventListener("click", () => {
    modalHelp.classList.remove("open");
  });

  [modalWord, modalCustomPassage, modalHelp].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "ArrowLeft") {
      btnPrevSentence.click();
    } else if (e.key === "ArrowRight") {
      btnNextSentence.click();
    } else if (e.key === " " && document.getElementById("tabVoca").classList.contains("active")) {
      e.preventDefault();
      flashcard3D.click();
    } else if (e.key === "Escape") {
      [modalWord, modalCustomPassage, modalHelp].forEach(m => m.classList.remove("open"));
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const activeTab = document.querySelector(".tab-content.active");
    if (!activeTab || activeTab.id !== "tabFocus") return;

    const diff = touchEndX - touchStartX;
    if (diff > 60) {
      btnPrevSentence.click();
    } else if (diff < -60) {
      btnNextSentence.click();
    }
  }, { passive: true });

  // 초기 렌더링 실행
  renderPassageSelector();
  renderFocusReader();
  renderFullPassage();
  updateVocaUI();
  renderQuizSection();
});
