/**
 * Companies Module - Domtom Connect
 * Gestion de l'écosystème Entreprise / Business
 * Mise à jour : Layout PC Hybrid (8/4) & Logique Quota Missions
 */
const CompaniesModule = {
    /**
     * Module Router - Professional Isolation
     */
    route: async (viewId, container, profile, session) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (viewId) {
            case 'missions':
                window.location.href = '/marketplace/jobs.html';
                break;
            case 'business':
                window.location.href = '/business.html';
                break;
            case 'collaboration':
                const view = document.getElementById('collaboration-view');
                if (view && typeof CollaborationModule !== 'undefined') {
                    view.style.display = 'block';
                    CollaborationModule.renderDashboard(view, null, profile, session);
                }
                break;
            case 'overview':
            default:
                CompaniesModule.renderDashboard(target, null, profile, session);
                break;
        }
    },

    /**
     * Rendu principal du Dashboard Entreprise
     */
    renderDashboard: async (container, additional, profile, session) => {
        if (!container) return;
        if (!session || !session.user) {
            console.warn("CompaniesModule: No session found, waiting...");
            container.innerHTML = '<p style="padding:40px; color:#64748b;">Initialisation de votre cockpit...</p>';
            return;
        }

        const isPremium = window.isPremiumUser(profile);
        const isListed = !!profile.listed;
        const activeId = window.activeBusinessId || session.user.id;

        // Fetch Real-time Stats
        const stats = (typeof window.fetchBusinessStats === 'function') ? await window.fetchBusinessStats(activeId) : { views: 0, applications: 0 };

        container.innerHTML = `
            <div class="dashboard-grid role-entreprise-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Unified Welcome Card (Company Style) -->
                <div class="dash-card premium-dark" style="grid-column: 1 / -1; border-radius: 24px; background: #0f172a; border: 1px solid #1e293b; padding: 48px; position: relative; overflow: hidden;">
                    <div style="z-index: 2; position: relative;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:20px; letter-spacing:0.04em; text-transform:uppercase;">Espace Entreprise / Business</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin: 0 0 16px 0; letter-spacing: -0.04em;">Bonjour, ${profile.company_name || profile.full_name || 'Entreprise'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 700px; line-height:1.6; margin:0;">Déployez votre stratégie territoriale et pilotez vos recrutements experts.</p>
                    </div>
                </div>
 
                 <!-- Main Content Column -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 32px;">
                    
                    <!-- Phase Transition: Visibility (1) or Collaboration (2) -->
                    ${!isListed ? `
                     <div class="dash-card highlight" style="background:#fff7ed; border: 1px solid #ffedd5; padding: 32px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center;">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.1rem; font-weight:850; color:#9a3412;">Étape 1 : Visibilité Marketplace requise</h4>
                            <p style="font-size: 0.95rem; color: #c2410c; line-height:1.5; margin: 12px 0 0 0;">Publiez votre profil pour pouvoir diffuser vos missions sur le réseau Domtom Connect.</p>
                         </div>
                         <a href="/profile" class="cta-button primary" style="background:#ea580c; border:none; border-radius:12px; font-weight:800; padding:14px 28px; text-decoration:none; color:white;">Activer ma visibilité</a>
                    </div>
                    ` : `
                    <div class="dash-card highlight" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; padding: 32px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; color: white; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.25);">
                         <div style="flex:1;">
                            <h4 style="margin:0; font-size:1.25rem; font-weight:950; color: white;">Étape 2 : Collaboration Stratégique</h4>
                            <p style="font-size: 0.95rem; color: rgba(255,255,255,0.9); line-height:1.5; margin: 8px 0 0 0;">Bravo, votre profil est certifié et visible ! Activez votre partenariat stratégique pour débloquer toute la puissance du réseau.</p>
                         </div>
                         <button onclick="showView('collaboration')" class="cta-button" style="background:white; color:#059669; border:none; border-radius:14px; font-weight:900; padding:16px 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor:pointer;">Lancer la Collaboration</button>
                    </div>
                    `}

                    <!-- Section Pilotage des Missions -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; background: white; border: 1px solid #e2e8f0; ${!isListed ? 'opacity:0.6; pointer-events:none; filter:grayscale(0.5);' : ''}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 950; margin:0; color: #0f172a;">Annonces & Missions</h3>
                                <p id="mission-status-label" style="font-size:0.8rem; color:#64748b; font-weight:700; margin-top:4px;">Quota : Chargement...</p>
                            </div>
                            <button id="main-job-btn" onclick="window.location.href='/marketplace/jobs.html'" class="cta-button primary" style="background:#10b981; border:none; border-radius:12px; font-weight:800; padding:16px 32px;">Publier une Mission</button>
                        </div>
                        
                        <div id="jobs-container-${container.id || 'main'}" class="company-jobs-view-container">
                            <p style="text-align:center; padding:40px; color:#94a3b8;">Récupération de vos offres...</p>
                        </div>
                    </div>

                    <!-- Gestion de l'Équipe -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; background: white; border: 1px solid #e2e8f0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <h3 style="font-size: 1.5rem; font-weight: 950; margin:0; color: #0f172a;">Gestion de l'équipe</h3>
                            <span style="font-size:0.7rem; background:#f1f5f9; padding:4px 10px; border-radius:100px; color:#64748b; font-weight:800; text-transform:uppercase; letter-spacing:0.04em;">Multicompte Beta</span>
                        </div>
                        <p style="font-size:0.95rem; color:#64748b; margin-bottom:32px;">Autorisez vos collaborateurs à gérer vos offres via leur propre profil Domtom Connect.</p>
                        
                        <div id="collaborators-list-${container.id || 'main'}" style="margin-bottom:32px;">
                            <!-- Dynamically loaded -->
                        </div>

                        <div style="background:#f8fafc; border-radius:20px; padding:24px; border: 1px dashed #e2e8f0;">
                            <p style="font-size:0.85rem; font-weight:850; color:#0f172a; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.04em;">Inviter par email</p>
                            <div style="display:flex; gap:12px;">
                                <input type="email" id="collab-email-input" placeholder="email@exemple.com" style="flex:1; padding:14px; border-radius:12px; border:1px solid #e2e8f0; font-size:1rem; font-weight:600;">
                                <button onclick="CompaniesModule.addCollaborator()" class="cta-button primary" style="background:#0f172a; border:none; border-radius:12px; padding:0 24px; color:white; font-weight:800;">Ajouter</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Column -->
                <div class="dash-side-col" style="grid-column: span 4; display: flex; flex-direction: column; gap: 32px;">
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.04em;">Performance Profile</h4>
                        <div style="display:grid; gap:20px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:0.95rem; color:#64748b; font-weight:600;">Vues Totales</span>
                                <span style="font-size:1.25rem; font-weight:900; color:#0f172a;">${stats.views || 0}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:0.95rem; color:#64748b; font-weight:600;">Candidatures</span>
                                <span style="font-size:1.25rem; font-weight:900; color:#0f172a;">${stats.applications || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <div style="font-size: 0.8rem; font-weight: 850; color: #64748b; text-transform: uppercase; margin-bottom: 24px;">Raccourcis</div>
                        <div style="display:grid; gap:12px;">
                            <a href="/profile" class="cta-button primary" style="background:#0f172a; border:none; border-radius:12px; width:100%; justify-content:center; padding:16px; font-size:0.95rem; text-decoration:none; color:white; display:flex;">Modifier ma fiche</a>
                            <a href="/messages" style="display:flex; align-items:center; justify-content:center; font-size:0.85rem; color:#64748b; font-weight:800; text-decoration:none; padding:12px; border:1px solid #e2e8f0; border-radius:12px; background:white;">Centre de messagerie</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // --- DATA LOADING ---
        // Missions
        const jobsTarget = document.getElementById(`jobs-container-${container.id || 'main'}`);
        if (jobsTarget) {
            CompaniesModule.loadMyJobs(activeId, jobsTarget, isPremium);
        }

        // Équipe (Seulement propriétaire)
        const teamTarget = document.getElementById(`collaborators-list-${container.id || 'main'}`);
        if (teamTarget) {
            if (window.activeBusinessId && window.activeBusinessId !== session.user.id) {
                const teamCard = teamTarget.closest('.dash-card');
                if (teamCard) teamCard.style.display = 'none';
            } else {
                CompaniesModule.loadCollaborators(session.user.id, teamTarget);
            }
        }
    },

    /**
     * Chargement et gestion des missions avec Quota
     */
    loadMyJobs: async (id, container, isPremium) => {
        try {
            const { data: jobs, error } = await _supabase
                .from('job_offers')
                .select('*')
                .eq('company_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Mise à jour de l'UI Quota
            const quotaLabel = document.getElementById('mission-status-label');
            const addBtn = document.getElementById('main-job-btn');
            
            if (quotaLabel) {
                const count = jobs ? jobs.length : 0;
                if (isPremium) {
                    quotaLabel.innerHTML = `Missions actives : <strong style="color:#10b981;">${count} / Illimité</strong>`;
                } else {
                    quotaLabel.innerHTML = `Missions actives : <strong style="${count >= 1 ? 'color:#f59e0b' : 'color:#10b981'}">${count} / 1</strong> (Pack Business requis pour plus)`;
                    if (count >= 1 && addBtn) {
                        addBtn.disabled = true;
                        addBtn.style.opacity = '0.5';
                        addBtn.style.cursor = 'not-allowed';
                        addBtn.title = "Quota gratuit atteint (1 mission)";
                        addBtn.onclick = () => Swal.fire({
                            title: 'Quota Atteint',
                            text: 'Vous avez déjà 1 mission active. Passez au pack Business pour des publications illimitées.',
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'Découvrir le Pack Business',
                            confirmButtonColor: '#0f172a'
                        }).then((res) => { if(res.isConfirmed) openSubModal(); });
                    }
                }
            }

            if (!jobs || jobs.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 40px; border-radius: 20px;">
                        <p style="color: #94a3b8; font-weight: 600;">Aucune mission active.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div style="display: grid; gap: 16px;">
                    ${jobs.map(job => `
                        <div class="dash-card-premium" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid #f1f5f9; border-radius: 16px; background:#fcfcfc;">
                            <div>
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a;">${job.title}</h4>
                                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #64748b; font-weight: 600;">${job.territory} • ${job.mission_type}</p>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="editJobOffer('${job.id}')" style="padding: 8px 12px; font-size: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; background:white; cursor:pointer; font-weight:700;">Modifier</button>
                                <button onclick="deleteJobOffer('${job.id}')" style="padding: 8px 12px; font-size: 0.75rem; border-radius: 8px; color: #ef4444; border: 1px solid #fee2e2; background:white; cursor:pointer; font-weight:700;">Supprimer</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (err) {
            container.innerHTML = `<p style="color:#ef4444;">Erreur chargement missions.</p>`;
        }
    },

    /**
     * Chargement de l'équipe (Collaborateurs)
     */
    loadCollaborators: async (ownerId, container) => {
        try {
            const { data: collab, error } = await _supabase
                .from('collaborators')
                .select('*')
                .eq('owner_id', ownerId);

            if (error) throw error;

            if (!collab || collab.length === 0) {
                container.innerHTML = '<p style="font-size:0.85rem; color:#94a3b8; font-style:italic;">Aucun collaborateur pour le moment.</p>';
                return;
            }

            container.innerHTML = `
                <div style="display:grid; gap:12px;">
                    ${collab.map(c => {
                        const isPending = c.status === 'pending';
                        const inviteLink = `${window.location.origin}/mon-espace?invite=${c.id}`;
                        
                        return `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:16px; border-radius:12px; border:1px solid #f1f5f9; position:relative;">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div style="position:relative;">
                                    <div style="width:40px; height:40px; background:${isPending ? '#f59e0b' : '#0f172a'}; color:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.9rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        ${c.collaborator_email.charAt(0).toUpperCase()}
                                    </div>
                                    <span style="position:absolute; bottom:-2px; right:-2px; width:12px; height:12px; background:${isPending ? '#f59e0b' : '#10b981'}; border:2px solid white; border-radius:50%;" title="${isPending ? 'En attente' : 'Actif'}"></span>
                                </div>
                                <div>
                                    <p style="margin:0; font-size:0.9rem; font-weight:800; color:#0f172a;">${c.collaborator_email}</p>
                                    <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                                        <p style="margin:0; font-size:0.7rem; color:#64748b; text-transform:uppercase; font-weight:700;">${c.role || 'Éditeur'}</p>
                                        ${isPending ? 
                                            `<span style="font-size:0.6rem; background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:4px; font-weight:800; letter-spacing:0.02em;">INVITATION ENVOYÉE</span>` : 
                                            `<span style="font-size:0.6rem; background:#dcfce7; color:#166534; padding:2px 8px; border-radius:4px; font-weight:800; letter-spacing:0.02em;">ACTIF</span>`
                                        }
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex; gap:8px;">
                                ${isPending ? `
                                    <button onclick="CompaniesModule.shareInvite('${inviteLink}', '${c.collaborator_email}')" style="background:#0f172a; border:none; color:white; padding:8px 14px; border-radius:10px; font-size:0.7rem; font-weight:800; cursor:pointer; transition:0.2s;">Relancer</button>
                                ` : ''}
                                <button onclick="CompaniesModule.removeCollaborator('${c.id}')" style="background:rgba(239, 68, 68, 0.05); border:none; color:#ef4444; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Retirer de l'équipe">×</button>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            `;
        } catch (err) {
            container.innerHTML = '<p style="color:#ef4444;">Erreur équipe.</p>';
        }
    },

    shareInvite: (link, email) => {
        if (navigator.share) {
            navigator.share({
                title: 'Invitation Domtom Connect',
                text: `Rejoignez l'équipe Soloprice sur Domtom Connect pour piloter nos missions.`,
                url: link
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(link).then(() => {
                Swal.fire({ icon: 'success', title: 'Lien copié !', text: `Envoyez-le par WhatsApp ou Mail.` });
            });
        }
    },

    addCollaborator: async () => {
        const input = document.getElementById('collab-email-input');
        const email = input ? input.value.trim() : '';
        if (!email || !email.includes('@')) return alert("Email invalide.");

        try {
            const session = (typeof getSession === 'function') ? await getSession() : null;
            if (!session) return;

            const { data, error } = await _supabase
                .from('collaborators')
                .insert([{ 
                    owner_id: session.user.id, 
                    collaborator_email: email,
                    status: 'pending'
                }])
                .select();

            if (error) throw error;

            const inviteLink = `${window.location.origin}/mon-espace?invite=${data[0].id}`;

            Swal.fire({ 
                icon: 'success', 
                title: 'Invitation prête', 
                text: `L'accès pour ${email} est configuré. Partagez-lui le lien d'invitation !`, 
                confirmButtonColor: '#10b981',
                showCancelButton: true,
                confirmButtonText: 'Partager le lien',
                cancelButtonText: 'Plus tard'
            }).then((res) => {
                if (res.isConfirmed) CompaniesModule.shareInvite(inviteLink, email);
                location.reload(); 
            });
            input.value = '';
        } catch (err) { alert("Erreur lors de l'ajout."); }
    },

    removeCollaborator: async (id) => {
        if (!confirm("Retirer ?")) return;
        await _supabase.from('collaborators').delete().eq('id', id);
        location.reload();
    },

    initUI: () => {
        const labels = {
            'label-name': "Référent Stratégique",
            'label-company': "Nom de l'Entité",
            'label-title': "Fonction exercée",
            'label-bio': "Pitch de l'entreprise",
            'label-logo': "Logo Institutionnel"
        };
        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });
    }
};

window.CompaniesModule = CompaniesModule;

// Actions globales
window.deleteJobOffer = async (id) => {
    if (!confirm("Supprimer cette mission ?")) return;
    await _supabase.from('job_offers').delete().eq('id', id);
    location.reload();
};

window.editJobOffer = (id) => {
    window.location.href = `/marketplace/jobs?edit=${id}`;
};
