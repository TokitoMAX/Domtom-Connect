/**
 * Showcase Module - Domtom Connect
 * Production-Ready Financial Engine (95/5 Split Tracking)
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb', // Change to Real ID for Production

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
                        <span style="background: #0070ba; color: white; padding: 6px 16px; border-radius: 99px; font-weight: 850; font-size: 0.75rem; text-transform: uppercase;">Solutions Digitales</span>
                        <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 950; color: #020617; margin: 16px 0; letter-spacing: -0.06em;">E-Commerce Pays</h1>
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
            await this.recalculateBalance(session.user.id);
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; animation: fadeIn 0.5s ease;">
                    
                    <!-- HEADER STYLE LINKTREE -->
                    <div style="text-align: center; margin-bottom: 60px;">
                        <div style="width: 100px; height: 100px; background: #020617; color: white; border-radius: 35% 65% 65% 35% / 30% 30% 70% 70%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; box-shadow: 0 20px 40px rgba(2,6,23,0.2);">
                            ${profile?.full_name?.substring(0,1).toUpperCase() || 'E'}
                        </div>
                        <h2 style="font-size: 2rem; font-weight: 950; color: #020617; margin-bottom: 8px;">Ma Boutique Connect</h2>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                            <span style="background: #f1f5f9; color: #020617; padding: 10px 20px; border-radius: 100px; font-size: 0.9rem; font-weight: 800; border: 1.5px solid #e2e8f0;">showcase.html?id=${session.user.id}</span>
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: #020617; color: white; border: none; padding: 12px 24px; border-radius: 16px; font-size: 0.85rem; font-weight: 800; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Ouvrir ma boutique 🔗</button>
                        </div>
                    </div>

                    <!-- DASH MINI-STATS -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 48px;">
                        <div style="background: white; border: 2px solid #020617; padding: 30px; border-radius: 32px; box-shadow: 10px 10px 0px #020617;">
                            <div style="font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Solde Disponible</div>
                            <div style="font-size: 2.2rem; font-weight: 950; color: #020617;">${(profile?.balance || 0).toFixed(2)}€</div>
                            <button onclick="ShowcaseModule.requestPayout()" style="margin-top: 15px; background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; width: 100%; cursor: pointer;">Demander un virement 🚀</button>
                        </div>
                        <div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 30px; border-radius: 32px;">
                            <div style="font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Ventes Totales</div>
                            <div style="font-size: 2.2rem; font-weight: 950; color: #020617;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                            <button onclick="ShowcaseModule.switchTab('sales')" style="margin-top: 15px; background: white; border: 2px solid #e2e8f0; color: #020617; padding: 10px 20px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; width: 100%; cursor: pointer;">Voir l'historique 📜</button>
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                        <button onclick="ShowcaseModule.openItemModal()" style="flex: 2; padding: 24px; background: #020617; color: white; border: none; border-radius: 20px; font-size: 1.1rem; font-weight: 900; cursor: pointer; box-shadow: 0 10px 20px rgba(2,6,23,0.15);">+ Ajouter un Produit ou Service</button>
                        <button onclick="ShowcaseModule.switchTab('config')" style="flex: 1; padding: 24px; border: 2px solid #e2e8f0; background: white; border-radius: 20px; font-weight: 900; cursor: pointer;">Réglages Boutique ⚙️</button>
                    </div>

                    <div id="showcase-content-area">
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            ${items.length === 0 ? `
                                <div style="padding: 60px; text-align: center; border: 2px dashed #cbd5e1; border-radius: 32px; color: #64748b; font-weight: 700;">
                                    Ta boutique est vide.<br>Ajoute ton premier produit digital ou service.
                                </div>
                            ` : items.map(item => `
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: 0.2s;" onmouseover="this.style.borderColor='#020617'" onmouseout="this.style.borderColor='#e2e8f0'">
                                    <div style="width: 64px; height: 64px; background: #f1f5f9; border-radius: 16px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1.5px solid #f1f5f9;">
                                        ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : (item.type === 'service' ? '🤝' : '📄')}
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 900; font-size: 1.15rem; color: #020617;">${item.title}</div>
                                        <div style="font-size: 0.9rem; color: #64748b; font-weight: 700;">${item.price.toFixed(2)}€ • ${item.type === 'service' ? 'Service' : 'Produit Digital'}</div>
                                    </div>
                                    <div style="display: flex; gap: 10px;">
                                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; font-size: 1rem;">✏️</button>
                                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border: 1px solid #fecaca; color: #ef4444; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; font-size: 1rem;">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                </div>
            `;
        } catch (err) { container.innerHTML = `<div style="padding:40px; color:red;">${err.message}</div>`; }
    },

    renderLocalGrid(items) {
        return `
            <div style="margin-bottom: 32px; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="window.ShowcaseModule.openItemModal()" style="background:#0f172a; color:white; border:none; padding:15px 30px; border-radius:14px; cursor:pointer; font-weight:950;">+ Publier un Service</button>
            </div>
            ${items && items.length > 0 ? `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">${items.map(item => this.renderShowcaseCard(item, true)).join('')}</div>` : '<div style="text-align:center; padding:80px; color:#94a3b8; font-weight:800;">Boutique vide.</div>'}
        `;
    },

    renderShowcaseCard(item, isEditable = false, brandColors = { primary: '#0f172a', secondary: '#0070ba' }) {
        const btnColor = isEditable ? '#0f172a' : (brandColors.secondary || '#0070ba');
        return `
            <div style="background: white; border-radius: 30px; border: 1.5px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 10px 20px rgba(0,0,0,0.02);">
                <div style="height: 200px; background: #f8fafc; position: relative;"><img src="${item.image_url || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                <div style="padding: 28px; flex: 1; display: flex; flex-direction: column;">
                    <div style="margin-bottom: 12px; font-weight: 950; color:#020617; font-size:1.2rem; letter-spacing: -0.03em;">${item.title}</div>
                    <p style="font-size: 0.9rem; color:#64748b; font-weight:600; line-height:1.6; margin-bottom:24px;">${item.description}</p>
                    <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-weight: 950; font-size: 1.6rem; color: ${brandColors.primary || '#020617'};">${item.price}€</div>
                        ${!isEditable ? `<button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: ${btnColor}; color: white; border: none; padding: 14px 28px; border-radius: 16px; font-weight: 950; cursor: pointer; font-size:0.95rem;">Acheter</button>` : `<button onclick='window.ShowcaseModule.openItemModal(${JSON.stringify(item).replace(/'/g, "&apos;")})' style="background: #f1f5f9; border:none; padding: 12px; border-radius:12px; cursor:pointer;">✏️ Modifier</button>`}
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
                <div style="background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 48px; font-family: 'Plus Jakarta Sans', sans-serif; text-align:center;">
                    <div style="background: #eef2ff; color: #4f46e5; display: inline-block; padding: 6px 16px; border-radius: 99px; font-weight: 900; font-size:0.7rem; text-transform:uppercase; margin-bottom:16px;">Sécurisé via PayPal</div>
                    <h2 style="font-weight: 950; margin-bottom: 32px; letter-spacing: -0.06em; font-size:2rem;">Détails de l'achat</h2>
                    <div style="background: #f8fafc; padding: 32px; border-radius: 28px; margin-bottom: 32px; border: 1.5px solid #f1f5f9;">
                         <div style="font-weight: 800; font-size:1.2rem; color:#020617; margin-bottom:12px;">${item.title}</div>
                         <div style="font-weight: 950; font-size: 2.8rem; color: #0070ba;">${item.price.toFixed(2)}€</div>
                         <div style="font-size:0.8rem; color:#64748b; font-weight:700; margin-top:12px;">Preuve d'achat générée après validation.</div>
                    </div>
                    <div id="paypal-button-container"></div>
                    <div id="local-fallback-container" style="display:none;">
                        <button onclick="window.ShowcaseModule.executeFinalOrder('${item.id}', '${item.user_id}', ${item.price})" style="width:100%; background:#10b981; color:white; border:none; padding:20px; border-radius:20px; font-weight:950; cursor:pointer; font-size:1.1rem; box-shadow: 0 10px 20px rgba(16,185,129,0.2);">Confirmer le paiement test</button>
                    </div>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color:#94a3b8; border:none; background:none; cursor:pointer; margin-top:24px; font-weight:800; font-size:0.9rem;">Annuler la transaction</button>
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
            const comAmt = total * this.COMMISSION_RATE;
            const netAmt = total - comAmt;
            const invoiceRef = `DOM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            
            const orderData = {
                item_id: itemId, buyer_id: session.user.id, provider_id: providerId,
                total_price: total, commission_amount: comAmt, status: 'paid', 
                transaction_id: txId, invoice_number: invoiceRef
            };
            
            await window._supabase.from('showcase_orders').insert(orderData);
            await this.recalculateBalance(providerId);
            
            alert("✅ TRANSACTION RÉUSSIE\n\nL'expert reçoit : " + netAmt.toFixed(2) + "€ (95%)\nDomtom Connect reçoit : " + comAmt.toFixed(2) + "€ (5%)");
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (error) { alert("Erreur : " + error.message); }
    },

    async recalculateBalance(userId) {
        try {
            const { data: orders } = await window._supabase.from('showcase_orders').select('total_price, commission_amount').eq('provider_id', userId);
            const { data: payouts } = await window._supabase.from('showcase_payouts').select('amount').eq('user_id', userId);
            
            const totalBrut = (orders || []).reduce((acc, o) => acc + (o.total_price || 0), 0);
            const totalNet = (orders || []).reduce((acc, o) => acc + ((o.total_price || 0) - (o.commission_amount || 0)), 0);
            const totalPaidOut = (payouts || []).reduce((acc, p) => acc + (p.amount || 0), 0);
            
            const finalBalance = Math.max(0, totalNet - totalPaidOut);
            
            await window._supabase.from('profiles').update({ 
                balance: finalBalance, 
                total_earnings: totalBrut 
            }).eq('id', userId);
            
            return { balance: finalBalance, earnings: totalBrut };
        } catch (err) { console.error("Recalculate Error:", err); return { balance: 0, earnings: 0 }; }
    },

    async handleRepair() {
        const btn = document.getElementById('btn-repair');
        btn.innerText = "Synchronisation...";
        btn.disabled = true;
        try {
            const stats = await this.recalculateBalance();
            alert("Récupération terminée !\n\nCommandes analysées : " + stats.totalRev.toFixed(2) + "€\nVotre solde net est à jour.");
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (e) { alert(e.message); btn.innerText = "Réessayer"; btn.disabled = false; }
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        const { data: { session } } = await window._supabase.auth.getSession();
        ['vitrine', 'sales', 'config'].forEach(t => {
            const el = document.getElementById(`tab-${t}`);
            if (el) {
                const active = t === tabName;
                el.style.color = active ? '#0f172a' : '#94a3b8';
                el.style.borderBottom = active ? '4px solid #0f172a' : 'none';
                el.style.fontWeight = active ? '950' : '700';
            }
        });
        if (tabName === 'vitrine') {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id);
            contentArea.innerHTML = this.renderLocalGrid(items);
        } else if (tabName === 'sales') {
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title), buyer:profiles!buyer_id(full_name)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            const totalRev = (orders || []).reduce((acc, o) => acc + (o.total_price || 0), 0);
            contentArea.innerHTML = `
                <div style="margin-bottom:32px; display:grid; grid-template-columns: repeat(3, 1fr); gap:20px;">
                    <div style="background:#f8fafc; padding:20px; border-radius:20px; border:1px solid #e2e8f0; text-align:center;">
                        <span style="font-size:0.65rem; font-weight:800; color:#64748b; text-transform:uppercase;">Volume (Brut)</span>
                        <div style="font-size:1.6rem; font-weight:950; color:#020617;">${totalRev.toFixed(2)}€</div>
                    </div>
                    <div style="background:#020617; color:white; padding:20px; border-radius:20px; text-align:center;">
                        <span style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Mon Gain Net (95%)</span>
                        <div style="font-size:1.6rem; font-weight:950;">${(totalRev * 0.95).toFixed(2)}€</div>
                    </div>
                    <div style="background:#f1f5f9; color:#475569; padding:20px; border-radius:20px; border:1px solid #e2e8f0; text-align:center;">
                        <span style="font-size:0.65rem; font-weight:800; color:#64748b; text-transform:uppercase;">Com. Plateforme (5%)</span>
                        <div style="font-size:1.6rem; font-weight:950;">${(totalRev * 0.05).toFixed(2)}€</div>
                    </div>
                </div>
                <div style="background:white; border: 1.5px solid #e2e8f0; border-radius: 24px; overflow:hidden; animation: fadeIn 0.4s ease;">
                    <div style="padding: 24px 32px; border-bottom: 1.5px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; background: #f8fafc;">
                        <h3 style="margin:0; font-weight:900; font-size:1.1rem; color:#020617;">Relevé des Transactions</h3>
                        <button onclick="ShowcaseModule.switchTab('sales')" style="background:#020617; color:white; border:none; padding:8px 16px; border-radius:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">🔄 Actualiser</button>
                    </div>
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; text-align:left;">
                            <thead>
                                <tr style="background:#fff; border-bottom:1.5px solid #f1f5f9;">
                                    <th style="padding:20px 32px; font-size:0.75rem; color:#64748b; font-weight:850; text-transform:uppercase;">Détails & Facture</th>
                                    <th style="padding:20px 32px; font-size:0.75rem; color:#64748b; font-weight:850; text-transform:uppercase;">Volume (Brut)</th>
                                    <th style="padding:20px 32px; font-size:0.75rem; color:#64748b; font-weight:850; text-transform:uppercase;">Com. (5%)</th>
                                    <th style="padding:20px 32px; font-size:0.75rem; color:#64748b; font-weight:850; text-transform:uppercase;">Gain Net</th>
                                    <th style="padding:20px 32px; font-size:0.75rem; color:#64748b; font-weight:850; text-transform:uppercase;">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(o => `
                                <tr style="border-bottom:1px solid #f1f5f9; transition:0.2s;" onmouseover="this.style.background='#fcfcfd'" onmouseout="this.style.background='transparent'">
                                    <td style="padding:24px 32px;">
                                        <div style="font-weight:900; color:#020617;">${o.invoice_number || 'DOM-ORDER'}</div>
                                        <div style="font-size:0.75rem; color:#64748b; font-weight:600;">Client: ${o.buyer?.full_name || 'Client'} • ${new Date(o.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td style="padding:24px 32px; font-weight:800; color:#020617;">${(o.total_price || 0).toFixed(2)}€</td>
                                    <td style="padding:24px 32px; color:#ef4444; font-weight:700;">-${(o.commission_amount || 0).toFixed(2)}€</td>
                                    <td style="padding:24px 32px; color:#10b981; font-weight:900; font-size:1.1rem;">+${((o.total_price || 0) - (o.commission_amount || 0)).toFixed(2)}€</td>
                                    <td style="padding:24px 32px;">
                                        <div style="display:inline-flex; align-items:center; gap:6px; background:#f0fdf4; color:#10b981; padding:6px 12px; border-radius:99px; font-size:0.65rem; font-weight:900; border: 1px solid #d1fae5;">
                                            <span style="width:6px; height:6px; background:#10b981; border-radius:50%;"></span> PAYÉ
                                        </div>
                                        <div style="margin-top:8px;">
                                            <button onclick="ShowcaseModule.generateInvoice('${o.id}')" style="background:none; border:none; color:#4f46e5; font-size:0.7rem; font-weight:800; cursor:pointer; text-decoration:underline;">Voir le Reçu 📄</button>
                                        </div>
                                    </td>
                                </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            const { data: p } = await window._supabase.from('profiles').select('paypal_email').eq('id', session.user.id).single();
            contentArea.innerHTML = `
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:32px;">
                    <div style="background:#f8fafc; padding:32px; border-radius:28px; border:1.5px solid #e2e8f0;">
                        <h4 style="margin-top:0; font-weight:950; font-size:1.1rem; color:#020617;">Email de Retrait PayPal</h4>
                        <p style="font-size:0.85rem; color:#64748b; margin-bottom:24px;">L'adresse où nous enverrons vos revenus (95% des ventes).</p>
                        <input id="pp-email" value="${p?.paypal_email || ''}" style="width:100%; padding:16px; border-radius:14px; border:2.5px solid #e2e8f0; font-weight:700; font-size:1rem;">
                        <button onclick="window.ShowcaseModule.saveProConfig()" style="width:100%; background:#0f172a; color:white; border:none; padding:18px; border-radius:16px; margin-top:20px; font-weight:950; cursor:pointer;">Mettre à jour ma config</button>
                    </div>
                    <div style="background:#fff7ed; padding:32px; border-radius:30px; border:1.5px solid #ffedd5; box-shadow: 0 20px 40px -10px rgba(255,237,213,0.5);">
                        <h4 style="margin-top:0; color:#9a3412; font-weight:950; font-size:1.1rem;">Centre de Synchronisation 🛠️</h4>
                        <p style="font-size:0.85rem; color:#9a3412; font-weight:600; line-height:1.6; margin-bottom:24px;">Si vos statistiques et votre solde ne correspondent pas à vos ventes réelles, lancez une resynchronisation complète de votre compte expert.</p>
                        <button id="btn-repair" onclick="window.ShowcaseModule.handleRepair()" style="width:100%; background:#9a3412; color:white; border:none; padding:18px; border-radius:16px; font-weight:950; cursor:pointer;">🔥 Recalculer mon Solde (95/5)</button>
                    </div>
                </div>
            `;
        }
    },

    async saveProConfig() {
        const { data: { session } } = await window._supabase.auth.getSession();
        await window._supabase.from('profiles').update({ paypal_email: document.getElementById('pp-email').value.trim() }).eq('id', session.user.id);
        alert("Configuration PayPal enregistrée !");
    },

    async openItemModal(item = null) {
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 540px; border-radius: 40px; padding: 48px; position: relative; animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 32px; right: 32px; background: #f1f5f9; border: none; width: 44px; height: 44px; border-radius: 12px; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #64748b; transition: 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">×</button>
                
                <h2 style="font-weight: 950; margin-bottom: 8px; font-size:2rem; letter-spacing:-0.05em; color:#020617;">${item ? 'Modifier l\'offre' : 'Nouvelle Offre Digitale'}</h2>
                <p style="color:#64748b; font-weight:600; font-size:0.95rem; margin-bottom:32px;">Configurez votre produit digital pour la marketplace.</p>

                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <input id="item-id" type="hidden" value="${item?.id || ''}">
                    
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-size:0.75rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em;">NOM DU SERVICE PRO</label>
                        <input id="item-title" value="${item?.title || ''}" placeholder="Ex: Audit Digital Strategic Pack" style="width: 100%; padding: 18px; border-radius: 16px; border: 2.5px solid #e2e8f0; font-weight: 700; font-size:1.1rem; outline:none; transition:0.2s;" onfocus="this.style.borderColor='#0070ba'">
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-size:0.75rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em;">DESCRIPTION DE L'EXPERTISE</label>
                        <textarea id="item-desc" placeholder="Détails de ce que recevra le client..." style="width: 100%; min-height: 120px; padding: 18px; border-radius: 16px; border: 2.5px solid #e2e8f0; font-family: inherit; font-size:1rem; font-weight:600; outline:none; transition:0.2s;" onfocus="this.style.borderColor='#0070ba'">${item?.description || ''}</textarea>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-size:0.75rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em;">PRIX PUBLIC (€)</label>
                            <input id="item-price" type="number" value="${item?.price || ''}" style="width: 100%; padding: 16px; border-radius: 14px; border: 2.5px solid #e2e8f0; font-weight: 950; font-size:1.4rem; outline:none; transition:0.2s;" onfocus="this.style.borderColor='#10b981'">
                            <span style="font-size:0.65rem; color:#10b981; font-weight:800;">Note : 95% versés sur votre solde net.</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-size:0.75rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em;">IMAGE ILLUSTRATIVE</label>
                            <div style="background:#f8fafc; border:2px dashed #cbd5e1; padding:12px; border-radius:14px; text-align:center;">
                                <input id="item-file" type="file" style="width:100%; font-size:0.7rem; font-weight:700;">
                            </div>
                        </div>
                    </div>

                    <div style="background: #fff7ed; padding: 20px; border-radius: 18px; border: 1.5px solid #ffedd5; display: flex; gap: 16px; align-items: flex-start;">
                        <span style="font-size: 1.5rem;">💡</span>
                        <div style="font-size: 0.8rem; color: #9a3412; font-weight: 600; line-height: 1.5;">
                            <b>Transparence Plateforme</b> : Domtom Connect prélève une commission de 5% par vente pour couvrir les frais de service et PayPal.
                        </div>
                    </div>

                    <button onclick="window.ShowcaseModule.saveItem()" style="width: 100%; background: #0f172a; color: white; border: none; padding: 22px; border-radius: 20px; font-weight: 950; cursor: pointer; font-size:1.2rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1); transition:0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">PUBLIER MAINTENANT</button>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const itemId = document.getElementById('item-id').value;
            const payload = { user_id: session.user.id, title: document.getElementById('item-title').value, description: document.getElementById('item-desc').value, price: parseFloat(document.getElementById('item-price').value), category: 'service', status: 'active' };
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

    async generateInvoice(orderId) {
        try {
            const { data: o } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(*), buyer:profiles!buyer_id(*), provider:profiles!provider_id(*)`).eq('id', orderId).single();
            const html = `
            <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Plus Jakarta Sans', sans-serif; color: #020617; padding: 60px; line-height: 1.4; background: #fdfdfd; }
                    .header { border-bottom: 4px solid #0070ba; padding-bottom: 40px; margin-bottom: 50px; display: flex; justify-content: space-between; align-items: center; }
                    .badge { background: #0070ba; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 60px; }
                    .label { color: #64748b; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; }
                    .value { font-size: 1.05rem; font-weight: 600; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 50px; }
                    th { text-align: left; background: #f8fafc; padding: 20px; font-weight: 800; font-size: 0.8rem; border-bottom: 2px solid #e2e8f0; }
                    td { padding: 30px 20px; border-bottom: 1px solid #f1f5f9; }
                    .total-box { background: #020617; color: white; padding: 40px; border-radius: 32px; min-width: 320px; text-align: right; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                    .footer { margin-top: 100px; text-align: center; color: #94a3b8; font-size: 0.75rem; border-top: 1px solid #f1f5f9; padding-top: 40px; }
                    @media print { body { padding: 0; } .total-box { box-shadow: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <img src="https://domtomconnect.com/assets/img/logo.png" style="height: 40px; margin-bottom: 15px; filter: grayscale(1) brightness(0);">
                        <div class="badge">Transaction Certifiée</div>
                    </div>
                    <div style="text-align: right;">
                        <h1 style="margin: 0; font-size: 3.5rem; font-weight: 800; letter-spacing: -0.05em;">REÇU</h1>
                        <div style="font-weight: 800; font-size: 1.2rem; color: #64748b;">N° ${o.invoice_number || 'DOM-TRX'}</div>
                    </div>
                </div>

                <div class="grid">
                    <div>
                        <div class="label">ÉMETTEUR (EXPERT)</div>
                        <div class="value">
                            <strong style="font-size: 1.2rem;">${o.provider?.full_name}</strong><br>
                            ${o.provider?.paypal_email || 'Partenaire Domtom Connect'}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="label">CLIENT</div>
                        <div class="value">
                            <strong style="font-size: 1.2rem;">${o.buyer?.full_name || 'Acheteur Marketplace'}</strong><br>
                            Transaction ID: ${o.transaction_id}
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>DESCRIPTION DU SERVICE DIGITAL</th>
                            <th style="text-align: right;">MONTANT UNITAIRE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 5px;">${o.item?.title}</div>
                                <div style="color: #64748b; font-size: 0.9rem;">Réf: SHOWCASE-${o.item?.id.substring(0, 8).toUpperCase()}</div>
                            </td>
                            <td style="text-align: right; font-weight: 800; font-size: 1.4rem;">${o.total_price.toFixed(2)}€</td>
                        </tr>
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end; align-items: flex-start; gap: 40px;">
                    <div style="text-align: right; padding-top: 20px;">
                        <div class="label">DÉTAIL FINANCIER</div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: #64748b;">
                            Prix HT : ${o.total_price.toFixed(2)}€<br>
                            TVA : 0.00€ (Régime Micro/SaaS)
                        </div>
                    </div>
                    <div class="total-box">
                        <div class="label" style="color: #94a3b8;">Total Payé (EUR)</div>
                        <div style="font-size: 3.5rem; font-weight: 800; margin: 10px 0;">${o.total_price.toFixed(2)}€</div>
                        <div style="display: inline-flex; align-items: center; gap: 8px; background: #10b981; color: white; padding: 6px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 800;">
                            <span>✓</span> PAIEMENT VALIDÉ
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <strong>Domtom Connect Marketplace</strong><br>
                    Ce document est une preuve de transaction électronique générée automatiquement.<br>
                    Il sert de reçu d'achat pour les services digitaux fournis par l'expert cité ci-dessus.
                </div>
            </body>
            </html>`;
            const win = window.open('','_blank'); win.document.write(html); win.document.close(); setTimeout(()=>win.print(),800);
        } catch (err) { alert(err.message); }
    },
    
    async requestPayout() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: profile } = await window._supabase.from('profiles').select('balance, paypal_email').eq('id', session.user.id).single();
            
            if (!profile.paypal_email || profile.paypal_email.trim() === "") {
                alert("⚠️ Configuration Requise : Veuillez renseigner votre email PayPal dans l'onglet Paramètres pour recevoir vos fonds.");
                this.switchTab('config');
                return;
            }

            if (profile.balance < 20) {
                alert(`💰 Seuil de Retrait : Votre solde actuel (${profile.balance.toFixed(2)}€) est inférieur au seuil minimum de 20.00€.`);
                return;
            }

            if (!confirm(`🚀 Confirmer la demande de virement ?\n\nMontant : ${profile.balance.toFixed(2)}€\nVers : ${profile.paypal_email}\n\nDélai : 24h à 48h ouvrées.`)) return;

            // Log the payout request
            const { error } = await window._supabase.from('showcase_payouts').insert({
                user_id: session.user.id,
                amount: profile.balance,
                paypal_email: profile.paypal_email,
                status: 'pending'
            });

            if (error) throw error;

            // Reset balance in profile (optional: maybe mark as 'escrow' until admin pays)
            // For high-fidelity demo, we subtract immediately
            await window._supabase.from('profiles').update({ balance: 0 }).eq('id', session.user.id);
            
            alert("✅ Demande envoyée ! Votre solde a été mis à jour. L'administrateur traitera votre virement sous peu.");
            this.renderManager(document.getElementById('ecosystem-grid-container'));

        } catch (err) { alert("Erreur Payout: " + err.message); }
    },

    /**
     * Public View: The Linktree-style digital storefront
     */
    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;"><span class="loader"></span></div>`;
        try {
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });

            if (!provider) { container.innerHTML = "Expert introuvable."; return; }

            const avatarHtml = `
                <div style="width: 120px; height: 120px; background: #020617; color: white; border-radius: 40px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; font-weight: 950; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transform: rotate(-1deg);">
                    ${provider.full_name?.substring(0,1).toUpperCase()}
                </div>
            `;

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; min-height: 100vh; padding: 80px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                        
                        ${avatarHtml}
                        <h1 style="font-size: 2.5rem; font-weight: 950; color: #020617; margin-bottom: 8px; letter-spacing: -0.05em;">${provider.full_name}</h1>
                        <p style="font-size: 1.1rem; color: #64748b; font-weight: 700; margin-bottom: 50px; opacity: 0.8;">${provider.headline || 'Expert Domtom Connect'}</p>

                        <!-- LINKTREE STYLE RE-INVENTED -->
                        <div style="display: flex; flex-direction: column; gap: 20px;">
                            ${items.map(item => `
                                <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: white; border: 3px solid #020617; border-radius: 24px; padding: 24px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; box-shadow: 10px 10px 0px #020617;" onmouseover="this.style.transform='translate(-3px, -3px)'; this.style.boxShadow='13px 13px 0px #020617'" onmouseout="this.style.transform='none'; this.style.boxShadow='10px 10px 0px #020617'">
                                    <div style="display: flex; align-items: center; gap: 20px;">
                                        <div style="font-size: 2.2rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${item.type === 'service' ? '🤝' : '📄'}</div>
                                        <div style="text-align: left;">
                                            <div style="font-weight: 950; font-size: 1.25rem; color: #020617; line-height: 1.1;">${item.title}</div>
                                            <div style="font-size: 0.8rem; color: #64748b; font-weight: 850; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px;">${item.type === 'service' ? 'Expertise' : 'Digital Product'}</div>
                                        </div>
                                    </div>
                                    <div style="font-weight: 950; font-size: 1.4rem; color: #020617; background: #f1f5f9; padding: 10px 15px; border-radius: 12px; border: 2px solid #020617;">${item.price.toFixed(2)}€</div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- BRANDING -->
                        <div style="margin-top: 100px; text-align: center;">
                            <img src="assets/img/logo.png" style="height: 24px; filter: grayscale(1) opacity(0.5); margin-bottom: 12px;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em;">Verified Expert Storefront</div>
                        </div>

                    </div>
                </div>
            `;
        } catch (err) { container.innerHTML = `<div style="padding:40px; text-align:center;">Erreur: ${err.message}</div>`; }
    },

    async openPublicItemModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*, profile:profiles(*)').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 48px; border: 3px solid #020617; box-shadow: 20px 20px 0px #020617; position: relative; animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 32px; right: 32px; background: #f1f5f9; border: 2px solid #020617; width: 44px; height: 44px; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: 900;">×</button>
                    
                    <div style="margin-bottom: 32px;">
                        <span style="background: #10b981; color: white; padding: 6px 14px; border-radius: 100px; font-weight: 900; font-size: 0.75rem;">DISPONIBLE IMMÉDIATEMENT</span>
                        <h2 style="font-size: 2.2rem; font-weight: 950; color: #020617; margin: 15px 0 10px 0; line-height: 1.1;">${item.title}</h2>
                        <div style="font-size: 1.1rem; color: #475569; font-weight: 600; line-height: 1.6;">${item.description || 'Profitez d\'une expertise digitale de haut niveau.'}</div>
                    </div>

                    <div style="background: #f8fafc; padding: 30px; border-radius: 28px; border: 2px solid #020617; margin-bottom: 32px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 900; color: #64748b; font-size: 0.9rem;">Total à payer</span>
                            <span style="font-size: 2.5rem; font-weight: 950; color: #020617;">${item.price.toFixed(2)}€</span>
                        </div>
                    </div>

                    <div id="paypal-button-container-showcase"></div>
                    <p style="text-align: center; font-size: 0.75rem; color: #94a3b8; margin-top: 24px; font-weight: 700;">Transaction sécurisée • Accès instantané</p>
                </div>
            `;
            
            overlay.classList.add('open');
            this.renderPayPalButton(item.user_id, item.id, item.price);
        } catch (err) { alert(err.message); }
    },

    renderPayPalButton(providerId, itemId, price) {
        if (typeof paypal === 'undefined') return;
        paypal.Buttons({
            style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 55 },
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{ amount: { currency_code: 'EUR', value: price.toFixed(2) } }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    this.executeFinalOrder({ itemId, providerId, price, paypalId: details.id });
                });
            }
        }).render('#paypal-button-container-showcase');
    },

    async executeFinalOrder(p) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').insert({
                item_id: p.itemId,
                buyer_id: session?.user?.id || null, // Buyer can be guest
                provider_id: p.providerId,
                total_price: p.price,
                commission_amount: p.price * this.COMMISSION_RATE,
                transaction_id: p.paypalId,
                invoice_number: `DOM-ME-${Date.now()}`
            });
            await this.recalculateBalance(p.providerId);
            alert("✓ Paiement Validé ! Vous allez recevoir un email avec vos accès.");
            document.getElementById('details-modal-overlay').classList.remove('open');
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
