// mapPage.js
export async function initMapPage() {
    // 라우터가 이미 해당 페이지의 HTML을 렌더링한 뒤에 호출된다는 전제
    const kakao = await ensureKakaoLoaded(); // SDK 로드 보장
    const mapEl = document.getElementById('map');
    if (!mapEl) return; // 해당 페이지가 아닐 때 가드

    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    const map = new kakao.maps.Map(mapEl, {
        center: new kakao.maps.LatLng(37.3179, 126.8361),
        level: 3,
    });

    // 메인 마커
    const mainPos = new kakao.maps.LatLng(37.3179, 126.8361);
    const mainMarker = new kakao.maps.Marker({ map, position: mainPos });

    // 커스텀 오버레이
    const content =
        '<div class="wrap">' +
        '  <div class="info">' +
        '    <div class="title">LINE CINEMA' +
        '      <div class="close" onclick="window.closeOverlay()" title="닫기"></div>' +
        '    </div>' +
        '    <div class="body">' +
        '      <div class="img"><img src="/public/img/ui/logo-b.png" width="73" height="70"></div>' +
        '      <div class="desc">' +
        '        <div class="ellipsis">경기도 안산시 단원구 고잔2길 45 <br/>코스모프라자 6층</div>' +
        '        <div class="jibun ellipsis">(우) 15360 (지번) 고잔동 535-2</div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    const overlay = new kakao.maps.CustomOverlay({
        content,
        position: mainMarker.getPosition(),
    });

    kakao.maps.event.addListener(mainMarker, 'click', () => overlay.setMap(map));
    window.closeOverlay = () => overlay.setMap(null); // 전역에 붙여서 onclick에서 접근 가능

    // 장소검색
    const ps = new kakao.maps.services.Places();
    const markers = [];

    function clearMarkers() {
        while (markers.length) markers.pop().setMap(null);
    }

    function displayMarker(place) {
        const m = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(place.y, place.x),
        });
        kakao.maps.event.addListener(m, 'click', () => {
            infowindow.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`);
            infowindow.open(map, m);
        });
        markers.push(m);
    }

    function placesSearchCB(data, status) {
        if (status !== kakao.maps.services.Status.OK) return;
        clearMarkers();
        const bounds = new kakao.maps.LatLngBounds();
        data.forEach((p) => {
            displayMarker(p);
            bounds.extend(new kakao.maps.LatLng(p.y, p.x));
        });
        map.setBounds(bounds);
    }

    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

    const searchBtn = document.getElementById('searchBtn');
    const keywordInput = document.getElementById('keyword');
    if (searchBtn && keywordInput) {
        searchBtn.addEventListener('click', () => {
            const kw = keywordInput.value.trim();
            if (kw) ps.keywordSearch(kw, placesSearchCB);
            else alert('검색어를 입력해주세요');
        });
    }

    document.querySelectorAll('.map-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const kw = btn.getAttribute('data-keyword');
            if (!kw) return;
            if (keywordInput) keywordInput.value = kw;
            ps.keywordSearch(kw, placesSearchCB);
        });
    });

    initWeatherWidgets();
    initClock();
}

function ensureKakaoLoaded() {
    return new Promise((resolve, reject) => {
        const w = window;
        if (w.kakao && w.kakao.maps) {
            w.kakao.maps.load(() => resolve(w.kakao));
            return;
        }
        if (w.kakao && w.kakao.maps) {
            w.kakao.maps.load(() => resolve(w.kakao));
        } else {
            const src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services&autoload=false';
            const el = document.createElement('script');
            el.src = src;
            el.onload = () => w.kakao.maps.load(() => resolve(w.kakao));
            el.onerror = reject;
            document.head.appendChild(el);
        }
    });
}

/** 날씨 위젯 */
function initWeatherWidgets() {
    const apikey = '89d6c114ec7bbbfd4be0ebc38e323833';
    const des = document.getElementById('map-weather-des');
    const temp = document.getElementById('map-weather-temp');
    const wind = document.getElementById('map-weather-wind');
    const icon = document.getElementById('map-weather-icon');

    if (!des || !temp || !wind || !icon) return; // 해당 DOM이 없으면 스킵

    const getWeather = async (lat, lon) => {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric&lang=kr`
        );
        const data = await res.json();
        des.textContent = data.weather?.[0]?.description ?? '';
        temp.textContent = `${Math.floor(data.main?.temp ?? 0)} °C`;
        wind.textContent = `${data.wind?.speed ?? 0} m/s`;
        const iconNum = data.weather?.[0]?.icon;
        if (iconNum) {
            // ⚠️ 혼합콘텐츠 방지: http → https
            icon.setAttribute('src', `https://openweathermap.org/img/wn/${iconNum}@2x.png`);
        }
    };

    navigator.geolocation.getCurrentPosition(
        (pos) => getWeather(pos.coords.latitude, pos.coords.longitude),
        () => getWeather(37.5665, 126.978) // 서울
    );
}

/** 시계 */
function initClock() {
    const dayEl = document.getElementById('map-day');
    const timeEl = document.getElementById('map-time');
    if (!dayEl || !timeEl) return;

    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    const tick = () => {
        const d = new Date();
        dayEl.textContent = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
        timeEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
}
