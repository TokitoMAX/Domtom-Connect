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
            id: 4,
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
    console.log('🔵 Initialisation du quiz...');
    
    // Vérifier que l'élément quiz-content existe
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) {
        console.error('❌ ERREUR: Élément quiz-content introuvable dans le DOM');
        return;
    }
    console.log('✅ Élément quiz-content trouvé');
    
    // Vérifier que profileQuestion est défini
    if (!profileQuestion) {
        console.error('❌ ERREUR: profileQuestion n\'est pas défini');
        quizContent.innerHTML = '<div style="padding: 2rem; text-align: center; color: #ef4444;"><p>Erreur: Configuration du quiz manquante</p></div>';
        return;
    }
    console.log('✅ profileQuestion défini:', profileQuestion.question);
    
    // Commencer par la question de profil
    quizQuestions = [profileQuestion];
    console.log('✅ quizQuestions initialisé avec', quizQuestions.length, 'question(s)');
    
    // Attendre un peu pour s'assurer que le DOM est prêt
    setTimeout(() => {
        console.log('🔵 Appel de showQuestion(0)...');
        showQuestion(0);
    }, 100);
    
    // Récupérer l'email depuis localStorage s'il existe
    const savedEmail = localStorage.getItem('quiz-email');
    if (savedEmail) {
        setTimeout(() => {
            const emailInput = document.getElementById('quiz-email');
            if (emailInput) {
                emailInput.value = savedEmail;
            }
        }, 300);
    }
}

// Fonction pour sauvegarder toutes les infos de contact dans localStorage
function saveQuizContactInfo() {
    const prenom = document.getElementById('quiz-prenom')?.value.trim() || '';
    const nom = document.getElementById('quiz-nom')?.value.trim() || '';
    const email = document.getElementById('quiz-email')?.value.trim() || '';
    const telephone = document.getElementById('quiz-telephone')?.value.trim() || '';
    
    if (prenom) localStorage.setItem('quiz-prenom', prenom);
    if (nom) localStorage.setItem('quiz-nom', nom);
    if (email) localStorage.setItem('quiz-email', email);
    if (telephone) localStorage.setItem('quiz-telephone', telephone);
}

// Fonction pour valider l'email
function validateQuizEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && emailRegex.test(email)) {
        input.style.borderColor = '#10b981';
        input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    } else if (email) {
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
        input.style.borderColor = 'var(--gray-300)';
        input.style.boxShadow = 'none';
    }
}

// Fonction pour valider le téléphone (validation simplifiée - juste vérifier qu'il y a du contenu)
function validateQuizTelephone(input) {
    const telephone = input.value.trim();
    
    // Validation simplifiée : juste vérifier qu'il y a du contenu
    if (telephone && telephone.length >= 8) {
        input.style.borderColor = '#10b981';
        input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    } else if (telephone) {
        // Si trop court, garder la bordure normale (pas d'erreur rouge)
        input.style.borderColor = 'var(--gray-300)';
        input.style.boxShadow = 'none';
    } else {
        input.style.borderColor = 'var(--gray-300)';
        input.style.boxShadow = 'none';
    }
}

// Fonction pour valider tous les champs de contact et activer/désactiver le bouton suivant
function validateQuizContactInfo() {
    const prenom = document.getElementById('quiz-prenom')?.value.trim() || '';
    const nom = document.getElementById('quiz-nom')?.value.trim() || '';
    const email = document.getElementById('quiz-email')?.value.trim() || '';
    const telephone = document.getElementById('quiz-telephone')?.value.trim() || '';
    const nextBtn = document.getElementById('next-btn');
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = email && emailRegex.test(email);
    
    // Validation téléphone simplifiée (juste vérifier qu'il y a du contenu)
    const phoneValid = telephone && telephone.length >= 8;
    
    // Tous les champs doivent être remplis et valides
    const allValid = prenom && nom && emailValid && phoneValid;
    
    if (nextBtn) {
        // Vérifier aussi que le profil est sélectionné
        const profileSelected = document.querySelector('input[name="question-1"]:checked');
        nextBtn.disabled = !(allValid && profileSelected);
    }
    
    // Sauvegarder si tout est valide
    if (allValid) {
        saveQuizContactInfo();
    }
}

// Exposer les fonctions globalement
window.saveQuizContactInfo = saveQuizContactInfo;
window.validateQuizEmail = validateQuizEmail;
window.validateQuizTelephone = validateQuizTelephone;
window.validateQuizContactInfo = validateQuizContactInfo;

function showQuestion(index) {
    if (index >= quizQuestions.length) {
        showResults();
        return;
    }

    currentQuestionIndex = index;
    const question = quizQuestions[index];
    const quizContent = document.getElementById('quiz-content');
    
    // Vérifier que l'élément existe
    if (!quizContent) {
        console.error('❌ ERREUR: Élément quiz-content introuvable');
        return;
    }
    
    // Vérifier que la question existe
    if (!question) {
        console.error('❌ ERREUR: Question introuvable à l\'index', index);
        return;
    }
    
    // Mettre à jour la progression
    const totalQuestions = getTotalQuestionsCount();
    updateProgress(index + 1, totalQuestions);
    
    // Construire le HTML de la question
    let questionHTML = `<div class="quiz-question" data-question-id="${question.id}">`;
    questionHTML += `<h2 class="quiz-question-title">${question.question}</h2>`;
    questionHTML += `<div class="quiz-options">`;
    
    if (question.type === 'radio') {
        // Vérifier que les options existent
        if (!question.options || question.options.length === 0) {
            console.error('❌ ERREUR: Question radio sans options', question);
            quizContent.innerHTML = `<div style="padding: 2rem; text-align: center; color: #ef4444;">
                <p>Erreur: Question sans options disponibles</p>
            </div>`;
            return;
        }
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
    
    // Ajouter les champs de contact obligatoires juste après la question de profil
    if (question.id === 1) {
        questionHTML += `
            <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0, 191, 166, 0.08), rgba(0, 168, 150, 0.05)); border: 2px solid rgba(0, 191, 166, 0.2); border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                    <span style="font-size: 1.5rem;">👤</span>
                    <h3 style="font-size: 1.1rem; color: var(--text-primary); font-weight: 700; margin: 0;">
                        Vos coordonnées
                    </h3>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">
                            Prénom <span style="color: #ef4444;">*</span>
                        </label>
                        <input type="text" id="quiz-prenom" name="quiz-prenom" placeholder="Votre prénom" required style="width: 100%; padding: 1rem 1.25rem; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; background: white;" onchange="saveQuizContactInfo()" oninput="validateQuizContactInfo()">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">
                            Nom <span style="color: #ef4444;">*</span>
                        </label>
                        <input type="text" id="quiz-nom" name="quiz-nom" placeholder="Votre nom" required style="width: 100%; padding: 1rem 1.25rem; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; background: white;" onchange="saveQuizContactInfo()" oninput="validateQuizContactInfo()">
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">
                        Email <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="email" id="quiz-email" name="quiz-email" placeholder="votre@email.com" required style="width: 100%; padding: 1rem 1.25rem; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; background: white;" onchange="saveQuizContactInfo()" oninput="validateQuizEmail(this); validateQuizContactInfo()">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">
                        Téléphone <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="tel" id="quiz-telephone" name="quiz-telephone" placeholder="06 12 34 56 78" required style="width: 100%; padding: 1rem 1.25rem; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 1rem; transition: all 0.3s ease; background: white;" onchange="saveQuizContactInfo()" oninput="validateQuizContactInfo()">
                </div>
                
                <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.6); border-radius: 8px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                    🔒 Vos données sont sécurisées. Nous vous contacterons pour discuter de votre projet et vous envoyer vos résultats personnalisés.
                </div>
            </div>
        `;
    }
    
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
    // Désactiver le bouton par défaut, sauf si ce n'est pas la question de profil
    const shouldDisableBtn = (index === 0) ? true : false;
    questionHTML += `<button type="button" class="quiz-button quiz-button-primary" onclick="nextQuestion()" id="next-btn" ${shouldDisableBtn ? 'disabled' : ''}>${isLastQuestion ? 'Voir les résultats' : 'Suivant'}</button>`;
    questionHTML += `</div>`;
    questionHTML += `</div>`;
    
    // Injecter le HTML dans l'élément
    try {
        console.log('🔵 Injection du HTML dans quiz-content...');
        console.log('🔵 Type de question:', question.type);
        console.log('🔵 Question ID:', question.id);
        console.log('🔵 Question:', question.question);
        console.log('🔵 Options:', question.options ? question.options.length : 'Aucune');
        console.log('🔵 Longueur du HTML:', questionHTML.length);
        
        quizContent.innerHTML = questionHTML;
        
        console.log('✅ HTML injecté dans quiz-content');
        console.log('✅ Question affichée:', question.id, question.question);
        
        // Vérifier que le contenu est bien dans le DOM après injection
        setTimeout(() => {
            const questionElement = document.querySelector('.quiz-question');
            const questionTitle = document.querySelector('.quiz-question-title');
            const options = document.querySelectorAll('.quiz-option');
            
            if (!questionElement) {
                console.error('❌ ERREUR: L\'élément .quiz-question n\'a pas été créé dans le DOM');
            } else {
                console.log('✅ Élément .quiz-question trouvé dans le DOM');
            }
            
            if (!questionTitle) {
                console.error('❌ ERREUR: Le titre de la question n\'a pas été créé');
            } else {
                console.log('✅ Titre de la question trouvé:', questionTitle.textContent);
            }
            
            console.log('✅ Nombre d\'options trouvées:', options.length);
        }, 100);
    } catch (error) {
        console.error('❌ ERREUR lors de l\'affichage de la question:', error);
        console.error('❌ Stack trace:', error.stack);
        quizContent.innerHTML = `<div style="padding: 2rem; text-align: center; color: #ef4444;">
            <p>Erreur lors du chargement de la question. Veuillez rafraîchir la page.</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
            <p style="font-size: 0.75rem; margin-top: 0.5rem; color: #64748b;">Vérifiez la console pour plus de détails.</p>
        </div>`;
        return;
    }
    
    // Si c'est la question de profil, vérifier l'email au chargement
    if (question.id === 1) {
        setTimeout(() => {
            const emailInput = document.getElementById('quiz-email');
            if (emailInput) {
                const savedEmail = localStorage.getItem('quiz-email');
                if (savedEmail) {
                    emailInput.value = savedEmail;
                    validateQuizEmail(emailInput);
                }
            }
        }, 100);
    }
    
    // Ajouter les event listeners avec passage automatique
    if (question.type === 'radio') {
        document.querySelectorAll(`input[name="question-${question.id}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                // Mise à jour visuelle
                document.querySelectorAll(`label.quiz-option`).forEach(label => {
                    label.classList.remove('selected');
                });
                this.closest('label').classList.add('selected');
                
                // Vérifier aussi l'email si c'est la question de profil
                const nextBtn = document.getElementById('next-btn');
                if (question.id === 1) {
                    const emailInput = document.getElementById('quiz-email');
                    if (emailInput && emailInput.value.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(emailInput.value.trim())) {
                            nextBtn.disabled = false;
                            // Passage automatique après un court délai (sauf si c'est la question de profil avec champs de contact)
                            setTimeout(() => {
                                if (!nextBtn.disabled && index < quizQuestions.length - 1) {
                                    nextQuestion();
                                }
                            }, 500);
                        } else {
                            nextBtn.disabled = true;
                        }
                    } else {
                        nextBtn.disabled = true;
                    }
                } else {
                    nextBtn.disabled = false;
                    // Passage automatique à la question suivante après sélection
                    setTimeout(() => {
                        if (!nextBtn.disabled && index < quizQuestions.length - 1) {
                            nextQuestion();
                        }
                    }, 500);
                }
            });
        });
    } else if (question.type === 'select') {
        const select = document.querySelector(`select[name="question-${question.id}"]`);
        select.addEventListener('change', function() {
            const nextBtn = document.getElementById('next-btn');
            nextBtn.disabled = !this.value;
            // Passage automatique après sélection
            if (this.value && index < quizQuestions.length - 1) {
                setTimeout(() => {
                    nextQuestion();
                }, 500);
            }
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
    if (!adaptiveQuestions[selectedProfile]) {
        return 5; // Valeur par défaut si le profil n'existe pas
    }
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
    
    // Vérification STRICTE de tous les champs de contact si c'est la question de profil
    if (question.id === 1) {
        const prenomInput = document.getElementById('quiz-prenom');
        const nomInput = document.getElementById('quiz-nom');
        const emailInput = document.getElementById('quiz-email');
        const telephoneInput = document.getElementById('quiz-telephone');
        
        // Vérification 1: Tous les champs existent
        if (!prenomInput || !nomInput || !emailInput || !telephoneInput) {
            console.error('❌ ERREUR: Champs de contact introuvables');
            alert('Erreur technique: Les champs de contact sont introuvables. Veuillez recharger la page.');
            return;
        }
        
        // Vérification 2: Prénom
        const prenomValue = prenomInput.value.trim();
        if (!prenomValue) {
            alert('⚠️ Prénom obligatoire\n\nVeuillez renseigner votre prénom.');
            prenomInput.focus();
            prenomInput.style.borderColor = '#ef4444';
            prenomInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return;
        }
        
        // Vérification 3: Nom
        const nomValue = nomInput.value.trim();
        if (!nomValue) {
            alert('⚠️ Nom obligatoire\n\nVeuillez renseigner votre nom.');
            nomInput.focus();
            nomInput.style.borderColor = '#ef4444';
            nomInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return;
        }
        
        // Vérification 4: Email
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValue) {
            alert('⚠️ Email obligatoire\n\nVeuillez renseigner votre email pour recevoir vos résultats personnalisés.');
            emailInput.focus();
            emailInput.style.borderColor = '#ef4444';
            emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return;
        }
        if (!emailRegex.test(emailValue)) {
            alert('⚠️ Email invalide\n\nVeuillez entrer une adresse email valide (exemple: nom@email.com).');
            emailInput.focus();
            emailInput.style.borderColor = '#ef4444';
            emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return;
        }
        
        // Vérification 5: Téléphone (validation simplifiée - juste vérifier qu'il y a du contenu)
        const telephoneValue = telephoneInput.value.trim();
        if (!telephoneValue) {
            alert('⚠️ Téléphone obligatoire\n\nVeuillez renseigner votre numéro de téléphone pour que nous puissions vous contacter.');
            telephoneInput.focus();
            telephoneInput.style.borderColor = '#ef4444';
            telephoneInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return;
        }
        // Validation simplifiée : juste vérifier qu'il y a au moins 8 caractères
        if (telephoneValue.length < 8) {
            alert('⚠️ Numéro de téléphone trop court\n\nVeuillez entrer un numéro de téléphone complet.');
            telephoneInput.focus();
            telephoneInput.style.borderColor = '#ef4444';
            telephoneInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            return;
        }
        
        // Si tout est OK, sauvegarder toutes les infos
        saveQuizContactInfo();
        prenomInput.style.borderColor = '#10b981';
        nomInput.style.borderColor = '#10b981';
        emailInput.style.borderColor = '#10b981';
        telephoneInput.style.borderColor = '#10b981';
        console.log('✅ Toutes les informations de contact validées et sauvegardées');
    }
    
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
    
    if (!quizContent || !quizResults) {
        console.error('❌ Éléments quiz-content ou quiz-results introuvables');
        return;
    }
    
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    
    // Calculer le score maximum possible
    const maxScore = quizQuestions.reduce((sum, q) => {
        if (!q.options || q.options.length === 0) return sum;
        const maxOptionScore = Math.max(...q.options.map(o => o.score || 0));
        return sum + maxOptionScore;
    }, 0);
    
    const percentage = Math.round((totalScore / maxScore) * 100);
    const qualificationScore = Math.round((totalScore / maxScore) * 10);
    
    console.log('✅ Affichage des résultats du quiz', {
        profile: selectedProfile,
        score: qualificationScore,
        percentage: percentage,
        totalScore: totalScore,
        maxScore: maxScore
    });
    
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
        ctaMessage = `✅ Parfait ! Vous êtes éligible${packRecommandé ? ' au ' + (packRecommandé === 'starter' ? 'Pack Starter (500€)' : 'Pack Premium (1 900€)') : ''}. Remplis ce formulaire en 3-5 minutes pour réserver ton appel de 20 minutes et démarrer ton accompagnement.`;
    } else if ((selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') && !eligible) {
        ctaMessage = `💡 Remplis ce formulaire en 3-5 minutes pour réserver ton appel de 20 minutes. Nous discuterons ensemble des meilleures options d'accompagnement adaptées à ton budget et à tes besoins.`;
    } else if (selectedProfile === 'prestataire') {
        ctaMessage = `💼 Excellent ! Remplis ce formulaire en 5-7 minutes pour réserver ton appel de 20 minutes. Nous échangerons sur ta contribution au contenu et ton intégration dans notre réseau de prestataires.`;
    } else if (selectedProfile === 'investisseur') {
        ctaMessage = `💰 Parfait ! Remplis ce formulaire en 3-5 minutes pour réserver ton appel de 20 minutes. Nous discuterons de ta cotisation mensuelle et de ton intégration dans notre réseau d'investisseurs.`;
    } else {
        ctaMessage = `📞 Remplis ce formulaire en 3-5 minutes pour réserver ton appel de 20 minutes. Tu recevras des recommandations personnalisées adaptées à ta situation.`;
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
                        Nous te recontacterons dans les <strong>24 heures</strong> pour planifier ton appel de 20 minutes et discuter de ton projet.
                    </p>
                </div>
                
                <form class="quiz-contact-form" id="quiz-contact-form" onsubmit="handleQuizContactSubmit(event)" style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div class="form-row">
                        <input type="text" name="prenom" placeholder="Prénom *" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
                        <input type="text" name="nom" placeholder="Nom *" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
                    </div>
                    <input type="email" name="email" id="quiz-contact-email" placeholder="Email *" required style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
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
                        ${(selectedProfile === 'porteur-projet' || selectedProfile === 'entreprise') ? '📝 Remplis ce formulaire en 3-5 minutes' : selectedProfile === 'prestataire' ? '📝 Remplis ce formulaire en 5-7 minutes' : '📝 Remplis ce formulaire en 3-5 minutes'}
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
    
    // Pré-remplir tous les champs du formulaire de contact si disponibles
    setTimeout(() => {
        if (window.quizResults) {
            const contactPrenomField = document.getElementById('quiz-contact-prenom');
            const contactNomField = document.getElementById('quiz-contact-nom');
            const contactEmailField = document.getElementById('quiz-contact-email');
            const contactTelephoneField = document.getElementById('quiz-contact-telephone');
            
            if (contactPrenomField && window.quizResults.prenom) {
                contactPrenomField.value = window.quizResults.prenom;
            }
            if (contactNomField && window.quizResults.nom) {
                contactNomField.value = window.quizResults.nom;
            }
            if (contactEmailField && window.quizResults.email) {
                contactEmailField.value = window.quizResults.email;
            }
            if (contactTelephoneField && window.quizResults.telephone) {
                contactTelephoneField.value = window.quizResults.telephone;
            }
            
            if (window.quizResults.prenom || window.quizResults.nom || window.quizResults.email || window.quizResults.telephone) {
                console.log('✅ Informations de contact pré-remplies dans le formulaire');
            }
        }
    }, 100);
    
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
    
    // Récupérer toutes les infos de contact pour les stocker dans les résultats
    const finalPrenom = document.getElementById('quiz-prenom')?.value.trim() || localStorage.getItem('quiz-prenom') || '';
    const finalNom = document.getElementById('quiz-nom')?.value.trim() || localStorage.getItem('quiz-nom') || '';
    const finalEmail = document.getElementById('quiz-email')?.value.trim() || localStorage.getItem('quiz-email') || '';
    const finalTelephone = document.getElementById('quiz-telephone')?.value.trim() || localStorage.getItem('quiz-telephone') || '';
    
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
        engagementInfo: engagementInfo,
        prenom: finalPrenom,
        nom: finalNom,
        email: finalEmail,
        telephone: finalTelephone,
        timestamp: new Date().toISOString(),
        quizId: `quiz-${Date.now()}-${selectedProfile}-${qualificationScore}`
    };
    
    // Vérification finale
    const emailRegexFinal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!finalPrenom || !finalNom || !finalEmail || !emailRegexFinal.test(finalEmail) || !finalTelephone) {
        console.error('❌ ERREUR: Informations de contact manquantes dans window.quizResults');
        console.error('Données:', { finalPrenom, finalNom, finalEmail, finalTelephone });
    } else {
        console.log('✅ Toutes les informations de contact stockées dans window.quizResults');
    }
    
    // Vérification FINALE de l'email avant d'envoyer (réutilisation des variables déjà définies)
    const finalEmailCheck = document.getElementById('quiz-email');
    const finalEmailVerified = finalEmailCheck ? finalEmailCheck.value.trim() : finalEmail;
    
    if (!finalEmailVerified || !emailRegexFinal.test(finalEmailVerified)) {
        console.error('❌ ERREUR CRITIQUE: Email manquant ou invalide avant envoi');
        console.error('Email final:', finalEmailVerified);
        // On envoie quand même pour ne pas perdre les données, mais avec un avertissement
        console.warn('⚠️ Envoi du quiz avec email manquant - vérification supplémentaire nécessaire');
    } else {
        console.log('✅ Email confirmé avant envoi:', finalEmailVerified);
    }
    
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
    
    // Récupérer toutes les infos de contact depuis localStorage ou les champs du formulaire
    let userPrenom = '';
    let userNom = '';
    let userEmail = '';
    let userTelephone = '';
    
    const prenomInput = document.getElementById('quiz-prenom');
    const nomInput = document.getElementById('quiz-nom');
    const emailInput = document.getElementById('quiz-email');
    const telephoneInput = document.getElementById('quiz-telephone');
    
    if (prenomInput && prenomInput.value) {
        userPrenom = prenomInput.value.trim();
    } else {
        userPrenom = localStorage.getItem('quiz-prenom') || '';
    }
    
    if (nomInput && nomInput.value) {
        userNom = nomInput.value.trim();
    } else {
        userNom = localStorage.getItem('quiz-nom') || '';
    }
    
    if (emailInput && emailInput.value) {
        userEmail = emailInput.value.trim();
    } else {
        userEmail = localStorage.getItem('quiz-email') || '';
    }
    
    if (telephoneInput && telephoneInput.value) {
        userTelephone = telephoneInput.value.trim();
    } else {
        userTelephone = localStorage.getItem('quiz-telephone') || '';
    }
    
    // VALIDATION CRITIQUE : Tous les champs sont OBLIGATOIRES
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasErrors = false;
    const errors = [];
    
    if (!userPrenom) {
        errors.push('Prénom manquant');
        hasErrors = true;
    }
    
    if (!userNom) {
        errors.push('Nom manquant');
        hasErrors = true;
    }
    
    if (!userEmail || !emailRegex.test(userEmail)) {
        errors.push('Email manquant ou invalide');
        hasErrors = true;
    }
    
    // Validation téléphone simplifiée (juste vérifier qu'il y a du contenu)
    if (!userTelephone || userTelephone.length < 8) {
        errors.push('Téléphone manquant ou trop court');
        hasErrors = true;
    }
    
    if (hasErrors) {
        console.error('❌ ERREUR CRITIQUE: Informations de contact manquantes ou invalides');
        console.error('Erreurs:', errors);
        console.error('Données récupérées:', { userPrenom, userNom, userEmail, userTelephone });
        
        // Essayer une dernière fois de récupérer depuis le DOM
        const prenomField = document.getElementById('quiz-prenom');
        const nomField = document.getElementById('quiz-nom');
        const emailField = document.getElementById('quiz-email');
        const telephoneField = document.getElementById('quiz-telephone');
        
        if (prenomField && prenomField.value) userPrenom = prenomField.value.trim();
        if (nomField && nomField.value) userNom = nomField.value.trim();
        if (emailField && emailField.value && emailRegex.test(emailField.value.trim())) {
            userEmail = emailField.value.trim();
        }
        if (telephoneField && telephoneField.value) {
            const telValue = telephoneField.value.trim();
            // Validation simplifiée : juste vérifier qu'il y a au moins 8 caractères
            if (telValue.length >= 8) {
                userTelephone = telValue;
            }
        }
        
        // Si toujours des erreurs, on envoie quand même mais avec un avertissement fort
        if (!userPrenom || !userNom || !userEmail || !userTelephone) {
            console.warn('⚠️ ATTENTION: Envoi du quiz avec informations incomplètes - cela ne devrait pas arriver');
        }
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `📊 Quiz Complété - ${profileLabel} (Score: ${score}/10 - ${percentage}%)`);
    
    // Toutes les infos de contact sont TOUJOURS ajoutées
    formDataToSend.append('Prénom', userPrenom || 'NON_FOURNI_ERREUR');
    formDataToSend.append('Nom', userNom || 'NON_FOURNI_ERREUR');
    formDataToSend.append('Email', userEmail || 'NON_FOURNI_ERREUR');
    formDataToSend.append('Téléphone', userTelephone || 'NON_FOURNI_ERREUR');
    
    if (userEmail && emailRegex.test(userEmail)) {
        formDataToSend.append('_replyto', userEmail);
    } else {
        // Ajouter un avertissement dans le sujet si pas d'email
        formDataToSend.append('_subject', `⚠️ ${formDataToSend.get('_subject')} - EMAIL MANQUANT`);
    }
    
    // Ajouter un avertissement si d'autres infos manquent
    if (!userPrenom || !userNom || !userTelephone) {
        formDataToSend.append('_subject', `⚠️ ${formDataToSend.get('_subject')} - INFOS INCOMPLÈTES`);
    }
    
    // Ajouter des métadonnées de tracking pour retrouver l'utilisateur
    const timestamp = new Date().toISOString();
    formDataToSend.append('Timestamp', timestamp);
    formDataToSend.append('Page URL', window.location.href);
    formDataToSend.append('Referrer', document.referrer || 'Direct');
    formDataToSend.append('User Agent', navigator.userAgent);
    formDataToSend.append('Screen Resolution', `${window.screen.width}x${window.screen.height}`);
    formDataToSend.append('Language', navigator.language || 'fr-FR');
    
    // Ajouter un identifiant unique pour ce quiz (basé sur timestamp + profil)
    const quizId = `quiz-${Date.now()}-${profile}-${score}`;
    formDataToSend.append('Quiz ID', quizId);
    
    // Note: L'adresse IP sera automatiquement capturée par Formspree dans leurs métadonnées
    
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
📧 COORDONNÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${userPrenom && userNom && userEmail && emailRegex.test(userEmail) && userTelephone && userTelephone.length >= 8 ? 
`Prénom: ${userPrenom} ✓
Nom: ${userNom} ✓
Email: ${userEmail} ✓
Téléphone: ${userTelephone} ✓` : 
'🚨 ERREUR CRITIQUE: Informations de contact manquantes ou invalides !\n\nCette erreur ne devrait PAS se produire car tous les champs sont obligatoires.\n\nACTIONS À FAIRE:\n1. Vérifier le formulaire de contact (l\'utilisateur peut avoir rempli après)\n2. Vérifier les métadonnées Formspree (IP, User Agent)\n3. Chercher dans Brevo les contacts récents avec les mêmes caractéristiques\n4. Vérifier le Quiz ID ci-dessous pour retrouver l\'utilisateur'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 IDENTIFIANT UNIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quiz ID: ${quizId}
Timestamp: ${timestamp}
Page: ${window.location.href}
Referrer: ${document.referrer || 'Direct'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️ NOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cet email est envoyé automatiquement à chaque complétion du quiz.
${userPrenom && userNom && userEmail && emailRegex.test(userEmail) && userTelephone && userTelephone.length >= 8 ? 
`✅ Contact direct possible :
- Email: ${userEmail}
- Téléphone: ${userTelephone}
- Nom complet: ${userPrenom} ${userNom}

Vous pouvez répondre directement à cet email ou appeler l'utilisateur.` : 
'⚠️ L\'utilisateur DOIT remplir le formulaire de contact pour partager ses coordonnées complètes.'}

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
