import { STORAGE_KEYS } from '../config/config.js';
import { state, save, load } from './state.js';

export function init() {
  console.log(state);

  let userVerify = '';
  let codeString = '';

  const warnMsg = document.getElementById('loginWarn');
  const warnMsg2 = document.getElementById('loginWarn2');
  const agreeRadio = document.getElementById('agree');
  const disagreeRadio = document.getElementById('disagree');
  const loginInputs = document.querySelectorAll('.login-input');
  const verifyBtn = document.getElementById('verifyBtn');
  const verifyBtn2 = document.getElementById('verifyBtn2');
  const confirmBtn = document.querySelector('.login-confirmBtn');

  function loginCheck() {
    const userName = document.getElementById('loginName').value.trim();
    const userBirth = document.getElementById('loginBirth').value.trim();
    const userNum = document.getElementById('loginNumber').value.trim();
    userVerify = document.getElementById('loginVerify').value.trim();
    const userPw = document
      .getElementById('loginPassword')
      .value.trim()
      .toString();
    const userPw2 = document
      .getElementById('loginPassword2')
      .value.trim()
      .toString();

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
    confirmBtn.classList.toggle('active', !!agreeRadio?.checked);
  }

  function getGuestInfo() {
    const userName = document.getElementById('loginName').value.trim();
    const userBirth = document.getElementById('loginBirth').value.trim();
    const userNum = document.getElementById('loginNumber').value.trim();
    const userPw = document.getElementById('loginPassword').value.trim();
    const userPw2 = document.getElementById('loginPassword2').value.trim();

    if (warnMsg.innerHTML) return;
    if (
      !userName ||
      !userBirth ||
      !userNum ||
      !userPw ||
      !userPw2 ||
      !agreeRadio.checked
    )
      return;

    state.guest.setName(userName);
    state.guest.setBirth(userBirth);
    state.guest.setNumber(userNum);
    state.guest.setPassword(userPw);
    state.guest.setAgreedPrivacy(agreeRadio.checked);

    save(STORAGE_KEYS.GUEST, state.guest);
    state.cart.setStatus('seating');
    save(STORAGE_KEYS.CART, state.cart);
    console.log('state:', state);

    const msg = document.getElementById('state-msg');
    msg.innerHTML = '비회원 정보가 저장되었습니다.';
    msg.classList.add('up');

    loginInputs.forEach((el) => (el.value = ''));
    userVerify = '';
    codeString = '';
    if (agreeRadio) agreeRadio.checked = false;
    if (disagreeRadio) disagreeRadio.checked = false;
    verifyBtn?.classList.remove('active');
    verifyBtn2?.classList.remove('active');

    setTimeout(() => {
      msg.innerHTML = '';
      msg.classList.remove('up');
    }, 2000);
  }

  loginInputs.forEach((el) => el.addEventListener('blur', loginCheck));
  agreeRadio?.addEventListener('change', agreeCheck);
  disagreeRadio?.addEventListener('change', agreeCheck);
  verifyBtn2.addEventListener('click', checkNumber2);
  confirmBtn.addEventListener('click', getGuestInfo);
}
