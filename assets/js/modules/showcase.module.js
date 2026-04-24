/**
 * Showcase Module - Domtom Connect
 * Implements the Micro-Boutique (Experts/Companies) and Marketplace (Spectators) logic.
 * Follows proven patterns from Malt and Fiverr.
 */
const ShowcaseModule = {
    /**
     * RENDERER: Global Marketplace (For Spectators)
     */
    async renderMarketplace(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: items, error } = await window._supabase
                .from('showcase_items')
                .select(`
                    *,
                    profile:profiles!user_id (full_name, avatar_url, role)
                `)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: #fafafa; min-height: 100vh;">
                    <div style="margin-bottom: 48px;">
                        <span style="color: #10b981; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1.5px;">Marketplace Officiel</span>
                        <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; color: #0f172a; margin: 12px 0; letter-spacing: -0.05em;">Solutions Territoriales</h1>
                        <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; max-width: 600px;">Découvrez les services et produits proposés par nos experts et entreprises vérifiés.</p>
                    </div>

                    ${items && items.length > 0 ? `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 32px;">
                            ${items.map(item => this.renderShowcaseCard(item, false)).join('')}
                        </div>
                    ` : `
                        <div style="text-align:center; padding: 100px 20px; background: white; border-radius: 32px; border: 2px dashed #e2e8f0;">
                            <div style="font-size: 4rem; margin-bottom: 24px;">🏢</div>
                            <h3 style="font-weight: 900; color: #0f172a; font-size: 1.5rem; margin-bottom: 12px;">Le catalogue arrive...</h3>
                            <p style="color: #64748b; font-weight: 600;">Nos prestataires sont en train de configurer leurs vitrines.</p>
                        </div>
                    `}
                </div>
            `;
        } catch (err) {
            console.error("[Showcase] Marketplace Error:", err);
            container.innerHTML = `<div style="padding:40px; color:#ef4444; font-weight:800; text-align:center;">Erreur: ${err.message}</div>`;
        }
    },

    /**
     * RENDERER: Management Hub (For Experts/Companies)
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expirée");

            const { data: items, error } = await window._supabase
                .from('showcase_items')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: white; border-radius: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); min-height: 80vh;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; flex-wrap: wrap; gap: 24px;">
                        <div>
                            <h1 style="font-size: 2.2rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.04em;">Ma Vitrine Professionnelle</h1>
                            <p style="color: #64748b; font-weight: 600; margin-top: 8px;">Gérez vos offres de services et produits visibles par tout l'écosystème.</p>
                        </div>
                        <button onclick="window.ShowcaseModule.openItemModal()" style="background: #0f172a; color: white; border: none; padding: 16px 32px; border-radius: 16px; font-weight: 900; font-size: 1rem; cursor: pointer; transition: 0.2s;">
                            + Ajouter une Offre
                        </button>
                    </div>

                    <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#0f172a; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:3px solid #0f172a;">Mes Offres</button>
                        <button id="tab-orders" onclick="ShowcaseModule.switchTab('orders')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Commandes Reçues</button>
                    </div>

                    <div id="showcase-content-area">
                        ${items && items.length > 0 ? `
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
                                ${items.map(item => this.renderShowcaseCard(item, true)).join('')}
                            </div>
                        ` : `
                            <div style="text-align:center; padding: 80px 20px; border: 2.5px dashed #f1f5f9; border-radius: 32px;">
                                <div style="font-size: 3.5rem; margin-bottom: 24px;">✨</div>
                                <h3 style="font-weight: 950; color: #020617; font-size: 1.5rem; margin-bottom: 12px;">Prenez votre place sur le Marché</h3>
                                <p style="color: #94a3b8; font-weight: 600; max-width: 400px; margin: 0 auto 32px auto;">Détaillez vos services ou produits pour attirer les porteurs de projets et les entreprises.</p>
                                <button onclick="window.ShowcaseModule.openItemModal()" style="background: #10b981; color: white; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 800; cursor: pointer;">Configurer mon 1er Service</button>
                            </div>
                        `}
                    </div>
                </div>
            `;
        } catch (err) {
            console.error("[Showcase] Manager Error:", err);
            container.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur critique: ${err.message}</div>`;
        }
    },

    /**
     * Card Template (High-Fidelity)
     */
    renderShowcaseCard(item, isEditable = false) {
        const unitLabel = item.unit ? ` / ${item.unit}` : '';
        const priceDisplay = item.price ? `${item.price_prefix || 'À partir de'} ${item.price}€${unitLabel}` : 'Sur devis';
        const profile = item.profile || {};
        
        return `
            <div style="background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; flex-direction: column; transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1); cursor: ${isEditable ? 'default' : 'pointer'};" 
                 onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 25px 50px -12px rgba(0,0,0,0.08)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                
                <div style="position: relative; height: 180px; width: 100%; overflow: hidden; background: #f8fafc;">
                    <img src="${item.image_url || 'https://via.placeholder.com/400x250?text=Service'}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); padding: 5px 12px; border-radius: 100px; color: white; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${item.category === 'product' ? '📦 Produit' : '💡 Service'}
                    </div>
                </div>

                <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <div style="font-size: 1.1rem; font-weight: 900; color: #020617; flex: 1; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${item.title}</div>
                    </div>
                    
                    <p style="font-size: 0.85rem; color: #64748b; font-weight: 500; line-height: 1.5; margin: 0 0 20px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${item.description || 'Appuyez pour voir les détails de cette offre.'}
                    </p>

                    <div style="margin-top: auto;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                            <div style="font-weight: 950; font-size: 1.25rem; color: #0f172a;">${priceDisplay}</div>
                            ${isEditable ? `
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="window.ShowcaseModule.openItemModal('${item.id}')" style="background: #f1f5f9; color: #020617; border: none; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer;">✏️</button>
                                    <button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; color: #dc2626; border: none; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer;">🗑️</button>
                                </div>
                            ` : `
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 28px; height: 28px; background: #e2e8f0; border-radius: 50%; overflow: hidden;">
                                        <img src="${profile.avatar_url || 'https://via.placeholder.com/100'}" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                    <span style="font-size: 0.75rem; font-weight: 800; color: #0f172a;">${profile.full_name || 'Expert'}</span>
                                </div>
                                <button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: #0f172a; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 850; font-size: 0.85rem; cursor: pointer; transition: 0.2s;">
                                    Commander
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * ITEM MODAL (Add / Edit)
     */
    async openItemModal(itemId = null) {
        console.log("[Showcase] Opening Modal for:", itemId || 'New Item');
        let itemData = { 
            title: '', description: '', price: '', category: 'service', 
            image_url: '', price_prefix: 'À partir de', unit: '' 
        };
        
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            if (data) itemData = data;
        }

        const overlay = document.getElementById('details-modal-overlay');
        if (!overlay) return;

        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 550px; border-radius: 32px; padding: 40px; position: relative; font-family: 'Plus Jakarta Sans', sans-serif;">
                <h2 style="font-weight: 950; margin: 0 0 24px 0; color: #020617;">${itemId ? 'Modifier mon offre' : 'Nouveau Service / Produit'}</h2>
                
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Titre de l'Offre *</label>
                        <input id="item-title" type="text" value="${itemData.title}" placeholder="Ex: Audit Stratégique 1h" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 700; box-sizing: border-box;">
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Description Marketing</label>
                        <textarea id="item-desc" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 600; min-height: 100px; box-sizing: border-box;">${itemData.description}</textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Type</label>
                            <select id="item-category" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 700; background: white;">
                                <option value="service" ${itemData.category === 'service' ? 'selected' : ''}>💡 Service / Conseil</option>
                                <option value="product" ${itemData.category === 'product' ? 'selected' : ''}>📦 Produit physique</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Tarification</label>
                            <select id="item-prefix" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 700; background: white;">
                                <option value="À partir de" ${itemData.price_prefix === 'À partir de' ? 'selected' : ''}>À partir de</option>
                                <option value="Prix fixe" ${itemData.price_prefix === 'Prix fixe' ? 'selected' : ''}>Prix fixe</option>
                                <option value="Sur devis" ${itemData.price_prefix === 'Sur devis' ? 'selected' : ''}>Sur devis</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Prix (€)</label>
                            <input id="item-price" type="number" value="${itemData.price || ''}" placeholder="Ex: 150" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 700; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Unité</label>
                            <select id="item-unit" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 700; background: white;">
                                <option value="" ${!itemData.unit ? 'selected' : ''}>Par défaut</option>
                                <option value="heure" ${itemData.unit === 'heure' ? 'selected' : ''}>/ Heure</option>
                                <option value="jour" ${itemData.unit === 'jour' ? 'selected' : ''}>/ Jour</option>
                                <option value="mois" ${itemData.unit === 'mois' ? 'selected' : ''}>/ Mois</option>
                                <option value="unité" ${itemData.unit === 'unité' ? 'selected' : ''}>/ Unité</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Image de l'offre</label>
                        <div id="image-upload-zone" style="display: flex; flex-direction: column; gap: 12px;">
                            ${itemData.image_url ? `<img src="${itemData.image_url}" id="item-preview" style="width: 120px; height: 80px; object-fit: cover; border-radius: 12px;">` : `<div id="item-preview" style="width: 120px; height: 80px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">📸</div>`}
                            <input id="item-file" type="file" accept="image/*" style="font-size: 0.8rem; font-weight: 700; color: #64748b;">
                            <input id="item-image" type="hidden" value="${itemData.image_url}">
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px; margin-top: 12px;">
                        <button id="save-item-btn" onclick="window.ShowcaseModule.saveItem('${itemId || ''}')" style="flex: 2; background: #10b981; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 900; cursor: pointer;">PUBLIER L'OFFRE</button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="flex: 1; background: #f1f5f9; color: #64748b; border: none; padding: 16px; border-radius: 14px; font-weight: 800; cursor: pointer;">Annuler</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    /**
     * SAVE ITEM with Image Upload Integration
     */
    async saveItem(itemId) {
        const title = document.getElementById('item-title').value.trim();
        const description = document.getElementById('item-desc').value.trim();
        const price = document.getElementById('item-price').value;
        const category = document.getElementById('item-category').value;
        const fileInput = document.getElementById('item-file');
        let image_url = document.getElementById('item-image').value;

        if (!title) return alert("Le titre est obligatoire.");

        const saveBtn = document.getElementById('save-item-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = "Traitement...";
        }

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expirée");

            // --- IMAGE UPLOAD LOGIC ---
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${session.user.id}/${Math.random()}.${fileExt}`;
                const filePath = `items/${fileName}`;

                const { error: uploadError } = await window._supabase.storage
                    .from('showcase')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = window._supabase.storage
                    .from('showcase')
                    .getPublicUrl(filePath);
                
                image_url = publicUrlData.publicUrl;
            }

            const data = {
                user_id: session.user.id,
                title, description, 
                price: price ? parseFloat(price) : null,
                category, image_url,
                price_prefix: document.getElementById('item-prefix').value,
                unit: document.getElementById('item-unit').value,
                status: 'active'
            };

            let res;
            if (itemId) {
                res = await window._supabase.from('showcase_items').update(data).eq('id', itemId);
            } else {
                res = await window._supabase.from('showcase_items').insert(data);
            }

            if (res.error) throw res.error;

            document.getElementById('details-modal-overlay').classList.remove('open');
            const target = document.getElementById('ecosystem-grid-container');
            ShowcaseModule.renderManager(target);
        } catch (err) { 
            alert("Erreur: " + err.message); 
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = "PUBLIER L'OFFRE";
            }
        }
    },

    /**
     * CHECKOUT MODAL
     */
    async openCheckoutModal(itemId) {
        try {
            const { data: item, error } = await window._supabase
                .from('showcase_items')
                .select('*, profile:profiles!user_id(full_name)')
                .eq('id', itemId)
                .single();

            if (error) throw error;

            const overlay = document.getElementById('details-modal-overlay');
            if (!overlay) return;

            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 32px; padding: 40px; position: relative; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="font-size: 2.5rem; margin-bottom: 16px;">🛒</div>
                        <h2 style="font-weight: 950; margin: 0; color: #020617;">Finaliser ma Commande</h2>
                        <p style="color: #64748b; font-weight: 600; margin-top: 8px;">À destination de : ${item.profile.full_name}</p>
                    </div>

                    <div style="background: #f8fafc; padding: 20px; border-radius: 20px; border: 1.5px solid #f1f5f9; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 900; color: #0f172a; font-size: 1.1rem;">${item.title}</div>
                                <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">Prix: ${item.price_prefix} ${item.price}€ ${item.unit ? '/' + item.unit : ''}</div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 32px;">
                        <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Notes / Précisions</label>
                        <textarea id="order-notes" placeholder="Dites-en plus sur votre besoin..." style="width: 100%; min-height: 80px; padding: 14px; border-radius: 14px; border: 1.5px solid #e2e8f0; font-family: inherit; font-size: 0.95rem; font-weight: 600; box-sizing: border-box;"></textarea>
                    </div>

                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.ShowcaseModule.createOrder('${item.id}', '${item.user_id}', ${item.price})" style="flex: 2; background: #0f172a; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: 0.2s;">
                            Confirmer & Payer
                        </button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="flex: 1; background: #f1f5f9; color: #64748b; border: none; padding: 18px; border-radius: 16px; font-weight: 800; cursor: pointer;">Annuler</button>
                    </div>
                </div>
            `;
            overlay.classList.add('open');
        } catch (err) { alert(err.message); }
    },

    /**
     * CREATE ORDER
     */
    async createOrder(itemId, providerId, price) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Connectez-vous pour commander.");

            const notes = document.getElementById('order-notes').value;

            const { error } = await window._supabase.from('showcase_orders').insert({
                item_id: itemId,
                buyer_id: session.user.id,
                provider_id: providerId,
                total_price: price,
                client_notes: notes,
                status: 'pending'
            });

            if (error) throw error;

            alert("Votre commande a bien été transmise ! Le prestataire va vous contacter.");
            document.getElementById('details-modal-overlay').classList.remove('open');
        } catch (err) { alert(err.message); }
    },

    /**
     * TAB SWITCHING
     */
    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        const tabVitrine = document.getElementById('tab-vitrine');
        const tabOrders = document.getElementById('tab-orders');

        if (!contentArea) return;

        if (tabName === 'vitrine') {
            tabVitrine.style.color = '#0f172a';
            tabVitrine.style.borderBottom = '3px solid #0f172a';
            tabOrders.style.color = '#94a3b8';
            tabOrders.style.borderBottom = 'none';
            
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id);
            
            contentArea.innerHTML = items && items.length > 0 
                ? `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">${items.map(item => this.renderShowcaseCard(item, true)).join('')}</div>`
                : `<p style="text-align:center; color:#94a3b8; padding:40px;">Aucune offre publiée.</p>`;
        } else {
            tabOrders.style.color = '#0f172a';
            tabOrders.style.borderBottom = '3px solid #0f172a';
            tabVitrine.style.color = '#94a3b8';
            tabVitrine.style.borderBottom = 'none';
            
            contentArea.innerHTML = `<div style="text-align:center;padding:40px;"><span class="loader"></span></div>`;
            
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: orders, error } = await window._supabase
                .from('showcase_orders')
                .select('*, item:item_id(title), buyer:profiles!buyer_id(full_name)')
                .eq('provider_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                contentArea.innerHTML = `<p style="color:red;">Erreur: ${error.message}</p>`;
                return;
            }

            contentArea.innerHTML = orders && orders.length > 0
                ? `<div style="display: flex; flex-direction: column; gap: 16px;">
                    ${orders.map(order => `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                    <span style="background: ${order.status === 'pending' ? '#fef3c7' : '#d1fae5'}; color: ${order.status === 'pending' ? '#92400e' : '#065f46'}; font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 100px; text-transform: uppercase;">${order.status}</span>
                                    <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">${new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div style="font-weight: 900; color: #020617; font-size: 1.1rem;">${order.item?.title || 'Produit supprimé'}</div>
                                <div style="font-size: 0.9rem; color: #475569; font-weight: 700; margin-top: 4px;">Client: ${order.buyer?.full_name || 'Inconnu'}</div>
                                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600; font-style: italic; margin-top: 8px;">"${order.client_notes || 'Pas de notes.'}"</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 950; font-size: 1.5rem; color: #0f172a; margin-bottom: 12px;">${order.total_price}€</div>
                                <button onclick="window.ShowcaseModule.updateOrderStatus('${order.id}', 'paid')" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer;">Confirmer Payé</button>
                            </div>
                        </div>
                    `).join('')}
                </div>`
                : `<p style="text-align:center; color:#94a3b8; padding:40px;">Aucune commande reçue pour le moment.</p>`;
        }
    },

    /**
     * UPDATE ORDER STATUS
     */
    async updateOrderStatus(orderId, status) {
        try {
            const { error } = await window._supabase.from('showcase_orders').update({ status }).eq('id', orderId);
            if (error) throw error;
            this.switchTab('orders');
        } catch (err) { alert(err.message); }
    },

    /**
     * DELETE ITEM
     */
    async deleteItem(id) {
        if (!confirm("Supprimer cette offre de votre vitrine ?")) return;
        try {
            const { error } = await window._supabase.from('showcase_items').delete().eq('id', id);
            if (error) throw error;
            const target = document.getElementById('ecosystem-grid-container');
            ShowcaseModule.renderManager(target);
        } catch (err) { alert("Erreur: " + err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
