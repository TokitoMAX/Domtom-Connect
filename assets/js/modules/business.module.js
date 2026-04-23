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
        
        container.innerHTML = `<div style="text-align:center; padding: 100px; font-family: 'Plus Jakarta Sans', sans-serif;"><span class="loader"></span><p style="margin-top:20px; color:#64748b; font-weight:800;">Chargement du centre d'affaires...</p></div>`;

        await BusinessModule.refreshExpertProfile();
        BusinessModule.activeTab = localStorage.getItem('dtc_business_tab') || 'quotes';
        
        container.innerHTML = `
            <div class="business-pro-container" style="padding: clamp(20px, 4vw, 40px); font-family: 'Plus Jakarta Sans', sans-serif; background: #fafafa; min-height: 100vh;">
                <!-- Header Stratégique -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; flex-wrap: wrap; gap: 24px;">
                    <div>
                        <h1 style="font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 950; color: #020617; letter-spacing: -0.05em; margin: 0;">Business Pilotage</h1>
                        <p style="color: #64748b; font-size: 1.1rem; font-weight: 600; margin-top: 8px;">Flux de revenus, contrats et facturation certifiée.</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="BusinessModule.openDocEditor('quote')" class="btn-dtc primary-black">+ Créer un Devis</button>
                        <button onclick="BusinessModule.openDocEditor('invoice')" class="btn-dtc secondary-green">Nouvelle Facture</button>
                    </div>
                </div>

                <!-- Stats Crypto-SaaS -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 48px;">
                    <div class="stat-card">
                        <span class="stat-label">En attente de signature</span>
                        <div id="stats-pending-quotes" class="stat-value">0,00 €</div>
                        <div class="stat-indicator green">+12.5% vs mois dernier</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">CA Sécurisé (Acomptes)</span>
                        <div id="stats-secured-revenue" class="stat-value">0,00 €</div>
                        <div class="stat-indicator blue">8 documents payés</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">Commissions DTC (12%)</span>
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
                .btn-dtc { padding: 16px 32px; border-radius: 16px; font-weight: 900; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; }
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

                .tab-lux-btn { background: none; border: none; padding: 16px 0; font-size: 1.1rem; font-weight: 900; color: #94a3b8; cursor: pointer; position: relative; font-family: inherit; }
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
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#ef4444; font-weight:800; background:#fee2e2; border-radius:16px; margin:20px 0; border:1px solid #fecaca;">Erreur: ${err.message}</div>`;
        }
    },

    // --- List Rendering ---
    renderList: (container, data, type) => {
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:80px; background:#f8fafc; border-radius:24px; border:1px solid #e2e8f0;">
                    <div style="font-size:3rem; margin-bottom:20px;">📄</div>
                    <h3 style="font-weight:950; color:#020617; margin-bottom:8px;">Aucun document trouvé</h3>
                    <p style="color:#64748b; font-weight:600; margin:0;">Commencez par créer votre premier ${type === 'quotes' ? 'devis' : 'facture'} pour sécuriser votre activité.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; min-width:800px;">
                    <thead>
                        <tr style="text-align:left; border-bottom:1.5px solid #f1f5f9;">
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; font-weight:900;">Document</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; font-weight:900;">Client & Projet</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; font-weight:900;">Statut</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; font-weight:900;">Montant Final</th>
                            <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; font-weight:900; text-align:right;">Actions Pro</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(doc => `
                            <tr class="lux-table-row" style="border-bottom:1px solid #f8fafc; transition: all 0.2s;">
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:950; color:#020617; font-size:1.1rem; letter-spacing:-0.02em;">#${doc.id.slice(0,8).toUpperCase()}</div>
                                    <div style="font-size:0.8rem; color:#94a3b8; font-weight:700; margin-top:4px;">${new Date(doc.created_at).toLocaleDateString()}</div>
                                </td>
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:900; color:#020617;">${doc.client_name || 'Client Direct'}</div>
                                    <div style="font-size:0.8rem; color:#64748b; font-weight:600; margin-top:2px;">${doc.project_title || 'Mission Ponctuelle'}</div>
                                </td>
                                <td style="padding:24px 20px;">
                                    ${BusinessModule.renderStatusBadge(doc.status)}
                                </td>
                                <td style="padding:24px 20px;">
                                    <div style="font-weight:950; color:#020617; font-size:1.25rem;">${(doc.total_amount || 0).toFixed(2)} €</div>
                                    <div style="font-size:0.65rem; color:#94a3b8; font-weight:800; text-transform:uppercase; margin-top:4px;">Net Expert: ${((doc.total_amount || 0)*(1 - BusinessModule.commissionRate)).toFixed(2)} €</div>
                                </td>
                                <td style="padding:24px 20px; text-align:right;">
                                    <div style="display:flex; gap:10px; justify-content:flex-end;">
                                        <button onclick="BusinessModule.downloadPDF('${doc.id}')" class="lux-btn-icon pdf" title="Télécharger PDF"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                                        <button onclick="BusinessModule.handleSignatureFlow('${doc.id}')" class="lux-btn-icon sig" title="Signature Electronique"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
                                        <button onclick="BusinessModule.deleteDoc('${doc.id}')" class="lux-btn-icon del" title="Supprimer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <style>
                .lux-table-row:hover { background: #fcfcfd !important; }
                .lux-btn-icon { width: 48px; height: 48px; border-radius: 14px; border: 1.5px solid #f1f5f9; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; color: #94a3b8; }
                .lux-btn-icon:hover { transform: scale(1.1); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .lux-btn-icon.pdf:hover { color: #3b82f6; border-color: #3b82f6; }
                .lux-btn-icon.sig:hover { color: #10b981; border-color: #10b981; }
                .lux-btn-icon.del:hover { color: #ef4444; border-color: #ef4444; }
            </style>
        `;
    },

    renderStatusBadge: (status) => {
        const styles = {
            draft: { bg: '#f1f5f9', color: '#64748b', label: 'Brouillon' },
            sent: { bg: '#e0f2fe', color: '#0369a1', label: 'Signé / Envoyé' },
            paid: { bg: '#ecfdf5', color: '#059669', label: 'Règlé' },
            cancelled: { bg: '#fee2e2', color: '#ef4444', label: 'Annulé' }
        };
        const s = styles[status] || styles.draft;
        return `<span style="background:${s.bg}; color:${s.color}; font-size:0.65rem; font-weight:950; text-transform:uppercase; padding:6px 14px; border-radius:100px; display:inline-block; border:1px solid rgba(0,0,0,0.05); letter-spacing:0.04em;">${s.label}</span>`;
    },

    // --- Actions ---

    openDocEditor: (type = 'quote') => {
        const container = document.getElementById('business-dynamic-content');
        container.innerHTML = `
            <div style="background: #f8fafc; border-radius: 32px; border: 2px dashed #cbd5e1; padding: 48px; margin-top: 20px;">
                <h3 style="font-weight:950; color:#020617; font-size:1.8rem; letter-spacing:-0.04em; margin-bottom:32px;">Nouveau ${type === 'quote' ? 'Devis Expert' : 'Document'}</h3>
                
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:32px; margin-bottom:40px;">
                    <div>
                        <div class="form-lux">
                            <label>Titre de la Mission / Projet *</label>
                            <input type="text" id="doc-project-title" placeholder="Ex: Développement App Mobile V1" class="lux-input">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:24px;">
                            <div class="form-lux">
                                <label>Client Final (Nom) *</label>
                                <input type="text" id="doc-client-name" placeholder="Ets. Dupont" class="lux-input">
                            </div>
                            <div class="form-lux">
                                <label>Email Contact *</label>
                                <input type="email" id="doc-client-email" placeholder="client@exemple.com" class="lux-input">
                            </div>
                        </div>
                    </div>
                    <div style="background:white; border-radius:24px; padding:24px; border:1.5px solid #e2e8f0; display:flex; flex-direction:column; gap:20px;">
                        <h4 style="font-size:0.75rem; font-weight:950; color:#94a3b8; text-transform:uppercase; margin:0;">Configuration Financière</h4>
                        <div class="form-lux">
                            <label>Budget HT (€) *</label>
                            <input type="number" id="doc-total-amount" placeholder="0,00" class="lux-input" style="font-size:1.5rem; font-weight:950; color:#10b981;">
                        </div>
                        <div class="form-lux">
                            <label>Acompte exigé (%)</label>
                            <input type="number" id="doc-acompte-percent" value="30" class="lux-input">
                        </div>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:16px; border-top:1.5px solid #f1f5f9; padding-top:40px;">
                    <button onclick="BusinessModule.switchTab('${BusinessModule.activeTab}')" style="padding:18px 40px; border-radius:18px; background:white; border:2px solid #f1f5f9; font-weight:950; color:#94a3b8; cursor:pointer; font-family:inherit;">Annuler</button>
                    <button onclick="BusinessModule.saveDoc('${type}')" class="btn-dtc primary-black" id="save-doc-btn" style="padding:18px 48px;">PUBLIER & ENVOYER</button>
                </div>
            </div>
            <style>
                .form-lux label { display:block; font-size:0.7rem; font-weight:950; color:#64748b; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.05em; }
                .lux-input { width:100%; padding:18px; border-radius:18px; border:1.5px solid #e2e8f0; font-weight:700; font-family:inherit; transition:0.3s; background:#f8fafc; box-sizing:border-box; }
                .lux-input:focus { background:white; border-color:#020617; outline:none; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
            </style>
        `;
    },

    async saveDoc(type) {
        const btn = document.getElementById('save-doc-btn');
        btn.disabled = true;
        btn.textContent = 'Enregistrement...';
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Veuillez vous reconnecter.");
            
            const docData = {
                expert_id: session.user.id,
                project_title: document.getElementById('doc-project-title').value,
                client_name: document.getElementById('doc-client-name').value,
                doc_type: type,
                total_amount: parseFloat(document.getElementById('doc-total-amount').value) || 0,
                status: 'draft',
                currency: 'EUR'
            };

            const { error } = await window._supabase.from('business_docs').insert(docData);
            if (error) throw error;
            BusinessModule.switchTab(type === 'quote' ? 'quotes' : 'invoices');
        } catch (err) { alert(err.message); btn.disabled = false; btn.textContent = 'PUBLIER'; }
    },

    fetchDocs: async (type) => {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return [];
        const { data, error } = await window._supabase
            .from('business_docs')
            .select('*')
            .eq('expert_id', session.user.id)
            .eq('doc_type', type)
            .order('created_at', { ascending: false });
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
