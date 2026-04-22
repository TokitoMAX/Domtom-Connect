/**
 * Domtom Connect - Project Owner Ecosystem Module
 * Logic for Project Owners (Partner SaaS Standard)
 */
const OwnersModule = {
    role: 'owner',

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
                OwnersModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Project Overview (Mobile Harmonized - Black/Green)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Strategic Progression Hub -->
                <div class="dash-card-progression" style="grid-column: 1 / -1; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 850; color: #0f172a;">Parcours de Succ&egrave;s</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Pilotage : Actif ✅</p>
                            </div>
                        </div>
                        <div style="flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; position: relative; margin: 0 40px; min-width: 100px;">
                            <div style="position: absolute; left: 0; top: 0; height: 100%; width: 50%; background: #10b981; border-radius: 2px;"></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <button onclick="window.Router.navigate('#marketplace')" class="cta-button primary" style="padding: 12px 24px; border-radius: 12px; background: #0f172a; color: white; border: none; font-weight: 800; font-size: 0.9rem; cursor: pointer;">
                                Trouver des experts
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Welcome Card (Native Black/Green) -->
                <div class="dash-welcome-card" style="background: #0f172a; margin-bottom: 24px; border-radius: 24px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 800; font-size: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.3);">ESPACE PORTEUR DE PROJET</span>
                        <h1 style="color: white; text-transform: capitalize;">Bonjour, ${profile.full_name || 'Kali'}</h1>
                        <p style="color: rgba(255,255,255,0.7);">Pilotez vos ambitions territoriales et collaborez avec l'&eacute;lite locale.</p>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER (Vertical Stacking) -->
                <div class="dash-main-col" style="grid-column: 1 / -1; display: grid; gap: 24px;">
                    
                    <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #0f172a; padding-bottom: 32px;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#0f172a;">Pilotage Projets</h4>
                            <p style="font-size: 1.1rem; color: #64748b; line-height:1.6; margin: 12px 0 24px 0; max-width:480px;">G&eacute;rez vos collaborations, validez les devis et suivez l'avancement de vos missions.</p>
                         </div>
                         <button onclick="window.Router.navigate('#collaboration')" class="cta-button primary" style="background:#10b981; color:white; border-radius:18px; font-weight:950; padding:18px 36px; border:none; width: fit-content;">Acc&eacute;der &agrave; mes Projets →</button>
                    </div>

                    <div class="dash-card" style="padding:32px; background: white; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 1.6rem; font-weight: 900; margin-bottom:32px; color: #0f172a;">Talents recommand&eacute;s</h3>
                        <div id="expert-matches-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                            <div style="text-align: center; padding: 40px; border-radius: 20px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                <p style="color: #64748b; font-weight: 800; font-size: 0.85rem;">En attente de nouveaux profils...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

window.OwnersModule = OwnersModule;
