# 🃏 CaliCards

Landing site for **CaliCards** — a California Pokémon card business that sells
live on Whatnot, lists on eBay, and buys everything Pokémon.

Live at **[calicoastcards.com](https://calicoastcards.com)**. Pure static site
(HTML/CSS/vanilla JS), no build step, hosted on Vercel.

> This repo also contains **[`alexcorrino/`](alexcorrino/)** — the standalone
> bio/portfolio site for [alexcorrino.com](https://alexcorrino.com), deployed
> as its own Vercel project (see its README). It's excluded from CaliCards
> deploys via `.vercelignore`.

## Pages

- **`index.html`** — landing page: where we sell (Whatnot/eBay), social
  accounts, and the shows/cons schedule.
- **`buying.html`** — "we buy everything Pokémon": categories, how it works,
  and the contact CTA.

## Editing the site

Almost everything lives in **`js/config.js`**:

- **Seller links** — set `links.whatnot` / `links.ebay` to your store URLs.
  Empty strings render as "Coming soon" tiles automatically.
- **Socials** — set `socials.instagram` / `tiktok` / `youtube` / `x`.
  Empty ones show as muted "soon" chips.
- **Buying contact** — `buyingEmail` stays **empty by default** so no personal
  email is ever published. Contact buttons fall back to the first live
  social/DM link, or a "DMs opening soon" state. Only set it if you have a
  dedicated business address you're happy to make public.
- **Shows & cons** — add entries to `events`:

  ```js
  events: [
    { name: "Collect-A-Con", city: "Long Beach, CA", date: "2026-08-15", dateEnd: "2026-08-16", url: "https://collectacon.com" },
  ],
  ```

  They render date-sorted on the home page; an empty list shows a friendly
  "no shows booked" state.

Copy lives in the two HTML files; the color palette is the `:root` block in
`css/styles.css`. Fonts (Space Grotesk + Inter) are self-hosted in `fonts/`.

## Run locally

```bash
python3 -m http.server 8000   # or: npx serve .
```

## Deploy

```bash
vercel deploy --prod --scope alexbbios-projects
```

The Vercel project is `calicards`; `calicoastcards.com` (+ `www`) is attached.
Never commit tokens — use `vercel --token "$VERCEL_TOKEN"`.
