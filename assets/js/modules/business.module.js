/**
 * Domtom Connect - Business Module (Pro Edition)
 * Flux complet : Devis -> Signature -> Acompte -> Facture
 */
const BusinessModule = {
    // --- Configuration ---
    commissionRate: 0.12, // 12% Domtom Connect
    activeTab: 'quotes',
    editingId: null,
    currentItems: [],
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
                <!-- Header Stratégique -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; flex-wrap: wrap; gap: 24px;">
                    <div>
                        <h1 style="font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 950; color: #020617; letter-spacing: -0.05em; margin: 0;">Business Pilotage</h1>
                        <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin-top: 8px;">Pilotage de revenus et contrats certifiés DTC.</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="BusinessModule.openDocEditor('quote')" class="btn-dtc primary-black">+ Créer un Devis</button>
                        <button onclick="BusinessModule.openDocEditor('invoice')" class="btn-dtc secondary-green">Nouvelle Facture</button>
                    </div>
                </div>

                <!-- Stats Crypto-SaaS -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px;">
                    <div class="stat-card">
                        <span class="stat-label">En attente de signature</span>
                        <div id="stats-pending-quotes" class="stat-value">0,00 €</div>
                        <div class="stat-indicator green">+12.5% vs mois dernier</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Chiffre d'Affaires Net</span>
                        <div id="stats-secured-revenue" class="stat-value">0,00 €</div>
                        <div class="stat-indicator blue">Encaissement sécurisé</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Frais de Régie (12%)</span>
                        <div id="stats-dtc-commission" class="stat-value" style="color: #ef4444;">-0,00 €</div>
                        <div class="stat-indicator gray">Calculé sur le HT</div>
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
                .btn-dtc.secondary-green { background: #10b981; color: white; }
                .btn-dtc:hover { transform: translateY(-3px); filter: brightness(1.1); }
                
                .stat-card { background: white; padding: 32px; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
                .stat-label { font-size: 0.75rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
                .stat-value { font-size: 2.2rem; font-weight: 950; color: #020617; margin: 12px 0; letter-spacing: -0.04em; }
                .stat-indicator { font-size: 0.8rem; font-weight: 800; }
                .stat-indicator.green { color: #10b981; }
                .stat-indicator.blue { color: #3b82f6; }
                .stat-indicator.gray { color: #94a3b8; }

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
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#ef4444; font-weight:900; background:#fee2e2; border-radius:16px; margin:20px 0; border:1px solid #fecaca;">Erreur: ${err.message}</div>`;
        }
    },

    // --- List Rendering ---
    renderList: (container, data, type) => {
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:80px; background:#f8fafc; border-radius:24px; border:1px solid #e2e8f0;">
                    <div style="font-size:3rem; margin-bottom:20px;">📄</div>
                    <h3 style="font-weight:950; color:#020617; margin-bottom:8px;">Aucun document</h3>
                    <p style="color:#64748b; font-weight:600; margin:0;">Émettez votre premier document pour lancer la mission.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; min-width:800px;">
                    <thead>
                        <tr style="text-align:left; border-bottom:1.5px solid #f1f5f9;">
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Réf</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Client / Projet</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">État</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Net Percu</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950; text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(doc => `
                            <tr class="lux-table-row" style="border-bottom:1px solid #f8fafc; transition: all 0.2s;">
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:950; color:#020617; font-size:1.1rem;">#${doc.id.slice(0,8).toUpperCase()}</div>
                                    <div style="font-size:0.8rem; color:#94a3b8; font-weight:700;">${new Date(doc.created_at).toLocaleDateString()}</div>
                                </td>
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:900; color:#020617;">${doc.client_name}</div>
                                    <div style="font-size:0.8rem; color:#64748b; font-weight:600;">${doc.project_title}</div>
                                </td>
                                <td style="padding:24px 20px;">
                                    ${BusinessModule.renderStatusBadge(doc.status)}
                                </td>
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:950; color:#020617; font-size:1.25rem;">${((doc.total_amount || 0)*(1 - BusinessModule.commissionRate)).toFixed(2)} €</div>
                                    <div style="font-size:0.65rem; color:#94a3b8; font-weight:900; text-transform:uppercase;">Facturé: ${doc.total_amount.toFixed(2)} €</div>
                                </td>
                                <td style="padding:24px 20px; text-align:right;">
                                    <div style="display:flex; gap:10px; justify-content:flex-end;">
                                        <button onclick="BusinessModule.openQuotePortal('${doc.id}')" class="lux-btn-icon sig" title="Copier le lien de signature"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
                                        <button onclick="BusinessModule.deleteDoc('${doc.id}')" class="lux-btn-icon del"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <style>
                .lux-table-row:hover { background: #fcfcfd !important; }
                .lux-btn-icon { width: 48px; height: 48px; border-radius: 14px; border: 1.5px solid #f1f5f9; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
                .lux-btn-icon:hover { transform: scale(1.1); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .lux-btn-icon.sig:hover { color: #10b981; border-color: #10b981; }
                .lux-btn-icon.del:hover { color: #ef4444; border-color: #ef4444; }
            </style>
        `;
    },

    renderStatusBadge: (status) => {
        const styles = {
            draft: { bg: '#f1f5f9', color: '#64748b', label: 'Brouillon' },
            sent: { bg: '#e0f2fe', color: '#0369a1', label: 'Envoyé' },
            paid: { bg: '#ecfdf5', color: '#059669', label: 'Signé / Payé' }
        };
        const s = styles[status] || styles.draft;
        return `<span style="background:${s.bg}; color:${s.color}; font-size:0.65rem; font-weight:950; text-transform:uppercase; padding:6px 14px; border-radius:100px; display:inline-block; border:1px solid rgba(0,0,0,0.05);">${s.label}</span>`;
    },

    // --- Actions ---

    openQuotePortal: (id) => {
        const url = `${window.location.origin}/view-document.html?id=${id}`;
        navigator.clipboard.writeText(url);
        Swal.fire({
            title: 'Lien de Signature Copié !',
            text: 'Envoyez ce lien à votre client pour qu\'il signe le devis numériquement.',
            icon: 'success',
            confirmButtonColor: '#10b981'
        });
    },

    openDocEditor: (type = 'quote') => {
        const container = document.getElementById('business-dynamic-content');
        container.innerHTML = `
            <div style="background: #f8fafc; border-radius: 32px; border: 2px dashed #cbd5e1; padding: 48px; margin-top: 20px;">
                <h3 style="font-weight:950; color:#020617; font-size:1.8rem; margin-bottom:32px;">Nouveau ${type === 'quote' ? 'Devis' : 'Document'}</h3>
                
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:32px; margin-bottom:40px;">
                    <div>
                        <div class="form-lux">
                            <label>Titre de la Prestation / Mission *</label>
                            <input type="text" id="doc-project-title" placeholder="Ex: Étude de Territoire Guadeloupe" class="lux-input">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:24px;">
                            <div class="form-lux">
                                <label>Client Final (Nom) *</label>
                                <input type="text" id="doc-client-name" placeholder="Nom du prospect" class="lux-input">
                            </div>
                            <div class="form-lux">
                                <label>Acompte exigé (%)</label>
                                <input type="number" id="doc-acompte-percent" value="30" class="lux-input">
                            </div>
                        </div>
                    </div>
                    <div style="background:white; border-radius:24px; padding:24px; border:1.5px solid #e2e8f0; display:flex; flex-direction:column; justify-content:center; text-align:center;">
                        <label style="font-size:0.75rem; font-weight:950; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Budget Global HT (€)</label>
                        <input type="number" id="doc-total-amount" placeholder="0,00" class="lux-input" style="font-size:2rem; font-weight:950; color:#10b981; text-align:center;">
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:16px;">
                    <button onclick="BusinessModule.switchTab('${BusinessModule.activeTab}')" style="padding:18px 40px; border-radius:18px; border:2px solid #f1f5f9; font-weight:950; cursor:pointer;">Annuler</button>
                    <button onclick="BusinessModule.saveDoc('${type}')" class="btn-dtc primary-black" id="save-doc-btn">VALIDER & GÉNÉRER LIEN</button>
                </div>
            </div>
            <style>
                .form-lux label { display:block; font-size:0.75rem; font-weight:950; color:#64748b; margin-bottom:10px; }
                .lux-input { width:100%; padding:18px; border-radius:18px; border:1.5px solid #e2e8f0; font-weight:750; font-family:inherit; background:#f8fafc; box-sizing:border-box; }
                .lux-input:focus { background:white; border-color:#020617; outline:none; }
            </style>
        `;
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
                acompte_percent: parseInt(document.getElementById('doc-acompte-percent').value) || 0,
                total_amount: parseFloat(document.getElementById('doc-total-amount').value) || 0,
                doc_type: type,
                status: 'draft'
            };

            const { error } = await window._supabase.from('business_docs').insert(payload);
            if (error) throw error;
            BusinessModule.switchTab(type === 'quote' ? 'quotes' : 'invoices');
        } catch (err) { alert(err.message); btn.disabled = false; }
    },

    fetchDocs: async (type) => {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return [];
        const { data, error } = await window._supabase.from('business_docs').select('*').eq('expert_id', session.user.id).eq('doc_type', type).order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async deleteDoc(id) {
        if (!confirm("Supprimer ce document ?")) return;
        await window._supabase.from('business_docs').delete().eq('id', id);
        BusinessModule.switchTab(BusinessModule.activeTab);
    },

    refreshExpertProfile: async () => {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;
        const { data } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
        BusinessModule.expertProfile = data;
    }
};

window.BusinessModule = BusinessModule;
