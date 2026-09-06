// Terminal hero: reveal lines one by one (skipped if user prefers reduced motion)
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lines = document.querySelectorAll('#term .term-line');

  if (reduced) {
    lines.forEach(function (l) { l.classList.add('show'); });
    return;
  }

  lines.forEach(function (l, i) {
    setTimeout(function () { l.classList.add('show'); }, 350 + i * 280);
  });
})();

// Profile photo: if profile.jpg is missing, show initials placeholder instead
(function () {
  var img = document.getElementById('profile-photo');
  var frame = img ? img.closest('.photo-frame') : null;
  if (!img || !frame) return;

  img.addEventListener('error', function () {
    frame.classList.add('no-img');
  });

  // Handle the case where the error fired before this script ran
  if (img.complete && img.naturalWidth === 0) {
    frame.classList.add('no-img');
  }
})();
