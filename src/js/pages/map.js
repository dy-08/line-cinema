window.addEventListener("DOMContentLoaded", () => {
  kakao.maps.load(function () {
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new kakao.maps.LatLng(37.3179, 126.8361),
      level: 3,
    };

    // 지도 생성
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 중심 마커 (항상 표시)
    const centerPosition = new kakao.maps.LatLng(37.3179, 126.8361);
    const centerMarker = new kakao.maps.Marker({
      position: centerPosition,
    });
    centerMarker.setMap(map);

    // 장소 검색 객체
    const ps = new kakao.maps.services.Places();

    // 검색 결과 마커들을 저장할 배열
    let markers = [];

    // 검색 콜백 함수
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 이전 마커들 제거
        removeMarkers();

        const bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          const marker = displayMarker(data[i]);
          markers.push(marker); // 새로 만든 마커 배열에 저장
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 지도 범위 재설정
        map.setBounds(bounds);
      }
    }

    // 마커 표시 함수
    function displayMarker(place) {
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`
        );
        infowindow.open(map, marker);
      });

      return marker;
    }

    // 마커 제거 함수
    function removeMarkers() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // 교통정보 오버레이 추가
    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

    // 검색 버튼 클릭 시
    document.getElementById("searchBtn").addEventListener("click", function () {
      const keyword = document.getElementById("keyword").value.trim();
      if (keyword) {
        ps.keywordSearch(keyword, placesSearchCB);
      } else {
        alert("검색어를 입력해주세요");
      }
    });

    // 추천 버튼들 클릭 시
    const btns = document.querySelectorAll(".map-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const kw = btn.getAttribute("data-keyword");
        document.getElementById("keyword").value = kw;
        ps.keywordSearch(kw, placesSearchCB);
      });
    });
  }); // kakao.maps.load 끝
});
