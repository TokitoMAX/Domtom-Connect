// Plan du site des contenus publics de DTC Pulse (publications et profils rendus publics par leurs auteurs).
const APP_SUPABASE_URL = 'https://vyxerftvtrpbrbyhtbvu.supabase.co';
const APP_SUPABASE_ANON_KEY = process.env.PULSE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eGVyZnR2dHJwYnJieWh0YnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NTE0MTgsImV4cCI6MjA5NzUyNzQxOH0.67oertedCKPMTAKo_yoWFfedKnRTMJIG4fzU0rGrXkM';
const SITE = 'https://domtomconnect.com';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const day = (d) => String(d || '').slice(0, 10);

module.exports = async (req, res) => {
  try {
    const r = await fetch(`${APP_SUPABASE_URL}/rest/v1/rpc/web_sitemap`, {
      method: 'POST',
      headers: { apikey: APP_SUPABASE_ANON_KEY, Authorization: `Bearer ${APP_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_limit: 5000 }),
    });
    if (!r.ok) throw new Error('rpc ' + r.status);
    const data = await r.json();
    const urls = [`<url><loc>${SITE}/dtcpulse</loc></url>`];
    for (const p of data.posts || []) urls.push(`<url><loc>${SITE}/dtcpulse/post/${esc(p.id)}</loc><lastmod>${day(p.lastmod)}</lastmod></url>`);
    for (const u of data.profiles || []) urls.push(`<url><loc>${SITE}/dtcpulse/u/${esc(encodeURIComponent(u.username))}</loc><lastmod>${day(u.lastmod)}</lastmod></url>`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
    res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  } catch (e) {
    res.statusCode = 503;
    res.setHeader('Cache-Control', 'no-store');
    res.end('Service indisponible');
  }
};
