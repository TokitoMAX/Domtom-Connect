# 🚀 Guide Déploiement API Brevo - Formspree → Brevo

## ⚡ Solution Simple et Gratuite : Vercel

Vercel est gratuit et parfait pour ce type de webhook.

---

## 📋 ÉTAPE 1 : Préparer les fichiers

### 1.1 Créer le dossier du projet

Créez un nouveau dossier sur votre ordinateur : `formspree-brevo-webhook`

### 1.2 Créer le fichier webhook

Copiez le contenu de `scripts/webhook-formspree-brevo.js` dans un nouveau fichier :
- Nom : `api/webhook.js` (dans votre nouveau dossier)

### 1.3 Modifier la configuration

Ouvrez `api/webhook.js` et modifiez ces lignes :

```javascript
const BREVO_API_KEY = 'VOTRE_CLE_API_BREVO_ICI'; // ← Remplacez par votre clé API
const BREVO_LIST_ID = 3; // ← ID de votre liste (vous avez #3)
```

**Pour obtenir votre API Key Brevo :**
1. Dans Brevo : Paramètres → SMTP et API → API Keys
2. Créer une nouvelle clé : "Domtom Connect Integration"
3. Copier la clé

---

## 📋 ÉTAPE 2 : Créer le fichier package.json

Créez un fichier `package.json` dans votre dossier :

```json
{
  "name": "formspree-brevo-webhook",
  "version": "1.0.0",
  "description": "Webhook Formspree vers Brevo",
  "main": "api/webhook.js",
  "scripts": {
    "dev": "vercel dev"
  },
  "dependencies": {}
}
```

---

## 📋 ÉTAPE 3 : Déployer sur Vercel

### 3.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up" (gratuit)
3. Connectez-vous avec GitHub (recommandé) ou email

### 3.2 Installer Vercel CLI

1. Ouvrez un terminal
2. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```

### 3.3 Déployer

1. Dans votre terminal, allez dans le dossier du projet :
   ```bash
   cd formspree-brevo-webhook
   ```

2. Déployez :
   ```bash
   vercel
   ```

3. Suivez les instructions :
   - "Set up and deploy?" → Oui
   - "Which scope?" → Votre compte
   - "Link to existing project?" → Non
   - "Project name?" → `formspree-brevo-webhook` (ou ce que vous voulez)
   - "Directory?" → Appuyez sur Entrée (dossier actuel)

4. Vercel va déployer et vous donner une URL comme :
   ```
   https://formspree-brevo-webhook.vercel.app/api/webhook
   ```

**✅ Notez cette URL !** Vous en aurez besoin pour Formspree.

---

## 📋 ÉTAPE 4 : Configurer Formspree

### 4.1 Aller dans Formspree

1. Allez sur https://formspree.io
2. Connectez-vous
3. Allez dans votre formulaire : `myzbqepy`

### 4.2 Configurer le webhook

1. Dans les paramètres du formulaire, cherchez "Webhooks" ou "Integrations"
2. Ajoutez un nouveau webhook :
   - URL : `https://formspree-brevo-webhook.vercel.app/api/webhook` (votre URL Vercel)
   - Méthode : POST
   - Format : JSON

3. Enregistrez

---

## ✅ TEST

1. Soumettez un formulaire sur votre site avec newsletter coché
2. Vérifiez dans Brevo → Contacts que le contact apparaît
3. Vérifiez que les champs sont bien remplis (PRENOM, PROFIL, TERRITOIRE)
4. Vérifiez que le tag `newsletter` est ajouté si coché

---

## 🔧 DÉPANNAGE

### Problème : Le contact n'apparaît pas dans Brevo

**Vérifier :**
1. Les logs Vercel : Allez sur vercel.com → Votre projet → Logs
2. L'API Key Brevo est correcte
3. L'ID de la liste est correct (#3)

### Problème : Erreur 500

**Vérifier :**
1. Les logs Vercel pour voir l'erreur exacte
2. Que BREVO_API_KEY est bien rempli
3. Que BREVO_LIST_ID est bien 3

### Problème : Les champs ne sont pas remplis

**Vérifier :**
1. Les noms des champs dans Formspree correspondent aux noms dans le script
2. Les champs personnalisés existent bien dans Brevo

---

## 📝 STRUCTURE DU PROJET

```
formspree-brevo-webhook/
├── api/
│   └── webhook.js          (votre script webhook)
├── package.json            (fichier de configuration)
└── .gitignore              (optionnel)
```

---

## 🎯 ALTERNATIVE : Netlify Functions

Si vous préférez Netlify :

1. Créez un compte Netlify (gratuit)
2. Créez un fichier `netlify/functions/webhook.js` (même code)
3. Déployez via GitHub ou Netlify CLI
4. URL sera : `https://votre-site.netlify.app/.netlify/functions/webhook`

---

## 💡 AVANTAGES DE CETTE SOLUTION

- ✅ **100% gratuit** (Vercel/Netlify)
- ✅ **Simple** (un seul fichier)
- ✅ **Rapide** (déploiement en 2 minutes)
- ✅ **Fiable** (hébergé sur Vercel/Netlify)
- ✅ **Pas de limite** (contrairement à Zapier gratuit)

---

**Besoin d'aide ?** Dites-moi où vous bloquez !

