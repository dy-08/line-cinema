import { eventNow } from './eventnow.js';
import { premiere } from './premiere.js';
import { eventHot } from './hotevent.js';
import {
  fetchTop5Data1,
  fetchTop5Data2,
  fetchTop5Data3,
  drag,
} from './top5.js';
import { fetchNowplayingData } from './nowplaying.js';
import { fetchUpcomingData } from './upcoming.js';
import {
  fetchNowPlayingInKorea as quickbooking,
  renderDate,
  createCalendar,
} from './quickbooking.js';

// 네비게이션 효과
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
// tmdb();

async function renderPage({ html, index = false }) {
  document.getElementById('app').innerHTML = await html;
}
async function fetchPage(page) {
  try {
    const isIndex = page === 'index';

    const res = isIndex
      ? await fetch(`./${page}.html`)
      : await fetch(`./src/html/${page}.html`);

    if (!res.ok) throw new Error('page is not found');
    const data = await res.text();
    if (isIndex) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const target = doc.querySelector('#app');
      const content = target ? target.innerHTML : '';

      return { html: content, index: isIndex };
    }
    return { html: data, index: isIndex };
  } catch (error) {
    console.error('fetchPageError:', error.message);
  }
}
document.querySelectorAll('.header-navi-sub').forEach((item) =>
  item.addEventListener('click', async (e) => {
    const page = e.target.dataset.page.slice(6);
    const { html } = await fetchPage(page);

    if (!html) return;
    await renderPage({ html });

    if (page === 'index') {
      initSlider();
    }
    if (page === 'eventnow') {
      eventNow();
    }
    if (page === 'premiere') {
      premiere();
    }
    if (page === 'hotevent') {
      eventHot();
    }
    if (page === 'top5') {
      fetchTop5Data1();
      fetchTop5Data2();
      fetchTop5Data3();
      drag();
    }
    if (page === 'nowplaying') {
      fetchNowplayingData();
    }
    if (page === 'upcoming') {
      fetchUpcomingData();
    }
    if (page === 'quickbooking') {
      quickbooking();
      renderDate();
      createCalendar();
    }
  })
);

document.querySelectorAll('.header-navi-default').forEach((item) =>
  item.addEventListener('click', async (e) => {
    const page = e.target.dataset.page.slice(6);
    const { html, index } = await fetchPage(page);
    if (!html) return;
    await renderPage({ html, index });

    if (page === 'index') {
      initSlider();
    }
    if (page === 'eventnow') {
      eventNow();
    }
    if (page === 'premiere') {
      premiere();
    }
    if (page === 'hotevent') {
      eventHot();
    }
    if (page === 'top5') {
      fetchTop5Data1();
      fetchTop5Data2();
      fetchTop5Data3();
      drag();
    }
    if (page === 'nowplaying') {
      fetchNowplayingData();
    }
    if (page === 'upcoming') {
      fetchNowPlayingInKorea();
    }
    if (page === 'quickbooking') {
      quickbooking();
      renderDate();
      createCalendar();
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
function initSlider() {
  let count = 1;
  let imgBox = document.querySelector('.main-inBox-imgbox');
  let imgTotal = document.querySelectorAll(
    '.main-inBox-imgbox .main-img'
  ).length;
  let imgSize = 100 / imgTotal;

  let autoSlide; // 자동 슬라이드 타이머

  function show() {
    imgBox.style.transform = `translateX(${-imgSize * count}%)`;
  }

  function leftf() {
    count--;
    show();
    resetAutoSlide();
  }

  function rightf() {
    count++;
    show();
    resetAutoSlide();
  }

  function tend() {
    // 양끝 이미지 복제 구간 처리
    if (count >= imgTotal - 1) {
      imgBox.style.transition = 'none';
      count = 1;
      show();
      imgBox.offsetWidth; // 리렌더링
      imgBox.style.transition = 'all 0.5s linear';
    } else if (count <= 0) {
      imgBox.style.transition = 'none';
      count = imgTotal - 2;
      show();
      imgBox.offsetWidth;
      imgBox.style.transition = 'all 0.5s linear';
    }
  }

  // 자동 슬라이드
  function startAutoSlide() {
    autoSlide = setInterval(() => {
      count++;
      show();
    }, 5000); // 초 간격
  }

  // 클릭 시 자동 슬라이드 잠시 멈췄다가 다시 시작
  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  show();
  startAutoSlide();

  window.leftf = leftf;
  window.rightf = rightf;
  window.tend = tend;
}
initSlider();

// 철원님: 랭킹 작업섹션
