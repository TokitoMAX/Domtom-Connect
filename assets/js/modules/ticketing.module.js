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
                                <button onclick="TicketingModule.renderEventManager('${ev.id}')" class="cta-button primary" style="flex:1; font-size:0.7rem; padding:8px; background:#0f172a;">Gérer</button>
                                <button onclick="TicketingModule.renderEditForm('${ev.id}')" class="cta-button secondary" style="flex:1; font-size:0.7rem; padding:8px;">Editer</button>
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
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Lieu / Adresse Physique *</label>
                                        <input type="text" id="ev-location" required placeholder="Ex: Paris 8e ou Palais des Congrès" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                    </div>
                                    <div class="form-group" style="grid-column: 1/-1; background:#f0f9ff; padding:20px; border-radius:16px; border:1px solid #bae6fd;">
                                        <label style="display:flex; align-items:center; gap:10px; font-weight:800; font-size:0.8rem; color:#0369a1; cursor:pointer;">
                                            <input type="checkbox" id="ev-is-virtual" onchange="document.getElementById('virtual-link-container').style.display = this.checked ? 'block' : 'none'" style="width:18px; height:18px;">
                                            Évènement Virtuel (Lien de diffusion)
                                        </label>
                                        <div id="virtual-link-container" style="display:none; margin-top:16px;">
                                            <input type="url" id="ev-virtual-link" placeholder="Ex: https://zoom.us/j/... ou lien YouTube Live" style="width:100%; padding:12px; border:1px solid #bae6fd; border-radius:10px; font-weight:600;">
                                            <p style="font-size:0.7rem; color:#0369a1; margin-top:8px;">Ce lien sera envoyé automatiquement aux acheteurs de billets.</p>
                                        </div>
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
                                    <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Image de l'affiche</label>
                                    <div style="display:flex; gap:16px; align-items:center;">
                                        <input type="file" id="ev-image-file" accept="image/*" style="flex:1; padding:12px; border:1px dashed #cbd5e1; border-radius:14px; background:#f8fafc; cursor:pointer;">
                                        <input type="hidden" id="ev-image" value="">
                                        <div id="ev-image-preview" style="width:60px; height:60px; border-radius:12px; background:#f1f5f9; border:1px solid #e2e8f0; background-size:cover; background-position:center;"></div>
                                    </div>
                                    <p style="font-size:0.7rem; color:#94a3b8; margin-top:8px;">Formats acceptés: JPG, PNG. Poids max: 2Mo.</p>
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
                                 <span style="font-size:0.85rem; font-weight:600;">Ajoutez une belle affiche pour booster les clics de 3x.</span>
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

        // Add file upload listener
        setTimeout(() => {
            const fileInput = document.getElementById('ev-image-file');
            if(fileInput) {
                fileInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    
                    const btn = document.getElementById('ev-submit-btn');
                    const origText = btn.textContent;
                    btn.textContent = 'Upload en cours...';
                    btn.disabled = true;

                    try {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random()}.${fileExt}`;
                        const filePath = `events/${fileName}`;

                        const { error: uploadError } = await window._supabase.storage
                            .from('avatars')
                            .upload(filePath, file);

                        if (uploadError) throw uploadError;

                        const { data: { publicUrl } } = window._supabase.storage
                            .from('avatars')
                            .getPublicUrl(filePath);

                        document.getElementById('ev-image').value = publicUrl;
                        document.getElementById('ev-image-preview').style.backgroundImage = `url('${publicUrl}')`;
                        
                    } catch (err) {
                        alert("Erreur upload image: " + err.message);
                    } finally {
                        btn.textContent = origText;
                        btn.disabled = false;
                    }
                });
            }
        }, 300);
    },

    /**
     * Render the simplified management/edit form
     */
    async renderEditForm(eventId) {
        const container = document.getElementById('billetterie-view');
        if (!container) return;

        try {
            container.innerHTML = `<div style="text-align:center; padding:40px;"><span class="loader"></span></div>`;
            const { data: ev, error } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            if (error) throw error;

            container.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; padding: clamp(24px, 5vw, 48px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                    <div style="margin-bottom: 40px; display:flex; flex-wrap: wrap; gap: 20px; justify-content:space-between; align-items:flex-end;">
                        <div>
                            <button onclick="window.Router.navigate('#billetterie')" class="cta-button ghost" style="margin-bottom: 16px; padding: 10px 18px; font-size: 0.85rem; border:1px solid #e2e8f0; border-radius:12px; font-weight:800; cursor:pointer; background:white;">
                                &larr; Retour à la billetterie
                            </button>
                            <h1 style="color:#0f172a; margin:0; font-size:clamp(2rem, 5vw, 2.5rem); font-weight:950; letter-spacing:-0.04em;">Gérer: ${ev.title}</h1>
                            <p style="margin:8px 0 0; color:#64748b; font-size:1.1rem; font-weight:500;">Modifiez vos informations et contrôlez vos ventes.</p>
                        </div>
                    </div>

                    <div class="dash-card" style="padding: 40px; background: white; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03);">
                        <form id="event-edit-form" onsubmit="TicketingModule.handleEditSubmit(event, '${ev.id}')">
                            <div style="display: flex; flex-direction: column; gap: 32px;">
                                
                                <div class="form-group" style="margin-bottom:24px;">
                                    <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Titre de l'évènement *</label>
                                    <input type="text" id="edit-ev-title" value="${ev.title || ''}" required style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-size:1rem; font-weight:700; background:#f8fafc;">
                                </div>

                                <div class="role-upgrade-grid">
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Date & Heure *</label>
                                        <input type="date" id="edit-ev-date" value="${ev.event_date || ''}" required style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                    </div>
                                    <div class="form-group">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Capacité d'accueil</label>
                                        <input type="number" id="edit-ev-capacity" value="${ev.total_tickets || ''}" placeholder="Illimité" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                    </div>
                                    <div class="form-group" style="grid-column: 1/-1;">
                                        <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Lieu Physique *</label>
                                        <input type="text" id="edit-ev-location" value="${ev.location || ''}" required style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-weight:700; background:#f8fafc;">
                                    </div>
                                    <div class="form-group" style="grid-column: 1/-1; background:#f0f9ff; padding:20px; border-radius:16px; border:1px solid #bae6fd;">
                                        <label style="display:flex; align-items:center; gap:10px; font-weight:800; font-size:0.8rem; color:#0369a1; cursor:pointer;">
                                            <input type="checkbox" id="edit-ev-is-virtual" ${ev.is_virtual ? 'checked' : ''} onchange="document.getElementById('edit-virtual-link-container').style.display = this.checked ? 'block' : 'none'" style="width:18px; height:18px;">
                                            Évènement Virtuel (Lien de diffusion)
                                        </label>
                                        <div id="edit-virtual-link-container" style="display:${ev.is_virtual ? 'block' : 'none'}; margin-top:16px;">
                                            <input type="url" id="edit-ev-virtual-link" value="${ev.virtual_link || ''}" placeholder="Ex: https://zoom.us/j/..." style="width:100%; padding:12px; border:1px solid #bae6fd; border-radius:10px; font-weight:600;">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Description</label>
                                    <textarea id="edit-ev-description" rows="5" style="width:100%; padding:16px; border:1px solid #e2e8f0; border-radius:14px; font-family:inherit; font-size:0.95rem; line-height:1.6; background:#f8fafc;">${ev.description || ''}</textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label style="display:block; font-weight:800; font-size:0.75rem; text-transform:uppercase; color:#0f172a; margin-bottom:8px;">Image de l'affiche</label>
                                    <div style="display:flex; gap:16px; align-items:center;">
                                        <input type="file" id="edit-ev-image-file" accept="image/*" style="flex:1; padding:12px; border:1px dashed #cbd5e1; border-radius:14px; background:#f8fafc; cursor:pointer;">
                                        <input type="hidden" id="edit-ev-image" value="${ev.image_url || ''}">
                                        <div id="edit-ev-image-preview" style="width:60px; height:60px; border-radius:12px; background:#f1f5f9; border:1px solid #e2e8f0; background-size:cover; background-position:center; background-image:url('${ev.image_url || ''}')"></div>
                                    </div>
                                </div>

                                <div style="padding-top: 32px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 16px;">
                                    <button type="submit" class="cta-button primary" id="edit-ev-submit-btn" style="background:#10b981; color:white; border:none; padding:16px 40px; border-radius:14px; font-weight:950; cursor:pointer; box-shadow: 0 10px 25px rgba(16,185,129,0.2);">SAUVEGARDER</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            // Edit Image Upload Listener
            setTimeout(() => {
                const fileInput = document.getElementById('edit-ev-image-file');
                if(fileInput) {
                    fileInput.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if(!file) return;
                        
                        const btn = document.getElementById('edit-ev-submit-btn');
                        const origText = btn.textContent;
                        btn.textContent = 'Upload...';
                        btn.disabled = true;

                        try {
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${Math.random()}.${fileExt}`;
                            const filePath = `events/${fileName}`;

                            const { error: uploadError } = await window._supabase.storage
                                .from('avatars')
                                .upload(filePath, file);

                            if (uploadError) throw uploadError;

                            const { data: { publicUrl } } = window._supabase.storage
                                .from('avatars')
                                .getPublicUrl(filePath);

                            document.getElementById('edit-ev-image').value = publicUrl;
                            document.getElementById('edit-ev-image-preview').style.backgroundImage = `url('${publicUrl}')`;
                            
                        } catch (err) {
                            alert("Erreur upload image: " + err.message);
                        } finally {
                            btn.textContent = origText;
                            btn.disabled = false;
                        }
                    });
                }
            }, 300);

        } catch (err) {
            container.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur: ${err.message}</div>`;
        }
    },
    
    /**
     * Handle Edit Submit
     */
    async handleEditSubmit(e, eventId) {
        e.preventDefault();
        const btn = document.getElementById('edit-ev-submit-btn');
        btn.textContent = 'Enregistrement...';
        btn.disabled = true;

        try {
            const eventData = {
                title: document.getElementById('edit-ev-title').value,
                event_date: document.getElementById('edit-ev-date').value,
                location: document.getElementById('edit-ev-location').value,
                description: document.getElementById('edit-ev-description').value,
                image_url: document.getElementById('edit-ev-image').value || null,
                total_tickets: parseInt(document.getElementById('edit-ev-capacity').value) || null,
                is_virtual: document.getElementById('edit-ev-is-virtual').checked,
                virtual_link: document.getElementById('edit-ev-virtual-link').value || null
            };

            const { error } = await window._supabase.from('events').update(eventData).eq('id', eventId);
            if (error) throw error;

            if (window.Swal) {
                await Swal.fire({ title: 'Modifié !', text: 'Les informations sont à jour.', icon: 'success', confirmButtonColor: '#10b981' });
            }
            window.Router.navigate('#billetterie');

        } catch (err) {
            console.error("Update Error:", err);
            alert("Erreur: " + err.message);
            btn.textContent = "SAUVEGARDER";
            btn.disabled = false;
        }
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
                is_virtual: document.getElementById('ev-is-virtual').checked,
                virtual_link: document.getElementById('ev-virtual-link').value || null,
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
    },

    /**
     * Render the Event Manager (Organizers Only)
     */
    async renderEventManager(eventId) {
        const view = document.getElementById('billetterie-view');
        if (!view) return;

        view.innerHTML = `<div style="text-align:center; padding:40px;"><span class="loader"></span></div>`;

        try {
            const { data: ev, error: evErr } = await window._supabase.from('events').select('*').eq('id', eventId).single();
            if (evErr) throw evErr;

            const { data: attendees, error: atErr } = await window._supabase.from('tickets').select('*').eq('event_id', eventId).order('created_at', { ascending: false });
            if (atErr) throw atErr;

            const netCommissionRate = 0.15; // 15% Platform Commission
            const grossSales = attendees.reduce((acc, t) => acc + (parseFloat(t.amount_paid) || 0), 0);
            const platformFee = grossSales * netCommissionRate;
            const netOrganizer = grossSales - platformFee;

            view.innerHTML = `
                <div style="font-family: 'Inter', sans-serif; padding: clamp(24px, 5vw, 48px); max-width: 1200px; margin: 0 auto; box-sizing: border-box; width: 100%;">
                    <div style="margin-bottom: 32px; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:20px;">
                        <div>
                            <button onclick="window.Router.navigate('#billetterie')" class="cta-button ghost" style="margin-bottom: 12px; padding: 8px 16px; font-size: 0.8rem; border:1px solid #e2e8f0; background:white; font-weight:800; border-radius:10px;">&larr; Retour</button>
                            <h1 style="color:#0f172a; margin:0; font-weight:950; letter-spacing:-0.03em;">Pilotage: ${ev.title}</h1>
                            <p style="margin:4px 0 0; color:#64748b; font-weight:600;">Tableau de bord de l'organisateur</p>
                        </div>
                        <div style="display:flex; gap:12px;">
                            <button onclick="TicketingModule.renderScanView('${ev.id}')" class="cta-button primary" style="background:#0f172a; padding:12px 24px; display:flex; align-items:center; gap:10px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" /><rect x="7" y="7" width="10" height="10" rx="1" /></svg>
                                Scanner Billets
                            </button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px;">
                        <div style="background: white; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                             <h4 style="font-size: 0.7rem; font-weight: 850; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Ventes Totales (Brut)</h4>
                             <div style="font-size: 2.5rem; font-weight: 900; color:#0f172a;">${grossSales.toFixed(2)}€</div>
                        </div>
                        <div style="background: white; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                             <h4 style="font-size: 0.7rem; font-weight: 850; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Commission Plateforme (15%)</h4>
                             <div style="font-size: 2.5rem; font-weight: 900; color:#ef4444;">-${platformFee.toFixed(2)}€</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 32px; border-radius: 20px; border: 1px solid #10b981; box-shadow: 0 4px 6px -1px rgba(16,185,129,0.1);">
                             <h4 style="font-size: 0.7rem; font-weight: 850; color:#166534; text-transform:uppercase; margin-bottom:12px;">Net Organisateur</h4>
                             <div style="font-size: 2.5rem; font-weight: 900; color:#10b981;">${netOrganizer.toFixed(2)}€</div>
                        </div>
                    </div>

                    <div class="dash-card" style="padding:40px; background:white; border-radius:24px; border:1px solid #e2e8f0;">
                         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <h3 style="font-size:1.1rem; font-weight:900; margin:0;">Participants (${attendees.length})</h3>
                         </div>
                        <table style="width:100%; border-collapse:collapse;">
                            <thead>
                                <tr style="text-align:left; border-bottom:1.5px solid #f1f5f9;">
                                    <th style="padding:12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Participant</th>
                                    <th style="padding:12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Statut</th>
                                    <th style="padding:12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Date d'achat</th>
                                    <th style="padding:12px; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; text-align:right;">Montant Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${attendees.length === 0 ? `<tr><td colspan="4" style="text-align:center; padding:40px; color:#64748b;">Aucun achat pour le moment.</td></tr>` : 
                                    attendees.map(t => {
                                        const tNet = (parseFloat(t.amount_paid) || 0) * (1 - netCommissionRate);
                                        return `
                                        <tr style="border-bottom:1px solid #f8fafc;">
                                            <td style="padding:16px 12px;">
                                                <div style="font-weight:700;">${t.first_name || 'Anonyme'} ${t.last_name || ''}</div>
                                                <div style="font-size:0.65rem; color:#94a3b8;">${t.email || ''}</div>
                                            </td>
                                            <td style="padding:16px 12px;">
                                                <span style="background:${t.checked_in ? '#f0fdf4' : '#f1f5f9'}; color:${t.checked_in ? '#10b981' : '#64748b'}; padding:4px 10px; border-radius:100px; font-size:0.7rem; font-weight:800; text-transform:uppercase;">
                                                    ${t.checked_in ? 'Saturé / Arrivé' : 'Non validé'}
                                                </span>
                                            </td>
                                            <td style="padding:16px 12px; font-size:0.85rem; color:#64748b;">${new Date(t.created_at).toLocaleDateString()}</td>
                                            <td style="padding:16px 12px; text-align:right; font-weight:800; color:#10b981;">${tNet.toFixed(2)}€</td>
                                        </tr>
                                    `}).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (err) {
            view.innerHTML = `<div style="padding:40px; color:#ef4444;">Erreur: ${err.message}</div>`;
        }
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
            <style>
                @keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
            </style>
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
            document.getElementById('manual-ticket-id').value = '';
        } catch (err) { alert(err.message); }
    },
};

window.TicketingModule = TicketingModule;
