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

    // Validation SIRET (assouplie - accepte SIREN 9 chiffres ou SIRET 14 chiffres)
    async validateSIRET(siret) {
        if (!siret || siret.trim().length === 0) {
            return { valid: false, error: 'Le SIRET/SIREN est requis' };
        }
        
        // Nettoyer le SIRET (enlever espaces, tirets, points)
        const digits = siret.replace(/\D/g, '');
        
        // Accepter SIREN (9 chiffres) ou SIRET (14 chiffres)
        if (digits.length < 9 || digits.length > 14) {
            return { 
                valid: false, 
                error: 'Le SIRET/SIREN doit contenir entre 9 et 14 chiffres (SIREN: 9 chiffres, SIRET: 14 chiffres)' 
            };
        }
        
        // Si c'est un SIRET complet (14 chiffres), on peut vérifier la clé de contrôle mais on ne bloque pas si invalide
        if (digits.length === 14) {
            // Algorithme de Luhn pour vérifier la clé de contrôle (mais on accepte quand même)
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
            
            // On accepte même si la clé de contrôle n'est pas valide (vérification manuelle ultérieure)
            return {
                valid: true,
                warning: isValid ? null : 'ℹ️ Le numéro SIRET sera vérifié manuellement lors de la qualification.'
            };
        }
        
        // Pour SIREN (9 chiffres) ou autres longueurs, on accepte
        return { valid: true };
    }

    // Validation URL (assouplie - ajoute http:// si manquant)
    async validateURL(url) {
        // Si le champ est vide ou contient juste "non" ou "Non", on accepte (pas de portfolio)
        if (!url || url.trim().length === 0 || url.trim().toLowerCase() === 'non' || url.trim().toLowerCase() === 'non, je n\'en ai pas encore') {
            return { valid: true }; // URL optionnelle
        }
        
        let cleanUrl = url.trim();
        
        // Si l'URL ne commence pas par http:// ou https://, l'ajouter automatiquement
        if (!/^https?:\/\//i.test(cleanUrl)) {
            // Si ça ressemble à un domaine (contient un point et pas d'espaces)
            if (cleanUrl.includes('.') && !cleanUrl.includes(' ')) {
                cleanUrl = 'https://' + cleanUrl;
            } else {
                // Sinon, on accepte quand même mais avec un avertissement
                return { 
                    valid: true,
                    warning: 'ℹ️ L\'URL sera vérifiée manuellement. Format recommandé : https://exemple.com'
                };
            }
        }
        
        // Vérifier le format de base (doit contenir au moins un point après le protocole)
        const urlPattern = /^https?:\/\/.+\..+/i;
        if (!urlPattern.test(cleanUrl)) {
            return { 
                valid: true,
                warning: 'ℹ️ Format d\'URL suspect. Vérification manuelle nécessaire.'
            };
        }

        // Vérifier si l'URL est accessible (HEAD request) - mais on ne bloque pas si échec
        try {
            const response = await fetch(cleanUrl, { 
                method: 'HEAD', 
                mode: 'no-cors',
                cache: 'no-cache'
            });
            return { 
                valid: true, 
                accessible: true,
                warning: null,
                normalizedUrl: cleanUrl
            };
        } catch (error) {
            return { 
                valid: true, // On accepte l'URL même si on ne peut pas la vérifier
                accessible: false,
                warning: 'ℹ️ L\'URL sera vérifiée manuellement lors de la qualification.',
                normalizedUrl: cleanUrl
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
        const profil = data.profil || 'autre';
        
        // Preuves fournies (40 points) - adapté selon le profil
        maxScore += 40;
        if (profil === 'prestataire') {
            if (data.portfolio) score += 10;
            if (data.realisations_liens) score += 10;
            if (data.references) score += 10;
            if (data.siret) score += 10;
        } else if (profil === 'entreprise') {
            if (data.site_web) score += 15;
            if (data.siret) score += 15;
            if (data.linkedin) score += 10;
        } else if (profil === 'porteur-projet' || profil === 'investisseur') {
            // Pour ces profils, on valorise la complétude des informations
            if (data.description_projet || data.motivation) score += 20;
            if (data.linkedin) score += 10;
            if (data.commentaires && data.commentaires.length > 50) score += 10;
        }
        
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
        if (profil === 'prestataire' && data.realisations && data.realisations.length > 100) score += 5;
        else if (profil === 'porteur-projet' && data.description_projet && data.description_projet.length > 100) score += 5;
        else if (profil === 'investisseur' && data.motivation && data.motivation.length > 50) score += 5;
        else if (profil === 'entreprise' && data.description_besoin && data.description_besoin.length > 100) score += 5;
        
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
            // Ne valider que si la valeur existe et n'est pas vide
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                continue;
            }
            
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
            
            // Ne valider les URLs que si elles sont remplies (tous les champs URL sont optionnels)
            if (field.includes('url') || field.includes('portfolio') || field.includes('site_web') || field.includes('linkedin') || field.includes('realisations_liens')) {
                // Si le champ portfolio a la valeur "non", ne pas valider l'URL du portfolio
                if (field === 'portfolio_url' && data.portfolio === 'non') {
                    // Ne rien faire, le champ est optionnel
                    continue;
                }
                
                // Tous les champs URL sont optionnels - si vide, on accepte sans validation
                if (!value || value.trim().length === 0) {
                    continue;
                }
                
                // Valider uniquement si une valeur est fournie
                const validation = await this.validateURL(value);
                // Ne jamais bloquer la validation pour les URLs optionnelles, seulement avertir
                if (!validation.valid) {
                    // Au lieu de bloquer, on ajoute juste un avertissement
                    results.warnings.push({ field, message: validation.error || 'Format d\'URL suspect, vérification manuelle nécessaire' });
                }
                if (validation.warning) {
                    results.warnings.push({ field, message: validation.warning });
                }
                // Normaliser l'URL si elle a été corrigée automatiquement
                if (validation.normalizedUrl && validation.normalizedUrl !== value) {
                    data[field] = validation.normalizedUrl;
                }
            }
            
            if (field.includes('email') && field !== 'email') {
                // Ne pas valider le champ email principal deux fois
                const validation = this.validateEmail(value);
                if (!validation.valid) {
                    results.valid = false;
                    results.errors.push({ field, message: validation.error });
                }
                if (validation.warning) {
                    results.warnings.push({ field, message: validation.warning });
                }
            }
            
            if (field === 'email') {
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

