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
    
    // Construire le message avec les champs conditionnels
    let detailsSection = '';
    
    if (data.secteur) {
        detailsSection += `🏢 Secteur d'activité: ${data.secteur}\n`;
    }
    if (data.services) {
        detailsSection += `💼 Services proposés: ${data.services}\n`;
    }
    if (data['type-investissement']) {
        detailsSection += `💰 Type d'investissement: ${data['type-investissement']}\n`;
    }
    if (data.besoin) {
        detailsSection += `🎯 Besoin principal: ${data.besoin}\n`;
    }
    if (data.detail) {
        detailsSection += `\n📝 Détails:\n${data.detail}\n`;
    }
    
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

${detailsSection ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INFORMATIONS COMPLÉMENTAIRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${detailsSection}` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    if (data.secteur) {
        formDataToSend.append('Secteur', data.secteur);
    }
    if (data.services) {
        formDataToSend.append('Services', data.services);
    }
    if (data['type-investissement']) {
        formDataToSend.append('Type investissement', data['type-investissement']);
    }
    if (data.besoin) {
        formDataToSend.append('Besoin', data.besoin);
    }
    if (data.detail) {
        formDataToSend.append('Détails', data.detail);
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
}

// Gérer les clics sur le logo et le nom pour revenir à l'accueil
function initLogoLinks() {
    // Utiliser un délai pour s'assurer que le DOM est complètement chargé
    setTimeout(function() {
        const navBrand = document.getElementById('logo-home') || document.querySelector('.nav-brand');
        if (navBrand) {
            // Supprimer tous les event listeners existants et en ajouter un nouveau
            navBrand.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                window.location.href = '/';
                return false;
            };
            
            // Forcer le style pour être sûr que c'est cliquable
            navBrand.style.cursor = 'pointer';
            navBrand.style.pointerEvents = 'auto';
            navBrand.style.zIndex = '9999';
            navBrand.style.position = 'relative';
        }
    }, 100);
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

    parallaxElements.forEach(element => {
        element.style.transform = '';
    });
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
    initLogoLinks();
    
    // Pré-remplir l'email si disponible (fonctionnalité supprimée du nouveau design)
    // L'inscription se fait uniquement via le formulaire principal
    
    // Initialiser les formulaires dynamiques
    initDynamicForms();
    
    console.log('Domtom Connect - Page d\'adhésion initialisée');
}

// Fonction pour mettre à jour les champs du formulaire selon le profil (Formulaire 1)
function updateFormFields() {
    const profilSelect = document.getElementById('profil-select');
    if (!profilSelect) return;
    
    const profil = profilSelect.value;
    
    // Suggérer la landing page appropriée
    suggestLandingPage(profil);
    
    const secteurField = document.getElementById('secteur-field');
    const servicesField = document.getElementById('services-field');
    const investissementField = document.getElementById('investissement-field');
    const besoinField = document.getElementById('besoin-field');
    const detailField = document.getElementById('detail-field');
    const detailTextarea = document.getElementById('detail-textarea');
    const detailHint = document.getElementById('detail-hint');
    
    // Masquer tous les champs conditionnels
    secteurField.style.display = 'none';
    servicesField.style.display = 'none';
    investissementField.style.display = 'none';
    besoinField.style.display = 'none';
    detailField.style.display = 'none';
    
    // Afficher les champs pertinents selon le profil
    if (profil === 'porteur-projet' || profil === 'entrepreneur') {
        secteurField.style.display = 'block';
        besoinField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Parle-nous de ton projet (optionnel)';
        detailHint.textContent = 'Ex: idée, stade du projet, besoins spécifiques...';
    } else if (profil === 'prestataire') {
        servicesField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Décris tes services et ton expérience (optionnel)';
        detailHint.textContent = 'Ex: années d\'expérience, projets réalisés, tarifs...';
    } else if (profil === 'investisseur') {
        investissementField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Décris tes critères d\'investissement (optionnel)';
        detailHint.textContent = 'Ex: montants, secteurs privilégiés, stade des projets...';
    } else if (profil === 'etudiant' || profil === 'professionnel') {
        besoinField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Parle-nous de tes motivations (optionnel)';
        detailHint.textContent = 'Ex: objectifs, intérêts, ce que tu cherches...';
    } else if (profil === 'autre') {
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Présente-toi et explique ce que tu cherches (optionnel)';
        detailHint.textContent = 'Ex: ton profil, tes besoins, tes attentes...';
    }
}

// Fonction pour mettre à jour les champs du formulaire selon le profil (Formulaire 2)
function updateFormFields2() {
    const profil = document.getElementById('profil-select-2').value;
    const secteurField = document.getElementById('secteur-field-2');
    const servicesField = document.getElementById('services-field-2');
    const investissementField = document.getElementById('investissement-field-2');
    const besoinField = document.getElementById('besoin-field-2');
    const detailField = document.getElementById('detail-field-2');
    const detailTextarea = document.getElementById('detail-textarea-2');
    const detailHint = document.getElementById('detail-hint-2');
    
    // Masquer tous les champs conditionnels
    secteurField.style.display = 'none';
    servicesField.style.display = 'none';
    investissementField.style.display = 'none';
    besoinField.style.display = 'none';
    detailField.style.display = 'none';
    
    // Afficher les champs pertinents selon le profil
    if (profil === 'porteur-projet' || profil === 'entrepreneur') {
        secteurField.style.display = 'block';
        besoinField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Parle-nous de ton projet en quelques lignes (optionnel mais recommandé)';
        detailHint.textContent = '💡 Exemples : Quelle est ton idée ? À quel stade es-tu ? Quels sont tes besoins spécifiques ? Budget estimé ?';
        detailTextarea.rows = 4;
    } else if (profil === 'prestataire') {
        servicesField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Décris tes services, ton expérience et tes tarifs (optionnel mais recommandé)';
        detailHint.textContent = '💡 Exemples : Années d\'expérience, projets réalisés, tarifs indicatifs, disponibilité, territoires couverts...';
        detailTextarea.rows = 4;
    } else if (profil === 'investisseur') {
        investissementField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Décris tes critères d\'investissement et tes attentes (optionnel mais recommandé)';
        detailHint.textContent = '💡 Exemples : Montants investis, secteurs privilégiés, stade des projets, conditions, territoires d\'intérêt...';
        detailTextarea.rows = 4;
    } else if (profil === 'etudiant' || profil === 'professionnel') {
        besoinField.style.display = 'block';
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Parle-nous de tes motivations et de ce que tu cherches (optionnel mais recommandé)';
        detailHint.textContent = '💡 Exemples : Objectifs professionnels, intérêts, ce que tu cherches dans la communauté, projets futurs...';
        detailTextarea.rows = 4;
    } else if (profil === 'autre') {
        detailField.style.display = 'block';
        detailTextarea.placeholder = 'Présente-toi et explique ce que tu cherches dans la communauté (optionnel mais recommandé)';
        detailHint.textContent = '💡 Exemples : Ton profil, tes besoins, tes attentes, comment tu peux contribuer...';
        detailTextarea.rows = 4;
    }
    
    // Ajouter un listener pour mettre à jour le hint selon le besoin sélectionné
    const besoinSelect = besoinField.querySelector('select');
    if (besoinSelect && besoinField.style.display === 'block') {
        besoinSelect.addEventListener('change', function() {
            updateDetailHintBasedOnBesoin(detailTextarea, detailHint, besoinSelect.value, profil);
        });
    }
}

// Fonction pour mettre à jour le hint du champ détail selon le besoin sélectionné
function updateDetailHintBasedOnBesoin(textarea, hint, besoin, profil) {
    if (!besoin) return;
    
    const hints = {
        'trouver-prestataires': '💡 Détaille : Quels types de prestataires ? Pour quel projet ? Budget disponible ? Délais ?',
        'rejoindre-communaute': '💡 Détaille : Pourquoi rejoindre ? Que cherches-tu ? Comment veux-tu contribuer ?',
        'developper-projet': '💡 Détaille : Stade actuel du projet ? Besoins spécifiques ? Obstacles rencontrés ?',
        'trouver-partenaires': '💡 Détaille : Type de partenaires recherchés ? Secteur ? Objectifs du partenariat ?',
        'autre-besoin': '💡 Détaille : Explique ton besoin spécifique et comment on peut t\'aider.'
    };
    
    if (hints[besoin]) {
        hint.textContent = hints[besoin];
    }
}

// Suggérer la landing page appropriée selon le profil
function suggestLandingPage(profil) {
    // Retirer l'ancienne suggestion si elle existe
    const existingSuggestion = document.getElementById('landing-page-suggestion');
    if (existingSuggestion) {
        existingSuggestion.remove();
    }
    
    if (!profil) return;
    
    const landingPages = {
        'prestataire': { url: '/landing/prestataires', text: 'prestataires' },
        'porteur-projet': { url: '/landing/porteurs-projets', text: 'porteurs de projets' },
        'entrepreneur': { url: '/landing/porteurs-projets', text: 'porteurs de projets' },
        'entreprise': { url: '/landing/entreprises', text: 'entreprises' }
    };
    
    const landing = landingPages[profil];
    if (!landing) return;
    
    // Trouver le champ profil pour insérer après
    const profilField = document.getElementById('profil-select').closest('.form-group');
    if (!profilField) return;
    
    // Créer la suggestion
    const suggestionDiv = document.createElement('div');
    suggestionDiv.id = 'landing-page-suggestion';
    suggestionDiv.style.cssText = 'margin-top: 1rem; padding: 1rem; background: rgba(0, 191, 166, 0.1); border-radius: var(--border-radius); border-left: 3px solid var(--primary-color);';
    suggestionDiv.innerHTML = `
        <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
            <strong style="color: var(--primary-color);">💡 Astuce :</strong> Pour une expérience optimisée, visitez notre 
            <a href="${landing.url}" style="color: var(--primary-color); text-decoration: underline; font-weight: 600;">page dédiée aux ${landing.text}</a>
        </p>
    `;
    
    profilField.insertAdjacentElement('afterend', suggestionDiv);
}

// Initialiser les formulaires dynamiques
function initDynamicForms() {
    // Vérifier si les formulaires existent
    const profilSelect1 = document.getElementById('profil-select');
    const profilSelect2 = document.getElementById('profil-select-2');
    
    if (profilSelect1) {
        profilSelect1.addEventListener('change', updateFormFields);
        // Déclencher l'update au chargement si une valeur est déjà sélectionnée
        if (profilSelect1.value) {
            updateFormFields();
        }
    }
    
    if (profilSelect2) {
        profilSelect2.addEventListener('change', updateFormFields2);
        // Déclencher l'update au chargement si une valeur est déjà sélectionnée
        if (profilSelect2.value) {
            updateFormFields2();
        }
    }
}

// Démarrer l'application
init();