// dict.js - PocketPassage 수능/모의고사 고빈출 영한사전 & 실시간 번역 엔진

const BUILTIN_DICT = {
  // 지문 내 등장 모든 단어 및 수능 고빈출 필수 어휘
  "human": { pos: "n./adj.", meaning: "인간의, 사람, 인간", phonetic: "/ˈhjuːmən/" },
  "brain": { pos: "n.", meaning: "뇌, 두뇌, 지능", phonetic: "/breɪn/" },
  "extraordinary": { pos: "adj.", meaning: "놀라운, 비범한, 특이한", phonetic: "/ɪkˈstrɔːrdəneri/" },
  "organ": { pos: "n.", meaning: "기관, 장기, 음성 기관", phonetic: "/ˈɔːrɡən/" },
  "constantly": { pos: "adv.", meaning: "끊임없이, 지속적으로", phonetic: "/ˈkɑːnstəntli/" },
  "constant": { pos: "adj.", meaning: "지속적인, 끊임없는", phonetic: "/ˈkɑːnstənt/" },
  "seek": { pos: "v.", meaning: "추구하다, 찾다, 시도하다", phonetic: "/siːk/" },
  "seeks": { pos: "v.", meaning: "추구하다 (3인칭 단수)", phonetic: "/siːks/" },
  "sought": { pos: "v.", meaning: "추구했다 (과거/과거분사)", phonetic: "/sɔːt/" },
  "minimize": { pos: "v.", meaning: "최소화하다, 축소하다", phonetic: "/ˈmɪnɪmaɪz/" },
  "cognitive": { pos: "adj.", meaning: "인지적인, 인식의", phonetic: "/ˈkɑːɡnətɪv/" },
  "cognition": { pos: "n.", meaning: "인지, 인식", phonetic: "/kɑːɡˈnɪʃn/" },
  "load": { pos: "n./v.", meaning: "부담, 짐, 적재량; 싣다", phonetic: "/loʊd/" },
  "automate": { pos: "v.", meaning: "자동화하다", phonetic: "/ˈɔːtəmeɪt/" },
  "automating": { pos: "v.", meaning: "자동화하는 것 (동명사/현재분사)", phonetic: "/ˈɔːtəmeɪtɪŋ/" },
  "automated": { pos: "adj.", meaning: "자동화된", phonetic: "/ˈɔːtəmeɪtɪd/" },
  "automation": { pos: "n.", meaning: "자동화", phonetic: "/ˌɔːtəˈmeɪʃn/" },
  "repetitive": { pos: "adj.", meaning: "반복적인", phonetic: "/rɪˈpetətɪv/" },
  "repeat": { pos: "v.", meaning: "반복하다, 되풀이하다", phonetic: "/rɪˈpiːt/" },
  "repeatedly": { pos: "adv.", meaning: "반복하여, 거듭해서", phonetic: "/rɪˈpiːtɪdli/" },
  "behavioral": { pos: "adj.", meaning: "행동의, 행동에 관한", phonetic: "/bɪˈheɪvjərəl/" },
  "behavior": { pos: "n.", meaning: "행동, 태도, 품행", phonetic: "/bɪˈheɪvjər/" },
  "sequence": { pos: "n.", meaning: "연속, 순서, 배열", phonetic: "/ˈsiːkwəns/" },
  "sequences": { pos: "n.", meaning: "순서들, 일련의 과정들", phonetic: "/ˈsiːkwənsɪz/" },
  "particular": { pos: "adj.", meaning: "특정한, 특별한", phonetic: "/pərˈtɪkjələr/" },
  "routine": { pos: "n./adj.", meaning: "루틴, 판에 박힌 일, 일과", phonetic: "/ruːˈtiːn/" },
  "practice": { pos: "v./n.", meaning: "연습하다, 실천하다; 관행", phonetic: "/ˈpræktɪs/" },
  "practiced": { pos: "adj.", meaning: "숙련된, 연습된", phonetic: "/ˈpræktɪst/" },
  "basal": { pos: "adj.", meaning: "기저의, 기초의", phonetic: "/ˈbeɪsl/" },
  "ganglia": { pos: "n.", meaning: "신경절 (기저핵)", phonetic: "/ˈɡæŋɡliə/" },
  "primitive": { pos: "adj.", meaning: "원시의, 기초적인", phonetic: "/ˈprɪmətɪv/" },
  "structure": { pos: "n.", meaning: "구조, 건축물, 체계", phonetic: "/ˈstrʌktʃər/" },
  "deep": { pos: "adj./adv.", meaning: "깊은, 깊숙이", phonetic: "/diːp/" },
  "within": { pos: "prep.", meaning: "~내부에, ~이내에", phonetic: "/wɪˈðɪn/" },
  "gradually": { pos: "adv.", meaning: "점차, 서서히", phonetic: "/ˈɡrædʒuəli/" },
  "gradual": { pos: "adj.", meaning: "점진적인", phonetic: "/ˈɡrædʒuəl/" },
  "take over": { pos: "idiom", meaning: "인계받다, 장악하다, 떠맡다", phonetic: "/teɪk ˈoʊvər/" },
  "takes over": { pos: "idiom", meaning: "인계받는다 (3인칭 단수)", phonetic: "/teɪks ˈoʊvər/" },
  "prefrontal": { pos: "adj.", meaning: "전두엽의", phonetic: "/priːˈfrʌntl/" },
  "cortex": { pos: "n.", meaning: "피질(대뇌 피질)", phonetic: "/ˈkɔːrteks/" },
  "neurobiological": { pos: "adj.", meaning: "신경생물학의", phonetic: "/ˌnʊroʊbaɪəˈlɑːdʒɪkl/" },
  "shift": { pos: "n./v.", meaning: "전환, 변화; 이동하다", phonetic: "/ʃɪft/" },
  "known": { pos: "adj.", meaning: "알려진, 유명한", phonetic: "/noʊn/" },
  "chunking": { pos: "n.", meaning: "청킹 (정보 덩어리 묶기)", phonetic: "/ˈtʃʌŋkɪŋ/" },
  "chunk": { pos: "n./v.", meaning: "덩어리; 덩어리로 묶다", phonetic: "/tʃʌŋk/" },
  "allow": { pos: "v.", meaning: "허용하다, 가능하게 하다", phonetic: "/əˈlaʊ/" },
  "allows": { pos: "v.", meaning: "허용한다 (3인칭 단수)", phonetic: "/əˈlaʊz/" },
  "complex": { pos: "adj./n.", meaning: "복잡한; 복합체", phonetic: "/kəmˈpleks/" },
  "execute": { pos: "v.", meaning: "실행하다, 수행하다, 집행하다", phonetic: "/ˈeksɪkjuːt/" },
  "executed": { pos: "adj.", meaning: "실행된, 집행된", phonetic: "/ˈeksɪkjuːtɪd/" },
  "execution": { pos: "n.", meaning: "실행, 수행, 처형", phonetic: "/ˌeksɪˈkjuːʃn/" },
  "minimal": { pos: "adj.", meaning: "최소의, 아주 적은", phonetic: "/ˈmɪnɪml/" },
  "conscious": { pos: "adj.", meaning: "의식하는, 자각하는", phonetic: "/ˈkɑːnʃəs/" },
  "effort": { pos: "n.", meaning: "노력, 수고", phonetic: "/ˈefərt/" },
  "consequently": { pos: "adv.", meaning: "결과적으로, 따라서", phonetic: "/ˈkɑːnsəkwentli/" },
  "consequence": { pos: "n.", meaning: "결과, 영향, 중요성", phonetic: "/ˈkɑːnsəkwens/" },
  "mental": { pos: "adj.", meaning: "정신의, 마음의", phonetic: "/ˈmentl/" },
  "capacity": { pos: "n.", meaning: "용량, 능력, 수용력", phonetic: "/kəˈpæsəti/" },
  "preserve": { pos: "v.", meaning: "보존하다, 지키다, 보호하다", phonetic: "/prɪˈzɜːrv/" },
  "preserved": { pos: "adj.", meaning: "보존된", phonetic: "/prɪˈzɜːrvd/" },
  "preservation": { pos: "n.", meaning: "보존, 보호", phonetic: "/ˌprezərˈveɪʃn/" },
  "unexpected": { pos: "adj.", meaning: "예상치 못한, 뜻밖의", phonetic: "/ˌʌnɪkˈspektɪd/" },
  "challenge": { pos: "n./v.", meaning: "도전 과제, 난제; 도전하다", phonetic: "/ˈtʃælɪndʒ/" },
  "require": { pos: "v.", meaning: "요구하다, 필요로 하다", phonetic: "/rɪˈkwaɪər/" },
  "requires": { pos: "v.", meaning: "요구한다 (3인칭 단수)", phonetic: "/rɪˈkwaɪərz/" },
  "requirement": { pos: "n.", meaning: "필요조건, 요구사항", phonetic: "/rɪˈkwaɪərmənt/" },
  "critical": { pos: "adj.", meaning: "비판적인, 결정적인, 중대한", phonetic: "/ˈkrɪtɪkl/" },
  "analysis": { pos: "n.", meaning: "분석, 검토", phonetic: "/əˈnæləsɪs/" },
  "analyze": { pos: "v.", meaning: "분석하다", phonetic: "/ˈænəlaɪz/" },
  "deliberate": { pos: "adj./v.", meaning: "신중한, 고의적인; 숙고하다", phonetic: "/dɪˈlɪbərət/" },
  "deliberation": { pos: "n.", meaning: "심사숙고, 협의", phonetic: "/dɪˌlɪbəˈreɪʃn/" },

  // AI & 인지 관련 어휘
  "generative": { pos: "adj.", meaning: "생성하는, 생성적인", phonetic: "/ˈdʒenərətɪv/" },
  "generate": { pos: "v.", meaning: "생성하다, 발생시키다", phonetic: "/ˈdʒenəreɪt/" },
  "artificial": { pos: "adj.", meaning: "인공의, 인위적인", phonetic: "/ˌɑːrtɪˈfɪʃl/" },
  "intelligence": { pos: "n.", meaning: "지능, 지성, 정보", phonetic: "/ɪnˈtelɪdʒəns/" },
  "capable": { pos: "adj.", meaning: "~할 능력이 있는, 유능한", phonetic: "/ˈkeɪpəbl/" },
  "synthesize": { pos: "v.", meaning: "종합하다, 합성하다", phonetic: "/ˈsɪnθəsaɪz/" },
  "synthesizing": { pos: "v.", meaning: "종합하는 것", phonetic: "/ˈsɪnθəsaɪzɪŋ/" },
  "synthesis": { pos: "n.", meaning: "종합, 합성", phonetic: "/ˈsɪnθəsɪs/" },
  "vast": { pos: "adj.", meaning: "방대한, 거대한, 광활한", phonetic: "/væst/" },
  "ocean": { pos: "n.", meaning: "바다, 해양, 방대한 양", phonetic: "/ˈoʊʃn/" },
  "textual": { pos: "adj.", meaning: "텍스트의, 문서의", phonetic: "/ˈtekstʃuəl/" },
  "data": { pos: "n.", meaning: "데이터, 자료", phonetic: "/ˈdeɪtə/" },
  "second": { pos: "n./adj.", meaning: "초(시간); 두 번째의", phonetic: "/ˈsekənd/" },
  "nature": { pos: "n.", meaning: "본질, 성격, 자연", phonetic: "/ˈneɪtʃər/" },
  "intellectual": { pos: "adj./n.", meaning: "지적인; 지식인", phonetic: "/ˌɪntəˈlektʃuəl/" },
  "intellect": { pos: "n.", meaning: "지성, 지적 능력", phonetic: "/ˈɪntəlekt/" },
  "fundamentally": { pos: "adv.", meaning: "근본적으로, 기본적으로", phonetic: "/ˌfʌndəˈmentəli/" },
  "fundamental": { pos: "adj.", meaning: "근본적인, 핵심적인", phonetic: "/ˌfʌndəˈmentl/" },
  "transform": { pos: "v.", meaning: "변형시키다, 탈바꿈하다", phonetic: "/trænsˈfɔːrm/" },
  "transforming": { pos: "v.", meaning: "변모하고 있는", phonetic: "/trænsˈfɔːrmɪŋ/" },
  "transformation": { pos: "n.", meaning: "변화, 변신", phonetic: "/ˌtrænsfərˈmeɪʃn/" },
  "rather than": { pos: "conj.", meaning: "~하기보다는, 대신에", phonetic: "/ˈræðər ðæn/" },
  "passively": { pos: "adv.", meaning: "수동적으로, 소극적으로", phonetic: "/ˈpæsɪvli/" },
  "passive": { pos: "adj.", meaning: "수동적인, 소극적인", phonetic: "/ˈpæsɪv/" },
  "memorize": { pos: "v.", meaning: "암기하다, 기억하다", phonetic: "/ˈmeməraɪz/" },
  "memorizing": { pos: "v.", meaning: "암기하는 것", phonetic: "/ˈmeməraɪzɪŋ/" },
  "fact": { pos: "n.", meaning: "사실, 진실", phonetic: "/fækt/" },
  "learner": { pos: "n.", meaning: "학습자, 배우는 사람", phonetic: "/ˈlɜːrnər/" },
  "cultivate": { pos: "v.", meaning: "함양하다, 기르다, 경작하다", phonetic: "/ˈkʌltɪveɪt/" },
  "discernment": { pos: "n.", meaning: "분별력, 안목, 통찰", phonetic: "/dɪˈsɜːrnmənt/" },
  "discern": { pos: "v.", meaning: "분별하다, 알아차리다", phonetic: "/dɪˈsɜːrn/" },
  "distinguish": { pos: "v.", meaning: "구별하다, 식별하다", phonetic: "/dɪˈstɪŋɡwɪʃ/" },
  "algorithmic": { pos: "adj.", meaning: "알고리즘의", phonetic: "/ˌælɡəˈrɪðmɪk/" },
  "algorithm": { pos: "n.", meaning: "알고리즘, 문제해결 절차", phonetic: "/ˈælɡərɪðəm/" },
  "hallucination": { pos: "n.", meaning: "환각, 그럴듯한 오정보", phonetic: "/həˌluːsɪˈneɪʃn/" },
  "verify": { pos: "v.", meaning: "검증하다, 입증하다, 확인하다", phonetic: "/ˈverɪfaɪ/" },
  "verified": { pos: "adj.", meaning: "검증된, 확인된", phonetic: "/ˈverɪfaɪd/" },
  "truth": { pos: "n.", meaning: "진실, 사실", phonetic: "/truːθ/" },
  "rigorous": { pos: "adj.", meaning: "엄격한, 철저한, 엄밀한", phonetic: "/ˈrɪɡərəs/" },
  "evaluation": { pos: "n.", meaning: "평가, 감정", phonetic: "/ɪˌvæljuˈeɪʃn/" },
  "evaluate": { pos: "v.", meaning: "평가하다", phonetic: "/ɪˈvæljueɪt/" },
  "rely": { pos: "v.", meaning: "의존하다, 기대다", phonetic: "/rɪˈlaɪ/" },
  "relying": { pos: "v.", meaning: "의존하는 것", phonetic: "/rɪˈlaɪɪŋ/" },
  "excessively": { pos: "adv.", meaning: "지나치게, 과도하게", phonetic: "/ɪkˈsesɪvli/" },
  "excessive": { pos: "adj.", meaning: "과도한, 지나친", phonetic: "/ɪkˈsesɪv/" },
  "output": { pos: "n.", meaning: "산출물, 결과물, 출력", phonetic: "/ˈaʊtpʊt/" },
  "risk": { pos: "v./n.", meaning: "~할 위험을 무릅쓰다; 위험", phonetic: "/rɪsk/" },
  "risks": { pos: "v.", meaning: "위험을 초래하다 (3인칭 단수)", phonetic: "/rɪsks/" },
  "undermine": { pos: "v.", meaning: "약화시키다, 훼손하다", phonetic: "/ˌʌndərˈmaɪn/" },
  "undermining": { pos: "v.", meaning: "약화시키는 것", phonetic: "/ˌʌndərˈmaɪnɪŋ/" },
  "innate": { pos: "adj.", meaning: "타고난, 선천적인, 고유의", phonetic: "/ɪˈneɪt/" },
  "contemplation": { pos: "n.", meaning: "사색, 명상, 심사숙고", phonetic: "/ˌkɑːntəmˈpleɪʃn/" },
  "contemplate": { pos: "v.", meaning: "숙고하다, 깊이 생각하다", phonetic: "/ˈkɑːntəmpleɪt/" },

  // 생태계 & 환경 어휘
  "ecosystem": { pos: "n.", meaning: "생태계", phonetic: "/ˈiːkoʊsɪstəm/" },
  "intricate": { pos: "adj.", meaning: "복잡한, 정교한", phonetic: "/ˈɪntrɪkət/" },
  "web": { pos: "n.", meaning: "그물망, 거미줄, 망", phonetic: "/web/" },
  "mutual": { pos: "adj.", meaning: "상호간의, 서로의, 공통의", phonetic: "/ˈmjuːtʃuəl/" },
  "dependence": { pos: "n.", meaning: "의존, 의지", phonetic: "/dɪˈpendəns/" },
  "dependent": { pos: "adj.", meaning: "의존하는", phonetic: "/dɪˈpendənt/" },
  "disappearance": { pos: "n.", meaning: "사라짐, 소멸, 실종", phonetic: "/ˌdɪsəˈpɪrəns/" },
  "disappear": { pos: "v.", meaning: "사라지다, 소멸하다", phonetic: "/ˌdɪsəˈpɪr/" },
  "keystone": { pos: "n.", meaning: "핵심, 쐐기돌 (생태계 핵심종)", phonetic: "/ˈkiːstoʊn/" },
  "species": { pos: "n.", meaning: "종(생물학적 종)", phonetic: "/ˈspiːʃiːz/" },
  "trigger": { pos: "v./n.", meaning: "촉발하다, 유발하다; 방아쇠", phonetic: "/ˈtrɪɡər/" },
  "unpredictable": { pos: "adj.", meaning: "예측할 수 없는", phonetic: "/ˌʌnprɪˈdɪktəbl/" },
  "predict": { pos: "v.", meaning: "예측하다, 예견하다", phonetic: "/prɪˈdɪkt/" },
  "cascade": { pos: "n./v.", meaning: "연쇄 반응, 폭포; 쏟아지다", phonetic: "/kæˈskeɪd/" },
  "effect": { pos: "n.", meaning: "효과, 영향, 결과", phonetic: "/ɪˈfekt/" },
  "apex": { pos: "n.", meaning: "정점, 최고조 (최상위)", phonetic: "/ˈeɪpeks/" },
  "predator": { pos: "n.", meaning: "포식자, 육식동물", phonetic: "/ˈpredətər/" },
  "systematically": { pos: "adv.", meaning: "체계적으로, 조직적으로", phonetic: "/ˌsɪstəˈmætɪkli/" },
  "eliminate": { pos: "v.", meaning: "제거하다, 없애다, 배제하다", phonetic: "/ɪˈlɪmɪneɪt/" },
  "eliminated": { pos: "adj.", meaning: "제거된", phonetic: "/ɪˈlɪmɪneɪtɪd/" },
  "herbivore": { pos: "n.", meaning: "초식동물", phonetic: "/ˈhɜːrbɪvɔːr/" },
  "population": { pos: "n.", meaning: "개체수, 인구", phonetic: "/ˌpɑːpjuˈleɪʃn/" },
  "proliferate": { pos: "v.", meaning: "급증하다, 증식하다", phonetic: "/prəˈlɪfəreɪt/" },
  "unchecked": { pos: "adj.", meaning: "억제되지 않은, 통제되지 않은", phonetic: "/ʌnˈtʃekt/" },
  "ultimately": { pos: "adv.", meaning: "궁극적으로, 결국", phonetic: "/ˈʌltɪmətli/" },
  "ultimate": { pos: "adj.", meaning: "궁극적인, 최종의", phonetic: "/ˈʌltɪmət/" },
  "devastate": { pos: "v.", meaning: "황폐화시키다, 파괴하다", phonetic: "/ˈdevəsteɪt/" },
  "devastating": { pos: "adj.", meaning: "파괴적인, 황폐화시키는", phonetic: "/ˈdevəsteɪtɪŋ/" },
  "vegetative": { pos: "adj.", meaning: "식물의, 초목의", phonetic: "/ˈvedʒəteɪtɪv/" },
  "landscape": { pos: "n.", meaning: "경관, 풍경, 지형", phonetic: "/ˈlændskeɪp/" },
  "biodiversity": { pos: "n.", meaning: "생물 다양성", phonetic: "/ˌbaɪoʊdaɪˈvɜːrsəti/" },
  "merely": { pos: "adv.", meaning: "단지, 그저 (~에 불과한)", phonetic: "/ˈmɪrli/" },
  "aesthetic": { pos: "adj.", meaning: "미적인, 심미적인", phonetic: "/esˈθetɪk/" },
  "choice": { pos: "n.", meaning: "선택, 선택권", phonetic: "/tʃɔɪs/" },
  "imperative": { pos: "n./adj.", meaning: "필수 과제, 명령; 반드시 해야 하는", phonetic: "/ɪmˈperətɪv/" },
  "safeguard": { pos: "v./n.", meaning: "보호하다, 수호하다; 안전장치", phonetic: "/ˈseɪfɡɑːrd/" },
  "safeguarding": { pos: "v.", meaning: "보호하는 것", phonetic: "/ˈseɪfɡɑːrdɪŋ/" },
  "planetary": { pos: "adj.", meaning: "지구의, 행성의", phonetic: "/ˈplænəteri/" },
  "planet": { pos: "n.", meaning: "행성, 지구", phonetic: "/ˈplænɪt/" },
  "stability": { pos: "n.", meaning: "안정성, 고정됨", phonetic: "/stəˈbɪləti/" },
  "stable": { pos: "adj.", meaning: "안정된, 견고한", phonetic: "/ˈsteɪbl/" },

  // 일반 기초/수능 빈출 어휘 (관사, 전치사, 접속사, 대명사 등)
  "the": { pos: "art.", meaning: "그 (정관사)", phonetic: "/ðə/" },
  "a": { pos: "art.", meaning: "하나의 (부정관사)", phonetic: "/ə/" },
  "an": { pos: "art.", meaning: "하나의 (모음 앞 부정관사)", phonetic: "/ən/" },
  "is": { pos: "v.", meaning: "~이다, 있다 (3인칭 단수 be동사)", phonetic: "/ɪz/" },
  "are": { pos: "v.", meaning: "~이다, 있다 (복수 be동사)", phonetic: "/ɑːr/" },
  "was": { pos: "v.", meaning: "~이었다 (과거 be동사)", phonetic: "/wʌz/" },
  "were": { pos: "v.", meaning: "~이었다 (복수 과거 be동사)", phonetic: "/wɜːr/" },
  "be": { pos: "v.", meaning: "있다, 존재하다, 되다", phonetic: "/biː/" },
  "been": { pos: "v.", meaning: "있어왔다 (과거분사 be동사)", phonetic: "/bɪn/" },
  "that": { pos: "pron./conj.", meaning: "저것; ~라는 것; 관계대명사", phonetic: "/ðæt/" },
  "this": { pos: "pron./adj.", meaning: "이것, 이", phonetic: "/ðɪs/" },
  "which": { pos: "pron.", meaning: "어느 것; 관계대명사 (~하는 것)", phonetic: "/wɪtʃ/" },
  "who": { pos: "pron.", meaning: "누구; 관계대명사 (~하는 사람)", phonetic: "/huː/" },
  "where": { pos: "adv.", meaning: "어디에; 관계부사 (~하는 곳)", phonetic: "/wer/" },
  "when": { pos: "conj./adv.", meaning: "~할 때; 언제", phonetic: "/wen/" },
  "as": { pos: "conj./prep.", meaning: "~함에 따라, ~로서, ~할 때", phonetic: "/æz/" },
  "by": { pos: "prep.", meaning: "~에 의하여, ~로써, ~옆에", phonetic: "/baɪ/" },
  "for": { pos: "prep.", meaning: "~을 위하여, ~에 대하여, ~동안", phonetic: "/fɔːr/" },
  "with": { pos: "prep.", meaning: "~와 함께, ~을 가지고", phonetic: "/wɪð/" },
  "from": { pos: "prep.", meaning: "~로부터, ~에서", phonetic: "/frʌm/" },
  "to": { pos: "prep./part.", meaning: "~에게, ~로; to부정사 기호", phonetic: "/tuː/" },
  "in": { pos: "prep.", meaning: "~안에, ~에서", phonetic: "/ɪn/" },
  "on": { pos: "prep.", meaning: "~위에, ~에 대하여", phonetic: "/ɑːn/" },
  "of": { pos: "prep.", meaning: "~의, ~에 관한, ~중에서", phonetic: "/ʌv/" },
  "at": { pos: "prep.", meaning: "~에서, ~에", phonetic: "/æt/" },
  "not": { pos: "adv.", meaning: "~아니다, 않다", phonetic: "/nɑːt/" },
  "but": { pos: "conj.", meaning: "그러나, 하지만, ~을 제외하고", phonetic: "/bʌt/" },
  "and": { pos: "conj.", meaning: "그리고, 와/과", phonetic: "/ænd/" },
  "or": { pos: "conj.", meaning: "또는, 혹은", phonetic: "/ɔːr/" },
  "our": { pos: "pron.", meaning: "우리의", phonetic: "/ˈaʊər/" },
  "we": { pos: "pron.", meaning: "우리", phonetic: "/wiː/" },
  "they": { pos: "pron.", meaning: "그들, 그것들", phonetic: "/ðeɪ/" },
  "their": { pos: "pron.", meaning: "그들의, 그것들의", phonetic: "/ðer/" },
  "now": { pos: "adv.", meaning: "지금, 이제", phonetic: "/naʊ/" },
  "must": { pos: "aux.", meaning: "~해야만 한다, ~임에 틀림없다", phonetic: "/mʌst/" },
  "can": { pos: "aux.", meaning: "~할 수 있다", phonetic: "/kæn/" },
  "could": { pos: "aux.", meaning: "~할 수 있었다, ~일 수 있다", phonetic: "/kʊd/" },
  "would": { pos: "aux.", meaning: "~할 것이다, ~하곤 했다", phonetic: "/wʊd/" },
  "should": { pos: "aux.", meaning: "~해야 한다", phonetic: "/ʃʊd/" },
  "therefore": { pos: "adv.", meaning: "그러므로, 따라서", phonetic: "/ˈðerfɔːr/" },
  "thus": { pos: "adv.", meaning: "따라서, 그러므로, 이렇게", phonetic: "/ðʌs/" },
  "however": { pos: "adv.", meaning: "그러나, 하지만", phonetic: "/haʊˈevər/" },
  "moreover": { pos: "adv.", meaning: "더욱이, 게다가", phonetic: "/mɔːrˈoʊvər/" },
  "furthermore": { pos: "adv.", meaning: "뿐만 아니라, 더욱이", phonetic: "/ˈfɜːrðərmɔːr/" },
  "in addition": { pos: "idiom", meaning: "게다가, 덧붙여", phonetic: "/ɪn əˈdɪʃn/" },
  "on the other hand": { pos: "idiom", meaning: "반면에, 다른 한편으로는", phonetic: "/ɑːn ði ˈʌðər hænd/" },
  "in contrast": { pos: "idiom", meaning: "대조적으로, 반대로", phonetic: "/ɪn ˈkɑːntræst/" },
  "for example": { pos: "idiom", meaning: "예를 들어", phonetic: "/fɔːr ɪɡˈzæmpl/" },
  "for instance": { pos: "idiom", meaning: "예컨대, 예를 들면", phonetic: "/fɔːr ˈɪnstəns/" },
  "in conclusion": { pos: "idiom", meaning: "결론적으로", phonetic: "/ɪn kənˈkluːʒn/" }
};

// 어간 추출 및 형태소 복원 헬퍼 (Stemming & Lemmatization)
function findDictEntry(rawWord) {
  if (!rawWord) return null;
  const word = rawWord.trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
  if (!word) return null;

  // 1. 완전 일치
  if (BUILTIN_DICT[word]) {
    return { ...BUILTIN_DICT[word], matchedWord: word };
  }

  // 2. 복수형 / 3인칭 단수 -s, -es 제거
  if (word.endsWith("ies") && word.length > 4) {
    const stem = word.slice(0, -3) + "y";
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
  }
  if (word.endsWith("es") && word.length > 3) {
    const stem = word.slice(0, -2);
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
  }
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 2) {
    const stem = word.slice(0, -1);
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
  }

  // 3. 과거형/과거분사 -ed, -d 제거
  if (word.endsWith("ied") && word.length > 4) {
    const stem = word.slice(0, -3) + "y";
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
  }
  if (word.endsWith("ed") && word.length > 3) {
    let stem = word.slice(0, -2);
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
    stem = word.slice(0, -1); // practiced -> practice
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
    // 단자음 중복 (e.g. stopped -> stop)
    if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) {
      const shortStem = stem.slice(0, -1);
      if (BUILTIN_DICT[shortStem]) return { ...BUILTIN_DICT[shortStem], matchedWord: shortStem };
    }
  }

  // 4. 동명사/현재분사 -ing 제거
  if (word.endsWith("ing") && word.length > 4) {
    let stem = word.slice(0, -3);
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
    stem = stem + "e"; // automating -> automate
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
    // 단자음 중복 (e.g. stopping -> stop)
    const baseStem = word.slice(0, -3);
    if (baseStem.length > 2 && baseStem[baseStem.length - 1] === baseStem[baseStem.length - 2]) {
      const shortStem = baseStem.slice(0, -1);
      if (BUILTIN_DICT[shortStem]) return { ...BUILTIN_DICT[shortStem], matchedWord: shortStem };
    }
  }

  // 5. 부사 -ly 제거
  if (word.endsWith("ly") && word.length > 4) {
    let stem = word.slice(0, -2);
    if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
    if (word.endsWith("ily")) {
      stem = word.slice(0, -3) + "y";
      if (BUILTIN_DICT[stem]) return { ...BUILTIN_DICT[stem], matchedWord: stem };
    }
  }

  return null;
}

// 실시간 번역 API 호출 및 캐시 (비동기)
const translationCache = {};

async function fetchOnlineTranslation(word) {
  const cleanWord = word.trim().toLowerCase();
  if (translationCache[cleanWord]) {
    return translationCache[cleanWord];
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=en|ko`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API response not ok");
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      let trans = data.responseData.translatedText.trim();
      // 특수 기호 정리
      trans = trans.replace(/^"|"$/g, "");
      if (trans && trans.toLowerCase() !== cleanWord) {
        translationCache[cleanWord] = trans;
        return trans;
      }
    }
  } catch (err) {
    console.warn("Online translation failed for:", cleanWord, err);
  }

  return null;
}
