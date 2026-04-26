/**
 * Showcase Module - Domtom Connect
 * Version "Mode Normal" : Support de l'upload d'images natif (plus besoin d'URL).
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
                        <div style="font-size: 0.7rem; font-weight: 950; color: #10b981; text-transform: uppercase; letter-spacing: 0.2rem; margin-bottom: 10px;">Expert Space</div>
                        <h2 style="font-size: 2.22rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Gestion de Vitrine</h2>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px; align-items: center; margin-top: 35px;">
                            <button onclick="ShowcaseModule.openItemModal()" style="width: 100%; background: #000; color: #fff; border: none; padding: 20px; border-radius: 100px; font-weight: 950; cursor: pointer; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">+ Ajouter un Produit Digital</button>
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: transparent; color: #64748b; border: none; padding: 10px; font-weight: 850; cursor: pointer; font-size: 0.9rem; text-decoration: underline;">Voir ma boutique public 🔗</button>
                        </div>
                    </div>

                    <!-- STATS CLEAN -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 40px;">
                        <div style="background: #f8fafc; border: 2.5px solid #000; padding: 20px; border-radius: 25px; text-align: center; box-shadow: 4px 4px 0px #000;">
                            <div style="font-size: 0.65rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Solde Net</div>
                            <div style="font-size: 1.6rem; font-weight: 950; color: #000;">0.00€</div>
                        </div>
                        <div style="background: #f8fafc; border: 2.5px solid #000; padding: 20px; border-radius: 25px; text-align: center; box-shadow: 4px 4px 0px #000;">
                            <div style="font-size: 0.65rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Vues</div>
                            <div style="font-size: 1.6rem; font-weight: 950; color: #000;">0</div>
                        </div>
                    </div>

                    <!-- LISTE DES PRODUITS -->
                    <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 18px;">
                        ${(!items || items.length === 0) ? `<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:800; font-style:italic;">Votre vitrine est prête.</div>` : 
                        items.map(item => `
                            <div style="background: #fff; padding: 18px 24px; border-radius: 100px; border: 2.5px solid #000; display: flex; align-items: center; justify-content: space-between; box-shadow: 5px 5px 0px #000;">
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <div style="width:40px; height:40px; background:#f1f5f9; border-radius:10px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                                        ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '📄'}
                                    </div>
                                    <div style="font-weight: 950; font-size: 1.15rem; color: #000;">${item.title}</div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <div style="font-size: 1rem; color: #10b981; font-weight: 950;">${item.price.toFixed(2)}€</div>
                                    <div style="display: flex; gap: 8px;">
                                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; width:40px; height:40px; border-radius:100px; cursor:pointer;">✏️</button>
                                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; width:40px; height:40px; border-radius:100px; cursor:pointer;">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    /**
     * MODAL AVEC UPLOAD IMAGE (MODE NORMAL)
     */
    async openItemModal(itemId = null) {
        let item = { title: '', price: 0, image_url: '' };
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            item = data;
        }

        const overlay = document.getElementById('details-modal-overlay');
        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 400px; border-radius: 40px; padding: 45px; border: 4px solid #000; box-shadow: 20px 20px 0px #000; position: relative;">
                <h3 style="margin:0 0 30px 0; font-weight:950; font-size:1.7rem; letter-spacing:-0.05em; text-align:center;">${itemId ? 'Editer l\'offre' : 'Nouveau bloc'}</h3>
                
                <div style="display:flex; flex-direction:column; gap:25px;">
                    <!-- ZONE UPLOAD IMAGE -->
                    <div style="text-align:center;">
                        <div id="image-preview" style="width:120px; height:120px; background:#f8fafc; border:2.5px dashed #000; border-radius:25px; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:2rem; opacity:0.3;">📸</span>'}
                        </div>
                        <label style="background:#000; color:#fff; padding:10px 20px; border-radius:100px; font-size:0.8rem; font-weight:950; cursor:pointer; display:inline-block;">
                            Choisir une photo
                            <input type="file" id="modal-item-file" style="display:none;" accept="image/*" onchange="ShowcaseModule.handleImagePreview(this)">
                        </label>
                    </div>

                    <input id="modal-item-title" type="text" value="${item.title}" placeholder="Nom du produit" style="width:100%; padding:16px; border-radius:15px; border:2.5px solid #000; font-weight:900;">
                    <input id="modal-item-price" type="number" value="${item.price}" placeholder="Prix (€)" style="width:100%; padding:16px; border-radius:15px; border:2.5px solid #000; font-weight:950;">
                    
                    <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                        <button id="save-item-btn" onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:#000; color:#fff; border:none; padding:20px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1rem;">Confirmer</button>
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="background:transparent; color:#64748b; border:none; font-weight:900; cursor:pointer;">Annuler</button>
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
        btn.innerText = "Téléchargement...";
        btn.disabled = true;

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

            const { error: uploadError } = await window._supabase.storage
                .from('showcase')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
            } else {
                const { data: publicUrlData } = window._supabase.storage
                    .from('showcase')
                    .getPublicUrl(filePath);
                image_url = publicUrlData.publicUrl;
            }
        }

        try {
            const updateData = { title, price };
            if (image_url) updateData.image_url = image_url;

            if (itemId) {
                await window._supabase.from('showcase_items').update(updateData).eq('id', itemId);
            } else {
                await window._supabase.from('showcase_items').insert({ ...updateData, user_id: session.user.id });
            }
            document.getElementById('details-modal-overlay').classList.remove('open');
            this.renderManager(document.getElementById('ecosystem-grid-container'));
        } catch (err) { alert(err.message); }
    },

    async deleteItem(id) {
        if (!confirm("Effacer ce bloc ?")) return;
        await window._supabase.from('showcase_items').delete().eq('id', id);
        this.renderManager(document.getElementById('ecosystem-grid-container'));
    },

    editItem(id) {
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
                    <div style="text-align: center; margin-bottom: 50px; max-width: 450px;">
                        <div style="width: 110px; height: 110px; background: #000; border-radius: 50%; margin: 0 auto 25px; border: 4px solid #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.12); overflow:hidden;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3.5rem; font-weight:950; line-height:110px;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 1.8rem; font-weight: 950; margin: 0; color: #000; letter-spacing: -0.05em;">${provider.full_name}</h1>
                        <p style="font-size: 1.1rem; color: #64748b; font-weight: 750; margin: 10px 0 0 0;">${provider.headline || 'Digital Creator'}</p>
                    </div>
                    <div style="width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 18px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 3px solid #000; border-radius: 100px; padding: 20px 28px; cursor: pointer; transition: 0.25s; position: relative; text-align: center; box-shadow: 0 7px 0px #000;" onmouseover="this.style.transform='translateY(-3px)';" onmouseout="this.style.transform='translateY(0)';">
                                <div style="font-weight: 950; font-size: 1.15rem; color: #000;">${item.title}</div>
                                <div style="position: absolute; right: 28px; top: 50%; transform: translateY(-50%); font-weight: 950; font-size: 1rem;">${item.price.toFixed(2)}€</div>
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
                <div style="background: white; width: 100%; max-width: 480px; border-radius: 50px; padding: 60px; border: 4px solid #000; box-shadow: 25px 25px 0px #000; position: relative;">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="position: absolute; top: 35px; right: 35px; background: #eee; border: 4px solid #000; border-radius: 18px; width: 44px; height: 44px; cursor: pointer; font-size: 1.6rem; font-weight: 950;">×</button>
                    ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:200px; object-fit:cover; border-radius:25px; margin-bottom:20px; border:3px solid #000;">` : ''}
                    <div style="margin-bottom: 40px; text-align:center;">
                        <span style="background: #10b981; color: white; padding: 8px 20px; border-radius: 100px; font-weight: 950; font-size: 0.85rem;">ACHAT SECURISE</span>
                        <h2 style="font-size: 2.6rem; font-weight: 950; color: #000; margin: 20px 0 10px 0;">${item.title}</h2>
                        <div style="font-size: 1.15rem; color: #64748b; font-weight: 700;">Recevez votre produit après paiement.</div>
                    </div>
                    <div style="background: #f8fafc; padding: 35px; border-radius: 30px; border: 3px solid #000; margin-bottom: 40px; text-align: center;">
                        <span style="font-size: 2.8rem; font-weight: 950; color: #000;">${item.price.toFixed(2)}€</span>
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
            style: { layout: 'vertical', color: 'black', shape: 'pill', height: 55 },
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
            alert("✓ Achat complété !");
            window.location.reload();
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
