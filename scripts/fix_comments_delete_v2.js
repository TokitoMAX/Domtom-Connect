const fs = require('fs');

let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

c = c.replace(
    '<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">',
    `\${currentUser && currentUser.id === c.user_id ? \`<button onclick="MomentsModule.deleteComment('\${c.id}', '\${item.id}', '\${containerId}')" style="position: absolute; right: -8px; top: -8px; background: white; border: 1px solid #e2e8f0; width: 24px; height: 24px; border-radius: 50%; color: #94a3b8; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" title="Supprimer ce commentaire" onmouseover="this.style.color='#ef4444'; this.style.borderColor='#ef4444';" onmouseout="this.style.color='#94a3b8'; this.style.borderColor='#e2e8f0';"><i class="fas fa-trash-alt"></i></button>\` : ''}
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">`
);

c = c.replace(
    '<div style="background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02);">',
    '<div style="background: #f8fafc; padding: 12px 16px; border-radius: 4px 16px 16px 16px; border: 1px solid rgba(0,0,0,0.02); position: relative;">'
);

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
console.log('Fixed renderComment to include delete button');
