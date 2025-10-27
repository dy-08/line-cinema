let code = document.querySelectorAll('.ver-code')
let arrCode = []
code.forEach((item) => {
    let num = 0
    num = Math.floor(Math.random() * 10)
    item.textContent = num
    arrCode.push(num)
})

if (window.opener && !window.opener.closed) {
    window.opener.codeNumber(arrCode)
}


