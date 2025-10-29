import { state } from './state.js';
const MAX_COUNT = 8;

function createSeats(row, col) {
    const map = document.getElementById('seat-map-inner');
    const frag = document.createDocumentFragment();

    for (let i = 0; i < row.length; i++) {
        for (let j = 1; j <= col; j++) {
            const button = document.createElement('button');
            button.className = 'seat font-numeric';
            button.dataset.seat = row[i] + j;
            button.textContent = j;

            frag.appendChild(button);
        }
    }
    map.innerHTML = '';
    map.appendChild(frag);
    return map;
}

function applySoldSeats(map, soldCount, totalSeats) {
    console.log(map, soldCount);
    const picked = new Set();
    while (picked.size < soldCount) {
        picked.add(Math.floor(Math.random() * totalSeats));
    }
    console.log('picked:', picked);
    // 불가능한 자리 업데이트 (처리용)
    state.cart.seats.soldNumber = [...picked];

    const seats = document.querySelectorAll('#seat-map-inner button');
    picked.forEach((idx) => {
        const seat = seats[idx];
        //  불가능한 자리 업데이트 (랜더링용)
        state.cart.seats.sold.push(seats[idx].dataset.seat);
        seat.disabled = true;
        seat.classList.add('sold');
    });
}

function toggleSeatSelection(seat) {
    const selected = state.cart.seats.select;
    const seatId = seat.dataset.seat;

    const idx = selected.indexOf(seatId);

    if (idx !== -1) {
        selected.splice(idx, 1);
        seat.classList.remove('selected');
    } else {
        if (selected.length >= MAX_COUNT) {
            alert(`최대 ${MAX_COUNT}개까지 선택할 수 있습니다.`);
            return;
        }
        selected.push(seatId);
        seat.classList.add('selected');
        console.log(state.cart);
    }
}

function renderSelectedSeats() {
    const sleectedSeats = [...state.cart.seats.select];
    console.log('sleectedSeats:', sleectedSeats);

    const container = document.querySelector('.seat-selected-list');
    const frag = document.createDocumentFragment();

    sleectedSeats.forEach((seat, i) => {
        const div = document.createElement('div');
        div.className = 'seat-selected';
        div.textContent = `${sleectedSeats[i]}`;
        frag.appendChild(div);
    });
    console.log('frag:', frag);
    container.innerHTML = '';
    return container.appendChild(frag);
}

// 진행중
function calcTotalPrice() {
    const container = document.querySelector('.seat-price-total');

    const totalPrice = state.pricePerSeat * state.seats.select.length;
    return (container.innerHTML = totalPrice);
}

function bindSeatClick(map) {
    const seats = map.querySelectorAll('button:not(.sold)');
    seats.forEach((seat) => {
        seat.addEventListener('click', () => {
            toggleSeatSelection(seat);
            renderSelectedSeats();
        });
    });
}
function renderScreeningInfo() {
    const container = document.querySelector('.seat-info');
    return (container.innerHTML = `
      <div>
        <span class="seat-info-age">${state.cart.movie.age}</span>
        <span class="seat-info-title">${state.cart.movie.title}</span>
      </div>
      <div>
        <div class="seat-info-time">
        <p>라인시네마 <span class="seat-info-auditorium">${state.cart.showtimes.auditorium}</span></p>
        <p><span class="seat-info-date">${state.cart.date.bookingDate}</span><span class="seat-info-day"> ${state.cart.date.day}</span></p>
        <p><span>${state.cart.showtimes.time}</span></p>
      </div>
      <div class="seat-info-poster">
        <img src="https://image.tmdb.org/t/p/w500${state.cart.movie.poster_path}" alt="${state.cart.movie.posterName}" />
      </div>
      </div>
      <div>
        <div class="seat-selected-titleWrap">
          <span class="seat-selected-title">선택좌석</span>
        </div>
        <div class="seat-selected-list"></div>
      </div>
      <div class="seat-price">
        <div class="seat-price-title">최종결제금액</div>
        <div><span class="seat-price-total"></span>원</div>
      </div>
      <div class="seat-btns">
        <button>이전</button>
        <button>다음</button>
      </div>
      `);
}

export function initSeatPage() {
    console.log('seat-state:', state);
    const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const col = 14;
    const map = createSeats(row, col);

    const totalSeats = row.length * col;
    const remain = state.cart.showtimes.remain;
    const soldCount = totalSeats - remain;
    applySoldSeats(map, soldCount, totalSeats);
    renderScreeningInfo();
    bindSeatClick(map);
}
