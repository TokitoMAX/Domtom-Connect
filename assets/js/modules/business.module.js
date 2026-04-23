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
        
        // Tier check disabled by request to allow full access to billing tools
        const tier = (BusinessModule.expertProfile && BusinessModule.expertProfile.subscription_tier) || window.currentSubscriptionTier || 'free';
        // const isPartner = (tier !== 'free');
        // if (!isPartner) {
        //     BusinessModule.renderLockedView(container);
        //     return;
        // }

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
                
                table.dtc-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                table.dtc-table th { text-align: left; padding: 12px; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
                table.dtc-table td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #0f172a; }
            </style>
        `;

        await BusinessModule.switchTab(BusinessModule.activeTab);
    },

    renderLockedView: (container) => {
        container.innerHTML = `
            <div class="locked-overlay-container" style="padding: 24px;">
                <!-- Mockup Background (Visible but blurred) -->
                <div class="locked-content-blur">
                    <div class="dash-section-header" style="margin-bottom: 32px; display:flex; justify-content:space-between; align-items:flex-end;">
                        <div style="flex:1;">
                            <h2 class="dash-title" style="margin: 0;">Centre de Pilotage Business</h2>
                            <p class="dash-subtitle" style="margin: 8px 0 0 0;">Gérez vos devis, factures et encaissements.</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 20px; margin-top: 32px;">
                        <div style="flex:1; height: 120px; background:#f1f5f9; border-radius:20px;"></div>
                        <div style="flex:1; height: 120px; background:#f1f5f9; border-radius:20px;"></div>
                        <div style="flex:1; height: 120px; background:#f1f5f9; border-radius:20px;"></div>
                    </div>
                    <div style="margin-top: 40px; height: 300px; background:#f8fafc; border-radius:24px; border:2px dashed #e2e8f0;"></div>
                </div>

                <!-- Teaser Overlay -->
                <div class="gateway-teaser-overlay">
                    <div class="teaser-card">
                        <div class="teaser-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 15l-3-3m0 0l3-3m-3 3h8M2 12a10 10 0 1120 0 10 10 0 01-20 0z"></path></svg>
                        </div>
                        <h3 class="teaser-title">Élevez votre activité.</h3>
                        <p class="teaser-desc">
                            Le Centre de Pilotage Business est réservé aux **Partenaires Stratégiques** certifiés. 
                            Activez votre collaboration active pour générer vos devis, factures et sécuriser vos reversements.
                        </p>
                        <button onclick="openSubModal('authority')" class="cta-button primary" style="padding:16px 32px; font-weight:900; background:#10b981; border:none; border-radius:16px; font-size:1rem; width:100%;">
                            🚀 Activer ma Collaboration Active
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    switchTab: async (tabId) => {
        BusinessModule.activeTab = tabId;
        localStorage.setItem('dtc_business_tab', tabId);
        
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
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const check = () => {
                attempts++;
                // Check for both _supabase (project standard) and supabase
                const s = window._supabase || window.supabase;
                if (s && s.auth) resolve(s);
                else if (attempts > 100) { // 10 seconds timeout
                    console.warn("DTC Business: Supabase timeout, using Mock/Limited mode.");
                    resolve(null);
                } else setTimeout(check, 100);
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
                            <div style="display:flex; gap:8px;">
                                <span class="status-badge status-${doc.status || 'draft'}">${doc.status || 'Brouillon'}</span>
                                ${doc.signature_status && doc.signature_status !== 'none' ? `
                                    <span style="font-size:0.6rem; background:#f0fdf4; color:#10b981; padding:2px 8px; border-radius:100px; font-weight:800; border:1px solid #dcfce7; display:flex; align-items:center; gap:4px;">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5" /></svg>
                                        ${doc.signature_status === 'signed' ? 'Signe' : 'A signer'}
                                    </span>
                                ` : ''}
                            </div>
                            <span style="font-weight:800; color:#cbd5e1; font-size:0.8rem;">#${doc.id.slice(0,6).toUpperCase()}</span>
                        </div>
                        <h4 style="font-weight:800; margin:0 0 4px 0;">${doc.client_name}</h4>
                        <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">${doc.project_title}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f8fafc; padding-top:16px;">
                            <span style="font-weight:900; font-size:1.1rem; color:#10b981;">${doc.total_ttc ? doc.total_ttc.toFixed(2) : doc.total_amount.toFixed(2)}€</span>
                            <div style="display:flex; gap:8px;">
                                <button class="cta-button ghost" style="padding:8px; border:none; background:none;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                <button onclick="event.stopPropagation(); BusinessModule.directExportPDF('${doc.id}')" class="cta-button ghost" style="padding:8px; color:#10b981; border:none; background:none;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderInvoicesList: (container, data) => {
        if (data.length === 0) { container.innerHTML = BusinessModule.renderEmptyState('invoice'); return; }
        const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';
        
        container.innerHTML = `
            <div class="cards-list-modern" style="display: grid; gap: 16px;">
                ${data.map(doc => `
                    <div class="doc-card premium" style="background:white; border-radius:18px; border:1px solid #f1f5f9; padding:20px; display:flex; justify-content:space-between; align-items:center; transition:0.3s;" onclick="BusinessModule.editDoc('${doc.id}')">
                        <div style="display:flex; gap:16px; align-items:center;">
                            <div style="width:48px; height:48px; background:#f8fafc; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <div style="font-weight:900; color:#0f172a; margin-bottom:2px;">FAC-${doc.id.slice(0,4).toUpperCase()}</div>
                                <div style="font-size:0.75rem; color:#64748b; font-weight:700;">${doc.client_name} • ${new Date(doc.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div style="text-align:right; display:flex; align-items:center; gap:20px;">
                            <div style="display:none; @media (min-width: 640px) { display:block; }">
                                <span class="status-badge status-${doc.status}" style="padding:6px 12px; border-radius:100px;">${doc.status}</span>
                                ${doc.signature_status && doc.signature_status !== 'none' ? `
                                    <div style="font-size:0.6rem; color:#10b981; font-weight:800; margin-top:4px; display:flex; align-items:center; gap:4px; justify-content:flex-end;">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5" /></svg>
                                        ${doc.signature_status === 'signed' ? 'SIGNE' : 'A SIGNER'}
                                    </div>
                                ` : ''}
                            </div>
                            <div style="font-weight:950; font-size:1.1rem; color:#0f172a;">${(doc.total_ttc || doc.subtotal).toFixed(2)}${currency}</div>
                            <button onclick="event.stopPropagation(); BusinessModule.directExportPDF('${doc.id}')" class="cta-button ghost" style="padding:10px; color:#10b981; background:#f0fdf4; border:none; border-radius:10px;">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <style>
                @media (max-width: 640px) {
                    .doc-card.premium { flex-direction: column; align-items: flex-start !important; gap: 16px; }
                    .doc-card.premium div[style*="text-align:right"] { width: 100%; justify-content: space-between; border-top: 1px solid #f8fafc; padding-top: 12px; }
                }
            </style>
        `;
    },

    renderPaymentsList: (container, data) => {
        const trackedDocs = data.filter(d => d.status === 'sent' || d.status === 'paid' || d.status === 'accepted');
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h3 style="font-weight:900; margin:0; font-size:1.1rem; color:#0f172a;">Suivi des Encaissements</h3>
            </div>
            ${trackedDocs.length === 0 ? `<div style="text-align:center; padding:60px; color:#94a3b8; background:white; border-radius:24px; border:1px dashed #e2e8f0;">Aucun flux financier en attente.</div>` : `
                <div class="payments-tracking-list" style="display: grid; gap: 16px;">
                    ${trackedDocs.map(doc => {
                        const commission = doc.commission_amount || (doc.subtotal * BusinessModule.commissionRate);
                        const isExpertPaid = doc.expert_paid_at != null;
                        const isPlatformPaid = doc.platform_paid_at != null;
                        const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';
                        return `
                            <div class="payment-card" style="background:white; border-radius:18px; border:1px solid #f1f5f9; padding:24px;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
                                    <div>
                                        <div style="font-weight:900; color:#0f172a; font-size:0.95rem;">Réf: ${doc.id.slice(0,6).toUpperCase()}</div>
                                        <div style="font-size:0.75rem; color:#64748b; font-weight:700; margin-top:2px;">Client: ${doc.client_name}</div>
                                    </div>
                                    <div style="text-align:right;">
                                        <div style="font-weight:950; font-size:1.2rem; color:#10b981;">+ ${(doc.subtotal - commission).toFixed(2)}${currency} <small style="font-weight:700; color:#94a3b8; font-size:0.65rem;">(Net)</small></div>
                                    </div>
                                </div>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; border-top:1px solid #f8fafc; padding-top:20px;">
                                    <div>
                                        <div style="font-size:0.65rem; font-weight:850; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Virement Expert</div>
                                        <button onclick="BusinessModule.togglePaymentStatus('${doc.id}', 'expert')" class="status-badge" style="width:100%; border:none; cursor:pointer; padding:10px; border-radius:10px; background:${isExpertPaid ? '#dcfce7' : '#f1f5f9'}; color:${isExpertPaid ? '#166534' : '#64748b'}; font-weight:800; font-size:0.75rem;">
                                            ${isExpertPaid ? '✅ Encaissé' : '⏳ En attente'}
                                        </button>
                                    </div>
                                    <div>
                                        <div style="font-size:0.65rem; font-weight:850; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Com plateforme</div>
                                        <button onclick="BusinessModule.togglePaymentStatus('${doc.id}', 'platform')" class="status-badge" style="width:100%; border:none; cursor:pointer; padding:10px; border-radius:10px; background:${isPlatformPaid ? '#dcfce7' : '#fef3c7'}; color:${isPlatformPaid ? '#166534' : '#92400e'}; font-weight:800; font-size:0.75rem;">
                                            ${isPlatformPaid ? '✅ Payée' : '⚠️ À régler'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        `;
    },

    renderEmptyState: (type) => `
        <div class="dash-card" style="padding: 60px; text-align: center; border: 2px dashed #f1f5f9; border-radius: 24px; background:white;">
            <div style="margin-bottom: 24px; display: flex; justify-content: center;">
                <div style="width: 64px; height: 64px; background: #f8fafc; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin-bottom: 12px;">Aucun document</h3>
            <p style="color: #64748b; margin-bottom: 32px; font-weight: 600;">Commencez par créer votre premier ${type === 'quote' ? 'devis' : 'document de facturation'}.</p>
            <button onclick="BusinessModule.createNewDoc('${type}')" class="cta-button primary" style="padding:14px 36px; border-radius:14px; font-weight:900;">+ Nouveau ${type === 'quote' ? 'Devis' : 'Facture'}</button>
        </div>
    `,

    createNewDoc: (type = 'quote') => {
        BusinessModule.editingId = null;
        BusinessModule.currentType = type;
        BusinessModule.currentItems = [{ id: Date.now(), description: '', quantity: 1, price: 0 }];
        BusinessModule.currentDeposit = 30; // Default 30% acompte
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
        BusinessModule.currentDeposit = data.deposit_perc || 0;
        BusinessModule.renderEditor();
        setTimeout(() => {
            document.getElementById('quote-client-name').value = data.client_name;
            document.getElementById('quote-project-title').value = data.project_title;
            if (data.client_details) document.getElementById('quote-client-address').value = data.client_details.address || '';
            if (data.tax_config) document.getElementById('tax-config').value = `${data.tax_config.rate}|${data.tax_config.name}|${data.tax_config.legal_mention}`;
            if (document.getElementById('deposit-perc')) document.getElementById('deposit-perc').value = BusinessModule.currentDeposit;
        }, 50);
    },

    togglePaymentStatus: async (id, type) => {
        const supabase = await BusinessModule.waitForSupabase();
        if (!supabase) return;
        const { data } = await supabase.from('business_docs').select('*').eq('id', id).single();
        const field = type === 'expert' ? 'expert_paid_at' : 'platform_paid_at';
        await supabase.from('business_docs').update({ [field]: data[field] ? null : new Date().toISOString() }).eq('id', id);
        BusinessModule.switchTab('payments');
    },

    renderEditor: () => {
        const content = document.getElementById('business-dynamic-content');
        const isInvoice = BusinessModule.currentType === 'invoice';
        const p = BusinessModule.expertProfile || {};
        const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';

        content.innerHTML = `
            <div class="quote-editor" style="background: white; border-radius: 24px; border: 1px solid #e2e8f0; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); animation: fadeIn 0.3s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; border-bottom: 1px solid #f1f5f9; padding-bottom: 32px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            <h2 style="font-size: 1.75rem; font-weight: 900; margin: 0; color: #0f172a;">${isInvoice ? 'Edition Facture' : 'Edition Devis'}</h2>
                        </div>
                        <span style="font-size: 0.65rem; background: #0f172a; color: white; padding: 4px 12px; border-radius: 100px; font-weight: 850; letter-spacing:0.04em; text-transform:uppercase;">DTC Business Pro v4.0</span>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button onclick="BusinessModule.saveDoc()" class="cta-button primary" style="padding:14px 28px; font-weight:900; border-radius:12px;">Sauvegarder</button>
                        <button onclick="BusinessModule.switchTab(BusinessModule.activeTab)" class="cta-button ghost" style="padding:14px 28px; color: #ef4444; font-weight:800; border-radius:12px;">Fermer</button>
                    </div>
                </div>

                <div class="editor-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-bottom: 40px;">
                    <div style="background: #f8fafc; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.75rem; font-weight: 900; color: #10b981; text-transform: uppercase; margin-bottom: 24px; letter-spacing:0.06em;">Emetteur (Vous)</h4>
                        <input type="text" id="expert-name" value="${p.full_name || ''}" placeholder="Raison Sociale" class="input-modern" style="width:100%; padding:14px; font-size: 0.95rem; margin-bottom:12px; border-radius:12px; border:1px solid #e2e8f0; font-weight:700;">
                        <input type="text" id="expert-siret" value="${p.company_siret || ''}" placeholder="N° SIRET" class="input-modern" style="width:100%; padding:14px; font-size: 0.95rem; margin-bottom:12px; border-radius:12px; border:1px solid #e2e8f0; font-weight:600;">
                        <textarea id="expert-address" placeholder="Adresse Professionnelle" class="input-modern" style="width:100%; padding:14px; font-size: 0.95rem; height: 80px; border-radius:12px; border:1px solid #e2e8f0; color: #475569;">${p.company_address || ''}</textarea>
                    </div>
                    <div style="background: white; padding: 32px; border: 1px solid #f1f5f9; border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                        <h4 style="font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 24px; letter-spacing:0.06em;">Destinataire (Client)</h4>
                        <input type="text" id="quote-client-name" placeholder="Nom du Client" class="input-modern" style="width:100%; padding:14px; font-size: 0.95rem; margin-bottom:12px; border-radius:12px; border:1px solid #e2e8f0; font-weight:700;">
                        <textarea id="quote-client-address" placeholder="Adresse facturation client" class="input-modern" style="width:100%; padding:14px; font-size: 0.95rem; height: 80px; margin-bottom:12px; border-radius:12px; border:1px solid #e2e8f0;"></textarea>
                        <input type="text" id="quote-project-title" placeholder="Objet (ex: Mission Audit Strategique)" class="input-modern" style="width:100%; padding:14px; font-size: 0.95rem; border-radius:12px; border:1px solid #e2e8f0; font-weight:700; background:#f0fdf4; border-color:#dcfce7;">
                    </div>
                </div>

                <div id="quote-items-container" style="margin-bottom: 40px; background:#fff; border-radius:20px; padding:2px;">
                    <div id="quote-items-list">${BusinessModule.renderItemsList()}</div>
                    <button onclick="BusinessModule.addItem()" class="cta-button ghost" style="width: 100%; margin-top: 20px; font-size: 0.9rem; border-style: dashed; padding:16px; border-width:2px; font-weight:800; color:#10b981; border-color:#dcfce7;">+ Ajouter une prestation</button>
                </div>

                <div class="footer-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; align-items: start;">
                    <div style="background: #f8fafc; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 20px; letter-spacing:0.06em;">Parametres Financiers</h4>
                        
                        <div style="margin-bottom:20px;">
                            <label style="display:block; font-size:0.75rem; font-weight:900; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Taxe de zone (TVA)</label>
                            <select id="tax-config" onchange="BusinessModule.updateSummary()" class="input-modern" style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0; font-weight:800; color:#0f172a; background:white;">
                                <option value="0|TVA non applicable|Exoneration de TVA selon l'article 293 B du CGI">Micro-Entreprise (0%)</option>
                                <option value="20|TVA (20%)|TVA comprise">TVA Standard (20%)</option>
                                <option value="8.5|TVA DOM (8.5%)|TVA territoriale">TVA DOM (8.5%)</option>
                            </select>
                        </div>

                        ${!isInvoice ? `
                        <div>
                            <label style="display:block; font-size:0.75rem; font-weight:900; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Acompte à la signature (%)</label>
                            <input type="number" id="deposit-perc" value="${BusinessModule.currentDeposit}" oninput="BusinessModule.currentDeposit = parseFloat(this.value) || 0; BusinessModule.updateSummary();" class="input-modern" style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0; font-weight:800;">
                        </div>
                        ` : ''}
                    </div>

                    <div style="background: #0f172a; border-radius: 28px; padding: 40px; color: white; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                        <div id="quote-summary">${BusinessModule.renderSummary()}</div>
                        <div style="display:grid; gap:12px; margin-top:32px;">
                            <button onclick="BusinessModule.handlePDFGeneration()" class="cta-button primary" style="width: 100%; padding:20px; font-weight:950; background: #10b981; border: none; font-size: 1.15rem; border-radius:16px; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:8px;"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                Generer le PDF
                            </button>
                            <button id="signature-btn" onclick="BusinessModule.activateSignature()" class="cta-button secondary" style="width: 100%; padding:16px; font-weight:900; background: rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:16px; font-size:0.95rem;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" style="margin-right:8px;"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Activer la Signature Electronique
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },


    addItem: () => { BusinessModule.currentItems.push({ id: Date.now(), description: '', quantity: 1, price: 0 }); BusinessModule.updateUI(); },
    removeItem: (id) => { BusinessModule.currentItems = BusinessModule.currentItems.filter(item => item.id !== id); BusinessModule.updateUI(); },
    updateItem: (id, field, value) => { const item = BusinessModule.currentItems.find(i => i.id === id); if (item) { item[field] = field === 'description' ? value : parseFloat(value) || 0; BusinessModule.updateSummary(); } },
    renderItemsList: () => BusinessModule.currentItems.map(item => `
        <div class="item-row" style="display: grid; grid-template-columns: 3fr 1fr 1.5fr 40px; gap: 16px; margin-bottom: 12px; align-items: center;">
            <input type="text" value="${item.description}" oninput="BusinessModule.updateItem(${item.id}, 'description', this.value)" placeholder="Description..." style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; font-weight:600;" class="input-modern">
            <input type="number" value="${item.quantity}" oninput="BusinessModule.updateItem(${item.id}, 'quantity', this.value)" style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; text-align:center;" class="input-modern">
            <div style="position:relative;">
                <input type="number" value="${item.price}" oninput="BusinessModule.updateItem(${item.id}, 'price', this.value)" style="padding: 12px; padding-right:25px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; font-weight: 800; width:100%;" class="input-modern">
            </div>
            <button onclick="BusinessModule.removeItem(${item.id})" style="background:#fff1f2; border:1px solid #fecaca; color:#ef4444; width:36px; height:36px; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
        </div>
        <style>
            @media (max-width: 640px) {
                .item-row { grid-template-columns: 1fr 1fr 40px !important; }
                .item-row input[placeholder="Description..."] { grid-column: span 3; }
            }
        </style>
    `).join(''),

    updateUI: () => { const list = document.getElementById('quote-items-list'); if (list) list.innerHTML = BusinessModule.renderItemsList(); BusinessModule.updateSummary(); },
    updateSummary: () => { const summary = document.getElementById('quote-summary'); if (summary) summary.innerHTML = BusinessModule.renderSummary(); },

    renderSummary: () => {
        const subtotal = BusinessModule.currentItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const taxEl = document.getElementById('tax-config');
        const taxRate = taxEl ? parseFloat(taxEl.value.split('|')[0]) : 0;
        const totalTax = subtotal * (taxRate / 100);
        const grandTotal = subtotal + totalTax;
        const commission = subtotal * BusinessModule.commissionRate;
        const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';
        return `
            <div style="padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #94a3b8;">Sous-Total HT</span><span style="font-weight: 700;">${subtotal.toFixed(2)}${currency}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #94a3b8;">TVA (${taxRate}%)</span><span style="font-weight: 700;">+ ${totalTax.toFixed(2)}${currency}</span></div>
                <div style="display: flex; justify-content: space-between; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top:16px;">
                    <span style="font-weight: 800; font-size: 1.1rem; color: #fff;">TOTAL TTC CLIENT</span><span style="font-weight: 950; font-size: 1.3rem; color: #10b981;">${grandTotal.toFixed(2)}${currency}</span>
                </div>
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2);">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;"><span style="color: #64748b;">Com Plateforme (12%)</span><span style="color: #94a3b8;">- ${commission.toFixed(2)}${currency}</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 1.05rem; margin-top: 8px;">
                    <span style="font-weight: 800; color: #10b981;">REVERSEMENT EXPERT</span><span style="font-weight: 950; color: #10b981;">${(subtotal - commission).toFixed(2)}${currency}</span>
                </div>
            </div>
        `;
    },

    saveDoc: async () => {
        const clientName = document.getElementById('quote-client-name').value;
        const taxEl = document.getElementById('tax-config');
        if (!clientName) return Swal.fire('Oups', 'Nom client obligatoire.', 'warning');
        const taxConfig = taxEl ? { rate: parseFloat(taxEl.value.split('|')[0]), name: taxEl.value.split('|')[1], legal_mention: taxEl.value.split('|')[2] } : { rate: 0, name: 'Micro', legal_mention: '' };
        
        const subtotal = BusinessModule.currentItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const commission = subtotal * BusinessModule.commissionRate;
        const totalTax = subtotal * (taxConfig.rate / 100);
        
        const supabase = await BusinessModule.waitForSupabase();
        if (!supabase) return Swal.fire('Erreur System', 'Moteur de base de données non initialisé.', 'error');
        
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return Swal.fire('Session expirée', 'Veuillez vous reconnecter.', 'error');

        const docData = {
            expert_id: user.id,
            client_name: clientName, 
            project_title: document.getElementById('quote-project-title').value,
            doc_type: BusinessModule.currentType, 
            items: BusinessModule.currentItems, 
            subtotal: subtotal, 
            commission_amount: commission,
            total_amount: subtotal, 
            total_tax: totalTax, 
            total_ttc: subtotal + totalTax,
            deposit_perc: document.getElementById('deposit-perc') ? parseFloat(document.getElementById('deposit-perc').value) : 0,
            expert_details: { 
                name: document.getElementById('expert-name').value, 
                siret: document.getElementById('expert-siret').value, 
                address: document.getElementById('expert-address').value 
            },
            client_details: { 
                name: clientName, 
                address: document.getElementById('quote-client-address').value 
            },
            tax_config: taxConfig, 
            status: BusinessModule.currentType === 'quote' ? 'draft' : 'sent',
            signature_status: BusinessModule.isSignatureActive ? 'pending' : 'none',
            signature_data: BusinessModule.signatureProof || {}
        };

        try {
            const { error } = await supabase
                .from('business_docs')
                .upsert({ ...docData, id: BusinessModule.editingId || undefined }, { onConflict: 'id' });

            if (error) throw error;
            
            Swal.fire({
                title: 'Genial !',
                text: 'Votre document est enregistre et pret a etre signe.',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Copier le lien client',
                cancelButtonText: 'Fermer',
                confirmButtonColor: '#10b981'
            }).then((result) => {
                if (result.isConfirmed) {
                    BusinessModule.shareDoc(BusinessModule.editingId || 'new');
                }
            });
            BusinessModule.loadDocs();
        } catch (err) {
            console.error("Save Error:", err);
            Swal.fire('Erreur', 'Impossible de sauvegarder. Vérifiez votre connexion.', 'error');
        }
    },

    isSignatureActive: false,
    signatureProof: null,

    activateSignature: async () => {
        BusinessModule.isSignatureActive = true;
        
        // Capture simple proof of intent (Client-side fingerprinting)
        try {
            const ipData = await fetch('https://api.ipify.org?format=json').then(r => r.json()).catch(() => ({ ip: 'Unknown' }));
            BusinessModule.signatureProof = {
                activated_at: new Date().toISOString(),
                activated_ip: ipData.ip,
                user_agent: navigator.userAgent,
                status: 'pending'
            };
        } catch (e) {
            BusinessModule.signatureProof = { activated_at: new Date().toISOString(), status: 'pending' };
        }

        const btn = document.getElementById('signature-btn');
        if (btn) {
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" style="margin-right:8px;"><path d="M20 6L9 17l-5-5" /></svg>
                Signature Activee
            `;
            btn.style.background = 'rgba(16, 185, 129, 0.1)';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
        }
        Swal.fire({
            title: 'Protocole Active',
            text: 'La preuve numérique (IP/Date) sera jointe au document pour certifier la transaction.',
            icon: 'success',
            confirmButtonColor: '#10b981'
        });
    },

    handlePDFGeneration: async () => {
        const taxEl = document.getElementById('tax-config');
        const taxConfig = taxEl ? { rate: parseFloat(taxEl.value.split('|')[0]), name: taxEl.value.split('|')[1], legal_mention: taxEl.value.split('|')[2] } : { rate: 0, name: 'Micro', legal_mention: '' };
        const subtotal = BusinessModule.currentItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        BusinessModule.PDF.generate({
            id: BusinessModule.editingId || 'TEMP', doc_type: BusinessModule.currentType, project_title: document.getElementById('quote-project-title').value,
            client_details: { name: document.getElementById('quote-client-name').value, address: document.getElementById('quote-client-address').value },
            expert_details: { name: document.getElementById('expert-name').value, siret: document.getElementById('expert-siret').value, address: document.getElementById('expert-address').value },
            items: BusinessModule.currentItems, subtotal, tax_config: taxConfig,
            deposit_perc: document.getElementById('deposit-perc') ? parseFloat(document.getElementById('deposit-perc').value) : 0
        });
    },

    directExportPDF: async (id) => {
        const supabase = await BusinessModule.waitForSupabase();
        if (!supabase) return;
        const { data } = await supabase.from('business_docs').select('*').eq('id', id).single();
        BusinessModule.PDF.generate({ ...data, id: data.id, doc_type: data.doc_type });
    },

    PDF: {
        generate: async (doc) => {
            if (typeof pdfMake === 'undefined') return Swal.fire('Erreur', 'Moteur PDF non chargé.', 'error');
            Swal.fire({ title: 'Génération...', didOpen: () => Swal.showLoading() });
            const isInvoice = (doc.doc_type || doc.type) === 'invoice';
            const number = `DTC-${isInvoice ? 'FAC' : 'DEV'}-${new Date().getFullYear()}-${doc.id.slice(0, 6).toUpperCase()}`;
            const currency = (typeof window.TerritoryConfig !== 'undefined') ? window.TerritoryConfig.getCurrencySymbol() : '€';
            const tableBody = [[{ text: 'Prestation', style: 'tableHeader', alignment: 'left' }, { text: 'Qté', style: 'tableHeader' }, { text: `P.U HT`, style: 'tableHeader', alignment: 'right' }, { text: `Total HT`, style: 'tableHeader', alignment: 'right' }]];
            doc.items.forEach(i => tableBody.push([{ text: i.description || 'Service', fontSize: 9, margin: [0, 8, 0, 8] }, { text: i.quantity, alignment: 'center', fontSize: 9, margin: [0, 8, 0, 8] }, { text: i.price.toFixed(2), alignment: 'right', fontSize: 9, margin: [0, 8, 0, 8] }, { text: (i.quantity * i.price).toFixed(2), alignment: 'right', fontSize: 9, bold: true, margin: [0, 8, 0, 8] }]));
            const totalTax = doc.subtotal * (doc.tax_config.rate / 100);
            const grandTotal = doc.subtotal + totalTax;
            const depositAmount = doc.deposit_perc ? (grandTotal * (doc.deposit_perc / 100)) : 0;

            const summaryBody = [[{ text: 'TOTAL HT', style: 'totalLabel' }, { text: doc.subtotal.toFixed(2) + ' ' + currency, style: 'totalValue' }], [{ text: doc.tax_config.name, style: 'totalLabel' }, { text: totalTax.toFixed(2) + ' ' + currency, style: 'totalValue' }], [{ text: 'NET À PAYER TTC', bold: true, fontSize: 13, color: '#10b981' }, { text: (doc.subtotal + totalTax).toFixed(2) + ' ' + currency, bold: true, fontSize: 13, color: '#10b981' }]];
            
            if (depositAmount > 0) {
                summaryBody.push([{ text: `ACOMPTE REQUIS (${doc.deposit_perc}%)`, bold: true, fontSize: 9, color: '#e11d48', margin: [0, 5, 0, 0] }, { text: depositAmount.toFixed(2) + ' ' + currency, bold: true, fontSize: 10, color: '#e11d48', margin: [0, 5, 0, 0] }]);
            }

            const docDefinition = {
                pageSize: 'A4', pageMargins: [40, 60, 40, 80], defaultStyle: { font: 'Roboto', fontSize: 10, color: '#1f2937' },
                styles: { header: { fontSize: 22, bold: true, color: '#10b981' }, docLabel: { fontSize: 18, bold: true, alignment: 'right' }, tableHeader: { bold: true, fontSize: 9, color: '#fff', fillColor: '#111827', margin: [0, 4, 0, 4] }, totalLabel: { bold: true, fontSize: 10, alignment: 'right' }, totalValue: { bold: true, fontSize: 11, alignment: 'right' } },
                content: [
                    { columns: [{ stack: [{ text: 'DOMTOM CONNECT', style: 'header' }, { text: 'PILOTAGE DE PROJET & RÉSEAU D\'EXPERTS', fontSize: 8, color: '#64748b' }] }, { stack: [{ text: isInvoice ? 'FACTURE' : 'DEVIS', style: 'docLabel' }, { text: `Réf: ${number}`, alignment: 'right', bold: true }, { text: `Date: ${new Date().toLocaleDateString()}`, alignment: 'right', fontSize: 9 }] }] },
                    { canvas: [{ type: 'line', x1: 0, y1: 15, x2: 515, y2: 15, lineWidth: 1, lineColor: '#f1f5f9' }], margin: [0, 0, 0, 30] },
                    { columns: [{ width: '50%', stack: [{ text: 'PRESTATAIRE :', bold: true, fontSize: 7, color: '#94a3b8' }, { text: doc.expert_details.name.toUpperCase(), bold: true }, { text: doc.expert_details.address, fontSize: 9 }, { text: `SIRET: ${doc.expert_details.siret}`, fontSize: 9 }] }, { width: '50%', stack: [{ text: 'CLIENT :', bold: true, alignment: 'right', fontSize: 7, color: '#94a3b8' }, { text: doc.client_details.name.toUpperCase(), bold: true, alignment: 'right' }, { text: doc.client_details.address, alignment: 'right', fontSize: 9 }, { text: `Objet: ${doc.project_title}`, alignment: 'right', fontSize: 9, bold: true }] }], margin: [0, 0, 0, 40] },
                    { table: { headerRows: 1, widths: ['*', 'auto', 'auto', 'auto'], body: tableBody }, layout: 'lightHorizontalLines' },
                    { columns: [{ width: '*', stack: [{ text: 'MENTIONS LÉGALES', bold: true, fontSize: 7, color: '#94a3b8', margin: [0, 30, 0, 5] }, { text: doc.tax_config.legal_mention, fontSize: 8, color: '#64748b' }] }, { width: 220, margin: [0, 30, 0, 0], table: { widths: ['*', 'auto'], body: summaryBody }, layout: 'noBorders' }] },
                    { columns: [{ width: '50%', stack: [{ text: 'ACCORD CLIENT', bold: true, fontSize: 8, margin: [0, 40, 0, 10] }, { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 0.5 }] }] }, { width: '50%', stack: [{ text: 'SIGNATURE PRESTATAIRE', bold: true, alignment: 'right', fontSize: 8, margin: [0, 40, 0, 10] }, { text: 'Approuvé par DTC Business', alignment: 'right', fontSize: 7, color: '#10b981' }, { canvas: [{ type: 'rect', x: 100, y: 0, w: 100, h: 30, r: 5, lineColor: '#10b981' }], alignment: 'right' }] }] }
                ]
            };
            pdfMake.createPdf(docDefinition).download(`${isInvoice ? 'Facture' : 'Devis'}_${number}.pdf`);
            Swal.close();
        }
    },

    shareDoc: (id) => {
        const url = `${window.location.origin}/view-document?id=${id}`;
        navigator.clipboard.writeText(url).then(() => {
            Swal.fire({
                title: 'Lien Copié !',
                text: 'Envoyez ce lien a votre client pour consultation et signature.',
                icon: 'info',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
        });
    }
};
window.BusinessModule = BusinessModule;

// Robust Initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('business-module-container');
        if (container) window.BusinessModule.renderView(container);
    });
} else {
    const container = document.getElementById('business-module-container');
    if (container) window.BusinessModule.renderView(container);
}
