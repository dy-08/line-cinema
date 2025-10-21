const KEY_CART = 'LC_CART';
const KEY_BOOKINGS = 'LC_BOOKINGS';

const mem = {
  cart: null,
  bookings: null,
};

function defaultCart() {
  return {
    movie: null, // { id, title, posterPath, pricePerSeat }
    date: null, // '2025-10-21T19:30:00+09:00' 같은 문자열
    userId: null, // 비회원 식별용 입력값
    seats: [], // 최대 4석
    account: null, // 결제 단계에서 채움: { bank, accountNo, amount, expireAt, status }
    status: 'idle', // 'idle' → 'selecting' → 'seating' → 'paying' → 'confirmed'
    pricePerSeat: 11000, // 좌석 1장 기본 가격
    amount: 0, // 선택 좌석 수 × pricePerSeat
  };
}

mem.cart = defaultCart();
mem.cart.movie = { id: 1, title: '베놈' };
mem.cart.date = '2025-10-21T19:30:00+09:00';

// 세션에 저장
sessionStorage.setItem('LC_CART', JSON.stringify(mem.cart));

// 콘솔에서 확인
JSON.parse(sessionStorage.getItem('LC_CART'));
