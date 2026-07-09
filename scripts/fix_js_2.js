const fs = require('fs');

function applyChanges() {
    let lines = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8').split('\n');

    // Helper to find index of a line
    const findLine = (search) => lines.findIndex(l => l.includes(search));

    // 1. Mobile CSS
    let cssIdx = findLine('.dtc-action-icon:hover {');
    if (cssIdx > -1) {
        lines[cssIdx] = '.dtc-action-icon:hover { background: #f1f5f9; color: #0f172a; }\n@media (max-width: 640px) { .dtc-action-text { display: none; } }';
        lines[cssIdx + 1] = '';
        lines[cssIdx + 2] = '';
        lines[cssIdx + 3] = '';
    }

    // 2. Tabs
    let tabsIdx = findLine('<!-- FEED MODE TABS -->');
    if (tabsIdx > -1) {
        lines[tabsIdx + 1] = '                    <div style="display: flex; gap: 6px; background: #f1f5f9; padding: 4px; border-radius: 14px; overflow-x: auto; scrollbar-width: none;">';
        lines[tabsIdx + 2] = '                        <button onclick="window.MomentsModule.switchFeedMode(\'all\', \'${containerId}\')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === \'all\' ? \'white\' : \'transparent\'}; color: ${this.currentFeedMode === \'all\' ? \'#0f172a\' : \'#64748b\'}; box-shadow: ${this.currentFeedMode === \'all\' ? \'0 2px 8px rgba(0,0,0,0.08)\' : \'none\'};">Pour vous</button>';
        lines[tabsIdx + 3] = '                        <button onclick="window.MomentsModule.switchFeedMode(\'following\', \'${containerId}\')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === \'following\' ? \'white\' : \'transparent\'}; color: ${this.currentFeedMode === \'following\' ? \'#0f172a\' : \'#64748b\'}; box-shadow: ${this.currentFeedMode === \'following\' ? \'0 2px 8px rgba(0,0,0,0.08)\' : \'none\'};">Abonnements</button>';
        lines[tabsIdx + 4] = '                        <button onclick="window.MomentsModule.switchFeedMode(\'reels\', \'${containerId}\')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === \'reels\' ? \'white\' : \'transparent\'}; color: ${this.currentFeedMode === \'reels\' ? \'#0f172a\' : \'#64748b\'}; box-shadow: ${this.currentFeedMode === \'reels\' ? \'0 2px 8px rgba(0,0,0,0.08)\' : \'none\'};"><i class="fas fa-film" style="margin-right:4px;"></i> Reels</button>';
        lines.splice(tabsIdx + 5, 0, '                        <button onclick="window.MomentsModule.switchFeedMode(\'saved\', \'${containerId}\')" style="flex:1; white-space: nowrap; padding: 8px 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.82rem; cursor: pointer; background: ${this.currentFeedMode === \'saved\' ? \'white\' : \'transparent\'}; color: ${this.currentFeedMode === \'saved\' ? \'#0f172a\' : \'#64748b\'}; box-shadow: ${this.currentFeedMode === \'saved\' ? \'0 2px 8px rgba(0,0,0,0.08)\' : \'none\'};"><i class="fas fa-bookmark" style="margin-right:4px;"></i> Sauvegardés</button>');
    }

    // 3. Update query in _loadMoreFeed (NOT loadFeedData)
    // Wait! loadFeedData is around line 290. _loadMoreFeed is around line 1660.
    // Let\'s update _loadMoreFeed (the one with 'ascending: false });')
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('let query = db.from(\'showcase_items\').select(\'*, profiles:user_id(*)\').order(\'created_at\', { ascending: false });')) {
            lines[i+1] = `
            if (this.currentFeedMode === 'saved') {
                const session = window.App?.state?.session;
                if (!session) throw new Error("Connectez-vous pour voir vos sauvegardes.");
                const { data: bms } = await db.from('feed_bookmarks').select('post_id').eq('user_id', session.user.id);
                const savedIds = bms ? bms.map(b => b.post_id) : [];
                if (savedIds.length === 0) return [];
                query = query.in('id', savedIds);
            } else if (this.currentFeedMode === 'following' && this.subscriptions) {
                query = query.in('user_id', this.subscriptions.length > 0 ? this.subscriptions : ['00000000-0000-0000-0000-000000000000']);
            }`;
            lines[i+2] = '';
            lines[i+3] = '';
            break;
        }
    }

    // Wait, what about loadFeedData at the top? I also need to update it!
    // Let's do it with replace globally.
    let content = lines.join('\n');
    
    // loadFeedData query update
    const q1 = `if (this.currentFeedMode === 'following') {
                    showcaseQuery = showcaseQuery.in('user_id', followedIds);
                }`;
    const q2 = `if (this.currentFeedMode === 'following') {
                    showcaseQuery = showcaseQuery.in('user_id', followedIds);
                } else if (this.currentFeedMode === 'saved') {
                    if (!currentUser) throw new Error("Connectez-vous pour voir vos sauvegardes.");
                    const { data: bms } = await db.from('feed_bookmarks').select('post_id').eq('user_id', currentUser.id);
                    const savedIds = bms ? bms.map(b => b.post_id) : [];
                    if (savedIds.length === 0) showcaseQuery = showcaseQuery.eq('id', '00000000-0000-0000-0000-000000000000');
                    else showcaseQuery = showcaseQuery.in('id', savedIds);
                }`;
    content = content.replace(q1, q2);

    // Hide Projects if saved
    content = content.replace(`if (rawProjects && this.currentFeedMode !== 'following') {`, `if (rawProjects && this.currentFeedMode !== 'following' && this.currentFeedMode !== 'saved') {`);

    // Button updates
    content = content.replace('setReaction(\'${item.id}\', \'heart\', \'${containerId}\')', 'setReaction(\'${item.id}\', \'heart\', \'${containerId}\', this)');
    content = content.replace('${commentsCount > 0 ? commentsCount : \'Commenter\'}', '${commentsCount > 0 ? commentsCount : \'<span class="dtc-action-text">Commenter</span>\'}');
    content = content.replace('${likesCount > 0 ? likesCount : \'\'}', '<span class="reaction-count">${likesCount > 0 ? likesCount : \'\'}</span>');
    content = content.replace('Message\n                        </button>', '<span class="dtc-action-text">Message</span>\n                        </button>');
    content = content.replace('Partager\n                        </button>', '<span class="dtc-action-text">Partager</span>\n                        </button>');
    content = content.replace('Repost\n                        </button>', '<span class="dtc-action-text">Repost</span>\n                        </button>');

    // setReaction update
    const oldSetReaction = `    setReaction: async function (postId, type, containerId) {
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
    
    const newSetReaction = `    setReaction: async function (postId, type, containerId, btnElement) {
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
    content = content.replace(oldSetReaction, newSetReaction);

    const oldRepost = `                    if (insertErr) throw insertErr;

                    document.getElementById(modalId).remove();
                    alert("Publication republiée avec succès !");
                    this.renderFeed(containerId);
                } catch (err) {`;
    const newRepost = `                    if (insertErr) throw insertErr;

                    document.getElementById(modalId).remove();
                    const toast = document.createElement('div');
                    toast.style = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 12px 24px; border-radius: 100px; font-weight: 800; z-index: 999999; box-shadow: 0 4px 12px rgba(16,185,129,0.3); animation: slideUp 0.3s ease-out;";
                    toast.innerText = "✨ Publication republiée avec succès !";
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                } catch (err) {`;
    content = content.replace(oldRepost, newRepost);

    fs.writeFileSync('assets/js/modules/moments.module.v2.js', content);
    console.log("Done successfully.");
}

try {
    applyChanges();
} catch (e) {
    console.error(e);
}
