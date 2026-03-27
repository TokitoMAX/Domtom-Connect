/**
 * Domtom Connect - Company Role Module
 * Explicit logic for Enterprise / Institution profiles
 */
const CompanyModule = {
    role: 'entreprise',

    // UI Terminology & State
    initUI: () => {
        // Labels
        const labelName = document.getElementById('label-name');
        const labelTitle = document.getElementById('label-title');
        const labelBio = document.getElementById('label-bio');
        const labelLogo = document.getElementById('label-logo');
        const labelWritten = document.getElementById('label-written-presentation');

        if (labelName) labelName.textContent = "Nom de l'Entreprise / Institution";
        if (labelTitle) labelTitle.textContent = "Secteur d'Activité principal";
        if (labelBio) labelBio.textContent = "Présentation Institutionnelle (Vision & Offre)";
        if (labelLogo) labelLogo.textContent = "Logo de l'entreprise";

        // Placeholders
        const inputTitle = document.getElementById('title');
        const inputBio = document.getElementById('bio');
        if (inputTitle) inputTitle.placeholder = "Ex : Conseil Juridique, Agence Marketing...";
        if (inputBio) inputBio.placeholder = "Un récit unifié : Présentez votre mission, votre engagement et vos services phares en un seul texte structuré.";

        // UI Controls
        const companyNameGroup = document.getElementById('company-name-group');
        const writtenParent = labelWritten ? labelWritten.parentElement : null;
        if (companyNameGroup) companyNameGroup.style.display = 'block';
        if (writtenParent) writtenParent.style.display = 'none'; // Unification Malt

        // Layout blocks
        const tjmGroup = document.getElementById('tjm-group');
        const videoGroup = document.getElementById('video-presentation-group');
        const portfolioCard = document.getElementById('portfolio-card');
        const companyFields = document.getElementById('company-specific-fields');

        if (tjmGroup) tjmGroup.style.display = 'none';
        if (videoGroup) videoGroup.style.display = 'block';
        if (portfolioCard) portfolioCard.style.display = 'block';
        if (companyFields) companyFields.style.display = 'grid';

        // Metrics & Banners (Institutional Mode)
        const metricsRow = document.getElementById('metrics-row');
        const bannerCard = document.getElementById('banner-card');
        if (metricsRow) metricsRow.style.display = 'flex';
        if (bannerCard) bannerCard.style.display = 'block';

        console.log("CompanyModule: UI Initialized (Institutional Style)");
    },

    // Public Profile Rendering Data
    getPublicMeta: (profileData) => {
        const nameStr = profileData.full_name || 'Entreprise';
        // Business Verification Badge (Malt style - Blue)
        const indicatorHtml = `<span class="verified-badge" style="background:#1e40af; color:white; font-size:0.9rem; padding:4px 10px; border-radius:30px; margin-left:10px; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-check-circle"></i> Entreprise</span>`;

        return {
            nameHtml: `${nameStr} ${indicatorHtml}`,
            title: profileData.title || 'Institution / Entreprise',
            roleLabel: 'Profil Institutionnel',
            roleClass: 'company',
            type: 'company'
        };
    },

    // Explicit HTML Block for Public Profile
    renderFullHTML: (p, companyProjects = []) => {
        const meta = CompanyModule.getPublicMeta(p);
        const combinedAbout = [p.bio, p.written_presentation].filter(t => t && t.trim()).join('<br><br>');
        
        return `
            <div class="profile-card company-card-explicit">
                <div class="section-title">
                    <i class="fas fa-building"></i>
                    Présentation Institutionnelle
                </div>
                <div class="bio-text" id="p-unified-about">
                    ${(combinedAbout || 'Présentation en cours de rédaction.').replace(/\n/g, '<br>')}
                </div>
            </div>
            
            <div id="company-sections">
                <div class="profile-card">
                    <div class="section-title"><i class="fas fa-project-diagram"></i> Projets & Missions Publiés</div>
                    <div class="portfolio-grid" id="p-company-projects">
                        ${CompanyModule.renderProjectItems(companyProjects)}
                    </div>
                </div>
            </div>
        `;
    },

    renderProjectItems: (projects) => {
        const items = Array.isArray(projects) ? projects : [];
        if (items.length === 0) return '<p class="text-muted">Aucun projet publié pour le moment.</p>';
        return items.map(proj => `
            <div class="portfolio-card-premium">
                <div style="display:flex; justify-content:space-between;">
                    <div class="portfolio-icon-box" style="background:rgba(30,58,138,0.1);">${proj.title[0]}</div>
                    <a href="project.html?id=${proj.id}" class="social-sq" style="border-radius:50%;"><i class="fas fa-arrow-right"></i></a>
                </div>
                <div style="margin-top:12px;">
                    <h4 style="margin:0; font-size:1.1rem; font-weight:800;">${proj.title}</h4>
                    <p style="margin:8px 0 0; font-size:0.9rem; color:#64748b;">${proj.description?.slice(0, 100)}...</p>
                </div>
            </div>
        `).join('');
    },

    // Explicit Metrics Block
    renderMetrics: (p) => {
        let html = `
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-calendar-alt"></i><div><span class="metric-label">Création</span><span class="metric-value">${p.creation_year || 'N/A'}</span></div></div>
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-users"></i><div><span class="metric-label">Équipe</span><span class="metric-value">${p.team_size || 'N/A'}</span></div></div>
        `;
        
        if (p.siret) {
            html += `<div class="metric-item" style="grid-column: span 2; border-top: 1px solid #f1f5f9; padding-top:15px; margin-top:5px;"><i class="fas fa-balance-scale"></i><div><span class="metric-label">Professionnel</span><span class="metric-value" style="font-size:0.85rem;">${p.forme_juridique || 'Entrepreneur'} • ${p.siret}</span></div></div>`;
        }
        return html;
    }
};

window.CompanyModule = CompanyModule;
