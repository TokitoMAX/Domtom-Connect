// Quiz functionality avec questions adaptatives selon le profil

// Question initiale : Profil
const profileQuestion = {
    id: 1,
    question: "Quel est votre profil ?",
    type: "radio",
    options: [
        { value: "porteur-projet", label: "Porteur de projet / Entrepreneur", score: 2 },
        { value: "prestataire", label: "Prestataire", score: 2 },
        { value: "entreprise", label: "Entreprise", score: 2 },
        { value: "investisseur", label: "Investisseur", score: 2 },
        { value: "professionnel", label: "Professionnel", score: 2 },
        { value: "autre", label: "Autre", score: 1 }
    ]
};

// Questions adaptatives par profil
const adaptiveQuestions = {
    "porteur-projet": [
        {
            id: 2,
            question: "À quel stade est votre projet ?",
            type: "radio",
            options: [
                { value: "idee-clarifiee", label: "Idée clarifiée mais pas encore lancée", score: 2 },
                { value: "lancement", label: "Projet en cours de lancement", score: 3 },
                { value: "lance", label: "Activité déjà lancée (clients / utilisateurs)", score: 4 },
                { value: "developpement", label: "Projet en phase de développement / structuration", score: 4 }
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
            question: "Quel budget êtes-vous prêt à investir dans l'accompagnement Domtom Connect pour les prochains mois ?",
            type: "radio",
            options: [
                { value: "moins-300", label: "Moins de 300 €", score: 1 },
                { value: "300-1000", label: "300-1 000 €", score: 2 },
                { value: "1000-3000", label: "1 000-3 000 €", score: 3 },
                { value: "plus-3000", label: "Plus de 3 000 €", score: 4 },
                { value: "non-defini", label: "Pas encore défini", score: 1 }
            ],
            clarification: "💡 <strong>Important à savoir :</strong> L'accompagnement Domtom Connect (recherche, mise en relation, suivi) est un service séparé. Les prestataires sont payés <strong>directement par vous</strong>, sans commission intermédiaire. Vous gardez le contrôle total sur vos budgets de prestations."
        },
        {
            id: 5,
            question: "Quel est votre lien avec les territoires insulaires (DOM-TOM / îles / diaspora) ?",
            type: "radio",
            options: [
                { value: "vis-territoire", label: "Je vis dans un territoire insulaire", score: 2 },
                { value: "diaspora", label: "Je fais partie de la diaspora", score: 2 },
                { value: "projet-cible", label: "Mon projet cible un territoire insulaire", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 6,
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
    ],
    "investisseur": [
        {
            id: 2,
            question: "Quel type d'investissement vous intéresse ?",
            type: "radio",
            options: [
                { value: "capital-risque", label: "Capital-risque", score: 3 },
                { value: "pret", label: "Prêt", score: 3 },
                { value: "subvention", label: "Subvention", score: 2 },
                { value: "mecenat", label: "Mécénat", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 3,
            question: "Quel est votre montant d'investissement potentiel ?",
            type: "radio",
            options: [
                { value: "moins-10k", label: "Moins de 10 000 €", score: 1 },
                { value: "10k-50k", label: "10 000 - 50 000 €", score: 3 },
                { value: "50k-200k", label: "50 000 - 200 000 €", score: 4 },
                { value: "200k-plus", label: "Plus de 200 000 €", score: 5 }
            ]
        },
        {
            id: 4,
            question: "Quels sont vos secteurs d'intérêt ?",
            type: "radio",
            options: [
                { value: "tech", label: "Technologie / Digital", score: 2 },
                { value: "commerce", label: "Commerce / E-commerce", score: 2 },
                { value: "services", label: "Services", score: 2 },
                { value: "agriculture", label: "Agriculture / Agroalimentaire", score: 2 },
                { value: "tourisme", label: "Tourisme", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 5,
            question: "Quelle est votre expérience en investissement ?",
            type: "radio",
            options: [
                { value: "debutant", label: "Débutant", score: 2 },
                { value: "quelques-investissements", label: "Quelques investissements", score: 3 },
                { value: "expert", label: "Expert", score: 4 }
            ]
        },
        {
            id: 6,
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
    ],
    "prestataire": [
        {
            id: 2,
            question: "Quels types de services proposez-vous ?",
            type: "radio",
            options: [
                { value: "digital", label: "Digital / Web / Communication", score: 3 },
                { value: "conseil", label: "Conseil / Stratégie", score: 3 },
                { value: "juridique", label: "Juridique / Fiscal", score: 3 },
                { value: "comptabilite", label: "Comptabilité / Finance", score: 3 },
                { value: "autre", label: "Autre", score: 2 }
            ]
        },
        {
            id: 3,
            question: "Quelle est votre expérience ?",
            type: "radio",
            options: [
                { value: "debutant", label: "Débutant (< 2 ans)", score: 2 },
                { value: "intermediaire", label: "Intermédiaire (2-5 ans)", score: 3 },
                { value: "expert", label: "Expert (5+ ans)", score: 4 }
            ]
        },
        {
            id: 4,
            question: "Dans quels territoires pouvez-vous intervenir ?",
            type: "radio",
            options: [
                { value: "local", label: "Mon territoire uniquement", score: 2 },
                { value: "plusieurs", label: "Plusieurs territoires", score: 3 },
                { value: "tous", label: "Tous les territoires (distanciel possible)", score: 4 }
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
    ],
    "entreprise": [
        {
            id: 2,
            question: "Dans quel secteur d'activité êtes-vous ?",
            type: "radio",
            options: [
                { value: "tech", label: "Technologie / Digital", score: 2 },
                { value: "commerce", label: "Commerce / E-commerce", score: 2 },
                { value: "services", label: "Services", score: 2 },
                { value: "agriculture", label: "Agriculture / Agroalimentaire", score: 2 },
                { value: "tourisme", label: "Tourisme", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 3,
            question: "Quel est votre principal besoin avec Domtom Connect ?",
            type: "radio",
            options: [
                { value: "prestataires", label: "Trouver des prestataires fiables", score: 3 },
                { value: "reseau", label: "Rejoindre un réseau d'entreprises", score: 2 },
                { value: "visibilite", label: "Gagner en visibilité", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 4,
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
    ],
    "professionnel": [
        {
            id: 2,
            question: "Dans quel secteur d'activité travaillez-vous ?",
            type: "radio",
            options: [
                { value: "tech", label: "Technologie / Digital", score: 2 },
                { value: "commerce", label: "Commerce", score: 2 },
                { value: "services", label: "Services", score: 2 },
                { value: "finance", label: "Finance / Banque", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 3,
            question: "Quel est votre poste / fonction ?",
            type: "radio",
            options: [
                { value: "cadre", label: "Cadre", score: 3 },
                { value: "manager", label: "Manager / Directeur", score: 3 },
                { value: "consultant", label: "Consultant / Freelance", score: 3 },
                { value: "autre", label: "Autre", score: 2 }
            ]
        },
        {
            id: 4,
            question: "Quel est votre besoin spécifique avec Domtom Connect ?",
            type: "radio",
            options: [
                { value: "reseau", label: "Rejoindre un réseau professionnel", score: 2 },
                { value: "opportunites", label: "Découvrir des opportunités", score: 2 },
                { value: "collaboration", label: "Collaborer sur des projets", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
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
    ],
    "autre": [
        {
            id: 2,
            question: "Quel est votre rôle / profil ?",
            type: "radio",
            options: [
                { value: "association", label: "Association / ONG", score: 2 },
                { value: "collectivite", label: "Collectivité / Institution", score: 2 },
                { value: "media", label: "Média / Journaliste", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 3,
            question: "Quel est votre besoin avec Domtom Connect ?",
            type: "radio",
            options: [
                { value: "information", label: "Obtenir des informations", score: 2 },
                { value: "reseau", label: "Rejoindre un réseau", score: 2 },
                { value: "collaboration", label: "Collaborer sur des projets", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 4,
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
    ]
};

// Mapping des profils vers les landing pages
const profileLandingPages = {
    "porteur-projet": "/landing/porteurs-projets",
    "prestataire": "/landing/prestataires",
    "entreprise": "/landing/entreprises",
    "investisseur": "/landing/investisseurs",
    "professionnel": "/landing/professionnels",
    "autre": "/landing/autre"
};

let currentQuestionIndex = 0;
let selectedProfile = null;
let quizQuestions = [];
let answers = [];
let totalScore = 0;

document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
});

function initQuiz() {
    // Commencer par la question de profil
    quizQuestions = [profileQuestion];
    showQuestion(0);
}

function showQuestion(index) {
    if (index >= quizQuestions.length) {
        showResults();
        return;
    }

    currentQuestionIndex = index;
    const question = quizQuestions[index];
    const quizContent = document.getElementById('quiz-content');
    
    // Mettre à jour la progression
    const totalQuestions = getTotalQuestionsCount();
    updateProgress(index + 1, totalQuestions);
    
    // Construire le HTML de la question
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
    
    // Ajouter la clarification si elle existe
    if (question.clarification) {
        questionHTML += `
            <div class="quiz-clarification" style="margin-top: 1.5rem; padding: 1rem 1.25rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(96, 165, 250, 0.05)); border-left: 4px solid #3B82F6; border-radius: 12px; font-size: 0.9rem; line-height: 1.6; color: #475569;">
                ${question.clarification}
            </div>
        `;
    }
    
    questionHTML += `<div class="quiz-navigation">`;
    
    if (index > 0) {
        questionHTML += `<button type="button" class="quiz-button quiz-button-secondary" onclick="previousQuestion()">Précédent</button>`;
    } else {
        questionHTML += `<div></div>`;
    }
    
    const isLastQuestion = index === quizQuestions.length - 1;
    questionHTML += `<button type="button" class="quiz-button quiz-button-primary" onclick="nextQuestion()" id="next-btn" disabled>${isLastQuestion ? 'Voir les résultats' : 'Suivant'}</button>`;
    questionHTML += `</div>`;
    questionHTML += `</div>`;
    
    quizContent.innerHTML = questionHTML;
    
    // Ajouter les event listeners
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

function getTotalQuestionsCount() {
    if (!selectedProfile) {
        // Si le profil n'est pas encore sélectionné, compter la question profil + moyenne des questions adaptatives
        return 5; // Estimation moyenne
    }
    return 1 + adaptiveQuestions[selectedProfile].length; // 1 pour le profil + questions adaptatives
}

function updateProgress(current, total) {
    const progressBar = document.getElementById('quiz-progress-bar');
    const progressText = document.getElementById('quiz-progress-text');
    const percentage = (current / total) * 100;
    
    // Mettre à jour la variable CSS pour le pseudo-élément ::after
    progressBar.style.setProperty('--progress', `${percentage}%`);
    progressText.textContent = `Question ${current} sur ${total}`;
}

function nextQuestion() {
    const question = quizQuestions[currentQuestionIndex];
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
    
    // Si c'est la question de profil, charger les questions adaptatives
    if (question.id === 1) {
        selectedProfile = selectedValue;
        // Ajouter les questions adaptatives pour ce profil
        quizQuestions = [profileQuestion, ...adaptiveQuestions[selectedProfile]];
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
    
    showQuestion(currentQuestionIndex + 1);
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        // Retirer la dernière réponse
        if (answers.length > 0) {
            totalScore -= answers[answers.length - 1].score;
            answers.pop();
        }
        
        // Si on revient à la question de profil, réinitialiser
        if (currentQuestionIndex === 1) {
            selectedProfile = null;
            quizQuestions = [profileQuestion];
        }
        
        showQuestion(currentQuestionIndex - 1);
    }
}

function showResults() {
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    
    // Calculer le score maximum possible
    const maxScore = quizQuestions.reduce((sum, q) => {
        const maxOptionScore = Math.max(...q.options.map(o => o.score));
        return sum + maxOptionScore;
    }, 0);
    
    const percentage = Math.round((totalScore / maxScore) * 100);
    const qualificationScore = Math.round((totalScore / maxScore) * 10);
    
    // Déterminer le titre et la description selon le profil
    const profileLabels = {
        "porteur-projet": "Porteur de projet / Entrepreneur",
        "prestataire": "Prestataire",
        "entreprise": "Entreprise",
        "investisseur": "Investisseur",
        "professionnel": "Professionnel",
        "autre": "Autre"
    };
    
    let resultTitle = '';
    let resultDescription = '';
    let recommendations = [];
    const landingPageUrl = profileLandingPages[selectedProfile] || '/#inscription-form';
    
    if (percentage >= 80) {
        resultTitle = `Excellent ! Vous êtes bien préparé(e) 🎉`;
        resultDescription = `Votre profil de ${profileLabels[selectedProfile]} semble bien structuré. Vous pouvez maintenant continuer sur la page dédiée à votre profil pour compléter votre inscription.`;
        recommendations = [
            `Complétez le formulaire sur la page ${profileLabels[selectedProfile]}`,
            'Préparez les informations nécessaires pour votre demande',
            'Rejoignez la communauté pour échanger avec d\'autres membres'
        ];
    } else if (percentage >= 60) {
        resultTitle = `Bien préparé(e), quelques ajustements possibles 👍`;
        resultDescription = `Votre profil de ${profileLabels[selectedProfile]} est sur la bonne voie, mais il y a encore quelques points à clarifier avant de vous lancer pleinement.`;
        recommendations = [
            `Complétez le formulaire sur la page ${profileLabels[selectedProfile]}`,
            'Clarifiez vos objectifs et besoins',
            'Rejoignez Domtom Connect pour bénéficier d\'un accompagnement'
        ];
    } else {
        resultTitle = `Votre profil a besoin de plus de préparation 📋`;
        resultDescription = `Il est important de mieux structurer votre profil de ${profileLabels[selectedProfile]} avant de continuer. Prenez le temps de clarifier votre vision.`;
        recommendations = [
            `Explorez la page ${profileLabels[selectedProfile]} pour mieux comprendre les attentes`,
            'Clarifiez vos objectifs et besoins précis',
            'Rejoignez Domtom Connect pour être accompagné(e) dans votre démarche'
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
            <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.25rem;">Continuez votre parcours</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
                Vous allez être redirigé(e) vers la page dédiée à votre profil pour compléter votre inscription et recevoir des recommandations personnalisées.
            </p>
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <a href="${landingPageUrl}" class="cta-button primary large" style="text-decoration: none; display: inline-block;">
                    Continuer vers la page ${profileLabels[selectedProfile]}
                </a>
            </div>
            <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
                🔒 Vos données sont sécurisées. Vous pouvez aussi remplir le formulaire de contact ci-dessous pour être recontacté(e).
            </p>
        </div>
        
        <div class="quiz-contact-form-container" style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.25rem;">Ou laissez-nous vos coordonnées</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
                Nous vous contacterons avec des conseils adaptés à votre situation.
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
    `;
    
    quizResults.innerHTML = resultsHTML;
    
    // Track quiz completion
    if (window.trackLead) {
        window.trackLead({
            source: 'quiz',
            action: 'completed',
            score: qualificationScore,
            percentage: percentage,
            profile: selectedProfile,
            answers: answers
        });
    }
    
    // Store quiz results globally for contact form submission
    window.quizResults = {
        score: qualificationScore,
        percentage: percentage,
        profile: selectedProfile,
        answers: answers,
        landingPageUrl: landingPageUrl
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
        data.quiz_profile = window.quizResults.profile;
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
            profile: window.quizResults ? window.quizResults.profile : null,
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
    
    const profileLabels = {
        "porteur-projet": "Porteur de projet / Entrepreneur",
        "prestataire": "Prestataire",
        "entreprise": "Entreprise",
        "investisseur": "Investisseur",
        "professionnel": "Professionnel",
        "autre": "Autre"
    };
    const profileLabel = profileLabels[data.quiz_profile] || 'Non spécifié';
    
    formDataToSend.append('_subject', `🆕 Quiz Complété - ${profileLabel} - ${data.prenom} ${data.nom} (Score: ${data.quiz_score}/10)`);
    formDataToSend.append('_replyto', data.email);
    
    let messageBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 QUIZ COMPLÉTÉ - DEMANDE DE CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Profil: ${profileLabel}
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
3. Rediriger vers la landing page: ${window.quizResults ? window.quizResults.landingPageUrl : 'N/A'}
4. Après l'appel, décider (oui/non)
5. Si oui, ajouter à l'écosystème WhatsApp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    formDataToSend.append('message', messageBody);
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone);
    formDataToSend.append('Territoire', data.ile);
    formDataToSend.append('Profil', profileLabel);
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
                    ${window.quizResults && window.quizResults.landingPageUrl ? `
                    <a href="${window.quizResults.landingPageUrl}" class="cta-button primary" style="text-decoration: none; display: inline-block;">
                        Continuer vers ma page dédiée
                    </a>
                    ` : ''}
                </div>
            `;
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
