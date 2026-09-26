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

## Campagnes B2B & Prospection (Règle d'Or Absolue)
- **ZÉRO MULTI-ENVOIS / ZÉRO DOUBLONS** : Une entreprise qui n'a pas répondu ne doit JAMAIS recevoir un deuxième e-mail. 
- Tout script de prospection DOIT obligatoirement utiliser `scripts/dedup_engine.py` et bloquer :
  1. L'e-mail exact
  2. Le nom de domaine complet (`@entreprise.com`)
  3. La racine de marque (ex: `kalia-nature` vs `kalianature`)
  4. Le nom de l'entreprise
- **Format d'écriture** : 100% sans deux-points (`:`), style humain direct, zéro lien `http:` (toujours `www.domtomconnect.com` direct), pas d'argumentaire générique.
