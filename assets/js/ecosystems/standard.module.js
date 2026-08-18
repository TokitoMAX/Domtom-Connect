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
                        
                        <!-- SECTION 1: IDENTITY & MEDIA -->
                        <div style="background:#f8fafc; padding:28px; border-radius:24px; border:1px solid #e2e8f0;">
                            <h3 style="font-size:0.85rem; font-weight:900; color:#10b981; text-transform:uppercase; margin-bottom:24px; letter-spacing:0.05em;"><i class="fas fa-user-circle"></i> Identit&eacute; Visuelle &amp; Photos</h3>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom: 20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Nom Complet / Marque *</label>
                                    <input type="text" id="profile-full-name" value="${profile.full_name || ''}" placeholder="Ex: Loïc Villeronce" style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; box-sizing: border-box;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Titre / Fonction / Accroche *</label>
                                    <input type="text" id="profile-title" value="${profile.title || ''}" placeholder="Ex: Chef de projet & Développement Business..." style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; box-sizing: border-box;">
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Photo de Profil (URL)</label>
                                    <input type="url" id="profile-avatar_url" value="${profile.avatar_url || ''}" placeholder="https://domaine.com/photo.jpg" style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 600; box-sizing: border-box;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Banni&egrave;re de Couverture (URL)</label>
                                    <input type="url" id="profile-banner_url" value="${profile.banner_url || ''}" placeholder="https://domaine.com/banniere.jpg" style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 600; box-sizing: border-box;">
                                </div>
                            </div>
                        </div>

                         <!-- SECTION 2: VISIBILITY & LOCATION -->
                        <div style="background: #fdfdfd; padding: 28px; border-radius: 24px; border: 2.5px dashed #10b981;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                <div>
                                    <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin: 0; letter-spacing:0.05em;"><i class="fas fa-globe"></i> Visibilit&eacute; dans l'Annuaire</h3>
                                    <p style="font-size: 0.75rem; color: #64748b; margin: 4px 0 0 0;">Activez ce bouton pour apparaître publiquement dans l'annuaire et recevoir des propositions.</p>
                                </div>
                                <label class="switch" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                    <input type="checkbox" id="profile-listed" ${profile.listed ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                                    <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${profile.listed ? '#10b981' : '#ccc'}; transition: .4s; border-radius: 34px;"></span>
                                </label>
                            </div>

                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom: 20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Territoire d'intervention</label>
                                    <select id="profile-territory" style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; background: white; box-sizing: border-box;">
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

                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Ville / Lancement (Résidence Actuelle)</label>
                                    <input type="text" id="profile-current_location" value="${profile.current_location || ''}" placeholder="Ex: Fort-de-France, Paris, Cayenne..." style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; background: white; box-sizing: border-box;">
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;"><i class="fab fa-whatsapp" style="color: #25D366;"></i> N° WhatsApp Direct (avec indicatif)</label>
                                    <input type="tel" id="profile-phone" value="${profile.phone || ''}" placeholder="Ex: +596696123456" style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; background: white; box-sizing: border-box;">
                                    <p style="font-size: 0.72rem; color: #94a3b8; margin: 4px 0 0 4px;">Affiche le bouton WhatsApp direct sur votre profil public.</p>
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Lien Calendly (Réservation RDV)</label>
                                    <input type="url" id="profile-calendly_url" value="${profile.calendly_url || ''}" placeholder="https://calendly.com/votre-nom/30min" style="width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700; background: white; box-sizing: border-box;">
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: ROLE ACTIVATION -->
                        <div style="background: white; padding: 28px; border-radius: 24px; border: 2.5px solid #0f172a;">
                            <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin-bottom:12px; letter-spacing:0.05em;"><i class="fas fa-briefcase"></i> Activation du R&ocirc;le Professionnel</h3>
                            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 24px;">Choisissez votre écosystème pour débloquer vos outils de croissance.</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
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

                        <!-- SECTION 4: SPECIALIZED FIELDS -->
                        <div id="specialized-fields-container" style="background:#fff; padding:0; border-radius:20px;">
                             ${specializedFields}
                        </div>

                        <!-- SECTION 5: SOCIAL LINKS -->
                        <div style="background: #f8fafc; padding: 28px; border-radius: 24px; border: 1px solid #e2e8f0;">
                            <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin-bottom:16px; letter-spacing:0.05em;"><i class="fas fa-share-alt"></i> R&eacute;seaux Sociaux &amp; Liens Publics</h3>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:6px;"><i class="fab fa-linkedin" style="color:#0077b5;"></i> LinkedIn (URL)</label>
                                    <input type="url" id="profile-linkedin_url" value="${profile.linkedin_url || ''}" placeholder="https://linkedin.com/in/..." style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: 600; box-sizing: border-box;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:6px;"><i class="fas fa-globe" style="color:#3b82f6;"></i> Site Web / Portfolio (URL)</label>
                                    <input type="url" id="profile-website_url" value="${profile.website_url || profile.website || ''}" placeholder="https://..." style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: 600; box-sizing: border-box;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:6px;"><i class="fab fa-instagram" style="color:#e4405f;"></i> Instagram (URL)</label>
                                    <input type="url" id="profile-instagram_url" value="${profile.instagram_url || ''}" placeholder="https://instagram.com/..." style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: 600; box-sizing: border-box;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:6px;"><i class="fab fa-facebook" style="color:#1877f2;"></i> Facebook (URL)</label>
                                    <input type="url" id="profile-facebook_url" value="${profile.facebook_url || ''}" placeholder="https://facebook.com/..." style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: 600; box-sizing: border-box;">
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 6: PRESENTATION & BIO -->
                        <div class="info-field">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:12px;">Bio Institutionnelle / Pr&eacute;sentation *</label>
                            <textarea id="profile-bio" style="width: 100%; min-height: 150px; padding: 20px; border-radius: 16px; border: 1.5px solid #e2e8f0; font-weight: 600; line-height:1.6; box-sizing: border-box;">${profile.bio || ''}</textarea>
                        </div>

                        <!-- SECTION 7: MARKETING & TRACKING (OPTIONAL) -->
                        <details style="background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; padding: 16px 20px;">
                            <summary style="font-size:0.85rem; font-weight:900; color:#475569; text-transform:uppercase; cursor:pointer; letter-spacing:0.05em;">⚙️ Outils Marketing &amp; Pixels (Google Analytics, Facebook Pixel)</summary>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top: 16px;">
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">ID Google Analytics (GA4)</label>
                                    <input type="text" id="profile-ga_id" value="${profile.ga_id || ''}" placeholder="Ex: G-XXXXXXXXXX" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: 600; box-sizing: border-box;">
                                </div>
                                <div class="info-field">
                                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom:8px;">Pixel Facebook (ID)</label>
                                    <input type="text" id="profile-fb_pixel_id" value="${profile.fb_pixel_id || ''}" placeholder="Ex: 123456789012345" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: 600; box-sizing: border-box;">
                                </div>
                            </div>
                        </details>

                        <!-- SECTION 8: PAIEMENTS & REVENUS STRIPE -->
                        <div style="background: ${profile.stripe_payouts_enabled ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : profile.stripe_connect_id ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'}; padding: 28px; border-radius: 20px; border: 2px solid ${profile.stripe_payouts_enabled ? '#10b981' : profile.stripe_connect_id ? '#f59e0b' : '#334155'};">
                            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
                                <div>
                                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                        <span style="font-size: 1.5rem;">${profile.stripe_payouts_enabled ? '✅' : profile.stripe_connect_id ? '⚠️' : '💳'}</span>
                                        <h3 style="font-size: 0.85rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; color: ${profile.stripe_payouts_enabled ? '#065f46' : profile.stripe_connect_id ? '#92400e' : 'white'};">
                                            ${profile.stripe_payouts_enabled ? 'Compte de Paiement Actif' : profile.stripe_connect_id ? 'Configuration Incomplète' : 'Recevoir mes Paiements'}
                                        </h3>
                                    </div>
                                    <p style="font-size: 0.85rem; font-weight: 600; margin: 0; color: ${profile.stripe_payouts_enabled ? '#047857' : profile.stripe_connect_id ? '#b45309' : 'rgba(255,255,255,0.7)'};">
                                        ${profile.stripe_payouts_enabled 
                                            ? 'Votre RIB est configuré. Les paiements sont virés automatiquement sur votre compte.' 
                                            : profile.stripe_connect_id 
                                                ? 'Des informations manquent. Finalisez pour activer les virements.' 
                                                : 'Ajoutez votre RIB pour recevoir vos revenus directement sur votre compte bancaire.'}
                                    </p>
                                </div>
                                <button id="stripe-setup-btn" style="padding: 14px 22px; background: ${profile.stripe_payouts_enabled ? '#10b981' : 'white'}; color: ${profile.stripe_payouts_enabled ? 'white' : '#0f172a'}; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; font-size: 0.9rem; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s;">
                                    ${profile.stripe_payouts_enabled ? '🏦 Gérer mon Compte' : profile.stripe_connect_id ? '⚡ Finaliser la Config' : '➕ Ajouter mon RIB'}
                                </button>
                            </div>

                            <!-- Commission breakdown -->
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid ${profile.stripe_payouts_enabled ? 'rgba(16,185,129,0.3)' : profile.stripe_connect_id ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.15)'};">
                                <p style="font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0; color: ${profile.stripe_payouts_enabled ? '#047857' : profile.stripe_connect_id ? '#b45309' : 'rgba(255,255,255,0.5)'};">Ce que vous gagnez sur chaque paiement :</p>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                                    <div style="background: ${profile.stripe_payouts_enabled ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.08)'}; border-radius: 10px; padding: 12px; text-align: center;">
                                        <div style="font-size: 1.4rem; font-weight: 950; color: ${profile.stripe_payouts_enabled ? '#10b981' : 'white'};">90%</div>
                                        <div style="font-size: 0.7rem; color: ${profile.stripe_payouts_enabled ? '#047857' : 'rgba(255,255,255,0.6)'}; font-weight: 700;">Votre part nette</div>
                                    </div>
                                    <div style="background: ${profile.stripe_payouts_enabled ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.08)'}; border-radius: 10px; padding: 12px; text-align: center;">
                                        <div style="font-size: 1.4rem; font-weight: 950; color: ${profile.stripe_payouts_enabled ? '#ef4444' : 'rgba(255,255,255,0.5)'};">10%</div>
                                        <div style="font-size: 0.7rem; color: ${profile.stripe_payouts_enabled ? '#b91c1c' : 'rgba(255,255,255,0.4)'}; font-weight: 700;">Commission DTC</div>
                                        <div style="font-size: 0.65rem; color: ${profile.stripe_payouts_enabled ? '#9ca3af' : 'rgba(255,255,255,0.3)'}; margin-top: 2px;">(frais bancaires inclus)</div>
                                    </div>
                                    <div style="background: ${profile.stripe_payouts_enabled ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.08)'}; border-radius: 10px; padding: 12px; text-align: center;">
                                        <div style="font-size: 1.4rem; font-weight: 950; color: ${profile.stripe_payouts_enabled ? '#10b981' : 'white'};">90%</div>
                                        <div style="font-size: 0.7rem; color: ${profile.stripe_payouts_enabled ? '#047857' : 'rgba(255,255,255,0.6)'}; font-weight: 700;">Garanti pour vous</div>
                                        <div style="font-size: 0.65rem; color: ${profile.stripe_payouts_enabled ? '#9ca3af' : 'rgba(255,255,255,0.3)'}; margin-top: 2px;">(sans surprise)</div>
                                    </div>
                                </div>
                            </div>
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

        // Activate the Stripe setup button
        setTimeout(() => {
            const stripeBtn = document.getElementById('stripe-setup-btn');
            if (stripeBtn) {
                stripeBtn.onclick = async () => {
                    if (profile.stripe_payouts_enabled) {
                        window.open('https://dashboard.stripe.com/', '_blank');
                        return;
                    }
                    stripeBtn.disabled = true;
                    stripeBtn.textContent = '⏳ Connexion à Stripe...';
                    try {
                        const { data: { session: sess } } = await window._supabase.auth.getSession();
                        const res = await fetch('https://vlpzmxddgdjjtrpbtksd.supabase.co/functions/v1/create-connect-onboarding', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${sess.access_token}`, 'Content-Type': 'application/json' }
                        });
                        const data = await res.json();
                        if (data.url) {
                            window.location.href = data.url;
                        } else {
                            throw new Error(data.error || 'Erreur inconnue');
                        }
                    } catch (err) {
                        alert('Erreur : ' + err.message);
                        stripeBtn.disabled = false;
                        stripeBtn.textContent = profile.stripe_connect_id ? '⚡ Finaliser la Config' : '➕ Ajouter mon RIB';
                    }
                };
            }
        }, 100);
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
                full_name: document.getElementById('profile-full-name')?.value || '',
                title: document.getElementById('profile-title')?.value || '',
                bio: document.getElementById('profile-bio')?.value || '',
                listed: document.getElementById('profile-listed')?.checked || false,
                territory: document.getElementById('profile-territory')?.value || '',
                updated_at: new Date().toISOString()
            };

            // Capture Selected Role
            const selectedRole = document.querySelector('input[name="profile-role"]:checked');
            if (selectedRole) updates.role = selectedRole.value;

            // Mapping for Directory Compatibility
            if (updates.role === 'expert') updates.expertise = updates.title;
            if (updates.role === 'entreprise') updates.company_name = updates.full_name;

            // Exhaustive field collection
            const allPossibleFields = [
                'avatar_url', 'banner_url', 'current_location', 'phone',
                'tjm', 'availability', 'skills', 'siret', 'website', 'website_url',
                'linkedin_url', 'instagram_url', 'facebook_url', 'youtube_url', 'tiktok_url',
                'sector', 'company_name', 'creation_year', 'team_size', 'zone',
                'calendly_url', 'ga_id', 'fb_pixel_id'
            ];
            
            allPossibleFields.forEach(f => {
                const el = document.getElementById('profile-' + f);
                if (el && el.value !== undefined) {
                    updates[f] = el.value.trim();
                }
            });

            // Sync website_url if website is filled
            if (updates.website && !updates.website_url) updates.website_url = updates.website;
            if (updates.website_url && !updates.website) updates.website = updates.website_url;
            delete updates.website;

            // Sync boolean 'available' column with availability selection
            if (updates.availability) {
                updates.available = (updates.availability === 'available');
            }

            // Special mapping for Experts
            if (updates.role === 'expert') {
                const skillsEl = document.getElementById('profile-skills');
                if (skillsEl) updates.expertise = skillsEl.value; // Expertise mapping
            }

            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expirée");

            let { error } = await window._supabase.from('profiles').update(updates).eq('id', session.user.id);
            
            // Fallback: If availability column doesn't exist in Supabase schema yet
            if (error && error.message && error.message.includes('availability')) {
                console.warn("Retrying profile save without availability column:", error.message);
                delete updates.availability;
                const retryRes = await window._supabase.from('profiles').update(updates).eq('id', session.user.id);
                error = retryRes.error;
            }

            if (error) throw error;

            alert("Profil publié et mis à jour avec succès !");
            window.location.reload();
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    }
};

window.StandardModule = StandardModule;
