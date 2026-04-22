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
        const topNav = document.getElementById('ecosystem-top-nav');
        if (topNav) topNav.style.display = 'none';

        switch (view_id) {
            case 'business':
                await CompaniesModule.renderBusinessPilotage(target, profile, session);
                break;
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
            case 'overview':
            default:
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
            <div class="dash-grid-layout" style="font-family: 'Inter', sans-serif; padding: 40px; margin-left: auto; max-width: 1200px;">
                
                <!-- MAIN CONTENT: ACTION CENTER -->
                <div class="dash-main-col">
                    
                    <!-- Welcome & Status -->
                    <div style="background: #020617; border-radius: 24px; padding: 48px; margin-bottom: 32px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="position: absolute; top:0; right:0; width: 300px; height: 100%; background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%);"></div>
                        <div style="position: relative; z-index: 2;">
                            <span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 6px 14px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.05em; border: 1px solid rgba(16,185,129,0.2);">COCKPIT ENTREPRISE</span>
                            <h1 style="color: white; margin: 12px 0 8px 0; font-size: 2.2rem; font-weight: 900;">${profile.company_name || profile.full_name}</h1>
                            <p style="color: rgba(255,255,255,0.5); font-weight: 600;">G&eacute;rez vos missions et vos recrutements territoriaux.</p>
                        </div>
                    </div>

                    <!-- Project Management Hub -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                        <div class="dash-card" style="padding: 32px; background: white; border: 1px solid #f1f5f9; border-radius: 24px; position: relative; overflow: hidden;">
                            <h4 style="font-size: 0.8rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Pilotage Projets</h4>
                            <div style="font-size: 1.8rem; font-weight: 900; color: #020617; margin-bottom: 20px;">0 Missions</div>
                            <button onclick="window.Router.navigate('#business')" style="padding: 12px 24px; background: #020617; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 0.9rem;">Acc&eacute;der au Pilotage</button>
                        </div>
                        <div class="dash-card" style="padding: 32px; background: white; border: 1px solid #f1f5f9; border-radius: 24px;">
                            <h4 style="font-size: 0.8rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">R&eacute;seau Experts</h4>
                            <div style="font-size: 1.8rem; font-weight: 900; color: #020617; margin-bottom: 20px;">Acc&egrave;s Talents</div>
                            <button onclick="window.location.href='marketplace/talents.html'" style="padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 0.9rem;">Parcourir l'Annuaire</button>
                        </div>
                    </div>

                    <!-- Pack Management View -->
                    <div id="pack-management-view" class="dash-card" style="padding: 40px; border-radius: 24px; background: white; border: 1px solid #f1f5f9;">
                         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                            <h3 style="font-size: 1.2rem; font-weight: 900; color: #020617; text-transform: uppercase;">Mon Pack Entreprise</h3>
                            <span style="background: #f1f5f9; padding: 6px 14px; border-radius: 8px; font-size: 0.75rem; font-weight: 900; color: #64748b;">VERSION GRATUITE</span>
                         </div>
                         <div style="background: #f8fafc; border-radius: 20px; padding: 32px; border: 2px dashed #e2e8f0; text-align: center;">
                            <p style="color: #64748b; font-weight: 700; margin-bottom: 24px;">Passez à la version Premium pour débloquer les recrutements illimités.</p>
                            <button onclick="CompaniesModule.showPacks()" style="padding: 16px 32px; background: #020617; color: white; border: none; border-radius: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">D&eacute;couvrir les Packs</button>
                         </div>
                    </div>
                </div>

                <!-- SIDEBAR -->
                <div class="dash-side-col">
                    <button onclick="window.Router.navigate('#collaboration')" style="width: 100%; padding: 22px; background: #2563eb; color: white; border: none; border-radius: 18px; font-weight: 900; font-size: 1.1rem; cursor: pointer; margin-bottom: 24px; box-shadow: 0 10px 20px rgba(37,99,235,0.2);">Collaborer</button>
                    
                    <div style="background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 24px;">Identit&eacute; Institutionnelle</h4>
                        <div style="display: grid; gap: 16px;">
                            <div style="display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 14px; background: #f8fafc;">
                                <div style="color: #10b981;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                                <div><div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Zone</div><div style="color: #020617; font-weight: 900;">${profile.zone || 'Antilles'}</div></div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 14px; background: #f8fafc;">
                                <div style="color: #3b82f6;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                                <div><div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">SIRET</div><div style="color: #020617; font-weight: 900;">${profile.siret || 'V&eacute;rification en cours'}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        `;
    },

    /**
     * MATERIALIZING THE PACKS - Selection Interface
     */
    showPacks: () => {
        const view = document.getElementById('pack-management-view');
        if (!view) return;

        view.innerHTML = `
            <div style="animation: fadeInUp 0.4s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h3 style="font-size: 1.2rem; font-weight: 900; color: #020617; text-transform: uppercase;">Choisissez votre Pack Entreprise</h3>
                    <button onclick="window.location.reload()" style="background:none; border:none; color:#10b981; font-weight:800; cursor:pointer;">&larr; Retour</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
                    <div style="padding: 40px; border-radius: 20px; border: 2px solid #020617; background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.05); text-align: center;">
                        <div style="font-weight: 900; color: #10b981; margin-bottom: 8px;">PACK ENTREPRISE</div>
                        <div style="font-size: 3rem; font-weight: 950; color: #020617; margin-bottom: 24px;">29,99&euro;<span style="font-size: 1rem; color: #64748b;">/mois</span></div>
                        <ul style="list-style: none; padding: 0; margin-bottom: 40px; color: #475569; font-weight: 600; display: inline-block; text-align: left;">
                             <li style="margin-bottom: 12px;">\u2713 Missions illimit&eacute;es</li>
                             <li style="margin-bottom: 12px;">\u2713 Visibilit&eacute; Premium</li>
                             <li style="margin-bottom: 12px;">\u2713 2-3 Missions Contenu / mois</li>
                        </ul>
                        <button onclick="alert('Activation Pack Entreprise...')" style="width: 100%; max-width: 300px; padding: 18px; background: #020617; border: none; border-radius: 16px; font-weight: 900; color: white; cursor: pointer; margin: 0 auto; display: block;">Activer le Pack Pro</button>
                    </div>
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
            <div class="dash-grid-layout" style="font-family: 'Inter', sans-serif; padding: 60px; width: 100%; box-sizing: border-box;">
                <div style="margin-bottom: 50px;">
                    <h1 style="font-weight: 950; color: #020617; font-size: 3rem; letter-spacing: -0.05em; margin-bottom: 12px;">Centre de Pilotage Business</h1>
                    <p style="color: #64748b; font-size: 1.2rem; font-weight: 600;">Gérez vos missions, vos contenus et votre croissance territoriale.</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-bottom: 60px;">
                    <div class="dash-card" style="background: white; padding: 48px; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.03); position: relative; overflow: hidden;">
                         <div style="position: absolute; top:0; left:0; width: 4px; height: 100%; background: #020617;"></div>
                         <h4 style="font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Missions Actives</h4>
                         <div style="font-size: 3.5rem; font-weight: 950; color: #020617;">0</div>
                    </div>
                    <div class="dash-card" style="background: white; padding: 48px; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.03); position: relative; overflow: hidden;">
                         <div style="position: absolute; top:0; left:0; width: 4px; height: 100%; background: #10b981;"></div>
                         <h4 style="font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Contenus Livraison</h4>
                         <div style="font-size: 3.5rem; font-weight: 950; color: #10b981;">0 <span style="font-size: 1.5rem; color: #cbd5e1;">/ 3</span></div>
                    </div>
                    <div class="dash-card" style="background: white; padding: 48px; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.03); position: relative; overflow: hidden;">
                         <div style="position: absolute; top:0; left:0; width: 4px; height: 100%; background: #2563eb;"></div>
                         <h4 style="font-size: 0.85rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Réseau Experts</h4>
                         <div style="font-size: 3.5rem; font-weight: 950; color: #2563eb;">0</div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #020617 0%, #1e293b 100%); border-radius: 32px; padding: 100px; text-align: center; color: white;">
                    <h3 style="font-weight: 900; margin-bottom: 16px; font-size: 2rem;">Besoin de lancer une nouvelle mission ?</h3>
                    <p style="color: rgba(255,255,255,0.6); font-weight: 600; margin-bottom: 40px; font-size: 1.1rem;">Nos experts sont prêts à vous accompagner sur vos enjeux stratégiques.</p>
                    <button onclick="window.Router.navigate('#collaboration')" style="padding: 24px 60px; background: #fff; color: #020617; border: none; border-radius: 20px; font-weight: 950; cursor: pointer; font-size: 1.2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.2); transition: 0.3s;">Lancer un Projet</button>
                </div>
            </div>
        `;
    }
};

window.CompaniesModule = CompaniesModule;
