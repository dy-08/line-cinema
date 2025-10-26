import { API_KEYS } from '../config/config.js';
import { state } from './state.js';

const now_playing_movies = [];
const showtimesByMovie = {};
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
              height="311"
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
      showtimesByMovie[item.id] = createShowtimes();
    }
    console.log(now_playing_movies);

    console.log(showtimesByMovie);

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
      // 🌟 매핑 완료
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

function createTheaterTemplate({ time, auditorium, total, remain }) {
  const container = document.querySelector('.quickbooking-date-itemWrap');

  return (container.innerHTML += `
      <div class="quickbooking-date-item" data-time="${time}" data-auditorium="${auditorium}" data-total="${total}" data-remain="${remain}">
                <div class="quickbooking-date-top">
                  <div class="quickbooking-startTime font-numeric">${time}</div>
                </div>
                <div class="quickbooking-date-bottom">
                  <div class="quickbooking-seats">
                    <span class="quickbooking-remainingSeats font-numeric"
                      >${remain}</span
                    >&#47;<span class="quickbooking-totalSeats font-numeric"
                      >${total}</span
                    >
                  </div>
                  <span class="quickbooking-screenNumber font-numeric"
                    >${auditorium}</span
                  >
                </div>
              </div>
    `);
}

// ALL, 12, 15, 19
function getAgeMessage(age = 15) {
  const normalized = String(age).toUpperCase();
  switch (normalized) {
    case 'ALL':
      return '본 영화는 전체관람가 영화입니다.';
    case '12':
      return '12세 미만 고객님(영, 유아 포함)은 반드시 성인 보호자 동반 하에 관람이 가능합니다.<span class="u-br"></span>연령 확인 불가 시 입장이 제한될 수 있습니다.';
    case '15':
      return '15세 미만 고객님(영, 유아 포함)은 반드시 성인 보호자 동반 하에 관람이 가능합니다.<span class="u-br"></span>연령 확인 불가 시 입장이 제한될 수 있습니다.';
    case '19':
      return '19세 미만 보호자 동반하여도 관람이 불가합니다.<span class="u-br"></span>(반드시 신분증 지참)';
  }
}
function clearConfirmModal() {
  const container = document.getElementById('quickbooking-modal-app');
  return (container.innerHTML = '');
}

function renderConfirmModal() {
  const container = document.getElementById('quickbooking-modal-app');
  return (container.innerHTML = `
    <div class="quickbooking-confirm-modal">
          <div class="quickbooking-modal-header">
            <div class="quickbooking-modal-date">
              <span>${state.cart.showtimes.time}</span> <span>${
    state.cart.showtimes.auditorium
  }</span>
            </div>
            <div class="quickbooking-header-X"><a href="#">X</a></div>
          </div>
          <div class="quickbooking-modal-body">
            <div class="quickbooking-modal-seat">
              <span class="quickbooking-modal-remainText">잔여좌석 </span
              ><span class="quickbooking-modal-remain font-numeric"
                >${state.cart.showtimes.remain}</span
              >	&#47; <span class="quickbooking-modal-total font-numeric"
                >${state.cart.showtimes.total}</span
              >
            </div>
            <div class="quickbooking-modal-screen">SCREEN</div>
            <div class="quickbooking-modal-app">HTML</div>
            <div class="quickbooking-modal-ageMsg">
              <p class="quickbooking-ageMsg-top">
                <span class="quickbooking-modal-limitAge ${getAgeClass(
                  state.cart.movie.age
                )}">${state.cart.movie.age}</span
                ><span
                  > 본 영화는 <span>${
                    state.cart.movie.age
                  }세 이상 관람가</span> 영화입니다.</span
                >
              </p>
              <p class="quickbooking-ageMsg-bottom">
                ${getAgeMessage(state.cart.movie.age)}
              </p>
            </div>
            <div class="quickbooking-modal-btns">
              <button class="quickbooking-btn--cancel">취소</button>
              <button class="quickbooking-btn--continue">인원/좌석선택</button>
            </div>
          </div>
  `);
}

function clearShowtimes() {
  return state.cart.setShowtimes({
    time: null,
    auditorium: null,
    total: null,
    remain: null,
  });
}
function renderTheaterInfo() {
  const sortedShowtimes = showtimesByMovie[state.cart.movie.id].sort(
    (a, b) => Number(a.time.replace(':', '')) - Number(b.time.replace(':', ''))
  );
  console.log(sortedShowtimes);

  // API 극장에서 현재 상영하는 리스트를 받아 올 때 스테이트 쇼타임을 받아옴
  // 그래서 API 극장 받아올 때 처리를 같이 해주어야함

  // 스테이트에 쇼타임이 없다면 뿌려주고 state에 저장해야됨
  // 쇼타임이 있다면 스테이트에서 있는걸 꺼내와야함
  // 정보(time, remain, total, auditorium)
  // 예약이 됐다면 remain 값 재할당 (이후작업)
  // remain이 0이면 클릭못하게 처리
  for (let showtime of sortedShowtimes) {
    createTheaterTemplate(showtime);
  }

  // 클릭이벤트
  const showtimeItems = document.querySelectorAll('.quickbooking-date-item');
  showtimeItems.forEach((item) => {
    item.addEventListener('click', () => {
      const prev = document.querySelector('.quickbooking-date-item.selected');
      if (prev) prev.classList.remove('selected');
      item.classList.add('selected');

      // showtimes 매핑필요 => 완료
      const { time, auditorium, remain, total } = item.dataset;
      state.cart.setShowtimes({ time, auditorium, remain, total });
      console.log('showtimes:', state);

      // 모달 들어가야함
      renderConfirmModal();

      // clickEvent(X, Cancel)
      document
        .querySelector('.quickbooking-header-X')
        .addEventListener('click', () => {
          clearConfirmModal();
          clearShowtimes();
          console.log('X:', state);
        });
      document
        .querySelector('.quickbooking-btn--cancel')
        .addEventListener('click', () => {
          clearConfirmModal();
          clearShowtimes();
          console.log('Cancel:', state);
        });
    });
  });
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

      console.log(bookingDate, day); // 🌟 정보 매핑 필요 => 완료
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

function createShowtimes() {
  const possibleTimes = [
    '09:50',
    '11:20',
    '13:10',
    '15:40',
    '18:10',
    '20:40',
    '22:30',
  ];
  const numOfShows = Math.floor(Math.random() * 3 + 3); // 3 ~ 5
  const shuffledTimes = possibleTimes.sort(() => Math.random() - 0.5);
  const selected = shuffledTimes.slice(0, numOfShows);

  return selected.map((time, idx) => {
    const total = 40;
    const remain = total - Math.floor(Math.random() * 15); // 24~40 남음
    const auditorium = `${(idx % 3) + 1}관`; // 1~3관
    return { time, auditorium, total, remain };
  });
}
