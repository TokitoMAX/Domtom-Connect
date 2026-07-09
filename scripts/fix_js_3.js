const fs = require('fs');
let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

// 1. Fix toggleLike (double tap)
let oldToggleLike = `    toggleLike: async function (postId, containerId) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) return;

        const userId = session.user.id;
        const existing = (this.reactions[postId] || []).find(r => r.user_id === userId);

        try {
            if (existing?.type === 'heart') {
                await db.from('feed_likes').delete().eq('post_id', postId).eq('user_id', userId);
            } else if (existing) {
                await db.from('feed_likes').update({ reaction_type: 'heart' }).eq('post_id', postId).eq('user_id', userId);
            } else {
                await db.from('feed_likes').insert([{ post_id: postId, user_id: userId, reaction_type: 'heart' }]);
            }
            this._refreshAfterEngagement(containerId);
        } catch (err) {
            console.error('[MomentsModule] DoubleTap Like Error:', err);
        }
    },`;
let newToggleLike = `    toggleLike: async function (postId, containerId) {
        const db = this.getDb();
        const session = window.App?.state?.session;
        if (!session) return;

        const userId = session.user.id;
        const existing = (this.reactions[postId] || []).find(r => r.user_id === userId);

        // Optimistic UI for double-tap
        const postCard = document.getElementById('dtc-post-' + postId);
        if (postCard) {
            const heartBtn = postCard.querySelector('.dtc-action-icon[title="J\\'aime"]');
            if (heartBtn) {
                const isLiking = !(existing?.type === 'heart');
                heartBtn.classList.toggle('liked', isLiking);
                const countSpan = heartBtn.querySelector('.reaction-count');
                if (countSpan) {
                    let currentCount = parseInt(countSpan.innerText || '0');
                    if (isLiking && !existing) currentCount++;
                    else if (!isLiking && existing) currentCount = Math.max(0, currentCount - 1);
                    countSpan.innerText = currentCount > 0 ? currentCount : '';
                }
            }
        }

        try {
            if (existing?.type === 'heart') {
                await db.from('feed_likes').delete().eq('post_id', postId).eq('user_id', userId);
                this.reactions[postId] = (this.reactions[postId] || []).filter(r => r.user_id !== userId);
            } else if (existing) {
                await db.from('feed_likes').update({ reaction_type: 'heart' }).eq('post_id', postId).eq('user_id', userId);
                existing.type = 'heart';
            } else {
                await db.from('feed_likes').insert([{ post_id: postId, user_id: userId, reaction_type: 'heart' }]);
                if (!this.reactions[postId]) this.reactions[postId] = [];
                this.reactions[postId].push({ user_id: userId, type: 'heart' });
            }
        } catch (err) {
            console.error('[MomentsModule] DoubleTap Like Error:', err);
        }
    },`;

// To ensure replace works with \r\n vs \n
let oldRegexLike = oldToggleLike.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n');
let regexLike = new RegExp(oldRegexLike);
if (regexLike.test(c)) {
    c = c.replace(regexLike, newToggleLike);
    console.log('Fixed toggleLike');
} else {
    console.log('toggleLike not matched!');
}

// 2. Fix repostItem
let oldRepost = `                    if (insertErr) throw insertErr;

                    document.getElementById(modalId).remove();
                    alert("Publication republiée avec succès !");
                    this.renderFeed(containerId);
                } catch (err) {`;
let newRepost = `                    if (insertErr) throw insertErr;

                    document.getElementById(modalId).remove();
                    const toast = document.createElement('div');
                    toast.style = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 12px 24px; border-radius: 100px; font-weight: 800; z-index: 999999; box-shadow: 0 4px 12px rgba(16,185,129,0.3); animation: slideUp 0.3s ease-out;";
                    toast.innerText = "✨ Publication republiée avec succès !";
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                } catch (err) {`;
let oldRegexRepost = oldRepost.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n');
let regexRepost = new RegExp(oldRegexRepost);
if (regexRepost.test(c)) {
    c = c.replace(regexRepost, newRepost);
    console.log('Fixed repostItem');
} else {
    console.log('repostItem not matched!');
}

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
