# Domtom Connect - Plateforme SaaS d'Expertise Stratégique

Domtom Connect est une plateforme SaaS dédiée à la sécurisation des investissements et à la connexion entre les entreprises et les meilleurs experts de la diaspora ultramarine (Antilles et Guyane).

## 🚀 Fonctionnalités Clés

- **Marketplace de Talents** : Annuaire complet d'experts qualifiés et vérifiés.
- **Job Board (Missions)** : Publication et gestion d'annonces de missions stratégiques.
- **Dashboard Utilisateur** : Espaces personnalisés selon le rôle (Expert, Entreprise, Porteur de projet).
- **Messagerie Interne** : Système de mise en relation directe sécurisée.
- **Gestion Premium** : Système d'abonnement (Pack Authority, Business) via PayPal.

## 🛠️ Stack Technique

- **Frontend** : HTML5, CSS3 (Vanilla), JavaScript ES6+
- **Backend Services** : Supabase (Authentification, Base de données, Storage)
- **Paiements** : PayPal SDK Integration
- **Hébergement/Dev** : Vercel / Locally via `vercel dev`

## 📁 Structure du Projet

```
DomtomConnect-Website/
├── assets/                 # Ressources globales (CSS, JS, Images)
├── marketplace/            # Annuaire (Talents, Entreprises) et Missions
├── dashboard.html          # Dashboard principal unifié
├── profile.html            # Gestion du profil utilisateur
├── messages.html           # Centre de messagerie
├── registration/           # Flux d'onboarding et d'inscription par rôle
├── territoires/            # Pages dédiées par territoire (Martinique, Guyane, etc.)
├── admin/                  # Outils d'administration (Tracking leads)
└── api/                    # Fonctions backend (si applicables)
```

## 🚀 Installation et Développement

1. **Prérequis** : Avoir l'outil `vercel` installé (`npm i -g vercel`).
2. **Installation** : Cloner le dépôt et lancer `npm install`.
3. **Lancement** : `npm run dev` pour démarrer le serveur de développement local avec les fonctions Vercel.

## 📄 Licence

© 2026 Domtom Connect. Tous droits réservés.
---
**Domtom Connect** - L'accélérateur de business nouvelle génération pour les territoires ultramarins.
