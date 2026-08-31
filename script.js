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
  var NAME_START_DELAY = 500;   // pause before the company name starts typing
  var NAME_CHAR_MIN = 55, NAME_CHAR_MAX = 125, NAME_SPACE_PAUSE = 200;
  var CYCLE_START_DELAY = 700;  // pause after the name finishes
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
    setTimeout(typeName, NAME_START_DELAY);
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

  /* ---------- 3. Card tilt + cursor glow (mouse/pen only) ---------- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    var cards = document.querySelectorAll('.card');
    for (var c = 0; c < cards.length; c++) bindTilt(cards[c]);
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

  /* ---------- 5. Pause product demos while off-screen ---------- */
  function initDemos() {
    var demos = document.querySelectorAll('.demo');
    if (!demos.length || !hasIO) return;
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        entries[i].target.classList.toggle('is-paused', !entries[i].isIntersecting);
      }
    }, { threshold: 0.05 });
    for (var d = 0; d < demos.length; d++) io.observe(demos[d]);
  }

  /* ---------- 6. Interactive hero lines ----------
     Flat teal contour lines that drift slowly and part around the pointer
     (or your finger on touch). Skipped under reduced motion; without JS the
     CSS fallback shows static hairlines instead. */
  function initHeroLines() {
    var hero = document.querySelector('.hero');
    if (!hero || reduceMotion || !window.CanvasRenderingContext2D) return;
    var LINES = 14;     // how many lines span the hero
    var AMP = 14;       // idle wave height (px)
    var RADIUS = 200;   // pointer influence (px)
    var BULGE = 48;     // how far lines part around the pointer (px)
    var STEP = 10;      // sampling step along x (px)
    var canvas = document.createElement('canvas');
    canvas.className = 'hero-field';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);
    hero.classList.add('has-field');
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, rect = null, dirty = true;
    var px = -9999, py = -9999, strength = 0, target = 0;
    var visible = true, raf = 0, t0 = performance.now();

    function resize() {
      rect = hero.getBoundingClientRect();
      w = rect.width; h = rect.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = false;
    }

    function frame(now) {
      raf = 0;
      if (!visible) return;
      var t = (now - t0) / 1000;
      strength += (target - strength) * (target > strength ? 0.14 : 0.05); // quick in, slow fade
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#5FB3B4';
      var gap = h / (LINES + 1), live = strength > 0.01, r2 = RADIUS * RADIUS;
      for (var i = 1; i <= LINES; i++) {
        var baseY = gap * i, phase = i * 0.9, dir = baseY < py ? -1 : 1;
        var near = Math.abs(baseY - py);
        ctx.globalAlpha = 0.15 + (live && near < RADIUS ? 0.4 * (1 - near / RADIUS) * strength : 0);
        ctx.beginPath();
        for (var x = 0; x <= w + STEP; x += STEP) {
          var y = baseY
            + AMP * Math.sin(x * 0.0065 + phase + t * 0.45)
            + AMP * 0.45 * Math.sin(x * 0.017 - phase + t * 0.3);
          if (live) {
            var dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
            if (d2 < r2) {
              var k = 1 - Math.sqrt(d2) / RADIUS; k = k * k * strength;
              y += dir * BULGE * k;
            }
          }
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
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
    hero.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') { point(e); strength = 1; target = 1; } }); // tap = instant part
    hero.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') target = 0; });
    hero.addEventListener('pointercancel', function () { target = 0; });
    window.addEventListener('scroll', function () { dirty = true; }, { passive: true });
    window.addEventListener('resize', function () { resize(); start(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        start();
      }, { threshold: 0.02 }).observe(hero);
    }
    resize();
    start();
  }

  initHero();
  initReveals();
  initTilt();
  initProgress();
  initDemos();
  initHeroLines();
})();
