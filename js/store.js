/*
 * CaliCards — storefront logic
 * Renders a live Shopify collection when configured, otherwise a demo grid of
 * holographic collectible-card visuals. No build step; the only external piece
 * is Shopify's Buy Button SDK, loaded on demand when a store is connected.
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
    grid.classList.add("grid--demo");
    grid.innerHTML = "";
    products.forEach(function (p) {
      grid.appendChild(buildCard(p));
    });
    enableTilt();
  }

  // rarity label -> css modifier key
  function rarityKey(r) {
    return String(r || "Common").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function buildCard(p) {
    var rarity = p.rarity || "Common";
    var article = el("article", "card");
    article.setAttribute("data-rarity", rarityKey(rarity));

    // --- The collectible card face ---
    var frame = el("div", "card-frame");
    var foil = el("div", "card-foil");
    foil.setAttribute("aria-hidden", "true");
    var glare = el("div", "card-glare");
    glare.setAttribute("aria-hidden", "true");

    var art = el("div", "card-art");
    var guilloche = el("div", "card-guilloche");
    guilloche.setAttribute("aria-hidden", "true");
    var setLabel = el("span", "card-set", p.set || "CaliCards");
    var sigil = el("span", "card-sigil", p.sigil || initials(p.title));
    var wordmark = el("span", "card-wordmark", "CALICARDS");
    art.appendChild(guilloche);
    art.appendChild(setLabel);
    art.appendChild(sigil);
    art.appendChild(wordmark);

    var gem = el("span", "card-gem", rarity);

    frame.appendChild(foil);
    frame.appendChild(art);
    frame.appendChild(glare);
    frame.appendChild(gem);

    // --- The "museum label" info strip ---
    var info = el("div", "card-info");
    var title = el("h3", "card-title", p.title || "Untitled card");
    var stat = el("p", "card-stat", p.stat || p.desc || "");
    var foot = el("div", "card-foot");
    var price = el("span", "card-price", p.price || "");
    var buy = el("button", "btn btn-buy", "Add");
    buy.type = "button";
    buy.addEventListener("click", function () {
      flash(buy);
    });
    foot.appendChild(price);
    foot.appendChild(buy);
    info.appendChild(title);
    info.appendChild(stat);
    info.appendChild(foot);

    article.appendChild(frame);
    article.appendChild(info);
    return article;
  }

  // brief "Demo" feedback on the buy button (no real cart in demo mode)
  function flash(btn) {
    if (btn.dataset.busy) return;
    btn.dataset.busy = "1";
    var orig = btn.textContent;
    btn.textContent = "Demo ✓";
    btn.classList.add("is-demo");
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove("is-demo");
      delete btn.dataset.busy;
    }, 1100);
  }

  /* Pointer-reactive holographic tilt — the signature interaction.
     Updates --mx/--my (0..1) per card so the foil sheen, specular glare,
     and a subtle 3D rotation all track the cursor. Skipped on touch. */
  function enableTilt() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    var cards = grid.querySelectorAll(".card");
    cards.forEach(function (card) {
      var frame = card.querySelector(".card-frame");
      if (!frame) return;
      card.addEventListener("pointermove", function (e) {
        var r = frame.getBoundingClientRect();
        var mx = (e.clientX - r.left) / r.width;
        var my = (e.clientY - r.top) / r.height;
        mx = Math.min(1, Math.max(0, mx));
        my = Math.min(1, Math.max(0, my));
        card.style.setProperty("--mx", mx.toFixed(3));
        card.style.setProperty("--my", my.toFixed(3));
        card.style.setProperty("--rx", ((0.5 - my) * 10).toFixed(2) + "deg");
        card.style.setProperty("--ry", ((mx - 0.5) * 12).toFixed(2) + "deg");
        card.classList.add("is-tilting");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--mx", "0.5");
        card.style.setProperty("--my", "0.5");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.classList.remove("is-tilting");
      });
    });
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

    // Theme tokens pulled from CSS so the live store matches the site.
    var css = getComputedStyle(document.documentElement);
    var accent = (css.getPropertyValue("--accent") || "#6E7BFF").trim();
    var ink = (css.getPropertyValue("--bg") || "#0A0B12").trim();

    var buttonStyle = {
      "background-color": accent,
      "color": ink,
      "font-family": "Inter, sans-serif",
      "font-weight": "600",
      "border-radius": "10px",
      ":hover": { "background-color": accent, "opacity": "0.9" },
      ":focus": { "background-color": accent },
    };

    window.ShopifyBuy.UI.onReady(client).then(function (ui) {
      var cartToggle = document.getElementById("cart-toggle");
      if (cartToggle) {
        ui.createComponent("cart", {
          options: {
            cart: {
              styles: { button: buttonStyle },
              text: { total: "Subtotal", button: "Checkout" },
            },
          },
        });
        ui.createComponent("toggle", {
          node: cartToggle,
          options: { toggle: { styles: { toggle: { "background-color": accent, "color": ink } } } },
        });
      }

      if (shopify.collectionId) {
        ui.createComponent("collection", {
          id: shopify.collectionId,
          node: grid,
          options: {
            product: {
              iframe: false,
              contents: { img: true, title: true, price: true, button: true },
              text: { button: "Add to cart" },
              styles: { button: buttonStyle },
            },
            cart: { styles: { button: buttonStyle } },
            moneyFormat: "%24%7B%7Bamount%7D%7D",
          },
        });
      } else {
        grid.innerHTML =
          '<p class="loading">Connected to Shopify. Set <code>collectionId</code> in <code>js/config.js</code> to display products.</p>';
      }
    });
  }

  /* ------------------------- tiny DOM helpers ------------------------- */
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function initials(title) {
    return String(title || "CC")
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) { return w.charAt(0); })
      .join("")
      .toUpperCase();
  }
})();
