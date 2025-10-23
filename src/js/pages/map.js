import { API_KEYS } from "../config/config.js";

kakao.maps.load(function () {
  var mapContainer = document.getElementById("map");
  var mapOption = {
    center: new kakao.maps.LatLng(37.3179, 126.8361),
    level: 3,
  };
  var map = new kakao.maps.Map(mapContainer, mapOption);
  // 마커가 표시될 위치입니다
  var markerPosition = new kakao.maps.LatLng(37.3179, 126.8361);

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: markerPosition,
  });

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);

  // 아래 코드는 지도 위의 마커를 제거하는 코드입니다
  // marker.setMap(null)

  // 지도에 교통정보를 표시하도록 지도타입을 추가합니다
  map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
});
