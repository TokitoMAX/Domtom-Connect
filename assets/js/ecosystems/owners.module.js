/**
 * Domtom Connect - Owners Ecosystem Module
 * Logic for Project Owners / Porteurs de Projet
 */
const OwnersModule = {
    role: 'user',

    /**
     * Dashboard Rendering Logic
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid">
                <!-- Welcome Card -->
                <div class="dash-card welcome-card" style="grid-column: span 12; background: linear-gradient(135.46deg, #000000 0%, #1a1a1a 100%); color: white; padding: 48px; border-radius: 32px; position: relative; overflow: hidden;">
                    <div style="position: relative; z-index: 2;">
                        <h1 style="font-size: 3rem; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Porteur d\'Épopée'}</h1>
                        <p style="font-size: 1.1rem; opacity: 0.8; max-width: 600px; font-weight: 500;">Propulsez votre projet vers le succès. Gérez votre roadmap, vos financements et vos talents.</p>
                    </div>
                </div>

                <!-- Project Quick Access -->
                <div class="dash-card" style="grid-column: span 8; padding: 32px; border-radius: 24px;">
                    <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 24px;">Votre Épopée Actuelle</h3>
                    <div id="owner-projects-quickview">
                        <div style="text-align: center; border: 2px dashed #e2e8f0; padding: 40px; border-radius: 20px;">
                            <p style="color: #64748b; font-weight: 600;">Chargement de vos projets...</p>
                        </div>
                    </div>
                    <div style="margin-top: 32px; display: flex; gap: 16px;">
                        <a href="/epopee" class="cta-button primary" style="background: #000; color: white; border-radius: 12px; padding: 16px 32px; font-weight: 800; text-decoration: none;">Gérer mon Épopée</a>
                        <button onclick="createNewSREProject()" class="cta-button secondary" style="border-radius: 12px; padding: 16px 32px; font-weight: 800;">+ Nouveau Projet</button>
                    </div>
                </div>

                <!-- Success Engine Insights -->
                <div class="dash-card" style="grid-column: span 4; padding: 32px; border-radius: 24px; background: #fffbeb; border: 1px solid #fef3c7;">
                    <div style="width: 48px; height: 48px; background: #f59e0b; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Success Engine</h3>
                    <p style="font-size: 0.95rem; color: #92400e; margin-bottom: 24px; line-height: 1.6;">Utilisez notre framework pour structurer votre pitch et convaincre les investisseurs territoriaux.</p>
                    <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid #fde68a;">
                        <div style="font-size: 0.75rem; font-weight: 800; color: #92400e; text-transform: uppercase;">Maturité Moyenne</div>
                        <div style="font-size: 1.5rem; font-weight: 900; color: #f59e0b;" id="global-maturity-score">-- %</div>
                    </div>
                </div>
            </div>
        `;
        
        // Delegate project loading back to core-orchestrator if needed, or handle locally
        if (typeof loadMyProjects === 'function') loadMyProjects(profile.id);
    },

    /**
     * UI Terminology & Field Management (Owner Style)
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

        // Placeholders
        const inputTitle = document.getElementById('title');
        const inputBio = document.getElementById('bio');
        if (inputTitle) inputTitle.placeholder = "Ex : Fondateur, CEO, Directeur Artistique...";
        if (inputBio) inputBio.placeholder = "Décrivez brièvement ce qui vous motive et votre vision du projet.";

        // UI Controls
        const companyNameGroup = document.getElementById('company-name-group');
        if (companyNameGroup) companyNameGroup.style.display = 'none';

        // Layout blocks
        const tjmGroup = document.getElementById('tjm-group');
        const videoGroup = document.getElementById('video-presentation-group');
        const portfolioCard = document.getElementById('portfolio-card');
        const companyFields = document.getElementById('company-specific-fields');

        if (tjmGroup) tjmGroup.style.display = 'none';
        if (videoGroup) videoGroup.style.display = 'none';
        if (portfolioCard) portfolioCard.style.display = 'none';
        if (companyFields) companyFields.style.display = 'none';

        // Metrics & Banners
        const metricsRow = document.getElementById('metrics-row');
        const bannerCard = document.getElementById('banner-card');
        if (metricsRow) metricsRow.style.display = 'none';
        if (bannerCard) bannerCard.style.display = 'none';

        console.log("OwnersModule: UI Initialized (Owner Style)");
    },

    /**
     * Public Profile Meta Generation
     */
    getPublicMeta: (profileData) => {
        return {
            nameHtml: profileData.full_name || 'Porteur de Projet',
            title: profileData.title || 'Propulseur d\'Épopée',
            roleLabel: 'Porteur de Projet',
            roleClass: 'owner',
            type: 'user'
        };
    },

    /**
     * Calculation of maturity for a specific project
     */
    calculateMaturity: (p) => {
        let score = 0;
        let total = 6; // Number of steps or key fields

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
