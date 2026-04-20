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

                <!-- MAIN WORKSPACE -->
                <div class="dash-main-col" style="grid-column: span 8; display:grid; gap:32px;">
                    
                    <!-- SUCCESS ENGINE GATEWAY -->
                    <div class="dash-card highlight" style="padding:40px; border-radius:24px; text-align:center;">
                         <div class="dash-icon-box" style="margin: 0 auto 20px auto; background:#10b981; color:white;">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                         </div>
                         <h2 style="font-size:1.8rem; font-weight:900; color:#0f172a; margin-bottom:8px;">Success Engine</h2>
                         <p style="color:#64748b; margin-bottom:32px;">Éditez votre carnet de route et validez vos phases stratégiques pour débloquer les financements.</p>
                         <button onclick="window.Router.navigate('/dashboard/success-engine')" class="cta-button primary" style="background:#10b981; font-weight:800; padding:16px 32px; border-radius:14px; margin:0 auto;">Gérer mon Épopée</button>
                    </div>

                    <!-- PROJECT QUICK VIEW -->
                    <div id="owners-projects-view">
                         <!-- Injected by loadMyProjects() -->
                         <div style="padding:40px; text-align:center; color:#94a3b8;">Chargement de vos projets...</div>
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

        // 3. Orchestrate with original script logic
        if (typeof window.loadMyProjects === 'function') {
            window.loadMyProjects(session.user.id);
        }
    }
};

window.OwnersModule = OwnersModule;
