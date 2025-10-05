import { API_KEYS } from '../config/config.js'; // 키 요청

// 네비게이션 hover 효과
const navi = document.querySelectorAll('.header-navi-main');
let current = '';
navi.forEach((item) => {
  item.addEventListener('mouseover', () => {
    if (current) {
      current.classList.remove('selected');
      current = item.nextElementSibling;
      current.classList.add('selected');
    }
    current = item.nextElementSibling;
    current.classList.add('selected');

    current.addEventListener('mouseleave', () => {
      current.classList.remove('selected');
    });
  });
});

// TMDB API 테스트 코드
// console.log(API_KEYS); // 키 응답
async function tmdb() {
  try {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    // v3
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEYS.TMDB}&language=ko-KR`,
      options
    );
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
tmdb();

// 지유님: 슬라이더 작업섹션

// 철원님: 랭킹 작업섹션
