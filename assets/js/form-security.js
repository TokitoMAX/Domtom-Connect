// Module de sécurité pour les formulaires - Protection contre les bots et fausses données

// Configuration
const SECURITY_CONFIG = {
    minFillTime: 3000, // Temps minimum de remplissage en ms (3 secondes)
    maxSubmissionsPerHour: 3, // Nombre maximum de soumissions par heure
    suspiciousPatterns: {
        emails: [
            /^test@/i,
            /^fake@/i,
            /^spam@/i,
            /@test\./i,
            /@example\./i,
            /@fake\./i,
            /12345@/i,
            /admin@/i
        ],
        phones: [
            /^123456/,
            /^000000/,
            /^111111/,
            /^999999/,
            /^012345/,
            /^12345/
        ],
        names: [
            /^test/i,
            /^fake/i,
            /^spam/i,
            /^admin/i,
            /^user/i,
            /^demo/i,
            /^xxx/i,
            /^aaa/i,
            /^123/i
        ]
    }
};

// Stockage local pour le rate limiting
function getSubmissionHistory() {
    const history = localStorage.getItem('form_submission_history');
    return history ? JSON.parse(history) : [];
}

function addSubmissionToHistory() {
    const history = getSubmissionHistory();
    const now = Date.now();
    
    // Nettoyer les entrées de plus d'une heure
    const oneHourAgo = now - (60 * 60 * 1000);
    const recentHistory = history.filter(timestamp => timestamp > oneHourAgo);
    
    // Ajouter la nouvelle soumission
    recentHistory.push(now);
    
    localStorage.setItem('form_submission_history', JSON.stringify(recentHistory));
    return recentHistory.length;
}

function checkRateLimit() {
    const history = getSubmissionHistory();
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const recentSubmissions = history.filter(timestamp => timestamp > oneHourAgo);
    
    return recentSubmissions.length < SECURITY_CONFIG.maxSubmissionsPerHour;
}

// Détection de patterns suspects
function isSuspiciousEmail(email) {
    if (!email) return false;
    return SECURITY_CONFIG.suspiciousPatterns.emails.some(pattern => pattern.test(email));
}

function isSuspiciousPhone(phone) {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\s/g, '').replace(/[^\d]/g, '');
    return SECURITY_CONFIG.suspiciousPatterns.phones.some(pattern => pattern.test(cleanPhone));
}

function isSuspiciousName(name) {
    if (!name) return false;
    return SECURITY_CONFIG.suspiciousPatterns.names.some(pattern => pattern.test(name));
}

// Validation stricte de l'email
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;
    
    // Vérifier qu'il n'y a pas de caractères suspects
    if (email.includes('..')) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    if (email.includes('@.') || email.includes('.@')) return false;
    
    // Vérifier la longueur raisonnable
    if (email.length > 254) return false;
    
    return true;
}

// Validation stricte du téléphone
function isValidPhone(phone) {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
    
    // Doit contenir entre 10 et 15 chiffres (format international)
    const digits = cleanPhone.replace(/[^\d]/g, '');
    if (digits.length < 10 || digits.length > 15) return false;
    
    // Ne doit pas être composé uniquement du même chiffre
    if (/^(\d)\1{9,}$/.test(digits)) return false;
    
    return true;
}

// Validation des noms
function isValidName(name) {
    if (!name) return false;
    
    // Longueur minimale et maximale
    if (name.length < 2 || name.length > 50) return false;
    
    // Ne doit pas contenir uniquement des chiffres ou des caractères spéciaux
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return false;
    
    // Ne doit pas être composé uniquement d'espaces
    if (name.trim().length < 2) return false;
    
    return true;
}

// Vérification du honeypot (champ caché pour attraper les bots)
function checkHoneypot(form) {
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
        // Si le champ honeypot est rempli, c'est probablement un bot
        return false;
    }
    return true;
}

// Vérification du temps de remplissage
function checkFillTime(form) {
    const startTime = form.dataset.fillStartTime;
    if (!startTime) return true; // Si pas de timestamp, on laisse passer (première fois)
    
    const fillTime = Date.now() - parseInt(startTime);
    return fillTime >= SECURITY_CONFIG.minFillTime;
}

// Initialiser le suivi du temps de remplissage
function initFillTimeTracking(form) {
    if (!form.dataset.fillStartTime) {
        form.dataset.fillStartTime = Date.now().toString();
    }
}

// Validation complète du formulaire
function validateFormSecurity(form, data) {
    const errors = [];
    
    // 1. Vérifier le honeypot
    if (!checkHoneypot(form)) {
        errors.push('Soumission détectée comme suspecte.');
        console.warn('Honeypot détecté - probable bot');
        return { valid: false, errors };
    }
    
    // 2. Vérifier le rate limiting
    if (!checkRateLimit()) {
        errors.push('Trop de soumissions récentes. Veuillez patienter avant de réessayer.');
        return { valid: false, errors };
    }
    
    // 3. Vérifier le temps de remplissage
    if (!checkFillTime(form)) {
        errors.push('Le formulaire semble avoir été rempli trop rapidement. Veuillez prendre votre temps.');
        return { valid: false, errors };
    }
    
    // 4. Valider l'email
    if (data.email) {
        if (!isValidEmail(data.email)) {
            errors.push('Veuillez entrer une adresse email valide.');
        } else if (isSuspiciousEmail(data.email)) {
            errors.push('L\'adresse email fournie semble invalide.');
        }
    }
    
    // 5. Valider le téléphone
    if (data.telephone) {
        if (!isValidPhone(data.telephone)) {
            errors.push('Veuillez entrer un numéro de téléphone valide.');
        } else if (isSuspiciousPhone(data.telephone)) {
            errors.push('Le numéro de téléphone fourni semble invalide.');
        }
    }
    
    // 6. Valider les noms (mais ne PAS bloquer si vides ou invalides - juste avertir)
    // Les noms peuvent être vides ou invalides, on ne bloque pas l'envoi
    if (data.prenom && isSuspiciousName(data.prenom)) {
        // Ne pas bloquer, juste logger
        console.warn('Prénom suspect détecté:', data.prenom);
    }
    if (data.nom && isSuspiciousName(data.nom)) {
        // Ne pas bloquer, juste logger
        console.warn('Nom suspect détecté:', data.nom);
    }
    
    // Ne pas valider les noms de manière stricte - permettre l'envoi même si invalides
    // La validation stricte est faite côté serveur
    if (data.prenom && data.prenom.trim() && !isValidName(data.prenom)) {
        // Juste logger, ne pas bloquer
        console.warn('Prénom invalide détecté (mais envoi autorisé):', data.prenom);
    }
    if (data.nom && data.nom.trim() && !isValidName(data.nom)) {
        // Juste logger, ne pas bloquer
        console.warn('Nom invalide détecté (mais envoi autorisé):', data.nom);
    }
    
    // 7. Vérifier que les champs ne sont pas identiques (signe de spam)
    if (data.prenom && data.nom && data.prenom.toLowerCase() === data.nom.toLowerCase()) {
        errors.push('Le prénom et le nom ne peuvent pas être identiques.');
    }
    
    // 8. Vérifier que l'email ne contient pas le nom/prénom (signe de spam)
    if (data.email && data.prenom && data.email.toLowerCase().includes(data.prenom.toLowerCase())) {
        // C'est acceptable, mais on note pour surveillance
        console.log('Email contient le prénom - à surveiller');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// Fonction principale de sécurité à appeler avant la soumission
function secureFormSubmission(form, data) {
    // Initialiser le suivi du temps si pas déjà fait
    initFillTimeTracking(form);
    
    // Valider la sécurité
    const validation = validateFormSecurity(form, data);
    
    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors
        };
    }
    
    // Si validation OK, enregistrer la soumission
    const submissionCount = addSubmissionToHistory();
    
    return {
        success: true,
        submissionCount
    };
}

// Exporter les fonctions pour utilisation globale
window.formSecurity = {
    secureFormSubmission,
    validateFormSecurity,
    initFillTimeTracking,
    checkRateLimit,
    isValidEmail,
    isValidPhone,
    isValidName
};

