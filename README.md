# 🃏 CaliCards

A simple, self-contained storefront for selling **trading & collectible cards**.
It's a plain static site (HTML/CSS/JS — no build step) that embeds **Shopify's
Buy Button SDK** for a secure, hosted checkout.

It works two ways:

- **Demo mode (default):** shows sample cards so you can see the site immediately,
  with no Shopify account required.
- **Live mode:** fill in one config file and it sells real inventory through
  Shopify checkout.

---

## Run it locally

It's static — just open `index.html`, or serve the folder:

```bash
# any of these works
python3 -m http.server 8000      # then visit http://localhost:8000
npx serve .
```

---

## Go live with Shopify (when you choose to)

You only edit **`js/config.js`**.

1. **Create a Shopify store.** The cheapest plan that supports the Buy Button /
   Storefront API works (the "Starter" plan is enough to sell with Buy Buttons).
2. **Add your cards** as products, then group them into a **Collection**.
3. **Create a Storefront API token:** Shopify admin → *Settings → Apps and sales
   channels → Develop apps → Create an app → Configure Storefront API scopes →
   Install app → reveal the **Storefront API access token***.
   (This token is read-only and safe to ship in client-side code.)
4. **Find your collection ID:** open the collection in admin; the number in the
   URL `.../collections/<NUMBER>` is the ID.
5. Fill in `js/config.js`:

   ```js
   shopify: {
     domain: "your-store.myshopify.com",
     storefrontAccessToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     collectionId: "123456789",
   }
   ```

Reload — the demo banner disappears and live products + cart/checkout turn on.

---

## Deploy

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, Vercel).

### Vercel

This repo includes a `vercel.json`. To deploy:

```bash
npm i -g vercel
vercel            # first run links/creates the project
vercel --prod     # promote to production
```

> **Security note:** never commit API tokens. A Vercel access token belongs in
> the `VERCEL_TOKEN` environment variable (`vercel --token "$VERCEL_TOKEN"`),
> not in the repo. `.env*` and `.vercel` are already gitignored.

---

## Project structure

```
CaliCards/
├── index.html        # the storefront page
├── css/styles.css    # styling (California sunset theme)
├── js/config.js      # ← the only file you edit to go live
├── js/store.js       # renders live Shopify collection or the demo grid
├── vercel.json       # static deploy config
└── README.md
```

## Customizing

- **Branding/colors:** the palette lives in the `:root` block of `css/styles.css`.
- **Demo products:** edit the `demoProducts` array in `js/config.js`.
- **Copy:** hero, About, and FAQ text are plain HTML in `index.html`.
