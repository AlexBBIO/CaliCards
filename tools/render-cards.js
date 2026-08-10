/* Renders the card/sign/QR SVGs to print PNGs and machine-verifies the QR codes. */
const { chromium } = require("playwright");
const { execSync } = require("child_process");
const fs = require("fs");
const { PNG } = require("pngjs");
const jsQR = require("jsqr");

const SCRATCH = require("os").tmpdir();
const REPO = require("path").resolve(__dirname, "..");

const ASSETS = [
  { svg: "print/business-cards/card-front.svg", png: "print/business-cards/card-front.png", w: 1200, h: 750, qr: false, dpi: 300 },
  { svg: "print/business-cards/card-back.svg", png: "print/business-cards/card-back.png", w: 1200, h: 750, qr: true, dpi: 300 },
  { svg: "print/signs/instagram-qr-sign.svg", png: "print/signs/instagram-qr-sign.png", w: 2550, h: 3300, qr: true, dpi: 300 },
  { svg: "print/signs/instagram-qr-poster.svg", png: "print/signs/instagram-qr-poster.png", w: 5475, h: 7275, qr: true, dpi: 150 },
  { svg: "print/signs/retractable-banner-32x80.svg", png: "print/signs/retractable-banner-32x80.png", w: 4872, h: 12072, qr: true, dpi: 150 },
  { svg: "print/signs/tablecloth-8x10.svg", png: "print/signs/tablecloth-8x10.png", w: 10500, h: 6000, qr: false, dpi: 100 },
  { svg: "art/qr-instagram.svg", png: "art/qr-instagram.png", w: 1000, h: 1000, qr: true, dpi: 300 },
];

/* Playwright screenshots carry no physical-resolution metadata, so print vendors
   read them as 72 dpi. Stamp a pHYs chunk declaring the real dpi. */
function stampDpi(file, dpi) {
  const buf = fs.readFileSync(file);
  const ppm = Math.round(dpi / 0.0254);
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data[8] = 1; /* unit: meter */
  const type = Buffer.from("pHYs");
  const chunk = Buffer.alloc(21);
  chunk.writeUInt32BE(9, 0);
  type.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(require("zlib").crc32(Buffer.concat([type, data])) >>> 0, 17);

  const parts = [buf.slice(0, 8)];
  let pos = 8, inserted = false;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const t = buf.toString("ascii", pos + 4, pos + 8);
    const end = pos + 12 + len;
    if (t === "pHYs") { pos = end; continue; } /* drop any existing */
    if (!inserted && (t === "IDAT" || t === "IEND")) { parts.push(chunk); inserted = true; }
    parts.push(buf.slice(pos, end));
    pos = end;
  }
  fs.writeFileSync(file, Buffer.concat(parts));
}

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
    stampDpi(REPO + "/" + a.png, a.dpi);

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
