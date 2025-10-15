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
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEYS.TMDB}&language=ko-KR`,
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
// https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg
function makeCard() {

  const rank = document.querySelector('.rank-movie');

  const div1 = document.createElement('div');
  div1.className = 'rank-movie-wrap';
  const div2 = document.createElement('div');
  div2.className = 'rank-movie-card';
  const img = document.createElement('img');
  img.src = './public/img/main/boss.jpg';
  const div3 = document.createElement('div');
  div3.className = 'rank-btn-wrap';
  const button1 = document.createElement('button');
  button1.className = 'rank-btns';
  button1.innerText = '예매하기';
  const button2 = document.createElement('button');
  button2.className = 'rank-btns';
  button2.innerText = '상세정보';


  div3.appendChild(button1);
  div3.appendChild(button2);
  div2.appendChild(img);
  div2.appendChild(div3);
  div1.appendChild(div2);
  rank.appendChild(div1);
}
// makeCard();
