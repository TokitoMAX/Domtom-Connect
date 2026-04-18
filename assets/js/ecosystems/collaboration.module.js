/**
 * Collaboration Module - Domtom Connect
 * Le "Hub Équipe" : Espace de travail partagé (V2)
 * Pour une expérience type Trello / Slack
 */
const CollaborationModule = {
    /**
     * Rendu du Hub Équipe
     */
    renderDashboard: async (container, additional, profile, session) => {
        if (!container) return;
        
        const activeBusinessId = window.activeBusinessId || session.user.id;
        const isOwner = activeBusinessId === session.user.id;

        // Fetch shared data
        const stats = await window.fetchBusinessStats(activeBusinessId);
        
        container.innerHTML = `
            <div class="collaboration-hub" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Collaborative Header -->
                <div style="background: #0f172a; border-radius: 24px; padding: 40px; margin-bottom: 32px; color: white; position: relative; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
                    <div style="position:relative; z-index:2;">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                            <span style="background:#10b981; width:12px; height:12px; border-radius:50%; display:inline-block; box-shadow: 0 0 10px #10b981;"></span>
                            <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8;">Workspace Actif : ${profile.company_name || 'Domtom Connect'}</span>
                        </div>
                        <h1 style="font-size: 2.25rem; font-weight: 900; margin: 0 0 8px 0; letter-spacing:-0.03em;">Espace de Collaboration</h1>
                        <p style="color: #94a3b8; font-size: 1.1rem; margin:0;">Pilotez vos missions et votre stratégie en équipe en temps réel.</p>
                    </div>
                    <!-- Decorative element -->
                    <div style="position:absolute; top:-50px; right:-50px; width:200px; height:200px; background:rgba(16, 185, 129, 0.05); border-radius:50%; filter:blur(40px);"></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px;">
                    
                    <!-- Left: Shared Missions & Tasks (Trello Style) -->
                    <div style="grid-column: span 8; display: grid; gap: 32px;">
                        
                        <!-- BOARD : MISSIONS PARTAGÉES -->
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; min-height: 400px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                                <h3 style="font-size: 1.25rem; font-weight: 850; color: #0f172a; margin: 0;">📋 Nos Missions Actives</h3>
                                <button onclick="window.location.href='#missions'" style="background:#f1f5f9; border:none; padding:8px 16px; border-radius:8px; font-weight:800; font-size:0.8rem; cursor:pointer;">Voir tout</button>
                            </div>
                            
                            <div id="hub-shared-jobs" style="display: grid; gap: 16px;">
                                <p style="text-align:center; padding:40px; color:#94a3b8; font-style:italic;">Chargement de la vision partagée...</p>
                            </div>
                        </div>

                        <!-- TEAM ACTIVITY FEED -->
                        <div class="dash-card" style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                            <h3 style="font-size: 1.25rem; font-weight: 850; color: #0f172a; margin: 0 0 24px 0;">⚡ Activité de l'équipe</h3>
                            <div id="hub-activity-feed" style="display: grid; gap: 20px;">
                                <div style="display:flex; gap:16px; align-items:flex-start;">
                                    <div style="width:32px; height:32px; background:#10b981; border-radius:50%; flex-shrink:0;"></div>
                                    <div>
                                        <p style="margin:0; font-size:0.9rem; font-weight:700; color:#0f172a;">Le cockpit a été mis à jour.</p>
                                        <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b;">Il y a quelques instants</p>
                                    </div>
                                </div>
                                <div style="display:flex; gap:16px; align-items:flex-start; opacity:0.6;">
                                    <div style="width:32px; height:32px; background:#e2e8f0; border-radius:50%; flex-shrink:0;"></div>
                                    <div>
                                        <p style="margin:0; font-size:0.9rem; font-weight:700; color:#0f172a;">Invitation acceptée par un nouveau collaborateur.</p>
                                        <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b;">Aujourd'hui, 09:42</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Members & Shortcuts -->
                    <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 32px;">
                        
                        <!-- ONLINE MEMBERS -->
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                            <h4 style="font-size: 0.8rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.04em;">Membres de l'Équipe</h4>
                            <div id="hub-members-list" style="display: grid; gap: 16px;">
                                <!-- Will be loaded via loadCollaborators logic -->
                            </div>
                        </div>

                        <!-- COLLABORATIVE TOOLS -->
                        <div class="dash-card" style="background: #0f172a; border-radius: 20px; padding: 32px; border: none; color: white;">
                            <h4 style="font-size: 0.8rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#94a3b8; letter-spacing:0.04em;">Outils de Collaboration</h4>
                            <div style="display:grid; gap:12px;">
                                <a href="/messages" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:white; font-weight:700; font-size:0.95rem; background:rgba(255,255,255,0.05); padding:16px; border-radius:12px;">
                                    <span>💬</span> Salon de discussion
                                </a>
                                <a href="#missions" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:white; font-weight:700; font-size:0.95rem; background:rgba(255,255,255,0.05); padding:16px; border-radius:12px;">
                                    <span>📊</span> Pilotage des Missions
                                </a>
                            </div>
                        </div>

                        ${isOwner ? `
                        <!-- ADMIN SHORTCUT -->
                        <div style="background:#fef3c7; border: 1px solid #fde68a; padding:24px; border-radius:16px;">
                            <p style="margin:0; font-size:0.85rem; color:#b45309; font-weight:700;">Vous êtes le Propriétaire.</p>
                            <p style="margin:4px 0 0 0; font-size:0.75rem; color:#d97706;">Gérez les accès de votre équipe dans le cockpit principal.</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // --- SUB-LOADERS ---
        const jobsTarget = document.getElementById('hub-shared-jobs');
        if (jobsTarget && typeof CompaniesModule !== 'undefined') {
            // We reuse the CompaniesModule jobs loader but adapted for the hub
            CompaniesModule.loadMyJobs(activeBusinessId, jobsTarget, true);
        }

        const membersTarget = document.getElementById('hub-members-list');
        if (membersTarget && typeof CompaniesModule !== 'undefined') {
            CompaniesModule.loadCollaborators(activeBusinessId, membersTarget);
        }
    }
};

window.CollaborationModule = CollaborationModule;
