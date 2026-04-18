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
                    ${!(!!profile.listed) ? `
                     <div class="dash-card highlight" style="background:#fff7ed; border: 1px solid #ffedd5; padding: 32px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.1rem; font-weight:800; color:#9a3412; display:flex; align-items:center; gap:8px;">
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
                         <button onclick="window.location.href='/marketplace/jobs'" class="cta-button primary" style="background:#10b981; border:none; border-radius:12px; font-weight:800; padding:14px 28px;">Publier une Mission</button>
                    </div>
                    `}

                    <!-- Job Pilotage -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0; ${!(!!profile.listed) ? 'opacity:0.6; pointer-events:none; filter:grayscale(0.5);' : ''}">
                        <h3 style="font-size: 1.25rem; font-weight: 950; margin-bottom: 20px; color: #0f172a;">Annonces & Missions</h3>
                        <div id="jobs-container-${container.id || 'main'}" class="company-jobs-view-container">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 48px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600;">Vous n'avez aucune annonce active.</p>
                                <button class="cta-button primary" style="background:#10b981; margin-top:16px; border-radius:12px; font-weight:800; padding: 12px 24px; border:none; color:white; cursor:pointer;" onclick="window.location.href='/marketplace/jobs'">Publier un poste</button>
                            </div>
                        </div>
                    </div>

                    <!-- Team Management Section -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0; margin-top:24px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                            <h3 style="font-size: 1.25rem; font-weight: 950; margin:0; color: #0f172a;">Gestion de l'équipe</h3>
                            <span style="font-size:0.75rem; background:#f1f5f9; padding:4px 10px; border-radius:20px; color:#64748b; font-weight:700;">BETA</span>
                        </div>
                        <p style="font-size:0.9rem; color:#64748b; margin-bottom:24px;">Autorisez d'autres comptes Domtom Connect à gérer vos offres et événements.</p>
                        
                        <div id="collaborators-list-${container.id || 'main'}" style="margin-bottom:24px;">
                            <!-- Dynamically loaded -->
                            <p style="font-size:0.85rem; color:#94a3b8; font-style:italic;">Chargement de l'équipe...</p>
                        </div>

                        <div style="background:#f8fafc; border-radius:16px; padding:20px; border: 1px dashed #e2e8f0;">
                            <p style="font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:12px;">Ajouter un collaborateur</p>
                            <div style="display:flex; gap:10px;">
                                <input type="email" id="collab-email-input" placeholder="email@exemple.com" style="flex:1; padding:12px; border-radius:10px; border:1px solid #e2e8f0; font-size:0.9rem;">
                                <button onclick="CompaniesModule.addCollaborator()" class="cta-button primary" style="background:#0f172a; border:none; border-radius:10px; padding:0 20px; color:white; font-weight:700;">Inviter</button>
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
                        ${profile.listed ? `
                        <a href="/marketplace/jobs" class="cta-button primary" style="background:#0f172a; border:none; border-radius:10px; width:100%; justify-content:center; padding:12px; font-size:0.85rem; margin-bottom:12px; text-decoration:none; color:white; display:flex; align-items:center;">Publier une Mission</a>
                        ` : `
                        <button disabled class="cta-button primary" style="background:#94a3b8; border:none; border-radius:10px; width:100%; justify-content:center; padding:12px; font-size:0.85rem; margin-bottom:12px; cursor:not-allowed; opacity:0.7;">Publier une Mission (Inactif)</button>
                        `}
                        <a href="/profile" style="display:inline-block; font-size:0.85rem; color:#64748b; font-weight:800; text-decoration:none;">Compléter ma fiche</a>
                    </div>
                </div>
            </div>
        `;
        
        if (session && session.user && typeof loadMatchmaking === 'function') {
            loadMatchmaking(session.user.id);
        }
        
        // Charger les missions de l'entreprise (ou de l'entreprise gérée)
        const jobsTarget = document.getElementById(`jobs-container-${container.id || 'main'}`);
        if (session && session.user && jobsTarget) {
            CompaniesModule.loadMyJobs(window.activeBusinessId || session.user.id, jobsTarget);
        }

        // Charger l'équipe (Seulement pour le propriétaire réel)
        const teamTarget = document.getElementById(`collaborators-list-${container.id || 'main'}`);
        const teamCard = teamTarget ? teamTarget.closest('.dash-card') : null;
        
        if (session && session.user && teamTarget) {
            if (window.activeBusinessId && window.activeBusinessId !== session.user.id) {
                // On est en mode collaborateur : on cache la gestion d'équipe
                if (teamCard) teamCard.style.display = 'none';
            } else {
                CompaniesModule.loadCollaborators(session.user.id, teamTarget);
            }
        }
    },

    loadCollaborators: async (ownerId, container) => {
        if (!container) return;
        try {
            const { data: collab, error } = await _supabase
                .from('collaborators')
                .select('*')
                .eq('owner_id', ownerId);

            if (error) throw error;

            if (!collab || collab.length === 0) {
                container.innerHTML = '<p style="font-size:0.85rem; color:#94a3b8; font-style:italic;">Aucun collaborateur ajouté pour le moment.</p>';
                return;
            }

            container.innerHTML = `
                <div style="display:grid; gap:10px;">
                    ${collab.map(c => `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:12px 16px; border-radius:10px; border:1px solid #f1f5f9;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:32px; height:32px; background:#e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#64748b; font-weight:800; font-size:0.8rem;">
                                    ${c.collaborator_email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style="margin:0; font-size:0.85rem; font-weight:800; color:#0f172a;">${c.collaborator_email}</p>
                                    <p style="margin:0; font-size:0.7rem; color:#64748b; text-transform:uppercase; font-weight:700;">${c.role || 'Éditeur'}</p>
                                </div>
                            </div>
                            <button onclick="CompaniesModule.removeCollaborator('${c.id}')" style="background:none; border:none; color:#ef4444; font-size:0.75rem; font-weight:800; cursor:pointer; padding:4px;">Retirer</button>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (err) {
            console.error("Team Load Error:", err);
            container.innerHTML = '<p style="font-size:0.8rem; color:#ef4444;">Erreur chargement équipe.</p>';
        }
    },

    addCollaborator: async () => {
        const input = document.getElementById('collab-email-input');
        const email = input ? input.value.trim() : '';
        if (!email || !email.includes('@')) return alert("Veuillez saisir un email valide.");

        try {
            const session = await getSession();
            if (!session) return;

            const { error } = await _supabase.from('collaborators').insert([
                { owner_id: session.user.id, collaborator_email: email }
            ]);

            if (error) throw error;

            Swal.fire({ icon: 'success', title: 'Collaborateur ajouté', text: `L'accès a été partagé avec ${email}`, confirmButtonColor: '#10b981' });
            input.value = '';
            
            // Reload list
            const dashContainer = document.querySelector('.role-entreprise-grid').parentElement;
            const teamTarget = document.querySelector('[id^="collaborators-list-"]');
            if (teamTarget) CompaniesModule.loadCollaborators(session.user.id, teamTarget);

        } catch (err) {
            alert("Erreur lors de l'ajout: " + (err.message || "Permissions insuffisantes"));
        }
    },

    removeCollaborator: async (collabId) => {
        if (!confirm("Retirer cet accès ?")) return;
        try {
            const { error } = await _supabase.from('collaborators').delete().eq('id', collabId);
            if (error) throw error;
            
            const session = await getSession();
            const teamTarget = document.querySelector('[id^="collaborators-list-"]');
            if (teamTarget && session) CompaniesModule.loadCollaborators(session.user.id, teamTarget);
        } catch (err) { alert("Erreur suppression: " + err.message); }
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
                                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #64748b; font-weight: 600;">${job.territory} • ${job.mission_type}</p>
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
            'label-name': "Nom du Gérant / Contact",
            'label-company': "Raison Sociale / Nom Commercial",
            'label-title': "Poste (ex: CEO, DRH, Fondateur...)",
            'label-bio': "Manifeste de l'entreprise (Pitch)",
            'label-logo': "Logo de l'entreprise (Vectoriel ou HD)"
        };

        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        console.log("CompaniesModule: Terminology Refined (Brand Style)");
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
