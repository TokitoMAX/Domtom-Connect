/**
 * Domtom Connect - Spectator Ecosystem Module
 * Logic for Spectators / Guest Users (Premium SaaS Standard)
 */
const SpectatorsModule = {
    role: 'spectator',

    /**
     * Module Router - Professional Isolation
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
            case 'marketplace':
                if (window.ShowcaseModule) {
                    ShowcaseModule.renderMarketplace(target);
                } else {
                    window.location.href = 'marketplace/directory.html';
                }
                break;
            case 'billetterie':
                const ticketingView = document.getElementById('billetterie-view');
                if (ticketingView && window.TicketingModule) {
                    ticketingView.style.display = 'block';
                    window.TicketingModule.loadMyTicketing(params);
                }
                break;
            case 'overview':
            default:
                 SpectatorsModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Discovery Overview (Authentic Narrative)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif; gap: 40px; padding-bottom: 60px;">
                
                <!-- The WHY: Strategic Intelligence Header -->
                <div style="grid-column: 1 / -1; background: #0f172a; padding: 80px 40px; border-radius: 40px; color: white; position: relative; overflow: hidden; text-align: center;">
                    <div style="position: absolute; top: -20%; left: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);"></div>
                    <div style="position: relative; z-index: 2; max-width: 800px; margin: 0 auto;">
                        <span style="color: #10b981; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem;">Intelligence Stratégique</span>
                        <h1 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 950; margin: 24px 0; line-height: 1.1; color: white;">Pourquoi sommes-nous ici ?</h1>
                        <p style="font-size: 1.25rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 0;">
                            Domtom Connect est le pont entre l'ambition territoriale et l'expertise mondiale. 
                            Que vous soyez un acteur ou un observateur, vous faites partie d'un écosystème qui transforme les défis insulaires en opportunités globales.
                        </p>
                    </div>
                </div>

                <!-- The 3 ACTIVE PATHS (The Transformation) -->
                <div style="grid-column: 1 / -1;">
                    <h2 style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin-bottom: 40px; text-align: center;">Choisissez votre Épopée</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
                        
                        <!-- Porteur -->
                        <div style="background: white; border: 1px solid #e2e8f0; padding: 40px; border-radius: 32px; transition: 0.3s; position: relative;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-10px)'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'">
                            <div style="width: 56px; height: 56px; background: #f8fafc; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: #0f172a;">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="m9 12 2.5-2.5"/><path d="m11.5 15.5 3-3"/></svg>
                            </div>
                            <h3 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 12px;">Porteur de Projet</h3>
                            <p style="color: #64748b; margin-bottom: 24px; font-size: 0.95rem;"><b>Transformation :</b> De l'idée isolée à l'entreprise structurée.</p>
                            <p style="color: #475569; font-size: 0.9rem; line-height: 1.6; margin-bottom: 32px;">
                                Vous avez la vision. On vous donne les outils, les experts et le réseau pour sécuriser votre lancement aux Antilles ou en Amérique du Nord.
                            </p>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button primary" style="width: 100%; height: 55px; background: #0f172a; color: white; border: none; border-radius: 16px; font-weight: 800; cursor: pointer;">Démarrer mon Projet</button>
                        </div>

                        <!-- Expert -->
                        <div style="background: white; border: 1px solid #e2e8f0; padding: 40px; border-radius: 32px; transition: 0.3s; position: relative;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-10px)'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'">
                            <div style="width: 56px; height: 56px; background: #f8fafc; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: #10b981;">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l3 12"/><path d="m13 3 3 6-3 12"/><path d="M2 9h20"/><path d="m5 3 3 6"/><path d="m19 3-3 6"/></svg>
                            </div>
                            <h3 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 12px;">Expert / Talent</h3>
                            <p style="color: #64748b; margin-bottom: 24px; font-size: 0.95rem;"><b>Transformation :</b> Du talent invisible à l'impact rémunéré.</p>
                            <p style="color: #475569; font-size: 0.9rem; line-height: 1.6; margin-bottom: 32px;">
                                Rejoignez la diaspora active. Apportez votre expertise aux projets qui en ont besoin et développez votre activité de consulting sécurisée.
                            </p>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button primary" style="width: 100%; height: 55px; background: #10b981; color: white; border: none; border-radius: 16px; font-weight: 800; cursor: pointer;">Postuler comme Expert</button>
                        </div>

                        <!-- Entreprise -->
                        <div style="background: white; border: 1px solid #e2e8f0; padding: 40px; border-radius: 32px; transition: 0.3s; position: relative;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-10px)'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'">
                            <div style="width: 56px; height: 56px; background: #f8fafc; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: #3b82f6;">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="10" width="20" height="12" rx="2"/><path d="M6 10V6a4 4 0 0 1 8 0v4"/><path d="M8 10V6a2 2 0 0 1 4 0v4"/></svg>
                            </div>
                            <h3 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 12px;">Entreprise / Institution</h3>
                            <p style="color: #64748b; margin-bottom: 24px; font-size: 0.95rem;"><b>Transformation :</b> Des besoins complexes à la réussite stratégique.</p>
                            <p style="color: #475569; font-size: 0.9rem; line-height: 1.6; margin-bottom: 32px;">
                                Accédez à un vivier de talents vérifiés pour vos opérations locales. Gagnez en agilité et en pertinence territoriale immédiatement.
                            </p>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button primary" style="width: 100%; height: 55px; background: #eff6ff; color: #1e40af; border: 2px solid #3b82f6; border-radius: 16px; font-weight: 800; cursor: pointer;">Espace Entreprise</button>
                        </div>

                    </div>
                </div>

                <!-- The PASSIVE PATH (The Spectator Role - Supporting & Organizing) -->
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 40px; padding: 60px 40px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 48px;">
                        <div>
                            <span style="color: #64748b; font-weight: 800; font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">Engagement Light</span>
                            <h2 style="font-size: 2rem; font-weight: 900; color: #0f172a; margin: 16px 0;">Acteur via le Soutien</h2>
                            <p style="color: #475569; font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">
                                Pas besoin d'être Expert ou Porteur pour impacter l'écosystème. En tant que spectateur engagé, vous avez le pouvoir de propulser les initiatives qui vous tiennent à cœur.
                            </p>
                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                <div style="display: flex; align-items: flex-start; gap: 16px; background: white; padding: 20px; border-radius: 20px; border: 1px solid #e2e8f0;">
                                    <div style="color: #f59e0b; margin-top: 4px;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5a5.5 5.5 0 0 0-11 0c0 2.29 1.5 4.04 3 5.5l5 5 5-5z"/></svg>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0 0 4px 0; font-weight: 800; color: #0f172a;">Soutenir un Projet</h5>
                                        <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Devenez sponsor, financeur ou parrain moral des pépites du territoire.</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: flex-start; gap: 16px; background: white; padding: 20px; border-radius: 20px; border: 1px solid #e2e8f0;">
                                    <div style="color: #6366f1; margin-top: 4px;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                    </div>
                                    <div style="flex: 1;">
                                        <h5 style="margin: 0 0 4px 0; font-weight: 800; color: #0f172a;">Créer un Événement</h5>
                                        <p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #64748b;">Organisez un meetup, un atelier ou une rencontre informelle pour dynamiser le réseau.</p>
                                        <button onclick="window.Router.navigate('#billetterie?action=create')" style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer;">Organiser maintenant</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <div style="background: white; padding: 40px; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); flex: 1;">
                                <h4 style="margin: 0 0 16px 0; font-weight: 800; color: #0f172a;">Actions Immédiates</h4>
                                <div style="display: grid; gap: 12px;">
                                    <button onclick="window.Router.navigate('#marketplace')" class="cta-button primary" style="width: 100%; height: 50px; background: #10b981; color: white; border-radius: 12px; font-weight: 800; border: none; cursor: pointer;">Explorer le Marketplace DTC</button>
                                    <button onclick="window.location.href='marketplace/projects.html'" class="cta-button primary" style="width: 100%; height: 50px; background: #0f172a; color: white; border-radius: 12px; font-weight: 800; border: none; cursor: pointer;">Découvrir les Projets à Soutenir</button>
                                    <button onclick="window.location.href='marketplace/evenements.html'" class="cta-button secondary" style="width: 100%; height: 50px; border: 2px solid #0f172a; color: #0f172a; border-radius: 12px; font-weight: 800; cursor: pointer; background: white;">Parcourir les Événements</button>
                                    <button onclick="window.Router.navigate('#billetterie')" class="cta-button" style="width: 100%; height: 50px; background: #f1f5f9; color: #0f172a; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">Gérer mes Événements</button>
                                </div>
                            </div>
                            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 32px; color: white;">
                                <h5 style="margin: 0 0 8px 0; font-weight: 800; color: white;">Intelligence Collective</h5>
                                <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.8); line-height: 1.5;">En soutenant les projets et en créant des ponts sociaux, vous accélérez la réussite de tous.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- The HOW: Process Transparency -->
                <div style="grid-column: 1 / -1; text-align: center; margin-top: 20px;">
                    <h3 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 48px;">Comment ça fonctionne (Vraiment)</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px;">
                        <div>
                            <div style="color: #0f172a; margin-bottom: 16px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            </div>
                            <h5 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px;">1. Découverte</h5>
                            <p style="font-size: 0.85rem; color: #64748b;">Vous explorez les profils et les besoins sans barrière.</p>
                        </div>
                        <div>
                            <div style="color: #10b981; margin-bottom: 16px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
                            </div>
                            <h5 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px;">2. Connexion</h5>
                            <p style="font-size: 0.85rem; color: #64748b;">Prenez contact pour soutenir un projet ou proposer un événement.</p>
                        </div>
                        <div>
                            <div style="color: #3b82f6; margin-bottom: 16px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h5 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px;">3. Sécurisation</h5>
                            <p style="font-size: 0.85rem; color: #64748b;">La plateforme encadre les événements et les parrainages.</p>
                        </div>
                        <div>
                            <div style="color: #ec4899; margin-bottom: 16px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            </div>
                            <h5 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px;">4. Impact</h5>
                            <p style="font-size: 0.85rem; color: #64748b;">Votre contribution, même en tant qu'observateur, fait grandir le réseau.</p>
                        </div>
                    </div>
                </div>

            </div>
        `;
    },

    loadLatestActivities: (container) => {
        if (!container) return;
        setTimeout(() => {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b; font-weight:600; font-size:0.9rem;">Aucune activité publique récente à afficher.</div>`;
        }, 800);
    }
};

window.SpectatorsModule = SpectatorsModule;
