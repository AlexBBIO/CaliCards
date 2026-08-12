# Shirts

Print art for **Cali Coast Cards** shirts. Transparent-background, 300 dpi.

| File | Placement | For |
| --- | --- | --- |
| `chest-fullcolor` | front left chest, print **4" wide** | DTG / DTF |
| `chest-spotcolor` | same | screen printing |
| `back-fullcolor` | full back, print **12" wide**, top ~4" below collar | DTG / DTF |
| `back-spotcolor` | same | screen printing |

## The premium formula

1. **Blank:** Comfort Colors **1717** in **True Navy** — heavyweight (6.1 oz),
   garment-dyed, the tee boutique brands use. True Navy ≈ our midnight brand
   color, so the shirt itself is the design's background.
   (Alternates: AS Colour 5026 Classic for a cleaner fit, Bella+Canvas 3001
   in Navy if you want lighter/stretchier.)
2. **Print:** screen printing with **water-based / soft-hand ink** for runs of
   12+. For under 12 shirts, **DTF transfers** from a good local press, or DTG
   as a last resort (that's the "normal quality" you're avoiding — acceptable
   on CC1717, but screen print is the real thing).

## Spot-color version notes (give these to the screen printer)

- 4 inks on True Navy: gold `#E2B437`, cream `#FAF6ED`, red `#D8433F`,
  white `#FFFDF7`. Printer adds the white underbase.
- Navy `#232838` areas in the art can be **knocked out to the shirt color**.

## Where to order

- **Real Thread** (realthread.com) — online, premium blanks + water-based
  screen printing, free proof, min ~12. Roughly $15–25/shirt at small
  quantities, 2 print locations. The easy premium option.
- **Local screen shop** — search "screen printing + your city", ask for
  Comfort Colors 1717 and water-based or soft-hand plastisol. Often beats
  online pricing and you can approve a physical sample.
- **Printful** (printful.com) — order as few as 1, pick Comfort Colors 1717
  → True Navy, upload the `fullcolor` files (front 4", back 12"). ~$25–30/shirt.
  DTG quality: good enough for a test run, not the final form.

## Regenerating

```bash
node tools/build-shirts.js
node tools/render-shirts.js
```
