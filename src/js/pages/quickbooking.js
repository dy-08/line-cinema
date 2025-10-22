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
        console.log(now_playing_movies);
    }
}
// https://image.tmdb.org/t/p/w500/i9VFlFOm0Ez6LXfjzWuhBxrcxJa.jpg"

// 영화 ID를 이용해 예고편(티저/트레일러) 가져오기
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
