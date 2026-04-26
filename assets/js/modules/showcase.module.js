/**
 * Showcase Module - Domtom Connect
 * Version Ultime : Pilotage Intégral (KPIs, Blocs & Historique)
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
     * DASHBOARD EXPERT - Pilotage 360°
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await this.recalculateBalance(session.user.id);
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 900px; margin: 0 auto; color: #020617; padding: 20px;">
                    
                    <!-- 1. HEADER PERFORMANCE -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                        <h2 style="font-size: 1.8rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Pilotage Expert</h2>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 100px; font-weight: 900; cursor: pointer;">+ Ajouter une Offre</button>
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: #f8fafc; border: 2px solid #000; padding: 12px 20px; border-radius: 100px; font-weight: 900; cursor: pointer;">Aperçu boutique 🔗</button>
                        </div>
                    </div>

                    <!-- 2. KPIs TOP ROW -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
                        <div style="background: #f0fdf4; border: 2px solid #bbf7d0; padding: 25px; border-radius: 30px;">
                            <div style="font-size: 0.65rem; font-weight: 900; color: #15803d; text-transform: uppercase;">Argent Net (Wallet)</div>
                            <div style="font-size: 2rem; font-weight: 950; color: #166534;">${(profile?.balance || 0).toFixed(2)}€</div>
                            <button onclick="ShowcaseModule.requestPayout()" style="margin-top:12px; width:100%; padding:8px; border-radius:10px; border:none; background:#166534; color:white; font-size:0.7rem; font-weight:900; cursor:pointer;">Virer l'argent</button>
                        </div>
                        <div style="background: #fff; border: 2px solid #000; padding: 25px; border-radius: 30px; box-shadow: 6px 6px 0px #000;">
                            <div style="font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Chiffre Brut</div>
                            <div style="font-size: 2rem; font-weight: 950;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                        </div>
                        <div style="background: #020617; padding: 25px; border-radius: 30px; color: white;">
                            <div style="font-size: 0.65rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Vues Boutique</div>
                            <div style="font-size: 2rem; font-weight: 950; color: #3b82f6;">${profile?.showcase_views || 0}</div>
                        </div>
                    </div>

                    <!-- 3. GESTION DES BLOCS -->
                    <div style="margin-bottom: 40px;">
                        <h4 style="font-weight: 950; margin-bottom: 20px;">Mes Offre Actuelles</h4>
                        <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 12px;">
                            ${(!items || items.length === 0) ? `<div style="text-align:center; padding:40px; border:1.5px dashed #e2e8f0; border-radius:20px; color:#94a3b8;">Aucun produit configuré.</div>` : 
                            items.map(item => `
                                <div style="background: white; border: 1.5px solid #f1f5f9; padding: 18px 24px; border-radius: 100px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
                                    <div style="display: flex; align-items: center; gap: 20px;">
                                        <div style="width:40px; height:40px; background:#f8fafc; border-radius:10px; display:flex; align-items:center; justify-content:center; border:1px solid #e2e8f0; overflow:hidden;">
                                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:1.2rem;">📄</span>`}
                                        </div>
                                        <div>
                                            <div style="font-weight: 950; font-size: 1.05rem;">${item.title}</div>
                                            <div style="font-size: 0.85rem; color: #10b981; font-weight: 900;">${item.price.toFixed(2)}€</div>
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; width:36px; height:36px; border-radius:50%; cursor:pointer;">✏️</button>
                                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; width:36px; height:36px; cursor:pointer;">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 4. HISTORIQUE & LEDGER -->
                    <div style="background: #fff; border: 1.5px solid #f1f5f9; border-radius: 35px; overflow: hidden;">
                        <div style="padding: 20px 24px; border-bottom: 1.5px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
                            <span style="font-weight: 950; font-size: 0.9rem;">Historique Transactions (Com. 5% déduite)</span>
                        </div>
                        <div>
                            ${(!orders || orders.length === 0) ? `<div style="padding:40px; text-align:center; color:#94a3b8; font-size:0.9rem;">Aucune vente enregistrée.</div>` : 
                            orders.map(o => `
                                <div style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-weight: 950; color: #020617; font-size: 0.95rem;">${o.item?.title || 'Vente Directe'}</div>
                                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">${new Date(o.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-weight: 950; color: #10b981;">+${(o.total_price * 0.95).toFixed(2)}€ (Net)</div>
                                        <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 900;">${o.total_price.toFixed(2)}€ Brut ( -5% )</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="margin-top: 60px; text-align: center; opacity: 0.2;">
                         <button onclick="ShowcaseModule.handleHardReset()" style="background:transparent; border:none; font-size:0.6rem; cursor:pointer;">[ Reset Expert ]</button>
                    </div>

                </div>
            `;
        } catch (err) { alert(err.message); }
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
        if (!confirm("⚠️ RESET TOTAL : Supprimer TOUT l'historique et remettez vos compteurs à 0. Confirmer ?")) return;
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
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 2px solid #000; border-radius: 100px; padding: 20px 28px; cursor: pointer; transition: 0.25s; position: relative; text-align: center; box-shadow: 0 7px 0px #000;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 0px #000';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 7px 0px #000';">
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
