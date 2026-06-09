/**
 * Showcase Module - Domtom Connect (Minimalist Linktree Approach)
 */

const ShowcaseModule = {
    getIconForCategory: (cat) => {
        if (cat === 'service') return '📦';
        return '🔗';
    },

    renderManager: async (container) => {
        if (!container) return;
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;

        container.innerHTML = `<div style="text-align:center;padding:100px;"><span class="loader"></span></div>`;

        try {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).in('category', ['linktree', 'link', 'service']).order('created_at', { ascending: false });
            const publicUrl = window.location.origin + '/showcase.html?id=' + session.user.id;

            let itemsHtml = '';
            if (!items || items.length === 0) {
                itemsHtml = `
                    <div style="text-align:center; padding: 40px; border: 2px dashed #cbd5e1; border-radius: 12px; color: #64748b; margin-top: 20px;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🔗</div>
                        <p style="font-weight: 600;">Vous n'avez pas encore ajouté de liens.</p>
                    </div>
                `;
            } else {
                itemsHtml = items.map(item => `
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: 1.5rem;">${ShowcaseModule.getIconForCategory(item.category)}</div>
                            <div>
                                <h4 style="margin: 0; font-size: 1rem; color: #0f172a;">${item.title || 'Sans titre'}</h4>
                                <a href="${item.url || item.description || '#'}" target="_blank" style="font-size: 0.85rem; color: #3b82f6; text-decoration: none;">${item.url || item.description || 'Pas de lien'}</a>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="ShowcaseModule.editItem('${item.id}')" style="background: #f1f5f9; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; color: #475569; font-weight: 600;">Modifier</button>
                            <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; color: #ef4444; font-weight: 600;">Supprimer</button>
                        </div>
                    </div>
                `).join('');
            }

            container.innerHTML = `
                <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: 'Inter', sans-serif;">
                    
                    <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <h1 style="margin: 0 0 10px 0; color: #0f172a; font-size: 1.8rem; font-weight: 800;">Mes Liens</h1>
                        <p style="margin: 0 0 20px 0; color: #64748b;">Gérez les liens qui apparaîtront sur votre page publique.</p>
                        
                        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <span>+ Ajouter un Lien</span>
                            </button>
                            <a href="${publicUrl}" target="_blank" style="background: white; color: #0f172a; border: 1px solid #e2e8f0; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: flex; align-items: center; gap: 8px;">
                                <span>Voir ma page publique</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        ${itemsHtml}
                    </div>
                </div>
            `;
        } catch (err) {
            console.error(err);
            container.innerHTML = `<div style="color:red;padding:20px;">Erreur de chargement de la vitrine.</div>`;
        }
    },

    openItemModal: async (itemId = null) => {
        let existingItem = null;
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            existingItem = data;
        }

        const overlay = document.getElementById('details-modal-overlay');
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 16px; padding: 32px; position: relative; font-family: 'Inter', sans-serif;">
                <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">×</button>
                <h2 style="margin: 0 0 24px 0; color: #0f172a; font-weight: 800;">${itemId ? 'Modifier le Lien' : 'Nouveau Lien'}</h2>
                
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #475569; font-size: 0.9rem;">Titre du lien</label>
                        <input type="text" id="item-title" placeholder="Ex: Mon Site Web, Prendre Rendez-vous..." value="${existingItem?.title || ''}" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #475569; font-size: 0.9rem;">URL (Lien de destination)</label>
                        <input type="url" id="item-url" placeholder="https://..." value="${existingItem?.url || existingItem?.description || ''}" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                    </div>

                    <button onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background: #0f172a; color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 8px; font-size: 1rem;">
                        Enregistrer
                    </button>
                </div>
            </div>
        `;
    },

    saveItem: async (itemId) => {
        const title = document.getElementById('item-title').value.trim();
        const url = document.getElementById('item-url').value.trim();

        if (!title || !url) return alert("Veuillez remplir le titre et l'URL.");

        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;

        const payload = {
            title: title,
            url: url,
            description: url, // Store URL in description for retro-compatibility
            category: 'linktree'
        };

        try {
            if (itemId) {
                await window._supabase.from('showcase_items').update(payload).eq('id', itemId);
            } else {
                await window._supabase.from('showcase_items').insert({ ...payload, user_id: session.user.id });
            }
            document.getElementById('details-modal-overlay').style.display = 'none';
            ShowcaseModule.renderManager(document.getElementById('vitrine-view') || document.getElementById('ecosystem-grid-container'));
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la sauvegarde.");
        }
    },

    deleteItem: async (id) => {
        if (!confirm("Voulez-vous vraiment supprimer ce lien ?")) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        ShowcaseModule.renderManager(document.getElementById('vitrine-view') || document.getElementById('ecosystem-grid-container'));
    },

    renderPublicShowcase: async (container, providerId) => {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;"><span class="loader"></span></div>`;
        try {
            const { data: provider, error: providerError } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            if (providerError) throw providerError;

            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).in('category', ['linktree', 'link', 'service']).order('created_at', { ascending: false });

            // Minimalist styling logic
            const bgStr = '#f8fafc';
            const cardBg = '#ffffff';
            const textStr = '#0f172a';
            const btnBg = '#0f172a';
            const btnText = '#ffffff';

            const avatarUrl = provider.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(provider.full_name) + '&background=0f172a&color=fff';

            let itemsHtml = '';
            if (items && items.length > 0) {
                itemsHtml = items.map(item => {
                    let url = item.url || item.description || '#';
                    if (url !== '#' && !url.startsWith('http')) url = 'https://' + url;
                    
                    return `
                        <a href="${url}" target="_blank" style="display: block; width: 100%; background: ${cardBg}; color: ${textStr}; text-decoration: none; padding: 18px 24px; border-radius: 12px; margin-bottom: 16px; font-weight: 600; font-size: 1.05rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; transition: transform 0.2s, box-shadow 0.2s; box-sizing: border-box;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)';">
                            ${item.title || 'Lien'}
                        </a>
                    `;
                }).join('');
            } else {
                itemsHtml = `<p style="text-align: center; color: #64748b;">Aucun lien disponible.</p>`;
            }

            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: ${bgStr}; min-height: 100vh; display: flex; justify-content: center; padding: 60px 20px;">
                    <div style="width: 100%; max-width: 480px;">
                        
                        <div style="text-align: center; margin-bottom: 40px;">
                            <img src="${avatarUrl}" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid white;">
                            <h1 style="margin: 0 0 8px 0; color: ${textStr}; font-size: 1.5rem; font-weight: 800;">${provider.full_name}</h1>
                            <p style="margin: 0; color: #64748b; font-size: 1rem;">${provider.role === 'entreprise' ? 'Nos Solutions' : 'Mes Liens'}</p>
                        </div>

                        <div>
                            ${itemsHtml}
                        </div>
                        
                        <div style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <a href="https://domtomconnect.com" style="color: #94a3b8; text-decoration: none; font-size: 0.85rem; font-weight: 600;">Propulsé par Domtom Connect</a>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            console.error(err);
            container.innerHTML = `<div style="text-align:center;padding:40px;color:red;">Erreur lors du chargement de la page.</div>`;
        }
    }
};

window.ShowcaseModule = ShowcaseModule;
