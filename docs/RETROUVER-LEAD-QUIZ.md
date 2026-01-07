# Comment Retrouver un Lead qui a Complété le Quiz

## Situation
Vous avez reçu un email Formspree indiquant qu'une personne a complété le quiz, mais sans email de contact.

## Méthodes pour Retrouver cette Personne

### 1. Vérifier le Dashboard Formspree (PRIORITAIRE)

Formspree stocke des métadonnées supplémentaires que vous ne voyez pas dans l'email :

1. **Connectez-vous à Formspree** : https://formspree.io/forms/myzbqepy/submissions
2. **Trouvez la soumission** correspondant à l'email reçu (cherchez par date/heure)
3. **Ouvrez les détails de la soumission** - Vous verrez :
   - **Adresse IP** de l'utilisateur
   - **Timestamp exact** (plus précis que l'email)
   - **User Agent** (navigateur utilisé)
   - **Toutes les données du formulaire** (même celles non visibles dans l'email)

### 2. Vérifier si la Personne a Rempli le Formulaire de Contact

Après le quiz, l'utilisateur peut remplir le formulaire de contact. Vérifiez :

1. **Dans Formspree** : Cherchez les soumissions récentes avec :
   - Le même profil (Porteur de projet / Entrepreneur)
   - Le même score (8/10 - 81%)
   - Le même territoire (Martinique)
   - Même date/heure (proche de la complétion du quiz)

2. **Dans Brevo** : Si le webhook fonctionne, vérifiez les contacts récemment ajoutés avec les mêmes caractéristiques

### 3. Utiliser les Informations du Quiz pour Identifier

D'après l'email reçu, cette personne a :
- **Profil** : Porteur de projet / Entrepreneur
- **Territoire** : Martinique
- **Projet** : Restaurant / Bar / Café
- **Prestataire recherché** : Architecte
- **Budget accompagnement** : 300-1 000 €
- **Budget prestations** : 1 000 - 3 000 €
- **Horizon** : Court terme (0-6 mois)

**Actions possibles** :
- Si vous avez d'autres formulaires remplis récemment avec ces mêmes critères, c'est probablement la même personne
- Vérifiez les appels/contacts récents avec ces caractéristiques

### 4. Vérifier le localStorage du Navigateur (Si vous avez accès)

Si cette personne revient sur votre site avec le même navigateur :
- L'email pourrait être stocké dans `localStorage` sous la clé `quiz-email`
- Mais cela nécessite que la personne revienne sur le site

### 5. Améliorations Mises en Place

J'ai amélioré le système pour que :
- ✅ L'email soit **obligatoire** dès maintenant (plus de leads perdus)
- ✅ Plus de métadonnées soient envoyées (timestamp, URL, referrer, user agent)
- ✅ L'email soit toujours inclus dans les futures soumissions

## Actions Immédiates pour Cette Personne Spécifique

### 1. Chercher le Formulaire de Contact Après le Quiz

Cette personne a été redirigée vers : `/landing/porteurs-projets?from=quiz&budget=300-1000`

**Dans Formspree, cherchez les soumissions avec :**
- **Date** : 07/01/2026 entre 13:54 et 14:30 (elle a peut-être rempli le formulaire juste après)
- **Profil** : Porteur de projet / Entrepreneur
- **Territoire** : Martinique
- **Projet** : Restaurant / Bar / Café
- **Prestataire recherché** : Architecte
- **Budget** : 300-1 000 €

**Ou cherchez dans le message/URL** : `from=quiz` ou `quiz` dans les données

### 2. Vérifier Brevo

Si le webhook fonctionne, cette personne devrait apparaître dans Brevo si elle a rempli le formulaire de contact. Cherchez :
- Contacts ajoutés le 07/01/2026
- Avec le tag `profil-porteur-projet`
- Territoire : Martinique

### 3. Vérifier les Métadonnées Formspree

Dans Formspree, cliquez sur cette soumission et regardez :
- **Onglet "Technical"** ou **"Metadata"** (si disponible)
- L'adresse IP devrait y être
- Le User Agent aussi

### 4. Si Vous Trouvez l'IP

Avec l'IP, vous pouvez :
- Vérifier la localisation (Martinique probablement)
- Croiser avec d'autres soumissions de la même IP
- Mais sans email, vous ne pourrez toujours pas la contacter directement

## Actions Immédiates

1. **Dans Formspree** : Cherchez toutes les soumissions du 07/01/2026 après 13:54
2. **Filtrez par** : Profil "Porteur de projet", Territoire "Martinique"
3. **Vérifiez Brevo** : Contacts ajoutés ce jour-là
4. **Notez l'IP** si visible dans les métadonnées Formspree

## Pour l'Avenir

Avec les modifications apportées :
- Tous les futurs quiz incluront l'email (obligatoire)
- Plus de métadonnées seront capturées
- Vous pourrez toujours retrouver les utilisateurs via Formspree

## Si Vous Ne Trouvez Pas la Personne

Malheureusement, si cette personne :
- N'a pas fourni d'email (ancien système)
- N'a pas rempli le formulaire de contact après
- N'est pas revenue sur le site

Il sera difficile de la retrouver. Mais c'est la dernière fois que cela arrive grâce aux améliorations !

---

**Note** : Formspree peut aussi envoyer des webhooks avec plus de données. Vérifiez si vous avez configuré un webhook qui pourrait contenir l'IP ou d'autres métadonnées.

