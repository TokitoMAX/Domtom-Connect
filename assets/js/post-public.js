document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const container = document.getElementById('public-post-container');
    
    if (!postId) {
        container.innerHTML = '<div style="text-align:center;padding:100px;"><h1>Oops!</h1><p>Publication introuvable.</p></div>';
        return;
    }

    try {
        const { data: post, error } = await window._supabase
            .from('showcase_items')
            .select('*, profiles:user_id(*), likes:feed_likes(id), comments:feed_comments(id)')
            .eq('id', postId)
            .single();

        if (error || !post) {
            container.innerHTML = '<div style="text-align:center;padding:100px;"><h1>Oops!</h1><p>Cette publication n\'existe plus ou a été supprimée.</p></div>';
            return;
        }

        const author = post.profiles || {};
        const authorName = author.full_name || 'Un membre';
        const avatarUrl = author.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0f172a&color=fff`;
        const postDate = new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' });

        let likeCount = post.likes ? post.likes.length : 0;
        let commentCount = post.comments ? post.comments.length : 0;

        const escapeHTML = (str) => str.replace(/[&<>'"]/g, tag => ({'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'}[tag]));
        let safeContent = post.description ? escapeHTML(post.description) : '';
        
        const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const ytMatch = safeContent.match(ytRegex);
        let ytId = null;

        if (ytMatch && ytMatch[1]) {
            ytId = ytMatch[1];
            safeContent = safeContent.replace(ytMatch[0], '');
        }

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let formattedContent = safeContent.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" onclick="event.stopPropagation();" style="color: #3b82f6; text-decoration: underline; word-break: break-all;">${url}</a>`;
        });
        formattedContent = formattedContent.replace(/#(\w+)/g, (match, tag) => `<span style="color: #3b82f6; font-weight: 800; cursor: pointer; text-decoration: underline dotted;">#${tag}</span>`);

        let finalContentHtml = `
            <div class="dtc-text-content-wrapper" style="position: relative;">
                <div class="dtc-text-body" style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; transition: all 0.3s ease; white-space: pre-line;">
                    ${formattedContent}
                </div>
                ${(safeContent.length > 250 || safeContent.split('\\n').length > 4) ? `
                <span class="dtc-read-more" onclick="const body = this.previousElementSibling; const isTrunc = body.style.webkitLineClamp === '4'; body.style.webkitLineClamp = isTrunc ? 'unset' : '4'; this.innerText = isTrunc ? 'Voir moins' : 'Voir plus';" style="color: #64748b; font-weight: 800; cursor: pointer; display: inline-block; margin-top: 6px; font-size: 0.9rem; background: #f1f5f9; padding: 4px 10px; border-radius: 8px;">Voir plus</span>
                ` : ''}
            </div>
        `;

        let mediaHtml = '';
        if (ytId) {
            mediaHtml = `
                <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; background: #000; height: auto; aspect-ratio: 16/9; display: flex; justify-content: center; position: relative;">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${ytId}?autoplay=0&controls=1&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border: none;"></iframe>
                </div>
            `;
        } else if (post.image_url) {
            const urls = post.image_url.split(',').map(u => u.trim());
            if (urls.length === 1) {
                const url = urls[0];
                const isVideo = url.match(/\.(mp4|mov|avi|webm|quicktime)($|\?)/i);
                const isPdf = url.match(/\.(pdf)($|\?)/i);

                if (isVideo) {
                    const vidId = 'vid-' + Math.random().toString(36).substr(2, 9);
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; background: #000; max-height: 500px; display: flex; justify-content: center; position: relative;">
                            <video id="${vidId}" src="${url}" loop muted playsinline style="max-height: 500px; width: 100%; object-fit: contain; cursor: pointer;" onclick="this.muted = !this.muted;"></video>
                        </div>
                    `;
                } else if (isPdf) {
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; background: #f8fafc; padding: 24px; display: flex; justify-content: center;">
                            <a href="${url}" target="_blank" style="display: flex; flex-direction: column; align-items: center; gap: 12px; text-decoration: none; background: white; padding: 24px; border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.1); box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s; width: 100%; max-width: 300px; box-sizing: border-box;" onmouseover="this.style.transform='scale(1.02)';" onmouseout="this.style.transform='scale(1)';">
                                <i class="fas fa-file-pdf fa-3x" style="color: #ef4444;"></i>
                                <span style="font-weight: 800; color: #0f172a; text-align: center;">Ouvrir le document PDF</span>
                            </a>
                        </div>
                    `;
                } else {
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; max-height: 450px; display: flex; justify-content: center; background: #f8fafc; cursor: zoom-in;" onclick="window.open('${url}', '_blank')">
                            <img src="${url}" style="max-height: 450px; width: 100%; object-fit: cover; display: block;">
                        </div>
                    `;
                }
            } else {
                let gridHtml = '';
                if (urls.length === 2) {
                    gridHtml = urls.map(url => `
                        <div style="width: 100%; height: 100%; overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="window.open('${url}', '_blank')">
                            <img src="${url}" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `).join('');
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px; height: 350px; background: white; margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05);">
                            ${gridHtml}
                        </div>
                    `;
                } else if (urls.length === 3) {
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; height: 350px; background: white; margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05);">
                            <div style="grid-row: span 2; overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="window.open('${urls[0]}', '_blank')">
                                <img src="${urls[0]}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="window.open('${urls[1]}', '_blank')">
                                <img src="${urls[1]}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="window.open('${urls[2]}', '_blank')">
                                <img src="${urls[2]}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                        </div>
                    `;
                } else {
                    const extraCount = urls.length - 4;
                    mediaHtml = `
                        <div class="dtc-media-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; height: 350px; background: white; margin: 12px 0 0 0; width: 100%; max-width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05);">
                            ${urls.slice(0, 3).map(url => `
                                <div style="overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="window.open('${url}', '_blank')">
                                    <img src="${url}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                </div>
                            `).join('')}
                            <div style="position: relative; overflow: hidden; background: #0f172a; cursor: zoom-in;" onclick="window.open('${urls[3]}', '_blank')">
                                <img src="${urls[3]}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                ${extraCount > 0 ? `
                                <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; backdrop-filter: blur(2px);">
                                    +${extraCount}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }
            }
        }

        container.innerHTML = `
            <div class="dtc-post-card">
                <div class="dtc-post-header">
                    <img src="${avatarUrl}" alt="${authorName}" class="dtc-post-avatar">
                    <div>
                        <div class="dtc-post-author">${authorName}</div>
                        <div class="dtc-post-role">${author.role ? author.role.toUpperCase() : 'MEMBRE'}</div>
                        <div class="dtc-post-date">${postDate}</div>
                    </div>
                </div>
                
                ${post.title && post.item_type !== 'status' ? `<h2 style="margin-top:0; color: #0f172a;">${post.title}</h2>` : ''}
                
                <div class="dtc-post-content">
                    ${finalContentHtml}
                </div>

                ${mediaHtml}
                
                <div class="dtc-post-actions">
                    <button class="dtc-action-btn" onclick="promptLogin()">
                        <i class="far fa-heart"></i> J'aime (${likeCount})
                    </button>
                    <button class="dtc-action-btn" onclick="promptLogin()">
                        <i class="far fa-comment"></i> Commenter (${commentCount})
                    </button>
                    <button class="dtc-action-btn" onclick="sharePost('${postId}')">
                        <i class="fas fa-share"></i> Partager
                    </button>
                </div>
            </div>
            
            <div class="cta-box">
                <h3>Envie de réagir ?</h3>
                <p>Rejoignez gratuitement le réseau social Domtom Connect pour échanger avec ${authorName} et découvrir l'écosystème ultramarin.</p>
                <a href="register-choice.html" class="btn-join" style="display: inline-block; padding: 14px 32px; font-size: 1.1rem;">Créer mon compte gratuit</a>
                <div style="margin-top: 16px;">
                    <a href="login.html" style="color: #94a3b8; font-size: 0.9rem; text-decoration: none;">Déjà membre ? Connectez-vous</a>
                </div>
            </div>
        `;

        // Load comments logic if necessary (or just prompt login to see them)
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div style="text-align:center;padding:100px;"><h1>Erreur</h1><p>Impossible de charger la publication.</p></div>';
    }
});

function promptLogin() {
    window.location.href = "register-choice.html";
}

function sharePost(id) {
    const shareUrl = window.location.origin + '/api/share?type=post&id=' + id;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Lien de partage copié dans le presse-papier !");
    }).catch(() => {
        alert("Impossible de copier le lien. Voici le lien : " + shareUrl);
    });
}
