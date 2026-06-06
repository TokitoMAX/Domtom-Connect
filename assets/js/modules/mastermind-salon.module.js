/**
 * MastermindSalonModule
 * Dedicated logic for the Mastermind Private Group Chat
 */

window.MastermindSalonModule = {
    conversationId: '11111111-1111-1111-1111-111111111111',
    channel: null,
    currentProfile: null,
    profilesCache: {},

    route: async function(viewId, container, profile, session, params) {
        console.log("[MastermindSalonModule] Mounting UI...");
        
        container.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto; background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; flex-direction: column; height: calc(100vh - 120px); box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                <!-- Header -->
                <div style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;"><i class="fas fa-crown" style="color: #fbbf24;"></i></div>
                    <div>
                        <h2 style="margin: 0 0 4px 0; font-size: 1.25rem; font-weight: 900; letter-spacing: -0.02em;">Salon Mastermind DTC</h2>
                        <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 500;">Groupe privé réservé aux membres du Club</p>
                    </div>
                </div>

                <!-- Chat Thread -->
                <div id="mastermind-chat-thread" style="flex: 1; padding: 24px; overflow-y: auto; background: #f8fafc; display: flex; flex-direction: column;">
                    <!-- Messages will be injected here -->
                </div>

                <!-- Input Area -->
                <div style="padding: 16px 24px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; align-items: flex-end;">
                    <textarea id="mastermind-chat-input" placeholder="Écrivez votre message..." style="flex: 1; min-height: 48px; max-height: 150px; padding: 14px 20px; border-radius: 24px; border: 1px solid #cbd5e1; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; resize: none; outline: none; background: #f8fafc;" rows="1"></textarea>
                    <button id="mastermind-send-btn" style="width: 48px; height: 48px; border-radius: 50%; background: #10b981; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; transition: transform 0.2s, background 0.2s;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        await this.init();
    },

        init: async function() {
        console.log("MastermindSalonModule.init() called");
        try {
            const db = window._supabase;
            if (!db) throw new Error("Supabase is missing");

            this.currentProfile = window.App.state.profile;
            if (!this.currentProfile) throw new Error("Profile is missing");

            console.log("Ensuring conversation exists...");
            await this.ensureConversationExists(db);

            console.log("Loading messages...");
            await this.loadMessages(db);

            console.log("Subscribing realtime...");
            this.subscribeRealtime(db);

            console.log("Setting up listeners...");
            const input = document.getElementById('mastermind-chat-input');
            const sendBtn = document.getElementById('mastermind-send-btn');
            if (input && sendBtn) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage(db, input.value);
                        input.value = '';
                    }
                });
                sendBtn.addEventListener('click', () => {
                    this.sendMessage(db, input.value);
                    input.value = '';
                });
            } else {
                throw new Error("Input or SendBtn not found in DOM");
            }
            console.log("MastermindSalonModule.init() success");
        } catch (err) {
            console.error("MastermindSalonModule ERROR:", err);
            alert("Erreur Mastermind : " + err.message);
        }
    },

        ensureConversationExists: async function(db) {
        // Just try to fetch it, if not, create it
        const { data } = await db.from('conversations').select('id').eq('id', this.conversationId).maybeSingle();
        if (!data) {
            const res = await db.from('conversations').insert({
                id: this.conversationId,
                title: 'Salon Mastermind DTC',
                updated_at: new Date().toISOString()
            });
            if (res.error) {
                console.error("Mastermind: Error creating conversation:", res.error);
                return;
            }
        }

        // Add user as participant if not already
        const { data: part } = await db.from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', this.conversationId)
            .eq('user_id', this.currentProfile.id)
            .maybeSingle();

        if (!part) {
            const resPart = await db.from('conversation_participants').insert({
                conversation_id: this.conversationId,
                user_id: this.currentProfile.id,
                lead_status: 'Actif'
            });
            if (resPart.error) {
                console.error("Mastermind: Error adding participant:", resPart.error);
                return;
            }
        }
    },

    loadMessages: async function(db) {
        const container = document.getElementById('mastermind-chat-thread');
        if (!container) return;
        
        container.innerHTML = `
            <div style="text-align:center; margin-bottom:16px; margin-top:8px;">
                <span style="background:#fff; padding:6px 14px; border-radius:8px; font-size:0.75rem; font-weight:600; color:#54656f; box-shadow:0 1px 1px rgba(11,20,26,0.1);">Aujourd'hui</span>
            </div>
            <div style="text-align:center; margin-bottom:16px;">
                <span style="background:#ffeecd; padding:8px 16px; border-radius:8px; font-size:0.75rem; font-weight:600; color:#54656f; box-shadow:0 1px 1px rgba(11,20,26,0.1); display:inline-block;">🔒 Ce salon est privé. Les échanges sont sécurisés et réservés aux membres validés du Club.</span>
            </div>
            <div style="text-align:center; padding: 20px; color: #64748b; font-weight: 600;" id="mastermind-loading">Chargement des messages...</div>
        `;

        const { data: messages, error } = await db
            .from('messages')
            .select('*')
            .eq('conversation_id', this.conversationId)
            .order('created_at', { ascending: true })
            .limit(100);
            
        const loader = document.getElementById('mastermind-loading');
        if (loader) loader.remove();

        if (error) {
            console.error(error);
            return;
        }

        if (messages && messages.length > 0) {
            for (let msg of messages) {
                await this.appendMessage(db, container, msg);
            }
        }
        this.scrollToBottom(container);
    },

    appendMessage: async function(db, container, msg) {
        if (!this.profilesCache[msg.sender_id]) {
            const { data: profile } = await db.from('profiles').select('full_name, role, territory').eq('id', msg.sender_id).single();
            if (profile) {
                this.profilesCache[msg.sender_id] = profile;
            }
        }
        
        const profile = this.profilesCache[msg.sender_id] || { full_name: 'Utilisateur inconnu', territory: '', role: '' };
        const isMe = msg.sender_id === this.currentProfile.id;
        const timeStr = new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        let div = document.getElementById(`mastermind-msg-${msg.id}`);
        const isUpdate = !!div;

        if (!isUpdate) {
            div = document.createElement('div');
            div.id = `mastermind-msg-${msg.id}`;
            div.style.display = 'flex';
            div.style.justifyContent = isMe ? 'flex-end' : 'flex-start';
            div.style.marginBottom = '4px';
            div.style.position = 'relative';
        }
        
        const bgColor = isMe ? '#d9fdd3' : '#fff'; // WhatsApp light green for "me", white for others
        const colorTitle = isMe ? '#10b981' : '#0284c7';
        
        // Use a generic placeholder if deleted (though if actually deleted from DB it'll trigger DELETE)
        // If they use soft deletes (e.g. content = 'Ce message a été supprimé'), it will just show that.
        
        div.innerHTML = `
            <div style="background:${bgColor}; max-width:65%; min-width:200px; padding:6px 8px 8px 12px; border-radius:${isMe ? '8px 0 8px 8px' : '0 8px 8px 8px'}; box-shadow:0 1px 1px rgba(11,20,26,0.1); position:relative; display:flex; flex-direction:column; group">
                <div style="font-size:0.8rem; font-weight:700; color:${colorTitle}; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
                    <span>${isMe ? 'Vous' : profile.full_name} ${profile.territory ? '('+profile.territory+')' : ''}</span>
                    ${isMe ? `
                    <div style="display:flex; gap:8px;">
                        <span style="cursor:pointer; color:#64748b; font-size:0.8rem;" onclick="window.MastermindSalonModule.editMessage('${msg.id}', '${msg.content.replace(/'/g, "\\'")}')"><i class="fas fa-edit"></i></span>
                        <span style="cursor:pointer; color:#ef4444; font-size:0.8rem;" onclick="window.MastermindSalonModule.deleteMessage('${msg.id}')"><i class="fas fa-trash"></i></span>
                    </div>
                    ` : ''}
                </div>
                <span style="font-size:0.95rem; color:#111b21; line-height:1.4; word-break: break-word; white-space: pre-wrap;">${msg.content}</span>
                <span style="font-size:0.65rem; color:#667781; float:right; margin-left:12px; margin-top:8px; align-self:flex-end;">${timeStr} ${isMe ? '✓' : ''}</span>
            </div>
        `;
        
        if (!isUpdate) {
            container.appendChild(div);
        }
    },

    sendMessage: async function(db, content) {
        if (!content || content.trim() === '') return;
        
        const newMsg = {
            conversation_id: this.conversationId,
            sender_id: this.currentProfile.id,
            content: content.trim()
        };

        const res = await db.from('messages').insert([newMsg]);
        if (res.error) {
            console.error("Error sending message:", res.error);
        }
    },

    editMessage: function(msgId, oldContent) {
        const modalId = 'mastermind-edit-modal';
        let modal = document.getElementById(modalId);
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = modalId;
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.fontFamily = "'Inter', sans-serif";

        modal.innerHTML = `
            <div style="background: white; width: 90%; max-width: 400px; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); animation: modalFadeIn 0.2s ease-out;">
                <h3 style="margin: 0 0 16px 0; font-size: 1.25rem; font-weight: 700; color: #0f172a;">Modifier le message</h3>
                <textarea id="mastermind-edit-input" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 0.95rem; min-height: 100px; resize: vertical; margin-bottom: 20px; outline: none;"></textarea>
                <div style="display: flex; justify-content: flex-end; gap: 12px;">
                    <button id="mastermind-edit-cancel" style="padding: 8px 16px; border: none; background: #f1f5f9; color: #475569; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Annuler</button>
                    <button id="mastermind-edit-save" style="padding: 8px 16px; border: none; background: #10b981; color: white; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Enregistrer</button>
                </div>
            </div>
            <style>
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                #mastermind-edit-input:focus { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1); }
                #mastermind-edit-cancel:hover { background: #e2e8f0; }
                #mastermind-edit-save:hover { background: #059669; }
            </style>
        `;

        document.body.appendChild(modal);

        const input = document.getElementById('mastermind-edit-input');
        input.value = oldContent;
        input.focus();

        document.getElementById('mastermind-edit-cancel').onclick = () => modal.remove();
        document.getElementById('mastermind-edit-save').onclick = async () => {
            const newContent = input.value;
            if (newContent && newContent.trim() !== '' && newContent !== oldContent) {
                const db = window._supabase;
                if (db) {
                    const { error } = await db.from('messages')
                        .update({ content: newContent.trim() })
                        .eq('id', msgId)
                        .eq('sender_id', this.currentProfile.id);
                    if (error) console.error("Error updating message:", error);
                }
            }
            modal.remove();
        };
    },

    deleteMessage: function(msgId) {
        const modalId = 'mastermind-delete-modal';
        let modal = document.getElementById(modalId);
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = modalId;
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.fontFamily = "'Inter', sans-serif";

        modal.innerHTML = `
            <div style="background: white; width: 90%; max-width: 400px; border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); animation: modalFadeIn 0.2s ease-out;">
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 16px auto;">
                    <i class="fas fa-trash-alt"></i>
                </div>
                <h3 style="margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 700; color: #0f172a;">Supprimer le message ?</h3>
                <p style="margin: 0 0 24px 0; color: #64748b; font-size: 0.95rem;">Cette action est irréversible. Le message sera définitivement supprimé pour tous les membres du salon.</p>
                <div style="display: flex; justify-content: center; gap: 12px;">
                    <button id="mastermind-delete-cancel" style="flex: 1; padding: 10px; border: none; background: #f1f5f9; color: #475569; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Annuler</button>
                    <button id="mastermind-delete-confirm" style="flex: 1; padding: 10px; border: none; background: #ef4444; color: white; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Supprimer</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('mastermind-delete-cancel').onclick = () => modal.remove();
        document.getElementById('mastermind-delete-confirm').onclick = async () => {
            const db = window._supabase;
            if (db) {
                const { error } = await db.from('messages')
                    .delete()
                    .eq('id', msgId)
                    .eq('sender_id', this.currentProfile.id);
                if (error) console.error("Error deleting message:", error);
            }
            modal.remove();
        };
    },

    subscribeRealtime: function(db) {
        if (this.channel) this.channel.unsubscribe();
        
        this.channel = db.channel('mastermind-salon')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${this.conversationId}` }, payload => {
                const container = document.getElementById('mastermind-chat-thread');
                if (container) {
                    this.appendMessage(db, container, payload.new).then(() => {
                        this.scrollToBottom(container);
                    });
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${this.conversationId}` }, payload => {
                const container = document.getElementById('mastermind-chat-thread');
                if (container) {
                    this.appendMessage(db, container, payload.new);
                }
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${this.conversationId}` }, payload => {
                const msgDiv = document.getElementById(`mastermind-msg-${payload.old.id}`);
                if (msgDiv) msgDiv.remove();
            })
            .subscribe();
    },

    scrollToBottom: function(container) {
        container.scrollTop = container.scrollHeight;
    }
};
