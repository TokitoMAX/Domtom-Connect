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
    
    // Objectif principal (porteurs-projets)
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
    
    // Objectif (investisseurs, professionnels)
    const objectifRadiosGeneric = document.querySelectorAll('input[name="objectif"]');
    const objectifAutreGeneric = document.querySelector('input[name="objectif_autre"]');
    
    if (objectifRadiosGeneric.length && objectifAutreGeneric) {
        objectifRadiosGeneric.forEach(radio => {
            radio.addEventListener('change', function() {
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
        besoinSelect.addEventListener('change', function() {
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
        servicesSelect.addEventListener('change', function() {
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
        secteurSelect.addEventListener('change', function() {
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
        typePrestationsSelect.addEventListener('change', function() {
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
        statutJuridiqueSelect.addEventListener('change', function() {
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
            radio.addEventListener('change', function() {
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
            radio.addEventListener('change', function() {
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
            radio.addEventListener('change', function() {
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
    const isStep1 = (data.form_step === '1' && pageType === 'porteurs-projets') || (!data.nom_projet && pageType === 'porteurs-projets');
    
    // Si étape 1 (formulaire court) ET porteurs de projets, rediriger automatiquement vers la page de qualification
    // Les autres profils (prestataires, entreprises, investisseurs) envoient directement
    if (isStep1 && pageType === 'porteurs-projets') {
        // Stocker les données de l'étape 1
        sessionStorage.setItem('domtomConnectStep1', JSON.stringify(data));
        
        // Déterminer l'URL de redirection (seulement pour porteurs de projets)
        let qualificationUrl = '/landing/porteurs-projets/qualification.html';
        
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
    if (profil === 'entreprise' || pageType === 'entreprises' || profil === 'professionnel') {
        profilLabel = '🏢 ENTREPRISE';
    } else if (profil === 'prestataire' || pageType === 'prestataires') {
        profilLabel = '💼 PRESTATAIRE';
    } else if (profil === 'porteur-projet' || pageType === 'porteurs-projets' || profil === 'entrepreneur' || pageType === 'entrepreneurs') {
        profilLabel = '🚀 PORTEUR DE PROJET / ENTREPRENEUR';
    } else if (profil === 'investisseur' || pageType === 'investisseurs') {
        profilLabel = '💰 INVESTISSEUR';
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
${data.lien_territoires ? `Lien avec territoires insulaires: ${getLienTerritoiresLabel(data.lien_territoires, data.lien_territoires_autre)}` : ''}
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
    
    // Informations spécifiques pour Prestataires
    if (pageType === 'prestataires' || data.services) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 PRESTATAIRE - QUALIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Services proposés: ${data.services === 'autre' ? (data.services_autre || 'Autre') : (getServicesLabel(data.services) || 'Non renseigné'))}
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
    
    // Informations spécifiques pour Investisseurs
    if (pageType === 'investisseurs') {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 INVESTISSEUR - INFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type d'investissement: ${data.type_investissement || 'Non renseigné'}
Montant potentiel: ${data.montant_investissement || 'Non renseigné'}
Secteurs d'intérêt: ${data.secteurs_interet || 'Non renseigné'}
Expérience: ${data.experience_investissement || 'Non renseigné'}
Objectif: ${data.objectif === 'autre' ? (data.objectif_autre || 'Autre') : (data.objectif || 'Non renseigné')}
Motivation: ${data.motivation === 'autre' ? (data.motivation_autre || 'Autre') : (data.motivation || 'Non renseigné')}
Attentes: ${data.attentes === 'autre' ? (data.attentes_autre || 'Autre') : (data.attentes || 'Non renseigné')}
Critères d'évaluation: ${data.criteres === 'autre' ? (data.criteres_autre || 'Autre') : (data.criteres || 'Non renseigné')}
`;
    }
    
    // Informations spécifiques pour Entreprises
    if (pageType === 'entreprises') {
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
Budget estimé: ${getBudgetEntrepriseLabel(data.budget) || 'Non renseigné'}
Urgence du besoin: ${getUrgenceLabel(data.urgence) || 'Non renseigné'}
Description du besoin: ${data.description_besoin || 'Non renseigné'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VALIDATION CROISÉE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ancienneté entreprise: ${getAncienneteEntrepriseLabel(data.anciennete_entreprise) || 'Non renseigné'}
Prestataires précédents: ${getPrestatairesPrecedentsLabel(data.prestataires_precedents) || 'Non renseigné'}
Certification acceptée: ${data.certification ? 'OUI' : 'NON'}
`;
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
    }
    
    fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Si étape 2 ou formulaire complet (prestataires, entreprises, investisseurs), afficher message de succès
            if (!isStep1 || pageType === 'prestataires' || pageType === 'entreprises' || pageType === 'investisseurs') {
                // Nettoyer les données stockées
                sessionStorage.removeItem('domtomConnectStep1');
                
                // Show success message
                form.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Inscription envoyée !</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Merci ! Nous avons bien reçu votre demande. Nous vous contacterons très prochainement pour discuter de votre projet.</p>
                        <a href="/" class="cta-button primary">Retour à l'accueil</a>
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
Territoire: ${data.ile || 'Non renseigné'}
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
${completeData.lien_territoires ? `Lien avec territoires insulaires: ${getLienTerritoiresLabel(completeData.lien_territoires, completeData.lien_territoires_autre)}` : ''}
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

