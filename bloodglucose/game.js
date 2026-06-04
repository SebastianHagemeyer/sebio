//<p>Pancreas Status: <span id="pancreasStatus">Normal</span></p>
let dochart = true;
let special = false; // hyper/hypo "special" pancreas state (was an undeclared implicit global)
// Get elements
const insulinSlider = document.getElementById("insulinSlider");
const insulinOutput = document.getElementById("insulinOutput");
const diabeticSlider = document.getElementById("diabeticSlider");
const diabeticOutput = document.getElementById("diabeticOutput");
const glucagonSlider = document.getElementById("glucagonSlider");
const glucagonOutput = document.getElementById("glucagonOutput");
const pancreasStatus = document.getElementById("pancreasStatus");
const glucoseLevel = document.getElementById("glucoseLevel");
const insulinLevel = document.getElementById("insulinLevel");
const insulinLevelC = document.getElementById("insulinLevelC");
const glucagonLevel = document.getElementById("glucagonLevel");
const mealTimesDisplay = document.getElementById("mealTimes");
const clockDisplay = document.getElementById("clock");
const timeLine = document.getElementById("timeLine");
const glucoseLevelLine = document.getElementById("glucoseLevelLine");
const sugarIndicator = document.getElementById("sugarIndicator");
const autopilotStatus = document.getElementById("autopilotStatus");
const mealStatus = document.getElementById("mealStatus");
const historyStatus = document.getElementById("historyStatus");

const insulinCSlider = document.getElementById("insulinCSlider");
const insulinCOutput = document.getElementById("insulinCOutput");

// Initialize insulin production capability variable
let insulinProductionCapability = 100;

let glucoseData = []; // Array to store glucose level data
let insulinData = []; // Array to store insulin level data
let bInsulinData = []; // Array to store blood insulin level data
let glucoseChart; // Variable to store reference to the chart object

let tickX = 0;

function showGlucoseModal(type) {
  const modal = document.getElementById("glucoseModal");
  const title = document.getElementById("glucoseConditionTitle");
  const text = document.getElementById("glucoseConditionText");

  if (type === "hyper") {
    title.textContent = "Hyperglycaemia";
    text.textContent =
      "Blood glucose is too high (above 7.8 mmol/L when fasting).\n\nEffects: Frequent urination, increased thirst, fatigue, blurred vision, nerve damage, blood vessel damage, kidney damage, eye damage, increased risk of heart disease, and diabetic ketoacidosis (in Type 1 diabetes).";
  } else if (type === "hypo") {
    title.textContent = "Hypoglycaemia";
    text.textContent =
      "Blood glucose is too low (below 4.0 mmol/L).\n\nEffects: Shakiness, sweating, dizziness, confusion, difficulty concentrating, weakness, hunger, seizures, loss of consciousness, and coma.";
  }

  modal.style.display = "block";
}

document.getElementById("closeModal").onclick = function () {
  document.getElementById("glucoseModal").style.display = "none";
};

// Function to create and initialize the chart
function initChart() {
  const ctx = document.getElementById("glucoseChart").getContext("2d");
  glucoseChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Glucose Level",
          data: glucoseData,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "Cell Insulin Level",
          data: insulinData,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "Blood Insulin Level",
          data: bInsulinData,
          borderColor: "rgba(54, 200, 235, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // This lets the chart fill the container

      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
          display: true,
          title: {
            display: true,
            text: "Time",
            color: "#191",
            font: {
              family: "Times",
              size: 20,
              weight: "bold",
              lineHeight: 1.2,
            },
            padding: { top: 20, left: 0, right: 0, bottom: 0 },
          },
        },
        y: {
          min: 0,
          max: 100,
          display: true,
          title: {
            display: true,
            text: "Level",
            color: "#191",
            font: {
              family: "Times",
              size: 20,
              weight: "bold",
              lineHeight: 1.2,
            },
            padding: { top: 30, left: 0, right: 0, bottom: 0 },
          },
        },
      },
    },
  });
  //ctx.canvas.height = 300;
}

// Function to update the chart with new data
function updateChart(glucoseLevel, insulinLevel, bInsulinLevel) {
  if (tickX > 80 && !chartHistory) {
    glucoseData.splice(0, 1);
    insulinData.splice(0, 1);
    bInsulinData.splice(0, 1);
    glucoseChart.data.labels.splice(0, 1);
  }

  glucoseChart.update();

  // Add the new data points

  glucoseData.push(glucoseLevel);
  insulinData.push(insulinLevel);
  bInsulinData.push(bInsulinLevel);
  glucoseChart.data.labels.push(tickX); // Update the labels
  //glucoseChart.data.labels.push(glucoseData.length);

  tickX += 1;
  //glucoseChart.data.labels.splice(0, 1); // remove first label
  glucoseChart.update();
}

// Initialize the chart
if (dochart) {
  initChart();
}

let sugarUp = false;
let sugarTime = 0;

// Initialize variables
let insulinProduction = 50;
let insulinProductionT = 50;
let insulinResistance = 0;
let binsulin = 50;
let glucagonProduction = 50;
let glucose = 40; // Initial glucose level
let insulin = 50;
let currentTime = { hours: 8, minutes: 0 }; // Initial current time
const eatTimes = [8, 12, 18]; // Meal times in hours
let gameEnded = false;
let autopilotActive = false;
let doMeal = true;
let chartHistory = true;

function toggleAutopilot() {
  autopilotActive = !autopilotActive;
  if (autopilotActive) {
    autopilotStatus.innerHTML = "Autopilot<br>(Homeostasis): On";
  } else {
    autopilotStatus.innerHTML = "Autopilot<br>(Homeostasis): Off";
  }
}

function toggleMeals() {
  doMeal = !doMeal;
  if (doMeal) {
    mealStatus.textContent = "Meals: On";
  } else {
    mealStatus.textContent = "Meals: Off";
  }
}

function toggleHistory() {
  chartHistory = !chartHistory;
  if (chartHistory) {
    historyStatus.textContent = "Chart History: On";
  } else {
    historyStatus.textContent = "Chart History: Off";
    const maxLength = 20;
    if (glucoseData.length > maxLength) {
      glucoseData.splice(0, 20);
      insulinData.splice(0, 20);
      bInsulinData.splice(0, 20);
      glucoseChart.data.labels.splice(0, 20);

      glucoseChart.update();
    }
  }
}

function simulateSliderInput() {
  // 40 is ideal

  var dist = Math.abs(40 - glucose); // how far glucose is far from ideal

  //const insulinSlider = document.getElementById('insulinSlider');
  var newValue;

  newValue = glucose + 20;

  /*if (glucose > 40){
      newValue = glucose+20+dist
    }*/

  insulinSlider.value = newValue;
  insulinSlider.dispatchEvent(new Event("input"));

  // if glucose is high, glucagon will be low
  var newValue2 = Math.max(0, 100 - glucose);

  /*if (glucose < 40){
      var newValue2 = Math.max(0, 70 - glucose);
    }*/

  glucagonSlider.value = newValue2;
  glucagonSlider.dispatchEvent(new Event("input"));
}

function interpolateColor(startColor, endColor, factor) {
  const result = startColor.slice(); // Copy array
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

// Update insulin production value also update colour
insulinSlider.addEventListener("input", function () {
  insulinProductionT = parseInt(insulinSlider.value * (insulinProductionCapability / 100));
  insulinOutput.textContent = insulinProductionT;
  if (insulinProductionT > 0.75 * insulinProductionCapability) {
    //console.log("Insulin production is above 75% of capability");
    const factor = (insulinProductionT / insulinProductionCapability - 0.75) / 0.25;
    console.log(factor);

    // From white to dark orange
    const white = [255, 255, 255];
    const darkOrange = [255, 140, 0];
    const insulinGroup = document.getElementById("insulinGroup");
    const interpolatedColor = interpolateColor(white, darkOrange, factor);
    insulinGroup.style.backgroundColor = interpolatedColor;
    // You can add more logic here, e.g., show a warning or change color
  } else {
    const insulinGroup = document.getElementById("insulinGroup");
    const interpolatedColor = "#f9f9f9";
    insulinGroup.style.backgroundColor = interpolatedColor;
  }
});

// Tweening loop every 100 ms
setInterval(() => {
  const diff = insulinProduction - insulinProductionT;

  if (Math.abs(diff) > 5) {
    insulinProduction += diff > 0 ? -5 : 5;
  } else {
    insulinProduction = insulinProductionT; // close enough, snap to target
  }

  // Update display
  document.getElementById("insulinLevel").textContent = insulinLevel;

  // Optional: update any visuals or charts that rely on insulinLevel here
}, 500);

// Update insulin production capability value
insulinCSlider.addEventListener("input", function () {
  insulinProductionCapability = parseInt(insulinCSlider.value);
  insulinCOutput.textContent = insulinProductionCapability;
  insulinProductionT = parseInt(insulinSlider.value * (insulinProductionCapability / 100));
  const slider = document.getElementById("insulinSlider");
  slider.dispatchEvent(new Event("input"));

  // Initial render
  updateCells(insulinProductionCapability);
});

// Update insulin resistance value
diabeticSlider.addEventListener("input", function () {
  insulinResistance = parseInt(diabeticSlider.value);
  diabeticOutput.textContent = insulinResistance;
});

// Update glucagon production value
glucagonSlider.addEventListener("input", function () {
  glucagonProduction = parseInt(glucagonSlider.value);
  glucagonOutput.textContent = glucagonProduction;
});

// Function to update sugar indicator
function updateSugarIndicator() {
  //console.log(sugarUp)
  if (sugarUp) {
    pancreasStatus.textContent = "Blood sugar rising from food";
    sugarIndicator.classList.remove("empty");
    sugarIndicator.classList.add("filled");
  } else if (!special) {
    pancreasStatus.textContent = "Normal";
    sugarIndicator.classList.remove("filled");
    sugarIndicator.classList.add("empty");
  }
}

// Update clock display, sugar release
function updateClock() {
  const hours = String(currentTime.hours).padStart(2, "0");
  const minutes = String(currentTime.minutes).padStart(2, "0");
  const timeString = `Time: ${hours}:${minutes}`;
  clockDisplay.textContent = timeString;
  //console.log(sugarTime)

  if (sugarTime > 0) {
    sugarTime -= 1;
    glucose += 4 * (1 + 1 * (insulinResistance / 100)) * (Math.max(2, sugarTime - 1) / 8);
    updateGlucoseLevel();
  } else {
    sugarUp = false;
    updateSugarIndicator();
  }
  if (autopilotActive) {
    simulateSliderInput(); // rando
  }

  if (dochart) {
    updateChart(glucose, insulin, binsulin);
  }
}

// Draw time line
function drawTimeLine() {
  const svgWidth = timeLine.clientWidth;
  const svgHeight = timeLine.clientHeight;
  const lineWidth = svgWidth / 24; // Each hour represented by width of the line
  const lineHeight = svgHeight / 2; // Line position in the middle of the SVG
  timeLine.innerHTML = ""; // Clear previous lines

  // Draw current time line
  const currentLineX = currentTime.hours * lineWidth + (currentTime.minutes / 60) * lineWidth;
  const currentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  currentLine.setAttribute("x1", currentLineX);
  currentLine.setAttribute("y1", lineHeight - 10);
  currentLine.setAttribute("x2", currentLineX);
  currentLine.setAttribute("y2", lineHeight + 10);
  currentLine.classList.add("currentTime");
  timeLine.appendChild(currentLine);

  if (doMeal) {
    // Draw eat time lines
    for (const eatTime of eatTimes) {
      const eatLineX = eatTime * lineWidth;
      const eatLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      eatLine.setAttribute("x1", eatLineX);
      eatLine.setAttribute("y1", lineHeight - 5);
      eatLine.setAttribute("x2", eatLineX);
      eatLine.setAttribute("y2", lineHeight + 5);
      eatLine.classList.add("mealTime");
      timeLine.appendChild(eatLine);
    }
  }
}

special = false;
// Draw glucose level line
function drawGlucoseLevelLine() {
  const svgWidth = glucoseLevelLine.clientWidth;
  const svgHeight = glucoseLevelLine.clientHeight;
  const lineHeight = svgHeight; // Line position at the bottom of the SVG
  const glucoseLineY = svgHeight - (glucose / 100) * svgHeight;
  glucoseLevelLine.innerHTML = ""; // Clear previous lines

  // Draw glucose level line
  const glucoseLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  glucoseLine.setAttribute("x1", 0);
  glucoseLine.setAttribute("y1", glucoseLineY);
  glucoseLine.setAttribute("x2", svgWidth);
  glucoseLine.setAttribute("y2", glucoseLineY);
  glucoseLine.classList.add("glucoseLevel");
  glucoseLevelLine.appendChild(glucoseLine);

  // Draw critical hypo and hyper lines
  const hypoLineY = svgHeight - (20 / 100) * svgHeight;
  const goodLineY = svgHeight - (40 / 100) * svgHeight;
  const hyperLineY = svgHeight - (80 / 100) * svgHeight;
  const criticalLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const criticalLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const goodLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  criticalLine1.setAttribute("x1", 0);
  criticalLine1.setAttribute("y1", hypoLineY);
  criticalLine1.setAttribute("x2", svgWidth);
  criticalLine1.setAttribute("y2", hypoLineY);
  criticalLine1.classList.add("critical");

  glucoseLevelLine.appendChild(criticalLine1);
  criticalLine2.setAttribute("x1", 0);
  criticalLine2.setAttribute("y1", hyperLineY);
  criticalLine2.setAttribute("x2", svgWidth);
  criticalLine2.setAttribute("y2", hyperLineY);
  criticalLine2.classList.add("critical");
  glucoseLevelLine.appendChild(criticalLine2);

  goodLine1.setAttribute("x1", 0);
  goodLine1.setAttribute("y1", goodLineY);
  goodLine1.setAttribute("x2", svgWidth);
  goodLine1.setAttribute("y2", goodLineY);
  goodLine1.classList.add("ideal");
  glucoseLevelLine.appendChild(goodLine1);

  const lineGroup = document.getElementById("glucoseLevelLine");
  //linehere
  if (glucose > 60) {
    special = true;
    const factor = (glucose - 60) / 40;
    console.log(factor);

    // From white to dark orange
    const white = [255, 255, 255];
    const darkOrange = [255, 140, 0];

    const interpolatedColor = interpolateColor(white, darkOrange, factor);
    lineGroup.style.backgroundColor = interpolatedColor;
    pancreasStatus.textContent = "Blood sugar is too high!";
    if (glucose > 70) {
      pancreasStatus.textContent = "Blood sugar is very high!";
    }
  } else if (glucose < 30) {
    special = true;
    const factor = (30 - glucose) / 30;
    console.log(factor);

    // From white to dark orange
    const white = [255, 255, 255];
    const black = [0, 0, 0];

    const interpolatedColor = interpolateColor(white, black, factor);
    lineGroup.style.backgroundColor = interpolatedColor;

    pancreasStatus.textContent = "Blood sugar is too low!";
  } else {
    lineGroup.style.backgroundColor = "white";
    special = false;
  }
}

// Check game over conditions
function checkGameOver() {
  if (glucose >= 80) {
    endGame("Hyperglycemia");
    showGlucoseModal("hyper");
  } else if (glucose <= 20) {
    endGame("Hypoglycemia");
    showGlucoseModal("hypo");
  }
}

// End game
function endGame(reason) {
  gameEnded = true;
  if (metaboliseTimeout !== null) {
    clearTimeout(metaboliseTimeout);
    metaboliseTimeout = null;
  }
  pancreasStatus.textContent = `Dead (${reason})`;
}

// Simulate meal times, glucose rising onset
setInterval(function () {
  if (!gameEnded) {
    currentTime.minutes += 15;
    if (currentTime.minutes >= 60) {
      currentTime.hours += 1;
      currentTime.minutes = 0;
    }
    if (currentTime.hours >= 24) {
      // Reset time to 7:00
      currentTime.hours = 7;
      currentTime.minutes = 0;
    }
    if (
      (currentTime.hours === 8 || currentTime.hours === 12 || currentTime.hours === 18) &&
      currentTime.minutes === 0
    ) {
      if (doMeal) {
        eat();
      }
    }
    updateClock();
    drawTimeLine();
    checkGameOver();
  }
}, 250); // Update time every 1/4 second

// Eat function
function eat() {
  // Simulate glucose intake
  //glucose += 40;
  //console.log("Eat")
  sugarUp = true;
  sugarTime = 8;
  updateSugarIndicator();
  //updateGlucoseLevel();
}

// Update game state, hormone changes
function update() {
  if (!gameEnded) {
    // Simulate cellinsulin
    if (insulinResistance > 20) {
      insulin = insulinProduction * ((110 - insulinResistance / 1.1) / 100);
      //pancreasStatus.textContent = 'Working Hard';
    } else {
      insulin = insulinProduction;
      //pancreasStatus.textContent = 'Normal';
    }

    binsulin = insulinProduction;

    // Simulate glucose absorption
    glucose -= insulin / 10;
    // Simulate glucagon effect
    glucose += (glucagonProduction / 100) * 10;
    if (glucose < 0) glucose = 0;
    if (glucose > 100) glucose = 100;
    updateGlucoseLevel();

    // Update UI

    insulinLevel.textContent = Math.round(insulinProduction);
    insulinLevelC.textContent = Math.round(insulin);
    glucagonLevel.textContent = glucagonProduction;
  }

  // Repeat update every second
  setTimeout(update, 1000);
}

// Update glucose level function
function updateGlucoseLevel() {
  glucoseLevel.textContent = Math.round(glucose);
  drawGlucoseLevelLine();
}

let metaboliseTimeout = null;
function metabolise() {
  if (gameEnded) {
    return;
  }
  glucose -= 1;
  metaboliseTimeout = setTimeout(metabolise, 500);
}

function setType0() {
  const slider1 = document.getElementById("diabeticSlider");
  slider1.value = 0;
  slider1.dispatchEvent(new Event("input"));

  const slider = document.getElementById("insulinCSlider");
  slider.value = 100;
  slider.dispatchEvent(new Event("input"));
}

function setType1() {
  const slider1 = document.getElementById("diabeticSlider");
  slider1.value = 0;
  slider1.dispatchEvent(new Event("input"));

  const slider = document.getElementById("insulinCSlider");
  slider.value = 60;
  slider.dispatchEvent(new Event("input"));
}

function setType2() {
  const slider1 = document.getElementById("diabeticSlider");
  slider1.value = 40;
  slider1.dispatchEvent(new Event("input"));

  const slider = document.getElementById("insulinCSlider");
  slider.value = 90;
  slider.dispatchEvent(new Event("input"));
}

// Initial call to update function
update();
// Initial call to metabolise function
metabolise();

// Initial call to update clock and draw time line
updateClock();
drawTimeLine();
drawGlucoseLevelLine();

// no meals to start
toggleMeals();
