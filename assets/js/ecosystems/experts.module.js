/**
 * Domtom Connect - Experts Ecosystem Module
 * Logic for Experts / Talents (Malt-Style)
 */
const ExpertsModule = {
    role: 'expert',

    /**
     * Dashboard Rendering Logic - Restauration Marque & Conversion Authority
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        const isAuthority = window.isPremiumUser(profile);

        container.innerHTML = `
            <div class="dashboard-grid role-expert-grid" style="display: grid; gap: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card (Expert Style) -->
                <div class="dash-card premium-dark" style="grid-column: 1/-1; border-radius: 20px; background: #0f172a; border: 1px solid #1e293b;">
                    <div style="position: relative; z-index: 2; padding: 40px;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Espace Expert / Talent</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; font-weight: 500; line-height:1.6;">Gérez votre visibilité et accédez aux opportunités de missions sur le territoire.</p>
                    </div>
                </div>

                <!-- Main Section -->
                <div class="dash-main-col" style="grid-column: span 1; display: grid; gap: 24px;">
                    
                    <!-- Finance Quick Access -->
                    <div class="dash-card highlight" style="background:#f8fafc; border: 1px solid #e2e8f0; padding: 32px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                         <div>
                            <h4 style="margin:0; font-size:1.25rem; font-weight:800; color:#0f172a;">Module Business Actif</h4>
                            <p style="font-size: 0.95rem; color: #475569; line-height:1.6; margin: 8px 0 0 0;">Utilisez notre suite native pour émettre vos devis et facturer vos missions en toute sécurité.</p>
                         </div>
                         <button onclick="showView('business')" class="cta-button primary" style="background:#0f172a; border:none; border-radius:12px; font-weight:800; padding:14px 28px;">Accéder au Module →</button>
                    </div>

                    <!-- Missions matching placeholder -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px;">
                        <h3 style="font-size: 1.3rem; font-weight: 800; margin:0 0 20px 0; color:#0f172a;">Missions Qualifiées</h3>
                        <div id="expert-matches-view">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 48px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600; font-size: 0.95rem;">Recherche de missions correspondant à votre profil...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="dash-side-col" style="grid-column: span 1; display: flex; flex-direction: column; gap: 24px;">
                    <div class="dash-card" style="border-radius: 16px; padding: 24px;">
                        <h4 style="font-size: 0.8rem; font-weight: 800; margin-bottom: 20px; text-transform:uppercase; color:#64748b; letter-spacing:0.05em;">Performance Profil</h4>
                        <div style="display:flex; flex-direction:column; gap:16px;">
                             <div style="display:flex; justify-content:space-between; align-items:center;">
                                 <span style="font-size:0.9rem; color:#64748b; font-weight:600;">Vues (30j)</span>
                                 <span style="font-size:1.1rem; font-weight:800; color:#0f172a;">—</span>
                             </div>
                             <div style="display:flex; justify-content:space-between; align-items:center;">
                                 <span style="font-size:0.9rem; color:#64748b; font-weight:600;">Apparitions</span>
                                 <span style="font-size:1.1rem; font-weight:800; color:#0f172a;">—</span>
                             </div>
                             <p style="font-size:0.7rem; color:#94a3b8; margin:0; font-style:italic;">Suivi en cours d'activation</p>
                        </div>
                    </div>

                    <div class="dash-card" style="border-radius: 16px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 800; margin-bottom: 12px; text-transform:uppercase; color:#64748b; letter-spacing:0.05em;">Finance & Devis</h4>
                        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 16px; line-height:1.4;">Émettez vos devis et factures directement via la plateforme.</p>
                        <button onclick="showView('business')" class="cta-button primary" style="width:100%; font-size:0.8rem; background:#0f172a; border:none; justify-content:center;">Gérer mes devis</button>
                    </div>

                    <div class="dash-card" style="border-radius: 16px; padding: 24px;">
                        <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Tarif Journalier (TJM)</div>
                        <div style="font-size: 1.6rem; font-weight: 800; color: #10b981;">${profile.tjm || '—'}€<span style="font-size:0.9rem; color:#94a3b8;">/j</span></div>
                        <a href="#profile" style="display:inline-block; margin-top:20px; font-size:0.85rem; color:#0f172a; font-weight:800; text-decoration:none;">Modifier mon profil →</a>
                    </div>
                </div>
            </div>
        `;
        
        if (typeof loadMatchmaking === 'function') loadMatchmaking(session.user.id);
    },

    /**
     * UI Terminology - Restauration Sobriété Charte
     */
    initUI: () => {
        const labels = {
            'label-name': "Prénom & Nom",
            'label-title': "Titre Professionnel (ex: Consultant IT)",
            'label-bio': "Manifeste de votre expertise",
            'label-logo': "Photo de profil pro"
        };

        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Hide/Show correct fields
        ['company-name-group', 'label-written-presentation', 'metrics-row', 'banner-card'].forEach(id => {
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
