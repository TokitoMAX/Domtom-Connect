const fs = require('fs');

let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

const oldRenderComment = `                const renderComment = (c, isReply = false) => {
                    const cProfile = c.profiles || {};
                    const initials = (cProfile.full_name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    const childReplies = replies.filter(r => r.parent_id === c.id);

                    return \`
                    <div style="display: flex; gap: 12px; align-items: flex-start; background: transparent; padding: 8px 0; margin-bottom: 8px; \${isReply ? 'margin-left: 36px; padding-left: 12px; border-left: 2px solid #e2e8f0;' : ''}">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; color: #0f172a; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.05);">
                            \${cProfile.avatar_url ? \\\`<img src="\${cProfile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">\\\` : initials}
                        </div>
                        <div style="flex: 1;">
                            <div style="background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02);">
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                                    <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">\${cProfile.full_name || 'Utilisateur'}</span>
                                    <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">\${this.getRelativeTime(new Date(c.created_at))}</span>
                                </div>
                                <p style="margin: 0; font-size: 0.9rem; color: #334155; line-height: 1.45; font-weight: 500;">\${escapeHTML(c.content)}</p>
                            </div>
                            \${!isReply ? \`
                            <div style="display: flex; gap: 12px; padding: 4px 12px;">
                                <span onclick="MomentsModule.replyToComment('\${item.id}', '\${c.id}', '\${(cProfile.full_name || 'Utilisateur').replace(/'/g, "\\\\'")}')" style="font-size: 0.75rem; color: #64748b; font-weight: 700; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#64748b'">Répondre</span>
                            </div>
                            \` : ''}
                            \${childReplies.map(r => renderComment(r, true)).join('')}
                        </div>
                    </div>
                    \`;
                };`;

const newRenderComment = `                const renderComment = (c, isReply = false) => {
                    const cProfile = c.profiles || {};
                    const initials = (cProfile.full_name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    const childReplies = replies.filter(r => r.parent_id === c.id);
                    const isMyComment = currentUser && currentUser.id === c.user_id;

                    return \`
                    <div style="display: flex; gap: 12px; align-items: flex-start; background: transparent; padding: 8px 0; margin-bottom: 8px; \${isReply ? 'margin-left: 36px; padding-left: 12px; border-left: 2px solid #e2e8f0;' : ''}">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; color: #0f172a; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.05);">
                            \${cProfile.avatar_url ? \\\`<img src="\${cProfile.avatar_url}" style="width:100%; height:100%; object-fit:cover;">\\\` : initials}
                        </div>
                        <div style="flex: 1;">
                            <div style="background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02); position: relative;">
                                \${isMyComment ? \\\`<button onclick="MomentsModule.deleteComment('\${c.id}', '\${item.id}', '\${containerId}')" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #cbd5e1; cursor: pointer; font-size: 0.8rem;" title="Supprimer ce commentaire"><i class="fas fa-trash-alt" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color=''"></i></button>\\\` : ''}
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; padding-right: \${isMyComment ? '20px' : '0'};">
                                    <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">\${cProfile.full_name || 'Utilisateur'}</span>
                                    <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">\${this.getRelativeTime(new Date(c.created_at))}</span>
                                </div>
                                <p style="margin: 0; font-size: 0.9rem; color: #334155; line-height: 1.45; font-weight: 500; word-break: break-word;">\${escapeHTML(c.content)}</p>
                            </div>
                            \${!isReply ? \`
                            <div style="display: flex; gap: 12px; padding: 4px 12px;">
                                <span onclick="MomentsModule.replyToComment('\${item.id}', '\${c.id}', '\${(cProfile.full_name || 'Utilisateur').replace(/'/g, "\\\\'")}')" style="font-size: 0.75rem; color: #64748b; font-weight: 700; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#64748b'">Répondre</span>
                            </div>
                            \` : ''}
                            \${childReplies.map(r => renderComment(r, true)).join('')}
                        </div>
                    </div>
                    \`;
                };`;

let r1 = new RegExp(oldRenderComment.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n'));
if (r1.test(c)) {
    c = c.replace(r1, newRenderComment);
    console.log('Fixed renderComment to include delete button');
} else {
    console.log('Could not find renderComment string!');
}

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
if(c.includes('deleteComment: async function')) {
    console.log('Added deleteComment function');
}

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
