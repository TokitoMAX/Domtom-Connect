// Fonction pour faire défiler vers le formulaire d'inscription
function scrollToForm() {
    const formSection = document.getElementById('inscription-form');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Fonction pour faire défiler vers les fonctionnalités
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Configuration Formspree
const FORMSFREE_ENDPOINT = 'https://formspree.io/f/myzbqepy';

// Fonction pour gérer la soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validation basique
    if (!data.prenom || !data.nom || !data.email || !data.telephone || !data.ile || !data.profil) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Afficher un message de confirmation
    showLoadingState();
    
    // Préparer les données pour Formspree avec un format clair pour l'email
    const formDataToSend = new FormData();
    
    // Configuration email
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `🆕 Nouvelle inscription - ${data.prenom} ${data.nom} (${data.profil})`);
    formDataToSend.append('_replyto', data.email);
    
    // Format du message pour un email lisible et actionnable
    let messageBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NOUVELLE INSCRIPTION DOMTOM CONNECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 INFORMATIONS CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Nom complet: ${data.prenom} ${data.nom}
📧 Email: ${data.email}
📱 Téléphone: ${data.telephone}
🏝️  Île/Territoire: ${data.ile}
💼 Profil: ${data.profil}

${data.message ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 MESSAGE / PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Newsletter: ${data.newsletter ? '✅ Oui' : '❌ Non'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter la personne pour un appel
2. Après l'appel, décider (oui/non)
3. Si oui, ajouter à l'écosystème WhatsApp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    formDataToSend.append('message', messageBody);
    
    // Données structurées pour Formspree (pour traitement automatique si besoin)
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone);
    formDataToSend.append('Île/Territoire', data.ile);
    formDataToSend.append('Profil', data.profil);
    if (data.message) {
        formDataToSend.append('Message/Projet', data.message);
    }
    formDataToSend.append('Newsletter', data.newsletter ? 'Oui' : 'Non');
    
    // Vérifier si Formspree est configuré
    if (FORMSFREE_ENDPOINT.includes('YOUR_FORM_ID')) {
        // Si non configuré, utiliser mailto: comme solution de secours
        console.warn('Formspree non configuré. Utilisation de mailto: comme solution de secours.');
        sendViaMailto(data);
    } else {
        // Envoyer via Formspree
        fetch(FORMSFREE_ENDPOINT, {
            method: 'POST',
            body: formDataToSend,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                hideLoadingState();
                redirectToThankYou();
            } else {
                return response.json().then(data => {
                    throw new Error(data.error || 'Erreur lors de l\'envoi');
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi via Formspree:', error);
            // En cas d'erreur, utiliser mailto: comme solution de secours
            alert('Erreur lors de l\'envoi. Ouverture de votre client email...');
            sendViaMailto(data);
        });
    }
}

// Fonction de secours pour envoyer via mailto:
function sendViaMailto(data) {
    const emailSubject = encodeURIComponent(`Nouvelle inscription - ${data.prenom} ${data.nom}`);
    const emailBody = encodeURIComponent(`
Nouvelle inscription Domtom Connect

Informations personnelles:
- Prénom: ${data.prenom}
- Nom: ${data.nom}
- Email: ${data.email}
- Téléphone: ${data.telephone}
- Île/Territoire: ${data.ile}
- Profil: ${data.profil}

${data.message ? `Message/Projet:\n${data.message}` : ''}

Newsletter: ${data.newsletter ? 'Oui' : 'Non'}
    `.trim());
    
    const mailtoLink = `mailto:domtomconnect@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoLink;
    
    setTimeout(() => {
        hideLoadingState();
        redirectToThankYou();
    }, 1000);
}

// Fonction pour afficher l'état de chargement
function showLoadingState() {
    const submitButton = document.querySelector('.inscription-form .cta-button');
    if (submitButton) {
        submitButton.innerHTML = '⏳ Envoi en cours...';
        submitButton.disabled = true;
    }
}

// Fonction pour masquer l'état de chargement
function hideLoadingState() {
    const submitButton = document.querySelector('.inscription-form .cta-button');
    if (submitButton) {
        submitButton.innerHTML = '🟢 Je rejoins Domtom Connect';
        submitButton.disabled = false;
    }
}

// Fonction pour rediriger vers la page de remerciement
function redirectToThankYou() {
    // Stocker les données dans le localStorage pour la page de remerciement
    const formData = new FormData(document.querySelector('.inscription-form'));
    const data = Object.fromEntries(formData);
    localStorage.setItem('domtomConnectData', JSON.stringify(data));
    
    // Rediriger vers la page de remerciement
    window.location.href = 'merci.html';
}

// Navigation moderne (menu burger + état collant)
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navContent = document.querySelector('.nav-content');

    if (!navbar || !navToggle || !navContent) {
        return;
    }

    const closeMenu = () => {
        navContent.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
        const isOpen = navContent.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    navToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    navContent.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.addEventListener('click', (event) => {
        const clickedOutsideMenu = !navContent.contains(event.target) && !navToggle.contains(event.target);
        if (clickedOutsideMenu && navContent.classList.contains('is-open')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navContent.classList.contains('is-open')) {
            closeMenu();
        }
    });

    const handleScroll = () => {
        if (window.scrollY > 32) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) {
            closeMenu();
        }
    });
}

// Fonction pour ajouter des animations au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .faq-item, .hero-card, .vision-card, .testimonial-card, .transformation-card');
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Fonction pour gérer les boutons CTA
function initCTAButtons() {
    // Tous les boutons CTA qui doivent rediriger vers le formulaire
    const ctaButtons = document.querySelectorAll('.cta-button[onclick="scrollToForm()"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToForm();
        });
    });
    
    // Bouton "Découvrir" dans le hero
    const discoverButton = document.querySelector('.hero-actions .cta-button.secondary');
    if (discoverButton) {
        discoverButton.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToFeatures();
        });
    }
}

// Fonction pour gérer l'inscription par email dans le hero (supprimée car pas présente dans le nouveau design)
function initEmailSignup() {
    // Cette fonction n'est plus nécessaire avec le nouveau design
    // L'inscription se fait uniquement via le formulaire principal
}

// Fonction pour ajouter des effets de parallaxe subtils
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-visual, .vision-visual, .testimonial-visual, .transformation-visual');

    if (!parallaxElements.length) {
        return;
    }

    const speed = 0.15;
    const maxTranslate = 80;
    let ticking = false;

    const updateParallax = () => {
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distanceFromCenter = elementCenter - viewportCenter;
            const translate = Math.max(
                Math.min(distanceFromCenter * -speed, maxTranslate),
                -maxTranslate
            );

            element.style.transform = `translateY(${translate}px)`;
        });
        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    updateParallax();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
}

// Fonction pour gérer les FAQ (expand/collapse)
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Fermer tous les autres éléments
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle l'élément actuel
                item.classList.toggle('active');
            });
        }
    });
}

// Fonction d'initialisation principale
function init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    // Initialiser toutes les fonctionnalités
    initNavigation();
    initScrollAnimations();
    initCTAButtons();
    initEmailSignup();
    initParallaxEffects();
    initFAQ();
    
    // Pré-remplir l'email si disponible (fonctionnalité supprimée du nouveau design)
    // L'inscription se fait uniquement via le formulaire principal
    
    console.log('Domtom Connect - Page d\'adhésion initialisée');
}

// Démarrer l'application
init();