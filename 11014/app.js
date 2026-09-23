/**
 * 문맥과 결 (Context & Flow) - AI 글 다차원 오류 검사기 엔진
 * 기획: 손준혁 (문학 / 인문학 계열)
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 0. Built-in Offline SVG Icons (Zero Delay, 100% Reliable)
  // =========================================================================
  const ICONS = {
    'feather': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
    'info': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    'sparkles': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    'sparkle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    'star': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    'thumbs-up': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3"/><path d="M12 2a3 3 0 0 0-3 3v5"/></svg>`,
    'check-check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>`,
    'copy': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    'file-down': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>`,
    'moon': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    'sun': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    'minus': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
    'plus': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    'trash-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
    'maximize-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`,
    'gauge': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
    'spell-check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/><path d="m16 20 2 2 4-4"/></svg>`,
    'space': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1"/></svg>`,
    'git-branch': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
    'book-open': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    'split-square-vertical': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3"/><path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3"/><line x1="4" x2="20" y1="12" y2="12"/></svg>`,
    'check-circle-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    'align-left': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`,
    'git-commit': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/></svg>`,
    'graduation-cap': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    'check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    'arrow-right': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    'arrow-down': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
    'edit-3': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    'list-checks': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>`,
    'alert-triangle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    'alert-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    'help-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  function refreshIcons() {
    document.querySelectorAll('[data-lucide]').forEach(el => {
      const iconName = el.getAttribute('data-lucide');
      if (ICONS[iconName]) {
        el.innerHTML = ICONS[iconName];
      }
    });
  }

  refreshIcons();

  // =========================================================================
  // 1. Comprehensive Linguistic Rules
  // =========================================================================

  const SPELLING_RULES = [
    { pattern: /\b되요\b/g, suggestion: '돼요', type: 'spelling', tag: '되/돼 혼동', reason: "'되어요'의 준말이므로 '돼요'가 맞습니다." },
    { pattern: /\b안되\b/g, suggestion: '안 돼', type: 'spelling', tag: '되/돼 혼동', reason: "문장 종결 시에는 '안 돼'로 표기해야 합니다." },
    { pattern: /\b않되\b/g, suggestion: '안 돼', type: 'spelling', tag: '맞춤법/부정', reason: "'않되'는 잘못된 표기이며 '안 돼'가 맞습니다." },
    { pattern: /됫/g, suggestion: '됐', type: 'spelling', tag: '되/돼 혼동', reason: "'되었'의 준말은 '됐'입니다." },
    { pattern: /\b되서\b/g, suggestion: '돼서', type: 'spelling', tag: '되/돼 혼동', reason: "'되어서'의 준말은 '돼서'입니다." },
    { pattern: /\b되있는\b/g, suggestion: '돼 있는', type: 'spelling', tag: '되/돼 혼동', reason: "'되어 있는'의 준말은 '돼 있는'입니다." },
    { pattern: /\b되있다\b/g, suggestion: '돼 있다', type: 'spelling', tag: '되/돼 혼동', reason: "'되어 있다'의 준말은 '돼 있다'입니다." },
    { pattern: /\b안돼고\b/g, suggestion: '안 되고', type: 'spelling', tag: '되/돼 혼동', reason: "어미 '-고' 앞에서는 '안 되고'가 맞습니다." },

    { pattern: /왠만하면/g, suggestion: '웬만하면', type: 'spelling', tag: '맞춤법', reason: "'우에 어'를 쓰는 '웬만하면'이 표준어입니다." },
    { pattern: /왠일/g, suggestion: '웬일', type: 'spelling', tag: '맞춤법', reason: "'어찌 된 일'의 뜻은 '웬일'로 적습니다." },
    { pattern: /왠지모르게/g, suggestion: '왠지 모르게', type: 'spelling', tag: '띄어쓰기', reason: "'왜인지'의 준말은 '왠지'로 표기합니다." },
    { pattern: /웬지\b/g, suggestion: '왠지', type: 'spelling', tag: '맞춤법', reason: "'왜인지'의 준말은 '왠지'가 맞습니다." },

    { pattern: /몇일/g, suggestion: '며칠', type: 'spelling', tag: '맞춤법', reason: "'몇 일'이 아닌 '며칠'이 표준 표기입니다." },
    { pattern: /구지\b/g, suggestion: '굳이', type: 'spelling', tag: '구개음화', reason: "'굳이'가 맞는 표기이며, 발음만 [구지]입니다." },
    { pattern: /금새\b/g, suggestion: '금세', type: 'spelling', tag: '맞춤법', reason: "'금시에'가 줄어든 말로 '금세'가 바른 표기입니다." },
    { pattern: /설레임/g, suggestion: '설렘', type: 'spelling', tag: '기본형어미', reason: "기본형 '설레다'의 명사형은 '설렘'입니다." },

    { pattern: /어의없/g, suggestion: '어이없', type: 'spelling', tag: '혼동어휘', reason: "'어처구니가 없다'의 뜻은 '어이없다'로 적어야 합니다." },
    { pattern: /어의상실/g, suggestion: '어이상실', type: 'spelling', tag: '혼동어휘', reason: "'어이(어처구니) 상실'이 올바른 표현입니다." },
    { pattern: /어의가 없/g, suggestion: '어이가 없', type: 'spelling', tag: '혼동어휘', reason: "'어이(어처구니)'가 올바른 표준어입니다." },

    { pattern: /희안하/g, suggestion: '희한하', type: 'spelling', tag: '오탈자', reason: "'희한(稀罕)하다'로 표기해야 합니다." },
    { pattern: /해깔리/g, suggestion: '헷갈리', type: 'spelling', tag: '맞춤법', reason: "'헷갈리다'가 표준어입니다." },
    { pattern: /햇갈리/g, suggestion: '헷갈리', type: 'spelling', tag: '맞춤법', reason: "'헷갈리다'가 바른 표기입니다." },
    { pattern: /오랫만에/g, suggestion: '오랜만에', type: 'spelling', tag: '맞춤법', reason: "'오래간만에'의 준말은 '오랜만에'입니다." },
    { pattern: /바램/g, suggestion: '바람', type: 'spelling', tag: '모음혼동', reason: "소망이나 기원의 뜻은 '바람'이 표준어입니다." },
    { pattern: /들어났다/g, suggestion: '드러났다', type: 'spelling', tag: '맞춤법', reason: "겉으로 나타났다는 뜻은 '드러났다'입니다." },
    { pattern: /가르켜/g, suggestion: '가르쳐', type: 'spelling', tag: '단어혼동', reason: "지식을 전달할 때는 '가르치다(가르쳐)', 대상을 지목할 때는 '가리키다'입니다." },
    { pattern: /깨끗히/g, suggestion: '깨끗이', type: 'spelling', tag: '부사표기', reason: "'ㅅ' 받침 뒤에는 부사 파생 접미사 '-이'가 붙어 '깨끗이'가 됩니다." },
    { pattern: /일일히/g, suggestion: '일일이', type: 'spelling', tag: '부사표기', reason: "중복 어간 뒤에는 '-이'가 붙어 '일일이'가 맞습니다." },
    { pattern: /알맞는/g, suggestion: '알맞은', type: 'spelling', tag: '형용사어미', reason: "형용사 '알맞다' 뒤에는 관형형 어미 '-은'이 붙어 '알맞은'이 됩니다." },
    { pattern: /걸맞는/g, suggestion: '걸맞은', type: 'spelling', tag: '형용사어미', reason: "형용사 '걸맞다'의 관형형은 '걸맞은'입니다." },
    { pattern: /어떻해/g, suggestion: '어떡해', type: 'spelling', tag: '맞춤법', reason: "'어떻게 해'의 줄임말은 '어떡해'입니다." },
    { pattern: /뵈요/g, suggestion: '봬요', type: 'spelling', tag: '준말', reason: "'뵈어요'의 준말이므로 '봬요'가 맞습니다." }
  ];

  const DYNAMIC_SPACING_GENERATORS = [
    {
      regex: /([가-힣]+[을|ㄹ])수\s*(있[가-힣]*|없[가-힣]*)/g,
      replaceFunc: (match, p1, p2) => `${p1} 수 ${p2}`,
      tag: '의존명사(수)',
      reason: "의존명사 '수'는 앞말(관형사형 어미 '-ㄹ/을') 및 뒷말과 각각 띄어 씁니다."
    },
    {
      regex: /([가-힣]+[은|는|을|ㄹ|던])것([이|을|은|에|과|도|만|으로|이다|이며|이고|이라|처럼])?/g,
      replaceFunc: (match, p1, p2) => `${p1} 것${p2 || ''}`,
      tag: '의존명사(것)',
      reason: "의존명사 '것'은 앞의 용언 관형사형 뒤에서 띄어 씁니다."
    },
    {
      regex: /([가-힣]+[을|ㄹ])때([는|도|마다|에|를])?/g,
      replaceFunc: (match, p1, p2) => `${p1} 때${p2 || ''}`,
      tag: '의존명사(때)',
      reason: "시간을 나타내는 명사 '때'는 앞말과 띄어 씁니다."
    },
    {
      regex: /([가-힣]+[은|는|을|ㄹ|던])만큼([은|도|을|에])?/g,
      replaceFunc: (match, p1, p2) => `${p1} 만큼${p2 || ''}`,
      tag: '의존명사(만큼)',
      reason: "용언 어미 뒤의 '만큼'은 의존명사이므로 띄어 씁니다."
    },
    {
      regex: /([가-힣]+[을|ㄹ])뿐([이다|이며|이고|으로|에])?/g,
      replaceFunc: (match, p1, p2) => `${p1} 뿐${p2 || ''}`,
      tag: '의존명사(뿐)',
      reason: "용언 어미 뒤의 '뿐'은 의존명사이므로 띄어 씁니다."
    },
    {
      regex: /([가-힣]+[은|ㄴ])지\s+([0-9]+[년|월|일|시|분|초]|며칠|오래|얼마|몇)/g,
      replaceFunc: (match, p1, p2) => `${p1} 지 ${p2}`,
      tag: '의존명사(지)',
      reason: "경과한 시간을 나타내는 '지'는 의존명사이므로 띄어 씁니다."
    },
    {
      regex: /\b안(가다|오다|보다|먹다|하다|쓰다|듣다|배우다|읽다|믿다|만나다|되다|된다|돼|했다|하고|하며|하면)\b/g,
      replaceFunc: (match, p1) => `안 ${p1}`,
      tag: '부정부사(안)',
      reason: "부정의 뜻을 나타내는 부사 '안'은 뒤의 용언과 띄어 씁니다."
    },
    {
      regex: /([가-힣]{2,})\s+(에게서|에게|에서부터|에서는|에서도|에서|처럼|만큼|마저|조차|밖에|부터|까지|으로|로써|로서)(?=[^\w]|\s|$)/g,
      replaceFunc: (match, p1, p2) => `${p1}${p2}`,
      tag: '조사 결합',
      reason: "조사는 자립성이 없으므로 앞의 체언(명사)에 붙여 씁니다."
    },
    {
      regex: /보고싶다/g,
      replaceFunc: () => `보고 싶다`,
      tag: '보조용언',
      reason: "본용언 '보다'와 보조용언 '싶다'는 띄어 쓰는 것이 원칙입니다."
    },
    {
      regex: /에대해/g,
      replaceFunc: () => `에 대해`,
      tag: '구문결합',
      reason: "조사 '에'와 동사 '대하다'는 띄어 씁니다."
    },
    {
      regex: /에의해/g,
      replaceFunc: () => `에 의해`,
      tag: '구문결합',
      reason: "조사 '에'와 '의하다'는 띄어 씁니다."
    },
    {
      regex: /을통해/g,
      replaceFunc: () => `을 통해`,
      tag: '구문결합',
      reason: "조사 '을'과 '통하다'는 띄어 씁니다."
    },
    {
      regex: /를통해/g,
      replaceFunc: () => `를 통해`,
      tag: '구문결합',
      reason: "조사 '를'과 '통하다'는 띄어 씁니다."
    }
  ];

  const CONTEXT_RULES = [
    { pattern: /생각되어집니다/g, suggestion: '생각됩니다', tag: '이중피동', reason: "'-되다'와 '-어지다'가 중첩된 이중 피동입니다. 간결한 단일 피동형('생각됩니다')으로 정돈하세요." },
    { pattern: /보여집니다/g, suggestion: '보입니다', tag: '이중피동', reason: "'보이다'에 '-어지다'가 결합된 이중 피동입니다. '보입니다'로 쓰면 문장이 간결해집니다." },
    { pattern: /느껴집니다/g, suggestion: '느낍니다', tag: '피동과다', reason: "주체의 감상을 서술할 때는 능동적 어조('느낍니다')가 글의 설득력을 높입니다." },
    { pattern: /불려집니다/g, suggestion: '불립니다', tag: '이중피동', reason: "'불리다'에 '-어지다'가 결합된 불필요한 이중 피동 표현입니다." },
    { pattern: /에 있어서의/g, suggestion: '에서의', tag: '번역투', reason: "일본어 번역투 표현(~に おいての)으로 '에서의'로 정돈하세요." },
    { pattern: /에 있어서\b/g, suggestion: '에서', tag: '번역투', reason: "일본어 번역투 표현(~に おいて)으로, '에서'로 바꾸면 문맥이 훨씬 자연스럽습니다." },
    { pattern: /에 다름 아니다/g, suggestion: '와 같다 / 다름없다', tag: '번역투', reason: "일본어 직역투 표현(~に ほかならない)입니다. '다름없다' 또는 '~이다'로 표현하세요." },
    { pattern: /왜냐하면\s+(?!.*(?:때문이다|까닭이다|이유이다))/g, suggestion: '왜냐하면 ~ 때문이다', tag: '호응관계', reason: "'왜냐하면'으로 시작하는 문장은 종결부가 '~ 때문이다'로 호응해야 논리적 비문이 되지 않습니다." }
  ];

  const VOCAB_RULES = [
    { pattern: /\b생각한다\b/g, suggestion: '사유한다 / 고찰한다', tag: '인문학 어휘', reason: "단순한 '생각한다' 대신 '사유한다'나 '고찰한다'를 활용하면 인문학적 깊이가 더해집니다." },
    { pattern: /\b알 수 있다\b/g, suggestion: '확인할 수 있다 / 규명할 수 있다', tag: '학술적 표현', reason: "'알 수 있다'를 '규명할 수 있다'로 바꾸면 논술의 격조가 높아집니다." },
    { pattern: /\b중요하다\b/g, suggestion: '본질적이다 / 핵심적 가치를 지닌다', tag: '어휘 다채로움', reason: "상투적인 '중요하다' 대신 '본질적이다' 혹은 '핵심적 가치를 지닌다'로 문맥을 풍성하게 표현해 보세요." },
    { pattern: /\b말하고 있다\b/g, suggestion: '피력하고 있다 / 역설하고 있다', tag: '비평적 어휘', reason: "작가의 의도를 서술할 때 '피력하고 있다'나 '역설하고 있다'를 사용하면 완성도가 올라갑니다." },
    { pattern: /\b보여준다\b/g, suggestion: '함의한다 / 투영한다', tag: '문학적 어휘', reason: "단순 묘사보다는 '인간 내면을 투영한다', '시대적 모순을 함의한다'와 같이 정교한 어휘를 추천합니다." }
  ];

  const ADVANCED_VOCAB_LEXICON = [
    '사유', '고찰', '조명', '함의', '투영', '역설', '담론', '패러다임', '실존', '변혁',
    '지평', '맥락', '성찰', '규명', '지향', '괴리', '통찰', '모순', '내면화', '가치관',
    '본질', '타자화', '주체성', '심미적', '형이상학', '인식론', '서사', '은유', '변주', '파급',
    '소외', '사물화', '비판적'
  ];

  // =========================================================================
  // 2. Preloaded Samples
  // =========================================================================
  const SAMPLES = {
    essay: `현대 사회에 있어서 개인의 고독과 실존적 방황은 왠만하면 누구에게나 익숙한 현상으로 자리 잡았다. 우리는 몇일 동안이나 SNS를 통해 수많은 타인과 연결되어 있는것 같지만, 구지 자신의 내면을 들여다 볼때 공허함은 금새 찾아온다.

이러한 인간 소외의 문제는 단지 개인의 심리적 결함 때문이 아니라, 현대 기술 문명이 인간을 사물화하는 구조에서 기인하는것으로 보여집니다. 왜냐하면 인간은 본래 타자와의 진정한 교감을 갈망하는 존재이다.

따라서 우리는 상실된 자아를 되찾기 위해 스스로의 삶을 끊임없이 생각하고 성찰할수있어야 하며, 잃어버린 인간성의 본질을 알 수 있는 계기를 마련하는 것이 매우 중요하다.`,

    critique: `이 작품에서 주인공이 마주하는 내면의 갈등은 어의없는 현실의 부조리와 맞닿아 있다. 작가는 인물의 행동을 통해 사회적 규범과 개인의 자유가 어떻게 충돌하는지를 말하고 있다.

작품 속에 들어난 상징적 장치들은 매우 흥미로운데, 주인공이 오랫만에 고향에 돌아왔을때 느꼈던 설레임은 곧 차가운 환멸로 변하게 된다. 이러한 감정선의 변화는 현대인이 겪는 정체성의 혼란을 잘 보여준다.

인물의 대화 속에 숨겨진 은유를 볼때, 작가는 독자에게 단순한 위로를 건네기보다는 실존의 무게를 스스로 감당할 것을 요구하고 있는것으로 생각되어집니다.`,

    report: `인공지능 기술의 급격한 발전은 인문학적 사유의 필요성을 더욱 부각시키고 있다. AI가 생성하는 텍스트는 겉보기에 깨끗히 다듬어져 있는것 처럼 보이지만, 깊이 있는 비판적 성찰을 담아내는 데에는 한계가 알맞는 평가라 할수있다.

과제를 수행할때 학생들은 단순히 정보를 요약하는것에 그치지 않고, 그 이면에 내재된 윤리적 쟁점에 대해 심도 있게 고찰해야 한다. 왜냐하면 기술의 올바른 발전 방향을 결정하는 것은 결국 인간의 도덕적 판단력에 달려있기 때문이다.

본 리포트에서는 AI 시대에 있어서 문학 교육이 지니는 의의를 살펴보고, 비판적 문해력을 기를수있는 실천적 방안을 탐구해보고자 한다.`
  };

  // =========================================================================
  // 3. State & DOM Elements
  // =========================================================================
  let currentText = '';
  let activeIssues = [];
  let wellWrittenHighlights = [];
  let awkwardFlowIssues = [];
  let fontSize = 16;
  let isFocusMode = false;
  let currentViewMode = 'text';

  const editorInput = document.getElementById('editorInput');
  const editorAnnotationView = document.getElementById('editorAnnotationView');
  const viewModeTextBtn = document.getElementById('viewModeTextBtn');
  const viewModeAnnotationBtn = document.getElementById('viewModeAnnotationBtn');

  const charCountEl = document.getElementById('charCount');
  const wordCountEl = document.getElementById('wordCount');
  const sentenceCountEl = document.getElementById('sentenceCount');
  const readingTimeEl = document.getElementById('readingTime');

  const countSpellingBadge = document.getElementById('countSpellingBadge');
  const countSpacingBadge = document.getElementById('countSpacingBadge');
  const countContextBadge = document.getElementById('countContextBadge');
  const countVocabBadge = document.getElementById('countVocabBadge');

  const tabPraiseCount = document.getElementById('tabPraiseCount');
  const tabAwkwardCount = document.getElementById('tabAwkwardCount');
  const tabSpellingCount = document.getElementById('tabSpellingCount');
  const tabSpacingCount = document.getElementById('tabSpacingCount');
  const tabContextCount = document.getElementById('tabContextCount');
  const tabVocabCount = document.getElementById('tabVocabCount');

  const jumpSpellingCount = document.getElementById('jumpSpellingCount');
  const jumpSpacingCount = document.getElementById('jumpSpacingCount');
  const jumpContextCount = document.getElementById('jumpContextCount');
  const jumpPraiseCount = document.getElementById('jumpPraiseCount');
  const jumpAwkwardCount = document.getElementById('jumpAwkwardCount');

  const overallScoreVal = document.getElementById('overallScoreVal');
  const scoreRingProgress = document.getElementById('scoreRingProgress');
  const scoreGradeBadge = document.getElementById('scoreGradeBadge');
  const scoreSummaryTitle = document.getElementById('scoreSummaryTitle');
  const scoreSummaryDesc = document.getElementById('scoreSummaryDesc');

  const metricSpellingScore = document.getElementById('metricSpellingScore');
  const metricSpellingCount = document.getElementById('metricSpellingCount');
  const metricSpellingBar = document.getElementById('metricSpellingBar');

  const metricSpacingScore = document.getElementById('metricSpacingScore');
  const metricSpacingCount = document.getElementById('metricSpacingCount');
  const metricSpacingBar = document.getElementById('metricSpacingBar');

  const metricContextScore = document.getElementById('metricContextScore');
  const metricContextCount = document.getElementById('metricContextCount');
  const metricContextBar = document.getElementById('metricContextBar');

  const metricVocabScore = document.getElementById('metricVocabScore');
  const metricVocabTTR = document.getElementById('metricVocabTTR');
  const metricVocabBar = document.getElementById('metricVocabBar');

  const editorialReviewText = document.getElementById('editorialReviewText');
  const praiseCardsContainer = document.getElementById('praiseCardsContainer');
  const awkwardCardsContainer = document.getElementById('awkwardCardsContainer');

  const spellingIssuesList = document.getElementById('spellingIssuesList');
  const spacingIssuesList = document.getElementById('spacingIssuesList');
  const contextIssuesList = document.getElementById('contextIssuesList');
  const vocabIssuesList = document.getElementById('vocabIssuesList');

  const vocabBasicPct = document.getElementById('vocabBasicPct');
  const vocabInterPct = document.getElementById('vocabInterPct');
  const vocabAdvPct = document.getElementById('vocabAdvPct');
  const vocabBasicBar = document.getElementById('vocabBasicBar');
  const vocabInterBar = document.getElementById('vocabInterBar');
  const vocabAdvBar = document.getElementById('vocabAdvBar');

  const diffOriginalText = document.getElementById('diffOriginalText');
  const diffFixedText = document.getElementById('diffFixedText');
  const diffOrigLen = document.getElementById('diffOrigLen');
  const diffFixedLen = document.getElementById('diffFixedLen');

  // =========================================================================
  // 4. Analysis Logic & Well-Written Finder
  // =========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function analyzeText(text) {
    if (!text || text.trim() === '') {
      resetDiagnostics();
      return;
    }

    const issues = [];
    let issueCounter = 1;

    // 1. Spelling Rules Pass
    SPELLING_RULES.forEach(rule => {
      let match;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        issues.push({
          id: 'spelling_' + (issueCounter++),
          index: match.index,
          length: match[0].length,
          original: match[0],
          suggestion: rule.suggestion,
          type: 'spelling',
          tag: rule.tag,
          reason: rule.reason
        });
      }
    });

    // 2. Spacing Rules Pass
    DYNAMIC_SPACING_GENERATORS.forEach(gen => {
      let match;
      const regex = new RegExp(gen.regex.source, gen.regex.flags);
      while ((match = regex.exec(text)) !== null) {
        const suggestion = gen.replaceFunc(match[0], match[1], match[2]);
        if (suggestion !== match[0]) {
          issues.push({
            id: 'spacing_' + (issueCounter++),
            index: match.index,
            length: match[0].length,
            original: match[0],
            suggestion: suggestion,
            type: 'spacing',
            tag: gen.tag,
            reason: gen.reason
          });
        }
      }
    });

    // 3. Context & Flow Rules Pass
    CONTEXT_RULES.forEach(rule => {
      let match;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        if (rule.pattern.source.includes('왜냐하면')) {
          const sentenceEndIdx = text.indexOf('.', match.index);
          const fullSentence = sentenceEndIdx !== -1 ? text.substring(match.index, sentenceEndIdx + 1) : text.substring(match.index);
          const fixedSentence = fullSentence.replace(/(?:존재이다|것이다|말이다|상태다)\.?$/, '존재이기 때문이다.').replace(/\.?$/, ' 때문이다.');
          issues.push({
            id: 'context_' + (issueCounter++),
            index: match.index,
            length: fullSentence.length,
            original: fullSentence,
            suggestion: fixedSentence,
            type: 'context',
            tag: rule.tag,
            reason: rule.reason
          });
        } else {
          issues.push({
            id: 'context_' + (issueCounter++),
            index: match.index,
            length: match[0].length,
            original: match[0],
            suggestion: rule.suggestion,
            type: 'context',
            tag: rule.tag,
            reason: rule.reason
          });
        }
      }
    });

    // 4. Vocabulary Enhancement Pass
    VOCAB_RULES.forEach(rule => {
      let match;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        issues.push({
          id: 'vocab_' + (issueCounter++),
          index: match.index,
          length: match[0].length,
          original: match[0],
          suggestion: rule.suggestion,
          type: 'vocab',
          tag: rule.tag,
          reason: rule.reason
        });
      }
    });

    issues.sort((a, b) => a.index - b.index);

    const filteredIssues = [];
    let lastEnd = -1;
    for (const issue of issues) {
      if (issue.index >= lastEnd) {
        filteredIssues.push(issue);
        lastEnd = issue.index + issue.length;
      }
    }

    activeIssues = filteredIssues;

    // 5. Discover Well-Written Sentences & Awkward Flow Weaknesses
    findWellWrittenHighlights(text);
    findAwkwardFlowIssues(text);

    // Update UI Components
    updateMetricsAndCounts(text, activeIssues);
    renderPraiseList(wellWrittenHighlights);
    renderAwkwardList(awkwardFlowIssues);
    renderIssueLists(activeIssues);
    renderDiffView(text, activeIssues);

    if (currentViewMode === 'annotation') {
      renderAnnotationView(text, activeIssues);
    }
  }

  // =========================================================================
  // 5. Well-Written Sentence Finder (칭찬 및 긍정 피드백 알고리즘)
  // =========================================================================
  function findWellWrittenHighlights(text) {
    const praises = [];
    const rawSentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length >= 10);

    rawSentences.forEach((sentence, idx) => {
      const cleanS = sentence.trim();

      // 1. Check for Academic / Literary Concept Words
      const matchedAdvWords = ADVANCED_VOCAB_LEXICON.filter(w => cleanS.includes(w));
      if (matchedAdvWords.length >= 2) {
        praises.push({
          id: 'praise_' + idx,
          tag: '인문학적 통찰 & 지적 어휘',
          badgeClass: 'badge-praise-intellect',
          sentence: cleanS,
          feedback: `‘${matchedAdvWords.join("’, ‘")}’와 같은 수준 높은 인문·학술 개념어를 문맥에 정확하게 사용하여 글의 지적 깊이와 설득력을 크게 높였습니다.`,
          tip: '이러한 어휘를 중심으로 단락의 핵심 주장을 한층 더 부각해 보세요.'
        });
        return;
      }

      // 2. Check for Problem Definition & Structural Analysis
      if (cleanS.includes('문제는') || cleanS.includes('구조에서') || cleanS.includes('기인') || cleanS.includes('갈망하는')) {
        praises.push({
          id: 'praise_' + idx,
          tag: '깊이 있는 문제의식',
          badgeClass: 'badge-praise-insight',
          sentence: cleanS,
          feedback: '현상의 표면만을 다루지 않고, 그 이면에 내재된 구조적 원인과 인간 본질을 날카롭게 파고든 탁월한 문제의식 문장입니다.',
          tip: '독자가 깊이 공감할 수 있는 핵심 논거 역할을 훌륭히 수행하고 있습니다.'
        });
        return;
      }

      // 3. Check for Clear Logical Transitions
      if (cleanS.startsWith('따라서') || cleanS.startsWith('그러므로') || cleanS.includes('위해') || cleanS.includes('성찰')) {
        praises.push({
          id: 'praise_' + idx,
          tag: '탄탄한 결론 & 실천적 제언',
          badgeClass: 'badge-praise-logic',
          sentence: cleanS,
          feedback: '앞서 제기된 논점을 종합하여 우리가 나아가야 할 실천적 방향성과 가치를 선명하고 균형 잡힌 어조로 결론지었습니다.',
          tip: '문장 종결 어미의 호흡이 안정적이며 독자에게 강한 신뢰감을 줍니다.'
        });
        return;
      }

      // 4. Concise and Punchy Sentences
      if (cleanS.length >= 20 && cleanS.length <= 55 && !cleanS.includes('것으로') && !cleanS.includes('있어서')) {
        praises.push({
          id: 'praise_' + idx,
          tag: '명쾌하고 깔끔한 문체',
          badgeClass: 'badge-praise-clarity',
          sentence: cleanS,
          feedback: '군더더기 없는 간결한 호흡으로 전달하고자 하는 메시지를 명료하게 압축하여 가독성이 뛰어납니다.',
          tip: '문장의 전달력이 매우 높아 글의 리듬감을 살려줍니다.'
        });
      }
    });

    wellWrittenHighlights = praises.slice(0, 4); // Top 4 highlights
  }

  // =========================================================================
  // 6. Render Praise Tab & Dashboard Highlights
  // =========================================================================
  function renderPraiseList(praises) {
    if (tabPraiseCount) tabPraiseCount.textContent = praises.length;
    if (jumpPraiseCount) jumpPraiseCount.textContent = praises.length;

    if (!praiseCardsContainer) return;

    if (praises.length === 0) {
      praiseCardsContainer.innerHTML = `
        <div class="empty-issue-state">
          <i data-lucide="star" class="empty-icon text-purple"></i>
          <p>분석할 본문이 충분하지 않습니다. 글을 작성하시면 돋보이는 문장과 칭찬 피드백이 생성됩니다.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    praiseCardsContainer.innerHTML = praises.map(p => `
      <div class="praise-card">
        <div class="praise-card-header">
          <span class="praise-badge ${p.badgeClass}">
            <i data-lucide="star"></i> ${escapeHtml(p.tag)}
          </span>
          <span class="praise-score-tag">🌟 우수 표현</span>
        </div>

        <div class="praise-quote-box">
          <div class="quote-mark">“</div>
          <div class="quote-text">${escapeHtml(p.sentence)}</div>
        </div>

        <div class="praise-feedback-box">
          <div class="feedback-title">
            <i data-lucide="thumbs-up"></i> AI 찬사 및 강점 분석
          </div>
          <div class="feedback-desc">${escapeHtml(p.feedback)}</div>
          <div class="feedback-tip">💡 <strong>Plus Tip:</strong> ${escapeHtml(p.tip)}</div>
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  // =========================================================================
  // 6-2. Awkward Flow & Weakness Finder (어색한 부분 및 문맥 취약점 진단)
  // =========================================================================
  const AWKWARD_PATTERNS = [
    {
      pattern: /에\s+있어서(?:의)?/g,
      tag: '일본어 번역투 (~에 있어서)',
      badgeClass: 'badge-awkward-trans',
      problem: "‘~에 있어서(の)’는 일본어 직역투 구문으로 문장의 결을 어색하게 만듭니다.",
      solution: "‘~에서’, ‘~의 경우’ 등으로 간결하게 교정하면 문맥이 한층 자연스러워집니다."
    },
    {
      pattern: /(?:생각되어집니다|보여집니다|불려집니다|느껴집니다)/g,
      tag: '어색한 이중 피동',
      badgeClass: 'badge-awkward-passive',
      problem: "피동 접미사와 '-어지다'가 불필요하게 겹쳐 문장의 주체성이 흐려집니다.",
      solution: "‘생각됩니다 / 보입니다 / 느낍니다’와 같은 단일 피동 또는 능동형으로 다듬으세요."
    },
    {
      pattern: /왜냐하면\s+(?!.*(?:때문이다|까닭이다|이유이다))/g,
      tag: '주술/인과 호응 결여',
      badgeClass: 'badge-awkward-agree',
      problem: "‘왜냐하면’으로 시작한 문장이 ‘~때문이다’로 호응되지 않아 비문이 되었습니다.",
      solution: "문장 종결부를 ‘~때문이다’로 마무리하여 논리적 인과 호응을 완성하세요."
    },
    {
      pattern: /매우\s+중요하다\.?/g,
      tag: '상투적 결론 종결',
      badgeClass: 'badge-awkward-cliche',
      problem: "‘매우 중요하다’는 설득 글이나 에세이에서 흔히 남용되는 상투적 결말입니다.",
      solution: "‘본질적 가치를 지닌다’, ‘불가결한 실천 과제이다’ 등으로 구체적 무게감을 더하세요."
    },
    {
      pattern: /많은\s+생각을\s+하게\s+(?:만든다|한다|되었다|했다)/g,
      tag: '모호한 상투적 감상',
      badgeClass: 'badge-awkward-cliche',
      problem: "‘많은 생각을 하게 만든다’는 구체적 통찰이 결여된 상투적인 표현입니다.",
      solution: "독자나 화자가 느낀 구체적인 고뇌나 성찰의 내용을 직접적으로 명시하세요."
    },
    {
      pattern: /역할을\s+담당하고\s+있다/g,
      tag: '군더더기 표현',
      badgeClass: 'badge-awkward-cliche',
      problem: "상투적인 명사 나열로 문장이 무거워졌습니다.",
      solution: "‘역할을 한다’ 또는 ‘기여한다’로 간결하게 압축하세요."
    },
    {
      pattern: /진행을\s+하도록\s+하겠다/g,
      tag: '행정적/번잡한 어조',
      badgeClass: 'badge-awkward-cliche',
      problem: "조동사와 불필요한 명사형 파생이 겹쳐 있습니다.",
      solution: "‘진행하겠다’로 간결하게 표현하세요."
    }
  ];

  function findAwkwardFlowIssues(text) {
    const issues = [];
    const rawSentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length >= 8);

    // 1. Pattern-based Awkward Phrases
    rawSentences.forEach((sentence, idx) => {
      const cleanS = sentence.trim();
      AWKWARD_PATTERNS.forEach(rule => {
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
        const m = regex.exec(cleanS);
        if (m) {
          issues.push({
            id: 'awkward_rule_' + idx,
            tag: rule.tag,
            badgeClass: rule.badgeClass,
            sentence: cleanS,
            problem: rule.problem,
            solution: rule.solution,
            highlight: m[0]
          });
        }
      });
    });

    // 2. Run-on Sentences (만연체 / 호흡 과다)
    rawSentences.forEach((sentence, idx) => {
      const cleanS = sentence.trim();
      if (cleanS.length >= 70 && (cleanS.includes(',') || cleanS.includes('하며') || cleanS.includes('하고') || cleanS.includes('있으며'))) {
        issues.push({
          id: 'awkward_runon_' + idx,
          tag: '호흡 과다 (만연체 문장)',
          badgeClass: 'badge-awkward-runon',
          sentence: cleanS,
          problem: `문장 길이가 ${cleanS.length}자로 길어 호흡이 늘어지고 주어와 종결 서술어 간의 연결성이 약화됩니다.`,
          solution: "접속 어미('~하며', '~하고') 부근에서 문장을 2개로 분절하면 전달력과 호흡이 한결 선명해집니다.",
          highlight: ''
        });
      }
    });

    // 3. Repetitive Sentence Endings (종결 어미 반복)
    const endings = [];
    rawSentences.forEach(s => {
      const m = s.trim().match(/([가-힣]{2,3}[다|요])\.?$/);
      endings.append ? endings.append(m ? m[1] : '') : endings.push(m ? m[1] : '');
    });

    for (let i = 0; i < endings.length - 1; i++) {
      if (endings[i] && endings[i] === endings[i+1] && endings[i].length >= 2) {
        issues.push({
          id: 'awkward_ending_' + i,
          tag: '종결어미 중복 (단조로운 리듬)',
          badgeClass: 'badge-awkward-ending',
          sentence: `① ${rawSentences[i]}\n② ${rawSentences[i+1]}`,
          problem: `연속된 두 문장이 모두 ‘~${endings[i]}’로 동일하게 종결되어 문체의 리듬감이 다소 단조롭습니다.`,
          solution: "서술어를 도치하거나, 체언 종결, 의문형, 또는 ‘~는 바 있다’ 등으로 다채롭게 변주해 보세요.",
          highlight: endings[i]
        });
      }
    }

    awkwardFlowIssues = issues.slice(0, 5); // Top 5
  }

  function renderAwkwardList(issues) {
    if (tabAwkwardCount) tabAwkwardCount.textContent = issues.length;
    if (jumpAwkwardCount) jumpAwkwardCount.textContent = issues.length;

    if (!awkwardCardsContainer) return;

    if (issues.length === 0) {
      awkwardCardsContainer.innerHTML = `
        <div class="empty-issue-state">
          <i data-lucide="check-circle" class="empty-icon text-green"></i>
          <p>문맥이나 흐름상 어색한 문장이 발견되지 않았습니다. 글의 호흡과 연결성이 우수합니다.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    awkwardCardsContainer.innerHTML = issues.map(iss => `
      <div class="awkward-card">
        <div class="awkward-card-header">
          <span class="awkward-badge ${iss.badgeClass}">
            <i data-lucide="alert-triangle"></i> ${escapeHtml(iss.tag)}
          </span>
          <span class="awkward-level-tag">⚠️ 문맥 보완 권장</span>
        </div>

        <div class="awkward-quote-box">
          <div class="awkward-quote-mark">“</div>
          <div class="awkward-quote-text">${escapeHtml(iss.sentence).replace(/\n/g, '<br>')}</div>
        </div>

        <div class="awkward-problem-box">
          <div class="awkward-title-why">
            <i data-lucide="alert-circle"></i> 🔍 왜 어색하게 느껴질까요?
          </div>
          <div class="awkward-problem-desc">${escapeHtml(iss.problem)}</div>
        </div>

        <div class="awkward-solution-box">
          <div class="awkward-title-how">
            <i data-lucide="sparkle"></i> ✨ 이렇게 고쳐보세요 (AI 가이드)
          </div>
          <div class="awkward-solution-desc">${escapeHtml(iss.solution)}</div>
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  // =========================================================================
  // 7. Render Annotation View (Sentence-by-Sentence View)
  // =========================================================================
  function renderAnnotationView(text, issues) {
    if (!text || text.trim() === '') {
      editorAnnotationView.innerHTML = `
        <div class="empty-issue-state">
          <i data-lucide="edit-3" class="empty-icon text-green"></i>
          <p>작성된 글이 없습니다. 에디터에 글을 입력해 주세요.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    try {
      const paragraphs = text.split('\n\n');
      let html = '';

      paragraphs.forEach((pText) => {
        if (!pText.trim()) return;

        html += `<div class="annotation-paragraph-card">`;
        const sentences = pText.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);

        sentences.forEach(sentence => {
          const cleanSentence = sentence.trim();
          
          // Check if this sentence contains active issues, praise, or awkward issues
          const matchedIssues = issues.filter(iss => cleanSentence.includes(iss.original));
          const matchedPraise = wellWrittenHighlights.filter(p => p.sentence.includes(cleanSentence) || cleanSentence.includes(p.sentence));
          const matchedAwkward = awkwardFlowIssues.filter(awk => awk.sentence.includes(cleanSentence) || (awk.highlight && cleanSentence.includes(awk.highlight)));

          if (matchedIssues.length === 0) {
            // Clean Sentence
            html += `
              <div class="annotation-sentence-row">
                <div class="sentence-original-text">
                  <span class="clean-check-icon"><i data-lucide="check-circle-2"></i></span>
                  <span>${escapeHtml(cleanSentence)}</span>
                </div>
                ${matchedPraise.length > 0 ? `
                  <div class="sentence-praise-banner" style="display:flex; flex-direction:column; gap:0.25rem; padding:0.6rem 0.85rem; background:#f5f3ff; border:1.5px solid #c4b5fd; border-radius:var(--radius-sm); margin-top:0.35rem;">
                    <span style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.72rem; font-weight:800; color:#7c3aed;">
                      <i data-lucide="star"></i> 🌟 우수 문맥 찬사: ${escapeHtml(matchedPraise[0].tag)}
                    </span>
                    <div style="font-size:0.82rem; color:var(--text-secondary);">${escapeHtml(matchedPraise[0].feedback)}</div>
                  </div>
                ` : ''}
                ${matchedAwkward.length > 0 ? `
                  <div class="sentence-awkward-banner">
                    <span class="awkward-badge-title">
                      <i data-lucide="alert-triangle"></i> ⚠️ 문맥 흐름 피드백: ${escapeHtml(matchedAwkward[0].tag)}
                    </span>
                    <div class="awkward-desc">${escapeHtml(matchedAwkward[0].problem)}</div>
                    <div class="awkward-sol">💡 <strong>AI 조언:</strong> ${escapeHtml(matchedAwkward[0].solution)}</div>
                  </div>
                ` : ''}
              </div>
            `;
          } else {
            // Faulty sentence: Highlight errors cleanly
            let sentenceHtml = escapeHtml(cleanSentence);
            let revisedSentence = cleanSentence;

            matchedIssues.forEach(iss => {
              const cleanSugg = iss.suggestion.split('/')[0].trim();
              const errorRegex = new RegExp(escapeRegex(iss.original), 'g');
              sentenceHtml = sentenceHtml.replace(errorRegex, `<span class="mark-${iss.type}">${escapeHtml(iss.original)}</span>`);
              revisedSentence = revisedSentence.replace(errorRegex, cleanSugg);
            });

            html += `
              <div class="annotation-sentence-row has-issue">
                <div class="sentence-original-text">
                  <strong>[원문]</strong> ${sentenceHtml}
                </div>
                <div class="sentence-revised-banner">
                  <div class="revised-left-group">
                    <span class="revised-badge-title">
                      <i data-lucide="sparkle"></i> AI 추천 교정 문장
                    </span>
                    <div class="revised-sentence-content">${escapeHtml(revisedSentence)}</div>
                  </div>
                  <button class="btn-apply-sentence-fix" data-orig="${encodeURIComponent(cleanSentence)}" data-fixed="${encodeURIComponent(revisedSentence)}">
                    <i data-lucide="check"></i> 이 문장 적용
                  </button>
                </div>
                ${matchedAwkward.length > 0 ? `
                  <div class="sentence-awkward-banner">
                    <span class="awkward-badge-title">
                      <i data-lucide="alert-triangle"></i> ⚠️ 문맥 흐름 피드백: ${escapeHtml(matchedAwkward[0].tag)}
                    </span>
                    <div class="awkward-desc">${escapeHtml(matchedAwkward[0].problem)}</div>
                    <div class="awkward-sol">💡 <strong>AI 조언:</strong> ${escapeHtml(matchedAwkward[0].solution)}</div>
                  </div>
                ` : ''}
              </div>
            `;
          }
        });

        html += `</div>`;
      });

      editorAnnotationView.innerHTML = html;
      refreshIcons();

      editorAnnotationView.querySelectorAll('.btn-apply-sentence-fix').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const orig = decodeURIComponent(e.currentTarget.dataset.orig);
          const fixed = decodeURIComponent(e.currentTarget.dataset.fixed);
          if (currentText.includes(orig)) {
            currentText = currentText.replace(orig, fixed);
            editorInput.value = currentText;
            analyzeText(currentText);
            showToast('해당 문장이 추천안으로 교정되었습니다.', 'success');
          }
        });
      });
    } catch (err) {
      console.error('Annotation View Error:', err);
    }
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // =========================================================================
  // 8. UI Statistics & Diagnostics Update
  // =========================================================================
  function updateMetricsAndCounts(text, issues) {
    const charLen = text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const sentences = text.split(/[.?!]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length || (charLen > 0 ? 1 : 0);

    const readSecs = Math.max(1, Math.round((charLen / 350) * 60));
    const readingTimeStr = readSecs >= 60 ? `${Math.floor(readSecs / 60)}분 ${readSecs % 60}초` : `${readSecs}초`;

    charCountEl.textContent = charLen.toLocaleString();
    wordCountEl.textContent = wordCount.toLocaleString();
    sentenceCountEl.textContent = sentenceCount.toLocaleString();
    readingTimeEl.textContent = readingTimeStr;

    const spellingIssues = issues.filter(i => i.type === 'spelling');
    const spacingIssues = issues.filter(i => i.type === 'spacing');
    const contextIssues = issues.filter(i => i.type === 'context');
    const vocabIssues = issues.filter(i => i.type === 'vocab');

    countSpellingBadge.textContent = spellingIssues.length;
    countSpacingBadge.textContent = spacingIssues.length;
    countContextBadge.textContent = contextIssues.length;
    countVocabBadge.textContent = vocabIssues.length;

    tabSpellingCount.textContent = spellingIssues.length;
    tabSpacingCount.textContent = spacingIssues.length;
    tabContextCount.textContent = contextIssues.length;
    tabVocabCount.textContent = vocabIssues.length;

    jumpSpellingCount.textContent = spellingIssues.length;
    jumpSpacingCount.textContent = spacingIssues.length;
    jumpContextCount.textContent = contextIssues.length;

    let score = 100;
    score -= (spellingIssues.length * 8);
    score -= (spacingIssues.length * 5);
    score -= (contextIssues.length * 7);
    score = Math.max(10, Math.min(100, score));

    overallScoreVal.textContent = score;

    const offset = 314 - (314 * score) / 100;
    scoreRingProgress.style.strokeDashoffset = offset;
    
    if (score >= 90) {
      scoreRingProgress.style.stroke = '#10b981';
      scoreGradeBadge.textContent = '최우수 완성도';
      scoreGradeBadge.style.color = '#10b981';
      scoreGradeBadge.style.background = 'var(--bg-success-light)';
      scoreSummaryTitle.textContent = '글의 완성도와 논리적 결이 매우 우수합니다';
      scoreSummaryDesc.textContent = '어휘의 품격과 문맥의 호흡이 매우 유려하며, 국립국어원 어문 규범을 훌륭히 준수하고 있습니다.';
    } else if (score >= 75) {
      scoreRingProgress.style.stroke = '#4f46e5';
      scoreGradeBadge.textContent = '우수 (소폭 교정 필요)';
      scoreGradeBadge.style.color = '#4f46e5';
      scoreGradeBadge.style.background = 'var(--bg-context-light)';
      scoreSummaryTitle.textContent = `총 ${issues.length}건의 교정 권장 사항 발견`;
      scoreSummaryDesc.textContent = '전반적인 문제의식과 문장력은 훌륭하며, 세부적인 맞춤법 및 띄어쓰기를 다듬으면 완성도가 완벽해집니다.';
    } else {
      scoreRingProgress.style.stroke = '#ef4444';
      scoreGradeBadge.textContent = '정밀 교정 권장';
      scoreGradeBadge.style.color = '#ef4444';
      scoreGradeBadge.style.background = 'var(--bg-spelling-light)';
      scoreSummaryTitle.textContent = `총 ${issues.length}건의 다차원 오류 감지`;
      scoreSummaryDesc.textContent = "상단의 [전체 교정 적용]을 누르거나 '문장별 교정 뷰'를 통해 줄 단위로 즉시 수정해 보세요.";
    }

    const spellingScore = Math.max(0, 100 - (spellingIssues.length * 15));
    metricSpellingScore.textContent = `${spellingScore}%`;
    metricSpellingCount.textContent = `오류 ${spellingIssues.length}건`;
    metricSpellingBar.style.width = `${spellingScore}%`;

    const spacingScore = Math.max(0, 100 - (spacingIssues.length * 12));
    metricSpacingScore.textContent = `${spacingScore}%`;
    metricSpacingCount.textContent = `오류 ${spacingIssues.length}건`;
    metricSpacingBar.style.width = `${spacingScore}%`;

    const contextScore = Math.max(0, 100 - (contextIssues.length * 18));
    metricContextScore.textContent = `${contextScore}%`;
    metricContextCount.textContent = `비문·만연체 ${contextIssues.length}건`;
    metricContextBar.style.width = `${contextScore}%`;

    const uniqueWords = new Set(words.map(w => w.replace(/[^가-힣a-zA-Z]/g, ''))).size;
    const ttr = wordCount > 0 ? Math.min(100, Math.round((uniqueWords / wordCount) * 100)) : 0;
    
    let advancedFoundCount = 0;
    ADVANCED_VOCAB_LEXICON.forEach(lex => {
      if (text.includes(lex)) advancedFoundCount++;
    });

    let vocabLevelText = '보통 수준';
    if (advancedFoundCount >= 4 || ttr >= 70) vocabLevelText = '학술·문학적 격조';
    else if (advancedFoundCount >= 2 || ttr >= 50) vocabLevelText = '다채로운 어휘';

    metricVocabScore.textContent = vocabLevelText;
    metricVocabTTR.textContent = `어휘 다양성 ${ttr}% (고급어 ${advancedFoundCount}종)`;
    metricVocabBar.style.width = `${Math.min(100, Math.max(30, ttr + advancedFoundCount * 10))}%`;

    const basicPct = Math.max(20, 100 - (advancedFoundCount * 12 + Math.floor(ttr * 0.4)));
    const advPct = Math.min(50, Math.max(10, advancedFoundCount * 10 + 5));
    const interPct = Math.max(10, 100 - basicPct - advPct);

    vocabBasicPct.textContent = `${basicPct}%`;
    vocabInterPct.textContent = `${interPct}%`;
    vocabAdvPct.textContent = `${advPct}%`;

    vocabBasicBar.style.width = `${basicPct}%`;
    vocabInterBar.style.width = `${interPct}%`;
    vocabAdvBar.style.width = `${advPct}%`;

    generateEditorialCritique(text, issues, score, advancedFoundCount, ttr);
  }

  function generateEditorialCritique(text, issues, score, advCount, ttr) {
    if (!text.trim()) {
      editorialReviewText.textContent = "글을 작성하거나 상단의 예시 글을 선택하면, 인문학적 어조와 문맥의 결을 살린 맞춤형 심층 조언이 생성됩니다.";
      return;
    }

    let review = "";
    if (issues.length === 0) {
      review = `✨ [총평: 탁월한 문장력과 정밀한 어조]\n국립국어원 어문 규범에 완벽히 부합하며, 어휘 선택과 단락 간 논리 전개가 매우 탄탄합니다. 인문학적 통찰이 잘 드러나 독자에게 깊은 설득력을 줍니다.`;
    } else {
      const topIssues = [];
      if (issues.some(i => i.type === 'spelling')) topIssues.push("맞춤법 및 표준어 규범");
      if (issues.some(i => i.type === 'spacing')) topIssues.push("의존명사/조사 띄어쓰기");
      if (issues.some(i => i.type === 'context')) topIssues.push("이중피동 및 문맥 호응");
      if (issues.some(i => i.type === 'vocab')) topIssues.push("인문학적 고급 어휘 치환");

      review = `📖 [문학·인문학 관점 심층 다차원 피드백]\n\n`;
      review += `🌟 **1. 글의 돋보이는 강점 (잘 쓰여진 부분):**\n`;
      if (wellWrittenHighlights.length > 0) {
        wellWrittenHighlights.forEach((p, idx) => {
          review += `• **[${p.tag}]** “${p.sentence}”\n  ↳ ${p.feedback}\n`;
        });
      } else {
        review += `• 주제 의식이 뚜렷하며 글의 전반적인 전달력이 양호합니다.\n`;
      }
      review += `\n`;

      if (awkwardFlowIssues.length > 0) {
        review += `⚠️ **2. 문맥상 어색한 부분 및 흐름 취약점:**\n`;
        awkwardFlowIssues.forEach((a, idx) => {
          review += `• **[${a.tag}]** ${a.problem}\n  ↳ 💡 **개선 조언:** ${a.solution}\n`;
        });
        review += `\n`;
      }

      review += `🔧 **3. 세부 규범 교정 필요 영역 (${topIssues.join(', ')}):**\n`;
      if (issues.some(i => i.tag.includes('되/돼'))) {
        review += `• '되'와 '돼'의 혼동을 바르게 잡으면 글의 신뢰도가 한층 높아집니다.\n`;
      }
      if (issues.some(i => i.tag.includes('의존명사'))) {
        review += `• '수', '것', '때', '만큼' 등 의존명사 띄어쓰기를 철저히 준수하세요.\n`;
      }
      if (issues.some(i => i.tag === '이중피동')) {
        review += `• 피동 표현('-어지다', '-되어지다')을 줄이고 능동적 서술어를 사용하면 화자의 주체성과 문장의 탄력이 살아납니다.\n`;
      }
      if (advCount >= 3) {
        review += `• 학술·인문학적 어휘가 적절히 배치되어 글의 품격이 돋보입니다.\n`;
      } else {
        review += `• 상투적인 서술어 대신 제안된 '고찰하다', '함의하다', '투영하다' 등의 다채로운 유의어를 활용해 보세요.\n`;
      }
    }

    editorialReviewText.innerHTML = review.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  function resetDiagnostics() {
    charCountEl.textContent = '0';
    wordCountEl.textContent = '0';
    sentenceCountEl.textContent = '0';
    readingTimeEl.textContent = '0초';

    countSpellingBadge.textContent = '0';
    countSpacingBadge.textContent = '0';
    countContextBadge.textContent = '0';
    countVocabBadge.textContent = '0';

    if (tabPraiseCount) tabPraiseCount.textContent = '0';
    if (tabAwkwardCount) tabAwkwardCount.textContent = '0';
    if (jumpPraiseCount) jumpPraiseCount.textContent = '0';
    if (jumpAwkwardCount) jumpAwkwardCount.textContent = '0';
    tabSpellingCount.textContent = '0';
    tabSpacingCount.textContent = '0';
    tabContextCount.textContent = '0';
    tabVocabCount.textContent = '0';

    overallScoreVal.textContent = '100';
    scoreRingProgress.style.strokeDashoffset = '0';
    scoreGradeBadge.textContent = '대기 중';
    scoreSummaryTitle.textContent = '글을 입력해 주세요';
    scoreSummaryDesc.textContent = '글을 작성하면 맞춤법, 띄어쓰기, 맥락, 어휘 수준을 실시간으로 다차원 검사합니다.';

    editorAnnotationView.innerHTML = '';
    
    renderEmptyState(praiseCardsContainer, '글을 작성하시면 잘 쓰여진 부분에 대한 칭찬 피드백이 생성됩니다.');
    renderEmptyState(awkwardCardsContainer, '문맥이나 흐름상 어색한 문장이 발견되지 않았습니다.');
    renderEmptyState(spellingIssuesList, '맞춤법 오류가 발견되지 않았습니다.');
    renderEmptyState(spacingIssuesList, '띄어쓰기 오류가 발견되지 않았습니다.');
    renderEmptyState(contextIssuesList, '맥락이나 문장 흐름상의 결함이 발견되지 않았습니다.');
    renderEmptyState(vocabIssuesList, '추천할 어휘 제안 사항이 없습니다.');

    diffOriginalText.textContent = '';
    diffFixedText.textContent = '';
    diffOrigLen.textContent = '0자';
    diffFixedLen.textContent = '0자';
  }

  function renderEmptyState(container, message) {
    if (!container) return;
    container.innerHTML = `
      <div class="empty-issue-state">
        <i data-lucide="check-circle" class="empty-icon text-green"></i>
        <p>${message}</p>
      </div>
    `;
    refreshIcons();
  }

  // =========================================================================
  // 9. Render Right Panel Issue Cards (Vertical Clean Layout, No Overlap)
  // =========================================================================
  function renderIssueLists(issues) {
    const spellingIssues = issues.filter(i => i.type === 'spelling');
    const spacingIssues = issues.filter(i => i.type === 'spacing');
    const contextIssues = issues.filter(i => i.type === 'context');
    const vocabIssues = issues.filter(i => i.type === 'vocab');

    renderIssueGroup(spellingIssuesList, spellingIssues, '맞춤법 오류가 없습니다.');
    renderIssueGroup(spacingIssuesList, spacingIssues, '띄어쓰기 오류가 없습니다.');
    renderIssueGroup(contextIssuesList, contextIssues, '맥락 및 흐름상 오류가 없습니다.');
    renderIssueGroup(vocabIssuesList, vocabIssues, '추천 어휘 제안이 없습니다.');
  }

  function renderIssueGroup(container, groupIssues, emptyMsg) {
    if (!container) return;
    if (groupIssues.length === 0) {
      renderEmptyState(container, emptyMsg);
      return;
    }

    container.innerHTML = groupIssues.map(issue => `
      <div class="issue-card type-${issue.type}" id="card_${issue.id}">
        <div class="issue-header">
          <span class="issue-tag tag-${issue.type}">${issue.tag}</span>
          <button class="btn-issue-apply" data-issue-id="${issue.id}">
            <i data-lucide="check"></i> 교정 적용
          </button>
        </div>

        <div class="issue-compare-vertical">
          <div class="compare-row-orig">
            <span class="badge-lbl">원래 표현</span>
            <span class="text-val">${escapeHtml(issue.original)}</span>
          </div>
          <div class="compare-arrow-divider">
            <i data-lucide="arrow-down"></i> 수정 권장
          </div>
          <div class="compare-row-fixed">
            <span class="badge-lbl">추천 교정</span>
            <span class="text-val">${escapeHtml(issue.suggestion)}</span>
          </div>
        </div>

        <div class="issue-desc">
          <strong>진단 사유:</strong> ${escapeHtml(issue.reason)}
        </div>
      </div>
    `).join('');

    refreshIcons();

    container.querySelectorAll('.btn-issue-apply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.issueId;
        applySingleFix(id);
      });
    });
  }

  // =========================================================================
  // 10. Single & Batch Fix Logic
  // =========================================================================
  function applySingleFix(issueId) {
    const issue = activeIssues.find(i => i.id === issueId);
    if (!issue) return;

    let before = '';
    let after = '';
    const cleanSuggestion = issue.suggestion.split('/')[0].trim();

    if (currentText.substring(issue.index, issue.index + issue.length) === issue.original) {
      before = currentText.substring(0, issue.index);
      after = currentText.substring(issue.index + issue.length);
    } else {
      const foundIdx = currentText.indexOf(issue.original);
      if (foundIdx !== -1) {
        before = currentText.substring(0, foundIdx);
        after = currentText.substring(foundIdx + issue.original.length);
      } else {
        showToast('해당 텍스트 위치를 찾을 수 없습니다.', 'info');
        return;
      }
    }

    currentText = before + cleanSuggestion + after;
    editorInput.value = currentText;
    analyzeText(currentText);
    showToast(`'${cleanSuggestion}'(으)로 교정되었습니다.`, 'success');
  }

  function applyBatchFixByType(type) {
    const targets = activeIssues.filter(i => i.type === type);
    if (targets.length === 0) {
      showToast('적용할 교정 항목이 없습니다.', 'info');
      return;
    }

    let fixedText = currentText;
    targets.sort((a, b) => b.index - a.index);
    targets.forEach(issue => {
      const cleanSuggestion = issue.suggestion.split('/')[0].trim();
      if (fixedText.substring(issue.index, issue.index + issue.length) === issue.original) {
        const before = fixedText.substring(0, issue.index);
        const after = fixedText.substring(issue.index + issue.length);
        fixedText = before + cleanSuggestion + after;
      }
    });

    currentText = fixedText;
    editorInput.value = currentText;
    analyzeText(currentText);
    showToast(`${targets.length}건의 항목이 일괄 교정되었습니다.`, 'success');
  }

  function applyAllFixes() {
    if (activeIssues.length === 0) {
      showToast('교정할 오류가 없습니다. 글이 이미 완벽합니다!', 'info');
      return;
    }

    let fixedText = currentText;
    const sorted = [...activeIssues].sort((a, b) => b.index - a.index);
    sorted.forEach(issue => {
      const cleanSuggestion = issue.suggestion.split('/')[0].trim();
      if (fixedText.substring(issue.index, issue.index + issue.length) === issue.original) {
        const before = fixedText.substring(0, issue.index);
        const after = fixedText.substring(issue.index + issue.length);
        fixedText = before + cleanSuggestion + after;
      }
    });

    const count = activeIssues.length;
    currentText = fixedText;
    editorInput.value = currentText;
    analyzeText(currentText);
    showToast(`총 ${count}건의 모든 다차원 오류를 완벽하게 교정했습니다!`, 'success');
  }

  // =========================================================================
  // 11. Diff View Rendering
  // =========================================================================
  function renderDiffView(original, issues) {
    diffOrigLen.textContent = `${original.length}자`;
    
    let fixed = original;
    const sorted = [...issues].sort((a, b) => b.index - a.index);
    sorted.forEach(issue => {
      const cleanSuggestion = issue.suggestion.split('/')[0].trim();
      if (fixed.substring(issue.index, issue.index + issue.length) === issue.original) {
        const before = fixed.substring(0, issue.index);
        const after = fixed.substring(issue.index + issue.length);
        fixed = before + cleanSuggestion + after;
      }
    });

    diffFixedLen.textContent = `${fixed.length}자`;

    let origHtml = '';
    let lastIdx = 0;
    const forwardIssues = [...issues].sort((a, b) => a.index - b.index);
    forwardIssues.forEach(issue => {
      if (issue.index > lastIdx) {
        origHtml += escapeHtml(original.substring(lastIdx, issue.index));
      }
      origHtml += `<span class="diff-highlight-del">${escapeHtml(issue.original)}</span>`;
      lastIdx = issue.index + issue.length;
    });
    if (lastIdx < original.length) {
      origHtml += escapeHtml(original.substring(lastIdx));
    }
    diffOriginalText.innerHTML = origHtml || '<span class="text-muted">내용 없음</span>';
    diffFixedText.innerHTML = escapeHtml(fixed).replace(/\n/g, '<br>') || '<span class="text-muted">내용 없음</span>';
  }

  // =========================================================================
  // 12. View Mode Switcher
  // =========================================================================
  viewModeTextBtn.addEventListener('click', () => {
    currentViewMode = 'text';
    viewModeTextBtn.classList.add('active');
    viewModeAnnotationBtn.classList.remove('active');
    editorInput.style.display = 'block';
    editorAnnotationView.style.display = 'none';
  });

  viewModeAnnotationBtn.addEventListener('click', () => {
    currentViewMode = 'annotation';
    viewModeAnnotationBtn.classList.add('active');
    viewModeTextBtn.classList.remove('active');
    editorInput.style.display = 'none';
    editorAnnotationView.style.display = 'flex';
    renderAnnotationView(currentText, activeIssues);
  });

  // =========================================================================
  // 13. Event Listeners
  // =========================================================================
  let inputTimer = null;
  editorInput.addEventListener('input', (e) => {
    currentText = e.target.value;
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      analyzeText(currentText);
    }, 80);
  });

  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sampleKey = e.currentTarget.dataset.sample;
      if (SAMPLES[sampleKey]) {
        currentText = SAMPLES[sampleKey];
        editorInput.value = currentText;
        analyzeText(currentText);
        showToast(`'${e.currentTarget.textContent}' 예시 글을 불러왔습니다.`, 'info');
      }
    });
  });

  document.getElementById('applyAllBtn').addEventListener('click', applyAllFixes);
  
  const applyAllSpellingBtn = document.getElementById('applyAllSpellingBtn');
  if (applyAllSpellingBtn) applyAllSpellingBtn.addEventListener('click', () => applyBatchFixByType('spelling'));

  const applyAllSpacingBtn = document.getElementById('applyAllSpacingBtn');
  if (applyAllSpacingBtn) applyAllSpacingBtn.addEventListener('click', () => applyBatchFixByType('spacing'));

  const applyAllContextBtn = document.getElementById('applyAllContextBtn');
  if (applyAllContextBtn) applyAllContextBtn.addEventListener('click', () => applyBatchFixByType('context'));

  document.getElementById('copyResultBtn').addEventListener('click', () => {
    let fixed = currentText;
    const sorted = [...activeIssues].sort((a, b) => b.index - a.index);
    sorted.forEach(issue => {
      const cleanSuggestion = issue.suggestion.split('/')[0].trim();
      if (fixed.substring(issue.index, issue.index + issue.length) === issue.original) {
        const before = fixed.substring(0, issue.index);
        const after = fixed.substring(issue.index + issue.length);
        fixed = before + cleanSuggestion + after;
      }
    });

    navigator.clipboard.writeText(fixed).then(() => {
      showToast('교정된 본문이 클립보드에 복사되었습니다.', 'success');
    }).catch(() => {
      showToast('클립보드 복사에 실패했습니다.', 'info');
    });
  });

  const copyDiffResultBtn = document.getElementById('copyDiffResultBtn');
  if (copyDiffResultBtn) {
    copyDiffResultBtn.addEventListener('click', () => {
      document.getElementById('copyResultBtn').click();
    });
  }

  document.getElementById('exportReportBtn').addEventListener('click', () => {
    if (!currentText.trim()) {
      showToast('출력할 분석 내용이 없습니다.', 'info');
      return;
    }

    const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    let reportMd = `# [문맥과 결] AI 글 다차원 오류 정밀 진단 & 칭찬 보고서\n\n`;
    reportMd += `- **검사 일시**: ${dateStr}\n`;
    reportMd += `- **프로젝트 기획**: 손준혁 (문학/인문학 계열)\n`;
    reportMd += `- **종합 완성도 점수**: ${overallScoreVal.textContent}점 / 100점 (${scoreGradeBadge.textContent})\n`;
    reportMd += `- **글자 수**: 공백 포함 ${charCountEl.textContent}자\n`;
    reportMd += `- **단어 및 문장 수**: ${wordCountEl.textContent}단어 / ${sentenceCountEl.textContent}문장\n\n`;
    
    reportMd += `## 1. 🌟 잘 쓰여진 우수 문장 및 찬사 피드백\n`;
    if (wellWrittenHighlights.length > 0) {
      wellWrittenHighlights.forEach((p, idx) => {
        reportMd += `${idx + 1}. **[${p.tag}]** "${p.sentence}"\n   - 피드백: ${p.feedback}\n`;
      });
      reportMd += `\n`;
    }

    reportMd += `## 2. 4대 영역별 진단 지표\n`;
    reportMd += `- 맞춤법 정확도: ${metricSpellingScore.textContent} (${metricSpellingCount.textContent})\n`;
    reportMd += `- 띄어쓰기 정밀도: ${metricSpacingScore.textContent} (${metricSpacingCount.textContent})\n`;
    reportMd += `- 문맥 흐름도 & 가독성: ${metricContextScore.textContent} (${metricContextCount.textContent})\n`;
    reportMd += `- 어휘 수준 및 다양성: ${metricVocabScore.textContent} (${metricVocabTTR.textContent})\n\n`;
    
    reportMd += `## 3. 발견된 세부 교정 항목 목록 (총 ${activeIssues.length}건)\n`;
    if (activeIssues.length === 0) {
      reportMd += `> 발견된 오류가 없습니다. 글의 상태가 매우 훌륭합니다.\n\n`;
    } else {
      activeIssues.forEach((issue, idx) => {
        reportMd += `${idx + 1}. **[${issue.tag}]** 원문: \`${issue.original}\` → 추천: \`${issue.suggestion}\`\n   - 진단 사유: ${issue.reason}\n`;
      });
      reportMd += `\n`;
    }

    reportMd += `## 4. 원문 텍스트\n\`\`\`\n${currentText}\n\`\`\`\n`;

    const blob = new Blob([reportMd], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `글_정밀진단서_손준혁_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    showToast('진단서 보고서가 마크다운(.md) 파일로 다운로드되었습니다.', 'success');
  });

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  const btnJumpToSpelling = document.getElementById('btnJumpToSpelling');
  if (btnJumpToSpelling) {
    btnJumpToSpelling.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-spelling"]').click();
    });
  }

  const btnJumpToSpacing = document.getElementById('btnJumpToSpacing');
  if (btnJumpToSpacing) {
    btnJumpToSpacing.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-spacing"]').click();
    });
  }

  const btnJumpToContext = document.getElementById('btnJumpToContext');
  if (btnJumpToContext) {
    btnJumpToContext.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-context"]').click();
    });
  }

  const btnJumpToPraise = document.getElementById('btnJumpToPraise');
  if (btnJumpToPraise) {
    btnJumpToPraise.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-praise"]').click();
    });
  }

  const btnJumpToAwkward = document.getElementById('btnJumpToAwkward');
  if (btnJumpToAwkward) {
    btnJumpToAwkward.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-awkward"]').click();
    });
  }

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('theme-dark')) {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      showToast('라이트 모드로 전환되었습니다.', 'info');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      showToast('다크 모드로 전환되었습니다.', 'info');
    }
  });

  const fontSansBtn = document.getElementById('fontSansBtn');
  const fontSerifBtn = document.getElementById('fontSerifBtn');

  fontSansBtn.addEventListener('click', () => {
    fontSansBtn.classList.add('active');
    fontSerifBtn.classList.remove('active');
    document.body.classList.remove('font-mode-serif');
    document.body.classList.add('font-mode-sans');
  });

  fontSerifBtn.addEventListener('click', () => {
    fontSerifBtn.classList.add('active');
    fontSansBtn.classList.remove('active');
    document.body.classList.remove('font-mode-sans');
    document.body.classList.add('font-mode-serif');
  });

  const fontSizeDisplay = document.getElementById('fontSizeDisplay');
  document.getElementById('increaseFontBtn').addEventListener('click', () => {
    if (fontSize < 24) {
      fontSize += 2;
      editorInput.style.fontSize = `${fontSize}px`;
      fontSizeDisplay.textContent = `${fontSize}px`;
    }
  });

  document.getElementById('decreaseFontBtn').addEventListener('click', () => {
    if (fontSize > 12) {
      fontSize -= 2;
      editorInput.style.fontSize = `${fontSize}px`;
      fontSizeDisplay.textContent = `${fontSize}px`;
    }
  });

  document.getElementById('clearTextBtn').addEventListener('click', () => {
    if (editorInput.value.trim() && confirm('작성 중인 모든 글을 지우시겠습니까?')) {
      currentText = '';
      editorInput.value = '';
      analyzeText('');
      showToast('에디터 내용이 초기화되었습니다.', 'info');
    }
  });

  const focusModeBtn = document.getElementById('focusModeBtn');
  const workspaceEditor = document.querySelector('.workspace-editor');
  focusModeBtn.addEventListener('click', () => {
    isFocusMode = !isFocusMode;
    workspaceEditor.classList.toggle('focus-mode', isFocusMode);
    if (isFocusMode) {
      showToast('집중 글쓰기 모드가 활성화되었습니다. (다시 누르면 해제)', 'info');
    }
  });

  const projectInfoModal = document.getElementById('projectInfoModal');
  const creatorBadgeBtn = document.getElementById('creatorBadgeBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const confirmModalBtn = document.getElementById('confirmModalBtn');

  creatorBadgeBtn.addEventListener('click', () => {
    projectInfoModal.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => {
    projectInfoModal.classList.remove('active');
  });

  confirmModalBtn.addEventListener('click', () => {
    projectInfoModal.classList.remove('active');
  });

  projectInfoModal.addEventListener('click', (e) => {
    if (e.target === projectInfoModal) {
      projectInfoModal.classList.remove('active');
    }
  });

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // =========================================================================
  // 14. Initial Load
  // =========================================================================
  currentText = SAMPLES.essay;
  editorInput.value = currentText;
  analyzeText(currentText);
});
