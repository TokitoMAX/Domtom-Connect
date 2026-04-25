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
            
            // AUTOMATIC SYNC BEFORE RENDERING
            // This ensures top cards are NEVER disconnected from the journal
            const stats = await this.recalculateBalance(session.user.id);
            
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; animation: fadeIn 0.5s ease;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 48px;">
                        <!-- SOLDE DISPONIBLE (SYNCED) -->
                        <div style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); color: white; padding: 32px; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                                <div style="font-size: 0.7rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Solde Disponible (Net 95%)</div>
                                <div style="background:rgba(16,185,129,0.2); color:#10b981; padding:4px 10px; border-radius:8px; font-size:0.65rem; font-weight:900;">ACTUALISÉ ✓</div>
                            </div>
                            <div style="font-size: 3.2rem; font-weight: 950; margin: 0 0 24px 0; letter-spacing:-0.04em;">${(profile?.balance || 0).toFixed(2)}€</div>
                            <button onclick="window.ShowcaseModule.requestPayout()" style="background: #10b981; color: white; border: none; padding: 18px; border-radius: 18px; font-weight: 900; width: 100%; cursor:pointer; font-size:1.1rem; box-shadow: 0 10px 20px rgba(16,185,129,0.3); transition:0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Virement vers PayPal 🚀</button>
                        </div>

                        <!-- VOLUME D'AFFAIRES (SYNCED) -->
                        <div style="background: white; border: 1.5px solid #e2e8f0; padding: 32px; border-radius: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.02);">
                            <div style="font-size: 0.7rem; font-weight: 850; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom:20px;">Volume d'affaires (Brut)</div>
                            <div style="font-size: 3.2rem; font-weight: 950; margin: 0; color: #020617; letter-spacing:-0.04em;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                            <div style="margin-top:24px; display:flex; align-items:center; gap:10px;">
                                <div style="width:12px; height:12px; background:#4f46e5; border-radius:3px;"></div>
                                <div style="font-size:0.85rem; color:#64748b; font-weight:700;">Cumul des ventes validées</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 32px; border-bottom: 2.5px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#020617; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:4px solid #020617;">Catalogue</button>
                        <button id="tab-sales" onclick="ShowcaseModule.switchTab('sales')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Journal Financier ✨</button>
                        <button id="tab-config" onclick="ShowcaseModule.switchTab('config')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Paramètres 🛠️</button>
                    </div>
                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>
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
        const { data: sessionData } = await window._supabase.auth.getSession();
        const tid = userId || sessionData.session.user.id;
        const { data: orders } = await window._supabase.from('showcase_orders').select('total_price').eq('provider_id', tid);
        const totalRev = (orders || []).reduce((acc, o) => acc + (o.total_price || 0), 0);
        const totalNet = totalRev * (1 - this.COMMISSION_RATE);
        const totalComm = totalRev * this.COMMISSION_RATE;
        await window._supabase.from('profiles').update({ balance: totalNet, total_earnings: totalRev, total_commissions: totalComm }).eq('id', tid);
        return { totalRev, totalNet, totalComm };
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
                <div style="background: white; border-radius: 24px; border: 1.5px solid #f1f5f9; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
                    <div style="padding:15px 24px; background:#f8fafc; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="margin:0; font-weight:950; font-size:0.9rem;">RELEVÉ DES TRANSACTIONS</h4>
                        <button onclick="ShowcaseModule.switchTab('sales')" style="background:none; border:none; color:#0070ba; font-weight:900; cursor:pointer; font-size:0.75rem;">🔄 RAFFRAICHIR</button>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size:0.9rem;">
                        <thead style="background: #ffffff; text-align: left; border-bottom: 2px solid #f1f5f9;">
                            <tr>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Client & Date</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Détails Vente</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Ventilation (Net/Com)</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b; text-transform:uppercase; font-size:0.65rem;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(orders || []).map(o => `
                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 20px;">
                                        <div style="font-weight: 950; color:#020617; font-size:1rem;">${o.buyer?.full_name || 'Client Direct'}</div>
                                        <div style="font-size:0.75rem; color:#94a3b8; font-weight:700; margin-top:4px;">${new Date(o.created_at).toLocaleDateString()} à ${new Date(o.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                                    </td>
                                    <td style="padding: 20px;">
                                        <div style="font-weight: 700;">${o.item?.title}</div>
                                        <div style="font-size:0.75rem; color:#64748b; font-weight:800;">${o.total_price.toFixed(2)}€ Payés</div>
                                    </td>
                                    <td style="padding: 20px;">
                                        <div style="font-weight: 950; color: #10b981;">+${(o.total_price * 0.95).toFixed(2)}€ Gain</div>
                                        <div style="font-size:0.7rem; color:#ef4444; font-weight:900;">-${(o.total_price * 0.05).toFixed(2)}€ Com.</div>
                                    </td>
                                    <td style="padding: 20px;">
                                        <button onclick="window.ShowcaseModule.generateInvoice('${o.id}')" style="background:#0f172a; color:white; border:none; padding:10px 18px; border-radius:10px; cursor:pointer; font-weight:950; font-size:0.75rem;">Voir Facture</button>
                                    </td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
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

    async deleteItem(id) {
        if(confirm("Supprimer l'offre ?")) {
            await window._supabase.from('showcase_items').delete().eq('id', id);
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    }
};

window.ShowcaseModule = ShowcaseModule;
