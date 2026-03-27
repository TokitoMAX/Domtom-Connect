/**
 * Domtom Connect - Expert Role Module
 * Explicit logic for Expert profiles (Malt-Style)
 */
const ExpertModule = {
    role: 'expert',

    // UI Terminology & State
    initUI: () => {
        // Labels
        const labelName = document.querySelector('label[for="full_name"]');
        const labelTitle = document.querySelector('label[for="title"]');
        const labelBio = document.querySelector('label[for="bio"]');
        const labelLogo = document.querySelector('label[for="avatar_url"]');
        const labelWritten = document.querySelector('label[for="written_presentation"]');

        if (labelName) labelName.textContent = "Nom complet";
        if (labelTitle) labelTitle.textContent = "Titre Professionnel Accrocheur";
        if (labelBio) labelBio.textContent = "Ma Présentation Professionnelle (À propos)";
        if (labelLogo) labelLogo.textContent = "Photo de profil";

        // Placeholders
        const inputTitle = document.getElementById('title');
        const inputBio = document.getElementById('bio');
        if (inputTitle) inputTitle.placeholder = "Ex : Consultant en Stratégie, Développeur Full-Stack...";
        if (inputBio) inputBio.placeholder = "Malt-style : Racontez votre parcours, vos compétences et ce que vous proposez.";

        // Hide redundant blocks (Unification Malt)
        const companyNameGroup = document.getElementById('company-name-group');
        const writtenParent = labelWritten ? labelWritten.parentElement : null;
        if (companyNameGroup) companyNameGroup.style.display = 'none';
        if (writtenParent) writtenParent.style.display = 'none';

        // Layout blocks
        const tjmGroup = document.getElementById('tjm-group');
        const videoGroup = document.getElementById('video-presentation-group');
        const portfolioCard = document.getElementById('portfolio-card');
        const companyFields = document.getElementById('company-specific-fields');

        if (tjmGroup) tjmGroup.style.display = 'block';
        if (videoGroup) videoGroup.style.display = 'block';
        if (portfolioCard) portfolioCard.style.display = 'block';
        if (companyFields) companyFields.style.display = 'grid';

        // Metrics & Banners
        const metricsRow = document.getElementById('metrics-row');
        const bannerCard = document.getElementById('banner-card');
        if (metricsRow) metricsRow.style.display = 'none';
        if (bannerCard) bannerCard.style.display = 'none';

        console.log("ExpertModule: UI Initialized (Malt-Style)");
    },

    // Public Profile Rendering Data
    getPublicMeta: (profileData) => {
        const nameStr = profileData.full_name || 'Expert';
        const indicatorHtml = profileData.availability === 'disponible' 
            ? `<span class="status-dot-pulse" title="Disponible" style="margin-left:10px;"></span>` 
            : '';
        
        return {
            nameHtml: `${nameStr} ${indicatorHtml}`,
            title: profileData.title || 'Expert Domtom Connect',
            roleLabel: 'Profil Expert / Talent',
            roleClass: 'expert',
            type: 'expert'
        };
    },

    // Explicit HTML Block for Public Profile
    renderFullHTML: (p) => {
        const meta = ExpertModule.getPublicMeta(p);
        const combinedAbout = [p.bio, p.written_presentation].filter(t => t && t.trim()).join('<br><br>');
        
        return `
            <div class="profile-card expert-card-explicit">
                <div class="section-title">
                    <i class="fas fa-user-tie"></i>
                    À propos
                </div>
                <div class="bio-text" id="p-unified-about">
                    ${(combinedAbout || 'Présentation en cours de rédaction.').replace(/\n/g, '<br>')}
                </div>
            </div>
            
            <div id="expert-sections">
                <div class="profile-card">
                    <div class="section-title"><i class="fas fa-briefcase"></i> Portfolio & Réalisations</div>
                    <div class="portfolio-grid" id="p-portfolio-list">
                        ${ExpertModule.renderPortfolioItems(p.portfolio)}
                    </div>
                </div>
            </div>
        `;
    },

    renderPortfolioItems: (portfolio) => {
        const items = Array.isArray(portfolio) ? portfolio : [];
        if (items.length === 0) return '<p class="text-muted">Aucune réalisation ajoutée.</p>';
        return items.map(item => `
            <div class="portfolio-card-premium">
                <div style="display:flex; justify-content:space-between;">
                    <div class="portfolio-icon-box"><i class="fas fa-briefcase"></i></div>
                    <a href="${item.url || '#'}" target="_blank" class="social-sq" style="border-radius:50%;"><i class="fas fa-external-link-alt"></i></a>
                </div>
                <div style="margin-top:12px;">
                    <h4 style="margin:0; font-size:1.1rem; font-weight:800;">${item.title}</h4>
                    <p style="margin:8px 0 0; font-size:0.9rem; color:#64748b;">${item.description || 'Réalisation professionnelle.'}</p>
                </div>
            </div>
        `).join('');
    },

    // Explicit Metrics Block
    renderMetrics: (p) => {
        const avail = p.availability || 'disponible';
        const availText = avail === 'disponible' ? 'Disponible' : (avail === 'occupe' ? 'Occupé' : 'Bientôt disponible');
        const availColor = avail === 'disponible' ? '#10b981' : (avail === 'occupe' ? '#ef4444' : '#f59e0b');
        
        let html = `
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-tag"></i><div><span class="metric-label">Tarif (TJM)</span><span class="metric-value">${p.tjm ? `${p.tjm}€/j` : 'Sur devis'}</span></div></div>
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-clock" style="color:${availColor};"></i><div><span class="metric-label">Statut</span><span class="metric-value" style="color:${availColor};">${availText}</span></div></div>
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-map-marker-alt"></i><div><span class="metric-label">Zone d'intervention</span><span class="metric-value">${p.zone || p.territory || 'OM/International'}</span></div></div>
        `;
        
        if (p.siret) {
            html += `<div class="metric-item" style="grid-column: span 2; border-top: 1px solid #f1f5f9; padding-top:15px; margin-top:5px;"><i class="fas fa-balance-scale"></i><div><span class="metric-label">Professionnel</span><span class="metric-value" style="font-size:0.85rem;">${p.forme_juridique || 'Entrepreneur'} • ${p.siret}</span></div></div>`;
        }
        return html;
    }
};

window.ExpertModule = ExpertModule;
