/**
 * Showcase Module - Domtom Connect
 * Version Fintech Finale : Transparence Totale & Ledger (Livre des Comptes)
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb',

    async init() {
        if (!window.paypal) {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}&currency=EUR`;
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
    },

    /**
     * DASHBOARD EXPERT - Design Fintech Haute Fidélité
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await this.recalculateBalance(session.user.id);
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; color: #020617; padding: 20px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                        <div>
                            <h2 style="font-size: 2.1rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Gestion de Vitrine</h2>
                            <p style="color: #64748b; font-weight: 750; font-size: 0.95rem; margin-top: 4px;">Optimisation des ventes & Flux financiers.</p>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #000; color: #fff; border: none; padding: 12px 28px; border-radius: 100px; font-weight: 950; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">+ Nouveau Produit</button>
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: #f8fafc; border: 2px solid #000; padding: 12px 20px; border-radius: 100px; font-weight: 950; cursor: pointer;">Aperçu 🔗</button>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-bottom: 35px; background: #f8fafc; padding: 6px; border-radius: 100px; width: fit-content; border: 1px solid #e2e8f0;">
                        <button onclick="ShowcaseModule.switchTab('vitrine')" id="tab-vitrine" style="padding: 10px 28px; border: none; background: white; color: #000; border-radius: 100px; font-size: 0.85rem; font-weight: 950; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">Mes Offres</button>
                        <button onclick="ShowcaseModule.switchTab('sales')" id="tab-sales" style="padding: 10px 32px; border: none; background: transparent; color: #64748b; border-radius: 100px; font-size: 0.85rem; font-weight: 850; cursor: pointer;">Mes Revenus</button>
                    </div>

                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>

                    <div style="margin-top: 100px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 30px;">
                         <button onclick="ShowcaseModule.handleHardReset()" style="background: transparent; color: #cbd5e1; border: none; font-size: 0.65rem; font-weight: 850; cursor: pointer; text-decoration: underline;">[ Réglages Expert : Reset Historique ]</button>
                    </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    renderLocalGrid(items) {
        return `<div style="display: flex; flex-direction: column; gap: 14px;">
            ${(!items || items.length === 0) ? `<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:800; font-style:italic;">Votre vitrine est vide.</div>` : 
            items.map(item => `
                <div style="background: white; border: 2.5px solid #000; padding: 20px 28px; border-radius: 30px; display: flex; align-items: center; justify-content: space-between; box-shadow: 5px 5px 0px #000;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="width:48px; height:48px; background:#f8fafc; border-radius:14px; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid #e2e8f0;">
                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:1.6rem;">${item.type === 'service' ? '🤝' : '📄'}</span>`}
                        </div>
                        <div>
                            <div style="font-weight: 950; font-size: 1.15rem; letter-spacing:-0.02em;">${item.title}</div>
                            <div style="font-size: 0.95rem; color: #10b981; font-weight: 950;">${item.price.toFixed(2)}€</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:1.1rem;">✏️</button>
                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:1.1rem;">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>`;
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        if (!contentArea) return;
        const { data: { session } } = await window._supabase.auth.getSession();
        
        ['tab-vitrine', 'tab-sales'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.background = 'transparent', el.style.color = '#64748b', el.style.boxShadow = 'none';
        });
        const activeTab = document.getElementById(`tab-${tabName}`);
        if(activeTab) activeTab.style.background = 'white', activeTab.style.color = '#000', activeTab.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';

        if (tabName === 'sales') {
            const { data: profile } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', session.user.id).single();
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                    <div style="background: #0f172a; padding: 30px; border-radius: 35px; color: white; border: 4px solid #10b981;">
                        <div style="font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Disponible Net</div>
                        <div style="font-size: 2.3rem; font-weight: 950; color: #10b981;">${(profile?.balance || 0).toFixed(2)}€</div>
                    </div>
                    <div style="background: #fff; border: 3px solid #000; padding: 30px; border-radius: 35px; box-shadow: 10px 10px 0px #000;">
                        <div style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Chiffre Brut</div>
                        <div style="font-size: 2.3rem; font-weight: 950; color: #000;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                    </div>
                </div>

                <div style="background: #fff; border: 3px solid #000; border-radius: 35px; overflow: hidden; box-shadow: 15px 15px 0px #000;">
                    <div style="padding: 24px; border-bottom: 3px solid #000; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
                        <span style="font-weight: 950; font-size: 1rem; color: #000;">Livre des Recettes ( -5% Frais Domtom )</span>
                    </div>
                    <div>
                        ${(!orders || orders.length === 0) ? `
                            <div style="padding: 70px; text-align: center; color: #94a3b8; font-weight: 850; font-style: italic;">Aucune transaction détectée.</div>
                        ` : orders.map(o => `
                            <div style="padding: 24px; border-bottom: 1.5px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 950; color: #020617; font-size: 1.1rem; letter-spacing:-0.02em;">${o.item?.title || 'Produit direct'}</div>
                                    <div style="font-size: 0.8rem; color: #94a3b8; font-weight: 800;">${new Date(o.created_at).toLocaleDateString()}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-weight: 950; font-size: 1.1rem; color: #10b981;">+${(o.total_price * 0.95).toFixed(2)}€ <span style="font-size: 0.7rem; color: #000;">NET</span></div>
                                    <div style="font-size: 0.7rem; color: #94a3b8; font-weight: 900;">${o.total_price.toFixed(2)}€ Brut ( -5% )</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = this.renderLocalGrid(items);
        }
    },

    async openItemModal(itemId = null) {
        let item = { title: '', price: 0 };
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            item = data;
        }

        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 400px; border-radius: 40px; padding: 45px; border: 4px solid #000; box-shadow: 20px 20px 0px #000; position: relative;">
                <h3 style="margin:0 0 30px 0; font-weight:950; font-size:1.7rem; letter-spacing:-0.05em;">${itemId ? 'Modifier le bloc' : 'Nouveau bloc'}</h3>
                <div style="display:flex; flex-direction:column; gap:25px;">
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:950; text-transform:uppercase; color:#94a3b8; margin-bottom:10px;">Désignation</label>
                        <input id="modal-item-title" type="text" value="${item.title}" style="width:100%; padding:16px; border-radius:15px; border:2.5px solid #000; font-weight:900; font-family:'Inter';">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:950; text-transform:uppercase; color:#94a3b8; margin-bottom:10px;">Prix public (€)</label>
                        <input id="modal-item-price" type="number" value="${item.price}" style="width:100%; padding:16px; border-radius:15px; border:2.5px solid #000; font-weight:950; font-family:'Inter';">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                        <button onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:#000; color:#fff; border:none; padding:20px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1.05rem;">Enregistrer</button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="background:transparent; color:#64748b; border:none; font-weight:900; cursor:pointer;">Fermer</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem(itemId) {
        const title = document.getElementById('modal-item-title').value;
        const price = parseFloat(document.getElementById('modal-item-price').value);
        const { data: { session } } = await window._supabase.auth.getSession();
        try {
            if (itemId) {
                await window._supabase.from('showcase_items').update({ title, price }).eq('id', itemId);
            } else {
                await window._supabase.from('showcase_items').insert({ title, price, user_id: session.user.id });
            }
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if (!confirm("Effacer ce bloc de votre vitrine ?")) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

    async editItem(id) {
        this.openItemModal(id);
    },

    async handleHardReset() {
        if (!confirm("⚠️ RESET TOTAL : Supprimez TOUT l'historique et remettez vos compteurs à 0. Confirmer ?")) return;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').delete().match({ provider_id: session.user.id });
            await window._supabase.from('profiles').update({ balance: 0, total_earnings: 0, showcase_views: 0 }).eq('id', session.user.id);
            alert("✓ Reset effectué.");
            window.location.reload();
        } catch (err) { alert(err.message); }
    },

    async recalculateBalance(userId) {
        try {
            const { data: orders } = await window._supabase.from('showcase_orders').select('total_price, commission_amount').eq('provider_id', userId);
            const totalNet = (orders || []).reduce((acc, o) => acc + ((o.total_price || 0) - (o.commission_amount || 0)), 0);
            const totalBrut = (orders || []).reduce((acc, o) => acc + (o.total_price || 0), 0);
            await window._supabase.from('profiles').update({ balance: totalNet, total_earnings: totalBrut }).eq('id', userId);
        } catch (err) { }
    },

    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: #fff; min-height: 100vh; padding: 60px 20px; display: flex; flex-direction: column; align-items: center;">
                    <div style="text-align: center; margin-bottom: 50px; max-width: 450px;">
                        <div style="width: 110px; height: 110px; background: #000; border-radius: 50%; margin: 0 auto 25px; border: 4px solid #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.12); overflow:hidden;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3.5rem; font-weight:950; line-height:110px;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 1.8rem; font-weight: 950; margin: 0; color: #000; letter-spacing: -0.05em;">${provider.full_name}</h1>
                        <p style="font-size: 1.1rem; color: #64748b; font-weight: 750; margin: 10px 0 0 0;">${provider.headline || 'Digital Creator'}</p>
                    </div>
                    <div style="width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 18px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 3px solid #000; border-radius: 100px; padding: 20px 28px; cursor: pointer; transition: 0.25s; position: relative; text-align: center; box-shadow: 0 7px 0px #000;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 0px #000';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 7px 0px #000';">
                                <div style="font-weight: 950; font-size: 1.15rem; color: #000; letter-spacing:-0.02em;">${item.title}</div>
                                <div style="position: absolute; right: 28px; top: 50%; transform: translateY(-50%); font-weight: 950; font-size: 1rem;">${item.price.toFixed(2)}€</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async openPublicItemModal(itemId) {
        try {
            await this.init();
            const { data: item } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 50px; padding: 60px; border: 4px solid #000; box-shadow: 30px 30px 0px #000; position: relative; animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 35px; right: 35px; background: #eee; border: 4px solid #000; border-radius: 18px; width: 44px; height: 44px; cursor: pointer; font-size: 1.6rem; font-weight: 950;">×</button>
                    <div style="margin-bottom: 40px; text-align:center;">
                        <span style="background: #10b981; color: white; padding: 8px 20px; border-radius: 100px; font-weight: 950; font-size: 0.85rem; letter-spacing:0.05em;">PAIEMENT SECURISE</span>
                        <h2 style="font-size: 2.6rem; font-weight: 950; color: #000; margin: 30px 0 10px 0; letter-spacing:-0.06em;">${item.title}</h2>
                        <div style="font-size: 1.15rem; color: #64748b; font-weight: 700; line-height:1.5;">Accès premium garanti après règlement.</div>
                    </div>
                    <div style="background: #f8fafc; padding: 35px; border-radius: 30px; border: 3px solid #000; margin-bottom: 40px; text-align: center;">
                        <span style="font-size: 2.8rem; font-weight: 950; color: #000;">${item.price.toFixed(2)}€</span>
                    </div>
                    <div id="paypal-button-container-showcase" style="min-height:150px;"></div>
                </div>
            `;
            overlay.classList.add('open');
            this.renderPayPalButton(item.user_id, item.id, item.price);
        } catch (err) { alert(err.message); }
    },

    renderPayPalButton(providerId, itemId, price) {
        paypal.Buttons({
            style: { layout: 'vertical', color: 'black', shape: 'pill', label: 'pay', height: 55 },
            createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { currency_code: 'EUR', value: price.toFixed(2) } }] }),
            onApprove: (data, actions) => actions.order.capture().then(d => this.executeFinalOrder({ itemId, providerId, price, paypalId: d.id }))
        }).render('#paypal-button-container-showcase');
    },

    async executeFinalOrder(p) {
        try {
            await window._supabase.from('showcase_orders').insert({
                item_id: p.itemId, provider_id: p.providerId,
                total_price: p.price, commission_amount: p.price * this.COMMISSION_RATE,
                transaction_id: p.paypalId, invoice_number: `DOM-ME-${Date.now()}`, status: 'paid'
            });
            alert("✓ Transaction réussie !");
            window.location.reload();
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
