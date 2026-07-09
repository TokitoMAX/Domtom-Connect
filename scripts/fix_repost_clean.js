const fs = require('fs');
let c = fs.readFileSync('assets/js/modules/moments.module.v2.js', 'utf8');

c = c.replace(
    'renderFeedItemHTML: function (item, currentUser, containerId, embedMode = false) {',
    `renderFeedItemHTML: function (item, currentUser, containerId, embedMode = false) {
        let isPureRepost = false;
        let reposterName = '';
        if (item && item.type === 'repost' && item.meta && (!item.description || !item.description.trim())) {
            try {
                const quoteData = JSON.parse(item.meta);
                reposterName = item.authorName;
                item.authorName = quoteData.authorName || 'Inconnu';
                item.authorAvatar = quoteData.authorAvatar;
                item.description = quoteData.content || '';
                item.imageUrl = quoteData.imageUrl;
                item.type = 'status'; // Remove repost style
                isPureRepost = true;
            } catch(e) {}
        }`
);

c = c.replace(
    '${isPinned ? `<div style="position: absolute; top: 12px; right: 12px; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 4px; z-index: 2;"><i class="fas fa-thumbtack" style="font-size: 0.6rem;"></i> Épinglé</div>` : \'\'}',
    `\${isPinned ? \`<div style="position: absolute; top: 12px; right: 12px; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 4px; z-index: 2;"><i class="fas fa-thumbtack" style="font-size: 0.6rem;"></i> Épinglé</div>\` : ''}
                \${isPureRepost ? \`<div style="font-size: 0.8rem; color: #64748b; font-weight: 800; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; margin-top: -4px;"><i class="fas fa-retweet" style="color: #10b981;"></i> \${reposterName} a republié</div>\` : ''}`
);

fs.writeFileSync('assets/js/modules/moments.module.v2.js', c);
console.log('Successfully updated JS.');
