/* Builds the card-trio holographic sticker SVGs.
   Each variant has a PRINT version (transparent = bare rainbow foil, no white ink)
   and a SCREEN version (holo simulated with pastel gradients, for digital use). */
const fs = require("fs");

const REPO = require("path").resolve(__dirname, "..");
const OUT = REPO + "/print/stickers";

const NAVY = "#232838", CREAM = "#FAF6ED", GOLD = "#E2B437", RED = "#D8433F";
const C_ARC = "M 5.46 -13.01 A 8.5 8.5 0 1 0 5.46 0.01";
const STAR =
  "M 0,-2.6 L 0.65,-0.89 L 2.47,-0.8 L 1.05,0.34 L 1.53,2.1 L 0,1.1 L -1.53,2.1 L -1.05,0.34 L -2.47,-0.8 L -0.65,-0.89 Z";

const sparklePath = (s) =>
  `M 0,${-s} Q ${s * 0.2},${-s * 0.2} ${s},0 Q ${s * 0.2},${s * 0.2} 0,${s} Q ${-s * 0.2},${s * 0.2} ${-s},0 Q ${-s * 0.2},${-s * 0.2} 0,${-s} Z`;
const sparkle = (x, y, s, fill) =>
  `<path d="${sparklePath(s)}" transform="translate(${x},${y})" fill="${fill}"/>`;

const HOLO_STOPS = `
      <stop offset="0" stop-color="#FFB3C1"/><stop offset="0.18" stop-color="#FFD9A0"/>
      <stop offset="0.36" stop-color="#FAF3A0"/><stop offset="0.55" stop-color="#B9F0B0"/>
      <stop offset="0.72" stop-color="#A9E4FF"/><stop offset="0.88" stop-color="#C3B3FF"/>
      <stop offset="1" stop-color="#FFB3E8"/>`;

/* defs: shared gradients + clip; masks only in print mode, holo gradients only in screen mode */
function defs(print, extra = "") {
  return `<defs>
    <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F3D06A"/><stop offset="1" stop-color="#E0B137"/>
    </linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FBF3DF"/><stop offset="0.55" stop-color="#F1C878"/>
      <stop offset="1" stop-color="#E8926B"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#333B58"/><stop offset="1" stop-color="${NAVY}"/>
    </linearGradient>
    <clipPath id="rc"><rect x="-19" y="-26.5" width="38" height="53" rx="3.5"/></clipPath>
    ${
      print
        ? `<!-- reverse holo: keep only the border ring; card body is bare foil -->
    <mask id="ringL" maskUnits="userSpaceOnUse" x="-25" y="-32" width="50" height="64">
      <rect x="-25" y="-32" width="50" height="64" fill="#fff"/>
      <rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="#000"/>
    </mask>
    <!-- classic holo: knock the art window out of border + body -->
    <mask id="winC" maskUnits="userSpaceOnUse" x="-25" y="-32" width="50" height="64">
      <rect x="-25" y="-32" width="50" height="64" fill="#fff"/>
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="#000"/>
    </mask>
    <!-- illustration rare: two foil glint streaks across the art -->
    <mask id="glintR" maskUnits="userSpaceOnUse" x="-25" y="-32" width="50" height="64">
      <rect x="-25" y="-32" width="50" height="64" fill="#fff"/>
      <g transform="rotate(-36)">
        <rect x="-32" y="-3" width="64" height="1.6" fill="#000"/>
        <rect x="-32" y="5.5" width="64" height="1" fill="#000"/>
      </g>
    </mask>`
        : `<linearGradient id="holoA" x1="0" y1="0" x2="1" y2="1">${HOLO_STOPS}</linearGradient>
    <linearGradient id="holoB" x1="1" y1="0" x2="0" y2="1">${HOLO_STOPS}</linearGradient>`
    }
    ${extra}
  </defs>`;
}

/* the trio: reverse holo (left) · illustration rare (right) · classic holo (center, on top).
   Lives in x 10..130, y 14.5..86.5. */
function trio(print) {
  const leftBody = print
    ? `<rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="url(#gb)" stroke="#C99E2E" stroke-width="0.8" mask="url(#ringL)"/>`
    : `<rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="url(#gb)" stroke="#C99E2E" stroke-width="0.8"/>
      <rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="url(#holoA)"/>`;
  const centerBody = print
    ? `<g mask="url(#winC)">
        <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="url(#gb)" stroke="#C99E2E" stroke-width="0.8"/>
        <rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="${CREAM}"/>
      </g>
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="none" stroke="${NAVY}" stroke-width="0.7"/>`
    : `<rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="url(#gb)" stroke="#C99E2E" stroke-width="0.8"/>
      <rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="${CREAM}"/>
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="url(#holoB)" stroke="${NAVY}" stroke-width="0.7"/>`;
  return `
    <!-- LEFT: reverse holo — foil body, printed navy window, gold C -->
    <g transform="translate(36,54) rotate(-12)">
      ${leftBody}
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="${NAVY}" stroke="#C99E2E" stroke-width="0.7"/>
      <path d="${C_ARC}" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>
      <rect x="-11" y="9.5" width="22" height="2" rx="1" fill="${NAVY}"/>
      <rect x="-11" y="13.5" width="15" height="2" rx="1" fill="${NAVY}"/>
      <rect x="11.6" y="19.6" width="2.8" height="2.8" fill="${NAVY}" transform="rotate(45 13 21)"/>
    </g>
    <!-- RIGHT: illustration rare — full-art sunset, red C as the sun, foil glint streaks -->
    <g transform="translate(104,54) rotate(12)">
      <g clip-path="url(#rc)"${print ? ' mask="url(#glintR)"' : ""}>
        <rect x="-19" y="-26.5" width="38" height="34.5" fill="url(#sky)"/>
        <circle cx="0" cy="-6.5" r="11" fill="${GOLD}" opacity="0.4"/>
        <path d="${C_ARC}" fill="none" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>
        <rect x="-19" y="8" width="38" height="18.5" fill="url(#sea)"/>
        <rect x="-5.5" y="11" width="11" height="1.2" rx="0.6" fill="${RED}" opacity="0.5"/>
        <rect x="-3.5" y="14" width="7" height="1.2" rx="0.6" fill="${RED}" opacity="0.38"/>
        <rect x="-2" y="17" width="4" height="1.2" rx="0.6" fill="${RED}" opacity="0.28"/>
        ${
          print
            ? ""
            : `<g transform="rotate(-36)">
          <rect x="-32" y="-3" width="64" height="1.6" fill="#FFFFFF" opacity="0.38"/>
          <rect x="-32" y="5.5" width="64" height="1" fill="#FFFFFF" opacity="0.25"/>
        </g>`
        }
      </g>
      <g transform="translate(13,21)"><path d="${STAR}" fill="${GOLD}"/></g>
      <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="none" stroke="${NAVY}" stroke-width="0.9"/>
    </g>
    <!-- CENTER (on top): classic holo — cream body, foil art window, white C -->
    <g transform="translate(70,44)">
      ${centerBody}
      <path d="${C_ARC}" fill="none" stroke="${NAVY}" stroke-width="6.8" stroke-linecap="round"/>
      <path d="${C_ARC}" fill="none" stroke="#FFFDF7" stroke-width="5" stroke-linecap="round"/>
      <rect x="-11" y="9.5" width="22" height="2" rx="1" fill="#DCD3BE"/>
      <rect x="-11" y="13.5" width="15" height="2" rx="1" fill="#DCD3BE"/>
      <g transform="translate(13,21)"><path d="${STAR}" fill="${NAVY}"/></g>
    </g>`;
}

const wordmark = (x, y, size) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="${size}"><tspan fill="${GOLD}">Cali</tspan><tspan fill="${CREAM}"> Coast</tspan><tspan fill="${RED}"> Cards</tspan></text>`;

const note = (print) =>
  print
    ? `<!-- PRINT version. Transparent areas = bare rainbow foil (no white ink);
       everything else gets a full white-ink underlay. -->`
    : `<!-- SCREEN version. Holo foil simulated with pastel gradients — for digital use only. -->`;

/* ---- V1: bare trio, die-cut. 3.6 x 2.16 in ---- */
function trioSticker(print) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="3.6in" height="2.16in" viewBox="10 14.5 120 72">
  <!-- Cali Coast Cards — "card trio" holographic sticker. -->
  ${note(print)}
  ${defs(print)}
  ${trio(print)}
</svg>`;
}

/* ---- V2: trio + wordmark banner, die-cut. 3.2 x 2.25 in.
   The pill overlaps the side cards' bottom corners so the die-cut stays one piece. ---- */
function bannerSticker(print) {
  const sparkles = [
    [27.5, 86, 2.2],
    [112.5, 86, 2.2],
  ];
  const bnrMask = print
    ? `<mask id="bnr" maskUnits="userSpaceOnUse" x="6" y="8" width="128" height="90">
      <rect x="6" y="8" width="128" height="90" fill="#fff"/>
      ${sparkles.map(([x, y, s]) => sparkle(x, y, s, "#000")).join("\n      ")}
    </mask>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="3.2in" height="2.25in" viewBox="6 8 128 90">
  <!-- Cali Coast Cards — card trio + wordmark banner sticker. -->
  ${note(print)}
  ${defs(print, bnrMask)}
  <g transform="translate(0,-2)">${trio(print)}
  </g>
  <rect x="20" y="78" width="100" height="16" rx="8" fill="${NAVY}" stroke="#C99E2E" stroke-width="0.6"${print ? ' mask="url(#bnr)"' : ""}/>
  ${print ? "" : sparkles.map(([x, y, s]) => sparkle(x, y, s, "url(#holoA)")).join("\n  ")}
  ${wordmark(70, 88.8, 8)}
</svg>`;
}

/* ---- V3: navy badge tile, simple rounded-square cut. 3 x 3 in ---- */
function badgeSticker(print) {
  const sparkles = [
    [16, 13.5, 3],
    [104, 19, 2],
    [8.5, 55, 1.8],
    [111, 60, 1.8],
    [106, 104, 2.2],
  ];
  const bdgMask = print
    ? `<mask id="bdg" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
      <rect x="0" y="0" width="120" height="120" fill="#fff"/>
      ${sparkles.map(([x, y, s]) => sparkle(x, y, s, "#000")).join("\n      ")}
    </mask>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="3in" height="3in" viewBox="0 0 120 120">
  <!-- Cali Coast Cards — card trio badge sticker (navy tile + wordmark). -->
  ${note(print)}
  ${defs(print, bdgMask)}
  <rect x="0" y="0" width="120" height="120" rx="27" fill="${NAVY}"${print ? ' mask="url(#bdg)"' : ""}/>
  ${print ? "" : sparkles.map(([x, y, s]) => sparkle(x, y, s, "url(#holoA)")).join("\n  ")}
  <g transform="translate(60,48) scale(0.72) translate(-70,-50.5)">${trio(print)}
  </g>
  ${wordmark(60, 97, 10)}
</svg>`;
}

const files = {
  "sticker-card-trio.svg": trioSticker(true),
  "sticker-card-trio-screen.svg": trioSticker(false),
  "sticker-trio-banner.svg": bannerSticker(true),
  "sticker-trio-banner-screen.svg": bannerSticker(false),
  "sticker-trio-badge.svg": badgeSticker(true),
  "sticker-trio-badge-screen.svg": badgeSticker(false),
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(OUT + "/" + name, svg);
console.log("wrote:", Object.keys(files).join(", "));
