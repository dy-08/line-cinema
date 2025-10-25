import { API_KEYS } from '../config/config.js';
import { state } from './state.js';

const now_playing_movies = [];
const uiState = {
  isMovieSelected: false,
  isDateSelected: false,
};

function defaultState() {
  return {
    id: null,
    adult: null,
    title: null,
    overview: null,
    poster_path: null,
    videoKey: null,
    videoName: null,
    age: null,
  };
}

function renderMovieTrailer(videoKey, videoName) {
  console.trace('renderMovieTrailer called', videoKey, videoName);
  console.log(videoKey, videoName);
  const container = document.querySelector('.quickbooking-trailer-wrap');
  // https://www.youtube.com/watch?v=PWt0FWDC--U
  console.log(container);
  container.innerHTML = `<iframe
              width="100%"
              height="300"
              src="https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&controls=0&loop=1&playlist=${videoKey}"
              title="${videoName}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>`;
}

function renderMoviePoster(posterPath, posterName) {
  const container = document.querySelector('.quickbooking-poster-wrap');
  // now_playing_movies.poster_path: "/u2aVXft5GLBQnjzWVNda7sdDpdu.jpg"
  // https://image.tmdb.org/t/p/w500/i9VFlFOm0Ez6LXfjzWuhBxrcxJa.jpg
  container.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${posterPath}" alt="${posterName}" />`;
}
export async function fetchNowPlayingInKorea() {
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEYS.TMDB}&language=ko-KR&region=KR&page=1`;
  const options = {
    method: 'GET',
    headers: { accept: 'application/json' },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    for (const item of data.results) {
      const movie = defaultState();
      movie.id = item.id;
      movie.adult = item.adult;
      movie.title = item.title;
      movie.overview = item.overview;
      movie.poster_path = item.poster_path;
      const { videoKey, videoName } = await fetchMovieVideo(item.id);
      movie.videoKey = videoKey;
      movie.videoName = videoName;
      movie.age = await fetchReleaseDates(item.id);
      now_playing_movies.push(movie);
    }
    console.log(now_playing_movies);

    renderMoviesList();
  } catch (err) {
    console.error('현재상영중(극장) 에러 발생:', err);
  } finally {
  }
}
// https://image.tmdb.org/t/p/w500/i9VFlFOm0Ez6LXfjzWuhBxrcxJa.jpg"

async function fetchMovieVideo(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEYS.TMDB}&language=ko-KR`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // YouTube 영상 중 예고편(또는 티저) 찾기
    const video = data.results.find(
      (v) =>
        v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    if (video) {
      const videoKey = video.key;
      const videoName = video.name;
      return { videoKey, videoName };
    } else {
      console.log('예고편(티저) 없음');
      // 대체영상으로 예외처리 해야됨 20251024
      return { videoKey: null, videoName: null };
    }
  } catch (err) {
    console.error('영상정보(티저) 에러:', err);
  }
}

function renderMoviesList() {
  const container = document.getElementById('quickbooking-movie-itemWrap');

  container.innerHTML = now_playing_movies
    .map(
      (item) => `
    <div class="quickbooking-movie-item">
        <a href="#">
            <span class="quickbooking-movie-limitAge font-numeric ${getAgeClass(
              item.age
            )}">${item.age || 15}</span>
            <span class="quickbooking-movie-title">${item.title}</span>
        </a>
    </div>`
    )
    .join('');

  const movies = document.querySelectorAll('.quickbooking-movie-item');
  console.log(movies);
  console.log('before:', state);

  movies.forEach((movie, idx) =>
    movie.addEventListener('click', () => {
      // 🌟
      uiState.isMovieSelected = true;

      // console.log('클릭된 영화:', now_playing_movies[idx]);
      state.cart.setMovie(now_playing_movies[idx]);
      console.log('after:', state);
      const videoKey = now_playing_movies[idx].videoKey;
      const videoName = now_playing_movies[idx].videoName;
      renderMovieTrailer(videoKey, videoName);
      const posterPath = now_playing_movies[idx].poster_path;
      renderMoviePoster(posterPath, videoName);
      const prev = document.querySelector(
        '.quickbooking-movie-item a.selected'
      );

      // 재클릭 시 초기화
      if (prev) {
        prev.classList.remove('selected');
        const calendarPrev = document.querySelector(
          '.quickbooking-calendar-item.selected'
        );
        if (calendarPrev) calendarPrev.classList.remove('selected');

        const screenInfo = document.querySelector(
          '.quickbooking-date-movieInfo'
        );
        const theaterInfo = document.querySelector(
          '.quickbooking-date-itemWrap'
        );

        screenInfo.innerHTML = '';
        theaterInfo.innerHTML = '';
      }
      movie.querySelector('a').classList.add('selected');
    })
  );
}

async function fetchReleaseDates(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${API_KEYS.TMDB}`;
  const options = {
    method: 'GET',
    headers: { accept: 'application/json' },
  };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    const kr = data.results?.find((item) => item.iso_3166_1 === 'KR')
      ?.release_dates[0]?.certification;
    // ALL, 12, 15, 19
    return kr;
  } catch (error) {
    console.error('영화등급 에러 발생:', error);
  }
}

function getAgeClass(age) {
  if (!age || '') return 'age-15';
  if (age >= 19) return 'age-19';
  if (age >= 15) return 'age-15';
  if (age >= 12) return 'age-12';
  return 'age-all';
}

// Calendar
function getCurrentDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, 0);
  const date = String(now.getDate()).padStart(2, 0);
  const current = `${year}–${month}–${date}(오늘)`;
  return current;
}
export function renderDate() {
  const container = document.querySelector('.quickbooking-current-date');
  const dateText = getCurrentDate();
  container.innerHTML = `<p>${dateText}</p>`;
}

function getFirstDayOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function getLastDayOfMonth(date = new Date()) {
  // "다음 달의 0번째 날" → 현재 달의 마지막 날
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function getStartDayOfMonth(date = getFirstDayOfMonth()) {
  const weekday = date.toLocaleDateString('ko-KR', {
    weekday: 'short',
  });
  return weekday;
}

function renderCalendar(date, day) {
  const container = document.querySelector('.quickbooking-calendar-itemWrap');
  const now = new Date();
  const isToday = date === now.getDate();
  const weekendClass = day === '토' ? 'sat' : day === '일' ? 'sun' : '';

  return (container.innerHTML += `
    <div class="quickbooking-calendar-item">
      <div class="quickbooking-calendar-date font-numeric${
        isToday ? ' current' : ''
      }">${date}</div>
      <div class="quickbooking-calendar-day ${weekendClass}">${day}</div>
    </div>
  `);
}
function initCalendarPosition() {
  const dateEls = document.querySelectorAll('.quickbooking-calendar-date');
  let currentDateX = 0;
  let defaultPaddingX = 28;
  dateEls.forEach((item) => {
    if (item.className.includes('current')) {
      currentDateX = item.offsetLeft;
    }
  });
  const itemEls = document.querySelectorAll('.quickbooking-calendar-item');
  itemEls.forEach((item) => {
    item.style.transition = 'transform 0.5s ease';
    item.style.transform = `translateX(-${currentDateX - defaultPaddingX}px)`;
  });
}
function renderScreenInfo() {
  const container = document.querySelector('.quickbooking-date-movieInfo');
  return (container.innerHTML = `
      <span class="quickbooking-movie-limitAge font-numeric ${getAgeClass(
        state.cart.movie.age
      )}"
                >${state.cart.movie.age ? state.cart.movie.age : 15}</span
              >
              <span><strong>${state.cart.movie.title}</strong></span>
            </div>
    `);
}
function renderTheaterInfo() {
  const container = document.querySelector('.quickbooking-date-itemWrap');
  return (container.innerHTML = `
      <div class="quickbooking-date-item">
                <div class="quickbooking-date-top">
                  <div class="quickbooking-startTime font-numeric">09:50</div>
                </div>
                <div class="quickbooking-date-bottom">
                  <div class="quickbooking-seats">
                    <span class="quickbooking-remainingSeats font-numeric"
                      >40</span
                    >&#47;<span class="quickbooking-totalSeats font-numeric"
                      >40</span
                    >
                  </div>
                  <span class="quickbooking-screenNumber font-numeric"
                    >1관</span
                  >
                </div>
              </div>
    `);
}

export function createCalendar() {
  const startDateObj = getFirstDayOfMonth();
  const endDateObj = getLastDayOfMonth();
  const firstDayNum = startDateObj.getDate();
  const lastDayNum = endDateObj.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const startWeekday = getStartDayOfMonth();
  const currentMonth = startDateObj.getMonth() + 1;

  let weekdayIndex = weekdays.indexOf(startWeekday);

  document.querySelector(
    '.quickbooking-current--active'
  ).textContent = `${currentMonth}월`;
  for (let i = firstDayNum; i <= lastDayNum; i++) {
    renderCalendar(i, weekdays[weekdayIndex++]);

    if (weekdayIndex >= weekdays.length) {
      weekdayIndex = 0;
    }
  }
  initCalendarPosition();

  const dateEls = document.querySelectorAll('.quickbooking-calendar-item');
  dateEls.forEach((item) => {
    item.addEventListener('click', () => {
      // 🌟
      uiState.isDateSelected = true;

      const prev = document.querySelector(
        '.quickbooking-calendar-item.selected'
      );
      if (prev) prev.classList.remove('selected');

      item.classList.add('selected');

      const date = item
        .querySelector('.quickbooking-calendar-date')
        .textContent.trim();
      const day = item
        .querySelector('.quickbooking-calendar-day')
        .textContent.trim();

      const selectedDate = Number(date);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDate = now.getDate();

      // 이슈: 전데이터 영역이 히든되지않고 눌리는 현상 (수정해야함)
      const bookingDate =
        selectedDate >= currentDate
          ? `${currentYear}-${currentMonth + 1}-${selectedDate}`
          : `${currentYear}-${currentMonth + 2}-${selectedDate}`;

      console.log(bookingDate, day); // 🌟 정보 매핑 필요
      state.cart.setDate({ bookingDate, day });
      console.log('날짜요일매핑:', state);

      console.log(uiState.isMovieSelected && uiState.isDateSelected);

      if (uiState.isMovieSelected && uiState.isDateSelected) {
        renderScreenInfo();
        renderTheaterInfo();

        uiState.isMovieSelected = false;
        uiState.isDateSelected = false;
      }
    });
  });
}
