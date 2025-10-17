import { API_KEYS } from '../config/config.js';

export async function fetchUpcomingData() {

  const movies2 = []
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEYS.TMDB}&language=ko-KR&page=1`
  );
  const data = await res.json();
  const datas = data.results;

  const res2 = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEYS.TMDB}&language=ko-KR&page=2`
  );
  const data2 = await res2.json();
  const datas2 = data2.results;

  const res3 = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEYS.TMDB}&language=ko-KR&page=3`
  );

  const data3 = await res3.json();
  const datas3 = data3.results;

  const res4 = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEYS.TMDB}&language=ko-KR&page=4`
  );
  const data4 = await res4.json();
  const datas4 = data4.results;

  const res5 = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEYS.TMDB}&language=ko-KR&page=5`
  );
  const data5 = await res5.json();
  const datas5 = data5.results;

  movies2.push(...datas)
  movies2.push(...datas2)
  movies2.push(...datas3)
  movies2.push(...datas4)
  movies2.push(...datas5)

  console.log(movies2.total_pages);

  let inBox2 = document.querySelector('.upcoming-inBox2');

  let date = new Date();
  let today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  for (let i = 0; i < movies2.length; i++) {
    let cardBox = document.createElement('div');
    cardBox.className = 'upcoming-cardBox';
    let movImg = document.createElement('div');
    movImg.className = 'upcoming-movImg';
    let img = document.createElement('img');
    img.className = 'upcoming-img';

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
      inBox2.appendChild(cardBox);
      cardBox.appendChild(movImg);
      cardBox.appendChild(info);
      movImg.appendChild(img);
      info.appendChild(movTitle);
      info.appendChild(describe);
    }
  }
}