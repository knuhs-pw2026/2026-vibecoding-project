/**
 * 대한민국 15개정 & 22개정 수학 교육과정 전체 공식 데이터베이스 (총 62종)
 * 중1 ~ 고3(공통수학, 대수, 미적분, 기하, 확통) 전 단원 망라
 */

const MATH_FORMULAS = [
  // =========================================================================
  // 중학교 1학년 (중1)
  // =========================================================================
  {
    id: "sum_interior_angles",
    title: "n각형 내각의 크기의 합",
    curriculum: ["15개정", "22개정"],
    grade: "중1",
    subject: "중1 수학",
    unit: "기본 도형과 작도 - 다각형",
    latex: "180^\\circ \\times (n - 2)",
    coreConcept: "한 꼭짓점에서 대각선을 그어 다각형을 삼각형으로 분할하기",
    prerequisites: "삼각형의 세 내각의 합은 180도",
    description: "모든 볼록 n각형의 내각의 총합이 180*(n-2)가 되는 이유를 삼각형 분할 기법으로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "한 꼭짓점에서 그을 수 있는 대각선의 개수 구하기",
        goal: "n각형의 한 꼭짓점을 택해 그을 수 있는 대각선 수를 셉니다.",
        startExpr: "n\\text{개의 꼭짓점}",
        targetExpr: "\\text{대각선 개수} = n - 3",
        question: "한 꼭짓점에서 자기 자신과 이웃한 두 꼭짓점을 제외하면 몇 개의 대각선을 그을 수 있을까요?",
        options: [
          {
            latex: "n - 3",
            label: "자기 자신과 양옆 이웃 꼭짓점(3개)을 빼므로 (n-3)개이다.",
            isCorrect: true,
            feedback: "정확합니다! 이웃한 꼭짓점과 연결하면 변이 되므로 3개를 뺍니다."
          },
          {
            latex: "n - 1",
            label: "자기 자신만 빼서 (n-1)개이다.",
            isCorrect: false,
            feedback: "양옆 꼭짓점을 연결하면 변이 되므로 대각선이 아닙니다."
          },
          {
            latex: "n",
            label: "n개 전부 그을 수 있다.",
            isCorrect: false,
            feedback: "꼭짓점 개수보다 대각선이 많을 수는 없습니다."
          }
        ],
        aiGuidance: {
          hint: "사각형(n=4)에서는 대각선 1개, 오각형(n=5)에서는 대각선 2개를 그을 수 있습니다.",
          why: "대각선을 그을 때마다 다각형이 삼각형으로 쪼개집니다.",
          commonMistake: "삼각형(n=3)은 대각선이 0개입니다."
        }
      },
      {
        stepNumber: 2,
        title: "쪼개지는 삼각형의 개수와 내각의 합 계산",
        goal: "(n-3)개의 대각선으로 인해 생기는 삼각형의 수와 180도를 곱합니다.",
        startExpr: "\\text{삼각형의 개수} = (n - 3) + 1 = n - 2",
        targetExpr: "\\text{내각의 총합} = 180^\\circ \\times (n - 2)",
        question: "삼각형이 (n-2)개 생기므로 n각형의 내각의 총합은?",
        options: [
          {
            latex: "180^\\circ \\times (n - 2)",
            label: "삼각형이 (n-2)개 생기므로 180도 * (n-2)이다.",
            isCorrect: true,
            feedback: "맞습니다! 중학교 기하학의 기본 공식이 명쾌하게 유도되었습니다!"
          },
          {
            latex: "180^\\circ \\times (n - 3)",
            label: "삼각형이 (n-3)개 생긴다.",
            isCorrect: false,
            feedback: "칼질(대각선)을 1번 하면 2조각이 되듯이 삼각형은 (n-2)개입니다."
          },
          {
            latex: "360^\\circ \\times (n - 2)",
            label: "삼각형 내각의 합을 360도로 곱한다.",
            isCorrect: false,
            feedback: "삼각형의 내각의 합은 180도입니다."
          }
        ],
        aiGuidance: {
          hint: "쪼개진 모든 삼각형들의 내각의 합은 원래 다각형의 내각의 합과 같습니다.",
          why: "선분으로 분할된 각들을 모두 합치면 정확히 다각형의 각이 됩니다.",
          commonMistake: "정n각형의 한 내각은 이를 n으로 나눈 값입니다."
        }
      }
    ]
  },
  {
    id: "polygon_exterior_angles",
    title: "다각형 외각의 크기의 합",
    curriculum: ["15개정", "22개정"],
    grade: "중1",
    subject: "중1 수학",
    unit: "기본 도형과 작도 - 다각형",
    latex: "360^\\circ \\quad (\\text{모든 볼록 } n\\text{각형})",
    coreConcept: "각 꼭짓점에서의 (내각 + 외각 = 180도)와 내각의 총합 차감",
    prerequisites: "평각은 180도, n각형 내각의 합",
    description: "다각형의 변의 개수 n과 관계없이 모든 볼록 다각형의 외각의 총합이 항상 360도인 이유를 증명합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "모든 꼭짓점의 (내각 + 외각) 총합 구하기",
        goal: "한 꼭짓점에서 내각과 외각의 합은 평각인 180도입니다. n개 꼭짓점의 총합을 구합니다.",
        startExpr: "\\text{한 꼭짓점: 내각} + \\text{외각} = 180^\\circ",
        targetExpr: "n\\text{개 꼭짓점 총합} = 180^\\circ \\times n",
        question: "n개의 꼭짓점에서 내각과 외각을 모두 더한 전체 합은 얼마일까요?",
        options: [
          {
            latex: "180^\\circ \\times n",
            label: "꼭짓점이 n개이므로 180도 * n이다.",
            isCorrect: true,
            feedback: "맞습니다! 모든 꼭짓점에서 직선을 이루므로 180n이 됩니다."
          },
          {
            latex: "360^\\circ \\times n",
            label: "한 꼭짓점의 각이 360도이다.",
            isCorrect: false,
            feedback: "내각과 외각은 일직선(평각)을 이루므로 합은 180도입니다."
          },
          {
            latex: "180^\\circ \\times (n - 2)",
            label: "내각의 총합과 같다.",
            isCorrect: false,
            feedback: "외각까지 포함해서 더했으므로 180n입니다."
          }
        ],
        aiGuidance: {
          hint: "각 꼭짓점마다 평각(180도)이 하나씩 생깁니다.",
          why: "외각의 총합 = (전체 합) - (내각의 총합)으로 유도하기 위함입니다.",
          commonMistake: "내각과 외각의 정의를 헷갈리지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "전체 합에서 내각의 총합 빼기",
        goal: "180n에서 앞서 유도한 내각의 총합 180(n-2)를 뺍니다.",
        startExpr: "\\text{외각의 총합} = 180^\\circ n - 180^\\circ(n - 2)",
        targetExpr: "180^\\circ n - 180^\\circ n + 360^\\circ = 360^\\circ",
        question: "180n - 180(n - 2)를 전개하여 정리하면 n이 어떻게 소거될까요?",
        options: [
          {
            latex: "180^\\circ n - 180^\\circ n + 360^\\circ = 360^\\circ",
            label: "180n이 소거되고 상수 360도만 남는다.",
            isCorrect: true,
            feedback: "정확합니다! 변의 개수 n에 관계없이 항상 360도가 됩니다!"
          },
          {
            latex: "180^\\circ n",
            label: "180n이 남는다.",
            isCorrect: false,
            feedback: "180n - 180n = 0으로 완벽히 상쇄됩니다."
          },
          {
            latex: "-360^\\circ",
            label: "부호가 마이너스가 된다.",
            isCorrect: false,
            feedback: "-180 * (-2) = +360도이므로 양수입니다."
          }
        ],
        aiGuidance: {
          hint: "괄호 앞의 마이너스 부호를 분배하면 +360도가 됩니다.",
          why: "다각형을 아주 멀리서 바라보면 한 바퀴 도는 것(360도)과 같기 때문입니다.",
          commonMistake: "마이너스 분배법칙 부호 실수를 주의하세요."
        }
      }
    ]
  },
  {
    id: "polygon_diagonals",
    title: "다각형 대각선의 총 개수",
    curriculum: ["15개정", "22개정"],
    grade: "중1",
    subject: "중1 수학",
    unit: "기본 도형과 작도 - 다각형",
    latex: "\\frac{n(n - 3)}{2}",
    coreConcept: "한 꼭짓점당 대각선 수(n-3)와 양 끝점 중복(2로 나누기)",
    prerequisites: "대각선의 정의",
    description: "n각형에서 그을 수 있는 모든 대각선의 총 개수 공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "모든 꼭짓점에서 그을 수 있는 대각선의 합",
        goal: "n개의 각 꼭짓점마다 (n-3)개의 대각선을 그을 수 있습니다.",
        startExpr: "n\\text{개의 꼭짓점} \\times (n - 3)\\text{개}",
        targetExpr: "n(n - 3)",
        question: "n개의 꼭짓점에서 그을 수 있는 대각선의 수를 모두 더하면?",
        options: [
          {
            latex: "n(n - 3)",
            label: "각 꼭짓점당 (n-3)개씩 총 n개이므로 n(n-3)이다.",
            isCorrect: true,
            feedback: "맞습니다! 하지만 이렇게 세면 하나의 대각선이 양 끝점에서 두 번씩 세어집니다."
          },
          {
            latex: "n(n - 1)",
            label: "n(n-1)개이다.",
            isCorrect: false,
            feedback: "이웃한 두 꼭짓점을 빼지 않았습니다."
          },
          {
            latex: "n^2",
            label: "n의 제곱이다.",
            isCorrect: false,
            feedback: "자기 자신과 이웃 꼭짓점으로는 대각선을 그을 수 없습니다."
          }
        ],
        aiGuidance: {
          hint: "선분 AB는 A에서 셀 때와 B에서 셀 때 총 2번 중복됩니다.",
          why: "중복도를 보정하기 위해 2로 나누어야 합니다.",
          commonMistake: "2로 나누지 않으면 대각선 수가 2배로 계산됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "2번씩 중복 계산된 선분 보정하기",
        goal: "선분의 양 끝점에서 각각 한 번씩 총 2번 카운트되었으므로 2로 나눕니다.",
        startExpr: "\\text{총 대각선} = \\frac{n(n - 3)}{2}",
        targetExpr: "\\frac{n(n - 3)}{2}",
        question: "양 끝점 중복을 보정하기 위해 최종적으로 취하는 연산은?",
        options: [
          {
            latex: "\\frac{n(n - 3)}{2}",
            label: "2로 나누어 n(n-3)/2가 된다.",
            isCorrect: true,
            feedback: "완벽합니다! 중학교 1학년 핵심 대각선 공식이 완성되었습니다!"
          },
          {
            latex: "\\frac{n(n - 3)}{n}",
            label: "n으로 나눈다.",
            isCorrect: false,
            feedback: "선분의 양 끝점은 2개이므로 2로 나누어야 합니다."
          },
          {
            latex: "n(n - 3) - 2",
            label: "2를 뺀다.",
            isCorrect: false,
            feedback: "모든 선분이 2배씩 세어졌으므로 2로 나누어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "조합 관점에서는 n개의 점 중 2개를 고른 뒤 n개의 변을 빼는 nC2 - n 과도 일치합니다.",
          why: "대각선은 방향이 없으므로 AB와 BA는 같은 선분입니다.",
          commonMistake: "오각형의 대각선 수는 5(5-3)/2 = 5개입니다."
        }
      }
    ]
  },
  {
    id: "sector_arc_and_area",
    title: "부채꼴 호의 길이와 넓이",
    curriculum: ["15개정", "22개정"],
    grade: "중1",
    subject: "중1 수학",
    unit: "평면도형의 성질 - 원과 부채꼴",
    latex: "l = 2\\pi r \\times \\frac{x}{360}, \\quad S = \\frac{1}{2}rl",
    coreConcept: "원의 둘레와 넓이에 대한 중심각의 정비례 관계",
    prerequisites: "원의 둘레 $2\\pi r$, 원의 넓이 $\\pi r^2$",
    description: "부채꼴의 호의 길이 $l$과 넓이 $S$ 공식, 그리고 반지름과 호의 길이로 구하는 $S=\\frac{1}{2}rl$을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "중심각의 크기에 정비례하는 호의 길이와 넓이",
        goal: "원 전체 중심각 360도에 대한 부채꼴 중심각 x도의 비율을 곱합니다.",
        startExpr: "\\text{원 둘레} = 2\\pi r, \\quad \\text{원 넓이} = \\pi r^2",
        targetExpr: "l = 2\\pi r \\frac{x}{360}, \\quad S = \\pi r^2 \\frac{x}{360}",
        question: "반지름 r, 중심각 x도인 부채꼴의 호의 길이 l과 넓이 S는?",
        options: [
          {
            latex: "l = 2\\pi r \\frac{x}{360}, \\quad S = \\pi r^2 \\frac{x}{360}",
            label: "원 전체의 공식에 x/360 비율을 곱한다.",
            isCorrect: true,
            feedback: "정확합니다! 부채꼴의 호와 넓이는 중심각의 크기에 정비례합니다."
          },
          {
            latex: "l = \\pi r \\frac{x}{180}, \\quad S = 2\\pi r \\frac{x}{360}",
            label: "넓이에 원 둘레 공식을 대입한다.",
            isCorrect: false,
            feedback: "원의 넓이는 pi*r^2입니다."
          },
          {
            latex: "l = 2\\pi r x",
            label: "360으로 나누지 않고 x만 곱한다.",
            isCorrect: false,
            feedback: "원 전체의 중심각이 360도이므로 반드시 360으로 나누어야 비율이 됩니다."
          }
        ],
        aiGuidance: {
          hint: "한 원에서 부채꼴의 넓이와 호의 길이는 중심각에 비례합니다.",
          why: "비례식 360 : x = (원 넓이) : (부채꼴 넓이) 에서 출발합니다.",
          commonMistake: "파이(pi) 기호를 누락하지 않도록 주의하세요."
        }
      },
      {
        stepNumber: 2,
        title: "S = (1/2)rl 관계 유도하기",
        goal: "S = \\pi r^2 (x/360)을 r과 l로 재구성합니다.",
        startExpr: "S = \\frac{1}{2} r \\times \\left(2\\pi r \\frac{x}{360}\\right)",
        targetExpr: "S = \\frac{1}{2} r l",
        question: "괄호 안의 2*pi*r*(x/360)이 호의 길이 l이므로 정리되는 넓이 식은?",
        options: [
          {
            latex: "S = \\frac{1}{2} r l",
            label: "S = 1/2 * r * l",
            isCorrect: true,
            feedback: "정답입니다! 마치 밑변이 l이고 높이가 r인 삼각형처럼 넓이를 구할 수 있습니다!"
          },
          {
            latex: "S = r l",
            label: "1/2 없이 rl이다.",
            isCorrect: false,
            feedback: "2*pi*r를 만들기 위해 앞에 1/2을 곱해주었으므로 1/2이 남아있어야 합니다."
          },
          {
            latex: "S = \\frac{1}{2} r^2 l",
            label: "r의 제곱이 곱해진다.",
            isCorrect: false,
            feedback: "r 하나가 l에 포함되었으므로 r의 1차만 곱해집니다."
          }
        ],
        aiGuidance: {
          hint: "부채꼴을 잘게 쪼개어 지그재그로 붙이면 밑변이 l/2이고 높이가 r인 직사각형이 됩니다.",
          why: "중심각을 몰라도 반지름과 호의 길이만 알면 넓이를 바로 구할 수 있습니다.",
          commonMistake: "고2 호도법에서도 S = 1/2 * r * (r*theta) = 1/2*r^2*theta 로 연결됩니다."
        }
      }
    ]
  },
  {
    id: "sphere_volume_surface",
    title: "구의 겉넓이와 부피 공식",
    curriculum: ["15개정", "22개정"],
    grade: "중1",
    subject: "중1 수학",
    unit: "입체도형의 성질 - 회전체",
    latex: "S = 4\\pi r^2, \\quad V = \\frac{4}{3}\\pi r^3",
    coreConcept: "원기둥에 외접하는 구의 부피 비(2:3, 아르키메데스의 정리)",
    prerequisites: "원기둥의 부피 $\\pi r^2 h$",
    description: "아르키메데스가 발견한 구와 원기둥의 부피 비율(2/3)로부터 구의 부피와 겉넓이를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "외접하는 원기둥의 부피 구하기",
        goal: "반지름 r인 구에 꼭 맞는 원기둥의 밑면 반지름 r과 높이 h=2r을 곱합니다.",
        startExpr: "\\text{원기둥 밑넓이} = \\pi r^2, \\quad \\text{높이} = 2r",
        targetExpr: "V_{\\text{원기둥}} = \\pi r^2 \\times 2r = 2\\pi r^3",
        question: "구에 외접하는 원기둥의 전체 부피는?",
        options: [
          {
            latex: "2\\pi r^3",
            label: "밑넓이(pi*r^2) * 높이(2r) = 2*pi*r^3",
            isCorrect: true,
            feedback: "맞습니다! 구의 지름이 원기둥의 높이 2r이 됩니다."
          },
          {
            latex: "\\pi r^3",
            label: "높이를 r로 곱한다.",
            isCorrect: false,
            feedback: "구의 위아래 전체 높이는 지름이므로 2r입니다."
          },
          {
            latex: "4\\pi r^3",
            label: "높이를 4r로 곱한다.",
            isCorrect: false,
            feedback: "높이는 지름인 2r입니다."
          }
        ],
        aiGuidance: {
          hint: "구의 중심에서 위로 r, 아래로 r이므로 전체 높이는 2r입니다.",
          why: "아르키메데스는 구의 부피가 외접원기둥 부피의 2/3임을 증명했습니다.",
          commonMistake: "반지름과 지름을 혼동하지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "아르키메데스의 2/3 비율 적용하여 구의 부피 도출",
        goal: "원기둥 부피 2*pi*r^3에 2/3를 곱합니다.",
        startExpr: "V_{\\text{구}} = \\frac{2}{3} \\times V_{\\text{원기둥}} = \\frac{2}{3} \\times (2\\pi r^3)",
        targetExpr: "V = \\frac{4}{3}\\pi r^3",
        question: "2/3 * (2*pi*r^3)을 계산한 최종 구의 부피는?",
        options: [
          {
            latex: "V = \\frac{4}{3}\\pi r^3",
            label: "V = (4/3)*pi*r^3",
            isCorrect: true,
            feedback: "정확합니다! 구의 겉넓이 4*pi*r^2도 부피를 r로 미분한 것과 정확히 일치합니다!"
          },
          {
            latex: "V = \\frac{2}{3}\\pi r^3",
            label: "V = (2/3)*pi*r^3",
            isCorrect: false,
            feedback: "2/3에 2가 곱해지므로 4/3가 됩니다."
          },
          {
            latex: "V = 4\\pi r^3",
            label: "분모 3이 사라진다.",
            isCorrect: false,
            feedback: "원뿔/뿔체의 부피 성질처럼 분모에 3이 남습니다."
          }
        ],
        aiGuidance: {
          hint: "구의 부피 V = (4/3)*pi*r^3, 겉넓이 S = 4*pi*r^2",
          why: "아르키메데스는 자신의 묘비에 원기둥에 내접하는 구의 그림을 새겨달라고 유언했습니다.",
          commonMistake: "부피는 r의 3제곱, 겉넓이는 r의 2제곱 차원입니다."
        }
      }
    ]
  },
  {
    id: "linear_equation_solution",
    title: "일차방정식의 이항과 일반해",
    curriculum: ["15개정", "22개정"],
    grade: "중1",
    subject: "중1 수학",
    unit: "문자와 식 - 일차방정식",
    latex: "ax + b = 0 \\implies x = -\\frac{b}{a} \\quad (a \\ne 0)",
    coreConcept: "등식의 성질(양변에 같은 수를 빼고 나누기)",
    prerequisites: "등식의 사칙연산 성질",
    description: "모든 일차방정식의 기본 구조와 등식의 성질을 이용한 이항 원리를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "상수항 b를 이항하기",
        goal: "양변에 b를 빼서 좌변에 미지수 항 ax만 남깁니다.",
        startExpr: "ax + b = 0",
        targetExpr: "ax = -b",
        question: "좌변의 +b를 없애기 위해 등식의 성질을 어떻게 적용할까요?",
        options: [
          {
            latex: "ax + b - b = 0 - b \\implies ax = -b",
            label: "양변에서 b를 빼서 ax = -b로 만든다.",
            isCorrect: true,
            feedback: "맞습니다! '이항'이란 양변에 같은 수를 더하거나 빼서 반대편으로 옮기는 등식의 성질입니다."
          },
          {
            latex: "ax = b",
            label: "부호 변화 없이 ax = b가 된다.",
            isCorrect: false,
            feedback: "이항하면 부호가 반대로 바뀝니다."
          },
          {
            latex: "x + b = -a",
            label: "a를 우변으로 넘긴다.",
            isCorrect: false,
            feedback: "a는 x와 곱해져 있으므로 먼저 뺄셈으로 넘길 수 없습니다."
          }
        ],
        aiGuidance: {
          hint: "등식의 양변에 같은 수를 빼도 등식은 성립합니다.",
          why: "미지수 x가 들어있는 항과 순수 숫자(상수항)를 분리하기 위함입니다.",
          commonMistake: "이항할 때 부호 바꾸는 것을 잊지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "양변을 계수 a로 나누기",
        goal: "a != 0 조건 하에 양변을 a로 나누어 x의 해를 구합니다.",
        startExpr: "ax = -b",
        targetExpr: "x = -\\frac{b}{a}",
        question: "양변을 a로 나누었을 때 최종 해는?",
        options: [
          {
            latex: "x = -\\frac{b}{a}",
            label: "x = -b / a",
            isCorrect: true,
            feedback: "정답입니다! 가장 기초적이면서도 강력한 대수학의 첫걸음입니다."
          },
          {
            latex: "x = -ab",
            label: "a를 곱해 -ab가 된다.",
            isCorrect: false,
            feedback: "곱해져 있던 계수는 반대편으로 갈 때 분모로 나누어야 합니다."
          },
          {
            latex: "x = \\frac{b}{a}",
            label: "부호가 양수가 된다.",
            isCorrect: false,
            feedback: "우변이 -b였으므로 부호는 마이너스입니다."
          }
        ],
        aiGuidance: {
          hint: "0이 아닌 수로 양변을 나눌 수 있습니다.",
          why: "x의 계수를 1로 만들어 해를 확정합니다.",
          commonMistake: "a=0일 때는 해가 무수히 많거나(부정) 없을 수(불능) 있습니다."
        }
      }
    ]
  },
  {
    id: "prime_factorization_divisors",
    title: "소인수분해와 약수의 개수 공식",
    curriculum: ["15개정", "22개정"],
    grade: "중1",
    subject: "중1 수학",
    unit: "수와 연산 - 소인수분해",
    latex: "N = a^p b^q \\implies \\text{약수의 개수} = (p + 1)(q + 1)",
    coreConcept: "각 소인수의 거듭제곱 선택 경우의 수 곱(곱의 법칙)",
    prerequisites: "소인수분해, 약수의 성질",
    description: "어떤 자연수의 약수의 개수가 지수에 1을 더해 곱한 값이 되는 이유를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "소인수 a에 대해 선택할 수 있는 거듭제곱의 수",
        goal: "a^p의 약수가 될 수 있는 후보는 a^0(=1), a^1, a^2, ..., a^p 입니다.",
        startExpr: "a^p\\text{의 약수 후보: } 1, a, a^2, \\dots, a^p",
        targetExpr: "\\text{선택지의 개수} = p + 1\\text{개}",
        question: "a^0부터 a^p까지 거듭제곱을 고를 수 있는 경우의 수는 몇 가지일까요?",
        options: [
          {
            latex: "p + 1\\text{개}",
            label: "1(=a^0)부터 a^p까지 총 (p+1)가지이다.",
            isCorrect: true,
            feedback: "맞습니다! '0제곱(1)'이 포함되므로 지수 p에 1을 더한 (p+1)가지가 됩니다."
          },
          {
            latex: "p\\text{개}",
            label: "지수와 같은 p가지이다.",
            isCorrect: false,
            feedback: "1도 약수에 포함되므로 1을 더해주어야 합니다."
          },
          {
            latex: "p - 1\\text{개}",
            label: "(p-1)가지이다.",
            isCorrect: false,
            feedback: "0부터 p까지의 정수의 개수는 p+1개입니다."
          }
        ],
        aiGuidance: {
          hint: "예를 들어 2^3의 약수는 1, 2, 4, 8 로 3+1 = 4개입니다.",
          why: "어떤 소인수를 '아예 안 곱하는(1)' 경우도 약수를 구성하기 때문입니다.",
          commonMistake: "+1을 빠뜨리면 약수 1을 놓치게 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "곱의 법칙으로 전체 약수의 개수 완성",
        goal: "소인수 a의 선택지 (p+1)개와 소인수 b의 선택지 (q+1)개를 곱합니다.",
        startExpr: "\\text{전체 경우의 수} = (a\\text{의 선택지}) \\times (b\\text{의 선택지})",
        targetExpr: "(p + 1)(q + 1)",
        question: "두 소인수가 독립적으로 조합되어 만들어지는 총 약수의 개수는?",
        options: [
          {
            latex: "(p + 1)(q + 1)",
            label: "곱의 법칙에 의해 (p+1)(q+1)개이다.",
            isCorrect: true,
            feedback: "정답입니다! 표를 그려 가로 p+1칸, 세로 q+1칸의 격자를 채우는 원리입니다."
          },
          {
            latex: "pq + 1",
            label: "지수끼리 곱하고 1을 더한다.",
            isCorrect: false,
            feedback: "각각 1을 더한 후 곱해야 합니다."
          },
          {
            latex: "p + q + 2",
            label: "합의 법칙으로 더한다.",
            isCorrect: false,
            feedback: "두 소인수의 거듭제곱이 동시에 곱해져 하나의 약수를 이루므로 곱의 법칙입니다."
          }
        ],
        aiGuidance: {
          hint: "소인수가 3개 이상이어도 (p+1)(q+1)(r+1)... 로 계속 확장됩니다.",
          why: "소수들은 서로소이므로 모든 조합이 서로 다른 약수를 유일하게 만들어냅니다(소인수분해의 유일성).",
          commonMistake: "소수가 아닌 합성수의 지수를 그대로 쓰면 안 되며, 반드시 소인수분해해야 합니다."
        }
      }
    ]
  },

  // =========================================================================
  // 중학교 2학년 (중2)
  // =========================================================================
  {
    id: "pythagoras",
    title: "피타고라스 정리",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "도형의 닮음과 피타고라스 정리",
    latex: "a^2 + b^2 = c^2",
    coreConcept: "가필드(Garfield) 사다리꼴 넓이를 이용한 대수적 증명",
    prerequisites: "직각삼각형의 성질, 사다리꼴의 넓이, 곱셈공식",
    description: "직각삼각형에서 빗변의 길이의 제곱은 나머지 두 변의 길이의 제곱의 합과 같다는 기하학의 기본 정리입니다.",
    steps: [
      {
        stepNumber: 1,
        title: "직각삼각형 2개로 사다리꼴 구성하기",
        goal: "밑변 a, 높이 b, 빗변 c인 합동인 두 직각삼각형을 맞붙여 사다리꼴을 만듭니다.",
        startExpr: "\\triangle ABC \\equiv \\triangle CDE \\quad (\\angle C = 90^\\circ)",
        targetExpr: "\\text{사다리꼴 윗변}=a, \\; \\text{아랫변}=b, \\; \\text{높이}=(a+b)",
        question: "가필드의 증명법에서 만들어지는 사다리꼴의 전체 높이는 얼마일까요?",
        options: [
          {
            latex: "h = a + b",
            label: "한 밑변 a와 다른 높이 b가 일직선상에 놓여 a+b가 된다.",
            isCorrect: true,
            feedback: "맞습니다! 사다리꼴의 평행한 두 변의 길이는 a와 b이고, 높이는 a+b가 됩니다."
          },
          {
            latex: "h = c",
            label: "빗변 c가 사다리꼴의 높이가 된다.",
            isCorrect: false,
            feedback: "빗변 c는 내부의 새로운 직각이등변삼각형의 변이 됩니다."
          },
          {
            latex: "h = \\sqrt{a^2 + b^2}",
            label: "피타고라스 정리를 사용하여 높이를 구한다.",
            isCorrect: false,
            feedback: "피타고라스 정리를 증명하는 중이므로 미리 사용할 수 없습니다."
          }
        ],
        aiGuidance: {
          hint: "미국의 제20대 대통령 제임스 가필드가 고안한 증명법입니다.",
          why: "사다리꼴 전체 넓이와 내부 세 삼각형 넓이의 합이 같음을 이용합니다.",
          commonMistake: "가운데 삼각형의 끼인각이 180 - (alpha + beta) = 90도임을 확인하세요."
        }
      },
      {
        stepNumber: 2,
        title: "사다리꼴 전체 넓이와 세 삼각형의 넓이 등식 세우기",
        goal: "사다리꼴 넓이 1/2(a+b)^2 과 두 직각삼각형 넓이 2*(1/2 ab) + 가운데 삼각형 1/2 c^2 을 같다고 둡니다.",
        startExpr: "\\frac{1}{2}(a+b)^2 = 2 \\times \\left(\\frac{1}{2}ab\\right) + \\frac{1}{2}c^2",
        targetExpr: "\\frac{1}{2}(a^2 + 2ab + b^2) = ab + \\frac{1}{2}c^2",
        question: "양변에 2를 곱하고 2ab를 소거하면 최종적으로 남는 식은?",
        options: [
          {
            latex: "a^2 + 2ab + b^2 = 2ab + c^2 \\implies a^2 + b^2 = c^2",
            label: "양변의 2ab가 소거되어 a^2 + b^2 = c^2 이 남는다.",
            isCorrect: true,
            feedback: "축하합니다! 아름다운 피타고라스 정리가 완성되었습니다!"
          },
          {
            latex: "a^2 - b^2 = c^2",
            label: "b^2의 부호가 마이너스가 된다.",
            isCorrect: false,
            feedback: "좌변의 a^2과 b^2은 모두 양의 부호를 유지합니다."
          },
          {
            latex: "a + b = c",
            label: "제곱을 바로 벗겨 a+b=c가 된다.",
            isCorrect: false,
            feedback: "삼각형의 결정조건(a+b>c)에도 모순입니다."
          }
        ],
        aiGuidance: {
          hint: "양변에 2를 곱해 분모를 없앤 뒤 2ab를 지워보세요.",
          why: "도형을 쪼갠 조각들의 넓이 합은 전체 넓이와 같습니다.",
          commonMistake: "곱셈공식 완전제곱식 전개 시 2ab를 빠뜨리지 마세요."
        }
      }
    ]
  },
  {
    id: "triangle_incenter_area",
    title: "삼각형의 내심과 넓이 공식",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "도형의 성질 - 삼각형의 성질",
    latex: "S = \\frac{1}{2}r(a + b + c)",
    coreConcept: "내심 I에서 세 꼭짓점을 연결하여 삼각형을 3개로 분할하기",
    prerequisites: "내접원의 반지름 r과 삼각형의 세 변",
    description: "내접원의 반지름 r과 둘레 (a+b+c)만으로 삼각형의 전체 넓이를 구하는 공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "내심 I에서 세 삼각형으로 분할하기",
        goal: "삼각형 ABC를 세 삼각형 IAB, IBC, ICA로 쪼개고 각각의 높이가 내접원의 반지름 r임을 관찰합니다.",
        startExpr: "\\triangle ABC = \\triangle IBC + \\triangle ICA + \\triangle IAB",
        targetExpr: "S = \\frac{1}{2}ar + \\frac{1}{2}br + \\frac{1}{2}cr",
        question: "내심에서 각 변까지의 거리는 내접원의 반지름 r로 모두 같습니다. 세 삼각형의 넓이의 합은?",
        options: [
          {
            latex: "\\frac{1}{2}ar + \\frac{1}{2}br + \\frac{1}{2}cr",
            label: "세 삼각형의 밑변이 a, b, c이고 높이가 모두 r이므로 합은 1/2*ar + 1/2*br + 1/2*cr",
            isCorrect: true,
            feedback: "정확합니다! 세 변에 내린 수선의 길이가 모두 내접원의 반지름 r입니다."
          },
          {
            latex: "ar + br + cr",
            label: "1/2을 곱하지 않는다.",
            isCorrect: false,
            feedback: "삼각형의 넓이이므로 반드시 1/2이 곱해져야 합니다."
          },
          {
            latex: "\\frac{1}{2}(abc)r",
            label: "세 변의 길이를 곱한다.",
            isCorrect: false,
            feedback: "세 조각의 넓이를 더해야 하므로 덧셈입니다."
          }
        ],
        aiGuidance: {
          hint: "내심은 세 내각의 이등분선의 교점이며, 세 변에 이르는 거리가 같습니다.",
          why: "공통인수 (1/2)r 로 묶어내기 위함입니다.",
          commonMistake: "내심과 외심의 성질을 혼동하지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "공통인수 (1/2)r 로 묶기",
        goal: "분배법칙을 역으로 적용하여 둘레의 합 (a+b+c)로 묶습니다.",
        startExpr: "S = \\frac{1}{2}ar + \\frac{1}{2}br + \\frac{1}{2}cr",
        targetExpr: "S = \\frac{1}{2}r(a + b + c)",
        question: "공통인수 (1/2)r로 묶었을 때 최종 공식은?",
        options: [
          {
            latex: "S = \\frac{1}{2}r(a + b + c)",
            label: "S = 1/2 * r * (a + b + c)",
            isCorrect: true,
            feedback: "맞습니다! 직각삼각형뿐 아니라 모든 삼각형에서 성립하는 핵심 공식입니다!"
          },
          {
            latex: "S = r(a + b + c)",
            label: "1/2이 사라진다.",
            isCorrect: false,
            feedback: "1/2이 공통인수로 묶여서 남아있어야 합니다."
          },
          {
            latex: "S = \\frac{1}{2}r(a^2 + b^2 + c^2)",
            label: "변의 길이를 제곱한다.",
            isCorrect: false,
            feedback: "둘레의 단순 합 (a+b+c)입니다."
          }
        ],
        aiGuidance: {
          hint: "둘레의 길이를 알면 내접원의 반지름과 넓이 사이를 자유자재로 오갈 수 있습니다.",
          why: "고등학교에서도 삼각형의 내접원 관련 문제에 필수적으로 쓰입니다.",
          commonMistake: "r은 반드시 내접원의 반지름이어야 합니다."
        }
      }
    ]
  },
  {
    id: "linear_function_slope",
    title: "일차함수 기울기 공식",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "일차함수와 그래프",
    latex: "m = \\frac{y_2 - y_1}{x_2 - x_1} \\quad (x_1 \\ne x_2)",
    coreConcept: "x의 증가량에 대한 y의 증가량의 비율",
    prerequisites: "좌표평면과 일차함수의 그래프",
    description: "직선 위의 두 점을 지나는 일차함수의 기울기가 x의 증가량 분의 y의 증가량으로 정의되는 이유를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "두 점의 좌표로 x와 y의 증가량 표현",
        goal: "점 A(x_1, y_1)에서 점 B(x_2, y_2)로 이동할 때의 x증가량과 y증가량을 구합니다.",
        startExpr: "A(x_1, y_1), \\quad B(x_2, y_2)",
        targetExpr: "\\Delta x = x_2 - x_1, \\quad \\Delta y = y_2 - y_1",
        question: "A에서 B로 갈 때 x의 증가량과 y의 증가량은 각각 무엇일까요?",
        options: [
          {
            latex: "\\Delta x = x_2 - x_1, \\quad \\Delta y = y_2 - y_1",
            label: "x증가량 = x2 - x1, y증가량 = y2 - y1",
            isCorrect: true,
            feedback: "맞습니다! 끝 점의 좌표에서 시작 점의 좌표를 뺀 것이 증가량입니다."
          },
          {
            latex: "\\Delta x = x_1 + x_2, \\quad \\Delta y = y_1 + y_2",
            label: "좌표를 서로 더한다.",
            isCorrect: false,
            feedback: "증가량(변화량)은 차이를 구해야 하므로 뺄셈입니다."
          },
          {
            latex: "\\Delta x = x_2 - y_2",
            label: "x와 y를 서로 뺀다.",
            isCorrect: false,
            feedback: "같은 축 좌표끼리 빼야 합니다."
          }
        ],
        aiGuidance: {
          hint: "수직선에서 3에서 7까지의 변화량은 7 - 3 = 4 입니다.",
          why: "기울기의 수학적 정의가 바로 이 두 변화량의 비율입니다.",
          commonMistake: "분모와 분자의 뺄셈 순서(x2-x1, y2-y1)를 반드시 일치시켜야 합니다."
        }
      },
      {
        stepNumber: 2,
        title: "기울기의 정의(변화율) 완성",
        goal: "기울기 m = (y증가량) / (x증가량) 을 수식으로 나타냅니다.",
        startExpr: "m = \\frac{\\text{y의 증가량}}{\\text{x의 증가량}}",
        targetExpr: "m = \\frac{y_2 - y_1}{x_2 - x_1}",
        question: "일차함수 y = mx + n의 기울기 m 공식은?",
        options: [
          {
            latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}",
            label: "m = (y2 - y1) / (x2 - x1)",
            isCorrect: true,
            feedback: "정답입니다! 이 개념이 고등학교 미분(평균변화율)의 모태가 됩니다!"
          },
          {
            latex: "m = \\frac{x_2 - x_1}{y_2 - y_1}",
            label: "분모와 분자가 바뀐다.",
            isCorrect: false,
            feedback: "기울기는 항상 'x증가량 분의 y증가량'입니다."
          },
          {
            latex: "m = (y_2 - y_1)(x_2 - x_1)",
            label: "두 증가량을 곱한다.",
            isCorrect: false,
            feedback: "곱이 아니라 나눗셈(비율)입니다."
          }
        ],
        aiGuidance: {
          hint: "직선 위의 어떤 두 점을 잡아도 닮음에 의해 이 비율은 항상 일정합니다.",
          why: "일차함수가 '직선'인 이유 자체가 기울기가 일정하기 때문입니다.",
          commonMistake: "x1=x2인 수직선은 기울기가 정의되지 않습니다."
        }
      }
    ]
  },
  {
    id: "mult_formula_square",
    title: "곱셈공식: 완전제곱식",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "식의 계산 - 곱셈공식",
    latex: "(a + b)^2 = a^2 + 2ab + b^2",
    coreConcept: "분배법칙과 한 변이 (a+b)인 정사각형 넓이 분할",
    prerequisites: "다항식의 분배법칙",
    description: "(a+b)^2이 단순히 a^2 + b^2이 아니라 가운데 2ab가 생기는 이유를 기하학적 넓이와 분배법칙으로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "(a+b)(a+b) 분배법칙 전개",
        goal: "(a+b)(a+b)의 앞 괄호 항들을 뒤 괄호에 차례로 분배합니다.",
        startExpr: "(a + b)(a + b) = a(a + b) + b(a + b)",
        targetExpr: "a^2 + ab + ba + b^2",
        question: "a를 분배하고 b를 분배하여 풀었을 때 4개의 항은?",
        options: [
          {
            latex: "a^2 + ab + ba + b^2",
            label: "a^2 + ab + ba + b^2",
            isCorrect: true,
            feedback: "맞습니다! 곱셈의 교환법칙에 의해 ba = ab 입니다."
          },
          {
            latex: "a^2 + b^2",
            label: "ab 항이 없이 a^2 + b^2 만 나온다.",
            isCorrect: false,
            feedback: "학생들의 가장 흔한 오답입니다! 교차항 ab와 ba가 반드시 존재합니다."
          },
          {
            latex: "a^2 + 4ab + b^2",
            label: "가운데가 4ab가 된다.",
            isCorrect: false,
            feedback: "ab가 2번 더해지므로 2ab입니다."
          }
        ],
        aiGuidance: {
          hint: "한 변이 a+b인 정사각형을 그려보면 넓이가 a^2짜리 1개, b^2짜리 1개, ab짜리 직사각형 2개가 나옵니다.",
          why: "수학에서 거듭제곱은 전체를 곱하는 것입니다.",
          commonMistake: "(a+b)^2 != a^2 + b^2 입니다. 2ab를 절대 잊지 마세요!"
        }
      },
      {
        stepNumber: 2,
        title: "동류항 ab + ba 합치기",
        goal: "ab + ba = 2ab로 묶어 최종 곱셈공식을 완성합니다.",
        startExpr: "a^2 + ab + ab + b^2",
        targetExpr: "a^2 + 2ab + b^2",
        question: "동류항을 정리한 최종 식은?",
        options: [
          {
            latex: "a^2 + 2ab + b^2",
            label: "a^2 + 2ab + b^2",
            isCorrect: true,
            feedback: "정확합니다! (a-b)^2 = a^2 - 2ab + b^2 도 b 대신 -b를 대입하여 바로 얻을 수 있습니다."
          },
          {
            latex: "a^2 + a^2 b^2 + b^2",
            label: "가운데가 a^2 b^2이 된다.",
            isCorrect: false,
            feedback: "ab + ab = 2ab 덧셈입니다."
          },
          {
            latex: "(a+b)^2 = 2a + 2b",
            label: "2를 분배한다.",
            isCorrect: false,
            feedback: "제곱 지수는 곱셈이지 계수 분배가 아닙니다."
          }
        ],
        aiGuidance: {
          hint: "이차방정식 근의 공식을 유도할 때 완전제곱식 만들기가 핵심 열쇠가 됩니다.",
          why: "다항식의 전개와 인수분해는 서로 정확히 역과정입니다.",
          commonMistake: "마이너스일 때는 (a-b)^2 = a^2 - 2ab + b^2 입니다."
        }
      }
    ]
  },
  {
    id: "mult_formula_difference_squares",
    title: "곱셈공식: 합차 공식",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "식의 계산 - 곱셈공식",
    latex: "(a + b)(a - b) = a^2 - b^2",
    coreConcept: "분배법칙 전개 시 부호가 반대인 중간항(+ab, -ab)의 상쇄",
    prerequisites: "분배법칙과 부호 규칙",
    description: "합과 차의 곱에서 1차 교차항이 상쇄되어 제곱의 차만 남는 합차공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "(a+b)(a-b) 분배법칙 전개",
        goal: "앞 괄호 a와 b를 (a-b)에 차례로 분배합니다.",
        startExpr: "(a + b)(a - b) = a(a - b) + b(a - b)",
        targetExpr: "a^2 - ab + ba - b^2",
        question: "괄호를 풀었을 때 4개의 항과 부호는?",
        options: [
          {
            latex: "a^2 - ab + ba - b^2",
            label: "a^2 - ab + ba - b^2",
            isCorrect: true,
            feedback: "맞습니다! a*(-b) = -ab 이고 b*a = +ba = +ab 입니다."
          },
          {
            latex: "a^2 + ab + ba + b^2",
            label: "모든 부호가 플러스이다.",
            isCorrect: false,
            feedback: "뒤 괄호에 -b가 있으므로 음수 부호가 생깁니다."
          },
          {
            latex: "a^2 - b^2",
            label: "중간항을 거치지 않고 바로 쓴다.",
            isCorrect: false,
            feedback: "분배법칙을 전개하면 중간항 -ab와 +ba가 먼저 나타납니다."
          }
        ],
        aiGuidance: {
          hint: "a*a=a^2, a*(-b)=-ab, b*a=+ab, b*(-b)=-b^2",
          why: "중간의 -ab와 +ab가 정반대 부호라는 점을 관찰하세요.",
          commonMistake: "+b와 -b의 곱은 -b^2 입니다."
        }
      },
      {
        stepNumber: 2,
        title: "-ab와 +ba의 완전 상쇄",
        goal: "-ab + ab = 0 이 되어 중간항이 사라짐을 확인합니다.",
        startExpr: "a^2 + (-ab + ab) - b^2",
        targetExpr: "a^2 - b^2",
        question: "-ab + ab를 계산하여 정리된 식은?",
        options: [
          {
            latex: "a^2 - b^2",
            label: "중간항이 0이 되어 a^2 - b^2 만 남는다.",
            isCorrect: true,
            feedback: "정확합니다! 분모 유리화 및 수많은 인수분해의 가장 강력한 무기입니다!"
          },
          {
            latex: "a^2 - 2ab - b^2",
            label: "-2ab가 남는다.",
            isCorrect: false,
            feedback: "부호가 다르므로 -ab + ab = 0입니다."
          },
          {
            latex: "a^2 + b^2",
            label: "b^2 앞의 부호가 플러스이다.",
            isCorrect: false,
            feedback: "(+b)*(-b) = -b^2 이므로 마이너스입니다."
          }
        ],
        aiGuidance: {
          hint: "루트를 없앨 때 (sqrt(a)+sqrt(b))(sqrt(a)-sqrt(b)) = a-b 로 활용됩니다.",
          why: "대칭적인 구조 덕분에 일차항이 완벽하게 소멸합니다.",
          commonMistake: "a^2 - b^2을 (a-b)^2과 혼동하지 마세요."
        }
      }
    ]
  },

  // =========================================================================
  // 중학교 3학년 (중3)
  // =========================================================================
  {
    id: "quad_formula",
    title: "이차방정식 근의 공식",
    curriculum: ["15개정", "22개정"],
    grade: "중3",
    subject: "중3 수학 / 공통수학1",
    unit: "이차방정식",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    coreConcept: "완전제곱식으로의 변형과 제곱근의 정의",
    prerequisites: "인수분해, 무리수와 제곱근, 식의 변형",
    description: "이차방정식 ax^2 + bx + c = 0 (a != 0)의 일반적인 해를 계수 a, b, c만으로 구하는 핵심 공식입니다.",
    steps: [
      {
        stepNumber: 1,
        title: "최고차항 계수로 양변 나누고 상수항 이항하기",
        goal: "양변을 a로 나누고 상수항 c/a를 우변으로 넘깁니다.",
        startExpr: "ax^2 + bx + c = 0 \\quad (a \\ne 0)",
        targetExpr: "x^2 + \\frac{b}{a}x = -\\frac{c}{a}",
        question: "양변을 a로 나눈 뒤 상수항을 넘긴 올바른 식은?",
        options: [
          {
            latex: "x^2 + \\frac{b}{a}x = -\\frac{c}{a}",
            label: "x^2 + (b/a)x = -c/a",
            isCorrect: true,
            feedback: "정답입니다! 좌변에 x^2 + (b/a)x 만 남겨 완전제곱식 만들 준비를 마쳤습니다."
          },
          {
            latex: "x^2 + bx = -c",
            label: "a로 나누지 않고 c만 넘긴다.",
            isCorrect: false,
            feedback: "최고차항 계수를 1로 만들어야 완전제곱식이 쉬워집니다."
          },
          {
            latex: "x^2 + \\frac{b}{a}x = \\frac{c}{a}",
            label: "상수항 부호를 바꾸지 않는다.",
            isCorrect: false,
            feedback: "우변으로 넘어가면 부호가 마이너스가 되어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "x^2의 계수를 1로 만들어야 (x+k)^2 꼴을 만들기 편합니다.",
          why: "완전제곱식을 만들기 위해 필요한 상수를 양변에 더해주기 위함입니다.",
          commonMistake: "a=0이 아니므로 양변을 a로 나눌 수 있습니다."
        }
      },
      {
        stepNumber: 2,
        title: "완전제곱식을 만들기 위한 상수 더하기",
        goal: "좌변을 (x + b/(2a))^2 꼴로 만들기 위해 일차항 계수의 절반의 제곱인 (b/(2a))^2을 양변에 더합니다.",
        startExpr: "x^2 + \\frac{b}{a}x = -\\frac{c}{a}",
        targetExpr: "\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}",
        question: "양변에 더해야 할 일차항 계수의 절반의 제곱은 무엇일까요?",
        options: [
          {
            latex: "\\left(\\frac{b}{2a}\\right)^2 = \\frac{b^2}{4a^2}",
            label: "b/(2a)의 제곱인 b^2 / (4a^2)을 양변에 더한다.",
            isCorrect: true,
            feedback: "완벽합니다! 우변을 통분하면 (b^2 - 4ac)/(4a^2)이 됩니다!"
          },
          {
            latex: "\\frac{b^2}{a^2}",
            label: "절반이 아니라 그냥 계수의 제곱을 더한다.",
            isCorrect: false,
            feedback: "(x+k)^2 = x^2 + 2kx + k^2 이므로 k는 절반이어야 합니다."
          },
          {
            latex: "\\frac{b}{2a}",
            label: "제곱하지 않고 그냥 더한다.",
            isCorrect: false,
            feedback: "상수항 자리는 제곱이어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "우변: -c/a + b^2/(4a^2) = (-4ac + b^2)/(4a^2) = (b^2-4ac)/(4a^2)",
          why: "루트 안에 들어갈 판별식 b^2 - 4ac가 바로 여기서 탄생합니다.",
          commonMistake: "등식의 성질상 우변에도 똑같이 더해주어야 합니다."
        }
      },
      {
        stepNumber: 3,
        title: "양변의 제곱근 풀고 x에 대해 정리하기",
        goal: "양변에 제곱근을 취하고 b/(2a)를 이항합니다.",
        startExpr: "\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}",
        targetExpr: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        question: "제곱근을 취하여 얻은 최종 근의 공식은?",
        options: [
          {
            latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            label: "x = (-b +- sqrt(b^2 - 4ac)) / (2a)",
            isCorrect: true,
            feedback: "대단합니다! 수학사에서 가장 위대한 공식 중 하나가 유도되었습니다!"
          },
          {
            latex: "x = \\frac{b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            label: "b 앞의 부호가 플러스이다.",
            isCorrect: false,
            feedback: "+b/(2a)가 우변으로 넘어가면 -b가 됩니다."
          },
          {
            latex: "x = \\frac{-b + \\sqrt{b^2 - 4ac}}{2a}",
            label: "+- 대신 +만 취한다.",
            isCorrect: false,
            feedback: "제곱근은 양수와 음수 2개가 존재하므로 +-입니다."
          }
        ],
        aiGuidance: {
          hint: "분모 4a^2의 제곱근은 2a입니다.",
          why: "이차방정식의 해를 인수분해가 안 될 때도 언제나 완벽하게 구해줍니다.",
          commonMistake: "짝수 근의 공식은 x = (-b' +- sqrt(b'^2 - ac)) / a 입니다."
        }
      }
    ]
  },
  {
    id: "quad_vertex_form",
    title: "이차함수 꼭짓점 표준형",
    curriculum: ["15개정", "22개정"],
    grade: "중3",
    subject: "중3 수학 / 공통수학1",
    unit: "이차함수와 그래프",
    latex: "y = a(x - p)^2 + q",
    coreConcept: "완전제곱식으로 묶어 최댓값/최솟값 및 꼭짓점 좌표 (p, q) 찾기",
    prerequisites: "이차식의 완전제곱식 변형",
    description: "일반형 y = ax^2 + bx + c를 표준형 y = a(x-p)^2 + q로 변형하여 꼭짓점과 대칭축을 찾는 원리를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "x항들을 a로 묶고 완전제곱식 만들기",
        goal: "y = a(x^2 + (b/a)x) + c 에서 괄호 안에 (b/(2a))^2을 더하고 뺍니다.",
        startExpr: "y = ax^2 + bx + c = a\\left(x^2 + \\frac{b}{a}x\\right) + c",
        targetExpr: "y = a\\left(x^2 + \\frac{b}{a}x + \\frac{b^2}{4a^2} - \\frac{b^2}{4a^2}\\right) + c",
        question: "괄호 안을 완전제곱식으로 만들기 위해 괄호 속에 더하고 빼는 상수는?",
        options: [
          {
            latex: "\\frac{b^2}{4a^2}",
            label: "일차항 계수의 절반의 제곱인 b^2 / (4a^2)을 더하고 뺀다.",
            isCorrect: true,
            feedback: "맞습니다! 식의 전체 값을 바꾸지 않기 위해 더했다가 다시 뺍니다."
          },
          {
            latex: "\\frac{b}{2a}",
            label: "제곱하지 않고 b/(2a)만 더하고 뺀다.",
            isCorrect: false,
            feedback: "완전제곱식을 이루려면 제곱이어야 합니다."
          },
          {
            latex: "\\frac{b^2}{a^2}",
            label: "b^2 / a^2을 더한다.",
            isCorrect: false,
            feedback: "절반의 제곱이어야 2배 전개 공식과 일치합니다."
          }
        ],
        aiGuidance: {
          hint: "a*( -b^2/(4a^2) ) = -b^2/(4a) 가 괄호 밖으로 나갑니다.",
          why: "완전제곱식 부분은 x=p일 때 0이 되어 꼭짓점을 결정합니다.",
          commonMistake: "괄호 밖으로 나갈 때 앞의 계수 a를 곱해서 나가야 합니다."
        }
      },
      {
        stepNumber: 2,
        title: "완전제곱식으로 묶고 상수항 정리",
        goal: "y = a(x + b/(2a))^2 - b^2/(4a) + c 를 통분하여 정리합니다.",
        startExpr: "y = a\\left(x + \\frac{b}{2a}\\right)^2 - \\frac{b^2}{4a} + c",
        targetExpr: "y = a\\left(x + \\frac{b}{2a}\\right)^2 - \\frac{b^2 - 4ac}{4a}",
        question: "꼭짓점의 좌표 (p, q)는 무엇일까요?",
        options: [
          {
            latex: "p = -\\frac{b}{2a}, \\quad q = -\\frac{b^2 - 4ac}{4a}",
            label: "꼭짓점 좌표는 (-b/(2a), -(b^2-4ac)/(4a))",
            isCorrect: true,
            feedback: "정확합니다! 축의 방정식이 x = -b/(2a)인 이유가 바로 여기에 있습니다!"
          },
          {
            latex: "p = \\frac{b}{2a}, \\quad q = c",
            label: "p = b/(2a), q = c",
            isCorrect: false,
            feedback: "(x-p) 형태이므로 부호가 반대인 -b/(2a)입니다."
          },
          {
            latex: "p = 0, \\quad q = 0",
            label: "꼭짓점은 항상 원점이다.",
            isCorrect: false,
            feedback: "평행이동되었으므로 원점이 아닙니다."
          }
        ],
        aiGuidance: {
          hint: "y = a(x-p)^2 + q에서 x=p일 때 최댓값 또는 최솟값 q를 가집니다.",
          why: "대칭축 x = -b/(2a)는 고등학교 미분에서 y' = 2ax + b = 0의 해와도 같습니다.",
          commonMistake: "a>0이면 아래로 볼록(최솟값), a<0이면 위로 볼록(최댓값)입니다."
        }
      }
    ]
  },
  {
    id: "triangle_area_trig",
    title: "삼각비를 이용한 삼각형의 넓이",
    curriculum: ["15개정", "22개정"],
    grade: "중3",
    subject: "중3 수학 / 대수",
    unit: "삼각비의 활용",
    latex: "S = \\frac{1}{2}ab\\sin C",
    coreConcept: "수선의 발을 내려 높이 h를 삼각비 b*sin C로 치환하기",
    prerequisites: "삼각비 sin의 정의, 삼각형 넓이",
    description: "두 변의 길이 a, b와 그 끼인각 C를 알 때 삼각형의 넓이를 구하는 공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "꼭짓점 A에서 밑변 BC에 내린 높이 h 구하기",
        goal: "밑변이 a일 때 높이 h를 변 b와 각 C의 삼각비로 나타냅니다.",
        startExpr: "\\sin C = \\frac{h}{b}",
        targetExpr: "h = b\\sin C",
        question: "직각삼각형에서 높이 h를 b와 sin C로 나타내면?",
        options: [
          {
            latex: "h = b\\sin C",
            label: "h = b * sin C",
            isCorrect: true,
            feedback: "맞습니다! sin C = 높이/빗변 = h/b 이므로 양변에 b를 곱하면 됩니다."
          },
          {
            latex: "h = b\\cos C",
            label: "h = b * cos C",
            isCorrect: false,
            feedback: "cos C는 밑변 방향입니다. 높이는 sin C입니다."
          },
          {
            latex: "h = \\frac{\\sin C}{b}",
            label: "h = sin C / b",
            isCorrect: false,
            feedback: "빗변 b를 곱해야 높이가 나옵니다."
          }
        ],
        aiGuidance: {
          hint: "sin = (대변)/(빗변)",
          why: "삼각형의 높이를 각도와 빗변으로 바로 구할 수 있습니다.",
          commonMistake: "둔각삼각형일 때는 sin(180 - C)를 사용합니다."
        }
      },
      {
        stepNumber: 2,
        title: "밑변 a와 높이 h를 삼각형 넓이 공식에 대입",
        goal: "S = 1/2 * 밑변 * 높이 = 1/2 * a * (b sin C)를 계산합니다.",
        startExpr: "S = \\frac{1}{2} \\times a \\times h",
        targetExpr: "S = \\frac{1}{2}ab\\sin C",
        question: "h = b sin C를 대입하여 완성되는 넓이 공식은?",
        options: [
          {
            latex: "S = \\frac{1}{2}ab\\sin C",
            label: "S = 1/2 * a * b * sin C",
            isCorrect: true,
            feedback: "정확합니다! 평행사변형 넓이는 두 배인 S = ab sin C가 됩니다."
          },
          {
            latex: "S = ab\\sin C",
            label: "1/2이 없다.",
            isCorrect: false,
            feedback: "삼각형이므로 1/2을 곱해야 합니다 (ab sin C는 평행사변형 넓이)."
          },
          {
            latex: "S = \\frac{1}{2}ab\\cos C",
            label: "코사인이 들어간다.",
            isCorrect: false,
            feedback: "높이는 사인이므로 sin C입니다."
          }
        ],
        aiGuidance: {
          hint: "두 변과 그 '끼인각'이어야만 이 공식이 성립합니다.",
          why: "좌표평면의 사선공식(신발끈 공식) 및 벡터 외적 넓이와도 연결됩니다.",
          commonMistake: "끼인각이 아닌 다른 각을 대입하지 않도록 주의하세요."
        }
      }
    ]
  },

  // =========================================================================
  // 고등학교 1학년 (고1)
  // =========================================================================
  {
    id: "distance_two_points",
    title: "두 점 사이의 거리 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1 / 수학(상)",
    unit: "도형의 방정식 - 평면좌표",
    latex: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
    coreConcept: "좌표평면에서 직각삼각형을 만들어 피타고라스 정리 적용하기",
    prerequisites: "피타고라스 정리, x축 및 y축 평행 선분의 길이",
    description: "좌표평면 위의 두 점 (x1, y1), (x2, y2) 사이의 거리 공식을 직각삼각형의 피타고라스 정리로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "직각삼각형의 밑변과 높이 구하기",
        goal: "두 점 A(x1, y1), B(x2, y2)와 점 C(x2, y1)을 꼭짓점으로 하는 직각삼각형을 만듭니다.",
        startExpr: "AC = |x_2 - x_1|, \\quad BC = |y_2 - y_1|",
        targetExpr: "\\text{밑변}^2 = (x_2 - x_1)^2, \\quad \\text{높이}^2 = (y_2 - y_1)^2",
        question: "직각삼각형 ACB에서 밑변 AC와 높이 BC의 길이는?",
        options: [
          {
            latex: "AC = |x_2 - x_1|, \\quad BC = |y_2 - y_1|",
            label: "밑변은 |x2 - x1|, 높이는 |y2 - y1| 이다.",
            isCorrect: true,
            feedback: "맞습니다! 각 축에 평행한 선분의 길이는 좌표의 차의 절댓값입니다."
          },
          {
            latex: "AC = x_1 + x_2, \\quad BC = y_1 + y_2",
            label: "좌표의 합이다.",
            isCorrect: false,
            feedback: "길이는 좌표의 차입니다."
          },
          {
            latex: "AC = x_2 y_1",
            label: "좌표의 곱이다.",
            isCorrect: false,
            feedback: "선분의 길이는 차이로 구합니다."
          }
        ],
        aiGuidance: {
          hint: "빗변 AB가 바로 두 점 사이의 거리 d입니다.",
          why: "직각삼각형이므로 피타고라스 정리 d^2 = AC^2 + BC^2 을 쓸 수 있습니다.",
          commonMistake: "제곱하면 절댓값 기호는 괄호 제곱과 같아집니다."
        }
      },
      {
        stepNumber: 2,
        title: "피타고라스 정리 적용 및 제곱근 취하기",
        goal: "d^2 = (x2-x1)^2 + (y2-y1)^2 에서 거리 d를 구합니다.",
        startExpr: "d^2 = (x_2 - x_1)^2 + (y_2 - y_1)^2",
        targetExpr: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
        question: "거리는 항상 0 이상이므로 양의 제곱근을 취한 최종 공식은?",
        options: [
          {
            latex: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
            label: "d = sqrt((x2 - x1)^2 + (y2 - y1)^2)",
            isCorrect: true,
            feedback: "정확합니다! 평면좌표 기하학의 모든 공식의 기초가 되는 공식입니다."
          },
          {
            latex: "d = (x_2 - x_1) + (y_2 - y_1)",
            label: "루트를 벗겨 괄호의 합이 된다.",
            isCorrect: false,
            feedback: "sqrt(A^2 + B^2) != A + B 입니다!"
          },
          {
            latex: "d = (x_2 - x_1)^2 + (y_2 - y_1)^2",
            label: "제곱 상태로 둔다.",
            isCorrect: false,
            feedback: "거리 d를 구하려면 제곱근(루트)을 씌워야 합니다."
          }
        ],
        aiGuidance: {
          hint: "원점 (0,0)과의 거리는 sqrt(x^2 + y^2)가 됩니다.",
          why: "3차원 공간좌표에서도 sqrt(dx^2 + dy^2 + dz^2)로 똑같이 확장됩니다.",
          commonMistake: "루트 안의 제곱의 합은 각각 루트를 벗길 수 없습니다."
        }
      }
    ]
  },
  {
    id: "point_to_line",
    title: "점과 직선 사이의 거리 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1 / 수학(상)",
    unit: "도형의 방정식 - 직선의 방정식",
    latex: "d = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}",
    coreConcept: "수선의 발의 좌표와 수직 조건(기울기 곱 = -1)",
    prerequisites: "두 점 사이의 거리 공식, 직선의 수직 조건",
    description: "좌표평면 위의 한 점 (x1, y1)에서 직선 ax + by + c = 0 에 내린 최단거리(수선의 길이)를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "수선의 발 H와의 관계를 비례상수 k로 두기",
        goal: "직선에 수직인 방향벡터 (a, b)를 이용해 x2 - x1 = ak, y2 - y1 = bk 로 둡니다.",
        startExpr: "\\frac{x_2 - x_1}{a} = \\frac{y_2 - y_1}{b} = k",
        targetExpr: "d = \\sqrt{(ak)^2 + (bk)^2} = |k|\\sqrt{a^2 + b^2}",
        question: "거리 d를 비례상수 k로 나타내면?",
        options: [
          {
            latex: "d = |k|\\sqrt{a^2 + b^2}",
            label: "d = |k| * sqrt(a^2 + b^2)",
            isCorrect: true,
            feedback: "맞습니다! 이제 k만 구하면 거리가 바로 나옵니다."
          },
          {
            latex: "d = k(a + b)",
            label: "d = k(a+b)",
            isCorrect: false,
            feedback: "거리 공식은 제곱의 합의 제곱근입니다."
          },
          {
            latex: "d = k^2(a^2 + b^2)",
            label: "d = k^2 (a^2+b^2)",
            isCorrect: false,
            feedback: "루트가 씌워져 있어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "직선 ax+by+c=0에 수직인 방향은 계수 (a, b) 방향입니다.",
          why: "H가 직선 위의 점임을 이용해 k를 풀 것입니다.",
          commonMistake: "절댓값 |k|를 빠뜨리지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "H가 직선 위의 점임을 대입하여 k 구하고 공식 완성",
        goal: "a(x1 + ak) + b(y1 + bk) + c = 0 을 k에 대해 풀고 d에 대입합니다.",
        startExpr: "k = -\\frac{ax_1 + by_1 + c}{a^2 + b^2}",
        targetExpr: "d = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}",
        question: "d = |k| * sqrt(a^2+b^2)에 대입하여 약분하면?",
        options: [
          {
            latex: "d = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}",
            label: "분모에 sqrt(a^2 + b^2)이 남는다.",
            isCorrect: true,
            feedback: "정답입니다! 고1 수학에서 가장 중요한 공식이 완성되었습니다!"
          },
          {
            latex: "d = \\frac{|ax_1 + by_1 + c|}{a^2 + b^2}",
            label: "루트 없이 a^2 + b^2 이 분모에 온다.",
            isCorrect: false,
            feedback: "분자의 sqrt(a^2+b^2)과 분모의 (a^2+b^2)가 약분되어 분모에 루트가 남습니다."
          },
          {
            latex: "d = |ax_1 + by_1 + c|",
            label: "분모가 1이다.",
            isCorrect: false,
            feedback: "기울기 보정 계수인 분모가 반드시 있어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "sqrt(A) / A = 1 / sqrt(A)",
          why: "점 (x1, y1)을 직선 방정식 좌변에 그대로 대입하고 절댓값을 씌운 꼴입니다.",
          commonMistake: "원점 (0,0)에서의 거리는 |c| / sqrt(a^2+b^2) 입니다."
        }
      }
    ]
  },
  {
    id: "section_formula",
    title: "선분의 내분점 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1 / 수학(상)",
    unit: "도형의 방정식 - 평면좌표",
    latex: "P = \\left( \\frac{mx_2 + nx_1}{m + n}, \\; \\frac{my_2 + ny_1}{m + n} \\right)",
    coreConcept: "수직선 비례식 (x - x1) : (x2 - x) = m : n 과 닮음",
    prerequisites: "비례식의 성질 (외항의 곱 = 내항의 곱)",
    description: "두 점을 m:n으로 나누는 내분점의 좌표 공식을 대수적으로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "수직선 비례식 풀기",
        goal: "n(x - x1) = m(x2 - x)를 x에 대해 정리합니다.",
        startExpr: "n(x - x_1) = m(x_2 - x)",
        targetExpr: "(m + n)x = mx_2 + nx_1",
        question: "-mx를 좌변으로 넘겨 x로 묶으면?",
        options: [
          {
            latex: "(m + n)x = mx_2 + nx_1",
            label: "(m + n)x = mx2 + nx1",
            isCorrect: true,
            feedback: "맞습니다! 이제 (m+n)으로 양변을 나누면 됩니다."
          },
          {
            latex: "(m - n)x = mx_2 - nx_1",
            label: "뺄셈 부호가 된다.",
            isCorrect: false,
            feedback: "-mx가 좌변으로 가면 +mx가 되므로 (m+n) 덧셈입니다."
          },
          {
            latex: "x = mx_2 + nx_1",
            label: "계수를 나누지 않는다.",
            isCorrect: false,
            feedback: "x 앞의 계수 (m+n)으로 나누어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "내분점은 더하기(+), 외분점은 빼기(-)입니다.",
          why: "m은 x2(먼 쪽)와 곱해지고 n은 x1과 크로스로 곱해집니다.",
          commonMistake: "m과 x1을 짝짓지 않도록 주의하세요."
        }
      },
      {
        stepNumber: 2,
        title: "좌표평면의 x, y 좌표로 확장",
        goal: "양변을 (m+n)으로 나누어 최종 내분점 좌표를 완성합니다.",
        startExpr: "x = \\frac{mx_2 + nx_1}{m + n}",
        targetExpr: "P = \\left( \\frac{mx_2 + nx_1}{m + n}, \\; \\frac{my_2 + ny_1}{m + n} \\right)",
        question: "닮음비에 의해 y좌표까지 동일하게 적용한 최종 내분점 P는?",
        options: [
          {
            latex: "P = \\left( \\frac{mx_2 + nx_1}{m + n}, \\; \\frac{my_2 + ny_1}{m + n} \\right)",
            label: "x와 y 좌표 모두 (m*x2 + n*x1)/(m+n) 형태이다.",
            isCorrect: true,
            feedback: "정답입니다! 중점은 m=n=1일 때의 (x1+x2)/2 입니다."
          },
          {
            latex: "P = \\left( \\frac{mx_1 + nx_2}{m + n}, \\; \\frac{my_1 + ny_2}{m + n} \\right)",
            label: "m에 x1을 곱한다.",
            isCorrect: false,
            feedback: "m은 반드시 x2에 곱해져야 합니다 (크로스 원리)."
          },
          {
            latex: "P = (mx_2 + nx_1, my_2 + ny_1)",
            label: "분모 (m+n)을 쓰지 않는다.",
            isCorrect: false,
            feedback: "비율의 합으로 나누어 가중평균을 내야 합니다."
          }
        ],
        aiGuidance: {
          hint: "외분점 공식은 n 대신 -n을 대입하면 바로 유도됩니다.",
          why: "무게중심도 이 내분점 공식(2:1)을 두 번 적용하여 유도됩니다.",
          commonMistake: "내분점 분모는 m+n, 외분점 분모는 m-n 입니다."
        }
      }
    ]
  },
  {
    id: "circle_equation",
    title: "원의 방정식 표준형",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1 / 수학(상)",
    unit: "도형의 방정식 - 원의 방정식",
    latex: "(x - a)^2 + (y - b)^2 = r^2",
    coreConcept: "원의 정의(정점으로부터 일정한 거리에 있는 점들의 자취)",
    prerequisites: "두 점 사이의 거리 공식",
    description: "중심이 (a, b)이고 반지름이 r인 원의 자취 방정식을 두 점 사이의 거리 공식으로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "중심과 원 위의 점 사이의 거리 등식",
        goal: "중심 C(a, b)와 원 위의 점 P(x, y) 사이의 거리가 r임을 씁니다.",
        startExpr: "\\text{거리 } CP = r",
        targetExpr: "\\sqrt{(x - a)^2 + (y - b)^2} = r",
        question: "두 점 사이의 거리 공식으로 CP = r을 표현하면?",
        options: [
          {
            latex: "\\sqrt{(x - a)^2 + (y - b)^2} = r",
            label: "sqrt((x-a)^2 + (y-b)^2) = r",
            isCorrect: true,
            feedback: "맞습니다! 원의 기하학적 정의가 수식으로 표현되었습니다."
          },
          {
            latex: "(x - a) + (y - b) = r",
            label: "제곱과 루트를 쓰지 않는다.",
            isCorrect: false,
            feedback: "거리는 피타고라스 정리 형태입니다."
          },
          {
            latex: "\\sqrt{(x + a)^2 + (y + b)^2} = r",
            label: "부호가 플러스이다.",
            isCorrect: false,
            feedback: "좌표의 차이이므로 (x-a) 입니다."
          }
        ],
        aiGuidance: {
          hint: "원의 정의: 한 정점(중심)에서 같은 거리(반지름)에 있는 점들의 집합",
          why: "양변을 제곱하면 근호가 사라져 표준형이 됩니다.",
          commonMistake: "중심이 (a,b)일 때 식은 (x-a)^2, (y-b)^2 입니다."
        }
      },
      {
        stepNumber: 2,
        title: "양변을 제곱하여 표준형 완성",
        goal: "양변을 제곱하여 근호를 제거합니다.",
        startExpr: "\\sqrt{(x - a)^2 + (y - b)^2} = r",
        targetExpr: "(x - a)^2 + (y - b)^2 = r^2",
        question: "양변을 제곱한 최종 원의 방정식은?",
        options: [
          {
            latex: "(x - a)^2 + (y - b)^2 = r^2",
            label: "(x - a)^2 + (y - b)^2 = r^2",
            isCorrect: true,
            feedback: "정확합니다! 우변이 r이 아니라 r^2임에 주의하세요."
          },
          {
            latex: "(x - a)^2 + (y - b)^2 = r",
            label: "우변을 제곱하지 않고 r로 둔다.",
            isCorrect: false,
            feedback: "양변을 똑같이 제곱해야 하므로 r^2입니다."
          },
          {
            latex: "x^2 + y^2 = r^2",
            label: "중심이 항상 원점이다.",
            isCorrect: false,
            feedback: "중심이 (0,0)일 때만 x^2+y^2=r^2 입니다."
          }
        ],
        aiGuidance: {
          hint: "우변이 16이면 반지름은 4입니다.",
          why: "전개하면 x^2 + y^2 + Ax + By + C = 0 의 일반형이 됩니다.",
          commonMistake: "우변 숫자에 루트를 씌워야 반지름이 됩니다."
        }
      }
    ]
  },
  {
    id: "am_gm_inequality",
    title: "산술평균과 기하평균의 관계",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학2 / 수학(하)",
    unit: "집합과 명제 - 절대부등식",
    latex: "\\frac{a + b}{2} \\ge \\sqrt{ab} \\quad (a > 0, b > 0)",
    coreConcept: "완전제곱식 (sqrt(a) - sqrt(b))^2 >= 0 변형",
    prerequisites: "실수의 제곱은 0 이상, 무리수의 연산",
    description: "양수 a, b에 대해 항상 성립하는 최대/최소 문제의 핵심 절대부등식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "좌변에서 우변을 뺀 식 구성",
        goal: "(a+b)/2 - sqrt(ab) 를 통분하여 분자를 관찰합니다.",
        startExpr: "\\frac{a + b}{2} - \\sqrt{ab} = \\frac{a - 2\\sqrt{ab} + b}{2}",
        targetExpr: "\\frac{(\\sqrt{a} - \\sqrt{b})^2}{2}",
        question: "분자 a - 2*sqrt(ab) + b 는 어떤 완전제곱식으로 묶일까요?",
        options: [
          {
            latex: "(\\sqrt{a} - \\sqrt{b})^2",
            label: "a = (sqrt(a))^2, b = (sqrt(b))^2 이므로 (sqrt(a) - sqrt(b))^2",
            isCorrect: true,
            feedback: "맞습니다! a와 b가 양수이므로 루트를 씌워 완전제곱식으로 만들 수 있습니다."
          },
          {
            latex: "(a - b)^2",
            label: "(a - b)^2 이다.",
            isCorrect: false,
            feedback: "가운데가 2ab가 아니라 2*sqrt(ab)이므로 루트의 차의 제곱입니다."
          },
          {
            latex: "(\\sqrt{a} + \\sqrt{b})^2",
            label: "부호가 플러스이다.",
            isCorrect: false,
            feedback: "가운데 부호가 -2*sqrt(ab)이므로 마이너스입니다."
          }
        ],
        aiGuidance: {
          hint: "실수의 제곱은 항상 0 이상입니다.",
          why: "분자가 완전제곱식이 되므로 전체 식이 0 이상임이 증명됩니다.",
          commonMistake: "a>0, b>0 조건이 없으면 루트 속이 음수가 될 수 있어 성립하지 않습니다."
        }
      },
      {
        stepNumber: 2,
        title: "부등식 완성 및 등호 성립 조건",
        goal: "(sqrt(a) - sqrt(b))^2 / 2 >= 0 이므로 증명을 완료하고 등호 조건을 확인합니다.",
        startExpr: "\\frac{(\\sqrt{a} - \\sqrt{b})^2}{2} \\ge 0",
        targetExpr: "\\frac{a + b}{2} \\ge \\sqrt{ab} \\quad (\\text{등호: } a = b)",
        question: "이 부등식에서 등호(=)가 성립하기 위한 조건은?",
        options: [
          {
            latex: "a = b",
            label: "sqrt(a) - sqrt(b) = 0, 즉 a = b 일 때",
            isCorrect: true,
            feedback: "정답입니다! 두 수가 서로 같을 때 산술평균과 기하평균이 일치합니다."
          },
          {
            latex: "a + b = 0",
            label: "a + b = 0 일 때",
            isCorrect: false,
            feedback: "a, b는 양수이므로 합이 0이 될 수 없습니다."
          },
          {
            latex: "ab = 1",
            label: "곱이 1일 때만 성립한다.",
            isCorrect: false,
            feedback: "값이 무엇이든 두 수가 서로 같기만 하면 됩니다."
          }
        ],
        aiGuidance: {
          hint: "합이 일정할 때 곱의 최댓값, 또는 곱이 일정할 때 합의 최솟값을 구할 때 쓰입니다.",
          why: "a+b >= 2*sqrt(ab) 꼴로 실전 문제에서 가장 많이 쓰입니다.",
          commonMistake: "서술형에서 '단, 등호는 a=b일 때 성립'을 적지 않으면 감점됩니다."
        }
      }
    ]
  },
  {
    id: "vieta_formulas",
    title: "이차방정식 근과 계수의 관계",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1 / 수학(상)",
    unit: "방정식과 부등식 - 이차방정식",
    latex: "\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}",
    coreConcept: "인수정리와 전개식의 계수비교법",
    prerequisites: "인수정리, 다항식의 전개",
    description: "이차방정식의 두 근의 합과 곱이 계수와 맺는 필연적 관계(비에트 정리)를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "두 근을 인수로 갖는 식 전개하기",
        goal: "a(x - alpha)(x - beta) = 0 을 전개합니다.",
        startExpr: "a(x - \\alpha)(x - \\beta) = 0",
        targetExpr: "ax^2 - a(\\alpha + \\beta)x + a\\alpha\\beta = 0",
        question: "괄호를 전개하여 a를 분배한 식은?",
        options: [
          {
            latex: "ax^2 - a(\\alpha + \\beta)x + a\\alpha\\beta = 0",
            label: "ax^2 - a(alpha + beta)x + a*alpha*beta = 0",
            isCorrect: true,
            feedback: "맞습니다! 이제 원래 식 ax^2 + bx + c = 0 과 계수를 비교합니다."
          },
          {
            latex: "ax^2 + a(\\alpha + \\beta)x + a\\alpha\\beta = 0",
            label: "일차항 부호가 플러스이다.",
            isCorrect: false,
            feedback: "(x-alpha)(x-beta)의 일차항은 -(alpha+beta)x 입니다."
          },
          {
            latex: "x^2 - (\\alpha + \\beta)x + \\alpha\\beta = 0",
            label: "계수 a를 곱하지 않는다.",
            isCorrect: false,
            feedback: "최고차항 계수가 a이므로 a가 곱해져야 합니다."
          }
        ],
        aiGuidance: {
          hint: "-a(alpha + beta) = b, a*alpha*beta = c",
          why: "항등식의 계수비교법을 사용합니다.",
          commonMistake: "합의 공식에는 마이너스 부호가 붙습니다."
        }
      },
      {
        stepNumber: 2,
        title: "계수 비교하여 합과 곱 도출",
        goal: "-a(alpha + beta) = b 와 a(alpha*beta) = c 에서 양변을 a로 나눕니다.",
        startExpr: "-a(\\alpha + \\beta) = b, \\quad a\\alpha\\beta = c",
        targetExpr: "\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}",
        question: "양변을 a로 나눈 두 근의 합과 곱은?",
        options: [
          {
            latex: "\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}",
            label: "합 = -b/a, 곱 = c/a",
            isCorrect: true,
            feedback: "정답입니다! 근을 직접 구하지 않고도 합과 곱을 1초 만에 알아내는 마법입니다."
          },
          {
            latex: "\\alpha + \\beta = \\frac{b}{a}, \\quad \\alpha\\beta = -\\frac{c}{a}",
            label: "합이 양수, 곱이 음수이다.",
            isCorrect: false,
            feedback: "합이 -b/a, 곱이 +c/a 입니다."
          },
          {
            latex: "\\alpha + \\beta = -\\frac{c}{a}, \\quad \\alpha\\beta = \\frac{b}{a}",
            label: "b와 c의 위치가 바뀐다.",
            isCorrect: false,
            feedback: "b는 일차항, c는 상수항입니다."
          }
        ],
        aiGuidance: {
          hint: "3차방정식에서도 세 근의 합은 -b/a, 둘씩 곱한 합은 c/a, 세 근의 곱은 -d/a 로 확장됩니다.",
          why: "근의 공식으로 구한 두 근을 직접 더하고 곱해도 완전히 같습니다.",
          commonMistake: "합의 마이너스 부호를 빠뜨리지 않도록 주의하세요."
        }
      }
    ]
  },

  // =========================================================================
  // 고등학교 2학년 (고2: 대수 / 수학Ⅰ / 미적분Ⅰ)
  // =========================================================================
  {
    id: "arithmetic_sum",
    title: "등차수열의 합 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "대수 / 수학Ⅰ",
    unit: "수열 - 등차수열",
    latex: "S_n = \\frac{n(2a + (n - 1)d)}{2} = \\frac{n(a + l)}{2}",
    coreConcept: "수열을 원래 순서와 역순으로 두 번 나열하여 변변 더하기 (가우스 방식)",
    prerequisites: "등차수열의 일반항 a_n = a + (n-1)d",
    description: "가우스가 10살 때 발견한 등차수열 합의 대칭적 역순 덧셈 아이디어로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "Sn을 정방향과 역방향으로 나열하여 더하기",
        goal: "Sn을 두 번 더하면 각 열의 합이 (a+l)로 모두 같아짐을 봅니다.",
        startExpr: "S_n = a + \\dots + l, \\quad S_n = l + \\dots + a",
        targetExpr: "2S_n = \\underbrace{(a+l) + (a+l) + \\dots + (a+l)}_{n\\text{개}} = n(a+l)",
        question: "두 식을 더했을 때 2*Sn의 값은?",
        options: [
          {
            latex: "2S_n = n(a + l)",
            label: "모든 짝의 합이 (a+l)로 일정하고 총 n개이므로 n(a+l)이다.",
            isCorrect: true,
            feedback: "맞습니다! 공차 d가 서로 상쇄되어 완벽한 대칭성을 이룹니다."
          },
          {
            latex: "S_n = n(a + l)",
            label: "좌변이 Sn이다.",
            isCorrect: false,
            feedback: "두 번 더했으므로 좌변은 2*Sn입니다."
          },
          {
            latex: "2S_n = 2n(a + l)",
            label: "2n개가 된다.",
            isCorrect: false,
            feedback: "항의 개수는 그대로 n개입니다."
          }
        ],
        aiGuidance: {
          hint: "첫 항과 끝 항의 합은 두 번째 항과 끝에서 두 번째 항의 합과 같습니다.",
          why: "양변을 2로 나누면 Sn = n(a+l)/2 가 됩니다.",
          commonMistake: "끝 항 l = a + (n-1)d 를 대입하면 n(2a+(n-1)d)/2 가 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "2로 나누고 일반항 l 대입하기",
        goal: "Sn = n(a+l)/2 에 l = a + (n-1)d 를 대입합니다.",
        startExpr: "S_n = \\frac{n(a + l)}{2}",
        targetExpr: "S_n = \\frac{n(2a + (n-1)d)}{2}",
        question: "끝 항 공식 l = a + (n-1)d 를 대입하여 정리하면?",
        options: [
          {
            latex: "S_n = \\frac{n(2a + (n-1)d)}{2}",
            label: "Sn = n(2a + (n-1)d) / 2",
            isCorrect: true,
            feedback: "정확합니다! 끝항을 알 때와 공차를 알 때 각각 골라 쓸 수 있습니다."
          },
          {
            latex: "S_n = \\frac{n(a + nd)}{2}",
            label: "nd를 대입한다.",
            isCorrect: false,
            feedback: "제n항의 공차는 (n-1)d 입니다."
          },
          {
            latex: "S_n = n(2a + (n-1)d)",
            label: "2로 나누지 않는다.",
            isCorrect: false,
            feedback: "좌변이 2*Sn이었으므로 분모 2가 반드시 필요합니다."
          }
        ],
        aiGuidance: {
          hint: "1부터 n까지의 자연수의 합은 a=1, d=1, l=n이므로 n(n+1)/2 가 됩니다.",
          why: "연속한 수의 합을 순식간에 계산할 수 있습니다.",
          commonMistake: "항의 개수 n과 마지막 수 l을 혼동하지 마세요."
        }
      }
    ]
  },
  {
    id: "geometric_sum",
    title: "등비수열의 합 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "대수 / 수학Ⅰ",
    unit: "수열 - 등비수열",
    latex: "S_n = \\frac{a(r^n - 1)}{r - 1} \\quad (r \\ne 1)",
    coreConcept: "합 Sn에 공비 r을 곱하여 한 칸 밀어 빼기 (망원소거)",
    prerequisites: "등비수열 일반항 a_n = ar^(n-1)",
    description: "공비 r을 곱해 뺌으로써 중간의 모든 무수한 항을 한 번에 소거하는 아름다운 기법을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "Sn - r*Sn 계산하기",
        goal: "Sn 식에 r을 곱한 식을 변변 뺍니다.",
        startExpr: "S_n - r S_n = (a + ar + \\dots + ar^{n-1}) - (ar + ar^2 + \\dots + ar^n)",
        targetExpr: "(1 - r)S_n = a - ar^n = a(1 - r^n)",
        question: "두 식을 뺐을 때 좌변과 우변에 남는 항은?",
        options: [
          {
            latex: "(1 - r)S_n = a(1 - r^n)",
            label: "중간 항들이 모두 지워지고 맨 앞 a와 맨 뒤 -ar^n 만 남아 a(1-r^n)이 된다.",
            isCorrect: true,
            feedback: "맞습니다! 도미노처럼 중간의 모든 항이 0이 되어 사라집니다."
          },
          {
            latex: "(1 - r)S_n = a(1 - r^{n-1})",
            label: "우변이 ar^(n-1)이다.",
            isCorrect: false,
            feedback: "r*Sn의 마지막 항은 ar^(n-1)*r = ar^n 입니다."
          },
          {
            latex: "(r - 1)S_n = a(1 - r^n)",
            label: "좌변 부호가 r-1이다.",
            isCorrect: false,
            feedback: "Sn - r*Sn = (1-r)Sn 입니다."
          }
        ],
        aiGuidance: {
          hint: "한 칸 비스듬히 나열하여 빼면 양 끝의 2개 항만 살아남습니다.",
          why: "r!=1 일 때 양변을 (1-r)로 나누면 공식이 완성됩니다.",
          commonMistake: "r=1일 때는 나눌 수 없으며, 이때는 Sn = na 입니다."
        }
      },
      {
        stepNumber: 2,
        title: "양변을 (1-r)로 나누기",
        goal: "Sn = a(1 - r^n)/(1 - r) = a(r^n - 1)/(r - 1) 을 도출합니다.",
        startExpr: "(1 - r)S_n = a(1 - r^n)",
        targetExpr: "S_n = \\frac{a(r^n - 1)}{r - 1}",
        question: "분모와 분자에 -1을 곱해 정리한 표준 공식은?",
        options: [
          {
            latex: "S_n = \\frac{a(r^n - 1)}{r - 1}",
            label: "Sn = a(r^n - 1) / (r - 1) (r > 1일 때 주로 사용)",
            isCorrect: true,
            feedback: "정확합니다! r<1일 때는 a(1-r^n)/(1-r)을 쓰는 것이 양수 계산에 편합니다."
          },
          {
            latex: "S_n = \\frac{a(r^n + 1)}{r + 1}",
            label: "부호가 모두 플러스이다.",
            isCorrect: false,
            feedback: "-1을 곱한 것이므로 뺄셈 순서가 뒤집히는 것입니다."
          },
          {
            latex: "S_n = \\frac{a(r - 1)}{r^n - 1}",
            label: "분모와 분자가 바뀐다.",
            isCorrect: false,
            feedback: "분모에 (r-1)이 옵니다."
          }
        ],
        aiGuidance: {
          hint: "r>1일 때는 (r-1), r<1일 때는 (1-r) 형태를 취합니다.",
          why: "미적분의 등비급수 공식 S = a / (1-r) 의 근원이 됩니다.",
          commonMistake: "지수가 n-1이 아니라 n개 항이므로 n승입니다."
        }
      }
    ]
  },
  {
    id: "log_product_property",
    title: "로그의 덧셈 성질",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "대수 / 수학Ⅰ",
    unit: "지수와 로그",
    latex: "\\log_a(xy) = \\log_a x + \\log_a y",
    coreConcept: "지수법칙 a^(p+q) = a^p * a^q 과 로그의 정의",
    prerequisites: "로그의 정의 a^p = x <=> p = log_a x",
    description: "진수의 곱이 로그의 덧셈으로 바뀌는 마법 같은 원리를 지수법칙으로부터 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "로그를 지수로 치환하여 곱하기",
        goal: "p = log_a x, q = log_a y 로 두면 x = a^p, y = a^q 가 됩니다.",
        startExpr: "x = a^p, \\quad y = a^q",
        targetExpr: "xy = a^p \\cdot a^q = a^{p+q}",
        question: "지수법칙에 의해 두 수의 곱 xy는?",
        options: [
          {
            latex: "xy = a^{p+q}",
            label: "밑이 같으므로 지수끼리 더해져 a^(p+q)가 된다.",
            isCorrect: true,
            feedback: "맞습니다! 지수의 덧셈이 바로 로그의 덧셈을 만들어냅니다."
          },
          {
            latex: "xy = a^{pq}",
            label: "지수끼리 곱해진다.",
            isCorrect: false,
            feedback: "거듭제곱의 곱은 지수끼리의 합입니다."
          },
          {
            latex: "xy = (2a)^{p+q}",
            label: "밑도 2배가 된다.",
            isCorrect: false,
            feedback: "밑 a는 변하지 않습니다."
          }
        ],
        aiGuidance: {
          hint: "로그는 본질적으로 지수입니다.",
          why: "xy = a^(p+q)의 양변에 로그를 취하면 끝납니다.",
          commonMistake: "밑 조건 a>0, a!=1, 진수 조건 x>0, y>0 확인!"
        }
      },
      {
        stepNumber: 2,
        title: "다시 로그 정의를 적용하여 공식 완성",
        goal: "a^(p+q) = xy 이므로 p + q = log_a(xy) 가 됩니다.",
        startExpr: "p + q = \\log_a(xy)",
        targetExpr: "\\log_a x + \\log_a y = \\log_a(xy)",
        question: "p와 q 자리에 원래의 로그 식을 대입하면?",
        options: [
          {
            latex: "\\log_a(xy) = \\log_a x + \\log_a y",
            label: "log_a(xy) = log_a x + log_a y",
            isCorrect: true,
            feedback: "정확합니다! 곱셈 연산을 덧셈으로 단순화시키는 로그의 본질입니다."
          },
          {
            latex: "\\log_a(x+y) = \\log_a x \\cdot \\log_a y",
            label: "진수의 덧셈이 로그의 곱셈이 된다.",
            isCorrect: false,
            feedback: "가장 치명적인 오류입니다! log(x+y)는 분해되지 않습니다."
          },
          {
            latex: "\\log_a(xy) = (\\log_a x)(\\log_a y)",
            label: "로그끼리 곱한다.",
            isCorrect: false,
            feedback: "로그끼리의 '합'입니다."
          }
        ],
        aiGuidance: {
          hint: "천문학자들이 방대한 곱셈을 덧셈표로 쉽게 계산하기 위해 로그를 만들었습니다.",
          why: "나눗셈 성질 log_a(x/y) = log_a x - log_a y 도 같은 방식으로 유도됩니다.",
          commonMistake: "절대로 log(x+y) = log x + log y 로 쪼개지 마세요!"
        }
      }
    ]
  },
  {
    id: "law_of_cosines",
    title: "코사인법칙",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "대수 / 수학Ⅰ",
    unit: "삼각함수 - 삼각형에의 응용",
    latex: "a^2 = b^2 + c^2 - 2bc\\cos A",
    coreConcept: "수선의 발을 내려 피타고라스 정리를 두 직각삼각형에 적용하기",
    prerequisites: "피타고라스 정리, 삼각비 정의, sin^2 + cos^2 = 1",
    description: "피타고라스 정리를 직각이 아닌 일반적인 모든 삼각형으로 확장한 제2코사인법칙을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "수선 CH를 내리고 변의 길이를 삼각비로 표현",
        goal: "높이 CH = b sin A, 밑변 AH = b cos A, BH = c - b cos A 로 둡니다.",
        startExpr: "CH = b\\sin A, \\quad BH = c - b\\cos A",
        targetExpr: "a^2 = (b\\sin A)^2 + (c - b\\cos A)^2",
        question: "직각삼각형 BHC에 피타고라스 정리를 적용한 식은?",
        options: [
          {
            latex: "a^2 = (b\\sin A)^2 + (c - b\\cos A)^2",
            label: "a^2 = (b sin A)^2 + (c - b cos A)^2",
            isCorrect: true,
            feedback: "맞습니다! 이제 우변의 완전제곱식을 전개합니다."
          },
          {
            latex: "a^2 = (b\\cos A)^2 + (c - b\\sin A)^2",
            label: "사인과 코사인을 바꾼다.",
            isCorrect: false,
            feedback: "마주보는 높이가 사인(sin), 밑변이 코사인(cos)입니다."
          },
          {
            latex: "a^2 = b^2 + c^2",
            label: "직각삼각형처럼 바로 쓴다.",
            isCorrect: false,
            feedback: "각 A가 90도가 아니므로 수선을 내려 쪼개야 합니다."
          }
        ],
        aiGuidance: {
          hint: "빗변이 b인 직각삼각형 AHC에서 높이는 b sin A 입니다.",
          why: "전개하면 sin^2 A + cos^2 A = 1 이 나타나 깔끔해집니다.",
          commonMistake: "완전제곱식 전개 시 -2bc cos A 중간항을 잊지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "전개하고 sin^2 A + cos^2 A = 1 로 묶기",
        goal: "b^2 sin^2 A + b^2 cos^2 A = b^2(sin^2 A + cos^2 A) = b^2 을 적용합니다.",
        startExpr: "a^2 = b^2(\\sin^2 A + \\cos^2 A) + c^2 - 2bc\\cos A",
        targetExpr: "a^2 = b^2 + c^2 - 2bc\\cos A",
        question: "항등식 sin^2 A + cos^2 A = 1 을 대입하여 정리하면?",
        options: [
          {
            latex: "a^2 = b^2 + c^2 - 2bc\\cos A",
            label: "a^2 = b^2 + c^2 - 2bc cos A",
            isCorrect: true,
            feedback: "완벽합니다! A=90도이면 cos 90 = 0이 되어 피타고라스 정리와 정확히 일치합니다!"
          },
          {
            latex: "a^2 = b^2 + c^2 + 2bc\\cos A",
            label: "부호가 플러스이다.",
            isCorrect: false,
            feedback: "완전제곱식 뺄셈 전개이므로 -2bc cos A 입니다."
          },
          {
            latex: "a^2 = (b-c)^2 - 2bc\\cos A",
            label: "b^2+c^2 대신 (b-c)^2을 쓴다.",
            isCorrect: false,
            feedback: "b^2과 c^2은 각각 독립된 제곱항입니다."
          }
        ],
        aiGuidance: {
          hint: "두 변과 끼인각을 알 때 마주보는 대변의 길이를 구할 때 사용합니다.",
          why: "세 변의 길이를 알 때 코사인 값을 구하는 cos A = (b^2+c^2-a^2)/(2bc) 로도 변형됩니다.",
          commonMistake: "마주보는 변 a와 각 A가 짝을 이룹니다."
        }
      }
    ]
  },
  {
    id: "power_rule",
    title: "멱함수의 도함수 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "미적분Ⅰ / 수학Ⅱ",
    unit: "미분 - 도함수",
    latex: "(x^n)' = n x^{n-1} \\quad (n \\in \\mathbb{N})",
    coreConcept: "도함수의 정의식에 이항정리 전개 적용",
    prerequisites: "도함수 정의 lim_{h->0} (f(x+h)-f(x))/h",
    description: "다항함수 미분의 가장 기본이 되는 지수 내리기 공식을 도함수의 정의로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "도함수 정의에 (x+h)^n 대입하고 이항정리 전개",
        goal: "(x+h)^n = x^n + n*x^(n-1)*h + ... + h^n 을 대입하여 x^n을 소거합니다.",
        startExpr: "\\lim_{h \\to 0} \\frac{(x+h)^n - x^n}{h}",
        targetExpr: "\\lim_{h \\to 0} \\frac{n x^{n-1}h + \\binom{n}{2}x^{n-2}h^2 + \\dots + h^n}{h}",
        question: "분자에서 x^n - x^n = 0 으로 지워진 후 h의 최저차항 계수는?",
        options: [
          {
            latex: "n x^{n-1}h",
            label: "h의 1차항은 n*x^(n-1)*h 이다.",
            isCorrect: true,
            feedback: "맞습니다! 이항계수 nC1 = n 이므로 일차항 계수가 n이 됩니다."
          },
          {
            latex: "x^{n-1}h",
            label: "계수가 1이다.",
            isCorrect: false,
            feedback: "이항정리에서 두 번째 항의 계수는 n입니다."
          },
          {
            latex: "h^n",
            label: "h^n만 남는다.",
            isCorrect: false,
            feedback: "전개식의 모든 항에 h가 곱해져 있습니다."
          }
        ],
        aiGuidance: {
          hint: "(x+h)^2 = x^2 + 2xh + h^2, (x+h)^3 = x^3 + 3x^2 h + ...",
          why: "분모의 h와 약분하여 0/0 부정형을 탈출하기 위함입니다.",
          commonMistake: "인수분해 공식 a^n - b^n = (a-b)(a^(n-1)+...)로 유도할 수도 있습니다."
        }
      },
      {
        stepNumber: 2,
        title: "h로 약분하고 극한 h -> 0 보내기",
        goal: "h로 나누면 n*x^(n-1) 뒤의 모든 항에는 h가 적어도 1개 남아 0이 됩니다.",
        startExpr: "\\lim_{h \\to 0} \\left[ n x^{n-1} + \\binom{n}{2}x^{n-2}h + \\dots + h^{n-1} \\right]",
        targetExpr: "n x^{n-1}",
        question: "h -> 0 을 대입한 최종 미분 결과는?",
        options: [
          {
            latex: "n x^{n-1}",
            label: "h가 없는 첫 항 n*x^(n-1)만 남고 나머지는 0이 된다.",
            isCorrect: true,
            feedback: "정확합니다! 지수가 앞으로 곱해지고 차수가 1 줄어드는 미분 공식이 완성되었습니다!"
          },
          {
            latex: "x^{n-1}",
            label: "n이 0이 된다.",
            isCorrect: false,
            feedback: "n은 h와 무관한 상수이므로 그대로 남습니다."
          },
          {
            latex: "n x^n",
            label: "차수가 줄어들지 않는다.",
            isCorrect: false,
            feedback: "미분하면 차수가 1 줄어듭니다."
          }
        ],
        aiGuidance: {
          hint: "상수 c를 미분하면 0이 되는 이유도 c - c = 0 이기 때문입니다.",
          why: "이 공식 하나로 모든 고등학교 다항함수의 미분이 가능해집니다.",
          commonMistake: "지수가 음수나 유리수, 실수일 때도 확장되어 항상 성립합니다."
        }
      }
    ]
  },
  {
    id: "product_rule",
    title: "두 함수의 곱의 미분법",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "미적분Ⅰ / 수학Ⅱ",
    unit: "미분 - 도함수의 계산",
    latex: "\\{f(x)g(x)\\}' = f'(x)g(x) + f(x)g'(x)",
    coreConcept: "도함수 정의식 분자에 보조항 -f(x+h)g(x) + f(x+h)g(x) 더하고 빼기",
    prerequisites: "도함수의 정의, 미분가능하면 연속",
    description: "(fg)'이 단순히 f'g'가 아니라 왜 f'g + fg'가 되는지 엄밀하게 증명합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "도함수 정의식 분자에 보조항 더하고 빼기",
        goal: "분자에 -f(x+h)g(x) + f(x+h)g(x)를 끼워넣어 f와 g의 변화량을 분리합니다.",
        startExpr: "\\lim_{h \\to 0} \\frac{f(x+h)g(x+h) - f(x)g(x)}{h}",
        targetExpr: "\\lim_{h \\to 0} \\left[ f(x+h)\\frac{g(x+h)-g(x)}{h} + g(x)\\frac{f(x+h)-f(x)}{h} \\right]",
        question: "식의 값을 보존하면서 두 증분으로 묶어내기 위한 영리한 보조항은?",
        options: [
          {
            latex: "- f(x+h)g(x) + f(x+h)g(x)",
            label: "f(x+h)g(x)를 뺐다가 다시 더해준다 (합이 0).",
            isCorrect: true,
            feedback: "정확합니다! 이 트릭으로 앞부분은 g의 미분, 뒷부분은 f의 미분으로 분리됩니다."
          },
          {
            latex: "- f(x)g(x) + f(x)g(x)",
            label: "f(x)g(x)를 더하고 뺀다.",
            isCorrect: false,
            feedback: "이미 -f(x)g(x)가 있으므로 묶이지 않습니다."
          },
          {
            latex: "\\times \\frac{f(x)}{f(x)}",
            label: "f(x)를 곱하고 나눈다.",
            isCorrect: false,
            feedback: "차이 형태를 쪼개야 하므로 덧셈/뺄셈 조작이어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "한 쪽은 f만 변하고, 다른 쪽은 g만 변하게 징검다리를 놓아주는 것입니다.",
          why: "수학적 테크닉: 0을 더하거나 1을 곱하는 변형!",
          commonMistake: "절대로 (fg)' = f'g' 가 아닙니다!"
        }
      },
      {
        stepNumber: 2,
        title: "극한 h -> 0 적용하여 공식 도출",
        goal: "h->0 일 때 f(x+h) -> f(x) (연속성)이고 각 미분계수 f', g'를 대입합니다.",
        startExpr: "\\lim_{h \\to 0} f(x+h) \\cdot g'(x) + g(x) \\cdot f'(x)",
        targetExpr: "f(x)g'(x) + f'(x)g(x)",
        question: "극한을 취해 완성된 곱의 미분 공식은?",
        options: [
          {
            latex: "f'(x)g(x) + f(x)g'(x)",
            label: "앞에 거 미분 * 뒤에 거 그대로 + 앞에 거 그대로 * 뒤에 거 미분",
            isCorrect: true,
            feedback: "완벽합니다! '미그그미'라는 유명한 곱의 미분 공식이 완성되었습니다!"
          },
          {
            latex: "f'(x)g'(x)",
            label: "단순히 두 도함수의 곱이다.",
            isCorrect: false,
            feedback: "초심자들이 가장 많이 실수하는 함정입니다."
          },
          {
            latex: "f'(x) + g'(x)",
            label: "두 도함수의 합이다.",
            isCorrect: false,
            feedback: "합의 미분이 f'+g' 입니다."
          }
        ],
        aiGuidance: {
          hint: "세 함수의 곱 (fgh)' = f'gh + fg'h + fgh' 로도 확장됩니다.",
          why: "이 공식 덕분에 미적분의 부분적분법이 탄생하게 됩니다.",
          commonMistake: "미분가능한 함수는 반드시 연속이므로 lim f(x+h) = f(x) 입니다."
        }
      }
    ]
  },

  // =========================================================================
  // 고등학교 3학년 (고3: 미적분 / 확통 / 기하)
  // =========================================================================
  {
    id: "trig_addition",
    title: "삼각함수 덧셈정리",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "미적분Ⅱ / 미적분",
    unit: "삼각함수의 미분",
    latex: "\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta",
    coreConcept: "삼각형의 넓이 분할 S = S1 + S2 기하학적 유도",
    prerequisites: "삼각형 넓이 공식 S = 1/2 ab sin C",
    description: "각의 합에 대한 사인 값이 각 삼각비의 교차곱의 합으로 전개되는 핵심 덧셈정리를 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "전체 삼각형 넓이와 두 조각의 넓이 합 등식",
        goal: "전체 넓이 1/2 ab sin(alpha+beta) = 두 삼각형 넓이 합 1/2 ab(sin alpha cos beta + cos alpha sin beta) 로 둡니다.",
        startExpr: "S = \\frac{1}{2}ab\\sin(\\alpha + \\beta)",
        targetExpr: "S_1 + S_2 = \\frac{1}{2}ab(\\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta)",
        question: "전체 넓이 공식과 두 조각 삼각형의 넓이의 합은 항상 같아야 합니다. 양변의 공통인수는?",
        options: [
          {
            latex: "\\frac{1}{2}ab",
            label: "양변에 공통으로 1/2 ab 가 곱해져 있다.",
            isCorrect: true,
            feedback: "맞습니다! 양변을 1/2 ab 로 나누면 덧셈정리가 바로 튀어나옵니다."
          },
          {
            latex: "\\sin(\\alpha + \\beta)",
            label: "사인이 공통이다.",
            isCorrect: false,
            feedback: "사인의 각이 서로 다릅니다."
          },
          {
            latex: "ab^2",
            label: "ab^2이 공통이다.",
            isCorrect: false,
            feedback: "넓이 공식의 계수는 1/2 ab 입니다."
          }
        ],
        aiGuidance: {
          hint: "높이 h를 공유하는 두 직각삼각형을 붙여놓은 모형입니다.",
          why: "1/2 ab 를 약분하기만 하면 끝납니다.",
          commonMistake: "sin(alpha+beta) != sin alpha + sin beta 입니다!"
        }
      },
      {
        stepNumber: 2,
        title: "1/2 ab 소거하여 공식 완성",
        goal: "양변을 1/2 ab로 나누어 sin(alpha+beta) 공식을 얻습니다.",
        startExpr: "\\frac{1}{2}ab\\sin(\\alpha+\\beta) = \\frac{1}{2}ab(\\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta)",
        targetExpr: "\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta",
        question: "약분 후 완성되는 사인 덧셈정리는?",
        options: [
          {
            latex: "\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta",
            label: "sin(alpha+beta) = sin alpha cos beta + cos alpha sin beta",
            isCorrect: true,
            feedback: "정확합니다! '싸코플코싸'라는 암기 공식의 기하학적 근거입니다!"
          },
          {
            latex: "\\sin(\\alpha + \\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta",
            label: "코사인의 덧셈정리이다.",
            isCorrect: false,
            feedback: "이는 cos(alpha+beta) 공식입니다."
          },
          {
            latex: "\\sin(\\alpha + \\beta) = \\sin\\alpha + \\sin\\beta",
            label: "사인이 분배된다.",
            isCorrect: false,
            feedback: "삼각함수는 단순 분배가 불가능합니다."
          }
        ],
        aiGuidance: {
          hint: "beta 대신 alpha를 넣으면 2배각 공식 sin 2alpha = 2 sin alpha cos alpha 가 나옵니다.",
          why: "미적분에서 삼각함수를 미분할 때 핵심적으로 쓰입니다.",
          commonMistake: "사인 덧셈은 중간 부호가 +, 코사인 덧셈은 - 입니다."
        }
      }
    ]
  },
  {
    id: "sin_limit",
    title: "삼각함수의 극한 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "미적분Ⅱ / 미적분",
    unit: "삼각함수의 극한",
    latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\quad (x\\text{는 라디안})",
    coreConcept: "단위원의 삼각형과 부채꼴 넓이 부등식 및 조임정리(샌드위치 정리)",
    prerequisites: "부채꼴 넓이 S = 1/2 r^2 x, 조임정리",
    description: "삼각함수를 미분할 수 있게 해주는 가장 결정적인 극한 공식의 기하학적 조임정리 유도입니다.",
    steps: [
      {
        stepNumber: 1,
        title: "단위원에서 넓이 부등식 세우기",
        goal: "작은 삼각형 < 부채꼴 < 큰 삼각형 포함관계에서 1/2 sin x < 1/2 x < 1/2 tan x 를 세웁니다.",
        startExpr: "\\frac{1}{2}\\sin x < \\frac{1}{2}x < \\frac{1}{2}\\tan x",
        targetExpr: "\\cos x < \\frac{\\sin x}{x} < 1",
        question: "모든 변을 (1/2)sin x로 나누고 역수를 취하면 부등호는 어떻게 될까요?",
        options: [
          {
            latex: "\\cos x < \\frac{\\sin x}{x} < 1",
            label: "역수를 취하면 부등호가 반대로 뒤집혀 cos x < (sin x)/x < 1 이 된다.",
            isCorrect: true,
            feedback: "맞습니다! (sin x)/x 가 cos x와 1 사이에 끼워졌습니다."
          },
          {
            latex: "1 < \\frac{\\sin x}{x} < \\cos x",
            label: "부등호 방향이 바뀌지 않는다.",
            isCorrect: false,
            feedback: "양수의 역수를 취하면 대소 관계가 반대로 뒤집힙니다."
          },
          {
            latex: "\\cos x < 1 < \\frac{\\sin x}{x}",
            label: "가운데에 1이 위치한다.",
            isCorrect: false,
            feedback: "우리가 구하려는 (sin x)/x가 가운데에 위치해야 합니다."
          }
        ],
        aiGuidance: {
          hint: "각 x의 단위가 '라디안(호도법)'이어야 부채꼴 넓이가 1/2 x 로 깔끔해집니다.",
          why: "샌드위치(조임) 정리를 적용할 준비를 마쳤습니다.",
          commonMistake: "tan x = sin x / cos x 입니다."
        }
      },
      {
        stepNumber: 2,
        title: "극한 x -> 0 취하고 조임정리 적용",
        goal: "x -> 0 일 때 cos x -> 1 이고 우변도 1이므로 가운데 극한을 구합니다.",
        startExpr: "\\lim_{x \\to 0} \\cos x = 1, \\quad \\lim_{x \\to 0} 1 = 1",
        targetExpr: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
        question: "양 끝이 모두 1로 수렴할 때 조임정리에 의해 가운데 극한값은?",
        options: [
          {
            latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
            label: "조임정리(샌드위치 정리)에 의해 반드시 1로 수렴한다.",
            isCorrect: true,
            feedback: "정확합니다! 이 극한 덕분에 (sin x)' = cos x 가 유도됩니다!"
          },
          {
            latex: "0",
            label: "0으로 수렴한다.",
            isCorrect: false,
            feedback: "양 끝이 1로 수렴하므로 1이어야 합니다."
          },
          {
            latex: "\\infty",
            label: "발산한다.",
            isCorrect: false,
            feedback: "0/0 부정형이지만 1이라는 유한한 값으로 수렴합니다."
          }
        ],
        aiGuidance: {
          hint: "x가 0에 아주 가까울 때 sin x는 x와 거의 일치합니다 (작은 각 근사).",
          why: "진자의 주기 운동, 전자기파 등 물리학의 모든 조화진동 해석의 기반입니다.",
          commonMistake: "x가 도(degree) 단위이면 pi/180이 곱해지므로 반드시 라디안이어야 합니다."
        }
      }
    ]
  },
  {
    id: "integration_by_parts",
    title: "부분적분법 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "미적분Ⅱ / 미적분",
    unit: "적분법 - 여러 가지 적분법",
    latex: "\\int f(x)g'(x) dx = f(x)g(x) - \\int f'(x)g(x) dx",
    coreConcept: "두 함수의 곱의 미분법 양변 적분",
    prerequisites: "곱의 미분법 (fg)' = f'g + fg', 미적분학의 기본정리",
    description: "미적분의 최고 핵심 테크닉인 부분적분법을 곱의 미분법 공식으로부터 직접 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "곱의 미분법에서 f(x)g'(x)만 남기기",
        goal: "{f(x)g(x)}' = f'(x)g(x) + f(x)g'(x) 에서 이항합니다.",
        startExpr: "\\{f(x)g(x)\\}' = f'(x)g(x) + f(x)g'(x)",
        targetExpr: "f(x)g'(x) = \\{f(x)g(x)\\}' - f'(x)g(x)",
        question: "적분하고자 하는 항 f(x)g'(x)에 대해 정리하면?",
        options: [
          {
            latex: "f(x)g'(x) = \\{f(x)g(x)\\}' - f'(x)g(x)",
            label: "f(x)g'(x) = {f(x)g(x)}' - f'(x)g(x)",
            isCorrect: true,
            feedback: "맞습니다! 곱의 미분법 식의 한 항을 이항했습니다."
          },
          {
            latex: "f(x)g'(x) = \\{f(x)g(x)\\}' + f'(x)g(x)",
            label: "부호가 플러스이다.",
            isCorrect: false,
            feedback: "이항하면 마이너스가 됩니다."
          },
          {
            latex: "f(x)g'(x) = \\frac{\\{f(x)g(x)\\}'}{f'(x)g(x)}",
            label: "나눗셈으로 넘긴다.",
            isCorrect: false,
            feedback: "덧셈으로 묶여 있으므로 뺄셈으로 넘깁니다."
          }
        ],
        aiGuidance: {
          hint: "(uv)' = u'v + uv' 에서 uv' = (uv)' - u'v",
          why: "양변에 적분 기호(인테그랄)를 씌우면 바로 공식이 나옵니다.",
          commonMistake: "미분과 적분은 역연산 관계입니다."
        }
      },
      {
        stepNumber: 2,
        title: "양변에 인테그랄 취하여 공식 완성",
        goal: "도함수를 적분한 인테그랄 {fg}' dx = fg 가 됨을 적용합니다.",
        startExpr: "\\int f(x)g'(x) dx = \\int \\{f(x)g(x)\\}' dx - \\int f'(x)g(x) dx",
        targetExpr: "\\int f(x)g'(x) dx = f(x)g(x) - \\int f'(x)g(x) dx",
        question: "양변을 부정적분한 최종 부분적분법 공식은?",
        options: [
          {
            latex: "\\int f(x)g'(x) dx = f(x)g(x) - \\int f'(x)g(x) dx",
            label: "인테그랄 f g' dx = f g - 인테그랄 f' g dx",
            isCorrect: true,
            feedback: "정확합니다! '그적그미' (그대로 적분 - 그대로 미분)의 정체입니다!"
          },
          {
            latex: "\\int f(x)g'(x) dx = f'(x)g(x) - f(x)g'(x)",
            label: "적분 기호가 모두 사라진다.",
            isCorrect: false,
            feedback: "우변의 f'g 적분은 여전히 남아있어야 합니다."
          },
          {
            latex: "\\int f(x)g'(x) dx = f(x)g(x) + \\int f'(x)g(x) dx",
            label: "가운데 부호가 플러스이다.",
            isCorrect: false,
            feedback: "이항되었으므로 마이너스(-) 부호입니다."
          }
        ],
        aiGuidance: {
          hint: "로다삼지(로그, 다항, 삼각, 지수) 순서로 미분할 함수 f를 선택합니다.",
          why: "인테그랄 ln x dx = x ln x - x + C 도 이 공식으로 유도됩니다.",
          commonMistake: "적분상수는 우변 적분식에 포함되어 흡수됩니다."
        }
      }
    ]
  },
  {
    id: "stars_and_bars",
    title: "중복조합 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "확률과 통계",
    unit: "순열과 조합 - 중복조합",
    latex: "{}_n H_r = {}_{n + r - 1}C_r",
    coreConcept: "공 r개와 칸막이 (n-1)개의 일렬 나열 모델",
    prerequisites: "조합 공식 nCr, 같은 것이 있는 순열",
    description: "서로 다른 n개 중 중복을 허락하여 r개를 택하는 중복조합을 조합으로 바꾸는 칸막이 모델을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "n개의 구역을 나누기 위한 칸막이의 개수",
        goal: "n개 종류를 구분짓기 위해 필요한 칸막이(구분선)의 수를 구합니다.",
        startExpr: "n\\text{개의 서로 다른 종류}",
        targetExpr: "\\text{칸막이 개수} = n - 1\\text{개}",
        question: "n개의 영역을 구분하기 위해 필요한 칸막이는 몇 개일까요?",
        options: [
          {
            latex: "n - 1\\text{개}",
            label: "n개 영역으로 나누려면 경계선은 (n-1)개 필요하다.",
            isCorrect: true,
            feedback: "맞습니다! 예를 들어 3개 방으로 나누려면 벽은 2개만 있으면 됩니다."
          },
          {
            latex: "n\\text{개}",
            label: "구역 수와 같은 n개이다.",
            isCorrect: false,
            feedback: "벽 n개를 세우면 (n+1)개 방으로 나뉘게 됩니다."
          },
          {
            latex: "r - 1\\text{개}",
            label: "공의 개수 r에서 1을 뺀다.",
            isCorrect: false,
            feedback: "칸막이는 '종류의 수 n'을 구분하기 위한 것입니다."
          }
        ],
        aiGuidance: {
          hint: "케이크를 3조각으로 자를 때 칼질은 2번 합니다.",
          why: "공 r개와 칸막이 (n-1)개를 한 줄로 늘어세울 것입니다.",
          commonMistake: "칸막이가 n개가 아니라 n-1개임을 명심하세요."
        }
      },
      {
        stepNumber: 2,
        title: "총 자리 중에서 공(또는 칸막이) 자리 고르기",
        goal: "공 r개 + 칸막이 (n-1)개 = 총 (n+r-1)개 자리 중 r자리를 고르는 조합을 적용합니다.",
        startExpr: "\\text{총 물건의 수} = r + (n - 1) = n + r - 1",
        targetExpr: "{}_n H_r = {}_{n + r - 1}C_r",
        question: "총 (n+r-1)개의 자리 중 공이 들어갈 r자리를 고르는 경우의 수는?",
        options: [
          {
            latex: "{}_{n+r-1}C_r",
            label: "조합 (n+r-1) C r",
            isCorrect: true,
            feedback: "정답입니다! 중복조합 nHr 이 조합 공식으로 치환되는 원리입니다!"
          },
          {
            latex: "{}_n C_r",
            label: "단순 조합 nCr 이다.",
            isCorrect: false,
            feedback: "중복을 허용하므로 경우의 수가 훨씬 큽니다."
          },
          {
            latex: "{}_{nr}C_r",
            label: "n과 r을 곱한 자리이다.",
            isCorrect: false,
            feedback: "자리의 수는 공과 칸막이의 '합'입니다."
          }
        ],
        aiGuidance: {
          hint: "같은 것이 있는 순열 (n+r-1)! / (r! (n-1)!) 과 완전히 일치합니다.",
          why: "복잡한 중복선택이 단순한 자리 선택 조합 문제로 치환됩니다.",
          commonMistake: "방정식 x1 + x2 + ... + xn = r (음이 아닌 정수해)의 개수도 nHr 입니다."
        }
      }
    ]
  },
  {
    id: "conditional_probability",
    title: "조건부확률과 곱셈정리",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "확률과 통계",
    unit: "확률 - 조건부확률",
    latex: "P(B|A) = \\frac{P(A \\cap B)}{P(A)} \\implies P(A \\cap B) = P(A)P(B|A)",
    coreConcept: "표본공간의 축소(전체 사건이 A로 제한됨)",
    prerequisites: "확률의 정의 P(E) = n(E)/n(S)",
    description: "사건 A가 일어났을 때 B가 일어날 조건부확률을 표본공간의 축소 원리로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "축소된 표본공간에서의 경우의 수 비율",
        goal: "A가 일어났으므로 새로운 전체는 n(A)이고, 그 중 B에 해당하는 것은 교집합 n(A cap B)입니다.",
        startExpr: "P(B|A) = \\frac{n(A \\cap B)}{n(A)}",
        targetExpr: "P(B|A) = \\frac{\\frac{n(A \\cap B)}{n(S)}}{\\frac{n(A)}{n(S)}} = \\frac{P(A \\cap B)}{P(A)}",
        question: "분모와 분자를 전체 경우의 수 n(S)로 각각 나누면?",
        options: [
          {
            latex: "P(B|A) = \\frac{P(A \\cap B)}{P(A)}",
            label: "P(B|A) = P(A cap B) / P(A)",
            isCorrect: true,
            feedback: "맞습니다! 경우의 수의 비가 각각의 수학적 확률의 비로 완벽히 전환되었습니다."
          },
          {
            latex: "P(B|A) = \\frac{P(B)}{P(A)}",
            label: "분자가 P(B)가 된다.",
            isCorrect: false,
            feedback: "A가 일어난 영역 안이어야 하므로 교집합 확률이어야 합니다."
          },
          {
            latex: "P(B|A) = P(A) P(B)",
            label: "두 확률의 곱이다.",
            isCorrect: false,
            feedback: "조건부확률은 비율입니다."
          }
        ],
        aiGuidance: {
          hint: "조건부확률의 본질은 표본공간이 사건 A로 축소되는 것입니다.",
          why: "양변에 P(A)를 곱하면 확률의 곱셈정리 P(A cap B) = P(A)P(B|A)가 유도됩니다.",
          commonMistake: "P(B|A)와 P(A|B)는 분모가 서로 다릅니다."
        }
      }
    ]
  },
  {
    id: "ellipse_standard_eq",
    title: "타원의 표준방정식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "기하",
    unit: "이차곡선 - 타원",
    latex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\quad (a^2 - b^2 = c^2, a > b > 0)",
    coreConcept: "두 초점으로부터의 거리의 합이 2a로 일정한 점들의 자취",
    prerequisites: "두 점 사이의 거리 공식, 루트 식의 제곱 정리",
    description: "초점이 F(c, 0), F'(-c, 0)이고 거리의 합이 2a인 타원의 표준방정식을 대수적으로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "타원의 정의에 따른 거리의 합 등식 세우기",
        goal: "PF + PF' = 2a 식을 두 점 사이의 거리 공식으로 표현합니다.",
        startExpr: "\\overline{PF} + \\overline{PF'} = 2a",
        targetExpr: "\\sqrt{(x - c)^2 + y^2} + \\sqrt{(x + c)^2 + y^2} = 2a",
        question: "두 초점 F(c, 0), F'(-c, 0)과 점 P(x, y)의 거리 합 등식은?",
        options: [
          {
            latex: "\\sqrt{(x - c)^2 + y^2} + \\sqrt{(x + c)^2 + y^2} = 2a",
            label: "두 루트 거리의 합이 장축의 길이 2a와 같다.",
            isCorrect: true,
            feedback: "맞습니다! 한 루트를 우변으로 넘긴 뒤 양변을 제곱하여 정리합니다."
          },
          {
            latex: "\\sqrt{(x - c)^2 + y^2} - \\sqrt{(x + c)^2 + y^2} = 2a",
            label: "두 거리의 차가 2a이다.",
            isCorrect: false,
            feedback: "거리의 차가 일정한 곡선은 쌍곡선입니다. 타원은 거리의 '합'입니다."
          },
          {
            latex: "(x-c)^2 + (x+c)^2 + 2y^2 = 4a^2",
            label: "루트를 바로 벗긴다.",
            isCorrect: false,
            feedback: "두 루트가 더해져 있을 때는 한 번에 제곱하면 교차항 2*sqrt(...)*sqrt(...)가 남습니다."
          }
        ],
        aiGuidance: {
          hint: "한 루트를 이항하여 sqrt(...) = 2a - sqrt(...) 상태에서 양변을 제곱하면 식이 깔끔해집니다.",
          why: "대수적 정리 과정을 거쳐 a^2 - c^2 = b^2 치환을 적용합니다.",
          commonMistake: "거리의 합은 장축의 길이 2a입니다."
        }
      },
      {
        stepNumber: 2,
        title: "두 번 제곱 후 a^2 - c^2 = b^2 치환하기",
        goal: "(a^2 - c^2)x^2 + a^2 y^2 = a^2(a^2 - c^2) 에서 a^2 - c^2 = b^2 을 대입하고 a^2 b^2 으로 나눕니다.",
        startExpr: "b^2 x^2 + a^2 y^2 = a^2 b^2",
        targetExpr: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
        question: "양변을 a^2 * b^2으로 나눈 최종 타원의 표준방정식은?",
        options: [
          {
            latex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
            label: "x^2 / a^2 + y^2 / b^2 = 1",
            isCorrect: true,
            feedback: "정확합니다! 행성의 공전 궤도를 기술하는 케플러 제1법칙의 타원 방정식입니다!"
          },
          {
            latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
            label: "가운데 부호가 마이너스이다.",
            isCorrect: false,
            feedback: "마이너스는 쌍곡선의 방정식입니다."
          },
          {
            latex: "x^2 + y^2 = a^2 + b^2",
            label: "원의 방정식 형태로 쓴다.",
            isCorrect: false,
            feedback: "타원은 x축과 y축의 비율이 다른 찌그러진 원입니다."
          }
        ],
        aiGuidance: {
          hint: "a=b이면 원의 방정식 x^2 + y^2 = a^2 이 됩니다.",
          why: "초점의 좌표는 c = sqrt(a^2 - b^2)로 구합니다.",
          commonMistake: "타원은 a^2 - b^2 = c^2, 쌍곡선은 a^2 + b^2 = c^2 입니다."
        }
      }
    ]
  },
  {
    id: "vector_dot_product",
    title: "평면벡터의 내적 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "기하",
    unit: "평면벡터 - 벡터의 내적",
    latex: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = a_1 b_1 + a_2 b_2",
    coreConcept: "삼각형의 제2코사인법칙과 두 점 사이의 거리 공식의 일치",
    prerequisites: "제2코사인법칙, 벡터의 크기",
    description: "벡터의 기하학적 내적 정의 |a||b|cos theta 가 성분으로 a1*b1 + a2*b2 와 정확히 일치하는 원리를 코사인법칙으로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "코사인법칙 |b - a|^2 에 대입하기",
        goal: "시점이 원점인 두 벡터 a, b와 종점 사이의 벡터 b-a 에 대해 코사인법칙을 씁니다.",
        startExpr: "|\\vec{b} - \\vec{a}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2 - 2|\\vec{a}||\\vec{b}|\\cos\\theta",
        targetExpr: "(b_1 - a_1)^2 + (b_2 - a_2)^2 = (a_1^2 + a_2^2) + (b_1^2 + b_2^2) - 2(\\vec{a}\\cdot\\vec{b})",
        question: "좌변을 성분으로 전개하면 (b1-a1)^2 = b1^2 - 2a1 b1 + a1^2 입니다. 양변에서 제곱항들을 소거하면?",
        options: [
          {
            latex: "-2(a_1 b_1 + a_2 b_2) = -2|\\vec{a}||\\vec{b}|\\cos\\theta",
            label: "제곱항들이 모두 소거되고 -2(a1 b1 + a2 b2) = -2|a||b|cos theta 만 남는다.",
            isCorrect: true,
            feedback: "맞습니다! 좌변과 우변에서 a1^2, a2^2, b1^2, b2^2 이 전부 상쇄됩니다."
          },
          {
            latex: "a_1 b_1 + a_2 b_2 = 0",
            label: "항상 0이 된다.",
            isCorrect: false,
            feedback: "수직일 때만 0이 됩니다."
          },
          {
            latex: "-2(a_1 + b_1 + a_2 + b_2) = -2|\\vec{a}||\\vec{b}|\\cos\\theta",
            label: "성분을 곱하지 않고 더한다.",
            isCorrect: false,
            feedback: "완전제곱식 전개 시 교차항 -2*a1*b1 이 생깁니다."
          }
        ],
        aiGuidance: {
          hint: "양변을 -2로 나누기만 하면 성분 내적 공식이 바로 탄생합니다.",
          why: "기하학적 각도 정의와 좌표 대수 성분 정의가 하나로 통합되는 순간입니다.",
          commonMistake: "두 벡터가 수직이면 theta = 90도이므로 내적은 0이 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "양변을 -2로 나누어 내적 공식 완성",
        goal: "-2를 나누어 성분 내적 공식을 확정합니다.",
        startExpr: "-2(a_1 b_1 + a_2 b_2) = -2|\\vec{a}||\\vec{b}|\\cos\\theta",
        targetExpr: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = a_1 b_1 + a_2 b_2",
        question: "양변을 -2로 나누어 완성된 내적 공식은?",
        options: [
          {
            latex: "\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 = |\\vec{a}||\\vec{b}|\\cos\\theta",
            label: "벡터 내적 = a1*b1 + a2*b2 = |a||b|cos theta",
            isCorrect: true,
            feedback: "정확합니다! 물리학의 일(Work = F dot s)과 컴퓨터 그래픽스 조명 계산의 핵심 원리입니다!"
          },
          {
            latex: "\\vec{a} \\cdot \\vec{b} = a_1 b_2 - a_2 b_1",
            label: "교차하여 곱하고 뺀다.",
            isCorrect: false,
            feedback: "이는 벡터 외적(Cross Product)의 크기와 관련된 식입니다."
          },
          {
            latex: "\\vec{a} \\cdot \\vec{b} = (a_1+b_1)(a_2+b_2)",
            label: "성분 합끼리 곱한다.",
            isCorrect: false,
            feedback: "같은 성분끼리 곱하여 더하는 것입니다."
          }
        ],
        aiGuidance: {
          hint: "코사인 값은 cos theta = (a1 b1 + a2 b2) / (|a| |b|) 로 바로 구할 수 있습니다.",
          why: "인공지능의 코사인 유사도(Cosine Similarity)도 이 공식에서 나왔습니다.",
          commonMistake: "벡터의 내적 결과는 벡터가 아니라 '스칼라(실수)'입니다."
        }
      }
    ]
  },
// =========================================================================
  // 중학교 2학년 (중2 추가 공식)
  // =========================================================================
  {
    id: "triangle_circumcenter_angle",
    title: "삼각형의 외심과 각의 크기 관계",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "도형의 성질 - 삼각형의 외심",
    latex: "\\angle BOC = 2\\angle A",
    coreConcept: "외심에서 세 꼭짓점에 이르는 거리가 같음을 이용한 이등변삼각형 분할",
    prerequisites: "이등변삼각형의 밑각의 성질, 삼각형 내각의 합",
    description: "삼각형 ABC의 외심 O에서 꼭짓점을 연결한 세 선분의 길이가 같음을 통해 중심각이 원주각의 두 배가 됨을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "외심에서 세 꼭짓점을 연결하여 이등변삼각형 만들기",
        goal: "OA = OB = OC (외접원의 반지름) 성질을 적용합니다.",
        startExpr: "OA = OB = OC = R",
        targetExpr: "\\angle OAB = \\angle OBA = x,\\; \\angle OAC = \\angle OCA = y",
        question: "외심 O에서 세 꼭짓점에 이르는 거리가 같으므로 생기는 삼각형들의 성질은 무엇일까요?",
        options: [
          {
            latex: "\\triangle OAB, \\triangle OBC, \\triangle OCA \\text{ 모두 이등변삼각형}",
            label: "세 변의 길이가 반지름으로 같으므로 세 삼각형 모두 이등변삼각형이다.",
            isCorrect: true,
            feedback: "정확합니다! 각 이등변삼각형의 밑각을 각각 x, y라 둘 수 있습니다."
          },
          {
            latex: "\\triangle OAB \\text{는 정삼각형}",
            label: "모든 변의 길이가 같아 정삼각형이다.",
            isCorrect: false,
            feedback: "세 변이 모두 같다는 보장은 없으므로 이등변삼각형입니다."
          },
          {
            latex: "\\angle A = 90^\\circ",
            label: "각 A가 반드시 직각이다.",
            isCorrect: false,
            feedback: "일반 삼각형이므로 각 A가 항상 직각인 것은 아닙니다."
          }
        ],
        aiGuidance: {
          hint: "선분 AO의 연장선을 그어 삼각형의 외각 성질(한 외각은 이웃하지 않는 두 내각의 합)을 활용해보세요.",
          why: "외각의 성질은 각도 유도 문제에서 가장 강력한 기본 도구입니다.",
          commonMistake: "내심(각의 이등분선)과 외심(변의 수직이등분선)의 성질을 혼동하지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "외각의 성질을 이용하여 각 BOC 구하기",
        goal: "선분 AO의 연장선을 그어 각 BOC가 2(x+y) = 2∠A 임을 도출합니다.",
        startExpr: "\\angle A = x + y",
        targetExpr: "\\angle BOC = 2x + 2y = 2(x + y) = 2\\angle A",
        question: "외각의 성질에 의해 연장선 양쪽의 각은 각각 2x, 2y가 됩니다. 각 BOC의 크기는?",
        options: [
          {
            latex: "\\angle BOC = 2(x + y) = 2\\angle A",
            label: "두 외각의 합이므로 2x + 2y = 2∠A 이다.",
            isCorrect: true,
            feedback: "훌륭합니다! 따라서 외심에서 만든 중심각은 마주보는 원주각 ∠A의 정확히 2배입니다!"
          },
          {
            latex: "\\angle BOC = 90^\\circ + \\frac{1}{2}\\angle A",
            label: "90도에 각 A의 절반을 더한다.",
            isCorrect: false,
            feedback: "이것은 내심(Incenter)에서의 각 BIC 공식입니다!"
          },
          {
            latex: "\\angle BOC = 180^\\circ - \\angle A",
            label: "180도에서 각 A를 뺀다.",
            isCorrect: false,
            feedback: "원 내접 사각형의 마주보는 대각 공식과 혼동하기 쉽습니다."
          }
        ],
        aiGuidance: {
          hint: "외심의 각: 2∠A, 내심의 각: 90° + ½∠A 임을 항상 비교해서 기억하세요.",
          why: "이 공식은 중3의 '원주각의 정리'와 정확하게 일치하며 기하학적 직관을 이어줍니다.",
          commonMistake: "내심 공식(90° + ½∠A)과 외심 공식(2∠A)을 헷갈리지 마세요."
        }
      }
    ]
  },
  {
    id: "triangle_centroid_ratio",
    title: "삼각형 무게중심의 2:1 분할 정리",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "도형의 닮음 - 삼각형의 무게중심",
    latex: "AG : GD = 2 : 1",
    coreConcept: "중점연결정리와 삼각형의 모래시계형 닮음비 활용",
    prerequisites: "삼각형의 중점연결정리, 닮음비",
    description: "삼각형 ABC의 두 중선 AD, BE의 교점 G(무게중심)가 각 중선을 꼭짓점으로부터 2:1로 내분함을 증명합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "중점 D와 E를 연결하여 중점연결정리 적용",
        goal: "선분 DE // AB 이고 DE = 1/2 AB 임을 밝힙니다.",
        startExpr: "D\\text{는 } BC\\text{의 중점},\\; E\\text{는 } AC\\text{의 중점}",
        targetExpr: "DE \\parallel AB,\\; DE = \\frac{1}{2}AB",
        question: "삼각형 ABC에서 변 BC와 AC의 중점 D, E를 이으면 선분 DE와 AB 사이의 관계는?",
        options: [
          {
            latex: "DE \\parallel AB,\\; DE = \\frac{1}{2}AB",
            label: "중점연결정리에 의해 평행하고 길이는 절반(1:2)이다.",
            isCorrect: true,
            feedback: "정답입니다! SAS 닮음에 의해 삼각형 CDE와 CAB는 1:2 닮음입니다."
          },
          {
            latex: "DE = AB",
            label: "길이가 서로 같다.",
            isCorrect: false,
            feedback: "중점을 이었으므로 원래 변의 절반입니다."
          },
          {
            latex: "DE \\perp AB",
            label: "서로 수직이다.",
            isCorrect: false,
            feedback: "동위각이 같아 평행(parallel)합니다."
          }
        ],
        aiGuidance: {
          hint: "DE와 AB가 평행하면 맞꼭지각과 엇각이 같아 모래시계 모양의 닮은 삼각형이 생깁니다.",
          why: "중점연결정리는 중2 기하의 가장 강력한 비례 도구입니다.",
          commonMistake: "외심, 내심, 무게중심, 수심의 정의를 명확히 구분하세요."
        }
      },
      {
        stepNumber: 2,
        title: "모래시계형 닮음 삼각형(△ABG ∽ △DEG)으로 2:1 유도",
        goal: "AA 닮음을 통해 선분의 비 AG : GD = 2 : 1 을 도출합니다.",
        startExpr: "\\triangle ABG \\sim \\triangle DEG \\; (\\text{AA 닮음})",
        targetExpr: "AG : GD = AB : DE = 2 : 1",
        question: "AB : DE = 2 : 1 이므로, 대응변인 AG와 GD의 길이의 비는 어떻게 될까요?",
        options: [
          {
            latex: "AG : GD = 2 : 1",
            label: "대응변의 길이의 비는 닮음비와 같으므로 2:1 이다.",
            isCorrect: true,
            feedback: "완벽합니다! 이로써 무게중심 G가 꼭짓점 A로부터 중선을 2:1로 나눔이 증명되었습니다!"
          },
          {
            latex: "AG : GD = 1 : 1",
            label: "중간에 위치하므로 1:1 이다.",
            isCorrect: false,
            feedback: "닮음비가 2:1이므로 1:1이 아닙니다."
          },
          {
            latex: "AG : GD = 3 : 1",
            label: "전체 3등분 중 3:1이다.",
            isCorrect: false,
            feedback: "전체는 3이고 꼭짓점 쪽이 2, 밑변 쪽이 1입니다."
          }
        ],
        aiGuidance: {
          hint: "꼭짓점 쪽 선분이 더 길고 밑변 쪽이 짧다는 점(2:1)을 항상 시각적으로 떠올리세요.",
          why: "이 2:1 비율은 고1 좌표평면에서 삼각형 무게중심 공식 ((x1+x2+x3)/3) 유도로 직결됩니다.",
          commonMistake: "밑변 쪽에서부터 1:2인지 꼭짓점 쪽에서부터 2:1인지 방향을 확인하세요."
        }
      }
    ]
  },
  {
    id: "right_triangle_similarity_altitude",
    title: "직각삼각형의 닮음과 사영 정리 (소공식)",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "도형의 닮음 - 직각삼각형의 닮음",
    latex: "h^2 = xy,\\; a^2 = cx,\\; b^2 = cy,\\; ab = ch",
    coreConcept: "직각삼각형에서 빗변에 수선을 내렸을 때 생기는 3개의 닮은 삼각형",
    prerequisites: "AA 닮음조건",
    description: "직각삼각형 ABC의 빗변에 내린 수선의 발 D에 의해 분할된 두 직각삼각형과 원래 삼각형이 모두 닮음임을 이용해 4대 공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "각의 크기를 이용한 세 직각삼각형의 AA 닮음 증명",
        goal: "△ABC ∽ △DBA ∽ △DAC (모두 직각과 공통각을 가짐)임을 확인합니다.",
        startExpr: "\\angle BAC = 90^\\circ,\\; AD \\perp BC",
        targetExpr: "\\triangle ABC \\sim \\triangle DBA \\sim \\triangle DAC",
        question: "직각삼각형의 직각 꼭짓점에서 빗변에 수선을 내렸을 때 세 직각삼각형의 관계는?",
        options: [
          {
            latex: "\\triangle ABC \\sim \\triangle DBA \\sim \\triangle DAC \\; (\\text{AA 닮음})",
            label: "한 각이 90도이고 나머지 한 예각을 공유하므로 모두 AA 닮음이다.",
            isCorrect: true,
            feedback: "정확합니다! 이 세 삼각형의 대응변 비율로 모든 공식이 나옵니다."
          },
          {
            latex: "\\triangle DBA \\equiv \\triangle DAC",
            label: "두 작은 삼각형은 서로 합동이다.",
            isCorrect: false,
            feedback: "이등변삼각형이 아닌 일반 직각삼각형에서는 합동이 아니라 닮음입니다."
          },
          {
            latex: "\\text{서로 닮음이 아니다}",
            label: "크기와 각이 제각각이다.",
            isCorrect: false,
            feedback: "각의 합이 90도인 여각 관계에 의해 세 각의 크기가 완전히 같습니다."
          }
        ],
        aiGuidance: {
          hint: "각 B를 점(●), 각 C를 가위(×)로 표시하면 ● + × = 90°가 되어 모든 직각삼각형의 각이 일치합니다.",
          why: "기하 문제에서 직각에 수선이 내려오면 100% 닮음비를 쓰는 신호입니다.",
          commonMistake: "대응변의 순서를 바르게 맞추지 않으면 비율 식이 꼬이게 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "닮음비를 통한 높이의 제곱 공식(h² = xy) 도출",
        goal: "△DBA ∽ △DAC 에서 x : h = h : y 관계를 세웁니다.",
        startExpr: "\\frac{BD}{AD} = \\frac{AD}{CD} \\iff \\frac{x}{h} = \\frac{h}{y}",
        targetExpr: "h^2 = xy",
        question: "두 작은 직각삼각형의 밑변과 높이의 비 x/h = h/y 에서 외항과 내항을 곱하면?",
        options: [
          {
            latex: "h^2 = xy",
            label: "h^2 = xy (높이의 제곱은 두 밑변의 곱)",
            isCorrect: true,
            feedback: "정답입니다! 이를 기하학적 평균(산술-기하 평균의 기하학적 모델)이라고 부릅니다."
          },
          {
            latex: "h = x + y",
            label: "높이는 밑변 두 개를 더한 것과 같다.",
            isCorrect: false,
            feedback: "비례식의 외항과 내항을 곱해야 합니다."
          },
          {
            latex: "h^2 = x^2 + y^2",
            label: "피타고라스 정리와 같다.",
            isCorrect: false,
            feedback: "x와 y는 빗변이 아니므로 피타고라스 형태가 아닙니다."
          }
        ],
        aiGuidance: {
          hint: "넓이 관점에서는 밑변*높이 = c*h = a*b ('소'자 모양)도 성립합니다.",
          why: "이 공식은 원에서 '방멱 정리' 및 피타고라스 정리 유도와도 밀접하게 연결됩니다.",
          commonMistake: "x, y는 빗변의 두 분할 선분이고 h는 수선임을 기억하세요."
        }
      }
    ]
  },
  {
    id: "recurring_decimal_fraction",
    title: "순환소수의 분수 변환 공식",
    curriculum: ["15개정", "22개정"],
    grade: "중2",
    subject: "중2 수학",
    unit: "유리수와 순환소수",
    latex: "0.\\dot{a}\\dot{b} = \\frac{ab}{99},\\; 0.a\\dot{b} = \\frac{ab - a}{90}",
    coreConcept: "10의 거듭제곱을 곱해 순환마디를 일치시킨 뒤 변변 빼기",
    prerequisites: "일차방정식의 풀이, 자릿값의 이해",
    description: "순환소수 x에 10의 거듭제곱(10, 100, 1000...)을 곱하여 소수점 아래 순환마디를 똑같이 맞춘 후 빼서 유리수(분수)로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "순환소수를 미지수 x로 두고 거듭제곱 곱하기",
        goal: "x = 0.abab... 에 100을 곱해 소수점 아래를 정렬합니다.",
        startExpr: "x = 0.ababab\\dots",
        targetExpr: "100x = ab.ababab\\dots",
        question: "순환마디가 2자리(ab)인 순환소수 x에 100을 곱하면 어떤 형태가 될까요?",
        options: [
          {
            latex: "100x = ab.ababab\\dots",
            label: "소수점이 오른쪽으로 2칸 이동하여 ab.abab...가 된다.",
            isCorrect: true,
            feedback: "맞습니다! 이렇게 하면 x와 100x의 소수점 아래 부분이 완벽히 일치합니다."
          },
          {
            latex: "10x = ab.ababab\\dots",
            label: "10만 곱해도 2칸 이동한다.",
            isCorrect: false,
            feedback: "10을 곱하면 1칸만 이동하므로 순환마디가 ba.ba...로 어긋납니다."
          },
          {
            latex: "100x = 100ab",
            label: "소수점 아래가 그냥 사라진다.",
            isCorrect: false,
            feedback: "무한히 반복되는 순환마디는 그대로 유지됩니다."
          }
        ],
        aiGuidance: {
          hint: "순환마디의 개수만큼 0이 붙은 10의 거듭제곱(1마디면 10, 2마디면 100)을 곱합니다.",
          why: "무한히 계속되는 소수점 아래를 통째로 상쇄(제거)시키는 강력한 대수적 기법입니다.",
          commonMistake: "순환마디가 아닌 부분이 앞에 있을 때는 두 번 곱해서 순환마디만 소수점 아래로 맞춰야 합니다."
        }
      },
      {
        stepNumber: 2,
        title: "두 식을 변변 빼서 소수 부분 제거 및 분수 표현",
        goal: "100x - x = 99x = ab 에서 x = ab/99 를 얻습니다.",
        startExpr: "100x - x = ab.abab\\dots - 0.abab\\dots",
        targetExpr: "99x = ab \\implies x = \\frac{ab}{99}",
        question: "100x에서 x를 빼면 무한 순환 부분이 상쇄됩니다. x를 분수로 나타내면?",
        options: [
          {
            latex: "x = \\frac{ab}{99}",
            label: "99x = ab 이므로 x = ab / 99 이다.",
            isCorrect: true,
            feedback: "정답입니다! 순환마디 개수만큼 분모에 9를 적는 암기 공식의 근거가 바로 이것입니다!"
          },
          {
            latex: "x = \\frac{ab}{100}",
            label: "유한소수처럼 ab / 100 이다.",
            isCorrect: false,
            feedback: "분모가 100이면 유한소수 0.ab가 됩니다."
          },
          {
            latex: "x = \\frac{ab}{90}",
            label: "분모는 항상 90이다.",
            isCorrect: false,
            feedback: "순환하지 않는 소수 첫째자리가 있을 때 분모에 0이 붙어 90이 됩니다."
          }
        ],
        aiGuidance: {
          hint: "순환마디는 9, 순환하지 않는 자리는 0으로 분모를 구성하게 됩니다.",
          why: "이 원리는 훗날 고2/고3에서 무한등비급수 S = a/(1-r) 로 더욱 우아하게 재해석됩니다.",
          commonMistake: "기약분수로 나타내어야 하는 문제에서 약분을 빠뜨리지 않도록 주의하세요."
        }
      }
    ]
  },

  // =========================================================================
  // 중학교 3학년 (중3 추가 공식)
  // =========================================================================
  {
    id: "inscribed_angle_theorem",
    title: "원주각과 중심각의 크기 관계 (원주각의 정리)",
    curriculum: ["15개정", "22개정"],
    grade: "중3",
    subject: "중3 수학",
    unit: "원과 직선 - 원주각",
    latex: "\\angle APB = \\frac{1}{2}\\angle AOB",
    coreConcept: "원의 반지름으로 생기는 이등변삼각형의 외각 성질",
    prerequisites: "원의 성질, 이등변삼각형의 외각",
    description: "한 호에 대한 원주각의 크기는 그 호에 대한 중심각의 크기의 절반임을 증명합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "원주각의 꼭짓점 P에서 원의 중심 O를 지나는 지름선 긋기",
        goal: "선분 PO의 연장선 Q를 그어 두 개의 이등변삼각형 △OPA, △OPB로 분할합니다.",
        startExpr: "OA = OB = OP = r \\; (\\text{반지름})",
        targetExpr: "\\angle OPA = \\angle OAP = \\alpha,\\; \\angle OPB = \\angle OBP = \\beta",
        question: "선분 OP, OA, OB의 길이가 원의 반지름으로 모두 같으므로 삼각형 OPA, OPB는 어떤 삼각형인가요?",
        options: [
          {
            latex: "\\triangle OPA, \\triangle OPB \\text{는 이등변삼각형}",
            label: "두 변이 반지름으로 같으므로 이등변삼각형이다.",
            isCorrect: true,
            feedback: "맞습니다! 두 밑각이 같으므로 각각 alpha와 beta로 설정할 수 있습니다."
          },
          {
            latex: "\\text{정삼각형}",
            label: "세 변이 모두 반지름으로 같다.",
            isCorrect: false,
            feedback: "현 AB의 길이는 반지름과 다를 수 있습니다."
          },
          {
            latex: "\\text{직각삼각형}",
            label: "항상 직각을 포함한다.",
            isCorrect: false,
            feedback: "지름에 대한 원주각일 때만 직각삼각형이 됩니다."
          }
        ],
        aiGuidance: {
          hint: "이등변삼각형의 한 외각은 이웃하지 않는 두 내각의 합과 같다는 원리를 쓰세요.",
          why: "원 위의 모든 점 P에서 중심각 AOB의 절반으로 각도가 일정하다는 엄청난 성질을 증명합니다.",
          commonMistake: "중심 O가 각 APB의 내부, 위, 외부에 있을 때 모두 성립합니다."
        }
      },
      {
        stepNumber: 2,
        title: "외각의 합으로 중심각과 원주각의 2배 관계 확정",
        goal: "∠AOQ = 2α, ∠BOQ = 2β 에서 ∠AOB = 2(α+β) = 2∠APB 를 유도합니다.",
        startExpr: "\\angle AOQ = 2\\alpha,\\; \\angle BOQ = 2\\beta",
        targetExpr: "\\angle AOB = 2(\\alpha + \\beta) = 2\\angle APB \\iff \\angle APB = \\frac{1}{2}\\angle AOB",
        question: "중심각 ∠AOB는 2α + 2β 이고 원주각 ∠APB는 α + β 입니다. 두 각의 관계는?",
        options: [
          {
            latex: "\\angle APB = \\frac{1}{2}\\angle AOB",
            label: "원주각은 중심각의 정확히 1/2 배이다.",
            isCorrect: true,
            feedback: "정답입니다! 따라서 호의 길이가 같으면 원주각의 크기도 모두 같습니다!"
          },
          {
            latex: "\\angle APB = \\angle AOB",
            label: "원주각과 중심각은 같다.",
            isCorrect: false,
            feedback: "원주 위의 점 P는 중심 O보다 멀리 있으므로 각이 절반으로 좁아집니다."
          },
          {
            latex: "\\angle APB = 2\\angle AOB",
            label: "원주각이 중심각의 2배이다.",
            isCorrect: false,
            feedback: "중심각이 원주각의 2배입니다."
          }
        ],
        aiGuidance: {
          hint: "반원에 대한 원주각(지름에 대한 원주각)은 180도의 절반인 90도가 됩니다.",
          why: "이 정리는 원에 내접하는 사각형의 성질, 사인법칙 유도의 기본 토대가 됩니다.",
          commonMistake: "같은 호를 공유하는지 반드시 확인해야 합니다."
        }
      }
    ]
  },
  {
    id: "tangent_chord_theorem",
    title: "원의 접선과 현이 이루는 각 (접현각 정리)",
    curriculum: ["15개정", "22개정"],
    grade: "중3",
    subject: "중3 수학",
    unit: "원과 직선 - 접선과 현",
    latex: "\\angle BAT = \\angle BCA",
    coreConcept: "접선과 반지름의 수직 조건 및 지름에 대한 원주각(90°) 활용",
    prerequisites: "원주각의 정리, 원의 접선의 성질",
    description: "원의 접선과 접점을 지나는 현이 이루는 각(접현각)의 크기가 그 현에 대한 호의 원주각의 크기와 같음을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "접점을 지나는 지름 AD를 긋고 직각 만들기",
        goal: "OA ⊥ AT (접선 성질) 및 ∠ACD = 90° (지름의 원주각)를 이용합니다.",
        startExpr: "AD\\text{는 원의 지름},\\; \\angle DAT = 90^\\circ",
        targetExpr: "\\angle BAT = 90^\\circ - \\angle DAB",
        question: "원의 중심 O에서 접선 AT에 그은 반지름 OA는 수직(90°)입니다. 각 BAT는 어떻게 표현될까요?",
        options: [
          {
            latex: "\\angle BAT = 90^\\circ - \\angle DAB",
            label: "직각(90도)에서 각 DAB를 뺀 각이다.",
            isCorrect: true,
            feedback: "맞습니다! 지름 AD를 기준으로 각을 분할합니다."
          },
          {
            latex: "\\angle BAT = 90^\\circ + \\angle DAB",
            label: "90도에 더한 각이다.",
            isCorrect: false,
            feedback: "전체 접각이 90도이므로 빼야 합니다."
          },
          {
            latex: "\\angle BAT = 180^\\circ - \\angle DAB",
            label: "180도에서 뺀다.",
            isCorrect: false,
            feedback: "평각이 아니라 수직(90도)입니다."
          }
        ],
        aiGuidance: {
          hint: "지름 AD에 대한 원주각 ∠ABD는 90°이므로 삼각형 ABD에서 직각삼각형의 두 예각의 합은 90도입니다.",
          why: "접선과 원주각을 연결하는 가장 핵심적인 다리 역할을 하는 정리입니다.",
          commonMistake: "접선의 방향과 현의 위치 관계를 잘 살펴보세요."
        }
      },
      {
        stepNumber: 2,
        title: "원주각의 일치성을 통해 접현각 공식 완성",
        goal: "∠DAB = 90° - ∠ADB 이고 ∠ADB = ∠ACB (호 AB의 원주각) 임을 연결합니다.",
        startExpr: "\\angle BAT = \\angle ADB,\\; \\angle ADB = \\angle BCA",
        targetExpr: "\\angle BAT = \\angle BCA",
        question: "호 AB에 대한 원주각 ∠ADB = ∠BCA 이므로, 접현각 ∠BAT의 크기는?",
        options: [
          {
            latex: "\\angle BAT = \\angle BCA",
            label: "현 AB에 대한 호의 원주각 ∠BCA와 크기가 같다.",
            isCorrect: true,
            feedback: "정답입니다! 접선과 현이 이루는 각은 그 내부 호의 원주각과 정확히 같습니다!"
          },
          {
            latex: "\\angle BAT = 2\\angle BCA",
            label: "원주각의 2배이다.",
            isCorrect: false,
            feedback: "2배가 아니라 1배로 완전히 같습니다."
          },
          {
            latex: "\\angle BAT = 180^\\circ - \\angle BCA",
            label: "180도에서 원주각을 뺀 값이다.",
            isCorrect: false,
            feedback: "둔각 삼각형일 때도 동일하게 성립합니다."
          }
        ],
        aiGuidance: {
          hint: "현이 원을 자르는 호의 반대편에 있는 원주각을 가리킵니다.",
          why: "기하학 올림피아드와 수능 킬러 기하 문제에서 닮음 삼각형을 찾는 비밀 열쇠입니다.",
          commonMistake: "어느 호의 원주각과 같은지 현의 위치를 혼동하지 마세요."
        }
      }
    ]
  },

  // =========================================================================
  // 고등학교 1학년 (고1 공통수학1 & 공통수학2 추가 공식)
  // =========================================================================
  {
    id: "cubic_expansion_formula",
    title: "다항식의 곱셈 공식 (세제곱 전개식)",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1",
    unit: "다항식 - 곱셈 공식",
    latex: "(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3",
    coreConcept: "(a+b)를 거듭 분배법칙으로 전개하고 동류항 묶기",
    prerequisites: "이차 완전제곱식 전개, 분배법칙",
    description: "(a+b)^3을 (a+b)(a+b)^2로 나누어 전개하여 각 항의 계수 1, 3, 3, 1이 나오는 과정을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "(a+b)와 이차 전개식의 곱으로 분해",
        goal: "(a+b)(a^2 + 2ab + b^2) 로 분배 준비를 합니다.",
        startExpr: "(a + b)^3",
        targetExpr: "(a + b)(a^2 + 2ab + b^2)",
        question: "(a+b)^3을 거듭제곱의 정의에 따라 분해하면?",
        options: [
          {
            latex: "(a + b)(a^2 + 2ab + b^2)",
            label: "(a+b)에 이미 알고 있는 완전제곱식 (a^2+2ab+b^2)을 곱한다.",
            isCorrect: true,
            feedback: "맞습니다! 이제 앞의 (a+b)의 a와 b를 각각 뒤 괄호에 분배합니다."
          },
          {
            latex: "a^3 + b^3",
            label: "각각 세제곱하여 더한다.",
            isCorrect: false,
            feedback: "가장 흔한 오개념입니다! 전개 시 중간항(교차항)이 생깁니다."
          },
          {
            latex: "(a + b)(a^2 + b^2)",
            label: "완전제곱식에서 2ab를 뺀 것과 곱한다.",
            isCorrect: false,
            feedback: "(a+b)^2 = a^2+2ab+b^2 입니다."
          }
        ],
        aiGuidance: {
          hint: "a를 세 항에 분배하고, b를 세 항에 분배하여 총 6개 항을 만듭니다.",
          why: "파스칼의 삼각형(이항계수 1, 3, 3, 1)의 대수적 기초입니다.",
          commonMistake: "(a+b)^3 ≠ a^3 + b^3 임을 명심하세요."
        }
      },
      {
        stepNumber: 2,
        title: "분배 후 동류항 정리하여 공식 완성",
        goal: "a^3 + 2a^2b + ab^2 + a^2b + 2ab^2 + b^3 에서 동류항을 묶습니다.",
        startExpr: "a(a^2 + 2ab + b^2) + b(a^2 + 2ab + b^2)",
        targetExpr: "a^3 + 3a^2b + 3ab^2 + b^3",
        question: "전개된 식에서 동류항(a^2*b 항과 a*b^2 항)을 더하면?",
        options: [
          {
            latex: "a^3 + 3a^2b + 3ab^2 + b^3",
            label: "2a^2b + a^2b = 3a^2b 이고 ab^2 + 2ab^2 = 3ab^2 이므로 1, 3, 3, 1 형태가 된다.",
            isCorrect: true,
            feedback: "정확합니다! 이 식을 변형하면 a^3 + b^3 = (a+b)^3 - 3ab(a+b) 라는 중요한 곱셈공식 변형이 나옵니다."
          },
          {
            latex: "a^3 + 2a^2b + 2ab^2 + b^3",
            label: "계수가 2로 유지된다.",
            isCorrect: false,
            feedback: "2a^2b와 a^2b를 더하면 3a^2b가 됩니다."
          },
          {
            latex: "a^3 + 6ab + b^3",
            label: "가운데 항들을 6ab로 합친다.",
            isCorrect: false,
            feedback: "차수가 서로 다르므로 (a제곱b와 ab제곱) 하나로 합칠 수 없습니다."
          }
        ],
        aiGuidance: {
          hint: "부호가 (a-b)^3 일 때는 b 자리에 (-b)를 대입하면 a^3 - 3a^2b + 3ab^2 - b^3 이 됩니다.",
          why: "고1 수학의 모든 다항식 계산과 방정식의 뼈대가 되는 공식입니다.",
          commonMistake: "곱셈공식 변형 (a+b)^3 - 3ab(a+b) 와 헷갈리지 마세요."
        }
      }
    ]
  },
  {
    id: "cubic_sum_factorization",
    title: "세제곱의 합과 차 인수분해 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1",
    unit: "다항식 - 인수분해",
    latex: "a^3 + b^3 = (a + b)(a^2 - ab + b^2)",
    coreConcept: "곱셈 공식의 변형식에서 공통인수 (a+b) 묶어내기",
    prerequisites: "곱셈공식 변형, 공통인수 묶기",
    description: "a^3 + b^3 = (a+b)^3 - 3ab(a+b) 에서 공통인수 (a+b)를 묶어 괄호 안을 전개하여 인수분해 공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "곱셈공식 변형식에서 공통인수 (a+b) 찾기",
        goal: "(a+b)^3 - 3ab(a+b) 에서 공통인수 (a+b)를 묶어냅니다.",
        startExpr: "a^3 + b^3 = (a + b)^3 - 3ab(a + b)",
        targetExpr: "(a + b)[(a + b)^2 - 3ab]",
        question: "두 항 모두에 들어있는 공통인수 (a+b)를 앞으로 묶어내면 괄호 안의 식은?",
        options: [
          {
            latex: "(a + b)[(a + b)^2 - 3ab]",
            label: "(a+b)를 묶어내면 [(a+b)^2 - 3ab]가 남는다.",
            isCorrect: true,
            feedback: "정확합니다! 이제 중괄호 안의 완전제곱식을 전개해 정리하면 됩니다."
          },
          {
            latex: "(a + b)[(a + b) - 3ab]",
            label: "제곱이 아니라 1차만 남는다.",
            isCorrect: false,
            feedback: "세제곱에서 하나를 묶어냈으므로 제곱((a+b)^2)이 남습니다."
          },
          {
            latex: "(a + b)(a^2 + b^2)",
            label: "-3ab가 그냥 사라진다.",
            isCorrect: false,
            feedback: "-3ab(a+b)에서 (a+b)가 빠져나가면 -3ab가 남아야 합니다."
          }
        ],
        aiGuidance: {
          hint: "[(a+b)^2 - 3ab] = [a^2 + 2ab + b^2 - 3ab] 로 풀어보세요.",
          why: "인수분해는 전개의 역과정이자 공통인수 추출의 예술입니다.",
          commonMistake: "가운데 항의 부호가 마이너스(-ab)임에 유의하세요."
        }
      },
      {
        stepNumber: 2,
        title: "중괄호 내부 전개하여 최종 공식 완성",
        goal: "a^2 + 2ab + b^2 - 3ab = a^2 - ab + b^2 로 정리합니다.",
        startExpr: "(a + b)(a^2 + 2ab + b^2 - 3ab)",
        targetExpr: "(a + b)(a^2 - ab + b^2)",
        question: "동류항 2ab - 3ab 를 계산하여 정리한 최종 인수분해 결과는?",
        options: [
          {
            latex: "(a + b)(a^2 - ab + b^2)",
            label: "(a+b)(a^2 - ab + b^2)",
            isCorrect: true,
            feedback: "완벽합니다! 같은 원리로 a^3 - b^3 = (a-b)(a^2 + ab + b^2) 도 바로 유도됩니다!"
          },
          {
            latex: "(a + b)(a^2 + ab + b^2)",
            label: "가운데 항이 +ab이다.",
            isCorrect: false,
            feedback: "+2ab - 3ab = -ab 이므로 부호는 마이너스입니다."
          },
          {
            latex: "(a + b)(a^2 - 2ab + b^2)",
            label: "가운데 항이 -2ab이다.",
            isCorrect: false,
            feedback: "계수는 -1입니다."
          }
        ],
        aiGuidance: {
          hint: "(a+b)일 때는 뒤가 -ab, (a-b)일 때는 뒤가 +ab로 부호가 반대입니다.",
          why: "방정식 x^3 - 1 = 0의 허근(오메가, ω) 성질의 출발점이 되는 공식입니다.",
          commonMistake: "가운데 항을 -2ab로 잘못 쓰는 실수가 매우 흔합니다."
        }
      }
    ]
  },
  {
    id: "remainder_theorem",
    title: "나머지 정리와 인수정리",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1",
    unit: "다항식 - 나머지 정리",
    latex: "P(x) = (x - \\alpha)Q(x) + R \\implies R = P(\\alpha)",
    coreConcept: "나눗셈의 항등식에서 몫을 0으로 만드는 특수값(x=α) 대입",
    prerequisites: "다항식의 나눗셈, 항등식의 수치대입법",
    description: "다항식 P(x)를 일차식 (x-α)로 나누었을 때 나머지가 상수 R이 됨을 항등식의 수치대입법으로 증명합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "다항식 나눗셈의 항등식 관계 작성",
        goal: "(나누어지는 식) = (나누는 식) × (몫) + (나머지) 관계를 세웁니다.",
        startExpr: "P(x) \\div (x - \\alpha)",
        targetExpr: "P(x) = (x - \\alpha)Q(x) + R \\; (R\\text{은 상수})",
        question: "일차식 (x-α)로 나눌 때 나머지 R의 차수는 어떻게 되어야 할까요?",
        options: [
          {
            latex: "\\text{나머지 } R\\text{은 상수 (0차 이하)}",
            label: "나누는 일차식보다 차수가 낮아야 하므로 상수가 된다.",
            isCorrect: true,
            feedback: "맞습니다! 나눗셈에서 나머지의 차수는 나누는 식의 차수보다 항상 엄격히 낮아야 합니다."
          },
          {
            latex: "\\text{나머지 } R\\text{은 일차식}",
            label: "나누는 식과 차수가 같아 일차식이다.",
            isCorrect: false,
            feedback: "차수가 같으면 한 번 더 나눌 수 있으므로 나머지가 아닙니다."
          },
          {
            latex: "\\text{나머지는 항상 0이다}",
            label: "나누어떨어져야 한다.",
            isCorrect: false,
            feedback: "일반적으로 나누어떨어지지 않을 수도 있습니다."
          }
        ],
        aiGuidance: {
          hint: "몫 Q(x)가 무엇이든 관계없이 항 전체를 0으로 날려버릴 수 있는 x값을 찾아보세요.",
          why: "직접 긴 나눗셈을 하지 않고도 나머지를 1초 만에 구하는 기적의 공식입니다.",
          commonMistake: "나누는 식이 2차식이면 나머지는 ax+b 형태의 1차 이하 다항식이 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "항등식에 x = α 대입하여 나머지 R 확정",
        goal: "Q(x) 항을 소거하여 R = P(α) 를 얻습니다.",
        startExpr: "P(\\alpha) = (\\alpha - \\alpha)Q(\\alpha) + R",
        targetExpr: "P(\\alpha) = 0 \\cdot Q(\\alpha) + R \\implies R = P(\\alpha)",
        question: "항등식의 양변에 x = α 를 대입하면 (α - α)Q(α)는 얼마가 될까요?",
        options: [
          {
            latex: "0 \\implies R = P(\\alpha)",
            label: "0을 곱하므로 몫 항이 소거되어 R = P(α)가 된다.",
            isCorrect: true,
            feedback: "완벽합니다! 특히 R = P(α) = 0 이면 (x-α)를 인수로 갖는 '인수정리'가 됩니다!"
          },
          {
            latex: "Q(\\alpha) \\implies R = P(\\alpha) - Q(\\alpha)",
            label: "Q(alpha)가 남는다.",
            isCorrect: false,
            feedback: "0에 어떤 수를 곱해도 0이므로 소거됩니다."
          },
          {
            latex: "1",
            label: "항의 값이 1이 된다.",
            isCorrect: false,
            feedback: "alpha - alpha = 0 입니다."
          }
        ],
        aiGuidance: {
          hint: "P(α) = 0 이면 P(x) = (x-α)Q(x) 로 인수분해된다는 것이 인수정리입니다.",
          why: "고차방정식(3차, 4차)의 조립제법 풀이의 이론적 근거가 바로 이 인수정리입니다.",
          commonMistake: "ax-b 로 나눌 때는 x = b/a 를 대입해야 함을 잊지 마세요."
        }
      }
    ]
  },
  {
    id: "quadratic_discriminant",
    title: "이차방정식의 판별식과 실근의 개수",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학1",
    unit: "방정식과 부등식 - 이차방정식",
    latex: "D = b^2 - 4ac",
    coreConcept: "근의 공식에서 근호(루트) 안의 값의 부호에 따른 실근의 성질",
    prerequisites: "이차방정식 근의 공식, 실수의 제곱근 성질",
    description: "근의 공식 x = (-b ± √(b^2-4ac)) / (2a) 에서 루트 안의 식 D = b^2-4ac의 부호(양수, 0, 음수)에 따라 실근의 개수와 허근이 결정됨을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "근의 공식에서 근호 내부의 역할 확인",
        goal: "x = (-b ± √D) / (2a) 에서 D = b^2 - 4ac 로 정의합니다.",
        startExpr: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        targetExpr: "D = b^2 - 4ac",
        question: "실수 범위에서 루트 안의 값(D)이 음수가 되면 어떤 일이 일어날까요?",
        options: [
          {
            latex: "\\sqrt{D} \\text{는 허수 } \\implies \\text{서로 다른 두 허근을 갖는다}",
            label: "음수의 제곱근은 허수(i)이므로 실근이 존재하지 않고 서로 다른 두 허근을 갖는다.",
            isCorrect: true,
            feedback: "정확합니다! 실수의 제곱은 항상 0 이상이므로 루트 안이 음수면 허수가 됩니다."
          },
          {
            latex: "\\text{해가 무수히 많다}",
            label: "모든 실수가 해가 된다.",
            isCorrect: false,
            feedback: "근이 없는 것이 아니라 복소수 범위에서 허근이 됩니다."
          },
          {
            latex: "\\text{중근을 갖는다}",
            label: "하나의 실근만 갖는다.",
            isCorrect: false,
            feedback: "중근은 루트 안이 0일 때 발생합니다."
          }
        ],
        aiGuidance: {
          hint: "D > 0: 서로 다른 두 실근, D = 0: 중근(서로 같은 두 실근), D < 0: 서로 다른 두 허근.",
          why: "방정식을 직접 풀지 않고도 해의 개수와 성질을 '판별(Discriminate)'할 수 있습니다.",
          commonMistake: "계수 a, b, c가 반드시 '실수'일 때만 판별식의 부호 판정이 성립합니다."
        }
      },
      {
        stepNumber: 2,
        title: "D = 0 일 때 중근 발생 원리 증명",
        goal: "√0 = 0 이므로 ± 가 무의미해져 단 하나의 근만 남음을 도출합니다.",
        startExpr: "x = \\frac{-b \\pm \\sqrt{0}}{2a}",
        targetExpr: "x = -\\frac{b}{2a} \\; (\\text{중근})",
        question: "D = 0 일 때 ±√D 항이 0이 되면 근 x는 몇 개가 될까요?",
        options: [
          {
            latex: "x = -\\frac{b}{2a} \\; (\\text{서로 같은 두 실근, 즉 1개의 중근})",
            label: "±0이므로 오직 x = -b/(2a) 하나만 나와 완전제곱식이 된다.",
            isCorrect: true,
            feedback: "완벽합니다! 기하학적으로는 이차함수의 그래프가 x축에 접(tangent)하는 순간입니다!"
          },
          {
            latex: "x = 0",
            label: "근이 0이 된다.",
            isCorrect: false,
            feedback: "근의 값이 0인 것이 아니라 근이 중복된다는 뜻입니다."
          },
          {
            latex: "\\text{근이 존재하지 않는다}",
            label: "해가 없다.",
            isCorrect: false,
            feedback: "중근이라는 실근 1개를 명확히 갖습니다."
          }
        ],
        aiGuidance: {
          hint: "짝수 공식 D/4 = b'^2 - ac (여기서 b = 2b')도 자주 사용되니 기억하세요.",
          why: "이차함수와 직선의 위치관계(두 점 교차, 접함, 만나지 않음)를 결정하는 핵심 도구입니다.",
          commonMistake: "'실근을 가질 조건'은 D > 0 뿐 아니라 중근(D = 0)을 포함한 D ≥ 0 임을 주의하세요."
        }
      }
    ]
  },
  {
    id: "cauchy_schwarz_inequality",
    title: "코시-슈바르츠 부등식",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학2",
    unit: "집합과 명제 - 절대부등식",
    latex: "(a^2 + b^2)(x^2 + y^2) \\ge (ax + by)^2",
    coreConcept: "좌변에서 우변을 뺀 후 완전제곱식으로 변형하여 0 이상임을 증명",
    prerequisites: "절대부등식, 실수의 성질 (실수의 제곱 ≥ 0)",
    description: "모든 실수 a, b, x, y에 대해 성립하는 대표적 절대부등식인 코시-슈바르츠 부등식을 전개 후 제곱식 차로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "좌변과 우변을 전개하여 차(Difference) 구하기",
        goal: "(a^2+b^2)(x^2+y^2) - (ax+by)^2 을 전개합니다.",
        startExpr: "(a^2+b^2)(x^2+y^2) - (ax+by)^2",
        targetExpr: "(a^2x^2 + a^2y^2 + b^2x^2 + b^2y^2) - (a^2x^2 + 2axby + b^2y^2)",
        question: "양쪽을 전개하여 빼면 a^2*x^2 과 b^2*y^2 이 소거되고 남는 항은?",
        options: [
          {
            latex: "a^2y^2 - 2abxy + b^2x^2",
            label: "a^2y^2 - 2abxy + b^2x^2 항이 남는다.",
            isCorrect: true,
            feedback: "맞습니다! 이 남은 3개의 항은 놀랍게도 완전제곱식 형태를 갖추고 있습니다."
          },
          {
            latex: "2abxy",
            label: "가운데 항만 남는다.",
            isCorrect: false,
            feedback: "전개 시 a^2*y^2 과 b^2*x^2 도 함께 남아있습니다."
          },
          {
            latex: "0",
            label: "완전히 똑같아서 0이 된다.",
            isCorrect: false,
            feedback: "교차항의 차이가 발생합니다."
          }
        ],
        aiGuidance: {
          hint: "(ay)^2 - 2(ay)(bx) + (bx)^2 형태로 묶어보세요.",
          why: "실수의 대소 비교에서 A ≥ B 를 증명하는 기본 원칙은 A - B ≥ 0 임을 보이는 것입니다.",
          commonMistake: "산술기하평균은 양수 조건이 필요하지만 코시-슈바르츠는 '모든 실수'에서 성립합니다."
        }
      },
      {
        stepNumber: 2,
        title: "완전제곱식으로 묶어 0 이상임을 증명하고 등호 성립 조건 도출",
        goal: "(ay - bx)^2 ≥ 0 임을 보이고 등호 조건 ay = bx (a/x = b/y) 를 얻습니다.",
        startExpr: "a^2y^2 - 2abxy + b^2x^2",
        targetExpr: "(ay - bx)^2 \\ge 0 \\implies (a^2+b^2)(x^2+y^2) \\ge (ax+by)^2",
        question: "실수의 제곱은 항상 0 이상이므로 부등식이 증명됩니다. 등호(=)가 성립할 조건은?",
        options: [
          {
            latex: "ay - bx = 0 \\iff \\frac{a}{x} = \\frac{b}{y}",
            label: "제곱 내부가 0이어야 하므로 ay = bx, 즉 a/x = b/y 일 때 성립한다.",
            isCorrect: true,
            feedback: "정답입니다! 두 순서쌍 (a,b)와 (x,y)의 비율이 일치할 때(벡터 관점에서는 평행할 때) 등호가 성립합니다!"
          },
          {
            latex: "a = 0 \\text{ 또는 } b = 0",
            label: "둘 중 하나가 0이어야 한다.",
            isCorrect: false,
            feedback: "비율이 같으면 0이 아니어도 등호가 성립합니다."
          },
          {
            latex: "a = x \\text{ 이고 } b = y",
            label: "모든 변수가 서로 같아야만 한다.",
            isCorrect: false,
            feedback: "배수 관계(비례)만 만족해도 충분합니다."
          }
        ],
        aiGuidance: {
          hint: "벡터 내적 공식 |a||b|cosθ ≥ a·b 에서 cosθ ≤ 1 로도 증명됩니다.",
          why: "고차원 공간(n차원)으로 확장되어 선형대수학의 기저를 이룹니다.",
          commonMistake: "등호 성립 조건을 쓰지 않으면 서술형 시험에서 큰 감점을 받습니다."
        }
      }
    ]
  },
  {
    id: "circle_tangent_line",
    title: "원 위의 점에서의 접선의 방정식",
    curriculum: ["15개정", "22개정"],
    grade: "고1",
    subject: "공통수학2",
    unit: "도형의 방정식 - 원의 방정식",
    latex: "x_1x + y_1y = r^2",
    coreConcept: "원의 중심과 접점을 잇는 반지름과 접선은 서로 수직(기울기 곱 = -1)",
    prerequisites: "원의 방정식, 두 직선의 수직 조건 (m1 * m2 = -1)",
    description: "원 x^2 + y^2 = r^2 위의 점 P(x1, y1)에서 그은 접선이 반지름 OP와 수직임을 이용해 접선의 방정식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "반지름 OP의 기울기와 수직인 접선의 기울기 구하기",
        goal: "반지름 기울기가 y1/x1 이므로 접선 기울기는 -x1/y1 임을 구합니다.",
        startExpr: "m_{\\text{radius}} = \\frac{y_1}{x_1}",
        targetExpr: "m_{\\text{tangent}} = -\\frac{x_1}{y_1} \\; (m_1 m_2 = -1)",
        question: "원점 O(0,0)과 점 P(x1, y1)을 잇는 선분과 수직인 접선의 기울기는?",
        options: [
          {
            latex: "m = -\\frac{x_1}{y_1}",
            label: "수직인 두 직선의 기울기 곱이 -1이므로 역수의 음수부호이다.",
            isCorrect: true,
            feedback: "맞습니다! 이제 한 점 (x1, y1)을 지나고 기울기가 -x1/y1 인 직선의 방정식을 세웁니다."
          },
          {
            latex: "m = \\frac{x_1}{y_1}",
            label: "기울기가 서로 같다.",
            isCorrect: false,
            feedback: "기울기가 같으면 평행이 되어버립니다. 수직이어야 합니다."
          },
          {
            latex: "m = -\\frac{y_1}{x_1}",
            label: "기울기의 부호만 반대이다.",
            isCorrect: false,
            feedback: "역수도 취해야 곱이 -1이 됩니다."
          }
        ],
        aiGuidance: {
          hint: "직선의 점-기울기 공식: y - y1 = m(x - x1) 에 대입해보세요.",
          why: "미분을 배우지 않고도 순수 기하학적 성질로 접선을 구하는 우아한 방법입니다.",
          commonMistake: "x1=0 또는 y1=0 일 때(축 위의 점)도 x = ±r, y = ±r 로 공식이 완벽히 적용됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "직선의 방정식 정리 및 원의 방정식 대입으로 완성",
        goal: "y - y1 = (-x1/y1)(x - x1) 을 양변에 y1 곱해 정리합니다.",
        startExpr: "y_1(y - y_1) = -x_1(x - x_1) \\implies y_1 y - y_1^2 = -x_1 x + x_1^2",
        targetExpr: "x_1 x + y_1 y = x_1^2 + y_1^2 = r^2",
        question: "점 P(x1, y1)은 원 x^2 + y^2 = r^2 위의 점이므로 x1^2 + y1^2 = r^2 입니다. 최종 식은?",
        options: [
          {
            latex: "x_1x + y_1y = r^2",
            label: "x_1^2 + y_1^2 자리에 r^2을 대입하여 x1*x + y1*y = r^2 이 된다.",
            isCorrect: true,
            feedback: "정답입니다! x^2을 x1*x로, y^2을 y1*y로 쪼개 대입한다는 유명한 공식 규칙이 탄생합니다!"
          },
          {
            latex: "x_1x - y_1y = r^2",
            label: "가운데 부호가 마이너스이다.",
            isCorrect: false,
            feedback: "이항하면 +x1*x + y1*y 가 됩니다."
          },
          {
            latex: "x_1x + y_1y = 0",
            label: "우변이 0이 된다.",
            isCorrect: false,
            feedback: "우변은 반지름의 제곱인 r^2 입니다."
          }
        ],
        aiGuidance: {
          hint: "중심이 (a,b)로 평행이동하면 (x1-a)(x-a) + (y1-b)(y-b) = r^2 이 됩니다.",
          why: "이 쪼개기 테크닉은 훗날 포물선, 타원, 쌍곡선의 접선의 방정식에서도 100% 동일하게 확장됩니다.",
          commonMistake: "원 '위의 점'일 때만 바로 쓸 수 있고, 원 '밖의 점'에서는 접점을 미지수로 둬야 합니다."
        }
      }
    ]
  },

  // =========================================================================
  // 고등학교 2학년 (고2 대수 / 미적분I / 수I·수II 추가 공식)
  // =========================================================================
  {
    id: "log_change_of_base",
    title: "로그의 밑변환 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "대수(수I)",
    unit: "지수함수와 로그함수 - 로그",
    latex: "\\log_a b = \\frac{\\log_c b}{\\log_c a}",
    coreConcept: "로그를 지수로 변환한 뒤 새로운 밑 c로 양변에 로그 취하기",
    prerequisites: "지수와 로그의 상호 정의, 로그의 거듭제곱 성질",
    description: "로그의 밑을 자유롭게 바꿀 수 있는 밑변환 공식을 지수 표현과 양변 로그 취하기를 통해 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "로그를 지수 표현으로 치환하기",
        goal: "x = log_a(b) 로 두고 a^x = b 로 변환합니다.",
        startExpr: "x = \\log_a b",
        targetExpr: "a^x = b",
        question: "로그의 정의에 의해 x = log_a(b) 를 지수식으로 바꾸면?",
        options: [
          {
            latex: "a^x = b",
            label: "밑 a를 x번 거듭제곱하면 진수 b가 된다.",
            isCorrect: true,
            feedback: "정확합니다! 지수와 로그는 동전의 양면 같은 역관계입니다."
          },
          {
            latex: "x^a = b",
            label: "밑과 지수의 자리가 바뀐다.",
            isCorrect: false,
            feedback: "로그의 밑 a가 지수식에서도 밑(base)이 됩니다."
          },
          {
            latex: "b^x = a",
            label: "b가 밑이 된다.",
            isCorrect: false,
            feedback: "a가 밑입니다."
          }
        ],
        aiGuidance: {
          hint: "새로운 밑 c (c > 0, c ≠ 1)를 취해 양변에 log_c를 씌워보세요.",
          why: "서로 다른 밑을 가진 로그들을 계산하고 통일할 수 있는 유일한 도구입니다.",
          commonMistake: "밑 조건(a > 0, a ≠ 1)과 진수 조건(b > 0)을 항상 염두에 두세요."
        }
      },
      {
        stepNumber: 2,
        title: "양변에 밑이 c인 로그를 취해 x 정리",
        goal: "log_c(a^x) = log_c(b) 에서 x*log_c(a) = log_c(b) 로 풉니다.",
        startExpr: "\\log_c (a^x) = \\log_c b \\implies x \\log_c a = \\log_c b",
        targetExpr: "x = \\frac{\\log_c b}{\\log_c a} \\implies \\log_a b = \\frac{\\log_c b}{\\log_c a}",
        question: "진수의 지수 x가 앞으로 내려온 뒤, 양변을 log_c(a)로 나누면?",
        options: [
          {
            latex: "x = \\frac{\\log_c b}{\\log_c a}",
            label: "x = log_c(b) / log_c(a) 이므로 공식이 증명된다.",
            isCorrect: true,
            feedback: "정답입니다! c에 b를 대입하면 log_a(b) = 1 / log_b(a) 라는 역수 공식도 덤으로 얻어집니다!"
          },
          {
            latex: "x = \\log_c(b) - \\log_c(a)",
            label: "나눗셈이 아니라 뺄셈이다.",
            isCorrect: false,
            feedback: "계수 log_c(a)로 양변을 나눈 것이므로 분수 형태가 됩니다."
          },
          {
            latex: "x = \\log_c(ab)",
            label: "진수끼리 곱한다.",
            isCorrect: false,
            feedback: "분수 형태의 나눗셈입니다."
          }
        ],
        aiGuidance: {
          hint: "계산기나 컴퓨터에서 밑이 10인 상용로그나 밑이 e인 자연로그로 바꿀 때 필수적입니다.",
          why: "복잡한 로그 곱셈식 (log_a b * log_b c * log_c a = 1)의 연쇄 소거를 가능하게 합니다.",
          commonMistake: "log_c(b/a) 와 log_c(b)/log_c(a) 를 혼동하지 마세요."
        }
      }
    ]
  },
  {
    id: "law_of_sines",
    title: "삼각형의 사인법칙",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "대수(수I)",
    unit: "삼각함수 - 사인법칙과 코사인법칙",
    latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
    coreConcept: "외접원의 지름을 빗변으로 하는 직각삼각형으로 변형하여 원주각 성질 적용",
    prerequisites: "원주각의 정리, 직각삼각형의 삼각비",
    description: "삼각형 ABC의 외접원 반지름 R에 대해, 꼭짓점 A를 원주를 따라 이동시켜 지름을 빗변으로 갖는 직각삼각형을 만들어 sin A = a/(2R) 임을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "원주각의 성질을 이용해 직각삼각형 A'BC 만들기",
        goal: "꼭짓점 A'을 지나 원의 중심 O를 통과하는 지름 A'B = 2R 을 잡습니다.",
        startExpr: "\\angle A = \\angle A' \\; (\\text{호 BC의 원주각}),\\; A'B = 2R",
        targetExpr: "\\angle A'CB = 90^\\circ \\; (\\text{반원에 대한 원주각})",
        question: "외접원의 지름 A'B = 2R을 빗변으로 하는 삼각형 A'BC에서 각 C의 크기는?",
        options: [
          {
            latex: "\\angle A'CB = 90^\\circ",
            label: "반원(지름)에 대한 원주각이므로 정확히 90도(직각)이다.",
            isCorrect: true,
            feedback: "맞습니다! 따라서 삼각형 A'BC는 지름 2R을 빗변으로 갖는 직각삼각형이 됩니다."
          },
          {
            latex: "\\angle A'CB = 60^\\circ",
            label: "정삼각형이므로 60도이다.",
            isCorrect: false,
            feedback: "지름에 대한 원주각은 항상 직각(90도)입니다."
          },
          {
            latex: "\\angle A'CB = 45^\\circ",
            label: "직각이등변삼각형이다.",
            isCorrect: false,
            feedback: "반원에 대한 원주각은 90도입니다."
          }
        ],
        aiGuidance: {
          hint: "직각삼각형 A'BC에서 sin A' = (대변 a) / (빗변 2R) 정의를 그대로 적용하세요.",
          why: "일반 삼각형을 직각삼각형으로 환원시키는 고전 기하의 가장 아름다운 기법입니다.",
          commonMistake: "둔각삼각형일 때도 원에 내접하는 사각형 성질(sin(180°-A) = sin A)로 완벽히 성립합니다."
        }
      },
      {
        stepNumber: 2,
        title: "직각삼각형의 삼각비로 sin A 정의 및 2R 연결",
        goal: "sin A' = a / (2R) 에서 sin A = a / (2R) 즉 a / sin A = 2R 을 확정합니다.",
        startExpr: "\\sin A' = \\frac{a}{2R},\\; \\angle A' = \\angle A",
        targetExpr: "\\sin A = \\frac{a}{2R} \\iff \\frac{a}{\\sin A} = 2R",
        question: "원주각의 크기가 같으므로 sin A = a / (2R) 입니다. 양변을 정리한 비례식은?",
        options: [
          {
            latex: "\\frac{a}{\\sin A} = 2R",
            label: "변과 마주보는 각의 사인값의 비는 외접원의 지름(2R)으로 일정하다.",
            isCorrect: true,
            feedback: "훌륭합니다! b와 c에 대해서도 완전히 동일하게 성립하여 a/sin A = b/sin B = c/sin C = 2R 이 됩니다!"
          },
          {
            latex: "a \\sin A = 2R",
            label: "변과 사인값을 곱한 것이 2R이다.",
            isCorrect: false,
            feedback: "대변 나누기 빗변이므로 나눗셈 비율입니다."
          },
          {
            latex: "\\frac{\\sin A}{a} = 2R",
            label: "사인값을 변으로 나눈 것이 2R이다.",
            isCorrect: false,
            feedback: "역수 관계입니다. a / sin A 가 2R입니다."
          }
        ],
        aiGuidance: {
          hint: "한 변과 마주보는 대각이 주어지거나 외접원 반지름이 등장하면 무조건 사인법칙입니다.",
          why: "측량학, 천문학, GPS 삼각측량의 모든 기본 원리가 이 사인법칙에 있습니다.",
          commonMistake: "외접원의 반지름 R과 지름 2R을 구별하세요."
        }
      }
    ]
  },
  {
    id: "sum_of_squares",
    title: "자연수의 제곱의 합 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "대수(수I)",
    unit: "수열 - 수열의 합",
    latex: "\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}",
    coreConcept: "3차 항등식 (k+1)^3 - k^3 = 3k^2 + 3k + 1 의 망원합(Telescoping Sum)",
    prerequisites: "시그마(Σ)의 성질, 자연수 1차 합 공식",
    description: "항등식 (k+1)^3 - k^3 = 3k^2 + 3k + 1 에 k=1부터 n까지 대입하여 양변을 더하는 연쇄 상쇄를 통해 시그마 k^2 공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "3차 항등식 작성 후 k=1부터 n까지 합산",
        goal: "Σ [(k+1)^3 - k^3] = (n+1)^3 - 1 임을 확인합니다.",
        startExpr: "(k + 1)^3 - k^3 = 3k^2 + 3k + 1",
        targetExpr: "\\sum_{k=1}^n ((k+1)^3 - k^3) = (n+1)^3 - 1^3",
        question: "좌변에 k=1, 2, ..., n을 대입해 더하면 중간 항들이 모두 상쇄됩니다. 남는 것은?",
        options: [
          {
            latex: "(n + 1)^3 - 1",
            label: "맨 끝 항 (n+1)^3 과 맨 첫 항 -1^3 만 남는다.",
            isCorrect: true,
            feedback: "맞습니다! 이를 망원경처럼 접힌다고 하여 '망원합(Telescoping sum)'이라고 부릅니다."
          },
          {
            latex: "(n + 1)^3",
            label: "-1도 상쇄되어 (n+1)^3만 남는다.",
            isCorrect: false,
            feedback: "k=1일 때의 -1^3은 상쇄되지 않고 남습니다."
          },
          {
            latex: "n^3",
            label: "n^3만 남는다.",
            isCorrect: false,
            feedback: "마지막 항은 (n+1)^3 입니다."
          }
        ],
        aiGuidance: {
          hint: "우변은 3Σk^2 + 3Σk + Σ1 로 쪼개어집니다. 이미 알고 있는 Σk = n(n+1)/2 를 대입하세요.",
          why: "시그마 거듭제곱 공식의 가장 표준적이고 체계적인 대수적 유도법입니다.",
          commonMistake: "우변의 상수항 1을 n번 더하면 n이 된다는 점을 빠뜨리지 마세요."
        }
      },
      {
        stepNumber: 2,
        title: "우변을 정리하고 Σk^2 에 대해 풀기",
        goal: "3Σk^2 = (n+1)^3 - 1 - 3*n(n+1)/2 - n 식을 인수분해합니다.",
        startExpr: "3\\sum_{k=1}^n k^2 = n(n+1)(n+2) - \\dots = \\frac{n(n+1)(2n+1)}{2}",
        targetExpr: "\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}",
        question: "양변을 3으로 나누었을 때 얻어지는 시그마 k^2의 최종 공식은?",
        options: [
          {
            latex: "\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}",
            label: "분모에 2*3 = 6이 들어가 n(n+1)(2n+1) / 6 이 된다.",
            isCorrect: true,
            feedback: "정답입니다! 수학적 귀납법 증명 문제에서도 단골로 등장하는 핵심 공식입니다!"
          },
          {
            latex: "\\sum_{k=1}^n k^2 = \\left[\\frac{n(n+1)}{2}\\right]^2",
            label: "시그마 k 공식을 통째로 제곱한다.",
            isCorrect: false,
            feedback: "그것은 세제곱의 합인 시그마 k^3 공식입니다!"
          },
          {
            latex: "\\sum_{k=1}^n k^2 = \\frac{n(n+1)(n+2)}{6}",
            label: "마지막 항이 (n+2)이다.",
            isCorrect: false,
            feedback: "인수분해 결과 마지막 항은 (2n+1) 입니다."
          }
        ],
        aiGuidance: {
          hint: "n=1 대입 검산: 1*(2)*(3)/6 = 1, n=2 대입: 2*3*5/6 = 5 (1^2 + 2^2 = 5)로 완벽히 들어맞습니다.",
          why: "구분구적법을 통해 곡선 아래 넓이를 정적분으로 계산할 때 극한 계산의 필수 도구입니다.",
          commonMistake: "분모가 6이라는 점과 마지막 인수가 (2n+1)이라는 점을 정확히 기억하세요."
        }
      }
    ]
  },
  {
    id: "fundamental_theorem_calculus",
    title: "미적분의 기본정리 (FTC)",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "미적분I(수II)",
    unit: "적분 - 정적분",
    latex: "\\frac{d}{dx}\\int_a^x f(t)dt = f(x),\\; \\int_a^b f(x)dx = F(b) - F(a)",
    coreConcept: "넓이 함수 S(x)의 변화율(미분계수)이 높이 f(x)와 같음을 증명",
    prerequisites: "정적분의 정의, 미분계수의 정의, 평균값 정리",
    description: "곡선 아래의 넓이를 나타내는 함수 S(x) = ∫_a^x f(t)dt의 도함수가 원래 함수 f(x)가 됨을 증명하여, 미분과 적분이 역연산임을 밝힙니다.",
    steps: [
      {
        stepNumber: 1,
        title: "넓이 함수의 증분 ΔS 와 직사각형 넓이 근사",
        goal: "S(x+h) - S(x) = ∫_x^(x+h) f(t)dt 를 밑변 h와 높이 f(c)로 근사합니다.",
        startExpr: "S(x) = \\int_a^x f(t)dt",
        targetExpr: "\\frac{S(x+h) - S(x)}{h} = \\frac{1}{h}\\int_x^{x+h} f(t)dt = f(c) \\; (x < c < x+h)",
        question: "적분의 평균값 정리에 의해 폭 h인 미세 영역의 넓이는 밑변 h에 어떤 높이 f(c)를 곱한 직사각형과 같을까요?",
        options: [
          {
            latex: "\\int_x^{x+h} f(t)dt = h \\cdot f(c) \\; (x \\le c \\le x+h)",
            label: "사잇값에 존재하는 적절한 높이 f(c)와 폭 h의 곱과 같다.",
            isCorrect: true,
            feedback: "맞습니다! 평균값 정리에 의해 연속함수 곡선 아래 넓이와 같은 넓이의 직사각형 높이 f(c)가 반드시 존재합니다."
          },
          {
            latex: "\\int_x^{x+h} f(t)dt = h^2 \\cdot f(x)",
            label: "폭의 제곱과 높이의 곱이다.",
            isCorrect: false,
            feedback: "밑변은 h이므로 1차원 폭입니다."
          },
          {
            latex: "\\int_x^{x+h} f(t)dt = 0",
            label: "h가 작으므로 0이다.",
            isCorrect: false,
            feedback: "미세하지만 양의 넓이를 가집니다."
          }
        ],
        aiGuidance: {
          hint: "양변을 h로 나눈 뒤 h -> 0 극한을 취해보세요. c는 x와 x+h 사이에 갇혀있습니다(샌드위치 정리).",
          why: "인류 역사상 가장 위대한 수학적 발견 중 하나인 미적분학의 기본정리 1부입니다.",
          commonMistake: "적분변수 t와 상한 변수 x를 구별하여 표기해야 합니다."
        }
      },
      {
        stepNumber: 2,
        title: "h -> 0 극한으로 도함수 f(x) 도출 및 정적분 계산법 완성",
        goal: "S'(x) = lim (S(x+h)-S(x))/h = lim f(c) = f(x) 임을 증명합니다.",
        startExpr: "S'(x) = \\lim_{h \\to 0} f(c), \\quad c \\to x",
        targetExpr: "S'(x) = f(x) \\implies \\int_a^b f(x)dx = F(b) - F(a)",
        question: "h가 0으로 갈 때 c는 x로 수렴하므로 S'(x) = f(x) 입니다. 이로써 도출되는 정적분의 계산법은?",
        options: [
          {
            latex: "\\int_a^b f(x)dx = [F(x)]_a^b = F(b) - F(a)",
            label: "f(x)의 부정적분 F(x)를 구해 F(b) - F(a)로 정적분을 계산한다.",
            isCorrect: true,
            feedback: "축하합니다! 복잡한 리만 합(구분구적법)을 계산하지 않고도 부정적분의 양 끝값 차이로 넓이를 단번에 구하게 되었습니다!"
          },
          {
            latex: "\\int_a^b f(x)dx = f'(b) - f'(a)",
            label: "도함수의 차이로 계산한다.",
            isCorrect: false,
            feedback: "미분이 아니라 부정적분(원시함수)의 차이입니다."
          },
          {
            latex: "\\int_a^b f(x)dx = F(b) \\cdot F(a)",
            label: "양 끝값을 곱한다.",
            isCorrect: false,
            feedback: "상한 대입값에서 하한 대입값을 뺍니다."
          }
        ],
        aiGuidance: {
          hint: "뉴턴과 라이프니츠가 독자적으로 발견하여 과학혁명을 촉발한 공식입니다.",
          why: "기하학의 넓이 문제(적분)와 운동학의 속도 문제(미분)가 정반대의 역연산임을 증명한 이정표입니다.",
          commonMistake: "적분상수 C는 F(b)+C - (F(a)+C) 에서 완벽히 상쇄되므로 정적분에서는 쓰지 않아도 됩니다."
        }
      }
    ]
  },
  {
    id: "parabola_area_formula",
    title: "포물선과 직선이 둘러싼 넓이 공식 (6분의 공식)",
    curriculum: ["15개정", "22개정"],
    grade: "고2",
    subject: "미적분I(수II)",
    unit: "적분 - 정적분의 활용",
    latex: "S = \\frac{|a|}{6}(\\beta - \\alpha)^3",
    coreConcept: "이차식 (x-α)(x-β)를 (x-α)에 대한 다항식으로 치환 적분하기",
    prerequisites: "이차방정식의 두 실근, 정적분 전개",
    description: "이차곡선과 직선의 교점을 α, β라 할 때 ∫_α^β (x-α)(x-β)dx 의 정적분 값이 -1/6*(β-α)^3 이 됨을 치환 전개로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "피적분함수를 (x-α) 형태로 변형하기",
        goal: "(x-β) = (x-α) - (β-α) 로 묶어 전개 준비를 합니다.",
        startExpr: "\\int_\\alpha^\\beta (x - \\alpha)(x - \\beta) dx",
        targetExpr: "\\int_\\alpha^\\beta (x - \\alpha)[(x - \\alpha) - (\\beta - \\alpha)] dx",
        question: "일반 전개(x^2 - (α+β)x + αβ) 대신 (x-α)를 하나의 덩어리로 보면 적분이 어떻게 단순해질까요?",
        options: [
          {
            latex: "\\int_\\alpha^\\beta [(x - \\alpha)^2 - (\\beta - \\alpha)(x - \\alpha)] dx",
            label: "(x-alpha)의 거듭제곱 형태로 전개되어 적분이 극도로 간단해진다.",
            isCorrect: true,
            feedback: "정확합니다! x=alpha를 대입하면 0이 되므로 하한 계산이 완전히 사라집니다!"
          },
          {
            latex: "\\int_\\alpha^\\beta (x^2 - \\alpha\\beta) dx",
            label: "일차항이 사라진다.",
            isCorrect: false,
            feedback: "일차항은 사라지지 않고 유지됩니다."
          },
          {
            latex: "0",
            label: "대칭성에 의해 0이다.",
            isCorrect: false,
            feedback: "넓이를 구하는 것이므로 0이 아닙니다."
          }
        ],
        aiGuidance: {
          hint: "∫ (x-α)^2 dx = 1/3 (x-α)^3 이고, ∫ (x-α) dx = 1/2 (x-α)^2 입니다.",
          why: "수능 및 내신 시험에서 계산 시간을 10분 단축시켜주는 가장 강력한 필수 비기입니다.",
          commonMistake: "적분 구간의 상한(β)을 대입하면 (β-α) 거듭제곱들만 남게 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "상한 β 대입 후 1/3 - 1/2 통분 계산으로 1/6 도출",
        goal: "1/3(β-α)^3 - 1/2(β-α)^3 = -1/6(β-α)^3 을 구하고 절댓값을 취합니다.",
        startExpr: "\\left[ \\frac{1}{3}(x - \\alpha)^3 - \\frac{1}{2}(\\beta - \\alpha)(x - \\alpha)^2 \\right]_\\alpha^\\beta",
        targetExpr: "\\left( \\frac{1}{3} - \\frac{1}{2} \\right)(\\beta - \\alpha)^3 = -\\frac{1}{6}(\\beta - \\alpha)^3 \\implies S = \\frac{|a|}{6}(\\beta - \\alpha)^3",
        question: "1/3 - 1/2 을 계산하면 어떤 분수가 나오나요?",
        options: [
          {
            latex: "\\frac{1}{3} - \\frac{1}{2} = -\\frac{1}{6} \\implies S = \\frac{|a|}{6}(\\beta - \\alpha)^3",
            label: "-1/6 이 나오며, 넓이는 양수이므로 |a|/6 * (beta - alpha)^3 이 된다.",
            isCorrect: true,
            feedback: "완벽합니다! 최고차항 계수 a의 절댓값을 곱해주면 포물선 넓이의 6분의 공식이 완벽하게 증명됩니다!"
          },
          {
            latex: "\\frac{1}{3} - \\frac{1}{2} = -\\frac{1}{5}",
            label: "-1/5 이 된다.",
            isCorrect: false,
            feedback: "2/6 - 3/6 = -1/6 입니다."
          },
          {
            latex: "\\frac{1}{12}",
            label: "1/12 이 된다.",
            isCorrect: false,
            feedback: "1/12 공식은 삼차함수 접선과 곡선 사이의 넓이 공식입니다."
          }
        ],
        aiGuidance: {
          hint: "삼차함수 접선 넓이 공식은 |a|/12 * (β-α)^4, 두 접선 넓이는 |a|/12 * (β-α)^3 입니다.",
          why: "내신 및 수능에서 계산 실수를 방지하고 답을 즉각 검산하는 최고의 치트키 공식입니다.",
          commonMistake: "β가 α보다 큰 값(오른쪽 근)이어야 (β-α) > 0 임에 주의하세요."
        }
      }
    ]
  },

  // =========================================================================
  // 고등학교 3학년 (고3 미적분 / 확률과 통계 / 기하 추가 공식)
  // =========================================================================
  {
    id: "quotient_rule",
    title: "함수의 몫의 미분법",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "미적분",
    unit: "여러 가지 미분법 - 도함수",
    latex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}",
    coreConcept: "도함수의 정의식에 분수의 통분과 중간항 ±f(x)g(x) 끼워넣기",
    prerequisites: "미분계수의 정의, 곱의 미분법",
    description: "분수 형태의 함수 y = f(x)/g(x)의 도함수를 정의식 lim [f(x+h)/g(x+h) - f(x)/g(x)] / h 로부터 통분하여 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "도함수 정의식 작성 및 분자 통분",
        goal: "[f(x+h)g(x) - f(x)g(x+h)] / [h * g(x+h)g(x)] 로 정리합니다.",
        startExpr: "\\lim_{h \\to 0} \\frac{\\frac{f(x+h)}{g(x+h)} - \\frac{f(x)}{g(x)}}{h}",
        targetExpr: "\\lim_{h \\to 0} \\frac{f(x+h)g(x) - f(x)g(x+h)}{h \\cdot g(x+h)g(x)}",
        question: "두 분수를 통분할 때 공통분모는 무엇이 될까요?",
        options: [
          {
            latex: "g(x+h)g(x)",
            label: "두 분모의 곱인 g(x+h)*g(x) 가 공통분모가 된다.",
            isCorrect: true,
            feedback: "맞습니다! 이제 분자에 미분계수의 형태를 만들기 위해 f(x)g(x)를 빼고 더해줍니다."
          },
          {
            latex: "g(x)^2",
            label: "처음부터 g(x)^2 이다.",
            isCorrect: false,
            feedback: "h->0 극한을 취하기 전에는 g(x+h)*g(x) 입니다."
          },
          {
            latex: "g(x+h) - g(x)",
            label: "분모끼리 뺀다.",
            isCorrect: false,
            feedback: "통분은 두 분모의 곱이어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "분자에 - f(x)g(x) + f(x)g(x) 를 삽입하여 [f(x+h)-f(x)]g(x) 와 -f(x)[g(x+h)-g(x)] 로 묶어보세요.",
          why: "곱의 미분법과 몫의 미분법은 미분계수 조작 기법의 쌍벽을 이룹니다.",
          commonMistake: "분자의 부호가 마이너스(-fg')라는 점을 주의하세요."
        }
      },
      {
        stepNumber: 2,
        title: "미분계수 묶기 및 극한 계산으로 공식 완성",
        goal: "[f'(x)g(x) - f(x)g'(x)] / [g(x)^2] 을 도출합니다.",
        startExpr: "\\lim_{h \\to 0} \\frac{[f(x+h)-f(x)]g(x) - f(x)[g(x+h)-g(x)]}{h \\cdot g(x+h)g(x)}",
        targetExpr: "\\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}",
        question: "h -> 0 극한에서 분모의 g(x+h)g(x)는 g(x)^2이 됩니다. 최종 도함수는?",
        options: [
          {
            latex: "\\frac{f'g - fg'}{g^2}",
            label: "(f'g - fg') / g^2",
            isCorrect: true,
            feedback: "정답입니다! 분모 제곱 분에 (분자 미분 곱하기 분모) 빼기 (분자 곱하기 분모 미분)입니다!"
          },
          {
            latex: "\\frac{f'g + fg'}{g^2}",
            label: "가운데 부호가 덧셈(+)이다.",
            isCorrect: false,
            feedback: "분모에 있던 함수가 올라오므로 부호는 뺄셈(-)입니다."
          },
          {
            latex: "\\frac{f'}{g'}",
            label: "각각 미분한 f'/g' 이다.",
            isCorrect: false,
            feedback: "절대로 각각 미분하면 안 됩니다! 그것은 로피탈 정리와도 다릅니다."
          }
        ],
        aiGuidance: {
          hint: "f(x)=1 일 때는 (1/g)' = -g'/g^2 이 됩니다.",
          why: "유리학수, 탄젠트 함수(tan x = sin x / cos x) 등의 미분에 즉각 적용됩니다.",
          commonMistake: "f'g 와 fg' 의 순서를 바꾸면 부호가 통째로 반대가 되니 순서에 주의하세요."
        }
      }
    ]
  },
  {
    id: "chain_rule",
    title: "합성함수의 미분법 (연쇄법칙)",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "미적분",
    unit: "여러 가지 미분법 - 합성함수",
    latex: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} \\iff (f(g(x)))' = f'(g(x))g'(x)",
    coreConcept: "증분의 비 Δy/Δx 를 Δu를 매개로 분할한 뒤 극한 취하기",
    prerequisites: "미분계수의 정의, 함수의 연속성",
    description: "y = f(u), u = g(x) 일 때 증분의 곱 (Δy/Δu)*(Δu/Δx) = Δy/Δx 관계를 이용하여 합성함수의 겉미분과 속미분의 곱을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "증분의 비를 중간 변수 Δu로 분할하기",
        goal: "Δy/Δx = (Δy/Δu) * (Δu/Δx) 항등식을 구성합니다.",
        startExpr: "\\frac{\\Delta y}{\\Delta x}",
        targetExpr: "\\frac{\\Delta y}{\\Delta u} \\cdot \\frac{\\Delta u}{\\Delta x} \\; (\\Delta u \\ne 0)",
        question: "Δu가 0이 아니라고 할 때, 분수처럼 약분되는 중간 변수 Δu를 끼워 넣으면?",
        options: [
          {
            latex: "\\frac{\\Delta y}{\\Delta x} = \\frac{\\Delta y}{\\Delta u} \\cdot \\frac{\\Delta u}{\\Delta x}",
            label: "Δu를 분모와 분자에 곱해도 원래 비율과 완벽히 같다.",
            isCorrect: true,
            feedback: "맞습니다! 마치 분수의 약분처럼 중간 연결고리를 만들어주는 것입니다."
          },
          {
            latex: "\\frac{\\Delta y}{\\Delta x} = \\frac{\\Delta y}{\\Delta u} + \\frac{\\Delta u}{\\Delta x}",
            label: "두 증분을 더한다.",
            isCorrect: false,
            feedback: "비율의 곱셈이어야 상쇄됩니다."
          },
          {
            latex: "\\frac{\\Delta y}{\\Delta x} = \\Delta y \\cdot \\Delta u",
            label: "증분끼리 곱한다.",
            isCorrect: false,
            feedback: "분수 형태의 미분비율이어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "Δx -> 0 일 때 u = g(x)가 연속이므로 Δu -> 0 이 됩니다.",
          why: "딥러닝 인공신경망의 역전파(Backpropagation) 알고리즘 전체를 지배하는 단 하나의 수학 공식입니다.",
          commonMistake: "미분기호 dy/dx는 엄밀히 분수가 아니지만 라이프니츠 표기법에서는 분수처럼 행동합니다."
        }
      },
      {
        stepNumber: 2,
        title: "Δx -> 0 극한을 취해 도함수의 곱으로 확정",
        goal: "dy/dx = (dy/du) * (du/dx) = f'(g(x)) * g'(x) 를 얻습니다.",
        startExpr: "\\lim_{\\Delta x \\to 0} \\left( \\frac{\\Delta y}{\\Delta u} \\cdot \\frac{\\Delta u}{\\Delta x} \\right)",
        targetExpr: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} = f'(g(x)) g'(x)",
        question: "극한을 각각 취하면 dy/du = f'(u) = f'(g(x)) 이고 du/dx = g'(x) 입니다. 최종 합성함수 미분법은?",
        options: [
          {
            latex: "(f(g(x)))' = f'(g(x)) \\cdot g'(x)",
            label: "바깥 함수를 미분한 것(겉미분)에 안쪽 함수를 미분한 것(속미분)을 곱한다.",
            isCorrect: true,
            feedback: "정답입니다! '겉미분 곱하기 속미분'이라는 유명한 원리의 탄생입니다!"
          },
          {
            latex: "(f(g(x)))' = f'(g'(x))",
            label: "바깥과 안쪽을 동시에 미분해 안에 넣는다.",
            isCorrect: false,
            feedback: "속함수 g(x)는 그대로 둔 채 바깥을 미분하고, 뒤에 g'(x)를 곱해야 합니다."
          },
          {
            latex: "(f(g(x)))' = f'(g(x)) + g'(x)",
            label: "겉미분과 속미분을 더한다.",
            isCorrect: false,
            feedback: "연쇄법칙(Chain Rule)이므로 곱셈입니다."
          }
        ],
        aiGuidance: {
          hint: "예: (3x+1)^5 미분 시 겉미분 5(3x+1)^4 에 속미분 3을 곱해 15(3x+1)^4 가 됩니다.",
          why: "역함수의 미분법, 매개변수 미분법, 음함수의 미분법이 모두 이 연쇄법칙의 파생물입니다.",
          commonMistake: "속미분 g'(x)를 뒤에 곱해주는 것을 깜빡 잊는 실수가 가장 많습니다."
        }
      }
    ]
  },
  {
    id: "integration_by_substitution",
    title: "치환적분법의 유도",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "미적분",
    unit: "여러 가지 적분법 - 치환적분",
    latex: "\\int f(g(x))g'(x)dx = \\int f(u)du",
    coreConcept: "합성함수 미분의 역연산 및 미분형식 du = g'(x)dx 적용",
    prerequisites: "합성함수의 미분법, 부정적분의 정의",
    description: "합성함수의 미분법 [F(g(x))]' = F'(g(x))g'(x) = f(g(x))g'(x)의 양변을 적분하여 치환적분 공식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "합성함수 F(g(x))의 미분 공식에서 출발",
        goal: "F'(u) = f(u) 일 때 [F(g(x))]' = f(g(x))g'(x) 임을 확인합니다.",
        startExpr: "\\frac{d}{dx} F(g(x)) = F'(g(x)) g'(x) = f(g(x)) g'(x)",
        targetExpr: "\\int f(g(x)) g'(x) dx = F(g(x)) + C",
        question: "양변을 x에 대하여 부정적분하면 좌변과 우변의 관계는?",
        options: [
          {
            latex: "\\int f(g(x)) g'(x) dx = F(g(x)) + C",
            label: "미분한 것을 다시 적분했으므로 원래 함수 F(g(x)) + C 가 된다.",
            isCorrect: true,
            feedback: "맞습니다! 적분은 미분의 역연산이므로 원시함수로 되돌아옵니다."
          },
          {
            latex: "\\int f(g(x)) g'(x) dx = f'(g(x))",
            label: "f의 도함수가 된다.",
            isCorrect: false,
            feedback: "적분했으므로 차수가 올라가는 원시함수 F가 되어야 합니다."
          },
          {
            latex: "\\int f(g(x)) g'(x) dx = F(x)G(x)",
            label: "각각의 적분의 곱이다.",
            isCorrect: false,
            feedback: "적분은 곱셈에 대해 분배되지 않습니다."
          }
        ],
        aiGuidance: {
          hint: "u = g(x) 로 치환하면 양변의 미분형식은 du = g'(x)dx 가 됩니다.",
          why: "복잡한 합성함수 피적분식을 단순한 기본 적분으로 탈바꿈시키는 마법입니다.",
          commonMistake: "적분변수를 x에서 u로 바꿀 때는 반드시 dx도 du로 바꿔주어야 합니다."
        }
      },
      {
        stepNumber: 2,
        title: "새로운 변수 u = g(x) 로의 치환 공식 완성",
        goal: "F(g(x)) + C = F(u) + C = ∫ f(u)du 로 연결합니다.",
        startExpr: "u = g(x), \\quad du = g'(x)dx",
        targetExpr: "\\int f(g(x)) g'(x) dx = \\int f(u) du",
        question: "g(x) 대신 u를, g'(x)dx 대신 du를 대입하면 어떤 식이 완성될까요?",
        options: [
          {
            latex: "\\int f(u) du",
            label: "∫ f(u) du 로 단순해져 바로 적분할 수 있게 된다.",
            isCorrect: true,
            feedback: "정답입니다! 정적분일 때는 x의 적분구간 [a, b]를 u의 구간 [g(a), g(b)]로 바꿔주면 됩니다!"
          },
          {
            latex: "\\int f(u) g'(u) du",
            label: "g'(u)가 여전히 곱해져 있다.",
            isCorrect: false,
            feedback: "g'(x)dx 전체가 du 하나로 완전히 흡수되었습니다."
          },
          {
            latex: "\\int u \\cdot f(x) dx",
            label: "x와 u가 섞여서 남는다.",
            isCorrect: false,
            feedback: "모든 x가 u에 대한 식으로 완전히 변환되어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "분수 형태에서 분모의 미분이 분자에 있는 꼴: ∫ f'(x)/f(x) dx = ln|f(x)| + C 도 대표적인 치환적분입니다.",
          why: "부분적분과 함께 고교 미적분의 적분 기법의 양대 산맥입니다.",
          commonMistake: "부정적분을 다 구한 후에는 u를 다시 원래의 x에 관한 식 g(x)로 되돌려놓아야 합니다."
        }
      }
    ]
  },
  {
    id: "binomial_theorem",
    title: "이항정리 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "확률과 통계",
    unit: "경우의 수 - 이항정리",
    latex: "(a + b)^n = \\sum_{r=0}^n {}_n\\mathrm{C}_r a^{n-r}b^r",
    coreConcept: "n개의 (a+b) 괄호에서 b를 r개 택하는 조합의 수",
    prerequisites: "조합(Combination)의 정의, 곱셈의 분배법칙",
    description: "(a+b)^n = (a+b)(a+b)...(a+b)의 전개에서 각 괄호마다 a 또는 b 중 하나를 선택해 곱할 때 동류항 a^(n-r)*b^r의 계수가 nCr이 됨을 조합론적으로 증명합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "n개의 괄호에서 문자를 선택하는 조합론적 관점",
        goal: "(a+b) 괄호 n개 중 b를 r개 고르면 a는 자동으로 (n-r)개 선택됨을 이해합니다.",
        startExpr: "(a + b)^n = \\underbrace{(a + b)(a + b) \\dots (a + b)}_{n\\text{개}}",
        targetExpr: "\\text{항 } a^{n-r}b^r \\text{이 나오는 경우의 수} = {}_n\\mathrm{C}_r",
        question: "n개의 괄호 중에서 b를 뽑을 괄호 r개를 선택하는 방법의 수는?",
        options: [
          {
            latex: "{}_n\\mathrm{C}_r",
            label: "순서 없이 서로 다른 n개에서 r개를 택하므로 조합 nCr 이다.",
            isCorrect: true,
            feedback: "정확합니다! 전개했을 때 생기는 모든 항은 괄호마다 문자를 하나씩 고른 결과물입니다."
          },
          {
            latex: "{}_n\\mathrm{P}_r",
            label: "순서를 고려하므로 순열 nPr 이다.",
            isCorrect: false,
            feedback: "어떤 괄호에서 뽑든 곱셈은 교환법칙이 성립하므로 순서가 상관없습니다."
          },
          {
            latex: "n^r",
            label: "중복순열 n^r 이다.",
            isCorrect: false,
            feedback: "각 괄호에서 하나씩만 택할 수 있으므로 nCr 입니다."
          }
        ],
        aiGuidance: {
          hint: "r=0부터 n까지 모든 가능한 b의 개수를 더하면 전체 전개식이 완성됩니다.",
          why: "파스칼의 삼각형, 이항계수의 성질 (Σ nCr = 2^n), 확률론의 이항분포로 이어집니다.",
          commonMistake: "a에 1, b에 1을 대입하면 2^n = nC0 + nC1 + ... + nCn 이라는 놀라운 항등식이 나옵니다."
        }
      },
      {
        stepNumber: 2,
        title: "시그마 기호로 모든 전개항을 묶어 공식 완성",
        goal: "r=0부터 n까지의 합으로 (a+b)^n 전개식을 확정합니다.",
        startExpr: "{}_n\\mathrm{C}_0 a^n + {}_n\\mathrm{C}_1 a^{n-1}b + \\dots + {}_n\\mathrm{C}_n b^n",
        targetExpr: "(a + b)^n = \\sum_{r=0}^n {}_n\\mathrm{C}_r a^{n-r}b^r",
        question: "이 모든 동류항의 합을 시그마(Σ) 기호로 나타내면?",
        options: [
          {
            latex: "\\sum_{r=0}^n {}_n\\mathrm{C}_r a^{n-r}b^r",
            label: "r=0부터 n까지 nCr * a^(n-r) * b^r 의 합이다.",
            isCorrect: true,
            feedback: "완벽합니다! 이것이 고등학교 대수학의 보석인 '이항정리(Binomial Theorem)'입니다!"
          },
          {
            latex: "\\sum_{r=1}^n {}_n\\mathrm{C}_r a^{n-r}b^r",
            label: "r=1부터 시작한다.",
            isCorrect: false,
            feedback: "b를 0개 뽑는(a만 n개 뽑는) r=0 항도 포함되어야 합니다."
          },
          {
            latex: "\\sum_{r=0}^n a^{n-r}b^r",
            label: "계수 nCr이 없이 그냥 계수가 1이다.",
            isCorrect: false,
            feedback: "계수 nCr이 붙어야 동류항들의 개수가 반영됩니다."
          }
        ],
        aiGuidance: {
          hint: "일반항은 nCr * a^(n-r) * b^r 입니다. 특정 항의 계수를 구할 때 이 일반항을 씁니다.",
          why: "뉴턴은 이 공식을 음수와 분수 지수로 확장하여 일반 이항정리(미적분 전개)를 창시했습니다.",
          commonMistake: "전체 항의 개수는 n개가 아니라 (n+1)개입니다."
        }
      }
    ]
  },
  {
    id: "binomial_distribution_mean_variance",
    title: "이항분포의 평균과 분산 공식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "확률과 통계",
    unit: "통계 - 이항분포",
    latex: "E(X) = np,\\; V(X) = np(1-p)",
    coreConcept: "독립시행의 확률변수를 n개의 독립적인 베르누이 시행의 합으로 분해",
    prerequisites: "기댓값의 선형성 E(X+Y) = E(X)+E(Y), 독립확률변수의 분산 합",
    description: "성공확률이 p인 독립시행을 n번 반복할 때의 성공 횟수 X를 각 시행의 지시확률변수(Xi)들의 합으로 분해하여 E(X)=np, V(X)=npq를 우아하게 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "확률변수 X를 1회 시행의 지시확률변수들의 합으로 표현",
        goal: "X = X1 + X2 + ... + Xn (Xi = 1 if 성공, 0 if 실패) 로 분해합니다.",
        startExpr: "X = \\sum_{i=1}^n X_i, \\quad P(X_i = 1) = p,\\; P(X_i = 0) = 1 - p",
        targetExpr: "E(X_i) = 1 \\cdot p + 0 \\cdot (1 - p) = p",
        question: "단 1번 시행했을 때의 기댓값 E(Xi)는 얼마인가요?",
        options: [
          {
            latex: "E(X_i) = p",
            label: "1*p + 0*(1-p) = p 이다.",
            isCorrect: true,
            feedback: "맞습니다! 1회 시행의 성공 기댓값은 그냥 성공 확률 p입니다."
          },
          {
            latex: "E(X_i) = 1",
            label: "시행 횟수가 1이므로 1이다.",
            isCorrect: false,
            feedback: "확률 p를 가중치로 곱해야 합니다."
          },
          {
            latex: "E(X_i) = np",
            label: "1회 시행에서도 np이다.",
            isCorrect: false,
            feedback: "1회 시행이므로 n=1을 대입해 p입니다."
          }
        ],
        aiGuidance: {
          hint: "기댓값의 선형성: E(X1 + X2 + ... + Xn) = E(X1) + E(X2) + ... + E(Xn) 을 적용하세요.",
          why: "복잡한 조합 합(Σ r*nCr*p^r*q^(n-r))을 계산하지 않고도 1초 만에 증명되는 최고의 발상입니다.",
          commonMistake: "각 시행이 '독립'이어야 분산 합 V(X) = Σ V(Xi) 가 성립합니다."
        }
      },
      {
        stepNumber: 2,
        title: "기댓값의 선형성과 독립분산의 합으로 공식 완성",
        goal: "E(X) = n*p, V(Xi) = p(1-p) 에서 V(X) = n*p*(1-p) 를 확정합니다.",
        startExpr: "E(X) = \\sum_{i=1}^n E(X_i) = np,\\quad V(X_i) = E(X_i^2) - (E(X_i))^2 = p - p^2 = p(1-p)",
        targetExpr: "E(X) = np,\\quad V(X) = \\sum_{i=1}^n V(X_i) = np(1-p) = npq \\; (q = 1-p)",
        question: "서로 독립인 n개의 확률변수의 분산을 모두 더하면 V(X)는 얼마가 될까요?",
        options: [
          {
            latex: "V(X) = np(1-p)",
            label: "각 분산 p(1-p)를 n번 더하므로 np(1-p) = npq 가 된다.",
            isCorrect: true,
            feedback: "정답입니다! 이 간단한 식으로부터 표준편차 σ(X) = √(npq) 까지 자연스럽게 연결됩니다!"
          },
          {
            latex: "V(X) = np",
            label: "평균과 분산이 같다.",
            isCorrect: false,
            feedback: "그것은 포아송 분포의 성질입니다. 이항분포에서는 (1-p)를 곱해야 합니다."
          },
          {
            latex: "V(X) = n^2 p (1-p)",
            label: "n의 제곱에 비례한다.",
            isCorrect: false,
            feedback: "독립확률변수의 합의 분산은 n배이지 n^2배가 아닙니다."
          }
        ],
        aiGuidance: {
          hint: "동전을 100번 던질 때 앞면의 기댓값은 100 * 0.5 = 50번, 분산은 100 * 0.5 * 0.5 = 25입니다.",
          why: "n이 충분히 크면 이항분포 B(n, p)가 정규분포 N(np, npq)로 근사된다는 라플라스 정리의 토대입니다.",
          commonMistake: "q = 1 - p (실패 확률)임을 잊지 마세요."
        }
      }
    ]
  },
  {
    id: "parabola_standard_eq",
    title: "포물선의 표준방정식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "기하",
    unit: "이차곡선 - 포물선",
    latex: "y^2 = 4px",
    coreConcept: "초점과 준선에 이르는 거리가 같은 점들의 자취",
    prerequisites: "두 점 사이의 거리 공식, 점과 직선 사이의 거리",
    description: "초점 F(p, 0)과 준선 x = -p 로부터 같은 거리에 있는 동점 P(x, y)의 자취의 방정식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "기하학적 정의에 따른 거리 등식 세우기",
        goal: "점 P(x,y)에서 초점 F까지의 거리 PF = 준선 x=-p 까지의 거리 PH 식을 세웁니다.",
        startExpr: "F(p, 0), \\quad \\text{준선 } l: x = -p, \\quad P(x, y)",
        targetExpr: "\\sqrt{(x - p)^2 + y^2} = |x - (-p)| = |x + p|",
        question: "점 P(x, y)에서 수직선 x = -p 에 내린 수선의 발 H까지의 거리는?",
        options: [
          {
            latex: "|x + p|",
            label: "x좌표의 차이의 절댓값이므로 |x - (-p)| = |x + p| 이다.",
            isCorrect: true,
            feedback: "맞습니다! 이제 양변을 제곱하여 근호(루트)와 절댓값을 벗깁니다."
          },
          {
            latex: "|y + p|",
            label: "y좌표의 차이이다.",
            isCorrect: false,
            feedback: "준선이 x = -p 이므로 수평 거리인 x좌표의 차이입니다."
          },
          {
            latex: "x - p",
            label: "절댓값 없이 x - p 이다.",
            isCorrect: false,
            feedback: "거리는 항상 양수이어야 하므로 절댓값이 붙고 x - (-p) = x + p 입니다."
          }
        ],
        aiGuidance: {
          hint: "양변을 제곱: (x - p)^2 + y^2 = (x + p)^2 을 전개해보세요.",
          why: "포물선 안테나, 전조등의 반사경이 평행 광선을 초점에 모으는 기하학적 원리입니다.",
          commonMistake: "초점이 y축 위 F(0, p)이고 준선이 y = -p 일 때는 x^2 = 4py 가 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "양변 제곱 후 전개하여 y^2 = 4px 도출",
        goal: "x^2 - 2px + p^2 + y^2 = x^2 + 2px + p^2 에서 동류항을 상쇄합니다.",
        startExpr: "x^2 - 2px + p^2 + y^2 = x^2 + 2px + p^2",
        targetExpr: "y^2 = 2px - (-2px) = 4px",
        question: "양변에서 x^2 과 p^2 을 소거하고 -2px를 우변으로 넘기면 남는 식은?",
        options: [
          {
            latex: "y^2 = 4px",
            label: "y^2 = 4px",
            isCorrect: true,
            feedback: "정답입니다! 이것이 꼭짓점이 원점 (0,0)이고 초점이 (p,0)인 포물선의 표준형 방정식입니다!"
          },
          {
            latex: "y^2 = 2px",
            label: "y^2 = 2px",
            isCorrect: false,
            feedback: "2px - (-2px) = 4px 입니다."
          },
          {
            latex: "x^2 + y^2 = 4p^2",
            label: "원의 방정식 형태가 된다.",
            isCorrect: false,
            feedback: "x^2은 양변에서 완전히 지워집니다."
          }
        ],
        aiGuidance: {
          hint: "초점 거리 p의 부호가 양수면 오른쪽으로 볼록, 음수면 왼쪽으로 열립니다.",
          why: "갈릴레오가 증명한 중력장 속 포사체 운동의 궤적이 바로 이 식을 따릅니다.",
          commonMistake: "꼭짓점의 좌표가 원점(0,0)인지 (h,k)로 평행이동되었는지 확인하세요."
        }
      }
    ]
  },
  {
    id: "hyperbola_standard_eq",
    title: "쌍곡선의 표준방정식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "기하",
    unit: "이차곡선 - 쌍곡선",
    latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 \\; (b^2 = c^2 - a^2)",
    coreConcept: "두 초점으로부터의 거리의 차가 일정한 점들의 자취",
    prerequisites: "두 점 사이의 거리 공식, 근호가 포함된 식의 양변 제곱",
    description: "두 초점 F(c, 0), F'(-c, 0)으로부터의 거리의 차가 2a로 일정한 점 P(x, y)의 자취로부터 쌍곡선 표준방정식을 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "거리의 차가 2a임을 나타내는 자취의 식 작성",
        goal: "|PF - PF'| = 2a 식을 세우고 루트를 이항하여 제곱합니다.",
        startExpr: "\\sqrt{(x + c)^2 + y^2} - \\sqrt{(x - c)^2 + y^2} = \\pm 2a",
        targetExpr: "cx - a^2 = \\pm a\\sqrt{(x - c)^2 + y^2}",
        question: "한쪽 루트를 우변으로 넘긴 뒤 양변을 제곱하여 정리하면 어떤 1차 정돈식이 나올까요?",
        options: [
          {
            latex: "cx - a^2 = a\\sqrt{(x - c)^2 + y^2}",
            label: "루트 항 하나만 우변에 남기고 좌변을 cx - a^2 으로 정리할 수 있다.",
            isCorrect: true,
            feedback: "맞습니다! 이제 한 번 더 양변을 제곱하여 남은 루트를 완전히 제거합니다."
          },
          {
            latex: "x^2 + y^2 = a^2 + c^2",
            label: "루트가 바로 다 벗겨져 원이 된다.",
            isCorrect: false,
            feedback: "제곱 시 교차항 2*루트*루트 가 생기므로 단번에 벗겨지지 않습니다."
          },
          {
            latex: "cx = a^2",
            label: "y가 완전히 사라진다.",
            isCorrect: false,
            feedback: "y항은 루트 안에 살아있습니다."
          }
        ],
        aiGuidance: {
          hint: "다시 양변을 제곱: (cx - a^2)^2 = a^2 [(x - c)^2 + y^2] 을 전개하여 묶으세요.",
          why: "원거리 항법 시스템(LORAN)과 GPS의 초정밀 위치 추적이 바로 두 기지국 신호의 시간 차(거리의 차)를 쌍곡선으로 교차시켜 작동합니다.",
          commonMistake: "타원은 거리의 합(c^2 = a^2 - b^2)이지만 쌍곡선은 거리의 차이므로 c > a 여서 b^2 = c^2 - a^2 입니다."
        }
      },
      {
        stepNumber: 2,
        title: "b^2 = c^2 - a^2 치환으로 쌍곡선 표준형 완성",
        goal: "(c^2 - a^2)x^2 - a^2 y^2 = a^2(c^2 - a^2) 양변을 a^2 b^2 으로 나눕니다.",
        startExpr: "(c^2 - a^2)x^2 - a^2 y^2 = a^2(c^2 - a^2), \\quad b^2 = c^2 - a^2",
        targetExpr: "b^2 x^2 - a^2 y^2 = a^2 b^2 \\iff \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
        question: "양변을 a^2 * b^2 으로 나누면 완성되는 식은?",
        options: [
          {
            latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
            label: "x^2/a^2 - y^2/b^2 = 1 (쌍곡선의 표준방정식)",
            isCorrect: true,
            feedback: "정답입니다! 타원(덧셈 +)과 완벽한 대칭을 이루는 뺄셈(-) 형태의 아름다운 쌍곡선 방정식입니다!"
          },
          {
            latex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
            label: "가운데 부호가 덧셈(+)이다.",
            isCorrect: false,
            feedback: "그것은 타원의 방정식입니다. 쌍곡선은 마이너스(-)입니다."
          },
          {
            latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1",
            label: "우변이 항상 -1이다.",
            isCorrect: false,
            feedback: "초점이 y축 위에 있을 때 우변이 -1이 됩니다."
          }
        ],
        aiGuidance: {
          hint: "점근선의 방정식은 y = ±(b/a)x 로 나타납니다.",
          why: "아인슈타인의 특수 상대성 이론에서 시공간 간격(ds^2 = -c^2 dt^2 + dx^2)도 쌍곡선 기하를 따릅니다.",
          commonMistake: "주축의 길이는 2a이고 꼭짓점의 좌표는 (±a, 0)입니다."
        }
      }
    ]
  },
  {
    id: "sphere_equation_space",
    title: "공간좌표에서 구의 방정식",
    curriculum: ["15개정", "22개정"],
    grade: "고3",
    subject: "기하",
    unit: "공간도형과 공간좌표 - 공간좌표",
    latex: "(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2",
    coreConcept: "3차원 피타고라스 정리(두 점 사이의 거리)와 중심에서의 등거리 자취",
    prerequisites: "공간좌표계, 3차원 두 점 사이의 거리 공식",
    description: "공간좌표에서 중심 C(a, b, c)로부터 일정 거리 r만큼 떨어진 점 P(x, y, z)의 자취를 3차원 피타고라스 정리로 유도합니다.",
    steps: [
      {
        stepNumber: 1,
        title: "직육면체 대각선 길이를 이용한 3차원 거리 공식 세우기",
        goal: "점 C(a, b, c)와 P(x, y, z) 사이의 거리 CP = r 식을 세웁니다.",
        startExpr: "C(a, b, c), \\quad P(x, y, z)",
        targetExpr: "CP = \\sqrt{(x - a)^2 + (y - b)^2 + (z - c)^2} = r",
        question: "3차원 공간에서 가로, 세로, 높이의 차이가 각각 (x-a), (y-b), (z-c)인 직육면체의 대각선 길이는?",
        options: [
          {
            latex: "\\sqrt{(x - a)^2 + (y - b)^2 + (z - c)^2}",
            label: "피타고라스 정리를 두 번 적용하여 세 좌표 차이 제곱의 합의 제곱근이다.",
            isCorrect: true,
            feedback: "맞습니다! 바닥면 대각선 √(Δx^2 + Δy^2)과 높이 Δz로 다시 피타고라스 정리를 씁니다."
          },
          {
            latex: "(x - a) + (y - b) + (z - c)",
            label: "단순히 세 좌표의 차이를 더한다.",
            isCorrect: false,
            feedback: "직각삼각형의 빗변이므로 제곱의 합의 루트입니다."
          },
          {
            latex: "\\sqrt{(x - a)^2 + (y - b)^2}",
            label: "2차원 평면 거리와 같다.",
            isCorrect: false,
            feedback: "3차원이므로 z좌표 차이 (z-c)^2 도 포함되어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "양변을 제곱하면 근호가 벗겨지며 구의 표준방정식이 바로 탄생합니다.",
          why: "2차원의 원 (x-a)^2 + (y-b)^2 = r^2 이 3차원으로 자연스럽게 1차원 확장된 형태입니다.",
          commonMistake: "구와 xy평면이 만나는 교선(원)을 구할 때는 z=0 을 대입하면 됩니다."
        }
      },
      {
        stepNumber: 2,
        title: "양변을 제곱하여 구의 표준방정식 완성",
        goal: "(x-a)^2 + (y-b)^2 + (z-c)^2 = r^2 형태를 확정합니다.",
        startExpr: "\\sqrt{(x - a)^2 + (y - b)^2 + (z - c)^2} = r",
        targetExpr: "(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2",
        question: "양변을 제곱하여 완성된 3차원 공간의 구의 표준방정식은?",
        options: [
          {
            latex: "(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2",
            label: "중심이 (a,b,c)이고 반지름이 r인 구의 표준방정식이다.",
            isCorrect: true,
            feedback: "정답입니다! 이를 전개하면 x^2 + y^2 + z^2 + Ax + By + Cz + D = 0 인 구의 일반형이 됩니다!"
          },
          {
            latex: "(x - a)^3 + (y - b)^3 + (z - c)^3 = r^3",
            label: "3차원이므로 세제곱 형태이다.",
            isCorrect: false,
            feedback: "거리 공식은 피타고라스(제곱의 합)에 기반하므로 여전히 2차(제곱)입니다."
          },
          {
            latex: "(x - a)^2 + (y - b)^2 + (z - c)^2 = r",
            label: "우변이 r이다.",
            isCorrect: false,
            feedback: "양변을 제곱했으므로 우변은 r^2이 되어야 합니다."
          }
        ],
        aiGuidance: {
          hint: "중심이 원점 (0,0,0)이면 x^2 + y^2 + z^2 = r^2 이 됩니다.",
          why: "3D 게임 엔진, 컴퓨터 그래픽스 구형 충돌 감지(Sphere Collision)의 기본 수학 모델입니다.",
          commonMistake: "우변이 r^2임을 잊고 반지름을 r^2으로 오인하지 않도록 주의하세요."
        }
      }
    ]
  }
];
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MATH_FORMULAS };
}
