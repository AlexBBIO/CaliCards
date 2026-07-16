# Business cards

Print-ready business cards for **Cali Coast Cards**. The back carries a QR
code that opens **instagram.com/realcalicoastcards** — machine-verified to
decode correctly at print resolution.

## Files

| File | What it is |
| --- | --- |
| `card-front.png` / `.svg` | Front: card-trio mark, wordmark, tagline, IG handle |
| `card-back.png` / `.svg` | Back: navy, "Scan to follow the shop", QR → Instagram |
| `../signs/instagram-qr-sign.png` | 8.5"×11" booth/table sign with a big QR |
| `../../art/qr-instagram.png` / `.svg` | Standalone QR — drop it on anything |

## Specs (already baked in)

- Trim size **3.5" × 2"** (US standard), files are **3.75" × 2.25"** with
  1/8" bleed on each side — backgrounds run to the edge, text stays in the
  safe zone.
- PNGs are **300 dpi** (1125 × 675). Most printers accept PNG directly.
- QR is error-correction **H** (30% redundancy — survives the logo overlay
  and light print wear). Verified with a decoder before every reorder is a
  good habit: `node tools/render-cards.js` re-checks automatically.

## How to order (10 minutes)

1. Go to **gotprint.com** → Business Cards (cheapest good quality, ~$10–20
   per 100) or **vistaprint.com** (~$18–34 per 100, faster/easier UI).
2. Size: 3.5" × 2", standard. Stock: **14pt or 16pt, matte finish**
   (matte reads better with the flat design and QR than gloss).
3. Upload `card-front.png` as the front, `card-back.png` as the back.
   Files include bleed — if the uploader shows trim guides, the cream/navy
   backgrounds should overflow past the trim line. That's correct.
4. On the proof screen, confirm nothing important crosses the cut line and
   the QR looks crisp, then order. 100–250 is plenty for a first run.
5. **Test the QR on the digital proof with your phone before paying.**

For the booth sign: print `instagram-qr-sign.png` on cardstock at any
FedEx Office/Staples (same-day, a few dollars), or at home. An 8×10 picture
frame from the dollar store makes it table-ready.

## Regenerating (e.g. handle change)

```bash
npm i qrcode jsqr pngjs playwright   # local-only deps, not committed
node tools/build-cards.js            # rebuild SVGs (URL is set in this file)
node tools/render-cards.js           # re-render PNGs + verify QR decodes
```
