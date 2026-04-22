/**
 * Domtom Connect - Spectator Ecosystem Module
 * Logic for Spectators / Guest Users (Premium SaaS Standard)
 */
const SpectatorsModule = {
    role: 'spectator',

    /**
     * Module Router - Professional Isolation
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
            case 'marketplace':
                window.location.href = 'marketplace/explorer.html';
                break;
            case 'overview':
            default:
                 SpectatorsModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Discovery Overview (Mobile Harmonized)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Strategic Progression Hub (Step 1 -> Step 2) -->
                <div class="dash-card-progression" style="grid-column: 1 / -1; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: rgba(71, 85, 105, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #475569;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 850; color: #0f172a;">Parcours D&eacute;couverte</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">&Eacute;tape 1 : Exploration du R&eacute;seau ✅</p>
                            </div>
                        </div>
                        <div style="flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; position: relative; margin: 0 40px; min-width: 100px;">
                            <div style="position: absolute; left: 0; top: 0; height: 100%; width: 50%; background: #475569; border-radius: 2px;"></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="text-align: right;">
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">&Eacute;tape 2 : Activer mon Statut</h4>
                                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Choisissez votre r&ocirc;le expert ou entreprise</p>
                            </div>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button" style="padding: 10px 20px; border-radius: 10px; background: #0f172a; color: white; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer;">
                                Compl&eacute;ter mon Profil →
                            </button>
                        </div>
                    </div>
                </div>

                <div class="dash-welcome-card" style="background: linear-gradient(135deg, #0f172a 0%, #475569 100%); margin-bottom: 24px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background: rgba(255, 255, 255, 0.1); color: #fff; font-weight: 800; font-size: 0.75rem;">VISITEUR / SPECTATEUR</span>
                        <h1>Bienvenue, ${profile.full_name || 'Explorateur'}</h1>
                        <p>D&eacute;couvrez les p&eacute;pites de votre territoire et restez branch&eacute; sur l'innovation locale.</p>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER (Vertical Stacking) -->
                <div class="dash-main-col" style="grid-column: 1 / -1; display: grid; gap: 24px;">
                    
                    <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #475569; padding-bottom: 32px;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#0f172a;">Explorer le R&eacute;seau</h4>
                            <p style="font-size: 1.1rem; color: #64748b; line-height:1.6; margin: 12px 0 24px 0; max-width:480px;">Consultez l'annuaire des talents et des entreprises pour d&eacute;nicher des opportunit&eacute;s.</p>
                         </div>
                         <button onclick="window.location.href='marketplace/explorer.html'" class="cta-button primary" style="background:#0f172a; color:white; border-radius:18px; font-weight:950; padding:18px 36px; width: fit-content;">Acc&eacute;der à l'Annuaire →</button>
                    </div>

                    <div class="dash-card" style="padding:32px; background: white; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 1.6rem; font-weight: 900; margin-bottom:32px; color: #0f172a;">Opportunit&eacute;s R&eacute;centes</h3>
                        <div id="latest-activities-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                            <div style="text-align: center; padding: 40px; border-radius: 20px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                <p style="color: #64748b; font-weight: 800; font-size: 0.85rem;">Chargement des &eacute;v&eacute;nements r&eacute;cents...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        SpectatorsModule.loadLatestActivities(document.getElementById('latest-activities-container'));
    },

    loadLatestActivities: (container) => {
        if (!container) return;
        setTimeout(() => {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b; font-weight:600; font-size:0.9rem;">Aucune activit&eacute; publique r&eacute;cente &agrave; afficher.</div>`;
        }, 800);
    }
};

window.SpectatorsModule = SpectatorsModule;
