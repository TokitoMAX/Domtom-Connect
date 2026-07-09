const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function stripHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
}

module.exports = async (req, res) => {
    const { slug } = req.query;

    if (!slug) {
        return res.redirect('/');
    }

    const reserved = ['api', 'assets', 'dashboard', 'mon-espace', 'login', 'epopee', 'marketplace', 'post.html', 'vitrine.html', 'showcase.html', 'index.html', 'register-choice', 'admin', 'docs', 'blog', 'faq', 'legal'];
    if (reserved.includes(slug.toLowerCase())) {
        return res.status(404).send('Not found');
    }

    let targetId = null;
    let profile = null;

    try {
        if (slug.toLowerCase() === 'founder' || slug.toLowerCase() === 'fondateur') {
            const { data } = await supabase.from('profiles').select('*').eq('role', 'admin').limit(1);
            if (data && data.length > 0) {
                targetId = data[0].id;
                profile = data[0];
            }
        } else {
            const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
            const firstPart = slug.split('-')[0].replace(/[^a-z0-9]/g, '');
            
            if (firstPart) {
                const { data } = await supabase.from('profiles').select('*').ilike('full_name', `%${firstPart}%`).limit(50);
                if (data && data.length > 0) {
                    const match = data.find(p => p.full_name && p.full_name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSlug);
                    if (match) {
                        targetId = match.id;
                        profile = match;
                    } else if (data.length === 1) {
                        targetId = data[0].id;
                        profile = data[0];
                    }
                }
            }
            
            // Si pas trouvé par nom, peut-être que c'est un ID directement
            if (!targetId && slug.length > 20) {
                const { data: byId } = await supabase.from('profiles').select('*').eq('id', slug).single();
                if (byId) {
                    targetId = byId.id;
                    profile = byId;
                }
            }
        }

        if (targetId && profile) {
            const appUrl = 'https://domtomconnect.com';
            const targetUrl = `${appUrl}/showcase.html?id=${targetId}`;
            const title = `Vitrine de ${profile.full_name} | Domtom Connect`;
            const description = profile.bio ? stripHtmlTags(profile.bio) : `Découvrez les liens et services de ${profile.full_name} sur Domtom Connect.`;
            const imageUrl = profile.avatar_url || `${appUrl}/assets/images/logo-domtomconnect.png`;

            let htmlContent = '';
            try {
                // Fetch showcase.html directly from the live app to avoid Vercel filesystem issues in serverless functions
                const response = await fetch(`${appUrl}/showcase.html`);
                htmlContent = await response.text();
            } catch (err) {
                console.error("Error fetching showcase.html:", err);
                htmlContent = `<!DOCTYPE html><html lang="fr"><head><title>Domtom Connect</title></head><body>Erreur de chargement.</body></html>`;
            }

            const injectedData = `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${title.replace(/"/g, '&quot;')}">
    <meta name="description" content="${description.replace(/"/g, '&quot;')}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${appUrl}/${slug}">
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${imageUrl}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${appUrl}/${slug}">
    <meta property="twitter:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="twitter:description" content="${description.replace(/"/g, '&quot;')}">
    <meta property="twitter:image" content="${imageUrl}">
    
    <script>window.INJECTED_PROFILE_ID = "${targetId}";</script>
`;

            htmlContent = htmlContent.replace('<head>', `<head>\n${injectedData}`);
            htmlContent = htmlContent.replace(/<title>.*<\/title>/, `<title>${title.replace(/"/g, '&quot;')}</title>`);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3600');
            return res.status(200).send(htmlContent);
        } else {
            return res.redirect('/');
        }
    } catch (err) {
        console.error("Slug resolution error:", err);
        return res.redirect('/');
    }
};
