/**
 * MessagesModule - Domtom Connect
 * Real-time transaction-enabled chat engine SPA Module
 */
const MessagesModule = {
    role: 'global',
    currentUserId: null,
    activeConversationId: null,
    realtimeChannel: null,
    presenceChannel: null,
    cachedProfiles: {},
    typingTimeout: null,
    pendingFile: null,
    replyToId: null,
    cachedMessages: {},

    route: async function(viewId, container, profile, session, params) {
        console.log("[MessagesModule] Mounting Messaging UI...");
        this.currentUserId = session.user.id;

        // 1. Inject Styles
        this.injectStyles();

        // 2. Render Layout
        this.renderLayout(container);

        // 3. Setup Listeners
        this.setupFormListeners();

        // 4. Initialize Messaging Data
        await this.initMessaging(params);
    },

    injectStyles: function() {
        if (document.getElementById('dtc-messaging-styles')) return;

        const style = document.createElement('style');
        style.id = 'dtc-messaging-styles';
        style.innerHTML = `
            .messaging-container {
                display: flex;
                width: 100%;
                height: calc(100vh - 100px);
                background: white;
                border-radius: 24px;
                border: 1px solid #e2e8f0;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            }
            @media (max-width: 768px) {
                .messaging-container {
                    height: calc(100vh - 120px);
                    border-radius: 0;
                    border: none;
                }
            }

            .chat-layout {
                display: flex;
                flex: 1;
                overflow: hidden;
                position: relative;
            }

            .conversations-list {
                width: 320px;
                border-right: 1px solid #e2e8f0;
                display: flex;
                flex-direction: column;
                background: #f8fafc;
                flex-shrink: 0;
            }
            @media (max-width: 768px) {
                .conversations-list {
                    width: 100%;
                    position: absolute;
                    inset: 0;
                    z-index: 10;
                }
                .chat-layout.mobile-chat-active .conversations-list {
                    display: none;
                }
            }

            .conversations-header {
                padding: 20px 24px;
                border-bottom: 1px solid #e2e8f0;
                background: white;
            }

            .conversations-header h2 {
                font-size: 1.25rem;
                font-weight: 800;
                margin: 0;
                color: #0f172a;
            }

            .conversations-items {
                flex: 1;
                overflow-y: auto;
            }

            .conversation-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                border-bottom: 1px solid #f1f5f9;
                cursor: pointer;
                transition: all 0.2s;
                background: white;
                border-left: 4px solid transparent;
            }

            .conversation-item:hover {
                background: #f8fafc;
            }

            .conversation-item.active {
                background: #f0fdf4;
                border-left-color: #10b981;
            }

            .conv-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                color: #0f172a;
                flex-shrink: 0;
                object-fit: cover;
            }

            .conv-info {
                flex: 1;
                min-width: 0;
            }

            .conv-name {
                font-size: 0.9rem;
                font-weight: 700;
                margin: 0 0 2px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #0f172a;
            }

            .conv-preview {
                font-size: 0.8rem;
                color: #64748b;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .chat-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                background: white;
                position: relative;
            }
            @media (max-width: 768px) {
                .chat-area {
                    display: none;
                }
                .chat-layout.mobile-chat-active .chat-area {
                    display: flex;
                    width: 100%;
                    position: absolute;
                    inset: 0;
                    z-index: 20;
                }
            }

            .chat-header {
                padding: 16px 24px;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: white;
                z-index: 10;
            }

            .chat-messages {
                flex: 1;
                padding: 24px;
                overflow-y: auto;
                background: #fafafa;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .message {
                max-width: 70%;
                display: flex;
                flex-direction: column;
            }

            .message.received {
                align-self: flex-start;
            }

            .message.sent {
                align-self: flex-end;
            }

            .message-bubble {
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 0.95rem;
                line-height: 1.5;
                position: relative;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }

            .message.received .message-bubble {
                background: white;
                border: 1px solid #e2e8f0;
                color: #0f172a;
                border-bottom-left-radius: 4px;
            }

            .message.sent .message-bubble {
                background: #0f172a;
                color: white;
                border-bottom-right-radius: 4px;
            }

            .message-info {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 4px;
                font-size: 0.7rem;
                color: #94a3b8;
                margin-top: 4px;
            }

            .message.received .message-info {
                justify-content: flex-start;
            }

            .chat-input-area {
                padding: 16px 24px;
                background: white;
                border-top: 1px solid #e2e8f0;
                z-index: 10;
            }

            .chat-input-wrapper {
                display: flex;
                gap: 12px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 24px;
                padding: 8px 16px;
                align-items: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
            }

            .chat-input-wrapper textarea {
                flex: 1;
                border: none;
                outline: none;
                padding: 8px 0;
                font-size: 0.95rem;
                font-family: inherit;
                resize: none;
                max-height: 120px;
            }

            .chat-input-wrapper:focus-within {
                border-color: #10b981;
            }

            .btn-send {
                background: #10b981;
                color: white;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                flex-shrink: 0;
                transition: background 0.2s;
            }

            .btn-send:hover {
                background: #059669;
            }

            .btn-send:disabled {
                background: #cbd5e1;
                cursor: not-allowed;
            }

            .btn-attach {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                padding: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            }

            .btn-attach:hover {
                color: #10b981;
            }

            .message-actions-bar {
                display: flex;
                gap: 8px;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid rgba(0,0,0,0.05);
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .message:hover .message-actions-bar {
                opacity: 1;
            }

            .btn-msg-action {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #64748b;
                transition: all 0.2s;
            }

            .btn-msg-action:hover {
                background: #f8fafc;
                color: #10b981;
                border-color: #10b981;
            }

            .tick {
                width: 14px;
                height: 14px;
                color: #94a3b8;
                opacity: 0.6;
            }

            .tick.read {
                color: #34b7f1;
                opacity: 1;
            }

            .typing-indicator {
                padding: 8px 24px;
                font-size: 0.8rem;
                color: #10b981;
                font-weight: 600;
                font-style: italic;
                height: 30px;
                display: none;
                align-items: center;
                gap: 4px;
            }

            .status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #cbd5e1;
                display: inline-block;
                margin-left: 6px;
            }

            .status-dot.online {
                background: #10b981;
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
            }

            .attachment-preview {
                background: rgba(16, 185, 129, 0.05);
                border-top: 1px solid #e2e8f0;
                padding: 8px 16px;
            }

            .preview-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: white;
                padding: 6px 12px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                font-size: 0.85rem;
                color: #0f172a;
                max-width: fit-content;
            }

            .btn-remove-file {
                background: none;
                border: none;
                color: #ef4444;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 10px;
                line-height: 1;
                padding: 0;
                display: flex;
                align-items: center;
            }

            .reply-preview-container {
                background: #f8fafc;
                border-left: 4px solid #10b981;
                padding: 8px 16px;
                display: none;
                justify-content: space-between;
                align-items: center;
            }

            .reply-header-bubble {
                background: rgba(0,0,0,0.05);
                border-left: 3px solid #10b981;
                padding: 6px 10px;
                border-radius: 4px;
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #64748b;
                cursor: pointer;
            }

            .message.sent .reply-header-bubble {
                border-left-color: #34b7f1;
            }

            .message-media {
                margin-bottom: 8px;
                border-radius: 12px;
                overflow: hidden;
                max-width: 100%;
            }

            .message-media img {
                max-width: 100%;
                display: block;
                border-radius: 8px;
                cursor: pointer;
            }

            .message-media video {
                width: 100%;
                border-radius: 8px;
                background: black;
            }

            .message.is-deleted .message-bubble {
                background: #f3f4f6 !important;
                color: #94a3b8 !important;
                font-style: italic;
                border: 1px dashed #cbd5e1 !important;
            }

            .mobile-back-btn {
                display: none;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background: #f1f5f9;
                border-radius: 10px;
                cursor: pointer;
                color: #0f172a;
            }
        `;
        document.head.appendChild(style);
    },

    renderLayout: function(container) {
        container.innerHTML = `
            <div class="messaging-container">
                <div class="chat-layout">
                    <!-- Left Panel: Conversations -->
                    <div class="conversations-list">
                        <div class="conversations-header">
                            <h2>Messagerie Directe</h2>
                        </div>
                        <div class="conversations-items" id="conv-list">
                            <div class="loader" id="conv-loader" style="display:none;"></div>
                        </div>
                    </div>

                    <!-- Right Panel: Chat Area -->
                    <div class="chat-area">
                        <!-- Empty State -->
                        <div class="chat-empty-state" id="chat-empty" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 40px; background: #fafafa; overflow-y: auto;">
                            <div style="max-width: 600px; text-align: center;">
                                <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 20px; background: rgba(16, 185, 129, 0.1); color: #10b981; margin-bottom: 24px;">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <h2 style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -0.03em;">Transactions & Échanges</h2>
                                <p style="font-size: 0.95rem; color: #64748b; margin: 0 0 40px 0; font-weight: 500;">Discutez et facturez vos prestations en un clic (WeChat-style)</p>
                                
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; text-align: left; width: 100%;">
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                            <span style="font-size: 1.2rem;"><i class="fas fa-credit-card"></i></span>
                                            <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800; color: #0f172a;">Demandes Directes</h4>
                                        </div>
                                        <p style="margin: 0; font-size: 0.8rem; line-height: 1.5; color: #64748b;">
                                            Les prestataires peuvent envoyer des demandes de paiement directement dans le chat. Le client paye instantanément via Stripe Connect.
                                        </p>
                                    </div>
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                            <span style="font-size: 1.2rem;"><i class="fas fa-lock"></i></span>
                                            <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800; color: #0f172a;">Espace Sécurisé</h4>
                                        </div>
                                        <p style="margin: 0; font-size: 0.8rem; line-height: 1.5; color: #64748b;">
                                            Vos échanges sont chiffrés et stockés sur notre base de données sécurisée. Vos transactions transitent par Stripe sans stockage de coordonnées.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Active Chat -->
                        <div id="chat-active" style="display:none; flex-direction:column; height: 100%;">
                            <div class="chat-header">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div class="mobile-back-btn" id="mobile-back-btn">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                                        </svg>
                                    </div>
                                    <div class="conv-avatar" id="active-avatar">DC</div>
                                    <div>
                                        <h3 style="display:flex; align-items:center; gap:6px;">
                                            <span id="active-name-text">Chargement...</span>
                                            <span id="active-status-dot" class="status-dot"></span>
                                        </h3>
                                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.15); color:#10b981; padding:2px 8px; border-radius:10px; font-weight:800; text-transform:uppercase;">Espace Transactionnel</span>
                                    </div>
                                </div>
                            </div>

                            <div class="chat-messages" id="chat-thread">
                                <div class="loader" id="msg-loader" style="display:none;"></div>
                            </div>

                            <div class="typing-indicator" id="typing-indicator">
                                <span id="typing-text">...</span>
                            </div>

                            <!-- Reply Preview -->
                            <div id="reply-preview" class="reply-preview-container">
                                <div style="border-left: 3px solid #10b981; padding-left: 10px;">
                                    <p id="reply-to-name" style="font-weight: 700; font-size: 0.8rem; margin: 0; color: #10b981;">Répondre à...</p>
                                    <p id="reply-to-content" style="margin: 0; font-size: 0.85rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;"></p>
                                </div>
                                <button type="button" class="btn-remove-file" id="btn-cancel-reply">×</button>
                            </div>

                            <div id="attachment-preview" class="attachment-preview" style="display:none;">
                                <div class="preview-content">
                                    <span id="preview-name">image.png</span>
                                    <button type="button" class="btn-remove-file" id="btn-clear-attach">×</button>
                                </div>
                            </div>

                            <div class="chat-input-area">
                                <form class="chat-input-wrapper" id="chat-form">
                                    <button type="button" class="btn-attach" id="btn-trigger-file" title="Joindre un fichier">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                                        </svg>
                                    </button>
                                    <button type="button" class="btn-attach" id="btn-trigger-payment" title="Demander un paiement" style="color: #10b981;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                                            <line x1="2" y1="10" x2="22" y2="10"></line>
                                        </svg>
                                    </button>
                                    <input type="file" id="file-input" style="display:none" accept="image/*,video/*,audio/*,application/pdf">
                                    <textarea id="message-input" placeholder="Écrivez votre message..." rows="1"></textarea>
                                    <button type="submit" class="btn-send" id="btn-send">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    setupFormListeners: function() {
        const backBtn = document.getElementById('mobile-back-btn');
        if (backBtn) {
            backBtn.onclick = () => {
                document.querySelector('.chat-layout')?.classList.remove('mobile-chat-active');
            };
        }

        const fileInput = document.getElementById('file-input');
        const triggerFile = document.getElementById('btn-trigger-file');
        if (triggerFile && fileInput) {
            triggerFile.onclick = () => fileInput.click();
            fileInput.onchange = (e) => this.handleFileUpload(e.target);
        }

        const clearAttach = document.getElementById('btn-clear-attach');
        if (clearAttach) {
            clearAttach.onclick = () => this.clearAttachment();
        }

        const cancelReply = document.getElementById('btn-cancel-reply');
        if (cancelReply) {
            cancelReply.onclick = () => this.cancelReply();
        }

        const triggerPayment = document.getElementById('btn-trigger-payment');
        if (triggerPayment) {
            triggerPayment.onclick = () => this.openPaymentRequestModal();
        }

        const form = document.getElementById('chat-form');
        if (form) {
            form.onsubmit = (e) => this.sendMessage(e);
        }

        const input = document.getElementById('message-input');
        if (input) {
            input.oninput = (e) => {
                this.handleTyping();
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight < 120 ? e.target.scrollHeight : 120) + 'px';
            };
        }
    },

    initMessaging: async function(params) {
        try {
            const targetUserId = params ? params.get('to') : null;
            if (targetUserId && targetUserId !== this.currentUserId) {
                await this.ensureConversationWith(targetUserId);

                // Handle prefilled query params
                const prefill = params.get('prefill');
                const jobId = params.get('job');
                const input = document.getElementById('message-input');

                if (input) {
                    if (prefill) {
                        input.value = decodeURIComponent(prefill);
                    } else if (jobId) {
                        const { data: job } = await window._supabase.from('job_offers').select('title').eq('id', jobId).single();
                        if (job) {
                            input.value = `Bonjour, je suis intéressé par votre mission : "${job.title}". Pouvons-nous en discuter ?`;
                        }
                    } else if (params.get('project')) {
                        const pId = params.get('project');
                        const amt = params.get('amount');
                        const { data: proj } = await window._supabase.from('projects').select('title').eq('id', pId).single();
                        if (proj) {
                            if (amt) {
                                input.value = `Bonjour, je souhaite soutenir votre projet "${proj.title}" avec une contribution de ${amt} €. Pouvons-nous en discuter ?`;
                            } else {
                                input.value = `Bonjour, je souhaite soutenir votre projet "${proj.title}". Pouvons-nous en discuter ?`;
                            }
                        }
                    }
                    input.style.height = 'auto';
                    input.style.height = input.scrollHeight + 'px';
                }
            }

            await this.loadConversations();
        } catch (err) {
            console.error("[MessagesModule] initMessaging error:", err);
        }
    },

    ensureConversationWith: async function(targetUserId) {
        const { data: myConvs, error: e1 } = await window._supabase.from('conversation_participants').select('conversation_id').eq('user_id', this.currentUserId);
        if (e1) {
            console.error("Error fetching myConvs:", e1.message);
            return;
        }

        const myConvIds = myConvs ? myConvs.map(c => c.conversation_id) : [];
        if (myConvIds.length > 0) {
            const { data: shared, error: e2 } = await window._supabase.from('conversation_participants')
                .select('conversation_id')
                .in('conversation_id', myConvIds)
                .eq('user_id', targetUserId)
                .limit(1);

            if (shared && shared.length > 0) {
                this.activeConversationId = shared[0].conversation_id;
                return;
            }
        }

        // Create conversation
        const newId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : (Math.random().toString(36).substring(2) + Date.now().toString(36));
        const { error: errConv } = await window._supabase.from('conversations').insert([{
            id: newId,
            updated_at: new Date().toISOString()
        }]);

        if (errConv) {
            console.error("Error creating conversation:", errConv.message);
            return;
        }

        await window._supabase.from('conversation_participants').insert([
            { conversation_id: newId, user_id: this.currentUserId, lead_status: 'Nouveau' },
            { conversation_id: newId, user_id: targetUserId, lead_status: 'Nouveau' }
        ]);

        this.activeConversationId = newId;

        const layout = document.querySelector('.chat-layout');
        if (layout && window.innerWidth <= 768) {
            layout.classList.add('mobile-chat-active');
        }
    },

    loadConversations: async function() {
        const loader = document.getElementById('conv-loader');
        const convListEl = document.getElementById('conv-list');
        if (convListEl) convListEl.innerHTML = '';
        if (loader) loader.style.display = 'block';

        try {
            const { data: myConvs, error: errorConvs } = await window._supabase
                .from('conversation_participants')
                .select('conversation_id, conversations(title)')
                .eq('user_id', this.currentUserId);
            if (errorConvs) throw errorConvs;

            if (!myConvs || myConvs.length === 0) {
                if (convListEl) convListEl.innerHTML = '<p style="padding: 24px; color: #64748b; text-align: center; font-size: 0.9rem;">Aucune conversation.</p>';
                return;
            }

            const convIds = myConvs.map(c => c.conversation_id);
            this.cachedConvTitles = {};
            myConvs.forEach(c => {
                if (c.conversations && c.conversations.title) {
                    this.cachedConvTitles[c.conversation_id] = c.conversations.title;
                }
            });

            const { data: otherParticipants, error: errorOthers } = await window._supabase.from('conversation_participants')
                .select('conversation_id, user_id')
                .in('conversation_id', convIds)
                .neq('user_id', this.currentUserId);

            if (errorOthers) throw errorOthers;

            const otherUserIds = otherParticipants.map(p => p.user_id);
            const { data: profiles, error: errorProf } = await window._supabase.from('profiles')
                .select('id, full_name, avatar_url, title, skills')
                .in('id', otherUserIds);

            if (errorProf) throw errorProf;

            profiles.forEach(p => this.cachedProfiles[p.id] = p);

            otherParticipants.forEach(participant => {
                const profile = this.cachedProfiles[participant.user_id];
                if (!profile) return;

                const convId = participant.conversation_id;
                const sasTitle = this.cachedConvTitles[convId];
                const isSas = sasTitle && sasTitle.startsWith('Sas -');

                const name = isSas ? sasTitle : (profile.full_name || 'Anonyme');
                const initials = isSas ? '<i class="fas fa-briefcase"></i>' : name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                const avatar = isSas
                    ? `<div class="conv-avatar" style="background:#eff6ff; color:#3b82f6; font-size:1.25rem; font-weight:bold; display:flex; align-items:center; justify-content:center;"><i class="fas fa-briefcase"></i></div>`
                    : (profile.avatar_url
                        ? `<img src="${profile.avatar_url}" class="conv-avatar">`
                        : `<div class="conv-avatar">${initials}</div>`);

                const isActive = (convId === this.activeConversationId);

                const item = document.createElement('div');
                item.className = 'conversation-item' + (isActive ? ' active' : '');
                item.id = 'conv-item-' + convId;
                item.onclick = () => this.selectConversation(convId, profile);

                const subtitle = isSas 
                    ? `<span style="background:rgba(16,185,129,0.1); color:#10b981; padding:2px 8px; border-radius:100px; font-size:0.65rem; font-weight:800; text-transform:uppercase;">Sas Pro Actif <i class="fas fa-bolt"></i></span>`
                    : (profile.title || profile.skills || 'Cliquez pour ouvrir');

                item.innerHTML = `
                    ${avatar}
                    <div class="conv-info">
                        <p class="conv-name" style="${isSas ? 'font-weight:900; color:#0f172a;' : ''}">${name}</p>
                        <p class="conv-preview">${subtitle}</p>
                    </div>
                `;
                convListEl.appendChild(item);
            });

            if (this.activeConversationId) {
                const pInfo = otherParticipants.find(p => p.conversation_id === this.activeConversationId);
                if (pInfo && this.cachedProfiles[pInfo.user_id]) {
                    this.selectConversation(this.activeConversationId, this.cachedProfiles[pInfo.user_id]);
                    return;
                }
            }

            if (otherParticipants.length > 0) {
                const first = otherParticipants[0];
                this.selectConversation(first.conversation_id, this.cachedProfiles[first.user_id]);
            }
        } catch (err) {
            console.error("Error loading conversations:", err);
        } finally {
            if (loader) loader.style.display = 'none';
        }
    },

    selectConversation: async function(convId, profile) {
        this.activeConversationId = convId;

        document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
        const currentItem = document.getElementById('conv-item-' + convId);
        if (currentItem) currentItem.classList.add('active');

        const chatEmpty = document.getElementById('chat-empty');
        if (chatEmpty) chatEmpty.style.display = 'none';
        const chatActive = document.getElementById('chat-active');
        if (chatActive) chatActive.style.display = 'flex';

        const layout = document.querySelector('.chat-layout');
        if (layout) layout.classList.add('mobile-chat-active');

        const sasTitle = this.cachedConvTitles ? this.cachedConvTitles[convId] : null;
        const isSas = sasTitle && sasTitle.startsWith('Sas -');

        const name = isSas ? sasTitle : (profile.full_name || 'Anonyme');
        const initials = isSas ? '<i class="fas fa-briefcase"></i>' : name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const nameTextEl = document.getElementById('active-name-text');
        if (nameTextEl) nameTextEl.textContent = name;

        const avatarEl = document.getElementById('active-avatar');
        if (avatarEl) {
            if (isSas) {
                avatarEl.style.background = '#eff6ff';
                avatarEl.innerHTML = `<span style="font-size:1.2rem; display:flex; align-items:center; justify-content:center; width:100%; height:100%;"><i class="fas fa-briefcase"></i></span>`;
            } else if (profile.avatar_url) {
                avatarEl.style.background = 'transparent';
                avatarEl.innerHTML = `<img src="${profile.avatar_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            } else {
                avatarEl.style.background = '#e2e8f0';
                avatarEl.innerHTML = initials;
            }
        }

        this.subscribeToMessages(convId);
        await this.loadMessages(convId);
    },

    loadMessages: async function(convId) {
        const thread = document.getElementById('chat-thread');
        const loader = document.getElementById('msg-loader');
        if (loader) loader.style.display = 'block';

        if (thread) {
            Array.from(thread.children).forEach(child => {
                if (child.id !== 'msg-loader') child.remove();
            });
        }

        try {
            const { data: messages, error } = await window._supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', convId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            if (messages) {
                for (let msg of messages) {
                    await this.appendMessage(msg);
                }
            }
            this.scrollToBottom();
        } catch (err) {
            console.error("Error loading messages:", err);
        } finally {
            if (loader) loader.style.display = 'none';
        }
    },

    appendMessage: async function(msg) {
        if (!msg) return;
        const thread = document.getElementById('chat-thread');
        if (!thread) return;

        const isMe = (msg.sender_id === this.currentUserId);
        const isDeleted = msg.is_deleted === true;
        const timeObj = new Date(msg.created_at);
        const time = !isNaN(timeObj) ? timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

        // Fetch sender profile if missing
        if (msg.sender_id && !isMe && !this.cachedProfiles[msg.sender_id]) {
            try {
                const { data: p } = await window._supabase.from('profiles').select('id, full_name, avatar_url, title').eq('id', msg.sender_id).maybeSingle();
                if (p) this.cachedProfiles[msg.sender_id] = p;
            } catch (err) {
                console.error("Error fetching message sender profile:", err);
            }
        }

        // Avoid duplicate message DOM elements
        if (msg.id) {
            if (!isDeleted && msg.sender_id === this.currentUserId) {
                const temps = document.querySelectorAll('[id^="msg-temp-"]');
                for (let t of temps) {
                    const contentEl = t.querySelector('.message-content');
                    if (contentEl && contentEl.textContent.trim() === (msg.content || '').trim()) {
                        t.id = 'msg-' + msg.id;
                        break;
                    }
                }
            }

            this.cachedMessages[msg.id] = msg;
            const existing = document.getElementById('msg-' + msg.id);
            if (existing) {
                const newEl = this.createMessageElement(msg, isMe, isDeleted, time);
                existing.replaceWith(newEl);
                return;
            }
        }

        const el = this.createMessageElement(msg, isMe, isDeleted, time);
        thread.appendChild(el);
        this.scrollToBottom();
    },

    createMessageElement: function(msg, isMe, isDeleted, time) {
        const el = document.createElement('div');
        el.id = 'msg-' + msg.id;
        el.className = 'message ' + (isMe ? 'sent' : 'received') + (isDeleted ? ' is-deleted' : '');

        let mediaHtml = '';
        if (msg.media_url && !isDeleted) {
            const url = msg.media_url;
            if (msg.media_type === 'image') {
                mediaHtml = `<div class="message-media"><img src="${url}" onclick="window.MessagesModule.openLightbox('${url}')"></div>`;
            } else if (msg.media_type === 'video') {
                mediaHtml = `<div class="message-media"><video src="${url}" controls></video></div>`;
            } else {
                mediaHtml = `<div class="message-media-placeholder" style="font-size:0.8rem; color:#64748b; font-style:italic;">[Fichier Joint]</div>`;
            }
        }

        let replyHtml = '';
        if (msg.reply_to_id && !isDeleted) {
            const parent = this.cachedMessages[msg.reply_to_id];
            if (parent) {
                const pName = isMe ? "Moi" : (this.cachedProfiles[parent.sender_id]?.full_name || "L'autre");
                const pContent = parent.is_deleted ? "Message supprimé" : (parent.content || "Média");
                replyHtml = `<div class="reply-header-bubble" onclick="document.getElementById('msg-${parent.id}')?.scrollIntoView({behavior:'smooth'})">
                    <strong>${pName}</strong>: ${pContent.substring(0, 50)}${pContent.length > 50 ? '...' : ''}
                </div>`;
            }
        }

        const optionsHtml = (isDeleted || !msg.id) ? '' : `
            <div class="message-actions-bar">
                ${isMe ? `<button class="btn-msg-action" onclick="window.MessagesModule.deleteMessage('${msg.id}')" title="Supprimer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>` : ''}
                <button class="btn-msg-action" onclick="window.MessagesModule.handleReply('${msg.id}', '${isMe ? 'Moi' : (this.cachedProfiles[msg.sender_id]?.full_name || 'Expert')}', '${(msg.content || 'Média').replace(/'/g, "\\'")}')" title="Répondre">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 10h10a5 5 0 015 5v2M3 10l6-6m-6 6l6 6"/></svg>
                </button>
            </div>
        `;

        let statusHtml = '';
        if (isMe && !isDeleted) {
            const isRead = !!msg.read_at;
            statusHtml = `
                <span class="msg-status">
                    <svg class="tick ${isRead ? 'read' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path d="M20 6L9 17l-5-5"/>
                        <path d="M20 6L9 17l-5-5" style="transform: translateX(4px)"/>
                    </svg>
                </span>
            `;
        }

        const isPaymentRequest = !isDeleted && msg.content && msg.content.startsWith('[PAYMENT_REQUEST:');
        let contentBodyHtml = '';

        if (isPaymentRequest) {
            try {
                const cleanContent = msg.content.substring(17, msg.content.length - 1);
                const parts = cleanContent.split(':');
                const title = parts[0] || 'Demande de paiement';
                const amount = parts[1] || '0.00';
                const providerId = parts[2] || '';
                const acomptePercent = parseInt(parts[3] || '100');
                const isAdminQuote = parts[4] === 'true';

                const totalVal = parseFloat(amount);
                const acompteVal = parseFloat(((totalVal * acomptePercent) / 100).toFixed(2));
                const isMeProvider = (providerId === this.currentUserId);
                
                let paymentDetails = '';
                if (acomptePercent < 100) {
                    paymentDetails = `
                        <div style="font-size:0.8rem; color:${isMe ? '#94a3b8' : '#64748b'}; margin-bottom:12px;">
                            <span>Montant Total : ${totalVal.toLocaleString('fr-FR')} €</span><br>
                            <span style="font-weight:800; color:#10b981;">Acompte (${acomptePercent}%) : ${acompteVal.toLocaleString('fr-FR')} €</span>
                        </div>
                    `;
                }

                contentBodyHtml = `
                    <div class="payment-request-card" style="background: ${isMe ? '#1e293b' : '#ffffff'}; color: ${isMe ? '#ffffff' : '#0f172a'}; border: 1px solid ${isMe ? '#334155' : '#e2e8f0'}; border-radius: 16px; padding: 16px; margin: 8px 0; max-width: 320px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: left;">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div style="width:36px; height:36px; border-radius:50%; background:rgba(16,185,129,0.1); display:flex; align-items:center; justify-content:center; color:#10b981; flex-shrink:0;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            </div>
                            <div>
                                <div style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:#10b981; letter-spacing:0.05em;">Demande de paiement</div>
                                <div style="font-weight:700; font-size:0.9rem; margin-top:2px;">${title}</div>
                            </div>
                        </div>
                        ${paymentDetails ? paymentDetails : `
                            <div style="font-size:1.6rem; font-weight:950; margin-bottom:16px; display:flex; align-items:baseline; gap:4px; color:#10b981;">
                                ${amount} <span style="font-size:0.9rem; font-weight:700; color:${isMe ? '#94a3b8' : '#64748b'};">€ EUR</span>
                            </div>
                        `}
                        ${isMeProvider ? `
                            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600; text-align:center; padding:8px; border-radius:8px; background:rgba(255,255,255,0.05);">En attente de règlement...</div>
                        ` : `
                            <button onclick="window.MessagesModule.payRequest('${title.replace(/'/g, "\\'")}', '${acompteVal}', '${providerId}', ${isAdminQuote}, event)" style="width:100%; padding:10px; background:#10b981; color:white; border:none; border-radius:10px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.2s;">
                                <span><i class="fas fa-credit-card"></i> Régler ${acomptePercent < 100 ? `l'acompte (${acompteVal} €)` : 'via Stripe'}</span>
                            </button>
                        `}
                    </div>
                `;
            } catch (e) {
                console.error("Error parsing payment request:", e);
                contentBodyHtml = `<div class="message-content">[Demande de paiement invalide]</div>`;
            }
        } else {
            const escapedContent = isDeleted ? "Message supprimé" : (msg.content || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>');
            contentBodyHtml = `<div class="message-content">${escapedContent}</div>`;
        }

        const isCircle = msg.conversation_id && msg.conversation_id.startsWith('00000000-0000-0000-0000-');
        const senderNameHtml = (!isMe && isCircle) ? `<div style="font-size:0.75rem; font-weight:800; color:#10b981; margin-bottom:6px;">${this.cachedProfiles[msg.sender_id]?.full_name || 'Membre DTC'}</div>` : '';

        el.innerHTML = `
            <div class="message-bubble">
                ${senderNameHtml}
                ${replyHtml}
                ${mediaHtml}
                ${contentBodyHtml}
                <div class="message-info">
                    ${time}
                    ${statusHtml}
                </div>
                ${optionsHtml}
            </div>
        `;
        return el;
    },

    scrollToBottom: function() {
        const thread = document.getElementById('chat-thread');
        if (thread) thread.scrollTop = thread.scrollHeight;
    },

    sendMessage: async function(e) {
        if (e) e.preventDefault();
        if (!this.activeConversationId) return;

        const input = document.getElementById('message-input');
        let content = input ? input.value.trim() : '';
        if (!content && !this.pendingFile) return;

        const btnSend = document.getElementById('btn-send');
        const originalBtnHtml = btnSend ? btnSend.innerHTML : '';

        try {
            if (this.pendingFile && btnSend) {
                btnSend.innerHTML = '<div class="loader" style="width:16px; height:16px; margin:0;"></div>';
                btnSend.disabled = true;
            }

            const uploadRes = await this.uploadPendingFile(this.activeConversationId);
            const mediaUrl = uploadRes?.url || null;
            const mediaType = uploadRes?.type || null;

            if (input) {
                input.value = '';
                input.style.height = 'auto';
            }

            const tempMsg = {
                id: 'temp-' + Date.now(),
                sender_id: this.currentUserId,
                content: content,
                media_url: mediaUrl,
                media_type: mediaType,
                reply_to_id: this.replyToId,
                created_at: new Date().toISOString()
            };

            this.appendMessage(tempMsg);
            this.scrollToBottom();

            const { data, error } = await window._supabase.from('messages').insert({
                conversation_id: this.activeConversationId,
                sender_id: this.currentUserId,
                content: content,
                media_url: mediaUrl,
                media_type: mediaType,
                reply_to_id: this.replyToId
            }).select().single();

            if (error) throw error;
            if (data) this.appendMessage(data);

            if (this.pendingFile) this.clearAttachment();
            if (this.replyToId) this.cancelReply();

        } catch (err) {
            console.error("[MessagesModule] Send error:", err);
            alert("Erreur lors de l'envoi : " + err.message);
        } finally {
            if (btnSend) {
                btnSend.innerHTML = originalBtnHtml;
                btnSend.disabled = false;
            }
        }
    },

    uploadPendingFile: async function(convId) {
        if (!this.pendingFile) return null;
        try {
            const fileExt = this.pendingFile.name.split('.').pop();
            const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
            const filePath = `chat/${convId}/${fileName}`;

            const { error: uploadError } = await window._supabase.storage
                .from('chat-media')
                .upload(filePath, this.pendingFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = window._supabase.storage
                .from('chat-media')
                .getPublicUrl(filePath);

            let mediaType = 'document';
            if (this.pendingFile.type.startsWith('image/')) mediaType = 'image';
            else if (this.pendingFile.type.startsWith('video/')) mediaType = 'video';
            else if (this.pendingFile.type.startsWith('audio/')) mediaType = 'audio';

            return { url: publicUrl, type: mediaType };
        } catch (err) {
            console.error("Upload error:", err);
            throw err;
        }
    },

    handleFileUpload: function(input) {
        const file = input.files[0];
        if (!file) return;

        const MAX_SIZE = 50 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("Le fichier est trop volumineux. Limite de 50 Mo.");
            input.value = '';
            return;
        }

        this.pendingFile = file;
        const nameEl = document.getElementById('preview-name');
        if (nameEl) nameEl.textContent = file.name;
        const preview = document.getElementById('attachment-preview');
        if (preview) preview.style.display = 'block';
        input.value = '';
    },

    clearAttachment: function() {
        this.pendingFile = null;
        const preview = document.getElementById('attachment-preview');
        if (preview) preview.style.display = 'none';
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    },

    handleReply: function(msgId, senderName, content) {
        this.replyToId = msgId;
        const nameEl = document.getElementById('reply-to-name');
        if (nameEl) nameEl.textContent = `Répondre à ${senderName}`;
        const contentEl = document.getElementById('reply-to-content');
        if (contentEl) contentEl.textContent = content;
        const preview = document.getElementById('reply-preview');
        if (preview) preview.style.display = 'flex';
        const input = document.getElementById('message-input');
        if (input) input.focus();
    },

    cancelReply: function() {
        this.replyToId = null;
        const preview = document.getElementById('reply-preview');
        if (preview) preview.style.display = 'none';
    },

    deleteMessage: async function(msgId) {
        if (!msgId || msgId.startsWith('temp-')) return;
        if (!confirm("Supprimer ce message pour tout le monde ?")) return;

        try {
            const { data, error } = await window._supabase
                .from('messages')
                .update({ 
                    is_deleted: true, 
                    content: 'Message supprimé',
                    media_url: null,
                    media_type: null
                })
                .eq('id', msgId)
                .select();

            if (error) throw error;
            if (data && data[0]) this.appendMessage(data[0]);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Erreur base de données : " + err.message);
        }
    },

    subscribeToMessages: function(convId) {
        if (this.realtimeChannel) window._supabase.removeChannel(this.realtimeChannel);

        this.realtimeChannel = window._supabase.channel('messages_channel_' + convId)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${convId}`
            }, payload => {
                const newMsg = payload.new;
                if (newMsg.sender_id !== this.currentUserId) {
                    this.appendMessage(newMsg);
                    this.scrollToBottom();
                    this.markMessagesAsRead(convId);
                }
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${convId}`
            }, payload => {
                this.appendMessage(payload.new);
            })
            .subscribe();

        this.subscribeToPresence(convId);
        this.markMessagesAsRead(convId);
    },

    subscribeToPresence: function(convId) {
        if (this.presenceChannel) window._supabase.removeChannel(this.presenceChannel);

        this.presenceChannel = window._supabase.channel('presence_' + convId, {
            config: { presence: { key: this.currentUserId } }
        });

        this.presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = this.presenceChannel.presenceState();
                if (!state) return;
                
                const otherUsers = Object.values(state).flat().filter(u => u && u.user_id !== this.currentUserId);
                const statusDot = document.getElementById('active-status-dot');
                const typingIndicator = document.getElementById('typing-indicator');
                
                if (otherUsers.length > 0) {
                    if (statusDot) statusDot.classList.add('online');
                    const isTyping = otherUsers.some(u => u.typing);
                    if (typingIndicator) {
                        typingIndicator.style.display = isTyping ? 'flex' : 'none';
                        const typingText = document.getElementById('typing-text');
                        if (typingText) typingText.textContent = `En train d'écrire...`;
                    }
                } else {
                    if (statusDot) statusDot.classList.remove('online');
                    if (typingIndicator) typingIndicator.style.display = 'none';
                }
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await this.presenceChannel.track({
                        user_id: this.currentUserId,
                        typing: false,
                        last_seen: new Date().toISOString()
                    });
                }
            });
    },

    markMessagesAsRead: async function(convId) {
        await window._supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('conversation_id', convId)
            .neq('sender_id', this.currentUserId)
            .is('read_at', null);
    },

    handleTyping: function() {
        if (!this.presenceChannel) return;
        
        this.presenceChannel.track({
            user_id: this.currentUserId,
            typing: true,
            last_seen: new Date().toISOString()
        });

        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            if (this.presenceChannel) {
                this.presenceChannel.track({
                    user_id: this.currentUserId,
                    typing: false,
                    last_seen: new Date().toISOString()
                });
            }
        }, 3000);
    },

    openPaymentRequestModal: function() {
        if (!this.activeConversationId) {
            alert("Veuillez d'abord sélectionner une conversation.");
            return;
        }
        const titleEl = document.getElementById('pay-req-title');
        const amtEl = document.getElementById('pay-req-amount');
        if (titleEl) titleEl.value = '';
        if (amtEl) amtEl.value = '';
        const modal = document.getElementById('payment-request-modal');
        if (modal) modal.style.display = 'flex';
    },

    closePaymentRequestModal: function() {
        const modal = document.getElementById('payment-request-modal');
        if (modal) modal.style.display = 'none';
    },

    submitPaymentRequest: async function(e) {
        e.preventDefault();
        const title = document.getElementById('pay-req-title').value.trim();
        const amount = document.getElementById('pay-req-amount').value.trim();
        const acompte = document.getElementById('pay-req-acompte')?.value || '100';
        if (!title || !amount) return;

        const cleanTitle = title.replace(/:/g, '-');
        const isAdmin = (window.App && window.App.state.role === 'admin') ? 'true' : 'false';
        const paymentPayload = `[PAYMENT_REQUEST:${cleanTitle}:${amount}:${this.currentUserId}:${acompte}:${isAdmin}]`;
        
        this.closePaymentRequestModal();
        
        const input = document.getElementById('message-input');
        if (input) {
            input.value = paymentPayload;
            await this.sendMessage();
        }
    },

    payRequest: async function(title, amount, providerId, isAdminQuote, event) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) {
                if (window.showFlashMessage) {
                    window.showFlashMessage("Veuillez vous connecter pour procéder au paiement.", "error");
                } else {
                    alert("Veuillez vous connecter pour procéder au paiement.");
                }
                return;
            }
            
            const btn = event?.currentTarget || (window.event && window.event.currentTarget);
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span>Redirection...</span>';
            }
            
            const response = await fetch('https://vlpzmxddgdjjtrpbtksd.supabase.co/functions/v1/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token || ''}`,
                },
                body: JSON.stringify({
                    type: 'quote',
                    item_title: title,
                    item_price: parseFloat(amount),
                    provider_id: providerId,
                    buyer_id: session.user.id,
                    is_admin_quote: isAdminQuote === true || isAdminQuote === 'true' ? 'true' : 'false'
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Erreur lors de la création du paiement');
            }
        } catch (err) {
            console.error(err);
            if (window.showFlashMessage) {
                window.showFlashMessage("Erreur de paiement : " + err.message, "error");
            } else {
                alert("Erreur de paiement : " + err.message);
            }
            const btn = event?.currentTarget;
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span><i class="fas fa-credit-card"></i> Régler via Stripe</span>';
            }
        }
    },

    openLightbox: function(src) {
        const lb = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-img');
        if (lb && img) {
            img.src = src;
            lb.style.display = 'flex';
        }
    },

    closeLightbox: function() {
        const lb = document.getElementById('lightbox');
        if (lb) lb.style.display = 'none';
    }
};

window.MessagesModule = MessagesModule;
