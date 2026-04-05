#!/usr/bin/env node
/**
 * generateGifs.js
 *
 * Renders each pose's keyframes as PNGs via canvas + SVG strings,
 * then encodes them into animated GIFs using gif-encoder-2.
 *
 * Output: src/assets/gifs/<exercise-id>.gif
 * Run:    node scripts/generateGifs.js
 */

'use strict';

const path = require('path');
const fs   = require('fs');
const { createCanvas } = require('canvas');
const GifEncoder = require('gif-encoder-2');

// ── Config ────────────────────────────────────────────────────
const WIDTH  = 300;
const HEIGHT = 400;
const BG     = '#FAF7F2';  // warm cream background
const STROKE = '#5C7F61';  // sage green
const SW     = 2.5;
const FPS    = 8;          // frames per second for GIF playback

const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'gifs');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Anchor points (mirrors PilatesCharacter.tsx) ──────────────
const A = {
  hip:           { x: 150, y: 215 },
  shoulder:      { x: 150, y: 155 },
  neck:          { x: 150, y: 148 },
  head:          { x: 150, y: 133 },
  leftShoulder:  { x: 133, y: 158 },
  rightShoulder: { x: 167, y: 158 },
  leftElbow:     { x: 122, y: 185 },
  rightElbow:    { x: 178, y: 185 },
  leftHip:       { x: 139, y: 218 },
  rightHip:      { x: 161, y: 218 },
  leftKnee:      { x: 134, y: 262 },
  rightKnee:     { x: 166, y: 262 },
};

// ── Transform helper ──────────────────────────────────────────
function applyTransform(ctx, ax, ay, t) {
  if (!t) return;
  if (t.tx || t.ty) ctx.translate(t.tx || 0, t.ty || 0);
  if (t.rotate)     ctx.rotate((t.rotate * Math.PI) / 180);
}

// ── Drawing helpers ───────────────────────────────────────────
function line(ctx, x1, y1, x2, y2, lw) {
  ctx.save();
  ctx.lineWidth = lw || SW;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function dot(ctx, x, y, r, col) {
  ctx.save();
  ctx.fillStyle = col || STROKE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function ellipse(ctx, cx, cy, rx, ry, fillCol) {
  ctx.save();
  ctx.fillStyle = fillCol || BG;
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// ── Part renderers ────────────────────────────────────────────
function drawHead(ctx, t) {
  ctx.save();
  ctx.translate(A.head.x, A.head.y);
  applyTransform(ctx, 0, 0, t);
  ellipse(ctx, 0, 0, 13, 16, '#EDE8E0');
  // Hair arc
  ctx.save();
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW * 0.8;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(-11, -6);
  ctx.quadraticCurveTo(0, -28, 11, -6);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

function drawNeck(ctx, t) {
  ctx.save();
  ctx.translate(A.neck.x, A.neck.y);
  applyTransform(ctx, 0, 0, t);
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW * 1.1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, A.shoulder.y - A.neck.y + 2);
  ctx.stroke();
  ctx.restore();
}

function drawTorso(ctx, t) {
  ctx.save();
  ctx.translate(A.hip.x, A.hip.y);
  applyTransform(ctx, 0, 0, t);

  const relShouY = A.shoulder.y - A.hip.y;  // negative (above)
  const relShouX = 0;

  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW;

  // Torso outline
  ctx.fillStyle = '#D4E8D6';
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.bezierCurveTo(-18, -25, -17, relShouY + 10, -17, relShouY);
  ctx.lineTo(17, relShouY);
  ctx.bezierCurveTo(17, relShouY + 10, 18, -25, 16, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shoulder yoke
  ctx.lineWidth = SW * 1.2;
  ctx.beginPath();
  ctx.moveTo(-17, relShouY);
  ctx.lineTo(17, relShouY);
  ctx.stroke();

  // Spine dash
  ctx.save();
  ctx.setLineDash([3, 4]);
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(0, relShouY + 4);
  ctx.lineTo(0, -2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawUpperArm(ctx, anchor, elbow, t) {
  ctx.save();
  ctx.translate(anchor.x, anchor.y);
  applyTransform(ctx, 0, 0, t);
  const dx = elbow.x - anchor.x;
  const dy = elbow.y - anchor.y;
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW * 1.3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(dx, dy);
  ctx.stroke();
  dot(ctx, dx, dy, 2.5);
  ctx.restore();
}

function drawForearm(ctx, elbow, offset, t) {
  ctx.save();
  ctx.translate(elbow.x, elbow.y);
  applyTransform(ctx, 0, 0, t);
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(offset.x, offset.y);
  ctx.stroke();
  // Hand
  ellipse(ctx, offset.x, offset.y + 5, 4, 5, '#EDE8E0');
  ctx.restore();
}

function drawThigh(ctx, hip, knee, t) {
  ctx.save();
  ctx.translate(hip.x, hip.y);
  applyTransform(ctx, 0, 0, t);
  const dx = knee.x - hip.x;
  const dy = knee.y - hip.y;
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW * 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(dx, dy);
  ctx.stroke();
  ctx.save();
  ctx.fillStyle = STROKE;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(dx, dy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function drawShin(ctx, knee, footOffset, t) {
  ctx.save();
  ctx.translate(knee.x, knee.y);
  applyTransform(ctx, 0, 0, t);
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW * 1.1;
  // shin
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(footOffset.x, footOffset.y);
  ctx.stroke();
  // foot arc
  ctx.beginPath();
  ctx.moveTo(footOffset.x, footOffset.y);
  ctx.quadraticCurveTo(
    footOffset.x + footOffset.fx,
    footOffset.y + 4,
    footOffset.x + footOffset.fx * 2,
    footOffset.y + 2
  );
  ctx.stroke();
  ctx.restore();
}

// ── Render one frame ──────────────────────────────────────────
function renderFrame(canvas, keyframe) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Mat line
  ctx.save();
  ctx.strokeStyle = '#D4C9BC';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(30, 370);
  ctx.lineTo(270, 370);
  ctx.stroke();
  ctx.restore();

  // Set base styles
  ctx.strokeStyle = STROKE;
  ctx.lineWidth = SW;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const kf = keyframe || {};

  drawTorso(ctx, kf.torso);
  drawNeck(ctx, kf.neck);
  drawHead(ctx, kf.head);

  // Left arm
  drawUpperArm(ctx, A.leftShoulder, A.leftElbow, kf.leftUpperArm);
  drawForearm(ctx, A.leftElbow, { x: -6, y: 22 }, kf.leftForearm);

  // Right arm
  drawUpperArm(ctx, A.rightShoulder, A.rightElbow, kf.rightUpperArm);
  drawForearm(ctx, A.rightElbow, { x: 6, y: 22 }, kf.rightForearm);

  // Left leg
  drawThigh(ctx, A.leftHip, A.leftKnee, kf.leftThigh);
  drawShin(ctx, A.leftKnee, { x: -3, y: 40, fx: -7 }, kf.leftShin);

  // Right leg
  drawThigh(ctx, A.rightHip, A.rightKnee, kf.rightThigh);
  drawShin(ctx, A.rightKnee, { x: 3, y: 40, fx: 7 }, kf.rightShin);
}

// ── Generate GIF for one pose ─────────────────────────────────
async function generateGif(pose) {
  const outPath = path.join(OUT_DIR, `${pose.id}.gif`);
  const canvas  = createCanvas(WIDTH, HEIGHT);

  const encoder = new GifEncoder(WIDTH, HEIGHT, 'neuquant', true);
  encoder.setDelay(Math.round(1000 / FPS));
  encoder.setRepeat(0); // infinite loop
  encoder.setQuality(10);

  const stream = fs.createWriteStream(outPath);
  encoder.createReadStream().pipe(stream);
  encoder.start();

  for (const keyframe of pose.keyframes) {
    renderFrame(canvas, keyframe);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    encoder.addFrame(imageData.data);
  }

  encoder.finish();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  console.log(`  ✓  ${pose.id}.gif  (${pose.keyframes.length} frames)`);
}

// ── Inline pose data (mirrors poses.ts) ──────────────────────
// We re-define them here as plain JS to avoid TSC at runtime.
const POSES = require('./posesData.js');

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('\n🌿 Generating Pilates GIFs…\n');
  for (const pose of POSES) {
    await generateGif(pose);
  }
  console.log(`\n✨ Done! ${POSES.length} GIFs saved to src/assets/gifs/\n`);
}

main().catch((err) => {
  console.error('Error generating GIFs:', err);
  process.exit(1);
});
