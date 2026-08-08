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
            const { data: profile } = await window._supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single();
            let slug = profile?.full_name ? profile.full_name.toLowerCase().replace(/[^a-z0-9]/g, '-') : session.user.id;
            slug = slug.replace(/^-+|-+$/g, '');
            if (profile?.role === 'admin' || slug.includes('founder') || slug.includes('fondateur')) {
                slug = 'founder';
            }
            const publicUrl = window.location.origin + '/' + slug;
            let itemsHtml = '';
            if (!items || items.length === 0) {
                itemsHtml = `
                    <div style="text-align:center; padding: 40px; border: 2px dashed #cbd5e1; border-radius: 12px; color: #64748b; margin-top: 20px;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🔗</div>
                        <p style="font-weight: 600;">Vous n'avez pas encore ajouté de liens.</p>
                    </div>
                `;
            } else {
                // Tri: Mettre en avant d'abord, puis par position explicite
                items.sort((a, b) => {
                    let metaA = {}; try { if (a.meta_info) metaA = JSON.parse(a.meta_info); } catch(e){}
                    let metaB = {}; try { if (b.meta_info) metaB = JSON.parse(b.meta_info); } catch(e){}
                    
                    if (metaA.highlight && !metaB.highlight) return -1;
                    if (!metaA.highlight && metaB.highlight) return 1;
                    
                    const posA = metaA.position !== undefined && metaA.position !== '' ? parseInt(metaA.position) : 999;
                    const posB = metaB.position !== undefined && metaB.position !== '' ? parseInt(metaB.position) : 999;
                    if (posA !== posB) return posA - posB;
                    
                    return new Date(a.created_at) - new Date(b.created_at);
                });

                itemsHtml = items.map(item => {
                    let meta = {};
                    try { if (item.meta_info) meta = JSON.parse(item.meta_info); } catch(e){}
                    const iconClass = meta.icon || (item.category === 'service' ? 'fas fa-briefcase' : 'fas fa-link');
                    const isService = item.category === 'service' || item.price != null;
                    const catBadge = isService ? `<span style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; font-weight: 800;"><i class="fas fa-briefcase"></i> Offre / Service</span>` : `<span style="background: #f1f5f9; color: #475569; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; font-weight: 700;"><i class="fas fa-link"></i> Lien Bio</span>`;
                    const highlightBadge = meta.highlight ? `<span style="background: #fbbf24; color: #000; font-size: 0.7rem; padding: 3px 8px; border-radius: 6px; font-weight: bold;"><i class="fas fa-star"></i> À la une</span>` : '';
                    
                    let priceTag = '';
                    if (isService && item.price != null && item.price !== '') {
                        const prefix = item.price_prefix ? `${item.price_prefix} ` : '';
                        priceTag = `<span style="background: #10b981; color: white; font-size: 0.8rem; padding: 4px 10px; border-radius: 8px; font-weight: 900;">${prefix}${item.price}€</span>`;
                    }

                    return `
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.03); width: 100%; box-sizing: border-box;">
                        <div style="display: flex; align-items: flex-start; gap: 16px; flex: 1; min-width: 250px;">
                            <div style="font-size: 1.5rem; color: #10b981; width: 44px; height: 44px; background: #f0fdf4; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="${iconClass}"></i></div>
                            <div style="flex: 1; min-width: 0; overflow: hidden;">
                                <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 4px;">
                                    <h4 style="margin: 0; font-size: 1.05rem; color: #0f172a; font-weight: 800;">${item.title || 'Sans titre'}</h4>
                                    ${catBadge}
                                    ${highlightBadge}
                                    ${priceTag}
                                </div>
                                ${item.description ? `<p style="margin: 4px 0; font-size: 0.85rem; color: #64748b; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.description}</p>` : ''}
                                ${item.url ? `<a href="${item.url}" target="_blank" style="font-size: 0.8rem; color: #3b82f6; text-decoration: none; font-weight: 600;">${item.url} <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i></a>` : ''}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; flex-shrink: 0;">
                            <button onclick="ShowcaseModule.openItemModal('${item.id}')" style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 10px 16px; border-radius: 10px; cursor: pointer; color: #334155; font-weight: 700; font-size: 0.85rem;">Modifier</button>
                            <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background: #fef2f2; border: 1px solid #fee2e2; padding: 10px 16px; border-radius: 10px; cursor: pointer; color: #ef4444; font-weight: 700; font-size: 0.85rem;">Supprimer</button>
                        </div>
                    </div>
                `}).join('');
            }

            container.innerHTML = `
                <div style="max-width: 840px; width: 100%; box-sizing: border-box; margin: 0 auto; padding: 16px; font-family: 'Plus Jakarta Sans', sans-serif;">
                    
                    <div style="background: white; padding: 32px 24px; border-radius: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px; text-align: center; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); width: 100%; box-sizing: border-box;">
                        <span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 6px 14px; border-radius: 100px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 12px;">Espace Vitrine &amp; Offres</span>
                        <h1 style="margin: 0 0 10px 0; color: #0f172a; font-size: 2rem; font-weight: 900;">Ma Vitrine &amp; Solutions B2B</h1>
                        <p style="margin: 0 0 24px 0; color: #64748b; font-size: 1.05rem;">Ajoutez vos liens bio (Linktree) et créez vos <strong>Offres &amp; Services</strong> affichés sur votre profil public.</p>
                        
                        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="ShowcaseModule.openItemModal(null, 'service')" style="background: #10b981; color: white; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; box-shadow: 0 10px 20px rgba(16,185,129,0.2);">
                                <i class="fas fa-plus-circle"></i>
                                <span>+ Ajouter une Offre / Service</span>
                            </button>
                            <button onclick="ShowcaseModule.openItemModal(null, 'linktree')" style="background: #0f172a; color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
                                <i class="fas fa-link"></i>
                                <span>+ Ajouter un Lien Bio</span>
                            </button>
                            <a href="${publicUrl}" target="_blank" style="background: white; color: #0f172a; border: 1px solid #e2e8f0; padding: 14px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Voir ma page publique</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        ${itemsHtml}
                    </div>
                </div>
                <!-- Modal overlay (hidden by default) -->
                <div id="details-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;"></div>
            `;
        } catch (err) {
            console.error(err);
            container.innerHTML = `<div style="color:red;padding:20px;">Erreur de chargement de la vitrine.</div>`;
        }
    },

    openItemModal: async (itemId = null, defaultCategory = 'service') => {
        let existingItem = null;
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            existingItem = data;
        }
        
        let meta = {};
        try { if (existingItem?.meta_info) meta = JSON.parse(existingItem.meta_info); } catch(e){}

        const currentCat = existingItem ? (existingItem.category || 'service') : defaultCategory;
        const isService = currentCat === 'service';

        let overlay = document.getElementById('details-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'details-modal-overlay';
            overlay.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;';
            document.body.appendChild(overlay);
        }

        overlay.style.display = 'flex';

        if (isService) {
            // --- FORMULAIRE DÉDIÉ : OFFRE & PRESTATION B2B ---
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 560px; border-radius: 24px; padding: 36px; position: relative; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
                    <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position: absolute; right: 24px; top: 24px; background: #f1f5f9; border: none; font-size: 1.2rem; cursor: pointer; color: #64748b; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
                    <h2 style="margin: 0 0 8px 0; color: #0f172a; font-weight: 900; font-size: 1.4rem;">💼 ${itemId ? 'Modifier l\'Offre' : 'Nouvelle Offre / Prestation'}</h2>
                    <p style="margin: 0 0 24px 0; color: #64748b; font-size: 0.9rem;">Créez une offre claire avec tarif qui sera mise en valeur sur votre profil public.</p>
                    
                    <input type="hidden" id="item-category" value="service">

                    <div style="display: flex; flex-direction: column; gap: 18px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Titre de l'Offre / Prestation *</label>
                            <input type="text" id="item-title" placeholder="Ex: Audit Business, Création de Site Web, Consulting..." value="${existingItem?.title || ''}" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;">
                        </div>

                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Description &amp; Détails de la prestation</label>
                            <textarea id="item-description" rows="3" placeholder="Expliquez brièvement ce que comprend votre accompagnement ou service..." style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; font-family: inherit;">${existingItem?.description || ''}</textarea>
                        </div>
                        
                        <div style="display: flex; gap: 14px;">
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Préfixe de Tarif</label>
                                <select id="item-price-prefix" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;">
                                    <option value="À partir de" ${existingItem?.price_prefix === 'À partir de' || !existingItem?.price_prefix ? 'selected' : ''}>À partir de</option>
                                    <option value="Prix fixe" ${existingItem?.price_prefix === 'Prix fixe' ? 'selected' : ''}>Prix fixe</option>
                                    <option value="Forfait" ${existingItem?.price_prefix === 'Forfait' ? 'selected' : ''}>Forfait</option>
                                    <option value="Sur devis" ${existingItem?.price_prefix === 'Sur devis' ? 'selected' : ''}>Sur devis</option>
                                </select>
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Prix (€ EUR)</label>
                                <input type="number" id="item-price" placeholder="Ex: 250 (laisser vide si sur devis)" value="${existingItem?.price !== null && existingItem?.price !== undefined ? existingItem.price : ''}" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;">
                            </div>
                        </div>

                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Lien externe / Page de vente (Optionnel)</label>
                            <input type="url" id="item-url" placeholder="https://..." value="${existingItem?.url || ''}" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;">
                        </div>

                        <div style="display: flex; gap: 14px;">
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Icône</label>
                                <select id="item-icon" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;">
                                    <option value="fas fa-briefcase" ${meta.icon === 'fas fa-briefcase' || !meta.icon ? 'selected' : ''}>💼 Offre / Service</option>
                                    <option value="fas fa-rocket" ${meta.icon === 'fas fa-rocket' ? 'selected' : ''}>🚀 Solution Digitale</option>
                                    <option value="fas fa-chart-line" ${meta.icon === 'fas fa-chart-line' ? 'selected' : ''}>📈 Business / Conseil</option>
                                    <option value="fas fa-shopping-cart" ${meta.icon === 'fas fa-shopping-cart' ? 'selected' : ''}>🛒 Produit / Boutique</option>
                                </select>
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Ordre d'affichage</label>
                                <input type="number" id="item-position" placeholder="Ex: 1" value="${meta.position !== undefined ? meta.position : ''}" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <input type="checkbox" id="item-highlight" ${meta.highlight ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #10b981; cursor: pointer;">
                            <label for="item-highlight" style="font-weight: 800; color: #0f172a; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-star" style="color: #fbbf24;"></i> Mettre cette offre en avant sur mon profil public
                            </label>
                        </div>

                        <button onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background: #10b981; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 900; cursor: pointer; margin-top: 8px; font-size: 1.05rem; box-shadow: 0 10px 20px rgba(16,185,129,0.25);">
                            Enregistrer l'Offre
                        </button>
                    </div>
                </div>
            `;
        } else {
            // --- FORMULAIRE DÉDIÉ : LIEN BIO / RÉSEAU SOCIAL ---
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 500px; border-radius: 24px; padding: 36px; position: relative; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                    <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position: absolute; right: 24px; top: 24px; background: #f1f5f9; border: none; font-size: 1.2rem; cursor: pointer; color: #64748b; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
                    <h2 style="margin: 0 0 8px 0; color: #0f172a; font-weight: 900; font-size: 1.4rem;">🔗 ${itemId ? 'Modifier le Lien' : 'Nouveau Lien Bio'}</h2>
                    <p style="margin: 0 0 24px 0; color: #64748b; font-size: 0.9rem;">Ajoutez un lien de redirection vers vos réseaux sociaux, site ou calendrier.</p>
                    
                    <input type="hidden" id="item-category" value="linktree">

                    <div style="display: flex; flex-direction: column; gap: 18px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Titre du Lien *</label>
                            <input type="text" id="item-title" placeholder="Ex: Mon Instagram, Prendre Rendez-vous, Mon Site Web..." value="${existingItem?.title || ''}" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">URL (Lien de destination) *</label>
                            <input type="url" id="item-url" placeholder="https://..." value="${existingItem?.url || existingItem?.description || ''}" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;">
                        </div>

                        <div style="display: flex; gap: 14px;">
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Icône</label>
                                <select id="item-icon" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;">
                                    <option value="fas fa-link" ${meta.icon === 'fas fa-link' || !meta.icon ? 'selected' : ''}>🔗 Lien (Défaut)</option>
                                    <option value="fas fa-globe" ${meta.icon === 'fas fa-globe' ? 'selected' : ''}>🌐 Site Web</option>
                                    <option value="fab fa-instagram" ${meta.icon === 'fab fa-instagram' ? 'selected' : ''}>📸 Instagram</option>
                                    <option value="fab fa-tiktok" ${meta.icon === 'fab fa-tiktok' ? 'selected' : ''}>🎵 TikTok</option>
                                    <option value="fab fa-youtube" ${meta.icon === 'fab fa-youtube' ? 'selected' : ''}>▶️ YouTube</option>
                                    <option value="fab fa-linkedin" ${meta.icon === 'fab fa-linkedin' ? 'selected' : ''}>💼 LinkedIn</option>
                                    <option value="fab fa-whatsapp" ${meta.icon === 'fab fa-whatsapp' ? 'selected' : ''}>💬 WhatsApp</option>
                                    <option value="fas fa-calendar-alt" ${meta.icon === 'fas fa-calendar-alt' ? 'selected' : ''}>📅 Calendrier</option>
                                </select>
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.9rem;">Ordre d'affichage</label>
                                <input type="number" id="item-position" placeholder="Ex: 1" value="${meta.position !== undefined ? meta.position : ''}" style="width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <input type="checkbox" id="item-highlight" ${meta.highlight ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #0f172a; cursor: pointer;">
                            <label for="item-highlight" style="font-weight: 800; color: #0f172a; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-star" style="color: #fbbf24;"></i> Mettre ce lien en avant sur ma vitrine
                            </label>
                        </div>

                        <button onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background: #0f172a; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 900; cursor: pointer; margin-top: 8px; font-size: 1.05rem; box-shadow: 0 10px 20px rgba(15,23,42,0.2);">
                            Enregistrer le Lien
                        </button>
                    </div>
                </div>
            `;
        }
    },

    saveItem: async (itemId) => {
        const category = document.getElementById('item-category')?.value || 'service';
        const title = document.getElementById('item-title').value.trim();
        const description = document.getElementById('item-description')?.value.trim() || '';
        const priceVal = document.getElementById('item-price')?.value.trim();
        const price_prefix = document.getElementById('item-price-prefix')?.value || 'À partir de';
        const url = document.getElementById('item-url')?.value.trim() || '';
        const icon = document.getElementById('item-icon')?.value || (category === 'service' ? 'fas fa-briefcase' : 'fas fa-link');
        const position = document.getElementById('item-position')?.value || '';
        const highlight = document.getElementById('item-highlight')?.checked || false;

        if (!title) return alert("Veuillez saisir au moins un titre.");
        if (category === 'linktree' && !url) return alert("Veuillez saisir une URL pour le lien.");

        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;

        const price = (priceVal !== undefined && priceVal !== '' && !isNaN(priceVal)) ? parseFloat(priceVal) : null;

        const payload = {
            title: title,
            description: description || url,
            url: url,
            category: category,
            price: price,
            price_prefix: price_prefix,
            status: 'active',
            meta_info: JSON.stringify({ icon, highlight, position })
        };

        try {
            if (itemId) {
                const { error } = await window._supabase.from('showcase_items').update(payload).eq('id', itemId);
                if (error) throw error;
            } else {
                const { error } = await window._supabase.from('showcase_items').insert({ ...payload, user_id: session.user.id });
                if (error) throw error;
            }
            document.getElementById('details-modal-overlay').style.display = 'none';
            ShowcaseModule.renderManager(document.getElementById('vitrine-view') || document.getElementById('ecosystem-grid-container'));
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la sauvegarde: " + (err.message || "Erreur inconnue"));
        }
    },

    deleteItem: async (id) => {
        if (!confirm("Voulez-vous vraiment supprimer ce lien ?")) return;
        const { error } = await window._supabase.from('showcase_items').delete().eq('id', id);
        if (error) {
            console.error(error);
            alert("Erreur lors de la suppression: " + error.message);
            return;
        }
        ShowcaseModule.renderManager(document.getElementById('vitrine-view') || document.getElementById('ecosystem-grid-container'));
    },

    renderPublicShowcase: async (container, providerId) => {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;"><span class="loader"></span></div>`;
        try {
            const { data: provider, error: providerError } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            if (providerError) throw providerError;

            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).in('category', ['linktree', 'link', 'service']).order('created_at', { ascending: false });

            // Minimalist & Premium styling logic
            const bgStr = '#f8fafc';
            const cardBg = '#ffffff';
            const textStr = '#0f172a';
            const highlightBg = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
            const highlightText = '#ffffff';

            const avatarUrl = provider.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(provider.full_name) + '&background=0f172a&color=fff';

            let itemsHtml = '';
            if (!items || items.length === 0) {
                itemsHtml = `<p style="text-align: center; color: #64748b;">Aucun lien disponible.</p>`;
            } else {
                // Tri: Mettre en avant d'abord, puis par position explicite
                items.sort((a, b) => {
                    let metaA = {}; try { if (a.meta_info) metaA = JSON.parse(a.meta_info); } catch(e){}
                    let metaB = {}; try { if (b.meta_info) metaB = JSON.parse(b.meta_info); } catch(e){}
                    
                    if (metaA.highlight && !metaB.highlight) return -1;
                    if (!metaA.highlight && metaB.highlight) return 1;
                    
                    const posA = metaA.position !== undefined && metaA.position !== '' ? parseInt(metaA.position) : 999;
                    const posB = metaB.position !== undefined && metaB.position !== '' ? parseInt(metaB.position) : 999;
                    if (posA !== posB) return posA - posB;
                    
                    return new Date(a.created_at) - new Date(b.created_at);
                });

                itemsHtml = items.map(item => {
                    let url = item.url || item.description || '#';
                    if (url !== '#' && !url.startsWith('http')) url = 'https://' + url;
                    
                    let meta = {};
                    try { if (item.meta_info) meta = JSON.parse(item.meta_info); } catch(e){}
                    const iconClass = meta.icon || 'fas fa-link';
                    const isHighlight = meta.highlight === true;

                    const currentBg = isHighlight ? highlightBg : cardBg;
                    const currentText = isHighlight ? highlightText : textStr;
                    const borderStyle = isHighlight ? 'none' : '1px solid #e2e8f0';
                    const pulseAnim = isHighlight ? 'animation: dtc-pulse 2s infinite;' : '';

                    return `
                        <a href="${url}" target="_blank" style="display: flex; align-items: center; justify-content: center; position: relative; width: 100%; background: ${currentBg}; color: ${currentText}; text-decoration: none; padding: 18px 24px; border-radius: 12px; margin-bottom: 16px; font-weight: 600; font-size: 1.05rem; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: ${borderStyle}; transition: transform 0.2s, box-shadow 0.2s; box-sizing: border-box; ${pulseAnim}" onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 10px 15px -3px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1)';">
                            <i class="${iconClass}" style="position: absolute; left: 24px; font-size: 1.2rem;"></i>
                            <span>${item.title || 'Lien'}</span>
                        </a>
                    `;
                }).join('');
            }

            // Tracking Injections (Marketing)
            // Cleanup previous dynamically injected scripts if any
            document.querySelectorAll('.dtc-dynamic-tracking').forEach(el => el.remove());

            if (provider.ga_id && provider.ga_id.trim() !== '') {
                const gaScript = document.createElement('script');
                gaScript.async = true;
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${provider.ga_id}`;
                gaScript.className = 'dtc-dynamic-tracking';
                document.head.appendChild(gaScript);

                const gaInline = document.createElement('script');
                gaInline.className = 'dtc-dynamic-tracking';
                gaInline.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${provider.ga_id}');
                `;
                document.head.appendChild(gaInline);
                console.log(`[Marketing] Injected Google Analytics: ${provider.ga_id}`);
            }

            if (provider.fb_pixel_id && provider.fb_pixel_id.trim() !== '') {
                const fbScript = document.createElement('script');
                fbScript.className = 'dtc-dynamic-tracking';
                fbScript.innerHTML = `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${provider.fb_pixel_id}');
                    fbq('track', 'PageView');
                `;
                document.head.appendChild(fbScript);
                console.log(`[Marketing] Injected Facebook Pixel: ${provider.fb_pixel_id}`);
            }

            // PLG Native Advertising Injection (Dual System) & Custom Booking
            let bookingCard = '';
            if (provider.calendly_url && provider.calendly_url.trim() !== '') {
                // If user has their own booking link
                bookingCard = `
                    <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 8px 20px -5px rgba(16, 185, 129, 0.15);">
                        <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 16px auto;"><i class="fas fa-calendar-check"></i></div>
                        <h3 style="margin: 0 0 8px 0; color: #fff; font-size: 1.3rem; font-weight: 800;">Prendre Rendez-vous</h3>
                        <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.4;">Réservez directement un créneau avec ${provider.full_name}.</p>
                        <a href="${provider.calendly_url}" target="_blank" style="display: block; width: 100%; background: #10b981; color: white; text-decoration: none; font-weight: 800; padding: 14px 24px; border-radius: 12px; font-size: 1rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.2s; box-sizing: border-box;" onmouseover="this.style.background='#059669'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='#10b981'; this.style.transform='translateY(0)';">
                            🗓️ Choisir un créneau
                        </a>
                    </div>
                `;
            } else {
                // Default DTC Diagnostic Card
                bookingCard = `
                    <div style="background: #020617; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <h3 style="margin: 0 0 8px 0; color: #fff; font-size: 1.2rem; font-weight: 800;">Faites le point sur votre projet</h3>
                        <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.4;">Découvrez vos blocages et opportunités avec notre diagnostic gratuit en ligne.</p>
                        <a href="https://calendly.com/domtomconnect/30min" target="_blank" style="display: inline-block; background: #10b981; color: white; text-decoration: none; font-weight: 700; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3); transition: background 0.2s;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">Diagnostic Gratuit</a>
                    </div>
                `;
            }
            const plgDiagnosticCard = `
                <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 16px;">
                    <!-- Carte Réservation / Diagnostic -->
                    ${bookingCard}
                    
                    <!-- Carte Accompagnement (Premium) -->
                    <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);">
                        <h3 style="margin: 0 0 8px 0; color: #f8fafc; font-size: 1.2rem; font-weight: 800;">Besoin d'aller plus loin ?</h3>
                        <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.4;">Passez à la vitesse supérieure avec l'accompagnement 1-to-1 personnalisé de nos experts.</p>
                        <a href="https://domtomconnect.com/premium.html" target="_blank" style="display: inline-block; background: transparent; border: 1px solid #10b981; color: #10b981; text-decoration: none; font-weight: 700; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white';" onmouseout="this.style.background='transparent'; this.style.color='#10b981';">Accompagnement 1-to-1</a>
                    </div>
                </div>
            `;

            container.innerHTML = `
                <style>
                    @keyframes dtc-pulse {
                        0% { box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.4); }
                        70% { box-shadow: 0 0 0 10px rgba(15, 23, 42, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(15, 23, 42, 0); }
                    }
                </style>
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; background: ${bgStr}; min-height: 100vh; display: flex; justify-content: center; padding: 40px 20px;">
                    <div style="width: 100%; max-width: 480px;">
                        
                        <div style="text-align: center; margin-bottom: 40px;">
                            <img src="${avatarUrl}" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid white;">
                            <h1 style="margin: 0 0 8px 0; color: ${textStr}; font-size: 1.5rem; font-weight: 800;">${provider.full_name}</h1>
                            <p style="margin: 0 0 12px 0; color: #64748b; font-size: 1rem;">${provider.role === 'entreprise' ? 'Nos Solutions' : 'Mes Liens'}</p>
                            
                            <a href="https://domtomconnect.com/" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: white; border: 1px solid #e2e8f0; color: #475569; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-decoration: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                                🌐 Membre du réseau social Domtom Connect
                            </a>
                        </div>

                        <div>
                            ${itemsHtml}
                        </div>
                        
                        ${plgDiagnosticCard}
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <a href="https://domtomconnect.com" style="color: #94a3b8; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='#64748b'" onmouseout="this.style.color='#94a3b8'">Créer ma page gratuitement sur Domtom Connect</a>
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
