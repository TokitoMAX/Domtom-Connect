/**
 * Ticketing Module - Domtom Connect
 * Professional Organizer Hub & Live Operations
 */
const TicketingModule = {
    commissionRate: 0.15, // 15% Platform Commission for Events

    async loadMyTicketing(params = null) {
        const view = document.getElementById('billetterie-view');
        if (!view) return;
        const action = params ? params.get('action') : null;
        const id = params ? params.get('id') : null;

        if (action === 'manage' && id) {
            await this.renderOrganizerHub(id);
        } else if (action === 'create') {
            await this.renderCreateForm(view);
        } else {
            await this.renderEventsList(view);
        }
    },

    /**
     * 1. Hub de Gestion - "Tour de Contrôle"
     */
    async renderOrganizerHub(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center; padding:100px;"><span class="loader"></span></div>`;

        try {
            const { data: ev } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            const { data: tickets } = await window._supabase.from('tickets').select('*').eq('event_id', eventId);
            
            const soldCount = tickets ? tickets.length : 0;
            const capacity = ev.total_tickets || 100; // Fallback quota
            const fillRate = Math.min(100, (soldCount / capacity) * 100);
            const grossSales = tickets.reduce((acc, t) => acc + (parseFloat(t.amount_paid) || 0), 0);
            const netEarnings = grossSales * (1 - this.commissionRate);

            view.innerHTML = `
                <div style="padding: clamp(20px, 4vw, 40px); font-family: 'Plus Jakarta Sans', sans-serif; background: #fafafa; min-height: 100vh;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                        <div>
                            <button onclick="window.Router.navigate('#billetterie')" style="background:none; border:none; font-weight:800; color:#64748b; cursor:pointer; margin-bottom:12px; display:block;">&larr; Retour à la liste</button>
                            <h1 style="font-weight:950; font-size:2.2rem; color:#0f172a; margin:0;">Pilotage : ${ev.title}</h1>
                            <p style="color:#64748b; font-weight:600; margin-top:8px;">Statistiques de vente et opérations terrain en temps réel.</p>
                        </div>
                        <div style="display:flex; gap:12px;">
                            <button onclick="TicketingModule.renderEditForm('${ev.id}')" class="btn-ops">MODIFIER QUOTAS/PRIX</button>
                            <button onclick="TicketingModule.renderScanView('${ev.id}')" class="btn-ops primary">SCANNER LIVE</button>
                        </div>
                    </div>

                    <!-- KPI Grid -->
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px; margin-bottom:48px;">
                        <div class="kpi-card-lux">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span class="kpi-label">Remplissage</span>
                                <span class="kpi-tag">${soldCount} / ${capacity}</span>
                            </div>
                            <div class="gauge-container"><div class="gauge-fill" style="width:${fillRate}%;"></div></div>
                            <div style="font-size:0.8rem; font-weight:800; color:#10b981; margin-top:12px;">${fillRate.toFixed(1)}% des billets vendus</div>
                        </div>
                        <div class="kpi-card-lux">
                            <span class="kpi-label">Recettes Nettes (Reversement)</span>
                            <div style="font-size:2.8rem; font-weight:950; color:#0f172a; margin:12px 0;">${netEarnings.toFixed(2)} €</div>
                            <div style="font-size:0.75rem; color:#94a3b8; font-weight:800;">CA Brut: ${grossSales.toFixed(2)} € (Com. DTC 15% déduite)</div>
                        </div>
                    </div>

                    <!-- Attendee Table -->
                    <div style="background:white; border-radius:32px; border:1px solid #e2e8f0; padding:40px; box-shadow:0 20px 50px rgba(0,0,0,0.03);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                            <h3 style="font-weight:950; margin:0;">Gestion des Inscrits</h3>
                            <input type="text" id="att-search" placeholder="Rechercher un nom ou un billet..." onkeyup="TicketingModule.filterAttendees()" class="lux-input-small">
                        </div>
                        <div id="attendees-table-wrap">
                            ${this.renderAttendeeTable(tickets)}
                        </div>
                    </div>
                </div>

                <style>
                    .btn-ops { padding:14px 28px; border-radius:12px; border:1.5px solid #e2e8f0; background:white; font-weight:900; cursor:pointer; font-family:inherit; transition:0.3s; }
                    .btn-ops.primary { background:#0f172a; color:white; border:none; box-shadow:0 10px 20px rgba(15,23,42,0.2); }
                    .kpi-card-lux { background:white; padding:32px; border-radius:28px; border:1px solid #e2e8f0; }
                    .kpi-label { font-size:0.75rem; font-weight:950; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; }
                    .kpi-tag { background:#f1f5f9; color:#0f172a; padding:4px 12px; border-radius:100px; font-weight:900; font-size:0.75rem; }
                    .gauge-container { height:10px; background:#f1f5f9; border-radius:10px; margin-top:20px; overflow:hidden; }
                    .gauge-fill { height:100%; background:#10b981; border-radius:10px; }
                    .lux-input-small { width:240px; padding:12px 20px; border-radius:12px; border:1.5px solid #e2e8f0; font-weight:700; font-family:inherit; }
                </style>
            `;
        } catch (err) { alert(err.message); }
    },

    renderAttendeeTable(tickets) {
        if (!tickets || tickets.length === 0) return `<p style="text-align:center; padding:40px; color:#64748b;">Aucun ticket vendu pour le moment.</p>`;
        return `
            <table style="width:100%; border-collapse:collapse;">
                <thead style="text-align:left; border-bottom:2px solid #f1f5f9;">
                    <tr>
                        <th style="padding:16px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Participant</th>
                        <th style="padding:16px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950;">Statut</th>
                        <th style="padding:16px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:950; text-align:right;">Action Terrain</th>
                    </tr>
                </thead>
                <tbody>
                    ${tickets.map(t => `
                        <tr class="att-row" data-search="${(t.first_name + ' ' + t.last_name).toLowerCase()}" style="border-bottom:1px solid #f8fafc;">
                            <td style="padding:20px 16px;">
                                <div style="font-weight:900; color:#0f172a;">${t.first_name || ''} ${t.last_name || ''}</div>
                                <div style="font-size:0.75rem; color:#94a3b8; font-weight:700;">#${t.id.slice(0,8).toUpperCase()}</div>
                            </td>
                            <td style="padding:20px 16px;">
                                ${t.checked_in 
                                    ? `<span style="color:#10b981; font-weight:950;">✅ CHECKED-IN</span>` 
                                    : `<span style="color:#cbd5e1; font-weight:950;">EN ATTENTE</span>`}
                            </td>
                            <td style="padding:20px 16px; text-align:right;">
                                ${!t.checked_in ? `<button onclick="TicketingModule.manualCheckIn('${t.id}', '${t.event_id}')" style="background:#10b981; color:white; border:none; padding:8px 16px; border-radius:10px; font-weight:900; cursor:pointer;">VALIDER</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    filterAttendees() {
        const val = document.getElementById('att-search').value.toLowerCase();
        document.querySelectorAll('.att-row').forEach(row => {
            row.style.display = row.getAttribute('data-search').includes(val) ? '' : 'none';
        });
    },

    /**
     * 3. Scanner (Interface Live Terrain)
     */
    renderScanView(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `
            <div style="background:#020617; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; padding:40px; text-align:center; font-family:'Plus Jakarta Sans', sans-serif; position:fixed; inset:0; z-index:9999;">
                <button onclick="TicketingModule.renderOrganizerHub('${eventId}')" style="position:absolute; top:40px; left:40px; background:rgba(255,255,255,0.1); border:none; padding:12px 24px; border-radius:12px; color:white; font-weight:800; cursor:pointer;">&larr; QUITTER LE SCANNER</button>
                
                <h2 style="font-weight:950; font-size:2rem; margin-bottom:8px;">Scanner DTC Engine</h2>
                <p style="color:rgba(255,255,255,0.5); font-weight:600; margin-bottom:48px;">Format mobile optimisé pour l'accueil.</p>

                <div style="width:300px; height:300px; border:4px solid #10b981; border-radius:40px; position:relative; background:rgba(255,255,255,0.05); box-shadow:0 0 100px rgba(16,185,129,0.2);">
                    <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:#10b981; animation: scan_line_anim 2s infinite ease-in-out; box-shadow:0 0 15px #10b981;"></div>
                </div>

                <div style="margin-top:52px; width:100%; max-width:400px;">
                    <input type="text" id="manual-ticket-id" placeholder="Code billet (manuel)..." style="width:100%; padding:20px; border-radius:18px; border:2px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:white; font-weight:950; text-align:center; font-size:1.2rem; margin-bottom:20px;">
                    <button onclick="TicketingModule.validateTicket(document.getElementById('manual-ticket-id').value, '${eventId}', true)" style="width:100%; background:#10b981; color:white; border:none; padding:20px; border-radius:18px; font-weight:950; font-size:1.1rem; cursor:pointer;">VALIDER L'ACCÈS</button>
                </div>
                
                <style>@keyframes scan_line_anim { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }</style>
            </div>
        `;
    },

    async validateTicket(ticketId, eventId, isScanMode = false) {
        if(!ticketId) return;
        try {
            const { data: ticket } = await window._supabase.from('tickets').select('*').eq('id', ticketId).eq('event_id', eventId).single();
            if(!ticket) { Swal.fire({ title: "Inconnu", text: "Code billet invalide", icon: "error", background: "#020617", color: "white" }); return; }
            if(ticket.checked_in) { Swal.fire({ title: "Déjà utilisé", text: "Ce billet a déjà été scanné", icon: "warning" }); return; }
            
            await window._supabase.from('tickets').update({ checked_in: true, updated_at: new Date() }).eq('id', ticketId);
            
            Swal.fire({ title: "Bienvenue !", text: (ticket.first_name || "") + " est autorisé(e)", icon: "success", timer: 1500, showConfirmButton: false });
            
            if(isScanMode) {
                document.getElementById('manual-ticket-id').value = '';
            } else {
                this.renderOrganizerHub(eventId);
            }
        } catch (err) { alert(err.message); }
    },

    /**
     * 2. Agilité Post-Publication (Éditeur Avancé)
     */
    async renderEditForm(eventId) {
        const { data: ev } = await window._supabase.from('events').select('*').eq('id', eventId).single();
        Swal.fire({
            title: 'Paramètres Avancés',
            html: `
                <div style="text-align:left; padding:20px;">
                    <label style="display:block; font-size:0.7rem; font-weight:950; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Quota Global (Capacité)</label>
                    <input type="number" id="swal-ev-capacity" value="${ev.total_tickets || 100}" class="swal2-input" style="width:100%; margin:0 0 20px 0;">
                    
                    <label style="display:block; font-size:0.7rem; font-weight:950; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Prix Unitaire (€)</label>
                    <input type="number" id="swal-ev-price" value="${ev.price || 0}" step="0.01" class="swal2-input" style="width:100%; margin:0;">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'SAUVEGARDER',
            confirmButtonColor: '#0f172a',
            preConfirm: () => {
                return {
                    total_tickets: parseInt(document.getElementById('swal-ev-capacity').value),
                    price: parseFloat(document.getElementById('swal-ev-price').value)
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await window._supabase.from('events').update(result.value).eq('id', eventId);
                this.renderOrganizerHub(eventId);
            }
        });
    },

    async renderEventsList(container) {
        // ... (simplified list view already implemented, ensures consistent routing to Hub)
        container.innerHTML = `<div style="padding:40px; text-align:center;"><span class="loader"></span></div>`;
        const { data: { session } } = await window._supabase.auth.getSession();
        const { data: events } = await window._supabase.from('events').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        
        container.innerHTML = `
            <div style="padding:40px; font-family:'Plus Jakarta Sans', sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <h1 style="font-weight:950; margin:0;">Hub Organisateur</h1>
                    <button onclick="window.Router.navigate('#billetterie?action=create')" style="background:#0f172a; color:white; border:none; padding:16px 32px; border-radius:14px; font-weight:950; cursor:pointer;">+ Créer un Événement</button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
                    ${events.map(ev => `
                        <div style="background:white; border-radius:24px; border:1px solid #e2e8f0; overflow:hidden;">
                            <div style="padding:24px;">
                                <h3 style="margin:0; font-weight:950; font-size:1.1rem; text-transform:uppercase;">${ev.title}</h3>
                                <p style="color:#64748b; font-weight:700; font-size:0.85rem; margin:8px 0 20px;">${ev.event_date}</p>
                                <button onclick="window.Router.navigate('#billetterie?action=manage&id=${ev.id}')" style="width:100%; background:#0f172a; color:white; border:none; padding:14px; border-radius:12px; font-weight:950; cursor:pointer;">ACCÉDER AU PILOTAGE</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

window.TicketingModule = TicketingModule;
