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
                    
                    <!-- Pack Épopée (STYLE PREMIUM IDENTIQUE ACCUEIL) -->
                    <div class="dash-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                         <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:32px;">
                            <div style="flex:1; min-width:300px;">
                                <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; text-transform:uppercase;">Lancez votre aventure</span>
                                <h3 style="font-size: 1.75rem; font-weight: 800; margin:16px 0 8px; color:#111827;">Pack Épopée</h3>
                                <div style="font-size: 2.2rem; font-weight: 800; margin-bottom: 24px; color:#111827;">0€ <span style="font-size: 1.1rem; font-weight: 500; color: #6b7280;">/ Gratuit</span></div>
                                
                                <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; display:grid; gap:12px;">
                                    <li style="font-size: 0.95rem; color: #374151; display:flex; align-items:center; gap:12px; font-weight:500;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Profil Projet dans l'annuaire</li>
                                    <li style="font-size: 0.95rem; color: #374151; display:flex; align-items:center; gap:12px; font-weight:500;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Mise en relation avec le réseau</li>
                                    <li style="font-size: 0.95rem; color: #374151; display:flex; align-items:center; gap:12px; font-weight:500;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Messagerie instantanée sécurisée</li>
                                </ul>
                            </div>
                            <div style="width:280px; text-align:center; display:flex; flex-direction:column; gap:16px;">
                                <button onclick="createNewSREProject()" class="cta-button primary" style="background:#111827; color:white; border:none; border-radius:14px; padding:18px; font-weight:900; font-size:1rem; width:100%; justify-content:center; box-shadow:0 10px 20px rgba(0,0,0,0.1); cursor:pointer;">DÉMARRER MON PROJET</button>
                                <p style="font-size:0.8rem; color:#64748b; font-weight:600;">Sans frais de dossier</p>
                            </div>
                        </div>
                    </div>

                    <!-- Mes Épopées Section -->
                    <div class="dash-card" style="border-radius: 20px; padding: 32px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                            <h3 style="font-size: 1.3rem; font-weight: 800; margin:0; color:#0f172a;">Mes Épopées actives</h3>
                            <button onclick="createNewSREProject()" class="cta-button secondary" style="font-size:0.75rem; padding:8px 16px; border-radius:10px;">+ Nouveau projet</button>
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
