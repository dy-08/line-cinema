import { API_KEYS } from '../config/config.js'; // 키 요청

// 네비게이션 hover 효과
const navi = document.querySelectorAll('.header-navi-main');
let current = '';
navi.forEach((item) => {
  item.addEventListener('mouseover', () => {
    if (current) {
      current.classList.remove('selected');
      current = item.nextElementSibling;
      current.classList.add('selected');
    }
    current = item.nextElementSibling;
    current.classList.add('selected');

    current.addEventListener('mouseleave', () => {
      current.classList.remove('selected');
    });
  });
});

// TMDB API 테스트 코드
// console.log(API_KEYS); // 키 응답
const slidePath = [];
async function tmdb() {
  try {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    // v3
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEYS.TMDB}&language=ko-KR/`,
      options
    );
    const data = await res.json();
    // console.log(data.results);
    
    // 파싱
    data.results.forEach((item, idx) => {
      // backdrop_path
      if(idx<5) slidePath.push(item.backdrop_path);
    });
    } catch (e) {
    console.error(e);
  }
    // const div1 = document.createElement('div')
    // div1.className = `main-img img5`; 
    // forEach(item, index) {
    //   let path = data.results[item.length].backdrop_path
    //   const div = document.createElement('div')
    //   div.className = `main-img img${index+1}`;
    //   div.style.background = url(`https://image.tmdb.org/t/p/w500/${path}`)
      // https://image.tmdb.org/t/p/w500/9DYFYhmbXRGsMhfUgXM3VSP9uLX.jpg
      // }
      
      // const div2 = document.createElement('div')
      // div.className = `main-img img1`;   
}
tmdb();

  function makeImg() {
    const imgBox = document.querySelector(".main-inBox-imgbox");
    console.log(slidePath);
    
    slidePath.forEach(item => {
      console.log('item: ',item);
      
    });
    // const div1 = document.createElement('div');
    // div1.className = 'main-img img1';
    // const div2 = document.createElement('div');
    // div2.className = 'main-img img2';
    // const div3 = document.createElement('div');
    // div3.className = 'main-img img3';
    // const div4 = document.createElement('div');
    // div4.className = 'main-img img4';
    // const div5 = document.createElement('div');
    // div5.className = 'main-img img5';
    
    // imgBox.appendChild(div5);
    // imgBox.appendChild(div1);
    // imgBox.appendChild(div2);
    // imgBox.appendChild(div3);
    // imgBox.appendChild(div4);
    // imgBox.appendChild(div5);
    // imgBox.appendChild(div1);
  }
  makeImg();

// 지유님: 슬라이더 작업섹션
  window.onload = function(){
    let count = 1;
    let imgBox = document.querySelector(".main-inBox-imgbox");
    let imgTotal = document.querySelectorAll(".main-inBox-imgbox .main-img").length;
    let imgSize = 100 / imgTotal;

    let autoSlide; // 자동 슬라이드 타이머

    function show(){
      imgBox.style.transform = `translateX(${-imgSize * count}%)`;
    }

    function leftf(){
      count--;
      show();
      resetAutoSlide(); 
    }

    function rightf(){
      count++;
      show();
      resetAutoSlide(); 
    }

    function tend(){
      // 양끝 이미지 복제 구간 처리
      if(count >= imgTotal - 1){
        imgBox.style.transition = "none";
        count = 1;
        show();
        imgBox.offsetWidth; // 리렌더링
        imgBox.style.transition = "all 0.5s linear";
      } else if(count <= 0){
        imgBox.style.transition = "none";
        count = imgTotal - 2;
        show();
        imgBox.offsetWidth;
        imgBox.style.transition = "all 0.5s linear";
      }
    }
7
    // 자동 슬라이드 
    function startAutoSlide(){
      autoSlide = setInterval(() => {
        count++;
        show();
      }, 5000); // 초 간격
    }

    // 클릭 시 자동 슬라이드 잠시 멈췄다가 다시 시작
    function resetAutoSlide(){
      clearInterval(autoSlide);
      startAutoSlide();
    }

    show();
    startAutoSlide();

    window.leftf = leftf;
    window.rightf = rightf;
    window.tend = tend;
  }


// 철원님: 랭킹 작업섹션
