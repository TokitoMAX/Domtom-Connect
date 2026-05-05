/**
 * Domtom Connect - Webinar Module
 * Strategic High-Impact Live Events Module
 */
const WebinarModule = {
    role: null,

    /**
     * Initialize Module
     */
    init: (role) => {
        WebinarModule.role = role;
    },

    /**
     * Module Router
     */
    route: async (view_id, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (view_id) {
            case 'webinars':
            default:
                WebinarModule.renderWebinarsList(target, profile, session);
                break;
        }
    },

    /**
     * Render Webinars List
     */
    renderWebinarsList: async (container, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dash-section-header" style="margin-bottom: 40px;">
                <h1 style="font-size: 2.2rem; font-weight: 900; color: #0f172a; margin-bottom: 8px;">Webinaires Stratégiques</h1>
                <p style="color: #64748b; font-size: 1.1rem;">Participez à des sessions live avec les meilleurs experts de l'écosystème.</p>
            </div>

            <div id="webinars-container" class="dash-grid-layout" style="gap: 32px;">
                <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; background: white; padding: 24px 32px; border-radius: 24px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a;">Prochains Directs</h3>
                        <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: #64748b;">Ne manquez aucune opportunité d'apprendre.</p>
                    </div>
                    ${WebinarModule.role !== 'spectator' ? `
                        <button onclick="WebinarModule.openCreateModal()" class="cta-button primary" style="background: #10b981; border: none; border-radius: 12px; font-weight: 800; padding: 12px 24px;">
                            Planifier un Webinaire
                        </button>
                    ` : ''}
                </div>

                <div id="webinars-list" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px;">
                    <div style="text-align: center; padding: 60px; grid-column: 1 / -1; background: #f8fafc; border-radius: 32px; border: 2px dashed #e2e8f0;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">🎥</div>
                        <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Analyse des sessions en cours...</h4>
                        <p style="color: #64748b;">Nous recherchons les prochains webinaires programmés pour vous.</p>
                    </div>
                </div>
            </div>
        `;

        await WebinarModule.loadWebinars();
    },

    /**
     * Load Webinars from Supabase
     */
    loadWebinars: async () => {
        const listContainer = document.getElementById('webinars-list');
        if (!listContainer) return;

        try {
            const { data: webinars, error } = await window._supabase
                .from('webinars')
                .select('*, profiles(full_name, avatar_url)')
                .order('scheduled_at', { ascending: true });

            if (error) throw error;

            if (!webinars || webinars.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align: center; padding: 60px; grid-column: 1 / -1; background: #f8fafc; border-radius: 32px; border: 2px dashed #e2e8f0;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">📅</div>
                        <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Aucun webinaire prévu</h4>
                        <p style="color: #64748b;">Revenez bientôt pour découvrir les prochaines sessions live.</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = webinars.map(w => WebinarModule.renderWebinarCard(w)).join('');
        } catch (err) {
            console.error("Error loading webinars:", err);
            listContainer.innerHTML = `<p style="color: red; text-align:center; grid-column: 1 / -1;">Erreur lors du chargement des webinaires. Veuillez réessayer.</p>`;
        }
    },

    /**
     * Render Single Webinar Card
     */
    renderWebinarCard: (webinar) => {
        const date = new Date(webinar.scheduled_at);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        const isLive = new Date() >= date && new Date() <= new Date(date.getTime() + 60*60*1000); // Live if within 1h

        return `
            <div style="background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; transition: 0.3s; position: relative;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-5px)'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'">
                ${isLive ? `
                    <div style="position: absolute; top: 16px; right: 16px; background: #ef4444; color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; display: flex; align-items: center; gap: 6px; z-index: 2;">
                        <span style="width: 8px; height: 8px; background: white; border-radius: 50%; display: inline-block; animation: pulse 1s infinite;"></span>
                        EN DIRECT
                    </div>
                ` : ''}
                
                <div style="padding: 32px;">
                    <div style="color: #10b981; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                        ${formattedDate} • ${formattedTime}
                    </div>
                    <h3 style="font-size: 1.4rem; font-weight: 900; color: #0f172a; margin-bottom: 16px; line-height: 1.3;">${webinar.title}</h3>
                    <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">${webinar.description || 'Une session live stratégique pour booster votre impact.'}</p>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                        <img src="${webinar.profiles?.avatar_url || './assets/images/default-avatar.png'}" style="width: 40px; height: 40px; border-radius: 12px; object-fit: cover; background: #f1f5f9;">
                        <div>
                            <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">${webinar.profiles?.full_name || 'Expert Domtom'}</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Hôte de la session</div>
                        </div>
                    </div>

                    <button onclick="WebinarModule.joinWebinar('${webinar.id}', '${webinar.meeting_link}')" class="cta-button primary" style="width: 100%; height: 50px; background: ${isLive ? '#ef4444' : '#0f172a'}; color: white; border-radius: 14px; font-weight: 800; border: none; cursor: pointer; transition: 0.2s;">
                        ${isLive ? 'Rejoindre le Direct' : 'M\'inscrire / Accéder'}
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Join Webinar Logic
     */
    joinWebinar: (id, link) => {
        if (!link) {
            alert("Le lien de connexion n'est pas encore disponible. Vous recevrez une notification au début de la session.");
            return;
        }
        window.open(link, '_blank');
    },

    /**
     * Open Create Modal
     */
    openCreateModal: () => {
        let modal = document.getElementById('webinar-create-modal');
        if (!modal) {
            const modalHTML = `
                <div id="webinar-create-modal" class="modal-overlay" style="display:none; position:fixed; inset:0; background:rgba(15, 23, 42, 0.8); backdrop-filter:blur(10px); z-index:20001; align-items:center; justify-content:center; padding:20px;">
                    <div style="background:white; width:100%; max-width:600px; border-radius:32px; padding:40px; position:relative; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
                        <button onclick="WebinarModule.closeCreateModal()" style="position:absolute; top:32px; right:32px; background:none; border:none; font-size:1.5rem; color:#94a3b8; cursor:pointer;">×</button>
                        
                        <h2 style="font-size:1.8rem; font-weight:900; color:#0f172a; margin-bottom:8px;">Planifier un Webinaire</h2>
                        <p style="color:#64748b; margin-bottom:32px;">Créez un événement live pour votre communauté.</p>
                        
                        <form id="webinar-form" onsubmit="WebinarModule.handleCreateSubmit(event)" style="display:grid; gap:20px;">
                            <div>
                                <label style="display:block; font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:8px; text-transform:uppercase;">Titre de la session *</label>
                                <input name="title" required placeholder="Ex: Stratégies de Croissance 2024" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px; font-family:inherit;">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:8px; text-transform:uppercase;">Description</label>
                                <textarea name="description" rows="3" placeholder="De quoi allons-nous parler ?" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px; font-family:inherit; resize:none;"></textarea>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                                <div>
                                    <label style="display:block; font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:8px; text-transform:uppercase;">Date et Heure *</label>
                                    <input type="datetime-local" name="scheduled_at" required style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px; font-family:inherit;">
                                </div>
                                <div>
                                    <label style="display:block; font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:8px; text-transform:uppercase;">Lien (Jitsi, Zoom...) *</label>
                                    <input type="url" name="meeting_link" required placeholder="https://meet.jit.si/..." style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px; font-family:inherit;">
                                </div>
                            </div>
                            
                            <button type="submit" class="cta-button primary" style="width:100%; padding:16px; background:#0f172a; color:white; border:none; border-radius:16px; font-weight:800; margin-top:12px;">Publier le Webinaire</button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('webinar-create-modal');
        }
        modal.style.display = 'flex';
    },

    /**
     * Close Create Modal
     */
    closeCreateModal: () => {
        const modal = document.getElementById('webinar-create-modal');
        if (modal) modal.style.display = 'none';
    },

    /**
     * Handle Creation Submit
     */
    handleCreateSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const { error } = await window._supabase
                .from('webinars')
                .insert([{
                    title: data.title,
                    description: data.description,
                    scheduled_at: data.scheduled_at,
                    meeting_link: data.meeting_link,
                    host_id: (await window._supabase.auth.getUser()).data.user.id
                }]);

            if (error) throw error;

            alert("Webinaire planifié avec succès !");
            WebinarModule.closeCreateModal();
            WebinarModule.loadWebinars();
            form.reset();
        } catch (err) {
            console.error("Error creating webinar:", err);
            alert("Erreur lors de la création du webinaire : " + err.message);
        }
    }
};

window.WebinarModule = WebinarModule;
