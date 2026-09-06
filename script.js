// ---------- Hero boot sequence ----------
// One orchestrated moment: type the command, then stream the output lines.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lines = document.querySelectorAll('#term .term-line');
  var cmdEl = document.querySelector('#term .cmd');
  var cmdText = cmdEl ? cmdEl.getAttribute('data-cmd') : '';

  if (reduced) {
    if (cmdEl) cmdEl.textContent = cmdText;
    lines.forEach(function (l) { l.classList.add('show'); });
    return;
  }

  // Reveal the first line (the prompt) immediately, then type the command into it.
  if (lines[0]) lines[0].classList.add('show');

  var typeCursor = document.createElement('span');
  typeCursor.className = 'type-cursor';
  if (cmdEl) cmdEl.after(typeCursor);

  var i = 0;
  function typeChar() {
    if (!cmdEl) return revealRest();
    if (i <= cmdText.length) {
      cmdEl.textContent = cmdText.slice(0, i);
      i++;
      setTimeout(typeChar, 55);
    } else {
      typeCursor.remove();
      setTimeout(revealRest, 260);
    }
  }

  function revealRest() {
    var rest = Array.prototype.slice.call(lines, 1);
    rest.forEach(function (l, n) {
      setTimeout(function () { l.classList.add('show'); }, n * 180);
    });
  }

  setTimeout(typeChar, 500);
})();

// ---------- Impact metrics: animate on scroll into view ----------
(function () {
  var section = document.getElementById('impact');
  if (!section) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CIRC = 2 * Math.PI * 52; // gauge circumference (r=52)

  function setFinal() {
    // Jump straight to final values (reduced motion or fallback)
    section.querySelectorAll('.gauge-metric').forEach(function (m) {
      var v = +m.getAttribute('data-value');
      var fill = m.querySelector('.gauge-fill');
      if (fill) fill.style.strokeDashoffset = CIRC * (1 - v / 100);
    });
    section.querySelectorAll('.count').forEach(function (c) {
      c.textContent = c.getAttribute('data-to');
    });
  }

  function animate() {
    // Gauges
    section.querySelectorAll('.gauge-metric').forEach(function (m) {
      var v = +m.getAttribute('data-value');
      var fill = m.querySelector('.gauge-fill');
      if (fill) requestAnimationFrame(function () {
        fill.style.strokeDashoffset = CIRC * (1 - v / 100);
      });
    });
    // Count-ups
    section.querySelectorAll('.count').forEach(function (c) {
      var to = +c.getAttribute('data-to');
      var dur = 1300, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        c.textContent = Math.round(to * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  if (reduced) { setFinal(); return; }

  if (!('IntersectionObserver' in window)) { animate(); return; }

  var fired = false;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !fired) {
        fired = true;
        animate();
        obs.disconnect();
      }
    });
  }, { threshold: 0.35 });
  obs.observe(section);
})();

// ---------- Mobile nav toggle ----------
(function () {
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('navlinks');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close the menu after tapping a link
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---------- Copy email to clipboard ----------
(function () {
  var btn = document.getElementById('copy-email');
  if (!btn) return;
  var label = btn.querySelector('.copy-label');
  var email = btn.getAttribute('data-email');
  var original = label.textContent;

  btn.addEventListener('click', function () {
    function done() {
      btn.classList.add('copied');
      label.textContent = 'copied to clipboard ✓';
      setTimeout(function () {
        btn.classList.remove('copied');
        label.textContent = original;
      }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done).catch(function () {
        window.location.href = 'mailto:' + email;
      });
    } else {
      window.location.href = 'mailto:' + email;
    }
  });
})();

// ---------- Profile photo fallback ----------
(function () {
  var img = document.getElementById('profile-photo');
  var frame = img ? img.closest('.photo-frame') : null;
  if (!img || !frame) return;

  img.addEventListener('error', function () { frame.classList.add('no-img'); });
  if (img.complete && img.naturalWidth === 0) frame.classList.add('no-img');
})();