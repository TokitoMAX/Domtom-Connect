// Landing Pages functionality

// Initialiser le suivi du temps de remplissage pour tous les formulaires de landing
document.addEventListener('DOMContentLoaded', function () {
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
        input.addEventListener('focus', function () {
            const wrapper = this.closest('.field-wrapper');
            if (wrapper) {
                wrapper.classList.add('field-focused');
                wrapper.style.transform = 'translateY(-2px)';
                wrapper.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.15)';
            }
            animateFieldFocus(this);
        });

        // Événement sur le blur
        input.addEventListener('blur', function () {
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
        input.addEventListener('input', function () {
            updateCompletionCounter(form);
            validateField(this);
            showEncouragement(form);
        });

        // Événement sur le changement pour les selects
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function () {
                updateCompletionCounter(form);
                validateField(this);
                showEncouragement(form);
            });
        }
    });

    // Gérer les radio buttons avec animations
    const radios = form.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function () {
            updateCompletionCounter(form);
            showEncouragement(form);
            animateRadioSelection(this);
        });
    });

    // Effet ripple sur le bouton
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function (e) {
            createRippleEffect(e, this);
        });

        // Effet hover sur le bouton avec animation
        submitButton.addEventListener('mouseenter', function () {
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

        submitButton.addEventListener('mouseleave', function () {
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
        { threshold: 0, text: 'Commencez par remplir vos informations de contact' },
        { threshold: 25, text: 'Excellent début ! Continuez comme ça' },
        { threshold: 50, text: 'Vous y êtes presque ! Encore quelques champs' },
        { threshold: 75, text: 'Presque terminé ! Plus qu\'un dernier effort' },
        { threshold: 100, text: 'Parfait ! Vous pouvez maintenant envoyer votre demande' }
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
            radio.addEventListener('change', function () {
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

    // Objectif principal (porteurs-projets)
    const objectifRadios = document.querySelectorAll('input[name="objectif_principal"]');
    const objectifAutre = document.querySelector('input[name="objectif_principal_autre"]');

    if (objectifRadios.length && objectifAutre) {
        objectifRadios.forEach(radio => {
            radio.addEventListener('change', function () {
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

    // Objectif (investisseurs, professionnels)
    const objectifRadiosGeneric = document.querySelectorAll('input[name="objectif"]');
    const objectifAutreGeneric = document.querySelector('input[name="objectif_autre"]');

    if (objectifRadiosGeneric.length && objectifAutreGeneric) {
        objectifRadiosGeneric.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.value === 'autre') {
                    objectifAutreGeneric.style.display = 'block';
                    objectifAutreGeneric.required = true;
                } else {
                    objectifAutreGeneric.style.display = 'none';
                    objectifAutreGeneric.required = false;
                    objectifAutreGeneric.value = '';
                }
            });
        });
    }

    // Besoin (entreprises)
    const besoinSelect = document.querySelector('select[name="besoin"]');
    const besoinAutre = document.querySelector('input[name="besoin_autre"]');

    if (besoinSelect && besoinAutre) {
        besoinSelect.addEventListener('change', function () {
            if (this.value === 'autre') {
                besoinAutre.style.display = 'block';
                besoinAutre.required = true;
            } else {
                besoinAutre.style.display = 'none';
                besoinAutre.required = false;
                besoinAutre.value = '';
            }
        });
    }

    // Services (prestataires)
    const servicesSelect = document.querySelector('select[name="services"]');
    const servicesAutre = document.querySelector('input[name="services_autre"]');

    if (servicesSelect && servicesAutre) {
        servicesSelect.addEventListener('change', function () {
            if (this.value === 'autre') {
                servicesAutre.style.display = 'block';
                servicesAutre.required = true;
            } else {
                servicesAutre.style.display = 'none';
                servicesAutre.required = false;
                servicesAutre.value = '';
            }
        });
    }

    // Secteur d'activité (entreprises)
    const secteurSelect = document.querySelector('select[name="secteur_activite"]');
    const secteurAutre = document.querySelector('input[name="secteur_activite_autre"]');

    if (secteurSelect && secteurAutre) {
        secteurSelect.addEventListener('change', function () {
            if (this.value === 'autre') {
                secteurAutre.style.display = 'block';
                secteurAutre.required = true;
            } else {
                secteurAutre.style.display = 'none';
                secteurAutre.required = false;
                secteurAutre.value = '';
            }
        });
    }

    // Type de prestations (entreprises)
    const typePrestationsSelect = document.querySelector('select[name="type_prestations"]');
    const typePrestationsAutre = document.querySelector('input[name="type_prestations_autre"]');

    if (typePrestationsSelect && typePrestationsAutre) {
        typePrestationsSelect.addEventListener('change', function () {
            if (this.value === 'autre') {
                typePrestationsAutre.style.display = 'block';
                typePrestationsAutre.required = true;
            } else {
                typePrestationsAutre.style.display = 'none';
                typePrestationsAutre.required = false;
                typePrestationsAutre.value = '';
            }
        });
    }

    // Statut juridique (prestataires)
    const statutJuridiqueSelect = document.querySelector('select[name="statut_juridique"]');
    const statutJuridiqueAutre = document.querySelector('input[name="statut_juridique_autre"]');

    if (statutJuridiqueSelect && statutJuridiqueAutre) {
        statutJuridiqueSelect.addEventListener('change', function () {
            if (this.value === 'autre') {
                statutJuridiqueAutre.style.display = 'block';
                statutJuridiqueAutre.required = true;
            } else {
                statutJuridiqueAutre.style.display = 'none';
                statutJuridiqueAutre.required = false;
                statutJuridiqueAutre.value = '';
            }
        });
    }

    // Motivation (investisseurs)
    const motivationRadios = document.querySelectorAll('input[name="motivation"]');
    const motivationAutre = document.querySelector('input[name="motivation_autre"]');

    if (motivationRadios.length && motivationAutre) {
        motivationRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.value === 'autre') {
                    motivationAutre.style.display = 'block';
                    motivationAutre.required = true;
                } else {
                    motivationAutre.style.display = 'none';
                    motivationAutre.required = false;
                    motivationAutre.value = '';
                }
            });
        });
    }

    // Attentes (investisseurs)
    const attentesRadios = document.querySelectorAll('input[name="attentes"]');
    const attentesAutre = document.querySelector('input[name="attentes_autre"]');

    if (attentesRadios.length && attentesAutre) {
        attentesRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.value === 'autre') {
                    attentesAutre.style.display = 'block';
                    attentesAutre.required = true;
                } else {
                    attentesAutre.style.display = 'none';
                    attentesAutre.required = false;
                    attentesAutre.value = '';
                }
            });
        });
    }

    // Critères (investisseurs)
    const criteresRadios = document.querySelectorAll('input[name="criteres"]');
    const criteresAutre = document.querySelector('input[name="criteres_autre"]');

    if (criteresRadios.length && criteresAutre) {
        criteresRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.value === 'autre') {
                    criteresAutre.style.display = 'block';
                    criteresAutre.required = true;
                } else {
                    criteresAutre.style.display = 'none';
                    criteresAutre.required = false;
                    criteresAutre.value = '';
                }
            });
        });
    }
}

// Fonctions helper pour formater les labels
function getNatureProjetLabel(value) {
    if (!value) return 'Non renseigné';
    const labels = {
        'physique': 'Projet physique (boutique, restaurant, atelier, local, etc.)',
        'virtuel': 'Projet virtuel/digital (site web, app, service en ligne, etc.)',
        'hybride': 'Projet hybride (combine physique et digital)',
        'autre': 'Autre type de projet'
    };
    return labels[value] || value || 'Non renseigné';
}

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
        'plus-3000': 'Plus de 3 000 €',
        'non-defini': 'Pas encore défini'
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

// Fonction pour déterminer le pack selon budget + engagement (MAJ SaaS)
function determinePackAndPayment(budget, engagement) {
    // Si pas d'engagement ou engagement = "non", pas de pack proposé d'emblée
    if (!engagement || engagement === 'non') {
        return {
            pack: null,
            packName: 'Accès Libre',
            packPrice: null,
            paymentPlan: 'Appel de découverte gratuit',
            action: 'Redirection vers ressources/communauté'
        };
    }

    // Déterminer le profil conseillé
    if (budget === 'moins-300' || budget === '300-1000') {
        return {
            pack: 'business',
            packName: 'Pack Business (Conseillé)',
            packPrice: '49€/mois',
            paymentPlan: 'Abonnement mensuel',
            action: 'Recommandation Pack Business'
        };
    } else if (budget === '1000-3000' || budget === 'plus-3000' || budget === 'non-defini') {
        return {
            pack: 'enterprise',
            packName: 'Offre Enterprise',
            packPrice: 'Sur Devis',
            paymentPlan: 'Accompagnement Sur Mesure',
            action: 'Priorité Appel Stratégique'
        };
    }

    return {
        pack: 'audit',
        packName: 'Audit Flash',
        packPrice: 'Sur Devis',
        paymentPlan: 'Diagnostic',
        action: 'Appel découverte'
    };
}

// Fonctions helper pour les prestataires
function getServicesLabel(value) {
    const labels = {
        'developpement': 'Développement web/mobile',
        'design': 'Design graphique / UI/UX',
        'marketing': 'Marketing digital / Communication',
        'comptabilite': 'Comptabilité / Fiscalité',
        'juridique': 'Juridique / Conseil',
        'coaching': 'Coaching / Formation',
        'autre': 'Autre service'
    };
    return labels[value] || value || 'Non renseigné';
}

function getExperienceLabel(value) {
    const labels = {
        'moins-1': 'Moins de 1 an',
        '1-3': '1 à 3 ans',
        '3-5': '3 à 5 ans',
        '5-10': '5 à 10 ans',
        'plus-10': 'Plus de 10 ans'
    };
    return labels[value] || value || 'Non renseigné';
}

function getTarifsLabel(value) {
    const labels = {
        'moins-300': 'Moins de 300€/jour',
        '300-500': '300€ - 500€/jour',
        '500-800': '500€ - 800€/jour',
        '800-1200': '800€ - 1200€/jour',
        'plus-1200': 'Plus de 1200€/jour',
        'au-projet': 'Tarification au projet (variable)'
    };
    return labels[value] || value || 'Non renseigné';
}

function getDisponibiliteLabel(value) {
    const labels = {
        'plein-temps': 'Plein temps',
        'mi-temps': 'Mi-temps',
        'ponctuel': 'Ponctuel / Projets',
        'limitee': 'Disponibilité limitée'
    };
    return labels[value] || value || 'Non renseigné';
}

function getStatutJuridiqueLabel(value) {
    const labels = {
        'auto-entrepreneur': 'Auto-entrepreneur / Micro-entrepreneur',
        'eurl': 'EURL',
        'sarl': 'SARL',
        'sas': 'SAS',
        'sasu': 'SASU',
        'autre': 'Autre statut'
    };
    return labels[value] || value || 'Non renseigné';
}

// Fonctions helper pour les entreprises
function getSecteurActiviteLabel(value) {
    const labels = {
        'tech': 'Technologie / Digital',
        'commerce': 'Commerce / E-commerce',
        'tourisme': 'Tourisme / Hôtellerie',
        'agroalimentaire': 'Agroalimentaire',
        'services': 'Services aux entreprises',
        'culture': 'Culture / Événementiel',
        'sante': 'Santé / Bien-être',
        'education': 'Éducation / Formation',
        'autre': 'Autre secteur'
    };
    return labels[value] || value || 'Non renseigné';
}

function getTailleEntrepriseLabel(value) {
    const labels = {
        'micro': 'Micro-entreprise (0-1 salarié)',
        'tpe': 'TPE (2-9 salariés)',
        'pme': 'PME (10-49 salariés)',
        'et': 'ETI (50-249 salariés)',
        'ge': 'Grande entreprise (250+ salariés)'
    };
    return labels[value] || value || 'Non renseigné';
}

function getBesoinLabel(value) {
    const labels = {
        'trouver-prestataires': 'Trouver des prestataires',
        'developper-projet': 'Développer un projet',
        'trouver-partenaires': 'Trouver des partenaires',
        'autre': 'Autre besoin'
    };
    return labels[value] || value || 'Non renseigné';
}

function getTypePrestationsLabel(value) {
    const labels = {
        'developpement': 'Développement web/mobile',
        'design': 'Design / Identité visuelle',
        'marketing': 'Marketing / Communication',
        'comptabilite': 'Comptabilité / Fiscalité',
        'juridique': 'Juridique / Conseil',
        'formation': 'Formation / Coaching',
        'multiple': 'Plusieurs types de prestations',
        'autre': 'Autre'
    };
    return labels[value] || value || 'Non renseigné';
}

function getNombrePrestatairesLabel(value) {
    const labels = {
        '1': '1 prestataire',
        '2-3': '2 à 3 prestataires',
        '4-5': '4 à 5 prestataires',
        'plus-5': 'Plus de 5 prestataires',
        'non-defini': 'À définir selon les besoins'
    };
    return labels[value] || value || 'Non renseigné';
}

function getBudgetEntrepriseLabel(value) {
    const labels = {
        'moins-2000': 'Moins de 2 000€',
        '2000-5000': '2 000€ - 5 000€',
        '5000-10000': '5 000€ - 10 000€',
        '10000-25000': '10 000€ - 25 000€',
        'plus-25000': 'Plus de 25 000€',
        'a-definir': 'À définir selon les besoins'
    };
    return labels[value] || value || 'Non renseigné';
}

function getUrgenceLabel(value) {
    const labels = {
        'immediat': 'Immédiat (dans les 2 semaines)',
        'court-terme': 'Court terme (1-3 mois)',
        'moyen-terme': 'Moyen terme (3-6 mois)',
        'long-terme': 'Long terme (6+ mois)',
        'exploration': 'En phase d\'exploration'
    };
    return labels[value] || value || 'Non renseigné';
}

// Fonctions helper pour validation croisée - Prestataires
function getProjets12MoisLabel(value) {
    const labels = {
        '0': 'Aucun',
        '1-3': '1 à 3 projets',
        '4-10': '4 à 10 projets',
        'plus-10': 'Plus de 10 projets'
    };
    return labels[value] || value || 'Non renseigné';
}

function getTauxSatisfactionLabel(value) {
    const labels = {
        'moins-70': 'Moins de 70%',
        '70-85': '70% - 85%',
        '85-95': '85% - 95%',
        'plus-95': 'Plus de 95%',
        'pas-encore': 'Je n\'ai pas encore assez de retours pour estimer'
    };
    return labels[value] || value || 'Non renseigné';
}

// Fonctions helper pour validation croisée - Entreprises
function getAncienneteEntrepriseLabel(value) {
    const labels = {
        'moins-1': 'Moins de 1 an',
        '1-3': '1 à 3 ans',
        '3-5': '3 à 5 ans',
        '5-10': '5 à 10 ans',
        'plus-10': 'Plus de 10 ans'
    };
    return labels[value] || value || 'Non renseigné';
}

function getPrestatairesPrecedentsLabel(value) {
    const labels = {
        '0': 'Aucun',
        '1-3': '1 à 3 prestataires',
        '4-10': '4 à 10 prestataires',
        'plus-10': 'Plus de 10 prestataires'
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
            console.log('Données récupérées pour préremplissage:', data);

            // Préremplir les champs correspondants
            if (data.prenom) {
                const prenomField = form.querySelector('input[name="prenom"]');
                if (prenomField) {
                    prenomField.value = data.prenom;
                    prenomField.dispatchEvent(new Event('input', { bubbles: true }));
                    prenomField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            if (data.nom) {
                const nomField = form.querySelector('input[name="nom"]');
                if (nomField) {
                    nomField.value = data.nom;
                    nomField.dispatchEvent(new Event('input', { bubbles: true }));
                    nomField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            if (data.email) {
                const emailField = form.querySelector('input[name="email"]');
                if (emailField) {
                    emailField.value = data.email;
                    emailField.dispatchEvent(new Event('input', { bubbles: true }));
                    emailField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            if (data.telephone) {
                const telField = form.querySelector('input[name="telephone"]');
                if (telField) {
                    telField.value = data.telephone;
                    telField.dispatchEvent(new Event('input', { bubbles: true }));
                    telField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // Gérer les nouveaux champs pour porteurs-projets
            if (data.origine) {
                const origineField = form.querySelector('select[name="origine"]');
                if (origineField) {
                    origineField.value = data.origine;
                    origineField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            if (data.lieu_actuel) {
                const lieuActuelField = form.querySelector('select[name="lieu_actuel"]');
                if (lieuActuelField) {
                    lieuActuelField.value = data.lieu_actuel;
                    lieuActuelField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            // Compatibilité avec ancien champ ile
            if (data.ile) {
                const ileField = form.querySelector('select[name="ile"]');
                if (ileField) {
                    ileField.value = data.ile;
                    ileField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // Mettre à jour le compteur de progression après préremplissage
            setTimeout(() => {
                if (typeof updateCompletionCounter === 'function') {
                    updateCompletionCounter(form);
                }
            }, 200);

            console.log('Préremplissage terminé');
        } catch (e) {
            console.error('Erreur lors de la récupération des données de la page d\'accueil:', e);
        }
    } else {
        console.log('Aucune donnée trouvée dans sessionStorage pour préremplissage');
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

    // FORCER la récupération des champs de base depuis le FormData
    // Si les champs sont manquants, essayer de les récupérer depuis les inputs du formulaire
    if (!data.prenom || data.prenom.trim() === '') {
        const prenomInput = form.querySelector('[name="prenom"], [name="question_prenom"], input[id*="prenom"]');
        if (prenomInput && prenomInput.value) {
            data.prenom = prenomInput.value.trim();
            formData.set('prenom', data.prenom);
        }
    }
    if (!data.nom || data.nom.trim() === '') {
        const nomInput = form.querySelector('[name="nom"], [name="question_nom"], input[id*="nom"]');
        if (nomInput && nomInput.value) {
            data.nom = nomInput.value.trim();
            formData.set('nom', data.nom);
        }
    }
    if (!data.email || data.email.trim() === '') {
        const emailInput = form.querySelector('[name="email"], [name="question_email"], input[type="email"]');
        if (emailInput && emailInput.value) {
            data.email = emailInput.value.trim();
            formData.set('email', data.email);
        }
    }
    if (!data.telephone || data.telephone.trim() === '') {
        const telephoneInput = form.querySelector('[name="telephone"], [name="question_telephone"], input[type="tel"]');
        if (telephoneInput && telephoneInput.value) {
            data.telephone = telephoneInput.value.trim();
            formData.set('telephone', data.telephone);
        }
    }

    // Log pour debug
    console.log('📧 handleLandingFormSubmit - Données après nettoyage:', {
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        profil: data.profil
    });

    // Log pour debug
    console.log('📧 handleLandingFormSubmit - Données reçues:', {
        email: data.email,
        question_email: data.question_email,
        formDataEntries: Array.from(formData.entries()).filter(([key]) => key.includes('email') || key === 'email')
    });

    // Vérification de sécurité (anti-bot) - SEULEMENT pour les bots évidents (honeypot)
    if (window.formSecurity) {
        const securityCheck = window.formSecurity.secureFormSubmission(form, data);
        // Ne bloquer QUE si c'est un bot évident (honeypot rempli)
        if (!securityCheck.success && securityCheck.errors.some(err => err.toLowerCase().includes('suspecte'))) {
            const errorMessage = securityCheck.errors.join('\n');
            alert(errorMessage);
            return;
        }
        // Pour tout le reste, on continue et on envoie
    }

    // Get landing page type
    let pageType = 'porteurs-projets'; // default
    if (window.location.pathname.includes('prestataires')) {
        pageType = 'prestataires';
    } else if (window.location.pathname.includes('porteurs-projets') || window.location.pathname.includes('entrepreneurs')) {
        pageType = 'porteurs-projets'; // entrepreneurs redirigé vers porteurs-projets
    } else if (window.location.pathname.includes('entreprises') || window.location.pathname.includes('professionnels')) {
        pageType = 'entreprises'; // professionnels redirigé vers entreprises
    } else if (window.location.pathname.includes('investisseurs')) {
        pageType = 'investisseurs';
    }

    // Détecter si c'est l'étape 1 (formulaire court) ou étape 2 (formulaire complet)
    // Les prestataires, entreprises et investisseurs n'ont pas de formulaire de qualification, ils envoient directement
    // Ne plus rediriger vers le formulaire de qualification
    // Le formulaire complet est maintenant soumis directement

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

    // Déterminer le profil clairement (priorité à data.profil, puis pageType, puis URL)
    let profil = data.profil || pageType;

    // Si profil n'est toujours pas défini, essayer de le détecter depuis l'URL
    if (!profil || profil === 'porteurs-projets') {
        if (window.location.pathname.includes('prestataires')) {
            profil = 'prestataire';
        } else if (window.location.pathname.includes('entreprises') || window.location.pathname.includes('professionnels')) {
            profil = 'entreprise';
        } else if (window.location.pathname.includes('investisseurs')) {
            profil = 'investisseur';
        } else if (window.location.pathname.includes('porteurs-projets') || window.location.pathname.includes('entrepreneurs')) {
            profil = 'porteur-projet';
        }
    }

    // Normaliser les valeurs de profil
    if (profil === 'porteurs-projets') profil = 'porteur-projet';
    if (profil === 'entrepreneurs') profil = 'porteur-projet';
    if (profil === 'professionnels') profil = 'entreprise';

    let profilLabel = '';
    if (profil === 'entreprise' || pageType === 'entreprises') {
        profilLabel = '🏢 ENTREPRISE';
    } else if (profil === 'prestataire' || pageType === 'prestataires') {
        profilLabel = '💼 PRESTATAIRE';
    } else if (profil === 'porteur-projet' || pageType === 'porteurs-projets') {
        profilLabel = '🚀 PORTEUR DE PROJET / ENTREPRENEUR';
    } else if (profil === 'investisseur' || pageType === 'investisseurs') {
        profilLabel = '💰 INVESTISSEUR';
    } else {
        profilLabel = '👤 ' + (profil || 'NON_DEFINI').toUpperCase();
    }

    // S'assurer que data.profil est défini pour les logs
    if (!data.profil) {
        data.profil = profil;
    }

    // Préparer les données au format FormData (comme le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    const projetNom = data.nom_projet || data.entreprise || '';
    formDataToSend.append('_subject', `${profilLabel} - ${projetNom ? projetNom + ' - ' : ''}${data.prenom} ${data.nom}`);

    // Valider et normaliser l'email pour _replyto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Récupérer l'email depuis plusieurs sources possibles
    let replyToEmail = data.email ||
        data['question_email'] ||
        formData.get('email') ||
        formData.get('question_email') ||
        '';

    // Si toujours pas d'email, chercher dans le DOM
    if (!replyToEmail || replyToEmail.trim() === '') {
        const emailInput = form.querySelector('input[type="email"], input[name="email"], input[name="question_email"], input[id*="email"]');
        if (emailInput && emailInput.value) {
            replyToEmail = emailInput.value;
        }
    }

    // Nettoyer l'email (supprimer les espaces)
    if (replyToEmail) {
        replyToEmail = replyToEmail.trim();
    }

    // Vérifier que l'email est valide, mais ne PAS bloquer l'envoi
    if (!replyToEmail || !emailRegex.test(replyToEmail)) {
        console.warn('⚠️ Email invalide ou manquant, recherche dans tous les champs...');

        // Dernière tentative : chercher dans TOUS les inputs du formulaire
        const allInputs = form.querySelectorAll('input, textarea, select');
        for (const input of allInputs) {
            const value = input.value || '';
            if (value.includes('@') && value.includes('.')) {
                replyToEmail = value.trim();
                console.log('✅ Email trouvé dans un input:', replyToEmail);
                break;
            }
        }

        // Si toujours pas d'email valide, utiliser une valeur par défaut
        if (!replyToEmail || !emailRegex.test(replyToEmail)) {
            console.warn('⚠️ Utilisation d\'une valeur par défaut pour permettre l\'envoi');
            replyToEmail = data.prenom && data.nom
                ? `${data.prenom.toLowerCase()}.${data.nom.toLowerCase()}@domtomconnect-temp.com`
                : 'contact@domtomconnect-temp.com';
        }
    }

    // S'assurer que data.email est défini pour la suite
    data.email = replyToEmail;
    console.log('📧 Email final utilisé pour l\'envoi:', data.email);

    formDataToSend.append('_replyto', replyToEmail);

    // Construire le message de manière claire selon le profil
    let messageBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${profilLabel} - NOUVELLE INSCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: Landing Page ${pageType}
Date: ${new Date().toLocaleString('fr-FR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 BLOC 1 - PROFIL & ORIGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}
Origine/Territoire d'origine: ${data.origine || data.ile || 'Non renseigné'}
Lieu actuel: ${data.lieu_actuel || 'Non renseigné'}
`;

    // Bloc 2 - Projet
    if (data.nom_projet || data.description_projet || data.stade_projet || data.nature_projet) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BLOC 2 - PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom du projet/entreprise: ${data.nom_projet || 'Non renseigné'}
Description du projet: ${data.description_projet || 'Non renseigné'}
Nature du projet: ${getNatureProjetLabel(data.nature_projet) || 'Non renseigné'}
Localisation du projet: ${data.localisation_projet || 'Non renseigné'}
Stade du projet: ${getStadeProjetLabel(data.stade_projet)}
${data.besoins_physique ? `Besoins spécifiques (physique): ${data.besoins_physique}` : ''}
${data.besoins_virtuel ? `Besoins spécifiques (digital): ${data.besoins_virtuel}` : ''}
${data.besoins_hybride ? `Besoins spécifiques (hybride): ${data.besoins_hybride}` : ''}
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

    // Bloc 4 - Pack, Budget & engagement
    if (data.budget || data.engagement) {
        // Déterminer le pack et les facilités de paiement selon budget + engagement
        const packInfo = determinePackAndPayment(data.budget, data.engagement);

        let packSection = '';
        if (packInfo.pack) {
            packSection = `
Pack sélectionné: ${packInfo.packName} (${packInfo.packPrice})
Plan de paiement: ${packInfo.paymentPlan}
Détails paiement: ${packInfo.paymentDetails}
Action recommandée: ${packInfo.action}`;
        } else {
            packSection = `
Pack: ${packInfo.packName}
Plan: ${packInfo.paymentPlan}
Action: ${packInfo.action}`;
        }

        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BLOC 4 - BUDGET & ENGAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget: ${getBudgetLabel(data.budget)}
Engagement: ${getEngagementLabel(data.engagement)}
${packSection}
`;
    }

    if (data.commentaires) {
        messageBody += `
Commentaires additionnels: ${data.commentaires}
`;
    }

    // Certification pour porteurs-projets
    if ((pageType === 'porteurs-projets' || pageType === 'porteur-projet') && data.certification) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Certification acceptée: OUI
`;
    }

    // Ajouter le pack dans les données structurées pour porteurs-projets
    if ((pageType === 'porteurs-projets' || pageType === 'porteur-projet')) {
        if (data.budget || data.engagement) {
            const packInfo = determinePackAndPayment(data.budget, data.engagement);
            if (packInfo.pack) {
                formDataToSend.append('Pack sélectionné', `${packInfo.packName} (${packInfo.packPrice})`);
                formDataToSend.append('Plan de paiement', packInfo.paymentPlan);
                formDataToSend.append('Détails paiement', packInfo.paymentDetails);
                formDataToSend.append('Action recommandée', packInfo.action);
            } else {
                formDataToSend.append('Pack sélectionné', packInfo.packName);
                formDataToSend.append('Action', packInfo.action);
            }
        }
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

    // Informations spécifiques pour Prestataires
    if (pageType === 'prestataires' || data.services) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 PRESTATAIRE - QUALIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Services proposés: ${data.services === 'autre' ? (data.services_autre || 'Autre') : (getServicesLabel(data.services) || 'Non renseigné')}
Statut juridique: ${data.statut_juridique === 'autre' ? (data.statut_juridique_autre || 'Autre') : (getStatutJuridiqueLabel(data.statut_juridique) || 'Non renseigné')}
SIRET/SIREN: ${data.siret || 'Non renseigné'}
Expérience: ${getExperienceLabel(data.experience) || 'Non renseigné'}
Réalisations: ${data.realisations || 'Non renseigné'}
Portfolio/Site web: ${data.portfolio || 'Non renseigné'}
LinkedIn: ${data.linkedin || 'Non renseigné (optionnel)'}
Liens vers réalisations: ${data.realisations_liens || 'Non renseigné (optionnel)'}
Compétences/Outils: ${data.competences || 'Non renseigné'}
Fourchette de tarifs: ${getTarifsLabel(data.tarifs) || 'Non renseigné'}
Disponibilité: ${getDisponibiliteLabel(data.disponibilite) || 'Non renseigné'}
Références/Témoignages: ${data.references || 'Non renseigné'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VALIDATION CROISÉE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Projets similaires (12 derniers mois): ${getProjets12MoisLabel(data.projets_12_mois) || 'Non renseigné'}
Taux de satisfaction client: ${getTauxSatisfactionLabel(data.taux_satisfaction) || 'Non renseigné'}
Certification acceptée: ${data.certification ? 'OUI' : 'NON'}
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

    // Informations spécifiques pour Investisseurs (simplifié)
    if (pageType === 'investisseurs') {
        const montantLabel = data.montant_mensuel === '29' ? '29€/mois (ou 300€/an) - Moins de 50 000€ d\'investissement' :
            data.montant_mensuel === '49' ? '49€/mois (ou 500€/an) - 50 000€ à 200 000€ d\'investissement' :
                data.montant_mensuel === '99' ? '99€/mois (ou 1 000€/an) - Plus de 200 000€ d\'investissement' :
                    data.montant_mensuel || 'Non renseigné';

        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 INVESTISSEUR - INFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cotisation mensuelle souhaitée: ${montantLabel}

Pourquoi investir dans les territoires ultramarins:
${data.pourquoi_investir || 'Non renseigné'}
`;
    }

    // Informations spécifiques pour Entreprises
    if (pageType === 'entreprises') {
        // Normaliser le budget pour utiliser la fonction determinePackAndPayment
        let normalizedBudget = null;
        if (data.budget_accompagnement) {
            const budgetValue = data.budget_accompagnement;
            if (budgetValue === '300-1000' || budgetValue.includes('300-1 000') || budgetValue.includes('300-1000')) {
                normalizedBudget = '300-1000';
            } else if (budgetValue === '1000-3000' || budgetValue === 'plus-3000' ||
                budgetValue.includes('1 000-3 000') || budgetValue.includes('plus de 3 000')) {
                normalizedBudget = '1000-3000';
            } else if (budgetValue === 'moins-300' || budgetValue.includes('moins de 300')) {
                normalizedBudget = 'moins-300';
            }
        }

        // Déterminer le pack et les facilités selon budget + engagement
        const packInfo = determinePackAndPayment(normalizedBudget, data.engagement);

        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 ENTREPRISE - QUALIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entreprise: ${data.entreprise || 'Non renseigné'}
Site web: ${data.site_web || 'Non renseigné'}
SIRET: ${data.siret || 'Non renseigné'}
LinkedIn: ${data.linkedin || 'Non renseigné (optionnel)'}
Secteur d'activité: ${data.secteur_activite === 'autre' ? (data.secteur_activite_autre || 'Autre') : (getSecteurActiviteLabel(data.secteur_activite) || 'Non renseigné')}
Taille de l'entreprise: ${getTailleEntrepriseLabel(data.taille_entreprise) || 'Non renseigné'}
Besoin principal: ${data.besoin === 'autre' ? (data.besoin_autre || 'Autre') : (getBesoinLabel(data.besoin) || 'Non renseigné')}
Type de prestations recherchées: ${data.type_prestations === 'autre' ? (data.type_prestations_autre || 'Autre') : (getTypePrestationsLabel(data.type_prestations) || 'Non renseigné')}
Nombre de prestataires recherchés: ${getNombrePrestatairesLabel(data.nombre_prestataires) || 'Non renseigné'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BUDGET & PACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget d'accompagnement Domtom Connect: ${data.budget_accompagnement || 'Non renseigné'}
${data.engagement ? `Engagement: ${getEngagementLabel(data.engagement)}` : ''}
${packInfo.pack ? `
Pack recommandé: ${packInfo.packName} (${packInfo.packPrice})
Plan de paiement: ${packInfo.paymentPlan}
Détails paiement: ${packInfo.paymentDetails}
Action recommandée: ${packInfo.action}
Statut éligibilité: ✓ Éligible` : `
Pack: ${packInfo.packName}
Action: ${packInfo.action}
Statut éligibilité: ⚠ Non éligible`}
Budget estimé pour prestations (hors accompagnement): ${getBudgetEntrepriseLabel(data.budget) || 'Non renseigné'}
Urgence du besoin: ${getUrgenceLabel(data.urgence) || 'Non renseigné'}
Description du besoin: ${data.description_besoin || 'Non renseigné'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VALIDATION CROISÉE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ancienneté entreprise: ${getAncienneteEntrepriseLabel(data.anciennete_entreprise) || 'Non renseigné'}
Prestataires précédents: ${getPrestatairesPrecedentsLabel(data.prestataires_precedents) || 'Non renseigné'}
Certification acceptée: ${data.certification ? 'OUI' : 'NON'}
`;

        // Ajouter les informations de pack dans FormData
        if (packInfo.pack) {
            formDataToSend.append('Pack Recommandé', `${packInfo.packName} (${packInfo.packPrice})`);
            formDataToSend.append('Plan de paiement', packInfo.paymentPlan);
            formDataToSend.append('Détails paiement', packInfo.paymentDetails);
            formDataToSend.append('Action recommandée', packInfo.action);
            formDataToSend.append('Éligible', 'Oui');
        } else {
            formDataToSend.append('Pack Recommandé', packInfo.packName);
            formDataToSend.append('Action', packInfo.action);
            formDataToSend.append('Éligible', 'Non');
        }
    }

    // Informations spécifiques pour Autre
    if (pageType === 'autre') {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 AUTRE - INFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rôle/Profil: ${data.role_profil || 'Non renseigné'}
Besoin: ${data.besoin || 'Non renseigné'}
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
    if (data.origine) formDataToSend.append('Origine', data.origine);
    if (data.lieu_actuel) formDataToSend.append('Lieu actuel', data.lieu_actuel);
    if (data.ile) formDataToSend.append('Territoire', data.ile); // Compatibilité ancien formulaire
    if (data.lien_territoires) formDataToSend.append('Lien territoires', getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre)); // Compatibilité ancien formulaire
    if (data.nom_projet) formDataToSend.append('Nom projet', data.nom_projet);
    if (data.description_projet) formDataToSend.append('Description projet', data.description_projet);
    if (data.nature_projet) formDataToSend.append('Nature projet', getNatureProjetLabel(data.nature_projet));
    if (data.localisation_projet) formDataToSend.append('Localisation projet', data.localisation_projet);
    if (data.besoins_physique) formDataToSend.append('Besoins physique', data.besoins_physique);
    if (data.besoins_virtuel) formDataToSend.append('Besoins digital', data.besoins_virtuel);
    if (data.besoins_hybride) formDataToSend.append('Besoins hybride', data.besoins_hybride);
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

    // Informations spécifiques pour Prestataires
    if (pageType === 'prestataires') {
        if (data.statut_juridique) formDataToSend.append('Statut juridique', data.statut_juridique === 'autre' ? (data.statut_juridique_autre || 'Autre') : getStatutJuridiqueLabel(data.statut_juridique));
        if (data.siret) formDataToSend.append('SIRET/SIREN', data.siret);
        if (data.services) formDataToSend.append('Services proposés', data.services === 'autre' ? (data.services_autre || 'Autre') : getServicesLabel(data.services));
        if (data.experience) formDataToSend.append('Expérience', getExperienceLabel(data.experience));
        if (data.realisations) formDataToSend.append('Réalisations', data.realisations);
        if (data.portfolio) formDataToSend.append('Portfolio', data.portfolio);
        if (data.linkedin) formDataToSend.append('LinkedIn', data.linkedin);
        if (data.realisations_liens) formDataToSend.append('Liens réalisations', data.realisations_liens);
        if (data.competences) formDataToSend.append('Compétences', data.competences);
        if (data.tarifs) formDataToSend.append('Tarifs', getTarifsLabel(data.tarifs));
        if (data.disponibilite) formDataToSend.append('Disponibilité', getDisponibiliteLabel(data.disponibilite));
        if (data.references) formDataToSend.append('Références', data.references);
        if (data.projets_12_mois) formDataToSend.append('Projets 12 mois', getProjets12MoisLabel(data.projets_12_mois));
        if (data.taux_satisfaction) formDataToSend.append('Taux satisfaction', getTauxSatisfactionLabel(data.taux_satisfaction));
        if (data.certification) formDataToSend.append('Certification', 'OUI');
    }

    // Informations spécifiques pour Entreprises
    if (pageType === 'entreprises') {
        if (data.site_web) formDataToSend.append('Site web', data.site_web);
        if (data.siret) formDataToSend.append('SIRET', data.siret);
        if (data.linkedin) formDataToSend.append('LinkedIn', data.linkedin);
        if (data.secteur_activite) formDataToSend.append('Secteur d\'activité', data.secteur_activite === 'autre' ? (data.secteur_activite_autre || 'Autre') : getSecteurActiviteLabel(data.secteur_activite));
        if (data.taille_entreprise) formDataToSend.append('Taille entreprise', getTailleEntrepriseLabel(data.taille_entreprise));
        if (data.besoin) formDataToSend.append('Besoin', data.besoin === 'autre' ? (data.besoin_autre || 'Autre') : getBesoinLabel(data.besoin));
        if (data.type_prestations) formDataToSend.append('Type prestations', data.type_prestations === 'autre' ? (data.type_prestations_autre || 'Autre') : getTypePrestationsLabel(data.type_prestations));
        if (data.nombre_prestataires) formDataToSend.append('Nombre prestataires', getNombrePrestatairesLabel(data.nombre_prestataires));
        if (data.budget) formDataToSend.append('Budget', getBudgetEntrepriseLabel(data.budget));
        if (data.budget_accompagnement) formDataToSend.append('Budget Accompagnement', data.budget_accompagnement);
        if (data.urgence) formDataToSend.append('Urgence', getUrgenceLabel(data.urgence));
        if (data.description_besoin) formDataToSend.append('Description besoin', data.description_besoin);
        if (data.anciennete_entreprise) formDataToSend.append('Ancienneté', getAncienneteEntrepriseLabel(data.anciennete_entreprise));
        if (data.prestataires_precedents) formDataToSend.append('Prestataires précédents', getPrestatairesPrecedentsLabel(data.prestataires_precedents));
        if (data.certification) formDataToSend.append('Certification', 'OUI');
    }

    // Nouvelles données selon profil
    if (data.type_investissement) formDataToSend.append('Type investissement', data.type_investissement);
    if (data.montant_investissement) formDataToSend.append('Montant investissement', data.montant_investissement);
    if (data.secteurs_interet) formDataToSend.append('Secteurs intérêt', data.secteurs_interet);
    if (data.experience_investissement) formDataToSend.append('Expérience investissement', data.experience_investissement);
    if (data.secteur_activite) formDataToSend.append('Secteur activité', data.secteur_activite);
    if (data.poste) formDataToSend.append('Poste', data.poste);
    if (data.role_profil) formDataToSend.append('Rôle/Profil', data.role_profil);
    if (data.objectif) formDataToSend.append('Objectif', data.objectif === 'autre' ? (data.objectif_autre || 'Autre') : data.objectif);
    if (data.besoin && typeof data.besoin === 'string' && data.besoin.length > 50) formDataToSend.append('Besoin', data.besoin);

    // Champs spécifiques pour Investisseurs
    if (pageType === 'investisseurs') {
        if (data.motivation) formDataToSend.append('Motivation', data.motivation === 'autre' ? (data.motivation_autre || 'Autre') : data.motivation);
        if (data.attentes) formDataToSend.append('Attentes', data.attentes === 'autre' ? (data.attentes_autre || 'Autre') : data.attentes);
        if (data.criteres) formDataToSend.append('Critères', data.criteres === 'autre' ? (data.criteres_autre || 'Autre') : data.criteres);
        if (data.certification) formDataToSend.append('Certification', 'OUI');

        // Ajouter certification dans le message body pour investisseurs
        if (data.certification) {
            messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Certification acceptée: OUI
`;
        }
    }

    // Ajouter certification pour porteurs-projets dans les données structurées
    if ((pageType === 'porteurs-projets' || pageType === 'porteur-projet') && data.certification) {
        formDataToSend.append('Certification', 'OUI');
    }

    fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log('📧 Réponse Formspree reçue:', response.status, response.statusText);

            if (response.ok) {
                console.log('✅ Email envoyé avec succès depuis la landing page:', {
                    pageType: pageType,
                    profil: profilLabel,
                    email: data.email,
                    nom: data.nom,
                    prenom: data.prenom
                });

                // Restaurer le bouton même en cas de succès (avant d'afficher le message)
                if (submitButton) {
                    submitButton.disabled = false;
                    const buttonText = submitButton.querySelector('.button-text');
                    const buttonLoader = submitButton.querySelector('.button-loader');

                    if (buttonText) {
                        buttonText.style.opacity = '1';
                    } else {
                        submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Envoyer';
                    }
                    if (buttonLoader) {
                        buttonLoader.style.display = 'none';
                    }
                }

                // Si étape 2 ou formulaire complet (tous les profils), afficher message de succès
                if (!isStep1 || pageType === 'prestataires' || pageType === 'entreprises' || pageType === 'investisseurs' || pageType === 'porteurs-projets' || pageType === 'porteur-projet') {
                    // Nettoyer les données stockées
                    sessionStorage.removeItem('domtomConnectStep1');

                    // Message de succès personnalisé selon le profil
                    let successTitle = '✓ Inscription envoyée !';
                    let successMessage = 'Merci ! Nous avons bien reçu votre demande. Nous vous contacterons très prochainement pour discuter de votre projet.';

                    if (pageType === 'prestataires') {
                        successTitle = '✓ Candidature envoyée avec succès !';
                        successMessage = `Merci ${data.prenom ? data.prenom + ' !' : ' !'} 🎉

Votre candidature a bien été reçue et enregistrée. 

📧 Vous allez recevoir un email de confirmation avec le récapitulatif de votre candidature dans quelques instants.

📞 Nous vous recontacterons dans les 24-48 heures pour :
• Discuter de votre profil et de vos compétences
• Vous présenter notre réseau et les opportunités
• Planifier votre intégration dans notre écosystème

En attendant, n'hésitez pas à consulter notre site pour en savoir plus sur Domtom Connect.`;
                    } else if (pageType === 'entreprises') {
                        successTitle = '✓ Demande envoyée avec succès !';
                        successMessage = `Merci ${data.prenom ? data.prenom + ' !' : ' !'} 🎉

Votre demande a bien été reçue et enregistrée.

📧 Vous allez recevoir un email de confirmation avec le récapitulatif de votre demande dans quelques instants.

📞 Nous vous recontacterons dans les 24-48 heures pour :
• Discuter de vos besoins en prestataires
• Vous présenter notre réseau de prestataires vérifiés
• Vous proposer des solutions adaptées à vos besoins

En attendant, n'hésitez pas à consulter notre site pour en savoir plus sur Domtom Connect.`;
                    } else if (pageType === 'investisseurs') {
                        successTitle = '✓ Inscription envoyée avec succès !';
                        successMessage = `Merci ${data.prenom ? data.prenom + ' !' : ' !'} 🎉

Votre demande a bien été reçue et enregistrée.

📧 Vous allez recevoir un email de confirmation avec le récapitulatif de votre demande dans quelques instants.

📞 Nous vous recontacterons dans les 24-48 heures pour :
• Discuter de vos opportunités d'investissement
• Vous présenter des projets qualifiés
• Définir ensemble votre cotisation mensuelle

En attendant, n'hésitez pas à consulter notre site pour en savoir plus sur Domtom Connect.`;
                    } else if (pageType === 'porteurs-projets' || pageType === 'porteur-projet') {
                        successTitle = '✓ Demande envoyée avec succès !';
                        successMessage = `Merci ${data.prenom ? data.prenom + ' !' : ' !'} 🎉

Ta demande a bien été reçue et enregistrée.

📧 Tu vas recevoir un email de confirmation avec le récapitulatif de ta demande dans quelques instants.

📞 On te recontacte sous 24h pour :
• Discuter de ton projet et de tes besoins
• T'expliquer le pack adapté à ton budget
• Planifier un appel découverte gratuit

En attendant, n'hésite pas à consulter notre site pour en savoir plus sur Domtom Connect.`;
                    }

                    // Afficher le message de succès avec animation
                    setTimeout(() => {
                        // Vérifier si c'est un formulaire de quiz (avec quiz-container)
                        const quizContainer = form.querySelector('.quiz-container');
                        const quizQuestionsContainer = form.querySelector('#quiz-questions-container');
                        const quizNavigation = form.querySelector('#quiz-navigation');

                        const successHTML = `
                        <div style="text-align: center; padding: 3rem 2rem; max-width: 600px; margin: 0 auto; animation: fadeInSlide 0.5s ease;">
                            <div style="font-size: 4rem; margin-bottom: 1.5rem; animation: bounceIn 0.6s ease;">✅</div>
                            <h3 style="color: var(--primary-color); margin-bottom: 1.5rem; font-size: 1.75rem; font-weight: 700;">${successTitle}</h3>
                            <div style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.8; font-size: 1.05rem; white-space: pre-line; text-align: left; background: linear-gradient(135deg, rgba(0, 191, 166, 0.08), rgba(0, 168, 150, 0.05)); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--primary-color);">${successMessage}</div>
                            <a href="/" class="cta-button primary" style="text-decoration: none; display: inline-block; padding: 1rem 2rem; background: var(--gradient-primary); color: white; border-radius: 8px; font-weight: 600; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0, 191, 166, 0.3);">Retour à l'accueil</a>
                        </div>
                        <style>
                            @keyframes fadeInSlide {
                                from {
                                    opacity: 0;
                                    transform: translateY(20px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            @keyframes bounceIn {
                                0% {
                                    transform: scale(0);
                                }
                                50% {
                                    transform: scale(1.2);
                                }
                                100% {
                                    transform: scale(1);
                                }
                            }
                        </style>
                    `;

                        // Si c'est un quiz, afficher dans le quiz-container ou quiz-questions-container
                        if (quizContainer) {
                            quizContainer.innerHTML = successHTML;
                        } else if (quizQuestionsContainer) {
                            quizQuestionsContainer.innerHTML = successHTML;
                            if (quizNavigation) {
                                quizNavigation.style.display = 'none';
                            }
                        } else {
                            // Sinon, remplacer tout le formulaire (comportement par défaut)
                            form.innerHTML = successHTML;
                        }
                    }, 300); // Petit délai pour s'assurer que les alertes précédentes sont fermées
                }
            } else {
                return response.json().then(errData => {
                    console.error('❌ Erreur lors de l\'envoi de l\'email:', errData);

                    // Gérer les erreurs de validation de Formspree
                    let errorMessage = 'Erreur lors de l\'envoi du formulaire.';

                    if (errData.errors && Array.isArray(errData.errors) && errData.errors.length > 0) {
                        // Formspree retourne des erreurs de validation détaillées
                        const validationErrors = errData.errors.map(err => {
                            if (typeof err === 'string') return err;
                            if (err.message) return err.message;
                            if (err.field) return `${err.field}: ${err.message || 'Erreur de validation'}`;
                            return JSON.stringify(err);
                        }).join('\n');
                        errorMessage = `Erreurs de validation détectées :\n\n${validationErrors}\n\nVeuillez vérifier vos informations et réessayer.`;
                    } else if (errData.error) {
                        // Message d'erreur générique de Formspree
                        const errorLower = errData.error.toLowerCase();

                        // Gérer les erreurs de rate limiting
                        if (errorLower.includes('trop de soumissions') ||
                            errorLower.includes('too many submissions') ||
                            errorLower.includes('rate limit') ||
                            errorLower.includes('rate limiting')) {
                            errorMessage = '⏱️ Trop de soumissions récentes\n\n' +
                                'Pour éviter le spam, nous limitons le nombre de soumissions par période.\n\n' +
                                'Veuillez patienter quelques minutes avant de réessayer.\n\n' +
                                'Si le problème persiste, contactez-nous directement à :\n' +
                                'domtomconnect@gmail.com';
                        } else if (errorLower.includes('validation')) {
                            errorMessage = 'Certains champs du formulaire ne sont pas valides. Veuillez vérifier vos informations et réessayer.';
                        } else {
                            errorMessage = errData.error;
                        }
                    }

                    throw new Error(errorMessage);
                });
            }
        })
        .catch(error => {
            console.error('❌ Erreur détaillée lors de l\'envoi de l\'email:', error);
            console.error('❌ Données du formulaire:', data);
            console.error('❌ Profil détecté:', profil, 'PageType:', pageType);

            // Essayer d'envoyer un email de secours avec les données disponibles
            console.warn('⚠️ Tentative d\'envoi d\'email de secours...');
            const fallbackFormData = new FormData();
            fallbackFormData.append('_to', 'domtomconnect@gmail.com');
            fallbackFormData.append('_subject', `⚠️ ERREUR ENVOI - ${profilLabel} - ${data.prenom || 'NOM_MANQUANT'} ${data.nom || 'PRENOM_MANQUANT'}`);
            fallbackFormData.append('_replyto', data.email || 'domtomconnect@gmail.com');
            fallbackFormData.append('message', `ERREUR LORS DE L'ENVOI DU FORMULAIRE\n\nProfil: ${profilLabel}\nPage: ${window.location.href}\nErreur: ${error.message}\n\nDonnées disponibles:\n${JSON.stringify(data, null, 2)}`);

            fetch('https://formspree.io/f/myzbqepy', {
                method: 'POST',
                body: fallbackFormData,
                headers: { 'Accept': 'application/json' }
            }).catch(fallbackError => {
                console.error('❌ Échec de l\'envoi de secours:', fallbackError);
            });

            // Message d'erreur plus informatif
            let errorMessage = error.message || 'Une erreur est survenue lors de l\'envoi de votre formulaire.';

            // Si le message contient "Validation errors", le rendre plus clair
            if (errorMessage.toLowerCase().includes('validation errors') || errorMessage.toLowerCase().includes('validation error')) {
                errorMessage = 'Certains champs du formulaire ne sont pas valides.\n\nVeuillez vérifier que tous les champs obligatoires sont correctement remplis et réessayer.\n\nSi le problème persiste, contactez-nous directement à domtomconnect@gmail.com';
            }

            alert(errorMessage);
            if (submitButton) {
                submitButton.disabled = false;
                const buttonText = submitButton.querySelector('.button-text');
                const buttonLoader = submitButton.querySelector('.button-loader');

                if (buttonText) {
                    buttonText.style.opacity = '1';
                    buttonText.textContent = originalText;
                }
                if (buttonLoader) {
                    buttonLoader.style.display = 'none';
                }

                if (!buttonText && !buttonLoader) {
                    submitButton.textContent = originalText || 'Envoyer';
                }
            }
        });
}

// Fonction pour envoyer les données de l'étape 1 en arrière-plan
async function sendStep1Data(data, pageType) {
    const formspreeUrl = 'https://formspree.io/f/myzbqepy';
    const formDataToSend = new FormData();

    // Déterminer le label selon le type de page
    let profilLabel = '🚀 PORTEUR DE PROJET / ENTREPRENEUR - ÉTAPE 1';
    if (pageType === 'prestataires') {
        profilLabel = '💼 PRESTATAIRE - ÉTAPE 1';
    } else if (pageType === 'entreprises') {
        profilLabel = '🏢 ENTREPRISE - ÉTAPE 1';
    } else if (pageType === 'investisseurs') {
        profilLabel = '💰 INVESTISSEUR - ÉTAPE 1';
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
Origine/Territoire d'origine: ${data.origine || data.ile || 'Non renseigné'}
Lieu actuel: ${data.lieu_actuel || 'Non renseigné'}
${data.lien_territoires ? `Lien avec territoires: ${getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre)}` : ''}

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
    if (data.origine) formDataToSend.append('Origine', data.origine);
    if (data.lieu_actuel) formDataToSend.append('Lieu actuel', data.lieu_actuel);
    if (data.ile) formDataToSend.append('Territoire', data.ile); // Compatibilité ancien formulaire
    if (data.lien_territoires) formDataToSend.append('Lien territoires', getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre)); // Compatibilité ancien formulaire

    // Envoyer en arrière-plan (ne pas attendre la réponse)
    return fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log('✅ Email étape 1 envoyé avec succès:', {
                    pageType: pageType,
                    profil: profilLabel,
                    email: data.email,
                    nom: data.nom,
                    prenom: data.prenom
                });
            } else {
                console.error('❌ Erreur lors de l\'envoi de l\'email étape 1:', response.status);
            }
            return response;
        })
        .catch(error => {
            console.error('❌ Erreur lors de l\'envoi de l\'étape 1:', error);
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
Origine/Territoire d'origine: ${completeData.origine || completeData.ile || 'Non renseigné'}
Lieu actuel: ${completeData.lieu_actuel || 'Non renseigné'}
${completeData.lien_territoires ? `Lien avec territoires insulaires: ${getLienTerritoiresLabel(completeData.lien_territoires, completeData.lien_territoires_autre)}` : ''}
`;

    // Bloc 2 - Projet
    if (completeData.nom_projet || completeData.description_projet || completeData.stade_projet || completeData.nature_projet) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BLOC 2 - PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom du projet/entreprise: ${completeData.nom_projet || 'Non renseigné'}
Description du projet: ${completeData.description_projet || 'Non renseigné'}
Nature du projet: ${getNatureProjetLabel(completeData.nature_projet) || 'Non renseigné'}
Localisation du projet: ${completeData.localisation_projet || 'Non renseigné'}
Stade du projet: ${getStadeProjetLabel(completeData.stade_projet)}
${completeData.besoins_physique ? `Besoins spécifiques (physique): ${completeData.besoins_physique}` : ''}
${completeData.besoins_virtuel ? `Besoins spécifiques (digital): ${completeData.besoins_virtuel}` : ''}
${completeData.besoins_hybride ? `Besoins spécifiques (hybride): ${completeData.besoins_hybride}` : ''}
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
        // Déterminer le pack et les facilités de paiement selon budget + engagement
        const packInfo = determinePackAndPayment(completeData.budget, completeData.engagement);

        let packSection = '';
        if (packInfo.pack) {
            packSection = `
Pack sélectionné: ${packInfo.packName} (${packInfo.packPrice})
Plan de paiement: ${packInfo.paymentPlan}
Détails paiement: ${packInfo.paymentDetails}
Action recommandée: ${packInfo.action}`;
        } else {
            packSection = `
Pack: ${packInfo.packName}
Plan: ${packInfo.paymentPlan}
Action: ${packInfo.action}`;
        }

        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BLOC 4 - BUDGET & ENGAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget: ${getBudgetLabel(completeData.budget)}
Engagement: ${getEngagementLabel(completeData.engagement)}
${packSection}
`;
    }

    if (completeData.commentaires) {
        messageBody += `
Commentaires additionnels: ${completeData.commentaires}
`;
    }

    // Adapter les prochaines étapes selon l'engagement
    const packInfo = determinePackAndPayment(completeData.budget, completeData.engagement);
    let prochainesEtapes = '';

    if (completeData.engagement === 'oui') {
        prochainesEtapes = `
1. ⚡ PRIORITÉ : Contacter ${completeData.prenom} ${completeData.nom}${completeData.nom_projet ? ' (' + completeData.nom_projet + ')' : ''} rapidement (engagement clair)
2. Présenter le ${packInfo.packName || 'pack'} et confirmer l'alignement
3. Si alignement confirmé, envoyer récap + lien paiement${packInfo.paymentDetails ? ' (' + packInfo.paymentDetails + ')' : ''}
4. Planifier première session de travail`;
    } else if (completeData.engagement === 'pas-sure') {
        prochainesEtapes = `
1. Appel de découverte avec ${completeData.prenom} ${completeData.nom}${completeData.nom_projet ? ' (' + completeData.nom_projet + ')' : ''}
2. Présenter la valeur du ${packInfo.packName || 'pack'} et répondre aux questions
3. Proposer les facilités de paiement${packInfo.paymentDetails ? ' (' + packInfo.paymentDetails + ')' : ''} pour réduire la friction
4. Si convaincu, envoyer récap + lien paiement
5. Planifier première session de travail`;
    } else {
        prochainesEtapes = `
1. Contacter ${completeData.prenom} ${completeData.nom}${completeData.nom_projet ? ' (' + completeData.nom_projet + ')' : ''} pour un appel informatif
2. Présenter les services sans pression
3. Proposer newsletter/ressources gratuites
4. Suivi à froid dans 2-3 semaines`;
    }

    messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${prochainesEtapes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    formDataToSend.append('message', messageBody);

    // Données structurées
    formDataToSend.append('Prénom', completeData.prenom);
    formDataToSend.append('Nom', completeData.nom);
    formDataToSend.append('Email', completeData.email);
    formDataToSend.append('Téléphone', completeData.telephone || '');
    formDataToSend.append('Profil', completeData.profil || pageType);
    formDataToSend.append('Étape', '2 - Qualification complète');
    if (completeData.origine) formDataToSend.append('Origine', completeData.origine);
    if (completeData.lieu_actuel) formDataToSend.append('Lieu actuel', completeData.lieu_actuel);
    if (completeData.ile) formDataToSend.append('Territoire', completeData.ile); // Compatibilité ancien formulaire
    if (completeData.lien_territoires) formDataToSend.append('Lien territoires', getLienTerritoiresLabel(completeData.lien_territoires, completeData.lien_territoires_autre)); // Compatibilité ancien formulaire
    if (completeData.nom_projet) formDataToSend.append('Nom projet', completeData.nom_projet);
    if (completeData.description_projet) formDataToSend.append('Description projet', completeData.description_projet);
    if (completeData.nature_projet) formDataToSend.append('Nature projet', getNatureProjetLabel(completeData.nature_projet));
    if (completeData.localisation_projet) formDataToSend.append('Localisation projet', completeData.localisation_projet);
    if (completeData.besoins_physique) formDataToSend.append('Besoins physique', completeData.besoins_physique);
    if (completeData.besoins_virtuel) formDataToSend.append('Besoins digital', completeData.besoins_virtuel);
    if (completeData.besoins_hybride) formDataToSend.append('Besoins hybride', completeData.besoins_hybride);
    if (completeData.stade_projet) formDataToSend.append('Stade projet', getStadeProjetLabel(completeData.stade_projet));
    if (completeData.objectif_principal) formDataToSend.append('Objectif principal', getObjectifPrincipalLabel(completeData.objectif_principal, completeData.objectif_principal_autre));
    if (completeData.horizon) formDataToSend.append('Horizon', getHorizonLabel(completeData.horizon));
    if (completeData.budget) formDataToSend.append('Budget', getBudgetLabel(completeData.budget));
    if (completeData.engagement) formDataToSend.append('Engagement', getEngagementLabel(completeData.engagement));
    if (completeData.budget || completeData.engagement) {
        const packInfo = determinePackAndPayment(completeData.budget, completeData.engagement);
        if (packInfo.pack) {
            formDataToSend.append('Pack sélectionné', `${packInfo.packName} (${packInfo.packPrice})`);
            formDataToSend.append('Plan de paiement', packInfo.paymentPlan);
            formDataToSend.append('Détails paiement', packInfo.paymentDetails);
            formDataToSend.append('Action recommandée', packInfo.action);
        } else {
            formDataToSend.append('Pack', packInfo.packName);
            formDataToSend.append('Action', packInfo.action);
        }
    }
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
                console.log('✅ Email qualification complète envoyé avec succès:', {
                    pageType: pageType,
                    profil: profilLabel,
                    email: completeData.email,
                    nom: completeData.nom,
                    prenom: completeData.prenom,
                    projet: completeData.nom_projet
                });

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
                    console.error('❌ Erreur lors de l\'envoi de l\'email de qualification:', errData);
                    throw new Error(errData.error || 'Erreur lors de l\'envoi');
                });
            }
        })
        .catch(error => {
            console.error('❌ Erreur détaillée lors de l\'envoi de l\'email de qualification:', error);
            const errorMessage = error.message || 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer ou nous contacter directement.';
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

