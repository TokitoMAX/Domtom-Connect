/**
 * Domtom Connect - Business Module
 * Aligné sur le schéma réel: expert_id, doc_type, items (JSONB), subtotal, total_amount
 */
const BusinessModule = {
    commissionRate: 0.125, // 12.5%
    activeTab: 'quotes',

    renderDashboard: async (container) => { await BusinessModule.renderView(container); },

    renderView: async (container) => {
        if (!container) return;
        BusinessModule.activeTab = localStorage.getItem('dtc_business_tab') || 'quotes';

        container.innerHTML = `
            <div style="padding: clamp(20px, 4vw, 40px); font-family: 'Plus Jakarta Sans', sans-serif; background: #fafafa; min-height: 100vh;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; flex-wrap:wrap; gap:20px;">
                    <div>
                        <h1 style="font-size:2.2rem; font-weight:950; color:#020617; letter-spacing:-0.05em; margin:0;">Pilotage d'Activité</h1>
                        <p style="color:#64748b; font-weight:600; margin-top:8px;">Gérez vos devis, factures et suivi territorial.</p>
                    </div>
                    <button onclick="BusinessModule.openDocEditor('quote')" style="background:#020617; color:white; border:none; padding:16px 32px; border-radius:14px; font-weight:950; cursor:pointer; font-family:inherit;">+ Créer un Devis</button>
                </div>

                <div style="background:white; border-radius:24px; border:1px solid #e2e8f0; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.03);">
                    <div style="display:flex; gap:32px; border-bottom:2px solid #f1f5f9; margin-bottom:32px;">
                        <button id="tab-quotes" onclick="BusinessModule.switchTab('quotes')" style="border:none; background:none; padding:12px 0; font-weight:950; font-size:1rem; cursor:pointer; font-family:inherit; border-bottom:3px solid ${BusinessModule.activeTab === 'quotes' ? '#10b981' : 'transparent'}; color:${BusinessModule.activeTab === 'quotes' ? '#020617' : '#94a3b8'}; margin-bottom:-2px;">Devis & Contrats</button>
                        <button id="tab-invoices" onclick="BusinessModule.switchTab('invoices')" style="border:none; background:none; padding:12px 0; font-weight:950; font-size:1rem; cursor:pointer; font-family:inherit; border-bottom:3px solid ${BusinessModule.activeTab === 'invoices' ? '#10b981' : 'transparent'}; color:${BusinessModule.activeTab === 'invoices' ? '#020617' : '#94a3b8'}; margin-bottom:-2px;">Factures</button>
                    </div>
                    <div id="business-dynamic-content"></div>
                </div>
            </div>
        `;

        await BusinessModule.switchTab(BusinessModule.activeTab);
    },

    switchTab: async (tabId) => {
        BusinessModule.activeTab = tabId;
        localStorage.setItem('dtc_business_tab', tabId);

        // Update tab styles
        ['quotes', 'invoices'].forEach(t => {
            const btn = document.getElementById(`tab-${t}`);
            if (!btn) return;
            const active = t === tabId;
            btn.style.borderBottom = `3px solid ${active ? '#10b981' : 'transparent'}`;
            btn.style.color = active ? '#020617' : '#94a3b8';
            btn.style.marginBottom = '-2px';
        });

        const content = document.getElementById('business-dynamic-content');
        if (!content) return;
        content.innerHTML = `<div style="text-align:center;padding:60px;"><span class="loader"></span></div>`;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Non connecté");

            const docType = tabId === 'quotes' ? 'quote' : 'invoice';
            const { data, error } = await window._supabase
                .from('business_docs')
                .select('*')
                .eq('expert_id', session.user.id)
                .eq('doc_type', docType)
                .order('created_at', { ascending: false });

            if (error) throw error;
            BusinessModule.renderList(content, data || []);
        } catch (err) {
            content.innerHTML = `<div style="padding:32px;background:#fef2f2;border-radius:16px;border:1px solid #fecaca;color:#dc2626;font-weight:800;">Erreur: ${err.message}</div>`;
        }
    },

    renderList: (container, data) => {
        if (!data.length) {
            container.innerHTML = `
                <div style="text-align:center;padding:80px;border:2px dashed #e2e8f0;border-radius:20px;">
                    <div style="font-size:2.5rem;margin-bottom:16px;">📄</div>
                    <p style="font-weight:800;color:#64748b;margin:0;">Aucun document. Créez votre premier devis.</p>
                </div>`;
            return;
        }

        container.innerHTML = `
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                        <th style="padding:12px 16px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:left;">Réf</th>
                        <th style="padding:12px 16px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:left;">Client</th>
                        <th style="padding:12px 16px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:left;">Statut</th>
                        <th style="padding:12px 16px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:right;">Total HT</th>
                        <th style="padding:12px 16px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:right;">Net Expert</th>
                        <th style="padding:12px 16px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:right;"></th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(doc => {
                        const net = (doc.total_amount || 0) * (1 - BusinessModule.commissionRate);
                        const statusColors = { draft: '#64748b', sent: '#2563eb', paid: '#059669', cancelled: '#dc2626' };
                        const statusLabels = { draft: 'Brouillon', sent: 'Envoyé', paid: 'Payé', cancelled: 'Annulé' };
                        return `
                        <tr style="border-bottom:1px solid #f8fafc;" onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background=''">
                            <td style="padding:16px;">
                                <div style="font-weight:900;color:#020617;">#${doc.id.slice(0,8).toUpperCase()}</div>
                                <div style="font-size:0.75rem;color:#94a3b8;">${new Date(doc.created_at).toLocaleDateString()}</div>
                            </td>
                            <td style="padding:16px;">
                                <div style="font-weight:800;color:#020617;">${doc.client_name}</div>
                                <div style="font-size:0.8rem;color:#64748b;">${doc.project_title}</div>
                            </td>
                            <td style="padding:16px;">
                                <span style="background:${statusColors[doc.status]}20;color:${statusColors[doc.status]};font-size:0.65rem;font-weight:950;text-transform:uppercase;padding:4px 10px;border-radius:100px;">${statusLabels[doc.status] || doc.status}</span>
                            </td>
                            <td style="padding:16px;text-align:right;font-weight:950;color:#020617;">${(doc.total_amount||0).toFixed(2)} €</td>
                            <td style="padding:16px;text-align:right;font-weight:950;color:#10b981;">${net.toFixed(2)} €</td>
                            <td style="padding:16px;text-align:right;">
                                <button onclick="BusinessModule.copySignatureLink('${doc.id}')" style="background:#f1f5f9;border:none;padding:8px 14px;border-radius:8px;font-weight:800;cursor:pointer;font-size:0.75rem;">Lien Signature</button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    },

    copySignatureLink: (id) => {
        const url = `${window.location.origin}/view-document.html?id=${id}`;
        navigator.clipboard.writeText(url).catch(() => prompt('Copiez ce lien:', url));
        alert('Lien de signature copié ! Envoyez-le à votre client.');
    },

    openDocEditor: (type = 'quote') => {
        const container = document.getElementById('business-dynamic-content');
        container.innerHTML = `
            <div style="background:#f8fafc;border-radius:20px;border:2px dashed #cbd5e1;padding:40px;">
                <h3 style="font-weight:950;color:#020617;font-size:1.5rem;margin-bottom:28px;">Nouveau Devis</h3>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
                    <div>
                        <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Titre de la mission *</label>
                        <input id="doc-title" type="text" placeholder="Ex: Audit marketing territorial" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;background:white;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Nom du client *</label>
                        <input id="doc-client" type="text" placeholder="Ex: Mairie de Fort-de-France" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;background:white;box-sizing:border-box;">
                    </div>
                </div>

                <!-- Lignes de prestation -->
                <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:24px;margin-bottom:24px;">
                    <div style="display:grid;grid-template-columns:3fr 1fr 1fr auto;gap:12px;margin-bottom:12px;">
                        <div style="font-size:0.7rem;font-weight:950;color:#94a3b8;text-transform:uppercase;">Description</div>
                        <div style="font-size:0.7rem;font-weight:950;color:#94a3b8;text-transform:uppercase;">Qté</div>
                        <div style="font-size:0.7rem;font-weight:950;color:#94a3b8;text-transform:uppercase;">Prix (€)</div>
                        <div></div>
                    </div>
                    <div id="items-container"></div>
                    <button onclick="BusinessModule.addLine()" style="background:#f1f5f9;border:none;padding:10px 20px;border-radius:10px;font-weight:800;cursor:pointer;margin-top:12px;font-family:inherit;">+ Ajouter une ligne</button>
                </div>

                <!-- Totaux -->
                <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:24px;margin-bottom:24px;text-align:right;">
                    <div style="font-size:0.75rem;color:#94a3b8;font-weight:900;text-transform:uppercase;margin-bottom:8px;">Total HT</div>
                    <div id="total-ht" style="font-size:2rem;font-weight:950;color:#020617;">0,00 €</div>
                    <div id="net-expert" style="font-size:0.9rem;font-weight:800;color:#10b981;margin-top:4px;">Net Expert (après 12.5% DTC): 0,00 €</div>
                </div>

                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button onclick="BusinessModule.switchTab('quotes')" style="padding:14px 28px;border-radius:12px;border:1.5px solid #e2e8f0;background:white;font-weight:900;cursor:pointer;font-family:inherit;">Annuler</button>
                    <button onclick="BusinessModule.saveDoc('${type}')" id="save-btn" style="padding:14px 28px;border-radius:12px;background:#020617;color:white;border:none;font-weight:950;cursor:pointer;font-family:inherit;">Enregistrer le Devis</button>
                </div>
            </div>`;

        BusinessModule.addLine(); // Première ligne par défaut
    },

    addLine: () => {
        const container = document.getElementById('items-container');
        const lineId = Date.now();
        const div = document.createElement('div');
        div.id = `line-${lineId}`;
        div.style = 'display:grid;grid-template-columns:3fr 1fr 1fr auto;gap:12px;margin-bottom:10px;align-items:center;';
        div.innerHTML = `
            <input type="text" placeholder="Description de la prestation..." style="padding:12px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:600;" class="item-desc">
            <input type="number" value="1" min="1" style="padding:12px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:600;" class="item-qty" oninput="BusinessModule.recalculate()">
            <input type="number" value="0" min="0" step="0.01" style="padding:12px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:600;" class="item-price" oninput="BusinessModule.recalculate()">
            <button onclick="document.getElementById('line-${lineId}').remove(); BusinessModule.recalculate();" style="background:none;border:none;color:#ef4444;font-size:1.3rem;cursor:pointer;padding:0 8px;">×</button>`;
        container.appendChild(div);
    },

    recalculate: () => {
        let total = 0;
        document.querySelectorAll('#items-container > div').forEach(line => {
            const qty = parseFloat(line.querySelector('.item-qty')?.value) || 0;
            const price = parseFloat(line.querySelector('.item-price')?.value) || 0;
            total += qty * price;
        });
        const net = total * (1 - BusinessModule.commissionRate);
        const htEl = document.getElementById('total-ht');
        const netEl = document.getElementById('net-expert');
        if (htEl) htEl.textContent = total.toFixed(2) + ' €';
        if (netEl) netEl.textContent = `Net Expert (après 12.5% DTC): ${net.toFixed(2)} €`;
        return total;
    },

    async saveDoc(type) {
        const btn = document.getElementById('save-btn');
        const title = document.getElementById('doc-title')?.value?.trim();
        const client = document.getElementById('doc-client')?.value?.trim();

        if (!title || !client) { alert('Remplissez le titre et le nom du client.'); return; }

        btn.disabled = true;
        btn.textContent = 'Enregistrement...';

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Non connecté");

            // Collecter les lignes
            const items = [];
            document.querySelectorAll('#items-container > div').forEach(line => {
                const desc = line.querySelector('.item-desc')?.value || '';
                const qty = parseFloat(line.querySelector('.item-qty')?.value) || 1;
                const price = parseFloat(line.querySelector('.item-price')?.value) || 0;
                if (desc || price > 0) items.push({ description: desc, qty, price, total: qty * price });
            });

            const subtotal = items.reduce((acc, i) => acc + i.total, 0);
            const commission = subtotal * BusinessModule.commissionRate;

            const { error } = await window._supabase.from('business_docs').insert({
                expert_id: session.user.id,
                project_title: title,
                client_name: client,
                doc_type: type,
                status: 'draft',
                items: JSON.stringify(items),
                subtotal: subtotal,
                commission_rate: BusinessModule.commissionRate * 100,
                commission_amount: commission,
                total_amount: subtotal,
                currency: 'EUR'
            });

            if (error) throw error;
            await BusinessModule.switchTab('quotes');
        } catch (err) {
            alert('Erreur: ' + err.message);
            btn.disabled = false;
            btn.textContent = 'Enregistrer le Devis';
        }
    }
};

window.BusinessModule = BusinessModule;
