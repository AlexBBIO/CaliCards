# alexcorrino.com

Bio site and project portfolio for **Alex Corrino** (online pseudonym).
Pure static site (HTML/CSS/vanilla JS), no build step, hosted on Vercel as its
own project with this directory as the project root.

## Editing the site

Almost everything lives in **`js/config.js`**:

- **Projects** — add entries to `projects`. Leave `url` empty while something
  isn't live yet and it renders as a dashed "in progress" card automatically:

  ```js
  { name: "FactorWatch", domain: "factorwatch.com", url: "", status: "building", blurb: "…" },
  ```

- **Elsewhere links** — `links.x` / `github` / `substack` / `email`. All empty
  by default, which keeps the whole "Elsewhere" section hidden — nothing
  personal is ever published by accident. Only add handles that belong to the
  Alex Corrino pseudonym.

Bio copy lives in `index.html` (the About section); the palette is the
`:root` block in `css/styles.css` (light + dark, via `prefers-color-scheme`).
Fonts (Space Grotesk + Inter) are self-hosted in `fonts/`.

## Run locally

```bash
cd alexcorrino
python3 -m http.server 8000   # or: npx serve .
```

## Deploy

```bash
cd alexcorrino
vercel deploy --prod
```

The Vercel project is `alexcorrino`; `alexcorrino.com` (+ `www`) is attached.
Never commit tokens — use `vercel --token "$VERCEL_TOKEN"`.

**Pseudonym hygiene:** Vercel static deploys serve every uploaded file, so
`.vercelignore` here keeps this README off the live site. Don't add anything
to this directory that ties the pseudonym to other accounts or businesses —
`js/config.js` ships to browsers verbatim, comments included.
