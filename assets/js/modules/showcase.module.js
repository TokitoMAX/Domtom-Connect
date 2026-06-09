/**
 * Showcase Module - Domtom Connect
 * Version "Premium Linktree Mode" v11.18
 */
const ShowcaseModule = {
    /**
     * DASHBOARD - Hub "Ma Vitrine Linktree"
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;min-height:300px;"><svg style="animation:spin 1s linear infinite" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24"><circle style="opacity:.25" cx="12" cy="12" r="10" stroke="#10b981" stroke-width="4"/><path style="opacity:.75" fill="#10b981" d="M4 12a8 8 0 018-8v8H4z"/></svg><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });

            const publicUrl = window.location.origin + '/showcase.html?id=' + session.user.id;
            const totalLinks = (items || []).filter(i => i.category !== 'service').length;
            const totalServices = (items || []).filter(i => i.category === 'service').length;

            container.innerHTML = `
                <style>
                    .vtk-item { transition: all 0.25s ease; }
                    .vtk-item:hover { transform: translateX(6px); box-shadow: 0 8px 30px rgba(0,0,0,0.09) !important; }
                    .vtk-btn-icon { transition: all 0.2s; }
                    .vtk-btn-icon:hover { transform: scale(1.08); }
                </style>

                <!-- ═══════ HERO HEADER ═══════ -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1a2f4e 50%, #0f2744 100%); border-radius: 28px; padding: 36px; margin-bottom: 24px; position: relative; overflow: hidden;">
                    <div style="position:absolute;top:-70px;right:-70px;width:250px;height:250px;border-radius:50%;background:rgba(16,185,129,0.07);pointer-events:none;"></div>
                    <div style="position:absolute;bottom:-90px;left:35%;width:300px;height:300px;border-radius:50%;background:rgba(59,130,246,0.05);pointer-events:none;"></div>
                    <div style="position:absolute;top:20px;left:-40px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,0.02);pointer-events:none;"></div>

                    <div style="position:relative;z-index:1;">
                        <!-- Top row: name + stats -->
                        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:20px;margin-bottom:28px;">
                            <div>
                                <div style="font-size:0.72rem;font-weight:800;color:rgba(16,185,129,0.8);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:10px;">✦ Ma Vitrine Publique</div>
                                <h2 style="font-size:2rem;font-weight:950;letter-spacing:-0.05em;margin:0;color:#fff;line-height:1.1;">${profile?.full_name || 'Ma Vitrine'}</h2>
                                <p style="color:rgba(255,255,255,0.5);font-size:0.9rem;margin:8px 0 0 0;font-weight:500;">Votre page Linktree personnalisée sur Domtom Connect</p>
                            </div>
                            <div style="display:flex;gap:10px;">
                                <div style="text-align:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:14px 22px;backdrop-filter:blur(10px);">
                                    <div style="font-size:2rem;font-weight:950;color:#fff;line-height:1;">${totalLinks}</div>
                                    <div style="font-size:0.72rem;font-weight:800;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.06em;margin-top:4px;">Lien${totalLinks > 1 ? 's' : ''}</div>
                                </div>
                                <div style="text-align:center;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:16px;padding:14px 22px;backdrop-filter:blur(10px);">
                                    <div style="font-size:2rem;font-weight:950;color:#10b981;line-height:1;">${totalServices}</div>
                                    <div style="font-size:0.72rem;font-weight:800;color:rgba(16,185,129,0.6);text-transform:uppercase;letter-spacing:0.06em;margin-top:4px;">Service${totalServices > 1 ? 's' : ''}</div>
                                </div>
                            </div>
                        </div>

                        <!-- URL Share Bar -->
                        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;backdrop-filter:blur(10px);">
                            <div style="display:flex;align-items:center;gap:12px;overflow:hidden;flex:1;min-width:180px;">
                                <div style="width:8px;height:8px;border-radius:50%;background:#10b981;flex-shrink:0;box-shadow:0 0 10px rgba(16,185,129,0.7);animation:pulse 2s infinite;" ></div>
                                <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}</style>
                                <span style="color:rgba(255,255,255,0.8);font-weight:600;font-size:0.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${publicUrl.replace('https://', '')}</span>
                            </div>
                            <div style="display:flex;gap:8px;flex-shrink:0;">
                                <button id="vtk-copy-btn" onclick="(function(){const btn=document.getElementById('vtk-copy-btn');navigator.clipboard.writeText('${publicUrl}').then(()=>{btn.innerHTML='<svg width=\\'13\\' height=\\'13\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'3\\'><polyline points=\\'20 6 9 17 4 12\\'/></svg> Copié !';btn.style.background='rgba(16,185,129,0.25)';btn.style.borderColor='rgba(16,185,129,0.5)';btn.style.color='#10b981';setTimeout(()=>{btn.innerHTML='<svg width=\\'13\\' height=\\'13\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2.5\\'><rect x=\\'9\\' y=\\'9\\' width=\\'13\\' height=\\'13\\' rx=\\'2\\'/><path d=\\'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\\'/></svg> Copier';btn.style.background='rgba(255,255,255,0.08)';btn.style.borderColor='rgba(255,255,255,0.15)';btn.style.color='#fff';},2500);});})();" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);padding:9px 16px;border-radius:10px;font-weight:800;font-size:0.82rem;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all 0.2s;font-family:inherit;">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    Copier
                                </button>
                                <a href="${publicUrl}" target="_blank" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);padding:9px 16px;border-radius:10px;font-weight:800;font-size:0.82rem;text-decoration:none;display:flex;align-items:center;gap:7px;transition:all 0.2s;">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    Ouvrir
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════ ACTION BUTTONS ═══════ -->
                <div style="display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap;">
                    <button onclick="ShowcaseModule.openItemModal()" style="flex:1;min-width:200px;background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;padding:18px 28px;border-radius:16px;font-weight:900;font-size:1.05rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 24px rgba(16,185,129,0.32);transition:all 0.2s;font-family:inherit;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 14px 32px rgba(16,185,129,0.4)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 24px rgba(16,185,129,0.32)';">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Ajouter un Élément
                    </button>
                    <button onclick="ShowcaseModule.openSettingsModal()" style="background:#0f172a;color:white;border:none;padding:18px 24px;border-radius:16px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.2s;font-family:inherit;" onmouseover="this.style.transform='translateY(-3px)';this.style.background='#1e293b';" onmouseout="this.style.transform='translateY(0)';this.style.background='#0f172a';" title="Personnaliser l'apparence">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        Personnaliser
                    </button>
                </div>

                <!-- ═══════ ITEMS LIST ═══════ -->
                <div id="showcase-items-list" style="display:flex;flex-direction:column;gap:12px;">
                    ${(!items || items.length === 0) ? `
                        <div style="text-align:center;padding:70px 30px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);border-radius:24px;border:2px dashed #cbd5e1;">
                            <div style="font-size:3.5rem;margin-bottom:16px;filter:grayscale(0.3);">🔗</div>
                            <div style="font-weight:900;font-size:1.25rem;color:#0f172a;margin-bottom:10px;">Aucun élément pour l'instant</div>
                            <div style="color:#94a3b8;font-size:0.95rem;font-weight:500;max-width:340px;margin:0 auto;line-height:1.6;">Ajoutez vos liens, réseaux sociaux ou proposez des services en cliquant sur le bouton vert ci-dessus.</div>
                        </div>
                    ` : items.map(item => {
                        let meta = {};
                        let isService = item.category === 'service';
                        if (isService && item.description && item.description.startsWith('{')) {
                            try { meta = JSON.parse(item.description); } catch(e) {}
                        }
                        let displayUrl = isService ? (meta.url || '') : (item.url || item.description || '');

                        return `
                        <div class="vtk-item" style="background:white;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 10px rgba(0,0,0,0.04);">
                            <div style="display:flex;align-items:center;gap:16px;overflow:hidden;flex:1;">
                                <!-- Icon / Image -->
                                <div style="width:52px;height:52px;border-radius:15px;background:${isService ? 'linear-gradient(135deg,#fdf4ff,#fae8ff)' : 'linear-gradient(135deg,#eff6ff,#dbeafe)'};display:flex;align-items:center;justify-content:center;color:${isService ? '#a855f7' : '#3b82f6'};flex-shrink:0;overflow:hidden;">
                                    ${isService && meta.image ? `<img src="${meta.image}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;">` : ShowcaseModule.getIconForTitle(item.title)}
                                </div>
                                <!-- Text -->
                                <div style="overflow:hidden;min-width:0;">
                                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
                                        <span style="font-weight:800;font-size:1rem;color:#0f172a;">${item.title}</span>
                                        ${isService
                                            ? `<span style="background:linear-gradient(135deg,#fdf4ff,#fae8ff);color:#a855f7;font-size:0.65rem;font-weight:900;padding:3px 10px;border-radius:20px;border:1px solid #e9d5ff;white-space:nowrap;letter-spacing:0.04em;">SERVICE</span>`
                                            : `<span style="background:linear-gradient(135deg,#eff6ff,#dbeafe);color:#3b82f6;font-size:0.65rem;font-weight:900;padding:3px 10px;border-radius:20px;border:1px solid #bfdbfe;white-space:nowrap;letter-spacing:0.04em;">LIEN</span>`
                                        }
                                    </div>
                                    <div style="font-size:0.84rem;color:#94a3b8;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${displayUrl || '—'}</div>
                                </div>
                            </div>
                            <!-- Action buttons -->
                            <div style="display:flex;gap:8px;flex-shrink:0;margin-left:14px;">
                                <button class="vtk-btn-icon" onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f8fafc;border:1px solid #e2e8f0;width:38px;height:38px;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;font-family:inherit;" onmouseover="this.style.background='#f1f5f9';this.style.color='#0f172a';" onmouseout="this.style.background='#f8fafc';this.style.color='#64748b';" title="Modifier">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button class="vtk-btn-icon" onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff5f5;border:1px solid #fee2e2;width:38px;height:38px;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#ef4444;font-family:inherit;" onmouseover="this.style.background='#fee2e2';" onmouseout="this.style.background='#fff5f5';" title="Supprimer">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </div>
                        </div>
                        `;
                    }).join('')}
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
                try { meta = JSON.parse(item.description); } catch(e) {}
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
                background: 'rgba(15,23,42,0.7)', zIndex: '999999', display: 'none',
                alignItems: 'center', justifyContent: 'center', padding: '20px',
                backdropFilter: 'blur(6px)'
            });
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';

        overlay.innerHTML = `
            <div style="background:white;width:100%;max-width:560px;border-radius:28px;padding:44px;border:1px solid #e2e8f0;box-shadow:0 20px 60px rgba(0,0,0,0.2);position:relative;overflow-y:auto;max-height:90vh;">
                <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position:absolute;top:20px;right:20px;background:#f1f5f9;border:none;width:36px;height:36px;border-radius:50%;font-weight:900;cursor:pointer;color:#64748b;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>

                <h3 style="margin:0 0 6px 0;font-weight:950;font-size:1.6rem;letter-spacing:-0.04em;color:#0f172a;">${itemId ? 'Modifier l\'Élément' : 'Nouvel Élément'}</h3>
                <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 28px 0;">Choisissez le type d'élément à ajouter à votre vitrine.</p>

                <div style="display:flex;flex-direction:column;gap:22px;">
                    <!-- Type Tabs -->
                    <div style="display:flex;background:#f1f5f9;padding:5px;border-radius:16px;gap:4px;">
                        <button id="tab-link" onclick="ShowcaseModule.toggleModalTab('link')" style="flex:1;padding:13px;border-radius:12px;border:none;font-weight:800;font-size:0.9rem;cursor:pointer;transition:all 0.2s;font-family:inherit;${item.category !== 'service' ? 'background:#fff;color:#0f172a;box-shadow:0 2px 8px rgba(0,0,0,0.06);' : 'background:transparent;color:#64748b;'}">🔗 Lien Simple</button>
                        <button id="tab-service" onclick="ShowcaseModule.toggleModalTab('service')" style="flex:1;padding:13px;border-radius:12px;border:none;font-weight:800;font-size:0.9rem;cursor:pointer;transition:all 0.2s;font-family:inherit;${item.category === 'service' ? 'background:#fff;color:#0f172a;box-shadow:0 2px 8px rgba(0,0,0,0.06);' : 'background:transparent;color:#64748b;'}">📦 Service / Article</button>
                    </div>

                    <input type="hidden" id="modal-item-type" value="${item.category === 'service' ? 'service' : 'link'}">

                    <div>
                        <label style="font-weight:800;font-size:0.85rem;color:#64748b;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Titre</label>
                        <input id="modal-item-title" type="text" value="${item.title}" placeholder="Ex : Mon Instagram, Consultation 1h..." style="width:100%;padding:15px 18px;border-radius:14px;border:1.5px solid #e2e8f0;font-weight:600;font-size:1rem;font-family:inherit;outline:none;box-sizing:border-box;transition:border-color 0.2s;" onfocus="this.style.borderColor='#10b981'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <div>
                        <label style="font-weight:800;font-size:0.85rem;color:#64748b;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">URL de redirection</label>
                        <input id="modal-item-url" type="url" value="${item.category === 'service' ? meta.url : (item.url || item.description || '')}" placeholder="https://..." style="width:100%;padding:15px 18px;border-radius:14px;border:1.5px solid #e2e8f0;font-weight:500;font-size:1rem;font-family:inherit;outline:none;box-sizing:border-box;transition:border-color 0.2s;" onfocus="this.style.borderColor='#10b981'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <div id="service-fields" style="display:${item.category === 'service' ? 'flex' : 'none'};flex-direction:column;gap:18px;background:#f8fafc;padding:22px;border-radius:18px;border:1.5px dashed #cbd5e1;">
                        <div>
                            <label style="font-weight:800;font-size:0.85rem;color:#64748b;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Description</label>
                            <textarea id="modal-item-desc" rows="3" placeholder="Décrivez votre service, formation, produit..." style="width:100%;padding:15px 18px;border-radius:14px;border:1.5px solid #e2e8f0;font-weight:500;font-size:0.95rem;font-family:inherit;outline:none;resize:none;box-sizing:border-box;">${meta.description || ''}</textarea>
                        </div>
                        <div style="display:flex;gap:14px;">
                            <div style="flex:1;">
                                <label style="font-weight:800;font-size:0.85rem;color:#64748b;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Prix (€) <span style="font-weight:400;text-transform:none;">(opt.)</span></label>
                                <input id="modal-item-price" type="number" step="0.01" min="0" value="${item.price || 0}" style="width:100%;padding:15px 18px;border-radius:14px;border:1.5px solid #e2e8f0;font-weight:700;font-size:1rem;font-family:inherit;outline:none;box-sizing:border-box;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-weight:800;font-size:0.85rem;color:#64748b;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Image (URL)</label>
                                <input id="modal-item-image" type="url" value="${meta.image || ''}" placeholder="https://..." style="width:100%;padding:15px 18px;border-radius:14px;border:1.5px solid #e2e8f0;font-weight:500;font-size:0.95rem;font-family:inherit;outline:none;box-sizing:border-box;">
                            </div>
                        </div>
                    </div>

                    <button id="save-item-btn" onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;padding:18px;border-radius:16px;font-weight:900;cursor:pointer;font-size:1.1rem;transition:all 0.2s;font-family:inherit;box-shadow:0 8px 20px rgba(16,185,129,0.3);" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">Sauvegarder</button>
                </div>
            </div>
        `;
    },

    toggleModalTab(type) {
        document.getElementById('modal-item-type').value = type;
        const linkTab = document.getElementById('tab-link');
        const serviceTab = document.getElementById('tab-service');
        const serviceFields = document.getElementById('service-fields');
        if (type === 'service') {
            serviceTab.style.cssText += 'background:#fff;color:#0f172a;box-shadow:0 2px 8px rgba(0,0,0,0.06);';
            linkTab.style.background = 'transparent'; linkTab.style.color = '#64748b'; linkTab.style.boxShadow = 'none';
            serviceFields.style.display = 'flex';
        } else {
            linkTab.style.cssText += 'background:#fff;color:#0f172a;box-shadow:0 2px 8px rgba(0,0,0,0.06);';
            serviceTab.style.background = 'transparent'; serviceTab.style.color = '#64748b'; serviceTab.style.boxShadow = 'none';
            serviceFields.style.display = 'none';
        }
    },

    async saveItem(itemId) {
        const title = document.getElementById('modal-item-title').value.trim();
        const url = document.getElementById('modal-item-url').value.trim();
        const type = document.getElementById('modal-item-type').value;
        if (!title || !url) return alert('Veuillez remplir au minimum le titre et le lien de redirection.');

        const btn = document.getElementById('save-item-btn');
        btn.innerText = 'Sauvegarde...'; btn.disabled = true;

        const { data: { session } } = await window._supabase.auth.getSession();

        let price = 0, descriptionValue = url, category = 'linktree';
        if (type === 'service') {
            category = 'service';
            price = parseFloat(document.getElementById('modal-item-price').value) || 0;
            const desc = document.getElementById('modal-item-desc').value;
            const img = document.getElementById('modal-item-image').value;
            descriptionValue = JSON.stringify({ url, description: desc, image: img });
        }

        try {
            const updateData = { title, description: descriptionValue, price, status: 'active', category };
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
        } catch (err) { alert(err.message); btn.disabled = false; btn.innerText = 'Sauvegarder'; }
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
            Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.7)', zIndex: '999999', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' });
            document.body.appendChild(overlay);
        } else { overlay.style.display = 'flex'; }

        overlay.innerHTML = `
            <div style="background:white;width:100%;max-width:460px;border-radius:28px;padding:44px;border:1px solid #e2e8f0;box-shadow:0 20px 60px rgba(0,0,0,0.2);position:relative;">
                <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position:absolute;top:20px;right:20px;background:#f1f5f9;border:none;width:36px;height:36px;border-radius:50%;font-weight:900;cursor:pointer;color:#64748b;display:flex;align-items:center;justify-content:center;">✕</button>
                <h3 style="margin:0 0 8px 0;font-weight:950;font-size:1.6rem;letter-spacing:-0.04em;color:#0f172a;">Personnaliser</h3>
                <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 32px 0;">Choisissez l'apparence de votre vitrine publique.</p>

                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:22px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-weight:800;color:#0f172a;font-size:1.05rem;margin-bottom:4px;">🌙 Mode Sombre</div>
                        <div style="font-size:0.85rem;color:#94a3b8;">Appliquer un fond sombre à votre vitrine.</div>
                    </div>
                    <label style="position:relative;display:inline-block;width:52px;height:30px;cursor:pointer;">
                        <input type="checkbox" id="theme-toggle-switch" style="opacity:0;width:0;height:0;" ${isDark ? 'checked' : ''}>
                        <span id="theme-toggle-track" style="position:absolute;top:0;left:0;right:0;bottom:0;background-color:${isDark ? '#10b981' : '#cbd5e1'};border-radius:34px;transition:.3s;"></span>
                        <span id="theme-toggle-slider" style="position:absolute;height:22px;width:22px;left:4px;bottom:4px;background-color:white;border-radius:50%;transition:.3s;transform:${isDark ? 'translateX(22px)' : 'translateX(0)'};box-shadow:0 2px 6px rgba(0,0,0,0.2);"></span>
                    </label>
                </div>

                <div style="margin-top:28px;">
                    <button id="save-settings-btn" onclick="ShowcaseModule.saveSettings()" style="width:100%;background:#0f172a;color:#fff;border:none;padding:18px;border-radius:16px;font-weight:900;cursor:pointer;font-size:1.05rem;font-family:inherit;transition:all 0.2s;" onmouseover="this.style.background='#1e293b';" onmouseout="this.style.background='#0f172a';">Appliquer</button>
                </div>
            </div>
        `;
        document.getElementById('theme-toggle-switch').addEventListener('change', function() {
            document.getElementById('theme-toggle-track').style.backgroundColor = this.checked ? '#10b981' : '#cbd5e1';
            document.getElementById('theme-toggle-slider').style.transform = this.checked ? 'translateX(22px)' : 'translateX(0)';
        });
    },

    async saveSettings() {
        const isDark = document.getElementById('theme-toggle-switch').checked;
        const btn = document.getElementById('save-settings-btn');
        btn.innerText = 'Sauvegarde...'; btn.disabled = true;
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: profile } = await window._supabase.from('profiles').select('meta_info').eq('id', session.user.id).single();
        let meta = profile?.meta_info || {};
        meta.theme = isDark ? 'dark' : 'light';
        try {
            await window._supabase.from('profiles').update({ meta_info: meta }).eq('id', session.user.id);
            document.getElementById('details-modal-overlay').style.display = 'none';
            if (window.App && window.App.showView) window.App.showView('vitrine', true);
        } catch (err) { alert(err.message); btn.disabled = false; btn.innerText = 'Appliquer'; }
    },

    async deleteItem(id) {
        if (!confirm('Voulez-vous supprimer cet élément ?')) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        if (window.App && window.App.showView) {
            window.App.showView('vitrine', true);
        } else {
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    },

    editItem(id) { this.openItemModal(id); },

    /**
     * VITRINE PUBLIQUE - Page publique Linktree
     */
    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: provider, error: providerError } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            if (providerError) throw providerError;
            if (!provider) throw new Error('Profil introuvable');

            const { data: items, error: itemsError } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            if (itemsError) throw itemsError;

            const meta = provider.meta_info || {};
            const isDark = meta.theme === 'dark';
            const bgStr = isDark ? '#0f172a' : '#f8fafc';
            const textStr = isDark ? '#f8fafc' : '#0f172a';
            const subTextStr = isDark ? '#94a3b8' : '#64748b';
            const cardBg = isDark ? 'rgba(30,41,59,0.8)' : '#fff';
            const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
            const itemBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc';

            container.innerHTML = `
                <div style="font-family:'Inter',sans-serif;background:${bgStr};min-height:100vh;padding:60px 20px;display:flex;flex-direction:column;align-items:center;">
                    <div style="text-align:center;margin-bottom:36px;max-width:480px;">
                        <div style="width:110px;height:110px;background:linear-gradient(135deg,#0f172a,#1e3a5f);border-radius:50%;margin:0 auto 24px;border:4px solid ${isDark ? '#1e293b' : '#fff'};box-shadow:0 15px 40px rgba(0,0,0,0.15);overflow:hidden;display:flex;align-items:center;justify-content:center;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="color:#fff;font-size:3.2rem;font-weight:950;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size:2rem;font-weight:950;margin:0;color:${textStr};letter-spacing:-0.06em;">${provider.full_name}</h1>
                        <p style="font-size:1rem;color:${subTextStr};font-weight:600;margin:10px 0 0 0;">${provider.role === 'entreprise' ? 'Nos Solutions & Services' : 'Mes Services & Réseaux'}</p>
                    </div>

                    ${(function() {
                        const socialKeywords = ['instagram', 'linkedin', 'facebook', 'twitter', 'tiktok', 'youtube', 'x', 'whatsapp'];
                        const socialItems = items.filter(i => i.category !== 'service' && socialKeywords.some(k => (i.title || '').toLowerCase().includes(k)));
                        const standardItems = items.filter(i => i.category !== 'service' && !socialKeywords.some(k => (i.title || '').toLowerCase().includes(k)));
                        const serviceItems = items.filter(i => i.category === 'service');
                        let html = '';

                        if (socialItems.length > 0) {
                            html += `<div style="display:flex;gap:14px;justify-content:center;margin-bottom:36px;flex-wrap:wrap;">`;
                            html += socialItems.map(item => {
                                let url = item.url || item.description || '#';
                                if (url !== '#' && !url.startsWith('http')) url = 'https://' + url;
                                return `<a href="${url}" target="_blank" title="${item.title}" style="color:${textStr};transition:transform 0.2s;display:block;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
                                    <div style="width:50px;height:50px;display:flex;align-items:center;justify-content:center;background:${cardBg};border:1px solid ${cardBorder};border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.06);backdrop-filter:blur(10px);">
                                        ${ShowcaseModule.getIconForTitle(item.title)}
                                    </div>
                                </a>`;
                            }).join('');
                            html += `</div>`;
                        }

                        html += `<div style="width:100%;max-width:520px;display:flex;flex-direction:column;gap:14px;">`;

                        if (serviceItems.length > 0) {
                            html += serviceItems.map(item => {
                                let m = {};
                                try { m = JSON.parse(item.description || '{}'); } catch(e) {}
                                let url = m.url || '#';
                                if (url !== '#' && !url.startsWith('http')) url = 'https://' + url;
                                return `<div style="background:${cardBg};border:1px solid ${cardBorder};border-radius:24px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);backdrop-filter:blur(10px);">
                                    ${m.image ? `<div style="width:100%;height:190px;overflow:hidden;"><img src="${m.image}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
                                    <div style="padding:22px;">
                                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                                            <h3 style="font-weight:900;font-size:1.2rem;color:${textStr};margin:0;">${item.title}</h3>
                                            ${item.price > 0 ? `<div style="font-weight:900;font-size:1.05rem;color:#10b981;white-space:nowrap;margin-left:12px;">${item.price} €</div>` : ''}
                                        </div>
                                        ${m.description ? `<p style="font-size:0.9rem;color:${subTextStr};margin:0 0 18px 0;line-height:1.6;">${m.description}</p>` : ''}
                                        <a href="${url}" target="_blank" style="display:block;text-align:center;background:linear-gradient(135deg,#10b981,#059669);color:#fff;text-decoration:none;padding:14px;border-radius:12px;font-weight:800;font-size:0.95rem;transition:transform 0.2s;box-shadow:0 6px 16px rgba(16,185,129,0.3);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Découvrir le service →</a>
                                    </div>
                                </div>`;
                            }).join('');
                        }

                        if (standardItems.length === 0 && socialItems.length === 0 && serviceItems.length === 0) {
                            html += `<div style="text-align:center;padding:40px;color:${subTextStr};font-weight:600;font-style:italic;">Aucun contenu disponible pour le moment.</div>`;
                        } else {
                            html += standardItems.map(item => {
                                let url = item.url || item.description || '#';
                                if (url !== '#' && !url.startsWith('http')) url = 'https://' + url;
                                return `<a href="${url}" target="_blank" style="text-decoration:none;background:${cardBg};border:1px solid ${cardBorder};border-radius:20px;padding:20px 26px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 14px rgba(0,0,0,0.05);backdrop-filter:blur(10px);transition:all 0.25s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 28px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(0,0,0,0.05)';">
                                    <div style="display:flex;align-items:center;gap:16px;">
                                        <div style="width:46px;height:46px;border-radius:14px;background:${itemBg};color:${isDark ? '#94a3b8' : '#3b82f6'};display:flex;align-items:center;justify-content:center;">
                                            ${ShowcaseModule.getIconForTitle(item.title)}
                                        </div>
                                        <div style="font-weight:800;font-size:1.05rem;color:${textStr};">${item.title}</div>
                                    </div>
                                    <div style="color:${subTextStr};"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div>
                                </a>`;
                            }).join('');
                        }

                        html += `</div>`;
                        return html;
                    })()}

                    <div style="margin-top:60px;font-size:0.75rem;font-weight:800;color:${isDark ? '#334155' : '#cbd5e1'};letter-spacing:0.12em;text-transform:uppercase;">Propulsé par Domtom Connect</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    getIconForTitle(title) {
        if (!title) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
        const t = title.toLowerCase();
        if (t.includes('instagram')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;
        if (t.includes('linkedin')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;
        if (t.includes('facebook')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`;
        if (t.includes('twitter') || t === 'x') return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`;
        if (t.includes('tiktok')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`;
        if (t.includes('youtube')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`;
        if (t.includes('whatsapp')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;
        if (t.includes('site') || t.includes('web') || t.includes('portfolio')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
        if (t.includes('calendly') || t.includes('rdv') || t.includes('rendez') || t.includes('appel')) return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    }
};

window.ShowcaseModule = ShowcaseModule;
