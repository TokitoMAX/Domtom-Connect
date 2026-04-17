/**
 * Domtom Connect - Business Module (Pro Edition)
 * Powered by DTC High-Performance Vector Engine (formerly SoloPrice Pro)
 * Rebranded and optimized for territorial experts.
 */
const BusinessModule = {
    // --- Configuration ---
    commissionRate: 0.12, // 12% Domtom Connect
    activeTab: 'quotes',
    editingId: null,
    currentItems: [],

    // --- Core Initialization ---
    renderView: async (container) => {
        if (!container) return;

        // Reset state
        BusinessModule.activeTab = localStorage.getItem('dtc_business_tab') || 'quotes';

        container.innerHTML = `
            <div class="business-container" style="padding: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                <div class="dash-section-header" style="margin-bottom: 32px; display:flex; justify-content:space-between; align-items:flex-end;">
                    <div>
                        <h2 class="dash-title" style="margin: 0;">Centre de Pilotage Business</h2>
                        <p class="dash-subtitle" style="margin: 8px 0 0 0;">Gérez vos devis, factures et encaissements avec une précision chirurgicale.</p>
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
                .cta-button.primary { background: #10b981; color: white; }
                .cta-button.secondary { background: white; color: #10b981; border-color: #10b981; }
                .cta-button.ghost { background: transparent; color: #64748b; border-color: #e2e8f0; }
                
                table.dtc-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                table.dtc-table th { text-align: left; padding: 12px; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
                table.dtc-table td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #0f172a; }
            </style>
        `;

        await BusinessModule.switchTab(BusinessModule.activeTab);
    },

    switchTab: async (tabId) => {
        BusinessModule.activeTab = tabId;
        localStorage.setItem('dtc_business_tab', tabId);
        
        // Update UI buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().includes(tabId === 'quotes' ? 'devis' : (tabId === 'invoices' ? 'factures' : 'paiements'))) {
                btn.classList.add('active');
            }
        });

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

    // --- Data Layer ---
    fetchDocs: async (type = null) => {
        const supabase = await BusinessModule.waitForSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non connecté");

        let query = supabase.from('business_docs').select('*').eq('expert_id', user.id);
        if (type) query = query.eq('doc_type', type);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    waitForSupabase: () => {
        return new Promise((resolve) => {
            const check = () => {
                if (typeof _supabase !== 'undefined' && _supabase.auth) resolve(_supabase);
                else setTimeout(check, 100);
            };
            check();
        });
    },

    // --- UI Lists ---
    renderQuotesList: (container, data) => {
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="font-weight:800; margin:0;">Vos Devis (${data.length})</h3>
                <button onclick="BusinessModule.createNewDoc('quote')" class="cta-button primary" style="padding:10px 20px; border-radius:10px; font-weight:700;">+ Nouveau Devis</button>
            </div>
            ${data.length === 0 ? BusinessModule.renderEmptyState('quote') : `
                <div class="table-container" style="background:white; border-radius:16px; border:1px solid #f1f5f9; overflow:hidden;">
                    <table class="dtc-table">
                        <thead>
                            <tr>
                                <th>Client / Mission</th>
                                <th>Date</th>
                                <th>Montant HT</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(doc => `
                                <tr>
                                    <td>
                                        <div style="font-weight:700;">${doc.client_name}</div>
                                        <div style="font-size:0.75rem; color:#64748b;">${doc.project_title}</div>
                                    </td>
                                    <td>${new Date(doc.created_at).toLocaleDateString()}</td>
                                    <td style="font-weight:700;">${doc.total_amount.toFixed(2)}€</td>
                                    <td><span class="status-badge status-${doc.status || 'draft'}">${doc.status || 'Brouillon'}</span></td>
                                    <td>
                                        <div style="display:flex; gap:8px;">
                                            <button onclick="BusinessModule.editDoc('${doc.id}')" class="cta-button ghost" style="padding:4px 8px; font-size:0.8rem;"><i class="fas fa-edit"></i></button>
                                            <button onclick="BusinessModule.directExportPDF('${doc.id}')" class="cta-button ghost" style="padding:4px 8px; font-size:0.8rem; color:#10b981;"><i class="fas fa-file-pdf"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;
    },

    renderInvoicesList: (container, data) => {
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="font-weight:800; margin:0;">Vos Factures (${data.length})</h3>
                <button onclick="BusinessModule.createNewDoc('invoice')" class="cta-button secondary" style="padding:10px 20px; border-radius:10px; font-weight:700;">+ Nouvelle Facture</button>
            </div>
            ${data.length === 0 ? BusinessModule.renderEmptyState('invoice') : `
                <div class="table-container" style="background:white; border-radius:16px; border:1px solid #f1f5f9; overflow:hidden;">
                    <table class="dtc-table">
                        <thead>
                            <tr>
                                <th>N° / Client</th>
                                <th>Date</th>
                                <th>Montant TTC</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(doc => `
                                <tr>
                                    <td>
                                        <div style="font-weight:700;">FAC-${new Date(doc.created_at).getFullYear()}-${doc.id.slice(0,4).toUpperCase()}</div>
                                        <div style="font-size:0.75rem; color:#64748b;">${doc.client_name}</div>
                                    </td>
                                    <td>${new Date(doc.created_at).toLocaleDateString()}</td>
                                    <td style="font-weight:700;">${doc.total_amount.toFixed(2)}€</td>
                                    <td><span class="status-badge status-${doc.status || 'sent'}">${doc.status || 'Envoyée'}</span></td>
                                    <td>
                                        <div style="display:flex; gap:8px;">
                                            <button onclick="BusinessModule.editDoc('${doc.id}')" class="cta-button ghost" style="padding:4px 8px; font-size:0.8rem;"><i class="fas fa-edit"></i></button>
                                            <button onclick="BusinessModule.directExportPDF('${doc.id}')" class="cta-button ghost" style="padding:4px 8px; font-size:0.8rem; color:#10b981;"><i class="fas fa-file-pdf"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;
    },

    renderPaymentsList: (container, data) => {
        const trackedDocs = data.filter(d => d.status === 'sent' || d.status === 'paid' || d.status === 'accepted');
        
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="font-weight:800; margin:0;">Encaissements & Commissions</h3>
            </div>
            ${trackedDocs.length === 0 ? `
                <div style="text-align:center; padding:40px; color:#64748b;">Aucun paiement en attente ou encaissé.</div>
            ` : `
                <div class="table-container" style="background:white; border-radius:16px; border:1px solid #f1f5f9; overflow:hidden;">
                    <table class="dtc-table">
                        <thead>
                            <tr>
                                <th>Document</th>
                                <th>Client</th>
                                <th>Net Expert</th>
                                <th>Commission DC</th>
                                <th>Statut Expert</th>
                                <th>Statut Commission</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trackedDocs.map(doc => {
                                const commission = doc.commission_amount || (doc.total_amount * BusinessModule.commissionRate);
                                const isExpertPaid = doc.expert_paid_at != null;
                                const isPlatformPaid = doc.platform_paid_at != null;
                                
                                return `
                                    <tr>
                                        <td><strong>${doc.doc_type === 'invoice' ? 'FAC' : 'DEV'}-${doc.id.slice(0,4).toUpperCase()}</strong></td>
                                        <td>${doc.client_name}</td>
                                        <td style="font-weight:700;">${(doc.total_amount - commission).toFixed(2)}€</td>
                                        <td style="color:#64748b;">${commission.toFixed(2)}€</td>
                                        <td>
                                            <button onclick="BusinessModule.togglePaymentStatus('${doc.id}', 'expert')" class="status-badge" style="border:none; cursor:pointer; background: ${isExpertPaid ? '#dcfce7' : '#f1f5f9'}; color: ${isExpertPaid ? '#166534' : '#64748b'};">
                                                ${isExpertPaid ? 'Encaissé' : 'En attente'}
                                            </button>
                                        </td>
                                        <td>
                                            <button onclick="BusinessModule.togglePaymentStatus('${doc.id}', 'platform')" class="status-badge" style="border:none; cursor:pointer; background: ${isPlatformPaid ? '#dcfce7' : '#fef3c7'}; color: ${isPlatformPaid ? '#166534' : '#92400e'};">
                                                ${isPlatformPaid ? 'Payée' : 'À régler'}
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;
    },

    renderEmptyState: (type) => `
        <div class="dash-card" style="padding: 60px; text-align: center; border: 2px dashed #f1f5f9; border-radius: 24px; background:white;">
            <div style="font-size: 3rem; margin-bottom: 20px;">${type === 'quote' ? '📄' : '💰'}</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Aucun document</h3>
            <p style="color: #64748b; margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto;">Commencez par créer votre premier ${type === 'quote' ? 'devis' : 'document de facturation'}.</p>
        </div>
    `,

    // --- Actions ---
    createNewDoc: (type = 'quote') => {
        BusinessModule.editingId = null;
        BusinessModule.currentType = type;
        BusinessModule.currentItems = [{ id: Date.now(), description: '', quantity: 1, price: 0 }];
        BusinessModule.renderEditor();
    },

    editDoc: async (id) => {
        const supabase = await BusinessModule.waitForSupabase();
        const { data, error } = await supabase.from('business_docs').select('*').eq('id', id).single();
        if (error) return Swal.fire('Erreur', 'Impossible de charger le document.', 'error');

        BusinessModule.editingId = data.id;
        BusinessModule.currentType = data.doc_type;
        BusinessModule.currentItems = data.items || [];
        BusinessModule.renderEditor();

        setTimeout(() => {
            document.getElementById('quote-client-name').value = data.client_name;
            document.getElementById('quote-project-title').value = data.project_title;
        }, 50);
    },

    togglePaymentStatus: async (id, type) => {
        const supabase = await BusinessModule.waitForSupabase();
        const { data, error: fetchError } = await supabase.from('business_docs').select('*').eq('id', id).single();
        if (fetchError) return;

        const field = type === 'expert' ? 'expert_paid_at' : 'platform_paid_at';
        const newValue = data[field] ? null : new Date().toISOString();

        const { error: updateError } = await supabase.from('business_docs').update({ [field]: newValue }).eq('id', id);
        if (updateError) return Swal.fire('Erreur', 'Mise à jour échouée.', 'error');

        BusinessModule.switchTab('payments');
    },

    // --- Editor ---
    renderEditor: () => {
        const content = document.getElementById('business-dynamic-content');
        const isInvoice = BusinessModule.currentType === 'invoice';
        
        content.innerHTML = `
            <div class="quote-editor" style="background: white; border-radius: 20px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); animation: fadeIn 0.3s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                    <div>
                        <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0;">${isInvoice ? 'Édition Facture' : 'Édition Devis'}</h2>
                        <span style="font-size: 0.7rem; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-weight: 800; margin-top: 8px; display:inline-block;">MODE DTC BUSINESS v3.0</span>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button onclick="BusinessModule.saveDoc()" class="cta-button primary" style="padding:12px 24px; border-radius:12px; font-weight:800;">Sauvegarder</button>
                        <button onclick="BusinessModule.switchTab(BusinessModule.activeTab)" class="cta-button ghost" style="padding:12px 24px; border-radius:12px; color: #ef4444;">Fermer</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
                    <div class="form-group">
                        <label style="display:block; font-size:0.7rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Client / Organisme</label>
                        <input type="text" id="quote-client-name" placeholder="ex: Ministère de l'Énergie" class="input-modern" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px;">
                    </div>
                    <div class="form-group">
                        <label style="display:block; font-size:0.7rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Intitulé du Projet</label>
                        <input type="text" id="quote-project-title" placeholder="ex: Audit Stratégique Q3" class="input-modern" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px;">
                    </div>
                </div>

                <div id="quote-items-container" style="margin-bottom: 32px;">
                    <div style="display: grid; grid-template-columns: 3fr 1fr 1.5fr 40px; gap: 16px; margin-bottom: 12px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
                        <span style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Désignation des Prestations</span>
                        <span style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Unité</span>
                        <span style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">P.U (€)</span>
                        <span></span>
                    </div>
                    <div id="quote-items-list">
                        ${BusinessModule.renderItemsList()}
                    </div>
                    <button onclick="BusinessModule.addItem()" class="cta-button ghost" style="width: 100%; margin-top: 16px; font-size: 0.85rem; border-style: dashed; padding:12px;">+ Ajouter une prestation</button>
                </div>

                <div style="max-width: 400px; margin-left: auto; background: #f8fafc; border-radius: 20px; padding: 24px; border: 1px solid #f1f5f9;">
                    <div id="quote-summary">
                        ${BusinessModule.renderSummary()}
                    </div>
                    <button onclick="BusinessModule.handlePDFGeneration()" class="cta-button primary" style="width: 100%; margin-top: 24px; background: #111827; padding:16px; border-radius:14px; font-weight:800;">
                        <i class="fas fa-file-pdf"></i> Générer le PDF Vectoriel
                    </button>
                </div>
            </div>
        `;
    },

    addItem: () => {
        BusinessModule.currentItems.push({ id: Date.now(), description: '', quantity: 1, price: 0 });
        const list = document.getElementById('quote-items-list');
        if (list) {
            list.innerHTML = BusinessModule.renderItemsList();
            BusinessModule.updateSummary();
        }
    },

    removeItem: (id) => {
        BusinessModule.currentItems = BusinessModule.currentItems.filter(item => item.id !== id);
        if (BusinessModule.currentItems.length === 0) BusinessModule.currentItems.push({ id: Date.now(), description: '', quantity: 1, price: 0 });
        BusinessModule.updateUI();
    },

    updateItem: (id, field, value) => {
        const item = BusinessModule.currentItems.find(i => i.id === id);
        if (item) {
            item[field] = field === 'description' ? value : parseFloat(value) || 0;
            BusinessModule.updateSummary();
        }
    },

    renderItemsList: () => {
        return BusinessModule.currentItems.map(item => `
            <div style="display: grid; grid-template-columns: 3fr 1fr 1.5fr 40px; gap: 16px; margin-bottom: 12px; align-items: center;">
                <input type="text" value="${item.description}" oninput="BusinessModule.updateItem(${item.id}, 'description', this.value)" placeholder="Description de l'item..." style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem;" class="input-modern">
                <input type="number" value="${item.quantity}" oninput="BusinessModule.updateItem(${item.id}, 'quantity', this.value)" style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem;" class="input-modern">
                <input type="number" value="${item.price}" oninput="BusinessModule.updateItem(${item.id}, 'price', this.value)" style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; font-weight: 700;" class="input-modern">
                <button onclick="BusinessModule.removeItem(${item.id})" style="background:none; border:none; color:#ef4444; font-size: 1.2rem; cursor:pointer;">&times;</button>
            </div>
        `).join('');
    },

    updateUI: () => {
        const list = document.getElementById('quote-items-list');
        if (list) list.innerHTML = BusinessModule.renderItemsList();
        BusinessModule.updateSummary();
    },

    updateSummary: () => {
        const summary = document.getElementById('quote-summary');
        if (summary) summary.innerHTML = BusinessModule.renderSummary();
    },

    renderSummary: () => {
        const subtotal = BusinessModule.currentItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const commission = subtotal * BusinessModule.commissionRate;
        const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';
        
        return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; color: #64748b;">
                <span>Ventes HT</span>
                <span style="font-weight: 700; color: #0f172a;">${subtotal.toFixed(2)}${currency}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; color: #10b981;">
                <span>Commission Plateforme (12%)</span>
                <span style="font-weight: 700;">- ${commission.toFixed(2)}${currency}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; font-size: 1.1rem; color: #0f172a;">
                <span style="font-weight: 800;">Reversement Expert</span>
                <span style="font-weight: 900; color: #10b981;">${(subtotal - commission).toFixed(2)}${currency}</span>
            </div>
        `;
    },

    saveDoc: async () => {
        const clientName = document.getElementById('quote-client-name').value;
        const projectTitle = document.getElementById('quote-project-title').value;

        if (!clientName || !projectTitle) return Swal.fire('Oups', 'Veuillez remplir les informations client et projet.', 'warning');

        const subtotal = BusinessModule.currentItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const commission = subtotal * BusinessModule.commissionRate;

        try {
            const supabase = await BusinessModule.waitForSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            
            const docData = {
                expert_id: user.id,
                client_name: clientName,
                project_title: projectTitle,
                doc_type: BusinessModule.currentType,
                items: BusinessModule.currentItems,
                subtotal: subtotal,
                commission_amount: commission,
                total_amount: subtotal,
                status: BusinessModule.currentType === 'quote' ? 'draft' : 'sent'
            };

            if (BusinessModule.editingId) {
                await supabase.from('business_docs').update(docData).eq('id', BusinessModule.editingId);
            } else {
                const res = await supabase.from('business_docs').insert([docData]).select();
                if (res.data && res.data[0]) BusinessModule.editingId = res.data[0].id;
            }

            Swal.fire({ title: 'Succès !', text: 'Document synchronisé.', icon: 'success', timer: 1500, showConfirmButton: false });
            BusinessModule.switchTab(BusinessModule.activeTab);

        } catch (err) {
            Swal.fire('Erreur', 'Échec de la sauvegarde cloud.', 'error');
        }
    },

    // --- PDF ENGINE (HIGH PERFORMANCE VECTOR) ---
    handlePDFGeneration: async () => {
        const client = document.getElementById('quote-client-name').value || 'Inconnu';
        const project = document.getElementById('quote-project-title').value || 'Mission sans titre';
        const items = BusinessModule.currentItems;
        const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        
        const docInfo = {
            id: BusinessModule.editingId || 'DRAFT',
            type: BusinessModule.currentType,
            client,
            project,
            items,
            subtotal
        };

        await BusinessModule.PDF.generate(docInfo);
    },

    directExportPDF: async (id) => {
        const supabase = await BusinessModule.waitForSupabase();
        const { data, error } = await supabase.from('business_docs').select('*').eq('id', id).single();
        if (error) return;

        await BusinessModule.PDF.generate({
            id: data.id,
            type: data.doc_type,
            client: data.client_name,
            project: data.project_title,
            items: data.items,
            subtotal: data.subtotal
        });
    },

    PDF: {
        generate: async (doc) => {
            if (typeof pdfMake === 'undefined') return Swal.fire('Erreur System', 'Moteur PDF non chargé.', 'error');

            Swal.fire({ title: 'Génération en cours...', html: 'Construction du document vectoriel DTC...', didOpen: () => Swal.showLoading() });

            const isInvoice = doc.type === 'invoice';
            const number = `DTC-${isInvoice ? 'FAC' : 'DEV'}-${new Date().getFullYear()}-${doc.id.slice(0, 6).toUpperCase()}`;
            
            const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';
            const locale = (typeof window.TerritoryConfig !== 'undefined') ? (window.TerritoryConfig.getLocale() || 'fr-FR').replace('_', '-') : 'fr-FR';

            const tableBody = [
                [
                    { text: 'Désignation', style: 'tableHeader', alignment: 'left' },
                    { text: 'Qté', style: 'tableHeader', alignment: 'center' },
                    { text: `P.U HT (${currency})`, style: 'tableHeader', alignment: 'right' },
                    { text: `Total HT (${currency})`, style: 'tableHeader', alignment: 'right' }
                ]
            ];

            doc.items.forEach(item => {
                tableBody.push([
                    { text: item.description || 'Prestation', fontSize: 10, margin: [0, 5, 0, 5] },
                    { text: item.quantity.toString(), alignment: 'center', fontSize: 10, margin: [0, 5, 0, 5] },
                    { text: item.price.toFixed(2) + ' ' + currency, alignment: 'right', fontSize: 10, margin: [0, 5, 0, 5] },
                    { text: (item.quantity * item.price).toFixed(2) + ' ' + currency, alignment: 'right', fontSize: 10, bold: true, margin: [0, 5, 0, 5] }
                ]);
            });

            const docDefinition = {
                pageSize: 'A4',
                pageMargins: [40, 60, 40, 60],
                defaultStyle: { font: 'Roboto', fontSize: 10, color: '#1f2937' },
                styles: {
                    header: { fontSize: 24, bold: true, color: '#10b981', margin: [0, 0, 0, 10] },
                    subheader: { fontSize: 14, bold: true, color: '#64748b', margin: [0, 15, 0, 5] },
                    docLabel: { fontSize: 16, bold: true, color: '#111827', alignment: 'right' },
                    tableHeader: { bold: true, fontSize: 9, color: '#ffffff', fillColor: '#10b981', alignment: 'center', margin: [0, 5, 0, 5] },
                    totalLabel: { bold: true, fontSize: 11, alignment: 'right', color: '#64748b' },
                    totalValue: { bold: true, fontSize: 14, alignment: 'right', color: '#10b981' }
                },
                content: [
                    // Header
                    {
                        columns: [
                            {
                                stack: [
                                    { text: 'DOMTOM CONNECT', style: 'header' },
                                    { text: 'Expertise Territoriale & Diaspora', fontSize: 9, color: '#64748b' }
                                ]
                            },
                            {
                                stack: [
                                    { text: isInvoice ? 'FACTURE OFFICIELLE' : 'DEVIS PROFESSIONNEL', style: 'docLabel' },
                                    { text: `N° ${number}`, alignment: 'right', fontSize: 11, bold: true },
                                    { text: `Date: ${new Date().toLocaleDateString(locale)}`, alignment: 'right', fontSize: 9, color: '#64748b' }
                                ]
                            }
                        ]
                    },
                    { canvas: [{ type: 'line', x1: 0, y1: 15, x2: 515, y2: 15, lineWidth: 1, lineColor: '#f1f5f9' }], margin: [0, 0, 0, 30] },
                    
                    // Addresses
                    {
                        columns: [
                            {
                                width: '50%',
                                stack: [
                                    { text: 'PRESTATAIRE :', bold: true, fontSize: 8, color: '#94a3b8', margin: [0, 0, 0, 5] },
                                    { text: window.userProfile?.full_name || 'Expert Certifié Domtom Connect', bold: true, fontSize: 11 },
                                    { text: window.userProfile?.title || 'Partenaire Stratégique', fontSize: 9, color: '#4b5563' },
                                    { text: 'Membre de la Diaspora Territoriale', fontSize: 8, italic: true, color: '#64748b', margin: [0, 4, 0, 0] }
                                ]
                            },
                            {
                                width: '50%',
                                stack: [
                                    { text: 'CLIENT :', bold: true, alignment: 'right', fontSize: 8, color: '#94a3b8', margin: [0, 0, 0, 5] },
                                    { text: doc.client.toUpperCase(), bold: true, alignment: 'right', fontSize: 11 },
                                    { text: `Objet: ${doc.project}`, alignment: 'right', fontSize: 9, color: '#4b5563' }
                                ]
                            }
                        ],
                        margin: [0, 0, 0, 40]
                    },

                    // Table
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto', 'auto', 'auto'],
                            body: tableBody
                        },
                        layout: {
                            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 0 : 0.5,
                            vLineWidth: () => 0,
                            hLineColor: () => '#f1f5f9',
                            paddingLeft: () => 8,
                            paddingRight: () => 8
                        }
                    },

                    // Totals
                    {
                        columns: [
                            { width: '*', text: '' },
                            {
                                width: 220,
                                margin: [0, 30, 0, 0],
                                table: {
                                    widths: ['*', 'auto'],
                                    body: [
                                        [
                                            { text: 'TOTAL HT :', style: 'totalLabel', margin: [0, 5, 0, 5], border: [false, false, false, false] },
                                            { text: doc.subtotal.toFixed(2) + ' ' + currency, style: 'totalLabel', alignment: 'right', margin: [0, 5, 0, 5], border: [false, false, false, false] }
                                        ],
                                        [
                                            { text: 'TOTAL À PAYER :', style: 'totalValue', margin: [0, 10, 0, 0], border: [false, true, false, false], borderColor: '#f1f5f9' },
                                            { text: doc.subtotal.toFixed(2) + ' ' + currency, style: 'totalValue', alignment: 'right', margin: [0, 10, 0, 0], border: [false, true, false, false], borderColor: '#f1f5f9' }
                                        ]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    },

                    // Footer / Legal
                    {
                        stack: [
                            { text: 'MENTIONS LÉGALES & CONDITIONS', bold: true, fontSize: 8, color: '#94a3b8', margin: [0, 60, 0, 5] },
                            { 
                                text: isInvoice 
                                    ? 'Facture à régler à réception. Aucun escompte pour paiement anticipé. En cas de retard, une indemnité forfaitaire de 40€ est due.' 
                                    : 'Ce devis est valable 30 jours. La signature de ce document vaut acceptation des conditions générales de service Domtom Connect.',
                                fontSize: 8, color: '#64748b', leadingLineHeight: 1.4
                            },
                            { text: 'Document généré via Domtom Connect Business - Plateforme Tiers de Confiance.', fontSize: 7, color: '#cbd5e1', alignment: 'center', margin: [0, 40, 0, 0] }
                        ]
                    }
                ]
            };

            pdfMake.createPdf(docDefinition).download(`${isInvoice ? 'Facture' : 'Devis'}_DTC_${doc.client.replace(/\s/g, '_')}.pdf`, () => {
                Swal.fire({ title: 'Téléchargé !', text: 'Document vectoriel prêt.', icon: 'success', timer: 1500, showConfirmButton: false });
            });
        }
    }
};

window.BusinessModule = BusinessModule;
