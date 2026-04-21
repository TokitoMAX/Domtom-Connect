/**
 * Standard Module - Domtom Connect
 * Ã‰cosystÃ¨me "Explorateur" / Membre Basique
 * Un cockpit Ã©purÃ© pour la dÃ©couverte et la gestion personnelle.
 */
const StandardModule = {
    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'billetterie':
                await StandardModule.renderTicketing(target, profile, session, params);
                break;
            case 'mes-billets':
                await StandardModule.renderMyTickets(target, profile, session, params);
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
                
                <div class="dash-welcome-card" style="grid-column: 1 / -1; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 48px; border-radius: 24px; position: relative; overflow: hidden; color: white;">
                    <div style="z-index: 2; position: relative;">
                        <span style="display:inline-block; background:rgba(255, 255, 255, 0.1); color:white; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:20px; letter-spacing:0.04em; text-transform:uppercase;">Espace Explorateur</span>
                        <h1 style="text-transform: capitalize;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                        <p>Bienvenue sur votre centre de commandement personnel. Explorez le rÃ©seau et rejoignez des Ã©cosystÃ¨mes stratÃ©giques.</p>
                    </div>
                </div>

                <!-- Main Column -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 32px;">
                    
                    <!-- UPGRADE Section (Premium SaaS Style) -->
                    <div class="role-upgrade-grid">
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; transition: all 0.3s ease;">
                            <div style="width:48px; height:48px; background:#f0fdf4; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Porteur de Projet</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Vous avez une ambition pour les territoires ? CrÃ©ez votre Ã©popÃ©e et trouvez des experts pour la rÃ©aliser.</p>
                            <a href="/profile" class="cta-button" style="display:inline-block; background:#0f172a; color:white; padding:12px 20px; border-radius:10px; font-weight:800; text-decoration:none; font-size:0.9rem;">Lancer mon projet</a>
                        </div>
                        
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                            <div style="width:48px; height:48px; background:#eff6ff; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #3b82f6;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-19a4 4 0 11-4 4 4 4 0 014-4zm6 19v-2a4 4 0 00-3-3.87m-4-12a4 4 0 014 4" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Expert Territorial</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Proposez vos compÃ©tences aux entreprises et porteurs de projets internationaux.</p>
                            <a href="/profile" class="cta-button" style="display:inline-block; border:1px solid #e2e8f0; color:#0f172a; padding:12px 20px; border-radius:10px; font-weight:800; text-decoration:none; font-size:0.9rem; background:white;">Devenir Expert</a>
                        </div>
                    </div>

                    <!-- DISCOVERY SECTION (WOW Factor) -->
                    <div style="margin-top: 16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <h3 style="font-size: 1.4rem; font-weight: 950; color:#0f172a; letter-spacing:-0.03em;">OpportunitÃ©s Flash</h3>
                            <span style="font-size:0.75rem; font-weight:800; color:#10b981; background:rgba(16,185,129,0.05); padding:6px 12px; border-radius:100px;">LIVE COMMUNITY</span>
                        </div>
                        <div class="role-upgrade-grid" style="margin-top: 16px;">
                            <div class="dash-card" style="background: white; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; position:relative; overflow:hidden;">
                                <div style="font-size:0.65rem; font-weight:850; color:#3b82f6; text-transform:uppercase; margin-bottom:8px;">Ã‰vÃ©nement Ã  la une</div>
                                <h4 style="font-size:1rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Masterclass : StratÃ©gie Territoriale 2026</h4>
                                <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">Rejoignez 150 experts pour dÃ©finir le futur de l'innovation locale.</p>
                                <button onclick="window.Router.navigate('#billetterie')" style="background:none; border:none; color:#10b981; font-weight:800; font-size:0.8rem; cursor:pointer; padding:0;">DÃ©couvrir â†’</button>
                            </div>
                            <div class="dash-card" style="background: white; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0;">
                                <div style="font-size:0.65rem; font-weight:850; color:#f59e0b; text-transform:uppercase; margin-bottom:8px;">Nouvelle Ã‰popÃ©e</div>
                                <h4 style="font-size:1rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Projet : Ã‰nergies Vertes Martinique</h4>
                                <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">Un nouveau porteur de projet recherche des experts en photovoltaÃ¯que.</p>
                                <button onclick="window.location.href='marketplace/directory.html'" style="background:none; border:none; color:#10b981; font-weight:800; font-size:0.8rem; cursor:pointer; padding:0;">Voir le projet â†’</button>
                            </div>
                        </div>
                    </div>

                    <!-- Professional Profile Status Card -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; background: white; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 200px; gap: 32px; align-items: center; margin-top:16px;">
                        <div>
                            <h3 style="font-size: 1.5rem; font-weight: 950; color:#0f172a; margin-bottom:12px;">Votre Ã‰cosystÃ¨me Personnel</h3>
                            <p style="color:#64748b; margin-bottom:24px; line-height: 1.6;">${profile.full_name ? `Bonjour <strong>${profile.full_name}</strong>. Votre` : 'Votre'} profil est le point de dÃ©part de votre influence territoriale.</p>
                            <div style="display:flex; gap:16px;">
                                <a href="/profile" class="cta-button primary" style="background:#10b981; border:none; padding:12px 24px; font-weight:800; border-radius:12px; text-decoration:none; color:white; font-size:0.9rem;">GÃ©rer mon profil</a>
                                <a href="/marketplace/directory" class="cta-button secondary" style="border:1px solid #e2e8f0; padding:12px 24px; font-weight:800; border-radius:12px; text-decoration:none; color:#0f172a; font-size:0.9rem;">Explorer les talents</a>
                            </div>
                        </div>
                        <div style="text-align: center; border-left: 1px solid #f1f5f9; padding-left: 32px;">
                            <div style="font-size: 2.5rem; font-weight: 900; color: #10b981; margin-bottom: 4px;">ðŸ’¯</div>
                            <div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">IdentitÃ© PrÃªte</div>
                        </div>
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
    renderTicketing: async (container, profile, session, params) => {
        const view = document.getElementById('billetterie-view');
        if (view) {
            if (typeof TicketingModule !== 'undefined') {
                TicketingModule.loadMyTicketing(params);
            }
        }
    },

    /**
     * Rendu de la vue "Mes Billets"
     */
    renderMyTickets: async (container, profile, session, params) => {
        const view = document.getElementById('mes-billets-view');
        if (view) {
            if (typeof TicketingModule !== 'undefined') {
                TicketingModule.loadMyTickets(params);
            }
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
            <div class="profile-dashboard-layout">
                <div class="profile-main-card dash-card" style="background: white; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 32px; margin-bottom: 48px; border-bottom: 1px solid #f1f5f9; padding-bottom: 40px;">
                        <div style="width: 120px; height: 120px; border-radius: 32px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 800; color: #64748b; border: 4px solid white; box-shadow: 0 10px 25px rgba(0,0,0,0.05); position: relative;">
                            ${profile.avatar_url ? `<img src="${profile.avatar_url}" style="width:100%; height:100%; object-fit:cover; border-radius:28px;">` : profile.full_name?.charAt(0) || 'E'}
                            <button onclick="window.location.href='mon-espace.html#profile'" style="position: absolute; bottom: -10px; right: -10px; width: 40px; height: 40px; border-radius: 12px; background: #0f172a; color: white; border: 4px solid white; display: flex; align-items: center; justify-content: center; cursor: pointer;">
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

                    <div class="role-upgrade-grid" style="gap: 40px;">
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 850; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 10px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z"/></svg>
                                IdentitÃ© Professionnelle
                            </h3>
                            <div style="display: grid; gap: 20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Titre / Expertise</label>
                                    <div style="font-weight: 700; color: #334155;">${profile.title || profile.expertise || 'Expert Territorial'}</div>
                                </div>
                                ${profile.role === 'expert' ? `
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Tarif Journalier (TJM)</label>
                                    <div style="font-weight: 700; color: #10b981;">${profile.tjm || '---'} â‚¬ / jour</div>
                                </div>
                                ` : ''}
                                ${profile.role === 'entreprise' ? `
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Nom Entreprise / Groupe</label>
                                    <div style="font-weight: 700; color: #3b82f6;">${profile.company_name || profile.company || 'Non renseignÃ©'}</div>
                                </div>
                                ` : ''}
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Territoire</label>
                                    <div style="font-weight: 700; color: #334155;">${profile.territory || 'International'}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 850; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 10px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M4 4h16v16H4zM4 12h16M12 4v16"/></svg>
                                PrÃ©sentation & Pitch
                            </h3>
                            <div style="display: grid; gap: 20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Biographie / Vision</label>
                                    <div style="font-size: 0.9rem; line-height: 1.6; color: #475569; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #f1f5f9;">
                                        ${profile.bio || 'Votre prÃ©sentation apparaÃ®tra ici une fois complÃ©tÃ©e.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profile-side-card">
                    <!-- PROFILE ACTIONS -->
                    <div class="dash-card" style="background: white; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                        <h4 style="font-size: 0.8rem; font-weight: 850; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px;">Dossier Digital</h4>
                        <div style="display: grid; gap: 12px;">
                            <button onclick="window.location.href='/registration/onboarding'" class="cta-button" style="width: 100%; padding: 14px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 800;">ComplÃ©ter mon Onboarding</button>
                            <button onclick="alert('Export PDF du profil bientÃ´t disponible')" class="cta-button secondary" style="width: 100%; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">TÃ©lÃ©charger CV / Dossier</button>
                        </div>
                    </div>

                    <!-- UPGRADE CTA -->
                    <div class="dash-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; border-radius: 24px; color: white; display: none;">
                        <h4 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 12px;">Passez au niveau supÃ©rieur</h4>
                        <p style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 24px; line-height: 1.5;">Devenez <strong>Expert Territorial</strong> ou <strong>Porteur de Projet</strong> pour dÃ©bloquer le Success Engine.</p>
                        <button onclick="window.location.href='/registration/onboarding'" style="width: 100%; padding: 14px; border-radius: 12px; background: white; color: #059669; border: none; font-weight: 800; cursor: pointer;">Changer de Statut</button>
                    </div>
                </div>
            </div>

            <!-- ECOSYSTEM HUB (4 Cards Grid) -->
            <div style="padding: 0 0 48px 0;">
                <div style="margin-bottom: 32px;">
                    <h2 style="font-size: 1.8rem; font-weight: 950; color: #0f172a; letter-spacing: -0.04em;">Hub d'Ã‰cosystÃ¨mes</h2>
                    <p style="color: #64748b; font-size: 1.1rem; font-weight: 500;">Activez vos diffÃ©rentes identitÃ©s territoriales pour dÃ©bloquer de nouveaux outils.</p>
                </div>

                <div class="ecosystem-grid">
                    <!-- EXPLORATEUR (Current) -->
                    <div class="eco-role-card ${profile.role === 'spectateur' || !profile.role ? 'active' : ''}" style="background: white; border-radius: 24px; padding: 24px; border: 2px solid ${profile.role === 'spectateur' || !profile.role ? '#10b981' : '#e2e8f0'}; position: relative;">
                        <span style="position: absolute; top: 16px; right: 1px; background: #10b981; color: white; padding: 4px 10px; border-radius: 100px; font-size: 0.6rem; font-weight: 800; display: ${profile.role === 'spectateur' || !profile.role ? 'block' : 'none'};">ACTIF</span>
                        <div style="width: 48px; height: 48px; background: #f8fafc; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #64748b;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z"/></svg>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 900; color: #0f172a; margin-bottom: 8px;">Explorateur</h3>
                        <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-bottom: 24px;">DÃ©couverte du rÃ©seau, participation aux Ã©vÃ©nements et suivi de projets.</p>
                        <button onclick="switchRole('spectateur')" class="cta-button" style="width: 100%; border-radius: 12px; font-weight: 800; font-size: 0.8rem; background: #f1f5f9; color: #475569; border: none;">${profile.role === 'spectateur' || !profile.role ? 'DÃ©jÃ  Actif' : 'Activer Discovery'}</button>
                    </div>

                    <!-- PORTEUR (Owner) -->
                    <div class="eco-role-card ${profile.role === 'porteur' ? 'active' : ''}" style="background: white; border-radius: 24px; padding: 24px; border: 2px solid ${profile.role === 'porteur' ? '#10b981' : '#e2e8f0'};">
                        <div style="width: 48px; height: 48px; background: #f0fdf4; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #10b981;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 900; color: #0f172a; margin-bottom: 8px;">Porteur de Projet</h3>
                        <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-bottom: 24px;">Lancement d'Ã©popÃ©es stratÃ©giques, accÃ¨s au Success Engine et fonds.</p>
                        <button onclick="switchRole('porteur')" class="cta-button" style="width: 100%; border-radius: 12px; font-weight: 800; font-size: 0.8rem; background: #0f172a; color: white; border: none;">Activer Pilotage</button>
                    </div>

                    <!-- EXPERT (Expert) -->
                    <div class="eco-role-card ${profile.role === 'expert' ? 'active' : ''}" style="background: white; border-radius: 24px; padding: 24px; border: 2px solid ${profile.role === 'expert' ? '#10b981' : '#e2e8f0'};">
                        <div style="width: 48px; height: 48px; background: #eff6ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #3b82f6;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-19a4 4 0 11-4 4 4 4 0 014-4z"/></svg>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 900; color: #0f172a; margin-bottom: 8px;">Expert / Talent</h3>
                        <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-bottom: 24px;">Mise en avant de vos compÃ©tences, Hub Business, devis et facturation.</p>
                        <button onclick="switchRole('expert')" class="cta-button" style="width: 100%; border-radius: 12px; font-weight: 800; font-size: 0.8rem; background: #0f172a; color: white; border: none;">Activer Expertise</button>
                    </div>

                    <!-- ENTREPRISE (Company) -->
                    <div class="eco-role-card ${profile.role === 'entreprise' ? 'active' : ''}" style="background: white; border-radius: 24px; padding: 24px; border: 2px solid ${profile.role === 'entreprise' ? '#10b981' : '#e2e8f0'};">
                        <div style="width: 48px; height: 48px; background: #fdf2f8; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #db2777;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21h18M3 7v1a3 3 0 006 0V7m6 0v1a3 3 0 006 0V7m-6 0h6M9 7h6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-6 0h6m-6 0v14m6-14v14"/></svg>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 900; color: #0f172a; margin-bottom: 8px;">Entreprise</h3>
                        <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-bottom: 24px;">DÃ©pÃ´t d'offres de mission, recrutement de talents et impact de marque.</p>
                        <button onclick="switchRole('entreprise')" class="cta-button" style="width: 100%; border-radius: 12px; font-weight: 800; font-size: 0.8rem; background: #0f172a; color: white; border: none;">Activer Growth</button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.StandardModule = StandardModule;

