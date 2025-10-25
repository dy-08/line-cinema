export class Cart {
  constructor() {
    this.movie = null; // { id, title, posterPath, pricePerSeat }
    this.date = null; // '2025-10-21T19:30:00+09:00' 같은 문자열
    this.userId = null; // 비회원 식별용 입력값
    this.seats = []; // 최대 4석
    this.account = null; // 결제 단계에서 채움: { bank, accountNo, amount, expireAt, status }
    this.status = 'idle'; // 'idle' → 'selecting' → 'seating' → 'paying' → 'confirmed'
    this.pricePerSeat = 11000; // 좌석 1장 기본 가격
    this.amount = 0; // 선택 좌석 수 × pricePerSeat
  }
}
