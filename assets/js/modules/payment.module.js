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

        // 5. Render PayPal Button
        await this.renderPayPalButton();
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
            #paypal-button-container-dynamic { min-height: 150px; }
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

                <div id="paypal-button-container-dynamic"></div>
                <p style="text-align:center; font-size:0.7rem; color:#94a3b8; margin-top:24px;">Paiement sécurisé via PayPal. Annulation possible à tout moment.</p>
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
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Intégration Podcast "Le Cercle DTC"</li>
            `;
        }
    },

    /**
     * Render the PayPal Button
     */
    async renderPayPalButton() {
        const container = document.getElementById('paypal-button-container-dynamic');
        if (!container) return;

        try {
            const zoneId = (this.currentProfile && this.currentProfile.territory) || 'OM_FR';
            await this.loadPayPalSDK(zoneId);

            if (typeof paypal === 'undefined') {
                container.innerHTML = '<p style="color:#ef4444; font-size:0.8rem;">Erreur de chargement PayPal. Vérifiez votre connexion.</p>';
                return;
            }

            // Plan IDs
            const planId = (this.currentTier === 'authority' || this.currentRole === 'expert') 
                ? 'P-3DX69524C1114072WNG2AOZQ' 
                : 'P-6JG84131PK915684CNG3VDSQ';
            
            const color = this.currentRole === 'expert' ? 'black' : 'blue';

            paypal.Buttons({
                style: { layout: 'vertical', color: color, shape: 'rect', label: 'subscribe', height: 50 },
                createSubscription: (data, actions) => {
                    return actions.subscription.create({ 'plan_id': planId });
                },
                onApprove: (data, actions) => {
                    this.handleSubscriptionSuccess(data.subscriptionID);
                },
                onError: (err) => {
                    console.error('PayPal Error:', err);
                    container.innerHTML = `<p style="color:#ef4444; font-size:0.8rem;">Erreur PayPal. Veuillez réessayer.</p>`;
                }
            }).render('#paypal-button-container-dynamic');

        } catch (err) {
            console.error("Payment SDK Load Fail:", err);
            container.innerHTML = '<p style="color:#ef4444; font-size:0.8rem;">Initialisation impossible.</p>';
        }
    },

    /**
     * Load PayPal SDK with Zone Config
     */
    loadPayPalSDK(zoneId) {
        return new Promise((resolve, reject) => {
            if (window.paypal) { resolve(window.paypal); return; }
            
            const currency = 'EUR'; // Standard for Domtom
            const locale = 'fr_FR';
            const clientId = "AcBmagCWJpj_JUQpRivjdlrowAA48XOvpD_B022bRdhQqQzYIHR6LgAKLdFadgLKHUa4BPqpYwstW825";
            
            const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=${locale}&vault=true&intent=subscription`;
            
            const script = document.createElement('script');
            script.src = sdkUrl;
            script.onload = () => resolve(window.paypal);
            script.onerror = () => reject("SDK Fail");
            document.head.appendChild(script);
        });
    },

    /**
     * Handle Success
     */
    async handleSubscriptionSuccess(subscriptionId) {
        try {
            const { error: authError } = await window._supabase.auth.updateUser({ 
                data: { role: this.currentRole, onboarding_done: true } 
            });
            if (authError) throw authError;

            const { error: dbError } = await window._supabase
                .from('profiles')
                .update({
                    subscription_tier: this.currentTier,
                    subscription_id: subscriptionId,
                    last_payment_date: new Date().toISOString(),
                    role: this.currentRole,
                    listed: true
                })
                .eq('id', this.currentProfile.id);

            if (dbError) throw dbError;

            // Show Success Notification
            if (window.Swal) {
                await Swal.fire({
                    title: 'FÉLICITATIONS !',
                    text: 'Votre pack est maintenant actif. Bienvenue dans l\'élite territoriale.',
                    icon: 'success',
                    confirmButtonText: 'Accéder à mes privilèges',
                    confirmButtonColor: '#10b981'
                });
            } else {
                alert("✅ Pack activé avec succès ! Bienvenue.");
            }

            // Reload or refresh UI
            window.location.reload();

        } catch (err) {
            console.error("Subscription Sync Error:", err);
            alert("Erreur de synchronisation du compte : " + err.message);
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
