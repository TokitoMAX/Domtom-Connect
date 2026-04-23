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
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;
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
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                
                <!-- HEADER -->
                <div style="background: #020617; border-radius: 20px; padding: clamp(24px, 5vw, 40px); margin-bottom: 32px; color: white;">
                    <span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Espace Expert</span>
                    <h1 style="font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 900; margin: 12px 0 12px 0;">Bonjour, ${profile.full_name || 'Expert'}</h1>
                    <p style="color: rgba(255,255,255,0.7); font-size: 1rem; margin: 0;">Suivez votre activité et gérez votre impact territorial.</p>
                </div>

                <!-- CARDS GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <h4 style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 0 0 12px 0;">Pilotage Business</h4>
                        <div style="font-size: 1.4rem; font-weight: 800; color: #020617; margin-bottom: 16px;">Devis & Missions</div>
                        <button onclick="window.Router.navigate('#business')" style="width: 100%; padding: 12px; background: #f1f5f9; color: #020617; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">Ouvrir le Pilotage</button>
                    </div>

                    <div style="background: #f0fdf4; border: 1px solid #10b981; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(16,185,129,0.1);">
                        <h4 style="font-size: 0.8rem; font-weight: 800; color: #10b981; text-transform: uppercase; margin: 0 0 12px 0;">Opportunités</h4>
                        <div style="font-size: 1.4rem; font-weight: 800; color: #020617; margin-bottom: 16px;">Voir les Missions</div>
                        <button onclick="window.location.href='marketplace/jobs.html'" style="width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">Explorer</button>
                    </div>
                </div>

                <!-- PACK EXPERT (PAYPAL) -->
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: clamp(24px, 5vw, 40px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h3 style="font-size: 1.5rem; font-weight: 900; color: #020617; margin: 0 0 8px 0;">PACK EXPERT</h3>
                        <div style="font-size: 2.5rem; font-weight: 900; color: #020617;">9,99€ <span style="font-size: 1rem; color: #64748b; font-weight: 600;">/mois</span></div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; background: #f8fafc; padding: 24px; border-radius: 16px;">
                         <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; color: #020617;">
                             <span style="color: #10b981; font-weight: bold; font-size: 1.2rem;">✓</span> Accès complet aux Missions
                         </div>
                         <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; color: #020617;">
                             <span style="color: #10b981; font-weight: bold; font-size: 1.2rem;">✓</span> Visibilité Premium
                         </div>
                         <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; color: #020617;">
                             <span style="color: #10b981; font-weight: bold; font-size: 1.2rem;">✓</span> 0% de Commission
                         </div>
                    </div>

                    <button onclick="window.PaymentModule ? window.PaymentModule.openSubModal('authority', 'expert') : alert('Le module de paiement charge, veuillez patienter.')" style="width: 100%; max-width: 400px; margin: 0 auto; display: block; padding: 16px; background: #020617; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 800; color: white; cursor: pointer; transition: 0.2s;">
                        Activer mon Pack Premium
                    </button>
                </div>
            </div>
        `;
        
        if (session && session.user && typeof window.loadMatchmaking === 'function') {
            window.loadMatchmaking(session.user.id);
        }
    },


    /**
     * Business Pilotage - Expert Dashboard Hub
     */
    renderBusinessPilotage: async (container, profile, session) => {
        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                <div style="margin-bottom: 32px;">
                    <h1 style="font-weight: 950; color: #020617; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.05em; margin: 0 0 8px 0;">Pilotage d'Activité</h1>
                    <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin: 0;">Gérez vos devis, factures et suivi territorial.</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                    <div style="background: white; padding: clamp(24px, 4vw, 40px); border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                         <h4 style="font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin: 0 0 16px 0;">Revenus Générés</h4>
                         <div style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: #020617;">0,00 €</div>
                    </div>
                    <div style="background: white; padding: clamp(24px, 4vw, 40px); border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                         <h4 style="font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin: 0 0 16px 0;">Missions Terminées</h4>
                         <div style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: #10b981;">0</div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #020617 0%, #1e293b 100%); border-radius: 24px; padding: clamp(32px, 6vw, 64px); color: white; display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; align-items: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
                    <div style="flex: 1; min-width: 250px;">
                        <h3 style="font-weight: 900; margin: 0 0 12px 0; font-size: 1.8rem;">Facturation Intégrée</h3>
                        <p style="color: rgba(255,255,255,0.7); font-weight: 500; margin: 0; font-size: 1rem;">Générez vos factures certifiées en un seul clic.</p>
                    </div>
                    <button onclick="alert('Module de facturation en cours d\\'activation.')" style="padding: 16px 32px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; white-space: nowrap;">Bientôt disponible</button>
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
