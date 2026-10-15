// Lógica da Proposta 164: preenche os valores (calculados a partir de dados.js) e controla as abas.
(function () {
  var P = window.PROPOSTA;
  var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var BRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var money = function (n) { return BRL.format(n); };
  var money0 = function (n) { return BRL0.format(Math.round(n)); };
  var sum = function (a) { return a.reduce(function (s, x) { return s + x; }, 0); };

  // ---------- datas ----------
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function longDate(d) { return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  var emissao = parseISO(P.data);
  var validade = new Date(emissao); validade.setDate(validade.getDate() + P.validadeDias);

  // ---------- contas ----------
  var fixo = P.manutencaoMensal + P.servidorMensal;               // custo mensal comum
  var C = P.compra, L = P.licenca, B = P.bitrix24;
  if (sum(C.parcelas) + C.entrada !== C.desenvolvimento) console.warn('Compra: entrada + parcelas não fecham com o valor de desenvolvimento.');
  if (sum(L.parcelas) + L.entrada !== L.aporte) console.warn('Licença: entrada + parcelas não fecham com o aporte.');

  var compraTotal = function (m) { return C.desenvolvimento + m * fixo; };
  var licencaMensal = L.licencaMensal + fixo;
  var licencaTotal = function (m) { return L.aporte + m * licencaMensal; };
  var licencaAnualAntecip = L.licencaMensal * 12 * (1 - L.descontoAnualAntecipado);
  var meses = P.mesesContrato;
  var viradaMes = Math.ceil((C.desenvolvimento - L.aporte) / L.licencaMensal);

  var V = {
    'numero': P.numero,
    'cliente': P.cliente,
    'referencia': P.referencia,
    'dataEmissao': longDate(emissao),
    'dataValidade': longDate(validade),
    'validadeDias': String(P.validadeDias),
    'manutencaoMensal': money(P.manutencaoMensal),
    'servidorMensal': money(P.servidorMensal),
    'contato.nome': P.contato.nome,
    'compra.desenvolvimento': money(C.desenvolvimento),
    'compra.entrada': money(C.entrada),
    'compra.p1': money(C.parcelas[0]), 'compra.p2': money(C.parcelas[1]), 'compra.p3': money(C.parcelas[2]),
    'compra.total12': money(compraTotal(meses)),
    'compra.mensalPos': money(fixo),
    'compra.ano2': money(fixo * 12),
    'licenca.aporte': money(L.aporte),
    'licenca.entrada': money(L.entrada),
    'licenca.p1': money(L.parcelas[0]), 'licenca.p2': money(L.parcelas[1]), 'licenca.p3': money(L.parcelas[2]),
    'licenca.licencaMensal': money(L.licencaMensal),
    'licenca.mensal': money(licencaMensal),
    'licenca.total12': money(licencaTotal(meses)),
    'licenca.total12Anual': money(L.aporte + licencaAnualAntecip + fixo * 12),
    'licenca.usuariosIncluidos': String(L.usuariosIncluidos),
    'licenca.desconto': Math.round(L.descontoAnualAntecipado * 100) + '%',
  };
  document.querySelectorAll('[data-v]').forEach(function (el) {
    var k = el.getAttribute('data-v');
    if (k in V) el.textContent = V[k]; else console.warn('Chave sem valor:', k);
  });

  // ---------- contatos ----------
  var waMsg = 'Olá, ' + P.contato.nome.split(' ')[0] + '! Vi a Proposta ' + P.numero + ' e quero conversar.';
  var waUrl = 'https://wa.me/' + P.contato.whatsapp + '?text=' + encodeURIComponent(waMsg);
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = waUrl; });
  document.querySelectorAll('[data-mail]').forEach(function (a) {
    a.href = 'mailto:' + P.contato.email + '?subject=' + encodeURIComponent('Proposta ' + P.numero);
    a.textContent = P.contato.email;
  });

  // ---------- tabelas ----------
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var tbF = document.querySelector('#tbl-func tbody');
  P.funcionalidades.forEach(function (f, i) {
    var tr = el('tr');
    tr.innerHTML = '<td data-label="#">' + (i + 1) + '</td><td data-label="Módulo"><strong>' + f[0] + '</strong></td><td data-label="O que faz">' + f[1] + '</td><td data-label="Entrega"><span class="chip">' + f[2] + '</span></td>';
    tbF.appendChild(tr);
  });

  var D = P.dimensionamento;
  var dimItems = [
    [D.usuariosPrevistos, 'usuários previstos', D.usuariosEquipe + ' da equipe + até ' + D.usuariosEnergisa + ' da Energisa. Capacidade para ' + L.usuariosIncluidos + '.'],
    [D.documentos, 'documentos', D.documentosProjeto + ' de projeto + ' + D.documentosFabricantes + ' de fabricantes'],
    [D.emissoesAno.toLocaleString('pt-BR'), 'emissões no ano', 'Média de 3 revisões por documento'],
    [D.grdsAno + ' + ' + D.atasAno, 'GRDs e atas no ano', D.grdsAno + ' GRDs e ' + D.atasAno + ' atas de reunião'],
    ['até ' + D.armazenamentoGB + ' GB', 'de arquivos', 'Numa VPS dedicada, com folga para crescer'],
  ];
  var dim = document.getElementById('dim');
  dimItems.forEach(function (d) { dim.appendChild(el('div', 'dim', '<b>' + d[0] + '</b><span>' + d[1] + '</span><small>' + d[2] + '</small>')); });

  // linha do tempo
  var tl = document.getElementById('timeline');
  P.cronograma.forEach(function (m, i) {
    var parcela = m.parcela ? '<span class="parc">' + m.parcela + 'ª parcela · ' + money(L.parcelas[m.parcela - 1]) + ' <em>(licença)</em> ou ' + money(C.parcelas[m.parcela - 1]) + ' <em>(compra)</em></span>' : '';
    var li = el('li', m.destaque ? 'tl--hl' : '', '<div class="tl__dia"><small>Dia</small><b>' + m.dia + '</b></div><div class="tl__body"><h3>' + m.titulo + '</h3><p>' + m.texto + '</p>' + parcela + '</div>');
    tl.appendChild(li);
  });
  var last = P.cronograma[P.cronograma.length - 1].dia;
  tl.appendChild(el('li', 'tl--end', '<div class="tl__dia"><small>Depois do</small><b>' + last + '</b></div><div class="tl__body"><h3>Melhorias contínuas</h3><p>Manutenção mensal enquanto a plataforma estiver em uso.</p></div>'));

  // compra x licença
  var tbC = document.querySelector('#tbl-comp tbody');
  [12, 24, 36].forEach(function (m) {
    var c = compraTotal(m), l = licencaTotal(m), d = l - c;
    var dif = d > 0 ? '<span class="pos">Compra economiza ' + money(d) + '</span>' : '<span class="neg">Licença economiza ' + money(-d) + '</span>';
    var tr = el('tr', '', '<td data-label="Período"><strong>' + m + ' meses</strong></td><td data-label="Compra">' + money(c) + '</td><td data-label="Licença">' + money(l) + '</td><td data-label="Diferença">' + dif + '</td>');
    tbC.appendChild(tr);
  });
  document.getElementById('virada').innerHTML = 'A licença custa menos no 1º ano; a compra compensa a partir do <strong>mês ' + viradaMes + '</strong>, já no 2º ano.';

  // Bitrix24
  var usd = function (u) { return 'US$ ' + u + ' (≈ ' + money0(u * B.cotacaoDolar) + ')'; };
  var rows = [
    ['Preço mensal (plano mensal)', money0(L.licencaMensal) + ' de licença, em real', usd(B.professionalMensalUSD), usd(B.enterpriseMensalUSD)],
    ['Plano anual antecipado (por mês)', money0(L.licencaMensal * (1 - L.descontoAnualAntecipado)) + ', em real', usd(B.professionalAnualUSD), usd(B.enterpriseAnualUSD)],
    ['Cobrança', 'Real, valor fixo', 'Dólar, varia com o câmbio', 'Dólar, varia com o câmbio'],
    ['Usuários incluídos', 'até ' + L.usuariosIncluidos, 'até 100', '250 ou mais'],
    ['GRD nativa', 'Sim', 'Não (precisa adaptar)', 'Não (precisa adaptar)'],
    ['Revisões 0, A, B e lista mestra', 'Sim', 'Não', 'Não'],
    ['Onde ficam os dados', 'VPS dedicada no Brasil', 'EUA ou Alemanha', 'EUA ou Alemanha'],
    ['Histórico de acesso / criptografia em repouso', 'Sim', 'Não', 'Sim'],
    ['Suporte', 'Direto com quem desenvolveu, por WhatsApp', 'Central de ajuda', 'Suporte prioritário'],
    ['Ajustes sob medida', 'Sim, incluídos na evolução quinzenal', 'Não', 'Não'],
  ];
  var tbB = document.querySelector('#tbl-bx tbody');
  rows.forEach(function (r) {
    tbB.appendChild(el('tr', '', '<th scope="row">' + r[0] + '</th><td data-label="SyS Almeida" class="us">' + r[1] + '</td><td data-label="Bitrix24 Professional">' + r[2] + '</td><td data-label="Bitrix24 Enterprise">' + r[3] + '</td>'));
  });
  document.getElementById('bx-note').textContent = 'Preços públicos do Bitrix24 consultados em ' + B.consultadoEm + ' em bitrix24.com/prices, dólar a ' + BRL.format(B.cotacaoDolar) + '.';

  // ---------- abas ----------
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var ids = panels.map(function (p) { return p.id.replace(/^p-/, ''); });
  var tabsEl = document.getElementById('tabs');
  var bar = document.getElementById('bar');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = -1;

  panels.forEach(function (p, i) {
    var id = ids[i];
    var t = el('button', 'tab', '<b>' + (i + 1) + '</b><span>' + p.getAttribute('data-title') + '</span>');
    t.type = 'button'; t.id = 'tab-' + id; t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', p.id); t.setAttribute('aria-selected', 'false'); t.tabIndex = -1;
    t.addEventListener('click', function () { go(i, true); });
    tabsEl.appendChild(t);
    p.setAttribute('aria-labelledby', t.id); p.hidden = true;

    // rodapé de navegação do painel
    var nav = el('div', 'pnav');
    if (i > 0) {
      var back = el('a', 'pnav__back', '← Voltar'); back.href = '#' + ids[i - 1];
      back.addEventListener('click', function (e) { e.preventDefault(); go(i - 1, true); });
      nav.appendChild(back);
    }
    if (i < panels.length - 1) {
      var nx = el('a', 'btn btn--primary btn--lg', 'Próxima etapa: ' + panels[i + 1].getAttribute('data-title') + ' →'); nx.href = '#' + ids[i + 1];
      nx.addEventListener('click', function (e) { e.preventDefault(); go(i + 1, true); });
      nav.appendChild(nx);
    }
    p.appendChild(nav);
    // cabeçalho só para impressão
    var ph = el('div', 'print-head', '<img src="/images/logo.png" alt="SyS Almeida"><span>Proposta nº ' + P.numero + ' · ' + p.getAttribute('data-title') + '</span>');
    p.insertBefore(ph, p.firstChild);
  });

  function go(i, scroll, replace) {
    if (i < 0 || i >= panels.length) i = 0;
    if (i === current) { if (scroll) toTop(); return; }
    current = i;
    panels.forEach(function (p, k) {
      p.hidden = k !== i;
      var t = tabsEl.children[k];
      t.setAttribute('aria-selected', k === i ? 'true' : 'false');
      t.tabIndex = k === i ? 0 : -1;
      t.classList.toggle('done', k < i);
    });
    bar.style.width = ((i + 1) / panels.length * 100) + '%';
    var h = '#' + ids[i];
    if (location.hash !== h) { if (replace) history.replaceState(null, '', h); else history.pushState(null, '', h); }
    var active = tabsEl.children[i];
    if (active.scrollIntoView) { try { tabsEl.scrollTo({ left: active.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' }); } catch (e) {} }
    if (scroll) toTop();
  }
  function toTop() {
    var top = document.getElementById('main').getBoundingClientRect().top + window.scrollY - document.querySelector('.top').offsetHeight - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  }
  function fromHash() {
    var i = ids.indexOf(location.hash.replace('#', ''));
    go(i < 0 ? 0 : i, false, true);
  }

  tabsEl.addEventListener('keydown', function (e) {
    var k = e.key, i = current;
    if (k === 'ArrowRight') i = (i + 1) % panels.length;
    else if (k === 'ArrowLeft') i = (i - 1 + panels.length) % panels.length;
    else if (k === 'Home') i = 0;
    else if (k === 'End') i = panels.length - 1;
    else return;
    e.preventDefault(); go(i, false); tabsEl.children[i].focus();
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-go]'); if (!a) return;
    e.preventDefault(); go(ids.indexOf(a.getAttribute('data-go')), true);
  });
  window.addEventListener('hashchange', fromHash);
  document.getElementById('pdf').addEventListener('click', function () { window.print(); });

  // Na impressão, todos os painéis aparecem em sequência (o CSS cuida do resto).
  window.addEventListener('beforeprint', function () { panels.forEach(function (p) { p.hidden = false; }); });
  window.addEventListener('afterprint', function () { var c = current; current = -1; go(c, false, true); });

  fromHash();
})();
