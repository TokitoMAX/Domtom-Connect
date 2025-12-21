// Système de validation et détection de fausses informations

class FormValidator {
    constructor() {
        this.validationRules = {
            siret: this.validateSIRET,
            url: this.validateURL,
            email: this.validateEmail,
            phone: this.validatePhone,
            references: this.validateReferences
        };
    }

    // Validation SIRET
    async validateSIRET(siret) {
        if (!siret || siret.length < 9 || siret.length > 14) {
            return { valid: false, error: 'Le SIRET doit contenir entre 9 et 14 chiffres' };
        }
        
        // Vérification de la clé de contrôle (algorithme Luhn)
        const digits = siret.replace(/\D/g, '');
        if (digits.length !== 14) {
            return { valid: false, error: 'Le SIRET doit contenir exactement 14 chiffres' };
        }
        
        // Algorithme de Luhn pour vérifier la clé de contrôle
        let sum = 0;
        for (let i = 0; i < 13; i++) {
            let digit = parseInt(digits[i]);
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        const isValid = checkDigit === parseInt(digits[13]);
        
        return {
            valid: isValid,
            error: isValid ? null : 'Le numéro SIRET semble invalide. Vérifiez-le.',
            warning: isValid ? null : '⚠️ Ce numéro SIRET ne semble pas valide. Il sera vérifié manuellement.'
        };
    }

    // Validation URL avec vérification de l'existence
    async validateURL(url) {
        if (!url) return { valid: false, error: 'URL requise' };
        
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(url)) {
            return { valid: false, error: 'L\'URL doit commencer par http:// ou https://' };
        }

        // Vérifier si l'URL est accessible (HEAD request)
        try {
            const response = await fetch(url, { 
                method: 'HEAD', 
                mode: 'no-cors',
                cache: 'no-cache'
            });
            return { 
                valid: true, 
                accessible: true,
                warning: null
            };
        } catch (error) {
            return { 
                valid: true, // On accepte l'URL même si on ne peut pas la vérifier
                accessible: false,
                warning: '⚠️ Impossible de vérifier l\'accessibilité de cette URL. Elle sera vérifiée manuellement.'
            };
        }
    }

    // Validation email
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return { valid: false, error: 'Format d\'email invalide' };
        }
        
        // Vérifier les domaines suspects
        const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
        const domain = email.split('@')[1];
        if (suspiciousDomains.some(sus => domain.includes(sus))) {
            return { 
                valid: true, 
                warning: '⚠️ Email temporaire détecté. Veuillez utiliser une adresse email professionnelle.'
            };
        }
        
        return { valid: true };
    }

    // Validation téléphone
    validatePhone(phone) {
        const phonePattern = /^[\d\s\-\+\(\)]+$/;
        if (!phonePattern.test(phone)) {
            return { valid: false, error: 'Format de téléphone invalide' };
        }
        
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
            return { valid: false, error: 'Le numéro de téléphone doit contenir entre 10 et 15 chiffres' };
        }
        
        return { valid: true };
    }

    // Validation références
    validateReferences(references) {
        if (!references || references.trim().length < 20) {
            return { valid: false, error: 'Veuillez fournir au moins 2 références complètes' };
        }

        // Vérifier la présence d'emails dans les références
        const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
        const emails = references.match(emailPattern);
        
        if (!emails || emails.length < 2) {
            return { 
                valid: false, 
                error: 'Veuillez fournir au moins 2 références avec des adresses email valides'
            };
        }

        // Vérifier la présence de numéros de téléphone
        const phonePattern = /[\d\s\-\+\(\)]{10,}/g;
        const phones = references.match(phonePattern);
        
        if (!phones || phones.length < 2) {
            return { 
                valid: true, 
                warning: '⚠️ Il est recommandé d\'inclure des numéros de téléphone pour chaque référence'
            };
        }

        return { valid: true };
    }

    // Détection d'incohérences
    detectInconsistencies(data) {
        const inconsistencies = [];
        
        // Pour prestataires
        if (data.profil === 'prestataire') {
            // Incohérence : Expérience vs projets récents
            if (data.experience === 'plus-10' && data.projets_12_mois === '0') {
                inconsistencies.push({
                    type: 'warning',
                    message: '⚠️ Incohérence détectée : Vous avez plus de 10 ans d\'expérience mais aucun projet dans les 12 derniers mois. Pouvez-vous expliquer ?'
                });
            }
            
            // Incohérence : Tarifs vs expérience
            if (data.experience === 'moins-1' && (data.tarifs === 'plus-1200' || data.tarifs === '800-1200')) {
                inconsistencies.push({
                    type: 'warning',
                    message: '⚠️ Incohérence détectée : Tarifs élevés pour moins d\'1 an d\'expérience. Pouvez-vous justifier ?'
                });
            }
            
            // Incohérence : Taux de satisfaction vs projets
            if (data.projets_12_mois === '0' && data.taux_satisfaction !== 'pas-encore') {
                inconsistencies.push({
                    type: 'warning',
                    message: '⚠️ Incohérence détectée : Vous indiquez un taux de satisfaction alors que vous n\'avez pas de projets récents.'
                });
            }
        }
        
        // Pour entreprises
        if (data.profil === 'entreprise') {
            // Incohérence : Ancienneté vs prestataires précédents
            if (data.anciennete_entreprise === 'plus-10' && data.prestataires_precedents === '0') {
                inconsistencies.push({
                    type: 'warning',
                    message: '⚠️ Incohérence détectée : Entreprise de plus de 10 ans sans avoir jamais travaillé avec des prestataires externes.'
                });
            }
            
            // Incohérence : Budget vs taille
            if (data.taille_entreprise === 'micro' && data.budget === 'plus-25000') {
                inconsistencies.push({
                    type: 'warning',
                    message: '⚠️ Incohérence détectée : Budget élevé pour une micro-entreprise. Pouvez-vous justifier ?'
                });
            }
        }
        
        return inconsistencies;
    }

    // Calcul du score de crédibilité
    calculateCredibilityScore(data) {
        let score = 0;
        let maxScore = 0;
        
        // Preuves fournies (40 points)
        maxScore += 40;
        if (data.portfolio) score += 10;
        if (data.realisations_liens) score += 10;
        if (data.references) score += 10;
        if (data.siret || data.site_web) score += 10;
        
        // Cohérence des réponses (30 points)
        maxScore += 30;
        const inconsistencies = this.detectInconsistencies(data);
        if (inconsistencies.length === 0) score += 30;
        else if (inconsistencies.length === 1) score += 20;
        else if (inconsistencies.length === 2) score += 10;
        
        // Complétude des informations (20 points)
        maxScore += 20;
        const requiredFields = ['prenom', 'nom', 'email', 'telephone'];
        const filledFields = requiredFields.filter(field => data[field]).length;
        score += (filledFields / requiredFields.length) * 20;
        
        // Qualité des preuves (10 points)
        maxScore += 10;
        if (data.linkedin) score += 5;
        if (data.realisations && data.realisations.length > 100) score += 5;
        
        const percentage = (score / maxScore) * 100;
        
        return {
            score: Math.round(percentage),
            level: percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low',
            details: {
                preuves: score >= 30 ? 'Bon' : score >= 20 ? 'Moyen' : 'Faible',
                coherence: inconsistencies.length === 0 ? 'Bonne' : inconsistencies.length <= 2 ? 'Moyenne' : 'Faible',
                completude: filledFields === requiredFields.length ? 'Complète' : 'Incomplète'
            }
        };
    }

    // Validation complète d'un formulaire
    async validateForm(data) {
        const results = {
            valid: true,
            errors: [],
            warnings: [],
            inconsistencies: [],
            credibilityScore: null
        };

        // Valider chaque champ selon son type
        for (const [field, value] of Object.entries(data)) {
            if (field.includes('siret')) {
                const validation = await this.validateSIRET(value);
                if (!validation.valid) {
                    results.valid = false;
                    results.errors.push({ field, message: validation.error });
                }
                if (validation.warning) {
                    results.warnings.push({ field, message: validation.warning });
                }
            }
            
            if (field.includes('url') || field.includes('portfolio') || field.includes('site_web') || field.includes('linkedin') || field.includes('realisations_liens')) {
                const validation = await this.validateURL(value);
                if (!validation.valid) {
                    results.valid = false;
                    results.errors.push({ field, message: validation.error });
                }
                if (validation.warning) {
                    results.warnings.push({ field, message: validation.warning });
                }
            }
            
            if (field.includes('email')) {
                const validation = this.validateEmail(value);
                if (!validation.valid) {
                    results.valid = false;
                    results.errors.push({ field, message: validation.error });
                }
                if (validation.warning) {
                    results.warnings.push({ field, message: validation.warning });
                }
            }
            
            if (field.includes('telephone') || field.includes('phone')) {
                const validation = this.validatePhone(value);
                if (!validation.valid) {
                    results.valid = false;
                    results.errors.push({ field, message: validation.error });
                }
            }
            
            if (field.includes('references')) {
                const validation = this.validateReferences(value);
                if (!validation.valid) {
                    results.valid = false;
                    results.errors.push({ field, message: validation.error });
                }
                if (validation.warning) {
                    results.warnings.push({ field, message: validation.warning });
                }
            }
        }

        // Détecter les incohérences
        results.inconsistencies = this.detectInconsistencies(data);
        
        // Calculer le score de crédibilité
        results.credibilityScore = this.calculateCredibilityScore(data);

        return results;
    }
}

// Export pour utilisation globale
if (typeof window !== 'undefined') {
    window.FormValidator = FormValidator;
}

