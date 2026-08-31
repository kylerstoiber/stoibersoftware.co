/* ==========================================================================
   Stoiber Software LLC — script.js
   Progressive enhancement only. The page is complete without this file.
   ========================================================================== */
(function () {
  'use strict';

  /* --------------------------------------------------------------------
     EDIT ME: phrases the hero caret cycles through after the name types.
     Keep them short (they sit on one line on phones). Three or four is plenty.
     -------------------------------------------------------------------- */
  var CYCLE_PHRASES = [
    'mobile iOS apps.',
    'est. 2026'
  ];

  /* Timing (milliseconds) */
  var NAME_START_DELAY = 120;   // pause before the company name starts typing (after the font is ready)
  var NAME_CHAR_MIN = 40, NAME_CHAR_MAX = 85, NAME_SPACE_PAUSE = 130;
  var CYCLE_START_DELAY = 600;  // pause after the name finishes
  var CYCLE_CHAR_MIN = 45, CYCLE_CHAR_MAX = 110, CYCLE_SPACE_PAUSE = 90;
  var CYCLE_HOLD = 2200;        // how long a finished phrase sits before erasing
  var CYCLE_ERASE = 28;         // per character
  var CYCLE_GAP = 420;          // pause between phrases

  var root = document.documentElement;
  root.classList.add('js-ready');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function rand(min, max) { return min + Math.random() * (max - min); }

  /* ---------- 1. Hero typing ---------- */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var title = hero.querySelector('.hero-title__text');
    var cycle = hero.querySelector('.hero-cycle__text');
    if (!title) return;

    var name = title.textContent.trim();

    // Keep the real name in the DOM for assistive tech; animate a decorative copy.
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = name;
    title.parentNode.insertBefore(sr, title);
    title.setAttribute('aria-hidden', 'true');

    if (reduceMotion) {
      hero.classList.add('is-typed'); // name and first phrase stay static
      return;
    }

    title.textContent = '';
    if (cycle) cycle.textContent = '';
    hero.classList.add('is-typing');

    var i = 0;
    function typeName() {
      var ch = name.charAt(i++);
      title.textContent += ch;
      if (i < name.length) {
        setTimeout(typeName, rand(NAME_CHAR_MIN, NAME_CHAR_MAX) + (ch === ' ' ? NAME_SPACE_PAUSE : 0));
      } else {
        hero.classList.remove('is-typing');
        hero.classList.add('is-typed');
        if (cycle && CYCLE_PHRASES.length) {
          setTimeout(function () { startCycle(hero, cycle); }, CYCLE_START_DELAY);
        }
      }
    }
    // Start once the web font is in (so the name doesn't swap fonts mid-typing), but never wait more than 700ms.
    var started = false;
    function kick() { if (!started) { started = true; setTimeout(typeName, NAME_START_DELAY); } }
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(kick); setTimeout(kick, 700); } else kick();
  }

  function startCycle(hero, el) {
    hero.classList.add('is-cycling');
    var idx = 0, len = 0, phase = 'type', timer = 0, visible = true;

    function tick() {
      timer = 0;
      if (!visible) return; // paused while the hero is off-screen
      var phrase = CYCLE_PHRASES[idx % CYCLE_PHRASES.length];
      var wait;
      if (phase === 'type') {
        len++;
        el.textContent = phrase.slice(0, len);
        wait = rand(CYCLE_CHAR_MIN, CYCLE_CHAR_MAX) + (phrase.charAt(len - 1) === ' ' ? CYCLE_SPACE_PAUSE : 0);
        if (len >= phrase.length) { phase = 'hold'; wait = CYCLE_HOLD; }
      } else if (phase === 'hold') {
        phase = 'erase';
        wait = 0;
      } else {
        len--;
        el.textContent = phrase.slice(0, len);
        wait = CYCLE_ERASE;
        if (len <= 0) { phase = 'type'; idx++; wait = CYCLE_GAP; }
      }
      hero.classList.toggle('is-typing', phase !== 'hold'); // caret blinks only while resting
      timer = setTimeout(tick, wait);
    }

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !timer) tick();
      }, { threshold: 0.15 }).observe(hero);
    }
    tick();
  }

  /* ---------- 2. Scroll reveals (once) ---------- */
  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    var i;
    if (reduceMotion || !hasIO) {
      for (i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }
    // Stagger siblings inside any [data-stagger] group.
    var groups = document.querySelectorAll('[data-stagger]');
    for (i = 0; i < groups.length; i++) {
      var kids = groups[i].querySelectorAll('.reveal');
      for (var k = 0; k < kids.length; k++) kids[k].style.transitionDelay = (k * 110) + 'ms';
    }
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (!entries[e].isIntersecting) continue;
        entries[e].target.classList.add('is-in');
        io.unobserve(entries[e].target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (i = 0; i < items.length; i++) io.observe(items[i]);
  }

  /* ---------- 3. Tilt + cursor glow on [data-tilt] elements (mouse/pen only) ---------- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    var els = document.querySelectorAll('[data-tilt]');
    for (var c = 0; c < els.length; c++) bindTilt(els[c]);
  }

  function bindTilt(card) {
    var MAX_DEG = 6;
    var rect = null, raf = 0, x = 0, y = 0, dirty = false;

    function update() {
      raf = 0;
      if (!rect || dirty) { rect = card.getBoundingClientRect(); dirty = false; }
      var px = x - rect.left, py = y - rect.top;
      var nx = px / rect.width - 0.5, ny = py / rect.height - 0.5;
      card.style.setProperty('--ry', (nx * MAX_DEG * 2).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-ny * MAX_DEG * 2).toFixed(2) + 'deg');
      card.style.setProperty('--gx', px.toFixed(0) + 'px');
      card.style.setProperty('--gy', py.toFixed(0) + 'px');
    }
    card.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch') return;
      rect = card.getBoundingClientRect(); // one read on entry, not per move
      card.classList.add('is-hover');
    });
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    });
    card.addEventListener('pointerleave', function () {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      rect = null;
      card.classList.remove('is-hover');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
    // Wheel-scrolling while hovering moves the card under the cursor; re-measure lazily.
    window.addEventListener('scroll', function () { dirty = true; }, { passive: true });
  }

  /* ---------- 4. Scroll progress bar ---------- */
  function initProgress() {
    var bar = document.querySelector('.progress');
    if (!bar) return;
    var max = 1, raf = 0;
    function measure() { max = Math.max(1, root.scrollHeight - window.innerHeight); }
    function update() {
      raf = 0;
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', function () { measure(); update(); });
    window.addEventListener('load', function () { measure(); update(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); update(); });
    measure(); update();
  }

  /* ---------- 5. Interactive topographic hero ----------
     Contour lines (marching squares) over a slowly drifting height field.
     The pointer acts as a hill: rings form around it and follow it. Touch:
     tap or drag raises a hill under your finger that settles back down.
     Skipped under reduced motion; without JS the CSS hairlines show. */
  function initHeroTopo() {
    var hero = document.querySelector('.hero');
    if (!hero || reduceMotion || !window.CanvasRenderingContext2D) return;
    var LEVELS = 15;    // number of contour levels
    var WL = 320;       // base feature size (px); smaller = busier map
    var OCT = 4;        // noise octaves; more = finer detail
    var GAIN = 3.0;     // field contrast; higher = more lines crossed
    var SIGMA = 120;    // pointer hill radius (px)
    var LIFT = 1.2;     // pointer hill height (field spans about -1..1)
    var SPEED = 1;      // idle drift multiplier
    var EDGES = [[], [3, 2], [2, 1], [3, 1], [0, 1], [0, 1, 3, 2], [0, 2], [0, 3], [0, 3], [0, 2], [0, 3, 2, 1], [0, 1], [3, 1], [2, 1], [3, 2], []];
    var canvas = document.createElement('canvas');
    canvas.className = 'hero-field';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);
    hero.classList.add('has-field');
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, cell = 14, cols = 0, rows = 0, field = null, rect = null, dirty = true;
    var px = -9999, py = -9999, strength = 0, target = 0;
    var visible = true, raf = 0, t0 = performance.now();

    function resize() {
      rect = hero.getBoundingClientRect();
      w = rect.width; h = rect.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.max(10, Math.min(16, Math.sqrt(w * h / 6000)));
      cols = Math.ceil(w / cell) + 2; rows = Math.ceil(h / cell) + 2;
      field = new Float32Array(cols * rows);
      dirty = false;
    }

    // --- height field ---
    function hash(ix, iy) {
      var n = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263)) | 0;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
    }
    function noise(x, y) { // 2D value noise, 0..1
      var x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
      fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
      var a = hash(x0, y0), b = hash(x0 + 1, y0), c = hash(x0, y0 + 1), d = hash(x0 + 1, y0 + 1);
      var top = a + (b - a) * fx, bot = c + (d - c) * fx;
      return top + (bot - top) * fy;
    }
    var DRIFT = [[0.012, 0.007], [-0.009, 0.011], [0.007, -0.012], [-0.011, -0.006]];
    function sampleNoise(x, y, t) { // layered value noise; each octave drifts its own way so shapes morph
      var f = 1 / WL, amp = 1, sum = 0, norm = 0;
      var wx = x + WL * 0.3 * (noise(x * f * 0.6 + 11.7 + t * 0.006, y * f * 0.6 + 3.9) - 0.5);
      var wy = y + WL * 0.3 * (noise(x * f * 0.6 + 5.1, y * f * 0.6 + 17.3 - t * 0.006) - 0.5);
      for (var o = 0; o < OCT; o++) {
        sum += amp * noise(wx * f + t * DRIFT[o][0] * (o + 1) + o * 19.1, wy * f + t * DRIFT[o][1] * (o + 1) + o * 7.7);
        norm += amp; amp *= 0.5; f *= 2;
      }
      return (sum / norm - 0.5) * GAIN;
    }
    var sample = sampleNoise;

    function frame(now) {
      raf = 0;
      if (!visible) return;
      var t = (now - t0) / 1000 * SPEED;
      strength += (target - strength) * (target > strength ? 0.14 : 0.05);
      var live = strength > 0.01, s2 = 2 * SIGMA * SIGMA, i, j;
      for (j = 0; j < rows; j++) {
        for (i = 0; i < cols; i++) {
          var x = i * cell, y = j * cell, v = sample(x, y, t);
          if (live) { var dx = x - px, dy = y - py; v += LIFT * strength * Math.exp(-(dx * dx + dy * dy) / s2); }
          field[j * cols + i] = v;
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#5FB3B4';
      var ex = [0, 0, 0, 0], ey = [0, 0, 0, 0];
      for (var L = 0; L < LEVELS; L++) {
        var iso = -1.1 + (L + 0.5) * (2.2 / LEVELS), index = L % 4 === 2;
        ctx.globalAlpha = index ? 0.34 : 0.15;
        ctx.lineWidth = index ? 1.25 : 1;
        ctx.beginPath();
        for (j = 0; j < rows - 1; j++) {
          for (i = 0; i < cols - 1; i++) {
            var k = j * cols + i, a = field[k], b = field[k + 1], c = field[k + cols + 1], d = field[k + cols];
            var idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
            if (!idx || idx === 15) continue;
            var x0 = i * cell, y0 = j * cell;
            ex[0] = x0 + cell * (iso - a) / (b - a); ey[0] = y0;                 // top
            ex[1] = x0 + cell;                      ey[1] = y0 + cell * (iso - b) / (c - b); // right
            ex[2] = x0 + cell * (iso - d) / (c - d); ey[2] = y0 + cell;          // bottom
            ex[3] = x0;                             ey[3] = y0 + cell * (iso - a) / (d - a); // left
            var e = EDGES[idx];
            for (var n = 0; n < e.length; n += 2) { ctx.moveTo(ex[e[n]], ey[e[n]]); ctx.lineTo(ex[e[n + 1]], ey[e[n + 1]]); }
          }
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && visible) raf = requestAnimationFrame(frame); }

    function point(e) {
      if (dirty || !rect) rect = hero.getBoundingClientRect();
      px = e.clientX - rect.left; py = e.clientY - rect.top;
    }
    hero.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { point(e); target = 1; } });
    hero.addEventListener('pointermove', function (e) { if (e.pointerType !== 'touch' || target) point(e); });
    hero.addEventListener('pointerleave', function () { target = 0; });
    hero.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') { point(e); strength = 1; target = 1; } });
    hero.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') target = 0; });
    hero.addEventListener('pointercancel', function () { target = 0; });
    window.addEventListener('scroll', function () { dirty = true; }, { passive: true });
    window.addEventListener('resize', function () { resize(); start(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
    if (hasIO) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; start(); }, { threshold: 0.02 }).observe(hero);
    }
    resize();
    start();
  }

  initHero();
  initReveals();
  initTilt();
  initProgress();
  initHeroTopo();
})();
