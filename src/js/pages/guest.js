export class Guest {
  constructor() {
    this.name = null; // 이름
    this.birth = null; // 생년월일 앞6자리
    this.number = null; // 하이픈없는 휴대폰번호
    this.password = []; // 숫자 4자리
    this.agreedPrivacy = false; // privacy policy 체크여부
  }
  setName(data) {
    this.name = data;
  }
  setBirth(data) {
    this.birth = data;
  }
  setNumber(data) {
    this.number = data;
  }
  setPassword(data) {
    this.password = data;
  }
  setAgreedPrivacy(data) {
    this.agreedPrivacy = data;
  }
}
