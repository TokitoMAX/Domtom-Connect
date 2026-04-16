/**
 * Companies Module - Domtom Connect
 * Gestion de l'écosystème Entreprise / Institutionnel
 */
const CompaniesModule = {
    /**
     * Dashboard Rendering Logic - Restauration Marque & Conversion Business
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        const isPremium = window.isPremiumUser(profile);

        container.innerHTML = `
            <div class="dashboard-grid role-entreprise-grid" style="display: grid; gap: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Unified Welcome Card (Company Style) -->
                <div class="dash-card premium-dark" style="grid-column: 1/-1; border-radius: 20px; background: #0f172a; border: 1px solid #1e293b; padding: 40px; position: relative;">
                    <div style="z-index: 2; position: relative;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:16px; letter-spacing:0.04em; text-transform:uppercase;">Espace Entreprise / Institutionnel</span>
                        <h1 style="font-size: 2.25rem; font-weight: 800; color: white; margin: 0 0 12px 0; letter-spacing: -0.04em;">Bonjour, ${profile.company_name || profile.full_name || 'Entreprise'}</h1>
                        <p style="font-size: 1rem; color: #94a3b8; max-width: 600px; line-height:1.6; margin:0;">Déployez votre stratégie territoriale et gérez vos recrutements avec nos outils experts.</p>
                    </div>
                </div>
 
                 <!-- Main Content -->
                <div class="dash-main-col" style="grid-column: span 1; display: grid; gap: 24px;">
                    <!-- Mission Management Quick Access (GATED BY LISTING) -->
                    ${!profile.listed ? `
                    <div class="dash-card highlight" style="background:#fff7ed; border: 1px solid #ffedd5; padding: 32px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.1rem; font-weight:800; color:#9a3412; display:flex; align-items:center; gap:8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                Visibilité Marketplace requise
                            </h4>
                            <p style="font-size: 0.9rem; color: #c2410c; line-height:1.5; margin: 8px 0 0 0;">Pour publier une mission et être contacté, votre compte Entreprise doit être listé dans l'annuaire.</p>
                         </div>
                         <a href="/profile" class="cta-button primary" style="background:#ea580c; border:none; border-radius:12px; font-weight:800; padding:12px 24px; text-decoration:none; color:white;">Activer ma visibilité</a>
                    </div>
                    ` : `
                    <div class="dash-card highlight" style="background:#f0fdf4; border: 1px solid #bbf7d0; padding: 32px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                         <div>
                            <h4 style="margin:0; font-size:1.25rem; font-weight:800; color:#0f172a;">Gestion des Missions Activée</h4>
                            <p style="font-size: 0.95rem; color: #475569; line-height:1.6; margin: 8px 0 0 0;">Publiez vos annonces et trouvez les meilleurs talents de la diaspora et des territoires.</p>
                         </div>
                         <button onclick="window.location.href='/marketplace/jobs'" class="cta-button primary" style="background:#10b981; border:none; border-radius:12px; font-weight:800; padding:14px 28px;">Publier une Mission →</button>
                    </div>
                    `}

                    <!-- Job Pilotage -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0; ${!profile.listed ? 'opacity:0.6; pointer-events:none; filter:grayscale(0.5);' : ''}">
                        <h3 style="font-size: 1.25rem; font-weight: 950; margin-bottom: 20px; color: #0f172a;">Annonces & Missions</h3>
                        <div id="jobs-container-${container.id || 'main'}" class="company-jobs-view-container">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 48px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600;">Vous n'avez aucune annonce active.</p>
                                <button class="cta-button primary" style="background:#10b981; margin-top:16px; border-radius:12px; font-weight:800; padding: 12px 24px; border:none; color:white; cursor:pointer;" onclick="window.location.href='/marketplace/jobs'">Publier un poste</button>
                            </div>
                        </div>
                    </div>
                </div>
 </div>
 
                <!-- Sidebar -->
                <div class="dash-side-col" style="grid-column: span 1; display: flex; flex-direction: column; gap: 24px;">
                    <div class="dash-card" style="border-radius: 16px; padding: 24px; background: white; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 800; margin-bottom: 20px; text-transform:uppercase; color:#64748b; letter-spacing:0.05em;">Performance Entreprise</h4>
                        <div style="display:flex; flex-direction:column; gap:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:0.9rem; color:#64748b; font-weight:600;">Vues profil</span>
                                <span style="font-size:1.1rem; font-weight:800; color:#0f172a;">—</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:0.9rem; color:#64748b; font-weight:600;">Clics Web</span>
                                <span style="font-size:1.1rem; font-weight:800; color:#0f172a;">—</span>
                            </div>
                            <p style="font-size:0.7rem; color:#94a3b8; margin:0; font-style:italic;">Suivi en cours d'activation</p>
                        </div>
                    </div>
 
                    <div class="dash-card" style="border-radius: 16px; padding: 24px; background: white; border: 1px solid #e2e8f0;">
                        <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 12px;">Actions Rapides</div>
                        <a href="/marketplace/jobs" class="cta-button primary" style="background:#0f172a; border:none; border-radius:10px; width:100%; justify-content:center; padding:12px; font-size:0.85rem; margin-bottom:12px; text-decoration:none; color:white; display:flex; align-items:center;">Publier une Mission</a>
                        <a href="/profile" style="display:inline-block; font-size:0.85rem; color:#64748b; font-weight:800; text-decoration:none;">Compléter ma fiche →</a>
                    </div>
                </div>
            </div>
        `;
        
        if (session && session.user && typeof loadMatchmaking === 'function') {
            loadMatchmaking(session.user.id);
        }
        
        // Charger les missions de l'entreprise
        const jobsTarget = document.getElementById(`jobs-container-${container.id || 'main'}`);
        if (session && session.user && jobsTarget) {
            CompaniesModule.loadMyJobs(session.user.id, jobsTarget);
        }
    },

    loadMyJobs: async (companyId, customContainer = null) => {
        const container = customContainer || document.getElementById('company-jobs-view');
        if (!container) return;

        try {
            container.innerHTML = '<p style="text-align:center; color:#64748b;">Chargement de vos missions...</p>';
            
            const { data: jobs, error } = await _supabase
                .from('job_offers')
                .select('*')
                .eq('company_id', companyId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!jobs || jobs.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 48px; border-radius: 20px;">
                        <p style="color: #94a3b8; font-weight: 600;">Vous n'avez aucune annonce active.</p>
                        <button class="cta-button primary" style="background:#10b981; margin-top:16px; border-radius:12px; font-weight:800; padding: 12px 24px; border:none; color:white; cursor:pointer;" onclick="window.location.href='/marketplace/jobs'">Publier un poste</button>
                    </div>
                `;
                return;
            }

            // Unicité des résultats : Certains bugs Supabase ou doubles appels peuvent dupliquer l'affichage visuel
            container.innerHTML = `
                <div style="display: grid; gap: 16px;">
                    ${jobs.map(job => `
                        <div class="dash-card-premium" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid #f1f5f9; border-radius: 16px; background:white;">
                            <div style="flex:1;">
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a;">${job.title}</h4>
                                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #64748b; font-weight: 600;">📍 ${job.territory} • ${job.mission_type}</p>
                            </div>
                            <div style="display: flex; gap: 8px; flex-shrink:0;">
                                <button onclick="editJobOffer('${job.id}')" class="cta-button secondary" style="padding: 8px 12px; font-size: 0.75rem; border-radius: 10px; border: 1px solid #e2e8f0; background:white; cursor:pointer;">Modifier</button>
                                <button onclick="deleteJobOffer('${job.id}')" class="cta-button secondary" style="padding: 8px 12px; font-size: 0.75rem; border-radius: 10px; color: #ef4444; border: 1px solid #fee2e2; background:white; cursor:pointer;">Supprimer</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (err) {
            console.error("Error loading jobs:", err);
            container.innerHTML = `<p style="color:#ef4444; font-size:0.8rem;">Erreur lors du chargement des missions.</p>`;
        }
    },

    /**
     * UI Terminology - Restauration Sobriété Charte
     */
    initUI: () => {
        const labels = {
            'label-name': "Nom du Dirigeant / Contact",
            'label-title': "Poste (ex: CEO, DRH...)",
            'label-bio': "Manifeste de l'entreprise (Pitch)",
            'label-logo': "Logo de l'entreprise"
        };

        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Hide/Show correct fields
        ['tjm-group', 'portfolio-card'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        const showList = ['company-name-group', 'label-written-presentation', 'metrics-row', 'banner-card'];
        showList.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });

        console.log("CompaniesModule: UI Aligned (Brand Style)");
    },
};

// Exporter pour usage global
window.CompaniesModule = CompaniesModule;

// Global Actions for Jobs
window.deleteJobOffer = async (jobId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette mission ? Cette action est irréversible.")) return;

    try {
        const { error } = await _supabase.from('job_offers').delete().eq('id', jobId);
        if (error) throw error;

        Swal.fire({
            icon: 'success',
            title: 'Mission supprimée',
            text: 'L\'offre a été retirée définitivement du marketplace.',
            confirmButtonColor: '#10b981'
        });

        const session = await getSession();
        if (session && session.user && typeof loadMyProjects === 'function') {
            loadMyProjects(session.user.id);
        }

    } catch (err) {
        alert("Erreur: " + err.message);
    }
};

window.editJobOffer = (jobId) => {
    window.location.href = `/marketplace/jobs?edit=${jobId}`;
};
