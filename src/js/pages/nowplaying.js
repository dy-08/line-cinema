let inBox1 = document.querySelector('.inBox1')

        let API_KEY = '8d869a3edc1dfa42039f24c2c4e4d19f'

        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`)
        .then(res => res.json())
        .then(data => {
            let movies = data.results;

            for( let i=0; i<20; i++){
            let cardBox = document.createElement('div')
            cardBox.className = 'cardBox'

            let movImg = document.createElement('div')
            movImg.className = 'movImg'

            let img = document.createElement('img')
            img.className = 'img'
            img.src = `https://image.tmdb.org/t/p/w500/${movies[i].poster_path}`


            let info = document.createElement('div')
            info.className = 'info'

            let movTitle = document.createElement('div')
            movTitle.className = 'movTitle'
            movTitle.textContent = `${movies[i].title}`

            let describe = document.createElement('div')
            describe.className = 'describe'
            describe.textContent = `개봉일: ${movies[i].name}`

            inBox1.appendChild( cardBox )
            cardBox.appendChild( movImg )
            cardBox.appendChild( info )
            movImg.appendChild( img )
            info.appendChild( movTitle )
            info.appendChild( describe )
        }
        })