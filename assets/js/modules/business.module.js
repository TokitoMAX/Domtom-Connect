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
        
        container.innerHTML = `<div style="text-align:center; padding: 100px; font-family: sans-serif;"><span class="loader"></span><p style="margin-top:20px; color:#64748b; font-weight:800;">Chargement du centre d'affaires...</p></div>`;

        await BusinessModule.refreshExpertProfile();
        BusinessModule.activeTab = localStorage.getItem('dtc_business_tab') || 'quotes';
        
        container.innerHTML = `
            <div class="business-pro-container" style="padding: clamp(20px, 4vw, 48px); font-family: 'Plus Jakarta Sans', sans-serif; background: #fafafa; min-height: 100vh;">
                <!-- Header Stratégique -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; flex-wrap: wrap; gap: 24px;">
                    <div>
                        <h1 style="font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 950; color: #020617; letter-spacing: -0.05em; margin: 0;">Business Pilotage</h1>
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
                .btn-dtc { padding: 16px 32px; border-radius: 16px; font-weight: 900; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-dtc.primary-black { background: #020617; color: white; box-shadow: 0 10px 20px rgba(2, 6, 23, 0.15); }
                .btn-dtc.secondary-green { background: #10b981; color: white; }
                .btn-dtc:hover { transform: translateY(-3px); filter: brightness(1.1); }
                
                .stat-card { background: white; padding: 32px; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
                .stat-label { font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
                .stat-value { font-size: 2.5rem; font-weight: 950; color: #020617; margin: 12px 0; letter-spacing: -0.04em; }
                .stat-indicator { font-size: 0.8rem; font-weight: 800; }
                .stat-indicator.green { color: #10b981; }
                .stat-indicator.blue { color: #3b82f6; }
                .stat-indicator.gray { color: #94a3b8; }

                .tab-lux-btn { background: none; border: none; padding: 16px 0; font-size: 1.1rem; font-weight: 900; color: #94a3b8; cursor: pointer; position: relative; }
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
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#ef4444; font-weight:800;">Erreur: ${err.message}</div>`;
        }
    },

    // --- List Rendering ---
    renderList: (container, data, type) => {
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:80px; background:#f8fafc; border-radius:24px; border:1px solid #e2e8f0;">
                    <div style="font-size:3rem; margin-bottom:20px;">📄</div>
                    <h3 style="font-weight:900; color:#020617;">Aucun document trouvé</h3>
                    <p style="color:#64748b; font-weight:600;">Commencez par créer votre premier ${type === 'quotes' ? 'devis' : 'facture'}.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="text-align:left; border-bottom:1px solid #f1f5f9;">
                        <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em;">Document</th>
                        <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em;">Client</th>
                        <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em;">Statut</th>
                        <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em;">Montant Net</th>
                        <th style="padding:20px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; text-align:right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(doc => `
                        <tr class="lux-table-row" style="border-bottom:1px solid #f8fafc; transition: all 0.2s;">
                            <td style="padding:24px 20px;">
                                <div style="font-weight:900; color:#020617; font-size:1.1rem;">#${doc.doc_number || doc.id.slice(0,8)}</div>
                                <div style="font-size:0.8rem; color:#94a3b8; font-weight:700;">${new Date(doc.created_at).toLocaleDateString()}</div>
                            </td>
                            <td style="padding:24px 20px;">
                                <div style="font-weight:800; color:#020617;">${doc.client_name || 'Client Inconnu'}</div>
                                <div style="font-size:0.75rem; color:#64748b;">${doc.client_email || ''}</div>
                            </td>
                            <td style="padding:24px 20px;">
                                ${BusinessModule.renderStatusBadge(doc.status, doc.type)}
                            </td>
                            <td style="padding:24px 20px;">
                                <div style="font-weight:950; color:#020617; font-size:1.2rem;">${(doc.total_ttc || 0).toFixed(2)} €</div>
                                <div style="font-size:0.65rem; color:#ef4444; font-weight:800; text-transform:uppercase;">${((doc.total_ttc || 0) * BusinessModule.commissionRate).toFixed(2)} € Frais DTC</div>
                            </td>
                            <td style="padding:24px 20px; text-align:right;">
                                <div style="display:flex; gap:8px; justify-content:flex-end;">
                                    ${doc.type === 'quote' && doc.status === 'draft' ? `<button onclick="BusinessModule.handleSignatureFlow('${doc.id}')" class="btn-icon sig" title="Envoyer pour signature"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34" /><polygon points="18 2 22 6 12 16 8 16 8 12 18 2" /></svg></button>` : ''}
                                    <button onclick="BusinessModule.downloadPDF('${doc.id}')" class="btn-icon pdf" title="Télécharger PDF"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button>
                                    <button onclick="BusinessModule.editDoc('${doc.id}')" class="btn-icon edit" title="Modifier"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <style>
                .lux-table-row:hover { background: #fcfcfd !important; }
                .btn-icon { width: 44px; height: 44px; border-radius: 12px; border: 1px solid #f1f5f9; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; color: #64748b; }
                .btn-icon:hover { background: #020617; border-color: #020617; color: white; transform: scale(1.1); }
                .btn-icon.sig:hover { background: #10b981; border-color: #10b981; }
                .btn-icon.pdf:hover { background: #3b82f6; border-color: #3b82f6; }
            </style>
        `;
    },

    renderStatusBadge: (status, type) => {
        const styles = {
            draft: { bg: '#f1f5f9', color: '#64748b', label: 'Brouillon' },
            sent: { bg: '#dcfce7', color: '#166534', label: 'Envoyé' },
            signed: { bg: '#f0fdf4', color: '#10b981', label: 'Signé (Expert)' },
            paid: { bg: '#ecfdf5', color: '#10b981', label: 'Payé' },
            partial: { bg: '#fff7ed', color: '#c2410c', label: 'Acompte Payé' }
        };
        const s = styles[status] || styles.draft;
        return `<span style="background:${s.bg}; color:${s.bg}; padding:1px; border-radius:100px; display:inline-flex;"><span style="background:white; color:${s.color}; font-size:0.65rem; font-weight:900; text-transform:uppercase; padding:4px 12px; border-radius:100px; border:1px solid ${s.bg}">${s.label}</span></span>`;
    },

    // --- Business Flow Actions ---
    
    async handleSignatureFlow(docId) {
        if (!window.Swal) return;
        const { value: email } = await Swal.fire({
            title: 'Signature Électronique',
            text: 'Envoyez ce devis pour signature sécurisée à votre client.',
            input: 'email',
            inputPlaceholder: 'Email du client...',
            confirmButtonText: 'ENVOYER POUR SIGNATURE',
            confirmButtonColor: '#10b981',
            showCancelButton: true
        });

        if (email) {
            Swal.fire({ title: 'Génération du contrat...', html: '<span class="loader"></span>', showConfirmButton: false });
            // Simulation SaaS API call
            await new Promise(r => setTimeout(r, 1500));
            await window._supabase.from('business_docs').update({ status: 'sent', client_email: email }).eq('id', docId);
            
            Swal.fire({
                title: 'Contrat Envoyé !',
                text: 'Dès que le client signe, vous recevrez une notification pour le paiement de l\'acompte.',
                icon: 'success'
            });
            BusinessModule.switchTab('quotes');
        }
    },

    openDocEditor: async (type = 'quote') => {
        const container = document.getElementById('business-dynamic-content');
        if (!container) return;

        BusinessModule.currentItems = [];
        const isOwner = ['porteur', 'owner'].includes(window.App.state.role);

        container.innerHTML = `
            <div style="background: #f8fafc; border-radius: 28px; border: 1.5px dashed #cbd5e1; padding: 40px; margin-top: 20px;">
                <h3 style="font-weight:950; color:#020617; font-size:1.5rem; letter-spacing:-0.03em; margin-bottom:32px;">Édition du nouveau ${type === 'quote' ? 'Devis' : 'Document'}</h3>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:40px;">
                    <div class="form-group-lux">
                        <label>Nom du Client / Projet</label>
                        <input type="text" id="doc-client-name" placeholder="Ex: Jean Dupont (Application Mobile)" class="lux-input">
                    </div>
                    <div class="form-group-lux">
                        <label>Email de facturation</label>
                        <input type="email" id="doc-client-email" placeholder="client@exemple.com" class="lux-input">
                    </div>
                </div>

                <!-- DYNAMIC ITEMS ENGINE -->
                <div id="items-engine-container" style="background:white; border-radius:24px; padding:32px; border:1px solid #e2e8f0; margin-bottom:32px;">
                    <h4 style="font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; border-bottom:1px solid #f1f5f9; padding-bottom:16px; margin-bottom:24px;">Lignes de prestation</h4>
                    <div id="items-list-mount"></div>
                    <button onclick="BusinessModule.addItemRow()" style="margin-top:20px; background:#f1f5f9; border:none; padding:12px 24px; border-radius:12px; font-weight:800; cursor:pointer; color:#020617;">+ Ajouter une ligne</button>
                </div>

                <!-- CONFIG ACOMPTE & OPTIONS -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:24px; margin-bottom:40px;">
                    <div class="opt-card">
                        <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                            <input type="checkbox" id="doc-has-acompte" onchange="document.getElementById('acompte-input-wrap').style.display = this.checked ? 'block' : 'none'" style="width:20px; height:20px;">
                            <span style="font-weight:800; color:#020617;">Exiger un acompte</span>
                        </label>
                        <div id="acompte-input-wrap" style="display:none; margin-top:16px;">
                            <input type="number" id="doc-acompte-percent" value="30" style="width:80px; padding:10px; border-radius:12px; border:1px solid #e2e8f0; font-weight:900;"> %
                        </div>
                    </div>
                    <div class="opt-card">
                        <label style="font-weight:800; color:#020617; display:block; margin-bottom:12px;">TVA Appliquée</label>
                        <select id="doc-tva-rate" style="width:100%; padding:14px; border-radius:14px; border:1px solid #e2e8f0; font-weight:800;">
                            <option value="0">0% (Indépendant France/Auto-entrep.)</option>
                            <option value="8.5">8.5% (DOM-TOM Standard)</option>
                            <option value="20">20% (France Métro)</option>
                        </select>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:16px; border-top:2px solid #f1f5f9; padding-top:40px;">
                    <div style="flex-grow:1; text-align:left;">
                        <div style="font-size:0.75rem; font-weight:800; color:#94a3b8;">Total Net (après frais DTC 12.5%)</div>
                        <div id="doc-final-net" style="font-size:1.8rem; font-weight:950; color:#10b981;">0,00 €</div>
                    </div>
                    <button onclick="BusinessModule.switchTab('quotes')" style="padding:16px 32px; border-radius:16px; background:white; border:1.5px solid #e2e8f0; font-weight:900; color:#64748b; cursor:pointer;">Annuler</button>
                    <button onclick="BusinessModule.saveDoc('${type}')" class="btn-dtc primary-black" id="save-doc-btn">ENREGISTRER LE ${type === 'quote' ? 'DEVIS' : 'DOCUMENT'}</button>
                </div>
            </div>

            <style>
                .lux-input { width:100%; padding:16px; border-radius:16px; border:1.5px solid #e2e8f0; font-weight:700; font-family:inherit; transition:0.2s; }
                .lux-input:focus { border-color:#020617; outline:none; background:white; }
                .opt-card { background:white; padding:24px; border-radius:20px; border:1px solid #e2e8f0; }
                .form-group-lux label { display:block; font-size:0.7rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:10px; padding-left:4px; }
            </style>
        `;

        BusinessModule.addItemRow();
    },

    addItemRow: () => {
        const mount = document.getElementById('items-list-mount');
        const id = Date.now();
        const row = document.createElement('div');
        row.id = `item-row-${id}`;
        row.style = "display:grid; grid-template-columns: 3fr 1fr 1fr 40px; gap:16px; margin-bottom:12px; align-items:center;";
        row.innerHTML = `
            <input type="text" placeholder="Description de la prestation..." class="lux-input item-desc">
            <input type="number" placeholder="Qté" value="1" class="lux-input item-qty" onchange="BusinessModule.calculateFinalNet()">
            <input type="number" placeholder="Prix Unitaire" class="lux-input item-price" onchange="BusinessModule.calculateFinalNet()">
            <button onclick="this.parentElement.remove(); BusinessModule.calculateFinalNet();" style="border:none; background:none; color:#ef4444; font-weight:900; cursor:pointer; font-size:1.5rem;">&times;</button>
        `;
        mount.appendChild(row);
    },

    calculateFinalNet: () => {
        const rows = document.querySelectorAll('[id^="item-row-"]');
        let totalHT = 0;
        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            totalHT += (qty * price);
        });

        const tvaRate = parseFloat(document.getElementById('doc-tva-rate').value) || 0;
        const totalTTC = totalHT * (1 + tvaRate / 100);
        const netAfterDTC = totalTTC * (1 - BusinessModule.commissionRate);

        const netDisplay = document.getElementById('doc-final-net');
        if (netDisplay) netDisplay.textContent = `${netAfterDTC.toFixed(2)} €`;
        
        return totalTTC;
    },

    async saveDoc(type) {
        const saveBtn = document.getElementById('save-doc-btn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Enregistrement...';

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expirée");

            const totalTTC = BusinessModule.calculateFinalNet();
            const hasAcompte = document.getElementById('doc-has-acompte').checked;
            const acomptePercent = hasAcompte ? parseInt(document.getElementById('doc-acompte-percent').value) : 0;

            const docData = {
                user_id: session.user.id,
                type: type,
                client_name: document.getElementById('doc-client-name').value,
                client_email: document.getElementById('doc-client-email').value,
                total_ttc: totalTTC,
                acompte_percent: acomptePercent,
                status: 'draft',
                created_at: new Date()
            };

            const { error } = await window._supabase.from('business_docs').insert(docData);
            if (error) throw error;

            if (window.Swal) {
                await Swal.fire({ title: 'Document Créé !', text: type === 'quote' ? 'Votre devis est prêt à être envoyé pour signature.' : 'Votre facture est enregistrée.', icon: 'success' });
            }
            BusinessModule.switchTab(type === 'quote' ? 'quotes' : 'invoices');
        } catch (err) {
            alert(err.message);
            saveBtn.disabled = false;
            saveBtn.textContent = 'RÉESSAYER';
        }
    },

    fetchDocs: async (type) => {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return [];
        
        let query = window._supabase.from('business_docs').select('*').eq('user_id', session.user.id);
        if (type) query = query.eq('type', type);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    refreshExpertProfile: async () => {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;
        const { data } = await window._supabase.from('profiles').select('*').eq('id', session.user.id).single();
        BusinessModule.expertProfile = data;
    }
};

window.BusinessModule = BusinessModule;
