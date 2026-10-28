/**
 * Renders the artwork for the app's "Advertise here" Featured card (1350x1080, 5:4).
 *
 *   node advertise-card.render.mjs
 *
 * Outputs:
 *   ./advertise-card.png                                       preview, next to this file
 *   ~/Amir/TKD/tkd-hub/services/tkd-hub-api/data/featured-promos/<OUT_NAME>
 *
 * Phones cache promo images for a year, so a changed artwork needs a new OUT_NAME
 * (and the matching "image" in featured_promos.json).
 *
 * Narrow phones crop the card's sides by up to ~100px, so keep everything inside
 * the 140px side padding.
 *
 * Puppeteer is borrowed from the API service, as in play-feature-graphic.render.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const OUT_NAME = process.env.OUT_NAME || 'advertise-here-v3.webp';
const TKD_HUB = path.join(os.homedir(), 'Amir/TKD/tkd-hub');
const PUPPETEER = path.join(TKD_HUB, 'services/tkd-hub-api/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js');
const PROMO_DIR = path.join(TKD_HUB, 'services/tkd-hub-api/data/featured-promos');
const { default: puppeteer } = await import(PUPPETEER);

const DIR = path.dirname(new URL(import.meta.url).pathname);
const LOGO = `data:image/png;base64,${fs.readFileSync(path.join(DIR, 'logo.png')).toString('base64')}`;
const W = 1350, H = 1080;

// Brand tokens, taken from the :root block on tkd-hub.com.
const C = { primary: '#776ECA', primaryDark: '#5A52A3', primaryDeep: '#3E3784', gold: '#FAD582', dark: '#2D2B42' };

const group = (label, items) => `
  <div style="margin-bottom:30px">
    <div style="font-size:30px;font-weight:700;letter-spacing:4px;color:${C.gold}">${label}</div>
    <div style="font-size:46px;font-weight:600;color:#fff;margin-top:6px;white-space:nowrap">
      ${items.join(`<span style="color:rgba(255,255,255,.45);margin:0 16px">·</span>`)}
    </div>
  </div>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Reggae+One&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
  .stage{width:${W}px;height:${H}px;position:relative;overflow:hidden;padding:100px 140px;
    background:linear-gradient(135deg,${C.primary} 0%,${C.primaryDark} 60%,${C.primaryDeep} 100%)}
  .brand{font-family:'Reggae One',cursive;font-weight:400}
</style></head><body>
<div class="stage">
  <div class="brand" style="font-size:124px;line-height:1.08;color:#fff;text-shadow:0 8px 34px rgba(0,0,0,.25)">
    Get featured<br>in the <span style="color:${C.gold}">Hub</span>
  </div>
  <div style="margin-top:40px;font-size:46px;line-height:1.3;font-weight:500;color:#EDEBFA;white-space:nowrap">
    Athletes, coaches &amp; parents open<br>TKD Hub daily. Make sure they see you.
  </div>
  <div style="margin-top:50px">
    ${group('EVENTS', ['Competitions', 'Camps', 'Seminars'])}
    ${group('ANYTHING FOR ATHLETES', ['Gear', 'Apparel', 'Nutrition', 'Drinks'])}
  </div>
  <div style="position:absolute;left:140px;bottom:100px;background:${C.gold};color:${C.dark};font-size:44px;font-weight:700;
    padding:24px 48px;border-radius:999px;box-shadow:0 12px 30px rgba(0,0,0,.25);white-space:nowrap">Get in touch&nbsp;→</div>
  <img src="${LOGO}" style="position:absolute;right:140px;bottom:92px;width:150px;height:150px;border-radius:36px;
    box-shadow:0 12px 32px rgba(0,0,0,.3)">
</div></body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(DIR, 'advertise-card.png'), type: 'png' });
await page.screenshot({ path: path.join(PROMO_DIR, OUT_NAME), type: 'webp', quality: 88 });
await browser.close();
console.log('wrote advertise-card.png and', OUT_NAME);
