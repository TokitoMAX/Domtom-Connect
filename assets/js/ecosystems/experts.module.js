/**
 * Domtom Connect - Experts Ecosystem Module
 * Logic for Experts / Talents (Premium Malt-Style)
 */
const ExpertsModule = {
    role: 'expert',

    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'profile':
                if (window.StandardModule) {
                    window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'collaboration':
                if (window.CollaborationModule) {
                    await window.CollaborationModule.route('overview', target, profile, session, params);
                }
                break;
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView && window.BusinessModule) {
                    bizView.style.display = 'block';
                    window.BusinessModule.renderDashboard(bizView);
                }
                break;
            case 'billetterie':
                const ticketingView = document.getElementById('billetterie-view');
                if (ticketingView && window.TicketingModule) {
                    ticketingView.style.display = 'block';
                    window.TicketingModule.loadMyTicketing(params);
                }
                break;
            case 'missions':
                window.location.href = 'marketplace/jobs.html';
                break;
            case 'overview':
            default:
                ExpertsModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Rendering Logic - Restauration Marque & Conversion Authority
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Inter', sans-serif; display: grid; grid-template-columns: 1fr 340px; gap: 32px; padding: 20px;">
                
                <!-- MAIN CONTENT -->
                <div class="dash-main-col">
                    
                    <!-- Expert Refined Header -->
                    <div style="background: #020617; border-radius: 24px; padding: 48px; margin-bottom: 32px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="position: absolute; top:0; right:0; width: 300px; height: 100%; background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%);"></div>
                        <div style="position: relative; z-index: 2;">
                            <span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 6px 14px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.05em; border: 1px solid rgba(16,185,129,0.2);">DOMTOM EXPERT</span>
                            <h1 style="color: white; margin: 12px 0 4px 0; font-size: 2.2rem; font-weight: 900; letter-spacing: -0.02em;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                            <p style="color: rgba(255,255,255,0.5); font-weight: 600;">${profile.title || 'Expert Territorial'} - Votre expertise est votre force.</p>
                        </div>
                    </div>

                    <!-- Pilotage Highlight -->
                    <div class="dash-card-highlight" style="background: #ffffff; border: 1px solid rgba(16, 185, 129, 0.3); padding: 40px; border-radius: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 40px rgba(16,185,129,0.05);">
                         <div style="flex: 1;">
                            <h4 style="margin: 0; font-size: 1.4rem; font-weight: 900; color: #020617; letter-spacing: -0.01em;">Pilotage Business</h4>
                            <p style="font-size: 1.1rem; color: #64748b; line-height: 1.6; margin-top: 8px; max-width: 440px;">Consultez vos statistiques, g&eacute;rez vos devis et facturez vos missions en toute s&eacute;curit&eacute;.</p>
                         </div>
                         <button onclick="window.Router.navigate('#business')" style="background: #020617; color: white; border-radius: 14px; font-weight: 900; padding: 16px 32px; border: none; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#10b981'">Acc&eacute;der</button>
                    </div>

                    <!-- Matching Section -->
                    <div class="dash-card" style="padding: 40px; border-radius: 24px; background: white; border: 1px solid #f1f5f9;">
                        <h3 style="font-size: 1rem; font-weight: 900; color: #020617; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 32px; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
                            Missions &amp; Matching
                        </h3>
                        <div id="expert-matches-view">
                            <div id="matches-container">
                                <div style="text-align: center; padding: 60px; border-radius: 24px; background: #f8fafc; border: 1.5px dashed #e2e8f0;">
                                    <p style="color: #94a3b8; font-weight: 700;">Analyse des missions territoriales...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SIDEBAR -->
                <div class="dash-side-col">
                    <button onclick="window.Router.navigate('#collaboration')" style="width: 100%; padding: 22px; background: #2563eb; color: white; border: none; border-radius: 18px; font-weight: 900; font-size: 1.1rem; cursor: pointer; margin-bottom: 32px; box-shadow: 0 10px 20px rgba(37,99,235,0.15); transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 12px;">
                        Collaborer
                    </button>

                    <!-- Success Progress -->
                    <div style="background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 32px; margin-bottom: 24px;">
                        <h4 style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px;">Parcours de Succ&egrave;s</h4>
                        <div style="height: 6px; background: #f1f5f9; border-radius: 10px; margin-bottom: 12px; position: relative;">
                            <div style="position: absolute; top:0; left:0; height:100%; width: 45%; background: #10b981; border-radius: 10px;"></div>
                        </div>
                        <p style="font-size: 0.8rem; color: #64748b; font-weight: 600;">&Eacute;tape 1 : R&eacute;f&eacute;rencement Actif</p>
                    </div>

                    <!-- Metrics -->
                    <div style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #f1f5f9;">
                         <div style="display: grid; gap: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #64748b; font-weight: 600;">TJM Moyen</span>
                                <span style="color: #020617; font-weight: 900;">${profile.tjm || '0'} €</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #64748b; font-weight: 600;">Disponibilit&eacute;</span>
                                <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 10px; border-radius: 8px; font-weight: 900; font-size: 0.75rem;">${profile.availability === 'available' ? 'Disponible' : 'Occupé'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (session && session.user && typeof window.loadMatchmaking === 'function') {
            window.loadMatchmaking(session.user.id);
        }
    },

    /**
     * RESTORED: Expert-specific Profile Fields
     */
    renderProfileFields: (profile) => {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="info-field">
                    <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Tarif Journalier (TJM &euro;)</label>
                    <input type="number" id="profile-tjm" value="${profile.tjm || 0}" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;">
                </div>
                <div class="info-field">
                    <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Disponibilit&eacute;</label>
                    <select id="profile-availability" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; background: white;">
                        <option value="available" ${profile.availability === 'available' ? 'selected' : ''}>Disponible Immd&eacute;diatement</option>
                        <option value="busy" ${profile.availability === 'busy' ? 'selected' : ''}>En mission</option>
                        <option value="off" ${profile.availability === 'off' ? 'selected' : ''}>Non disponible</option>
                    </select>
                </div>
            </div>
            <div class="info-field">
                <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Comp&eacute;tences Cl&eacute;s (S&eacute;par&eacute;es par des virgules)</label>
                <input type="text" id="profile-skills" value="${profile.skills || ''}" placeholder="Ex: Stratégie, Digital, Management..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;">
            </div>
            <div class="info-field">
                <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Lien Portfolio / LinkedIn</label>
                <input type="url" id="profile-website" value="${profile.website || ''}" placeholder="https://..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700;">
            </div>
        `;
    }
};

window.ExpertsModule = ExpertsModule;
