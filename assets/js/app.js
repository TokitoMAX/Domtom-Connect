/**
 * App.js - Domtom Connect
 * Main Orchestrator for the SPA Dashboard and Platform Logic
 */

const App = {
    state: {
        session: null,
        profile: null,
        role: null,
        activeView: null,
        initialized: false
    },

    /**
     * Initialization - Boot the platform
     */
    async init() {
        console.log("[App] Booting Domtom Connect Dashboard...");
        
        try {
            // 1. Wait for Supabase SDK & Auth initialization Injection
            let retryCount = 0;
            while (!window._supabase && retryCount < 20) {
                if (typeof window.initSupabase === 'function') window.initSupabase();
                if (window._supabase) break;
                console.log("[App] Waiting for Supabase SDK...");
                await new Promise(resolve => setTimeout(resolve, 200));
                retryCount++;
            }

            if (!window._supabase) {
                throw new Error("Le SDK Supabase n'a pas pu être initialisé.");
            }

            const db = window._supabase;
            this.db = db;

            // 2. Load Session
            const { data: { session }, error: sessionError } = await db.auth.getSession();
            if (sessionError) throw sessionError;

            this.state.session = session;

            if (!session) {
                console.log("[App] No active session found. Redirecting to login...");
                window.location.href = 'login.html';
                return;
            }

            // 3. Load Profile & Role
            const profile = await window.getUserProfile(session.user.id);
            if (!profile) {
                console.warn("[App] Profile not found. Redirecting to onboarding...");
                window.location.href = 'registration/onboarding.html';
                return;
            }

            this.state.profile = profile;
            this.state.role = profile.role || 'spectateur';
            
            // Hardened Platform Admin Logic: Always elevate the core email to admin
            const ownerEmail = 'domtomconnect@gmail.com';
            if (session.user.email?.toLowerCase().trim() === ownerEmail) {
                this.state.role = 'admin';
                console.log("[App] Platform Owner detected. Elevating to ADMIN role.");
            }
            
            console.log(`[App] Session ready: ${profile.full_name} (${this.state.role})`);

            // 4. Initialize UI & Routing
            this.state.initialized = true;

            if (window.UIComponents) {
                window.UIComponents.renderSidebar(this.state.role, profile.territory || 'Territoire');
                window.UIComponents.renderTopNav(this.state.role);
            }

            if (window.Router) {
                window.Router.init();
            }

        } catch (err) {
            console.error("[App] Critical Boot Error:", err);
            const container = document.getElementById('ecosystem-grid-container');
            if (container) {
                container.innerHTML = `<div style="padding:40px; color:#ef4444; text-align:center; font-weight:800;">Erreur de connexion : ${err.message}.</div>`;
            }
        }
    },

    /**
     * View Switcher - Main entry point for Router
     */
    async showView(viewId, forceRender = false, params = null) {
        if (!this.state.initialized && this.state.session) {
            console.log("[App] ShowView called before initialization complete. Waiting...");
            let waitCount = 0;
            while (!this.state.initialized && waitCount < 30) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Faster check (100ms)
                waitCount++;
            }
        }

        if (this.state.activeView === viewId && !forceRender) return;

        console.log(`[App] Switching view to: ${viewId} with params:`, params);
        this.state.activeView = viewId;

        // Sync Mobile Navigation active states
        if (window.syncNavActiveState) {
            window.syncNavActiveState();
        }

        // 1. Hide all views (SPA Strategy)
        const containers = document.querySelectorAll('.view-section');
        containers.forEach(c => c.style.display = 'none');
        
        // 2. Resolve target view and container
        const overview = document.getElementById('overview-view');
        const targetViewId = viewId === 'success-engine' ? 'success-engine-view-fixed' : `${viewId}-view`;
        let targetView = document.getElementById(targetViewId);
        
        // Role Isolation: Strictly enforce view permissions
        const safeRole = (this.state.role || '').toLowerCase().trim();
        const isOwner = safeRole.includes('porteur') || safeRole === 'owner' || safeRole === 'admin';
        const isAdmin = this.state.role === 'admin' || (this.state.session?.user?.email === 'domtomconnect@gmail.com');
        
        if (viewId === 'success-engine' && !(isOwner || isAdmin)) {
            console.warn(`[App] Unauthorized access attempt to success-engine by role: ${this.state.role}. Redirecting...`);
            this.showView('overview', true);
            return;
        }

        // Show the active view container
        if (viewId === 'overview' && overview) {
            overview.style.display = 'block';
        } else if (targetView) {
            targetView.style.display = 'block';
        }

        // 3. Select Module based on role
        let activeModule = this.getActiveModule();

        // --- NEW: Global Module Overrides ---
        const rawRoleApp = this.state.role || 'spectateur';
        const roleTrimmed = rawRoleApp.toLowerCase().trim();
        const proRoles = ['expert', 'entreprise', 'porteur', 'owner', 'porteur de projet', 'admin', 'premium', 'authority', 'club'];
        const isExplorateur = !proRoles.includes(roleTrimmed);
        const feedWrapper = document.getElementById('moments-feed-wrapper');

        // Handle dedicated moments view
        if (viewId === 'moments') {
            if (!targetView) {
                targetView = document.createElement('div');
                targetView.id = targetViewId;
                targetView.className = 'view-section';
                document.querySelector('.content-wrapper').appendChild(targetView);
            }
            targetView.style.display = 'block';
            
        if (feedWrapper) {
                feedWrapper.style.marginTop = '20px'; // Reset margin
                targetView.appendChild(feedWrapper);
                feedWrapper.style.display = 'block';
                if (window.MomentsModule) {
                    window.MomentsModule.renderFeed('dtc-moments-feed-mount-overview');
                }
            }
            return;
        }
        
        if (viewId === 'channel') {
            if (feedWrapper) feedWrapper.style.display = 'none';
            if (!targetView) {
                targetView = document.createElement('div');
                targetView.id = targetViewId;
                targetView.className = 'view-section';
                document.querySelector('.content-wrapper').appendChild(targetView);
            }
            targetView.style.display = 'block';
            
            if (window.ChannelModule) {
                const userId = params ? params.get('id') : null;
                window.ChannelModule.renderChannel(userId, targetViewId);
            } else {
                targetView.innerHTML = '<div style="padding:20px;">Chargement de la chaîne...</div>';
            }
            return;
        }

        // UNIFIED DASHBOARD: Simplified architecture for all roles
        if (viewId === 'overview') {
            if (overview) {
                overview.style.display = 'block';
                if (window.UIComponents && window.UIComponents.renderUnifiedDashboard) {
                    await window.UIComponents.renderUnifiedDashboard(overview, this.state.profile, this.state.role);
                }
            }
            if (feedWrapper) feedWrapper.style.display = 'none';
            return;
        }

        // For all other views, temporarily hide feedWrapper
        if (feedWrapper) feedWrapper.style.display = 'none';

        
        if (viewId === 'mastermind-salon') {
            const isClubMember = ['club', 'premium', 'authority'].includes((window.App.state.profile?.subscription_tier || '').toLowerCase().trim());
            if (!isClubMember) {
                alert("L'accès au salon privé est réservé aux membres du Club Mastermind.");
                window.Router.navigate('#dashboard');
                return;
            }

            if (!targetView) {
                targetView = document.createElement('div');
                targetView.id = targetViewId;
                targetView.className = 'view-section';
                document.querySelector('.content-wrapper').appendChild(targetView);
            }
            targetView.style.display = 'block';
            targetView.innerHTML = `
                <div style="display:flex; height:100%; min-height: calc(100vh - 80px); width:100%; max-width: 900px; margin: 0 auto; padding: 24px; box-sizing: border-box; flex-direction:column; font-family:'Inter', sans-serif;">
                    
                    <div style="background: white; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; flex: 1; border: 1px solid #e2e8f0;">
                        <!-- Top Header -->
                        <div style="padding:16px 24px; background:linear-gradient(135deg, #0f172a, #1e293b); color: white; display:flex; align-items:center; justify-content:space-between; z-index:10;">
                            <div style="display:flex; align-items:center; gap:16px;">
                                <div style="width:48px; height:48px; background:rgba(255,255,255,0.1); color:#10b981; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem;"><i class="fas fa-crown"></i></div>
                                <div>
                                    <div style="font-weight:800; font-size:1.2rem; letter-spacing: -0.02em;">Salon de Discussion Privé</div>
                                    <div style="font-size:0.85rem; color:rgba(255,255,255,0.7); font-weight: 500;">Échanges exclusifs entre membres du Club</div>
                                </div>
                            </div>
                            <button onclick="window.Router.navigate('#mastermind')" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: background 0.2s;"><i class="fas fa-arrow-left"></i> Retour</button>
                        </div>
                        
                        <!-- Chat Area -->
                        <div id="mastermind-chat-thread" style="flex:1; padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; background-color: #f8fafc;">
                        </div>

                        <!-- Input Area -->
                        <div style="padding:16px 24px; background:white; border-top:1px solid #e2e8f0; display:flex; align-items:center; gap:16px;">
                            <div style="flex:1; background:#f1f5f9; border-radius:12px; padding:12px 20px; display:flex; align-items:center;">
                                <input type="text" id="mastermind-chat-input" placeholder="Taper votre message au groupe..." style="width:100%; border:none; outline:none; background:transparent; font-size:1rem; font-family:'Inter', sans-serif; color:#0f172a;">
                            </div>
                            <button id="mastermind-send-btn" style="background:#10b981; color:white; border:none; width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; cursor:pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: transform 0.2s;"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            `;
            if (window.MastermindSalonModule) {
                window.MastermindSalonModule.init();
            }
            return;
        }

        if (viewId === 'mastermind') {
            if (!targetView) {
                targetView = document.createElement('div');
                targetView.id = targetViewId;
                targetView.className = 'view-section';
                document.querySelector('.content-wrapper').appendChild(targetView);
            }
            targetView.style.display = 'block';
            const isClubMember = ['club', 'premium', 'authority'].includes((this.state.profile?.subscription_tier || '').toLowerCase().trim());
                
                if (isClubMember) {
                    targetView.innerHTML = `
                        <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 900px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                            <!-- 1. HEADER -->
                            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: clamp(24px, 5vw, 48px); margin-bottom: 32px; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.05);">
                                <span style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 6px 14px; border-radius: 99px; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Cercle Privé B2B <i class="fas fa-crown"></i></span>
                                <h1 style="font-size: clamp(2rem, 5vw, 2.8rem); font-weight: 950; margin: 16px 0 8px 0; letter-spacing:-0.04em;">Club Mastermind</h1>
                                <p style="color: rgba(255,255,255,0.6); font-size: 1.1rem; font-weight:600; margin: 0;">Bienvenue dans votre espace d'intelligence collective & d'affaires des Antilles-Guyane.</p>
                            </div>

                            
                            <!-- 2. MAIN GRID (SIMPLIFIED) -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                                <!-- Accès Canal Privé Interne -->
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-comments"></i></div>
                                    <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Salon de Discussion Privé <i class="fas fa-crown"></i></h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Rejoignez le salon de discussion ultra-privé réservé aux membres pour échanger au quotidien directement sur la plateforme.</p>
                                    <button onclick="window.Router.navigate('#mastermind-salon')" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; font-size:0.95rem; display:inline-flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-sign-in-alt"></i> Accéder au Salon</button>
                                </div>

                                <!-- Sessions Co-développement -->
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 48px; height: 48px; background: #f0fdf4; color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-video"></i></div>
                                    <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Sessions Co-développement</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Visios mensuelles de co-développement pour débloquer vos challenges stratégiques et opérationnels.</p>
                                    <div style="width: 100%; padding: 14px; background: #f0fdf4; color: #10b981; border-radius: 12px; font-weight: 700; text-align:center; font-size:0.9rem;"><i class="fas fa-calendar-alt"></i> Prochain calendrier en cours de planification</div>
                                </div>
                            </div>

                            <!-- 3. REPLAYS LIBRARY -->
                            <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                <h3 style="font-size: 1.35rem; font-weight: 900; color: #0f172a; margin: 0 0 24px 0; font-family: 'Plus Jakarta Sans', sans-serif;"><i class="fas fa-video"></i> Bibliothèque de Replays Masterclass VIP</h3>
                                <div id="real-replays-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
                                    <div style="text-align: center; padding: 20px; color: #64748b; font-weight: 600; grid-column: 1 / -1;">Chargement des replays...</div>
                                </div>
                            </div>
                        </div>
                    `;
                    App.loadRealMastermindContent();
                } else {
                    targetView.innerHTML = `
                        <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 800px; margin: 0 auto; box-sizing: border-box; width: 100%; text-align: center;">
                            <!-- 1. HEADER -->
                            <div style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 32px; padding: clamp(32px, 6vw, 64px); color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 40px; position:relative; overflow:hidden;">
                                <div style="font-size: 3rem; margin-bottom: 20px; display:inline-block;"><i class="fas fa-crown"></i></div>
                                <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; margin: 0 0 16px 0; letter-spacing:-0.05em; line-height: 1;">Club Mastermind DTC</h1>
                                <p style="color: rgba(255,255,255,0.6); font-size: 1.15rem; font-weight:600; max-width: 600px; margin: 0 auto 32px;">Rejoignez le cercle B2B d'élite des entrepreneurs de la diaspora et des Antilles. Accélérez vos opportunités d'affaires et accédez aux décideurs.</p>
                                <button onclick="window.PaymentModule ? window.PaymentModule.openSubModal('club', 'expert') : alert('...')" style="background: #10b981; color: white; border: none; padding: 18px 36px; border-radius: 16px; font-weight: 950; font-size: 1.1rem; cursor: pointer; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 10px 25px rgba(16,185,129,0.3); transition: transform 0.2s;">
                                    <span><i class="fas fa-credit-card"></i> Devenir Membre du Club (29€/mois)</span>
                                </button>
                            </div>

                            <!-- 2. FEATURES GRID -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; text-align: left;">
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 44px; height: 44px; background: rgba(16,185,129,0.1); color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 20px;"><i class="fas fa-video"></i></div>
                                    <h3 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Sessions Mastermind Mensuelles</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0;">Un espace mensuel de co-développement animé par des experts pour débloquer vos challenges opérationnels et stratégiques.</p>
                                </div>
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 44px; height: 44px; background: rgba(16,185,129,0.1); color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 20px;"><i class="fas fa-comments"></i></div>
                                    <h3 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Salon de Discussion Mastermind DTC</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0;">Restez connecté quotidiennement avec le noyau dur de l'écosystème pour partager des leads d'affaires, contacts et opportunités via notre messagerie interne sécurisée.</p>
                                </div>
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 44px; height: 44px; background: rgba(16,185,129,0.1); color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 20px;"><i class="fas fa-calendar-alt"></i></div>
                                    <h3 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Afterworks Trimestriels Physiques</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0;">Vos invitations gratuites et exclusives à tous nos meetups de réseautage physique aux Antilles et en région parisienne.</p>
                                </div>
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 44px; height: 44px; background: rgba(16,185,129,0.1); color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 20px;"><i class="fas fa-play"></i></div>
                                    <h3 style="font-size: 1.15rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Bibliothèque de Replays VIP</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0;">Accédez en illimité aux replays de toutes les masterclasses et webinaires organisés sur la plateforme pour parfaire vos compétences.</p>
                                </div>
                            </div>
                        </div>
                    `;
                }
            return;
        }

        if (viewId === 'webinars' && window.WebinarModule) {
            activeModule = window.WebinarModule;
        }
        if (viewId === 'messages' && window.MessagesModule) {
            activeModule = window.MessagesModule;
        }
        if (viewId === 'billetterie' && window.TicketingModule) {
            activeModule = window.TicketingModule;
        }
        if (viewId === 'vitrine' && window.ShowcaseModule) {
            activeModule = {
                route: async (viewId, container, profile, session, params) => {
                    await window.ShowcaseModule.renderManager(container);
                }
            };
        }
        if (viewId === 'business' && window.BusinessModule) {
            activeModule = {
                route: async (viewId, container, profile, session, params) => {
                    await window.BusinessModule.renderView(container);
                }
            };
        }
        
        // Robust Wait for Module to Load (Mobile/Slow network support)
        if (!activeModule) {
            console.warn(`[App] Module for role ${this.state.role} not found. Retrying...`);
            let retry = 0;
            while (!activeModule && retry < 20) {
                await new Promise(r => setTimeout(r, 200));
                activeModule = this.getActiveModule();
                retry++;
            }
        }

        // 4. Render Module Content
        const gridContainer = document.getElementById('ecosystem-grid-container');
        const targetContainer = targetView || gridContainer;

        if (activeModule) {
            console.log(`[App] Executing ${activeModule.role || 'standard'} module router for view: ${viewId}`);
            
            // SECURITY CHECK: Clear target before injecting new module content
            if (targetContainer) {
                console.log(`[App] Preparing targetContainer (${targetContainer.id}) for module: ${viewId}`);
                // Ensure visibility
                targetContainer.style.display = 'block';
                // Keep some height to avoid "jumpy" UI
                targetContainer.innerHTML = `
                    <div style="min-height:450px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; animation: fadeIn 0.3s ease;">
                        <div class="splash-loader"></div>
                        <p style="color:#64748b; font-weight:700; font-size:1.1rem; letter-spacing:-0.01em;">Initialisation de l'espace ${viewId}...</p>
                    </div>
                `;
            }
            
            try {
                await activeModule.route(viewId, targetContainer, this.state.profile, this.state.session, params);
                
                // Add Feed to the bottom of the dashboard for ALL roles on overview
                if (viewId === 'overview') {
                    const existingFeedContainer = document.getElementById('spectator-dtc-feed-mount') || document.getElementById('global-dtc-feed-mount');
                    if (!existingFeedContainer) {
                        const feedBlock = document.createElement('div');
                        feedBlock.style.cssText = "grid-column: 1 / -1; margin-top: 40px; background: white; border-radius: 24px; padding: clamp(20px, 4vw, 40px); box-shadow: 0 4px 20px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; max-width: 800px; margin-left: auto; margin-right: auto; width: 100%; box-sizing: border-box;";
                        feedBlock.innerHTML = `
                            <h2 style="font-size: 2.2rem; font-weight: 950; color: #020617; letter-spacing: -0.05em; margin-bottom: 30px; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; gap: 12px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" style="vertical-align: middle;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                DTC (Moments & Actualités)
                            </h2>
                            <div id="global-dtc-feed-mount"></div>
                        `;
                        
                        // Wait for the route to finish rendering its innerHTML
                        setTimeout(() => {
                            // Find the inner dash grid, or append to targetContainer
                            const dashGrid = targetContainer.querySelector('.dash-grid-layout');
                            if (dashGrid) {
                                dashGrid.appendChild(feedBlock);
                            } else {
                                targetContainer.appendChild(feedBlock);
                            }
                            if (window.MomentsModule && window.MomentsModule.renderFeed) {
                                window.MomentsModule.renderFeed('global-dtc-feed-mount');
                            }
                        }, 500);
                    }
                }
                
            } catch (err) {
                console.error("[App] Module Route Error:", err);
                if (targetContainer) targetContainer.innerHTML = `<div style="padding:40px; color:#ef4444; font-weight:700; text-align:center;">Erreur lors du rendu du module : ${err.message}</div>`;
            }
        } else {
            console.error(`[App] Critical: Active module not found for role: ${this.state.role}`);
            if (targetContainer) targetContainer.innerHTML = `<div style="padding:40px; color:#ef4444; font-weight:700; text-align:center;">Module ${this.state.role} introuvable. Veuillez recharger la page.</div>`;
        }
    },

    async loadRealMastermindContent() {
        const eventsContainer = document.getElementById('real-afterworks-list');
        const replaysContainer = document.getElementById('real-replays-list');
        if (!eventsContainer && !replaysContainer) return;

        const db = window._supabase;
        if (!db) return;

        // 1. Load Real Events
        if (eventsContainer) {
            try {
                const { data: events, error: eventsError } = await db
                    .from('events')
                    .select('*')
                    .order('event_date', { ascending: true })
                    .limit(3);

                if (eventsError) throw eventsError;

                if (events && events.length > 0) {
                    eventsContainer.innerHTML = events.map(ev => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-radius: 14px; background: #f8fafc; border: 1px solid #f1f5f9;">
                            <div>
                                <b style="color: #0f172a; font-size: 0.95rem;">${ev.title}</b>
                                <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;"><i class="fas fa-map-marker-alt"></i> ${ev.location} • <i class="fas fa-calendar-alt"></i> ${ev.event_date}</div>
                            </div>
                            <a href="#billetterie" style="font-size: 0.75rem; text-decoration:none; background: #eff6ff; color: #3b82f6; padding: 6px 12px; border-radius: 100px; font-weight: 800; border: 1px solid rgba(59,130,246,0.15);">S'inscrire (${ev.price || 0}€)</a>
                        </div>
                    `).join('');
                } else {
                    eventsContainer.innerHTML = `<div style="text-align:center; padding: 32px 16px; color: #94a3b8;"><div style="font-size:2rem; margin-bottom:12px;"><i class="fas fa-calendar-alt"></i></div><p style="font-weight:700; color:#64748b; margin:0 0 6px;">Aucun afterwork programmé pour le moment</p><p style="font-size:0.85rem; margin:0;">Les prochains événements physiques seront annoncés ici dès confirmation.</p></div>`;
                }
            } catch (err) {
                console.error("Error loading events: ", err);
            }
        }

        // 2. Load Real Finished Webinars (Replays)
        if (replaysContainer) {
            try {
                const { data: webinars, error: webError } = await db
                    .from('webinars')
                    .select('*, profiles(full_name)')
                    .eq('status', 'finished')
                    .order('scheduled_at', { ascending: false })
                    .limit(3);

                if (webError) throw webError;

                if (webinars && webinars.length > 0) {
                    replaysContainer.innerHTML = webinars.map(w => `
                        <div onclick="window.Router.navigate('#webinars?id=${w.id}')" style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#f1f5f9'">
                            <div style="width:100%; aspect-ratio:16/9; background:#0f172a; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.5rem; margin-bottom:12px;"><i class="fas fa-play"></i></div>
                            <b style="font-size:0.9rem; color:#0f172a; display:block; line-height:1.4;">${w.title}</b>
                            <span style="font-size:0.75rem; color:#64748b; font-weight:600; display:block; margin-top:6px;">Expert: ${w.profiles?.full_name || 'DTC Expert'} • Masterclass Replay</span>
                        </div>
                    `).join('');
                } else {
                    replaysContainer.innerHTML = `<div style="text-align:center; padding: 32px 16px; color: #94a3b8; grid-column: 1 / -1;"><div style="font-size:2rem; margin-bottom:12px;"><i class="fas fa-video"></i></div><p style="font-weight:700; color:#64748b; margin:0 0 6px;">Aucun replay disponible pour le moment</p><p style="font-size:0.85rem; margin:0;">Les prochaines masterclasses seront enregistrées et accessibles ici.</p></div>`;
                }
            } catch (err) {
                console.error("Error loading webinars: ", err);
            }
        }
    },

    getActiveModule() {
        const rawRole = this.state.role || 'spectateur';
        // Normalize role: lowercase and remove accents/spaces for robust matching
        const role = rawRole.toLowerCase()
            .replace(/\s+/g, '')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 

        switch (role) {
            case 'admin':
            case 'entreprise': return window.CompaniesModule;
            case 'expert':
            case 'prestataire': return window.ExpertsModule;
            case 'porteur':
            case 'porteurdeprojet':
            case 'owner': return window.OwnersModule;
            case 'spectateur':
            case 'spectator': return window.SpectatorsModule;
            default: return window.StandardModule;
        }
    }
};

window.App = App;
window.showView = (id, force, params) => App.showView(id, force, params);

// Auto-boot if on the correct page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('mon-espace') || 
        window.location.pathname.includes('dashboard') || 
        document.querySelector('.sidebar') || 
        document.querySelector('.main-content')) {
        App.init();
    }
});
