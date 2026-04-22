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
        console.log("[ExpertsModule] Routing to:", viewId);
        const topNav = document.getElementById('ecosystem-top-nav');
        if (topNav) topNav.style.display = 'none';

        switch (viewId) {
            case 'business':
                await ExpertsModule.renderBusinessPilotage(target, profile, session);
                break;
            case 'profile':
                if (window.StandardModule) {
                    await window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'collaboration':
                if (window.CollaborationModule) {
                    await window.CollaborationModule.route('overview', target, profile, session, params);
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
            <div class="dash-grid-layout" style="font-family: 'Inter', sans-serif; padding: 60px; width: 100%; box-sizing: border-box;">
                
                <!-- MAIN CONTENT: ACTION CENTER -->
                <div class="dash-main-col">
                    
                    <!-- Welcome & Success Path -->
                    <div style="background: #020617; border-radius: 24px; padding: 48px; margin-bottom: 32px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="position: absolute; top:0; right:0; width: 300px; height: 100%; background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%);"></div>
                        <div style="position: relative; z-index: 2;">
                            <span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 6px 14px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.05em; border: 1px solid rgba(16,185,129,0.2);">ESPACE EXPERT PREMIUM</span>
                            <h1 style="color: white; margin: 12px 0 8px 0; font-size: 2.2rem; font-weight: 900;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                            
                            <div style="margin-top: 24px; max-width: 400px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem; font-weight: 700;">PROFIL COMPLÉTÉ</span>
                                    <span style="color: #10b981; font-size: 0.8rem; font-weight: 900;">45%</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                     <button onclick="ExpertsModule.showExpertPacks()" style="padding: 10px 20px; background: #020617; color: white; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.85rem;">
                                         ${profile.subscription_tier !== 'free' ? 'G&eacute;rer mon Pack' : 'Activer l\'&Eacute;tape 2'}
                                     </button>
                                </div>
                        </div>
                    </div>

                    <!-- Pilotage & Matchmaking -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                        <button onclick="window.Router.navigate('#business')" class="dash-card" style="padding: 32px; background: white; border: 1px solid #f1f5f9; border-radius: 24px; text-align: left; cursor: pointer; transition: 0.3s; display: block; width: 100%;">
                            <h4 style="font-size: 0.8rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Pilotage Business</h4>
                            <div style="font-size: 1.4rem; font-weight: 900; color: #020617;">Facturation & Devis &rarr;</div>
                        </button>
                        <button onclick="window.location.href='marketplace/jobs.html'" class="dash-card" style="padding: 32px; background: white; border: 1px solid #f1f5f9; border-radius: 24px; text-align: left; cursor: pointer; transition: 0.3s; display: block; width: 100%;">
                            <h4 style="font-size: 0.8rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Opportunit&eacute;s</h4>
                            <div style="font-size: 1.4rem; font-weight: 900; color: #10b981;">Voir les Missions &rarr;</div>
                        </button>
                    </div>

                    <!-- Pack Expert Management -->
                    <div id="expert-pack-view" class="dash-card" style="padding: 40px; border-radius: 24px; background: white; border: 1px solid #f1f5f9;">
                         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                            <h3 style="font-size: 1.2rem; font-weight: 900; color: #020617; text-transform: uppercase;">Abonnement Expert</h3>
                            <button onclick="ExpertsModule.showExpertPacks()" style="padding: 12px 24px; background: #020617; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">G&eacute;rer mon Pack</button>
                         </div>
                         <div style="background: #f8fafc; border-radius: 20px; padding: 32px; border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 24px;">
                            <div style="width: 64px; height: 64px; background: rgba(16,185,129,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </div>
                            <div>
                                <div style="font-weight: 900; color: #020617;">STATUT : EXPERT NIVEAU 1</div>
                                <div style="font-size: 0.9rem; color: #64748b; font-weight: 600;">Prochain palier à 500 points.</div>
                            </div>
                         </div>
                    </div>
                </div>

                <!-- SIDEBAR -->
                <div class="dash-side-col">
                    <button onclick="window.Router.navigate('#collaboration')" style="width: 100%; padding: 22px; background: #2563eb; color: white; border: none; border-radius: 18px; font-weight: 900; font-size: 1.1rem; cursor: pointer; margin-bottom: 24px; box-shadow: 0 10px 20px rgba(37,99,235,0.2);">Collaborer</button>
                    
                    <!-- Quick Actions -->
                    <div style="background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 32px; margin-bottom: 24px;">
                        <h4 style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px;">Indicateurs Performance</h4>
                        <div style="display: grid; gap: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #64748b; font-weight: 600;">Profil Vues</span>
                                <span style="color: #020617; font-weight: 900;">0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #64748b; font-weight: 600;">Disponibilit&eacute;</span>
                                <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 10px; border-radius: 8px; font-weight: 900; font-size: 0.75rem;">ACTIF</span>
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
     * MATERIALIZING THE EXPERT PACKS - Selection Interface
     */
    showExpertPacks: () => {
        const view = document.getElementById('expert-pack-view');
        if (!view) return;

        view.innerHTML = `
            <div style="animation: fadeInUp 0.4s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h3 style="font-size: 1.2rem; font-weight: 900; color: #020617; text-transform: uppercase;">Abonnement Professionnel</h3>
                    <button onclick="window.location.reload()" style="background:none; border:none; color:#10b981; font-weight:800; cursor:pointer;">&larr; Retour</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
                    <div style="padding: 32px; border-radius: 20px; border: 2px solid #020617; background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.05); text-align: center;">
                        <div style="font-weight: 900; color: #10b981; margin-bottom: 8px;">PACK EXPERT</div>
                        <div style="font-size: 3rem; font-weight: 950; color: #020617; margin-bottom: 24px;">9,99&euro;<span style="font-size: 1rem; color: #64748b;">/mois</span></div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 40px; color: #475569; font-weight: 600; display: inline-block; text-align: left;">
                             <li style="margin-bottom: 12px;">\u2713 Acc&egrave;s complet aux Missions</li>
                             <li style="margin-bottom: 12px;">\u2713 Visibilit&eacute; Premium Annuaire</li>
                             <li style="margin-bottom: 12px;">\u2713 Mises en relation prioritaires</li>
                        </ul>
                        <button onclick="alert('Activation Pack Expert...')" style="width: 100%; max-width: 300px; padding: 18px; background: #020617; border: none; border-radius: 16px; font-weight: 900; color: white; cursor: pointer; margin: 0 auto; display: block;">G&eacute;rer mon Pack</button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Business Pilotage - Expert Dashboard Hub
     */
    renderBusinessPilotage: async (container, profile, session) => {
        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Inter', sans-serif; padding: 60px; width: 100%; box-sizing: border-box;">
                <div style="margin-bottom: 50px;">
                    <h1 style="font-weight: 950; color: #020617; font-size: 3rem; letter-spacing: -0.05em; margin-bottom: 12px;">Pilotage d'Activit&eacute;</h1>
                    <p style="color: #64748b; font-size: 1.2rem; font-weight: 600;">G&eacute;rez votre business, vos devis et votre impact territorial.</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-bottom: 60px;">
                    <div class="dash-card" style="background: white; padding: 48px; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.03); position: relative; overflow: hidden;">
                         <div style="position: absolute; top:0; left:0; width: 4px; height: 100%; background: #020617;"></div>
                         <h4 style="font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Revenus G&eacute;n&eacute;r&eacute;s</h4>
                         <div style="font-size: 3.5rem; font-weight: 950; color: #020617;">0,00 &euro;</div>
                    </div>
                    <div class="dash-card" style="background: white; padding: 48px; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.03); position: relative; overflow: hidden;">
                         <div style="position: absolute; top:0; left:0; width: 4px; height: 100%; background: #10b981;"></div>
                         <h4 style="font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Missions en cours</h4>
                         <div style="font-size: 3.5rem; font-weight: 950; color: #10b981;">0</div>
                    </div>
                    <div class="dash-card" style="background: white; padding: 48px; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.03); position: relative; overflow: hidden;">
                         <div style="position: absolute; top:0; left:0; width: 4px; height: 100%; background: #2563eb;"></div>
                         <h4 style="font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Impact Territoire</h4>
                         <div style="font-size: 3.5rem; font-weight: 950; color: #2563eb;">Elite</div>
                    </div>
                </div>

                <div class="dash-card" style="background: linear-gradient(135deg, #020617 0%, #1e293b 100%); border-radius: 32px; padding: 80px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <div style="max-width: 600px;">
                        <h3 style="font-weight: 950; margin-bottom: 16px; font-size: 2rem;">Prêt à booster votre visibilité ?</h3>
                        <p style="color: rgba(255,255,255,0.6); font-weight: 600; font-size: 1.1rem;">Activez votre collaboration active pour débloquer plus de missions et renforcer votre impact.</p>
                    </div>
                    <button onclick="window.Router.navigate('#collaboration')" style="padding: 24px 60px; background: #fff; color: #020617; border: none; border-radius: 20px; font-weight: 950; cursor: pointer; font-size: 1.2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">Lancer une Collaboration</button>
                </div>
            </div>
        `;
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
