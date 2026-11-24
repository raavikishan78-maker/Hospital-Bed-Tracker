let beds = getBedData();

function showHomePreview() {
  let area = document.getElementById("homePreview");
  if (area === null) {
    return;
  }

  area.innerHTML = "";
  beds.forEach(function (bed) {
    let available = getAvailable(bed);
    area.innerHTML +=
      '<article class="preview-card"><small>' + bed.name + '</small>' +
      '<strong>' + available + '</strong><span>available</span></article>';
  });
}

function showDashboard() {
  let dashboard = document.getElementById("dashboardCards");
  if (dashboard === null) {
    return;
  }

  let availableBeds = 0;
  let occupiedBeds = 0;
  let availableVentilators = 0;

  dashboard.innerHTML = "";
  beds.forEach(function (bed) {
    let available = getAvailable(bed);
    let status = getStatus(available);
    let percent = bed.total === 0 ? 0 : Math.round((bed.occupied / bed.total) * 100);

    if (bed.id === "ventilator") {
      availableVentilators = available;
    } else {
      availableBeds += available;
      occupiedBeds += bed.occupied;
    }

    dashboard.innerHTML +=
      '<article class="bed-card">' +
      '<div class="bed-card-head"><h2>' + bed.name + '</h2>' +
      '<span class="status ' + status.className + '">' + status.text + '</span></div>' +
      '<div class="bed-numbers"><div><strong>' + bed.total + '</strong><span>Total</span></div>' +
      '<div><strong>' + bed.occupied + '</strong><span>Occupied</span></div>' +
      '<div><strong>' + available + '</strong><span>Available</span></div></div>' +
      '<div class="progress"><div style="width:' + percent + '%"></div></div></article>';
  });

  document.getElementById("availableBeds").textContent = availableBeds;
  document.getElementById("occupiedBeds").textContent = occupiedBeds;
  document.getElementById("availableVentilators").textContent = availableVentilators;
  document.getElementById("updatedTime").textContent = getLastUpdated();
}

function showStockTable() {
  let table = document.getElementById("stockTable");
  if (table === null) {
    return;
  }

  table.innerHTML = "";
  let availableBeds = 0;
  let occupiedBeds = 0;
  let availableVentilators = 0;

  beds.forEach(function (bed) {
    let available = getAvailable(bed);
    let status = getStatus(available);
    if (bed.id === "ventilator") {
      availableVentilators = available;
    } else {
      availableBeds += available;
      occupiedBeds += bed.occupied;
    }

    table.innerHTML +=
      '<tr><td><strong>' + bed.name + '</strong></td><td>' + bed.total + '</td>' +
      '<td>' + bed.occupied + '</td><td>' + available + '</td>' +
      '<td><span class="status ' + status.className + '">' + status.text + '</span></td></tr>';
  });

  document.getElementById("stockSummary").innerHTML =
    "<span><strong>" + availableBeds + "</strong> available beds</span>" +
    "<span><strong>" + occupiedBeds + "</strong> occupied beds</span>" +
    "<span><strong>" + availableVentilators + "</strong> available ventilators</span>";
}

showHomePreview();
showDashboard();
showStockTable();
