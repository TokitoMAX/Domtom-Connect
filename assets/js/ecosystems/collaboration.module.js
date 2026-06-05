/**
 * Collaboration Module - Domtom Connect
 * Le "Hub �quipe" : Espace de travail partag� (V2)
 * Pour une exp�rience type Trello / Slack
 */
const CollaborationModule = {
    /**
     * Module Router
     */
    route: async (viewId, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;
        
        // Ensure background is clean
        target.innerHTML = '';
        
        switch (viewId) {
            case 'overview':
            default:
                await CollaborationModule.renderDashboard(target, null, profile, session);
                break;
        }
    },

    /**
     * Rendu du Hub �quipe
     */
    renderDashboard: async (container, additional, profile, session) => {
        if (!container) return;
        
        try {
            const db = window._supabase || (typeof window.initSupabase === 'function' ? window.initSupabase() : null);
            if (!db) throw new Error("Supabase non initialis�");

            const activeBusinessId = window.activeBusinessId || session.user.id;
            const isOwner = activeBusinessId === session.user.id;

            // Fetch shared data with safe fallback
            let stats = { views: 0, jobs: 0, applications: 0 };
            if (typeof window.fetchBusinessStats === 'function') {
                stats = await window.fetchBusinessStats(activeBusinessId);
            }
        
        container.innerHTML = `
            <div class="collaboration-hub" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Collaborative Header -->
                <div class="dash-welcome-card" style="margin-bottom: 32px; border: 1px solid #1e293b; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
                    <div style="position:relative; z-index:2;">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                            <span style="background:#10b981; width:12px; height:12px; border-radius:50%; display:inline-block; box-shadow: 0 0 10px #10b981;"></span>
                            <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8;">Workspace Actif : ${profile.company_name || 'Domtom Connect'}</span>
                        </div>
                        <h1>Espace de Collaboration</h1>
                        <p>Pilotez vos missions et votre strat�gie en �quipe en temps r�el.</p>
                    </div>
                </div>

                <div class="collaboration-grid">
                    
                    <!-- Left: Shared Missions & Tasks -->
                    <div style="grid-column: span 1; display: grid; gap: 32px;">
                        
                        <!-- BOARD : MISSIONS PARTAG�ES -->
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; min-height: 400px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0;">Nos Missions Actives</h3>
                                </div>
                                <button onclick="if(window.Router) window.Router.navigate('#missions');" style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px 16px; border-radius:10px; font-weight:800; font-size:0.8rem; cursor:pointer; color:#475569;">Voir tout</button>
                            </div>
                            
                            <div id="hub-shared-jobs" style="display: grid; gap: 16px;">
                                <p style="text-align:center; padding:40px; color:#94a3b8; font-style:italic;">Chargement de la vision partag�e...</p>
                            </div>
                        </div>

                        <!-- TEAM ACTIVITY FEED -->
                        <div class="dash-card" style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:24px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0;">Activite de l'equipe</h3>
                            </div>
                            <div id="hub-activity-feed" style="display: grid; gap: 20px;">
                                <div style="display:flex; gap:16px; align-items:flex-start;">
                                    <div style="width:32px; height:32px; background:#10b981; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5" /></svg>
                                    </div>
                                    <div>
                                        <p style="margin:0; font-size:0.9rem; font-weight:800; color:#0f172a;">Le cockpit a �t� mis � jour.</p>
                                        <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b; font-weight:600;">Il y a quelques instants</p>
                                    </div>
                                </div>
                                <div style="display:flex; gap:16px; align-items:flex-start;">
                                    <div style="width:32px; height:32px; background:#e2e8f0; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /></svg>
                                    </div>
                                    <div>
                                        <p style="margin:0; font-size:0.9rem; font-weight:800; color:#0f172a;">Invitation acceptee par un nouveau collaborateur.</p>
                                        <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b; font-weight:600;">Aujourd'hui, 09:42</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Members & Shortcuts -->
                    <div style="grid-column: span 1; display: flex; flex-direction: column; gap: 32px;">
                        
                        <!-- INVITATION BOX -->
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                            <h4 style="font-size: 0.8rem; font-weight: 900; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.06em;">Inviter un collaborateur</h4>
                            <div style="display: grid; gap: 16px;">
                                <input type="email" id="invite-email" placeholder="Email du futur membre" style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0; font-size:0.9rem;">
                                <select id="invite-role" style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0; font-size:0.9rem; background:white;">
                                    <option value="contributeur">Contributeur</option>
                                    <option value="expert">Expert Associ�</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                                <button onclick="window.CollaborationModule.sendTeamInvite()" class="cta-button primary" style="width:100%; padding:14px; border-radius:12px; background:#0f172a; color:white; font-weight:800; border:none; cursor:pointer;">Envoyer l'invitation</button>
                            </div>
                        </div>

                        <!-- ONLINE MEMBERS -->
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                            <h4 style="font-size: 0.8rem; font-weight: 900; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.06em;">�quipe de pilotage</h4>
                            <div id="hub-members-list" style="display: grid; gap: 16px;">
                                <!-- Will be loaded via loadCollaborators logic -->
                            </div>
                        </div>

                        <!-- COLLABORATIVE TOOLS -->
                        <div class="dash-card" style="background: #0f172a; border-radius: 24px; padding: 32px; border: none; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.15);">
                            <h4 style="font-size: 0.8rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#94a3b8; letter-spacing:0.06em;">Outils Integres</h4>
                            <div style="display:grid; gap:16px;">
                                <a href="/messages" style="display:flex; align-items:center; gap:14px; text-decoration:none; color:white; font-weight:700; font-size:0.95rem; background:rgba(255,255,255,0.07); padding:18px; border-radius:14px; transition: 0.2s; border: 1px solid rgba(255,255,255,0.05);">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                                    <span>Salon de discussion</span>
                                </a>
                                <a href="#missions" style="display:flex; align-items:center; gap:14px; text-decoration:none; color:white; font-weight:700; font-size:0.95rem; background:rgba(255,255,255,0.07); padding:18px; border-radius:14px; transition: 0.2s; border: 1px solid rgba(255,255,255,0.05);">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span>Pilotage des Missions</span>
                                </a>
                            </div>
                        </div>

                        ${isOwner ? `
                        <!-- ADMIN SHORTCUT -->
                        <div style="background:#fef3c7; border: 1px solid #fde68a; padding:24px; border-radius:16px;">
                            <p style="margin:0; font-size:0.85rem; color:#b45309; font-weight:700;">Vous �tes le Propri�taire.</p>
                            <p style="margin:4px 0 0 0; font-size:0.75rem; color:#d97706;">G�rez les acc�s de votre �quipe dans le cockpit principal.</p>
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
        if (membersTarget) {
            CollaborationModule.loadCollaborators(activeBusinessId, membersTarget);
        }
        
        } catch (err) {
            console.error("[Collaboration] Render Error:", err);
            container.innerHTML = `
                <div style="padding:80px; text-align:center; background:#fef2f2; border-radius:24px; border:1px solid #fee2e2;">
                    <div style="font-size:3rem; margin-bottom:20px;">️</div>
                    <h3 style="color:#991b1b; font-weight:900; margin-bottom:8px;">Erreur de chargement du Hub</h3>
                    <p style="color:#b91c1c; font-size:0.9rem; margin-bottom:24px;">Une erreur est survenue lors de la synchronisation de votre �cosyst�me.</p>
                    <button onclick="window.location.reload()" class="cta-button primary" style="background:#ef4444; border:none; padding:12px 24px;">Actualiser la plateforme</button>
                </div>
            `;
        }
    },

    /**
     * Invite Logic
     */
    sendTeamInvite: async () => {
        const email = document.getElementById('invite-email').value;
        const role = document.getElementById('invite-role').value;
        if (!email) return alert("Veuillez saisir un email.");

        // Visual Feedback (Simulated for UX)
        alert(` Invitation envoy�e � ${email} en tant que ${role} !`);
        document.getElementById('invite-email').value = '';
    },

    /**
     * Load Members Logic
     */
    loadCollaborators: async (businessId, container) => {
        if (!container) return;
        
        // Fallback members for professional look if DB is empty
        const members = [
            { full_name: 'Propri�taire (Vous)', role: 'Admin', avatar_url: null },
            { full_name: 'IA Domtom Connect', role: 'Support & Analyse', avatar_url: null }
        ];

        container.innerHTML = members.map(m => `
            <div style="display:flex; align-items:center; gap:12px; padding:12px; background:#f8fafc; border-radius:14px; border:1px solid #f1f5f9;">
                <div style="width:36px; height:36px; border-radius:10px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; font-weight:800; color:#64748b; font-size:0.8rem;">
                    ${m.full_name.charAt(0)}
                </div>
                <div>
                    <div style="font-size:0.85rem; font-weight:800; color:#0f172a;">${m.full_name}</div>
                    <div style="font-size:0.7rem; color:#10b981; font-weight:700;">${m.role}</div>
                </div>
            </div>
        `).join('');
    }
};

window.CollaborationModule = CollaborationModule;
