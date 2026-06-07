/**
 * BusinessModule - Domtom Connect
 * Centre de Transactions WeChat-style
 * Gère l'historique des règlements Stripe Connect et les demandes de paiements directes.
 */
const BusinessModule = {
    COMMISSION: 0.125, // 12.5% Domtom Connect

    switchTab: function(tabId) {
        // Hide all tabs
        const contents = document.querySelectorAll('.business-tab-content');
        contents.forEach(c => c.style.display = 'none');
        
        // Remove active class from buttons
        const buttons = document.querySelectorAll('.business-tab');
        buttons.forEach(b => {
            b.classList.remove('active');
            b.style.background = '#f1f5f9';
            b.style.color = '#64748b';
        });

        // Show selected tab
        const activeContent = document.getElementById('tab-' + tabId);
        if (activeContent) activeContent.style.display = 'block';

        // Update active button styling
        const activeButton = document.querySelector(`.business-tab[onclick="BusinessModule.switchTab('${tabId}')"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.style.background = '#020617';
            activeButton.style.color = 'white';
        }
    },

    renderDashboard: async function(container) {
        await this.renderView(container);
    },

    renderView: async function(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;font-family:'Plus Jakarta Sans',sans-serif;"><span class="loader"></span></div>`;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) { 
                container.innerHTML = `<div style="padding:40px;color:#dc2626;">Veuillez vous connecter pour voir vos transactions.</div>`; 
                return; 
            }

            // Fetch transaction records from business_docs
            const { data: allDocs, error: fetchError } = await window._supabase
                .from('business_docs')
                .select('*')
                .or(`expert_id.eq.${session.user.id},client_id.eq.${session.user.id}`)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const docs = allDocs || [];
            
            // Stats calculations (For the current user as expert/provider)
            const myEarnings = docs.filter(d => d.expert_id === session.user.id && d.status === 'paid');
            const totalCA = myEarnings.reduce((s, d) => s + (d.total_amount || 0), 0);
            const totalComm = totalCA * this.COMMISSION;
            const totalNet = totalCA - totalComm;

            container.innerHTML = `
            <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#ffffff; border-radius:24px; padding:clamp(16px, 3vw, 32px);">
                
                <!-- Info Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap:wrap; gap:16px;">
                    <div>
                        <h2 style="font-size:1.5rem; font-weight:900; color:#020617; letter-spacing:-0.03em; margin:0;">Mon Activité Pro</h2>
                        <p style="color:#64748b; font-size:0.9rem; font-weight:550; margin-top:4px;">Gérez vos missions, devis, facturation et suivez votre évolution.</p>
                    </div>
                    <div>
                        <button onclick="window.Router.navigate('#messages')" style="background:#020617; color:white; border:none; padding:12px 24px; border-radius:12px; font-weight:800; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:8px; box-shadow: 0 4px 12px rgba(2,6,23,0.1);">
                            <span>💬 Lancer un chat pour être payé</span>
                        </button>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div style="display:flex; gap:12px; margin-bottom:32px; border-bottom:2px solid #f1f5f9; padding-bottom:16px; overflow-x:auto;">
                    <button class="business-tab active" onclick="BusinessModule.switchTab('missions')" style="padding:10px 20px; border-radius:100px; border:none; font-weight:800; cursor:pointer; background:#020617; color:white;">💼 Mes Missions</button>
                    <button class="business-tab" onclick="BusinessModule.switchTab('devis')" style="padding:10px 20px; border-radius:100px; border:none; font-weight:800; cursor:pointer; background:#f1f5f9; color:#64748b;">📂 Devis & Factures</button>
                    <button class="business-tab" onclick="BusinessModule.switchTab('evolution')" style="padding:10px 20px; border-radius:100px; border:none; font-weight:800; cursor:pointer; background:#f1f5f9; color:#64748b;">📈 Mon Évolution</button>
                </div>

                <!-- TAB CONTENT: MISSIONS -->
                <div id="tab-missions" class="business-tab-content" style="display:block;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                        <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:16px; padding:32px; text-align:center;">
                            <div style="font-size:2rem; margin-bottom:12px; color:#94a3b8;"><i class="fas fa-briefcase"></i></div>
                            <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0 0 8px;">Aucune mission active</h3>
                            <p style="color:#64748b; font-size:0.9rem; margin:0;">Explorez le fil d'actualité pour trouver des opportunités et y répondre.</p>
                            <button onclick="window.Router.navigate('#moments')" style="margin-top:16px; background:white; border:1px solid #e2e8f0; color:#0f172a; padding:8px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Voir les opportunités</button>
                        </div>
                    </div>
                </div>

                <!-- TAB CONTENT: DEVIS & FACTURES -->
                <div id="tab-devis" class="business-tab-content" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0;">Mes Documents</h3>
                        <button style="background:#10b981; border:none; color:white; padding:8px 16px; border-radius:8px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px;" onclick="alert('Simulation: Upload du document...')"><i class="fas fa-upload"></i> Importer un PDF</button>
                    </div>
                    
                    <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
                        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
                            <thead>
                                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#64748b; font-weight:700;">
                                    <th style="padding:14px 20px;">Date</th>
                                    <th style="padding:14px 20px;">Type</th>
                                    <th style="padding:14px 20px;">Client / Projet</th>
                                    <th style="padding:14px 20px;">Montant</th>
                                    <th style="padding:14px 20px;">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom:1px solid #e2e8f0;">
                                    <td style="padding:14px 20px; color:#64748b;">Aujourd'hui</td>
                                    <td style="padding:14px 20px; font-weight:700; color:#0f172a;"><i class="fas fa-file-invoice" style="color:#3b82f6; margin-right:6px;"></i> Facture</td>
                                    <td style="padding:14px 20px; font-weight:600;">Refonte Site Web E-commerce</td>
                                    <td style="padding:14px 20px; font-weight:800;">1 200,00 €</td>
                                    <td style="padding:14px 20px;"><span style="background:#f0fdf4; color:#16a34a; padding:4px 10px; border-radius:100px; font-size:0.75rem; font-weight:800;">Encaissée</span></td>
                                </tr>
                                <tr>
                                    <td style="padding:14px 20px; color:#64748b;">Il y a 3 jours</td>
                                    <td style="padding:14px 20px; font-weight:700; color:#0f172a;"><i class="fas fa-file-alt" style="color:#f59e0b; margin-right:6px;"></i> Devis</td>
                                    <td style="padding:14px 20px; font-weight:600;">Consulting SEO Annuel</td>
                                    <td style="padding:14px 20px; font-weight:800;">3 500,00 €</td>
                                    <td style="padding:14px 20px;"><span style="background:#fffbeb; color:#d97706; padding:4px 10px; border-radius:100px; font-size:0.75rem; font-weight:800;">En attente de signature</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- TAB CONTENT: EVOLUTION & FACTURATION STRIPE -->
                <div id="tab-evolution" class="business-tab-content" style="display:none;">
                    
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 20px; padding: 24px; color: white; margin-bottom: 24px; display:flex; flex-wrap:wrap; gap:24px; align-items:center; justify-content:space-between; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <div>
                            <div style="font-size:0.8rem; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Suivi du Mois en cours</div>
                            <h3 style="font-size:1.8rem; font-weight:900; margin:0 0 8px;">Belle progression ! 🚀</h3>
                            <p style="color:rgba(255,255,255,0.7); font-size:0.95rem; margin:0; max-width:400px;">Basé sur vos factures et devis validés, votre chiffre d'affaires prévisionnel est en hausse de <strong>+15%</strong> par rapport au mois précédent.</p>
                        </div>
                        <div style="display:flex; gap:16px;">
                            <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:16px; padding:16px; text-align:center; min-width:120px;">
                                <div style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700; margin-bottom:4px;">Devis Validés</div>
                                <div style="font-size:1.4rem; font-weight:900; color:#fff;">3 500 €</div>
                            </div>
                            <div style="background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.3); border-radius:16px; padding:16px; text-align:center; min-width:120px;">
                                <div style="font-size:0.75rem; color:#a7f3d0; font-weight:700; margin-bottom:4px;">CA Encaissé</div>
                                <div style="font-size:1.4rem; font-weight:900; color:#10b981;">1 200 €</div>
                            </div>
                        </div>
                    </div>

                    <h3 style="font-size:1.2rem; font-weight:900; color:#0f172a; margin:0 0 16px;">Paiements Stripe Connect (Automatiques)</h3>

                    <!-- Stats Grid -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:24px;">
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:20px;">
                            <div style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Volume Facturé Encaissé</div>
                            <div style="font-size:1.6rem; font-weight:900; color:#020617;">${totalCA.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        </div>
                        <div style="background:#fff1f2; border:1px solid #ffe4e6; border-radius:16px; padding:20px;">
                            <div style="font-size:0.65rem; font-weight:800; color:#e11d48; text-transform:uppercase; margin-bottom:8px;">Part Plateforme (12.5%)</div>
                            <div style="font-size:1.6rem; font-weight:900; color:#e11d48;">${totalComm.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        </div>
                        <div style="background:#f0fdf4; border:1px solid #dcfce7; border-radius:16px; padding:20px;">
                            <div style="font-size:0.65rem; font-weight:800; color:#16a34a; text-transform:uppercase; margin-bottom:8px;">Revenu Net Reversé</div>
                            <div style="font-size:1.6rem; font-weight:900; color:#16a34a;">${totalNet.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        </div>
                    </div>

                    <!-- Transactions Table -->
                    <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
                        <div style="padding:20px; border-bottom:1px solid #e2e8f0; font-weight:800; font-size:1rem; color:#020617;">
                            Historique des Transactions
                        </div>
                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
                                <thead>
                                    <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#64748b; font-weight:700;">
                                        <th style="padding:14px 20px;">Date</th>
                                        <th style="padding:14px 20px;">Description</th>
                                        <th style="padding:14px 20px;">Rôle</th>
                                        <th style="padding:14px 20px;">Montant</th>
                                        <th style="padding:14px 20px;">Part DTC</th>
                                        <th style="padding:14px 20px;">Statut</th>
                                        <th style="padding:14px 20px; text-align:right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${docs.length === 0 ? `
                                    <tr>
                                        <td colspan="7" style="padding:60px 20px; text-align:center; color:#94a3b8;">
                                            <div style="font-size:2.5rem; margin-bottom:16px; opacity:0.3;">💸</div>
                                            <div style="font-weight:700; color:#475569; margin-bottom:6px;">Aucune transaction</div>
                                            <div style="font-size:0.8rem;">Les demandes de paiement acceptées et en attente apparaîtront ici.</div>
                                        </td>
                                    </tr>
                                ` : docs.map(d => {
                                    const isExpert = d.expert_id === session.user.id;
                                    const date = new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                                    const amount = (d.total_amount || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                                    const commission = (d.total_amount * this.COMMISSION).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                                    
                                    let roleLabel = isExpert ? '<span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:700;">Prestataire</span>' : '<span style="background:#f3e8ff; color:#6b21a8; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:700;">Client</span>';
                                    
                                    let statusBadge = '';
                                    if (d.status === 'paid') {
                                        statusBadge = '<span style="background:#dcfce7; color:#15803d; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:800;">Payé</span>';
                                    } else if (d.status === 'sent' || d.status === 'draft') {
                                        statusBadge = '<span style="background:#fef3c7; color:#b45309; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:800;">En attente</span>';
                                    } else {
                                        statusBadge = '<span style="background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:800;">Annulé</span>';
                                    }

                                    let actionButton = '';
                                    if ((d.status === 'sent' || d.status === 'draft') && !isExpert) {
                                        actionButton = `<button onclick="window.MessagesModule.payRequest('${d.project_title.replace(/'/g, "\\'")}', '${d.total_amount}', '${d.expert_id}', event)" style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:8px; font-weight:800; cursor:pointer; font-size:0.75rem;">💳 Régler</button>`;
                                    }

                                    return `
                                        <tr style="border-bottom:1px solid #f1f5f9; hover:background:#f8fafc;">
                                            <td style="padding:14px 20px; font-weight:550; color:#475569;">${date}</td>
                                            <td style="padding:14px 20px; font-weight:700; color:#020617;">${d.project_title}</td>
                                            <td style="padding:14px 20px;">${roleLabel}</td>
                                            <td style="padding:14px 20px; font-weight:800; color:#020617;">${amount}</td>
                                            <td style="padding:14px 20px; color:#94a3b8;">${isExpert ? commission : '-'}</td>
                                            <td style="padding:14px 20px;">${statusBadge}</td>
                                            <td style="padding:14px 20px; text-align:right;">${actionButton}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            `;
        } catch (e) {
            console.error("[BusinessModule] Error rendering view:", e);
            container.innerHTML = `<div style="padding:40px; color:#dc2626; font-weight:700;">Une erreur est survenue lors de la récupération de vos transactions : ${e.message}</div>`;
        }
    }
};

window.BusinessModule = BusinessModule;
