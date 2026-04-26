/**
 * Showcase Module - Domtom Connect
 * Version "Marketplace Confiance" : Design Premium & Reversement Pilote.
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
     * DASHBOARD EXPERT - Hub Financier & Catalogue
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            const { data: pendingPayouts } = await window._supabase.from('payout_requests').select('*').eq('user_id', session.user.id).eq('status', 'pending');
            const hasPending = pendingPayouts && pendingPayouts.length > 0;
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; color: #000; padding: 40px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px;">
                        <div>
                            <h2 style="font-size: 2.4rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Ma Vitrine Expert</h2>
                            <p style="color: #64748b; font-weight: 750; margin-top:5px;">Pilotage Domtom Connect Marketplace.</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="ShowcaseModule.openSettings()" style="background:transparent; border:2.5px solid #000; padding:12px; border-radius:15px; cursor:pointer; font-size:1.1rem;">⚙️</button>
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #000; color: #fff; border: none; padding: 14px 28px; border-radius: 100px; font-weight: 950; cursor: pointer;">+ Ajouter une Offre</button>
                        </div>
                    </div>

                    <!-- DASHBOARD FINANCIER -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 50px;">
                        <div style="background: #f0fdf4; border: 3px solid #000; padding: 30px; border-radius: 35px; box-shadow: 8px 8px 0px #166534; position:relative;">
                            <div style="font-size: 0.75rem; font-weight: 950; color: #166534; text-transform: uppercase;">Argent disponible</div>
                            <div style="font-size: 2.3rem; font-weight: 950; color: #166534;">${(profile?.balance || 0).toFixed(2)}€</div>
                            <button id="payout-btn" onclick="ShowcaseModule.requestPayout()" 
                                ${hasPending ? 'disabled' : ''} 
                                style="margin-top:15px; width:100%; padding:14px; border-radius:100px; border:none; background:${hasPending ? '#94edab' : '#000'}; color:${hasPending ? '#166534' : '#fff'}; font-weight:950; cursor:${hasPending ? 'not-allowed' : 'pointer'}; transition:0.2s;">
                                ${hasPending ? '⌛ Virement en cours...' : 'Demander un virement'}
                            </button>
                            <div style="margin-top:10px; font-size:0.6rem; font-weight:900; color:#15803d; text-align:center;">Email PayPal: ${profile?.paypal_email || 'Non configuré'}</div>
                        </div>
                        <div style="background: #fff; border: 3px solid #000; padding: 30px; border-radius: 35px; box-shadow: 8px 8px 0px #000;">
                            <div style="font-size: 0.75rem; font-weight: 950; color: #94a3b8; text-transform: uppercase;">Total Vendu (Brut)</div>
                            <div style="font-size: 2.3rem; font-weight: 950; color:#000;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                            <div style="margin-top:15px; font-size:0.7rem; font-weight:900; color:#94a3b8; text-align:center;">Frais plateforme (5%) déjà déduits.</div>
                        </div>
                    </div>

                    <!-- SECTION CATALOGUE -->
                    <h3 style="font-weight:950; font-size:1.4rem; margin-bottom:25px; color:#000;">Mes Blocs Boutique</h3>
                    <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 18px;">
                        ${(!items || items.length === 0) ? `<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:800; font-style:italic; background:#f8fafc; border-radius:30px;">Aucune offre active pour le moment.</div>` : 
                        items.map(item => `
                            <div style="background: #fff; padding: 18px 25px; border-radius: 100px; border: 2.5px solid #000; display: flex; align-items: center; justify-content: space-between; box-shadow: 5px 5px 0px #000;">
                                <div style="display: flex; align-items: center; gap: 20px;">
                                    <div style="width:55px; height:55px; border-radius:15px; border:2.5px solid #000; overflow:hidden; background:#f1f5f9; display:flex; align-items:center; justify-content:center;">
                                        ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:1.5rem;">📄</span>'}
                                    </div>
                                    <div>
                                        <div style="font-weight: 950; font-size: 1.2rem; color:#000;">${item.title}</div>
                                        <div style="font-size: 1rem; color: #10b981; font-weight: 950;">${item.price.toFixed(2)}€</div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; width:44px; height:44px; border-radius:100px; cursor:pointer; font-size:1.1rem;">✏️</button>
                                    <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; width:44px; height:44px; border-radius:100px; cursor:pointer; font-size:1.1rem;">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top:80px; text-align:center;">
                         <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background:transparent; border:none; font-weight:900; font-size:0.95rem; text-decoration:underline; cursor:pointer; color:#64748b;">Accéder à ma vitrine publique (Linktree Mode) 🔗</button>
                    </div>

                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async requestPayout() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: profile } = await window._supabase.from('profiles').select('balance, paypal_email').eq('id', session.user.id).single();
            
            if (!profile?.paypal_email) return alert("Veuillez d'abord configurer votre Email PayPal dans les réglages (⚙️).");
            if ((profile?.balance || 0) <= 0) return alert("Votre solde disponible est de 0.00€.");
            
            const amountToPay = profile.balance;
            if (confirm(`Souhaitez-vous demander le virement de ${amountToPay.toFixed(2)}€ vers ${profile.paypal_email} ?`)) {
                // Bloquer le bouton
                const btn = document.getElementById('payout-btn');
                if (btn) { btn.innerText = "Traitement..."; btn.disabled = true; }

                // 1. Créer la demande
                const { error } = await window._supabase.from('payout_requests').insert({
                    user_id: session.user.id,
                    amount: amountToPay,
                    paypal_email: profile.paypal_email,
                    status: 'pending'
                });

                if (error) throw error;

                alert("✓ Votre demande a été enregistrée. Le virement PayPal sera effectué sous 48h ouvrées. Votre solde a été mis à jour.");
                
                // 2. Rafraîchir l'interface
                this.renderManager(document.getElementById('ecosystem-grid-container'));
            }
        } catch (err) { 
            alert("Erreur lors de la demande : " + err.message); 
            const btn = document.getElementById('payout-btn');
            if (btn) { btn.innerText = "Demander un virement"; btn.disabled = false; }
        }
    },

    async openSettings() {
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: profile } = await window._supabase.from('profiles').select('paypal_email').eq('id', session.user.id).single();
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 420px; border-radius: 40px; padding: 45px; border: 4px solid #000; box-shadow: 20px 20px 0px #000;">
                <h3 style="margin:0 0 25px 0; font-weight:950; font-size:1.8rem; letter-spacing:-0.05em; color:#000;">Réglages de Paiement</h3>
                <p style="font-size:0.95rem; color:#64748b; font-weight:700; margin-bottom:30px; line-height:1.5;">Où devons-nous virer vos commissions nettes ?</p>
                <div style="display:flex; flex-direction:column; gap:25px;">
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:950; text-transform:uppercase; color:#94a3b8; margin-bottom:12px;">Votre Email PayPal</label>
                        <input id="modal-paypal-email" type="email" value="${profile?.paypal_email || ''}" placeholder="nom@exemple.com" style="width:100%; padding:18px; border-radius:15px; border:3px solid #000; font-weight:900; font-family:'Inter'; text-align:center;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button onclick="ShowcaseModule.saveSettings()" style="background:#000; color:#fff; border:none; padding:22px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1.1rem;">Enregistrer ces infos</button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="padding:15px; background:transparent; color:#64748b; border:none; font-weight:900; cursor:pointer;">Fermer sans changer</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async saveSettings() {
        const paypal_email = document.getElementById('modal-paypal-email').value;
        const { data: { session } } = await window._supabase.auth.getSession();
        try {
            await window._supabase.from('profiles').update({ paypal_email }).eq('id', session.user.id);
            alert("✓ Vos coordonnées PayPal ont été enregistrées avec succès.");
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async openItemModal(itemId = null) {
        let item = { title: '', price: 0, image_url: '' };
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            item = data;
        }
        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 450px; border-radius: 50px; padding: 50px; border: 4px solid #000; box-shadow: 25px 25px 0px #000;">
                <h3 style="margin:0 0 35px 0; font-weight:950; font-size:1.9rem; letter-spacing:-0.05em; text-align:center; color:#000;">${itemId ? 'Editer votre offre' : 'Nouveau bloc'}</h3>
                
                <div style="display:flex; flex-direction:column; gap:30px;">
                    <div style="text-align:center;">
                        <div id="image-preview" style="width:140px; height:140px; background:#f8fafc; border:3px dashed #e2e8f0; border-radius:30px; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:2.5rem; opacity:0.3;">📸</span>'}
                        </div>
                        <label style="background:#000; color:#fff; padding:12px 25px; border-radius:100px; font-size:0.85rem; font-weight:950; cursor:pointer; display:inline-block;">
                            Choisir une photo pro
                            <input type="file" id="modal-item-file" style="display:none;" accept="image/*" onchange="ShowcaseModule.handleImagePreview(this)">
                        </label>
                    </div>

                    <input id="modal-item-title" type="text" value="${item.title}" placeholder="Nom du produit / service" style="width:100%; padding:20px; border-radius:20px; border:3.5px solid #000; font-weight:950; font-size:1.1rem; text-align:center; font-family:'Inter';">
                    <input id="modal-item-price" type="number" value="${item.price}" placeholder="Prix public (€)" style="width:100%; padding:20px; border-radius:20px; border:3.5px solid #000; font-weight:950; font-size:1.1rem; text-align:center; font-family:'Inter';">
                    
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button id="save-item-btn" onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:#000; color:#fff; border:none; padding:25px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1.2rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Mettre à jour la boutique</button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="background:transparent; color:#64748b; border:none; font-weight:900; cursor:pointer; font-size:1rem;">Retour</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    handleImagePreview(input) {
        const preview = document.getElementById('image-preview');
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = e => {
                preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    async saveItem(itemId) {
        const btn = document.getElementById('save-item-btn');
        btn.innerText = "Téléchargement..."; btn.disabled = true;

        const title = document.getElementById('modal-item-title').value;
        const price = parseFloat(document.getElementById('modal-item-price').value);
        const fileInput = document.getElementById('modal-item-file');
        const { data: { session } } = await window._supabase.auth.getSession();
        
        let image_url = null;
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;
            const { error: uploadError } = await window._supabase.storage.from('showcase').upload(filePath, file);
            if (!uploadError) {
                const { data: publicUrlData } = window._supabase.storage.from('showcase').getPublicUrl(filePath);
                image_url = publicUrlData.publicUrl;
            }
        }
        try {
            const updateData = { title, price };
            if (image_url) updateData.image_url = image_url;
            if (itemId) await window._supabase.from('showcase_items').update(updateData).eq('id', itemId);
            else await window._supabase.from('showcase_items').insert({ ...updateData, user_id: session.user.id });
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if (!confirm("Voulez-vous retirer cette offre ?")) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

    editItem(id) {
        this.openItemModal(id);
    },

    /**
     * VITRINE PUBLIQUE - Linktree Mode
     */
    async renderPublicShowcase(container, providerId) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: provider } = await window._supabase.from('profiles').select('*').eq('id', providerId).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', providerId).order('created_at', { ascending: false });
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; background: #fff; min-height: 100vh; padding: 60px 20px; display: flex; flex-direction: column; align-items: center;">
                    <div style="text-align: center; margin-bottom: 60px; max-width: 450px;">
                        <div style="width: 120px; height: 120px; background: #000; border-radius: 50%; margin: 0 auto 30px; border: 5px solid #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.12); overflow:hidden; position:relative;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3.8rem; font-weight:950; line-height:120px;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 2.2rem; font-weight: 950; margin: 0; color: #000; letter-spacing: -0.06em;">${provider.full_name}</h1>
                        <p style="font-size: 1.15rem; color: #64748b; font-weight: 750; margin: 12px 0 0 0;">${provider.headline || 'Digital Creator pro'}</p>
                    </div>
                    <div style="width: 100%; max-width: 550px; display: flex; flex-direction: column; gap: 25px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 3px solid #000; border-radius: 30px; padding: 20px 25px; cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; display: flex; align-items: center; gap: 20px; box-shadow: 0 8px 0px #000;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 0px #000';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 0px #000';">
                                <div style="width:60px; height:60px; border-radius:15px; border:3px solid #000; overflow:hidden; background:#f1f5f9; flex-shrink:0; display:flex; align-items:center; justify-content:center;">
                                    ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:1.8rem;">📄</span>'}
                                </div>
                                <div style="flex-grow:1; text-align:left;">
                                    <div style="font-weight: 950; font-size: 1.25rem; color: #000; letter-spacing:-0.03em;">${item.title}</div>
                                    <div style="font-size: 1rem; color: #64748b; font-weight: 750;">Détails & Achat</div>
                                </div>
                                <div style="font-weight: 950; font-size: 1.2rem; color:#10b981;">${item.price.toFixed(2)}€</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:70px; font-size:0.8rem; font-weight:950; color:#cbd5e1; letter-spacing:0.1em; text-transform:uppercase;">Propulsé par Domtom Connect</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async openPublicItemModal(itemId) {
        try {
            await this.init();
            const { data: item } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            const overlay = document.getElementById('details-modal-overlay');
            
            const styleId = 'showcase-modal-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
                    .showcase-modal-container {
                        display: flex; flex-direction: row; gap: 40px; 
                        background: #fff; width: 100%; max-width: 950px; 
                        border-radius: 60px; border: 4px solid #000; 
                        box-shadow: 25px 25px 0px #000; position: relative; 
                        margin: 20px; overflow: hidden; padding: 40px;
                    }
                    .showcase-left { flex: 1.1; }
                    .showcase-right { flex: 0.9; display: flex; flex-direction: column; justify-content: center; }
                    @media (max-width: 850px) {
                        .showcase-modal-container { flex-direction: column; max-width: 500px; padding: 30px; gap: 25px; border-radius: 40px; }
                        .showcase-left, .showcase-right { width: 100%; flex: none; }
                    }
                `;
                document.head.appendChild(style);
            }

            overlay.innerHTML = `
                <div class="showcase-modal-container">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 25px; right: 25px; background: #fff; border: 3px solid #000; border-radius: 100px; width: 40px; height: 40px; cursor: pointer; font-size: 1.4rem; font-weight: 950; display:flex; align-items:center; justify-content:center; z-index:20; box-shadow: 4px 4px 0px #000;">×</button>
                    
                    <div class="showcase-left">
                        ${item.image_url ? `
                            <div style="width:100%; aspect-ratio:1; border-radius:35px; overflow:hidden; border:3.5px solid #000; background:#f8fafc; box-shadow: 10px 10px 0px #f1f5f9;">
                                <img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                        ` : `
                            <div style="width:100%; aspect-ratio:1; border-radius:35px; border:3.5px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; background:#f8fafc;">
                                <span style="font-size:4rem; opacity:0.1;">📸</span>
                            </div>
                        `}
                    </div>

                    <div class="showcase-right">
                        <div style="margin-bottom:20px;">
                            <span style="background: #10b981; color: white; padding: 6px 18px; border-radius: 100px; font-weight: 950; font-size: 0.7rem; letter-spacing:0.05em; border:2.5px solid #000; display:inline-block; margin-bottom:20px;">🔒 PAIEMENT SECURISE</span>
                            <h2 style="font-size: 2.8rem; font-weight: 950; color: #000; margin: 0 0 10px 0; letter-spacing:-0.06em; line-height:0.9;">${item.title}</h2>
                            <p style="font-size: 1rem; color: #64748b; font-weight: 750; margin:0;">Propulsé par Domtom Connect Marketplace.</p>
                        </div>
                        
                        <div style="background: #000; padding: 25px; border-radius: 30px; margin-bottom: 25px; text-align: center; color:#fff;">
                            <span style="font-size: 3.2rem; font-weight: 950;">${item.price.toFixed(2)}€</span>
                        </div>

                        <div id="paypal-button-container-showcase" style="min-height:150px; margin-bottom:15px;"></div>

                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="background:transparent; color:#94a3b8; border:none; padding:10px; font-weight:900; cursor:pointer; font-size:0.9rem; text-decoration:underline; width:fit-content; margin:0 auto;">Annuler l'opération</button>
                    </div>
                </div>
            `;
            
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.remove('open');
            };

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
                transaction_id: p.paypalId, status: 'paid'
            });
            alert("✓ Achat réussi ! Votre produit est disponible.");
            window.location.reload();
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
