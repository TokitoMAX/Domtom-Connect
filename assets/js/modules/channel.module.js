/**
 * Channel Module - Domtom Connect
 * Universal User Channel/Profile page (TikTok/IG style)
 */

window.ChannelModule = {
    getDb: function() {
        return window.App?.supabase || window.supabase;
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

        if (!userId) {
            container.innerHTML = `<div style="padding:40px; text-align:center; color:#64748b; font-weight:700;">Utilisateur non spécifié.</div>`;
            return;
        }

        container.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:300px; color:#94a3b8; font-weight:800;">
                <i class="fas fa-circle-notch fa-spin fa-2x"></i>
            </div>
        `;

        try {
            const db = this.getDb();
            const session = window.App?.state?.session;
            const currentUserId = session ? session.user.id : null;

            // 1. Fetch target user profile
            const { data: profile, error: profileErr } = await db.from('profiles').select('*').eq('id', userId).single();
            if (profileErr || !profile) throw new Error("Profil introuvable");

            // 2. Fetch target user showcase (Bio, expertise...)
            const { data: showcase } = await db.from('showcase_profiles').select('*').eq('id', userId).single();

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
            const authorRole = showcase ? showcase.role : profile.role || 'Citoyen';
            const authorTitle = showcase ? showcase.expertise || showcase.company_name : '';

            // Map posts for MomentsModule
            const feedItems = (rawPosts || []).map(p => ({
                id: p.id,
                userId: p.user_id,
                authorName: profile.full_name,
                authorAvatar: profile.avatar_url,
                authorRole: authorRole,
                authorTitle: authorTitle,
                content: p.description,
                imageUrl: p.image_url,
                category: p.category,
                type: p.item_type || 'status',
                createdAt: p.created_at,
                meta: p.meta_info
            }));

            // HTML Structure
            let html = `
                <div style="max-width: 800px; margin: 0 auto; background: white; min-height: 100vh; position: relative;">
                    
                    <!-- Cover Photo -->
                    <div style="height: 200px; background: linear-gradient(135deg, #cbd5e1, #94a3b8); position: relative;">
                        ${showcase && showcase.banner_url ? `<img src="${showcase.banner_url}" style="width:100%; height:100%; object-fit:cover;">` : ''}
                        
                        <!-- Back Button -->
                        <button onclick="window.history.back()" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);"><i class="fas fa-arrow-left"></i></button>
                    </div>

                    <!-- Profile Header (TikTok Style) -->
                    <div style="padding: 0 24px; margin-top: -50px; position: relative; z-index: 10; text-align: center;">
                        
                        <!-- Avatar -->
                        <div style="width: 100px; height: 100px; border-radius: 50%; background: #0f172a; margin: 0 auto; border: 4px solid white; overflow: hidden; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: 800; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                            ${profile.avatar_url ? `<img src="${profile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-user"></i>'}
                        </div>
                        
                        <!-- Name & Handle -->
                        <h1 style="font-size: 1.6rem; font-weight: 900; color: #0f172a; margin: 12px 0 4px 0; letter-spacing: -0.02em;">${profile.full_name}</h1>
                        <p style="font-size: 0.95rem; color: #64748b; font-weight: 600; margin: 0;">@${profile.full_name.replace(/\\s+/g, '').toLowerCase()}</p>
                        
                        <!-- Stats -->
                        <div style="display: flex; justify-content: center; gap: 32px; margin: 20px 0;">
                            <div style="text-align: center;">
                                <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">${followingCount}</div>
                                <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Abonnements</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">${followersCount}</div>
                                <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Abonnés</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">${feedItems.length}</div>
                                <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Posts</div>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 24px;">
                            ${isSelf ? `
                                <button onclick="window.Router.navigate('#profile')" style="padding: 10px 24px; border-radius: 8px; background: #f1f5f9; color: #0f172a; font-weight: 800; font-size: 0.95rem; border: 1px solid #e2e8f0; cursor: pointer;">Modifier le profil</button>
                            ` : `
                                <button id="channel-follow-btn" onclick="window.ChannelModule.toggleFollow('${userId}', this)" style="padding: 10px 32px; border-radius: 8px; font-weight: 800; font-size: 0.95rem; cursor: pointer; border: none; ${isFollowing ? 'background: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0;' : 'background: #ef4444; color: white; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);'}">
                                    ${isFollowing ? '<i class="fas fa-check" style="margin-right: 6px;"></i>Abonné' : 'S\\'abonner'}
                                </button>
                                <button onclick="window.Router.navigate('#messages')" style="padding: 10px 16px; border-radius: 8px; background: #f1f5f9; color: #0f172a; font-weight: 800; font-size: 0.95rem; border: 1px solid #e2e8f0; cursor: pointer;"><i class="fas fa-comment-alt"></i></button>
                            `}
                        </div>
                        
                        <!-- Bio -->
                        ${showcase && showcase.description ? `
                            <p style="font-size: 0.95rem; color: #334155; line-height: 1.5; font-weight: 500; padding: 0 20px; text-align: center; margin-bottom: 24px;">${showcase.description}</p>
                        ` : ''}

                        <!-- Tabs -->
                        <div style="display: flex; justify-content: center; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                            <div style="flex: 1; padding: 14px 0; border-bottom: 2px solid #0f172a; color: #0f172a; font-weight: 800; font-size: 0.9rem; cursor: pointer;">
                                <i class="fas fa-stream" style="margin-right: 6px;"></i> Publications
                            </div>
                            <!-- Future Expansion for Services/Offers -->
                            <div style="flex: 1; padding: 14px 0; color: #94a3b8; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#94a3b8'" onclick="alert('Les services seront bientôt affichés ici !')">
                                <i class="fas fa-briefcase" style="margin-right: 6px;"></i> Services
                            </div>
                        </div>
                    </div>

                    <!-- Feed Grid / List -->
                    <div style="padding: 24px 0; background: #f8fafc;">
                        <div id="channel-feed-container" style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
                            ${feedItems.length === 0 ? `
                                <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                                    <i class="fas fa-camera" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                                    <p style="font-weight: 700; font-size: 1.1rem; color: #0f172a; margin: 0 0 8px 0;">Aucune publication</p>
                                    <p style="margin: 0; font-size: 0.9rem;">Cet utilisateur n'a pas encore publié de contenu.</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = html;

            // Render posts using MomentsModule if available
            if (feedItems.length > 0 && window.MomentsModule) {
                const feedContainer = document.getElementById('channel-feed-container');
                const postsHtml = feedItems.map(item => window.MomentsModule.renderFeedItemHTML(item, session ? session.user : null, containerId)).join('');
                feedContainer.innerHTML = postsHtml;
            }

        } catch (err) {
            console.error("[ChannelModule] Error:", err);
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #ef4444; font-weight: 700;">
                    Erreur lors du chargement de la chaîne : ${err.message}
                </div>
            `;
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
    }
};
