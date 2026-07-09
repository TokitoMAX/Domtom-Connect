const fs = require('fs');
let content = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

// 1. Add CSS
content = content.replace('.dtc-action-icon:hover {\n                        background: #f1f5f9;\n                        color: #0f172a;\n                    }', '.dtc-action-icon:hover {\n                        background: #f1f5f9;\n                        color: #0f172a;\n                    }\n                    @media (max-width: 640px) {\n                        .dtc-action-text { display: none; }\n                    }');

// 2. Add Saved Tab
const originalTabs = `<div style="display: flex; gap: 6px; background: #f1f5f9; padding: 4px; border-radius: 14px;">
                        <button onclick="window.MomentsModule.switchFeedMode('all', '\${containerId}')" style="flex:1; padding: 8px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: \${this.currentFeedMode === 'all' ? 'white' : 'transparent'}; color: \${this.currentFeedMode === 'all' ? '#0f172a' : '#64748b'}; box-shadow: \${this.currentFeedMode === 'all' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};">Pour vous</button>
                        <button onclick="window.MomentsModule.switchFeedMode('following', '\${containerId}')" style="flex:1; padding: 8px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: \${this.currentFeedMode === 'following' ? 'white' : 'transparent'}; color: \${this.currentFeedMode === 'following' ? '#0f172a' : '#64748b'}; box-shadow: \${this.currentFeedMode === 'following' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};">Abonnements</button>
                        <button onclick="window.MomentsModule.switchFeedMode('reels', '\${containerId}')" style="flex:1; padding: 8px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: \${this.currentFeedMode === 'reels' ? 'white' : 'transparent'}; color: \${this.currentFeedMode === 'reels' ? '#0f172a' : '#64748b'}; box-shadow: \${this.currentFeedMode === 'reels' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};"><i class="fas fa-film" style="margin-right:4px;"></i> Reels</button>
                    </div>`;
const newTabs = `<div style="display: flex; gap: 6px; background: #f1f5f9; padding: 4px; border-radius: 14px; overflow-x: auto; scrollbar-width: none;">
                        <button onclick="window.MomentsModule.switchFeedMode('all', '\${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: \${this.currentFeedMode === 'all' ? 'white' : 'transparent'}; color: \${this.currentFeedMode === 'all' ? '#0f172a' : '#64748b'}; box-shadow: \${this.currentFeedMode === 'all' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};">Pour vous</button>
                        <button onclick="window.MomentsModule.switchFeedMode('following', '\${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: \${this.currentFeedMode === 'following' ? 'white' : 'transparent'}; color: \${this.currentFeedMode === 'following' ? '#0f172a' : '#64748b'}; box-shadow: \${this.currentFeedMode === 'following' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};">Abonnements</button>
                        <button onclick="window.MomentsModule.switchFeedMode('reels', '\${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: \${this.currentFeedMode === 'reels' ? 'white' : 'transparent'}; color: \${this.currentFeedMode === 'reels' ? '#0f172a' : '#64748b'}; box-shadow: \${this.currentFeedMode === 'reels' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};"><i class="fas fa-film" style="margin-right:4px;"></i> Reels</button>
                        <button onclick="window.MomentsModule.switchFeedMode('saved', '\${containerId}')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: \${this.currentFeedMode === 'saved' ? 'white' : 'transparent'}; color: \${this.currentFeedMode === 'saved' ? '#0f172a' : '#64748b'}; box-shadow: \${this.currentFeedMode === 'saved' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};"><i class="fas fa-bookmark" style="margin-right:4px;"></i> Sauvegardés</button>
                    </div>`;
content = content.replace(originalTabs, newTabs);

// 3. Update buttons
content = content.replace(
    'setReaction(\'${item.id}\', \'heart\', \'${containerId}\')',
    'setReaction(\'${item.id}\', \'heart\', \'${containerId}\', this)'
);
content = content.replace(
    '${commentsCount > 0 ? commentsCount : \'\'}\n                            </button>',
    '<span class="reaction-count">${commentsCount > 0 ? commentsCount : \'\'}</span>\n                            </button>' // Wait, no, the like count was `${likesCount > 0 ? likesCount : ''}`
);
content = content.replace(
    '${likesCount > 0 ? likesCount : \'\'}\n                            </button>',
    '<span class="reaction-count">${likesCount > 0 ? likesCount : \'\'}</span>\n                            </button>'
);

content = content.replace(
    '${commentsCount > 0 ? commentsCount : \'Commenter\'}',
    '${commentsCount > 0 ? commentsCount : \'<span class="dtc-action-text">Commenter</span>\'}'
);
content = content.replace(
    'Message\n                        </button>',
    '<span class="dtc-action-text">Message</span>\n                        </button>'
);
content = content.replace(
    'Partager\n                        </button>',
    '<span class="dtc-action-text">Partager</span>\n                        </button>'
);
content = content.replace(
    'Repost\n                        </button>',
    '<span class="dtc-action-text">Repost</span>\n                        </button>'
);

// 4. Update load query for saved mode
const queryLogicOld = `            if (this.currentFeedMode === 'following' && this.subscriptions) {
                query = query.in('user_id', this.subscriptions.length > 0 ? this.subscriptions : ['00000000-0000-0000-0000-000000000000']);
            }`;
const queryLogicNew = `            if (this.currentFeedMode === 'saved') {
                const session = window.App?.state?.session;
                if (!session) throw new Error("Connectez-vous pour voir vos sauvegardes.");
                const { data: bms } = await db.from('feed_bookmarks').select('post_id').eq('user_id', session.user.id);
                const savedIds = bms ? bms.map(b => b.post_id) : [];
                if (savedIds.length === 0) return [];
                query = query.in('id', savedIds);
            } else if (this.currentFeedMode === 'following' && this.subscriptions) {
                query = query.in('user_id', this.subscriptions.length > 0 ? this.subscriptions : ['00000000-0000-0000-0000-000000000000']);
            }`;
content = content.replace(queryLogicOld, queryLogicNew);

// 5. Update setReaction function
const setReactionOld = `    setReaction: async function (postId, type, containerId) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) { alert('Connectez-vous pour réagir.'); return; }

        const userId = session.user.id;
        const existing = (this.reactions[postId] || []).find(r => r.user_id === userId);

        try {
            if (existing?.type === type) {
                await db.from('feed_likes').delete().eq('post_id', postId).eq('user_id', userId);
            } else if (existing) {
                await db.from('feed_likes').update({ reaction_type: type }).eq('post_id', postId).eq('user_id', userId);
            } else {
                await db.from('feed_likes').insert([{ post_id: postId, user_id: userId, reaction_type: type }]);
            }
            this._refreshAfterEngagement(containerId);
        } catch (err) {
            console.error('[MomentsModule] Reaction Error:', err);
            if (type !== 'heart') {
                await db.from('feed_likes').insert([{ post_id: postId, user_id: userId, reaction_type: type }]).catch(() => { });
                this._refreshAfterEngagement(containerId);
            }
        }
    },`;
const setReactionNew = `    setReaction: async function (postId, type, containerId, btnElement) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) { alert('Connectez-vous pour réagir.'); return; }

        const userId = session.user.id;
        const existing = (this.reactions[postId] || []).find(r => r.user_id === userId);

        if (btnElement) {
            const isLiking = !(existing?.type === type);
            btnElement.classList.toggle('liked', isLiking);
            const countSpan = btnElement.querySelector('.reaction-count');
            if (countSpan) {
                let currentCount = parseInt(countSpan.innerText || '0');
                if (isLiking && !existing) currentCount++;
                else if (!isLiking && existing) currentCount = Math.max(0, currentCount - 1);
                countSpan.innerText = currentCount > 0 ? currentCount : '';
            }
        }

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
        } catch (err) {
            console.error('[MomentsModule] Reaction Error:', err);
        }
    },`;
content = content.replace(setReactionOld, setReactionNew);

// 6. Update toggleBookmark function
const toggleBookmarkOld = `    toggleBookmark: async function (postId, containerId, btnEl) {
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
    },`;
// Wait, the old file's toggleBookmark handles optimistic UI? Yes! Look at the current file. I don't need to change it! I already added the tab.

// 7. Update repostItem function
const repostItemOld = `                    if (insertErr) throw insertErr;

                    document.getElementById(modalId).remove();
                    alert("Publication republiée avec succès !");
                    this.renderFeed(containerId);
                } catch (err) {`;
const repostItemNew = `                    if (insertErr) throw insertErr;

                    document.getElementById(modalId).remove();
                    const toast = document.createElement('div');
                    toast.style = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 12px 24px; border-radius: 100px; font-weight: 800; z-index: 999999; box-shadow: 0 4px 12px rgba(16,185,129,0.3); animation: slideUp 0.3s ease-out;";
                    toast.innerText = "✨ Publication republiée avec succès !";
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                } catch (err) {`;
content = content.replace(repostItemOld, repostItemNew);

fs.writeFileSync('assets/js/modules/moments.module.v2.js', content);
console.log("Done");
