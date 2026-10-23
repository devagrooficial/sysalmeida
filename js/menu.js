// Menu sanduíche (celular): abre e fecha a navegação principal.
(function () {
  var header = document.querySelector('.header');
  var btn = header && header.querySelector('.burger');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;

  function set(open) {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  btn.addEventListener('click', function () { set(!header.classList.contains('menu-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) { set(false); btn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('menu-open') && !header.contains(e.target)) set(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (m) { if (m.matches) set(false); });
})();
