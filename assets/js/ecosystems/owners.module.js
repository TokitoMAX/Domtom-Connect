/**
 * Domtom Connect - Project Owner Ecosystem Module
 * Logic for Project Owners (Epic Project Management)
 */
const OwnersModule = {
    role: 'owner',

    /**
     * Module Router
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
            case 'success-engine':
                if (window.loadMyProjects) {
                    const engineContainer = document.getElementById('success-engine-view-fixed');
                    if (engineContainer) {
                        engineContainer.style.display = 'block';
                        window.loadMyProjects(session.user.id);
                    }
                }
                break;
            case 'billetterie':
                const tickView = document.getElementById('billetterie-view');
                if (tickView && window.TicketingModule) {
                    tickView.style.display = 'block';
                    window.TicketingModule.loadMyTicketing(params);
                }
                break;
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView && window.BusinessModule) {
                    bizView.style.display = 'block';
                    window.BusinessModule.renderView(bizView);
                }
                break;
            case 'marketplace':
                if (window.ShowcaseModule) {
                    ShowcaseModule.renderMarketplace(target);
                }
                break;
            case 'overview':
            default:
                OwnersModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Epic Presentation (Mobile Corrected)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        // Funding Calculation
        const goal = profile.budget || 5000;
        const current = profile.current_funding || 0;
        const percent = Math.min(Math.round((current / goal) * 100), 100);

        // Calculate a generic maturity score for the dashboard gauge
        let maturity = 0;
        if (profile.vision) maturity += 20;
        if (profile.mission) maturity += 20;
        if (profile.enjeu) maturity += 20;
        if (profile.project_name) maturity += 20;
        if (profile.current_funding > 0) maturity += 20;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- 1. COMPACT HERO BANNER -->
                <div class="epic-hero" style="grid-column: 1 / -1; background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 24px; padding: 40px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); min-height: 280px; display: flex; align-items: center; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                    <div style="position: relative; z-index: 10; max-width: 800px;">
                        <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 16px; border: 1px solid rgba(16,185,129,0.2);">Cockpit de Commandement</div>
                        <h1 style="font-size: 3rem; font-weight: 950; color: white; margin: 0; letter-spacing: -0.05em; line-height: 1;">${profile.project_name || 'Ma Nouvelle Épopée'}</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 1.1rem; margin-top: 16px; font-weight: 500; max-width: 500px;">
                            ${profile.territory || 'Guyane'} • Pilotage stratégique & Impact territorial.
                        </p>
                    </div>
                </div>

                <!-- 2. MODULAR BLOCKS GRID (The user's requested "several small blocks") -->
                
                <!-- Block A: Strategic Maturity -->
                <div style="grid-column: span 4; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                    <h4 style="font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px;">Maturité Stratégique</h4>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="width: 70px; height: 70px; border-radius: 50%; border: 6px solid #f1f5f9; border-top-color: #10b981; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; color: #0f172a; transform: rotate(${maturity * 3.6}deg);">
                            <span style="transform: rotate(-${maturity * 3.6}deg);">${maturity}%</span>
                        </div>
                        <div>
                            <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">Structure Optimale</div>
                            <div style="font-size: 0.8rem; color: #64748b;">Prêt pour la validation</div>
                        </div>
                    </div>
                </div>

                <!-- Block B: Financing Card -->
                <div style="grid-column: span 4; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                    <h4 style="font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px;">Cagnotte en Temps Réel</h4>
                    <div style="font-size: 2.2rem; font-weight: 950; color: #0f172a; letter-spacing: -0.04em;">${current.toLocaleString()} €</div>
                    <div style="font-size: 0.8rem; font-weight: 700; color: #10b981; margin-top: 4px;">Objectif : ${goal.toLocaleString()} €</div>
                    <div style="height: 6px; background: #f1f5f9; border-radius: 100px; margin-top: 16px; overflow: hidden;">
                        <div style="width: ${percent}%; height: 100%; background: #10b981; border-radius: 100px;"></div>
                    </div>
                </div>

                <!-- Block C: Community Block -->
                <div style="grid-column: span 4; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                    <h4 style="font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px;">Mobilisation</h4>
                    <div style="display: flex; align-items: baseline; gap: 8px;">
                        <div style="font-size: 2.2rem; font-weight: 950; color: #0f172a;">12</div>
                        <div style="font-size: 0.8rem; font-weight: 700; color: #64748b;">Contributeurs</div>
                    </div>
                    <div style="display: flex; -webkit-mask-image: linear-gradient(90deg, black 60%, transparent); margin-top: 12px; gap: -8px;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #e2e8f0; border: 2px solid white;"></div>
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #cbd5e1; border: 2px solid white; margin-left: -8px;"></div>
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #94a3b8; border: 2px solid white; margin-left: -8px;"></div>
                    </div>
                </div>

                <!-- 3. STRATEGIC SNAPSHOTS (Small blocks for Vision/Mission/Enjeu) -->
                <div style="grid-column: span 4; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 20px; padding: 20px;">
                    <div style="font-size: 0.65rem; font-weight: 850; color: #10b981; text-transform: uppercase; margin-bottom: 8px;">Vision Snapshot</div>
                    <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0; font-weight: 600;">${profile.vision || 'Définissez votre vision long terme...'}</p>
                </div>

                <div style="grid-column: span 4; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 20px; padding: 20px;">
                    <div style="font-size: 0.65rem; font-weight: 850; color: #10b981; text-transform: uppercase; margin-bottom: 8px;">Mission Snapshot</div>
                    <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0; font-weight: 600;">${profile.mission || 'Définissez votre action quotidienne...'}</p>
                </div>

                <div style="grid-column: span 4; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 20px; padding: 20px;">
                    <div style="font-size: 0.65rem; font-weight: 850; color: #10b981; text-transform: uppercase; margin-bottom: 8px;">Enjeu Snapshot</div>
                    <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0; font-weight: 600;">${profile.enjeu || 'Définissez l\'enjeu territorial...'}</p>
                </div>

                <!-- 4. ACTION CENTER (Professional Hubs) -->
                <div style="grid-column: span 6; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                    <h4 style="font-size: 0.65rem; font-weight: 950; color: #10b981; text-transform: uppercase; margin-bottom: 16px;">Gestion Évènementielle</h4>
                    <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 20px;">Billetterie & Accès</div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.Router.navigate('#billetterie?action=create')" style="flex: 1; padding: 12px; background: #0f172a; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">+ Créer</button>
                        <button onclick="window.Router.navigate('#billetterie')" style="flex: 1; padding: 12px; background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 900; cursor: pointer;">Gérer mes Évènements</button>
                    </div>
                </div>

                <div style="grid-column: span 6; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                    <h4 style="font-size: 0.65rem; font-weight: 950; color: #3b82f6; text-transform: uppercase; margin-bottom: 16px;">Finance & Pilotage</h4>
                    <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 20px;">Devis & Facturation</div>
                    <button onclick="window.location.hash = 'business'" style="width: 100%; padding: 12px; background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 900; cursor: pointer;">Accéder aux Documents</button>
                </div>

                <!-- 5. MAIN NAVIGATION -->
                <div style="grid-column: span 12; margin-top: 16px;">
                    <div style="background: #0f172a; border-radius: 24px; padding: 32px; display: flex; align-items: center; justify-content: space-between; gap: 32px; border: 1px solid rgba(255,255,255,0.05);">
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 950; color: white; margin: 0 0 4px 0;">Pilotage de l'Épopée</h3>
                            <p style="color: rgba(255,255,255,0.5); font-size: 0.95rem; margin: 0; font-weight: 600;">Centralisez vos actions, financements et validation de projet.</p>
                        </div>
                        <button onclick="window.Router.navigate('#success-engine')" style="background: #10b981; color: white; border: none; padding: 16px 32px; border-radius: 14px; font-weight: 950; font-size: 1rem; cursor: pointer; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 25px rgba(16,185,129,0.2);">
                            Lancer Success Engine
                        </button>
                    </div>
                </div>

            </div>
        `;
    },

    /**
     * RESTORED: Epic Specific Manifesto Fields
     */
    renderProfileFields: (profile) => {
        return `
            <div style="background:#f1f5f9; padding:24px; border-radius:24px; border:1.5px solid #e2e8f0; margin-bottom:24px;">
                <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:24px;">Manifeste de l'&Eacute;pop&eacute;e</h3>
                <div style="display: grid; gap: 20px;">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #475569; margin-bottom:8px;">Vision Strat&eacute;gique (Objectif long terme)</label>
                        <textarea id="profile-vision" style="width: 100%; min-height: 80px; padding: 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 600;">${profile.vision || ''}</textarea>
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #475569; margin-bottom:8px;">Notre Mission (Action quotidiennes)</label>
                        <textarea id="profile-mission" style="width: 100%; min-height: 80px; padding: 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 600;">${profile.mission || ''}</textarea>
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #475569; margin-bottom:8px;">L'Enjeu du Projet (Pourquoi maintenant ?)</label>
                        <textarea id="profile-enjeu" style="width: 100%; min-height: 80px; padding: 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 600;">${profile.enjeu || ''}</textarea>
                    </div>
                </div>
            </div>
            
            <div style="background:#fff; padding:24px; border-radius:24px; border:1.5px solid #e2e8f0; display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                 <div class="info-field">
                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom:8px;">Nom de l'&Eacute;pop&eacute;e</label>
                    <input type="text" id="profile-project_name" value="${profile.project_name || ''}" placeholder="Ex: Énergies Vertes Martinique" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                </div>
                <div class="info-field">
                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom:8px;">Objectif Cagnotte (&euro;)</label>
                    <input type="number" id="profile-budget" value="${profile.budget || 5000}" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                </div>
            </div>
        `;
    }
};

window.OwnersModule = OwnersModule;
