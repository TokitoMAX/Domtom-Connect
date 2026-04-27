# Domtom Connect - Règle de Sécurité OBLIGATOIRE (Standard Julia Batoro)

## 1. Secrets & Clés API
- **JAMAIS** de clé API, token, ou mot de passe en dur dans le code source.
- Utiliser la variable `ANON_KEY` pour le frontend et isoler toute `SERVICE_KEY` côté serveur.
- Les secrets doivent être configurés dans le dashboard de déploiement (Vercel).

## 2. Base de données (Supabase)
- **Row Level Security (RLS)** activée sur TOUTES les tables.
- Utiliser systématiquement `auth.uid()` pour filtrer l'accès aux données.
- Ne jamais faire confiance à `user_metadata` pour les décisions de sécurité sensibles.

## 3. Prévention des Injections
- Utiliser le SDK Supabase qui gère nativement les requêtes paramétrées.
- **INTERDICTION** d'utiliser `innerHTML` ou `dangerouslySetInnerHTML` avec du contenu utilisateur non-sanitizé.

## 4. Authentification & Sessions
- Vérification systématique de la session au chargement (`App.init()`).
- Redirection vers `/login` si aucune session active n'est détectée sur les pages protégées.
- Le logout doit vider proprement la session Supabase.

## 5. Audit & Validation
- Validation côté serveur (triggers SQL) pour les transactions financières (Commission 5%, contrôle du solde).
- Journalisation de toutes les transactions dans `transaction_logs`.
