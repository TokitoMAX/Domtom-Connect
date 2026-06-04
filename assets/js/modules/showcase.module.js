/**
 * Showcase Module - Domtom Connect
 * Version "Marketplace Confiance" : Design Premium & Reversement Pilote.
 */
const ShowcaseModule = {
    COMMISSION_RATE: 0.05,
    PAYPAL_CLIENT_ID: 'sb',

    // Initialisation du SDK PayPal déplacée plus bas pour plus de robustesse.


    /**
     * GLOBAL MARKETPLACE - Discovery Hub (Cross-Expert Solutions)
     */
    async renderMarketplace(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;"><div class="splash-loader" style="margin:0 auto;"></div><p style="margin-top:20px; font-weight:700; color:#64748b;">Exploration du Marketplace...</p></div>`;
        
        try {
            // 1. Fetch all listed showcase items with their provider profiles
            const { data: items, error } = await window._supabase
                .from('showcase_items')
                .select('*, profiles:user_id(full_name, avatar_url, territory, role)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!items || items.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:100px; color:#94a3b8; font-weight:800;">Aucune solution digitale disponible pour le moment.</div>`;
                return;
            }

            // 2. Render Premium Gallery
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; padding: clamp(16px, 4vw, 40px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                    
                    <div style="margin-bottom: 40px;">
                        <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; letter-spacing: -0.06em; margin: 0; color: #0f172a;">Catalogue de Solutions</h2>
                        <p style="color: #64748b; font-weight: 700; font-size: 1.1rem; margin-top: 8px;">Explorez les expertises digitales de notre écosystème.</p>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 32px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: white; border: 1.5px solid #e2e8f0; border-radius: 28px; padding: 24px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; gap: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);" onmouseover="this.style.transform='translateY(-8px)'; this.style.borderColor='#10b981'; this.style.boxShadow='0 20px 40px -10px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.02)';">
                                
                                <div style="width: 100%; aspect-ratio: 16/9; border-radius: 18px; overflow: hidden; background: #f8fafc; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                                    ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'}
                                </div>

                                <div style="flex-grow: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                        <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.02em;">${item.title}</h3>
                                        <div style="font-weight: 950; color: #10b981; font-size: 1.1rem;">${item.price.toFixed(0)}€</div>
                                    </div>
                                    <p style="font-size: 0.9rem; color: #64748b; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.description || 'Solution experte pour votre épopée territoriale.'}</p>
                                </div>

                                <div style="display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1.5px solid #f1f5f9;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: 900;">
                                        ${item.profiles?.avatar_url ? `<img src="${item.profiles.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : (item.profiles?.full_name?.charAt(0) || 'D')}
                                    </div>
                                    <div style="flex-grow: 1;">
                                        <div style="font-size: 0.8rem; font-weight: 800; color: #0f172a;">${item.profiles?.full_name || 'Expert'}</div>
                                        <div style="font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${item.profiles?.territory || 'Antilles'}</div>
                                    </div>
                                    <button style="background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; font-size: 0.75rem; font-weight: 900; cursor: pointer;">Détails</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

        } catch (err) {
            console.error("[ShowcaseModule] Marketplace Render Error:", err);
            container.innerHTML = `<div style="padding:40px; text-align:center; color:#ef4444; font-weight:700;">Erreur lors du chargement du catalogue.</div>`;
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
                            <h2 style="font-size: 2.4rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Mes Solutions & Offres</h2>
                            <p style="color: #64748b; font-weight: 750; margin-top:5px;">Décrivez vos expertises pour attirer de nouveaux clients.</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="ShowcaseModule.openSettings()" style="background:transparent; border:2.5px solid #000; width:48px; height:48px; border-radius:15px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                            </button>
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #000; color: #fff; border: none; padding: 14px 28px; border-radius: 100px; font-weight: 950; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Ajouter une Offre
                            </button>
                        </div>
                    </div>

                    <!-- DASHBOARD FINANCIER (Stripe Connect) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 50px;">
                        <div style="background: #f0fdf4; border: 3px solid #000; padding: 30px; border-radius: 35px; box-shadow: 8px 8px 0px #166534; position:relative;">
                            <div style="font-size: 0.75rem; font-weight: 950; color: #166534; text-transform: uppercase;">Chiffre d'Affaires Net</div>
                            <h3 style="font-size: 2.8rem; font-weight: 950; margin: 15px 0 5px 0;">${(profile.balance || 0).toLocaleString()} €</h3>
                            <div style="background: rgba(16, 185, 129, 0.1); color: #166534; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; justify-content: center;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                Reversement automatique Stripe Connect
                            </div>
                            <p style="font-size: 0.75rem; color: #166534; font-weight: 700; margin-top: 10px; opacity: 0.8;">
                                Vos fonds sont transférés instantanément après chaque vente.
                            </p>
                        </div>
                        <div style="background: #fff; border: 3px solid #000; padding: 30px; border-radius: 35px; box-shadow: 8px 8px 0px #000;">
                            <div style="font-size: 0.75rem; font-weight: 950; color: #94a3b8; text-transform: uppercase;">Visibilité Solutions</div>
                            <div style="font-size: 2.3rem; font-weight: 950; color:#000;">${items?.length || 0} Offres</div>
                            <div style="margin-top:15px; font-size:0.7rem; font-weight:900; color:#94a3b8; text-align:center;">Vos services sont visibles sur votre vitrine publique.</div>
                        </div>
                    </div>

                    <!-- SECTION CATALOGUE -->
                    <h3 style="font-weight:950; font-size:1.4rem; margin-bottom:25px; color:#000;">Mes Piliers de Service</h3>
                    <div id="showcase-items-list" style="display: flex; flex-direction: column; gap: 18px;">
                        ${(!items || items.length === 0) ? `<div style="text-align:center; padding:50px; color:#94a3b8; font-weight:800; font-style:italic; background:#f8fafc; border-radius:30px;">Aucune offre active pour le moment.</div>` : 
                        items.map(item => `
                            <div style="background: #fff; padding: 18px 25px; border-radius: 100px; border: 2.5px solid #000; display: flex; align-items: center; justify-content: space-between; box-shadow: 5px 5px 0px #000;">
                                <div style="display: flex; align-items: center; gap: 20px;">
                                    <div style="width:55px; height:55px; border-radius:15px; border:2.5px solid #000; overflow:hidden; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color: #000;">
                                        ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'}
                                    </div>
                                    <div>
                                        <div style="font-weight: 950; font-size: 1.2rem; color:#000;">${item.title}</div>
                                        <div style="font-size: 1rem; color: #10b981; font-weight: 950;">${item.price.toFixed(2)}€</div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; width:44px; height:44px; border-radius:100px; cursor:pointer; display:flex; align-items:center; justify-content:center; color: #000;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; width:44px; height:44px; border-radius:100px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
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
        const { data: profile } = await window._supabase.from('profiles').select('stripe_connect_id, stripe_account_status, stripe_payouts_enabled').eq('id', session.user.id).single();
        const overlay = document.getElementById('details-modal-overlay');
        
        let statusText = '⚠️ STRIPE NON CONNECTÉ';
        let statusColor = '#f59e0b';
        let statusDesc = 'Votre boutique ne peut pas encore recevoir de paiements.';
        
        if (profile?.stripe_connect_id) {
            if (profile.stripe_payouts_enabled) {
                statusText = '✅ STRIPE OPÉRATIONNEL';
                statusColor = '#10b981';
                statusDesc = 'Votre compte est prêt à recevoir des paiements et virements.';
            } else {
                statusText = '⚠️ COMPTE LIMITÉ';
                statusColor = '#ea580c';
                statusDesc = 'Des informations sont manquantes sur votre compte Stripe.';
            }
        }

        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 420px; border-radius: 40px; padding: 45px; border: 4px solid #000; box-shadow: 20px 20px 0px #000;">
                <h3 style="margin:0 0 25px 0; font-weight:950; font-size:1.8rem; letter-spacing:-0.05em; color:#000;">Status du Compte</h3>
                <p style="font-size:0.95rem; color:#64748b; font-weight:700; margin-bottom:30px; line-height:1.5;">${statusDesc}</p>
                <div style="display:flex; flex-direction:column; gap:25px;">
                    <div style="background: #f8fafc; padding: 20px; border-radius: 20px; border: 2.5px solid #000; text-align: center;">
                        <div style="font-weight: 950; color: ${statusColor}">
                            ${statusText}
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${profile?.stripe_connect_id ? 
                            `<button onclick="window.open('https://dashboard.stripe.com/', '_blank')" style="background:#000; color:#fff; border:none; padding:22px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1.1rem;">Gérer mes fonds sur Stripe</button>` :
                            `<button onclick="window.location.hash = 'business'" style="background:#6366f1; color:#fff; border:none; padding:22px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1.1rem;">Activer Stripe Connect</button>`
                        }
                        <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" style="padding:15px; background:transparent; color:#64748b; border:none; font-weight:900; cursor:pointer;">Fermer</button>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('open');
    },

    async openItemModal(itemId = null) {
        let item = { title: '', price: 0, image_url: '', description: '', price_prefix: 'À partir de', category: 'consulting' };
        if (itemId) {
            const { data } = await window._supabase.from('showcase_items').select('*').eq('id', itemId).single();
            item = data;
        }
        
        let overlay = document.getElementById('details-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'details-modal-overlay';
            // Styling directly or rely on class if it exists
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.5)', zIndex: '999999', display: 'none',
                alignItems: 'center', justifyContent: 'center', padding: '20px'
            });
            document.body.appendChild(overlay);
        }
        
        // Remove .open class and use flex directly to fix display issues
        overlay.style.display = 'flex';

        overlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 40px; padding: 40px; border: 4px solid #000; box-shadow: 15px 15px 0px #000; position:relative; overflow-y:auto; max-height:90vh;">
                <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="position:absolute; top:20px; right:20px; background:#f1f5f9; border:none; width:40px; height:40px; border-radius:50%; font-weight:900; cursor:pointer;">X</button>
                <h3 style="margin:0 0 25px 0; font-weight:950; font-size:1.6rem; letter-spacing:-0.05em; text-align:center; color:#000;">${itemId ? 'Éditer ma solution' : 'Nouvelle solution'}</h3>
                
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="text-align:center;">
                        <div id="image-preview" style="width:120px; height:120px; background:#f8fafc; border:3px dashed #e2e8f0; border-radius:30px; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; overflow:hidden; color: #cbd5e1;">
                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'}
                        </div>
                        <label style="background:#000; color:#fff; padding:10px 20px; border-radius:100px; font-size:0.8rem; font-weight:950; cursor:pointer; display:inline-block;">
                            Photo d'illustration
                            <input type="file" id="modal-item-file" style="display:none;" accept="image/*" onchange="ShowcaseModule.handleImagePreview(this)">
                        </label>
                    </div>

                    <input id="modal-item-title" type="text" value="${item.title}" placeholder="Titre de la solution" style="width:100%; padding:15px; border-radius:15px; border:3px solid #000; font-weight:950; font-size:1rem; font-family:'Inter';">
                    
                    <textarea id="modal-item-description" placeholder="Décrivez votre offre, la valeur ajoutée et le problème que vous résolvez..." style="width:100%; height:100px; padding:15px; border-radius:15px; border:3px solid #000; font-weight:750; font-size:0.9rem; font-family:'Inter'; resize:none;">${item.description || ''}</textarea>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <select id="modal-item-prefix" style="padding:15px; border-radius:15px; border:3px solid #000; font-weight:950; font-family:'Inter'; background:#fff;">
                            <option value="À partir de" ${item.price_prefix === 'À partir de' ? 'selected' : ''}>À partir de</option>
                            <option value="Forfait fixe" ${item.price_prefix === 'Forfait fixe' ? 'selected' : ''}>Forfait fixe</option>
                            <option value="Sur devis" ${item.price_prefix === 'Sur devis' ? 'selected' : ''}>Sur devis</option>
                        </select>
                        <input id="modal-item-price" type="number" value="${item.price}" placeholder="Prix (€)" style="width:100%; padding:15px; border-radius:15px; border:3px solid #000; font-weight:950; font-size:1rem; font-family:'Inter';">
                    </div>
                    
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button id="save-item-btn" onclick="ShowcaseModule.saveItem('${itemId || ''}')" style="background:#000; color:#fff; border:none; padding:20px; border-radius:100px; font-weight:950; cursor:pointer; font-size:1.1rem;">Valider la solution</button>
                        <button onclick="document.getElementById('details-modal-overlay').style.display='none'" style="background:transparent; color:#64748b; border:none; font-weight:900; cursor:pointer; font-size:1rem;">Plus tard</button>
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
        const description = document.getElementById('modal-item-description').value;
        const price_prefix = document.getElementById('modal-item-prefix').value;
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
            const updateData = { title, description, price, price_prefix, status: 'active', category: 'consulting' };
            if (image_url) updateData.image_url = image_url;
            if (itemId) await window._supabase.from('showcase_items').update(updateData).eq('id', itemId);
            else await window._supabase.from('showcase_items').insert({ ...updateData, user_id: session.user.id });
            document.getElementById('details-modal-overlay').style.display = 'none';
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
                        <div style="width: 120px; height: 120px; background: #000; border-radius: 50%; margin: 0 auto 30px; border: 5px solid #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.12); overflow:hidden; position:relative; display: flex; align-items: center; justify-content: center;">
                            ${provider.avatar_url ? `<img src="${provider.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="color:#fff; font-size:3.8rem; font-weight:950;">${provider.full_name?.charAt(0)}</div>`}
                        </div>
                        <h1 style="font-size: 2.2rem; font-weight: 950; margin: 0; color: #000; letter-spacing: -0.06em;">${provider.full_name}</h1>
                        <p style="font-size: 1.15rem; color: #64748b; font-weight: 750; margin: 12px 0 0 0;">Découvrez mes solutions & expertises</p>
                    </div>
                    <div style="width: 100%; max-width: 550px; display: flex; flex-direction: column; gap: 25px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 3px solid #000; border-radius: 30px; padding: 20px 25px; cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; display: flex; align-items: center; gap: 20px; box-shadow: 0 8px 0px #000;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 0px #000';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 0px #000';">
                                <div style="width:60px; height:60px; border-radius:15px; border:3px solid #000; overflow:hidden; background:#f1f5f9; flex-shrink:0; display:flex; align-items:center; justify-content:center; color: #000;">
                                    ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'}
                                </div>
                                <div style="flex-grow:1; text-align:left;">
                                    <div style="font-weight: 950; font-size: 1.25rem; color: #000; letter-spacing:-0.03em;">${item.title}</div>
                                    <div style="font-size: 1rem; color: #64748b; font-weight: 750;">Découvrir l'offre</div>
                                </div>
                                <div style="font-weight: 950; font-size: 1.2rem; color:#10b981;">${item.price_prefix || ''} ${item.price.toFixed(2)}€</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:70px; font-size:0.8rem; font-weight:950; color:#cbd5e1; letter-spacing:0.1em; text-transform:uppercase;">Propulsé par Domtom Connect</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    STRIPE_PK: 'pk_live_51S7DgQAXxC1DBrN4X8cFROt9jCStxExXYMKKgGees4Cpbm7KCncjuV4RSSqK2mV5En2i0XWXkY1Hr8oCYOF9F9dR00HMmrxPYQ',
    SUPABASE_FUNCTIONS_URL: 'https://vlpzmxddgdjjtrpbtksd.supabase.co/functions/v1',

    /**
     * Lance le paiement Stripe via Edge Function
     * Redirige vers Stripe Checkout (page sécurisée hébergée par Stripe)
     */
    /**
     * Lance le paiement Stripe via Edge Function
     * Redirige vers Stripe Checkout (page sécurisée hébergée par Stripe)
     */
    async buyWithStripe(item) {
        const btn = document.getElementById('stripe-buy-btn');
        if (btn) {
            btn.dataset.original = btn.innerHTML;
            btn.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:center; gap:10px;">
                    <div style="width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.6s linear infinite;"></div>
                    Vérification...
                </div>
            `;
            btn.disabled = true;
        }

        try {
            // 1. Vérifier si l'expert a configuré son compte Stripe
            const { data: provider, error: pError } = await window._supabase
                .from('profiles')
                .select('stripe_connect_id, stripe_payouts_enabled, full_name')
                .eq('id', item.user_id)
                .single();

            if (pError || !provider?.stripe_connect_id || !provider?.stripe_payouts_enabled) {
                if (btn) { btn.innerHTML = btn.dataset.original; btn.disabled = false; }
                return alert(`⚠️ Paiement indisponible : ${provider?.full_name || "L'expert"} n'a pas encore finalisé la configuration de son compte de paiement Stripe.`);
            }

            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) {
                if (btn) { btn.innerHTML = btn.dataset.original; btn.disabled = false; }
                return alert("Veuillez vous connecter pour procéder au paiement.");
            }
            
            const response = await fetch(`${this.SUPABASE_FUNCTIONS_URL}/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || ''}`,
                },
                body: JSON.stringify({
                    item_id: item.id,
                    item_title: item.title,
                    item_price: item.price,
                    provider_id: item.user_id,
                    buyer_id: session?.user?.id || null,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.url) {
                throw new Error(data.error || 'Impossible de créer la session de paiement.');
            }

            // Redirection vers Stripe Checkout
            window.location.href = data.url;

        } catch (err) {
            console.error('[Stripe] Erreur:', err);
            if (btn) { btn.innerHTML = btn.dataset.original; btn.disabled = false; }
            
            if (err.message.includes('transfers, crypto_transfers, or legacy_payments') || err.message.includes('stripe_balance.stripe_transfers capability enabled')) {
                alert("⚠️ Ce produit ne peut pas être acheté pour le moment. L'expert n'a pas finalisé la configuration de son compte de paiement (Onboarding Stripe inachevé).");
            } else {
                alert('Erreur : ' + err.message);
            }
        }
    },

    async openPublicItemModal(itemId) {
        if (!itemId || itemId === 'undefined') return;
        try {
            const { data: item, error } = await window._supabase
                .from('showcase_items')
                .select('*, profiles:user_id(role)')
                .eq('id', itemId)
                .single();

            if (error || !item) throw error || new Error("Offre introuvable");

            const isCompany = (item.profiles?.role === 'entreprise');
            this.renderModalWithItem(item, isCompany);
        } catch (err) { 
            console.error("[Showcase] Erreur :", err);
            alert("Erreur : " + err.message);
        }
    },

    renderModalWithItem(item, isCompany) {
        const overlay = document.getElementById('details-modal-overlay');
        if (!overlay) return;

        try {
            const isSubFolder = /marketplace|registration|blog|territoires|services|a-propos|diaspora/.test(window.location.pathname);
            const prefix = window.location.protocol === 'file:' ? (isSubFolder ? '../' : '') : '/';
            
            const styleId = 'showcase-modal-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
                    .showcase-modal-container {
                        display: flex; flex-direction: row; gap: 48px; 
                        background: #ffffff; width: 100%; max-width: 1000px; 
                        border-radius: 32px; border: 1px solid rgba(0,0,0,0.05); 
                        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; 
                        margin: auto; padding: 48px;
                    }
                    .showcase-left { flex: 1; }
                    .showcase-right { flex: 1.2; display: flex; flex-direction: column; justify-content: center; }
                    .showcase-action-btn {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .showcase-action-btn:hover {
                        transform: translateY(-2px);
                    }
                    @media (max-width: 850px) {
                        .showcase-modal-container { flex-direction: column; max-width: 500px; padding: 32px; gap: 32px; border-radius: 24px; }
                        .showcase-left, .showcase-right { width: 100%; flex: none; }
                    }
                `;
                document.head.appendChild(style);
            }

            overlay.innerHTML = `
                <div class="showcase-modal-container">
                    <button onclick="document.getElementById('details-modal-overlay').classList.remove('open')" class="showcase-modal-close">&times;</button>
                    
                    <div class="showcase-left">
                        ${item.image_url ? `
                            <div style="width:100%; aspect-ratio:1; border-radius:24px; overflow:hidden; border:1px solid #e2e8f0; background:#f8fafc; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                                <img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                        ` : `
                            <div style="width:100%; aspect-ratio:1; border-radius:24px; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; background:#f8fafc; color: #cbd5e1;">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                        `}
                    </div>

                    <div class="showcase-right">
                        <div style="margin-bottom:24px;">
                            <span style="background: rgba(16, 185, 129, 0.1); color: #059669; padding: 6px 16px; border-radius: 100px; font-weight: 800; font-size: 0.75rem; letter-spacing:0.05em; display:inline-flex; align-items:center; gap:8px; margin-bottom:20px; text-transform:uppercase;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                ${isCompany ? 'Solution Entreprise' : 'Service Expert'}
                            </span>
                            <h2 style="font-size: 2.2rem; font-weight: 800; color: #111827; margin: 0 0 16px 0; letter-spacing:-0.03em; line-height:1.1;">${item.title}</h2>
                            <p style="font-size: 1.05rem; color: #4b5563; font-weight: 500; line-height:1.6;">${item.description || 'Expertise dédiée à votre projet.'}</p>
                        </div>
                        
                        <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border:1px solid #e2e8f0; margin-bottom: 32px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size: 0.95rem; font-weight: 700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em;">Investissement</span>
                            <span style="font-size: 2.2rem; font-weight: 900; color:#10b981;">${item.price_prefix || ''} ${item.price.toFixed(0)}€</span>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:16px;">
                            <button id="stripe-buy-btn" onclick="ShowcaseModule.buyWithStripe(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="showcase-action-btn" style="background:#10b981; color:#fff; border:none; padding:20px; border-radius:16px; font-weight:800; cursor:pointer; font-size:1.15rem; box-shadow: 0 10px 25px rgba(16,185,129,0.3);">
                                Sécuriser cette offre (${item.price.toFixed(0)}€)
                            </button>

                            <button onclick="window.location.href='${prefix}messages.html?to=${item.user_id}&prefill=${encodeURIComponent(`Bonjour, je souhaiterais commander votre solution &quot;${item.title}&quot; d\\'un montant de ${item.price}€. Pouvez-vous m\\'envoyer un devis ?`)}'" class="showcase-action-btn" style="background:#f1f5f9; color:#334155; border:none; padding:18px; border-radius:16px; font-weight:700; cursor:pointer; font-size:1rem;">
                                Poser une question / Commander
                            </button>
                            
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                                <button onclick="window.location.href='${prefix}marketplace/profile-detail-${isCompany ? 'company' : 'expert'}.html?id=${item.user_id}'" class="showcase-action-btn" style="background:#fff; color:#0f172a; border:1px solid #cbd5e1; padding:14px; border-radius:12px; font-weight:700; cursor:pointer; font-size:0.9rem;">
                                    Voir le Profil
                                </button>
                                <button onclick="window.location.href='${prefix}showcase.html?id=${item.user_id}'" class="showcase-action-btn" style="background:#fff; color:#0f172a; border:1px solid #cbd5e1; padding:14px; border-radius:12px; font-weight:700; cursor:pointer; font-size:0.9rem;">
                                    Vitrine Complète
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.remove('open');
            };

            overlay.classList.add('open');
        } catch (err) { alert(err.message); }
    },

    /**
     * Render the Purchase Button for a specific item
     */
    async renderPaypalBuyButton(item) {
        if (!window.paypal) return;
        
        paypal.Buttons({
            style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'buynow', height: 50 },
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: { value: item.price.toString(), currency_code: 'EUR' },
                        description: `Service: ${item.title}`
                    }]
                });
            },
            onApprove: async (data, actions) => {
                const details = await actions.order.capture();
                await this.handlePurchaseSuccess(item, details);
            },
            onError: (err) => {
                console.error('PayPal Error:', err);
                alert("Erreur lors du paiement. Veuillez réessayer.");
            }
        }).render('#paypal-buy-container');
    },

    /**
     * Handle Purchase Success - Secure DB Update
     */
    async handlePurchaseSuccess(item, details) {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) return alert("Veuillez vous connecter pour valider votre commande.");

            // 1. Create the Order in Supabase
            const { error: orderError } = await window._supabase.from('showcase_orders').insert({
                item_id: item.id,
                buyer_id: session.user.id,
                provider_id: item.user_id,
                total_price: item.price,
                status: 'paid', // Mark as paid ONLY after PayPal success
                paypal_order_id: details.id
            });

            if (orderError) throw orderError;

            // 2. Notify User
            if (window.Swal) {
                Swal.fire({
                    title: 'FÉLICITATIONS !',
                    text: 'Votre commande a été validée. L\'expert a été notifié.',
                    icon: 'success',
                    confirmButtonText: 'Accéder à mes commandes'
                });
            } else {
                alert("✅ Commande validée avec succès !");
            }

            document.getElementById('details-modal-overlay').classList.remove('open');
        } catch (err) {
            console.error("Order Record Error:", err);
            alert("Erreur lors de l'enregistrement de la commande : " + err.message);
        }
    },

    /**
     * Request a Payout
     */
    async requestPayout(currentBalance) {
        if (currentBalance < 50) return alert("Le solde minimum pour un retrait est de 50 €.");
        
        const { value: paypalEmail } = await Swal.fire({
            title: 'Demande de Retrait',
            input: 'email',
            inputLabel: 'Votre adresse PayPal pour le virement',
            inputPlaceholder: 'exemple@gmail.com',
            showCancelButton: true,
            confirmButtonText: 'Confirmer la demande',
            confirmButtonColor: '#000'
        });

        if (!paypalEmail) return;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { error } = await window._supabase.from('payout_requests').insert({
                user_id: session.user.id,
                amount: currentBalance,
                paypal_email: paypalEmail,
                status: 'pending'
            });

            if (error) throw error;

            Swal.fire('Succès', 'Votre demande de retrait a été envoyée. Elle sera traitée sous 48h.', 'success');
            
            // Refresh view
            const container = document.getElementById('vitrine-view');
            this.renderManager(container);
        } catch (err) {
            alert(err.message);
        }
    }
};

window.ShowcaseModule = ShowcaseModule;
