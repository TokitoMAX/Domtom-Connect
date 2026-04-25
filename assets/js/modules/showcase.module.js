/**
 * Showcase Module - Domtom Connect
 * High-Fidelity Professional Digital Storefront (Stan Store / Linktree Style)
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

    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await this.recalculateBalance(session.user.id);
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; animation: fadeIn 0.5s ease;">
                    
                    <div style="text-align: center; margin-bottom: 60px;">
                        <div style="width: 100px; height: 100px; background: #020617; color: white; border-radius: 35%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; box-shadow: 0 20px 40px rgba(2,6,23,0.1);">
                            ${profile?.full_name?.substring(0,1).toUpperCase() || 'E'}
                        </div>
                        <h2 style="font-size: 2rem; font-weight: 950; color: #020617; margin-bottom: 8px;">Ma Boutique Connect</h2>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                            <span style="background: #f1f5f9; color: #64748b; padding: 12px 24px; border-radius: 100px; font-size: 0.85rem; font-weight: 800; border: 1.5px solid #e2e8f0;">showcase.html?id=${session.user.id}</span>
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: #020617; color: white; border: none; padding: 14px 28px; border-radius: 16px; font-size: 0.85rem; font-weight: 800; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Ouvrir ma boutique 🔗</button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 48px;">
                        <div style="background: white; border: 3px solid #020617; padding: 30px; border-radius: 32px; box-shadow: 10px 10px 0px #020617;">
                            <div style="font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Solde Disponible (Net)</div>
                            <div style="font-size: 2.5rem; font-weight: 950; color: #020617;">${(profile?.balance || 0).toFixed(2)}€</div>
                            <button onclick="ShowcaseModule.requestPayout()" style="margin-top: 15px; background: #10b981; color: white; border: none; padding: 12px; border-radius: 14px; font-size: 0.85rem; font-weight: 900; width: 100%; cursor: pointer;">Demander un virement 💸</button>
                        </div>
                        <div style="background: #f8fafc; border: 2.5px solid #e2e8f0; padding: 30px; border-radius: 32px;">
                            <div style="font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Volume de Ventes (Brut)</div>
                            <div style="font-size: 2.5rem; font-weight: 950; color: #020617;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                            <button onclick="ShowcaseModule.switchTab('sales')" style="margin-top: 15px; background: white; border: 2px solid #e2e8f0; color: #020617; padding: 12px; border-radius: 14px; font-size: 0.85rem; font-weight: 900; width: 100%; cursor: pointer;">Voir les ventes 📈</button>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                        <button onclick="ShowcaseModule.openItemModal()" style="flex: 2; padding: 24px; background: #020617; color: white; border: none; border-radius: 20px; font-size: 1.1rem; font-weight: 900; cursor: pointer;">+ Ajouter un Produit / Service</button>
                        <button onclick="ShowcaseModule.switchTab('config')" style="flex: 1; padding: 24px; border: 2.5px solid #e2e8f0; background: white; border-radius: 20px; font-weight: 900; cursor: pointer; color: #64748b;">Réglages ⚙️</button>
                    </div>

                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    renderLocalGrid(items) {
        return `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${(items || []).length === 0 ? `
                    <div style="padding: 60px; text-align: center; border: 2.5px dashed #cbd5e1; border-radius: 32px; color: #94a3b8; font-weight: 800;">Boutique vide. Publiez votre première offre.</div>
                ` : items.map(item => `
                    <div style="background: white; border: 2px solid #e2e8f0; border-radius: 24px; padding: 24px; display: flex; align-items: center; gap: 20px;">
                        <div style="width: 60px; height: 60px; background: #f8fafc; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2rem; overflow:hidden; border: 1.5px solid #f1f5f9;">
                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : (item.type === 'service' ? '🤝' : '📄')}
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 950; font-size: 1.2rem; color: #020617;">${item.title}</div>
                            <div style="font-size: 0.9rem; color: #64748b; font-weight: 700;">${item.price.toFixed(2)}€ • ${item.type === 'service' ? 'Service' : 'Produit'}</div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="ShowcaseModule.editItem('${item.id}')" style="background: #f1f5f9; border: none; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; font-size: 1rem;">✏️</button>
                            <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border: none; color: #ef4444; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; font-size: 1rem;">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        if (!contentArea) return;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (tabName === 'sales') {
                const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title), buyer:profiles!buyer_id(full_name)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
                contentArea.innerHTML = `
                    <div style="background:white; border: 2.5px solid #020617; border-radius: 32px; overflow:hidden; box-shadow: 12px 12px 0px #020617;">
                        <div style="padding: 24px; border-bottom: 2.5px solid #020617; background: #020617; color:white; display:flex; justify-content:space-between; align-items:center;">
                            <h3 style="margin:0; font-weight:950;">Historique des Ventes</h3>
                            <button onclick="ShowcaseModule.switchTab('sales')" style="background:white; color:#020617; border:none; padding:8px 16px; border-radius:10px; font-weight:900; cursor:pointer;">Réactualiser</button>
                        </div>
                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse;">
                                <tr style="border-bottom:2px solid #f1f5f9; text-align:left;">
                                    <th style="padding:20px; font-size:0.75rem; color:#64748b; font-weight:900;">REÇU</th>
                                    <th style="padding:20px; font-size:0.75rem; color:#64748b; font-weight:900;">BRUT</th>
                                    <th style="padding:20px; font-size:0.75rem; color:#64748b; font-weight:900;">COM. (5%)</th>
                                    <th style="padding:20px; font-size:0.75rem; color:#64748b; font-weight:900;">GAIN NET</th>
                                    <th style="padding:20px; font-size:0.75rem; color:#64748b; font-weight:900;">STATS</th>
                                </tr>
                                ${(orders || []).length === 0 ? `<tr><td colspan="5" style="padding:40px; text-align:center; color:#64748b; font-weight:700;">Aucune vente enregistrée.</td></tr>` : orders.map(o => `
                                    <tr style="border-bottom:1px solid #f1f5f9;">
                                        <td style="padding:20px;">
                                            <div style="font-weight:950;">${o.invoice_number || 'DOM-ORDER'}</div>
                                            <div style="font-size:0.75rem; color:#94a3b8; font-weight:700;">${new Date(o.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td style="padding:20px; font-weight:900;">${o.total_price.toFixed(2)}€</td>
                                        <td style="padding:20px; color:#ef4444; font-weight:800;">-${(o.commission_amount || (o.total_price * 0.05)).toFixed(2)}€</td>
                                        <td style="padding:20px; color:#10b981; font-weight:950;">+${(o.total_price - (o.commission_amount || (o.total_price * 0.05))).toFixed(2)}€</td>
                                        <td style="padding:20px;"><div style="background:#f0fdf4; color:#10b981; padding:6px 12px; border-radius:99px; font-size:0.7rem; font-weight:950; display:inline-block;">Payé ✓</div></td>
                                    </tr>
                                `).join('')}
                            </table>
                        </div>
                    </div>
                `;
            } else if (tabName === 'config') {
                const { data: p } = await window._supabase.from('profiles').select('paypal_email').eq('id', session.user.id).single();
                contentArea.innerHTML = `
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:32px;">
                        <div style="background:white; border: 2.5px solid #e2e8f0; padding: 32px; border-radius:32px;">
                            <h4 style="margin:0 0 10px 0; font-weight:950;">Mon PayPal</h4>
                            <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px;">Utilisé pour vos virements mensuels.</p>
                            <input id="pp-email" value="${p?.paypal_email || ''}" style="width:100%; padding:16px; border-radius:14px; border:2.5px solid #e2e8f0; font-weight:700; outline:none;">
                            <button onclick="ShowcaseModule.saveProConfig()" style="width:100%; background:#020617; color:white; border:none; padding:16px; border-radius:16px; margin-top:16px; font-weight:950; cursor:pointer;">Enregistrer</button>
                        </div>
                        <div style="background:#fff1f2; border: 2.5px solid #fecaca; padding: 32px; border-radius:32px;">
                            <h4 style="margin:0 0 10px 0; color:#ef4444; font-weight:950;">Zone Dangereuse</h4>
                            <p style="font-size:0.85rem; color:#991b1b; margin-bottom:20px;">Purgez vos ventes de test (DOM-ORDER).</p>
                            <button onclick="ShowcaseModule.handleHardReset()" style="width:100%; background:#ef4444; color:white; border:none; padding:16px; border-radius:16px; font-weight:950; cursor:pointer;">PURGER MON COMPTE 🗑️</button>
                        </div>
                    </div>
                `;
            } else {
                const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
                contentArea.innerHTML = this.renderLocalGrid(items);
            }
        } catch (err) { alert(err.message); }
    },

    async handleHardReset() {
        if (!confirm("⚠️ RÉINITIALISATION TOTALE (MODE TEST) : Cela va supprimer TOUT votre historique fantôme (DOM-ORDER) pour repartir à 0.00€. Confirmer ?")) return;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').delete().ilike('invoice_number', 'DOM-%').eq('provider_id', session.user.id);
            await this.recalculateBalance(session.user.id);
            alert("✓ Historique purgé ! Vos compteurs sont revenus à 0.00€.");
            this.renderManager(document.getElementById('ecosystem-grid-container'));
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

    async saveProConfig() {
        const { data: { session } } = await window._supabase.auth.getSession();
        const email = document.getElementById('pp-email').value.trim();
        await window._supabase.from('profiles').update({ paypal_email: email }).eq('id', session.user.id);
        alert("Configuration PayPal mise à jour !");
    },

    async deleteItem(id) {
        if (confirm("Supprimer cette offre ?")) {
            await window._supabase.from('showcase_items').delete().eq('id', id);
            this.switchTab('vitrine');
        }
    },

    async editItem(id) {
        const { data: item } = await window._supabase.from('showcase_items').select('*').eq('id', id).single();
        if (item) this.openItemModal(item);
    },

    async openItemModal(item = null) {
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 48px; border: 3px solid #020617; box-shadow: 15px 15px 0px #020617; animation: slideUp 0.3s ease;">
                <h2 style="font-weight: 950; margin: 0 0 24px 0; font-size: 1.8rem;">${item ? 'Editer' : 'Nouvelle Offre'}</h2>
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <input id="item-id" type="hidden" value="${item?.id || ''}">
                    <input id="item-title" value="${item?.title || ''}" placeholder="Titre du produit" style="width:100%; padding:16px; border:2.5px solid #020617; border-radius:14px; font-weight:700; outline:none;">
                    <textarea id="item-desc" placeholder="Description..." style="width:100%; min-height:100px; padding:16px; border:2.5px solid #020617; border-radius:14px; font-weight:600; outline:none;">${item?.description || ''}</textarea>
                    <input id="item-price" type="number" value="${item?.price || ''}" placeholder="Prix (€)" style="width:100%; padding:16px; border:2.5px solid #020617; border-radius:14px; font-weight:900; font-size:1.2rem; outline:none;">
                    <button onclick="ShowcaseModule.saveItem()" style="background:#10b981; color:white; border:none; padding:18px; border-radius:18px; font-weight:950; cursor:pointer;">PUBLIER</button>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="background:none; border:none; color:#64748b; font-weight:800; cursor:pointer;">Annuler</button>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const id = document.getElementById('item-id').value;
            const payload = { 
                user_id: session.user.id, 
                title: document.getElementById('item-title').value, 
                description: document.getElementById('item-desc').value, 
                price: parseFloat(document.getElementById('item-price').value), 
                status: 'active' 
            };
            if (id) await window._supabase.from('showcase_items').update(payload).eq('id', id);
            else await window._supabase.from('showcase_items').insert(payload);
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.switchTab('vitrine');
        } catch (err) { alert(err.message); }
    },

    // --- PUBLIC STOREFRONT ---

    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;"><span class="loader"></span></div>`;
        try {
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            if (!provider) { container.innerHTML = "Expert introuvable."; return; }
            
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; background: #fafbfc; min-height: 100vh; padding: 60px 20px;">
                    <div style="max-width: 500px; margin: 0 auto; text-align: center;">
                        <div style="width: 100px; height: 100px; background: #020617; color: white; border-radius: 35px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 950; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border:4px solid white;">
                            ${provider.full_name?.substring(0,1).toUpperCase() || 'E'}
                        </div>
                        <h1 style="font-size: 1.8rem; font-weight: 950; color: #020617; margin-bottom: 8px;">${provider.full_name}</h1>
                        <p style="font-size: 1rem; color: #64748b; font-weight: 700; margin-bottom: 50px;">${provider.headline || 'Expert Certifié Domtom Connect'}</p>

                        <div style="display: flex; flex-direction: column; gap: 18px;">
                            ${items.map(item => `
                                <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: white; border-radius: 24px; padding: 24px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.3s; border: 2.5px solid #020617; box-shadow: 6px 6px 0px #020617;">
                                    <div style="display: flex; align-items: center; gap: 18px;">
                                        <div style="font-size: 2rem; background: #f8fafc; border-radius:14px; width:52px; height:52px; display:flex; align-items:center; justify-content:center;">${item.type === 'service' ? '🤝' : '📄'}</div>
                                        <div style="text-align: left;">
                                            <div style="font-weight: 950; font-size: 1.15rem; color: #020617;">${item.title}</div>
                                            <div style="font-size: 0.8rem; color: #64748b; font-weight: 850; text-transform: uppercase;">Accès Instantané</div>
                                        </div>
                                    </div>
                                    <div style="font-weight: 950; font-size: 1.25rem; color: #020617; background: #f1f5f9; padding: 10px 15px; border-radius: 12px; border:2px solid #020617;">${item.price.toFixed(2)}€</div>
                                </div>
                            `).join('')}
                        </div>

                        <div style="margin-top: 100px; text-align: center; opacity: 0.5;">
                            <img src="assets/images/logo-domtomconnect.png" style="height: 32px; filter: grayscale(1);">
                            <div style="font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.25em; margin-top: 12px;">Verified Storefront</div>
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
            const overlay = document.getElementById('details-modal-overlay');
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 48px; border: 3px solid #020617; box-shadow: 20px 20px 0px #020617; position: relative;">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 24px; right: 24px; background: #f1f5f9; border: 2px solid #020617; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; font-size: 1.5rem; font-weight: 900;">×</button>
                    <div style="margin-bottom: 32px;">
                        <span style="background: #10b981; color: white; padding: 6px 14px; border-radius: 100px; font-weight: 900; font-size: 0.75rem;">DISPONIBLE IMMÉDIATEMENT</span>
                        <h2 style="font-size: 2rem; font-weight: 950; color: #020617; margin: 20px 0 10px 0;">${item.title}</h2>
                        <div style="font-size: 1rem; color: #64748b; font-weight: 600; line-height: 1.6;">${item.description || 'Accès immédiat à votre expertise digitale.'}</div>
                    </div>
                    <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 2px solid #020617; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 900; color: #64748b;">Total</span>
                        <span style="font-size: 2.2rem; font-weight: 950; color: #020617;">${item.price.toFixed(2)}€</span>
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
            style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 50 },
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
            alert("✓ Achat réussi ! Merci de votre confiance.");
            document.getElementById('details-modal-overlay').classList.remove('open');
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
