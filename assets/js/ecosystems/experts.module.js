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
            <style>
                .ecosystem-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 32px;
                    align-items: start;
                }
                @media (max-width: 900px) {
                    .ecosystem-grid { grid-template-columns: 1fr; gap: 24px; }
                }
            </style>

            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <div class="ecosystem-grid">
                    <div class="dash-left-col">
                        <!-- Strategic Progression Hub (Step 1 -> Step 2) -->
                        <div class="dash-card-progression" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    </div>
                                    <div>
                                        <h4 style="margin: 0; font-size: 1.1rem; font-weight: 850; color: #0f172a;">Parcours de Succ&egrave;s</h4>
                                        <p style="margin: 0; font-size: 0.85rem; color: #64748b;">${profile.listed ? '&Eacute;tape 1 : R&eacute;f&eacute;rencement Actif' : '&Eacute;tape 1 : Publication en cours'}</p>
                                    </div>
                                </div>
                                <div style="flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; position: relative; margin: 0 40px; min-width: 100px;">
                                    <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${profile.listed ? '50%' : '10%'}; background: #10b981; border-radius: 2px;"></div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                         ${profile.subscription_tier !== 'free' ? 'G&eacute;rer mon Pack' : 'Activer l\'&Eacute;tape 2'}
                                     </button>
                                </div>
                            </div>
                        </div>

                        <!-- Welcome Card (Native Black) -->
                        <div class="dash-welcome-card" style="background: #0f172a; border-radius: 24px; padding:40px; margin-bottom: 24px;">
                            <div style="z-index: 2; position: relative;">
                                <span class="role-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 800; font-size: 0.75rem; border:1px solid #10b981; padding:4px 12px; border-radius:100px;">DOMTOM EXPERT</span>
                                <h1 style="color: white; text-transform: capitalize; margin: 12px 0 8px 0; font-weight:900;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                                <p style="color: rgba(255,255,255,0.7); font-size:1.1rem;">${profile.title || 'Expert Territorial'} - Votre expertise est votre force.</p>
                            </div>
                        </div>

                        <!-- MAIN CONTENT AREA -->
                        <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #10b981; padding:32px; border-radius:24px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
                             <div style="flex:1;">
                                <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#0f172a; letter-spacing:-0.03em;">Pilotage Business</h4>
                                <p style="font-size: 1.1rem; color: #64748b; line-height:1.6; margin: 12px 0 0 0; max-width:420px;">Consultez vos statistiques, g&eacute;rez vos devis et facturez vos missions en toute s&eacute;curit&eacute;.</p>
                             </div>
                             <button onclick="window.Router.navigate('#business')" class="cta-button primary" style="background:#0f172a; color:white; border-radius:18px; font-weight:950; padding:18px 36px; border:none; width: fit-content; cursor:pointer;">Acc&eacute;der</button>
                        </div>

                        <div class="dash-card" style="padding:32px; background: white; border: 1px solid #e2e8f0; border-radius: 24px;">
                            <h3 style="font-size: 1.6rem; font-weight: 900; margin-bottom:32px; color: #0f172a;">Missions &amp; Matching</h3>
                            <div id="expert-matches-view">
                                <div id="matches-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
                                    <div style="text-align: center; padding: 60px; border-radius: 24px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                        <p style="color: #64748b; font-weight: 700;">Analyse des missions territoriales...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SIDEBAR COLUMN -->
                    <div class="dash-side-col" style="padding-top:0;">
                        <button onclick="window.Router.navigate('#collaboration')" style="width: 100%; padding: 24px; background: #2563eb; color: white; border: none; border-radius: 20px; font-weight: 950; font-size: 1.2rem; cursor: pointer; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(37,99,235,0.2);">Collaborer</button>
                        
                        <div style="background:#f8fafc; padding:24px; border-radius:24px; border:1px solid #e2e8f0;">
                            <h4 style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px;">Indicateurs Expert</h4>
                            <div style="display: grid; gap: 16px;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="color:#64748b; font-weight:600; font-size:0.9rem;">TJM Moyen</span>
                                    <span style="color:#0f172a; font-weight:900;">${profile.tjm || '0'} €</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="color:#64748b; font-weight:600; font-size:0.9rem;">Disponibilit&eacute;</span>
                                    <span style="background:rgba(16, 185, 129, 0.1); color:#10b981; padding:4px 10px; border-radius:8px; font-weight:900; font-size:0.8rem;">${profile.availability === 'available' ? 'Disponible' : 'Occupé'}</span>
                                </div>
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
