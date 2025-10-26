export class Payment {
  constructor() {
    this.bank = null; // 은행명 (예: '국민은행')
    this.accountNo = null; // 가상계좌번호
    this.amount = null; // 금액
    this.expireAt = null; // 만료 시각
    this.status = 'idle'; // idle → issued → paid → confirmed → expired/canceled
  }
}
