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

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif; gap: 32px; display: grid; grid-template-columns: repeat(12, 1fr);">
                
                <!-- 1. EPIC HERO BANNER -->
                <div class="epic-hero" style="grid-column: span 12; background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 32px; padding: 64px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); min-height: 380px; display: flex; align-items: center; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
                    <div style="position: relative; z-index: 10; max-width: 800px;">
                        <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 950; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 24px; border: 1px solid rgba(16,185,129,0.2);">Centre de Commandement</div>
                        <h1 style="font-size: 4.5rem; font-weight: 950; color: white; margin: 0; letter-spacing: -0.06em; line-height: 0.9;">Propulsez votre<br><span style="color: #10b981;">Impact Local.</span></h1>
                        <p style="color: rgba(255,255,255,0.6); font-size: 1.25rem; margin-top: 32px; font-weight: 500; line-height: 1.6; max-width: 600px;">
                            Porteur de projet en ${profile.territory || 'Guyane'}. Gérez vos ambitions stratégiques, mobilisez votre communauté et transformez vos idées en réalités concrètes.
                        </p>
                    </div>
                    <!-- Decorative patterns -->
                    <div style="position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; filter: blur(100px);"></div>
                </div>

                <!-- 2. NAVIGATION INTERNE -->
                <div class="epic-tabs" style="grid-column: span 12; display: flex; gap: 40px; border-bottom: 1px solid #e2e8f0; padding: 0 16px; margin-top: 8px;">
                    <button class="active" style="padding: 20px 0; background: none; border: none; font-weight: 900; font-size: 0.9rem; color: #0f172a; border-bottom: 3px solid #10b981; text-transform: uppercase; letter-spacing: 0.05em;">Le Manifeste</button>
                    <button style="padding: 20px 0; background: none; border: none; font-weight: 800; font-size: 0.9rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer;">Stratégie</button>
                    <button style="padding: 20px 0; background: none; border: none; font-weight: 800; font-size: 0.9rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer;">Équipe & Impact</button>
                    <button style="padding: 20px 0; background: none; border: none; font-weight: 800; font-size: 0.9rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer;">Propulsion</button>
                </div>

                <!-- 3. MAIN GRID -->
                <div class="epic-grid-container" style="grid-column: span 12; display: grid; grid-template-columns: 1fr 380px; gap: 40px;">
                    
                    <!-- LEFT: STRATEGIC FIELDS -->
                    <div class="manifesto-section" style="display: grid; gap: 32px;">
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 32px; padding: 48px; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                             <div style="background: #f8fafc; color: #10b981; padding: 8px 16px; border-radius: 10px; font-size: 0.7rem; font-weight: 950; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 24px;">MANIFESTE : VISION</div>
                             <h3 style="font-size: 2rem; font-weight: 950; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.04em;">Quelle est votre Vision Stratégique ?</h3>
                             <p style="color: #64748b; font-size: 1.15rem; line-height: 1.7; margin: 0; font-weight: 500;">${profile.vision || 'Définissez l\'ambition long terme qui guide votre projet.'}</p>
                        </div>

                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 32px; padding: 48px; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                             <div style="background: #f8fafc; color: #10b981; padding: 8px 16px; border-radius: 10px; font-size: 0.7rem; font-weight: 950; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 24px;">MANIFESTE : MISSION</div>
                             <h3 style="font-size: 2rem; font-weight: 950; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.04em;">Votre Mission au Quotidien</h3>
                             <p style="color: #64748b; font-size: 1.15rem; line-height: 1.7; margin: 0; font-weight: 500;">${profile.mission || 'Quelles sont les actions concrètes que vous menez chaque jour ?'}</p>
                        </div>
                    </div>

                    <!-- RIGHT: SIDEBAR -->
                    <div class="sidebar-section" style="display: grid; gap: 32px; align-content: start;">
                        <!-- Cagnotte Card -->
                        <div style="background: #0f172a; color: white; border-radius: 32px; padding: 40px; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2); border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden;">
                             <div style="position: relative; z-index: 2;">
                                 <h4 style="font-size: 0.75rem; font-weight: 950; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Cagnotte Épique</h4>
                                 <div style="font-size: 3.5rem; font-weight: 950; margin: 8px 0; letter-spacing: -0.05em;">${(profile.total_raised || 0).toLocaleString()} €</div>
                                 <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 800; color: rgba(255,255,255,0.5); margin-bottom: 12px;">
                                     <span>Objectif Impact</span>
                                     <span style="color: white;">${goal.toLocaleString()} €</span>
                                 </div>
                                 <div style="height: 12px; background: rgba(255,255,255,0.1); border-radius: 100px; overflow: hidden; margin-bottom: 32px;">
                                     <div style="width: ${percent}%; height: 100%; background: #10b981; border-radius: 100px; box-shadow: 0 0 20px rgba(16,185,129,0.3);"></div>
                                 </div>
                                 <button class="cta-button primary" style="width: 100%; justify-content: center; background: #10b981; font-weight: 950; padding: 18px; font-size: 1.1rem; border-radius: 16px; border: none; color: white; box-shadow: 0 10px 25px rgba(16,185,129,0.3);">Propulser l'Épopée</button>
                             </div>
                             <div style="position: absolute; bottom: -50px; right: -50px; width: 150px; height: 150px; background: rgba(16,185,129,0.1); border-radius: 50%; filter: blur(40px);"></div>
                        </div>

                        <!-- Action Cards -->
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 32px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                             <h4 style="font-size: 0.75rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Actions Globales</h4>
                             <div style="display: grid; gap: 12px;">
                                 <button onclick="window.Router.navigate('#success-engine')" style="text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px 20px; border-radius: 16px; font-weight: 800; color: #0f172a; cursor: pointer; border: none; display: flex; align-items: center; gap: 12px; transition: 0.2s;" onmouseover="this.style.background='#eff6ff';">
                                     <div style="background: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">🚀</div>
                                     <span style="font-size: 0.95rem; font-weight: 900;">Gestion des Projets</span>
                                 </button>
                                 <button onclick="window.Router.navigate('#profile')" style="text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px 20px; border-radius: 16px; font-weight: 800; color: #0f172a; cursor: pointer; border: none; display: flex; align-items: center; gap: 12px; transition: 0.2s;" onmouseover="this.style.background='#eff6ff';">
                                     <div style="background: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">👤</div>
                                     <span style="font-size: 0.95rem; font-weight: 900;">Mon Profil Épique</span>
                                 </button>
                             </div>
                        </div>
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
