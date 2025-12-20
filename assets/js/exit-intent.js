// Exit Intent Popup functionality

console.log('Exit Intent Popup script chargé'); // Debug

let exitIntentShown = false;
let mouseY = 0;
let timeOnPage = 0;
let scrollPercentage = 0;
let pageLoadTime = Date.now();

document.addEventListener('DOMContentLoaded', function() {
    // Check if popup was already shown (cookie) - commenté pour test
    // if (getCookie('exit_intent_shown') === 'true') {
    //     return;
    // }
    
    // Track mouse movement for exit intent
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMouseMove);
    
    // Track scroll percentage
    document.addEventListener('scroll', handleScroll);
    
    // Track time on page
    setInterval(() => {
        timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000); // seconds
    }, 1000);
    
    initExitIntentPopup();
    
    // Show popup after user has been on page for 10 seconds (réduit pour test)
    setTimeout(() => {
        if (!exitIntentShown) {
            showExitIntentPopup();
            exitIntentShown = true;
            setCookie('exit_intent_shown', 'true', 24);
            
            // Track time-based trigger
            if (window.trackLead) {
                window.trackLead({
                    source: 'exit-intent-popup',
                    action: 'triggered',
                    trigger: 'time-based',
                    timeOnPage: timeOnPage,
                    scrollPercentage: scrollPercentage
                });
            }
        }
    }, 10000); // 10 seconds pour test (normalement 30s)
    
    // Mode test : appuyez sur 'T' pour forcer l'affichage
    document.addEventListener('keydown', function(e) {
        if (e.key === 't' || e.key === 'T') {
            if (!exitIntentShown) {
                showExitIntentPopup();
                exitIntentShown = true;
                console.log('Popup forcée via touche T');
            }
        }
    });
});

function handleMouseMove(e) {
    mouseY = e.clientY;
}

function handleScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
}

function handleMouseOut(e) {
    // Only trigger if mouse is moving upward (toward top of page) - exit intent
    // This detects when user tries to leave the page
    // Amélioration de la détection pour être plus sensible
    if (e.clientY < 0 || (!e.toElement && !e.relatedTarget && mouseY < 50)) {
        if (!exitIntentShown) {
            showExitIntentPopup();
            exitIntentShown = true;
            setCookie('exit_intent_shown', 'true', 24); // 24 hours
            
            // Track exit intent trigger
            if (window.trackLead) {
                window.trackLead({
                    source: 'exit-intent-popup',
                    action: 'triggered',
                    trigger: 'exit-intent',
                    timeOnPage: timeOnPage,
                    scrollPercentage: scrollPercentage
                });
            }
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
                <button class="exit-intent-close" onclick="window.closeExitIntentPopup()" aria-label="Fermer" style="cursor: pointer;">×</button>
                <div class="exit-intent-header">
                    <span class="exit-intent-badge">Offre limitée</span>
                    <h2>${offer.title}</h2>
                    <p>${offer.description}</p>
                </div>
                <form class="exit-intent-form" id="exit-intent-form" onsubmit="handleExitIntentSubmit(event)">
                    <!-- Honeypot field - caché pour attraper les bots -->
                    <input type="text" name="website" tabindex="-1" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" autocomplete="off" aria-hidden="true">
                    <input type="text" name="prenom" placeholder="Prénom *" required>
                    <input type="text" name="nom" placeholder="Nom *" required>
                    <input type="email" name="email" placeholder="Email *" required>
                    <input type="tel" name="telephone" placeholder="Téléphone *" required>
                    <select name="profil" required>
                        <option value="">Votre profil *</option>
                        <option value="porteur-projet">Porteur de projet</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="prestataire">Prestataire</option>
                    </select>
                    <select name="ile" required>
                        <option value="">Votre territoire *</option>
                        <option value="martinique">Martinique</option>
                        <option value="guadeloupe">Guadeloupe</option>
                        <option value="reunion">La Réunion</option>
                        <option value="guyane">Guyane</option>
                        <option value="mayotte">Mayotte</option>
                        <option value="polynesie">Polynésie française</option>
                        <option value="nouvelle-caledonie">Nouvelle-Calédonie</option>
                        <option value="diaspora">Diaspora</option>
                        <option value="autre">Autre</option>
                    </select>
                    <button type="submit" class="cta-button primary large">
                        ${offer.buttonText}
                    </button>
                    <p class="exit-intent-privacy">
                        🔒 Vos données sont sécurisées. Nous vous contacterons dans les 24h.
                    </p>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center;">
                        * Champs obligatoires
                    </p>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Initialiser le suivi du temps de remplissage pour le formulaire du popup
    setTimeout(() => {
        const popupForm = document.getElementById('exit-intent-form');
        if (popupForm && window.formSecurity) {
            window.formSecurity.initFillTimeTracking(popupForm);
        }
    }, 100);
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
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        overlay.style.zIndex = '99999';
        
        console.log('Popup affichée'); // Debug
        
        // Track popup shown
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'shown',
                page: window.location.pathname
            });
        }
    } else {
        console.error('Overlay non trouvé - popup non initialisée'); // Debug
    }
}

function closeExitIntentPopup() {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        
        // Track popup closed
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'closed'
            });
        }
        
        console.log('Popup fermée'); // Debug
    } else {
        console.error('Overlay non trouvé pour fermeture'); // Debug
    }
}

function handleExitIntentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Get offer type
    const offer = getPageSpecificOffer();
    
    // Validation : vérifier que tous les champs obligatoires sont remplis
    if (!data.prenom || !data.nom || !data.email || !data.telephone || !data.profil || !data.ile) {
        alert('Veuillez remplir tous les champs obligatoires (marqués d\'un *).');
        return;
    }
    
    // Vérification de sécurité (anti-bot)
    if (window.formSecurity) {
        const securityCheck = window.formSecurity.secureFormSubmission(form, data);
        if (!securityCheck.success) {
            // Afficher les erreurs de sécurité
            const errorMessage = securityCheck.errors.join('\n');
            alert(errorMessage);
            return;
        }
    } else {
        // Fallback si le module de sécurité n'est pas chargé
        // Validation email basique
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }
        
        // Validation téléphone (au moins 10 caractères)
        if (data.telephone.replace(/\s/g, '').length < 10) {
            alert('Veuillez entrer un numéro de téléphone valide.');
            return;
        }
    }
    
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
    
    // Send to Formspree (même endpoint que le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `🆕 Popup Exit-Intent - ${data.prenom} ${data.nom} (${data.profil})`);
    formDataToSend.append('_replyto', data.email);
    
    let messageBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NOUVELLE INSCRIPTION - POPUP EXIT-INTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type d'offre: ${data.offer_type}
Page: ${data.page_url}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 INFORMATIONS PERSONNELLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone}
Profil: ${data.profil}
Territoire: ${data.ile}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter la personne pour un appel
2. Après l'appel, décider (oui/non)
3. Si oui, ajouter à l'écosystème WhatsApp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    formDataToSend.append('message', messageBody);
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone);
    formDataToSend.append('Profil', data.profil);
    formDataToSend.append('Territoire', data.ile);
    
    fetch('https://formspree.io/f/myzbqepy', {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
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
                        <button type="button" class="cta-button primary" onclick="window.closeExitIntentPopup()" style="margin-top: 1rem; cursor: pointer;">
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
                        <button type="button" class="cta-button primary" onclick="window.closeExitIntentPopup()" style="margin-top: 1rem; cursor: pointer;">
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
                        <button type="button" class="cta-button primary" onclick="window.closeExitIntentPopup()" style="margin-top: 1rem; cursor: pointer;">
                            Parfait !
                        </button>
                    </div>
                `;
            }
            
            form.innerHTML = successMessage;
            
            // Close popup after 5 seconds (optionnel, commenté pour laisser l'utilisateur fermer manuellement)
            // setTimeout(() => {
            //     window.closeExitIntentPopup();
            // }, 5000);
        } else {
            return response.json().then(errData => {
                throw new Error(errData.error || 'Erreur lors de l\'envoi');
            });
        }
    })
    .catch(error => {
        console.error('Erreur détaillée:', error);
        const errorMessage = error.message || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
        alert(errorMessage);
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
        window.closeExitIntentPopup();
    }
});

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('exit-intent-overlay');
        if (overlay && overlay.classList.contains('show')) {
            window.closeExitIntentPopup();
        }
    }
});

// Exposer la fonction globalement pour qu'elle soit accessible depuis onclick
window.closeExitIntentPopup = closeExitIntentPopup;
