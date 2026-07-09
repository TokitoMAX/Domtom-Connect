const fs = require('fs');
let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

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
