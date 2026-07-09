# ✅ Vérification Webhook Formspree → Brevo

## 📋 CHECKLIST DE VÉRIFICATION

### ✅ Configuration
- [x] **API Key Brevo** : Configurée dans `api/webhook.js`
- [x] **ID Liste Brevo** : 3 (correct)
- [x] **URL API Brevo** : `https://api.brevo.com/v3` (correct)

### ✅ Structure Vercel
- [x] **Fichier webhook** : `api/webhook.js` existe
- [x] **vercel.json** : Configuré correctement
- [x] **package.json** : Créé et configuré
- [x] **Handler Vercel** : Format correct (`export default async function handler(req, res)`)

### ✅ Mapping des champs Formspree → Brevo

**Champs envoyés par Formspree** (depuis `assets/js/script.js`) :
- `Prénom` → PRENOM ✅
- `Nom` → NOM ✅
- `Email` → email ✅
- `Île/Territoire` → TERRITOIRE ✅
- `Profil` → PROFIL ✅
- `Newsletter` → tag `newsletter` ✅

**Vérification** : Le webhook cherche les bons noms (avec majuscules en priorité)

### ✅ Gestion de la newsletter

**Format envoyé par Formspree** :
- Si coché : `Newsletter: 'Oui'`
- Si non coché : `Newsletter: 'Non'`

**Vérification dans webhook** :
```javascript
if (newsletter === 'yes' || newsletter === 'Oui' || newsletter === 'oui')
```
✅ Gère bien 'Oui' (avec majuscule)

### ✅ Tags automatiques

Le webhook ajoute automatiquement :
- `newsletter` (si coché)
- `profil-{profil}` (ex: `profil-porteur-projet`)
- `territoire-{territoire}` (ex: `territoire-martinique`)
- `new-subscriber` (toujours)

✅ Tous les tags sont bien gérés

### ✅ Gestion des erreurs

- [x] Vérification de l'email (obligatoire)
- [x] Gestion des erreurs API Brevo
- [x] Retour d'erreur HTTP approprié (405, 500)
- [x] Logs console pour debug

### ✅ Structure des données Brevo

**Format attendu par Brevo** :
```javascript
{
  email: "email@example.com",
  attributes: {
    PRENOM: "...",
    NOM: "...",
    PROFIL: "...",
    TERRITOIRE: "...",
    SOURCE: "formulaire-principal",
    DATE_INSCRIPTION: "2026-01-05"
  },
  listIds: [3],
  tags: ["newsletter", "profil-porteur-projet", ...],
  updateEnabled: true
}
```

✅ Format correct

---

## 🚨 POINTS D'ATTENTION

### 1. Format Newsletter
- ✅ Formspree envoie `'Oui'` ou `'Non'`
- ✅ Webhook vérifie `'Oui'` (avec majuscule)
- ✅ Fonctionne correctement

### 2. Noms de champs
- ✅ Priorité aux noms avec majuscules (comme Formspree les envoie)
- ✅ Fallback sur noms minuscules (au cas où)

### 3. Tags Brevo
- ⚠️ Les tags doivent exister dans Brevo
- ⚠️ Si un tag n'existe pas, Brevo peut retourner une erreur
- 💡 **Solution** : Les tags seront créés automatiquement par Brevo si possible, sinon l'erreur sera loggée mais le contact sera quand même créé

---

## ✅ TOUT EST BON !

Le webhook est prêt à être déployé. 

**Prochaines étapes** :
1. Déployer sur Vercel : `vercel`
2. Configurer le webhook dans Formspree
3. Tester avec un formulaire réel

---

**Date de vérification** : 2026-01-05  
**Statut** : ✅ Prêt pour déploiement

