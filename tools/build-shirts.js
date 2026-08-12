/* Builds shirt print art for Cali Coast Cards.
   Two variants of each placement:
   - "full"  : the regular trio with holo gradients (for DTG / DTF printing)
   - "spot"  : flattened to 4 spot colors + shirt-navy (for screen printing;
               navy elements = unprinted True Navy shirt fabric)
   All art on transparent background. */
const fs = require("fs");

const REPO = require("path").resolve(__dirname, "..");
const OUT = REPO + "/print/shirts";

const NAVY = "#232838", CREAM = "#FAF6ED", GOLD = "#E2B437", RED = "#D8433F";
const C_ARC = "M 5.46 -13.01 A 8.5 8.5 0 1 0 5.46 0.01";
const STAR =
  "M 0,-2.6 L 0.65,-0.89 L 2.47,-0.8 L 1.05,0.34 L 1.53,2.1 L 0,1.1 L -1.53,2.1 L -1.05,0.34 L -2.47,-0.8 L -0.65,-0.89 Z";

const defsFull = `<defs>
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

const defsSpot = `<defs>
    <clipPath id="rc"><rect x="-19" y="-26.5" width="38" height="53" rx="3.5"/></clipPath>
  </defs>`;

/* the trio fan. spot=true flattens every gradient to a solid from the
   4-color palette (gold / cream / red / white) + shirt navy. */
function fan(tx, ty, k, spot) {
  const goldBody = spot ? GOLD : "url(#gb)";
  return `
  <g transform="translate(${tx},${ty}) scale(${k}) translate(-70,-52.7)">
    <g transform="translate(36,54) rotate(-12)">
      <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="${goldBody}" stroke="#C99E2E" stroke-width="0.8"/>
      ${spot ? "" : `<rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="url(#holoA)"/>`}
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="${NAVY}" stroke="#C99E2E" stroke-width="0.7"/>
      <path d="${C_ARC}" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>
      <rect x="-11" y="9.5" width="22" height="2" rx="1" fill="${NAVY}"/>
      <rect x="-11" y="13.5" width="15" height="2" rx="1" fill="${NAVY}"/>
      <rect x="11.6" y="19.6" width="2.8" height="2.8" fill="${NAVY}" transform="rotate(45 13 21)"/>
    </g>
    <g transform="translate(104,54) rotate(12)">
      <g clip-path="url(#rc)">
        <rect x="-19" y="-26.5" width="38" height="34.5" fill="${spot ? CREAM : "url(#sky)"}"/>
        ${spot ? "" : `<circle cx="0" cy="-6.5" r="11" fill="${GOLD}" opacity="0.4"/>`}
        <path d="${C_ARC}" fill="none" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>
        <rect x="-19" y="8" width="38" height="18.5" fill="${spot ? NAVY : "url(#sea)"}"/>
        <rect x="-5.5" y="11" width="11" height="1.2" rx="0.6" fill="${RED}" opacity="${spot ? 1 : 0.5}"/>
        <rect x="-3.5" y="14" width="7" height="1.2" rx="0.6" fill="${RED}" opacity="${spot ? 1 : 0.38}"/>
        ${spot ? "" : `<g transform="rotate(-36)">
          <rect x="-32" y="-3" width="64" height="1.6" fill="#FFFFFF" opacity="0.38"/>
          <rect x="-32" y="5.5" width="64" height="1" fill="#FFFFFF" opacity="0.25"/>
        </g>`}
      </g>
      <g transform="translate(13,21)"><path d="${STAR}" fill="${GOLD}"/></g>
      <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="none" stroke="${spot ? "#C99E2E" : NAVY}" stroke-width="0.9"/>
    </g>
    <g transform="translate(70,44)">
      <rect x="-19" y="-26.5" width="38" height="53" rx="3.5" fill="${goldBody}" stroke="#C99E2E" stroke-width="0.8"/>
      <rect x="-16.6" y="-24.1" width="33.2" height="48.2" rx="2" fill="${CREAM}"/>
      <rect x="-13.5" y="-19" width="27" height="25" rx="1.5" fill="${spot ? "#FFFDF7" : "url(#holoB)"}" stroke="${NAVY}" stroke-width="0.7"/>
      ${
        spot
          ? `<path d="${C_ARC}" fill="none" stroke="${NAVY}" stroke-width="5.6" stroke-linecap="round"/>`
          : `<path d="${C_ARC}" fill="none" stroke="${NAVY}" stroke-width="6.8" stroke-linecap="round"/>
      <path d="${C_ARC}" fill="none" stroke="#FFFDF7" stroke-width="5" stroke-linecap="round"/>`
      }
      <rect x="-11" y="9.5" width="22" height="2" rx="1" fill="#DCD3BE"/>
      <rect x="-11" y="13.5" width="15" height="2" rx="1" fill="#DCD3BE"/>
      <g transform="translate(13,21)"><path d="${STAR}" fill="${NAVY}"/></g>
    </g>
  </g>`;
}

const sparkle = (x, y, s, fill, o) =>
  `<path d="M 0,${-s} Q ${s * 0.2},${-s * 0.2} ${s},0 Q ${s * 0.2},${s * 0.2} 0,${s} Q ${-s * 0.2},${s * 0.2} -${s},0 Q ${-s * 0.2},${-s * 0.2} 0,${-s} Z" transform="translate(${x},${y})" fill="${fill}" opacity="${o}"/>`;

const wordmark = (x, y, size) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="${size}"><tspan fill="${GOLD}">Cali</tspan><tspan fill="${CREAM}"> Coast</tspan><tspan fill="${RED}"> Cards</tspan></text>`;

const note = (spot) =>
  spot
    ? `<!-- SPOT-COLOR version for screen printing. 4 inks on True Navy:
       gold ${GOLD}, cream ${CREAM}, red ${RED}, white #FFFDF7.
       Navy ${NAVY} elements may be knocked out to the shirt color. -->`
    : `<!-- FULL-COLOR version for DTG / DTF printing. Transparent background. -->`;

/* ---- left chest: 4in wide ---- */
function chest(spot) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="4in" height="3.4in" viewBox="0 0 100 85">
  ${note(spot)}
  ${spot ? defsSpot : defsFull}
  ${fan(50, 32, 0.72, spot)}
  ${sparkle(15, 12, 3, GOLD, 0.9)}
  ${sparkle(86, 50, 2.2, CREAM, 0.7)}
  ${wordmark(50, 78, 11)}
</svg>`;
}

/* ---- back print: 12in wide ---- */
function back(spot) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="12in" height="12.4in" viewBox="0 0 300 310">
  ${note(spot)}
  ${spot ? defsSpot : defsFull}
  <text x="150" y="22" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="12" letter-spacing="4" fill="${GOLD}">SINGLES · SLABS · SEALED</text>
  ${sparkle(52, 60, 6, GOLD, 0.9)}
  ${sparkle(250, 52, 4.5, CREAM, 0.7)}
  ${sparkle(60, 168, 4, CREAM, 0.6)}
  ${sparkle(244, 160, 5.5, GOLD, 0.85)}
  ${fan(150, 118, 1.85, spot)}
  ${wordmark(150, 245, 32)}
  <rect x="118" y="258" width="64" height="2.6" rx="1.3" fill="${GOLD}"/>
  <text x="150" y="285" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="13" letter-spacing="1.5" fill="${CREAM}" opacity="0.85">@realcalicoastcards</text>
</svg>`;
}

const files = {
  "chest-fullcolor.svg": chest(false),
  "chest-spotcolor.svg": chest(true),
  "back-fullcolor.svg": back(false),
  "back-spotcolor.svg": back(true),
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(OUT + "/" + name, svg);
console.log("wrote:", Object.keys(files).join(", "));
