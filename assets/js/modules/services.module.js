/**
 * ServicesModule.js - Domtom Connect
 * Présentation des offres d'abonnement pour le Copilotage et Services Premium
 */

window.ServicesModule = {
    state: {
        billingCycle: 'monthly',
        plans: [
            {
                id: 'standard',
                name: 'Copilotage de Groupe',
                priceMonthly: '49',
                priceAnnual: '490',
                stripe_monthly: 'price_1TiNelAXxC1DBrN40aQXlGSJ',
                stripe_annual: 'price_1TiaYmAXxC1DBrN4dkHfnUB5',
                features: [
                    'Accès au Forum Privé (ex-Mastermind)',
                    'Invitations aux Afterworks',
                    'Sessions de Co-Développement (Live)',
                    'Suivi hebdomadaire (Accountability)'
                ]
            },
            {
                id: 'pro',
                name: 'Copilotage Asynchrone',
                priceMonthly: '149',
                priceAnnual: '1490',
                stripe_monthly: 'price_1TiNfRAXxC1DBrN4KHAO86oP',
                stripe_annual: 'price_1TiaNmAXxC1DBrN4HM9lEE8X',
                features: [
                    'Tout ce qui est dans Groupe',
                    'Ligne directe avec moi (Chat privé VIP)',
                    'Audit "Sans Filtre" de vos pages (Vidéo Loom)',
                    'Déblocage technique et stratégique prioritaire'
                ],
                recommended: true
            },
            {
                id: 'exec',
                name: 'Copilotage Exécutif',
                priceMonthly: '490',
                priceAnnual: '4900',
                stripe_monthly: 'price_1TibtMAXxC1DBrN4B0hcLO1z',
                stripe_annual: 'price_1TiaOjAXxC1DBrN4AXEDHVSv',
                features: [
                    'Accès Asynchrone Complet',
                    '2x Appels Visio 1-to-1 (1h) par mois',
                    'Co-création de contenu et offres',
                    'Places ultra-limitées (Max 5/mois)'
                ]
            }
        ]
    },

    async route(viewId, container, profile, session, params) {
        if (viewId !== 'services') return;
        this.renderView(container, profile);
    },

    toggleBillingCycle(cycle) {
        this.state.billingCycle = cycle;
        const container = document.getElementById('services-view');
        if(container) {
            this.renderView(container);
        }
    },

    renderView(container, profile) {
        const isAnnual = this.state.billingCycle === 'annual';
        
        let cardsHtml = this.state.plans.map(plan => {
            return `
            <div class="incubator-card ${plan.recommended ? 'recommended' : ''}">
                ${plan.recommended ? '<div class="incubator-badge">Le plus populaire</div>' : ''}
                <h3 class="incubator-card-title">${plan.name}</h3>
                <div class="incubator-price" style="margin-bottom: 20px;">
                    <span class="amount" style="font-size: 2.2rem;">Sur devis</span>
                </div>
                <ul class="incubator-features">
                    ${plan.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                </ul>
                <a href="mailto:contact@domtomconnect.com?subject=Demande de Copilotage : ${encodeURIComponent(plan.name)}" class="incubator-btn" style="text-decoration: none; text-align: center; display: block;">
                    Demander un devis
                </a>
            </div>
            `;
        }).join('');

        container.innerHTML = `
            <style>
                .incubator-wrapper {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: clamp(20px, 5vw, 60px);
                    max-width: 1100px;
                    width: clamp(90%, 95vw, 100%);
                    margin: 0 auto;
                    color: #fff;
                    background: #070908;
                    border-radius: clamp(16px, 4vw, 32px);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    margin-top: clamp(16px, 4vw, 40px);
                    margin-bottom: clamp(20px, 8vw, 80px);
                    box-sizing: border-box;
                }
                
                .incubator-header {
                    text-align: center;
                    margin-bottom: 50px;
                }

                .incubator-title {
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 950;
                    margin: 0 0 16px 0;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    line-height: 1.1;
                }

                .incubator-subtitle {
                    font-size: 1.15rem;
                    color: #a7b0ac;
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Nouveaux Piliers */
                .incubator-pillars {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    margin-bottom: 60px;
                    margin-top: 40px;
                    padding: 0 20px;
                }

                .incubator-pillar {
                    background: rgba(255,255,255,0.03);
                    border: 1px dashed rgba(16, 185, 129, 0.3);
                    border-radius: 20px;
                    padding: 24px;
                    text-align: left;
                }
                .incubator-pillar-icon {
                    font-size: 2rem;
                    color: #10b981;
                    margin-bottom: 16px;
                }
                .incubator-pillar-title {
                    font-size: 1.2rem;
                    font-weight: 800;
                    margin-bottom: 10px;
                    color: #fff;
                }
                .incubator-pillar-text {
                    font-size: 0.95rem;
                    color: #a7b0ac;
                    line-height: 1.5;
                }

                /* Toggle Switch */
                .billing-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    margin-bottom: 40px;
                }
                .billing-option {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #717c77;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .billing-option.active {
                    color: #fff;
                }
                .billing-switch {
                    position: relative;
                    width: 60px;
                    height: 32px;
                    background: #1b2420;
                    border-radius: 100px;
                    cursor: pointer;
                    border: 1px solid rgba(16, 185, 129, 0.5);
                }
                .billing-knob {
                    position: absolute;
                    top: 2px;
                    left: ${isAnnual ? '30px' : '2px'};
                    width: 26px;
                    height: 26px;
                    background: #10b981;
                    border-radius: 50%;
                    transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .incubator-pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                    padding: 0 20px;
                }

                .incubator-card {
                    background: rgba(14, 19, 17, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 40px 30px;
                    position: relative;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                }

                .incubator-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.15);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .incubator-card.recommended {
                    background: linear-gradient(to bottom, rgba(16, 185, 129, 0.1), rgba(14, 19, 17, 0.8));
                    border: 1px solid #10b981;
                }

                .incubator-badge {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #10b981;
                    color: white;
                    padding: 4px 16px;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .incubator-card-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0 0 20px 0;
                    color: #f6f8f7;
                }

                .incubator-price {
                    margin-bottom: 30px;
                    display: flex;
                    align-items: baseline;
                }

                .incubator-price .currency {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #a7b0ac;
                }

                .incubator-price .amount {
                    font-size: 3.5rem;
                    font-weight: 900;
                    color: #fff;
                    letter-spacing: -0.05em;
                }

                .incubator-price .period {
                    font-size: 1rem;
                    color: #a7b0ac;
                    margin-left: 5px;
                }

                .incubator-features {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 40px 0;
                    flex-grow: 1;
                }

                .incubator-features li {
                    margin-bottom: 16px;
                    color: #d4dad7;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .incubator-features li i {
                    color: #10b981;
                    font-size: 0.9rem;
                }

                .incubator-btn {
                    width: 100%;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    background: #f6f8f7;
                    color: #0c100e;
                }

                .incubator-card.recommended .incubator-btn {
                    background: #10b981;
                    color: white;
                }

                .incubator-btn:hover {
                    opacity: 0.9;
                    transform: scale(1.02);
                }
            </style>

            <div class="incubator-wrapper">
                <div class="incubator-header">
                    <h1 class="incubator-title">Vos Services & Copilotage</h1>
                    <p class="incubator-subtitle">Nous prenons le volant avec vous. Une gestion asynchrone ou en 1-to-1 pour structurer et exécuter votre stratégie de croissance.</p>
                </div>

                <div class="incubator-pillars">
                    <div class="incubator-pillar">
                        <div class="incubator-pillar-icon"><i class="fas fa-handshake"></i></div>
                        <h4 class="incubator-pillar-title">Chef de Projet Dédié</h4>
                        <p class="incubator-pillar-text">Je m'implique directement dans vos processus. Fini de tout gérer seul, nous structurons vos opérations pour que vous puissiez scaler.</p>
                    </div>
                    <div class="incubator-pillar">
                        <div class="incubator-pillar-icon"><i class="fas fa-comments"></i></div>
                        <h4 class="incubator-pillar-title">Accès Direct</h4>
                        <p class="incubator-pillar-text">Un canal de communication privilégié pour débloquer les urgences, auditer vos actions et itérer rapidement sur vos lancements.</p>
                    </div>
                    <div class="incubator-pillar">
                        <div class="incubator-pillar-icon"><i class="fas fa-cogs"></i></div>
                        <h4 class="incubator-pillar-title">Exécution Technique</h4>
                        <p class="incubator-pillar-text">Je ne donne pas que des conseils, je mets en place les tunnels, les automatisations et les systèmes nécessaires à votre succès.</p>
                    </div>
                </div>
                
                <!-- Switch de facturation supprimé car passage sur devis uniquement -->

                <div class="incubator-pricing-grid">
                    ${cardsHtml}
                </div>
            </div>
        `;
    },

    async checkout(stripePriceId, tierName, isAnnual) {
        if (!stripePriceId || stripePriceId.trim() === '') {
            alert("Cette offre n'est pas encore configurée sur Stripe. Le fondateur doit ajouter l'identifiant de prix (price_...) !");
            return;
        }

        if (stripePriceId.includes('REMPLACEZ')) {
            alert("Configuration requise : Vous devez insérer votre véritable ID de Prix Stripe (price_...) dans assets/js/modules/services.module.js !");
            return;
        }

        try {
            const db = window._supabase;
            if (!db) throw new Error("Supabase non initialisé");
            
            const session = await db.auth.getSession();
            const userId = session?.data?.session?.user?.id;
            
            if (!userId) {
                alert("Vous devez être connecté pour vous abonner.");
                window.location.href = 'login.html';
                return;
            }

            // Afficher le loader
            const overlayHtml = `
                <div id="stripe-loader-overlay" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(14, 19, 17,0.9); z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
                    <div style="width:50px; height:50px; border:4px solid #10b981; border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite; margin-bottom:20px;"></div>
                    <p style="color:white; font-family:'Plus Jakarta Sans', sans-serif; font-weight:700; font-size:1.2rem;">Redirection vers Stripe Checkout...</p>
                    <style>@keyframes spin { 100% { transform:rotate(360deg); } }</style>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', overlayHtml);

            // Appel de la Edge Function pour générer le lien de paiement
            const { data, error } = await db.functions.invoke('create-checkout', {
                body: {
                    type: 'subscription',
                    plan_id: stripePriceId,
                    buyer_id: userId,
                    tier: tierName
                }
            });

            if (error) throw error;
            if (!data || !data.url) throw new Error("Aucune URL retournée par Stripe");

            // Redirection vers le Checkout
            window.location.href = data.url;

        } catch (err) {
            console.error("Erreur Checkout:", err);
            alert("Une erreur est survenue lors de la création de la session de paiement. Détails: " + err.message);
            const overlay = document.getElementById('stripe-loader-overlay');
            if (overlay) overlay.remove();
        }
    }
};
