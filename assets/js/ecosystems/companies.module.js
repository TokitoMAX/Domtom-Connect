/**
 * Domtom Connect - Company Ecosystem Module
 * Logic for Companies (Partner SaaS Standard)
 */
const CompaniesModule = {
    role: 'entreprise',

    /**
     * Module Router
     */
    route: async (view_id, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;
        const topNav = document.getElementById('ecosystem-top-nav');
        if (topNav) topNav.style.display = 'none';

        switch (view_id) {
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView) {
                    bizView.style.display = 'block';
                    if (window.BusinessModule) await window.BusinessModule.renderView(bizView);
                }
                break;
            case 'success-engine':
                console.log(`[CompaniesModule] Routing to Success Engine. InspectId: ${params ? params.get('inspect') : 'None'}`);
                if (window.loadMyProjects) {
                    const engineContainer = document.getElementById('success-engine-view-fixed');
                    if (engineContainer) {
                        engineContainer.style.display = 'block';
                        // If it's an inspection (params.get('inspect')), load specifically that project
                        const inspectId = params ? params.get('inspect') : null;
                        window.loadMyProjects(session.user.id, false, inspectId);
                    }
                }
                break;
            case 'profile':
                if (window.StandardModule) {
                    window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'billetterie':
                const tickView = document.getElementById('billetterie-view');
                if (tickView && window.TicketingModule) {
                    tickView.style.display = 'block';
                    window.TicketingModule.loadMyTicketing(params);
                }
                break;
            case 'vitrine':
                if (window.ShowcaseModule) {
                    ShowcaseModule.renderManager(target);
                }
                break;
            case 'marketplace':
                if (window.ShowcaseModule) {
                    ShowcaseModule.renderMarketplace(target);
                }
                break;
            case 'overview':
            default:
                if (container) container.style.display = 'block';
                CompaniesModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Institutional Presentation (Mobile Fixed)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;
        
        // Hardened Admin Check (Email or Role)
        const userEmail = (session?.user?.email || window.currentSession?.user?.email || "").toLowerCase().trim();
        const isAdmin = window.activeRole === 'admin' || userEmail === 'domtomconnect@gmail.com';
        
        console.log(`[CompaniesModule] Rendering Dashboard. Role: ${window.activeRole}, Email: ${userEmail}, isAdmin: ${isAdmin}`);

        const badgeText = isAdmin ? 'ADMINISTRATION' : 'Espace Entreprise';
        const badgeColor = isAdmin ? '#3b82f6' : '#10b981';

        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                
                <!-- HEADER -->
                <div style="background: ${isAdmin ? 'linear-gradient(135deg, #020617 0%, #1e293b 100%)' : '#020617'}; border-radius: 24px; padding: clamp(24px, 5vw, 48px); margin-bottom: 32px; color: white; box-shadow: 0 15px 30px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <span style="background: rgba(255,255,255,0.1); border: 1px solid ${badgeColor}; color: ${badgeColor}; padding: 4px 14px; border-radius: 99px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase;">${badgeText}</span>
                            <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; margin: 16px 0 8px 0; letter-spacing:-0.05em;">${profile.company_name || profile.full_name || 'Domtom Connect'}</h1>
                            <p style="color: rgba(255,255,255,0.6); font-size: 1.1rem; font-weight:600; margin: 0;">${isAdmin ? 'Outils de Supervision Institutional' : 'Centre de commandement pour vos talents et missions.'}</p>
                        </div>
                        ${isAdmin ? `
                        <div style="text-align: right; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 18px; min-width: 200px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">STAFF ID</div>
                            <div style="font-size: 1.1rem; color: white; font-weight: 700;">ADMIN-MODE</div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- CARDS GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Gestion Pro</h4>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Business Pilotage</div>
                        <button onclick="window.location.hash = 'business'" style="width: 100%; padding: 14px; background: #f8fafc; color: #020617; border: 1.5px solid #e2e8f0; border-radius: 12px; font-weight: 900; cursor: pointer;">Accéder</button>
                    </div>

                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Talents Hub</h4>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Annuaire Experts</div>
                        <button onclick="window.location.href='marketplace/talents.html'" style="width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">Explorer</button>
                    </div>

                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Showcase Manager</h4>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Ma Vitrine Digitale</div>
                        <button onclick="window.location.hash = 'vitrine'" style="width: 100%; padding: 14px; background: #020617; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">Piloter</button>
                    </div>
                </div>

                ${!isAdmin ? `
                <!-- PACK ENTREPRISE -->
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 32px; padding: 48px; box-shadow: 0 20px 50px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px; margin-bottom: 32px;">
                        <div>
                            <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; color: #475569;">OFFRE PREMIUM</span>
                            <h3 style="font-size: 1.8rem; font-weight: 900; color: #020617; margin: 12px 0 0 0;">Pack Business Growth</h3>
                        </div>
                        <div style="text-align: right;">
                             <div style="font-size: 2.5rem; font-weight: 900; color: #020617;">29,00€</div>
                        </div>
                    </div>
                    <button onclick="window.PaymentModule ? window.PaymentModule.openSubModal('growth', 'entreprise') : alert('...')" style="width: 100%; padding: 20px; background: #020617; color: white; border: none; border-radius: 16px; font-size: 1.2rem; font-weight: 900; cursor: pointer;">Payer mon Pack</button>
                </div>
                ` : `
                <!-- 4. ADMIN VALIDATION CENTER (Exclusive for Admin) -->
                <div style="background: white; border: 2px solid #3b82f6; border-radius: 32px; padding: clamp(24px, 5vw, 48px); box-shadow: 0 20px 50px rgba(59, 130, 246, 0.08); margin-bottom: 32px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 24px;">
                        <div>
                            <h3 style="font-size: 1.8rem; font-weight: 950; color: #020617; margin: 0; letter-spacing: -0.04em;">Centre de Validation</h3>
                            <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin-top: 4px;">Modérez et certifiez les projets de l'écosystème.</p>
                        </div>
                        <div id="pending-count-badge" style="background: #eff6ff; color: #3b82f6; padding: 10px 20px; border-radius: 100px; font-weight: 900; font-size: 0.9rem; border: 1.5px solid rgba(59,130,246,0.2);">
                            Chargement...
                        </div>
                    </div>
                    
                    <div id="admin-pending-projects" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
                        <div style="grid-column: 1/-1; padding: 60px; text-align: center; color: #94a3b8; font-weight: 600; background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 24px;">
                            Recherche de projets en attente...
                        </div>
                    </div>
                </div>

                <!-- ADMIN NOTICE -->
                <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 28px; padding: 40px; text-align:center;">
                    <div style="font-size: 2.5rem; margin-bottom:16px;">👑</div>
                    <h3 style="margin:0; font-weight:950; color:#065f46; font-size:1.5rem;">STATUT PRIVILÉGIÉ ACTIF</h3>
                    <p style="color:#047857; font-weight:600;">Vous avez accès à l'intégralité des fonctions Business & Showcase en tant qu'administrateur.</p>
                </div>
                `}
            </div>
        `;

        if (isAdmin) {
            setTimeout(() => CompaniesModule.loadPendingProjects(), 200);
        }
    },

    /**
     * Specialized Fields (Responsive)
     */
    renderProfileFields: (profile) => {
        return `
            <style>
                .profile-grid-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                @media (max-width: 600px) { .profile-grid-fields { grid-template-columns: 1fr !important; } }
            </style>
            <div style="background:#f8fafc; padding:24px; border-radius:20px; border:1px solid #f1f5f9; display:grid; gap:24px;">
                <h3 style="font-size:0.85rem; font-weight:900; color:#10b981; text-transform:uppercase; letter-spacing:0.05em;">D&eacute;tails Institutionnels</h3>
                <div class="profile-grid-fields">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">SIRET</label>
                        <input type="text" id="profile-siret" value="${profile.siret || ''}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Zone / R&eacute;gion</label>
                        <input type="text" id="profile-zone" value="${profile.zone || ''}" placeholder="Ex: Paris, Martinique..." style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                </div>
                <div class="profile-grid-fields">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Ann&eacute;e de Cr&eacute;ation</label>
                        <input type="number" id="profile-creation_year" value="${profile.creation_year || 2025}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Taille d'&eacute;quipe</label>
                        <input type="text" id="profile-team_size" value="${profile.team_size || ''}" placeholder="Ex: Indépendant, 10-50, etc." style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                </div>
                <div class="info-field">
                    <label style="display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8;">Secteur d'Activit&eacute;</label>
                    <input type="text" id="profile-sector" value="${profile.sector || ''}" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                </div>
            </div>
        `;
    },

    /**
     * Business Pilotage - Company Dashboard Hub
     */
    renderBusinessPilotage: async (container, profile, session) => {
        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                <div style="margin-bottom: 32px;">
                    <h1 style="font-weight: 950; color: #020617; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.05em; margin: 0 0 8px 0;">Pilotage d'Activité</h1>
                    <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin: 0;">Gérez vos finances et vos relations prestataires.</p>
                </div>

                <div id="company-business-mount" style="background: white; border-radius: 24px; border: 1px solid #e2e8f0; min-height: 400px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
                    <div style="text-align:center; padding: 40px;">Chargement du centre financier...</div>
                </div>
            </div>
        `;
        
        if (window.BusinessModule) {
            window.BusinessModule.renderDashboard(document.getElementById('company-business-mount'));
        }
    },

    /**
     * Admin Feature: Load all projects awaiting validation/inspection
     */
    async loadPendingProjects() {
        const container = document.getElementById('admin-pending-projects');
        const badge = document.getElementById('pending-count-badge');
        if (!container) return;

        try {
            console.log("[Admin] Fetching pending projects with broadened criteria...");
            // Query for projects that are either 'pending' in status OR not yet approved
            const { data: projects, error } = await window._supabase
                .from('projects')
                .select('*')
                .or('verification_status.eq.pending,is_approved.eq.false')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            // Audit Count (Debug)
            const { count: totalCount } = await window._supabase.from('projects').select('*', { count: 'exact', head: true });
            console.log(`[Admin Audit] Pending found: ${projects?.length || 0}, Total in DB: ${totalCount}`);

            if (badge) badge.textContent = `${projects.length} projet${projects.length > 1 ? 's' : ''} à valider`;

            if (!projects || projects.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1/-1; padding: 60px; text-align: center; color: #94a3b8; font-weight: 600; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 24px;">
                        Aucun projet en attente de validation pour le moment.
                    </div>
                `;
                return;
            }

            container.innerHTML = projects.map(p => `
                <div class="dash-card" style="background:white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; display:flex; flex-direction:column; gap:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                    <div style="display: flex; align-items: start; justify-content: space-between;">
                        <div style="width: 50px; height: 50px; background: #0f172a; color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem;">
                            ${p.title ? p.title.substring(0, 1).toUpperCase() : 'P'}
                        </div>
                        <span style="font-size: 0.7rem; background: #fff7ed; color: #c2410c; padding: 6px 12px; border-radius: 100px; font-weight: 800; border: 1px solid #ffedd5; text-transform: uppercase;">
                            Modération
                        </span>
                    </div>
                    
                    <div>
                        <h4 style="font-size: 1.25rem; font-weight: 900; color: #020617; margin: 0 0 8px 0; letter-spacing: -0.03em;">${p.title}</h4>
                        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            ${p.description || 'Projet soumis sans description détaillée.'}
                        </p>
                    </div>

                    <div style="padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">Soumis le ${new Date(p.created_at).toLocaleDateString()}</span>
                        <button onclick="window.location.hash = 'success-engine?inspect=${p.id}'" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer; transition: 0.2s;">
                            Inspecter
                        </button>
                    </div>
                </div>
            `).join('');

        } catch (err) {
            console.error("[Admin] Execution Error:", err);
            container.innerHTML = `<div style="color: #ef4444; padding: 20px; font-weight:700;">Erreur Fatale : ${err.message}</div>`;
        }
    }
};

window.CompaniesModule = CompaniesModule;
