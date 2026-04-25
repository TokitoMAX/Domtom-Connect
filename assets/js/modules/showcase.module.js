/**
 * Showcase Module - Domtom Connect
 * Implements Modern PayPal SDK with local file:// fallback.
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb',

    async init() {
        // Essential: Standardize the Details modal ID for all uses
        if (!document.getElementById('details-modal-overlay')) {
            console.warn("[Showcase] Modal overlay missing in DOM.");
        }
        
        // Dynamic script loading
        if (!window.paypal && !document.getElementById('paypal-sdk-script')) {
            const script = document.createElement('script');
            script.id = 'paypal-sdk-script';
            script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}&currency=EUR`;
            script.async = true;
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
                .select(`*, profile:profiles!user_id (full_name, avatar_url, role, showcase_primary_color, showcase_secondary_color)`)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            const allItems = items || [];

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: #fafafa; min-height: 100vh;">
                    <div style="margin-bottom: 64px; text-align: center;">
                        <span style="background: #0070ba; color: white; padding: 6px 16px; border-radius: 99px; font-weight: 850; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Marché Solidaire</span>
                        <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 950; color: #020617; margin: 16px 0; letter-spacing: -0.06em; line-height: 1;">Solutions Pays</h1>
                        <p style="color: #64748b; font-size: 1.2rem; font-weight: 600; max-width: 700px; margin: 0 auto;">Accédez aux meilleurs services et produits des experts de nos territoires.</p>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; max-width: 1400px; margin: 0 auto;">
                        ${allItems.map(item => {
                            const colors = { 
                                primary: item.profile?.showcase_primary_color || '#020617', 
                                secondary: item.profile?.showcase_secondary_color || '#0070ba' 
                            };
                            return this.renderShowcaseCard(item, false, colors);
                        }).join('')}
                    </div>
                </div>
            `;
        } catch (err) {
            container.innerHTML = `<div style="padding:40px; color:#ef4444; text-align:center; font-weight:700;">Erreur Marketplace Supabase : ${err.message}</div>`;
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
            if (!session) throw new Error("Connectez-vous pour gérer votre boutique.");

            const { data: profile } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: white; border-radius: 32px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 48px;">
                        <div style="background: #020617; color: white; padding: 32px; border-radius: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase;">Solde disponible</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0;">${profile?.balance || 0}€</div>
                            <button onclick="window.ShowcaseModule.requestPayout()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 900; cursor: pointer; width: 100%;">Retirer via PayPal</button>
                        </div>
                        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #64748b; text-transform: uppercase;">Total des ventes</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0; color: #020617;">${profile?.total_earnings || 0}€</div>
                            <div style="color: #64748b; font-size: 0.85rem; font-weight: 700;">H.T (hors com plateforme)</div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#0f172a; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:3px solid #0f172a;">Mon Catalogue</button>
                        <button id="tab-sales" onclick="ShowcaseModule.switchTab('sales')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Mes Ventes 📦</button>
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
        ` : `<div style="text-align:center; padding: 40px;"><button onclick="window.ShowcaseModule.openItemModal()" style="background:#0f172a; color:white; border:none; padding:12px 24px; border-radius:12px; cursor:pointer; font-weight:900;">+ Créer un produit/service</button></div>`;
    },

    renderShowcaseCard(item, isEditable = false, brandColors = { primary: '#0f172a', secondary: '#0070ba' }) {
        const btnColor = isEditable ? '#0f172a' : (brandColors.secondary || '#0070ba');
        
        return `
            <div style="background: white; border-radius: 28px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; transition: 0.3s; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                <div style="height: 180px; background: #f8fafc; position: relative;">
                    <img src="${item.image_url || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="font-weight: 950; color:#020617; font-size:1.1rem; letter-spacing: -0.02em;">${item.title}</div>
                        ${isEditable ? `
                            <div style="display: flex; gap: 8px;">
                                <button onclick='window.ShowcaseModule.openItemModal(${JSON.stringify(item).replace(/'/g, "&apos;")})' style="background: #f1f5f9; border:none; padding: 8px; border-radius:10px; cursor:pointer;" title="Modifier">✏️</button>
                                <button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border:none; padding: 8px; border-radius:10px; cursor:pointer;" title="Supprimer">🗑️</button>
                            </div>
                        ` : ''}
                    </div>
                    <p style="font-size: 0.85rem; color:#64748b; font-weight:600; line-height:1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.description}</p>
                    
                    <div style="margin-top: auto; padding-top: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-weight: 950; font-size: 1.4rem; color: ${brandColors.primary || '#020617'};">${item.price}€</span>
                            <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Prix Net</div>
                        </div>
                        ${!isEditable ? `
                            <button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" 
                                style="background: ${btnColor}; color: white; border: none; padding: 12px 24px; border-radius: 14px; font-weight: 950; cursor: pointer; transition: transform 0.2s; box-shadow: 0 10px 15px -3px ${btnColor}44;"
                                onmouseover="this.style.transform='translateY(-2px)'"
                                onmouseout="this.style.transform='translateY(0)'">
                                Commander
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * CHECKOUT MODAL WITH FALLBACK
     */
    async openCheckoutModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*, profile:profiles!user_id(full_name)').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 40px; padding: 48px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <h2 style="font-weight: 950; margin-bottom: 8px; color: #020617; font-size: 1.8rem; letter-spacing: -0.05em;">Finaliser l'achat</h2>
                    <p style="color: #64748b; font-weight: 600; margin-bottom: 32px;">Paiement via Domtom Connect</p>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; border: 1.5px solid #f1f5f9;">
                        <span style="font-weight: 800; color: #0f172a;">${item.title}</span>
                        <span style="font-weight: 950; font-size: 1.6rem; color: #106fba;">${item.price}€</span>
                    </div>

                    <div id="paypal-button-container" style="min-height: 100px;">
                        <p style="color:#94a3b8; font-size:0.85rem; margin-bottom:16px;">Chargement du module de paiement...</p>
                    </div>
                    
                    <div id="local-fallback-container" style="display:none; margin-top:16px;">
                        <p style="color:#ef4444; font-size:0.8rem; font-weight:700; margin-bottom:12px;">Mode local détecté (PayPal bloqué)</p>
                        <button onclick="window.ShowcaseModule.finalizeOrder('${item.id}', '${item.user_id}', ${item.price}, 'DEMO_MODE')" style="width:100%; background:#10b981; color:white; border:none; padding:18px; border-radius:18px; font-weight:950; cursor:pointer;">Simuler le paiement (Demo)</button>
                    </div>

                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color:#94a3b8; border:none; background:none; font-weight:750; margin-top:20px; cursor:pointer;">Annuler</button>
                </div>
            `;
            overlay.classList.add('open');

            // Attempt to render PayPal
            let paypalLoaded = false;
            if (window.paypal) {
                try {
                    await window.paypal.Buttons({
                        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { currency_code: 'EUR', value: item.price.toString() } }] }),
                        onApprove: async (data, actions) => {
                            const details = await actions.order.capture();
                            await this.finalizeOrder(item.id, item.user_id, item.price, details.id);
                        },
                        onError: (err) => { document.getElementById('local-fallback-container').style.display = 'block'; }
                    }).render('#paypal-button-container');
                    paypalLoaded = true;
                } catch(e) { /* Error allowed back to fallback */ }
            }

            // If not loaded after 3s, show fallback
            setTimeout(() => {
                if (!paypalLoaded || !window.paypal) {
                    document.getElementById('paypal-button-container').style.display = 'none';
                    document.getElementById('local-fallback-container').style.display = 'block';
                }
            }, 3000);

        } catch (err) { alert(err.message); }
    },

    async finalizeOrder(itemId, providerId, price, txId) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) return alert("Session perdue.");
            
            const netAmount = price * (1 - this.COMMISSION_RATE);
            const invoiceNum = `DOM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

            // 1. Transaction orders
            await window._supabase.from('showcase_orders').insert({
                item_id: itemId, buyer_id: session.user.id, provider_id: providerId,
                total_price: price, status: 'paid', transaction_id: txId,
                invoice_number: invoiceNum
            });

            // 2. Update Seller
            const { data: seller } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', providerId).single();
            await window._supabase.from('profiles').update({
                balance: (seller.balance || 0) + netAmount,
                total_earnings: (seller.total_earnings || 0) + price
            }).eq('id', providerId);

            alert("SUCCÈS : Commande enregistrée et Expert crédité !");
            document.getElementById('details-modal-overlay').classList.remove('open');
            if (window.location.hash.includes('boutique')) this.renderMarketplace(document.getElementById('marketplace-container'));
        } catch (err) { alert("Erreur validation : " + err.message); }
    },

    /**
     * STATS & TAB SWITCHING
     */
    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        const { data: { session } } = await window._supabase.auth.getSession();
        
        ['vitrine', 'sales', 'withdraw'].forEach(t => {
            const el = document.getElementById(`tab-${t}`);
            if (el) {
                const active = t === tabName;
                el.style.color = active ? '#0f172a' : '#94a3b8';
                el.style.borderBottom = active ? '3px solid #0f172a' : 'none';
                el.style.fontWeight = active ? '900' : '700';
            }
        });

        if (tabName === 'vitrine') {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id);
            contentArea.innerHTML = this.renderLocalGrid(items);
        } else if (tabName === 'sales') {
            const { data: orders } = await window._supabase
                .from('showcase_orders')
                .select(`*, item:showcase_items(title), buyer:profiles!buyer_id(full_name)`)
                .eq('provider_id', session.user.id)
                .order('created_at', { ascending: false });

            contentArea.innerHTML = `
                <div style="background: white; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 1px solid #f1f5f9; text-align: left;">
                                <th style="padding: 16px; font-weight: 800; color: #64748b;">Client</th>
                                <th style="padding: 16px; font-weight: 800; color: #64748b;">Article</th>
                                <th style="padding: 16px; font-weight: 800; color: #64748b;">Total</th>
                                <th style="padding: 16px; font-weight: 800; color: #64748b;">Suivi</th>
                                <th style="padding: 16px; font-weight: 800; color: #64748b;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders && orders.length > 0 ? orders.map(order => `
                                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='none'">
                                    <td style="padding: 16px;">
                                        <div style="font-weight: 950; color: #020617;">${order.buyer?.full_name}</div>
                                        <div style="font-size: 0.75rem; color: #94a3b8;">${order.invoice_number || 'Pas de facture'}</div>
                                    </td>
                                    <td style="padding: 16px; font-weight: 700;">${order.item?.title}</td>
                                    <td style="padding: 16px; font-weight: 950; color: #10b981;">${order.total_price}€</td>
                                    <td style="padding: 16px;">
                                        <input type="text" value="${order.tracking_number || ''}" placeholder="N° de suivi..." 
                                            onchange="window.ShowcaseModule.updateTracking('${order.id}', this.value)"
                                            style="padding: 8px 12px; border-radius: 8px; border: 1.5px solid #e2e8f0; font-size: 0.8rem; width: 120px;">
                                    </td>
                                    <td style="padding: 16px;">
                                        <button onclick="window.ShowcaseModule.generateInvoice('${order.id}')" style="background: #f1f5f9; border: none; padding: 10px; border-radius: 8px; cursor: pointer;" title="Télécharger facture">📄</button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="5" style="padding: 40px; text-align: center; color: #94a3b8;">Aucune vente pour le moment.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            const { data: profile } = await window._supabase.from('profiles').select('paypal_email, showcase_primary_color, showcase_secondary_color, showcase_intro_text').eq('id', session.user.id).single();
            const { data: reqs } = await window._supabase.from('payout_requests').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div style="background: #f8fafc; border-radius: 20px; padding: 32px; border: 1.5px solid #e2e8f0;">
                             <h4 style="margin-top:0; font-weight:950; display:flex; align-items:center; gap:10px;">💳 Config PayPal</h4>
                             <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">Indiquez l'email où vous recevrez vos fonds automatiquement.</p>
                             <input id="paypal-email" type="email" value="${profile?.paypal_email || ''}" placeholder="votre-paypal@email.com" style="width: 100%; padding:14px; border-radius:12px; border:1.5px solid #e2e8f0; margin-bottom:16px;">
                             <button onclick="window.ShowcaseModule.savePayoutBrandingConfig()" style="width:100%; background:#0f172a; color:white; border:none; padding:14px; border-radius:12px; font-weight:900; cursor:pointer;">Enregistrer Config</button>
                        </div>

                        <div style="background: white; border-radius: 20px; padding: 32px; border: 1.5px solid #e2e8f0;">
                             <h4 style="margin-top:0; font-weight:950; display:flex; align-items:center; gap:10px;">✨ Branding Vitrine</h4>
                             <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">Personnalisez l'apparence de votre boutique pour vos clients.</p>
                             
                             <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
                                <div>
                                    <label style="font-size:0.7rem; font-weight:800; color:#64748b; text-transform:uppercase;">Couleur Primaire</label>
                                    <input id="brand-color-1" type="color" value="${profile?.showcase_primary_color || '#0f172a'}" style="width:100%; height:44px; border-radius:8px; border:none; padding:0; cursor:pointer;">
                                </div>
                                <div>
                                    <label style="font-size:0.7rem; font-weight:800; color:#64748b; text-transform:uppercase;">Couleur Boutons</label>
                                    <input id="brand-color-2" type="color" value="${profile?.showcase_secondary_color || '#0070ba'}" style="width:100%; height:44px; border-radius:8px; border:none; padding:0; cursor:pointer;">
                                </div>
                             </div>

                             <label style="font-size:0.7rem; font-weight:800; color:#64748b; text-transform:uppercase;">Message d'accueil</label>
                             <textarea id="brand-intro" placeholder="Ex: Bienvenue dans ma sélection de produits locaux..." style="width:100%; padding:14px; border-radius:12px; border:1.5px solid #e2e8f0; min-height:80px; margin-top:8px;">${profile?.showcase_intro_text || ''}</textarea>
                             
                             <button onclick="window.ShowcaseModule.savePayoutBrandingConfig()" style="width:100%; background:#f1f5f9; color:#0f172a; border:none; padding:14px; border-radius:12px; font-weight:900; cursor:pointer; margin-top:16px;">Appliquer les couleurs</button>
                        </div>
                    </div>

                    <div style="background:white; padding:32px; border:1px solid #f1f5f9; border-radius:20px;">
                        <h4 style="margin-top:0; font-weight:950; display:flex; align-items:center; gap:10px;">📋 Historique des Retraits</h4>
                        <div style="margin-top:20px;">
                            ${reqs && reqs.length > 0 ? reqs.map(r => `
                                <div style="padding:16px; border: 1.5px solid #f1f5f9; border-radius:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                    <div>
                                        <div style="font-weight:900; font-size:1.1rem;">${r.amount}€</div>
                                        <div style="font-size:0.75rem; color:#94a3b8;">${new Date(r.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <span style="background:${r.status === 'pending' ? '#fef3c7' : '#dcfce7'}; color:${r.status === 'pending' ? '#92400e' : '#166534'}; padding:6px 12px; border-radius:99px; font-weight:900; font-size:0.75rem; text-transform:uppercase;">${r.status}</span>
                                </div>
                            `).join('') : '<p style="text-align:center; color:#94a3b8; padding:40px;">Aucune demande effectuée.</p>'}
                        </div>
                    </div>
                </div>
            `;
        }
    },

    async savePayoutBrandingConfig() {
        const payload = {
            paypal_email: document.getElementById('paypal-email').value.trim(),
            showcase_primary_color: document.getElementById('brand-color-1').value,
            showcase_secondary_color: document.getElementById('brand-color-2').value,
            showcase_intro_text: document.getElementById('brand-intro').value.trim()
        };
        const { data: { session } } = await window._supabase.auth.getSession();
        const { error } = await window._supabase.from('profiles').update(payload).eq('id', session.user.id);
        if(error) alert("Erreur : " + error.message);
        else alert("Branding et Config sauvegardés avec succès !");
    },

    async updateTracking(orderId, trackingNum) {
        await window._supabase.from('showcase_orders').update({ tracking_number: trackingNum }).eq('id', orderId);
        alert("N° de suivi mis à jour !");
    },

    async generateInvoice(orderId) {
        try {
            const { data: order } = await window._supabase
                .from('showcase_orders')
                .select(`*, item:showcase_items(*), buyer:profiles!buyer_id(*), provider:profiles!provider_id(*)`)
                .eq('id', orderId)
                .single();
            
            const invoiceHTML = `
                <html>
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800;900&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Plus Jakarta Sans', sans-serif; color: #020617; padding: 60px; max-width: 800px; margin: 0 auto; -webkit-print-color-adjust: exact; }
                        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 32px; }
                        .logo { font-size: 1.2rem; font-weight: 900; color: #0070ba; letter-spacing: -0.02em; }
                        .invoice-meta { text-align: right; }
                        .invoice-title { font-size: 3rem; font-weight: 950; letter-spacing: -0.06em; margin: 0; line-height: 0.9; text-transform: uppercase; }
                        .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 64px; }
                        .label { font-size: 0.75rem; font-weight: 850; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 64px; }
                        th { background: #f8fafc; padding: 20px; text-align: left; border-bottom: 1px solid #f1f5f9; font-weight: 850; font-size: 0.8rem; text-transform: uppercase; color: #64748b; }
                        td { padding: 24px 20px; border-bottom: 1px solid #f1f5f9; }
                        .total-section { display: flex; justify-content: flex-end; margin-top: 64px; }
                        .total-card { background: #020617; color: white; padding: 40px; border-radius: 32px; width: 320px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                        .footer { margin-top: 100px; padding-top: 32px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 0.75rem; font-weight: 600; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">DOMTOM CONNECT <span style="color:#64748b; font-weight:600;">| SHOWCASE</span></div>
                        <div class="invoice-meta">
                            <h1 class="invoice-title">Facture</h1>
                            <div style="font-weight:900; font-size: 1.1rem; margin-top: 8px;">${order.invoice_number}</div>
                            <div style="color:#64748b; font-size:0.85rem; font-weight: 700;">Date: ${new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                    </div>
                    <div class="addresses">
                        <div>
                            <div class="label">Expert / Vendeur</div>
                            <div style="font-weight:900; font-size: 1.1rem;">${order.provider?.full_name}</div>
                            <div style="font-size:0.85rem; color:#64748b; line-height: 1.6; margin-top: 4px;">PayPal: ${order.provider?.paypal_email}</div>
                        </div>
                        <div>
                            <div class="label">Client / Acheteur</div>
                            <div style="font-weight:900; font-size: 1.1rem;">${order.buyer?.full_name}</div>
                            <div style="font-size:0.85rem; color:#64748b; line-height: 1.6; margin-top: 4px;">Email Support: support@domtom-connect.com</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Description du service / produit</th>
                                <th style="text-align:right;">Prix Unitaire</th>
                                <th style="text-align:right;">Total HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div style="font-weight:900; font-size: 1.1rem;">${order.item?.title}</div>
                                    <div style="font-size:0.8rem; color:#64748b; margin-top:4px;">Commande #${order.transaction_id.substring(0,8)}...</div>
                                </td>
                                <td style="text-align:right; font-weight:700;">${order.total_price}€</td>
                                <td style="text-align:right; font-weight:950; font-size: 1.1rem;">${order.total_price}€</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="total-section">
                        <div class="total-card">
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                                <span style="font-weight:700; color:#94a3b8;">Sous-total HT</span>
                                <span style="font-weight:800;">${order.total_price}€</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:24px; font-size:0.85rem; color:#64748b;">
                                <span>TVA / Taxes locale</span>
                                <span>0,00€</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:1.8rem; font-weight:950; border-top:1px solid #1e293b; padding-top:24px;">
                                <span>TOTAL</span>
                                <span>${order.total_price}€</span>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        Domtom Connect - Plateforme Technologique d'Intermédiation<br>
                        Document généré électroniquement - Valant preuve d'achat.
                    </div>
                </body>
                </html>
            `;

            const win = window.open('', '_blank');
            win.document.write(invoiceHTML);
            win.document.close();
            setTimeout(() => win.print(), 800);
        } catch (err) { alert("Erreur facture: " + err.message); }
    },
    
    async requestPayout() {
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: p } = await window._supabase.from('profiles').select('balance, paypal_email').eq('id', session.user.id).single();
        if(!p.paypal_email) return alert("Email PayPal manquant.");
        if(p.balance < 10) return alert("Solde trop bas (<10€).");
        await window._supabase.from('payout_requests').insert({ user_id: session.user.id, amount: p.balance, paypal_email: p.paypal_email, status: 'pending' });
        await window._supabase.from('profiles').update({ balance: 0 }).eq('id', session.user.id);
        alert("Retrait en attente de validation.");
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

    async openItemModal(item = null) {
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 48px;">
                <h2 style="font-weight: 950; margin-bottom: 24px;">${item ? 'Modifier l\'offre' : 'Nouvelle Offre'}</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <input id="item-id" type="hidden" value="${item?.id || ''}">
                    <input id="item-title" value="${item?.title || ''}" placeholder="Titre..." style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;">
                    <textarea id="item-desc" placeholder="Description..." style="width: 100%; min-height: 100px; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0;">${item?.description || ''}</textarea>
                    <input id="item-price" type="number" value="${item?.price || ''}" placeholder="Prix (€)" style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;">
                    <div style="font-size: 0.8rem; color: #64748b;">Image (laisser vide pour garder l'actuelle) :</div>
                    <input id="item-file" type="file">
                    <button onclick="window.ShowcaseModule.saveItem()" style="background: #0f172a; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 950; cursor: pointer;">ENREGISTRER</button>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color: #64748b; background: none; border: none; cursor: pointer; font-weight: 700;">Annuler</button>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveItem() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const itemId = document.getElementById('item-id').value;
            
            const payload = { 
                user_id: session.user.id, 
                title: document.getElementById('item-title').value,
                description: document.getElementById('item-desc').value,
                price: parseFloat(document.getElementById('item-price').value),
                status: 'active'
            };

            const fileInput = document.getElementById('item-file');
            if (fileInput.files[0]) {
                const fn = `showcase/${session.user.id}/${Date.now()}`;
                await window._supabase.storage.from('showcase').upload(fn, fileInput.files[0]);
                const { data } = window._supabase.storage.from('showcase').getPublicUrl(fn);
                payload.image_url = data.publicUrl;
            }

            if (itemId) {
                await window._supabase.from('showcase_items').update(payload).eq('id', itemId);
            } else {
                await window._supabase.from('showcase_items').insert(payload);
            }

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
