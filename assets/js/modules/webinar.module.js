/**
 * Domtom Connect - Webinar Module
 * Clean Professional SaaS Interface
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
     * Render Webinars List - Clean & Professional
     */
    renderWebinarsList: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="webinar-container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; animation: fadeIn 0.4s ease-out;">
                
                <!-- Header Section -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; gap: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 32px;">
                    <div>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">Webinaires <span style="color: #10b981;">Direct</span></h1>
                        <p style="color: #64748b; font-size: 1.1rem; margin-top: 8px; font-weight: 500;">Apprenez des meilleurs experts de l'écosystème en temps réel.</p>
                    </div>
                    <div style="display: flex; gap: 16px;">
                        ${WebinarModule.role !== 'spectator' && WebinarModule.role !== 'spectateur' ? `
                            <button onclick="WebinarModule.openCreateModal()" class="btn-primary-clean">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Planifier une session
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Filters & Grid -->
                <div style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="filter-pills">
                        <button class="pill active">Tous les lives</button>
                        <button class="pill">À venir</button>
                        <button class="pill">Replays</button>
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
            const db = window._supabase;
            const { data: webinars, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').order('scheduled_at', { ascending: true });

            if (error) throw error;

            if (!webinars || webinars.length === 0) {
                listContainer.innerHTML = `
                    <div class="empty-state-clean">
                        <div class="icon-box-clean">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                        </div>
                        <h3>Aucune session pour le moment</h3>
                        <p>Les experts préparent les prochaines masterclasses. Revenez bientôt !</p>
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
     * Professional Webinar Card
     */
    renderWebinarCard: (webinar) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        const now = new Date();
        const isLive = now >= date && now <= new Date(date.getTime() + 120*60*1000);
        const isPast = now > new Date(date.getTime() + 120*60*1000);

        return `
            <div class="webinar-card-clean" onclick="WebinarModule.joinWebinar('${webinar.id}', '${webinar.meeting_link}')">
                <div class="card-thumb" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9; height: 180px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="1.5"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    ${isLive ? `<div class="badge-live">EN DIRECT</div>` : ''}
                </div>
                <div class="card-body-clean">
                    <div class="card-meta">${formattedDate} • ${formattedTime}</div>
                    <h3 class="card-title-clean">${webinar.title}</h3>
                    <div class="card-footer-clean">
                        <div class="host-info">
                            <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" class="host-avatar">
                            <span>${webinar.profiles?.full_name}</span>
                        </div>
                        <div class="action-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Clean Watch View
     */
    renderWatchView: async (container, webinarId, profile, session) => {
        if (!container) return;

        try {
            const db = window._supabase;
            const { data: webinar, error } = await db.from('webinars').select('*, profiles(full_name, avatar_url, title)').eq('id', webinarId).single();
            if (error) throw error;

            const videoId = webinar.meeting_link.includes('v=') ? webinar.meeting_link.split('v=')[1].split('&')[0] : webinar.meeting_link.split('/').pop();
            const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

            container.innerHTML = `
                <div class="watch-container-clean">
                    <div class="watch-header">
                        <button onclick="window.Router.navigate('#webinars')" class="btn-back">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h1 class="watch-title">${webinar.title}</h1>
                    </div>

                    <div class="watch-layout">
                        <div class="main-player-area">
                            <div class="video-wrapper-clean">
                                <iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div class="webinar-details-clean">
                                <h2>À propos de cette session</h2>
                                <p>${webinar.description || 'Pas de description disponible.'}</p>
                            </div>
                        </div>

                        <div class="sidebar-interaction">
                            <div class="tabs-clean">
                                <button onclick="WebinarModule.switchTab('chat')" id="tab-chat" class="tab-btn active">Chat</button>
                                <button onclick="WebinarModule.switchTab('qa')" id="tab-qa" class="tab-btn">Questions</button>
                            </div>
                            <div id="panel-chat" class="panel-content active">
                                <div id="chat-messages" class="chat-list-clean"></div>
                                <div class="chat-input-clean">
                                    <input id="chat-input-live" type="text" placeholder="Envoyer un message...">
                                    <button onclick="WebinarModule.postMessage('${webinarId}')">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </button>
                                </div>
                            </div>
                            <div id="panel-qa" class="panel-content">
                                <div id="qa-questions" class="chat-list-clean"></div>
                                <button onclick="WebinarModule.askQuestion('${webinarId}')" class="btn-action-full">Poser une question</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            WebinarModule.initRealtimeInteractions(webinarId, profile);
            WebinarModule.trackAttendance(webinarId);

        } catch (err) {
            container.innerHTML = `<div class="error-box-clean">${err.message}</div>`;
        }
    },

    joinWebinar: (id, link) => {
        if (link.includes('youtube.com') || link.includes('youtu.be')) {
            window.Router.navigate('#webinars?id=' + id);
        } else {
            window.open(link, '_blank');
        }
    },

    switchTab: (tabId) => {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
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
            <div class="msg-bubble ${isMe ? 'me' : ''}">
                <div class="msg-sender">${msg.profiles?.full_name}</div>
                <div class="msg-text">${msg.content}</div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
        container.scrollTop = container.scrollHeight;
    },

    trackAttendance: async (webinarId) => {
        await window._supabase.from('webinar_attendees').upsert({ webinar_id: webinarId, user_id: window.App.state.session.user.id, attended_at: new Date().toISOString() });
    },

    openCreateModal: () => {
        Swal.fire({
            title: 'Nouveau Webinaire',
            html: `
                <div class="swal-form">
                    <input id="sw-title" class="swal2-input" placeholder="Titre de la session">
                    <textarea id="sw-desc" class="swal2-textarea" placeholder="Description"></textarea>
                    <input id="sw-date" type="datetime-local" class="swal2-input">
                    <input id="sw-link" type="url" class="swal2-input" placeholder="Lien YouTube Live">
                </div>
            `,
            confirmButtonText: 'Créer le live',
            confirmButtonColor: '#10b981',
            showCancelButton: true,
            cancelButtonText: 'Annuler',
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
                else { WebinarModule.loadWebinars(); }
            }
        });
    }
};

// Clean Professional CSS
const style = document.createElement('style');
style.textContent = `
    .webinar-container { font-family: 'Inter', -apple-system, sans-serif; }
    
    .btn-primary-clean { background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
    .btn-primary-clean:hover { background: #059669; transform: translateY(-1px); }

    .filter-pills { display: flex; gap: 12px; }
    .pill { background: #f1f5f9; border: 1px solid transparent; padding: 8px 18px; border-radius: 100px; font-weight: 600; color: #64748b; cursor: pointer; transition: 0.2s; }
    .pill.active { background: #0f172a; color: white; }
    .pill:hover:not(.active) { background: #e2e8f0; }

    .clean-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 32px; }
    
    .webinar-card-clean { background: white; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; cursor: pointer; transition: 0.3s; }
    .webinar-card-clean:hover { border-color: #10b981; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transform: translateY(-4px); }

    .card-body-clean { padding: 24px; }
    .card-meta { font-size: 0.85rem; color: #10b981; font-weight: 700; margin-bottom: 8px; }
    .card-title-clean { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; line-height: 1.4; }
    .card-footer-clean { display: flex; justify-content: space-between; align-items: center; }
    
    .host-info { display: flex; align-items: center; gap: 10px; }
    .host-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
    .host-info span { font-size: 0.9rem; font-weight: 600; color: #475569; }
    .action-arrow { color: #cbd5e1; transition: 0.2s; }
    .webinar-card-clean:hover .action-arrow { color: #10b981; transform: translateX(4px); }

    .badge-live { position: absolute; top: 16px; right: 16px; background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; }

    .empty-state-clean { grid-column: 1 / -1; text-align: center; padding: 80px 40px; background: #f8fafc; border-radius: 24px; border: 2px dashed #e2e8f0; }
    .icon-box-clean { margin-bottom: 24px; color: #cbd5e1; }
    .empty-state-clean h3 { font-size: 1.4rem; color: #0f172a; margin-bottom: 12px; font-weight: 800; }
    .empty-state-clean p { color: #64748b; font-size: 1.1rem; }

    .watch-container-clean { max-width: 1400px; margin: 0 auto; padding: 32px; animation: fadeIn 0.4s ease-out; }
    .watch-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
    .btn-back { background: white; border: 1px solid #e2e8f0; width: 48px; height: 48px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .btn-back:hover { background: #f8fafc; border-color: #cbd5e1; }
    .watch-title { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0; }

    .watch-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; }
    .video-wrapper-clean { aspect-ratio: 16/9; background: #000; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
    .video-wrapper-clean iframe { width: 100%; height: 100%; }

    .sidebar-interaction { background: white; border: 1px solid #e2e8f0; border-radius: 24px; display: flex; flex-direction: column; height: 600px; overflow: hidden; }
    .tabs-clean { display: flex; border-bottom: 1px solid #f1f5f9; padding: 8px; }
    .tab-btn { flex: 1; background: transparent; border: none; padding: 12px; font-weight: 700; color: #64748b; cursor: pointer; border-radius: 8px; }
    .tab-btn.active { background: #f1f5f9; color: #0f172a; }

    .panel-content { display: none; flex-direction: column; flex-grow: 1; }
    .panel-content.active { display: flex; }
    .chat-list-clean { flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .msg-bubble { max-width: 90%; }
    .msg-sender { font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
    .msg-text { background: #f1f5f9; padding: 12px 16px; border-radius: 16px; font-size: 0.95rem; color: #334155; }
    .msg-bubble.me { align-self: flex-end; }
    .msg-bubble.me .msg-text { background: #10b981; color: white; }
    .msg-bubble.me .msg-sender { text-align: right; }

    .chat-input-clean { padding: 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; }
    .chat-input-clean input { flex-grow: 1; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; outline: none; }
    .chat-input-clean input:focus { border-color: #10b981; }
    .chat-input-clean button { background: #0f172a; color: white; border: none; width: 44px; height: 44px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

    .btn-action-full { margin: 20px; background: #10b981; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; }

    .loader-dots { display: flex; justify-content: center; gap: 8px; }
    .loader-dots span { width: 10px; height: 10px; background: #cbd5e1; border-radius: 50%; animation: dotPulse 1s infinite alternate; }
    .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loader-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dotPulse { from { opacity: 0.3; transform: scale(0.8); } to { opacity: 1; transform: scale(1.1); } }
`;
document.head.appendChild(style);

window.WebinarModule = WebinarModule;

