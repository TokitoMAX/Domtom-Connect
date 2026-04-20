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

                <!-- Main Content -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 32px;">
                    
                    <!-- Business Gateway -->
                    <div class="dash-card highlight" style="background:#f8fafc; border: 1px solid #e2e8f0; padding: 40px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center;">
                         <div>
                            <h4 style="margin:0; font-size:1.5rem; font-weight:900; color:#0f172a;">Gestion Business</h4>
                            <p style="font-size: 1rem; color: #64748b; line-height:1.6; margin: 12px 0 0 0;">Utilisez notre suite native pour facturer vos missions territoriales en toute sécurité.</p>
                         </div>
                         <button onclick="window.Router.navigate('/dashboard/business')" class="cta-button primary" style="background:#0f172a; border:none; border-radius:12px; font-weight:800; padding:18px 36px;">Accéder</button>
                    </div>

                    <!-- Missions matching -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 1.5rem; font-weight: 900; margin:0 0 24px 0; color:#0f172a;">Missions Sélectionnées</h3>
                        <div id="expert-matches-view">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 60px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 700; font-size: 1rem;">Recherche de missions correspondant à votre profil...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Tooling -->
                <div class="dash-side-col" style="grid-column: span 4; display: flex; flex-direction: column; gap: 32px;">
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 800; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.06em;">Performance Profil</h4>
                        <div style="display:grid; gap:20px;">
                             <div style="display:flex; justify-content:space-between; align-items:center;">
                                 <span style="font-size:1rem; color:#64748b; font-weight:600;">Vues (30j)</span>
                                 <span style="font-size:1.3rem; font-weight:900; color:#0f172a;">—</span>
                             </div>
                             <div style="display:flex; justify-content:space-between; align-items:center;">
                                 <span style="font-size:1rem; color:#64748b; font-weight:600;">Missions Proposées</span>
                                 <span style="font-size:1.3rem; font-weight:900; color:#0f172a;">—</span>
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
    }
};

window.ExpertsModule = ExpertsModule;
