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

function bindSeatClick(map) {
  const seats = map.querySelectorAll('button:not(.sold)');
  seats.forEach((seat) => {
    seat.addEventListener('click', () => {
      toggleSeatSelection(seat);
      //   renderSelectedSeats();
    });
  });
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

  const MAX_COUNT = 8;

  bindSeatClick(map);
}
