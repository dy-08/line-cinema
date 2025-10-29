import { state } from './state.js';

function getCart() {
    const movImg = document.querySelector('.pay-movImg')
    const posterPath = document.createElement('img')
    posterPath.src = state.cart.movie.poster_path
    posterPath.alt = 'img'
    movImg.appendChild(posterPath)

    const movTitle = document.querySelector('.pay-movTitle')
    movTitle.textContent = state.cart.movie.title

    const bookingDate = document.getElementById('bookingDate')
    bookingDate.textContent = state.cart.date.bookingDate

    const movDay = document.getElementById('movDay')
    movDay.textContent = state.cart.date.day
    console.log(movDay)

    const movTime = document.getElementById('movTime')
    movTime.textContent = state.cart.showtimes.time

    const auditorium = document.getElementById('auditorium')
    auditorium.textContent = state.cart.showtimes.auditorium
}
getCart()

let bankInfo = document.querySelector('.pay-bankInfo')
async function fetchAccounts() {
    const res = await fetch('./account.json')
    const data = await res.json()
    const accountsData = data.accounts
    let bankBtns = document.querySelectorAll('.pay-bankBtn')

    accountsData.forEach((dItem) => {
        let dataName = dItem.bank

        bankBtns.forEach((bItem) => {
            bItem.addEventListener('click', () => {
                bankBtns.forEach((btns) => { btns.classList.remove('active') })
                bItem.classList.add('active')
                let bankName = bItem.textContent.trim()
                if (bankName == dataName) {
                    bankInfo.innerHTML = ''
                    let bankCon = document.createElement('div')
                    bankCon.className = 'pay-bankCon'

                    let logoDiv = document.createElement('div')
                    logoDiv.className = 'pay-logoBox'
                    let logoImg = document.createElement('img')
                    logoImg.className = 'pay-logoImg'
                    logoImg.src = dItem.image
                    logoImg.alt = dItem.bank

                    let number = document.createElement('div')
                    number.className = 'pay-number'
                    number.innerHTML = `계좌번호: <strong>${dItem.number}</strong>`

                    let holder = document.createElement('div')
                    holder.className = 'pay-holder'
                    holder.innerHTML = `예금주: ${dItem.holder}`

                    let paymentBox = document.createElement('div')
                    paymentBox.className = 'pay-paymentBox'

                    let title = document.createElement('div')
                    title.className = 'pay-right-title4'
                    title.innerHTML = `최종결제금액`

                    let pay = document.createElement('div')
                    pay.className = 'pay-eval'
                    pay.textContent = (state.cart.pricePerSeat * state.cart.seats.selectNumber.length).toLocaleString()
                    let pay2 = document.createElement('sapn')
                    pay2.className = 'pay-won'
                    pay2.innerHTML = `원`

                    let btnBox = document.createElement('div')
                    btnBox.className = 'pay-right-btnBox'

                    let btn = document.createElement('button')
                    btn.className = 'pay-right-btn'
                    btn.id = ''
                    btn.innerHTML = '이전'

                    let btn2 = document.createElement('button')
                    btn2.className = 'pay-right-btn'
                    btn2.classList.add('pay-right-btn2')
                    btn2.innerHTML = `결제`

                    btn2.addEventListener('click', btnClick)

                    bankInfo.appendChild(bankCon)
                    bankCon.appendChild(logoDiv)
                    logoDiv.appendChild(logoImg)
                    bankCon.appendChild(number)
                    bankCon.appendChild(holder)
                    bankCon.appendChild(paymentBox)
                    paymentBox.appendChild(title)
                    paymentBox.appendChild(pay)
                    pay.appendChild(pay2)
                    bankCon.appendChild(btnBox)
                    btnBox.appendChild(btn)
                    btnBox.appendChild(btn2)
                }
            })
        })
    })
}

fetchAccounts()

function btnClick() {
    let modal = document.querySelector('.pay-modal')
    modal.style.display = 'block'
}

let goHome = document.getElementById('pay-goHome')
goHome.addEventListener('click', () => {
    location.href = 'index.html'
})