// Module de sécurité pour les formulaires - Protection contre les bots et fausses données

// Configuration
const SECURITY_CONFIG = {
    minFillTime: 3000,
    maxSubmissionsPerHour: 3,
    suspiciousPatterns: {
        emails: [
            /^test@/i,
            /^fake@/i,
            /^spam@/i,
            /@test\./i,
            /@example\./i,
            /@fake\./i,
            /12345@/i,
            /admin@/i,
            /azerty@/i,
            /qwerty@/i,
            /toto@/i,
            /^a@/i
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
            /xxx/i,
            /aaa/i,
            /123/i,
            /azerty/i,
            /qwerty/i,
            /toto/i,
            /sdfg/i,
            /qwer/i,
            /asdf/i,
            /(.)\1{3,}/i // Répétition de la même lettre plus de 3 fois (ex: aaaa, bbbb)
        ]
    }
};

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

    if (email.includes('..')) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    if (email.includes('@.') || email.includes('.@')) return false;
    if (email.length > 254) return false;
    if (isSuspiciousEmail(email)) return false;

    return true;
}

// Validation stricte du téléphone
function isValidPhone(phone) {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');

    const digits = cleanPhone.replace(/[^\d]/g, '');
    if (digits.length < 10 || digits.length > 15) return false;
    if (/^(\d)\1{9,}$/.test(digits)) return false;
    if (isSuspiciousPhone(cleanPhone)) return false;

    return true;
}

// Validation des noms
function isValidName(name) {
    if (!name) return false;

    // Longueur minimale revue pour rejeter les noms trop courts
    if (name.trim().length < 3 || name.length > 50) return false;

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return false;
    if (isSuspiciousName(name)) return false;

    return true;
}

// Validation des textes longs (desc, bio, besoins)
function isValidText(text, minLength = 10) {
    if (!text) return false;
    const cleanText = text.trim();

    if (cleanText.length < minLength) return false; // Trop court
    if (/(.)\1{4,}/.test(cleanText)) return false; // Ex: 'aaaaaa' ou '......'
    if (isSuspiciousName(cleanText)) return false; // Mots clés blacklists

    // Vérifier la variété des caractères (pour contrer "azqwerty")
    const uniqueChars = new Set(cleanText.replace(/\s/g, '').split('')).size;
    if (uniqueChars < 4 && cleanText.length > 5) return false; // Très peu de diversité de lettres

    return true;
}

// Vérification du honeypot
function checkHoneypot(form) {
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
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

// Validation complète du formulaire - DÉSACTIVÉE : on envoie toujours
function validateFormSecurity(form, data) {
    // TOUTE LA VALIDATION EST DÉSACTIVÉE - ON ENVOIE TOUJOURS
    // Ne garder que le check du honeypot pour les bots évidents
    const errors = [];

    // 1. Vérifier le honeypot (seul check qui reste pour les bots évidents)
    if (!checkHoneypot(form)) {
        errors.push('Soumission détectée comme suspecte.');
        console.warn('Honeypot détecté - probable bot');
        return { valid: false, errors };
    }

    // TOUT LE RESTE EST DÉSACTIVÉ - ON ENVOIE TOUJOURS
    return {
        valid: true,
        errors: []
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
    isValidName,
    isValidText
};

