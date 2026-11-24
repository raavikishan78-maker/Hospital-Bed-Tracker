const DEMO_USERNAME = "WIZARD";
const DEMO_PASSWORD = "RSOWIZARD";
let beds = getBedData();

function showLogin() {
  document.getElementById("loginSection").hidden = false;
  document.getElementById("adminSection").hidden = true;
}

function showAdmin() {
  document.getElementById("loginSection").hidden = true;
  document.getElementById("adminSection").hidden = false;
  renderAdminRows();
}

function renderAdminRows() {
  let area = document.getElementById("adminRows");
  area.innerHTML = "";

  beds.forEach(function (bed) {
    let available = getAvailable(bed);
    let status = getStatus(available);
    area.innerHTML +=
      '<div class="admin-row">' +
      '<h3>' + bed.name + '</h3>' +
      '<div class="field-row">' +
      '<div><label>Total capacity</label><input id="' + bed.id + 'Total" type="number" min="0" step="1" value="' + bed.total + '"></div>' +
      '<div><label>Occupied count</label><input id="' + bed.id + 'Occupied" type="number" min="0" step="1" value="' + bed.occupied + '"></div>' +
      '</div><p class="calculated" id="' + bed.id + 'Calculated">Available: ' + available +
      ' - Status: ' + status.text + '</p></div>';

  });

  beds.forEach(function (bed) {
    document.getElementById(bed.id + "Total").addEventListener("input", function () {
      updateCalculatedValue(bed);
    });
    document.getElementById(bed.id + "Occupied").addEventListener("input", function () {
      updateCalculatedValue(bed);
    });
  });
}

function updateCalculatedValue(bed) {
  let total = Number(document.getElementById(bed.id + "Total").value);
  let occupied = Number(document.getElementById(bed.id + "Occupied").value);
  let available = total - occupied;
  if (!Number.isInteger(total) || total < 0 || !Number.isInteger(occupied) || occupied < 0) {
    document.getElementById(bed.id + "Calculated").textContent = "Enter valid whole numbers";
    return;
  }
  if (occupied > total) {
    document.getElementById(bed.id + "Calculated").textContent = "Occupied cannot exceed total";
    return;
  }
  let status = getStatus(available);
  document.getElementById(bed.id + "Calculated").textContent =
    "Available: " + available + " - Status: " + status.text;
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;
  let message = document.getElementById("loginMessage");

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    sessionStorage.setItem("cityCareAdminLoggedIn", "yes");
    message.textContent = "";
    showAdmin();
  } else {
    message.textContent = "Incorrect username or password.";
  }
});

document.getElementById("stockForm").addEventListener("submit", function (event) {
  event.preventDefault();
  let message = document.getElementById("adminMessage");

  for (let i = 0; i < beds.length; i++) {
    let bed = beds[i];
    let total = document.getElementById(bed.id + "Total").value;
    let occupied = document.getElementById(bed.id + "Occupied").value;

    if (total === "" || occupied === "") {
      message.textContent = "All fields are required.";
      return;
    }

    total = Number(total);
    occupied = Number(occupied);
    if (!Number.isInteger(total) || !Number.isInteger(occupied) || total < 0 || occupied < 0) {
      message.textContent = "Total and occupied values must be non-negative whole numbers.";
      return;
    }
    if (occupied > total) {
      message.textContent = "Occupied count cannot exceed total for " + bed.name + ".";
      return;
    }
  }

  beds.forEach(function (bed) {
    bed.total = Number(document.getElementById(bed.id + "Total").value);
    bed.occupied = Number(document.getElementById(bed.id + "Occupied").value);
  });
  saveBedData(beds);
  renderAdminRows();
  message.style.color = "#16866d";
  message.textContent = "Bed counts saved successfully.";
});

document.getElementById("resetButton").addEventListener("click", function () {
  let confirmed = window.confirm("Reset all bed counts to the original demo data?");
  if (confirmed) {
    beds = resetBedData();
    renderAdminRows();
    let message = document.getElementById("adminMessage");
    message.style.color = "#16866d";
    message.textContent = "Demo data restored.";
  }
});

document.getElementById("logoutButton").addEventListener("click", function () {
  sessionStorage.removeItem("cityCareAdminLoggedIn");
  showLogin();
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
});

if (sessionStorage.getItem("cityCareAdminLoggedIn") === "yes") {
  showAdmin();
} else {
  showLogin();
}
