/**
 * Ticketing Module - Domtom Connect
 * High-Fidelity Organizer Hub & Event Management Engine
 */
const TicketingModule = {
    /**
     * Main Entry Point
     */
    async loadMyTicketing(params = null) {
        const view = document.getElementById('billetterie-view');
        if (!view) return;

        const action = params ? params.get('action') : null;
        const id = params ? params.get('id') : null;

        if (action === 'create') {
            await this.renderCreateForm(view);
        } else if (action === 'manage' && id) {
            await this.renderEventManager(id);
        } else if (action === 'edit' && id) {
            await this.renderEditForm(id);
        } else {
            await this.renderEventsList(view);
        }
    },

    /**
     * 1. Dashboard des Organisés (Liste)
     */
    async renderEventsList(container) {
        container.innerHTML = `
            <div style="font-family:'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); background:#fafafa; min-height:100vh;">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px; flex-wrap:wrap; gap:20px;">
                    <div>
                        <h1 style="font-size:clamp(1.8rem, 5vw, 2.5rem); font-weight:950; color:#0f172a; letter-spacing:-0.05em; margin:0;">Événements Organisés</h1>
                        <p style="color:#64748b; font-weight:600; margin-top:8px;">Gérez vos billetteries, vos ventes et vos accès.</p>
                    </div>
                    <button onclick="window.Router.navigate('#billetterie?action=create')" class="btn-dtc primary-black">+ Créer un Événement</button>
                </div>
                <div id="organizer-events-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:24px;">
                    <div style="grid-column: 1/-1; text-align:center; padding:80px;"><span class="loader"></span></div>
                </div>
            </div>
            <style>
                .btn-dtc { padding: 16px 32px; border-radius: 14px; font-weight: 900; border: none; cursor: pointer; transition: 0.3s; font-family: inherit; }
                .btn-dtc.primary-black { background: #0f172a; color: white; }
                .event-card-pro { background:white; border-radius:24px; border:1.5px solid #e2e8f0; overflow:hidden; transition:0.3s; display:flex; flex-direction:column; }
                .event-card-pro:hover { transform:translateY(-5px); box-shadow:0 20px 40px rgba(0,0,0,0.05); border-color:#10b981; }
                .btn-icon-sq { width:40px; height:40px; border-radius:10px; border:1px solid #f1f5f9; background:white; cursor:pointer; display:flex; align-items:center; justify-content:center; }
                .btn-icon-sq:hover { background:#fee2e2; color:#ef4444; border-color:#fecaca; }
            </style>
        `;

        const grid = document.getElementById('organizer-events-grid');
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: events, error } = await window._supabase.from('events').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            if (error) throw error;

            if (!events || events.length === 0) {
                grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:80px; border:2px dashed #cbd5e1; border-radius:32px;"><h3 style="font-weight:900;">C'est vide !</h3><p>Lancez votre premier événement dès maintenant.</p></div>`;
                return;
            }

            grid.innerHTML = events.map(ev => `
                <div class="event-card-pro">
                    <div style="height:160px; position:relative;">
                        <img src="${ev.image_url || '/assets/images/default-event.jpg'}" style="width:100%; height:100%; object-fit:cover;">
                        <div style="position:absolute; top:12px; right:12px; display:flex; gap:8px;">
                            <button onclick="TicketingModule.deleteEvent('${ev.id}')" class="btn-icon-sq" title="Supprimer l'événement"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                        </div>
                        <div style="position:absolute; bottom:12px; left:12px; background:rgba(15,23,42,0.8); color:white; padding:4px 12px; border-radius:100px; font-size:0.7rem; font-weight:900; backdrop-filter:blur(4px);">${ev.event_date}</div>
                    </div>
                    <div style="padding:24px; flex-grow:1;">
                        <h4 style="margin:0 0 8px 0; font-size:1.1rem; font-weight:950; color:#0f172a; text-transform:uppercase;">${ev.title}</h4>
                        <p style="font-size:0.8rem; color:#64748b; font-weight:600; margin-bottom:20px;">${ev.location}</p>
                        
                        <div style="display:flex; gap:8px;">
                            <button onclick="window.Router.navigate('#billetterie?action=manage&id=${ev.id}')" style="flex:2; background:#0f172a; color:white; border:none; border-radius:12px; padding:12px; font-weight:900; cursor:pointer;">PILOTAGE & SCAN</button>
                            <button onclick="window.Router.navigate('#billetterie?action=edit&id=${ev.id}')" style="flex:1; background:white; border:1.5px solid #f1f5f9; border-radius:12px; padding:12px; font-weight:800; cursor:pointer;">MODIFIER</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (err) { alert(err.message); }
    },

    /**
     * 2. Tour de Contrôle (The "Specific zone" requested)
     */
    async renderEventManager(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center; padding:100px;"><span class="loader"></span></div>`;

        try {
            const { data: ev } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            const { data: attendees } = await window._supabase.from('tickets').select('*').eq('event_id', eventId).order('created_at', { ascending: false });

            const gross = attendees.reduce((acc, t) => acc + (parseFloat(t.amount_paid) || 0), 0);
            const net = gross * 0.85;

            view.innerHTML = `
                <div style="padding: clamp(20px, 4vw, 40px); font-family:'Plus Jakarta Sans', sans-serif; background:#fafafa; min-height:100vh;">
                    <button onclick="window.Router.navigate('#billetterie')" style="margin-bottom:24px; background:white; border:1px solid #e2e8f0; padding:10px 20px; border-radius:12px; font-weight:800; cursor:pointer;">&larr; Retour à la liste</button>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; flex-wrap:wrap; gap:24px;">
                        <div>
                            <h1 style="font-weight:950; font-size:2.2rem; color:#0f172a; letter-spacing:-0.04em;">Pilotage : ${ev.title}</h1>
                            <p style="color:#64748b; font-weight:600;">Monitor temps réel des ventes et contrôle d'accès.</p>
                        </div>
                        <button onclick="TicketingModule.renderScanView('${ev.id}')" style="background:#10b981; color:white; padding:18px 40px; border-radius:16px; border:none; font-weight:950; font-size:1.1rem; cursor:pointer; box-shadow:0 10px 20px rgba(16,185,129,0.2);">ACTIVER SCANNER LIVE</button>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px; margin-bottom:48px;">
                        <div style="background:white; padding:32px; border-radius:28px; border:1px solid #e2e8f0; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
                            <span style="font-size:0.75rem; font-weight:950; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em;">Ventes réalisées</span>
                            <div style="font-size:3rem; font-weight:950; color:#0f172a; margin-top:10px;">${attendees.length} <span style="font-size:1.2rem; color:#cbd5e1;">/ ${ev.total_tickets || '∞'}</span></div>
                        </div>
                        <div style="background:#0f172a; padding:32px; border-radius:28px; color:white;">
                            <span style="font-size:0.75rem; font-weight:950; color:rgba(255,255,255,0.4); text-transform:uppercase;">Chiffre d'Affaire Net</span>
                            <div style="font-size:3rem; font-weight:950; color:#10b981; margin-top:10px;">${net.toFixed(2)} €</div>
                            <div style="font-size:0.8rem; color:rgba(255,255,255,0.5); font-weight:600;">Déduction 15% DTC incluse</div>
                        </div>
                    </div>

                    <div style="background:white; border-radius:32px; border:1.5px solid #e2e8f0; padding:40px;">
                        <h3 style="font-weight:950; margin-bottom:32px; font-size:1.4rem;">Participants (${attendees.length})</h3>
                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse;">
                                <thead>
                                    <tr style="text-align:left; border-bottom:2px solid #f8fafc;">
                                        <th style="padding:16px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Participant</th>
                                        <th style="padding:16px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Statut Accès</th>
                                        <th style="padding:16px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; text-align:right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${attendees.map(t => `
                                        <tr style="border-bottom:1px solid #f8fafc;">
                                            <td style="padding:20px 16px;">
                                                <div style="font-weight:900; color:#0f172a;">${t.first_name || ''} ${t.last_name || ''}</div>
                                                <div style="font-size:0.75rem; color:#64748b;">${t.email || ''}</div>
                                            </td>
                                            <td style="padding:20px 16px;">
                                                ${t.checked_in ? '<span style="color:#10b981; font-weight:950;">VALIDÉ ✅</span>' : '<span style="color:#94a3b8; font-weight:900;">EN ATTENTE</span>'}
                                            </td>
                                            <td style="padding:20px 16px; text-align:right;">
                                                ${!t.checked_in ? `<button onclick="TicketingModule.validateTicket('${t.id}', '${ev.id}')" style="background:none; border:none; color:#10b981; font-weight:950; cursor:pointer; text-decoration:underline;">Valider Entrée</button>` : ''}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    /**
     * 3. Scanner (Live Interface)
     */
    renderScanView(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `
            <div style="background:#020617; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; padding:40px; text-align:center;">
                <button onclick="window.Router.navigate('#billetterie?action=manage&id=${eventId}')" style="position:absolute; top:40px; left:40px; background:rgba(255,255,255,0.1); border:none; padding:12px 24px; border-radius:12px; color:white; font-weight:800; cursor:pointer;">Sortir du Scanner</button>
                <h2 style="font-weight:950; font-size:2rem; margin-bottom:32px;">Scanner DTC Engine 1.0</h2>
                <div style="width:300px; height:300px; border:4px solid #10b981; border-radius:40px; position:relative; background:rgba(255,255,255,0.05);">
                    <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:#10b981; animation: scan_line_anim 2s infinite ease-in-out; box-shadow:0 0 15px #10b981;"></div>
                </div>
                <div style="margin-top:40px; width:100%; max-width:400px;">
                    <input type="text" id="manual-ticket-id" placeholder="Code billet manuel..." style="width:100%; padding:18px; border-radius:16px; border:2px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:white; font-weight:900; text-align:center; margin-bottom:16px;">
                    <button onclick="TicketingModule.validateTicket(document.getElementById('manual-ticket-id').value, '${eventId}', true)" style="width:100%; background:#10b981; color:white; border:none; padding:18px; border-radius:16px; font-weight:950; cursor:pointer;">VALIDER</button>
                </div>
                <style>@keyframes scan_line_anim { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }</style>
            </div>
        `;
    },

    async validateTicket(ticketId, eventId, isScan = false) {
        if (!ticketId) return;
        try {
            const { data: ticket } = await window._supabase.from('tickets').select('*').eq('id', ticketId).eq('event_id', eventId).single();
            if (!ticket) { Swal.fire("Invalide", "Billet inconnu.", "error"); return; }
            if (ticket.checked_in) { Swal.fire("Doublon", "Déjà scanné.", "warning"); return; }
            await window._supabase.from('tickets').update({ checked_in: true }).eq('id', ticketId);
            Swal.fire("Accès Autorisé", "Bienvenue " + (ticket.first_name || ""), "success");
            if (isScan) document.getElementById('manual-ticket-id').value = '';
            else this.renderEventManager(eventId);
        } catch (err) { alert(err.message); }
    },

    async deleteEvent(id) {
        if (!confirm("Voulez-vous vraiment supprimer cet événement ? Toutes les données de billetterie seront perdues.")) return;
        await window._supabase.from('events').delete().eq('id', id);
        this.renderEventsList(document.getElementById('billetterie-view'));
    },

    // ... handleEditSubmit / renderEditForm / renderCreateForm ...
    async renderCreateForm(container) {
        container.innerHTML = `
             <div style="padding: clamp(20px, 4vw, 40px); font-family:'Plus Jakarta Sans', sans-serif;">
                <button onclick="window.Router.navigate('#billetterie')" style="margin-bottom:24px; background:white; border:1px solid #e2e8f0; padding:10px 20px; border-radius:12px; font-weight:800; cursor:pointer;">&larr; Annuler</button>
                <div style="background:white; border-radius:32px; border:1.5px solid #e2e8f0; padding:48px; max-width:800px; margin:0 auto;">
                    <h2 style="font-weight:950; font-size:2rem; margin-bottom:32px;">Nouvel Événement</h2>
                    <form onsubmit="TicketingModule.handleCreateSubmit(event)">
                        <div class="form-lux" style="margin-bottom:24px;">
                            <label>Titre de l'événement *</label>
                            <input type="text" id="ev-title" required placeholder="Ex: Masterclass Diaspora 2026" class="lux-input">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px;">
                            <div class="form-lux">
                                <label>Date</label>
                                <input type="date" id="ev-date" required class="lux-input">
                            </div>
                            <div class="form-lux">
                                <label>Capacité Max</label>
                                <input type="number" id="ev-capacity" placeholder="Illimité" class="lux-input">
                            </div>
                        </div>
                        <div class="form-lux" style="margin-bottom:32px;">
                            <label>Lieu / Adresse</label>
                            <input type="text" id="ev-location" required placeholder="Ex: Paris 8e ou Zoom" class="lux-input">
                        </div>
                        <button type="submit" id="ev-submit-btn" style="width:100%; background:#0f172a; color:white; border:none; padding:18px; border-radius:16px; font-weight:950; font-size:1.1rem; cursor:pointer;">PUBLIER LA BILLETTERIE</button>
                    </form>
                </div>
             </div>
             <style>
                .form-lux label { display:block; font-size:0.7rem; font-weight:950; color:#64748b; text-transform:uppercase; margin-bottom:10px; }
                .lux-input { width:100%; padding:18px; border-radius:16px; border:1.5px solid #e2e8f0; font-weight:700; font-family:inherit; background:#f8fafc; }
             </style>
        `;
    },

    async handleCreateSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('ev-submit-btn');
        btn.disabled = true;
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const data = {
                user_id: session.user.id,
                title: document.getElementById('ev-title').value,
                event_date: document.getElementById('ev-date').value,
                location: document.getElementById('ev-location').value,
                total_tickets: parseInt(document.getElementById('ev-capacity').value) || null,
                created_at: new Date()
            };
            await window._supabase.from('events').insert(data);
            window.Router.navigate('#billetterie');
        } catch (err) { alert(err.message); btn.disabled = false; }
    }
};

window.TicketingModule = TicketingModule;
