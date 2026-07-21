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
    });
})();
