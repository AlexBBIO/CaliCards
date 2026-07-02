/*
 * alexcorrino.com — site logic
 * Renders the project ledger and "Elsewhere" links from js/config.js, then
 * layers on the decorative extras: per-project sparklines, pointer-tracked
 * row spotlight, scroll reveals, and hero parallax. Everything degrades:
 * index.html carries a <noscript> mirror of the rows (keep it in sync when
 * the config changes) and all motion respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var SVG_NS = "http://www.w3.org/2000/svg";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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
    for (var x = 0; x <= 150; x += 7.5) {
      y += (rnd() - 0.62) * 7;
      y = Math.max(5, Math.min(36, y));
      pts.push(x + "," + y.toFixed(1));
    }
    return pts;
  }

  function sparkline(name) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "spark");
    svg.setAttribute("viewBox", "0 0 150 40");
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

  /* ---- projects ----
     Each row is an <article>; the project name is the link (short accessible
     name) and CSS stretches it over the whole row. A project only reads as
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
    projects.forEach(function (p, idx) {
      var url = (p.url || "").trim();
      var card = document.createElement("article");
      card.className = "project " + (url ? "is-linked" : "is-soon");
      card.style.setProperty("--i", String(idx));

      var index = document.createElement("span");
      index.className = "project-index";
      index.setAttribute("aria-hidden", "true");
      index.textContent = (idx < 9 ? "0" : "") + (idx + 1);
      card.appendChild(index);

      var main = document.createElement("div");
      main.className = "project-main";

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
      main.appendChild(top);

      if (p.blurb) {
        var blurb = document.createElement("p");
        blurb.className = "project-blurb";
        blurb.textContent = p.blurb;
        main.appendChild(blurb);
      }
      card.appendChild(main);

      card.appendChild(sparkline(p.name || "project" + idx));

      var statusKey = p.status === "live" && url ? "live" : "building";
      var status = document.createElement("span");
      status.className = "project-status is-" + statusKey;
      var dot = document.createElement("span");
      dot.className = "dot";
      var label = document.createElement("span");
      label.textContent = STATUS_LABELS[statusKey];
      status.appendChild(dot);
      status.appendChild(label);
      card.appendChild(status);

      var arrow = document.createElement("span");
      arrow.className = "project-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      card.appendChild(arrow);

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

  /* ---- pointer-tracked spotlight on linked rows (hover devices only) ---- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".project.is-linked").forEach(function (row) {
      row.addEventListener("pointermove", function (e) {
        var r = row.getBoundingClientRect();
        row.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        row.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      });
    });
  }

  /* ---- hero parallax (hover devices only) ---- */
  var hero = document.querySelector(".hero");
  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener("pointermove", function (e) {
      hero.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      hero.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    });
  }

  /* ---- scroll reveals + sparkline draw-in ----
     Classes are added here (never in the HTML) so no-JS visitors see
     everything without any observer. */
  var revealTargets = document.querySelectorAll(".section-head, .project, .about-body, .chips");
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
      { rootMargin: "0px 0px 0px 0px", threshold: 0.03 }
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
        { threshold: 0.15 }
      );
      sparkIo.observe(projectsWrap);
    }
  } else if (projectsWrap) {
    projectsWrap.classList.add("in");
  }
})();
