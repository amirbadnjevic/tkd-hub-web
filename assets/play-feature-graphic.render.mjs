/**
 * Regenerates the Google Play feature graphics (1024x500) and the 512x512 store icon.
 *
 *   node play-feature-graphic.render.mjs
 *   TAGLINE="Your new tagline" node play-feature-graphic.render.mjs
 *
 * Outputs, next to this file:
 *   play-feature-graphic-a.png   dark   #2D2B42, gold wordmark, icon tile left
 *   play-feature-graphic-b.png   purple gradient, centered wordmark, octagon motif
 *   play-feature-graphic-c.png   light  #FAFAFE, matches tkd-hub.com
 *
 * Play requires exactly 1024x500, PNG/JPEG, no transparency. All three comply.
 * Keep the tagline under ~45 chars or it wraps awkwardly (a/c) or shrinks (b).
 *
 * Source image is ./logo.png (500x500, identical to the Flutter app's assets/logo.png).
 * The octagon is redrawn as vector rather than upscaled from the raster logo.
 *
 * Puppeteer is not a dependency of this repo; it is borrowed from the API service in the
 * sibling tkd-hub checkout. Adjust PUPPETEER if that path moves.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const PUPPETEER = path.join(
  os.homedir(),
  'Amir/TKD/tkd-hub/services/tkd-hub-api/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js',
);
if (!fs.existsSync(PUPPETEER)) {
  console.error(`puppeteer not found at ${PUPPETEER}\nRun "npm ci" in tkd-hub/services/tkd-hub-api, or edit PUPPETEER above.`);
  process.exit(1);
}
const { default: puppeteer } = await import(PUPPETEER);

const DIR = path.dirname(new URL(import.meta.url).pathname);
const LOGO = `data:image/png;base64,${fs.readFileSync(path.join(DIR, 'logo.png')).toString('base64')}`;
const TAGLINE = process.env.TAGLINE || 'All Taekwondo Events in One Hub';

// TAGLINE_FONT=brand sets the tagline in Reggae One (matching the wordmark);
// anything else uses Inter, which is how tkd-hub.com pairs the two faces.
// Reggae One is a display face, so the brand setting also drops the size and
// loosens the leading to stay readable at the size Play renders listings.
const BRAND_TAGLINE = process.env.TAGLINE_FONT === 'brand';
const SUFFIX = BRAND_TAGLINE ? '-brand' : '';
const TF = BRAND_TAGLINE
  ? "font-family:'Reggae One',cursive;font-weight:400;font-size:27px;line-height:1.45"
  : "font-size:31px;line-height:1.32;font-weight:500";
const TF_B = BRAND_TAGLINE
  ? "font-family:'Reggae One',cursive;font-weight:400;font-size:26px;letter-spacing:0"
  : "font-size:30px;font-weight:600;letter-spacing:.2px";

// Brand tokens, taken from the :root block on tkd-hub.com.
const C = {
  primary: '#776ECA', primaryDark: '#5A52A3', secondary: '#CAD4F1',
  gold: '#FAD582', goldDark: '#E8C060', dark: '#2D2B42', bg: '#FAFAFE',
};

const octagon = (stroke, w, sw) => `
<svg viewBox="0 0 100 100" style="width:${w}px;height:${w}px" fill="none">
  <polygon points="29.3,2 70.7,2 98,29.3 98,70.7 70.7,98 29.3,98 2,70.7 2,29.3"
    stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
</svg>`;

const shell = (body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Reggae+One&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1024px;height:500px;overflow:hidden}
  body{font-family:'Inter',-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
  .stage{width:1024px;height:500px;position:relative;overflow:hidden;display:flex}
  .brand{font-family:'Reggae One',cursive;font-weight:400}
</style></head><body>${body}</body></html>`;

const variants = {
  a: shell(`
  <div class="stage" style="background:${C.dark};align-items:center;padding:0 86px;gap:56px">
    <div style="position:absolute;right:-90px;top:-120px;opacity:.10">${octagon(C.gold, 560, 3)}</div>
    <div style="position:absolute;right:150px;bottom:-190px;opacity:.06">${octagon(C.secondary, 340, 3)}</div>
    <img src="${LOGO}" style="width:250px;height:250px;border-radius:56px;flex:none;box-shadow:0 24px 60px rgba(0,0,0,.45)">
    <div style="position:relative">
      <div class="brand" style="font-size:96px;line-height:1;color:#fff;letter-spacing:-1px">TKD <span style="color:${C.gold}">HUB</span></div>
      <div style="width:96px;height:6px;background:${C.gold};border-radius:3px;margin:26px 0 24px"></div>
      <div style="${TF};color:${C.secondary};max-width:430px;text-wrap:balance">${TAGLINE}</div>
    </div>
  </div>`),

  b: shell(`
  <div class="stage" style="background:linear-gradient(135deg,${C.primary} 0%,${C.primaryDark} 100%);align-items:center;justify-content:center;flex-direction:column">
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:.16">${octagon(C.gold, 700, 2.2)}</div>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:.10">${octagon('#fff', 900, 1.6)}</div>
    <div style="position:relative;text-align:center">
      <div class="brand" style="font-size:112px;line-height:1;color:#fff;letter-spacing:-1px;text-shadow:0 8px 34px rgba(45,43,66,.4)">TKD HUB</div>
      <div style="display:flex;align-items:center;gap:20px;justify-content:center;margin-top:30px">
        <span style="width:70px;height:4px;background:${C.gold};border-radius:2px"></span>
        <span style="${TF_B};color:#fff;white-space:nowrap">${TAGLINE}</span>
        <span style="width:70px;height:4px;background:${C.gold};border-radius:2px"></span>
      </div>
    </div>
  </div>`),

  c: shell(`
  <div class="stage" style="background:${C.bg};align-items:center;padding:0 86px;gap:56px">
    <div style="position:absolute;left:0;top:0;width:100%;height:10px;background:linear-gradient(90deg,${C.primary},${C.gold})"></div>
    <div style="position:absolute;right:-120px;bottom:-160px;opacity:.13">${octagon(C.primary, 520, 3)}</div>
    <img src="${LOGO}" style="width:250px;height:250px;border-radius:56px;flex:none;box-shadow:0 20px 48px rgba(119,110,202,.34)">
    <div style="position:relative">
      <div class="brand" style="font-size:96px;line-height:1;color:${C.dark};letter-spacing:-1px">TKD <span style="color:${C.primary}">HUB</span></div>
      <div style="width:96px;height:6px;background:${C.gold};border-radius:3px;margin:26px 0 24px"></div>
      <div style="${TF};color:#555;max-width:430px;text-wrap:balance">${TAGLINE}</div>
    </div>
  </div>`),
};

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
for (const [name, html] of Object.entries(variants)) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(DIR, `play-feature-graphic-${name}${SUFFIX}.png`);
  await page.screenshot({ path: out, type: 'png', omitBackground: false });
  console.log('wrote', path.basename(out));
  await page.close();
}
await browser.close();
