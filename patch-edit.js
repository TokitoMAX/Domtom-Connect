const fs = require('fs');
const file = 'd:/DomtomConnect-Website/assets/js/modules/moments.module.v2.js';
let content = fs.readFileSync(file, 'utf8');

const target1 = `                                  <button onclick="MomentsModule.deletePost('${item.id}', '${item.type}', '${containerId}')" class="dtc-delete-post-btn" title="Supprimer la publication">`;
const replacement1 = `                                  <button onclick="MomentsModule.openEditPostModal('\${item.id}', '\${item.type}', '\${containerId}')" class="dtc-delete-post-btn" title="Modifier la publication" style="color: #64748b;" onmouseover="this.style.color='#3b82f6'; this.style.background='#eff6ff';" onmouseout="this.style.color='#64748b'; this.style.background='transparent';">
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                  </button>
` + target1;

if (content.includes(target1) && !content.includes('openEditPostModal')) {
    content = content.replace(target1, replacement1);
    console.log('Target 1 replaced successfully.');
} else {
    console.log('Target 1 NOT replaced.');
}

const target2 = `    deletePost: async function (itemId, type, containerId) {`;
const replacement2 = `    openEditPostModal: async function(itemId, type, containerId) {
        try {
            const db = this.getDb();
            const table = type === 'project' ? 'projects' : 'showcase_items';
            const { data, error } = await db.from(table).select('description').eq('id', itemId).single();
            if (error) throw error;
            
            const modalId = 'dtc-edit-post-modal';
            let existing = document.getElementById(modalId);
            if (existing) existing.remove();

            const modalHtml = \`
                <div id="\${modalId}" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100000; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; border-radius: 20px; width: 90%; max-width: 500px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); position: relative;">
                        <button onclick="document.getElementById('\${modalId}').remove()" style="position: absolute; right: 16px; top: 16px; background: #f1f5f9; border: none; font-size: 1.2rem; color: #64748b; cursor: pointer; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">&times;</button>
                        <h3 style="margin-top: 0; color: #0f172a; font-size: 1.25rem;">Modifier la publication</h3>
                        <textarea id="\${modalId}-textarea" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; min-height: 150px; font-family: inherit; font-size: 1rem; margin-bottom: 16px; outline: none; resize: vertical;">\${data.description || ''}</textarea>
                        <div style="display: flex; justify-content: flex-end; gap: 8px;">
                            <button onclick="document.getElementById('\${modalId}').remove()" style="padding: 10px 16px; border-radius: 10px; border: none; background: #f1f5f9; color: #64748b; font-weight: 700; cursor: pointer;">Annuler</button>
                            <button id="\${modalId}-save-btn" style="padding: 10px 20px; border-radius: 10px; border: none; background: #3b82f6; color: white; font-weight: 700; cursor: pointer;">Enregistrer</button>
                        </div>
                    </div>
                </div>
            \`;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            document.getElementById(\`\${modalId}-save-btn\`).onclick = async () => {
                const newDesc = document.getElementById(\`\${modalId}-textarea\`).value;
                document.getElementById(\`\${modalId}-save-btn\`).innerText = 'Sauvegarde...';
                document.getElementById(\`\${modalId}-save-btn\`).disabled = true;
                
                const { error: updateErr } = await db.from(table).update({ description: newDesc }).eq('id', itemId);
                if (updateErr) {
                    alert("Erreur lors de la modification.");
                    console.error(updateErr);
                    document.getElementById(\`\${modalId}-save-btn\`).innerText = 'Enregistrer';
                    document.getElementById(\`\${modalId}-save-btn\`).disabled = false;
                } else {
                    document.getElementById(modalId).remove();
                    if (containerId === 'channel-feed-container' && window.ChannelModule) {
                        const currentChannelId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                        window.ChannelModule.renderChannel(currentChannelId, 'view-channel');
                    } else {
                        this.renderFeed(containerId);
                    }
                }
            };
        } catch(e) {
            console.error(e);
            alert("Erreur lors de la récupération de la publication.");
        }
    },

` + target2;

if (content.includes(target2) && !content.includes('openEditPostModal')) {
    content = content.replace(target2, replacement2);
    console.log('Target 2 replaced successfully.');
} else {
    console.log('Target 2 NOT replaced.');
}

fs.writeFileSync(file, content, 'utf8');
console.log('File updated successfully.');
