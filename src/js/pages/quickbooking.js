import { API_KEYS } from '../config/config.js';

const now_playing_movies = [];

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
// class GuestBooking{
//   constructor(){

//   }
// }

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

  movies.forEach((movie, idx) =>
    movie.addEventListener('click', () => {
      // 🌟
      console.log(now_playing_movies[idx]);
      const videoKey = now_playing_movies[idx].videoKey;
      const videoName = now_playing_movies[idx].videoName;
      renderMovieTrailer(videoKey, videoName);
      const posterPath = now_playing_movies[idx].poster_path;
      renderMoviePoster(posterPath, videoName);
      const prev = document.querySelector(
        '.quickbooking-movie-item a.selected'
      );
      if (prev) prev.classList.remove('selected');
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
    console.error('영화등급 에러 발생:', err);
  }
}

function getAgeClass(age) {
  if (!age) return 'age-15';
  if (age >= 19) return 'age-19';
  if (age >= 15) return 'age-15';
  if (age >= 12) return 'age-12';
  return 'age-all';
}
