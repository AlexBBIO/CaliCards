/*
 * CaliCards — store configuration
 * ================================
 * This is the ONLY file you need to edit to go live.
 *
 * 1) Create a Shopify store (the cheapest "Starter" plan works).
 * 2) Add your cards as products and put them in a Collection.
 * 3) In Shopify admin: Settings → Apps and sales channels → Develop apps →
 *    create an app → Storefront API → install → copy the
 *    "Storefront API access token".
 * 4) Fill in the three values below and reload the page.
 *
 * Until these are filled in, the site runs in DEMO mode using the sample
 * cards further down so you can see exactly how it looks.
 */
window.CALICARDS_CONFIG = {
  shopify: {
    // e.g. "calicards.myshopify.com" (NOT your custom domain)
    domain: "",
    // Storefront API access token (safe to expose publicly — read-only storefront scope)
    storefrontAccessToken: "",
    // Numeric collection ID to feature. Find it in the admin URL of the
    // collection: .../collections/<THIS_NUMBER>. Leave "" to use a product list instead.
    collectionId: "",
  },

  // Demo cards — shown in DEMO mode and used as a fallback if Shopify can't load.
  // Each renders as a holographic collectible-card visual (no photos needed).
  //   rarity: drives the frame color + gem badge ("Graded" / "PSA 10" / "Rare" /
  //           "Sealed" / "Promo" / "Common"). Top tiers get an idle foil drift.
  //   sigil:  1–3 char set monogram shown big on the card face.
  //   set:    the card set / line name (small label).
  //   stat:   a short condition/population line (museum-label style).
  demoProducts: [
    {
      title: "Pacific Legends — PSA 10",
      desc: "Gem mint slab. Population low, demand high.",
      price: "$299.99",
      rarity: "PSA 10",
      sigil: "PL",
      set: "Pacific Legends",
      stat: "Gem Mint · Pop 3",
    },
    {
      title: "Golden Bear Holo — 1st Edition",
      desc: "Centered, sharp corners. The crown jewel of the Cali Classics set.",
      price: "$149.99",
      rarity: "Graded",
      sigil: "GB",
      set: "Cali Classics",
      stat: "Pop 12 · Mint 9",
    },
    {
      title: "Big Sur Legendary",
      desc: "Coastal grail. Graded, beautifully centered.",
      price: "$189.99",
      rarity: "Graded",
      sigil: "BS",
      set: "Coastal Greats",
      stat: "Pop 7 · Mint 9.5",
    },
    {
      title: "Mojave Mirage — Secret Rare",
      desc: "Textured holo with a desert-heat shimmer. Lightly played.",
      price: "$59.99",
      rarity: "Rare",
      sigil: "MM",
      set: "Mojave",
      stat: "Holo · LP",
    },
    {
      title: "Redwood Rare Foil",
      desc: "Textured foil single. Light play, still a stunner.",
      price: "$24.99",
      rarity: "Rare",
      sigil: "RR",
      set: "Redwood Series",
      stat: "NM · Textured Foil",
    },
    {
      title: "Vintage Cali Classics — Sealed Box",
      desc: "Factory-sealed booster box. 36 packs, untouched.",
      price: "$89.99",
      rarity: "Sealed",
      sigil: "VC",
      set: "Cali Classics",
      stat: "36 packs · Factory sealed",
    },
    {
      title: "Sunset Series Booster Pack",
      desc: "Sealed pack, 11 cards. Chase the foil parallels.",
      price: "$5.99",
      rarity: "Sealed",
      sigil: "SS",
      set: "Sunset Series",
      stat: "11 cards · Sealed",
    },
    {
      title: "Surf City Promo Card",
      desc: "Tournament promo, near mint. A fan favorite.",
      price: "$12.50",
      rarity: "Promo",
      sigil: "SC",
      set: "Surf City",
      stat: "NM · Tournament promo",
    },
  ],
};
