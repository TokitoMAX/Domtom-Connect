/**
 * Domtom Connect - Webinar Module
 * Strategic High-Impact Live Events Module
 */
const WebinarModule = {
    role: null,

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
                <h1 style="font-size: clamp(2rem, 5vw, 2.8rem); font-weight: 900; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.03em;">Webinaires <span style="color: #10b981;">Stratégiques</span></h1>
                <p style="color: #64748b; font-size: 1.15rem; max-width: 600px; line-height: 1.6;">Accédez en exclusivité aux sessions live de Domtom Connect et interagissez avec les experts de l'écosystème.</p>
            </div>

            <div id="webinars-container" class="dash-grid-layout" style="gap: 32px;">
                <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; background: white; padding: 28px 36px; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 10px; flex-wrap: wrap; gap: 20px;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: #0f172a;">Sessions Programmées</h3>
                        <p style="margin: 6px 0 0 0; font-size: 0.95rem; color: #64748b;">Planifiez votre participation aux prochains directs.</p>
                    </div>
                    ${WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur' ? `
                        <button onclick="WebinarModule.openCreateModal()" class="cta-button primary" style="background: #0f172a; color: white; border: none; border-radius: 14px; font-weight: 800; padding: 14px 28px; display: flex; align-items: center; gap: 10px; transition: 0.3s;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Créer une session
                        </button>
                    ` : ''}
                </div>

                <div id="webinars-list" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 28px;">
                    <div style="text-align: center; padding: 100px 40px; grid-column: 1 / -1; background: white; border-radius: 32px; border: 2px dashed #e2e8f0;">
                        <div class="splash-loader" style="margin: 0 auto 24px;"></div>
                        <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Synchronisation des lives...</h4>
                        <p style="color: #64748b;">Nous récupérons les dernières sessions disponibles.</p>
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
            const { data: webinars, error } = await window._supabase
                .from('webinars')
                .select('*, profiles(full_name, avatar_url)')
                .order('scheduled_at', { ascending: true });

            if (error) throw error;

            if (!webinars || webinars.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align: center; padding: 100px 40px; grid-column: 1 / -1; background: #f8fafc; border-radius: 32px; border: 2px dashed #e2e8f0; animation: fadeIn 0.5s ease;">
                        <div style="font-size: 4rem; margin-bottom: 24px;">📺</div>
                        <h4 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 12px;">Aucun webinaire programmé</h4>
                        <p style="color: #64748b; font-size: 1.1rem; max-width: 500px; margin: 0 auto;">Les prochaines sessions seront annoncées ici très prochainement. Restez connectés !</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = webinars.map(w => WebinarModule.renderWebinarCard(w)).join('');
        } catch (err) {
            console.error("Error loading webinars:", err);
            let errorMessage = "Impossible de charger les webinaires. Vérifiez votre connexion.";
            
            if (err.code === 'PGRST116' || err.message?.includes('not found')) {
                errorMessage = "La table 'webinars' n'existe pas encore dans votre base de données Supabase.";
            }

            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 60px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 32px; text-align: center; animation: fadeIn 0.5s ease;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                    <p style="color: #991b1b; font-weight: 800; font-size: 1.1rem; margin-bottom: 8px;">${errorMessage}</p>
                    <p style="color: #b91c1c; font-size: 0.9rem; margin-bottom: 24px;">${err.message || ''}</p>
                    <button onclick="WebinarModule.loadWebinars()" style="background: #e11d48; color: white; border: none; padding: 14px 28px; border-radius: 14px; font-weight: 800; cursor: pointer; transition: 0.3s;">Réessayer la synchronisation</button>
                </div>
            `;
        }
    },

    /**
     * Render Single Webinar Card
     */
    renderWebinarCard: (webinar) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        const now = new Date();
        const isLive = now >= date && now <= new Date(date.getTime() + 90*60*1000); // Live if within 1.5h
        const isPast = now > new Date(date.getTime() + 90*60*1000);

        return `
            <div style="background: white; border-radius: 28px; border: 1px solid #e2e8f0; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; display: flex; flex-direction: column; height: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.02);" 
                 onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-8px)'; this.style.boxShadow='0 20px 40px rgba(16, 185, 129, 0.08)'" 
                 onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.02)'">
                
                ${isLive ? `
                    <div style="position: absolute; top: 20px; right: 20px; background: #ef4444; color: white; padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 900; display: flex; align-items: center; gap: 8px; z-index: 2; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                        <span style="width: 8px; height: 8px; background: white; border-radius: 50%; display: inline-block; animation: pulse 1s infinite;"></span>
                        EN DIRECT
                    </div>
                ` : ''}

                ${isPast ? `
                    <div style="position: absolute; top: 20px; right: 20px; background: #64748b; color: white; padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; z-index: 2;">
                        REPLAY
                    </div>
                ` : ''}
                
                <div style="padding: 36px; display: flex; flex-direction: column; flex-grow: 1;">
                    <div style="color: #10b981; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${formattedDate} • ${formattedTime}
                    </div>
                    <h3 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 16px; line-height: 1.3; letter-spacing: -0.02em;">${webinar.title}</h3>
                    <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin-bottom: 28px;">${webinar.description || 'Une session live stratégique pour booster votre impact.'}</p>
                    
                    <div style="margin-top: auto;">
                        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                            <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 44px; height: 44px; border-radius: 14px; object-fit: cover; background: #f1f5f9; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <div>
                                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${webinar.profiles?.full_name || 'Expert Domtom'}</div>
                                <div style="font-size: 0.8rem; color: #64748b;">Hôte de la session</div>
                            </div>
                        </div>

                        <button onclick="WebinarModule.joinWebinar('${webinar.id}', '${webinar.meeting_link}')" class="cta-button primary" style="width: 100%; height: 56px; background: ${isLive ? '#ef4444' : (isPast ? '#0f172a' : '#10b981')}; color: white; border-radius: 16px; font-weight: 800; border: none; cursor: pointer; transition: 0.3s; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            ${isLive ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg> Rejoindre le Direct' : 
                              (isPast ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Voir le Replay' : 'S\'inscrire / M\'alerter')}
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
            alert("Le lien de connexion n'est pas encore disponible. Vous recevrez une notification par email.");
            return;
        }

        // Clean link to check for YouTube
        const isYoutube = link.includes('youtube.com') || link.includes('youtu.be');
        
        if (isYoutube) {
            // Navigate internally to the watch view
            window.Router.navigate('#webinars?id=' + id);
        } else {
            // Standard external link
            window.open(link, '_blank');
        }
    },

    /**
     * Render Integrated Watch View
     */
    renderWatchView: async (container, webinarId, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div style="min-height: 600px; display: flex; align-items: center; justify-content: center;">
                <div class="splash-loader"></div>
            </div>
        `;

        try {
            const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
            if (!db) throw new Error("Supabase client non initialisé");

            const { data: webinar, error } = await db
                .from('webinars')
                .select('*, profiles(full_name, avatar_url)')
                .eq('id', webinarId)
                .single();

            if (error) throw error;

            let videoEmbed = '';
            const link = webinar.meeting_link;

            if (link.includes('youtube.com') || link.includes('youtu.be')) {
                const videoId = link.includes('v=') ? link.split('v=')[1].split('&')[0] : link.split('/').pop();
                videoEmbed = `
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="border-radius: 24px; aspect-ratio: 16/9; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
                    </iframe>
                `;
            } else {
                videoEmbed = `
                    <div style="aspect-ratio: 16/9; background: #0f172a; border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 40px; text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 24px;">🚀</div>
                        <h3 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 16px;">Session Interactive</h3>
                        <p style="color: #94a3b8; font-size: 1.1rem; max-width: 500px; margin-bottom: 32px;">Cette session se déroule sur une plateforme externe pour permettre une interaction maximale.</p>
                        <a href="${link}" target="_blank" class="cta-button primary" style="background: #10b981; padding: 16px 40px; border-radius: 14px; font-weight: 800; font-size: 1.1rem; text-decoration: none; color: white;">Rejoindre la Session</a>
                    </div>
                `;
            }

            container.innerHTML = `
                <div style="animation: fadeIn 0.6s ease-out;">
                    <div style="margin-bottom: 32px; display: flex; align-items: center; gap: 16px;">
                        <button onclick="window.Router.navigate('#webinars')" style="background: white; border: 1px solid #e2e8f0; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <div>
                            <h1 style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.02em;">${webinar.title}</h1>
                            <p style="color: #64748b; margin: 4px 0 0 0;">Session animée par ${webinar.profiles?.full_name || 'Domtom Connect'}</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 350px; gap: 32px;">
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            ${videoEmbed}
                            
                            <div style="background: white; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0;">
                                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 16px;">À propos de cette session</h3>
                                <p style="color: #64748b; line-height: 1.7; font-size: 1.05rem;">${webinar.description || 'Pas de description supplémentaire pour cette session.'}</p>
                                
                                <div style="display: flex; gap: 12px; margin-top: 32px;">
                                    <div style="background: #f1f5f9; padding: 12px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; color: #475569;">#Entrepreneuriat</div>
                                    <div style="background: #f1f5f9; padding: 12px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; color: #475569;">#DomtomConnect</div>
                                    <div style="background: #f1f5f9; padding: 12px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; color: #475569;">#Live</div>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <!-- Interaction Sidebar -->
                            <div style="background: #0f172a; border-radius: 24px; padding: 24px; color: white; min-height: 500px; display: flex; flex-direction: column;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                                    <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0;">Discussion Live</h3>
                                    <span style="background: #ef4444; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 900;">DIRECT</span>
                                </div>
                                
                                <div id="webinar-chat" style="flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; scroll-behavior: smooth;">
                                    <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px; font-size: 0.9rem;">
                                        <div style="font-weight: 800; color: #10b981; margin-bottom: 4px;">Système</div>
                                        <div style="color: #94a3b8;">Bienvenue dans le chat ! Posez vos questions ici.</div>
                                    </div>
                                </div>

                                <div style="position: relative;">
                                    <input id="chat-input" type="text" placeholder="Posez une question..." style="width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 45px 14px 16px; color: white; font-family: inherit;">
                                    <button onclick="WebinarModule.sendMessage('${webinarId}')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #10b981; border: none; width: 32px; height: 32px; border-radius: 8px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Resources / CTA -->
                            <div style="background: white; border-radius: 24px; padding: 24px; border: 1px solid #e2e8f0;">
                                <h4 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 16px;">Ressources utiles</h4>
                                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                                    <li>
                                        <a href="/docs/guide-domtom.pdf" style="display: flex; align-items: center; gap: 10px; color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 600;" onmouseover="this.style.color='#10b981'" onmouseout="this.style.color='#64748b'">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                            Guide de l'entrepreneur.pdf
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/registration/onboarding" style="display: flex; align-items: center; gap: 10px; color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 600;" onmouseover="this.style.color='#10b981'" onmouseout="this.style.color='#64748b'">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                            S'inscrire sur la plateforme
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Setup Realtime Chat (Mock for now, but structured for Supabase)
            WebinarModule.setupChat(webinarId);

        } catch (err) {
            console.error("Error loading watch view:", err);
            container.innerHTML = `<div style="padding: 100px; text-align: center; color: #ef4444; font-weight: 800;">Impossible de charger la session : ${err.message}</div>`;
        }
    },

    /**
     * Setup Chat (Placeholder for Realtime)
     */
    setupChat: (webinarId) => {
        const input = document.getElementById('chat-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') WebinarModule.sendMessage(webinarId);
            });
        }
    },

    /**
     * Send Message
     */
    sendMessage: (webinarId) => {
        const input = document.getElementById('chat-input');
        const chatContainer = document.getElementById('webinar-chat');
        if (!input || !input.value.trim() || !chatContainer) return;

        const msg = input.value.trim();
        const userName = WebinarModule.role === 'admin' ? 'Vous (Admin)' : 'Vous';
        
        const messageHTML = `
            <div style="padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; font-size: 0.9rem; align-self: flex-end; border: 1px solid rgba(16, 185, 129, 0.2);">
                <div style="font-weight: 800; color: #10b981; margin-bottom: 4px;">${userName}</div>
                <div style="color: white;">${msg}</div>
            </div>
        `;

        chatContainer.insertAdjacentHTML('beforeend', messageHTML);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        input.value = '';

        // Note: Real implementation would insert into 'webinar_messages' table in Supabase
    },

    /**
     * Open Create Modal
     */
    openCreateModal: () => {
        let modal = document.getElementById('webinar-create-modal');
        if (!modal) {
            const modalHTML = `
                <div id="webinar-create-modal" class="modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(12px); z-index:20001; align-items:center; justify-content:center; padding:20px;">
                    <div style="background:white; width:100%; max-width:650px; border-radius:32px; padding:48px; position:relative; box-shadow:0 30px 60px -12px rgba(0,0,0,0.3); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
                        <button onclick="WebinarModule.closeCreateModal()" style="position:absolute; top:32px; right:32px; background:#f1f5f9; border:none; width:40px; height:40px; border-radius:50%; font-size:1.2rem; color:#64748b; cursor:pointer; display:flex; align-items:center; justify-content:center;">×</button>
                        
                        <div style="margin-bottom: 32px;">
                            <h2 style="font-size:2rem; font-weight:900; color:#0f172a; margin-bottom:8px; letter-spacing:-0.02em;">Planifier une Session Live</h2>
                            <p style="color:#64748b; font-size:1.05rem;">Préparez un événement stratégique pour vos membres.</p>
                        </div>
                        
                        <form id="webinar-form" onsubmit="WebinarModule.handleCreateSubmit(event)" style="display:grid; gap:24px;">
                            <div style="display: grid; gap: 8px;">
                                <label style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Titre de la session *</label>
                                <input name="title" required placeholder="Ex: Masterclass Financement 2026" style="width:100%; padding:16px; border:2px solid #f1f5f9; border-radius:14px; font-family:inherit; font-size:1rem; transition: 0.2s;" onfocus="this.style.borderColor='#10b981'; this.style.outline='none'">
                            </div>
                            <div style="display: grid; gap: 8px;">
                                <label style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Description d'impact</label>
                                <textarea name="description" rows="3" placeholder="Quels sont les objectifs de cette session ?" style="width:100%; padding:16px; border:2px solid #f1f5f9; border-radius:14px; font-family:inherit; font-size:1rem; resize:none; transition: 0.2s;" onfocus="this.style.borderColor='#10b981'; this.style.outline='none'"></textarea>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                <div style="display: grid; gap: 8px;">
                                    <label style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Date et Heure *</label>
                                    <input type="datetime-local" name="scheduled_at" required style="width:100%; padding:16px; border:2px solid #f1f5f9; border-radius:14px; font-family:inherit; font-size:1rem;">
                                </div>
                                <div style="display: grid; gap: 8px;">
                                    <label style="font-size:0.85rem; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Lien Live (YouTube, Jitsi) *</label>
                                    <input type="url" name="meeting_link" required placeholder="https://..." style="width:100%; padding:16px; border:2px solid #f1f5f9; border-radius:14px; font-family:inherit; font-size:1rem;">
                                </div>
                            </div>
                            
                            <button type="submit" class="cta-button primary" style="width:100%; padding:18px; background:#10b981; color:white; border:none; border-radius:18px; font-weight:800; font-size:1.1rem; margin-top:12px; cursor:pointer; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); transition: 0.3s;">Publier l'Événement Live</button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('webinar-create-modal');
        }
        modal.style.display = 'flex';
    },

    /**
     * Close Create Modal
     */
    closeCreateModal: () => {
        const modal = document.getElementById('webinar-create-modal');
        if (modal) modal.style.display = 'none';
    },

    /**
     * Handle Creation Submit
     */
    handleCreateSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publication en cours...';

        try {
            const { error } = await window._supabase
                .from('webinars')
                .insert([{
                    title: data.title,
                    description: data.description,
                    scheduled_at: data.scheduled_at,
                    meeting_link: data.meeting_link,
                    host_id: (await window._supabase.auth.getUser()).data.user.id
                }]);

            if (error) throw error;

            alert("Webinaire planifié avec succès !");
            WebinarModule.closeCreateModal();
            WebinarModule.loadWebinars();
            form.reset();
        } catch (err) {
            console.error("Error creating webinar:", err);
            alert("Erreur lors de la création du webinaire : " + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
`;
document.head.appendChild(style);

window.WebinarModule = WebinarModule;

