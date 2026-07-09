# Stratégie de Détection des Fausses Informations

## Objectif

Détecter et décourager les fausses informations dans les formulaires pour garantir la qualité du réseau Domtom Connect.

## Solutions Implémentées

### 1. Validation Automatique en Temps Réel

#### Validation SIRET
- Vérification de la longueur (9-14 chiffres)
- Algorithme de Luhn pour vérifier la clé de contrôle
- Détection des numéros invalides avant soumission

#### Validation URLs
- Vérification du format (http:// ou https://)
- Tentative de vérification de l'accessibilité (HEAD request)
- Détection des URLs invalides ou inaccessibles

#### Validation Email
- Vérification du format standard
- Détection des emails temporaires (tempmail, 10minutemail, etc.)
- Avertissement pour les emails non professionnels

#### Validation Téléphone
- Vérification du format international
- Vérification de la longueur (10-15 chiffres)

#### Validation Références
- Vérification de la présence d'au moins 2 emails valides
- Vérification de la présence de numéros de téléphone
- Vérification de la complétude des informations

### 2. Détection d'Incohérences Automatique

#### Pour les Prestataires
- **Expérience vs Projets récents** : Détecte si quelqu'un dit avoir 10+ ans d'expérience mais 0 projets dans les 12 derniers mois
- **Tarifs vs Expérience** : Détecte si les tarifs sont élevés pour moins d'1 an d'expérience
- **Taux de satisfaction vs Projets** : Détecte si un taux de satisfaction est indiqué sans projets récents

#### Pour les Entreprises
- **Ancienneté vs Prestataires** : Détecte si une entreprise de 10+ ans n'a jamais travaillé avec des prestataires
- **Budget vs Taille** : Détecte si le budget est élevé pour une micro-entreprise

### 3. Système de Score de Crédibilité

Le système calcule un score de crédibilité basé sur :

#### Preuves Fournies (40 points)
- Portfolio/Site web : 10 points
- Liens vers réalisations : 10 points
- Références complètes : 10 points
- SIRET/Site web entreprise : 10 points

#### Cohérence des Réponses (30 points)
- Aucune incohérence : 30 points
- 1 incohérence : 20 points
- 2 incohérences : 10 points
- 3+ incohérences : 0 points

#### Complétude des Informations (20 points)
- Tous les champs requis remplis : 20 points
- Champs partiellement remplis : 10-15 points

#### Qualité des Preuves (10 points)
- LinkedIn fourni : 5 points
- Description détaillée des réalisations : 5 points

**Seuils de crédibilité :**
- **Score ≥ 80%** : Crédibilité élevée, peut être mis en relation
- **Score 60-79%** : Crédibilité moyenne, vérification approfondie nécessaire
- **Score < 60%** : Crédibilité faible, risque élevé de fausses informations

### 4. Questions de Validation Croisée

#### Questions Pièges pour Prestataires
1. "Combien de projets similaires avez-vous réalisés dans les 12 derniers mois ?"
   - Croisée avec : Expérience, taux de satisfaction
   
2. "Quel est votre taux de satisfaction client moyen ?"
   - Croisée avec : Nombre de projets récents
   
3. "Quelle est votre fourchette de tarifs ?"
   - Croisée avec : Expérience, nombre de projets

#### Questions Pièges pour Entreprises
1. "Depuis combien de temps votre entreprise existe-t-elle ?"
   - Croisée avec : Nombre de prestataires précédents
   
2. "Quel est votre budget estimé ?"
   - Croisée avec : Taille de l'entreprise

### 5. Avertissements et Messages de Découragement

#### Messages dans les Formulaires
- "⚠️ Toutes les informations seront vérifiées manuellement"
- "⚠️ Les incohérences détectées peuvent entraîner un refus"
- "⚠️ Vos références seront contactées pour vérification"
- "⚠️ Les fausses informations entraînent une exclusion définitive"

#### Messages lors de la Détection d'Incohérences
- Affichage en temps réel des incohérences détectées
- Demande d'explication pour chaque incohérence
- Avertissement que l'incohérence sera vérifiée lors de l'appel

### 6. Processus de Vérification Post-Soumission

#### Vérification Automatique (Immédiate)
1. Validation des formats (SIRET, URLs, emails)
2. Calcul du score de crédibilité
3. Détection des incohérences
4. Génération d'un rapport de validation

#### Vérification Manuelle (Appel)
1. Questions approfondies sur les incohérences détectées
2. Vérification des réalisations mentionnées
3. Contact des références (avec accord)
4. Validation finale de la crédibilité

### 7. Système de Signalement

#### Pour les Utilisateurs
- Possibilité de signaler des prestataires/entreprises avec des informations suspectes
- Système de notation après collaboration
- Avis vérifiés uniquement après projet terminé

#### Pour l'Équipe Domtom Connect
- Dashboard de suivi des scores de crédibilité
- Alertes automatiques pour scores < 60%
- Liste des incohérences détectées par lead

## Implémentation Technique

### Fichier : `assets/js/form-validation.js`
- Classe `FormValidator` avec toutes les méthodes de validation
- Validation asynchrone pour les URLs
- Calcul automatique du score de crédibilité
- Détection automatique des incohérences

### Intégration dans les Formulaires
```javascript
// Dans handleQuizFormSubmit
const validator = new FormValidator();
const validation = await validator.validateForm(data);

if (!validation.valid) {
    // Afficher les erreurs
    showErrors(validation.errors);
    return;
}

if (validation.warnings.length > 0) {
    // Afficher les avertissements
    showWarnings(validation.warnings);
}

if (validation.inconsistencies.length > 0) {
    // Demander des explications
    showInconsistencies(validation.inconsistencies);
}

if (validation.credibilityScore.score < 60) {
    // Avertir que le score est faible
    showLowCredibilityWarning(validation.credibilityScore);
}
```

## Métriques à Suivre

- **Taux de validation automatique** : % de formulaires validés sans erreur
- **Taux d'incohérences détectées** : % de formulaires avec incohérences
- **Score de crédibilité moyen** : Score moyen des leads
- **Taux de refus pour crédibilité faible** : % de leads refusés
- **Taux de mensonges détectés** : % de mensonges détectés lors de l'appel

## Prochaines Étapes

### Phase 1 (Immédiat)
- ✅ Validation automatique des formats
- ✅ Détection d'incohérences
- ✅ Calcul du score de crédibilité
- ⏳ Intégration dans les formulaires quiz

### Phase 2 (Court terme)
- Vérification automatique des URLs (API)
- Vérification automatique des SIRET (API gouvernementale)
- Dashboard de suivi des scores

### Phase 3 (Moyen terme)
- Système de machine learning pour détecter les patterns de mensonges
- Base de données des utilisateurs vérifiés
- Système de réputation

