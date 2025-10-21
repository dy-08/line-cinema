async function fetchEventHotData() {
  try {
    const res = await fetch('./public/json/event/hotevent.json');
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

function renderEventHotList(events) {
  const container = document.getElementById('hotevent-inner');
  if (!container) return;
  if (!events) return;

  container.innerHTML = events
    .map(
      (event) => `
    <div class="hotevent-item-wrap">
        <a href="${event.url}" class="hotevent-item-link">
          <div class="hotevent-item-img">
            <img
              src="${event.imagePath}"
              alt="${event.title}"
            />
          </div>
          <div class="hotevent-info-wrap">
            <div class="hotevent-info-top">
              <p class="hotevent-info-category">${event.category}</p>
              <p class="hotevent-info-title">
                ${event.title}
              </p>
            </div>
            <div class="hotevent-info-date font-numeric">
              <span>${event.startDate}</span> &#126; <span>${event.endDate}</span>
            </div>
          </div>
        </a>
    </div>
    `
    )
    .join(' ');
}

export async function eventHot() {
  const events = await fetchEventHotData();
  renderEventHotList(events);
}

eventHot();
