/**
 * Standard Module - Domtom Connect
 * Écosystème "Explorateur" / Membre Basique
 * Un cockpit épuré pour la découverte et la gestion personnelle.
 */
const StandardModule = {
    /**
     * Rendu du Dashboard Explorateur
     */
    renderDashboard: async (container, additional, profile, session) => {
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-grid role-standard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- Welcome Card -->
                <div class="dash-card premium-dark" style="grid-column: 1 / -1; border-radius: 24px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; padding: 48px; position: relative; overflow: hidden;">
                    <div style="z-index: 2; position: relative;">
                        <span style="display:inline-block; background:rgba(255, 255, 255, 0.1); color:white; padding:6px 14px; border-radius:100px; font-size:0.75rem; font-weight:800; margin-bottom:20px; letter-spacing:0.04em; text-transform:uppercase;">Espace Explorateur</span>
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: white; margin: 0 0 16px 0; letter-spacing: -0.04em;">Bonjour, ${profile.full_name || 'Explorateur'}</h1>
                        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; line-height:1.6; margin:0;">Bienvenue sur votre centre de commandement personnel. Explorez le réseau et rejoignez des écosystèmes stratégiques.</p>
                    </div>
                </div>

                <!-- Main Column -->
                <div class="dash-main-col" style="grid-column: span 8; display: grid; gap: 32px;">
                    
                    <!-- UPGRADE Section -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; transition: all 0.3s ease;">
                            <div style="width:48px; height:48px; background:#f0fdf4; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #10b981;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Porteur de Projet</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Vous avez une ambition pour les territoires ? CrÃ©ez votre Ã©popÃ©e et trouvez des experts pour la rÃ©aliser.</p>
                            <a href="/profile" class="cta-button" style="display:inline-block; background:#0f172a; color:white; padding:12px 20px; border-radius:10px; font-weight:800; text-decoration:none; font-size:0.9rem;">Lancer mon projet</a>
                        </div>
                        
                        <div class="dash-card" style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0;">
                            <div style="width:48px; height:48px; background:#eff6ff; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color: #3b82f6;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-19a4 4 0 11-4 4 4 4 0 014-4zm6 19v-2a4 4 0 00-3-3.87m-4-12a4 4 0 014 4" /></svg>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin-bottom:12px;">Expert Territorial</h3>
                            <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px; line-height:1.5;">Proposez vos compÃ©tences aux entreprises et porteurs de projets internationaux.</p>
                            <a href="/profile" class="cta-button" style="display:inline-block; border:1px solid #e2e8f0; color:#0f172a; padding:12px 20px; border-radius:10px; font-weight:800; text-decoration:none; font-size:0.9rem; background:white;">Devenir Expert</a>
                        </div>
                    </div>

                    <!-- My Activity Placeholder -->
                    <div class="dash-card" style="border-radius: 24px; padding: 40px; background: white; border: 1px solid #e2e8f0; text-align:center;">
                        <h3 style="font-size: 1.5rem; font-weight: 950; color:#0f172a; margin-bottom:12px;">Vos Ã‰vÃ©nements & Billetterie</h3>
                        <p style="color:#64748b; margin-bottom:32px;">Vous n'avez pas encore d'Ã©vÃ©nements Ã  venir. DÃ©couvrez la Marketplace pour participer aux salons et webinaires.</p>
                        <a href="/marketplace/evenements.html" style="color:#10b981; font-weight:800; text-decoration:none; font-size:0.95rem;">Parcourir les Ã©vÃ©nements â†’</a>
                    </div>
                </div>

                <!-- Sidebar column -->
                <div class="dash-side-col" style="grid-column: span 4; display: flex; flex-direction: column; gap: 32px;">
                     <div class="dash-card" style="border-radius: 20px; padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 0.8rem; font-weight: 850; margin-bottom: 24px; text-transform:uppercase; color:#64748b; letter-spacing:0.04em;">Mon Compte</h4>
                        <div style="display:grid; gap:16px;">
                            <a href="/profile" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:#0f172a; font-weight:700; font-size:0.95rem;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Mon Profil
                            </a>
                            <a href="/messages" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:#0f172a; font-weight:700; font-size:0.95rem;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Messagerie
                            </a>
                        </div>
                    </div>

                    <div class="dash-card" style="border-radius: 20px; padding: 32px; background: white; border: 1px solid #e2e8f0;">
                        <p style="font-size:0.85rem; color:#64748b; line-height:1.6; margin:0;">
                            <strong>Besoin d'aide ?</strong><br>
                            Contactez notre support pour optimiser votre utilisation de Domtom Connect.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
};

window.StandardModule = StandardModule;
