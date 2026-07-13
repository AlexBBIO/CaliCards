/* Builds business card + sign + standalone QR SVGs with a real QR code. */
const fs = require("fs");
const QRCode = require("qrcode");

const REPO = require("path").resolve(__dirname, "..");
const URL = "https://www.instagram.com/realcalicoastcards";

const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
const N = qr.modules.size;
const bits = qr.modules.data;
let qrPath = "";
for (let y = 0; y < N; y++)
  for (let x = 0; x < N; x++)
    if (bits[y * N + x]) qrPath += `M${x} ${y}h1v1h-1z`;
console.log("QR modules:", N + "x" + N);

/* shared snippets */
const NAVY = "#232838", CREAM = "#FAF6ED", GOLD = "#E2B437", RED = "#D8433F";

const cccIcon = (s) => `
  <g transform="translate(${-s / 2},${-s / 2}) scale(${s / 100})">
    <rect width="100" height="100" rx="23" fill="${NAVY}"/>
    <path d="M 36.64 38.51 A 15 15 0 1 0 36.64 61.49" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>
    <path d="M 59.64 38.51 A 15 15 0 1 0 59.64 61.49" fill="none" stroke="#FFFDF7" stroke-width="9" stroke-linecap="round"/>
    <path d="M 82.64 38.51 A 15 15 0 1 0 82.64 61.49" fill="none" stroke="${RED}" stroke-width="9" stroke-linecap="round"/>
  </g>`;

/* QR block: panel + modules + center CCC logo. size = QR drawing size */
function qrBlock(cx, cy, size, panel, panelFill, logoSize) {
  const s = size / N;
  return `
  <rect x="${cx - panel / 2}" y="${cy - panel / 2}" width="${panel}" height="${panel}" rx="${panel * 0.09}" fill="${panelFill}"/>
  <g transform="translate(${cx - size / 2},${cy - size / 2}) scale(${s})">
    <path d="${qrPath}" fill="${NAVY}"/>
  </g>
  <rect x="${cx - logoSize * 0.6}" y="${cy - logoSize * 0.6}" width="${logoSize * 1.2}" height="${logoSize * 1.2}" rx="${logoSize * 0.24}" fill="${panelFill}"/>
  <g transform="translate(${cx},${cy})">${cccIcon(logoSize)}</g>`;
}

const sparkle = (x, y, s, fill, o) =>
  `<path d="M 0,${-s} Q ${s * 0.2},${-s * 0.2} ${s},0 Q ${s * 0.2},${s * 0.2} 0,${s} Q ${-s * 0.2},${s * 0.2} ${-s},0 Q ${-s * 0.2},${-s * 0.2} 0,${-s} Z" transform="translate(${x},${y})" fill="${fill}" opacity="${o}"/>`;

/* the card-trio fan (screen version, holo simulated) */
const fan = (tx, ty, k) => `
  <g transform="translate(${tx},${ty}) scale(${k}) translate(-70,-52.7)">
    <g transform="translate(36,54) rotate(-12)">
      <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="url(#gb)" stroke="#C99E2E" stroke-width="0.8"/>
      <rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="url(#holoA)"/>
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="${NAVY}" stroke="#C99E2E" stroke-width="0.7"/>
      <path d="M 5.46 -13.01 A 8.5 8.5 0 1 0 5.46 0.01" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>
      <rect x="-11" y="9.5" width="22" height="2" rx="1" fill="${NAVY}"/>
      <rect x="-11" y="13.5" width="15" height="2" rx="1" fill="${NAVY}"/>
      <rect x="11.6" y="19.6" width="2.8" height="2.8" fill="${NAVY}" transform="rotate(45 13 21)"/>
    </g>
    <g transform="translate(104,54) rotate(12)">
      <g clip-path="url(#rc)">
        <rect x="-19" y="-26.5" width="38" height="34.5" fill="url(#sky)"/>
        <circle cx="0" cy="-6.5" r="11" fill="${GOLD}" opacity="0.4"/>
        <path d="M 5.46 -13.01 A 8.5 8.5 0 1 0 5.46 0.01" fill="none" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>
        <rect x="-19" y="8" width="38" height="18.5" fill="url(#sea)"/>
        <rect x="-5.5" y="11" width="11" height="1.2" rx="0.6" fill="${RED}" opacity="0.5"/>
        <rect x="-3.5" y="14" width="7" height="1.2" rx="0.6" fill="${RED}" opacity="0.38"/>
        <g transform="rotate(-36)">
          <rect x="-32" y="-3" width="64" height="1.6" fill="#FFFFFF" opacity="0.38"/>
          <rect x="-32" y="5.5" width="64" height="1" fill="#FFFFFF" opacity="0.25"/>
        </g>
        <g transform="translate(13,21)"><path d="M 0,-2.6 L 0.65,-0.89 L 2.47,-0.8 L 1.05,0.34 L 1.53,2.1 L 0,1.1 L -1.53,2.1 L -1.05,0.34 L -2.47,-0.8 L -0.65,-0.89 Z" fill="${GOLD}"/></g>
      </g>
      <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="none" stroke="${NAVY}" stroke-width="0.9"/>
    </g>
    <g transform="translate(70,44)">
      <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="url(#gb)" stroke="#C99E2E" stroke-width="0.8"/>
      <rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="${CREAM}"/>
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="url(#holoB)" stroke="${NAVY}" stroke-width="0.7"/>
      <path d="M 5.46 -13.01 A 8.5 8.5 0 1 0 5.46 0.01" fill="none" stroke="${NAVY}" stroke-width="6.8" stroke-linecap="round"/>
      <path d="M 5.46 -13.01 A 8.5 8.5 0 1 0 5.46 0.01" fill="none" stroke="#FFFDF7" stroke-width="5" stroke-linecap="round"/>
      <rect x="-11" y="9.5" width="22" height="2" rx="1" fill="#DCD3BE"/>
      <rect x="-11" y="13.5" width="15" height="2" rx="1" fill="#DCD3BE"/>
      <g transform="translate(13,21)"><path d="M 0,-2.6 L 0.65,-0.89 L 2.47,-0.8 L 1.05,0.34 L 1.53,2.1 L 0,1.1 L -1.53,2.1 L -1.05,0.34 L -2.47,-0.8 L -0.65,-0.89 Z" fill="${NAVY}"/></g>
    </g>
  </g>`;

const defs = `
  <defs>
    <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F3D06A"/><stop offset="1" stop-color="#E0B137"/>
    </linearGradient>
    <linearGradient id="holoA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFB3C1"/><stop offset="0.18" stop-color="#FFD9A0"/>
      <stop offset="0.36" stop-color="#FAF3A0"/><stop offset="0.55" stop-color="#B9F0B0"/>
      <stop offset="0.72" stop-color="#A9E4FF"/><stop offset="0.88" stop-color="#C3B3FF"/>
      <stop offset="1" stop-color="#FFB3E8"/>
    </linearGradient>
    <linearGradient id="holoB" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFB3C1"/><stop offset="0.18" stop-color="#FFD9A0"/>
      <stop offset="0.36" stop-color="#FAF3A0"/><stop offset="0.55" stop-color="#B9F0B0"/>
      <stop offset="0.72" stop-color="#A9E4FF"/><stop offset="0.88" stop-color="#C3B3FF"/>
      <stop offset="1" stop-color="#FFB3E8"/>
    </linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FBF3DF"/><stop offset="0.55" stop-color="#F1C878"/>
      <stop offset="1" stop-color="#E8926B"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#333B58"/><stop offset="1" stop-color="${NAVY}"/>
    </linearGradient>
    <clipPath id="rc"><rect x="-19" y="-26.5" width="38" height="53" rx="3.5"/></clipPath>
  </defs>`;

/* ---- FRONT: 3.625 x 2.125 in (trim 3.5 x 2 + 1/16" bleed per side), 100 units/in ---- */
const front = `<svg xmlns="http://www.w3.org/2000/svg" width="3.625in" height="2.125in" viewBox="0 0 362.5 212.5">
  <!-- Cali Coast Cards business card FRONT. Trim 3.5x2in; 0.0625in bleed each side. -->
  ${defs}
  <rect width="362.5" height="212.5" fill="${CREAM}"/>
  ${sparkle(318, 44, 4, GOLD, 0.85)}
  ${sparkle(340, 168, 2.6, RED, 0.55)}
  ${fan(92, 106, 1.02)}
  <text x="166" y="92" font-family="Fraunces" font-weight="600" font-size="20" fill="${NAVY}">Cali Coast Cards</text>
  <rect x="166" y="102" width="42" height="2.5" rx="1.25" fill="${GOLD}"/>
  <text x="166" y="124" font-family="Inter" font-weight="500" font-size="11.5" fill="${NAVY}" opacity="0.78">Pokémon cards — bought &amp; sold.</text>
  <text x="166" y="142" font-family="Inter" font-weight="600" font-size="10.5" fill="${RED}">@realcalicoastcards</text>
</svg>`;

/* ---- BACK ---- */
const back = `<svg xmlns="http://www.w3.org/2000/svg" width="3.625in" height="2.125in" viewBox="0 0 362.5 212.5">
  <!-- Cali Coast Cards business card BACK. QR -> ${URL} -->
  <rect width="362.5" height="212.5" fill="${NAVY}"/>
  ${sparkle(38, 36, 3.2, GOLD, 0.9)}
  ${sparkle(182, 26, 2, "#FAF6ED", 0.7)}
  ${sparkle(152, 186, 2.4, GOLD, 0.6)}
  <text x="30" y="60" font-family="Inter" font-weight="700" font-size="7.5" letter-spacing="1.8" fill="${GOLD}">SINGLES · SLABS · SEALED</text>
  <text x="30" y="88" font-family="Fraunces" font-weight="600" font-size="19" fill="${CREAM}">Scan to follow</text>
  <text x="30" y="111" font-family="Fraunces" font-weight="600" font-size="19" fill="${CREAM}">the shop.</text>
  <text x="30" y="138" font-family="Inter" font-weight="600" font-size="12.5" fill="${GOLD}">@realcalicoastcards</text>
  <text x="30" y="162" font-family="Inter" font-weight="500" font-size="10" fill="${CREAM}" opacity="0.6">calicoastcards.com</text>
  ${qrBlock(270, 106.25, 106, 130, CREAM, 20)}
</svg>`;

/* ---- SIGN: 8.5 x 11 in, no bleed (home/office printable) ---- */
const sign = `<svg xmlns="http://www.w3.org/2000/svg" width="8.5in" height="11in" viewBox="0 0 850 1100">
  <!-- Booth/table sign. QR -> ${URL} -->
  ${defs}
  <rect width="850" height="1100" fill="${CREAM}"/>
  ${sparkle(150, 300, 9, GOLD, 0.9)}
  ${sparkle(706, 276, 6, RED, 0.55)}
  ${sparkle(120, 892, 7, GOLD, 0.7)}
  ${sparkle(736, 880, 5, GOLD, 0.8)}
  ${fan(425, 180, 2.0)}
  <text x="425" y="336" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="56" fill="${NAVY}">Follow the shop</text>
  <text x="425" y="374" text-anchor="middle" font-family="Inter" font-weight="500" font-size="19" fill="${NAVY}" opacity="0.72">Fresh grails, new inventory &amp; show dates — first on Instagram.</text>
  <rect x="245" y="425" width="360" height="360" rx="24" fill="#FFFFFF" stroke="${GOLD}" stroke-width="5"/>
  ${qrBlock(425, 605, 300, 344, "#FFFFFF", 52)}
  <text x="425" y="852" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="34" fill="${NAVY}">@realcalicoastcards</text>
  <text x="425" y="888" text-anchor="middle" font-family="Inter" font-weight="500" font-size="18" fill="${NAVY}" opacity="0.62">calicoastcards.com</text>
  <rect x="0" y="1010" width="850" height="90" fill="${NAVY}"/>
  <text x="425" y="1064" text-anchor="middle" font-family="Inter" font-weight="600" font-size="15" letter-spacing="3.5" fill="${CREAM}">CALI COAST CARDS · BUYING &amp; SELLING POKÉMON · CALIFORNIA</text>
</svg>`;

/* ---- standalone QR (put it anywhere) ---- */
const pad = 4; /* quiet zone in modules */
const standalone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N + pad * 2} ${N + pad * 2}">
  <!-- QR -> ${URL} (error correction H) -->
  <rect width="${N + pad * 2}" height="${N + pad * 2}" fill="#FFFFFF"/>
  <g transform="translate(${pad},${pad})"><path d="${qrPath}" fill="${NAVY}"/></g>
  <rect x="${(N + pad * 2) / 2 - 5.4}" y="${(N + pad * 2) / 2 - 5.4}" width="10.8" height="10.8" rx="2.2" fill="#FFFFFF"/>
  <g transform="translate(${(N + pad * 2) / 2},${(N + pad * 2) / 2})">${cccIcon(9)}</g>
</svg>`;

fs.mkdirSync(REPO + "/print/business-cards", { recursive: true });
fs.mkdirSync(REPO + "/print/signs", { recursive: true });
fs.writeFileSync(REPO + "/print/business-cards/card-front.svg", front);
fs.writeFileSync(REPO + "/print/business-cards/card-back.svg", back);
fs.writeFileSync(REPO + "/print/signs/instagram-qr-sign.svg", sign);
fs.writeFileSync(REPO + "/art/qr-instagram.svg", standalone);
console.log("SVGs written");
