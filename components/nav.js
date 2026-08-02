(function () {
  var mount = document.getElementById('nav-mount');
  if (!mount) return;

  fetch('/components/nav.html')
    .then(function (res) { return res.text(); })
    .then(function (html) {
      mount.outerHTML = html;

      var path = window.location.pathname.replace(/index\.html$/, '') || '/';
      document.querySelectorAll('.site-nav a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (/^https?:\/\//.test(href)) return;
        var normalized = href.replace(/index\.html$/, '') || '/';
        if (normalized === path) {
          a.setAttribute('aria-current', 'page');
        }
      });

      // Click-to-toggle dropdown menus (e.g. "Creative Works").
      document.querySelectorAll('.nav-dropdown').forEach(function (drop) {
        var toggle = drop.querySelector('.nav-dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = drop.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      });

      document.addEventListener('click', function () {
        document.querySelectorAll('.nav-dropdown.is-open').forEach(function (drop) {
          drop.classList.remove('is-open');
          drop.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        document.querySelectorAll('.nav-dropdown.is-open').forEach(function (drop) {
          drop.classList.remove('is-open');
          drop.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
        });
      });
    });
})();
