/**
 * PaymentModule.js - Domtom Connect
 * Centralized Subscription & Payment Engine
 */
const PaymentModule = {
    modalId: 'dynamic-payment-modal',
    
    /**
     * Open the subscription modal
     * @param {string} tier - 'authority' or 'strategic' / 'growth'
     * @param {string} role - 'expert' or 'entreprise'
     * @param {object} profile - User profile data
     */
    async openSubModal(tier, role, profile) {
        // Fallback if profile is not provided or undefined
        this.currentProfile = profile || (window.App && window.App.state.profile);
        this.currentRole = role || (window.App && window.App.state.role) || 'expert';
        
        if (!this.currentProfile) {
            console.error("PaymentModule: Missing profile data for subscription.");
            alert("⚠️ Impossible d'ouvrir le paiement : profil non chargé.");
            return;
        }

        this.currentTier = tier || (this.currentRole === 'entreprise' ? 'growth' : 'authority');

        // 1. Inject CSS if missing
        this.injectStyles();

        // 2. Inject/Reset Modal HTML
        this.injectModalHtml();

        // 3. Setup Modal Content
        this.setupModalContent();

        // 4. Show Modal
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }

        // 5. Render Stripe Button
        await this.renderStripeButton();
    },

    /**
     * Inject necessary CSS for the modal
     */
    injectStyles() {
        if (document.getElementById('payment-module-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'payment-module-styles';
        style.textContent = `
            .payment-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.8);
                backdrop-filter: blur(8px);
                z-index: 20000;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .payment-modal-overlay.active { opacity: 1; display: flex; }
            .payment-modal-card {
                background: white;
                width: 100%;
                max-width: 500px;
                border-radius: 28px;
                padding: 40px;
                position: relative;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            .payment-modal-overlay.active .payment-modal-card { transform: translateY(0); }
            .payment-close {
                position: absolute;
                top: 24px;
                right: 24px;
                background: #f1f5f9;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                color: #64748b;
            }
            .payment-badge {
                display: inline-block;
                padding: 6px 14px;
                background: #f0fdf4;
                color: #10b981;
                border-radius: 100px;
                font-size: 0.75rem;
                font-weight: 800;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .payment-title { font-size: 1.8rem; font-weight: 900; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.03em; }
            .payment-price { font-size: 2.5rem; font-weight: 950; color: #0f172a; margin-bottom: 32px; display:flex; align-items: baseline; gap: 4px; }
            .payment-price span { font-size: 1rem; color: #94a3b8; font-weight: 600; }
            .benefits-list { list-style: none; padding: 0; margin: 0 0 40px 0; display: grid; gap: 16px; }
            .benefits-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 0.95rem; color: #475569; line-height: 1.4; }
            .benefits-list svg { width: 20px; height: 20px; color: #10b981; flex-shrink: 0; margin-top: 2px; }
            #stripe-button-container-dynamic { min-height: 80px; }
        `;
        document.head.appendChild(style);
    },

    /**
     * Inject Modal HTML if it doesn't exist
     */
    injectModalHtml() {
        let modal = document.getElementById(this.modalId);
        if (modal) {
            modal.remove(); // Reset for clean state
        }
        
        modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'payment-modal-overlay';
        modal.innerHTML = `
            <div class="payment-modal-card">
                <button class="payment-close" onclick="window.PaymentModule.close()">&times;</button>
                <div id="payment-badge-el" class="payment-badge">PACK PRIVILÈGE</div>
                <h2 id="payment-title-el" class="payment-title">Pack Authority</h2>
                <div class="payment-price"><span id="payment-price-el">9,99</span><span>€ /mois</span></div>
                
                <ul id="payment-benefits-el" class="benefits-list">
                    <!-- Benefits injected here -->
                </ul>

                <div id="stripe-button-container-dynamic"></div>
                <p style="text-align:center; font-size:0.7rem; color:#94a3b8; margin-top:24px;">Paiement sécurisé via Stripe. Annulation possible à tout moment.</p>
            </div>
        `;
        document.body.appendChild(modal);
    },

    /**
     * Setup Modal Content based on Role and Tier
     */
    setupModalContent() {
        const titleEl = document.getElementById('payment-title-el');
        const badgeEl = document.getElementById('payment-badge-el');
        const priceEl = document.getElementById('payment-price-el');
        const benefitsEl = document.getElementById('payment-benefits-el');

        const isEnterprise = this.currentRole === 'entreprise' || this.currentTier === 'growth';
        
        if (isEnterprise) {
            badgeEl.textContent = "SOLUTIONS BUSINESS";
            titleEl.textContent = "Pack Business Growth";
            priceEl.textContent = "29,00";
            benefitsEl.innerHTML = `
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Statut Entreprise Certifiée (SEO)</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Vitrine Marque Employeur Premium</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Publication de Missions Illimitées</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Accès au Talents Directory (Expertise Illimitée)</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Support Prioritaire & Mise en Relation</li>
            `;
        } else {
            badgeEl.textContent = "ACCÉLÉRATEUR EXPERT";
            titleEl.textContent = "Pack Authority";
            priceEl.textContent = "9,99";
            benefitsEl.innerHTML = `
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Badge Certifié "Expert Authority"</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Mise en avant prioritaire dans l'annuaire</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Accès aux Missions Premium</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> 2-3 Contenus / mois (Expertise & SEO)</li>
            `;
        }
    },

    /**
     * Render the Stripe Checkout Button
     */
    async renderStripeButton() {
        const container = document.getElementById('stripe-button-container-dynamic');
        if (!container) return;

        container.innerHTML = `
            <button id="stripe-checkout-btn" class="stripe-pay-button">
                <span>💳 S'abonner avec Stripe</span>
            </button>
            <style>
                .stripe-pay-button {
                    width: 100%;
                    padding: 16px;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 900;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
                }
                .stripe-pay-button:hover {
                    background: #1e293b;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(15, 23, 42, 0.2);
                }
                .stripe-pay-button:active { transform: translateY(0); }
                .stripe-pay-button:disabled { opacity: 0.7; cursor: not-allowed; }
            </style>
        `;

        const btn = document.getElementById('stripe-checkout-btn');
        btn.onclick = async () => {
            btn.disabled = true;
            btn.innerHTML = '<span class="loader-small"></span> Redirection...';
            
            try {
                const { data: { session } } = await window._supabase.auth.getSession();
                
                // Stripe Price IDs from Dashboard
                const planId = (this.currentTier === 'growth') 
                    ? 'price_1TSlsZAXxC1DBrN4BFAMApAa' 
                    : 'price_1TSlopAXxC1DBrN47utQYjMH';

                const response = await fetch('https://vlpzmxddgdjjtrpbtksd.supabase.co/functions/v1/create-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token || ''}`,
                    },
                    body: JSON.stringify({
                        type: 'subscription',
                        tier: this.currentTier,
                        plan_id: planId,
                        buyer_id: session?.user?.id
                    }),
                });

                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error(data.error || 'Erreur Stripe');
                }
            } catch (err) {
                console.error(err);
                alert("Erreur: " + err.message);
                btn.disabled = false;
                btn.innerHTML = '<span>💳 S\'abonner avec Stripe</span>';
            }
        };
    },

    /**
     * Handle Success (Client side redirect back)
     * Note: Most logic is now in the Webhook. This is just for UI feedback.
     */
    async handleSubscriptionSuccess(sessionId) {
        // This is called when returning from Stripe with ?session_id=...
        try {
            Swal.fire({
                title: 'VÉRIFICATION...',
                text: 'Nous finalisons l\'activation de votre pack.',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            // Wait a bit for webhook to process
            await new Promise(r => setTimeout(r, 2000));
            window.location.href = '/mon-espace';
        } catch (err) {
            console.error("Subscription Sync Error:", err);
        }
    },

    /**
     * Close the modal
     */
    close() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }
};

window.PaymentModule = PaymentModule;
window.openSubModal = (tier) => {
    // Legacy fallback or global trigger
    if (window.App && window.App.state.profile) {
        PaymentModule.openSubModal(tier, window.App.state.role, window.App.state.profile);
    } else {
        console.warn("PaymentModule: App profile not ready for fallback call.");
    }
};
