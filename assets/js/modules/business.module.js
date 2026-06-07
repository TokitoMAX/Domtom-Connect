/**
 * BusinessModule - Domtom Connect
 * Centre de Transactions WeChat-style
 * Gère l'historique des règlements Stripe Connect et les demandes de paiements directes.
 */
const BusinessModule = {
    COMMISSION: 0.125, // 12.5% Domtom Connect

    switchTab: function(tabId) {
        // Hide all tabs
        const contents = document.querySelectorAll('.business-tab-content');
        contents.forEach(c => c.style.display = 'none');
        
        // Remove active class from buttons
        const buttons = document.querySelectorAll('.business-tab');
        buttons.forEach(b => {
            b.classList.remove('active');
            b.style.background = '#f1f5f9';
            b.style.color = '#64748b';
        });

        // Show selected tab
        const activeContent = document.getElementById('tab-' + tabId);
        if (activeContent) activeContent.style.display = 'block';

        // Update active button styling
        const activeButton = document.querySelector(`.business-tab[onclick="BusinessModule.switchTab('${tabId}')"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.style.background = '#020617';
            activeButton.style.color = 'white';
        }
    },

    markSigned: async function(id) {
        // Simulate proof upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf,image/*';
        input.onchange = async (e) => {
            if (!e.target.files.length) return;
            const btn = document.getElementById('btn-sign-' + id);
            if(btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
            
            // Here we would upload the file to Supabase storage. For now we save the status.
            await window._supabase.from('business_docs').update({ signature_status: 'signed' }).eq('id', id);
            this.renderView(document.getElementById('business-view'));
        };
        input.click();
    },

    markAcompte: async function(id, amt) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf,image/*';
        input.onchange = async (e) => {
            if (!e.target.files.length) return;
            const btn = document.getElementById('btn-acompte-' + id);
            if(btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
            
            await window._supabase.from('business_docs').update({ deposit_status: 'paid', deposit_amount: amt }).eq('id', id);
            this.renderView(document.getElementById('business-view'));
        };
        input.click();
    },

    markFullyPaid: async function(id) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf,image/*';
        input.onchange = async (e) => {
            if (!e.target.files.length) return;
            const btn = document.getElementById('btn-sold-' + id);
            if(btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
            
            await window._supabase.from('business_docs').update({ status: 'paid' }).eq('id', id);
            this.renderView(document.getElementById('business-view'));
        };
        input.click();
    },

    deleteDoc: async function(id) {
        if(confirm("Êtes-vous sûr de vouloir supprimer cette mission et son suivi ?")) {
            try {
                await window._supabase.from('business_docs').delete().eq('id', id);
                this.renderView(document.getElementById('business-view'));
            } catch (err) {
                console.error("Error deleting document:", err);
                alert("Impossible de supprimer la mission.");
            }
        }
    },

    openCreateModal: function() {
        const modalHtml = `
        <div id="business-modal" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;">
            <div style="background:white; border-radius:24px; width:100%; max-width:500px; padding:32px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                    <h3 style="margin:0; font-size:1.5rem; font-weight:900;">Nouvelle Mission</h3>
                    <button onclick="document.getElementById('business-modal').remove()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#94a3b8;">&times;</button>
                </div>
                
                <div style="margin-bottom:16px;">
                    <label style="display:block; font-size:0.85rem; font-weight:700; color:#64748b; margin-bottom:8px;">Titre du projet / mission</label>
                    <input type="text" id="bm-title" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:12px; font-family:inherit; font-size:1rem;" placeholder="Ex: Refonte Site E-commerce">
                </div>
                
                <div style="margin-bottom:16px;">
                    <label style="display:block; font-size:0.85rem; font-weight:700; color:#64748b; margin-bottom:8px;">Nom du client</label>
                    <input type="text" id="bm-client" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:12px; font-family:inherit; font-size:1rem;" placeholder="Ex: Jean Dupont">
                </div>
                
                <div style="display:flex; gap:16px; margin-bottom:24px;">
                    <div style="flex:1;">
                        <label style="display:block; font-size:0.85rem; font-weight:700; color:#64748b; margin-bottom:8px;">Montant Total (€)</label>
                        <input type="number" id="bm-amount" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:12px; font-family:inherit; font-size:1rem;" placeholder="0">
                    </div>
                    <div style="flex:1;">
                        <label style="display:block; font-size:0.85rem; font-weight:700; color:#64748b; margin-bottom:8px;">Acompte (%)</label>
                        <input type="number" id="bm-perc" value="30" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:12px; font-family:inherit; font-size:1rem;" placeholder="30">
                    </div>
                </div>

                <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:16px; margin-bottom:24px;">
                    <div style="font-size:0.85rem; font-weight:700; color:#64748b; margin-bottom:8px;">Uploader le Devis (PDF)</div>
                    <input type="file" id="bm-file" accept="application/pdf" style="width:100%; font-size:0.9rem;">
                </div>
                
                <button onclick="BusinessModule.submitDevis()" style="width:100%; background:#10b981; color:white; border:none; padding:16px; border-radius:12px; font-weight:800; font-size:1rem; cursor:pointer;">Créer la mission</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    submitDevis: async function() {
        const title = document.getElementById('bm-title').value;
        const client = document.getElementById('bm-client').value;
        const amount = parseFloat(document.getElementById('bm-amount').value);
        const perc = parseFloat(document.getElementById('bm-perc').value);
        
        if(!title || !client || isNaN(amount) || amount <= 0 || isNaN(perc)) {
            return alert("Veuillez remplir tous les champs correctement avec de vraies valeurs.");
        }
        
        try {
            document.querySelector('#business-modal button[onclick="BusinessModule.submitDevis()"]').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création...';
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('business_docs').insert({
                expert_id: session.user.id,
                project_title: title,
                client_name: client,
                total_amount: amount,
                deposit_perc: perc,
                doc_type: 'quote',
                status: 'draft'
            });
            document.getElementById('business-modal').remove();
            this.renderView(document.getElementById('business-view'));
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création.");
        }
    },

    renderMissions: async function() {
        const container = document.getElementById('missions-content');
        if (!container) return;

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            const profile = window.App?.state?.profile;
            const role = (profile?.role || '').toLowerCase();
            const isCompany = role === 'entreprise' || role === 'admin';
            const isExpert = role === 'expert' || role === 'prestataire' || role === 'admin';

            // 1. Fetch open job offers from job_offers table
            const { data: jobOffers, error: jobErr } = await window._supabase
                .from('job_offers')
                .select('*, profiles:company_id(full_name, avatar_url, company_name, territory)')
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (jobErr) console.warn('[BusinessModule] job_offers not available:', jobErr.message);
            const offers = jobOffers || [];

            // 2. If company: show "Mes annonces" (their own job offers)
            let myOffers = [];
            if (isCompany && session) {
                const { data: mine } = await window._supabase
                    .from('job_offers')
                    .select('*')
                    .eq('company_id', session.user.id)
                    .order('created_at', { ascending: false });
                myOffers = mine || [];
            }

            // 3. Render
            let html = '';

            // Company header with "Publier une annonce"
            if (isCompany) {
                html += `
                <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f); border-radius:16px; padding:24px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; color:white;">
                    <div>
                        <div style="font-size:0.75rem; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Espace Recruteur</div>
                        <h3 style="margin:0; font-size:1.2rem; font-weight:900;">Vos Annonces de Mission</h3>
                        <p style="margin:4px 0 0; color:rgba(255,255,255,0.65); font-size:0.85rem;">Publiez des missions pour trouver les bons experts DTC.</p>
                    </div>
                    <button onclick="BusinessModule.openJobOfferModal()" style="background:#10b981; color:white; border:none; padding:12px 20px; border-radius:12px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:8px; white-space:nowrap;"><i class="fas fa-plus"></i> Publier une annonce</button>
                </div>`;

                if (myOffers.length > 0) {
                    html += `<div style="margin-bottom:24px;"><h4 style="font-size:0.85rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 12px;">Mes annonces (${myOffers.length})</h4>
                    <div style="display:flex; flex-direction:column; gap:12px;">`;
                    myOffers.forEach(o => {
                        const statusColor = o.status === 'open' ? '#10b981' : '#94a3b8';
                        const statusBg = o.status === 'open' ? '#f0fdf4' : '#f8fafc';
                        const statusLabel = o.status === 'open' ? 'Active' : 'Fermée';
                        html += `<div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                            <div>
                                <div style="font-weight:800; color:#0f172a; font-size:1rem;">${o.title || 'Sans titre'}</div>
                                <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">${o.sector || ''} ${o.territory ? '· ' + o.territory : ''} ${o.budget ? '· Budget : ' + o.budget + '€' : ''}</div>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:${statusBg}; color:${statusColor}; padding:4px 10px; border-radius:100px; font-size:0.75rem; font-weight:800;">${statusLabel}</span>
                                <button onclick="BusinessModule.closeJobOffer('${o.id}')" style="background:#fee2e2; color:#ef4444; border:none; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:700; cursor:pointer;">Fermer</button>
                            </div>
                        </div>`;
                    });
                    html += `</div></div>`;
                }

                html += `<h4 style="font-size:0.85rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 12px;">Toutes les annonces ouvertes (${offers.length})</h4>`;
            }

            // Expert / General view
            if (offers.length === 0) {
                html += `<div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:16px; padding:32px; text-align:center;">
                    <div style="font-size:2rem; margin-bottom:12px; color:#94a3b8;"><i class="fas fa-briefcase"></i></div>
                    <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0 0 8px;">Aucune annonce active</h3>
                    <p style="color:#64748b; font-size:0.9rem; margin:0;">Les entreprises partenaires publient leurs besoins ici. Revenez bientôt !</p>
                </div>`;
            } else {
                html += `<div style="display:flex; flex-direction:column; gap:16px;">`;
                offers.forEach(o => {
                    const company = o.profiles || {};
                    const companyName = company.company_name || company.full_name || 'Entreprise';
                    const avatar = company.avatar_url;
                    html += `
                    <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; padding:20px 24px; box-shadow:0 2px 8px rgba(0,0,0,0.04); transition:box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.09)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
                            <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                                <div style="width:44px; height:44px; border-radius:12px; background:#f1f5f9; overflow:hidden; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-weight:900; color:#64748b; font-size:1rem;">
                                    ${avatar ? `<img src="${avatar}" style="width:100%;height:100%;object-fit:cover;">` : companyName.charAt(0).toUpperCase()}
                                </div>
                                <div style="min-width:0;">
                                    <div style="font-weight:900; color:#0f172a; font-size:1.05rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${o.title || 'Mission sans titre'}</div>
                                    <div style="font-size:0.8rem; color:#64748b; font-weight:600; margin-top:2px;">${companyName} ${company.territory ? '· ' + company.territory : ''}</div>
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0;">
                                ${o.budget ? `<div style="font-size:1rem; font-weight:900; color:#0f172a;">${Number(o.budget).toLocaleString('fr-FR')} €</div>` : ''}
                                ${o.sector ? `<span style="background:#eff6ff; color:#3b82f6; padding:3px 10px; border-radius:100px; font-size:0.7rem; font-weight:800;">${o.sector}</span>` : ''}
                            </div>
                        </div>
                        ${o.description ? `<p style="margin:12px 0 0; color:#475569; font-size:0.9rem; line-height:1.6; border-top:1px solid #f1f5f9; padding-top:12px;">${o.description}</p>` : ''}
                        ${isExpert ? `<div style="margin-top:16px; display:flex; justify-content:flex-end;">
                            <button onclick="window.Router.navigate('#messages')" style="background:#0f172a; color:white; border:none; padding:10px 20px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.85rem;"><i class="fas fa-paper-plane" style="margin-right:6px;"></i>Postuler via message</button>
                        </div>` : ''}
                    </div>`;
                });
                html += `</div>`;
            }

            container.innerHTML = html;
        } catch(e) {
            console.error('[BusinessModule] renderMissions error:', e);
            if (container) container.innerHTML = `<div style="padding:20px;color:#ef4444;font-weight:700;">Erreur : ${e.message}</div>`;
        }
    },

    openJobOfferModal: function() {
        const modalHtml = `
        <div id="job-offer-modal" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;">
            <div style="background:white; border-radius:24px; width:100%; max-width:520px; padding:32px; box-shadow:0 20px 50px rgba(0,0,0,0.15); max-height:90vh; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                    <h3 style="margin:0; font-size:1.4rem; font-weight:900; color:#0f172a;">Nouvelle Annonce Mission</h3>
                    <button onclick="document.getElementById('job-offer-modal').remove()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#94a3b8; line-height:1;">&times;</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:6px; text-transform:uppercase;">Titre de la mission *</label>
                        <input type="text" id="jo-title" style="width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:inherit; font-size:0.95rem; box-sizing:border-box;" placeholder="Ex: Développeur web pour refonte site">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:6px; text-transform:uppercase;">Description & Compétences requises</label>
                        <textarea id="jo-desc" rows="4" style="width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:inherit; font-size:0.95rem; box-sizing:border-box; resize:vertical;" placeholder="Décrivez la mission, le profil recherché, les livrables..."></textarea>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:6px; text-transform:uppercase;">Secteur</label>
                            <select id="jo-sector" style="width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:inherit; font-size:0.9rem; box-sizing:border-box;">
                                <option value="">Choisir...</option>
                                <option>Numérique & Tech</option>
                                <option>Marketing & Communication</option>
                                <option>Comptabilité & Finance</option>
                                <option>Juridique</option>
                                <option>Design Graphique</option>
                                <option>Commerce & Vente</option>
                                <option>RH & Formation</option>
                                <option>Logistique</option>
                                <option>Bâtiment & Travaux</option>
                                <option>Tourisme & Événementiel</option>
                                <option>Agriculture & Alimentation</option>
                                <option>Santé & Bien-être</option>
                                <option>Autre</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:6px; text-transform:uppercase;">Budget (€)</label>
                            <input type="number" id="jo-budget" style="width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:inherit; font-size:0.95rem; box-sizing:border-box;" placeholder="0">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:6px; text-transform:uppercase;">Durée</label>
                            <select id="jo-duration" style="width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:inherit; font-size:0.9rem; box-sizing:border-box;">
                                <option value="">Non précisée</option>
                                <option>Moins d'une semaine</option>
                                <option>1 à 2 semaines</option>
                                <option>1 mois</option>
                                <option>2 à 3 mois</option>
                                <option>Long terme</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:6px; text-transform:uppercase;">Territoire</label>
                            <select id="jo-territory" style="width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:inherit; font-size:0.9rem; box-sizing:border-box;">
                                <option value="">Tous territoires</option>
                                <option>Martinique</option>
                                <option>Guadeloupe</option>
                                <option>Guyane</option>
                                <option>La Réunion</option>
                                <option>Mayotte</option>
                                <option>Saint-Martin</option>
                                <option>Remote / À distance</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button onclick="BusinessModule.submitJobOffer()" style="width:100%; margin-top:24px; background:#10b981; color:white; border:none; padding:15px; border-radius:12px; font-weight:900; font-size:1rem; cursor:pointer; transition:background 0.2s;">Publier l'annonce</button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    submitJobOffer: async function() {
        const title = document.getElementById('jo-title').value.trim();
        const desc = document.getElementById('jo-desc').value.trim();
        const sector = document.getElementById('jo-sector').value;
        const budget = parseFloat(document.getElementById('jo-budget').value) || null;
        const duration = document.getElementById('jo-duration').value;
        const territory = document.getElementById('jo-territory').value;

        if (!title) return alert('Le titre de la mission est requis.');

        const btn = document.querySelector('#job-offer-modal button[onclick="BusinessModule.submitJobOffer()"]');
        if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publication...';

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            await window._supabase.from('job_offers').insert({
                company_id: session.user.id,
                title,
                description: desc || null,
                sector: sector || null,
                budget,
                duration: duration || null,
                territory: territory || null,
                status: 'open'
            });
            document.getElementById('job-offer-modal').remove();
            this.renderMissions();
        } catch(e) {
            console.error(e);
            alert('Erreur lors de la publication : ' + e.message);
            if (btn) btn.innerHTML = 'Publier l\'annonce';
        }
    },

    closeJobOffer: async function(id) {
        if (!confirm('Fermer cette annonce ? Les experts ne pourront plus la voir.')) return;
        try {
            await window._supabase.from('job_offers').update({ status: 'closed' }).eq('id', id);
            this.renderMissions();
        } catch(e) {
            alert('Erreur : ' + e.message);
        }
    },

    renderDashboard: async function(container) {
        await this.renderView(container);
    },

    renderView: async function(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;font-family:'Plus Jakarta Sans',sans-serif;"><span class="loader"></span></div>`;

        // Inject responsive CSS
        if (!document.getElementById('business-module-css')) {
            const style = document.createElement('style');
            style.id = 'business-module-css';
            style.innerHTML = `
                /* Desktop base styles */
                .tracker-steps { display: flex; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
                .tracker-step { flex: 1; min-width: 200px; padding: 16px; border-radius: 12px; position: relative; }
                .tab-btn { padding: 10px 20px; border-radius: 100px; border: none; font-weight: 800; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                
                /* Mobile specific styles */
                @media (max-width: 768px) {
                    .business-tab { padding: 8px 16px !important; font-size: 0.9rem !important; }
                    
                    /* Vertical timeline for tracker */
                    .tracker-steps { flex-direction: column; padding: 12px; gap: 0; background: transparent; border: none; }
                    .tracker-step { 
                        width: 100%; 
                        margin-bottom: 0; 
                        padding: 16px 0 16px 32px !important; 
                        border: none !important;
                        border-left: 2px solid #e2e8f0 !important;
                        border-radius: 0 !important;
                        background: transparent !important;
                        position: relative;
                    }
                    .tracker-step::before {
                        content: '';
                        position: absolute;
                        left: -9px;
                        top: 24px;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: white;
                        border: 2px solid #cbd5e1;
                        z-index: 2;
                    }
                    .tracker-step.active-step::before { border-color: #3b82f6; background: #3b82f6; }
                    .tracker-step.completed-step::before { border-color: #10b981; background: #10b981; }
                    .tracker-step:last-child { border-left-color: transparent !important; }
                    
                    .business-header { flex-direction: column; align-items: flex-start !important; gap: 16px; }
                    .business-header h2 { font-size: 1.5rem !important; }
                    .business-header > div { width: 100%; }
                    .business-header button { width: 100%; justify-content: center; }
                    
                    .stats-grid { grid-template-columns: 1fr !important; }
                    .evolution-box { flex-direction: column; text-align: left; padding: 20px !important; gap: 16px !important; }
                    .evolution-stats { width: 100%; flex-direction: column; gap: 12px !important; }
                    .evolution-stats > div { width: 100%; }
                }
            `;
            document.head.appendChild(style);
        }

        try {
            const { data: { session } } = await window._supabase.auth.getSession();
            if (!session) { 
                container.innerHTML = `<div style="padding:40px;color:#dc2626;">Veuillez vous connecter pour voir vos transactions.</div>`; 
                return; 
            }

            // Fetch transaction records from business_docs
            const { data: allDocs, error: fetchError } = await window._supabase
                .from('business_docs')
                .select('*')
                .or(`expert_id.eq.${session.user.id},client_id.eq.${session.user.id}`)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const docs = allDocs || [];
            
            // Stats calculations (For the current user as expert/provider)
            const myEarnings = docs.filter(d => d.expert_id === session.user.id && d.status === 'paid');
            const totalCA = myEarnings.reduce((s, d) => s + (d.total_amount || 0), 0);
            const totalComm = totalCA * this.COMMISSION;
            const totalNet = totalCA - totalComm;

            // Evolution stats
            const devisValidés = docs.filter(d => d.expert_id === session.user.id && (d.signature_status === 'signed' || d.status === 'paid' || d.deposit_status === 'paid'));
            const totalDevisValidés = devisValidés.reduce((s, d) => s + (d.total_amount || 0), 0);

            // Generate Tracker HTML
            let trackersHTML = '';
            if (docs.length === 0) {
                trackersHTML = `
                <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:16px; padding:32px; text-align:center;">
                    <div style="font-size:2rem; margin-bottom:12px; color:#94a3b8;"><i class="fas fa-folder-open"></i></div>
                    <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0 0 8px;">Aucun document</h3>
                    <p style="color:#64748b; font-size:0.9rem; margin:0;">Créez votre premier devis pour démarrer le suivi.</p>
                </div>`;
            } else {
                trackersHTML = docs.map(doc => {
                    const isSigned = doc.signature_status === 'signed' || doc.status === 'paid' || doc.deposit_status === 'paid'; 
                    const isAcomptePaid = doc.deposit_status === 'paid' || doc.status === 'paid';
                    const isFullyPaid = doc.status === 'paid';
                    const amount = doc.total_amount || 0;
                    const acompteAmt = doc.deposit_amount || 0;
                    
                    return `
                    <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; padding:clamp(16px, 3vw, 24px); margin-bottom:20px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:24px;">
                            <div>
                                <div style="font-size:0.75rem; color:#64748b; font-weight:800; text-transform:uppercase; margin-bottom:4px;">${new Date(doc.created_at).toLocaleDateString()} &bull; MISSION</div>
                                <h4 style="margin:0; font-size:1.2rem; font-weight:800; color:#0f172a;">${doc.project_title || 'Projet sans nom'}</h4>
                                <div style="color:#64748b; font-size:0.9rem; margin-top:6px;"><i class="fas fa-user" style="margin-right:6px;"></i>${doc.client_name}</div>
                            </div>
                            <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                                                <div style="font-size:1.5rem; font-weight:900; color:#0f172a;">${amount.toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</div>
                                                <div style="display:flex; gap:8px; align-items:center;">
                                                    <div style="font-size:0.8rem; font-weight:700; color:${isFullyPaid ? '#10b981' : '#f59e0b'}; background:${isFullyPaid ? '#f0fdf4' : '#fffbeb'}; display:inline-block; padding:4px 10px; border-radius:100px;">
                                                        ${isFullyPaid ? 'Clôturé & Payé' : 'En cours'}
                                                    </div>
                                                    <button onclick="BusinessModule.deleteDoc('${doc.id}')" style="background:#fee2e2; color:#ef4444; border:none; width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Supprimer la mission"><i class="fas fa-trash-alt" style="font-size:0.8rem;"></i></button>
                                                </div>
                                            </div>
                                        </div>
                        
                        <!-- Tracker Steps -->
                        <div class="tracker-steps">
                            
                            <!-- Step 1: Validation -->
                            <div class="tracker-step ${isSigned ? 'completed-step' : 'active-step'}" style="border:2px solid ${isSigned ? '#10b981' : '#cbd5e1'}; background:${isSigned ? '#f0fdf4' : 'white'};">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <div style="width:24px; height:24px; border-radius:50%; background:${isSigned ? '#10b981' : '#e2e8f0'}; color:${isSigned ? 'white' : '#64748b'}; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900; z-index:3;">1</div>
                                    <div style="font-weight:800; color:${isSigned ? '#065f46' : '#64748b'};">Devis Validé</div>
                                </div>
                                ${isSigned 
                                    ? `<div style="font-size:0.85rem; color:#059669; font-weight:700;"><i class="fas fa-file-signature"></i> Devis signé & joint</div>` 
                                    : `<button id="btn-sign-${doc.id}" onclick="BusinessModule.markSigned('${doc.id}')" style="width:100%; background:white; border:1px dashed #cbd5e1; padding:8px; border-radius:8px; font-weight:700; cursor:pointer; color:#0f172a; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-upload"></i> Joindre devis signé</button>`}
                            </div>

                            <!-- Step 2: Acompte -->
                            <div class="tracker-step ${isAcomptePaid ? 'completed-step' : (isSigned ? 'active-step' : '')}" style="border:2px solid ${isAcomptePaid ? '#3b82f6' : '#cbd5e1'}; background:${isAcomptePaid ? '#eff6ff' : 'white'}; opacity:${isSigned ? '1' : '0.5'}; pointer-events:${isSigned ? 'auto' : 'none'};">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <div style="width:24px; height:24px; border-radius:50%; background:${isAcomptePaid ? '#3b82f6' : '#e2e8f0'}; color:${isAcomptePaid ? 'white' : '#64748b'}; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900; z-index:3;">2</div>
                                    <div style="font-weight:800; color:${isAcomptePaid ? '#1e40af' : '#64748b'};">Acompte Payé</div>
                                </div>
                                ${isAcomptePaid 
                                    ? `<div style="font-size:0.85rem; color:#1d4ed8; font-weight:700;"><i class="fas fa-receipt"></i> ${(doc.deposit_amount || 0).toLocaleString('fr-FR', {style:'currency', currency:'EUR'})} encaissés</div>` 
                                    : `<div style="display:flex; flex-direction:column; gap:8px;">
                                        <div style="font-size:0.85rem; font-weight:700; color:#64748b;">Attendu : ${((amount * (doc.deposit_perc||30))/100).toLocaleString('fr-FR', {style:'currency', currency:'EUR'})} (${doc.deposit_perc||30}%)</div>
                                        <button id="btn-acompte-${doc.id}" onclick="BusinessModule.markAcompte('${doc.id}', ${(amount * (doc.deposit_perc||30))/100})" style="background:#0f172a; color:white; border:none; padding:8px 12px; border-radius:8px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-upload"></i> Preuve virement</button>
                                       </div>`}
                            </div>

                            <!-- Step 3: Solde -->
                            <div class="tracker-step ${isFullyPaid ? 'completed-step' : (isAcomptePaid ? 'active-step' : '')}" style="border:2px solid ${isFullyPaid ? '#10b981' : '#cbd5e1'}; background:${isFullyPaid ? '#f0fdf4' : 'white'}; opacity:${isAcomptePaid || isSigned ? '1' : '0.5'}; pointer-events:${isAcomptePaid || isSigned ? 'auto' : 'none'};">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <div style="width:24px; height:24px; border-radius:50%; background:${isFullyPaid ? '#10b981' : '#e2e8f0'}; color:${isFullyPaid ? 'white' : '#64748b'}; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900; z-index:3;">3</div>
                                    <div style="font-weight:800; color:${isFullyPaid ? '#065f46' : '#64748b'};">Solde Facturé</div>
                                </div>
                                ${isFullyPaid 
                                    ? `<div style="font-size:0.85rem; color:#059669; font-weight:700;"><i class="fas fa-file-invoice-dollar"></i> Facture finale validée</div>` 
                                    : `<div style="display:flex; flex-direction:column; gap:8px;">
                                        <div style="font-size:0.85rem; font-weight:700; color:#64748b;">Reste : ${(amount - ((amount * (doc.deposit_perc||30))/100)).toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</div>
                                        <button id="btn-sold-${doc.id}" onclick="BusinessModule.markFullyPaid('${doc.id}')" style="background:white; border:1px dashed #cbd5e1; padding:8px; border-radius:8px; font-weight:700; cursor:pointer; color:#0f172a; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-upload"></i> Joindre facture finale</button>
                                       </div>`}
                            </div>
                        </div>
                    </div>
                    `;
                }).join('');
            }

            container.innerHTML = `
            <div style="font-family:'Plus Jakarta Sans',sans-serif; background:#ffffff; border-radius:24px; padding:clamp(16px, 3vw, 32px);">
                
                <!-- Info Header -->
                <div class="business-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap:wrap; gap:16px;">
                    <div>
                        <h2 style="font-size:1.5rem; font-weight:900; color:#020617; letter-spacing:-0.03em; margin:0;">Mon Activité Pro</h2>
                        <p style="color:#64748b; font-size:0.9rem; font-weight:550; margin-top:4px;">Gérez vos missions, devis, facturation et suivez votre évolution.</p>
                    </div>
                    <div>
                        <button onclick="window.Router.navigate('#messages')" style="background:#020617; color:white; border:none; padding:12px 24px; border-radius:12px; font-weight:800; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:8px; box-shadow: 0 4px 12px rgba(2,6,23,0.1);">
                            <span>Lancer un chat pour être payé</span>
                        </button>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div style="display:flex; gap:12px; margin-bottom:32px; border-bottom:2px solid #f1f5f9; padding-bottom:16px; overflow-x:auto;">
                    <button class="business-tab active tab-btn" onclick="BusinessModule.switchTab('missions')" style="background:#020617; color:white;">Mes Missions</button>
                    <button class="business-tab tab-btn" onclick="BusinessModule.switchTab('devis')" style="background:#f1f5f9; color:#64748b;">Tracker Méthodo</button>
                    <button class="business-tab tab-btn" onclick="BusinessModule.switchTab('evolution')" style="background:#f1f5f9; color:#64748b;">Mon Évolution</button>
                </div>

                <!-- TAB CONTENT: MISSIONS -->
                <div id="tab-missions" class="business-tab-content" style="display:block;">
                    <div id="missions-content">
                        <div style="text-align:center; padding:40px; color:#94a3b8;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i></div>
                    </div>
                </div>

                <!-- TAB CONTENT: DEVIS & FACTURES (TRACKER) -->
                <div id="tab-devis" class="business-tab-content" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
                        <div>
                            <h3 style="font-size:1.2rem; font-weight:900; color:#0f172a; margin:0;">Suivi des Devis & Factures</h3>
                            <p style="color:#64748b; font-size:0.9rem; margin:4px 0 0;">Validez étape par étape : Devis -> Acompte -> Facture Payée.</p>
                        </div>
                        <button style="background:#10b981; border:none; color:white; padding:10px 20px; border-radius:12px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(16,185,129,0.2);" onclick="BusinessModule.openCreateModal()"><i class="fas fa-plus"></i> Créer une mission</button>
                    </div>
                    
                    <div>
                        ${trackersHTML}
                    </div>
                </div>

                <!-- TAB CONTENT: EVOLUTION & FACTURATION STRIPE -->
                <div id="tab-evolution" class="business-tab-content" style="display:none;">
                    
                    <div class="evolution-box" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 20px; padding: clamp(20px, 4vw, 32px); color: white; margin-bottom: 32px; display:flex; flex-wrap:wrap; gap:24px; align-items:center; justify-content:space-between; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <div style="flex:1; min-width:280px;">
                            <div style="font-size:0.8rem; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Suivi du Mois en cours</div>
                            <h3 style="font-size:clamp(1.5rem, 3vw, 2rem); font-weight:900; margin:0 0 12px;">Évolution de l'activité</h3>
                            <p style="color:rgba(255,255,255,0.7); font-size:0.95rem; margin:0; max-width:400px; line-height:1.5;">Analyse automatique basée sur les étapes validées dans votre Tracker de Missions.</p>
                        </div>
                        <div class="evolution-stats" style="display:flex; gap:16px; flex-wrap:wrap;">
                            <div style="flex:1; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:16px; padding:20px; text-align:center; min-width:140px;">
                                <div style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700; margin-bottom:8px; text-transform:uppercase;">Volume Devis Validés</div>
                                <div style="font-size:1.6rem; font-weight:900; color:#fff;">${totalDevisValidés.toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</div>
                            </div>
                            <div style="flex:1; background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.3); border-radius:16px; padding:20px; text-align:center; min-width:140px;">
                                <div style="font-size:0.75rem; color:#a7f3d0; font-weight:700; margin-bottom:8px; text-transform:uppercase;">CA Total Encaissé</div>
                                <div style="font-size:1.6rem; font-weight:900; color:#10b981;">${totalCA.toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</div>
                            </div>
                        </div>
                    </div>

                    <h3 style="font-size:1.2rem; font-weight:900; color:#0f172a; margin:0 0 20px;">Transactions Automatiques Stripe Connect</h3>

                    <!-- Stats Grid -->
                    <div class="stats-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:32px;">
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:20px;">
                            <div style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">Volume Facturé Encaissé</div>
                            <div style="font-size:1.6rem; font-weight:900; color:#020617;">${totalCA.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        </div>
                        <div style="background:#fff1f2; border:1px solid #ffe4e6; border-radius:16px; padding:20px;">
                            <div style="font-size:0.65rem; font-weight:800; color:#e11d48; text-transform:uppercase; margin-bottom:8px;">Part Plateforme (12.5%)</div>
                            <div style="font-size:1.6rem; font-weight:900; color:#e11d48;">${totalComm.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        </div>
                        <div style="background:#f0fdf4; border:1px solid #dcfce7; border-radius:16px; padding:20px;">
                            <div style="font-size:0.65rem; font-weight:800; color:#16a34a; text-transform:uppercase; margin-bottom:8px;">Revenu Net Reversé</div>
                            <div style="font-size:1.6rem; font-weight:900; color:#16a34a;">${totalNet.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        </div>
                    </div>

                    <!-- Transactions Table -->
                    <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
                        <div style="padding:20px; border-bottom:1px solid #e2e8f0; font-weight:800; font-size:1rem; color:#020617;">
                            Historique des Transactions
                        </div>
                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
                                <thead>
                                    <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#64748b; font-weight:700;">
                                        <th style="padding:14px 20px;">Date</th>
                                        <th style="padding:14px 20px;">Description</th>
                                        <th style="padding:14px 20px;">Rôle</th>
                                        <th style="padding:14px 20px;">Montant</th>
                                        <th style="padding:14px 20px;">Part DTC</th>
                                        <th style="padding:14px 20px;">Statut</th>
                                        <th style="padding:14px 20px; text-align:right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${docs.length === 0 ? `
                                    <tr>
                                        <td colspan="7" style="padding:60px 20px; text-align:center; color:#94a3b8;">
                                            <div style="font-size:2.5rem; margin-bottom:16px; opacity:0.3;"><i class="fas fa-folder-open"></i></div>
                                            <div style="font-weight:700; color:#475569; margin-bottom:6px;">Aucune transaction</div>
                                            <div style="font-size:0.8rem;">Les demandes de paiement acceptées et en attente apparaîtront ici.</div>
                                        </td>
                                    </tr>
                                ` : docs.map(d => {
                                    const isExpert = d.expert_id === session.user.id;
                                    const date = new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                                    const amount = (d.total_amount || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                                    const commission = (d.total_amount * this.COMMISSION).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                                    
                                    let roleLabel = isExpert ? '<span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:700;">Prestataire</span>' : '<span style="background:#f3e8ff; color:#6b21a8; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:700;">Client</span>';
                                    
                                    let statusBadge = '';
                                    if (d.status === 'paid') {
                                        statusBadge = '<span style="background:#dcfce7; color:#15803d; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:800;">Payé</span>';
                                    } else if (d.status === 'sent' || d.status === 'draft') {
                                        statusBadge = '<span style="background:#fef3c7; color:#b45309; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:800;">En attente</span>';
                                    } else {
                                        statusBadge = '<span style="background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:800;">Annulé</span>';
                                    }

                                    let actionButton = '';
                                    if ((d.status === 'sent' || d.status === 'draft') && !isExpert) {
                                        const safeTitle = (d.project_title || 'Mission').replace(/'/g, "\\'");
                                        actionButton = `<button onclick="window.MessagesModule.payRequest('${safeTitle}', '${d.total_amount}', '${d.expert_id}', event)" style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:8px; font-weight:800; cursor:pointer; font-size:0.75rem;">Régler</button>`;
                                    }

                                    return `
                                        <tr style="border-bottom:1px solid #f1f5f9;">
                                            <td style="padding:14px 20px; font-weight:550; color:#475569;">${date}</td>
                                            <td style="padding:14px 20px; font-weight:700; color:#020617;">${d.project_title || 'Sans nom'}</td>
                                            <td style="padding:14px 20px;">${roleLabel}</td>
                                            <td style="padding:14px 20px; font-weight:800; color:#020617;">${amount}</td>
                                            <td style="padding:14px 20px; color:#94a3b8;">${isExpert ? commission : '-'}</td>
                                            <td style="padding:14px 20px;">${statusBadge}</td>
                                            <td style="padding:14px 20px; text-align:right;">${actionButton}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            `;
            // Populate the Missions tab asynchronously after DOM is ready
            this.renderMissions();
        } catch (e) {
            console.error("[BusinessModule] Error rendering view:", e);
            container.innerHTML = `<div style="padding:40px; color:#dc2626; font-weight:700;">Une erreur est survenue lors de la récupération de vos transactions : ${e.message}</div>`;
        }
    }
};

window.BusinessModule = BusinessModule;
