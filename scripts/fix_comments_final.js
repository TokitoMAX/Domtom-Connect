const fs = require('fs');
let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

// 1. Update renderComment signature and isMyComment
c = c.replace(
    'const childReplies = replies.filter(r => r.parent_id === c.id);',
    `const childReplies = replies.filter(r => r.parent_id === c.id);
                    const isMyComment = currentUser && currentUser.id === c.user_id;`
);

// 2. Add relative positioning to the comment box
c = c.replace(
    '<div style="background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02);">',
    '<div style="background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02); position: relative;">'
);

// 3. Insert the delete button
c = c.replace(
    '<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">',
    `\${isMyComment ? \`<button onclick="MomentsModule.deleteComment('\${c.id}', '\${item.id}', '\${containerId}')" style="position: absolute; right: 8px; top: 8px; background: white; border: 1px solid #e2e8f0; width: 24px; height: 24px; border-radius: 50%; color: #ef4444; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" title="Supprimer ce commentaire"><i class="fas fa-trash-alt"></i></button>\` : ''}
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; padding-right: \${isMyComment ? '24px' : '0'};">`
);

// 4. Add the deleteComment function
if (!c.includes('deleteComment: async function')) {
    const deleteCommentFunc = `    deleteComment: async function(commentId, postId, containerId) {
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
    
    replyToComment: function`;
    c = c.replace('    replyToComment: function', deleteCommentFunc);
}

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
console.log('Fixed comment deletion!');
