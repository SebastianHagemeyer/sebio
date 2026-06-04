// Shared canvas drawing helpers for the photosynthesis pathway animations
// (C3 / C4 / CAM). These were byte-identical across c3.js / c4.js / cam.js.
// Each pathway page defines its own `const ctx = canvas.getContext("2d")`;
// these helpers draw onto that page-global `ctx`, so engine.js must be loaded
// on the same page as a pathway script (it is included just before it).

function drawCell(position, color, label) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, position.radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.fillText(label, position.x - 30, position.y - position.radius - 10);
}

function drawMolecule(position, color, label, visible) {
  if (!visible) return;
  ctx.beginPath();
  ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.fillText(label, position.x - 10, position.y - 15);
}
