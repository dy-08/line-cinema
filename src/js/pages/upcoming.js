async function fetchUpcomingData() {

    let API_KEY = '8d869a3edc1dfa42039f24c2c4e4d19f'


    const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1`)
    const data = await res.json()
    const movies2 = data.results

    let inBox2 = document.querySelector('.upcoming-inBox2')

    let date = new Date()
    let today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    for (let i = 0; i < 20; i++) {
        let cardBox = document.createElement('div')
        cardBox.className = 'upcoming-cardBox'

        let movImg = document.createElement('div')
        movImg.className = 'upcoming-movImg'

        let img = document.createElement('img')
        img.className = 'upcoming-img'
        if (movies2[i].release_date > today) {
            img.src = `https://image.tmdb.org/t/p/w500/${movies2[i].poster_path}`
        }

        let info = document.createElement('div')
        info.className = 'upcoming-info'

        let movTitle = document.createElement('div')
        movTitle.className = 'upcoming-movTitle'
        if (movies2[i].release_date > today) {
            movTitle.textContent = `${movies2[i].title}`
        }

        let describe = document.createElement('div')
        describe.className = 'upcoming-describe'
        if (movies2[i].release_date > today) {
            describe.textContent = `개봉일: ${movies2[i].release_date}`

            inBox2.appendChild(cardBox)
            cardBox.appendChild(movImg)
            cardBox.appendChild(info)
            movImg.appendChild(img)
            info.appendChild(movTitle)
            info.appendChild(describe)
        }
    }
}

fetchUpcomingData()