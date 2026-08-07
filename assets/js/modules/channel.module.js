/**
 * Channel Module - Domtom Connect
 * Universal User Channel/Profile page (TikTok/IG style)
 */

window.ChannelModule = {
    currentTab: 'posts',

    getDb: function() {
        return window.App?.supabase || window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
    },

    getRelativeTime: function(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `il y a ${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)}min`;
        if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 2592000) return `il y a ${Math.floor(diffInSeconds / 86400)}j`;
        if (diffInSeconds < 31536000) return `il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
        return `il y a ${Math.floor(diffInSeconds / 31536000)} ans`;
    },

    renderChannel: async function(userId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:300px; color:#94a3b8; font-weight:800;">
                <i class="fas fa-circle-notch fa-spin fa-2x"></i>
            </div>
        `;

        try {
            const db = this.getDb();
            const session = window.App?.state?.session;
            const currentUserId = session ? session.user.id : null;

            // Fallback to current user if no ID is specified
            if (!userId) {
                userId = currentUserId;
            }

            if (!userId) {
                container.innerHTML = `<div style="padding:40px; text-align:center; color:#64748b; font-weight:700;">Utilisateur non spécifié et non connecté.</div>`;
                return;
            }

            // 1. Fetch target user profile
            const { data: profile, error: profileErr } = await db.from('profiles').select('*').eq('id', userId).single();
            if (profileErr || !profile) throw new Error("Profil introuvable");

            // 3. Fetch Subscribers Count (Followers)
            const { data: followersData } = await db.from('user_subscriptions').select('follower_id').eq('following_id', userId);
            const followersCount = followersData ? followersData.length : 0;

            // 4. Fetch Following Count
            const { data: followingData } = await db.from('user_subscriptions').select('following_id').eq('follower_id', userId);
            const followingCount = followingData ? followingData.length : 0;

            // 5. Check if current user is following target user
            let isFollowing = false;
            if (currentUserId) {
                const { data: followCheck } = await db.from('user_subscriptions')
                    .select('*')
                    .eq('follower_id', currentUserId)
                    .eq('following_id', userId)
                    .single();
                if (followCheck) isFollowing = true;
            }

            // 6. Fetch user posts (Feed)
            const { data: rawPosts } = await db.from('showcase_items')
                .select('*')
                .eq('user_id', userId)
                .in('category', ['status', 'story'])
                .order('created_at', { ascending: false });

            // Stories « À la une » (permanentes, style Instagram Highlights)
            const { data: rawHighlights } = await db.from('showcase_items')
                .select('id, image_url, title, created_at')
                .eq('user_id', userId)
                .eq('category', 'story')
                .eq('is_highlight', true)
                .order('created_at', { ascending: false })
                .limit(12);

            // Ensure MomentsModule is ready for likes/comments context
            if (window.MomentsModule) {
                window.MomentsModule.likes = window.MomentsModule.likes || {};
                window.MomentsModule.comments = window.MomentsModule.comments || {};
                // Also ensure MomentsModule knows about subscriptions
                if (!window.MomentsModule.subscriptions && currentUserId) {
                    const { data: rawSubs } = await db.from('user_subscriptions').select('following_id').eq('follower_id', currentUserId);
                    if (rawSubs) window.MomentsModule.subscriptions = rawSubs.map(s => s.following_id);
                }
            }

            const isSelf = currentUserId === userId;
            const authorRole = profile.role || 'Citoyen';
            const authorTitle = profile.expertise || profile.company_name || '';

            const escapeHTML = (str) => {
                if (!str) return '';
                return str.replace(/[&<>'"]/g, tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag]));
            };

            const cName = escapeHTML(profile.channel_name || profile.full_name || '');
            const cBio = escapeHTML(profile.channel_bio || '');
            const cBanner = profile.channel_banner_url || profile.banner_url || '';
            const cAvatar = profile.channel_avatar_url || profile.avatar_url || '';

            // Map posts for MomentsModule (hors stories)
            let feedItems = (rawPosts || [])
                .filter(p => p.category !== 'story')
                .map(p => ({
                    id: p.id,
                    userId: p.user_id,
                    authorName: cName,
                    authorAvatar: cAvatar,
                    authorRole: authorRole,
                    authorTitle: authorTitle,
                    content: p.description,
                    imageUrl: p.image_url,
                    category: p.category,
                    type: p.item_type || 'status',
                    createdAt: p.created_at,
                    meta: p.meta_info,
                    isPinned: profile.pinned_post_id === p.id
                }));

            // Post épinglé en premier (style Twitter/X)
            if (profile.pinned_post_id) {
                feedItems.sort((a, b) => {
                    if (a.id === profile.pinned_post_id) return -1;
                    if (b.id === profile.pinned_post_id) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            }

            // Charger likes, commentaires, sondages
            if (window.MomentsModule && feedItems.length > 0) {
                await window.MomentsModule.loadEngagementForPosts(
                    feedItems.map(i => i.id),
                    session ? session.user : null
                );
            }

            const postsHtml = window.MomentsModule
                ? feedItems.map(item => window.MomentsModule.renderFeedItemHTML(item, session ? session.user : null, 'channel-feed-container')).join('')
                : '';

            const highlightsHtml = (rawHighlights && rawHighlights.length > 0) ? `
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">À la une</div>
                    <div style="display: flex; gap: 14px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
                        ${rawHighlights.map((h, i) => {
                            const isVid = h.image_url && h.image_url.match(/\.(mp4|mov|webm)($|\?)/i);
                            const thumb = isVid
                                ? `<video src="${h.image_url}" style="width:100%; height:100%; object-fit:cover;"></video>`
                                : `<img src="${h.image_url}" style="width:100%; height:100%; object-fit:cover;">`;
                            return `
                            <div style="flex-shrink:0; width:72px; display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer;" onclick="window.MomentsModule.openHighlightViewer('${h.id}', '${h.image_url}', ${isVid ? 'true' : 'false'})">
                                <div style="width:64px; height:64px; border-radius:50%; border:2px solid #cbd5e1; overflow:hidden; background:#f1f5f9;">${thumb}</div>
                                <span style="font-size:0.68rem; font-weight:700; color:#475569; max-width:72px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${(h.title || 'Story').replace('Story: ', '').substring(0, 10)}</span>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            ` : '';

            let html = `
                <style>
                    .channel-layout { max-width: 1100px; margin: 0 auto; min-height: 100vh; position: relative; }
                    .channel-banner { height: 220px; background: linear-gradient(135deg, #cbd5e1, #94a3b8); position: relative; border-radius: 0 0 24px 24px; overflow: hidden; }
                    .channel-body { display: grid; grid-template-columns: 1fr; gap: 24px; padding: 0 16px; margin-top: -60px; }
                    .channel-sidebar { background: white; border-radius: 24px; padding: 32px 24px 24px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08); position: relative; z-index: 10; text-align: center; margin-bottom: 24px; border: 1px solid rgba(0,0,0,0.02); }
                    .channel-feed-col { padding-top: 60px; }
                    @media(min-width: 860px) {
                        .channel-body { grid-template-columns: 340px 1fr; padding: 0 24px; align-items: start; }
                        .channel-sidebar { position: sticky; top: 24px; margin-bottom: 0; }
                    }
                </style>
                <div class="channel-layout">
                    <div class="channel-banner">
                        ${cBanner ? `<img src="${cBanner}" style="width:100%; height:100%; object-fit:cover;">` : ''}
                        <button onclick="window.history.back()" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);"><i class="fas fa-arrow-left"></i></button>
                    </div>

                    <div class="channel-body">
                        <div class="channel-sidebar">
                            <div style="width: 120px; height: 120px; border-radius: 50%; background: #0f172a; margin: 0 auto; border: 6px solid white; overflow: hidden; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: 800; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: -80px;">
                                ${cAvatar ? `<img src="${cAvatar}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user"></i>'}
                            </div>
                            <h1 style="font-size: 1.6rem; font-weight: 900; color: #0f172a; margin: 16px 0 4px 0; letter-spacing: -0.02em;">${cName}</h1>
                            <p style="font-size: 0.95rem; color: #64748b; font-weight: 600; margin: 0;">@${cName.replace(/\s+/g, '').toLowerCase()}</p>
                            <div style="display: flex; justify-content: center; gap: 24px; margin: 24px 0; padding: 16px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">${followingCount}</div>
                                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Abonnements</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">${followersCount}</div>
                                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Abonnés</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">${feedItems.length}</div>
                                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Posts</div>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 24px;">
                                ${isSelf ? `
                                    <button onclick="window.ChannelModule.openSettingsModal()" style="padding: 10px 24px; border-radius: 12px; background: #f1f5f9; color: #0f172a; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; width: 100%; transition: background 0.2s;"><i class="fas fa-cog" style="margin-right: 6px;"></i> Paramètres</button>
                                ` : `
                                    <button id="channel-follow-btn" onclick="window.ChannelModule.toggleFollow('${userId}', this)" style="padding: 10px 32px; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; border: none; flex: 1; transition: all 0.2s; ${isFollowing ? 'background: #f1f5f9; color: #0f172a;' : 'background: #0f172a; color: white;'}">
                                        ${isFollowing ? '<i class="fas fa-check" style="margin-right: 6px;"></i>Abonné' : "S'abonner"}
                                    </button>
                                    <button onclick="window.Router.navigate('#messages?to=${userId}&context=channel&prefill=${encodeURIComponent('Bonjour, je vous contacte depuis votre chaîne : ')}')  " style="padding: 10px 16px; border-radius: 12px; background: #f1f5f9; color: #0f172a; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; transition: background 0.2s;"><i class="fas fa-comment-alt"></i></button>
                                `}
                            </div>
                            ${cBio ? `
                                <div style="text-align: left; font-size: 0.95rem; color: #334155; line-height: 1.6; margin-top: 16px; font-weight: 500;">
                                    ${cBio.replace(/\n/g, '<br>')}
                                </div>
                            ` : `<div style="text-align: left; font-size: 0.95rem; color: #94a3b8; font-style: italic; margin-top: 16px;">Aucune biographie.</div>`}
                        </div>

                        <!-- TABS -->
                        <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 24px;">
                            <button onclick="window.ChannelModule.switchTab('posts', '${userId}')" style="background: none; border: none; padding: 12px 0; font-size: 1.05rem; font-weight: 800; cursor: pointer; color: ${this.currentTab === 'posts' ? '#0f172a' : '#94a3b8'}; border-bottom: 3px solid ${this.currentTab === 'posts' ? '#0f172a' : 'transparent'}; transition: all 0.2s;">Publications</button>
                            <button onclick="window.ChannelModule.switchTab('about', '${userId}')" style="background: none; border: none; padding: 12px 0; font-size: 1.05rem; font-weight: 800; cursor: pointer; color: ${this.currentTab === 'about' ? '#0f172a' : '#94a3b8'}; border-bottom: 3px solid ${this.currentTab === 'about' ? '#0f172a' : 'transparent'}; transition: all 0.2s;">À propos</button>
                        </div>

                        <div class="channel-feed-col">
                            ${this.currentTab === 'posts' ? `
                            ${highlightsHtml}
                            <div id="channel-feed-container" style="display: flex; flex-direction: column; gap: 20px;">
                                ${postsHtml || '<div style="text-align:center; padding: 40px; color: #94a3b8; font-weight:600; background: white; border-radius: 24px; border: 1px solid rgba(0,0,0,0.02);">Aucune publication pour le moment.</div>'}
                            </div>
                            ` : `
                            <div style="background: white; border-radius: 24px; padding: 32px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                    <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #0f172a;">À propos</h3>
                                    ${isSelf ? `<button onclick="window.ChannelModule.editAbout()" style="background: none; border: none; color: #3b82f6; font-weight: 800; cursor: pointer; font-size: 0.95rem;">Modifier</button>` : ''}
                                </div>
                                <div id="channel-about-content" style="font-size: 1rem; color: #334155; line-height: 1.7; white-space: pre-line;">
                                    ${profile.about_text || 'Aucune information supplémentaire pour le moment.'}
                                </div>
                                ${isSelf ? `
                                <div id="channel-about-editor" style="display: none; margin-top: 16px;">
                                    <textarea id="channel-about-input" rows="6" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-family: inherit; font-size: 1rem; resize: vertical; outline: none; margin-bottom: 12px;">${profile.about_text || ''}</textarea>
                                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                        <button onclick="window.ChannelModule.cancelEditAbout()" style="padding: 8px 16px; border-radius: 8px; border: none; background: #f1f5f9; color: #64748b; font-weight: 700; cursor: pointer;">Annuler</button>
                                        <button onclick="window.ChannelModule.saveAbout('${userId}')" style="padding: 8px 16px; border-radius: 8px; border: none; background: #3b82f6; color: white; font-weight: 700; cursor: pointer;">Enregistrer</button>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;
        } catch (err) {
            console.error("[ChannelModule] Render error:", err);
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #ef4444; font-weight: 700;">
                    Erreur lors du chargement de la chaîne : ${err.message}
                </div>
            `;
        }
    },

    switchTab: function(tab, userId) {
        this.currentTab = tab;
        this.renderChannel(userId, 'view-channel');
    },

    editAbout: function() {
        document.getElementById('channel-about-content').style.display = 'none';
        document.getElementById('channel-about-editor').style.display = 'block';
    },

    cancelEditAbout: function() {
        document.getElementById('channel-about-content').style.display = 'block';
        document.getElementById('channel-about-editor').style.display = 'none';
    },

    saveAbout: async function(userId) {
        const text = document.getElementById('channel-about-input').value;
        try {
            const db = this.getDb();
            const { error } = await db.from('profiles').update({ about_text: text }).eq('id', userId);
            if (error) throw error;
            this.renderChannel(userId, 'view-channel');
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement.");
        }
    },

    openSettingsModal: function() {
        let modal = document.getElementById('channel-settings-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'channel-settings-modal';
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center; overflow-y:auto; padding: 20px;';
            document.body.appendChild(modal);
        }
        const profile = window.App.state.profile || {};
        
        const db = this.getDb();
        db.from('profiles').select('*').eq('id', profile.id).single().then(({data: userProfile, error}) => {
            const p = userProfile || profile;
            modal.innerHTML = `
                <div style="background: white; border-radius: 24px; width: 100%; max-width: 500px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto;">
                    <button onclick="document.getElementById('channel-settings-modal').style.display='none'" style="position: absolute; top: 20px; right: 20px; background: transparent; border: none; font-size: 1.5rem; color: #64748b; cursor: pointer;">&times;</button>
                    <h2 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 24px;">Paramètres de la Chaîne</h2>
                    
                    <label style="display:block; font-weight:700; color:#334155; margin-bottom:8px;">Nom de la chaîne</label>
                    <input type="text" id="channel-name-input" value="${p.channel_name || p.full_name || ''}" placeholder="Ex: Cabinet Stratégique" style="width:100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; font-size:1rem; font-family:inherit;">
                    
                    <label style="display:block; font-weight:700; color:#334155; margin-bottom:8px;">Biographie de la chaîne</label>
                    <textarea id="channel-bio-input" rows="3" placeholder="Décrivez votre chaîne ou votre activité..." style="width:100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; font-size:1rem; font-family:inherit; resize:vertical;">${p.channel_bio || ''}</textarea>
                    
                    <label style="display:block; font-weight:700; color:#334155; margin-bottom:8px;">Avatar de la chaîne (optionnel)</label>
                    <div style="position: relative; margin-bottom: 20px;">
                        <input type="file" id="channel-avatar-input" accept="image/*" style="opacity: 0; position: absolute; top:0; left:0; width:100%; height:100%; cursor: pointer;" onchange="document.getElementById('avatar-file-name').textContent = this.files[0]?.name || 'Cliquez pour choisir une image'">
                        <div style="background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; color: #64748b; font-size: 0.9rem; font-weight: 600; pointer-events: none;">
                            <i class="fas fa-image" style="font-size: 1.5rem; margin-bottom: 8px; color: #10b981; display:block;"></i>
                            <span id="avatar-file-name">Cliquez pour choisir une image</span>
                        </div>
                    </div>

                    <label style="display:block; font-weight:700; color:#334155; margin-bottom:8px;">Bannière de la chaîne</label>
                    <div style="position: relative; margin-bottom: 24px;">
                        <input type="file" id="channel-banner-input" accept="image/*" style="opacity: 0; position: absolute; top:0; left:0; width:100%; height:100%; cursor: pointer;" onchange="document.getElementById('banner-file-name').textContent = this.files[0]?.name || 'Cliquez pour choisir une image'">
                        <div style="background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; color: #64748b; font-size: 0.9rem; font-weight: 600; pointer-events: none;">
                            <i class="fas fa-panorama" style="font-size: 1.5rem; margin-bottom: 8px; color: #10b981; display:block;"></i>
                            <span id="banner-file-name">Cliquez pour choisir une image</span>
                        </div>
                    </div>

                    <button onclick="window.ChannelModule.saveSettings(this)" style="width:100%; background: #0f172a; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 1.05rem; cursor: pointer;">Enregistrer les modifications</button>
                </div>
            `;
            modal.style.display = 'flex';
        }).catch(err => {
            console.error("Error loading settings modal:", err);
            alert("Erreur lors de l'ouverture des paramètres.");
        });
    },

    saveSettings: async function(btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
        btn.disabled = true;

        const name = document.getElementById('channel-name-input').value.trim();
        const bio = document.getElementById('channel-bio-input').value.trim();
        const avatarFile = document.getElementById('channel-avatar-input').files[0];
        const bannerFile = document.getElementById('channel-banner-input').files[0];
        
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) return;

        try {
            let channel_avatar_url = window.App.state.profile.channel_avatar_url;
            let channel_banner_url = window.App.state.profile.channel_banner_url || null;

            // Upload Avatar if changed
            if (avatarFile) {
                const ext = avatarFile.name.split('.').pop();
                const path = `avatars/${session.user.id}_${Date.now()}.${ext}`;
                await db.storage.from('showcase').upload(path, avatarFile);
                channel_avatar_url = db.storage.from('showcase').getPublicUrl(path).data.publicUrl;
            }

            // Upload Banner if changed
            if (bannerFile) {
                const ext = bannerFile.name.split('.').pop();
                const path = `banners/${session.user.id}_${Date.now()}.${ext}`;
                await db.storage.from('showcase').upload(path, bannerFile);
                channel_banner_url = db.storage.from('showcase').getPublicUrl(path).data.publicUrl;
            }

            // Update profiles table
            const updatePayload = { channel_name: name, channel_bio: bio };
            if (avatarFile) updatePayload.channel_avatar_url = channel_avatar_url;
            if (bannerFile) updatePayload.channel_banner_url = channel_banner_url;

            const { error: updateErr } = await db.from('profiles').update(updatePayload).eq('id', session.user.id);
            if (updateErr) throw updateErr;
            
            // Update local state
            if (window.App.state.profile) {
                window.App.state.profile.channel_name = name;
                window.App.state.profile.channel_bio = bio;
                if (avatarFile) window.App.state.profile.channel_avatar_url = channel_avatar_url;
                if (bannerFile) window.App.state.profile.channel_banner_url = channel_banner_url;
            }
            
            document.getElementById('channel-settings-modal').style.display = 'none';
            // Reload channel
            window.ChannelModule.renderChannel(session.user.id, 'view-channel');
        } catch (err) {
            console.error("Save Settings Error:", err);
            alert("Erreur lors de l'enregistrement: " + err.message);
            btn.innerHTML = 'Enregistrer les modifications';
            btn.disabled = false;
        }
    },

    toggleFollow: async function(targetUserId, btnElement) {
        if (window.MomentsModule && typeof window.MomentsModule.toggleFollow === 'function') {
            await window.MomentsModule.toggleFollow(targetUserId, btnElement, '');
            // Update button styles specific to channel view after toggle
            if (btnElement.innerText.includes('Abonné')) {
                btnElement.style.background = '#f1f5f9';
                btnElement.style.color = '#0f172a';
                btnElement.style.border = '1px solid #e2e8f0';
                btnElement.style.boxShadow = 'none';
            } else {
                btnElement.style.background = '#ef4444';
                btnElement.style.color = 'white';
                btnElement.style.border = 'none';
                btnElement.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.3)';
                btnElement.innerHTML = "S'abonner"; // Reset text without icon
            }
        }
    },

    startNativeLive: async function() {
        const session = window.App?.state?.session;
        if (!session) return alert("Vous devez être connecté.");
        const userId = session.user.id;
        const profile = window.App.state.profile;
        const roomId = 'dtc_live_' + Date.now() + '_' + userId;
        
        // Ensure Jitsi API is loaded
        if (typeof JitsiMeetExternalAPI === 'undefined') {
            return alert("L'API de Live (Jitsi) n'est pas chargée. Vérifiez votre connexion.");
        }

        // Create Fullscreen Overlay for Broadcaster
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
                LIVE EN COURS
            </div>
            <button id="end-live-btn" style="background:#ef4444; color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Terminer le Live</button>
            <style>@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }</style>
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
                displayName: profile.full_name
            },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableDeepLinking: true
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'chat', 'settings']
            }
        };

        const api = new JitsiMeetExternalAPI(domain, options);

        // Save Live to Database
        let createdPostId = null;
        try {
            const db = this.getDb();
            const { data, error } = await db.from('showcase_items').insert([{
                user_id: userId,
                title: `Live de ${profile.full_name}`,
                description: "Je suis en direct ! Rejoignez-moi.",
                category: 'status',
                item_type: 'live',
                meta_info: JSON.stringify({ roomId: roomId }),
                status: 'active',
                price: 0
            }]).select();
            
            if (!error && data && data.length > 0) {
                createdPostId = data[0].id;
            }
        } catch(e) {
            console.error("Live DB Error:", e);
        }

        // Handle End Live
        document.getElementById('end-live-btn').onclick = async () => {
            if(confirm("Voulez-vous vraiment terminer ce live ?")) {
                api.dispose();
                document.body.removeChild(overlay);
                
                // Update DB to ended
                if (createdPostId) {
                    try {
                        const db = this.getDb();
                        await db.from('showcase_items').update({ status: 'ended' }).eq('id', createdPostId);
                    } catch(e) {}
                }
                
                // Refresh channel
                const currentChannelId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                window.ChannelModule.renderChannel(currentChannelId, 'view-channel');
            }
        };
    }
};
