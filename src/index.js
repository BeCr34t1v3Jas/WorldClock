const citySelect = document.getElementById("city-select");
const keepActive = document.getElementById("keep-active");
const clocksContainer = document.getElementById("clocks-container");

let intervals = {};

function renderCityClock(zone, label) {
  const clockId = `clock-${zone.replace("/", "-")}`;

  // Avoid duplicate
  if (document.getElementById(clockId)) return;

  const now = moment().tz(zone);

  const clockDiv = document.createElement("div");
  clockDiv.classList.add("city-clock");
  clockDiv.id = clockId;
  clockDiv.innerHTML = `
    <div class="city-info">
      <div class="city-name">${label}</div>
      <div class="city-date">${now.format("MMMM Do YYYY")}</div>
    </div>
    <div class="city-time" id="time-${clockId}">${now.format("h:mm:ss A")}</div>
  `;

  clocksContainer.appendChild(clockDiv);

  intervals[zone] = setInterval(() => {
    const currentTime = moment().tz(zone);
    document.getElementById(`time-${clockId}`).textContent =
      currentTime.format("h:mm:ss A");
  }, 1000);
}

citySelect.addEventListener("change", function () {
  const value = this.value;
  if (!value) return;

  const [zone, label] = value.split("|");

  // If "Keep active clocks" is NOT checked, clear everything
  if (!keepActive.checked) {
    clearAllClocks();
  }

  renderCityClock(zone, label);
});

function clearAllClocks() {
  // Clear intervals
  for (let zone in intervals) {
    clearInterval(intervals[zone]);
  }
  intervals = {};
  clocksContainer.innerHTML = "";
}
