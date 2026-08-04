// Shared canvas drawing helpers for the photosynthesis pathway animations
// (C3 / C4 / CAM). Each pathway page defines its own page-global `canvas`
// and `ctx = canvas.getContext("2d")`; these helpers draw onto that global
// `ctx`, so engine.js must be loaded on the same page, just before the
// pathway script.
//
// Labels are NOT painted inline. Every drawCell/drawMolecule call queues a
// label instead; a single microtask per frame (scheduled lazily on the first
// label) runs a small relaxation pass so the label pills shove each other out
// of the way and stay inside the canvas, then paints them on top of the
// molecules. That keeps labels from clashing, stacking or clipping off-edge —
// no per-page changes required, since every pathway already routes its text
// through these two helpers.

const __labelQueue = [];
let __flushScheduled = false;

function __queueLabel(text, x, y, anchorRadius, tint) {
  __labelQueue.push({ text, ax: x, ay: y, ar: anchorRadius, tint });
  if (!__flushScheduled) {
    __flushScheduled = true;
    queueMicrotask(flushLabels);
  }
}

function drawCell(position, color, label) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, position.radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  __queueLabel(label, position.x, position.y, position.radius, color);
}

function drawMolecule(position, color, label, visible) {
  if (!visible) return;
  ctx.beginPath();
  ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  __queueLabel(label, position.x, position.y, 10, color);
}

// Lay out every queued label so no two overlap, then paint them. Runs once per
// frame via queueMicrotask, after all the molecules for the frame are drawn.
function flushLabels() {
  __flushScheduled = false;
  const labels = __labelQueue.splice(0);
  if (!labels.length) return;

  const PAD_X = 7;
  const PAD_Y = 4;
  const FONT_PX = 12;
  const GAP = 5;
  const MARGIN = 3;

  // Isolate all ctx state we touch so molecule outlines in the next frame keep
  // the pathway's default stroke/fill.
  ctx.save();
  ctx.font = `600 ${FONT_PX}px "Century Gothic", "URW Gothic", "Futura", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Size each pill and seed it just above its molecule; remember that ideal
  // spot so the relaxation can tug it back toward its own molecule.
  for (const L of labels) {
    L.w = ctx.measureText(L.text).width + PAD_X * 2;
    L.h = FONT_PX + PAD_Y * 2;
    L.tx = L.ax;
    L.ty = L.ay - L.ar - L.h / 2 - 6;
    L.x = L.tx;
    L.y = L.ty;
  }

  // Relax: separate overlapping pills, gently pull each back toward its molecule,
  // and clamp inside the canvas. A few dozen passes converge each frame; label
  // counts are small so the O(n^2) separation is cheap.
  for (let pass = 0; pass < 40; pass++) {
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i];
        const b = labels[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const overlapX = (a.w + b.w) / 2 + GAP - Math.abs(dx);
        const overlapY = (a.h + b.h) / 2 + GAP - Math.abs(dy);
        if (overlapX > 0 && overlapY > 0) {
          // Push apart along whichever axis needs the smaller shove.
          if (overlapX < overlapY) {
            if (dx === 0) dx = 1;
            const push = (overlapX / 2) * (dx < 0 ? -1 : 1);
            a.x -= push;
            b.x += push;
          } else {
            if (dy === 0) dy = 1;
            const push = (overlapY / 2) * (dy < 0 ? -1 : 1);
            a.y -= push;
            b.y += push;
          }
        }
      }
    }
    for (const L of labels) {
      L.x += (L.tx - L.x) * 0.02;
      L.y += (L.ty - L.y) * 0.02;
      L.x = Math.max(L.w / 2 + MARGIN, Math.min(canvas.width - L.w / 2 - MARGIN, L.x));
      L.y = Math.max(L.h / 2 + MARGIN, Math.min(canvas.height - L.h / 2 - MARGIN, L.y));
    }
  }

  // Paint: a faint leader line back to the molecule when a pill drifted, then
  // the pill itself.
  for (const L of labels) {
    if (Math.hypot(L.x - L.ax, L.y - L.ay) > L.ar + L.h) {
      ctx.beginPath();
      ctx.moveTo(L.ax, L.ay);
      ctx.lineTo(L.x, L.y);
      ctx.strokeStyle = "rgba(20, 32, 58, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    __drawPill(L);
  }

  ctx.restore();
}

function __drawPill(L) {
  const x = L.x - L.w / 2;
  const y = L.y - L.h / 2;
  const r = L.h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + L.w, y, x + L.w, y + L.h, r);
  ctx.arcTo(x + L.w, y + L.h, x, y + L.h, r);
  ctx.arcTo(x, y + L.h, x, y, r);
  ctx.arcTo(x, y, x + L.w, y, r);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = L.tint;
  ctx.stroke();
  ctx.fillStyle = "#14203a";
  ctx.fillText(L.text, L.x, L.y + 0.5);
}
