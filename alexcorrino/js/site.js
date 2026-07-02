/*
 * alexcorrino.com — site logic
 * Renders the project index and "Elsewhere" links from js/config.js.
 * Everything degrades: index.html carries a <noscript> mirror of the index
 * rows (keep it in sync when the config changes), and the marquee is pure
 * CSS, disabled under prefers-reduced-motion.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- project index ----
     Each row is an <li>; the name is the link (short accessible name) and
     CSS stretches it over the whole row. The arrow is bound to the last
     word of the name so it never wraps alone. */
  var projectsWrap = document.getElementById("projects");
  if (projectsWrap) {
    var projects = cfg.projects || [];
    if (!projects.length) {
      var empty = document.createElement("li");
      empty.className = "projects-note";
      empty.textContent = "Nothing public yet. First project lands here soon.";
      projectsWrap.appendChild(empty);
    }
    projects.forEach(function (p, i) {
      var url = (p.url || "").trim();
      var li = document.createElement("li");
      li.className = "project " + (url ? "is-linked" : "is-soon");

      var num = document.createElement("span");
      num.className = "row-num";
      num.setAttribute("aria-hidden", "true");
      num.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
      li.appendChild(num);

      var name = document.createElement("h3");
      name.className = "project-name";

      // Bind the last word and the arrow together so the arrow never wraps
      // onto a line of its own.
      var words = String(p.name || "Untitled").split(" ");
      var last = words.pop() || "";
      var head = words.length ? words.join(" ") + " " : "";
      var arrow = document.createElement("span");
      arrow.className = "row-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = url ? "↗" : "···";
      var tail = document.createElement("span");
      tail.className = "row-tail";
      tail.appendChild(document.createTextNode(last + " "));
      tail.appendChild(arrow);

      if (url) {
        var link = document.createElement("a");
        link.href = url;
        if (head) link.appendChild(document.createTextNode(head));
        link.appendChild(tail);
        link.setAttribute("aria-label", p.name || "Untitled");
        name.appendChild(link);
      } else {
        if (head) name.appendChild(document.createTextNode(head));
        name.appendChild(tail);
      }
      li.appendChild(name);

      var meta = document.createElement("span");
      meta.className = "row-meta";
      var kicker = document.createElement("span");
      kicker.className = "row-kicker";
      var bits = [];
      if (p.kicker) bits.push(p.kicker);
      if (p.domain) bits.push(p.domain);
      bits.push(p.status === "live" && url ? "Live" : "In progress");
      kicker.textContent = bits.join(" · ").toUpperCase();
      meta.appendChild(kicker);
      if (p.blurb) {
        var blurb = document.createElement("span");
        blurb.className = "row-blurb";
        blurb.textContent = p.blurb;
        meta.appendChild(blurb);
      }
      li.appendChild(meta);

      projectsWrap.appendChild(li);
    });
  }

  /* ---- elsewhere (public links) ----
     The whole section stays hidden until at least one link is configured,
     so no placeholder contact info is ever published. */
  var LINK_LABELS = { x: "X", github: "GitHub", substack: "Substack", email: "Email" };

  var elsewhere = document.getElementById("elsewhere");
  var chipsWrap = document.getElementById("chips");
  if (elsewhere && chipsWrap) {
    var links = cfg.links || {};
    var any = false;
    Object.keys(LINK_LABELS).forEach(function (key) {
      var val = (links[key] || "").trim();
      if (!val) return;
      any = true;
      var chip = document.createElement("a");
      chip.className = "chip";
      chip.textContent = LINK_LABELS[key];
      chip.href = key === "email" ? "mailto:" + val : val;
      chipsWrap.appendChild(chip);
    });
    if (any) elsewhere.hidden = false;
  }
})();
