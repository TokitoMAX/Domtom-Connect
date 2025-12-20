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
    
    // Pré-remplir le formulaire de la landing page avec les données de la page d'accueil
    if (landingForm) {
        prefillLandingForm(landingForm);
    }
    
    // Gérer les champs conditionnels pour "Autre"
    initConditionalFields();
    
    // Pré-remplir le formulaire de qualification si des données sont stockées
    prefillQualificationForm();
    
    // Initialiser l'expérience premium du formulaire
    if (landingForm) {
        initPremiumFormExperience(landingForm);
    }
    if (qualificationForm) {
        initPremiumFormExperience(qualificationForm);
    }
});

// Initialiser l'expérience premium du formulaire
function initPremiumFormExperience(form) {
    if (!form) return;
    
    // Compteur de progression en temps réel
    updateCompletionCounter(form);
    
    // Écouter les changements sur tous les champs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
        // Animation d'entrée progressive
        input.style.animationDelay = `${index * 0.05}s`;
        input.style.animation = 'slideIn 0.4s ease-out';
        input.style.animationFillMode = 'both';
        
        // Événement sur le focus
        input.addEventListener('focus', function() {
            const wrapper = this.closest('.field-wrapper');
            if (wrapper) {
                wrapper.classList.add('field-focused');
                wrapper.style.transform = 'translateY(-2px)';
                wrapper.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.15)';
            }
            animateFieldFocus(this);
        });
        
        // Événement sur le blur
        input.addEventListener('blur', function() {
            const wrapper = this.closest('.field-wrapper');
            if (wrapper) {
                wrapper.classList.remove('field-focused');
                wrapper.style.transform = 'translateY(0)';
                wrapper.style.boxShadow = 'none';
            }
            updateCompletionCounter(form);
            validateField(this);
        });
        
        // Événement sur le changement
        input.addEventListener('input', function() {
            updateCompletionCounter(form);
            validateField(this);
            showEncouragement(form);
        });
        
        // Événement sur le changement pour les selects
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                updateCompletionCounter(form);
                validateField(this);
                showEncouragement(form);
            });
        }
    });
    
    // Gérer les radio buttons avec animations
    const radios = form.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateCompletionCounter(form);
            showEncouragement(form);
            animateRadioSelection(this);
        });
    });
    
    // Effet ripple sur le bouton
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
        
        // Effet hover sur le bouton avec animation
        submitButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.5)';
            const buttonBg = this.querySelector('.button-bg');
            if (buttonBg) {
                buttonBg.style.left = '100%';
                setTimeout(() => {
                    buttonBg.style.left = '-100%';
                }, 600);
            }
        });
        
        submitButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
        });
    }
    
    // Initialiser le compteur
    updateCompletionCounter(form);
}

// Mettre à jour le compteur de progression
function updateCompletionCounter(form) {
    const counter = document.getElementById('completion-counter');
    const counterNumber = document.getElementById('completion-number');
    const counterText = document.getElementById('completion-text');
    const progressBar = form?.querySelector('.progress-bar-enhanced');
    const progressPercentage = form?.querySelector('.progress-percentage');
    
    if (!counter || !form) return;
    
    // Compter les champs remplis (éviter de compter plusieurs fois les groupes radio)
    const allRequired = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
    const uniqueFields = new Set();
    
    allRequired.forEach(field => {
        if (field.type === 'radio') {
            uniqueFields.add(field.name);
        } else {
            uniqueFields.add(field.name || field.id);
        }
    });
    
    const totalFields = uniqueFields.size;
    let filledCount = 0;
    
    uniqueFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${fieldName}"]`);
                if (Array.from(radioGroup).some(radio => radio.checked)) filledCount++;
            } else if (field.tagName === 'SELECT') {
                if (field.value && field.value !== '') filledCount++;
            } else {
                if (field.value && field.value.trim() !== '') filledCount++;
            }
        }
    });
    
    const percentage = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;
    
    // Mettre à jour l'affichage avec animation
    if (counterNumber) {
        const oldValue = parseInt(counterNumber.textContent) || 0;
        if (oldValue !== filledCount) {
            counterNumber.textContent = filledCount;
            counterNumber.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            counterNumber.style.transform = 'scale(1.3) rotate(5deg)';
            counterNumber.style.color = '#10b981';
            setTimeout(() => {
                counterNumber.style.transform = 'scale(1) rotate(0deg)';
                counterNumber.style.color = '';
            }, 300);
        }
    }
    
    if (counterText) {
        counterText.textContent = `${filledCount} sur ${totalFields} champs remplis`;
    }
    
    // Mettre à jour la barre de progression (pour étape 1, on reste à 50% max)
    if (progressBar && form.id === 'landing-form') {
        const currentStepProgress = (percentage / 100) * 50;
        progressBar.style.width = currentStepProgress + '%';
    }
    
    if (progressPercentage && form.id === 'landing-form') {
        const finalPercentage = Math.round(50 + (percentage / 100) * 50);
        progressPercentage.textContent = finalPercentage + '%';
    }
    
    // Animation du compteur
    if (counter) {
        counter.style.transition = 'all 0.3s ease';
        counter.style.transform = 'scale(1.05)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 200);
    }
}

// Valider un champ individuel avec animation
function validateField(field) {
    const wrapper = field.closest('.field-wrapper');
    if (!wrapper) return;
    
    const isValid = field.checkValidity() && (field.value && field.value.trim() !== '');
    const checkIcon = wrapper.querySelector('.field-check');
    
    if (isValid && checkIcon) {
        checkIcon.style.opacity = '1';
        checkIcon.style.transform = 'scale(1)';
        field.style.borderColor = '#10b981';
        field.style.background = 'linear-gradient(to right, #f0fdf4 0%, #ffffff 5%)';
        
        // Animation de succès
        wrapper.style.animation = 'successPulse 0.5s ease';
        setTimeout(() => {
            wrapper.style.animation = '';
        }, 500);
    } else if (checkIcon) {
        checkIcon.style.opacity = '0';
        checkIcon.style.transform = 'scale(0)';
    }
}

// Afficher des messages d'encouragement dynamiques
function showEncouragement(form) {
    const encouragementMsg = document.getElementById('encouragement-msg');
    const encouragementText = document.getElementById('encouragement-text');
    
    if (!encouragementMsg || !encouragementText || form.id !== 'landing-form') return;
    
    const allRequired = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
    const uniqueFields = new Set();
    
    allRequired.forEach(field => {
        if (field.type === 'radio') {
            uniqueFields.add(field.name);
        } else {
            uniqueFields.add(field.name || field.id);
        }
    });
    
    let filledCount = 0;
    uniqueFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${fieldName}"]`);
                if (Array.from(radioGroup).some(radio => radio.checked)) filledCount++;
            } else if (field.tagName === 'SELECT') {
                if (field.value && field.value !== '') filledCount++;
            } else {
                if (field.value && field.value.trim() !== '') filledCount++;
            }
        }
    });
    
    const totalFields = uniqueFields.size;
    const percentage = totalFields > 0 ? (filledCount / totalFields) * 100 : 0;
    
    const messages = [
        { threshold: 0, text: '🚀 Commencez par remplir vos informations de contact' },
        { threshold: 25, text: '✨ Excellent début ! Continuez comme ça' },
        { threshold: 50, text: '💪 Vous y êtes presque ! Encore quelques champs' },
        { threshold: 75, text: '🎉 Presque terminé ! Plus qu\'un dernier effort' },
        { threshold: 100, text: '✅ Parfait ! Vous pouvez maintenant envoyer votre demande' }
    ];
    
    const message = messages.slice().reverse().find(m => percentage >= m.threshold) || messages[0];
    
    if (percentage > 0 && percentage < 100) {
        encouragementText.textContent = message.text;
        encouragementMsg.style.display = 'block';
        setTimeout(() => {
            encouragementMsg.classList.add('show');
        }, 10);
    } else if (percentage === 100) {
        encouragementText.textContent = message.text;
        encouragementMsg.style.display = 'block';
        encouragementMsg.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))';
        encouragementMsg.style.border = '2px solid rgba(16, 185, 129, 0.3)';
        setTimeout(() => {
            encouragementMsg.classList.add('show');
        }, 10);
    } else {
        encouragementMsg.classList.remove('show');
        setTimeout(() => {
            encouragementMsg.style.display = 'none';
        }, 400);
    }
}

// Animer le focus d'un champ
function animateFieldFocus(field) {
    const wrapper = field.closest('.field-wrapper');
    if (wrapper) {
        wrapper.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
}

// Animer la sélection d'un radio
function animateRadioSelection(radio) {
    const label = radio.closest('.radio-label');
    if (label) {
        label.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        label.style.transform = 'scale(1.03) translateX(4px)';
        label.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
        setTimeout(() => {
            label.style.transform = 'scale(1) translateX(0)';
            label.style.boxShadow = '';
        }, 300);
    }
}

// Créer un effet ripple sur le bouton
function createRippleEffect(event, button) {
    const ripple = button.querySelector('.button-ripple');
    if (!ripple) return;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.animation = 'none';
    
    setTimeout(() => {
        ripple.style.animation = 'ripple 0.6s ease-out';
    }, 10);
}

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

// Pré-remplir le formulaire de la landing page avec les données de la page d'accueil
function prefillLandingForm(form) {
    if (!form) return;
    
    // Récupérer les données stockées de la page d'accueil
    const storedData = sessionStorage.getItem('domtomConnectHomepageData');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            
            // Préremplir les champs correspondants
            if (data.prenom) {
                const prenomField = form.querySelector('input[name="prenom"]');
                if (prenomField && !prenomField.value) {
                    prenomField.value = data.prenom;
                    prenomField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            if (data.nom) {
                const nomField = form.querySelector('input[name="nom"]');
                if (nomField && !nomField.value) {
                    nomField.value = data.nom;
                    nomField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            if (data.email) {
                const emailField = form.querySelector('input[name="email"]');
                if (emailField && !emailField.value) {
                    emailField.value = data.email;
                    emailField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            if (data.telephone) {
                const telField = form.querySelector('input[name="telephone"]');
                if (telField && !telField.value) {
                    telField.value = data.telephone;
                    telField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            if (data.ile) {
                const ileField = form.querySelector('select[name="ile"]');
                if (ileField && !ileField.value) {
                    ileField.value = data.ile;
                    ileField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            
            // Mettre à jour le compteur de progression après préremplissage
            if (window.initPremiumFormExperience) {
                setTimeout(() => {
                    updateCompletionCounter(form);
                }, 100);
            }
            
            // Supprimer les données après préremplissage (optionnel)
            // sessionStorage.removeItem('domtomConnectHomepageData');
        } catch (e) {
            console.error('Erreur lors de la récupération des données de la page d\'accueil:', e);
        }
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
    
    // Si étape 1 (formulaire court), rediriger automatiquement vers la page de qualification correspondante
    if (isStep1) {
        // Stocker les données de l'étape 1
        sessionStorage.setItem('domtomConnectStep1', JSON.stringify(data));
        
        // Déterminer l'URL de redirection selon le type de page
        let qualificationUrl = '/landing/porteurs-projets/qualification.html';
        if (pageType === 'prestataires') {
            qualificationUrl = '/landing/prestataires/qualification.html';
        } else if (pageType === 'entreprises') {
            qualificationUrl = '/landing/entreprises/qualification.html';
        }
        
        // Envoyer les données de l'étape 1 en arrière-plan (ne pas attendre)
        sendStep1Data(data, pageType).catch(err => {
            console.error('Erreur envoi étape 1:', err);
        });
        
        // Redirection automatique immédiate (pas besoin d'attendre)
        // Afficher un message de redirection rapide
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            const buttonText = submitButton.querySelector('.button-text');
            if (buttonText) {
                buttonText.innerHTML = '<span style="display: flex; align-items: center; gap: 0.5rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg> Redirection...</span>';
            }
            submitButton.disabled = true;
        }
        
        // Redirection automatique après un court délai pour permettre l'enregistrement
        setTimeout(() => {
            window.location.href = qualificationUrl;
        }, 300);
        
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
async function sendStep1Data(data, pageType) {
    const formspreeUrl = 'https://formspree.io/f/myzbqepy';
    const formDataToSend = new FormData();
    
    // Déterminer le label selon le type de page
    let profilLabel = '🚀 PORTEUR DE PROJET - ÉTAPE 1';
    if (pageType === 'prestataires') {
        profilLabel = '💼 PRESTATAIRE - ÉTAPE 1';
    } else if (pageType === 'entreprises') {
        profilLabel = '🏢 ENTREPRISE - ÉTAPE 1';
    }
    
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
    return fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    }).catch(error => {
        console.error('Erreur lors de l\'envoi de l\'étape 1:', error);
        throw error;
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

