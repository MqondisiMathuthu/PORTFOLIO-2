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