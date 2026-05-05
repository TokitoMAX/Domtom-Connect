/**
 * Domtom Connect - Webinar Module
 * THE DESIRABILITY UPGRADE: Simple, Reliable & "Wow" Experience
 */
const WebinarModule = {
    role: null,
    activeSubscription: null,
    activeQASubscription: null,
    activePollSubscription: null,
    activeCTASubscription: null,
    jitsiApi: null,

    /**
     * Initialize Module
     */
    init: (role) => {
        WebinarModule.role = role;
    },

    getDb: () => {
        return window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
    },

    /**
     * Module Router
     */
    route: async (view_id, container, profile, session, params) => {
        const target = container || document.getElementById('webinars-view') || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        // Cleanup
        if (WebinarModule.jitsiApi) { WebinarModule.jitsiApi.dispose(); WebinarModule.jitsiApi = null; }
        WebinarModule.cleanupSubscriptions();

        const watchId = params ? params.get('id') : null;

        if (watchId) {
            WebinarModule.renderWatchView(target, watchId, profile, session);
        } else {
            WebinarModule.renderWebinarsList(target, profile, session);
        }
    },

    cleanupSubscriptions: () => {
        [WebinarModule.activeSubscription, WebinarModule.activeQASubscription, WebinarModule.activePollSubscription, WebinarModule.activeCTASubscription]
            .forEach(s => { if (s) s.unsubscribe(); });
        WebinarModule.activeSubscription = null;
        WebinarModule.activeQASubscription = null;
        WebinarModule.activePollSubscription = null;
        WebinarModule.activeCTASubscription = null;
    },

    /**
     * Render Webinars List - Ultra Clean & Inviting
     */
    renderWebinarsList: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="webinar-container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; animation: fadeIn 0.5s ease-out;">
                
                <!-- Hero Section - Giving "Envie" -->
                <div class="webinar-hero-clean">
                    <div class="hero-content">
                        <div class="badge-new">EXCLUSIF</div>
                        <h1>Le savoir en <span class="gradient-text">Immersion.</span></h1>
                        <p>Découvrez les masterclasses des meilleurs experts. Une technologie fiable, une interaction totale.</p>
                        ${WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur' ? `
                            <button onclick="WebinarModule.openCreateModal()" class="btn-hero">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                Lancer mon Live
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0;">Sessions à venir</h2>
                    <div class="filter-group">
                        <button class="filter-pill active">Tous</button>
                        <button class="filter-pill">Direct</button>
                        <button class="filter-pill">Replays</button>
                    </div>
                </div>

                <div id="webinars-list" class="premium-grid-webinar">
                    <div style="text-align: center; padding: 100px; grid-column: 1 / -1;">
                        <div class="loader-wave"><span></span><span></span><span></span><span></span></div>
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
            const db = WebinarModule.getDb();
            const { data: webinars, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').order('scheduled_at', { ascending: true });

            if (error) throw error;

            if (!webinars || webinars.length === 0) {
                listContainer.innerHTML = `
                    <div class="empty-state-v2">
                        <div class="empty-icon">🎬</div>
                        <h3>Le programme se prépare...</h3>
                        <p>Revenez très bientôt pour découvrir nos prochaines masterclasses stratégiques.</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = webinars.map(w => WebinarModule.renderWebinarCard(w)).join('');
        } catch (err) {
            listContainer.innerHTML = `<div class="error-box-clean">${err.message}</div>`;
        }
    },

    /**
     * Webinar Card - High CTR Design
     */
    renderWebinarCard: (webinar) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const now = new Date();
        const isLive = now >= date && now <= new Date(date.getTime() + 120*60*1000);

        return `
            <div class="webinar-card-v2" onclick="window.Router.navigate('#webinars?id=${webinar.id}')">
                <div class="card-image-box">
                    <div class="image-overlay"></div>
                    <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=600" alt="Webinar">
                    ${isLive ? `<div class="live-tag-v2"><span class="dot"></span> DIRECT</div>` : `<div class="date-tag-v2">${formattedDate}</div>`}
                </div>
                <div class="card-content-v2">
                    <div class="card-time-v2">${formattedTime} • Salle Virtuelle</div>
                    <h3 class="card-title-v2">${webinar.title}</h3>
                    <div class="card-footer-v2">
                        <div class="host-badge">
                            <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" alt="Host">
                            <span>${webinar.profiles?.full_name}</span>
                        </div>
                        <div class="join-icon-v2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render Watch View (The "Wow" Experience)
     */
    renderWatchView: async (container, webinarId, profile, session) => {
        if (!container) return;

        try {
            const db = WebinarModule.getDb();
            const { data: webinar, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').eq('id', webinarId).single();
            if (error) throw error;

            const now = new Date();
            const scheduledAt = new Date(webinar.scheduled_at);
            const isTooEarly = now < new Date(scheduledAt.getTime() - 15*60*1000); // More than 15 mins early
            const isHost = webinar.host_id === session.user.id;

            // 1. WAITING ROOM - If too early, show a beautiful waiting screen
            if (isTooEarly && !isHost) {
                container.innerHTML = WebinarModule.renderWaitingRoom(webinar, scheduledAt);
                return;
            }

            // 2. LIVE STAGE - The actual interface
            container.innerHTML = `
                <div class="webinar-stage-v2">
                    <!-- CTA Layer (High Conversion) -->
                    <div id="cta-overlay" class="cta-overlay-v2"></div>

                    <div class="stage-header-v2">
                        <div class="header-left">
                            <button onclick="window.Router.navigate('#webinars')" class="btn-circle-back"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
                            <div class="header-info">
                                <h1>${webinar.title}</h1>
                                <div class="header-meta">
                                    <span class="live-indicator">● LIVE</span>
                                    <span class="viewer-count"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> <span id="attendee-count">...</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="header-right">
                            ${isHost ? `
                                <div class="host-tools-v2">
                                    <button onclick="WebinarModule.openPollManager('${webinarId}')" class="btn-host-tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 20v-6M6 20V10M18 20V4"/></svg> Sondage</button>
                                    <button onclick="WebinarModule.openCTAManager('${webinarId}')" class="btn-host-tool cta"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg> Offre Live</button>
                                </div>
                            ` : `
                                <button onclick="WebinarModule.shareWebinar('${webinarId}')" class="btn-share-v2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg> Inviter</button>
                            `}
                        </div>
                    </div>

                    <div class="stage-grid-v2">
                        <div class="video-section-v2">
                            <div id="jitsi-container" class="video-main-box">
                                <div class="video-loader-v2">Initialisation du moteur vidéo sécurisé...</div>
                            </div>
                        </div>

                        <div class="interaction-section-v2">
                            <div class="interaction-tabs-v2">
                                <button onclick="WebinarModule.switchTab('chat')" id="tab-chat" class="tab-btn-v2 active">Chat</button>
                                <button onclick="WebinarModule.switchTab('qa')" id="tab-qa" class="tab-btn-v2">Q&A</button>
                                <button onclick="WebinarModule.switchTab('polls')" id="tab-polls" class="tab-btn-v2">Sondages</button>
                            </div>

                            <div id="panel-chat" class="interaction-panel-v2 active">
                                <div id="chat-messages" class="chat-flow-v2"></div>
                                <div class="chat-composer-v2">
                                    <input id="chat-input-live" type="text" placeholder="Réagir au live...">
                                    <button onclick="WebinarModule.postMessage('${webinarId}')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>
                                </div>
                            </div>

                            <div id="panel-qa" class="interaction-panel-v2">
                                <div id="qa-questions" class="qa-flow-v2"></div>
                                <div class="panel-footer-v2">
                                    <button onclick="WebinarModule.askQuestion('${webinarId}')" class="btn-primary-v2">Poser une question</button>
                                </div>
                            </div>

                            <div id="panel-polls" class="interaction-panel-v2">
                                <div id="polls-list" class="poll-flow-v2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            WebinarModule.initJitsiRoom(webinarId, profile, isHost);
            WebinarModule.initRealtimeInteractions(webinarId, profile);
            WebinarModule.loadPolls(webinarId);
            WebinarModule.loadQuestions(webinarId);
            WebinarModule.trackAttendance(webinarId);

        } catch (err) {
            container.innerHTML = `<div class="error-box-clean">${err.message}</div>`;
        }
    },

    /**
     * Render a beautiful Waiting Room
     */
    renderWaitingRoom: (webinar, scheduledAt) => {
        const timeStr = scheduledAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="waiting-room-v2" style="background: radial-gradient(circle at top right, #1e293b, #0f172a); min-height: 80vh; display: flex; align-items: center; justify-content: center; border-radius: 40px; margin: 20px; animation: fadeIn 0.8s ease-out;">
                <div style="text-align: center; color: white; max-width: 600px;">
                    <div style="font-size: 0.85rem; font-weight: 900; color: #10b981; letter-spacing: 3px; margin-bottom: 24px;">PRÉPARATION DU DIRECT</div>
                    <h1 style="font-size: 3rem; font-weight: 950; margin-bottom: 24px; letter-spacing: -2px;">${webinar.title}</h1>
                    <p style="color: #94a3b8; font-size: 1.2rem; line-height: 1.6; margin-bottom: 48px;">Nous nous installons... La session débutera précisément à <span style="color: white; font-weight: 800;">${timeStr}</span>. Préparez vos questions !</p>
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 24px;">
                        <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 80px; height: 80px; border-radius: 24px; border: 4px solid rgba(255,255,255,0.1);">
                        <div style="text-align: left;">
                            <div style="font-weight: 800; font-size: 1.1rem;">${webinar.profiles?.full_name}</div>
                            <div style="color: #64748b; font-size: 0.9rem;">Organisateur de la Masterclass</div>
                        </div>
                    </div>
                    
                    <div class="loading-bar-v2" style="margin-top: 60px;">
                        <div class="loading-fill-v2"></div>
                    </div>
                    <button onclick="window.Router.navigate('#webinars')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 12px 24px; border-radius: 12px; margin-top: 40px; cursor: pointer;">Retour au programme</button>
                </div>
            </div>
        `;
    },

    /**
     * Native Video Room Initialization (Jitsi Meet - Reliable API)
     */
    initJitsiRoom: (id, profile, isHost) => {
        const domain = "meet.jit.si";
        const options = {
            roomName: "DomtomConnect_" + id.replace(/-/g, '_'),
            width: "100%", height: "100%",
            parentNode: document.querySelector('#jitsi-container'),
            userInfo: { displayName: profile.full_name },
            configOverwrite: {
                prejoinPageEnabled: false,
                disableDeepLinking: true,
                startWithAudioMuted: !isHost,
                startWithVideoMuted: !isHost,
                disableChat: true,
                disablePolls: true,
                enableWelcomePage: false,
                toolbarButtons: isHost ? ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'recording', 'settings', 'raisehand'] : ['microphone', 'camera', 'fullscreen', 'hangup', 'raisehand']
            },
            interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false, DEFAULT_REMOTE_DISPLAY_NAME: 'Participant' }
        };

        if (window.JitsiMeetExternalAPI) { 
            WebinarModule.jitsiApi = new window.JitsiMeetExternalAPI(domain, options); 
        } else {
            document.getElementById('jitsi-container').innerHTML = `<div class="error-box-clean">Erreur lors du chargement de l'API vidéo. Veuillez rafraîchir la page.</div>`;
        }
    },

    switchTab: (tabId) => {
        document.querySelectorAll('.tab-btn-v2').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.interaction-panel-v2').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
        document.getElementById(`panel-${tabId}`).classList.add('active');
    },

    /**
     * Real-time Synchronization
     */
    initRealtimeInteractions: async (webinarId, profile) => {
        const db = WebinarModule.getDb();
        if (!db) return;

        // 1. Messages
        const { data: messages } = await db.from('webinar_messages').select('*, profiles(full_name)').eq('webinar_id', webinarId).order('created_at', { ascending: true });
        if (messages) messages.forEach(m => WebinarModule.renderChatMessage(m));

        WebinarModule.activeSubscription = db.channel(`webinar_chat_${webinarId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'webinar_messages', filter: `webinar_id=eq.${webinarId}` }, async (payload) => {
                const { data: fullMsg } = await db.from('webinar_messages').select('*, profiles(full_name)').eq('id', payload.new.id).single();
                if (fullMsg) WebinarModule.renderChatMessage(fullMsg);
            }).subscribe();

        // 2. Polls
        WebinarModule.activePollSubscription = db.channel(`webinar_polls_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_polls', filter: `webinar_id=eq.${webinarId}` }, () => { WebinarModule.loadPolls(webinarId); })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_poll_votes' }, () => { WebinarModule.loadPolls(webinarId); })
            .subscribe();

        // 3. CTA (Offers)
        WebinarModule.activeCTASubscription = db.channel(`webinar_cta_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_ctas', filter: `webinar_id=eq.${webinarId}` }, (payload) => {
                if (payload.new && payload.new.is_active) { WebinarModule.showCTAOverlay(payload.new); }
                else { document.getElementById('cta-overlay').classList.remove('active'); }
            }).subscribe();

        const input = document.getElementById('chat-input-live');
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') WebinarModule.postMessage(webinarId); });
    },

    postMessage: async (webinarId) => {
        const input = document.getElementById('chat-input-live');
        if (!input || !input.value.trim()) return;
        const content = input.value.trim();
        input.value = '';
        await WebinarModule.getDb().from('webinar_messages').insert([{ webinar_id: webinarId, user_id: window.App.state.session.user.id, content: content }]);
    },

    renderChatMessage: (msg) => {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const isMe = msg.user_id === window.App.state.session?.user?.id;
        container.insertAdjacentHTML('beforeend', `<div class="msg-bubble-v2 ${isMe ? 'me' : ''}"><div class="sender-v2">${msg.profiles?.full_name}</div><div class="text-v2">${msg.content}</div></div>`);
        container.scrollTop = container.scrollHeight;
    },

    askQuestion: async (webinarId) => {
        const { value: question } = await Swal.fire({ title: 'Poser une question', input: 'textarea', inputPlaceholder: 'Votre question à l\'expert...', confirmButtonText: 'Envoyer', confirmButtonColor: '#10b981' });
        if (question) { await WebinarModule.getDb().from('webinar_questions').insert([{ webinar_id: webinarId, user_id: window.App.state.session.user.id, question: question }]); }
    },

    loadQuestions: async (webinarId) => {
        const container = document.getElementById('qa-questions');
        if (!container) return;
        const { data: questions } = await WebinarModule.getDb().from('webinar_questions').select('*, profiles(full_name)').eq('webinar_id', webinarId).order('upvotes', { ascending: false });
        if (questions) {
            container.innerHTML = questions.map(q => `
                <div class="qa-card-v2">
                    <div class="qa-card-header"><span>${q.profiles?.full_name}</span> <button onclick="WebinarModule.upvoteQuestion('${q.id}', '${webinarId}')">👍 ${q.upvotes || 0}</button></div>
                    <p>${q.question}</p>
                </div>
            `).join('');
        }
    },

    upvoteQuestion: async (questionId, webinarId) => {
        const db = WebinarModule.getDb();
        const { data } = await db.from('webinar_questions').select('upvotes').eq('id', questionId).single();
        await db.from('webinar_questions').update({ upvotes: (data.upvotes || 0) + 1 }).eq('id', questionId);
        WebinarModule.loadQuestions(webinarId);
    },

    loadPolls: async (webinarId) => {
        const container = document.getElementById('polls-list');
        if (!container) return;
        const db = WebinarModule.getDb();
        const { data: polls } = await db.from('webinar_polls').select('*, webinar_poll_options(*)').eq('webinar_id', webinarId).order('created_at', { ascending: false });
        if (!polls || polls.length === 0) { container.innerHTML = `<div class="empty-mini">Aucun sondage en cours.</div>`; return; }

        container.innerHTML = polls.map(poll => `
            <div class="poll-v2">
                <div class="poll-q-v2">${poll.question}</div>
                ${poll.webinar_poll_options.map(opt => {
                    const total = poll.webinar_poll_options.reduce((acc, o) => acc + (o.votes_count || 0), 0);
                    const percent = total > 0 ? Math.round((opt.votes_count / total) * 100) : 0;
                    return `<div class="poll-opt-v2" onclick="WebinarModule.votePoll('${poll.id}', '${opt.id}', '${webinarId}')"><div class="poll-fill-v2" style="width:${percent}%"></div><div class="poll-label-v2"><span>${opt.option_text}</span> <span>${percent}%</span></div></div>`;
                }).join('')}
            </div>
        `).join('');
    },

    votePoll: async (pollId, optionId, webinarId) => {
        const db = WebinarModule.getDb();
        const { error } = await db.from('webinar_poll_votes').insert([{ poll_id: pollId, option_id: optionId, user_id: window.App.state.session.user.id }]);
        if (error) { Swal.fire({ title: 'Déjà voté', text: 'Participation enregistrée.', icon: 'info', timer: 1500, showConfirmButton: false }); return; }
        const { data } = await db.from('webinar_poll_options').select('votes_count').eq('id', optionId).single();
        await db.from('webinar_poll_options').update({ votes_count: (data.votes_count || 0) + 1 }).eq('id', optionId);
        WebinarModule.loadPolls(webinarId);
    },

    showCTAOverlay: (cta) => {
        const overlay = document.getElementById('cta-overlay');
        if (!overlay) return;
        overlay.innerHTML = `
            <div class="cta-box-v2">
                <div class="cta-tag-v2">OFFRE EXCLUSIVE</div>
                <h3>${cta.title}</h3>
                <a href="${cta.link_url}" target="_blank" class="cta-btn-v2">${cta.button_text}</a>
                <button onclick="this.parentElement.parentElement.classList.remove('active')" class="cta-close-v2">Fermer</button>
            </div>
        `;
        overlay.classList.add('active');
    },

    shareWebinar: (id) => {
        const url = `${window.location.origin}/mon-espace/webinars?id=${id}`;
        navigator.clipboard.writeText(url);
        Swal.fire({ title: 'Lien copié !', text: 'Partagez ce lien avec vos invités.', icon: 'success', timer: 2000, showConfirmButton: false });
    },

    trackAttendance: async (webinarId) => {
        const db = WebinarModule.getDb();
        await db.from('webinar_attendees').upsert({ webinar_id: webinarId, user_id: window.App.state.session.user.id, attended_at: new Date().toISOString() });
        const { count } = await db.from('webinar_attendees').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        if (document.getElementById('attendee-count')) document.getElementById('attendee-count').textContent = `${count} participants`;
    },

    openPollManager: (webinarId) => {
        Swal.fire({
            title: 'Lancer un Sondage',
            html: `<div style="text-align:left;"><input id="p-q" class="swal2-input" placeholder="Question"><input id="p-o1" class="swal2-input" placeholder="Option 1"><input id="p-o2" class="swal2-input" placeholder="Option 2"></div>`,
            confirmButtonText: 'LANCER', preConfirm: () => { return { q: document.getElementById('p-q').value, o: [document.getElementById('p-o1').value, document.getElementById('p-o2').value] } }
        }).then(async (r) => {
            if (r.isConfirmed) {
                const db = WebinarModule.getDb();
                const { data: poll } = await db.from('webinar_polls').insert([{ webinar_id: webinarId, question: r.value.q }]).select().single();
                if (poll) { await db.from('webinar_poll_options').insert(r.value.o.map(o => ({ poll_id: poll.id, option_text: o }))); WebinarModule.loadPolls(webinarId); }
            }
        });
    },

    openCTAManager: (webinarId) => {
        Swal.fire({
            title: 'Déclencher une Offre',
            html: `<div style="text-align:left;"><input id="c-t" class="swal2-input" placeholder="Titre de l'offre"><input id="c-b" class="swal2-input" placeholder="Texte bouton"><input id="c-u" class="swal2-input" placeholder="URL"></div>`,
            confirmButtonText: 'ACTIVER', preConfirm: () => { return { title: document.getElementById('c-t').value, button_text: document.getElementById('c-b').value, link_url: document.getElementById('c-u').value, is_active: true } }
        }).then(async (r) => {
            if (r.isConfirmed) {
                const db = WebinarModule.getDb();
                await db.from('webinar_ctas').update({ is_active: false }).eq('webinar_id', webinarId);
                await db.from('webinar_ctas').insert([{ webinar_id: webinarId, ...r.value }]);
            }
        });
    },

    openCreateModal: () => {
        Swal.fire({
            title: 'CRÉER UNE MASTERCLASS',
            html: `<div style="text-align:left; display:grid; gap:16px;"><input id="sw-t" class="swal2-input" placeholder="Titre"><textarea id="sw-d" class="swal2-textarea" placeholder="Objectifs..."></textarea><input id="sw-dt" type="datetime-local" class="swal2-input"></div>`,
            confirmButtonText: 'PUBLIER', confirmButtonColor: '#10b981', preConfirm: () => { return { title: document.getElementById('sw-t').value, description: document.getElementById('sw-d').value, scheduled_at: document.getElementById('sw-dt').value, meeting_link: 'NATIVE_P2P' } }
        }).then(async (r) => {
            if (r.isConfirmed) { await WebinarModule.getDb().from('webinars').insert([{ ...r.value, host_id: window.App.state.session.user.id }]); WebinarModule.loadWebinars(); }
        });
    }
};

// ULTRA-PREMIUM V2 STYLES
const style = document.createElement('style');
style.textContent = `
    .webinar-hero-clean { background: #0f172a; border-radius: 40px; padding: 80px; margin-bottom: 60px; color: white; position: relative; overflow: hidden; }
    .hero-content { position: relative; z-index: 2; max-width: 600px; }
    .hero-content h1 { font-size: 3.5rem; font-weight: 950; margin: 0 0 20px 0; letter-spacing: -3px; line-height: 1; }
    .gradient-text { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .badge-new { background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 14px; border-radius: 100px; font-weight: 900; font-size: 0.7rem; letter-spacing: 2px; display: inline-block; margin-bottom: 24px; }
    .btn-hero { background: #10b981; color: white; border: none; padding: 18px 36px; border-radius: 16px; font-weight: 900; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; gap: 12px; margin-top: 40px; transition: 0.3s; }
    .btn-hero:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3); }

    .premium-grid-webinar { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 32px; }
    .webinar-card-v2 { background: white; border-radius: 30px; overflow: hidden; cursor: pointer; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid #f1f5f9; position: relative; height: 100%; display: flex; flex-direction: column; }
    .webinar-card-v2:hover { transform: translateY(-12px); border-color: #10b981; box-shadow: 0 30px 60px rgba(0,0,0,0.05); }

    .card-image-box { height: 200px; position: relative; overflow: hidden; }
    .card-image-box img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
    .webinar-card-v2:hover .card-image-box img { transform: scale(1.1); }
    .live-tag-v2 { position: absolute; top: 20px; right: 20px; background: #ef4444; color: white; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 0.7rem; display: flex; align-items: center; gap: 6px; }
    .live-tag-v2 .dot { width: 8px; height: 8px; background: white; border-radius: 50%; animation: pulse 1s infinite; }

    .card-content-v2 { padding: 28px; flex-grow: 1; display: flex; flex-direction: column; }
    .card-title-v2 { font-size: 1.4rem; font-weight: 900; color: #0f172a; margin: 12px 0 24px 0; line-height: 1.3; }
    .card-footer-v2 { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
    .host-badge { display: flex; align-items: center; gap: 10px; }
    .host-badge img { width: 36px; height: 36px; border-radius: 12px; }
    .host-badge span { font-weight: 700; color: #64748b; font-size: 0.9rem; }

    .webinar-stage-v2 { max-width: 1500px; margin: 0 auto; padding: 20px; animation: fadeIn 0.8s ease-out; }
    .stage-header-v2 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header-left { display: flex; align-items: center; gap: 20px; }
    .btn-circle-back { width: 50px; height: 50px; border-radius: 50%; border: 1px solid #e2e8f0; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
    .btn-circle-back:hover { background: #0f172a; color: white; transform: translateX(-5px); }
    .header-info h1 { font-size: 1.8rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -1px; }
    .header-meta { display: flex; gap: 16px; margin-top: 4px; }
    .live-indicator { color: #ef4444; font-weight: 900; font-size: 0.8rem; }

    .stage-grid-v2 { display: grid; grid-template-columns: 1fr 400px; gap: 32px; height: 780px; }
    .video-main-box { background: #000; border-radius: 32px; height: 100%; position: relative; overflow: hidden; border: 8px solid #0f172a; box-shadow: 0 40px 100px rgba(0,0,0,0.2); }
    .video-loader-v2 { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #475569; font-weight: 700; }

    .interaction-section-v2 { background: white; border: 1px solid #e2e8f0; border-radius: 32px; display: flex; flex-direction: column; overflow: hidden; }
    .interaction-tabs-v2 { display: flex; padding: 12px; gap: 8px; border-bottom: 1px solid #f1f5f9; }
    .tab-btn-v2 { flex: 1; border: none; background: transparent; padding: 14px; font-weight: 900; font-size: 0.75rem; color: #64748b; cursor: pointer; border-radius: 12px; transition: 0.3s; }
    .tab-btn-v2.active { background: #f1f5f9; color: #0f172a; }

    .interaction-panel-v2 { display: none; flex-direction: column; flex-grow: 1; height: calc(100% - 60px); }
    .interaction-panel-v2.active { display: flex; }
    .chat-flow-v2 { flex-grow: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .msg-bubble-v2 { max-width: 85%; }
    .msg-bubble-v2.me { align-self: flex-end; }
    .sender-v2 { font-size: 0.65rem; font-weight: 900; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; }
    .text-v2 { background: #f1f5f9; padding: 12px 18px; border-radius: 20px; font-size: 0.95rem; color: #334155; }
    .msg-bubble-v2.me .text-v2 { background: #10b981; color: white; }
    .msg-bubble-v2.me .sender-v2 { text-align: right; }

    .cta-overlay-v2 { position: absolute; top: 120px; left: 50%; transform: translateX(-50%); z-index: 1000; width: 450px; display: none; }
    .cta-overlay-v2.active { display: block; animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .cta-box-v2 { background: white; border-radius: 32px; padding: 40px; text-align: center; border: 3px solid #10b981; box-shadow: 0 50px 150px rgba(0,0,0,0.3); }
    .cta-btn-v2 { display: inline-block; background: #10b981; color: white; padding: 16px 40px; border-radius: 16px; font-weight: 900; text-decoration: none; margin: 24px 0; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }

    .loading-bar-v2 { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
    .loading-fill-v2 { width: 40%; height: 100%; background: #10b981; animation: loading-slide 3s infinite; }
    @keyframes loading-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
    @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
`;
document.head.appendChild(style);

window.WebinarModule = WebinarModule;
