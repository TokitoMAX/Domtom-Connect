/**
 * Showcase Module - Domtom Connect
 * Version "Linktree Mode"
 */
const ShowcaseModule = {
    /**
     * DASHBOARD EXPERT - Hub "Mes Liens" (Linktree)
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; color: #000; padding: 40px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px;">
                        <div>
                            <h2 style="font-size: 2.4rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Mes Liens & Services</h2>
                            <p style="color: #64748b; font-weight: 750; margin-top:5px;">Mode Linktree : Ajoutez des liens vers vos réseaux, formulaires ou services externes.</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #000; color: #fff; border: none; padding: 14px 28px; border-radius: 100px; font-weight: 950; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Ajouter un Lien
                            </button>
                        </div>
                    </div>

                    <!-- SECTION CATALOGUE -->
                    <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 18px;">
                        ${(!items || items.length === 0) ? `<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:800; font-style:italic; background:#f8fafc; border-radius:30px;">Aucun lien actif pour le moment.</div>` : 
                        items.map(item => `
                            <div style="background: #fff; padding: 18px 25px; border-radius: 100px; border: 2.5px solid #000; display: flex; align-items: center; justify-content: space-between; box-shadow: 5px 5px 0px #000;">
                                <div style="display: flex; align-items: center; gap: 20px; overflow:hidden;">
                                    <div style="width:55px; height:55px; border-radius:50%; border:2.5px solid #000; overflow:hidden; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color: #000; flex-shrink:0;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    </div>
                                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width:400px;">
                                        <div style="font-weight: 950; font-size: 1.2rem; color:#000;">${item.title}</div>
                                        <div style="font-size: 0.9rem; color: #10b981; font-weight: 750;">${item.url || item.description || 'Pas de lien'}</div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; width:44px; height:44px; border-radius:100px; cursor:pointer; display:flex; align-items:center; justify-content:center; color: #000;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; width:44px; height:44px; border-radius:100px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top:80px; text-align:center;">
                         <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background:transparent; border:none; font-weight:900; font-size:0.95rem; text-decoration:underline; cursor:pointer; color:#64748b;">Aperçu de ma Vitrine Publique 🔗</button>
                    </div>

                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async openItemModal(itemId = null) {
        let item = { title: '', description: '', url: '' };
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            item = data;
        }
        
        let overlay = document.getElementById('details-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'details-modal-overlay';
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.5)', zIndex: '999999', display: 'none',
                alignItems: 'center', justifyContent: 'center', padding: '20px'
            });
            document.body.appendChild(overlay);
        }
        
        overlay.style.display = 'flex';

        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 40px; border: 4px solid #000; box-shadow: 15px 15px 0px #000; position:relative; overflow-y:auto; max-height:90vh;">
                <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position:absolute; top:20px; right:20px; background:#f1f5f9; border:none; width:40px; height:40px; border-radius:50%; font-weight:900; cursor:pointer;">X</button>
                <h3 style="margin:0 0 25px 0; font-weight:950; font-size:1.6rem; letter-spacing:-0.05em; text-align:center; color:#000;">${itemId ? 'Éditer mon lien' : 'Nouveau lien'}</h3>
                
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="margin-bottom: 10px;">
                        <label style="font-weight: 900; font-size: 0.9rem; color:#64748b; display:block; margin-bottom:8px;">Titre du Bouton</label>
                        <input id="modal-item-title" type="text" value="${item.title}" placeholder="Ex: Mon Site Web, Prendre RDV..." style="width:100%; padding:15px; border-radius:15px; border:3px solid #000; font-weight:950; font-size:1rem; font-family:'Inter';">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: 900; font-size: 0.9rem; color:#64748b; display:block; margin-bottom:8px;">URL (Lien de redirection)</label>
                        <input id="modal-item-url" type="url" value="${item.url || item.description || ''}" placeholder="https://..." style="width:100%; padding:15px; border-radius:15px; border:3px solid #000; font-weight:750; font-size:1rem; font-family:'Inter';">
                    </div>

                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button id="save-item-btn" onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:#000; color:#fff; border:none; padding:20px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1.1rem;">Valider le lien</button>
                        <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="background:transparent; color:#64748b; border:none; font-weight:900; cursor:pointer; font-size:1rem;">Annuler</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem(itemId) {
        const title = document.getElementById('modal-item-title').value;
        const url = document.getElementById('modal-item-url').value;
        
        if (!title || !url) return alert("Veuillez remplir le titre et le lien.");

        const btn = document.getElementById('save-item-btn');
        btn.innerText = "Sauvegarde..."; btn.disabled = true;

        const { data: { session } } = await window._supabase.auth.getSession();
        
        try {
            // We use 'description' column to store URL for backward compatibility if 'url' column is missing
            const updateData = { title: title, description: url, price: 0, status: 'active', category: 'linktree' };
            
            // Try to set 'url' column as well, it might fail if column doesn't exist yet but Supabase handles it if we just use description
            // Actually it's safer to just set description
            
            if (itemId) await window._supabase.from('showcase_items').update(updateData).eq('id', itemId);
            else await window._supabase.from('showcase_items').insert({ ...updateData, user_id: session.user.id });
            
            document.getElementById('details-modal-overlay').style.display = 'none';
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if (!confirm("Voulez-vous retirer ce lien ?")) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

    editItem(id) {
        this.openItemModal(id);
    },

    /**
     * VITRINE PUBLIQUE - Linktree Mode
     */
    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: #fff; min-height: 100vh; padding: 60px 20px; display: flex; flex-direction: column; align-items: center;">
                    <div style="text-align: center; margin-bottom: 60px; max-width: 450px;">
                        <div style="width: 120px; height: 120px; background: #000; border-radius: 50%; margin: 0 auto 30px; border: 5px solid #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.12); overflow:hidden; position:relative; display: flex; align-items: center; justify-content: center;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3.8rem; font-weight:950;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 2.2rem; font-weight: 950; margin: 0; color: #000; letter-spacing: -0.06em;">${provider.full_name}</h1>
                        <p style="font-size: 1.15rem; color: #64748b; font-weight: 750; margin: 12px 0 0 0;">${provider.role === 'entreprise' ? 'Nos Solutions & Services' : 'Mes Services & Réseaux'}</p>
                    </div>
                    <div style="width: 100%; max-width: 550px; display: flex; flex-direction: column; gap: 20px;">
                        ${(!items || items.length === 0) ? `<div style="text-align:center; padding:30px; color:#94a3b8; font-weight:800; font-style:italic;">Aucun lien disponible.</div>` : 
                        items.map(item => {
                            let url = item.url || item.description || '#';
                            if (url !== '#' && !url.startsWith('http://') && !url.startsWith('https://')) {
                                url = 'https://' + url;
                            }
                            return `
                                <a href="${url}" target="_blank" style="text-decoration:none; background: #fff; border: 3px solid #000; border-radius: 30px; padding: 22px 30px; cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 0px #000; text-align:center;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 0px #000';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 0px #000';">
                                    <div style="font-weight: 950; font-size: 1.25rem; color: #000; letter-spacing:-0.03em;">${item.title}</div>
                                </a>
                            `;
                        }).join('')}
                    </div>
                    <div style="margin-top:70px; font-size:0.8rem; font-weight:950; color:#cbd5e1; letter-spacing:0.1em; text-transform:uppercase;">Propulsé par Domtom Connect</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
