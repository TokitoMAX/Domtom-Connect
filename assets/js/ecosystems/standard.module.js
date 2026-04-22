/**
 * Standard Module - Domtom Connect
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
     * Dashboard Home - Discovery Overview (Mobile Harmonized - Black/Green)
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card (Native Black/Green) -->
                <div class="dash-welcome-card" style="background: #0f172a; margin-bottom: 24px; border-radius: 24px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 800; font-size: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.3);">ESPACE EXPLORATEUR</span>
                        <h1 style="color: white; text-transform: capitalize;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                        <p style="color: rgba(255,255,255,0.7);">D&eacute;couvrez le r&eacute;seau et rejoignez des &eacute;cosyst&egrave;mes strat&eacute;giques.</p>
                    </div>
                </div>

                <div class="dash-main-col" style="grid-column: 1 / -1; display: grid; gap: 24px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                        <div class="dash-card" style="padding: 32px; background: white; border: 1px solid #e2e8f0;">
                            <div style="width:48px; height:48px; background:rgba(16, 185, 129, 0.1); border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Porteur de Projet</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Cr&eacute;ez votre &eacute;pop&eacute;e et trouvez des experts pour la r&eacute;aliser.</p>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button primary" style="background:#0f172a; color:white; border-radius:10px; width:100%; border:none;">Lancer mon projet</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Profile View - Smart Orchestrator
     */
    renderProfile: async (container, profile, session) => {
        const view = container || document.getElementById('ecosystem-grid-container');
        if (!view) return;

        // Determine specialized component
        const role = profile.role || 'spectateur';
        let specializedFields = '';
        
        if (role === 'expert' && window.ExpertsModule?.renderProfileFields) {
            specializedFields = window.ExpertsModule.renderProfileFields(profile);
        } else if (role === 'entreprise' && window.CompaniesModule?.renderProfileFields) {
            specializedFields = window.CompaniesModule.renderProfileFields(profile);
        } else if (role === 'owner' && window.OwnersModule?.renderProfileFields) {
            specializedFields = window.OwnersModule.renderProfileFields(profile);
        }

        view.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                <div class="dash-card" style="grid-column: 1 / -1; background: white; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0;">
                    <h2 style="font-weight: 900; margin-bottom: 32px; letter-spacing: -0.04em;">Mon Profil Professionnel</h2>
                    
                    <div id="profile-editor-form" style="display: flex; flex-direction: column; gap: 24px;">
                        <!-- Global Basic Fields -->
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Nom Complet / Public</label>
                            <input type="text" id="profile-full-name" value="${profile.full_name || ''}" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;">
                        </div>
                        
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Titre / Fonction</label>
                            <input type="text" id="profile-title" value="${profile.title || ''}" placeholder="Ex: Développeur Senior, PDG, etc." style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;">
                        </div>

                        <!-- Specialized Fields Injection -->
                        <div id="specialized-profile-fields" style="display:grid; gap:24px;">
                            ${specializedFields}
                        </div>

                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Bio / Pr&eacute;sentation</label>
                            <textarea id="profile-bio" style="width: 100%; min-height: 120px; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 600;">${profile.bio || ''}</textarea>
                        </div>
                        
                        <div style="display: flex; gap: 16px; margin-top: 24px;">
                            <button onclick="StandardModule.saveProfile()" class="cta-button primary" style="background:#10b981; color:white; border:none; padding:18px 32px; border-radius:14px; font-weight:900; width: 100%; cursor:pointer;">Enregistrer mon profil →</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Unified Save Logic
     */
    saveProfile: async () => {
        try {
            const updates = {
                full_name: document.getElementById('profile-full-name').value,
                title: document.getElementById('profile-title').value,
                bio: document.getElementById('profile-bio').value,
                updated_at: new Date().toISOString()
            };

            // Collect data from specialized fields if they exist
            const fields = [
                'tjm', 'availability', 'skills', 'siret', 'website', 
                'sector', 'company_name', 'project_desc', 'budget'
            ];
            
            fields.forEach(f => {
                const el = document.getElementById('profile-' + f);
                if (el) updates[f] = el.value;
            });

            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expir\u00e9e");

            const { error } = await window._supabase.from('profiles').update(updates).eq('id', session.user.id);
            if (error) throw error;

            alert("\u2705 Profil professionnel mis \u00e0 jour !");
            window.location.reload();
        } catch (err) {
            alert("\u274c Erreur : " + err.message);
        }
    }
};

window.StandardModule = StandardModule;
