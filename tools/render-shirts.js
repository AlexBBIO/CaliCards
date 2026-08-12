/* Renders shirt art SVGs to 300dpi transparent PNGs. */
const { chromium } = require("playwright");
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO = path.resolve(__dirname, "..");

const ASSETS = [
  { svg: "chest-fullcolor.svg", w: 1200, h: 1020 },
  { svg: "chest-spotcolor.svg", w: 1200, h: 1020 },
  { svg: "back-fullcolor.svg", w: 3600, h: 3720 },
  { svg: "back-spotcolor.svg", w: 3600, h: 3720 },
];

(async () => {
  const exe = execSync("ls -d /opt/pw-browsers/chromium*/chrome-linux/chrome").toString().trim().split("\n")[0];
  const browser = await chromium.launch({ executablePath: exe });
  const wrap = path.join(os.tmpdir(), "wrap-shirts.html");

  for (const a of ASSETS) {
    const file = REPO + "/print/shirts/" + a.svg;
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
    await p.close();
    console.log(a.svg.replace(/\.svg$/, ".png"), a.w + "x" + a.h);
  }

  await browser.close();
})();
