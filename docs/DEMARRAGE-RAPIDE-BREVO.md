# ⚡ DÉMARRAGE RAPIDE - Configuration Brevo (30 min)

## 🎯 Objectif
Configurer Brevo pour recevoir automatiquement les inscriptions newsletter depuis vos formulaires.

---

## 📝 ÉTAPES RAPIDES

### 1. Créer le compte (5 min)
👉 https://www.brevo.com → S'inscrire (gratuit)

### 2. Créer la liste (2 min)
- Contacts → Listes → Créer une liste
- Nom : `L'Écho Ultramarin - Newsletter Domtom Connect`
- **Notez l'ID de la liste** ⚠️

### 3. Créer les champs personnalisés (5 min)
- Contacts → Champs personnalisés → Créer un champ
- Créer : `PRENOM` (Texte), `PROFIL` (Liste), `TERRITOIRE` (Liste), `DATE_INSCRIPTION` (Date), `SOURCE` (Texte)

### 4. Créer les tags (3 min)
- Contacts → Tags → Créer un tag
- Créer : `newsletter`, `profil-porteur-projet`, `profil-entreprise`, `profil-prestataire`, `profil-investisseur`

### 5. Intégration Formspree → Brevo (10 min)

**Option A : Via Zapier (RECOMMANDÉ)**
1. Créer compte Zapier : https://zapier.com (gratuit)
2. Créer un Zap :
   - Déclencheur : Formspree → "Nouvelle soumission"
   - Action : Brevo → "Créer ou mettre à jour un contact"
   - Mapper : Email, Prénom, Profil, Territoire
   - Si Newsletter = "Oui" → Ajouter tag `newsletter`
3. Activer le Zap ✅

**Option B : Via API (Avancé)**
- Voir `scripts/integration-brevo-api.js`

### 6. Email de bienvenue (5 min)
- Email → Campagnes → Créer → Email de bienvenue
- Copier le contenu de `templates/email-bienvenue-brevo.html`
- Déclencheur : "Quand un contact s'abonne à la liste"
- Activer ✅

---

## ✅ TEST

1. Soumettre un formulaire avec newsletter coché
2. Vérifier que le contact apparaît dans Brevo
3. Vérifier que les champs sont remplis
4. Vérifier que le tag `newsletter` est ajouté

---

## 📚 DOCUMENTS COMPLETS

- **Guide détaillé** : `docs/guide-configuration-brevo.md`
- **Checklist complète** : `docs/checklist-lancement-newsletter.md`
- **Template email** : `templates/email-bienvenue-brevo.html`
- **Script API** : `scripts/integration-brevo-api.js`

---

## 🆘 BESOIN D'AIDE ?

Si vous bloquez sur une étape, dites-moi où et je vous aide immédiatement !

**Temps total** : 30 minutes  
**Difficulté** : Facile  
**Coût** : 0€ (plan gratuit Brevo + Zapier)

---

**C'est parti ! 🚀**

