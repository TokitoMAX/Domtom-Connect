/**
 * MomentsModule - Domtom Connect
 * WeChat Moments & X/Twitter-style local social feed module.
 * Support for text updates, photo/video attachments, likes and comments.
 */
const MomentsModule = {
    likes: {},
    comments: {},
    pendingFile: null,

    getDb: function() {
        return window._supabase;
    },

    renderFeed: async function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Render skeleton loader
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #64748b;">
                <div class="splash-loader" style="margin: 0 auto 16px;"></div>
                Chargement du Flux Local...
            </div>
        `;

        try {
            const db = this.getDb();
            const session = window.App?.state?.session;
            const currentUser = session?.user;

            // 1. Fetch Flash status & Services (from showcase_items)
            const { data: rawShowcase, error: errShowcase } = await db
                .from('showcase_items')
                .select('*, profiles:user_id(full_name, avatar_url, role, territory)')
                .order('created_at', { ascending: false })
                .limit(40);

            if (errShowcase) throw errShowcase;

            // 2. Fetch Projects
            const { data: rawProjects, error: errProjects } = await db
                .from('projects')
                .select('*, profiles:owner_id(full_name, avatar_url, role, territory)')
                .order('created_at', { ascending: false })
                .limit(20);

            if (errProjects) {
                console.warn("Could not fetch projects for feed:", errProjects);
            }

            // 3. Merge and Sort
            let feedItems = [];

            if (rawShowcase) {
                rawShowcase.forEach(item => {
                    const profile = item.profiles || {};
                    feedItems.push({
                        id: item.id,
                        userId: item.user_id,
                        authorName: profile.full_name || 'Utilisateur DTC',
                        authorAvatar: profile.avatar_url,
                        authorRole: profile.role || 'prestataire',
                        authorTerritory: profile.territory || 'Outre-mer',
                        type: item.category === 'status' ? 'status' : 'service',
                        title: item.title,
                        content: item.description || '',
                        imageUrl: item.image_url || null,
                        meta: item.category !== 'status' ? `${item.price_prefix || 'À partir de'} ${item.price} €` : null,
                        createdAt: new Date(item.created_at)
                    });
                });
            }

            if (rawProjects) {
                rawProjects.forEach(item => {
                    const profile = item.profiles || {};
                    feedItems.push({
                        id: item.id,
                        userId: item.owner_id,
                        authorName: profile.full_name || 'Porteur de Projet',
                        authorAvatar: profile.avatar_url,
                        authorRole: 'porteur-projet',
                        authorTerritory: profile.territory || item.territory || 'Outre-mer',
                        type: 'project',
                        title: item.project_name || item.title,
                        content: item.description || item.pitch || '',
                        imageUrl: item.image_url || null,
                        meta: 'Nouveau Projet 🚀',
                        createdAt: new Date(item.created_at)
                    });
                });
            }

            // Sort descending by date
            feedItems.sort((a, b) => b.createdAt - a.createdAt);

            // 4. Fetch Likes and Comments for these posts
            const postIds = feedItems.map(item => item.id);
            this.likes = {};
            this.comments = {};

            if (postIds.length > 0) {
                try {
                    const { data: rawLikes } = await db.from('feed_likes').select('*').in('post_id', postIds);
                    if (rawLikes) {
                        rawLikes.forEach(l => {
                            if (!this.likes[l.post_id]) this.likes[l.post_id] = [];
                            this.likes[l.post_id].push(l.user_id);
                        });
                    }

                    const { data: rawComments } = await db.from('feed_comments').select('*, profiles:user_id(full_name, avatar_url)').in('post_id', postIds).order('created_at', { ascending: true });
                    if (rawComments) {
                        rawComments.forEach(c => {
                            if (!this.comments[c.post_id]) this.comments[c.post_id] = [];
                            this.comments[c.post_id].push(c);
                        });
                    }
                } catch (errEngage) {
                    console.warn("Likes or comments tables not active yet in Supabase:", errEngage.message);
                }
            }

            // 5. Render HTML
            let html = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; gap: 20px;">
                    
                    <!-- QUICK SHARE BAR -->
                    ${currentUser ? `
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                            <div style="display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
                                <button onclick="MomentsModule.applyFeedPrompt('tip')" style="background: #f1f5f9; color: #475569; border: none; padding: 6px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;">💡 Astuce</button>
                                <button onclick="MomentsModule.applyFeedPrompt('kudos')" style="background: #fdf2f8; color: #db2777; border: none; padding: 6px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;">❤️ Recommandation</button>
                                <button onclick="MomentsModule.applyFeedPrompt('photo')" style="background: #ecfdf5; color: #059669; border: none; padding: 6px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;">📸 Photo / Vidéo</button>
                                <button onclick="MomentsModule.applyFeedPrompt('clear')" style="background: #f8fafc; color: #94a3b8; border: 1px dashed #e2e8f0; padding: 6px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s;">🧹 Effacer</button>
                            </div>
                            <div style="display: flex; gap: 12px; align-items: flex-start;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; overflow: hidden; flex-shrink: 0;">
                                    ${window.App.state.profile?.avatar_url ? `<img src="${window.App.state.profile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : '👤'}
                                </div>
                                <div style="flex: 1;">
                                    <textarea id="feed-status-input" placeholder="Partager une astuce locale, un besoin de compétences, ou une actu..." rows="2" style="width: 100%; border: none; outline: none; resize: none; font-family: inherit; font-size: 0.95rem; color: #0f172a; padding-top: 8px;"></textarea>
                                    
                                    <div style="display: flex; justify-content: flex-end; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 8px; align-items: center; gap: 12px;">
                                        <!-- File Attachment Button -->
                                        <button onclick="document.getElementById('post-file-input').click()" style="background: none; border: none; color: #64748b; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 8px; transition: background 0.2s;" title="Ajouter une photo ou vidéo">
                                            📸
                                        </button>
                                        <input type="file" id="post-file-input" style="display:none;" accept="image/*,video/*" onchange="MomentsModule.handlePostFileSelected(this)">
                                        <span id="post-file-name" style="font-size:0.75rem; color:#10b981; font-weight:700; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>

                                        <button onclick="MomentsModule.postStatus('${containerId}')" id="btn-publish-feed" style="background: #0f172a; color: white; border: none; padding: 8px 20px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: opacity 0.2s; margin-left: auto;">
                                            Publier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- FEED ITEMS -->
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${feedItems.length === 0 ? `
                            <div style="text-align: center; padding: 40px; color: #94a3b8; background: white; border: 1px solid #e2e8f0; border-radius: 20px;">
                                Aucun message dans le flux territorial pour le moment. Soyez le premier à publier !
                            </div>
                        ` : feedItems.map(item => this.renderFeedItemHTML(item, currentUser, containerId)).join('')}
                    </div>

                </div>
            `;

            container.innerHTML = html;

        } catch (err) {
            console.error("[MomentsModule] Load Error:", err);
            container.innerHTML = `
                <div style="padding: 24px; color: #ef4444; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 16px; font-weight: 700; text-align: center;">
                    Erreur de chargement du Flux : ${err.message}
                </div>
            `;
        }
    },

    renderFeedItemHTML: function(item, currentUser, containerId) {
        const isSelf = currentUser && currentUser.id === item.userId;
        const relativeTime = this.getRelativeTime(item.createdAt);

        // Badge styling based on role
        let roleBadge = '';
        if (item.authorRole === 'prestataire') {
            roleBadge = '<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 2px 8px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">Expert</span>';
        } else if (item.authorRole === 'entreprise') {
            roleBadge = '<span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 2px 8px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">Entreprise</span>';
        } else if (item.authorRole === 'porteur-projet') {
            roleBadge = '<span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 2px 8px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">Créateur</span>';
        } else {
            roleBadge = '<span style="background: rgba(100, 116, 139, 0.1); color: #64748b; padding: 2px 8px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">Citoyen</span>';
        }

        // Post card border color
        let cardBorder = 'border: 1px solid #e2e8f0;';
        if (item.type === 'project') {
            cardBorder = 'border: 1px solid rgba(245, 158, 11, 0.3); background: linear-gradient(180deg, rgba(245, 158, 11, 0.01), white);';
        } else if (item.type === 'service') {
            cardBorder = 'border: 1px solid rgba(16, 185, 129, 0.3); background: linear-gradient(180deg, rgba(16, 185, 129, 0.01), white);';
        }

        // Render Media if present
        let mediaHtml = '';
        if (item.imageUrl) {
            const isVideo = item.imageUrl.match(/\.(mp4|mov|avi|webm|quicktime)($|\?)/i);
            if (isVideo) {
                mediaHtml = `
                    <div style="margin-top: 10px; border-radius: 12px; overflow: hidden; background: black; max-height: 360px; display: flex; justify-content: center;">
                        <video src="${item.imageUrl}" controls style="max-height: 360px; max-width: 100%; object-fit: contain;"></video>
                    </div>
                `;
            } else {
                mediaHtml = `
                    <div style="margin-top: 10px; border-radius: 12px; overflow: hidden; max-height: 360px; display: flex; justify-content: center; background: #f8fafc;">
                        <img src="${item.imageUrl}" style="max-height: 360px; max-width: 100%; object-fit: cover; border-radius: 12px;" onclick="window.open('${item.imageUrl}', '_blank')">
                    </div>
                `;
            }
        }

        // Likes & Comments Count
        const postLikes = this.likes[item.id] || [];
        const likesCount = postLikes.length;
        const hasLiked = currentUser && postLikes.includes(currentUser.id);

        const postComments = this.comments[item.id] || [];
        const commentsCount = postComments.length;

        // Render Comments List
        const commentsListHtml = postComments.length === 0
            ? `<p style="font-size:0.8rem; color:#94a3b8; font-style:italic; margin:0; padding: 4px 0;">Aucun commentaire. Lancez la discussion !</p>`
            : postComments.map(c => {
                const cProfile = c.profiles || {};
                const initials = (cProfile.full_name || '👤').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                return `
                    <div style="display: flex; gap: 8px; align-items: flex-start; background: #f8fafc; padding: 8px 12px; border-radius: 12px; margin-bottom: 6px;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #0f172a; color: white; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                            ${cProfile.avatar_url ? `<img src="${cProfile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : initials}
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                <span style="font-weight: 800; font-size: 0.8rem; color: #0f172a;">${cProfile.full_name || 'Utilisateur'}</span>
                                <span style="font-size: 0.7rem; color: #94a3b8;">${this.getRelativeTime(new Date(c.created_at))}</span>
                            </div>
                            <p style="margin: 2px 0 0 0; font-size: 0.82rem; color: #334155; line-height: 1.4;">${c.content}</p>
                        </div>
                    </div>
                `;
            }).join('');

        return `
            <div style="background: white; ${cardBorder} border-radius: 20px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.01); display: flex; flex-direction: column; gap: 14px;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; overflow: hidden;">
                            ${item.authorAvatar ? `<img src="${item.authorAvatar}" style="width:100%; height:100%; object-fit:cover;">` : '👤'}
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <span style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">${item.authorName}</span>
                                ${roleBadge}
                            </div>
                            <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-top: 2px;">
                                ${item.authorTerritory} • ${relativeTime}
                            </div>
                        </div>
                    </div>
                    
                    ${item.meta ? `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 800; font-size: 0.75rem; padding: 6px 12px; border-radius: 100px;">
                            ${item.meta}
                        </div>
                    ` : ''}
                </div>

                <!-- CONTENT -->
                <div style="color: #334155; font-size: 0.92rem; line-height: 1.6; font-weight: 500; white-space: pre-line;">
                    ${item.type === 'service' ? `<div style="font-weight: 800; font-size: 1rem; color: #0f172a; margin-bottom: 6px;">💼 Service : ${item.title}</div>` : ''}
                    ${item.type === 'project' ? `<div style="font-weight: 800; font-size: 1rem; color: #0f172a; margin-bottom: 6px;">🚀 Projet : ${item.title}</div>` : ''}
                    ${item.content}
                </div>

                <!-- MEDIA -->
                ${mediaHtml}

                <!-- ACTIONS & ENGAGEMENT -->
                <div style="display: flex; gap: 16px; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 4px; flex-wrap: wrap; align-items: center;">
                    
                    <!-- LIKE -->
                    <button onclick="MomentsModule.toggleLike('${item.id}', '${containerId}')" style="background: none; border: none; color: ${hasLiked ? '#10b981' : '#64748b'}; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; transition: background 0.2s;">
                        <span>👍</span> ${likesCount} ${hasLiked ? 'Aimé' : 'Donner une force'}
                    </button>

                    <!-- COMMENTS TOGGLE -->
                    <button onclick="MomentsModule.toggleCommentsSection('${item.id}')" style="background: none; border: none; color: #64748b; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; transition: background 0.2s;">
                        <span>💬</span> ${commentsCount} Commentaires
                    </button>

                    <!-- DIRECT CHAT -->
                    ${!isSelf && currentUser ? `
                        <button onclick="window.location.hash = '#messages?with=${item.userId}'" style="background: none; border: none; color: #0f172a; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; transition: background 0.2s; margin-left: auto;">
                            <span>✉️</span> Discuter en direct
                        </button>
                    ` : ''}
                </div>

                <!-- COMMENTS PANEL -->
                <div id="comments-section-${item.id}" style="display: none; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 4px;">
                    <div id="comments-list-${item.id}" style="max-height: 240px; overflow-y: auto; margin-bottom: 12px;">
                        ${commentsListHtml}
                    </div>
                    ${currentUser ? `
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="text" id="comment-input-${item.id}" placeholder="Ajouter une réponse ou un commentaire..." style="flex: 1; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; font-size: 0.85rem; outline: none; font-family: inherit;">
                            <button onclick="MomentsModule.submitComment('${item.id}', '${containerId}')" style="background: #10b981; color: white; border: none; padding: 8px 14px; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer;">
                                Envoyer
                            </button>
                        </div>
                    ` : ''}
                </div>

            </div>
        `;
    },

    handlePostFileSelected: function(input) {
        const file = input.files[0];
        const label = document.getElementById('post-file-name');
        if (file) {
            this.pendingFile = file;
            if (label) label.textContent = file.name;
        } else {
            this.pendingFile = null;
            if (label) label.textContent = '';
        }
    },

    postStatus: async function(containerId) {
        const input = document.getElementById('feed-status-input');
        if (!input || (!input.value.trim() && !this.pendingFile)) return;

        const text = input.value.trim();
        const db = this.getDb();
        const session = window.App?.state?.session;
        const profile = window.App?.state?.profile;

        if (!session || !profile) return;

        const btnPublish = document.getElementById('btn-publish-feed');
        const originalBtnText = btnPublish ? btnPublish.textContent : 'Publier';

        try {
            if (btnPublish) {
                btnPublish.textContent = 'Téléversement...';
                btnPublish.disabled = true;
            }

            let fileUrl = null;
            if (this.pendingFile) {
                const fileExt = this.pendingFile.name.split('.').pop();
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
                const filePath = `feed/${fileName}`;

                const { error: uploadError } = await db.storage
                    .from('chat-media')
                    .upload(filePath, this.pendingFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = db.storage
                    .from('chat-media')
                    .getPublicUrl(filePath);
                
                fileUrl = publicUrl;
            }

            const { error } = await db.from('showcase_items').insert([{
                user_id: session.user.id,
                title: `Status: ${profile.full_name}`,
                description: text,
                image_url: fileUrl,
                price: 0,
                category: 'status',
                status: 'active'
            }]);

            if (error) throw error;

            input.value = '';
            this.pendingFile = null;
            const fileLabel = document.getElementById('post-file-name');
            if (fileLabel) fileLabel.textContent = '';

            // Refresh feed
            this.renderFeed(containerId);

        } catch (err) {
            console.error("[MomentsModule] Post Status Error:", err);
            alert("Erreur lors de la publication : " + err.message);
        } finally {
            if (btnPublish) {
                btnPublish.textContent = originalBtnText;
                btnPublish.disabled = false;
            }
        }
    },

    toggleLike: async function(postId, containerId) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) {
            alert("Vous devez être connecté pour aimer un post.");
            return;
        }

        const currentUserId = session.user.id;
        const postLikes = this.likes[postId] || [];
        const hasLiked = postLikes.includes(currentUserId);

        try {
            if (hasLiked) {
                const { error } = await db.from('feed_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', currentUserId);
                if (error) throw error;
            } else {
                const { error } = await db.from('feed_likes')
                    .insert([{ post_id: postId, user_id: currentUserId }]);
                if (error) throw error;
            }

            // Refresh feed locally
            this.renderFeed(containerId);
        } catch (err) {
            console.error("[MomentsModule] Like Error:", err);
        }
    },

    toggleCommentsSection: function(postId) {
        const el = document.getElementById(`comments-section-${postId}`);
        if (el) {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    },

    submitComment: async function(postId, containerId) {
        const input = document.getElementById(`comment-input-${postId}`);
        if (!input || !input.value.trim()) return;

        const text = input.value.trim();
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) return;

        try {
            const { error } = await db.from('feed_comments').insert([{
                post_id: postId,
                user_id: session.user.id,
                content: text
            }]);

            if (error) throw error;

            input.value = '';
            // Refresh feed
            this.renderFeed(containerId);
        } catch (err) {
            console.error("[MomentsModule] Comment Error:", err);
            alert("Erreur lors de l'envoi du commentaire : " + err.message);
        }
    },

    getRelativeTime: function(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.round(diffMs / 60000);
        const diffHrs = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMin < 1) return "À l'instant";
        if (diffMin < 60) return `Il y a ${diffMin} min`;
        if (diffHrs < 24) return `Il y a ${diffHrs} h`;
        if (diffDays < 7) return `Il y a ${diffDays} j`;
        
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    },

    applyFeedPrompt: function(type) {
        const input = document.getElementById('feed-status-input');
        if (!input) return;

        let text = '';
        switch (type) {
            case 'tip':
                text = "💡 Conseil du jour : [Partagez un conseil, un raccourci ou une info utile pour le territoire]...";
                break;
            case 'kudos':
                text = "❤️ Coup de cœur : Je recommande vivement [Nom de l'entreprise ou personne] pour [votre retour positif] ! 🌟";
                break;
            case 'photo':
                text = "📸 Humeur locale : [Racontez ce qui se passe ou décrivez une ambiance du territoire aujourd'hui] 🌴";
                break;
            default:
                text = "";
        }
        input.value = text;
        input.focus();
        
        // Select the placeholder text inside brackets
        const start = text.indexOf('[');
        const end = text.indexOf(']');
        if (start >= 0 && end >= 0) {
            input.setSelectionRange(start, end + 1);
        }
    }
};

window.MomentsModule = MomentsModule;
