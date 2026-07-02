/*
 * Cali Coast Cards — site logic
 * Fills in links/socials/events from js/config.js and powers the
 * pointer-reactive holographic tilt on the card visuals.
 */
(function () {
  "use strict";

  var cfg = window.CALICARDS_CONFIG || {};
  var links = cfg.links || {};
  var socials = cfg.socials || {};

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- seller links (eBay / Whatnot tiles) ---- */
  document.querySelectorAll("[data-link]").forEach(function (tile) {
    var key = tile.getAttribute("data-link");
    var url = (links[key] || "").trim();
    if (url) {
      tile.href = url;
      tile.target = "_blank";
      tile.rel = "noopener";
    } else {
      tile.classList.add("is-soon");
      tile.removeAttribute("href");
      tile.setAttribute("aria-disabled", "true");
    }
  });

  /* ---- social chips ---- */
  var SOCIAL_LABELS = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", x: "X" };
  var socialWrap = document.getElementById("socials");
  if (socialWrap) {
    Object.keys(SOCIAL_LABELS).forEach(function (key) {
      var url = (socials[key] || "").trim();
      var chip = document.createElement(url ? "a" : "span");
      chip.className = "chip" + (url ? "" : " is-soon");
      chip.textContent = SOCIAL_LABELS[key];
      if (url) {
        chip.href = url;
        chip.target = "_blank";
        chip.rel = "noopener";
      } else {
        var soon = document.createElement("small");
        soon.textContent = "soon";
        chip.appendChild(soon);
      }
      socialWrap.appendChild(chip);
    });
  }

  /* ---- buying contact ----
     Priority: buyingEmail (only if the owner opts in) → first live social/DM
     link → disabled "DMs opening soon" state. Personal email is never shown
     unless explicitly configured. */
  var email = (cfg.buyingEmail || "").trim();
  var dmUrl = [socials.instagram, links.whatnot, socials.tiktok, socials.x, socials.youtube, links.ebay]
    .map(function (u) { return (u || "").trim(); })
    .filter(Boolean)[0];
  document.querySelectorAll("[data-contact]").forEach(function (btn) {
    if (email) {
      btn.href = "mailto:" + email + "?subject=" + encodeURIComponent("Selling my Pokemon cards");
      btn.textContent = "Email your collection";
    } else if (dmUrl) {
      btn.href = dmUrl;
      btn.target = "_blank";
      btn.rel = "noopener";
      btn.textContent = "DM us your cards";
    } else {
      btn.classList.add("is-soon");
      btn.removeAttribute("href");
      btn.setAttribute("aria-disabled", "true");
      btn.textContent = "DMs opening soon";
    }
  });

  /* ---- shows & cons ---- */
  var MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  function dateParts(iso) {
    var p = String(iso || "").split("-");
    return { m: MONTHS[(parseInt(p[1], 10) || 1) - 1] || "TBD", d: parseInt(p[2], 10) || "" };
  }

  var eventsWrap = document.getElementById("events");
  if (eventsWrap) {
    var events = (cfg.events || []).slice().sort(function (a, b) {
      return String(a.date).localeCompare(String(b.date));
    });
    if (!events.length) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent =
        "No shows on the calendar right now — new dates land here (and on our socials) as soon as we book them.";
      eventsWrap.appendChild(empty);
    } else {
      events.forEach(function (ev) {
        var row = document.createElement(ev.url ? "a" : "div");
        row.className = "event";
        if (ev.url) {
          row.href = ev.url;
          row.target = "_blank";
          row.rel = "noopener";
        }

        var start = dateParts(ev.date);
        var dayText = String(start.d);
        if (ev.dateEnd) {
          var end = dateParts(ev.dateEnd);
          dayText = end.m === start.m ? start.d + "–" + end.d : start.d + "+";
        }

        var date = document.createElement("span");
        date.className = "event-date";
        var m = document.createElement("span");
        m.className = "m";
        m.textContent = start.m;
        var d = document.createElement("span");
        d.className = "d";
        d.textContent = dayText;
        date.appendChild(m);
        date.appendChild(d);

        var info = document.createElement("span");
        info.className = "event-info";
        var name = document.createElement("span");
        name.className = "event-name";
        name.textContent = ev.name || "Card show";
        var city = document.createElement("span");
        city.className = "event-city";
        city.textContent = ev.city || "";
        info.appendChild(name);
        info.appendChild(city);

        row.appendChild(date);
        row.appendChild(info);
        if (ev.url) {
          var arrow = document.createElement("span");
          arrow.className = "event-arrow";
          arrow.textContent = "→";
          row.appendChild(arrow);
        }
        eventsWrap.appendChild(row);
      });
    }
  }

  /* ---- holographic tilt (hover devices only) ---- */
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      var frame = card.querySelector(".card-frame");
      if (!frame) return;
      card.addEventListener("pointermove", function (e) {
        var r = frame.getBoundingClientRect();
        var mx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        var my = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
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
})();
