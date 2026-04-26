/**
 * Showcase Module - Domtom Connect
 * Version "Base Absolue" : Focus Produits & Vitrine Linktree uniquement.
 * Pas d'historique, pas de KPI financiers, pas de cafouillis.
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
     * DASHBOARD EXPERT - "Nettoyage Total"
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #000; padding: 40px;">
                    
                    <!-- HEADER CONFIGURATION -->
                    <div style="text-align: center; margin-bottom: 50px;">
                        <div style="font-size: 0.7rem; font-weight: 950; color: #10b981; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;">Expert Storefront</div>
                        <h2 style="font-size: 2.22rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Gestion de Vitrine</h2>
                        <p style="color: #64748b; font-weight: 700; font-size: 1rem; margin-top: 8px;">Prêt pour la production (Com. 5% incluse).</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; margin-top: 35px;">
                            <button onclick="ShowcaseModule.openItemModal()" style="width: 100%; background: #000; color: #fff; border: none; padding: 18px; border-radius: 100px; font-weight: 950; cursor: pointer; font-size: 1.05rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">+ Ajouter un Produit Digital</button>
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: transparent; color: #000; border: none; padding: 10px; font-weight: 850; cursor: pointer; font-size: 0.9rem; text-decoration: underline;">Voir ma boutique Linktree 🔗</button>
                        </div>
                    </div>

                    <!-- LISTE SIMPLE DES PRODUITS -->
                    <div style="margin-top: 40px; border-top: 1.5px solid #f1f5f9; padding-top: 40px;">
                         <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 15px;">
                            ${(!items || items.length === 0) ? `<div style="text-align:center; padding:40px; color:#94a3b8; font-weight:800; font-style:italic;">Votre vitrine est vide. Commencez par ajouter un produit.</div>` : 
                            items.map(item => `
                                <div style="background: #fff; padding: 20px; border-radius: 24px; border: 1.5px solid #000; display: flex; align-items: center; justify-content: space-between; box-shadow: 6px 6px 0px #000;">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        <div style="width:48px; height:48px; background:#f8fafc; border-radius:12px; display:flex; align-items:center; justify-content:center; border:1px solid #e2e8f0; overflow:hidden;">
                                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '📄'}
                                        </div>
                                        <div style="text-align:left;">
                                            <div style="font-weight: 950; font-size: 1.1rem; color: #000;">${item.title}</div>
                                            <div style="font-size: 0.9rem; color: #10b981; font-weight: 950;">${item.price.toFixed(2)}€</div>
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 10px;">
                                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; border-radius:12px; width:44px; height:44px; cursor:pointer;">✏️</button>
                                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; border-radius:12px; width:44px; height:44px; cursor:pointer;">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                         </div>
                    </div>

                    <div style="margin-top: 100px; text-align: center;">
                        <button onclick="ShowcaseModule.handleTotalReset()" style="background: transparent; color: #ef4444; border: none; font-size: 0.75rem; font-weight: 800; cursor: pointer; opacity: 0.5;">[ Mode Expert : Reset Total ]</button>
                    </div>

                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    /**
     * VITRINE PUBLIQUE - STYLE LINKTREE PUR
     */
    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: #fff; min-height: 100vh; padding: 60px 20px; display: flex; flex-direction: column; align-items: center;">
                    <div style="text-align: center; margin-bottom: 40px; max-width: 450px;">
                        <div style="width: 100px; height: 100px; background: #000; border-radius: 50%; margin: 0 auto 20px; border: 3px solid #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow:hidden;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3rem; font-weight:900; line-height:100px;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 1.6rem; font-weight: 950; margin: 0; color: #000; letter-spacing: -0.05em;">${provider.full_name}</h1>
                        <p style="font-size: 1rem; color: #64748b; font-weight: 700; margin: 8px 0 0 0;">${provider.headline || 'Digital Expert'}</p>
                    </div>
                    <div style="width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 16px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 2px solid #000; border-radius: 100px; padding: 18px 24px; cursor: pointer; transition: 0.2s; position: relative; text-align: center; box-shadow: 0 6px 0px #000;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 0px #000';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 0px #000';">
                                <div style="font-weight: 950; font-size: 1.1rem; color: #000;">${item.title}</div>
                                <div style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); font-weight: 950; font-size: 0.9rem;">${item.price.toFixed(2)}€</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 80px; opacity: 0.3;">
                         <img src="assets/images/logo-domtomconnect.png" style="height: 20px; filter: grayscale(1);">
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
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 50px; border: 3px solid #000; box-shadow: 20px 20px 0px #000; position: relative;">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 24px; right: 24px; background: #efefef; border: 2px solid #000; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; font-size: 1.5rem; font-weight: 950;">×</button>
                    <div style="margin-bottom: 35px; text-align:center;">
                        <span style="background: #10b981; color: white; padding: 6px 16px; border-radius: 100px; font-weight: 950; font-size: 0.75rem;">OFFRE SÉCURISÉE</span>
                        <h2 style="font-size: 2.2rem; font-weight: 950; color: #000; margin: 20px 0 10px 0; letter-spacing: -0.05em;">${item.title}</h2>
                        <div style="font-size: 1rem; color: #64748b; font-weight: 600;">Accès immédiat après paiement.</div>
                    </div>
                    <div style="background: #f8fafc; padding: 25px; border-radius: 20px; border: 2px solid #000; margin-bottom: 30px; text-align: center;">
                        <span style="font-size: 2.4rem; font-weight: 950; color: #000;">${item.price.toFixed(2)}€</span>
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
    },

    async handleTotalReset() {
        if (!confirm("⚠️ RESET TOTAL : Supprimer TOUT l'historique de test définitivement ?")) return;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').delete().filter('provider_id','eq',session.user.id);
            await window._supabase.from('showcase_orders').delete().filter('user_id','eq',session.user.id);
            await window._supabase.from('profiles').update({ balance: 0, total_earnings: 0, showcase_views: 0 }).eq('id', session.user.id);
            alert("✓ Compte nettoyé.");
            window.location.reload();
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
