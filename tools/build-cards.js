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

/* ---- FRONT: 4.0 x 2.5 in (trim 3.5 x 2 + 1/4" bleed per side), 100 units/in ---- */
const front = `<svg xmlns="http://www.w3.org/2000/svg" width="4in" height="2.5in" viewBox="-18.75 -18.75 400 250">
  <!-- Cali Coast Cards business card FRONT. Trim 3.5x2in; 0.25in bleed each side. -->
  ${defs}
  <rect x="-18.75" y="-18.75" width="400" height="250" fill="${CREAM}"/>
  ${sparkle(318, 44, 4, GOLD, 0.85)}
  ${sparkle(340, 168, 2.6, RED, 0.55)}
  ${fan(92, 106, 1.02)}
  <text x="166" y="92" font-family="Fraunces" font-weight="600" font-size="20" fill="${NAVY}">Cali Coast Cards</text>
  <rect x="166" y="102" width="42" height="2.5" rx="1.25" fill="${GOLD}"/>
  <text x="166" y="124" font-family="Inter" font-weight="500" font-size="10" fill="${NAVY}" opacity="0.78">Pokémon cards — bought &amp; sold.</text>
  <text x="166" y="142" font-family="Inter" font-weight="600" font-size="10.5" fill="${RED}">@realcalicoastcards</text>
</svg>`;

/* ---- BACK ---- */
const back = `<svg xmlns="http://www.w3.org/2000/svg" width="4in" height="2.5in" viewBox="-18.75 -18.75 400 250">
  <!-- Cali Coast Cards business card BACK. QR -> ${URL} -->
  <rect x="-18.75" y="-18.75" width="400" height="250" fill="${NAVY}"/>
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

/* ---- POSTER: 36 x 48 in (3:4 — also prints at 18x24), navy high-contrast buying poster.
   25 units/in; 0.25in bleed each side. Trim 0..900 x 0..1200.
   Display accents use bright Pokemon yellow; the trio mark keeps its own brand gold. ---- */
const YEL = "#FFCB05", WHITE = "#FFFFFF";
const pokeball = (x, y, r, o) => `
  <g transform="translate(${x},${y})" stroke="#4A5375" stroke-width="${(r * 0.09).toFixed(1)}" fill="none" opacity="${o}">
    <circle r="${r}"/>
    <path d="M ${-r} 0 H ${-r * 0.34} M ${r * 0.34} 0 H ${r}"/>
    <circle r="${r * 0.34}"/>
    <circle r="${r * 0.15}"/>
  </g>`;

const poster = `<svg xmlns="http://www.w3.org/2000/svg" width="36.5in" height="48.5in" viewBox="-6.25 -6.25 912.5 1212.5">
  <!-- Booth buying poster, high contrast. QR -> ${URL} -->
  ${defs}
  <radialGradient id="pbg" cx="0.5" cy="0.22" r="1.1">
    <stop offset="0" stop-color="#2B3149"/><stop offset="0.55" stop-color="${NAVY}"/>
    <stop offset="1" stop-color="#1B1F2E"/>
  </radialGradient>
  <rect x="-6.25" y="-6.25" width="912.5" height="1212.5" fill="url(#pbg)"/>
  <rect x="18" y="18" width="864" height="1164" rx="28" fill="none" stroke="${YEL}" stroke-width="6"/>

  <!-- brand block: trio logo + wordmark -->
  ${sparkle(60, 60, 8, YEL, 0.95)}
  ${sparkle(844, 72, 6, WHITE, 0.8)}
  ${fan(211, 105, 1.6)}
  <text x="563" y="124" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="56"><tspan fill="${YEL}">Cali</tspan><tspan fill="#FFFDF7"> Coast</tspan><tspan fill="${RED}"> Cards</tspan></text>
  <rect x="45" y="186" width="810" height="3" rx="1.5" fill="${YEL}" opacity="0.55"/>

  <!-- headline block, Poke Ball line art behind -->
  ${pokeball(105, 285, 80, 0.55)}
  ${pokeball(795, 285, 84, 0.55)}
  <text x="450" y="258" text-anchor="middle" font-family="Inter" font-weight="700" font-size="66" letter-spacing="12" fill="${WHITE}">I BUY</text>
  <text x="450" y="414" text-anchor="middle" font-family="Inter" font-weight="700" font-size="140" letter-spacing="2" fill="${YEL}">POKÉMON</text>

  <!-- what band -->
  <rect x="45" y="450" width="810" height="112" rx="18" fill="#FFFDF7"/>
  <text x="450" y="503" text-anchor="middle" font-family="Inter" font-weight="700" font-size="42" letter-spacing="2" fill="${NAVY}">SLABS  /  SEALED  /  RAW</text>
  <text x="450" y="543" text-anchor="middle" font-family="Inter" font-weight="700" font-size="25" letter-spacing="2" fill="${RED}">MODERN  /  MID-ERA  /  VINTAGE</text>

  <!-- paying panel -->
  <rect x="45" y="590" width="810" height="296" rx="24" fill="${RED}"/>
  <text x="450" y="650" text-anchor="middle" font-family="Inter" font-weight="700" font-size="44" letter-spacing="7" fill="${WHITE}">PAYING UP TO</text>
  <text x="450" y="780" text-anchor="middle" font-family="Inter" font-weight="700" font-size="138" fill="${YEL}">100%</text>
  <rect x="130" y="800" width="640" height="58" rx="18" fill="#C9F2D0"/>
  <text x="450" y="840" text-anchor="middle" font-family="Inter" font-weight="700" font-size="34" letter-spacing="2" fill="${NAVY}">FOR HIGH-END VINTAGE!</text>

  <!-- footer: follow text (centered on the QR axis) + big QR -->
  ${sparkle(80, 1150, 6, YEL, 0.75)}
  ${sparkle(575, 935, 5, WHITE, 0.6)}
  <text x="335" y="958" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" letter-spacing="4" fill="${WHITE}">SCAN TO</text>
  <text x="335" y="1014" text-anchor="middle" font-family="Inter" font-weight="700" font-size="52" letter-spacing="2" fill="${YEL}">FOLLOW</text>
  <text x="335" y="1060" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" letter-spacing="4" fill="${WHITE}">DM TO SELL</text>
  <text x="335" y="1094" text-anchor="middle" font-family="Inter" font-weight="500" font-size="19" fill="${WHITE}" opacity="0.75">@realcalicoastcards</text>
  <text x="335" y="1124" text-anchor="middle" font-family="Inter" font-weight="500" font-size="17" letter-spacing="1" fill="${WHITE}" opacity="0.55">calicoastcards.com</text>
  <rect x="630" y="918" width="228" height="228" rx="18" fill="#FFFFFF" stroke="${YEL}" stroke-width="5"/>
  ${qrBlock(744, 1032, 192, 216, "#FFFFFF", 34)}
</svg>`;

/* ---- RETRACTABLE BANNER: 32 x 80 in, same flow as the poster stacked for 2:5.
   25 units/in; 0.24in bleed each side. Trim 0..800 x 0..2000.
   Top = eye level (brand + pitch), middle = big QR at scan height,
   bottom ~16in = decorative only (floor zone, often blocked by tables/base). ---- */
const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="32.48in" height="80.48in" viewBox="-6 -6 812 2012">
  <!-- Retractable banner. QR -> ${URL} -->
  ${defs}
  <radialGradient id="bbg" cx="0.5" cy="0.14" r="1.4">
    <stop offset="0" stop-color="#2B3149"/><stop offset="0.5" stop-color="${NAVY}"/>
    <stop offset="1" stop-color="#1B1F2E"/>
  </radialGradient>
  <rect x="-6" y="-6" width="812" height="2012" fill="url(#bbg)"/>
  <rect x="18" y="18" width="764" height="1964" rx="28" fill="none" stroke="${YEL}" stroke-width="6"/>

  <!-- brand row -->
  ${sparkle(58, 58, 8, YEL, 0.95)}
  ${sparkle(744, 70, 6, WHITE, 0.8)}
  ${fan(179, 110, 1.5)}
  <text x="505" y="129" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="52"><tspan fill="${YEL}">Cali</tspan><tspan fill="#FFFDF7"> Coast</tspan><tspan fill="${RED}"> Cards</tspan></text>
  <rect x="45" y="196" width="710" height="3" rx="1.5" fill="${YEL}" opacity="0.55"/>

  <!-- headline -->
  ${pokeball(95, 300, 62, 0.55)}
  ${pokeball(705, 300, 66, 0.55)}
  <text x="400" y="272" text-anchor="middle" font-family="Inter" font-weight="700" font-size="62" letter-spacing="12" fill="${WHITE}">I BUY</text>
  <text x="400" y="412" text-anchor="middle" font-family="Inter" font-weight="700" font-size="124" letter-spacing="2" fill="${YEL}">POKÉMON</text>

  <!-- what band -->
  <rect x="45" y="470" width="710" height="120" rx="18" fill="#FFFDF7"/>
  <text x="400" y="527" text-anchor="middle" font-family="Inter" font-weight="700" font-size="40" letter-spacing="2" fill="${NAVY}">SLABS  /  SEALED  /  RAW</text>
  <text x="400" y="568" text-anchor="middle" font-family="Inter" font-weight="700" font-size="24" letter-spacing="2" fill="${RED}">MODERN  /  MID-ERA  /  VINTAGE</text>

  <!-- paying panel -->
  <rect x="45" y="630" width="710" height="320" rx="24" fill="${RED}"/>
  <text x="400" y="698" text-anchor="middle" font-family="Inter" font-weight="700" font-size="42" letter-spacing="6" fill="${WHITE}">PAYING UP TO</text>
  <text x="400" y="832" text-anchor="middle" font-family="Inter" font-weight="700" font-size="132" fill="${YEL}">100%</text>
  <rect x="90" y="854" width="620" height="58" rx="18" fill="#C9F2D0"/>
  <text x="400" y="894" text-anchor="middle" font-family="Inter" font-weight="700" font-size="34" letter-spacing="2" fill="${NAVY}">FOR HIGH-END VINTAGE!</text>

  <!-- QR block at scan height -->
  ${sparkle(70, 1000, 6, YEL, 0.75)}
  ${sparkle(732, 1080, 5, WHITE, 0.6)}
  <text x="400" y="1022" text-anchor="middle" font-family="Inter" font-weight="700" font-size="40" letter-spacing="3" fill="${WHITE}">SCAN TO <tspan fill="${YEL}">FOLLOW</tspan></text>
  <rect x="236" y="1050" width="328" height="328" rx="24" fill="#FFFFFF" stroke="${YEL}" stroke-width="6"/>
  ${qrBlock(400, 1214, 272, 308, "#FFFFFF", 48)}
  <text x="400" y="1448" text-anchor="middle" font-family="Inter" font-weight="700" font-size="36" letter-spacing="4" fill="${WHITE}">DM TO <tspan fill="${YEL}">SELL</tspan></text>
  <text x="400" y="1492" text-anchor="middle" font-family="Inter" font-weight="500" font-size="24" fill="${WHITE}" opacity="0.8">@realcalicoastcards</text>
  <text x="400" y="1528" text-anchor="middle" font-family="Inter" font-weight="500" font-size="20" letter-spacing="1" fill="${WHITE}" opacity="0.55">calicoastcards.com</text>

  <!-- floor zone: decorative only -->
  ${pokeball(115, 1700, 55, 0.4)}
  ${pokeball(688, 1820, 60, 0.4)}
  ${sparkle(160, 1628, 7, YEL, 0.8)}
  ${sparkle(648, 1660, 5, WHITE, 0.6)}
  ${sparkle(120, 1920, 6, YEL, 0.7)}
  ${sparkle(672, 1940, 7, YEL, 0.8)}
  ${fan(400, 1790, 2.5)}
</svg>`;

/* ---- TABLE THROW: flat template ~1.75:1 (8ft table). Panel lines measured off the
   vendor diagram: verticals at 21.9% / 78%, horizontals at 31.8% / 66.8%.
   Bottom-center = front drop (the message); everything else decorative-only so
   fold orientation never matters. Scale to fill the whole template in the editor. ---- */
const tablecloth = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1750 1000">
  <!-- Table throw, front drop panel x 383..1365 y 668..1000 -->
  ${defs}
  <radialGradient id="tbg" cx="0.5" cy="0.82" r="1.25">
    <stop offset="0" stop-color="#2B3149"/><stop offset="0.5" stop-color="${NAVY}"/>
    <stop offset="1" stop-color="#1B1F2E"/>
  </radialGradient>
  <rect width="1750" height="1000" fill="url(#tbg)"/>

  <!-- back drop (top band): decorative -->
  ${pokeball(320, 160, 70, 0.45)}
  ${pokeball(875, 150, 92, 0.4)}
  ${pokeball(1440, 160, 70, 0.45)}
  ${sparkle(160, 90, 9, YEL, 0.85)}
  ${sparkle(610, 230, 7, WHITE, 0.6)}
  ${sparkle(1130, 95, 8, YEL, 0.8)}
  ${sparkle(1590, 245, 7, YEL, 0.7)}

  <!-- table top (middle band): decorative -->
  ${pokeball(875, 493, 110, 0.35)}
  ${sparkle(410, 405, 9, YEL, 0.75)}
  ${sparkle(1350, 575, 8, WHITE, 0.55)}
  ${sparkle(255, 600, 7, YEL, 0.7)}
  ${sparkle(1500, 385, 7, YEL, 0.7)}

  <!-- side drops: decorative -->
  ${pokeball(250, 790, 48, 0.5)}
  ${sparkle(150, 720, 8, YEL, 0.8)}
  ${sparkle(290, 935, 6, WHITE, 0.6)}
  ${pokeball(1500, 790, 48, 0.5)}
  ${sparkle(1600, 720, 8, YEL, 0.8)}
  ${sparkle(1460, 935, 6, WHITE, 0.6)}

  <!-- FRONT DROP: logo + wordmark + message + QR.
       Text and QR stay inside the central ~66in so an 8ft cloth tucked onto a
       6ft table wraps only decorative edges around the corners. QR rides high,
       near the table edge, for a flatter scan angle. -->
  ${fan(575, 860, 1.55)}
  <text x="575" y="955" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="25"><tspan fill="${YEL}">Cali</tspan><tspan fill="#FFFDF7"> Coast</tspan><tspan fill="${RED}"> Cards</tspan></text>
  ${sparkle(760, 722, 8, YEL, 0.9)}
  ${sparkle(1215, 728, 7, WHITE, 0.7)}
  ${sparkle(740, 965, 6, WHITE, 0.6)}
  ${sparkle(1268, 938, 8, YEL, 0.85)}
  ${qrBlock(955, 742, 58, 72, "#FFFFFF", 11)}
  <text x="955" y="836" text-anchor="middle" font-family="Inter" font-weight="700" font-size="58" letter-spacing="3" fill="${WHITE}">WE BUY <tspan fill="${YEL}">POKÉMON</tspan></text>
  <text x="955" y="933" text-anchor="middle" font-family="Inter" font-weight="700" font-size="86" letter-spacing="2" fill="${WHITE}">UP TO <tspan fill="${YEL}">100%</tspan></text>
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
fs.writeFileSync(REPO + "/print/signs/instagram-qr-poster.svg", poster);
fs.writeFileSync(REPO + "/print/signs/retractable-banner-32x80.svg", banner);
fs.writeFileSync(REPO + "/print/signs/tablecloth-8x10.svg", tablecloth);
fs.writeFileSync(REPO + "/art/qr-instagram.svg", standalone);
console.log("SVGs written");
