import { STORAGE_KEYS } from '../config.js'

function inquiryGuest() {
    const inquiryBtn = document.getElementById('inquiryBtn')

    inquiryBtn.addEventListener('click', () => {
        const inquiryName = document.getElementById('inquiryName').value.trim()
        const inquiryBirth = document.getElementById('inquiryBirth').value.trim()
        const inquiryPassword = document.getElementById('inquiryPassword').value.trim()

        const guestData = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKING))

        if (!guestData) {
            alert('저장된 예약 정보가 없습니다.')
            return
        }

        if (
            inquiryName === guestData.name &&
            inquiryBirth === guestData.birth &&
            inquiryPassword == guestData.pw
        ) {
            const videoCard = document.querySelector('.inq-videoCard')
            const movInfo = document.querySelector('.inq-movInfo')
            videoCard.style.display = 'none'
            movInfo.style.display = 'flex'

            inquiryMovie(guestData)
        } else {
            alert('입력한 정보가 일치하지 않습니다.')
        }
    })
}

inquiryGuest()

function inquiryMovie(guestData) {
    if (!guestData) return

    const age = document.querySelector('.inq-info-age')
    const title = document.querySelector('.inq-info-movTitle')
    const movPoster = document.querySelector('#movPoster')
    const auditorium = document.querySelector('.inq-info-auditorium')
    const seat = document.querySelector('.inq-info-seat')
    const movDate = document.querySelector('.inq-info-date')
    const movDay = document.querySelector('.inq-info-day')
    const movTime = document.querySelector('.inq-info-time')
    const amount = document.querySelector('.inq-info-amount')
    const totalPrice = document.querySelector('.inq-price-total')

    age.textContent = guestData.age
    title.textContent = guestData.title
    movPoster.src = guestData.poster
    auditorium.textContent = guestData.auditorium
    seat.textContent = guestData.seats.join(', ')
    movDate.textContent = guestData.date
    movDay.textContent = `(${guestData.day})`
    movTime.textContent = guestData.time
    amount.textContent = guestData.amount
    totalPrice.textContent = guestData.totalPrice
}
