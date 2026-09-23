/**
 * VocaMind AI - Built-in Comprehensive Vocabulary Database
 * Categories: CSAT (수능), TOEIC (토익), BUSINESS (비즈니스), ADVANCED (고급/토플)
 */

const VOCABULARY_DATABASE = [
  // --- CSAT / 수능 필수 어휘 ---
  {
    id: "csat_01",
    word: "meticulous",
    phonetic: "/məˈtɪk.jə.ləs/",
    partOfSpeech: "adj.",
    meaning: "꼼꼼한, 세심한, 극도로 주의를 기울이는",
    definitionEn: "very careful and with great attention to every detail",
    category: "CSAT",
    level: 2,
    example: "He was meticulous about keeping his research notes completely accurate.",
    exampleKo: "그는 연구 노트를 완전히 정확하게 기록하는 데 세심한 주의를 기울였다.",
    clozeSentence: "She was ______ in preparing the final financial presentation.",
    etymology: "라틴어 meticulosus (두려워하는, 겁내는)에서 유래 → '혹시라도 틀릴까 봐 조심조심 주의 깊게 살피는' 의미로 발전",
    mnemonic: "매(meti)의 눈으로 큘(culous)러시안 룰렛을 하듯 아주 '꼼꼼하고 세심하게' 살펴본다!",
    confusable: {
      word: "scrupulous",
      difference: "scrupulous는 '도덕적인 양심과 원칙에 입각하여 꼼꼼한' 느낌이고, meticulous는 '세부 디테일에 광적으로 철저한' 느낌입니다."
    },
    synonyms: ["thorough", "precise", "painstaking", "diligent"],
    antonyms: ["careless", "sloppy", "negligent"]
  },
  {
    id: "csat_02",
    word: "adapt",
    phonetic: "/əˈdæpt/",
    partOfSpeech: "v.",
    meaning: "적응하다, 맞추다; 각색하다",
    definitionEn: "to change something to suit different conditions or a new environment",
    category: "CSAT",
    level: 1,
    example: "It took several months for the exchange students to adapt to the new school culture.",
    exampleKo: "교환학생들이 새로운 학교 문화에 적응하는 데 몇 달이 걸렸다.",
    clozeSentence: "Species must ______ to climate shifts or face extinction.",
    etymology: "ad (~로 향하여) + aptus (알맞은, 꼭 맞는) → 상황에 딱 알맞게 맞추어가다",
    mnemonic: "어(a) 댑(dapt)트: 어댑터(adapter)를 꽂아 규격에 '딱 맞추고 적응'시키는 모습!",
    confusable: {
      word: "adopt",
      difference: "철자 하나 차이! adopt는 '채택하다/입양하다'(opt=선택), adapt는 '적응하다/맞추다'(apt=적절한)입니다."
    },
    synonyms: ["adjust", "accommodate", "conform"],
    antonyms: ["resist", "stagnate"]
  },
  {
    id: "csat_03",
    word: "adopt",
    phonetic: "/əˈdɑːpt/",
    partOfSpeech: "v.",
    meaning: "채택하다, 입양하다, 취하다",
    definitionEn: "to legally take another's child into one's family; or choose to follow a policy",
    category: "CSAT",
    level: 1,
    example: "The committee decided to adopt a brand new strategy for renewable energy.",
    exampleKo: "위원회는 재생 에너지를 위한 완전히 새로운 전략을 채택하기로 결정했다.",
    clozeSentence: "The board voted unanimously to ______ the new safety policy.",
    etymology: "ad (~을 향해) + optare (원하다, 선택하다 - Option과 동일 어근) → 마음에 드는 것을 골라 품다",
    mnemonic: "옵션(option)처럼 마음에 드는 것을 '골라서 채택/입양'하다!",
    confusable: {
      word: "adapt",
      difference: "adapt는 환경에 '적응'하는 것, adopt는 아이나 정책을 내 편으로 '채택/입양'하는 것."
    },
    synonyms: ["embrace", "approve", "take on"],
    antonyms: ["reject", "abandon"]
  },
  {
    id: "csat_04",
    word: "procrastinate",
    phonetic: "/prəˈkræs.tə.neɪt/",
    partOfSpeech: "v.",
    meaning: "미루다, 질질 끌다, 늑장 부리다",
    definitionEn: "to delay doing something until a later time, especially because it is unpleasant",
    category: "CSAT",
    level: 2,
    example: "I always procrastinate until the night before the assignment is officially due.",
    exampleKo: "나는 항상 과제 마감 전날 밤까지 일을 질질 미루곤 한다.",
    clozeSentence: "Stop trying to ______ and finish your university application today.",
    etymology: "pro (앞으로, 나중에) + crastinus (내일의, 내일로 미루는) → 자꾸만 내일로 밀어버리다",
    mnemonic: "프로(pro) 크라(cra)스티 햄버거 먹느라 할 일을 '내일로 미루고 늑장' 부린다!",
    confusable: {
      word: "postpone",
      difference: "postpone은 합리적이거나 공식적인 일정 연기, procrastinate는 귀찮아서 게으름 피우며 미루는 것."
    },
    synonyms: ["delay", "defer", "put off", "stall"],
    antonyms: ["hasten", "expedite", "prioritize"]
  },
  {
    id: "csat_05",
    word: "ambiguous",
    phonetic: "/æmˈbɪɡ.ju.əs/",
    partOfSpeech: "adj.",
    meaning: "애매모호한, 두 가지 이상으로 해석되는",
    definitionEn: "having or expressing more than one possible meaning, sometimes intentionally",
    category: "CSAT",
    level: 2,
    example: "His ambiguous reply left everyone wondering whether he agreed or disagreed.",
    exampleKo: "그의 모호한 답변은 그가 찬성하는지 반대하는지 모두를 의아하게 만들었다.",
    clozeSentence: "The legal clause was intentionally written in ______ language.",
    etymology: "ambi (양쪽, 둘 다) + agere (몰고 가다) → 양쪽 갈래길로 몰고 가니 어느 쪽인지 모호함",
    mnemonic: "앰비(ambi: 양쪽 다) 귀(gu)에 걸면 귀걸이 코에 걸면 코걸이인 '애매모호한' 태도!",
    confusable: {
      word: "vague",
      difference: "vague는 정보가 부족해서 흐릿한 것(흐리멍텅한), ambiguous는 두세 가지 의미가 다 성립하여 헷갈리는 것."
    },
    synonyms: ["equivocal", "unclear", "obscure", "cryptic"],
    antonyms: ["clear", "lucid", "unambiguous", "explicit"]
  },
  {
    id: "csat_06",
    word: "resilient",
    phonetic: "/rɪˈzɪl.jənt/",
    partOfSpeech: "adj.",
    meaning: "회복력 있는, 탄력 있는, 곧 기운을 차리는",
    definitionEn: "able to be happy, successful, etc. again after something difficult or bad has happened",
    category: "CSAT",
    level: 2,
    example: "Children are often remarkably resilient in coping with major changes.",
    exampleKo: "아이들은 큰 변화를 겪을 때 종종 놀라울 정도로 뛰어난 회복력을 보인다.",
    clozeSentence: "The local economy proved surprisingly ______ against the shock.",
    etymology: "re (다시) + salire (튀어 오르다) → 넘어져도 용수철처럼 다시 튀어 오르는 성질",
    mnemonic: "리(re:다시) 질리언(silient): 쓰러져도 질리지 않고 '다시 튕겨 일어나는 회복력'!",
    confusable: {
      word: "flexible",
      difference: "flexible은 휘어지는 유연성 중심, resilient는 타격을 입었을 때 본래 상태로 되돌아오는 복원력 중심."
    },
    synonyms: ["elastic", "rebounding", "buoyant", "tenacious"],
    antonyms: ["fragile", "vulnerable", "rigid"]
  },
  {
    id: "csat_07",
    word: "deteriorate",
    phonetic: "/dɪˈtɪr.i.ə.reɪt/",
    partOfSpeech: "v.",
    meaning: "악화되다, 더 나빠지다, 저하되다",
    definitionEn: "to become worse in quality, condition, or value",
    category: "CSAT",
    level: 2,
    example: "The weather conditions deteriorated rapidly as the blizzard approached the valley.",
    exampleKo: "눈보라가 계곡에 접근함에 따라 기상 조건이 급격하게 악화되었다.",
    clozeSentence: "Without proper maintenance, the historic structure will quickly ______.",
    etymology: "라틴어 deterior (더 나쁜) + ate (동사형 접미사) → 점점 더 나쁜 상태로 떨어지다",
    mnemonic: "디(de: 아래로) 테러(terror)를 당해 상태가 끝없이 '악화되다'!",
    confusable: {
      word: "degrade",
      difference: "degrade는 등급이나 품질이 낮아지는 것(격하), deteriorate는 건강, 상태, 기후 등이 점점 더 나빠지는 것."
    },
    synonyms: ["worsen", "degenerate", "decline", "decay"],
    antonyms: ["improve", "ameliorate", "strengthen"]
  },
  {
    id: "csat_08",
    word: "benevolent",
    phonetic: "/bəˈnev.əl.ənt/",
    partOfSpeech: "adj.",
    meaning: "자애로운, 자비로운, 친절한",
    definitionEn: "kind and helpful; desiring to help other people",
    category: "CSAT",
    level: 2,
    example: "A benevolent donor contributed millions to fund scholarships for disadvantaged youth.",
    exampleKo: "자애로운 기부자가 소외 계층 청소년들의 장학금을 위해 수백만 달러를 기부했다.",
    clozeSentence: "The monarch was remembered as a wise and ______ ruler.",
    etymology: "bene (좋은, 선한) + volens (바라다, 의지) → 남에게 좋은 일이 일어나기를 바라는 마음",
    mnemonic: "배내(bene: Good)부터 천성적으로 선하게 태어난 '자비롭고 친절한' 성품!",
    confusable: {
      word: "malevolent",
      difference: "정반대 어휘! male(악한, 나쁜) + volent = 악의를 품은, 사악한. bene(선한) = 자비로운."
    },
    synonyms: ["compassionate", "charitable", "philanthropic", "altruistic"],
    antonyms: ["malevolent", "spiteful", "malicious", "cruel"]
  },
  {
    id: "csat_09",
    word: "ubiquitous",
    phonetic: "/juːˈbɪk.wə.t̬əs/",
    partOfSpeech: "adj.",
    meaning: "어디에나 존재하는, 도처에 널린",
    definitionEn: "seeming to be in all places at the same time; extremely common",
    category: "CSAT",
    level: 3,
    example: "Smartphones have become so ubiquitous that life without them is hard to imagine.",
    exampleKo: "스마트폰은 어디에나 너무 흔해져서 그것 없는 삶은 상상하기 어렵다.",
    clozeSentence: "Coffee shops seem virtually ______ in every major commercial street.",
    etymology: "라틴어 ubique (어디에나, 도처에) + ous (형용사형 접미사)",
    mnemonic: "유비(u-bi: 어디에나) 퀴즈처럼 번쩍 나타나는 '도처에 널려 있는' 것!",
    confusable: {
      word: "omnipresent",
      difference: "omnipresent는 신(God)의 영적 편재에 자주 쓰이고, ubiquitous는 기술, 제품, 유행 등이 도처에 깔려 있음을 뜻함."
    },
    synonyms: ["omnipresent", "pervasive", "universal", "everywhere"],
    antonyms: ["rare", "scarce", "infrequent"]
  },
  {
    id: "csat_10",
    word: "scrutinize",
    phonetic: "/ˈskruː.tən.aɪz/",
    partOfSpeech: "v.",
    meaning: "면밀히 조사하다, 철저히 검토하다",
    definitionEn: "to examine someone or something very carefully and thoroughly",
    category: "CSAT",
    level: 2,
    example: "Inspectors were sent to scrutinize all safety equipment across the nuclear facility.",
    exampleKo: "원자력 시설 전반의 모든 안전 장비를 면밀히 조사하기 위해 검사관들이 파견되었다.",
    clozeSentence: "Journalists began to ______ the newly disclosed government contracts.",
    etymology: "라틴어 scrutari (뒤지다, 샅샅이 찾아내다) → 쓰레기 더미라도 뒤져 진실을 찾아내는 모습",
    mnemonic: "스크루지(Scrooge) 영감이 동전 하나까지 돋보기로 '면밀히 샅샅이 검토'하는 모습!",
    confusable: {
      word: "scan",
      difference: "scan은 대충 훑어보거나 훑어 스캔하는 느낌, scrutinize는 작은 결함까지 잡아내려 매우 깊이 파고드는 것."
    },
    synonyms: ["inspect", "examine", "investigate", "audit"],
    antonyms: ["glance", "skim", "overlook"]
  },

  // --- TOEIC / 토익 실전 어휘 ---
  {
    id: "toeic_01",
    word: "lucrative",
    phonetic: "/ˈluː.krə.t̬ɪv/",
    partOfSpeech: "adj.",
    meaning: "수익성이 좋은, 많은 돈을 벌어들이는",
    definitionEn: "producing much money or making a large profit",
    category: "TOEIC",
    level: 2,
    example: "The software firm signed a lucrative contract with an international retail conglomerate.",
    exampleKo: "그 소프트웨어 회사는 한 다국적 유통 대기업과 수익성 높은 계약을 체결했다.",
    clozeSentence: "Investing in real estate during that era was exceptionally ______.",
    etymology: "라틴어 lucrum (이익, 이윤 - lucre의 어원) + ative → 이윤을 왕창 낳는",
    mnemonic: "루크(Luc)가 크리에이티브(creative)한 아이디어로 '수익성이 대박 좋은' 사업을 열었다!",
    confusable: {
      word: "profitable",
      difference: "동의어지만 lucrative는 특히 '단숨에 막대한 금전적 이익을 가져다주는' 뉘앙스가 더 강합니다."
    },
    synonyms: ["profitable", "rewarding", "gainful", "remunerative"],
    antonyms: ["unprofitable", "loss-making", "barren"]
  },
  {
    id: "toeic_02",
    word: "mandatory",
    phonetic: "/ˈmæn.də.tɔːr.i/",
    partOfSpeech: "adj.",
    meaning: "의무적인, 법에 정해진, 강제적인",
    definitionEn: "describing something that must be done, usually because of a law or official rule",
    category: "TOEIC",
    level: 1,
    example: "Attendance at the workplace harassment prevention seminar is strictly mandatory.",
    exampleKo: "직장 내 괴롭힘 예방 세미나 참석은 엄격히 의무 사항이다.",
    clozeSentence: "Wearing a protective hard hat is ______ on this construction site.",
    etymology: "라틴어 mandatum (명령, 위임된 권한 - mandate) + ory → 국가나 상부의 명령에 따른",
    mnemonic: "맨(man) 데이트(date) 가기 전엔 단정한 옷차림이 '의무적' 규칙!",
    confusable: {
      word: "compulsory",
      difference: "compulsory는 학교 교육/군대 등 물리적 강제 느낌이 강하고, mandatory는 사규/법규/규정에 따른 의무에 빈출."
    },
    synonyms: ["obligatory", "compulsory", "required", "binding"],
    antonyms: ["optional", "voluntary", "discretionary"]
  },
  {
    id: "toeic_03",
    word: "feasible",
    phonetic: "/ˈfiː.zə.bəl/",
    partOfSpeech: "adj.",
    meaning: "실현 가능한, 그럴싸한, 이행할 수 있는",
    definitionEn: "able to be made, done, or achieved successfully",
    category: "TOEIC",
    level: 2,
    example: "The engineering team concluded that the proposed high-speed train link is technically feasible.",
    exampleKo: "엔지니어링 팀은 제안된 고속철도 연결망이 기술적으로 실현 가능하다고 결론지었다.",
    clozeSentence: "With our current budget, the expansion plan is simply not ______.",
    etymology: "라틴어 facere (행하다, 만들다) → 불어 faisable → 실제로 만들고 행할 수 있는",
    mnemonic: "피(fee)를 지불할 수 있을 만큼 예산 내에서 '실현 가능한' 계획!",
    confusable: {
      word: "plausible",
      difference: "plausible은 주장이나 설명이 '그럴듯하게 들리는'(진위 여부), feasible은 계획이 '현실에서 실행 가능한'(실행 가능성)."
    },
    synonyms: ["viable", "workable", "achievable", "practicable"],
    antonyms: ["impossible", "impractical", "unfeasible"]
  },
  {
    id: "toeic_04",
    word: "reimburse",
    phonetic: "/ˌriː.ɪmˈbɝːs/",
    partOfSpeech: "v.",
    meaning: "변제하다, 배상하다, (경비 등을) 환급해 주다",
    definitionEn: "to pay someone back an amount of money that they have spent on official business",
    category: "TOEIC",
    level: 2,
    example: "Please submit all receipts to the accounting office so we can reimburse your travel expenses.",
    exampleKo: "출장 경비를 환급해 드릴 수 있도록 회계 부서에 모든 영수증을 제출해 주십시오.",
    clozeSentence: "The company will ______ employees up to $500 for business travel meals.",
    etymology: "re (다시) + in (안에) + bursa (지갑 - purse의 사촌) → 주머니에서 나간 돈을 다시 지갑 안으로 넣어주다",
    mnemonic: "리(re: 다시) 인 벗(burs=지갑): 내 지갑에서 나간 출장비를 '다시 환급'해 준다!",
    confusable: {
      word: "refund",
      difference: "refund는 물건 반품 시 구매 대금을 돌려주는 것, reimburse는 업무상 개인이 먼저 지출한 비용을 회사가 물어주는 것."
    },
    synonyms: ["repay", "compensate", "recoup", "remunerate"],
    antonyms: ["charge", "penalize", "withhold"]
  },
  {
    id: "toeic_05",
    word: "comply",
    phonetic: "/kəmˈplaɪ/",
    partOfSpeech: "v.",
    meaning: "따르다, 준수하다 (전치사 with와 세트)",
    definitionEn: "to act according to an order, set of rules, or request",
    category: "TOEIC",
    level: 1,
    example: "All manufacturing facilities must strictly comply with regional environmental regulations.",
    exampleKo: "모든 제조 공장은 지역 환경 규정을 엄격히 준수해야 한다.",
    clozeSentence: "Failure to ______ with the safety instructions will void the warranty.",
    etymology: "라틴어 complere (가득 채우다, 완수하다) → 명령이나 규칙의 요구사항을 다 채워서 지키다",
    mnemonic: "컴퓨터 플라이(com-ply) 규정을 성실히 '준수하다' (comply with 필수 암기!)",
    confusable: {
      word: "conform",
      difference: "comply with는 법규나 공식 규칙 준수, conform to는 사회적 관습이나 집단의 일반적 기준에 맞추는 뉘앙스."
    },
    synonyms: ["observe", "abide by", "adhere to", "follow"],
    antonyms: ["violate", "defy", "breach", "disobey"]
  },
  {
    id: "toeic_06",
    word: "contingency",
    phonetic: "/kənˈtɪn.dʒən.si/",
    partOfSpeech: "n.",
    meaning: "만일의 사태, 우발 사태, 비상 상황 대비책",
    definitionEn: "something that might possibly happen in the future, usually causing problems or requiring action",
    category: "TOEIC",
    level: 2,
    example: "The logistics division established an emergency contingency plan in case of severe transit delays.",
    exampleKo: "물류 부서는 심각한 운송 지연에 대비하여 비상 사태 대응 계획(컨틴전시 플랜)을 수립했다.",
    clozeSentence: "We set aside extra funding to cover any unexpected ______.",
    etymology: "con (함께) + tangere (만지다, 닿다) → 우연히 마주치게 되는 예측불허의 일",
    mnemonic: "컨틴전시(contingency) 플랜: 위기관리 경영의 대표 용어로 '만일의 비상사태'를 뜻함!",
    confusable: {
      word: "emergency",
      difference: "emergency는 이미 닥친 긴급 상황 자체를 뜻하며, contingency는 '앞으로 일어날지도 모르는 잠재적 변수/돌발상황'을 뜻함."
    },
    synonyms: ["emergency", "eventuality", "incident", "backup"],
    antonyms: ["certainty", "predictability"]
  },
  {
    id: "toeic_07",
    word: "tentative",
    phonetic: "/ˈten.t̬ə.t̬ɪv/",
    partOfSpeech: "adj.",
    meaning: "잠정적인, 임시의, 확정되지 않은",
    definitionEn: "not certain or agreed, or said or done without confidence",
    category: "TOEIC",
    level: 1,
    example: "We have agreed on a tentative schedule for the product launch next quarter.",
    exampleKo: "우리는 다음 분기 신제품 출시를 위한 잠정적인 일정에 합의했다.",
    clozeSentence: "The union reached a ______ agreement with management late yesterday.",
    etymology: "라틴어 tentare (시험해 보다, 만져보다) → 일단 시험 삼아 건드려 보는 단계",
    mnemonic: "텐트(tent)를 친 상태처럼 언제든 걷어낼 수 있는 '잠정적이고 임시적인' 상태!",
    confusable: {
      word: "provisional",
      difference: "둘 다 '잠정적인'이지만, tentative는 '조심스럽게 떠보는', provisional은 '공식 승인 전까지 일시 적용되는' 뉘앙스."
    },
    synonyms: ["provisional", "interim", "unconfirmed", "exploratory"],
    antonyms: ["definite", "final", "conclusive", "fixed"]
  },
  {
    id: "toeic_08",
    word: "unprecedented",
    phonetic: "/ʌnˈpres.ə.den.t̬ɪd/",
    partOfSpeech: "adj.",
    meaning: "전례 없는, 유례없는, 사상 초유의",
    definitionEn: "never having happened or existed in the past",
    category: "TOEIC",
    level: 2,
    example: "The e-commerce startup experienced an unprecedented surge in consumer demand.",
    exampleKo: "그 전자상거래 스타트업은 소비자 수요에서 전례 없는 급증세를 경험했다.",
    clozeSentence: "The hurricane brought an ______ volume of rainfall to the coastal region.",
    etymology: "un (부정: 없는) + precedent (전례, 판례) + ed → 이전 역사에 선례가 한 번도 없었던",
    mnemonic: "언(un: 없는) 프레지던트(president: 이전 기록): 전례가 없는 사상 초유의 사건!",
    confusable: {
      word: "extraordinary",
      difference: "extraordinary는 그냥 '대단히 비범하고 놀라운', unprecedented는 '과거 기록/역사에 아예 전례가 없는' 것."
    },
    synonyms: ["unmatched", "historic", "peerless", "groundbreaking"],
    antonyms: ["common", "routine", "precedented", "conventional"]
  },

  // --- BUSINESS / 비즈니스 전문 어휘 ---
  {
    id: "biz_01",
    word: "leverage",
    phonetic: "/ˈlev.ɚ.ɪdʒ/",
    partOfSpeech: "v. / n.",
    meaning: "지렛대 삼아 활용하다, 영향력을 행사하다",
    definitionEn: "to use something that you already have in order to achieve something new or better",
    category: "BUSINESS",
    level: 2,
    example: "The company aims to leverage its global distribution network to introduce AI gadgets.",
    exampleKo: "그 회사는 글로벌 유통망을 지렛대 삼아 AI 기기를 시장에 선보이고자 한다.",
    clozeSentence: "Startups must ______ customer testimonials to build trust quickly.",
    etymology: "lever (지렛대) + age (상태, 작용) → 작은 힘으로 큰 바위를 움직이는 지렛대 원리",
    mnemonic: "레버(lever: 지렛대 손잡이)를 당겨 적은 자본으로 이득을 '극대화하여 활용'하다!",
    confusable: {
      word: "utilize",
      difference: "utilize는 일반적인 '활용하다', leverage는 '기존 자산이나 강점을 지렛대 삼아 기하급수적 효과를 내는' 전략적 뉘앙스."
    },
    synonyms: ["capitalize on", "exploit", "harness", "maximize"],
    antonyms: ["underutilize", "squander", "ignore"]
  },
  {
    id: "biz_02",
    word: "bottleneck",
    phonetic: "/ˈbɑː.t̬əl.nek/",
    partOfSpeech: "n.",
    meaning: "병목 현상, 지체/정체 구간, 진행 방해 요소",
    definitionEn: "a problem that delays progress or the flow of goods and processes",
    category: "BUSINESS",
    level: 1,
    example: "A shortage of microchips created a critical bottleneck across the entire automotive supply line.",
    exampleKo: "마이크로칩 부족으로 인해 전체 자동차 생산 라인에 심각한 병목 현상이 발생했다.",
    clozeSentence: "Manual data entry proved to be the major ______ in customer onboarding.",
    etymology: "bottle (병) + neck (목) → 병목이 좁아 내용물이 한 번에 쏟아져 나오지 못하고 막히는 현상",
    mnemonic: "병(bottle)의 목(neck)이 좁아서 물이 콸콸 못 나오고 '지체되고 정체'되는 현상!",
    confusable: {
      word: "obstacle",
      difference: "obstacle은 앞을 가로막는 단발성 장애물, bottleneck은 흐름/프로세스 상에서 전체 속도를 늦추는 좁은 병목 구간."
    },
    synonyms: ["chokepoint", "impediment", "snag", "logjam"],
    antonyms: ["catalyst", "accelerator", "breakthrough"]
  },
  {
    id: "biz_03",
    word: "synergy",
    phonetic: "/ˈsɪn.ɚ.dʒi/",
    partOfSpeech: "n.",
    meaning: "시너지, 상승효과, 동반 작용",
    definitionEn: "the combined power of a group of things when they are working together which is greater than the total power achieved by each working separately",
    category: "BUSINESS",
    level: 1,
    example: "The merger will create powerful cost-saving synergy between the two tech giants.",
    exampleKo: "이번 합병은 두 거대 IT 기업 간에 강력한 비용 절감 시너지 효과를 창출할 것이다.",
    clozeSentence: "Cross-functional teams foster unexpected ______ across departments.",
    etymology: "syn (함께) + ergon (일, 에너지) → 함께 일하여 1 + 1 = 3 이상의 폭발적 에너지를 냄",
    mnemonic: "신(syn=함께) 에너지를 합치니 폭발적인 '상승 시너지 효과'가 팡!",
    confusable: {
      word: "cooperation",
      difference: "cooperation은 단순한 협력 행위, synergy는 협력을 통해 각자의 합보다 더 큰 결과가 창출되는 '상승효과' 그 자체."
    },
    synonyms: ["collaboration", "cohesion", "alliance", "symbiosis"],
    antonyms: ["antagonism", "friction", "discord"]
  },
  {
    id: "biz_04",
    word: "stakeholder",
    phonetic: "/ˈsteɪkˌhoʊl.dɚ/",
    partOfSpeech: "n.",
    meaning: "이해관계자, 주주 및 관련 당사자",
    definitionEn: "a person such as an employee, customer, or citizen who is involved with an organization and has an interest in its success",
    category: "BUSINESS",
    level: 1,
    example: "We held an open town hall meeting to consult all regional stakeholders before construction.",
    exampleKo: "우리는 착공 전 모든 지역 이해관계자들의 의견을 수렴하기 위해 공개 타운홀 미팅을 열었다.",
    clozeSentence: "Effective leaders manage expectations across every key ______ group.",
    etymology: "stake (내기에 건 돈, 지분, 말뚝) + holder (쥐고 있는 자) → 회사 결과에 자신의 지분이 걸려 있는 사람",
    mnemonic: "스테이크(stake) 고기 파이를 나눌 권리를 쥐고 있는 '이해관계자'들!",
    confusable: {
      word: "shareholder",
      difference: "shareholder는 '주식을 소유한 주주'에 한정되지만, stakeholder는 주주뿐 아니라 직원, 고객, 협력사, 지역사회 전체를 포함."
    },
    synonyms: ["interested party", "contributor", "participant", "partner"],
    antonyms: ["outsider", "bystander"]
  },
  {
    id: "biz_05",
    word: "scalable",
    phonetic: "/ˈskeɪ.lə.bəl/",
    partOfSpeech: "adj.",
    meaning: "확장 가능한, 규모를 키울 수 있는",
    definitionEn: "able to grow or be made larger in order to meet increased demand",
    category: "BUSINESS",
    level: 2,
    example: "Cloud computing provides a highly scalable infrastructure that grows alongside your user base.",
    exampleKo: "클라우드 컴퓨팅은 사용자 기반의 증가에 발맞추어 성장할 수 있는 고도로 확장 가능한 인프라를 제공한다.",
    clozeSentence: "Venture capitalists look for business models that are inherently ______.",
    etymology: "scale (사다리, 척도, 규모) + able (할 수 있는) → 사다리를 타고 올라가듯 규모를 무한히 확장할 수 있는",
    mnemonic: "스케일(scale: 규모)을 마음대로 키울(able) 수 있는 '확장 가능한' 비즈니스!",
    confusable: {
      word: "flexible",
      difference: "flexible은 상황 변화에 유연하게 변형되는 것, scalable은 사용자가 1만에서 1억 명으로 늘어도 시스템이 터지지 않고 커지는 역량."
    },
    synonyms: ["expandable", "extensible", "adaptable"],
    antonyms: ["rigid", "unscalable", "limited"]
  },

  // --- ADVANCED / 고급 & 토플 어휘 ---
  {
    id: "adv_01",
    word: "ephemeral",
    phonetic: "/ɪˈfem.ər.əl/",
    partOfSpeech: "adj.",
    meaning: "수명이 짧은, 덧없는, 찰나의",
    definitionEn: "lasting for only a short time; fleeting",
    example: "Social media virality is notoriously ephemeral, fading away within a couple of days.",
    exampleKo: "소셜 미디어의 바이럴 인기는 며칠 만에 사라질 정도로 수명이 짧고 덧없기로 악명 높다.",
    clozeSentence: "Cherry blossoms in spring represent an ______ yet breathtaking beauty.",
    category: "ADVANCED",
    level: 3,
    etymology: "그리스어 ephemeros (하루살이의) : epi (위에, 기간) + hemera (하루) → 하루만 살고 사라지는",
    mnemonic: "에펨(ephem)라디오 주파수 소리처럼 스치듯 금방 사라지는 '덧없는 찰나의' 순간!",
    confusable: {
      word: "temporary",
      difference: "temporary는 단순히 정규직 반대의 '일시적인', ephemeral은 이슬이나 벚꽃처럼 아름답지만 '너무나 짧게 스쳐 지나가는 덧없음'을 강조."
    },
    synonyms: ["fleeting", "transient", "evanescent", "short-lived"],
    antonyms: ["eternal", "perpetual", "enduring", "permanent"]
  },
  {
    id: "adv_02",
    word: "paradox",
    phonetic: "/ˈper.ə.dɑːks/",
    partOfSpeech: "n.",
    meaning: "역설, 패러독스, 모순되어 보이지만 진실을 담은 말",
    definitionEn: "a situation or statement that seems impossible or is difficult to understand because it contains two opposite facts or characteristics",
    category: "ADVANCED",
    level: 2,
    example: "The paradox of wealth is that having more material goods often leads to greater anxiety.",
    exampleKo: "부(富)의 역설은 더 많은 물질적 재화를 가질수록 종종 더 큰 불안으로 이어진다는 점이다.",
    clozeSentence: "It is a strange ______ that the more choices we have, the less satisfied we feel.",
    etymology: "para (넘어서, 반하여) + doxa (통념, 상식) → 상식을 뒤집어넘는 모순적 논리",
    mnemonic: "패러(para: 반대로) 독(dox: 의견): 일반적 상식과 정반대로 부딪히는 '역설과 모순'!",
    confusable: {
      word: "contradiction",
      difference: "contradiction은 그냥 앞뒤가 안 맞는 단순 모순, paradox는 겉보기엔 모순이지만 깊이 파고들면 통찰력 있는 진실이 드러나는 역설."
    },
    synonyms: ["contradiction", "inconsistency", "irony", "enigma"],
    antonyms: ["truism", "normality", "certainty"]
  },
  {
    id: "adv_03",
    word: "quintessential",
    phonetic: "/ˌkwɪn.təˈsen.ʃəl/",
    partOfSpeech: "adj.",
    meaning: "전형적인, 본질적인, 정수의, 가장 완벽한 본보기가 되는",
    definitionEn: "representing the most perfect or typical example of a quality or class",
    category: "ADVANCED",
    level: 3,
    example: "Afternoon tea served with clotted cream scones is the quintessential British tradition.",
    exampleKo: "클로티드 크림 스콘과 함께 즐기는 애프터눈 티는 가장 전형적이고 본질적인 영국의 전통이다.",
    clozeSentence: "He was regarded by contemporaries as the ______ Renaissance scholar.",
    etymology: "라틴어 quinta essentia (5번째 본질): 물/불/공기/흙 4원소를 초월한 최고의 순수 정수 원소",
    mnemonic: "퀸(Queen)이 입는 센스(essential) 넘치는 드레스: 왕실의 '가장 전형적이고 정수'인 품격!",
    confusable: {
      word: "typical",
      difference: "typical은 평범하고 흔한 보통의 느낌, quintessential은 어떤 분야의 가장 순수하고 완벽한 '정수이자 끝판왕' 모델."
    },
    synonyms: ["archetypal", "definitive", "exemplary", "paragon"],
    antonyms: ["atypical", "abnormal", "unrepresentative"]
  },
  {
    id: "adv_04",
    word: "juxtapose",
    phonetic: "/ˌdʒʌk.stəˈpoʊz/",
    partOfSpeech: "v.",
    meaning: "병치하다, 나란히 놓아 비교·대조하다",
    definitionEn: "to put things that are not similar next to each other in order to show contrast",
    category: "ADVANCED",
    level: 3,
    example: "The exhibition juxtaposes contemporary street graffiti with Renaissance oil paintings.",
    exampleKo: "그 전시는 현대의 거리 그래피티와 르네상스 유화를 나란히 병치하여 대조를 보여준다.",
    clozeSentence: "The documentary attempts to ______ extreme luxury alongside urban poverty.",
    etymology: "라틴어 juxta (가까이, 곁에) + ponere (놓다 - pose) → 두 대조적인 것을 나란히 가까이 놓다",
    mnemonic: "적(juxta: 곁에)에 포즈(pose: 놓다): 두 상반된 것을 곁에 나란히 놓아 '극명하게 대조'시키다!",
    confusable: {
      word: "compare",
      difference: "compare는 유사점과 차이점 모두를 견주는 것, juxtapose는 주로 극명한 시각적·개념적 대비 효과를 극대화하기 위해 나란히 놓는 연출."
    },
    synonyms: ["collocate", "contrast", "compare side-by-side"],
    antonyms: ["separate", "isolate", "disconnect"]
  },
  {
    id: "adv_05",
    word: "ubiquity",
    phonetic: "/juːˈbɪk.wə.t̬i/",
    partOfSpeech: "n.",
    meaning: "도처에 있음, 편재, 어디에나 존재함",
    definitionEn: "the state of being very common or seeming to be everywhere at once",
    category: "ADVANCED",
    level: 3,
    example: "The ubiquity of social media has fundamentally reshaped human social interactions.",
    exampleKo: "소셜 미디어의 편재성(도처에 널려 있음)은 인간의 사회적 상호작용을 근본적으로 재편했다.",
    clozeSentence: "The sudden ______ of artificial intelligence tools startled global educators.",
    etymology: "ubiquitous의 명사형. 라틴어 ubique (도처에)",
    mnemonic: "유비쿼터스(ubiquitous)의 명사형: 어디에나 번져있는 '편재성'!",
    confusable: {
      word: "popularity",
      difference: "popularity는 사람들이 좋아하는 '인기', ubiquity는 원하든 원치 않든 길거리나 생활 전반 어디에나 깔려 있는 '도처에 있음'."
    },
    synonyms: ["pervasiveness", "omnipresence", "prevalence"],
    antonyms: ["rarity", "scarcity", "uncommonness"]
  },
  {
    id: "csat_11",
    word: "comprehensive",
    phonetic: "/ˌkɑːm.prəˈhen.sɪv/",
    partOfSpeech: "adj.",
    meaning: "포괄적인, 종합적인, 광범위한",
    definitionEn: "complete and including everything that is necessary",
    category: "CSAT",
    level: 2,
    example: "The government published a comprehensive report detailing national energy consumption.",
    exampleKo: "정부는 국가 에너지 소비량을 상세히 담은 종합적인 보고서를 발표했다.",
    clozeSentence: "Our insurance package offers ______ coverage against flood and earthquake.",
    etymology: "com (완전히) + prehendere (잡다, 쥐다 - comprehend) + ive → 모든 사항을 빠짐없이 한 손에 다 거머쥔",
    mnemonic: "컴퓨터에 핸드폰(comprehend) 기능까지 싹 다 '포괄적이고 종합적으로' 집어넣은 만능 스마트폰!",
    confusable: {
      word: "comprehensible",
      difference: "주의! comprehensive는 '포괄적인/종합적인', comprehensible은 '이해할 수 있는(understandable)' 뜻입니다."
    },
    synonyms: ["exhaustive", "all-inclusive", "sweeping", "broad"],
    antonyms: ["limited", "partial", "narrow", "fragmentary"]
  },
  {
    id: "toeic_09",
    word: "appraise",
    phonetic: "/əˈpreɪz/",
    partOfSpeech: "v.",
    meaning: "감정하다, 평가하다, 가치를 매기다",
    definitionEn: "to examine someone or something in order to judge their qualities, success, or value",
    category: "TOEIC",
    level: 2,
    example: "An antique jeweler was hired to appraise the vintage diamond necklace.",
    exampleKo: "그 빈티지 다이아몬드 목걸이의 가치를 감정하기 위해 골동품 보석상이 고용되었다.",
    clozeSentence: "Managers will ______ employee performance at the annual year-end review.",
    etymology: "ad (~에게) + pretium (가격, 가치 - price의 어원) → 얼마의 가격이 적합한지 가치를 매기다",
    mnemonic: "어(a) 프라이스(praise/price): 얼마의 가격(price)이 맞는지 '가치를 감정하고 평가'하다!",
    confusable: {
      word: "praise",
      difference: "praise는 칭찬하다(compliment), appraise는 가치를 객관적으로 조사하고 평가/감정하다(evaluate)."
    },
    synonyms: ["evaluate", "assess", "estimate", "gauge"],
    antonyms: ["ignore", "disregard"]
  },
  {
    id: "biz_06",
    word: "disruptive",
    phonetic: "/dɪsˈrʌp.tɪv/",
    partOfSpeech: "adj.",
    meaning: "파괴적인, 혁신적인 (기존 시장 질서를 뒤흔드는)",
    definitionEn: "changing traditional business models by using technology or creative ideas",
    category: "BUSINESS",
    level: 2,
    example: "Uber and Airbnb became famous examples of disruptive innovation in transport and hospitality.",
    exampleKo: "우버와 에어비앤비는 운송과 숙박업 분야에서 파괴적 혁신의 유명한 사례가 되었다.",
    clozeSentence: "The startup introduced a ______ platform that halved transaction commissions.",
    etymology: "dis (산산이) + rumpere (부수다, 깨뜨리다 - rupture) → 기존의 굳은 틀을 산산조각 내다",
    mnemonic: "기존 관행을 디스(dis)하고 부수며(rupt) 판도를 뒤흔드는 '파괴적 혁신'!",
    confusable: {
      word: "destructive",
      difference: "destructive는 물리적으로 해를 끼치고 망가뜨리는 것, disruptive는 낡은 기존 질서를 타파하고 새 패러다임을 여는 것."
    },
    synonyms: ["revolutionary", "groundbreaking", "subversive", "transformative"],
    antonyms: ["conservative", "traditional", "incremental"]
  },
  {
    id: "csat_12",
    word: "perseverance",
    phonetic: "/ˌpɝː.səˈvɪr.əns/",
    partOfSpeech: "n.",
    meaning: "끈기, 인내, 불굴의 의지",
    definitionEn: "continued effort to do or achieve something, despite difficulties, failure, or opposition",
    category: "CSAT",
    level: 2,
    example: "Through sheer perseverance and discipline, she completed her doctorate while working full-time.",
    exampleKo: "순전한 끈기와 자기 훈련을 통해, 그녀는 전업으로 일하면서도 박사 학위를 마쳤다.",
    clozeSentence: "Success is less about raw talent and more about persistent ______.",
    etymology: "per (철저히, 끝까지) + severus (엄격한, 진지한) → 끝까지 엄격하게 버텨내는 의지",
    mnemonic: "퍼(per: 끝까지) 세이버(sever: 지키는 사람): 어떤 역경에도 끝까지 포기하지 않는 '끈기와 인내'!",
    confusable: {
      word: "patience",
      difference: "patience는 그저 분노를 삭이며 기다리는 참을성, perseverance는 목표를 향해 끊임없이 시도하고 전진하는 적극적 근성."
    },
    synonyms: ["persistence", "tenacity", "grit", "endurance"],
    antonyms: ["giving up", "apathy", "hesitation"]
  },
  {
    id: "toeic_10",
    word: "preliminary",
    phonetic: "/prɪˈlɪm.ə.ner.i/",
    partOfSpeech: "adj.",
    meaning: "예비의, 사전의, 준비 단계의",
    definitionEn: "coming before a more important action or event, especially introducing or preparing for it",
    category: "TOEIC",
    level: 2,
    example: "Preliminary data suggests that the new clinical drug has minimal adverse side effects.",
    exampleKo: "예비 조사 데이터에 따르면 이 새로운 임상 시험용 약물은 부작용이 매우 미미함을 시사한다.",
    clozeSentence: "We need to conduct a ______ market survey prior to mass production.",
    etymology: "prae (앞서) + limen (문턱) → 본격적으로 방 안에 들어가기 전 문턱 앞에서의 사전 준비",
    mnemonic: "프리(pre: 미리) 리미트(limit)에 닿기 전에 치르는 '사전 예비 조사'!",
    confusable: {
      word: "initial",
      difference: "initial은 그냥 단순한 첫 출발점(초기의), preliminary는 본 게임이나 최종 결정을 앞두고 치르는 '준비/사전' 성격."
    },
    synonyms: ["introductory", "preparatory", "exploratory", "prior"],
    antonyms: ["final", "conclusive", "ultimate"]
  }
];

if (typeof window !== "undefined") {
  window.VOCABULARY_DATABASE = VOCABULARY_DATABASE;
}
