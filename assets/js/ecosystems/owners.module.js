/**
 * Domtom Connect - Project Owner Ecosystem Module
 * Logic for Project Owners (Premium SaaS Standard)
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
     * Dashboard Home - Project Overview (Mobile Harmonized)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Strategic Progression Hub (Step 1 -> Step 2) -->
                <div class="dash-card-progression" style="grid-column: 1 / -1; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: rgba(99, 102, 241, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #6366f1;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 850; color: #0f172a;">Parcours de Succ&egrave;s</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">&Eacute;tape 1 : Expression des Besoins ✅</p>
                            </div>
                        </div>
                        <div style="flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; position: relative; margin: 0 40px; min-width: 100px;">
                            <div style="position: absolute; left: 0; top: 0; height: 100%; width: 50%; background: #6366f1; border-radius: 2px;"></div>
                            <div style="position: absolute; left: 50%; top: -6px; width: 16px; height: 16px; border-radius: 50%; border: 4px solid white; background: #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="text-align: right;">
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">&Eacute;tape 2 : Recrutement Experts</h4>
                                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Trouvez les meilleurs talents du territoire</p>
                            </div>
                            <button onclick="window.Router.navigate('#marketplace')" class="cta-button" style="padding: 10px 20px; border-radius: 10px; background: #0f172a; color: white; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                Lancer le Sourcing →
                            </button>
                        </div>
                    </div>
                </div>

                <div class="dash-welcome-card" style="background: linear-gradient(135deg, #0f172a 0%, #6366f1 100%); margin-bottom: 24px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background: rgba(255, 255, 255, 0.1); color: #fff; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">ESPACE PORTEUR DE PROJET</span>
                        <h1 style="text-transform: capitalize;">Bonjour, ${profile.full_name || 'Innovateur'}</h1>
                        <p>Pilotez vos ambitions territoriales et collaborez avec l'&eacute;lite locale.</p>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER (Vertical Stacking for Mobile) -->
                <div class="dash-main-col" style="grid-column: 1 / -1; display: grid; gap: 24px;">
                    
                    <!-- PROJECT HUB CARDS -->
                    <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #6366f1; padding-bottom: 32px;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#0f172a; letter-spacing:-0.03em;">Pilotage Projets</h4>
                            <p style="font-size: 1.1rem; color: #64748b; line-height:1.6; margin: 12px 0 24px 0; max-width:480px;">G&eacute;rez vos collaborations, validez les devis et suivez l'avancement de vos missions.</p>
                         </div>
                         <button onclick="window.Router.navigate('#collaboration')" class="cta-button primary" style="background:#6366f1; color:white; border:none; border-radius:18px; font-weight:950; padding:18px 36px; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2); width: fit-content;">Acc&eacute;der à mes Projets →</button>
                    </div>

                    <!-- EXPERT MATCHMAKING -->
                    <div class="dash-card" style="border-radius:24px; padding:32px; background: white; border: 1px solid #e2e8f0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap: wrap; gap:16px;">
                            <div>
                                <h3 style="font-size: 1.6rem; font-weight: 900; margin:0; color: #0f172a; letter-spacing:-0.03em;">Talents recommand&eacute;s</h3>
                                <p style="font-size:0.9rem; color:#64748b; font-weight:700; margin-top:4px;">Experts pr&ecirc;ts &agrave; intervenir sur vos projets</p>
                            </div>
                            <button onclick="window.Router.navigate('#marketplace')" class="cta-button primary" style="background:#0f172a; border-radius:14px; font-weight:900; padding:14px 28px;">Tout voir</button>
                        </div>
                        <div id="expert-matches-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                            <div style="text-align: center; padding: 40px; border-radius: 20px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                <div class="dash-loader-spinner" style="width:24px; height:24px; border:3px solid #f1f5f9; border-top-color:#6366f1; border-radius:50%; animation: spin 1s linear infinite; margin:0 auto 12px auto;"></div>
                                <p style="color: #64748b; font-weight: 800; font-size: 0.85rem;">S&eacute;lection des profils experts...</p>
                            </div>
                        </div>
                    </div>

                    <!-- IMPACT & STATS -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                        <div class="dash-card" style="padding:28px; border:1px solid #e2e8f0; background: white;">
                            <h4 style="font-size: 0.75rem; font-weight: 850; margin-bottom: 20px; text-transform:uppercase; color:#64748b; letter-spacing:0.04em;">Performances Projet</h4>
                            <div style="display:grid; gap:16px;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-size:0.95rem; color:#64748b; font-weight:600;">Experts mobilis&eacute;s</span>
                                    <span style="font-size:1.4rem; font-weight:900; color:#0f172a;">${profile.experts_mobilized || 0}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-size:0.95rem; color:#64748b; font-weight:600;">Missions lanc&eacute;es</span>
                                    <span style="font-size:1.4rem; font-weight:900; color:#6366f1;">${profile.missions_active || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div class="dash-card" style="padding:28px; background: #f8fafc; border: 1px solid #e2e8f0;">
                             <h4 style="font-size: 0.75rem; font-weight: 850; color:#64748b; text-transform:uppercase; margin-bottom:20px;">Support Partenaire</h4>
                             <p style="font-size:0.85rem; color:#64748b; line-height:1.5; margin-bottom:20px;">Besoin d'aide pour d&eacute;finir vos besoins ? Nos conseillers vous accompagnent.</p>
                             <button onclick="window.Router.navigate('#messages?to=admin')" style="width:100%; padding:12px; background:white; border:1px solid #e2e8f0; border-radius:10px; color:#0f172a; font-weight:800; cursor:pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">Contacter le Support</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load Experts Mockup (Optional logic)
        OwnersModule.loadRecommendedExperts(document.getElementById('expert-matches-container'));
    },

    loadRecommendedExperts: async (container) => {
        if (!container) return;
        // Mockup or real load logic
        setTimeout(() => {
            container.innerHTML = `
                <div style="text-align:center; padding:30px; color:#64748b; font-weight:600; font-size:0.9rem;">
                    Recherche d'experts territoriaux en cours...
                </div>
            `;
        }, 800);
    }
};

window.OwnersModule = OwnersModule;
