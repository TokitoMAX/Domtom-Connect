/**
 * Domtom Connect - Business Module
 * Handle Quoting (Devis) and Invoicing (Facturation) logic.
 */
const BusinessModule = {
    commissionRate: 0.12, // 12% par défaut
    currentItems: [],
    currentType: 'quote', // 'quote' or 'invoice'
    currentDocId: null,

    renderView: async (container) => {
        if (!container) return;

        container.innerHTML = `
            <div class="business-container" style="padding: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                <div class="dash-section-header" style="margin-bottom: 32px; display:flex; justify-content:space-between; align-items:flex-end;">
                    <div>
                        <h2 class="dash-title" style="margin: 0;">Gestion des Devis & Factures</h2>
                        <p class="dash-subtitle" style="margin: 8px 0 0 0;">Gérez vos finances et vos dossiers clients en toute simplicité.</p>
                    </div>
                    <div style="display:flex; gap: 12px;">
                        <button onclick="BusinessModule.createNewDoc('quote')" class="cta-button primary" style="background:#10b981; border:none; border-radius:12px; font-weight:800; padding:12px 24px;">+ Nouveau Devis</button>
                        <button onclick="BusinessModule.createNewDoc('invoice')" class="cta-button secondary" style="border-radius:12px; font-weight:800; padding:12px 24px; color:#10b981; border-color:#10b981;">+ Nouvelle Facture</button>
                    </div>
                </div>

                <div id="business-main-content">
                    <div class="loading-state" style="text-align:center; padding: 40px;">
                        <span class="loader"></span>
                        <p>Chargement de vos documents...</p>
                    </div>
                </div>
            </div>
        `;

        await BusinessModule.loadHistory();
    },

    loadHistory: async () => {
        const content = document.getElementById('business-main-content');
        if (!content) return;

        try {
            // Utilisation du client global _supabase et vérification de l'existence du module auth
            if (typeof _supabase === 'undefined' || !_supabase.auth) {
                throw new Error("Client Supabase non initialisé");
            }

            const { data: { user } } = await _supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            const { data, error } = await _supabase
                .from('business_docs')
                .select('*')
                .eq('expert_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                content.innerHTML = `
                    <div class="dash-card" style="padding: 60px; text-align: center; border: 2px dashed #f1f5f9; border-radius: 24px;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">💼</div>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Prêt à collaborer ?</h3>
                        <p style="color: #64748b; margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto;">Créez votre premier document professionnel pour un client et sécurisez votre mission.</p>
                        <div style="display:flex; gap:12px; justify-content:center;">
                            <button onclick="BusinessModule.createNewDoc('quote')" class="cta-button secondary" style="border-radius:10px;">Créer un devis</button>
                            <button onclick="BusinessModule.createNewDoc('invoice')" class="cta-button ghost" style="border-radius:10px;">Créer une facture</button>
                        </div>
                    </div>
                `;
                return;
            }

            content.innerHTML = `
                <div class="history-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    ${data.map(doc => `
                        <div class="dash-card doc-card" onclick="BusinessModule.editDoc('${doc.id}')" style="padding: 24px; cursor: pointer; transition: 0.3s; position: relative; border: 1px solid #f1f5f9;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                                <span style="font-size: 0.7rem; background: ${doc.doc_type === 'invoice' ? '#fef3c7' : '#dcfce7'}; color: ${doc.doc_type === 'invoice' ? '#92400e' : '#166534'}; padding: 4px 10px; border-radius: 20px; font-weight: 800; text-transform: uppercase;">
                                    ${doc.doc_type === 'invoice' ? 'Facture' : 'Devis'}
                                </span>
                                <span style="font-size: 0.75rem; color: #94a3b8;">${new Date(doc.created_at).toLocaleDateString()}</span>
                            </div>
                            <h4 style="margin: 0 0 8px 0; font-weight: 800; color: #0f172a;">${doc.client_name}</h4>
                            <p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #64748b;">${doc.project_title}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; pt: 16px; margin-top: 16px;">
                                <span style="font-weight: 800; color: #0f172a;">${doc.total_amount.toFixed(2)}€</span>
                                <span style="font-size: 0.7rem; color: #10b981; font-weight: 700;">Statut: ${doc.status}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (err) {
            console.error("Erreur historique:", err);
            
            // Gestion spécifique si la table n'existe pas encore (Supabase Code 42P01)
            if (err.code === '42P01') {
                content.innerHTML = `
                    <div style="text-align:center; padding: 40px; background: #fff7ed; border: 1px dashed #fb923c; border-radius: 20px;">
                        <h3 style="color: #9a3412; font-size: 1.1rem; font-weight: 800; margin-bottom: 12px;">Configuration Requise</h3>
                        <p style="color: #c2410c; font-size: 0.9rem; max-width: 500px; margin: 0 auto 20px;">
                            Le module Business n'est pas encore activé sur votre base de données. 
                            Veuillez exécuter le script <strong>setup_business_persistence.sql</strong> dans votre console Supabase.
                        </p>
                        <button onclick="BusinessModule.createNewDoc('quote')" class="cta-button primary" style="background:#fb923c; border:none;">Tester l'Éditeur</button>
                    </div>
                `;
            } else {
                content.innerHTML = `<p style="color:red; text-align:center;">Erreur lors du chargement de l'historique : ${err.message}</p>`;
            }
        }
    },

    createNewDoc: (type = 'quote') => {
        BusinessModule.currentDocId = null;
        BusinessModule.currentType = type;
        BusinessModule.currentItems = [{ id: Date.now(), description: '', quantity: 1, price: 0 }];
        BusinessModule.renderEditor();
    },

    editDoc: async (id) => {
        try {
            const { data, error } = await supabase
                .from('business_docs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            BusinessModule.currentDocId = data.id;
            BusinessModule.currentType = data.doc_type;
            BusinessModule.currentItems = data.items;
            
            BusinessModule.renderEditor();
            
            // Post-render update values
            setTimeout(() => {
                document.getElementById('quote-client-name').value = data.client_name;
                document.getElementById('quote-project-title').value = data.project_title;
            }, 10);

        } catch (err) {
            console.error("Erreur édit:", err);
            Swal.fire('Erreur', 'Impossible de charger ce document.', 'error');
        }
    },

    renderEditor: () => {
        const content = document.getElementById('business-main-content');
        const isInvoice = BusinessModule.currentType === 'invoice';
        
        content.innerHTML = `
            <div class="quote-editor" style="background: white; border-radius: 20px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                    <div>
                        <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0;">${isInvoice ? 'Édition de Facture' : 'Édition de Devis'}</h2>
                        <span style="font-size: 0.75rem; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-weight: 800; margin-top: 8px; display:inline-block;">BROWSER SYNC ON</span>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button onclick="BusinessModule.saveDoc()" class="cta-button primary" style="background:#6366f1;">Sauvegarder</button>
                        ${!isInvoice ? `<button onclick="BusinessModule.convertToInvoice()" class="cta-button ghost" style="color:#6366f1; border-color:#6366f1;">Convertir en Facture</button>` : ''}
                        <button onclick="BusinessModule.renderView(document.getElementById('business-view'))" class="cta-button ghost" style="color: #ef4444;">Fermer</button>
                    </div>
                </div>

                <!-- Infos Client/Mission (Context) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
                    <div class="form-group">
                        <label style="display:block; font-size:0.7rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Client / Entreprise</label>
                        <input type="text" id="quote-client-name" placeholder="Nom du client" class="input-modern" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px;">
                    </div>
                    <div class="form-group">
                        <label style="display:block; font-size:0.7rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Intitulé de la Mission</label>
                        <input type="text" id="quote-project-title" placeholder="ex: Refonte Site Web" class="input-modern" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px;">
                    </div>
                </div>

                <!-- Lignes -->
                <div id="quote-items-container" style="margin-bottom: 32px;">
                    <div style="display: grid; grid-template-columns: 3fr 1fr 1.5fr 40px; gap: 16px; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                        <span style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Description</span>
                        <span style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Qté / Jours</span>
                        <span style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Prix Unitaire (€)</span>
                        <span></span>
                    </div>
                    <div id="quote-items-list">
                        ${BusinessModule.renderItemsList()}
                    </div>
                    <button onclick="BusinessModule.addItem()" class="cta-button secondary" style="width: 100%; margin-top: 16px; font-size: 0.85rem; border-style: dashed;">+ Ajouter une ligne</button>
                </div>

                <!-- Totaux & Commission -->
                <div style="max-width: 400px; margin-left: auto; background: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9;">
                    <div id="quote-summary">
                        ${BusinessModule.renderSummary()}
                    </div>
                    <button onclick="BusinessModule.exportPDF()" class="cta-button primary" style="width: 100%; margin-top: 24px; background: #111827;">Générer le PDF</button>
                </div>
            </div>
        `;
    },

    saveDoc: async () => {
        const clientName = document.getElementById('quote-client-name').value;
        const projectTitle = document.getElementById('quote-project-title').value;

        if (!clientName || !projectTitle) {
            Swal.fire('Oups', 'Veuillez remplir le nom du client et l\'intitulé de la mission.', 'warning');
            return;
        }

        const { subtotal, commission, total } = BusinessModule.calculateTotals();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            const docData = {
                expert_id: user.id,
                client_name: clientName,
                project_title: projectTitle,
                doc_type: BusinessModule.currentType,
                items: BusinessModule.currentItems,
                subtotal: subtotal,
                commission_amount: commission,
                total_amount: total,
                status: 'draft'
            };

            let res;
            if (BusinessModule.currentDocId) {
                res = await supabase.from('business_docs').update(docData).eq('id', BusinessModule.currentDocId);
            } else {
                res = await supabase.from('business_docs').insert([docData]).select();
                if (res.data && res.data[0]) BusinessModule.currentDocId = res.data[0].id;
            }

            if (res.error) throw res.error;

            Swal.fire({
                title: 'Enregistré !',
                text: 'Votre document est sauvegardé dans le cloud.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

        } catch (err) {
            console.error("Erreur sauvegarde:", err);
            Swal.fire('Erreur', 'Impossible de sauvegarder le document.', 'error');
        }
    },

    convertToInvoice: () => {
        BusinessModule.currentType = 'invoice';
        BusinessModule.renderEditor();
    },

    addItem: () => {
        BusinessModule.currentItems.push({ id: Date.now(), description: '', quantity: 1, price: 0 });
        BusinessModule.updateUI();
    },

    removeItem: (id) => {
        BusinessModule.currentItems = BusinessModule.currentItems.filter(item => item.id !== id);
        if (BusinessModule.currentItems.length === 0) BusinessModule.addItem();
        BusinessModule.updateUI();
    },

    updateItem: (id, field, value) => {
        const item = BusinessModule.currentItems.find(i => i.id === id);
        if (item) {
            item[field] = field === 'description' ? value : parseFloat(value) || 0;
            BusinessModule.updateSummary();
        }
    },

    renderItemsList: () => {
        return BusinessModule.currentItems.map(item => `
            <div style="display: grid; grid-template-columns: 3fr 1fr 1.5fr 40px; gap: 16px; margin-bottom: 12px; align-items: center;">
                <input type="text" value="${item.description}" oninput="BusinessModule.updateItem(${item.id}, 'description', this.value)" placeholder="Détail de la prestation" style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem;">
                <input type="number" value="${item.quantity}" oninput="BusinessModule.updateItem(${item.id}, 'quantity', this.value)" style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem;">
                <input type="number" value="${item.price}" oninput="BusinessModule.updateItem(${item.id}, 'price', this.value)" style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-weight: 700;">
                <button onclick="BusinessModule.removeItem(${item.id})" style="background:none; border:none; color:#ef4444; font-size: 1.2rem; cursor:pointer;">×</button>
            </div>
        `).join('');
    },

    updateUI: () => {
        const list = document.getElementById('quote-items-list');
        if (list) list.innerHTML = BusinessModule.renderItemsList();
        BusinessModule.updateSummary();
    },

    calculateTotals: () => {
        const subtotal = BusinessModule.currentItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const commission = subtotal * BusinessModule.commissionRate;
        const total = subtotal; 
        return { subtotal, commission, total };
    },

    updateSummary: () => {
        const summary = document.getElementById('quote-summary');
        if (summary) summary.innerHTML = BusinessModule.renderSummary();
    },

    renderSummary: () => {
        const { subtotal, commission, total } = BusinessModule.calculateTotals();
        return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; color: #475569;">
                <span>Total HT</span>
                <span style="font-weight: 700;">${subtotal.toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; color: #7c3aed;">
                <span>Commission DC (12%)</span>
                <span style="font-weight: 700;">- ${commission.toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; font-size: 1.1rem; color: #0f172a;">
                <span style="font-weight: 800;">Net Expert Estimé</span>
                <span style="font-weight: 900; color: #10b981;">${(subtotal - commission).toFixed(2)}€</span>
            </div>
        `;
    },

    exportPDF: () => {
        const client = document.getElementById('quote-client-name').value || 'Sans Nom';
        const project = document.getElementById('quote-project-title').value || 'Mission';
        const isInvoice = BusinessModule.currentType === 'invoice';
        const { subtotal, commission, total } = BusinessModule.calculateTotals();

        const element = document.createElement('div');
        element.style.padding = '40px';
        element.style.color = '#111827';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        
        element.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px;">
                <div>
                    <h1 style="margin:0; font-size: 28px; letter-spacing: -1px; font-weight:900;">DOMTOM CONNECT</h1>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Expertise Territoriale & Diaspora</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin:0; font-size: 22px; color: ${isInvoice ? '#111827' : '#3b82f6'};">${isInvoice ? 'FACTURE' : 'DEVIS'}</h2>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color:#64748b;">N° ${isInvoice ? 'F' : 'D'}-${Date.now().toString().slice(-6)}</p>
                    <p style="margin: 2px 0 0 0; font-size: 11px; color:#64748b;">Date: ${new Date().toLocaleDateString('fr-FR')}</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px;">
                <div>
                    <h3 style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">ÉMETTEUR :</h3>
                    <p style="margin: 0; font-weight: 700; font-size: 14px;">${window.userProfile?.full_name || 'Expert Domtom Connect'}</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color:#475569;">${window.userProfile?.title || 'Partenaire Certifié'}</p>
                </div>
                <div>
                    <h3 style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">DESTINATAIRE :</h3>
                    <p style="margin: 0; font-weight: 700; font-size: 14px;">${client}</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color:#475569;">Objet: ${project}</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 60px;">
                <thead>
                    <tr style="border-bottom: 2px solid #e1e8f0; text-align: left;">
                        <th style="padding: 15px 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Description</th>
                        <th style="padding: 15px 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; text-align: center;">Qté</th>
                        <th style="padding: 15px 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; text-align: right;">Prix Unitaire</th>
                        <th style="padding: 15px 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${BusinessModule.currentItems.map(item => `
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 20px 0; font-size: 13px; font-weight: 500;">${item.description}</td>
                            <td style="padding: 20px 0; font-size: 13px; text-align: center; color:#475569;">${item.quantity}</td>
                            <td style="padding: 20px 0; font-size: 13px; text-align: right; color:#475569;">${item.price.toFixed(2)}€</td>
                            <td style="padding: 20px 0; font-size: 13px; font-weight: 700; text-align: right;">${(item.quantity * item.price).toFixed(2)}€</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="width: 280px; margin-left: auto; background:#f8fafc; padding:20px; border-radius:12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 13px; font-weight: 600; color:#64748b;">Total HT</span>
                    <span style="font-size: 13px; font-weight: 800;">${subtotal.toFixed(2)}€</span>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
                    <span style="font-size: 16px; font-weight: 900;">TOTAL À PAYER</span>
                    <span style="font-size: 16px; font-weight: 950; color: #10b981;">${subtotal.toFixed(2)}€</span>
                </div>
            </div>

            <div style="margin-top: 80px; padding-top: 40px; border-top: 1px solid #f1f5f9; font-size: 10px; color: #94a3b8; text-align: center; line-height: 1.6;">
                <p>Domtom Connect - Tiers de Confiance Territoriale. <br> 
                   ${isInvoice ? 'Paiement à effectuer via la plateforme Domtom Connect.' : 'Ce devis est valable 30 jours à compter de sa date d\'émission.'} <br>
                   Document généré électroniquement par le module Business Domtom Connect.</p>
            </div>
        `;

        document.body.appendChild(element);

        const opt = {
            margin: 0,
            filename: `${isInvoice ? 'Facture' : 'Devis'}_${client.replace(/\s/g, '_')}_${Date.now().toString().slice(-4)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            document.body.removeChild(element);
            Swal.fire('Document prêt !', `Votre ${isInvoice ? 'facture' : 'devis'} a été téléchargée au format PDF.`, 'success');
        });
    }
};

window.BusinessModule = BusinessModule;
