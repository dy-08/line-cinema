export class Cart {
  constructor() {
    this.movie = {
      id: null,
      title: null,
      overview: null,
      poster_path: null,
      adult: null,
      age: null,
      videoKey: null,
      videoName: null,
    };
    this.date = {
      bookingDate: null,
      day: null,
    };
    this.showtimes = {
      time: null,
      auditorium: null,
      total: null,
      remain: null,
    };
    this.userId = null;
    this.seats = [];
    this.account = null;
    this.status = 'idle'; // 'idle' → 'selecting' → 'identifying' → 'seating' → 'paying' → 'confirmed'
    this.pricePerSeat = 11000;
    this.amount = 0;
  }

  setMovie(data) {
    this.movie = data;
  }
  setDate(data) {
    this.date = data;
  }
  setShowtimes(data) {
    this.showtimes = data;
  }
  setStatus(data) {
    this.status = data;
  }
  getDate() {
    return this.movie;
  }
}
