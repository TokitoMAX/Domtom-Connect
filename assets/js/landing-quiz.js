// Système de quiz multi-étapes pour les landing pages

class LandingQuiz {
    constructor(questions, formId, profil, simplifiedQuestions = null) {
        this.fullQuestions = questions;
        this.simplifiedQuestions = simplifiedQuestions;
        this.formId = formId;
        this.profil = profil;
        this.currentStep = 0;
        this.answers = {};
        this.form = null;
        this.useSimplified = false;
        this.homepageData = null; // Données brutes du formulaire d'accueil
        
        this.init();
    }
    
    init() {
        this.form = document.getElementById(this.formId);
        if (!this.form) {
            console.error('[Quiz] Formulaire non trouvé avec l\'ID:', this.formId);
            return;
        }
        
        // Pré-remplir depuis sessionStorage si disponible
        this.prefillFromSession();
        
        // Charger les réponses sauvegardées depuis localStorage
        this.loadFromLocalStorage();
        
        // Déterminer si on utilise la version simplifiée
        // Si des données sont pré-remplies OU si pas de questions simplifiées, utiliser le formulaire complet
        // Sinon, utiliser la version simplifiée pour éviter la fatigue
        if (this.simplifiedQuestions && !this.hasPrefilledData()) {
            this.useSimplified = true;
            this.questions = this.simplifiedQuestions;
        } else {
            this.questions = this.fullQuestions;
        }
        
        // Vérifier que les questions sont définies
        if (!this.questions || this.questions.length === 0) {
            console.error('[Quiz] Aucune question définie! fullQuestions:', this.fullQuestions?.length, 'simplifiedQuestions:', this.simplifiedQuestions?.length);
            const container = this.form.querySelector('.quiz-container');
            if (container) {
                container.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: #ef4444;">
                        <p>Erreur : Aucune question définie pour ce profil.</p>
                    </div>
                `;
            }
            return;
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
        console.log('[Quiz] Création de la structure du quiz...');
        // Créer le container quiz s'il n'existe pas
        let quizContainer = this.form.querySelector('.quiz-container');
        if (!quizContainer) {
            console.error('[Quiz] ERREUR: Container quiz non trouvé!');
            console.error('[Quiz] Formulaire:', this.form);
            console.error('[Quiz] Form ID:', this.formId);
            return;
        } else {
            console.log('[Quiz] Container quiz trouvé');
        }
        
        console.log('[Quiz] Injection du HTML dans le container...');
        console.log('[Quiz] Nombre de questions:', this.questions?.length);
        // Créer la structure HTML du quiz
        quizContainer.innerHTML = `
            <input type="hidden" name="profil" value="${this.profil}">
            <input type="hidden" name="lead_source" value="landing-${this.profil}">
            <input type="hidden" name="form_step" value="complete">
            <input type="text" name="website" tabindex="-1" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" autocomplete="off" aria-hidden="true">
            
            <!-- Barre de progression -->
            <div class="quiz-progress-container">
                <div class="quiz-progress-header">
                    <div class="quiz-progress-info">
                        <span id="quiz-step-indicator">Question 1 sur ${this.questions.length}</span>
                        <span id="quiz-progress-percent" class="quiz-progress-percent">0%</span>
                    </div>
                    <div class="quiz-save-indicator" id="quiz-save-indicator" style="display: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        <span>Sauvegardé</span>
                    </div>
                </div>
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
                </div>
                <div class="quiz-progress-time" id="quiz-progress-time">
                    <span>⏱️ Temps estimé restant : ~${Math.ceil(this.questions.length * 0.15)} min</span>
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
        const filtered = this.questions.filter((question, index) => {
            // Si on a des données pré-remplies depuis la page d'accueil, filtrer les questions déjà répondues
            if (this.homepageData && this.isQuestionAlreadyAnswered(question)) {
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
        
        // SÉCURITÉ : Si toutes les questions sont filtrées, retourner au moins quelques questions essentielles
        if (filtered.length === 0 && this.questions.length > 0) {
            console.warn('[Quiz] Toutes les questions ont été filtrées, affichage des questions essentielles');
            // Retourner les questions qui ne sont pas dans les champs de base
            const essentialQuestions = this.questions.filter(q => {
                const fieldName = q.fieldName || q.id;
                const basicFields = ['prenom', 'nom', 'email', 'telephone', 'ile', 'origine', 'lieu_actuel'];
                return !basicFields.includes(fieldName);
            });
            
            // Si même les questions essentielles sont vides, retourner TOUTES les questions
            if (essentialQuestions.length === 0) {
                console.warn('[Quiz] Même les questions essentielles sont vides, utilisation de TOUTES les questions');
                return this.questions;
            }
            
            return essentialQuestions.slice(0, Math.min(5, this.questions.length));
        }
        
        return filtered;
    }
    
    isQuestionAlreadyAnswered(question) {
        // Si pas de données pré-remplies, la question n'est pas déjà répondue
        if (!this.homepageData) {
            return false;
        }
        
        const fieldName = question.fieldName || question.id;
        
        // IMPORTANT: Ne vérifier QUE les données du formulaire d'accueil (homepageData)
        // Ne PAS vérifier this.answers car cela contient aussi les réponses du quiz en cours
        
        // Vérifier directement dans les données du formulaire d'accueil
        if (this.homepageData[fieldName]) {
            return true;
        }
        
        // Mappings spécifiques pour les champs de base du formulaire d'accueil
        const basicFields = ['prenom', 'nom', 'email', 'telephone'];
        if (basicFields.includes(fieldName) && this.homepageData[fieldName]) {
            return true;
        }
        
        // Pour 'ile', mapper vers les champs de territoire selon le profil
        if (this.homepageData.ile) {
            if (this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') {
                if (['origine', 'lieu_actuel', 'localisation_projet'].includes(fieldName)) {
                    return true;
                }
            } else if (fieldName === 'ile') {
                return true;
            }
        }
        
        // Pour 'entreprise', mapper vers 'nom_projet' pour porteurs-projets
        if (this.homepageData.entreprise) {
            if ((this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') && fieldName === 'nom_projet') {
                return true;
            } else if (fieldName === 'entreprise') {
                return true;
            }
        }
        
        // Pour 'detail', mapper vers 'description_projet' pour porteurs-projets
        if (this.homepageData.detail) {
            if ((this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') && fieldName === 'description_projet') {
                return true;
            } else if (fieldName === 'description') {
                return true;
            }
        }
        
        // Pour 'secteur', mapper vers 'secteur_activite' si applicable
        if (this.homepageData.secteur) {
            if (fieldName === 'secteur' || fieldName === 'secteur_activite') {
                return true;
            }
        }
        
        // Pour 'services', mapper directement
        if (this.homepageData.services && fieldName === 'services') {
            return true;
        }
        
        // Pour 'type-investissement', mapper vers 'type_investissement'
        if (this.homepageData['type-investissement']) {
            if (fieldName === 'type_investissement' || fieldName === 'type-investissement') {
                return true;
            }
        }
        
        // Pour 'besoin', mapper directement
        if (this.homepageData.besoin && fieldName === 'besoin') {
            return true;
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
        if (stepIndex < 0) return;
        
        const validQuestions = this.getValidQuestions();
        console.log('[Quiz] Questions valides:', validQuestions.length);
        console.log('[Quiz] Questions valides détaillées:', validQuestions.map(q => ({ id: q.id, question: q.question })));
        
        // SÉCURITÉ : Si aucune question valide, utiliser toutes les questions
        let questionsToUse = validQuestions;
        if (validQuestions.length === 0 && this.questions.length > 0) {
            console.warn('[Quiz] Aucune question valide, utilisation de toutes les questions');
            questionsToUse = this.questions;
        }
        
        if (stepIndex >= questionsToUse.length) {
            // Toutes les questions sont terminées, soumettre
            console.log('[Quiz] Toutes les questions terminées, soumission...');
            this.submitForm();
            return;
        }
        
        const question = questionsToUse[stepIndex];
        if (!question) {
            console.error('[Quiz] Question introuvable à l\'index', stepIndex);
            return;
        }
        const actualStep = this.getQuestionIndex(question.id);
        
        this.currentStep = actualStep;
        console.log('[Quiz] Question actuelle:', question.id, question.question);
        
        const container = document.getElementById('quiz-questions-container');
        if (!container) {
            console.error('[Quiz] Container quiz-questions-container non trouvé!');
            console.error('[Quiz] Recherche dans tout le document...');
            const allContainers = document.querySelectorAll('[id*="quiz"], [class*="quiz"]');
            console.error('[Quiz] Containers trouvés:', allContainers);
            return;
        }
        console.log('[Quiz] Container trouvé, rendu de la question...');
        const prevBtn = document.getElementById('quiz-btn-prev');
        const nextBtn = document.getElementById('quiz-btn-next');
        const progressFill = document.getElementById('quiz-progress-fill');
        const stepIndicator = document.getElementById('quiz-step-indicator');
        
        // Compter le nombre total de questions affichables
        const totalQuestions = questionsToUse.length;
        const currentQuestionNumber = stepIndex + 1;
        
        // Mettre à jour la barre de progression
        const progress = (currentQuestionNumber / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        stepIndicator.textContent = `Question ${currentQuestionNumber} sur ${totalQuestions}`;
        
        // Mettre à jour le pourcentage
        const progressPercent = document.getElementById('quiz-progress-percent');
        if (progressPercent) {
            progressPercent.textContent = `${Math.round(progress)}%`;
        }
        
        // Mettre à jour le temps estimé restant
        const progressTime = document.getElementById('quiz-progress-time');
        if (progressTime) {
            const remainingQuestions = totalQuestions - currentQuestionNumber;
            const estimatedMinutes = Math.ceil(remainingQuestions * 0.15);
            if (remainingQuestions > 0) {
                progressTime.innerHTML = `<span>⏱️ Temps estimé restant : ~${estimatedMinutes} min</span>`;
            } else {
                progressTime.innerHTML = `<span>✅ Presque terminé !</span>`;
            }
        }
        
        // Afficher/masquer le bouton précédent
        if (prevBtn) {
            prevBtn.style.display = stepIndex > 0 ? 'flex' : 'none';
        }
        
        // Changer le texte du bouton suivant
        const isLastQuestion = stepIndex === questionsToUse.length - 1;
        
        if (nextBtn) {
            if (isLastQuestion) {
                // Pour les profils sans pack (prestataires, investisseurs), masquer le bouton
                // La soumission se fera automatiquement via la checkbox
                const profilesWithoutPack = ['prestataire', 'investisseur'];
                const hasNoPack = profilesWithoutPack.includes(this.profil);
                
                // Toujours afficher le bouton, même pour les profils sans pack
                nextBtn.style.display = '';
                
                // Texte du bouton selon le profil
                let buttonText = 'Envoyer';
                if (this.profil === 'porteur-projet' || this.profil === 'porteurs-projets') {
                    buttonText = 'Valider ma demande';
                } else if (this.profil === 'prestataire' || this.profil === 'investisseur') {
                    // Pour les profils sans pack, afficher simplement "Envoyer"
                    buttonText = 'Envoyer';
                } else if (this.profil === 'entreprise') {
                    buttonText = 'Valider ma demande';
                } else {
                    buttonText = 'Envoyer';
                }
                
                nextBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    ${buttonText}
                `;
                nextBtn.type = 'submit';
                // Pour la dernière question avec checkbox, désactiver le bouton si la checkbox n'est pas cochée
                // (sera activé dans le setTimeout après création du DOM)
                if (question.type === 'checkbox') {
                    nextBtn.disabled = true; // Désactivé par défaut, sera activé si checkbox cochée
                }
            } else {
                nextBtn.innerHTML = `
                    Suivant
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                `;
                nextBtn.type = 'button';
                // Réactiver le bouton au cas où il serait désactivé (sauf si c'est une checkbox)
                if (question.type !== 'checkbox') {
                    nextBtn.disabled = false;
                }
            }
            
            // Réattacher l'event listener après modification du HTML
            // (car modifier innerHTML peut supprimer les listeners)
            // On utilise la délégation d'événements via le formulaire pour éviter ce problème
            // Le listener est déjà attaché dans initEvents() et fonctionne via la délégation
        }
        
        // Créer et afficher la question
        try {
            const questionHTML = this.renderQuestion(question, stepIndex);
            console.log('[Quiz] HTML de la question généré, longueur:', questionHTML.length);
            container.innerHTML = questionHTML;
            console.log('[Quiz] Question rendue dans le container');
            
            // Restaurer la réponse si elle existe (avec un petit délai pour s'assurer que le DOM est prêt)
            setTimeout(() => {
                this.restoreAnswer(question);
                
                // Pour les checkboxes, activer/désactiver le bouton suivant selon l'état
                // Utiliser un délai supplémentaire pour s'assurer que le DOM est complètement prêt
                setTimeout(() => {
                    if (question.type === 'checkbox') {
                        const checkbox = document.getElementById(`question_${question.id}`);
                        const nextBtn = document.getElementById('quiz-btn-next');
                        
                        if (checkbox && nextBtn) {
                            // Pour TOUS les profils, activer/désactiver le bouton selon l'état de la checkbox
                            // Le bouton est déjà configuré comme "submit" pour la dernière question
                            nextBtn.disabled = !checkbox.checked;
                            
                            // Listener pour activer/désactiver le bouton quand la checkbox change
                            checkbox.addEventListener('change', () => {
                                nextBtn.disabled = !checkbox.checked;
                                this.saveCurrentAnswer();
                            });
                            
                            // Si la checkbox est déjà cochée (restauration), activer le bouton
                            if (checkbox.checked) {
                                nextBtn.disabled = false;
                            }
                        }
                    }
                    
                    // Si c'est la question budget, ajouter un listener pour afficher l'info pack
                    if (question.id === 'budget' && this.profil === 'porteur-projet') {
                        this.setupBudgetPackInfo(question);
                        
                        // Si une réponse est déjà sélectionnée, afficher l'info pack immédiatement
                        const selectedBudget = document.querySelector(`input[name="question_${question.id}"]:checked`);
                        if (selectedBudget) {
                            this.showPackInfoForBudget(selectedBudget.value);
                        }
                    }
                }, 50);
            }, 50);
            
            // Animation d'entrée
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            setTimeout(() => {
                container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 50);
        } catch (error) {
            console.error('[Quiz] Erreur lors du rendu de la question:', error);
            container.innerHTML = `
                <div class="quiz-error" style="padding: 2rem; text-align: center; color: #ef4444;">
                    <p>Erreur lors de l'affichage de la question. Veuillez rafraîchir la page.</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
                </div>
            `;
        }
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
        } else if (question.type === 'info') {
            // Type info : affiche uniquement l'information, pas de champ de saisie
            html += `
                <div class="quiz-info-block">
                    ${question.description || ''}
                </div>
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
        let savedValue = null;
        
        if (question.type === 'radio') {
            const input = document.querySelector(`input[name="question_${question.id}"]:checked`);
            savedValue = input ? input.value : null;
            this.answers[`question_${question.id}`] = savedValue;
        } else if (question.type === 'checkbox') {
            const input = document.getElementById(`question_${question.id}`);
            savedValue = input && input.checked ? (input.value || 'OUI') : null;
            this.answers[`question_${question.id}`] = savedValue;
        } else {
            const input = document.getElementById(`question_${question.id}`);
            savedValue = input ? (input.value || null) : null;
            this.answers[`question_${question.id}`] = savedValue;
            
            // IMPORTANT: Pour l'email, sauvegarder aussi avec le fieldName pour faciliter la récupération
            if (question.fieldName === 'email' || question.id === 'email') {
                this.answers.email = savedValue;
                this.answers['question_email'] = savedValue;
                console.log('✅ Email sauvegardé dans answers:', {
                    questionId: question.id,
                    fieldName: question.fieldName,
                    value: savedValue,
                    savedIn: ['question_' + question.id, 'email', 'question_email']
                });
            }
        }
        
        // Sauvegarder dans localStorage
        this.saveToLocalStorage();
        
        // Afficher l'indicateur de sauvegarde
        this.showSaveIndicator();
    }
    
    saveToLocalStorage() {
        try {
            const storageKey = `quiz_${this.profil}_answers`;
            const dataToSave = {
                answers: this.answers,
                currentStep: this.currentStep,
                timestamp: Date.now(),
                formId: this.formId
            };
            localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('[Quiz] Impossible de sauvegarder dans localStorage:', error);
        }
    }
    
    loadFromLocalStorage() {
        try {
            const storageKey = `quiz_${this.profil}_answers`;
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                // Vérifier que c'est pour le même formulaire
                if (data.formId === this.formId) {
                    // Restaurer les réponses
                    if (data.answers) {
                        Object.assign(this.answers, data.answers);
                    }
                    // Ne pas restaurer currentStep car on veut toujours commencer au début
                    // mais on peut l'utiliser pour afficher un message "Reprendre où vous vous êtes arrêté"
                    return true;
                }
            }
        } catch (error) {
            console.warn('[Quiz] Impossible de charger depuis localStorage:', error);
        }
        return false;
    }
    
    showSaveIndicator() {
        const saveIndicator = document.getElementById('quiz-save-indicator');
        if (saveIndicator) {
            saveIndicator.style.display = 'flex';
            saveIndicator.style.opacity = '1';
            
            // Masquer après 2 secondes avec animation
            setTimeout(() => {
                saveIndicator.style.transition = 'opacity 0.5s ease-out';
                saveIndicator.style.opacity = '0';
                setTimeout(() => {
                    if (saveIndicator.style.opacity === '0') {
                        saveIndicator.style.display = 'none';
                    }
                }, 500);
            }, 2000);
        }
    }
    
    initEvents() {
        const prevBtn = document.getElementById('quiz-btn-prev');
        const nextBtn = document.getElementById('quiz-btn-next');
        
        // Bouton précédent
        prevBtn.addEventListener('click', () => {
            this.saveCurrentAnswer();
            const validQuestions = this.getValidQuestions();
            const currentValidIndex = validQuestions.findIndex(q => q.id === this.questions[this.currentStep].id);
            if (currentValidIndex > 0) {
                this.showStep(currentValidIndex - 1);
            }
        });
        
        // Bouton suivant
        nextBtn.addEventListener('click', (e) => {
            if (nextBtn.type === 'submit') {
                // Vérifier que la dernière question est valide avant de soumettre
                if (!this.validateCurrentStep()) {
                    e.preventDefault();
                    e.stopPropagation();
                    const question = this.questions[this.currentStep];
                    if (question.type === 'checkbox') {
                        const checkbox = document.getElementById(`question_${question.id}`);
                        if (checkbox && !checkbox.checked) {
                            alert('⚠️ Veuillez cocher la case de certification pour continuer.');
                            checkbox.focus();
                            checkbox.style.outline = '2px solid #ef4444';
                            setTimeout(() => {
                                checkbox.style.outline = '';
                            }, 2000);
                        }
                    }
                    return false;
                }
                // Si valide, déclencher manuellement la soumission du formulaire
                console.log('✅ Formulaire prêt à être soumis, déclenchement de la soumission...');
                
                // Sauvegarder la réponse actuelle avant soumission
                this.saveCurrentAnswer();
                
                // Déclencher manuellement la soumission du formulaire
                console.log('✅ Validation OK, déclenchement de la soumission...');
                e.preventDefault();
                e.stopPropagation();
                
                // Appeler directement handleQuizFormSubmit si disponible
                if (typeof handleQuizFormSubmit === 'function') {
                    console.log('✅ Appel direct de handleQuizFormSubmit pour la landing page');
                    
                    // Vérifier que le bouton submit existe bien
                    const submitBtn = document.getElementById('quiz-btn-next');
                    if (!submitBtn) {
                        console.error('❌ Bouton submit non trouvé !');
                        return false;
                    }
                    console.log('✅ Bouton submit trouvé:', submitBtn, 'Type:', submitBtn.type, 'Disabled:', submitBtn.disabled);
                    
                    // Créer un événement qui ressemble à un événement submit réel
                    // handleQuizFormSubmit cherche event.target.querySelector('button[type="submit"]')
                    // Le bouton est dans le quiz-container qui est dans le form, donc ça devrait fonctionner
                    const fakeEvent = {
                        preventDefault: () => {
                            console.log('preventDefault appelé dans fakeEvent');
                        },
                        stopPropagation: () => {},
                        target: this.form, // Le formulaire contient le quiz-container qui contient le bouton
                        currentTarget: this.form
                    };
                    
                    // Appeler handleQuizFormSubmit
                    try {
                        handleQuizFormSubmit(fakeEvent);
                    } catch (error) {
                        console.error('❌ Erreur lors de l\'appel de handleQuizFormSubmit:', error);
                    }
                } else {
                    // Fallback : déclencher l'événement submit du formulaire
                    console.log('⚠️ handleQuizFormSubmit non trouvé, déclenchement de l\'événement submit');
                    const submitEvent = new Event('submit', { 
                        bubbles: true, 
                        cancelable: true
                    });
                    this.form.dispatchEvent(submitEvent);
                }
                return false;
            }
            
            if (this.validateCurrentStep()) {
                this.saveCurrentAnswer();
                const validQuestions = this.getValidQuestions();
                const currentValidIndex = validQuestions.findIndex(q => q.id === this.questions[this.currentStep].id);
                this.showStep(currentValidIndex + 1);
            } else {
                // Afficher un message d'erreur
                const question = this.questions[this.currentStep];
                const input = document.querySelector(`input[name="question_${question.id}"]:checked`) ||
                             document.getElementById(`question_${question.id}`);
                if (input) {
                    input.focus();
                    input.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            }
        });
        
        // Sauvegarder automatiquement lors du changement et passage automatique
        const container = document.getElementById('quiz-questions-container');
        if (container) {
            // Écouter les changements (radio, select, checkbox)
            container.addEventListener('change', (e) => {
                if (e.target.matches('input[name^="question_"], select[name^="question_"], textarea[name^="question_"]')) {
                    this.saveCurrentAnswer();
                    
                    // Activer/désactiver le bouton suivant selon le type de question
                    const question = this.questions[this.currentStep];
                    const nextBtn = document.getElementById('quiz-btn-next');
                    
                    if (question && nextBtn) {
                        if (question.type === 'checkbox' || e.target.type === 'checkbox') {
                            // Pour les checkboxes, activer/désactiver le bouton selon l'état
                            nextBtn.disabled = !e.target.checked;
                        } else if (question.type === 'radio' || e.target.tagName === 'SELECT') {
                            // Pour radio et select, activer le bouton et passer automatiquement (sauf dernière question)
                            nextBtn.disabled = false;
                            
                            // Passage automatique pour radio et select (sauf si c'est la dernière question)
                            if (this.validateCurrentStep()) {
                                const validQuestions = this.getValidQuestions();
                                const currentValidIndex = validQuestions.findIndex(q => q.id === question.id);
                                
                                // Ne pas passer automatiquement si c'est la dernière question ou si c'est un submit
                                if (nextBtn.type !== 'submit' && currentValidIndex < validQuestions.length - 1) {
                                    // Passage automatique après un court délai pour l'animation
                                    setTimeout(() => {
                                        this.showStep(currentValidIndex + 1);
                                    }, 600);
                                }
                            }
                        } else {
                            // Pour les autres types (textarea, text), activer si valide
                            nextBtn.disabled = !this.validateCurrentStep();
                        }
                    }
                }
            });
            
            // Écouter les saisies (input, textarea) avec debounce
            let inputTimeout;
            container.addEventListener('input', (e) => {
                if (e.target.matches('input[name^="question_"], textarea[name^="question_"]')) {
                    clearTimeout(inputTimeout);
                    inputTimeout = setTimeout(() => {
                        this.saveCurrentAnswer();
                    }, 1000); // Sauvegarder 1 seconde après la dernière frappe
                }
            });
        }
    }
    
    setupBudgetPackInfo(question) {
        // Ajouter un listener sur tous les inputs radio de la question budget
        const budgetInputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
        budgetInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.showPackInfoForBudget(e.target.value);
            });
        });
    }
    
    showPackInfoForBudget(budgetValue) {
        // Supprimer l'info pack précédente si elle existe
        const existingInfo = document.getElementById('pack-info-budget');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // Déterminer le pack adapté selon le budget
        let packInfo = null;
        
        if (budgetValue === '300-1000') {
            packInfo = {
                name: 'Pack Starter',
                price: '500€ TTC',
                description: 'Parfait pour ton budget ! Domtom Connect va rechercher activement des prestataires adaptés à tes besoins spécifiques et à ton budget dans notre réseau vérifié, et t\'accompagner dans ta recherche.',
                features: [
                    '<strong>Recherche personnalisée</strong> : Je cherche des prestataires selon tes besoins et ton budget',
                    '<strong>Sélection qualifiée</strong> : Prestataires vérifiés et adaptés à ton projet',
                    '<strong>Mise en relation</strong> : Connexion directe avec les prestataires sélectionnés',
                    '<strong>Accompagnement</strong> : Support dans tes échanges et négociations',
                    '<strong>Facilitation</strong> : Aide à la communication et coordination'
                ]
            };
        } else if (budgetValue === '1000-3000' || budgetValue === 'plus-3000') {
            packInfo = {
                name: 'Pack Premium',
                price: '1 900€ TTC',
                description: 'Excellent ! Avec le Pack Premium, Domtom Connect t\'accompagne de A à Z : recherche de prestataires adaptés, accompagnement de ton projet du début à la fin, et gestion complète des prestataires pour toi.',
                features: [
                    '<strong>Recherche approfondie</strong> : Je cherche des prestataires selon tes besoins et ton budget',
                    '<strong>Accompagnement complet</strong> : Ton projet accompagné du début jusqu\'à la fin',
                    '<strong>Gestion des prestataires</strong> : Je m\'occupe de la coordination, du suivi et de la communication',
                    '<strong>Réponse à tes besoins</strong> : Structuration, conseils stratégiques, optimisation',
                    '<strong>Suivi personnalisé</strong> : Optimisation continue de tes relations avec les prestataires',
                    '<strong>Support prioritaire</strong> : Disponible pour toutes tes questions et besoins',
                    '<strong>Résultat garanti</strong> : Mise en relation réussie avec des prestataires adaptés'
                ]
            };
        } else if (budgetValue === 'moins-300') {
            packInfo = {
                name: 'Information',
                price: 'Gratuit',
                description: 'Pas de souci ! Nous pouvons d\'abord discuter de ton projet et voir comment on peut t\'aider. Un appel de diagnostic gratuit te permettra de mieux comprendre nos services.',
                features: [
                    'Appel de diagnostic gratuit',
                    'Conseils personnalisés sur ton projet',
                    'Présentation de nos services',
                    'Pas d\'engagement'
                ]
            };
        } else if (budgetValue === 'non-defini') {
            packInfo = {
                name: 'Information',
                price: 'Gratuit',
                description: 'C\'est normal de ne pas avoir encore défini ton budget ! Un appel de diagnostic gratuit te permettra de mieux comprendre nos services et de définir ensemble la meilleure approche.',
                features: [
                    'Appel de diagnostic gratuit',
                    'Conseils personnalisés sur ton projet',
                    'Présentation de nos services adaptés à ta situation',
                    'Pas d\'engagement'
                ]
            };
        }
        
        // Afficher l'info pack si disponible
        if (packInfo) {
            const questionContainer = document.querySelector(`[data-question-id="budget"]`);
            if (questionContainer) {
                const packInfoHtml = `
                    <div id="pack-info-budget" style="margin-top: 1.5rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0, 191, 166, 0.1) 0%, rgba(0, 168, 150, 0.1) 100%); border-left: 4px solid #00BFA6; border-radius: 8px; animation: slideIn 0.4s ease-out;">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <h3 style="margin: 0; color: #00BFA6; font-size: 1.2rem; font-weight: 700;">${packInfo.name} - ${packInfo.price}</h3>
                                <p style="margin: 0.5rem 0 0 0; color: #333; font-size: 0.95rem;">${packInfo.description}</p>
                            </div>
                        </div>
                        <ul style="margin: 1rem 0 0 0; padding-left: 1.5rem; color: #555; font-size: 0.9rem; line-height: 1.8;">
                            ${packInfo.features.map(feature => `<li style="margin-bottom: 0.5rem;">${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <style>
                        @keyframes slideIn {
                            from {
                                opacity: 0;
                                transform: translateY(-10px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    </style>
                `;
                
                // Insérer après la question
                const questionContent = questionContainer.querySelector('.quiz-question-content');
                if (questionContent) {
                    questionContent.insertAdjacentHTML('beforeend', packInfoHtml);
                }
            }
        }
    }
    
    saveCurrentAnswer() {
        if (this.currentStep >= 0 && this.currentStep < this.questions.length) {
            this.saveAnswer(this.questions[this.currentStep]);
        }
    }
    
    validateCurrentStep() {
        const question = this.questions[this.currentStep];
        
        // Les questions de type 'info' sont toujours valides (pas de champ de saisie)
        if (question.type === 'info') {
            return true;
        }
        
        if (!question.required) return true;
        
        if (question.type === 'radio') {
            const input = document.querySelector(`input[name="question_${question.id}"]:checked`);
            return input !== null;
        } else if (question.type === 'checkbox') {
            const input = document.getElementById(`question_${question.id}`);
            return input && input.checked;
        } else {
            const input = document.getElementById(`question_${question.id}`);
            return input && input.value && input.value.trim() !== '';
        }
    }
    
    collectAllAnswers() {
        // Sauvegarder la réponse actuelle
        this.saveCurrentAnswer();
        
        // IMPORTANT: Sauvegarder TOUTES les réponses visibles dans le formulaire avant de collecter
        // Cela garantit que même si on est à la dernière étape, toutes les réponses précédentes sont sauvegardées
        // Réinitialiser temporairement pour forcer la collecte depuis les inputs
        const tempAnswers = { ...this.answers };
        this.questions.forEach(question => {
            const input = document.getElementById(`question_${question.id}`) || 
                         document.querySelector(`input[name="question_${question.id}"]`) ||
                         document.querySelector(`select[name="question_${question.id}"]`) ||
                         document.querySelector(`textarea[name="question_${question.id}"]`);
            if (input) {
                if (question.type === 'radio') {
                    const checked = document.querySelector(`input[name="question_${question.id}"]:checked`);
                    if (checked) {
                        this.answers[`question_${question.id}`] = checked.value;
                    }
                } else if (question.type === 'checkbox') {
                    this.answers[`question_${question.id}`] = input.checked ? (input.value || 'OUI') : null;
                } else {
                    this.answers[`question_${question.id}`] = input.value || null;
                }
            }
        });
        
        // Restaurer les réponses précédentes si elles n'ont pas été trouvées dans les inputs
        Object.keys(tempAnswers).forEach(key => {
            if (!this.answers[key] && tempAnswers[key]) {
                this.answers[key] = tempAnswers[key];
            }
        });
        
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
        // IMPORTANT: Parcourir toutes les questions et récupérer leurs réponses depuis this.answers
        // ET depuis les inputs du DOM pour s'assurer qu'on a les dernières valeurs
        this.questions.forEach(question => {
            // Essayer plusieurs clés possibles pour récupérer la réponse
            let answer = this.answers[`question_${question.id}`] || 
                        this.answers[question.id] ||
                        (question.fieldName ? this.answers[question.fieldName] : null);
            
            // Si pas de réponse dans answers, essayer de récupérer depuis le DOM
            if (!answer || answer === '') {
                const input = document.getElementById(`question_${question.id}`) || 
                            document.querySelector(`input[name="question_${question.id}"]`) ||
                            document.querySelector(`select[name="question_${question.id}"]`) ||
                            document.querySelector(`textarea[name="question_${question.id}"]`);
                
                if (input) {
                    if (question.type === 'radio') {
                        const checked = document.querySelector(`input[name="question_${question.id}"]:checked`);
                        if (checked) answer = checked.value;
                    } else if (question.type === 'checkbox') {
                        answer = input.checked ? (input.value || 'OUI') : null;
                    } else {
                        answer = input.value || null;
                    }
                }
            }
            
            if (answer !== null && answer !== undefined && answer !== '') {
                // Mapper les réponses aux noms de champs du formulaire
                const fieldName = question.fieldName || question.id;
                // Toujours utiliser la réponse du quiz si elle existe (priorité sur données pré-remplies)
                data[fieldName] = answer;
                
                // Log pour debug
                console.log(`✅ Réponse collectée pour ${fieldName}:`, answer);
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
        
        // Ajouter les champs cachés et mapper les champs question_* vers leurs fieldName
        formData.forEach((value, key) => {
            if (key !== 'website' && value) {
                // Si c'est un champ question_*, trouver la question correspondante pour mapper vers fieldName
                if (key.startsWith('question_')) {
                    const questionId = key.replace('question_', '');
                    const question = this.questions.find(q => q.id === questionId);
                    if (question) {
                        const fieldName = question.fieldName || questionId;
                        // Ne pas écraser si déjà défini
                        if (!data[fieldName]) {
                            data[fieldName] = value;
                        }
                    } else {
                        // Si pas de question trouvée, garder la clé originale
                        data[key] = value;
                    }
                } else {
                    data[key] = value;
                }
            }
        });
        
        // Vérifier que l'email est bien présent et valide
        // IMPORTANT: Récupérer l'email depuis TOUS les inputs du formulaire (visibles ou non)
        if (!data.email || data.email.trim() === '') {
            // 1. Essayer depuis TOUS les inputs email du formulaire (même non visibles)
            const allEmailInputs = this.form.querySelectorAll('input[type="email"], input[name="email"], input[name="question_email"], input[id="question_email"], input[id*="email"]');
            for (const emailInput of allEmailInputs) {
                if (emailInput && emailInput.value && emailInput.value.trim() !== '') {
                    data.email = emailInput.value.trim();
                    console.log('✅ Email récupéré depuis le DOM (input visible ou caché):', data.email);
                    break;
                }
            }
            
            // 2. Si toujours pas trouvé, essayer depuis formData
            if (!data.email || data.email.trim() === '') {
                const emailFromForm = formData.get('question_email') || formData.get('email');
                if (emailFromForm && emailFromForm.trim() !== '') {
                    data.email = emailFromForm.trim();
                    console.log('✅ Email récupéré depuis FormData:', data.email);
                }
            }
            
            // 3. Si toujours pas trouvé, essayer depuis les réponses sauvegardées
            if (!data.email || data.email.trim() === '') {
                const emailAnswer = this.answers['question_email'] || this.answers.email;
                if (emailAnswer && emailAnswer.trim() !== '') {
                    data.email = emailAnswer.trim();
                    console.log('✅ Email récupéré depuis answers:', data.email);
                }
            }
            
            // 4. Si toujours pas trouvé, chercher dans toutes les questions
            if (!data.email || data.email.trim() === '') {
                const emailQuestion = this.questions.find(q => q.id === 'email' || q.fieldName === 'email');
                if (emailQuestion) {
                    // Essayer depuis answers avec différentes clés
                    const emailValue = this.answers[`question_${emailQuestion.id}`] || 
                                    this.answers[emailQuestion.id] ||
                                    (emailQuestion.fieldName ? this.answers[emailQuestion.fieldName] : null);
                    if (emailValue && emailValue.trim() !== '') {
                        data.email = emailValue.trim();
                        console.log('✅ Email récupéré depuis la question email:', data.email);
                    } else {
                        // Dernière tentative : chercher l'input même s'il n'est pas dans le DOM actuel
                        const emailInputById = document.getElementById(`question_${emailQuestion.id}`);
                        if (emailInputById && emailInputById.value && emailInputById.value.trim() !== '') {
                            data.email = emailInputById.value.trim();
                            console.log('✅ Email récupéré depuis l\'input par ID:', data.email);
                        }
                    }
                }
            }
        } else {
            // Nettoyer l'email (supprimer les espaces)
            data.email = data.email.trim();
            console.log('✅ Email déjà présent dans data:', data.email);
        }
        
        // FORCER le mapping des champs de base (prenom, nom, email, telephone) depuis les réponses
        // Même si le mapping précédent a échoué, forcer la récupération depuis les réponses
        const baseFields = ['prenom', 'nom', 'email', 'telephone'];
        baseFields.forEach(fieldName => {
            if (!data[fieldName] || data[fieldName].trim() === '') {
                // Chercher la question correspondante
                const question = this.questions.find(q => q.id === fieldName || q.fieldName === fieldName);
                if (question) {
                    // Essayer plusieurs clés possibles
                    const value = this.answers[`question_${question.id}`] || 
                                 this.answers[question.id] ||
                                 (question.fieldName ? this.answers[question.fieldName] : null) ||
                                 formData.get(`question_${question.id}`) ||
                                 formData.get(question.fieldName || question.id);
                    
                    if (value && value.trim() !== '') {
                        data[fieldName] = value.trim();
                        console.log(`✅ ${fieldName} récupéré depuis les réponses:`, data[fieldName]);
                    }
                }
            }
        });
        
        // Log pour debug si email toujours manquant
        if (!data.email || data.email.trim() === '') {
            console.error('❌ Email manquant dans collectAllAnswers:', {
                formDataEntries: Array.from(formData.entries()),
                answers: this.answers,
                currentData: data,
                emailQuestion: this.questions.find(q => q.id === 'email' || q.fieldName === 'email'),
                emailInputs: Array.from(this.form.querySelectorAll('input[type="email"], input[name*="email"]')).map(inp => ({
                    name: inp.name,
                    id: inp.id,
                    value: inp.value
                })),
                allQuestions: this.questions.map(q => ({
                    id: q.id,
                    fieldName: q.fieldName,
                    answer: this.answers[`question_${q.id}`]
                }))
            });
            
            // Dernière tentative : parcourir toutes les questions et chercher manuellement l'email
            const emailQuestion = this.questions.find(q => q.id === 'email' || q.fieldName === 'email');
            if (emailQuestion) {
                // Essayer toutes les clés possibles
                const possibleKeys = [
                    `question_${emailQuestion.id}`,
                    emailQuestion.id,
                    emailQuestion.fieldName,
                    'email',
                    'question_email'
                ];
                
                for (const key of possibleKeys) {
                    if (this.answers[key] && this.answers[key].trim() !== '') {
                        data.email = this.answers[key].trim();
                        console.log(`✅ Email récupéré depuis answers avec la clé "${key}":`, data.email);
                        break;
                    }
                }
            }
        }
        
        // Valider le format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            console.warn('[Quiz] Email invalide détecté:', data.email);
        }
        
        // Vérification finale : si l'email est toujours manquant, chercher dans TOUS les champs
        if (!data.email || data.email.trim() === '') {
            console.warn('⚠️ Email manquant, recherche dans tous les champs du formulaire...');
            
            // Dernière tentative : parcourir TOUS les inputs du document
            const allInputs = document.querySelectorAll('input, textarea, select');
            for (const input of allInputs) {
                const value = input.value || '';
                // Si la valeur ressemble à un email
                if (value.includes('@') && value.includes('.')) {
                    data.email = value.trim();
                    console.log('✅ Email trouvé dans un input quelconque:', data.email);
                    break;
                }
            }
        }
        
        // Si TOUJOURS pas d'email, utiliser une valeur par défaut pour permettre l'envoi
        if (!data.email || data.email.trim() === '') {
            console.error('❌ Email toujours manquant, utilisation d\'une valeur par défaut');
            data.email = 'email-manquant@domtomconnect.com'; // Valeur par défaut pour permettre l'envoi
        }
        
        return data;
    }
}

// Initialiser le quiz quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Le quiz sera initialisé par chaque landing page avec ses propres questions
});

