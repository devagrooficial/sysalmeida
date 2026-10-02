// Consentimento de cookies (LGPD). A escolha fica salva só no navegador (localStorage).
// Hoje o site não usa cookies de análise ou publicidade; o banner já está pronto para quando houver.
// Para ativar ferramentas opcionais no futuro: ouça o evento "sys-consent" ou leia window.sysConsent.
(function () {
  var KEY = 'sys_cookie_consent', VERSION = 1;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      return v && v.v === VERSION ? v : null;
    } catch (e) { return null; }
  }
  function save(optional) {
    var v = { v: VERSION, optional: !!optional, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    publish(v);
  }
  function publish(v) {
    window.sysConsent = v;
    document.dispatchEvent(new CustomEvent('sys-consent', { detail: v }));
  }

  var banner;
  function build() {
    banner = document.createElement('div');
    banner.className = 'cookie';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    banner.innerHTML =
      '<p class="cookie__text"><strong>Sua privacidade importa.</strong> Usamos apenas o essencial para o site funcionar. ' +
      'Cookies opcionais, se existirem, só com a sua permissão. ' +
      '<a href="cookies.html">Política de Cookies</a> · <a href="privacidade.html">Privacidade</a></p>' +
      '<div class="cookie__actions">' +
      '<button type="button" class="btn btn--outline btn--sm" data-c="no">Somente essenciais</button>' +
      '<button type="button" class="btn btn--primary btn--sm" data-c="yes">Aceitar todos</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var c = e.target.closest('[data-c]');
      if (!c) return;
      save(c.getAttribute('data-c') === 'yes');
      hide();
    });
    document.body.appendChild(banner);
  }
  function show() {
    if (!banner) build();
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
  }
  function hide() { if (banner) banner.classList.remove('is-open'); }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); show(); }
  });

  var saved = read();
  if (saved) publish(saved); else window.addEventListener('load', function () { setTimeout(show, 600); });
})();
