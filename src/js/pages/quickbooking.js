import { API_KEYS } from '../config/config.js';
import { defaultCart } from './state.js';

async function fetchNowPlayingInKorea() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEYS.TMDB}&language=ko-KR&region=KR&page=1`;

    const options = {
        method: 'GET',
        headers: { accept: 'application/json' },
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        console.log(data.results); // 상영 중 영화 목록

        // 첫 번째 영화의 id로 예고편(또는 티저) 영상 불러오기
        if (data.results.length > 0) {
            const firstMovie = data.results[0];
            console.log(`첫 번째 영화: ${firstMovie.title}`);
            await fetchMovieVideo(firstMovie.id);
        }
    } catch (err) {
        console.error('에러 발생:', err);
    }
}
defaultCart();
// https://image.tmdb.org/t/p/w500/4nJcUMpWgnIPZPJ13TWKRxAdY9U.jpg

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
            console.log('예고편(티저) URL:', youtubeUrl);
        } else {
            console.log('예고편(티저) 없음');
        }
    } catch (err) {
        console.error('영상 정보 에러:', err);
    }
}

fetchNowPlayingInKorea();
