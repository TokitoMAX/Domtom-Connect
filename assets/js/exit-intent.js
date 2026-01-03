// Exit Intent Popup functionality

let exitIntentShown = false;
let mouseY = 0;
let timeOnPage = 0;
let scrollPercentage = 0;
let pageLoadTime = Date.now();

// Fonction d'initialisation principale
function initializeExitIntent() {
    // Vérifier si on doit forcer l'affichage du popup (pour test avec ?test-popup=1 dans l'URL)
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get('test-popup') === '1';
    
    if (forceShow) {
        // Mode test : supprimer le cookie et forcer l'affichage immédiatement
        setCookie('exit_intent_shown', 'false', -1); // Supprimer le cookie
        exitIntentShown = false;
        initExitIntentPopup();
        // Afficher le popup après 1 seconde pour le test
        setTimeout(() => {
            showExitIntentPopup();
            exitIntentShown = true;
        }, 1000);
        return;
    }
    
    // Check if popup was already shown (cookie)
    if (getCookie('exit_intent_shown') === 'true') {
        console.log('Popup déjà affiché (cookie présent), pas d\'affichage');
        return;
    }
    
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
    
    // Stratégie multi-triggers pour afficher le popup de manière plus intelligente
    // Trigger 1: Après 20 secondes (engagement temporel)
    setTimeout(() => {
        if (!exitIntentShown && timeOnPage >= 20) {
            checkAndShowPopup('time-based');
        }
    }, 20000); // 20 seconds
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExitIntent);
} else {
    // DOM déjà chargé
    initializeExitIntent();
}

function handleMouseMove(e) {
    mouseY = e.clientY;
}

function handleScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    // Trigger 2: Afficher après 60% de scroll si l'utilisateur a passé au moins 15 secondes (engagement par scroll)
    if (!exitIntentShown && scrollPercentage >= 60 && timeOnPage >= 15) {
        checkAndShowPopup('scroll-based');
    }
}

// Fonction pour vérifier les conditions et afficher le popup
function checkAndShowPopup(triggerType) {
    if (!exitIntentShown) {
        showExitIntentPopup();
        exitIntentShown = true;
        setCookie('exit_intent_shown', 'true', 24);
        
        // Track trigger
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'triggered',
                trigger: triggerType,
                timeOnPage: timeOnPage,
                scrollPercentage: scrollPercentage
            });
        }
    }
}

function handleMouseOut(e) {
    // Trigger 3: Exit intent - détecte quand l'utilisateur essaie de quitter la page
    // Only trigger if mouse is moving upward (toward top of page)
    if (e.clientY < 0 || (!e.toElement && !e.relatedTarget && mouseY < 50)) {
        // Afficher seulement si l'utilisateur a passé au moins 10 secondes sur la page
        if (!exitIntentShown && timeOnPage >= 10) {
            checkAndShowPopup('exit-intent');
        }
    }
}

function initExitIntentPopup() {
    // Vérifier si le popup existe déjà
    if (document.getElementById('exit-intent-overlay')) {
        return; // Le popup existe déjà, pas besoin de le recréer
    }
    
    // Attendre que document.body soit disponible
    if (!document.body) {
        console.warn('exit-intent: document.body non disponible, nouvelle tentative dans 100ms');
        setTimeout(initExitIntentPopup, 100);
        return;
    }
    
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
                        <option value="porteur-projet">Porteur de projet / Entrepreneur</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="prestataire">Prestataire</option>
                        <option value="investisseur">Investisseur</option>
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
    // S'assurer que le popup est initialisé
    if (!document.getElementById('exit-intent-overlay')) {
        initExitIntentPopup();
    }
    
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay) {
        overlay.classList.add('show');
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        overlay.style.zIndex = '99999';
        overlay.style.visibility = 'visible';
        
        // Forcer le reflow pour s'assurer que les styles sont appliqués
        void overlay.offsetHeight;
        
        // Track popup shown
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'shown',
                page: window.location.pathname
            });
        }
        
        // Focus sur le premier champ pour accessibilité
        setTimeout(() => {
            const firstInput = overlay.querySelector('input[name="prenom"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
        
        console.log('Popup affiché avec succès');
    } else {
        console.error('Impossible de trouver l\'overlay du popup');
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
    
    // Déterminer le profil clairement
    let profilLabel = '';
    if (data.profil === 'entreprise') {
        profilLabel = '🏢 ENTREPRISE';
    } else if (data.profil === 'prestataire') {
        profilLabel = '💼 PRESTATAIRE';
    } else if (data.profil === 'porteur-projet') {
        profilLabel = '🚀 PORTEUR DE PROJET';
    } else if (data.profil === 'entrepreneur') {
        profilLabel = '🚀 ENTREPRENEUR';
    } else if (data.profil === 'investisseur') {
        profilLabel = '💰 INVESTISSEUR';
    } else {
        profilLabel = '👤 ' + (data.profil || 'AUTRE').toUpperCase();
    }
    
    // Send to Formspree (même endpoint que le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `${profilLabel} - Popup Exit-Intent - ${data.prenom} ${data.nom}`);
    formDataToSend.append('_replyto', data.email);
    
    let messageBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${profilLabel} - NOUVELLE INSCRIPTION (POPUP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: Popup Exit-Intent
Type d'offre: ${data.offer_type || 'N/A'}
Page: ${data.page_url}
Date: ${new Date().toLocaleString('fr-FR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone}
Territoire: ${data.ile || 'Non renseigné'}
Profil: ${data.profil}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter ${data.prenom} ${data.nom} pour un appel
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

// Exposer les fonctions globalement pour qu'elles soient accessibles depuis onclick/onsubmit
window.closeExitIntentPopup = closeExitIntentPopup;
window.handleExitIntentSubmit = handleExitIntentSubmit;

// Fonction utilitaire pour tester le popup depuis la console
// Utilisation : window.testPopup() dans la console du navigateur
window.testPopup = function() {
    console.log('Test du popup en cours...');
    // Supprimer le cookie
    setCookie('exit_intent_shown', 'false', -1);
    // Réinitialiser la variable
    exitIntentShown = false;
    // S'assurer que le popup est initialisé
    if (!document.getElementById('exit-intent-overlay')) {
        console.log('Initialisation du popup...');
        initExitIntentPopup();
        setTimeout(() => {
            showExitIntentPopup();
        }, 100);
    } else {
        console.log('Popup trouvé, affichage...');
        showExitIntentPopup();
    }
};

// Fonction pour réinitialiser le popup (supprime le cookie)
window.resetPopup = function() {
    setCookie('exit_intent_shown', 'false', -1);
    exitIntentShown = false;
    console.log('Popup réinitialisé. Le popup s\'affichera à nouveau selon les conditions normales.');
};
