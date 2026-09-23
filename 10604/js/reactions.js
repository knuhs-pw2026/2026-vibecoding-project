/**
 * reactions.js - 화학 반응 규칙 엔진 및 교과서 복습 프리셋
 * 물질 조합, 가열 조건에 따른 반응 판단, 물리화학적 결과 도출 및 심화 학습 데이터 제공
 */

const REACTIONS = [
  // 1. 산·염기 중화 반응 (염산 + 수산화나트륨)
  {
    id: 'neutralization_hcl_naoh',
    title: '염산과 수산화나트륨의 중화 반응',
    category: '중화 반응',
    curriculumGrade: '중2 과학 / 통합과학 / 화학I',
    reactants: ['HCl', 'NaOH'],
    requiresHeat: false,
    equation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) + 열',
    netIonicEquation: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
    effect: {
      liquidColor: 'rgba(235, 245, 255, 0.4)',
      indicatorColors: {
        'Phenolphthalein': 'rgba(235, 245, 255, 0.4)', // 중성이므로 무색 투명
        'BTB': '#10b981' // 중성이므로 녹색
      },
      bubbles: 'none',
      tempDelta: 15, // 중화열 발생 (발열 반응)
      flame: null,
      precipitate: null,
      smoke: 'light',
      sound: 'fizz',
      description: '무색의 염산과 수산화나트륨이 만나 물과 염(NaCl)을 생성하며 따뜻한 중화열을 방출합니다.'
    },
    deepDive: {
      mechanism: '수소 이온(H⁺)과 수산화 이온(OH⁻)이 1:1의 개수 비로 결합하여 안정한 물 분자(H₂O)를 형성합니다. 구경꾼 이온인 Na⁺와 Cl⁻는 반응하지 않고 수용액에 이온 상태로 남아 있습니다.',
      energyChange: '발열 반응 (Exothermic reaction) - 결합이 형성되면서 약 57.3 kJ/mol의 중화열이 방출되어 비커의 온도가 올라갑니다.',
      safetyNote: '【학교 실험 위험성】 진한 염산(강산)과 진한 가성소다(강염기)는 모두 피부와 단백질을 급격히 부식시킵니다. 중화 시 농도가 짙으면 순간적인 열 발생으로 용액이 비커 밖으로 튈 위험이 있어 학교에서는 극도로 묽힌(0.1M 이하) 용액만 사용해야 합니다.',
      realLifeExample: '위산(염산)이 과다 분비되어 속이 쓰릴 때 염기성 제산제(수산화마그네슘 등)를 복용하여 중화시키는 원리와 동일합니다.'
    }
  },

  // 2. 알칼리 금속과 물의 반응 (나트륨 + 물)
  {
    id: 'na_water_explosion',
    title: '나트륨과 물의 격렬한 반응 (알칼리 금속)',
    category: '산화·환원 반응',
    curriculumGrade: '중2 물질의 특성 / 통합과학 1단원 주기율표',
    reactants: ['Na', 'H2O'],
    requiresHeat: false,
    equation: '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)↑ + 열',
    netIonicEquation: '2Na(s) + 2H₂O(l) → 2Na⁺(aq) + 2OH⁻(aq) + H₂(g)↑',
    effect: {
      liquidColor: 'rgba(240, 245, 250, 0.5)',
      indicatorColors: {
        'Phenolphthalein': '#ec4899', // 생성된 강염기 NaOH로 인해 핫핑크
        'BTB': '#3b82f6' // 염기성 파란색
      },
      bubbles: 'violent',
      tempDelta: 40,
      flame: 'yellow_sparks',
      precipitate: null,
      smoke: 'heavy',
      sound: 'explosion',
      description: '나트륨 조각이 물 위에서 통통 튀며 노란 불꽃과 쉭 소리를 내고, 수소 기체를 뿜어내며 격렬히 폭발합니다.'
    },
    deepDive: {
      mechanism: '나트륨은 최외각 전자 1개를 물 분자에게 매우 쉽게 넘겨주며 산화되어 Na⁺가 됩니다. 전자를 받은 물은 환원되어 가연성 수소 기체(H₂)와 수산화 이온(OH⁻)을 생성합니다.',
      energyChange: '격렬한 발열 반응 - 발생하는 열이 너무 커서 방출된 수소 기체가 공기 중 산소와 만나 스스로 불이 붙어 노란 나트륨 특유의 불꽃색을 내며 폭발합니다.',
      safetyNote: '【학교 실험 위험성】 나트륨 덩어리를 쌀알 크기보다 크게 넣으면 비커가 산산조각 나며 튀어 올라 화상 및 실명 사고를 일으킵니다. 실제로 다수의 학교에서 안전사고 우려로 직접 시연이 전면 금지된 가장 위험한 실험 중 하나입니다.',
      realLifeExample: '원자력 발전소의 고속증식로에서 액체 나트륨을 냉각재로 쓸 때 누출 방지가 최고의 안전 과제인 이유입니다.'
    }
  },

  // 3. 앙금 생성 반응 (질산은 + 염화나트륨)
  {
    id: 'precipitate_agcl',
    title: '염화은(AgCl) 백색 앙금 생성 반응',
    category: '침전(앙금) 생성 반응',
    curriculumGrade: '중2 물질의 구성 / 이온의 검출',
    reactants: ['AgNO3', 'NaCl'],
    requiresHeat: false,
    equation: 'AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq)',
    netIonicEquation: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)↓',
    effect: {
      liquidColor: 'rgba(248, 250, 252, 0.85)',
      bubbles: 'none',
      tempDelta: 1,
      flame: null,
      precipitate: 'white',
      precipitateColor: '#ffffff',
      smoke: null,
      sound: 'drop',
      description: '투명했던 두 용액이 섞이자마자 우유처럼 불투명한 순백색의 앙금(AgCl)이 생겨 바닥으로 가라앉습니다.'
    },
    deepDive: {
      mechanism: '은 이온(Ag⁺)과 염화 이온(Cl⁻) 사이의 정전기적 인력이 물 분자와의 인력보다 훨씬 강하기 때문에, 수용액에 녹아있지 못하고 결정 격자를 이루며 고체(앙금)로 가라앉습니다.',
      energyChange: '엔탈피 변화가 거의 없는 상온 이온 결합 침전 반응입니다.',
      safetyNote: '【학교 실험 위험성】 질산은(AgNO₃)은 피부에 묻으면 체온과 단백질, 자외선에 의해 은(Ag)으로 환원되어 피부가 까맣게 착색됩니다. 비누로 씻어도 며칠 동안 지워지지 않으며, 은 화합물은 환경오염 폐수 기준이 엄격합니다.',
      realLifeExample: '바닷물이나 수돗물 속에 염소(소금 성분)가 들어있는지 검출할 때 질산은 용액 몇 방울을 떨어뜨려 확인합니다.'
    }
  },

  // 4. 앙금 생성 반응 (질산납 + 아이오딘화칼륨)
  {
    id: 'precipitate_pbi2',
    title: '아이오딘화납(PbI₂) 황금빛 노란 앙금 생성',
    category: '침전(앙금) 생성 반응',
    curriculumGrade: '중2 이온 검출 / 고등 화학I 화학 반응식',
    reactants: ['Pb(NO3)2', 'KI'],
    requiresHeat: false,
    equation: 'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s)↓ + 2KNO₃(aq)',
    netIonicEquation: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)↓',
    effect: {
      liquidColor: 'rgba(254, 240, 138, 0.4)',
      bubbles: 'none',
      tempDelta: 1,
      flame: null,
      precipitate: 'yellow',
      precipitateColor: '#eab308', // 눈부신 황금빛 노란색
      smoke: null,
      sound: 'drop',
      description: '물처럼 투명하던 두 용액이 만나자마자 마치 마법처럼 선명한 황금빛 노란색 앙금이 피어오릅니다.'
    },
    deepDive: {
      mechanism: '납 이온(Pb²⁺) 1개와 아이오딘화 이온(I⁻) 2개가 결합하여 물에 녹지 않는 선명한 노란색의 PbI₂ 결정을 형성합니다.',
      energyChange: '격자 에너지 형성으로 인한 급속 침전 반응입니다.',
      safetyNote: '【학교 실험 위험성】 납(Pb)은 치명적인 중금속입니다. 뇌신경 장애와 납중독을 유발하여 전 세계 교육 현장에서 납 화합물 직접 실험이 금지되고 있으며, 가상 실험 소프트웨어로 대체되고 있습니다.',
      realLifeExample: '과거 미술에서 황금빛 노란색 유화 안료로 쓰였으나, 독성 문제로 현대에는 안전한 합성 안료로 대체되었습니다.'
    }
  },

  // 5. 금속과 산의 반응 (마그네슘 + 묽은 염산)
  {
    id: 'mg_acid_reaction',
    title: '마그네슘과 염산의 수소 기체 발생 반응',
    category: '산화·환원 반응 / 산의 성질',
    curriculumGrade: '중3 산과 염기 / 통합과학 산화환원',
    reactants: ['Mg', 'HCl'],
    requiresHeat: false,
    equation: 'Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)↑ + 열',
    netIonicEquation: 'Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)↑',
    effect: {
      liquidColor: 'rgba(224, 242, 254, 0.5)',
      bubbles: 'rapid',
      tempDelta: 22,
      flame: null,
      precipitate: null,
      smoke: 'light',
      sound: 'fizz',
      description: '마그네슘 리본이 거센 기포와 함께 빠르게 녹아 사라지며, 비커가 뜨거워지고 수소 기체가 방출됩니다.'
    },
    deepDive: {
      mechanism: '마그네슘(Mg)이 수소보다 이온화 경향이 커서 전자 2개를 내어놓고 Mg²⁺로 산화되며, 용액 속의 H⁺ 이온이 전자를 얻어 환원되어 H₂ 수소 기체가 됩니다.',
      energyChange: '활발한 발열 반응으로 비커 벽면이 확연히 따뜻해집니다.',
      safetyNote: '【학교 실험 위험성】 밀폐된 시험관에서 대량 발생시키면 수소 가스 압력으로 고무마개가 발사되거나, 주변 불씨에 의해 폭발 화재가 일어날 수 있습니다.',
      realLifeExample: '산성비가 금속 철골 구조물이나 대리석 조각상을 부식시키는 원리가 바로 산과 금속/탄산염의 반응입니다.'
    }
  },

  // 6. 금속 반응성 및 치환 반응 (철 + 황산구리 수용액)
  {
    id: 'single_displacement_fe_cuso4',
    title: '철과 황산구리의 금속 치환 반응 (이온화 경향)',
    category: '산화·환원 / 치환 반응',
    curriculumGrade: '통합과학 산화환원 / 화학I 금속의 반응성',
    reactants: ['Fe', 'CuSO4'],
    requiresHeat: false,
    equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)↓',
    netIonicEquation: 'Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s)↓',
    effect: {
      liquidColor: '#86efac', // 진한 파란색(Cu²⁺)에서 옅은 황록색(Fe²⁺)으로 탈색
      bubbles: 'none',
      tempDelta: 5,
      flame: null,
      precipitate: 'red_copper',
      precipitateColor: '#b45309', // 붉은색 구리 금속 석출
      smoke: null,
      sound: 'drop',
      description: '푸른빛의 황산구리 용액이 점점 옅은 녹색으로 변하고, 철 표면에 붉은색 구리 금속이 두껍게 석출됩니다.'
    },
    deepDive: {
      mechanism: '철(Fe)의 이온화 경향이 구리(Cu)보다 크므로, 철은 전자를 잃고 용액 속으로 녹아들어가고(Fe²⁺), 구리 이온(Cu²⁺)은 전자를 받아 붉은 금속 구리(Cu)로 환원되어 석출됩니다.',
      energyChange: '완만한 발열 반응입니다.',
      safetyNote: '황산구리는 중금속 수용액으로 피부에 묻지 않게 라텍스 장갑을 착용해야 하며, 실험 폐수는 절대로 싱크대에 버려서는 안 됩니다.',
      realLifeExample: '선박의 강철 선체에 아연 덩어리를 붙여 선체 부식을 방지하는 희생 양극법(음극 방식)의 기초 원리입니다.'
    }
  },

  // 7. 탄산염과 산의 반응 (탄산수소나트륨 + 염산)
  {
    id: 'gas_baking_soda_acid',
    title: '베이킹소다와 염산의 이산화탄소 분출 반응',
    category: '기체 생성 반응',
    curriculumGrade: '중3 화학반응의 규칙성 / 통합과학',
    reactants: ['NaHCO3', 'HCl'],
    requiresHeat: false,
    equation: 'NaHCO₃(s) + HCl(aq) → NaCl(aq) + H₂O(l) + CO₂(g)↑',
    netIonicEquation: 'HCO₃⁻(aq) + H⁺(aq) → H₂O(l) + CO₂(g)↑',
    effect: {
      liquidColor: 'rgba(238, 242, 255, 0.5)',
      bubbles: 'effervescent', // 격렬한 탄산 거품
      tempDelta: -3, // 흡열 성향으로 약간 시원해짐
      flame: null,
      precipitate: null,
      smoke: 'vapor',
      sound: 'fizz',
      description: '흰색 가루가 순식간에 탄산음료 뚜껑을 연 것처럼 거세게 보글거리며 이산화탄소 기체를 뿜어냅니다.'
    },
    deepDive: {
      mechanism: '수소 이온(H⁺)이 탄산수소 이온(HCO₃⁻)과 만나 불안정한 탄산(H₂CO₃)을 형성한 뒤, 순식간에 물(H₂O)과 이산화탄소(CO₂) 기체로 분해됩니다.',
      energyChange: '주변의 열을 약간 흡수하는 반응이라 비커가 미세하게 시원해집니다.',
      safetyNote: '급격한 기체 방출로 용액이 거품과 함께 넘쳐흐를 수 있으므로 넉넉한 크기의 비커를 써야 합니다.',
      realLifeExample: '발포 비타민정, 화산 폭발 모형 실험, 빵을 부풀리는 베이킹파우더의 핵심 화학 원리입니다.'
    }
  },

  // 8. 바륨과 황산의 앙금 반응 (염화바륨 + 황산)
  {
    id: 'precipitate_baso4',
    title: '황산바륨(BaSO₄) 불용성 백색 앙금 반응',
    category: '침전(앙금) 생성 반응',
    curriculumGrade: '중2 이온의 검출 / 화학I',
    reactants: ['BaCl2', 'H2SO4'],
    requiresHeat: false,
    equation: 'BaCl₂(aq) + H₂SO₄(aq) → BaSO₄(s)↓ + 2HCl(aq)',
    netIonicEquation: 'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)↓',
    effect: {
      liquidColor: 'rgba(240, 243, 246, 0.9)',
      bubbles: 'none',
      tempDelta: 2,
      flame: null,
      precipitate: 'dense_white',
      precipitateColor: '#ffffff',
      smoke: null,
      sound: 'drop',
      description: '우윳빛의 짙은 백색 앙금이 쏟아지듯 생성됩니다. 이 앙금은 어떤 강산을 부어도 다시 녹지 않습니다.'
    },
    deepDive: {
      mechanism: '바륨 이온(Ba²⁺)과 황산 이온(SO₄²⁻)의 격자 에너지가 매우 높아 강산인 염산(HCl) 속에서도 전혀 녹지 않는 완벽한 앙금을 형성합니다.',
      energyChange: '침전 형성 에너지 방출.',
      safetyNote: '【학교 실험 위험성】 바륨 이온은 극독성이며 황산은 강부식성입니다. 둘 다 위험물질이라 취급에 극도의 주의가 요구됩니다.',
      realLifeExample: '병원에서 위나 장 X-ray 조영제를 먹을 때 환자가 마시는 흰색 액체가 바로 이 BaSO₄입니다. 앙금이 위산에도 절대 녹지 않아 독성 바륨 이온이 체내에 흡수되지 않고 안전하게 배출되기 때문입니다!'
    }
  },

  // 9. 가열 열분해 반응 (탄산수소나트륨 가열)
  {
    id: 'thermal_decomp_nahco3',
    title: '베이킹소다의 열분해 반응 (가열 필요)',
    category: '분해 반응 / 열분해',
    curriculumGrade: '중3 물질 변화 / 화학I',
    reactants: ['NaHCO3'],
    requiresHeat: true,
    equation: '2NaHCO₃(s) + 열(Δ) → Na₂CO₃(s) + H₂O(g)↑ + CO₂(g)↑',
    netIonicEquation: '2NaHCO₃(s) → Na₂CO₃(s) + H₂O(g) + CO₂(g)',
    effect: {
      liquidColor: 'rgba(255, 255, 255, 0.9)',
      bubbles: 'steady',
      tempDelta: 60,
      flame: null,
      precipitate: 'powder',
      precipitateColor: '#f8fafc',
      smoke: 'heavy_vapor',
      sound: 'hiss',
      description: '분젠 버너로 가열하자 고체에서 수증기와 이산화탄소 기체가 뿜어져 나오며 탄산나트륨으로 분해됩니다.'
    },
    deepDive: {
      mechanism: '열에너지를 공급받아 분자 내 원자 결합이 끊어지며 한 종류의 화합물이 세 종류(고체 탄산나트륨, 기체 수증기, 기체 이산화탄소)로 나뉘는 대표적인 열분해 반응입니다.',
      energyChange: '흡열 반응 (Endothermic reaction) - 외부에서 지속적인 열에너지(버너)를 공급해야만 반응이 지속됩니다.',
      safetyNote: '가열된 시험관 입구를 아래로 살짝 기울이지 않으면 발생한 수증기가 차가운 시험관 바닥으로 흘러 들어가 시험관이 깨질 수 있습니다.',
      realLifeExample: '달고나를 만들 때 설탕에 소다를 넣으면 부풀어 오르는 원리이자, 가루 소화기(1종 소화약제)의 원리입니다.'
    }
  },

  // 10. 수소와 산소의 폭명 반응 (수소 + 산소 + 점화열)
  {
    id: 'combustion_h2_o2',
    title: '수소와 산소의 폭명 반응 (물 합성)',
    category: '산화·환원 / 화합 반응',
    curriculumGrade: '중3 화학반응의 규칙성 / 통합과학',
    reactants: ['H2', 'O2'],
    requiresHeat: true,
    equation: '2H₂(g) + O₂(g) + 점화(Δ) → 2H₂O(l) + 거대한 열·빛',
    netIonicEquation: '2H₂ + O₂ → 2H₂O',
    effect: {
      liquidColor: 'rgba(215, 235, 255, 0.4)',
      bubbles: 'none',
      tempDelta: 80,
      flame: 'explosion_blast',
      precipitate: null,
      smoke: 'steam_flash',
      sound: 'pop_blast',
      description: '쾅! 하는 굉음과 함께 번쩍이는 섬광이 일어나고 비커 내벽에 맑은 물방울(H₂O)이 맺힙니다.'
    },
    deepDive: {
      mechanism: '수소 분자의 H-H 결합과 산소 분자의 O=O 결합이 활성화 에너지를 받아 끊어진 뒤, 훨씬 결합 에너지가 큰 O-H 결합을 만들며 에너지를 한꺼번에 방출합니다.',
      energyChange: '매우 격렬한 발열 반응으로 285.8 kJ/mol의 엄청난 연소열을 뿜어냅니다.',
      safetyNote: '【학교 실험 위험성】 부피비 2:1 혼합 기체는 소량으로도 귀가 먹먹할 정도의 굉음과 폭풍을 일으킵니다. 방폭 스크린과 귀마개 없이 학교 교실에서 실험하는 것은 금지되어 있습니다.',
      realLifeExample: '우주 왕복선 로켓 발사 시 하얗게 뿜어져 나오는 거대한 연기의 정체가 바로 수소와 산소가 반응해 만들어진 물(수증기)입니다.'
    }
  },

  // 11. 마그네슘 리본 연소 (마그네슘 + 산소 + 점화)
  {
    id: 'mg_combustion',
    title: '마그네슘의 격렬한 백색 연소',
    category: '산화·환원 / 연소 반응',
    curriculumGrade: '중3 화학 반응의 규칙 / 질량 보존 법칙',
    reactants: ['Mg', 'O2'],
    requiresHeat: true,
    equation: '2Mg(s) + O₂(g) + 점화(Δ) → 2MgO(s) + 강렬한 백색광',
    netIonicEquation: '2Mg + O₂ → 2MgO',
    effect: {
      liquidColor: 'rgba(255, 255, 255, 0.8)',
      bubbles: 'none',
      tempDelta: 70,
      flame: 'blinding_white',
      precipitate: 'white_ash',
      precipitateColor: '#ffffff',
      smoke: 'heavy',
      sound: 'crackle',
      description: '선글라스를 쓰지 않으면 쳐다보기 힘들 정도로 눈부신 백색 섬광을 내뿜으며 타오르고 흰색 산화마그네슘 재를 남깁니다.'
    },
    deepDive: {
      mechanism: '마그네슘 원자가 산소 원자에게 전자를 완전히 넘겨주며 강한 이온 결합 물질인 산화마그네슘(MgO) 결정을 형성합니다. 연소 전후 질량을 재면 산소 질량만큼 무거워져 질량 보존 법칙을 증명할 수 있습니다.',
      energyChange: '약 -601.7 kJ/mol의 강력한 발열 반응입니다.',
      safetyNote: '【학교 실험 위험성】 마그네슘 불꽃은 강력한 자외선을 방출하여 맨눈으로 직시하면 망막 손상이나 일시적 실명을 초래할 수 있습니다. 반드시 차광 안경을 써야 합니다.',
      realLifeExample: '야간 조명탄, 불꽃놀이의 흰색 광휘, 과거 초기 카메라의 플래시 파우더로 사용되었습니다.'
    }
  },

  // 12. 구리와 수산화나트륨 침전 (황산구리 + 수산화나트륨)
  {
    id: 'precipitate_cuoh2',
    title: '수산화구리(Cu(OH)₂) 청록색 침전 생성',
    category: '침전(앙금) 생성 반응',
    curriculumGrade: '중2 이온 검출 / 고등 화학',
    reactants: ['CuSO4', 'NaOH'],
    requiresHeat: false,
    equation: 'CuSO₄(aq) + 2NaOH(aq) → Cu(OH)₂(s)↓ + Na₂SO₄(aq)',
    netIonicEquation: 'Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)↓',
    effect: {
      liquidColor: 'rgba(186, 230, 253, 0.4)',
      bubbles: 'none',
      tempDelta: 4,
      flame: null,
      precipitate: 'blue_gel',
      precipitateColor: '#0ea5e9', // 선명한 청록색 젤리 침전
      smoke: null,
      sound: 'drop',
      description: '맑은 푸른색 용액에 수산화나트륨이 닿자마자 몽글몽글한 청록색 젤라틴 형태의 수산화구리 침전물이 응고됩니다.'
    },
    deepDive: {
      mechanism: '구리 이온(Cu²⁺) 1개와 수산화 이온(OH⁻) 2개가 강하게 배위 결합하여 물에 녹지 않는 수산화구리 앙금을 형성합니다.',
      energyChange: '완만한 침전 형성 반응입니다.',
      safetyNote: '수산화나트륨의 단백질 부식성과 구리 화합물의 생체 독성이 결합되어 있어 보호장구 착용이 필수입니다.',
      realLifeExample: '당뇨 환자의 소변 속 포도당을 검출하는 베네딕트 반응(펠링 반응)의 중간 생성물로 매우 유명합니다.'
    }
  }
];

// 교과서 복습 프리셋 (빠른 선택용 데이터)
const CURRICULUM_PRESETS = [
  {
    id: 'preset_neutralization',
    title: '산과 염기의 중화 반응',
    subtitle: '염산 + 수산화나트륨 + 지시약',
    chemicals: ['HCl', 'NaOH', 'BTB'],
    requiresHeat: false,
    badge: '중3/통합과학'
  },
  {
    id: 'preset_na_water',
    title: '알칼리 금속의 물 반응',
    subtitle: '나트륨 + 물 + 페놀프탈레인',
    chemicals: ['Na', 'H2O', 'Phenolphthalein'],
    requiresHeat: false,
    badge: '위험 실험★'
  },
  {
    id: 'preset_agcl_precipitate',
    title: '염화은(AgCl) 백색 앙금',
    subtitle: '질산은 + 소금물(NaCl)',
    chemicals: ['AgNO3', 'NaCl'],
    requiresHeat: false,
    badge: '중2 이온검출'
  },
  {
    id: 'preset_pbi2_gold',
    title: '아이오딘화납 황금 앙금',
    subtitle: '질산납 + 아이오딘화칼륨',
    chemicals: ['Pb(NO3)2', 'KI'],
    requiresHeat: false,
    badge: '맹독성 대체'
  },
  {
    id: 'preset_mg_acid',
    title: '금속과 산의 수소 기체',
    subtitle: '마그네슘 + 묽은 염산',
    chemicals: ['Mg', 'HCl'],
    requiresHeat: false,
    badge: '기체 발생'
  },
  {
    id: 'preset_fe_displacement',
    title: '금속의 이온화와 치환',
    subtitle: '철 + 황산구리 수용액',
    chemicals: ['Fe', 'CuSO4'],
    requiresHeat: false,
    badge: '화학I 필수'
  },
  {
    id: 'preset_baking_acid',
    title: '베이킹소다 탄산 분출',
    subtitle: '탄산수소나트륨 + 염산',
    chemicals: ['NaHCO3', 'HCl'],
    requiresHeat: false,
    badge: '생활 과학'
  },
  {
    id: 'preset_decomp_heat',
    title: '베이킹소다의 열분해',
    subtitle: '탄산수소나트륨 + 버너 가열',
    chemicals: ['NaHCO3'],
    requiresHeat: true,
    badge: '열분해 실험'
  },
  {
    id: 'preset_h2_combustion',
    title: '수소-산소 폭명 반응',
    subtitle: '수소 기체 + 산소 기체 + 점화',
    chemicals: ['H2', 'O2'],
    requiresHeat: true,
    badge: '폭발 시뮬레이션'
  },
  {
    id: 'preset_mg_light',
    title: '마그네슘 백색 섬광 연소',
    subtitle: '마그네슘 + 산소 + 버너 가열',
    chemicals: ['Mg', 'O2'],
    requiresHeat: true,
    badge: '강렬한 빛'
  },
  {
    id: 'preset_ba_sulfate',
    title: '황산바륨 앙금 (조영제)',
    subtitle: '염화바륨 + 황산',
    chemicals: ['BaCl2', 'H2SO4'],
    requiresHeat: false,
    badge: '의약 과학'
  },
  {
    id: 'preset_copper_hydroxide',
    title: '수산화구리 청록색 앙금',
    subtitle: '황산구리 + 수산화나트륨',
    chemicals: ['CuSO4', 'NaOH'],
    requiresHeat: false,
    badge: '색채 침전'
  }
];

/**
 * 반응 판정 함수 (주어진 화학 물질 목록과 가열 여부를 비교하여 적합한 반응을 찾음)
 * @param {Array<string>} chemicalIds - 투입된 시약 ID 배열
 * @param {boolean} isHeated - 버너 가열 여부
 * @returns {Object|null} 매칭된 반응 객체 또는 null
 */
function findReaction(chemicalIds, isHeated) {
  // 중복 제거 및 지시약 제외한 핵심 반응물 집합
  const cleanReactants = chemicalIds.filter(id => {
    const chem = CHEMICALS[id];
    return chem && chem.category !== 'indicator';
  });

  for (const reaction of REACTIONS) {
    // 필수 반응물이 모두 포함되어 있는지 확인
    const hasAllReactants = reaction.reactants.every(r => cleanReactants.includes(r));
    
    if (hasAllReactants) {
      // 가열이 필요한 반응인 경우 가열 상태 확인
      if (reaction.requiresHeat) {
        if (isHeated) return reaction;
      } else {
        return reaction;
      }
    }
  }
  return null;
}
