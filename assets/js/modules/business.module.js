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
                @media (max-width: 768px) {
                    .business-tab { padding: 8px 12px !important; font-size: 0.85rem !important; white-space: nowrap; }
                    .tracker-steps { flex-direction: column; }
                    .tracker-steps > div { width: 100%; min-width: 100% !important; margin-bottom: 12px; }
                    .business-header { flex-direction: column; align-items: flex-start !important; }
                    .business-header h2 { font-size: 1.3rem !important; }
                    .business-header > div { width: 100%; }
                    .business-header button { width: 100%; justify-content: center; }
                    .stats-grid { grid-template-columns: 1fr !important; }
                    .evolution-box { flex-direction: column; text-align: left; }
                    .evolution-stats { width: 100%; justify-content: space-between; }
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
                            <div style="text-align:right;">
                                <div style="font-size:1.5rem; font-weight:900; color:#0f172a;">${amount.toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</div>
                                <div style="font-size:0.8rem; font-weight:700; color:${isFullyPaid ? '#10b981' : '#f59e0b'}; background:${isFullyPaid ? '#f0fdf4' : '#fffbeb'}; display:inline-block; padding:4px 10px; border-radius:100px; margin-top:8px;">
                                    ${isFullyPaid ? 'Clôturé & Payé' : 'En cours'}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tracker Steps -->
                        <div class="tracker-steps" style="display:flex; gap:12px; background:#f8fafc; padding:16px; border-radius:12px; border:1px solid #e2e8f0;">
                            
                            <!-- Step 1: Validation -->
                            <div style="flex:1; min-width:200px; padding:16px; border-radius:12px; border:2px solid ${isSigned ? '#10b981' : '#cbd5e1'}; background:${isSigned ? '#f0fdf4' : 'white'}; position:relative;">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <div style="width:24px; height:24px; border-radius:50%; background:${isSigned ? '#10b981' : '#e2e8f0'}; color:${isSigned ? 'white' : '#64748b'}; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900;">1</div>
                                    <div style="font-weight:800; color:${isSigned ? '#065f46' : '#64748b'};">Devis Validé</div>
                                </div>
                                ${isSigned 
                                    ? `<div style="font-size:0.85rem; color:#059669; font-weight:700;"><i class="fas fa-file-signature"></i> Devis signé & joint</div>` 
                                    : `<button id="btn-sign-${doc.id}" onclick="BusinessModule.markSigned('${doc.id}')" style="width:100%; background:white; border:1px dashed #cbd5e1; padding:8px; border-radius:8px; font-weight:700; cursor:pointer; color:#0f172a; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-upload"></i> Joindre devis signé</button>`}
                            </div>

                            <!-- Step 2: Acompte -->
                            <div style="flex:1; min-width:200px; padding:16px; border-radius:12px; border:2px solid ${isAcomptePaid ? '#3b82f6' : '#cbd5e1'}; background:${isAcomptePaid ? '#eff6ff' : 'white'}; opacity:${isSigned ? '1' : '0.5'}; pointer-events:${isSigned ? 'auto' : 'none'}; position:relative;">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <div style="width:24px; height:24px; border-radius:50%; background:${isAcomptePaid ? '#3b82f6' : '#e2e8f0'}; color:${isAcomptePaid ? 'white' : '#64748b'}; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900;">2</div>
                                    <div style="font-weight:800; color:${isAcomptePaid ? '#1e40af' : '#64748b'};">Acompte Payé</div>
                                </div>
                                ${isAcomptePaid 
                                    ? `<div style="font-size:0.85rem; color:#1d4ed8; font-weight:700;"><i class="fas fa-receipt"></i> ${(doc.deposit_amount || 0).toLocaleString('fr-FR', {style:'currency', currency:'EUR'})} encaissés avec preuve</div>` 
                                    : `<div style="display:flex; flex-direction:column; gap:8px;">
                                        <div style="font-size:0.85rem; font-weight:700; color:#64748b;">Attendu : ${((amount * (doc.deposit_perc||30))/100).toLocaleString('fr-FR', {style:'currency', currency:'EUR'})} (${doc.deposit_perc||30}%)</div>
                                        <button id="btn-acompte-${doc.id}" onclick="BusinessModule.markAcompte('${doc.id}', ${(amount * (doc.deposit_perc||30))/100})" style="background:#0f172a; color:white; border:none; padding:8px 12px; border-radius:8px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-upload"></i> Preuve virement</button>
                                       </div>`}
                            </div>

                            <!-- Step 3: Solde -->
                            <div style="flex:1; min-width:200px; padding:16px; border-radius:12px; border:2px solid ${isFullyPaid ? '#10b981' : '#cbd5e1'}; background:${isFullyPaid ? '#f0fdf4' : 'white'}; opacity:${isAcomptePaid || isSigned ? '1' : '0.5'}; pointer-events:${isAcomptePaid || isSigned ? 'auto' : 'none'}; position:relative;">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <div style="width:24px; height:24px; border-radius:50%; background:${isFullyPaid ? '#10b981' : '#e2e8f0'}; color:${isFullyPaid ? 'white' : '#64748b'}; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900;">3</div>
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
                            <span>💬 Lancer un chat pour être payé</span>
                        </button>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div style="display:flex; gap:12px; margin-bottom:32px; border-bottom:2px solid #f1f5f9; padding-bottom:16px; overflow-x:auto;">
                    <button class="business-tab active" onclick="BusinessModule.switchTab('missions')" style="padding:10px 20px; border-radius:100px; border:none; font-weight:800; cursor:pointer; background:#020617; color:white;">💼 Mes Missions</button>
                    <button class="business-tab" onclick="BusinessModule.switchTab('devis')" style="padding:10px 20px; border-radius:100px; border:none; font-weight:800; cursor:pointer; background:#f1f5f9; color:#64748b;">🎯 Tracker Méthodo</button>
                    <button class="business-tab" onclick="BusinessModule.switchTab('evolution')" style="padding:10px 20px; border-radius:100px; border:none; font-weight:800; cursor:pointer; background:#f1f5f9; color:#64748b;">📈 Mon Évolution</button>
                </div>

                <!-- TAB CONTENT: MISSIONS -->
                <div id="tab-missions" class="business-tab-content" style="display:block;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                        <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:16px; padding:32px; text-align:center;">
                            <div style="font-size:2rem; margin-bottom:12px; color:#94a3b8;"><i class="fas fa-briefcase"></i></div>
                            <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0 0 8px;">Aucune mission active</h3>
                            <p style="color:#64748b; font-size:0.9rem; margin:0;">Explorez le fil d'actualité pour trouver des opportunités et y répondre.</p>
                            <button onclick="window.Router.navigate('#moments')" style="margin-top:16px; background:white; border:1px solid #e2e8f0; color:#0f172a; padding:8px 16px; border-radius:8px; font-weight:700; cursor:pointer;">Voir les opportunités</button>
                        </div>
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
                            <h3 style="font-size:clamp(1.5rem, 3vw, 2rem); font-weight:900; margin:0 0 12px;">Évolution de l'activité 🚀</h3>
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
                                            <div style="font-size:2.5rem; margin-bottom:16px; opacity:0.3;">💸</div>
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
                                        actionButton = `<button onclick="window.MessagesModule.payRequest('${d.project_title.replace(/'/g, "\\'")}', '${d.total_amount}', '${d.expert_id}', event)" style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:8px; font-weight:800; cursor:pointer; font-size:0.75rem;">💳 Régler</button>`;
                                    }

                                    return `
                                        <tr style="border-bottom:1px solid #f1f5f9; hover:background:#f8fafc;">
                                            <td style="padding:14px 20px; font-weight:550; color:#475569;">${date}</td>
                                            <td style="padding:14px 20px; font-weight:700; color:#020617;">${d.project_title}</td>
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
        } catch (e) {
            console.error("[BusinessModule] Error rendering view:", e);
            container.innerHTML = `<div style="padding:40px; color:#dc2626; font-weight:700;">Une erreur est survenue lors de la récupération de vos transactions : ${e.message}</div>`;
        }
    }
};

window.BusinessModule = BusinessModule;
