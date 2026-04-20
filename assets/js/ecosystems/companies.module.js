/**
 * Companies Module - Domtom Connect
 * Restoration: Premium Business HUD & Quota Management
 */
const CompaniesModule = {
    role: 'entreprise',

    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        
        switch (viewId) {
            case 'missions':
                window.location.href = '/marketplace/jobs';
                break;
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView && window.BusinessModule) {
                    bizView.style.display = 'block';
                    window.BusinessModule.renderDashboard(bizView);
                }
                break;
            case 'collaboration':
                const collabView = document.getElementById('collaboration-view');
                if (collabView && window.CollaborationModule) {
                    collabView.style.display = 'block';
                    window.CollaborationModule.renderDashboard(collabView, null, profile, session);
                }
                break;
            case 'overview':
            default:
                CompaniesModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Business Overview
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid" style="display: grid; gap: 32px;">
                
                <!-- Unified Welcome Card (Company Premium) -->
                <div class="dash-card premium-dark" style="grid-column: 1 / -1; border-radius: 24px; padding: 48px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background:#3b82f6; color:white; border:none;">ESPACE ENTREPRISE / BUSINESS</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin: 12px 0 16px 0;">Bonjour, ${profile.company_name || profile.full_name || 'Entreprise'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 700px; line-height:1.6; margin:0;">Déployez votre stratégie territoriale et pilotez vos talents experts.</p>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER -->
                <div class="dash-main-col" style="grid-column: span 8; display:grid; gap:32px;">
                    
                    <!-- PARTNERSHIP COMMAND -->
                    <div class="dash-card highlight" style="padding:48px; border-radius:32px; background: #0f172a; color:white; border:none; box-shadow: 0 40px 80px rgba(0,0,0,0.1); position:relative; overflow:hidden;">
                         <div style="display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2;">
                            <div style="flex:1;">
                                <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#10b981; letter-spacing:-0.03em;">Partenariat Stratégique</h4>
                                <p style="font-size: 1.1rem; color: #94a3b8; line-height:1.6; margin: 12px 0 0 0; max-width:480px;">Activez votre collaboration de second niveau pour débloquer le matchmaking avancé et le recrutement expert.</p>
                            </div>
                            <button onclick="window.Router.navigate('/dashboard/collaboration')" class="cta-button primary" style="background:#10b981; color:white; border:none; border-radius:18px; font-weight:950; padding:20px 40px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);">Lancer le Hub</button>
                         </div>
                         <div style="position:absolute; top:-20px; right:-20px; width:140px; height:140px; background:rgba(16, 185, 129, 0.05); border-radius:50%; filter:blur(40px);"></div>
                    </div>

                    <!-- MISSION CENTER -->
                    <div class="dash-card" style="border-radius:32px; padding:48px; background: white; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                            <div>
                                <h3 style="font-size: 1.8rem; font-weight: 950; margin:0; color: #0f172a; letter-spacing:-0.03em;">Annonces & Missions</h3>
                                <p id="mission-status-label" style="font-size:0.95rem; color:#64748b; font-weight:700; margin-top:8px;">Synchronisation des opportunités...</p>
                            </div>
                            <button onclick="window.location.href='/marketplace/jobs'" class="cta-button primary" style="background:#0f172a; border-radius:16px; font-weight:900; padding:18px 32px;">+ Publier</button>
                        </div>
                        <div id="company-jobs-container" style="display:grid; gap:20px;">
                            <div style="text-align: center; padding: 60px; border-radius: 24px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                <div class="dash-loader-spinner" style="width:32px; height:32px; border:3px solid #f1f5f9; border-top-color:#10b981; border-radius:50%; animation: spin 1s linear infinite; margin:0 auto 16px auto;"></div>
                                <p style="color: #64748b; font-weight: 800; font-size: 0.95rem;">Chargement de vos missions...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SIDEBAR TOOLS -->
                <div class="dash-side-col" style="grid-column: span 4; display:grid; gap:32px;">
                    <div class="dash-card" style="padding:32px; border:1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.04em;">Performance</h4>
                        <div style="display:grid; gap:20px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:1rem; color:#64748b; font-weight:600;">Vues Profil</span>
                                <span class="views-count-live" style="font-size:1.3rem; font-weight:900; color:#0f172a;">${profile.views_count || 0}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:1rem; color:#64748b; font-weight:600;">Applications</span>
                                <span id="company-apps-count" style="font-size:1.3rem; font-weight:900; color:#3b82f6;">—</span>
                            </div>
                        </div>
                    </div>

                    <div class="dash-card" style="padding:32px; background:#f8fafc; border:1px solid #e2e8f0;">
                         <h4 style="font-size: 0.8rem; font-weight: 850; color:#64748b; text-transform:uppercase; margin-bottom:24px;">Gestion Équipe</h4>
                         <p style="font-size:0.9rem; color:#64748b; line-height:1.5; margin-bottom:24px;">Autorisez des collaborateurs à gérer vos missions territoriales.</p>
                         <button onclick="window.Router.navigate('/dashboard/collaboration')" style="width:100%; padding:14px; background:white; border:1px solid #e2e8f0; border-radius:12px; color:#0f172a; font-weight:800; cursor:pointer;">Gérer l'équipe</button>
                    </div>
                </div>
            </div>
        `;

        // Load specific data
        if (typeof CompaniesModule.loadMyJobs === 'function') {
            CompaniesModule.loadMyJobs(session.user.id, document.getElementById('company-jobs-container'));
        }

        // Live Stats Update
        if (typeof window.fetchBusinessStats === 'function') {
            window.fetchBusinessStats(session.user.id).then(stats => {
                const viewsEl = container.querySelector('.views-count-live');
                if (viewsEl) viewsEl.textContent = stats.views;
                
                const appsEl = document.getElementById('company-apps-count');
                if (appsEl) appsEl.textContent = stats.applications;
            });
        }
    },

    loadMyJobs: async (companyId, container) => {
        if (!container) return;
        const db = window._supabase;
        try {
            const { data: jobs } = await db.from('job_offers').select('*').eq('company_id', companyId).order('created_at', { ascending: false });
            
            const label = document.getElementById('mission-status-label');
            if (label) label.textContent = `Missions actives : ${jobs ? jobs.length : 0}`;

            if (!jobs || jobs.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:40px; border:2px dashed #f1f5f9; border-radius:20px; color:#94a3b8;">Aucune mission active.</div>`;
                return;
            }

            container.innerHTML = jobs.map(job => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#fcfcfc; border:1px solid #f1f5f9; padding:20px; border-radius:16px;">
                    <div>
                        <div style="font-weight:800; color:#0f172a;">${job.title}</div>
                        <div style="font-size:0.8rem; color:#64748b; font-weight:700; margin-top:4px;">📍 ${job.territory}</div>
                    </div>
                    <button onclick="window.location.href='/marketplace/jobs?edit=${job.id}'" style="background:white; border:1px solid #e2e8f0; padding:8px 16px; border-radius:8px; font-weight:800; font-size:0.75rem; cursor:pointer;">Éditer</button>
                </div>
            `).join('');
        } catch (err) { console.error(err); }
    }
};

window.CompaniesModule = CompaniesModule;
