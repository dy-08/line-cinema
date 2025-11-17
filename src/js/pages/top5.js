import { API_KEYS } from "../config/config.js";

export async function fetchTop5Data1() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEYS.TMDB}&language=ko-KR&with_genres=28`
  );
  const data = await res.json();
  const movies3 = data.results;
  let dragTop1 = document.querySelector('.top5-dragTop1');

  for (let i = 0; i < 5; i++) {
    let cardBox = document.createElement('div');
    cardBox.className = 'top5-cardBox';
    cardBox.classList.add('top5-cardBox2');

    let movImg = document.createElement('div');
    movImg.className = 'top5-movImg';

    let img = document.createElement('img');
    img.className = 'top5-img';
    img.src = `https://image.tmdb.org/t/p/w500/${movies3[i].poster_path}`;

    let info = document.createElement('div');
    info.className = 'top5-info';

    let movTitle = document.createElement('div');
    movTitle.className = 'top5-movTitle';
    movTitle.textContent = `${movies3[i].title}`;

    let describe = document.createElement('div');
    describe.className = 'top5-describe';
    describe.textContent = `개봉일: ${movies3[i].release_date}`;

    dragTop1.appendChild(cardBox);
    cardBox.appendChild(movImg);
    cardBox.appendChild(info);
    movImg.appendChild(img);
    info.appendChild(movTitle);
    info.appendChild(describe);
  }
}

export async function fetchTop5Data2() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEYS.TMDB}&language=ko-KR&with_genres=35`
  );
  const data = await res.json();
  const movies4 = data.results;

  let dragTop2 = document.querySelector('.top5-dragTop2');

  for (let i = 5; i < 10; i++) {
    let cardBox = document.createElement('div');
    cardBox.className = 'top5-cardBox';
    cardBox.classList.add('top5-cardBox2');

    let movImg = document.createElement('div');
    movImg.className = 'top5-movImg';

    let img = document.createElement('img');
    img.className = 'top5-img';
    img.src = `https://image.tmdb.org/t/p/w500/${movies4[i].poster_path}`;

    let info = document.createElement('div');
    info.className = 'top5-info';

    let movTitle = document.createElement('div');
    movTitle.className = 'top5-movTitle';
    movTitle.textContent = `${movies4[i].title}`;

    let describe = document.createElement('div');
    describe.className = 'top5-describe';
    describe.textContent = `개봉일: ${movies4[i].release_date}`;

    dragTop2.appendChild(cardBox);
    cardBox.appendChild(movImg);
    cardBox.appendChild(info);
    movImg.appendChild(img);
    info.appendChild(movTitle);
    info.appendChild(describe);
  }
}

export async function fetchTop5Data3() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEYS.TMDB}&language=ko-KR&with_genres=53`
  );
  const data = await res.json();
  const movies5 = data.results;

  let dragTop3 = document.querySelector('.top5-dragTop3');

  for (let i = 10; i < 15; i++) {
    let cardBox = document.createElement('div');
    cardBox.className = 'top5-cardBox';
    cardBox.classList.add('top5-cardBox2');

    let movImg = document.createElement('div');
    movImg.className = 'top5-movImg';

    let img = document.createElement('img');
    img.className = 'top5-img';
    img.src = `https://image.tmdb.org/t/p/w500/${movies5[i].poster_path}`;

    let info = document.createElement('div');
    info.className = 'top5-info';

    let movTitle = document.createElement('div');
    movTitle.className = 'top5-movTitle';
    movTitle.textContent = `${movies5[i].title}`;

    let describe = document.createElement('div');
    describe.className = 'top5-describe';
    describe.textContent = `개봉일: ${movies5[i].release_date}`;

    dragTop3.appendChild(cardBox);
    cardBox.appendChild(movImg);
    cardBox.appendChild(info);
    movImg.appendChild(img);
    info.appendChild(movTitle);
    info.appendChild(describe);
  }
}

function dragAble(a) {
  let title = a.parentElement.previousElementSibling;
  let down = false,
    transX = 0,
    pointX = 0;

  a.addEventListener('mousedown', handleDown);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleUp);

  a.addEventListener('touchstart', handleDown);
  window.addEventListener('touchmove', handleMove);
  window.addEventListener('touchend', handleUp);



  function handleDown(e) {
    down = true;
    let point = e.touches ? e.touches[0] : e;
    pointX = point.clientX;
    e.preventDefault();
    a.style.cursor = 'grabbing';
    title.classList.add('active')
  }

  function handleMove(e) {
    if (!down) return;
    let point = e.touches ? e.touches[0] : e;
    let deltaX = point.clientX - pointX;
    pointX = point.clientX;
    transX += deltaX;
    const parentWidth = a.parentElement.offsetWidth;
    const aWidth = a.scrollWidth + 10;
    const minX = parentWidth - aWidth;
    transX = Math.max(minX, Math.min(0, transX));
    a.style.transform = `translateX( ${transX}px)`;
  }

  function handleUp(e) {
    down = false;
    a.style.cursor = '';
    title.classList.remove('active');
  }
}
export function drag() {
  document.querySelectorAll('.top5-dragTop').forEach((item) => dragAble(item));
}
