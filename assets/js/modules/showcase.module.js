/**
 * Showcase Module - Domtom Connect
 * High-Fidelity Professional Digital Storefront (Vrai Style Linktree / Stan Store)
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
     * DASHBOARD EXPERT - Design Fintech "Linear"
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await this.recalculateBalance(session.user.id);
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            const { data: orders } = await window._supabase.from('showcase_orders').select('id').eq('provider_id', session.user.id);
            
            const totalViews = profile?.showcase_views || 0;
            const conv = totalViews > 0 ? (((orders?.length || 0) / totalViews) * 100).toFixed(1) : 0;
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 900px; margin: 0 auto; color: #0f172a; padding: 20px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; background: #fff; padding: 30px; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                        <div>
                            <h2 style="font-size: 2rem; font-weight: 900; letter-spacing: -0.05em; margin: 0;">Hub de Conversion</h2>
                            <p style="color: #64748b; font-weight: 600; margin-top: 4px;">Version 2.0 - Stan Store Style</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: #f8fafc; color: #0f172a; border: 1.5px solid #e2e8f0; padding: 12px 20px; border-radius: 12px; font-weight: 800; cursor: pointer;">Ma Vitrine Public 🔗</button>
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 900; cursor: pointer;">+ Ajouter un Bloc</button>
                        </div>
                    </div>

                    <!-- TRANSPARENCY NOTICE -->
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px 24px; border-radius: 16px; margin-bottom: 32px; display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.2rem;">🛡️</span>
                        <div style="font-size: 0.9rem; color: #15803d; font-weight: 700;">
                            Domtom Connect applique une commission fixe de **5%** sur chaque vente pour couvrir les frais de plateforme. Pas de frais cachés.
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
                        <div style="background: #fff; border: 1px solid #f1f5f9; padding: 25px; border-radius: 24px; text-align: center;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Solde Net (Wallet)</div>
                            <div style="font-size: 2.2rem; font-weight: 950; color: #10b981;">${(profile?.balance || 0).toFixed(2)}€</div>
                            <button onclick="ShowcaseModule.requestPayout()" style="margin-top: 12px; width:100%; border:none; background:#10b98115; color:#10b981; padding:8px; border-radius:8px; font-weight:950; font-size:0.75rem; cursor:pointer;">Virer l'argent</button>
                        </div>
                        <div style="background: #fff; border: 1px solid #f1f5f9; padding: 25px; border-radius: 24px; text-align: center;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Vues Boutique</div>
                            <div style="font-size: 2.2rem; font-weight: 950;">${totalViews}</div>
                        </div>
                        <div style="background: #0f172a; padding: 25px; border-radius: 24px; text-align: center; color: white;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Conversion</div>
                            <div style="font-size: 2.2rem; font-weight: 950; color: #3b82f6;">${conv}%</div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-bottom: 30px;">
                        <button onclick="ShowcaseModule.switchTab('vitrine')" style="background: #eee; border:none; padding:10px 24px; border-radius:10px; font-weight:800; cursor:pointer;">Blocs Actifs</button>
                        <button onclick="ShowcaseModule.switchTab('sales')" style="background: transparent; border:none; padding:10px 24px; border-radius:10px; font-weight:800; cursor:pointer; color:#64748b;">Historique</button>
                        <button onclick="ShowcaseModule.switchTab('config')" style="background: transparent; border:none; padding:10px 24px; border-radius:10px; font-weight:800; cursor:pointer; color:#64748b;">Aide & Reset</button>
                    </div>

                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    renderLocalGrid(items) {
        return `<div style="display: flex; flex-direction: column; gap: 12px;">
            ${(items || []).map(item => `
                <div style="background: white; border: 1px solid #f1f5f9; padding: 18px; border-radius: 18px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width:50px; height:50px; background:#f8fafc; border-radius:12px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '📄'}
                        </div>
                        <div>
                            <div style="font-weight: 900; font-size: 1.1rem;">${item.title}</div>
                            <div style="font-size: 0.85rem; color: #64748b; font-weight: 700;">${item.price.toFixed(2)}€ • ${item.views || 0} vues</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; border-radius:10px; padding:10px; cursor:pointer;">✏️</button>
                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; border-radius:10px; padding:10px; cursor:pointer;">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>`;
    },

    /**
     * VITRINE PUBLIQUE - Vrai Style LINKTREE / STAN
     */
    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        
        try {
            await this.incrementShowcaseView(providerId);
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: #fff; min-height: 100vh; padding: 60px 20px; display: flex; flex-direction: column; align-items: center;">
                    
                    <!-- BRANDING CENTERED (LINKTREE STYLE) -->
                    <div style="text-align: center; margin-bottom: 40px; max-width: 450px;">
                        <div style="width: 100px; height: 100px; background: #000; border-radius: 50%; margin: 0 auto 20px; border: 3px solid #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow:hidden;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3rem; font-weight:900; line-height:100px;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 1.5rem; font-weight: 900; margin: 0; color: #000;">${provider.full_name}</h1>
                        <p style="font-size: 1rem; color: #64748b; font-weight: 700; margin: 8px 0 0 0;">${provider.headline || 'Expert Coach & Digital Creator'}</p>
                    </div>

                    <!-- BUTTON LIST (LINKTREE STYLE) -->
                    <div style="width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 16px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 2px solid #000; border-radius: 100px; padding: 18px 24px; cursor: pointer; transition: 0.2s; position: relative; text-align: center; box-shadow: 0 4px 0px #000;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 8px 0px #000';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 0px #000';">
                                <div style="font-weight: 950; font-size: 1.1rem; color: #000; letter-spacing: -0.02em;">${item.title}</div>
                                <div style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); font-weight: 900; font-size: 0.9rem;">${item.price.toFixed(2)}€</div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 80px; text-align: center; opacity: 0.5;">
                        <img src="assets/images/logo-domtomconnect.png" style="height: 25px; filter: grayscale(1);">
                        <p style="font-size: 0.6rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.3em; margin-top:10px;">Powered by Domtom Connect</p>
                    </div>

                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async incrementShowcaseView(providerId) {
        try {
            const { data } = await window._supabase.from('profiles').select('showcase_views').eq('id', providerId).single();
            await window._supabase.from('profiles').update({ showcase_views: (data?.showcase_views || 0) + 1 }).eq('id', providerId);
        } catch (err) { }
    },

    async incrementItemView(itemId) {
        try {
            const { data } = await window._supabase.from('showcase_items').select('views').eq('id', itemId).single();
            await window._supabase.from('showcase_items').update({ views: (data?.views || 0) + 1 }).eq('id', itemId);
        } catch (err) { }
    },

    async openPublicItemModal(itemId) {
        try {
            await this.init();
            const { data: item } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            this.incrementItemView(itemId);
            const overlay = document.getElementById('details-modal-overlay');
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 50px; border: 3px solid #000; box-shadow: 20px 20px 0px #000; position: relative;">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 24px; right: 24px; background: #eee; border: 2px solid #000; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; font-size: 1.5rem; font-weight: 950;">×</button>
                    <div style="margin-bottom: 35px;">
                        <span style="background: #10b981; color: white; padding: 6px 16px; border-radius: 100px; font-weight: 950; font-size: 0.75rem;">PAIEMENT SÉCURISÉ</span>
                        <h2 style="font-size: 2.2rem; font-weight: 950; color: #000; margin: 20px 0 10px 0;">${item.title}</h2>
                        <div style="font-size: 1.1rem; color: #64748b;">Accès immédiat après paiement.</div>
                    </div>
                    <div id="paypal-button-container-showcase"></div>
                </div>
            `;
            overlay.classList.add('open');
            this.renderPayPalButton(item.user_id, item.id, item.price);
        } catch (err) { alert(err.message); }
    },

    renderPayPalButton(providerId, itemId, price) {
        paypal.Buttons({
            style: { layout: 'vertical', color: 'black', shape: 'pill', label: 'pay', height: 50 },
            createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { currency_code: 'EUR', value: price.toFixed(2) } }] }),
            onApprove: (data, actions) => actions.order.capture().then(d => this.executeFinalOrder({ itemId, providerId, price, paypalId: d.id }))
        }).render('#paypal-button-container-showcase');
    },

    async executeFinalOrder(p) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').insert({
                item_id: p.itemId, buyer_id: session?.user?.id || null, provider_id: p.providerId,
                total_price: p.price, commission_amount: p.price * this.COMMISSION_RATE,
                transaction_id: p.paypalId, invoice_number: `DOM-ME-${Date.now()}`, status: 'paid'
            });
            await this.recalculateBalance(p.providerId);
            alert("✓ Succès ! Transaction confirmée.");
            document.getElementById('details-modal-overlay').classList.remove('open');
            window.location.reload();
        } catch (err) { alert(err.message); }
    },

    async handleHardReset() {
        if (!confirm("⚠️ RÉINITIALISATION TOTALE : Cela va supprimer TOUTES vos ventes pour repartir à 0.00€. Confirmer ?")) return;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').delete().eq('provider_id', session.user.id);
            await window._supabase.from('profiles').update({ balance: 0, total_earnings: 0, showcase_views: 0 }).eq('id', session.user.id);
            alert("✓ Votre boutique a été remise à zéro. Historique vide.");
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

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        if (!contentArea) return;
        const { data: { session } } = await window._supabase.auth.getSession();

        if (tabName === 'sales') {
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = `
                <div style="background:#fff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 24px;">
                    <div style="padding-bottom: 20px; border-bottom: 1.5px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; font-weight:950;">Historique des Ventes</h3>
                        <button onclick="ShowcaseModule.handleHardReset()" style="background:#fff1f2; color:#ef4444; border:none; padding:10px 20px; border-radius:10px; font-weight:900; cursor:pointer;">Vider l'historique 🗑️</button>
                    </div>
                    <div style="margin-top:20px;">
                        ${(orders || []).map(o => `
                            <div style="padding:15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between;">
                                <div><div style="font-weight:900;">${o.invoice_number}</div><div style="font-size:0.8rem; color:#94a3b8;">${new Date(o.created_at).toLocaleDateString()}</div></div>
                                <div style="font-weight:950; color:#10b981;">+${(o.total_price * 0.95).toFixed(2)}€ (Net)</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (tabName === 'config') {
            contentArea.innerHTML = `
                <div style="background:#fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px; max-width: 500px;">
                    <h3 style="margin:0 0 10px 0; font-weight:950;">Réglages & Reset</h3>
                    <p style="color:#64748b; font-weight:600; margin-bottom:30px;">Supprimez tout l'historique pour repartir sur une base propre.</p>
                    <button onclick="ShowcaseModule.handleHardReset()" style="width:100%; border:none; background:#ef4444; color:white; padding:18px; border-radius:18px; font-weight:950; cursor:pointer;">⚠️ RÉINITIALISER LE COMPTE LIA</button>
                </div>
            `;
        } else {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = this.renderLocalGrid(items);
        }
    }
};

window.ShowcaseModule = ShowcaseModule;
