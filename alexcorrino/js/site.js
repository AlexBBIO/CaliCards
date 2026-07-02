/*
 * alexcorrino.com — site logic
 * Renders the POSITIONS blotter and contact chips from js/config.js, runs
 * the terminal chrome (clock, typed command line, keyboard shortcuts), and
 * draws the sparklines in on scroll. Everything degrades: index.html
 * carries a <noscript> mirror of the blotter (keep it in sync when the
 * config changes) and all motion respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var SVG_NS = "http://www.w3.org/2000/svg";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- clock + dateline + footer year ---- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var clockEl = document.getElementById("clock");
  function tick() {
    if (!clockEl) return;
    var d = new Date();
    clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  tick();
  if (clockEl) setInterval(tick, 1000);

  var now = new Date();
  var datelineEl = document.getElementById("dateline");
  if (datelineEl) {
    var MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    datelineEl.textContent = pad(now.getDate()) + " " + MONTHS[now.getMonth()] + " " + now.getFullYear();
  }
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(now.getFullYear());

  /* ---- typed command line (static text is already in the HTML) ---- */
  var cmdEl = document.getElementById("cmd");
  if (cmdEl && !reduceMotion) {
    var full = cmdEl.textContent;
    cmdEl.textContent = "";
    var i = 0;
    var typer = setInterval(function () {
      i += 1;
      cmdEl.textContent = full.slice(0, i);
      if (i >= full.length) clearInterval(typer);
    }, 34);
  }

  /* ---- deterministic upward-drifting sparkline per project name ---- */
  function sparkPoints(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    function rnd() {
      h = (h * 1664525 + 1013904223) >>> 0;
      return h / 4294967296;
    }
    var pts = [];
    var y = 30;
    for (var x = 0; x <= 190; x += 9.5) {
      y += (rnd() - 0.62) * 7;
      y = Math.max(5, Math.min(35, y));
      pts.push(x + "," + y.toFixed(1));
    }
    return pts;
  }

  function sparkline(name) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "spark");
    svg.setAttribute("viewBox", "0 0 190 40");
    svg.setAttribute("aria-hidden", "true");
    var pts = sparkPoints(name);
    var line = document.createElementNS(SVG_NS, "polyline");
    line.setAttribute("points", pts.join(" "));
    line.setAttribute("pathLength", "1");
    var last = pts[pts.length - 1].split(",");
    var dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("cx", last[0]);
    dot.setAttribute("cy", last[1]);
    dot.setAttribute("r", "2.6");
    svg.appendChild(line);
    svg.appendChild(dot);
    return svg;
  }

  /* ---- positions blotter ----
     Each row is an <article>; the name is the link (short accessible name)
     and CSS stretches it over the whole row. A project only reads as "Live"
     when it actually has a URL to visit. */
  var STATUS_LABELS = { live: "▲ Live", building: "● In progress" };

  var projectsWrap = document.getElementById("projects");
  if (projectsWrap) {
    var projects = cfg.projects || [];
    if (!projects.length) {
      var empty = document.createElement("p");
      empty.className = "projects-note";
      empty.textContent = "No open positions. First publication lands here soon.";
      projectsWrap.appendChild(empty);
    }
    projects.forEach(function (p, idx) {
      var url = (p.url || "").trim();
      var row = document.createElement("article");
      row.className = "project " + (url ? "is-linked" : "is-soon");

      var sym = document.createElement("span");
      sym.className = "project-sym";
      sym.textContent = p.sym || "P" + (idx + 1);
      row.appendChild(sym);

      var main = document.createElement("div");
      main.className = "project-main";
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
      main.appendChild(name);
      if (p.blurb) {
        var blurb = document.createElement("p");
        blurb.className = "project-blurb";
        blurb.textContent = p.blurb;
        main.appendChild(blurb);
      }
      row.appendChild(main);

      var kicker = document.createElement("p");
      kicker.className = "project-kicker";
      kicker.textContent = p.kicker || (url ? "Live" : "On the desk");
      row.appendChild(kicker);

      row.appendChild(sparkline(p.name || "project" + idx));

      var statusKey = p.status === "live" && url ? "live" : "building";
      var status = document.createElement("span");
      status.className = "project-status is-" + statusKey;
      var dot = document.createElement("span");
      dot.className = "dot";
      var label = document.createElement("span");
      label.textContent = STATUS_LABELS[statusKey];
      status.appendChild(dot);
      status.appendChild(label);
      row.appendChild(status);

      if (url) {
        var more = document.createElement("a");
        more.className = "project-more";
        more.href = url;
        more.textContent = "OPEN →";
        more.setAttribute("aria-label", "Open " + (p.name || "project"));
        row.appendChild(more);
      } else {
        row.appendChild(document.createElement("span"));
      }

      projectsWrap.appendChild(row);
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

  /* ---- sparkline draw-in when the blotter scrolls into view ---- */
  if (projectsWrap) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            projectsWrap.classList.add("in");
            io.disconnect();
          });
        },
        { threshold: 0.1 }
      );
      io.observe(projectsWrap);
    } else {
      projectsWrap.classList.add("in");
    }
  }

  /* ---- keyboard shortcuts: 1 = profile, 2 = positions, 0 = top ---- */
  var KEYS = { "1": "#about", "2": "#projects-section", "0": "#top" };
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    var sel = KEYS[e.key];
    if (!sel) return;
    var el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
})();
