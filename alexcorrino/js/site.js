/*
 * alexcorrino.com — site logic
 * Renders the project index and "Elsewhere" links from js/config.js.
 * (index.html carries a <noscript> mirror of the project cards — keep it in
 * sync when the config changes.)
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- projects ----
     Each card is an <article>; the project name is the link (short accessible
     name) and CSS stretches it over the whole card. A project only reads as
     "Live" when it actually has a URL to visit. */
  var STATUS_LABELS = { live: "Live", building: "In progress" };

  var projectsWrap = document.getElementById("projects");
  if (projectsWrap) {
    var projects = cfg.projects || [];
    if (!projects.length) {
      var empty = document.createElement("p");
      empty.className = "projects-note";
      empty.textContent = "Nothing public yet. First project lands here soon.";
      projectsWrap.appendChild(empty);
    }
    projects.forEach(function (p) {
      var url = (p.url || "").trim();
      var card = document.createElement("article");
      card.className = "project " + (url ? "is-linked" : "is-soon");

      var top = document.createElement("div");
      top.className = "project-top";

      var name = document.createElement("h3");
      name.className = "project-name";
      if (url) {
        var link = document.createElement("a");
        link.href = url;
        link.textContent = p.name || "Untitled";
        name.appendChild(link);
      } else {
        name.textContent = p.name || "Untitled";
      }
      top.appendChild(name);

      if (p.domain) {
        var domain = document.createElement("span");
        domain.className = "project-domain";
        domain.textContent = p.domain;
        top.appendChild(domain);
      }

      var statusKey = p.status === "live" && url ? "live" : "building";
      var status = document.createElement("span");
      status.className = "project-status is-" + statusKey;
      var dot = document.createElement("span");
      dot.className = "dot";
      var label = document.createElement("span");
      label.textContent = STATUS_LABELS[statusKey];
      status.appendChild(dot);
      status.appendChild(label);
      top.appendChild(status);

      card.appendChild(top);

      if (p.blurb) {
        var blurb = document.createElement("p");
        blurb.className = "project-blurb";
        blurb.textContent = p.blurb;
        card.appendChild(blurb);
      }

      if (url) {
        var arrow = document.createElement("span");
        arrow.className = "project-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        card.appendChild(arrow);
      }

      projectsWrap.appendChild(card);
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
