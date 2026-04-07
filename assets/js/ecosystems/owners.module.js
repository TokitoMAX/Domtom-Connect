/**
 * Domtom Connect - Owners Ecosystem Module
 * Logic for Project Owners / Porteurs de Projet
 */
const OwnersModule = {
    role: 'user',

    /**
     * Dashboard Rendering Logic - Refonte Premium & Clarté
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;">
                
                <!-- Welcome Card (Premium Dark) -->
                <div class="dash-card premium-dark" style="grid-column: span 12; padding: 60px; border-radius: 40px; position: relative; overflow: hidden;">
                    <div style="position: relative; z-index: 2;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.2); color:#10b981; padding:6px 16px; border-radius:100px; font-size:0.75rem; font-weight:900; margin-bottom:20px; letter-spacing:0.05em; text-transform:uppercase;">Tableau de Bord Porteur</span>
                        <h1 style="font-size: 3.5rem; font-weight: 950; margin-bottom: 16px; letter-spacing: -0.05em; line-height:1;">${profile.full_name || 'Porteur d\'Épopée'}</h1>
                        <p style="font-size: 1.25rem; opacity: 0.8; max-width: 650px; font-weight: 500; line-height:1.6;">Propulsez votre projet. Utilisez nos outils pour structurer, valider et financer votre vision.</p>
                    </div>
                </div>

                <!-- Section 1: Propulsion & Stratégie -->
                <div style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    <!-- L'Épopée (Crowdfunding) -->
                    <div class="dash-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 900; margin:0; letter-spacing:-0.03em;">L'Épopée <span style="font-weight:400; color:var(--text-muted); font-size:0.9rem;">(Crowdfunding Territorial)</span></h3>
                                <p style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">Exposition publique et levée de fonds auprès de la communauté.</p>
                            </div>
                        </div>
                        <div id="owner-projects-quickview">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 40px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600;">Chargement de votre projet...</p>
                            </div>
                        </div>
                        <div style="margin-top: 24px; display: flex; gap: 12px;">
                            <a href="/epopee" class="cta-button primary" style="background: #000; color: white; border-radius: 12px; padding: 12px 24px; font-weight: 800; text-decoration: none;">Gérer mon Épopée</a>
                            <button onclick="createNewSREProject()" class="cta-button" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius: 12px; padding: 12px 24px; font-weight: 800;">+ Nouveau Projet</button>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                        <!-- Investisseurs (Marketing strategy only for now) -->
                        <div class="dash-card highlight">
                            <div style="width: 40px; height: 40px; background: #7c3aed; color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>
                            </div>
                            <h4 style="margin:0; font-size:1.1rem; font-weight:900;">Accès Investisseurs</h4>
                            <p style="font-size: 0.8rem; color: #64748b; margin-top: 8px; line-height:1.5;">Préparez votre dossier pour attirer les Business Angels. <br><strong>(Prochainement)</strong></p>
                        </div>

                        <!-- Bêta-testeurs -->
                        <div class="dash-card">
                            <div style="width: 40px; height: 40px; background: #10b981; color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                            </div>
                            <h4 style="margin:0; font-size:1.1rem; font-weight:900;">Bêta-testeurs</h4>
                            <p style="font-size: 0.8rem; color: #64748b; margin-top: 8px; line-height:1.5;">Recrutez les premiers testeurs pour valider votre prototype.</p>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Success Engine & Maturité -->
                <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
                    
                    <div class="dash-card" style="background: #fffbeb; border-color: #fde68a;">
                        <div style="width: 48px; height: 48px; background: #f59e0b; color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <h3 style="font-size: 1.25rem; font-weight: 850; margin-bottom: 8px;">Success Engine</h3>
                        <p style="font-size: 0.85rem; color: #92400e; margin-bottom: 20px; line-height: 1.6;">Le moteur de réussite : Cadrez votre vision pour convaincre.</p>
                        
                        <div style="background: white; padding: 24px; border-radius: 20px; border: 1px solid #fde68a; text-align:center;">
                            <div style="font-size: 0.7rem; font-weight: 900; color: #b45309; text-transform: uppercase; letter-spacing:0.05em; margin-bottom:8px;">Indice de Crédibilité</div>
                            <div style="font-size: 2.5rem; font-weight: 950; color: #f59e0b;" id="global-maturity-score">-- %</div>
                        </div>
                        
                        <button onclick="showView('success-engine')" class="cta-button primary" style="width: 100%; justify-content: center; background: #f59e0b; border: none; margin-top: 20px; border-radius:12px;">Optimiser mon Score</button>
                    </div>

                    <!-- Side Insight: Visibility Proof -->
                    <div class="dash-card" style="padding: 24px;">
                        <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 12px;">Portée de votre Épopée</h4>
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                            <span style="font-size:0.8rem; color:#64748b;">Vues sur 30j</span>
                            <span style="font-size:0.8rem; font-weight:800;">Calcul...</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:0.8rem; color:#64748b;">Favoris</span>
                            <span style="font-size:0.8rem; font-weight:800;">Calcul...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (typeof loadMyProjects === 'function') loadMyProjects(profile.id);
    },

    /**
     * UI Terminology & Field Management (Owner Style) - Clarification Pédagogique
     */
    initUI: () => {
        // Labels
        const labelName = document.getElementById('label-name');
        const labelTitle = document.getElementById('label-title');
        const labelBio = document.getElementById('label-bio');
        const labelLogo = document.getElementById('label-logo');

        if (labelName) labelName.textContent = "Nom Complet";
        if (labelTitle) labelTitle.textContent = "Rôle dans le projet";
        if (labelBio) labelBio.textContent = "Ma Vision (Pourquoi ce projet ?)";
        if (labelLogo) labelLogo.textContent = "Avatar personnel";

        // UI Controls
        const companyFields = ['tjm-group', 'company-specific-fields', 'metrics-row', 'banner-card'];
        companyFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        console.log("OwnersModule: UI Initialized (Owner Style)");
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
