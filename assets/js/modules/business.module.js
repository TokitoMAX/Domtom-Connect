/**
 * Domtom Connect - Business Module (Pro Edition)
 * Flux complet : Devis -> Signature Pad -> Acompte -> Facture
 */
const BusinessModule = {
    // --- Configuration ---
    commissionRate: 0.125, // 12.5% Domtom Connect
    activeTab: 'quotes',
    expertProfile: null,

    // --- Core Routing ---
    renderDashboard: async (container) => {
        await BusinessModule.renderView(container);
    },

    renderView: async (container) => {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center; padding: 100px; font-family: 'Plus Jakarta Sans', sans-serif;"><span class="loader"></span><p style="margin-top:20px; color:#64748b; font-weight:800;">Accès au Centre Pilotage...</p></div>`;
        await BusinessModule.refreshExpertProfile();
        BusinessModule.activeTab = localStorage.getItem('dtc_business_tab') || 'quotes';
        
        container.innerHTML = `
            <div class="business-pro-container" style="padding: clamp(20px, 4vw, 40px); font-family: 'Plus Jakarta Sans', sans-serif; background: #fafafa; min-height: 100vh;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; flex-wrap: wrap; gap: 24px;">
                    <div>
                        <h1 style="font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 950; color: #020617; letter-spacing: -0.05em; margin: 0;">Pilotage d'Activité</h1>
                        <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin-top: 8px;">Gérez vos devis, factures et suivi territorial.</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="BusinessModule.openDocEditor('quote')" class="btn-dtc primary-black">+ Créer un Devis</button>
                    </div>
                </div>

                <!-- Stats -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px;">
                    <div class="stat-card">
                        <span class="stat-label">Revenus Générés</span>
                        <div id="stats-total-revenue" class="stat-value">0,00 €</div>
                        <div class="stat-indicator green">+12.5% vs mois dernier</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Missions Terminées</span>
                        <div id="stats-missions-count" class="stat-value">0</div>
                        <div class="stat-indicator blue">Objectif territorial</div>
                    </div>
                </div>

                <!-- Tabs & Content -->
                <div style="background: white; border-radius: 32px; border: 1px solid #e2e8f0; padding: clamp(20px, 3vw, 40px); box-shadow: 0 20px 50px rgba(0,0,0,0.03);">
                    <div class="tabs-lux" style="display: flex; gap: 40px; margin-bottom: 32px; border-bottom: 2px solid #f1f5f9;">
                        <button class="tab-lux-btn ${BusinessModule.activeTab === 'quotes' ? 'active' : ''}" onclick="BusinessModule.switchTab('quotes')">Devis & Contrats</button>
                        <button class="tab-lux-btn ${BusinessModule.activeTab === 'invoices' ? 'active' : ''}" onclick="BusinessModule.switchTab('invoices')">Factures & Acomptes</button>
                    </div>
                    <div id="business-dynamic-content"></div>
                </div>
            </div>

            <style>
                .btn-dtc { padding: 16px 32px; border-radius: 16px; font-weight: 950; border: none; cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; }
                .btn-dtc.primary-black { background: #020617; color: white; box-shadow: 0 10px 20px rgba(2, 6, 23, 0.15); }
                .stat-card { background: white; padding: 32px; border-radius: 28px; border: 1px solid #e2e8f0; }
                .stat-label { font-size: 0.75rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
                .stat-value { font-size: 2.2rem; font-weight: 950; color: #020617; margin: 12px 0; }
                .tab-lux-btn { background: none; border: none; padding: 16px 0; font-size: 1.1rem; font-weight: 950; color: #94a3b8; cursor: pointer; position: relative; font-family: inherit; }
                .tab-lux-btn.active { color: #020617; }
                .tab-lux-btn.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px; background: #10b981; border-radius: 10px; }
            </style>
        `;
        await BusinessModule.switchTab(BusinessModule.activeTab);
    },

    switchTab: async (tabId) => {
        BusinessModule.activeTab = tabId;
        localStorage.setItem('dtc_business_tab', tabId);
        const content = document.getElementById('business-dynamic-content');
        if (!content) return;
        content.innerHTML = `<div style="text-align:center; padding:60px;"><span class="loader"></span></div>`;
        try {
            const data = await BusinessModule.fetchDocs(tabId === 'quotes' ? 'quote' : 'invoice');
            BusinessModule.renderList(content, data, tabId);
        } catch (err) {
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#ef4444; font-weight:900;">Erreur: ${err.message}</div>`;
        }
    },

    renderList: (container, data, type) => {
        if (!data || data.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:80px; background:#f8fafc; border-radius:24px; border:1px solid #e2e8f0;"><p style="color:#64748b; font-weight:600;">Aucun document trouvé.</p></div>`;
            return;
        }

        container.innerHTML = `
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; min-width:800px;">
                    <thead>
                        <tr style="text-align:left; border-bottom:1.5px solid #f1f5f9;">
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Document</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Client / Projet</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Statut</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Total HT</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950; text-align:right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(doc => `
                            <tr style="border-bottom:1px solid #f8fafc;">
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:950; color:#020617; font-size:1.1rem;">#${doc.id.slice(0,8).toUpperCase()}</div>
                                    <div style="font-size:0.8rem; color:#94a3b8; font-weight:700;">${new Date(doc.created_at).toLocaleDateString()}</div>
                                </td>
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:900; color:#020617;">${doc.client_name}</div>
                                    <div style="font-size:0.8rem; color:#64748b; font-weight:600;">${doc.project_title}</div>
                                </td>
                                <td style="padding:24px 20px;">
                                    <span style="background:#f1f5f9; color:#64748b; font-size:0.65rem; font-weight:950; text-transform:uppercase; padding:6px 14px; border-radius:100px;">${doc.status}</span>
                                </td>
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:950; color:#020617; font-size:1.25rem;">${(doc.total_amount || 0).toFixed(2)} €</div>
                                    <div style="font-size:0.65rem; color:#10b981; font-weight:900; text-transform:uppercase;">Net: ${((doc.total_amount || 0)*(1 - BusinessModule.commissionRate)).toFixed(2)} €</div>
                                </td>
                                <td style="padding:24px 20px; text-align:right;">
                                    <button onclick="BusinessModule.openQuotePortal('${doc.id}')" style="background:#020617; color:white; border:none; padding:8px 16px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.75rem;">LIEN SIGNATURE</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    openQuotePortal: (id) => {
        const url = `${window.location.origin}/view-document.html?id=${id}`;
        navigator.clipboard.writeText(url);
        Swal.fire({ title: 'Lien Copié !', text: 'Le client peut signer ce devis numériquement.', icon: 'success' });
    },

    openDocEditor: (type = 'quote') => {
        const container = document.getElementById('business-dynamic-content');
        container.innerHTML = `
            <div style="background: #f8fafc; border-radius: 32px; border: 2px dashed #cbd5e1; padding: 48px; margin-top: 20px;">
                <h3 style="font-weight:950; color:#020617; font-size:1.8rem; margin-bottom:32px;">Édition du Devis</h3>
                
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:32px; margin-bottom:40px;">
                    <div style="display:flex; flex-direction:column; gap:20px;">
                        <input type="text" id="doc-project-title" placeholder="Titre de la mission..." class="lux-input">
                        <input type="text" id="doc-client-name" placeholder="Nom du client..." class="lux-input">
                    </div>
                    <div style="background:white; border-radius:24px; padding:24px; border:1.5px solid #e2e8f0; display:flex; flex-direction:column; justify-content:center; text-align:center;">
                        <input type="number" id="doc-total-amount" placeholder="Montant Total HT (€)" class="lux-input" style="font-size:1.8rem; font-weight:950; text-align:center; color:#10b981;" onchange="BusinessModule.updateNetPreview()">
                        <div id="net-preview" style="font-size:0.75rem; font-weight:900; color:#94a3b8; margin-top:12px; text-transform:uppercase;">NET EXPERT: 0.00 €</div>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:16px;">
                    <button onclick="BusinessModule.switchTab('quotes')" style="padding:18px 40px; border-radius:18px; border:2px solid #f1f5f9; font-weight:950; cursor:pointer;">Annuler</button>
                    <button onclick="BusinessModule.saveDoc('${type}')" class="btn-dtc primary-black" id="save-doc-btn">ENREGISTRER & GÉNÉRER LIEN</button>
                </div>
            </div>
            <style>
                .lux-input { width:100%; padding:18px; border-radius:18px; border:1.5px solid #e2e8f0; font-weight:750; font-family:inherit; background:#f8fafc; }
            </style>
        `;
    },

    updateNetPreview: () => {
        const amount = parseFloat(document.getElementById('doc-total-amount').value) || 0;
        const net = amount * (1 - BusinessModule.commissionRate);
        document.getElementById('net-preview').textContent = `NET EXPERT: ${net.toFixed(2)} € (APRÈS FRAIS DTC 12.5%)`;
    },

    async saveDoc(type) {
        const btn = document.getElementById('save-doc-btn');
        btn.disabled = true;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const payload = {
                expert_id: session.user.id,
                project_title: document.getElementById('doc-project-title').value,
                client_name: document.getElementById('doc-client-name').value,
                total_amount: parseFloat(document.getElementById('doc-total-amount').value) || 0,
                doc_type: type,
                status: 'draft'
            };
            await window._supabase.from('business_docs').insert(payload);
            BusinessModule.switchTab('quotes');
        } catch (err) { alert(err.message); btn.disabled = false; }
    },

    fetchDocs: async (type) => {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return [];
        const { data } = await window._supabase.from('business_docs').select('*').eq('expert_id', session.user.id).eq('doc_type', type).order('created_at', { ascending: false });
        return data || [];
    },

    refreshExpertProfile: async () => {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;
        const { data } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
        BusinessModule.expertProfile = data;
    }
};

window.BusinessModule = BusinessModule;
