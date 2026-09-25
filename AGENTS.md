# REGLES STRICTES ET PERMANENTES DU PROJET DOMTOM CONNECT

## REGLE N°1 (NON NEGOCIABLE) : ADRESSES EMAILS 100% REELLES ET SOURCÉES (ZERO GUESSING)

Cette règle est PERMANENTE et doit être respectée à chaque échange, dans chaque batch, par tout agent :

1. **INTERDICTION TOTALE DE DEVINER / EXTRAPOLER DES ADRESSES :**
   - Interdiction formelle de fabriquer un email type `contact@nom-cabinet.fr` ou `contact@nom-societe.com` si le nom de domaine ou l'adresse exacte n'a pas été trouvée sur une source existante.
   - Les "guesses" ont causé des taux de rebond destructeurs pour la réputation du compte `domtomconnect@gmail.com`.

2. **PREUVE DE LA SOURCE OBLIGATOIRE POUR CHAQUE EMAIL :**
   Pour chaque cible d'un batch, l'agent DOIT fournir :
   - L'URL exacte du site officiel où l'email a été trouvé (ex: page Contact, mentions légales), OU
   - La source légale / annuaire vérifiable (Annuaire du Barreau, Ordre des Experts-Comptables, Pappers, Google Maps vérifié).
   - Si aucune adresse email réelle n'est trouvée, la cible est abandonnée ou contactée par téléphone / formulaire web, JAMAIS par une fausse adresse.

3. **VALIDATION TECHNIQUE DNS & MX OBLIGATOIRE :**
   - Tout email proposé dans un script d'envoi DOIT obligatoirement passer par `scripts/email_validator.py` qui teste l'existence du domaine et la présence d'au moins un enregistrement MX actif.
   - Si le domaine n'a pas de MX ou ne résout pas, le script REFUSE l'envoi.

4. **AUCUN DEUX-POINTS (:) DANS LES EMAILS SORTANTS :**
   - Règle de style : remplacer les deux-points par des virgules ou des tirets dans le corps des emails.

5. **EXCLUSION STRICTE DES ENTREPRISES ET DOMAINES À RISQUE D'ÉCHEC / REBOND (ZERO BOUNCE / ZERO POLLUTION) :**
   - Interdiction de cibler des typologies d'entreprises ou d'organisations où les adresses directes ne sont pas certaines, ou dont les infrastructures bloquent systématiquement les emails externes (ex : Chambres d'agriculture, institutions avec filtrage DBEB Microsoft 365, grands comptes fermés).
   - Toute entreprise ou domaine ayant déjà généré un échec d'acheminement (Failure), un délai (Delay) ou une réponse indiquant un problème d'adresse est DÉFINITIVEMENT EXCLU dans `scripts/exclusions.json` et bloqué par `scripts/dedup_engine.py`.
   - Règle absolue : Si l'adresse exacte, directe et vérifiable du décideur n'est pas connue à 100%, ON NE TENTE RIEN, ON EXCLUT DIRECTEMENT.
