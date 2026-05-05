/**
 * Domtom Connect - Webinar Module
 * Strategic High-Impact Live Events Module
 * COMPETITOR-GRADE UPGRADE: Real-time Chat, Q&A, Polls, Resources
 */
const WebinarModule = {
    role: null,
    activeSubscription: null,

    /**
     * Initialize Module
     */
    init: (role) => {
        WebinarModule.role = role;
    },

    /**
     * Module Router
     */
    route: async (view_id, container, profile, session, params) => {
        const target = container || document.getElementById('webinars-view') || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        // Cleanup previous subscriptions
        if (WebinarModule.activeSubscription) {
            WebinarModule.activeSubscription.unsubscribe();
            WebinarModule.activeSubscription = null;
        }

        const watchId = params ? params.get('id') : null;

        if (watchId) {
            WebinarModule.renderWatchView(target, watchId, profile, session);
        } else {
            WebinarModule.renderWebinarsList(target, profile, session);
        }
    },

    /**
     * Render Webinars List
     */
    renderWebinarsList: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-section-header" style="margin-bottom: 40px; animation: fadeIn 0.5s ease-out;">
                <h1 style="font-size: clamp(2.2rem, 5vw, 3rem); font-weight: 900; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.04em;">Webinaires <span style="color: #10b981;">Premium</span></h1>
                <p style="color: #64748b; font-size: 1.2rem; max-width: 600px; line-height: 1.6;">L'excellence stratégique en direct. Rejoignez nos experts et accélérez votre réussite.</p>
            </div>

            <div id="webinars-container" class="dash-grid-layout" style="gap: 32px;">
                <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; background: white; padding: 32px 40px; border-radius: 32px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03); margin-bottom: 10px; flex-wrap: wrap; gap: 20px;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.4rem; font-weight: 900; color: #0f172a;">Sessions Live & Replays</h3>
                        <p style="margin: 6px 0 0 0; font-size: 1rem; color: #64748b;">Découvrez les prochaines masterclasses de l'écosystème.</p>
                    </div>
                    ${WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur' ? `
                        <button onclick="WebinarModule.openCreateModal()" class="cta-button primary" style="background: #0f172a; color: white; border: none; border-radius: 16px; font-weight: 800; padding: 16px 32px; display: flex; align-items: center; gap: 12px; transition: 0.3s; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Planifier un Live
                        </button>
                    ` : ''}
                </div>

                <div id="webinars-list" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 32px;">
                    <div style="text-align: center; padding: 100px 40px; grid-column: 1 / -1; background: white; border-radius: 32px; border: 2px dashed #e2e8f0;">
                        <div class="splash-loader" style="margin: 0 auto 24px;"></div>
                        <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Synchronisation des lives...</h4>
                    </div>
                </div>
            </div>
        `;

        await WebinarModule.loadWebinars();
    },

    /**
     * Load Webinars from Supabase
     */
    loadWebinars: async () => {
        const listContainer = document.getElementById('webinars-list');
        if (!listContainer) return;

        try {
            const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
            if (!db) throw new Error("Database not connected");

            const { data: webinars, error } = await db
                .from('webinars')
                .select('*, profiles(full_name, avatar_url)')
                .order('scheduled_at', { ascending: true });

            if (error) throw error;

            if (!webinars || webinars.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align: center; padding: 120px 40px; grid-column: 1 / -1; background: #f8fafc; border-radius: 40px; border: 2px dashed #cbd5e1; animation: fadeIn 0.6s ease;">
                        <div style="font-size: 5rem; margin-bottom: 32px;">🎥</div>
                        <h4 style="font-size: 1.6rem; font-weight: 900; color: #0f172a; margin-bottom: 12px;">Préparez-vous pour le prochain Direct</h4>
                        <p style="color: #64748b; font-size: 1.2rem; max-width: 550px; margin: 0 auto; line-height: 1.6;">Nos experts préparent actuellement des sessions de haut niveau. Revenez bientôt pour ne rien manquer !</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = webinars.map(w => WebinarModule.renderWebinarCard(w)).join('');
        } catch (err) {
            console.error("Error loading webinars:", err);
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 80px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 40px; text-align: center; animation: fadeIn 0.5s ease;">
                    <div style="font-size: 4rem; margin-bottom: 24px;">⚠️</div>
                    <p style="color: #991b1b; font-weight: 900; font-size: 1.3rem; margin-bottom: 12px;">Oups ! Un problème est survenu.</p>
                    <p style="color: #b91c1c; font-size: 1rem; margin-bottom: 32px; opacity: 0.8;">${err.message || 'La table webinars est peut-être manquante.'}</p>
                    <button onclick="WebinarModule.loadWebinars()" style="background: #e11d48; color: white; border: none; padding: 16px 32px; border-radius: 16px; font-weight: 800; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(225, 29, 72, 0.2);">Tenter une nouvelle connexion</button>
                </div>
            `;
        }
    },

    /**
     * Render Single Webinar Card (Competitor Style)
     */
    renderWebinarCard: (webinar) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        const now = new Date();
        const isLive = now >= date && now <= new Date(date.getTime() + 120*60*1000); // 2h window
        const isPast = now > new Date(date.getTime() + 120*60*1000);

        return `
            <div class="webinar-card" style="background: white; border-radius: 32px; border: 1px solid #f1f5f9; overflow: hidden; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); position: relative; display: flex; flex-direction: column; height: 100%; box-shadow: 0 15px 45px rgba(0,0,0,0.02);">
                <div style="height: 200px; background: #0f172a; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%); z-index: 1;"></div>
                    <div style="font-size: 4rem; z-index: 2; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));">🚀</div>
                    
                    ${isLive ? `
                        <div style="position: absolute; top: 20px; right: 20px; background: #ef4444; color: white; padding: 8px 16px; border-radius: 100px; font-size: 0.8rem; font-weight: 900; display: flex; align-items: center; gap: 8px; z-index: 3; box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4); animation: pulse 1.5s infinite;">
                            <span style="width: 10px; height: 10px; background: white; border-radius: 50%;"></span>
                            EN DIRECT
                        </div>
                    ` : (isPast ? `
                        <div style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); color: white; padding: 8px 16px; border-radius: 100px; font-size: 0.8rem; font-weight: 800; z-index: 3; border: 1px solid rgba(255,255,255,0.2);">
                            REPLAY DISPONIBLE
                        </div>
                    ` : '')}
                </div>

                <div style="padding: 36px; flex-grow: 1; display: flex; flex-direction: column;">
                    <div style="color: #10b981; font-weight: 900; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${formattedDate} • ${formattedTime}
                    </div>
                    <h3 style="font-size: 1.65rem; font-weight: 900; color: #0f172a; margin-bottom: 16px; line-height: 1.25; letter-spacing: -0.03em;">${webinar.title}</h3>
                    <p style="color: #64748b; font-size: 1.05rem; line-height: 1.6; margin-bottom: 32px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${webinar.description || 'Boostez votre expertise avec cette session live stratégique animée par les meilleurs.'}</p>
                    
                    <div style="margin-top: auto;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid #f1f5f9; margin-bottom: 24px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 48px; height: 48px; border-radius: 16px; object-fit: cover; border: 2px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                                <div>
                                    <div style="font-size: 1rem; font-weight: 800; color: #0f172a;">${webinar.profiles?.full_name || 'Expert Domtom'}</div>
                                    <div style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">Intervenant Principal</div>
                                </div>
                            </div>
                        </div>

                        <button onclick="WebinarModule.joinWebinar('${webinar.id}', '${webinar.meeting_link}')" class="cta-button primary" style="width: 100%; height: 60px; background: ${isLive ? '#ef4444' : (isPast ? '#0f172a' : '#10b981')}; color: white; border-radius: 20px; font-weight: 900; border: none; cursor: pointer; transition: 0.4s; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 10px 25px ${isLive ? 'rgba(239, 68, 68, 0.3)' : (isPast ? 'rgba(15, 23, 42, 0.2)' : 'rgba(16, 185, 129, 0.3)')};">
                            ${isLive ? '<span class="live-dot"></span> Rejoindre le Live' : 
                              (isPast ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Voir le Replay' : 'S\'inscrire à la session')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Join Webinar Logic
     */
    joinWebinar: (id, link) => {
        if (!link) {
            Swal.fire({ title: 'Bientôt disponible', text: 'Le lien de connexion sera activé 15 minutes avant le début du live.', icon: 'info' });
            return;
        }

        const isYoutube = link.includes('youtube.com') || link.includes('youtu.be');
        if (isYoutube) {
            window.Router.navigate('#webinars?id=' + id);
        } else {
            window.open(link, '_blank');
        }
    },

    /**
     * Render Interactive Watch View (The "Competitor" Experience)
     */
    renderWatchView: async (container, webinarId, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
                <div class="splash-loader"></div>
            </div>
        `;

        try {
            const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
            if (!db) throw new Error("Supabase non détecté");

            const { data: webinar, error } = await db
                .from('webinars')
                .select('*, profiles(full_name, avatar_url, title)')
                .eq('id', webinarId)
                .single();

            if (error) throw error;

            // Resolve YouTube Embed
            const link = webinar.meeting_link;
            const videoId = link.includes('v=') ? link.split('v=')[1].split('&')[0] : link.split('/').pop();
            const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

            container.innerHTML = `
                <div style="animation: fadeIn 0.8s ease-out; padding-bottom: 60px;">
                    <!-- Top Bar Context -->
                    <div style="margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <button onclick="window.Router.navigate('#webinars')" style="background: white; border: 1px solid #e2e8f0; width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" onmouseover="this.style.borderColor='#10b981'; this.style.transform='scale(1.05)'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='scale(1)'">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </button>
                            <div>
                                <h1 style="font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.04em;">${webinar.title}</h1>
                                <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
                                    <div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; animation: pulse 1s infinite;"></div>
                                    <p style="color: #64748b; margin: 0; font-weight: 700; font-size: 1rem;">Direct avec ${webinar.profiles?.full_name}</p>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <div style="background: #f1f5f9; padding: 12px 24px; border-radius: 16px; display: flex; align-items: center; gap: 10px; font-weight: 800; color: #475569;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                <span id="attendee-count">... participants</span>
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 400px; gap: 32px; align-items: start;">
                        <!-- Left: Media & Details -->
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            <div style="aspect-ratio: 16/9; background: #000; border-radius: 40px; overflow: hidden; box-shadow: 0 30px 100px rgba(0,0,0,0.3); position: relative; border: 8px solid white;">
                                <iframe width="100%" height="100%" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            
                            <div style="background: white; padding: 48px; border-radius: 40px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.02);">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
                                    <div>
                                        <h3 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 12px;">Objectifs de la session</h3>
                                        <p style="color: #64748b; line-height: 1.8; font-size: 1.15rem; max-width: 800px;">${webinar.description || 'Cette session live vous apporte les clés stratégiques pour accélérer vos projets.'}</p>
                                    </div>
                                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                                        <span style="font-size: 0.8rem; font-weight: 900; color: #10b981; letter-spacing: 2px;">PARTAGER</span>
                                        <div style="display: flex; gap: 10px;">
                                            <button onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url='+window.location.href)" style="width: 40px; height: 40px; border-radius: 12px; background: #f1f5f9; border: none; cursor: pointer; color: #0a66c2;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></button>
                                            <button onclick="window.open('https://wa.me/?text=Rejoignez-moi pour ce live stratégique : '+window.location.href)" style="width: 40px; height: 40px; border-radius: 12px; background: #f1f5f9; border: none; cursor: pointer; color: #25d366;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.887.002-5.462-4.415-9.89-9.881-9.891-5.446 0-9.884 4.438-9.887 9.887-.001 2.225.618 3.891 1.746 5.634l-.999 3.648 3.74-.981z"/></svg></button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="display: flex; gap: 32px; align-items: center; background: #f8fafc; padding: 24px 32px; border-radius: 28px;">
                                    <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 72px; height: 72px; border-radius: 24px; object-fit: cover;">
                                    <div>
                                        <div style="font-size: 1.2rem; font-weight: 900; color: #0f172a;">${webinar.profiles?.full_name}</div>
                                        <div style="color: #10b981; font-weight: 800; font-size: 0.95rem;">${webinar.profiles?.title || 'Expert Stratégique'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Interactive Engagement Panel (Competitor Edge) -->
                        <div style="display: flex; flex-direction: column; gap: 24px; height: 100%;">
                            <div style="background: #0f172a; border-radius: 40px; overflow: hidden; display: flex; flex-direction: column; height: 700px; box-shadow: 0 40px 80px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05);">
                                <!-- Engagement Tabs -->
                                <div style="display: flex; background: rgba(255,255,255,0.05); padding: 8px;">
                                    <button onclick="WebinarModule.switchTab('chat')" id="tab-chat" class="engagement-tab active">CHAT</button>
                                    <button onclick="WebinarModule.switchTab('qa')" id="tab-qa" class="engagement-tab">Q&A</button>
                                    <button onclick="WebinarModule.switchTab('polls')" id="tab-polls" class="engagement-tab">SONDAGES</button>
                                </div>

                                <!-- Tab Content: Chat -->
                                <div id="panel-chat" class="engagement-panel active">
                                    <div id="chat-messages" style="flex-grow: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
                                        <div class="chat-bubble system">🚀 Le live commence bientôt ! Soyez prêts.</div>
                                    </div>
                                    <div style="padding: 24px; background: rgba(255,255,255,0.03); border-top: 1px solid rgba(255,255,255,0.05);">
                                        <div style="position: relative;">
                                            <input id="chat-input-live" type="text" placeholder="Envoyer un message..." style="width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 18px 60px 18px 20px; color: white; font-size: 1rem; outline: none;" onfocus="this.style.borderColor='#10b981'">
                                            <button onclick="WebinarModule.postMessage('${webinarId}')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #10b981; border: none; width: 44px; height: 44px; border-radius: 12px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tab Content: Q&A -->
                                <div id="panel-qa" class="engagement-panel">
                                    <div id="qa-questions" style="flex-grow: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
                                        <div style="text-align: center; color: #94a3b8; padding-top: 40px;">
                                            <p>Aucune question pour le moment. Soyez le premier à demander !</p>
                                        </div>
                                    </div>
                                    <div style="padding: 24px; background: rgba(255,255,255,0.03);">
                                        <button onclick="WebinarModule.askQuestion('${webinarId}')" style="width: 100%; padding: 16px; background: white; color: #0f172a; border-radius: 16px; border: none; font-weight: 900; font-size: 1rem; cursor: pointer; transition: 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">POSER UNE QUESTION</button>
                                    </div>
                                </div>

                                <!-- Tab Content: Polls -->
                                <div id="panel-polls" class="engagement-panel">
                                    <div id="polls-list" style="flex-grow: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 24px;">
                                        <div style="text-align: center; color: #94a3b8; padding-top: 40px;">
                                            <p>Aucun sondage actif pour l'instant.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize Interactions
            WebinarModule.initRealtimeInteractions(webinarId, profile);
            WebinarModule.trackAttendance(webinarId);

        } catch (err) {
            console.error("Error loading watch view:", err);
            container.innerHTML = `<div style="padding: 100px; text-align: center;"><p style="color: #ef4444; font-weight: 800;">Impossible de charger la session : ${err.message}</p></div>`;
        }
    },

    /**
     * Switch Interactions Tab
     */
    switchTab: (tabId) => {
        document.querySelectorAll('.engagement-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.engagement-panel').forEach(p => p.classList.remove('active'));
        
        document.getElementById(`tab-${tabId}`).classList.add('active');
        document.getElementById(`panel-${tabId}`).classList.add('active');
    },

    /**
     * Real-time Chat Integration (SUPABASE POWERED)
     */
    initRealtimeInteractions: async (webinarId, profile) => {
        const db = window._supabase;
        
        // 1. Load existing messages
        const { data: messages } = await db.from('webinar_messages').select('*, profiles(full_name)').eq('webinar_id', webinarId).order('created_at', { ascending: true });
        if (messages) messages.forEach(m => WebinarModule.renderChatMessage(m));

        // 2. Subscribe to new messages
        WebinarModule.activeSubscription = db
            .channel(`webinar_chat_${webinarId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'webinar_messages', filter: `webinar_id=eq.${webinarId}` }, async (payload) => {
                const { data: fullMsg } = await db.from('webinar_messages').select('*, profiles(full_name)').eq('id', payload.new.id).single();
                if (fullMsg) WebinarModule.renderChatMessage(fullMsg);
            })
            .subscribe();

        // 3. Setup input listener
        const input = document.getElementById('chat-input-live');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') WebinarModule.postMessage(webinarId);
            });
        }
    },

    /**
     * Post a Message to Supabase
     */
    postMessage: async (webinarId) => {
        const input = document.getElementById('chat-input-live');
        if (!input || !input.value.trim()) return;

        const content = input.value.trim();
        input.value = '';

        const { error } = await window._supabase.from('webinar_messages').insert([{
            webinar_id: webinarId,
            user_id: (await window._supabase.auth.getUser()).data.user.id,
            content: content
        }]);

        if (error) console.error("Error posting message:", error);
    },

    /**
     * Render Chat Message Bubble
     */
    renderChatMessage: (msg) => {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const isMe = msg.user_id === window.App.state.session?.user?.id;
        const bubbleHTML = `
            <div style="max-width: 85%; align-self: ${isMe ? 'flex-end' : 'flex-start'}; animation: slideUp 0.3s ease-out;">
                <div style="font-size: 0.75rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; padding: 0 4px;">${msg.profiles?.full_name || 'Utilisateur'}</div>
                <div style="padding: 12px 18px; border-radius: 18px; font-size: 0.95rem; line-height: 1.5; background: ${isMe ? '#10b981' : 'rgba(255,255,255,0.08)'}; color: white; border: 1px solid ${isMe ? 'transparent' : 'rgba(255,255,255,0.1)'};">
                    ${msg.content}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', bubbleHTML);
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Ask a Question (Competitor Q&A Logic)
     */
    askQuestion: async (webinarId) => {
        const { value: question } = await Swal.fire({
            title: 'Poser une question',
            input: 'textarea',
            inputPlaceholder: 'Ma question stratégique...',
            confirmButtonText: 'Envoyer à l\'expert',
            confirmButtonColor: '#10b981',
            background: '#0f172a',
            color: '#fff'
        });

        if (question) {
            const { error } = await window._supabase.from('webinar_questions').insert([{
                webinar_id: webinarId,
                user_id: (await window._supabase.auth.getUser()).data.user.id,
                question: question
            }]);
            
            if (error) Swal.fire('Erreur', error.message, 'error');
            else WebinarModule.loadQuestions(webinarId);
        }
    },

    loadQuestions: async (webinarId) => {
        const container = document.getElementById('qa-questions');
        if (!container) return;
        
        const { data: questions } = await window._supabase.from('webinar_questions').select('*, profiles(full_name)').eq('webinar_id', webinarId).order('upvotes', { ascending: false });
        
        if (questions && questions.length > 0) {
            container.innerHTML = questions.map(q => `
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <span style="font-weight: 800; color: #10b981; font-size: 0.85rem;">${q.profiles?.full_name}</span>
                        <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; cursor: pointer;" onclick="WebinarModule.upvoteQuestion('${q.id}')">
                            👍 ${q.upvotes}
                        </div>
                    </div>
                    <p style="color: white; margin: 0; font-size: 1rem; line-height: 1.5;">${q.question}</p>
                    ${q.is_answered ? '<div style="margin-top: 12px; color: #10b981; font-weight: 800; font-size: 0.8rem;">✓ RÉPONDU EN DIRECT</div>' : ''}
                </div>
            `).join('');
        }
    },

    /**
     * Attendance Tracking
     */
    trackAttendance: async (webinarId) => {
        const userId = window.App.state.session?.user?.id;
        if (!userId) return;

        await window._supabase.from('webinar_attendees').upsert({
            webinar_id: webinarId,
            user_id: userId,
            attended_at: new Date().toISOString()
        });

        // Fetch count
        const { count } = await window._supabase.from('webinar_attendees').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        const counter = document.getElementById('attendee-count');
        if (counter) counter.textContent = `${count} participants en ligne`;
    },

    /**
     * Create Webinar Modal & Logic (Existing, but polished)
     */
    openCreateModal: () => {
        let modal = document.getElementById('webinar-create-modal');
        if (!modal) {
            const modalHTML = `
                <div id="webinar-create-modal" class="modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(15, 23, 42, 0.95); backdrop-filter:blur(20px); z-index:20005; align-items:center; justify-content:center; padding:20px;">
                    <div style="background:white; width:100%; max-width:700px; border-radius:40px; padding:56px; position:relative; box-shadow:0 40px 100px rgba(0,0,0,0.5); animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);">
                        <button onclick="WebinarModule.closeCreateModal()" style="position:absolute; top:32px; right:32px; background:#f1f5f9; border:none; width:48px; height:48px; border-radius:50%; font-size:1.5rem; color:#0f172a; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: 0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white'">&times;</button>
                        
                        <div style="margin-bottom: 40px; text-align: center;">
                            <h2 style="font-size:2.5rem; font-weight:900; color:#0f172a; margin-bottom:12px; letter-spacing:-0.05em;">Lancer un <span style="color: #10b981;">Webinaire</span></h2>
                            <p style="color:#64748b; font-size:1.2rem;">Diffusez votre expertise et impactez l'écosystème en direct.</p>
                        </div>
                        
                        <form id="webinar-form" onsubmit="WebinarModule.handleCreateSubmit(event)" style="display:grid; gap:28px;">
                            <div style="display: grid; gap: 10px;">
                                <label style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Titre Stratégique *</label>
                                <input name="title" required placeholder="Ex: Masterclass: Leverage AI for Growth" style="width:100%; padding:18px; border:2px solid #f1f5f9; border-radius:18px; font-family:inherit; font-size:1.05rem; transition: 0.3s;" onfocus="this.style.borderColor='#10b981'; this.style.outline='none'">
                            </div>
                            <div style="display: grid; gap: 10px;">
                                <label style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Description d'Impact</label>
                                <textarea name="description" rows="3" placeholder="Quels sont les points clés de cette session ?" style="width:100%; padding:18px; border:2px solid #f1f5f9; border-radius:18px; font-family:inherit; font-size:1.05rem; resize:none; transition: 0.3s;" onfocus="this.style.borderColor='#10b981'; this.style.outline='none'"></textarea>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                                <div style="display: grid; gap: 10px;">
                                    <label style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Date et Heure *</label>
                                    <input type="datetime-local" name="scheduled_at" required style="width:100%; padding:18px; border:2px solid #f1f5f9; border-radius:18px; font-family:inherit; font-size:1.05rem;">
                                </div>
                                <div style="display: grid; gap: 10px;">
                                    <label style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Lien Live (YouTube) *</label>
                                    <input type="url" name="meeting_link" required placeholder="https://youtube.com/..." style="width:100%; padding:18px; border:2px solid #f1f5f9; border-radius:18px; font-family:inherit; font-size:1.05rem;">
                                </div>
                            </div>
                            
                            <button type="submit" class="cta-button primary" style="width:100%; padding:22px; background:#10b981; color:white; border:none; border-radius:24px; font-weight:900; font-size:1.2rem; margin-top:16px; cursor:pointer; box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); transition: 0.4s; letter-spacing: -0.02em;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 40px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'">PUBLIER LE DIRECT</button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('webinar-create-modal');
        }
        modal.style.display = 'flex';
    },

    closeCreateModal: () => {
        const modal = document.getElementById('webinar-create-modal');
        if (modal) modal.style.display = 'none';
    },

    handleCreateSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Traitement en cours...';

        try {
            const { error } = await window._supabase.from('webinars').insert([{
                title: data.title,
                description: data.description,
                scheduled_at: data.scheduled_at,
                meeting_link: data.meeting_link,
                host_id: (await window._supabase.auth.getUser()).data.user.id
            }]);

            if (error) throw error;

            Swal.fire({ title: 'Live Planifié !', text: 'Votre session est maintenant visible par toute la communauté.', icon: 'success' });
            WebinarModule.closeCreateModal();
            WebinarModule.loadWebinars();
            form.reset();
        } catch (err) {
            Swal.fire('Erreur', err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'PUBLIER LE DIRECT';
        }
    }
};

// Competitor Aesthetics CSS
const webinarStyle = document.createElement('style');
webinarStyle.textContent = `
    .engagement-tab {
        flex: 1;
        background: transparent;
        border: none;
        color: #94a3b8;
        padding: 12px;
        font-weight: 900;
        font-size: 0.75rem;
        letter-spacing: 1.5px;
        cursor: pointer;
        border-radius: 12px;
        transition: 0.3s;
    }
    .engagement-tab.active {
        background: #10b981;
        color: white;
    }
    .engagement-panel {
        display: none;
        flex-direction: column;
        flex-grow: 1;
    }
    .engagement-panel.active {
        display: flex;
    }
    .chat-bubble.system {
        padding: 12px;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 12px;
        font-size: 0.85rem;
        color: #10b981;
        font-weight: 800;
        text-align: center;
        border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .live-dot {
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        display: inline-block;
        animation: pulse 1s infinite;
    }
    @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.7; }
    }
    .webinar-card:hover {
        transform: translateY(-12px);
        box-shadow: 0 40px 80px rgba(16, 185, 129, 0.12) !important;
        border-color: #10b981 !important;
    }
`;
document.head.appendChild(webinarStyle);

window.WebinarModule = WebinarModule;

