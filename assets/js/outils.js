// Calculateurs gratuits Domtom Connect. Aucun innerHTML : uniquement textContent.
(function () {
  function num(el) { var v = parseFloat(String(el.value).replace(',', '.')); return isNaN(v) ? 0 : v; }
  function fmt(n, lang) {
    try { return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR', { maximumFractionDigits: 0 }).format(Math.round(n)); }
    catch (e) { return String(Math.round(n)); }
  }

  // 1. Commissions des plateformes de réservation
  var c = document.querySelector('[data-calc="commissions"]');
  if (c) {
    var lang = c.getAttribute('data-lang') || 'fr';
    var cur = c.querySelector('[name="devise"]');
    var inputs = c.querySelectorAll('input, select');
    var out = {
      an: c.querySelector('[data-out="an"]'), mois: c.querySelector('[data-out="mois"]'),
      gain: c.querySelector('[data-out="gain"]'), ca: c.querySelector('[data-out="ca"]')
    };
    function calc() {
      var prix = num(c.querySelector('[name="prix"]'));
      var nuits = num(c.querySelector('[name="nuits"]'));
      var part = Math.min(100, num(c.querySelector('[name="part"]'))) / 100;
      var com = Math.min(100, num(c.querySelector('[name="commission"]'))) / 100;
      var direct = Math.min(100, num(c.querySelector('[name="direct"]'))) / 100;
      var ca = prix * nuits;
      var perte = ca * part * com;
      var gain = perte * direct;
      var d = ' ' + (cur ? cur.value : '€');
      out.ca.textContent = fmt(ca, lang) + d;
      out.an.textContent = fmt(perte, lang) + d;
      out.mois.textContent = fmt(perte / 12, lang) + d;
      out.gain.textContent = fmt(gain, lang) + d;
    }
    inputs.forEach(function (i) { i.addEventListener('input', calc); i.addEventListener('change', calc); });
    calc();
  }

  // 2. Prix plancher
  var p = document.querySelector('[data-calc="prix"]');
  if (p) {
    var o = { plancher: p.querySelector('[data-out="plancher"]'), ventes: p.querySelector('[data-out="ventes"]'), heure: p.querySelector('[data-out="heure"]') };
    function calc2() {
      var fixes = num(p.querySelector('[name="fixes"]'));
      var salaire = num(p.querySelector('[name="salaire"]'));
      var unitaire = num(p.querySelector('[name="unitaire"]'));
      var volume = Math.max(1, num(p.querySelector('[name="volume"]')));
      var heures = Math.max(1, num(p.querySelector('[name="heures"]')));
      var prix = num(p.querySelector('[name="prixvise"]'));
      var plancher = unitaire + (fixes + salaire) / volume;
      var marge = prix - unitaire;
      o.plancher.textContent = fmt(plancher, 'fr') + ' €';
      o.ventes.textContent = marge > 0 ? fmt(Math.ceil((fixes + salaire) / marge), 'fr') : '—';
      o.heure.textContent = fmt((fixes + salaire) / heures, 'fr') + ' €';
    }
    p.querySelectorAll('input').forEach(function (i) { i.addEventListener('input', calc2); });
    calc2();
  }
})();
