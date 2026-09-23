/**
 * 애플리케이션 코어 로직 (WiFiSpot App)
 * 위치 추적, 거리 계산(Haversine), 검색/필터링/정렬, 상세정보 모달, 클립보드 복사
 */

const App = (() => {
  // 기본 좌표: 강남역 (위치 권한 미허용 또는 초기 로딩용)
  const DEFAULT_COORDS = { lat: 37.498085, lng: 127.027582, name: "강남역" };

  // 상태 관리
  const state = {
    userLat: DEFAULT_COORDS.lat,
    userLng: DEFAULT_COORDS.lng,
    isGpsActive: false,
    selectedRegion: "all", // all, seoul, gyeonggi, busan, daegu, daejeon, gwangju, gangwon, jeju
    selectedCategory: "all",
    selectedRadius: 0, // 기본 0: 대한민국 전국 전체
    sortOption: "distance", // distance | name
    searchQuery: "",
    selectedWifiId: null,
    theme: localStorage.getItem("wifispot_theme") || "dark",
    bookmarks: JSON.parse(localStorage.getItem("wifispot_bookmarks") || "[]")
  };

  /**
   * 앱 초기화
   */
  function init() {
    applyTheme(state.theme);
    setupEventListeners();

    // 맵 초기화
    MapModule.init(state.userLat, state.userLng, state.theme);

    // 사용자 위치 획득 시도 (거부 시 기본 좌표 유지)
    requestUserLocation(false);

    // 초기 데이터 렌더링
    updateListAndMap();
  }

  /**
   * 테마 적용
   */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wifispot_theme", theme);

    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === "dark" 
        ? '<i class="fa-regular fa-sun"></i>' 
        : '<i class="fa-regular fa-moon"></i>';
      themeToggleBtn.title = theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";
    }

    MapModule.setTileTheme(theme);
  }

  /**
   * 테마 토글
   */
  function toggleTheme() {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  }

  /**
   * Haversine 공식을 사용한 정밀 두 지점 간 거리(m) 계산
   */
  function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 지구 반경 (미터)
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  /**
   * 거리 텍스트 포맷 (예: 450m, 1.2km)
   */
  function formatDistance(meters) {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  /**
   * 도보 예상 시간 (분) 계산 (성인 평균 보행 속도 4.8km/h = 분당 80m)
   */
  function formatWalkingTime(meters) {
    const minutes = Math.max(1, Math.ceil(meters / 80));
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainMin = minutes % 60;
      return `도보 ${hours}시간 ${remainMin}분`;
    }
    return `도보 ${minutes}분`;
  }

  /**
   * GPS를 통한 사용자 위치 획득
   */
  function requestUserLocation(showToastOnSuccess = true) {
    const locBtns = [
      document.getElementById("btn-my-location"),
      document.getElementById("btn-fab-location")
    ];

    locBtns.forEach(btn => btn && btn.classList.add("locating"));

    if (!navigator.geolocation) {
      showToast("이 브라우저는 위치 서비스를 지원하지 않습니다.", "warning");
      locBtns.forEach(btn => btn && btn.classList.remove("locating"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.userLat = position.coords.latitude;
        state.userLng = position.coords.longitude;
        state.isGpsActive = true;

        locBtns.forEach(btn => btn && btn.classList.remove("locating"));

        MapModule.updateUserPosition(state.userLat, state.userLng, state.selectedRadius);
        MapModule.panTo(state.userLat, state.userLng, 15);

        updateListAndMap();

        if (showToastOnSuccess) {
          showToast("현재 위치를 성공적으로 찾았습니다!", "success");
        }
      },
      (error) => {
        locBtns.forEach(btn => btn && btn.classList.remove("locating"));
        console.warn("Geolocation warning:", error.message);
        if (showToastOnSuccess) {
          showToast("위치 권한을 확인할 수 없어 기본 위치로 표시합니다.", "warning");
        }
        // 기본 위치로 맵 갱신
        MapModule.updateUserPosition(state.userLat, state.userLng, state.selectedRadius);
        updateListAndMap();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  }

  /**
   * 필터링, 검색, 정렬된 와이파이 목록 산출
   * - 검색어 입력 시 반경 제한 없이 전국 범위에서 탐색
   */
  function getProcessedWifiList() {
    const hasSearch = state.searchQuery.trim().length > 0;
    const normalizedQuery = state.searchQuery.trim().toLowerCase().replace(/\s+/g, "");

    return PUBLIC_WIFI_DATA
      .map(item => {
        const distance = calcDistance(state.userLat, state.userLng, item.lat, item.lng);
        return {
          ...item,
          distance,
          distanceFormatted: formatDistance(distance),
          walkingTime: formatWalkingTime(distance)
        };
      })
      .filter(item => {
        // 1. 지역 필터 (전국 전체가 아닐 때)
        if (state.selectedRegion !== "all" && item.region !== state.selectedRegion) {
          return false;
        }

        // 2. 검색어 필터 (검색어가 있을 경우 전국 단위 검색 및 다중 필드 매칭)
        if (hasSearch) {
          const matchTarget = `${item.name}${item.address}${item.detailLocation}${item.provider}${item.categoryName}${item.regionName}${item.ssid}`.toLowerCase().replace(/\s+/g, "");
          if (!matchTarget.includes(normalizedQuery)) {
            return false;
          }
        } else {
          // 검색어가 없을 때만 반경 필터 적용 (0이면 전체)
          if (state.selectedRadius > 0 && item.distance > state.selectedRadius) {
            return false;
          }
        }

        // 3. 카테고리 필터
        if (state.selectedCategory !== "all" && item.category !== state.selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 정렬 기준
        if (state.sortOption === "distance") {
          return a.distance - b.distance;
        } else if (state.sortOption === "name") {
          return a.name.localeCompare(b.name, "ko");
        }
        return 0;
      });
  }

  /**
   * 목록 및 지도 마커 동기화 갱신
   */
  function updateListAndMap() {
    const processedList = getProcessedWifiList();

    // 1. 카운트 뱃지 갱신
    const countEl = document.getElementById("search-count");
    if (countEl) {
      countEl.textContent = processedList.length;
    }

    // 2. 사이드바 목록 렌더링
    renderWifiList(processedList);

    // 3. 지도 마커 렌더링
    MapModule.renderMarkers(processedList, (clickedItem) => {
      selectWifiItem(clickedItem.id, false);
    });

    // 4. 상태 필 텍스트 갱신
    updateStatusPill(processedList.length);
  }

  /**
   * 지도 상단/하단 상태 필 텍스트 갱신
   */
  function updateStatusPill(count) {
    const pill = document.getElementById("map-status-pill");
    if (!pill) return;

    let text = "";
    if (state.searchQuery.trim() !== "") {
      text = `'<strong>${state.searchQuery}</strong>' 검색 결과 <strong>${count}개</strong>`;
    } else if (state.selectedRegion !== "all") {
      const regObj = (typeof REGIONS !== "undefined" ? REGIONS : []).find(r => r.id === state.selectedRegion);
      const regName = regObj ? regObj.name : "지역";
      text = `${regName} 와이파이 <strong>${count}개</strong> 발견`;
    } else if (state.selectedRadius === 0) {
      text = `대한민국 전국 <strong>${count}개</strong> 와이파이 탐색 중`;
    } else {
      text = `반경 ${formatDistance(state.selectedRadius)} 내 <strong>${count}개</strong> 와이파이`;
    }

    pill.innerHTML = `
      <span class="indicator-dot"></span>
      <span>${text}</span>
    `;
  }

  /**
   * 검색 실행 및 지명/장소 이동 처리
   */
  function handleSearchSubmit() {
    const query = state.searchQuery.trim();
    if (!query) {
      showToast("검색어를 입력해 주세요.", "warning");
      return;
    }

    const list = getProcessedWifiList();
    if (list.length > 0) {
      // 1. 등록된 와이파이 결과가 있으면 첫 번째 위치로 지도 이동 및 팝업 오픈
      const firstItem = list[0];
      selectWifiItem(firstItem.id, true);
      showToast(`'${query}' 검색 결과 ${list.length}곳을 찾았습니다.`, "success");
    } else {
      // 2. 와이파이 목록에 직접 없으면 한국 지명/주소(Nominatim) 검색으로 지도 이동
      showToast(`'${query}' 위치를 검색 중입니다...`, "info");
      fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=kr&limit=1&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const place = data[0];
            const lat = parseFloat(place.lat);
            const lng = parseFloat(place.lon);
            state.userLat = lat;
            state.userLng = lng;
            state.selectedRegion = "all";

            // 전국 칩 활성화
            document.querySelectorAll(".region-chip").forEach(c => c.classList.remove("active"));
            const allChip = document.querySelector('.region-chip[data-region="all"]');
            if (allChip) allChip.classList.add("active");

            MapModule.updateUserPosition(lat, lng, state.selectedRadius);
            MapModule.panTo(lat, lng, 15);

            state.searchQuery = "";
            const inputEl = document.getElementById("search-input");
            if (inputEl) inputEl.value = "";
            const clearEl = document.getElementById("search-clear");
            if (clearEl) clearEl.style.display = "none";

            updateListAndMap();
            showToast(`'${place.display_name.split(",")[0]}' 위치로 지도를 이동했습니다.`, "success");
          } else {
            showToast(`'${query}' 관련 와이파이를 찾을 수 없습니다.`, "warning");
          }
        })
        .catch(() => {
          showToast(`'${query}' 관련 와이파이를 찾을 수 없습니다.`, "warning");
        });
    }
  }

  /**
   * 사이드바 와이파이 카드 리스트 렌더링
   */
  function renderWifiList(list) {
    const container = document.getElementById("wifi-list-container");
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-wifi"></i>
          <h4>주변에 와이파이가 없습니다</h4>
          <p>검색 반경을 넓히거나 다른 검색어를 입력해 보세요.</p>
        </div>
      `;
      return;
    }

    const categoryIconMap = {
      public: "fa-building-columns",
      library: "fa-book-open",
      subway: "fa-train-subway",
      park: "fa-tree",
      tourist: "fa-landmark",
      welfare: "fa-hands-holding-circle"
    };

    container.innerHTML = list.map(item => {
      const isSelected = item.id === state.selectedWifiId;
      const isBookmarked = state.bookmarks.includes(item.id);
      const icon = categoryIconMap[item.category] || "fa-wifi";

      return `
        <article class="wifi-card ${isSelected ? 'selected' : ''}" 
                 id="card-${item.id}"
                 onclick="App.selectWifiItem('${item.id}', true)">
          <div class="card-top">
            <span class="card-category-badge">
              <i class="fa-solid ${icon}"></i> ${item.categoryName}
            </span>
            <div class="card-dist-box">
              <span class="card-distance">
                <i class="fa-solid fa-person-walking"></i> ${item.distanceFormatted}
              </span>
              <span class="card-walking-time">${item.walkingTime}</span>
            </div>
          </div>

          <h3 class="card-title">${item.name}</h3>

          <div class="card-address">
            <i class="fa-solid fa-location-dot"></i>
            <span>${item.address}</span>
          </div>

          <div class="card-detail-loc">
            ${item.detailLocation}
          </div>

          <div class="card-footer">
            <div class="ssid-badge-group">
              <span class="ssid-tag">
                <i class="fa-solid fa-wifi"></i> ${item.ssid}
              </span>
            </div>

            <div class="card-actions" onclick="event.stopPropagation()">
              <button class="btn-card-action" onclick="App.copySsid('${item.ssid}')" title="와이파이 이름 복사">
                <i class="fa-regular fa-copy"></i> 복사
              </button>
              <button class="btn-card-action" onclick="App.toggleBookmark('${item.id}')" title="북마크 저장">
                <i class="${isBookmarked ? 'fa-solid text-warning' : 'fa-regular'} fa-bookmark"></i>
              </button>
              <button class="btn-card-action" onclick="App.openDetailModal('${item.id}')" title="상세 정보">
                <i class="fa-solid fa-circle-info"></i> 상세
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /**
   * 특정 와이파이 항목 선택 (카드 하이라이트 & 지도 이동)
   */
  function selectWifiItem(id, moveMap = true) {
    state.selectedWifiId = id;

    // 카드 스타일 업데이트
    document.querySelectorAll(".wifi-card").forEach(c => c.classList.remove("selected"));
    const targetCard = document.getElementById(`card-${id}`);
    if (targetCard) {
      targetCard.classList.add("selected");
      targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // 지도 이동 및 핀 하이라이트
    const item = PUBLIC_WIFI_DATA.find(w => w.id === id);
    if (item && moveMap) {
      MapModule.highlightMarker(id, item.lat, item.lng, 17);
    }
  }

  /**
   * SSID 클립보드 복사
   */
  function copySsid(ssid) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ssid).then(() => {
        showToast(`SSID "${ssid}" 복사 완료! 와이파이 설정에서 연결하세요.`, "success");
      }).catch(() => {
        fallbackCopyText(ssid);
      });
    } else {
      fallbackCopyText(ssid);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      showToast(`SSID "${text}" 복사 완료!`, "success");
    } catch (err) {
      showToast("클립보드 복사에 실패했습니다.", "warning");
    }
    document.body.removeChild(textArea);
  }

  /**
   * 북마크 토글
   */
  function toggleBookmark(id) {
    const index = state.bookmarks.indexOf(id);
    if (index > -1) {
      state.bookmarks.splice(index, 1);
      showToast("즐겨찾기에서 제거되었습니다.", "info");
    } else {
      state.bookmarks.push(id);
      showToast("즐겨찾기에 등록되었습니다.", "success");
    }
    localStorage.setItem("wifispot_bookmarks", JSON.stringify(state.bookmarks));
    renderWifiList(getProcessedWifiList());
  }

  /**
   * 상세정보 모달 열기
   */
  function openDetailModal(id) {
    const item = PUBLIC_WIFI_DATA.find(w => w.id === id);
    if (!item) return;

    const modalBackdrop = document.getElementById("detail-modal");
    const modalContent = document.getElementById("modal-dynamic-content");
    if (!modalBackdrop || !modalContent) return;

    const distance = calcDistance(state.userLat, state.userLng, item.lat, item.lng);
    const distFormatted = formatDistance(distance);
    const walkingTime = formatWalkingTime(distance);

    // 길찾기 외부 링크 생성
    const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(item.name)},${item.lat},${item.lng}`;
    const naverMapUrl = `https://map.naver.com/v5/directions/-/-/-/transit?c=${item.lng},${item.lat},15,0,0,0,dh`;

    modalContent.innerHTML = `
      <div class="info-grid">
        <div class="info-item full-width">
          <div class="info-item-label">설치 장소명</div>
          <div class="info-item-val" style="font-size: 1.15rem; color: var(--primary);">
            <i class="fa-solid fa-wifi"></i> ${item.name}
          </div>
        </div>

        <div class="info-item">
          <div class="info-item-label">내 위치와의 거리</div>
          <div class="info-item-val" style="color: var(--accent-cyan);">
            <i class="fa-solid fa-person-walking"></i> ${distFormatted} (${walkingTime})
          </div>
        </div>

        <div class="info-item">
          <div class="info-item-label">구분 / 환경</div>
          <div class="info-item-val">
            <span class="card-category-badge">${item.categoryName}</span>
            <span class="card-category-badge">${item.indoorOutdoor}</span>
          </div>
        </div>

        <div class="info-item full-width">
          <div class="info-item-label">도로명 주소</div>
          <div class="info-item-val">${item.address}</div>
        </div>

        <div class="info-item full-width">
          <div class="info-item-label">상세 설치 위치</div>
          <div class="info-item-val">${item.detailLocation}</div>
        </div>

        <div class="info-item">
          <div class="info-item-label">기본 무료 SSID</div>
          <div class="info-item-val" style="color: var(--accent-green);">
            ${item.ssid}
          </div>
        </div>

        <div class="info-item">
          <div class="info-item-label">보안 접속 SSID</div>
          <div class="info-item-val" style="color: var(--accent-purple);">
            ${item.ssidSecure}
          </div>
        </div>

        <div class="info-item">
          <div class="info-item-label">제공 통신사 / 기관</div>
          <div class="info-item-val">${item.provider}</div>
        </div>

        <div class="info-item">
          <div class="info-item-label">네트워크 스펙</div>
          <div class="info-item-val">${item.speed}</div>
        </div>
      </div>

      <div class="guide-box">
        <p><strong>💡 공공 와이파이 연결 가이드</strong></p>
        <p style="margin-top: 4px;">• <strong>일반 접속:</strong> Wi-Fi 목록에서 <code>${item.ssid}</code> 선택 후 브라우저에서 '무료 인터넷 연결' 클릭</p>
        <p style="margin-top: 2px;">• <strong>보안 접속:</strong> <code>${item.ssidSecure}</code> 선택 후 ID: <code>wifi</code> / 비밀번호: <code>wifi</code> 입력</p>
      </div>

      <div class="modal-footer" style="padding: 0; margin-top: 10px;">
        <button class="btn-primary-action" onclick="App.copySsid('${item.ssid}')">
          <i class="fa-regular fa-copy"></i> SSID 복사하기
        </button>
        <a href="${kakaoMapUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-action" style="flex:1; justify-content:center; text-decoration:none; padding:10px;">
          <i class="fa-solid fa-route"></i> 카카오맵 길찾기
        </a>
        <a href="${naverMapUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-action" style="flex:1; justify-content:center; text-decoration:none; padding:10px;">
          <i class="fa-solid fa-diamond-turn-right"></i> 네이버지도 길찾기
        </a>
      </div>
    `;

    modalBackdrop.classList.add("open");
  }

  /**
   * 모달 닫기
   */
  function closeModal() {
    const modalBackdrop = document.getElementById("detail-modal");
    if (modalBackdrop) {
      modalBackdrop.classList.remove("open");
    }
  }

  /**
   * 토스트 알림 표시
   */
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const iconMap = {
      success: "fa-circle-check",
      warning: "fa-triangle-exclamation",
      info: "fa-circle-info"
    };

    toast.innerHTML = `
      <i class="fa-solid ${iconMap[type] || 'fa-bell'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 3000);
  }

  /**
   * 이벤트 리스너 등록
   */
  function setupEventListeners() {
    // 1. 테마 토글
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    // 2. 내 위치 찾기 버튼들
    const locBtn = document.getElementById("btn-my-location");
    if (locBtn) locBtn.addEventListener("click", () => requestUserLocation(true));

    const fabLocBtn = document.getElementById("btn-fab-location");
    if (fabLocBtn) fabLocBtn.addEventListener("click", () => requestUserLocation(true));

    // 3. 지도 줌 버튼들
    const zoomInBtn = document.getElementById("btn-zoom-in");
    if (zoomInBtn) zoomInBtn.addEventListener("click", () => MapModule.zoomIn());

    const zoomOutBtn = document.getElementById("btn-zoom-out");
    if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => MapModule.zoomOut());

    const fitBoundsBtn = document.getElementById("btn-fit-bounds");
    if (fitBoundsBtn) fitBoundsBtn.addEventListener("click", () => MapModule.fitBounds());

    // 4. 검색창 입력, 엔터키, 제출 & 초기화
    const searchInput = document.getElementById("search-input");
    const searchClear = document.getElementById("search-clear");
    const searchSubmit = document.getElementById("search-submit");

    if (searchInput) {
      let debounceTimeout = null;
      searchInput.addEventListener("input", (e) => {
        const val = e.target.value;
        if (searchClear) {
          searchClear.style.display = val.length > 0 ? "block" : "none";
        }

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          state.searchQuery = val;
          updateListAndMap();
        }, 200);
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSearchSubmit();
        }
      });
    }

    if (searchSubmit) {
      searchSubmit.addEventListener("click", () => {
        handleSearchSubmit();
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        searchClear.style.display = "none";
        state.searchQuery = "";
        updateListAndMap();
        searchInput.focus();
      });
    }

    // 5. 전국 지역 선택 칩
    const regionChips = document.querySelectorAll(".region-chip");
    regionChips.forEach(chip => {
      chip.addEventListener("click", () => {
        regionChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.selectedRegion = chip.dataset.region;

        const regObj = (typeof REGIONS !== "undefined" ? REGIONS : []).find(r => r.id === chip.dataset.region);
        if (regObj) {
          MapModule.panTo(regObj.lat, regObj.lng, regObj.zoom);
          if (chip.dataset.region !== "all") {
            showToast(`'${regObj.name}' 지역 와이파이를 표시합니다.`, "info");
          } else {
            showToast("대한민국 전국 와이파이를 표시합니다.", "info");
          }
        }
        updateListAndMap();
      });
    });

    // 5. 반경 선택 드롭다운
    const radiusSelect = document.getElementById("radius-select");
    if (radiusSelect) {
      radiusSelect.value = state.selectedRadius.toString();
      radiusSelect.addEventListener("change", (e) => {
        state.selectedRadius = parseInt(e.target.value, 10);
        MapModule.updateRadiusCircle(state.userLat, state.userLng, state.selectedRadius);
        updateListAndMap();
      });
    }

    // 6. 카테고리 칩 선택
    const chips = document.querySelectorAll(".category-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.selectedCategory = chip.dataset.category;
        updateListAndMap();
      });
    });

    // 7. 정렬 버튼 토글
    const sortDistanceBtn = document.getElementById("sort-distance");
    const sortNameBtn = document.getElementById("sort-name");

    if (sortDistanceBtn && sortNameBtn) {
      sortDistanceBtn.addEventListener("click", () => {
        state.sortOption = "distance";
        sortDistanceBtn.classList.add("active");
        sortNameBtn.classList.remove("active");
        updateListAndMap();
      });

      sortNameBtn.addEventListener("click", () => {
        state.sortOption = "name";
        sortNameBtn.classList.add("active");
        sortDistanceBtn.classList.remove("active");
        updateListAndMap();
      });
    }

    // 8. 모달 닫기
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalBackdrop = document.getElementById("detail-modal");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    // ESC 키로 모달 닫기
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // 9. 모바일 시트 핸들 토글
    const sheetHandle = document.querySelector(".mobile-sheet-handle");
    const sidebar = document.getElementById("sidebar");
    if (sheetHandle && sidebar) {
      sheetHandle.addEventListener("click", () => {
        sidebar.classList.toggle("expanded");
      });
    }
  }

  return {
    init,
    selectWifiItem,
    copySsid,
    toggleBookmark,
    openDetailModal,
    closeModal,
    showToast
  };
})();

// DOM 준비 시 앱 실행
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
