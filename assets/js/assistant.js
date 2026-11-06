// Assistant Domtom Connect : gratuit, sans IA payante, tout se passe dans le navigateur du visiteur.
// Comprend les questions FR/EN/ES par mots-clés, oriente vers la bonne page, et envoie chaque conversation
// à Loïc par e-mail (Formspree, même circuit que l'Anamnèse). Aucun innerHTML : uniquement textContent.
(function () {
  if (window.__dtcAssistant) return; window.__dtcAssistant = true;
  if (!document.querySelector('link[href^="/assets/css/assistant.css"]')) { var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '/assets/css/assistant.css?v=2'; document.head.appendChild(css); }

  var FORM = 'https://formspree.io/f/myzbqepy';
  var SITE = 'https://domtomconnect.com', CAL = 'https://calendly.com/domtomconnect/30min', WA = 'https://wa.me/33620783377';
  var lang = (document.documentElement.lang || 'fr').slice(0, 2); if (['fr', 'en', 'es'].indexOf(lang) === -1) lang = 'fr';

  var UI = {
    fr: { btn: 'Une question ?', title: 'Assistant Domtom Connect', hello: 'Bonjour ! Dites-moi ce que vous cherchez, je vous oriente. Vous pouvez aussi choisir ci-dessous.', ph: 'Écrivez votre question…',
          chips: [['site', 'Un site qui rapporte des clients'], ['clients', 'Trouver plus de clients'], ['projet', 'Lancer mon projet'], ['boutique', 'Les livres et outils'], ['contact', 'Parler à Loïc']],
          close: 'Fermer', note: 'Vos messages sont transmis à Loïc Villeronce pour pouvoir vous répondre.', callback: 'Être recontacté par Loïc',
          f: { title: 'Laissez vos coordonnées, Loïc vous répond personnellement.', name: 'Prénom', contact: 'E-mail ou WhatsApp', msg: 'Votre besoin en une phrase', send: 'Envoyer', ok: 'Merci ! Loïc vous recontacte rapidement.', ko: "L'envoi n'a pas fonctionné. Écrivez directement sur WhatsApp." },
          other: 'Pour vous répondre au mieux, dites-m’en un peu plus : votre activité, votre territoire et ce que vous voulez obtenir. Vous pouvez aussi être recontacté directement par Loïc.' },
    en: { btn: 'Questions?', title: 'Domtom Connect assistant', hello: 'Hello! Tell me what you are looking for and I will point you in the right direction. You can also pick below.', ph: 'Type your question…',
          chips: [['site', 'A website that brings customers'], ['reservations', 'More direct bookings'], ['projet', 'Start my business'], ['contact', 'Talk to Loïc']],
          close: 'Close', note: 'Your messages are sent to Loïc Villeronce so he can reply to you.', callback: 'Get a call back from Loïc',
          f: { title: 'Leave your details, Loïc will reply personally.', name: 'First name', contact: 'Email or WhatsApp', msg: 'What you need, in one sentence', send: 'Send', ok: 'Thank you! Loïc will get back to you shortly.', ko: 'Sending failed. Please message us on WhatsApp.' },
          other: 'To help you best, tell me a bit more: your business, your island or country, and what you want to achieve. You can also ask Loïc to contact you.' },
    es: { btn: '¿Preguntas?', title: 'Asistente Domtom Connect', hello: '¡Hola! Dígame qué busca y le oriento. También puede elegir abajo.', ph: 'Escriba su pregunta…',
          chips: [['site', 'Un sitio que traiga clientes'], ['reservations', 'Más reservas directas'], ['projet', 'Crear mi empresa'], ['contact', 'Hablar con Loïc']],
          close: 'Cerrar', note: 'Sus mensajes se envían a Loïc Villeronce para poder responderle.', callback: 'Que Loïc me contacte',
          f: { title: 'Deje sus datos y Loïc le responderá personalmente.', name: 'Nombre', contact: 'Correo o WhatsApp', msg: 'Lo que necesita, en una frase', send: 'Enviar', ok: '¡Gracias! Loïc le contactará pronto.', ko: 'El envío falló. Escríbanos por WhatsApp.' },
          other: 'Para ayudarle mejor, cuénteme un poco más: su negocio, su isla o país y lo que quiere lograr. También puede pedir que Loïc le contacte.' }
  }[lang];

  var KB = [
    { id: 'prix', k: ['prix', 'tarif', 'combien', 'cout', 'coute', 'cher', 'budget', 'devis', 'price', 'cost', 'how much', 'quote', 'precio', 'cuanto', 'costo', 'presupuesto'],
      fr: ["Le premier échange de 30 minutes est offert. La séance stratégique d'une heure coûte 100 €, avec un plan d'action écrit, déduite du devis si vous continuez. Les sites et l'accompagnement sont sur devis, après l'échange.", CAL, "Réserver l'échange offert"],
      en: ['The first 30 minute call is free. A one hour strategy session costs 100 euros with a written action plan, deducted if you continue. Websites and support are quoted after the call.', CAL, 'Book a free call'],
      es: ['La primera llamada de 30 minutos es gratuita. La sesión estratégica de una hora cuesta 100 euros con un plan escrito, descontados si continúa. Los sitios web y el acompañamiento se presupuestan después.', CAL, 'Reservar una llamada'] },
    { id: 'reservations', k: ['booking', 'airbnb', 'reservation', 'reserver', 'hebergement', 'gite', 'hotel', 'villa', 'location saisonniere', 'commission', 'plateforme', 'tourisme', 'touriste', 'excursion', 'guesthouse', 'tour', 'bookings', 'reserva', 'reservas', 'turismo', 'hospedaje', 'basse saison', 'low season', 'temporada baja'],
      fr: ["Si vous dépendez de Booking ou Airbnb, commencez par calculer ce que les commissions vous coûtent sur l'année. Ensuite, un site qui prend les réservations en direct permet d'en récupérer une partie.", SITE + '/outils/calculateur-commissions-reservation', 'Calculer mes commissions'],
      en: ['If you depend on Booking or Airbnb, start by calculating what commissions cost you each year. A website that takes direct bookings then lets you keep part of it.', SITE + '/outils/booking-commission-calculator', 'Use the free calculator'],
      es: ['Si depende de Booking o Airbnb, calcule primero lo que le cuestan las comisiones cada año. Luego, un sitio con reservas directas le permite recuperar una parte.', SITE + '/outils/calculadora-comisiones-reservas', 'Usar la calculadora'] },
    { id: 'site', k: ['site', 'internet', 'web', 'vitrine', 'refonte', 'seo', 'referencement', 'google', 'website', 'landing', 'sitio', 'pagina', 'boutique en ligne', 'e-commerce', 'ecommerce', 'online shop', 'tienda'],
      fr: ["Nous créons des sites pensés pour convertir : réservation, paiement, WhatsApp, référencement local. Le plus simple pour commencer est l'audit offert de votre présence en ligne.", SITE + '/creation-site-web#audit', "Demander l'audit offert"],
      en: ['We build websites designed to convert: booking, payment, WhatsApp and local search. The easiest first step is a free 30 minute call.', SITE + '/en', 'See how we help'],
      es: ['Creamos sitios pensados para convertir: reservas, pagos, WhatsApp y búsqueda local. Lo más sencillo es una llamada gratuita de 30 minutos.', CAL, 'Reservar una llamada'] },
    { id: 'btp', k: ['btp', 'chantier', 'batiment', 'artisan', 'maconnerie', 'plomberie', 'electricien', 'facture', 'paiement', 'impaye', 'retard de paiement', 'construction', 'contractor', 'invoice', 'construccion'],
      fr: ["Pour les entreprises du bâtiment, le nerf de la guerre c'est la trésorerie : acomptes, situations facturées à temps, relances organisées. Notre guide détaille la méthode.", SITE + '/guides/etre-paye-plus-vite-btp', 'Lire le guide BTP'],
      en: ['For construction businesses, cash flow is everything: deposits, timely invoicing and organised follow ups. Let us look at your case in a free call.', CAL, 'Book a free call'],
      es: ['Para las empresas de construcción, la tesorería lo es todo: anticipos, facturación a tiempo y seguimiento. Veamos su caso en una llamada gratuita.', CAL, 'Reservar una llamada'] },
    { id: 'projet', k: ['creer', 'lancer', 'idee', 'projet', 'demarrer', 'auto-entrepreneur', 'micro-entreprise', 'statut', 'immatriculation', 'start', 'launch', 'register', 'idea', 'startup', 'crear', 'empezar', 'emprender', 'empresa', 'negocio'],
      fr: ["Pour lancer votre projet, commencez par le diagnostic gratuit, puis calculez votre prix plancher. Nos guides « Créer son entreprise » détaillent les étapes par territoire.", SITE + '/anamnese', 'Faire le diagnostic gratuit'],
      en: ['To start your business, read our practical guides for your country, then book a free call to set out your plan.', SITE + '/guides', 'See the guides'],
      es: ['Para crear su empresa, lea nuestras guías prácticas y reserve una llamada gratuita para definir su plan.', SITE + '/guides', 'Ver las guías'] },
    { id: 'clients', k: ['client', 'clients', 'vendre', 'vente', 'ventes', 'prospect', 'chiffre', 'visibilite', 'marketing', 'customers', 'sales', 'sell', 'leads', 'clientes', 'vender', 'ventas'],
      fr: ["Trouver plus de clients dépend de votre activité : réservations directes, WhatsApp, site, prospection. Le plus efficace est d'en parler 30 minutes avec Loïc, c'est offert.", CAL, "Réserver l'échange offert"],
      en: ['Finding more customers depends on your business: direct bookings, WhatsApp, website, outreach. The most effective step is a free 30 minute call with Loïc.', CAL, 'Book a free call'],
      es: ['Conseguir más clientes depende de su negocio: reservas directas, WhatsApp, sitio web, prospección. Lo más eficaz es una llamada gratuita de 30 minutos con Loïc.', CAL, 'Reservar una llamada'] },
    { id: 'whatsapp', k: ['whatsapp', 'messages', 'reponse', 'catalogue'],
      fr: ["WhatsApp est souvent votre premier canal de vente. Notre guide explique comment l'organiser avec WhatsApp Business sans y passer vos soirées.", SITE + '/guides/trouver-des-clients-sur-whatsapp', 'Lire le guide WhatsApp'],
      en: ['WhatsApp is often your first sales channel. Our guide explains how to organise it with WhatsApp Business.', SITE + '/guides/whatsapp-business-for-small-businesses', 'Read the guide'],
      es: ['WhatsApp suele ser su primer canal de venta. Hablemos de cómo organizarlo en una llamada gratuita.', CAL, 'Reservar una llamada'] },
    { id: 'diaspora', k: ['diaspora', 'export', 'etranger', 'hexagone', 'canada', 'usa', 'abroad', 'extranjero', 'expedier', 'livraison'],
      fr: ["Pour vendre à la diaspora, il faut d'abord régler la logistique et la confiance. Notre guide détaille la méthode étape par étape.", SITE + '/guides/vendre-a-la-diaspora', 'Lire le guide diaspora'],
      en: ['To sell to the diaspora, sort out logistics and trust first. Our guide explains the method step by step.', SITE + '/guides/sell-to-the-diaspora', 'Read the guide'],
      es: ['Para vender a la diáspora, primero hay que resolver la logística y la confianza. Hablemos en una llamada gratuita.', CAL, 'Reservar una llamada'] },
    { id: 'copilotage', k: ['tresorerie', 'organisation', 'deborde', 'temps', 'gestion', 'equipe', 'deleguer', 'seul', 'stress', 'copilotage', 'cash', 'operations', 'overwhelmed', 'tiempo', 'organizacion'],
      fr: ["Si vous portez tout seul l'entreprise, le copilotage vous donne un bras droit pour les priorités, la trésorerie et l'organisation.", SITE + '/pilotage', 'Découvrir le copilotage'],
      en: ['If you carry the whole business alone, our operational support gives you a right hand for priorities, cash flow and organisation.', CAL, 'Book a free call'],
      es: ['Si lleva solo todo el negocio, nuestro apoyo operativo le da una mano derecha para prioridades, tesorería y organización.', CAL, 'Reservar una llamada'] },
    { id: 'boutique', k: ['livre', 'ebook', 'e-book', 'pdf', 'boutique', 'guide interactif', 'pack', 'fondamentaux', 'chapitre', 'book', 'libro'],
      fr: ["Le livre Les Fondamentaux de l'Entrepreneur coûte 5 €, le guide interactif 27 € et le pack fondateur 47 €. Le chapitre 1 se lit gratuitement.", SITE + '/boutique', 'Voir la boutique'],
      en: ['Our book and interactive guide are in French for now. The best next step is a free call with Loïc.', CAL, 'Book a free call'],
      es: ['Nuestros libros están en francés por ahora. Lo mejor es una llamada gratuita con Loïc.', CAL, 'Reservar una llamada'] },
    { id: 'pulse', k: ['pulse', 'dtc', 'application', 'appli', 'reseau', 'communaute', 'network', 'app', 'comunidad'],
      fr: ["DTC Pulse est l'application de réseau de Domtom Connect pour les entrepreneurs de la Caraïbe, de l'Afrique et de la diaspora. Chacun y crée et gère son compte.", SITE + '/rejoindre', 'Découvrir DTC Pulse'],
      en: ['DTC Pulse is the Domtom Connect business network app for entrepreneurs across the Caribbean, Africa and the diaspora.', SITE + '/rejoindre', 'Discover DTC Pulse'],
      es: ['DTC Pulse es la aplicación de red de Domtom Connect para emprendedores del Caribe, África y la diáspora.', SITE + '/rejoindre', 'Descubrir DTC Pulse'] },
    { id: 'contact', k: ['rendez-vous', 'rdv', 'appel', 'appeler', 'parler', 'contact', 'contacter', 'joindre', 'loic', 'humain', 'call', 'talk', 'meeting', 'llamada', 'hablar', 'contacto'],
      fr: ['Avec plaisir. Vous pouvez réserver un échange offert de 30 minutes avec Loïc, lui écrire sur WhatsApp, ou laisser vos coordonnées ici.', CAL, "Réserver l'échange offert"],
      en: ['Of course. You can book a free 30 minute call with Loïc, message him on WhatsApp, or leave your details here.', CAL, 'Book a free call'],
      es: ['Con gusto. Puede reservar una llamada gratuita de 30 minutos con Loïc, escribirle por WhatsApp o dejar sus datos aquí.', CAL, 'Reservar una llamada'] }
  ];
  var TERR = { guadeloupe: 'guadeloupe', martinique: 'martinique', guyane: 'guyane', cayenne: 'guyane', reunion: 'reunion', mayotte: 'mayotte', polynesie: 'polynesie', tahiti: 'polynesie', 'saint-martin': 'saint-martin', 'saint martin': 'saint-martin', 'st martin': 'saint-martin', 'sint maarten': 'sint-maarten', 'saint-barth': 'saint-barthelemy', haiti: 'haiti', 'sainte-lucie': 'sainte-lucie', 'saint lucia': 'sainte-lucie', 'st lucia': 'sainte-lucie', grenada: 'grenade', grenade: 'grenade', dominica: 'dominique', dominique: 'dominique', trinidad: 'trinite-et-tobago', jamaica: 'jamaique', jamaique: 'jamaique', barbados: 'barbade', barbade: 'barbade', dominicana: 'republique-dominicaine', 'republique dominicaine': 'republique-dominicaine', 'puerto rico': 'porto-rico', 'porto rico': 'porto-rico', senegal: 'senegal', dakar: 'senegal', "cote d'ivoire": 'cote-d-ivoire', abidjan: 'cote-d-ivoire', cameroun: 'cameroun', cameroon: 'cameroun', douala: 'cameroun', benin: 'benin', togo: 'togo', gabon: 'gabon', kinshasa: 'rdc', maroc: 'maroc', nigeria: 'nigeria', lagos: 'nigeria', ghana: 'ghana', kenya: 'kenya', maurice: 'maurice', mauritius: 'maurice', madagascar: 'madagascar', paris: 'paris', montreal: 'montreal', bruxelles: 'bruxelles', londres: 'londres', london: 'londres', 'new york': 'new-york' };

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function comprendre(text) {
    var t = ' ' + norm(text) + ' ', best = null, score = 0;
    KB.forEach(function (it) {
      var sc = 0; it.k.forEach(function (k) { if (t.indexOf(norm(k)) !== -1) sc += k.length > 5 ? 2 : 1; });
      if (sc > score) { score = sc; best = it; }
    });
    var terr = null; Object.keys(TERR).forEach(function (k) { if (t.indexOf(norm(k)) !== -1) terr = TERR[k]; });
    return { it: best, terr: terr };
  }

  // ---------- suivi : chaque conversation est envoyée à Loïc ----------
  var KEY = 'dtc-assistant-v2', st = { log: [], sent: 0, id: '' };
  try { st = JSON.parse(sessionStorage.getItem(KEY)) || st; } catch (e) {}
  if (!st.id) st.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function journal(qui, txt) { st.log.push((qui === 'user' ? 'Visiteur : ' : 'Assistant : ') + txt); if (st.log.length > 40) st.log.shift(); save(); }
  function payload(extra) {
    var d = new FormData();
    d.append('_subject', extra && extra.contact ? 'Assistant du site : demande de rappel' : 'Assistant du site : nouvelle conversation');
    d.append('source', 'assistant');
    d.append('conversation_id', st.id);
    d.append('langue', lang);
    d.append('page', location.pathname);
    d.append('date', new Date().toISOString());
    d.append('conversation', st.log.join('\n'));
    if (extra) Object.keys(extra).forEach(function (k) { d.append(k, extra[k]); });
    return d;
  }
  function envoyerJournal() {
    var nbUser = st.log.filter(function (l) { return l.indexOf('Visiteur') === 0; }).length;
    if (!nbUser || nbUser <= st.sent) return;
    st.sent = nbUser; save();
    try { if (navigator.sendBeacon) navigator.sendBeacon(FORM, payload()); else fetch(FORM, { method: 'POST', body: payload(), keepalive: true }); } catch (e) {}
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') envoyerJournal(); });
  window.addEventListener('pagehide', envoyerJournal);
  function track(ev, p) { try { if (window.gtag) window.gtag('event', ev, p || {}); } catch (e) {} }
  function el(tag, cls, txt) { var x = document.createElement(tag); if (cls) x.className = cls; if (txt != null) x.textContent = txt; return x; }

  // ---------- interface ----------
  var btn = el('button', 'dtc-ai-btn'); btn.type = 'button'; btn.setAttribute('aria-label', UI.title);
  btn.appendChild(el('i', 'fas fa-comment-dots')); btn.appendChild(el('span', null, UI.btn));
  var panel = el('div', 'dtc-ai-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', UI.title); panel.hidden = true;
  var head = el('div', 'dtc-ai-head'); head.appendChild(el('strong', null, UI.title));
  var x = el('button', 'dtc-ai-x', '×'); x.type = 'button'; x.setAttribute('aria-label', UI.close); head.appendChild(x);
  var log = el('div', 'dtc-ai-log'); log.setAttribute('aria-live', 'polite');
  var chips = el('div', 'dtc-ai-chips');
  var form = el('form', 'dtc-ai-form');
  var inp = el('textarea'); inp.rows = 1; inp.maxLength = 600; inp.placeholder = UI.ph; inp.setAttribute('aria-label', UI.ph);
  var go = el('button', 'dtc-ai-send'); go.type = 'submit'; go.setAttribute('aria-label', 'OK'); go.appendChild(el('i', 'fas fa-paper-plane'));
  form.appendChild(inp); form.appendChild(go);
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form); panel.appendChild(el('p', 'dtc-ai-note', UI.note));
  document.body.appendChild(btn); document.body.appendChild(panel);

  function bubble(role, text, cta) {
    var b = el('div', 'dtc-ai-msg ' + (role === 'user' ? 'me' : 'bot'), text);
    if (cta) { var a = el('a', 'dtc-ai-cta', cta[1]); a.href = cta[0]; if (cta[0].indexOf(SITE) !== 0) { a.target = '_blank'; a.rel = 'noopener'; } a.addEventListener('click', function () { track('assistant_link', { url: cta[0] }); journal('bot', '[clic] ' + cta[0]); }); b.appendChild(a); }
    log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
  }
  function boutonRappel() {
    var b = el('button', 'dtc-ai-chip dtc-ai-callback', UI.callback); b.type = 'button';
    b.addEventListener('click', function () { b.remove(); ouvrirRappel(); }); log.appendChild(b); log.scrollTop = log.scrollHeight;
  }
  function ouvrirRappel() {
    track('assistant_callback_open');
    var f = el('form', 'dtc-ai-lead'); f.appendChild(el('p', null, UI.f.title));
    var n = el('input'); n.name = 'prenom'; n.placeholder = UI.f.name; n.required = true; n.maxLength = 60;
    var c = el('input'); c.name = 'contact'; c.placeholder = UI.f.contact; c.required = true; c.maxLength = 120;
    var m = el('input'); m.name = 'besoin'; m.placeholder = UI.f.msg; m.maxLength = 300;
    var s = el('button', 'dtc-ai-cta', UI.f.send); s.type = 'submit';
    var hp = el('input'); hp.name = '_gotcha'; hp.tabIndex = -1; hp.className = 'pf-hp'; hp.setAttribute('aria-hidden', 'true');
    [n, c, m, hp, s].forEach(function (z) { f.appendChild(z); });
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (hp.value) return; s.disabled = true;
      journal('user', '[rappel demandé] ' + n.value + ' / ' + c.value + (m.value ? ' / ' + m.value : ''));
      fetch(FORM, { method: 'POST', body: payload({ prenom: n.value, contact: c.value, besoin: m.value }), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw 0; f.remove(); bubble('bot', UI.f.ok); st.sent = st.log.filter(function (l) { return l.indexOf('Visiteur') === 0; }).length; save(); track('generate_lead', { form: 'assistant' }); })
        .catch(function () { s.disabled = false; bubble('bot', UI.f.ko, [WA, 'WhatsApp']); });
    });
    log.appendChild(f); log.scrollTop = log.scrollHeight; n.focus();
  }
  function repondre(text, chipKey) {
    var r = chipKey ? { it: KB.filter(function (k) { return k.id === chipKey; })[0] || null, terr: null } : comprendre(text);
    if (r.it) {
      var a = r.it[lang]; bubble('bot', a[0], [a[1], a[2]]); journal('bot', a[0]);
      if (r.terr) {
        var tx = lang === 'fr' ? 'Voici aussi notre page pour votre territoire.' : lang === 'es' ? 'Aquí también nuestra página para su territorio.' : 'Here is also our page for your territory.';
        bubble('bot', tx, [SITE + '/territoires/' + r.terr, r.terr.replace(/-/g, ' ')]);
      }
      if (r.it.id === 'contact') bubble('bot', 'WhatsApp', [WA, 'WhatsApp']);
    } else {
      bubble('bot', UI.other); journal('bot', UI.other);
    }
    boutonRappel();
  }
  function ask(text, chipKey) {
    text = String(text || '').trim(); if (!text) return;
    bubble('user', text); journal('user', text); track('assistant_message', { chip: chipKey || 'texte' });
    setTimeout(function () { repondre(text, chipKey); }, 350);
  }
  function open() {
    panel.hidden = false; btn.classList.add('on'); track('assistant_open');
    if (!log.childNodes.length) {
      bubble('bot', UI.hello);
      st.log.forEach(function (l) { if (l.indexOf('Visiteur : ') === 0) bubble('user', l.slice(11)); });
      UI.chips.forEach(function (c) {
        var k = el('button', 'dtc-ai-chip', c[1]); k.type = 'button';
        k.addEventListener('click', function () { ask(c[1], c[0]); });
        chips.appendChild(k);
      });
    }
    setTimeout(function () { inp.focus(); }, 50);
  }
  function fermer() { panel.hidden = true; btn.classList.remove('on'); envoyerJournal(); }
  btn.addEventListener('click', function () { panel.hidden ? open() : fermer(); });
  x.addEventListener('click', function () { fermer(); btn.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) fermer(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); var v = inp.value; inp.value = ''; ask(v); });
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); var v = inp.value; inp.value = ''; ask(v); } });
})();
