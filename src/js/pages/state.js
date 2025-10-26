import { Cart } from './cart.js';
import { Guest } from './guest.js';
import { Payment } from './payment.js';

export const state = {
  cart: new Cart(), // 진행 중 장바구니 (세션 저장 대상)
  guest: new Guest(), // 비회원 정보 (세션 저장 대상)
  payment: new Payment(), // 가상계좌(결제의도) (세션 저장 대상)
};

// mem.cart = defaultCart();
// mem.cart.movie = { id: 1, title: '베놈' };
// mem.cart.date = '2025-10-21T19:30:00+09:00';

// 세션에 저장
// sessionStorage.setItem(KEY_CART, JSON.stringify(mem.cart));

// 콘솔에서 확인
// JSON.parse(sessionStorage.getItem('LC_CART'));
