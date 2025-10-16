async function fetchNowplayingData() {
    let API_KEY = '8d869a3edc1dfa42039f24c2c4e4d19f'
    const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`)
    const data = await res.json()
    const movies = data.results

    let inBox1 = document.querySelector('.nowplaying-inBox1')
    for (let i = 0; i < 20; i++) {
        let cardBox = document.createElement('div')
        cardBox.className = 'nowplaying-cardBox'

        let movImg = document.createElement('div')
        movImg.className = 'nowplaying-movImg'

        let img = document.createElement('img')
        img.className = 'nowplaying-img'
        img.src = `https://image.tmdb.org/t/p/w500/${movies[i].poster_path}`


        let info = document.createElement('div')
        info.className = 'nowplaying-info'

        let movTitle = document.createElement('div')
        movTitle.className = 'nowplaying-movTitle'
        movTitle.textContent = `${movies[i].title}`

        let describe = document.createElement('div')
        describe.className = 'nowplaying-describe'
        describe.textContent = `개봉일: ${movies[i].name}`

        inBox1.appendChild(cardBox)
        cardBox.appendChild(movImg)
        cardBox.appendChild(info)
        movImg.appendChild(img)
        info.appendChild(movTitle)
        info.appendChild(describe)
    }
}

fetchNowplayingData()