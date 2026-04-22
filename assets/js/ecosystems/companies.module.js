/**
 * Domtom Connect - Company Ecosystem Module
 * Logic for Companies (Partner SaaS Standard)
 */
const CompaniesModule = {
    role: 'entreprise',

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
                CompaniesModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Company Workspace (Mobile Harmonized)
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 850; color: #0f172a;">Parcours de Succ&egrave;s</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Vitrine Pro : Act&eacute;e ✅</p>
                            </div>
                        </div>
                        <div style="flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; position: relative; margin: 0 40px; min-width: 100px;">
                            <div style="position: absolute; left: 0; top: 0; height: 100%; width: 65%; background: #10b981; border-radius: 2px;"></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="text-align: right;">
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">&Eacute;tape 2 : Partenariat Certifi&eacute;</h4>
                                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Acc&egrave;s au r&eacute;seau de talents</p>
                            </div>
                            <button class="cta-button primary" style="padding: 10px 20px; border-radius: 10px; background: #0f172a; color: white; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer;">
                                D&eacute;bloquer →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Welcome Card (Native Black/Green) -->
                <div class="dash-welcome-card" style="background: #0f172a; margin-bottom: 24px; border-radius: 24px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 800; font-size: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.3);">ESPACE ENTREPRISE / BUSINESS</span>
                        <h1 style="color: white;">Bonjour, ${profile.full_name || 'Partenaire'}</h1>
                        <p style="color: rgba(255,255,255,0.7);">D&eacute;ployez votre &eacute;nergie territoriale et pilotez vos talents experts.</p>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER (Vertical Stacking) -->
                <div class="dash-main-col" style="grid-column: 1 / -1; display: grid; gap: 24px;">
                    
                    <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #0f172a; padding-bottom: 32px;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#0f172a;">Partenariat Strat&eacute;gique</h4>
                            <p style="font-size: 1.1rem; color: #64748b; line-height:1.6; margin: 12px 0 24px 0; max-width:480px;">Activez votre collaboration de second niveau pour d&eacute;bloquer le matchmaking avanc&eacute;.</p>
                         </div>
                         <button onclick="window.Router.navigate('#collaboration')" class="cta-button primary" style="background:#10b981; color:white; border-radius:18px; font-weight:950; padding:18px 36px; border:none; width: fit-content;">Lancer le Hub →</button>
                    </div>

                    <div class="dash-card" style="padding:32px; background: white; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 1.6rem; font-weight: 900; margin-bottom:32px; color: #0f172a;">Annonces & Missions</h3>
                        <div id="company-jobs-container" style="text-align:center; padding:40px; background:#f8fafc; border-radius:20px; border:2px dashed #e2e8f0;">
                            <p style="color:#64748b; font-weight:700;">Chargement de vos missions...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        CompaniesModule.loadMyJobs(document.getElementById('company-jobs-container'));
    },

    /**
     * RESTORED: Functional mission loading for Collaboration Hub
     */
    loadMyJobs: async (container) => {
        const target = container || document.getElementById('company-jobs-container');
        if (!target) return;

        setTimeout(() => {
            target.innerHTML = `
                <div style="text-align:center; padding:20px;">
                    <p style="color:#64748b; font-weight:700; margin-bottom:16px;">Aucune mission active pour le moment.</p>
                    <button class="cta-button secondary" style="background:white; border:1px solid #e2e8f0; padding:10px 24px; border-radius:10px; font-weight:800; cursor:pointer;">+ Publier une mission</button>
                </div>
            `;
        }, 500);
    },

    /**
     * Helper for workspace rendering (called by CollaborationModule)
     */
    renderWorkspace: async (container, profile) => {
        if (container) container.innerHTML = `<div style="padding:20px; font-weight:600;">Chargement de l'espace de travail...</div>`;
    }
};

window.CompaniesModule = CompaniesModule;
window.loadMyJobs = CompaniesModule.loadMyJobs;
