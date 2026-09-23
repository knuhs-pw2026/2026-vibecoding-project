// VibeTune Music Catalog Dataset
// 풍부한 감성 메타데이터와 음악적 특성(에너지, 어쿠스틱, 템포, 무드 태그)을 포함한 데이터베이스

const MUSIC_CATALOG = [
  {
    id: "vt-01",
    title: "새벽 비와 따뜻한 커피",
    artist: "루나 솔 (Luna Sol)",
    albumArt: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&auto=format&fit=crop&q=80",
    genre: "어쿠스틱 / 포크",
    subGenres: ["인디", "어쿠스틱", "발라드", "감성포크"],
    vibeTags: ["비오는날", "새벽감성", "차분한", "따뜻한", "힐링", "위로", "아련함", "평온함", "센치함", "포근한"],
    situation: "rainy",
    tempo: "slow",
    bpm: 72,
    energy: 25,
    acousticness: 90,
    moodKeywords: ["잔잔한 기타", "빗소리", "마음의 위로", "감성 보컬", "포근한 멜로디", "빗방울"],
    curatorComment: "창가에 부딪히는 빗소리와 나일론 기타 선율이 마음을 편안하게 안아주는 곡입니다.",
    soundProfile: {
      type: "acoustic_guitar",
      chords: [261.63, 329.63, 392.00, 440.00], // C, E, G, A
      tempoFactor: 0.8
    }
  },
  {
    id: "vt-02",
    title: "Midnight Tokyo City",
    artist: "Neon Skyline",
    albumArt: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80",
    genre: "시티팝 / 신스웨이브",
    subGenres: ["시티팝", "신스팝", "레트로", "어반"],
    vibeTags: ["드라이브", "시티팝", "레트로", "세련된", "그루비한", "도시야경", "낭만", "자유", "청량한", "설레는"],
    situation: "drive",
    tempo: "medium",
    bpm: 110,
    energy: 75,
    acousticness: 15,
    moodKeywords: ["반짝이는 신스", "펑키 베이스", "도심 야경", "밤 드라이브", "80년대 무드", "네온사인"],
    curatorComment: "도심의 화려한 네온사인 아래를 달리는 듯한 80년대 레트로 감성의 청량한 사운드입니다.",
    soundProfile: {
      type: "synthwave",
      chords: [349.23, 440.00, 523.25, 659.25], // F, A, C, E
      tempoFactor: 1.2
    }
  },
  {
    id: "vt-03",
    title: "Lofi Study Session 03:00 AM",
    artist: "Chillex Beats",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    genre: "로파이 / 칠합",
    subGenres: ["로파이", "인스트루멘탈", "재즈힙합", "칠"],
    vibeTags: ["코딩집중", "새벽감성", "로파이", "차분한", "독서", "나른한", "평온함", "몰입", "편안한", "안도감"],
    situation: "focus",
    tempo: "slow",
    bpm: 80,
    energy: 35,
    acousticness: 45,
    moodKeywords: ["바이닐 노이즈", "빈티지 피아노", "새벽 3시", "느긋한 드럼", "마음안정", "집중플로우"],
    curatorComment: "LP 특유의 지지직거리는 따스한 질감과 잔잔한 재즈 피아노가 깊은 몰입을 도와줍니다.",
    soundProfile: {
      type: "lofi_chill",
      chords: [293.66, 349.23, 440.00, 523.25], // Dm7
      tempoFactor: 0.9
    }
  },
  {
    id: "vt-04",
    title: "구름을 건너는 꿈",
    artist: "하늘정원 (Sky Garden)",
    albumArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
    genre: "드림팝 / 슈게이징",
    subGenres: ["인디록", "드림팝", "에테리얼", "슈게이징"],
    vibeTags: ["몽환적인", "새벽감성", "위로가필요할때", "우주", "신비로운", "아련함", "드림팝", "그리움", "환상적인", "쓸쓸함"],
    situation: "healing",
    tempo: "medium",
    bpm: 96,
    energy: 50,
    acousticness: 30,
    moodKeywords: ["리버브 보컬", "넓은 공간감", "꿈속의 풍경", "안개", "아련한 선율", "신비로움"],
    curatorComment: "안개 낀 호수 위에 서 있는 것처럼 넓은 공간감과 아련한 멜로디가 돋보입니다.",
    soundProfile: {
      type: "dreampop",
      chords: [220.00, 329.63, 415.30, 493.88],
      tempoFactor: 1.0
    }
  },
  {
    id: "vt-05",
    title: "Velvet Groove",
    artist: "Aiden Cross",
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    genre: "R&B / Soul",
    subGenres: ["네오소울", "알앤비", "어반", "소울"],
    vibeTags: ["그루비한", "감성알앤비", "새벽감성", "세련된", "와인한잔", "로맨틱", "감미로운", "매혹적인", "달달한", "어반"],
    situation: "night",
    tempo: "medium",
    bpm: 88,
    energy: 55,
    acousticness: 40,
    moodKeywords: ["매력적인 베이스", "감미로운 소울 보컬", "은은한 조명", "와인바", "도심 무드", "매혹적인 멜로디"],
    curatorComment: "은은한 조명 아래 와인 한 잔을 기울이며 리듬을 타기 좋은 감각적인 R&B 트랙입니다.",
    soundProfile: {
      type: "rnb_groove",
      chords: [277.18, 349.23, 415.30, 554.37],
      tempoFactor: 1.0
    }
  },
  {
    id: "vt-06",
    title: "초록빛 여름 숲의 산책",
    artist: "포레스트 노트 (Forest Note)",
    albumArt: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=80",
    genre: "어쿠스틱 / 뉴에이지",
    subGenres: ["피아노", "어쿠스틱", "인스트루멘탈", "뉴에이지"],
    vibeTags: ["산책", "힐링", "자연", "따뜻한", "맑은", "평온함", "햇살", "순수함", "피아노", "휴식"],
    situation: "walk",
    tempo: "medium",
    bpm: 92,
    energy: 40,
    acousticness: 95,
    moodKeywords: ["피아노 연주", "맑은 햇살", "피톤치드 숲소리", "편안한 쉼", "산뜻한 멜로디", "자연 치유"],
    curatorComment: "나뭇잎 사이로 내리쬐는 햇살을 받으며 혼자 걷는 숲길을 음악으로 형상화했습니다.",
    soundProfile: {
      type: "piano_ballad",
      chords: [261.63, 329.63, 392.00, 523.25],
      tempoFactor: 0.95
    }
  },
  {
    id: "vt-07",
    title: "Sunset Boulevard Drive",
    artist: "The Coastal Club",
    albumArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
    genre: "인디 팝 / 서프 록",
    subGenres: ["인디팝", "청량", "서프팝", "서프록"],
    vibeTags: ["드라이브", "청량한", "신나는", "여름바다", "에너지충전", "자유", "벅차오르는", "상쾌한", "설레는", "질주"],
    situation: "drive",
    tempo: "fast",
    bpm: 124,
    energy: 85,
    acousticness: 20,
    moodKeywords: ["찰랑거리는 기타", "청량한 보컬", "바닷바람", "자유", "젊음과 열정", "해변 질주"],
    curatorComment: "창문을 활짝 열고 시원한 해변 도로를 질주할 때 듣기 가장 완벽한 서프 팝입니다.",
    soundProfile: {
      type: "surf_pop",
      chords: [329.63, 415.30, 493.88, 659.25],
      tempoFactor: 1.3
    }
  },
  {
    id: "vt-08",
    title: "어제의 나에게 건네는 말",
    artist: "은하수 (Milky Way)",
    albumArt: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    genre: "K-인디 / 어쿠스틱",
    subGenres: ["K-인디", "발라드", "감성포크", "슬픈노래"],
    vibeTags: ["슬픈", "눈물나는", "위로가필요할때", "따뜻한", "새벽감성", "공감", "먹먹한", "애틋한", "치유", "아련함"],
    situation: "healing",
    tempo: "slow",
    bpm: 68,
    energy: 28,
    acousticness: 88,
    moodKeywords: ["가사 한 줄의 힘", "진심 어린 보컬", "눈물 글썽이는", "담담한 어쿠스틱", "하루의 끝 위로", "먹먹함"],
    curatorComment: "지치고 힘든 하루의 끝, 마음의 응어리를 살며시 풀어주는 담담한 가사와 멜로디입니다.",
    soundProfile: {
      type: "acoustic_guitar",
      chords: [220.00, 261.63, 329.63, 392.00],
      tempoFactor: 0.85
    }
  },
  {
    id: "vt-09",
    title: "Cybernetic Pulse 2099",
    artist: "K4PTA1N",
    albumArt: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80",
    genre: "일렉트로닉 / 사이버펑크",
    subGenres: ["신스웨이브", "일렉트로닉", "베이스", "사이버펑크"],
    vibeTags: ["에너지충전", "운동", "강렬한", "비트있는", "미래적인", "질주감", "열정", "파워풀한", "도파민", "신나는"],
    situation: "workout",
    tempo: "fast",
    bpm: 132,
    energy: 95,
    acousticness: 5,
    moodKeywords: ["묵직한 서브베이스", "네온 아르페지오", "심박수 상승", "운동 텐션", "아드레날린 폭발", "짜릿한 비트"],
    curatorComment: "운동 중 최대의 집중력과 심박수를 끌어올려 줄 묵직하고 파워풀한 일렉트로닉 비트입니다.",
    soundProfile: {
      type: "synthwave",
      chords: [130.81, 196.00, 261.63, 392.00],
      tempoFactor: 1.4
    }
  },
  {
    id: "vt-10",
    title: "Late Night Jazz Bar",
    artist: "Quartet Blue",
    albumArt: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 보사노바",
    subGenres: ["재즈", "보사노바", "라운지", "쿨재즈"],
    vibeTags: ["재즈", "와인한잔", "차분한", "세련된", "그루비한", "낭만", "고급스러운", "여유로운", "스윙", "새벽감성"],
    situation: "night",
    tempo: "medium",
    bpm: 86,
    energy: 45,
    acousticness: 85,
    moodKeywords: ["어쿠스틱 콘트라베이스", "브러시 드럼", "재즈 피아노", "스피크이지 바", "그윽한 향기", "심야 낭만"],
    curatorComment: "골목길 숨겨진 스피크이지 재즈바에서 흘러나올 법한 따뜻하고 그윽한 보사노바 스윙입니다.",
    soundProfile: {
      type: "lofi_chill",
      chords: [261.63, 311.13, 392.00, 466.16],
      tempoFactor: 0.95
    }
  },
  {
    id: "vt-11",
    title: "Sparkling Summer Blue",
    artist: "Daydreamers",
    albumArt: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80",
    genre: "K-Pop / 댄스 팝",
    subGenres: ["K-Pop", "청량팝", "틴팝", "댄스"],
    vibeTags: ["청량한", "신나는", "에너지충전", "산책", "설레는", "발랄한", "행복", "여름감성", "탄산수", "상쾌한"],
    situation: "walk",
    tempo: "fast",
    bpm: 120,
    energy: 88,
    acousticness: 18,
    moodKeywords: ["청량 신스 사운드", "톡톡 튀는 멜로디", "첫사랑 설렘", "밝은 비타민 에너지", "소다팝", "시원한 바람"],
    curatorComment: "청량한 탄산수처럼 톡 쏘는 경쾌함으로 기분을 한순간에 업그레이드해 주는 곡입니다.",
    soundProfile: {
      type: "surf_pop",
      chords: [293.66, 369.99, 440.00, 587.33],
      tempoFactor: 1.25
    }
  },
  {
    id: "vt-12",
    title: "어두운 밤, 별 하나를 세며",
    artist: "별헤는밤 (Astro)",
    albumArt: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&auto=format&fit=crop&q=80",
    genre: "앰비언트 / 미니멀",
    subGenres: ["앰비언트", "사운드스케이프", "명상", "수면"],
    vibeTags: ["새벽감성", "몽환적인", "차분한", "수면", "명상", "고독", "평온함", "쓸쓸함", "우주", "휴식"],
    situation: "night",
    tempo: "slow",
    bpm: 60,
    energy: 15,
    acousticness: 70,
    moodKeywords: ["은하수 패드 사운드", "깊은 밤의 울림", "평온한 잠자리", "수면 유도", "침묵과 별빛", "고요함"],
    curatorComment: "복잡한 생각을 내려놓고 밤하늘의 무수한 별을 바라보며 깊은 잠에 빠져들게 합니다.",
    soundProfile: {
      type: "dreampop",
      chords: [196.00, 293.66, 392.00, 440.00],
      tempoFactor: 0.7
    }
  },
  {
    id: "vt-13",
    title: "Coffee & Code Flow",
    artist: "Dev_Beats",
    albumArt: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80",
    genre: "로파이 / 딥 하우스",
    subGenres: ["하우스", "로파이", "테크", "딥하우스"],
    vibeTags: ["코딩집중", "그루비한", "독서", "차분한", "몰입", "딥하우스", "카페", "플로우", "리듬감", "세련된"],
    situation: "focus",
    tempo: "medium",
    bpm: 112,
    energy: 58,
    acousticness: 22,
    moodKeywords: ["일정한 4x4 비트", "집중 모드", "미니멀 하우스", "잡념 차단", "생산성 부스터", "카페 감성"],
    curatorComment: "잡념을 차단하고 업무나 코딩 작업에 깊숙이 몰입할 수 있도록 설계된 규칙적이고 감각적인 비트입니다.",
    soundProfile: {
      type: "lofi_chill",
      chords: [261.63, 329.63, 392.00, 493.88],
      tempoFactor: 1.1
    }
  },
  {
    id: "vt-14",
    title: "빗방울이 그리는 왈츠",
    artist: "클라우디아 (Claudia)",
    albumArt: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=500&auto=format&fit=crop&q=80",
    genre: "클래식 / 크로스오버",
    subGenres: ["피아노", "스트링", "어쿠스틱", "클래식"],
    vibeTags: ["비오는날", "슬픈", "차분한", "따뜻한", "위로가필요할때", "아련함", "서정적인", "감성발라드", "쓸쓸함", "우아한"],
    situation: "rainy",
    tempo: "slow",
    bpm: 78,
    energy: 30,
    acousticness: 98,
    moodKeywords: ["어쿠스틱 첼로 선율", "빗소리 피아노", "서정적 왈츠", "아련한 기억", "비 내리는 창가", "먹먹한 위로"],
    curatorComment: "비 내리는 오후, 따뜻한 차 한 잔을 곁들이며 빗방울의 춤을 바라보는 듯한 서정적 실내악입니다.",
    soundProfile: {
      type: "piano_ballad",
      chords: [220.00, 277.18, 329.63, 440.00],
      tempoFactor: 0.85
    }
  },
  {
    id: "vt-15",
    title: "Retro Arcade Fever",
    artist: "Pixel Waves",
    albumArt: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80",
    genre: "신스팝 / 칩튠",
    subGenres: ["일렉트로닉", "신스팝", "레트로", "칩튠"],
    vibeTags: ["신나는", "에너지충전", "레트로", "청량한", "드라이브", "유쾌한", "활기찬", "도파민", "게임감성", "짜릿한"],
    situation: "workout",
    tempo: "fast",
    bpm: 128,
    energy: 90,
    acousticness: 10,
    moodKeywords: ["8비트 칩튠 사운드", "경쾌한 신스 드럼", "오락실 추억", "도파민 충전", "아케이드 비트", "레트로 퓨처"],
    curatorComment: "아케이드 게임기의 네온 컬러와 톡톡 튀는 8비트 사운드가 에너지를 꽉 채워줍니다.",
    soundProfile: {
      type: "synthwave",
      chords: [329.63, 392.00, 493.88, 587.33],
      tempoFactor: 1.35
    }
  },
  {
    id: "vt-16",
    title: "한강 노을과 바람",
    artist: "소담 (So-Dam)",
    albumArt: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&auto=format&fit=crop&q=80",
    genre: "K-인디 / 포크 록",
    subGenres: ["인디", "어쿠스틱", "포크", "포크록"],
    vibeTags: ["산책", "드라이브", "따뜻한", "설레는", "힐링", "노을", "낭만", "여유로운", "어쿠스틱", "평온함"],
    situation: "walk",
    tempo: "medium",
    bpm: 98,
    energy: 60,
    acousticness: 70,
    moodKeywords: ["노을빛 멜로디", "선선한 강바람", "어쿠스틱 통기타", "해질녘 산책", "낭만적인 데이트", "여유"],
    curatorComment: "선선한 저녁 강바람을 맞으며 자전거를 타거나 잔디밭에 앉아 노을을 바라볼 때의 설렘.",
    soundProfile: {
      type: "acoustic_guitar",
      chords: [261.63, 329.63, 392.00, 523.25],
      tempoFactor: 1.0
    }
  },
  {
    id: "vt-17",
    title: "Ethereal Echoes",
    artist: "Sora & The Moon",
    albumArt: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    genre: "드림팝 / 앰비언트",
    subGenres: ["드림팝", "포스트록", "인디", "앰비언트"],
    vibeTags: ["몽환적인", "새벽감성", "신비로운", "차분한", "위로가필요할때", "아련함", "심해", "우주유영", "쓸쓸함", "슬픈"],
    situation: "night",
    tempo: "slow",
    bpm: 70,
    energy: 32,
    acousticness: 50,
    moodKeywords: ["영롱한 신스 패드", "딜레이 기타 에코", "꿈속의 유영", "신비로운 심연", "아득한 위로", "쓸쓸한 잔향"],
    curatorComment: "깊은 심해나 우주 한가운데를 유영하는 듯한 신비롭고 아련한 음향 연출.",
    soundProfile: {
      type: "dreampop",
      chords: [246.94, 329.63, 392.00, 493.88],
      tempoFactor: 0.8
    }
  },
  {
    id: "vt-18",
    title: "Honey & Butter R&B",
    artist: "Chloe Park",
    albumArt: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80",
    genre: "R&B / Soul",
    subGenres: ["알앤비", "컨템포러리", "소울", "네오소울"],
    vibeTags: ["감성알앤비", "세련된", "그루비한", "따뜻한", "설레는", "달달한", "로맨틱", "사랑", "포근한", "감미로운"],
    situation: "night",
    tempo: "medium",
    bpm: 90,
    energy: 52,
    acousticness: 42,
    moodKeywords: ["달콤한 꿀 보컬", "부드러운 로즈 피아노", "로맨틱 무드", "연인과의 저녁", "달달한 멜로디", "설렘가득"],
    curatorComment: "달콤한 버터와 꿀을 바른 듯 매끄럽고 로맨틱한 보컬 라인이 귀를 사로잡습니다.",
    soundProfile: {
      type: "rnb_groove",
      chords: [311.13, 392.00, 466.16, 587.33],
      tempoFactor: 1.0
    }
  },
  {
    id: "vt-19",
    title: "Over the Mountain Peak",
    artist: "Wilderness Audio",
    albumArt: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80",
    genre: "시네마틱 / 포크록",
    subGenres: ["시네마틱", "포크록", "인디", "사운드트랙"],
    vibeTags: ["에너지충전", "자연", "신나는", "힐링", "웅장한", "벅차오르는", "용기", "희망", "자유", "모험"],
    situation: "walk",
    tempo: "medium",
    bpm: 108,
    energy: 78,
    acousticness: 60,
    moodKeywords: ["가슴 뛰는 빌드업", "벅차오르는 코러스", "광활한 대자연", "정상에서의 바람", "모험과 희망", "감동"],
    curatorComment: "웅장한 산 정상에 올라 세상을 굽어볼 때 가슴이 벅차오르는 감동을 선사합니다.",
    soundProfile: {
      type: "surf_pop",
      chords: [261.63, 329.63, 392.00, 440.00],
      tempoFactor: 1.15
    }
  },
  {
    id: "vt-20",
    title: "카페 모퉁이의 작은 기억",
    artist: "정민 & 기타 (Min & Guitar)",
    albumArt: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80",
    genre: "어쿠스틱 / 포크",
    subGenres: ["포크", "인디", "어쿠스틱", "핑거스타일"],
    vibeTags: ["따뜻한", "비오는날", "차분한", "독서", "힐링", "아련함", "회상", "평온함", "카페감성", "쓸쓸함"],
    situation: "rainy",
    tempo: "slow",
    bpm: 74,
    energy: 22,
    acousticness: 96,
    moodKeywords: ["어쿠스틱 핑거스타일", "원목의 따스함", "옛 기억 회상", "향긋한 원두 커피", "조용한 오후", "추억"],
    curatorComment: "조용한 골목 카페 창가에서 책장을 넘길 때 듣고 싶은 소담하고 정겨운 핑거스타일 기타곡.",
    soundProfile: {
      type: "acoustic_guitar",
      chords: [261.63, 329.63, 392.00, 523.25],
      tempoFactor: 0.8
    }
  },
  {
    id: "vt-21",
    title: "Midnight Saxophone in Seoul",
    artist: "재즈 콰르텟 1960 (Quartet 1960)",
    albumArt: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 스무스 재즈",
    subGenres: ["재즈", "색소폰", "스무스재즈", "심야재즈"],
    vibeTags: ["재즈", "색소폰", "와인한잔", "새벽감성", "고급스러운", "세련된", "낭만", "센치함", "쓸쓸함", "감미로운"],
    situation: "night",
    tempo: "slow",
    bpm: 68,
    energy: 30,
    acousticness: 90,
    moodKeywords: ["감미로운 색소폰", "심야 재즈바", "위스키 온더락", "도심의 정적", "매혹적인 밤", "센치한 새벽"],
    curatorComment: "도심 속 촛불 켜진 재즈 클럽, 그윽한 테너 색소폰 선율이 밤의 정적을 물들입니다.",
    soundProfile: {
      type: "jazz_saxophone",
      chords: [261.63, 311.13, 392.00, 466.16],
      tempoFactor: 0.8
    }
  },
  {
    id: "vt-22",
    title: "비 내리는 스피크이지 바",
    artist: "블루 문 트리오 (Blue Moon Trio)",
    albumArt: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 쿨 재즈",
    subGenres: ["재즈", "피아노재즈", "쿨재즈", "트리오"],
    vibeTags: ["재즈", "비오는날", "피아노", "와인한잔", "차분한", "서정적인", "쓸쓸함", "아련함", "스피크이지", "힐링"],
    situation: "rainy",
    tempo: "slow",
    bpm: 72,
    energy: 28,
    acousticness: 92,
    moodKeywords: ["우산 위의 빗소리", "스네어 브러시 드럼", "서정적 재즈 피아노", "은밀한 아지트", "비의 위로", "운치"],
    curatorComment: "비 내리는 밤 은밀한 스피크이지 바에서 흘러나오는 서정적인 피아노 트리오의 명연주.",
    soundProfile: {
      type: "jazz_piano",
      chords: [220.00, 277.18, 329.63, 415.30],
      tempoFactor: 0.85
    }
  },
  {
    id: "vt-23",
    title: "Autumn Leaves in New York",
    artist: "Oliver Gray Quintet",
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 스윙 & 비밥",
    subGenres: ["재즈", "스윙", "클래식재즈", "비밥"],
    vibeTags: ["재즈", "산책", "그루비한", "클래식", "낭만", "스윙", "가을감성", "경쾌한", "설레는", "뉴욕"],
    situation: "walk",
    tempo: "medium",
    bpm: 105,
    energy: 65,
    acousticness: 80,
    moodKeywords: ["어쿠스틱 워킹 베이스", "경쾌한 스윙 리듬", "뉴욕 가을 낙엽", "클래식 콰르텟", "낭만적 산책", "발걸음"],
    curatorComment: "발걸음에 맞춰 경쾌하게 튀어 오르는 콘트라베이스와 낭만 가득한 뉴욕 가을 거리의 스윙.",
    soundProfile: {
      type: "jazz_swing",
      chords: [293.66, 349.23, 440.00, 523.25],
      tempoFactor: 1.1
    }
  },
  {
    id: "vt-24",
    title: "Ipanema Sunset Breeze",
    artist: "Rosa & Antonio",
    albumArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 보사노바",
    subGenres: ["보사노바", "재즈", "라틴", "어쿠스틱"],
    vibeTags: ["재즈", "보사노바", "따뜻한", "카페", "청량한", "힐링", "평온함", "산뜻한", "노을빛", "나른한"],
    situation: "healing",
    tempo: "medium",
    bpm: 95,
    energy: 48,
    acousticness: 88,
    moodKeywords: ["나일론 클래식 기타", "속삭이는 보사노바", "해변의 붉은 석양", "여유로운 카페", "부드러운 미풍", "이파네마"],
    curatorComment: "따스한 해변 바람처럼 부드럽고 산뜻한 어쿠스틱 기타와 속삭이듯 감미로운 보사노바.",
    soundProfile: {
      type: "jazz_swing",
      chords: [261.63, 329.63, 392.00, 466.16],
      tempoFactor: 0.95
    }
  },
  {
    id: "vt-25",
    title: "Midnight Espresso & Jazz",
    artist: "Cafe Noir Project",
    albumArt: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 라운지 재즈",
    subGenres: ["재즈", "라운지", "인스트루멘탈", "카페재즈"],
    vibeTags: ["재즈", "코딩집중", "독서", "카페", "차분한", "몰입", "평온함", "라운지", "안정감", "새벽감성"],
    situation: "focus",
    tempo: "medium",
    bpm: 84,
    energy: 42,
    acousticness: 85,
    moodKeywords: ["진한 에스프레소 향", "부드러운 재즈 기타", "책장 넘기는 밤", "차분한 몰입", "심야 라운지", "원두"],
    curatorComment: "향긋한 에스프레소 크레마처럼 부드럽고 차분하게 몰입을 이끌어주는 감각적인 재즈입니다.",
    soundProfile: {
      type: "jazz_piano",
      chords: [246.94, 311.13, 392.00, 493.88],
      tempoFactor: 0.9
    }
  },
  {
    id: "vt-26",
    title: "Moonlight & Velvet",
    artist: "Stella Vane",
    albumArt: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 보컬 재즈",
    subGenres: ["재즈", "보컬재즈", "소울", "재즈발라드"],
    vibeTags: ["재즈", "새벽감성", "감성보컬", "와인한잔", "따뜻한", "로맨틱", "애틋한", "그윽한", "달빛", "슬픈"],
    situation: "night",
    tempo: "slow",
    bpm: 64,
    energy: 32,
    acousticness: 92,
    moodKeywords: ["벨벳 재즈 보컬", "달빛 비치는 창가", "묵직한 콘트라베이스", "로맨틱 발라드", "애틋한 사랑", "감미로운 숨결"],
    curatorComment: "달빛 아래 벨벳 커튼처럼 부드럽게 감싸는 독보적인 음색의 정통 여성 보컬 재즈 발라드.",
    soundProfile: {
      type: "jazz_saxophone",
      chords: [220.00, 261.63, 329.63, 392.00],
      tempoFactor: 0.8
    }
  },
  {
    id: "vt-27",
    title: "Blue Note Rooftop Party",
    artist: "The Uptown Brass",
    albumArt: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 펑키 재즈",
    subGenres: ["재즈", "펑키", "브라스", "파티"],
    vibeTags: ["재즈", "신나는", "에너지충전", "드라이브", "그루비한", "펑키", "흥겨운", "파티", "열정", "짜릿한"],
    situation: "drive",
    tempo: "fast",
    bpm: 122,
    energy: 82,
    acousticness: 50,
    moodKeywords: ["화려한 브라스 섹션", "흥겨운 펑크 비트", "루프탑 파티 야경", "짜릿한 솔로", "축제 분위기", "폭발적 에너지"],
    curatorComment: "루프탑의 화려한 조명과 파티 분위기를 한껏 고조시키는 펑키하고 다이내믹한 재즈 브라스.",
    soundProfile: {
      type: "jazz_swing",
      chords: [329.63, 392.00, 493.88, 587.33],
      tempoFactor: 1.25
    }
  },
  {
    id: "vt-28",
    title: "새벽 두 시, 몽마르트르 골목",
    artist: "파리지앵 듀오 (Parisian Duo)",
    albumArt: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 집시 재즈 & 샹송",
    subGenres: ["재즈", "집시재즈", "어쿠스틱", "샹송"],
    vibeTags: ["재즈", "새벽감성", "어쿠스틱", "낭만", "차분한", "이국적인", "아련함", "쓸쓸함", "서정적인", "회상"],
    situation: "night",
    tempo: "medium",
    bpm: 90,
    energy: 45,
    acousticness: 95,
    moodKeywords: ["감성 아코디언", "집시 기타 선율", "파리 가로등 불빛", "조용한 돌담길", "이국적 회상", "파리의 밤"],
    curatorComment: "파리 몽마르트르 언덕 가로등 아래, 아코디언과 집시 기타가 속삭이는 이국적 낭만의 선율.",
    soundProfile: {
      type: "jazz_piano",
      chords: [261.63, 311.13, 392.00, 523.25],
      tempoFactor: 0.95
    }
  },
  {
    id: "vt-29",
    title: "Raindrop Waltz on Keys",
    artist: "Julian Miles Trio",
    albumArt: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 왈츠 재즈",
    subGenres: ["재즈", "피아노", "왈츠", "트리오"],
    vibeTags: ["재즈", "비오는날", "피아노", "차분한", "힐링", "서정적인", "우아한", "아련함", "평온함", "감성"],
    situation: "rainy",
    tempo: "slow",
    bpm: 76,
    energy: 35,
    acousticness: 94,
    moodKeywords: ["3/4박자 재즈 왈츠", "영롱한 피아노 건반", "창문 두드리는 빗방울", "우아한 스텝", "빗속의 평온", "고즈넉한"],
    curatorComment: "3/4박자 재즈 왈츠의 우아한 스텝에 실려 창문을 톡톡 두드리는 빗방울을 닮은 피아노.",
    soundProfile: {
      type: "jazz_piano",
      chords: [293.66, 369.99, 440.00, 554.37],
      tempoFactor: 0.85
    }
  },
  {
    id: "vt-30",
    title: "Midnight Highway Jazz",
    artist: "Miles Away",
    albumArt: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80",
    genre: "재즈 / 퓨전 재즈",
    subGenres: ["재즈", "퓨전재즈", "드라이브", "어반"],
    vibeTags: ["재즈", "드라이브", "시티팝", "그루비한", "세련된", "자유", "시원한", "도시야경", "퓨전재즈", "질주"],
    situation: "drive",
    tempo: "medium",
    bpm: 112,
    energy: 72,
    acousticness: 40,
    moodKeywords: ["일렉트릭 피아노", "세련된 베이스라인", "심야 고속도로 질주", "네온사인 불빛", "감각적인 사운드", "자유로운 바람"],
    curatorComment: "밤의 고속도로를 시원하게 가로지르며 듣는 감각적이고 그루비한 현대적 퓨전 재즈.",
    soundProfile: {
      type: "jazz_swing",
      chords: [261.63, 329.63, 392.00, 466.16],
      tempoFactor: 1.15
    }
  },
  {
    id: "vt-31",
    title: "비워내지 못한 서랍 속 기억",
    artist: "이별의 계절 (Season of Farewell)",
    albumArt: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    genre: "발라드 / K-인디",
    subGenres: ["발라드", "인디", "이별노래", "슬픈노래"],
    vibeTags: ["슬픈", "이별", "눈물나는", "새벽감성", "위로가필요할때", "아련함", "발라드", "먹먹한", "쓸쓸함", "애절한", "그리움"],
    situation: "healing",
    tempo: "slow",
    bpm: 66,
    energy: 24,
    acousticness: 92,
    moodKeywords: ["슬픈 피아노 선율", "먹먹한 이별 가사", "빛바랜 기억", "흘러내리는 눈물", "가슴 저린 발라드", "이별의 아픔"],
    curatorComment: "서랍 속에 남겨진 빛바랜 편지처럼, 지나간 사랑의 아련한 슬픔과 눈물을 담담히 노래합니다.",
    soundProfile: {
      type: "piano_ballad",
      chords: [220.00, 261.63, 329.63, 392.00],
      tempoFactor: 0.75
    }
  },
  {
    id: "vt-32",
    title: "텅 빈 방, 시계 소리만 흐르고",
    artist: "새벽 안개 (Dawn Fog)",
    albumArt: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&auto=format&fit=crop&q=80",
    genre: "어쿠스틱 / 감성 발라드",
    subGenres: ["어쿠스틱", "발라드", "인디", "슬픈노래"],
    vibeTags: ["슬픈", "외로운", "차분한", "새벽감성", "눈물나는", "위로", "공허함", "애틋한", "치유", "쓸쓸함"],
    situation: "night",
    tempo: "slow",
    bpm: 62,
    energy: 20,
    acousticness: 95,
    moodKeywords: ["나지막한 어쿠스틱 기타", "공허한 방 시계초침", "조용한 위로", "슬픔을 달래는 노래", "새벽 독백", "외로운 밤"],
    curatorComment: "모두가 잠든 깊은 밤, 홀로 남겨진 방 안에서 마음의 상처를 위로해 주는 애절한 어쿠스틱 선율.",
    soundProfile: {
      type: "acoustic_guitar",
      chords: [261.63, 293.66, 329.63, 392.00],
      tempoFactor: 0.75
    }
  }
];

// 스타일/감성 서베이 질문 정의
const SURVEY_QUESTIONS = [
  {
    id: "situation",
    title: "지금 어떤 순간이나 기분인가요?",
    subtitle: "현재 처한 분위기를 선택하면 감성에 딱 맞는 트랙을 찾기 시작합니다.",
    options: [
      { id: "rainy", label: "🌧️ 비 오는 날 / 흐린 감성", tags: ["비오는날", "차분한"] },
      { id: "night", label: "🌙 늦은 새벽 / 나만의 시간", tags: ["새벽감성", "차분한"] },
      { id: "focus", label: "💻 코딩 · 공부 · 깊은 집중", tags: ["코딩집중", "독서"] },
      { id: "drive", label: "🚗 드라이브 / 밤거리 야경", tags: ["드라이브", "시티팝"] },
      { id: "healing", label: "☕ 마음의 위로와 힐링", tags: ["위로가필요할때", "따뜻한"] },
      { id: "walk", label: "🌿 상쾌한 산책 / 나들이", tags: ["산책", "청량한"] },
      { id: "workout", label: "⚡ 심박수 올리는 운동 / 텐션", tags: ["에너지충전", "신나는"] }
    ]
  },
  {
    id: "soundTexture",
    title: "어떤 사운드 질감과 악기 느낌이 끌리나요?",
    subtitle: "음악의 촉감과 질감을 통해 취향의 결을 맞춥니다.",
    options: [
      { id: "jazz", label: "🎷 감미로운 색소폰 & 분위기 있는 재즈", style: "jazz", tag: "재즈" },
      { id: "acoustic", label: "🎸 따뜻한 통기타 / 클래식 기타", minAcoustic: 70, tag: "어쿠스틱" },
      { id: "lofi", label: "☕ LP 바이닐 잡음 & 빈티지 로파이", style: "lofi", tag: "로파이" },
      { id: "synth", label: "✨ 반짝이는 레트로 신스 & 시티팝", style: "synth", tag: "시티팝" },
      { id: "piano", label: "🎹 서정적인 피아노 & 멜로디", minAcoustic: 80, tag: "피아노" },
      { id: "rnb", label: "🕶️ 그루비한 베이스 & 세련된 R&B", style: "rnb", tag: "감성알앤비" },
      { id: "ambient", label: "🌌 아득하고 몽환적인 공간감", style: "ambient", tag: "몽환적인" }
    ]
  },
  {
    id: "tempoPref",
    title: "원하는 템포와 에너지 레벨은?",
    subtitle: "나른한 힐링부터 심장을 뛰게 하는 비트까지 선택하세요.",
    options: [
      { id: "slow", label: "🍃 느리고 편안한 템포 (Slow & Calm)", tempo: "slow", maxEnergy: 40 },
      { id: "medium", label: "🚶 적당히 리듬 타기 좋은 중간 템포 (Groovy Mid)", tempo: "medium", minEnergy: 35, maxEnergy: 75 },
      { id: "fast", label: "🔥 신나고 빠른 템포 (Fast & Upbeat)", tempo: "fast", minEnergy: 75 }
    ]
  }
];

// 전역 퀵 태그 리스트
const QUICK_TAGS = [
  { id: "all", label: "🌈 전체 보기", icon: "✨" },
  { id: "jazz", label: "분위기 있는 재즈", icon: "🎷", tag: "재즈" },
  { id: "rainy", label: "비 오는 날", icon: "🌧️", tag: "비오는날" },
  { id: "night", label: "새벽 2시", icon: "🌙", tag: "새벽감성" },
  { id: "citypop", label: "시티팝 드라이브", icon: "🚗", tag: "시티팝" },
  { id: "lofi", label: "코딩 & 로파이", icon: "💻", tag: "로파이" },
  { id: "acoustic", label: "어쿠스틱 기타", icon: "🎸", tag: "어쿠스틱" },
  { id: "rnb", label: "그루브 R&B", icon: "🕶️", tag: "감성알앤비" },
  { id: "dreampop", label: "몽환 드림팝", icon: "✨", tag: "몽환적인" },
  { id: "energetic", label: "텐션 업 & 운동", icon: "🔥", tag: "에너지충전" }
];
