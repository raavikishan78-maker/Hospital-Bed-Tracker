// This key stores demo bed values only in the current browser.
// localStorage is not a real hospital database and data is not shared between devices.
const DEMO_KEY = "cityCareBedData";
const UPDATED_KEY = "cityCareLastUpdated";

const initialBedData = [
  { id: "general", name: "General Ward", total: 40, occupied: 28 },
  { id: "oxygen", name: "Oxygen Beds", total: 20, occupied: 16 },
  { id: "icu", name: "ICU Beds", total: 15, occupied: 7 },
  { id: "ventilator", name: "Ventilators", total: 10, occupied: 10 }
];

function getBedData() {
  let saved = localStorage.getItem(DEMO_KEY);
  if (saved === null) {
    return copyBedData(initialBedData);
  }
  return JSON.parse(saved);
}

function copyBedData(beds) {
  let copy = [];
  beds.forEach(function (bed) {
    copy.push({ id: bed.id, name: bed.name, total: bed.total, occupied: bed.occupied });
  });
  return copy;
}

function saveBedData(beds) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(beds));
  localStorage.setItem(UPDATED_KEY, new Date().toISOString());
}

function resetBedData() {
  let beds = copyBedData(initialBedData);
  localStorage.setItem(DEMO_KEY, JSON.stringify(beds));
  localStorage.setItem(UPDATED_KEY, new Date().toISOString());
  return beds;
}

function getAvailable(bed) {
  let available = bed.total - bed.occupied;
  if (available < 0) {
    return 0;
  }
  return available;
}

function getStatus(available) {
  if (available >= 5) {
    return { text: "GREEN", className: "status-green" };
  }
  if (available >= 1) {
    return { text: "YELLOW", className: "status-yellow" };
  }
  return { text: "RED", className: "status-red" };
}

function getLastUpdated() {
  let value = localStorage.getItem(UPDATED_KEY);
  if (value === null) {
    return "Demo data has not been changed";
  }
  let date = new Date(value);
  return "Last updated: " + date.toLocaleString();
}
