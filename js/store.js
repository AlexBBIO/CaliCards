/*
 * CaliCards — storefront logic
 * Renders a live Shopify collection when configured, otherwise a demo grid.
 * No build step, no dependencies beyond Shopify's Buy Button SDK (loaded on demand).
 */
(function () {
  "use strict";

  var cfg = window.CALICARDS_CONFIG || {};
  var shopify = cfg.shopify || {};
  var grid = document.getElementById("shop-grid");
  var banner = document.getElementById("demo-banner");
  var yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var isConnected = Boolean(shopify.domain && shopify.storefrontAccessToken);

  if (isConnected) {
    loadShopify();
  } else {
    if (banner) banner.hidden = false;
    renderDemo();
  }

  /* ------------------------- Demo mode ------------------------- */
  function renderDemo() {
    var products = cfg.demoProducts || [];
    if (!grid) return;
    if (!products.length) {
      grid.innerHTML = '<p class="loading">No products configured yet.</p>';
      return;
    }
    grid.innerHTML = "";
    products.forEach(function (p) {
      grid.appendChild(buildCard(p));
    });
  }

  function buildCard(p) {
    var card = document.createElement("article");
    card.className = "card";

    var art = document.createElement("div");
    art.className = "card-art";
    art.textContent = p.art || "🃏";
    if (p.rarity) {
      var tag = document.createElement("span");
      tag.className = "card-rarity";
      tag.textContent = p.rarity;
      art.appendChild(tag);
    }

    var body = document.createElement("div");
    body.className = "card-body";

    var title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = p.title || "Untitled card";

    var desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = p.desc || "";

    var foot = document.createElement("div");
    foot.className = "card-foot";

    var price = document.createElement("span");
    price.className = "card-price";
    price.textContent = p.price || "";

    var buy = document.createElement("button");
    buy.className = "btn btn-primary";
    buy.type = "button";
    buy.textContent = "Add to cart";
    buy.addEventListener("click", function () {
      alert(
        "Demo mode — connect a Shopify store in js/config.js to enable real checkout."
      );
    });

    foot.appendChild(price);
    foot.appendChild(buy);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(foot);
    card.appendChild(art);
    card.appendChild(body);
    return card;
  }

  /* ------------------------- Live Shopify mode ------------------------- */
  function loadShopify() {
    var SDK_URL =
      "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      initShopify();
      return;
    }
    var script = document.createElement("script");
    script.async = true;
    script.src = SDK_URL;
    script.onload = initShopify;
    script.onerror = function () {
      // Network/SDK failure — fall back to the demo grid so the page still works.
      if (banner) banner.hidden = false;
      renderDemo();
    };
    document.head.appendChild(script);
  }

  function initShopify() {
    if (!window.ShopifyBuy || !grid) {
      renderDemo();
      return;
    }
    var client = window.ShopifyBuy.buildClient({
      domain: shopify.domain,
      storefrontAccessToken: shopify.storefrontAccessToken,
    });

    grid.innerHTML = "";

    window.ShopifyBuy.UI.onReady(client).then(function (ui) {
      var shared = {
        options: {
          product: {
            iframe: false,
            contents: { img: true, title: true, price: true, button: true },
            text: { button: "Add to cart" },
          },
          cart: { text: { total: "Subtotal", button: "Checkout" } },
        },
        node: grid,
        moneyFormat: "%24%7B%7Bamount%7D%7D",
      };

      var cartToggle = document.getElementById("cart-toggle");
      if (cartToggle) {
        ui.createComponent("cart", { node: undefined });
        ui.createComponent("toggle", { node: cartToggle });
      }

      if (shopify.collectionId) {
        ui.createComponent("collection", {
          id: shopify.collectionId,
          node: grid,
          options: shared.options,
          moneyFormat: shared.moneyFormat,
        });
      } else {
        // No collection set — show a helpful note instead of an empty store.
        grid.innerHTML =
          '<p class="loading">Connected to Shopify. Set <code>collectionId</code> in <code>js/config.js</code> to display products.</p>';
      }
    });
  }
})();
