/**
 * Showcase Module - Domtom Connect
 * Implements Modern PayPal SDK (Smart Buttons) for zero-friction payments.
 * Flow: Payment -> Commission (5%) -> Seller Balance -> Payout.
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb', // Default Sandbox. Replace with real Client ID.

    async init() {
        if (!window.paypal) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}&currency=EUR`;
            document.head.appendChild(script);
        }
    },

    /**
     * RENDERER: Global Marketplace
     */
    async renderMarketplace(container) {
        await this.init();
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: items, error } = await window._supabase
                .from('showcase_items')
                .select(`*, profile:profiles!user_id (full_name, avatar_url, role)`)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            const allItems = items || [];

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: #fafafa; min-height: 100vh;">
                    <div style="margin-bottom: 48px;">
                        <span style="color: #0070ba; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1.5px;">Marketplace Officiel</span>
                        <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; color: #0f172a; margin: 12px 0; letter-spacing: -0.05em;">Solutions Territoriales</h1>
                        <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; max-width: 600px;">Paiements sécurisés et garantis par Domtom Connect.</p>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
                        ${allItems.map(item => this.renderShowcaseCard(item, false)).join('')}
                    </div>
                </div>
            `;
        } catch (err) {
            container.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur Marketplace.</div>`;
        }
    },

    /**
     * RENDERER: Management Hub
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expirée");

            const { data: profile } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: white; border-radius: 32px; min-height: 80vh;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 48px;">
                        <div style="background: #0f172a; color: white; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Solde Disponible</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0;">${profile?.balance || 0}€</div>
                            <button onclick="window.ShowcaseModule.requestPayout()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%;">Demander un Retrait</button>
                        </div>
                        <div style="background: #f8fafc; border: 1.5px solid #f1f5f9; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Chiffre d'Affaires</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0; color: #020617;">${profile?.total_earnings || 0}€</div>
                            <div style="color: #64748b; font-size: 0.85rem; font-weight: 600;">Commissions plateforme : 5%</div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#0f172a; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:3px solid #0f172a;">Catalogue</button>
                        <button id="tab-withdraw" onclick="ShowcaseModule.switchTab('withdraw')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Retraits & Config 💸</button>
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
        ` : `<p style="color:#94a3b8; text-align:center; padding:40px;">Aucune offre.</p> <center><button onclick="window.ShowcaseModule.openItemModal()" style="background:#0f172a; color:white; border:none; padding:12px 24px; border-radius:12px; cursor:pointer;">+ Créer ma première offre</button></center>`;
    },

    renderShowcaseCard(item, isEditable = false) {
        return `
            <div style="background: white; border-radius: 28px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; transition: 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                <div style="height: 180px; background: #f8fafc;">
                    <img src="${item.image_url || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 24px; flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="font-weight: 950; color:#020617; font-size:1.1rem;">${item.title}</div>
                        ${isEditable ? `<button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border:none; border-radius:8px; cursor:pointer;">🗑️</button>` : ''}
                    </div>
                    <p style="font-size: 0.85rem; color:#64748b; font-weight:600; line-height:1.5; margin:0;">${item.description}</p>
                    <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 950; font-size: 1.4rem; color: #020617;">${item.price}€${item.unit ? `<span style='font-size:0.75rem; color:#94a3b8;'>/${item.unit}</span>` : ''}</span>
                        ${!isEditable ? `<button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: #0f172a; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 950; cursor: pointer;">Acheter</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * MODERN PAYPAL CHECKOUT MODAL
     */
    async openCheckoutModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*, profile:profiles!user_id(full_name)').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 48px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <h2 style="font-weight: 950; margin-bottom: 8px; color: #020617; font-size: 1.8rem; letter-spacing: -0.05em;">Finaliser l'achat</h2>
                    <p style="color: #64748b; font-weight: 600; margin-bottom: 32px;">Paiement sécurisé via PayPal</p>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; border: 1.5px solid #f1f5f9;">
                        <span style="font-weight: 800; color: #0f172a;">${item.title}</span>
                        <span style="font-weight: 950; font-size: 1.6rem; color: #106fba;">${item.price}€</span>
                    </div>

                    <div id="paypal-button-container" style="min-height: 150px;"></div>
                    
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color:#94a3b8; border:none; background:none; font-weight:750; margin-top:16px; cursor:pointer;">Annuler</button>
                    <p style="font-size: 0.7rem; color: #94a3b8; margin-top: 12px;">En payant, vous acceptez les conditions de service de Domtom Connect.</p>
                </div>
            `;
            overlay.classList.add('open');

            // Render PayPal Buttons
            if (window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: { currency_code: 'EUR', value: item.price.toString() },
                                description: `DTC Product: ${item.title}`
                            }]
                        });
                    },
                    onApprove: async (data, actions) => {
                        const details = await actions.order.capture();
                        await this.finalizeOrder(item, details);
                    },
                    onError: (err) => {
                        console.error('PayPal Error:', err);
                        alert("Erreur lors du chargement de PayPal. Veuillez réessayer.");
                    }
                }).render('#paypal-button-container');
            } else {
                document.getElementById('paypal-button-container').innerHTML = `<p style="color:red;">Erreur: SDK PayPal non chargé.</p>`;
            }
        } catch (err) { alert(err.message); }
    },

    async finalizeOrder(item, paymentDetails) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const netAmount = item.price * (1 - this.COMMISSION_RATE);

            // 1. Record Order
            await window._supabase.from('showcase_orders').insert({
                item_id: item.id, buyer_id: session.user.id, provider_id: item.user_id,
                total_price: item.price, status: 'paid', transaction_id: paymentDetails.id
            });

            // 2. Update Seller Balance
            const { data: seller } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', item.user_id).single();
            await window._supabase.from('profiles').update({
                balance: (seller.balance || 0) + netAmount,
                total_earnings: (seller.total_earnings || 0) + item.price
            }).eq('id', item.user_id);

            alert("VOTRE PAIEMENT A ÉTÉ VALIDÉ ! Merci pour votre confiance.");
            document.getElementById('details-modal-overlay').classList.remove('open');
            if (window.location.hash.includes('boutique')) this.renderMarketplace(document.getElementById('marketplace-container'));
        } catch (err) { alert("Erreur lors de la validation : " + err.message); }
    },

    async requestPayout() {
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: profile } = await window._supabase.from('profiles').select('balance, paypal_email').eq('id', session.user.id).single();
        
        if (!profile.paypal_email) return alert("Configurez votre email PayPal pour recevoir vos fonds.");
        if (!profile.balance || profile.balance < 10) return alert("Seuil de retrait minimum : 10€.");

        if (confirm(`Retirer ${profile.balance}€ vers ${profile.paypal_email} ?`)) {
            await window._supabase.from('payout_requests').insert({ user_id: session.user.id, amount: profile.balance, paypal_email: profile.paypal_email, status: 'pending' });
            await window._supabase.from('profiles').update({ balance: 0 }).eq('id', session.user.id);
            alert("Virement demandé. Traitement sous 48h.");
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        ['vitrine', 'withdraw'].forEach(t => {
            const el = document.getElementById(`tab-${t}`);
            if (el) {
                const active = t === tabName;
                el.style.color = active ? '#0f172a' : '#94a3b8';
                el.style.borderBottom = active ? '3px solid #0f172a' : 'none';
                el.style.fontWeight = active ? '900' : '700';
            }
        });

        const { data: { session } } = await window._supabase.auth.getSession();
        
        if (tabName === 'vitrine') {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id);
            contentArea.innerHTML = this.renderLocalGrid(items);
        } else {
            const { data: profile } = await window._supabase.from('profiles').select('paypal_email').eq('id', session.user.id).single();
            const { data: reqs } = await window._supabase.from('payout_requests').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    <div style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                         <h4 style="margin-top:0; font-weight:950;">Ma Config PayPal</h4>
                         <p style="font-size:0.85rem; color:#64748b; font-weight:600;">C'est ici qu'on vous envoie l'argent des ventes.</p>
                         <input id="paypal-email" type="email" value="${profile?.paypal_email || ''}" placeholder="votre-paypal@mail.com" style="width: 100%; padding:14px; border-radius:12px; border:1.5px solid #e2e8f0; margin:16px 0;">
                         <button onclick="window.ShowcaseModule.savePayPalConfig()" style="width:100%; background:#0f172a; color:white; border:none; padding:14px; border-radius:12px; font-weight:900; cursor:pointer;">Enregistrer</button>
                    </div>
                    <div style="background: #ffffff; border-radius: 24px; padding: 32px; border: 1px solid #f1f5f9;">
                        <h4 style="margin-top:0; font-weight:950;">Historique Retraits</h4>
                        ${reqs && reqs.length > 0 ? reqs.map(r => `
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f1f5f9;">
                                <div><div style="font-weight:900;">${r.amount}€</div><div style="font-size:0.7rem; color:#94a3b8;">${new Date(r.created_at).toLocaleDateString()}</div></div>
                                <span style="background:${r.status === 'pending' ? '#fef3c7' : '#d1fae5'}; color:${r.status === 'pending' ? '#92400e' : '#065f46'}; font-size:0.6rem; font-weight:950; padding:4px 8px; border-radius:100px;">${r.status}</span>
                            </div>
                        `).join('') : '<p style="color:#94a3b8; font-size:0.9rem;">Aucun retrait.</p>'}
                    </div>
                </div>
            `;
        }
    },

    async savePayPalConfig() {
        const email = document.getElementById('paypal-email').value.trim();
        const { data: { session } } = await window._supabase.auth.getSession();
        await window._supabase.from('profiles').update({ paypal_email: email }).eq('id', session.user.id);
        alert("Config enregistrée !");
        this.switchTab('withdraw');
    },

    async openItemModal() {
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 32px; padding: 40px; font-family:'Plus Jakarta Sans', sans-serif;">
                <h2 style="font-weight: 950; margin-bottom: 24px;">Nouvelle Offre</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <input id="item-title" placeholder="Titre..." style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700; box-sizing: border-box;">
                    <textarea id="item-desc" placeholder="Description..." style="width: 100%; min-height: 100px; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 600; box-sizing: border-box;"></textarea>
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px;">
                        <input id="item-price" type="number" placeholder="Prix (€)" style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;">
                        <input id="item-unit" placeholder="ex: séance" style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;">
                    </div>
                    <div style="background:#f8fafc; padding:24px; border:2px dashed #e2e8f0; border-radius:16px;">
                        <input id="item-file" type="file" accept="image/*">
                    </div>
                    <button onclick="window.ShowcaseModule.saveItem()" style="background: #10b981; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 950; cursor: pointer;">PUBLIER SUR LE MARCHÉ</button>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color: #64748b; background: none; border: none; cursor: pointer; font-weight: 700;">Annuler</button>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const payload = { 
                user_id: session.user.id, 
                title: document.getElementById('item-title').value,
                description: document.getElementById('item-desc').value,
                price: parseFloat(document.getElementById('item-price').value),
                unit: document.getElementById('item-unit').value,
                status: 'active'
            };
            
            const fileInput = document.getElementById('item-file');
            if (fileInput.files[0]) {
                const fn = `showcase/${session.user.id}/${Math.random()}`;
                await window._supabase.storage.from('showcase').upload(fn, fileInput.files[0]);
                const { data } = window._supabase.storage.from('showcase').getPublicUrl(fn);
                payload.image_url = data.publicUrl;
            }
            
            await window._supabase.from('showcase_items').insert(payload);
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if(confirm("Supprimer ?")) {
            await window._supabase.from('showcase_items').delete().eq('id', id);
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    }
};

window.ShowcaseModule = ShowcaseModule;
