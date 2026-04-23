/**
 * Ticketing Module - Domtom Connect
 * Aligné sur le schéma réel:
 * events: id, user_id, title, event_date, location, price, total_tickets, image_url
 * tickets: id, event_id, buyer_id, buyer_email, amount_paid, qr_token, status ('valide'/'scanne')
 */
const TicketingModule = {
    commissionRate: 0.15, // 15%

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

    // =============================================
    // 1. LISTE DES ÉVÉNEMENTS
    // =============================================
    async renderEventsList(container) {
        container.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Non connecté");

            const { data: events, error } = await window._supabase
                .from('events')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            container.innerHTML = `
                <div style="padding:clamp(20px,4vw,40px);font-family:'Plus Jakarta Sans',sans-serif;background:#fafafa;min-height:100vh;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
                        <h1 style="font-size:2.2rem;font-weight:950;color:#0f172a;letter-spacing:-0.05em;margin:0;">Mes Événements</h1>
                        <button onclick="window.Router.navigate('#billetterie?action=create')" style="background:#0f172a;color:white;border:none;padding:14px 28px;border-radius:12px;font-weight:950;cursor:pointer;font-family:inherit;">+ Créer un Événement</button>
                    </div>
                    ${events && events.length ? `
                        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;">
                            ${events.map(ev => `
                                <div style="background:white;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
                                    ${ev.image_url ? `<img src="${ev.image_url}" style="width:100%;height:160px;object-fit:cover;">` : `<div style="width:100%;height:160px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:2rem;">🎟️</div>`}
                                    <div style="padding:20px;">
                                        <div style="font-size:0.7rem;font-weight:900;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">${ev.event_date}</div>
                                        <h3 style="margin:0 0 6px;font-weight:950;font-size:1.1rem;color:#0f172a;">${ev.title}</h3>
                                        <p style="font-size:0.85rem;color:#64748b;margin:0 0 20px;">${ev.location}</p>
                                        <div style="display:flex;gap:10px;">
                                            <button onclick="window.Router.navigate('#billetterie?action=manage&id=${ev.id}')" style="flex:2;background:#0f172a;color:white;border:none;padding:12px;border-radius:10px;font-weight:950;cursor:pointer;font-family:inherit;font-size:0.85rem;">PILOTER</button>
                                            <button onclick="TicketingModule.deleteEvent('${ev.id}')" style="flex:1;background:#fee2e2;color:#dc2626;border:none;padding:12px;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit;font-size:0.85rem;">Suppr.</button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div style="text-align:center;padding:80px;border:2px dashed #e2e8f0;border-radius:24px;">
                            <div style="font-size:3rem;margin-bottom:16px;">🎟️</div>
                            <p style="font-weight:800;color:#64748b;">Aucun événement. Créez le vôtre !</p>
                        </div>
                    `}
                </div>`;
        } catch (err) {
            container.innerHTML = `<div style="padding:40px;color:#dc2626;font-weight:800;">Erreur: ${err.message}</div>`;
        }
    },

    // =============================================
    // 2. HUB ORGANISATEUR (Tour de contrôle)
    // =============================================
    async renderOrganizerHub(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: ev, error: evErr } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            if (evErr) throw evErr;

            const { data: tickets } = await window._supabase.from('tickets').select('*').eq('event_id', eventId).order('created_at', { ascending: false });
            const allTickets = tickets || [];

            const sold = allTickets.length;
            const capacity = ev.total_tickets || 0;
            const fillPct = capacity > 0 ? Math.min(100, (sold / capacity) * 100) : 0;
            const grossCA = allTickets.reduce((sum, t) => sum + (parseFloat(t.amount_paid) || 0), 0);
            const netEarnings = grossCA * (1 - this.commissionRate);
            const scanned = allTickets.filter(t => t.status === 'scanne').length;

            view.innerHTML = `
                <div style="padding:clamp(20px,4vw,40px);font-family:'Plus Jakarta Sans',sans-serif;background:#fafafa;min-height:100vh;">
                    <!-- Breadcrumb -->
                    <button onclick="window.Router.navigate('#billetterie')" style="background:none;border:none;font-weight:800;color:#64748b;cursor:pointer;margin-bottom:24px;display:flex;align-items:center;gap:8px;font-family:inherit;">← Retour à la liste</button>

                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;flex-wrap:wrap;gap:20px;">
                        <div>
                            <h1 style="font-size:1.8rem;font-weight:950;color:#0f172a;margin:0;">${ev.title}</h1>
                            <p style="color:#64748b;font-weight:600;margin-top:6px;">📍 ${ev.location} · 📅 ${ev.event_date}</p>
                        </div>
                        <div style="display:flex;gap:12px;flex-wrap:wrap;">
                            <button onclick="TicketingModule.editEventModal('${ev.id}', ${ev.total_tickets || 0}, ${ev.price || 0})" style="border:1.5px solid #e2e8f0;background:white;padding:12px 20px;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit;">Modifier Prix/Quota</button>
                            <button onclick="TicketingModule.renderScanView('${ev.id}')" style="background:#10b981;color:white;border:none;padding:12px 24px;border-radius:10px;font-weight:950;cursor:pointer;font-family:inherit;">Scanner Live 📷</button>
                        </div>
                    </div>

                    <!-- KPIs -->
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-bottom:40px;">
                        <div style="background:white;padding:28px;border-radius:20px;border:1px solid #e2e8f0;">
                            <div style="font-size:0.7rem;font-weight:950;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">Remplissage</div>
                            <div style="font-size:2rem;font-weight:950;color:#0f172a;">${sold}${capacity > 0 ? ' / ' + capacity : ''}</div>
                            ${capacity > 0 ? `
                            <div style="margin-top:14px;height:8px;background:#f1f5f9;border-radius:8px;overflow:hidden;">
                                <div style="height:100%;width:${fillPct}%;background:#10b981;border-radius:8px;transition:width 1s;"></div>
                            </div>
                            <div style="font-size:0.75rem;font-weight:800;color:#10b981;margin-top:8px;">${fillPct.toFixed(0)}% vendu</div>` : ''}
                        </div>
                        <div style="background:#0f172a;padding:28px;border-radius:20px;color:white;">
                            <div style="font-size:0.7rem;font-weight:950;color:rgba(255,255,255,0.5);text-transform:uppercase;margin-bottom:12px;">Reversement Net</div>
                            <div style="font-size:2rem;font-weight:950;color:#10b981;">${netEarnings.toFixed(2)} €</div>
                            <div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:8px;">CA Brut: ${grossCA.toFixed(2)} € · Com. DTC 15%: ${(grossCA - netEarnings).toFixed(2)} €</div>
                        </div>
                        <div style="background:white;padding:28px;border-radius:20px;border:1px solid #e2e8f0;">
                            <div style="font-size:0.7rem;font-weight:950;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">Check-in Terrain</div>
                            <div style="font-size:2rem;font-weight:950;color:#0f172a;">${scanned} <span style="font-size:1rem;color:#94a3b8;">scannés</span></div>
                            <div style="font-size:0.75rem;color:#64748b;margin-top:8px;">${sold - scanned} en attente de scan</div>
                        </div>
                    </div>

                    <!-- Liste participants -->
                    <div style="background:white;border-radius:20px;border:1px solid #e2e8f0;padding:32px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
                            <h3 style="margin:0;font-weight:950;">Participants (${sold})</h3>
                            <input type="text" id="search-att" placeholder="Rechercher par email..." oninput="TicketingModule.filterSearch()" style="padding:10px 16px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:600;width:240px;">
                        </div>
                        ${allTickets.length === 0 ? `<p style="text-align:center;color:#94a3b8;padding:40px;">Aucun billet vendu pour cet événement.</p>` : `
                        <div style="overflow-x:auto;">
                            <table style="width:100%;border-collapse:collapse;" id="att-table">
                                <thead>
                                    <tr style="border-bottom:1px solid #f1f5f9;">
                                        <th style="padding:12px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:left;">Email Acheteur</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:left;">Montant Payé</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:left;">Statut</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:900;text-align:right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${allTickets.map(t => `
                                    <tr class="att-row" data-email="${(t.buyer_email||'').toLowerCase()}" style="border-bottom:1px solid #f8fafc;">
                                        <td style="padding:14px 12px;font-weight:700;color:#0f172a;">${t.buyer_email || '—'}</td>
                                        <td style="padding:14px 12px;font-weight:800;color:#059669;">${(t.amount_paid||0).toFixed(2)} €</td>
                                        <td style="padding:14px 12px;">
                                            ${t.status === 'scanne' 
                                                ? '<span style="background:#dcfce7;color:#059669;font-size:0.65rem;font-weight:950;text-transform:uppercase;padding:4px 10px;border-radius:100px;">Scanné ✓</span>'
                                                : '<span style="background:#f1f5f9;color:#64748b;font-size:0.65rem;font-weight:950;text-transform:uppercase;padding:4px 10px;border-radius:100px;">Valide</span>'}
                                        </td>
                                        <td style="padding:14px 12px;text-align:right;">
                                            ${t.status !== 'scanne' ? `<button onclick="TicketingModule.checkIn('${t.id}', '${eventId}')" style="background:#0f172a;color:white;border:none;padding:6px 14px;border-radius:8px;font-weight:900;cursor:pointer;font-size:0.75rem;font-family:inherit;">Valider</button>` : ''}
                                        </td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>`}
                    </div>
                </div>`;
        } catch (err) {
            view.innerHTML = `<div style="padding:40px;color:#dc2626;font-weight:800;">Erreur: ${err.message}</div>`;
        }
    },

    filterSearch() {
        const q = document.getElementById('search-att')?.value.toLowerCase() || '';
        document.querySelectorAll('.att-row').forEach(row => {
            row.style.display = row.dataset.email.includes(q) ? '' : 'none';
        });
    },

    // =============================================
    // 3. CHECK-IN MANUEL
    // =============================================
    async checkIn(ticketId, eventId) {
        try {
            const { error } = await window._supabase.from('tickets').update({ status: 'scanne' }).eq('id', ticketId);
            if (error) throw error;
            await this.renderOrganizerHub(eventId);
        } catch (err) { alert('Erreur: ' + err.message); }
    },

    // =============================================
    // 4. SCANNER LIVE
    // =============================================
    renderScanView(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `
            <div style="position:fixed;inset:0;background:#020617;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;font-family:'Plus Jakarta Sans',sans-serif;">
                <button onclick="TicketingModule.renderOrganizerHub('${eventId}')" style="position:absolute;top:24px;left:24px;background:rgba(255,255,255,0.1);border:none;color:white;padding:10px 20px;border-radius:10px;font-weight:800;cursor:pointer;">← Quitter</button>

                <h2 style="color:white;font-weight:950;margin-bottom:8px;">Scanner Billets</h2>
                <p style="color:rgba(255,255,255,0.4);margin-bottom:48px;">Entrez le code QR manuellement ou scannez.</p>

                <div style="width:260px;height:260px;border:3px solid #10b981;border-radius:28px;position:relative;margin-bottom:48px;box-shadow:0 0 60px rgba(16,185,129,0.3);">
                    <div style="position:absolute;top:0;left:0;right:0;height:3px;background:#10b981;border-radius:10px;animation:scan 2s ease-in-out infinite;box-shadow:0 0 12px #10b981;"></div>
                    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.1);font-size:3rem;">📷</div>
                </div>

                <div style="width:100%;max-width:380px;padding:0 20px;">
                    <input id="scan-input" type="text" placeholder="Code billet (qr_token)..." style="width:100%;padding:18px;border-radius:14px;border:2px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);color:white;font-weight:800;font-size:1rem;text-align:center;margin-bottom:16px;font-family:inherit;box-sizing:border-box;" onkeydown="if(event.key==='Enter') TicketingModule.scanTicket('${eventId}')">
                    <button onclick="TicketingModule.scanTicket('${eventId}')" style="width:100%;background:#10b981;color:white;border:none;padding:18px;border-radius:14px;font-weight:950;font-size:1.1rem;cursor:pointer;font-family:inherit;">VALIDER L'ENTRÉE</button>
                </div>

                <style>@keyframes scan{0%{top:0}50%{top:calc(100% - 3px)}100%{top:0}}</style>
            </div>`;

        setTimeout(() => document.getElementById('scan-input')?.focus(), 100);
    },

    async scanTicket(eventId) {
        const input = document.getElementById('scan-input');
        const code = input?.value?.trim();
        if (!code) return;

        try {
            const { data: ticket, error } = await window._supabase
                .from('tickets')
                .select('*')
                .eq('qr_token', code)
                .eq('event_id', eventId)
                .single();

            if (error || !ticket) {
                input.style.borderColor = '#ef4444';
                input.style.background = 'rgba(239,68,68,0.1)';
                alert('❌ Billet INVALIDE ou introuvable.');
                setTimeout(() => { input.style.borderColor = ''; input.style.background = ''; }, 1500);
                return;
            }

            if (ticket.status === 'scanne') {
                input.style.borderColor = '#f59e0b';
                alert('⚠️ Billet déjà scanné !');
                setTimeout(() => { input.style.borderColor = ''; }, 1500);
                return;
            }

            await window._supabase.from('tickets').update({ status: 'scanne' }).eq('id', ticket.id);
            input.value = '';
            input.style.borderColor = '#10b981';
            input.style.background = 'rgba(16,185,129,0.1)';
            alert('✅ Accès AUTORISÉ — ' + (ticket.buyer_email || ''));
            setTimeout(() => { input.style.borderColor = ''; input.style.background = ''; input.focus(); }, 1500);
        } catch (err) {
            alert('Erreur: ' + err.message);
        }
    },

    // =============================================
    // 5. EDIT MODAL (Prix/Quota)
    // =============================================
    editEventModal(eventId, currentCapacity, currentPrice) {
        const cap = prompt(`Quota de billets (actuel: ${currentCapacity || 'illimité'}):`, currentCapacity || '');
        if (cap === null) return;
        const price = prompt(`Prix unitaire en € (actuel: ${currentPrice || 0} €):`, currentPrice || 0);
        if (price === null) return;

        window._supabase.from('events').update({
            total_tickets: cap ? parseInt(cap) : null,
            price: parseFloat(price) || 0
        }).eq('id', eventId).then(({ error }) => {
            if (error) alert('Erreur: ' + error.message);
            else this.renderOrganizerHub(eventId);
        });
    },

    // =============================================
    // 6. CRÉER UN ÉVÉNEMENT
    // =============================================
    async renderCreateForm(container) {
        container.innerHTML = `
            <div style="padding:clamp(20px,4vw,40px);font-family:'Plus Jakarta Sans',sans-serif;">
                <button onclick="window.Router.navigate('#billetterie')" style="background:none;border:none;font-weight:800;color:#64748b;cursor:pointer;margin-bottom:24px;font-family:inherit;">← Annuler</button>
                <div style="background:white;border-radius:20px;border:1px solid #e2e8f0;padding:40px;max-width:700px;margin:0 auto;">
                    <h2 style="font-weight:950;margin-bottom:32px;font-size:1.8rem;">Nouvel Événement</h2>
                    <div style="display:flex;flex-direction:column;gap:20px;">
                        <div>
                            <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Titre *</label>
                            <input id="ev-title" type="text" placeholder="Masterclass Marketing DOM-TOM" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;box-sizing:border-box;">
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Date *</label>
                                <input id="ev-date" type="date" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Lieu *</label>
                                <input id="ev-location" type="text" placeholder="Paris 8e / En ligne" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;box-sizing:border-box;">
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Prix Billet (€)</label>
                                <input id="ev-price" type="number" value="0" step="0.01" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Capacité Max</label>
                                <input id="ev-capacity" type="number" placeholder="Illimité" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;box-sizing:border-box;">
                            </div>
                        </div>
                        <div>
                            <label style="display:block;font-size:0.7rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">URL Image Affiche</label>
                            <input id="ev-image" type="url" placeholder="https://..." style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;box-sizing:border-box;">
                        </div>
                        <button id="ev-save-btn" onclick="TicketingModule.saveEvent()" style="background:#0f172a;color:white;border:none;padding:16px;border-radius:12px;font-weight:950;cursor:pointer;font-family:inherit;font-size:1rem;margin-top:8px;">CRÉER L'ÉVÉNEMENT</button>
                    </div>
                </div>
            </div>`;
    },

    async saveEvent() {
        const btn = document.getElementById('ev-save-btn');
        const title = document.getElementById('ev-title')?.value?.trim();
        const date = document.getElementById('ev-date')?.value;
        const location = document.getElementById('ev-location')?.value?.trim();
        const imageUrl = document.getElementById('ev-image')?.value?.trim();

        if (!title || !date || !location) { alert('Remplissez les champs obligatoires (titre, date, lieu).'); return; }

        btn.disabled = true;
        btn.textContent = 'Création...';

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Non connecté");

            const { error } = await window._supabase.from('events').insert({
                user_id: session.user.id,
                title,
                event_date: date,
                location,
                price: parseFloat(document.getElementById('ev-price')?.value) || 0,
                total_tickets: parseInt(document.getElementById('ev-capacity')?.value) || null,
                image_url: imageUrl || 'https://via.placeholder.com/800x400?text=Événement'
            });

            if (error) throw error;
            window.Router.navigate('#billetterie');
        } catch (err) {
            alert('Erreur: ' + err.message);
            btn.disabled = false;
            btn.textContent = 'CRÉER L\'ÉVÉNEMENT';
        }
    },

    // =============================================
    // 7. SUPPRIMER UN ÉVÉNEMENT
    // =============================================
    async deleteEvent(eventId) {
        if (!confirm('Supprimer cet événement et tous ses billets ?')) return;
        const { error } = await window._supabase.from('events').delete().eq('id', eventId);
        if (error) alert('Erreur: ' + error.message);
        else await this.renderEventsList(document.getElementById('billetterie-view'));
    }
};

window.TicketingModule = TicketingModule;
