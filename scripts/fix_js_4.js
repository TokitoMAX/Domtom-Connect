const fs = require('fs');
let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

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

let oldRegex = oldSetReaction.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n');
let regex = new RegExp(oldRegex);

if (regex.test(c)) {
    c = c.replace(regex, newSetReaction);
    console.log('Fixed setReaction');
} else {
    console.log('setReaction not matched!');
}

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
