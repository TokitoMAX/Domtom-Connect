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
                    <h1 style="color:#0f172a; margin:0;">Billetterie & Événements</h1>
                    <p style="margin:4px 0 0; color:#64748b;">Gérez vos réservations et vos événements organisés.</p>
                </div>
                <button onclick="window.Router.navigate('#billetterie?action=create')" class="cta-button primary" style="background:#10b981; border:none; padding:12px 24px;">
                    + Créer un évènement
                </button>
            </div>
            <div id="billetterie-list" class="dashboard-grid">
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
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: 20px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">🎟️</div>
                        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">Aucune billetterie</h3>
                        <p style="color: #64748b; margin-bottom: 24px;">Vous n'avez pas encore publié d'événement avec billetterie native.</p>
                        <button onclick="window.Router.navigate('#billetterie?action=create')" class="cta-button primary" style="background:#10b981;">Commencer maintenant</button>
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
                    <div class="dash-card" style="padding: 0; overflow: hidden; border-radius: 16px; border: 1px solid #e2e8f0; background: white; transition: transform 0.2s;">
                        <div style="height: 140px; position:relative;">
                            <img src="${ev.image_url || '/assets/images/default-event.jpg'}" style="width:100%; height:100%; object-fit:cover;">
                            <div style="position:absolute; top:12px; right:12px; background:white; padding:4px 12px; border-radius:100px; font-size:0.7rem; font-weight:800; color:#0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                ${ev.event_date}
                            </div>
                        </div>
                        <div style="padding: 20px;">
                            <h4 style="margin:0 0 4px 0; font-size:1.1rem; font-weight:800; color:#0f172a; text-transform:uppercase;">${ev.title}</h4>
                            <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">${ev.location}</p>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; border-top:1px solid #f1f5f9; padding-top:16px;">
                                <div>
                                    <span style="display:block; font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Ventes</span>
                                    <span style="font-size:1rem; font-weight:800; color:#10b981;">${evTickets.length} / ${(ev.total_tickets || '∞')}</span>
                                </div>
                                <div>
                                    <span style="display:block; font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">CA Brut</span>
                                    <span style="font-size:1rem; font-weight:800; color:#0f172a;">${totalPaid.toFixed(2)}€</span>
                                </div>
                            </div>
                            <div style="margin-top: 16px; display: flex; gap: 8px;">
                                <button onclick="window.open('/marketplace/evenement-details?id=${ev.id}', '_blank')" class="cta-button secondary" style="flex:1; font-size:0.7rem; padding:8px;">Voir</button>
                                <button onclick="TicketingModule.renderEditForm('${ev.id}')" class="cta-button secondary" style="flex:1; font-size:0.7rem; padding:8px;">Modifier</button>
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

                
                <!-- Main Form Column -->
                <div class="dash-card" style="padding: 40px; background: white; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03);">
                    <form id="event-creation-form" onsubmit="TicketingModule.handleCreateSubmit(event)">
                        
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            
                            <!-- SECTION 1: IDENTITÉ -->
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

                            <!-- SECTION 2: LOGISTIQUE -->
                            <div>
                                <h3 style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:24px; display:flex; align-items:center; gap:8px;">
                                    <span style="width:20px; height:20px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:#0f172a;">2</span>
                                    Logistique & Accès
                                </h3>
                                <div class="role-upgrade-grid">
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Date & Heure *</label>
                                        <input type="date" id="ev-date" required style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                    </div>
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Capacité d'accueil</label>
                                        <input type="number" id="ev-capacity" placeholder="Illimité" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                    </div>
                                    <div class="form-group" style="grid-column: 1/-1;">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Lieu / Plateforme *</label>
                                        <input type="text" id="ev-location" required placeholder="Ex: Paris 8e ou Lien de visioconférence" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                    </div>
                                </div>
                            </div>

                            <!-- SECTION 3: VISIBILITÉ -->
                            <div>
                                <h3 style="font-size:0.85rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:24px; display:flex; align-items:center; gap:8px;">
                                    <span style="width:20px; height:20px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:#0f172a;">3</span>
                                    Visibilité & Visuel
                                </h3>
                                <div class="form-group">
                                    <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Image de l'affiche (URL)</label>
                                    <input type="url" id="ev-image" placeholder="https://votre-image.jpg" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                </div>
                            </div>

                        </div>

                        <div style="margin-top: 48px; display: flex; justify-content: flex-end; gap: 16px;">
                            <button type="button" onclick="window.Router.navigate('#billetterie')" class="cta-button secondary" style="border-radius:14px; padding:16px 32px; font-weight:800;">Annuler</button>
                            <button type="submit" class="cta-button primary" id="ev-submit-btn" style="background:#0f172a; color:white; border:none; padding:16px 40px; border-radius:14px; font-weight:950; cursor:pointer; box-shadow: 0 10px 25px rgba(15,23,42,0.2);">PUBLIER L'ÉVÈNEMENT</button>
                        </div>
                    </form>
                </div>

                <!-- Guidance Sidebar -->
                <div style="display:flex; flex-direction:column; gap:24px;">
                    <div style="background:#0f172a; padding:40px; border-radius:28px; color:white; position:relative; overflow:hidden;">
                         <h4 style="font-size:1.4rem; font-weight:950; margin-bottom:16px; letter-spacing:-0.03em;">Conseils Experts</h4>
                         <p style="font-size:0.95rem; line-height:1.6; color:rgba(255,255,255,0.7); margin-bottom:32px;">Maximisez le taux de participation en suivant ces règles d'or :</p>
                         <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:20px;">
                             <li style="display:flex; align-items:flex-start; gap:12px;">
                                 <span style="color:#10b981; font-weight:900;">✓</span>
                                 <span style="font-size:0.85rem; font-weight:600;">Utilisez un titre accrocheur de moins de 60 caractères.</span>
                             </li>
                             <li style="display:flex; align-items:flex-start; gap:12px;">
                                 <span style="color:#10b981; font-weight:900;">✓</span>
                                 <span style="font-size:0.85rem; font-weight:600;">Précisez si l'évènement est en physique ou en distanciel.</span>
                             </li>
                             <li style="display:flex; align-items:flex-start; gap:12px;">
                                 <span style="color:#10b981; font-weight:900;">✓</span>
                                 <span style="font-size:0.85rem; font-weight:600;">Ajoutez une image HD pour booster les clics de 3x.</span>
                             </li>
                         </ul>
                         <div style="position:absolute; top:-40px; right:-40px; width:120px; height:120px; background:rgba(16, 185, 129, 0.1); border-radius:50%; filter:blur(40px);"></div>
                    </div>

                    <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:32px; border-radius:28px;">
                         <h4 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin-bottom:16px;">Assistance Billetterie</h4>
                         <p style="font-size:0.85rem; color:#64748b; line-height:1.6; margin-bottom:24px;">Besoin d'aide pour configurer votre vente de billets ou vos tarifs ?</p>
                         <button style="width:100%; padding:14px; border-radius:12px; border:1px solid #e2e8f0; background:white; font-weight:800; color:#0f172a; cursor:pointer;">Contacter le Support</button>
                    </div>
                 </div>
            </div>
            </div>
        `;
    },

    /**
     * Handle Event Creation Submission
     */
    async handleCreateSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('ev-submit-btn');
        btn.textContent = 'Publication...';
        btn.disabled = true;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Session expirée");

            const eventData = {
                user_id: session.user.id,
                title: document.getElementById('ev-title').value,
                event_date: document.getElementById('ev-date').value,
                location: document.getElementById('ev-location').value,
                description: document.getElementById('ev-description').value,
                image_url: document.getElementById('ev-image').value || null,
                total_tickets: parseInt(document.getElementById('ev-capacity').value) || null,
                created_at: new Date()
            };

            const { error } = await window._supabase.from('events').insert(eventData);
            if (error) throw error;

            // Success
            if (window.Swal) {
                await Swal.fire({
                    title: 'Évènement publié !',
                    text: 'Votre évènement est maintenant visible dans l\'annuaire.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
            }

            window.Router.navigate('#billetterie');

        } catch (err) {
            console.error("Creation Error:", err);
            alert("Erreur lors de la création : " + err.message);
            btn.textContent = "Publier l'évènement";
            btn.disabled = false;
        }
    },

    /**
     * Load User Tickets (Tickets bought by user)
     */
    async loadMyTickets() {
        const view = document.getElementById('mes-billets-view');
        if (!view) return;

        view.innerHTML = `
            <div class="dash-section-header" style="margin-bottom: 32px;">
                <h1 style="color:#0f172a; margin:0;">Mes Billets</h1>
                <p style="margin:4px 0 0; color:#64748b;">Retrouvez vos accès aux évènements de la communauté.</p>
            </div>
            <div id="my-tickets-list" class="dashboard-grid">
                <div style="grid-column: 1/-1; text-align:center; padding:40px;">Chargement de vos billets...</div>
            </div>
        `;

        const container = document.getElementById('my-tickets-list');
        
        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) return;

            const { data: tickets, error: tkError } = await window._supabase
                .from('tickets')
                .select('*, events(*)')
                .eq('buyer_id', session.user.id)
                .order('created_at', { ascending: false });

            if (tkError) throw tkError;

            if (!tickets || tickets.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: 20px; border: 1px solid #e2e8f0;">
                        <p style="color: #64748b; margin-bottom: 24px;">Vous n'avez pas encore acheté de billets.</p>
                        <a href="/marketplace/evenements" class="cta-button primary">Parcourir les évènements</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = tickets.map(t => {
                const ev = t.events;
                if (!ev) return '';
                return `
                    <div class="dash-card" style="padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; background: white; display: flex; gap: 20px; align-items: center;">
                        <div style="width:60px; height:60px; border-radius:12px; overflow:hidden; flex-shrink:0;">
                            <img src="${ev.image_url || '/assets/images/default-event.jpg'}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                        <div style="flex-grow:1;">
                            <h4 style="margin:0; font-size:1rem; font-weight:800; color:#0f172a;">${ev.title}</h4>
                            <p style="margin:4px 0 0; font-size:0.75rem; color:#64748b;">${ev.event_date} • ${ev.location}</p>
                        </div>
                        <a href="/ticket-view?id=${t.id}" target="_blank" class="cta-button secondary" style="font-size:0.75rem; padding:8px 16px;">Voir Billet</a>
                    </div>
                `;
            }).join('');

        } catch (err) {
            console.error("Tickets Load Error:", err);
            container.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur: ${err.message}</div>`;
        }
    }
};

window.TicketingModule = TicketingModule;
