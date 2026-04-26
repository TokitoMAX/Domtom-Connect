/**
 * Showcase Module - Domtom Connect
 * Version Finale : Focus Catalogue & Design épuré
 * Correction : Réactivation des fonctions Editer/Supprimer/Ajouter.
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
     * DASHBOARD EXPERT
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 650px; margin: 0 auto; color: #000; padding: 40px;">
                    
                    <div style="text-align: center; margin-bottom: 50px;">
                        <div style="font-size: 0.7rem; font-weight: 950; color: #10b981; text-transform: uppercase, letter-spacing: 0.2em; margin-bottom: 10px;">Expert Space</div>
                        <h2 style="font-size: 2.22rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Gestion de Vitrine</h2>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; margin-top: 35px;">
                            <button onclick="ShowcaseModule.openItemModal()" style="width: 100%; background: #000; color: #fff; border: none; padding: 18px; border-radius: 100px; font-weight: 950; cursor: pointer; font-size: 1.05rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">+ Ajouter un Produit Digital</button>
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: transparent; color: #64748b; border: none; padding: 10px; font-weight: 850; cursor: pointer; font-size: 0.9rem; text-decoration: underline;">Voir ma boutique public 🔗</button>
                        </div>
                    </div>

                    <div style="margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 40px;">
                         <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 18px;">
                            ${(!items || items.length === 0) ? `<div style="text-align:center; padding:40px; color:#94a3b8; font-weight:800; font-style:italic;">Aucun produit configuré.</div>` : 
                            items.map(item => `
                                <div style="background: #fff; padding: 18px 24px; border-radius: 100px; border: 2.5px solid #000; display: flex; align-items: center; justify-content: space-between; box-shadow: 5px 5px 0px #000;">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        <div style="font-weight: 950; font-size: 1.1rem; color: #000;">${item.title}</div>
                                        <div style="font-size: 1rem; color: #10b981; font-weight: 950;">${item.price.toFixed(2)}€</div>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; border-radius:100px; width:40px; height:40px; cursor:pointer; font-size:1.1rem;">✏️</button>
                                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; border-radius:100px; width:40px; height:40px; cursor:pointer; font-size:1.1rem;">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                         </div>
                    </div>

                    <div style="margin-top: 100px; text-align: center;">
                        <button onclick="ShowcaseModule.handleTotalReset()" style="background: transparent; color: #e2e8f0; border: none; font-size: 0.65rem; font-weight: 800; cursor: pointer;">Réinitialiser historique</button>
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
            <div style="background: white; width: 100%; max-width: 400px; border-radius: 35px; padding: 40px; border: 4px solid #000; box-shadow: 20px 20px 0px #000; position: relative;">
                <h3 style="margin:0 0 30px 0; font-weight:950; font-size:1.6rem; letter-spacing:-0.05em;">${itemId ? 'Editer l\'offre' : 'Nouvelle offre'}</h3>
                <div style="display:flex; flex-direction:column; gap:25px;">
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:950; text-transform:uppercase; color:#94a3b8; margin-bottom:10px;">Nom de l'offre</label>
                        <input id="modal-item-title" type="text" value="${item.title}" placeholder="ex: Coaching 1h" style="width:100%; padding:16px; border-radius:15px; border:2.5px solid #000; font-weight:800; font-family:'Inter';">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:950; text-transform:uppercase; color:#94a3b8; margin-bottom:10px;">Prix de vente (€)</label>
                        <input id="modal-item-price" type="number" value="${item.price}" style="width:100%; padding:16px; border-radius:15px; border:2.5px solid #000; font-weight:950; font-family:'Inter';">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
                        <button onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:#000; color:#fff; border:none; padding:20px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1rem;">Enregistrer</button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="background:transparent; color:#64748b; border:none; font-weight:850; cursor:pointer; padding:10px;">Annuler</button>
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
        if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

    async editItem(id) {
        this.openItemModal(id);
    },

    /**
     * VITRINE PUBLIQUE
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
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 2.5px solid #000; border-radius: 100px; padding: 18px 24px; cursor: pointer; transition: 0.2s; position: relative; text-align: center; box-shadow: 0 6px 0px #000;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                                <div style="font-weight: 950; font-size: 1.1rem; color: #000;">${item.title}</div>
                                <div style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); font-weight: 950; font-size: 0.9rem;">${item.price.toFixed(2)}€</div>
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
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 45px; padding: 50px; border: 4px solid #000; box-shadow: 25px 25px 0px #000; position: relative; animation: slideUp 0.3s ease;">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 30px; right: 30px; background: #eee; border: 3.5px solid #000; border-radius: 15px; width: 44px; height: 44px; cursor: pointer; font-size: 1.5rem; font-weight: 950;">×</button>
                    <div style="margin-bottom: 35px; text-align:center;">
                        <span style="background: #10b981; color: white; padding: 8px 18px; border-radius: 100px; font-weight: 950; font-size: 0.8rem; letter-spacing:0.05em;">PAIEMENT SECURISE</span>
                        <h2 style="font-size: 2.3rem; font-weight: 950; color: #000; margin: 25px 0 10px 0; letter-spacing:-0.05em;">${item.title}</h2>
                        <div style="font-size: 1.1rem; color: #64748b; font-weight: 650; line-height:1.5;">Accès immédiat garanti après confirmation.</div>
                    </div>
                    <div style="background: #f8fafc; padding: 30px; border-radius: 25px; border: 3px solid #000; margin-bottom: 35px; text-align: center;">
                        <span style="font-size: 2.6rem; font-weight: 950; color: #000;">${item.price.toFixed(2)}€</span>
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
            style: { layout: 'vertical', color: 'black', shape: 'pill', label: 'pay', height: 50 },
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
            alert("✓ Achat réussi !");
            window.location.reload();
        } catch (err) { alert(err.message); }
    },

    async handleTotalReset() {
        if (!confirm("Effacer tout l'historique de test ?")) return;
        const { data: { session } } = await window._supabase.auth.getSession();
        await window._supabase.from('showcase_orders').delete().eq('provider_id', session.user.id);
        await window._supabase.from('profiles').update({ balance: 0, total_earnings: 0, showcase_views: 0 }).eq('id', session.user.id);
        window.location.reload();
    }
};

window.ShowcaseModule = ShowcaseModule;
