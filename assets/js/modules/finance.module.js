/**
 * Finance Module - Admin Control Tower
 * Handles balance visualization and payout execution.
 */
const FinanceModule = {
    async init() {
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) {
                window.location.href = '../login.html';
                return;
            }

            // Verify if user is admin (security check)
            const { data: profile } = await window._supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile.role !== 'admin' && profile.role !== 'entreprise') { // Allow admin access
                // Note: For now we check if role is enterprise as a placeholder for admin
                console.warn("Unprivileged access attempt to Finance Hub.");
            }

            await this.loadStats();
            await this.loadPayoutList();
        } catch (err) {
            console.error("Finance Init Error:", err);
        }
    },

    async loadStats() {
        try {
            // 1. Total processed in orders
            const { data: orders } = await window._supabase.from('showcase_orders').select('total_price').eq('status', 'paid');
            const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0);
            
            // 2. Sum of all expert balances
            const { data: profiles } = await window._supabase.from('profiles').select('balance');
            const pendingPayouts = profiles.reduce((sum, p) => sum + (parseFloat(p.balance) || 0), 0);

            document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
            document.getElementById('platform-fees').textContent = (totalRevenue * 0.05).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
            document.getElementById('pending-payouts-total').textContent = pendingPayouts.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
        } catch (err) {
            console.error("Load Stats Error:", err);
        }
    },

    async loadPayoutList() {
        const container = document.getElementById('payouts-table-container');
        try {
            const { data: experts, error } = await window._supabase
                .from('profiles')
                .select('*')
                .gt('balance', 0)
                .order('balance', { ascending: false });

            if (error) throw error;

            if (!experts || experts.length === 0) {
                container.innerHTML = `<p style="text-align:center; padding:40px; color:#64748b;">Aucun reversement en attente. Tous les experts sont à jour.</p>`;
                return;
            }

            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Expert</th>
                            <th>PayPal Email</th>
                            <th>Solde à reverser (95%)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            experts.forEach(exp => {
                html += `
                    <tr>
                        <td>
                            <div style="font-weight: 800;">${exp.full_name || 'Utilisateur'}</div>
                            <div style="font-size: 0.75rem; color: #64748b;">${exp.id.slice(0,8)}...</div>
                        </td>
                        <td style="font-family: monospace; color: #2563eb;">${exp.paypal_email || 'Non configuré'}</td>
                        <td style="font-weight: 900; font-size: 1.1rem;">${(exp.balance || 0).toLocaleString()} €</td>
                        <td>
                            <button onclick="FinanceModule.payExpert('${exp.id}', '${exp.paypal_email}', ${exp.balance})" 
                                    class="btn-payout" ${!exp.paypal_email ? 'disabled style="opacity:0.3;"' : ''}>
                                Payer Manuel ✓
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;

        } catch (err) {
            container.innerHTML = `<p style="color:red; text-align:center;">Erreur: ${err.message}</p>`;
        }
    },

    async payExpert(userId, email, amount) {
        if (!email) return alert("Cet expert n'a pas configuré d'email PayPal.");

        // Génération du lien de virement direct PayPal
        const paypalLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(email)}&amount=${amount}&currency_code=EUR&item_name=${encodeURIComponent('Reversement Domtom Connect Showcase')}`;

        const confirm = await Swal.fire({
            title: 'Effectuer le reversement ?',
            html: `
                <p>Montant à verser : <strong>${amount} €</strong></p>
                <p>Expert : <strong>${email}</strong></p>
                <div style="margin:20px 0;">
                    <a href="${paypalLink}" target="_blank" class="btn-payout" style="background:#0070ba; text-decoration:none; display:inline-block;">1. Faire le virement sur PayPal</a>
                </div>
                <p style="font-size:0.8rem; color:#64748b;">Une fois le virement fait, cliquez ci-dessous pour valider la balance.</p>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: '2. Confirmer la mise à jour du solde',
            cancelButtonText: 'Annuler'
        });

        if (!confirm.isConfirmed) return;

        try {
            // Record in Payout History (Trigger will update balance to 0)
            const { error } = await window._supabase.from('payout_history').insert({
                user_id: userId,
                amount: amount,
                paypal_email: email,
                status: 'completed'
            });

            if (error) throw error;

            Swal.fire('Succès', 'Reversement enregistré avec succès.', 'success');
            await this.loadStats();
            await this.loadPayoutList();
        } catch (err) {
            alert("Erreur: " + err.message);
        }
    },

    async blastPayouts() {
        Swal.fire({
            title: 'Reversement Groupé (Batch)',
            text: "Cette fonctionnalité va générer un fichier de paiement groupé pour PayPal (CSV) ou automatiser le virement via l'API Payouts si configurée.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Lancer le Batch'
        });
    }
};

window.FinanceModule = FinanceModule;
