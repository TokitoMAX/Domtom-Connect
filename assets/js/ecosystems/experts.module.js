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
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow-x: hidden;
                    background-color: #f8fafc;
                }
                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    background-color: #f8fafc;
                    position: relative;
                    overflow-x: hidden;
                    width: 100%;
                    justify-content: center;
                }
            </style>
            <div class="dash-grid-layout">
                
                <!-- Strategic Progression Hub (Step 1 -> Step 2) -->
                <div class="dash-card-progression" style="grid-column: 1 / -1; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 850; color: #0f172a;">Parcours de Succès</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">${profile.listed ? 'Étape 1 : Référencement Actif ✅' : 'Étape 1 : Publication du Profil ⏳'}</p>
                            </div>
                        </div>
                        <div style="flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; position: relative; margin: 0 40px; min-width: 100px;">
                            <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${profile.listed ? '50%' : '10%'}; background: #10b981; border-radius: 2px;"></div>
                            <div style="position: absolute; left: 50%; top: -6px; width: 16px; height: 16px; border-radius: 50%; border: 4px solid white; background: ${profile.subscription_tier !== 'free' ? '#10b981' : '#e2e8f0'}; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="text-align: right;">
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">Étape 2 : Rayonnement Authority</h4>
                                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">${profile.subscription_tier !== 'free' ? 'Pack Activé' : 'Débloquez votre visibilité premium'}</p>
                            </div>
                             <button onclick="window.Router.navigate('#profile')" class="cta-button" style="padding: 10px 20px; border-radius: 10px; background: ${profile.subscription_tier !== 'free' ? '#10b981' : '#0f172a'}; color: white; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 200px;">
                                ${profile.subscription_tier !== 'free' ? 'Gérer mon Pack' : 'Activer l\'Étape 2 →'}
                             </button>
                        </div>
                    </div>
                </div>

                <!-- PREMIUM PACKS BENEFITS -->
                ${profile.subscription_tier === 'free' ? `
                <div class="premium-benefits-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px;">
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 24px; position: relative;">
                        <span style="position: absolute; top: -10px; right: 20px; background: #6366f1; color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 800;">POPULAIRE</span>
                        <div style="font-size: 0.7rem; font-weight: 800; color: #6366f1; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Pack Authority • 9,99€</div>
                        <h4 style="margin: 0 0 16px 0; font-size: 1.1rem; font-weight: 900;">Boostez votre Influence</h4>
                        <ul style="margin: 0; padding: 0; list-style: none; display: grid; gap: 10px;">
                            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #475569;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                Badge certifié "Talent Authority"
                            </li>
                            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #475569;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                Référencement prioritaire (Top 3)
                            </li>
                            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #475569;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                Pilotage Business Illimité
                            </li>
                        </ul>
                    </div>
                    <div style="background: #0f172a; color: white; border-radius: 20px; padding: 24px; position: relative;">
                        <div style="font-size: 0.7rem; font-weight: 800; color: #10b981; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Pack Strategic • 29,00€</div>
                        <h4 style="margin: 0 0 16px 0; font-size: 1.1rem; font-weight: 900; color: white;">Devenez Partenaire</h4>
                        <ul style="margin: 0; padding: 0; list-style: none; display: grid; gap: 10px;">
                            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #cbd5e1;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                Accompagnement sur-mesure
                            </li>
                            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #cbd5e1;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                Mise en relation directe
                            </li>
                            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #cbd5e1;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                Visibilité maximale annuaire
                            </li>
                        </ul>
                    </div>
                </div>
                ` : ''}
            </div>

                <div class="dash-welcome-card" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                    <span class="role-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">VOS PÉPITES & OPPORTUNITÉS</span>
                    <h1 style="text-transform: capitalize;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                    <p>${profile.title || 'Expert Territorial'} - Votre expertise territoriale est une force.</p>
                </div>

                <!-- MAIN CONTENT AREA -->
                <div class="dash-main-col">
                    
                    <!-- BUSINESS COMMAND CENTER (Restored Concept) -->
                    <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #10b981; padding-bottom: 56px;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:900; color:#0f172a; letter-spacing:-0.03em;">Pilotage Business</h4>
                            <p style="font-size: 1rem; color: #64748b; line-height:1.6; margin: 12px 0 0 0; max-width:440px;">Consultez vos statistiques, gérez vos devis et facturez vos missions en toute sécurité.</p>
                         </div>
                            <button onclick="window.Router.navigate('#business')" class="cta-button primary" style="background:#0f172a; color:white; border-radius:14px; padding:12px 24px; font-weight:800; border:none; cursor:pointer;">Accéder au Pilotage →</button>
                    </div>

                    <!-- MISSIONS FEED (Pépites Matchmaking) -->
                    <div class="dash-card-premium" id="matchmaking-section">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
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
                                     <span id="expert-matches-count-side" style="font-size:1.3rem; font-weight:900; color:#10b981;">-</span>
                                 </div>
                        </div>
                        <div style="margin-top:24px; padding-top:24px; border-top:1px solid #f1f5f9; display:flex; align-items:center; gap:12px;">
                            <div style="width:12px; height:12px; background:#10b981; border-radius:50%; box-shadow:0 0 10px rgba(16, 185, 129, 0.4);"></div>
                            <span style="font-size:0.75rem; font-weight:700; color:#10b981; text-transform:uppercase;">Profil Public Actif</span>
                        </div>
                    </div>

                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: #0f172a; color:white; border:none; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                        <div style="font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 8px;">Tarif Journalier (TJM)</div>
                        <div style="font-size: 2.2rem; font-weight: 900; color: #10b981; letter-spacing:-0.05em;">${(profile.tjm || '-')} &euro;<span style="font-size:1rem; color:rgba(255,255,255,0.4);">/j</span></div>
                        <p style="font-size:0.8rem; color:rgba(255,255,255,0.5); margin-top:8px;">Ajustez votre tarif selon la demande du marché.</p>
                        <button onclick="window.Router.navigate('#profile')" style="width:100%; margin-top:24px; padding:14px; border:1px solid rgba(255,255,255,0.2); border-radius:12px; background:rgba(255,255,255,0.05); color:white; font-weight:800; cursor:pointer; transition: all 0.2s;">Éditer ma fiche</button>
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
