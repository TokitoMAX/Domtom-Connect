/**
 * Owners Module - Domtom Connect
 * High-Performance Cockpit for Project Owners (Épopées)
 */
const OwnersModule = {
    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'success-engine':
                const seView = document.getElementById('success-engine-view-fixed');
                if (seView) {
                    if (typeof openProjectCockpit === 'function') openProjectCockpit();
                    else if (typeof loadMyProjects === 'function') loadMyProjects(session?.user?.id);
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
                            <p style="font-size: 0.95rem; color:#64748b; margin: 0;">Votre guide de certification pour lever des fonds et sécuriser vos experts.</p>
                        </div>
                        <button onclick="window.Router.navigate('/dashboard/success-engine')" class="cta-button primary" style="background:#10b981; white-space:nowrap;">Accéder au Cockpit</button>
                    </div>

                    <!-- PROJECT LIST (DYNAMIC) -->
                    <div id="owners-projects-feed">
                        <div style="background: white; border-radius: 24px; padding: 40px; text-align: center; border: 1px dashed #cbd5e1;">
                            <div style="font-size: 2.5rem; margin-bottom: 16px;">🚀</div>
                            <h3 style="font-size: 1.2rem; font-weight: 800; color:#0f172a;">Aucune épopée en cours</h3>
                            <p style="color:#64748b; margin-bottom: 24px;">Transformez votre idée en projet concret dès maintenant.</p>
                            <button onclick="openProjectModal()" class="cta-button primary" style="background:#0f172a;">Lancer mon premier projet</button>
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
            const { data: projects, error } = await _supabase
                .from('projects')
                .select('*')
                .eq('owner_id', userId);

            if (error) throw error;

            const projectsCount = projects ? projects.length : 0;
            const countEl = document.getElementById('dash-projects-count');
            if (countEl) countEl.textContent = projectsCount;

            const feed = document.getElementById('owners-projects-feed');
            if (projectsCount > 0 && feed) {
                let totalMaturity = 0;
                let projectsHtml = `
                    <div style="display: grid; gap: 16px;">
                        <h3 style="font-size: 1rem; font-weight: 850; color:#0f172a; margin-bottom: 8px;">Mes Épopées Actives</h3>
                `;

                projects.forEach(p => {
                    const score = typeof calculateProjectMaturity === 'function' ? calculateProjectMaturity(p) : 0;
                    totalMaturity += score;
                    projectsHtml += `
                        <div class="dash-card" style="padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s; cursor: pointer;" onclick="window.Router.navigate('/dashboard/success-engine?id=${p.id}')">
                            <div style="flex-grow: 1;">
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">${p.title || 'Nouvelle Épopée'}</h4>
                                <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
                                    <div style="width: 120px; height: 6px; background: #f1f5f9; border-radius: 100px; overflow: hidden;">
                                        <div style="width: ${score}%; height: 100%; background: #10b981; border-radius: 100px;"></div>
                                    </div>
                                    <span style="font-size: 0.75rem; font-weight: 800; color: #64748b;">${score}% Maturité</span>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <span style="display:block; font-size:1.1rem; font-weight:800; color:#0f172a;">${(parseFloat(p.total_raised) || 0).toLocaleString()}€</span>
                                <span style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Levés</span>
                            </div>
                        </div>
                    `;
                });

                projectsHtml += `</div>`;
                feed.innerHTML = projectsHtml;

                const avgMaturity = Math.round(totalMaturity / projectsCount);
                const avgEl = document.getElementById('dash-avg-maturity');
                if (avgEl) avgEl.textContent = `${avgMaturity} %`;
            }
        } catch (err) {
            console.error("Dashboard Stats Update Error:", err);
        }
    }
};

window.OwnersModule = OwnersModule;
