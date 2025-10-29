import { save, state } from './state.js';
import { STORAGE_KEYS } from '../config/config.js';
import { fetchPage } from './main.js';
import { initAccountPage } from './account.js';
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
function getSeatIndex(map, seat) {
  const btns = map.querySelectorAll('button');
  for (let i = 0; i < btns.length; i++) {
    if (btns[i].dataset.seat === seat.dataset.seat) return i;
  }
  return -1;
}

// 🌟
function toggleSeatSelection(map, seat) {
  const selected = state.cart.seats.select;
  const selectedNumber = state.cart.seats.selectNumber;
  const seatId = seat.dataset.seat;

  const existsAt = selected.indexOf(seatId);
  const seatIdx = getSeatIndex(map, seat); // 버튼 인덱스(값)

  if (existsAt !== -1) {
    selected.splice(existsAt, 1);
    seat.classList.remove('selected');
    state.cart.amount--;

    const pos = selectedNumber.indexOf(seatIdx);
    if (pos !== -1) selectedNumber.splice(pos, 1);
    console.log(state.cart);
  } else {
    if (selected.length >= MAX_COUNT) {
      alert(`최대 ${MAX_COUNT}개까지 선택할 수 있습니다.`);
      return;
    }
    selected.push(seatId);
    seat.classList.add('selected');

    if (!selectedNumber.includes(seatIdx)) {
      selectedNumber.push(seatIdx);
      console.log(state.cart);
      console.log(state);
    }
    state.cart.amount++;
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

function updateTotalPrice() {
  const container = document.querySelector('.seat-price-total');
  const totalPrice = state.cart.pricePerSeat * state.cart.amount;
  container.innerHTML = totalPrice;
}

function bindSeatClick(map) {
  const seats = map.querySelectorAll('button:not(.sold)');
  seats.forEach((seat) => {
    seat.addEventListener('click', () => {
      toggleSeatSelection(map, seat);
      renderSelectedSeats();
      updateTotalPrice();
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
        <button id="seat-btn-next">다음</button>
      </div>
      `);
}

async function bindNextButton() {
  if (!state.cart.seats.select || !state.cart.seats.selectNumber) return;
  const { html } = await fetchPage('account');
  state.cart.status = 'paying';
  save(STORAGE_KEYS.CART, state.cart);
  save(STORAGE_KEYS.GUEST, state.guest);
  save(STORAGE_KEYS.MOVIELIST, state.movieList);
  save(STORAGE_KEYS.SHOWTIMES, state.showtimeMap);
  const app = document.getElementById('app');
  app.innerHTML = html;
  requestAnimationFrame(initAccountPage);
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

  const next = document.getElementById('seat-btn-next');
  requestAnimationFrame(() => {
    console.log(state);

    next.addEventListener('click', bindNextButton);
  });
}
