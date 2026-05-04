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
                        window.isAdminInspection = !!inspectId;
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
                window.location.href = 'marketplace/directory.html';
                break;
            case 'missions':
                window.location.href = 'marketplace/missions.html';
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
        
        const badgeText = isAdmin ? 'ADMINISTRATION' : 'Espace Entreprise';
        const badgeColor = isAdmin ? '#3b82f6' : '#10b981';

        // Hardened Role Checks
        const isPro = ['entreprise', 'expert', 'prestataire', 'admin'].includes(profile.role) || isAdmin;
        const isProjectOwner = ['porteur', 'owner', 'porteurdeprojet'].includes(profile.role);

        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                
                <!-- HEADER -->
                <div style="background: ${isAdmin ? 'linear-gradient(135deg, #020617 0%, #1e293b 100%)' : '#020617'}; border-radius: 24px; padding: clamp(24px, 5vw, 48px); margin-bottom: 32px; color: white; box-shadow: 0 15px 30px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <span style="background: rgba(255,255,255,0.1); border: 1px solid ${badgeColor}; color: ${badgeColor}; padding: 4px 14px; border-radius: 99px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase;">${badgeText}</span>
                            <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; margin: 16px 0 8px 0; letter-spacing:-0.05em;">${profile.company_name || profile.full_name || 'Domtom Connect'}</h1>
                            <p style="color: rgba(255,255,255,0.6); font-size: 1.1rem; font-weight:600; margin: 0;">${isAdmin ? 'Outils de Supervision Institutionnelle' : (isProjectOwner ? 'Centre de pilotage de vos épopées territoriales.' : 'Centre de commandement pour vos talents et missions.')}</p>
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
                    ${isPro ? `
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Gestion Pro</h4>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Business Pilotage</div>
                        <button onclick="window.location.hash = 'business'" style="width: 100%; padding: 14px; background: #f8fafc; color: #020617; border: 1.5px solid #e2e8f0; border-radius: 12px; font-weight: 900; cursor: pointer;">Accéder</button>
                    </div>
                    ` : ''}

                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">${isProjectOwner ? 'Mon Épopée' : 'Talents Hub'}</h4>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #020617; margin-bottom: 24px;">${isProjectOwner ? 'Missions Suite' : 'Annuaire Experts'}</div>
                        <button onclick="window.location.href = '${isProjectOwner ? 'mon-espace.html#success-engine' : 'marketplace/directory.html'}'" style="width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">${isProjectOwner ? 'Piloter' : 'Explorer'}</button>
                    </div>

                    ${isPro ? `
                    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px;">
                        <h4 style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px;">Showcase Manager</h4>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #020617; margin-bottom: 24px;">Ma Vitrine Digitale</div>
                        <button onclick="window.location.hash = 'vitrine'" style="width: 100%; padding: 14px; background: #020617; color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer;">Piloter</button>
                    </div>
                    ` : ''}
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

                <!-- 5. MARKETPLACE CONTROL TOWER (360 View) -->
                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 32px; padding: clamp(24px, 5vw, 48px); margin-bottom: 32px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; flex-wrap: wrap; gap: 24px;">
                        <div>
                            <h2 style="font-size: 2.2rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.05em;">Tour de Contrôle Digitale</h2>
                            <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin-top: 8px;">Supervision globale des transactions et commissions marketplace (5%).</p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <div style="background: #0f172a; color: white; padding: 20px 32px; border-radius: 20px; text-align: center;">
                                <div style="font-size: 0.65rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Volume Global</div>
                                <div id="admin-mkt-total" style="font-size: 1.8rem; font-weight: 950;">0.00€</div>
                            </div>
                            <div style="background: #10b981; color: white; padding: 20px 32px; border-radius: 20px; text-align: center; box-shadow: 0 10px 20px rgba(16,185,129,0.15);">
                                <div style="font-size: 0.65rem; font-weight: 850; color: rgba(255,255,255,0.85); text-transform: uppercase; margin-bottom: 8px;">Commissions (5%)</div>
                                <div id="admin-mkt-comm" style="font-size: 1.8rem; font-weight: 950;">0.00€</div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #f8fafc; border-radius: 24px; border: 1.5px solid #e2e8f0; overflow: hidden;">
                        <div style="display: flex; background: white; border-bottom: 1.5px solid #e2e8f0; flex-wrap: wrap;">
                            <button id="admin-view-trx" onclick="CompaniesModule.switchAdminTab('trx')" style="flex: 1; padding: 16px; border: none; background: none; font-weight: 900; font-size: 0.8rem; cursor: pointer; border-bottom: 3px solid #0f172a; color: #0f172a; min-width: 150px;">FLUX TRANSACTIONS</button>
                            <button id="admin-view-subs" onclick="CompaniesModule.switchAdminTab('subs')" style="flex: 1; padding: 16px; border: none; background: none; font-weight: 800; font-size: 0.8rem; cursor: pointer; color: #94a3b8; min-width: 150px;">ABONNEMENTS ACTIFS</button>
                            <button id="admin-view-payouts" onclick="CompaniesModule.switchAdminTab('payouts')" style="flex: 1; padding: 16px; border: none; background: none; font-weight: 800; font-size: 0.8rem; cursor: pointer; color: #94a3b8; min-width: 150px;">DEMANDES DE RETRAIT 💰</button>
                        </div>
                        <div id="admin-mkt-table-container">
                            <!-- Content injected by switchAdminTab -->
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
            setTimeout(() => {
                CompaniesModule.loadPendingProjects();
                CompaniesModule.loadMarketplaceStats();
            }, 200);
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
            const { data: projects, error } = await window._supabase
                .from('projects')
                .select('*')
                .or('verification_status.eq.pending,is_approved.eq.false')
                .order('created_at', { ascending: false });
            if (error) throw error;
            if (badge) badge.textContent = `${projects.length} projet${projects.length > 1 ? 's' : ''} à valider`;
            if (!projects || projects.length === 0) {
                container.innerHTML = `<div style="grid-column: 1/-1; padding: 60px; text-align: center; color: #94a3b8; font-weight: 600; background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 24px;">Aucun projet en attente.</div>`;
                return;
            }
            container.innerHTML = projects.map(p => `
                <div style="background:white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; display:flex; flex-direction:column; gap:20px;">
                    <div style="display: flex; align-items: start; justify-content: space-between;">
                        <div style="width: 50px; height: 50px; background: #0f172a; color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem;">${p.title?.substring(0, 1).toUpperCase()}</div>
                        <span style="font-size: 0.7rem; background: #fff7ed; color: #c2410c; padding: 6px 12px; border-radius: 100px; font-weight: 800; border: 1px solid #ffedd5; text-transform: uppercase;">Modération</span>
                    </div>
                    <div><h4 style="font-size: 1.25rem; font-weight: 900; color: #020617; margin: 0 0 8px 0;">${p.title}</h4><p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; margin: 0;">${p.description || 'Sans description.'}</p></div>
                    <div style="padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">Soumis le ${new Date(p.created_at).toLocaleDateString()}</span>
                        <button onclick="window.location.hash = 'success-engine?inspect=${p.id}'" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer;">Inspecter</button>
                    </div>
                </div>`).join('');
        } catch (err) { console.error(err); }
    },

    /**
     * Admin Feature: Switch tabs in Control Tower
     */
    async switchAdminTab(view) {
        ['trx', 'subs', 'payouts'].forEach(v => {
            const el = document.getElementById(`admin-view-${v}`);
            if (el) {
                const active = v === view;
                el.style.borderBottom = active ? '3px solid #0f172a' : 'none';
                el.style.color = active ? '#0f172a' : '#94a3b8';
                el.style.fontWeight = active ? '900' : '800';
            }
        });

        const container = document.getElementById('admin-mkt-table-container');
        if (!container) return;

        if (view === 'trx') {
            container.innerHTML = `<table style="width: 100%; border-collapse: collapse; text-align: left;"><thead><tr style="background: white; border-bottom: 2px solid #e2e8f0;"><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Transaction & Date</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Type</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Status Payout</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Montant & Com</th></tr></thead><tbody id="admin-mkt-tbody"></tbody></table>`;
            await this.loadMarketplaceStats();
        } else if (view === 'subs') {
            container.innerHTML = `<table style="width: 100%; border-collapse: collapse; text-align: left;"><thead><tr style="background: white; border-bottom: 2px solid #e2e8f0;"><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Utilisateur & Mail</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Type Profil</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Pack Actif</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Dernier Paiement</th></tr></thead><tbody id="admin-subs-tbody"></tbody></table>`;
            await this.loadSubscriptionStats();
        } else if (view === 'payouts') {
            container.innerHTML = `<table style="width: 100%; border-collapse: collapse; text-align: left;"><thead><tr style="background: white; border-bottom: 2px solid #e2e8f0;"><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Expert</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Montant</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Paypal Email</th><th style="padding: 24px; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Action</th></tr></thead><tbody id="admin-payouts-tbody"></tbody></table>`;
            await this.loadPayoutRequests();
        }
    },

    async loadPayoutRequests() {
        const tbody = document.getElementById('admin-payouts-tbody');
        if (!tbody) return;
        try {
            const { data: payouts, error } = await window._supabase.from('showcase_payouts').select('*, user:profiles(full_name)').order('created_at', { ascending: false });
            if (error) throw error;
            if (!payouts || payouts.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="padding: 40px; text-align: center;">Aucune demande en attente.</td></tr>'; return; }
            tbody.innerHTML = payouts.map(p => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 24px;"><div style="font-weight: 900;">${p.user?.full_name}</div><div style="font-size:0.7rem; color:#64748b;">Le ${new Date(p.created_at).toLocaleDateString()}</div></td>
                    <td style="padding: 24px;"><div style="font-weight: 950; font-size:1.1rem; color:#0f172a;">${p.amount.toFixed(2)}€</div></td>
                    <td style="padding: 24px;"><div style="font-weight: 700; color:#0070ba;">${p.paypal_email}</div></td>
                    <td style="padding: 24px;">
                        ${p.status === 'pending' ? `<button onclick="CompaniesModule.processPayout('${p.id}')" style="background: #10b981; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:900;">MARQUER PAYÉ ✓</button>` : `<span style="color:#64748b; font-weight:800;">Traitée</span>`}
                    </td>
                </tr>`).join('');
        } catch (err) { console.error(err); }
    },

    async processPayout(payoutId) {
        if (!confirm("Marquer ce virement comme effectué (PayPal réalisé) ?")) return;
        try {
            await window._supabase.from('showcase_payouts').update({ status: 'completed', processed_at: new Date().toISOString() }).eq('id', payoutId);
            alert("✓ Statut mis à jour.");
            this.switchAdminTab('payouts');
        } catch (err) { alert(err.message); }
    },

    async loadMarketplaceStats() {
        const tbody = document.getElementById('admin-mkt-tbody');
        const vTotal = document.getElementById('admin-mkt-total');
        const vComm = document.getElementById('admin-mkt-comm');
        if (!tbody) return;
        try {
            const { data: txs, error } = await window._supabase
                .from('platform_transactions')
                .select('*, provider:profiles!provider_id(full_name)')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            if (!txs || txs.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="padding: 40px; text-align: center;">Aucune transaction.</td></tr>'; return; }
            
            let totalVolume = 0; let totalComm = 0;
            tbody.innerHTML = txs.map(t => {
                totalVolume += (t.gross_amount || 0); totalComm += (t.fee_amount || 0);
                const isPending = t.payout_status === 'pending';
                const statusColor = isPending ? '#ea580c' : '#10b981';
                const releaseText = t.payout_release_date ? `<div style="font-size:0.6rem; color:#94a3b8;">Libération le ${new Date(t.payout_release_date).toLocaleDateString()}</div>` : '';
                
                return `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 24px;">
                        <div style="font-weight: 900; font-size: 0.8rem; color: #0f172a;">#${t.id.substring(0, 8)}</div>
                        <div style="font-size: 0.7rem; color: #64748b;">${new Date(t.created_at).toLocaleDateString()}</div>
                    </td>
                    <td style="padding: 24px;">
                        <span style="font-weight: 800; text-transform: uppercase; font-size: 0.7rem; color: #64748b;">${t.type}</span>
                    </td>
                    <td style="padding: 24px;">
                        <div style="color: ${statusColor}; font-weight: 900; font-size: 0.8rem;">${t.payout_status === 'released' ? 'DÉBLOQUÉ' : 'EN ATTENTE'}</div>
                        ${releaseText}
                    </td>
                    <td style="padding: 24px;">
                        <div style="font-weight: 900; color: #020617;">${t.gross_amount.toFixed(2)}€</div>
                        <div style="font-size: 0.7rem; color: #ef4444; font-weight: 900;">Com DTC: ${t.fee_amount.toFixed(2)}€</div>
                    </td>
                </tr>`;
            }).join('');
            
            if (vTotal) vTotal.textContent = `${totalVolume.toFixed(2)}€`;
            if (vComm) vComm.textContent = `${totalComm.toFixed(2)}€`;
        } catch (err) { console.error(err); }
    },

    async loadSubscriptionStats() {
        const tbody = document.getElementById('admin-subs-tbody');
        if (!tbody) return;
        try {
            const { data: subs, error } = await window._supabase.from('profiles').select('*').not('subscription_tier', 'is', null).order('last_payment_date', { ascending: false });
            if (error) throw error;
            if (!subs || subs.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="padding: 40px; text-align: center;">Aucun abonnement actif.</td></tr>'; return; }
            tbody.innerHTML = subs.map(s => {
                const roleBadge = s.role === 'admin' ? '#3b82f6' : (s.role === 'entreprise' ? '#8b5cf6' : (s.role === 'expert' ? '#10b981' : '#64748b'));
                return `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 24px;">
                        <div style="font-weight: 900;">${s.full_name}</div>
                        <div style="font-size:0.7rem; color:#64748b;">${s.email || 'N/A'}</div>
                    </td>
                    <td style="padding: 24px;">
                        <span style="background: ${roleBadge}15; color: ${roleBadge}; padding: 4px 10px; border-radius: 99px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; border: 1px solid ${roleBadge}30;">${s.role || 'SPECTATEUR'}</span>
                    </td>
                    <td style="padding: 24px;">
                        <span style="background: #f0fdf4; color: #10b981; padding: 4px 10px; border-radius: 99px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase;">${s.subscription_tier}</span>
                    </td>
                    <td style="padding: 24px;">${s.last_payment_date ? new Date(s.last_payment_date).toLocaleDateString() : 'N/A'}</td>
                </tr>`;
            }).join('');
        } catch (err) { console.error(err); }
    }
};

window.CompaniesModule = CompaniesModule;
