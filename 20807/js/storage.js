/**
 * 학습 상태 관리자 (localStorage 기반)
 * 🟢 초록색 (유도 완료 - completed)
 * 🟠 주황색 (유도 진행 중 / 하다가 만 공식 - in_progress)
 * ⚪ 회색 (건들지도 않은 공식 - untouched)
 */

const STORAGE_KEYS = {
  PROGRESS: "math_derivation_progress_v2",
  INITIALIZED: "math_derivation_init_flag_v2"
};

const StudyStorage = {
  // 처음 상태로 깨끗하게 초기화 여부 체크 및 전체 상태 로드
  getAllProgress() {
    try {
      // 최초 실행 시 또는 명시적 초기화 후 깨끗한 상태 보장
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error("Failed to load progress from localStorage:", e);
      return {};
    }
  },

  // 특정 공식의 상태 가져오기 (기본값: untouched 회색)
  getFormulaState(id) {
    const all = this.getAllProgress();
    return all[id] || {
      status: "untouched", // 'untouched' (회색) | 'in_progress' (주황색) | 'completed' (초록색)
      currentStep: 1,
      startedAt: null,
      completedAt: null
    };
  },

  // 공식 유도 시작 (회색 -> 주황색 전환)
  startFormula(id) {
    const all = this.getAllProgress();
    const current = all[id] || {};
    
    // 이미 완료된 공식이 아니라면 in_progress로 설정
    if (current.status !== "completed") {
      all[id] = {
        status: "in_progress",
        currentStep: current.currentStep || 1,
        startedAt: current.startedAt || new Date().toISOString(),
        completedAt: null
      };
      this._saveAllProgress(all);
    }
    return all[id];
  },

  // 단계 진행 저장 (주황색 상태 유지 및 현재 스텝 기록)
  saveStep(id, stepNumber) {
    const all = this.getAllProgress();
    const current = all[id] || {};
    
    const status = current.status === "completed" ? "completed" : "in_progress";
    
    all[id] = {
      status: status,
      currentStep: Math.max(1, stepNumber),
      startedAt: current.startedAt || new Date().toISOString(),
      completedAt: current.completedAt || null
    };
    this._saveAllProgress(all);
    return all[id];
  },

  // 공식 유도 완료 (주황색 -> 초록색 전환 🎉)
  completeFormula(id) {
    const all = this.getAllProgress();
    const current = all[id] || {};
    
    all[id] = {
      status: "completed",
      currentStep: current.currentStep || 1,
      startedAt: current.startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    this._saveAllProgress(all);
    return all[id];
  },

  // 공식 초기화 (다시 풀기 또는 회색으로 초기화)
  resetFormula(id, backToUntouched = false) {
    const all = this.getAllProgress();
    if (backToUntouched) {
      delete all[id];
    } else {
      all[id] = {
        status: "in_progress",
        currentStep: 1,
        startedAt: new Date().toISOString(),
        completedAt: null
      };
    }
    this._saveAllProgress(all);
    return this.getFormulaState(id);
  },

  // 학습 통계 계산
  getStats(formulas) {
    const all = this.getAllProgress();
    let completed = 0;
    let inProgress = 0;
    let untouched = 0;

    formulas.forEach(f => {
      const state = all[f.id];
      if (!state || state.status === "untouched") {
        untouched++;
      } else if (state.status === "completed") {
        completed++;
      } else if (state.status === "in_progress") {
        inProgress++;
      } else {
        untouched++;
      }
    });

    const total = formulas.length;
    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      untouched,
      completedPct,
      inProgressPct
    };
  },

  // 전체 학습 데이터 초기화 (모두 회색 미시작 상태로 리셋)
  clearAllProgress() {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem("math_derivation_progress_v1");
    localStorage.removeItem("math_derivation_notes_v1");
    localStorage.removeItem("math_derivation_settings_v1");
    // 상태 변경 이벤트 발송
    window.dispatchEvent(new CustomEvent("math_progress_updated", { detail: {} }));
  },

  _saveAllProgress(all) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent("math_progress_updated", { detail: all }));
    } catch (e) {
      console.error("Failed to save progress to localStorage:", e);
    }
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { StudyStorage };
}
