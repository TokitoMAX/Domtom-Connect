/**
 * Owners Module - Domtom Connect
 * Gestion de l'écosystème Porteur de Projet / Épopée
 */
const OwnersModule = {
    /**
     * Dashboard Rendering Logic - Restauration Marque & Conversion Épopée
     */
    renderDashboard: (container, additional, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card (Projet Style) -->
                <div class="dash-card premium-dark" style="grid-column: span 12; padding: 48px; border-radius: 20px; background: #0f172a; border: 1px solid #1e293b;">
                    <div style="position: relative; z-index: 2;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Espace Porteur de Projet</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Épique'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; font-weight: 500; line-height:1.6;">Transformez votre idée en réussite. Le réseau Domtom Connect est à vos côtés.</p>
                    </div>
                </div>

                <!-- Main Content -->
                <div style="grid-column: span 8; display: grid; gap: 24px;">
                    
                    <!-- Mes Épopées Section -->
                    <div class="dash-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 800; margin:0; color:#0f172a; letter-spacing:-0.02em;">Mes Épopées actives</h3>
                                <p style="font-size:0.85rem; color:#64748b; margin-top:4px;">Gérez vos projets et suivez votre progression stratégique.</p>
                            </div>
                            <button onclick="createNewSREProject()" class="cta-button primary" style="background:#10b981; border:none; padding:12px 24px; border-radius:12px; font-weight:800; font-size:0.85rem;">
                                <i class="fas fa-plus" style="margin-right:8px;"></i> NOUVEAU PROJET
                            </button>
                        </div>
                        <div id="owners-projects-view">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 48px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600; font-size: 0.95rem;">Chargement de vos aventures en cours...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div style="grid-column: span 4; display: flex; flex-direction: column; gap: 24px;">
                    <div class="dash-card" style="border-radius: 16px; padding: 24px;">
                        <h4 style="font-size: 0.8rem; font-weight: 800; margin-bottom: 20px; text-transform:uppercase; color:#64748b; letter-spacing:0.05em;">L'Arsenal Commando</h4>
                        <p style="font-size: 0.85rem; color:#64748b; line-height:1.5; margin-bottom:20px;">Le Success Engine vous guide étape par étape pour certifier votre projet et lever des fonds.</p>
                        <a href="#success-engine" class="cta-button primary" style="background:#10b981; border:none; width:100%; justify-content:center; border-radius:10px; font-weight:800; text-decoration:none; color:white; display:flex;">Accéder au Cockpit</a>
                    </div>
                </div>
            </div>
        `;

        if (typeof loadOwnersProjects === 'function') loadOwnersProjects(session.user.id);
    },

    /**
     * UI Terminology - Restauration Sobriété Charte
     */
    initUI: () => {
        const labels = {
            'label-name': "Fondateur / Porteur de Projet",
            'label-title': "Votre rôle principal (ex: Fondateur, Architecte...)",
            'label-bio': "Manifeste de votre projet (Pitch court)",
            'label-logo': "Photo de profil (Inspirante)"
        };

        Object.entries(labels).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Hide/Show correct fields
        ['tjm-group', 'company-name-group', 'label-written-presentation', 'metrics-row', 'banner-card'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        const showList = ['video-presentation-group', 'portfolio-card', 'company-specific-fields'];
        showList.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = id === 'company-specific-fields' ? 'grid' : 'block';
        });

        console.log("OwnersModule: UI Aligned (Brand Style)");
    },
};

// Exporter pour usage global
window.OwnersModule = OwnersModule;
