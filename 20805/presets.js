// presets.js - 고품질 수능/모의고사 스타일 지문 프리셋 및 분석 데이터

const PRESET_PASSAGES = [
  {
    id: "csat-2024-34",
    title: "습관 형성의 인지적 메커니즘과 자동화",
    source: "2024 수능 기출 응용 / 인지과학",
    category: "인문·인지과학",
    difficulty: "고난도 (킬러)",
    badgeColor: "purple",
    summary: "인간의 뇌는 인지적 자원을 절약하기 위해 반복되는 행동을 '청크(덩어리)'로 묶어 무의식적 자동화 루틴으로 전환한다.",
    sentences: [
      {
        id: "s1",
        en: "The human brain is an extraordinary organ that constantly seeks to minimize cognitive load by automating repetitive behavioral sequences.",
        ko: "인간의 뇌는 반복적인 행동 순서를 자동화함으로써 인지적 부담을 최소화하고자 끊임없이 추구하는 놀라운 기관이다.",
        chunks: [
          { en: "The human brain is an extraordinary organ", ko: "인간의 뇌는 놀라운 기관이다" },
          { en: "that constantly seeks to minimize cognitive load", ko: "인지적 부담을 최소화하기 위해 끊임없이 노력하는" },
          { en: "by automating repetitive behavioral sequences.", ko: "반복적인 행동 순서를 자동화함으로써." }
        ],
        grammar: [
          {
            target: "that constantly seeks",
            term: "주격 관계대명사절",
            type: "rel",
            note: "선행사 'an extraordinary organ'을 수식하는 주격 관계대명사 that. 주어가 3인칭 단수이므로 동사 seeks에 -s가 결합되었습니다."
          },
          {
            target: "by automating",
            term: "전치사 + 동명사 (수단)",
            type: "part",
            note: "'by + -ing'는 '~함으로써'라는 수단/방법을 나타내는 구문입니다."
          },
          {
            target: "to minimize",
            term: "to부정사의 목적어",
            type: "toinf",
            note: "동사 seek는 미래지향적 의미의 to부정사(to minimize)를 목적어로 취합니다."
          }
        ],
        words: [
          { word: "extraordinary", pos: "adj.", meaning: "놀라운, 비범한", phonetic: "/ɪkˈstrɔːrdəneri/" },
          { word: "minimize", pos: "v.", meaning: "최소화하다", phonetic: "/ˈmɪnɪmaɪz/" },
          { word: "cognitive", pos: "adj.", meaning: "인지적인, 인식의", phonetic: "/ˈkɑːɡnətɪv/" },
          { word: "automate", pos: "v.", meaning: "자동화하다", phonetic: "/ˈɔːtəmeɪt/" },
          { word: "sequence", pos: "n.", meaning: "연속, 순서", phonetic: "/ˈsiːkwəns/" }
        ]
      },
      {
        id: "s2",
        en: "When a particular routine is practiced repeatedly, the basal ganglia, a primitive structure deep within the brain, gradually takes over from the prefrontal cortex.",
        ko: "특정한 루틴이 반복적으로 연습될 때, 뇌 깊숙한 곳에 위치한 원시 구조물인 기저핵이 점차 전두엽 피질로부터 통제권을 넘겨받는다.",
        chunks: [
          { en: "When a particular routine is practiced repeatedly,", ko: "특정한 루틴이 반복적으로 실행될 때," },
          { en: "the basal ganglia, a primitive structure deep within the brain,", ko: "뇌 깊숙한 곳의 원시 구조인 기저핵이," },
          { en: "gradually takes over from the prefrontal cortex.", ko: "전두엽 피질로부터 점차 (통제권을) 넘겨받는다." }
        ],
        grammar: [
          {
            target: "is practiced",
            term: "수동태 (be + p.p.)",
            type: "voice",
            note: "루틴(routine)이 스스로 행동하는 것이 아니라 '연습되는' 대상이므로 수동태(is practiced)가 사용되었습니다."
          },
          {
            target: ", a primitive structure deep within the brain,",
            term: "동격(Apposition) 어구",
            type: "syntax",
            note: "the basal ganglia(기저핵)에 대한 부연 설명을 콤마(,) 사이에 동격 명사구로 삽입했습니다."
          },
          {
            target: "takes over",
            term: "이어동사 (구동사)",
            type: "verb",
            note: "'~을 인계받다, 장악하다'라는 의미로 주어 the basal ganglia에 호응하는 본동사입니다."
          }
        ],
        words: [
          { word: "routine", pos: "n.", meaning: "판에 박힌 일, 일과, 루틴", phonetic: "/ruːˈtiːn/" },
          { word: "primitive", pos: "adj.", meaning: "원시의, 기초적인", phonetic: "/ˈprɪmətɪv/" },
          { word: "gradually", pos: "adv.", meaning: "점차, 서서히", phonetic: "/ˈɡrædʒuəli/" },
          { word: "cortex", pos: "n.", meaning: "피질(대뇌 피질 등)", phonetic: "/ˈkɔːrteks/" },
          { word: "take over", pos: "idiom", meaning: "인계받다, 넘겨받다", phonetic: "/teɪk ˈoʊvər/" }
        ]
      },
      {
        id: "s3",
        en: "This neurobiological shift, known as chunking, allows complex behaviors to be executed with minimal conscious effort.",
        ko: "'청킹(덩어리 짓기)'이라 알려진 이러한 신경생물학적 전환은 복잡한 행동들이 최소한의 의식적 노력만으로 실행될 수 있게 해준다.",
        chunks: [
          { en: "This neurobiological shift,", ko: "이러한 신경생물학적 전환은," },
          { en: "known as chunking,", ko: "'청킹'으로 알려진," },
          { en: "allows complex behaviors to be executed", ko: "복잡한 행동들이 실행될 수 있도록 허용한다" },
          { en: "with minimal conscious effort.", ko: "최소한의 의식적 노력으로." }
        ],
        grammar: [
          {
            target: "known as chunking",
            term: "과거분사구 (수식)",
            type: "part",
            note: "which is known as chunking에서 주격관대+be동사가 생략된 형태로, 앞 명사 'shift'를 수동 의미로 수식합니다."
          },
          {
            target: "allows complex behaviors to be executed",
            term: "5형식 사역/허용 동사 (allow + O + to be p.p.)",
            type: "syntax",
            note: "allow는 목적격보어로 to부정사를 취하며, 목적어(complex behaviors)와 보어의 관계가 수동이므로 'to be executed(수동태)'가 사용되었습니다. (내신/수능 초빈출!)"
          },
          {
            target: "conscious",
            term: "형용사 (명사 수식)",
            type: "mod",
            note: "명사 effort를 수식하는 형용사 ('의식적인'). subconscious(잠재의식의), unconscious(무의식의)와 구별 필수."
          }
        ],
        words: [
          { word: "neurobiological", pos: "adj.", meaning: "신경생물학의", phonetic: "/ˌnʊroʊbaɪəˈlɑːdʒɪkl/" },
          { word: "shift", pos: "n.", meaning: "전환, 변화", phonetic: "/ʃɪft/" },
          { word: "execute", pos: "v.", meaning: "실행하다, 수행하다", phonetic: "/ˈeksɪkjuːt/" },
          { word: "conscious", pos: "adj.", meaning: "의식하는, 자각하는", phonetic: "/ˈkɑːnʃəs/" },
          { word: "chunking", pos: "n.", meaning: "덩어리 짓기, 정보 묶기", phonetic: "/ˈtʃʌŋkɪŋ/" }
        ]
      },
      {
        id: "s4",
        en: "Consequently, free mental capacity is preserved for unexpected challenges that require critical analysis and deliberate deliberation.",
        ko: "결과적으로, 남은 정신적 용량은 비판적 분석과 신중한 심사숙고를 요구하는 예상치 못한 도전 과제들을 위해 보존된다.",
        chunks: [
          { en: "Consequently,", ko: "결과적으로," },
          { en: "free mental capacity is preserved", ko: "여유 정신적 용량이 보존된다" },
          { en: "for unexpected challenges", ko: "예기치 못한 도전들을 위해" },
          { en: "that require critical analysis and deliberate deliberation.", ko: "비판적 분석과 신중한 숙고를 요하는." }
        ],
        grammar: [
          {
            target: "is preserved",
            term: "수동태",
            type: "voice",
            note: "정신적 용량(capacity)은 스스로 보존하는 것이 아니라 보존되는 대상이므로 수동태 'is preserved'를 씁니다."
          },
          {
            target: "that require",
            term: "주격 관계대명사절",
            type: "rel",
            note: "선행사인 복수명사 'unexpected challenges'를 수식하므로 복수동사 require가 쓰였습니다."
          },
          {
            target: "deliberate deliberation",
            term: "어휘 조합 (형용사 + 명사)",
            type: "mod",
            note: "deliberate(신중한, 고의의) + deliberation(숙고, 협의)의 고난도 학술 어휘 조합입니다."
          }
        ],
        words: [
          { word: "consequently", pos: "adv.", meaning: "결과적으로, 따라서", phonetic: "/ˈkɑːnsəkwentli/" },
          { word: "capacity", pos: "n.", meaning: "용량, 능력, 수용력", phonetic: "/kəˈpæsəti/" },
          { word: "preserve", pos: "v.", meaning: "보존하다, 지키다", phonetic: "/prɪˈzɜːrv/" },
          { word: "unexpected", pos: "adj.", meaning: "예상치 못한, 뜻밖의", phonetic: "/ˌʌnɪkˈspektɪd/" },
          { word: "deliberation", pos: "n.", meaning: "심사숙고, 협의", phonetic: "/dɪˌlɪbəˈreɪʃn/" }
        ]
      }
    ],
    paraphrased: "To conserve energetic resources, the brain automates recurring activities by shifting cognitive control from deliberate executive centers to subconscious neural circuits. This adaptation bundles multiple actions into singular automated habits, thereby reserving scarce conscious attention for novel or demanding circumstances.",
    paraphrasedKo: "에너지 자원을 아끼기 위해, 뇌는 의식적인 실행 중추에서 무의식적인 신경 회로로 인지적 통제권을 전환함으로써 반복되는 활동을 자동화한다. 이러한 적응은 여러 행동을 단일한 자동화된 습관으로 묶어주며, 이를 통해 새롭거나 까다로운 상황을 대비해 희소한 의식적 주의력을 아껴둔다.",
    variations: [
      {
        type: "grammar",
        title: "[어법상 틀린 것 찾기] 수능 29번 실전 유형",
        instruction: "다음 글의 밑줄 친 부분 중, 어법상 틀린 것을 고르시오.",
        passageWithUnderlines: "The human brain is an extraordinary organ that constantly seeks to minimize cognitive load by ①<u>automating</u> repetitive behavioral sequences. When a particular routine is practiced repeatedly, the basal ganglia gradually ②<u>takes</u> over from the prefrontal cortex. This neurobiological shift, ③<u>known</u> as chunking, allows complex behaviors ④<u>to execute</u> with minimal conscious effort. Consequently, free mental capacity is preserved for unexpected challenges that ⑤<u>require</u> critical analysis.",
        options: [
          "① automating : 전치사 by의 목적어로 쓰인 올바른 동명사",
          "② takes : 단수 명사 the basal ganglia를 받는 올바른 단수 동사",
          "③ known : 앞의 명사 shift를 수동으로 수식하는 올바른 과거분사",
          "④ to execute : 행동(behaviors)이 실행되는 수동 관계이므로 to be executed로 고쳐야 함",
          "⑤ require : 선행사 unexpected challenges(복수)에 수일치한 올바른 복수 동사"
        ],
        correctIndex: 3,
        explanation: "④번: allow + 목적어 + 목적격보어 구문에서 목적어인 complex behaviors(복잡한 행동들)는 스스로 실행하는 것이 아니라 '실행되는(수동)' 대상입니다. 따라서 능동형 to execute가 아니라 수동형 부정사 **to be executed**로 고쳐야 어법상 올바릅니다."
      },
      {
        type: "blank",
        title: "[빈칸 추론] 수능 31~34번 실전 유형",
        instruction: "다음 글의 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.",
        passageWithBlank: "The human brain seeks to minimize cognitive load by automating repetitive routines. Through chunking, familiar sequences are managed by subconscious brain areas rather than the conscious prefrontal cortex. As a result of this cognitive conservation, the brain is able to _______________________________________.",
        options: [
          "① eliminate the need for any conscious thinking in daily life",
          "② reserve precious mental capacity for novel and complex problems",
          "③ rely completely on primitive instincts without logical reasoning",
          "④ reduce physical stamina consumption during repetitive muscle actions"
        ],
        correctIndex: 1,
        explanation: "정답 ②번: 글의 핵심 논지는 반복적인 일상을 '청킹(자동화)'함으로써 뇌가 인지적 부담을 덜고, 이렇게 아낀 멘탈 에너지를 '예상치 못한 문제나 비판적 분석이 필요한 복잡한 상황'에 쓰기 위해 보존한다는 것입니다. 따라서 '새롭고 복잡한 문제를 위해 귀중한 정신적 능력을 아껴둔다(reserve precious mental capacity for novel and complex problems)'가 가장 적절합니다."
      },
      {
        type: "order",
        title: "[글의 순서 배열] 수능 36~37번 실전 유형",
        instruction: "주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시오.",
        givenSentence: "The human brain is an extraordinary organ that constantly seeks to minimize cognitive load by automating repetitive behavioral sequences.",
        paragraphs: {
          A: "This neurobiological shift, known as chunking, allows complex behaviors to be executed with minimal conscious effort.",
          B: "When a particular routine is practiced repeatedly, the basal ganglia, a primitive structure deep within the brain, gradually takes over from the prefrontal cortex.",
          C: "Consequently, free mental capacity is preserved for unexpected challenges that require critical analysis and deliberate deliberation."
        },
        options: [
          "① (A) - (C) - (B)",
          "② (B) - (A) - (C)",
          "③ (B) - (C) - (A)",
          "④ (C) - (A) - (B)"
        ],
        correctIndex: 1,
        explanation: "정답 ②번 (B) - (A) - (C):\n- 주어진 글: 뇌는 반복적인 행동 순서를 자동화하여 인지 부담을 줄이려 함.\n- (B): 반복 연습 시 대뇌 피질에서 기저핵으로 제어권이 넘어가는 구체적 과정 소개.\n- (A): 지시대명사 'This neurobiological shift(이 신경생물학적 전환)'를 통해 (B)의 과정을 'chunking'으로 정의하고 효과 설명.\n- (C): 'Consequently(결과적으로)' 접속사를 통해 청킹의 최종 결과(남은 용량을 복잡한 문제에 보존)로 글을 마무리."
      }
    ]
  },
  {
    id: "mock-2023-ai",
    title: "생성형 AI와 인간 고유의 비판적 사고",
    source: "2023 모의평가 변형 / 기술과 사회",
    category: "과학·기술·철학",
    difficulty: "중고난도",
    badgeColor: "blue",
    summary: "인공지능이 방대한 데이터를 취합해 답을 제시할수록, 인간에게는 그 결과의 진위와 윤리성을 검증하는 비판적 분별력이 더욱 절실해진다.",
    sentences: [
      {
        id: "s1",
        en: "As generative artificial intelligence becomes capable of synthesizing vast oceans of textual data within seconds, the nature of human intellectual work is fundamentally transforming.",
        ko: "생성형 인공지능이 몇 초 만에 방대한 텍스트 데이터를 종합할 수 있는 능력을 갖추게 됨에 따라, 인간 지적 노동의 본질이 근본적으로 변화하고 있다.",
        chunks: [
          { en: "As generative artificial intelligence becomes capable of synthesizing", ko: "생성형 AI가 종합할 수 있게 됨에 따라" },
          { en: "vast oceans of textual data within seconds,", ko: "몇 초 만에 방대한 텍스트 데이터를," },
          { en: "the nature of human intellectual work is fundamentally transforming.", ko: "인간 지적 노동의 본질이 근본적으로 변하고 있다." }
        ],
        grammar: [
          {
            target: "becomes capable of synthesizing",
            term: "be capable of + 동명사",
            type: "part",
            note: "'~할 수 있다'는 뜻으로 전치사 of 뒤에 동명사 synthesizing(종합하기)이 연결됩니다."
          },
          {
            target: "is fundamentally transforming",
            term: "현재진행형 (자동사)",
            type: "verb",
            note: "transform은 여기서 자동사로 쓰여 '~가 변모하고 있다'는 진행 중인 변화를 생생하게 전달합니다."
          }
        ],
        words: [
          { word: "generative", pos: "adj.", meaning: "생성적인, 생성의", phonetic: "/ˈdʒenərətɪv/" },
          { word: "synthesize", pos: "v.", meaning: "종합하다, 합성하다", phonetic: "/ˈsɪnθəsaɪz/" },
          { word: "vast", pos: "adj.", meaning: "방대한, 거대한", phonetic: "/væst/" },
          { word: "intellectual", pos: "adj.", meaning: "지적인, 지성의", phonetic: "/ˌɪntəˈlektʃuəl/" },
          { word: "transform", pos: "v.", meaning: "변형시키다, 탈바꿈하다", phonetic: "/trænsˈfɔːrm/" }
        ]
      },
      {
        id: "s2",
        en: "Rather than passively memorizing facts, learners must now cultivate critical discernment to distinguish algorithmic hallucinations from verified truths.",
        ko: "학습자들은 단순히 사실을 수동적으로 암기하기보다, 알고리즘의 환각(오류)과 검증된 진실을 구별해 낼 수 있는 비판적 분별력을 길러야만 한다.",
        chunks: [
          { en: "Rather than passively memorizing facts,", ko: "수동적으로 사실을 암기하기보다는," },
          { en: "learners must now cultivate critical discernment", ko: "학습자들은 이제 비판적 분별력을 함양해야 한다" },
          { en: "to distinguish algorithmic hallucinations from verified truths.", ko: "알고리즘의 환각과 검증된 진실을 구별하기 위해." }
        ],
        grammar: [
          {
            target: "Rather than passively memorizing",
            term: "Rather than + 동명사",
            type: "part",
            note: "'~하기보다는'이라는 대비 표현으로 부사 passively가 동명사 memorizing을 수식합니다."
          },
          {
            target: "distinguish A from B",
            term: "숙어 표현",
            type: "syntax",
            note: "'A와 B를 구별/식별하다'. to부정사의 부사적 용법(목적)으로 쓰였습니다."
          },
          {
            target: "verified truths",
            term: "과거분사 형용사 수식",
            type: "part",
            note: "진실(truths)은 '검증받은' 것이므로 수동 의미의 과거분사 verified가 꾸밉니다."
          }
        ],
        words: [
          { word: "passively", pos: "adv.", meaning: "수동적으로", phonetic: "/ˈpæsɪvli/" },
          { word: "cultivate", pos: "v.", meaning: "함양하다, 경작하다", phonetic: "/ˈkʌltɪveɪt/" },
          { word: "discernment", pos: "n.", meaning: "분별력, 안목", phonetic: "/dɪˈsɜːrnmənt/" },
          { word: "hallucination", pos: "n.", meaning: "환각, 그럴듯한 오류", phonetic: "/həˌluːsɪˈneɪʃn/" },
          { word: "verify", pos: "v.", meaning: "검증하다, 입증하다", phonetic: "/ˈverɪfaɪ/" }
        ]
      },
      {
        id: "s3",
        en: "Without rigorous evaluation, relying excessively on machine-generated output risks undermining our innate capacity for deep contemplation.",
        ko: "엄밀한 평가 없이 기계가 생성한 결과물에 지나치게 의존하는 것은 우리의 타고난 깊은 사색 능력을 저해할 위험을 초래한다.",
        chunks: [
          { en: "Without rigorous evaluation,", ko: "엄밀한 평가 없이," },
          { en: "relying excessively on machine-generated output", ko: "기계 생성 결과물에 과도하게 의존하는 것은" },
          { en: "risks undermining our innate capacity", ko: "우리의 타고난 능력을 훼손할 위험이 있다" },
          { en: "for deep contemplation.", ko: "깊은 사색을 위한." }
        ],
        grammar: [
          {
            target: "relying excessively on ... risks",
            term: "동명사 주어와 수일치",
            type: "subj",
            note: "주어가 동명사구(relying ...)이므로 단수 취급하여 본동사에 단수형 risks(-s)가 붙었습니다."
          },
          {
            target: "risks undermining",
            term: "risk + 동명사 목적어",
            type: "part",
            note: "동사 risk는 to부정사가 아닌 동명사(-ing)를 목적어로 취합니다. (~할 위험을 무릅쓰다)"
          }
        ],
        words: [
          { word: "rigorous", pos: "adj.", meaning: "엄격한, 철저한", phonetic: "/ˈrɪɡərəs/" },
          { word: "excessively", pos: "adv.", meaning: "지나치게, 과도하게", phonetic: "/ɪkˈsesɪvli/" },
          { word: "undermine", pos: "v.", meaning: "약화시키다, 훼손하다", phonetic: "/ˌʌndərˈmaɪn/" },
          { word: "innate", pos: "adj.", meaning: "타고난, 선천적인", phonetic: "/ɪˈneɪt/" },
          { word: "contemplation", pos: "n.", meaning: "사색, 명상, 숙고", phonetic: "/ˌkɑːntəmˈpleɪʃn/" }
        ]
      }
    ],
    paraphrased: "As automated intelligence rapidly aggregates global knowledge, students are challenged to transcend basic information recall. Instead, they must develop sophisticated evaluative thinking to filter synthetic misinformation and preserve their personal reasoning faculties.",
    paraphrasedKo: "자동화된 인공지능이 전 세계 지식을 신속하게 모아줌에 따라, 학생들은 단순한 정보 회상을 뛰어넘도록 요구받고 있다. 대신 그들은 인공적인 오정보를 걸러내고 자신의 독자적 추론 능력을 지키기 위해 정교한 평가적 사고를 발전시켜야 한다.",
    variations: [
      {
        type: "grammar",
        title: "[어법상 틀린 것 찾기] 수능 실전형",
        instruction: "다음 글의 밑줄 친 부분 중, 어법상 틀린 것을 고르시오.",
        passageWithUnderlines: "As generative artificial intelligence becomes capable of synthesizing vast textual data, learners must cultivate critical discernment ①<u>to distinguish</u> algorithmic hallucinations from verified truths. Without rigorous evaluation, relying excessively on machine-generated output ②<u>risk</u> undermining our innate capacity for deep contemplation, ③<u>which</u> is essential for philosophical inquiry. Thus, human insight remains ④<u>irreplaceable</u> in an era dominated by ⑤<u>automated</u> computation.",
        options: [
          "① to distinguish : 목적을 나타내는 올바른 to부정사",
          "② risk : 동명사 주어(relying)에 호응하므로 단수 동사 risks로 고쳐야 함",
          "③ which : 앞 문장 전체나 선행사를 수식하는 올바른 관계대명사",
          "④ irreplaceable : 보어 자리에 온 올바른 형용사",
          "⑤ automated : 계산(computation)을 수식하는 올바른 과거분사"
        ],
        correctIndex: 1,
        explanation: "②번: 문장의 주어는 동명사구인 'relying excessively on machine-generated output'입니다. 동명사 주어는 단수 취급하므로 동사원형 risk가 아니라 3인칭 단수형인 **risks**가 되어야 합니다."
      },
      {
        type: "blank",
        title: "[빈칸 추론] 핵심 논지 파악",
        instruction: "다음 글의 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.",
        passageWithBlank: "With AI tools readily generating cohesive texts on demand, the primary educational objective must shift. The priority is no longer about accumulating raw data, but rather about equipping individuals with the ability to _______________________________________.",
        options: [
          "① critically scrutinize and validate automated assertions",
          "② produce longer computer codes in a shorter timeframe",
          "③ memorize vast historical archives without mechanical aids",
          "④ accept AI recommendations without skepticism"
        ],
        correctIndex: 0,
        explanation: "정답 ①번: 본문은 AI가 정보를 생산하는 시대에는 단순 암기가 아니라, AI 결과물의 진위와 오류를 판별하는 '비판적 분별력(critical discernment)'이 필요하다고 강조합니다. 따라서 '자동 생성된 주장을 비판적으로 검토하고 입증하는 능력(critically scrutinize and validate automated assertions)'이 정답입니다."
      },
      {
        type: "order",
        title: "[글의 순서 배열] 흐름 일관성",
        instruction: "주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시오.",
        givenSentence: "As generative artificial intelligence becomes capable of synthesizing vast oceans of textual data within seconds, the nature of human intellectual work is fundamentally transforming.",
        paragraphs: {
          A: "Without rigorous evaluation, relying excessively on machine-generated output risks undermining our innate capacity for deep contemplation.",
          B: "Rather than passively memorizing facts, learners must now cultivate critical discernment to distinguish algorithmic hallucinations from verified truths.",
          C: "Therefore, educational frameworks must prioritize analytical judgment over mechanical rote learning."
        },
        options: [
          "① (A) - (C) - (B)",
          "② (B) - (A) - (C)",
          "③ (C) - (A) - (B)",
          "④ (B) - (C) - (A)"
        ],
        correctIndex: 1,
        explanation: "정답 ②번 (B) - (A) - (C):\n- 주어진 글: 생성형 AI로 인해 인간 지적 노동의 본질이 바뀜.\n- (B): 이에 따라 단순 암기 대신 '비판적 분별력'을 길러야 함을 제시.\n- (A): 검증 없이 기계에 의존할 때 겪게 되는 부작용(사색 능력 훼손)을 경고.\n- (C): 'Therefore'로 논지를 매듭지으며 교육 제도가 분석적 판단을 우선시해야 한다고 결론."
      }
    ]
  },
  {
    id: "ebs-2024-eco",
    title: "상호의존적 생태계와 생물 다양성의 복원력",
    source: "EBS 수능특강 연계 변형 / 환경 생태학",
    category: "자연·환경",
    difficulty: "중간 난도",
    badgeColor: "emerald",
    summary: "생태계 내 한 종의 소멸은 단순한 개체수 감소를 넘어 먹이사슬 전체의 연쇄 반응을 촉발하여 전체 시스템의 항상성을 무너뜨릴 수 있다.",
    sentences: [
      {
        id: "s1",
        en: "Ecosystems are intricate webs of mutual dependence where the disappearance of a single keystone species can trigger an unpredictable cascade effect.",
        ko: "생태계는 단 하나의 핵심종이 사라지는 것만으로도 예측 불가능한 연쇄 반응을 촉발할 수 있는 상호의존의 복잡한 그물망이다.",
        chunks: [
          { en: "Ecosystems are intricate webs of mutual dependence", ko: "생태계는 상호의존의 복잡한 그물망이다" },
          { en: "where the disappearance of a single keystone species", ko: "단 하나의 핵심종의 소멸이" },
          { en: "can trigger an unpredictable cascade effect.", ko: "예측할 수 없는 연쇄 반응을 촉발할 수 있는." }
        ],
        grammar: [
          {
            target: "where the disappearance ... can trigger",
            term: "관계부사 where",
            type: "rel",
            note: "추상적인 공간/상황을 나타내는 선행사 'intricate webs'를 뒤에서 수식하는 완전한 절을 이끄는 관계부사입니다."
          },
          {
            target: "unpredictable cascade effect",
            term: "명사 수식 어휘",
            type: "mod",
            note: "cascade effect(폭포수처럼 쏟아지는 연쇄 효과)를 형용사 unpredictable(예측할 수 없는)이 수식합니다."
          }
        ],
        words: [
          { word: "intricate", pos: "adj.", meaning: "복잡한, 정교한", phonetic: "/ˈɪntrɪkət/" },
          { word: "mutual", pos: "adj.", meaning: "상호간의, 서로의", phonetic: "/ˈmjuːtʃuəl/" },
          { word: "keystone", pos: "n.", meaning: "쐐기돌, 핵심, 중추", phonetic: "/ˈkiːstoʊn/" },
          { word: "trigger", pos: "v.", meaning: "촉발하다, 유발하다", phonetic: "/ˈtrɪɡər/" },
          { word: "cascade", pos: "n.", meaning: "연쇄 반응, 작은 폭포", phonetic: "/kæˈskeɪd/" }
        ]
      },
      {
        id: "s2",
        en: "When apex predators are systematically eliminated, herbivore populations proliferate unchecked, ultimately devastating the vegetative landscape.",
        ko: "최상위 포식자들이 조직적으로 제거되면, 초식동물 개체수가 억제되지 않은 채 급증하여, 결국 식물 환경을 황폐화시킨다.",
        chunks: [
          { en: "When apex predators are systematically eliminated,", ko: "최상위 포식자가 체계적으로 제거될 때," },
          { en: "herbivore populations proliferate unchecked,", ko: "초식동물 개체수는 통제되지 않은 채 급증하고," },
          { en: "ultimately devastating the vegetative landscape.", ko: "결국 식물 경관을 황폐화시킨다." }
        ],
        grammar: [
          {
            target: "are systematically eliminated",
            term: "수동태 (be + p.p.)",
            type: "voice",
            note: "포식자들이 인위적으로 '제거되는' 수동 관계이므로 수동태가 쓰였으며, 부사 systematically가 수식합니다."
          },
          {
            target: "ultimately devastating",
            term: "분사구문 (결과)",
            type: "part",
            note: "and they ultimately devastate를 능동 분사구문으로 전환한 형태입니다. (앞 절의 결과로 황폐화시키다)"
          }
        ],
        words: [
          { word: "apex predator", pos: "n.", meaning: "최상위 포식자", phonetic: "/ˈeɪpeks ˈpredətər/" },
          { word: "herbivore", pos: "n.", meaning: "초식동물", phonetic: "/ˈhɜːrbɪvɔːr/" },
          { word: "proliferate", pos: "v.", meaning: "급증하다, 증식하다", phonetic: "/prəˈlɪfəreɪt/" },
          { word: "unchecked", pos: "adj.", meaning: "억제되지 않은", phonetic: "/ʌnˈtʃekt/" },
          { word: "devastate", pos: "v.", meaning: "황폐화시키다", phonetic: "/ˈdevəsteɪt/" }
        ]
      },
      {
        id: "s3",
        en: "Preserving biodiversity is therefore not merely an aesthetic choice, but a fundamental imperative for safeguarding planetary stability.",
        ko: "그러므로 생물 다양성을 보존하는 것은 단지 미적인 선택에 불과한 것이 아니라, 지구의 안정성을 지키기 위한 근본적인 필수 과제이다.",
        chunks: [
          { en: "Preserving biodiversity is therefore", ko: "생물 다양성을 보존하는 것은 따라서" },
          { en: "not merely an aesthetic choice,", ko: "단지 미적인 선택일 뿐만 아니라," },
          { en: "but a fundamental imperative", ko: "근본적인 필수 과제이다" },
          { en: "for safeguarding planetary stability.", ko: "지구의 안정성을 보호하기 위한." }
        ],
        grammar: [
          {
            target: "Preserving biodiversity is",
            term: "동명사 주어",
            type: "subj",
            note: "동명사구 Preserving biodiversity가 주어이므로 단수 동사 is와 연결됩니다."
          },
          {
            target: "not merely A, but B",
            term: "상관접속사 (not only A but also B)",
            type: "syntax",
            note: "'A뿐만 아니라 B도'라는 의미로 merely는 only와 동의어로 자주 출제됩니다."
          },
          {
            target: "for safeguarding",
            term: "전치사 + 동명사",
            type: "part",
            note: "전치사 for 뒤에 목적어로 동명사 safeguarding이 사용되었습니다."
          }
        ],
        words: [
          { word: "biodiversity", pos: "n.", meaning: "생물 다양성", phonetic: "/ˌbaɪoʊdaɪˈvɜːrsəti/" },
          { word: "aesthetic", pos: "adj.", meaning: "미적인, 심미적인", phonetic: "/esˈθetɪk/" },
          { word: "imperative", pos: "n.", meaning: "필수 과제, 명령", phonetic: "/ɪmˈperətɪv/" },
          { word: "safeguard", pos: "v.", meaning: "보호하다, 수호하다", phonetic: "/ˈseɪfɡɑːrd/" },
          { word: "stability", pos: "n.", meaning: "안정성", phonetic: "/stəˈbɪləti/" }
        ]
      }
    ],
    paraphrased: "Natural habitats function as interconnected networks where top organisms regulate population balances. When essential species decline, consumer organisms multiply without constraint and degrade regional flora, demonstrating that biological conservation is crucial for planetary equilibrium.",
    paraphrasedKo: "자연 서식지는 최상위 유기체가 개체수 균형을 조절하는 상호 연결된 네트워크로 기능한다. 필수 종이 감소하면 소비자 유기체가 제약 없이 번식하여 지역 식물군을 퇴화시키며, 이는 생물학적 보존이 지구의 평형을 위해 필수적임을 입증한다.",
    variations: [
      {
        type: "grammar",
        title: "[어법상 틀린 것 찾기] 관계사 및 분사구문",
        instruction: "다음 글의 밑줄 친 부분 중, 어법상 틀린 것을 고르시오.",
        passageWithUnderlines: "Ecosystems are intricate webs of mutual dependence ①<u>where</u> the disappearance of a single keystone species can trigger an unpredictable cascade effect. When apex predators are removed, herbivore populations proliferate unchecked, ultimately ②<u>devastating</u> the vegetative landscape. Preserving biodiversity is therefore not merely an aesthetic choice, but an urgent imperative for ③<u>safeguard</u> planetary equilibrium. Every organism, no matter how small, ④<u>contributes</u> to this delicate balance ⑤<u>sustained</u> by millions of years of evolution.",
        options: [
          "① where : 뒷 문장이 완전하므로 올바른 관계부사",
          "② devastating : 앞 절의 결과를 나타내는 올바른 능동 분사구문",
          "③ safeguard : 전치사 for의 목적어 자리이므로 동명사 safeguarding으로 고쳐야 함",
          "④ contributes : Every organism(단수)에 수일치한 올바른 단수 동사",
          "⑤ sustained : balance를 수동으로 수식하는 올바른 과거분사"
        ],
        correctIndex: 2,
        explanation: "③번: 전치사 'for'의 목적어로 동사원형 safeguard가 올 수 없습니다. 전치사의 목적어 자리에는 명사나 동명사가 와야 하므로 **safeguarding**으로 고쳐야 어법상 올바릅니다."
      },
      {
        type: "blank",
        title: "[빈칸 추론] 유기적 상관관계",
        instruction: "다음 글의 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.",
        passageWithBlank: "Ecosystems are tightly woven tapestries of survival. The removal of a keystone predator does not merely affect its immediate prey; rather, it sets off chain reactions that disrupt vegetation and topography. This demonstrates that biodiversity is _______________________________________.",
        options: [
          "① a secondary concern easily replaced by technological innovations",
          "② an indispensable structural pillar preserving the entire systemic balance",
          "③ solely beneficial for agricultural productivity in rural zones",
          "④ an independent phenomenon detached from predator-prey dynamics"
        ],
        correctIndex: 1,
        explanation: "정답 ②번: 글은 한 종(핵심종)의 소멸이 생태계 전반의 연쇄 붕괴를 일으킨다고 설명하므로, 생물 다양성이 전체 체계의 균형을 지탱하는 '필수불가결한 구조적 기둥(an indispensable structural pillar preserving the entire systemic balance)'이라는 보기가 가장 자연스럽습니다."
      },
      {
        type: "order",
        title: "[글의 순서 배열] 원인과 결과",
        instruction: "주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시오.",
        givenSentence: "Ecosystems are intricate webs of mutual dependence where the disappearance of a single keystone species can trigger an unpredictable cascade effect.",
        paragraphs: {
          A: "Preserving biodiversity is therefore not merely an aesthetic choice, but a fundamental imperative for safeguarding planetary stability.",
          B: "For instance, when apex predators are systematically eliminated, herbivore populations proliferate unchecked, ultimately devastating the vegetative landscape.",
          C: "Such widespread destruction cascades further down, eroding soil stability and diminishing water retention capacities across the biome."
        },
        options: [
          "① (B) - (C) - (A)",
          "② (A) - (B) - (C)",
          "③ (C) - (A) - (B)",
          "④ (B) - (A) - (C)"
        ],
        correctIndex: 0,
        explanation: "정답 ①번 (B) - (C) - (A):\n- 주어진 글: 핵심종 하나의 소멸이 생태계 전체의 연쇄 반응을 일으킴.\n- (B): For instance(예를 들어)를 통해 최상위 포식자가 사라질 때 초식동물 폭증과 식물 파괴의 구체적 사례 제시.\n- (C): Such widespread destruction(그러한 광범위한 파괴)으로 (B)의 식물 파괴를 받아 토양 침식 등 더 깊은 연쇄 피해 설명.\n- (A): 따라서(Therefore) 생물 다양성 보존은 필수 과제라는 결론으로 마무리."
      }
    ]
  }
];

// 사용자 직접 입력 지문을 파싱하는 클라이언트 스마트 분석 엔진
function parseCustomPassage(rawText, title = "사용자 직접 입력 지문") {
  if (!rawText || !rawText.trim()) return null;

  // 문장 분리 정규식 (마침표, 물음표, 느낌표 기준 분리)
  const rawSentences = rawText
    .replace(/([.?!])\s*(?=[A-Z0-9"'])/g, "$1|SPLIT|")
    .split("|SPLIT|")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const sentences = rawSentences.map((sentenceStr, idx) => {
    // 자동 단어 추출
    const wordsRaw = sentenceStr
      .replace(/[^\w\s-]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 2);

    // 고유 단어 추출 (상위 5~8개)
    const uniqueWords = [...new Set(wordsRaw.map(w => w.toLowerCase()))].slice(0, 8);
    const words = uniqueWords.map(w => {
      // dict.js 가 로드되어 있으면 어휘 검색
      let dictEntry = null;
      if (typeof findDictEntry === "function") {
        dictEntry = findDictEntry(w);
      }
      return {
        word: w,
        pos: dictEntry ? dictEntry.pos : "단어",
        meaning: dictEntry ? dictEntry.meaning : "터치하여 사전 검색 & 저장",
        phonetic: dictEntry ? dictEntry.phonetic : ""
      };
    });

    // 자동 의미단위 분할 (쉼표, 접속사, 관계사 기준)
    const chunkTokens = sentenceStr.split(/(,\s*|\b(?:that|which|who|whom|whose|where|when|while|although|because|since|if|unless|and|but|or)\b\s*)/i);
    const chunks = [];
    let cur = "";
    for (let token of chunkTokens) {
      if (!token) continue;
      cur += token;
      if (cur.length > 25 || token.includes(",")) {
        chunks.push({ en: cur.trim(), ko: "(직독직해 연습)" });
        cur = "";
      }
    }
    if (cur.trim()) {
      chunks.push({ en: cur.trim(), ko: "(직독직해 연습)" });
    }
    if (chunks.length === 0) {
      chunks.push({ en: sentenceStr, ko: "(직독직해 연습)" });
    }

    // 어법 탐지 (규칙 기반)
    const grammar = [];
    if (/\b(that|which|who|whom|whose)\b/i.test(sentenceStr)) {
      const match = sentenceStr.match(/\b(that|which|who|whom|whose)\b\w*/i);
      grammar.push({
        target: match ? match[0] : "관계사",
        term: "관계사절",
        type: "rel",
        note: "선행사를 수식하거나 보충 설명하는 관계사 구문입니다. 수능 빈출 포인트!"
      });
    }
    if (/\b(is|are|was|were|been|be)\s+([a-z]+ed|[a-z]+en)\b/i.test(sentenceStr)) {
      const match = sentenceStr.match(/\b(is|are|was|were|been|be)\s+([a-z]+ed|[a-z]+en)\b/i);
      grammar.push({
        target: match ? match[0] : "be + p.p.",
        term: "수동태",
        type: "voice",
        note: "주어가 행위의 주체가 아니라 '대상이 되어 영향을 받는' 수동 관계입니다."
      });
    }
    if (/\b(to\s+[a-z]{3,})\b/i.test(sentenceStr)) {
      const match = sentenceStr.match(/\b(to\s+[a-z]{3,})\b/i);
      grammar.push({
        target: match ? match[0] : "to부정사",
        term: "to부정사 구문",
        type: "toinf",
        note: "명사적/형용사적/부사적 용법으로 주어, 목적어, 보어 또는 목적을 나타냅니다."
      });
    }

    return {
      id: "cust-s" + (idx + 1),
      en: sentenceStr,
      ko: `[${idx + 1}번 문장 번역] 직독직해 모드 또는 사전을 활용해 해석해 보세요.`,
      chunks: chunks,
      grammar: grammar.length > 0 ? grammar : [
        {
          target: sentenceStr.slice(0, 20) + "...",
          term: "구문 분석",
          type: "syntax",
          note: "주어와 본동사를 찾고 수식 어구를 괄호로 묶어 문장의 뼈대를 파악하세요."
        }
      ],
      words: words
    };
  });

  return {
    id: "custom-" + Date.now(),
    title: title,
    source: "직접 입력한 지문",
    category: "자율 학습",
    difficulty: "사용자 맞춤",
    badgeColor: "amber",
    summary: rawSentences[0] ? rawSentences[0].slice(0, 80) + "..." : "입력된 사용자 지문입니다.",
    sentences: sentences,
    paraphrased: "Paraphrased version: " + rawSentences.map(s => s.replace(/\bvery\b/gi, "extremely").replace(/\bgood\b/gi, "favorable")).join(" "),
    paraphrasedKo: "핵심 어휘와 구조를 다듬어 재구성한 독해 확장용 유사 지문입니다.",
    variations: [
      {
        type: "blank",
        title: "[자율 변형 문제] 핵심 어휘 빈칸 추론",
        instruction: "다음 글의 빈칸에 들어갈 가장 알맞은 어휘를 고르시오.",
        passageWithBlank: rawSentences[0] ? rawSentences[0].replace(/\b([a-zA-Z]{5,})\b/, "__________ ($1)") : "No sentence available",
        options: [
          "① 원문 핵심 단어 (정답)",
          "② 반의어 또는 왜곡된 어휘",
          "③ 문맥상 무관한 어휘",
          "④ 지나치게 지엽적인 표현"
        ],
        correctIndex: 0,
        explanation: "문장의 논리적 흐름과 전후 수식어구의 호응 관계를 바탕으로 빈칸을 추론합니다."
      }
    ]
  };
}

// 기본 저장된 단어장 예시 (수능 빈출 어휘)
const INITIAL_VOCABULARY = [
  {
    id: "v1",
    word: "discernment",
    pos: "n.",
    meaning: "분별력, 안목",
    phonetic: "/dɪˈsɜːrnmənt/",
    example: "Cultivate critical discernment to distinguish truth from error.",
    memorized: false,
    savedAt: "2026-09-23"
  },
  {
    id: "v2",
    word: "cognitive",
    pos: "adj.",
    meaning: "인지의, 인식의",
    phonetic: "/ˈkɑːɡnətɪv/",
    example: "The brain minimizes cognitive load through habit formation.",
    memorized: false,
    savedAt: "2026-09-23"
  },
  {
    id: "v3",
    word: "undermine",
    pos: "v.",
    meaning: "약화시키다, 훼손하다",
    phonetic: "/ˌʌndərˈmaɪn/",
    example: "Over-reliance risks undermining human contemplation.",
    memorized: true,
    savedAt: "2026-09-23"
  },
  {
    id: "v4",
    word: "keystone",
    pos: "n.",
    meaning: "핵심, 중추 (핵심종)",
    phonetic: "/ˈkiːstoʊn/",
    example: "The disappearance of a keystone species causes cascade effects.",
    memorized: false,
    savedAt: "2026-09-23"
  }
];
