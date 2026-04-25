/**
 * Showcase Module - Domtom Connect
 * Implements the Platform-Escrow logic (Malt/Fiverr Style).
 * Professional flow: Secure Payment -> 5% Service Fee -> Seller Balance -> Payout Request.
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05, // Lowered to 5% (Very competitive)
    PLATFORM_PAYPAL: 'contact@domtomconnect.com', 

    /**
     * RENDERER: Global Marketplace (For Spectators)
     */
    async renderMarketplace(container) {
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
                        <span style="color: #10b981; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1.5px;">Marketplace Officiel</span>
                        <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; color: #0f172a; margin: 12px 0; letter-spacing: -0.05em;">Solutions Pays</h1>
                        <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; max-width: 600px;">Achetez en toute sécurité. Les fonds sont garantis par Domtom Connect.</p>
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
     * RENDERER: Management Hub (For Experts/Companies)
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
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: white; border-radius: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); min-height: 80vh;">
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 48px;">
                        <div style="background: #0f172a; color: white; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Solde Disponible</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0;">${profile?.balance || 0}€</div>
                            <button onclick="window.ShowcaseModule.requestPayout()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%;">Demander un Virement</button>
                        </div>
                        <div style="background: #f8fafc; border: 1.5px solid #f1f5f9; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Ventes Totales</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0; color: #020617;">${profile?.total_earnings || 0}€</div>
                            <div style="color: #64748b; font-size: 0.85rem; font-weight: 600;">Commission fixe 5% par vente</div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#0f172a; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:3px solid #0f172a;">Mon Catalogue</button>
                        <button id="tab-orders" onclick="ShowcaseModule.switchTab('orders')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Mes Ventes</button>
                        <button id="tab-withdraw" onclick="ShowcaseModule.switchTab('withdraw')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Retraits PayPal 💸</button>
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
        ` : `<p style="color:#94a3b8; text-align:center;">Catalogue vide.</p>`;
    },

    renderShowcaseCard(item, isEditable = false) {
        const priceLabel = item.price ? `${item.price}€` : 'Devis';
        return `
            <div style="background: white; border-radius: 28px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                <div style="height: 180px; background: #f8fafc;">
                    <img src="${item.image_url || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 24px; flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="font-weight: 950; color:#020617; font-size:1.1rem;">${item.title}</div>
                        ${isEditable ? `<button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border:none; border-radius:8px; cursor:pointer;">🗑️</button>` : ''}
                    </div>
                    <p style="font-size: 0.85rem; color:#64748b; font-weight:600; line-height:1.5;">${item.description}</p>
                    <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 950; font-size: 1.4rem; color: #0f172a;">${priceLabel}${item.unit ? `<span style='font-size:0.75rem; color:#94a3b8;'>/${item.unit}</span>` : ''}</span>
                        ${!isEditable ? `<button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: #0f172a; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 950; cursor: pointer;">Acheter</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    async openCheckoutModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*, profile:profiles!user_id(full_name)').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 48px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <img src="https://www.paypalobjects.com/webstatic/icon/pp256.png" style="width: 48px; margin-bottom: 24px;">
                    <h2 style="font-weight: 950; margin: 0; color: #020617; font-size: 1.8rem; letter-spacing: -0.05em;">Paiement Sécurisé</h2>
                    <p style="color: #64748b; font-weight: 600; margin-top: 8px;">Achetez ${item.title} en un clic.</p>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 20px; margin: 32px 0; display: flex; justify-content: space-between; align-items: center; border: 1.5px solid #f1f5f9;">
                        <span style="font-weight: 800; color: #0f172a;">Total à régler</span>
                        <span style="font-weight: 950; font-size: 1.6rem; color: #10b981;">${item.price}€</span>
                    </div>

                    <button id="pay-btn" onclick="window.ShowcaseModule.executePayment('${item.id}', '${item.user_id}', ${item.price})" style="width: 100%; background: #0f172a; color: white; border: none; padding: 20px; border-radius: 20px; font-weight: 950; font-size: 1.2rem; cursor: pointer;">
                        Payer Maintenant
                    </button>
                    <p style="font-size: 0.75rem; color: #94a3b8; font-weight: 600; margin-top: 16px;">Inclut une commission de service de 5% pour le réseau.</p>
                </div>
            `;
            overlay.classList.add('open');
        } catch (err) { alert(err.message); }
    },

    async executePayment(itemId, providerId, price) {
        const payBtn = document.getElementById('pay-btn');
        if (payBtn) payBtn.innerHTML = "Lancement de PayPal...";
        
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Connectez-vous pour acheter.");

            const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${this.PLATFORM_PAYPAL}&item_name=DTC:${itemId}&amount=${price}&currency_code=EUR`;
            window.open(paypalUrl, '_blank');

            const netAmount = price * (1 - this.COMMISSION_RATE);
            
            await window._supabase.from('showcase_orders').insert({ item_id: itemId, buyer_id: session.user.id, provider_id: providerId, total_price: price, status: 'paid' });

            const { data: seller } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', providerId).single();
            await window._supabase.from('profiles').update({ balance: (seller.balance || 0) + netAmount, total_earnings: (seller.total_earnings || 0) + price }).eq('id', providerId);

            alert("Commande validée ! L'expert a été payé sur son solde DTC.");
            document.getElementById('details-modal-overlay').classList.remove('open');
        } catch (err) { alert(err.message); }
    },

    /**
     * PAYOUT SYSTEM
     */
    async requestPayout() {
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: profile } = await window._supabase.from('profiles').select('balance, paypal_email').eq('id', session.user.id).single();
        
        if (!profile.paypal_email) return alert("Configurez votre email de retrait dans l'onglet 'Configuration'.");
        if (!profile.balance || profile.balance <= 10) return alert("Le solde minimum pour un retrait est de 10€.");

        if (confirm(`Retirer ${profile.balance}€ vers ${profile.paypal_email} ?`)) {
            await window._supabase.from('payout_requests').insert({ user_id: session.user.id, amount: profile.balance, paypal_email: profile.paypal_email, status: 'pending' });
            await window._supabase.from('profiles').update({ balance: 0 }).eq('id', session.user.id);
            alert("Votre demande a été envoyée. Elle sera traitée sous 48h.");
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        ['vitrine', 'withdraw', 'orders'].forEach(t => {
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
        } else if (tabName === 'withdraw') {
            const { data: profile } = await window._supabase.from('profiles').select('paypal_email').eq('id', session.user.id).single();
            const { data: requests } = await window._supabase.from('payout_requests').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    <div style="background: white; border: 1.5px solid #f1f5f9; border-radius: 28px; padding: 40px; text-align: left;">
                        <h3 style="font-weight: 950; margin-bottom: 24px;">Config de Retrait</h3>
                        <input id="paypal-email" type="email" value="${profile?.paypal_email || ''}" placeholder="votre-paypal@email.com" style="width: 100%; padding: 16px; border-radius: 16px; border: 2px solid #e2e8f0; font-family: inherit; font-weight: 700; margin-bottom: 20px;">
                        <button onclick="window.ShowcaseModule.savePayPalConfig()" style="width: 100%; background: #0f172a; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 950; cursor: pointer;">Sauvegarder</button>
                    </div>
                    <div style="background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 28px; padding: 40px; text-align: left;">
                        <h3 style="font-weight: 950; margin-bottom: 24px;">Historique des Retraits</h3>
                        ${requests && requests.length > 0 ? requests.map(r => `
                            <div style="padding: 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 900; color: #020617;">${r.amount}€</div>
                                    <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">${new Date(r.created_at).toLocaleDateString()}</div>
                                </div>
                                <span style="background: ${r.status === 'pending' ? '#fef3c7' : '#d1fae5'}; color: ${r.status === 'pending' ? '#92400e' : '#065f46'}; font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 100px; text-transform: uppercase;">${r.status}</span>
                            </div>
                        `).join('') : '<p style="color:#94a3b8; font-weight:600;">Aucun retrait.</p>'}
                    </div>
                </div>
            `;
        } else {
            const { data: o } = await window._supabase.from('showcase_orders').select('*, buyer:profiles!buyer_id(full_name), item:item_id(title)').eq('provider_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = o && o.length > 0 ? o.map(x => `
                <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                     <div><div style="font-weight: 950; color: #020617;">${x.item?.title}</div><div style="color: #64748b; font-size: 0.85rem; font-weight: 600;">Client: ${x.buyer?.full_name}</div></div>
                     <div style="font-weight: 950; color: #10b981;">+${x.total_price * (1 - this.COMMISSION_RATE)}€</div>
                </div>
            `).join('') : '<p style="color:#94a3b8; font-weight:600; text-align:center;">Aucune vente.</p>';
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
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 32px; padding: 40px;">
                <h2 style="font-weight: 950; margin-bottom: 24px;">Ajouter une Offre</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <input id="item-title" placeholder="Titre..." style="width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #e2e8f0; font-weight: 700;">
                    <textarea id="item-desc" placeholder="Description..." style="width: 100%; min-height: 100px; padding: 14px; border-radius: 12px; border: 2px solid #e2e8f0;"></textarea>
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px;">
                        <input id="item-price" type="number" placeholder="Prix (€)" style="width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #e2e8f0; font-weight: 700;">
                        <input id="item-unit" placeholder="ex: heure" style="width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #e2e8f0;">
                    </div>
                    <input id="item-file" type="file">
                    <button onclick="window.ShowcaseModule.saveItem()" style="background: #10b981; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 900; cursor: pointer;">PUBLIER</button>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color: #64748b; background: none; border: none; cursor: pointer; font-weight: 700;">Fermer</button>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const title = document.getElementById('item-title').value;
            const description = document.getElementById('item-desc').value;
            const price = document.getElementById('item-price').value;
            const fileInput = document.getElementById('item-file');
            let image_url = '';
            if (fileInput.files[0]) {
                const fileName = `showcase/${session.user.id}/${Math.random()}`;
                await window._supabase.storage.from('showcase').upload(fileName, fileInput.files[0]);
                const { data } = window._supabase.storage.from('showcase').getPublicUrl(fileName);
                image_url = data.publicUrl;
            }
            await window._supabase.from('showcase_items').insert({ user_id: session.user.id, title, description, price: parseFloat(price), image_url, status: 'active', unit: document.getElementById('item-unit').value });
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
