/**
 * Domtom Connect - Business Module (Pro Edition)
 * Powered by DTC High-Performance Vector Engine (formerly SoloPrice Pro)
 */
const BusinessModule = {
    // --- Configuration ---
    commissionRate: 0.12, // 12% Domtom Connect
    activeTab: 'quotes',
    editingId: null,
    currentItems: [],
    expertProfile: null,

    // --- Core Initialization ---
    renderDashboard: async (container) => {
        await BusinessModule.renderView(container);
    },

    renderView: async (container) => {
        if (!container) {
            console.error("DTC Business Error: Container 'business-module-container' not found.");
            return;
        }
        
        // Initial Loading State
        container.innerHTML = `<div style="text-align:center; padding: 100px; font-family: sans-serif;"><span class="loader"></span><p style="margin-top:20px; color:#64748b; font-weight:800;">Initialisation de DTC Business...</p></div>`;

        // Load profile first to check tier
        await BusinessModule.refreshExpertProfile();
        
        BusinessModule.activeTab = localStorage.getItem('dtc_business_tab') || 'quotes';
        
        container.innerHTML = `
            <div class="business-container" style="padding: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                <div class="dash-section-header" style="margin-bottom: 32px; display:flex; justify-content:space-between; align-items:flex-end;">
                    <div style="flex:1;">
                        <h2 class="dash-title" style="margin: 0;">Centre de Pilotage Business</h2>
                        <p class="dash-subtitle" style="margin: 8px 0 0 0;">Gérez vos devis, factures et encaissements avec une précision chirurgicale.</p>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button onclick="BusinessModule.createNewDoc('quote')" class="cta-button primary" style="padding:12px 24px; border-radius:12px; font-weight:800;">+ Nouveau Devis</button>
                        <button onclick="BusinessModule.createNewDoc('invoice')" class="cta-button secondary" style="padding:12px 24px; border-radius:12px; font-weight:800;">+ Facture</button>
                    </div>
                </div>

                <div class="business-tabs" style="display: flex; gap: 8px; margin-bottom: 32px; border-bottom: 1px solid #f1f5f9; padding-bottom: 1px;">
                    <button class="tab-btn ${BusinessModule.activeTab === 'quotes' ? 'active' : ''}" onclick="BusinessModule.switchTab('quotes')" style="padding: 12px 24px; border: none; background: none; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; border-bottom: 3px solid transparent;">Devis</button>
                    <button class="tab-btn ${BusinessModule.activeTab === 'invoices' ? 'active' : ''}" onclick="BusinessModule.switchTab('invoices')" style="padding: 12px 24px; border: none; background: none; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; border-bottom: 3px solid transparent;">Factures</button>
                    <button class="tab-btn ${BusinessModule.activeTab === 'payments' ? 'active' : ''}" onclick="BusinessModule.switchTab('payments')" style="padding: 12px 24px; border: none; background: none; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; border-bottom: 3px solid transparent;">Paiements & Commissions</button>
                </div>

                <div id="business-dynamic-content">
                    <div class="loading-state" style="text-align:center; padding: 40px;">
                        <span class="loader"></span>
                        <p>Initialisation du moteur business...</p>
                    </div>
                </div>
            </div>

            <style>
                .tab-btn.active { color: #10b981 !important; border-bottom-color: #10b981 !important; }
                .doc-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.1); border-color: #10b981 !important; }
                .input-modern:focus { border-color: #10b981 !important; outline: none; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
                .status-badge { font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 800; text-transform: uppercase; }
                .status-draft { background: #f1f5f9; color: #64748b; }
                .status-sent { background: #dcfce7; color: #166534; }
                .status-paid { background: #10b981; color: white; }
                .status-overdue { background: #fecaca; color: #991b1b; }
                .cta-button { cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid transparent; }
                .cta-button:hover { opacity: 0.9; transform: scale(1.02); }
                .cta-button.primary { background: #10b981; color: white; border-radius:12px; }
                .cta-button.secondary { background: white; color: #10b981; border-color: #10b981; border-radius:12px; }
                .cta-button.ghost { background: transparent; color: #64748b; border-color: #e2e8f0; border-radius:12px; }
            </style>
        `;

        await BusinessModule.switchTab(BusinessModule.activeTab);
    },

    switchTab: async (tabId) => {
        BusinessModule.activeTab = tabId;
        localStorage.setItem('dtc_business_tab', tabId);
        
        const content = document.getElementById('business-dynamic-content');
        if (!content) return;
        content.innerHTML = `<div style="text-align:center; padding:40px;"><span class="loader"></span></div>`;

        try {
            const data = await BusinessModule.fetchDocs(tabId === 'payments' ? null : (tabId === 'quotes' ? 'quote' : 'invoice'));
            if (tabId === 'quotes') BusinessModule.renderQuotesList(content, data);
            else if (tabId === 'invoices') BusinessModule.renderInvoicesList(content, data);
            else if (tabId === 'payments') BusinessModule.renderPaymentsList(content, data);
        } catch (err) {
            content.innerHTML = `<p style="color:red; text-align:center;">Erreur : ${err.message}</p>`;
        }
    },

    refreshExpertProfile: async () => {
        try {
            const supabase = await BusinessModule.waitForSupabase();
            if (!supabase) return;
            const { data } = await supabase.auth.getUser();
            const user = data?.user;
            if (!user) return;
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profile) BusinessModule.expertProfile = profile;
        } catch (err) { console.error("Expert profile load failed:", err); }
    },

    waitForSupabase: async () => {
        return new Promise((resolve) => {
            let attempts = 0;
            const check = () => {
                attempts++;
                const s = window._supabase || window.supabase;
                if (s && s.auth) resolve(s);
                else if (attempts > 100) resolve(null);
                else setTimeout(check, 100);
            };
            check();
        });
    },

    fetchDocs: async (type = null) => {
        const supabase = await BusinessModule.waitForSupabase();
        if (!supabase) return [];
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return [];
        let query = supabase.from('business_docs').select('*').eq('expert_id', user.id).order('created_at', { ascending: false });
        if (type) query = query.eq('doc_type', type);
        const { data: docs, error } = await query;
        if (error) throw error;
        return docs || [];
    },

    renderQuotesList: (container, data) => {
        if (data.length === 0) { container.innerHTML = BusinessModule.renderEmptyState('quote'); return; }
        container.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                ${data.map(doc => `
                    <div class="doc-card" style="background:white; border-radius:20px; border:1px solid #f1f5f9; padding:24px; transition:0.3s; cursor:pointer;" onclick="BusinessModule.editDoc('${doc.id}')">
                        <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                            <span class="status-badge status-${doc.status || 'draft'}">${doc.status || 'Brouillon'}</span>
                            <span style="font-weight:800; color:#cbd5e1; font-size:0.8rem;">#${doc.id.slice(0,6).toUpperCase()}</span>
                        </div>
                        <h4 style="font-weight:800; margin:0 0 4px 0;">${doc.client_name}</h4>
                        <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">${doc.project_title}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f8fafc; padding-top:16px;">
                            <span style="font-weight:900; font-size:1.1rem; color:#10b981;">${(doc.total_ttc || 0).toFixed(2)}€</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderInvoicesList: (container, data) => {
        if (data.length === 0) { container.innerHTML = BusinessModule.renderEmptyState('invoice'); return; }
        container.innerHTML = `
            <div style="display: grid; gap: 16px;">
                ${data.map(doc => `
                    <div class="doc-card" style="background:white; border-radius:18px; border:1px solid #f1f5f9; padding:20px; display:flex; justify-content:space-between; align-items:center;" onclick="BusinessModule.editDoc('${doc.id}')">
                        <div>
                            <div style="font-weight:900; color:#0f172a;">FAC-${doc.id.slice(0,4).toUpperCase()}</div>
                            <div style="font-size:0.75rem; color:#64748b;">${doc.client_name}</div>
                        </div>
                        <div style="font-weight:950; font-size:1.1rem;">${(doc.total_ttc || 0).toFixed(2)}€</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderPaymentsList: (container, data) => {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#94a3b8;">Suivi des encaissements (Module Expert Pro)</div>`;
    },

    renderEmptyState: (type) => `
        <div style="padding: 60px; text-align: center; border: 2px dashed #f1f5f9; border-radius: 24px; background:white;">
            <p style="color: #64748b; margin-bottom: 24px;">Aucun document trouvé.</p>
            <button onclick="BusinessModule.createNewDoc('${type}')" class="cta-button primary" style="padding:14px 36px; border-radius:14px; font-weight:900;">+ Créer</button>
        </div>
    `,

    createNewDoc: (type = 'quote') => {
        BusinessModule.editingId = null;
        BusinessModule.currentType = type;
        BusinessModule.currentItems = [{ id: Date.now(), description: '', quantity: 1, price: 0 }];
        BusinessModule.renderEditor();
    },

    editDoc: async (id) => {
        const supabase = await BusinessModule.waitForSupabase();
        if (!supabase) return;
        const { data } = await supabase.from('business_docs').select('*').eq('id', id).single();
        if (!data) return;
        BusinessModule.editingId = data.id;
        BusinessModule.currentType = data.doc_type;
        BusinessModule.currentItems = data.items || [];
        BusinessModule.renderEditor();
        setTimeout(() => {
            document.getElementById('quote-client-name').value = data.client_name;
            document.getElementById('quote-project-title').value = data.project_title;
        }, 50);
    },

    renderEditor: () => {
        const content = document.getElementById('business-dynamic-content');
        const isInvoice = BusinessModule.currentType === 'invoice';
        const p = BusinessModule.expertProfile || {};
        const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';

        const subtotal = BusinessModule.currentItems.reduce((acc, i) => acc + (i.quantity * i.price), 0);
        const taxEl = document.getElementById('tax-config');
        const taxRate = taxEl ? parseFloat(taxEl.value.split('|')[0]) : 0;
        const totalTax = subtotal * (taxRate / 100);
        const grandTotal = subtotal + totalTax;

        content.innerHTML = `
            <div class="quote-editor" style="background: white; border-radius: 24px; border: 1px solid #e2e8f0; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; border-bottom: 1px solid #f1f5f9; padding-bottom: 32px;">
                    <div>
                        <h2 style="font-size: 1.75rem; font-weight: 900; margin: 0; color: #0f172a;">${isInvoice ? 'Facture' : 'Devis'}</h2>
                        <span style="font-size: 0.65rem; background: #0f172a; color: white; padding: 4px 12px; border-radius: 100px; font-weight: 850;">DTC BUSINESS v6.0</span>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button onclick="BusinessModule.saveDoc()" class="cta-button primary" style="padding:14px 28px; font-weight:900; border-radius:12px;">Enregistrer</button>
                        <button onclick="BusinessModule.switchTab(BusinessModule.activeTab)" class="cta-button ghost" style="padding:14px 28px; color: #ef4444; font-weight:800; border-radius:12px;">Fermer</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
                    <div style="background: #f8fafc; padding: 24px; border-radius: 20px;">
                        <h4 style="font-size: 0.75rem; color: #10b981; text-transform: uppercase; margin-bottom: 16px;">Emetteur</h4>
                        <input type="text" id="expert-name" value="${p.full_name || ''}" placeholder="Raison Sociale" style="width:100%; margin-bottom:8px; padding:10px; border-radius:8px; border:1px solid #ddd;">
                        <input type="text" id="expert-siret" value="${p.company_siret || ''}" placeholder="SIRET" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                    </div>
                    <div style="background: #f8fafc; padding: 24px; border-radius: 20px;">
                        <h4 style="font-size: 0.75rem; color: #10b981; text-transform: uppercase; margin-bottom: 16px;">Client</h4>
                        <input type="text" id="quote-client-name" placeholder="Nom Client" style="width:100%; margin-bottom:8px; padding:10px; border-radius:8px; border:1px solid #ddd;">
                        <input type="text" id="quote-project-title" placeholder="Titre Projet" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                    </div>
                </div>

                <div style="margin-bottom: 48px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h4 style="font-size: 0.75rem; color: #10b981; text-transform: uppercase; margin: 0;">Prestations</h4>
                        <button onclick="BusinessModule.addItem()" style="font-size: 0.7rem; padding: 6px 12px; border:1px solid #ddd; border-radius:8px; background:white;">+ Ligne</button>
                    </div>
                    ${BusinessModule.currentItems.map((item, index) => `
                        <div style="display: grid; grid-template-columns: 2fr 80px 120px 120px 40px; gap: 12px; align-items: center; margin-bottom: 8px;">
                            <input type="text" value="${item.description}" onblur="BusinessModule.updateItem(${index}, 'description', this.value)" placeholder="Description" style="padding:10px; border-radius:8px; border:1px solid #eee;">
                            <input type="number" value="${item.quantity}" onblur="BusinessModule.updateItem(${index}, 'quantity', this.value)" style="padding:10px; border-radius:8px; border:1px solid #eee; text-align:center;">
                            <input type="number" value="${item.price}" onblur="BusinessModule.updateItem(${index}, 'price', this.value)" placeholder="Prix" style="padding:10px; border-radius:8px; border:1px solid #eee; text-align:right;">
                            <div style="text-align:right; font-weight:800;">${(item.quantity * item.price).toFixed(2)}${currency}</div>
                            <button onclick="BusinessModule.removeItem(${index})" style="color:red; background:none; border:none; font-size:1.2rem;">&times;</button>
                        </div>
                    `).join('')}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: flex-start;">
                    <div style="background: #f8fafc; padding: 24px; border-radius: 20px;">
                        <h4 style="font-size: 0.75rem; color: #10b981; text-transform: uppercase;">Taxe</h4>
                        <select id="tax-config" onchange="BusinessModule.renderEditor()" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                            <option value="0|Exonéré" ${taxRate === 0 ? 'selected' : ''}>Micro-Entreprise (0%)</option>
                            <option value="20|TVA 20%" ${taxRate === 20 ? 'selected' : ''}>TVA 20%</option>
                            <option value="8.5|TVA 8.5%" ${taxRate === 8.5 ? 'selected' : ''}>TVA 8.5%</option>
                        </select>
                    </div>
                    <div style="background: #0f172a; color: white; padding: 32px; border-radius: 24px; text-align: right;">
                        <div style="opacity:0.6; margin-bottom:8px;">TOTAL HT: ${subtotal.toFixed(2)}${currency}</div>
                        <div style="font-weight:950; font-size:1.8rem; color:#10b981;">TOTAL TTC: ${grandTotal.toFixed(2)}${currency}</div>
                        <div style="margin-top:16px;">
                            <button onclick="BusinessModule.handlePDFGeneration()" style="background:#10b981; color:white; border:none; padding:12px 24px; border-radius:10px; font-weight:800; cursor:pointer;">Aperçu PDF (pdfMake)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    addItem: () => {
        BusinessModule.currentItems.push({ id: Date.now(), description: '', quantity: 1, price: 0 });
        BusinessModule.renderEditor();
    },

    removeItem: (index) => {
        BusinessModule.currentItems.splice(index, 1);
        BusinessModule.renderEditor();
    },

    updateItem: (index, field, value) => {
        BusinessModule.currentItems[index][field] = field === 'description' ? value : parseFloat(value) || 0;
        BusinessModule.renderEditor();
    },

    saveDoc: async () => {
        try {
            const supabase = await BusinessModule.waitForSupabase();
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Session expirée");

            const taxEl = document.getElementById('tax-config');
            const taxValues = taxEl ? taxEl.value.split('|') : [0, 'Sans Taxes'];
            
            const docData = {
                expert_id: user.id,
                doc_type: BusinessModule.currentType,
                client_name: document.getElementById('quote-client-name').value,
                project_title: document.getElementById('quote-project-title').value,
                items: BusinessModule.currentItems,
                subtotal: BusinessModule.currentItems.reduce((acc, i) => acc + (i.quantity * i.price), 0),
                total_ttc: 0, // Calculated on save if needed
                status: 'draft',
                updated_at: new Date()
            };
            
            docData.total_ttc = docData.subtotal * (1 + parseFloat(taxValues[0])/100);

            if (BusinessModule.editingId) {
                await supabase.from('business_docs').update(docData).eq('id', BusinessModule.editingId);
            } else {
                await supabase.from('business_docs').insert({ ...docData, created_at: new Date() });
            }

            Swal.fire('Succès', 'Document enregistré.', 'success');
            BusinessModule.switchTab(BusinessModule.activeTab);
        } catch (err) { alert(err.message); }
    },

    handlePDFGeneration: () => {
        // Dummy implementation for brevity
        Swal.fire('PDF', 'Génération PDF simulée.', 'info');
    }
};

window.BusinessModule = BusinessModule;

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const c = document.getElementById('business-module-container');
        if (c) BusinessModule.renderView(c);
    });
} else {
    const c = document.getElementById('business-module-container');
    if (c) BusinessModule.renderView(c);
}
