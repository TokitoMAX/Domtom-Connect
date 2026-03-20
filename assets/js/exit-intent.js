// Popup Exit Intent - Script principal

(function() {
    'use strict';

    // Variables
    let popupShown = false;
    let timeOnPage = 0;
    let mouseY = 0;
    const COOKIE_NAME = 'popup_exit_intent_shown';
    const COOKIE_DURATION = 24; // heures

    // Fonctions utilitaires pour les cookies
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

    // Obtenir l'offre spécifique à la page
    function getPageOffer() {
        const path = window.location.pathname;
        
        if (path.includes('blog')) {
            return {
                title: 'Besoin d\'aide pour votre projet ?',
                description: 'Réservez un appel découverte gratuit de 30 minutes avec notre équipe. On discute de votre projet et on vous donne des conseils personnalisés.',
                buttonText: 'Réserver mon appel gratuit'
            };
        } else if (path.includes('services')) {
            return {
                title: 'Trouvez le bon prestataire dès maintenant',
                description: 'Réservez une consultation gratuite pour identifier vos besoins et trouver les prestataires adaptés à votre projet.',
                buttonText: 'Réserver ma consultation gratuite'
            };
        } else {
            return {
                title: 'Rejoignez les pionniers gratuitement',
                description: 'Inscrivez-vous maintenant et bénéficiez d\'un accompagnement personnalisé pour faire avancer votre projet. Inscription gratuite pour les premiers membres.',
                buttonText: 'Rejoindre maintenant (gratuit)'
            };
        }
    }

    // Créer le HTML du popup
    function createPopupHTML() {
        const offer = getPageOffer();
        
        return `
            <div class="popup-overlay" id="popup-exit-intent">
                <div class="popup-container">
                    <button class="popup-close" id="popup-close-btn" aria-label="Fermer">×</button>
                    <div class="popup-header">
                        <span class="popup-badge">Offre limitée</span>
                        <h2 class="popup-title">${offer.title}</h2>
                        <p class="popup-description">${offer.description}</p>
                    </div>
                    <form class="popup-form" id="popup-form">
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
                            <option value="guyane">Guyane</option>
                            <option value="diaspora">Diaspora</option>
                            <option value="reunion">La Réunion</option>
                            <option value="mayotte">Mayotte</option>
                            <option value="polynesie">Polynésie française</option>
                            <option value="nouvelle-caledonie">Nouvelle-Calédonie</option>
                            <option value="autre">Autre</option>
                        </select>
                        <div style="margin-top: 1rem; padding: 1.25rem; background: linear-gradient(135deg, rgba(0, 191, 166, 0.08) 0%, rgba(0, 168, 150, 0.05) 100%); border: 2px solid rgba(0, 191, 166, 0.2); border-radius: 12px;">
                            <label style="display: flex; align-items: flex-start; gap: 0.875rem; cursor: pointer; font-size: 0.9rem; color: var(--text-primary, #1f2937); line-height: 1.5;">
                                <div style="position: relative; flex-shrink: 0; margin-top: 0.1rem;">
                                    <input type="checkbox" name="newsletter" value="yes" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary-color, #00BFA6); border-radius: 4px; border: 2px solid rgba(0, 191, 166, 0.3);">
                                </div>
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                                        <span style="font-size: 1.25rem; line-height: 1;">📬</span>
                                        <strong style="color: var(--primary-color, #00BFA6); font-size: 0.95rem; font-weight: 700;">Je souhaite recevoir "L'Écho Ultramarin"</strong>
                                    </div>
                                    <p style="font-size: 0.8rem; color: var(--text-secondary, #6b7280); margin: 0; line-height: 1.4;">
                                        Newsletter Domtom Connect : conseils, actualités et ressources gratuites (1 email/mois)
                                    </p>
                                    <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid rgba(0, 191, 166, 0.15);">
                                        <span style="font-size: 0.7rem; color: var(--text-muted, #9ca3af);">✓ Désinscription facile</span>
                                        <span style="font-size: 0.7rem; color: var(--text-muted, #9ca3af);">✓ Pas de spam</span>
                                        <span style="font-size: 0.7rem; color: var(--text-muted, #9ca3af);">✓ Gratuit</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <button type="submit" class="popup-submit">${offer.buttonText}</button>
                        <p class="popup-privacy">Vos données sont sécurisées. Nous vous contacterons dans les 24h.</p>
                    </form>
                </div>
            </div>
        `;
    }

    // Initialiser le popup dans le DOM
    function initPopup() {
        // Vérifier si le popup existe déjà
        if (document.getElementById('popup-exit-intent')) {
            return;
        }

        // Vérifier que le body existe
        if (!document.body) {
            setTimeout(initPopup, 100);
            return;
        }

        // Ajouter le popup au DOM
        document.body.insertAdjacentHTML('beforeend', createPopupHTML());

        // Attacher les événements
        const overlay = document.getElementById('popup-exit-intent');
        const closeBtn = document.getElementById('popup-close-btn');
        const form = document.getElementById('popup-form');

        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup);
        }

        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closePopup();
                }
            });
        }

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        // Fermer avec la touche ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
                closePopup();
            }
        });
    }

    // Afficher le popup
    function showPopup() {
        const overlay = document.getElementById('popup-exit-intent');
        if (overlay && !popupShown) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Empêcher le scroll
            
            // Focus sur le premier champ
            setTimeout(() => {
                const firstInput = overlay.querySelector('input[name="prenom"]');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 300);
        }
    }

    // Fermer le popup
    function closePopup() {
        const overlay = document.getElementById('popup-exit-intent');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Réactiver le scroll
        }
    }

    // Gérer la soumission du formulaire
    function handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validation basique
        if (!data.prenom || !data.nom || !data.email || !data.telephone || !data.profil || !data.ile) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        // Désactiver le bouton
        const submitBtn = form.querySelector('.popup-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        // Préparer les données pour Formspree
        const formDataToSend = new FormData();
        formDataToSend.append('_to', 'domtomconnect@gmail.com');
        formDataToSend.append('_subject', `Nouvelle inscription popup - ${data.prenom} ${data.nom}`);
        formDataToSend.append('_replyto', data.email);
        
        let messageBody = `Nouvelle inscription via popup exit-intent

Nom: ${data.nom}
Prénom: ${data.prenom}
Email: ${data.email}
Téléphone: ${data.telephone}
Profil: ${data.profil}
Territoire: ${data.ile}
Newsletter: ${data.newsletter ? '✅ Oui' : '❌ Non'}
Page: ${window.location.href}
Date: ${new Date().toLocaleString('fr-FR')}`;

        formDataToSend.append('message', messageBody);
        formDataToSend.append('Prénom', data.prenom);
        formDataToSend.append('Nom', data.nom);
        formDataToSend.append('Email', data.email);
        formDataToSend.append('Téléphone', data.telephone);
        formDataToSend.append('Profil', data.profil);
        formDataToSend.append('Territoire', data.ile);
        formDataToSend.append('Newsletter', data.newsletter ? 'Oui' : 'Non');

        // Envoyer à Formspree
        fetch('https://formspree.io/f/myzbqepy', {
            method: 'POST',
            body: formDataToSend,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                form.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <h3 style="color: var(--primary-color, #00BFA6); margin-bottom: 1rem; font-size: 1.5rem;">✓ Inscription réussie !</h3>
                        <p style="color: var(--text-secondary, #6b7280); margin-bottom: 1.5rem;">Merci ! Nous vous contacterons dans les 24h.</p>
                        <button type="button" class="popup-submit" onclick="window.closeExitIntentPopup()">Parfait !</button>
                    </div>
                `;
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    }

    // Vérifier les conditions pour afficher le popup
    function checkAndShow() {
        if (popupShown) return;
        if (getCookie(COOKIE_NAME) === 'true') return;

        showPopup();
        popupShown = true;
        setCookie(COOKIE_NAME, 'true', COOKIE_DURATION);
    }

    // Suivi du temps sur la page
    function startTimeTracking() {
        const startTime = Date.now();
        setInterval(() => {
            timeOnPage = Math.floor((Date.now() - startTime) / 1000);
        }, 1000);
    }

    // Suivi du mouvement de la souris
    function trackMouse(e) {
        mouseY = e.clientY;
    }

    // Détecter l'intention de sortie
    function handleMouseLeave(e) {
        if (e.clientY <= 0 && timeOnPage >= 10) {
            checkAndShow();
        }
    }

    // Initialisation principale
    function init() {
        // Vérifier si on doit forcer l'affichage (pour test)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('test-popup') === '1') {
            setCookie(COOKIE_NAME, 'false', -1);
            initPopup();
            setTimeout(showPopup, 500);
            return;
        }

        // Vérifier le cookie
        if (getCookie(COOKIE_NAME) === 'true') {
            return;
        }

        // Initialiser le popup
        initPopup();

        // Démarrer le suivi
        startTimeTracking();
        document.addEventListener('mousemove', trackMouse);
        document.addEventListener('mouseleave', handleMouseLeave);

        // Afficher après 20 secondes
        setTimeout(() => {
            if (timeOnPage >= 20) {
                checkAndShow();
            }
        }, 20000);
    }

    // Exposer les fonctions globalement
    window.closeExitIntentPopup = closePopup;
    window.showExitIntentPopup = showPopup;
    window.resetExitIntentPopup = function() {
        setCookie(COOKIE_NAME, 'false', -1);
        popupShown = false;
        console.log('Popup réinitialisé');
    };

    // Lancer l'initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

