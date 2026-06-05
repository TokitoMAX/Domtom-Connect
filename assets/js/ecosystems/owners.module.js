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
                break;
            case 'overview':
            default:
                OwnersModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Epic Presentation (Mobile Corrected & UI Improved)
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        // Fetch latest project for this owner
        let project = null;
        try {
            const { data, error } = await window._supabase
                .from('projects')
                .select('*')
                .eq('owner_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(1);
            if (!error && data && data.length > 0) {
                project = data[0];
            }
        } catch (err) {
            console.error("Error fetching latest project:", err);
        }

        const hasProject = !!project;

        const isClubMember = ['club', 'premium', 'authority'].includes((profile.subscription_tier || '').toLowerCase().trim());
        let mastermindContent = '';
        if (isClubMember) {
            mastermindContent = `
                <!-- CLUB MASTERMIND VIP SECTION -->
                <div style="grid-column: 1 / -1; margin-top: 32px;">
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: clamp(24px, 5vw, 48px); color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 32px;">
                        <span style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 6px 14px; border-radius: 99px; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Mon Espace VIP</span>
                        <h2 style="font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 950; margin: 16px 0 8px 0; letter-spacing:-0.04em;">Club Mastermind</h2>
                        <p style="color: rgba(255,255,255,0.6); font-size: 1.05rem; font-weight:600; margin: 0;">Votre espace d'intelligence collective & d'affaires des Antilles-Guyane.</p>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                        <!-- Salon Mastermind DTC Interne -->
                        <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-comments"></i></div>
                            <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Salon Mastermind DTC</h3>
                            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Votre groupe de discussion privé avec les autres membres du Club pour partager leads, opportunités et insights.</p>
                            <button onclick="window.Router.navigate('#messages?channel=mastermind')" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; font-size:0.95rem; display:inline-flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-arrow-right"></i> Accéder au Salon</button>
                        </div>

                        <!-- Sessions Co-développement -->
                        <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                            <div style="width: 48px; height: 48px; background: #f0fdf4; color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-video"></i></div>
                            <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Sessions Co-développement</h3>
                            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Visios mensuelles pour débloquer vos challenges stratégiques avec les autres membres du Club.</p>
                            <div style="width: 100%; padding: 14px; background: #f0fdf4; color: #10b981; border-radius: 12px; font-weight: 700; text-align:center; font-size:0.9rem;">Prochain calendrier en cours de planification</div>
                        </div>
                    </div>

                    <!-- MEETUPS AFTERWORKS LIST -->
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                        <h3 style="font-size: 1.35rem; font-weight: 900; color: #0f172a; margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', sans-serif;">Afterworks Physiques Locaux (Trimestriels)</h3>
                        <div id="std-afterworks-list" style="display: flex; flex-direction: column; gap: 16px;">
                            <div style="text-align:center; padding: 32px 16px; color: #94a3b8;"><p style="font-weight:700; color:#64748b; margin:0 0 6px;">Aucun afterwork programmé pour le moment</p><p style="font-size:0.85rem; margin:0;">Les prochains événements physiques seront annoncés ici dès confirmation.</p></div>
                        </div>
                    </div>

                    <!-- REPLAYS LIBRARY -->
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
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
                <div style="grid-column: 1 / -1; margin-top: 32px; background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 24px; padding: 40px; color: white; border: 1px solid rgba(255,255,255,0.05); text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.15);">
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

        // --- STATE 1: NEW USER (No project) - Streamlined Funnel ---
        if (!hasProject) {
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 20px;">
                    
                    <div style="text-align: center; margin-bottom: 60px; animation: slideDown 0.5s ease-out;">
                        <div style="display: inline-block; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 100px; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Bienvenue dans votre Cockpit</div>
                        <h1 style="font-size: 3.5rem; font-weight: 950; color: #0f172a; margin: 0 0 20px 0; letter-spacing: -0.04em; line-height: 1.1;">
                            Prêt à lancer votre<br><span style="color: #10b981;">Projet d'Impact ?</span>
                        </h1>
                        <p style="font-size: 1.2rem; color: #64748b; font-weight: 500; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                            Le <b>Success Engine</b> est notre algorithme exclusif qui vous guide pas-à-pas pour structurer, financer et valider votre projet sur le territoire.
                        </p>
                    </div>

                    <div style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 32px; padding: 60px 40px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.15); position: relative; overflow: hidden; margin-bottom: 40px;">
                        <!-- Decorative shapes -->
                        <div style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%);"></div>
                        <div style="position: absolute; bottom: -100px; right: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);"></div>
                        
                        <div style="position: relative; z-index: 10;">
                            <h2 style="font-size: 2rem; font-weight: 950; color: white; margin-bottom: 30px;">Démarrer ma première Épopée</h2>
                            <button onclick="window.Router.navigate('#success-engine')" style="background: #10b981; color: white; border: none; padding: 20px 48px; border-radius: 100px; font-weight: 950; font-size: 1.2rem; cursor: pointer; box-shadow: 0 10px 25px rgba(16,185,129,0.3); transition: transform 0.2s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 12px;">
                                Lancer le Success Engine
                            </button>
                        </div>
                    </div>

                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;">
                        <div style="max-width: 500px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0;">Besoin d'aide pour structurer ?</h3>
                            </div>
                            <p style="color: #64748b; font-size: 0.95rem; margin: 0; font-weight: 500; line-height: 1.5;">Profitez d'un diagnostic stratégique offert de 30 minutes avec notre équipe pour faire le point sur vos objectifs.</p>
                        </div>
                        <a href="https://calendly.com/domtomconnect/30min" target="_blank" style="background: white; color: #0f172a; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 800; font-size: 0.95rem; border: 1px solid #e2e8f0; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: all 0.2s;">
                            Prendre RDV
                        </a>
                    </div>
                    ${mastermindContent}
                </div>
            `;
            return;
        }

        // --- STATE 2: PROJECT OWNER (Has active project) ---
        
        // Calculate maturity dynamically using the core function if possible
        const maturity = window.calculateProjectMaturity ? window.calculateProjectMaturity(project) : 50;
        const goal = project.budget || 5000;
        const current = project.total_raised || 0;
        const percent = Math.min(Math.round((current / goal) * 100), 100);

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- COMPACT HERO BANNER -->
                <div class="epic-hero" style="grid-column: span 12; background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 24px; padding: 40px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; box-shadow: 0 15px 35px rgba(0,0,0,0.2); flex-wrap: wrap; gap: 20px;">
                    <div style="position: relative; z-index: 10; max-width: 600px;">
                        <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 16px; border: 1px solid rgba(16,185,129,0.2);">Cockpit de Commandement</div>
                        <h1 style="font-size: 2.5rem; font-weight: 950; color: white; margin: 0; letter-spacing: -0.03em; line-height: 1.1;">${project.title || 'Mon Épopée'}</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 1rem; margin-top: 12px; font-weight: 500;">
                            ${project.territory || 'Guyane'} • Pilotage stratégique & Impact territorial.
                        </p>
                    </div>
                    <div style="z-index: 10;">
                        <button onclick="window.Router.navigate('#success-engine')" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 14px 28px; border-radius: 14px; font-weight: 800; font-size: 0.95rem; cursor: pointer; backdrop-filter: blur(10px); transition: background 0.2s;">
                            Éditer le projet
                        </button>
                    </div>
                </div>

                <!-- 2. LIGHTWEIGHT FUNNEL OVERVIEW -->
                <div style="grid-column: span 12; display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px; align-items: stretch; margin-top: 16px;">
                    
                    <!-- Left Column: Core Progress -->
                    <div style="grid-column: span 8; background: white; border: 1px solid #e2e8f0; border-radius: 32px; padding: 48px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;">
                        <h3 style="font-size: 1.1rem; font-weight: 900; color: #0f172a; margin: 0 0 32px 0; display: flex; align-items: center; gap: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
                            <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 14px; border-radius: 10px; font-size: 0.8rem;">Cockpit</span>
                            Progression de l'Épopée
                        </h3>
                        
                        <div style="display: flex; align-items: center; gap: 40px;">
                            <div style="font-size: 5rem; font-weight: 950; color: #0f172a; line-height: 1; letter-spacing: -0.06em;">${maturity}<span style="color: #10b981; font-size: 3rem;">%</span></div>
                            <div style="flex: 1;">
                                <div style="height: 16px; background: #f1f5f9; border-radius: 100px; overflow: hidden; margin-bottom: 12px;">
                                    <div style="width: ${maturity}%; height: 100%; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); border-radius: 100px; box-shadow: 0 4px 10px rgba(16,185,129,0.3);"></div>
                                </div>
                                <div style="font-size: 1.05rem; color: #64748b; font-weight: 600;">${maturity >= 100 ? 'Projet prêt à être validé !' : 'Complétez les phases pour débloquer votre cagnotte.'}</div>
                            </div>
                        </div>

                        <div style="margin-top: 48px; padding-top: 40px; border-top: 1.5px solid #f1f5f9; display: flex; gap: 16px;">
                            <button onclick="window.Router.navigate('#success-engine')" class="cta-button primary" style="background: #10b981; color: white; border: none; padding: 20px 40px; border-radius: 20px; font-weight: 950; font-size: 1.15rem; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 15px 30px rgba(16,185,129,0.25);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 40px rgba(16,185,129,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 15px 30px rgba(16,185,129,0.25)';">
                                <span>Continuer le pilotage</span>
                            </button>
                        </div>
                    </div>

                    <!-- Right Column: Diagnostic Funnel -->
                    <div style="grid-column: span 4; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 32px; padding: 48px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); color: white; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;">
                        <div style="background: rgba(255,255,255,0.1); color: white; padding: 8px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 24px; align-self: flex-start; border: 1px solid rgba(255,255,255,0.1);">Accélération</div>
                        <h3 style="font-size: 1.8rem; font-weight: 950; margin: 0 0 16px 0; letter-spacing: -0.04em; position: relative; z-index: 10; line-height: 1.2;">Besoin d'un<br>coup de pouce ?</h3>
                        <p style="color: rgba(255,255,255,0.6); font-size: 1.05rem; margin: 0 0 40px 0; font-weight: 500; line-height: 1.6; position: relative; z-index: 10;">Faites le point avec notre équipe pour débloquer vos défis.</p>
                        <a href="https://calendly.com/domtomconnect/30min" target="_blank" style="background: white; color: #0f172a; text-decoration: none; padding: 20px; border-radius: 16px; font-weight: 950; font-size: 1.05rem; text-align: center; display: block; position: relative; z-index: 10; transition: transform 0.2s; border: 1px solid rgba(0,0,0,0.1);">
                            RDV Stratégique
                        </a>
                    </div>
                </div>
                ${mastermindContent}
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
