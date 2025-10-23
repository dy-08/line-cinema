function loginCheck() {
    let userName = document.getElementById('loginName').value
    let userBirth = document.getElementById('loginBirth').value
    let userNum = document.getElementById('loginNumber').value   // 인증요청버튼
    let userVerify = document.getElementById('loginVerify').value  // 확인 버튼
    let userPw = document.getElementById('loginPassword').value.toString()
    let userPw2 = document.getElementById('loginPassword2').value.toString()

    let verifyBtn = document.getElementById('verifyBtn')  // 여기부터 해 인증요청이랑 확인버튼
    let verifyBtn2 = document.getElementById('verifyBtn2')

    let warnMsg = document.getElementById('loginWarn')
    let warnMsg2 = document.getElementById('loginWarn2')

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

let loginInputs = document.querySelectorAll('.login-input')
loginInputs.forEach((userInfo) => {
    userInfo.addEventListener('blur', loginCheck)
})
