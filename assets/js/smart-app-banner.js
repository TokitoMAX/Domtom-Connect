document.addEventListener('DOMContentLoaded', function() {
    // 1. Vérifier si l'utilisateur est sur Android
    const isAndroid = /android/i.test(navigator.userAgent);
    
    // 2. Vérifier s'il n'a pas déjà fermé la bannière (cookie/localStorage)
    const bannerClosed = localStorage.getItem('dtc_app_banner_closed');

    // S'il n'est pas sur Android ou s'il a déjà fermé, on arrête là
    if (!isAndroid || bannerClosed === 'true') {
        return;
    }

    // 3. Créer la bannière
    const banner = document.createElement('div');
    banner.id = 'smart-app-banner';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.backgroundColor = '#0c100e'; // Bleu très foncé pro
    banner.style.color = '#ffffff';
    banner.style.padding = '12px 15px';
    banner.style.boxSizing = 'border-box';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'space-between';
    banner.style.zIndex = '999999';
    banner.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    banner.style.borderBottom = '1px solid #1b2420';

    // 4. Contenu de la bannière
    banner.innerHTML = `
        <button id="close-app-banner" style="background:none; border:none; color:#a7b0ac; font-size:1.2rem; cursor:pointer; padding:0 10px 0 0;">&times;</button>
        
        <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center;">
            <strong style="font-size:0.9rem; line-height:1.2;">DTC Pulse</strong>
            <span style="font-size:0.75rem; color:#d4dad7;">L'app officielle Domtom Connect</span>
        </div>
        
        <a href="/beta-test.html" style="background-color:#10b981; color:#ffffff; text-decoration:none; padding:6px 14px; border-radius:4px; font-size:0.8rem; font-weight:bold; white-space:nowrap; margin-left:10px;">
            Télécharger
        </a>
    `;

    // 5. Injecter en haut du body
    document.body.prepend(banner);

    // Ajuster le body pour ne pas cacher le header sous la bannière (la bannière fait environ 60px)
    document.body.style.marginTop = '60px';

    // 6. Gérer la fermeture
    document.getElementById('close-app-banner').addEventListener('click', function() {
        banner.style.display = 'none';
        document.body.style.marginTop = '0'; // Remettre le margin normal
        // Enregistrer le choix de fermer pour ne pas l'embêter à chaque page
        localStorage.setItem('dtc_app_banner_closed', 'true');
    });
});
