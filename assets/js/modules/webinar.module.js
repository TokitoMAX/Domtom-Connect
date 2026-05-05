/**
 * Domtom Connect - Webinar Module
 * LUXURY SAAS UPGRADE: Cinematic Experience, Mesh Gradients, Glassmorphism
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
     * Render Webinars List with Cinematic Hero
     */
    renderWebinarsList: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="webinar-hero" style="position: relative; border-radius: 48px; padding: 80px; overflow: hidden; margin-bottom: 60px; background: #0f172a; min-height: 400px; display: flex; align-items: center; animation: fadeInDown 0.8s ease-out; box-shadow: 0 40px 100px rgba(0,0,0,0.1);">
                <div style="position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(15, 23, 42, 0.8) 0%, transparent 60%); z-index: 1;"></div>
                <div style="position: absolute; top: -50%; left: -20%; width: 140%; height: 200%; background: url('https://www.transparenttextures.com/patterns/carbon-fibre.png'); opacity: 0.05; pointer-events: none; z-index: 1;"></div>
                
                <div style="position: relative; z-index: 2; max-width: 700px;">
                    <div style="display: inline-flex; align-items: center; gap: 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 8px 16px; border-radius: 100px; color: #10b981; font-weight: 900; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;">
                        <span class="live-pulse"></span> EXCELLENCE STRATÉGIQUE
                    </div>
                    <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; color: white; margin: 0 0 20px 0; line-height: 1.1; letter-spacing: -0.05em;">L'Elite en <span style="color: #10b981; background: linear-gradient(to right, #10b981, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Direct.</span></h1>
                    <p style="color: #94a3b8; font-size: 1.3rem; line-height: 1.6; margin-bottom: 40px; font-weight: 500;">Accélérez votre trajectoire avec les masterclasses immersives de Domtom Connect. L'expertise n'attend pas.</p>
                    
                    <div style="display: flex; gap: 20px; align-items: center;">
                        ${WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur' ? `
                            <button onclick="WebinarModule.openCreateModal()" class="cta-button primary" style="background: #10b981; color: white; border: none; border-radius: 20px; font-weight: 900; padding: 20px 40px; display: flex; align-items: center; gap: 12px; transition: 0.4s; cursor: pointer; font-size: 1.1rem; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Lancer une Session
                            </button>
                        ` : ''}
                        <button onclick="document.getElementById('sessions-anchor').scrollIntoView({behavior: 'smooth'})" style="background: transparent; border: 2px solid rgba(255,255,255,0.1); color: white; padding: 20px 40px; border-radius: 20px; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 1.1rem;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">Explorer le Programme</button>
                    </div>
                </div>

                <!-- Abstract Decorative Element -->
                <div style="position: absolute; right: 80px; top: 50%; transform: translateY(-50%); width: 300px; height: 300px; background: linear-gradient(135deg, #10b981 0%, #064e3b 100%); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; filter: blur(60px); opacity: 0.2; animation: morph 15s infinite alternate;"></div>
            </div>

            <div id="sessions-anchor" style="padding: 0 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;">
                    <div>
                        <h2 style="font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.04em;">Calendrier <span style="color: #10b981;">Interactif</span></h2>
                        <p style="color: #64748b; font-size: 1.1rem; margin-top: 8px;">Ne manquez aucune opportunité de croissance.</p>
                    </div>
                    <div style="display: flex; gap: 12px; background: #f1f5f9; padding: 6px; border-radius: 14px;">
                        <button class="filter-btn active">Tout</button>
                        <button class="filter-btn">Live</button>
                        <button class="filter-btn">Replays</button>
                    </div>
                </div>

                <div id="webinars-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 40px;">
                    <div style="text-align: center; padding: 100px; grid-column: 1 / -1;">
                        <div class="splash-loader" style="margin: 0 auto 32px;"></div>
                        <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; letter-spacing: 1px;">PREMIUM LOADING...</h4>
                    </div>
                </div>
            </div>
        `;

        await WebinarModule.loadWebinars();
    },

    /**
     * Load Webinars
     */
    loadWebinars: async () => {
        const listContainer = document.getElementById('webinars-list');
        if (!listContainer) return;

        try {
            const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
            const { data: webinars, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').order('scheduled_at', { ascending: true });

            if (error) throw error;

            if (!webinars || webinars.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align: center; padding: 140px 40px; grid-column: 1 / -1; background: white; border-radius: 48px; border: 1px solid #f1f5f9; box-shadow: 0 20px 60px rgba(0,0,0,0.03);">
                        <div style="font-size: 6rem; margin-bottom: 40px; filter: grayscale(1);">🌌</div>
                        <h4 style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin-bottom: 16px;">Le futur se prépare...</h4>
                        <p style="color: #64748b; font-size: 1.2rem; max-width: 500px; margin: 0 auto; line-height: 1.6;">Revenez très bientôt pour découvrir nos prochaines masterclasses stratégiques.</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = webinars.map(w => WebinarModule.renderWebinarCard(w)).join('');
        } catch (err) {
            console.error(err);
            listContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 80px; color: #ef4444; font-weight: 900;">${err.message}</div>`;
        }
    },

    /**
     * Cinematic Webinar Card
     */
    renderWebinarCard: (webinar) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        const now = new Date();
        const isLive = now >= date && now <= new Date(date.getTime() + 120*60*1000);
        const isPast = now > new Date(date.getTime() + 120*60*1000);

        return `
            <div class="premium-webinar-card" style="background: white; border-radius: 40px; overflow: hidden; transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid #f1f5f9; position: relative; height: 100%; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.03);">
                <div style="height: 240px; background: #0f172a; position: relative; overflow: hidden;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.9) 100%); z-index: 2;"></div>
                    <img src="https://images.unsplash.com/photo-1591115765373-520b7a2d7a42?auto=format&fit=crop&q=80&w=2070" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6; z-index: 1; transition: 0.6s;" class="card-bg">
                    
                    ${isLive ? `
                        <div style="position: absolute; top: 24px; right: 24px; background: #ef4444; color: white; padding: 10px 20px; border-radius: 100px; font-size: 0.8rem; font-weight: 900; letter-spacing: 1px; z-index: 3; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4); display: flex; align-items: center; gap: 8px;">
                            <span class="live-pulse"></span> LIVE
                        </div>
                    ` : (isPast ? `
                        <div style="position: absolute; top: 24px; right: 24px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: white; padding: 10px 20px; border-radius: 100px; font-size: 0.8rem; font-weight: 900; z-index: 3; border: 1px solid rgba(255,255,255,0.2);">REPLAY</div>
                    ` : '')}

                    <div style="position: absolute; bottom: 24px; left: 32px; z-index: 3;">
                        <div style="color: #10b981; font-weight: 900; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase;">${formattedDate} • ${formattedTime}</div>
                    </div>
                </div>

                <div style="padding: 40px; flex-grow: 1; display: flex; flex-direction: column;">
                    <h3 style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin-bottom: 16px; line-height: 1.2; letter-spacing: -0.04em;">${webinar.title}</h3>
                    <p style="color: #64748b; font-size: 1.1rem; line-height: 1.7; margin-bottom: 40px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${webinar.description || 'Une immersion stratégique au cœur de l\'excellence entrepreneuriale.'}</p>
                    
                    <div style="margin-top: auto;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                            <div style="display: flex; align-items: center; gap: 14px;">
                                <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 52px; height: 52px; border-radius: 18px; object-fit: cover; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                                <div>
                                    <div style="font-weight: 900; color: #0f172a; font-size: 1.05rem;">${webinar.profiles?.full_name}</div>
                                    <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 700;">${webinar.profiles?.title || 'Master Expert'}</div>
                                </div>
                            </div>
                        </div>

                        <button onclick="WebinarModule.joinWebinar('${webinar.id}', '${webinar.meeting_link}')" class="join-btn" style="width: 100%; height: 64px; background: ${isLive ? '#ef4444' : (isPast ? '#0f172a' : '#10b981')}; color: white; border-radius: 24px; font-weight: 900; font-size: 1.1rem; cursor: pointer; border: none; transition: 0.4s; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 15px 35px ${isLive ? 'rgba(239, 68, 68, 0.3)' : (isPast ? 'rgba(15, 23, 42, 0.2)' : 'rgba(16, 185, 129, 0.3)')};">
                            ${isLive ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg> ACCÉDER AU LIVE' : 
                              (isPast ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> VOIR LE REPLAY' : 'M\'INSCRIRE À LA SESSION')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Premium Watch View (Cinema Mode)
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
            const { data: webinar, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').eq('id', webinarId).single();
            if (error) throw error;

            const videoId = webinar.meeting_link.includes('v=') ? webinar.meeting_link.split('v=')[1].split('&')[0] : webinar.meeting_link.split('/').pop();
            const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1`;

            container.innerHTML = `
                <div class="theater-view" style="animation: fadeIn 1s ease-out; padding-bottom: 80px;">
                    <!-- Context Bar -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; gap: 24px;">
                        <div style="display: flex; align-items: center; gap: 24px;">
                            <button onclick="window.Router.navigate('#webinars')" class="back-btn"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <div>
                                <h1 style="font-size: 2.8rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.06em; line-height: 1;">${webinar.title}</h1>
                                <div style="display: flex; align-items: center; gap: 12px; margin-top: 10px;">
                                    <div class="live-indicator-tag">DIRECT</div>
                                    <p style="color: #64748b; margin: 0; font-weight: 800; font-size: 1.1rem;">Animé par ${webinar.profiles?.full_name}</p>
                                </div>
                            </div>
                        </div>
                        <div class="presence-tag"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> <span id="attendee-count">... participants</span></div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 420px; gap: 40px;">
                        <div style="display: flex; flex-direction: column; gap: 40px;">
                            <!-- Video Player Glass Case -->
                            <div class="video-container-premium">
                                <iframe width="100%" height="100%" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            
                            <!-- Detailed Info -->
                            <div style="background: white; border-radius: 48px; padding: 60px; border: 1px solid #f1f5f9; box-shadow: 0 30px 100px rgba(0,0,0,0.04);">
                                <h3 style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin-bottom: 24px;">Objectifs de la Masterclass</h3>
                                <p style="color: #475569; line-height: 1.9; font-size: 1.2rem; font-weight: 500;">${webinar.description || 'Une session immersive conçue pour transformer votre vision stratégique.'}</p>
                                
                                <div style="display: flex; gap: 40px; margin-top: 60px; padding-top: 40px; border-top: 1px solid #f1f5f9; align-items: center;">
                                    <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 100px; height: 100px; border-radius: 32px; object-fit: cover; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                                    <div>
                                        <div style="font-size: 1.4rem; font-weight: 950; color: #0f172a;">${webinar.profiles?.full_name}</div>
                                        <div style="color: #10b981; font-weight: 900; font-size: 1.1rem; letter-spacing: 1px; margin-top: 4px;">${webinar.profiles?.title || 'Master Strategist'}</div>
                                        <div style="margin-top: 16px; display: flex; gap: 12px;">
                                            <button class="social-mini-btn">LinkedIn</button>
                                            <button class="social-mini-btn">Bio</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Interaction Engine -->
                        <div class="engagement-engine-dark">
                            <div class="engagement-tabs-luxury">
                                <button onclick="WebinarModule.switchTab('chat')" id="tab-chat" class="lux-tab active">CHAT</button>
                                <button onclick="WebinarModule.switchTab('qa')" id="tab-qa" class="lux-tab">Q&A</button>
                                <button onclick="WebinarModule.switchTab('polls')" id="tab-polls" class="lux-tab">POLLS</button>
                            </div>

                            <div id="panel-chat" class="lux-panel active">
                                <div id="chat-messages" class="lux-scroll-area"></div>
                                <div class="lux-input-box">
                                    <input id="chat-input-live" type="text" placeholder="Interagir en direct...">
                                    <button onclick="WebinarModule.postMessage('${webinarId}')" class="send-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                                </div>
                            </div>

                            <div id="panel-qa" class="lux-panel">
                                <div id="qa-questions" class="lux-scroll-area"></div>
                                <div style="padding: 24px;">
                                    <button onclick="WebinarModule.askQuestion('${webinarId}')" class="lux-action-btn">POSER UNE QUESTION</button>
                                </div>
                            </div>

                            <div id="panel-polls" class="lux-panel">
                                <div id="polls-list" class="lux-scroll-area"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            WebinarModule.initRealtimeInteractions(webinarId, profile);
            WebinarModule.trackAttendance(webinarId);

        } catch (err) {
            container.innerHTML = `<div style="padding: 100px; text-align: center; color: #ef4444;">${err.message}</div>`;
        }
    },

    /**
     * All remaining logic stays functionally the same but fits the new UI
     */
    joinWebinar: (id, link) => {
        if (!link) {
            Swal.fire({ title: 'Accès Bientôt Ouvert', text: 'La salle virtuelle ouvrira 15 minutes avant le début.', icon: 'info', background: '#0f172a', color: '#fff' });
            return;
        }
        if (link.includes('youtube.com') || link.includes('youtu.be')) {
            window.Router.navigate('#webinars?id=' + id);
        } else {
            window.open(link, '_blank');
        }
    },

    switchTab: (tabId) => {
        document.querySelectorAll('.lux-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.lux-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
        document.getElementById(`panel-${tabId}`).classList.add('active');
    },

    initRealtimeInteractions: async (webinarId, profile) => {
        const db = window._supabase;
        const { data: messages } = await db.from('webinar_messages').select('*, profiles(full_name)').eq('webinar_id', webinarId).order('created_at', { ascending: true });
        if (messages) messages.forEach(m => WebinarModule.renderChatMessage(m));

        WebinarModule.activeSubscription = db.channel(`webinar_chat_${webinarId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'webinar_messages', filter: `webinar_id=eq.${webinarId}` }, async (payload) => {
                const { data: fullMsg } = await db.from('webinar_messages').select('*, profiles(full_name)').eq('id', payload.new.id).single();
                if (fullMsg) WebinarModule.renderChatMessage(fullMsg);
            }).subscribe();

        const input = document.getElementById('chat-input-live');
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') WebinarModule.postMessage(webinarId); });
    },

    postMessage: async (webinarId) => {
        const input = document.getElementById('chat-input-live');
        if (!input || !input.value.trim()) return;
        const content = input.value.trim();
        input.value = '';
        await window._supabase.from('webinar_messages').insert([{ webinar_id: webinarId, user_id: window.App.state.session.user.id, content: content }]);
    },

    renderChatMessage: (msg) => {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const isMe = msg.user_id === window.App.state.session?.user?.id;
        const html = `
            <div style="max-width: 85%; align-self: ${isMe ? 'flex-end' : 'flex-start'}; animation: fadeInRight 0.4s ease-out;">
                <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase;">${msg.profiles?.full_name}</div>
                <div style="padding: 16px 22px; border-radius: 24px; background: ${isMe ? '#10b981' : 'rgba(255,255,255,0.08)'}; color: white; font-weight: 500; line-height: 1.5; border: 1px solid ${isMe ? 'transparent' : 'rgba(255,255,255,0.1)'};">
                    ${msg.content}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
        container.scrollTop = container.scrollHeight;
    },

    trackAttendance: async (webinarId) => {
        await window._supabase.from('webinar_attendees').upsert({ webinar_id: webinarId, user_id: window.App.state.session.user.id, attended_at: new Date().toISOString() });
        const { count } = await window._supabase.from('webinar_attendees').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        if (document.getElementById('attendee-count')) document.getElementById('attendee-count').textContent = `${count} participants`;
    },

    openCreateModal: () => {
        Swal.fire({
            title: 'PLANIFIER UN LIVE',
            html: `
                <div style="text-align: left; display: grid; gap: 20px; padding-top: 20px;">
                    <div><label style="font-weight: 900; font-size: 0.8rem; color: #64748b;">TITRE STRATÉGIQUE</label><input id="sw-title" class="swal2-input" style="width: 100%; margin: 8px 0; border-radius: 12px;" placeholder="Ex: Masterclass: L'art du Closing"></div>
                    <div><label style="font-weight: 900; font-size: 0.8rem; color: #64748b;">DESCRIPTION D'IMPACT</label><textarea id="sw-desc" class="swal2-textarea" style="width: 100%; margin: 8px 0; border-radius: 12px; height: 100px;" placeholder="Détaillez les objectifs..."></textarea></div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div><label style="font-weight: 900; font-size: 0.8rem; color: #64748b;">DATE ET HEURE</label><input id="sw-date" type="datetime-local" class="swal2-input" style="width: 100%; margin: 8px 0; border-radius: 12px;"></div>
                        <div><label style="font-weight: 900; font-size: 0.8rem; color: #64748b;">LIEN YOUTUBE LIVE</label><input id="sw-link" type="url" class="swal2-input" style="width: 100%; margin: 8px 0; border-radius: 12px;" placeholder="https://..."></div>
                    </div>
                </div>
            `,
            confirmButtonText: 'PUBLIER LE DIRECT',
            confirmButtonColor: '#10b981',
            background: '#0f172a',
            color: '#fff',
            width: '800px',
            padding: '40px',
            preConfirm: () => {
                return {
                    title: document.getElementById('sw-title').value,
                    description: document.getElementById('sw-desc').value,
                    scheduled_at: document.getElementById('sw-date').value,
                    meeting_link: document.getElementById('sw-link').value
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { error } = await window._supabase.from('webinars').insert([{ ...result.value, host_id: window.App.state.session.user.id }]);
                if (error) Swal.fire('Erreur', error.message, 'error');
                else { Swal.fire('Succès', 'Live planifié avec succès !', 'success'); WebinarModule.loadWebinars(); }
            }
        });
    }
};

// Cinematic Style Sheet
const style = document.createElement('style');
style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
    
    .view-section h1, .view-section h2, .view-section h3 { font-family: 'Outfit', sans-serif !important; }

    .webinar-hero button { font-family: 'Outfit', sans-serif; }

    .live-pulse { width: 10px; height: 10px; background: #ef4444; border-radius: 50%; display: inline-block; animation: pulse-live 1.5s infinite; }
    @keyframes pulse-live { 0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }

    @keyframes morph { 0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; } 100% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; } }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }

    .filter-btn { background: transparent; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 800; color: #64748b; cursor: pointer; transition: 0.3s; }
    .filter-btn.active { background: white; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

    .premium-webinar-card:hover { transform: translateY(-15px) scale(1.02); border-color: #10b981; box-shadow: 0 40px 100px rgba(16, 185, 129, 0.15) !important; }
    .premium-webinar-card:hover .card-bg { transform: scale(1.1); opacity: 0.8; }

    .back-btn { background: white; border: 1px solid #e2e8f0; width: 64px; height: 64px; border-radius: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; color: #0f172a; }
    .back-btn:hover { background: #0f172a; color: white; border-color: #0f172a; transform: translateX(-5px); }

    .video-container-premium { aspect-ratio: 16/9; background: #000; border-radius: 56px; overflow: hidden; box-shadow: 0 50px 150px rgba(0,0,0,0.5); border: 10px solid white; position: relative; }
    
    .engagement-engine-dark { background: #0f172a; border-radius: 56px; height: 800px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 40px 100px rgba(0,0,0,0.4); }
    .engagement-tabs-luxury { display: flex; background: rgba(255,255,255,0.03); padding: 12px; }
    .lux-tab { flex: 1; background: transparent; border: none; color: #64748b; padding: 16px; font-weight: 900; font-size: 0.8rem; letter-spacing: 2px; cursor: pointer; border-radius: 20px; transition: 0.3s; }
    .lux-tab.active { background: #10b981; color: white; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
    
    .lux-panel { display: none; flex-direction: column; flex-grow: 1; height: calc(100% - 80px); }
    .lux-panel.active { display: flex; }
    .lux-scroll-area { flex-grow: 1; overflow-y: auto; padding: 32px; display: flex; flex-direction: column; gap: 20px; }
    .lux-input-box { padding: 32px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); position: relative; }
    .lux-input-box input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 20px 70px 20px 28px; color: white; font-size: 1.1rem; outline: none; transition: 0.3s; }
    .lux-input-box input:focus { border-color: #10b981; background: rgba(255,255,255,0.1); }
    
    .presence-tag { background: #f1f5f9; padding: 14px 28px; border-radius: 20px; display: flex; align-items: center; gap: 12px; font-weight: 900; color: #0f172a; font-size: 1.1rem; }
    .live-indicator-tag { background: #ef4444; color: white; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 0.8rem; letter-spacing: 1.5px; animation: pulse 1s infinite; }
    
    .social-mini-btn { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 10px; font-size: 0.8rem; font-weight: 800; color: #64748b; cursor: pointer; transition: 0.2s; }
    .social-mini-btn:hover { background: #0f172a; color: white; }
`;
document.head.appendChild(style);

window.WebinarModule = WebinarModule;

