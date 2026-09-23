/**
 * VocaMind AI - Recommendation & Error Diagnosis Engine
 * Implements:
 * 1. SRS (Spaced Repetition System) & Adaptive Recommendation
 * 2. Deep AI Error Autopsy (오답 원인 분석, 혼동 어휘 대조, 어원/연상 기억법)
 * 3. Question Generator (사지선다, 문맥 빈칸, 스펠링)
 * 4. Dual Engine: Rich Offline Heuristic AI + Optional Online Gemini API
 */

class AIEngine {
  constructor() {
    this.storageKey = "vocamind_user_data_v1";
    this.apiKey = localStorage.getItem("vocamind_gemini_api_key") || "";
    this.userData = this.loadUserData();
  }

  // Initial user data structure
  getDefaultUserData() {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      totalAnswered: 0,
      totalCorrect: 0,
      wordStats: {}, // wordId: { attempts, correct, wrong, lastReviewed, srsStage, nextReviewDate, lastUserAnswer }
      wrongHistory: [], // Array of mistake events for deep clinic analytics
      customWords: []
    };
  }

  loadUserData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        return { ...this.getDefaultUserData(), ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn("Failed to load user data from localStorage", e);
    }
    return this.getDefaultUserData();
  }

  saveUserData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.userData));
    } catch (e) {
      console.error("Failed to save user data", e);
    }
  }

  setApiKey(key) {
    this.apiKey = (key || "").trim();
    localStorage.setItem("vocamind_gemini_api_key", this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  // Combine database with user custom words
  getAllWords() {
    const builtin = window.VOCABULARY_DATABASE || [];
    const custom = this.userData.customWords || [];
    return [...builtin, ...custom];
  }

  getWordById(id) {
    return this.getAllWords().find(w => w.id === id);
  }

  // --- 1. 맞춤형 문제 추천 엔진 (Adaptive SRS Recommendation) ---
  /**
   * Generates a recommended queue of words based on mode
   * @param {string} mode: 'smart' (종합), 'weakness' (취약점), 'srs' (망각복습), 'challenge' (신규/도전)
   * @param {number} count: Number of words in the session
   */
  getRecommendedWords(mode = "smart", count = 10, category = "ALL") {
    const allWords = this.getAllWords().filter(w => category === "ALL" || w.category === category);
    if (allWords.length === 0) return [];

    const now = Date.now();
    const scoredWords = allWords.map(word => {
      const stat = this.userData.wordStats[word.id] || {
        attempts: 0,
        correct: 0,
        wrong: 0,
        lastReviewed: 0,
        srsStage: 0,
        nextReviewDate: 0
      };

      const daysSinceReview = stat.lastReviewed ? (now - stat.lastReviewed) / (1000 * 60 * 60 * 24) : 999;
      const errorRate = stat.attempts > 0 ? (stat.wrong / stat.attempts) : 0;
      const isDueForReview = stat.nextReviewDate ? (now >= stat.nextReviewDate) : false;

      // 1. Weakness score: high mistake rate + high wrong count
      const weaknessScore = (stat.wrong * 3.5) + (errorRate * 40);

      // 2. Memory retention / forgetting curve decay (Ebbinghaus simulation)
      // R = e^(-t / S) where S is stability based on srsStage
      const stability = Math.max(1, stat.srsStage * 2);
      const retention = Math.exp(-daysSinceReview / stability);
      const forgettingUrgency = (1 - retention) * 35 + (isDueForReview ? 40 : 0);

      // 3. Novelty score (brand new words)
      const noveltyScore = stat.attempts === 0 ? 30 : 0;

      let finalScore = 0;

      if (mode === "weakness") {
        finalScore = weaknessScore * 3.0 + (stat.wrong > 0 ? 50 : 0) + (stat.attempts === 0 ? 5 : 0);
      } else if (mode === "srs") {
        finalScore = forgettingUrgency * 2.5 + (isDueForReview ? 50 : 0) + (daysSinceReview > 2 ? 20 : 0);
      } else if (mode === "challenge") {
        finalScore = noveltyScore * 3.0 + (word.level * 15) - (stat.correct * 5);
      } else {
        // Smart Hybrid Blend (default)
        finalScore = (weaknessScore * 1.5) + (forgettingUrgency * 1.2) + (noveltyScore * 1.0) + (Math.random() * 8);
      }

      return { word, stat, score: finalScore };
    });

    // Sort descending by score
    scoredWords.sort((a, b) => b.score - a.score);

    // Return top N words
    return scoredWords.slice(0, count).map(item => item.word);
  }

  // --- 2. 퀴즈 생성기 (Multi-Mode Quiz Generator) ---
  /**
   * Generates interactive questions for the selected words
   * Question types: 'choice' (뜻 맞히기 4지선다), 'cloze' (예문 빈칸), 'spelling' (철자 완성)
   */
  generateQuizQuestions(wordList, preferredType = "mixed") {
    const allWords = this.getAllWords();
    const questions = [];

    wordList.forEach((targetWord, idx) => {
      let qType = preferredType;
      if (preferredType === "mixed") {
        const types = ["choice", "cloze", "spelling"];
        // Adjust type based on word stats: if word is new -> choice, if mastered once -> cloze or spelling
        const stat = this.userData.wordStats[targetWord.id];
        if (!stat || stat.attempts === 0) {
          qType = "choice";
        } else if (stat.wrong > 0) {
          qType = Math.random() > 0.4 ? "choice" : "cloze";
        } else {
          qType = types[Math.floor(Math.random() * types.length)];
        }
      }

      // Generate clever distractors for choice and cloze
      const distractors = this.generateSmartDistractors(targetWord, allWords, 3);
      const options = this.shuffleArray([targetWord, ...distractors]);

      if (qType === "choice") {
        questions.push({
          id: `q_${idx}_${targetWord.id}`,
          type: "choice",
          word: targetWord,
          title: "단어의 알맞은 의미를 고르세요",
          promptWord: targetWord.word,
          phonetic: targetWord.phonetic,
          partOfSpeech: targetWord.partOfSpeech,
          options: options.map(opt => ({
            id: opt.id,
            text: opt.meaning,
            wordRef: opt
          })),
          correctOptionId: targetWord.id,
          hint: targetWord.mnemonic || `어원 힌트: ${targetWord.etymology}`
        });
      } else if (qType === "cloze") {
        questions.push({
          id: `q_${idx}_${targetWord.id}`,
          type: "cloze",
          word: targetWord,
          title: "문맥의 빈칸에 들어갈 가장 적절한 단어를 고르세요",
          promptSentence: targetWord.clozeSentence || targetWord.example.replace(new RegExp(targetWord.word, "gi"), "______"),
          translation: targetWord.exampleKo,
          options: options.map(opt => ({
            id: opt.id,
            text: opt.word,
            meaning: opt.meaning,
            wordRef: opt
          })),
          correctOptionId: targetWord.id,
          hint: `품사: ${targetWord.partOfSpeech} | 첫 글자: ${targetWord.word[0].toUpperCase()}`
        });
      } else {
        // Spelling Challenge
        questions.push({
          id: `q_${idx}_${targetWord.id}`,
          type: "spelling",
          word: targetWord,
          title: "의미와 발음을 보고 정확한 영어 스펠링을 입력하세요",
          promptMeaning: targetWord.meaning,
          phonetic: targetWord.phonetic,
          partOfSpeech: targetWord.partOfSpeech,
          correctWord: targetWord.word.toLowerCase().trim(),
          hint: `첫 글자: ${targetWord.word[0].toUpperCase()}... (총 ${targetWord.word.length}글자)`
        });
      }
    });

    return questions;
  }

  // Generate intelligent distractors (prioritizes confusable words & same part of speech)
  generateSmartDistractors(targetWord, allWords, count = 3) {
    const pool = allWords.filter(w => w.id !== targetWord.id);
    const scored = pool.map(w => {
      let affinity = 0;
      // If directly registered as confusable
      if (targetWord.confusable && targetWord.confusable.word.toLowerCase() === w.word.toLowerCase()) {
        affinity += 100;
      }
      // Same part of speech makes distractors much more natural
      if (w.partOfSpeech === targetWord.partOfSpeech) {
        affinity += 30;
      }
      // Similar length
      if (Math.abs(w.word.length - targetWord.word.length) <= 2) {
        affinity += 15;
      }
      // Same category
      if (w.category === targetWord.category) {
        affinity += 10;
      }
      return { word: w, affinity: affinity + Math.random() * 20 };
    });

    scored.sort((a, b) => b.affinity - a.affinity);
    return scored.slice(0, count).map(s => s.word);
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // --- 3. 정답/오답 결과 기록 & SRS 주기 갱신 ---
  recordAnswer(wordId, isCorrect, chosenAnswer = null) {
    const now = Date.now();
    const word = this.getWordById(wordId);
    if (!word) return;

    if (!this.userData.wordStats[wordId]) {
      this.userData.wordStats[wordId] = {
        attempts: 0,
        correct: 0,
        wrong: 0,
        lastReviewed: now,
        srsStage: 0,
        nextReviewDate: now,
        lastUserAnswer: null
      };
    }

    const stat = this.userData.wordStats[wordId];
    stat.attempts += 1;
    stat.lastReviewed = now;
    stat.lastUserAnswer = chosenAnswer;

    this.userData.totalAnswered += 1;

    if (isCorrect) {
      stat.correct += 1;
      stat.srsStage = Math.min(5, stat.srsStage + 1);
      this.userData.totalCorrect += 1;
      this.userData.streak += 1;
      this.userData.xp += 15 + Math.min(25, this.userData.streak * 2);

      // SRS intervals (days): 1 -> 2 -> 4 -> 7 -> 15 -> 30
      const intervals = [1, 2, 4, 7, 15, 30];
      const daysToAdd = intervals[stat.srsStage] || 30;
      stat.nextReviewDate = now + (daysToAdd * 24 * 60 * 60 * 1000);
    } else {
      stat.wrong += 1;
      stat.srsStage = Math.max(0, stat.srsStage - 1);
      this.userData.streak = 0;
      this.userData.xp += 3; // Small effort XP
      // Review due soon (10 minutes or next day)
      stat.nextReviewDate = now + (2 * 60 * 60 * 1000);

      // Log into wrong history for deep clinic
      this.userData.wrongHistory.unshift({
        timestamp: now,
        wordId: word.id,
        word: word.word,
        meaning: word.meaning,
        chosenAnswer: chosenAnswer,
        category: word.category
      });

      // Keep recent 60 mistakes
      if (this.userData.wrongHistory.length > 60) {
        this.userData.wrongHistory.pop();
      }
    }

    // Level calculation
    this.userData.level = Math.floor(this.userData.xp / 100) + 1;
    this.userData.lastActiveDate = new Date().toISOString().split("T")[0];

    this.saveUserData();
    return stat;
  }

  // --- 4. AI 심층 오답 분석 엔진 (AI Error Autopsy) ---
  /**
   * Generates a profound error analysis report.
   * If Gemini API Key is configured, attempts live LLM analysis, else uses rich heuristic engine.
   */
  async generateErrorAutopsy(targetWord, chosenAnswerText, questionType) {
    // If user provided a Gemini API Key, try online generation
    if (this.apiKey) {
      try {
        const liveAnalysis = await this.fetchGeminiAnalysis(targetWord, chosenAnswerText);
        if (liveAnalysis) return liveAnalysis;
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local AI engine", err);
      }
    }

    // Built-in High Quality Heuristic AI Engine
    return this.buildLocalAutopsy(targetWord, chosenAnswerText, questionType);
  }

  buildLocalAutopsy(targetWord, chosenAnswerText, questionType) {
    const allWords = this.getAllWords();
    let rootCauseType = "기억 인출 미흡";
    let causeExplanation = "";
    let confusableComparison = null;

    // 1. Check if chosen answer matches another known word (e.g. adapt vs adopt)
    const matchedWrongWord = allWords.find(w =>
      w.meaning.includes(chosenAnswerText) ||
      chosenAnswerText.includes(w.meaning) ||
      w.word.toLowerCase() === chosenAnswerText.toLowerCase()
    );

    if (matchedWrongWord) {
      // Check for spelling similarity (Levenshtein-like or prefix similarity)
      const isSpellingSimilar = this.isSimilarSpelling(targetWord.word, matchedWrongWord.word);
      if (isSpellingSimilar) {
        rootCauseType = "🚨 유사 철자 혼동 (Spelling Confusion)";
        causeExplanation = `선택하신 '${matchedWrongWord.word}'(${matchedWrongWord.meaning})와 정답 '${targetWord.word}'(${targetWord.meaning})는 글자 모양과 발음이 흡사하여 수험생들이 가장 자주 착각하는 대표적인 페어입니다.`;
      } else if (targetWord.partOfSpeech === matchedWrongWord.partOfSpeech) {
        rootCauseType = "🔍 품사 및 유사 뉘앙스 오독";
        causeExplanation = `선택하신 '${matchedWrongWord.word}'(${matchedWrongWord.meaning}) 역시 같은 ${targetWord.partOfSpeech} 어휘로, 문맥상 그럴듯해 보이지만 정확한 핵심 정의에서 오차가 발생했습니다.`;
      } else {
        rootCauseType = "⚠️ 단어 의미 불일치";
        causeExplanation = `'${chosenAnswerText}'는 '${matchedWrongWord.word}'의 뜻입니다. '${targetWord.word}'의 고유한 의미와 확실히 분리하여 뇌에 저장해야 합니다.`;
      }

      confusableComparison = {
        target: { word: targetWord.word, meaning: targetWord.meaning },
        selected: { word: matchedWrongWord.word, meaning: matchedWrongWord.meaning },
        keyDifference: targetWord.confusable && targetWord.confusable.difference
          ? targetWord.confusable.difference
          : `'${targetWord.word}'는 '${targetWord.meaning}'의 맥락에서 쓰이며, '${matchedWrongWord.word}'와는 핵심 쓰임새가 다릅니다.`
      };
    } else {
      // Freeform or typing spelling error
      if (questionType === "spelling") {
        rootCauseType = "✍️ 스펠링 파닉스/철자 오류";
        causeExplanation = `입력하신 '${chosenAnswerText}'는 발음은 비슷하나 정확한 어근 철자 표기('${targetWord.word}')에서 차이가 났습니다. 모음 철자 조합에 유의하세요.`;
      } else {
        rootCauseType = "🧠 장기 기억 인출 미완성";
        causeExplanation = `이 단어는 뇌의 해마에서 단기 기억으로만 머물러 있어 순간적인 직관 오답을 선택하게 되었습니다. 연상 기억법과 어원 분해를 통해 장기 기억(LTM)으로 정착시켜야 합니다.`;
      }
    }

    return {
      source: "VocaMind Neural Engine",
      targetWord: targetWord.word,
      correctMeaning: targetWord.meaning,
      chosenAnswer: chosenAnswerText,
      rootCauseType: rootCauseType,
      causeExplanation: causeExplanation,
      confusableComparison: confusableComparison,
      etymologyBreakdown: targetWord.etymology,
      mnemonicTip: targetWord.mnemonic,
      collocationGuide: targetWord.example,
      collocationKo: targetWord.exampleKo,
      prescription: [
        "이 단어는 망각 타이머가 단축되어 2시간 후 복습 큐에 자동 배치됩니다.",
        `'${targetWord.mnemonic || targetWord.word}' 연상 스토리를 머릿속에 소리 내어 3번 상상해 보세요.`,
        `예문: "${targetWord.example}" 을 읽으며 단어가 쓰인 실전 상황을 머리에 그려보세요.`
      ]
    };
  }

  isSimilarSpelling(a, b) {
    if (!a || !b) return false;
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 2) return false;
    // Common 3-letter prefix match
    if (a.slice(0, 3) === b.slice(0, 3)) return true;
    return false;
  }

  // Optional Gemini API call
  async fetchGeminiAnalysis(targetWord, chosenAnswerText) {
    const prompt = `당신은 대한민국 최고의 영어 어휘 전문 1:1 AI 튜터입니다.
학생이 영어 단어 퀴즈에서 오답을 냈습니다. 친절하고 명쾌하게 심층 오답 원인을 분석해 주세요.

- 목표 단어: ${targetWord.word} (품사: ${targetWord.partOfSpeech}, 정답 뜻: ${targetWord.meaning})
- 학생이 선택한 오답: ${chosenAnswerText}
- 단어 예문: ${targetWord.example} (${targetWord.exampleKo})
- 기존 어원 정보: ${targetWord.etymology}

다음 JSON 구조로만 반드시 응답해 주세요 (마크다운 백틱 없이 순수 JSON만 반환):
{
  "rootCauseType": "오답 유형 (예: 유사 철자 혼동, 뉘앙스 오독 등)",
  "causeExplanation": "학생이 왜 이 오답을 골랐을지에 대한 심리/인지적 분석 및 명쾌한 해설 (2~3문장)",
  "etymologyBreakdown": "어원 분석 (접두사/어근 친절 해체)",
  "mnemonicTip": "절대 잊혀지지 않는 획기적인 연상 암기 비법",
  "prescription": ["처방 1", "처방 2"]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
      })
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);
    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const cleaned = candidateText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      source: "Gemini 1.5 Flash (Live AI)",
      targetWord: targetWord.word,
      correctMeaning: targetWord.meaning,
      chosenAnswer: chosenAnswerText,
      rootCauseType: parsed.rootCauseType || "AI 맞춤 진단",
      causeExplanation: parsed.causeExplanation,
      confusableComparison: null,
      etymologyBreakdown: parsed.etymologyBreakdown || targetWord.etymology,
      mnemonicTip: parsed.mnemonicTip || targetWord.mnemonic,
      collocationGuide: targetWord.example,
      collocationKo: targetWord.exampleKo,
      prescription: parsed.prescription || [
        "이 단어를 3회 소리 내어 낭독하세요.",
        "예문의 문맥을 떠올리며 단어의 품사를 주의 깊게 확인하세요."
      ]
    };
  }

  // --- 5. 대시보드 및 통계 데이터 계산 ---
  getDashboardStats() {
    const allWords = this.getAllWords();
    const stats = this.userData.wordStats;
    const now = Date.now();

    let masteredCount = 0;
    let reviewingCount = 0;
    let weakCount = 0;
    let unlearnedCount = 0;
    let totalAttempts = this.userData.totalAnswered;
    let accuracy = totalAttempts > 0 ? Math.round((this.userData.totalCorrect / totalAttempts) * 100) : 0;

    allWords.forEach(w => {
      const s = stats[w.id];
      if (!s || s.attempts === 0) {
        unlearnedCount++;
      } else if (s.wrong >= 2 || (s.attempts >= 2 && s.wrong / s.attempts >= 0.5)) {
        weakCount++;
      } else if (s.srsStage >= 4) {
        masteredCount++;
      } else {
        reviewingCount++;
      }
    });

    // Retention rate estimation (Ebbinghaus aggregate)
    let retentionSum = 0;
    let reviewedCount = 0;
    allWords.forEach(w => {
      const s = stats[w.id];
      if (s && s.attempts > 0) {
        reviewedCount++;
        const days = (now - s.lastReviewed) / (1000 * 60 * 60 * 24);
        const stability = Math.max(1, s.srsStage * 2);
        retentionSum += Math.exp(-days / stability);
      }
    });

    const retentionPercent = reviewedCount > 0 ? Math.round((retentionSum / reviewedCount) * 100) : 100;

    return {
      totalWords: allWords.length,
      masteredCount,
      reviewingCount,
      weakCount,
      unlearnedCount,
      accuracy,
      retentionPercent,
      xp: this.userData.xp,
      level: this.userData.level,
      streak: this.userData.streak,
      totalAnswered: this.userData.totalAnswered,
      totalCorrect: this.userData.totalCorrect,
      recentMistakes: this.userData.wrongHistory.slice(0, 10)
    };
  }

  // Add custom user word
  addCustomWord(wordData) {
    const newWord = {
      id: "custom_" + Date.now(),
      word: wordData.word.trim(),
      phonetic: wordData.phonetic || "/custom/",
      partOfSpeech: wordData.partOfSpeech || "n.",
      meaning: wordData.meaning.trim(),
      category: wordData.category || "CUSTOM",
      level: 1,
      example: wordData.example || `I practice the word ${wordData.word} every day.`,
      exampleKo: wordData.exampleKo || `${wordData.word} 단어를 매일 연습합니다.`,
      clozeSentence: `Please remember the word ______ in this sentence.`,
      etymology: wordData.etymology || "사용자 등록 단어",
      mnemonic: wordData.mnemonic || "나만의 연상 비법으로 기억하기!",
      synonyms: [],
      antonyms: []
    };
    this.userData.customWords.push(newWord);
    this.saveUserData();
    return newWord;
  }
}

window.aiEngine = new AIEngine();
