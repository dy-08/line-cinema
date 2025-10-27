let userVerify = ''
let codeString = ''
let warnMsg2 = document.getElementById('loginWarn2')
let agreeRadio = document.getElementById('agree')
let disagreeRadio = document.getElementById('disagree')
let loginInputs = document.querySelectorAll('.login-input')

function loginCheck() {
    let userName = document.getElementById('loginName').value
    let userBirth = document.getElementById('loginBirth').value
    let userNum = document.getElementById('loginNumber').value
    userVerify = document.getElementById('loginVerify').value
    let userPw = document.getElementById('loginPassword').value.toString()
    let userPw2 = document.getElementById('loginPassword2').value.toString()

    let warnMsg = document.getElementById('loginWarn')

    let verifyBtn = document.getElementById('verifyBtn')
    let verifyBtn2 = document.getElementById('verifyBtn2')

    let regexName = /^[가-힣]{2,4}$/;
    let regexBirth = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
    let regexNum = /^\d{10,11}$/;
    let regexPw = /^\d{4}$/;

    if (!regexName.test(userName)) {
        warnMsg.innerText = '이름을 정확히 입력해주세요.'
        return
    } else {
        warnMsg.innerHTML = ''
    }
    if (userBirth !== '' && !regexBirth.test(userBirth)) {
        warnMsg.innerText = '생년월일을 정확히 입력해주세요.'
        return
    } else {
        warnMsg.innerHTML = ''
    }
    if (userNum !== '' && !regexNum.test(userNum)) {
        warnMsg.innerText = '휴대폰번호를 정확히 입력해주세요.'
        return
    } else {
        warnMsg.innerHTML = ''
    }

    verifyBtn.removeEventListener('click', checkNumber)

    if (regexNum.test(userNum)) {
        verifyBtn.addEventListener('click', checkNumber)
        verifyBtn.classList.add('active')
    } else if (userNum == '') {
        verifyBtn.classList.remove('active')
    }
    if (userVerify) {
        verifyBtn2.classList.add('active')
    } else {
        verifyBtn2.classList.remove('active')
    }
    if (userPw !== '' && !regexPw.test(userPw)) {
        warnMsg2.innerText = '비밀번호를 정확히 입력해주세요.'
        return
    } else {
        warnMsg2.innerHTML = ''
    }
    if (userPw2 !== '' && userPw !== userPw2) {
        warnMsg2.innerText = '비밀번호가 일치하지 않습니다.'
        return
    } else {
        warnMsg2.innerHTML = ''
    }
}

function checkNumber() {
    window.open('./verificationCode.html', 'pop', 'top=200,left=10,width=500,height=300')
}

function codeNumber(arrCode) {
    let verifyCode = []
    verifyCode = arrCode
    codeString = verifyCode.join('')
    console.log(codeString)
}

function checkNumber2() {
    if (codeString !== userVerify) {
        warnMsg2.innerHTML = '인증번호가 일치하지 않습니다.'
        verifyBtn2.classList.remove('active')
    }
}

function agreeCheck() {
    let confirmBtn = document.querySelector('.login-confirmBtn')
    if (agreeRadio.checked) {
        confirmBtn.classList.add('active')
    } else {
        confirmBtn.classList.remove('active')
    }
}

loginInputs.forEach((userInfo) => {
    userInfo.addEventListener('blur', loginCheck)
})

agreeRadio.addEventListener('change', agreeCheck)
disagreeRadio.addEventListener('change', agreeCheck)



