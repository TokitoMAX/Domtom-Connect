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
            <div class="dash-grid-layout" style="font-family: 'Inter', sans-serif; display: grid; grid-template-columns: 1fr 340px; gap: 32px; padding: 20px;">
                
                <!-- MAIN CONTENT -->
                <div class="dash-main-col">
                    
                    <!-- Institutional Refined Header -->
                    <div style="background: #020617; border-radius: 24px; padding: 48px; margin-bottom: 32px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 32px;">
                        <div style="position: absolute; top:0; right:0; width: 300px; height: 100%; background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%);"></div>
                        <div style="width: 100px; height: 100px; background: white; border-radius: 18px; display: flex; align-items: center; justify-content: center; padding: 12px; flex-shrink: 0; position: relative; z-index: 2;">
                            <img src="${profile.avatar_url || 'https://domtom-connect.com/assets/img/logo_mini.png'}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <div style="position: relative; z-index: 2;">
                            <span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 6px 14px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.05em; border: 1px solid rgba(16,185,129,0.2);">ESPACE INSTITUTIONNEL</span>
                            <h1 style="color: white; margin: 12px 0 4px 0; font-size: 2.2rem; font-weight: 900; letter-spacing: -0.02em;">${profile.company_name || profile.full_name}</h1>
                            <p style="color: rgba(255,255,255,0.5); font-weight: 600;">Institution / Entreprise</p>
                        </div>
                    </div>

                    <!-- Cards -->
                    <div class="dash-card" style="padding: 40px; margin-bottom: 32px; border-radius: 24px; background: white; border: 1px solid #f1f5f9;">
                        <h3 style="font-size: 1rem; font-weight: 900; color: #020617; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                            Pr&eacute;sentation
                        </h3>
                        <p style="font-size: 1.15rem; color: #475569; line-height: 1.7;">${profile.bio || 'Acc&eacute;l&eacute;rez vos projets strat&eacute;giques aux Antilles et en Guyane.'}</p>
                    </div>

                    <div class="dash-card" style="padding: 40px; border-radius: 24px; background: white; border: 1px solid #f1f5f9;">
                        <h3 style="font-size: 1rem; font-weight: 900; color: #020617; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 32px; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
                            Missions Publi&eacute;es
                        </h3>
                        <div style="background: #f8fafc; border-radius: 20px; padding: 48px; text-align: center; border: 1.5px dashed #e2e8f0;">
                            <p style="color: #94a3b8; font-weight: 700;">Aucune mission active pour le moment.</p>
                        </div>
                    </div>
                </div>

                <!-- SIDEBAR -->
                <div class="dash-side-col">
                    <button onclick="window.Router.navigate('#collaboration')" style="width: 100%; padding: 22px; background: #020617; color: white; border: none; border-radius: 18px; font-weight: 900; font-size: 1.1rem; cursor: pointer; margin-bottom: 32px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 12px;" onmouseover="this.style.background='#10b981'" onmouseout="this.style.background='#020617'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Collaborer
                    </button>

                    <div style="background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px;">Identit&eacute; Digitale</h4>
                        <div style="display: grid; gap: 16px;">
                            <div style="display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 14px; background: #f8fafc;">
                                <div style="color: #10b981;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                                <div><div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Cr&eacute;ation</div><div style="color: #020617; font-weight: 900;">${profile.creation_year || '2025'}</div></div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 14px; background: #f8fafc;">
                                <div style="color: #3b82f6;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                                <div><div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">&Eacute;quipe</div><div style="color: #020617; font-weight: 900;">${profile.team_size || 'Ind&eacute;pendant'}</div></div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 14px; background: #f8fafc;">
                                <div style="color: #f59e0b;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                                <div><div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">SIRET</div><div style="color: #020617; font-weight: 900;">${profile.siret || '93462953600012'}</div></div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 12px; margin-top: 32px;">
                            <a href="${profile.linkedin || '#'}" style="flex:1; height:48px; background:#f8fafc; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#94a3b8;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
                            <a href="${profile.website || '#'}" style="flex:1; height:48px; background:#f8fafc; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#94a3b8;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></a>
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
