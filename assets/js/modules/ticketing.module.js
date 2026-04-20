/**
 * Ticketing Module - Domtom Connect
 * Handles event ticketing and attendee management
 */
const TicketingModule = {
    /**
     * Load organization ticketing (My Events)
     */
    async loadMyTicketing() {
        const container = document.getElementById('billetterie-list');
        if (!container) return;
        
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px;">Chargement de votre billetterie...</div>';
        
        try {
            const { data: { session } } = await _supabase.auth.getSession();
            if (!session) return;

            // Fetch events created by the user
            const { data: myEvents, error: evError } = await _supabase
                .from('events')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (evError) throw evError;

            if (!myEvents || myEvents.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: 20px; border: 1px solid var(--gray-200);">
                        <div style="font-size: 3rem; margin-bottom: 20px;">🎟️</div>
                        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">Aucune billetterie</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 24px;">Vous n'avez pas encore publié d'événement avec billetterie native.</p>
                        <button onclick="if(window.Router) window.Router.navigate('/dashboard/billetterie?action=create');" class="cta-button primary" style="background:#10b981;">Créer un évènement</button>
                    </div>
                `;
                return;
            }

            // Fetch ticket counts for these events
            const eventIds = myEvents.map(ev => ev.id);
            const { data: tickets, error: tkError } = await _supabase
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

            container.innerHTML = myEvents.map(ev => {
                const evTickets = ticketsMap[ev.id] || [];
                const totalPaid = evTickets.reduce((acc, t) => acc + (parseFloat(t.amount_paid) || 0), 0);
                
                return `
                    <div class="dash-card" style="padding: 0; overflow: hidden; border-radius: 16px; border: 1px solid #e2e8f0; background: white;">
                        <div style="height: 120px; position:relative;">
                            <img src="${ev.image_url || '/assets/images/default-event.jpg'}" style="width:100%; height:100%; object-fit:cover;">
                            <div style="position:absolute; top:12px; right:12px; background:white; padding:4px 12px; border-radius:100px; font-size:0.7rem; font-weight:800; color:#0f172a;">
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
                        </div>
                    </div>
                `;
            }).join('');

        } catch (err) {
            console.error("Ticketing Load Error:", err);
            container.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur de chargement: ${err.message}</div>`;
        }
    },

    /**
     * Load User Tickets (Tickets bought by user)
     */
    async loadMyTickets() {
        const container = document.getElementById('my-tickets-list');
        if (!container) return;
        
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px;">Chargement de vos billets...</div>';
        
        try {
            const { data: { session } } = await _supabase.auth.getSession();
            if (!session) return;

            const { data: tickets, error: tkError } = await _supabase
                .from('tickets')
                .select('*, events(*)')
                .eq('buyer_id', session.user.id)
                .order('created_at', { ascending: false });

            if (tkError) throw tkError;

            if (!tickets || tickets.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: 20px; border: 1px solid var(--gray-200);">
                        <p style="color: var(--text-secondary); margin-bottom: 24px;">Vous n'avez pas encore acheté de billets.</p>
                        <a href="/marketplace/evenements" class="cta-button primary">Parcourir les évènements</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = tickets.map(t => {
                const ev = t.events;
                return `
                    <div class="dash-card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: white; display: flex; gap: 20px; align-items: center;">
                        <div style="width:60px; height:60px; border-radius:12px; overflow:hidden; flex-shrink:0;">
                            <img src="${ev.image_url || '/assets/images/default-event.jpg'}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                        <div style="flex-grow:1;">
                            <h4 style="margin:0; font-size:1rem; font-weight:800;">${ev.title}</h4>
                            <p style="margin:4px 0 0; font-size:0.75rem; color:#64748b;">${ev.event_date} • ${ev.location}</p>
                        </div>
                        <a href="/ticket-view?id=${t.id}" target="_blank" class="cta-button secondary" style="font-size:0.75rem; padding:8px 16px;">Voir Billet</a>
                    </div>
                `;
            }).join('');

        } catch (err) {
            container.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur: ${err.message}</div>`;
        }
    }
};

window.TicketingModule = TicketingModule;
window.loadMyTicketing = TicketingModule.loadMyTicketing;
window.loadMyTickets = TicketingModule.loadMyTickets;
