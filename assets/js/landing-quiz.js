// Système de quiz multi-étapes pour les landing pages

class LandingQuiz {
    constructor(questions, formId, profil, simplifiedQuestions = null) {
        this.fullQuestions = questions;
        this.simplifiedQuestions = simplifiedQuestions;
        this.formId = formId;
        this.profil = profil;
        this.currentStep = 0; // Index dans la liste complète des questions
        this.currentValidStep = 0; // Index dans la liste des questions valides (affichées)
        this.answers = {};
        this.form = null;
        this.useSimplified = false;
        this.homepageData = null; // Données brutes du formulaire d'accueil
        
        this.init();
    }
    
    init() {
        this.form = document.getElementById(this.formId);
        if (!this.form) return;
        
        // Pré-remplir depuis sessionStorage si disponible
        this.prefillFromSession();
        
        // Déterminer si on utilise la version simplifiée
        // Si des données sont pré-remplies OU si pas de questions simplifiées, utiliser le formulaire complet
        // Sinon, utiliser la version simplifiée pour éviter la fatigue
        if (this.simplifiedQuestions && !this.hasPrefilledData()) {
            this.useSimplified = true;
            this.questions = this.simplifiedQuestions;
        } else {
            this.questions = this.fullQuestions;
        }
        
        // Créer la structure du quiz
        this.createQuizStructure();
        
        // Afficher la première question
        this.showStep(0);
        
        // Initialiser les événements
        this.initEvents();
    }
    
    prefillFromSession() {
        const storedData = sessionStorage.getItem('domtomConnectHomepageData');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                // Stocker les données brutes pour la détection
                this.homepageData = data;
                // Mapper les données du formulaire d'accueil vers les champs du quiz
                // Champs de base (toujours présents)
                if (data.prenom) {
                    this.answers.prenom = data.prenom;
                    this.answers['question_prenom'] = data.prenom; // Pour compatibilité
                }
                if (data.nom) {
                    this.answers.nom = data.nom;
                    this.answers['question_nom'] = data.nom;
                }
                if (data.email) {
                    this.answers.email = data.email;
                    this.answers['question_email'] = data.email;
                }
                if (data.telephone) {
                    this.answers.telephone = data.telephone;
                    this.answers['question_telephone'] = data.telephone;
                }
                
                // Mapper 'ile' vers les champs de territoire selon le profil
                if (data.ile) {
                    // Pour porteurs-projets, mapper vers origine et lieu_actuel
                    if (this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') {
                        this.answers.origine = data.ile;
                        this.answers.lieu_actuel = data.ile;
                        this.answers.localisation_projet = data.ile;
                        this.answers['question_origine'] = data.ile;
                        this.answers['question_lieu_actuel'] = data.ile;
                        this.answers['question_localisation_projet'] = data.ile;
                    } else {
                        // Pour les autres profils, utiliser 'ile' directement
                        this.answers.ile = data.ile;
                        this.answers['question_ile'] = data.ile;
                    }
                }
                
                // Mapper les autres champs si disponibles
                if (data.entreprise) {
                    if (this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') {
                        this.answers.nom_projet = data.entreprise;
                        this.answers['question_nom_projet'] = data.entreprise;
                    } else {
                        this.answers.entreprise = data.entreprise;
                        this.answers['question_entreprise'] = data.entreprise;
                    }
                }
                if (data.secteur) {
                    this.answers.secteur = data.secteur;
                    this.answers.secteur_activite = data.secteur;
                    this.answers['question_secteur'] = data.secteur;
                    this.answers['question_secteur_activite'] = data.secteur;
                }
                if (data.services) {
                    this.answers.services = data.services;
                    this.answers['question_services'] = data.services;
                }
                if (data['type-investissement']) {
                    this.answers.type_investissement = data['type-investissement'];
                    this.answers['question_type_investissement'] = data['type-investissement'];
                }
                if (data.besoin) {
                    this.answers.besoin = data.besoin;
                    this.answers['question_besoin'] = data.besoin;
                }
                if (data.detail) {
                    if (this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') {
                        this.answers.description_projet = data.detail;
                        this.answers['question_description_projet'] = data.detail;
                    } else {
                        this.answers.description = data.detail;
                        this.answers['question_description'] = data.detail;
                    }
                }
            } catch (e) {
                console.error('Erreur lors du préremplissage:', e);
            }
        }
    }
    
    hasPrefilledData() {
        // Vérifier si des données ont été pré-remplies
        return Object.keys(this.answers).length > 0;
    }
    
    createQuizStructure() {
        // Créer le container quiz s'il n'existe pas
        let quizContainer = this.form.querySelector('.quiz-container');
        if (!quizContainer) {
            quizContainer = document.createElement('div');
            quizContainer.className = 'quiz-container';
            this.form.appendChild(quizContainer);
        }
        
        // Calculer le nombre de questions valides (sans celles déjà répondues)
        const validQuestions = this.getValidQuestions();
        const totalQuestions = validQuestions.length;
        
        // Créer la structure HTML du quiz
        quizContainer.innerHTML = `
            <input type="hidden" name="profil" value="${this.profil}">
            <input type="hidden" name="lead_source" value="landing-${this.profil}">
            <input type="hidden" name="form_step" value="complete">
            <input type="text" name="website" tabindex="-1" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" autocomplete="off" aria-hidden="true">
            
            ${this.hasPrefilledData() ? `
            <!-- Message informatif pour les données pré-remplies -->
            <div class="quiz-prefilled-notice" style="background: rgba(0, 191, 166, 0.1); border-left: 4px solid #00BFA6; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px; font-size: 0.9rem; color: #00BFA6;">
                <strong>✓ Informations pré-remplies</strong> : Certaines informations que vous avez déjà renseignées ne seront pas demandées à nouveau.
            </div>
            ` : ''}
            
            <!-- Barre de progression -->
            <div class="quiz-progress-container">
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
                </div>
                <div class="quiz-progress-text">
                    <span id="quiz-step-indicator">Question 1 sur ${totalQuestions}</span>
                </div>
            </div>
            
            <!-- Container pour les questions -->
            <div class="quiz-questions-container" id="quiz-questions-container"></div>
            
            <!-- Navigation -->
            <div class="quiz-navigation" id="quiz-navigation">
                <button type="button" class="quiz-btn quiz-btn-secondary" id="quiz-btn-prev" style="display: none;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Précédent
                </button>
                <button type="button" class="quiz-btn quiz-btn-primary" id="quiz-btn-next">
                    Suivant
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        `;
    }
    
    getValidQuestions() {
        // Retourner uniquement les questions qui doivent être affichées
        return this.questions.filter((question, index) => {
            // Vérifier d'abord si la question a déjà été répondue (pré-remplie)
            if (this.isQuestionAlreadyAnswered(question)) {
                return false; // Ne pas afficher cette question
            }
            
            // Vérifier les conditions conditionnelles
            if (question.conditional) {
                const parentValue = this.answers[`question_${question.conditional.field}`] || 
                                  this.answers[question.conditional.field];
                return parentValue === question.conditional.value;
            }
            
            return true;
        });
    }
    
    isQuestionAlreadyAnswered(question) {
        // Si pas de données pré-remplies, la question n'est pas déjà répondue
        if (!this.homepageData) {
            return false;
        }
        
        const questionId = question.id;
        const fieldName = question.fieldName || questionId;
        
        // Vérifier dans les réponses par ID de question
        if (this.answers[`question_${questionId}`]) {
            return true;
        }
        
        // Vérifier dans les réponses par fieldName
        if (this.answers[fieldName]) {
            return true;
        }
        
        // Vérifier directement dans les données du formulaire d'accueil
        if (this.homepageData[fieldName]) {
            return true;
        }
        
        // Mappings spécifiques pour les champs de base du formulaire d'accueil
        const homepageFieldMappings = {
            'prenom': ['prenom'],
            'nom': ['nom'],
            'email': ['email'],
            'telephone': ['telephone'],
            'ile': ['ile', 'origine', 'lieu_actuel', 'localisation_projet'], // Pour porteurs-projets
            'entreprise': ['entreprise', 'nom_projet'], // Pour porteurs-projets
            'secteur': ['secteur', 'secteur_activite'],
            'services': ['services'],
            'type-investissement': ['type_investissement', 'type-investissement'],
            'besoin': ['besoin'],
            'detail': ['detail', 'description', 'description_projet'] // Pour porteurs-projets
        };
        
        // Vérifier les mappings
        for (const [homepageField, mappedFields] of Object.entries(homepageFieldMappings)) {
            if (this.homepageData[homepageField] && mappedFields.includes(fieldName)) {
                return true;
            }
        }
        
        // Pour les porteurs-projets, vérifier aussi les mappings spécifiques
        if (this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') {
            // Si 'ile' est rempli et que la question concerne origine, lieu_actuel ou localisation_projet
            if (this.homepageData.ile && (fieldName === 'origine' || fieldName === 'lieu_actuel' || fieldName === 'localisation_projet')) {
                return true;
            }
            // Si 'entreprise' est rempli et que la question concerne nom_projet
            if (this.homepageData.entreprise && fieldName === 'nom_projet') {
                return true;
            }
            // Si 'detail' est rempli et que la question concerne description_projet
            if (this.homepageData.detail && fieldName === 'description_projet') {
                return true;
            }
        }
        
        return false;
    }
    
    getQuestionIndex(questionId) {
        return this.questions.findIndex(q => q.id === questionId);
    }
    
    getActualStepIndex(stepIndex) {
        // Convertir l'index dans la liste des questions valides vers l'index réel
        const validQuestions = this.getValidQuestions();
        if (stepIndex < 0 || stepIndex >= validQuestions.length) return -1;
        const question = validQuestions[stepIndex];
        return this.getQuestionIndex(question.id);
    }
    
    showStep(stepIndex) {
        console.log('[Quiz] showStep appelé avec stepIndex:', stepIndex);
        
        if (stepIndex < 0) {
            console.log('[Quiz] stepIndex < 0, arrêt');
            return;
        }
        
        const validQuestions = this.getValidQuestions();
        console.log('[Quiz] Nombre de questions valides:', validQuestions.length);
        
        if (stepIndex >= validQuestions.length) {
            console.log('[Quiz] Toutes les questions terminées, soumission du formulaire');
            // Toutes les questions sont terminées, soumettre
            this.submitForm();
            return;
        }
        
        const question = validQuestions[stepIndex];
        if (!question) {
            console.log('[Quiz] Question non trouvée à l\'index:', stepIndex);
            return;
        }
        
        console.log('[Quiz] Affichage de la question:', question.id);
        const actualStep = this.getQuestionIndex(question.id);
        
        // Mettre à jour les deux index
        this.currentStep = actualStep;
        this.currentValidStep = stepIndex;
        console.log('[Quiz] Index mis à jour - currentStep:', this.currentStep, 'currentValidStep:', this.currentValidStep);
        
        const container = document.getElementById('quiz-questions-container');
        const prevBtn = document.getElementById('quiz-btn-prev');
        const nextBtn = document.getElementById('quiz-btn-next');
        const progressFill = document.getElementById('quiz-progress-fill');
        const stepIndicator = document.getElementById('quiz-step-indicator');
        
        // Compter le nombre total de questions affichables (recalculer à chaque fois au cas où)
        const totalQuestions = validQuestions.length;
        const currentQuestionNumber = stepIndex + 1;
        
        // Mettre à jour la barre de progression
        const progress = totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0;
        if (progressFill) {
            progressFill.style.width = `${Math.min(progress, 100)}%`;
        }
        if (stepIndicator) {
            // Mettre à jour le texte du compteur
            const indicatorText = `Question ${currentQuestionNumber} sur ${totalQuestions}`;
            stepIndicator.textContent = indicatorText;
            stepIndicator.innerText = indicatorText; // Double mise à jour pour assurer la compatibilité
            // Forcer la mise à jour du DOM
            stepIndicator.style.display = 'block';
            
            // Debug: vérifier que la mise à jour fonctionne
            console.log(`[Quiz] Étape ${currentQuestionNumber}/${totalQuestions} - Question ID: ${question.id}`);
        }
        
        // Afficher/masquer le bouton précédent
        if (prevBtn) {
            prevBtn.style.display = stepIndex > 0 ? 'flex' : 'none';
        }
        
        // Changer le texte du bouton suivant
        const isLastQuestion = stepIndex === validQuestions.length - 1;
        
        if (nextBtn) {
            if (isLastQuestion) {
                nextBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Envoyer
                `;
                nextBtn.type = 'submit';
            } else {
                nextBtn.innerHTML = `
                    Suivant
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                `;
                nextBtn.type = 'button';
                // Réactiver le bouton au cas où il serait désactivé
                nextBtn.disabled = false;
            }
            
            // Réattacher l'event listener après modification du HTML
            // (car modifier innerHTML peut supprimer les listeners)
            const updatedBtn = this.reattachNextButtonListener(nextBtn);
            // Mettre à jour la référence si nécessaire
            if (updatedBtn && updatedBtn !== nextBtn) {
                // Le bouton a été remplacé, mais on garde la référence originale pour cette fonction
            }
        }
        
        // Créer et afficher la question
        container.innerHTML = this.renderQuestion(question, stepIndex);
        
        // Restaurer la réponse si elle existe (avec un petit délai pour s'assurer que le DOM est prêt)
        setTimeout(() => {
            this.restoreAnswer(question);
        }, 50);
        
        // Animation d'entrée
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        setTimeout(() => {
            container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 50);
    }
    
    submitForm() {
        const form = this.form;
        if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    }
    
    renderQuestion(question, index) {
        let html = `
            <div class="quiz-question" data-question-id="${question.id}">
                <div class="quiz-question-header">
                    <h2 class="quiz-question-title">${question.question}</h2>
                    ${question.description ? `<p class="quiz-question-description">${question.description}</p>` : ''}
                </div>
                <div class="quiz-question-content">
        `;
        
        if (question.type === 'radio') {
            // Vérifier d'abord dans les réponses par ID, puis par fieldName
            const savedValue = this.answers[`question_${question.id}`] || 
                             (question.fieldName ? this.answers[question.fieldName] : '') || 
                             '';
            html += '<div class="quiz-options">';
            question.options.forEach((option, optIndex) => {
                const optionId = `q${question.id}_opt${optIndex}`;
                html += `
                    <label class="quiz-option" for="${optionId}">
                        <input type="radio" 
                               id="${optionId}" 
                               name="question_${question.id}" 
                               value="${option.value}"
                               ${savedValue === option.value ? 'checked' : ''}>
                        <span class="quiz-option-label">${option.label}</span>
                    </label>
                `;
            });
            html += '</div>';
        } else if (question.type === 'select') {
            // Vérifier d'abord dans les réponses par ID, puis par fieldName
            const savedValue = this.answers[`question_${question.id}`] || 
                             (question.fieldName ? this.answers[question.fieldName] : '') || 
                             '';
            html += `<select name="question_${question.id}" class="quiz-select" id="question_${question.id}">`;
            html += `<option value="">${question.placeholder || 'Sélectionnez une option'}</option>`;
            question.options.forEach(option => {
                html += `<option value="${option.value}" ${savedValue === option.value ? 'selected' : ''}>${option.label}</option>`;
            });
            html += '</select>';
        } else if (question.type === 'text' || question.type === 'email' || question.type === 'tel' || question.type === 'url') {
            // Vérifier d'abord dans les réponses par ID, puis par fieldName
            const answerValue = this.answers[`question_${question.id}`] || 
                               (question.fieldName ? this.answers[question.fieldName] : '') || 
                               '';
            html += `
                <input type="${question.type}" 
                       name="question_${question.id}" 
                       class="quiz-input" 
                       id="question_${question.id}"
                       placeholder="${question.placeholder || ''}"
                       value="${answerValue}"
                       ${question.required ? 'required' : ''}
                       ${question.pattern ? `pattern="${question.pattern}"` : ''}
                       ${question.maxlength ? `maxlength="${question.maxlength}"` : ''}>
            `;
        } else if (question.type === 'textarea') {
            // Vérifier d'abord dans les réponses par ID, puis par fieldName
            const answerValue = this.answers[`question_${question.id}`] || 
                               (question.fieldName ? this.answers[question.fieldName] : '') || 
                               '';
            html += `
                <textarea name="question_${question.id}" 
                          class="quiz-textarea" 
                          id="question_${question.id}"
                          placeholder="${question.placeholder || ''}"
                          rows="${question.rows || 4}"
                          ${question.required ? 'required' : ''}>${answerValue}</textarea>
            `;
        } else if (question.type === 'checkbox') {
            const checkboxId = `question_${question.id}`;
            const isChecked = this.answers[`question_${question.id}`] === 'oui';
            html += `
                <label class="quiz-checkbox-label" for="${checkboxId}">
                    <input type="checkbox" 
                           id="${checkboxId}" 
                           name="question_${question.id}" 
                           value="oui"
                           ${isChecked ? 'checked' : ''}
                           ${question.required ? 'required' : ''}>
                    <span>${question.description || question.question}</span>
                </label>
            `;
        }
        
        if (question.clarification) {
            html += `<div class="quiz-clarification">${question.clarification}</div>`;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    restoreAnswer(question) {
        // Vérifier d'abord dans les réponses sauvegardées
        let savedAnswer = this.answers[`question_${question.id}`];
        
        // Si pas de réponse sauvegardée, vérifier dans les données pré-remplies via fieldName
        if (!savedAnswer && question.fieldName) {
            savedAnswer = this.answers[question.fieldName];
        }
        
        if (!savedAnswer) return;
        
        if (question.type === 'radio') {
            const radio = document.querySelector(`input[name="question_${question.id}"][value="${savedAnswer}"]`);
            if (radio) {
                radio.checked = true;
                // Déclencher l'événement change pour activer les champs conditionnels
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } else if (question.type === 'select') {
            const select = document.getElementById(`question_${question.id}`);
            if (select) {
                select.value = savedAnswer;
                // Déclencher l'événement change pour activer les champs conditionnels
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } else if (question.type === 'checkbox') {
            const checkbox = document.getElementById(`question_${question.id}`);
            if (checkbox) {
                checkbox.checked = savedAnswer === 'oui' || savedAnswer === true || savedAnswer === 'true';
            }
        } else {
            const input = document.getElementById(`question_${question.id}`);
            if (input) {
                input.value = savedAnswer;
                // Déclencher l'événement input pour les validations en temps réel
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }
    
    saveAnswer(question) {
        if (question.type === 'radio') {
            const input = document.querySelector(`input[name="question_${question.id}"]:checked`);
            this.answers[`question_${question.id}`] = input ? input.value : null;
        } else if (question.type === 'checkbox') {
            const input = document.getElementById(`question_${question.id}`);
            this.answers[`question_${question.id}`] = input && input.checked ? input.value : null;
        } else {
            const input = document.getElementById(`question_${question.id}`);
            this.answers[`question_${question.id}`] = input ? (input.value || null) : null;
        }
    }
    
    reattachNextButtonListener(nextBtn) {
        // Supprimer tous les anciens listeners en clonant le bouton
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        // Réattacher le listener
        newNextBtn.addEventListener('click', (e) => {
            this.handleNextButtonClick(e, newNextBtn);
        });
        
        return newNextBtn;
    }
    
    handleNextButtonClick(e, nextBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('[Quiz] Bouton suivant cliqué');
        console.log('[Quiz] Type du bouton:', nextBtn.type);
        
        if (nextBtn.type === 'submit') {
            console.log('[Quiz] Bouton est de type submit, laisser le formulaire se soumettre');
            // Laisser le formulaire se soumettre normalement
            return;
        }
        
        // Sauvegarder la réponse AVANT de valider
        this.saveCurrentAnswer();
        
        // Valider l'étape actuelle
        const isValid = this.validateCurrentStep();
        console.log('[Quiz] Validation:', isValid);
        console.log('[Quiz] currentValidStep:', this.currentValidStep);
        
        if (isValid) {
            const validQuestions = this.getValidQuestions();
            const nextStep = this.currentValidStep + 1;
            console.log(`[Quiz] Navigation vers l'étape ${nextStep} sur ${validQuestions.length}`);
            
            // Utiliser directement currentValidStep au lieu de le recalculer
            this.showStep(nextStep);
        } else {
            // Afficher un message d'erreur
            console.log('[Quiz] Validation échouée, affichage erreur');
            const validQuestions = this.getValidQuestions();
            const question = validQuestions[this.currentValidStep];
            if (question) {
                console.log('[Quiz] Question non valide:', question.id);
                const input = document.querySelector(`input[name="question_${question.id}"]:checked`) ||
                             document.getElementById(`question_${question.id}`);
                if (input) {
                    input.focus();
                    input.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                } else {
                    console.log('[Quiz] Input non trouvé pour la question:', question.id);
                }
            } else {
                console.log('[Quiz] Question non trouvée à l\'index:', this.currentValidStep);
            }
        }
    }
    
    initEvents() {
        const prevBtn = document.getElementById('quiz-btn-prev');
        const nextBtn = document.getElementById('quiz-btn-next');
        
        // Bouton précédent
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.saveCurrentAnswer();
                // Utiliser directement currentValidStep au lieu de le recalculer
                if (this.currentValidStep > 0) {
                    this.showStep(this.currentValidStep - 1);
                }
            });
        }
        
        // Bouton suivant
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                this.handleNextButtonClick(e, nextBtn);
            });
        }
                e.preventDefault();
                e.stopPropagation();
                
                console.log('[Quiz] Bouton suivant cliqué');
                console.log('[Quiz] Type du bouton:', nextBtn.type);
                
                if (nextBtn.type === 'submit') {
                    console.log('[Quiz] Bouton est de type submit, laisser le formulaire se soumettre');
                    // Laisser le formulaire se soumettre normalement
                    return;
                }
                
                // Sauvegarder la réponse AVANT de valider
                this.saveCurrentAnswer();
                
                // Valider l'étape actuelle
                const isValid = this.validateCurrentStep();
                console.log('[Quiz] Validation:', isValid);
                console.log('[Quiz] currentValidStep:', this.currentValidStep);
                
                if (isValid) {
                    const validQuestions = this.getValidQuestions();
                    const nextStep = this.currentValidStep + 1;
                    console.log(`[Quiz] Navigation vers l'étape ${nextStep} sur ${validQuestions.length}`);
                    
                    // Utiliser directement currentValidStep au lieu de le recalculer
                    this.showStep(nextStep);
                } else {
                    // Afficher un message d'erreur
                    console.log('[Quiz] Validation échouée, affichage erreur');
                    const validQuestions = this.getValidQuestions();
                    const question = validQuestions[this.currentValidStep];
                    if (question) {
                        console.log('[Quiz] Question non valide:', question.id);
                        const input = document.querySelector(`input[name="question_${question.id}"]:checked`) ||
                                     document.getElementById(`question_${question.id}`);
                        if (input) {
                            input.focus();
                            input.style.borderColor = '#ef4444';
                            setTimeout(() => {
                                input.style.borderColor = '';
                            }, 2000);
                        } else {
                            console.log('[Quiz] Input non trouvé pour la question:', question.id);
                        }
                    } else {
                        console.log('[Quiz] Question non trouvée à l\'index:', this.currentValidStep);
                    }
                }
            });
        }
        
        // Sauvegarder automatiquement lors du changement
        const container = document.getElementById('quiz-questions-container');
        if (container) {
            container.addEventListener('change', (e) => {
                if (e.target.matches('input[name^="question_"], select[name^="question_"], textarea[name^="question_"]')) {
                    this.saveCurrentAnswer();
                }
            });
        }
    }
    
    saveCurrentAnswer() {
        const validQuestions = this.getValidQuestions();
        if (this.currentValidStep >= 0 && this.currentValidStep < validQuestions.length) {
            const question = validQuestions[this.currentValidStep];
            if (question) {
                this.saveAnswer(question);
            }
        }
    }
    
    validateCurrentStep() {
        const validQuestions = this.getValidQuestions();
        console.log('[Quiz] validateCurrentStep - currentValidStep:', this.currentValidStep, 'total questions:', validQuestions.length);
        
        if (this.currentValidStep < 0 || this.currentValidStep >= validQuestions.length) {
            console.log('[Quiz] Index hors limites, validation OK');
            return true;
        }
        
        const question = validQuestions[this.currentValidStep];
        if (!question) {
            console.log('[Quiz] Question non trouvée, validation OK');
            return true;
        }
        
        console.log('[Quiz] Validation de la question:', question.id, 'type:', question.type, 'required:', question.required);
        
        if (!question.required) {
            console.log('[Quiz] Question non requise, validation OK');
            return true;
        }
        
        let isValid = false;
        
        if (question.type === 'radio') {
            const input = document.querySelector(`input[name="question_${question.id}"]:checked`);
            isValid = input !== null;
            console.log('[Quiz] Radio - input trouvé:', input !== null, 'valeur:', input ? input.value : 'null');
        } else if (question.type === 'checkbox') {
            const input = document.getElementById(`question_${question.id}`);
            isValid = input && input.checked;
            console.log('[Quiz] Checkbox - input trouvé:', input !== null, 'coché:', input ? input.checked : false);
        } else {
            const input = document.getElementById(`question_${question.id}`);
            isValid = input && input.value && input.value.trim() !== '';
            console.log('[Quiz] Input text/textarea - input trouvé:', input !== null, 'valeur:', input ? input.value : 'null');
        }
        
        console.log('[Quiz] Résultat validation:', isValid);
        return isValid;
    }
    
    collectAllAnswers() {
        // Sauvegarder la réponse actuelle
        this.saveCurrentAnswer();
        
        // Collecter toutes les réponses dans le formulaire
        const formData = new FormData(this.form);
        const data = {};
        
        // Ajouter d'abord toutes les données pré-remplies (même si les questions ne sont pas affichées)
        if (this.homepageData) {
            // Mapper les données du formulaire d'accueil
            if (this.homepageData.prenom) data.prenom = this.homepageData.prenom;
            if (this.homepageData.nom) data.nom = this.homepageData.nom;
            if (this.homepageData.email) data.email = this.homepageData.email;
            if (this.homepageData.telephone) data.telephone = this.homepageData.telephone;
            
            // Mapper selon le profil
            if (this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') {
                if (this.homepageData.ile) {
                    data.origine = this.homepageData.ile;
                    data.lieu_actuel = this.homepageData.ile;
                    data.localisation_projet = this.homepageData.ile;
                }
                if (this.homepageData.entreprise) data.nom_projet = this.homepageData.entreprise;
                if (this.homepageData.detail) data.description_projet = this.homepageData.detail;
            } else {
                if (this.homepageData.ile) data.ile = this.homepageData.ile;
                if (this.homepageData.entreprise) data.entreprise = this.homepageData.entreprise;
                if (this.homepageData.detail) data.description = this.homepageData.detail;
            }
            
            if (this.homepageData.secteur) {
                data.secteur = this.homepageData.secteur;
                data.secteur_activite = this.homepageData.secteur;
            }
            if (this.homepageData.services) data.services = this.homepageData.services;
            if (this.homepageData['type-investissement']) data.type_investissement = this.homepageData['type-investissement'];
            if (this.homepageData.besoin) data.besoin = this.homepageData.besoin;
        }
        
        // Ajouter les réponses du quiz (celles qui ont été répondues dans le quiz)
        this.questions.forEach(question => {
            const answer = this.answers[`question_${question.id}`];
            if (answer !== null && answer !== undefined && answer !== '') {
                // Mapper les réponses aux noms de champs du formulaire
                const fieldName = question.fieldName || question.id;
                // Ne pas écraser les données pré-remplies sauf si l'utilisateur a modifié
                if (!data[fieldName] || data[fieldName] !== answer) {
                    data[fieldName] = answer;
                }
            }
        });
        
        // Ajouter aussi toutes les réponses stockées dans this.answers (pour les questions non affichées)
        Object.keys(this.answers).forEach(key => {
            if (key.startsWith('question_')) {
                const questionId = key.replace('question_', '');
                // Trouver la question correspondante pour obtenir le fieldName
                const question = this.questions.find(q => q.id === questionId);
                if (question) {
                    const fieldName = question.fieldName || questionId;
                    if (this.answers[key] && (!data[fieldName] || data[fieldName] !== this.answers[key])) {
                        data[fieldName] = this.answers[key];
                    }
                } else {
                    // Si pas de question trouvée, utiliser directement la clé sans "question_"
                    const fieldName = questionId;
                    if (this.answers[key] && !data[fieldName]) {
                        data[fieldName] = this.answers[key];
                    }
                }
            } else {
                // Données directes (pas de préfixe "question_")
                if (this.answers[key] && !data[key]) {
                    data[key] = this.answers[key];
                }
            }
        });
        
        // Ajouter les champs cachés
        formData.forEach((value, key) => {
            if (key !== 'website' && value) {
                data[key] = value;
            }
        });
        
        return data;
    }
}

// Initialiser le quiz quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Le quiz sera initialisé par chaque landing page avec ses propres questions
});

