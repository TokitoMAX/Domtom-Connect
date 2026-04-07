/**
 * Domtom Connect - Experts Ecosystem Module
 * Logic for Experts / Talents (Malt-Style)
 */
const ExpertsModule = {
    role: 'expert',

    /**
     * Dashboard Rendering Logic
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        const tier = profile.subscription_tier || 'free';

        container.innerHTML = `
            <div class="dashboard-grid">
                <!-- Welcome Card -->
                <div class="dash-card welcome-card" style="grid-column: span 12; background: linear-gradient(135.46deg, #000000 0%, #1a1a1a 100%); color: white; padding: 48px; border-radius: 32px; position: relative; overflow: hidden;">
                    <div style="position: relative; z-index: 2;">
                        <h1 style="font-size: 3rem; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                        <p style="font-size: 1.1rem; opacity: 0.8; max-width: 600px; font-weight: 500;">Votre expertise est le moteur de l'accélération territoriale. Gérez vos missions et votre visibilité.</p>
                    </div>
                </div>

                <!-- Expert Main Actions -->
                <div class="dash-card" style="grid-column: span 8; padding: 32px; border-radius: 24px;">
                    <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 24px;">Pilotage de Missions</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="padding: 24px; border: 1px solid #f1f5f9; border-radius: 16px; background: #f8fafc;">
                            <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">TJM Actuel</div>
                            <div style="font-size: 2rem; font-weight: 900; color: #10b981;">${profile.tjm || 'Non défini'}€<span style="font-size:1rem; color:#94a3b8;">/j</span></div>
                        </div>
                        <div style="padding: 24px; border: 1px solid #f1f5f9; border-radius: 16px; background: #f8fafc;">
                            <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Statut</div>
                            <div style="font-size: 1.2rem; font-weight: 800;">${profile.listed ? '🚀 Profil Public' : '🛠️ En Brouillon'}</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 32px; padding: 24px; background: #000; color: white; border-radius: 16px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 700; font-size: 1.1rem;">Optimisez votre visibilité</div>
                            <div style="font-size: 0.9rem; opacity: 0.7;">Complétez votre portfolio pour rassurer les porteurs de projets.</div>
                        </div>
                        <a href="/profile" class="cta-button" style="background: white; color: black; border-radius: 10px; padding: 12px 20px; font-weight: 800;">Éditer mon Profil</a>
                    </div>
                </div>

                <!-- Expert Side Card: Authority Pack -->
                <div class="dash-card" style="grid-column: span 4; padding: 32px; border-radius: 24px; background: #f8fafc; border: 1px solid #e2e8f0;">
                    <div style="width: 48px; height: 48px; background: #7c3aed; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Pack Authority</h3>
                    <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 24px; line-height: 1.6;">Devenez la référence de votre secteur avec le badge vérifié et le boost de visibilité.</p>
                    <ul style="list-style: none; padding: 0; margin-bottom: 32px; display: grid; gap: 12px;">
                        <li style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Badge Expert Vérifié
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Mise en avant Annuaire
                        </li>
                    </ul>
                    <button class="cta-button primary" style="width: 100%; justify-content: center; background: #7c3aed; border: none; border-radius: 12px;">En savoir plus</button>
                </div>
            </div>
        `;
    },

    /**
     * UI Terminology & Field Management (Malt-Style)
     */
    initUI: () => {
        // Labels
        const labelName = document.getElementById('label-name');
        const labelTitle = document.getElementById('label-title');
        const labelBio = document.getElementById('label-bio');
        const labelLogo = document.getElementById('label-logo');
        const labelWritten = document.getElementById('label-written-presentation');

        if (labelName) labelName.textContent = "Nom complet";
        if (labelTitle) labelTitle.textContent = "Titre Professionnel Accrocheur";
        if (labelBio) labelBio.textContent = "Ma Présentation Professionnelle (À propos)";
        if (labelLogo) labelLogo.textContent = "Photo de profil";

        // Placeholders
        const inputTitle = document.getElementById('title');
        const inputBio = document.getElementById('bio');
        if (inputTitle) inputTitle.placeholder = "Ex : Consultant en Stratégie, Développeur Full-Stack...";
        if (inputBio) inputBio.placeholder = "Malt-style : Racontez votre parcours, vos compétences et ce que vous proposez.";

        // Hide redundant blocks
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

        console.log("ExpertsModule: UI Initialized (Malt-Style)");
    },

    /**
     * Public Profile Meta Generation
     */
    getPublicMeta: (profileData) => {
        const nameStr = profileData.full_name || 'Expert';
        const indicatorHtml = profileData.available 
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

    /**
     * Public Profile Full HTML Rendering
     */
    renderFullHTML: (p) => {
        const meta = ExpertsModule.getPublicMeta(p);
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
                        ${ExpertsModule.renderPortfolioItems(p.portfolio)}
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

    /**
     * Profile Metrics Rendering
     */
    renderMetrics: (p) => {
        const avail = p.available;
        const availText = avail ? 'Disponible' : 'Indisponible';
        const availColor = avail ? '#10b981' : '#ef4444';
        
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

window.ExpertsModule = ExpertsModule;
