# REGLE CRITIQUE : VERIFICATION DES ADRESSES EMAILS & SOURCING REEL

## Interdiction de deviner des emails
Ne JAMAIS inventer d'adresse email. Toute adresse proposée doit être issue d'un site web actif, d'un annuaire professionnel officiel (Barreau, Ordre des Experts-Comptables, Infogreffe, PagesJaunes) avec sa source mentionnée.

## Vérification technique préalable
Avant de lancer un script d'envoi ou d'ajouter une cible :
- Vérifier la résolution DNS et l'enregistrement MX avec `scripts/email_validator.py`.
- Rejeter automatiquement tout domaine inexistant ou sans MX.
