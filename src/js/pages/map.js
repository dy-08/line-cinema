var overlay;

window.addEventListener("DOMContentLoaded", () => {
  kakao.maps.load(function () {
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    var mapContainer = document.getElementById("map"), // 지도의 중심좌표
      mapOption = {
        center: new kakao.maps.LatLng(37.3179, 126.8361), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 지도에 마커를 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(37.3179, 126.8361),
    });

    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다
    var content =
      '<div class="wrap">' +
      '    <div class="info">' +
      '        <div class="title">' +
      "            LINE CINEMA" +
      '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
      "        </div>" +
      '        <div class="body">' +
      '            <div class="img">' +
      '                <img src="/public/img/ui/logo-b.png" width="73" height="70">' +
      "           </div>" +
      '            <div class="desc">' +
      '                <div class="ellipsis">경기도 안산시 단원구 고잔2길 45 <br/>코스모프라자 6층</div>' +
      '                <div class="jibun ellipsis">(우) 15360 (지번) 고잔동 535-2</div>' +
      "            </div>" +
      "        </div>" +
      "    </div>" +
      "</div>";

    // 마커 위에 커스텀오버레이를 표시합니다
    // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
    var overlay = new kakao.maps.CustomOverlay({
      content: content,
      map: map,
      position: marker.getPosition(),
    });

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, "click", function () {
      overlay.setMap(map);
    });

    // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다
    window.closeOverlay = function () {
      overlay.setMap(null);
    };

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
    // 사라짐
    // document.querySelector(".close").addEventListener("click", () => {
    //   document.querySelector(".wrap").style.display = "none";
    // });
  }); // kakao.maps.load 끝
});

// 날씨 api 시작
const apikey = "89d6c114ec7bbbfd4be0ebc38e323833";
const des = document.getElementById("map-weather-des");
const temp = document.getElementById("map-weather-temp");
const wind = document.getElementById("map-weather-wind");
const icon = document.getElementById("map-weather-icon");

navigator.geolocation.getCurrentPosition(
  () => {
    const lat = 37.3179; // 위도
    const lon = 126.8361; // 경도
    getWeather(lat, lon);
  },
  (error) => {
    const fallbackLat = 37.5665;
    const fallbackLon = 126.978;
    console.warn("위치 정보를 가져올 수 없어 서울로 설정합니다.");
    getWeather(fallbackLat, fallbackLon);
  }
);

let getWeather = async (lat, lon) => {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric&lang=kr`
  );
  let data = await res.json();

  des.textContent = data.weather[0].description; // 설명
  // temp.textContent = data.main.temp + " °C"; // 온도
  temp.textContent = Math.floor(data.main.temp) + " °C"; // 온도(소수점 제거)
  wind.innerHTML = `${data.wind.speed} m/s`;
  let iconNum = data.weather[0].icon;
  let iconSrc = `http://openweathermap.org/img/wn/${iconNum}@2x.png`;
  icon.setAttribute("src", iconSrc);
};

//
function updateTime() {
  let day = document.getElementById("map-day");
  let time = document.getElementById("map-time");

  let date = new Date();
  let a = date.getDate();
  let b = date.getMonth() + 1;
  let c = date.getFullYear();
  let d = date.getHours();
  let e = date.getMinutes();
  let f = date.getSeconds();

  if (f < 10) f = `0${f}`;

  day.textContent = `${c}년 ${b}월 ${a}일`;
  time.textContent = `${d}:${e}:${f}`;
}
updateTime();
setInterval(updateTime, 1000);
