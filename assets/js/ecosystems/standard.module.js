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
     * Dashboard Home - Discovery Overview
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;
        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                <div class="dash-welcome-card" style="background: #0f172a; border-radius: 24px; margin-bottom: 24px;">
                    <span class="role-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 800; font-size: 0.75rem;">ESPACE EXPLORATEUR</span>
                    <h1 style="color: white; margin-top:12px;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                    <p style="color: rgba(255,255,255,0.7);">D&eacute;couvrez l'annuaire et commencez votre &eacute;pop&eacute;e.</p>
                </div>
                <div style="display:grid; gap:24px;">
                    <button onclick="window.Router.navigate('#profile')" class="cta-button primary" style="background:#0f172a; color:white; border-radius:12px; padding:20px; font-weight:850; border:none; cursor:pointer;">Devenir Porteur ou Expert</button>
                </div>
            </div>
        `;
    },

    /**
     * Profile View - Elite Orchestrator
     */
    renderProfile: async (container, profile, session) => {
        const view = container || document.getElementById('ecosystem-grid-container');
        if (!view) return;

        const role = profile.role || 'spectateur';
        let specializedFields = '';
        
        // Dynamically fetch specialized fields from active module
        if (role === 'expert' && window.ExpertsModule?.renderProfileFields) {
            specializedFields = window.ExpertsModule.renderProfileFields(profile);
        } else if (role === 'entreprise' && window.CompaniesModule?.renderProfileFields) {
            specializedFields = window.CompaniesModule.renderProfileFields(profile);
        } else if (role === 'owner' && window.OwnersModule?.renderProfileFields) {
            specializedFields = window.OwnersModule.renderProfileFields(profile);
        }

        view.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                <div class="dash-card" style="grid-column: 1 / -1; background: white; padding: 40px; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03);">
                    <h2 style="font-weight: 900; margin-bottom: 40px; letter-spacing: -0.04em; color:#0f172a; font-size:2.2rem;">Édition du Profil Élite</h2>
                    
                    <div id="profile-editor-form" style="display: flex; flex-direction: column; gap: 32px;">
                        
                        <!-- SECTION 1: IDENTITY -->
                        <div style="background:#f8fafc; padding:24px; border-radius:20px; border:1px solid #f1f5f9;">
                            <h3 style="font-size:0.85rem; font-weight:900; color:#10b981; text-transform:uppercase; margin-bottom:24px; letter-spacing:0.05em;">Identit&eacute; Visuelle</h3>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Nom Complet / Marque</label>
                                    <input type="text" id="profile-full-name" value="${profile.full_name || ''}" style="width: 100%; padding: 16px; border-radius: 14px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Titre / Fonction</label>
                                    <input type="text" id="profile-title" value="${profile.title || ''}" placeholder="Ex: Fondateur, Expert Territorial..." style="width: 100%; padding: 16px; border-radius: 14px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 1.5: ROLE ACTIVATION (Reliable Switch System) -->
                        <div style="background: white; padding: 24px; border-radius: 20px; border: 2.5px solid #0f172a;">
                            <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin-bottom:12px; letter-spacing:0.05em;">Activation du R&ocirc;le Professionnel</h3>
                            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 24px;">Choisissez votre &eacute;cosyst&egrave;me pour d&eacute;bloquer vos outils de croissance.</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="spectateur" ${profile.role === 'spectateur' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('spectateur')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'spectateur' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Observateur</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Veille Strat&eacute;gique</span>
                                    </div>
                                </label>
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="porteur" ${profile.role === 'porteur' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('porteur')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'porteur' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Porteur / Owner</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Lancer un Projet</span>
                                    </div>
                                </label>
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="expert" ${profile.role === 'expert' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('expert')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'expert' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Expert / Talent</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Offrir mes Services</span>
                                    </div>
                                </label>
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="entreprise" ${profile.role === 'entreprise' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('entreprise')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'entreprise' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Entreprise</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Besoins & Croissance</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- SECTION 2: SPECIALIZED FIELDS -->
                        <div id="specialized-fields-container" style="background:#fff; padding:0; border-radius:20px;">
                             ${specializedFields}
                        </div>

                        <!-- SECTION 3: PRESENTATION -->
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:12px;">Bio Institutionnelle / Pr&eacute;sentation</label>
                            <textarea id="profile-bio" style="width: 100%; min-height: 150px; padding: 20px; border-radius: 16px; border: 1.5px solid #e2e8f0; font-weight: 600; line-height:1.6;">${profile.bio || ''}</textarea>
                        </div>
                        
                        <div style="margin-top: 32px; padding-top:32px; border-top:1px solid #f1f5f9;">
                            <button onclick="StandardModule.saveProfile()" class="cta-button primary" style="background:#0f172a; color:white; border:none; padding:22px 32px; border-radius:16px; font-weight:950; font-size:1.1rem; width: 100%; cursor:pointer; box-shadow:0 15px 30px rgba(15,23,42,0.2);">Enregistrer mon Profil Élite</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Dynamic Role UI Switch
     */
    handleRoleSwitch: (role) => {
        // UI Visual Update
        document.querySelectorAll('.role-card').forEach(card => card.style.borderColor = '#e2e8f0');
        const selectedRadio = document.querySelector(`input[name="profile-role"][value="${role}"]`);
        if (selectedRadio) selectedRadio.nextElementSibling.style.borderColor = '#10b981';

        // Specialized Fields Injection
        const container = document.getElementById('specialized-fields-container');
        if (!container) return;

        let fields = '';
        if (role === 'expert' && window.ExpertsModule?.renderProfileFields) {
            fields = window.ExpertsModule.renderProfileFields({});
        } else if (role === 'porteur' && window.OwnersModule?.renderProfileFields) {
            fields = window.OwnersModule.renderProfileFields({});
        } else if (role === 'entreprise' && window.CompaniesModule?.renderProfileFields) {
            fields = window.CompaniesModule.renderProfileFields({});
        }
        
        container.innerHTML = fields;
    },

    /**
     * Save Strategy - Capturing EVERYTHING
     */
    saveProfile: async () => {
        try {
            const updates = {
                full_name: document.getElementById('profile-full-name').value,
                title: document.getElementById('profile-title').value,
                bio: document.getElementById('profile-bio').value,
                updated_at: new Date().toISOString()
            };

            // Capture Selected Role (Reliable Switch)
            const selectedRole = document.querySelector('input[name="profile-role"]:checked');
            if (selectedRole) updates.role = selectedRole.value;

            // Exhaustive field collection
            const allPossibleFields = [
                'tjm', 'availability', 'skills', 'siret', 'website', 
                'sector', 'company_name', 'project_desc', 'budget',
                'vision', 'mission', 'enjeu', 'creation_year', 'team_size', 'zone'
            ];
            
            allPossibleFields.forEach(f => {
                const el = document.getElementById('profile-' + f);
                if (el) updates[f] = el.value;
            });

            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expir\u00e9e");

            const { error } = await window._supabase.from('profiles').update(updates).eq('id', session.user.id);
            if (error) throw error;

            alert("Profil professionnel mis \u00e0 jour avec succ\u00e8s !");
            window.location.reload();
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    }
};

window.StandardModule = StandardModule;
