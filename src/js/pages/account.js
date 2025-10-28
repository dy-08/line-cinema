
async function fetchAccounts() {
    let bankInfo = document.querySelector('.pay-bankInfo')
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
                    title.innerHTML = `결제금액`

                    let pay = document.createElement('div')
                    pay.className = 'pay-eval'
                    pay.innerHTML = `10,000원`

                    let btnBox = document.createElement('div')
                    btnBox.className = 'pay-right-btnBox'

                    let btn = document.createElement('button')
                    btn.className = 'pay-right-btn'
                    btn.innerHTML = '이전'

                    let btn2 = document.createElement('button')
                    btn2.className = 'pay-right-btn'
                    btn2.classList.add('pay-right-btn2')
                    btn2.innerHTML = `결제`

                    bankInfo.appendChild(bankCon)
                    bankCon.appendChild(logoDiv)
                    logoDiv.appendChild(logoImg)
                    bankCon.appendChild(number)
                    bankCon.appendChild(holder)
                    bankCon.appendChild(paymentBox)
                    paymentBox.appendChild(title)
                    paymentBox.appendChild(pay)
                    bankCon.appendChild(btnBox)
                    btnBox.appendChild(btn)
                    btnBox.appendChild(btn2)
                }
            })
        })
    })
}

fetchAccounts()