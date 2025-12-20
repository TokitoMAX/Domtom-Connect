// Landing Pages functionality

// Initialiser le suivi du temps de remplissage pour tous les formulaires de landing
document.addEventListener('DOMContentLoaded', function() {
    const landingForm = document.getElementById('landing-form');
    const qualificationForm = document.getElementById('qualification-form');
    
    if (landingForm && window.formSecurity) {
        window.formSecurity.initFillTimeTracking(landingForm);
    }
    
    if (qualificationForm && window.formSecurity) {
        window.formSecurity.initFillTimeTracking(qualificationForm);
    }
    
    // Gérer les champs conditionnels pour "Autre"
    initConditionalFields();
    
    // Pré-remplir le formulaire de qualification si des données sont stockées
    prefillQualificationForm();
});

// Gérer l'affichage des champs conditionnels "Autre"
function initConditionalFields() {
    // Lien avec territoires
    const lienTerritoiresRadios = document.querySelectorAll('input[name="lien_territoires"]');
    const lienTerritoiresAutre = document.querySelector('input[name="lien_territoires_autre"]');
    
    if (lienTerritoiresRadios.length && lienTerritoiresAutre) {
        lienTerritoiresRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'autre') {
                    lienTerritoiresAutre.style.display = 'block';
                    lienTerritoiresAutre.required = true;
                } else {
                    lienTerritoiresAutre.style.display = 'none';
                    lienTerritoiresAutre.required = false;
                    lienTerritoiresAutre.value = '';
                }
            });
        });
    }
    
    // Objectif principal
    const objectifRadios = document.querySelectorAll('input[name="objectif_principal"]');
    const objectifAutre = document.querySelector('input[name="objectif_principal_autre"]');
    
    if (objectifRadios.length && objectifAutre) {
        objectifRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'autre') {
                    objectifAutre.style.display = 'block';
                    objectifAutre.required = true;
                } else {
                    objectifAutre.style.display = 'none';
                    objectifAutre.required = false;
                    objectifAutre.value = '';
                }
            });
        });
    }
}

// Fonctions helper pour formater les labels
function getLienTerritoiresLabel(value, autre) {
    const labels = {
        'vis-territoire': 'Je vis dans un territoire insulaire',
        'diaspora': 'Je fais partie de la diaspora',
        'projet-cible': 'Mon projet cible un territoire insulaire',
        'autre': autre || 'Autre'
    };
    return labels[value] || value || 'Non renseigné';
}

function getStadeProjetLabel(value) {
    const labels = {
        'idee-clarifiee': 'Idée clarifiée mais pas encore lancée',
        'lancement': 'Projet en cours de lancement',
        'lance': 'Activité déjà lancée (clients / utilisateurs)',
        'developpement': 'Projet en phase de développement / structuration'
    };
    return labels[value] || value || 'Non renseigné';
}

function getObjectifPrincipalLabel(value, autre) {
    const labels = {
        'structurer': 'Structurer mon projet',
        'prestataires': 'Trouver des prestataires fiables',
        'visibilite': 'Gagner en visibilité',
        'reseau': 'Me connecter à un réseau insulaire / diaspora',
        'autre': autre || 'Autre'
    };
    return labels[value] || value || 'Non renseigné';
}

function getHorizonLabel(value) {
    const labels = {
        'court': 'Court terme (0-6 mois)',
        'moyen': 'Moyen terme (6-24 mois)',
        'long': 'Long terme (2 ans et +)'
    };
    return labels[value] || value || 'Non renseigné';
}

function getBudgetLabel(value) {
    const labels = {
        'moins-300': 'Moins de 300 €',
        '300-1000': '300-1 000 €',
        '1000-3000': '1 000-3 000 €',
        'plus-3000': 'Plus de 3 000 €'
    };
    return labels[value] || value || 'Non renseigné';
}

function getEngagementLabel(value) {
    const labels = {
        'oui': 'Oui, je suis prêt à m\'engager',
        'pas-sure': 'Pas encore sûr',
        'non': 'Non, je veux juste des informations'
    };
    return labels[value] || value || 'Non renseigné';
}

// Afficher l'overlay de chargement
function showLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    const submitButton = document.getElementById('submit-btn-step1');
    
    if (overlay) {
        overlay.style.display = 'flex';
    }
    
    if (submitButton) {
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');
        
        if (buttonText) buttonText.style.opacity = '0';
        if (buttonLoader) buttonLoader.style.display = 'block';
        submitButton.disabled = true;
    }
}

// Redirection avec barre de progression
function redirectWithProgress(url, duration = 1500) {
    const progressBar = document.getElementById('redirect-progress');
    
    if (progressBar) {
        let progress = 0;
        const interval = 30; // Mise à jour toutes les 30ms
        const increment = (100 / (duration / interval));
        
        const progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                setTimeout(() => {
                    window.location.href = url;
                }, 200);
            }
            progressBar.style.width = progress + '%';
        }, interval);
    } else {
        // Fallback si la barre de progression n'existe pas
        setTimeout(() => {
            window.location.href = url;
        }, duration);
    }
}

// Pré-remplir le formulaire de qualification avec les données de l'étape 1
function prefillQualificationForm() {
    const qualificationForm = document.getElementById('qualification-form');
    if (!qualificationForm) return;
    
    // Récupérer les données stockées de l'étape 1
    const storedData = sessionStorage.getItem('domtomConnectStep1');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            // Les données sont déjà envoyées, on peut les supprimer après utilisation
            // sessionStorage.removeItem('domtomConnectStep1');
        } catch (e) {
            console.error('Erreur lors de la récupération des données:', e);
        }
    }
}

// Afficher l'overlay de chargement avec animation
function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const submitButton = document.querySelector('#submit-btn-step1');
    const buttonText = submitButton ? submitButton.querySelector('.button-text') : null;
    const buttonLoader = submitButton ? submitButton.querySelector('.button-loader') : null;
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        // Animation d'apparition
        setTimeout(() => {
            loadingOverlay.style.opacity = '1';
            const overlayContent = loadingOverlay.querySelector('div > div');
            if (overlayContent) {
                overlayContent.style.transform = 'scale(1)';
            }
        }, 10);
    }
    
    if (submitButton) {
        submitButton.disabled = true;
        if (buttonText) {
            buttonText.style.opacity = '0';
        }
        if (buttonLoader) {
            buttonLoader.style.display = 'block';
        }
    }
}

// Redirection avec barre de progression animée
function redirectWithProgress(url, delay = 1500) {
    const redirectProgress = document.getElementById('redirect-progress');
    
    if (redirectProgress) {
        let progress = 0;
        const interval = 50; // Mise à jour toutes les 50ms
        const increment = 100 / (delay / interval);
        
        const progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            redirectProgress.style.width = progress + '%';
        }, interval);
    }
    
    // Redirection après le délai
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}

function handleLandingFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Vérification de sécurité (anti-bot)
    if (window.formSecurity) {
        const securityCheck = window.formSecurity.secureFormSubmission(form, data);
        if (!securityCheck.success) {
            // Afficher les erreurs de sécurité
            const errorMessage = securityCheck.errors.join('\n');
            alert(errorMessage);
            return;
        }
    }
    
    // Détecter si c'est l'étape 1 (formulaire court) ou étape 2 (formulaire complet)
    const isStep1 = data.form_step === '1' || !data.nom_projet;
    
    // Get landing page type
    const pageType = window.location.pathname.includes('prestataires') ? 'prestataires' :
                     window.location.pathname.includes('porteurs-projets') ? 'porteurs-projets' :
                     'entreprises';
    
    // Si étape 1 (formulaire court), rediriger vers la page de qualification
    if (isStep1) {
        // Stocker les données de l'étape 1
        sessionStorage.setItem('domtomConnectStep1', JSON.stringify(data));
        
        // Afficher l'overlay de chargement
        showLoadingOverlay();
        
        // Envoyer les données de l'étape 1 en arrière-plan
        sendStep1Data(data, pageType);
        
        // Redirection automatique avec animation de progression
        redirectWithProgress('/landing/porteurs-projets/qualification.html', 1500);
        return;
    }
    
    // Add tracking data
    data.lead_source = `landing-${pageType}`;
    data.page_url = window.location.href;
    data.timestamp = new Date().toISOString();
    
    // Track the lead
    if (window.trackLead) {
        window.trackLead({
            source: `landing-${pageType}`,
            type: pageType,
            email: data.email
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton ? submitButton.querySelector('.button-text') : null;
    const buttonLoader = submitButton ? submitButton.querySelector('.button-loader') : null;
    const originalText = buttonText ? buttonText.textContent : submitButton ? submitButton.textContent : '';
    
    if (submitButton) {
        submitButton.disabled = true;
        if (buttonText) {
            buttonText.style.opacity = '0';
        } else {
            submitButton.textContent = 'Envoi en cours...';
        }
        if (buttonLoader) {
            buttonLoader.style.display = 'block';
        }
    }
    
    // Send to Formspree (même endpoint que le formulaire principal)
    const formspreeUrl = 'https://formspree.io/f/myzbqepy';
    
    // Déterminer le profil clairement
    const profil = data.profil || pageType;
    let profilLabel = '';
    if (profil === 'entreprise' || pageType === 'entreprises') {
        profilLabel = '🏢 ENTREPRISE';
    } else if (profil === 'prestataire' || pageType === 'prestataires') {
        profilLabel = '💼 PRESTATAIRE';
    } else if (profil === 'porteur-projet' || pageType === 'porteurs-projets') {
        profilLabel = '🚀 PORTEUR DE PROJET';
    } else {
        profilLabel = '👤 ' + profil.toUpperCase();
    }
    
    // Préparer les données au format FormData (comme le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    const projetNom = data.nom_projet || data.entreprise || '';
    formDataToSend.append('_subject', `${profilLabel} - ${projetNom ? projetNom + ' - ' : ''}${data.prenom} ${data.nom}`);
    formDataToSend.append('_replyto', data.email);
    
    // Construire le message de manière claire selon le profil
    let messageBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${profilLabel} - NOUVELLE INSCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: Landing Page ${pageType}
Date: ${new Date().toLocaleString('fr-FR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 BLOC 1 - PROFIL & LIEN AVEC LES TERRITOIRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}
Pays/Territoire: ${data.ile || 'Non renseigné'}
Lien avec territoires insulaires: ${getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre)}
`;

    // Bloc 2 - Projet
    if (data.nom_projet || data.description_projet || data.stade_projet) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BLOC 2 - PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom du projet/entreprise: ${data.nom_projet || 'Non renseigné'}
Description du projet: ${data.description_projet || 'Non renseigné'}
Stade du projet: ${getStadeProjetLabel(data.stade_projet)}
`;
    }
    
    // Bloc 3 - Objectifs & horizon
    if (data.objectif_principal || data.horizon) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 BLOC 3 - OBJECTIFS & HORIZON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objectif principal: ${getObjectifPrincipalLabel(data.objectif_principal, data.objectif_principal_autre)}
Horizon: ${getHorizonLabel(data.horizon)}
`;
    }
    
    // Bloc 4 - Budget & engagement
    if (data.budget || data.engagement) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BLOC 4 - BUDGET & ENGAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget: ${getBudgetLabel(data.budget)}
Engagement: ${getEngagementLabel(data.engagement)}
`;
    }
    
    if (data.commentaires) {
        messageBody += `
Commentaires additionnels: ${data.commentaires}
`;
    }
    
    // Informations spécifiques selon le profil (pour compatibilité avec anciens formulaires)
    if (data.entreprise) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 ENTREPRISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom de l'entreprise: ${data.entreprise}
`;
    }
    
    if (data.services) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 SERVICES PROPOSÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.services}
`;
    }
    
    if (data.secteur) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏭 SECTEUR D'ACTIVITÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.secteur}
`;
    }
    
    if (data.besoin) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 BESOIN PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.besoin}
`;
    }
    
    // Construire les prochaines étapes selon l'étape
    if (isStep1) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter ${data.prenom} ${data.nom} pour un appel de diagnostic (20-30 min)
2. Envoyer le formulaire de qualification complète par email
3. Après l'appel, décider (oui/non) selon alignement avec mission
4. Si oui, envoyer récap + lien paiement acompte (950€)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    } else {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter ${data.prenom} ${data.nom}${data.nom_projet ? ' (' + data.nom_projet + ')' : ''} pour un appel de diagnostic
2. Après l'appel, décider (oui/non) selon alignement avec mission
3. Si oui, envoyer récap + lien paiement acompte (950€)
4. Planifier première session de travail (diagnostic approfondi)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    }
    
    formDataToSend.append('message', messageBody);
    
    // Données structurées
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone || '');
    formDataToSend.append('Profil', data.profil || pageType);
    if (data.ile) formDataToSend.append('Territoire', data.ile);
    if (data.lien_territoires) formDataToSend.append('Lien territoires', getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre));
    if (data.nom_projet) formDataToSend.append('Nom projet', data.nom_projet);
    if (data.description_projet) formDataToSend.append('Description projet', data.description_projet);
    if (data.stade_projet) formDataToSend.append('Stade projet', getStadeProjetLabel(data.stade_projet));
    if (data.objectif_principal) formDataToSend.append('Objectif principal', getObjectifPrincipalLabel(data.objectif_principal, data.objectif_principal_autre));
    if (data.horizon) formDataToSend.append('Horizon', getHorizonLabel(data.horizon));
    if (data.budget) formDataToSend.append('Budget', getBudgetLabel(data.budget));
    if (data.engagement) formDataToSend.append('Engagement', getEngagementLabel(data.engagement));
    if (data.commentaires) formDataToSend.append('Commentaires', data.commentaires);
    // Compatibilité avec anciens formulaires
    if (data.services) formDataToSend.append('Services', data.services);
    if (data.secteur) formDataToSend.append('Secteur', data.secteur);
    if (data.entreprise) formDataToSend.append('Entreprise', data.entreprise);
    
    fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Si étape 2, afficher message de succès
            if (!isStep1) {
                // Nettoyer les données stockées
                sessionStorage.removeItem('domtomConnectStep1');
                
                // Show success message
                form.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Qualification envoyée !</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Merci ! Nous avons toutes les informations nécessaires. Nous vous contacterons très prochainement pour planifier votre appel de diagnostic.</p>
                        <a href="/merci.html" class="cta-button primary">Voir les prochaines étapes</a>
                    </div>
                `;
            }
        } else {
            return response.json().then(errData => {
                throw new Error(errData.error || 'Erreur lors de l\'envoi');
            });
        }
    })
    .catch(error => {
        console.error('Erreur détaillée:', error);
        // Message d'erreur plus informatif
        const errorMessage = error.message || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
        alert(errorMessage);
        if (submitButton) {
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoader = submitButton.querySelector('.button-loader');
            
            if (buttonText) {
                buttonText.style.opacity = '1';
            }
            if (buttonLoader) {
                buttonLoader.style.display = 'none';
            }
            submitButton.disabled = false;
            
            if (!buttonText && !buttonLoader) {
                submitButton.textContent = originalText;
            }
        }
    });
}

// Fonction pour envoyer les données de l'étape 1 en arrière-plan
function sendStep1Data(data, pageType) {
    const formspreeUrl = 'https://formspree.io/f/myzbqepy';
    const formDataToSend = new FormData();
    
    const profilLabel = '🚀 PORTEUR DE PROJET - ÉTAPE 1';
    
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `${profilLabel} - ${data.prenom} ${data.nom}`);
    formDataToSend.append('_replyto', data.email);
    
    let messageBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${profilLabel} - DEMANDE D'APPEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: Landing Page ${pageType} - Formulaire court
Date: ${new Date().toLocaleString('fr-FR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}
Territoire: ${data.ile || 'Non renseigné'}
Lien avec territoires: ${getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter ${data.prenom} ${data.nom} pour un appel de diagnostic (20-30 min)
2. Envoyer le formulaire de qualification complète par email
3. Après l'appel, décider (oui/non) selon alignement avec mission

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    formDataToSend.append('message', messageBody);
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone || '');
    formDataToSend.append('Profil', data.profil || pageType);
    formDataToSend.append('Étape', '1 - Formulaire court');
    if (data.ile) formDataToSend.append('Territoire', data.ile);
    if (data.lien_territoires) formDataToSend.append('Lien territoires', getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre));
    
    // Envoyer en arrière-plan (ne pas attendre la réponse)
    fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    }).catch(error => {
        console.error('Erreur lors de l\'envoi de l\'étape 1:', error);
    });
}

// Fonction pour gérer le formulaire de qualification (étape 2)
function handleQualificationFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Récupérer les données de l'étape 1
    const step1Data = sessionStorage.getItem('domtomConnectStep1');
    let step1 = {};
    if (step1Data) {
        try {
            step1 = JSON.parse(step1Data);
        } catch (e) {
            console.error('Erreur lors de la récupération des données étape 1:', e);
        }
    }
    
    // Fusionner les données des deux étapes
    const completeData = { ...step1, ...data, form_step: '2' };
    
    // Vérification de sécurité (anti-bot)
    if (window.formSecurity) {
        const securityCheck = window.formSecurity.secureFormSubmission(form, completeData);
        if (!securityCheck.success) {
            const errorMessage = securityCheck.errors.join('\n');
            alert(errorMessage);
            return;
        }
    }
    
    const pageType = 'porteurs-projets';
    
    // Track the lead
    if (window.trackLead) {
        window.trackLead({
            source: `qualification-${pageType}`,
            type: pageType,
            email: completeData.email || step1.email
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]') || document.getElementById('submit-btn-step2');
    const originalText = submitButton ? submitButton.textContent : '';
    
    if (submitButton) {
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');
        
        if (buttonText) {
            buttonText.style.opacity = '0.5';
        }
        if (buttonLoader) {
            buttonLoader.style.display = 'block';
        }
        submitButton.disabled = true;
        
        if (!buttonText && !buttonLoader) {
            submitButton.textContent = 'Envoi en cours...';
        }
    }
    
    // Send to Formspree
    const formspreeUrl = 'https://formspree.io/f/myzbqepy';
    const profilLabel = '🚀 PORTEUR DE PROJET - QUALIFICATION COMPLÈTE';
    
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    const projetNom = completeData.nom_projet || '';
    formDataToSend.append('_subject', `${profilLabel} - ${projetNom ? projetNom + ' - ' : ''}${completeData.prenom} ${completeData.nom}`);
    formDataToSend.append('_replyto', completeData.email);
    
    // Construire le message complet
    let messageBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${profilLabel} - QUALIFICATION COMPLÈTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: Formulaire de qualification (Étape 2)
Date: ${new Date().toLocaleString('fr-FR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 BLOC 1 - PROFIL & LIEN AVEC LES TERRITOIRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${completeData.prenom}
Nom: ${completeData.nom}
Email: ${completeData.email}
Téléphone: ${completeData.telephone || 'Non renseigné'}
Pays/Territoire: ${completeData.ile || 'Non renseigné'}
Lien avec territoires insulaires: ${getLienTerritoiresLabel(completeData.lien_territoires, completeData.lien_territoires_autre)}
`;

    // Bloc 2 - Projet
    if (completeData.nom_projet || completeData.description_projet || completeData.stade_projet) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BLOC 2 - PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom du projet/entreprise: ${completeData.nom_projet || 'Non renseigné'}
Description du projet: ${completeData.description_projet || 'Non renseigné'}
Stade du projet: ${getStadeProjetLabel(completeData.stade_projet)}
`;
    }
    
    // Bloc 3 - Objectifs & horizon
    if (completeData.objectif_principal || completeData.horizon) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 BLOC 3 - OBJECTIFS & HORIZON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objectif principal: ${getObjectifPrincipalLabel(completeData.objectif_principal, completeData.objectif_principal_autre)}
Horizon: ${getHorizonLabel(completeData.horizon)}
`;
    }
    
    // Bloc 4 - Budget & engagement
    if (completeData.budget || completeData.engagement) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BLOC 4 - BUDGET & ENGAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget: ${getBudgetLabel(completeData.budget)}
Engagement: ${getEngagementLabel(completeData.engagement)}
`;
    }
    
    if (completeData.commentaires) {
        messageBody += `
Commentaires additionnels: ${completeData.commentaires}
`;
    }
    
    messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter ${completeData.prenom} ${completeData.nom}${completeData.nom_projet ? ' (' + completeData.nom_projet + ')' : ''} pour un appel de diagnostic
2. Après l'appel, décider (oui/non) selon alignement avec mission
3. Si oui, envoyer récap + lien paiement acompte (950€)
4. Planifier première session de travail (diagnostic approfondi)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    formDataToSend.append('message', messageBody);
    
    // Données structurées
    formDataToSend.append('Prénom', completeData.prenom);
    formDataToSend.append('Nom', completeData.nom);
    formDataToSend.append('Email', completeData.email);
    formDataToSend.append('Téléphone', completeData.telephone || '');
    formDataToSend.append('Profil', completeData.profil || pageType);
    formDataToSend.append('Étape', '2 - Qualification complète');
    if (completeData.ile) formDataToSend.append('Territoire', completeData.ile);
    if (completeData.lien_territoires) formDataToSend.append('Lien territoires', getLienTerritoiresLabel(completeData.lien_territoires, completeData.lien_territoires_autre));
    if (completeData.nom_projet) formDataToSend.append('Nom projet', completeData.nom_projet);
    if (completeData.description_projet) formDataToSend.append('Description projet', completeData.description_projet);
    if (completeData.stade_projet) formDataToSend.append('Stade projet', getStadeProjetLabel(completeData.stade_projet));
    if (completeData.objectif_principal) formDataToSend.append('Objectif principal', getObjectifPrincipalLabel(completeData.objectif_principal, completeData.objectif_principal_autre));
    if (completeData.horizon) formDataToSend.append('Horizon', getHorizonLabel(completeData.horizon));
    if (completeData.budget) formDataToSend.append('Budget', getBudgetLabel(completeData.budget));
    if (completeData.engagement) formDataToSend.append('Engagement', getEngagementLabel(completeData.engagement));
    if (completeData.commentaires) formDataToSend.append('Commentaires', completeData.commentaires);
    
    fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Nettoyer les données stockées
            sessionStorage.removeItem('domtomConnectStep1');
            
            // Show success message
            form.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Qualification envoyée !</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Merci ! Nous avons toutes les informations nécessaires. Nous vous contacterons très prochainement pour planifier votre appel de diagnostic.</p>
                    <a href="/merci.html" class="cta-button primary">Voir les prochaines étapes</a>
                </div>
            `;
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
        
        if (submitButton) {
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoader = submitButton.querySelector('.button-loader');
            
            if (buttonText) {
                buttonText.style.opacity = '1';
            }
            if (buttonLoader) {
                buttonLoader.style.display = 'none';
            }
            submitButton.disabled = false;
            
            if (!buttonText && !buttonLoader) {
                submitButton.textContent = originalText;
            }
        }
    });
}

