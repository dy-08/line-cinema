import { API_KEYS } from '../config/config.js';

const now_playing_movies = [];

function defaultState() {
  return {
    id: null,
    adult: null,
    title: null,
    overview: null,
    poster_path: null,
    video_path: null,
    user: {},
    age: null,
  };
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
    console.log('original: ', data.results);

    for (const item of data.results) {
      const movie = defaultState();
      movie.id = item.id;
      movie.adult = item.adult;
      movie.title = item.title;
      movie.overview = item.overview;
      movie.poster_path = item.poster_path;
      movie.video_path = await fetchMovieVideo(item.id);
      movie.age = await fetchReleaseDates(item.id);
      now_playing_movies.push(movie);
    }
    console.log('parse:', now_playing_movies);
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
      const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;
      return youtubeUrl;
    } else {
      console.log('예고편(티저) 없음');
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
            <span class="quickbooking-movie-limitAge font-numeric">12</span>
            <span class="quickbooking-movie-title">${item.title}</span>
        </a>
    </div>`
    )
    .join('');
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
    console.log(data);
    const kr = data.results?.find((item) => item.iso_3166_1 === 'KR')
      ?.release_dates[0]?.certification;
    console.log('kr:', kr);
    // ALL, 12, 15, 19
    return kr;
  } catch (error) {
    console.error('영화등급 에러 발생:', err);
  }
}
