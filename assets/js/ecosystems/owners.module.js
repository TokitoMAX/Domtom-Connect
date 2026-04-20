/**
 * Owners Module - Domtom Connect
 * High-Performance Cockpit for Project Owners (Épopées)
 */
const OwnersModule = {
    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session, params) => {
        console.log(`[OwnersModule] Routing to: ${viewId}`, params ? params.toString() : 'No params');
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'success-engine':
                const seView = document.getElementById('success-engine-view-fixed');
                if (seView) {
                    const projectId = params ? params.get('id') : null;
                    console.log(`[OwnersModule] Success Engine. ProjectID from params: ${projectId}`);
                    
                    if (typeof window.openProjectCockpit === 'function' && projectId) {
                        window.openProjectCockpit(projectId);
                    } else if (typeof window.loadMyProjects === 'function') {
                        window.loadMyProjects(session?.user?.id);
                    }
                }
                break;
            case 'overview':
            default:
                OwnersModule.renderDashboard(target, null, profile, session);
                break;
        }
    },

    /**
     * Dashboard Rendering Logic - High-End Success Engine Focus
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;
        console.log("[OwnersModule] Rendering Dashboard");

        container.innerHTML = `
            <div class="dashboard-grid role-owner-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- TOP HEADER : COCKPIT STATS -->
                <div class="dash-card premium-dark" style="grid-column: 1 / -1; border-radius: 24px; background: #0f172a; border: 1px solid #1e293b; padding: 40px; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center;">
                    <div style="z-index: 2;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.7rem; font-weight:800; margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Cockpit de Pilotage</span>
                        <h1 style="font-size: 2.2rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.03em;">Bonjour, ${profile.full_name || 'Épique'}</h1>
                        <p style="font-size: 1rem; color: #94a3b8; margin-top: 8px; font-weight: 500;">Pilotez vos épopées territoriales avec précision.</p>
                    </div>
                    
                    <div style="display: flex; gap: 32px; z-index: 2;">
                        <div style="text-align: right;">
                            <span style="display:block; font-size:0.65rem; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Épopées Actives</span>
                            <span style="font-size:1.75rem; font-weight:800; color:white;" id="dash-projects-count">...</span>
                        </div>
                        <div style="text-align: right;">
                            <span style="display:block; font-size:0.65rem; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Maturité Moyenne</span>
                            <span style="font-size:1.75rem; font-weight:800; color:#10b981;" id="dash-avg-maturity">... %</span>
                        </div>
                    </div>
                </div>

                <!-- MAIN WORKSPACE -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    <!-- SUCCESS ENGINE ACCESS -->
                    <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="width:72px; height:72px; background:#f0fdf4; border-radius:20px; display:flex; align-items:center; justify-content:center; color:#10b981;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <div style="flex-grow: 1;">
                            <h3 style="font-size: 1.25rem; font-weight: 850; color:#0f172a; margin: 0 0 4px 0;">Success Engine</h3>
                            <p style="font-size: 0.95rem; color:#64748b; margin: 0;">Éditez votre carnet de route et validez vos phases stratégiques.</p>
                        </div>
                        <button onclick="window.Router.navigate('/dashboard/success-engine')" class="cta-button primary" style="background:#10b981; white-space:nowrap;">Gérer mon Épopée</button>
                    </div>

                    <!-- PROJECT LIST (DYNAMIC) -->
                    <div id="owners-projects-feed">
                        <div style="padding: 40px; text-align: center;">
                            <p style="color:#64748b; margin-top: 16px;">Chargement de vos données stratégiques...</p>
                        </div>
                    </div>
                </div>

                <!-- SIDEBAR TOOLS -->
                <div class="dash-side-col" style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
                    <div class="dash-card" style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.75rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.05em;">Outils du Porteur</h4>
                        <div style="display:grid; gap:16px;">
                            <button onclick="window.Router.navigate('/marketplace/directory')" style="display:flex; align-items:center; gap:12px; background:none; border:none; color:#0f172a; font-weight:700; cursor:pointer; padding:0; font-size:0.9rem;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                Trouver des Experts
                            </button>
                            <button onclick="window.Router.navigate('/dashboard/business')" style="display:flex; align-items:center; gap:12px; background:none; border:none; color:#0f172a; font-weight:700; cursor:pointer; padding:0; font-size:0.9rem;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                Devis & Factures
                            </button>
                            <button onclick="window.Router.navigate('/marketplace/evenements')" style="display:flex; align-items:center; gap:12px; background:none; border:none; color:#0f172a; font-weight:700; cursor:pointer; padding:0; font-size:0.9rem;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                Prochains Éclats
                            </button>
                        </div>
                    </div>

                    <div class="dash-card premium-dark" style="border-radius: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; color: white;">
                        <h4 style="font-size: 1.1rem; font-weight: 850; margin-bottom: 12px;">Accompagnement Premium</h4>
                        <p style="font-size: 0.85rem; color: rgba(255,255,255,0.9); line-height: 1.5; margin-bottom: 24px;">Besoin d'un coup de boost ? Nos mentors territoriaux vous accompagnent.</p>
                        <button class="cta-button" style="background: white; color: #10b981; border: none; width: 100%; border-radius: 12px; font-weight: 850; padding: 12px;">Prendre RDV</button>
                    </div>
                </div>
            </div>
        `;

        // Load data and update UI
        if (session && session.user) {
            OwnersModule.updateDashboardStats(session.user.id);
        }
    },

    /**
     * Update dynamic stats on the owner dashboard
     */
    async updateDashboardStats(userId) {
        try {
            console.log("[OwnersModule] Fetching stats for user:", userId);
            const db = window._supabase || (typeof window.initSupabase === 'function' ? window.initSupabase() : null);
            if (!db) {
                console.error("[OwnersModule] Supabase DB not available");
                return;
            }

            const { data: projects, error } = await db
                .from('projects')
                .select('*')
                .eq('owner_id', userId);

            if (error) throw error;

            const projectsCount = projects ? projects.length : 0;
            const countEl = document.getElementById('dash-projects-count');
            if (countEl) countEl.textContent = projectsCount;

            const feed = document.getElementById('owners-projects-feed');
            if (!feed) return;

            // CAS : UN SEUL PROJET - ON AFFICHE LE TRAVAIL DIRECTEMENT
            if (projectsCount === 1) {
                const latest = projects[0];
                const calcMaturity = window.calculateProjectMaturity || (typeof calculateProjectMaturity === 'function' ? calculateProjectMaturity : () => 0);
                const score = calcMaturity(latest);
                
                feed.innerHTML = `
                    <div style="display: grid; gap: 24px;">
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 40px; border: 1px solid #10b981; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
                                <div>
                                    <h2 style="font-size: 1.8rem; font-weight: 950; color: #0f172a; margin: 0;">${latest.title}</h2>
                                    <p style="color: #10b981; font-weight: 800; margin-top: 4px;">Épopée Active • ${score}% de maturité stratégique</p>
                                </div>
                                <button onclick="window.Router.navigate('/dashboard/success-engine?id=${latest.id}')" class="cta-button primary" style="background: #0f172a;">Ouvrir le Cockpit Intégral</button>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; border-top: 1px solid #f1f5f9; padding-top: 32px;">
                                <div style="border-right: 1px solid #f1f5f9; padding-right: 40px;">
                                    <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Ma Vision Stratégique</h4>
                                    <p style="font-size: 1.05rem; color: #334155; line-height: 1.7; margin-bottom: 24px;">${latest.vision || '<i>Aucune vision saisie pour le moment.</i>'}</p>
                                    
                                    <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Ma Mission</h4>
                                    <p style="font-size: 1.05rem; color: #334155; line-height: 1.7; margin: 0;">${latest.mission || '<i>Aucune mission saisie.</i>'}</p>
                                </div>
                                <div>
                                    <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Statut du Financement</h4>
                                    <div style="background: #f8fafc; border-radius: 20px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                                        <div style="font-size: 1.75rem; font-weight: 900; color: #0f172a; margin-bottom: 4px;">${(parseFloat(latest.total_raised) || 0).toLocaleString()} €</div>
                                        <div style="color: #64748b; font-size: 0.9rem; font-weight: 600;">Récoltés sur un objectif de ${latest.funding_goal || '...'} €</div>
                                    </div>
                                    
                                    <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Besoins Commandos</h4>
                                    <p style="font-size: 1rem; color: #475569; line-height: 1.6; margin: 0;">${latest.needs || '<i>Pas de besoins spécifiques listés.</i>'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                const avgEl = document.getElementById('dash-avg-maturity');
                if (avgEl) avgEl.textContent = `${score} %`;
                return;
            }

            // CAS : PLUSIEURS PROJETS
            if (projectsCount > 0) {
                let totalMaturity = 0;
                let projectsHtml = `
                    <div style="display: grid; gap: 20px;">
                        <h3 style="font-size: 1.1rem; font-weight: 850; color:#0f172a; margin-bottom: 12px;">Mes Épopées Actives</h3>
                `;

                const calcMaturity = window.calculateProjectMaturity || (typeof calculateProjectMaturity === 'function' ? calculateProjectMaturity : () => 0);

                projects.forEach(p => {
                    const score = calcMaturity(p);
                    totalMaturity += score;
                    projectsHtml += `
                        <div class="dash-card" style="padding: 32px; background: white; border: 1px solid #e2e8f0; border-radius: 20px; display: grid; grid-template-columns: 1fr 200px; align-items: center; cursor: pointer; transition: all 0.3s;" onclick="window.Router.navigate('/dashboard/success-engine?id=${p.id}')">
                            <div>
                                <h4 style="margin: 0; font-size: 1.3rem; font-weight: 850; color: #0f172a;">${p.title || 'Nouvelle Épopée'}</h4>
                                <p style="font-size: 0.95rem; color: #64748b; margin: 8px 0 16px 0; line-height: 1.5; height: 2.8em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${p.vision || 'Pas de vision définie.'}</p>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 150px; height: 8px; background: #f1f5f9; border-radius: 100px; overflow: hidden;">
                                        <div style="width: ${score}%; height: 100%; background: #10b981; border-radius: 100px;"></div>
                                    </div>
                                    <span style="font-size: 0.8rem; font-weight: 800; color: #10b981;">${score}% Maturité</span>
                                </div>
                            </div>
                            <div style="text-align: right; border-left: 1px solid #f1f5f9; padding-left: 32px;">
                                <div style="font-size: 1.4rem; font-weight: 900; color: #0f172a;">${(parseFloat(p.total_raised) || 0).toLocaleString()} €</div>
                                <div style="font-size: 0.7rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Récoltés</div>
                            </div>
                        </div>
                    `;
                });

                projectsHtml += `</div>`;
                feed.innerHTML = projectsHtml;

                const avgMaturity = Math.round(totalMaturity / projectsCount);
                const avgEl = document.getElementById('dash-avg-maturity');
                if (avgEl) avgEl.textContent = `${avgMaturity} %`;
            } else {
                feed.innerHTML = `
                    <div style="background: white; border-radius: 24px; padding: 40px; text-align: center; border: 1px dashed #cbd5e1;">
                        <div style="font-size: 2.5rem; margin-bottom: 16px;">🚀</div>
                        <h3 style="font-size: 1.2rem; font-weight: 800; color:#0f172a;">Aucune épopée en cours</h3>
                        <p style="color:#64748b; margin-bottom: 24px;">Transformez votre idée en projet concret dès maintenant.</p>
                        <button onclick="if(typeof window.openProjectModal === 'function') window.openProjectModal()" class="cta-button primary" style="background:#0f172a;">Lancer mon premier projet</button>
                    </div>
                `;
            }
        } catch (err) {
            console.error("Dashboard Stats Update Error:", err);
            const feed = document.getElementById('owners-projects-feed');
            if (feed) feed.innerHTML = `<p style="color:red; text-align:center;">Erreur lors du chargement des données. Veuillez rafraîchir la page.</p>`;
        }
    }
};

window.OwnersModule = OwnersModule;
