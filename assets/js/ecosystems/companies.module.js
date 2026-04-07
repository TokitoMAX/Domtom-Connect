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
            <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card -->
                <div class="dash-card premium-dark" style="grid-column: span 12; padding: 48px; border-radius: 20px; background: #0f172a; border: 1px solid #1e293b;">
                    <div style="position: relative; z-index: 2;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Espace Entreprise</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.company_name || 'Entreprise'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; font-weight: 500; line-height:1.6;">Déployez votre stratégie et gérez vos recrutements sur tout le territoire.</p>
                    </div>
                </div>

                <!-- Main Content -->
                <div style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    ${isPremium ? `
                        <!-- CAS : PREMIUM -> CALENDLY STRATÉGIE -->
                        <div class="dash-card highlight" style="background:#f0fdf4; border: 1px solid #bbf7d0; padding: 32px; border-radius: 20px;">
                             <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
                                <div style="width:40px; height:40px; background:#10b981; color:white; border-radius:12px; display:flex; align-items:center; justify-content:center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </div>
                                <h4 style="margin:0; font-size:1.25rem; font-weight:800; color:#0f172a;">Pack Business Actif</h4>
                             </div>
                             <p style="font-size: 0.95rem; color: #475569; line-height:1.6; margin-bottom:24px;">Votre entreprise bénéficie d'une visibilité premium. Réservez votre briefing stratégique pour optimiser vos recrutements.</p>
                             <a href="https://calendly.com/domtomconnect/30min" target="_blank" class="cta-button primary" style="background:#10b981; border:none; border-radius:12px; justify-content:center; text-decoration:none; font-weight:800; padding:14px 28px;">Planifier mon Briefing</a>
                        </div>
                    ` : `
                        <!-- CAS : GRATUIT -> PACK BUSINESS (STYLE PREMIUM) -->
                        <div class="dash-card" style="background:#ffffff; border: 2px solid #10b981; border-radius:24px; padding:40px; position:relative; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.08);">
                             <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #047857; color: white; padding: 6px 20px; border-radius: 100px; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.05em;">PLUS POPULAIRE</div>
                             
                             <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:32px;">
                                <div style="flex:1; min-width:300px;">
                                    <span style="background: rgba(16, 185, 129, 0.1); color: #047857; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; text-transform:uppercase;">Visibilité & Contenu</span>
                                    <h3 style="font-size: 1.75rem; font-weight: 800; margin:16px 0 8px; color:#111827;">Pack Business</h3>
                                    <div style="font-size: 2.2rem; font-weight: 800; margin-bottom: 24px; color:#111827;">29€ <span style="font-size: 1rem; font-weight: 500; color: #6b7280;">/ mois</span></div>
                                    
                                    <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; display:grid; gap:12px;">
                                        <li style="font-size: 0.9rem; color: #4b5563; display:flex; align-items:center; gap:12px; font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Visibilité Annuaire (Mise en avant)</li>
                                        <li style="font-size: 0.9rem; color: #4b5563; display:flex; align-items:center; gap:12px; font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Publication de missions illimitées</li>
                                        <li style="font-size: 0.9rem; color: #4b5563; display:flex; align-items:center; gap:12px; font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> 1 Podcast Corporate dédié</li>
                                        <li style="font-size: 0.9rem; color: #4b5563; display:flex; align-items:center; gap:12px; font-weight:600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> 2-3 Contenus réseaux sociaux / mois</li>
                                    </ul>
                                </div>
                                <div style="width:280px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:32px; text-align:center;">
                                    <div id="paypal-button-container-business" style="min-height:150px;"></div>
                                    <p style="font-size:0.75rem; color:#64748b; margin-top:16px; font-weight:600;">Paiement sécurisé via PayPal</p>
                                </div>
                            </div>
                        </div>
                    `}

                    <!-- Job Pilotage -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 1.25rem; font-weight: 950; margin-bottom: 20px; color: #0f172a;">Annonces & Missions</h3>
                        <div id="company-jobs-view">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 48px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600;">Vous n'avez aucune annonce active.</p>
                                <button class="cta-button primary" style="background:#10b981; margin-top:16px; border-radius:12px; font-weight:800; padding: 12px 24px; border:none; color:white; cursor:pointer;" onclick="window.location.href='/marketplace/jobs'">Publier un poste</button>
                            </div>
                        </div>
                    </div>
                </div>
 
                <!-- Sidebar -->
                <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
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
        
        // Initialiser PayPal si nécessaire
        if (!isPremium) {
            setTimeout(() => {
                if (typeof renderPayPalButton === 'function') {
                    renderPayPalButton('P-6JG84131PK915684CNG3VDSQ', 'business', 'paypal-button-container-business');
                }
            }, 600);
        }

        if (typeof loadMatchmaking === 'function') loadMatchmaking(session.user.id);
        
        // Charger les missions de l'entreprise
        CompaniesModule.loadMyJobs(session.user.id);
    },

    loadMyJobs: async (companyId) => {
        const container = document.getElementById('company-jobs-view');
        if (!container) return;

        try {
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

            container.innerHTML = `
                <div style="display: grid; gap: 16px;">
                    ${jobs.map(job => `
                        <div class="dash-card-premium" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid #f1f5f9; border-radius: 16px;">
                            <div>
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a;">${job.title}</h4>
                                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #64748b; font-weight: 600;">📍 ${job.territory} • ${job.mission_type}</p>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="editJobOffer('${job.id}')" class="cta-button secondary" style="padding: 8px 12px; font-size: 0.75rem; border-radius: 8px;">Modifier</button>
                                <button onclick="deleteJobOffer('${job.id}')" class="cta-button secondary" style="padding: 8px 12px; font-size: 0.75rem; border-radius: 8px; color: #ef4444; border-color: #fee2e2;">Supprimer</button>
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
        if (session) CompaniesModule.loadMyJobs(session.user.id);

    } catch (err) {
        alert("Erreur: " + err.message);
    }
};

window.editJobOffer = (jobId) => {
    window.location.href = `/marketplace/jobs?edit=${jobId}`;
};
