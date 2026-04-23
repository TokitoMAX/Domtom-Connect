/**
 * Ticketing Module - Domtom Connect
 * Simplified Hub for Event Management & Creation
 */
const TicketingModule = {
    /**
     * Main Entry Point for Ticketing Hub
     */
    async loadMyTicketing(params = null) {
        const view = document.getElementById('billetterie-view');
        if (!view) return;

        const action = params ? params.get('action') : null;

        if (action === 'create') {
            await this.renderCreateForm(view);
        } else {
            await this.renderEventsList(view);
        }
    },

    /**
     * Render the list of events created by user
     */
    async renderEventsList(container) {
        container.innerHTML = `
            <div class="dash-section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;">
                <div>
                    <h1 style="color:#0f172a; margin:0; font-weight:950; letter-spacing:-0.03em;">Billetterie & Événements</h1>
                    <p style="margin:4px 0 0; color:#64748b; font-weight:600;">Gérez vos réservations et vos événements organisés.</p>
                </div>
                <button onclick="window.Router.navigate('#billetterie?action=create')" class="cta-button primary" style="background:#10b981; border:none; padding:12px 24px; border-radius:12px; font-weight:900;">
                    + Créer un évènement
                </button>
            </div>
            <div id="billetterie-list" class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
                <div style="grid-column: 1/-1; text-align:center; padding:40px;">Chargement de votre billetterie...</div>
            </div>
        `;

        const listContainer = document.getElementById('billetterie-list');
        
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) return;

            const { data: myEvents, error: evError } = await window._supabase
                .from('events')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (evError) throw evError;

            if (!myEvents || myEvents.length === 0) {
                listContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 80px 40px; background: white; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                        <div style="font-size: 4rem; margin-bottom: 24px;">🎟️</div>
                        <h3 style="font-size: 1.5rem; font-weight: 950; color:#0f172a; margin-bottom: 12px; letter-spacing:-0.02em;">C'est ici que tout commence !</h3>
                        <p style="color: #64748b; margin-bottom: 32px; font-weight:500; max-width:400px; margin-left:auto; margin-right:auto;">Vous n'avez pas encore publié d'événement. Créez votre première billetterie pour engager votre communauté.</p>
                        <button onclick="window.Router.navigate('#billetterie?action=create')" class="cta-button primary" style="background:#0f172a; padding:16px 32px; border-radius:14px; font-weight:900;">Publier mon premier Évènement</button>
                    </div>
                `;
                return;
            }

            // Fetch ticket counts
            const eventIds = myEvents.map(ev => ev.id);
            const { data: tickets, error: tkError } = await window._supabase
                .from('tickets')
                .select('event_id, amount_paid')
                .in('event_id', eventIds);

            const ticketsMap = {};
            if (!tkError && tickets) {
                tickets.forEach(t => {
                    if (!ticketsMap[t.event_id]) ticketsMap[t.event_id] = [];
                    ticketsMap[t.event_id].push(t);
                });
            }

            listContainer.innerHTML = myEvents.map(ev => {
                const evTickets = ticketsMap[ev.id] || [];
                const totalPaid = evTickets.reduce((acc, t) => acc + (parseFloat(t.amount_paid) || 0), 0);
                
                return `
                    <div class="dash-card" style="padding: 0; overflow: hidden; border-radius: 24px; border: 1px solid #e2e8f0; background: white; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 25px -5px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.05)'">
                        <div style="height: 160px; position:relative;">
                            <img src="${ev.image_url || '/assets/images/placeholder-event.jpg'}" style="width:100%; height:100%; object-fit:cover; transition: 0.5s transform;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='none'">
                            <div style="position:absolute; bottom:12px; left:12px; background:rgba(15,23,42,0.9); padding:4px 12px; border-radius:8px; font-size:0.7rem; font-weight:900; color:white; backdrop-filter:blur(4px);">
                                ${ev.event_date}
                            </div>
                        </div>
                        <div style="padding: 24px;">
                            <h4 style="margin:0 0 6px 0; font-size:1.1rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:-0.02em;">${ev.title}</h4>
                            <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px; font-weight:600; display:flex; align-items:center; gap:6px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                ${ev.location}
                            </p>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; border-top:1px solid #f1f5f9; padding-top:20px; margin-bottom:24px;">
                                <div>
                                    <span style="display:block; font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Réservations</span>
                                    <span style="font-size:1rem; font-weight:950; color:#0f172a;">${evTickets.length} <span style="font-size:0.75rem; color:#cbd5e1; font-weight:600;">/ ${(ev.total_tickets || '∞')}</span></span>
                                </div>
                                <div>
                                    <span style="display:block; font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">CA Brut</span>
                                    <span style="font-size:1rem; font-weight:950; color:#10b981;">${totalPaid.toFixed(2)}€</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="TicketingModule.renderEventManager('${ev.id}')" class="cta-button primary" style="flex:1.5; font-size:0.75rem; padding:10px; background:#0f172a; border-radius:10px; font-weight:900;">Gestion & Scan</button>
                                <button onclick="TicketingModule.renderEditForm('${ev.id}')" class="cta-button ghost" style="flex:1; font-size:0.75rem; padding:10px; border:1px solid #e2e8f0; border-radius:10px; background:white; font-weight:800;">Éditer</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (err) {
            console.error("Ticketing Load Error:", err);
            listContainer.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur de chargement: ${err.message}</div>`;
        }
    },

    /**
     * Render the simplified creation form
     */
    async renderCreateForm(container) {
        container.innerHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: clamp(24px, 5vw, 48px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                <div style="margin-bottom: 40px; display:flex; flex-wrap: wrap; gap: 20px; justify-content:space-between; align-items:flex-end;">
                    <div>
                        <button onclick="window.Router.navigate('#billetterie')" class="cta-button ghost" style="margin-bottom: 16px; padding: 10px 18px; font-size: 0.85rem; border:1px solid #e2e8f0; border-radius:12px; font-weight:800; cursor:pointer; background:white;">
                            &larr; Retour à la billetterie
                        </button>
                        <h1 style="color:#0f172a; margin:0; font-size:clamp(2rem, 5vw, 2.5rem); font-weight:950; letter-spacing:-0.04em;">Nouvel Évènement</h1>
                        <p style="margin:8px 0 0; color:#64748b; font-size:1.1rem; font-weight:500;">Propulsez votre évènement stratégique sur toute la diaspora.</p>
                    </div>
                    <div style="background:#ecfdf5; color:#10b981; padding:8px 16px; border-radius:12px; font-weight:800; font-size:0.8rem; border:1px solid rgba(16, 185, 129, 0.2);">
                        HUB OFFICIEL
                    </div>
                </div>

                <div class="ticketing-hub-layout" style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px; align-items: start;">
                    <div class="dash-card" style="padding: 40px; background: white; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03);">
                        <form id="event-creation-form" onsubmit="TicketingModule.handleCreateSubmit(event)">
                            <div style="display: flex; flex-direction: column; gap: 32px;">
                                <div>
                                    <h3 style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:24px; display:flex; align-items:center; gap:8px;">
                                        <span style="width:20px; height:20px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:#0f172a;">1</span>
                                        Identité de l'évènement
                                    </h3>
                                    <div class="form-group" style="margin-bottom:24px;">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Titre Stratégique *</label>
                                        <input type="text" id="ev-title" required placeholder="Ex: Sommet de l'Innovation Diaspora 2026" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-size:1rem; font-weight:700; background:#f8fafc;">
                                    </div>
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Description & Programme</label>
                                        <textarea id="ev-description" rows="5" placeholder="Décrivez la valeur unique de votre évènement..." style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-family:inherit; font-size:0.95rem; line-height:1.6; background:#f8fafc;"></textarea>
                                    </div>
                                </div>
                                <div>
                                    <h3 style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:24px; display:flex; align-items:center; gap:8px;">
                                        <span style="width:20px; height:20px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:#0f172a;">2</span>
                                        Logistique & Accès
                                    </h3>
                                    <div class="role-upgrade-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                        <div class="form-group">
                                            <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Date *</label>
                                            <input type="date" id="ev-date" required style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                        </div>
                                        <div class="form-group">
                                            <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Capacité</label>
                                            <input type="number" id="ev-capacity" placeholder="Illimité" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                        </div>
                                        <div class="form-group" style="grid-column: 1/-1;">
                                            <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Lieu Physique *</label>
                                            <input type="text" id="ev-location" required placeholder="Ex: Paris 8e ou Palais des Congrès" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:24px; display:flex; align-items:center; gap:8px;">
                                        <span style="width:20px; height:20px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:#0f172a;">3</span>
                                        Visuels
                                    </h3>
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Affiche</label>
                                        <div style="display:flex; gap:16px; align-items:center;">
                                            <input type="file" id="ev-image-file" accept="image/*" style="flex:1; padding:12px; border:1px dashed #cbd5e1; border-radius:14px; background:#f8fafc; cursor:pointer;">
                                            <input type="hidden" id="ev-image" value="">
                                            <div id="ev-image-preview" style="width:60px; height:60px; border-radius:12px; background:#f1f5f9; border:1px solid #e2e8f0; background-size:cover; background-position:center;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top: 48px; display: flex; justify-content: flex-end; gap: 16px;">
                                <button type="button" onclick="window.Router.navigate('#billetterie')" class="cta-button secondary" style="border-radius:14px; padding:16px 32px; font-weight:800;">Annuler</button>
                                <button type="submit" class="cta-button primary" id="ev-submit-btn" style="background:#0f172a; color:white; border:none; padding:16px 40px; border-radius:14px; font-weight:950; cursor:pointer;">PUBLIER L'ÉVÈNEMENT</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Setup image upload listener
        setTimeout(() => {
            const fileInput = document.getElementById('ev-image-file');
            if(fileInput) {
                fileInput.onchange = async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const btn = document.getElementById('ev-submit-btn');
                    btn.disabled = true;
                    try {
                        const fileExt = file.name.split('.').pop();
                        const filePath = `events/${Math.random()}.${fileExt}`;
                        const { error: uploadError } = await window._supabase.storage.from('avatars').upload(filePath, file);
                        if (uploadError) throw uploadError;
                        const { data: { publicUrl } } = window._supabase.storage.from('avatars').getPublicUrl(filePath);
                        document.getElementById('ev-image').value = publicUrl;
                        document.getElementById('ev-image-preview').style.backgroundImage = `url('${publicUrl}')`;
                    } catch (err) { alert(err.message); } finally { btn.disabled = false; }
                };
            }
        }, 300);
    },

    /**
     * Render the Edit Form
     */
    async renderEditForm(eventId) {
        const container = document.getElementById('billetterie-view');
        container.innerHTML = `<div style="text-align:center; padding:40px;"><span class="loader"></span></div>`;
        try {
            const { data: ev, error } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            if (error) throw error;
            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; padding: clamp(24px, 5vw, 48px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                    <div style="margin-bottom: 40px;">
                        <button onclick="window.Router.navigate('#billetterie')" class="cta-button ghost" style="margin-bottom: 16px;">&larr; Retour</button>
                        <h1 style="color:#0f172a; font-size:2rem; font-weight:950; margin:0;">Édition: ${ev.title}</h1>
                    </div>
                    <div class="dash-card" style="padding: 40px; background: white; border-radius: 28px; border: 1px solid #e2e8f0;">
                         <form onsubmit="TicketingModule.handleEditSubmit(event, '${ev.id}')">
                            <div style="display: flex; flex-direction: column; gap: 24px;">
                                <div class="form-group">
                                    <label style="display:block; font-weight:800; font-size:0.75rem; margin-bottom:8px;">Titre de l'évènement</label>
                                    <input type="text" id="edit-ev-title" value="${ev.title}" required style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0;">
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; margin-bottom:8px;">Date</label>
                                        <input type="date" id="edit-ev-date" value="${ev.event_date}" required style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0;">
                                    </div>
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; margin-bottom:8px;">Lieu</label>
                                        <input type="text" id="edit-ev-location" value="${ev.location}" required style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0;">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label style="display:block; font-weight:800; font-size:0.75rem; margin-bottom:8px;">Description</label>
                                    <textarea id="edit-ev-description" rows="4" style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0;">${ev.description || ''}</textarea>
                                </div>
                                <button type="submit" class="cta-button primary" id="edit-ev-submit-btn" style="width:100%; padding:16px; border-radius:14px; font-weight:900;">Mettre à jour l'évènement</button>
                            </div>
                         </form>
                    </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    async handleEditSubmit(e, eventId) {
        e.preventDefault();
        const btn = document.getElementById('edit-ev-submit-btn');
        btn.disabled = true;
        try {
            const data = {
                title: document.getElementById('edit-ev-title').value,
                event_date: document.getElementById('edit-ev-date').value,
                location: document.getElementById('edit-ev-location').value,
                description: document.getElementById('edit-ev-description').value
            };
            const { error } = await window._supabase.from('events').update(data).eq('id', eventId);
            if (error) throw error;
            window.Router.navigate('#billetterie');
        } catch (err) { alert(err.message); } finally { btn.disabled = false; }
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
                description: document.getElementById('ev-description').value,
                image_url: document.getElementById('ev-image').value || null,
                total_tickets: parseInt(document.getElementById('ev-capacity').value) || null,
                created_at: new Date()
            };
            const { error } = await window._supabase.from('events').insert(data);
            if (error) throw error;
            window.Router.navigate('#billetterie');
        } catch (err) { alert(err.message); } finally { btn.disabled = false; }
    },

    /**
     * Render the Event Manager (Organizers Only)
     */
    async renderEventManager(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center; padding:40px;"><span class="loader"></span></div>`;
        try {
            const { data: ev, error: evErr } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            const { data: attendees, error: atErr } = await window._supabase.from('tickets').select('*').eq('event_id', eventId).order('created_at', { ascending: false });
            if (evErr || atErr) throw (evErr || atErr);

            const netCommissionRate = 0.15;
            const grossSales = attendees.reduce((acc, t) => acc + (parseFloat(t.amount_paid) || 0), 0);
            const platformFee = grossSales * netCommissionRate;
            const netOrganizer = grossSales - platformFee;

            view.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; padding: clamp(24px, 5vw, 48px); max-width: 1240px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                    <div style="margin-bottom: 32px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
                        <div>
                            <button onclick="window.Router.navigate('#billetterie')" class="cta-button ghost" style="margin-bottom: 12px;">&larr; Retour</button>
                            <h1 style="color:#0f172a; margin:0; font-weight:950; letter-spacing:-0.03em;">Pilotage: ${ev.title}</h1>
                            <p style="margin:4px 0 0; color:#64748b; font-weight:600;">Statistiques de vente et contrôle d'accès</p>
                        </div>
                        <button onclick="TicketingModule.renderScanView('${ev.id}')" class="cta-button primary" style="background:#0f172a; padding:12px 24px; border-radius:14px; font-weight:900;">Scanner Billets</button>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px;">
                        <div style="background: white; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                             <h4 style="font-size: 0.7rem; font-weight: 850; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Ventes Brutes</h4>
                             <div style="font-size: 2.5rem; font-weight: 900; color:#0f172a;">${grossSales.toFixed(2)}€</div>
                        </div>
                        <div style="background: white; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0;">
                             <h4 style="font-size: 0.7rem; font-weight: 850; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Commission Plateforme (15%)</h4>
                             <div style="font-size: 2.5rem; font-weight: 900; color:#ef4444;">-${platformFee.toFixed(2)}€</div>
                        </div>
                        <div style="background: #0f172a; padding: 32px; border-radius: 24px; color:white;">
                             <h4 style="font-size: 0.7rem; font-weight: 850; color:rgba(255,255,255,0.4); text-transform:uppercase; margin-bottom:12px;">Net Organisateur</h4>
                             <div style="font-size: 2.5rem; font-weight: 900; color:#10b981;">${netOrganizer.toFixed(2)}€</div>
                        </div>
                    </div>

                    <div style="background:white; border-radius:32px; border:1px solid #e2e8f0; padding:40px;">
                        <h3 style="font-size:1.35rem; font-weight:950; margin-bottom:32px;">Participants (${attendees.length})</h3>
                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse;">
                                <thead style="text-align:left; border-bottom:2px solid #f1f5f9;">
                                    <tr>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8;">Participant</th>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8;">Accès</th>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8;">Date</th>
                                        <th style="padding:16px 12px; font-size:0.75rem; color:#94a3b8; text-align:right;">Net Org.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${attendees.map(t => {
                                        const tNet = (parseFloat(t.amount_paid) || 0) * (1 - netCommissionRate);
                                        return `
                                            <tr style="border-bottom:1px solid #f8fafc;">
                                                <td style="padding:20px 12px;">
                                                    <div style="font-weight:800; color:#0f172a;">${t.first_name || ''} ${t.last_name || ''}</div>
                                                    <div style="font-size:0.7rem; color:#64748b;">${t.email || ''}</div>
                                                </td>
                                                <td style="padding:20px 12px;">
                                                    <span style="background:${t.checked_in ? '#f0fdf4' : '#f1f5f9'}; color:${t.checked_in ? '#10b981' : '#64748b'}; padding:6px 14px; border-radius:100px; font-size:0.7rem; font-weight:900;">
                                                        ${t.checked_in ? 'Arrivé' : 'Attente'}
                                                    </span>
                                                    ${!t.checked_in ? `<button onclick="TicketingModule.validateTicket('${t.id}', '${ev.id}')" style="margin-left:12px; color:#10b981; font-weight:800; font-size:0.7rem; cursor:pointer; background:none; border:none; text-decoration:underline;">Valider</button>` : ''}
                                                </td>
                                                <td style="padding:20px 12px; font-size:0.85rem; color:#64748b;">${new Date(t.created_at).toLocaleDateString()}</td>
                                                <td style="padding:20px 12px; text-align:right; font-weight:900; color:#10b981;">${tNet.toFixed(2)}€</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) { alert(err.message); }
    },

    /**
     * Render the Scan View for Entrance Control
     */
    renderScanView(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `
            <div style="padding:40px; max-width:600px; margin:0 auto; text-align:center; font-family:'Inter', sans-serif;">
                <button onclick="TicketingModule.renderEventManager('${eventId}')" class="cta-button ghost" style="margin-bottom:32px; border:1px solid #e2e8f0; border-radius:10px; font-weight:800;">&larr; Retour Gestion</button>
                <h2 style="font-weight:900; margin-bottom:8px;">Scanner des Billets</h2>
                <p style="color:#64748b; margin-bottom:32px;">Pointez la caméra vers le QR Code du billet.</p>
                <div id="qr-reader-placeholder" style="aspect-ratio:3/4; background:#020617; border-radius:32px; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white;">
                    <div style="width:200px; height:200px; border:2px solid #10b981; border-radius:20px; position:relative;">
                        <div style="position:absolute; top:0; left:0; width:100%; height:2px; background:#10b981; animation: scanning 2s infinite ease-in-out;"></div>
                    </div>
                    <p style="margin-top:32px; font-weight:700; opacity:0.6;">DTC Scanner Engine Active</p>
                </div>
                <div style="margin-top:32px;">
                    <input type="text" id="manual-ticket-id" placeholder="Ou entrez l'ID du billet manuellement" style="width:100%; padding:14px; border-radius:12px; border:1.5px solid #e2e8f0; font-weight:700; margin-bottom:12px;">
                    <button onclick="TicketingModule.validateTicket(document.getElementById('manual-ticket-id').value, '${eventId}')" class="cta-button primary" style="width:100%; padding:14px; border-radius:12px; font-weight:900;">Valider manuellement</button>
                </div>
            </div>
            <style>@keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }</style>
        `;
    },

    async validateTicket(ticketId, eventId) {
        if (!ticketId) return;
        try {
            const { data, error } = await window._supabase.from('tickets').select('*').eq('id', ticketId).eq('event_id', eventId).single();
            if (error || !data) {
                Swal.fire({ title: 'Invalide', text: 'Ce billet n\'existe pas pour cet évènement.', icon: 'error' });
                return;
            }
            if (data.checked_in) {
                Swal.fire({ title: 'Déjà scanné', text: 'Ce billet a déjà été utilisé le ' + new Date(data.updated_at).toLocaleString(), icon: 'warning' });
                return;
            }
            await window._supabase.from('tickets').update({ checked_in: true, updated_at: new Date() }).eq('id', ticketId);
            Swal.fire({ title: 'Billet Validé !', text: 'Bienvenue à bord ' + (data.first_name || ''), icon: 'success' });
            if (document.getElementById('manual-ticket-id')) document.getElementById('manual-ticket-id').value = '';
            // Refresh list if manager is open
            const participantTable = document.querySelector('table');
            if (participantTable) this.renderEventManager(eventId);
        } catch (err) { alert(err.message); }
    },
};

window.TicketingModule = TicketingModule;
