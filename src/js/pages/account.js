import { save, state, load } from './state.js';
import { STORAGE_KEYS } from '../config/config.js';
import { fetchPage, initSlider } from './main.js';
import { fetchNowPlayingInKorea, renderDate } from './quickbooking.js';

async function handlePayment() {
    if (!state.payment) return;
    state.cart.setStatus('confirmed');
    save(STORAGE_KEYS.CART, state.cart);

    const booking = {
        name: state.guest.name,
        birth: state.guest.birth,
        pw: state.guest.password,

        title: state.cart.movie.title,
        poster: state.cart.movie.poster_path,
        age: state.cart.movie.age,

        date: state.cart.date.bookingDate,
        day: state.cart.date.day,
        time: state.cart.showtimes.time,
        auditorium: state.cart.showtimes.auditorium,

        seats: [...state.cart.seats.select],
        amount: state.cart.amount,
        pricePerSeat: state.cart.pricePerSeat,
        totalPrice: state.cart.pricePerSeat * state.cart.amount,

        bank: state.payment.bank,
        accountNumber: state.payment.number,
    };
    console.log('마지막데이터:', booking);

    localStorage.setItem(STORAGE_KEYS.BOOKING, JSON.stringify(booking));

    const { html } = await fetchPage('index');
    const app = document.getElementById('app');
    app.innerHTML = html;
    requestAnimationFrame(initSlider);
}

async function handleCancelPayment() {
    state.cart.setStatus('selecting');

    save(STORAGE_KEYS.CART, state.cart);

    const { html } = await fetchPage('quickbooking');
    const app = document.getElementById('app');
    app.innerHTML = html;
    setTimeout(() => {
        fetchNowPlayingInKorea();
        renderDate();
    }, 1000);
}

function bindAccountPageEvents() {
    const payBtn = document.querySelector('.account-btn-pay');
    const cancelBtn = document.querySelector('.account-btn-cancel');

    payBtn.addEventListener('click', handlePayment);
    cancelBtn.addEventListener('click', handleCancelPayment);
}

function renderVirtualAccountDetails(selected) {
    const container = document.querySelector('.virtual-account-info');
    console.log(selected);
    state.payment = selected;
    container.classList.add('op');
    return (container.innerHTML = `
  <p><span class="bank-logo"><img src="${selected.image}" alt="${selected.bank}"></span>${selected.bank}</p>
              <p>${selected.number}</p>
              <p>${selected.holder}</p>`);
}

function bindAccountButtons(data) {
    const buttons = document.querySelectorAll('.account-btns');
    console.log(buttons);
    buttons.forEach((item) => {
        item.addEventListener('click', () => {
            const bank = item.textContent.trim();
            const selected = data.accounts.find((acc) => acc.bank === bank);
            if (!selected) return;

            renderVirtualAccountDetails(selected);
        });
    });
}

function createButtons(data) {
    const container = document.querySelector('.account-btns-wrap');
    const frag = document.createDocumentFragment();
    container.innerHTML = '';

    data.accounts.map((item) => {
        const button = document.createElement('button');
        button.textContent = item.bank;
        button.className = 'account-btns';
        frag.appendChild(button);
    });
    return container.appendChild(frag);
}

async function getVirtualAccountInfo() {
    try {
        const url = './public/json/account.json';
        const res = await fetch(url);
        const data = await res.json();
        createButtons(data);
        bindAccountButtons(data);
    } catch (error) {
        console.error('은행정보(가상계좌) 에러: ', error);
    }
}
function renderPayInfo() {
    const container = document.querySelector('.account-right-inner');
    const totalPrice = (state.cart.pricePerSeat * state.cart.amount).toLocaleString();
    return (container.innerHTML = `
    <div>
              <div>
                <p class="account-text-md">결제금액</p>
              </div>
              <div class="account-top-wrap">
                <div class="account-pay-top">
                  <p>성인<span> ${state.cart.amount}</span></p>
                  <p><span>${totalPrice}</span></p>
                </div>
                <div class="account-pay-top">
                  <p>금액</p>
                  <p><span>${totalPrice}</span> 원</p>
                </div>
              </div>
            </div>
            <div class="virtual-account-info">
            </div>
            <div>
              <div class="account-pay-bottom">
                <p>최종결제금액</p>
                <p><span>${totalPrice}</span> 원</p>
              </div>
              <div class="account-pay-bottom">
                <p>결제수단</p>
                <p>가상계좌</p>
              </div>
            </div>`);
}

function renderAccountInfo() {
    const container = document.querySelector('.account-info');
    const seats = [...state.cart.seats.select];
    const seat = seats.join(', ');
    return (container.innerHTML = `
    <div class="account-text-md">예매정보</div>
            <div class="account-info-detail">
              <div class="account-posterwrap">
                <img class="account-poster" src="https://image.tmdb.org/t/p/w500${state.cart.movie.poster_path}" alt="${state.cart.movie.title}" />
              </div>
              <div>
                <p class="account-info-title">${state.cart.movie.title}</p>
                <p class="account-info-date">
                  <span class="font-numeric">${state.cart.date.bookingDate}</span><span> (${state.cart.date.day})</span
                  ><span> ${state.cart.showtimes.time}</span>
                </p>
                <p class="account-info-audi">
                  <span>라인시네마</span>
                  <span class="font-numeric">${state.cart.showtimes.auditorium}</span>
                </p>
                <p class="account-info-seat">
                  <span>좌석</span>
                  <span class="font-numeric">${seat}</span>
                </p>
                <p class="account-info-amount">
                  성인<span class="font-numeric"> ${state.cart.amount}</span>
                </p>
              </div>
            </div>
    `);
}

function loadStorage() {
    load(STORAGE_KEYS.CART, -1);
    load(STORAGE_KEYS.GUEST, -1);
    load(STORAGE_KEYS.MOVIELIST, -1);
    load(STORAGE_KEYS.PAYMENT, -1);
}
export function initAccountPage() {
    loadStorage();
    renderAccountInfo();
    renderPayInfo();
    getVirtualAccountInfo();
    bindAccountPageEvents();
}
