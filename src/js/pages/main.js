import { API_KEYS } from '../config/config.js'; // 키 요청
import { eventNow } from './eventnow.js';
import { premiere } from './premiere.js';

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

async function renderPage(data) {
  document.getElementById('app').innerHTML = await data;
}
async function fetchPage(page) {
  try {
    const res = await fetch(`./src/html/${page}.html`);
    if (!res.ok) throw new Error('page is not found');
    const data = await res.text();
    return data;
  } catch (error) {
    console.error('fetchPageError:', error.message);
  }
}
document.querySelectorAll('.header-navi-sub').forEach((item) =>
  item.addEventListener('click', async (e) => {
    const page = e.target.dataset.page.slice(6);
    const html = await fetchPage(page);
    if (!html) return;
    await renderPage(html);

    if (page === 'eventnow') {
      eventNow();
    }
    if (page === 'premiere') {
      premiere();
    }
  })
);

const headerLogo = document.querySelector('.header-logo-wrap');
const headerNav = document.querySelector('.header-navi-wrap');

const sentinel = document.createElement('div');
sentinel.style.height = '1px';
headerLogo.after(sentinel);

const spacer = document.createElement('div');
spacer.style.display = 'none';
headerNav.after(spacer);

const observer = new IntersectionObserver((entries) => {
  const entry = entries[0];
  const fixing = !entry.isIntersecting;
  headerNav.classList.toggle('fixed', fixing);
  if (fixing) {
    spacer.style.height = headerNav.offsetHeight + 'px';
    spacer.style.display = 'block';
  } else {
    spacer.style.display = 'none';
  }
});
observer.observe(sentinel);
// 지유님: 슬라이더 작업섹션

// 철원님: 랭킹 작업섹션
