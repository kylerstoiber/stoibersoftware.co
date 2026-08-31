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

  initHero();
  initReveals();
  initTilt();
  initProgress();
  initDemos();
})();
