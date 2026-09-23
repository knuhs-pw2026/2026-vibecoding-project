// VibeTune Recommendation & Similarity Engine
// 1. 설문/취향 기반 매칭 알고리즘
// 2. 좋아요/저장 기반 실시간 유사도(Content-Based Filtering) 알고리즘

class MusicRecommendationEngine {
  constructor(catalog) {
    this.catalog = catalog;
  }

  // 1. 사용자의 설문 응답을 기반으로 카탈로그 전체의 곡과 매칭 점수(0~100)를 산출
  calculateSurveyMatches(surveyAnswers) {
    if (!surveyAnswers || Object.keys(surveyAnswers).length === 0) {
      // 설문 응답이 없으면 기본 큐레이션 점수 부여
      return this.catalog.map(song => ({
        ...song,
        matchScore: 85,
        matchReasons: ["에디터 추천 트랙"]
      }));
    }

    const { situation, soundTexture, tempoPref } = surveyAnswers;

    return this.catalog.map(song => {
      let score = 0;
      let reasons = [];

      // A. 상황/분위기 점수 (최대 40점)
      if (situation) {
        if (song.situation === situation) {
          score += 35;
          reasons.push("상황 일치");
        } else {
          // 태그 교집합 검사
          const selectedOption = SURVEY_QUESTIONS[0].options.find(o => o.id === situation);
          if (selectedOption) {
            const hasCommonTag = selectedOption.tags.some(tag => song.vibeTags.includes(tag));
            if (hasCommonTag) {
              score += 25;
              reasons.push("분위기 유사");
            }
          }
        }
      } else {
        score += 20;
      }

      // B. 사운드 질감 & 악기 점수 (최대 35점)
      if (soundTexture) {
        if (soundTexture === "jazz" && (song.genre.includes("재즈") || song.vibeTags.includes("재즈") || song.moodKeywords.some(k => k.includes("재즈")))) {
          score += 35;
          reasons.push("낭만적인 재즈 감성");
        } else if (soundTexture === "acoustic" && song.acousticness >= 65) {
          score += 35;
          reasons.push("따뜻한 어쿠스틱 사운드");
        } else if (soundTexture === "piano" && (song.genre.includes("피아노") || song.moodKeywords.some(k => k.includes("피아노")) || song.acousticness >= 75)) {
          score += 35;
          reasons.push("서정적인 피아노 멜로디");
        } else if (soundTexture === "lofi" && (song.genre.includes("로파이") || song.vibeTags.includes("로파이"))) {
          score += 35;
          reasons.push("빈티지 로파이 질감");
        } else if (soundTexture === "synth" && (song.genre.includes("시티팝") || song.genre.includes("신스") || song.vibeTags.includes("시티팝"))) {
          score += 35;
          reasons.push("청량한 레트로 신스");
        } else if (soundTexture === "rnb" && (song.genre.includes("R&B") || song.vibeTags.includes("감성알앤비") || song.vibeTags.includes("그루비한"))) {
          score += 35;
          reasons.push("소울풀한 그루브");
        } else if (soundTexture === "ambient" && (song.genre.includes("앰비언트") || song.genre.includes("드림팝") || song.vibeTags.includes("몽환적인"))) {
          score += 35;
          reasons.push("몽환적인 공간감");
        } else {
          // 부분 일치
          score += 15;
        }
      } else {
        score += 20;
      }

      // C. 템포 및 에너지 점수 (최대 25점)
      if (tempoPref) {
        if (song.tempo === tempoPref) {
          score += 25;
          reasons.push("선호 템포 일치");
        } else {
          // 완충 점수
          if (tempoPref === "medium" && (song.tempo === "slow" || song.tempo === "fast")) {
            score += 12;
          }
        }
      } else {
        score += 15;
      }

      // 최종 매칭 스코어 정규화 (최소 60% ~ 99%)
      const finalScore = Math.min(99, Math.max(62, Math.round(score)));

      return {
        ...song,
        matchScore: finalScore,
        matchReasons: reasons.length > 0 ? reasons : ["감성 키워드 매칭"]
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  // 2. 두 곡 간의 다차원 유사도(0.0 ~ 1.0) 계산 함수
  calculatePairSimilarity(songA, songB) {
    if (songA.id === songB.id) return 1.0;

    // A. 태그 및 장르 Jaccard 유사도 (40% 가중치)
    const setA = new Set([...songA.vibeTags, ...songA.subGenres, songA.genre]);
    const setB = new Set([...songB.vibeTags, ...songB.subGenres, songB.genre]);
    
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = new Set([...setA, ...setB]).size;
    const tagSimilarity = union === 0 ? 0 : intersection / union;

    // B. 오디오 특성 거리 (Acousticness, Energy, BPM 정규화) (40% 가중치)
    const acousticDiff = Math.abs(songA.acousticness - songB.acousticness) / 100;
    const energyDiff = Math.abs(songA.energy - songB.energy) / 100;
    const bpmDiff = Math.min(1, Math.abs(songA.bpm - songB.bpm) / 60);

    const featureDist = (acousticDiff * 0.45) + (energyDiff * 0.45) + (bpmDiff * 0.1);
    const audioSimilarity = 1 - featureDist;

    // C. 상황 및 템포 일치 보너스 (20% 가중치)
    let contextBonus = 0;
    if (songA.situation === songB.situation) contextBonus += 0.6;
    if (songA.tempo === songB.tempo) contextBonus += 0.4;

    // 가중 합산
    const totalSim = (tagSimilarity * 0.40) + (audioSimilarity * 0.40) + (contextBonus * 0.20);
    return Math.max(0, Math.min(1, totalSim));
  }

  // 3. 사용자가 '좋아요(❤️)' 또는 '보관(➕)'한 곡들을 분석하여 맞춤 유사곡 리스트 추출
  // 핵심 요구사항: "좋아요를 눌렀다면 비슷한 노래를 알고리즘에 띄워주는 기능"
  getSimilarRecommendationsForLikedSongs(likedSongIds, savedSongIds = [], limit = 8) {
    const combinedIds = Array.from(new Set([...likedSongIds, ...savedSongIds]));
    if (combinedIds.length === 0) {
      return [];
    }

    const likedSongs = this.catalog.filter(song => combinedIds.includes(song.id));
    const unlikedSongs = this.catalog.filter(song => !combinedIds.includes(song.id));

    // 유저 프로필 벡터 구성 (취향 중심점)
    const profile = {
      avgEnergy: likedSongs.reduce((sum, s) => sum + s.energy, 0) / likedSongs.length,
      avgAcousticness: likedSongs.reduce((sum, s) => sum + s.acousticness, 0) / likedSongs.length,
      tagCounts: {},
      genreCounts: {},
      situations: {}
    };

    likedSongs.forEach(song => {
      song.vibeTags.forEach(t => profile.tagCounts[t] = (profile.tagCounts[t] || 0) + 1);
      profile.genreCounts[song.genre] = (profile.genreCounts[song.genre] || 0) + 1;
      profile.situations[song.situation] = (profile.situations[song.situation] || 0) + 1;
    });

    // 각 미보관 곡에 대해:
    // 1) 내가 좋아한 곡들 중 가장 닮은 곡(Most Similar Liked Song) 탐색
    // 2) 전체 프로필과의 종합 유사도 산출
    const scoredSongs = unlikedSongs.map(candidate => {
      let maxSimWithSingleSong = 0;
      let mostSimilarLikedSong = null;

      likedSongs.forEach(likedSong => {
        const sim = this.calculatePairSimilarity(candidate, likedSong);
        if (sim > maxSimWithSingleSong) {
          maxSimWithSingleSong = sim;
          mostSimilarLikedSong = likedSong;
        }
      });

      // 태그 친화도 점수
      let tagAffinity = 0;
      candidate.vibeTags.forEach(t => {
        if (profile.tagCounts[t]) {
          tagAffinity += profile.tagCounts[t];
        }
      });
      const normTagAffinity = Math.min(1, tagAffinity / (likedSongs.length * 2));

      // 프로필 중심점 거리 점수
      const energyDist = Math.abs(candidate.energy - profile.avgEnergy) / 100;
      const acousticDist = Math.abs(candidate.acousticness - profile.avgAcousticness) / 100;
      const profileSimilarity = 1 - ((energyDist + acousticDist) / 2);

      // 종합 추천 적합도 점수 (0 ~ 100)
      const combinedScore = (maxSimWithSingleSong * 0.55) + (normTagAffinity * 0.25) + (profileSimilarity * 0.20);
      const similarityPercent = Math.round(combinedScore * 100);

      // 알고리즘 추천 사유 생성 (어떤 곡과 왜 비슷한지 구체적으로 설명)
      const sharedTags = mostSimilarLikedSong ? candidate.vibeTags.filter(t => mostSimilarLikedSong.vibeTags.includes(t)) : [];
      let reasonText = "";
      if (mostSimilarLikedSong) {
        if (sharedTags.length > 0) {
          reasonText = `❤️ 내가 좋아한 '${mostSimilarLikedSong.title}'과 #${sharedTags.slice(0, 2).join(' #')} 감성이 매우 닮았어요.`;
        } else {
          reasonText = `🎧 좋아하신 '${mostSimilarLikedSong.title}'과 멜로디 및 템포 결이 비슷합니다.`;
        }
      }

      return {
        ...candidate,
        algorithmScore: similarityPercent,
        mostSimilarLikedSong,
        sharedTags,
        reasonText
      };
    });

    // 점수 높은 순으로 정렬 후 상위 N개 반환
    return scoredSongs
      .sort((a, b) => b.algorithmScore - a.algorithmScore)
      .slice(0, limit);
  }

  // 4. 사용자의 현재 취향 분포 통계 요약 (시각화 위젯용)
  getUserTasteProfile(likedSongIds, savedSongIds = []) {
    const combinedIds = Array.from(new Set([...likedSongIds, ...savedSongIds]));
    if (combinedIds.length === 0) return null;

    const songs = this.catalog.filter(s => combinedIds.includes(s.id));
    const total = songs.length;

    const avgAcoustic = Math.round(songs.reduce((acc, s) => acc + s.acousticness, 0) / total);
    const avgEnergy = Math.round(songs.reduce((acc, s) => acc + s.energy, 0) / total);

    const tagCounts = {};
    songs.forEach(s => {
      s.vibeTags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag, count]) => ({ tag, count, percent: Math.round((count / total) * 100) }));

    return {
      totalLiked: total,
      avgAcoustic,
      avgEnergy,
      topTags
    };
  }

  // 5. 감성 연관어 및 시맨틱 무드 검색 엔진 (Semantic Vibe & Mood Search)
  // '슬픈'을 검색하면 단순 제목 검색을 넘어 슬픔, 이별, 눈물, 위로, 새벽감성 등
  // 각 노래의 감성 결(Vibe)을 분석하여 어울리는 감성적인 곡들을 지능적으로 큐레이션합니다.
  searchBySemanticMood(query) {
    if (!query || !query.trim()) {
      return { matches: this.catalog, isSemantic: false, label: '', concept: null };
    }

    const qRaw = query.trim().toLowerCase();
    const qClean = qRaw.replace(/\s+/g, '');
    const tokens = qRaw.split(/\s+/).filter(Boolean);
    const clean = str => (str || '').toString().toLowerCase().replace(/\s+/g, '');

    // 1. 질의어가 어떤 감성 시맨틱 개념에 해당하는지 탐색
    const matchedConcepts = [];
    for (const [key, category] of Object.entries(SEMANTIC_VIBE_DICTIONARY)) {
      const isHit = category.synonyms.some(syn => {
        const synClean = clean(syn);
        return qClean.includes(synClean) || synClean.includes(qClean);
      });
      if (isHit) {
        matchedConcepts.push({ key, ...category });
      }
    }

    // 2. 전체 카탈로그 각 곡에 대해 텍스트 직접 일치 및 시맨틱 무드 적합도 채점
    const scoredList = this.catalog.map(song => {
      let score = 0;
      let reasonBadges = [];

      const songBlob = clean([
        song.title,
        song.artist,
        song.genre,
        ...song.subGenres,
        ...song.vibeTags,
        ...song.moodKeywords,
        song.curatorComment
      ].join(' '));

      // A. 직접 문자열 일치 (Exact / Token Match)
      if (songBlob.includes(qClean)) {
        score += 120;
        reasonBadges.push("키워드 직접 일치");
      } else if (tokens.length > 1 && tokens.every(tok => songBlob.includes(clean(tok)))) {
        score += 90;
        reasonBadges.push("복합 키워드 일치");
      }

      // B. 감성 시맨틱 매칭 (Semantic Concept Association)
      matchedConcepts.forEach(concept => {
        let conceptScore = 0;
        let matchedTagList = [];

        // 1) 태그 일치 (가장 강력한 감성 지표)
        song.vibeTags.forEach(tag => {
          if (concept.targetTags.some(tt => clean(tt) === clean(tag))) {
            conceptScore += 40;
            matchedTagList.push(tag);
          }
        });

        // 2) 상황/분위기 일치
        if (concept.targetSituations && concept.targetSituations.includes(song.situation)) {
          conceptScore += 25;
        }

        // 3) 오디오 피처 일치 (예: 슬픈/차분한 노래는 낮은 에너지, 높은 어쿠스틱성)
        if (concept.maxEnergy && song.energy <= concept.maxEnergy) {
          conceptScore += 20;
        }
        if (concept.minEnergy && song.energy >= concept.minEnergy) {
          conceptScore += 20;
        }
        if (concept.acousticPref && song.acousticness >= 60) {
          conceptScore += 15;
        }

        // 4) 큐레이터 코멘트 및 무드 키워드 내 유의어 포함 검사
        const metaText = clean(song.curatorComment + ' ' + song.moodKeywords.join(' '));
        const foundSynonym = concept.synonyms.find(syn => metaText.includes(clean(syn)));
        if (foundSynonym) {
          conceptScore += 25;
        }

        if (conceptScore > 0) {
          score += conceptScore;
          if (matchedTagList.length > 0) {
            reasonBadges.push(`${concept.icon} '${query}' 감성: #${matchedTagList.slice(0, 2).join(' #')}`);
          } else {
            reasonBadges.push(`${concept.icon} '${concept.label}' 감성 연관`);
          }
        }
      });

      return {
        ...song,
        searchScore: score,
        semanticBadge: reasonBadges.length > 0 ? reasonBadges[0] : null
      };
    });

    // 0점 초과 곡들만 필터링 및 유사도 순 정렬
    const results = scoredList
      .filter(song => song.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore);

    const primaryConcept = matchedConcepts[0] || null;

    return {
      matches: results,
      isSemantic: Boolean(primaryConcept),
      matchedConcept: primaryConcept,
      semanticLabel: primaryConcept ? `${primaryConcept.icon} ${primaryConcept.label}` : ''
    };
  }
}

// 감성 시맨틱 사전 (Semantic Vibe & Mood Dictionary)
// 사용자가 '슬픈', '신나는', '따뜻한', '비오는' 같은 느낌이나 상태를 검색했을 때
// 단순 제목 매칭을 넘어 각 곡의 감성 태그, 분위기 키워드, 사운드 질감을 추론하여 연관 곡을 추천
const SEMANTIC_VIBE_DICTIONARY = {
  sad: {
    label: "슬픔 · 눈물 · 아련한 감성",
    icon: "💧",
    synonyms: ["슬픈", "슬픔", "눈물", "우울", "아련", "이별", "그리움", "외로움", "마음", "후회", "울고", "울적", "센치", "발라드", "먹먹", "애절", "슬퍼", "눈물나는", "외로운", "슬픈노래"],
    targetTags: ["슬픈", "눈물나는", "위로가필요할때", "새벽감성", "차분한", "아련한", "발라드", "위로", "공감", "이별", "외로운"],
    targetSituations: ["healing", "rainy", "night"],
    acousticPref: true,
    maxEnergy: 55
  },
  healing: {
    label: "따뜻한 위로와 힐링",
    icon: "☕",
    synonyms: ["힐링", "따뜻", "위로", "포근", "편안", "휴식", "쉼", "안식", "위안", "치유", "다정", "포근한", "따스한"],
    targetTags: ["따뜻한", "힐링", "위로가필요할때", "자연", "맑은", "산책"],
    targetSituations: ["healing", "walk", "rainy"],
    acousticPref: true
  },
  excited: {
    label: "신나고 에너지 넘치는 텐션",
    icon: "🔥",
    synonyms: ["신난", "신나는", "에너지", "텐션", "파티", "운동", "질주", "핫", "달려", "댄스", "신나", "업", "도파민", "활기", "클럽", "짜릿", "경쾌한"],
    targetTags: ["신나는", "에너지충전", "청량한", "드라이브", "아드레날린"],
    targetSituations: ["workout", "drive"],
    minEnergy: 65
  },
  chill: {
    label: "차분하고 잔잔한 휴식",
    icon: "🍃",
    synonyms: ["차분", "조용", "잔잔", "수면", "잠", "나른", "평온", "휴식", "명상", "멍", "나른한", "편안한", "조용한"],
    targetTags: ["차분한", "새벽감성", "수면", "독서", "힐링", "앰비언트"],
    targetSituations: ["night", "rainy"],
    maxEnergy: 45
  },
  night: {
    label: "늦은 밤과 새벽 감성",
    icon: "🌙",
    synonyms: ["새벽", "밤", "야경", "심야", "자정", "달빛", "어둠", "새벽감성", "밤감성"],
    targetTags: ["새벽감성", "와인한잔", "몽환적인", "차분한", "로파이", "시티팝"],
    targetSituations: ["night"]
  },
  rainy: {
    label: "비 오는 날의 서정적 분위기",
    icon: "🌧️",
    synonyms: ["비", "빗소리", "흐린", "우산", "장마", "소나기", "비오는날", "비오는", "우중"],
    targetTags: ["비오는날", "차분한", "따뜻한", "위로가필요할때", "감성"],
    targetSituations: ["rainy"]
  },
  romantic: {
    label: "달콤하고 로맨틱한 설렘",
    icon: "💖",
    synonyms: ["설레", "설렘", "달달", "달콤", "로맨틱", "사랑", "연인", "데이트", "고백", "달콤한", "설레는"],
    targetTags: ["설레는", "따뜻한", "세련된", "감성알앤비", "청량한"],
    targetSituations: ["night", "walk"]
  },
  dreamy: {
    label: "신비롭고 몽환적인 드림팝",
    icon: "✨",
    synonyms: ["몽환", "신비", "우주", "꿈", "환상", "아득", "은하수", "동화", "구름", "몽환적인"],
    targetTags: ["몽환적인", "신비로운", "새벽감성", "드림팝", "우주"],
    targetSituations: ["night", "healing"]
  },
  focus: {
    label: "몰입과 집중을 위한 비트",
    icon: "💻",
    synonyms: ["집중", "공부", "코딩", "독서", "작업", "책", "몰입", "도서관", "과제", "플로우", "일"],
    targetTags: ["코딩집중", "독서", "로파이", "차분한", "카페"],
    targetSituations: ["focus"]
  },
  drive: {
    label: "시원한 드라이브와 여행",
    icon: "🚗",
    synonyms: ["드라이브", "여행", "질주", "바람", "고속도로", "바다", "해변", "자유", "퇴근길"],
    targetTags: ["드라이브", "시티팝", "청량한", "신나는", "여름바다"],
    targetSituations: ["drive", "walk"]
  },
  jazz: {
    label: "그윽하고 분위기 있는 재즈",
    icon: "🎷",
    synonyms: ["재즈", "와인", "위스키", "바", "색소폰", "스윙", "보사노바", "스피크이지", "고급", "칵테일", "재즈바"],
    targetTags: ["재즈", "와인한잔", "세련된", "그루비한", "색소폰", "고급스러운"],
    targetSituations: ["night", "rainy"]
  },
  acoustic: {
    label: "따스한 어쿠스틱 선율",
    icon: "🎸",
    synonyms: ["어쿠스틱", "기타", "통기타", "포크", "클래식기타", "나일론", "핑거스타일"],
    targetTags: ["따뜻한", "차분한", "힐링", "어쿠스틱"],
    targetSituations: ["rainy", "walk"]
  }
};
