/**
 * Showcase Module - Domtom Connect
 * Implements Smart Logistics Engine (Autopilot Mode)
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb',

    // COLISSIMO OUTRE-MER 2024 PRICING ENGINE
    getShippingRate(weight, zone) {
        if (zone === '0') return 0;
        const rates = {
            local: { base: 6.50, kg: 1.50 }, // Antilles -> Antilles
            national: { base: 12.80, kg: 4.80 }, // Antilles -> France
            international: { base: 28.50, kg: 14.00 } // Antilles -> Monde
        };
        const config = rates[zone] || rates.local;
        return config.base + (weight * config.kg);
    },

    getOctroiRate(category) {
        const rates = { 'hightech': 20.5, 'food': 4.0, 'culture': 2.5, 'standard': 8.5 };
        return rates[category] || 8.5;
    },

    async init() {
        if (!document.getElementById('details-modal-overlay')) console.warn("Modal overlay missing.");
        if (!window.paypal && !document.getElementById('paypal-sdk-script')) {
            const script = document.createElement('script');
            script.id = 'paypal-sdk-script';
            script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}&currency=EUR`;
            script.async = true;
            document.head.appendChild(script);
        }
    },

    async renderMarketplace(container) {
        await this.init();
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;
        try {
            const { data: items } = await window._supabase.from('showcase_items').select(`*, profile:profiles!user_id (full_name, showcase_primary_color, showcase_secondary_color)`).eq('status', 'active').order('created_at', { ascending: false });
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: #fdfdfd; min-height: 100vh;">
                    <div style="margin-bottom: 64px; text-align: center;">
                        <span style="background: #0070ba; color: white; padding: 6px 16px; border-radius: 99px; font-weight: 850; font-size: 0.75rem; text-transform: uppercase;">E-Commerce Solidaire</span>
                        <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 950; color: #020617; margin: 16px 0; letter-spacing: -0.06em;">Solutions Pays</h1>
                        <p style="color: #64748b; font-size: 1.2rem; font-weight: 600;">L'intelligence logistique au service des territoires.</p>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; max-width: 1400px; margin: 0 auto;">
                        ${(items || []).map(item => this.renderShowcaseCard(item, false, { primary: item.profile?.showcase_primary_color || '#020617', secondary: item.profile?.showcase_secondary_color || '#0070ba' })).join('')}
                    </div>
                </div>
            `;
        } catch (err) { container.innerHTML = `<div style="padding:40px; color:red;">${err.message}</div>`; }
    },

    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Veuillez vous connecter.");
            const { data: profile } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; background: white; border-radius: 32px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 48px;">
                        <div style="background: #020617; color: white; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase;">Solde Net</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0;">${profile?.balance || 0}€</div>
                            <button onclick="window.ShowcaseModule.requestPayout()" style="background: #10b981; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 900; width: 100%; cursor:pointer;">Retrait PayPal</button>
                        </div>
                        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #64748b; text-transform: uppercase;">Volume Global</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0; color: #020617;">${profile?.total_earnings || 0}€</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#0f172a; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:3px solid #0f172a;">Mon Catalogue</button>
                        <button id="tab-sales" onclick="ShowcaseModule.switchTab('sales')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Ventes & Expédition 📦</button>
                        <button id="tab-config" onclick="ShowcaseModule.switchTab('config')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Configuration 💸</button>
                    </div>
                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>
                </div>
            `;
        } catch (err) { container.innerHTML = `<div style="padding:40px; color:red;">${err.message}</div>`; }
    },

    renderLocalGrid(items) {
        return `
            <div style="margin-bottom: 32px; display: flex; justify-content: flex-end;">
                <button onclick="window.ShowcaseModule.openItemModal()" style="background:#0f172a; color:white; border:none; padding:14px 28px; border-radius:14px; cursor:pointer; font-weight:900;">+ Créer une offre</button>
            </div>
            ${items && items.length > 0 ? `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">${items.map(item => this.renderShowcaseCard(item, true)).join('')}</div>` : '<div style="text-align:center; padding:60px; color:#94a3b8;">Aucune offre active.</div>'}
        `;
    },

    renderShowcaseCard(item, isEditable = false, brandColors = { primary: '#0f172a', secondary: '#0070ba' }) {
        const btnColor = isEditable ? '#0f172a' : (brandColors.secondary || '#0070ba');
        return `
            <div style="background: white; border-radius: 28px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                <div style="height: 180px; background: #f8fafc; position: relative;"><img src="${item.image_url || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="font-weight: 950; color:#020617; font-size:1.1rem;">${item.title}</div>
                        ${isEditable ? `<div style="display: flex; gap: 8px;">
                            <button onclick='window.ShowcaseModule.openItemModal(${JSON.stringify(item).replace(/'/g, "&apos;")})' style="background: #f1f5f9; border:none; padding: 8px; border-radius:10px; cursor:pointer;">✏️</button>
                            <button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border:none; padding: 8px; border-radius:10px; cursor:pointer;">🗑️</button>
                        </div>` : ''}
                    </div>
                    <p style="font-size: 0.85rem; color:#64748b; font-weight:600; line-height:1.6;">${item.description}</p>
                    <div style="margin-top: auto; padding-top: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-weight: 950; font-size: 1.4rem; color: ${brandColors.primary || '#020617'};">${item.price}€</span>
                            <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">${item.category === 'product' ? (item.weight || 0.5)+'kg' : 'Net'}</div>
                        </div>
                        ${!isEditable ? `<button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: ${btnColor}; color: white; border: none; padding: 12px 24px; border-radius: 14px; font-weight: 950; cursor: pointer;">Commander</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    async openCheckoutModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*, profile:profiles!user_id(*)').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            const weight = item.weight || 0.5;
            const omRate = this.getOctroiRate(item.tax_category);
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 520px; border-radius: 40px; padding: 48px; font-family: 'Plus Jakarta Sans', sans-serif; max-height:90vh; overflow-y:auto;">
                    <h2 style="font-weight: 950; margin-bottom: 24px; text-align:center;">Finaliser l'achat</h2>
                    <div style="background: #f8fafc; padding: 24px; border-radius: 24px; margin-bottom: 32px;">
                         <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:800;"><span>${item.title}</span><span>${item.price.toFixed(2)}€</span></div>
                         <select id="ship-zone" onchange="window.ShowcaseModule.updateSmartPrice(${item.price}, ${weight}, ${omRate})" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; font-weight:800;">
                            <option value="0">Service dématérialisé (0€)</option>
                            <option value="local">Locales (DOM-TOM)</option>
                            <option value="national">France Métropolitaine</option>
                            <option value="international">Reste du Monde</option>
                         </select>
                         <div style="border-top:1px dashed #e2e8f0; margin-top:20px; padding-top:20px;">
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#64748b;"><span>Logistique (${weight}kg)</span><span id="txt-shipping">Calcul...</span></div>
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#64748b;"><span>Taxes (${omRate}%)</span><span id="txt-tax">Calcul...</span></div>
                            <div style="display:flex; justify-content:space-between; font-weight:950; font-size:1.8rem; color:#0070ba;"><span>TOTAL</span><span id="txt-total">...</span></div>
                         </div>
                    </div>
                    <div id="address-fields" style="display:none; margin-bottom:24px;">
                        <input id="ship-name" placeholder="Destinataire" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; margin-bottom:12px;">
                        <input id="ship-addr" placeholder="Adresse de livraison" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; margin-bottom:12px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;"><input id="ship-zip" placeholder="CP"><input id="ship-city" placeholder="Ville"></div>
                    </div>
                    <div id="paypal-button-container"></div>
                    <div id="local-fallback-container" style="display:none;"><button onclick="window.ShowcaseModule.executeAutomatedOrder('${item.id}', '${item.user_id}', ${item.price}, ${weight}, ${omRate})" style="width:100%; background:#10b981; color:white; border:none; padding:18px; border-radius:18px; font-weight:950; cursor:pointer;">Confirmer & Payer (Démo)</button></div>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="width:100%; background:none; border:none; color:#94a3b8; font-weight:800; cursor:pointer; margin-top:16px;">Annuler</button>
                </div>
            `;
            overlay.classList.add('open');
            this.updateSmartPrice(item.price, weight, omRate);
            if(window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { currency_code: 'EUR', value: document.getElementById('txt-total').innerText.replace('€','') } }] }),
                    onApprove: (data, actions) => actions.order.capture().then(d => this.executeAutomatedOrder(item.id, item.user_id, item.price, weight, omRate, d.id)),
                    onError: () => document.getElementById('local-fallback-container').style.display='block'
                }).render('#paypal-button-container').catch(() => document.getElementById('local-fallback-container').style.display='block');
            } else { document.getElementById('local-fallback-container').style.display='block'; }
        } catch (err) { alert(err.message); }
    },

    updateSmartPrice(basePrice, weight, taxRate) {
        const zone = document.getElementById('ship-zone').value;
        const shipRate = this.getShippingRate(weight, zone);
        const taxAmt = (basePrice * taxRate) / 100;
        const total = basePrice + shipRate + taxAmt;
        document.getElementById('txt-shipping').innerText = `${shipRate.toFixed(2)}€`;
        document.getElementById('txt-tax').innerText = `${taxAmt.toFixed(2)}€`;
        document.getElementById('txt-total').innerText = `${total.toFixed(2)}€`;
        document.getElementById('address-fields').style.display = zone === '0' ? 'none' : 'block';
    },

    async executeAutomatedOrder(itemId, providerId, basePrice, weight, taxRate, txId = 'DEMO_PIPAY') {
        const zone = document.getElementById('ship-zone').value;
        const shipRate = this.getShippingRate(weight, zone);
        const taxAmt = (basePrice * taxRate) / 100;
        const total = basePrice + shipRate + taxAmt;
        const { data: { session } } = await window._supabase.auth.getSession();
        const orderData = {
            item_id: itemId, buyer_id: session.user.id, provider_id: providerId,
            total_price: total, tax_amount: taxAmt, status: 'paid', transaction_id: txId,
            shipping_country: zone, invoice_number: `DOM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        };
        if(zone !== '0') {
            orderData.shipping_name = document.getElementById('ship-name').value;
            orderData.shipping_address = document.getElementById('ship-addr').value;
            orderData.shipping_zip = document.getElementById('ship-zip').value;
            orderData.shipping_city = document.getElementById('ship-city').value;
        }
        await window._supabase.from('showcase_orders').insert(orderData);
        const { data: s } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', providerId).single();
        await window._supabase.from('profiles').update({ balance: (s.balance || 0) + (basePrice * 0.95), total_earnings: (s.total_earnings || 0) + basePrice }).eq('id', providerId);
        alert("ACHAT RÉUSSI !");
        document.getElementById('details-modal-overlay').classList.remove('open');
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        const { data: { session } } = await window._supabase.auth.getSession();
        ['vitrine', 'sales', 'config'].forEach(t => {
            const el = document.getElementById(`tab-${t}`);
            if (el) {
                const active = t === tabName;
                el.style.color = active ? '#0f172a' : '#94a3b8';
                el.style.borderBottom = active ? '3px solid #0f172a' : 'none';
            }
        });
        if (tabName === 'vitrine') {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id);
            contentArea.innerHTML = this.renderLocalGrid(items);
        } else if (tabName === 'sales') {
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title), buyer:profiles!buyer_id(full_name)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = `<div style="background: white; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size:0.9rem;">
                    <thead><tr style="background: #f8fafc; border-bottom: 1px solid #f1f5f9; text-align: left;"><th style="padding: 16px;">Client</th><th style="padding: 16px;">Article</th><th style="padding: 16px;">Expédition</th><th style="padding: 16px;">Status</th><th style="padding: 16px;">Facture</th></tr></thead>
                    <tbody>${(orders || []).length > 0 ? (orders || []).map(o => `
                        <tr><td style="padding: 16px;"><b>${o.buyer?.full_name}</b><br>${o.shipping_city || 'Web'}</td><td style="padding: 16px;">${o.item?.title}<br><b>${o.total_price.toFixed(2)}€</b></td>
                        <td style="padding: 16px;"><input id="tr-${o.id}" value="${o.tracking_number || ''}" placeholder="Suivi #" style="width:80px;"><button onclick="window.ShowcaseModule.updateTracking('${o.id}')">OK</button></td>
                        <td style="padding: 16px;"><span style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:99px; font-weight:900; font-size:0.7rem;">${o.status.toUpperCase()}</span></td>
                        <td style="padding: 16px;"><button onclick="window.ShowcaseModule.generateInvoice('${o.id}')">📄</button></td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center; padding:40px;">Aucune vente.</td></tr>'}</tbody></table></div>`;
        } else {
            const { data: p } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            contentArea.innerHTML = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:32px;">
                <div style="background:#f8fafc; padding:32px; border-radius:24px; border:1px solid #e2e8f0;">
                    <h4 style="margin-top:0;">Config PayPal</h4>
                    <input id="pp-email" value="${p?.paypal_email || ''}" placeholder="Email PayPal" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0;">
                    <button onclick="window.ShowcaseModule.saveProConfig()" style="width:100%; background:#0f172a; color:white; border:none; padding:16px; border-radius:16px; margin-top:16px; cursor:pointer;">Sauvegarder</button>
                </div>
                <div style="background:white; padding:32px; border-radius:24px; border:1px solid #e2e8f0;">
                    <h4 style="margin-top:0;">Logistique Auto (Activée)</h4>
                    <p style="font-size:0.8rem; color:#64748b;">Le système utilise la grille Colissimo 2024. Le poids de vos articles définit le prix de livraison.</p>
                </div></div>`;
        }
    },

    async saveProConfig() {
        const { data: { session } } = await window._supabase.auth.getSession();
        await window._supabase.from('profiles').update({ paypal_email: document.getElementById('pp-email').value.trim() }).eq('id', session.user.id);
        alert("Config Sauvegardée !");
    },

    async updateTracking(orderId) {
        const tr = document.getElementById(`tr-${orderId}`).value;
        await window._supabase.from('showcase_orders').update({ tracking_number: tr, status: 'shipped' }).eq('id', orderId);
        alert("Numéro de suivi enregistré !");
        this.switchTab('sales');
    },

    async openItemModal(item = null) {
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 550px; border-radius: 40px; padding: 48px; max-height: 90vh; overflow-y: auto;">
                <h2 style="font-weight: 950; margin-bottom: 24px;">${item ? 'Modifier' : 'Nouveau'} Article</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <input id="item-id" type="hidden" value="${item?.id || ''}">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                        <div><label>Catégorie</label><select id="item-category" style="width:100%; padding:12px; border-radius:10px;"><option value="service" ${item?.category === 'service' ? 'selected' : ''}>Service</option><option value="product" ${item?.category === 'product' ? 'selected' : ''}>Produit Physique</option></select></div>
                        <div><label>Poids (kg)</label><input id="item-weight" type="number" step="0.1" value="${item?.weight || 0.5}" style="width:100%; padding:12px; border-radius:10px;"></div>
                    </div>
                    <div><label>Type Fiscal</label><select id="item-tax-cat" style="width:100%; padding:12px; border-radius:10px;">
                        <option value="standard" ${item?.tax_category === 'standard' ? 'selected' : ''}>Standard (8.5%)</option>
                        <option value="hightech" ${item?.tax_category === 'hightech' ? 'selected' : ''}>High-Tech (20.5%)</option>
                        <option value="food" ${item?.tax_category === 'food' ? 'selected' : ''}>Alimentaire (4%)</option>
                    </select></div>
                    <input id="item-title" value="${item?.title || ''}" placeholder="Titre..." style="width:100%; padding:14px; border-radius:12px;">
                    <textarea id="item-desc" placeholder="Description..." style="width:100%; min-height:80px; padding:14px; border-radius:12px;">${item?.description || ''}</textarea>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                        <div><label>Prix HT (€)</label><input id="item-price" type="number" value="${item?.price || ''}" style="width:100%; padding:12px; border-radius:10px;"></div>
                        <div><label>Image</label><input id="item-file" type="file"></div>
                    </div>
                    <button onclick="window.ShowcaseModule.saveItem()" style="background:#0f172a; color:white; padding:18px; border-radius:16px; font-weight:950; cursor:pointer;">ENREGISTRER</button>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color:#94a3b8; border:none; background:none; cursor:pointer;">Annuler</button>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const itemId = document.getElementById('item-id').value;
            const payload = { 
                user_id: session.user.id, title: document.getElementById('item-title').value,
                description: document.getElementById('item-desc').value, price: parseFloat(document.getElementById('item-price').value),
                category: document.getElementById('item-category').value, weight: parseFloat(document.getElementById('item-weight').value || 0.5),
                tax_category: document.getElementById('item-tax-cat').value, status: 'active'
            };
            const fileInput = document.getElementById('item-file');
            if (fileInput.files[0]) {
                const fn = `showcase/${session.user.id}/${Date.now()}`;
                await window._supabase.storage.from('showcase').upload(fn, fileInput.files[0]);
                payload.image_url = window._supabase.storage.from('showcase').getPublicUrl(fn).data.publicUrl;
            }
            if (itemId) await window._supabase.from('showcase_items').update(payload).eq('id', itemId);
            else await window._supabase.from('showcase_items').insert(payload);
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if(confirm("Supprimer l'offre ?")) {
            await window._supabase.from('showcase_items').delete().eq('id', id);
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    },

    async generateInvoice(orderId) {
        try {
            const { data: o } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(*), buyer:profiles!buyer_id(*), provider:profiles!provider_id(*)`).eq('id', orderId).single();
            const html = `<html><body style="font-family:sans-serif; padding:40px;"><h1>Facture ${o.invoice_number}</h1><p><b>Vendeur:</b> ${o.provider?.full_name}</p><p><b>Client:</b> ${o.shipping_name || o.buyer?.full_name}</p><p><b>Article:</b> ${o.item?.title}</p><h2>Total: ${o.total_price.toFixed(2)}€</h2><p style="font-size:0.8rem; color:#666;">Document généré électroniquement par Domtom Connect.</p></body></html>`;
            const win = window.open('','_blank'); win.document.write(html); win.document.close(); setTimeout(()=>win.print(),800);
        } catch (e) { alert(e.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
