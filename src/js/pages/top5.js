// 승아님 카드 ui 작업섹션
        let dragTop1  = document.querySelector('.dragTop1')
        let dragTop2  = document.querySelector('.dragTop2')
        let dragTop3  = document.querySelector('.dragTop3')
        
        let API_KEY = '8d869a3edc1dfa42039f24c2c4e4d19f'

        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=28`)
        .then(res => res.json())
        .then(data => {
            let movies3 = data.results

            for( let i=0; i<5; i++){

            let cardBox = document.createElement('div')
            cardBox.className = 'cardBox'
            cardBox.classList.add('cardBox2')

            let movImg = document.createElement('div')
            movImg.className = 'movImg'

            let img = document.createElement('img')
            img.className = 'img'
            img.src = `https://image.tmdb.org/t/p/w500/${movies3[i].poster_path}`


            let info = document.createElement('div')
            info.className = 'info'

            let movTitle = document.createElement('div')
            movTitle.className = 'movTitle'
            movTitle.textContent = `${movies3[i].title}`

            let describe = document.createElement('div')
            describe.className = 'describe'
            describe.textContent = `개봉일: ${movies3[i].release_date}`

            dragTop1.appendChild( cardBox )
            cardBox.appendChild( movImg )
            cardBox.appendChild( info )
            movImg.appendChild( img ) 
            info.appendChild( movTitle )
            info.appendChild( describe )
        }
        })

        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=35`)
        .then(res => res.json())
        .then(data => {
            let movies4 = data.results

            for( let i=5; i<10; i++){

            let cardBox = document.createElement('div')
            cardBox.className = 'cardBox'
            cardBox.classList.add('cardBox2')

            let movImg = document.createElement('div')
            movImg.className = 'movImg'

            let img = document.createElement('img')
            img.className = 'img'
            img.src = `https://image.tmdb.org/t/p/w500/${movies4[i].poster_path}`


            let info = document.createElement('div')
            info.className = 'info'

            let movTitle = document.createElement('div')
            movTitle.className = 'movTitle'
            movTitle.textContent = `${movies4[i].title}`

            let describe = document.createElement('div')
            describe.className = 'describe'
            describe.textContent = `개봉일: ${movies4[i].release_date}`

            dragTop2.appendChild( cardBox )
            cardBox.appendChild( movImg )
            cardBox.appendChild( info )
            movImg.appendChild( img ) 
            info.appendChild( movTitle )
            info.appendChild( describe )
        }
        })

        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=53`)
        .then(res => res.json())
        .then(data => {
            let movies5 = data.results

            for( let i=15; i<20; i++){

            let cardBox = document.createElement('div')
            cardBox.className = 'cardBox'
            cardBox.classList.add('cardBox2')

            let movImg = document.createElement('div')
            movImg.className = 'movImg'

            let img = document.createElement('img')
            img.className = 'img'
            img.src = `https://image.tmdb.org/t/p/w500/${movies5[i].poster_path}`


            let info = document.createElement('div')
            info.className = 'info'

            let movTitle = document.createElement('div')
            movTitle.className = 'movTitle'
            movTitle.textContent = `${movies5[i].title}`

            let describe = document.createElement('div')
            describe.className = 'describe'
            describe.textContent = `개봉일: ${movies5[i].release_date}`

            dragTop3.appendChild( cardBox )
            cardBox.appendChild( movImg )
            cardBox.appendChild( info )
            movImg.appendChild( img ) 
            info.appendChild( movTitle )
            info.appendChild( describe )
        }
        })

        let dragTop = document.querySelectorAll('.dragTop')

        function dragAble( a ){
            let down = false, transX = 0, pointX = 0
            
            a.addEventListener( 'mousedown', (e)=>{
                down = true
                pointX = e.clientX
                e.preventDefault()
                a.style.cursor = 'grabbing'
            })

            window.addEventListener('mousemove', (e)=>{
                if( !down ) return
                let deltaX =  e.clientX - pointX
                pointX = e.clientX
                transX += deltaX
                a.style.transform  = `translateX( ${transX}px)`
            })

            window.addEventListener('mouseup', (e)=>{
                down = false
                a.style.cursor = ''
            })
        }

        dragTop.forEach( item => dragAble(item))

