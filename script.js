document.addEventListener("DOMContentLoaded", () => {
  // --- Sound Engine ---
  let soundsReady = false;
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
  }).toDestination();
  const modalSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 },
  }).toDestination();
  const scanSynth = new Tone.AMSynth({
    harmonicity: 1.5,
    envelope: { attack: 0.01, decay: 0.5, release: 0.5 },
  }).toDestination();

  const playSound = (synthInstance, note, duration) => {
    if (soundsReady) {
      synthInstance.triggerAttackRelease(note, duration);
    }
  };

  document.body.addEventListener(
    "click",
    () => {
      if (!soundsReady) {
        Tone.start();
        soundsReady = true;
        console.log("Audio context started");
      }
    },
    { once: true }
  );

  document.querySelectorAll(".widget").forEach((widget) => {
    widget.addEventListener("mouseover", () => playSound(synth, "C5", "8n"));
  });

  // --- Get DOM Elements ---
  const weatherWidget = document.getElementById("weather-widget");
  const threatWidget = document.getElementById("threat-widget");
  const modalOverlay = document.getElementById("modal-overlay");
  const weatherModal = document.getElementById("weather-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const scanStatusEl = document.getElementById("scan-status");
  const hostilesCountEl = document.getElementById("hostiles-count");

  // --- Modal Logic ---
  const openWeatherModal = () => {
    playSound(modalSynth, "G5", "4n");
    modalOverlay.classList.remove("hidden");
    weatherModal.classList.remove("hidden");
    // Simulate updating detailed weather
    document.getElementById("feels-like").innerText = `${(
      34 +
      (Math.random() - 0.5) * 3
    ).toFixed(1)}°C`;
    document.getElementById("pressure").innerText = `${(
      1012 +
      (Math.random() - 0.5) * 5
    ).toFixed(0)} hPa`;
    document.getElementById("visibility").innerText = `${(
      5 +
      (Math.random() - 0.5) * 2
    ).toFixed(1)} km`;
    document.getElementById("uv-index").innerText = `${Math.floor(
      Math.random() * 2 + 7
    )} (Very High)`;
    document.getElementById("dew-point").innerText = `${(
      26 +
      (Math.random() - 0.5) * 2
    ).toFixed(1)}°C`;
  };

  const closeWeatherModal = () => {
    playSound(modalSynth, "C4", "4n");
    modalOverlay.classList.add("hidden");
    weatherModal.classList.add("hidden");
  };

  if (weatherWidget) weatherWidget.addEventListener("click", openWeatherModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeWeatherModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeWeatherModal);

  // --- Threat Scan Logic ---
  let isScanning = false;
  const runThreatScan = () => {
    if (isScanning) return;
    isScanning = true;

    playSound(scanSynth, "C3", "2n");
    threatWidget.classList.add("scanning");
    scanStatusEl.innerText = "SCANNING...";

    setTimeout(() => {
      threatWidget.classList.remove("scanning");
      const foundHostiles = Math.random() > 0.7; // 30% chance to find a hostile
      if (foundHostiles) {
        scanStatusEl.innerText = "HOSTILE DETECTED!";
        scanStatusEl.classList.add("text-red-500");
        hostilesCountEl.innerText = parseInt(hostilesCountEl.innerText) + 1;
        playSound(scanSynth, "G4", "8n");
      } else {
        scanStatusEl.innerText = "Scan Complete. No Threats.";
        scanStatusEl.classList.remove("text-red-500");
        playSound(scanSynth, "C4", "8n");
      }

      setTimeout(() => {
        scanStatusEl.innerText = "";
        isScanning = false;
      }, 2000);
    }, 3000);
  };

  if (threatWidget) threatWidget.addEventListener("click", runThreatScan);

  // --- UI Update Functions ---
  function updateDateTime() {
    const now = new Date();
    const timeEl = document.getElementById("time");
    const dateEl = document.getElementById("date");
    if (timeEl) timeEl.innerText = now.toLocaleTimeString();
    if (dateEl) dateEl.innerText = now.toLocaleDateString();
  }

  function updatePowerLevels() {
    const corePower = document.getElementById("core-power");
    const auxPower = document.getElementById("aux-power");
    const suitPower = document.getElementById("suit-power");

    if (corePower) corePower.style.width = `${Math.random() * 5 + 95}%`;
    if (auxPower) auxPower.style.width = `${Math.random() * 20 + 75}%`;
    if (suitPower) suitPower.style.width = `${Math.random() * 10 + 88}%`;
  }

  function updateWeather() {
    const temp = document.getElementById("temp");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");

    if (temp)
      temp.innerText = `${(31 + (Math.random() - 0.5) * 2).toFixed(1)}°C`;
    if (humidity)
      humidity.innerText = `${(75 + (Math.random() - 0.5) * 5).toFixed(0)}%`;
    if (wind)
      wind.innerText = `${(10 + (Math.random() - 0.5) * 4).toFixed(0)} km/h W`;
  }

  const intelMessages = [
    "Satellite sweep complete. No anomalies detected.",
    "Cross-referencing Stark Industries personnel files.",
    "Energy signature detected, Sector 7G. Low priority.",
    "Monitoring global financial markets for irregularities.",
    "Flight path calculations for Mark VII are complete.",
    "Decrypting communication chatter from unidentified source.",
    "Reminder: Sir has a board meeting at 1400 hours.",
    "Analyzing atmospheric composition for contaminants.",
  ];
  let usedIntel = [];

  function updateIntelFeed() {
    const feedEl = document.getElementById("intel-feed");
    if (!feedEl) return;

    if (usedIntel.length === intelMessages.length) usedIntel = [];

    let nextMessage;
    do {
      nextMessage =
        intelMessages[Math.floor(Math.random() * intelMessages.length)];
    } while (usedIntel.includes(nextMessage));

    usedIntel.push(nextMessage);

    const li = document.createElement("li");
    li.textContent = `[${new Date().toLocaleTimeString()}] ${nextMessage}`;
    feedEl.prepend(li);

    while (feedEl.children.length > 5) {
      feedEl.removeChild(feedEl.lastChild);
    }
  }

  function cycleStatusText() {
    const statusEl = document.getElementById("status-text");
    if (!statusEl) return;

    const messages = [
      "All systems are functioning within normal parameters...",
      "Analyzing local network for threats...",
      "Weather update: Clear skies predicted for the next 6 hours.",
      "Sir, your 3 o'clock meeting has been rescheduled.",
      "Compiling latest mission data for your review.",
    ];
    let nextMessage = messages[Math.floor(Math.random() * messages.length)];

    statusEl.style.animation = "none";
    statusEl.offsetHeight;
    statusEl.textContent = nextMessage;
    statusEl.style.animation = `typing ${nextMessage.length / 15}s steps(${
      nextMessage.length
    }, end), blink-caret .75s step-end infinite`;
  }

  // --- Initial Calls and Intervals ---
  updateDateTime();
  updatePowerLevels();
  updateWeather();
  updateIntelFeed();

  setInterval(updateDateTime, 1000);
  setInterval(updatePowerLevels, 3000);
  setInterval(updateWeather, 10000);
  setInterval(updateIntelFeed, 7000);
  setInterval(cycleStatusText, 12000);
});
