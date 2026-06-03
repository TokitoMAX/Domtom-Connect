/**
 * BusinessModule - Domtom Connect
 * Centre de Transactions WeChat-style
 * Gère l'historique des règlements Stripe Connect et les demandes de paiements directes.
 */
const BusinessModule = {
    COMMISSION: 0.125, // 12.5% Domtom Connect

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
                        <h2 style="font-size:1.5rem; font-weight:900; color:#020617; letter-spacing:-0.03em; margin:0;">Centre de Transactions</h2>
                        <p style="color:#64748b; font-size:0.9rem; font-weight:550; margin-top:4px;">Historique des paiements directs WeChat-style par Stripe Connect.</p>
                    </div>
                    <div>
                        <button onclick="window.Router.navigate('#messages')" style="background:#020617; color:white; border:none; padding:12px 24px; border-radius:12px; font-weight:800; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:8px; box-shadow: 0 4px 12px rgba(2,6,23,0.1);">
                            <span>💬 Lancer un chat pour être payé</span>
                        </button>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:32px;">
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

                <!-- Automatic Payout Notice -->
                <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding:16px; display:flex; align-items:center; gap:12px; margin-bottom:32px;">
                    <span style="font-size:1.5rem;">💳</span>
                    <div style="font-size:0.85rem; color:#1e40af; font-weight:550; line-height:1.4;">
                        <strong>Virement Automatique :</strong> Plus besoin de renseigner d'IBAN ou de demander de retrait manuel. Vos revenus payés via Stripe Connect sont transférés automatiquement vers votre compte bancaire lié sous 2 à 5 jours ouvrés.
                    </div>
                </div>

                <!-- Transactions Table -->
                <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
                    <div style="padding:20px; border-bottom:1px solid #e2e8f0; font-weight:800; font-size:1rem; color:#020617;">
                        Transactions Récentes
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
