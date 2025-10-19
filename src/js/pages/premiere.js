async function fetchPremiereData() {
  try {
    const res = await fetch('./public/json/event/premiere.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data.events) {
      throw new Error(`JSON error!`);
    }
    return data.events;
  } catch (e) {
    console.error('[fetchPremiereData Error]', e);
    return [];
  }
}

function renderPremiereList(events) {
  const container = document.getElementById('premiere-inner');
  if (!container) return;
  if (!events) return;

  container.innerHTML = events
    .map(
      (event) => `
    <div class="premiere-card-wrap">
      <a href="${event.url}" target="_blank">
        <div class="premiere-card-top" style="background-image: url('${event.imagePath}');")">
            <div class="premiere-card-eventAlert">
                <p class="font-numeric">D &#45; <span>2</span></p>
            </div>
        </div>
        <div class="premiere-card-bottom">
            <p class="font-numeric"><span>${event.startDate}</span> &#126; <span>${event.endDate}</span></p>
        </div>
      </a>
    </div>
    `
    )
    .join(' ');
}

export async function premiere() {
  const events = await fetchPremiereData();
  renderPremiereList(events);
}
