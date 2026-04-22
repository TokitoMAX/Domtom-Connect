/**
 * Standard Module - Domtom Connect
 * &Eacute;cosyst&egrave;me "Explorateur" / Membre Basique
 * Logic for Basic Members (Premium SaaS Standard)
 */
const StandardModule = {
    role: 'spectateur',

    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'billetterie':
                const billView = document.getElementById('billetterie-view');
                if (billView) {
                    billView.style.display = 'block';
                    if (typeof window.TicketingModule !== 'undefined') {
                        window.TicketingModule.loadMyTicketing(params);
                    }
                }
                break;
            case 'profile':
                await StandardModule.renderProfile(target, profile, session);
                break;
            case 'overview':
            default:
                await StandardModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Discovery Overview (Mobile Harmonized)
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card (Premium SaaS Style) -->
                <div class="dash-welcome-card" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); margin-bottom: 24px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background: rgba(255, 255, 255, 0.1); color: #fff; font-weight: 800; font-size: 0.75rem; text-transform: uppercase;">Espace Explorateur</span>
                        <h1 style="text-transform: capitalize;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                        <p>D&eacute;couvrez le r&eacute;seau et rejoignez des &eacute;cosyst&egrave;mes strat&eacute;giques.</p>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER (Vertical Stacking) -->
                <div class="dash-main-col" style="grid-column: 1 / -1; display: grid; gap: 24px;">
                    
                    <!-- UPGRADE PATHS -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                        <div class="dash-card" style="padding: 32px; background: white; border: 1px solid #e2e8f0;">
                            <div style="width:48px; height:48px; background:#f0fdf4; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Porteur de Projet</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Cr&eacute;ez votre &eacute;pop&eacute;e et trouvez des experts pour la r&eacute;aliser.</p>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button primary" style="background:#0f172a; color:white; border-radius:10px; width:100%;">Lancer mon projet</button>
                        </div>

                        <div class="dash-card" style="padding: 32px; background: white; border: 1px solid #e2e8f0;">
                            <div style="width:48px; height:48px; background:#eff6ff; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #3b82f6;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-19a4 4 0 11-4 4 4 4 0 014-4zm6 19v-2a4 4 0 00-3-3.87m-4-12a4 4 0 014 4" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Expert Territorial</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Proposez vos comp&eacute;tences aux porteurs de projets.</p>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button secondary" style="width:100%; border:1px solid #e2e8f0;">Devenir Expert</button>
                        </div>
                    </div>

                    <!-- OPPORTUNITIES -->
                    <div class="dash-card" style="padding: 32px; background: white; border: 1px solid #e2e8f0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <h3 style="font-size: 1.4rem; font-weight: 950; color:#0f172a; letter-spacing:-0.03em;">Opportunit&eacute;s Flash</h3>
                            <span style="font-size:0.75rem; font-weight:800; color:#10b981; background:rgba(16,185,129,0.05); padding:6px 12px; border-radius:100px;">LIVE COMMUNITY</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                            <div style="padding: 24px; border: 1px solid #f1f5f9; border-radius: 20px;">
                                <div style="font-size:0.65rem; font-weight:850; color:#3b82f6; text-transform:uppercase; margin-bottom:8px;">&Eacute;v&eacute;nement &agrave; la une</div>
                                <h4 style="font-size:1rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Masterclass : Strat&eacute;gie Territoriale 2026</h4>
                                <button onclick="window.Router.navigate('#billetterie')" style="background:none; border:none; color:#10b981; font-weight:800; font-size:0.8rem; cursor:pointer; padding:0;">D&eacute;couvrir →</button>
                            </div>
                            <div style="padding: 24px; border: 1px solid #f1f5f9; border-radius: 20px;">
                                <div style="font-size:0.65rem; font-weight:850; color:#f59e0b; text-transform:uppercase; margin-bottom:8px;">Nouvelle &Eacute;pop&eacute;e</div>
                                <h4 style="font-size:1rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Projet : &Eacute;nergies Vertes Martinique</h4>
                                <button onclick="window.location.href='marketplace/directory.html'" style="background:none; border:none; color:#10b981; font-weight:800; font-size:0.8rem; cursor:pointer; padding:0;">Voir le projet →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Profile View Rendering
     */
    renderProfile: async (container, profile, session) => {
        const view = document.getElementById('profile-view');
        if (!view) return;
        view.style.display = 'block';

        view.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                <div class="dash-card" style="grid-column: 1 / -1; background: white; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0;">
                    <h2 style="font-weight: 900; margin-bottom: 32px; letter-spacing: -0.04em;">Mon Profil Personnel</h2>
                    
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Nom Complet</label>
                            <input type="text" id="profile-full-name" value="${profile.full_name || ''}" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;">
                        </div>
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Titre / Expertise</label>
                            <input type="text" id="profile-title" value="${profile.title || ''}" placeholder="Ex: D&eacute;veloppeur BioTech, Consultant..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;">
                        </div>
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Ma Bio</label>
                            <textarea id="profile-bio" style="width: 100%; min-height: 120px; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 600;">${profile.bio || ''}</textarea>
                        </div>
                        
                        <div style="display: flex; gap: 16px; margin-top: 24px;">
                            <button onclick="StandardModule.saveProfile()" class="cta-button primary" style="background:#10b981; color:white; border:none; padding:16px 32px; border-radius:14px; font-weight:900; width: 100%;">Enregistrer les modifications</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    saveProfile: async () => {
        try {
            const updates = {
                full_name: document.getElementById('profile-full-name').value,
                title: document.getElementById('profile-title').value,
                bio: document.getElementById('profile-bio').value,
                updated_at: new Date().toISOString()
            };

            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expir&eacute;e");

            const { error } = await window._supabase.from('profiles').update(updates).eq('id', session.user.id);
            if (error) throw error;

            alert("\u2705 Profil mis &agrave; jour !");
            window.location.reload();
        } catch (err) {
            alert("\u274c Erreur : " + err.message);
        }
    }
};

window.StandardModule = StandardModule;
