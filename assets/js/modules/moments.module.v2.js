/**
 * MomentsModule - Domtom Connect
 * WeChat Moments & X/Twitter-style local social feed module.
 * Support for text updates, photo/video attachments, likes and comments.
 */
const MomentsModule = {
    likes: {},
    reactions: {},
    comments: {},
    polls: {},
    pollVotes: {},
    bookmarks: [],
    pendingFile: null,
    searchTimeout: null,
    currentFeedMode: 'all', // 'all', 'following' or 'reels'
    currentHashtagFilter: null,
    REACTION_EMOJI: { heart: '❤️', fire: '🔥', idea: '💡', clap: '👏' },

    // Pagination state
    _feedCache: [],
    _feedPage: 0,
    _feedPageSize: 10,
    _feedContainerId: null,
    _feedCurrentUser: null,
    _allFeedLoaded: false,
    _feedObserver: null,

    isVideoPost: function (item) {
        if (!item?.imageUrl) return false;
        const url = item.imageUrl.split(',')[0].trim();
        return /\.(mp4|mov|avi|webm|quicktime)($|\?)/i.test(url);
    },

    getVideoUrl: function (item) {
        if (!item?.imageUrl) return null;
        return item.imageUrl.split(',')[0].trim();
    },

    searchUsers: async function (query) {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(async () => {
            const resultsContainer = document.getElementById('dtc-search-results');
            if (!resultsContainer) return;

            if (!query || query.trim().length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }

            try {
                const db = this.getDb();
                const querySafe = query.replace(/,/g, '').trim();
                const { data, error } = await db.from('profiles')
                    .select('id, full_name, channel_name, avatar_url, channel_avatar_url, role')
                    .or(`full_name.ilike.%${querySafe}%,channel_name.ilike.%${querySafe}%`)
                    .limit(5);

                if (error) throw error;

                if (!data || data.length === 0) {
                    resultsContainer.innerHTML = `<div style="text-align:center; color:#94a3b8; font-size:0.85rem; padding: 10px; font-weight:600;">Aucun utilisateur trouvé pour "${query}"</div>`;
                    resultsContainer.style.display = 'flex';
                    return;
                }

                resultsContainer.innerHTML = data.map(user => {
                    const name = user.channel_name || user.full_name || 'Utilisateur';
                    const avatar = user.channel_avatar_url || user.avatar_url;
                    const role = user.role || 'Citoyen';
                    return `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; border-radius: 12px; background: #f8fafc;">
                            <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" onclick="window.Router.navigate('#channel?id=${user.id}')">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    ${avatar ? `<img src="${avatar}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user" style="color:white; font-size: 0.8rem;"></i>'}
                                </div>
                                <div style="min-width: 0;">
                                    <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</div>
                                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: capitalize;">${role}</div>
                                </div>
                            </div>
                            <button onclick="window.Router.navigate('#channel?id=${user.id}')" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: none; padding: 6px 12px; border-radius: 100px; font-weight: 800; font-size: 0.75rem; cursor: pointer; transition: background 0.2s; white-space: nowrap;">
                                Voir Chaîne
                            </button>
                        </div>
                    `;
                }).join('');
                resultsContainer.style.display = 'flex';

            } catch (err) {
                console.error("Search error:", err);
                resultsContainer.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:0.85rem; padding: 10px; font-weight:600;">Erreur de recherche: ${err.message}</div>`;
                resultsContainer.style.display = 'flex';
            }
        }, 300); // 300ms debounce
    },

    getDb: function () {
        return window._supabase;
    },

    /** Charge likes, commentaires, sondages et favoris pour une liste de posts */
    loadEngagementForPosts: async function (postIds, currentUser) {
        this.likes = {};
        this.reactions = {};
        this.comments = {};
        this.polls = {};
        this.pollVotes = {};
        this.bookmarks = [];

        if (!postIds || postIds.length === 0) return;

        const db = this.getDb();
        try {
            const { data: rawLikes } = await db.from('feed_likes').select('*').in('post_id', postIds);
            if (rawLikes) {
                rawLikes.forEach(l => {
                    if (!this.likes[l.post_id]) this.likes[l.post_id] = [];
                    this.likes[l.post_id].push(l.user_id);
                    if (!this.reactions[l.post_id]) this.reactions[l.post_id] = [];
                    this.reactions[l.post_id].push({ user_id: l.user_id, type: l.reaction_type || 'heart' });
                });
            }

            const { data: rawComments } = await db.from('feed_comments')
                .select('*, profiles:user_id(full_name, avatar_url)')
                .in('post_id', postIds)
                .order('created_at', { ascending: true });
            if (rawComments) {
                rawComments.forEach(c => {
                    if (!this.comments[c.post_id]) this.comments[c.post_id] = [];
                    this.comments[c.post_id].push(c);
                });
            }

            const { data: rawPolls } = await db.from('feed_polls').select('*').in('post_id', postIds);
            if (rawPolls && rawPolls.length > 0) {
                const pollIds = rawPolls.map(p => p.id);
                rawPolls.forEach(p => {
                    this.polls[p.post_id] = p;
                    this.pollVotes[p.id] = [];
                });
                const { data: rawVotes } = await db.from('feed_poll_votes').select('*').in('poll_id', pollIds);
                if (rawVotes) {
                    rawVotes.forEach(v => this.pollVotes[v.poll_id].push(v));
                }
            }
        } catch (errEngage) {
            console.warn("Engagement tables not active yet:", errEngage.message);
        }

        if (currentUser) {
            try {
                const { data: rawBookmarks } = await db.from('feed_bookmarks').select('post_id').eq('user_id', currentUser.id);
                if (rawBookmarks) this.bookmarks = rawBookmarks.map(b => b.post_id);
            } catch (e) {
                console.warn("Bookmarks table not ready:", e.message);
            }
        }
    },

    groupStoriesByUser: function (stories) {
        const groups = [];
        const seen = new Map();
        stories.forEach(s => {
            if (!seen.has(s.userId)) {
                const group = { userId: s.userId, authorName: s.authorName, authorAvatar: s.authorAvatar, items: [] };
                seen.set(s.userId, group);
                groups.push(group);
            }
            seen.get(s.userId).items.push(s);
        });
        return groups;
    },

    renderComposerBar: function (containerId) {
        const profile = window.App?.state?.profile;
        const session = window.App?.state?.session;
        if (!session || !profile) return '';

        const avatar = profile.channel_avatar_url || profile.avatar_url;
        const name = profile.channel_name || profile.full_name || 'U';

        return `
            <input type="file" id="post-file-input" style="display: none;" accept="image/*,video/*,application/pdf" multiple onchange="MomentsModule.handlePostFileSelected(this)">
            <input type="file" id="post-story-input" style="display: none;" accept="image/*,video/*" onchange="MomentsModule.handleStoryFileSelected(this)">
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: clamp(16px, 4vw, 24px); padding: clamp(16px, 4vw, 24px); box-shadow: 0 10px 40px rgba(0,0,0,0.03); margin-bottom: 16px; position: relative;">
                <div style="display: flex; gap: 12px; align-items: flex-start;">
                    <div style="width: 48px; height: 48px; border-radius: 16px; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; overflow: hidden; flex-shrink: 0; border: 2px solid #f8fafc;">
                        ${avatar ? `<img src="${avatar}" style="width:100%; height:100%; object-fit:cover;">` : name.charAt(0)}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <!-- Custom Selector -->
                        <div style="display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
                            <label style="cursor: pointer; flex-shrink: 0;">
                                <input type="radio" name="post_type" value="standard" checked style="display:none;" onchange="document.querySelectorAll('.post-type-btn').forEach(b => { b.style.background='#f1f5f9'; b.style.color='#64748b'; b.style.border='2px solid transparent'; }); this.nextElementSibling.style.background='rgba(16,185,129,0.1)'; this.nextElementSibling.style.color='#059669'; this.nextElementSibling.style.border='2px solid #10b981';">
                                <div class="post-type-btn" style="padding: 8px 16px; border-radius: 100px; background: rgba(16,185,129,0.1); color: #059669; font-weight: 800; font-size: 0.82rem; border: 2px solid #10b981; transition: 0.2s; white-space: nowrap;"><i class="fas fa-newspaper" style="margin-right:4px;"></i> Actualité</div>
                            </label>
                            <label style="cursor: pointer; flex-shrink: 0;">
                                <input type="radio" name="post_type" value="opportunite" style="display:none;" onchange="document.querySelectorAll('.post-type-btn').forEach(b => { b.style.background='#f1f5f9'; b.style.color='#64748b'; b.style.border='2px solid transparent'; }); this.nextElementSibling.style.background='rgba(59,130,246,0.1)'; this.nextElementSibling.style.color='#2563eb'; this.nextElementSibling.style.border='2px solid #3b82f6';">
                                <div class="post-type-btn" style="padding: 8px 16px; border-radius: 100px; background: #f1f5f9; color: #64748b; font-weight: 800; font-size: 0.82rem; border: 2px solid transparent; transition: 0.2s; white-space: nowrap;"><i class="fas fa-rocket" style="margin-right:4px;"></i> Opportunité</div>
                            </label>
                            <label style="cursor: pointer; flex-shrink: 0;">
                                <input type="radio" name="post_type" value="partenaire" style="display:none;" onchange="document.querySelectorAll('.post-type-btn').forEach(b => { b.style.background='#f1f5f9'; b.style.color='#64748b'; b.style.border='2px solid transparent'; }); this.nextElementSibling.style.background='rgba(139,92,246,0.1)'; this.nextElementSibling.style.color='#7c3aed'; this.nextElementSibling.style.border='2px solid #8b5cf6';">
                                <div class="post-type-btn" style="padding: 8px 16px; border-radius: 100px; background: #f1f5f9; color: #64748b; font-weight: 800; font-size: 0.82rem; border: 2px solid transparent; transition: 0.2s; white-space: nowrap;"><i class="fas fa-handshake" style="margin-right:4px;"></i> Partenariat</div>
                            </label>
                            <label style="cursor: pointer; flex-shrink: 0;">
                                <input type="radio" name="post_type" value="expertise" style="display:none;" onchange="document.querySelectorAll('.post-type-btn').forEach(b => { b.style.background='#f1f5f9'; b.style.color='#64748b'; b.style.border='2px solid transparent'; }); this.nextElementSibling.style.background='rgba(245,158,11,0.1)'; this.nextElementSibling.style.color='#d97706'; this.nextElementSibling.style.border='2px solid #f59e0b';">
                                <div class="post-type-btn" style="padding: 8px 16px; border-radius: 100px; background: #f1f5f9; color: #64748b; font-weight: 800; font-size: 0.82rem; border: 2px solid transparent; transition: 0.2s; white-space: nowrap;"><i class="fas fa-lightbulb" style="margin-right:4px;"></i> Expertise</div>
                            </label>
                        </div>
                        
                        <textarea id="feed-status-input" placeholder="Partagez une idée, une annonce ou une opportunité..." rows="2" style="width: 100%; border: none; outline: none; resize: none; font-family: inherit; font-size: 1.1rem; color: #0f172a; padding-top: 6px; line-height: 1.5; font-weight: 500; background: transparent;"></textarea>
                        
                        <div id="post-cta-container" style="display: none; margin-top: 12px; background: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px dashed #cbd5e1; align-items: center; gap: 8px;">
                            <span><i class="fas fa-link" style="color: #64748b;"></i></span>
                            <input type="url" id="post-cta-link" placeholder="Lien de redirection (ex: vers votre calendrier, site, article...)" style="width: 100%; border: none; outline: none; background: transparent; font-size: 0.9rem; font-weight: 600; font-family: inherit; color: #3b82f6;">
                            <button onclick="document.getElementById('post-cta-container').style.display='none'; document.getElementById('post-cta-link').value='';" style="background:transparent; border:none; color:#94a3b8; font-weight:800; cursor:pointer;">✕</button>
                        </div>

                        <div id="composer-previews" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;"></div>

                        <div style="display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; align-items: center;">
                            <button type="button" onclick="document.getElementById('post-file-input').click()" style="border:none; cursor:pointer; background: transparent; color: #64748b; border-radius: 12px; padding: 8px 12px; font-size: 0.85rem; font-weight: 800; transition:0.2s;" onmouseover="this.style.background='#f1f5f9'"><i class="fas fa-image" style="margin-right:4px;"></i> Média</button>
                            <button type="button" onclick="window.MomentsModule.openPollModal()" style="border:none; cursor:pointer; background: transparent; color: #64748b; border-radius: 12px; padding: 8px 12px; font-size: 0.85rem; font-weight: 800; transition:0.2s;" onmouseover="this.style.background='#f1f5f9'"><i class="fas fa-poll" style="margin-right:4px;"></i> Sondage</button>
                            <button type="button" onclick="document.getElementById('post-cta-container').style.display='flex'" style="border:none; cursor:pointer; background: transparent; color: #64748b; border-radius: 12px; padding: 8px 12px; font-size: 0.85rem; font-weight: 800; transition:0.2s;" onmouseover="this.style.background='#f1f5f9'"><i class="fas fa-link" style="margin-right:4px;"></i> Action CTA</button>
                            
                            <div style="flex: 1;"></div>
                            
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span id="post-file-name" style="font-size:0.8rem; color:#10b981; font-weight:700; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
                                <button type="button" onclick="window.MomentsModule.postStatus('${containerId}')" id="btn-publish-feed" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 10px 24px; border-radius: 100px; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 15px rgba(16,185,129,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Publier</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderReelsFeed: function (videoItems, currentUser, containerId) {
        if (!videoItems.length) {
            return `<div style="padding:48px; text-align:center; color:#64748b; font-weight:700; background:white; border-radius:24px;"><i class="fas fa-film" style="font-size:2.5rem; color:#cbd5e1; display:block; margin-bottom:12px;"></i>Aucune vidéo pour le moment.<br><span style="font-size:0.85rem; font-weight:500;">Publiez une vidéo pour alimenter le fil Reels.</span></div>`;
        }

        return `
            <div id="dtc-reels-scroller" style="height: min(85vh, 720px); overflow-y: scroll; scroll-snap-type: y mandatory; border-radius: 24px; background: #0f172a; scrollbar-width: none;">
                ${videoItems.map((item, idx) => {
            const videoUrl = this.getVideoUrl(item);
            const postReactions = this.reactions[item.id] || [];
            const likesCount = postReactions.length;
            const commentsCount = (this.comments[item.id] || []).length;
            const hasLiked = currentUser && postReactions.some(r => r.user_id === currentUser.id);
            return `
                    <div class="dtc-reel-slide" style="height: min(85vh, 720px); scroll-snap-align: start; position: relative; display: flex; align-items: center; justify-content: center; background: #000;">
                        <video src="${videoUrl}" autoplay muted loop playsinline style="max-width:100%; max-height:100%; object-fit: contain;" onclick="this.muted ? (this.muted=false) : (this.muted=true)"></video>
                        <div style="position:absolute; bottom:0; left:0; right:0; padding: 24px 80px 24px 20px; background: linear-gradient(transparent, rgba(0,0,0,0.85)); color: white;">
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; cursor:pointer;" onclick="window.Router.navigate('#channel?id=${item.userId}')">
                                <div style="width:36px; height:36px; border-radius:50%; overflow:hidden; border:2px solid white; background:#334155;">
                                    ${item.authorAvatar ? `<img src="${item.authorAvatar}" style="width:100%;height:100%;object-fit:cover;">` : ''}
                                </div>
                                <span style="font-weight:800; font-size:0.95rem;">${item.authorName}</span>
                            </div>
                            <p style="margin:0; font-size:0.9rem; line-height:1.4; opacity:0.95; max-height:60px; overflow:hidden;">${(item.content || '').substring(0, 120)}</p>
                        </div>
                        <div style="position:absolute; right: 12px; bottom: 100px; display:flex; flex-direction:column; gap:16px; align-items:center;">
                            <button onclick="MomentsModule.toggleLike('${item.id}', '${containerId}')" style="background:rgba(255,255,255,0.15); border:none; width:48px; height:48px; border-radius:50%; color:white; font-size:1.3rem; cursor:pointer; backdrop-filter:blur(4px);">${hasLiked ? '❤️' : '🤍'}<div style="font-size:0.65rem; font-weight:800; margin-top:2px;">${likesCount || ''}</div></button>
                            <button onclick="MomentsModule.openPostDetail('${item.id}', '${containerId}')" style="background:rgba(255,255,255,0.15); border:none; width:48px; height:48px; border-radius:50%; color:white; font-size:1.2rem; cursor:pointer;">💬<div style="font-size:0.65rem; font-weight:800; margin-top:2px;">${commentsCount || ''}</div></button>
                            <button onclick="MomentsModule.openReactionPicker('${item.id}', '${containerId}', event)" style="background:rgba(255,255,255,0.15); border:none; width:48px; height:48px; border-radius:50%; color:white; font-size:1.1rem; cursor:pointer;">😊</button>
                            ${currentUser && currentUser.id !== item.userId ? `<button onclick="window.Router.navigate('#messages?to=${item.userId}&context=post&prefill=${encodeURIComponent('Bonjour, à propos de votre vidéo : ')})" style="background:rgba(255,255,255,0.15); border:none; width:48px; height:48px; border-radius:50%; color:white; font-size:1.1rem; cursor:pointer;">✉️</button>` : ''}
                        </div>
                    </div>`;
        }).join('')}
            </div>
            <style>#dtc-reels-scroller::-webkit-scrollbar { display: none; }</style>
        `;
    },

    renderFeed: async function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Reset pagination state on fresh render
        this._feedPage = 0;
        this._allFeedLoaded = false;
        this._feedContainerId = containerId;
        if (this._feedObserver) { this._feedObserver.disconnect(); this._feedObserver = null; }

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
            this._feedCurrentUser = currentUser;

            // 1. Fetch social status posts and stories
            const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            let followedIds = [];
            let rawShowcase = [];
            if (this.currentFeedMode === 'following' && currentUser) {
                const { data: subs } = await db.from('user_subscriptions').select('following_id').eq('follower_id', currentUser.id);
                followedIds = (subs || []).map(s => s.following_id);
            }

            if (this.currentFeedMode === 'following' && followedIds.length === 0) {
                rawShowcase = [];
            } else if (this.currentFeedMode === 'saved' && (!this.bookmarks || this.bookmarks.length === 0)) {
                rawShowcase = [];
            } else {
                let showcaseQuery = db
                    .from('showcase_items')
                    .select('*, profiles:user_id(full_name, avatar_url, role, territory, title, company_name)')
                    .in('category', ['status', 'story'])
                    .order('created_at', { ascending: false })
                    .limit(120);

                if (this.currentFeedMode === 'following') {
                    showcaseQuery = showcaseQuery.in('user_id', followedIds);
                } else if (this.currentFeedMode === 'saved') {
                    showcaseQuery = showcaseQuery.in('id', this.bookmarks);
                }

                const { data: dataShowcase, error: errShowcase } = await showcaseQuery;
                if (errShowcase) throw errShowcase;
                rawShowcase = dataShowcase;
            }

            // 2. Fetch Projects
            const { data: rawProjects, error: errProjects } = await db
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(30);

            if (errProjects) {
                console.warn("Could not fetch projects for feed:", errProjects);
            }

            // 2.5 Fetch profiles for projects
            let projectProfiles = {};
            if (rawProjects && rawProjects.length > 0) {
                const ownerIds = [...new Set(rawProjects.map(p => p.owner_id).filter(Boolean))];
                if (ownerIds.length > 0) {
                    const { data: pProfiles } = await db
                        .from('profiles')
                        .select('id, full_name, avatar_url, role, territory, title, company_name')
                        .in('id', ownerIds);
                    if (pProfiles) {
                        pProfiles.forEach(p => {
                            projectProfiles[p.id] = p;
                        });
                    }
                }
            }

            // 3. Merge and Sort
            let feedItems = [];
            let stories = [];

            if (rawShowcase) {
                rawShowcase.forEach(item => {
                    const profile = item.profiles || {};
                    const parsedItem = {
                        id: item.id,
                        userId: item.user_id,
                        authorName: profile.full_name || 'Utilisateur DTC',
                        authorAvatar: profile.avatar_url,
                        authorRole: profile.role || 'prestataire',
                        authorTerritory: profile.territory || 'Outre-mer',
                        authorTitle: profile.title || '',
                        authorExpertise: profile.expertise || '',
                        authorCompanyName: profile.company_name || '',
                        type: item.item_type || (item.category === 'status' ? 'status' : item.category === 'story' ? 'story' : 'service'),
                        title: item.title,
                        content: item.description || '',
                        imageUrl: item.image_url || null,
                        meta: item.meta_info || (item.category !== 'status' && item.category !== 'story' ? `${item.price_prefix || 'À partir de'} ${item.price} €` : null),
                        createdAt: new Date(item.created_at)
                    };

                    if (item.category === 'story' && parsedItem.imageUrl) {
                        const storyAge = Date.now() - parsedItem.createdAt.getTime();
                        if (storyAge < 24 * 60 * 60 * 1000) stories.push(parsedItem);
                    } else if (item.category === 'status') {
                        feedItems.push(parsedItem);
                    }
                });
            }

            if (rawProjects && this.currentFeedMode !== 'following' && this.currentFeedMode !== 'saved') {
                rawProjects.forEach(item => {
                    const profile = projectProfiles[item.owner_id] || {};
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

            // 4. Score & sort all items
            const now = new Date();
            feedItems.forEach(item => {
                const itemLikes = this.likes[item.id] ? this.likes[item.id].length : 0;
                const itemComments = this.comments[item.id] ? this.comments[item.id].length : 0;
                const hoursOld = (now - item.createdAt) / (1000 * 60 * 60);
                const recencyScore = Math.max(0, 100 - (hoursOld * 0.6));
                const engagementScore = (itemLikes * 5) + (itemComments * 10);
                let authorityScore = 0;
                const role = (item.authorRole || '').toLowerCase();
                if (['club', 'premium', 'authority'].includes(role)) authorityScore += 20;
                else if (['expert', 'entreprise'].includes(role)) authorityScore += 10;
                const discoveryBoost = Math.random() * 15;
                let intentBoost = 0;
                if (item.title === 'opportunite' || item.title === 'partenaire' || item.title === 'expertise') intentBoost = 20;
                item.score = recencyScore + engagementScore + authorityScore + discoveryBoost + intentBoost;
            });
            feedItems.sort((a, b) => b.score - a.score);

            if (this.currentHashtagFilter) {
                const tag = this.currentHashtagFilter.toLowerCase();
                feedItems = feedItems.filter(item => (item.content || '').toLowerCase().includes('#' + tag));
            }

            // 5. Load engagement for first page only
            const firstPageIds = feedItems.slice(0, this._feedPageSize).map(i => i.id);
            await this.loadEngagementForPosts(firstPageIds, currentUser);

            // 6. Fetch subscriptions
            this.subscriptions = [];
            if (currentUser) {
                try {
                    const { data: rawSubs } = await db.from('user_subscriptions').select('following_id').eq('follower_id', currentUser.id);
                    if (rawSubs) this.subscriptions = rawSubs.map(s => s.following_id);
                } catch (e) { console.warn("Subscriptions table not ready:", e.message); }
            }

            // 7. Save stories & groups globally
            this.currentStories = stories;
            this.storyGroups = this.groupStoriesByUser(stories);

            // 8. Store sorted feed in cache for pagination
            this._feedCache = feedItems;
            this._feedPage = 0;
            this._allFeedLoaded = false;

            // 9. Build stories bar
            let storiesHtml = '';
            let myAvatar = '<i class="fas fa-user" style="color:#cbd5e1;"></i>';
            if (window.App?.state?.profile) {
                const p = window.App.state.profile;
                const url = p.channel_avatar_url || p.avatar_url;
                if (url) myAvatar = `<img src="${url}" style="width:100%; height:100%; border-radius: 50%; object-fit:cover; opacity: 0.7;">`;
            } else if (currentUser?.user_metadata?.avatar_url) {
                myAvatar = `<img src="${currentUser.user_metadata.avatar_url}" style="width:100%; height:100%; border-radius: 50%; object-fit:cover; opacity: 0.7;">`;
            }

            const addStoryBtn = `
                <div style="flex-shrink: 0; width: 70px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="document.getElementById('post-story-input').click()">
                    <div style="width: 64px; height: 64px; border-radius: 50%; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; position: relative;">
                        ${myAvatar}
                        <div style="position: absolute; bottom: 0; right: 0; width: 22px; height: 22px; background: #3b82f6; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; border: 2px solid white;"><i class="fas fa-plus"></i></div>
                    </div>
                    <span style="font-size: 0.7rem; font-weight: 600; color: #334155;">Ma Story</span>
                </div>
            `;

            if (this.storyGroups.length > 0) {
                const storyBubbles = this.storyGroups.map((group, idx) => `
                    <div style="flex-shrink: 0; width: 70px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="MomentsModule.openStoryViewer(${idx}, 0)">
                        <div style="width: 64px; height: 64px; border-radius: 50%; padding: 3px; background: linear-gradient(45deg, #f59e0b, #ef4444, #8b5cf6); display: flex; align-items: center; justify-content: center;">
                            <div style="width: 100%; height: 100%; border-radius: 50%; border: 2px solid white; overflow: hidden; background: #0f172a;">
                                ${group.authorAvatar ? `<img src="${group.authorAvatar}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user" style="color:white; margin-top: 18px;"></i>'}
                            </div>
                        </div>
                        <span style="font-size: 0.7rem; font-weight: 600; color: #334155; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${group.authorName.split(' ')[0]}</span>
                    </div>
                `).join('');
                storiesHtml = `
                    <div style="display: flex; gap: 12px; overflow-x: auto; padding: 16px 20px; background: white; margin-bottom: 12px; border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.05); scrollbar-width: none;">
                        ${addStoryBtn}${storyBubbles}
                    </div>
                    <style>.stories-container::-webkit-scrollbar { display: none; }</style>
                `;
            } else {
                storiesHtml = `<div style="display: flex; gap: 12px; padding: 16px 20px; background: white; margin-bottom: 12px; border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.05);">${addStoryBtn}</div>`;
            }

            // 10. Render first page of feed items
            const firstPageItems = feedItems.slice(0, this._feedPageSize);
            const firstPageHtml = this.currentFeedMode === 'reels'
                ? this.renderReelsFeed(feedItems.filter(item => this.isVideoPost(item)), currentUser, containerId)
                : `<div id="dtc-feed-list" style="display: flex; flex-direction: column; gap: 20px;">
                    ${firstPageItems.length === 0
                    ? (this.currentFeedMode === 'following'
                        ? `<div style="padding:40px; text-align:center; color:#64748b; font-weight:700; background:white; border-radius:24px;"><i class="fas fa-user-friends" style="font-size:2rem; color:#cbd5e1; display:block; margin-bottom:12px;"></i>Vous ne suivez personne ou vos abonnements n'ont rien publié.<br><span style="font-size:0.85rem; font-weight:500;">Abonnez-vous à des profils depuis le feed principal.</span></div>`
                        : `<div style="padding:40px; text-align:center; color:#94a3b8; font-weight:600;">Aucune publication pour le moment.</div>`)
                    : firstPageItems.map((item, index) => {
                        let htmlStr = this.renderFeedItemHTML(item, currentUser, containerId);
                        if (index === 1) htmlStr += this.renderMastermindCTA();
                        return htmlStr;
                    }).join('')
                }
                    <div id="dtc-feed-sentinel" style="height: 1px; margin-top: 8px;"></div>
                </div>`;

            this._feedPage = 1;

            // 11. Build complete UI
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
                    .dtc-follow-btn {
                        background: transparent;
                        border: 1px solid #cbd5e1;
                        color: #64748b;
                        padding: 4px 12px;
                        border-radius: 100px;
                        font-size: 0.75rem;
                        font-weight: 800;
                        cursor: pointer;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                    }
                    .dtc-follow-btn:hover {
                        background: #f8fafc;
                        border-color: #94a3b8;
                        color: #0f172a;
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
.dtc-action-icon:hover { background: #f1f5f9; color: #0f172a; }
@media (max-width: 640px) { .dtc-action-text { display: none; } }



                    .dtc-action-icon.liked { color: #ef4444 !important; }
                    .dtc-action-icon.liked svg {
                        animation: dtcHeartBurst 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
                        fill: #ef4444;
                        stroke: #ef4444;
                    }
                    @keyframes dtcHeartBurst {
                        0% { transform: scale(0); opacity: 0; }
                        50% { transform: scale(1.2); opacity: 1; }
                        100% { transform: scale(1); opacity: 0; }
                    }
                    .dtc-heart-burst svg {
                        animation: dtcHeartPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }
                    @keyframes dtcHeartPop {
                        0% { transform: scale(0); opacity: 1; }
                        70% { transform: scale(1.6); opacity: 1; }
                        100% { transform: scale(1.2); opacity: 0; }
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
                        width: 100%;
                        box-sizing: border-box;
                    }
                    .dtc-media-wrapper {
                        margin: 16px -24px 0 -24px;
                        border-top: 1px solid rgba(0,0,0,0.05);
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                        width: calc(100% + 48px);
                        max-width: none;
                    }
                    @media (max-width: 768px) {
                        .dtc-post-card {
                            padding: 16px;
                            border-radius: 16px;
                        }
                        .dtc-media-wrapper {
                            margin: 16px -16px 0 -16px;
                            width: calc(100% + 32px);
                        }
                    }
                    .dtc-post-card:hover { box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05); }
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
                    .dtc-create-icon:hover { background: #f1f5f9; color: #0f172a; }
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
                    .dtc-follow-btn:hover { background: #10b981; color: white; }
                    .dtc-verified-badge { color: #3b82f6; display: inline-flex; align-items: center; margin-left: 4px; }
                    .dtc-comment-submit-btn {
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 12px;
                        font-weight: 800;
                        font-size: 0.88rem;
                        cursor: pointer;
                    }
                    .dtc-delete-post-btn {
                        background: transparent;
                        border: none;
                        color: #94a3b8;
                        cursor: pointer;
                        padding: 6px 8px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    }
                    .dtc-delete-post-btn:hover { background: #fef2f2; color: #ef4444; }
                    @keyframes dtcPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
                    .dtc-feed-loader {
                        display: flex; justify-content: center; align-items: center;
                        padding: 24px; gap: 8px; color: #94a3b8; font-weight: 700; font-size: 0.9rem;
                    }
                    .dtc-feed-loader i { animation: dtcSpin 0.8s linear infinite; }
                    @keyframes dtcSpin { to { transform: rotate(360deg); } }
                </style>
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; gap: 24px;">

                    <!-- USER SEARCH BAR -->
                    <div style="background: white; border-radius: 16px; padding: 12px 20px; border: 1px solid rgba(15, 23, 42, 0.05); display: flex; align-items: center; gap: 12px; margin-bottom: 0px;">
                        <i class="fas fa-search" style="color: #94a3b8;"></i>
                        <input type="text" id="dtc-user-search" placeholder="Rechercher un profil, un expert ou une chaîne..." style="border: none; outline: none; width: 100%; font-family: inherit; font-size: 0.95rem; font-weight: 600; color: #0f172a;" onkeyup="window.MomentsModule.searchUsers(this.value)">
                    </div>
                    <div id="dtc-search-results" style="display: none; background: white; border-radius: 16px; padding: 16px; border: 1px solid rgba(15, 23, 42, 0.05); margin-top: -12px; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);"></div>

                    <!-- FEED MODE TABS -->
                    <div style="display: flex; gap: 6px; background: #f1f5f9; padding: 4px; border-radius: 14px; overflow-x: auto; scrollbar-width: none;">
                        <button onclick="window.MomentsModule.switchFeedMode('all', '${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === 'all' ? 'white' : 'transparent'}; color: ${this.currentFeedMode === 'all' ? '#0f172a' : '#64748b'}; box-shadow: ${this.currentFeedMode === 'all' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};">Pour vous</button>
                        <button onclick="window.MomentsModule.switchFeedMode('following', '${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === 'following' ? 'white' : 'transparent'}; color: ${this.currentFeedMode === 'following' ? '#0f172a' : '#64748b'}; box-shadow: ${this.currentFeedMode === 'following' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};">Abonnements</button>
                        <button onclick="window.MomentsModule.switchFeedMode('reels', '${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === 'reels' ? 'white' : 'transparent'}; color: ${this.currentFeedMode === 'reels' ? '#0f172a' : '#64748b'}; box-shadow: ${this.currentFeedMode === 'reels' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};"><i class="fas fa-film" style="margin-right:4px;"></i> Reels</button>
                        <button onclick="window.MomentsModule.switchFeedMode('saved', '${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === 'saved' ? 'white' : 'transparent'}; color: ${this.currentFeedMode === 'saved' ? '#0f172a' : '#64748b'}; box-shadow: ${this.currentFeedMode === 'saved' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};"><i class="fas fa-bookmark" style="margin-right:4px;"></i> Sauvegardés</button>
                    </div>

                    ${this.currentFeedMode !== 'reels' ? this.renderComposerBar(containerId) : ''}

                    ${this.currentFeedMode !== 'reels' && this.currentHashtagFilter ? `
                    <div style="display:flex; align-items:center; gap:12px; background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); border-radius:14px; padding:12px 16px;">
                        <i class="fas fa-hashtag" style="color:#3b82f6; font-size:1rem;"></i>
                        <span style="font-weight:800; color:#1d4ed8; font-size:0.95rem; flex:1;">Filtré par <strong>#${this.currentHashtagFilter}</strong></span>
                        <button onclick="MomentsModule.clearHashtagFilter('${containerId}')" style="background:#3b82f6; color:white; border:none; padding:6px 14px; border-radius:100px; font-weight:800; font-size:0.8rem; cursor:pointer;">✕ Effacer</button>
                    </div>` : ''}
                    ${this.currentFeedMode !== 'reels' ? storiesHtml : ''}

                    <!-- FEED ITEMS (Paginated) -->
                    ${firstPageHtml}

                </div>
            `;

            container.innerHTML = html;

            // Setup Intersection Observer for infinite scroll
            if (this.currentFeedMode !== 'reels' && firstPageItems.length >= this._feedPageSize) {
                this._setupFeedObserver(containerId);
            }

            const hashQs = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
            const postParam = new URLSearchParams(hashQs || window.location.search).get('post');
            if (postParam) setTimeout(() => this.openPostDetail(postParam, containerId), 150);

        } catch (err) {
            console.error("[MomentsModule] Load Error:", err);
            container.innerHTML = `
                <div style="padding: 24px; color: #ef4444; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 16px; font-weight: 700; text-align: center;">
                    Erreur de chargement de DTC : ${err.message}
                </div>
            `;
        }
    },

    _setupFeedObserver: function (containerId) {
        if (this._feedObserver) this._feedObserver.disconnect();
        const sentinel = document.getElementById('dtc-feed-sentinel');
        if (!sentinel) return;

        this._feedObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this._allFeedLoaded) {
                this._appendNextFeedPage(containerId);
            }
        }, { rootMargin: '300px' }); // Trigger 300px before the sentinel is visible

        this._feedObserver.observe(sentinel);
    },

    _appendNextFeedPage: async function (containerId) {
        if (this._allFeedLoaded || !this._feedCache) return;

        const start = this._feedPage * this._feedPageSize;
        const end = start + this._feedPageSize;
        const pageItems = this._feedCache.slice(start, end);

        if (pageItems.length === 0) {
            this._allFeedLoaded = true;
            if (this._feedObserver) this._feedObserver.disconnect();
            const sentinel = document.getElementById('dtc-feed-sentinel');
            if (sentinel) sentinel.remove();
            return;
        }

        // Load engagement for this page
        const pageIds = pageItems.map(i => i.id);
        try {
            await this.loadEngagementForPosts(pageIds, this._feedCurrentUser);
        } catch (e) { /* non-blocking */ }

        const currentUser = this._feedCurrentUser;
        const newHtml = pageItems.map((item, index) => {
            let htmlStr = this.renderFeedItemHTML(item, currentUser, containerId);
            return htmlStr;
        }).join('');

        const list = document.getElementById('dtc-feed-list');
        const sentinel = document.getElementById('dtc-feed-sentinel');
        if (list && sentinel) {
            // Insert cards before the sentinel
            sentinel.insertAdjacentHTML('beforebegin', newHtml);
        }

        this._feedPage++;

        if (pageItems.length < this._feedPageSize) {
            this._allFeedLoaded = true;
            if (this._feedObserver) this._feedObserver.disconnect();
            if (sentinel) sentinel.remove();
        }
    },


    renderFeedItemHTML: function (item, currentUser, containerId, embedMode = false) {
        const isSelf = currentUser && currentUser.id === item.userId;
        const relativeTime = this.getRelativeTime(item.createdAt);
        const isFollowing = this.subscriptions ? this.subscriptions.includes(item.userId) : false;

        // Vues réelles (à implémenter en base de données, pour l'instant on cache le compteur si non disponible)
        const viewsCount = item.views || 0;

        // Profile Details Link URL
        const profileUrl = '#channel?id=' + item.userId;

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

        const escapeHTML = (str) => str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
            
        // Limit newlines to 3 maximum to prevent abusive line breaks
        let rawContent = item.content || '';
        rawContent = rawContent.replace(/\n{4,}/g, '\n\n\n');
        let safeContent = escapeHTML(rawContent);
        
        // Check for YouTube Link (Live or Video) first so we can embed it
        const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const ytMatch = safeContent.match(ytRegex);
        let ytId = null;

        if (ytMatch && ytMatch[1]) {
            ytId = ytMatch[1];
            safeContent = safeContent.replace(ytMatch[0], ''); // Remove youtube URL from text
        }

        // Auto-link standard URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let formattedContent = safeContent.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" onclick="event.stopPropagation();" style="color: #3b82f6; text-decoration: underline; word-break: break-all;">${url}</a>`;
        });

        // Parse hashtags
        formattedContent = formattedContent.replace(/#(\w+)/g, (match, tag) => `<span style="color: #3b82f6; font-weight: 800; cursor: pointer; text-decoration: underline dotted;" onclick="event.stopPropagation(); MomentsModule.filterByHashtag('${tag}', '${containerId}')">#${tag}</span>`);
        
        // Truncate logic (Voir plus)
        let finalContentHtml = '';
        if (formattedContent.trim().length > 0) {
            finalContentHtml = `
            <div class="dtc-text-content-wrapper" style="position: relative;">
                <div class="dtc-text-body" style="display: -webkit-box; -webkit-line-clamp: 8; -webkit-box-orient: vertical; overflow: hidden; transition: all 0.3s ease; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word;">${formattedContent}</div>
                ${(safeContent.length > 180 || safeContent.split(/\r\n|\r|\n/).length > 5) ? `
                <span class="dtc-read-more" onclick="event.stopPropagation(); const body = this.previousElementSibling; const isTrunc = body.style.webkitLineClamp === '8'; body.style.webkitLineClamp = isTrunc ? 'unset' : '8'; this.innerText = isTrunc ? 'Voir moins' : 'Voir plus';" style="color: #64748b; font-weight: 800; cursor: pointer; display: inline-block; margin-top: 6px; font-size: 0.9rem; background: #f1f5f9; padding: 4px 10px; border-radius: 8px;">Voir plus</span>
                ` : ''}
            </div>
            `;
        }

        // Render CTA Button if exists
        let ctaHtml = '';
        if (item.meta) {
            try {
                const metaObj = typeof item.meta === 'string' && item.meta.startsWith('{') ? JSON.parse(item.meta) : (typeof item.meta === 'object' ? item.meta : null);
                if (metaObj && metaObj.cta) {
                    let ctaLink = metaObj.cta;
                    if (!ctaLink.startsWith('http')) ctaLink = 'https://' + ctaLink;
                    ctaHtml = `
                    <div style="margin-top: 16px; margin-bottom: 8px;">
                        <a href="${ctaLink}" target="_blank" onclick="event.stopPropagation();" style="display: flex; width: 100%; box-sizing: border-box; justify-content: center; align-items: center; gap: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 20px; border-radius: 14px; font-weight: 800; font-size: 1.05rem; text-decoration: none; box-shadow: 0 6px 20px rgba(16,185,129,0.3); transition: 0.2s; text-align: center;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            ACCÉDER AU LIEN
                        </a>
                    </div>`;
                }
            } catch (e) { console.error("Could not parse CTA meta", e) }
        }

        // Render Media if present
        let mediaHtml = '';
        if (item.type === 'live' && item.meta) {
            let roomId = null;
            try {
                roomId = JSON.parse(item.meta).roomId;
            } catch (e) { }

            if (roomId) {
                mediaHtml = `
                    <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); background: #000; height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; color: white; overflow: hidden;">
                        <div style="position: absolute; top: 16px; left: 16px; background: #ef4444; color: white; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; gap: 6px; z-index: 10; letter-spacing: 0.05em; text-transform: uppercase;">
                            <span style="display: block; width: 6px; height: 6px; background: white; border-radius: 50%; animation: dtcPulse 1.5s infinite;"></span> EN DIRECT
                        </div>
                        <i class="fas fa-video fa-3x" style="color: #475569; margin-bottom: 16px;"></i>
                        <h3 style="margin: 0 0 16px 0; font-weight: 800; text-align: center;">${item.authorName} est en direct !</h3>
                        <button onclick="MomentsModule.joinNativeLive('${roomId}')" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                            Rejoindre le Live
                        </button>
                    </div>
                `;
            }
        } else if (ytId) {
            mediaHtml = `
                <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; background: #000; height: auto; aspect-ratio: 16/9; display: flex; justify-content: center; position: relative;">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${ytId}?autoplay=0&controls=1&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border: none;"></iframe>
                </div>
            `;
        } else if (item.imageUrl) {
            const urls = item.imageUrl.split(',').map(u => u.trim());

            if (urls.length === 1) {
                const url = urls[0];
                const isVideo = url.match(/\.(mp4|mov|avi|webm|quicktime)($|\?)/i);
                const isPdf = url.match(/\.(pdf)($|\?)/i);

                if (isVideo) {
                    const vidId = 'vid-' + Math.random().toString(36).substr(2, 9);
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; background: #000; max-height: 500px; display: flex; justify-content: center; position: relative;">
                            <video id="${vidId}" src="${url}" loop muted playsinline style="max-height: 500px; width: 100%; object-fit: contain; cursor: pointer;" onclick="event.stopPropagation(); this.muted = !this.muted; document.getElementById('${vidId}-mute-icon').className = this.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';"></video>
                            <div style="position: absolute; bottom: 16px; right: 16px; background: rgba(0,0,0,0.6); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; pointer-events: none; backdrop-filter: blur(4px);">
                                <i id="${vidId}-mute-icon" class="fas fa-volume-mute"></i>
                            </div>
                        </div>
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" onload="
                            setTimeout(() => {
                                const v = document.getElementById('${vidId}');
                                if(!v) return;
                                const observer = new IntersectionObserver((entries) => {
                                    entries.forEach(entry => {
                                        if (entry.isIntersecting) { v.play().catch(()=>{}); }
                                        else { v.pause(); }
                                    });
                                }, { threshold: 0.5 });
                                observer.observe(v);
                            }, 100);
                            this.remove();
                        " style="display:none;">
                    `;
                } else if (isPdf) {
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; background: #f8fafc; padding: 24px; display: flex; justify-content: center;">
                            <a href="${url}" target="_blank" onclick="event.stopPropagation();" style="display: flex; flex-direction: column; align-items: center; gap: 12px; text-decoration: none; background: white; padding: 24px; border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.1); box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s; width: 100%; max-width: 300px; box-sizing: border-box;" onmouseover="this.style.transform='scale(1.02)';" onmouseout="this.style.transform='scale(1)';">
                                <i class="fas fa-file-pdf fa-3x" style="color: #ef4444;"></i>
                                <span style="font-weight: 800; color: #0f172a; text-align: center;">Ouvrir le document PDF</span>
                            </a>
                        </div>
                    `;
                } else {
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; max-height: 450px; display: flex; justify-content: center; background: #f8fafc; cursor: zoom-in;" onclick="event.stopPropagation(); window.open('${url}', '_blank')">
                            <img src="${url}" loading="lazy" style="max-height: 450px; width: 100%; object-fit: cover; display: block;">
                        </div>
                    `;
                }
            } else {
                // CSS Grid for multiple images (Twitter-style)
                let gridHtml = '';
                
                if (urls.length === 2) {
                    gridHtml = urls.map(url => `
                        <div style="width: 100%; height: 100%; overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="event.stopPropagation(); window.open('${url}', '_blank')">
                            <img src="${url}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `).join('');
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px; height: 350px; background: white; margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05);">
                            ${gridHtml}
                        </div>
                    `;
                } else if (urls.length === 3) {
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; height: 350px; background: white; margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05);">
                            <div style="grid-row: span 2; overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="event.stopPropagation(); window.open('${urls[0]}', '_blank')">
                                <img src="${urls[0]}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="event.stopPropagation(); window.open('${urls[1]}', '_blank')">
                                <img src="${urls[1]}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="event.stopPropagation(); window.open('${urls[2]}', '_blank')">
                                <img src="${urls[2]}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                        </div>
                    `;
                } else {
                    const extraCount = urls.length - 4;
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; height: 350px; background: white; margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05);">
                            ${urls.slice(0, 3).map(url => `
                                <div style="overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="event.stopPropagation(); window.open('${url}', '_blank')">
                                    <img src="${url}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                </div>
                            `).join('')}
                            <div style="position: relative; overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="event.stopPropagation(); window.open('${urls[3]}', '_blank')">
                                <img src="${urls[3]}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                ${extraCount > 0 ? `
                                <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; backdrop-filter: blur(2px);">
                                    +${extraCount}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }
            }
        }

        // Réactions & Comments Count
        const postReactions = this.reactions[item.id] || [];
        const postLikes = this.likes[item.id] || [];
        const likesCount = postReactions.length || postLikes.length;
        const userReaction = currentUser ? postReactions.find(r => r.user_id === currentUser.id) : null;
        const hasLiked = !!userReaction;
        const userReactionEmoji = userReaction ? (this.REACTION_EMOJI[userReaction.type] || '❤️') : null;
        const reactionSummary = Object.entries(
            postReactions.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {})
        ).map(([type, count]) => `${this.REACTION_EMOJI[type] || '❤️'} ${count}`).join(' ');

        const postComments = this.comments[item.id] || [];
        const commentsCount = postComments.length;

        // Render Comments List
        const commentsListHtml = postComments.length === 0
            ? `<p style="font-size:0.85rem; color:#94a3b8; font-style:italic; margin:0; padding: 8px 0; text-align:center;">Soyez le premier à réagir !</p>`
            : (() => {
                const rootComments = postComments.filter(c => !c.parent_id);
                const replies = postComments.filter(c => c.parent_id);

                const renderComment = (c, isReply = false) => {
                    const cProfile = c.profiles || {};
                    const initials = (cProfile.full_name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    const childReplies = replies.filter(r => r.parent_id === c.id);
                    const isMyComment = currentUser && currentUser.id === c.user_id;

                    return `
                    <div style="display: flex; gap: 12px; align-items: flex-start; background: transparent; padding: 8px 0; margin-bottom: 8px; ${isReply ? 'margin-left: 36px; padding-left: 12px; border-left: 2px solid #e2e8f0;' : ''}">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; color: #0f172a; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.05);">
                            ${cProfile.avatar_url ? `<img src="${cProfile.avatar_url}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">` : initials}
                        </div>
                        <div style="flex: 1;">
                            <div style="background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02); position: relative;">
                                ${isMyComment ? `<button onclick="MomentsModule.deleteComment('${c.id}', '${item.id}', '${containerId}')" style="position: absolute; right: 8px; top: 8px; background: white; border: 1px solid #e2e8f0; width: 24px; height: 24px; border-radius: 50%; color: #cbd5e1; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" title="Supprimer ce commentaire" onmouseover="this.style.color='#ef4444'; this.style.borderColor='#ef4444';" onmouseout="this.style.color='#cbd5e1'; this.style.borderColor='#e2e8f0';"><i class="fas fa-trash-alt"></i></button>` : ''}
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; padding-right: ${isMyComment ? '24px' : '0'};">
                                    <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${cProfile.full_name || 'Utilisateur'}</span>
                                    <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">${this.getRelativeTime(new Date(c.created_at))}</span>
                                </div>
                                <p style="margin: 0; font-size: 0.9rem; color: #334155; line-height: 1.45; font-weight: 500;">${escapeHTML(c.content)}</p>
                            </div>
                            ${!isReply ? `
                            <div style="display: flex; gap: 12px; padding: 4px 12px;">
                                <span onclick="MomentsModule.replyToComment('${item.id}', '${c.id}', '${(cProfile.full_name || 'Utilisateur').replace(/'/g, "\\'")}')" style="font-size: 0.75rem; color: #64748b; font-weight: 700; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#64748b'">Répondre</span>
                            </div>
                            ` : ''}
                            ${childReplies.map(r => renderComment(r, true)).join('')}
                        </div>
                    </div>
                    `;
                };
                return rootComments.map(c => renderComment(c, false)).join('');
            })();

        const isPinned = item.isPinned === true;

        return `
            <div class="dtc-post-card" data-post-id="${item.id}" ${embedMode ? '' : `ondblclick="MomentsModule.doubleTapLike('${item.id}', '${containerId}', this)" onclick="if(!event.target.closest('button,a,input,textarea,select,video,.dtc-reaction-picker')) MomentsModule.openPostDetail('${item.id}', '${containerId}')"`} style="${cardBorder} position: relative;${embedMode ? '' : ' cursor: pointer;'}">
                ${isPinned ? `<div style="position: absolute; top: 12px; right: 12px; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 4px; z-index: 2;"><i class="fas fa-thumbtack" style="font-size: 0.6rem;"></i> Épinglé</div>` : ''}
                <div class="dtc-heart-burst" style="display:none; position:absolute; inset:0; align-items:center; justify-content:center; pointer-events:none; z-index:5;"><svg width="80" height="80" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>

                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div style="display: flex; gap: 14px; align-items: center;">
                        <div onclick="window.location.href='${profileUrl}'" style="width: 48px; height: 48px; border-radius: 50%; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; overflow: hidden; border: 2px solid rgba(0,0,0,0.05); flex-shrink:0; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';">
                            ${item.authorAvatar ? `<img src="${item.authorAvatar}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                <span onclick="window.location.href='${profileUrl}'" style="font-weight: 800; font-size: 1.05rem; color: #0f172a; letter-spacing:-0.01em; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#10b981';" onmouseout="this.style.color='#0f172a';">${item.authorName}</span>
                                ${verifiedSvg}
                                ${item.title === 'opportunite' ? '<span style="background: rgba(16, 185, 129, 0.1); color: #059669; font-size: 0.65rem; font-weight: 900; padding: 3px 8px; border-radius: 100px; margin-left: 4px; text-transform: uppercase;"><i class="fas fa-briefcase"></i> Opportunité</span>' : ''}
                                ${item.title === 'partenaire' ? '<span style="background: rgba(59, 130, 246, 0.1); color: #2563eb; font-size: 0.65rem; font-weight: 900; padding: 3px 8px; border-radius: 100px; margin-left: 4px; text-transform: uppercase;"><i class="fas fa-handshake"></i> Partenaire</span>' : ''}
                                ${item.title === 'expertise' ? '<span style="background: rgba(245, 158, 11, 0.1); color: #d97706; font-size: 0.65rem; font-weight: 900; padding: 3px 8px; border-radius: 100px; margin-left: 4px; text-transform: uppercase;"><i class="fas fa-lightbulb"></i> Expertise</span>' : ''}
                                ${!isSelf ? `
                                    <span style="color:#cbd5e1; margin: 0 4px;">•</span>
                                    <button class="dtc-follow-btn" onclick="MomentsModule.toggleFollow('${item.userId}', this, '${item.authorName.replace(/'/g, "\\'")}')" style="${isFollowing ? 'background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;' : ''}">
                                        ${isFollowing ? `<i class="fas fa-check" style="margin-right: 4px;"></i> Abonné` : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Suivre`}
                                    </button>
                                ` : ''}
                            </div>
                            <div style="font-size: 0.8rem; color: #64748b; font-weight: 500; margin-top: 2px;">
                                ${roleBadge} <span style="margin:0 4px;">•</span> ${relativeTime}
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${item.meta && item.type !== 'live' && typeof item.meta === 'string' && !item.meta.startsWith('{') ? `
                            <div style="background: rgba(59, 130, 246, 0.04); border: 1px solid rgba(59, 130, 246, 0.25); color: #2563eb; font-weight: 800; font-size: 0.78rem; padding: 6px 14px; border-radius: 100px; letter-spacing: -0.01em;">
                                ${item.meta}
                            </div>
                        ` : ''}
                        
                        <!-- OWNER ACTIONS -->
                        ${isSelf ? `
                            <div style="display: flex; gap: 4px;">
                                ${containerId === 'channel-feed-container' ? `
                                <button onclick="MomentsModule.pinPost('${item.id}', '${item.userId}', '${containerId}')" class="dtc-delete-post-btn" title="${isPinned ? 'Désépingler' : 'Épingler en haut de la chaîne'}" style="${isPinned ? 'color:#3b82f6;' : ''}">
                                    <i class="fas fa-thumbtack"></i>
                                </button>
                                ` : ''}
                                <button onclick="MomentsModule.openEditPostModal('${item.id}', '${item.type}', '${containerId}')" class="dtc-delete-post-btn" title="Modifier la publication" style="color: #64748b;" onmouseover="this.style.color='#3b82f6'; this.style.background='#eff6ff';" onmouseout="this.style.color='#64748b'; this.style.background='transparent';">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onclick="MomentsModule.deletePost('${item.id}', '${item.type}', '${containerId}')" class="dtc-delete-post-btn" title="Supprimer la publication">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        ` : `
                            <div style="display: flex; gap: 4px;">
                                <button onclick="MomentsModule.reportPost('${item.id}')" class="dtc-delete-post-btn" title="Signaler cette publication" style="color: #94a3b8;" onmouseover="this.style.color='#f59e0b'; this.style.background='#fffbeb';" onmouseout="this.style.color='#94a3b8'; this.style.background='transparent';">
                                    <i class="fas fa-flag"></i>
                                </button>
                            </div>
                        `}
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
                    ${finalContentHtml}
                    ${(() => {
                if (item.type === 'repost' && item.meta) {
                    try {
                        const quoteData = JSON.parse(item.meta);
                        return `
                                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 16px; padding: 16px; margin-top: 12px; background: #f8fafc; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f1f5f9';" onmouseout="this.style.background='#f8fafc';" onclick="window.location.href='#moments?post=${quoteData.id}'">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                        <div style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background: #cbd5e1;">
                                            ${quoteData.authorAvatar ? `<img src="${quoteData.authorAvatar}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user" style="font-size:12px; margin:6px;"></i>'}
                                        </div>
                                        <div style="font-size: 0.85rem; font-weight: 800; color: #475569;">${quoteData.authorName || 'Inconnu'}</div>
                                    </div>
                                    <div style="font-size: 0.95rem; color: #0f172a; font-weight: 500;">
                                        ${(quoteData.content || '').substring(0, 200)}...
                                    </div>
                                    ${quoteData.imageUrl ? `<img src="${quoteData.imageUrl}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-top: 12px;">` : ''}
                                </div>
                                `;
                    } catch (e) { return ''; }
                }

                if (item.type === 'poll') {
                    const poll = this.polls[item.id];
                    if (poll) {
                        let options = [];
                        try { options = typeof poll.options === 'string' ? JSON.parse(poll.options) : poll.options; } catch (e) { }
                        const votes = this.pollVotes[poll.id] || [];
                        const totalVotes = votes.length;
                        const userVote = votes.find(v => currentUser && v.user_id === currentUser.id);

                        const optionsHtml = options.map((opt, i) => {
                            const count = votes.filter(v => v.option_id === i).length;
                            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                            const isSelected = userVote && userVote.option_id === i;
                            return `
                                    <div style="margin-bottom: 8px; position: relative; border-radius: 8px; overflow: hidden; border: 1px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}; cursor: ${userVote ? 'default' : 'pointer'}; background: white; transition: transform 0.2s;" ${!userVote ? `onclick="MomentsModule.votePoll('${poll.id}', ${i}, '${containerId}')" onmouseover="this.style.transform='scale(1.02)';" onmouseout="this.style.transform='scale(1)';" ` : ''}>
                                        <div style="position: absolute; top: 0; left: 0; height: 100%; background: ${isSelected ? 'rgba(59, 130, 246, 0.15)' : '#f1f5f9'}; width: ${userVote ? percent : 0}%; transition: width 0.5s ease;"></div>
                                        <div style="position: relative; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                                            <span style="font-weight: 700; color: #0f172a;">${escapeHTML(opt.text)}</span>
                                            ${userVote ? `<span style="font-weight: 800; color: #64748b; font-size: 0.85rem;">${percent}%</span>` : ''}
                                        </div>
                                    </div>
                                    `;
                        }).join('');

                        return `
                                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 16px; padding: 16px; margin-top: 12px; background: #f8fafc;">
                                    <div style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 16px;">${escapeHTML(poll.question || item.content || '')}</div>
                                    ${optionsHtml}
                                    <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 12px; font-weight: 600;">${totalVotes} vote${totalVotes !== 1 ? 's' : ''}</div>
                                </div>
                                `;
                    }
                }

                return '';
            })()}
                </div>
 
                <!-- MEDIA -->
                ${mediaHtml}

                <!-- CTA BUTTON -->
                ${ctaHtml}

                ${reactionSummary ? `<div style="font-size:0.82rem; color:#64748b; font-weight:700; margin-top:8px;">${reactionSummary}</div>` : ''}

                <!-- ACTIONS & ENGAGEMENT -->
                <div style="display: flex; gap: 4px; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 12px; align-items: center; justify-content: space-between;" onclick="event.stopPropagation()">
                    
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        <!-- RÉACTIONS -->
                        <div style="display:flex; align-items:center; gap:2px;">
                            <button onclick="event.stopPropagation(); MomentsModule.setReaction('${item.id}', 'heart', '${containerId}', this)" class="dtc-action-icon ${hasLiked ? 'liked' : ''}" title="J'aime">
                                ${userReactionEmoji || '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'}
                                <span class="reaction-count">${likesCount > 0 ? likesCount : ''}</span>
                            </button>
                            <button onclick="event.stopPropagation(); MomentsModule.openReactionPicker('${item.id}', '${containerId}', event)" class="dtc-action-icon" title="Plus de réactions" style="padding:8px 6px; font-size:0.75rem;">+</button>
                        </div>
    
                        <!-- COMMENTS TOGGLE -->
                        <button onclick="event.stopPropagation(); MomentsModule.toggleCommentsSection('${item.id}')" class="dtc-action-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                            ${commentsCount > 0 ? commentsCount : '<span class="dtc-action-text">Commenter</span>'}
                        </button>
    
                        <!-- MESSAGE -->
                        ${!isSelf ? `
                        <button onclick="event.stopPropagation(); window.Router.navigate('#messages?to=${item.userId}&context=post&prefill=${encodeURIComponent('Bonjour, à propos de votre publication : ')}')" class="dtc-action-icon" title="Envoyer un message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            Message
                        </button>
                        ` : ''}

                        <!-- SHARE -->
                        <button onclick="event.stopPropagation(); MomentsModule.sharePost('${item.id}', this)" class="dtc-action-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg> Partager
                        </button>

                        <!-- REPOST -->
                        <button onclick="event.stopPropagation(); MomentsModule.repostItem('${item.id}', '${containerId}')" class="dtc-action-icon" title="Republier sur votre chaîne">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                            Repost
                        </button>
                    </div>

                    <!-- SAVE (Real Bookmark) -->
                    <button class="dtc-action-icon ${this.bookmarks.includes(item.id) ? 'liked' : ''}" title="${this.bookmarks.includes(item.id) ? 'Retirer des favoris' : 'Sauvegarder'}" onclick="event.stopPropagation(); MomentsModule.toggleBookmark('${item.id}', '${containerId}', this)" style="${this.bookmarks.includes(item.id) ? 'color:#f59e0b;' : ''}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="${this.bookmarks.includes(item.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
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
                            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                                <div id="mention-results-${item.id}" style="display:none; background:white; border:1px solid #e2e8f0; border-radius:12px; padding:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08); max-height:150px; overflow-y:auto;"></div>
                                <div style="display:flex; gap:8px; align-items:center;">
                                <input type="text" id="comment-input-${item.id}" placeholder="Ajouter un commentaire... (@pseudo pour mentionner)" style="flex: 1; border: 1px solid #e2e8f0; border-radius: 20px; padding: 12px 16px; font-size: 0.9rem; outline: none; font-family: inherit; font-weight: 500; transition: border-color 0.2s; background: #f8fafc;" onfocus="this.style.borderColor='#10b981'; this.style.background='white';" onblur="this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc';" oninput="MomentsModule.handleMentionInput(this, '${item.id}')">
                                <button onclick="MomentsModule.submitComment('${item.id}', '${containerId}')" class="dtc-comment-submit-btn" style="border-radius: 20px; padding: 12px 20px;">
                                    Envoyer
                                </button>
                            </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderMastermindCTA: function () {
        return `
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: 32px; color: white; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.2); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); margin: 8px 0;">
                <div style="position: absolute; top: -20px; right: -20px; font-size: 8rem; opacity: 0.03; color: white; pointer-events: none;"><i class="fas fa-rocket"></i></div>
                <div style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 20px;">
                    <i class="fas fa-rocket"></i>
                </div>
                <h3 style="font-size: 1.4rem; font-weight: 900; margin: 0 0 12px 0; letter-spacing: -0.02em;">Accélérez votre projet</h3>
                <p style="color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.5; margin: 0 0 24px 0; max-width: 90%;">
                    Rejoignez <strong style="color:white;">l'Incubateur DTC</strong> pour structurer votre idée, développer votre réseau d'affaires premium et trouver des financements en Outre-Mer.
                </p>
                <button onclick="window.Router.navigate('#incubator')" style="background: #10b981; color: white; border: none; padding: 12px 28px; border-radius: 14px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);">
                    Découvrir l'Incubateur
                </button>
            </div>
        `;
    },

    _storyViewerTimer: null,

    openStoryViewer: function (groupIdx, storyIdx = 0) {
        if (!this.storyGroups || !this.storyGroups[groupIdx]) return;

        const group = this.storyGroups[groupIdx];
        const s = group.items[storyIdx];
        if (!s) return;

        if (this._storyViewerTimer) clearTimeout(this._storyViewerTimer);

        let viewer = document.getElementById('dtc-story-viewer');
        if (!viewer) {
            viewer = document.createElement('div');
            viewer.id = 'dtc-story-viewer';
            viewer.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:99999; display:flex; align-items:center; justify-content:center;';
            document.body.appendChild(viewer);
        }

        const isVideo = s.imageUrl && s.imageUrl.match(/\.(mp4|mov|avi|webm|quicktime)($|\?)/i);
        const progressBars = group.items.map((_, i) => `
            <div style="flex:1; height:3px; background:rgba(255,255,255,0.3); border-radius:2px; overflow:hidden;">
                <div id="story-progress-${i}" style="height:100%; width:${i < storyIdx ? '100%' : i === storyIdx ? '0%' : '0%'}; background:white; transition: width 5s linear;"></div>
            </div>
        `).join('');

        const mediaTag = isVideo
            ? `<video id="story-media-el" src="${s.imageUrl}" autoplay playsinline style="max-width:100%; max-height:85vh; border-radius:12px;"></video>`
            : `<img id="story-media-el" src="${s.imageUrl}" style="max-width:100%; max-height:85vh; border-radius:12px; object-fit:contain;">`;

        viewer.innerHTML = `
            <div style="position:absolute; top:0; left:0; right:0; padding:16px 12px 0; z-index:20; display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; gap:4px;">${progressBars}</div>
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:36px; height:36px; border-radius:50%; overflow:hidden; border:2px solid white;">
                            ${group.authorAvatar ? `<img src="${group.authorAvatar}" style="width:100%; height:100%; object-fit:cover;">` : ''}
                        </div>
                        <div style="color:white; font-weight:800; font-size:0.95rem; text-shadow:0 2px 4px rgba(0,0,0,0.5);">${group.authorName}</div>
                        <span style="color:rgba(255,255,255,0.7); font-size:0.8rem; font-weight:600;">${this.getRelativeTime(s.createdAt)}</span>
                    </div>
                    <button onclick="MomentsModule.closeStoryViewer()" style="background:rgba(255,255,255,0.2); color:white; border:none; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">&times;</button>
                </div>
            </div>
            ${(() => {
                const session = window.App?.state?.session;
                const isSelf = session && session.user.id === group.userId;
                return isSelf ? `<button onclick="MomentsModule.addToHighlights('${s.id}')" style="position:absolute; bottom:24px; left:50%; transform:translateX(-50%); z-index:20; background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.4); padding:10px 20px; border-radius:100px; font-weight:800; font-size:0.85rem; cursor:pointer; backdrop-filter:blur(8px);">⭐ Ajouter aux À la une</button>` : '';
            })()}
            <div style="position:absolute; left:0; top:0; width:35%; height:100%; z-index:15; cursor:pointer;" onclick="MomentsModule._storyNav(${groupIdx}, ${storyIdx}, -1)"></div>
            <div style="position:absolute; right:0; top:0; width:35%; height:100%; z-index:15; cursor:pointer;" onclick="MomentsModule._storyNav(${groupIdx}, ${storyIdx}, 1)"></div>
            ${mediaTag}
        `;
        viewer.style.display = 'flex';

        requestAnimationFrame(() => {
            const bar = document.getElementById(`story-progress-${storyIdx}`);
            if (bar) bar.style.width = '100%';
        });

        const duration = isVideo ? 15000 : 5000;
        this._storyViewerTimer = setTimeout(() => this._storyNav(groupIdx, storyIdx, 1), duration);
    },

    closeStoryViewer: function () {
        if (this._storyViewerTimer) clearTimeout(this._storyViewerTimer);
        const viewer = document.getElementById('dtc-story-viewer');
        if (viewer) viewer.style.display = 'none';
    },

    _storyNav: function (groupIdx, storyIdx, direction) {
        if (this._storyViewerTimer) clearTimeout(this._storyViewerTimer);
        const group = this.storyGroups[groupIdx];
        if (!group) return this.closeStoryViewer();

        const nextIdx = storyIdx + direction;
        if (nextIdx >= 0 && nextIdx < group.items.length) {
            this.openStoryViewer(groupIdx, nextIdx);
        } else if (direction > 0 && groupIdx + 1 < this.storyGroups.length) {
            this.openStoryViewer(groupIdx + 1, 0);
        } else if (direction < 0 && groupIdx > 0) {
            const prevGroup = this.storyGroups[groupIdx - 1];
            this.openStoryViewer(groupIdx - 1, prevGroup.items.length - 1);
        } else {
            this.closeStoryViewer();
        }
    },

    publishStory: async function (file) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        const profile = window.App?.state?.profile;
        if (!session || !profile) {
            alert("Vous devez être connecté.");
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `stories/${fileName}`;

        const { error: uploadError } = await db.storage.from('chat-media').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = db.storage.from('chat-media').getPublicUrl(filePath);

        const { error } = await db.from('showcase_items').insert([{
            user_id: session.user.id,
            title: `Story: ${profile.full_name}`,
            description: '',
            image_url: publicUrl,
            price: 0,
            category: 'story',
            item_type: 'story',
            status: 'active'
        }]);
        if (error) throw error;
    },

    handleStoryFileSelected: async function (input, skipEditor = false) {
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];

        const doPublish = async (fileToUse) => {
            if (!skipEditor && !confirm("Voulez-vous publier ce média dans votre Story ?")) return;
            try {
                await this.publishStory(fileToUse);
                alert("Story publiée !");
                const feedEl = document.getElementById('moments-feed-container');
                if (feedEl) this.renderFeed('moments-feed-container');
                else if (window.ChannelModule) {
                    const uid = new URLSearchParams(window.location.hash.split('?')[1] || '').get('id') || window.App?.state?.session?.user?.id;
                    window.ChannelModule.renderChannel(uid, 'view-channel');
                }
            } catch (err) {
                console.error("Story Post Error:", err);
                alert("Erreur lors de la publication de la story.");
            }
        };

        if (!skipEditor && window.CameraModule?.editFile) {
            window.CameraModule.editFile(file, (editedFile) => { if (editedFile) doPublish(editedFile); });
        } else {
            await doPublish(file);
        }
        input.value = '';
    },

    handlePostFileSelected: function (input, skipEditor = false) {
        if (!input.files || input.files.length === 0) return;
        const files = Array.from(input.files);

        const setPending = (fileList) => {
            window._pendingPostFiles = fileList;
            window._pendingPostFile = null;
            window._pendingPostCategory = null;
            const nameEl = document.getElementById('post-file-name');
            if (nameEl) {
                nameEl.innerText = fileList.length === 1 ? fileList[0].name : `${fileList.length} fichiers sélectionnés`;
            }
            
            const previewContainer = document.getElementById('composer-previews');
            if (previewContainer) {
                previewContainer.innerHTML = '';
                fileList.forEach((f, idx) => {
                    const url = URL.createObjectURL(f);
                    const isVideo = f.type.startsWith('video/');
                    const previewHtml = isVideo 
                        ? `<video src="${url}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;"></video>`
                        : `<img src="${url}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">`;
                    
                    previewContainer.insertAdjacentHTML('beforeend', `
                        <div style="position: relative; width: 100px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                            ${previewHtml}
                            <button onclick="
                                window._pendingPostFiles.splice(${idx}, 1);
                                if(window._pendingPostFiles.length === 0) {
                                    document.getElementById('post-file-name').innerText = '';
                                } else {
                                    document.getElementById('post-file-name').innerText = window._pendingPostFiles.length + ' fichiers';
                                }
                                this.parentElement.remove();
                            " style="position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px;">✕</button>
                        </div>
                    `);
                });
            }
        };

        if (!skipEditor && files.length === 1 && window.CameraModule?.editFile) {
            window.CameraModule.editFile(files[0], (editedFile) => { if (editedFile) setPending([editedFile]); });
        } else {
            setPending(files);
        }
    },

    openIntegratedCamera: function (mode) {
        if (!window.CameraModule) {
            alert("Module caméra en cours de chargement, veuillez patienter...");
            return;
        }
        window.CameraModule.openCamera((file) => {
            if (file) {
                // Mock an input structure for existing handlers
                const mockInput = { files: [file] };
                if (mode === 'story') {
                    this.handleStoryFileSelected(mockInput, true);
                } else {
                    this.handlePostFileSelected(mockInput, true);
                }
            }
        });
    },

    postStatus: async function (containerId) {
        const input = document.getElementById('feed-status-input');
        const hasFiles = window._pendingPostFiles && window._pendingPostFiles.length > 0;
        if (!input || (!input.value.trim() && !hasFiles && !window._pendingPostFile && !this.pendingFile)) return;

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

            let finalUrl = null;

            // Handle multiple files (new system)
            if (window._pendingPostFiles && window._pendingPostFiles.length > 0) {
                const uploadedUrls = [];
                for (const file of window._pendingPostFiles) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
                    const filePath = `feed/${fileName}`;
                    const { error: uploadError } = await db.storage.from('chat-media').upload(filePath, file);
                    if (uploadError) throw uploadError;
                    const { data: { publicUrl } } = db.storage.from('chat-media').getPublicUrl(filePath);
                    uploadedUrls.push(publicUrl);
                }
                finalUrl = uploadedUrls.join(',');
            } else {
                // Fallback single file
                const fileToUpload = window._pendingPostFile || this.pendingFile;
                if (fileToUpload) {
                    const fileExt = fileToUpload.name.split('.').pop();
                    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
                    const filePath = `feed/${fileName}`;
                    const { error: uploadError } = await db.storage.from('chat-media').upload(filePath, fileToUpload);
                    if (uploadError) throw uploadError;
                    const { data: { publicUrl } } = db.storage.from('chat-media').getPublicUrl(filePath);
                    finalUrl = publicUrl;
                }
            }

            let categoryToUse = window._pendingPostCategory || 'status';

            let intentTag = 'standard';
            const typeInput = document.querySelector('input[name="post_type"]:checked');
            if (typeInput) {
                intentTag = typeInput.value;
            } else {
                const intentSelect = document.getElementById('post-intent-tag');
                if (intentSelect) intentTag = intentSelect.value;
            }

            const ctaInput = document.getElementById('post-cta-link');
            const ctaLink = ctaInput && ctaInput.value.trim() ? ctaInput.value.trim() : null;

            const { error: postErr } = await db.from('showcase_items').insert([{
                user_id: session.user.id,
                title: intentTag,
                description: text,
                category: categoryToUse,
                image_url: finalUrl,
                meta_info: ctaLink ? JSON.stringify({ cta: ctaLink }) : null,
                status: 'active',
                price: 0
            }]);

            if (postErr) throw postErr;

            input.value = '';
            if (ctaInput) ctaInput.value = '';
            document.getElementById('post-cta-container').style.display = 'none';
            window._pendingPostFile = null;
            window._pendingPostFiles = null;
            window._pendingPostCategory = null;
            this.pendingFile = null;
            const fileLabel = document.getElementById('post-file-name');
            if (fileLabel) fileLabel.textContent = '';
            const previewEl = document.getElementById('composer-previews');
            if (previewEl) previewEl.innerHTML = '';

            if (containerId === 'channel-feed-container' && window.ChannelModule) {
                const currentChannelId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                window.ChannelModule.renderChannel(currentChannelId, 'view-channel');
            } else {
                this.renderFeed(containerId);
            }

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

    openPollModal: function () {
        const modalId = 'dtc-poll-modal';
        let existing = document.getElementById(modalId);
        if (existing) existing.remove();

        const html = `
            <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; width: 90%; max-width: 500px; border-radius: 24px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; font-size: 1.2rem; color: #0f172a; font-weight: 800;">Créer un sondage</h3>
                        <button onclick="document.getElementById('${modalId}').remove()" style="background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer;">&times;</button>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 0.9rem; font-weight: 800; color: #475569; margin-bottom: 8px;">Votre question</label>
                        <textarea id="poll-question" rows="2" placeholder="Que voulez-vous demander ?" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-family: inherit; font-size: 1rem; outline: none; resize: none;"></textarea>
                    </div>

                    <div id="poll-options-container" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                        <div><input type="text" class="poll-option-input" placeholder="Option 1" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-family: inherit; font-size: 0.95rem; outline: none;"></div>
                        <div><input type="text" class="poll-option-input" placeholder="Option 2" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-family: inherit; font-size: 0.95rem; outline: none;"></div>
                    </div>
                    
                    <button id="add-poll-option-btn" onclick="MomentsModule.addPollOption()" style="background: transparent; color: #3b82f6; border: none; font-weight: 800; cursor: pointer; padding: 8px 0; margin-bottom: 24px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-plus"></i> Ajouter une option
                    </button>

                    <button onclick="MomentsModule.submitPoll()" style="width: 100%; padding: 14px; border-radius: 16px; border: none; background: #8b5cf6; color: white; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                        Publier le sondage
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    addPollOption: function () {
        const container = document.getElementById('poll-options-container');
        const inputs = container.querySelectorAll('.poll-option-input');
        if (inputs.length >= 4) {
            alert("Vous pouvez ajouter jusqu'à 4 options maximum.");
            return;
        }
        const div = document.createElement('div');
        div.innerHTML = `<input type="text" class="poll-option-input" placeholder="Option ${inputs.length + 1}" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-family: inherit; font-size: 0.95rem; outline: none;">`;
        container.appendChild(div);

        if (inputs.length + 1 >= 4) {
            document.getElementById('add-poll-option-btn').style.display = 'none';
        }
    },

    submitPoll: async function () {
        const question = document.getElementById('poll-question').value.trim();
        const inputs = document.querySelectorAll('.poll-option-input');
        const options = Array.from(inputs).map(inp => inp.value.trim()).filter(val => val !== '');

        if (!question) return alert("Veuillez entrer une question.");
        if (options.length < 2) return alert("Veuillez entrer au moins 2 options.");

        const session = window.App?.state?.session;
        if (!session) return alert("Vous devez être connecté.");

        const db = this.getDb();
        try {
            // 1. Insert Post
            const { data: postData, error: postErr } = await db.from('showcase_items').insert([{
                user_id: session.user.id,
                title: 'Sondage',
                description: question,
                category: 'status',
                item_type: 'poll',
                status: 'active'
            }]).select('id').single();

            if (postErr) throw postErr;

            // 2. Insert Poll options
            const pollOptions = options.map((opt, i) => ({ id: i, text: opt }));
            const { error: pollErr } = await db.from('feed_polls').insert([{
                post_id: postData.id,
                question: question,
                options: JSON.stringify(pollOptions)
            }]);

            if (pollErr) throw pollErr;

            document.getElementById('dtc-poll-modal').remove();

            const containerId = document.querySelector('.dtc-post-card') ? 'moments-feed-container' : 'channel-feed-container';
            if (document.getElementById(containerId)) {
                this.renderFeed(containerId);
            } else if (window.location.hash.includes('channel')) {
                const currentChannelId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                if (window.ChannelModule) window.ChannelModule.renderChannel(currentChannelId, 'view-channel');
            } else {
                this.renderFeed('moments-feed-container');
            }

        } catch (err) {
            console.error("Erreur sondage:", err);
            alert("Erreur lors de la création du sondage.");
        }
    },

    votePoll: async function (pollId, optionIndex, containerId) {
        const session = window.App?.state?.session;
        if (!session) return alert("Vous devez être connecté pour voter.");

        const db = this.getDb();
        try {
            const { error } = await db.from('feed_poll_votes').insert([{
                poll_id: pollId,
                user_id: session.user.id,
                option_id: optionIndex
            }]);

            if (error) {
                if (error.code === '23505') alert("Vous avez déjà voté pour ce sondage.");
                else throw error;
            } else {
                this.renderFeed(containerId);
            }
        } catch (err) {
            console.error("Erreur vote:", err);
            alert("Erreur lors de l'enregistrement de votre vote.");
        }
    },

    doubleTapLike: async function (postId, containerId, cardEl) {
        const burst = cardEl?.querySelector('.dtc-heart-burst');
        if (burst) {
            burst.style.display = 'flex';
            burst.style.animation = 'dtcHeartBurst 0.6s ease forwards';
            setTimeout(() => { burst.style.display = 'none'; burst.style.animation = ''; }, 600);
        }
        const session = window.App?.state?.session;
        if (!session) return;
        const alreadyLiked = (this.reactions[postId] || []).some(r => r.user_id === session.user.id);
        if (!alreadyLiked) await this.setReaction(postId, 'heart', containerId);
    },

    pinPost: async function (postId, userId, containerId) {
        const db = this.getDb();
        const profile = window.App?.state?.profile;
        const currentPinned = profile?.pinned_post_id;
        const newPinned = currentPinned === postId ? null : postId;

        try {
            const { error } = await db.from('profiles').update({ pinned_post_id: newPinned }).eq('id', userId);
            if (error) throw error;
            if (window.App?.state?.profile) window.App.state.profile.pinned_post_id = newPinned;
            if (window.ChannelModule) window.ChannelModule.renderChannel(userId, 'view-channel');
            else this.renderFeed(containerId);
        } catch (err) {
            console.error('[MomentsModule] Pin Error:', err);
            alert("Erreur lors de l'épinglage.");
        }
    },

    toggleLike: async function (postId, containerId) {
        const session = window.App?.state?.session;
        const hadReaction = session && (this.reactions[postId] || []).some(r => r.user_id === session.user.id);
        await this.setReaction(postId, 'heart', containerId);

        if (!hadReaction && session) {
            try {
                const db = this.getDb();
                const { data: postData } = await db.from('showcase_items').select('user_id').eq('id', postId).single();
                if (postData && postData.user_id !== session.user.id) {
                    const senderName = window.App?.state?.profile?.full_name || 'Quelqu\'un';
                    await db.from('notifications').insert([{
                        user_id: postData.user_id,
                        type: 'like',
                        title: `${senderName} a réagi à votre publication`,
                        message: 'Votre post a reçu une nouvelle réaction.',
                        link: '#moments?post=' + postId,
                        is_read: false
                    }]);
                }
            } catch (e) { /* notification optionnelle */ }
        }
    },

    toggleBookmark: async function (postId, containerId, btnEl) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) { alert('Vous devez être connecté pour sauvegarder.'); return; }

        const isBookmarked = this.bookmarks.includes(postId);
        try {
            if (isBookmarked) {
                await db.from('feed_bookmarks').delete().eq('post_id', postId).eq('user_id', session.user.id);
                this.bookmarks = this.bookmarks.filter(id => id !== postId);
            } else {
                await db.from('feed_bookmarks').insert([{ user_id: session.user.id, post_id: postId }]);
                this.bookmarks.push(postId);
            }
            // Optimistic UI update
            if (btnEl) {
                const svg = btnEl.querySelector('svg');
                if (svg) svg.setAttribute('fill', isBookmarked ? 'none' : 'currentColor');
                btnEl.style.color = isBookmarked ? '' : '#f59e0b';
                btnEl.title = isBookmarked ? 'Sauvegarder' : 'Retirer des favoris';
            }
        } catch (err) {
            console.error('[MomentsModule] Bookmark Error:', err);
            alert('Erreur lors de la sauvegarde.');
        }
    },

    switchFeedMode: function (mode, containerId) {
        this.currentFeedMode = mode;
        this.currentHashtagFilter = null;
        this.renderFeed(containerId);
    },

    addToHighlights: async function (storyId) {
        try {
            const db = this.getDb();
            const { error } = await db.from('showcase_items').update({ is_highlight: true }).eq('id', storyId);
            if (error) throw error;
            alert('Story ajoutée à vos « À la une » !');
            const uid = window.App?.state?.session?.user?.id;
            if (uid && window.ChannelModule) window.ChannelModule.renderChannel(uid, 'view-channel');
        } catch (err) {
            console.error('[MomentsModule] Highlight Error:', err);
            alert('Erreur lors de l\'ajout aux À la une.');
        }
    },

    openHighlightViewer: function (storyId, mediaUrl, isVideo) {
        let viewer = document.getElementById('dtc-story-viewer');
        if (!viewer) {
            viewer = document.createElement('div');
            viewer.id = 'dtc-story-viewer';
            viewer.style.cssText = 'position:fixed; inset:0; background:#000; z-index:99999; display:flex; align-items:center; justify-content:center;';
            document.body.appendChild(viewer);
        }
        const mediaTag = isVideo
            ? `<video src="${mediaUrl}" autoplay controls style="max-width:100%; max-height:90vh; border-radius:12px;"></video>`
            : `<img src="${mediaUrl}" style="max-width:100%; max-height:90vh; border-radius:12px; object-fit:contain;">`;
        viewer.innerHTML = `
            <button onclick="MomentsModule.closeStoryViewer()" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.2); color:white; border:none; width:40px; height:40px; border-radius:50%; font-size:1.2rem; cursor:pointer; z-index:10;">&times;</button>
            <div style="position:absolute; top:20px; left:20px; color:white; font-weight:800; font-size:0.9rem; opacity:0.8;">⭐ À la une</div>
            ${mediaTag}
        `;
        viewer.style.display = 'flex';
    },

    openReactionPicker: function (postId, containerId, evt) {
        if (evt) evt.stopPropagation();
        document.getElementById('dtc-reaction-picker')?.remove();

        const picker = document.createElement('div');
        picker.id = 'dtc-reaction-picker';
        picker.className = 'dtc-reaction-picker';
        picker.style.cssText = 'position:fixed; z-index:100001; background:white; border-radius:100px; padding:8px 14px; box-shadow:0 8px 30px rgba(0,0,0,0.18); display:flex; gap:6px; border:1px solid #e2e8f0;';
        if (evt) {
            picker.style.left = Math.max(8, evt.clientX - 90) + 'px';
            picker.style.top = Math.max(8, evt.clientY - 55) + 'px';
        } else {
            picker.style.left = '50%';
            picker.style.top = '50%';
            picker.style.transform = 'translate(-50%, -50%)';
        }

        Object.entries(this.REACTION_EMOJI).forEach(([type, emoji]) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = emoji;
            btn.style.cssText = 'border:none; background:transparent; font-size:1.5rem; cursor:pointer; padding:4px; border-radius:50%; transition:transform 0.15s;';
            btn.onmouseover = () => btn.style.transform = 'scale(1.3)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
            btn.onclick = (e) => { e.stopPropagation(); this.setReaction(postId, type, containerId); picker.remove(); };
            picker.appendChild(btn);
        });

        document.body.appendChild(picker);
        setTimeout(() => {
            document.addEventListener('click', function closePicker() { picker.remove(); }, { once: true });
        }, 50);
    },

    setReaction: async function (postId, type, containerId, btnElement) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) { alert('Connectez-vous pour réagir.'); return; }

        const userId = session.user.id;
        const existing = (this.reactions[postId] || []).find(r => r.user_id === userId);
        const isLiking = !(existing?.type === type);

        try {
            if (existing?.type === type) {
                await db.from('feed_likes').delete().eq('post_id', postId).eq('user_id', userId);
                this.reactions[postId] = (this.reactions[postId] || []).filter(r => r.user_id !== userId);
            } else if (existing) {
                await db.from('feed_likes').update({ reaction_type: type }).eq('post_id', postId).eq('user_id', userId);
                existing.type = type;
            } else {
                await db.from('feed_likes').insert([{ post_id: postId, user_id: userId, reaction_type: type }]);
                if (!this.reactions[postId]) this.reactions[postId] = [];
                this.reactions[postId].push({ user_id: userId, type: type });
            }

            // Optimistic Global UI Update (no reload)
            const postReactions = this.reactions[postId] || [];
            const likesCount = postReactions.length;
            const hasLiked = postReactions.some(r => r.user_id === userId);
            const userReactionEmoji = hasLiked ? (this.REACTION_EMOJI[type] || '❤️') : '🤍';
            
            // Find ALL heart buttons for this post on the screen
            const heartBtns = document.querySelectorAll(`.dtc-post-card[data-post-id="${postId}"] button[onclick*="toggleLike"]`);
            heartBtns.forEach(btn => {
                btn.innerHTML = `${hasLiked ? '❤️' : '🤍'}<div style="font-size:0.65rem; font-weight:800; margin-top:2px;">${likesCount || ''}</div>`;
            });
            
            // Find detailed reaction picker summaries
            const summaryEls = document.querySelectorAll(`.dtc-post-card[data-post-id="${postId}"] .dtc-reaction-summary`);
            if (summaryEls.length > 0) {
                const reactionSummaryStr = Object.entries(
                    postReactions.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {})
                ).map(([t, count]) => `${this.REACTION_EMOJI[t] || '❤️'} ${count}`).join(' ');
                
                summaryEls.forEach(el => el.innerHTML = reactionSummaryStr || 'Réagir');
            }
            
        } catch (err) {
            console.error('[MomentsModule] Reaction Error:', err);
        }
    },

    _refreshAfterEngagement: function (containerId) {
        if (containerId === 'channel-feed-container' && window.ChannelModule) {
            const uid = new URLSearchParams(window.location.hash.split('?')[1] || '').get('id') || window.App?.state?.session?.user?.id;
            window.ChannelModule.renderChannel(uid, 'view-channel');
        } else {
            this.renderFeed(containerId);
        }
        const detailModal = document.getElementById('dtc-post-detail-modal');
        if (detailModal?.dataset.postId) {
            this.openPostDetail(detailModal.dataset.postId, containerId);
        }
    },

    openPostDetail: async function (postId, containerId) {
        const db = this.getDb();
        try {
            const { data: row, error } = await db.from('showcase_items')
                .select('*, profiles:user_id(full_name, avatar_url, role, territory, title, company_name, channel_avatar_url)')
                .eq('id', postId).single();
            if (error || !row) throw new Error('Publication introuvable');

            const profile = row.profiles || {};
            await this.loadEngagementForPosts([postId], window.App?.state?.session?.user);

            const item = {
                id: row.id,
                userId: row.user_id,
                authorName: profile.full_name || 'Utilisateur',
                authorAvatar: profile.channel_avatar_url || profile.avatar_url,
                authorRole: profile.role || 'prestataire',
                authorTerritory: profile.territory || '',
                authorTitle: profile.title || '',
                authorCompanyName: profile.company_name || '',
                type: row.item_type || 'status',
                title: row.title,
                content: row.description || '',
                imageUrl: row.image_url,
                meta: row.meta_info,
                createdAt: new Date(row.created_at)
            };

            let modal = document.getElementById('dtc-post-detail-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'dtc-post-detail-modal';
                modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(6px); z-index:100000; display:flex; align-items:center; justify-content:center; padding:20px; overflow-y:auto;';
                document.body.appendChild(modal);
            }
            modal.dataset.postId = postId;
            modal.onclick = (e) => { if (e.target === modal) this.closePostDetail(); };

            const currentUser = window.App?.state?.session?.user || null;
            modal.innerHTML = `
                <div style="background:white; border-radius:24px; max-width:640px; width:100%; max-height:90vh; overflow-y:auto; position:relative; box-shadow:0 25px 50px rgba(0,0,0,0.25);" onclick="event.stopPropagation()">
                    <button onclick="MomentsModule.closePostDetail()" style="position:sticky; top:12px; float:right; margin:12px 12px 0 0; background:#f1f5f9; border:none; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; z-index:5;">&times;</button>
                    <div style="padding: 8px 20px 20px; clear:both;">
                        ${this.renderFeedItemHTML(item, currentUser, containerId, true)}
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
            setTimeout(() => this.toggleCommentsSection(postId), 200);
        } catch (err) {
            console.error('[MomentsModule] Post Detail Error:', err);
            alert('Impossible de charger cette publication.');
        }
    },

    closePostDetail: function () {
        const modal = document.getElementById('dtc-post-detail-modal');
        if (modal) {
            modal.style.display = 'none';
            delete modal.dataset.postId;
        }
    },

    sharePost: async function(postId, btn) {
        try {
            const shareUrl = window.location.origin + '/api/share?type=post&id=' + postId;
            if (navigator.share) {
                await navigator.share({
                    title: 'DTC Feed',
                    text: 'Découvrez cette publication sur Domtom Connect !',
                    url: shareUrl
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                const txtNode = Array.from(btn.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) || btn.lastChild;
                if (txtNode) {
                    const originalText = txtNode.textContent;
                    txtNode.textContent = ' Copié !';
                    setTimeout(() => { txtNode.textContent = originalText; }, 2000);
                }
            }
        } catch (err) {
            console.error('Erreur de partage', err);
        }
    },

    repostItem: async function(postId, containerId) {
        const session = window.App?.state?.session;
        if (!session) { alert("Vous devez être connecté pour republier."); return; }

        try {
            const db = this.getDb();
            const { data: originalPost, error: fetchErr } = await db.from('showcase_items').select('*, profiles:user_id(full_name, avatar_url, role, title)').eq('id', postId).single();
            if (fetchErr) throw fetchErr;

            // Create Modal for Quote Repost
            const modalId = 'repost-modal-' + Date.now();
            const modalHtml = `
                <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100000; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; width: 90%; max-width: 500px; border-radius: 24px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                        <h3 style="margin: 0 0 16px 0; font-size: 1.2rem; color: #0f172a; font-weight: 800;">Republier avec une citation</h3>
                        <textarea id="${modalId}-text" rows="3" placeholder="Ajoutez vos propres pensées..." style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-family: inherit; font-size: 1.05rem; outline: none; resize: none; margin-bottom: 16px;"></textarea>
                        
                        <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; background: #f8fafc; margin-bottom: 24px; pointer-events: none;">
                            <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; margin-bottom: 4px;">Post original de ${originalPost.profiles?.full_name || 'Inconnu'}</div>
                            <div style="font-size: 0.9rem; color: #334155;">${(originalPost.description || originalPost.title || '').substring(0, 100)}...</div>
                        </div>

                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button onclick="document.getElementById('${modalId}').remove()" style="padding: 10px 20px; border-radius: 12px; border: none; background: #f1f5f9; color: #64748b; font-weight: 800; cursor: pointer;">Annuler</button>
                            <button id="${modalId}-btn" style="padding: 10px 24px; border-radius: 12px; border: none; background: #3b82f6; color: white; font-weight: 800; cursor: pointer;">Republier</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            document.getElementById(`${modalId}-btn`).onclick = async () => {
                const quoteText = document.getElementById(`${modalId}-text`).value;
                const btn = document.getElementById(`${modalId}-btn`);
                btn.disabled = true;
                btn.innerHTML = 'En cours...';

                try {
                    const originalData = {
                        id: originalPost.id,
                        authorName: originalPost.profiles?.full_name,
                        authorAvatar: originalPost.profiles?.avatar_url,
                        content: originalPost.description || originalPost.title,
                        imageUrl: originalPost.image_url
                    };

                    const { error: insertErr } = await db.from('showcase_items').insert([{
                        user_id: session.user.id,
                        title: 'Repost',
                        description: quoteText,
                        category: 'status',
                        item_type: 'repost',
                        meta_info: JSON.stringify(originalData),
                        status: 'active'
                    }]);

                    if (insertErr) throw insertErr;

                    document.getElementById(modalId).remove();
                    alert("Publication republiée avec succès !");
                    this.renderFeed(containerId);
                } catch (err) {
                    console.error("[MomentsModule] Repost Error:", err);
                    alert("Erreur lors de la republication.");
                    btn.disabled = false;
                    btn.innerHTML = 'Republier';
                }
            };
        } catch (err) {
            console.error("[MomentsModule] Fetch Post Error:", err);
            alert("Erreur de chargement du post d'origine.");
        }
    },

    filterByHashtag: function (tag, containerId) {
        this.currentHashtagFilter = tag;
        this.currentFeedMode = 'all'; // reset to global when filtering by hashtag
        this.renderFeed(containerId);
    },

    clearHashtagFilter: function (containerId) {
        this.currentHashtagFilter = null;
        this.renderFeed(containerId);
    },

    handleMentionInput: async function (input, postId) {
        const text = input.value;
        const atIndex = text.lastIndexOf('@');
        if (atIndex === -1) {
            const res = document.getElementById(`mention-results-${postId}`);
            if (res) res.style.display = 'none';
            return;
        }
        const query = text.substring(atIndex + 1);
        if (query.length < 2) {
            const res = document.getElementById(`mention-results-${postId}`);
            if (res) res.style.display = 'none';
            return;
        }
        const db = this.getDb();
        const { data } = await db.from('profiles').select('id, full_name, avatar_url').ilike('full_name', `%${query}%`).limit(5);
        const res = document.getElementById(`mention-results-${postId}`);
        if (!res || !data || data.length === 0) { if (res) res.style.display = 'none'; return; }
        res.style.display = 'block';
        res.innerHTML = data.map(u => `
            <div onclick="MomentsModule.insertMention('${postId}', '${u.full_name.replace(/'/g, "\\'")}')" style="display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; cursor:pointer;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background=''">
                <div style="width:28px; height:28px; border-radius:50%; background:#0f172a; overflow:hidden; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${u.avatar_url ? `<img src="${u.avatar_url}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fas fa-user" style="color:white; font-size:0.7rem;"></i>'}</div>
                <span style="font-weight:700; font-size:0.9rem; color:#0f172a;">${u.full_name}</span>
            </div>`).join('');
    },

    insertMention: function (postId, name) {
        const input = document.getElementById(`comment-input-${postId}`);
        if (!input) return;
        const text = input.value;
        const atIndex = text.lastIndexOf('@');
        input.value = text.substring(0, atIndex) + `@${name} `;
        const res = document.getElementById(`mention-results-${postId}`);
        if (res) res.style.display = 'none';
        input.focus();
    },

    toggleCommentsSection: function (postId) {
        const el = document.getElementById(`comments-section-${postId}`);
        if (el) {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    },

    toggleFollow: async function (targetUserId, btnElement, authorName) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) {
            alert("Vous devez être connecté pour vous abonner.");
            return;
        }

        const currentUserId = session.user.id;
        const isCurrentlyFollowing = this.subscriptions && this.subscriptions.includes(targetUserId);

        try {
            // Optimistic UI Update
            if (isCurrentlyFollowing) {
                // Unfollow
                this.subscriptions = this.subscriptions.filter(id => id !== targetUserId);
                btnElement.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Suivre`;
                btnElement.style.background = '';
                btnElement.style.color = '';
                btnElement.style.border = '';

                await db.from('user_subscriptions').delete().eq('follower_id', currentUserId).eq('following_id', targetUserId);
            } else {
                // Follow
                if (!this.subscriptions) this.subscriptions = [];
                this.subscriptions.push(targetUserId);
                btnElement.innerHTML = `<i class="fas fa-check" style="margin-right: 4px;"></i> Abonné`;
                btnElement.style.background = '#f1f5f9';
                btnElement.style.color = '#64748b';
                btnElement.style.border = '1px solid #e2e8f0';

                await db.from('user_subscriptions').insert([{ follower_id: currentUserId, following_id: targetUserId }]);

                // Notification réelle au profil suivi
                try {
                    const senderName = window.App?.state?.profile?.full_name || 'Quelqu\'un';
                    await db.from('notifications').insert([{
                        user_id: targetUserId,
                        type: 'follower',
                        title: `${senderName} s'est abonné à votre chaîne`,
                        message: 'Vous avez un nouvel abonné sur votre chaîne DTC.',
                        link: `#channel?id=${currentUserId}`,
                        is_read: false
                    }]);
                } catch (notifErr) { console.warn('Notif follow error:', notifErr.message); }
            }
        } catch (err) {
            console.error("[MomentsModule] Follow Error:", err);
            alert("Une erreur est survenue.");
        }
    },

    deleteComment: async function(commentId, postId, containerId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) return;
        try {
            const { error } = await db.from('feed_comments').delete().eq('id', commentId).eq('user_id', session.user.id);
            if (error) throw error;
            this._refreshAfterEngagement(containerId);
        } catch(e) {
            console.error('Erreur suppression commentaire', e);
            alert('Impossible de supprimer ce commentaire.');
        }
    },

    replyToComment: function (postId, commentId, authorName) {
        const input = document.getElementById(`comment-input-${postId}`);
        if (input) {
            input.value = `@${authorName} `;
            input.dataset.parentId = commentId;
            input.focus();

            const el = document.getElementById(`comments-section-${postId}`);
            if (el && el.style.display === 'none') {
                el.style.display = 'block';
            }
        }
    },

    submitComment: async function (postId, containerId) {
        const input = document.getElementById(`comment-input-${postId}`);
        if (!input || !input.value.trim()) return;

        const text = input.value.trim();
        const parentId = input.dataset.parentId || null;

        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) return;

        try {
            const { error } = await db.from('feed_comments').insert([{
                post_id: postId,
                user_id: session.user.id,
                content: text,
                parent_id: parentId
            }]);

            if (error) throw error;

            // Envoyer une notification réelle au propriétaire du post
            try {
                const { data: postData } = await db.from('showcase_items').select('user_id').eq('id', postId).single();
                if (postData && postData.user_id !== session.user.id) {
                    const senderName = window.App?.state?.profile?.full_name || 'Quelqu\'un';
                    await db.from('notifications').insert([{
                        user_id: postData.user_id,
                        type: 'comment',
                        title: `${senderName} a commenté votre publication`,
                        message: text.length > 60 ? text.substring(0, 60) + '...' : text,
                        link: '#moments',
                        is_read: false
                    }]);
                }
                // Notifier les personnes mentionnées (@pseudo)
                const mentions = text.match(/@([\w\s]+?)(?=\s|$)/g);
                if (mentions) {
                    for (const mention of mentions) {
                        const mentionName = mention.slice(1).trim();
                        const { data: mentionedUser } = await db.from('profiles').select('id').ilike('full_name', mentionName).single();
                        if (mentionedUser && mentionedUser.id !== session.user.id) {
                            const senderName = window.App?.state?.profile?.full_name || 'Quelqu\'un';
                            await db.from('notifications').insert([{
                                user_id: mentionedUser.id,
                                type: 'comment',
                                title: `${senderName} vous a mentionné`,
                                message: text.length > 60 ? text.substring(0, 60) + '...' : text,
                                link: '#moments',
                                is_read: false
                            }]);
                        }
                    }
                }
            } catch (notifErr) { console.warn('Notif comment error:', notifErr.message); }

            input.value = '';
            delete input.dataset.parentId;
            const mentionRes = document.getElementById(`mention-results-${postId}`);
            if (mentionRes) mentionRes.style.display = 'none';

            // Refresh feed
            if (containerId === 'channel-feed-container' && window.ChannelModule) {
                const currentChannelId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                window.ChannelModule.renderChannel(currentChannelId, 'view-channel');
            } else {
                this.renderFeed(containerId);
            }
        } catch (err) {
            console.error("[MomentsModule] Comment Error:", err);
            alert("Erreur lors de l'envoi du commentaire : " + err.message);
        }
    },

    reportPost: async function (itemId) {
        const session = window.App?.state?.session;
        if (!session?.user) {
            alert("Vous devez être connecté pour signaler une publication.");
            return;
        }

        const reason = prompt("Pour quelle raison souhaitez-vous signaler cette publication ? (spam, haine, inapproprié...)");
        if (!reason || reason.trim() === '') return;

        try {
            const db = this.getDb();
            const { error } = await db.from('post_reports').insert([{
                post_id: itemId,
                reporter_id: session.user.id,
                reason: reason.trim()
            }]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    alert("Vous avez déjà signalé cette publication.");
                } else {
                    console.error("Report error:", error);
                    alert("Erreur lors du signalement. Veuillez réessayer.");
                }
            } else {
                alert("Merci. Votre signalement a été enregistré et sera examiné par nos modérateurs.");
            }
        } catch (e) {
            console.error("Error reporting post:", e);
            alert("Erreur lors du signalement.");
        }
    },

    openEditPostModal: async function(itemId, type, containerId) {
        try {
            const db = this.getDb();
            const table = type === 'project' ? 'projects' : 'showcase_items';
            const { data, error } = await db.from(table).select('description').eq('id', itemId).single();
            if (error) throw error;
            
            const modalId = 'dtc-edit-post-modal';
            let existing = document.getElementById(modalId);
            if (existing) existing.remove();

            const modalHtml = `
                <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100000; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; border-radius: 20px; width: 90%; max-width: 500px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); position: relative;">
                        <button onclick="document.getElementById('${modalId}').remove()" style="position: absolute; right: 16px; top: 16px; background: #f1f5f9; border: none; font-size: 1.2rem; color: #64748b; cursor: pointer; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">&times;</button>
                        <h3 style="margin-top: 0; color: #0f172a; font-size: 1.25rem;">Modifier la publication</h3>
                        <textarea id="${modalId}-textarea" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; min-height: 150px; font-family: inherit; font-size: 1rem; margin-bottom: 16px; outline: none; resize: vertical;">${data.description || ''}</textarea>
                        <div style="display: flex; justify-content: flex-end; gap: 8px;">
                            <button onclick="document.getElementById('${modalId}').remove()" style="padding: 10px 16px; border-radius: 10px; border: none; background: #f1f5f9; color: #64748b; font-weight: 700; cursor: pointer;">Annuler</button>
                            <button id="${modalId}-save-btn" style="padding: 10px 20px; border-radius: 10px; border: none; background: #3b82f6; color: white; font-weight: 700; cursor: pointer;">Enregistrer</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            document.getElementById(`${modalId}-save-btn`).onclick = async () => {
                const newDesc = document.getElementById(`${modalId}-textarea`).value;
                document.getElementById(`${modalId}-save-btn`).innerText = 'Sauvegarde...';
                document.getElementById(`${modalId}-save-btn`).disabled = true;
                
                const { error: updateErr } = await db.from(table).update({ description: newDesc }).eq('id', itemId);
                if (updateErr) {
                    alert("Erreur lors de la modification.");
                    console.error(updateErr);
                    document.getElementById(`${modalId}-save-btn`).innerText = 'Enregistrer';
                    document.getElementById(`${modalId}-save-btn`).disabled = false;
                } else {
                    document.getElementById(modalId).remove();
                    if (containerId === 'channel-feed-container' && window.ChannelModule) {
                        const currentChannelId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                        window.ChannelModule.renderChannel(currentChannelId, 'view-channel');
                    } else {
                        this.renderFeed(containerId);
                    }
                }
            };
        } catch(e) {
            console.error(e);
            alert("Erreur lors de la récupération de la publication.");
        }
    },

    deletePost: async function (itemId, type, containerId) {
        if (!confirm("Voulez-vous vraiment supprimer cette publication ?")) return;

        try {
            const db = this.getDb();
            const table = type === 'project' ? 'projects' : 'showcase_items';

            const { error } = await db
                .from(table)
                .delete()
                .eq('id', itemId);

            if (error) throw error;

            alert("Publication supprimée.");
            if (containerId === 'channel-feed-container' && window.ChannelModule) {
                const currentChannelId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                window.ChannelModule.renderChannel(currentChannelId, 'view-channel');
            } else {
                this.renderFeed(containerId);
            }
        } catch (err) {
            console.error("[MomentsModule] Delete Error:", err);
            alert("Erreur lors de la suppression.");
        }
    },

    joinNativeLive: function (roomId) {
        if (typeof JitsiMeetExternalAPI === 'undefined') {
            return alert("L'API de Live n'est pas chargée.");
        }

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = '#000';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';

        const header = document.createElement('div');
        header.style.padding = '16px 24px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.background = 'rgba(0,0,0,0.8)';
        header.innerHTML = `
            <div style="color:white; font-weight:800; display:flex; align-items:center; gap:8px;">
                <span style="background:#ef4444; width:12px; height:12px; border-radius:50%; display:inline-block; animation: pulse 1.5s infinite;"></span>
                EN DIRECT
            </div>
            <button id="leave-live-btn" style="background:#334155; color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Quitter le Live</button>
        `;

        const container = document.createElement('div');
        container.style.flex = '1';

        overlay.appendChild(header);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        const domain = 'meet.jit.si';
        const options = {
            roomName: roomId,
            parentNode: container,
            userInfo: {
                displayName: window.App?.state?.profile?.full_name || 'Spectateur'
            },
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                disableDeepLinking: true
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: ['chat', 'settings']
            }
        };

        const api = new JitsiMeetExternalAPI(domain, options);

        document.getElementById('leave-live-btn').onclick = () => {
            api.dispose();
            document.body.removeChild(overlay);
        };
    },

    getRelativeTime: function (dateInput) {
        if (!dateInput) return '';
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `${diffMins} min`;
        if (diffHours < 24) return `${diffHours} h`;
        if (diffDays < 7) return `${diffDays} j`;

        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    },

    applyFeedPrompt: function (type) {
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
