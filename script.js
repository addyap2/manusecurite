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

  /* ---------- The sea: shimmering dashes, the lamp reflected ---------- */
  var canvas = document.getElementById('sea');
  var beam = document.querySelector('.beam');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, lampX = 0, rows = [];
    var running = false, last = 0;

    function layout() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lampX = beam ? parseFloat(getComputedStyle(beam).left) || W * 0.72 : W * 0.72;
      rows = [];
      var n = W < 700 ? 16 : 24;
      for (var i = 1; i <= n; i++) {
        var t = i / n;
        var dashes = [];
        var gap = 6 + t * 26;
        for (var x = -20; x < W + 20; x += gap * (0.6 + Math.random() * 0.8)) {
          dashes.push({ x: x, len: (2 + Math.random() * 10) * (0.5 + t), ph: Math.random() * 6.28 });
        }
        rows.push({ y: Math.pow(t, 1.7) * H, t: t, dashes: dashes });
      }
    }

    function draw(time) {
      var s = time / 1000;
      ctx.clearRect(0, 0, W, H);
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        var spread = 18 + row.t * 160;           // reflection widens towards the viewer
        var drift = Math.sin(s * 0.4 + r) * 6 * row.t;
        for (var j = 0; j < row.dashes.length; j++) {
          var d = row.dashes[j];
          var x = d.x + drift;
          var dx = (x - lampX) / spread;
          var reflect = Math.exp(-dx * dx);
          var flicker = 0.5 + 0.5 * Math.sin(s * 1.6 + d.ph + r * 0.7);
          var a = (0.035 + 0.05 * row.t) * (0.4 + flicker) + reflect * (0.25 + 0.55 * flicker) * (1 - row.t * 0.35);
          if (a < 0.02) continue;
          ctx.fillStyle = 'rgba(236,213,155,' + Math.min(a, 0.9).toFixed(3) + ')';
          var len = d.len * (1 + reflect * 1.4);
          ctx.fillRect(x - len / 2, row.y, len, row.t > 0.6 ? 1.2 : 1);
        }
      }
    }

    function loop(time) {
      if (!running) return;
      if (time - last > 33) { draw(time); last = time; }   // ~30 fps is enough for water
      requestAnimationFrame(loop);
    }

    layout();
    draw(0);
    window.addEventListener('resize', function () { layout(); draw(performance.now()); });

    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var vis = entries[0].isIntersecting;
        if (vis && !running) { running = true; requestAnimationFrame(loop); }
        if (!vis) running = false;
      }).observe(prologue);
    }
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
