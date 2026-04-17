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
            <div class="dashboard-grid role-owner-grid" style="display: grid; gap: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card (Projet Style) -->
                <div class="dash-card premium-dark" style="grid-column: 1/-1; border-radius: 20px; background: #0f172a; border: 1px solid #1e293b;">
                    <div style="position: relative; z-index: 2; padding: 40px;">
                        <span style="display:inline-block; background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Espace Porteur de Projet</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 12px; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Épique'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; font-weight: 500; line-height:1.6;">Transformez votre idée en réussite. Le réseau Domtom Connect est à vos côtés.</p>
                    </div>
                </div>

                <!-- Main Content (Arsenal Commando) -->
                <div class="dash-main-col" style="grid-column: span 1; display: grid; gap: 24px;">
                    <div class="dash-card premium-dark" style="background:#0f172a; border:1px solid #1e293b; border-radius:32px; padding:48px; box-shadow: 0 20px 40px -12px rgba(0,0,0,0.5);">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div style="max-width:500px;">
                                <h3 style="font-size: 2rem; font-weight: 900; margin:0; color:white; letter-spacing:-0.03em;">L'Arsenal Commando</h3>
                                <p style="font-size:1.1rem; color:#94a3b8; margin-top:12px; line-height:1.6; font-weight:500;">
                                    Vote Cockpit de réussite. Le **Success Engine** vous guide étape par étape pour certifier votre projet, lever des fonds et impacter votre territoire.
                                </p>
                                <a href="#success-engine" class="cta-button primary" style="background:#10b981; border:none; padding:18px 32px; border-radius:14px; font-weight:900; text-decoration:none; color:white; display:inline-flex; margin-top:32px; font-size:1.05rem;">
                                    Démarrer le Pilotage →
                                </a>
                            </div>
                            <div style="width:140px; height:140px; background:rgba(16,185,129,0.1); border-radius:24px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(16,185,129,0.2);">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar (Suivi des Épopées) -->
                <div class="dash-side-col" style="grid-column: span 1; display: flex; flex-direction: column; gap: 24px;">
                    <div class="dash-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:32px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
                        <div style="margin-bottom:24px;">
                            <h3 style="font-size: 1.2rem; font-weight: 800; margin:0; color:#0f172a;">Mes Épopées actives</h3>
                            <p style="font-size:0.8rem; color:#64748b; margin-top:4px;">Suivez vos financements & étapes.</p>
                        </div>
                        
                        <div id="owners-projects-view">
                            <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 24px; border-radius: 20px;">
                                <p style="color: #94a3b8; font-weight: 600; font-size: 0.85rem;">Chargement...</p>
                            </div>
                        </div>

                        <button onclick="openProjectModal()" class="cta-button secondary" style="width:100%; border-radius:12px; margin-top:24px; font-weight:800; justify-content:center;">
                            + NOUVEAU PROJET
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (session && session.user && typeof loadMyProjects === 'function') {
            loadMyProjects(session.user.id);
        }
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

        console.log("OwnersModule: Terminology Refined (Epopée Style)");
    },
};

// Exporter pour usage global
window.OwnersModule = OwnersModule;
