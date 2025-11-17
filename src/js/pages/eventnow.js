async function fetchEventNowData() {
  try {
    const res = await fetch('./public/json/event/eventnow.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data.events) {
      throw new Error(`JSON error!`);
    }
    return data.events;
  } catch (e) {
    console.error('[fetchEventNowData Error]', e);
    return [];
  }
}

function renderEventNowList(events) {
  const container = document.getElementById('eventnow-inner');
  if (!container) return;
  if (!events) return;

  container.innerHTML = events
    .map(
      (event) => `
    <div class="eventnow-card-wrap">
      <a href="#">
        <div class="eventnow-card-top">
          <img src="${event.imagePath}" alt="${event.title}" />
        </div>
        <div class="eventnow-card-bottom">
          <p>${event.title}</p>
          <p class="font-numeric"><span>${event.startDate}</span> &#126; <span>${event.endDate}</span></p>
        </div>
      </a>
    </div>
    `
    )
    .join(' ');
}

export async function eventNow() {
  const events = await fetchEventNowData();
  renderEventNowList(events);
}
