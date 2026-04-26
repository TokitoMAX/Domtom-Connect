/**
 * Showcase Module - Domtom Connect
 * Hub de Conversion "Lia" (Stan Store & Linktree Style)
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
     * DASHBOARD CENTRAL - 3 ESPACES DISTINCTS
     */
    async renderManager(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:100px;background:#fff;"><span class="loader"></span></div>`;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await this.recalculateBalance(session.user.id);
            const { data: profile } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; color: #020617; padding: 20px;">
                    
                    <!-- HEADER SIMPLE -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; background: #fff; padding: 10px 0;">
                        <div>
                            <h2 style="font-size: 1.8rem; font-weight: 950; letter-spacing: -0.06em; margin: 0;">Lia Hub</h2>
                            <p style="color: #64748b; font-weight: 700; font-size: 0.9rem; margin:0;">Éditez votre vitrine stan-style.</p>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="window.open('showcase.html?id=${session.user.id}', '_blank')" style="background: #f8fafc; color: #000; border: 1.5px solid #000; padding: 10px 18px; border-radius: 100px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">Aperçu 🔗</button>
                            <button onclick="ShowcaseModule.openItemModal()" style="background: #000; color: #fff; border: none; padding: 10px 22px; border-radius: 100px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">+ Ajouter un Bloc</button>
                        </div>
                    </div>

                    <!-- NAVIGATION 3 ONGLETS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 30px; background: #f8fafc; padding: 5px; border-radius: 100px; width: fit-content;">
                        <button onclick="ShowcaseModule.switchTab('vitrine')" id="tab-vitrine" style="padding: 10px 22px; border: none; background: white; color: #000; border-radius: 100px; font-size: 0.8rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">Ma Vitrine</button>
                        <button onclick="ShowcaseModule.switchTab('sales')" id="tab-sales" style="padding: 10px 22px; border: none; background: transparent; color: #64748b; border-radius: 100px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">Mes Revenus</button>
                        <button onclick="ShowcaseModule.switchTab('config')" id="tab-config" style="padding: 10px 22px; border: none; background: transparent; color: #64748b; border-radius: 100px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">Réglages</button>
                    </div>

                    <div id="showcase-content-area">${this.renderLocalGrid(items)}</div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    renderLocalGrid(items) {
        return `<div style="display: flex; flex-direction: column; gap: 12px;">
            ${(items || []).map(item => `
                <div style="background: white; border: 1px solid #f1f5f9; padding: 18px; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width:45px; height:45px; background:#f8fafc; border-radius:12px; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid #f1f5f9;">
                            ${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '📄'}
                        </div>
                        <div>
                            <div style="font-weight: 900; font-size: 1.05rem;">${item.title}</div>
                            <div style="font-size: 0.8rem; color: #64748b; font-weight: 800;">${item.price.toFixed(2)}€ • ${item.views || 0} vues</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="ShowcaseModule.editItem('${item.id}')" style="background:#f1f5f9; border:none; border-radius:10px; width:36px; height:36px; cursor:pointer;">✏️</button>
                        <button onclick="ShowcaseModule.deleteItem('${item.id}')" style="background:#fff1f2; color:#ef4444; border:none; border-radius:10px; width:36px; height:36px; cursor:pointer;">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>`;
    },

    async switchTab(tabName) {
        const contentArea = document.getElementById('showcase-content-area');
        if (!contentArea) return;
        const { data: { session } } = await window._supabase.auth.getSession();
        
        ['tab-vitrine', 'tab-sales', 'tab-config'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.background = 'transparent', el.style.color = '#64748b', el.style.boxShadow = 'none';
        });
        const activeTab = document.getElementById(`tab-${tabName}`);
        if(activeTab) activeTab.style.background = 'white', activeTab.style.color = '#000', activeTab.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';

        if (tabName === 'sales') {
            const { data: profile } = await window._supabase.from('profiles').select('balance, total_earnings, showcase_views').eq('id', session.user.id).single();
            const { data: orders } = await window._supabase.from('showcase_orders').select(`*, item:showcase_items(title)`).eq('provider_id', session.user.id).order('created_at', { ascending: false });
            
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 20px; text-align: center; border: 1.5px solid #bbf7d0;">
                        <div style="font-size: 0.65rem; font-weight: 900; color: #15803d; text-transform: uppercase;">Argent Net</div>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #166534;">${(profile?.balance || 0).toFixed(2)}€</div>
                        <button onclick="ShowcaseModule.requestPayout()" style="margin-top:10px; border:none; background:#166534; color:white; padding:6px 12px; border-radius:8px; font-size:0.7rem; font-weight:900; cursor:pointer;">Virer l'argent</button>
                    </div>
                    <div style="background: #fff; padding: 20px; border-radius: 20px; text-align: center; border: 1.5px solid #f1f5f9;">
                        <div style="font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Volume Brut</div>
                        <div style="font-size: 1.5rem; font-weight: 950;">${(profile?.total_earnings || 0).toFixed(2)}€</div>
                    </div>
                    <div style="background: #020617; padding: 20px; border-radius: 20px; text-align: center; color:white;">
                        <div style="font-size: 0.65rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Visites</div>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #3b82f6;">${profile?.showcase_views || 0}</div>
                    </div>
                </div>

                <div style="background:#fff; border: 1px solid #f1f5f9; border-radius: 20px; overflow:hidden;">
                    <div style="padding: 20px; border-bottom: 1.5px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="margin:0; font-weight:950;">Historique Transactions</h4>
                        <button onclick="ShowcaseModule.handleHardReset()" style="background:#fff1f2; color:#ef4444; border:none; padding:8px 16px; border-radius:10px; font-weight:900; font-size:0.7rem; cursor:pointer;">Vider l'historique 🗑️</button>
                    </div>
                    <div>
                        ${(!orders || orders.length === 0) ? `<div style="padding:40px; text-align:center; color:#94a3b8; font-weight:700;">Aucun flux détecté.</div>` : 
                        orders.map(o => `<div style="padding:15px 20px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                            <div><div style="font-weight:950;">${o.item?.title || 'Vente Directe'}</div><div style="font-size:0.75rem; color:#94a3b8;">${new Date(o.created_at).toLocaleDateString()}</div></div>
                            <div style="font-weight:950; color:#10b981;">+${(o.total_price * 0.95).toFixed(2)}€</div>
                        </div>`).join('')}
                    </div>
                </div>
            `;
        } else if (tabName === 'config') {
            contentArea.innerHTML = `
                <div style="background:#fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px;">
                    <h3 style="margin:0 0 10px 0; font-weight:950;">Réglages Hub</h3>
                    <p style="color:#64748b; font-weight:600; margin-bottom:30px;">Gérez vos intégrations et votre sécurité.</p>
                    
                    <div style="margin-bottom:30px;">
                        <label style="display:block; font-size:0.7rem; font-weight:950; text-transform:uppercase; color:#94a3b8; margin-bottom:8px;">Email PayPal (Réception)</label>
                        <input type="email" value="expert@domtomconnect.com" style="width:100%; padding:14px; border-radius:12px; border:1.5px solid #e2e8f0; font-family:'Inter'; font-weight:700;">
                    </div>

                    <hr style="border:0; border-top:1px solid #f1f5f9; margin:40px 0;">
                    
                    <h4 style="color:#ef4444; font-weight:950; margin-bottom:8px;">Zone de Danger</h4>
                    <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px;">Effacez de force tout l'historique de test de votre Hub Lia.</p>
                    <button onclick="ShowcaseModule.handleHardReset()" style="width:100%; border:none; background:#ef4444; color:white; padding:18px; border-radius:18px; font-weight:950; cursor:pointer;">⚠️ RÉINITIALISER TOUTES LES DONNÉES</button>
                </div>
            `;
        } else {
            const { data: items } = await window._supabase.from('showcase_items').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            contentArea.innerHTML = this.renderLocalGrid(items);
        }
    },

    async handleHardReset() {
        if (!confirm("⚠️ RÉINITIALISATION TOTALE : Cela va forcer la suppression de TOUT l'historique de test. Confirmer ?")) return;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('showcase_orders').delete().match({ provider_id: session.user.id });
            await window._supabase.from('showcase_orders').delete().match({ user_id: session.user.id });
            await window._supabase.from('showcase_orders').delete().match({ expert_id: session.user.id });

            await window._supabase.from('profiles').update({ balance: 0, total_earnings: 0, showcase_views: 0 }).eq('id', session.user.id);
            alert("✓ Nettoyage forcé terminé. Votre compte est à 0.00€.");
            window.location.reload();
        } catch (err) { alert("Le reset a échoué : " + err.message); }
    },

    async recalculateBalance(userId) {
        try {
            const { data: orders } = await window._supabase.from('showcase_orders').select('total_price, commission_amount').eq('provider_id', userId);
            const totalNet = (orders || []).reduce((acc, o) => acc + ((o.total_price || 0) - (o.commission_amount || 0)), 0);
            const totalBrut = (orders || []).reduce((acc, o) => acc + (o.total_price || 0), 0);
            await window._supabase.from('profiles').update({ balance: totalNet, total_earnings: totalBrut }).eq('id', userId);
        } catch (err) { }
    },

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
                        <h1 style="font-size: 1.5rem; font-weight: 900; margin: 0; color: #000;">${provider.full_name}</h1>
                        <p style="font-size: 1rem; color: #64748b; font-weight: 700; margin: 8px 0 0 0;">${provider.headline || 'Expert Coach & Digital Creator'}</p>
                    </div>
                    <div style="width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 16px;">
                        ${items.map(item => `
                            <div onclick="ShowcaseModule.openPublicItemModal('${item.id}')" style="background: #fff; border: 2px solid #000; border-radius: 100px; padding: 18px 24px; cursor: pointer; transition: 0.2s; position: relative; text-align: center; box-shadow: 0 4px 0px #000;" onmouseover="this.style.transform='scale(1.02)';" onmouseout="this.style.transform='scale(1)';">
                                <div style="font-weight: 950; font-size: 1.1rem; color: #000;">${item.title}</div>
                                <div style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); font-weight: 900; font-size: 0.9rem;">${item.price.toFixed(2)}€</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    }
};

window.ShowcaseModule = ShowcaseModule;
