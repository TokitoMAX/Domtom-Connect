// Quiz functionality avec questions adaptatives selon le profil

// Question initiale : Profil
const profileQuestion = {
        id: 1,
        question: "Quel est votre profil ?",
    type: "radio",
    options: [
        { value: "porteur-projet", label: "Porteur de projet / Entrepreneur", score: 2, description: "Vous avez un projet à développer et cherchez des prestataires" },
        { value: "entreprise", label: "Entreprise", score: 2, description: "Votre entreprise cherche des prestataires fiables" },
        { value: "prestataire", label: "Prestataire", score: 2, description: "Vous offrez des services et cherchez des clients" },
        { value: "investisseur", label: "Investisseur", score: 2, description: "Vous cherchez des opportunités d'investissement" }
    ]
};

// Questions adaptatives par profil
const adaptiveQuestions = {
    "porteur-projet": [
    {
        id: 2,
        question: "D'où venez-vous ? (Votre origine ou territoire d'origine)",
        type: "select",
        options: [
            { value: "martinique", label: "Martinique", score: 2 },
            { value: "guadeloupe", label: "Guadeloupe", score: 2 },
            { value: "reunion", label: "La Réunion", score: 2 },
            { value: "guyane", label: "Guyane", score: 2 },
            { value: "mayotte", label: "Mayotte", score: 2 },
            { value: "saint-martin", label: "Saint-Martin", score: 2 },
            { value: "saint-barthelemy", label: "Saint-Barthélemy", score: 2 },
            { value: "saint-pierre-et-miquelon", label: "Saint-Pierre-et-Miquelon", score: 2 },
            { value: "wallis-et-futuna", label: "Wallis-et-Futuna", score: 2 },
            { value: "polynesie", label: "Polynésie française", score: 2 },
            { value: "nouvelle-caledonie", label: "Nouvelle-Calédonie", score: 2 },
            { value: "diaspora", label: "Diaspora (originaire mais vivant ailleurs)", score: 2 },
            { value: "metropole", label: "Métropole française", score: 1 },
            { value: "autre", label: "Autre", score: 1 }
        ]
    },
    {
        id: 3,
        question: "Quelle est la nature de votre projet ?",
        type: "radio",
        options: [
            { value: "physique", label: "Projet physique (boutique, restaurant, atelier, local, etc.)", score: 2 },
            { value: "virtuel", label: "Projet virtuel/digital (site web, app, service en ligne, etc.)", score: 3 },
            { value: "hybride", label: "Projet hybride (combine physique et digital)", score: 3 },
            { value: "autre", label: "Autre type de projet", score: 2 }
        ]
    },
    // Questions spécifiques pour projets physiques
    {
        id: 31,
        question: "Quel type de local ou espace physique recherchez-vous ?",
        type: "radio",
        conditional: { field: 3, value: "physique" },
        options: [
            { value: "boutique", label: "Boutique / Magasin", score: 2 },
            { value: "restaurant", label: "Restaurant / Bar / Café", score: 2 },
            { value: "atelier", label: "Atelier / Espace de production", score: 2 },
            { value: "bureau", label: "Bureau / Espace de coworking", score: 2 },
            { value: "entrepot", label: "Entrepôt / Stockage", score: 2 },
            { value: "autre", label: "Autre type de local", score: 1 }
        ]
    },
    {
        id: 32,
        question: "Quels types de prestataires recherchez-vous pour votre projet physique ?",
        type: "textarea",
        conditional: { field: 3, value: "physique" },
        placeholder: "Ex: Architecte, électricien, plombier, designer, fournisseurs, etc.",
        score: 2
    },
    // Questions spécifiques pour projets virtuels/digitaux
    {
        id: 33,
        question: "Quel type de plateforme ou solution digitale recherchez-vous ?",
        type: "radio",
        conditional: { field: 3, value: "virtuel" },
        options: [
            { value: "site-web", label: "Site web / E-commerce", score: 3 },
            { value: "app-mobile", label: "Application mobile", score: 3 },
            { value: "saas", label: "Plateforme SaaS / Service en ligne", score: 3 },
            { value: "marketplace", label: "Marketplace / Plateforme de mise en relation", score: 3 },
            { value: "outils-digitaux", label: "Outils digitaux / Automatisation", score: 3 },
            { value: "autre", label: "Autre type de solution digitale", score: 2 }
        ]
    },
    {
        id: 34,
        question: "Quels types de prestataires recherchez-vous pour votre projet digital ?",
        type: "textarea",
        conditional: { field: 3, value: "virtuel" },
        placeholder: "Ex: Développeur web, développeur mobile, designer UX/UI, expert SEO, hébergeur, etc.",
        score: 2
    },
    // Questions spécifiques pour projets hybrides
    {
        id: 35,
        question: "Quels types de prestataires recherchez-vous pour votre projet hybride ?",
        type: "textarea",
        conditional: { field: 3, value: "hybride" },
        placeholder: "Ex: Pour la partie physique (local, aménagement...) et pour la partie digitale (site web, app...)",
        score: 2
    },
    {
        id: 4,
        question: "Où sera localisé votre projet ?",
        type: "select",
        options: [
            { value: "martinique", label: "Martinique", score: 2 },
            { value: "guadeloupe", label: "Guadeloupe", score: 2 },
            { value: "reunion", label: "La Réunion", score: 2 },
            { value: "guyane", label: "Guyane", score: 2 },
            { value: "mayotte", label: "Mayotte", score: 2 },
            { value: "saint-martin", label: "Saint-Martin", score: 2 },
            { value: "saint-barthelemy", label: "Saint-Barthélemy", score: 2 },
            { value: "saint-pierre-et-miquelon", label: "Saint-Pierre-et-Miquelon", score: 2 },
            { value: "wallis-et-futuna", label: "Wallis-et-Futuna", score: 2 },
            { value: "polynesie", label: "Polynésie française", score: 2 },
            { value: "nouvelle-caledonie", label: "Nouvelle-Calédonie", score: 2 },
            { value: "metropole", label: "Métropole française", score: 1 },
            { value: "international", label: "International / Multi-territoires", score: 3 },
            { value: "autre", label: "Autre", score: 1 }
        ]
    },
    {
        id: 5,
        question: "Avez-vous clarifié votre vision et vos objectifs ?",
        type: "radio",
        options: [
            { value: "oui", label: "Oui, c'est très clair", score: 5 },
            { value: "partiellement", label: "Partiellement", score: 3 },
            { value: "non", label: "Pas encore", score: 1 }
        ]
    },
    {
        id: 6,
        question: "Quel est votre objectif principal ?",
        type: "radio",
        options: [
            { value: "structurer", label: "Structurer mon projet", score: 3 },
            { value: "prestataires", label: "Trouver des prestataires fiables", score: 3 },
            { value: "visibilite", label: "Gagner en visibilité", score: 2 },
            { value: "reseau", label: "Me connecter à un réseau insulaire / diaspora", score: 2 },
            { value: "autre", label: "Autre", score: 1 }
        ]
    },
    {
        id: 7,
        question: "Quel budget êtes-vous prêt à investir dans l'accompagnement Domtom Connect ?",
        type: "radio",
        options: [
            { value: "moins-300", label: "Moins de 300 €", score: 1 },
            { value: "300-1000", label: "300-1 000 €", score: 2 },
            { value: "1000-3000", label: "1 000-3 000 €", score: 3 },
            { value: "plus-3000", label: "Plus de 3 000 €", score: 4 },
            { value: "non-defini", label: "Pas encore défini", score: 1 }
        ],
        clarification: "<strong>Important :</strong> L'accompagnement Domtom Connect (recherche, mise en relation, suivi) est un service séparé. Les prestataires sont payés <strong>directement par vous</strong>, sans commission intermédiaire."
    },
    {
        id: 8,
        question: "Quel budget global avez-vous prévu pour les prestations (hors accompagnement) ?",
        type: "radio",
        options: [
            { value: "moins-1000", label: "Moins de 1 000 €", score: 1 },
            { value: "1000-3000", label: "1 000 - 3 000 €", score: 2 },
            { value: "3000-5000", label: "3 000 - 5 000 €", score: 3 },
            { value: "5000-10000", label: "5 000 - 10 000 €", score: 4 },
            { value: "plus-10000", label: "Plus de 10 000 €", score: 4 },
            { value: "non-defini", label: "Pas encore défini", score: 1 }
        ],
        clarification: "<strong>Rappel :</strong> Ce budget est pour payer directement les prestataires. Il est indépendant du budget d'accompagnement Domtom Connect."
    },
    {
        id: 9,
        question: "Quel est votre horizon temporel ?",
        type: "radio",
        options: [
            { value: "court", label: "Court terme (0-6 mois)", score: 3 },
            { value: "moyen", label: "Moyen terme (6-24 mois)", score: 3 },
            { value: "long", label: "Long terme (2 ans et +)", score: 2 }
        ]
    }
    ],
    "investisseur": [
        {
            id: 2,
            question: "Dans quel territoire êtes-vous basé ?",
            type: "select",
            options: [
                { value: "martinique", label: "Martinique", score: 2 },
                { value: "guadeloupe", label: "Guadeloupe", score: 2 },
                { value: "reunion", label: "La Réunion", score: 2 },
                { value: "guyane", label: "Guyane", score: 2 },
                { value: "diaspora", label: "Diaspora", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 3,
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
            id: 4,
            question: "Quel est le montant d'investissement potentiel ?",
            type: "radio",
            options: [
                { value: "moins-10k", label: "Moins de 10 000 €", score: 1 },
                { value: "10k-50k", label: "10 000 - 50 000 €", score: 3 },
                { value: "50k-200k", label: "50 000 - 200 000 €", score: 4 },
                { value: "200k-plus", label: "Plus de 200 000 €", score: 5 }
            ]
        },
        {
            id: 5,
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
            id: 6,
            question: "Quelle est votre expérience en investissement ?",
            type: "radio",
            options: [
                { value: "debutant", label: "Débutant (je découvre l'investissement)", score: 2 },
                { value: "quelques-investissements", label: "Quelques investissements", score: 3 },
                { value: "expert", label: "Expert (investisseur régulier)", score: 4 }
            ]
        },
        {
            id: 7,
            question: "Qu'est-ce qui vous pousse à investir dans les territoires ultramarins ?",
            type: "radio",
            options: [
                { value: "retour-territoire", label: "Retour aux sources / Lien avec mon territoire d'origine", score: 3 },
                { value: "opportunite-croissance", label: "Opportunités de croissance dans des marchés émergents", score: 3 },
                { value: "impact-social", label: "Impact social et développement local", score: 3 },
                { value: "diversification", label: "Diversification de mon portefeuille d'investissement", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 8,
            question: "Quelles sont vos attentes principales avec Domtom Connect ?",
            type: "radio",
            options: [
                { value: "decouvrir-projets", label: "Découvrir des projets à financer", score: 3 },
                { value: "reseau-investisseurs", label: "Rejoindre un réseau d'investisseurs", score: 2 },
                { value: "mentorat", label: "Proposer du mentorat aux porteurs de projets", score: 2 },
                { value: "comprendre-ecosysteme", label: "Comprendre l'écosystème entrepreneurial ultramarin", score: 2 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 9,
            question: "Quels sont les critères les plus importants pour vous lors de l'évaluation d'un projet ?",
            type: "radio",
            options: [
                { value: "equipe-porteur", label: "L'équipe et le porteur de projet", score: 3 },
                { value: "potentiel-marche", label: "Le potentiel du marché", score: 3 },
                { value: "viabilite-financiere", label: "La viabilité financière", score: 3 },
                { value: "impact-territoire", label: "L'impact sur le territoire", score: 3 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        }
    ],
    "prestataire": [
        {
            id: 2,
            question: "Quels services proposez-vous ?",
            type: "radio",
            options: [
                { value: "developpement", label: "Développement web/mobile", score: 3 },
                { value: "design", label: "Design graphique / UI/UX", score: 3 },
                { value: "marketing", label: "Marketing digital / Communication", score: 3 },
                { value: "comptabilite", label: "Comptabilité / Fiscalité", score: 3 },
                { value: "juridique", label: "Juridique / Conseil", score: 3 },
                { value: "coaching", label: "Coaching / Formation", score: 3 },
                { value: "autre", label: "Autre service", score: 2 }
            ]
        },
        {
            id: 3,
            question: "Quel est votre statut juridique ?",
            type: "radio",
            options: [
                { value: "auto-entrepreneur", label: "Auto-entrepreneur / Micro-entrepreneur", score: 2 },
                { value: "eurl", label: "EURL", score: 3 },
                { value: "sarl", label: "SARL", score: 3 },
                { value: "sas", label: "SAS", score: 3 },
                { value: "sasu", label: "SASU", score: 3 },
                { value: "autre", label: "Autre statut", score: 2 }
            ]
        },
        {
            id: 4,
            question: "Quelle est votre expérience (en années) ?",
            type: "radio",
            options: [
                { value: "moins-1", label: "Moins de 1 an", score: 2 },
                { value: "1-3", label: "1 à 3 ans", score: 3 },
                { value: "3-5", label: "3 à 5 ans", score: 3 },
                { value: "5-10", label: "5 à 10 ans", score: 4 },
                { value: "plus-10", label: "Plus de 10 ans", score: 4 }
            ]
        },
        {
            id: 5,
            question: "Dans quels territoires pouvez-vous intervenir ?",
            type: "radio",
            options: [
                { value: "local", label: "Mon territoire uniquement", score: 2 },
                { value: "plusieurs", label: "Plusieurs territoires", score: 3 },
                { value: "tous", label: "Tous les territoires (distanciel possible)", score: 4 }
            ]
        }
    ],
    "entreprise": [
        {
            id: 2,
            question: "Dans quel secteur d'activité évolue votre entreprise ?",
            type: "radio",
            options: [
                { value: "tech", label: "Technologie / Digital", score: 2 },
                { value: "commerce", label: "Commerce / E-commerce", score: 2 },
                { value: "tourisme", label: "Tourisme / Hôtellerie", score: 2 },
                { value: "agroalimentaire", label: "Agroalimentaire", score: 2 },
                { value: "services", label: "Services aux entreprises", score: 2 },
                { value: "culture", label: "Culture / Événementiel", score: 2 },
                { value: "sante", label: "Santé / Bien-être", score: 2 },
                { value: "education", label: "Éducation / Formation", score: 2 },
                { value: "autre", label: "Autre secteur", score: 1 }
            ]
        },
        {
            id: 3,
            question: "Quelle est la taille de votre entreprise ?",
            type: "radio",
            options: [
                { value: "micro", label: "Micro-entreprise (0-1 salarié)", score: 2 },
                { value: "tpe", label: "TPE (2-9 salariés)", score: 2 },
                { value: "pme", label: "PME (10-49 salariés)", score: 3 },
                { value: "et", label: "ETI (50-249 salariés)", score: 3 },
                { value: "ge", label: "Grande entreprise (250+ salariés)", score: 3 }
            ]
        },
        {
            id: 4,
            question: "Quel est votre besoin principal ?",
            type: "radio",
            options: [
                { value: "trouver-prestataires", label: "Trouver des prestataires", score: 3 },
                { value: "developper-projet", label: "Développer un projet", score: 3 },
                { value: "trouver-partenaires", label: "Trouver des partenaires", score: 2 },
                { value: "autre", label: "Autre besoin", score: 1 }
            ]
        },
        {
            id: 5,
            question: "Quel type de prestations recherchez-vous ?",
            type: "radio",
            options: [
                { value: "developpement", label: "Développement web/mobile", score: 2 },
                { value: "design", label: "Design / Identité visuelle", score: 2 },
                { value: "marketing", label: "Marketing / Communication", score: 2 },
                { value: "comptabilite", label: "Comptabilité / Fiscalité", score: 2 },
                { value: "juridique", label: "Juridique / Conseil", score: 2 },
                { value: "formation", label: "Formation / Coaching", score: 2 },
                { value: "multiple", label: "Plusieurs types de prestations", score: 3 },
                { value: "autre", label: "Autre", score: 1 }
            ]
        },
        {
            id: 6,
            question: "Combien de prestataires recherchez-vous ?",
            type: "radio",
            options: [
                { value: "1", label: "1 prestataire", score: 2 },
                { value: "2-3", label: "2 à 3 prestataires", score: 3 },
                { value: "4-5", label: "4 à 5 prestataires", score: 4 },
                { value: "plus-5", label: "Plus de 5 prestataires", score: 4 },
                { value: "non-defini", label: "À définir selon les besoins", score: 1 }
            ]
        },
        {
            id: 7,
            question: "Quel budget êtes-vous prêt à investir dans l'accompagnement Domtom Connect ?",
            type: "radio",
            options: [
                { value: "moins-300", label: "Moins de 300 €", score: 1 },
                { value: "300-1000", label: "300-1 000 €", score: 2 },
                { value: "1000-3000", label: "1 000-3 000 €", score: 3 },
                { value: "plus-3000", label: "Plus de 3 000 €", score: 4 },
                { value: "non-defini", label: "Pas encore défini", score: 1 }
            ],
            clarification: "<strong>Important :</strong> L'accompagnement Domtom Connect (recherche, mise en relation, suivi) est un service séparé. Les prestataires sont payés <strong>directement par vous</strong>, sans commission intermédiaire."
        },
        {
            id: 8,
            question: "Quel est votre budget estimé pour les prestations (hors accompagnement) ?",
            type: "radio",
            options: [
                { value: "moins-2000", label: "Moins de 2 000€", score: 1 },
                { value: "2000-5000", label: "2 000€ - 5 000€", score: 2 },
                { value: "5000-10000", label: "5 000€ - 10 000€", score: 3 },
                { value: "10000-25000", label: "10 000€ - 25 000€", score: 4 },
                { value: "plus-25000", label: "Plus de 25 000€", score: 4 },
                { value: "a-definir", label: "À définir selon les besoins", score: 1 }
            ]
        },
        {
            id: 9,
            question: "Quelle est l'urgence de votre besoin ?",
            type: "radio",
            options: [
                { value: "immediat", label: "Immédiat (dans les 2 semaines)", score: 4 },
                { value: "court-terme", label: "Court terme (1-3 mois)", score: 3 },
                { value: "moyen-terme", label: "Moyen terme (3-6 mois)", score: 2 },
                { value: "long-terme", label: "Long terme (6+ mois)", score: 1 },
                { value: "exploration", label: "En phase d'exploration", score: 1 }
            ]
        },
        {
            id: 10,
            question: "Dans quel territoire êtes-vous basé ?",
            type: "select",
        options: [
            { value: "martinique", label: "Martinique", score: 2 },
            { value: "guadeloupe", label: "Guadeloupe", score: 2 },
            { value: "reunion", label: "La Réunion", score: 2 },
            { value: "guyane", label: "Guyane", score: 2 },
            { value: "diaspora", label: "Diaspora", score: 2 },
            { value: "autre", label: "Autre", score: 1 }
        ]
        },
        {
            id: 11,
            question: "Depuis combien de temps votre entreprise existe-t-elle ?",
            type: "radio",
            options: [
                { value: "moins-1", label: "Moins de 1 an (je viens de créer)", score: 2 },
                { value: "1-3", label: "1 à 3 ans", score: 3 },
                { value: "3-5", label: "3 à 5 ans", score: 3 },
                { value: "5-10", label: "5 à 10 ans", score: 3 },
                { value: "plus-10", label: "Plus de 10 ans", score: 4 }
            ]
        }
    ]
};

// Mapping des profils vers les landing pages
const profileLandingPages = {
    "porteur-projet": "/landing/porteurs-projets",
    "prestataire": "/landing/prestataires",
    "entreprise": "/landing/entreprises",
    "investisseur": "/landing/investisseurs"
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
                <label class="quiz-option" style="${option.description ? 'display: flex; flex-direction: column; gap: 0.25rem;' : ''}">
                    <input type="radio" name="question-${question.id}" value="${option.value}" data-score="${option.score}">
                    <span style="font-weight: 600;">${option.label}</span>
                    ${option.description ? `<span style="font-size: 0.85rem; color: var(--text-secondary); margin-left: 1.5rem;">${option.description}</span>` : ''}
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
    } else if (question.type === 'textarea') {
        questionHTML += `<textarea class="quiz-textarea" name="question-${question.id}" placeholder="${question.placeholder || ''}" rows="4" style="width: 100%; padding: 0.75rem; border: 2px solid var(--gray-200); border-radius: 8px; font-family: inherit; font-size: 1rem; resize: vertical;"></textarea>`;
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
    } else if (question.type === 'textarea') {
        const textarea = document.querySelector(`textarea[name="question-${question.id}"]`);
        textarea.addEventListener('input', function() {
            document.getElementById('next-btn').disabled = !this.value.trim();
        });
    }
}

function getTotalQuestionsCount() {
    if (!selectedProfile) {
        // Si le profil n'est pas encore sélectionné, compter la question profil + moyenne des questions adaptatives
        return 5; // Estimation moyenne
    }
    // Filtrer les questions conditionnelles
    const validQuestions = getValidQuestions(adaptiveQuestions[selectedProfile]);
    return 1 + validQuestions.length; // 1 pour le profil + questions adaptatives valides
}

function getValidQuestions(questions) {
    // Filtrer les questions conditionnelles basées sur les réponses précédentes
    return questions.filter(question => {
        if (!question.conditional) {
            return true; // Question non conditionnelle, toujours affichée
        }
        
        // Trouver la réponse à la question conditionnelle
        const conditionalAnswer = answers.find(a => a.questionId === question.conditional.field);
        if (!conditionalAnswer) {
            return false; // Pas de réponse à la question conditionnelle, ne pas afficher
        }
        
        // Vérifier si la réponse correspond à la condition (utiliser answerValue si disponible, sinon answer)
        const answerToCheck = conditionalAnswer.answerValue || conditionalAnswer.answer;
        return answerToCheck === question.conditional.value;
    });
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
    } else if (question.type === 'textarea') {
        const textarea = document.querySelector(`textarea[name="question-${question.id}"]`);
        if (textarea && textarea.value.trim()) {
            selectedValue = textarea.value.trim();
            selectedScore = question.score || 2; // Score par défaut pour les textarea
        }
    }
    
    if (!selectedValue) {
        alert('Veuillez sélectionner une réponse');
        return;
    }
    
    // Si c'est la question de profil, charger les questions adaptatives
    if (question.id === 1) {
        selectedProfile = selectedValue;
        // Filtrer et ajouter les questions adaptatives valides pour ce profil
        const validQuestions = getValidQuestions(adaptiveQuestions[selectedProfile]);
        quizQuestions = [profileQuestion, ...validQuestions];
    } else {
        // Re-filtrer les questions après chaque réponse pour gérer les questions conditionnelles
        if (selectedProfile) {
            const allQuestions = adaptiveQuestions[selectedProfile];
            const validQuestions = getValidQuestions(allQuestions);
            quizQuestions = [profileQuestion, ...validQuestions];
            // Réajuster l'index si nécessaire
            const currentQuestionInNewList = quizQuestions.findIndex(q => q.id === question.id);
            if (currentQuestionInNewList !== -1 && currentQuestionInNewList !== currentQuestionIndex) {
                currentQuestionIndex = currentQuestionInNewList;
            }
        }
    }
    
    // Trouver le label correspondant à la valeur sélectionnée
    let selectedLabel = selectedValue;
    if (question.options) {
        const selectedOption = question.options.find(opt => opt.value === selectedValue);
        if (selectedOption) {
            selectedLabel = selectedOption.label;
        }
    }
    
    // Sauvegarder la réponse
    answers.push({
        questionId: question.id,
        question: question.question,
        answer: selectedLabel, // Le label affiché à l'utilisateur
        answerValue: selectedValue, // La valeur originale pour le traitement
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
    
    // Re-filtrer les questions après chaque réponse pour gérer les questions conditionnelles
    if (selectedProfile) {
        const allQuestions = adaptiveQuestions[selectedProfile];
        const validQuestions = getValidQuestions(allQuestions);
        quizQuestions = [profileQuestion, ...validQuestions];
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
        "investisseur": "Investisseur"
    };
    
    // Récupérer le budget d'accompagnement pour les porteurs de projets et entreprises
    let budgetAccompagnement = null;
    let packRecommandé = null;
    let eligible = false;
    let packInfo = '';
    let engagementInfo = ''; // Pour investisseurs et prestataires
    
    if (selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') {
        // Chercher la question sur le budget d'accompagnement (ID 7 pour porteurs-projets, ID 7 pour entreprises)
        const budgetQuestion = answers.find(a => 
            a.questionId === 7 || 
            (a.question.toLowerCase().includes("budget") && 
             a.question.toLowerCase().includes("accompagnement") &&
             a.question.toLowerCase().includes("domtom"))
        );
        
        if (budgetQuestion) {
            budgetAccompagnement = budgetQuestion.answer;
            
            // Déterminer le pack recommandé et l'éligibilité basé sur la valeur (value) ou le label
            const budgetValue = budgetQuestion.answerValue || budgetQuestion.answer;
            const budgetAnswerLower = budgetValue.toLowerCase();
            
            if (budgetValue === '300-1000' || budgetAnswerLower.includes('300-1 000') || budgetAnswerLower.includes('300-1000') || budgetAnswerLower.includes('300 - 1 000')) {
                packRecommandé = 'starter';
                eligible = true;
                packInfo = `
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2rem; border-radius: 16px; margin: 2rem 0; color: white;">
                        <h3 style="color: white; margin-bottom: 1rem; font-size: 1.5rem;">💚 Pack Starter Recommandé</h3>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">500€ TTC</div>
                        <p style="color: rgba(255,255,255,0.9); margin-bottom: 1rem;">Vous êtes éligible au Pack Starter !</p>
                        <ul style="list-style: none; padding: 0; margin: 0; text-align: left; color: rgba(255,255,255,0.9);">
                            <li style="margin-bottom: 0.5rem;">✓ Consultation initiale et évaluation</li>
                            <li style="margin-bottom: 0.5rem;">✓ Recherche de 1-2 prestataires</li>
                            <li style="margin-bottom: 0.5rem;">✓ Mise en relation</li>
                            <li>✓ Suivi de base</li>
                        </ul>
                    </div>
                    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-top: 1rem; border-left: 4px solid #3B82F6;">
                        <h4 style="color: #1e293b; margin-bottom: 0.75rem;">💎 Pack Premium également disponible</h4>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #3B82F6; margin-bottom: 0.5rem;">1 900€ TTC</div>
                        <p style="color: #64748b; font-size: 0.95rem;">Accompagnement complet du début à la fin avec gestion totale des prestataires</p>
                    </div>
                `;
            } else if (budgetValue === '1000-3000' || budgetValue === 'plus-3000' ||
                      budgetAnswerLower.includes('1 000-3 000') || budgetAnswerLower.includes('1000-3000') || 
                      budgetAnswerLower.includes('plus de 3 000') || budgetAnswerLower.includes('plus-3000') ||
                      budgetAnswerLower.includes('1 000 - 3 000') || budgetAnswerLower.includes('plus de 3000')) {
                packRecommandé = 'premium';
                eligible = true;
                packInfo = `
                    <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 2rem; border-radius: 16px; margin: 2rem 0; color: white;">
                        <h3 style="color: white; margin-bottom: 1rem; font-size: 1.5rem;">💎 Pack Premium Recommandé</h3>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">1 900€ TTC</div>
                        <p style="color: rgba(255,255,255,0.9); margin-bottom: 1rem;">Vous êtes éligible au Pack Premium !</p>
                        <ul style="list-style: none; padding: 0; margin: 0; text-align: left; color: rgba(255,255,255,0.9);">
                            <li style="margin-bottom: 0.5rem;">✓ Tout le Pack Starter</li>
                            <li style="margin-bottom: 0.5rem;">✓ Recherche approfondie de prestataires</li>
                            <li style="margin-bottom: 0.5rem;">✓ Accompagnement du début à la fin</li>
                            <li style="margin-bottom: 0.5rem;">✓ Gestion complète des prestataires</li>
                            <li style="margin-bottom: 0.5rem;">✓ Suivi personnalisé et optimisation</li>
                            <li>✓ Résultat garanti</li>
                        </ul>
                    </div>
                `;
            } else if (budgetValue === 'moins-300' || budgetAnswerLower.includes('moins de 300') || budgetAnswerLower.includes('moins-300')) {
                eligible = false;
                packInfo = `
                    <div style="background: #fef3c7; padding: 2rem; border-radius: 16px; margin: 2rem 0; border-left: 4px solid #f59e0b;">
                        <h3 style="color: #92400e; margin-bottom: 1rem; font-size: 1.5rem;">⚠️ Budget d'accompagnement insuffisant</h3>
                        <p style="color: #78350f; margin-bottom: 1rem;">Votre budget d'accompagnement (moins de 300€) est en dessous de nos packs disponibles.</p>
                        <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-top: 1rem;">
                            <h4 style="color: #1e293b; margin-bottom: 1rem;">Nos packs d'accompagnement :</h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                                <div style="border: 2px solid #10b981; border-radius: 12px; padding: 1.5rem;">
                                    <h5 style="color: #10b981; margin-bottom: 0.5rem;">Pack Starter</h5>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">500€ TTC</div>
                                    <p style="color: #64748b; font-size: 0.9rem;">Budget requis : 300-1 000€</p>
                                </div>
                                <div style="border: 2px solid #3B82F6; border-radius: 12px; padding: 1.5rem;">
                                    <h5 style="color: #3B82F6; margin-bottom: 0.5rem;">Pack Premium</h5>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">1 900€ TTC</div>
                                    <p style="color: #64748b; font-size: 0.9rem;">Budget requis : 1 000€+</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    } else if (selectedProfile === 'prestataire') {
        // Pour les prestataires : contribution au contenu et partage de compétences
        engagementInfo = `
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 2rem; border-radius: 16px; margin: 2rem 0; color: white;">
                <h3 style="color: white; margin-bottom: 1rem; font-size: 1.5rem;">💼 Votre Engagement dans l'Écosystème</h3>
                <p style="color: rgba(255,255,255,0.9); margin-bottom: 1.5rem;">
                    Pour rejoindre le réseau Domtom Connect, nous vous invitons à <strong>contribuer au contenu</strong> et à <strong>partager vos compétences</strong> pour le bien de l'écosystème entrepreneurial ultramarin.
                </p>
                <div style="background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 12px; margin-top: 1rem;">
                    <h4 style="color: white; margin-bottom: 1rem; font-size: 1.25rem;">📝 Contribution au Contenu</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; text-align: left; color: rgba(255,255,255,0.9);">
                        <li style="margin-bottom: 0.75rem;">✓ Création de contenu avec Domtom Connect (articles, vidéos, podcasts)</li>
                        <li style="margin-bottom: 0.75rem;">✓ Partage de vos expertises et retours d'expérience</li>
                        <li style="margin-bottom: 0.75rem;">✓ Contribution à la communauté entrepreneuriale ultramarine</li>
                        <li>✓ Mise en avant de votre profil dans le contenu créé</li>
                    </ul>
                </div>
                <div style="background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 12px; margin-top: 1rem;">
                    <h4 style="color: white; margin-bottom: 1rem; font-size: 1.25rem;">🎯 Avantages</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; text-align: left; color: rgba(255,255,255,0.9);">
                        <li style="margin-bottom: 0.75rem;">✓ Accès au réseau de clients qualifiés</li>
                        <li style="margin-bottom: 0.75rem;">✓ Visibilité accrue grâce au contenu créé</li>
                        <li style="margin-bottom: 0.75rem;">✓ Mises en relation prioritaires</li>
                        <li style="margin-bottom: 0.75rem;">✓ Positionnement en tant qu'expert dans votre domaine</li>
                        <li>✓ Contribution à la croissance de l'écosystème ultramarin</li>
                    </ul>
                </div>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-top: 1rem; font-style: italic; text-align: center;">
                    💡 Ensemble, construisons un écosystème entrepreneurial fort et solidaire pour les territoires ultramarins.
                </p>
            </div>
        `;
    } else if (selectedProfile === 'investisseur') {
        // Pour les investisseurs : cotisation mensuelle
        // Récupérer la question sur le montant d'investissement si disponible
        const montantInvestissementQuestion = answers.find(a => 
            a.question.toLowerCase().includes("montant") && 
            a.question.toLowerCase().includes("investissement")
        );
        
        let montantSuggestion = '';
        if (montantInvestissementQuestion) {
            const montantValue = montantInvestissementQuestion.answerValue || montantInvestissementQuestion.answer;
            // Ajuster la suggestion selon le montant d'investissement potentiel
            if (montantValue.includes('200k-plus') || montantValue.includes('plus de 200 000')) {
                montantSuggestion = '<p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; margin-bottom: 1rem;"><strong>💡 Suggestion :</strong> Pour les investissements de 200k€+, nous recommandons une cotisation mensuelle de <strong>99€/mois</strong>.</p>';
            } else if (montantValue.includes('50k-200k') || montantValue.includes('50 000 - 200 000')) {
                montantSuggestion = '<p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; margin-bottom: 1rem;"><strong>💡 Suggestion :</strong> Pour les investissements de 50k-200k€, nous recommandons une cotisation mensuelle de <strong>49€/mois</strong>.</p>';
            } else {
                montantSuggestion = '<p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; margin-bottom: 1rem;"><strong>💡 Suggestion :</strong> Cotisation mensuelle à partir de <strong>29€/mois</strong>.</p>';
            }
        } else {
            montantSuggestion = '<p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; margin-bottom: 1rem;"><strong>💡 Information :</strong> Une cotisation mensuelle sera demandée pour accéder au réseau d\'investisseurs. Le montant sera défini lors de notre échange.</p>';
        }
        
        engagementInfo = `
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 2rem; border-radius: 16px; margin: 2rem 0; color: white;">
                <h3 style="color: white; margin-bottom: 1rem; font-size: 1.5rem;">💰 Engagement Investisseur</h3>
                <p style="color: rgba(255,255,255,0.9); margin-bottom: 1.5rem;">
                    Pour garantir la qualité du réseau et votre engagement, une <strong>cotisation mensuelle</strong> est requise pour accéder au réseau d'investisseurs et aux projets qualifiés.
                </p>
                ${montantSuggestion}
                <div style="background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 12px; margin-top: 1rem;">
                    <h4 style="color: white; margin-bottom: 1rem; font-size: 1.25rem;">🎯 Avantages de la Cotisation Mensuelle</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; text-align: left; color: rgba(255,255,255,0.9);">
                        <li style="margin-bottom: 0.75rem;">✓ Accès au réseau d'investisseurs Domtom Connect</li>
                        <li style="margin-bottom: 0.75rem;">✓ Projets qualifiés et vérifiés</li>
                        <li style="margin-bottom: 0.75rem;">✓ Mises en relation prioritaires avec les meilleurs projets</li>
                        <li style="margin-bottom: 0.75rem;">✓ Événements et rencontres exclusives</li>
                        <li style="margin-bottom: 0.75rem;">✓ Accès à des analyses et rapports sur l'écosystème</li>
                        <li>✓ Support dédié et accompagnement personnalisé</li>
                    </ul>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 12px; margin-top: 1rem; border-left: 4px solid rgba(255,255,255,0.5);">
                    <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem; margin: 0;">
                        <strong>📞 Prochaines étapes :</strong> Nous échangerons ensemble pour définir le montant de votre cotisation mensuelle selon votre capacité d'investissement et vos besoins spécifiques.
                    </p>
                </div>
            </div>
        `;
    }
    
    let resultTitle = '';
    let resultDescription = '';
    let recommendations = [];
    // Pour porteurs-projets et entreprises, ajouter le paramètre from=quiz
    let landingPageUrl = profileLandingPages[selectedProfile] || '/#inscription-form';
    if (selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') {
        // Récupérer le budget d'accompagnement si disponible dans les réponses
        const budgetAnswer = answers.find(a => 
            a.questionId === 7 || 
            (a.question.toLowerCase().includes("budget") && 
             a.question.toLowerCase().includes("accompagnement") &&
             a.question.toLowerCase().includes("domtom"))
        );
        if (budgetAnswer) {
            // Mapper les réponses du quiz vers les valeurs de budget
            const budgetValue = budgetAnswer.answerValue || budgetAnswer.answer;
            const budgetMap = {
                'moins-300': 'moins-300',
                'moins de 300': 'moins-300',
                '300-1000': '300-1000',
                '300-1 000': '300-1000',
                '1000-3000': '1000-3000',
                '1 000-3 000': '1000-3000',
                'plus-3000': 'plus-3000',
                'plus de 3 000': 'plus-3000',
                'non-defini': 'non-defini',
                'non défini': 'non-defini'
            };
            const budgetValueMapped = budgetMap[budgetValue.toLowerCase()] || 'non-defini';
            landingPageUrl = `${landingPageUrl}?from=quiz&budget=${budgetValueMapped}`;
        } else {
            landingPageUrl = `${landingPageUrl}?from=quiz`;
        }
    }
    
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
    
    // Déterminer le message d'appel à l'action selon le profil
    let ctaMessage = '';
    if ((selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') && eligible) {
        ctaMessage = `✅ Parfait ! Vous êtes éligible${packRecommandé ? ' au ' + (packRecommandé === 'starter' ? 'Pack Starter (500€)' : 'Pack Premium (1 900€)') : ''}. Laissez-nous vos coordonnées pour être recontacté(e) et démarrer votre accompagnement.`;
    } else if ((selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') && !eligible) {
        ctaMessage = `💡 Laissez-nous vos coordonnées pour discuter ensemble des meilleures options d'accompagnement adaptées à votre budget et à vos besoins.`;
    } else if (selectedProfile === 'prestataire') {
        ctaMessage = `💼 Excellent ! Laissez-nous vos coordonnées pour échanger sur votre contribution au contenu et votre intégration dans notre réseau de prestataires.`;
    } else if (selectedProfile === 'investisseur') {
        ctaMessage = `💰 Parfait ! Laissez-nous vos coordonnées pour discuter de votre cotisation mensuelle et de votre intégration dans notre réseau d'investisseurs.`;
    } else {
        ctaMessage = `📞 Laissez-nous vos coordonnées pour être recontacté(e) avec des recommandations personnalisées adaptées à votre situation.`;
    }
    
    const resultsHTML = `
        <div style="animation: fadeIn 0.6s ease-out;">
            <div class="quiz-score" style="margin-bottom: 0.5rem;">${percentage}%</div>
            <div class="quiz-score-label" style="margin-bottom: 2rem;">Score de préparation</div>
            
            <h2 class="quiz-result-title" style="margin-bottom: 1rem;">${resultTitle}</h2>
            <p class="quiz-result-description" style="margin-bottom: 2.5rem;">${resultDescription}</p>
            
            ${(selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') && packInfo ? packInfo : ''}
            ${(selectedProfile === 'prestataire' || selectedProfile === 'investisseur') && engagementInfo ? engagementInfo : ''}
            
            ${(selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') && budgetAccompagnement ? `
            <div style="background: #f8fafc; padding: 2rem; border-radius: 16px; margin: 2rem 0; border: 2px solid #e2e8f0;">
                <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.25rem;">📊 Récapitulatif de votre profil</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div>
                        <strong style="color: var(--text-secondary); font-size: 0.9rem;">Budget d'accompagnement :</strong>
                        <p style="color: var(--text-primary); font-size: 1.1rem; margin-top: 0.25rem; font-weight: 600;">${budgetAccompagnement}</p>
                    </div>
                    <div>
                        <strong style="color: var(--text-secondary); font-size: 0.9rem;">Pack recommandé :</strong>
                        <p style="color: var(--text-primary); font-size: 1.1rem; margin-top: 0.25rem; font-weight: 600;">
                            ${packRecommandé === 'starter' ? 'Pack Starter (500€)' : packRecommandé === 'premium' ? 'Pack Premium (1 900€)' : 'Non éligible'}
                        </p>
                    </div>
                    <div>
                        <strong style="color: var(--text-secondary); font-size: 0.9rem;">Statut :</strong>
                        <p style="color: ${eligible ? '#10b981' : '#f59e0b'}; font-size: 1.1rem; margin-top: 0.25rem; font-weight: 600;">
                            ${eligible ? '✓ Éligible' : '⚠ Non éligible'}
                        </p>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="quiz-recommendations" style="margin: 2rem 0;">
                <h3 style="text-align: center; margin-bottom: 1.5rem;">💡 Nos recommandations</h3>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="quiz-contact-form-container" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 3px solid #3B82F6; margin-top: 3rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.5rem; font-weight: 700;">📞 Contactez-nous pour démarrer</h3>
                    <p style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem; font-weight: 600;">
                        ${ctaMessage}
                    </p>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">
                        Nous vous recontacterons dans les <strong>24 heures</strong> pour discuter de votre projet et des prochaines étapes.
                    </p>
                </div>
                
                <form class="quiz-contact-form" id="quiz-contact-form" onsubmit="handleQuizContactSubmit(event)" style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div class="form-row">
                        <input type="text" name="prenom" placeholder="Prénom *" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
                        <input type="text" name="nom" placeholder="Nom *" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
                    </div>
                    <input type="email" name="email" placeholder="Email *" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
                    <input type="tel" name="telephone" placeholder="Téléphone *" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
                    <select name="ile" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; background: white;">
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
                    <button type="submit" class="cta-button primary large" style="padding: 1.25rem 2rem; font-size: 1.1rem; font-weight: 600; margin-top: 0.5rem;">
                        ✉️ Recevoir mes recommandations
                    </button>
                    <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
                        🔒 Vos données sont sécurisées. Nous vous contacterons dans les 24h.
                    </p>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center;">
                        * Champs obligatoires
                    </p>
                </form>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem;">Ou</p>
                    <a href="${landingPageUrl}" class="cta-button" style="text-decoration: none; display: inline-block; padding: 0.875rem 1.75rem; background: white; color: #3B82F6; border: 2px solid #3B82F6; border-radius: 8px; font-weight: 600; transition: all 0.3s;">
                        Continuer vers la page ${profileLabels[selectedProfile]} →
                    </a>
                </div>
            </div>
        </div>
    `;
    
    quizResults.innerHTML = resultsHTML;
    
    // Scroll vers les résultats
    quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
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
        landingPageUrl: landingPageUrl,
        budgetAccompagnement: budgetAccompagnement,
        packRecommandé: packRecommandé,
        eligible: eligible,
        engagementInfo: engagementInfo
    };
    
    // Envoyer automatiquement un email avec les résultats du quiz
    const packName = packRecommandé === 'starter' ? 'Pack Starter (500€)' : packRecommandé === 'premium' ? 'Pack Premium (1 900€)' : null;
    const packPrice = packRecommandé === 'starter' ? '500€ TTC' : packRecommandé === 'premium' ? '1 900€ TTC' : null;
    sendQuizCompletionEmail(selectedProfile, qualificationScore, percentage, answers, landingPageUrl, packName, packPrice, budgetAccompagnement, packRecommandé, eligible, engagementInfo);
}

// Fonction pour envoyer automatiquement un email à chaque complétion du quiz
function sendQuizCompletionEmail(profile, score, percentage, answers, landingPageUrl, packName = null, packPrice = null, budgetAccompagnement = null, packRecommandé = null, eligible = false, engagementInfo = null) {
    const profileLabels = {
        "porteur-projet": "Porteur de projet / Entrepreneur",
        "prestataire": "Prestataire",
        "entreprise": "Entreprise",
        "investisseur": "Investisseur"
    };
    const profileLabel = profileLabels[profile] || 'Non spécifié';
    
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `📊 Quiz Complété - ${profileLabel} (Score: ${score}/10 - ${percentage}%)`);
    
    // Construire le message avec toutes les réponses
    let packInfoSection = '';
    if ((profile === 'porteur-projet' || profile === 'entreprise') && budgetAccompagnement) {
        packInfoSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PACK D'ACCOMPAGNEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget d'accompagnement: ${budgetAccompagnement}
Pack recommandé: ${packName || 'Non éligible'}
Statut: ${eligible ? '✓ Éligible' : '⚠ Non éligible'}
${packRecommandé === 'starter' ? 'Pack Starter - 500€ TTC\nBudget requis: 300-1 000€' : packRecommandé === 'premium' ? 'Pack Premium - 1 900€ TTC\nBudget requis: 1 000€+' : ''}

`;
    } else if (profile === 'prestataire') {
        packInfoSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 ENGAGEMENT PRESTATAIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Engagement requis: Contribution au contenu et partage de compétences
- Création de contenu avec Domtom Connect (articles, vidéos, podcasts)
- Partage d'expertises et retours d'expérience
- Contribution à la communauté entrepreneuriale ultramarine

`;
    } else if (profile === 'investisseur') {
        packInfoSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 ENGAGEMENT INVESTISSEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Engagement requis: Cotisation mensuelle
Le montant sera défini lors de l'échange selon la capacité d'investissement.

`;
    }
    
    let messageBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 QUIZ COMPLÉTÉ - RÉSULTATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${new Date().toLocaleString('fr-FR')}
Profil: ${profileLabel}
Score: ${score}/10 (${percentage}%)
Niveau: ${percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Bien préparé' : 'À améliorer'}
${packInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RÉPONSES DU QUIZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${answers.map((a, i) => `${i + 1}. ${a.question}\n   Réponse: ${a.answer}${a.answerValue ? ` (valeur: ${a.answerValue})` : ''} (Score: ${a.score})`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. L'utilisateur peut maintenant remplir le formulaire de contact (optionnel)
2. Rediriger vers la landing page: ${landingPageUrl}
3. Suivre l'engagement de l'utilisateur (a-t-il visité la landing page ?)
4. Contacter si l'utilisateur remplit le formulaire de contact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️ NOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cet email est envoyé automatiquement à chaque complétion du quiz.
Les coordonnées de l'utilisateur seront disponibles s'il remplit le formulaire de contact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    formDataToSend.append('message', messageBody);
    formDataToSend.append('Profil', profileLabel);
    formDataToSend.append('Score Quiz', score);
    formDataToSend.append('Pourcentage Quiz', percentage);
    formDataToSend.append('Landing Page', landingPageUrl);
    if (packName) formDataToSend.append('Pack Recommandé', packName);
    if (packPrice) formDataToSend.append('Prix Pack', packPrice);
    if (budgetAccompagnement) formDataToSend.append('Budget Accompagnement', budgetAccompagnement);
    if (packRecommandé) formDataToSend.append('Pack Type', packRecommandé);
    formDataToSend.append('Éligible', eligible ? 'Oui' : 'Non');
    formDataToSend.append('Type', 'Quiz Completion (Auto)');
    
    // Envoyer en arrière-plan (ne pas bloquer l'interface)
    fetch('https://formspree.io/f/myzbqepy', {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('✅ Email de complétion du quiz envoyé avec succès');
        } else {
            console.error('❌ Erreur lors de l\'envoi de l\'email de complétion du quiz');
        }
    })
    .catch(error => {
        console.error('❌ Erreur lors de l\'envoi de l\'email de complétion du quiz:', error);
    });
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
        "investisseur": "Investisseur"
    };
    const profileLabel = profileLabels[data.quiz_profile] || 'Non spécifié';
    
    formDataToSend.append('_subject', `🆕 Quiz Complété - ${profileLabel} - ${data.prenom} ${data.nom} (Score: ${data.quiz_score}/10)`);
    formDataToSend.append('_replyto', data.email);
    
    // Récupérer les informations de pack/engagement si disponibles
    let packInfoSection = '';
    if (window.quizResults) {
        if (window.quizResults.budgetAccompagnement) {
            packInfoSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PACK D'ACCOMPAGNEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget d'accompagnement: ${window.quizResults.budgetAccompagnement}
Pack recommandé: ${window.quizResults.packRecommandé === 'starter' ? 'Pack Starter (500€ TTC)' : window.quizResults.packRecommandé === 'premium' ? 'Pack Premium (1 900€ TTC)' : 'Non éligible'}
Statut: ${window.quizResults.eligible ? '✓ Éligible' : '⚠ Non éligible'}

`;
        } else if (window.quizResults.engagementInfo) {
            packInfoSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 ENGAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Information d'engagement disponible dans les résultats du quiz.

`;
        }
    }
    
    let messageBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 QUIZ COMPLÉTÉ - DEMANDE DE CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Profil: ${profileLabel}
Score: ${data.quiz_score}/10 (${data.quiz_percentage}%)
Niveau: ${data.quiz_percentage >= 80 ? 'Excellent' : data.quiz_percentage >= 60 ? 'Bien préparé' : 'À améliorer'}
${packInfoSection}
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
${data.quiz_answers ? JSON.parse(data.quiz_answers).map((a, i) => `${i + 1}. ${a.question}\n   Réponse: ${a.answer}${a.answerValue ? ` (valeur: ${a.answerValue})` : ''} (Score: ${a.score})`).join('\n\n') : 'Non disponible'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter ${data.prenom} ${data.nom} pour un appel
2. Discuter des résultats du quiz et des recommandations
3. ${window.quizResults && window.quizResults.packRecommandé ? `Présenter le ${window.quizResults.packRecommandé === 'starter' ? 'Pack Starter (500€)' : 'Pack Premium (1 900€)'}` : 'Discuter des options d\'accompagnement'}
4. Rediriger vers la landing page: ${window.quizResults ? window.quizResults.landingPageUrl : 'N/A'}
5. Après l'appel, décider (oui/non)
6. Si oui, ajouter à l'écosystème WhatsApp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    formDataToSend.append('message', messageBody);
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone);
    if (window.quizResults && window.quizResults.budgetAccompagnement) {
        formDataToSend.append('Budget Accompagnement', window.quizResults.budgetAccompagnement);
        formDataToSend.append('Pack Recommandé', window.quizResults.packRecommandé === 'starter' ? 'Pack Starter (500€ TTC)' : window.quizResults.packRecommandé === 'premium' ? 'Pack Premium (1 900€ TTC)' : 'Non éligible');
        formDataToSend.append('Éligible', window.quizResults.eligible ? 'Oui' : 'Non');
    }
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
