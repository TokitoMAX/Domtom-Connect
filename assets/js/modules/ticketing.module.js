/**
 * Ticketing Module - Domtom Connect
 * Aligné sur le schéma réel:
 * events: id, user_id, title, event_date, location, price, total_tickets, image_url
 * tickets: id, event_id, buyer_id, buyer_email, amount_paid, qr_token, status ('valide'/'scanne')
 */
const TicketingModule = {
    commissionRate: 0.10, // 10%

    async route(viewId, container, profile, session, params) {
        await this.loadMyTicketing(params);
    },

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
                        <h1 style="font-size:2.2rem;font-weight:950;color:#0c100e;letter-spacing:-0.05em;margin:0;">Mes Événements</h1>
                        <button onclick="window.Router.navigate('#billetterie?action=create')" style="background:#0c100e;color:white;border:none;padding:14px 28px;border-radius:12px;font-weight:950;cursor:pointer;font-family:inherit;">+ Créer un Événement</button>
                    </div>
                    ${events && events.length ? `
                        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;">
                            ${events.map(ev => `
                                <div style="background:white;border-radius:20px;border:1px solid #e6eae8;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
                                    ${ev.image_url ? `<img src="${ev.image_url}" style="width:100%;height:160px;object-fit:cover;">` : `<div style="width:100%;height:160px;background:#f1f4f2;display:flex;align-items:center;justify-content:center;font-size:2rem;">🎟️</div>`}
                                    <div style="padding:20px;">
                                        <div style="font-size:0.7rem;font-weight:900;color:#a7b0ac;text-transform:uppercase;margin-bottom:6px;">${ev.event_date}</div>
                                        <h3 style="margin:0 0 6px;font-weight:950;font-size:1.1rem;color:#0c100e;">${ev.title}</h3>
                                        <p style="font-size:0.85rem;color:#717c77;margin:0 0 20px;">${ev.location}</p>
                                        <div style="display:flex;gap:10px;">
                                            <button onclick="window.Router.navigate('#billetterie?action=manage&id=${ev.id}')" style="flex:2;background:#0c100e;color:white;border:none;padding:12px;border-radius:10px;font-weight:950;cursor:pointer;font-family:inherit;font-size:0.85rem;">PILOTER</button>
                                            <button onclick="const btn=this; navigator.clipboard.writeText(window.location.origin + '/api/share?type=event&id=${ev.id}').then(() => { const old = btn.innerText; btn.innerText='✅'; setTimeout(()=>btn.innerText=old, 2000); })" style="flex:1;background:#f6f8f7;color:#0c100e;border:1px solid #d4dad7;padding:12px;border-radius:10px;font-weight:950;cursor:pointer;font-family:inherit;font-size:1.1rem;display:flex;align-items:center;justify-content:center;" title="Copier le lien pour WhatsApp/LinkedIn">🔗</button>
                                            <button onclick="TicketingModule.deleteEvent('${ev.id}')" style="flex:1;background:#fee2e2;color:#dc2626;border:none;padding:12px;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit;font-size:0.85rem;">Suppr.</button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div style="text-align:center;padding:80px;border:2px dashed #e6eae8;border-radius:24px;">
                            <div style="font-size:3rem;margin-bottom:16px;">🎟️</div>
                            <p style="font-weight:800;color:#717c77;">Aucun événement. Créez le vôtre !</p>
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
                    <button onclick="window.Router.navigate('#billetterie')" style="background:none;border:none;font-weight:800;color:#717c77;cursor:pointer;margin-bottom:24px;display:flex;align-items:center;gap:8px;font-family:inherit;">← Retour à la liste</button>

                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;flex-wrap:wrap;gap:20px;">
                        <div>
                            <h1 style="font-size:1.8rem;font-weight:950;color:#0c100e;margin:0;">${ev.title}</h1>
                            <p style="color:#717c77;font-weight:600;margin-top:6px;">📍 ${ev.location} · 📅 ${ev.event_date}</p>
                        </div>
                        <div style="display:flex;gap:12px;flex-wrap:wrap;">
                            <button onclick="const btn=this; navigator.clipboard.writeText(window.location.origin + '/api/share?type=event&id=${ev.id}').then(() => { const old = btn.innerText; btn.innerText='Lien Copié ✅'; setTimeout(()=>btn.innerText=old, 2000); })" style="background:#f6f8f7;color:#0c100e;border:1.5px dashed #d4dad7;padding:12px 20px;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit;" title="Partager sur LinkedIn/WhatsApp">Partager 📤</button>
                            <button onclick="TicketingModule.renderPromoCodesHub('${ev.id}')" style="border:1.5px solid #0c100e;background:white;padding:12px 20px;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit;">Codes Promos 🏷️</button>
                            <button onclick="TicketingModule.editEventModal('${ev.id}', ${ev.total_tickets || 0}, ${ev.price || 0})" style="border:1.5px solid #e6eae8;background:white;padding:12px 20px;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit;">Modifier Prix/Quota</button>
                            <button onclick="TicketingModule.renderScanView('${ev.id}')" style="background:#10b981;color:white;border:none;padding:12px 24px;border-radius:10px;font-weight:950;cursor:pointer;font-family:inherit;">Scanner Live 📷</button>
                        </div>
                    </div>

                    <!-- KPIs -->
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-bottom:40px;">
                        <div style="background:white;padding:clamp(16px, 4vw, 28px);border-radius:20px;border:1px solid #e6eae8;">
                            <div style="font-size:0.7rem;font-weight:950;color:#a7b0ac;text-transform:uppercase;margin-bottom:12px;">Remplissage</div>
                            <div style="font-size:2rem;font-weight:950;color:#0c100e;">${sold}${capacity > 0 ? ' / ' + capacity : ''}</div>
                            ${capacity > 0 ? `
                            <div style="margin-top:14px;height:8px;background:#f1f4f2;border-radius:8px;overflow:hidden;">
                                <div style="height:100%;width:${fillPct}%;background:#10b981;border-radius:8px;transition:width 1s;"></div>
                            </div>
                            <div style="font-size:0.75rem;font-weight:800;color:#10b981;margin-top:8px;">${fillPct.toFixed(0)}% vendu</div>` : ''}
                        </div>
                        <div style="background:#0c100e;padding:clamp(16px, 4vw, 28px);border-radius:20px;color:white;">
                            <div style="font-size:0.7rem;font-weight:950;color:rgba(255,255,255,0.5);text-transform:uppercase;margin-bottom:12px;">Reversement Net</div>
                            <div style="font-size:2rem;font-weight:950;color:#10b981;">${netEarnings.toFixed(2)} €</div>
                            <div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:8px;">CA Brut: ${grossCA.toFixed(2)} € · Com. DTC 10%: ${(grossCA - netEarnings).toFixed(2)} €</div>
                        </div>
                        <div style="background:white;padding:clamp(16px, 4vw, 28px);border-radius:20px;border:1px solid #e6eae8;">
                            <div style="font-size:0.7rem;font-weight:950;color:#a7b0ac;text-transform:uppercase;margin-bottom:12px;">Check-in Terrain</div>
                            <div style="font-size:2rem;font-weight:950;color:#0c100e;">${scanned} <span style="font-size:1rem;color:#a7b0ac;">scannés</span></div>
                            <div style="font-size:0.75rem;color:#717c77;margin-top:8px;">${sold - scanned} en attente de scan</div>
                        </div>
                    </div>

                    <!-- Liste participants -->
                    <div style="background:white;border-radius:20px;border:1px solid #e6eae8;padding:clamp(16px, 4vw, 32px);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
                            <h3 style="margin:0;font-weight:950;">Participants (${sold})</h3>
                            <input type="text" id="search-att" placeholder="Rechercher par email..." oninput="TicketingModule.filterSearch()" style="padding:10px 16px;border-radius:10px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:600;width:240px;">
                        </div>
                        ${allTickets.length === 0 ? `<p style="text-align:center;color:#a7b0ac;padding:40px;">Aucun billet vendu pour cet événement.</p>` : `
                        <div style="overflow-x:auto;">
                            <table style="width:100%;border-collapse:collapse;" id="att-table">
                                <thead>
                                    <tr style="border-bottom:1px solid #f1f4f2;">
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;text-align:left;">Email Acheteur</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;text-align:left;">Montant Payé</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;text-align:left;">Statut</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;text-align:right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${allTickets.map(t => `
                                    <tr class="att-row" data-email="${(t.buyer_email || '').toLowerCase()}" style="border-bottom:1px solid #f6f8f7;">
                                        <td style="padding:14px 12px;font-weight:700;color:#0c100e;">${t.buyer_email || '—'}<br><span style="font-size:0.75rem;color:#717c77;font-weight:600;">${t.tier_name || 'Standard'}</span></td>
                                        <td style="padding:14px 12px;font-weight:800;color:#059669;">${(t.amount_paid || 0).toFixed(2)} €</td>
                                        <td style="padding:14px 12px;">
                                            ${t.status === 'scanne'
                    ? '<span style="background:#dcfce7;color:#059669;font-size:0.65rem;font-weight:950;text-transform:uppercase;padding:4px 10px;border-radius:100px;">Scanné ✓</span>'
                    : '<span style="background:#f1f4f2;color:#717c77;font-size:0.65rem;font-weight:950;text-transform:uppercase;padding:4px 10px;border-radius:100px;">Valide</span>'}
                                        </td>
                                        <td style="padding:14px 12px;text-align:right;">
                                            ${t.status !== 'scanne' ? `<button onclick="TicketingModule.checkIn('${t.id}', '${eventId}')" style="background:#0c100e;color:white;border:none;padding:6px 14px;border-radius:8px;font-weight:900;cursor:pointer;font-size:0.75rem;font-family:inherit;">Valider</button>` : ''}
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

    // =============================================
    // 3. GESTION DES CODES PROMOS
    // =============================================
    async renderPromoCodesHub(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: codes, error } = await window._supabase.from('event_promo_codes').select('*').eq('event_id', eventId);
            if (error) throw error;

            view.innerHTML = `
                <div style="padding:clamp(20px,4vw,40px);font-family:'Plus Jakarta Sans',sans-serif;">
                    <button onclick="TicketingModule.renderOrganizerHub('${eventId}')" style="background:none;border:none;font-weight:800;color:#717c77;cursor:pointer;margin-bottom:24px;display:flex;align-items:center;gap:8px;font-family:inherit;">← Retour au pilotage</button>
                    
                    <div style="display:grid;grid-template-columns: 1fr 1.5fr; gap:40px; align-items:start;">
                        <!-- Formulaire -->
                        <div style="background:white; padding:clamp(16px, 4vw, 32px); border-radius:24px; border:1px solid #e6eae8;">
                            <h3 style="margin:0 0 24px; font-weight:950;">Nouveau Code Promo</h3>
                            <div style="display:flex; flex-direction:column; gap:16px;">
                                <div>
                                    <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Code (ex: DTC20)</label>
                                    <input id="promo-code" type="text" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                                </div>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                    <div>
                                        <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Type</label>
                                        <select id="promo-type" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;">
                                            <option value="percent">Pourcentage (%)</option>
                                            <option value="amount">Montant fixe (€)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Valeur</label>
                                        <input id="promo-value" type="number" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                                    </div>
                                </div>
                                <div>
                                    <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Utilisations max (0 = illimité)</label>
                                    <input id="promo-max" type="number" value="0" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                                </div>
                                <button onclick="TicketingModule.addPromoCode('${eventId}')" style="background:#0c100e;color:white;border:none;padding:14px;border-radius:12px;font-weight:950;cursor:pointer;font-family:inherit;margin-top:8px;">CRÉER LE CODE</button>
                            </div>
                        </div>

                        <!-- Liste -->
                        <div style="background:white; padding:clamp(16px, 4vw, 32px); border-radius:24px; border:1px solid #e6eae8;">
                            <h3 style="margin:0 0 24px; font-weight:950;">Codes Actifs (${codes.length})</h3>
                            ${codes.length === 0 ? '<p style="color:#a7b0ac;font-weight:600;">Aucun code promo créé.</p>' : `
                            <table style="width:100%; border-collapse:collapse;">
                                <thead>
                                    <tr style="border-bottom:1px solid #f1f4f2; text-align:left;">
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;">Code</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;">Réduction</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;">Usages</th>
                                        <th style="padding:12px;font-size:0.7rem;color:#a7b0ac;text-transform:uppercase;font-weight:900;text-align:right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${codes.map(c => `
                                    <tr style="border-bottom:1px solid #f6f8f7;">
                                        <td style="padding:14px 12px;font-weight:900;color:#0c100e;">${c.code}</td>
                                        <td style="padding:14px 12px;font-weight:800;color:#10b981;">${c.discount_value}${c.discount_type === 'percent' ? '%' : '€'}</td>
                                        <td style="padding:14px 12px;font-weight:700;color:#717c77;">${c.used_count}${c.max_uses > 0 ? ' / ' + c.max_uses : ''}</td>
                                        <td style="padding:14px 12px;text-align:right;">
                                            <button onclick="TicketingModule.deletePromoCode('${c.id}', '${eventId}')" style="background:none;border:none;color:#ef4444;font-weight:900;cursor:pointer;">×</button>
                                        </td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>`}
                        </div>
                    </div>
                </div>`;
        } catch (err) { alert('Erreur: ' + err.message); }
    },

    async addPromoCode(eventId) {
        const code = document.getElementById('promo-code').value.trim().toUpperCase();
        const type = document.getElementById('promo-type').value;
        const value = parseFloat(document.getElementById('promo-value').value);
        const max = parseInt(document.getElementById('promo-max').value);

        if (!code || isNaN(value)) { alert('Code et valeur obligatoires.'); return; }

        try {
            const { error } = await window._supabase.from('event_promo_codes').insert({
                event_id: eventId,
                code,
                discount_type: type,
                discount_value: value,
                max_uses: max
            });
            if (error) throw error;
            this.renderPromoCodesHub(eventId);
        } catch (err) { alert('Erreur: ' + err.message); }
    },

    async deletePromoCode(codeId, eventId) {
        if (!confirm('Supprimer ce code promo ?')) return;
        try {
            const { error } = await window._supabase.from('event_promo_codes').delete().eq('id', codeId);
            if (error) throw error;
            this.renderPromoCodesHub(eventId);
        } catch (err) { alert('Erreur: ' + err.message); }
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
            <div style="position:fixed;inset:0;background:#070908;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;font-family:'Plus Jakarta Sans',sans-serif;">
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
    // 5. MODIFIER UN ÉVÉNEMENT (Full Edit)
    // =============================================
    async renderEditForm(eventId) {
        const view = document.getElementById('billetterie-view');
        view.innerHTML = `<div style="text-align:center;padding:80px;"><span class="loader"></span></div>`;

        try {
            const { data: ev, error } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            if (error) throw error;

            view.innerHTML = `
                <div style="padding:clamp(16px,4vw,40px);font-family:'Plus Jakarta Sans',sans-serif;">
                    <button onclick="window.Router.navigate('#billetterie?action=manage&id=${eventId}')" style="background:none;border:none;font-weight:800;color:#717c77;cursor:pointer;margin-bottom:24px;font-family:inherit;">← Annuler</button>
                    <div style="background:white;border-radius:20px;border:1px solid #e6eae8;padding:clamp(16px, 5vw, 40px);max-width:700px;margin:0 auto;box-sizing:border-box;">
                        <h2 style="font-weight:950;margin-bottom:32px;font-size:1.8rem;">Modifier l'Événement</h2>
                        <div style="display:flex;flex-direction:column;gap:20px;">
                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Titre *</label>
                                <input id="ev-title" type="text" value="${ev.title || ''}" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                            </div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                                <div>
                                    <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Date *</label>
                                    <input id="ev-date" type="date" value="${ev.event_date || ''}" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                                </div>
                                <div>
                                    <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Lieu ou Lien Visio *</label>
                                    <input id="ev-location" type="text" value="${(ev.ticket_url && ev.ticket_url.startsWith('http') && ev.location === 'En ligne') ? ev.ticket_url : (ev.location || '')}" placeholder="Paris / https://meet.google.com/..." style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                                </div>
                            </div>
                            
                            <div id="agenda-builder" style="background:#f6f8f7; border:1.5px solid #e6eae8; border-radius:16px; padding:24px; margin-bottom:20px;">
                                <label style="display:block; font-size:0.75rem; font-weight:950; color:#0c100e; text-transform:uppercase; margin-bottom:16px;">Programme (Agenda)</label>
                                <div id="agenda-list" style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                                    <!-- Agenda dynamically injected -->
                                </div>
                                <button type="button" onclick="TicketingModule.addAgendaLine()" style="background:#fff; border:1px solid #e6eae8; padding:10px 16px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.85rem; color:#717c77;">+ Ajouter une étape</button>
                            </div>

                            <div id="tiers-builder" style="background:#f6f8f7; border:1.5px solid #e6eae8; border-radius:16px; padding:24px; margin-bottom:20px;">
                                <label style="display:block; font-size:0.75rem; font-weight:950; color:#0c100e; text-transform:uppercase; margin-bottom:16px;">Configurations des Billets</label>
                                <div id="tiers-list" style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                                    <!-- Tiers dynamically injected -->
                                </div>
                                <button type="button" onclick="TicketingModule.addTierLine()" style="background:#fff; border:1px solid #e6eae8; padding:10px 16px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.85rem; color:#717c77;">+ Ajouter un type de billet</button>
                            </div>

                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Image de l'affiche</label>
                                <div id="ev-upload-zone" style="border:2px dashed #e6eae8;border-radius:16px;padding:12px;text-align:center;cursor:pointer;background:#f6f8f7;transition:0.3s;" onclick="document.getElementById('ev-image-file').click()">
                                    <input id="ev-image-file" type="file" accept="image/*" style="display:none;" onchange="TicketingModule.handleUpload(this)">
                                    <div id="ev-preview-container">
                                        <div id="ev-preview-img" style="width:100%;height:200px;border-radius:12px;background-size:cover;background-position:center;margin-bottom:12px;background-image:url('${ev.image_url || ''}')"></div>
                                        <span style="font-size:0.75rem;font-weight:800;color:#0c100e;">Cliquer pour changer l'image</span>
                                    </div>
                                    <div id="ev-upload-prompt" style="display:none;">
                                        <div style="font-size:2.5rem;margin-bottom:12px;">🖼️</div>
                                        <p style="margin:0;font-weight:800;color:#0c100e;">Sélectionnez une affiche</p>
                                    </div>
                                    <input type="hidden" id="ev-image-url" value="${ev.image_url || ''}">
                                </div>
                            </div>
                            <button id="ev-save-btn" onclick="TicketingModule.saveEvent('${eventId}')" style="background:#10b981;color:white;border:none;padding:16px;border-radius:12px;font-weight:950;cursor:pointer;font-family:inherit;font-size:1rem;margin-top:8px;">ENREGISTRER LES MODIFICATIONS</button>
                        </div>
                    </div>
                </div>`;

            this._currentTiers = ev.ticket_tiers || [{ name: 'Billet Standard', price: ev.price || 0, capacity: ev.total_tickets || 100 }];

            // Format legacy times (e.g. "20" -> "20:00") for the <input type="time">
            const agenda = ev.agenda || [{ time: '18:00', label: 'Ouverture' }];
            this._currentAgenda = agenda.map(a => ({
                ...a,
                time: (a.time && !a.time.includes(':') && !isNaN(a.time)) ? a.time.padStart(2, '0') + ':00' : (a.time || '18:00')
            }));

            this.renderTierLines();
            this.renderAgendaLines();

            setTimeout(() => this.setupUploadListeners(), 100);
        } catch (err) {
            view.innerHTML = `<div style="padding:40px;color:#dc2626;font-weight:800;">Erreur: ${err.message}</div>`;
        }
    },

    editEventModal(eventId) {
        this.renderEditForm(eventId);
    },

    // =============================================
    // 6. CRÉER UN ÉVÉNEMENT
    // =============================================
    async renderCreateForm(container) {
        container.innerHTML = `
            <div style="padding:clamp(16px,4vw,40px);font-family:'Plus Jakarta Sans',sans-serif;">
                <button onclick="window.Router.navigate('#billetterie')" style="background:none;border:none;font-weight:800;color:#717c77;cursor:pointer;margin-bottom:24px;font-family:inherit;">← Annuler</button>
                <div style="background:white;border-radius:20px;border:1px solid #e6eae8;padding:clamp(16px, 5vw, 40px);max-width:700px;margin:0 auto;box-sizing:border-box;">
                    <h2 style="font-weight:950;margin-bottom:32px;font-size:1.8rem;">Nouvel Événement</h2>
                    <div style="display:flex;flex-direction:column;gap:20px;">
                        <div>
                            <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Titre *</label>
                            <input id="ev-title" type="text" placeholder="Ex: Pop-up Store Mode, Masterclass..." style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Date *</label>
                                <input id="ev-date" type="date" style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Lieu ou Lien Visio *</label>
                                <input id="ev-location" type="text" placeholder="Paris / https://meet.google.com/..." style="width:100%;padding:14px;border-radius:12px;border:1.5px solid #e6eae8;font-family:inherit;font-weight:700;box-sizing:border-box;">
                            </div>
                        </div>
                        <div id="agenda-builder" style="background:#f6f8f7; border:1.5px solid #e6eae8; border-radius:16px; padding:24px; margin-bottom:20px;">
                            <label style="display:block; font-size:0.75rem; font-weight:950; color:#0c100e; text-transform:uppercase; margin-bottom:16px;">Programme (Agenda)</label>
                            <div id="agenda-list" style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                                <!-- Agenda dynamically injected -->
                            </div>
                            <button type="button" onclick="TicketingModule.addAgendaLine()" style="background:#fff; border:1px solid #e6eae8; padding:10px 16px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.85rem; color:#717c77;">+ Ajouter une étape au programme</button>
                        </div>

                        <div id="tiers-builder" style="background:#f6f8f7; border:1.5px solid #e6eae8; border-radius:16px; padding:24px; margin-bottom:20px;">
                            <label style="display:block; font-size:0.75rem; font-weight:950; color:#0c100e; text-transform:uppercase; margin-bottom:16px;">Configurations des Billets</label>
                            <div id="tiers-list" style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                                <!-- Tiers dynamically injected -->
                            </div>
                            <button type="button" onclick="TicketingModule.addTierLine()" style="background:#fff; border:1px solid #e6eae8; padding:10px 16px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.85rem; color:#717c77;">+ Ajouter un type de billet (ex: VIP)</button>
                        </div>

                        <div>
                            <label style="display:block;font-size:0.7rem;font-weight:950;color:#717c77;text-transform:uppercase;margin-bottom:8px;">Image de l'affiche</label>
                            <div id="ev-upload-zone" style="border:2px dashed #e6eae8;border-radius:16px;padding:32px;text-align:center;cursor:pointer;background:#f6f8f7;transition:0.3s;" onmouseover="this.style.borderColor='#10b981';this.style.background='#fff';" onmouseout="this.style.borderColor='#e6eae8';this.style.background='#f6f8f7';" onclick="document.getElementById('ev-image-file').click()">
                                <input id="ev-image-file" type="file" accept="image/*" style="display:none;" onchange="TicketingModule.handleUpload(this)">
                                <div id="ev-preview-container" style="display:none;">
                                    <div id="ev-preview-img" style="width:100%;height:200px;border-radius:12px;background-size:cover;background-position:center;margin-bottom:12px;"></div>
                                    <span style="font-size:0.75rem;font-weight:800;color:#0c100e;">Cliquer pour changer l'image</span>
                                </div>
                                <div id="ev-upload-prompt">
                                    <div style="font-size:2.5rem;margin-bottom:12px;">🖼️</div>
                                    <p style="margin:0;font-weight:800;color:#0c100e;">Sélectionnez une affiche</p>
                                    <p style="margin:4px 0 0;font-size:0.8rem;color:#717c77;font-weight:600;">PNG, JPG jusqu'à 5Mo</p>
                                </div>
                                <input type="hidden" id="ev-image-url">
                            </div>
                        </div>
                        <button id="ev-save-btn" onclick="TicketingModule.saveEvent()" style="background:#10b981;color:white;border:none;padding:16px;border-radius:12px;font-weight:950;cursor:pointer;font-family:inherit;font-size:1rem;margin-top:8px;">CRÉER L'ÉVÉNEMENT</button>
                    </div>
                </div>
            </div>`;

        this._currentTiers = [{ name: 'Billet Standard', price: 0, capacity: 100 }];
        this._currentAgenda = [{ time: '18:00', label: 'Ouverture' }];
        this.renderTierLines();
        this.renderAgendaLines();
        setTimeout(() => this.setupUploadListeners(), 100);
    },

    _currentTiers: [],
    _currentAgenda: [],

    addTierLine() {
        this._currentTiers.push({ name: '', price: 0, capacity: 100 });
        this.renderTierLines();
    },
    removeTierLine(index) {
        if (this._currentTiers.length <= 1) return;
        this._currentTiers.splice(index, 1);
        this.renderTierLines();
    },
    renderTierLines() {
        const list = document.getElementById('tiers-list');
        if (!list) return;
        list.innerHTML = this._currentTiers.map((t, i) => `
            <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
                <input type="text" value="${t.name}" placeholder="Nom (ex: Place VIP)" onchange="TicketingModule._currentTiers[${i}].name=this.value" style="flex: 2 1 140px; padding:10px; border-radius:8px; border:1.5px solid #e6eae8; font-weight:700; box-sizing:border-box;">
                <input type="number" value="${t.price}" placeholder="Prix €" onchange="TicketingModule._currentTiers[${i}].price=parseFloat(this.value)" style="flex: 1 1 80px; padding:10px; border-radius:8px; border:1.5px solid #e6eae8; font-weight:700; box-sizing:border-box;">
                <input type="number" value="${t.capacity}" placeholder="Quota" onchange="TicketingModule._currentTiers[${i}].capacity=parseInt(this.value)" style="flex: 1 1 80px; padding:10px; border-radius:8px; border:1.5px solid #e6eae8; font-weight:700; box-sizing:border-box;">
                <button type="button" onclick="TicketingModule.removeTierLine(${i})" style="width:40px; border:none; background:none; color:#ef4444; font-weight:900; cursor:pointer;">×</button>
            </div>
        `).join('');
    },

    addAgendaLine() {
        const lastEntry = this._currentAgenda[this._currentAgenda.length - 1];
        let nextTime = '19:00';
        if (lastEntry && lastEntry.time) {
            const [h, m] = lastEntry.time.split(':');
            const date = new Date();
            date.setHours(parseInt(h), parseInt(m) + 30);
            nextTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        this._currentAgenda.push({ time: nextTime, label: '' });
        // No auto-sort here to avoid jumping if user is mid-edit
        this.renderAgendaLines();
    },
    removeAgendaLine(index) {
        if (this._currentAgenda.length <= 1) {
            this._currentAgenda = [{ time: '18:00', label: 'Ouverture' }];
        } else {
            this._currentAgenda.splice(index, 1);
        }
        this.renderAgendaLines();
    },
    sortAgenda() {
        this._currentAgenda.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
        this.renderAgendaLines();
    },
    renderAgendaLines() {
        const list = document.getElementById('agenda-list');
        if (!list) return;

        // Build the HTML without full re-render if possible or just make it cleaner
        list.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                ${this._currentAgenda.map((a, i) => `
                    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; background:white; padding:16px; border-radius:16px; border:1px solid #e6eae8; position:relative;">
                        <div style="width:2px; height:20px; background:#e6eae8; position:absolute; left:75px; top:-16px; display:${i === 0 ? 'none' : 'block'};"></div>
                        <div style="flex: 1 1 100px; max-width: 120px;">
                            <input type="time" value="${a.time || '18:00'}" 
                                onchange="TicketingModule._currentAgenda[${i}].time=this.value" 
                                style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #f1f4f2; font-weight:800; font-family:inherit; cursor:pointer; background:#f6f8f7; color:#0c100e; text-align:center; box-sizing:border-box;">
                        </div>
                        <div style="flex: 2 1 160px;">
                            <input type="text" value="${a.label}" placeholder="Titre de l'étape (ex: Accueil des invités)" 
                                oninput="TicketingModule._currentAgenda[${i}].label=this.value" 
                                style="width:100%; padding:12px; border:none; font-weight:700; font-family:inherit; outline:none; font-size:1rem; color:#1b2420; box-sizing:border-box;">
                        </div>
                        <button type="button" onclick="TicketingModule.removeAgendaLine(${i})" 
                            style="border:none; background:#fee2e2; color:#dc2626; width:36px; height:36px; border-radius:10px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s; flex-shrink: 0;"
                            onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                `).join('')}
                ${this._currentAgenda.length > 1 ? `
                    <div style="text-align:right;">
                        <button type="button" onclick="TicketingModule.sortAgenda()" style="background:none; border:none; color:#10b981; font-weight:800; cursor:pointer; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">⚡ Trier par heure</button>
                    </div>
                ` : ''}
            </div>
        `;
    },

    setupUploadListeners() {
        const zone = document.getElementById('ev-upload-zone');
        if (!zone) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => {
            zone.addEventListener(name, e => { e.preventDefault(); e.stopPropagation(); }, false);
        });

        zone.addEventListener('dragover', () => {
            zone.style.borderColor = '#0c100e';
            zone.style.background = '#fff';
        });

        zone.addEventListener('dragleave', () => {
            zone.style.borderColor = '#e6eae8';
            zone.style.background = '#f6f8f7';
        });

        zone.addEventListener('drop', e => {
            const files = e.dataTransfer.files;
            if (files.length) {
                const input = document.getElementById('ev-image-file');
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                input.files = dt.files;
                this.handleUpload(input);
            }
        });

        // Paste support
        const pasteHandler = e => {
            if (!document.getElementById('ev-upload-zone')) {
                window.removeEventListener('paste', pasteHandler);
                return;
            }
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (const item of items) {
                if (item.type.indexOf('image') === 0) {
                    const blob = item.getAsFile();
                    const file = new File([blob], `pasted_event_${Date.now()}.png`, { type: blob.type });
                    const input = document.getElementById('ev-image-file');
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    input.files = dt.files;
                    this.handleUpload(input);
                }
            }
        };
        window.addEventListener('paste', pasteHandler);
    },

    async handleUpload(input) {
        const file = input.files[0];
        if (!file) return;

        const zone = document.getElementById('ev-upload-zone');
        const prompt = document.getElementById('ev-upload-prompt');
        const previewCont = document.getElementById('ev-preview-container');
        const previewImg = document.getElementById('ev-preview-img');
        const urlInput = document.getElementById('ev-image-url');

        try {
            prompt.innerHTML = `<span class="loader"></span><p style="margin-top:10px;font-weight:800;">Envoi en cours...</p>`;

            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Non connecté");

            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}/event_${Date.now()}.${fileExt}`;

            const { data, error } = await window._supabase.storage
                .from('avatars')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = window._supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            urlInput.value = publicUrl;
            previewImg.style.backgroundImage = `url('${publicUrl}')`;
            prompt.style.display = 'none';
            previewCont.style.display = 'block';
            zone.style.padding = '12px';

        } catch (err) {
            alert('Erreur upload: ' + err.message);
            prompt.innerHTML = `
                <div style="font-size:2.5rem;margin-bottom:12px;">❌</div>
                <p style="margin:0;font-weight:800;color:#dc2626;">Échec de l'envoi</p>
                <p style="margin:4px 0 0;font-size:0.8rem;color:#717c77;font-weight:600;">Réessayez</p>`;
        }
    },

    async saveEvent(eventId = null) {
        const btn = document.getElementById('ev-save-btn');
        const title = document.getElementById('ev-title')?.value?.trim();
        const date = document.getElementById('ev-date')?.value;
        const location = document.getElementById('ev-location')?.value?.trim();
        const imageUrl = document.getElementById('ev-image-url')?.value?.trim();

        if (!title || !date || !location) { alert('Remplissez les champs obligatoires (titre, date, lieu).'); return; }

        btn.disabled = true;
        btn.textContent = eventId ? 'Mise à jour...' : 'Création...';

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) throw new Error("Non connecté");

            const payload = {
                title,
                event_date: date,
                location,
                ticket_tiers: this._currentTiers,
                agenda: this._currentAgenda,
                price: this._currentTiers[0]?.price || 0,
                total_tickets: this._currentTiers.reduce((sum, t) => sum + (parseInt(t.capacity) || 0), 0),
                image_url: imageUrl || 'https://via.placeholder.com/800x400?text=Événement'
            };

            let res;
            if (eventId) {
                res = await window._supabase.from('events').update(payload).eq('id', eventId);
            } else {
                res = await window._supabase.from('events').insert({
                    ...payload,
                    user_id: session.user.id
                });
            }

            if (res.error) throw res.error;

            if (eventId) {
                window.Router.navigate(`#billetterie?action=manage&id=${eventId}`);
            } else {
                window.Router.navigate('#billetterie');
            }
        } catch (err) {
            alert('Erreur: ' + err.message);
            btn.disabled = false;
            btn.textContent = eventId ? 'ENREGISTRER LES MODIFICATIONS' : 'CRÉER L\'ÉVÉNEMENT';
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
