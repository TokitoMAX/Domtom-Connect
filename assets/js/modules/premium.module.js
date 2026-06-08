/**
 * PremiumModule.js - Domtom Connect
 * High-Ticket Application Funnel pour l'accompagnement 1-to-1
 */

window.PremiumModule = {
    state: {
        step: 1,
        profileType: null,
        answers: {
            challenge: '',
            budget: '',
            urgency: ''
        }
    },

    async route(viewId, container, profile, session, params) {
        if (viewId !== 'premium') return;
        this.state = { step: 1, profileType: null, answers: {} };
        this.renderView(container);
    },

    renderView(container) {
        container.innerHTML = `
            <style>
                .premium-wrapper {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: clamp(20px, 4vw, 60px);
                    max-width: 900px;
                    margin: 0 auto;
                    color: #fff;
                    background: #020617; /* Very dark background */
                    border-radius: 32px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    margin-top: 40px;
                    margin-bottom: 80px;
                }

                .premium-bg-glow {
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(2,6,23,0) 70%);
                    z-index: 0;
                    pointer-events: none;
                }

                .premium-content {
                    position: relative;
                    z-index: 1;
                }

                .premium-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .premium-badge {
                    display: inline-block;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid #10b981;
                    color: #10b981;
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 24px;
                }

                .premium-title {
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 950;
                    color: #fff;
                    margin: 0 0 16px 0;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                }

                .premium-subtitle {
                    font-size: 1.15rem;
                    color: #94a3b8;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                .premium-highlight {
                    color: #10b981;
                }

                /* Cards / Options */
                .premium-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 40px;
                }

                .premium-option-card {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 32px 24px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(10px);
                }

                .premium-option-card:hover {
                    background: rgba(16, 185, 129, 0.05);
                    border-color: #10b981;
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.1);
                }

                .premium-option-icon {
                    width: 64px;
                    height: 64px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    color: #fff;
                    margin: 0 auto 20px;
                    transition: all 0.3s;
                }

                .premium-option-card:hover .premium-option-icon {
                    background: #10b981;
                    color: #fff;
                }

                .premium-option-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #f8fafc;
                    margin-bottom: 12px;
                }

                .premium-option-desc {
                    font-size: 0.9rem;
                    color: #94a3b8;
                    line-height: 1.5;
                }

                /* Form Elements */
                .premium-form-group {
                    margin-bottom: 24px;
                    text-align: left;
                }

                .premium-label {
                    display: block;
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: #e2e8f0;
                    margin-bottom: 12px;
                }

                .premium-select, .premium-textarea {
                    width: 100%;
                    padding: 16px 20px;
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 16px;
                    color: #fff;
                    font-size: 1rem;
                    font-family: inherit;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }

                .premium-select:focus, .premium-textarea:focus {
                    outline: none;
                    border-color: #10b981;
                    background: rgba(15, 23, 42, 1);
                }

                .premium-select option {
                    background: #0f172a;
                    color: #fff;
                }

                .premium-btn {
                    background: #10b981;
                    color: #fff;
                    border: none;
                    padding: 18px 36px;
                    border-radius: 100px;
                    font-size: 1.1rem;
                    font-weight: 900;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    transition: all 0.3s;
                    width: 100%;
                    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                }

                .premium-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
                }

                /* Step Container */
                #premium-step-container {
                    animation: fadeIn 0.4s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Calendly / Reject views */
                .premium-result-card {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 40px;
                    text-align: center;
                }
            </style>

            <div class="premium-wrapper">
                <div class="premium-bg-glow"></div>
                <div class="premium-content">
                    <div class="premium-header">
                        <div class="premium-badge"><i class="fas fa-gem"></i> Accompagnement Exclusif</div>
                        <h1 class="premium-title">Le SaaS vous donne les outils.<br>Nous vous donnons la <span class="premium-highlight">Stratégie</span>.</h1>
                        <p class="premium-subtitle">Accompagnement 1-to-1 sur-mesure. Nous n'accompagnons que <b>5 projets par mois</b> pour garantir l'excellence et les résultats. (À partir de 500€)</p>
                    </div>

                    <div id="premium-step-container">
                        <!-- Content injected via JS -->
                    </div>
                </div>
            </div>
        `;

        this.renderStep();
    },

    renderStep() {
        const container = document.getElementById('premium-step-container');
        if (!container) return;

        if (this.state.step === 1) {
            container.innerHTML = `
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff;">Étape 1 : Quel est votre profil actuel ?</h2>
                </div>
                <div class="premium-options">
                    <div class="premium-option-card" onclick="window.PremiumModule.selectProfile('porteur')">
                        <div class="premium-option-icon"><i class="fas fa-rocket"></i></div>
                        <h3 class="premium-option-title">Porteur de Projet</h3>
                        <p class="premium-option-desc">J'ai une idée ou un projet en phase de lancement et j'ai besoin de structure.</p>
                    </div>
                    <div class="premium-option-card" onclick="window.PremiumModule.selectProfile('entreprise')">
                        <div class="premium-option-icon"><i class="fas fa-building"></i></div>
                        <h3 class="premium-option-title">Entreprise / PME</h3>
                        <p class="premium-option-desc">Je suis déjà en activité et je cherche à scaler et me développer.</p>
                    </div>
                    <div class="premium-option-card" onclick="window.PremiumModule.selectProfile('expert')">
                        <div class="premium-option-icon"><i class="fas fa-star"></i></div>
                        <h3 class="premium-option-title">Expert / Prestataire</h3>
                        <p class="premium-option-desc">Je veux optimiser mes offres, mon branding et mon acquisition client.</p>
                    </div>
                </div>
            `;
        } else if (this.state.step === 2) {
            container.innerHTML = `
                <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff;">Étape 2 : Formulaire de Candidature</h2>
                        <p style="color: #94a3b8; font-size: 0.95rem;">Pour nous assurer que nous sommes le bon partenaire pour vous, merci de répondre sincèrement.</p>
                    </div>

                    <form id="premium-qualification-form" onsubmit="window.PremiumModule.submitForm(event)">
                        <div class="premium-form-group">
                            <label class="premium-label">Quel est le défi MAJEUR qui vous bloque actuellement ? *</label>
                            <textarea id="premium-q-challenge" class="premium-textarea" rows="4" placeholder="Décrivez votre situation..." required></textarea>
                        </div>

                        <div class="premium-form-group">
                            <label class="premium-label">Avez-vous la capacité financière d'investir dans votre croissance aujourd'hui ? *</label>
                            <select id="premium-q-budget" class="premium-select" required>
                                <option value="" disabled selected>Sélectionnez une option</option>
                                <option value="0">Non, je n'ai aucun budget pour le moment (0€)</option>
                                <option value="small">Moins de 500€ (Je démarre tout juste)</option>
                                <option value="medium">Entre 500€ et 1500€ (Je suis prêt à investir)</option>
                                <option value="high">Plus de 1500€ (Je veux scaler rapidement)</option>
                            </select>
                        </div>

                        <div class="premium-form-group">
                            <label class="premium-label">Quelle est l'urgence de votre besoin ? *</label>
                            <select id="premium-q-urgency" class="premium-select" required>
                                <option value="" disabled selected>Sélectionnez une option</option>
                                <option value="now">Immédiate (Ce mois-ci)</option>
                                <option value="soon">Prochainement (Dans les 3 mois)</option>
                                <option value="later">Je m'informe juste (Plus tard)</option>
                            </select>
                        </div>

                        <div style="display: flex; gap: 16px; margin-top: 40px;">
                            <button type="button" class="premium-btn" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; width: auto;" onclick="window.PremiumModule.goBack()">Retour</button>
                            <button type="submit" class="premium-btn" style="flex: 1;">Soumettre ma candidature <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </form>
                </div>
            `;
        } else if (this.state.step === 3) {
            // Evaluated results
            if (this.state.answers.budget === '0' || this.state.answers.budget === 'small') {
                // Rejected / Not a fit right now
                container.innerHTML = `
                    <div class="premium-result-card">
                        <div style="font-size: 4rem; color: #f59e0b; margin-bottom: 24px;"><i class="fas fa-book-reader"></i></div>
                        <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 16px;">Nous avons les ressources qu'il vous faut !</h2>
                        <p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.6; margin-bottom: 32px;">
                            D'après vos réponses, l'accompagnement Premium 1-to-1 (à partir de 500€) n'est peut-être pas la meilleure option pour vous <b>en ce moment</b>. <br><br>
                            Mais pas de panique ! Nous avons conçu le SaaS Domtom Connect et nos Masterclasses précisément pour vous aider à avancer par vous-même jusqu'à ce que vous soyez prêt.
                        </p>
                        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="window.Router.navigate('#mastermind')" class="premium-btn" style="width: auto; background: #3b82f6; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);">Découvrir le Club Mastermind</button>
                            <button onclick="window.Router.navigate('#overview')" class="premium-btn" style="width: auto; background: transparent; border: 1px solid rgba(255,255,255,0.2);">Retour au Dashboard</button>
                        </div>
                    </div>
                `;
            } else {
                // Qualified
                container.innerHTML = `
                    <div class="premium-result-card">
                        <div style="font-size: 4rem; color: #10b981; margin-bottom: 24px;"><i class="fas fa-check-circle"></i></div>
                        <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 16px;">Félicitations, vous êtes pré-qualifié !</h2>
                        <p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.6; margin-bottom: 32px;">
                            Votre profil correspond parfaitement au type de projets que nous aimons accompagner. <br>
                            Réservez dès maintenant votre appel de diagnostic stratégique offert (30 min) avec notre équipe.
                        </p>
                        
                        <!-- Calendly embedded button / link -->
                        <div style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(16,185,129,0.3); border-radius: 16px; padding: 40px;">
                            <button onclick="window.open('https://calendly.com/domtomconnect/30min', '_blank')" class="premium-btn" style="width: auto; font-size: 1.2rem; padding: 20px 40px;">
                                <i class="far fa-calendar-alt"></i> Réserver mon appel stratégique
                            </button>
                            <p style="color: #64748b; font-size: 0.85rem; margin-top: 16px;">Vous serez redirigé vers notre agenda Calendly sécurisé.</p>
                        </div>
                    </div>
                `;
            }
        }
    },

    selectProfile(profileType) {
        this.state.profileType = profileType;
        this.state.step = 2;
        this.renderStep();
    },

    goBack() {
        this.state.step = 1;
        this.renderStep();
    },

    async submitForm(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
        submitBtn.disabled = true;

        const challenge = document.getElementById('premium-q-challenge').value;
        const budget = document.getElementById('premium-q-budget').value;
        const urgency = document.getElementById('premium-q-urgency').value;

        this.state.answers = {
            challenge,
            budget,
            urgency
        };

        const isQualified = (budget === 'medium' || budget === 'high');

        // Enregistrement dans Supabase pour garder une trace du lead
        try {
            const db = window._supabase;
            if (db) {
                const session = await db.auth.getSession();
                const userId = session?.data?.session?.user?.id;
                
                await db.from('premium_leads').insert([{
                    user_id: userId || null,
                    profile_type: this.state.profileType,
                    challenge: challenge,
                    budget: budget,
                    urgency: urgency,
                    is_qualified: isQualified,
                    status: 'new'
                }]);
            }
        } catch (err) {
            console.error("Erreur lors de la sauvegarde du lead:", err);
            // On continue même si la sauvegarde échoue pour ne pas bloquer l'utilisateur
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        this.state.step = 3;
        this.renderStep();
    }
};
