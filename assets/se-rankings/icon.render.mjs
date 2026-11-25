/**
 * Renders the SE Rankings home-screen / PWA icons.
 *
 *   node assets/se-rankings/icon.render.mjs
 *
 * Outputs, next to this file:
 *   icon-512.png              manifest icon (any + maskable)
 *   icon-192.png              manifest icon (any + maskable)
 *   apple-touch-icon.png      180x180, iOS home screen
 *   favicon-32.png            browser tab
 *
 * Full-bleed, no transparency: iOS and Android apply their own corner mask.
 * Artwork stays inside the central 80% so maskable crops never cut it.
 * Puppeteer is borrowed from the sibling tkd-hub checkout (same as play-feature-graphic.render.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const PUPPETEER = path.join(
  os.homedir(),
  'Amir/TKD/tkd-hub/services/tkd-hub-api/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js',
);
if (!fs.existsSync(PUPPETEER)) {
  console.error(`puppeteer not found at ${PUPPETEER}`);
  process.exit(1);
}
const { default: puppeteer } = await import(PUPPETEER);
const DIR = path.dirname(new URL(import.meta.url).pathname);

// Tokens from se-rankings.html :root
const C = {
  primary: '#776ECA', primaryDark: '#5A52A3', primaryDeep: '#3E3784', primaryLight: '#9D95E0',
  gold: '#FAD582', silver: '#DCDDE6', bronze: '#EBC2A0', dark: '#2D2B42',
  seBlue: '#006AA7', seYellow: '#FECC02',
};

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.55" y2="1">
      <stop offset="0" stop-color="${C.primary}"/>
      <stop offset="0.55" stop-color="${C.primaryDark}"/>
      <stop offset="1" stop-color="${C.primaryDeep}"/>
    </linearGradient>
    <radialGradient id="glowG" cx="0.15" cy="0.12" r="0.5">
      <stop offset="0" stop-color="${C.gold}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${C.gold}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowP" cx="0.92" cy="0.92" r="0.5">
      <stop offset="0" stop-color="${C.primaryLight}" stop-opacity="0.50"/>
      <stop offset="1" stop-color="${C.primaryLight}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="flagClip"><rect x="196" y="92" width="120" height="76" rx="12"/></clipPath>
  </defs>

  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#glowG)"/>
  <rect width="512" height="512" fill="url(#glowP)"/>

  <g transform="translate(256 256) scale(0.85) translate(-256 -256)">
  <!-- faint octagon motif (brand) -->
  <polygon points="181,46 331,46 437,152 437,302 331,408 181,408 75,302 75,152"
    fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="5" stroke-linejoin="round"/>

  <!-- Swedish flag -->
  <g clip-path="url(#flagClip)">
    <rect x="196" y="92" width="120" height="76" fill="${C.seBlue}"/>
    <rect x="232" y="92" width="16" height="76" fill="${C.seYellow}"/>
    <rect x="196" y="122" width="120" height="16" fill="${C.seYellow}"/>
  </g>
  <rect x="196" y="92" width="120" height="76" rx="12" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="3"/>

  <!-- podium -->
  <g font-family="Inter, -apple-system, sans-serif" font-weight="700" text-anchor="middle">
    <rect x="94"  y="282" width="108" height="140" rx="14" fill="${C.silver}"/>
    <rect x="202" y="200" width="108" height="222" rx="14" fill="${C.gold}"/>
    <rect x="310" y="322" width="108" height="100" rx="14" fill="${C.bronze}"/>
    <!-- hide inner rounded corners where blocks meet -->
    <rect x="188" y="282" width="28" height="140" fill="${C.silver}"/>
    <rect x="202" y="200" width="108" height="222" rx="14" fill="${C.gold}"/>
    <rect x="296" y="322" width="28" height="100" fill="${C.bronze}"/>
    <rect x="202" y="200" width="108" height="222" rx="14" fill="${C.gold}"/>
    <text x="148" y="356" font-size="64" fill="${C.dark}" fill-opacity="0.75">2</text>
    <text x="256" y="292" font-size="84" fill="${C.dark}">1</text>
    <text x="364" y="390" font-size="56" fill="${C.dark}" fill-opacity="0.7">3</text>
  </g>
  </g>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">
<style>html,body{margin:0;width:512px;height:512px;overflow:hidden}svg{display:block}</style>
</head><body>${svg}</body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
for (const [name, size] of [['icon-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180], ['favicon-32.png', 32]]) {
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: size / 512 });
  await page.screenshot({ path: path.join(DIR, name), type: 'png', clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('wrote', name);
}
await browser.close();
