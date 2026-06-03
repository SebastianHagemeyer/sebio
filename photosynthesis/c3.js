const canvas = document.getElementById('c3Canvas');
const ctx = canvas.getContext('2d');
const toggleGasCheckbox = document.getElementById('toggleGas');

// Colors
const backgroundColor = '#e0f7fa';
const chloroplastColor = '#4caf50';
const co2Color = '#f44336';
const o2Color = '#2196f3';
const pgaColor = '#03a9f4';
const phosphoglycolateColor = '#8e44ad';
const glucoseColor = '#ff9800';
const h2oColor = '#3498db';
const rubiscoColor = '#9c27b0';
const rubpColor = '#ff5722';

// Chloroplast position and size
const chloroplast = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 100
};

// Initial positions
let gasPosition = { x: 50, y: 50 };
const rubpPosition = { x: chloroplast.x - 30, y: chloroplast.y - 30 };
let rubiscoPosition = { x: rubpPosition.x + 30, y: rubpPosition.y + 30 };
let productPosition = { x: chloroplast.x, y: chloroplast.y };
let glucosePositions = [];
let co2OutPositions = [];
let h2oOutPositions = [];

// Animation variables
const speed = 2;
let gasReached = false;
let rubiscoReached = false;
let productProduced = false;
let gasVisible = true;
let rubpVisible = true;

function drawChloroplast() {
  ctx.beginPath();
  ctx.arc(chloroplast.x, chloroplast.y, chloroplast.radius, 0, 2 * Math.PI);
  ctx.fillStyle = chloroplastColor;
  ctx.fill();
  ctx.stroke();
}

function drawMolecule(position, color, label, visible) {
  if (!visible) return;
  ctx.beginPath();
  ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.fillText(label, position.x - 10, position.y - 15);
}

function resetGas() {
  gasPosition = { x: 50, y: 50 };
  gasReached = false;
  rubiscoReached = false;
  productProduced = false;
  gasVisible = true;
  rubpVisible = true;
  rubiscoPosition = { x: rubpPosition.x + 30, y: rubpPosition.y + 30 };
  co2OutPositions = [];
  h2oOutPositions = [];
}

function produceGlucose() {
  const offsetX = Math.random() * 200 - 100;
  const offsetY = Math.random() * 200 - 100;
  glucosePositions.push({
    x: productPosition.x,
    y: productPosition.y,
    targetX: chloroplast.x + chloroplast.radius + 200 + offsetX,
    targetY: chloroplast.y + offsetY
  });
  setTimeout(resetGas, 1000); // Reset gas position after 1 second
}

function produceCo2AndH2o() {
  co2OutPositions.push({
    x: productPosition.x,
    y: productPosition.y,
    targetX: productPosition.x + Math.random() * 400 - 100,
    targetY: productPosition.y + Math.random() * 400 - 100
  });
  h2oOutPositions.push({
    x: productPosition.x,
    y: productPosition.y,
    targetX: productPosition.x + Math.random() * 400 - 100,
    targetY: productPosition.y + Math.random() * 400 - 100
  });
  setTimeout(resetGas, 2500); // Reset gas position after 1 second
}

function animate() {
  const isUsingO2 = toggleGasCheckbox.checked;
  const gasColor = isUsingO2 ? o2Color : co2Color;
  const gasLabel = isUsingO2 ? 'O2' : 'CO2';
  const productLabel = isUsingO2 ? '2-PG' : '3-PGA';
  const productColor = isUsingO2 ? phosphoglycolateColor : pgaColor;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawChloroplast();
  drawMolecule(gasPosition, gasColor, gasLabel, gasVisible);
  drawMolecule(rubpPosition, rubpColor, 'RuBP', rubpVisible);
  drawMolecule(rubiscoPosition, rubiscoColor, 'RuBisCO', true);

  if (!gasReached) {
    if (gasPosition.x < rubpPosition.x - 20) {
      gasPosition.x += speed;
    } else if (gasPosition.y < rubpPosition.y) {
      gasPosition.y += speed;
    } else {
      gasReached = true;
    }
  } else if (!rubiscoReached) {
    if (rubiscoPosition.x > rubpPosition.x + 10) {
      rubiscoPosition.x -= speed;
    } else if (rubiscoPosition.y > rubpPosition.y + 10) {
      rubiscoPosition.y -= speed;
    } else {
      rubiscoReached = true;
      
      productPosition = { x: rubpPosition.x, y: rubpPosition.y };
      setTimeout(() => {
        gasVisible = false;
        rubpVisible = false;
		productProduced = true;
      }, 500); // Hide gas and RuBP after 0.5 seconds

      if (isUsingO2) {
        setTimeout(produceCo2AndH2o, 1000); // Produce CO2 and H2O after 1 second
      } else {
        setTimeout(produceGlucose, 1000);
      }
    }
  }

  if (productProduced) {
    productPosition.x = chloroplast.x + Math.cos(Date.now() / 500) * 30;
    productPosition.y = chloroplast.y + Math.sin(Date.now() / 500) * 30;
    drawMolecule(productPosition, productColor, productLabel, true);
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

    drawMolecule(pos, glucoseColor, 'Glucose', true);
  });

  co2OutPositions.forEach((pos) => {
    const dx = pos.targetX - pos.x;
    const dy = pos.targetY - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    if (distance > speed) {
      pos.x += moveX;
      pos.y += moveY;
    }

    drawMolecule(pos, co2Color, 'CO2', true);
  });

  h2oOutPositions.forEach((pos) => {
    const dx = pos.targetX - pos.x;
    const dy = pos.targetY - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    if (distance > speed) {
      pos.x += moveX;
      pos.y += moveY;
    }

    drawMolecule(pos, h2oColor, 'H2O', true);
  });

  requestAnimationFrame(animate);
}

animate();
