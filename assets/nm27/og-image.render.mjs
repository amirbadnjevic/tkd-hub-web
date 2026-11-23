/**
 * Renders the social share image for nordic-championship-2027.html (1200x630).
 *   node assets/nm27/og-image.render.mjs
 * Puppeteer is borrowed from the API service, as in the other *.render.mjs files.
 */
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
const PUPPETEER = path.join(os.homedir(), 'Amir/TKD/tkd-hub/services/tkd-hub-api/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js');
const { default: puppeteer } = await import(PUPPETEER);
const DIR = path.dirname(new URL(import.meta.url).pathname);
const img = n => `data:image/jpeg;base64,${fs.readFileSync(path.join(DIR, n)).toString('base64')}`;
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Oswald:wght@600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#0B0706;position:relative;overflow:hidden;font-family:Oswald,sans-serif;color:#FFF6F0}
.img{position:absolute;top:0;width:600px;height:630px;background-size:cover}
.k{left:0;background-image:url(${img('hero-kyorugi.jpg')});background-position:12% 0;background-size:auto 100%}
.p{right:0;background-image:url(${img('hero-poomsae.jpg')});background-position:88% 0;background-size:auto 100%}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,7,6,.0) 25%,rgba(11,7,6,.94) 72%)}
.t{position:absolute;left:0;right:0;bottom:42px;text-align:center}
.s{font-family:Cinzel,serif;color:#F59A2C;font-size:66px;text-shadow:0 0 30px rgba(239,84,20,.6)}
.y{font-size:44px;font-weight:700;color:#EF5414;letter-spacing:.06em;margin-top:-4px}
.w{font-size:26px;letter-spacing:.14em;text-transform:uppercase;margin-top:8px}.w b{color:#EF5414;padding:0 10px}
.tag{position:absolute;top:24px;font-size:28px;font-weight:700;letter-spacing:.12em;padding:6px 16px;border-radius:999px}
.tk{left:24px;background:#EF5414}.tp{right:24px;background:#F59A2C;color:#2a1404}
</style></head><body>
<div class="img k"></div><div class="img p"></div><div class="shade"></div>
<div class="tag tk">KYORUGI · 23 JAN</div><div class="tag tp">POOMSAE · 24 JAN</div>
<div class="t"><div class="s">Nordic Championship</div><div class="y">TAEKWONDO 2027</div>
<div class="w">Kristianstad Arena<b>|</b>Sweden<b>|</b>23–24 January</div></div>
</body></html>`;
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(DIR, 'og-image.jpg'), type: 'jpeg', quality: 84 });
await browser.close();
console.log('wrote og-image.jpg');
