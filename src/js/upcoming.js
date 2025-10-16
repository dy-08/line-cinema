let inBox2 = document.querySelector('.inBox2')

        let API_KEY = '8d869a3edc1dfa42039f24c2c4e4d19f'
        
        let date = new Date()
        let today = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`

        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1`)
        .then(res => res.json())
        .then(data => {
            let movies2 = data.results

            for( let i=0; i<20; i++){
            let cardBox = document.createElement('div')
            cardBox.className = 'cardBox'

            let movImg = document.createElement('div')
            movImg.className = 'movImg'

            let img = document.createElement('img')
            img.className = 'img'
            if( movies2[i].release_date > today){
                img.src = `https://image.tmdb.org/t/p/w500/${movies2[i].poster_path}`
            }
            


            let info = document.createElement('div')
            info.className = 'info'

            let movTitle = document.createElement('div')
            movTitle.className = 'movTitle'
            if( movies2[i].release_date > today){
                movTitle.textContent = `${movies2[i].title}`
            }

            let describe = document.createElement('div')
            describe.className = 'describe'
            if( movies2[i].release_date > today){
                describe.textContent = `개봉일: ${movies2[i].release_date}`
            

                inBox2.appendChild( cardBox )
                cardBox.appendChild( movImg )
                cardBox.appendChild( info )
                movImg.appendChild( img ) 
                info.appendChild( movTitle )
                info.appendChild( describe )
                }
            }
        })