function generateCode() {
    const codeEls = document.querySelectorAll('.ver-code');
    const arrCode = [];

    codeEls.forEach((item) => {
        const num = Math.floor(Math.random() * 10);
        item.textContent = num;
        arrCode.push(num);
    });

    // ✅ 팝업에서 부모창의 codeNumber() 호출
    if (window.opener && !window.opener.closed) {
        if (typeof window.opener.codeNumber === 'function') {
            window.opener.codeNumber(arrCode);
        } else {
            console.error('부모창에 codeNumber()가 정의되어 있지 않음!');
        }
    }

    return arrCode;
}

// 팝업 HTML에서 자동 실행되도록 window에 붙임
window.addEventListener('DOMContentLoaded', generateCode);
