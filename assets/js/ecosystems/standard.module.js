/**
 * Standard Module - Domtom Connect
 * Logic for Basic Members (Premium SaaS Standard)
 */
const StandardModule = {
    role: 'spectateur',

    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'billetterie':
                const billView = document.getElementById('billetterie-view');
                if (billView) {
                    billView.style.display = 'block';
                    if (typeof window.TicketingModule !== 'undefined') {
                        window.TicketingModule.loadMyTicketing(params);
                    }
                }
                break;
            case 'profile':
                await StandardModule.renderProfile(target, profile, session);
                break;
            case 'overview':
            default:
                await StandardModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Discovery Overview
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        const isClubMember = ['club', 'premium', 'authority'].includes((profile.subscription_tier || '').toLowerCase().trim());

        let mastermindContent = '';
        if (isClubMember) {
            mastermindContent = `
                <!-- CLUB MASTERMIND VIP SECTION -->
                <div style="grid-column: 1 / -1; margin-top: 32px;">
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: clamp(24px, 5vw, 48px); color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 32px;">
                        <span style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 6px 14px; border-radius: 99px; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Mon Espace VIP </span>
                        <h2 style="font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 950; margin: 16px 0 8px 0; letter-spacing:-0.04em;">Club Mastermind</h2>
                        <p style="color: rgba(255,255,255,0.6); font-size: 1.05rem; font-weight:600; margin: 0;">Votre espace d'intelligence collective & d'affaires des Antilles-Guyane.</p>
                    </div>

                    <div class="mobile-carousel" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                        <!-- Salon Mastermind DTC Interne -->
                        <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-comments"></i></div>
                            <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Salon Mastermind DTC</h3>
                            <p class="hide-on-mobile" style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Votre groupe de discussion privé avec les autres membres du Club pour partager leads, opportunités et insights.</p>
                            <button onclick="window.Router.navigate('#mastermind-salon')" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; font-size:0.95rem; display:inline-flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-arrow-right"></i> Accéder au Salon</button>
                        </div>

                        <!-- Sessions Co-développement -->
                        <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                            <div style="width: 48px; height: 48px; background: #f0fdf4; color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-video"></i></div>
                            <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Sessions Co-développement</h3>
                            <p class="hide-on-mobile" style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Visios mensuelles pour débloquer vos challenges stratégiques avec les autres membres du Club.</p>
                            <div style="width: 100%; padding: 14px; background: #f0fdf4; color: #10b981; border-radius: 12px; font-weight: 700; text-align:center; font-size:0.9rem;">Prochain calendrier en cours de planification</div>
                        </div>
                    </div>

                    <!-- MEETUPS AFTERWORKS LIST -->
                    <div class="hide-on-mobile" style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                        <h3 style="font-size: 1.35rem; font-weight: 900; color: #0f172a; margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', sans-serif;">Afterworks Physiques Locaux (Trimestriels)</h3>
                        <div id="std-afterworks-list" style="display: flex; flex-direction: column; gap: 16px;">
                            <div style="text-align:center; padding: 32px 16px; color: #94a3b8;"><p style="font-weight:700; color:#64748b; margin:0 0 6px;">Aucun afterwork programmé pour le moment</p><p style="font-size:0.85rem; margin:0;">Les prochains événements physiques seront annoncés ici dès confirmation.</p></div>
                        </div>
                    </div>

                    <!-- REPLAYS LIBRARY -->
                    <div class="hide-on-mobile" style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                        <h3 style="font-size: 1.35rem; font-weight: 900; color: #0f172a; margin: 0 0 24px 0; font-family: 'Plus Jakarta Sans', sans-serif;">Bibliothèque de Replays Masterclass VIP</h3>
                        <div id="std-replays-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
                            <div style="text-align:center; padding: 32px 16px; color: #94a3b8; grid-column: 1 / -1;"><p style="font-weight:700; color:#64748b; margin:0 0 6px;">Aucun replay disponible pour le moment</p><p style="font-size:0.85rem; margin:0;">Les prochaines masterclasses seront enregistrées et accessibles ici.</p></div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            mastermindContent = `
                <!-- CLUB MASTERMIND UPGRADE TEASER -->
                <div class="hide-on-mobile" style="grid-column: 1 / -1; margin-top: 32px; background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 24px; padding: 40px; color: white; border: 1px solid rgba(255,255,255,0.05); text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.15);">
                    <h2 style="font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 950; margin: 0 0 12px 0; letter-spacing: -0.04em;">Rejoindre le Club Mastermind DTC</h2>
                    <p style="color: rgba(255,255,255,0.6); font-size: 1.05rem; font-weight: 500; max-width: 600px; margin: 0 auto 28px;">
                        Accédez au cercle VIP des décideurs et entrepreneurs des Antilles-Guyane. Salon de discussion privé sur la plateforme, sessions mensuelles de co-développement et replays exclusifs.
                    </p>
                    <button onclick="window.PaymentModule ? window.PaymentModule.openSubModal('club', 'expert') : alert('...')" style="background: #10b981; color: white; border: none; padding: 16px 32px; border-radius: 14px; font-weight: 950; font-size: 1rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 8px 20px rgba(16,185,129,0.25); transition: transform 0.2s;">
                        <span>Devenir membre pour 29€/mois</span>
                    </button>
                </div>
            `;
        }

        const ctaBanners = `
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px; width: 100%;">
                <!-- WEBINAR CTA -->
                <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 24px; padding: 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; color: white; box-shadow: 0 10px 25px rgba(99,102,241,0.2); flex-wrap: wrap; box-sizing: border-box;">
                    <div style="max-width: 700px;">
                        <div style="background: rgba(255,255,255,0.2); color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 12px;">Évènement Live</div>
                        <h3 style="font-size: 1.5rem; font-weight: 950; margin: 0 0 8px 0; letter-spacing: -0.03em;">S'inscrire à mon 1er Webinaire Gratuit</h3>
                        <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin: 0; font-weight: 600;">Découvrez comment structurer, financer et propulser vos projets grâce à l'écosystème Domtom Connect. Places limitées !</p>
                    </div>
                    <a href="https://domtomconnect.systeme.io/webinaire" target="_blank" style="background: white; color: #4f46e5; text-decoration: none; padding: 16px 28px; border-radius: 14px; font-weight: 950; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s;">
                        <span>S'inscrire au webinaire</span>
                    </a>
                </div>

                <!-- DIAGNOSTIC CALL CTA -->
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 24px; padding: 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; color: white; box-shadow: 0 10px 25px rgba(16,185,129,0.15); border: 1px solid rgba(255,255,255,0.1); flex-wrap: wrap; box-sizing: border-box;">
                    <div style="max-width: 700px;">
                        <div style="background: rgba(255,255,255,0.2); color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 12px;">Diagnostic Offert</div>
                        <h3 style="font-size: 1.5rem; font-weight: 950; margin: 0 0 8px 0; letter-spacing: -0.03em;">Réserver mon Diagnostic Stratégique (Gratuit)</h3>
                        <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin: 0; font-weight: 600;">Bénéficiez de 30 minutes de coaching avec le coordinateur DTC pour structurer votre projet et accélérer votre développement aux Antilles.</p>
                    </div>
                    <a href="${profile.calendly_url || 'https://calendly.com/domtomconnect/30min'}" target="_blank" style="background: white; color: #059669; text-decoration: none; padding: 16px 28px; border-radius: 14px; font-weight: 950; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s;">
                        <span>Réserver mon créneau</span>
                    </a>
                </div>
            </div>
        `;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- MOBILE QUICK ACTIONS -->
                <div class="mobile-quick-actions" style="grid-column: 1 / -1;">
                    <a href="#messages" class="mobile-quick-action-btn">
                        <i class="fas fa-comment-dots"></i>
                        <span>Messages</span>
                    </a>
                    <a href="marketplace/directory.html" class="mobile-quick-action-btn">
                        <i class="fas fa-search"></i>
                        <span>Explorer</span>
                    </a>
                    <a href="#channel" class="mobile-quick-action-btn" onclick="if(window.App && window.App.state.profile) window.location.href='#channel?id='+window.App.state.profile.id">
                        <i class="fas fa-video"></i>
                        <span>Chaîne</span>
                    </a>
                    <a href="#profile" class="mobile-quick-action-btn">
                        <i class="fas fa-user"></i>
                        <span>Profil</span>
                    </a>
                </div>

                <div class="dash-welcome-card" style="background: #0f172a; border-radius: 24px; margin-bottom: 24px; padding: 40px;">
                    <span class="role-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 800; font-size: 0.75rem;">ESPACE EXPLORATEUR</span>
                    <h1 style="color: white; margin-top:12px; font-weight: 950; font-size: clamp(2rem, 4vw, 2.8rem); letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                    <p style="color: rgba(255,255,255,0.7); font-size: 1.1rem; margin-top: 8px;">Découvrez l'annuaire et commencez votre épopée territoriale.</p>
                </div>

                ${ctaBanners}

                <div class="hide-on-mobile" style="grid-column: 1 / -1; display:grid; gap:24px; width: 100%;">
                    <div style="background: white; border: 1px solid #e2e8f0; padding: 32px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Prêt à passer à l'action ?</h3>
                            <p style="color: #64748b; margin: 0; font-size: 0.95rem;">Activez votre profil comme porteur de projet ou expert pour débloquer de nouveaux outils.</p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="\${isClubMember ? \"window.Router.navigate('#mastermind-salon')\" : \"window.PaymentModule ? window.PaymentModule.openSubModal('club', 'expert') : alert('Veuillez rejoindre le Club pour accéder au salon.')\"}" style="background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                Accéder au Salon
                            </button>
                            <button onclick="window.Router.navigate('#profile')" class="cta-button primary" style="background:#0f172a; color:white; border-radius:12px; padding:16px 28px; font-weight:850; border:none; cursor:pointer;">Devenir Porteur ou Expert</button>
                        </div>
                    </div>
                </div>

                ${mastermindContent}
            </div>
        `;
    },

    /**
     * Profile View - Elite Orchestrator
     */
    renderProfile: async (container, profile, session) => {
        const view = container || document.getElementById('ecosystem-grid-container');
        if (!view) return;

        const role = profile.role || 'spectateur';
        let specializedFields = '';
        
        // Dynamically fetch specialized fields from active module
        if (role === 'expert' && window.ExpertsModule?.renderProfileFields) {
            specializedFields = window.ExpertsModule.renderProfileFields(profile);
        } else if (role === 'entreprise' && window.CompaniesModule?.renderProfileFields) {
            specializedFields = window.CompaniesModule.renderProfileFields(profile);
        } else if (role === 'owner' && window.OwnersModule?.renderProfileFields) {
            specializedFields = window.OwnersModule.renderProfileFields(profile);
        }

        view.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 800px; margin: 0 auto;">
                <div class="dash-card" style="grid-column: 1 / -1; background: white; padding: 40px; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03);">
                    <h2 style="font-weight: 900; margin-bottom: 40px; letter-spacing: -0.04em; color:#0f172a; font-size:2.2rem;">Édition du Profil Élite</h2>
                    
                    <div id="profile-editor-form" style="display: flex; flex-direction: column; gap: 32px;">
                        
                        <!-- SECTION 1: IDENTITY -->
                        <div style="background:#f8fafc; padding:24px; border-radius:20px; border:1px solid #f1f5f9;">
                            <h3 style="font-size:0.85rem; font-weight:900; color:#10b981; text-transform:uppercase; margin-bottom:24px; letter-spacing:0.05em;">Identit&eacute; Visuelle</h3>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Nom Complet / Marque</label>
                                    <input type="text" id="profile-full-name" value="${profile.full_name || ''}" style="width: 100%; padding: 16px; border-radius: 14px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Titre / Fonction</label>
                                    <input type="text" id="profile-title" value="${profile.title || ''}" placeholder="Ex: Fondateur, Expert Territorial..." style="width: 100%; padding: 16px; border-radius: 14px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                                </div>
                            </div>
                        </div>

                         <!-- SECTION 1.2: VISIBILITY & PUBLICATION (The 'Listed' System) -->
                        <div style="background: #fdfdfd; padding: 24px; border-radius: 20px; border: 2.5px dashed #10b981;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                <div>
                                    <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin: 0; letter-spacing:0.05em;">Visibilit&eacute; dans l'Annuaire</h3>
                                    <p style="font-size: 0.75rem; color: #64748b; margin: 4px 0 0 0;">Activez ce bouton pour apparaître publiquement et recevoir des propositions.</p>
                                </div>
                                <label class="switch" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                    <input type="checkbox" id="profile-listed" ${profile.listed ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                                    <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${profile.listed ? '#10b981' : '#ccc'}; transition: .4s; border-radius: 34px;"></span>
                                </label>
                            </div>

                            <div class="info-field">
                                <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Territoire de R&eacute;f&eacute;rence</label>
                                <select id="profile-territory" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; background: white;">
                                    <option value="">Sélectionnez votre territoire...</option>
                                    <optgroup label="Antilles-Guyane">
                                        <option value="Martinique" ${profile.territory === 'Martinique' ? 'selected' : ''}>Martinique</option>
                                        <option value="Guadeloupe" ${profile.territory === 'Guadeloupe' ? 'selected' : ''}>Guadeloupe</option>
                                        <option value="Guyane" ${profile.territory === 'Guyane' ? 'selected' : ''}>Guyane</option>
                                        <option value="Saint-Martin" ${profile.territory === 'Saint-Martin' ? 'selected' : ''}>Saint-Martin</option>
                                    </optgroup>
                                    <optgroup label="Océan Indien">
                                        <option value="Réunion" ${profile.territory === 'Réunion' ? 'selected' : ''}>La Réunion</option>
                                        <option value="Mayotte" ${profile.territory === 'Mayotte' ? 'selected' : ''}>Mayotte</option>
                                    </optgroup>
                                    <option value="France Hexagone" ${profile.territory === 'France Hexagone' ? 'selected' : ''}>France Hexagone</option>
                                    <option value="International" ${profile.territory === 'International' ? 'selected' : ''}>International / Diaspora</option>
                                </select>
                            </div>

                            <div class="info-field" style="margin-top: 20px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Lien Calendly (Réservation RDV)</label>
                                <input type="url" id="profile-calendly_url" value="${profile.calendly_url || ''}" placeholder="https://calendly.com/votre-nom/30min" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; background: white;">
                                <p style="font-size: 0.72rem; color: #94a3b8; margin: 6px 0 0 4px;">Laissez vide pour utiliser le lien de contact DTC par défaut.</p>
                            </div>
                        </div>

                        <!-- SECTION 1.5: ROLE ACTIVATION (Reliable Switch System) -->
                        <div style="background: white; padding: 24px; border-radius: 20px; border: 2.5px solid #0f172a;">
                            <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin-bottom:12px; letter-spacing:0.05em;">Activation du R&ocirc;le Professionnel</h3>
                            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 24px;">Choisissez votre &eacute;cosyst&egrave;me pour d&eacute;bloquer vos outils de croissance.</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="spectateur" ${profile.role === 'spectateur' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('spectateur')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'spectateur' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Observateur</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Veille Strat&eacute;gique</span>
                                    </div>
                                </label>
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="porteur" ${profile.role === 'porteur' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('porteur')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'porteur' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Porteur / Owner</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Lancer un Projet</span>
                                    </div>
                                </label>
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="expert" ${profile.role === 'expert' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('expert')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'expert' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Expert / Talent</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Offrir mes Services</span>
                                    </div>
                                </label>
                                <label style="cursor: pointer; position: relative;">
                                    <input type="radio" name="profile-role" value="entreprise" ${profile.role === 'entreprise' ? 'checked' : ''} style="display:none;" onchange="StandardModule.handleRoleSwitch('entreprise')">
                                    <div class="role-card" style="padding: 16px; border: 2px solid ${profile.role === 'entreprise' ? '#10b981' : '#e2e8f0'}; border-radius: 14px; text-align: center; transition: 0.2s;">
                                        <span style="display:block; font-weight: 800; font-size: 0.9rem;">Entreprise</span>
                                        <span style="font-size: 0.7rem; color: #94a3b8;">Besoins & Croissance</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- SECTION 2: SPECIALIZED FIELDS -->
                        <div id="specialized-fields-container" style="background:#fff; padding:0; border-radius:20px;">
                             ${specializedFields}
                        </div>

                        <!-- SECTION 3: PRESENTATION -->
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:12px;">Bio Institutionnelle / Pr&eacute;sentation</label>
                            <textarea id="profile-bio" style="width: 100%; min-height: 150px; padding: 20px; border-radius: 16px; border: 1.5px solid #e2e8f0; font-weight: 600; line-height:1.6;">${profile.bio || ''}</textarea>
                        </div>
                        
                        <div style="margin-top: 32px; padding-top:32px; border-top:1px solid #f1f5f9;">
                            <button onclick="StandardModule.saveProfile()" class="cta-button primary" style="background:#0f172a; color:white; border:none; padding:22px 32px; border-radius:16px; font-weight:950; font-size:1.1rem; width: 100%; cursor:pointer; box-shadow:0 15px 30px rgba(15,23,42,0.2);">Enregistrer et Publier mon Profil</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .switch input:checked + .slider { background-color: #10b981; }
                .slider:before {
                    position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px;
                    background-color: white; transition: .4s; border-radius: 50%;
                }
                .switch input:checked + .slider:before { transform: translateX(26px); }
            </style>
        `;
    },

    /**
     * Dynamic Role UI Switch
     */
    handleRoleSwitch: (role) => {
        // UI Visual Update
        document.querySelectorAll('.role-card').forEach(card => card.style.borderColor = '#e2e8f0');
        const selectedRadio = document.querySelector(`input[name="profile-role"][value="${role}"]`);
        if (selectedRadio) selectedRadio.nextElementSibling.style.borderColor = '#10b981';

        // Specialized Fields Injection
        const container = document.getElementById('specialized-fields-container');
        if (!container) return;

        let fields = '';
        if (role === 'expert' && window.ExpertsModule?.renderProfileFields) {
            fields = window.ExpertsModule.renderProfileFields({});
        } else if (role === 'porteur' && window.OwnersModule?.renderProfileFields) {
            fields = window.OwnersModule.renderProfileFields({});
        } else if (role === 'entreprise' && window.CompaniesModule?.renderProfileFields) {
            fields = window.CompaniesModule.renderProfileFields({});
        }
        
        container.innerHTML = fields;
    },

    /**
     * Save Strategy - Capturing EVERYTHING
     */
    saveProfile: async () => {
        try {
            const updates = {
                full_name: document.getElementById('profile-full-name').value,
                title: document.getElementById('profile-title').value,
                bio: document.getElementById('profile-bio').value,
                listed: document.getElementById('profile-listed').checked,
                territory: document.getElementById('profile-territory').value,
                updated_at: new Date().toISOString()
            };

            // Capture Selected Role
            const selectedRole = document.querySelector('input[name="profile-role"]:checked');
            if (selectedRole) updates.role = selectedRole.value;

            // Mapping for Directory Compatibility
            if (updates.role === 'expert') updates.expertise = updates.title;
            if (updates.role === 'entreprise') updates.company_name = updates.full_name;

            // Exhaustive field collection - PRUNED for DB Compatibility
            const allPossibleFields = [
                'tjm', 'availability', 'skills', 'siret', 'website', 
                'sector', 'company_name', 'creation_year', 'team_size', 'zone',
                'calendly_url'
            ];
            
            allPossibleFields.forEach(f => {
                const el = document.getElementById('profile-' + f);
                if (el) updates[f] = el.value;
            });

            // Special mapping for Experts
            if (updates.role === 'expert') {
                const skillsEl = document.getElementById('profile-skills');
                if (skillsEl) updates.expertise = skillsEl.value; // Expertise mapping
            }

            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expir\u00e9e");

            const { error } = await window._supabase.from('profiles').update(updates).eq('id', session.user.id);
            if (error) throw error;

            alert("Profil publi\u00e9 et mis \u00e0 jour avec succ\u00e8s !");
            window.location.reload();
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    }
};

window.StandardModule = StandardModule;
