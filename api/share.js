const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF'; // Fallback to public key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function stripHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
}

module.exports = async (req, res) => {
    const { type, id } = req.query;

    if (!type || !id) {
        return res.status(400).send('Missing type or id');
    }

    const appUrl = 'https://domtomconnect.com';
    let title = 'Domtom Connect';
    let description = 'Rejoignez le réseau Domtom Connect, découvrez des opportunités business, pilotez vos projets et interagissez avec la communauté ultramarine.';
    let imageUrl = `${appUrl}/assets/images/logo-domtomconnect.png`;
    let targetUrl = appUrl;

    try {
        if (type === 'post') {
            // Fetch post
            const { data: post, error } = await supabase
                .from('showcase_items')
                .select('*, profiles:user_id(full_name, avatar_url, role)')
                .eq('id', id)
                .single();

            if (!error && post) {
                targetUrl = `${appUrl}/post.html?id=${id}`;
                
                const authorName = post.profiles ? post.profiles.full_name : 'Un membre';
                
                if (post.item_type === 'status' || !post.title) {
                    title = `Publication de ${authorName} sur Domtom Connect`;
                    const cleanText = stripHtmlTags(post.description);
                    description = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
                    if (!description) description = 'Voir la publication sur Domtom Connect.';
                    
                    // Extract image from description if exists
                    const imgMatch = post.description && post.description.match(/<img[^>]+src="([^">]+)"/);
                    const videoMatch = post.description && post.description.match(/<video[^>]+poster="([^">]+)"/);
                    
                    if (imgMatch) {
                        imageUrl = imgMatch[1];
                    } else if (videoMatch) {
                        imageUrl = videoMatch[1];
                    }
                } else {
                    title = post.title || `Publication de ${authorName}`;
                    const cleanText = stripHtmlTags(post.description);
                    description = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
                    if (!description) description = 'Voir le détail.';
                    if (post.url && post.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                        imageUrl = post.url;
                    }
                }
            }
        } else if (type === 'vitrine') {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && profile) {
                targetUrl = `${appUrl}/showcase.html?id=${id}`;
                title = `Vitrine de ${profile.full_name} | Domtom Connect`;
                description = profile.bio ? stripHtmlTags(profile.bio) : `Découvrez les services de ${profile.full_name} sur Domtom Connect.`;
                if (profile.avatar_url) {
                    imageUrl = profile.avatar_url;
                }
            }
        } else if (type === 'event') {
            const { data: event, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && event) {
                targetUrl = `${appUrl}/billetterie.html?event=${id}`; // Assumes there's a way to view single event
                title = `${event.title || 'Événement'} | Domtom Connect`;
                description = event.description ? stripHtmlTags(event.description) : `Participez à cet événement sur Domtom Connect.`;
                if (event.cover_url) {
                    imageUrl = event.cover_url;
                }
            }
        }

        // Return HTML with OpenGraph tags and a JS redirect
        const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title.replace(/"/g, '&quot;')}</title>
    
    <!-- Primary Meta Tags -->
    <meta name="title" content="${title.replace(/"/g, '&quot;')}">
    <meta name="description" content="${description.replace(/"/g, '&quot;')}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${targetUrl}">
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${imageUrl}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${targetUrl}">
    <meta property="twitter:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="twitter:description" content="${description.replace(/"/g, '&quot;')}">
    <meta property="twitter:image" content="${imageUrl}">

    <script>
        // Redirect actual users to the real page
        window.location.href = "${targetUrl}";
    </script>
</head>
<body>
    <p>Redirection en cours vers <a href="${targetUrl}">${title.replace(/"/g, '&quot;')}</a>...</p>
</body>
</html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3600'); // Cache at the edge for 1 min
        res.status(200).send(html);

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur interne');
    }
};
