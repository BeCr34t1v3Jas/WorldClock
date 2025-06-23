const citySelect = document.getElementById("city-select");
const keepActive = document.getElementById("keep-active");
const clocksContainer = document.getElementById("clocks-container");
const userClock = document.getElementById("user-clock");
const backHome = document.getElementById("back-home");

let intervals = {};

function renderCityClock(zone, label) {
  const clockId = `clock-${zone.replace("/", "-")}`;

  // Avoid duplicate if already active
  if (keepActive.checked && document.getElementById(clockId)) return;

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
    const timeElement = document.getElementById(`time-${clockId}`);
    if (timeElement) {
      timeElement.textContent = currentTime.format("h:mm:ss A");
    }
  }, 1000);
}

function renderUserClock() {
  const localZone = moment.tz.guess();
  const now = moment().tz(localZone);
  userClock.innerHTML = `
    <div class="city-clock">
      <div class="city-info">
        <div class="city-name">Your Location 🌍</div>
        <div class="city-date">${now.format("MMMM Do YYYY")}</div>
      </div>
      <div class="city-time" id="user-time">${now.format("h:mm:ss A")}</div>
    </div>
  `;

  setInterval(() => {
    const update = moment().tz(localZone);
    document.getElementById("user-time").textContent =
      update.format("h:mm:ss A");
  }, 1000);
}

function clearAllClocks() {
  for (let zone in intervals) {
    clearInterval(intervals[zone]);
  }
  intervals = {};
  clocksContainer.innerHTML = "";
  userClock.style.display = "block";
  backHome.style.display = "none";
}

citySelect.addEventListener("change", function () {
  const value = this.value;
  if (!value) return;

  const [zone, label] = value.split("|");

  if (!keepActive.checked) {
    clearAllClocks();
    userClock.style.display = "none";
  }

  renderCityClock(zone, label);
  backHome.style.display = "inline-block";
});

backHome.addEventListener("click", function (e) {
  e.preventDefault();
  clearAllClocks();
  userClock.style.display = "block";
  citySelect.value = "";
});

// Initial load: show user's time
renderUserClock();
