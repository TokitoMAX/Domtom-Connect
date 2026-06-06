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
                Chargement de DTC...
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
                        meta: 'Nouveau Projet',
                        createdAt: new Date(item.created_at)
                    });
                });
            }

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

            // ALGORITHME DE VISIBILITÉ (Scoring system)
            const now = new Date();
            feedItems.forEach(item => {
                const itemLikes = this.likes[item.id] ? this.likes[item.id].length : 0;
                const itemComments = this.comments[item.id] ? this.comments[item.id].length : 0;
                
                // 1. Fraîcheur (Recency) : Score max 100, décroît avec le temps (environ -0.6 pt par heure)
                const hoursOld = (now - item.createdAt) / (1000 * 60 * 60);
                const recencyScore = Math.max(0, 100 - (hoursOld * 0.6)); 
                
                // 2. Engagement (Virality) : Likes valent 5 pts, Commentaires valent 10 pts
                const engagementScore = (itemLikes * 5) + (itemComments * 10);
                
                // 3. Autorité (Premium Boost) : Boost algorithmique pour VIPs et statuts Premium
                let authorityScore = 0;
                const role = (item.authorRole || '').toLowerCase();
                if (['club', 'premium', 'authority'].includes(role)) authorityScore += 20;
                else if (['expert', 'entreprise'].includes(role)) authorityScore += 10;
                
                // 4. Facteur de découverte (Randomizer) : Donne une chance au contenu de percer (0 à 15 pts)
                const discoveryBoost = Math.random() * 15;
                
                item.score = recencyScore + engagementScore + authorityScore + discoveryBoost;
            });

            // Tri descendant par score de l'algorithme
            feedItems.sort((a, b) => b.score - a.score);

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
                    .dtc-action-icon {
                        background: transparent;
                        border: none;
                        color: #64748b;
                        font-weight: 800;
                        font-size: 0.85rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        padding: 8px 12px;
                        border-radius: 12px;
                        transition: all 0.2s;
                    }
                    .dtc-action-icon:hover {
                        background: #f1f5f9;
                        color: #0f172a;
                    }
                    .dtc-action-icon.liked {
                        color: #ef4444 !important;
                    }
                    .dtc-action-icon.liked svg {
                        animation: dtcHeartBurst 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
                        fill: #ef4444;
                        stroke: #ef4444;
                    }
                    @keyframes dtcHeartBurst {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.35); }
                        100% { transform: scale(1); }
                    }
                    .dtc-post-card {
                        background: white; 
                        border-radius: 24px; 
                        padding: 24px; 
                        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01); 
                        display: flex; 
                        flex-direction: column; 
                        transition: transform 0.2s, box-shadow 0.2s;
                        overflow: hidden;
                    }
                    .dtc-post-card:hover {
                        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
                    }
                    .dtc-create-icon {
                        color: #64748b;
                        padding: 10px;
                        border-radius: 50%;
                        cursor: pointer;
                        transition: 0.2s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: none;
                        background: transparent;
                    }
                    .dtc-create-icon:hover {
                        background: #f1f5f9;
                        color: #0f172a;
                    }
                    .dtc-follow-btn {
                        background: transparent;
                        border: 1.5px solid #10b981;
                        color: #10b981;
                        padding: 4px 12px;
                        border-radius: 100px;
                        font-weight: 800;
                        font-size: 0.75rem;
                        cursor: pointer;
                        transition: 0.2s;
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                    }
                    .dtc-follow-btn:hover {
                        background: #10b981;
                        color: white;
                    }
                    .dtc-verified-badge {
                        color: #3b82f6;
                        display: inline-flex;
                        align-items: center;
                        margin-left: 4px;
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
                        <div style="background: white; border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px; padding: 20px; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04); margin-bottom: 32px;">
                            <div style="display: flex; gap: 16px; align-items: flex-start;">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; overflow: hidden; flex-shrink: 0; border: 2px solid rgba(0,0,0,0.05);">
                                    ${window.App.state.profile?.avatar_url ? `<img src="${window.App.state.profile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user"></i>'}
                                </div>
                                <div style="flex: 1;">
                                    <textarea id="feed-status-input" placeholder="Partager une actualité, lancer un appel à projet..." rows="2" style="width: 100%; border: none; outline: none; resize: none; font-family: inherit; font-size: 1.1rem; color: #0f172a; padding-top: 10px; line-height: 1.5; font-weight: 500; background: transparent;"></textarea>
                                    
                                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 8px; align-items: center; flex-wrap: wrap; gap: 12px;">
                                        <div style="display: flex; gap: 4px;">
                                            <button onclick="document.getElementById('post-file-input').click()" class="dtc-create-icon" title="Ajouter Média">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                            </button>
                                            <button onclick="MomentsModule.applyFeedPrompt('tip')" class="dtc-create-icon" title="Astuce">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                            </button>
                                            <button onclick="MomentsModule.applyFeedPrompt('kudos')" class="dtc-create-icon" title="Célébrer">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                            </button>
                                        </div>
                                        
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <input type="file" id="post-file-input" style="display:none;" accept="image/*,video/*" onchange="MomentsModule.handlePostFileSelected(this)">
                                            <span id="post-file-name" style="font-size:0.75rem; color:#10b981; font-weight:700; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
                                            <button onclick="MomentsModule.postStatus('${containerId}')" id="btn-publish-feed" class="dtc-publish-btn">
                                                Publier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
 
                    <!-- FEED ITEMS -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        ${feedItems.length === 0 ? `
                        ` : feedItems.map((item, index) => {
                            let htmlStr = this.renderFeedItemHTML(item, currentUser, containerId);
                            // Inject CTA Mastermind naturally in the feed (e.g. after the 2nd item)
                            if (index === 1) {
                                htmlStr += this.renderMastermindCTA();
                            }
                            return htmlStr;
                        }).join('')}
                    </div>
 
                </div>
            `;
 
            container.innerHTML = html;
 
        } catch (err) {
            console.error("[MomentsModule] Load Error:", err);
            container.innerHTML = `
                <div style="padding: 24px; color: #ef4444; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 16px; font-weight: 700; text-align: center;">
                    Erreur de chargement de DTC : ${err.message}
                </div>
            `;
        }
    },
 
    renderFeedItemHTML: function(item, currentUser, containerId) {
        const isSelf = currentUser && currentUser.id === item.userId;
        const relativeTime = this.getRelativeTime(item.createdAt);
        
        // Simulated views for social proof
        const simulatedViewsCount = Math.floor(Math.random() * (2500 - 150) + 150) + (item.score > 80 ? 4000 : 0);
        const viewsStr = (simulatedViewsCount > 1000) ? (simulatedViewsCount / 1000).toFixed(1) + 'k' : simulatedViewsCount;
  
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

        // Verified Badge Logic
        const isVerified = ['club', 'premium', 'authority', 'admin', 'expert'].includes((item.authorRole || '').toLowerCase());
        const verifiedSvg = isVerified ? `
            <svg class="dtc-verified-badge" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" title="Certifié DTC">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10" stroke="white" stroke-width="3"/>
            </svg>` : '';
        
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
 
        // Render Media if present (Edge to Edge)
        let mediaHtml = '';
        if (item.imageUrl) {
            const isVideo = item.imageUrl.match(/\.(mp4|mov|avi|webm|quicktime)($|\?)/i);
            if (isVideo) {
                mediaHtml = `
                    <div style="margin: 16px -24px 0 -24px; overflow: hidden; background: #000; max-height: 600px; display: flex; justify-content: center; border-bottom: 1px solid rgba(0,0,0,0.05); border-top: 1px solid rgba(0,0,0,0.05);">
                        <video src="${item.imageUrl}" controls style="max-height: 600px; width: 100%; object-fit: cover;"></video>
                    </div>
                `;
            } else {
                mediaHtml = `
                    <div style="margin: 16px -24px 0 -24px; overflow: hidden; max-height: 600px; display: flex; justify-content: center; background: #f8fafc; cursor: zoom-in; border-bottom: 1px solid rgba(0,0,0,0.05); border-top: 1px solid rgba(0,0,0,0.05);" onclick="window.open('${item.imageUrl}', '_blank')">
                        <img src="${item.imageUrl}" style="max-height: 600px; width: 100%; object-fit: cover; display: block;">
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
            ? `<p style="font-size:0.85rem; color:#94a3b8; font-style:italic; margin:0; padding: 8px 0; text-align:center;">Soyez le premier à réagir !</p>`
            : postComments.map(c => {
                const cProfile = c.profiles || {};
                const initials = (cProfile.full_name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                return `
                    <div style="display: flex; gap: 12px; align-items: flex-start; background: transparent; padding: 8px 0; margin-bottom: 8px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; color: #0f172a; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.05);">
                            ${cProfile.avatar_url ? `<img src="${cProfile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : initials}
                        </div>
                        <div style="flex: 1; background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                                <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${cProfile.full_name || 'Utilisateur'}</span>
                                <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">${this.getRelativeTime(new Date(c.created_at))}</span>
                            </div>
                            <p style="margin: 0; font-size: 0.9rem; color: #334155; line-height: 1.45; font-weight: 500;">${c.content}</p>
                        </div>
                    </div>
                `;
            }).join('');

        const formattedContent = (item.content || '').replace(/#(\w+)/g, '<span style="color: #3b82f6; font-weight: 800; cursor: pointer;">#$1</span>');
 
        return `
            <div class="dtc-post-card" style="${cardBorder}">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div style="display: flex; gap: 14px; align-items: center;">
                        <div onclick="window.location.href='${profileUrl}'" style="width: 48px; height: 48px; border-radius: 50%; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; overflow: hidden; border: 2px solid rgba(0,0,0,0.05); flex-shrink:0; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';">
                            ${item.authorAvatar ? `<img src="${item.authorAvatar}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                <span onclick="window.location.href='${profileUrl}'" style="font-weight: 800; font-size: 1.05rem; color: #0f172a; letter-spacing:-0.01em; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#10b981';" onmouseout="this.style.color='#0f172a';">${item.authorName}</span>
                                ${verifiedSvg}
                                ${!isSelf ? `
                                    <span style="color:#cbd5e1; margin: 0 4px;">•</span>
                                    <button class="dtc-follow-btn" onclick="alert('Vous suivez maintenant ${item.authorName} !')">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        Suivre
                                    </button>
                                ` : ''}
                            </div>
                            <div style="font-size: 0.8rem; color: #64748b; font-weight: 500; margin-top: 2px;">
                                ${roleBadge} <span style="margin:0 4px;">•</span> ${relativeTime}
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${item.meta ? `
                            <div style="background: rgba(59, 130, 246, 0.04); border: 1px solid rgba(59, 130, 246, 0.25); color: #2563eb; font-weight: 800; font-size: 0.78rem; padding: 6px 14px; border-radius: 100px; letter-spacing: -0.01em;">
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
                <div style="color: #0f172a; font-size: 1.05rem; line-height: 1.6; font-weight: 500; white-space: pre-line; letter-spacing: -0.01em;">
                    ${item.type === 'project' ? `
                        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #fffdf5; border-radius: 16px; border: 1px solid rgba(245,158,11,0.2); margin-bottom: 12px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #f59e0b; flex-shrink: 0;"><polygon points="12 2 2 22 22 22"/></svg>
                            <div>
                                <div style="font-size: 0.7rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em;">Nouveau Projet</div>
                                <div style="font-size: 0.95rem; font-weight: 850; color: #0f172a;">${item.title}</div>
                            </div>
                        </div>
                    ` : ''}
                    ${formattedContent}
                </div>
 
                <!-- MEDIA -->
                ${mediaHtml}
 
                <!-- VIEWS COUNT (SOCIAL PROOF) -->
                <div style="font-size: 0.8rem; color: #94a3b8; font-weight: 600; padding: 12px 0 0 0; display: flex; align-items: center; gap: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ${viewsStr} vues
                </div>

                <!-- ACTIONS & ENGAGEMENT -->
                <div style="display: flex; gap: 4px; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 12px; align-items: center; justify-content: space-between;">
                    
                    <div style="display: flex; gap: 4px;">
                        <!-- LIKE -->
                        <button onclick="MomentsModule.toggleLike('${item.id}', '${containerId}')" class="dtc-action-icon ${hasLiked ? 'liked' : ''}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="${hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            ${likesCount > 0 ? likesCount : 'J\'aime'}
                        </button>
    
                        <!-- COMMENTS TOGGLE -->
                        <button onclick="MomentsModule.toggleCommentsSection('${item.id}')" class="dtc-action-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                            ${commentsCount > 0 ? commentsCount : 'Commenter'}
                        </button>
    
                        <!-- SHARE -->
                        <button onclick="navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#moments?post=${item.id}'); alert('Lien copié !')" class="dtc-action-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg>
                            Partager
                        </button>
                    </div>

                    <!-- SAVE -->
                    <button class="dtc-action-icon" title="Sauvegarder" onclick="alert('Publication enregistrée dans vos favoris !')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    </button>
                </div>
 
                <!-- COMMENTS PANEL -->
                <div id="comments-section-${item.id}" style="display: none; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 6px;">
                    <div id="comments-list-${item.id}" style="max-height: 280px; overflow-y: auto; margin-bottom: 16px; padding-right: 4px;">
                        ${commentsListHtml}
                    </div>
                    ${currentUser ? `
                        <div style="display: flex; gap: 12px; align-items: flex-start;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; margin-top: 4px;">
                                ${window.App.state.profile?.avatar_url ? `<img src="${window.App.state.profile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user"></i>'}
                            </div>
                            <div style="flex: 1; display: flex; gap: 8px; align-items: center;">
                                <input type="text" id="comment-input-${item.id}" placeholder="Ajouter un commentaire..." style="flex: 1; border: 1px solid #e2e8f0; border-radius: 20px; padding: 12px 16px; font-size: 0.9rem; outline: none; font-family: inherit; font-weight: 500; transition: border-color 0.2s; background: #f8fafc;" onfocus="this.style.borderColor='#10b981'; this.style.background='white';" onblur="this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc';">
                                <button onclick="MomentsModule.submitComment('${item.id}', '${containerId}')" class="dtc-comment-submit-btn" style="border-radius: 20px; padding: 12px 20px;">
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderMastermindCTA: function() {
        return `
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: 32px; color: white; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.2); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); margin: 8px 0;">
                <div style="position: absolute; top: -20px; right: -20px; font-size: 8rem; opacity: 0.03; color: white; pointer-events: none;"><i class="fas fa-crown"></i></div>
                <div style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 20px;">
                    <i class="fas fa-crown"></i>
                </div>
                <h3 style="font-size: 1.4rem; font-weight: 900; margin: 0 0 12px 0; letter-spacing: -0.02em;">Passez au niveau supérieur</h3>
                <p style="color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.5; margin: 0 0 24px 0; max-width: 90%;">
                    Rejoignez le <strong style="color:white;">Club Mastermind</strong> pour accéder au salon privé, aux sessions de co-développement et développer votre réseau d'affaires premium en Outre-Mer.
                </p>
                <button onclick="window.Router.navigate('#mastermind')" style="background: #10b981; color: white; border: none; padding: 12px 28px; border-radius: 14px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);">
                    Découvrir le Club Mastermind
                </button>
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
                text = "Conseil du jour : [Partagez un conseil, un raccourci ou une info utile pour le territoire]...";
                break;
            case 'kudos':
                text = "Coup de cœur : Je recommande vivement [Nom de l'entreprise ou personne] pour [votre retour positif] !";
                break;
            case 'photo':
                text = "Humeur locale : [Racontez ce qui se passe ou décrivez une ambiance du territoire aujourd'hui]";
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
