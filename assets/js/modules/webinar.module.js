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
        // Load CSS if not already present
        if (!document.getElementById('webinar-css')) {
            const link = document.createElement('link');
            link.id = 'webinar-css';
            link.rel = 'stylesheet';
            link.href = './assets/css/webinar.css';
            document.head.appendChild(link);
        }

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
        [WebinarModule.activeSubscription, WebinarModule.activeQASubscription, WebinarModule.activePollSubscription, WebinarModule.activeCTASubscription, WebinarModule.activeReactionSubscription, WebinarModule.activeStatusSubscription]
            .forEach(s => { if (s) s.unsubscribe(); });
        WebinarModule.activeSubscription = null;
        WebinarModule.activeQASubscription = null;
        WebinarModule.activePollSubscription = null;
        WebinarModule.activeCTASubscription = null;
        WebinarModule.activeReactionSubscription = null;
        WebinarModule.activeStatusSubscription = null;
    },

    /**
     * Render Webinars List - With Registration Flow
     */
    renderWebinarsList: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="webinar-container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; animation: fadeIn 0.5s ease-out;">
                
                <div class="webinar-hero-clean">
                    <div class="hero-content">
                        <div class="badge-new">EXCLUSIF</div>
                        <h1>Le savoir en <span class="gradient-text">Direct.</span></h1>
                        <p>Participez aux masterclasses en live ou accédez aux replays exclusifs de notre communauté d'experts.</p>
                        ${WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur' ? `
                            <button onclick="WebinarModule.openCreateModal()" class="btn-hero">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                Programmer une Session
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0;">Programme des Masterclasses</h2>
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

    loadWebinars: async () => {
        const listContainer = document.getElementById('webinars-list');
        if (!listContainer) return;

        try {
            const db = WebinarModule.getDb();
            const userId = window.App.state.session?.user?.id;
            
            const { data: webinars, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title), webinar_attendees(user_id)').order('scheduled_at', { ascending: true });

            if (error) throw error;

            if (!webinars || webinars.length === 0) {
                listContainer.innerHTML = `<div class="empty-state-v2"><h3>Le programme arrive...</h3></div>`;
                return;
            }

            listContainer.innerHTML = webinars.map(w => {
                const isRegistered = w.webinar_attendees?.some(a => a.user_id === userId);
                return WebinarModule.renderWebinarCard(w, isRegistered);
            }).join('');
        } catch (err) {
            listContainer.innerHTML = `<div class="error-box-clean">${err.message}</div>`;
        }
    },

    renderWebinarCard: (webinar, isRegistered) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const isLive = webinar.status === 'live';
        const isFinished = webinar.status === 'finished';

        return `
            <div class="webinar-card-v2" onclick="${(isRegistered || isLive || isFinished) ? `window.Router.navigate('#webinars?id=${webinar.id}')` : `WebinarModule.registerUser('${webinar.id}')`}">
                <div class="card-image-box">
                    <div class="image-overlay"></div>
                    <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=600" alt="Webinar">
                    ${isLive ? `<div class="live-tag-v2"><span class="dot"></span> DIRECT</div>` : isFinished ? `<div class="date-tag-v2" style="background:#64748b;">REPLAY</div>` : `<div class="date-tag-v2">${formattedDate}</div>`}
                </div>
                <div class="card-content-v2">
                    <div class="card-time-v2">${formattedTime} • ${isLive ? 'Session en cours' : isFinished ? 'Session terminée' : 'Prochaine session'}</div>
                    <h3 class="card-title-v2">${webinar.title}</h3>
                    <div class="card-footer-v2">
                        <div class="host-badge">
                            <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" alt="Host">
                            <span>${webinar.profiles?.full_name}</span>
                        </div>
                        <div class="join-icon-v2">
                            ${(isRegistered || isLive || isFinished) ? `
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            ` : `
                                <span style="font-size:0.7rem; font-weight:900; color:#10b981;">S'INSCRIRE</span>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    registerUser: async (webinarId) => {
        const db = WebinarModule.getDb();
        const { error } = await db.from('webinar_attendees').insert([{ webinar_id: webinarId, user_id: window.App.state.session.user.id }]);
        if (!error) {
            Swal.fire({ title: 'Inscription validée !', text: 'Vous recevrez une notification au début du direct.', icon: 'success', timer: 2000, showConfirmButton: false });
            WebinarModule.loadWebinars();
        }
    },

    /**
     * Render Watch View - Status Driven
     */
    renderWatchView: async (container, webinarId, profile, session) => {
        if (!container) return;

        try {
            const db = WebinarModule.getDb();
            const { data: webinar, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').eq('id', webinarId).single();
            if (error) throw error;

            const isHost = webinar.host_id === session.user.id;

            // 1. REPLAY MODE
            if (webinar.status === 'finished') {
                container.innerHTML = WebinarModule.renderReplayView(webinar);
                return;
            }

            // 2. WAITING MODE (Host hasn't started yet)
            if (webinar.status === 'scheduled' && !isHost) {
                container.innerHTML = WebinarModule.renderWaitingRoom(webinar, new Date(webinar.scheduled_at));
                WebinarModule.initStatusSync(webinarId, profile, session);
                return;
            }

            // 3. LIVE STAGE
            container.innerHTML = `
                <div class="webinar-stage-v2">
                    <div id="cta-overlay" class="cta-overlay-v2"></div>
                    <div class="stage-header-v2">
                        <div class="header-left">
                            <button onclick="window.Router.navigate('#webinars')" class="btn-circle-back"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
                            <div class="header-info">
                                <h1>${webinar.title}</h1>
                                <div class="header-meta">
                                    <span class="live-indicator" id="live-status-badge">${webinar.status === 'live' ? 'DIRECT' : 'PRÉPARATION'}</span>
                                    <span class="viewer-count"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> <span id="attendee-count">...</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="header-right">
                            <div style="display: flex; gap: 12px;">
                                ${isHost ? `
                                    <div id="host-controls">
                                        ${webinar.status === 'scheduled' ? `
                                            <button onclick="WebinarModule.updateStatus('${webinarId}', 'live')" class="btn-host-tool" style="background:#ef4444; color:white; border:none; padding:10px 24px; font-weight:900;">LANCER LE DIRECT</button>
                                        ` : `
                                            <button onclick="WebinarModule.finishWebinar('${webinarId}')" class="btn-host-tool" style="background:#64748b; color:white; border:none;">TERMINER LE LIVE</button>
                                        `}
                                    </div>
                                    <button onclick="WebinarModule.showHostInsights('${webinarId}')" class="btn-host-tool" style="background:rgba(255,255,255,0.05); color:white; border:1px solid var(--webinar-border);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg> Analyses</button>
                                    <button onclick="WebinarModule.openResourceAdder('${webinarId}')" class="btn-host-tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Ajouter Document</button>
                                    <button onclick="WebinarModule.openPollManager('${webinarId}')" class="btn-host-tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 20v-6M6 20V10M18 20V4"/></svg> Sondage</button>
                                    <button onclick="WebinarModule.openCTAManager('${webinarId}')" class="btn-host-tool cta" style="background:#10b981; color:white; border:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg> Déclencher Offre</button>
                                ` : `
                                    <button onclick="WebinarModule.toggleTheaterMode()" class="btn-host-tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg> Mode Théâtre</button>
                                    <button onclick="WebinarModule.shareWebinar('${webinarId}')" class="btn-share-v2" style="background: rgba(255,255,255,0.05); color:white; border:1px solid var(--webinar-border); padding:10px 20px; border-radius:12px; cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg> Partager</button>
                                `}
                            </div>
                        </div>
                    </div>

                    <div class="stage-grid-v2">
                        <div class="video-section-v2">
                            <div id="jitsi-container" class="video-main-box">
                                <div class="video-loader-v2">Moteur vidéo prêt. En attente du signal...</div>
                            </div>
                            <div id="question-highlight" class="question-highlight-overlay"></div>
                            <div class="reaction-container">
                                <button class="reaction-btn" onclick="WebinarModule.sendReaction('${webinarId}', '❤️')">❤️</button>
                                <button class="reaction-btn" onclick="WebinarModule.sendReaction('${webinarId}', '🔥')">🔥</button>
                                <button class="reaction-btn" onclick="WebinarModule.sendReaction('${webinarId}', '👏')">👏</button>
                                <button class="reaction-btn" onclick="WebinarModule.sendReaction('${webinarId}', '💡')">💡</button>
                            </div>
                            <div id="reaction-stage" style="position: absolute; inset:0; pointer-events:none; overflow:hidden;"></div>
                        </div>

                        <div class="interaction-section-v2" id="interaction-panel">
                            <div class="interaction-tabs-v2">
                                <button onclick="WebinarModule.switchTab('chat')" id="tab-chat" class="tab-btn-v2 active">Chat</button>
                                <button onclick="WebinarModule.switchTab('qa')" id="tab-qa" class="tab-btn-v2">Q&A</button>
                                <button onclick="WebinarModule.switchTab('polls')" id="tab-polls" class="tab-btn-v2">Sondages</button>
                                <button onclick="WebinarModule.switchTab('resources')" id="tab-resources" class="tab-btn-v2">Ressources</button>
                            </div>
                            <div id="panel-chat" class="interaction-panel-v2 active"><div id="chat-messages" class="chat-flow-v2"></div><div class="chat-composer-v2"><input id="chat-input-live" type="text" placeholder="Dites quelque chose..."><button onclick="WebinarModule.postMessage('${webinarId}')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button></div></div>
                            <div id="panel-qa" class="interaction-panel-v2"><div id="qa-questions" class="qa-flow-v2"></div><div class="chat-composer-v2"><input id="qa-input-live" type="text" placeholder="Votre question à l'expert..."><button onclick="WebinarModule.askQuestionInline('${webinarId}')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 19l9 2-2-9-9-9-9 9 2 9 9-2z"/></svg></button></div></div>
                            <div id="panel-polls" class="interaction-panel-v2"><div id="polls-list" class="chat-flow-v2"></div></div>
                            <div id="panel-resources" class="interaction-panel-v2"><div id="resources-list" class="chat-flow-v2"></div></div>
                        </div>
                    </div>
                </div>
            `;

            if (webinar.status === 'live' || isHost) {
                WebinarModule.initJitsiRoom(webinarId, profile, isHost);
            }
            WebinarModule.initRealtimeInteractions(webinarId, profile);
            WebinarModule.loadPolls(webinarId);
            WebinarModule.loadQuestions(webinarId);
            WebinarModule.loadResources(webinarId);
            WebinarModule.trackAttendance(webinarId);

        } catch (err) {
            container.innerHTML = `<div class="error-box-clean">${err.message}</div>`;
        }
    },

    renderReplayView: (webinar) => {
        return `
            <div class="webinar-stage-v2">
                <div class="stage-header-v2">
                    <div class="header-left">
                        <button onclick="window.Router.navigate('#webinars')" class="btn-circle-back"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
                        <div class="header-info">
                            <h1>[REPLAY] ${webinar.title}</h1>
                            <div class="header-meta"><span class="live-indicator" style="background:#64748b;">TERMINÉ</span></div>
                        </div>
                    </div>
                </div>
                <div class="stage-grid-v2">
                    <div class="video-section-v2">
                        ${webinar.replay_url ? `
                            <iframe width="100%" height="100%" src="${webinar.replay_url}" frameborder="0" allowfullscreen></iframe>
                        ` : `
                            <div class="video-loader-v2" style="background:#0f172a; color:white; flex-direction:column; gap:20px;">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                                <span>Le replay sera disponible très prochainement.</span>
                            </div>
                        `}
                    </div>
                    <div class="interaction-section-v2">
                        <div class="interaction-tabs-v2"><button class="tab-btn-v2 active">Ressources & Notes</button></div>
                        <div id="panel-resources" class="interaction-panel-v2 active"><div id="resources-list" class="chat-flow-v2"></div></div>
                    </div>
                </div>
            </div>
        `;
    },

    initStatusSync: (id, profile, session) => {
        WebinarModule.activeStatusSubscription = WebinarModule.getDb().channel(`webinar_status_${id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'webinars', filter: `id=eq.${id}` }, (payload) => {
                if (payload.new.status === 'live') {
                    WebinarModule.renderWatchView(document.getElementById('ecosystem-grid-container'), id, profile, session);
                }
            }).subscribe();
    },

    updateStatus: async (id, status) => {
        await WebinarModule.getDb().from('webinars').update({ status: status }).eq('id', id);
        location.reload(); // Refresh to init Jitsi or Replay
    },

    finishWebinar: async (id) => {
        const { value: url } = await Swal.fire({ title: 'Terminer la session', input: 'text', inputLabel: 'URL du Replay (YouTube/Vimeo)', inputPlaceholder: 'https://...', showCancelButton: true });
        if (url !== undefined) {
            await WebinarModule.getDb().from('webinars').update({ status: 'finished', replay_url: url }).eq('id', id);
            window.Router.navigate('#webinars');
        }
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_poll_options' }, () => { WebinarModule.loadPolls(webinarId); })
            .subscribe();

        // 3. CTA (Offers)
        WebinarModule.activeCTASubscription = db.channel(`webinar_cta_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_ctas', filter: `webinar_id=eq.${webinarId}` }, (payload) => {
                if (payload.new && payload.new.is_active) { WebinarModule.showCTAOverlay(payload.new); }
                else { document.getElementById('cta-overlay').classList.remove('active'); }
            }).subscribe();

        // 4. Reactions
        WebinarModule.activeReactionSubscription = db.channel(`webinar_reactions_${webinarId}`)
            .on('broadcast', { event: 'reaction' }, (payload) => {
                WebinarModule.animateReaction(payload.payload.emoji);
            }).subscribe();

        // 5. Question Highlights
        const { data: highlighted } = await db.from('webinar_questions').select('*, profiles(full_name, avatar_url)').eq('webinar_id', webinarId).eq('is_highlighted', true).limit(1).maybeSingle();
        if (highlighted) WebinarModule.showHighlightOverlay(highlighted);

        db.channel(`webinar_highlights_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_questions', filter: `webinar_id=eq.${webinarId}` }, (payload) => {
                if (payload.new && payload.new.is_highlighted) WebinarModule.fetchAndShowHighlight(payload.new.id);
                else { const el = document.getElementById('question-highlight'); if (el) el.classList.remove('active'); }
            }).subscribe();

        const input = document.getElementById('chat-input-live');
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') WebinarModule.postMessage(webinarId); });
        const qaInput = document.getElementById('qa-input-live');
        if (qaInput) qaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') WebinarModule.askQuestionInline(webinarId); });
    },

    fetchAndShowHighlight: async (id) => {
        const { data } = await WebinarModule.getDb().from('webinar_questions').select('*, profiles(full_name, avatar_url)').eq('id', id).single();
        if (data) WebinarModule.showHighlightOverlay(data);
    },

    showHighlightOverlay: (q) => {
        const overlay = document.getElementById('question-highlight');
        if (!overlay) return;
        overlay.innerHTML = `
            <div class="highlight-user"><img src="${q.profiles?.avatar_url || './assets/images/default-avatar.png'}" alt="User"><span>${q.profiles?.full_name} pose une question</span></div>
            <div class="highlight-text">${q.question}</div>
            <button onclick="WebinarModule.toggleHighlight('${q.id}', false)" style="position:absolute; top:10px; right:10px; background:transparent; border:none; color:rgba(255,255,255,0.3); cursor:pointer;">×</button>
        `;
        overlay.classList.add('active');
    },

    toggleHighlight: async (questionId, state) => {
        const db = WebinarModule.getDb();
        const { data: q } = await db.from('webinar_questions').select('webinar_id').eq('id', questionId).single();
        await db.from('webinar_questions').update({ is_highlighted: false }).eq('webinar_id', q.webinar_id);
        await db.from('webinar_questions').update({ is_highlighted: state }).eq('id', questionId);
        WebinarModule.loadQuestions(q.webinar_id);
    },

    sendReaction: (webinarId, emoji) => {
        const db = WebinarModule.getDb();
        db.channel(`webinar_reactions_${webinarId}`).send({ type: 'broadcast', event: 'reaction', payload: { emoji: emoji } });
        WebinarModule.animateReaction(emoji);
    },

    animateReaction: (emoji) => {
        const stage = document.getElementById('reaction-stage');
        if (!stage) return;
        const div = document.createElement('div');
        div.className = 'floating-emoji';
        div.textContent = emoji;
        div.style.left = (20 + Math.random() * 60) + '%';
        div.style.setProperty('--random-x', (Math.random() * 100 - 50) + 'px');
        stage.appendChild(div);
        setTimeout(() => div.remove(), 2000);
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
        const isSystem = msg.user_id === 'system';
        container.insertAdjacentHTML('beforeend', `<div class="msg-bubble-v2 ${isMe ? 'me' : ''} ${isSystem ? 'system' : ''}">${!isSystem ? `<div class="sender-v2">${msg.profiles?.full_name}</div>` : ''}<div class="text-v2" style="${isSystem ? 'background:rgba(16,185,129,0.1); color:#10b981; border:none; text-align:center; font-size:0.8rem; font-weight:700;' : ''}">${msg.content}</div></div>`);
        container.scrollTop = container.scrollHeight;
    },

    askQuestionInline: async (webinarId) => {
        const input = document.getElementById('qa-input-live');
        if (!input || !input.value.trim()) return;
        const question = input.value.trim();
        input.value = '';
        await WebinarModule.getDb().from('webinar_questions').insert([{ webinar_id: webinarId, user_id: window.App.state.session.user.id, question: question }]);
        WebinarModule.loadQuestions(webinarId);
        Swal.fire({ title: 'Question envoyée', icon: 'success', timer: 1000, showConfirmButton: false });
    },

    loadQuestions: async (webinarId) => {
        const container = document.getElementById('qa-questions');
        if (!container) return;
        const isHost = WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur';
        const { data: questions } = await WebinarModule.getDb().from('webinar_questions').select('*, profiles(full_name, avatar_url)').eq('webinar_id', webinarId).order('upvotes', { ascending: false });
        if (questions) {
            container.innerHTML = questions.map(q => `
                <div class="qa-card-v2" style="background:rgba(255,255,255,0.03); padding:16px; border-radius:16px; border:1px solid ${q.is_highlighted ? 'var(--webinar-accent)' : 'var(--webinar-border)'}; margin-bottom:12px; transition:0.3s;">
                    <div class="qa-card-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><span style="font-size:0.75rem; font-weight:800; color:${q.is_highlighted ? 'var(--webinar-accent)' : 'var(--webinar-text-muted)'};">${q.profiles?.full_name}</span><div style="display:flex; gap:8px;">${isHost ? `<button onclick="WebinarModule.toggleHighlight('${q.id}', ${!q.is_highlighted})" style="background:${q.is_highlighted ? 'var(--webinar-accent)' : 'rgba(255,255,255,0.1)'}; border:none; color:white; padding:4px 8px; border-radius:6px; font-size:0.65rem; font-weight:800; cursor:pointer;">${q.is_highlighted ? 'EN VEDETTE' : 'METTRE EN VEDETTE'}</button>` : ''}<button onclick="WebinarModule.upvoteQuestion('${q.id}', '${webinarId}')" style="background:transparent; border:none; color:white; cursor:pointer; font-weight:800;">👍 ${q.upvotes || 0}</button></div></div>
                    <p style="font-size:0.9rem; margin:0; line-height:1.4; color:${q.is_highlighted ? 'white' : '#cbd5e1'}; font-weight:${q.is_highlighted ? '700' : '400'};">${q.question}</p>
                </div>
            `).join('');
        }
    },

    showHostInsights: async (webinarId) => {
        const db = WebinarModule.getDb();
        const { count: attendees } = await db.from('webinar_attendees').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        const { count: questions } = await db.from('webinar_questions').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        const { count: messages } = await db.from('webinar_messages').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        Swal.fire({ title: 'Analyses en Direct', background: '#0f172a', color: '#f8fafc', html: `<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin-top:24px;"><div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);"><div style="font-size:2rem; font-weight:900; color:#10b981;">${attendees}</div><div style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Participants</div></div><div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);"><div style="font-size:2rem; font-weight:900; color:#3b82f6;">${questions}</div><div style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Questions</div></div><div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);"><div style="font-size:2rem; font-weight:900; color:#f59e0b;">${messages}</div><div style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Messages</div></div></div>`, showConfirmButton: false, showCloseButton: true });
    },

    loadResources: async (webinarId) => {
        // Not implemented yet
    },

    /**
     * Render a beautiful Waiting Room
     */
    renderWaitingRoom: (webinar, scheduledAt) => {
        const timeStr = scheduledAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="waiting-room-v2">
                <div class="waiting-card">
                    <div style="font-size: 0.85rem; font-weight: 900; color: #10b981; letter-spacing: 3px; margin-bottom: 24px;">PRÉPARATION DU DIRECT</div>
                    <h1 style="font-size: 3.5rem; font-weight: 950; margin-bottom: 24px; letter-spacing: -2px; color:white;">${webinar.title}</h1>
                    <p style="color: #94a3b8; font-size: 1.2rem; line-height: 1.6; margin-bottom: 48px;">Nous nous installons... La session débutera précisément à <span style="color: white; font-weight: 800;">${timeStr}</span>.</p>
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 24px; background: rgba(255,255,255,0.03); padding: 24px; border-radius: 32px; border: 1px solid rgba(255,255,255,0.05);">
                        <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 80px; height: 80px; border-radius: 24px; border: 4px solid var(--webinar-accent);">
                        <div style="text-align: left;">
                            <div style="font-weight: 800; font-size: 1.2rem; color:white;">${webinar.profiles?.full_name}</div>
                            <div style="color: #64748b; font-size: 0.9rem;">Organisateur de la Masterclass</div>
                        </div>
                    </div>
                    
                    <button onclick="window.Router.navigate('#webinars')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 16px 32px; border-radius: 16px; margin-top: 60px; cursor: pointer; font-weight:700;">Retour au programme</button>
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
            interfaceConfigOverwrite: { 
                SHOW_JITSI_WATERMARK: false, 
                SHOW_WATERMARK_FOR_GUESTS: false, 
                DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
                TOOLBAR_BUTTONS: isHost ? ['microphone', 'camera', 'desktop', 'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'chat', 'recording', 'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand', 'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'] : ['microphone', 'camera', 'fullscreen', 'hangup', 'raisehand', 'videoquality', 'filmstrip']
            }
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

    toggleTheaterMode: () => {
        const panel = document.getElementById('interaction-panel');
        const grid = document.querySelector('.stage-grid-v2');
        if (panel.style.display === 'none') {
            panel.style.display = 'flex';
            grid.style.gridTemplateColumns = '1fr 400px';
        } else {
            panel.style.display = 'none';
            grid.style.gridTemplateColumns = '1fr';
        }
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_poll_options' }, () => { WebinarModule.loadPolls(webinarId); })
            .subscribe();

        // 3. CTA (Offers)
        WebinarModule.activeCTASubscription = db.channel(`webinar_cta_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_ctas', filter: `webinar_id=eq.${webinarId}` }, (payload) => {
                if (payload.new && payload.new.is_active) { WebinarModule.showCTAOverlay(payload.new); }
                else { document.getElementById('cta-overlay').classList.remove('active'); }
            }).subscribe();

        // 4. Reactions
        WebinarModule.activeReactionSubscription = db.channel(`webinar_reactions_${webinarId}`)
            .on('broadcast', { event: 'reaction' }, (payload) => {
                WebinarModule.animateReaction(payload.payload.emoji);
            }).subscribe();

        // 5. Question Highlights
        const { data: highlighted } = await db.from('webinar_questions').select('*, profiles(full_name, avatar_url)').eq('webinar_id', webinarId).eq('is_highlighted', true).limit(1).maybeSingle();
        if (highlighted) WebinarModule.showHighlightOverlay(highlighted);

        db.channel(`webinar_highlights_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_questions', filter: `webinar_id=eq.${webinarId}` }, (payload) => {
                if (payload.new && payload.new.is_highlighted) {
                    // Fetch full data for overlay
                    WebinarModule.fetchAndShowHighlight(payload.new.id);
                } else {
                    document.getElementById('question-highlight').classList.remove('active');
                }
            }).subscribe();

        const input = document.getElementById('chat-input-live');
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') WebinarModule.postMessage(webinarId); });
        
        const qaInput = document.getElementById('qa-input-live');
        if (qaInput) qaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') WebinarModule.askQuestionInline(webinarId); });
    },

    fetchAndShowHighlight: async (id) => {
        const { data } = await WebinarModule.getDb().from('webinar_questions').select('*, profiles(full_name, avatar_url)').eq('id', id).single();
        if (data) WebinarModule.showHighlightOverlay(data);
    },

    showHighlightOverlay: (q) => {
        const overlay = document.getElementById('question-highlight');
        if (!overlay) return;
        overlay.innerHTML = `
            <div class="highlight-user">
                <img src="${q.profiles?.avatar_url || './assets/images/default-avatar.png'}" alt="User">
                <span>${q.profiles?.full_name} pose une question</span>
            </div>
            <div class="highlight-text">${q.question}</div>
            <button onclick="WebinarModule.toggleHighlight('${q.id}', false)" style="position:absolute; top:10px; right:10px; background:transparent; border:none; color:rgba(255,255,255,0.3); cursor:pointer;">×</button>
        `;
        overlay.classList.add('active');
    },

    toggleHighlight: async (questionId, state) => {
        const db = WebinarModule.getDb();
        // Reset all others first
        const { data: q } = await db.from('webinar_questions').select('webinar_id').eq('id', questionId).single();
        await db.from('webinar_questions').update({ is_highlighted: false }).eq('webinar_id', q.webinar_id);
        // Set target
        await db.from('webinar_questions').update({ is_highlighted: state }).eq('id', questionId);
        WebinarModule.loadQuestions(q.webinar_id);
    },

    sendReaction: (webinarId, emoji) => {
        const db = WebinarModule.getDb();
        db.channel(`webinar_reactions_${webinarId}`).send({
            type: 'broadcast',
            event: 'reaction',
            payload: { emoji: emoji }
        });
        WebinarModule.animateReaction(emoji);
    },

    animateReaction: (emoji) => {
        const stage = document.getElementById('reaction-stage');
        if (!stage) return;
        const div = document.createElement('div');
        div.className = 'floating-emoji';
        div.textContent = emoji;
        div.style.left = (20 + Math.random() * 60) + '%';
        div.style.setProperty('--random-x', (Math.random() * 100 - 50) + 'px');
        stage.appendChild(div);
        setTimeout(() => div.remove(), 2000);
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
        const isSystem = msg.user_id === 'system';
        container.insertAdjacentHTML('beforeend', `
            <div class="msg-bubble-v2 ${isMe ? 'me' : ''} ${isSystem ? 'system' : ''}">
                ${!isSystem ? `<div class="sender-v2">${msg.profiles?.full_name}</div>` : ''}
                <div class="text-v2" style="${isSystem ? 'background:rgba(16,185,129,0.1); color:#10b981; border:none; text-align:center; font-size:0.8rem; font-weight:700;' : ''}">${msg.content}</div>
            </div>
        `);
        container.scrollTop = container.scrollHeight;
    },

    askQuestionInline: async (webinarId) => {
        const input = document.getElementById('qa-input-live');
        if (!input || !input.value.trim()) return;
        const question = input.value.trim();
        input.value = '';
        await WebinarModule.getDb().from('webinar_questions').insert([{ webinar_id: webinarId, user_id: window.App.state.session.user.id, question: question }]);
        WebinarModule.loadQuestions(webinarId);
        Swal.fire({ title: 'Question envoyée', icon: 'success', timer: 1000, showConfirmButton: false });
    },

    loadQuestions: async (webinarId) => {
        const container = document.getElementById('qa-questions');
        if (!container) return;
        const isHost = WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur';
        const { data: questions } = await WebinarModule.getDb().from('webinar_questions').select('*, profiles(full_name, avatar_url)').eq('webinar_id', webinarId).order('upvotes', { ascending: false });
        
        if (questions) {
            container.innerHTML = questions.map(q => `
                <div class="qa-card-v2" style="background:rgba(255,255,255,0.03); padding:16px; border-radius:16px; border:1px solid ${q.is_highlighted ? 'var(--webinar-accent)' : 'var(--webinar-border)'}; margin-bottom:12px; transition:0.3s;">
                    <div class="qa-card-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:0.75rem; font-weight:800; color:${q.is_highlighted ? 'var(--webinar-accent)' : 'var(--webinar-text-muted)'};">${q.profiles?.full_name}</span> 
                        <div style="display:flex; gap:8px;">
                            ${isHost ? `<button onclick="WebinarModule.toggleHighlight('${q.id}', ${!q.is_highlighted})" style="background:${q.is_highlighted ? 'var(--webinar-accent)' : 'rgba(255,255,255,0.1)'}; border:none; color:white; padding:4px 8px; border-radius:6px; font-size:0.65rem; font-weight:800; cursor:pointer;">${q.is_highlighted ? 'EN VEDETTE' : 'METTRE EN VEDETTE'}</button>` : ''}
                            <button onclick="WebinarModule.upvoteQuestion('${q.id}', '${webinarId}')" style="background:transparent; border:none; color:white; cursor:pointer; font-weight:800;">👍 ${q.upvotes || 0}</button>
                        </div>
                    </div>
                    <p style="font-size:0.9rem; margin:0; line-height:1.4; color:${q.is_highlighted ? 'white' : '#cbd5e1'}; font-weight:${q.is_highlighted ? '700' : '400'};">${q.question}</p>
                </div>
            `).join('');
        }
    },

    showHostInsights: async (webinarId) => {
        const db = WebinarModule.getDb();
        const { count: attendees } = await db.from('webinar_attendees').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        const { count: questions } = await db.from('webinar_questions').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        const { count: messages } = await db.from('webinar_messages').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);

        Swal.fire({
            title: 'Analyses en Direct',
            background: '#0f172a',
            color: '#f8fafc',
            html: `
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin-top:24px;">
                    <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:2rem; font-weight:900; color:#10b981;">${attendees}</div>
                        <div style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Participants</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:2rem; font-weight:900; color:#3b82f6;">${questions}</div>
                        <div style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Questions</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:20px; border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:2rem; font-weight:900; color:#f59e0b;">${messages}</div>
                        <div style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Messages</div>
                    </div>
                </div>
                <div style="margin-top:24px; text-align:left; padding:20px; background:rgba(16,185,129,0.05); border-radius:16px; border:1px solid rgba(16,185,129,0.2);">
                    <div style="font-weight:900; color:#10b981; font-size:0.9rem; margin-bottom:8px;">CONSEIL STRATÉGIQUE</div>
                    <p style="font-size:0.85rem; color:#94a3b8; margin:0;">${attendees > 5 ? 'L\'engagement est bon. Pensez à lancer un sondage pour dynamiser la session.' : 'Invitez vos participants à poser des questions pour briser la glace.'}</p>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true
        });
    },

    loadResources: async (webinarId) => {
        const container = document.getElementById('resources-list');
        if (!container) return;
        const { data: resources } = await WebinarModule.getDb().from('webinar_resources').select('*').eq('webinar_id', webinarId).order('created_at', { ascending: false });
        if (!resources || resources.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--webinar-text-muted);">Aucune ressource partagée pour le moment.</div>`;
            return;
        }
        container.innerHTML = resources.map(r => `
            <a href="${r.link_url || r.file_url}" target="_blank" style="display:flex; align-items:center; gap:16px; background:rgba(255,255,255,0.03); padding:16px; border-radius:16px; border:1px solid var(--webinar-border); margin-bottom:12px; text-decoration:none; color:white; transition:0.3s;" onmouseover="this.style.borderColor='var(--webinar-accent)'" onmouseout="this.style.borderColor='var(--webinar-border)'">
                <div style="width:40px; height:40px; background:var(--webinar-accent); border-radius:12px; display:flex; align-items:center; justify-content:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                    <div style="font-weight:800; font-size:0.9rem;">${r.title}</div>
                    <div style="font-size:0.7rem; color:var(--webinar-text-muted);">Cliquez pour consulter</div>
                </div>
            </a>
        `).join('');
    },

    openResourceAdder: (webinarId) => {
        Swal.fire({
            title: 'Partager une Ressource',
            html: `<div style="text-align:left;"><input id="r-t" class="swal2-input" placeholder="Titre du document"><input id="r-l" class="swal2-input" placeholder="Lien (URL)"></div>`,
            confirmButtonText: 'PARTAGER', preConfirm: () => { return { title: document.getElementById('r-t').value, link_url: document.getElementById('r-l').value } }
        }).then(async (r) => {
            if (r.isConfirmed) {
                await WebinarModule.getDb().from('webinar_resources').insert([{ webinar_id: webinarId, ...r.value }]);
                WebinarModule.loadResources(webinarId);
            }
        });
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
        if (!polls || polls.length === 0) { container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--webinar-text-muted);">Aucun sondage actif.</div>`; return; }

        container.innerHTML = polls.map(poll => `
            <div class="poll-v2" style="background:rgba(255,255,255,0.03); padding:20px; border-radius:24px; border:1px solid var(--webinar-border); margin-bottom:20px;">
                <div class="poll-q-v2" style="font-weight:900; font-size:1rem; margin-bottom:16px;">${poll.question}</div>
                ${poll.webinar_poll_options.map(opt => {
                    const total = poll.webinar_poll_options.reduce((acc, o) => acc + (o.votes_count || 0), 0);
                    const percent = total > 0 ? Math.round((opt.votes_count / total) * 100) : 0;
                    return `
                        <div class="poll-opt-v2" onclick="WebinarModule.votePoll('${poll.id}', '${opt.id}', '${webinarId}')" style="position:relative; background:rgba(255,255,255,0.05); padding:12px 16px; border-radius:12px; margin-bottom:8px; cursor:pointer; overflow:hidden;">
                            <div class="poll-fill-v2" style="position:absolute; inset:0; background:var(--webinar-accent); opacity:0.1; width:${percent}%"></div>
                            <div class="poll-label-v2" style="position:relative; display:flex; justify-content:space-between; font-weight:700; font-size:0.85rem;">
                                <span>${opt.option_text}</span> 
                                <span>${percent}%</span>
                            </div>
                        </div>
                    `;
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
                <h3 style="font-size:1.5rem; font-weight:950; margin:0;">${cta.title}</h3>
                <a href="${cta.link_url}" target="_blank" class="cta-btn-v2">${cta.button_text}</a>
                <button onclick="this.parentElement.parentElement.classList.remove('active')" class="cta-close-v2">×</button>
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
                await db.from('webinars').update({ is_published: true }).eq('id', webinarId); // Ensure published
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

window.WebinarModule = WebinarModule;
window.WebinarModule = WebinarModule;
