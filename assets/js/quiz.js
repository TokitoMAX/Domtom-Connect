// Quiz functionality

const quizQuestions = [
    {
        id: 1,
        question: "Quel est votre profil ?",
        type: "radio",
        options: [
            { value: "porteur-projet", label: "Porteur de projet", score: 2 },
            { value: "prestataire", label: "Prestataire", score: 1 },
            { value: "entreprise", label: "Entreprise", score: 2 },
            { value: "investisseur", label: "Investisseur", score: 1 }
        ]
    },
    {
        id: 2,
        question: "À quel stade est votre projet ?",
        type: "radio",
        options: [
            { value: "idee", label: "J'ai juste une idée", score: 1 },
            { value: "developpement", label: "En développement", score: 3 },
            { value: "lance", label: "Déjà lancé", score: 4 },
            { value: "croissance", label: "En croissance", score: 5 }
        ]
    },
    {
        id: 3,
        question: "Avez-vous clarifié votre vision et vos objectifs ?",
        type: "radio",
        options: [
            { value: "oui", label: "Oui, c'est très clair", score: 5 },
            { value: "partiellement", label: "Partiellement", score: 3 },
            { value: "non", label: "Pas encore", score: 1 }
        ]
    },
    {
        id: 4,
        question: "Quel est votre budget estimé pour votre projet ?",
        type: "radio",
        options: [
            { value: "0-1000", label: "Moins de 1 000€", score: 1 },
            { value: "1000-5000", label: "1 000€ - 5 000€", score: 2 },
            { value: "5000-10000", label: "5 000€ - 10 000€", score: 3 },
            { value: "10000+", label: "Plus de 10 000€", score: 4 },
            { value: "non-defini", label: "Pas encore défini", score: 1 }
        ]
    },
    {
        id: 5,
        question: "Quel est votre territoire principal ?",
        type: "select",
        options: [
            { value: "martinique", label: "Martinique", score: 2 },
            { value: "guadeloupe", label: "Guadeloupe", score: 2 },
            { value: "reunion", label: "La Réunion", score: 2 },
            { value: "guyane", label: "Guyane", score: 2 },
            { value: "mayotte", label: "Mayotte", score: 2 },
            { value: "polynesie", label: "Polynésie française", score: 2 },
            { value: "nouvelle-caledonie", label: "Nouvelle-Calédonie", score: 2 },
            { value: "diaspora", label: "Diaspora", score: 2 },
            { value: "autre", label: "Autre", score: 1 }
        ]
    }
];

let currentQuestion = 0;
let answers = [];
let totalScore = 0;

document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
});

function initQuiz() {
    showQuestion(0);
}

function showQuestion(index) {
    if (index >= quizQuestions.length) {
        showResults();
        return;
    }

    currentQuestion = index;
    const question = quizQuestions[index];
    const quizContent = document.getElementById('quiz-content');
    
    // Update progress
    updateProgress(index + 1, quizQuestions.length);
    
    // Build question HTML
    let questionHTML = `<div class="quiz-question" data-question-id="${question.id}">`;
    questionHTML += `<h2 class="quiz-question-title">${question.question}</h2>`;
    questionHTML += `<div class="quiz-options">`;
    
    if (question.type === 'radio') {
        question.options.forEach((option, optIndex) => {
            questionHTML += `
                <label class="quiz-option">
                    <input type="radio" name="question-${question.id}" value="${option.value}" data-score="${option.score}">
                    ${option.label}
                </label>
            `;
        });
    } else if (question.type === 'select') {
        questionHTML += `<select class="quiz-option" name="question-${question.id}">`;
        questionHTML += `<option value="">Sélectionnez une option</option>`;
        question.options.forEach(option => {
            questionHTML += `<option value="${option.value}" data-score="${option.score}">${option.label}</option>`;
        });
        questionHTML += `</select>`;
    }
    
    questionHTML += `</div>`;
    questionHTML += `<div class="quiz-navigation">`;
    
    if (index > 0) {
        questionHTML += `<button type="button" class="quiz-button quiz-button-secondary" onclick="previousQuestion()">Précédent</button>`;
    } else {
        questionHTML += `<div></div>`;
    }
    
    questionHTML += `<button type="button" class="quiz-button quiz-button-primary" onclick="nextQuestion()" id="next-btn" disabled>${index === quizQuestions.length - 1 ? 'Voir les résultats' : 'Suivant'}</button>`;
    questionHTML += `</div>`;
    questionHTML += `</div>`;
    
    quizContent.innerHTML = questionHTML;
    
    // Add event listeners
    if (question.type === 'radio') {
        document.querySelectorAll(`input[name="question-${question.id}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                document.getElementById('next-btn').disabled = false;
                document.querySelectorAll(`label.quiz-option`).forEach(label => {
                    label.classList.remove('selected');
                });
                this.closest('label').classList.add('selected');
            });
        });
    } else if (question.type === 'select') {
        const select = document.querySelector(`select[name="question-${question.id}"]`);
        select.addEventListener('change', function() {
            document.getElementById('next-btn').disabled = !this.value;
        });
    }
}

function updateProgress(current, total) {
    const progressBar = document.getElementById('quiz-progress-bar');
    const progressText = document.getElementById('quiz-progress-text');
    const percentage = (current / total) * 100;
    
    // Update CSS variable for the ::after pseudo-element
    progressBar.style.setProperty('--progress', `${percentage}%`);
    progressText.textContent = `Question ${current} sur ${total}`;
}

function nextQuestion() {
    const question = quizQuestions[currentQuestion];
    let selectedValue = null;
    let selectedScore = 0;
    
    if (question.type === 'radio') {
        const selected = document.querySelector(`input[name="question-${question.id}"]:checked`);
        if (selected) {
            selectedValue = selected.value;
            selectedScore = parseInt(selected.dataset.score);
        }
    } else if (question.type === 'select') {
        const selected = document.querySelector(`select[name="question-${question.id}"]`);
        if (selected && selected.value) {
            selectedValue = selected.value;
            const selectedOption = selected.options[selected.selectedIndex];
            selectedScore = parseInt(selectedOption.dataset.score);
        }
    }
    
    if (!selectedValue) {
        alert('Veuillez sélectionner une réponse');
        return;
    }
    
    answers.push({
        questionId: question.id,
        question: question.question,
        answer: selectedValue,
        score: selectedScore
    });
    
    totalScore += selectedScore;
    
    // Track answer
    if (window.trackLead) {
        window.trackLead({
            source: 'quiz',
            question: question.id,
            answer: selectedValue,
            score: selectedScore
        });
    }
    
    showQuestion(currentQuestion + 1);
}

function previousQuestion() {
    if (currentQuestion > 0) {
        // Remove last answer
        if (answers.length > 0) {
            totalScore -= answers[answers.length - 1].score;
            answers.pop();
        }
        showQuestion(currentQuestion - 1);
    }
}

function showResults() {
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    
    const maxScore = quizQuestions.reduce((sum, q) => {
        const maxOptionScore = Math.max(...q.options.map(o => o.score));
        return sum + maxOptionScore;
    }, 0);
    
    const percentage = Math.round((totalScore / maxScore) * 100);
    const qualificationScore = Math.round((totalScore / maxScore) * 10);
    
    let resultTitle = '';
    let resultDescription = '';
    let recommendations = [];
    
    if (percentage >= 80) {
        resultTitle = 'Excellent ! Votre projet est bien préparé 🎉';
        resultDescription = 'Votre projet semble bien structuré et prêt à avancer. Vous pouvez maintenant chercher des prestataires ou des partenaires en toute confiance.';
        recommendations = [
            'Contactez Domtom Connect pour trouver les meilleurs prestataires',
            'Préparez un brief détaillé pour vos futurs prestataires',
            'Rejoignez la communauté pour échanger avec d\'autres entrepreneurs'
        ];
    } else if (percentage >= 60) {
        resultTitle = 'Bien préparé, quelques ajustements à faire 👍';
        resultDescription = 'Votre projet est sur la bonne voie, mais il y a encore quelques points à clarifier avant de vous lancer pleinement.';
        recommendations = [
            'Clarifiez votre vision et vos objectifs',
            'Définissez un budget précis pour votre projet',
            'Téléchargez notre checklist pour vérifier tous les points',
            'Rejoignez Domtom Connect pour bénéficier d\'un accompagnement'
        ];
    } else {
        resultTitle = 'Votre projet a besoin de plus de préparation 📋';
        resultDescription = 'Il est important de mieux structurer votre projet avant de chercher des prestataires ou des partenaires. Prenez le temps de clarifier votre vision.';
        recommendations = [
            'Téléchargez notre guide gratuit pour structurer votre projet',
            'Clarifiez votre vision et vos objectifs précis',
            'Définissez un budget réaliste',
            'Identifiez vos besoins précis',
            'Rejoignez Domtom Connect pour être accompagné dans votre démarche'
        ];
    }
    
    const resultsHTML = `
        <div class="quiz-score">${percentage}%</div>
        <div class="quiz-score-label">Score de préparation</div>
        <h2 class="quiz-result-title">${resultTitle}</h2>
        <p class="quiz-result-description">${resultDescription}</p>
        
        <div class="quiz-recommendations">
            <h3>Nos recommandations :</h3>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        
        <div class="quiz-contact-form-container">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.25rem;">Recevez vos recommandations personnalisées</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
                Laissez-nous vos coordonnées et nous vous contacterons avec des conseils adaptés à votre situation.
            </p>
            <form class="quiz-contact-form" id="quiz-contact-form" onsubmit="handleQuizContactSubmit(event)">
                <div class="form-row">
                    <input type="text" name="prenom" placeholder="Prénom *" required>
                    <input type="text" name="nom" placeholder="Nom *" required>
                </div>
                <input type="email" name="email" placeholder="Email *" required>
                <input type="tel" name="telephone" placeholder="Téléphone *" required>
                <select name="ile" required>
                    <option value="">Votre territoire *</option>
                    <option value="martinique">Martinique</option>
                    <option value="guadeloupe">Guadeloupe</option>
                    <option value="reunion">La Réunion</option>
                    <option value="guyane">Guyane</option>
                    <option value="mayotte">Mayotte</option>
                    <option value="polynesie">Polynésie française</option>
                    <option value="nouvelle-caledonie">Nouvelle-Calédonie</option>
                    <option value="diaspora">Diaspora</option>
                    <option value="autre">Autre</option>
                </select>
                <button type="submit" class="cta-button primary large">
                    Recevoir mes recommandations
                </button>
                <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
                    🔒 Vos données sont sécurisées. Nous vous contacterons dans les 24h.
                </p>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center;">
                    * Champs obligatoires
                </p>
            </form>
        </div>
        
        <div class="quiz-cta" id="quiz-cta-after-form" style="display: none;">
            <a href="/#inscription-form" class="cta-button primary large">
                Rejoindre Domtom Connect maintenant
            </a>
        </div>
    `;
    
    quizResults.innerHTML = resultsHTML;
    
    // Track quiz completion
    if (window.trackLead) {
        window.trackLead({
            source: 'quiz',
            action: 'completed',
            score: qualificationScore,
            percentage: percentage,
            answers: answers
        });
    }
    
    // Store quiz results globally for contact form submission
    window.quizResults = {
        score: qualificationScore,
        percentage: percentage,
        answers: answers
    };
}

function handleQuizContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validation
    if (!data.prenom || !data.nom || !data.email || !data.telephone || !data.ile) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Add quiz results to data
    if (window.quizResults) {
        data.quiz_score = window.quizResults.score;
        data.quiz_percentage = window.quizResults.percentage;
        data.quiz_answers = JSON.stringify(window.quizResults.answers);
    }
    
    // Add tracking data
    data.lead_source = 'quiz';
    data.timestamp = new Date().toISOString();
    
    // Track the lead
    if (window.trackLead) {
        window.trackLead({
            source: 'quiz',
            action: 'contact_submitted',
            email: data.email,
            score: window.quizResults ? window.quizResults.score : null
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    // Send to Formspree
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `🆕 Quiz Complété - ${data.prenom} ${data.nom} (Score: ${data.quiz_score}/10)`);
    formDataToSend.append('_replyto', data.email);
    
    let messageBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 QUIZ COMPLÉTÉ - DEMANDE DE CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score: ${data.quiz_score}/10 (${data.quiz_percentage}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 INFORMATIONS CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone}
Territoire: ${data.ile}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RÉPONSES DU QUIZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.quiz_answers ? JSON.parse(data.quiz_answers).map((a, i) => `${i + 1}. ${a.question}\n   Réponse: ${a.answer} (Score: ${a.score})`).join('\n\n') : 'Non disponible'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter la personne pour un appel
2. Discuter des résultats du quiz et des recommandations
3. Après l'appel, décider (oui/non)
4. Si oui, ajouter à l'écosystème WhatsApp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    formDataToSend.append('message', messageBody);
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone);
    formDataToSend.append('Territoire', data.ile);
    formDataToSend.append('Score Quiz', data.quiz_score);
    formDataToSend.append('Pourcentage Quiz', data.quiz_percentage);
    
    fetch('https://formspree.io/f/myzbqepy', {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            form.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Merci !</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                        Vos informations ont été enregistrées. Nous vous contacterons dans les 24h avec vos recommandations personnalisées.
                    </p>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                        Vérifiez votre email pour les détails.
                    </p>
                    <a href="/#inscription-form" class="cta-button primary">
                        Rejoindre Domtom Connect
                    </a>
                </div>
            `;
            
            // Show CTA section
            const ctaSection = document.getElementById('quiz-cta-after-form');
            if (ctaSection) {
                ctaSection.style.display = 'block';
            }
        } else {
            return response.json().then(errData => {
                throw new Error(errData.error || 'Erreur lors de l\'envoi');
            });
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// Expose function globally
window.handleQuizContactSubmit = handleQuizContactSubmit;

// Cette fonction n'est plus utilisée car on envoie les résultats avec le formulaire de contact
// function sendQuizResults(score, percentage, answers) {
//     // Les résultats sont maintenant envoyés avec le formulaire de contact
// }
