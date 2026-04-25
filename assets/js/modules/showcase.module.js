/**
 * Showcase Module - Domtom Connect
 * Implements Modern PayPal SDK with Logistics, Taxes, and Invoicing.
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb',

    async init() {
        if (!document.getElementById('details-modal-overlay')) {
            console.warn("[Showcase] Modal overlay missing in DOM.");
        }
        
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
                .select(`*, profile:profiles!user_id (full_name, showcase_primary_color, showcase_secondary_color)`)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            const allItems = items || [];

            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background: #fafafa; min-height: 100vh;">
                    <div style="margin-bottom: 64px; text-align: center;">
                        <span style="background: #0070ba; color: white; padding: 6px 16px; border-radius: 99px; font-weight: 850; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Marché Solidaire</span>
                        <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 950; color: #020617; margin: 16px 0; letter-spacing: -0.06em; line-height: 1;">Solutions Pays</h1>
                        <p style="color: #64748b; font-size: 1.2rem; font-weight: 600; max-width: 700px; margin: 0 auto;">Le meilleur des territoires branché en direct.</p>
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
            container.innerHTML = `<div style="padding:40px; color:#ef4444; font-weight:700;">${err.message}</div>`;
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
                        <div style="background: #020617; color: white; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #94a3b8; text-transform: uppercase;">Solde disponible</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0;">${profile?.balance || 0}€</div>
                            <button onclick="window.ShowcaseModule.requestPayout()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 900; cursor: pointer; width: 100%;">Retirer via PayPal</button>
                        </div>
                        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 32px; border-radius: 28px;">
                            <div style="font-size: 0.75rem; font-weight: 850; color: #64748b; text-transform: uppercase;">Volume d'affaires</div>
                            <div style="font-size: 2.2rem; font-weight: 950; margin: 8px 0; color: #020617;">${profile?.total_earnings || 0}€</div>
                            <div style="color: #64748b; font-size: 0.85rem; font-weight: 700;">H.T cumulé</div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 24px; border-bottom: 2px solid #f1f5f9; margin-bottom: 32px; padding-bottom: 8px;">
                        <button id="tab-vitrine" onclick="ShowcaseModule.switchTab('vitrine')" style="background:none; border:none; color:#0f172a; font-weight:900; font-size:1.1rem; cursor:pointer; padding-bottom:12px; border-bottom:3px solid #0f172a;">Mon Catalogue</button>
                        <button id="tab-sales" onclick="ShowcaseModule.switchTab('sales')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Mes Ventes 📦</button>
                        <button id="tab-withdraw" onclick="ShowcaseModule.switchTab('withdraw')" style="background:none; border:none; color:#94a3b8; font-weight:700; font-size:1.1rem; cursor:pointer; padding-bottom:12px;">Retraits & Taxes 💸</button>
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
        return `
            <div style="margin-bottom: 32px; display: flex; justify-content: flex-end;">
                <button onclick="window.ShowcaseModule.openItemModal()" style="background:#0f172a; color:white; border:none; padding:14px 28px; border-radius:14px; cursor:pointer; font-weight:900; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">+ Créer un produit/service</button>
            </div>
            ${items && items.length > 0 ? `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
                    ${items.map(item => this.renderShowcaseCard(item, true)).join('')}
                </div>
            ` : `<div style="text-align:center; padding: 60px; background: #f8fafc; border-radius: 24px; border: 2px dashed #e2e8f0; color: #94a3b8; font-weight: 700;">Aucune offre active.</div>`}
        `;
    },

    renderShowcaseCard(item, isEditable = false, brandColors = { primary: '#0f172a', secondary: '#0070ba' }) {
        const btnColor = isEditable ? '#0f172a' : (brandColors.secondary || '#0070ba');
        return `
            <div style="background: white; border-radius: 28px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                <div style="height: 180px; background: #f8fafc; position: relative;">
                    <img src="${item.image_url || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="font-weight: 950; color:#020617; font-size:1.1rem; letter-spacing: -0.02em;">${item.title}</div>
                        ${isEditable ? `
                            <div style="display: flex; gap: 8px;">
                                <button onclick='window.ShowcaseModule.openItemModal(${JSON.stringify(item).replace(/'/g, "&apos;")})' style="background: #f1f5f9; border:none; padding: 8px; border-radius:10px; cursor:pointer;">✏️</button>
                                <button onclick="window.ShowcaseModule.deleteItem('${item.id}')" style="background: #fee2e2; border:none; padding: 8px; border-radius:10px; cursor:pointer;">🗑️</button>
                            </div>
                        ` : ''}
                    </div>
                    <p style="font-size: 0.85rem; color:#64748b; font-weight:600; line-height:1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.description}</p>
                    <div style="margin-top: auto; padding-top: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-weight: 950; font-size: 1.4rem; color: ${brandColors.primary || '#020617'};">${item.price}€</span>
                            <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 800; text-transform: uppercase;">${item.unit || 'Net'}</div>
                        </div>
                        ${!isEditable ? `<button onclick="window.ShowcaseModule.openCheckoutModal('${item.id}')" style="background: ${btnColor}; color: white; border: none; padding: 12px 24px; border-radius: 14px; font-weight: 950; cursor: pointer;">Commander</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * CHECKOUT MODAL WITH ZONE SELECTION
     */
    async openCheckoutModal(itemId) {
        try {
            const { data: item } = await window._supabase.from('showcase_items').select('*, profile:profiles!user_id(*)').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            
            const p = item.profile || {};
            const zones = {
                local: p.shipping_rate_local || 0,
                national: p.shipping_rate_national || 0,
                international: p.shipping_rate_int || 0
            };

            const taxRate = p.tax_rate || 0;
            
            overlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 520px; border-radius: 40px; padding: 48px; font-family: 'Plus Jakarta Sans', sans-serif; max-height:90vh; overflow-y:auto;">
                    <div style="text-align:center; margin-bottom:32px;">
                        <h2 style="font-weight: 950; margin-bottom: 8px; color: #020617; font-size: 2rem; letter-spacing: -0.06em;">Paiement Sécurisé</h2>
                        <p style="color:#64748b; font-weight:700;">Finalisez votre achat pour ${item.title}</p>
                    </div>

                    <div style="background: #f8fafc; padding: 24px; border-radius: 28px; margin-bottom: 32px; border: 1.5px solid #f1f5f9;">
                         <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:800;"><span>Prix de base</span><span>${item.price.toFixed(2)}€</span></div>
                         
                         <label style="font-size:0.7rem; font-weight:900; color:#64748b; text-transform:uppercase; display:block; margin-top:20px;">Zone de livraison</label>
                         <select id="ship-zone" onchange="window.ShowcaseModule.updateCheckoutPrice(${item.price}, ${taxRate})" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; font-weight:800; margin-top:6px;">
                            <option value="0" data-rate="0">Service dématérialisé (0€)</option>
                            <option value="local" data-rate="${zones.local}">Livraison Locale Territory (${zones.local}€)</option>
                            <option value="national" data-rate="${zones.national}">National / Métropole (${zones.national}€)</option>
                            <option value="international" data-rate="${zones.international}">International / Monde (${zones.international}€)</option>
                         </select>

                         <div style="border-top:1px dashed #e2e8f0; margin-top:20px; padding-top:20px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem; color:#64748b;">
                                <span>Livraison</span><span id="txt-shipping">0.00€</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.9rem; color:#64748b;">
                                <span>Taxes / Octroi (${taxRate}%)</span><span id="txt-tax">0.00€</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-weight:950; font-size:1.8rem; color:#0070ba;">
                                <span>TOTAL</span><span id="txt-total">${item.price.toFixed(2)}€</span>
                            </div>
                         </div>
                    </div>

                    <div id="address-fields" style="display:none; margin-bottom:32px;">
                        <h4 style="margin:0 0 16px 0; font-weight:950;">Coordonnées de livraison</h4>
                        <input id="ship-name" placeholder="Nom complet" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; margin-bottom:12px;">
                        <input id="ship-addr" placeholder="Adresse de livraison" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; margin-bottom:12px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                            <input id="ship-zip" placeholder="Code postal" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0;">
                            <input id="ship-city" placeholder="Ville" style="width:100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0;">
                        </div>
                    </div>

                    <div id="paypal-button-container"></div>
                    <div id="local-fallback-container" style="display:none;">
                        <button id="btn-final-pay" onclick="window.ShowcaseModule.executeAutomatedOrder('${item.id}', '${item.user_id}', ${item.price}, ${taxRate})" style="width:100%; background:#10b981; color:white; border:none; padding:20px; border-radius:20px; font-weight:950; cursor:pointer;">Confirmer & Payer</button>
                    </div>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="width:100%; background:none; border:none; color:#94a3b8; font-weight:800; cursor:pointer; margin-top:16px;">Annuler</button>
                </div>
            `;
            overlay.classList.add('open');
            this.updateCheckoutPrice(item.price, taxRate);
            
            if(window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { currency_code: 'EUR', value: document.getElementById('txt-total').innerText.replace('€','') } }] }),
                    onApprove: (data, actions) => actions.order.capture().then(d => this.executeAutomatedOrder(item.id, item.user_id, item.price, taxRate, d.id)),
                    onError: () => document.getElementById('local-fallback-container').style.display = 'block'
                }).render('#paypal-button-container').catch(()=> document.getElementById('local-fallback-container').style.display='block');
            } else {
                document.getElementById('local-fallback-container').style.display = 'block';
            }
        } catch (err) { alert(err.message); }
    },

    updateCheckoutPrice(basePrice, taxRate) {
        const zone = document.getElementById('ship-zone');
        const shipRate = parseFloat(zone.options[zone.selectedIndex].getAttribute('data-rate') || 0);
        const taxAmt = (basePrice * taxRate) / 100;
        const total = basePrice + shipRate + taxAmt;

        document.getElementById('txt-shipping').innerText = `${shipRate.toFixed(2)}€`;
        document.getElementById('txt-tax').innerText = `${taxAmt.toFixed(2)}€`;
        document.getElementById('txt-total').innerText = `${total.toFixed(2)}€`;
        document.getElementById('address-fields').style.display = zone.value === '0' ? 'none' : 'block';
    },

    async executeAutomatedOrder(itemId, providerId, basePrice, taxRate, txId = 'DEMO_PIPAY') {
        const zone = document.getElementById('ship-zone');
        const shipRate = parseFloat(zone.options[zone.selectedIndex].getAttribute('data-rate') || 0);
        const taxAmt = (basePrice * taxRate) / 100;
        const total = basePrice + shipRate + taxAmt;
        const { data: { session } } = await window._supabase.auth.getSession();

        const orderData = {
            item_id: itemId, buyer_id: session.user.id, provider_id: providerId,
            total_price: total, tax_amount: taxAmt, status: 'paid', transaction_id: txId,
            shipping_country: zone.value,
            invoice_number: `DOM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        };

        if(zone.value !== '0') {
            orderData.shipping_name = document.getElementById('ship-name').value;
            orderData.shipping_address = document.getElementById('ship-addr').value;
            orderData.shipping_zip = document.getElementById('ship-zip').value;
            orderData.shipping_city = document.getElementById('ship-city').value;
        }

        await window._supabase.from('showcase_orders').insert(orderData);
        const { data: s } = await window._supabase.from('profiles').select('balance, total_earnings').eq('id', providerId).single();
        await window._supabase.from('profiles').update({ balance: (s.balance || 0) + (basePrice * 0.95), total_earnings: (s.total_earnings || 0) + basePrice }).eq('id', providerId);

        alert("COMMANDE ENREGISTRÉE !");
        document.getElementById('details-modal-overlay').classList.remove('open');
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

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
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title), buyer:profiles!buyer_id(full_name)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = `
                <div style="background: white; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size:0.9rem;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 1px solid #f1f5f9; text-align: left;">
                                <th style="padding: 16px; font-weight: 850; color: #64748b;">Client</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b;">Article</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b;">Logistique</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b;">Status</th>
                                <th style="padding: 16px; font-weight: 850; color: #64748b;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(orders || []).length > 0 ? (orders || []).map(o => `
                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 16px;"><div style="font-weight: 950;">${o.buyer?.full_name}</div><div style="font-size:0.7rem; color:#94a3b8;">${o.shipping_city || 'Dématérialisé'}</div></td>
                                    <td style="padding: 16px;"><div style="font-weight: 700;">${o.item?.title}</div><div style="font-weight:900; color:#10b981;">${o.total_price.toFixed(2)}€</div></td>
                                    <td style="padding: 16px;">
                                        <div style="display:flex; gap:8px;">
                                            <input id="tr-${o.id}" value="${o.tracking_number || ''}" placeholder="Suivi #" style="padding:8px; border-radius:8px; border:1.5px solid #e2e8f0; width:110px;">
                                            <button onclick="window.ShowcaseModule.updateTracking('${o.id}')" style="background:#0f172a; color:white; border:none; padding:8px; border-radius:8px; cursor:pointer;">OK</button>
                                        </div>
                                    </td>
                                    <td style="padding: 16px;"><span style="background:${o.status === 'shipped' ? '#dcfce7' : '#fef3c7'}; color:${o.status === 'shipped' ? '#166534' : '#92400e'}; padding:4px 10px; border-radius:99px; font-weight:900; font-size:0.75rem;">${o.status.toUpperCase()}</span></td>
                                    <td style="padding: 16px;"><button onclick="window.ShowcaseModule.generateInvoice('${o.id}')" style="background:#f1f5f9; border:none; padding:10px; border-radius:10px; cursor:pointer;">📄</button></td>
                                </tr>
                            `).join('') : '<tr><td colspan="5" style="padding:60px; text-align:center; color:#94a3b8; font-weight:800;">Aucune nouvelle vente.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            const { data: p } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    <div style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1.5px solid #e2e8f0;">
                         <h4 style="margin-top:0; font-weight:950; margin-bottom:24px;">🔧 Configuration Pro</h4>
                         <div style="margin-bottom:20px;">
                            <label style="font-size:0.7rem; font-weight:900; color:#64748b; text-transform:uppercase;">Taux de Taxe / Octroi (%)</label>
                            <input id="expert-tax" type="number" value="${p?.tax_rate || 0}" style="width: 100%; padding:14px; border-radius:12px; border:2px solid #e2e8f0; margin-top:6px;">
                         </div>
                         <h5 style="font-weight:950; margin-bottom:12px;">Tarifs de Livraison par Zone</h5>
                         <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px;">
                            <div><label style="font-size:0.65rem; font-weight:800;">Locale</label><input id="ship-local" type="number" value="${p?.shipping_rate_local || 0}" style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #e2e8f0;"></div>
                            <div><label style="font-size:0.65rem; font-weight:800;">National</label><input id="ship-nat" type="number" value="${p?.shipping_rate_national || 0}" style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #e2e8f0;"></div>
                            <div><label style="font-size:0.65rem; font-weight:800;">Monde</label><input id="ship-int" type="number" value="${p?.shipping_rate_int || 0}" style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #e2e8f0;"></div>
                         </div>
                         <button onclick="window.ShowcaseModule.saveProConfig()" style="width:100%; background:#0f172a; color:white; border:none; padding:16px; border-radius:16px; font-weight:950; cursor:pointer; margin-top:24px;">Sauvegarder la Logistique</button>
                    </div>
                    <div style="background: white; border-radius: 24px; padding: 32px; border: 1.5px solid #e2e8f0; position:relative;">
                         <h4 style="margin-top:0; font-weight:950; margin-bottom:24px;">🔌 Connecteurs Externes</h4>
                         <div style="padding:20px; background:#f1f5f9; border-radius:16px; margin-bottom:16px;">
                            <div style="font-weight:900; font-size:0.85rem;">Connecter AfterShip</div>
                            <div style="font-size:0.75rem; color:#64748b;">Automatisez le suivi en temps réel via API.</div>
                            <button onclick="alert('Module AfterShip prochainement disponible (Clé API requise)')" style="background:#0f172a; color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:900; font-size:0.75rem; margin-top:12px; cursor:pointer;">Configurer</button>
                         </div>
                         <div style="padding:20px; background:#f1f5f9; border-radius:16px;">
                            <div style="font-weight:900; font-size:0.85rem;">Email PayPal</div>
                            <input id="pp-email" value="${p?.paypal_email || ''}" placeholder="Paiement@email.com" style="width:100%; padding:12px; border-radius:10px; border:1.5px solid #e2e8f0; margin-top:8px;">
                         </div>
                    </div>
                </div>
            `;
        }
    },

    async saveProConfig() {
        const payload = {
            tax_rate: parseFloat(document.getElementById('expert-tax').value || 0),
            shipping_rate_local: parseFloat(document.getElementById('ship-local').value || 0),
            shipping_rate_national: parseFloat(document.getElementById('ship-nat').value || 0),
            shipping_rate_int: parseFloat(document.getElementById('ship-int').value || 0),
            paypal_email: document.getElementById('pp-email').value.trim()
        };
        const { data: { session } } = await window._supabase.auth.getSession();
        await window._supabase.from('profiles').update(payload).eq('id', session.user.id);
        alert("Configuration Logistique & Fiscale OK !");
    },

    async updateTracking(orderId) {
        const tr = document.getElementById(`tr-${orderId}`).value;
        await window._supabase.from('showcase_orders').update({ tracking_number: tr, status: 'shipped' }).eq('id', orderId);
        alert("Commande mise à jour en 'Expédiée'.");
    },

    async generateInvoice(orderId) {
        try {
            const { data: o } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(*), buyer:profiles!buyer_id(*), provider:profiles!provider_id(*)`).eq('id', orderId).single();
            const tax = o.tax_amount || 0;
            const sub = o.total_price - tax;
            const html = `<html><head><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Plus Jakarta Sans',sans-serif;padding:60px;max-width:800px;margin:0 auto;color:#020617;}.header{display:flex;justify-content:space-between;border-bottom:2px solid #f1f5f9;padding-bottom:32px;}.logo{font-size:1.2rem;font-weight:900;color:#0070ba;}.invoice-title{font-size:3rem;font-weight:950;text-transform:uppercase;margin:0;}.addresses{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:60px;}.label{font-size:0.7rem;font-weight:900;color:#64748b;text-transform:uppercase;margin-bottom:8px;}.total-card{background:#020617;color:white;padding:32px;border-radius:24px;width:300px;margin-left:auto;margin-top:40px;}table{width:100%;border-collapse:collapse;margin-top:40px;}th{text-align:left;background:#f8fafc;padding:16px;color:#64748b;font-size:0.8rem;}td{padding:16px;border-bottom:1px solid #f1f5f9;}</style></head><body>
                <div class="header"><div class="logo">DOMTOM CONNECT | SHOWCASE</div><div style="text-align:right;"><h1 class="invoice-title">Facture</h1><div style="font-weight:900;">${o.invoice_number}</div></div></div>
                <div class="addresses">
                    <div><div class="label">Vendeur</div><div style="font-weight:900;">${o.provider?.full_name}</div><div>${o.provider?.paypal_email}</div></div>
                    <div><div class="label">Client & Livraison</div><div style="font-weight:900;">${o.shipping_name || o.buyer?.full_name}</div><div>${o.shipping_address || 'Service dématérialisé'}<br>${o.shipping_zip || ''} ${o.shipping_city || ''}</div></div>
                </div>
                <table><thead><tr><th>Désignation</th><th style="text-align:right;">Total TTC</th></tr></thead><tbody><tr><td><div style="font-weight:900;">${o.item?.title}</div><div style="font-size:0.8rem;color:#64748b;">ID: ${o.id.substring(0,8)}</div></td><td style="text-align:right;font-weight:900;">${o.total_price.toFixed(2)}€</td></tr></tbody></table>
                <div class="total-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px;color:#94a3b8;"><span>HT</span><span>${sub.toFixed(2)}€</span></div><div style="display:flex;justify-content:space-between;margin-bottom:16px;color:#94a3b8;"><span>TVA / Taxes</span><span>${tax.toFixed(2)}€</span></div><div style="display:flex;justify-content:space-between;font-size:1.6rem;font-weight:950;border-top:1px solid #334155;padding-top:16px;"><span>TOTAL</span><span>${o.total_price.toFixed(2)}€</span></div></div>
                <div style="margin-top:60px;text-align:center;font-size:0.7rem;color:#94a3b8;">Document généré par Domtom Connect - Preuve d'achat électronique.</div>
            </body></html>`;
            const win = window.open('','_blank'); win.document.write(html); win.document.close(); setTimeout(()=>win.print(),800);
        } catch(e){alert(e.message);}
    },

    async openItemModal(item = null) {
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 550px; border-radius: 40px; padding: 48px; max-height: 90vh; overflow-y: auto; font-family: 'Plus Jakarta Sans', sans-serif;">
                <h2 style="font-weight: 950; margin-bottom: 24px; letter-spacing: -0.04em;">${item ? 'Modifier l\'offre' : 'Nouvelle Offre'}</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <input id="item-id" type="hidden" value="${item?.id || ''}">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div><label style="font-size: 0.7rem; font-weight: 850; color: #64748b;">CATÉGORIE</label><select id="item-category" style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;"><option value="service" ${item?.category === 'service' ? 'selected' : ''}>Service</option><option value="product" ${item?.category === 'product' ? 'selected' : ''}>Produit</option></select></div>
                        <div><label style="font-size: 0.7rem; font-weight: 850; color: #64748b;">UNITÉ</label><input id="item-unit" value="${item?.unit || ''}" placeholder="ex: heure" style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;"></div>
                    </div>
                    <input id="item-title" value="${item?.title || ''}" placeholder="Titre de l'offre..." style="width: 100%; padding: 16px; border-radius: 14px; border: 2.5px solid #e2e8f0; font-weight: 700;">
                    <textarea id="item-desc" placeholder="Description..." style="width: 100%; min-height: 120px; padding: 16px; border-radius: 14px; border: 2.5px solid #e2e8f0; font-family: inherit;">${item?.description || ''}</textarea>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div><label style="font-size: 0.7rem; font-weight: 850; color: #64748b;">PRÉFIXE</label><input id="item-prefix" value="${item?.price_prefix || 'À partir de'}" style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;"></div>
                        <div><label style="font-size: 0.7rem; font-weight: 850; color: #64748b;">PRIX (€)</label><input id="item-price" type="number" value="${item?.price || ''}" style="width: 100%; padding: 14px; border-radius: 12px; border: 2.5px solid #e2e8f0; font-weight: 700;"></div>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 16px;"><label style="font-size: 0.7rem; font-weight: 850;">IMAGE</label><input id="item-file" type="file"></div>
                    <button onclick="window.ShowcaseModule.saveItem()" style="background: #0f172a; color: white; border: none; padding: 20px; border-radius: 18px; font-weight: 950; cursor: pointer; font-size: 1.1rem;">ENREGISTRER</button>
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="color: #64748b; background: none; border: none; cursor: pointer; font-weight: 800;">Annuler</button>
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
                user_id: session.user.id, title: document.getElementById('item-title').value,
                description: document.getElementById('item-desc').value, price: parseFloat(document.getElementById('item-price').value),
                price_prefix: document.getElementById('item-prefix').value, unit: document.getElementById('item-unit').value,
                category: document.getElementById('item-category').value, status: 'active'
            };
            const fileInput = document.getElementById('item-file');
            if (fileInput.files[0]) {
                const fn = `showcase/${session.user.id}/${Date.now()}`;
                await window._supabase.storage.from('showcase').upload(fn, fileInput.files[0]);
                const { data } = window._supabase.storage.from('showcase').getPublicUrl(fn);
                payload.image_url = data.publicUrl;
            }
            if (itemId) await window._supabase.from('showcase_items').update(payload).eq('id', itemId);
            else await window._supabase.from('showcase_items').insert(payload);
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if(confirm("Supprimer ?")) {
            await window._supabase.from('showcase_items').delete().eq('id', id);
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        }
    },

    async requestPayout() {
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: p } = await window._supabase.from('profiles').select('balance, paypal_email').eq('id', session.user.id).single();
        if(!p.paypal_email || p.balance < 10) return alert("Email PayPal manquant ou solde insuffisant.");
        await window._supabase.from('payout_requests').insert({ user_id: session.user.id, amount: p.balance, paypal_email: p.paypal_email, status: 'pending' });
        await window._supabase.from('profiles').update({ balance: 0 }).eq('id', session.user.id);
        alert("Retrait demandé.");
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    }
};

window.ShowcaseModule = ShowcaseModule;
