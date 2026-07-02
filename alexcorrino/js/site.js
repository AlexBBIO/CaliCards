/*
 * alexcorrino.com — site logic
 * Renders the article columns and "Elsewhere" links from js/config.js, fills
 * the masthead dateline, and layers on the decorative extras: ink sparklines
 * that draw in on scroll and gentle reveals. Everything degrades: index.html
 * carries a <noscript> mirror of the articles (keep it in sync when the
 * config changes) and all motion respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var SVG_NS = "http://www.w3.org/2000/svg";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- masthead dateline + footer year ---- */
  var now = new Date();
  var datelineEl = document.getElementById("dateline");
  if (datelineEl) {
    var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    datelineEl.textContent =
      DAYS[now.getDay()] + " · " + MONTHS[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
  }
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(now.getFullYear());

  /* ---- deterministic upward-drifting sparkline per project name ---- */
  function sparkPoints(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    function rnd() {
      h = (h * 1664525 + 1013904223) >>> 0;
      return h / 4294967296;
    }
    var pts = [];
    var y = 36;
    for (var x = 0; x <= 260; x += 13) {
      y += (rnd() - 0.62) * 8;
      y = Math.max(6, Math.min(42, y));
      pts.push(x + "," + y.toFixed(1));
    }
    return pts;
  }

  function sparkline(name) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "spark");
    svg.setAttribute("viewBox", "0 0 260 48");
    svg.setAttribute("aria-hidden", "true");
    var pts = sparkPoints(name);
    var line = document.createElementNS(SVG_NS, "polyline");
    line.setAttribute("points", pts.join(" "));
    line.setAttribute("pathLength", "1");
    var last = pts[pts.length - 1].split(",");
    var dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("cx", last[0]);
    dot.setAttribute("cy", last[1]);
    dot.setAttribute("r", "3");
    svg.appendChild(line);
    svg.appendChild(dot);
    return svg;
  }

  /* ---- articles ----
     Each article is an <article>; the headline is the link (short accessible
     name) and CSS stretches it over the whole column. A project only reads
     as "Live" when it actually has a URL to visit. */
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
    projects.forEach(function (p, idx) {
      var url = (p.url || "").trim();
      var card = document.createElement("article");
      card.className = "project " + (url ? "is-linked" : "is-soon");
      card.style.setProperty("--i", String(idx));

      var kicker = document.createElement("p");
      kicker.className = "project-kicker label";
      kicker.textContent = p.kicker || (url ? "In print" : "On the desk");
      card.appendChild(kicker);

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
      card.appendChild(name);

      card.appendChild(sparkline(p.name || "project" + idx));

      if (p.blurb) {
        var blurb = document.createElement("p");
        blurb.className = "project-blurb";
        blurb.textContent = p.blurb;
        card.appendChild(blurb);
      }

      var foot = document.createElement("div");
      foot.className = "project-foot";

      if (url) {
        var more = document.createElement("a");
        more.className = "project-more";
        more.href = url;
        more.innerHTML = "";
        more.appendChild(document.createTextNode("Read at " + (p.domain || "the site") + " "));
        var arr = document.createElement("span");
        arr.className = "arr";
        arr.setAttribute("aria-hidden", "true");
        arr.textContent = "→";
        more.appendChild(arr);
        foot.appendChild(more);
      } else if (p.domain) {
        var dom = document.createElement("span");
        dom.className = "project-domain";
        dom.textContent = p.domain;
        foot.appendChild(dom);
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
      foot.appendChild(status);

      card.appendChild(foot);
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

  /* ---- scroll reveals + sparkline draw-in ----
     Classes are added here (never in the HTML) so no-JS visitors see
     everything without any observer. */
  var revealTargets = document.querySelectorAll(".section-head, .project, .chips");
  if ("IntersectionObserver" in window && !reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.03 }
    );
    revealTargets.forEach(function (el) { io.observe(el); });

    if (projectsWrap) {
      var sparkIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            projectsWrap.classList.add("in");
            sparkIo.disconnect();
          });
        },
        { threshold: 0.1 }
      );
      sparkIo.observe(projectsWrap);
    }
  } else if (projectsWrap) {
    projectsWrap.classList.add("in");
  }
})();
