/**
 * Domtom Connect - Company Ecosystem Module
 * Logic for Companies (Partner SaaS Standard)
 */
const CompaniesModule = {
    role: 'entreprise',

    /**
     * Module Router
     */
    route: async (view_id, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (view_id) {
            case 'profile':
                if (window.StandardModule) {
                    window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView && window.BusinessModule) {
                    bizView.style.display = 'block';
                    window.BusinessModule.renderDashboard(bizView);
                }
                break;
            case 'collaboration':
                if (window.CollaborationModule) {
                    await window.CollaborationModule.route('overview', target, profile, session, params);
                }
                break;
            case 'overview':
            default:
                CompaniesModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Institutional Presentation (Mobile Fixed)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <style>
                .ecosystem-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 32px;
                    align-items: start;
                }
                .ecosystem-header h1 { font-size: 2.8rem; }
                @media (max-width: 900px) {
                    .ecosystem-grid {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    .ecosystem-header {
                        flex-direction: column !important;
                        text-align: center;
                        padding: 30px 20px !important;
                    }
                    .ecosystem-header h1 { font-size: 1.8rem !important; }
                }
            </style>

            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <div class="ecosystem-grid">
                    
                    <!-- LEFT COLUMN: CONTENT -->
                    <div class="dash-left-col">
                        
                        <!-- Institutional Header -->
                        <div class="ecosystem-header" style="background: #0f172a; border-radius: 24px; padding: 40px; margin-bottom: 32px; display: flex; align-items: center; gap: 32px;">
                            <div style="width: 120px; height: 120px; background: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 10px; flex-shrink: 0; margin: 0 auto;">
                                <img src="${profile.avatar_url || 'https://domtom-connect.com/assets/img/logo_mini.png'}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                            </div>
                            <div>
                                <span class="role-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight:800;">ESPACE INSTITUTIONNEL</span>
                                <h1 style="color: white; margin: 12px 0 8px 0; font-weight: 900;">${profile.company_name || profile.full_name}</h1>
                                <p style="color: rgba(255,255,255,0.7); font-size: 1.1rem; font-weight: 600;">Institution / Entreprise</p>
                            </div>
                        </div>

                        <!-- Présentation Core -->
                        <div class="dash-card" style="padding: 32px; margin-bottom: 32px;">
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                                <div style="width: 48px; height: 48px; background: rgba(15, 23, 42, 0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0f172a;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18m6-18v18M3 9h18M3 15h18"/></svg>
                                </div>
                                <h3 style="font-size: 1.4rem; font-weight: 950; text-transform: uppercase;">Pr&eacute;sentation Institutionnelle</h3>
                            </div>
                            <p style="font-size: 1.1rem; color: #475569; line-height: 1.7; margin-bottom: 24px;">${profile.bio || 'Acc&eacute;l&eacute;rez vos projets strat&eacute;giques aux Antilles et en Guyane.'}</p>
                            <button onclick="window.Router.navigate('#collaboration')" class="cta-button" style="border: 1px solid #e2e8f0; background: #f8fafc; padding: 12px 24px; border-radius: 10px; font-weight: 700; color: #0f172a; cursor: pointer;">Gestion de projet</button>
                        </div>

                        <!-- Missions Section -->
                        <div class="dash-card" style="padding: 32px;">
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
                                <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                </div>
                                <h3 style="font-size: 1.4rem; font-weight: 950; text-transform: uppercase;">Projets & Missions Publi&eacute;s</h3>
                            </div>
                            <div id="company-active-missions" style="background: #f8fafc; border-radius: 20px; padding: 32px; border: 1.5px solid #f1f5f9; text-align: center;">
                                <p style="color: #94a3b8; font-weight: 800;">Aucune mission active pour le moment.</p>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: SIDEBAR -->
                    <div class="dash-side-col">
                        
                        <!-- Action Center -->
                        <button onclick="window.Router.navigate('#collaboration')" style="width: 100%; padding: 24px; background: #2563eb; color: white; border: none; border-radius: 20px; font-weight: 950; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(37,99,235,0.2);">
                            Collaborer
                        </button>

                        <!-- Social Pulse -->
                        <div style="display: flex; justify-content: space-between; margin-bottom: 32px; gap:10px; flex-wrap:wrap;">
                            <a href="${profile.website || '#'}" target="_blank" style="width:48px; height:48px; border-radius:12px; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></a>
                            <a href="${profile.linkedin || '#'}" target="_blank" style="width:48px; height:48px; border-radius:12px; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
                            <a href="${profile.instagram || '#'}" target="_blank" style="width:48px; height:48px; border-radius:12px; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg></a>
                            <a href="${profile.youtube || '#'}" target="_blank" style="width:48px; height:48px; border-radius:12px; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 001.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 001.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></a>
                            <a href="${profile.tiktok || '#'}" target="_blank" style="width:48px; height:48px; border-radius:12px; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5h-4v2h2a3 3 0 11-3-3V4H9v8z"/></svg></a>
                        </div>

                        <!-- Metadata List -->
                        <div style="display: grid; gap: 12px;">
                            <div class="meta-item" style="background:#f8fafc; padding:20px; border-radius:16px; display:flex; align-items:center; gap:20px;">
                                <div style="color:#2563eb;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                                <div><div style="font-size:0.6rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Cr&eacute;ation</div><div style="font-weight:900; color:#0f172a;">${profile.creation_year || '2025'}</div></div>
                            </div>
                            <div class="meta-item" style="background:#f8fafc; padding:20px; border-radius:16px; display:flex; align-items:center; gap:20px;">
                                <div style="color:#2563eb;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>
                                <div><div style="font-size:0.6rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">&Eacute;quipe</div><div style="font-weight:900; color:#0f172a;">${profile.team_size || 'Ind&eacute;pendant'}</div></div>
                            </div>
                            <div class="meta-item" style="background:#f8fafc; padding:20px; border-radius:16px; display:flex; align-items:center; gap:20px;">
                                <div style="color:#2563eb;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
                                <div><div style="font-size:0.6rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Secteur</div><div style="font-weight:900; color:#0f172a;">${profile.sector || 'Marketing & Communication'}</div></div>
                            </div>
                            <div class="meta-item" style="background:#f8fafc; padding:20px; border-radius:16px; display:flex; align-items:center; gap:20px;">
                                <div style="color:#2563eb;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                                <div><div style="font-size:0.6rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Zone</div><div style="font-weight:900; color:#0f172a;">${profile.zone || 'Paris'}</div></div>
                            </div>
                            <div class="meta-item" style="background:#f8fafc; padding:20px; border-radius:16px; display:flex; align-items:center; gap:20px;">
                                <div style="color:#2563eb;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                                <div><div style="font-size:0.6rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">SIRET</div><div style="font-weight:900; color:#0f172a;">${profile.siret || '93462953600012'}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Specialized Fields (Responsive)
     */
    renderProfileFields: (profile) => {
        return `
            <style>
                .profile-grid-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                @media (max-width: 600px) { .profile-grid-fields { grid-template-columns: 1fr !important; } }
            </style>
            <div style="background:#f8fafc; padding:24px; border-radius:20px; border:1px solid #f1f5f9; display:grid; gap:24px;">
                <h3 style="font-size:0.85rem; font-weight:900; color:#10b981; text-transform:uppercase; letter-spacing:0.05em;">D&eacute;tails Institutionnels</h3>
                <div class="profile-grid-fields">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">SIRET</label>
                        <input type="text" id="profile-siret" value="${profile.siret || ''}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Zone / R&eacute;gion</label>
                        <input type="text" id="profile-zone" value="${profile.zone || ''}" placeholder="Ex: Paris, Martinique..." style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                </div>
                <div class="profile-grid-fields">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Ann&eacute;e de Cr&eacute;ation</label>
                        <input type="number" id="profile-creation_year" value="${profile.creation_year || 2025}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Taille d'&eacute;quipe</label>
                        <input type="text" id="profile-team_size" value="${profile.team_size || ''}" placeholder="Ex: Indépendant, 10-50, etc." style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                </div>
                <div class="info-field">
                    <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Secteur d'Activit&eacute;</label>
                    <input type="text" id="profile-sector" value="${profile.sector || ''}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                </div>
            </div>
        `;
    }
};

window.CompaniesModule = CompaniesModule;
