const islet = document.getElementById("islet");
const slider = document.getElementById("insulinCSlider");

const percentLabel = document.getElementById("percent");
const betaCountDisplay = document.getElementById("betaCount");
const alphaCountDisplay = document.getElementById("alphaCount");

const totalCells = 50;
const alphaCellsCount = 10;
const betaCellsCount = totalCells - alphaCellsCount;

const betaCells = [];
const alphaCells = [];

let isletSize = 300; // default size
let center = isletSize / 2;

// Set the islet size dynamically
function setSize(size) {
  isletSize = size;
  center = isletSize / 2;

  const isletContainer = document.getElementById("islet-container");
  isletContainer.style.width = `${isletSize}px`;
  isletContainer.style.height = `${isletSize}px`;

  updateCells(parseInt(slider.value));
}

// Create alpha cells
for (let i = 0; i < alphaCellsCount; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell", "alpha");
  islet.appendChild(cell);
  alphaCells.push(cell);
}

// Create beta cells
for (let i = 0; i < betaCellsCount; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell", "beta");
  islet.appendChild(cell);
  betaCells.push(cell);
}

// Shared non-overlapping position generator
function generateMixedPositions(alphaCount, betaCount, radius, alphaSize, betaSize, buffer = 2) {
  const allCells = [];
  const maxAttempts = (alphaCount + betaCount) * 100;
  let attempts = 0;

  while (allCells.length < alphaCount + betaCount && attempts < maxAttempts) {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.sqrt(Math.random()) * radius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    const newSize = allCells.length < alphaCount ? alphaSize : betaSize;
    let tooClose = false;

    for (const cell of allCells) {
      const dx = x - cell.x;
      const dy = y - cell.y;
      const minDist = (newSize + cell.size) / 2 + buffer;
      if (Math.sqrt(dx * dx + dy * dy) < minDist) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      allCells.push({
        x,
        y,
        type: allCells.length < alphaCount ? 'alpha' : 'beta',
        size: newSize
      });
    }

    attempts++;
  }

  return allCells;
}

function updateCells(percent) {
  percentLabel.textContent = percent;
  const liveBeta = Math.round((percent / 100) * betaCellsCount);
  betaCountDisplay.textContent = liveBeta;
  alphaCountDisplay.textContent = alphaCellsCount;

  const spacingRadius = (isletSize * 0.4) * (0.7 + 0.3 * (percent / 100));
  const minSize = isletSize * 0.065; // scale 20 at 300
  const maxSize = isletSize * 0.083; // scale 25 at 300
  const betaSize = minSize + (maxSize - minSize) * (percent / 100);
  const alphaSize = maxSize;

  const allPositions = generateMixedPositions(
    alphaCellsCount, liveBeta,
    spacingRadius, alphaSize, betaSize
  );

  const alphaPositions = allPositions.filter(p => p.type === 'alpha');
  const betaPositions = allPositions.filter(p => p.type === 'beta');

  // Position alpha cells
  alphaCells.forEach((cell, i) => {
    const pos = alphaPositions[i];
    if (pos) {
      cell.classList.remove("dead");
      cell.style.left = `${center + pos.x - pos.size / 2}px`;
      cell.style.top = `${center + pos.y - pos.size / 2}px`;
      cell.style.width = `${pos.size}px`;
      cell.style.height = `${pos.size}px`;
    }
  });

  // Position beta cells
  betaCells.forEach((cell, i) => {
    const pos = betaPositions[i];
    if (i < liveBeta && pos) {
      cell.classList.remove("dead");
      cell.style.left = `${center + pos.x - pos.size / 2}px`;
      cell.style.top = `${center + pos.y - pos.size / 2}px`;
      cell.style.width = `${pos.size}px`;
      cell.style.height = `${pos.size}px`;
    } else {
      cell.classList.add("dead");
    }
  });
}


// Initialize
//setSize(300); // You can change this to any starting size like 200 or 400
// Initial render
//updateCells(100);

