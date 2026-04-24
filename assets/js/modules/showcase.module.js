/**
 * Showcase Module - Domtom Connect
 * Implements the Micro-Boutique (Experts/Companies) and Marketplace (Spectators) logic.
 * Integrated with Shopify Storefront API for professional e-commerce.
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
            const allItems = items || [];

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: #fafafa; min-height: 100vh;">
                    <div style="margin-bottom: 48px;">
                        <span style="color: #10b981; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1.5px;">Marketplace Officiel</span>
                        <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; color: #0f172a; margin: 12px 0; letter-spacing: -0.05em;">Solutions Territoriales</h1>
                        <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; max-width: 600px;">Découvrez les services et produits proposés par nos experts et entreprises vérifiés via notre catalogue et Shopify.</p>
                    </div>

                    ${allItems.length > 0 ? `
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
                            ${allItems.map(item => this.renderShowcaseCard(item, false)).join('')}
                        </div>
                    ` : `
                        <div style="text-align:center; padding: 120px 20px; background: white; border-radius: 40px; border: 2px dashed #e2e8f0;">
                            <div style="font-size: 5rem; margin-bottom: 24px;">🏢</div>
                            <h3 style="font-weight: 950; color: #0f172a; font-size: 1.8rem; margin-bottom: 12px;">Le Marché se prépare...</h3>
                            <p style="color: #64748b; font-weight: 600; font-size: 1.1rem;">Nos prestataires configurént actuellement leurs boutiques.</p>
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
     * FETCH SHOPIFY PRODUCTS
     */
    async fetchShopifyProducts(expert) {
        try {
            const query = `
            {
              products(first: 10) {
                edges {
                  node {
                    id
                    title
                    description
                    handle
                    productType
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          price {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`;

            const response = await fetch(`https://${expert.shopify_domain}/api/2023-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': expert.shopify_access_token
                },
                body: JSON.stringify({ query })
            });

            const result = await response.json();
            if (!result.data || !result.data.products) return [];

            return result.data.products.edges.map(edge => {
                const p = edge.node;
                const price = p.variants.edges[0]?.node.price;
                return {
                    id: p.id,
                    isShopify: true,
                    shopify_domain: expert.shopify_domain,
                    handle: p.handle,
                    title: p.title,
                    description: p.description,
                    price: price ? price.amount : null,
                    price_prefix: 'Prix fixe',
                    image_url: p.images.edges[0]?.node.url,
                    category: p.productType.toLowerCase().includes('service') ? 'service' : 'product',
                    profile: {
                        full_name: expert.full_name,
                        avatar_url: expert.avatar_url
                    }
                };
            });
        } catch (err) {
            console.warn(`[Shopify] Error fetching for ${expert.shopify_domain}:`, err);
            return [];
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
                            <p style="color: #64748b; font-weight: 600; margin-top: 8px;">Gérez vos offres locales.</p>
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
                        ${this.renderLocalGrid(items)}
                    </div>
                </div>
            `;
        } catch (err) {
            container.innerHTML = `<div style="padding:40px; color:#ef4444;">${err.message}</div>`;
        }
    },

    renderLocalGrid(items) {
        return items && items.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
                ${items.map(item => this.renderShowcaseCard(item, true)).join('')}
            </div>
        ` : `
            <div style="text-align:center; padding: 80px 20px; border: 2.5px dashed #f1f5f9; border-radius: 32px;">
                <div style="font-size: 3.5rem; margin-bottom: 24px;">✨</div>
                <h3 style="font-weight: 950; color: #020617; font-size: 1.5rem; margin-bottom: 12px;">Votre catalogue est vide</h3>
                <p style="color: #94a3b8; font-weight: 600; max-width: 400px; margin: 0 auto 32px auto;">Ajoutez vos services manuellement ou passez par l'onglet Shopify pour synchroniser votre boutique.</p>
                <button onclick="window.ShowcaseModule.openItemModal()" style="background: #10b981; color: white; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 800; cursor: pointer;">Créer ma 1ère offre</button>
            </div>
        `;
    },

    /**
     * Card Template (Premium SaaS Style)
     */
    renderShowcaseCard(item, isEditable = false) {
        const unitLabel = item.unit ? ` / ${item.unit}` : '';
        const price = item.price ? `${item.price}€` : 'Sur devis';
        
        return `
            <div style="background: white; border-radius: 32px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; transition: all 0.4s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                <div style="position: relative; height: 200px; background: #f8fafc;">
                    <img src="${item.image_url || 'https://via.placeholder.com/600x400?text=Offre+DTC'}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); padding: 6px 14px; border-radius: 100px; color: #0f172a; font-size: 0.7rem; font-weight: 900; text-transform: uppercase;">
                        ${item.category === 'product' ? '📦 Produit' : '💡 Service'}
                    </div>
                </div>
                
                <div style="padding: 28px; flex: 1; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="font-size: 1.25rem; font-weight: 950; color: #0f172a; line-height: 1.2; letter-spacing: -0.04em;">${item.title}</div>
                        ${isEditable ? `
                            <div style="display: flex; gap: 6px;">
                                <button onclick="window.ShowcaseModule.openItemModal('${item.id}')" style="background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer;">✏️</button>
                                <button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer;">🗑️</button>
                            </div>
                        ` : `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <img src="${item.profile?.avatar_url || 'https://via.placeholder.com/100'}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #e2e8f0;">
                                <span style="font-size: 0.7rem; font-weight: 800; color: #64748b;">${item.profile?.full_name || 'Expert'}</span>
                            </div>
                        `}
                    </div>
                    
                    <p style="font-size: 0.9rem; color: #64748b; font-weight: 500; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${item.description || 'Description détaillée indisponible.'}
                    </p>

                    <div style="margin-top: auto; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.65rem; font-weight: 850; color: #94a3b8; text-transform: uppercase;">${item.price_prefix || 'Tarif'}</div>
                            <div style="font-weight: 950; font-size: 1.5rem; color: #0f172a;">${price}<span style="font-size: 0.8rem; color:#94a3b8;">${unitLabel}</span></div>
                        </div>

                        ${!isEditable ? `
                            <button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 950; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                                Commander
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * ACTION HANDLER: Redirect to Shopify or Open Checkout Modal
     */
    handleAction(id, isShopify, domain, handle) {
        if (isShopify) {
            window.open(`https://${domain}/products/${handle}`, '_blank');
        } else {
            this.openCheckoutModal(id);
        }
    },

    /**
     * TAB SWITCHING
     */
    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        const tabs = ['vitrine', 'orders', 'shopify'];
        
        tabs.forEach(t => {
            const el = document.getElementById(`tab-${t}`);
            if (el) {
                const active = t === tabName;
                el.style.color = active ? '#0f172a' : '#94a3b8';
                el.style.borderBottom = active ? '3px solid #0f172a' : 'none';
                el.style.fontWeight = active ? '900' : '700';
            }
        });

        if (tabName === 'vitrine') {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id);
            contentArea.innerHTML = this.renderLocalGrid(items);
        } 
        else if (tabName === 'orders') {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: orders } = await window._supabase
                .from('showcase_orders').select('*, item:item_id(title), buyer:profiles!buyer_id(full_name)')
                .eq('provider_id', session.user.id).order('created_at', { ascending: false });

            contentArea.innerHTML = orders && orders.length > 0
                ? `<div style="display: flex; flex-direction: column; gap: 16px;">${orders.map(order => this.renderOrderRow(order)).join('')}</div>`
                : `<p style="text-align:center; color:#94a3b8; padding:40px;">Aucune commande reçue.</p>`;
        }
        else if (tabName === 'shopify') {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: profile } = await window._supabase.from('profiles').select('shopify_domain, shopify_access_token').eq('id', session.user.id).single();
            contentArea.innerHTML = this.renderShopifyConfigUI(profile);
        }
    },

    renderShopifyConfigUI(profile) {
        return `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; text-align: left; max-width: 600px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <div style="width: 48px; height: 48px; background: #95bf47; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🔌</div>
                    <h3 style="font-weight: 950; font-size: 1.5rem; margin: 0;">Connecteur Shopify</h3>
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Domaine boutique (.myshopify.com)</label>
                    <input id="shopify-domain" type="text" value="${profile?.shopify_domain || ''}" placeholder="ma-boutique.myshopify.com" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 700;">
                </div>
                <div style="margin-bottom: 32px;">
                    <label style="display: block; font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Storefront Access Token</label>
                    <input id="shopify-token" type="password" value="${profile?.shopify_access_token || ''}" placeholder="shpat_..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-family: inherit; font-weight: 700;">
                </div>
                <button onclick="window.ShowcaseModule.saveShopifyConfig()" style="width: 100%; background: #0f172a; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 950; cursor: pointer;">Synchroniser ma Boutique</button>
            </div>
        `;
    },

    async saveShopifyConfig() {
        const domain = document.getElementById('shopify-domain').value.trim();
        const token = document.getElementById('shopify-token').value.trim();
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('profiles').update({ shopify_domain: domain, shopify_access_token: token }).eq('id', session.user.id);
            alert("Boutique synchronisée ! Vos produits apparaîtront dans le Marketplace.");
            this.switchTab('shopify');
        } catch (err) { alert(err.message); }
    },

    renderOrderRow(order) {
        return `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="background: ${order.status === 'pending' ? '#fef3c7' : '#d1fae5'}; color: ${order.status === 'pending' ? '#92400e' : '#065f46'}; font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 100px; text-transform: uppercase;">${order.status}</span>
                    <div style="font-weight: 900; padding-top:8px;">${order.item?.title || 'Commande Locale'}</div>
                    <div style="font-size: 0.85rem; color: #64748b;">Client: ${order.buyer?.full_name}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 950; font-size: 1.2rem;">${order.total_price}€</div>
                    <button onclick="window.ShowcaseModule.updateOrderStatus('${order.id}', 'paid')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 0.75rem; cursor: pointer; margin-top:8px;">Confirmer</button>
                </div>
            </div>
        `;
    },

    async openItemModal(itemId = null) {
        let itemData = { title: '', description: '', price: '', category: 'service', image_url: '', price_prefix: 'À partir de', unit: '' };
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            if (data) itemData = data;
        }
        const overlay = document.getElementById('details-modal-overlay');
        if (!overlay) return;
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 550px; border-radius: 32px; padding: 40px; position: relative; font-family: 'Plus Jakarta Sans', sans-serif;">
                <h2 style="font-weight: 950; margin-bottom: 24px;">${itemId ? 'Modifier' : 'Nouvelle Offre'}</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <input id="item-title" type="text" value="${itemData.title}" placeholder="Titre..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                    <textarea id="item-desc" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; min-height: 100px;">${itemData.description}</textarea>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <select id="item-category" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; background:white;">
                            <option value="service" ${itemData.category === 'service' ? 'selected' : ''}>Service</option>
                            <option value="product" ${itemData.category === 'product' ? 'selected' : ''}>Produit</option>
                        </select>
                        <select id="item-prefix" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; background:white;">
                            <option value="À partir de" ${itemData.price_prefix === 'À partir de' ? 'selected' : ''}>À partir de</option>
                            <option value="Prix fixe" ${itemData.price_prefix === 'Prix fixe' ? 'selected' : ''}>Prix fixe</option>
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <input id="item-price" type="number" value="${itemData.price || ''}" placeholder="Prix (€)" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0;">
                        <select id="item-unit" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; background:white;">
                            <option value="">Pas d'unité</option>
                            <option value="heure" ${itemData.unit === 'heure' ? 'selected' : ''}>Heure</option>
                            <option value="jour" ${itemData.unit === 'jour' ? 'selected' : ''}>Jour</option>
                        </select>
                    </div>
                    <div>
                        <input id="item-file" type="file" accept="image/*" style="width:100%;">
                        <input id="item-image" type="hidden" value="${itemData.image_url}">
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button id="save-item-btn" onclick="window.ShowcaseModule.saveItem('${itemId || ''}')" style="flex: 2; background: #10b981; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 900; cursor: pointer;">PUBLIER</button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="flex: 1; background: #f1f5f9; color: #64748b; border: none; padding: 16px; border-radius: 14px; font-weight: 800; cursor: pointer;">ANNULER</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem(itemId) {
        const title = document.getElementById('item-title').value.trim();
        const description = document.getElementById('item-desc').value.trim();
        const price = document.getElementById('item-price').value;
        const category = document.getElementById('item-category').value;
        const fileInput = document.getElementById('item-file');
        let image_url = document.getElementById('item-image').value;

        if (!title) return alert("Le titre est obligatoire.");
        document.getElementById('save-item-btn').innerHTML = "Bruit...";

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                const fileName = `items/${session.user.id}/${Math.random()}.${file.name.split('.').pop()}`;
                await window._supabase.storage.from('showcase').upload(fileName, file);
                const { data } = window._supabase.storage.from('showcase').getPublicUrl(fileName);
                image_url = data.publicUrl;
            }

            const payload = { user_id: session.user.id, title, description, price: price ? parseFloat(price) : null, category, image_url, price_prefix: document.getElementById('item-prefix').value, unit: document.getElementById('item-unit').value, status: 'active' };

            if (itemId) await window._supabase.from('showcase_items').update(payload).eq('id', itemId);
            else await window._supabase.from('showcase_items').insert(payload);

            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); document.getElementById('save-item-btn').innerHTML = "PUBLIER"; }
    },

    async openCheckoutModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*, profile:profiles!user_id(full_name)').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 450px; border-radius: 32px; padding: 40px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🛒</div>
                    <h2 style="font-weight: 950; margin-bottom: 8px;">Commander</h2>
                    <p style="color: #64748b; margin-bottom: 24px;">Prestation par ${item.profile.full_name}</p>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 20px; text-align: left; margin-bottom: 24px;">
                        <div style="font-weight: 900;">${item.title}</div>
                        <div style="color: #10b981; font-weight: 800; margin-top: 4px;">${item.price}€</div>
                    </div>
                    <textarea id="order-notes" placeholder="Vos précisions..." style="width: 100%; min-height: 80px; padding: 14px; border-radius: 14px; border: 1.5px solid #e2e8f0; margin-bottom: 24px;"></textarea>
                    <button onclick="window.ShowcaseModule.createOrder('${item.id}', '${item.user_id}', ${item.price})" style="width: 100%; background: #0f172a; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 900;">Confirmer la Commande</button>
                </div>
            `;
            overlay.classList.add('open');
        } catch (err) { alert(err.message); }
    },

    async createOrder(itemId, providerId, price) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const notes = document.getElementById('order-notes').value;
            await window._supabase.from('showcase_orders').insert({ item_id: itemId, buyer_id: session.user.id, provider_id: providerId, total_price: price, client_notes: notes, status: 'pending' });
            alert("Commande transmise !");
            document.getElementById('details-modal-overlay').classList.remove('open');
        } catch (err) { alert(err.message); }
    },

    async updateOrderStatus(orderId, status) {
        await window._supabase.from('showcase_orders').update({ status }).eq('id', orderId);
        this.switchTab('orders');
    },

    async deleteItem(id) {
        if (confirm("Supprimer ?")) {
            await window._supabase.from('showcase_items').delete().eq('id', id);
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    }
};

window.ShowcaseModule = ShowcaseModule;
