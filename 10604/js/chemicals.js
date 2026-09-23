/**
 * chemicals.js - 화학 시약 및 물질 데이터베이스
 * 원소, 산, 염기, 염, 지시약, 용매의 물리화학적 속성과 설명 정의
 */

const CHEMICALS = {
  // 용매
  'H2O': {
    id: 'H2O',
    name: '물',
    formula: 'H₂O',
    state: 'l',
    category: 'solvent',
    color: 'rgba(215, 235, 255, 0.35)',
    ph: 7.0,
    temp: 20,
    hazardLevel: 0,
    hazardText: '안전',
    hazardNote: '가장 보편적인 용매이자 생명체의 필수 물질입니다.',
    description: '극성을 띠고 있어 다양한 이온 및 분자 물질을 녹이는 만능 용매입니다.',
    atomicBreakdown: { H: 2, O: 1 }
  },

  // 원소 / 금속 & 비금속
  'Na': {
    id: 'Na',
    name: '나트륨 (소듐)',
    formula: 'Na',
    state: 's',
    category: 'element',
    color: '#d4d8de',
    ph: 7.0,
    hazardLevel: 5,
    hazardText: '격렬 반응 / 인화성',
    hazardNote: '물과 접촉 시 격렬하게 폭발하며 수소 기체와 강염기(NaOH)를 생성합니다. 공기 중 수분만으로도 불이 붙으므로 석유 속에 보관해야 합니다.',
    description: '1족 알칼리 금속으로 전자를 매우 쉽게 잃어 반응성이 매우 큽니다. 칼로 자를 수 있을 정도로 무른 은백색 금속입니다.',
    atomicBreakdown: { Na: 1 }
  },
  'Mg': {
    id: 'Mg',
    name: '마그네슘',
    formula: 'Mg',
    state: 's',
    category: 'element',
    color: '#cbd5e1',
    ph: 7.0,
    hazardLevel: 3,
    hazardText: '강한 백색광 / 가연성',
    hazardNote: '연소 시 눈을 손상시킬 수 있는 강력한 자외선과 백색광을 방출합니다. 산과 반응 시 가연성 수소 기체를 발생시킵니다.',
    description: '2족 알칼리 토금속으로 가볍고 강도가 높으며, 산이나 산소와 활발하게 반응합니다.',
    atomicBreakdown: { Mg: 1 }
  },
  'Fe': {
    id: 'Fe',
    name: '철',
    formula: 'Fe',
    state: 's',
    category: 'element',
    color: '#64748b',
    ph: 7.0,
    hazardLevel: 1,
    hazardText: '안전 (미세분말 시 가연성)',
    hazardNote: '일반 덩어리는 안전하지만, 미세 분말은 공기 중 불꽃에 쉽게 탑니다.',
    description: '가장 널리 쓰이는 전이 금속으로, 산화 환원 반응과 이온 치환 반응 실험에 자주 사용됩니다.',
    atomicBreakdown: { Fe: 1 }
  },
  'Cu': {
    id: 'Cu',
    name: '구리',
    formula: 'Cu',
    state: 's',
    category: 'element',
    color: '#b45309',
    ph: 7.0,
    hazardLevel: 1,
    hazardText: '안전',
    hazardNote: '구리 이온 화합물은 수생 생물에 유해하므로 함부로 방류할 수 없습니다.',
    description: '붉은 광택의 금속으로 전기와 열 전도성이 우수하며, 수소보다 이온화 경향이 작아 묽은 산과 반응하지 않습니다.',
    atomicBreakdown: { Cu: 1 }
  },
  'Zn': {
    id: 'Zn',
    name: '아연',
    formula: 'Zn',
    state: 's',
    category: 'element',
    color: '#94a3b8',
    ph: 7.0,
    hazardLevel: 2,
    hazardText: '가연성 가스 발생 위험',
    hazardNote: '산과 반응하면 수소 기체가 발생하여 화기 주의가 필요합니다.',
    description: '양성 금속으로 산 및 강염기 모두와 반응하며, 갈바니 전지 및 부식 방지 도금에 널리 사용됩니다.',
    atomicBreakdown: { Zn: 1 }
  },
  'H2': {
    id: 'H2',
    name: '수소 기체',
    formula: 'H₂',
    state: 'g',
    category: 'element',
    color: 'rgba(255, 255, 255, 0.1)',
    ph: 7.0,
    hazardLevel: 4,
    hazardText: '폭발성 가스',
    hazardNote: '공기 중 산소와 2:1 부피비로 혼합되어 점화되면 퍽! 소리를 내며 폭발(폭명 반응)합니다.',
    description: '우주에서 가장 풍부하고 가벼운 원소 기체로, 무색무취이며 미래 청정에너지로 주목받습니다.',
    atomicBreakdown: { H: 2 }
  },
  'O2': {
    id: 'O2',
    name: '산소 기체',
    formula: 'O₂',
    state: 'g',
    category: 'element',
    color: 'rgba(147, 197, 253, 0.15)',
    ph: 7.0,
    hazardLevel: 3,
    hazardText: '조연성 (연소 조장)',
    hazardNote: '자체는 타지 않으나 다른 물질의 연소를 폭발적으로 돕습니다.',
    description: '대기 중 약 21%를 차지하는 호흡과 연소의 필수 기체입니다.',
    atomicBreakdown: { O: 2 }
  },

  // 산 (Acids)
  'HCl': {
    id: 'HCl',
    name: '염산 (염화수소 수용액)',
    formula: 'HCl(aq)',
    state: 'aq',
    category: 'acid',
    color: 'rgba(240, 249, 255, 0.6)',
    ph: 1.0,
    hazardLevel: 4,
    hazardText: '강부식성 / 유독 가스',
    hazardNote: '진한 염산은 피부 화상을 유발하고 눈을 실명시킬 수 있으며, 자극성 염화수소 증기를 발생시킵니다.',
    description: '물에 완전히 이온화되는 대표적인 강산으로, 우리 위의 위산 주성분이기도 합니다.',
    atomicBreakdown: { H: 1, Cl: 1 }
  },
  'H2SO4': {
    id: 'H2SO4',
    name: '황산',
    formula: 'H₂SO₄(aq)',
    state: 'aq',
    category: 'acid',
    color: 'rgba(248, 250, 252, 0.7)',
    ph: 0.5,
    hazardLevel: 5,
    hazardText: '극위험 탈수성 / 부식성',
    hazardNote: '강력한 탈수 작용으로 피부나 유기물을 즉시 탄화(숯)시킵니다. 물과 섞을 때 막대한 열이 발생하므로 반드시 물에 황산을 천천히 부어야 합니다.',
    description: '산업의 쌀로 불리는 2가 강산으로, 화학 공업에서 가장 많이 소비되는 화합물 중 하나입니다.',
    atomicBreakdown: { H: 2, S: 1, O: 4 }
  },
  'CH3COOH': {
    id: 'CH3COOH',
    name: '아세트산 (식초 성분)',
    formula: 'CH₃COOH(aq)',
    state: 'aq',
    category: 'acid',
    color: 'rgba(254, 252, 232, 0.6)',
    ph: 3.5,
    hazardLevel: 2,
    hazardText: '자극성 냄새',
    hazardNote: '빙초산은 피부에 자극을 주며 시큼한 냄새가 코와 눈 점막을 자극합니다.',
    description: '물에 일부만 이온화되는 약산으로, 식초의 시큼한 맛을 내는 주성분입니다.',
    atomicBreakdown: { C: 2, H: 4, O: 2 }
  },

  // 염기 (Bases)
  'NaOH': {
    id: 'NaOH',
    name: '수산화나트륨 (가성소다)',
    formula: 'NaOH(aq)',
    state: 'aq',
    category: 'base',
    color: 'rgba(241, 245, 249, 0.7)',
    ph: 13.5,
    hazardLevel: 5,
    hazardText: '단백질 부식 / 실명 위험',
    hazardNote: '단백질을 녹이는 성질이 극도로 강해 피부에 닿으면 미끌거리며 살을 녹이고, 눈에 들어가면 즉각 실명 위험이 있습니다.',
    description: '백색 고체로 공기 중 수분과 이산화탄소를 흡수하며, 비누 제조나 배수관 세정제에 사용되는 대표적 강염기입니다.',
    atomicBreakdown: { Na: 1, O: 1, H: 1 }
  },
  'Ca(OH)2': {
    id: 'Ca(OH)2',
    name: '수산화칼슘 (석회수)',
    formula: 'Ca(OH)₂',
    state: 'aq',
    category: 'base',
    color: 'rgba(248, 250, 252, 0.65)',
    ph: 12.0,
    hazardLevel: 3,
    hazardText: '피부 및 눈 자극',
    hazardNote: '강한 알칼리성을 띠므로 점막 접촉 시 손상을 줍니다.',
    description: '물에 약간 녹는 강염기로, 맑은 석회수는 이산화탄소($CO_2$) 검출 시 뿌옇게 흐려지는 실험에 사용됩니다.',
    atomicBreakdown: { Ca: 1, O: 2, H: 2 }
  },
  'NH3': {
    id: 'NH3',
    name: '암모니아수',
    formula: 'NH₃(aq)',
    state: 'aq',
    category: 'base',
    color: 'rgba(240, 253, 250, 0.6)',
    ph: 10.5,
    hazardLevel: 3,
    hazardText: '극심한 자극성 악취',
    hazardNote: '기화한 암모니아 가스는 호흡기를 심하게 찌르고 눈물을 유발합니다.',
    description: '질소와 수소의 화합물로 물에 녹아 약염기를 띠며, 비료 및 합성 섬유 원료로 쓰입니다.',
    atomicBreakdown: { N: 1, H: 3 }
  },

  // 염 및 수용액 (Salts)
  'AgNO3': {
    id: 'AgNO3',
    name: '질산은 수용액',
    formula: 'AgNO₃(aq)',
    state: 'aq',
    category: 'salt',
    color: 'rgba(248, 250, 252, 0.55)',
    ph: 6.5,
    hazardLevel: 4,
    hazardText: '피부 흑변 / 유독성',
    hazardNote: '피부에 닿아 햇빛을 받으면 은 이온이 환원되어 검은 반점이 생기며 쉽게 지워지지 않습니다. 중금속 독성이 있습니다.',
    description: '염화 이온($Cl^-$)을 만나면 흰색의 불용성 앙금(AgCl)을 만들어 염화 이온 검출에 필수적인 시약입니다.',
    atomicBreakdown: { Ag: 1, N: 1, O: 3 }
  },
  'NaCl': {
    id: 'NaCl',
    name: '염화나트륨 (소금물)',
    formula: 'NaCl(aq)',
    state: 'aq',
    category: 'salt',
    color: 'rgba(241, 245, 249, 0.4)',
    ph: 7.0,
    hazardLevel: 0,
    hazardText: '안전',
    hazardNote: '일상적인 식염으로 안전합니다.',
    description: '나트륨 양이온과 염화 음이온이 이온 결합한 대표적인 중성염입니다.',
    atomicBreakdown: { Na: 1, Cl: 1 }
  },
  'CuSO4': {
    id: 'CuSO4',
    name: '황산구리 수용액',
    formula: 'CuSO₄(aq)',
    state: 'aq',
    category: 'salt',
    color: '#0284c7', // 청량하고 아름다운 파란색
    ph: 5.5,
    hazardLevel: 3,
    hazardText: '중금속 / 수생 유해',
    hazardNote: '삼키면 구토와 복통을 유발하며 수생 생물에 매우 치명적입니다.',
    description: '수화물 상태에서 아름다운 파란색을 띠는 염으로, 이온화 경향 차이를 이용한 금속 치환 반응에 즐겨 쓰입니다.',
    atomicBreakdown: { Cu: 1, S: 1, O: 4 }
  },
  'KI': {
    id: 'KI',
    name: '아이오딘화칼륨 수용액',
    formula: 'KI(aq)',
    state: 'aq',
    category: 'salt',
    color: 'rgba(254, 243, 199, 0.4)',
    ph: 7.0,
    hazardLevel: 1,
    hazardText: '저위험',
    hazardNote: '과량 섭취 시 갑상선에 영향을 줄 수 있습니다.',
    description: '무색의 수용액으로, 납 이온과 반응하면 선명한 황금빛 노란색 앙금($PbI_2$)을 형성합니다.',
    atomicBreakdown: { K: 1, I: 1 }
  },
  'Pb(NO3)2': {
    id: 'Pb(NO3)2',
    name: '질산납 수용액',
    formula: 'Pb(NO₃)₂(aq)',
    state: 'aq',
    category: 'salt',
    color: 'rgba(248, 250, 252, 0.5)',
    ph: 6.0,
    hazardLevel: 5,
    hazardText: '치명적 중금속 독성',
    hazardNote: '납은 체내에 축적되어 신경계 손상(납중독)을 유발하므로 학교 실험실에서 현재는 엄격히 규제되거나 가상 실험으로 대체됩니다.',
    description: '납 이온을 함유한 염으로 아이오딘화 이온과 만나 아름다운 노란색 앙금을 만듭니다.',
    atomicBreakdown: { Pb: 1, N: 2, O: 6 }
  },
  'BaCl2': {
    id: 'BaCl2',
    name: '염화바륨 수용액',
    formula: 'BaCl₂(aq)',
    state: 'aq',
    category: 'salt',
    color: 'rgba(241, 245, 249, 0.45)',
    ph: 6.8,
    hazardLevel: 4,
    hazardText: '심장 독성 / 중금속',
    hazardNote: '바륨 이온은 체내 칼륨 흡수를 방해해 근육 마비와 심장마비를 일으킬 수 있습니다.',
    description: '황산 이온($SO_4^{2-}$)과 반응하면 강산에도 녹지 않는 백색 앙금($BaSO_4$)을 생성하여 황산 이온 검출에 쓰입니다.',
    atomicBreakdown: { Ba: 1, Cl: 2 }
  },
  'Na2CO3': {
    id: 'Na2CO3',
    name: '탄산나트륨 수용액',
    formula: 'Na₂CO₃(aq)',
    state: 'aq',
    category: 'salt',
    color: 'rgba(241, 245, 249, 0.5)',
    ph: 11.5,
    hazardLevel: 2,
    hazardText: '피부 자극성 알칼리',
    hazardNote: '눈에 접촉 시 자극을 주며 약알칼리성을 띱니다.',
    description: '탄산염으로 칼슘 이온이나 바륨 이온과 침전을 형성하며, 산과 반응하면 $CO_2$ 기체를 뿜어냅니다.',
    atomicBreakdown: { Na: 2, C: 1, O: 3 }
  },
  'NaHCO3': {
    id: 'NaHCO3',
    name: '탄산수소나트륨 (베이킹소다)',
    formula: 'NaHCO₃',
    state: 's',
    category: 'salt',
    color: '#ffffff',
    ph: 8.3,
    hazardLevel: 0,
    hazardText: '안전 (식용 가능)',
    hazardNote: '일반적인 식품 첨가물로 인체에 무해합니다.',
    description: '가열하거나 산과 반응하면 이산화탄소($CO_2$) 가스를 뿜어내어 빵을 부풀리거나 소화기에 쓰입니다.',
    atomicBreakdown: { Na: 1, H: 1, C: 1, O: 3 }
  },

  // 지시약 (Indicators)
  'Phenolphthalein': {
    id: 'Phenolphthalein',
    name: '페놀프탈레인 용액',
    formula: 'C₂₀H₁₄O₄',
    state: 'l',
    category: 'indicator',
    color: 'rgba(248, 250, 252, 0.4)',
    ph: 7.0,
    hazardLevel: 1,
    hazardText: '알코올 용매 인화성',
    hazardNote: '에탄올에 녹여 조제하므로 화기 근처 주의가 필요합니다.',
    description: '산성과 중성에서는 무색이지만, pH 8.3 이상의 염기성에서는 선명하고 화려한 붉은색(자홍색)으로 변합니다.',
    indicatorType: 'phenolphthalein'
  },
  'BTB': {
    id: 'BTB',
    name: 'BTB 용액 (브롬티몰블루)',
    formula: 'C₂₇H₂₈Br₂O₅S',
    state: 'l',
    category: 'indicator',
    color: '#10b981', // 기본 중성 초록색
    ph: 7.0,
    hazardLevel: 1,
    hazardText: '안전',
    hazardNote: '미량 사용되므로 안전합니다.',
    description: '산성에서는 노란색, 중성에서는 초록색, 염기성에서는 파란색으로 변하여 용액의 액성을 한눈에 보여주는 지시약입니다.',
    indicatorType: 'btb'
  }
};

// 카테고리 정의
const CATEGORIES = {
  all: '전체 보기',
  element: '원소 & 금속',
  acid: '산 (Acid)',
  base: '염기 (Base)',
  salt: '염 & 수용액',
  indicator: '지시약',
  solvent: '용매'
};
