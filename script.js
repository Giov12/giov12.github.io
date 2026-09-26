/* Small helpers for the page. No libraries. Safe to leave as-is. */

/* --- Dark / light toggle (remembers the choice in this browser) --- */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  function paint() { btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☀' : '☾'; }
  paint();
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paint();
  });
})();

/* --- Mobile menu --- */
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }
  });
})();

/* --- Highlight the nav link for the section you are reading --- */
(function () {
  var links = document.querySelectorAll('.site-nav a');
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
})();

/* --- Publication filters: built from the data-tag on each post card --- */
(function () {
  var box = document.getElementById('pubFilters');
  var cards = document.querySelectorAll('#pubCards .card');
  if (!box || !cards.length) return;
  var tags = [];
  cards.forEach(function (c) { var t = c.dataset.tag; if (t && tags.indexOf(t) < 0) tags.push(t); });
  if (tags.length < 2) return;                    // no point filtering one tag
  ['All'].concat(tags).forEach(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'filter' + (i === 0 ? ' active' : ''); b.textContent = t;
    b.addEventListener('click', function () {
      box.querySelectorAll('.filter').forEach(function (x) { x.classList.toggle('active', x === b); });
      cards.forEach(function (c) { c.hidden = !(t === 'All' || c.dataset.tag === t); });
    });
    box.appendChild(b);
  });
})();

/* --- Footer year --- */
document.getElementById('year').textContent = new Date().getFullYear();

/* --- "Last updated" date: read from the server's Last-Modified header.
       On GitHub Pages that is when the site was last published. If the header
       is missing (e.g. opening the file directly), the date typed in
       index.html is left alone. --- */
(function () {
  var el = document.getElementById('lastUpdated');
  if (!el || !window.fetch) return;
  fetch(location.href, { method: 'HEAD' })
    .then(function (r) { return r.headers.get('Last-Modified'); })
    .then(function (h) {
      var d = h && new Date(h);
      if (d && !isNaN(d) && d.getFullYear() >= 2020) {
        el.textContent = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    })
    .catch(function () {});
})();
