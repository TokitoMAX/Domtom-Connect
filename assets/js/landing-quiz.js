// Système de quiz multi-étapes pour les landing pages

class LandingQuiz {
    constructor(questions, formId, profil) {
        this.questions = questions;
        this.formId = formId;
        this.profil = profil;
        this.currentStep = 0;
        this.answers = {};
        this.form = null;
        
        this.init();
    }
    
    init() {
        this.form = document.getElementById(this.formId);
        if (!this.form) return;
        
        // Pré-remplir depuis sessionStorage si disponible
        this.prefillFromSession();
        
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
                // Pré-remplir les réponses avec les données stockées
                if (data.prenom) this.answers.prenom = data.prenom;
                if (data.nom) this.answers.nom = data.nom;
                if (data.email) this.answers.email = data.email;
                if (data.telephone) this.answers.telephone = data.telephone;
                if (data.ile) this.answers.ile = data.ile;
            } catch (e) {
                console.error('Erreur lors du préremplissage:', e);
            }
        }
    }
    
    createQuizStructure() {
        // Créer le container quiz s'il n'existe pas
        let quizContainer = this.form.querySelector('.quiz-container');
        if (!quizContainer) {
            quizContainer = document.createElement('div');
            quizContainer.className = 'quiz-container';
            this.form.appendChild(quizContainer);
        }
        
        // Créer la structure HTML du quiz
        quizContainer.innerHTML = `
            <input type="hidden" name="profil" value="${this.profil}">
            <input type="hidden" name="lead_source" value="landing-${this.profil}">
            <input type="hidden" name="form_step" value="complete">
            <input type="text" name="website" tabindex="-1" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" autocomplete="off" aria-hidden="true">
            
            <!-- Barre de progression -->
            <div class="quiz-progress-container">
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
                </div>
                <div class="quiz-progress-text">
                    <span id="quiz-step-indicator">Question 1 sur ${this.questions.length}</span>
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
            if (!question.conditional) return true;
            const parentValue = this.answers[`question_${question.conditional.field}`];
            return parentValue === question.conditional.value;
        });
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
        if (stepIndex < 0) return;
        
        const validQuestions = this.getValidQuestions();
        
        if (stepIndex >= validQuestions.length) {
            // Toutes les questions sont terminées, soumettre
            this.submitForm();
            return;
        }
        
        const question = validQuestions[stepIndex];
        const actualStep = this.getQuestionIndex(question.id);
        
        this.currentStep = actualStep;
        
        const container = document.getElementById('quiz-questions-container');
        const prevBtn = document.getElementById('quiz-btn-prev');
        const nextBtn = document.getElementById('quiz-btn-next');
        const progressFill = document.getElementById('quiz-progress-fill');
        const stepIndicator = document.getElementById('quiz-step-indicator');
        
        // Compter le nombre total de questions affichables
        const totalQuestions = validQuestions.length;
        const currentQuestionNumber = stepIndex + 1;
        
        // Mettre à jour la barre de progression
        const progress = (currentQuestionNumber / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        stepIndicator.textContent = `Question ${currentQuestionNumber} sur ${totalQuestions}`;
        
        // Afficher/masquer le bouton précédent
        prevBtn.style.display = stepIndex > 0 ? 'flex' : 'none';
        
        // Changer le texte du bouton suivant
        const isLastQuestion = stepIndex === validQuestions.length - 1;
        
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
        }
        
        // Créer et afficher la question
        container.innerHTML = this.renderQuestion(question, stepIndex);
        
        // Restaurer la réponse si elle existe
        this.restoreAnswer(question);
        
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
            html += '<div class="quiz-options">';
            question.options.forEach((option, optIndex) => {
                const optionId = `q${question.id}_opt${optIndex}`;
                html += `
                    <label class="quiz-option" for="${optionId}">
                        <input type="radio" 
                               id="${optionId}" 
                               name="question_${question.id}" 
                               value="${option.value}"
                               ${this.answers[`question_${question.id}`] === option.value ? 'checked' : ''}>
                        <span class="quiz-option-label">${option.label}</span>
                    </label>
                `;
            });
            html += '</div>';
        } else if (question.type === 'select') {
            html += `<select name="question_${question.id}" class="quiz-select" id="question_${question.id}">`;
            html += `<option value="">${question.placeholder || 'Sélectionnez une option'}</option>`;
            question.options.forEach(option => {
                html += `<option value="${option.value}" ${this.answers[`question_${question.id}`] === option.value ? 'selected' : ''}>${option.label}</option>`;
            });
            html += '</select>';
        } else if (question.type === 'text' || question.type === 'email' || question.type === 'tel' || question.type === 'url') {
            html += `
                <input type="${question.type}" 
                       name="question_${question.id}" 
                       class="quiz-input" 
                       id="question_${question.id}"
                       placeholder="${question.placeholder || ''}"
                       value="${this.answers[`question_${question.id}`] || ''}"
                       ${question.required ? 'required' : ''}
                       ${question.pattern ? `pattern="${question.pattern}"` : ''}
                       ${question.maxlength ? `maxlength="${question.maxlength}"` : ''}>
            `;
        } else if (question.type === 'textarea') {
            html += `
                <textarea name="question_${question.id}" 
                          class="quiz-textarea" 
                          id="question_${question.id}"
                          placeholder="${question.placeholder || ''}"
                          rows="${question.rows || 4}"
                          ${question.required ? 'required' : ''}>${this.answers[`question_${question.id}`] || ''}</textarea>
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
        const savedAnswer = this.answers[`question_${question.id}`];
        if (!savedAnswer) return;
        
        if (question.type === 'radio') {
            const radio = document.querySelector(`input[name="question_${question.id}"][value="${savedAnswer}"]`);
            if (radio) radio.checked = true;
        } else if (question.type === 'select') {
            const select = document.getElementById(`question_${question.id}`);
            if (select) select.value = savedAnswer;
        } else {
            const input = document.getElementById(`question_${question.id}`);
            if (input) input.value = savedAnswer;
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
                // Laisser le formulaire se soumettre normalement
                return;
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
        if (this.currentStep >= 0 && this.currentStep < this.questions.length) {
            this.saveAnswer(this.questions[this.currentStep]);
        }
    }
    
    validateCurrentStep() {
        const question = this.questions[this.currentStep];
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
        
        // Collecter toutes les réponses dans le formulaire
        const formData = new FormData(this.form);
        const data = {};
        
        // Ajouter les réponses du quiz
        this.questions.forEach(question => {
            const answer = this.answers[`question_${question.id}`];
            if (answer !== null && answer !== undefined && answer !== '') {
                // Mapper les réponses aux noms de champs du formulaire
                const fieldName = question.fieldName || question.id;
                data[fieldName] = answer;
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

