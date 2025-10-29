import { Cart } from './cart.js';
import { Guest } from './guest.js';
import { Payment } from './payment.js';

export const state = {
  cart: new Cart(), // 진행 중 장바구니 (세션 저장 대상)
  guest: new Guest(), // 비회원 정보 (세션 저장 대상)
  payment: new Payment(), // 가상계좌(결제의도) (세션 저장 대상)
  showtimeMap: {},
  movieList: [],
};

export function save(key, value) {
  return sessionStorage.setItem(key, JSON.stringify(value));
}

export function load(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
