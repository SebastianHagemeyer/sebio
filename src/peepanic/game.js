let water = 50;
let salt = 50;
let bladder = 0;
let score = 0;
let timeLeft = 120; //120;
let droughtActive = false;
let peeCooldown = false;
let peeCooldownTimeout; // <-- declare here

let droughtDuration = 0;

let drinkCooldown = false;
let drinkCooldownTimeout;

let saltCooldown = false;
let saltCooldownTimeout;
let pantPissed = false;
let pissing = false;

let pName = "normie";

function getPlayerId() {
  let id = localStorage.getItem("playerId");
  if (!id) {
    // Short unique ID: p_<last 5 digits of timestamp>_<0–9>
    const timePart = Date.now().toString().slice(-5); // e.g., "84012"
    const randPart = Math.floor(Math.random() * 10); // e.g., 7
    id = `p_${timePart}_${randPart}`;
    localStorage.setItem("playerId", id);
  }
  return id;
}

const peeNowText = "Pee Now 💧";

const waterDisplay = document.getElementById("waterLevel");
const saltDisplay = document.getElementById("saltLevel");
const bladderDisplay = document.getElementById("bladderLevel");
const bladderContainer = document.getElementById("bladder-container");
const scoreDisplay = document.getElementById("score");
const face = document.getElementById("face");
const peeMessage = document.getElementById("pee-message");
const penaltyMessage = document.getElementById("penalties");
const bladderFill = document.getElementById("bladder-fill");
const timerDisplay = document.getElementById("timeLeft");
const adhSlider = document.getElementById("adhControl");
const drinkBtn = document.getElementById("drinkBtn");
const peeBtn = document.getElementById("peeBtn");

let happyBladders = 0;
const pointsPerBladder = 20;
const maxHappyBladders = 5;

function updateHappyBladders() {
  const container = document.getElementById("happyBladderCounter");
  let icons = "";

  for (let i = 0; i < happyBladders; i++) {
    icons += "😊 "; // happy bladder emoji or use a custom icon here
  }
  // Fill remaining spots with empty bladder (optional)
  for (let i = happyBladders; i < maxHappyBladders; i++) {
    icons += "⚪ "; // empty circle or different icon
  }

  container.textContent = icons.trim();

  if (happyBladders >= maxHappyBladders) {
    // Optional: show a win message or trigger something
    container.textContent += " 🎉 Goal reached!";
  }
}

function updateStatus() {
  waterDisplay.textContent = Math.round(water);
  saltDisplay.textContent = Math.round(salt);
  bladderDisplay.textContent = Math.round(bladder);
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;

  if (!pissing) {
    if (bladder < 40) face.textContent = "😐";
    else if (bladder < 80) face.textContent = "😣";
    else if (bladder < 100) face.textContent = "😫";
    else face.textContent = "💥";
  }

  bladderFill.style.height = Math.min(100, bladder) + "%";
  // 🔵🟠🔴 Visual Alerts
  // Water
  if (water < 15 || water > 99) {
    if (!pissing) {
      face.textContent = "😣";
    }
    waterDisplay.style.color = "red";
  } else if (water < 30 || water > 90) {
    waterDisplay.style.color = "orange";
  } else {
    waterDisplay.style.color = "";
  }

  // Salt
  if (salt < 15 || salt > 95) {
    if (!pissing) {
      face.textContent = "😣";
    }
    saltDisplay.style.color = "red";
  } else if (salt < 30 || salt > 75) {
    saltDisplay.style.color = "orange";
  } else {
    saltDisplay.style.color = "";
  }

  // Bladder
  if (bladder >= 90) {
    bladderDisplay.style.color = "red";
  } else if (bladder >= 70) {
    bladderDisplay.style.color = "orange";
  } else {
    bladderDisplay.style.color = "";
  }
}

function applyPenalties() {
  let messages = [];
  if (water < 20) {
    messages.push("⚠️ Dehydrated! -1 point");
    score--;
  }
  if (water > 99) {
    messages.push("⚠️ Overhydrated! -1 point");
    score--;
  }
  if (salt > 80) {
    messages.push("⚠️ Too salty! -1 point");
    score--;
  }
  if (salt < 20) {
    messages.push("⚠️ Too little salt! -1 point");
    score--;
  }
  if (pissing) {
    messages.push("⚠️ YOU SPRUNG A LEAK ⚠️");
  }
  penaltyMessage.textContent = messages.join("  ");
}

function gameover() {
  pantPissed = false;
  clearInterval(dropInterval);
  timeLeft = 0;
  clearInterval(timerInterval);
  clearInterval(regulationInterval);
  document.querySelectorAll(".event-btn").forEach((btn) => (btn.disabled = true));
  document.getElementById("gameover").style.display = "flex";
}

function endGame(reasonMessage) {
  peeMessage.textContent = "";

  // Apply the death penalty to the canonical score first, then display it so
  // the game-over screen shows the player's ACTUAL final score.
  score -= 5;

  document.getElementById("gameover-text").textContent = `${reasonMessage} Final Score: ${score}`;

  gameover();
}

function launchPeeDrop(rect = null) {
  const drop = document.createElement("img");
  drop.src = "/peepanic/drop.png";
  drop.classList.add("pee-drop");

  document.body.appendChild(drop);

  let startX, startY;

  if (!rect) {
    // Default: use bladderContainer with fill height
    const bladderRect = bladderContainer.getBoundingClientRect();
    const fillHeight = Math.min(100, bladder); // Cap at 100%
    const fillPixelHeight = (fillHeight / 100) * bladderRect.height;
    const launchY = bladderRect.bottom - fillPixelHeight;

    startX = bladderRect.left + bladderRect.width / 2;
    startY = launchY;
  } else {
    // Use the passed rect directly
    startX = rect.left + rect.width / 2;
    startY = rect.bottom;
  }

  // Style
  drop.style.position = "fixed";
  drop.style.left = `${startX}px`;
  drop.style.top = `${startY}px`;
  drop.style.width = "20px";
  drop.style.height = "20px";
  drop.style.pointerEvents = "none";
  drop.style.zIndex = "999";

  // Angle logic
  const direction = [-1, 0, 1][Math.floor(Math.random() * 3)];
  const baseAngle = direction === 0 ? -90 : direction === -1 ? -110 : -70;
  const angle = (baseAngle + (Math.random() * 10 - 5)) * (Math.PI / 180);

  const speed = 4 + Math.random() * 3.5;

  let x = startX;
  let y = startY;
  let vx = Math.cos(angle) * speed;
  let vy = Math.sin(angle) * speed;

  const gravity = 0.25;
  let life = 60;

  function animate() {
    vy += gravity;
    x += vx;
    y += vy;
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;

    life--;
    if (life > 0) {
      requestAnimationFrame(animate);
    } else {
      drop.remove();
    }
  }

  animate();
}

function regulate() {
  if (timeLeft <= 0) return;

  const adh = parseInt(adhSlider.value);
  const urine = 100 - adh;

  //water += (adh - 50) * 0.05;
  water -= 1; // just normal sweating

  const waterLoss = urine * 0.05;
  const saltLoss = urine * 0.02;

  water -= waterLoss;
  salt -= saltLoss;
  bladder += waterLoss * 1.5;

  water = Math.max(0, Math.min(100, water));
  salt = Math.max(0, Math.min(100, salt));
  bladder = Math.max(0, bladder);

  if (bladder >= 100) {
    if (!pantPissed) {
      pantPissed = true;
      pissing = true;
      peeMessage.textContent = "⚠️ YOU SPRUNG A LEAK ⚠️";

      for (let i = 0; i < 5; i++) {
        // gradual piss

        setTimeout(() => {
          bladder -= 10;
          for (let i = 0; i < 10; i++) {
            setTimeout(() => launchPeeDrop(), i * 100);
          }
          //console.log(`Bladder: ${bladder}`);
          score -= 2;
          updateStatus();
        }, i * 200);
      }
      face.textContent = "😳"; //set piss face
      setTimeout(() => {
        // stop pissing
        pissing = false;
        peeMessage.textContent = "";
      }, 1000);
    } else {
      endGame("💥 Your bladder exploded!");
      //bladder = ;
    }
  }

  if (water <= 5) {
    endGame("💥 You died of dehydration!");
    bladder = 0;
  }

  if (salt <= 5) {
    endGame("💥 You died of hyponatremia!");
    bladder = 0;
  }

  if (salt >= 95) {
    endGame("💥 You died of hypernatremia!");
    bladder = 0;
  }

  // Updated drought logic
  if (droughtActive) {
    droughtDuration--;
    if (droughtDuration <= 0) {
      droughtActive = false;
      drinkBtn.classList.remove("disabled");
      drinkBtn.textContent = "Drink Water";
    }
  } else if (!drinkCooldown && Math.random() < 0.05) {
    droughtActive = true;
    droughtDuration = 5 + Math.floor(Math.random() * 5); // 5–10 seconds

    if (Math.random() < 1 / 3) {
      // 1 in 3 chance that 0-10 seconds will be added 20 seconds drought in worst case
      droughtDuration += Math.floor(Math.random() * 10); // up to +20
    }

    drinkBtn.classList.add("disabled");
    const droughtMessages = ["No water taps around 💧", "Forgot your water bottle 💧"];
    if (droughtDuration > 15) {
      drinkBtn.textContent = "Drought! No Water 💧";
    } else {
      drinkBtn.textContent = droughtMessages[Math.floor(Math.random() * droughtMessages.length)];
    }
  }

  updateStatus();
  applyPenalties();
}

function tickTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    updateStatus();
  } else {
    // WIN LOGIC

    peeMessage.textContent = "";
    if (score >= 100) {
      //document.getElementById("gameover-text").textContent = `🔥 You conquered the chaos! Final Score: ${score}  Osmoregulation Master! Dare to beat perfection?`;
      document.getElementById("gameover-text").innerHTML =
        `🔥 You conquered the chaos! 💦<br>Final Score: ${score}<br><strong>Osmoregulation Master!</strong><br>Dare to beat perfection?`;
    } else {
      document.getElementById("gameover-text").textContent =
        `Time's up! Final Score: ${score}, try get 100 or more!`;
    }
    document.getElementById("gameover").style.display = "flex";
    clearInterval(timerInterval);
    clearInterval(regulationInterval);
    document.querySelectorAll(".event-btn").forEach((btn) => (btn.disabled = true));
    timeLeft = 0;

    document.getElementById("name-entry").style.display = "flex"; // make name entry visible

    updateStatus();
  }
}

let regulationInterval = setInterval(regulate, 1000);
let timerInterval = setInterval(tickTimer, 1000);

function drinkWater() {
  if (timeLeft <= 0 || droughtActive || drinkCooldown) return;

  water += 20;
  updateStatus();

  drinkCooldown = true;
  drinkBtn.classList.add("disabled");
  drinkBtn.textContent = "Recently drank...";

  clearTimeout(drinkCooldownTimeout);
  drinkCooldownTimeout = setTimeout(() => {
    drinkCooldown = false;
    drinkBtn.classList.remove("disabled");
    drinkBtn.textContent = "Drink Water";
  }, 1000); // 1 second cooldown
}

function eatSalt() {
  if (timeLeft <= 0 || saltCooldown) return;

  salt += 20;
  updateStatus();

  saltCooldown = true;
  const saltBtn = document.getElementById("saltBtn"); // Make sure you have this button id in your HTML
  saltBtn.classList.add("disabled");
  saltBtn.textContent = "Recently ate...";

  clearTimeout(saltCooldownTimeout);
  saltCooldownTimeout = setTimeout(() => {
    saltCooldown = false;
    saltBtn.classList.remove("disabled");
    saltBtn.textContent = "Eat";
  }, 1000); // 1 second cooldown
}

function sweatStorm() {
  if (timeLeft <= 0) return;
  water -= 15;
  salt -= 10;
  updateStatus();
}

function floatText(pts) {
  // Show floating score above bladder
  const floatText = document.createElement("div");
  floatText.className = "floating-score";
  floatText.textContent = `+${pts}`;

  // Position it near the bladder
  const bladderContainer = document.getElementById("bladder-container");
  const rect = bladderContainer.getBoundingClientRect();

  floatText.style.left = `${rect.left + rect.width / 2}px`;
  floatText.style.top = `${rect.top}px`;
  floatText.style.position = "fixed";

  // Create and add the image
  const dropImg = document.createElement("img");
  dropImg.src = "/peepanic/drop.png"; // Update path if needed
  dropImg.style.width = "20px";
  dropImg.style.height = "20px";
  dropImg.style.verticalAlign = "middle";
  dropImg.style.marginLeft = "4px";
  floatText.appendChild(dropImg);

  document.body.appendChild(floatText);

  // Remove after animation
  setTimeout(() => floatText.remove(), 1000);
}
function peeNow() {
  if (timeLeft <= 0) return;

  if (bladder > 0) {
    peeCooldown = true;

    if (Math.random() < 1 / 4) {
      // 4
      // Can't find any toilets message & extend cooldown
      peeMessage.textContent = "🚫 Can't find any toilets!";

      const element = document.getElementById("peeBtn");

      element.classList.add("animate-shake");

      // Remove the animation class after 1 second (1000 ms)
      setTimeout(() => {
        element.classList.remove("animate-shake");
      }, 1000);

      peeBtn.textContent = "No Toilets! 🚫";
      peeBtn.classList.add("disabled");
      setTimeout(() => (peeMessage.textContent = ""), 2000);

      clearTimeout(peeCooldownTimeout);
      const cooldownTime = 2000 + Math.floor(Math.random() * 5000);
      peeCooldownTimeout = setTimeout(() => {
        peeCooldown = false;
        peeBtn.classList.remove("disabled");
        peeBtn.textContent = peeNowText;
      }, cooldownTime); // 10s + 5s extension
    } else {
      // Successful pee
      peeMessage.textContent = `🚽 You peed: relieved ${Math.round(bladder)} units.`;
      const toAdd = Math.round(bladder / 5);
      score += toAdd; // 100 bladder is 20 points, empty 5 full bladders

      floatText(toAdd);
      bladderContainer.style.animation = "none";
      bladderContainer.offsetHeight; // 👈 force reflow
      bladderContainer.style.animation = "shrinkPop 0.3s ease";

      bladder = 0;

      peeBtn.textContent = "Recently Peed 🚽";
      peeBtn.classList.add("disabled");

      clearTimeout(peeCooldownTimeout);
      peeCooldownTimeout = setTimeout(() => {
        peeCooldown = false;
        peeBtn.classList.remove("disabled");
        peeBtn.textContent = peeNowText;
      }, 10000);
    }
  } else {
    peeMessage.textContent = "❌ Bladder is already empty!";
    setTimeout(() => (peeMessage.textContent = ""), 2000);
  }
  updateStatus();
  happyBladders = Math.min(maxHappyBladders, Math.floor(score / pointsPerBladder));
  updateHappyBladders();
}

function restartGame() {
  // Reset all relevant variables
  water = 50;
  salt = 50;
  bladder = 0;
  score = 0;
  timeLeft = 120;
  happyBladders = 0;

  updateStatus();
  updateHappyBladders();
  peeMessage.textContent = "";
  penaltyMessage.textContent = "";

  // Hide gameover UI
  document.getElementById("gameover").style.display = "none";

  // Re-enable buttons
  document.querySelectorAll(".event-btn").forEach((btn) => (btn.disabled = false));
  peeBtn.classList.remove("disabled");
  drinkBtn.classList.remove("disabled");
  drinkBtn.textContent = "Drink Water";
  document.getElementById("saltBtn").classList.remove("disabled");
  document.getElementById("saltBtn").textContent = "Eat";
  peeBtn.textContent = peeNowText;

  // Clear any lingering cooldowns
  clearTimeout(peeCooldownTimeout);
  clearTimeout(drinkCooldownTimeout);
  clearTimeout(saltCooldownTimeout);
  peeCooldown = false;
  drinkCooldown = false;
  saltCooldown = false;
  droughtActive = false;

  // Restart intervals
  clearInterval(regulationInterval);
  clearInterval(timerInterval);

  regulationInterval = setInterval(regulate, 1000);
  timerInterval = setInterval(tickTimer, 1000);
  updateDropSpeedOnly(); // Start after restart
}

const dropZone = document.getElementById("drop-zone");
let dropInterval;

function spawnDrop(fallSpeed) {
  const drop = document.createElement("div");
  drop.classList.add("drop");
  drop.style.left = `${Math.random() * 80 + 10}%`;
  drop.style.animationDuration = `${fallSpeed}s`;
  dropZone.appendChild(drop);

  setTimeout(() => {
    drop.remove();
  }, 6000);
}

function updateDropSpeedOnly() {
  clearInterval(dropInterval);
  const adh = parseInt(document.getElementById("adhControl").value);

  // Scale from 1s (low ADH) to 2s (high ADH)
  const fallSpeed = 1 + adh / 90; // 0 → 1s, 90 → 2s

  // Drop interval: 500ms (0.5s) at low ADH, 1000ms at high ADH
  const interval = 500 + (adh / 90) * 500; // 500 to 1000 ms

  //console.log(fallSpeed)
  dropInterval = setInterval(() => {
    spawnDrop(fallSpeed);
  }, interval); // Constant 1 drop/sec
}

document.getElementById("adhControl").addEventListener("input", updateDropSpeedOnly);
updateDropSpeedOnly(); // Start immediately

updateHappyBladders();

function submit() {
  const input = document.getElementById("player-name");
  const name = input.value.trim();

  if (name !== "") {
    pName = name;
  }
  const button = document.getElementById("sub-btn");
  button.disabled = true;
  button.textContent = "Submitting...";
  //submitScore(getPlayerId(), pName , score)

  submitScore(getPlayerId(), pName, score)
    .then(() => {
      button.textContent = "Submitted!";
      setTimeout(() => {
        window.location.href = "/peepanic/leaderboard/";
      }, 1000); // 1-second delay for feedback
    })
    .catch((err) => {
      console.error("Submission failed:", err);
      button.disabled = false;
      button.textContent = "Submit Score";
    });
}

async function submitScore(id, name, score) {
  // Delegates to the shared Supabase-backed leaderboard client. `id` is unused
  // (Supabase generates the row id). See /scripts/leaderboard.js.
  if (!window.Leaderboard) throw new Error("Leaderboard client not loaded");
  return window.Leaderboard.submitScore(name, score);
}

// GOLDEN TOILET SHIT

let goldenToiletClicks = 0;
let goldenToiletActive = false;
const goldenToiletElement = document.getElementById("golden-toilet");

function spawnSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.className = "toilet-sparkle";
  sparkle.style.left = `${x - 4}px`;
  sparkle.style.top = `${y - 4}px`;

  document.body.appendChild(sparkle);

  // Remove after animation (600ms just to be safe)
  sparkle.addEventListener("animationend", () => sparkle.remove());
}

function spawnGoldenToilet() {
  if (goldenToiletActive || timeLeft <= 0) return;

  goldenToiletActive = true;
  goldenToiletClicks = 0;

  const startX = Math.random() * (window.innerWidth - 100);
  let y = -100;
  const speed = 1 + Math.random() * 1; // falling speed

  goldenToiletElement.style.left = `${startX}px`;
  goldenToiletElement.style.top = `${y}px`;
  goldenToiletElement.style.transform = "scale(1)";
  goldenToiletElement.style.display = "block";

  function fall() {
    if (!goldenToiletActive) return;
    const rect = goldenToiletElement.getBoundingClientRect();
    const sparkleX = rect.left + rect.width / 2;
    const sparkleY = rect.top; // SPARKLES FROM THE TOP

    spawnSparkle(sparkleX, sparkleY);

    y += speed;
    goldenToiletElement.style.top = `${y}px`;

    if (y < window.innerHeight) {
      requestAnimationFrame(fall);
    } else {
      console.log("toilet below");
      setTimeout(() => {
        goldenToiletElement.style.display = "none";
        goldenToiletElement.style.animation = "";
        goldenToiletActive = false;
      }, 600);
    }
  }

  requestAnimationFrame(fall);
}

// Click handler
goldenToiletElement.addEventListener("click", () => {
  goldenToiletClicks++;
  const scale = 1 - goldenToiletClicks * 0.08;
  goldenToiletElement.style.transform = `scale(${scale})`;

  const rect = goldenToiletElement.getBoundingClientRect(); // capture now
  for (let i = 0; i < 1; i++) {
    setTimeout(() => launchPeeDrop(rect), i * 100);
  }

  if (goldenToiletClicks >= 10) {
    const rect = goldenToiletElement.getBoundingClientRect(); // capture now
    for (let i = 0; i < 20; i++) {
      setTimeout(() => launchPeeDrop(rect), i * 100);
    }
    goldenToiletElement.style.display = "none";
    timeLeft += 5;
    peeMessage.textContent = "🚽 + 5 seconds ! 🚽 ";
    updateStatus();
    goldenToiletActive = false;
  }
});

// Periodically try to spawn it every 15–30 seconds
setInterval(() => {
  if (!goldenToiletActive && Math.random() < 0.25) {
    // 0.25 25% chance every interval
    spawnGoldenToilet();
  }
}, 5000);
