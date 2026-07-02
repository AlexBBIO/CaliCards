/*
 * alexcorrino.com — site logic
 * Re-renders the project index from js/config.js over the static HTML
 * fallback, fills the footer year, reveals the "Elsewhere" links when
 * configured, and draws the field: a value-noise particle flow advected
 * across a fixed canvas, gently bent by the pointer. Under
 * prefers-reduced-motion the field renders one static frame and stops;
 * without JS the static HTML index stands as-is.
 */
(function () {
  "use strict";

  /* ---------- project index: re-render from config ---------- */
  try {
    var cfg = window.SITE_CONFIG;
    if (cfg && cfg.projects && cfg.projects.length) {
      var list = document.getElementById("projects");
      list.textContent = "";
      cfg.projects.forEach(function (p) {
        var li = document.createElement("li");
        li.className = "proj";

        var h3 = document.createElement("h3");
        h3.className = "proj-name";
        if (p.url) {
          var a = document.createElement("a");
          a.href = p.url;
          a.setAttribute("aria-label", p.name);
          a.textContent = p.name;
          h3.appendChild(a);
        } else {
          var s = document.createElement("span");
          s.className = "unlinked";
          s.textContent = p.name;
          h3.appendChild(s);
        }
        li.appendChild(h3);

        var meta = document.createElement("p");
        meta.className = "proj-meta";
        var statusLabel = p.status === "live" && p.url ? "Live" : "In progress";
          meta.textContent = [p.kicker, p.domain, statusLabel]
          .filter(Boolean)
          .join(" · ");
        li.appendChild(meta);

        if (p.blurb) {
          var blurb = document.createElement("p");
          blurb.className = "proj-blurb";
          blurb.textContent = p.blurb;
          li.appendChild(blurb);
        }
        list.appendChild(li);
      });
    }
  } catch (e) { /* static HTML stays in place */ }

  /* ---------- footer year ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* social links under the top bar: hidden until configured */
    var LINK_LABELS = { x: "X", github: "GitHub", substack: "Substack", email: "Email" };
    var socialNav = document.getElementById("social");
    if (socialNav) {
      var links = (window.SITE_CONFIG || {}).links || {};
      var anyLink = false;
      Object.keys(LINK_LABELS).forEach(function (key) {
        var val = (links[key] || "").trim();
        if (!val) return;
        anyLink = true;
        var a = document.createElement("a");
        a.appendChild(document.createTextNode(LINK_LABELS[key] + " "));
        var arr = document.createElement("span");
        arr.setAttribute("aria-hidden", "true");
        arr.textContent = "\u2197";
        a.appendChild(arr);
        a.href = key === "email" ? "mailto:" + val : val;
        socialNav.appendChild(a);
      });
      if (anyLink) socialNav.hidden = false;
    }

    /* ---------- the field: value-noise particle flow ---------- */
  var canvas = document.getElementById("field");
  var ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BG = "#05070c";
  var FADE = "rgba(5, 7, 12, 0.05)";
  var ALPHAS = [0.09, 0.14, 0.2];
  var STROKES = ALPHAS.map(function (a) {
    return "rgba(190, 225, 255, " + a + ")";
  });

  var W = 0, H = 0, dpr = 1;
  var particles = [];
  var buckets = [[], [], []];
  var t = Math.random() * 400;
  var running = false;
  var rafId = 0;

  /* deterministic-ish hashed value noise, seeded per load */
  var seedX = Math.random() * 1024;
  var seedY = Math.random() * 1024;
  function hash(ix, iy) {
    var n = (ix * 374761393 + iy * 668265263) | 0;
    n = ((n ^ (n >>> 13)) * 1274126177) | 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }
  function vnoise(x, y) {
    var ix = Math.floor(x), iy = Math.floor(y);
    var fx = x - ix, fy = y - iy;
    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);
    var a = hash(ix, iy), b = hash(ix + 1, iy);
    var c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }
  function angleAt(x, y, tt) {
    var s = 0.0005;
    var n = 0.68 * vnoise(x * s + seedX + tt * 0.016, y * s + seedY - tt * 0.011)
          + 0.24 * vnoise(x * s * 2.1 + seedY + 40 - tt * 0.021, y * s * 2.1 + seedX + tt * 0.014)
          + 0.08 * (Math.sin(x * s * 0.55 + tt * 0.05) * Math.cos(y * s * 0.62 - tt * 0.04) * 0.5 + 0.5);
    return -0.55 + (n - 0.5) * Math.PI * 1.35;
  }

  /* pointer — gently bends the field */
  var ptr = { x: -9999, y: -9999, k: 0, tk: 0, last: 0 };
  function onMove(e) {
    ptr.x = e.clientX;
    ptr.y = e.clientY;
    ptr.tk = 1;
    ptr.last = performance.now();
  }

  function spawn(p) {
    p.x = Math.random() * W;
    p.y = Math.random() * H;
    p.px = p.x;
    p.py = p.y;
    p.sp = 0.7 + Math.random() * 0.8;
    p.life = 600 + Math.random() * 900;
  }

  function buildParticles() {
    var count = Math.min(2800, Math.max(400, Math.round((W * H) / 480)));
    particles = [];
    buckets = [[], [], []];
    for (var i = 0; i < count; i++) {
      var p = {};
      spawn(p);
      particles.push(p);
      buckets[i % 3].push(p);
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    buildParticles();
  }

  function step(dt) {
    t += 0.9 * dt;
    ctx.fillStyle = FADE;
    ctx.fillRect(0, 0, W, H);

    ptr.k += (ptr.tk - ptr.k) * 0.06;
    if (performance.now() - ptr.last > 2500) ptr.tk = 0;
    var hasPtr = ptr.k > 0.01;
    var R = 210, R2 = R * R;

    for (var b = 0; b < 3; b++) {
      var group = buckets[b];
      ctx.strokeStyle = STROKES[b];
      ctx.beginPath();
      for (var i = 0; i < group.length; i++) {
        var p = group[i];
        var a = angleAt(p.x, p.y, t);
        var vx = Math.cos(a) * p.sp * dt;
        var vy = Math.sin(a) * p.sp * dt;

        if (hasPtr) {
          var dx = ptr.x - p.x, dy = ptr.y - p.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            var d = Math.sqrt(d2);
            var f = (1 - d / R) * ptr.k * p.sp * dt * 0.55;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }

        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;
        p.life -= dt;

        if (p.life <= 0 || p.x < -8 || p.x > W + 8 || p.y < -8 || p.y > H + 8) {
          spawn(p);
          continue;
        }
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }

  var lastTime = 0;
  function frame(now) {
    if (!running) return;
    var dt = lastTime ? Math.min((now - lastTime) / 16.7, 2.2) : 1;
    lastTime = now;
    step(dt);
    rafId = requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduced) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  function renderStatic() {
    for (var i = 0; i < 300; i++) step(1);
  }

  resize();
  if (reduced) {
    renderStatic(); /* one beautiful frame, then nothing moves */
  } else {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });
    start();
  }

  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (reduced) renderStatic();
    }, 150);
  });
})();
