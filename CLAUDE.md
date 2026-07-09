# Domtom Connect - Architecture & Règles

## Fichiers de Règles
- **Sécurité** : @.cursor/rules/security.md
- **Navigation** : Utiliser des URLs propres (History API) via `Router.js`.

## Stack Technique
- **Base de données** : Supabase (PostgreSQL + RLS)
- **Frontend** : Vanila JS, SPA Dashboard
- **Paiements** : PayPal SDK v2
- **Hébergement** : Vercel

## Commandes
- **Démarrage** : `npx serve .` (Standard HTTP)
- **Déploiement** : automatique via Git sur Vercel.

## Important
- Toujours vérifier les politiques RLS avant d'ajouter une table.
- Ne jamais désactiver les contrôles de sécurité dans `form-security.js`.
