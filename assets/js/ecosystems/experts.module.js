/**
 * Domtom Connect - Experts Ecosystem Module
 * Logic for Experts / Talents (Premium Malt-Style)
 */
const ExpertsModule = {
    role: 'expert',

    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView && window.BusinessModule) {
                    bizView.style.display = 'block';
                    window.BusinessModule.renderDashboard(bizView);
                }
                break;
            case 'missions':
                window.location.href = '/marketplace/jobs';
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
            <div class="dash-grid-layout">
                
                <!-- Unified Welcome Card (Premium Restoration) -->
                <div class="dash-welcome-card" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                    <span class="role-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">💎 VOS PÉPITES & OPPORTUNITÉS</span>
                    <h1>Bonjour, ${profile.full_name || 'Expert'}</h1>
                    <p>Votre expertise territoriale est une force. Gérez vos missions et votre visibilité stratégique.</p>
                </div>

                <!-- MAIN CONTENT AREA -->
                <div class="dash-main-col">
                    
                    <!-- BUSINESS COMMAND CENTER (Restored Concept) -->
                    <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #10b981;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:900; color:#0f172a; letter-spacing:-0.03em;">Pilotage Business</h4>
                            <p style="font-size: 1rem; color: #64748b; line-height:1.6; margin: 12px 0 0 0; max-width:440px;">Consultez vos statistiques, gérez vos devis et facturez vos missions en toute sécurité.</p>
                         </div>
                         <button onclick="window.Router.navigate('/dashboard/business')" class="cta-button primary large" style="background:#0f172a;">Hub Business →</button>
                    </div>

                    <!-- MISSIONS FEED (Pépites Matchmaking) -->
                    <div class="dash-card-premium" id="matchmaking-section">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                            <h3 style="font-size: 1.6rem; font-weight: 900; margin:0; color:#0f172a; letter-spacing:-0.03em;">💎 VOS PÉPITES</h3>
                            <span id="expert-matches-count" class="dash-stat-badge" style="background:#10b981; color:#fff;">MATCHING ACTIF</span>
                        </div>
                        <div id="expert-matches-view">
                            <div id="matches-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
                                <div style="text-align: center; padding: 60px; border-radius: 24px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                    <div class="dash-loader-spinner" style="width:32px; height:32px; border:3px solid #f1f5f9; border-top-color:#10b981; border-radius:50%; animation: spin 1s linear infinite; margin:0 auto 16px auto;"></div>
                                    <p style="color: #64748b; font-weight: 700; font-size: 0.95rem;">Analyse des missions territoriales...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Tooling -->
                <div class="dash-side-col">
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0; background:#fff;">
                        <h4 style="font-size: 0.8rem; font-weight: 800; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.06em;">Impact & Performance</h4>
                        <div style="display:grid; gap:20px;">
                                 <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-size:1rem; color:#64748b; font-weight:600;">Portée (Vues)</span>
                                    <span class="views-count-live" style="font-size:1.3rem; font-weight:900; color:#0f172a;">${profile.views_count || 0}</span>
                                 </div>
                                 <div style="display:flex; justify-content:space-between; align-items:center;">
                                     <span style="font-size:1rem; color:#64748b; font-weight:600;">Matchs Qualifiés</span>
                                     <span id="expert-matches-count-side" style="font-size:1.3rem; font-weight:900; color:#10b981;">—</span>
                                 </div>
                        </div>
                        <div style="margin-top:24px; padding-top:24px; border-top:1px solid #f1f5f9; display:flex; align-items:center; gap:12px;">
                            <div style="width:12px; height:12px; background:#10b981; border-radius:50%; box-shadow:0 0 10px rgba(16, 185, 129, 0.4);"></div>
                            <span style="font-size:0.75rem; font-weight:700; color:#10b981; text-transform:uppercase;">Profil Public Actif</span>
                        </div>
                    </div>

                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: #0f172a; color:white; border:none; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                        <div style="font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 8px;">Tarif Journalier (TJM)</div>
                        <div style="font-size: 2.2rem; font-weight: 900; color: #10b981; letter-spacing:-0.05em;">${(profile.tjm || '—')}€<span style="font-size:1rem; color:rgba(255,255,255,0.4);">/j</span></div>
                        <p style="font-size:0.8rem; color:rgba(255,255,255,0.5); margin-top:8px;">Ajustez votre tarif selon la demande du marché.</p>
                        <button onclick="window.Router.navigate('/dashboard/profile')" style="width:100%; margin-top:24px; padding:14px; border:1px solid rgba(255,255,255,0.2); border-radius:12px; background:rgba(255,255,255,0.05); color:white; font-weight:800; cursor:pointer; transition: all 0.2s;">Éditer ma fiche</button>
                    </div>
                </div>
            </div>
        `;
        
        if (session && session.user && typeof window.loadMatchmaking === 'function') {
            window.loadMatchmaking(session.user.id);
        }

        // Live Stats Update
        if (typeof window.fetchBusinessStats === 'function') {
            window.fetchBusinessStats(session.user.id).then(stats => {
                const viewsEl = container.querySelector('.views-count-live');
                if (viewsEl) viewsEl.textContent = stats.views;
            });
        }
    }
};

window.ExpertsModule = ExpertsModule;
