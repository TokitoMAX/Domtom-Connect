/**
 * Domtom Connect - Spectator Ecosystem Module
 * Espace pour les utilisateurs classiques (Observateurs)
 */
const SpectatorsModule = {
    role: 'spectator',

    /**
     * Dashboard Rendering - Focus Events & Networking
     */
    renderDashboard: async (container, additional, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid role-spectator-grid" style="display: grid; gap: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Unified Welcome Card (Spectator Style) -->
                <div class="dash-card premium-dark" style="grid-column: 1/-1; border-radius: 20px; background: #0f172a; border: 1px solid #1e293b; padding: 40px; position: relative; overflow: hidden;">
                    <div style="z-index: 2; position: relative;">
                        <span style="display:inline-block; background:rgba(255, 255, 255, 0.1); color:white; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:16px; letter-spacing:0.04em; text-transform:uppercase;">Espace Observateur</span>
                        <h1 style="font-size: 2.25rem; font-weight: 800; color: white; margin: 0 0 12px 0; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                        <p style="font-size: 1rem; color: #94a3b8; max-width: 600px; line-height:1.6; margin:0;">Bienvenue au cÅ“ur de l'écosystème. Suivez les événements et découvrez les acteurs qui façonnent l'avenir des territoires.</p>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    <!-- Events Section -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <h3 style="font-size: 1.3rem; font-weight: 800; margin:0; color:#0f172a;">Agenda des Evenements</h3>
                            <a href="/marketplace/evenements" style="font-size:0.85rem; color:#10b981; font-weight:800; text-decoration:none;">Tout voir ?</a>
                        </div>
                        <div id="spectator-events-list">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 40px; border-radius: 16px;">
                                <p style="color: #94a3b8; font-weight: 600;">Chargement des prochains meetups...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Discovery Feed -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 1.15rem; font-weight: 800; margin:0 0 24px 0; color:#0f172a; text-transform:uppercase; letter-spacing:0.02em;">Exploration du Reseau</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                            <div onclick="window.location.href='marketplace/directory.html'" style="background:white; padding:24px; border-radius:16px; border:1px solid #e2e8f0; cursor:pointer; transition:0.3s; position:relative; overflow:hidden;" class="spectator-discovery-card">
                                <div style="width:40px; height:40px; border-radius:10px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-10a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <h4 style="margin:0; font-weight:800; font-size:0.95rem; color:#1e293b;">Annuaire des Talents</h4>
                                <p style="margin:6px 0 0; font-size:0.75rem; color:#64748b; line-height:1.4;">Accedez aux experts et prestataires certifies.</p>
                            </div>
                            <div onclick="window.location.href='/marketplace/companies'" style="background:white; padding:24px; border-radius:16px; border:1px solid #e2e8f0; cursor:pointer; transition:0.3s; position:relative; overflow:hidden;" class="spectator-discovery-card">
                                <div style="width:40px; height:40px; border-radius:10px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>
                                </div>
                                <h4 style="margin:0; font-weight:800; font-size:0.95rem; color:#1e293b;">Ecosysteme Entreprises</h4>
                                <p style="margin:6px 0 0; font-size:0.75rem; color:#64748b; line-height:1.4;">Decouvrez les entreprises et partenaires du territoire.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="dash-side-col" style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
                    <div class="dash-card" style="border-radius: 20px; padding: 24px; background: white; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 850; color:#64748b; text-transform:uppercase; margin-bottom:16px;">Le Hub</h4>
                        <p style="font-size:0.85rem; color:#64748b; line-height:1.6; margin-bottom:20px;">Vous n'avez pas encore été invité dans un espace collaboratif.</p>
                        <button onclick="showView('collaboration')" class="cta-button secondary" style="width:100%; border:1px solid #e2e8f0; font-size:0.85rem; height:44px;">Acceder au Hub Partagé</button>
                    </div>

                    <div class="dash-card" style="border-radius: 20px; padding: 24px; background: #0f172a; color:white; border:none;">
                        <h4 style="font-size: 0.8rem; font-weight: 850; color:rgba(255,255,255,0.6); text-transform:uppercase; margin-bottom:16px;">Devenir Actif</h4>
                        <p style="font-size:0.85rem; color:rgba(255,255,255,0.8); line-height:1.6; margin-bottom:20px;">Vous voulez proposer vos services ou lancer un projet ?</p>
                        <a href="/profile" class="cta-button primary" style="width:100%; text-align:center; background:#10b981; border:none; display:flex; align-items:center; justify-content:center; text-decoration:none; color:white; font-size:0.85rem; height:44px; border-radius:10px;">Changer de role</a>
                    </div>
                </div>
            </div>
        `;

        // Load specific content (events)
        SpectatorsModule.loadEvents(document.getElementById('spectator-events-list'));
    },

    loadEvents: async (container) => {
        try {
            const { data: events, error } = await _supabase
                .from('events')
                .select('*')
                .order('start_date', { ascending: true })
                .limit(3);

            if (error || !events || events.length === 0) {
                container.innerHTML = `
                    <div style="padding:20px; text-align:center; color:#94a3b8; font-size:0.9rem;">
                        Pas d'événements prévus prochainement.
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div style="display:grid; gap:12px;">
                    ${events.map(ev => `
                        <div class="event-mini-card" style="display:flex; gap:16px; align-items:center; padding:16px; border-radius:12px; border:1px solid #f1f5f9; background:#ffffff;">
                            <div style="width:40px; height:40px; background:#f0fdf4; color:#10b981; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem; flex-shrink:0;">
                                ${new Date(ev.start_date).getDate()}
                            </div>
                            <div style="flex:1;">
                                <h4 style="margin:0; font-size:0.9rem; font-weight:800; color:#0f172a;">${ev.title}</h4>
                                <p style="margin:2px 0 0; font-size:0.75rem; color:#64748b;">${ev.territory || 'Network'} "¢ ${new Date(ev.start_date).toLocaleDateString()}</p>
                            </div>
                            <a href="/marketplace/evenements" style="color:#cbd5e1;"><i class="fas fa-chevron-right"></i></a>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (e) {
            container.innerHTML = '<p style="color:red; font-size:0.8rem;">Erreur de chargement des événements.</p>';
        }
    }
};

window.SpectatorsModule = SpectatorsModule;
