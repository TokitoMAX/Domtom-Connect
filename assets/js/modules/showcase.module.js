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
            
            const publicUrl = window.location.origin + '/showcase.html?id=' + session.user.id;

            container.innerHTML = `
                <div>
                    <div style="margin-bottom: 24px;">
                            <h2 style="font-size: 2.2rem; font-weight: 950; letter-spacing: -0.05em; margin: 0; color: #0f172a;">Liens & Services</h2>
                            <p style="color: #64748b; font-size: 1rem; margin-top:8px;">Gérez vos liens publics, réseaux sociaux et services externes.</p>
                        </div>
                        
                        <!-- Link Copy Box -->
                        <div style="background: white; border-radius: 20px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 16px;">
                            <div style="display: flex; align-items: center; gap: 12px; overflow: hidden; flex: 1; min-width: 200px;">
                                <div style="background: rgba(16,185,129,0.1); color: #10b981; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink:0;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                </div>
                                <div style="overflow: hidden;">
                                    <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Votre vitrine publique</div>
                                    <a href="${publicUrl}" target="_blank" style="font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                                        ${publicUrl.replace('https://', '')}
                                    </a>
                                </div>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button onclick="navigator.clipboard.writeText('${publicUrl}').then(() => alert('✅ Lien copié dans le presse-papier ! Vous pouvez le coller dans votre bio Instagram, TikTok, LinkedIn...'));" style="background: white; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 100px; font-weight: 800; font-size: 0.9rem; cursor: pointer; color: #0f172a; transition: 0.2s; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#f1f5f9'">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    Copier
                                </button>
                                <a href="${publicUrl}" target="_blank" style="background: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 100px; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: 0.2s;" onmouseover="this.style.background='#e2e8f0'">
                                    Ouvrir
                                </a>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; margin-bottom: 24px;">
                            <button onclick="ShowcaseModule.openItemModal()" style="flex: 1; background: #10b981; color: white; border: none; padding: 18px; border-radius: 100px; font-weight: 900; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 10px 25px rgba(16,185,129,0.25); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Ajouter un Élément
                            </button>
                            <button onclick="ShowcaseModule.openSettingsModal()" style="background: #0f172a; color: white; border: none; padding: 18px 24px; border-radius: 100px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'" title="Design & Mode Sombre">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>
                        </div>

                        <!-- SECTION CATALOGUE -->
                        <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 16px;">
                            ${(!items || items.length === 0) ? `<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:700; background:#f8fafc; border-radius:20px; border: 1px dashed #cbd5e1;">Aucun lien actif pour le moment. Créez-en un pour commencer !</div>` : 
                            items.map(item => {
                                let meta = {};
                                let isService = item.category === 'service';
                                if (isService && item.description && item.description.startsWith('{')) {
                                    try { meta = JSON.parse(item.description); } catch(e){}
                                }
                                let displayUrl = isService ? (meta.url || '') : (item.url || item.description || '');
                                
                                return `
                                <div style="background: white; padding: 20px 24px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
                                    <div style="display: flex; align-items: center; gap: 20px; overflow:hidden;">
                                        <div style="width:50px; height:50px; border-radius:14px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color: #3b82f6; flex-shrink:0;">
                                            ${isService && meta.image ? `<img src="${meta.image}" style="width:100%; height:100%; object-fit:cover; border-radius:14px;">` : ShowcaseModule.getIconForTitle(item.title)}
                                        </div>
                                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width:400px;">
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <div style="font-weight: 800; font-size: 1.15rem; color:#0f172a;">${item.title}</div>
                                                ${isService ? `<span style="background: #fdf2f8; color: #db2777; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 10px;">Service</span>` : ''}
                                            </div>
                                            <div style="font-size: 0.9rem; color: #64748b; font-weight: 600; margin-top: 4px;">${displayUrl || 'Pas de lien'}</div>
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; width:40px; height:40px; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; color: #64748b; transition: 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </button>
                                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; width:40px; height:40px; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: 0.2s;" onmouseover="this.style.background='#ffe4e6'" onmouseout="this.style.background='#fff1f2'">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async openItemModal(itemId = null) {
        let item = { title: '', description: '', url: '', category: 'link', price: 0 };
        let meta = { url: '', image: '', description: '' };
        
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            item = data;
            if (item.category === 'service' && item.description && item.description.startsWith('{')) {
                try { meta = JSON.parse(item.description); } catch(e){}
            } else {
                meta.url = item.url || item.description || '';
            }
        }
        
        let overlay = document.getElementById('details-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'details-modal-overlay';
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.6)', zIndex: '999999', display: 'none',
                alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)'
            });
            document.body.appendChild(overlay);
        }
        
        overlay.style.display = 'flex';

        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 550px; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.2); position:relative; overflow-y:auto; max-height:90vh;">
                <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position:absolute; top:20px; right:20px; background:#f1f5f9; border:none; width:36px; height:36px; border-radius:50%; font-weight:900; cursor:pointer; color: #64748b;">X</button>
                <h3 style="margin:0 0 25px 0; font-weight:900; font-size:1.5rem; letter-spacing:-0.03em; color:#0f172a;">${itemId ? 'Modifier l\'Élément' : 'Ajouter un Élément'}</h3>
                
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="display: flex; background: #f1f5f9; padding: 6px; border-radius: 16px;">
                        <button id="tab-link" onclick="ShowcaseModule.toggleModalTab('link')" style="flex:1; padding:12px; border-radius:12px; border:none; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; ${item.category !== 'service' ? 'background:#fff; color:#0f172a; box-shadow:0 2px 8px rgba(0,0,0,0.05);' : 'background:transparent; color:#64748b;'}">🔗 Lien Simple</button>
                        <button id="tab-service" onclick="ShowcaseModule.toggleModalTab('service')" style="flex:1; padding:12px; border-radius:12px; border:none; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; ${item.category === 'service' ? 'background:#fff; color:#0f172a; box-shadow:0 2px 8px rgba(0,0,0,0.05);' : 'background:transparent; color:#64748b;'}">📦 Service / Article</button>
                    </div>

                    <input type="hidden" id="modal-item-type" value="${item.category === 'service' ? 'service' : 'link'}">

                    <div>
                        <label style="font-weight: 800; font-size: 0.9rem; color:#64748b; display:block; margin-bottom:8px;">Titre principal</label>
                        <input id="modal-item-title" type="text" value="${item.title}" placeholder="Ex: Mon Site Web, Consultation 1h..." style="width:100%; padding:15px; border-radius:12px; border:1px solid #cbd5e1; font-weight:600; font-size:1rem; font-family:'Inter'; outline:none;">
                    </div>
                    
                    <div>
                        <label style="font-weight: 800; font-size: 0.9rem; color:#64748b; display:block; margin-bottom:8px;">URL de redirection</label>
                        <input id="modal-item-url" type="url" value="${item.category === 'service' ? meta.url : (item.url || item.description || '')}" placeholder="https://..." style="width:100%; padding:15px; border-radius:12px; border:1px solid #cbd5e1; font-weight:500; font-size:1rem; font-family:'Inter'; outline:none;">
                    </div>

                    <div id="service-fields" style="display: ${item.category === 'service' ? 'flex' : 'none'}; flex-direction:column; gap:20px; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px dashed #cbd5e1;">
                        <div>
                            <label style="font-weight: 800; font-size: 0.9rem; color:#64748b; display:block; margin-bottom:8px;">Description de l'article</label>
                            <textarea id="modal-item-desc" rows="3" placeholder="Décrivez votre service..." style="width:100%; padding:15px; border-radius:12px; border:1px solid #cbd5e1; font-weight:500; font-size:0.95rem; font-family:'Inter'; outline:none; resize:none;">${meta.description || ''}</textarea>
                        </div>
                        <div style="display: flex; gap: 16px;">
                            <div style="flex:1;">
                                <label style="font-weight: 800; font-size: 0.9rem; color:#64748b; display:block; margin-bottom:8px;">Prix (€) <span style="font-weight:400">(Optionnel)</span></label>
                                <input id="modal-item-price" type="number" step="0.01" value="${item.price || 0}" style="width:100%; padding:15px; border-radius:12px; border:1px solid #cbd5e1; font-weight:600; font-size:1rem; font-family:'Inter'; outline:none;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-weight: 800; font-size: 0.9rem; color:#64748b; display:block; margin-bottom:8px;">Visuel (URL de l'image)</label>
                                <input id="modal-item-image" type="url" value="${meta.image || ''}" placeholder="https://..." style="width:100%; padding:15px; border-radius:12px; border:1px solid #cbd5e1; font-weight:500; font-size:1rem; font-family:'Inter'; outline:none;">
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:10px; margin-top: 10px;">
                        <button id="save-item-btn" onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:#10b981; color:#fff; border:none; padding:16px; border-radius:14px; font-weight:800; cursor:pointer; font-size:1.1rem; transition: 0.2s;">Sauvegarder</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    toggleModalTab(type) {
        document.getElementById('modal-item-type').value = type;
        const linkTab = document.getElementById('tab-link');
        const serviceTab = document.getElementById('tab-service');
        const serviceFields = document.getElementById('service-fields');

        if (type === 'service') {
            serviceTab.style.background = '#fff'; serviceTab.style.color = '#0f172a'; serviceTab.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            linkTab.style.background = 'transparent'; linkTab.style.color = '#64748b'; linkTab.style.boxShadow = 'none';
            serviceFields.style.display = 'flex';
        } else {
            linkTab.style.background = '#fff'; linkTab.style.color = '#0f172a'; linkTab.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            serviceTab.style.background = 'transparent'; serviceTab.style.color = '#64748b'; serviceTab.style.boxShadow = 'none';
            serviceFields.style.display = 'none';
        }
    },

    async saveItem(itemId) {
        const title = document.getElementById('modal-item-title').value;
        const url = document.getElementById('modal-item-url').value;
        const type = document.getElementById('modal-item-type').value;
        
        if (!title || !url) return alert("Veuillez remplir au minimum le titre et le lien de redirection.");

        const btn = document.getElementById('save-item-btn');
        btn.innerText = "Sauvegarde..."; btn.disabled = true;

        const { data: { session } } = await window._supabase.auth.getSession();
        
        let price = 0;
        let descriptionValue = url; // fallback to URL if simple link
        let category = 'linktree';

        if (type === 'service') {
            category = 'service';
            price = parseFloat(document.getElementById('modal-item-price').value) || 0;
            const desc = document.getElementById('modal-item-desc').value;
            const img = document.getElementById('modal-item-image').value;
            descriptionValue = JSON.stringify({ url: url, description: desc, image: img });
        }
        
        try {
            const updateData = { title: title, description: descriptionValue, price: price, status: 'active', category: category };
            
            let response;
            if (itemId) {
                response = await window._supabase.from('showcase_items').update(updateData).eq('id', itemId);
            } else {
                response = await window._supabase.from('showcase_items').insert({ ...updateData, user_id: session.user.id });
            }
            if (response.error) throw response.error;
            
            document.getElementById('details-modal-overlay').style.display = 'none';
            if (window.App && window.App.showView) {
                window.App.showView('vitrine', true);
            } else {
                this.renderManager(document.getElementById('ecosystem-grid-container'));
            }
        } catch (err) { alert(err.message); }
    },

    async openSettingsModal() {
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: profile } = await window._supabase.from('profiles').select('meta_info').eq('id', session.user.id).single();
        let meta = profile?.meta_info || {};
        let isDark = meta.theme === 'dark';

        let overlay = document.getElementById('details-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'details-modal-overlay';
            Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: '999999', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' });
            document.body.appendChild(overlay);
        } else { overlay.style.display = 'flex'; }

        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 450px; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.2); position:relative;">
                <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position:absolute; top:20px; right:20px; background:#f1f5f9; border:none; width:36px; height:36px; border-radius:50%; font-weight:900; cursor:pointer; color: #64748b;">X</button>
                <h3 style="margin:0 0 10px 0; font-weight:900; font-size:1.5rem; letter-spacing:-0.03em; color:#0f172a;">Design & Mode Sombre</h3>
                <p style="color:#64748b; font-size:0.95rem; margin-bottom: 30px;">Personnalisez l'apparence de votre page publique.</p>
                
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 800; color: #0f172a; font-size: 1.1rem;">Mode Sombre</div>
                        <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Appliquer le thème sombre à votre vitrine.</div>
                    </div>
                    <label style="position: relative; display: inline-block; width: 50px; height: 28px;">
                        <input type="checkbox" id="theme-toggle-switch" style="opacity: 0; width: 0; height: 0;" ${isDark ? 'checked' : ''}>
                        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isDark ? '#10b981' : '#cbd5e1'}; transition: .4s; border-radius: 34px;">
                            <span style="position: absolute; content: ''; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; transform: ${isDark ? 'translateX(22px)' : 'translateX(0)'};" id="theme-toggle-slider"></span>
                        </span>
                    </label>
                </div>

                <div style="margin-top: 30px;">
                    <button id="save-settings-btn" onclick="ShowcaseModule.saveSettings()" style="width: 100%; background:#0f172a; color:#fff; border:none; padding:16px; border-radius:14px; font-weight:800; cursor:pointer; font-size:1.1rem; transition: 0.2s;">Appliquer le thème</button>
                </div>
            </div>
        `;
        
        // Add toggle listener
        document.getElementById('theme-toggle-switch').addEventListener('change', function(e) {
            const slider = document.getElementById('theme-toggle-slider');
            if (e.target.checked) {
                this.nextElementSibling.style.backgroundColor = '#10b981';
                slider.style.transform = 'translateX(22px)';
            } else {
                this.nextElementSibling.style.backgroundColor = '#cbd5e1';
                slider.style.transform = 'translateX(0)';
            }
        });
    },

    async saveSettings() {
        const isDark = document.getElementById('theme-toggle-switch').checked;
        const btn = document.getElementById('save-settings-btn');
        btn.innerText = "Sauvegarde..."; btn.disabled = true;

        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: profile } = await window._supabase.from('profiles').select('meta_info').eq('id', session.user.id).single();
        let meta = profile?.meta_info || {};
        meta.theme = isDark ? 'dark' : 'light';

        try {
            await window._supabase.from('profiles').update({ meta_info: meta }).eq('id', session.user.id);
            document.getElementById('details-modal-overlay').style.display = 'none';
            if (window.App && window.App.showView) window.App.showView('vitrine', true);
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if (!confirm("Voulez-vous retirer ce lien ?")) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        if (window.App && window.App.showView) {
            window.App.showView('vitrine', true);
        } else {
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
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
            const { data: provider, error: providerError } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            if (providerError) throw providerError;
            if (!provider) throw new Error("Profil introuvable");
            
            const { data: items, error: itemsError } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            if (itemsError) throw itemsError;

            // Theme setup
            const meta = provider.meta_info || {};
            const isDark = meta.theme === 'dark';
            const bgStr = isDark ? '#0f172a' : '#fff';
            const textStr = isDark ? '#f8fafc' : '#000';
            const subTextStr = isDark ? '#94a3b8' : '#64748b';
            const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : '#fff';
            const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0';
            const itemBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc';
            const titleCol = isDark ? '#fff' : '#0f172a';

            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: ${bgStr}; min-height: 100vh; padding: 60px 20px; display: flex; flex-direction: column; align-items: center; transition: background 0.3s;">
                    <div style="text-align: center; margin-bottom: 30px; max-width: 450px;">
                        <div style="width: 120px; height: 120px; background: #000; border-radius: 50%; margin: 0 auto 30px; border: 5px solid ${isDark ? '#1e293b' : '#fff'}; box-shadow: 0 15px 35px rgba(0,0,0,0.2); overflow:hidden; position:relative; display: flex; align-items: center; justify-content: center;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3.8rem; font-weight:950;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 2.2rem; font-weight: 950; margin: 0; color: ${textStr}; letter-spacing: -0.06em;">${provider.full_name}</h1>
                        <p style="font-size: 1.15rem; color: ${subTextStr}; font-weight: 750; margin: 12px 0 0 0;">${provider.role === 'entreprise' ? 'Nos Solutions & Services' : 'Mes Services & Réseaux'}</p>
                    </div>

                    ${(function() {
                        const socialKeywords = ['instagram', 'linkedin', 'facebook', 'twitter', 'tiktok', 'youtube', 'x', 'whatsapp'];
                        const socialItems = items.filter(i => i.category !== 'service' && socialKeywords.some(k => (i.title || '').toLowerCase().includes(k)));
                        const standardItems = items.filter(i => i.category !== 'service' && !socialKeywords.some(k => (i.title || '').toLowerCase().includes(k)));
                        const serviceItems = items.filter(i => i.category === 'service');

                        let html = '';

                        // Render Social Links Row
                        if (socialItems.length > 0) {
                            html += `<div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 40px; flex-wrap: wrap;">`;
                            html += socialItems.map(item => {
                                let url = item.url || item.description || '#';
                                if (url !== '#' && !url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
                                return `<a href="${url}" target="_blank" title="${item.title}" style="color: ${titleCol}; transition: transform 0.2s; display: block;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                                    <div style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.05); backdrop-filter: blur(10px);">
                                        ${ShowcaseModule.getIconForTitle(item.title)}
                                    </div>
                                </a>`;
                            }).join('');
                            html += `</div>`;
                        }

                        html += `<div style="width: 100%; max-width: 550px; display: flex; flex-direction: column; gap: 16px;">`;
                        
                        // Render Service/Article Cards
                        if (serviceItems.length > 0) {
                            html += serviceItems.map(item => {
                                let meta = {};
                                try { meta = JSON.parse(item.description || '{}'); } catch(e){}
                                let url = meta.url || '#';
                                if (url !== '#' && !url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
                                
                                return `
                                    <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); backdrop-filter: blur(10px);">
                                        ${meta.image ? `<div style="width: 100%; height: 200px; border-radius: 16px; overflow: hidden; background: ${itemBg};"><img src="${meta.image}" style="width: 100%; height: 100%; object-fit: cover;"></div>` : ''}
                                        <div>
                                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                                <h3 style="font-weight: 900; font-size: 1.25rem; color: ${titleCol}; margin: 0;">${item.title}</h3>
                                                ${item.price > 0 ? `<div style="font-weight: 900; font-size: 1.1rem; color: #10b981;">${item.price} €</div>` : ''}
                                            </div>
                                            ${meta.description ? `<p style="font-size: 0.95rem; color: ${subTextStr}; margin: 0 0 16px 0; line-height: 1.5;">${meta.description}</p>` : ''}
                                            <a href="${url}" target="_blank" style="display: block; text-align: center; background: #10b981; color: #fff; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 800; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                                Découvrir le service
                                            </a>
                                        </div>
                                    </div>
                                `;
                            }).join('');
                        }

                        // Render Standard Links
                        if (standardItems.length === 0 && socialItems.length === 0 && serviceItems.length === 0) {
                            html += `<div style="text-align:center; padding:30px; color:${subTextStr}; font-weight:600; font-style:italic;">Aucun contenu disponible.</div>`;
                        } else {
                            html += standardItems.map(item => {
                                let url = item.url || item.description || '#';
                                if (url !== '#' && !url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
                                return `
                                    <a href="${url}" target="_blank" style="text-decoration:none; background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 24px; padding: 22px 30px; cursor: pointer; transition: 0.3s ease; position: relative; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.04); backdrop-filter: blur(10px);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 25px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.04)';">
                                        <div style="display: flex; align-items: center; gap: 16px;">
                                            <div style="width: 48px; height: 48px; border-radius: 14px; background: ${itemBg}; color: ${isDark ? '#fff' : '#3b82f6'}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                                                ${ShowcaseModule.getIconForTitle(item.title)}
                                            </div>
                                            <div style="font-weight: 800; font-size: 1.15rem; color: ${titleCol}; letter-spacing:-0.01em;">${item.title}</div>
                                        </div>
                                        <div style="color: ${subTextStr};"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></div>
                                    </a>
                                `;
                            }).join('');
                        }
                        html += `</div>`;
                        return html;
                    })()}
                    <div style="margin-top:70px; font-size:0.8rem; font-weight:950; color:${isDark ? '#475569' : '#cbd5e1'}; letter-spacing:0.1em; text-transform:uppercase;">Propulsé par Domtom Connect</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    getIconForTitle(title) {
        if (!title) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
        
        const t = title.toLowerCase();
        if (t.includes('instagram')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;
        if (t.includes('linkedin')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;
        if (t.includes('facebook')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`;
        if (t.includes('twitter') || t === 'x') return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`;
        if (t.includes('tiktok')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`;
        if (t.includes('youtube')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`;
        if (t.includes('site') || t.includes('web') || t.includes('portfolio')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
        if (t.includes('calendly') || t.includes('rdv') || t.includes('rendez-vous') || t.includes('appel')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
        if (t.includes('whatsapp')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;

        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    }
};

window.ShowcaseModule = ShowcaseModule;
