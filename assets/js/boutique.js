// Boutique : galerie produit et barre d'achat collante sur mobile.
(function () {
  var g = document.querySelector('[data-gallery]');
  if (g) {
    var main = g.querySelector('[data-main]');
    g.querySelectorAll('.pf-thumb').forEach(function (b) {
      b.addEventListener('click', function () {
        main.src = b.getAttribute('data-src');
        g.querySelectorAll('.pf-thumb').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });
  }
  var bar = document.querySelector('.pf-sticky-buy');
  var box = document.querySelector('.pf-buybox');
  if (bar && box) {
    var maj = function () {
      var show = box.getBoundingClientRect().bottom < 0;
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    };
    window.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
    maj();
  }
  document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { if (window.gtag) window.gtag('event', 'begin_checkout', { page: location.pathname }); } catch (e) {}
    });
  });
})();
