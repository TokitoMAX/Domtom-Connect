/**
 * Showcase Module - Domtom Connect
 * Digital-First Edition: Services & Digital Products only.
 * Final Stability Patch.
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb',

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
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; background: #fafafa; min-height: 100vh;">
                    <div style="margin-bottom: 64px; text-align: center;">
                        <span style="background: #0070ba; color: white; padding: 6px 16px; border-radius: 99px; font-weight: 850; font-size: 0.75rem; text-transform: uppercase;">Hub de Services</span>
                        <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 950; color: #020617; margin: 16px 0; letter-spacing: -0.06em;">Solutions Digitales</h1>
                        <p style="color: #64748b; font-size: 1.2rem; font-weight: 600;">Accédez instantanément aux meilleures expertises de nos territoires.</p>
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
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 48px;">
                        <div style="background: #020617; color: white; padding: 32px; border-radius: 28px; box-shadow: 0 20px 30px rgba(0,0,0,0.1);">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase;">Revenus Disponibles</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0;">${profile?.balance || 0}€</div>
                            <button onclick="window.ShowcaseModule.requestPayout()" style="background: #10b981; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 900; width: 100%; cursor:pointer;">Transférer vers PayPal</button>
                        </div>
                        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #64748b; text-transform: uppercase;">Volume d'affaires Global</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0; color: #020617;">${profile?.total_earnings || 0}€</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#0f172a; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:3px solid #0f172a;">Mon Catalogue</button>
                        <button id="tab-sales" onclick="ShowcaseModule.switchTab('sales')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Journal des Ventes ✨</button>
                        <button id="tab-config" onclick="ShowcaseModule.switchTab('config')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Paramètres 💸</button>
                    </div>
                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>
                </div>
            `;
        } catch (err) { container.innerHTML = `<div style="padding:40px; color:red;">${err.message}</div>`; }
    },

    renderLocalGrid(items) {
        return `
            <div style="margin-bottom: 32px; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="window.ShowcaseModule.openItemModal()" style="background:#0f172a; color:white; border:none; padding:14px 28px; border-radius:14px; cursor:pointer; font-weight:900;">+ Créer une offre</button>
            </div>
            ${items && items.length > 0 ? `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">${items.map(item => this.renderShowcaseCard(item, true)).join('')}</div>` : '<div style="text-align:center; padding:60px; color:#94a3b8;">Aucune offre active.</div>'}
        `;
    },

    renderShowcaseCard(item, isEditable = false, brandColors = { primary: '#0f172a', secondary: '#0070ba' }) {
        const btnColor = isEditable ? '#0f172a' : (brandColors.secondary || '#0070ba');
        return `
            <div style="background: white; border-radius: 28px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; transition: 0.3s; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                <div style="height: 180px; background: #f8fafc; position: relative;"><img src="${item.image_url || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="font-weight: 950; color:#020617; font-size:1.1rem; letter-spacing: -0.02em;">${item.title}</div>
                        ${isEditable ? `<div style="display: flex; gap: 8px;">
                            <button onclick='window.ShowcaseModule.openItemModal(${JSON.stringify(item).replace(/'/g, "&apos;")})' style="background: #f1f5f9; border:none; padding: 8px; border-radius:10px; cursor:pointer;">✏️</button>
                            <button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border:none; padding: 8px; border-radius:10px; cursor:pointer;">🗑️</button>
                        </div>` : ''}
                    </div>
                    <p style="font-size: 0.85rem; color:#64748b; font-weight:600; line-height:1.6;">${item.description}</p>
                    <div style="margin-top: auto; padding-top: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-weight: 950; font-size: 1.4rem; color: ${brandColors.primary || '#020617'};">${item.price}€</div>
                        ${!isEditable ? `<button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: ${btnColor}; color: white; border: none; padding: 12px 24px; border-radius: 14px; font-weight: 950; cursor: pointer;">Acheter</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    async openCheckoutModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 48px; font-family: 'Plus Jakarta Sans', sans-serif; text-align:center;">
                    <h2 style="font-weight: 950; margin-bottom: 32px; letter-spacing: -0.06em;">Paiement Sécurisé</h2>
                    <div style="background: #f8fafc; padding: 32px; border-radius: 24px; margin-bottom: 32px; border: 1.5px solid #f1f5f9;">
                         <div style="font-weight: 800; font-size:1.1rem; color:#020617; margin-bottom:8px;">${item.title}</div>
                         <div style="font-weight: 950; font-size: 2.2rem; color: #0070ba;">${item.price.toFixed(2)}€</div>
                    </div>
                    <div id="paypal-button-container"></div>
                    <div id="local-fallback-container" style="display:none;">
                        <button onclick="window.ShowcaseModule.executeFinalOrder('${item.id}', '${item.user_id}', ${item.price})" style="width:100%; background:#10b981; color:white; border:none; padding:18px; border-radius:18px; font-weight:950; cursor:pointer;">Confirmer (Test)</button>
                    </div>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color:#94a3b8; border:none; background:none; cursor:pointer; margin-top:20px; font-weight:800;">Annuler</button>
                </div>
            `;
            overlay.classList.add('open');
            if(window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { currency_code: 'EUR', value: item.price.toString() } }] }),
                    onApprove: (data, actions) => actions.order.capture().then(d => this.executeFinalOrder(item.id, item.user_id, item.price, d.id)),
                    onError: () => document.getElementById('local-fallback-container').style.display='block'
                }).render('#paypal-button-container').catch(() => document.getElementById('local-fallback-container').style.display='block');
            } else { document.getElementById('local-fallback-container').style.display='block'; }
        } catch (err) { alert(err.message); }
    },

    async executeFinalOrder(itemId, providerId, total, txId = 'DEMO_MODE') {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Veuillez vous reconnecter.");
            
            const invoiceRef = `DOM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const orderData = {
                item_id: itemId, buyer_id: session.user.id, provider_id: providerId,
                total_price: total, status: 'paid', transaction_id: txId,
                invoice_number: invoiceRef
            };
            
            const { error: errIns } = await window._supabase.from('showcase_orders').insert(orderData);
            if (errIns) throw new Error("Base de données : " + errIns.message);

            const { data: s } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', providerId).single();
            await window._supabase.from('profiles').update({ balance: (s.balance || 0) + (total * 0.95), total_earnings: (s.total_earnings || 0) + total }).eq('id', providerId);
            
            alert("Paiement validé !");
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.switchTab('sales');
        } catch (error) {
            alert("❌ Erreur : " + error.message);
        }
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
                el.style.fontWeight = active ? '900' : '700';
            }
        });
        if (tabName === 'vitrine') {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id);
            contentArea.innerHTML = this.renderLocalGrid(items);
        } else if (tabName === 'sales') {
            // FIX: On ne demande plus la colonne 'email' qui n'existe pas dans la table profiles
            const { data: orders, error } = await window._supabase.from('showcase_orders')
                .select(`*, item:showcase_items(title), buyer:profiles!buyer_id(full_name)`)
                .eq('provider_id', session.user.id)
                .order('created_at', { ascending: false });
            
            if (error) { contentArea.innerHTML = `<div style="padding:40px; color:red;">Erreur : ${error.message}</div>`; return; }

            const totalRev = (orders || []).reduce((acc, o) => acc + (o.total_price || 0), 0);
            
            contentArea.innerHTML = `
                <div style="margin-bottom:32px; display:grid; grid-template-columns: repeat(2, 1fr); gap:20px;">
                    <div style="background:#f8fafc; padding:20px; border-radius:20px; border:1.5px solid #e2e8f0; text-align:center;">
                        <div style="font-size:0.7rem; font-weight:850; color:#64748b; text-transform:uppercase;">Ventes</div>
                        <div style="font-size:1.8rem; font-weight:950;">${(orders || []).length}</div>
                    </div>
                    <div style="background:#020617; padding:20px; border-radius:20px; text-align:center; color:white;">
                        <div style="font-size:0.7rem; font-weight:850; color:#94a3b8; text-transform:uppercase;">Net Expert</div>
                        <div style="font-size:1.8rem; font-weight:950;">${(totalRev * 0.95).toFixed(2)}€</div>
                    </div>
                </div>

                <div style="background: white; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
                    <table style="width: 100%; border-collapse: collapse; font-size:0.9rem;">
                        <thead style="background: #f8fafc; border-bottom: 2px solid #f1f5f9; text-align: left;">
                            <tr>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Client / Date</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Offre</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Gain Net</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(orders || []).length > 0 ? (orders || []).map(o => `
                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 16px;">
                                        <div style="font-weight: 950; color:#020617;">${o.buyer?.full_name || 'Client Direct'}</div>
                                        <div style="font-size:0.75rem; color:#94a3b8;">${new Date(o.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td style="padding: 16px;">
                                        <div style="font-weight: 700;">${o.item?.title}</div>
                                        <div style="font-size:0.7rem; color:#94a3b8; font-weight:900;">${o.invoice_number || 'DOM-TEST'}</div>
                                    </td>
                                    <td style="padding: 16px; font-weight: 950; color: #10b981;">+${(o.total_price * 0.95).toFixed(2)}€</td>
                                    <td style="padding: 16px;">
                                        <button onclick="window.ShowcaseModule.generateInvoice('${o.id}')" style="background:#f1f5f9; border:none; padding:10px; border-radius:10px; cursor:pointer; font-weight:900; font-size:0.7rem; color:#0070ba;">FACTURE</button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="4" style="text-align:center; padding:40px; color:#94a3b8;">Aucune vente enregistrée.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            const { data: p } = await window._supabase.from('profiles').select('paypal_email').eq('id', session.user.id).single();
            contentArea.innerHTML = `
                <div style="background:#f8fafc; padding:32px; border-radius:24px; border:1px solid #e2e8f0; max-width:500px;">
                    <h4 style="margin-top:0; font-weight:950;">Paiements PayPal</h4>
                    <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px;">L'adresse email sur laquelle vous recevrez vos virements.</p>
                    <input id="pp-email" value="${p?.paypal_email || ''}" placeholder="Votre email PayPal" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; font-weight:700;">
                    <button onclick="window.ShowcaseModule.saveProConfig()" style="width:100%; background:#0f172a; color:white; border:none; padding:16px; border-radius:16px; margin-top:20px; font-weight:950; cursor:pointer;">Mettre à jour</button>
                </div>
            `;
        }
    },

    async saveProConfig() {
        const { data: { session } } = await window._supabase.auth.getSession();
        await window._supabase.from('profiles').update({ paypal_email: document.getElementById('pp-email').value.trim() }).eq('id', session.user.id);
        alert("Config Sauvegardée !");
    },

    async openItemModal(item = null) {
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 48px;">
                <h2 style="font-weight: 950; margin-bottom: 24px; letter-spacing:-0.04em;">${item ? 'Modifier l\'offre' : 'Nouvelle Offre Digitale'}</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <input id="item-id" type="hidden" value="${item?.id || ''}">
                    <input id="item-title" value="${item?.title || ''}" placeholder="Titre de l'offre..." style="width: 100%; padding: 16px; border-radius: 14px; border: 2.5px solid #e2e8f0; font-weight: 700; font-size:1.1rem;">
                    <textarea id="item-desc" placeholder="Que vendez-vous ?" style="width: 100%; min-height: 120px; padding: 16px; border-radius: 14px; border: 2.5px solid #e2e8f0; font-family: inherit;">${item?.description || ''}</textarea>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                        <div>
                            <label style="font-size:0.75rem; font-weight:800; color:#64748b;">PRIX NET (€)</label>
                            <input id="item-price" type="number" value="${item?.price || ''}" placeholder="ex: 99" style="width: 100%; padding: 16px; border-radius: 14px; border: 2.5px solid #e2e8f0; font-weight: 700;">
                        </div>
                        <div>
                            <label style="font-size:0.75rem; font-weight:800; color:#64748b;">VISUEL</label>
                            <input id="item-file" type="file" style="margin-top:4px;">
                        </div>
                    </div>
                    <button onclick="window.ShowcaseModule.saveItem()" style="background: #0f172a; color: white; border: none; padding: 20px; border-radius: 18px; font-weight: 950; cursor: pointer; font-size:1.1rem;">PUBLIER L'OFFRE</button>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color: #94a3b8; border: none; background: none; cursor: pointer; font-weight: 800;">Annuler</button>
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
                category: 'service', status: 'active'
            };
            const fileInput = document.getElementById('item-file');
            if (fileInput.files[0]) {
                const fn = `showcase/${session.user.id}/${Date.now()}`;
                await window._supabase.storage.from('showcase').upload(fn, fileInput.files[0]);
                const { data } = window._supabase.storage.from('showcase').getPublicUrl(fn);
                payload.image_url = data.publicUrl;
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
            const html = `<html><body style="font-family:sans-serif; padding:60px; max-width:800px; margin:0 auto; color:#020617; line-height:1.5;">
                <div style="display:flex; justify-content:space-between; border-bottom:2px solid #f1f5f9; padding-bottom:30px; margin-bottom:40px;">
                    <div><h2 style="margin:0; color:#0070ba;">DOMTOM CONNECT</h2><p style="font-size:0.8rem; color:#94a3b8;">Showcase Digital Edition</p></div>
                    <div style="text-align:right;"><h1 style="margin:0; font-size:2.5rem; letter-spacing:-0.04em;">FACTURE</h1><p style="font-weight:900;">Ref: ${o.invoice_number || 'DOM-INV-001'}</p></div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-bottom:40px;">
                    <div><h4 style="color:#64748b; text-transform:uppercase; font-size:0.7rem; margin-bottom:10px;">EXPERT</h4><p><b>${o.provider?.full_name}</b><br>${o.provider?.paypal_email || ''}</p></div>
                    <div style="text-align:right;"><h4 style="color:#64748b; text-transform:uppercase; font-size:0.7rem; margin-bottom:10px;">CLIENT</h4><p><b>${o.buyer?.full_name}</b></p></div>
                </div>
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;"><th style="text-align:left; padding:15px; font-size:0.7rem; color:#64748b;">DÉSIGNATION</th><th style="text-align:right; padding:15px; font-size:0.7rem; color:#64748b;">MONTANT TTC</th></tr></thead>
                    <tbody><tr><td style="padding:20px; border-bottom:1px solid #f1f5f9;"><b>${o.item?.title}</b><br><span style="font-size:0.8rem; color:#64748b;">Service Digital - Achat immédiat</span></td><td style="text-align:right; padding:20px; border-bottom:1px solid #f1f5f9; font-weight:950; font-size:1.3rem;">${o.total_price.toFixed(2)}€</td></tr></tbody>
                </table>
                <div style="display:flex; justify-content:flex-end; margin-top:40px;">
                     <div style="background:#020617; color:white; padding:30px; border-radius:24px; min-width:240px; text-align:right;">
                        <span style="font-size:0.75rem; color:#94a3b8; font-weight:800; text-transform:uppercase;">Total Payé</span>
                        <div style="font-size:2rem; font-weight:950;">${o.total_price.toFixed(2)}€</div>
                     </div>
                </div>
            </body></html>`;
            const win = window.open('','_blank'); win.document.write(html); win.document.close(); setTimeout(()=>win.print(),800);
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
