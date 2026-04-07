/**
 * Domtom Connect - Companies Ecosystem Module
 * Logic for Companies / Recruiters / Institutions
 */
const CompaniesModule = {
    role: 'entreprise',

    /**
     * Dashboard Rendering Logic
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid">
                <!-- Welcome Card -->
                <div class="dash-card welcome-card" style="grid-column: span 12; background: linear-gradient(135.46deg, #064e3b 0%, #065f46 100%); color: white; padding: 48px; border-radius: 32px; position: relative; overflow: hidden;">
                    <div style="position: relative; z-index: 2;">
                        <h1 style="font-size: 3rem; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.04em;">Espace Entreprise</h1>
                        <p style="font-size: 1.1rem; opacity: 0.8; max-width: 600px; font-weight: 500;">Pilotez vos recrutements, gérez vos partenariats et boosts de visibilité territoriale.</p>
                    </div>
                </div>

                <!-- Recruitment Pilotage -->
                <div class="dash-card" style="grid-column: span 8; padding: 32px; border-radius: 24px;">
                    <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 24px;">Pilotage de Recrutement</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="padding: 24px; border: 1px solid #f1f5f9; border-radius: 16px; background: #f8fafc;">
                            <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Missions Actives</div>
                            <div style="font-size: 2rem; font-weight: 900; color: #0284c7;">0</div>
                        </div>
                        <div style="padding: 24px; border: 1px solid #f1f5f9; border-radius: 16px; background: #f8fafc;">
                            <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Matchmaking</div>
                            <div style="font-size: 1.2rem; font-weight: 800;">Accès Premium Requis</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 32px; text-align: center; border: 2px dashed #e2e8f0; padding: 40px; border-radius: 20px;">
                        <p style="color: #64748b; font-weight: 600;">Vous n'avez pas encore publié de mission.</p>
                        <button class="cta-button primary" style="margin: 20px auto 0; background: #000; border: none; border-radius: 12px;">Publier une annonce</button>
                    </div>
                </div>

                <!-- Side Card: Enterprise Pack -->
                <div class="dash-card" style="grid-column: span 4; padding: 32px; border-radius: 24px; background: #f0f9ff; border: 1px solid #bae6fd;">
                    <div style="width: 48px; height: 48px; background: #0284c7; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-7v.01M9 14v.01M9 10v.01M12 10v.01"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Pack Business</h3>
                    <p style="font-size: 0.95rem; color: #0369a1; margin-bottom: 24px; line-height: 1.6;">L'arsenal complet pour les entreprises en croissance. Missions illimitées et sourcing direct.</p>
                    <ul style="list-style: none; padding: 0; margin-bottom: 32px; display: grid; gap: 12px;">
                        <li style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Sourcing Experts illimité
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Boost Visibilité Annuaire
                        </li>
                    </ul>
                    <button class="cta-button primary" style="width: 100%; justify-content: center; background: #0284c7; border: none; border-radius: 12px;">Activer le Pack Business</button>
                </div>
            </div>
        `;
    },

    /**
     * UI Terminology & Field Management (Institutional Style)
     */
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
        if (writtenParent) writtenParent.style.display = 'none';

        // Layout blocks
        const tjmGroup = document.getElementById('tjm-group');
        const videoGroup = document.getElementById('video-presentation-group');
        const portfolioCard = document.getElementById('portfolio-card');
        const companyFields = document.getElementById('company-specific-fields');

        if (tjmGroup) tjmGroup.style.display = 'none';
        if (videoGroup) videoGroup.style.display = 'block';
        if (portfolioCard) portfolioCard.style.display = 'block';
        if (companyFields) companyFields.style.display = 'grid';

        // Metrics & Banners
        const metricsRow = document.getElementById('metrics-row');
        const bannerCard = document.getElementById('banner-card');
        if (metricsRow) metricsRow.style.display = 'flex';
        if (bannerCard) bannerCard.style.display = 'block';

        console.log("CompaniesModule: UI Initialized (Institutional Style)");
    },

    /**
     * Public Profile Meta Generation
     */
    getPublicMeta: (profileData) => {
        const nameStr = profileData.full_name || 'Entreprise';
        const indicatorHtml = `<span class="verified-badge" style="background:#1e40af; color:white; font-size:0.9rem; padding:4px 10px; border-radius:30px; margin-left:10px; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-check-circle"></i> Entreprise</span>`;

        return {
            nameHtml: `${nameStr} ${indicatorHtml}`,
            title: profileData.title || 'Institution / Entreprise',
            roleLabel: 'Profil Institutionnel',
            roleClass: 'company',
            type: 'company'
        };
    },

    /**
     * Public Profile Full HTML Rendering
     */
    renderFullHTML: (p, companyProjects = []) => {
        const meta = CompaniesModule.getPublicMeta(p);
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
                        ${CompaniesModule.renderProjectItems(companyProjects)}
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
                    <div class="portfolio-icon-box" style="background:rgba(30,58,138,0.1);">${proj.title ? proj.title[0] : 'P'}</div>
                    <a href="project.html?id=${proj.id}" class="social-sq" style="border-radius:50%;"><i class="fas fa-arrow-right"></i></a>
                </div>
                <div style="margin-top:12px;">
                    <h4 style="margin:0; font-size:1.1rem; font-weight:800;">${proj.title}</h4>
                    <p style="margin:8px 0 0; font-size:0.9rem; color:#64748b;">${proj.description?.slice(0, 100)}...</p>
                </div>
            </div>
        `).join('');
    },

    /**
     * Profile Metrics Rendering
     */
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

window.CompaniesModule = CompaniesModule;
