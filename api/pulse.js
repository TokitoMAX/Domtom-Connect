// Pages web publiques des contenus DTC Pulse (publications, pitchs, profils), lisibles par Google et les IA.
// Les données viennent de la base de l'application DTC Pulse, via des fonctions en lecture seule qui ne
// renvoient que les contenus que leur auteur a rendus publics (« Visible sur Google et les IA »).
// Tout texte venant des utilisateurs est échappé avant d'être affiché.

const APP_SUPABASE_URL = 'https://vyxerftvtrpbrbyhtbvu.supabase.co';
// Clé publique (anon) de l'application, déjà embarquée dans l'app. Elle ne donne accès qu'aux fonctions autorisées.
const APP_SUPABASE_ANON_KEY = process.env.PULSE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eGVyZnR2dHJwYnJieWh0YnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NTE0MTgsImV4cCI6MjA5NzUyNzQxOH0.67oertedCKPMTAKo_yoWFfedKnRTMJIG4fzU0rGrXkM';
const SITE = 'https://domtomconnect.com';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.domtomconnect.app';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Adresse utilisable seulement si elle est en https (évite javascript: et autres)
const safeUrl = (u) => (typeof u === 'string' && /^https:\/\//i.test(u) ? u : '');

const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

const isVideo = (u) => /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(u || '');

const snippet = (text, n) => {
  const t = String(text || '').replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).trimEnd().replace(/[,;:.!?\s]+$/, '') + '…';
};

async function rpc(name, args) {
  const r = await fetch(`${APP_SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: APP_SUPABASE_ANON_KEY, Authorization: `Bearer ${APP_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error('rpc ' + name + ' ' + r.status);
  return r.json();
}

const SEEKING = { investors: 'Cherche un investisseur', partners: 'Cherche un associé', clients: 'Cherche des clients' };

const css = `
:root{color-scheme:dark light}
*{box-sizing:border-box}
body{margin:0;background:#06080b;color:#e6edf3;font:16px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
a{color:#34d399;text-decoration:none}a:hover{text-decoration:underline}
header,footer{max-width:720px;margin:0 auto;padding:16px}
header a.brand{color:#fff;font-weight:700;letter-spacing:.2px}
main{max-width:720px;margin:0 auto;padding:0 16px 40px}
.card{background:#10151c;border:1px solid #1b2430;border-radius:16px;overflow:hidden}
.media{width:100%;display:block;background:#000;max-height:80vh;object-fit:contain}
.body{padding:18px}
h1{font-size:1.35rem;line-height:1.3;margin:0 0 10px}
.meta{color:#9aa7b5;font-size:.9rem;margin:6px 0}
.tag{display:inline-block;background:#0f2a22;color:#34d399;border-radius:999px;padding:3px 12px;font-size:.85rem;font-weight:600;margin:0 8px 8px 0}
.price{font-size:1.2rem;font-weight:700;margin:10px 0}
.text{white-space:pre-wrap;margin:12px 0}
.cta{display:inline-block;background:#10b981;color:#04201a;border-radius:12px;padding:12px 20px;font-weight:700;margin-top:10px}
.cta:hover{text-decoration:none;opacity:.9}
.note{color:#7d8a98;font-size:.82rem;margin-top:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:14px}
.grid a{display:block;background:#10151c;border:1px solid #1b2430;border-radius:12px;overflow:hidden;color:#e6edf3}
.grid img,.grid .ph{width:100%;aspect-ratio:3/4;object-fit:cover;background:#1b2430;display:block}
.grid span{display:block;padding:8px 10px;font-size:.85rem;line-height:1.35}
footer{color:#7d8a98;font-size:.85rem}
@media (prefers-color-scheme:light){body{background:#f6f8fa;color:#1f2933}.card,.grid a{background:#fff;border-color:#e3e8ee}.grid a{color:#1f2933}a{color:#047857}.meta,.note,footer{color:#52606d}.tag{background:#d1fae5;color:#065f46}}
`;

function layout({ title, description, canonical, image, ogType, body, ld, noindex }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex,nofollow">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-video-preview:-1">'}
<meta property="og:site_name" content="DTC Pulse">
<meta property="og:type" content="${esc(ogType || 'article')}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
${image ? `<meta property="og:image" content="${esc(image)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="${esc(image)}">` : '<meta name="twitter:card" content="summary">'}
<style>${css}</style>
${ld ? `<script type="application/ld+json">${jsonLd(ld)}</script>` : ''}
</head>
<body>
<header><a class="brand" href="${SITE}/">Domtom Connect</a> · <a href="${SITE}/pulse/u/domtomconnect">DTC Pulse</a></header>
<main>${body}</main>
<footer>DTC Pulse est le réseau social d'affaires de Domtom Connect : trouver des clients, des partenaires et des investisseurs. <a href="${PLAY_STORE}">Télécharger l'application</a> · <a href="${SITE}/">domtomconnect.com</a></footer>
</body>
</html>`;
}

function renderPost(p) {
  const author = p.author || {};
  const authorName = author.name || 'Un membre';
  const authorUrl = author.username ? `${SITE}/pulse/u/${encodeURIComponent(author.username)}` : SITE;
  const text = String(p.description || '');
  const head = snippet(text, 70) || `Publication de ${authorName}`;
  const desc = snippet(text, 155) || `Publication de ${authorName} sur DTC Pulse.`;
  const media = safeUrl(p.media_url);
  const cover = safeUrl(p.cover_url);
  const video = media && isVideo(media);
  const image = cover || (media && !video ? media : '');
  const canonical = `${SITE}/pulse/post/${p.id}`;
  const price = Number(p.price) > 0 ? Number(p.price) : 0;
  const cur = /^[A-Z]{3}$/.test(p.currency || '') ? p.currency : 'EUR';

  const tags = [];
  if (p.type === 'pitch') tags.push(SEEKING[p.seeking] || 'Présente son projet');
  if (p.type === 'pitch' && p.project_stage && (p.seeking === 'investors' || p.seeking === 'partners')) tags.push(`Stade : ${p.project_stage}`);
  if (p.type === 'pitch' && p.seeking === 'investors' && p.seeking_amount) tags.push(`Financement recherché : ${p.seeking_amount} €`);
  if (p.type === 'pitch' && p.seeking === 'partners' && p.seeking_need) tags.push(`Profil recherché : ${p.seeking_need}`);
  if (p.sector) tags.push(p.sector);
  if (p.location) tags.push(p.location);

  const ld = [{
    '@context': 'https://schema.org',
    '@type': 'SocialMediaPosting',
    '@id': canonical,
    headline: head,
    articleBody: snippet(text, 1500),
    datePublished: p.created_at,
    inLanguage: 'fr',
    url: canonical,
    author: { '@type': author.verified ? 'Organization' : 'Person', name: authorName, url: authorUrl },
    publisher: { '@type': 'Organization', name: 'Domtom Connect', url: SITE },
    ...(image ? { image } : {}),
    ...(p.location ? { contentLocation: { '@type': 'Place', name: p.location } } : {}),
  }];
  if (video) {
    ld.push({
      '@context': 'https://schema.org', '@type': 'VideoObject',
      name: head, description: desc, uploadDate: p.created_at, contentUrl: media,
      ...(cover ? { thumbnailUrl: cover } : {}), url: canonical,
    });
  }
  if (price > 0) {
    ld.push({
      '@context': 'https://schema.org', '@type': 'Product',
      name: head, description: desc, ...(image ? { image } : {}),
      offers: { '@type': 'Offer', price: String(price), priceCurrency: cur, url: canonical, availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: authorName } },
    });
  }

  const mediaHtml = video
    ? `<video class="media" controls preload="none" playsinline${cover ? ` poster="${esc(cover)}"` : ''}><source src="${esc(media)}" type="video/mp4"></video>`
    : (media ? `<img class="media" src="${esc(media)}" alt="${esc(head)}">` : '');

  const body = `<article class="card">${mediaHtml}<div class="body">
<h1>${esc(snippet(text, 140) || head)}</h1>
<div class="meta">Par<a href="${esc(authorUrl)}">${esc(authorName)}</a> · <time datetime="${esc(p.created_at)}">${esc(String(p.created_at || '').slice(0, 10))}</time></div>
<div>${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
${price > 0 ? `<div class="price">${esc(price)} ${esc(cur)}</div>` : ''}
<div class="text">${esc(text)}</div>
<a class="cta" href="${PLAY_STORE}">Ouvrir dans l'application DTC Pulse</a>
${String(p.ai_assisted) === 'true' ? '<div class="note">Contenu préparé avec l\'aide de l\'IA.</div>' : ''}
</div></article>`;

  return layout({ title: `${head} · ${authorName} · DTC Pulse`, description: desc, canonical, image, ogType: video ? 'video.other' : 'article', body, ld });
}

function renderProfile(p) {
  const name = p.name || p.username;
  const canonical = `${SITE}/pulse/u/${encodeURIComponent(p.username)}`;
  const bio = snippet(p.bio, 300);
  const desc = bio || `${name} sur DTC Pulse, le réseau social d'affaires de Domtom Connect.`;
  const avatar = safeUrl(p.avatar_url);
  const posts = Array.isArray(p.posts) ? p.posts : [];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: canonical,
    mainEntity: {
      '@type': p.verified ? 'Organization' : 'Person',
      name, url: canonical,
      ...(avatar ? { image: avatar } : {}),
      ...(bio ? { description: bio } : {}),
      ...(safeUrl(p.website) ? { sameAs: [safeUrl(p.website)] } : {}),
      ...(p.origin_location ? { address: { '@type': 'PostalAddress', addressLocality: p.origin_location } } : {}),
    },
  };
  const items = posts.map((x) => {
    const thumb = safeUrl(x.cover_url) || (!isVideo(x.media_url) ? safeUrl(x.media_url) : '');
    return `<a href="${SITE}/pulse/post/${esc(x.id)}">${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy">` : '<div class="ph"></div>'}<span>${esc(snippet(x.description, 90) || 'Publication')}</span></a>`;
  }).join('');
  const body = `<section class="card"><div class="body">
<h1>${esc(name)}</h1>
<div class="meta">@${esc(p.username)}${p.origin_location ? ' · ' + esc(p.origin_location) : ''}${p.business_name ? ' · ' + esc(p.business_name) : ''}</div>
${bio ? `<div class="text">${esc(bio)}</div>` : ''}
${safeUrl(p.website) ? `<div class="meta"><a href="${esc(safeUrl(p.website))}" rel="noopener nofollow">${esc(safeUrl(p.website))}</a></div>` : ''}
<a class="cta" href="${PLAY_STORE}">Suivre sur l'application DTC Pulse</a>
</div></section>
<h2 style="margin:22px 0 0;font-size:1.1rem">Publications</h2>
<div class="grid">${items}</div>`;
  return layout({ title: `${name} (@${p.username}) · DTC Pulse`, description: desc, canonical, image: avatar, ogType: 'profile', body, ld });
}

module.exports = async (req, res) => {
  const { type, id } = req.query || {};
  const send = (status, html, cache) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', cache || 'public, s-maxage=300, stale-while-revalidate=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(html);
  };
  const notFound = () => send(404, layout({
    title: 'Page introuvable · DTC Pulse', description: 'Ce contenu n\'est pas disponible.', canonical: SITE, noindex: true,
    body: '<div class="card"><div class="body"><h1>Contenu introuvable</h1><p>Ce contenu n\'existe pas ou n\'est pas public.</p><a class="cta" href="' + SITE + '/">Retour au site</a></div></div>',
  }), 'public, s-maxage=60');

  try {
    if (type === 'post' && /^[0-9a-f-]{36}$/i.test(String(id || ''))) {
      const data = await rpc('web_post', { p_id: id });
      return data ? send(200, renderPost(data)) : notFound();
    }
    if (type === 'profile' && /^[A-Za-z0-9._-]{1,40}$/.test(String(id || ''))) {
      const data = await rpc('web_profile', { p_username: id });
      return data ? send(200, renderProfile(data)) : notFound();
    }
    return notFound();
  } catch (e) {
    return send(503, layout({ title: 'Service indisponible · DTC Pulse', description: 'Réessayez dans un instant.', canonical: SITE, noindex: true, body: '<div class="card"><div class="body"><h1>Service momentanément indisponible</h1></div></div>' }), 'no-store');
  }
};

module.exports._test = { renderPost, renderProfile };
