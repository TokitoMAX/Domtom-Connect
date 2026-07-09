const fs = require('fs');

let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

const oldSetReactionStart = `    setReaction: async function (postId, type, containerId, btnElement) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) { alert('Connectez-vous pour réagir.'); return; }

        const userId = session.user.id;
        const existing = (this.reactions[postId] || []).find(r => r.user_id === userId);

        if (btnElement && type === 'heart') {
            const isLiking = !(existing?.type === type);
            btnElement.classList.toggle('liked', isLiking);
            const countSpan = btnElement.querySelector('.reaction-count');
            if (countSpan) {
                let currentCount = parseInt(countSpan.innerText || '0');
                if (isLiking && !existing) currentCount++;
                else if (!isLiking && existing) currentCount = Math.max(0, currentCount - 1);
                countSpan.innerText = currentCount > 0 ? currentCount : '';
            }
        } else if (btnElement) {
            this._refreshAfterEngagement(containerId);
            return;
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

const newSetReaction = `    setReaction: async function (postId, type, containerId, btnElement) {
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
            const heartBtns = document.querySelectorAll(\`.dtc-post-card[data-post-id="\${postId}"] button[onclick*="toggleLike"]\`);
            heartBtns.forEach(btn => {
                btn.innerHTML = \`\${hasLiked ? '❤️' : '🤍'}<div style="font-size:0.65rem; font-weight:800; margin-top:2px;">\${likesCount || ''}</div>\`;
            });
            
            // Find detailed reaction picker summaries
            const summaryEls = document.querySelectorAll(\`.dtc-post-card[data-post-id="\${postId}"] .dtc-reaction-summary\`);
            if (summaryEls.length > 0) {
                const reactionSummaryStr = Object.entries(
                    postReactions.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {})
                ).map(([t, count]) => \`\${this.REACTION_EMOJI[t] || '❤️'} \${count}\`).join(' ');
                
                summaryEls.forEach(el => el.innerHTML = reactionSummaryStr || 'Réagir');
            }
            
        } catch (err) {
            console.error('[MomentsModule] Reaction Error:', err);
        }
    },`;

let r1 = new RegExp(oldSetReactionStart.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n'));
if (r1.test(c)) {
    c = c.replace(r1, newSetReaction);
    console.log('Fixed setReaction globally');
} else {
    console.log('Failed to match setReaction!');
}

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
