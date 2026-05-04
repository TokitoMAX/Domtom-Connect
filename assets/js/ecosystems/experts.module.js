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
                const bizView = document.getElementById('business-view');
                if (bizView) {
                    bizView.style.display = 'block';
                    await ExpertsModule.renderBusinessPilotage(bizView, profile, session);
                }
                break;
            case 'profile':
                if (window.StandardModule) {
                    await window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'billetterie':
                const ticketingView = document.getElementById('billetterie-view');
                if (ticketingView && window.TicketingModule) {
                    ticketingView.style.display = 'block';
                    window.TicketingModule.loadMyTicketing(params);
                }
                break;
            case 'vitrine':
                if (window.ShowcaseModule) {
                    ShowcaseModule.renderManager(target);
                }
                break;
            case 'missions':
                window.location.href = 'marketplace/jobs.html';
                break;
            case 'overview':
            default:
                if (container) container.style.display = 'block';
                else {
                    const overview = document.getElementById('overview-view');
                    if (overview) overview.style.display = 'block';
                }
                ExpertsModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Rendering Logic - Restauration Marque & Conversion Authority
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;
        const isAdmin = window.activeRole === 'admin';
        const badgeColor = isAdmin ? '#3b82f6' : '#10b981';
        const badgeText = isAdmin ? 'ESPACE ADMINISTRATION' : 'Espace Expert';
        const welcomeMsg = isAdmin ? 'Outils de Supervision Shell' : 'Suivez votre activité et gérez votre impact territorial.';

        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                
                <!-- HEADER -->
                <div style="background: ${isAdmin ? 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' : '#020617'}; border-radius: 24px; padding: clamp(24px, 5vw, 48px); margin-bottom: 32px; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <span style="background: rgba(255,255,255,0.1); border: 1px solid ${badgeColor}; color: ${badgeColor}; padding: 4px 14px; border-radius: 99px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">${badgeText}</span>
                    <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; margin: 16px 0; letter-spacing:-0.05em;">Bonjour, ${profile.full_name || 'Admin'}</h1>
                    <p style="color: rgba(255,255,255,0.6); font-size: 1.1rem; font-weight:600; margin: 0;">${welcomeMsg}</p>
                </div>

                <!-- CARDS GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Ventes & Devis</h4>
                        <div style="font-size: 1.4rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Gestion Business</div>
                        <button onclick="window.location.hash = 'business'" style="width: 100%; padding: 14px; background: #f8fafc; color: #020617; border: 1.5px solid #e2e8f0; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.2s;">Ouvrir le Pilotage</button>
                    </div>

                    <div style="background: #f0fdf4; border: 1.5px solid #10b981; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #10b981; text-transform: uppercase; margin-bottom: 16px;">Missions Disponibles</h4>
                        <div style="font-size: 1.4rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Voir le Hub Jobs</div>
                        <button onclick="window.location.href='marketplace/jobs.html'" style="width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">Accéder aux Offres</button>
                    </div>

                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Ma Vitrine Showcase</h4>
                        <div style="font-size: 1.4rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Services Digitaux</div>
                        <button onclick="window.location.hash = 'vitrine'" style="width: 100%; padding: 14px; background: #020617; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">Gérer mes Offres</button>
                    </div>

                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #10b981; text-transform: uppercase; margin-bottom: 16px;">Gestion Évènementielle</h4>
                        <div style="font-size: 1.4rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Billetterie & Accès</div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="window.Router.navigate('#billetterie?action=create')" style="flex: 1; padding: 12px; background: #0f172a; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">+ Créer</button>
                            <button onclick="window.Router.navigate('#billetterie')" style="flex: 1; padding: 12px; background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 900; cursor: pointer;">Gérer</button>
                        </div>
                    </div>
                </div>

                ${!isAdmin ? `
                <!-- PACK EXPERT (Visible pour Experts uniquement) -->
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 32px; padding: 48px; box-shadow: 0 20px 50px rgba(0,0,0,0.05); text-align:center;">
                    <h3 style="font-size: 1.8rem; font-weight: 950; color: #020617; margin: 0 0 8px 0; letter-spacing:-0.03em;">PACK EXPERT PREMIUM</h3>
                    <div style="font-size: 3rem; font-weight: 950; color: #10b981; margin-bottom:32px;">9,99€ <span style="font-size: 1rem; color: #64748b; font-weight: 700;">/MOIS</span></div>
                    <button onclick="window.PaymentModule ? window.PaymentModule.openSubModal('authority', 'expert') : alert('Chargement...')" style="max-width: 400px; width:100%; padding: 20px; background: #020617; color: white; border: none; border-radius: 18px; font-size: 1.1rem; font-weight: 950; cursor: pointer;">Activer mon Pack</button>
                </div>
                ` : `
                <!-- ADMIN PREVIEW NOTICE -->
                <div style="background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 24px; padding: 32px; text-align:center; color:#1d4ed8; font-weight:800;">
                    ✓ MODE ADMINISTRATEUR ACTIF : Vous bénéficiez de tous les accès pro sans restriction.
                </div>
                `}
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
                         <h4 style="font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin: 0 0 16px 0;">Solde Disponible</h4>
                         <div style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: #020617;">${(profile.balance || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                    </div>
                    
                    <div style="background: ${profile.stripe_connect_id ? (profile.stripe_payouts_enabled ? '#f8fafc' : '#fff7ed') : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'}; padding: 32px; border-radius: 20px; color: ${profile.stripe_connect_id ? '#020617' : 'white'}; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;">
                        ${!profile.stripe_connect_id ? `
                            <div style="position:relative; z-index:2;">
                                <h4 style="font-size: 0.7rem; font-weight: 900; opacity: 0.9; text-transform: uppercase; margin-bottom: 8px;">CONFIGURATION REQUISE</h4>
                                <div style="font-size: 1.2rem; font-weight: 950; margin-bottom: 16px;">Recevez vos paiements automatiquement</div>
                                <button id="connect-stripe-btn" style="padding: 12px 20px; background: white; color: #4f46e5; border: none; border-radius: 10px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                    <span>💳 Activer Stripe Connect</span>
                                </button>
                            </div>
                            <div style="position:absolute; right:-20px; bottom:-20px; font-size:6rem; opacity:0.1; transform: rotate(-15deg);">💳</div>
                        ` : (profile.stripe_payouts_enabled ? `
                            <h4 style="font-size: 0.7rem; font-weight: 900; color: #10b981; text-transform: uppercase; margin-bottom: 8px;">COMPTE OPÉRATIONNEL ✅</h4>
                            <div style="font-size: 1.2rem; font-weight: 950; margin-bottom: 16px;">Virements Automatiques Actifs</div>
                            <button onclick="window.open('https://dashboard.stripe.com/', '_blank')" style="padding: 12px 20px; background: #020617; color: white; border: none; border-radius: 10px; font-weight: 900; cursor: pointer;">Accéder à mon Dashboard Stripe</button>
                        ` : `
                            <div style="position:relative; z-index:2;">
                                <h4 style="font-size: 0.7rem; font-weight: 900; color: #ea580c; text-transform: uppercase; margin-bottom: 8px;">COMPTE LIMITÉ ⚠️</h4>
                                <div style="font-size: 1.1rem; font-weight: 950; margin-bottom: 16px; color: #9a3412;">Informations manquantes sur Stripe</div>
                                <button id="connect-stripe-btn" style="padding: 12px 20px; background: #ea580c; color: white; border: none; border-radius: 10px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                    <span>🔧 Finaliser la configuration</span>
                                </button>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- Facturation Engine Mount Point -->
                <div id="business-module-mount-point" style="background: white; border-radius: 24px; border: 1px solid #e2e8f0; min-height: 400px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
                     <div style="text-align:center; padding: 60px;">
                        <h3 style="font-weight: 900; color: #020617; font-size: 1.5rem; margin-bottom: 12px;">Facturation Certifiée DTC</h3>
                        <p style="color: #64748b; margin-bottom: 32px;">L'outil professionnel pour vos devis et facturation.</p>
                        <button id="load-billing-engine-btn" class="cta-button primary" style="padding: 16px 32px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(16,185,129,0.2);">Activer la Console de Facturation</button>
                     </div>
                </div>
            </div>
        `;
        
        // Add listener for the buttons
        setTimeout(() => {
            const connectBtn = document.getElementById('connect-stripe-btn');
            if (connectBtn) {
                connectBtn.onclick = async () => {
                    connectBtn.disabled = true;
                    connectBtn.innerHTML = '<span>⏳ Préparation...</span>';
                    try {
                        const { data: { session } } = await window._supabase.auth.getSession();
                        const response = await fetch('https://vlpzmxddgdjjtrpbtksd.supabase.co/functions/v1/create-connect-onboarding', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${session?.access_token || ''}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        const data = await response.json();
                        if (data.url) window.location.href = data.url;
                        else throw new Error(data.error);
                    } catch (err) {
                        alert("Erreur: " + err.message);
                        connectBtn.disabled = false;
                        connectBtn.innerHTML = '<span>💳 Activer Stripe Connect</span>';
                    }
                };
            }

            const btn = document.getElementById('load-billing-engine-btn');
            if (btn && window.BusinessModule) {
                btn.onclick = () => {
                    const mountPoint = document.getElementById('business-module-mount-point');
                    if (mountPoint) {
                        window.BusinessModule.renderDashboard(mountPoint);
                    }
                };
            }
        }, 100);
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
