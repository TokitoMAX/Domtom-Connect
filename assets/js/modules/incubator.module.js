/**
 * IncubatorModule.js - Domtom Connect
 * Présentation et Landing Page interne pour l'Incubateur
 */

window.IncubatorModule = {
    async route(viewId, container, profile, session, params) {
        if (viewId !== 'incubator') return;
        this.renderLandingPage(container);
    },

    renderLandingPage(container) {
        container.innerHTML = `
            <style>
                .incubator-landing {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: clamp(30px, 5vw, 60px);
                    max-width: 1200px;
                    width: clamp(90%, 95vw, 100%);
                    margin: 20px auto;
                    color: #fff;
                    background: #0c100e;
                    border-radius: 32px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    position: relative;
                    overflow: hidden;
                }
                .incubator-landing::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 50%);
                    pointer-events: none;
                }
                .hero-section {
                    text-align: center;
                    padding: 40px 20px;
                    position: relative;
                    z-index: 1;
                    margin-bottom: 20px;
                }
                .hero-title {
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    font-weight: 900;
                    margin-bottom: 24px;
                    line-height: 1.1;
                    color: #ffffff;
                }
                .hero-title span {
                    background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-subtitle {
                    font-size: 1.15rem;
                    color: #a7b0ac;
                    max-width: 650px;
                    margin: 0 auto 40px auto;
                    line-height: 1.6;
                }
                .cta-button {
                    display: inline-block;
                    background: #10b981;
                    color: white;
                    padding: 18px 36px;
                    border-radius: 100px;
                    font-weight: 800;
                    font-size: 1.1rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
                }
                .cta-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 35px -5px rgba(16, 185, 129, 0.5);
                    background: #059669;
                    color: white;
                }
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    margin-top: 40px;
                    position: relative;
                    z-index: 1;
                }
                .feature-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 32px;
                    border-radius: 24px;
                    transition: transform 0.3s ease;
                }
                .feature-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                }
                .feature-icon {
                    font-size: 2.5rem;
                    color: #10b981;
                    margin-bottom: 20px;
                }
                .feature-title {
                    font-size: 1.3rem;
                    font-weight: 800;
                    margin-bottom: 12px;
                    color: #ffffff;
                }
                .feature-text {
                    color: #a7b0ac;
                    line-height: 1.6;
                    font-size: 0.95rem;
                }
            </style>

            <div class="incubator-landing">
                <div class="hero-section">
                    <div style="display:inline-block; padding:8px 16px; background:rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius:100px; color: #10b981; font-weight:700; font-size:0.85rem; margin-bottom:24px; text-transform: uppercase; letter-spacing: 0.05em;">
                        Programme d'Accélération Exclusif
                    </div>
                    <h1 class="hero-title">Le Tremplin pour <span>votre Projet</span></h1>
                    <p class="hero-subtitle">Rejoindre la plateforme Domtom Connect est une première étape. Intégrer l'incubateur, c'est passer à la vitesse supérieure. Un programme sélectif pour ceux qui veulent vraiment des résultats.</p>
                    
                    <!-- Lien vers le formulaire d'inscription / landing page externe -->
                    <a href="/candidature-incubateur.html" class="cta-button">Soumettre ma candidature</a>
                    
                    <p style="margin-top: 20px; font-size: 0.9rem; color: #717c77; font-weight: 500;">
                        Sélection sur dossier. Places limitées par cohorte.
                    </p>
                </div>

                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-users"></i></div>
                        <h3 class="feature-title">Fini l'Isolement</h3>
                        <p class="feature-text">Avancez avec une cohorte d'entrepreneurs ambitieux. L'intelligence collective pour ne plus jamais bloquer seul sur un problème.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-map"></i></div>
                        <h3 class="feature-title">La Roadmap Exacte</h3>
                        <p class="feature-text">Pas de théorie inutile. Une feuille de route testée et approuvée pour passer de l'idée aux premières ventes sans vous disperser.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"><i class="fas fa-comments"></i></div>
                        <h3 class="feature-title">Feedback d'Experts</h3>
                        <p class="feature-text">Accédez à nos sprints de co-développement et à nos audits sans filtre. On regarde votre business et on corrige le tir ensemble.</p>
                    </div>
                </div>
            </div>
        `;
    }
};
