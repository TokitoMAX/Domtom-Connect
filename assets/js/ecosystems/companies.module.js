/**
 * Companies Module - Domtom Connect
 * Restoration: Premium Business HUD & Mobile Harmonization
 */
const CompaniesModule = {
    role: 'entreprise',

    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        
        switch (viewId) {
            case 'profile':
                if (window.StandardModule) {
                    window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'missions':
                window.location.href = 'marketplace/jobs.html';
                break;
            case 'business':
                const bizView = document.getElementById('business-view');
                if (bizView && window.BusinessModule) {
                    bizView.style.display = 'block';
                    window.BusinessModule.renderDashboard(bizView);
                }
                break;
            case 'collaboration':
                if (window.CollaborationModule) {
                    await window.CollaborationModule.route('overview', target, profile, session, params);
                }
                break;
            case 'overview':
            default:
                CompaniesModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Business Overview (Mobile Harmonized)
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Strategic Progression Hub (Step 1 -> Step 2) -->
                <div class="dash-card-progression" style="grid-column: 1 / -1; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #3b82f6;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 850; color: #0f172a;">Parcours de Succ&egrave;s</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">${profile.listed ? '&Eacute;tape 1 : Vitrine Publique ✅' : '&Eacute;tape 1 : Vitrine Publique ⏳'}</p>
                            </div>
                        </div>
                        <div style="flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; position: relative; margin: 0 40px; min-width: 100px;">
                            <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${profile.listed ? '50%' : '10%'}; background: #3b82f6; border-radius: 2px;"></div>
                            <div style="position: absolute; left: 50%; top: -6px; width: 16px; height: 16px; border-radius: 50%; border: 4px solid white; background: ${profile.subscription_tier !== 'free' ? '#3b82f6' : '#e2e8f0'}; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="text-align: right;">
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">&Eacute;tape 2 : Partenariat Certifi&eacute;</h4>
                                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">${profile.subscription_tier !== 'free' ? 'Pack Activ&eacute;' : 'Activez vos outils de croissance'}</p>
                            </div>
                            <button onclick="window.PaymentModule.openSubModal('authority', 'entreprise', window.App.state.profile)" class="cta-button" style="padding: 10px 20px; border-radius: 10px; background: ${profile.subscription_tier !== 'free' ? '#f1f5f9' : '#0f172a'}; color: ${profile.subscription_tier !== 'free' ? '#64748b' : 'white'}; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                ${profile.subscription_tier !== 'free' ? 'G&eacute;rer le Statut' : 'Activer l\'&Eacute;tape 2 →'}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="dash-welcome-card" style="background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%); margin-bottom: 24px;">
                    <div style="z-index: 2; position: relative;">
                        <span class="role-badge" style="background: rgba(255, 255, 255, 0.1); color: #fff; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">ESPACE ENTREPRISE / BUSINESS</span>
                        <h1 style="text-transform: capitalize;">Bonjour, ${profile.company_name || profile.full_name || 'Entreprise'}</h1>
                        <p>D&eacute;ployez votre strat&eacute;gie territoriale et pilotez vos talents experts.</p>
                    </div>
                </div>

                <!-- MAIN COMMAND CENTER (Vertical Stacking for Mobile) -->
                <div class="dash-main-col" style="grid-column: 1 / -1; display: grid; gap: 24px;">
                    
                    <!-- STRATEGIC PARTNERSHIP CARDS -->
                    <div class="dash-card-highlight" style="background: #ffffff; border: 2px solid #10b981; padding-bottom: 32px;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.8rem; font-weight:950; color:#0f172a; letter-spacing:-0.03em;">Partenariat Strat&eacute;gique</h4>
                            <p style="font-size: 1.1rem; color: #64748b; line-height:1.6; margin: 12px 0 24px 0; max-width:480px;">Activez votre collaboration de second niveau pour d&eacute;bloquer le matchmaking avanc&eacute; et le recrutement expert.</p>
                         </div>
                         <button onclick="window.Router.navigate('#collaboration')" class="cta-button primary" style="background:#10b981; color:white; border:none; border-radius:18px; font-weight:950; padding:18px 36px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2); width: fit-content;">Lancer le Hub de Recrutement →</button>
                    </div>

                    <!-- MISSION CENTER -->
                    <div class="dash-card" style="border-radius:24px; padding:32px; background: white; border: 1px solid #e2e8f0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap: wrap; gap:16px;">
                            <div>
                                <h3 style="font-size: 1.6rem; font-weight: 900; margin:0; color: #0f172a; letter-spacing:-0.03em;">Annonces & Missions</h3>
                                <p id="mission-status-label" style="font-size:0.9rem; color:#64748b; font-weight:700; margin-top:4px;">Synchronisation des opportunit&eacute;s...</p>
                            </div>
                            <button onclick="window.location.href='marketplace/jobs.html'" class="cta-button primary" style="background:#0f172a; border-radius:14px; font-weight:900; padding:14px 28px;">+ Publier</button>
                        </div>
                        <div id="company-jobs-container" style="display:grid; gap:16px;">
                            <div style="text-align: center; padding: 40px; border-radius: 20px; background:#f8fafc; border:2px dashed #e2e8f0;">
                                <div class="dash-loader-spinner" style="width:24px; height:24px; border:3px solid #f1f5f9; border-top-color:#10b981; border-radius:50%; animation: spin 1s linear infinite; margin:0 auto 12px auto;"></div>
                                <p style="color: #64748b; font-weight: 800; font-size: 0.85rem;">Chargement de vos missions...</p>
                            </div>
                        </div>
                    </div>

                    <!-- PERFORMANCE & TEAM (Merged into vertical flow) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                        <div class="dash-card" style="padding:28px; border:1px solid #e2e8f0; background: white;">
                            <h4 style="font-size: 0.75rem; font-weight: 850; margin-bottom: 20px; text-transform:uppercase; color:#64748b; letter-spacing:0.04em;">Performance Impact</h4>
                            <div style="display:grid; gap:16px;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-size:0.95rem; color:#64748b; font-weight:600;">Vues du Profil</span>
                                    <span class="views-count-live" style="font-size:1.4rem; font-weight:900; color:#0f172a;">${profile.views_count || 0}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-size:0.95rem; color:#64748b; font-weight:600;">Applications</span>
                                    <span id="company-apps-count" style="font-size:1.4rem; font-weight:900; color:#3b82f6;">-</span>
                                </div>
                            </div>
                        </div>

                        <div class="dash-card" style="padding:28px; background: #f8fafc; border: 1px solid #e2e8f0;">
                             <h4 style="font-size: 0.75rem; font-weight: 850; color:#64748b; text-transform:uppercase; margin-bottom:20px;">Gestion &Eacute;quipe</h4>
                             <p style="font-size:0.85rem; color:#64748b; line-height:1.5; margin-bottom:20px;">Autorisez des collaborateurs &agrave; g&eacute;rer vos missions territoriales.</p>
                             <button onclick="window.Router.navigate('#profile?tab=team')" style="width:100%; padding:12px; background:white; border:1px solid #e2e8f0; border-radius:10px; color:#0f172a; font-weight:800; cursor:pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">G&eacute;rer l'&eacute;quipe</button>
                        </div>
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
                    <button onclick="window.location.href='/marketplace/jobs?edit=${job.id}'" style="background:white; border:1px solid #e2e8f0; padding:8px 16px; border-radius:8px; font-weight:800; font-size:0.75rem; cursor:pointer;">&Eacute;diter</button>
                </div>
            `).join('');
        } catch (err) { console.error(err); }
    }
};

window.CompaniesModule = CompaniesModule;
