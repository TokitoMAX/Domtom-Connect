/**
 * BusinessModule - Domtom Connect
 * Devis professionnel → Signature client → Suivi missions
 * Schéma réel: expert_id, doc_type, items (JSONB), subtotal, commission_rate, commission_amount, total_amount
 */
const BusinessModule = {
    COMMISSION: 0.125, // 12.5% Domtom Connect
    activeTab: 'quotes',

    renderDashboard: async function(container) { await this.renderView(container); },

    renderView: async function(container) {
        if (!container) return;
        container.innerHTML = `<div style="text-align:center;padding:80px;font-family:'Plus Jakarta Sans',sans-serif;"><span class="loader"></span></div>`;

        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) { container.innerHTML = `<div style="padding:40px;color:#dc2626;">Non connecté.</div>`; return; }

        // Calcul des stats
        const { data: allDocs } = await window._supabase
            .from('business_docs').select('*').eq('expert_id', session.user.id);
        const docs = allDocs || [];
        const totalCA = docs.reduce((s, d) => s + (d.total_amount || 0), 0);
        const totalNet = totalCA * (1 - this.COMMISSION);
        const paidCount = docs.filter(d => d.status === 'paid').length;

        this.activeTab = localStorage.getItem('dtc_biz_tab') || 'quotes';

        container.innerHTML = `
        <div style="padding:clamp(20px,4vw,40px);font-family:'Plus Jakarta Sans',sans-serif;background:#fafafa;min-height:100vh;">

            <!-- Header -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
                <div>
                    <h1 style="font-size:2rem;font-weight:950;color:#020617;letter-spacing:-0.04em;margin:0;">Pilotage d'Activité</h1>
                    <p style="color:#64748b;font-weight:600;margin-top:6px;">Créez vos devis, suivez vos missions, encaissez vos revenus.</p>
                </div>
                <div style="display:flex;gap:20px;align-items:center;">
                    <a href="profile.html" id="biz-user-logo" style="width:60px;height:60px;border-radius:16px;background:white;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.03);text-decoration:none;" title="Gérer mon logo dans mon profil">
                        <span style="font-size:0.7rem;color:#94a3b8;font-weight:800;text-align:center;padding:4px;">Logo Pro</span>
                    </a>
                    <button onclick="BusinessModule.openEditor('quote')" style="background:#020617;color:white;border:none;padding:14px 28px;border-radius:12px;font-weight:950;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                        Nouveau Devis
                    </button>
                </div>
            </div>

            <!-- Stats -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:40px;">
                <div style="background:white;border:1px solid #e2e8f0;border-radius:20px;padding:28px;">
                    <div style="font-size:0.65rem;font-weight:950;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">CA Total HT</div>
                    <div style="font-size:2rem;font-weight:950;color:#020617;">${totalCA.toFixed(2)} €</div>
                </div>
                <div style="background:#020617;border-radius:20px;padding:28px;">
                    <div style="font-size:0.65rem;font-weight:950;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:12px;">Net Reversé Expert</div>
                    <div style="font-size:2rem;font-weight:950;color:#10b981;">${totalNet.toFixed(2)} €</div>
                    <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-top:6px;">Après 12.5% frais DTC</div>
                </div>
                <div style="background:white;border:1px solid #e2e8f0;border-radius:20px;padding:28px;">
                    <div style="font-size:0.65rem;font-weight:950;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">Missions Signées</div>
                    <div style="font-size:2rem;font-weight:950;color:#020617;">${paidCount}</div>
                </div>
            </div>

            <!-- Tabs -->
            <div style="background:white;border:1px solid #e2e8f0;border-radius:20px;padding:32px;">
                <div style="display:flex;gap:0;border-bottom:1px solid #f1f5f9;margin-bottom:28px;">
                    <button id="tab-btn-quotes" onclick="BusinessModule.switchTab('quotes')" style="border:none;background:none;padding:12px 24px;font-weight:950;cursor:pointer;font-family:inherit;font-size:0.9rem;border-bottom:3px solid ${this.activeTab==='quotes'?'#10b981':'transparent'};color:${this.activeTab==='quotes'?'#020617':'#94a3b8'};margin-bottom:-1px;">Devis</button>
                    <button id="tab-btn-invoices" onclick="BusinessModule.switchTab('invoices')" style="border:none;background:none;padding:12px 24px;font-weight:950;cursor:pointer;font-family:inherit;font-size:0.9rem;border-bottom:3px solid ${this.activeTab==='invoices'?'#10b981':'transparent'};color:${this.activeTab==='invoices'?'#020617':'#94a3b8'};margin-bottom:-1px;">Factures</button>
                    <button id="tab-btn-finances" onclick="BusinessModule.switchTab('finances')" style="border:none;background:none;padding:12px 24px;font-weight:950;cursor:pointer;font-family:inherit;font-size:0.9rem;border-bottom:3px solid ${this.activeTab==='finances'?'#10b981':'transparent'};color:${this.activeTab==='finances'?'#020617':'#94a3b8'};margin-bottom:-1px;">Finances & Commissions</button>
                </div>
                <div id="biz-content"></div>
            </div>
        </div>`;

        this.switchTab(this.activeTab);
        this.loadProfileLogo();
    },

    loadProfileLogo: async function() {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;
        const { data: profile } = await window._supabase.from('profiles').select('avatar_url, full_name, company').eq('id', session.user.id).single();
        const logoEl = document.getElementById('biz-user-logo');
        if (profile && logoEl) {
            if (profile.avatar_url) {
                logoEl.innerHTML = `<img src="${profile.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`;
            } else {
                const initials = (profile.company || profile.full_name || 'DC').slice(0, 2).toUpperCase();
                logoEl.innerHTML = `<span style="font-weight:900;color:#020617;font-size:1.2rem;">${initials}</span>`;
            }
        }
    },

    switchTab: async function(tab) {
        this.activeTab = tab;
        localStorage.setItem('dtc_biz_tab', tab);
        ['quotes','invoices','finances'].forEach(t => {
            const b = document.getElementById(`tab-btn-${t}`);
            if (!b) return;
            const active = t === tab;
            b.style.borderBottom = `3px solid ${active ? '#10b981' : 'transparent'}`;
            b.style.color = active ? '#020617' : '#94a3b8';
        });
        const el = document.getElementById('biz-content');
        if (!el) return;

        if (tab === 'finances') {
            this.renderFinances(el);
            return;
        }

        el.innerHTML = `<div style="text-align:center;padding:40px;"><span class="loader"></span></div>`;

        const { data: { session } } = await window._supabase.auth.getSession();
        const docType = tab === 'quotes' ? 'quote' : 'invoice';
        const { data, error } = await window._supabase
            .from('business_docs').select('*')
            .eq('expert_id', session.user.id)
            .eq('doc_type', docType)
            .order('created_at', { ascending: false });

        if (error) { el.innerHTML = `<div style="padding:20px;color:#dc2626;font-weight:800;">${error.message}</div>`; return; }
        this.renderList(el, data || []);
    },

    renderFinances: async function(el) {
        el.innerHTML = `<div style="text-align:center;padding:40px;"><span class="loader"></span></div>`;
        const { data: { session } } = await window._supabase.auth.getSession();
        
        const { data: docs } = await window._supabase.from('business_docs').select('total_amount, status').eq('expert_id', session.user.id);
        
        const paidDocs = docs ? docs.filter(d => d.status === 'paid') : [];
        const totalCA = paidDocs.reduce((s, d) => s + (d.total_amount || 0), 0);
        const totalComm = totalCA * this.COMMISSION;
        const totalNet = totalCA - totalComm;

        el.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:40px;">
            <div style="background:#f8fafc; padding:24px; border-radius:16px; border:1px solid #e2e8f0;">
                <div style="font-size:0.65rem; font-weight:950; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">CA Encaissé HT</div>
                <div style="font-size:1.8rem; font-weight:950; color:#020617;">${totalCA.toFixed(2)} €</div>
            </div>
            <div style="background:#fff1f2; padding:24px; border-radius:16px; border:1px solid #fecaca;">
                <div style="font-size:0.65rem; font-weight:950; color:#dc2626; text-transform:uppercase; margin-bottom:8px;">Part Plateforme (12.5%)</div>
                <div style="font-size:1.8rem; font-weight:950; color:#dc2626;">${totalComm.toFixed(2)} €</div>
            </div>
             <div style="background:#f0fdf4; padding:24px; border-radius:16px; border:1px solid #bbf7d0;">
                <div style="font-size:0.65rem; font-weight:950; color:#16a34a; text-transform:uppercase; margin-bottom:8px;">Votre Net Touché</div>
                <div style="font-size:1.8rem; font-weight:950; color:#16a34a;">${totalNet.toFixed(2)} €</div>
            </div>
        </div>
        <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; padding:32px;">
            <h4 style="margin:0 0 16px 0; font-weight:950; font-size:1.1rem; color:#020617;">Reversements & Portefeuille</h4>
            <p style="color:#64748b; font-size:0.9rem; line-height:1.6; margin-bottom:24px;">
                Dès qu'un client paye une facture ou un acompte, les fonds sont sécurisés par Domtom Connect. Votre part est automatiquement créditée sur votre portefeuille après déduction des frais de service.
            </p>
            <button onclick="BusinessModule.requestPayout(${totalNet})" style="width:100%; padding:20px; border-radius:12px; border:2px dashed #10b981; background:#f0fdf4; text-align:center; cursor:pointer; font-family:inherit; transition:all 0.2s;" onmouseenter="this.style.background='#dcfce7'" onmouseleave="this.style.background='#f0fdf4'">
                <span style="font-size:0.85rem; font-weight:800; color:#16a34a;">Demander un virement sur mon compte bancaire (Vers l'International ou Local) →</span>
            </button>
        </div>
        `;
    },

    renderList: function(el, docs) {
        if (!docs.length) {
            el.innerHTML = `
                <div style="text-align:center;padding:60px;border:2px dashed #e2e8f0;border-radius:16px;">
                    <div style="font-size:2.5rem;margin-bottom:16px;">📄</div>
                    <p style="font-weight:800;color:#64748b;margin:0 0 20px;">Aucun document pour l'instant.</p>
                    <button onclick="BusinessModule.openEditor('quote')" style="background:#020617;color:white;border:none;padding:12px 24px;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit;">Créer mon premier devis</button>
                </div>`;
            return;
        }

        const statusStyles = {
            draft:     { bg: '#f1f5f9', color: '#64748b', label: 'Brouillon' },
            sent:      { bg: '#dbeafe', color: '#1d4ed8', label: '✍️ Signé' },
            paid:      { bg: '#dcfce7', color: '#16a34a', label: '✅ Payé' },
            cancelled: { bg: '#fee2e2', color: '#dc2626', label: 'Annulé' }
        };

        el.innerHTML = `
        <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;min-width:600px;">
                <thead>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                        <th style="padding:10px 12px;font-size:0.65rem;color:#94a3b8;text-transform:uppercase;font-weight:950;text-align:left;">Document</th>
                        <th style="padding:10px 12px;font-size:0.65rem;color:#94a3b8;text-transform:uppercase;font-weight:950;text-align:left;">Client</th>
                        <th style="padding:10px 12px;font-size:0.65rem;color:#94a3b8;text-transform:uppercase;font-weight:950;text-align:left;">Statut</th>
                        <th style="padding:10px 12px;font-size:0.65rem;color:#94a3b8;text-transform:uppercase;font-weight:950;text-align:right;">HT</th>
                        <th style="padding:10px 12px;font-size:0.65rem;color:#94a3b8;text-transform:uppercase;font-weight:950;text-align:right;">Net Expert</th>
                        <th style="padding:10px 12px;"></th>
                    </tr>
                </thead>
                <tbody>
                    ${docs.map(d => {
                        const s = statusStyles[d.status] || statusStyles.draft;
                        const net = (d.total_amount || 0) * (1 - BusinessModule.COMMISSION);
                        return `
                        <tr onmouseenter="this.style.background='#fafafa'" onmouseleave="this.style.background=''" style="border-bottom:1px solid #f8fafc;cursor:default;">
                            <td style="padding:14px 12px;">
                                <div style="font-weight:950;color:#020617;">#${d.id.slice(0,8).toUpperCase()}</div>
                                <div style="font-size:0.7rem;color:#94a3b8;">${new Date(d.created_at).toLocaleDateString('fr-FR')}</div>
                            </td>
                            <td style="padding:14px 12px;">
                                <div style="font-weight:800;color:#020617;">${d.client_name}</div>
                                <div style="font-size:0.8rem;color:#64748b;">${d.project_title}</div>
                            </td>
                            <td style="padding:14px 12px;">
                                <span style="background:${s.bg};color:${s.color};font-size:0.65rem;font-weight:950;padding:4px 10px;border-radius:100px;white-space:nowrap;">${s.label}</span>
                            </td>
                            <td style="padding:14px 12px;text-align:right;font-weight:900;color:#020617;">${(d.total_amount||0).toFixed(2)} €</td>
                            <td style="padding:14px 12px;text-align:right;font-weight:900;color:#10b981;">${net.toFixed(2)} €</td>
                            <td style="padding:14px 12px;text-align:right;">
                                <div style="display:flex;gap:8px;justify-content:flex-end;">
                                    ${d.status === 'signed' ? `
                                        <button onclick="BusinessModule.requestPayment('${d.id}', ${d.total_amount})" title="Demander un acompte" style="background:#10b981;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                        </button>
                                    ` : ''}
                                    <button onclick="BusinessModule.copyLink('${d.id}')" title="Copier lien de signature" style="background:#f1f5f9;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                                    </button>
                                    <button onclick="BusinessModule.deleteDoc('${d.id}')" title="Supprimer" style="background:#fee2e2;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    },

    openEditor: function(type) {
        const el = document.getElementById('biz-content');
        if (!el) return;
        // Reset items array
        BusinessModule._items = [{ desc: '', qty: 1, price: 0 }];

        el.innerHTML = `
        <div>
            <h3 style="font-weight:950;color:#020617;font-size:1.4rem;margin-bottom:28px;">Nouveau Devis</h3>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
                <div>
                    <label style="display:block;font-size:0.65rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Mission / Prestation *</label>
                    <input id="f-title" type="text" placeholder="Ex: Audit stratégique territorial" style="width:100%;padding:14px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;background:white;box-sizing:border-box;">
                </div>
                <div>
                    <label style="display:block;font-size:0.65rem;font-weight:950;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Nom du client *</label>
                    <input id="f-client" type="text" placeholder="Ex: Mairie de Fort-de-France" style="width:100%;padding:14px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;background:white;box-sizing:border-box;">
                </div>
            </div>

            <!-- Lignes de prestation -->
            <div style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:20px;">
                <div style="background:#f8fafc;padding:12px 16px;display:grid;grid-template-columns:3fr 80px 100px 40px;gap:12px;">
                    <div style="font-size:0.65rem;font-weight:950;color:#94a3b8;text-transform:uppercase;">Description</div>
                    <div style="font-size:0.65rem;font-weight:950;color:#94a3b8;text-transform:uppercase;">Qté</div>
                    <div style="font-size:0.65rem;font-weight:950;color:#94a3b8;text-transform:uppercase;">Prix (€)</div>
                    <div></div>
                </div>
                <div id="lines-wrap" style="padding:12px 16px;display:flex;flex-direction:column;gap:10px;"></div>
                <div style="padding:8px 16px 16px;">
                    <button onclick="BusinessModule.addLine()" style="background:#f1f5f9;border:none;padding:8px 16px;border-radius:8px;font-weight:800;cursor:pointer;font-family:inherit;font-size:0.85rem;">+ Ajouter une ligne</button>
                </div>
            </div>

            <!-- Totaux -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:28px;">
                <div style="font-size:0.65rem;font-weight:950;color:#94a3b8;text-transform:uppercase;margin-bottom:16px;">Récapitulatif financier</div>
                
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-weight:700;color:#64748b;">
                    <span>Total de la mission (HT)</span>
                    <span id="preview-ht">0,00 €</span>
                </div>
                
                <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-weight:700;color:#ef4444;">
                    <span>Commission Plateforme (12.5%)</span>
                    <span id="preview-comm">- 0,00 €</span>
                </div>

                <div style="display:flex;justify-content:space-between;padding:16px;background:#020617;border-radius:10px;color:white;font-weight:950;font-size:1.1rem;">
                    <span>VOTRE NET FINAL</span>
                    <span id="preview-net">0,00 €</span>
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:12px;">
                <button onclick="BusinessModule.switchTab('quotes')" style="padding:12px 24px;border-radius:10px;border:1.5px solid #e2e8f0;background:white;font-weight:900;cursor:pointer;font-family:inherit;">Annuler</button>
                <button id="btn-save" onclick="BusinessModule.save('${type}')" style="padding:12px 28px;border-radius:10px;background:#020617;color:white;border:none;font-weight:950;cursor:pointer;font-family:inherit;">Enregistrer le Devis</button>
            </div>
        </div>`;

        this.renderLines();
    },

    _items: [],

    addLine: function() {
        this._items.push({ desc: '', qty: 1, price: 0 });
        this.renderLines();
    },

    removeLine: function(i) {
        this._items.splice(i, 1);
        this.renderLines();
    },

    renderLines: function() {
        const wrap = document.getElementById('lines-wrap');
        if (!wrap) return;
        wrap.innerHTML = this._items.map((item, i) => `
            <div style="display:grid;grid-template-columns:3fr 80px 100px 40px;gap:12px;align-items:center;">
                <input type="text" value="${item.desc}" placeholder="Description de la prestation..." onchange="BusinessModule._items[${i}].desc=this.value" style="padding:10px 12px;border-radius:8px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:600;width:100%;box-sizing:border-box;">
                <input type="number" value="${item.qty}" min="1" onchange="BusinessModule._items[${i}].qty=+this.value;BusinessModule.recalc()" style="padding:10px 8px;border-radius:8px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;width:100%;box-sizing:border-box;text-align:center;">
                <input type="number" value="${item.price}" min="0" step="0.01" onchange="BusinessModule._items[${i}].price=+this.value;BusinessModule.recalc()" style="padding:10px 8px;border-radius:8px;border:1.5px solid #e2e8f0;font-family:inherit;font-weight:700;width:100%;box-sizing:border-box;text-align:right;">
                <button onclick="BusinessModule.removeLine(${i})" style="background:#fee2e2;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#dc2626;font-size:1.2rem;">×</button>
            </div>`).join('');
        this.recalc();
    },

    recalc: function() {
        const total = this._items.reduce((s, i) => s + (i.qty * i.price), 0);
        const commAmt = total * this.COMMISSION;
        const net = total - commAmt;
        
        const ht = document.getElementById('preview-ht');
        const commEl = document.getElementById('preview-comm');
        const netEl = document.getElementById('preview-net');
        
        if (ht) ht.textContent = total.toFixed(2) + ' €';
        if (commEl) commEl.textContent = '- ' + commAmt.toFixed(2) + ' €';
        if (netEl) netEl.textContent = net.toFixed(2) + ' €';
    },

    save: async function(type) {
        const title = document.getElementById('f-title')?.value?.trim();
        const client = document.getElementById('f-client')?.value?.trim();
        if (!title || !client) { alert('Le titre et le nom du client sont requis.'); return; }

        const btn = document.getElementById('btn-save');
        btn.disabled = true; btn.textContent = 'Enregistrement...';

        const items = this._items.filter(i => i.desc || i.price > 0).map(i => ({
            description: i.desc, qty: i.qty, price: i.price, total: i.qty * i.price
        }));
        const subtotal = items.reduce((s, i) => s + i.total, 0);
        const commission = parseFloat((subtotal * this.COMMISSION).toFixed(2));

        const { data: { session } } = await window._supabase.auth.getSession();
        const { error } = await window._supabase.from('business_docs').insert({
            expert_id: session.user.id,
            project_title: title,
            client_name: client,
            doc_type: type,
            status: 'draft',
            items: JSON.stringify(items),
            subtotal: subtotal,
            commission_rate: this.COMMISSION * 100,
            commission_amount: commission,
            total_amount: subtotal,
            currency: 'EUR'
        });

        if (error) { alert('Erreur: ' + error.message); btn.disabled = false; btn.textContent = 'Enregistrer le Devis'; return; }
        this.switchTab('quotes');
    },

    copyLink: function(id) {
        const url = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + 'view-document.html?id=' + id;
        navigator.clipboard.writeText(url).catch(() => prompt('Copiez ce lien:', url));
        Swal.fire({ title: 'Lien copié !', text: 'Envoyez ce lien à votre client pour signature.', icon: 'success', timer: 2000, showConfirmButton: false });
    },

    requestPayment: async function(id, total) {
        const deposit = (total * 0.2).toFixed(2);
        const { value: choice } = await Swal.fire({
            title: 'Demander un paiement',
            html: `Vous allez envoyer une demande de paiement pour le devis <strong>#${id.slice(0,8).toUpperCase()}</strong>.<br><br>
                   Choisissez le montant à réclamer :`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: `Acompte 20% (${deposit} €)`,
            cancelButtonText: `Solde Total (${total.toFixed(2)} €)`,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#020617',
            footer: '<span style="font-size:0.7rem; color:#94a3b8;">La commission Domtom Connect sera déduite automatiquement du versement.</span>'
        });

        // choice is true for confirm (acompte), undefined/false for cancel/close (but here cancel is used for Full Amount)
        // Let's refine the logic for clearer choice
        if (choice === undefined) return; 

        const amount = choice ? deposit : total;
        const type = choice ? 'Acompte' : 'Solde';

        Swal.fire({
            title: 'Demande envoyée !',
            text: `Votre client a reçu un lien pour régler l'${type} (${amount} €).`,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
        });

        // Simulate update in DB
        await window._supabase.from('business_docs').update({ status: 'sent' }).eq('id', id);
        this.switchTab(this.activeTab);
    },

    requestPayout: async function(balance) {
        if (balance <= 0) {
            Swal.fire({ title: 'Solde insuffisant', text: 'Vous n\'avez pas encore de fonds disponibles pour un virement.', icon: 'warning', confirmButtonColor: '#020617' });
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Demande de Virement',
            html: `
                <div style="text-align:left;">
                    <p style="font-size:0.8rem; color:#64748b; margin-bottom:16px;">Montant disponible : <strong>${balance.toFixed(2)} €</strong></p>
                    <label style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">IBAN du compte bénéficiaire</label>
                    <input id="swal-iban" class="swal2-input" placeholder="FR76 ..." style="margin-top:8px; width:100%;">
                    
                    <label style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-top:16px; display:block;">BIC / SWIFT</label>
                    <input id="swal-bic" class="swal2-input" placeholder="XXXXFR2X" style="margin-top:8px; width:100%;">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Valider la demande',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#10b981',
            preConfirm: () => {
                const iban = document.getElementById('swal-iban').value;
                const bic = document.getElementById('swal-bic').value;
                if (!iban || !bic) {
                    Swal.showValidationMessage(`Veuillez renseigner toutes les informations bancaires.`);
                }
                return { iban: iban, bic: bic };
            }
        });

        if (formValues) {
            Swal.fire({
                title: 'Demande enregistrée !',
                text: `Votre virement de ${balance.toFixed(2)} € est en cours de traitement (Vérification Domtom Connect).`,
                icon: 'success',
                confirmButtonColor: '#10b981'
            });
            // Here you would typically insert a row into a 'payout_requests' table in Supabase
        }
    },

    deleteDoc: async function(id) {
        if (!confirm('Supprimer ce document définitivement ?')) return;
        await window._supabase.from('business_docs').delete().eq('id', id);
        this.switchTab(this.activeTab);
    }
};

window.BusinessModule = BusinessModule;
