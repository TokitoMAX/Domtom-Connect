const fs = require('fs');
let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

const oldRenderHTML = `    renderFeedItemHTML: function (item, currentUser, containerId, embedMode = false) {
        if (!item) return '';`;

const newRenderHTML = `    renderFeedItemHTML: function (item, currentUser, containerId, embedMode = false) {
        if (!item) return '';
        
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
                item.type = 'status';
                isPureRepost = true;
            } catch(e) {}
        }`;

let oldRegex = oldRenderHTML.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n');
let regex = new RegExp(oldRegex);

if (regex.test(c)) {
    c = c.replace(regex, newRenderHTML);
    console.log('Fixed renderFeedItemHTML start');
} else {
    console.log('renderFeedItemHTML not matched!');
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

let oldCardRegex = oldCardStart.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\r?\\n');
let regexCard = new RegExp(oldCardRegex);

if (regexCard.test(c)) {
    c = c.replace(regexCard, newCardStart);
    console.log('Fixed card header start');
} else {
    console.log('card header start not matched!');
}

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
