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
     * 1. Dashboard des Organisés
     */
    async renderEventsList(container) {
        container.innerHTML = `
            <div style="font-family:'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 48px); background:#fafafa; min-height:100vh;">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px; flex-wrap:wrap; gap:20px;">
                    <div>
                        <h1 style="font-size:clamp(1.8rem, 5vw, 2.5rem); font-weight:950; color:#0f172a; letter-spacing:-0.05em; margin:0;">Hub Organisateur</h1>
                        <p style="color:#64748b; font-weight:600; margin-top:8px;">Pilotez vos billetteries et suivez vos ventes en temps réel.</p>
                    </div>
                    <button onclick="window.Router.navigate('#billetterie?action=create')" class="btn-lux">+ Créer un Événement</button>
                </div>
                <div id="organizer-events-grid" class="dashboard-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:24px;">
                    <div style="grid-column: 1/-1; text-align:center; padding:80px;"><span class="loader"></span></div>
                </div>
            </div>
            <style>
                .btn-lux { background:#0f172a; color:white; border:none; padding:16px 32px; border-radius:14px; font-weight:900; cursor:pointer; transition:0.3s; }
                .btn-lux:hover { transform:translateY(-3px); box-shadow:0 12px 24px rgba(0,0,0,0.1); filter:brightness(1.2); }
                .event-card-pro { background:white; border-radius:24px; border:1.5px solid #e2e8f0; overflow:hidden; transition:0.3s; }
                .event-card-pro:hover { border-color:#10b981; transform:translateY(-5px); box-shadow:0 20px 40px rgba(0,0,0,0.05); }
            </style>
        `;

        const grid = document.getElementById('organizer-events-grid');
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const { data: events, error } = await window._supabase.from('events').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            if (error) throw error;

            if (!events || events.length === 0) {
                grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:80px; background:white; border-radius:28px; border:2px dashed #cbd5e1;"><h3 style="font-weight:900;">Aucun événement publié</h3><p>Propulsez votre premier événement dès aujourd'hui.</p></div>`;
                return;
            }

            // Sync sales data
            const eventIds = events.map(e => e.id);
            const { data: tickets } = await window._supabase.from('tickets').select('event_id, amount_paid').in('event_id', eventIds);
            const salesMap = {};
            if (tickets) {
                tickets.forEach(t => {
                    if(!salesMap[t.event_id]) salesMap[t.event_id] = { count: 0, total: 0 };
                    salesMap[t.event_id].count++;
                    salesMap[t.event_id].total += (t.amount_paid || 0);
                });
            }

            grid.innerHTML = events.map(ev => {
                const sales = salesMap[ev.id] || { count: 0, total: 0 };
                return `
                    <div class="event-card-pro">
                        <div style="height:180px; position:relative;">
                            <img src="${ev.image_url || '/assets/images/default-event.jpg'}" style="width:100%; height:100%; object-fit:cover;">
                            <div style="position:absolute; top:12px; right:12px; background:white; padding:4px 12px; border-radius:100px; font-size:0.7rem; font-weight:900; color:#0f172a;">${ev.event_date}</div>
                        </div>
                        <div style="padding:24px;">
                            <h4 style="margin:0 0 12px 0; font-size:1.2rem; font-weight:950; text-transform:uppercase; color:#0f172a;">${ev.title}</h4>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:20px; margin-bottom:24px;">
                                <div>
                                    <span style="display:block; font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase;">Ventes</span>
                                    <span style="font-size:1.1rem; font-weight:900; color:#0f172a;">${sales.count}</span>
                                </div>
                                <div>
                                    <span style="display:block; font-size:0.65rem; font-weight:900; color:#10b981; text-transform:uppercase;">C.A Brut</span>
                                    <span style="font-size:1.1rem; font-weight:950; color:#10b981;">${sales.total.toFixed(2)} €</span>
                                </div>
                            </div>
                            <div style="display:flex; gap:10px;">
                                <button onclick="TicketingModule.renderEventManager('${ev.id}')" style="flex:2; background:#0f172a; color:white; border:none; padding:12px; border-radius:10px; font-weight:900; cursor:pointer;">GÉRER / SCAN</button>
                                <button onclick="TicketingModule.renderEditForm('${ev.id}')" style="flex:1; background:white; border:1.5px solid #e2e8f0; padding:12px; border-radius:10px; font-weight:800; cursor:pointer;">ÉDITER</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) { alert(err.message); }
    },

    /**
     * 2. Tour de Contrôle Organisateur (La fameuse zone post-publication)
     */
    async renderEventManager(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center; padding:100px;"><span class="loader"></span></div>`;

        try {
            const { data: ev } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            const { data: attendees } = await window._supabase.from('tickets').select('*').eq('event_id', eventId).order('created_at', { ascending: false });

            const gross = attendees.reduce((acc, t) => acc + (t.amount_paid || 0), 0);
            const net = gross * 0.85; // 15% Platform Commission

            view.innerHTML = `
                <div style="padding: clamp(24px, 5vw, 48px); font-family:'Plus Jakarta Sans', sans-serif;">
                    <button onclick="TicketingModule.loadMyTicketing()" style="margin-bottom:24px; background:white; border:1px solid #e2e8f0; padding:8px 16px; border-radius:10px; font-weight:800; cursor:pointer;">&larr; Retour</button>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; flex-wrap:wrap; gap:20px;">
                        <div>
                            <h1 style="font-weight:950; color:#0f172a; font-size:2.2rem; letter-spacing:-0.04em;">Tour de Contrôle : ${ev.title}</h1>
                            <p style="color:#64748b; font-weight:600;">Monitor de performance en temps réel et scanner d'accès.</p>
                        </div>
                        <button onclick="TicketingModule.renderScanView('${ev.id}')" style="background:#10b981; color:white; padding:18px 40px; border-radius:16px; border:none; font-weight:950; font-size:1.1rem; cursor:pointer; box-shadow:0 12px 24px rgba(16,185,129,0.2);">ACTIVER LE SCANNER</button>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px; margin-bottom:48px;">
                        <div style="background:white; padding:32px; border-radius:28px; border:1px solid #e2e8f0;">
                            <span style="font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase;">Volume de vente</span>
                            <div style="font-size:3rem; font-weight:950; color:#0f172a; margin-top:10px;">${attendees.length} <span style="font-size:1.2rem; color:#cbd5e1;">/ ${ev.total_tickets || '∞'}</span></div>
                        </div>
                        <div style="background:#0f172a; padding:32px; border-radius:28px; color:white;">
                            <span style="font-size:0.75rem; font-weight:900; color:rgba(255,255,255,0.4); text-transform:uppercase;">Recettes Nettes (Reversement)</span>
                            <div style="font-size:3rem; font-weight:950; color:#10b981; margin-top:10px;">${net.toFixed(2)} €</div>
                            <div style="font-size:0.8rem; color:rgba(255,255,255,0.5); font-weight:600;">Déjà déduit: 15% frais DTC (${(gross - net).toFixed(2)} €)</div>
                        </div>
                    </div>

                    <div style="background:white; border-radius:32px; border:1.5px solid #e2e8f0; padding:40px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.02);">
                        <h3 style="font-weight:950; margin-bottom:32px;">Liste des Participants (${attendees.length})</h3>
                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse;">
                                <thead style="text-align:left; border-bottom:2px solid #f1f5f9;">
                                    <tr>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Participant</th>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Achat</th>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Contrôle d'accès</th>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; text-align:right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${attendees.map(t => `
                                        <tr style="border-bottom:1px solid #f8fafc;">
                                            <td style="padding:20px 12px;">
                                                <div style="font-weight:900; color:#0f172a;">${t.first_name || ''} ${t.last_name || ''}</div>
                                                <div style="font-size:0.75rem; color:#64748b; font-weight:700;">${t.email || ''}</div>
                                            </td>
                                            <td style="padding:20px 12px; font-size:0.85rem; color:#64748b; font-weight:700;">${new Date(t.created_at).toLocaleDateString()}</td>
                                            <td style="padding:20px 12px;">
                                                ${t.checked_in 
                                                    ? `<span style="background:#ecfdf5; color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.65rem; font-weight:950; text-transform:uppercase; border:1.5px solid #10b981;">Arrivé</span>`
                                                    : `<span style="background:#f1f5f9; color:#94a3b8; padding:6px 14px; border-radius:100px; font-size:0.65rem; font-weight:950; text-transform:uppercase;">En attente</span>`}
                                            </td>
                                            <td style="padding:20px 12px; text-align:right;">
                                                ${!t.checked_in ? `<button onclick="TicketingModule.validateTicket('${t.id}', '${ev.id}')" style="background:none; border:none; color:#10b981; font-weight:900; font-size:0.75rem; text-decoration:underline; cursor:pointer;">VALIDER L'ACCÈS</button>` : ''}
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
     * 3. Scanner Engine Interface (Zone Live Terrain)
     */
    renderScanView(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `
            <div style="background:#020617; min-height:100vh; padding:40px; color:white; font-family:'Plus Jakarta Sans', sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                <button onclick="TicketingModule.renderEventManager('${eventId}')" style="position:absolute; top:40px; left:40px; background:rgba(255,255,255,0.1); border:none; padding:12px 24px; border-radius:12px; color:white; font-weight:800; cursor:pointer;">STOP SCANNER &rarr; Retour Hub</button>
                
                <h2 style="font-size:2rem; font-weight:950; margin-bottom:8px;">Contrôle d'Entrée Actif</h2>
                <p style="color:rgba(255,255,255,0.5); font-weight:600; margin-bottom:48px;">Pointez la caméra vers le QR Code du visiteur.</p>

                <div id="qr-camera-wrap" style="width:340px; height:340px; border:4px solid #10b981; border-radius:40px; position:relative; overflow:hidden; background:rgba(255,255,255,0.05); box-shadow:0 0 100px rgba(16,185,129,0.3);">
                    <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:#10b981; box-shadow:0 0 20px #10b981; animation: scanning_pro 2s infinite ease-in-out;"></div>
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:0.1; font-size:4rem;">📷</div>
                </div>

                <div style="margin-top:52px; width:100%; max-width:400px;">
                    <input type="text" id="manual-entry-id" placeholder="ID Billet (manuel)..." style="width:100%; padding:18px; border-radius:16px; border:2px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; font-weight:900; font-size:1.1rem; text-align:center; margin-bottom:16px;">
                    <button onclick="TicketingModule.validateTicket(document.getElementById('manual-entry-id').value, '${eventId}', true)" style="width:100%; background:#10b981; color:white; padding:18px; border-radius:16px; border:none; font-weight:950; cursor:pointer;">VALIDER MANUELLEMENT</button>
                </div>

                <style>
                    @keyframes scanning_pro { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
                </style>
            </div>
        `;
    },

    async validateTicket(ticketId, eventId, isScan = false) {
        if (!ticketId) return;
        try {
            const { data, error } = await window._supabase.from('tickets').select('*').eq('id', ticketId).eq('event_id', eventId).single();
            if (error || !data) {
                Swal.fire({ title: 'BILLET INVALIDE', text: 'Ce code ne correspond à aucun billet pour cet événement.', icon: 'error', background:'#020617', color:'white' });
                return;
            }
            if (data.checked_in) {
                Swal.fire({ title: 'DÉJÀ UTILISÉ', text: 'Ce billet a déjà été validé à ' + new Date(data.updated_at).toLocaleTimeString(), icon: 'warning' });
                return;
            }

            await window._supabase.from('tickets').update({ checked_in: true, updated_at: new Date() }).eq('id', ticketId);
            
            Swal.fire({ 
                title: 'ACCÈS AUTORISÉ', 
                html: `<div style="font-weight:800; font-size:1.5rem; color:#10b981;">BIENVENUE<br>${(data.first_name || '').toUpperCase()}</div>`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            if (isScan) {
                document.getElementById('manual-entry-id').value = '';
            } else {
                this.renderEventManager(eventId);
            }
        } catch (err) { alert(err.message); }
    },

    /**
     * 4. Modification Post-Publication (Édition Hub)
     */
    async renderEditForm(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center; padding:100px;"><span class="loader"></span></div>`;
        
        try {
            const { data: ev } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            view.innerHTML = `
                <div style="padding: clamp(24px, 5vw, 48px); font-family:'Plus Jakarta Sans', sans-serif; max-width:900px; margin:0 auto;">
                    <button onclick="TicketingModule.loadMyTicketing()" style="margin-bottom:24px; background:white; border:1px solid #e2e8f0; padding:8px 16px; border-radius:10px; font-weight:800; cursor:pointer;">&larr; Annuler</button>
                    <h2 style="font-weight:950; font-size:2rem; margin-bottom:40px;">Modifier la Billetterie : ${ev.title}</h2>
                    
                    <form onsubmit="TicketingModule.handleEditSubmit(event, '${ev.id}')" style="background:white; border:1.5px solid #e2e8f0; border-radius:32px; padding:40px; display:grid; gap:24px;">
                        <div>
                            <label style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Titre de l'événement</label>
                            <input type="text" id="edit-ev-title" value="${ev.title}" required style="width:100%; padding:16px; border-radius:14px; border:1.5px solid #e2e8f0; font-weight:700;">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div>
                                <label style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Date Fixée</label>
                                <input type="date" id="edit-ev-date" value="${ev.event_date}" required style="width:100%; padding:16px; border-radius:14px; border:1.5px solid #e2e8f0; font-weight:700;">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Lieu du RDV</label>
                                <input type="text" id="edit-ev-location" value="${ev.location}" required style="width:100%; padding:16px; border-radius:14px; border:1.5px solid #e2e8f0; font-weight:700;">
                            </div>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Description & Programme</label>
                            <textarea id="edit-ev-description" rows="5" style="width:100%; padding:16px; border-radius:14px; border:1.5px solid #e2e8f0; font-weight:700; font-family:inherit;">${ev.description || ''}</textarea>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div>
                                <label style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Quota de Billets</label>
                                <input type="number" id="edit-ev-capacity" value="${ev.total_tickets || ''}" placeholder="Illimité" style="width:100%; padding:16px; border-radius:14px; border:1.5px solid #e2e8f0; font-weight:700;">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Prix Unitaire (€)</label>
                                <input type="number" id="edit-ev-price" value="${ev.price || 0}" step="0.01" style="width:100%; padding:16px; border-radius:14px; border:1.5px solid #e2e8f0; font-weight:700;">
                            </div>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Affiche / Visuel</label>
                            <div style="display:flex; gap:16px; align-items:center;">
                                <input type="file" id="edit-ev-image-file" accept="image/*" style="flex:1; padding:12px; border:1px dashed #cbd5e1; border-radius:14px; background:#f8fafc; cursor:pointer;">
                                <input type="hidden" id="edit-ev-image" value="${ev.image_url || ''}">
                                <div id="edit-ev-image-preview" style="width:80px; height:80px; border-radius:14px; background:#f1f5f9; border:1px solid #e2e8f0; background-size:cover; background-position:center; background-image:url('${ev.image_url || ''}')"></div>
                            </div>
                        </div>
                        <div style="display:flex; justify-content:flex-end; gap:16px; margin-top:20px;">
                            <button type="submit" style="background:#0f172a; color:white; padding:18px 48px; border-radius:16px; border:none; font-weight:950; cursor:pointer;" id="save-edit-btn">METTRE À JOUR LA BILLETTERIE</button>
                        </div>
                    </form>
                </div>
            `;

            // Image Upload Logic for Editor
            const fileInput = document.getElementById('edit-ev-image-file');
            if(fileInput) {
                fileInput.onchange = async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const btn = document.getElementById('save-edit-btn');
                    btn.disabled = true;
                    try {
                        const fileExt = file.name.split('.').pop();
                        const filePath = `events/${Math.random()}.${fileExt}`;
                        const { error: uploadError } = await window._supabase.storage.from('avatars').upload(filePath, file);
                        if (uploadError) throw uploadError;
                        const { data: { publicUrl } } = window._supabase.storage.from('avatars').getPublicUrl(filePath);
                        document.getElementById('edit-ev-image').value = publicUrl;
                        document.getElementById('edit-ev-image-preview').style.backgroundImage = `url('${publicUrl}')`;
                    } catch (err) { alert(err.message); } finally { btn.disabled = false; }
                };
            }
        } catch (err) { alert(err.message); }
    },

    async handleEditSubmit(e, eventId) {
        e.preventDefault();
        const btn = document.getElementById('save-edit-btn');
        btn.disabled = true;
        try {
            const data = {
                title: document.getElementById('edit-ev-title').value,
                event_date: document.getElementById('edit-ev-date').value,
                location: document.getElementById('edit-ev-location').value,
                description: document.getElementById('edit-ev-description').value,
                total_tickets: parseInt(document.getElementById('edit-ev-capacity').value) || null,
                price: parseFloat(document.getElementById('edit-ev-price').value) || 0,
                image_url: document.getElementById('edit-ev-image').value || null
            };
            const { error } = await window._supabase.from('events').update(data).eq('id', eventId);
            if (error) throw error;
            TicketingModule.renderEventManager(eventId);
        } catch (err) { alert(err.message); } finally { btn.disabled = false; }
    },

    // ... (rest of helper functions for creation forms, uploads, etc. will follow same pro style)
};

window.TicketingModule = TicketingModule;
