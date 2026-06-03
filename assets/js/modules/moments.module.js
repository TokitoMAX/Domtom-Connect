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

            // 1. Fetch social status posts only (not real services from the showcase)
            const { data: rawShowcase, error: errShowcase } = await db
                .from('showcase_items')
                .select('*, profiles:user_id(full_name, avatar_url, role, territory, title, company_name)')
                .eq('category', 'status')
                .order('created_at', { ascending: false })
                .limit(40);

            if (errShowcase) throw errShowcase;

            // 2. Fetch Projects
            const { data: rawProjects, error: errProjects } = await db
                .from('projects')
                .select('*, profiles:owner_id(full_name, avatar_url, role, territory, title, company_name)')
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
                        authorTitle: profile.title || '',
                        authorExpertise: profile.expertise || '',
                        authorCompanyName: profile.company_name || '',
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
                        authorTitle: profile.title || '',
                        authorExpertise: profile.expertise || '',
                        authorCompanyName: profile.company_name || '',
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
                <style>
                    /* Premium Social Feed Custom Classes */
                    .dtc-publish-btn {
                        background: #0f172a;
                        color: white;
                        border: none;
                        padding: 10px 24px;
                        border-radius: 12px;
                        font-weight: 800;
                        font-size: 0.88rem;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
                    }
                    .dtc-publish-btn:hover {
                        background: #10b981;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                    }
                    .dtc-like-btn {
                        background: transparent;
                        border: none;
                        color: #64748b;
                        font-weight: 800;
                        font-size: 0.82rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 16px;
                        border-radius: 12px;
                        transition: all 0.2s;
                    }
                    .dtc-like-btn:hover {
                        background: rgba(16, 185, 129, 0.08);
                        color: #10b981;
                    }
                    .dtc-like-btn.liked {
                        background: rgba(16, 185, 129, 0.08);
                        color: #10b981;
                    }
                    .dtc-like-btn.liked:hover {
                        background: rgba(16, 185, 129, 0.12);
                    }
                    .dtc-comment-toggle-btn {
                        background: transparent;
                        border: none;
                        color: #64748b;
                        font-weight: 800;
                        font-size: 0.82rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 16px;
                        border-radius: 12px;
                        transition: all 0.2s;
                    }
                    .dtc-comment-toggle-btn:hover {
                        background: #f1f5f9;
                        color: #0f172a;
                    }
                    .dtc-chat-btn {
                        background: transparent;
                        border: none;
                        color: #0f172a;
                        font-weight: 800;
                        font-size: 0.82rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 16px;
                        border-radius: 12px;
                        transition: all 0.2s;
                    }
                    .dtc-chat-btn:hover {
                        background: #f8fafc;
                    }
                    .dtc-comment-submit-btn {
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 12px;
                        font-weight: 800;
                        font-size: 0.85rem;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
                    }
                    .dtc-comment-submit-btn:hover {
                        background: #059669;
                    }
                    .dtc-delete-post-btn {
                        background: transparent;
                        border: none;
                        color: #cbd5e1;
                        cursor: pointer;
                        padding: 6px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    }
                    .dtc-delete-post-btn:hover {
                        background: #fef2f2;
                        color: #ef4444;
                    }
                </style>
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; gap: 24px;">
                    
                    <!-- QUICK SHARE BAR -->
                    ${currentUser ? `
                        <div style="background: white; border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);">
                            <div style="display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap;">
                                <button onclick="MomentsModule.applyFeedPrompt('tip')" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18h6m-3-15a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-2.26C7.19 13.47 6 11.38 6 9a7 7 0 0 1 7-7z"/></svg>
                                    Astuce
                                </button>
                                <button onclick="MomentsModule.applyFeedPrompt('kudos')" style="background: #fff5f5; color: #e11d48; border: 1px solid rgba(225, 29, 72, 0.15); padding: 8px 16px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                    Recommandation
                                </button>
                                <button onclick="MomentsModule.applyFeedPrompt('photo')" style="background: #f0fdf4; color: #16a34a; border: 1px solid rgba(22, 163, 74, 0.15); padding: 8px 16px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                    Photo / Vidéo
                                </button>
                                <button onclick="MomentsModule.applyFeedPrompt('clear')" style="background: #f8fafc; color: #94a3b8; border: 1px dashed #cbd5e1; padding: 8px 16px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    Effacer
                                </button>
                            </div>
                            <div style="display: flex; gap: 16px; align-items: flex-start;">
                                <div style="width: 44px; height: 44px; border-radius: 12px; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; overflow: hidden; flex-shrink: 0; border: 1.5px solid rgba(0,0,0,0.05);">
                                    ${window.App.state.profile?.avatar_url ? `<img src="${window.App.state.profile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : '👤'}
                                </div>
                                <div style="flex: 1;">
                                    <textarea id="feed-status-input" placeholder="Partager une astuce locale, un besoin de compétences, ou une actu..." rows="2" style="width: 100%; border: none; outline: none; resize: none; font-family: inherit; font-size: 0.98rem; color: #0f172a; padding-top: 8px; line-height: 1.5; font-weight: 500;"></textarea>
                                    
                                    <div style="display: flex; justify-content: flex-end; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 12px; align-items: center; gap: 16px;">
                                        <!-- File Attachment Button -->
                                        <button onclick="document.getElementById('post-file-input').click()" style="background: none; border: none; color: #64748b; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 8px; border-radius: 10px; transition: background 0.2s;" title="Ajouter une photo ou vidéo">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748b;"><path d="M21 21H3V3h18v18zM21 16l-5-5-5 5M12 11l-3-3-4 4"/></svg>
                                        </button>
                                        <input type="file" id="post-file-input" style="display:none;" accept="image/*,video/*" onchange="MomentsModule.handlePostFileSelected(this)">
                                        <span id="post-file-name" style="font-size:0.75rem; color:#10b981; font-weight:700; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
 
                                        <button onclick="MomentsModule.postStatus('${containerId}')" id="btn-publish-feed" class="dtc-publish-btn">
                                            Publier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
 
                    <!-- FEED ITEMS -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        ${feedItems.length === 0 ? `
                            <div style="text-align: center; padding: 60px 40px; color: #94a3b8; background: white; border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px; font-weight: 700; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.02);">
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
 
        // Profile Details Link URL — sécurisé via adjustPath pour éviter les 404 en local / sous-dossier
        const baseCompanyPath = 'marketplace/profile-detail-company.html?id=' + item.userId;
        const baseExpertPath = 'marketplace/profile-detail-expert.html?id=' + item.userId;
        
        let profileUrl = item.authorRole === 'entreprise' ? baseCompanyPath : baseExpertPath;
        if (window.UIComponents && typeof window.UIComponents.adjustPath === 'function') {
            const prefix = window.UIComponents.getPathPrefix();
            profileUrl = window.UIComponents.adjustPath(profileUrl, prefix);
        } else {
            profileUrl = './' + profileUrl;
        }
 
        // Badge styling based on role and custom title/expertise
        let roleBadge = '';
        const authorTitle = item.authorTitle || item.authorExpertise || '';
        
        if (item.authorRole === 'prestataire' || item.authorRole === 'expert') {
            roleBadge = `<span style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.2); color: #059669; padding: 2px 10px; border-radius: 100px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${authorTitle || 'Expert'}</span>`;
        } else if (item.authorRole === 'entreprise') {
            roleBadge = `<span style="background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.2); color: #2563eb; padding: 2px 10px; border-radius: 100px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${item.authorCompanyName || authorTitle || 'Entreprise'}</span>`;
        } else if (item.authorRole === 'porteur-projet') {
            roleBadge = `<span style="background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.2); color: #d97706; padding: 2px 10px; border-radius: 100px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${authorTitle || 'Créateur'}</span>`;
        } else {
            if (authorTitle) {
                roleBadge = `<span style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.2); color: #059669; padding: 2px 10px; border-radius: 100px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${authorTitle}</span>`;
            } else {
                roleBadge = '<span style="background: rgba(100, 116, 139, 0.06); border: 1px solid rgba(100, 116, 139, 0.2); color: #475569; padding: 2px 10px; border-radius: 100px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">Citoyen</span>';
            }
        }
 
        // Post card border color
        let cardBorder = 'border: 1px solid rgba(0, 0, 0, 0.05);';
        if (item.type === 'project') {
            cardBorder = 'border: 1px solid rgba(245, 158, 11, 0.25); background: linear-gradient(180deg, rgba(245, 158, 11, 0.005) 0%, white 100%);';
        } else if (item.type === 'service') {
            cardBorder = 'border: 1px solid rgba(16, 185, 129, 0.25); background: linear-gradient(180deg, rgba(16, 185, 129, 0.005) 0%, white 100%);';
        }
 
        // Render Media if present
        let mediaHtml = '';
        if (item.imageUrl) {
            const isVideo = item.imageUrl.match(/\.(mp4|mov|avi|webm|quicktime)($|\?)/i);
            if (isVideo) {
                mediaHtml = `
                    <div style="margin-top: 14px; border-radius: 16px; overflow: hidden; background: #000; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 8px 30px -5px rgba(0,0,0,0.08); max-height: 480px; display: flex; justify-content: center;">
                        <video src="${item.imageUrl}" controls style="max-height: 480px; max-width: 100%; object-fit: contain;"></video>
                    </div>
                `;
            } else {
                mediaHtml = `
                    <div style="margin-top: 14px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 8px 30px -5px rgba(0,0,0,0.08); max-height: 480px; display: flex; justify-content: center; background: #f8fafc; cursor: zoom-in;" onclick="window.open('${item.imageUrl}', '_blank')">
                        <img src="${item.imageUrl}" style="max-height: 480px; max-width: 100%; object-fit: contain;">
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
            ? `<p style="font-size:0.85rem; color:#94a3b8; font-style:italic; margin:0; padding: 8px 0; text-align:center;">Aucune réponse pour le moment.</p>`
            : postComments.map(c => {
                const cProfile = c.profiles || {};
                const initials = (cProfile.full_name || '👤').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                return `
                    <div style="display: flex; gap: 12px; align-items: flex-start; background: #f8fafc; padding: 12px 16px; border-radius: 16px; margin-bottom: 8px; border: 1px solid rgba(0,0,0,0.02);">
                        <div style="width: 28px; height: 28px; border-radius: 8px; background: #0f172a; color: white; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.05);">
                            ${cProfile.avatar_url ? `<img src="${cProfile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : initials}
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                                <span style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${cProfile.full_name || 'Utilisateur'}</span>
                                <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">${this.getRelativeTime(new Date(c.created_at))}</span>
                            </div>
                            <p style="margin: 0; font-size: 0.88rem; color: #334155; line-height: 1.45; font-weight: 500;">${c.content}</p>
                        </div>
                    </div>
                `;
            }).join('');
 
        return `
            <div style="background: white; ${cardBorder} border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01); display: flex; flex-direction: column; gap: 16px;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; gap: 14px; align-items: center;">
                        <div onclick="window.location.href='${profileUrl}'" style="width: 44px; height: 44px; border-radius: 12px; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; overflow: hidden; border: 1.5px solid rgba(0,0,0,0.05); flex-shrink:0; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';">
                            ${item.authorAvatar ? `<img src="${item.authorAvatar}" style="width:100%; height:100%; object-fit:cover;">` : '👤'}
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <span onclick="window.location.href='${profileUrl}'" style="font-weight: 800; font-size: 0.98rem; color: #0f172a; letter-spacing:-0.01em; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#10b981';" onmouseout="this.style.color='#0f172a';">${item.authorName}</span>
                                <span onclick="window.location.href='${profileUrl}'" style="cursor: pointer; display: inline-flex;">${roleBadge}</span>
                            </div>
                            <div style="font-size: 0.78rem; color: #64748b; font-weight: 600; margin-top: 2px;">
                                ${item.authorTerritory} • ${relativeTime}
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${item.meta ? `
                            <div style="background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.25); color: #059669; font-weight: 800; font-size: 0.78rem; padding: 6px 14px; border-radius: 100px; letter-spacing: -0.01em;">
                                ${item.meta}
                            </div>
                        ` : ''}
                        
                        <!-- DELETE BUTTON FOR OWNER -->
                        ${isSelf ? `
                            <button onclick="MomentsModule.deletePost('${item.id}', '${item.type}', '${containerId}')" class="dtc-delete-post-btn" title="Supprimer la publication">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                        ` : ''}
                    </div>
                </div>
 
                <!-- CONTENT -->
                <div style="color: #334155; font-size: 0.96rem; line-height: 1.6; font-weight: 500; white-space: pre-line; letter-spacing: -0.01em;">
                    ${item.type === 'project' ? `
                        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #fffdf5; border-radius: 16px; border: 1px solid rgba(245,158,11,0.2); margin-bottom: 12px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #f59e0b; flex-shrink: 0;"><polygon points="12 2 2 22 22 22"/></svg>
                            <div>
                                <div style="font-size: 0.7rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em;">Nouveau Projet</div>
                                <div style="font-size: 0.95rem; font-weight: 850; color: #0f172a;">${item.title}</div>
                            </div>
                        </div>
                    ` : ''}
                    ${item.content}
                </div>
 
                <!-- MEDIA -->
                ${mediaHtml}
 
                <!-- ACTIONS & ENGAGEMENT -->
                <div style="display: flex; gap: 8px; border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 6px; flex-wrap: wrap; align-items: center;">
                    
                    <!-- LIKE -->
                    <button onclick="MomentsModule.toggleLike('${item.id}', '${containerId}')" class="dtc-like-btn ${hasLiked ? 'liked' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        <span>${likesCount}</span> ${hasLiked ? 'Aimé' : 'Like'}
                    </button>
 
                    <!-- COMMENTS TOGGLE -->
                    <button onclick="MomentsModule.toggleCommentsSection('${item.id}')" class="dtc-comment-toggle-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>${commentsCount}</span> Commenter
                    </button>
 
                    <!-- DIRECT CHAT -->
                    ${!isSelf && currentUser ? `
                        <button onclick="window.location.hash = '#messages?with=${item.userId}'" class="dtc-chat-btn" style="margin-left: auto;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            Discuter en direct
                        </button>
                    ` : ''}
                </div>
 
                <!-- COMMENTS PANEL -->
                <div id="comments-section-${item.id}" style="display: none; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 6px;">
                    <div id="comments-list-${item.id}" style="max-height: 280px; overflow-y: auto; margin-bottom: 16px; padding-right: 4px;">
                        ${commentsListHtml}
                    </div>
                    ${currentUser ? `
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <input type="text" id="comment-input-${item.id}" placeholder="Ajouter une réponse ou un commentaire..." style="flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; font-size: 0.88rem; outline: none; font-family: inherit; font-weight: 500; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981';" onblur="this.style.borderColor='#e2e8f0';">
                            <button onclick="MomentsModule.submitComment('${item.id}', '${containerId}')" class="dtc-comment-submit-btn">
                                Envoyer
                            </button>
                        </div>
                    ` : ''}
                </div>
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

    deletePost: async function(itemId, type, containerId) {
        if (!confirm("Voulez-vous vraiment supprimer cette publication ?")) return;

        try {
            const db = this.getDb();
            const table = type === 'project' ? 'projects' : 'showcase_items';
            
            const { error } = await db
                .from(table)
                .delete()
                .eq('id', itemId);

            if (error) throw error;

            // Refresh feed
            this.renderFeed(containerId);
        } catch (err) {
            console.error("[MomentsModule] Delete Post Error:", err);
            alert("Erreur lors de la suppression de la publication : " + err.message);
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
