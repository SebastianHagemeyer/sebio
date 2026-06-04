const canvas = document.getElementById("c4Canvas");
const ctx = canvas.getContext("2d");
const toggleGasCheckbox = document.getElementById("toggleGas");

// Colors
const backgroundColor = "#e0f7fa";
const mesophyllColor = "#4caf50";
const bundleSheathColor = "#8bc34a";
const co2Color = "#f44336";
const o2Color = "#2196f3";
const oaaColor = "#03a9f4";
const malateColor = "#03a9f4";
const pyruvateColor = "#ff9800";
const pepColor = "#ffeb3b";
const pepEnzymeColor = "#8e44ad";
const rubiscoColor = "#9c27b0";
const rubpColor = "#ff5722";
const pgaColor = "#03a9f4";
const glucoseColor = "#ff9800";

// Cell positions and sizes
const mesophyll = { x: canvas.width / 4, y: canvas.height / 2, radius: 100 };
const bundleSheath = { x: (3 * canvas.width) / 4, y: canvas.height / 2, radius: 100 };

// Molecule positions
let co2Position = { x: 50, y: 50 };
let pepPosition = { x: mesophyll.x - 30, y: mesophyll.y - 30 };
let pepEnzymePosition = { x: mesophyll.x, y: mesophyll.y + 40 };
let oaaPosition = { x: mesophyll.x, y: mesophyll.y };
let malatePosition = { x: mesophyll.x, y: mesophyll.y };
let pyruvatePosition = { x: bundleSheath.x, y: bundleSheath.y };
let rubiscoPosition = { x: bundleSheath.x - 30, y: bundleSheath.y - 30 };
let rubpPosition = { x: bundleSheath.x + 15, y: bundleSheath.y };
let pgaPosition = { x: bundleSheath.x, y: bundleSheath.y };
let glucosePositions = [];

// Animation variables
const speed = 2;
let co2Reached = false;
let pepReached = false;
let pepEnzymeReached = false;
let oaaProduced = false;
let malateProduced = false;
let glucoseProduced = false;
let pgaProduced = false;
let co2Visible = true;
let oaaVisible = true;
let malateVisible = false;
let rubpVisible = true;
let calvinCo2Visible = false;
let pepvisible = true;
let pgaready = false;
let produced = false;
let rubiscoreached = false;
let a = false;

function resetCO2() {
  co2Position = { x: 50, y: 50 };
  co2Reached = false;
  pepReached = false;
  pepEnzymeReached = false;
  oaaProduced = false;
  malateProduced = false;
  glucoseProduced = false;
  pgaProduced = false;
  co2Visible = true;
  oaaVisible = true;
  malateVisible = false;
  pepvisible = true;
  rubpVisible = true;
  calvinCo2Visible = false;
  pgaready = false;
  produced = false;
  rubiscoreached = false;
  a = false;
  pepPosition = { x: mesophyll.x - 30, y: mesophyll.y - 30 };
  pepEnzymePosition = { x: mesophyll.x, y: mesophyll.y + 40 };
  rubiscoPosition = { x: bundleSheath.x - 30, y: bundleSheath.y - 30 };
  rubpPosition = { x: bundleSheath.x + 15, y: bundleSheath.y };
}

function produceGlucose() {
  const offsetX = Math.random() * 100 - 200;
  const offsetY = Math.random() * 200 + 100;
  glucosePositions.push({
    x: pgaPosition.x,
    y: pgaPosition.y,
    targetX: bundleSheath.x + bundleSheath.radius + 200 + offsetX,
    targetY: bundleSheath.y + offsetY,
  });
  setTimeout(resetCO2, 1000); // Reset CO2 position after 1 second
}

function animate() {
  const isUsingO2 = toggleGasCheckbox.checked;

  const gasColor = isUsingO2 ? o2Color : co2Color;
  const gasLabel = isUsingO2 ? "O2" : "CO2";

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(mesophyll, mesophyllColor, "Mesophyll Cell");
  drawCell(bundleSheath, bundleSheathColor, "Bundle-Sheath Cell");
  drawMolecule(co2Position, gasColor, gasLabel, co2Visible);
  drawMolecule(pepPosition, pepColor, "PEP", pepvisible);
  drawMolecule(pepEnzymePosition, pepEnzymeColor, "PEP Enzyme", true);
  drawMolecule(rubiscoPosition, rubiscoColor, "RuBisCO", true);
  drawMolecule(rubpPosition, rubpColor, "RuBP", rubpVisible);

  if (!co2Reached) {
    if (co2Position.x < pepPosition.x + 15) {
      co2Position.x += speed;
    } else if (co2Position.y < pepPosition.y) {
      co2Position.y += speed;
    } else {
      if (isUsingO2) {
        co2Position.y += speed * 1.5;
        if (!a) {
          a = true;
          console.log("reach");
          setTimeout(resetCO2, 1500); // Reset CO2 position after 1 second
        }
      } else {
        co2Reached = true;
      }
    }
  } else if (!pepEnzymeReached) {
    if (pepEnzymePosition.x < co2Position.x) {
      pepEnzymePosition.x += speed;
    } else if (pepEnzymePosition.y > co2Position.y) {
      pepEnzymePosition.y -= speed;
    } else {
      pepEnzymeReached = true;
      oaaProduced = true;
      oaaPosition = { x: co2Position.x, y: co2Position.y };
    }
  } else if (oaaProduced) {
    co2Visible = false;
    pepvisible = false;

    oaaPosition.x += speed / 2;
    if (oaaPosition.x > mesophyll.x + mesophyll.radius) {
      oaaProduced = false;
      malateProduced = true;
      malatePosition = { x: oaaPosition.x, y: oaaPosition.y };
    }
    drawMolecule(oaaPosition, oaaColor, "OAA", true);
  }

  if (malateProduced) {
    if (malatePosition.x < bundleSheath.x) {
      malatePosition.x += (bundleSheath.x - mesophyll.x) / 120;
      malatePosition.y += (bundleSheath.y - mesophyll.y) / 120;
      drawMolecule(malatePosition, malateColor, "Malate", true);
    } else if (!rubiscoreached) {
      calvinCo2Visible = true;
      malateVisible = false;

      //console.log(rubiscoPosition.x,rubiscoPosition.y )
      if (rubiscoPosition.x < rubpPosition.x + 10) {
        rubiscoPosition.x += speed;
      } else if (rubiscoPosition.y < rubpPosition.y + 10) {
        rubiscoPosition.y += speed;
      } else {
        rubiscoreached = true;
      }
    } else if (!pgaready) {
      //console.log("next")

      pgaready = true;
      setTimeout(() => {
        calvinCo2Visible = false;
        rubpVisible = false;
        pgaProduced = true;
      }, 500); // Release CO2 and start Calvin cycle after 0.5 seconds
    }
  }

  drawMolecule(malatePosition, malateColor, "Malate", malateVisible);
  drawMolecule(bundleSheath, co2Color, "CO2", calvinCo2Visible);

  if (pgaProduced) {
    pgaPosition.x = bundleSheath.x + Math.cos(Date.now() / 500) * 30;
    pgaPosition.y = bundleSheath.y + Math.sin(Date.now() / 500) * 30;
    drawMolecule(pgaPosition, pgaColor, "3-PGA", true);
    if (!produced) {
      setTimeout(produceGlucose, 1000); // Produce glucose after 1 second
      produced = true;
    }
  }

  glucosePositions.forEach((pos) => {
    const dx = pos.targetX - pos.x;
    const dy = pos.targetY - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    if (distance > speed) {
      pos.x += moveX;
      pos.y += moveY;
    }

    drawMolecule(pos, glucoseColor, "Glucose", true);
  });

  requestAnimationFrame(animate);
}

animate();
