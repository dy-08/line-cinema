export function init() {
  let userVerify = '';
  let codeString = '';

  const warnMsg = document.getElementById('loginWarn');
  const warnMsg2 = document.getElementById('loginWarn2');
  const agreeRadio = document.getElementById('agree');
  const disagreeRadio = document.getElementById('disagree');
  const loginInputs = document.querySelectorAll('.login-input');
  const verifyBtn = document.getElementById('verifyBtn');
  const verifyBtn2 = document.getElementById('verifyBtn2');

  function loginCheck() {
    const userName = document.getElementById('loginName').value;
    const userBirth = document.getElementById('loginBirth').value;
    const userNum = document.getElementById('loginNumber').value;
    userVerify = document.getElementById('loginVerify').value;
    const userPw = document.getElementById('loginPassword').value.toString();
    const userPw2 = document.getElementById('loginPassword2').value.toString();

    const regexName = /^[가-힣]{2,4}$/;
    const regexBirth = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
    const regexNum = /^\d{10,11}$/;
    const regexPw = /^\d{4}$/;

    if (!regexName.test(userName)) {
      warnMsg.innerText = '이름을 정확히 입력해주세요.';
      return;
    } else warnMsg.innerHTML = '';

    if (userBirth !== '' && !regexBirth.test(userBirth)) {
      warnMsg.innerText = '생년월일을 정확히 입력해주세요.';
      return;
    } else warnMsg.innerHTML = '';

    if (userNum !== '' && !regexNum.test(userNum)) {
      warnMsg.innerText = '휴대폰번호를 정확히 입력해주세요.';
      return;
    } else warnMsg.innerHTML = '';

    verifyBtn.removeEventListener('click', checkNumber);
    if (regexNum.test(userNum)) {
      verifyBtn.addEventListener('click', checkNumber);
      verifyBtn.classList.add('active');
    } else if (userNum === '') {
      verifyBtn.classList.remove('active');
    }

    if (userVerify) verifyBtn2.classList.add('active');
    else verifyBtn2.classList.remove('active');

    if (userPw !== '' && !regexPw.test(userPw)) {
      warnMsg2.innerText = '비밀번호를 정확히 입력해주세요.';
      return;
    } else warnMsg2.innerHTML = '';

    if (userPw2 !== '' && userPw !== userPw2) {
      warnMsg2.innerText = '비밀번호가 일치하지 않습니다.';
      return;
    } else warnMsg2.innerHTML = '';
  }

  function checkNumber() {
    window.open(
      './src/html/verify.html',
      'pop',
      'top=200,left=10,width=500,height=300'
    );
  }

  // ✅ 팝업에서 호출할 수 있게 전역으로 등록
  window.codeNumber = function (arrCode) {
    codeString = (arrCode || []).join('');
    console.log('인증 코드 수신 완료:', codeString);
  };

  function checkNumber2() {
    console.log('codeString:', codeString);
    console.log('userVerify:', userVerify);
    if (codeString !== userVerify) {
      warnMsg2.innerHTML = '인증번호가 일치하지 않습니다.';
      verifyBtn2.classList.remove('active');
    }
  }

  function agreeCheck() {
    const confirmBtn = document.querySelector('.login-confirmBtn');
    confirmBtn.classList.toggle('active', !!agreeRadio?.checked);
  }

  loginInputs.forEach((el) => el.addEventListener('blur', loginCheck));
  agreeRadio?.addEventListener('change', agreeCheck);
  disagreeRadio?.addEventListener('change', agreeCheck);
  verifyBtn2.addEventListener('click', checkNumber2);
}
