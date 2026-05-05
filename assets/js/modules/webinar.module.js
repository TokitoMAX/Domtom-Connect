/**
 * Domtom Connect - Webinar Module
 * PREMIUM SAAS SUITE: Polls, Live Offers (CTA), Stage Control, Analytics
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
     * Render Webinars List
     */
    renderWebinarsList: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="webinar-container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; animation: fadeIn 0.4s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; gap: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 32px;">
                    <div>
                        <h1 style="font-size: 2.8rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.03em;">Masterclasses <span style="color: #10b981;">Premium</span></h1>
                        <p style="color: #64748b; font-size: 1.1rem; margin-top: 8px; font-weight: 500;">Engagement, Sondages et Business en Direct.</p>
                    </div>
                    <div>
                        ${WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur' ? `
                            <button onclick="WebinarModule.openCreateModal()" class="btn-primary-clean">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Nouvelle Masterclass
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div id="webinars-list" class="clean-grid">
                    <div style="text-align: center; padding: 100px; grid-column: 1 / -1;">
                        <div class="loader-dots"><span></span><span></span><span></span></div>
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
                    <div class="empty-state-clean">
                        <div class="icon-box-clean">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                        </div>
                        <h3>Explorez le futur du Webinaire</h3>
                        <p>Tout ce qu'il se fait de mieux en SaaS de conférence est ici.</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = webinars.map(w => WebinarModule.renderWebinarCard(w)).join('');
        } catch (err) {
            listContainer.innerHTML = `<div class="error-box-clean">${err.message}</div>`;
        }
    },

    renderWebinarCard: (webinar) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const now = new Date();
        const isLive = now >= date && now <= new Date(date.getTime() + 120*60*1000);

        return `
            <div class="webinar-card-clean" onclick="window.Router.navigate('#webinars?id=${webinar.id}')">
                <div class="card-thumb" style="background: #0f172a; border-bottom: 1px solid #1e293b; height: 180px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 60%);"></div>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" style="opacity: 0.5;"><path d="M22 13.5L12 19L2 13.5"></path><path d="M2 13.5V6a2 2 0 012-2h16a2 2 0 012 2v7.5"></path></svg>
                    ${isLive ? `<div class="badge-live">LIVE</div>` : ''}
                </div>
                <div class="card-body-clean">
                    <div class="card-meta">${formattedDate} • ${formattedTime}</div>
                    <h3 class="card-title-clean">${webinar.title}</h3>
                    <div class="card-footer-clean">
                        <div class="host-info"><img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" class="host-avatar"><span>${webinar.profiles?.full_name}</span></div>
                        <div class="action-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="12 5 19 12 12 19"></polyline><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render Watch View (Full Engagement Engine)
     */
    renderWatchView: async (container, webinarId, profile, session) => {
        if (!container) return;

        try {
            const db = WebinarModule.getDb();
            const { data: webinar, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').eq('id', webinarId).single();
            if (error) throw error;

            const isHost = webinar.host_id === session.user.id;

            container.innerHTML = `
                <div class="watch-container-premium">
                    <!-- CTA Overlay Placeholder -->
                    <div id="cta-overlay" class="cta-overlay-fixed"></div>

                    <div class="watch-header">
                        <button onclick="window.Router.navigate('#webinars')" class="btn-back"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                        <div class="title-block">
                            <h1 class="watch-title">${webinar.title}</h1>
                            <div class="meta-row">
                                <span class="status-pill ${isHost ? 'host' : 'live'}">${isHost ? 'CONTRÔLEUR' : 'EN DIRECT'}</span>
                                <span class="host-name">par ${webinar.profiles?.full_name}</span>
                                <span id="attendee-count" class="audience-count">... participants</span>
                            </div>
                        </div>
                        ${isHost ? `
                            <div class="host-controls">
                                <button onclick="WebinarModule.openPollManager('${webinarId}')" class="btn-tool"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg> Sondages</button>
                                <button onclick="WebinarModule.openCTAManager('${webinarId}')" class="btn-tool active"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"></path></svg> Offre Live</button>
                            </div>
                        ` : ''}
                    </div>

                    <div class="watch-layout">
                        <div class="main-stage">
                            <div id="jitsi-container" class="video-wrapper-native"></div>
                            <div class="stage-footer">
                                <div class="stage-tabs">
                                    <button class="stage-tab active">Masterclass</button>
                                    <button class="stage-tab">Notes</button>
                                    <button class="stage-tab">Ressources</button>
                                </div>
                            </div>
                        </div>

                        <div class="engagement-sidebar">
                            <div class="engagement-tabs">
                                <button onclick="WebinarModule.switchTab('chat')" id="tab-chat" class="eng-tab active">CHAT</button>
                                <button onclick="WebinarModule.switchTab('qa')" id="tab-qa" class="eng-tab">Q&A</button>
                                <button onclick="WebinarModule.switchTab('polls')" id="tab-polls" class="eng-tab">SONDAGES</button>
                            </div>

                            <div id="panel-chat" class="eng-panel active">
                                <div id="chat-messages" class="scroll-area"></div>
                                <div class="input-area">
                                    <input id="chat-input-live" type="text" placeholder="Réagir...">
                                    <button onclick="WebinarModule.postMessage('${webinarId}')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                                </div>
                            </div>

                            <div id="panel-qa" class="eng-panel">
                                <div id="qa-questions" class="scroll-area"></div>
                                <div class="panel-action">
                                    <button onclick="WebinarModule.askQuestion('${webinarId}')" class="btn-action-full">POSER UNE QUESTION</button>
                                </div>
                            </div>

                            <div id="panel-polls" class="eng-panel">
                                <div id="polls-list" class="scroll-area"></div>
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
     * Native Video Room Initialization
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
            interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false }
        };

        if (window.JitsiMeetExternalAPI) { WebinarModule.jitsiApi = new window.JitsiMeetExternalAPI(domain, options); }
    },

    switchTab: (tabId) => {
        document.querySelectorAll('.eng-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.eng-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
        document.getElementById(`panel-${tabId}`).classList.add('active');
    },

    /**
     * Real-time Engagement Logic
     */
    initRealtimeInteractions: async (webinarId, profile) => {
        const db = WebinarModule.getDb();
        if (!db) return;

        // 1. Chat
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_poll_votes', filter: `webinar_id=eq.${webinarId}` }, () => { WebinarModule.loadPolls(webinarId); })
            .subscribe();

        // 3. Q&A
        WebinarModule.activeQASubscription = db.channel(`webinar_qa_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_questions', filter: `webinar_id=eq.${webinarId}` }, () => { WebinarModule.loadQuestions(webinarId); })
            .subscribe();

        // 4. CTA (Offers)
        WebinarModule.activeCTASubscription = db.channel(`webinar_cta_${webinarId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'webinar_ctas', filter: `webinar_id=eq.${webinarId}` }, (payload) => {
                if (payload.new && payload.new.is_active) { WebinarModule.showCTAOverlay(payload.new); }
                else { document.getElementById('cta-overlay').classList.remove('active'); }
            }).subscribe();

        const input = document.getElementById('chat-input-live');
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') WebinarModule.postMessage(webinarId); });
    },

    /**
     * Polls Logic (Sondages)
     */
    loadPolls: async (webinarId) => {
        const container = document.getElementById('polls-list');
        if (!container) return;
        const db = WebinarModule.getDb();
        const { data: polls } = await db.from('webinar_polls').select('*, webinar_poll_options(*)').eq('webinar_id', webinarId).order('created_at', { ascending: false });

        if (!polls || polls.length === 0) {
            container.innerHTML = `<div class="empty-mini">Aucun sondage actif.</div>`;
            return;
        }

        container.innerHTML = polls.map(poll => `
            <div class="poll-card">
                <div class="poll-question">${poll.question}</div>
                <div class="poll-options">
                    ${poll.webinar_poll_options.map(opt => {
                        const total = poll.webinar_poll_options.reduce((acc, o) => acc + (o.votes_count || 0), 0);
                        const percent = total > 0 ? Math.round((opt.votes_count / total) * 100) : 0;
                        return `
                            <div class="poll-option-row" onclick="WebinarModule.votePoll('${poll.id}', '${opt.id}', '${webinarId}')">
                                <div class="poll-bar" style="width: ${percent}%"></div>
                                <div class="poll-opt-text"><span>${opt.option_text}</span> <span>${percent}%</span></div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    },

    votePoll: async (pollId, optionId, webinarId) => {
        const db = WebinarModule.getDb();
        const { error } = await db.from('webinar_poll_votes').insert([{ poll_id: pollId, option_id: optionId, user_id: window.App.state.session.user.id }]);
        if (error) { Swal.fire('Déjà voté', 'Vous avez déjà participé à ce sondage.', 'info'); return; }
        
        // Update vote count (simplified trigger simulation)
        const { data } = await db.from('webinar_poll_options').select('votes_count').eq('id', optionId).single();
        await db.from('webinar_poll_options').update({ votes_count: (data.votes_count || 0) + 1 }).eq('id', optionId);
        WebinarModule.loadPolls(webinarId);
    },

    /**
     * CTA Logic (Featured Offers)
     */
    showCTAOverlay: (cta) => {
        const overlay = document.getElementById('cta-overlay');
        if (!overlay) return;
        overlay.innerHTML = `
            <div class="cta-box animate__animated animate__bounceIn">
                <button onclick="this.parentElement.parentElement.classList.remove('active')" class="cta-close">&times;</button>
                <div class="cta-tag">OFFRE SPÉCIALE EN DIRECT</div>
                <h3>${cta.title}</h3>
                <a href="${cta.link_url}" target="_blank" class="cta-btn-link">${cta.button_text}</a>
            </div>
        `;
        overlay.classList.add('active');
    },

    /**
     * Host Tools (Modals)
     */
    openPollManager: (webinarId) => {
        Swal.fire({
            title: 'CRÉER UN SONDAGE',
            html: `
                <div style="text-align:left;">
                    <input id="p-question" class="swal2-input" placeholder="La question...">
                    <input id="p-opt1" class="swal2-input" placeholder="Option 1">
                    <input id="p-opt2" class="swal2-input" placeholder="Option 2">
                </div>
            `,
            confirmButtonText: 'LANCER LE SONDAGE',
            preConfirm: () => {
                return {
                    question: document.getElementById('p-question').value,
                    options: [document.getElementById('p-opt1').value, document.getElementById('p-opt2').value]
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const db = WebinarModule.getDb();
                const { data: poll } = await db.from('webinar_polls').insert([{ webinar_id: webinarId, question: result.value.question }]).select().single();
                if (poll) {
                    const opts = result.value.options.map(o => ({ poll_id: poll.id, option_text: o }));
                    await db.from('webinar_poll_options').insert(opts);
                    WebinarModule.loadPolls(webinarId);
                }
            }
        });
    },

    openCTAManager: (webinarId) => {
        Swal.fire({
            title: 'LANCER UNE OFFRE',
            html: `
                <div style="text-align:left;">
                    <input id="c-title" class="swal2-input" placeholder="Titre de l'offre">
                    <input id="c-btn" class="swal2-input" placeholder="Texte du bouton">
                    <input id="c-url" class="swal2-input" placeholder="URL de redirection">
                </div>
            `,
            confirmButtonText: 'ACTIVER L\'OFFRE',
            preConfirm: () => {
                return {
                    title: document.getElementById('c-title').value,
                    button_text: document.getElementById('c-btn').value,
                    link_url: document.getElementById('c-url').value,
                    is_active: true
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const db = WebinarModule.getDb();
                await db.from('webinar_ctas').update({ is_active: false }).eq('webinar_id', webinarId); // Disable others
                await db.from('webinar_ctas').insert([{ webinar_id: webinarId, ...result.value }]);
            }
        });
    },

    /**
     * Standard Features (Chat, Questions, Attendance)
     */
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
        container.insertAdjacentHTML('beforeend', `<div class="msg-bubble ${isMe ? 'me' : ''}"><div class="msg-sender">${msg.profiles?.full_name}</div><div class="msg-text">${msg.content}</div></div>`);
        container.scrollTop = container.scrollHeight;
    },

    askQuestion: async (webinarId) => {
        const { value: question } = await Swal.fire({ title: 'Poser une question', input: 'textarea', inputPlaceholder: 'Ma question...', confirmButtonText: 'Envoyer', confirmButtonColor: '#10b981' });
        if (question) { await WebinarModule.getDb().from('webinar_questions').insert([{ webinar_id: webinarId, user_id: window.App.state.session.user.id, question: question }]); }
    },

    loadQuestions: async (webinarId) => {
        const container = document.getElementById('qa-questions');
        if (!container) return;
        const { data: questions } = await WebinarModule.getDb().from('webinar_questions').select('*, profiles(full_name)').eq('webinar_id', webinarId).order('upvotes', { ascending: false });
        if (questions) {
            container.innerHTML = questions.map(q => `
                <div class="qa-item">
                    <div class="qa-meta"><span>${q.profiles?.full_name}</span> <button onclick="WebinarModule.upvoteQuestion('${q.id}', '${webinarId}')">👍 ${q.upvotes || 0}</button></div>
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

    trackAttendance: async (webinarId) => {
        const db = WebinarModule.getDb();
        await db.from('webinar_attendees').upsert({ webinar_id: webinarId, user_id: window.App.state.session.user.id, attended_at: new Date().toISOString() });
        const { count } = await db.from('webinar_attendees').select('*', { count: 'exact', head: true }).eq('webinar_id', webinarId);
        if (document.getElementById('attendee-count')) document.getElementById('attendee-count').textContent = `${count} participants`;
    },

    openCreateModal: () => {
        Swal.fire({
            title: 'LANCER UNE MASTERCLASS',
            html: `
                <div style="text-align:left; display:grid; gap:16px;">
                    <input id="sw-title" class="swal2-input" style="width:100%;" placeholder="Titre stratégique">
                    <textarea id="sw-desc" class="swal2-textarea" style="width:100%; height:80px;" placeholder="Objectifs..."></textarea>
                    <input id="sw-date" type="datetime-local" class="swal2-input" style="width:100%;">
                </div>
            `,
            confirmButtonText: 'PUBLIER', confirmButtonColor: '#10b981', showCancelButton: true,
            preConfirm: () => { return { title: document.getElementById('sw-title').value, description: document.getElementById('sw-desc').value, scheduled_at: document.getElementById('sw-date').value, meeting_link: 'NATIVE_P2P' } }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { error } = await WebinarModule.getDb().from('webinars').insert([{ ...result.value, host_id: window.App.state.session.user.id }]);
                if (!error) WebinarModule.loadWebinars();
            }
        });
    }
};

// PREMIUM SAAS CSS
const style = document.createElement('style');
style.textContent = `
    .watch-container-premium { max-width: 1500px; margin: 0 auto; padding: 24px; font-family: 'Inter', sans-serif; position: relative; }
    .watch-header { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }
    .title-block { flex-grow: 1; }
    .watch-title { font-size: 2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.04em; }
    .meta-row { display: flex; align-items: center; gap: 16px; margin-top: 8px; }
    .status-pill { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; }
    .status-pill.live { background: #ef4444; color: white; animation: pulse 2s infinite; }
    .status-pill.host { background: #0f172a; color: white; }
    .audience-count { font-size: 0.9rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px; }

    .host-controls { display: flex; gap: 12px; }
    .btn-tool { background: white; border: 1px solid #e2e8f0; padding: 10px 18px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; color: #475569; }
    .btn-tool:hover { background: #f8fafc; border-color: #cbd5e1; }
    .btn-tool.active { background: #10b981; color: white; border-color: #10b981; }

    .watch-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; height: 750px; }
    .main-stage { display: flex; flex-direction: column; background: #0f172a; border-radius: 32px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.1); border: 8px solid #0f172a; }
    .video-wrapper-native { flex-grow: 1; position: relative; }
    .stage-footer { background: #1e293b; padding: 12px 24px; }
    .stage-tabs { display: flex; gap: 24px; }
    .stage-tab { background: transparent; border: none; color: #94a3b8; font-weight: 700; font-size: 0.85rem; cursor: pointer; padding: 8px 0; border-bottom: 2px solid transparent; }
    .stage-tab.active { color: #10b981; border-color: #10b981; }

    .engagement-sidebar { background: white; border: 1px solid #e2e8f0; border-radius: 32px; display: flex; flex-direction: column; overflow: hidden; }
    .engagement-tabs { display: flex; border-bottom: 1px solid #f1f5f9; background: #f8fafc; padding: 8px; gap: 8px; }
    .eng-tab { flex: 1; background: transparent; border: none; padding: 14px; font-weight: 900; color: #64748b; font-size: 0.75rem; letter-spacing: 1px; cursor: pointer; border-radius: 12px; transition: 0.2s; }
    .eng-tab.active { background: white; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

    .eng-panel { display: none; flex-direction: column; flex-grow: 1; height: calc(100% - 60px); }
    .eng-panel.active { display: flex; }
    .scroll-area { flex-grow: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    
    .msg-bubble { max-width: 90%; }
    .msg-sender { font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; }
    .msg-text { background: #f1f5f9; padding: 12px 16px; border-radius: 18px; font-size: 0.9rem; color: #334155; }
    .msg-bubble.me { align-self: flex-end; }
    .msg-bubble.me .msg-text { background: #0f172a; color: white; }
    .msg-bubble.me .msg-sender { text-align: right; }

    .input-area { padding: 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; }
    .input-area input { flex-grow: 1; border: 1px solid #e2e8f0; padding: 14px 20px; border-radius: 14px; outline: none; }
    .input-area button { background: #10b981; color: white; border: none; width: 48px; height: 48px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

    .poll-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 20px; }
    .poll-question { font-weight: 800; color: #0f172a; margin-bottom: 16px; }
    .poll-option-row { position: relative; background: white; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; overflow: hidden; }
    .poll-bar { position: absolute; left: 0; top: 0; height: 100%; background: rgba(16, 185, 129, 0.1); transition: width 0.6s ease; }
    .poll-opt-text { position: relative; z-index: 2; display: flex; justify-content: space-between; font-weight: 700; font-size: 0.9rem; }

    .qa-item { background: #f8fafc; padding: 16px; border-radius: 16px; border: 1px solid #e2e8f0; }
    .qa-meta { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 800; font-size: 0.75rem; color: #10b981; }
    .qa-meta button { background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px; font-weight: 700; cursor: pointer; }

    .cta-overlay-fixed { position: absolute; top: 120px; left: 50%; transform: translateX(-50%); z-index: 1000; width: 450px; display: none; }
    .cta-overlay-fixed.active { display: block; }
    .cta-box { background: white; border-radius: 24px; padding: 32px; box-shadow: 0 40px 100px rgba(0,0,0,0.2); border: 2px solid #10b981; text-align: center; position: relative; }
    .cta-close { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.5rem; color: #cbd5e1; cursor: pointer; }
    .cta-tag { font-weight: 900; font-size: 0.75rem; color: #10b981; margin-bottom: 12px; letter-spacing: 2px; }
    .cta-box h3 { font-size: 1.4rem; font-weight: 950; color: #0f172a; margin-bottom: 24px; }
    .cta-btn-link { display: inline-block; background: #10b981; color: white; padding: 16px 32px; border-radius: 14px; text-decoration: none; font-weight: 900; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); transition: 0.2s; }
    .cta-btn-link:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); }

    .btn-action-full { background: #0f172a; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; letter-spacing: 1px; }
`;
document.head.appendChild(style);

window.WebinarModule = WebinarModule;
