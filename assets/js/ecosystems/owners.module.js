/**
 * Domtom Connect - Owners Ecosystem Module
 * Logic for Project Owners / Porteurs de Projet
 */
const OwnersModule = {
    role: 'user',

    /**
     * Dashboard Rendering Logic - Restauration Marque & Conversion Business
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        const isBusiness = profile.subscription_tier === 'business' || profile.subscription_tier === 'enterprise';

        container.innerHTML = `
            <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;">
                
                <!-- Welcome Card (Brand Style) -->
                <div class="dash-card premium-dark" style="grid-column: span 12; padding: 50px; border-radius: 20px;">
                    <div style="position: relative; z-index: 2;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.2); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.7rem; font-weight:900; margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Cockpit de Pilotage</span>
                        <h1 style="font-size: 2.8rem; font-weight: 950; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Porteur d\'Épopée'}</h1>
                        <p style="font-size: 1.1rem; opacity: 0.8; max-width: 600px; font-weight: 500; line-height:1.6;">Gérez votre projet, structurez votre vision et propulsez votre succès avec Domtom Connect.</p>
                    </div>
                </div>

                <!-- Main Section: Project & Success flow -->
                <div style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    <div class="dash-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
                            <div>
                                <h3 style="font-size: 1.3rem; font-weight: 950; margin:0; letter-spacing:-0.02em;">L'Épopée <span style="font-weight:400; color:#64748b; font-size:0.85rem;">(Crowdfunding Territorial)</span></h3>
                                <p style="color:#64748b; font-size:0.85rem; margin-top:4px;">Suivez l'exposition publique et la maturité de votre levée de fonds.</p>
                            </div>
                        </div>
                        <div id="owner-projects-quickview">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 40px; border-radius: 16px;">
                                <p style="color: #94a3b8; font-weight: 600;">Chargement de votre dossier...</p>
                            </div>
                        </div>
                        <div style="margin-top: 24px; display: flex; gap: 12px;">
                            <a href="/epopee" class="cta-button primary" style="background: #000; color: white; border-radius: 10px; padding: 12px 24px; font-weight: 800; text-decoration: none;">Voir mon Épopée</a>
                            <button onclick="createNewSREProject()" class="cta-button" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius: 10px; padding: 12px 24px; font-weight: 800; cursor:pointer;">+ Nouveau Projet</button>
                        </div>
                    </div>

                    <!-- CAS : PAYÉ -> CALENDLY BRIEFING -->
                    ${isBusiness ? `
                        <div class="dash-card highlight" style="background:#f0fdf4; border-color:#bbf7d0;">
                            <div class="dash-icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
                            <h4 style="margin:0; font-size:1.1rem; font-weight:900;">Optimisation & Briefing Contenu</h4>
                            <p style="font-size: 0.85rem; color: #166534; margin-top: 8px; line-height:1.5;">Votre Pack Business est actif. Planifiez votre séance de coaching stratégique et de création de contenu.</p>
                            <a href="https://calendly.com/domtomconnect/30min" target="_blank" class="cta-button primary" style="margin-top:20px; background:#10b981; border:none; border-radius:10px; justify-content:center; text-decoration:none;">Prendre RDV Briefing</a>
                        </div>
                    ` : `
                        <!-- CAS : GRATUIT -> TUNNEL PACK BUSINESS (STYLE HOME) -->
                        <div class="dash-card highlight">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div style="flex:1;">
                                    <span style="background: #000; color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.65rem; text-transform:uppercase;">Propulser mon Épopée</span>
                                    <h3 style="font-size: 1.4rem; font-weight: 950; margin:12px 0 8px;">Pack Business</h3>
                                    <div style="font-size: 1.8rem; font-weight: 950; margin-bottom: 16px;">490€ <span style="font-size: 0.9rem; font-weight: 500; color: #6b7280;">/ unique</span></div>
                                    <ul style="list-style: none; padding: 0; margin-bottom: 24px; display:grid; gap:8px;">
                                        <li style="font-size: 0.85rem; color: #374151; display:flex; align-items:center; gap:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Accompagnement stratégique (SRE)</li>
                                        <li style="font-size: 0.85rem; color: #374151; display:flex; align-items:center; gap:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Création de contenu & Interview</li>
                                        <li style="font-size: 0.85rem; color: #374151; display:flex; align-items:center; gap:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Mise en avant VIP (x10 visibilité)</li>
                                    </ul>
                                </div>
                                <div style="width:280px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:24px; text-align:center;">
                                    <div id="paypal-button-container-business"></div>
                                    <p style="font-size:0.65rem; color:#64748b; margin-top:12px;">Paiement sécurisé via PayPal</p>
                                </div>
                            </div>
                        </div>
                    `}
                </div>

                <!-- Success Engine Sidebar -->
                <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
                    
                    <div class="dash-card">
                        <h3 style="font-size: 1.1rem; font-weight: 850; margin-bottom: 8px;">Success Engine</h3>
                        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 20px; line-height: 1.5;">Le moteur de réussite : Structurez votre dossier pour convaincre les investisseurs.</p>
                        
                        <div style="background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; text-align:center;">
                            <div style="font-size: 0.65rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom:8px;">Indice de Crédibilité</div>
                            <div style="font-size: 2.2rem; font-weight: 950; color: #10b981;" id="global-maturity-score">-- %</div>
                        </div>
                        
                        <button onclick="showView('success-engine')" class="cta-button primary" style="width: 100%; justify-content: center; background: #000; border: none; margin-top: 20px; border-radius:10px; font-weight:800;">Améliorer mon dossier</button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr; gap:16px;">
                         <div class="dash-card" style="padding:20px; background:#f0fdf4; border-color:#dcfce7;">
                            <h4 style="font-size: 0.9rem; font-weight: 850; margin-bottom: 4px; color:#166534;">Recrutement Bêta-testeurs</h4>
                            <p style="font-size: 0.75rem; color:#166534; opacity:0.8;">Validez votre prototype auprès du réseau.</p>
                         </div>
                         <div class="dash-card" style="padding:20px; background:#f0fdf4; border-color:#dcfce7;">
                            <h4 style="font-size: 0.9rem; font-weight: 850; margin-bottom: 4px; color:#166534;">Portefeuille Investisseurs</h4>
                            <p style="font-size: 0.75rem; color:#166534; opacity:0.8;">Accès direct aux Business Angels.</p>
                         </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialiser PayPal si nécessaire
        if (!isBusiness) {
            setTimeout(() => {
                if (typeof renderPayPalButton === 'function') {
                    renderPayPalButton('P-6JG84131PK915684CNG3VDSQ', 'business', 'paypal-button-container-business');
                }
            }, 500);
        }

        if (typeof loadMyProjects === 'function') loadMyProjects(profile.id);
    },

    /**
     * UI Terminology & Field Management (Owner Style) - Restauration Sobriété Charte
     */
    initUI: () => {
        const labels = {
            'label-name': "Nom Complet",
            'label-title': "Rôle dans le projet",
            'label-bio': "Ma Vision (Pourquoi ce projet ?)",
            'label-logo': "Avatar personnel"
        };

        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Hide non-owner fields
        ['tjm-group', 'company-specific-fields', 'metrics-row', 'banner-card'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        console.log("OwnersModule: UI Aligned (Brand Style)");
    },

    getPublicMeta: (p) => ({
        nameHtml: p.full_name || 'Porteur de Projet',
        title: p.title || 'Propulseur d\'Épopée',
        roleLabel: 'Porteur de Projet',
        roleClass: 'owner',
        type: 'user'
    }),

    calculateMaturity: (p) => {
        let score = 0;
        let total = 6;
        if (p.vision) score++;
        if (p.mission) score++;
        if (p.equipe) score++;
        if (p.impact_local) score++;
        if (p.funding_goal > 0) score++;
        if (p.verification_status === 'verified' || p.verification_status === 'approved') score++;
        return Math.round((score / total) * 100);
    }
};

window.OwnersModule = OwnersModule;
 OwnersModule;
