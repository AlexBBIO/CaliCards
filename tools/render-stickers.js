/* Renders the sticker SVGs to PNGs with alpha transparency preserved
   (transparent = bare holographic foil in the print files). */
const { chromium } = require("playwright");
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO = path.resolve(__dirname, "..");

const ASSETS = [
  { svg: "sticker-card-trio.svg", w: 1500, h: 900 },
  { svg: "sticker-card-trio-screen.svg", w: 1500, h: 900 },
  { svg: "sticker-trio-banner.svg", w: 1280, h: 900 },
  { svg: "sticker-trio-banner-screen.svg", w: 1280, h: 900 },
  { svg: "sticker-trio-badge.svg", w: 1200, h: 1200 },
  { svg: "sticker-trio-badge-screen.svg", w: 1200, h: 1200 },
];

(async () => {
  const exe = execSync("ls -d /opt/pw-browsers/chromium*/chrome-linux/chrome").toString().trim().split("\n")[0];
  const browser = await chromium.launch({ executablePath: exe });
  const wrap = path.join(os.tmpdir(), "wrap-stickers.html");

  for (const a of ASSETS) {
    const file = REPO + "/print/stickers/" + a.svg;
    const svg = fs
      .readFileSync(file, "utf8")
      .replace(/<svg /, `<svg width="${a.w}" height="${a.h}" `)
      .replace(/width="[0-9.]+in" height="[0-9.]+in" (viewBox)/, "$1");
    fs.writeFileSync(
      wrap,
      '<link rel="stylesheet" href="file://' + REPO + '/css/fonts.css"><body style="margin:0;background:transparent">' + svg + "</body>"
    );
    const p = await browser.newPage({ viewport: { width: a.w, height: a.h } });
    await p.goto("file://" + wrap);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: file.replace(/\.svg$/, ".png"), omitBackground: true });

    const boxes = await p.evaluate(() =>
      [...document.querySelectorAll("text")].map((t) => {
        const b = t.getBBox();
        return { text: t.textContent, x: +b.x.toFixed(1), right: +(b.x + b.width).toFixed(1) };
      })
    );
    await p.close();
    console.log(a.svg.replace(/\.svg$/, ".png"), a.w + "x" + a.h, boxes.length ? JSON.stringify(boxes) : "");
  }

  await browser.close();
})();
