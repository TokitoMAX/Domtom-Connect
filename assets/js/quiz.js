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
        
        <div class="quiz-cta">
            <a href="/#inscription-form" class="cta-button primary large">
                Rejoindre Domtom Connect maintenant
            </a>
            <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                Vos réponses ont été enregistrées. Nous vous contacterons avec des recommandations personnalisées.
            </p>
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
    
    // Send results to Formspree
    sendQuizResults(qualificationScore, percentage, answers);
}

function sendQuizResults(score, percentage, answers) {
    // Send results to Formspree (même endpoint que le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `🆕 Quiz Complété - Score: ${score}/10`);
    formDataToSend.append('message', `Résultats du quiz\n\nScore: ${score}/10 (${percentage}%)\n\nRéponses:\n${JSON.stringify(answers, null, 2)}`);
    formDataToSend.append('Score', score);
    formDataToSend.append('Pourcentage', percentage);
    formDataToSend.append('Source', 'quiz');
    
    fetch('https://formspree.io/f/myzbqepy', {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    }).catch(error => {
        console.error('Erreur lors de l\'envoi des résultats:', error);
    });
}
