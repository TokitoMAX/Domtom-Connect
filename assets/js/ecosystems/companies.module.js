/**
 * Domtom Connect - Companies Ecosystem Module
 * Logic for Companies / Recruiters / Institutions
 */
const CompaniesModule = {
    role: 'entreprise',

    /**
     * Dashboard Rendering Logic - Refonte Premium & Sourcing
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;">
                
                <!-- Welcome Card (Enterprise Style) -->
                <div class="dash-card premium-dark" style="grid-column: span 12; padding: 60px; border-radius: 40px; background: linear-gradient(135.46deg, #064e3b 0%, #065f46 100%); position: relative; overflow: hidden;">
                    <div style="position: relative; z-index: 2;">
                        <span style="display:inline-block; background:rgba(255, 255, 255, 0.1); color:white; padding:6px 16px; border-radius:100px; font-size:0.75rem; font-weight:900; margin-bottom:20px; letter-spacing:0.05em; text-transform:uppercase;">Espace Entreprise / Institution</span>
                        <h1 style="font-size: 3.5rem; font-weight: 950; margin-bottom: 16px; letter-spacing: -0.04em; line-height:1;">${profile.full_name || 'Entreprise'}</h1>
                        <p style="font-size: 1.25rem; opacity: 0.8; max-width: 650px; font-weight: 500; line-height:1.6;">Pilotez vos recrutements et trouvez les meilleurs talents pour vos projets stratégiques.</p>
                    </div>
                </div>

                <!-- Main Content: Recruitment & Sourcing -->
                <div style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    <!-- Sourcing Card -->
                    <div class="dash-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 900; margin:0; letter-spacing:-0.03em;">Sourcing Talents</h3>
                                <p style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">Trouvez des experts et freelances qualifiés dans votre région.</p>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                            <a href="/marketplace/directory" class="dash-card highlight" style="text-decoration:none; text-align:center; padding:24px;">
                                <div style="font-size:1.5rem; margin-bottom:8px;">🔍</div>
                                <div style="font-weight:800; color:#065f46;">Annuaire Experts</div>
                                <div style="font-size:0.75rem; color:#64748b;">Accès aux profils vérifiés</div>
                            </a>
                            <div class="dash-card highlight" style="text-align:center; padding:24px; opacity:0.8;">
                                <div style="font-size:1.5rem; margin-bottom:8px;">🤖</div>
                                <div style="font-weight:800; color:#065f46;">Matchmaking IA</div>
                                <div style="font-size:0.75rem; color:#64748b;">Bientôt disponible</div>
                            </div>
                        </div>
                    </div>

                    <!-- Job Pilotage -->
                    <div class="dash-card">
                        <h3 style="font-size: 1.3rem; font-weight: 900; margin-bottom: 20px;">Mes Annonces & Missions</h3>
                        <div id="company-jobs-view">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 40px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600;">Vous n'avez aucune annonce active.</p>
                                <button class="cta-button primary" style="background:#065f46; margin-top:16px; border-radius:10px;">+ Publier un poste</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar: Stats & Business Pack -->
                <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
                    
                    <!-- Business Pack -->
                    <div class="dash-card" style="background: #ecfdf5; border-color: #a7f3d0;">
                        <div style="width: 48px; height: 48px; background: #059669; color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-7v.01M9 14v.01M9 10v.01M12 10v.01"/></svg>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 850; margin-bottom: 8px;">Pack Business</h3>
                        <p style="font-size: 0.85rem; color: #064e3b; margin-bottom: 20px; line-height: 1.5;">Gérez vos recrutements en illimité et boostez votre marque employeur.</p>
                        <button class="cta-button primary" style="width: 100%; justify-content: center; background: #059669; border: none; border-radius:12px;">Activer</button>
                    </div>

                    <!-- Company Stats -->
                    <div class="dash-card">
                        <h4 style="font-size: 0.9rem; font-weight: 900; margin-bottom: 16px; text-transform:uppercase; color:#64748b;">Impact Recrutement</h4>
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                            <span style="font-size:0.85rem; color:#64748b;">Postulants vus</span>
                            <span style="font-size:1.1rem; font-weight:950;">0</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:0.85rem; color:#64748b;">Vues sur vos annonces</span>
                            <span style="font-size:1.1rem; font-weight:950;">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * UI Terminology (Institutional Style) - Clarification Pédagogique
     */
    initUI: () => {
        const labels = {
            'label-name': "Nom de l'Entreprise / Institution",
            'label-title': "Secteur d'Activité principal",
            'label-bio': "Présentation Institutionnelle (Vision & Offre)",
            'label-logo': "Logo de l'entreprise"
        };

        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Hide/Show correct fields
        const hideList = ['tjm-group', 'label-written-presentation'];
        hideList.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        const showList = ['company-name-group', 'video-presentation-group', 'portfolio-card', 'company-specific-fields', 'metrics-row', 'banner-card'];
        showList.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = id === 'company-specific-fields' ? 'grid' : (id === 'metrics-row' ? 'flex' : 'block');
        });

        console.log("CompaniesModule: UI Initialized (Institutional Style)");
    },

    getPublicMeta: (p) => {
        const nameStr = p.full_name || 'Entreprise';
        const badge = `<span class="verified-badge" style="background:#1e40af; color:white; font-size:0.75rem; padding:4px 10px; border-radius:30px; margin-left:10px; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-check-circle"></i> Entreprise</span>`;
        return {
            nameHtml: `${nameStr} ${badge}`,
            title: p.title || 'Institution / Entreprise',
            roleLabel: 'Profil Entreprise',
            roleClass: 'company',
            type: 'company'
        };
    },

    renderFullHTML: (p, companyProjects = []) => {
        const combinedAbout = [p.bio, p.written_presentation].filter(t => t && t.trim()).join('<br><br>');
        return `
            <div class="profile-card company-card-explicit">
                <div class="section-title"><i class="fas fa-building"></i> Présentation Institutionnelle</div>
                <div class="bio-text">${(combinedAbout || 'Présentation en cours de rédaction.').replace(/\n/g, '<br>')}</div>
            </div>
            <div class="profile-card">
                <div class="section-title"><i class="fas fa-project-diagram"></i> Projets & Missions Publiés</div>
                <div class="portfolio-grid">${CompaniesModule.renderProjectItems(companyProjects)}</div>
            </div>
        `;
    },

    renderProjectItems: (projects) => {
        const items = Array.isArray(projects) ? projects : [];
        if (items.length === 0) return '<p class="text-muted">Aucun projet publié.</p>';
        return items.map(proj => `
            <div class="portfolio-card-premium">
                <div style="display:flex; justify-content:space-between;">
                    <div class="portfolio-icon-box" style="background:rgba(30,58,138,0.1); color:#1e40af;">${proj.title ? proj.title[0] : 'P'}</div>
                    <a href="project.html?id=${proj.id}" class="social-sq"><i class="fas fa-arrow-right"></i></a>
                </div>
                <div style="margin-top:12px;">
                    <h4 style="margin:0; font-size:1.1rem; font-weight:800;">${proj.title}</h4>
                    <p style="margin:8px 0 0; font-size:0.8rem; color:#64748b;">${proj.description?.slice(0, 80)}...</p>
                </div>
            </div>
        `).join('');
    },

    renderMetrics: (p) => `
        <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-calendar-alt"></i><div><span class="metric-label">Création</span><span class="metric-value">${p.creation_year || 'N/A'}</span></div></div>
        <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-users"></i><div><span class="metric-label">Équipe</span><span class="metric-value">${p.team_size || 'N/A'}</span></div></div>
        <div class="metric-item" style="grid-column: span 2;"><i class="fas fa-map-marker-alt"></i><div><span class="metric-label">Siège</span><span class="metric-value">${p.zone || p.territory || 'OM'}</span></div></div>
    `
};

window.CompaniesModule = CompaniesModule;
