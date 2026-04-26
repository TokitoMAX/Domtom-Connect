/**
 * Showcase Module - Domtom Connect
 * High-Fidelity Professional Digital Storefront (Fintech / Stan Store Style)
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
     * Dashboard Expert - "Control Tower" Epurée
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

            const totalSalesCount = orders?.length || 0;
            const totalViews = profile?.showcase_views || 0;
            const conversionRate = totalViews > 0 ? ((totalSalesCount / totalViews) * 100).toFixed(1) : 0;
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 1000px; margin: 0 auto; padding: 40px; color: #0f172a; background: #fff;">
                    
                    <!-- HEADER SECTION -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; border-bottom: 1px solid #f1f5f9; padding-bottom: 30px;">
                        <div>
                            <h2 style="font-size: 2.4rem; font-weight: 950; letter-spacing: -0.05em; margin: 0;">Pilotage Vitrine Lia</h2>
                            <p style="color: #64748b; font-weight: 600; margin: 8px 0 0 0; font-size: 1.1rem;">Maîtrisez vos revenus et suivez vos performances.</p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: #f8fafc; color: #0f172a; border: 1.5px solid #e2e8f0; padding: 12px 24px; border-radius: 12px; font-weight: 850; cursor: pointer;">Ouvrir ma boutique 🔗</button>
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #111827; color: white; border: none; padding: 12px 32px; border-radius: 12px; font-weight: 950; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">+ Ajouter une Offre</button>
                        </div>
                    </div>

                    <!-- TRANSPARENCY NOTICE -->
                    <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; padding: 20px 24px; border-radius: 20px; margin-bottom: 32px; display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 1.5rem;">🏦</span>
                        <div style="font-size: 0.95rem; color: #15803d; font-weight: 750;">
                            SÉCURITÉ FINANCIÈRE : Domtom Connect prélève une commission transparente de **5%** sur chaque transaction. Vos revenus nets sont calculés automatiquement.
                        </div>
                    </div>

                    <!-- DASHBOARD KPI GRID -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 48px;">
                        <div style="background: #fff; border: 1.5px solid #f1f5f9; border-radius: 24px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Argent Net</div>
                            <div style="font-size: 2rem; font-weight: 950; color: #10b981;">${(profile?.balance || 0).toFixed(2)}€</div>
                            <button onclick="ShowcaseModule.requestPayout()" style="margin-top: 16px; width:100%; background: #10b98115; color:#10b981; border:none; padding:10px; border-radius:10px; font-weight:900; font-size:0.75rem; cursor:pointer;">Virer vers mon Wallet</button>
                        </div>
                        <div style="background: #fff; border: 1.5px solid #f1f5f9; border-radius: 24px; padding: 28px;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Volume Brut</div>
                            <div style="font-size: 2rem; font-weight: 950;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                        </div>
                        <div style="background: #fff; border: 1.5px solid #f1f5f9; border-radius: 24px; padding: 28px;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Visites (Vues)</div>
                            <div style="font-size: 2rem; font-weight: 950;">${totalViews}</div>
                        </div>
                        <div style="background: #0f172a; border-radius: 24px; padding: 28px; color:white;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Conversion</div>
                            <div style="font-size: 2rem; font-weight: 950; color: #3b82f6;">${conversionRate}%</div>
                        </div>
                    </div>

                    <!-- TAB SELECTOR -->
                    <div style="display: flex; gap: 8px; margin-bottom: 32px; background: #f8fafc; padding: 6px; border-radius: 14px; width: fit-content; border: 1px solid #e2e8f0;">
                        <button onclick="ShowcaseModule.switchTab('vitrine')" id="tab-vitrine" style="padding: 10px 24px; border: none; background: white; color: #0f172a; border-radius: 10px; font-size: 0.85rem; font-weight: 850; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">Mes Offres</button>
                        <button onclick="ShowcaseModule.switchTab('sales')" id="tab-sales" style="padding: 10px 24px; border: none; background: transparent; color: #64748b; border-radius: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer;">Historique des Ventes</button>
                        <button onclick="ShowcaseModule.switchTab('config')" id="tab-config" style="padding: 10px 24px; border: none; background: transparent; color: #64748b; border-radius: 10px; font-size: 0.85rem; font-weight: 800; cursor: pointer;">PayPal & Reset ⚙️</button>
                    </div>

                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    renderLocalGrid(items) {
        return `
            <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                ${(items || []).length === 0 ? `
                    <div style="padding: 80px; text-align: center; border: 2px dashed #f1f5f9; border-radius: 28px; color: #94a3b8; font-weight: 800; font-style: italic;">Votre vitrine est vide.</div>
                ` : items.map(item => `
                    <div style="background: white; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="width: 60px; height: 60px; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center;">
                                ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:1.8rem;">${item.type === 'service' ? '🤝' : '📄'}</span>`}
                            </div>
                            <div>
                                <div style="font-weight: 950; font-size: 1.25rem; color: #020617; margin-bottom: 2px;">${item.title}</div>
                                <div style="display: flex; gap: 12px; align-items: center;">
                                    <span style="font-size: 1rem; color: #000; font-weight: 950;">${item.price.toFixed(2)}€</span>
                                    <span style="width: 4px; height: 4px; background: #e2e8f0; border-radius: 50%;"></span>
                                    <span style="font-size: 0.75rem; color: #64748b; font-weight: 800;">👁️ ${item.views || 0} vues</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="ShowcaseModule.editItem('${item.id}')" style="background: #f1f5f9; border: none; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; transition: 0.2s;">✏️</button>
                            <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background: #fff1f2; border: none; color: #ef4444; border-radius: 12px; width: 44px; height: 44px; cursor: pointer;">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    async incrementShowcaseView(providerId) {
        try {
            const { data } = await window._supabase.from('profiles').select('showcase_views').eq('id', providerId).single();
            await window._supabase.from('profiles').update({ showcase_views: (data?.showcase_views || 0) + 1 }).eq('id', providerId);
        } catch (err) { console.error("View Count Error:", err); }
    },

    async incrementItemView(itemId) {
        try {
            const { data } = await window._supabase.from('showcase_items').select('views').eq('id', itemId).single();
            await window._supabase.from('showcase_items').update({ views: (data?.views || 0) + 1 }).eq('id', itemId);
        } catch (err) { console.error("Item View Error:", err); }
    },

    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        this.incrementShowcaseView(providerId);

        try {
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: #fff; min-height: 100vh; padding: 60px 20px;">
                    <div style="max-width: 500px; margin: 0 auto; text-align: center;">
                        <div style="width: 110px; height: 110px; background: #0f172a; border-radius: 40px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; overflow:hidden; border:4px solid #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="font-size:2.5rem; font-weight:950; color:white;">${provider.full_name?.substring(0,1).toUpperCase() || 'E'}</div>`}
                        </div>
                        <h1 style="font-size: 2rem; font-weight: 950; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.05em;">${provider.full_name}</h1>
                        <p style="font-size: 1.1rem; color: #64748b; font-weight: 600; margin-bottom: 50px;">${provider.headline || 'Expert Certifié Domtom Connect'}</p>

                        <div style="display: flex; flex-direction: column; gap: 20px;">
                            ${items.map(item => `
                                <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border-radius: 24px; padding: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.3s; border: 1.5px solid #0f172a; box-shadow: 8px 8px 0px #0f172a;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='12px 12px 0px #0f172a';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='8px 8px 0px #0f172a';">
                                    <div style="display: flex; align-items: center; gap: 20px;">
                                        <div style="width:64px; height:64px; background: #f8fafc; border-radius:16px; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid #f1f5f9;">
                                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:1.8rem;">${item.type === 'service' ? '🤝' : '📄'}</span>`}
                                        </div>
                                        <div style="text-align: left;">
                                            <div style="font-weight: 950; font-size: 1.15rem; color: #0f172a;">${item.title}</div>
                                            <div style="font-size: 0.8rem; color: #10b981; font-weight: 900; text-transform: uppercase;">Disponible</div>
                                        </div>
                                    </div>
                                    <div style="font-weight: 950; font-size: 1.25rem; color: #0f172a;">${item.price.toFixed(2)}€</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async openPublicItemModal(itemId) {
        try {
            await this.init();
            const { data: item } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            this.incrementItemView(itemId);
            const overlay = document.getElementById('details-modal-overlay');
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 50px; border: 3px solid #0f172a; box-shadow: 25px 25px 0px #0f172a; position: relative;">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 24px; right: 24px; background: #f8fafc; border: 2px solid #0f172a; border-radius: 14px; width: 44px; height: 44px; cursor: pointer; font-size: 1.5rem; font-weight: 950;">×</button>
                    <div style="margin-bottom: 35px;">
                        <span style="background: #10b981; color: white; padding: 6px 16px; border-radius: 100px; font-weight: 950; font-size: 0.75rem;">PAIEMENT SÉCURISÉ</span>
                        <h2 style="font-size: 2.4rem; font-weight: 950; color: #0f172a; margin: 24px 0 10px 0;">${item.title}</h2>
                        <div style="font-size: 1.1rem; color: #64748b; font-weight: 600;">Finalisez votre achat pour un accès immédiat.</div>
                    </div>
                    <div style="background: #f8fafc; padding: 30px; border-radius: 20px; border: 1.5px solid #e2e8f0; margin-bottom: 35px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 950; color: #0f172a; font-size: 2.22rem;">${item.price.toFixed(2)}€</span>
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

    async recalculateBalance(userId) {
        try {
            const { data: orders } = await window._supabase.from('showcase_orders').select('total_price, commission_amount').eq('provider_id', userId);
            const { data: payouts } = await window._supabase.from('showcase_payouts').select('amount').eq('user_id', userId);
            const totalBrut = (orders || []).reduce((acc, o) => acc + (o.total_price || 0), 0);
            const totalNet = (orders || []).reduce((acc, o) => acc + ((o.total_price || 0) - (o.commission_amount || 0)), 0);
            const totalPaidOut = (payouts || []).reduce((acc, p) => acc + (p.amount || 0), 0);
            const finalBalance = Math.max(0, totalNet - totalPaidOut);
            await window._supabase.from('profiles').update({ balance: finalBalance, total_earnings: totalBrut }).eq('id', userId);
        } catch (err) { console.error("Balance Error:", err); }
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        if (!contentArea) return;
        const { data: { session } } = await window._supabase.auth.getSession();
        
        // UI Tab selection
        ['tab-vitrine', 'tab-sales', 'tab-config'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.background = 'transparent', el.style.boxShadow = 'none', el.style.color = '#64748b';
        });
        const activeTab = document.getElementById(`tab-${tabName}`);
        if(activeTab) activeTab.style.background = 'white', activeTab.style.color = '#0f172a', activeTab.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';

        if (tabName === 'sales') {
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title), buyer:profiles!buyer_id(full_name)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = `
                <div style="background:#fff; border: 1px solid #f1f5f9; border-radius: 20px; overflow:hidden;">
                    <div style="padding: 24px; border-bottom: 1.5px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; font-weight:950;">Historique des Ventes</h3>
                        <button onclick="ShowcaseModule.handleHardReset()" style="background:#fff1f2; color:#ef4444; border:none; padding:10px 20px; border-radius:10px; font-weight:900; cursor:pointer;">Vider l'historique 🗑️</button>
                    </div>
                    <div style="padding:24px;">
                        ${(orders || []).length === 0 ? `<p style="color:#94a3b8; font-weight:700;">Aucune transaction.</p>` : 
                        orders.map(o => `<div style="padding:15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between;">
                            <div><div style="font-weight:950;">${o.invoice_number}</div><div style="font-size:0.8rem; color:#94a3b8;">${new Date(o.created_at).toLocaleDateString()}</div></div>
                            <div style="font-weight:950; color:#10b981;">+${(o.total_price * 0.95).toFixed(2)}€ (Net)</div>
                        </div>`).join('')}
                    </div>
                </div>
            `;
        } else if (tabName === 'config') {
            contentArea.innerHTML = `
                <div style="background:#fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px; max-width: 500px;">
                    <h3 style="margin:0 0 10px 0; font-weight:950;">Réglages & Aide</h3>
                    <p style="color:#64748b; font-weight:600; margin-bottom:30px;">Besoin de repartir à zéro ? Supprimez tout votre historique de test.</p>
                    <button onclick="ShowcaseModule.handleHardReset()" style="width:100%; border:none; background:#ef4444; color:white; padding:18px; border-radius:18px; font-weight:950; cursor:pointer;">⚠️ RÉINITIALISER TOUT L'HISTORIQUE</button>
                </div>
            `;
        } else {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = this.renderLocalGrid(items);
        }
    },

    async handleHardReset() {
        if (!confirm("⚠️ RÉINITIALISATION TOTALE : Cela va supprimer TOUTES vos ventes pour repartir à 0.00€. Confirmer ?")) return;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').delete().eq('provider_id', session.user.id);
            await this.recalculateBalance(session.user.id);
            alert("✓ Reset complet effectué.");
            window.location.reload();
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
