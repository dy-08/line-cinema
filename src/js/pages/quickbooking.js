import { API_KEYS } from '../config/config.js';

const now_playing_movies = [];

function defaultMovies() {
    return {
        id: null,
        adult: null,
        title: null,
        overview: null,
        poster_path: null,
        video_path: null,
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
            const movie = defaultMovies();
            movie.id = item.id;
            movie.adult = item.adult;
            movie.title = item.title;
            movie.overview = item.overview;
            movie.poster_path = item.poster_path;
            movie.video_path = await fetchMovieVideo(item.id);
            now_playing_movies.push(movie);
        }
    } catch (err) {
        console.error('에러 발생:', err);
    } finally {
        console.log('parse:', now_playing_movies);
        renderMoviesList();
    }
}
// https://image.tmdb.org/t/p/w500/i9VFlFOm0Ez6LXfjzWuhBxrcxJa.jpg"

async function fetchMovieVideo(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEYS.TMDB}&language=ko-KR`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        // YouTube 영상 중 예고편(또는 티저) 찾기
        const video = data.results.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));

        if (video) {
            const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;
            return youtubeUrl;
        } else {
            console.log('예고편(티저) 없음');
        }
    } catch (err) {
        console.error('영상 정보 에러:', err);
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
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.results);
}
