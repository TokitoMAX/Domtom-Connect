/**
 * Domtom Connect - Project Owners Ecosystem Module (Porteurs de Projets)
 * Restoration: Premium HUD Orchestration & Strategic Surface
 */

const OwnersModule = {
    role: 'porteur',

    /**
     * Module Router - Deep Linking & View Orchestration
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        
        switch (viewId) {
            case 'success-engine':
                // Delegate to the Original Success Engine Logic
                const engineView = document.getElementById('success-engine-view-fixed');
                if (engineView) {
                    engineView.style.display = 'block';
                    if (params && params.id) {
                        if (typeof window.openProjectCockpit === 'function') {
                            window.openProjectCockpit(params.id);
                        }
                    } else {
                        if (typeof window.loadMyProjects === 'function') {
                            window.loadMyProjects(session.user.id, true);
                        }
                    }
                }
                break;
            case 'collaboration':
                if (window.CollaborationModule) {
                    const collabView = document.getElementById('collaboration-view');
                    if (collabView) {
                        collabView.style.display = 'block';
                        window.CollaborationModule.renderDashboard(collabView, null, profile, session);
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
     * Dashboard Home - Strategic Summary
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        // 1. Fetch Projects for the Summary
        const db = window._supabase;
        const { data: projects } = await db.from('projects').select('*').eq('owner_id', session.user.id);
        
        const project = (projects && projects.length > 0) ? projects[0] : null;

        // 2. Render the Premium HUD
        container.innerHTML = `
            <div class="dashboard-grid" style="display: grid; gap: 32px;">
                
                <!-- Welcome & HUD Header -->
                <div class="dash-card premium-dark" style="grid-column: 1 / -1; border-radius: 24px; padding: 48px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background:#10b981; color:white; border:none;">COCKPIT DE PILOTAGE</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin: 12px 0 16px 0;">Bonjour, ${profile.full_name || 'Porteur'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 700px; line-height:1.6; margin:0;">Pilotez vos épopées territoriales avec précision et accédez aux financements stratégiques.</p>
                        
                        <div style="display:flex; gap:32px; margin-top:32px; border-top:1px solid rgba(255,255,255,0.1); padding-top:32px;">
                            <div>
                                <div style="color:#94a3b8; font-size:0.75rem; font-weight:800; text-transform:uppercase;">Épopées Actives</div>
                                <div style="color:white; font-size:1.8rem; font-weight:900;">${projects ? projects.length : 0}</div>
                            </div>
                            <div>
                                <div style="color:#94a3b8; font-size:0.75rem; font-weight:800; text-transform:uppercase;">Maturité Moyenne</div>
                                <div id="maturity-score-dash" style="color:#10b981; font-size:1.8rem; font-weight:900;">0%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER -->
                <div class="dash-main-col" style="grid-column: span 8; display:grid; gap:32px;">
                    
                    <!-- MASTER PILOTAGE CARD -->
                    <div class="dash-card highlight" style="padding:56px; border-radius:32px; text-align:center; background: #0f172a; color: white; border: none; box-shadow: 0 40px 80px rgba(0,0,0,0.15); position:relative; overflow:hidden;">
                         <div style="position:relative; z-index:2;">
                             <div class="dash-icon-box" style="margin: 0 auto 32px auto; background:rgba(16, 185, 129, 0.15); color:#10b981; width:72px; height:72px; border-radius:24px; border: 1px solid rgba(16, 185, 129, 0.2); backdrop-filter: blur(10px);">
                                 <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                             </div>
                             <h2 style="font-size:2.8rem; font-weight:950; color:white; margin-bottom:16px; letter-spacing:-0.05em;">Success Engine</h2>
                             <p style="color:#94a3b8; font-size:1.15rem; max-width:540px; margin: 0 auto 40px auto; line-height:1.6; font-weight:600;">Pilotez votre épopée territoriale avec précision. Validez vos jalons stratégiques pour débloquer les financements.</p>
                             <button onclick="window.Router.navigate('/dashboard/success-engine')" class="cta-button primary" style="background:#10b981; color:white; font-weight:950; padding:20px 48px; border-radius:18px; margin:0 auto; font-size:1.15rem; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);">Piloter mon Épopée</button>
                         </div>
                         <!-- Abstract background glow -->
                         <div style="position:absolute; bottom:-100px; right:-100px; width:300px; height:300px; background:rgba(16, 185, 129, 0.1); border-radius:50%; filter:blur(100px);"></div>
                         <div style="position:absolute; top:-100px; left:-100px; width:300px; height:300px; background:rgba(59, 130, 246, 0.05); border-radius:50%; filter:blur(100px);"></div>
                    </div>

                    <!-- PROJECT LIST HUD -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
                        <h3 style="font-size:1.5rem; font-weight:950; color:#0f172a; letter-spacing:-0.03em;">Vos Épopées Actives</h3>
                        <span style="font-size:0.85rem; font-weight:800; color:#64748b; background:#f1f5f9; padding:4px 12px; border-radius:20px;">${projects ? projects.length : 0} Projets</span>
                    </div>
                    
                    <div id="owners-projects-view">
                         <div style="padding:80px; text-align:center; background:#f8fafc; border-radius:32px; border:2px dashed #e2e8f0; display:flex; flex-direction:column; align-items:center; gap:16px;">
                             <div class="dash-loader-spinner" style="width:40px; height:40px; border:4px solid #f1f5f9; border-top-color:#10b981; border-radius:50%; animation: spin 1s linear infinite;"></div>
                             <p style="color: #64748b; font-weight: 800; font-size: 1rem;">Activation du cockpit stratégique...</p>
                         </div>
                    </div>

                </div>

                <!-- SIDEBAR TOOLS -->
                <div class="dash-side-col" style="grid-column: span 4; display:grid; gap:24px;">
                    <div class="dash-card" style="padding:32px;">
                        <h4 style="font-size:0.8rem; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:24px;">Outils du Porteur</h4>
                        <div style="display:grid; gap:16px;">
                            <a href="/marketplace/directory" class="sidebar-link" style="padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; text-decoration:none;">
                                <span style="font-weight:700; color:#0f172a;">Trouver des Experts</span>
                            </a>
                            <a href="#business" onclick="window.Router.navigate('/dashboard/business')" class="sidebar-link" style="padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; text-decoration:none;">
                                <span style="font-weight:700; color:#0f172a;">Devis & Factures</span>
                            </a>
                        </div>
                    </div>

                    <!-- PREMIUM CTA -->
                    <div style="background:#10b981; border-radius:24px; padding:40px; color:white; box-shadow:0 10px 40px rgba(16, 185, 129, 0.2);">
                        <h3 style="font-size:1.4rem; font-weight:900; margin-bottom:12px;">Accompagnement Premium</h3>
                        <p style="font-size:0.95rem; color:rgba(255,255,255,0.9); line-height:1.6; margin-bottom:24px;">Besoin d'un coup de boost ? Nos mentors territoriaux vous accompagnent pas à pas.</p>
                        <button onclick="window.location.href='/support'" style="width:100%; padding:14px; border:none; border-radius:12px; background:white; color:#10b981; font-weight:900; cursor:pointer;">Prendre RDV</button>
                    </div>
                </div>

            </div>
        `;

        // 3. Orchestrate with original script logic (Tactical retry to ensure DOM readiness)
        const tryLoad = (attempts = 0) => {
            if (document.getElementById('owners-projects-view')) {
                if (typeof window.loadMyProjects === 'function') {
                    window.loadMyProjects(session.user.id);
                }
            } else if (attempts < 10) {
                setTimeout(() => tryLoad(attempts + 1), 100);
            }
        };
        tryLoad();
    }
};

window.OwnersModule = OwnersModule;
