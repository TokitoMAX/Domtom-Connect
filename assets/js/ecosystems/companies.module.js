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

                <!-- MAIN WORKSPACE -->
                <div class="dash-main-col" style="grid-column: span 8; display:grid; gap:32px;">
                    
                    <!-- Collaboration CTA -->
                    <div class="dash-card highlight" style="padding:40px; border-radius:24px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border:none;">
                         <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="flex:1;">
                                <h4 style="margin:0; font-size:1.4rem; font-weight:900; color:#10b981;">Partenariat Stratégique</h4>
                                <p style="font-size: 1rem; color: #94a3b8; line-height:1.5; margin: 12px 0 0 0;">Activez votre collaboration de second niveau pour débloquer le matchmaking avancé.</p>
                            </div>
                            <button onclick="window.Router.navigate('/dashboard/collaboration')" class="cta-button" style="background:#10b981; color:white; border:none; border-radius:12px; font-weight:900; padding:16px 32px; cursor:pointer;">Lancer</button>
                         </div>
                    </div>

                    <!-- Mission Management -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; background: white; border: 1px solid #e2e8f0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                            <div>
                                <h3 style="font-size: 1.6rem; font-weight: 950; margin:0; color: #0f172a;">Annonces & Missions</h3>
                                <p id="mission-status-label" style="font-size:0.85rem; color:#64748b; font-weight:700; margin-top:8px;">Vérification des quotas...</p>
                            </div>
                            <button onclick="window.location.href='/marketplace/jobs'" class="cta-button primary" style="background:#10b981; border:none; border-radius:12px; font-weight:800; padding:16px 32px;">+ Publier</button>
                        </div>
                        <div id="company-jobs-container" style="display:grid; gap:16px;">
                            <!-- Injected -->
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
                                <span style="font-size:1.3rem; font-weight:900; color:#0f172a;">—</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:1rem; color:#64748b; font-weight:600;">Candidatures</span>
                                <span style="font-size:1.3rem; font-weight:900; color:#0f172a;">—</span>
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
