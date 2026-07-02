/*
 * alexcorrino.com — AC OS logic
 * Renders the project windows from js/config.js, lays them out on the
 * desktop, and runs the OS chrome: live menu-bar clock, draggable windows
 * (wide screens with a fine pointer only), z-order raising, and desktop
 * icons that summon their window. Everything degrades: index.html carries
 * a <noscript> mirror of the project windows (keep it in sync when the
 * config changes) and windows stack statically on small screens.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canDrag =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var desktop = document.querySelector(".desktop");
  var iconsNav = document.getElementById("icons");

  /* ---- clock + dateline + footer year ---- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var clockEl = document.getElementById("clock");
  function tick() {
    if (!clockEl) return;
    var d = new Date();
    clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  tick();
  if (clockEl) setInterval(tick, 15000);

  var now = new Date();
  var datelineEl = document.getElementById("dateline");
  if (datelineEl) {
    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    datelineEl.textContent = DAYS[now.getDay()] + " " + MONTHS[now.getMonth()] + " " + now.getDate();
  }
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(now.getFullYear());

  /* ---- build project windows from config ---- */
  var windowsByName = {};

  function buildWindow(p) {
    var url = (p.url || "").trim();
    var win = document.createElement("section");
    win.className = "window project " + (url ? "is-linked" : "is-soon");
    win.setAttribute("aria-label", p.name || "Project");

    var bar = document.createElement("div");
    bar.className = "titlebar";
    bar.setAttribute("data-drag", "");
    var close = document.createElement("span");
    close.className = "closebox";
    close.setAttribute("aria-hidden", "true");
    var title = document.createElement("span");
    title.className = "title";
    title.textContent = (p.name || "Project").replace(/\s+/g, "") + ".app";
    var zoom = document.createElement("span");
    zoom.className = "zoombox";
    zoom.setAttribute("aria-hidden", "true");
    bar.appendChild(close);
    bar.appendChild(title);
    bar.appendChild(zoom);
    win.appendChild(bar);

    var body = document.createElement("div");
    body.className = "window-body";

    var kicker = document.createElement("p");
    kicker.className = "project-kicker";
    kicker.appendChild(document.createTextNode((p.kicker || "Project") + " · "));
    var status = document.createElement("span");
    var live = p.status === "live" && url;
    status.className = live ? "status-live" : "status-soon";
    status.textContent = live ? "Live" : "In progress";
    kicker.appendChild(status);
    body.appendChild(kicker);

    var name = document.createElement("h3");
    name.className = "project-name";
    if (url) {
      var link = document.createElement("a");
      link.href = url;
      link.textContent = p.name || "Untitled";
      link.setAttribute("aria-label", p.name || "Untitled");
      name.appendChild(link);
    } else {
      name.textContent = p.name || "Untitled";
    }
    body.appendChild(name);

    if (p.blurb) {
      var blurb = document.createElement("p");
      blurb.className = "project-blurb";
      blurb.textContent = p.blurb;
      body.appendChild(blurb);
    }

    var foot = document.createElement("div");
    foot.className = "project-foot";
    var domain = document.createElement("span");
    domain.className = "project-domain";
    domain.textContent = p.domain || "";
    foot.appendChild(domain);
    if (url) {
      var open = document.createElement("a");
      open.className = "project-open";
      open.href = url;
      open.setAttribute("aria-label", "Open " + (p.name || "project"));
      open.textContent = "Open ↗";
      foot.appendChild(open);
    }
    body.appendChild(foot);
    win.appendChild(body);
    return win;
  }

  var projects = cfg.projects || [];
  if (desktop) {
    projects.forEach(function (p) {
      var win = buildWindow(p);
      desktop.insertBefore(win, iconsNav);
      windowsByName[p.name || ""] = win;
    });
  }

  /* ---- desktop layout slots (wide screens; CSS stacks them otherwise) ---- */
  var wide = window.matchMedia ? window.matchMedia("(min-width: 900px)") : null;

  function layout() {
    if (!desktop || !wide || !wide.matches) return;
    var about = desktop.querySelector('[data-slot="about"]');
    var contact = desktop.querySelector('[data-slot="contact"]');
    var wins = projects.map(function (p) { return windowsByName[p.name || ""]; }).filter(Boolean);
    var slots = [
      { el: about, left: 0.04, top: 26 },
      { el: wins[0], left: 0.40, top: 64 },
      { el: wins[1], left: 0.16, top: 330 },
      { el: wins[2], left: 0.55, top: 350 },
      { el: contact, left: 0.68, top: 120 },
    ];
    var w = desktop.clientWidth;
    slots.forEach(function (s) {
      if (!s.el) return;
      if (s.el.style.getPropertyValue("--placed")) return; // don't clobber a dragged window
      s.el.style.left = Math.round(w * s.left) + "px";
      s.el.style.top = s.top + "px";
    });
  }
  layout();
  if (wide && wide.addEventListener) wide.addEventListener("change", layout);
  window.addEventListener("resize", function () {
    if (wide && wide.matches) layout();
  });

  /* ---- z-order + dragging ---- */
  var zCounter = 10;
  function raise(win) {
    zCounter += 1;
    win.style.zIndex = String(zCounter);
  }

  if (desktop && canDrag) {
    desktop.classList.add("is-draggable");

    desktop.querySelectorAll(".window").forEach(function (win) {
      win.addEventListener("pointerdown", function () { raise(win); });
    });

    desktop.addEventListener("pointerdown", function (e) {
      if (!wide || !wide.matches) return;
      var bar = e.target.closest("[data-drag]");
      if (!bar) return;
      var win = bar.closest(".window");
      if (!win) return;
      e.preventDefault();
      raise(win);
      win.classList.add("is-dragging");
      win.style.setProperty("--placed", "1");

      var deskRect = desktop.getBoundingClientRect();
      var winRect = win.getBoundingClientRect();
      var offX = e.clientX - winRect.left;
      var offY = e.clientY - winRect.top;

      function move(ev) {
        var left = ev.clientX - deskRect.left - offX;
        var top = ev.clientY - deskRect.top - offY;
        left = Math.max(-40, Math.min(left, deskRect.width - winRect.width + 40));
        top = Math.max(0, Math.min(top, deskRect.height - 60));
        win.style.left = left + "px";
        win.style.top = top + "px";
      }
      function up() {
        win.classList.remove("is-dragging");
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      }
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });
  }

  /* ---- desktop icons summon their window ---- */
  if (iconsNav && desktop && wide && wide.matches) {
    projects.forEach(function (p) {
      var win = windowsByName[p.name || ""];
      if (!win) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "icon";
      var pict = document.createElement("span");
      pict.className = "pict";
      pict.setAttribute("aria-hidden", "true");
      var label = document.createElement("span");
      label.className = "name";
      label.textContent = (p.sym || p.name || "app").toLowerCase() + ".app";
      btn.appendChild(pict);
      btn.appendChild(label);
      btn.setAttribute("aria-label", "Bring " + (p.name || "window") + " to front");
      btn.addEventListener("click", function () {
        raise(win);
        if (!reduceMotion) {
          win.classList.remove("is-summoned");
          void win.offsetWidth; // restart the animation
          win.classList.add("is-summoned");
        }
        win.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      });
      iconsNav.appendChild(btn);
    });
    if (iconsNav.children.length) iconsNav.hidden = false;
  }

  /* ---- elsewhere (public links) ----
     The Contact window stays hidden until at least one link is configured,
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
    if (any) {
      elsewhere.hidden = false;
      layout();
    }
  }
})();
