// 승아님 카드 ui 작업섹션
let inBox = document.querySelector('.inBox')

        for( let i=0; i<20; i++){
            let cardBox = document.createElement('div')
            cardBox.className = 'cardBox'

            let movImg = document.createElement('div')
            movImg.className = 'movImg'

            let img = document.createElement('img')

            let info = document.createElement('div')
            info.className = 'info'

            let movTitle = document.createElement('div')
            movTitle.className = 'movTitle'

            let describe = document.createElement('div')
            describe.className = 'describe'

            inBox.appendChild( cardBox )
            cardBox.appendChild( movImg )
            cardBox.appendChild( info )
            movImg.appendChild( img )
            info.appendChild( movTitle )
            info.appendChild( describe )
        }