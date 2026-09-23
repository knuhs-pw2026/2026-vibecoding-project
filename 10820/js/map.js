/**
 * 지도 관리 모듈 (Map Module)
 * Leaflet.js 기반 지도 생성, 커스텀 마커, 반경 원, 위치 펄스 애니메이션 제어
 */

const MapModule = (() => {
  let map = null;
  let tileLayer = null;
  let userMarker = null;
  let radiusCircle = null;
  const markersMap = new Map(); // id -> leaflet marker
  let activeMarkerId = null;

  // 타일 URL 정의 (한국 오픈스트리트맵 tiles.osm.kr)
  const OSM_KR_TILE_URL = "https://tiles.osm.kr/hot/{z}/{x}/{y}.png";
  const OSM_KR_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | <a href="https://osm.kr" target="_blank">OSM Korea</a>';

  /**
   * 지도 초기화
   * @param {number} lat 초기 위도
   * @param {number} lng 초기 경도
   * @param {string} theme 테마 ('dark' 또는 'light')
   */
  function init(lat, lng, theme = "dark") {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    // Leaflet 맵 객체 생성
    map = L.map("map", {
      center: [lat, lng],
      zoom: 15,
      minZoom: 7,
      maxZoom: 20,
      zoomControl: false // 커스텀 버튼 사용
    });

    // 베이스 타일 레이어 추가 (tiles.osm.kr)
    tileLayer = L.tileLayer(OSM_KR_TILE_URL, {
      attribution: OSM_KR_ATTRIBUTION,
      maxZoom: 20,
      maxNativeZoom: 20,
      minZoom: 7
    }).addTo(map);

    // 사용자 위치 펄스 마커 초기화
    updateUserPosition(lat, lng);
  }

  /**
   * 테마 변경에 따른 타일 스타일/레이어 업데이트
   */
  function setTileTheme(theme) {
    if (!map) return;
    // tiles.osm.kr 타일 유지 (한국 특화 OSM 지도)
    const mapEl = document.getElementById("map");
    if (mapEl) {
      if (theme === "dark") {
        mapEl.classList.add("dark-map-tiles");
      } else {
        mapEl.classList.remove("dark-map-tiles");
      }
    }
  }

  /**
   * 사용자 위치 핀 및 펄스 업데이트
   */
  function updateUserPosition(lat, lng, radiusMeters = 500) {
    if (!map) return;

    // 기존 사용자 마커 제거 후 재생성
    if (userMarker) {
      map.removeLayer(userMarker);
    }

    const userHtml = `
      <div class="user-location-marker">
        <div class="user-marker-pulse"></div>
        <div class="user-marker-core"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: "custom-user-div-icon",
      html: userHtml,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    userMarker = L.marker([lat, lng], {
      icon: userIcon,
      zIndexOffset: 1000
    }).addTo(map);

    // 반경 가이드 원 업데이트
    updateRadiusCircle(lat, lng, radiusMeters);
  }

  /**
   * 탐색 반경 원(Circle) 업데이트
   */
  function updateRadiusCircle(lat, lng, radiusMeters) {
    if (!map) return;

    if (radiusCircle) {
      map.removeLayer(radiusCircle);
      radiusCircle = null;
    }

    if (radiusMeters && radiusMeters > 0) {
      radiusCircle = L.circle([lat, lng], {
        radius: radiusMeters,
        color: "#2563eb",
        weight: 1.5,
        opacity: 0.5,
        fillColor: "#3b82f6",
        fillOpacity: 0.08,
        dashArray: "4, 6"
      }).addTo(map);
    }
  }

  /**
   * 와이파이 마커 렌더링
   * @param {Array} wifiList 표시할 와이파이 목록
   * @param {Function} onMarkerClick 마커 클릭 시 콜백
   */
  function renderMarkers(wifiList, onMarkerClick) {
    if (!map) return;

    // 기존 마커 전체 제거
    markersMap.forEach(marker => map.removeLayer(marker));
    markersMap.clear();

    const categoryIconMap = {
      public: "fa-building-columns",
      library: "fa-book-open",
      subway: "fa-train-subway",
      park: "fa-tree",
      tourist: "fa-landmark",
      welfare: "fa-hands-holding-circle"
    };

    wifiList.forEach(item => {
      const iconName = categoryIconMap[item.category] || "fa-wifi";
      const markerHtml = `
        <div class="custom-wifi-marker cat-${item.category}" id="marker-${item.id}" title="${item.name}">
          <i class="fa-solid ${iconName}"></i>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-wifi-div-icon",
        html: markerHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });

      // 커스텀 팝업 HTML 생성
      const popupHtml = `
        <div class="popup-inner">
          <div class="popup-header">
            <span class="card-category-badge"><i class="fa-solid ${iconName}"></i> ${item.categoryName}</span>
            <span class="ssid-tag"><i class="fa-solid fa-wifi"></i> 무료</span>
          </div>
          <div class="popup-title">${item.name}</div>
          <div class="popup-address"><i class="fa-solid fa-location-dot"></i> ${item.address}</div>
          <div class="popup-detail">${item.detailLocation}</div>
          <div class="popup-actions">
            <button class="btn-popup secondary" onclick="App.copySsid('${item.ssid}')">
              <i class="fa-regular fa-copy"></i> SSID 복사
            </button>
            <button class="btn-popup primary" onclick="App.openDetailModal('${item.id}')">
              <i class="fa-solid fa-circle-info"></i> 상세정보
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 320,
        className: "custom-leaflet-popup"
      });

      marker.on("click", () => {
        if (onMarkerClick) onMarkerClick(item);
      });

      marker.addTo(map);
      markersMap.set(item.id, marker);
    });
  }

  /**
   * 특정 마커 강조 및 지도 이동
   */
  function highlightMarker(id, lat, lng, zoom = 16) {
    if (!map) return;

    // 이전 활성화 마커 스타일 복원
    if (activeMarkerId) {
      const prevEl = document.getElementById(`marker-${activeMarkerId}`);
      if (prevEl) prevEl.classList.remove("active-pin");
    }

    activeMarkerId = id;
    const curEl = document.getElementById(`marker-${id}`);
    if (curEl) curEl.classList.add("active-pin");

    map.flyTo([lat, lng], zoom, {
      duration: 0.8,
      easeLinearity: 0.25
    });

    const marker = markersMap.get(id);
    if (marker) {
      marker.openPopup();
    }
  }

  /**
   * 지도 뷰를 특정 좌표로 이동
   */
  function panTo(lat, lng, zoom = 15) {
    if (!map) return;
    map.flyTo([lat, lng], zoom, { duration: 0.8 });
  }

  /**
   * 모든 마커를 화면에 맞게 맞춤
   */
  function fitBounds() {
    if (!map || markersMap.size === 0) return;
    const group = L.featureGroup(Array.from(markersMap.values()));
    map.fitBounds(group.getBounds().pad(0.1));
  }

  function zoomIn() {
    if (map) map.zoomIn();
  }

  function zoomOut() {
    if (map) map.zoomOut();
  }

  return {
    init,
    setTileTheme,
    updateUserPosition,
    updateRadiusCircle,
    renderMarkers,
    highlightMarker,
    panTo,
    fitBounds,
    zoomIn,
    zoomOut
  };
})();
