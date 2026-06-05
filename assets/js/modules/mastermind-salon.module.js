/**
 * MastermindSalonModule
 * Dedicated logic for the Mastermind Private Group Chat
 */

window.MastermindSalonModule = {
    conversationId: '11111111-1111-1111-1111-111111111111',
    channel: null,
    currentProfile: null,
    profilesCache: {},

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
            await db.from('conversations').insert({
                id: this.conversationId,
                title: 'Salon Mastermind DTC'
            }).select().maybeSingle();
        }

        // Add user as participant if not already
        const { data: part } = await db.from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', this.conversationId)
            .eq('user_id', this.currentProfile.id)
            .maybeSingle();

        if (!part) {
            await db.from('conversation_participants').insert({
                conversation_id: this.conversationId,
                user_id: this.currentProfile.id,
                lead_status: 'Actif'
            });
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
        
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = isMe ? 'flex-end' : 'flex-start';
        div.style.marginBottom = '4px';
        
        const bgColor = isMe ? '#d9fdd3' : '#fff'; // WhatsApp light green for "me", white for others
        const colorTitle = isMe ? '#10b981' : '#0284c7';
        
        div.innerHTML = `
            <div style="background:${bgColor}; max-width:65%; min-width:200px; padding:6px 8px 8px 12px; border-radius:${isMe ? '8px 0 8px 8px' : '0 8px 8px 8px'}; box-shadow:0 1px 1px rgba(11,20,26,0.1); position:relative;">
                ${!isMe ? `<div style="font-size:0.8rem; font-weight:700; color:${colorTitle}; margin-bottom:4px;">${profile.full_name} ${profile.territory ? '('+profile.territory+')' : ''}</div>` : ''}
                <span style="font-size:0.95rem; color:#111b21; line-height:1.4; word-break: break-word;">${msg.content}</span>
                <span style="font-size:0.65rem; color:#667781; float:right; margin-left:12px; margin-top:8px;">${timeStr} ${isMe ? '✓' : ''}</span>
            </div>
        `;
        
        container.appendChild(div);
    },

    sendMessage: async function(db, content) {
        if (!content || content.trim() === '') return;
        
        const newMsg = {
            conversation_id: this.conversationId,
            sender_id: this.currentProfile.id,
            content: content.trim()
        };

        const { error } = await db.from('messages').insert([newMsg]);
        if (error) console.error("Error sending message:", error);
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
            .subscribe();
    },

    scrollToBottom: function(container) {
        container.scrollTop = container.scrollHeight;
    }
};
