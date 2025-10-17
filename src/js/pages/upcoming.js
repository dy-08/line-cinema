import { API_KEYS } from '../config/config.js';

export async function fetchUpcomingData() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEYS.TMDB}&language=ko-KR&page=1`
  );
  const data = await res.json();
  const movies2 = data.results;

  let inBox2 = document.querySelector('.upcoming-inBox2');

  let date = new Date();
  let today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  for (let i = 0; i < 20; i++) {
    let cardBox = document.createElement('div');
    cardBox.className = 'upcoming-cardBox';
    let movImg = document.createElement('div');
    movImg.className = 'upcoming-movImg';
    let img = document.createElement('img');
    img.className = 'upcoming-img';

    // 이슈: release_date가 현재보다 1개빼고 전이라 src가 할당되지 못하였음 by.영호
    // 리뷰:
    // 만약 20개를 보여주고싶다면,
    // 8번째 줄에서 데이터를 받을 때
    // 원하는 데이터 정보를 원하는 수만큼 받아오고
    // 바로 랜더링해주는게 좋아보임
    if (movies2[i].release_date > today) {
      img.src = `https://image.tmdb.org/t/p/w500/${movies2[i].poster_path}`;
    }
    let info = document.createElement('div');
    info.className = 'upcoming-info';
    let movTitle = document.createElement('div');
    movTitle.className = 'upcoming-movTitle';
    if (movies2[i].release_date > today) {
      movTitle.textContent = `${movies2[i].title}`;
    }
    let describe = document.createElement('div');
    describe.className = 'upcoming-describe';
    if (movies2[i].release_date > today) {
      describe.textContent = `개봉일: ${movies2[i].release_date}`;
    }

    // 이슈:
    // 45번 줄 (if( ){ ... inbox2.append... }) 스코프 안에서 append가 이루어져 랜더링되지못했음 by.영호
    // 해결:
    // 44번줄에서 46번줄로 스코프밖으로 이동해서 append 하였음
    inBox2.appendChild(cardBox);
    cardBox.appendChild(movImg);
    cardBox.appendChild(info);
    movImg.appendChild(img);
    info.appendChild(movTitle);
    info.appendChild(describe);
  }
}
