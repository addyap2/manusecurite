(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add('is-ready'); });
  });

  /* ---------- Reveals & hairlines ---------- */
  var revealables = document.querySelectorAll('[data-reveal], [data-draw]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Manifesto: split into words ---------- */
  var manifesto = document.querySelector('[data-scrub]');
  var words = [];
  if (manifesto) {
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span');
            s.className = 'w'; s.textContent = part;
            frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          split(child);
        }
      });
    })(manifesto);
  }

  /* ---------- Scroll-driven: clock, dawn, parallax, manifesto, litany ---------- */
  var clock = document.getElementById('clock');
  var prologue = document.getElementById('prologue');
  var rail = document.querySelector('.rail');
  var litany = Array.prototype.slice.call(document.querySelectorAll('.litany li'));
  var START = 21 * 60 + 47;           // 21:47
  var END = 24 * 60 + 6 * 60 + 12;    // 06:12 the next morning
  var ticking = false;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function smooth(a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    var max = Math.max(1, document.documentElement.scrollHeight - vh);
    var p = clamp(y / max, 0, 1);

    var mins = Math.round(START + p * (END - START)) % 1440;
    if (clock) clock.textContent = pad(Math.floor(mins / 60)) + ':' + pad(mins % 60);

    root.style.setProperty('--dawn', smooth(0.82, 1, p).toFixed(3));
    root.style.setProperty('--bridge-bg', y > 40 ? '1' : '0');
    if (rail) rail.classList.toggle('on-prologue', y < vh * 0.6);

    if (reduce) return;

    if (y < vh * 1.2) root.style.setProperty('--py', y.toFixed(1));

    if (words.length) {
      var r = manifesto.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        var prog = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.25), 0, 1);
        var lit = prog * (words.length + 4);
        for (var i = 0; i < words.length; i++) {
          words[i].style.setProperty('--o', (0.16 + 0.84 * clamp(lit - i, 0, 1)).toFixed(2));
        }
      }
    }

    if (litany.length) {
      var mid = vh / 2;
      litany.forEach(function (li) {
        var b = li.getBoundingClientRect();
        if (b.bottom < -100 || b.top > vh + 100) return;
        var d = Math.abs(b.top + b.height / 2 - mid) / (vh * 0.32);
        var l = 1 - clamp(d, 0, 1);
        li.style.setProperty('--lit', l.toFixed(3));
        li.classList.toggle('lit', l > 0.82);
      });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---------- Chapter rail ---------- */
  var links = {};
  document.querySelectorAll('.rail a').forEach(function (a) { links[a.dataset.chapter] = a; });
  if ('IntersectionObserver' in window) {
    var chapterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        var a = links[e.target.dataset.chapter];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[data-chapter]').forEach(function (s) { chapterIO.observe(s); });
  }

  /* ---------- Le Phare: the hero engine ----------
     One loop drives the beam (pointer-steered, with inertia), the dust that
     only shows inside the light, the risk words it reveals, and the sea. */
  var hero = document.getElementById('prologue');
  var beamEl = document.getElementById('beam');
  var lampEl = document.getElementById('lamp');
  var starsEl = hero && hero.querySelector('.stars');
  var dustC = document.getElementById('dust');
  var seaC = document.getElementById('sea');
  var cta = document.getElementById('hero-cta');
  var riskEls = Array.prototype.slice.call(document.querySelectorAll('#risks li'));
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hero && seaC && seaC.getContext) {
    var dctx = dustC.getContext('2d');
    var sctx = seaC.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, lamp = { x: 0, y: 0 }, risks = [], rows = [], dust = [];
    var SW = 0, SH = 0, seaLampX = 0;
    var cur = -84, target = -40, pointerAngle = -40, lastInput = -1e9;
    var ctaOn = false, hintShown = false, hintDone = false;
    var par = { x: 0, y: 0, tx: 0, ty: 0 };
    var t0 = performance.now(), lastFrame = t0, lastSea = 0, running = false;

    var deg = 180 / Math.PI;
    function angleTo(x, y) { return Math.atan2(x - lamp.x, -(y - lamp.y)) * deg; }
    function aDiff(a, b) { var d = a - b; while (d > 180) d -= 360; while (d < -180) d += 360; return d; }

    function layout() {
      var hr = hero.getBoundingClientRect();
      W = hr.width; H = hr.height;
      var lr = lampEl.getBoundingClientRect();
      lamp.x = lr.left - hr.left; lamp.y = lr.top - hr.top;

      risks = riskEls.filter(function (el) { return el.offsetParent !== null; }).map(function (el) {
        var r = el.getBoundingClientRect();
        var x = r.left + r.width / 2 - hr.left, y = r.top + r.height / 2 - hr.top;
        return { el: el, ang: angleTo(x, y), seen: el.classList.contains('seen'), o: -1 };
      });

      dustC.width = Math.round(W * dpr); dustC.height = Math.round(H * dpr);
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = W < 700 ? 70 : 150;
      dust = [];
      for (var i = 0; i < n; i++) {
        dust.push({
          x: Math.random() * W, y: Math.random() * lamp.y,
          vx: (Math.random() - .5) * 6, vy: -2 - Math.random() * 5,
          s: .6 + Math.random() * 1.6, a: .35 + Math.random() * .65, ph: Math.random() * 6.28
        });
      }

      SW = seaC.clientWidth; SH = seaC.clientHeight;
      seaC.width = Math.round(SW * dpr); seaC.height = Math.round(SH * dpr);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seaLampX = lamp.x;
      rows = [];
      var nr = W < 700 ? 16 : 24;
      for (var j = 1; j <= nr; j++) {
        var t = j / nr, dashes = [], gap = 6 + t * 26;
        for (var x = -20; x < SW + 20; x += gap * (0.6 + Math.random() * 0.8)) {
          dashes.push({ x: x, len: (2 + Math.random() * 10) * (0.5 + t), ph: Math.random() * 6.28 });
        }
        rows.push({ y: Math.pow(t, 1.7) * SH, t: t, dashes: dashes });
      }
    }

    function drawSea(s, glow) {
      sctx.clearRect(0, 0, SW, SH);
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r], spread = 18 + row.t * 160, drift = Math.sin(s * 0.4 + r) * 6 * row.t;
        for (var j = 0; j < row.dashes.length; j++) {
          var d = row.dashes[j], x = d.x + drift, dx = (x - seaLampX) / spread;
          var reflect = Math.exp(-dx * dx) * glow;
          var flicker = 0.5 + 0.5 * Math.sin(s * 1.6 + d.ph + r * 0.7);
          var a = (0.035 + 0.05 * row.t) * (0.4 + flicker) + reflect * (0.25 + 0.55 * flicker) * (1 - row.t * 0.35);
          if (a < 0.02) continue;
          sctx.fillStyle = 'rgba(236,213,155,' + Math.min(a, 0.9).toFixed(3) + ')';
          var len = d.len * (1 + reflect * 1.4);
          sctx.fillRect(x - len / 2, row.y, len, row.t > 0.6 ? 1.2 : 1);
        }
      }
    }

    function autoAngle(s) { return -20 + 54 * Math.sin(s * 0.3 - 1.25); }

    function frame(now) {
      if (!running) return;
      var dt = Math.min(64, now - lastFrame); lastFrame = now;
      var s = (now - t0) / 1000;
      var scrollP = clamp((window.scrollY || 0) / (H * 0.85), 0, 1);

      // Aim: CTA > pointer (for 4s after last input) > slow automatic sweep
      if (ctaOn) {
        var hr = hero.getBoundingClientRect(), cr = cta.getBoundingClientRect();
        target = angleTo(cr.left + cr.width / 2 - hr.left, cr.top + cr.height / 2 - hr.top);
      } else if (now - lastInput < 4000) {
        target = pointerAngle;
      } else {
        target = autoAngle(s);
      }
      var k = 1 - Math.pow(1 - (ctaOn ? 0.09 : 0.06), dt / 16.7);
      cur += (target - cur) * k;

      var shown = cur + ((cur < 0 ? -86 : 86) - cur) * scrollP * 0.85;   // the beam lowers as you scroll
      var power = smooth(0.8, 2.3, s) * (1 - scrollP * 0.9);
      beamEl.style.transform = 'rotate(' + shown.toFixed(2) + 'deg)';
      beamEl.style.opacity = power.toFixed(3);
      lampEl.style.transform = 'scale(' + (1 - scrollP * 0.5).toFixed(3) + ')';

      // Pointer parallax on the stars
      par.x += (par.tx - par.x) * 0.05; par.y += (par.ty - par.y) * 0.05;
      if (starsEl) starsEl.style.transform = 'translate3d(' + (par.x * -10).toFixed(2) + 'px,' + (par.y * -6 - (window.scrollY || 0) * 0.12).toFixed(2) + 'px,0)';

      // Risks lit by the beam; once seen, they keep a faint trace and a ✦
      for (var i = 0; i < risks.length; i++) {
        var rk = risks[i], dd = aDiff(shown, rk.ang) / 6.5;
        var lit = Math.exp(-dd * dd) * power;
        if (lit > 0.55 && !rk.seen) { rk.seen = true; rk.el.classList.add('seen'); }
        var o = Math.max(lit, rk.seen ? 0.2 * (1 - scrollP) : 0);
        if (Math.abs(o - rk.o) > 0.01) { rk.el.style.opacity = o.toFixed(2); rk.o = o; }
      }

      // Dust in suspension, visible only inside the light
      dctx.clearRect(0, 0, W, H);
      if (power > 0.02) {
        var reach = Math.max(W, H) * 0.95, sec = dt / 1000;
        for (var j = 0; j < dust.length; j++) {
          var p = dust[j];
          p.x += p.vx * sec; p.y += p.vy * sec;
          if (p.y < -5) { p.y = lamp.y; p.x = Math.random() * W; }
          if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
          var dx = p.x - lamp.x, dy = p.y - lamp.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var da = aDiff(shown, Math.atan2(dx, -dy) * deg) / 9;
          var inBeam = Math.exp(-da * da);
          var a = inBeam * (1 - dist / reach) * power * p.a * (0.55 + 0.45 * Math.sin(s * 2 + p.ph));
          if (a < 0.03) continue;
          dctx.fillStyle = 'rgba(255,240,205,' + Math.min(a, 0.95).toFixed(3) + ')';
          dctx.fillRect(p.x, p.y, p.s, p.s);
        }
      }

      if (now - lastSea > 33) { drawSea(s, 0.4 + 0.6 * smooth(0.3, 1.6, s)); lastSea = now; }

      if (finePointer && !hintShown && !hintDone && s > 2.4) { hintShown = true; hero.classList.add('show-hint'); }

      requestAnimationFrame(frame);
    }

    function aim(clientX, clientY) {
      var hr = hero.getBoundingClientRect();
      var x = clientX - hr.left, y = clientY - hr.top;
      pointerAngle = clamp(angleTo(x, Math.min(y, lamp.y - 10)), -84, 84);
      lastInput = performance.now();
      par.tx = x / W - 0.5; par.ty = y / H - 0.5;
      if (!hintDone) { hintDone = true; hero.classList.remove('show-hint'); }
    }

    layout();

    if (reduce) {
      drawSea(0, 1);
    } else {
      hero.addEventListener('pointermove', function (e) { aim(e.clientX, e.clientY); });
      hero.addEventListener('pointerdown', function (e) { aim(e.clientX, e.clientY); });
      if (cta) {
        var on = function () { ctaOn = true; }, off = function () { ctaOn = false; };
        cta.addEventListener('pointerenter', on); cta.addEventListener('pointerleave', off);
        cta.addEventListener('focus', on); cta.addEventListener('blur', off);
        cta.addEventListener('pointermove', function (e) {
          var r = cta.getBoundingClientRect();
          cta.style.setProperty('--sx', (e.clientX - r.left) + 'px');
          cta.style.setProperty('--sy', (e.clientY - r.top) + 'px');
        });
      }

      var start = function () { if (!running) { running = true; lastFrame = performance.now(); requestAnimationFrame(frame); } };
      var heroVisible = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          heroVisible = entries[0].isIntersecting;
          if (heroVisible && !document.hidden) start(); else running = false;
        }).observe(hero);
      } else { start(); }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) running = false; else if (heroVisible) start();
      });
    }

    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { layout(); if (reduce) drawSea(0, 1); }, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  }

  /* ---------- Contact ---------- */
  var form = document.getElementById('contact-form');
  document.querySelectorAll('[data-profil]').forEach(function (a) {
    a.addEventListener('click', function () {
      var radio = form.querySelector('input[value="' + a.dataset.profil + '"]');
      if (radio) radio.checked = true;
    });
  });

  var errorEl = form.querySelector('.form-error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nom = form.nom.value.trim();
    var coord = form.coord.value.trim();
    form.nom.setAttribute('aria-invalid', String(!nom));
    form.coord.setAttribute('aria-invalid', String(!coord));
    if (!nom || !coord) {
      errorEl.hidden = false;
      (nom ? form.coord : form.nom).focus();
      return;
    }
    errorEl.hidden = true;
    var profil = form.querySelector('input[name="profil"]:checked').value;
    var subject = 'Demande de contact (' + profil + ') : ' + nom;
    var body = 'Nom : ' + nom + '\nProfil : ' + profil + '\nContact : ' + coord + '\n\n' + form.message.value.trim();
    window.location.href = 'mailto:providencecotedazur@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
