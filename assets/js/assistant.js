// Assistant Domtom Connect : bouton flottant + fenêtre de discussion multilingue.
// Mode IA via /api/assistant ; si l'IA est indisponible, mode guidé (réponses préparées).
// Sécurité : aucun innerHTML, tout le texte passe par textContent, liens limités au site et aux contacts officiels.
(function () {
  if (window.__dtcAssistant) return; window.__dtcAssistant = true;
  if (!document.querySelector('link[href^="/assets/css/assistant.css"]')) { var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '/assets/css/assistant.css?v=1'; document.head.appendChild(css); }
  var lang = (document.documentElement.lang || 'fr').slice(0, 2);
  if (['fr', 'en', 'es'].indexOf(lang) === -1) lang = 'fr';
  var CAL = 'https://calendly.com/domtomconnect/30min', WA = 'https://wa.me/33620783377';
  var T = {
    fr: { btn: 'Une question ?', title: 'Assistant Domtom Connect', hello: "Bonjour ! Je peux vous orienter en quelques questions. Que cherchez-vous ?", ph: 'Écrivez votre question…', send: 'Envoyer',
          chips: [['site', 'Un site qui rapporte des clients'], ['clients', 'Trouver plus de clients'], ['projet', 'Lancer mon projet'], ['boutique', 'Les livres et outils']],
          wait: 'Je réfléchis…', err: "Je n'arrive pas à répondre pour le moment. Écrivez à Loïc sur WhatsApp ou réservez un échange offert.", close: 'Fermer', note: 'Assistant automatique. Pour un vrai conseil, réservez l’échange offert.' },
    en: { btn: 'Questions?', title: 'Domtom Connect assistant', hello: 'Hello! I can point you in the right direction in a few questions. What are you looking for?', ph: 'Type your question…', send: 'Send',
          chips: [['site', 'A website that brings customers'], ['clients', 'Find more customers'], ['projet', 'Launch my project'], ['boutique', 'Books and tools']],
          wait: 'Thinking…', err: 'I cannot answer right now. Message Loïc on WhatsApp or book a free call.', close: 'Close', note: 'Automated assistant. For real advice, book the free call.' },
    es: { btn: '¿Preguntas?', title: 'Asistente Domtom Connect', hello: '¡Hola! Puedo orientarle en pocas preguntas. ¿Qué está buscando?', ph: 'Escriba su pregunta…', send: 'Enviar',
          chips: [['site', 'Un sitio que traiga clientes'], ['clients', 'Conseguir más clientes'], ['projet', 'Lanzar mi proyecto'], ['boutique', 'Libros y herramientas']],
          wait: 'Pensando…', err: 'No puedo responder ahora. Escriba a Loïc por WhatsApp o reserve una llamada gratuita.', close: 'Cerrar', note: 'Asistente automático. Para un consejo real, reserve la llamada gratuita.' }
  }[lang];
  var GUIDE = {
    fr: { site: ["Un site qui convertit mène chaque visiteur vers une action : réserver, acheter, demander un devis ou écrire sur WhatsApp. Commencez par l'audit offert de votre présence en ligne.", 'https://domtomconnect.com/creation-site-web#audit', "Demander l'audit offert"],
          clients: ["Selon votre activité, le plus rapide est souvent de récupérer des réservations en direct, de mieux utiliser WhatsApp ou de structurer votre prospection. Parlons-en 30 minutes, c'est offert.", CAL, "Réserver l'échange offert"],
          projet: ["Pour bien démarrer, faites le diagnostic gratuit, puis calculez votre prix plancher. Le livre à 5 € reprend toute la méthode.", 'https://domtomconnect.com/anamnese', 'Faire le diagnostic gratuit'],
          boutique: ["Le livre Les Fondamentaux de l'Entrepreneur coûte 5 €, le guide interactif 27 € et le pack fondateur 47 €. Le chapitre 1 est gratuit.", 'https://domtomconnect.com/boutique', 'Voir la boutique'] },
    en: { site: ['A website that converts leads every visitor to an action: book, buy, request a quote or message you on WhatsApp. Let’s look at your situation in a free 30 minute call.', CAL, 'Book a free call'],
          clients: ['For many Caribbean businesses, the fastest win is getting more direct bookings instead of paying platform commissions. Check what platforms cost you first.', 'https://domtomconnect.com/outils/booking-commission-calculator', 'Use the free calculator'],
          projet: ['To start well, read our practical guides, then book a free call to set out your plan.', 'https://domtomconnect.com/guides', 'See the guides'],
          boutique: ['Our books and tools are in French for now. The best next step is a free call with Loïc.', CAL, 'Book a free call'] },
    es: { site: ['Un sitio que convierte lleva a cada visitante a una acción: reservar, comprar, pedir presupuesto o escribir por WhatsApp. Veamos su caso en una llamada gratuita de 30 minutos.', CAL, 'Reservar una llamada'],
          clients: ['Para muchos negocios turísticos, lo más rápido es conseguir más reservas directas. Calcule primero lo que le cuestan las plataformas.', 'https://domtomconnect.com/outils/calculadora-comisiones-reservas', 'Usar la calculadora'],
          projet: ['Para empezar bien, lea nuestras guías y reserve una llamada gratuita para definir su plan.', 'https://domtomconnect.com/guides', 'Ver las guías'],
          boutique: ['Nuestros libros y herramientas están en francés por ahora. Lo mejor es una llamada gratuita con Loïc.', CAL, 'Reservar una llamada'] }
  }[lang];

  var KEY = 'dtc-assistant-v1', hist = [], mode = 'ia';
  try { hist = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { hist = []; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(hist.slice(-12))); } catch (e) {} }
  function track(ev, p) { try { if (window.gtag) window.gtag('event', ev, p || {}); } catch (e) {} }
  function el(tag, cls, txt) { var x = document.createElement(tag); if (cls) x.className = cls; if (txt != null) x.textContent = txt; return x; }

  // Construit un texte avec liens cliquables sûrs (site, Calendly, WhatsApp uniquement)
  var LIEN = /(https:\/\/(?:www\.)?(?:domtomconnect\.com|calendly\.com\/domtomconnect|wa\.me\/33620783377)[^\s)\]]*)/g;
  function rich(node, text) {
    String(text).split('\n').forEach(function (line, i) {
      if (i) node.appendChild(document.createElement('br'));
      var last = 0, m; LIEN.lastIndex = 0;
      while ((m = LIEN.exec(line))) {
        if (m.index > last) node.appendChild(document.createTextNode(line.slice(last, m.index)));
        var url = m[1].replace(/[.,;:!?]+$/, '');
        var a = el('a', null, url.replace(/^https:\/\/(www\.)?/, ''));
        a.href = url; if (!/domtomconnect\.com/.test(url)) { a.target = '_blank'; a.rel = 'noopener'; }
        a.addEventListener('click', function () { track('assistant_link', { url: url }); });
        node.appendChild(a); last = m.index + m[1].length;
        if (url.length < m[1].length) last -= (m[1].length - url.length);
      }
      if (last < line.length) node.appendChild(document.createTextNode(line.slice(last)));
    });
  }

  var btn = el('button', 'dtc-ai-btn'); btn.type = 'button'; btn.setAttribute('aria-label', T.title);
  var ic = el('i', 'fas fa-comment-dots'); btn.appendChild(ic); btn.appendChild(el('span', null, T.btn));
  var panel = el('div', 'dtc-ai-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', T.title); panel.hidden = true;
  var head = el('div', 'dtc-ai-head'); head.appendChild(el('strong', null, T.title));
  var x = el('button', 'dtc-ai-x', '×'); x.type = 'button'; x.setAttribute('aria-label', T.close); head.appendChild(x);
  var log = el('div', 'dtc-ai-log'); log.setAttribute('aria-live', 'polite');
  var chips = el('div', 'dtc-ai-chips');
  var form = el('form', 'dtc-ai-form');
  var inp = el('textarea'); inp.rows = 1; inp.maxLength = 1200; inp.placeholder = T.ph; inp.setAttribute('aria-label', T.ph);
  var go = el('button', 'dtc-ai-send'); go.type = 'submit'; go.setAttribute('aria-label', T.send); go.appendChild(el('i', 'fas fa-paper-plane'));
  form.appendChild(inp); form.appendChild(go);
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form); panel.appendChild(el('p', 'dtc-ai-note', T.note));
  document.body.appendChild(btn); document.body.appendChild(panel);

  function bubble(role, text, cta) {
    var b = el('div', 'dtc-ai-msg ' + (role === 'user' ? 'me' : 'bot'));
    rich(b, text);
    if (cta) { var a = el('a', 'dtc-ai-cta', cta[1]); a.href = cta[0]; if (!/domtomconnect\.com/.test(cta[0])) { a.target = '_blank'; a.rel = 'noopener'; } b.appendChild(a); }
    log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
  }
  function renderChips() {
    chips.textContent = '';
    T.chips.forEach(function (c) {
      var k = el('button', 'dtc-ai-chip', c[1]); k.type = 'button';
      k.addEventListener('click', function () { track('assistant_chip', { chip: c[0] }); ask(c[1], c[0]); });
      chips.appendChild(k);
    });
  }
  function guided(key) {
    var g = GUIDE[key] || GUIDE.clients;
    bubble('bot', g[0], [g[1], g[2]]);
    bubble('bot', lang === 'en' ? 'You can also message Loïc directly on WhatsApp.' : lang === 'es' ? 'También puede escribir a Loïc por WhatsApp.' : 'Vous pouvez aussi écrire directement à Loïc sur WhatsApp.', [WA, 'WhatsApp']);
  }
  function ask(text, chipKey) {
    text = String(text || '').trim(); if (!text) return;
    bubble('user', text); hist.push({ role: 'user', content: text }); save();
    if (mode === 'guide') { guided(chipKey); return; }
    var w = bubble('bot', T.wait); w.classList.add('wait'); go.disabled = true;
    fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: hist, page: location.pathname }) })
      .then(function (r) { if (r.status === 503 || r.status === 404) { mode = 'guide'; throw new Error('guide'); } if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (d) { w.remove(); bubble('bot', d.reply); hist.push({ role: 'assistant', content: d.reply }); save(); track('assistant_reply'); })
      .catch(function (e) { w.remove(); if (mode === 'guide') { guided(chipKey); } else { bubble('bot', T.err, [CAL, lang === 'fr' ? "Réserver l'échange offert" : lang === 'es' ? 'Reservar una llamada' : 'Book a free call']); } })
      .then(function () { go.disabled = false; });
  }
  function open() {
    panel.hidden = false; btn.classList.add('on'); track('assistant_open');
    if (!log.childNodes.length) {
      bubble('bot', T.hello);
      hist.forEach(function (m) { bubble(m.role, m.content); });
      renderChips();
    }
    setTimeout(function () { inp.focus(); }, 50);
  }
  btn.addEventListener('click', function () { panel.hidden ? open() : (panel.hidden = true, btn.classList.remove('on')); });
  x.addEventListener('click', function () { panel.hidden = true; btn.classList.remove('on'); btn.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; btn.classList.remove('on'); } });
  form.addEventListener('submit', function (e) { e.preventDefault(); var v = inp.value; inp.value = ''; ask(v); });
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit')); } });
})();
