const fs = require('fs');

let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

// 1. Fix setReaction (optimistic UI)
const setReactionOld = `    setReaction: async function (postId, type, containerId) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) { alert('Connectez-vous pour réagir.'); return; }

        const userId = session.user.id;
        const postReactions = this.reactions[postId] || [];
        const existing = postReactions.find(r => r.user_id === userId);

        try {
            if (existing) {
                if (existing.type === type) {
                    await db.from('feed_reactions').delete().eq('id', existing.id);
                    this.reactions[postId] = postReactions.filter(r => r.id !== existing.id);
                } else {
                    await db.from('feed_reactions').update({ type }).eq('id', existing.id);
                    existing.type = type;
                }
            } else {
                const { data } = await db.from('feed_reactions').insert({ post_id: postId, user_id: userId, type }).select().single();
                if (data) {
                    if (!this.reactions[postId]) this.reactions[postId] = [];
                    this.reactions[postId].push(data);
                }
            }
            this._refreshAfterEngagement(containerId);
        } catch (e) {
            console.error("setReaction error", e);
        }
    },`;

const setReactionNew = `    setReaction: async function (postId, type, containerId, btnElement) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) { alert('Connectez-vous pour réagir.'); return; }

        const userId = session.user.id;
        const postReactions = this.reactions[postId] || [];
        const existing = postReactions.find(r => r.user_id === userId);

        try {
            if (existing) {
                if (existing.type === type) {
                    await db.from('feed_reactions').delete().eq('id', existing.id);
                    this.reactions[postId] = postReactions.filter(r => r.id !== existing.id);
                } else {
                    await db.from('feed_reactions').update({ type }).eq('id', existing.id);
                    existing.type = type;
                }
            } else {
                const { data } = await db.from('feed_reactions').insert({ post_id: postId, user_id: userId, type }).select().single();
                if (data) {
                    if (!this.reactions[postId]) this.reactions[postId] = [];
                    this.reactions[postId].push(data);
                }
            }
            
            // Optimistic UI update instead of reload
            const reactionsNow = this.reactions[postId] || [];
            const userReactionNow = reactionsNow.find(r => r.user_id === userId);
            
            if (btnElement) {
                // Update specific picker button if passed
                const parent = btnElement.closest('.dtc-reaction-container');
                if (parent) {
                    const reactionSummaryStr = Object.entries(
                        reactionsNow.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {})
                    ).map(([t, count]) => \`\${this.REACTION_EMOJI[t] || '❤️'} \${count}\`).join(' ');
                    
                    const summaryEl = parent.querySelector('.dtc-reaction-summary');
                    if (summaryEl) summaryEl.innerHTML = reactionSummaryStr || 'Réagir';
                }
            }
        } catch (e) {
            console.error("setReaction error", e);
        }
    },`;

let r1 = new RegExp(setReactionOld.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n'));
if (r1.test(c)) {
    c = c.replace(r1, setReactionNew);
    console.log('Fixed setReaction');
}

// 2. Fix renderFeedItemHTML start
const oldRenderHTML = `    renderFeedItemHTML: function (item, currentUser, containerId, embedMode = false) {
        const isSelf = currentUser && currentUser.id === item.userId;`;

const newRenderHTML = `    renderFeedItemHTML: function (item, currentUser, containerId, embedMode = false) {
        let isPureRepost = false;
        let reposterName = '';
        if (item.type === 'repost' && item.meta && (!item.description || !item.description.trim())) {
            try {
                const quoteData = JSON.parse(item.meta);
                reposterName = item.authorName;
                item.authorName = quoteData.authorName || 'Inconnu';
                item.authorAvatar = quoteData.authorAvatar;
                item.description = quoteData.content || '';
                item.imageUrl = quoteData.imageUrl;
                item.type = 'status'; // remove repost style
                isPureRepost = true;
            } catch(e) {}
        }
        const isSelf = currentUser && currentUser.id === item.userId;`;

let r2 = new RegExp(oldRenderHTML.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n'));
if (r2.test(c)) {
    c = c.replace(r2, newRenderHTML);
    console.log('Fixed renderFeedItemHTML');
}

// 3. Fix dtc-post-card header
const oldCardStart = `        return \`
            <div class="dtc-post-card" data-post-id="\${item.id}" \${embedMode ? '' : \`ondblclick="MomentsModule.doubleTapLike('\${item.id}', '\${containerId}', this)" onclick="if(!event.target.closest('button,a,input,textarea,select,video,.dtc-reaction-picker')) MomentsModule.openPostDetail('\${item.id}', '\${containerId}')"\`} style="\${cardBorder} position: relative;\${embedMode ? '' : ' cursor: pointer;'}">
                \${isPinned ? \`<div style="position: absolute; top: 12px; right: 12px; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 4px; z-index: 2;"><i class="fas fa-thumbtack" style="font-size: 0.6rem;"></i> Épinglé</div>\` : ''}
                <div class="dtc-heart-burst" style="display:none; position:absolute; inset:0; align-items:center; justify-content:center; pointer-events:none; z-index:5;"><svg width="80" height="80" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
                
                <!-- HEADER -->`;

const newCardStart = `        return \`
            <div class="dtc-post-card" data-post-id="\${item.id}" \${embedMode ? '' : \`ondblclick="MomentsModule.doubleTapLike('\${item.id}', '\${containerId}', this)" onclick="if(!event.target.closest('button,a,input,textarea,select,video,.dtc-reaction-picker')) MomentsModule.openPostDetail('\${item.id}', '\${containerId}')"\`} style="\${cardBorder} position: relative;\${embedMode ? '' : ' cursor: pointer;'}">
                \${isPinned ? \`<div style="position: absolute; top: 12px; right: 12px; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 4px; z-index: 2;"><i class="fas fa-thumbtack" style="font-size: 0.6rem;"></i> Épinglé</div>\` : ''}
                \${isPureRepost ? \`<div style="font-size: 0.8rem; color: #64748b; font-weight: 800; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; margin-top: -4px;"><i class="fas fa-retweet" style="color: #10b981;"></i> \${reposterName} a republié</div>\` : ''}
                <div class="dtc-heart-burst" style="display:none; position:absolute; inset:0; align-items:center; justify-content:center; pointer-events:none; z-index:5;"><svg width="80" height="80" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
                
                <!-- HEADER -->`;

let r3 = new RegExp(oldCardStart.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n'));
if (r3.test(c)) {
    c = c.replace(r3, newCardStart);
    console.log('Fixed post-card header');
}

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
