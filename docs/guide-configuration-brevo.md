# 🚀 Guide Configuration Brevo - Domtom Connect

## ⚡ Configuration Rapide (30 minutes)

### ÉTAPE 1 : Créer le compte Brevo (5 min)

1. Aller sur https://www.brevo.com
2. Cliquer sur "S'inscrire" (gratuit)
3. Remplir le formulaire :
   - Email : domtomconnect@gmail.com
   - Mot de passe : (celui que vous voulez)
   - Nom : Loïc Villeronce
   - Entreprise : Domtom Connect
4. Vérifier votre email
5. **✅ Compte créé !**

---

### ÉTAPE 2 : Vérifier le domaine (10 min) - OPTIONNEL mais recommandé

**Pourquoi** : Améliore la délivrabilité des emails

1. Dans Brevo, aller dans **Paramètres** → **Domaines**
2. Cliquer sur **"Ajouter un domaine"**
3. Entrer : `domtomconnect.com`
4. Suivre les instructions pour ajouter les enregistrements DNS :
   - **SPF** : `v=spf1 include:spf.brevo.com ~all`
   - **DKIM** : (Brevo vous donnera la clé)
   - **DMARC** : (optionnel pour débuter)

**Note** : Si vous ne savez pas comment modifier le DNS, on peut le faire plus tard. Les emails fonctionneront quand même.

---

### ÉTAPE 3 : Créer la liste principale (2 min)

1. Dans Brevo, aller dans **Contacts** → **Listes**
2. Cliquer sur **"Créer une liste"**
3. Nom : `L'Écho Ultramarin - Newsletter Domtom Connect`
4. Description : `Newsletter pour entrepreneurs ultramarins`
5. Cliquer sur **"Créer"**
6. **✅ Notez l'ID de la liste** (vous en aurez besoin)

---

### ÉTAPE 4 : Configurer les champs personnalisés (5 min)

1. Dans Brevo, aller dans **Contacts** → **Champs personnalisés**
2. Cliquer sur **"Créer un champ"**

**Créer ces champs** :

#### Champ 1 : PRENOM
- Nom : `PRENOM`
- Type : `Texte`
- Visible dans : `Tous les formulaires`

#### Champ 2 : PROFIL
- Nom : `PROFIL`
- Type : `Liste déroulante`
- Valeurs :
  - `porteur-projet`
  - `entreprise`
  - `prestataire`
  - `investisseur`
- Visible dans : `Tous les formulaires`

#### Champ 3 : TERRITOIRE
- Nom : `TERRITOIRE`
- Type : `Liste déroulante`
- Valeurs :
  - `martinique`
  - `guadeloupe`
  - `guyane`
  - `reunion`
  - `mayotte`
  - `nouvelle-caledonie`
  - `polynesie`
  - `wallis-futuna`
  - `saint-pierre-miquelon`
  - `diaspora`
  - `autre`
- Visible dans : `Tous les formulaires`

#### Champ 4 : DATE_INSCRIPTION
- Nom : `DATE_INSCRIPTION`
- Type : `Date`
- Visible dans : `Tous les formulaires`

#### Champ 5 : SOURCE
- Nom : `SOURCE`
- Type : `Texte`
- Visible dans : `Tous les formulaires`

**✅ Tous les champs créés !**

---

### ÉTAPE 5 : Créer les tags (3 min)

1. Dans Brevo, aller dans **Contacts** → **Tags**
2. Cliquer sur **"Créer un tag"**

**Créer ces tags** :

**Tags profils** :
- `profil-porteur-projet`
- `profil-entreprise`
- `profil-prestataire`
- `profil-investisseur`

**Tags territoires** :
- `territoire-martinique`
- `territoire-guadeloupe`
- `territoire-guyane`
- `territoire-reunion`
- `territoire-mayotte`
- `territoire-nouvelle-caledonie`
- `territoire-polynesie`
- `territoire-diaspora`
- `territoire-autre`

**Tags engagement** :
- `newsletter`
- `engaged`
- `inactive`
- `new-subscriber`

**✅ Tous les tags créés !**

---

### ÉTAPE 6 : Créer les segments automatiques (5 min)

1. Dans Brevo, aller dans **Contacts** → **Segments**
2. Cliquer sur **"Créer un segment"**

**Segment 1 : Porteurs de projets**
- Nom : `Porteurs de projets`
- Condition : `PROFIL` = `porteur-projet`
- Cliquer sur **"Créer"**

**Segment 2 : Entreprises**
- Nom : `Entreprises`
- Condition : `PROFIL` = `entreprise`
- Cliquer sur **"Créer"**

**Segment 3 : Prestataires**
- Nom : `Prestataires`
- Condition : `PROFIL` = `prestataire`
- Cliquer sur **"Créer"**

**Segment 4 : Investisseurs**
- Nom : `Investisseurs`
- Condition : `PROFIL` = `investisseur`
- Cliquer sur **"Créer"**

**Segment 5 : Engagés**
- Nom : `Abonnés engagés`
- Condition : `Tag` = `engaged` ET `Tag` = `newsletter`
- Cliquer sur **"Créer"**

**✅ Tous les segments créés !**

---

## 🔗 ÉTAPE 7 : Intégration Formspree → Brevo

### Option A : Via Zapier (Recommandé - Plus simple)

1. Créer un compte Zapier (gratuit jusqu'à 100 tâches/mois) : https://zapier.com
2. Créer un nouveau Zap :
   - **Déclencheur** : Formspree
     - Sélectionner "Nouvelle soumission"
     - Connecter votre compte Formspree
     - Sélectionner le formulaire : `myzbqepy`
   - **Action** : Brevo
     - Sélectionner "Créer ou mettre à jour un contact"
     - Connecter votre compte Brevo (API Key)
     - Mapper les champs :
       - Email → Email
       - Prénom → PRENOM
       - Nom → (créer champ NOM si besoin)
       - Profil → PROFIL
       - Île/Territoire → TERRITOIRE
       - Newsletter → Tag `newsletter` (si "Oui")
     - Liste : `L'Écho Ultramarin - Newsletter Domtom Connect`
3. Activer le Zap
4. **✅ Intégration configurée !**

### Option B : Via API Brevo (Avancé)

Voir le fichier `scripts/integration-brevo-api.js` (à créer si besoin)

---

## 📧 ÉTAPE 8 : Créer l'email de bienvenue (5 min)

1. Dans Brevo, aller dans **Email** → **Campagnes**
2. Cliquer sur **"Créer une campagne"** → **"Email"**
3. Sélectionner **"Email de bienvenue"**
4. Nom : `Bienvenue - L'Écho Ultramarin`
5. Cliquer sur **"Créer"**

**Contenu de l'email** (voir template dans `templates/email-bienvenue.html`)

6. Configurer :
   - **Déclencheur** : Quand un contact s'abonne à la liste
   - **Liste** : `L'Écho Ultramarin - Newsletter Domtom Connect`
7. Enregistrer et activer
8. **✅ Email de bienvenue configuré !**

---

## ✅ CHECKLIST FINALE

- [ ] Compte Brevo créé
- [ ] Domaine vérifié (optionnel)
- [ ] Liste principale créée
- [ ] Champs personnalisés créés (5 champs)
- [ ] Tags créés (15+ tags)
- [ ] Segments créés (5 segments)
- [ ] Intégration Formspree → Brevo configurée
- [ ] Email de bienvenue créé et activé

---

## 🔑 INFORMATIONS IMPORTANTES À NOTER

**À garder précieusement** :

1. **API Key Brevo** :
   - Où trouver : **Paramètres** → **API Keys**
   - Créer une nouvelle clé : `Domtom Connect Integration`
   - **⚠️ Ne jamais partager cette clé publiquement**

2. **ID de la liste** :
   - Où trouver : **Contacts** → **Listes** → Cliquer sur la liste → URL contient l'ID
   - Exemple : `https://app.brevo.com/lists/12345` → ID = `12345`

3. **Endpoint Formspree** :
   - Actuel : `https://formspree.io/f/myzbqepy`
   - À vérifier dans votre compte Formspree

---

## 🚨 EN CAS DE PROBLÈME

**Problème** : Les contacts ne s'ajoutent pas automatiquement
- Vérifier que l'intégration Zapier est activée
- Vérifier que les champs sont bien mappés
- Vérifier les logs Zapier

**Problème** : Les emails ne partent pas
- Vérifier que le domaine est vérifié (ou utiliser l'email Brevo par défaut)
- Vérifier les limites du plan gratuit (300 emails/jour)

**Problème** : Les segments ne fonctionnent pas
- Vérifier que les champs personnalisés sont bien remplis
- Vérifier que les tags sont bien ajoutés

---

## 📞 PROCHAINES ÉTAPES

Une fois la configuration terminée :

1. **Tester** : Soumettre un formulaire avec newsletter coché
2. **Vérifier** : Le contact apparaît dans Brevo avec les bons champs
3. **Créer** : Le premier template de newsletter (Format "Carnet de Bord")
4. **Rédiger** : La première newsletter
5. **Envoyer** : À la liste de test d'abord, puis à la liste principale

---

**Temps total estimé** : 30-45 minutes  
**Difficulté** : Facile à Moyenne  
**Besoin d'aide ?** : Posez vos questions au fur et à mesure !

