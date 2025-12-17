// Exit Intent Popup functionality

let exitIntentShown = false;
let mouseY = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Check if popup was already shown (cookie)
    if (getCookie('exit_intent_shown') === 'true') {
        return;
    }
    
    // Track mouse movement
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMouseMove);
    
    initExitIntentPopup();
});

function handleMouseMove(e) {
    mouseY = e.clientY;
}

function handleMouseOut(e) {
    // Only trigger if mouse is moving upward (toward top of page)
    if (!e.toElement && !e.relatedTarget && mouseY < 10) {
        if (!exitIntentShown) {
            showExitIntentPopup();
            exitIntentShown = true;
            setCookie('exit_intent_shown', 'true', 24); // 24 hours
        }
    }
}

function initExitIntentPopup() {
    // Get page-specific offer
    const offer = getPageSpecificOffer();
    
    // Create popup HTML
    const popupHTML = `
        <div class="exit-intent-overlay" id="exit-intent-overlay">
            <div class="exit-intent-popup">
                <button class="exit-intent-close" onclick="closeExitIntentPopup()" aria-label="Fermer">×</button>
                <div class="exit-intent-header">
                    <span class="exit-intent-badge">Offre limitée</span>
                    <h2>${offer.title}</h2>
                    <p>${offer.description}</p>
                </div>
                <form class="exit-intent-form" id="exit-intent-form" onsubmit="handleExitIntentSubmit(event)">
                    <input type="text" name="prenom" placeholder="Prénom" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="tel" name="telephone" placeholder="Téléphone" required>
                    <select name="profil" required>
                        <option value="">Votre profil</option>
                        <option value="porteur-projet">Porteur de projet</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="prestataire">Prestataire</option>
                    </select>
                    <button type="submit" class="cta-button primary large">
                        ${offer.buttonText}
                    </button>
                    <p class="exit-intent-privacy">
                        🔒 Vos données sont sécurisées. Nous vous contacterons dans les 24h.
                    </p>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function getPageSpecificOffer() {
    const path = window.location.pathname;
    
    if (path.includes('blog')) {
        return {
            title: 'Besoin d\'aide pour votre projet ?',
            description: 'Réservez un appel découverte gratuit de 30 minutes avec notre équipe. On discute de votre projet et on vous donne des conseils personnalisés.',
            buttonText: 'Réserver mon appel gratuit',
            offerType: 'appel-decouverte'
        };
    } else if (path.includes('services')) {
        return {
            title: 'Trouvez le bon prestataire dès maintenant',
            description: 'Réservez une consultation gratuite pour identifier vos besoins et trouver les prestataires adaptés à votre projet.',
            buttonText: 'Réserver ma consultation gratuite',
            offerType: 'consultation-gratuite'
        };
    } else {
        return {
            title: 'Rejoignez les pionniers gratuitement',
            description: 'Inscrivez-vous maintenant et bénéficiez d\'un accompagnement personnalisé pour faire avancer votre projet. Inscription gratuite pour les premiers membres.',
            buttonText: 'Rejoindre maintenant (gratuit)',
            offerType: 'inscription-prioritaire'
        };
    }
}

function showExitIntentPopup() {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay) {
        overlay.classList.add('show');
        
        // Track popup shown
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'shown',
                page: window.location.pathname
            });
        }
    }
}

function closeExitIntentPopup() {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        
        // Track popup closed
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'closed'
            });
        }
    }
}

function handleExitIntentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Get offer type
    const offer = getPageSpecificOffer();
    
    // Add tracking data
    data.lead_source = 'exit-intent-popup';
    data.offer_type = offer.offerType;
    data.page_url = window.location.href;
    data.timestamp = new Date().toISOString();
    data.priority = 'high'; // Mark as high priority lead
    
    // Track the lead
    if (window.trackLead) {
        window.trackLead({
            source: 'exit-intent-popup',
            action: 'submitted',
            offerType: offer.offerType,
            email: data.email
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    // Send to Formspree
    fetch('https://formspree.io/f/xpwnqgqg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // Show success message based on offer type
            let successMessage = '';
            if (offer.offerType === 'appel-decouverte') {
                successMessage = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Demande enregistrée !</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Merci ! Nous vous contacterons dans les 24h pour planifier votre appel découverte gratuit.</p>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Vérifiez votre email pour les détails.</p>
                        <button type="button" class="cta-button primary" onclick="closeExitIntentPopup()" style="margin-top: 1rem;">
                            Parfait, merci !
                        </button>
                    </div>
                `;
            } else if (offer.offerType === 'consultation-gratuite') {
                successMessage = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Consultation réservée !</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Excellent ! Nous vous contacterons rapidement pour planifier votre consultation gratuite.</p>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Un email de confirmation vous a été envoyé.</p>
                        <button type="button" class="cta-button primary" onclick="closeExitIntentPopup()" style="margin-top: 1rem;">
                            Parfait !
                        </button>
                    </div>
                `;
            } else {
                successMessage = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Inscription réussie !</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Bienvenue dans la communauté ! Nous vous contacterons très prochainement.</p>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Vérifiez votre email pour les prochaines étapes.</p>
                        <button type="button" class="cta-button primary" onclick="closeExitIntentPopup()" style="margin-top: 1rem;">
                            Parfait !
                        </button>
                    </div>
                `;
            }
            
            form.innerHTML = successMessage;
            
            // Close popup after 5 seconds
            setTimeout(() => {
                closeExitIntentPopup();
            }, 5000);
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// Cookie functions
function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Close on overlay click
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay && e.target === overlay) {
        closeExitIntentPopup();
    }
});

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeExitIntentPopup();
    }
});
