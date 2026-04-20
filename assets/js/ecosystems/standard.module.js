/**
 * Standard Module - Domtom Connect
 * Écosystème "Explorateur" / Membre Basique
 * Un cockpit épuré pour la découverte et la gestion personnelle.
 */
const StandardModule = {
    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'billetterie':
                await StandardModule.renderTicketing(target, profile, session);
                break;
            case 'mes-billets':
                await StandardModule.renderMyTickets(target, profile, session);
                break;
            case 'overview':
            default:
                await StandardModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Rendu du Dashboard Explorateur (Overview)
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid role-standard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card -->
                <div class="dash-card premium-dark" style="grid-column: 1 / -1; border-radius: 24px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; padding: 48px; position: relative; overflow: hidden;">
                    <div style="z-index: 2; position: relative;">
                        <span style="display:inline-block; background:rgba(255, 255, 255, 0.1); color:white; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:20px; letter-spacing:0.04em; text-transform:uppercase;">Espace Explorateur</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin: 0 0 16px 0; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; line-height:1.6; margin:0;">Bienvenue sur votre centre de commandement personnel. Explorez le réseau et rejoignez des écosystèmes stratégiques.</p>
                    </div>
                </div>

                <!-- Main Column -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 32px;">
                    
                    <!-- UPGRADE Section (Premium SaaS Style) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; transition: all 0.3s ease;">
                            <div style="width:48px; height:48px; background:#f0fdf4; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Porteur de Projet</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Vous avez une ambition pour les territoires ? Créez votre épopée et trouvez des experts pour la réaliser.</p>
                            <a href="/profile" class="cta-button" style="display:inline-block; background:#0f172a; color:white; padding:12px 20px; border-radius:10px; font-weight:800; text-decoration:none; font-size:0.9rem;">Lancer mon projet</a>
                        </div>
                        
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                            <div style="width:48px; height:48px; background:#eff6ff; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #3b82f6;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-19a4 4 0 11-4 4 4 4 0 014-4zm6 19v-2a4 4 0 00-3-3.87m-4-12a4 4 0 014 4" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Expert Territorial</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Proposez vos compétences aux entreprises et porteurs de projets internationaux.</p>
                            <a href="/profile" class="cta-button" style="display:inline-block; border:1px solid #e2e8f0; color:#0f172a; padding:12px 20px; border-radius:10px; font-weight:800; text-decoration:none; font-size:0.9rem; background:white;">Devenir Expert</a>
                        </div>
                    </div>

                    <!-- Professional Profile Status Card -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; background: white; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 200px; gap: 32px; align-items: center;">
                        <div>
                            <h3 style="font-size: 1.5rem; font-weight: 950; color:#0f172a; margin-bottom:12px;">Votre Écosystème Personnel</h3>
                            <p style="color:#64748b; margin-bottom:24px; line-height: 1.6;">Complétez votre identité numérique pour être reconnu par les experts et porteurs de projets territoriaux.</p>
                            <div style="display:flex; gap:16px;">
                                <a href="#profile" class="cta-button primary" style="background:#10b981; border:none; padding:12px 24px; font-weight:800; border-radius:12px; text-decoration:none; color:white; font-size:0.9rem;">Gérer mon profil</a>
                                <a href="/marketplace/directory" class="cta-button secondary" style="border:1px solid #e2e8f0; padding:12px 24px; font-weight:800; border-radius:12px; text-decoration:none; color:#0f172a; font-size:0.9rem;">Explorer les talents</a>
                            </div>
                        </div>
                        <div style="text-align: center; border-left: 1px solid #f1f5f9; padding-left: 32px;">
                            <div style="font-size: 2.5rem; font-weight: 900; color: #10b981; margin-bottom: 4px;">100%</div>
                            <div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Vérifié</div>
                        </div>
                    </div>

                    <!-- My Activity Placeholder -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0; text-align:center;">
                        <h3 style="font-size: 1.25rem; font-weight: 950; color:#0f172a; margin-bottom:12px;">🎉 Billetterie & Événements</h3>
                        <p style="color:#64748b; margin-bottom:32px;">Vous n'avez pas encore d'événements à venir. Découvrez les prochaines opportunités.</p>
                        <a href="#billetterie" style="color:#10b981; font-weight:800; text-decoration:none; font-size:0.95rem;">Accéder à ma billetterie →</a>
                    </div>
                </div>

                <!-- Sidebar column -->
                <div class="dash-side-col" style="grid-column: span 4; display: flex; flex-direction: column; gap: 32px;">
                     <div class="dash-card" style="border-radius: 20px; padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.04em;">Mon Compte</h4>
                        <div style="display:grid; gap:16px;">
                            <a href="/profile" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:#0f172a; font-weight:700; font-size:0.95rem;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Mon Profil
                            </a>
                            <a href="/messages" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:#0f172a; font-weight:700; font-size:0.95rem;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Messagerie
                            </a>
                        </div>
                    </div>

                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0;">
                        <p style="font-size:0.85rem; color:#64748b; line-height:1.6; margin:0;">
                            <strong>Besoin d'aide ?</strong><br>
                            Contactez notre support pour optimiser votre utilisation de Domtom Connect.
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Billetterie Rendering (Moved from dashboard-core)
     */
    renderTicketing: async (container, profile, session) => {
        // Logic will be implemented here, delegating the ID 'billetterie-list'
        const view = document.getElementById('billetterie-view');
        if (view) {
            view.style.display = 'block';
            // Trigger the actual load
            if (typeof loadMyTicketing === 'function') loadMyTicketing();
        }
    },

    /**
     * My Tickets Rendering
     */
    renderMyTickets: async (container, profile, session) => {
        const view = document.getElementById('mes-billets-view');
        if (view) {
            view.style.display = 'block';
            if (typeof loadMyTickets === 'function') loadMyTickets();
        }
    },

    /**
     * Profile View Rendering - Explorer Specific
     */
    renderProfile: async (container, profile, session) => {
        const view = document.getElementById('profile-view');
        if (!view) return;
        view.style.display = 'block';

        view.innerHTML = `
            <div class="profile-dashboard-layout" style="display: grid; grid-template-columns: 1fr 350px; gap: 32px; padding: 24px;">
                <div class="profile-main-card dash-card" style="background: white; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 32px; margin-bottom: 48px; border-bottom: 1px solid #f1f5f9; padding-bottom: 40px;">
                        <div style="width: 120px; height: 120px; border-radius: 32px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 800; color: #64748b; border: 4px solid white; box-shadow: 0 10px 25px rgba(0,0,0,0.05); position: relative;">
                            ${profile.avatar_url ? `<img src="${profile.avatar_url}" style="width:100%; height:100%; object-fit:cover; border-radius:28px;">` : profile.full_name?.charAt(0) || 'E'}
                            <button onclick="window.location.href='/profile'" style="position: absolute; bottom: -10px; right: -10px; width: 40px; height: 40px; border-radius: 12px; background: #0f172a; color: white; border: 4px solid white; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.04em;">${profile.full_name || 'Explorateur'}</h1>
                                <span style="background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Libre</span>
                            </div>
                            <p style="color: #64748b; font-size: 1.1rem; margin: 0;">${profile.email || session.user.email}</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 850; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 10px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z"/></svg>
                                Identité Digitale
                            </h3>
                            <div style="display: grid; gap: 20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Nom d'affichage</label>
                                    <div style="font-weight: 700; color: #334155;">${profile.full_name || 'Non renseigné'}</div>
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Territoire d'intérêt</label>
                                    <div style="font-weight: 700; color: #334155;">${profile.territory || 'International'}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 850; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 10px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                Sécurité & Accès
                            </h3>
                            <div style="display: grid; gap: 20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Statut du Compte</label>
                                    <div style="display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 800;">
                                        <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                                        Vérifié
                                    </div>
                                </div>
                                <button onclick="window.location.href='/profile'" class="cta-button" style="background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; width: 100%;">Éditer mes informations</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profile-side-card">
                    <div class="dash-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; border-radius: 24px; color: white;">
                        <h4 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 12px;">Passez au niveau supérieur</h4>
                        <p style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 24px; line-height: 1.5;">Devenez <strong>Expert Territorial</strong> ou <strong>Porteur de Projet</strong> pour débloquer le Success Engine.</p>
                        <button onclick="window.location.href='/registration/onboarding'" style="width: 100%; padding: 14px; border-radius: 12px; background: white; color: #059669; border: none; font-weight: 800; cursor: pointer;">Changer de Statut</button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.StandardModule = StandardModule;

