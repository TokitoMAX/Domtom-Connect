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
            <div class="dashboard-grid" style="display: grid; gap: 32px;">
                
                <!-- Unified Welcome Card (Expert Premium Style) -->
                <div class="dash-card premium-dark" style="grid-column: 1/-1; border-radius: 24px; padding: 48px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background:#10b981; color:white; border:none;">ESPACE EXPERT / TALENT</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin: 12px 0 16px 0;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; line-height:1.6; margin:0;">Gérez votre visibilité stratégique et accédez aux opportunités exclusives du réseau.</p>
                    </div>
                </div>

                <!-- MAIN CONTENT AREA -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 32px;">
                    
                    <!-- BUSINESS COMMAND CENTER -->
                    <div class="dash-card highlight" style="background:#0f172a; padding:48px; border-radius:32px; display:flex; justify-content:space-between; align-items:center; color:white; border:none; box-shadow:0 20px 40px rgba(0,0,0,0.1);">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#10b981; letter-spacing:-0.03em;">Gestion Business</h4>
                            <p style="font-size: 1.1rem; color: #94a3b8; line-height:1.6; margin: 12px 0 0 0; max-width:440px;">Émettez vos devis et facturez vos missions territoriales en toute sécurité via notre suite native.</p>
                         </div>
                         <button onclick="window.Router.navigate('/dashboard/business')" class="cta-button primary" style="background:#10b981; color:white; border-radius:16px; font-weight:900; padding:20px 40px; font-size:1rem; box-shadow:0 8px 20px rgba(16, 185, 129, 0.2);">Ouvrir mon Hub</button>
                    </div>

                    <!-- MISSIONS FEED -->
                    <div class="dash-card" style="border-radius:32px; padding:48px; background:white; border:1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                            <h3 style="font-size: 1.6rem; font-weight: 950; margin:0; color:#0f172a; letter-spacing:-0.03em;">Opportunités Qualifiées</h3>
                            <span id="expert-matches-count" style="background:#f1f5f9; color:#475569; font-weight:800; font-size:0.8rem; padding:6px 14px; border-radius:20px;">Analyse en cours...</span>
                        </div>
                        <div id="expert-matches-view">
                            <div style="text-align: center; padding: 60px; border-radius: 24px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                <div class="dash-loader-spinner" style="width:32px; height:32px; border:3px solid #f1f5f9; border-top-color:#10b981; border-radius:50%; animation: spin 1s linear infinite; margin:0 auto 16px auto;"></div>
                                <p style="color: #64748b; font-weight: 800; font-size: 0.95rem;">Matchmaking territorial en cours...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Tooling -->
                <div class="dash-side-col" style="grid-column: span 4; display: flex; flex-direction: column; gap: 32px;">
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 800; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.06em;">Performance Profil</h4>
                        <div style="display:grid; gap:20px;">
                                 <span style="font-size:1rem; color:#64748b; font-weight:600;">Vues Profil</span>
                                 <span class="views-count-live" style="font-size:1.3rem; font-weight:900; color:#0f172a;">${profile.views_count || 0}</span>
                             </div>
                             <div style="display:flex; justify-content:space-between; align-items:center;">
                                 <span style="font-size:1rem; color:#64748b; font-weight:600;">Missions Qualifiées</span>
                                 <span id="expert-matches-count" style="font-size:1.3rem; font-weight:900; color:#10b981;">—</span>
                             </div>
                        </div>
                    </div>

                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: #0f172a; color:white; border:none;">
                        <div style="font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 8px;">Tarif Journalier (TJM)</div>
                        <div style="font-size: 2rem; font-weight: 900; color: #10b981;">${(profile.tjm || '—')}€<span style="font-size:1rem; color:rgba(255,255,255,0.4);">/j</span></div>
                        <button onclick="window.Router.navigate('/dashboard/profile')" style="width:100%; margin-top:32px; padding:14px; border:1px solid rgba(255,255,255,0.1); border-radius:12px; background:transparent; color:white; font-weight:800; cursor:pointer;">Éditer ma fiche</button>
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
