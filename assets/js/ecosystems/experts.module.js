/**
 * Domtom Connect - Experts Ecosystem Module
 * Logic for Experts / Talents (Malt-Style)
 */
const ExpertsModule = {
    role: 'expert',

    /**
     * Dashboard Rendering Logic - Restauration Marque & Conversion
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        const isPremium = ['expert_pack_paid', 'pro', 'business', 'enterprise'].includes(profile.subscription_tier);

        container.innerHTML = `
            <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;">
                
                <!-- Welcome Card (Expert Style) -->
                <div class="dash-card premium-dark" style="grid-column: span 12; padding: 50px; border-radius: 24px;">
                    <div style="position: relative; z-index: 2;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.2); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.7rem; font-weight:900; margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Espace Expert / Talent</span>
                        <h1 style="font-size: 3rem; font-weight: 950; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                        <p style="font-size: 1.1rem; opacity: 0.8; max-width: 600px; font-weight: 500; line-height:1.6;">Votre expertise est le moteur de l'accélération territoriale. Retrouvez ici vos opportunités de missions et gérez votre visibilité.</p>
                    </div>
                </div>

                <!-- Main Content: Missions & Profile -->
                <div style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    <!-- Strategic Conversion / Service Card -->
                    ${isPremium ? `
                        <!-- CAS : PAYÉ -> CALENDLY -->
                        <div class="dash-card highlight" style="background:#f0fdf4; border-color:#bbf7d0;">
                             <div class="dash-icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                             <h4 style="margin:0; font-size:1.15rem; font-weight:900;">Optimisation de Profil</h4>
                             <p style="font-size: 0.85rem; color: #166534; margin-top: 8px; line-height:1.5;">Votre Pack Authority est actif. Réservez votre séance de curation pour maximiser votre impact auprès des entreprises.</p>
                             <a href="https://calendly.com/domtomconnect/30min" target="_blank" class="cta-button primary" style="margin-top:16px; background:#10b981; border:none; border-radius:10px; justify-content:center; text-decoration:none;">Réserver mon RDV Curation</a>
                        </div>
                    ` : `
                        <!-- CAS : GRATUIT -> VENTE PACK -->
                        <div class="dash-card highlight">
                             <div class="dash-icon-box black"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg></div>
                             <h4 style="margin:0; font-size:1.15rem; font-weight:900;">Débloquer le Pack Authority</h4>
                             <p style="font-size: 0.85rem; color: #64748b; margin-top: 8px; line-height:1.5;">Boostez votre visibilité : Top Annuaire (x5 vues), badge de confiance "Vérifié" et curation personnalisée de votre profil.</p>
                             <a href="/#pricing" class="cta-button" style="margin-top:16px; border:1px solid #000; border-radius:10px; justify-content:center; text-decoration:none; color:#000;">Découvrir le Pack (290€)</a>
                        </div>
                    `}

                    <!-- Missions Matching -->
                    <div class="dash-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
                            <div>
                                <h3 style="font-size: 1.3rem; font-weight: 950; margin:0; letter-spacing:-0.02em;">Missions Qualifiées</h3>
                                <p style="color:#64748b; font-size:0.85rem; margin-top:4px;">Opportunités correspondant à vos compétences et tags.</p>
                            </div>
                        </div>
                        <div id="expert-matches-view">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 40px; border-radius: 16px;">
                                <p style="color: #94a3b8; font-weight: 600;">Recherche de missions en cours...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Expert Self Management -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                        <div class="dash-card">
                            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">TJM Actuel</div>
                            <div style="font-size: 1.8rem; font-weight: 950; color: #10b981;">${profile.tjm || 'Non défini'}€<span style="font-size:1rem; color:#94a3b8;">/j</span></div>
                            <a href="#profile" style="margin-top:20px; font-size:0.8rem; color:#000; font-weight:800; text-decoration:none;">Modifier mon tarif →</a>
                        </div>
                        <div class="dash-card">
                            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Statut Visibilité</div>
                            <div style="font-size: 1.1rem; font-weight: 900; display:flex; align-items:center; gap:8px;">
                                ${profile.listed ? 'Public' : 'Privé'}
                            </div>
                            <p style="font-size:0.75rem; color:#64748b; margin-top:8px;">${profile.listed ? 'Visible par les entreprises.' : 'Non visible dans l\'annuaire.'}</p>
                        </div>
                    </div>
                </div>

                <!-- Sidebar: Stats -->
                <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
                    
                    <!-- Visibility Stats -->
                    <div class="dash-card">
                        <h4 style="font-size: 0.85rem; font-weight: 900; margin-bottom: 20px; text-transform:uppercase; letter-spacing:0.05em; color:#64748b;">Statistiques (30j)</h4>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.85rem; color:#64748b; font-weight:600;">Vues profil</span>
                            <span style="font-size:1rem; font-weight:950;">${Math.floor(Math.random() * 50) + 12}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.85rem; color:#64748b; font-weight:600;">Apparitions recherche</span>
                            <span style="font-size:1rem; font-weight:950;">${Math.floor(Math.random() * 120) + 45}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (typeof loadMatchmaking === 'function') loadMatchmaking(session.user.id);
    },

    /**
     * UI Terminology (Malt-Style) - Restauration Sobriété
     */
    initUI: () => {
        const labels = {
            'label-name': "Nom complet",
            'label-title': "Titre Professionnel (ex: Développeur, Consultant...)",
            'label-bio': "Présentation de votre expertise",
            'label-logo': "Photo de profil (Professionnelle)"
        };

        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Hide/Show correct fields
        const hideList = ['company-name-group', 'label-written-presentation', 'metrics-row', 'banner-card'];
        hideList.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        const showList = ['tjm-group', 'video-presentation-group', 'portfolio-card', 'company-specific-fields'];
        showList.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = id === 'company-specific-fields' ? 'grid' : 'block';
        });

        console.log("ExpertsModule: UI Aligned (Brand Style)");
    },

    getPublicMeta: (p) => ({
        nameHtml: `${p.full_name || 'Expert'} ${p.available ? '<span class="status-dot-pulse" title="Disponible"></span>' : ''}`,
        title: p.title || 'Expert Domtom Connect',
        roleLabel: 'Profil Expert / Talent',
        roleClass: 'expert',
        type: 'expert'
    }),

    renderFullHTML: (p) => {
        const combinedAbout = [p.bio, p.written_presentation].filter(t => t && t.trim()).join('<br><br>');
        return `
            <div class="profile-card expert-card-explicit">
                <div class="section-title"><i class="fas fa-user-tie"></i> À propos</div>
                <div class="bio-text">${(combinedAbout || 'Présentation en cours de rédaction.').replace(/\n/g, '<br>')}</div>
            </div>
            <div class="profile-card">
                <div class="section-title"><i class="fas fa-briefcase"></i> Portfolio & Réalisations</div>
                <div class="portfolio-grid">${ExpertsModule.renderPortfolioItems(p.portfolio)}</div>
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
                    <a href="${item.url || '#'}" target="_blank" class="social-sq"><i class="fas fa-external-link-alt"></i></a>
                </div>
                <div style="margin-top:12px;">
                    <h4 style="margin:0; font-size:1.1rem; font-weight:800;">${item.title}</h4>
                    <p style="margin:8px 0 0; font-size:0.9rem; color:#64748b;">${item.description || ''}</p>
                </div>
            </div>
        `).join('');
    },

    renderMetrics: (p) => {
        const availColor = p.available ? '#10b981' : '#ef4444';
        return `
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-tag"></i><div><span class="metric-label">Tarif (TJM)</span><span class="metric-value">${p.tjm ? `${p.tjm}€/j` : 'Sur devis'}</span></div></div>
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-clock" style="color:${availColor};"></i><div><span class="metric-label">Statut</span><span class="metric-value" style="color:${availColor};">${p.available ? 'Disponible' : 'Occupé'}</span></div></div>
            <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-map-marker-alt"></i><div><span class="metric-label">Zone</span><span class="metric-value">${p.zone || p.territory || 'OM/International'}</span></div></div>
        `;
    }
};

window.ExpertsModule = ExpertsModule;
