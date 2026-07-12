/* Renders the card/sign/QR SVGs to print PNGs and machine-verifies the QR codes. */
const { chromium } = require("playwright");
const { execSync } = require("child_process");
const fs = require("fs");
const { PNG } = require("pngjs");
const jsQR = require("jsqr");

const SCRATCH = require("os").tmpdir();
const REPO = require("path").resolve(__dirname, "..");

const ASSETS = [
  { svg: "print/business-cards/card-front.svg", png: "print/business-cards/card-front.png", w: 1088, h: 638, qr: false },
  { svg: "print/business-cards/card-back.svg", png: "print/business-cards/card-back.png", w: 1088, h: 638, qr: true },
  { svg: "print/signs/instagram-qr-sign.svg", png: "print/signs/instagram-qr-sign.png", w: 2550, h: 3300, qr: true },
  { svg: "art/qr-instagram.svg", png: "art/qr-instagram.png", w: 1000, h: 1000, qr: true },
];

(async () => {
  const exe = execSync("ls -d /opt/pw-browsers/chromium*/chrome-linux/chrome").toString().trim().split("\n")[0];
  const browser = await chromium.launch({ executablePath: exe });

  for (const a of ASSETS) {
    const svg = fs
      .readFileSync(REPO + "/" + a.svg, "utf8")
      .replace(/<svg /, `<svg width="${a.w}" height="${a.h}" `)
      .replace(/width="[0-9.]+in" height="[0-9.]+in" (viewBox)/, "$1");
    const wrap = SCRATCH + "/wrap-render.html";
    fs.writeFileSync(
      wrap,
      '<link rel="stylesheet" href="file://' + REPO + '/css/fonts.css"><body style="margin:0">' + svg + "</body>"
    );
    const p = await browser.newPage({ viewport: { width: a.w, height: a.h } });
    await p.goto("file://" + wrap);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: REPO + "/" + a.png });
    await p.close();

    let note = "";
    if (a.qr) {
      const img = PNG.sync.read(fs.readFileSync(REPO + "/" + a.png));
      const code = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
      note = code ? " | QR decodes -> " + code.data : " | QR DECODE FAILED";
    }
    console.log(a.png + " " + a.w + "x" + a.h + note);
  }

  await browser.close();
})();
