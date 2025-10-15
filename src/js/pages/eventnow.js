async function fetchEvent() {
    const res = await fetch('../../../public/json/event/eventnow.json');
    const data = await res.json();
    console.log(data);
}
