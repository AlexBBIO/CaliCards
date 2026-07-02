# alexcorrino.com

Bio site and project portfolio for **Alex Corrino** (online pseudonym).
Pure static site (HTML/CSS/vanilla JS), no build step, hosted on Vercel as its
own project with this directory as the project root.

## Editing the site

Almost everything lives in **`js/config.js`**:

- **Projects** — add entries to `projects`. Leave `url` empty while something
  isn't live yet and it renders unlinked as "In progress" automatically:

  ```js
  { name: "Example", kicker: "Daily Monitor", sym: "EXMP", domain: "example.com", url: "", status: "building", blurb: "…" },
  ```

- **Elsewhere links** — `links.x` / `github` / `substack` / `email`. All empty
  by default, which keeps the whole "Elsewhere" section hidden — nothing
  personal is ever published by accident. Only add handles that belong to the
  Alex Corrino pseudonym.

The design ("The Field") is a generative particle flow-field drawn on a
full-viewport canvas by `js/site.js`, with sparse type above it. Bio copy
lives in `index.html` (About section) along with a static mirror of the
project index that serves no-JS visitors — update it when projects change.
Colors are plain hex values in `css/styles.css` (ice-blue accent `#a8dcff`
on near-black `#05070c`). The field pauses when the tab is hidden and
renders a single static frame under `prefers-reduced-motion`. Fonts
(Space Grotesk + Inter variable) are self-hosted in `fonts/`.

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
