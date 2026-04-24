/**
 * Domtom Connect - Company Ecosystem Module
 * Logic for Companies (Partner SaaS Standard)
 */
const CompaniesModule = {
    role: 'entreprise',

    /**
     * Module Router
     */
    route: async (view_id, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;
        const topNav = document.getElementById('ecosystem-top-nav');
        if (topNav) topNav.style.display = 'none';

        switch (view_id) {
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView) {
                    bizView.style.display = 'block';
                    if (window.BusinessModule) await window.BusinessModule.renderView(bizView);
                }
                break;
            case 'profile':
                if (window.StandardModule) {
                    window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'billetterie':
                const tickView = document.getElementById('billetterie-view');
                if (tickView && window.TicketingModule) {
                    tickView.style.display = 'block';
                    window.TicketingModule.loadMyTicketing(params);
                }
                break;
            case 'vitrine':
                if (window.ShowcaseModule) {
                    ShowcaseModule.renderManager(target);
                }
                break;
            case 'overview':
            default:
                if (container) container.style.display = 'block';
                CompaniesModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Institutional Presentation (Mobile Fixed)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                
                <!-- HEADER -->
                <div style="background: #020617; border-radius: 20px; padding: clamp(24px, 5vw, 40px); margin-bottom: 32px; color: white;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Espace Entreprise</span>
                            <h1 style="font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; margin: 12px 0 8px 0;">${profile.company_name || profile.full_name || 'Votre Entreprise'}</h1>
                            <p style="color: #94a3b8; font-size: 1rem; margin: 0;">Centre de commandement pour vos talents et missions.</p>
                        </div>
                        <div style="text-align: right; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; min-width: 200px;">
                            <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">SIRET</div>
                            <div style="font-size: 1rem; color: white; font-weight: 700;">${profile.siret || 'En vérification'}</div>
                        </div>
                    </div>
                </div>

                <!-- CARDS GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 32px;">
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <h4 style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 0 0 12px 0;">Pilotage Business</h4>
                        <div style="font-size: 1.4rem; font-weight: 800; color: #020617; margin-bottom: 16px;">Devis & Factures</div>
                        <button onclick="window.location.hash = 'business'" style="width: 100%; padding: 12px; background: #f1f5f9; color: #020617; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">Ouvrir le Pilotage</button>
                    </div>

                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <h4 style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 0 0 12px 0;">Réseau Experts</h4>
                        <div style="font-size: 1.4rem; font-weight: 800; color: #020617; margin-bottom: 16px;">Trouver des Talents</div>
                        <button onclick="window.location.href='marketplace/talents.html'" style="width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">Explorer l'Annuaire</button>
                    </div>

                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <h4 style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 0 0 12px 0;">Notre Vitrine</h4>
                        <div style="font-size: 1.4rem; font-weight: 800; color: #020617; margin-bottom: 16px;">Produits & Services</div>
                        <button onclick="window.location.hash = 'vitrine'" style="width: 100%; padding: 12px; background: #0f172a; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">Gérer notre Vitrine</button>
                    </div>
                </div>

                <!-- PACK ENTREPRISE (PAYPAL) -->
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: clamp(24px, 5vw, 40px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px; margin-bottom: 32px;">
                        <div>
                            <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; color: #475569;">OFFRE PREMIUM</span>
                            <h3 style="font-size: 1.8rem; font-weight: 900; color: #020617; margin: 12px 0 0 0;">Pack Business Growth</h3>
                            <p style="color: #64748b; font-weight: 500; font-size: 1rem; margin-top: 4px;">Recrutement illimité et visibilité maximale.</p>
                        </div>
                        <div style="text-align: right;">
                             <div style="font-size: 2.5rem; font-weight: 900; color: #020617;">29,00€</div>
                             <div style="font-size: 0.9rem; color: #64748b; font-weight: 600;">/ mois</div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 40px; padding: 24px; background: #f8fafc; border-radius: 16px;">
                         <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; color: #020617;">
                             <span style="color: #2563eb; font-weight: bold; font-size: 1.2rem;">✓</span> Missions Illimitées
                         </div>
                         <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; color: #020617;">
                             <span style="color: #2563eb; font-weight: bold; font-size: 1.2rem;">✓</span> Accès Talents Illimité
                         </div>
                         <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; color: #020617;">
                             <span style="color: #2563eb; font-weight: bold; font-size: 1.2rem;">✓</span> Statut Entreprise Certifiée
                         </div>
                    </div>

                    <button onclick="window.PaymentModule ? window.PaymentModule.openSubModal('growth', 'entreprise') : alert('Le module de paiement charge, veuillez patienter.')" style="width: 100%; padding: 20px; background: #020617; border: none; border-radius: 16px; font-size: 1.2rem; font-weight: 900; color: white; cursor: pointer; transition: background 0.3s;">
                        Passer au Pack Privilège via PayPal
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Specialized Fields (Responsive)
     */
    renderProfileFields: (profile) => {
        return `
            <style>
                .profile-grid-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                @media (max-width: 600px) { .profile-grid-fields { grid-template-columns: 1fr !important; } }
            </style>
            <div style="background:#f8fafc; padding:24px; border-radius:20px; border:1px solid #f1f5f9; display:grid; gap:24px;">
                <h3 style="font-size:0.85rem; font-weight:900; color:#10b981; text-transform:uppercase; letter-spacing:0.05em;">D&eacute;tails Institutionnels</h3>
                <div class="profile-grid-fields">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">SIRET</label>
                        <input type="text" id="profile-siret" value="${profile.siret || ''}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Zone / R&eacute;gion</label>
                        <input type="text" id="profile-zone" value="${profile.zone || ''}" placeholder="Ex: Paris, Martinique..." style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                </div>
                <div class="profile-grid-fields">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Ann&eacute;e de Cr&eacute;ation</label>
                        <input type="number" id="profile-creation_year" value="${profile.creation_year || 2025}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Taille d'&eacute;quipe</label>
                        <input type="text" id="profile-team_size" value="${profile.team_size || ''}" placeholder="Ex: Indépendant, 10-50, etc." style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                </div>
                <div class="info-field">
                    <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Secteur d'Activit&eacute;</label>
                    <input type="text" id="profile-sector" value="${profile.sector || ''}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                </div>
            </div>
        `;
    },

    /**
     * Business Pilotage - Company Dashboard Hub
     */
    renderBusinessPilotage: async (container, profile, session) => {
        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                <div style="margin-bottom: 32px;">
                    <h1 style="font-weight: 950; color: #020617; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.05em; margin: 0 0 8px 0;">Pilotage d'Activité</h1>
                    <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin: 0;">Gérez vos finances et vos relations prestataires.</p>
                </div>

                <div id="company-business-mount" style="background: white; border-radius: 24px; border: 1px solid #e2e8f0; min-height: 400px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
                    <div style="text-align:center; padding: 40px;">Chargement du centre financier...</div>
                </div>
            </div>
        `;
        
        if (window.BusinessModule) {
            window.BusinessModule.renderDashboard(document.getElementById('company-business-mount'));
        }
    }
};

window.CompaniesModule = CompaniesModule;
