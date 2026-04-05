/**
 * generateAudio.js
 * Generates Turkish TTS MP3 files using the edge-tts Python CLI.
 *
 * Usage:
 *   node scripts/generateAudio.js
 *
 * Requires edge-tts to be installed:
 *   pip install edge-tts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VOICE = 'tr-TR-EmelNeural';
const OUT_DIR = path.join(__dirname, '..', 'assets', 'audio');

fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * Generate a single MP3 file via edge-tts CLI.
 * @param {string} text  - Turkish text to synthesise
 * @param {string} filename - output filename (without path)
 */
function speak(text, filename) {
  const outPath = path.join(OUT_DIR, filename);
  // edge-tts CLI: edge-tts --voice <voice> --text "<text>" --write-media <path>
  const escaped = text.replace(/"/g, '\\"');
  execSync(
    `edge-tts --voice ${VOICE} --text "${escaped}" --write-media "${outPath}"`,
    { stdio: 'pipe' }
  );
  const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`  OK  ${filename}  (${sizeKB} KB)`);
  return outPath;
}

// ── Test batch: Omuz Koprusu (bridge) steps ───────────────────────────────

const TEST_ITEMS = [
  {
    file: 'B01_step1.mp3',
    text: 'Sirtüstü uzan. Dizleri bük, ayak tabanlarini yere bas. Kolların yanında rahat dursun. Derin bir nefes al ve hazırlan.',
  },
  {
    file: 'B01_step2.mp3',
    text: 'Nefes vererek kalçalarını yavaşça minderden kaldır. Karın kaslarını sık, sırtını düz tut.',
  },
  {
    file: 'B01_step3.mp3',
    text: 'Diz, kalça ve omuzların düz bir hat oluşturduğundan emin ol. Üç ile beş nefes tut, sonra yavaşça aşağı in.',
  },
];

console.log(`\nVoice: ${VOICE}`);
console.log(`Output: ${OUT_DIR}\n`);

for (const item of TEST_ITEMS) {
  speak(item.text, item.file);
}

console.log('\nDone. Files:');
for (const item of TEST_ITEMS) {
  const p = path.join(OUT_DIR, item.file);
  const sizeKB = Math.round(fs.statSync(p).size / 1024);
  console.log(`  ${item.file}  ${sizeKB} KB  ${p}`);
}
