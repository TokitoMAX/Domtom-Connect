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

6. **RÉPONSES OBLIGATOIREMENT EN FIL DE DISCUSSION (THREADING PARFAIT) :**
   - À chaque fois qu'un prospect a répondu, interdiction formelle de créer un nouvel email orphelin.
   - La réponse doit impérativement s'inscrire dans le même fil de discussion :
     * Récupérer le `Message-ID` du dernier email reçu du prospect.
     * Définir l'en-tête `In-Reply-To` avec ce `Message-ID`.
     * Définir l'en-tête `References` en y incluant ce `Message-ID`.
     * Conserver le même sujet (préfixé par `Re, ` sans deux-points).
     * Inclure sous la réponse la citation de l'email précédent (`Le [Date], [Expéditeur] a écrit...`).

7. **AUCUN TIRET AU MILIEU DES PHRASES (FLUIDITÉ DU FRANÇAIS) :**
   - Interdiction d'utiliser des tirets cadratins ou tirets d'incise (` - `) au milieu d'une phrase. Utiliser des virgules, des points ou une syntaxe française naturelle et fluide.

8. **DÉFINITION AUTHENTIQUE ET STRICTE DE DOMTOM CONNECT (ZÉRO MENSONGE / ZÉRO CHIFFRE INVENTÉ) :**
   - Interdiction formelle d'inventer des chiffres de membres ou d'extrapoler l'envergure (ex: interdiction d'écrire "notre réseau compte plus de 800 entreprises"). 
   - Domtom Connect est un **écosystème d'accompagnement** ayant pour but d'aider les entreprises et porteurs de projets (Caraïbe, Afrique, diaspora) à répondre à leurs différentes problématiques.
   - Les piliers réels et stricts sont :
     1. **Programme Tremplin** : accompagnement à 360 degrés (en one-to-one et potentiellement en groupe s'il y a du monde, avec possibilité de copilotage du business).
     2. **Accompagnement One-to-One** : suivi individuel direct.
     3. **Copilotage opérationnel** : permettre aux entreprises de se focaliser sur leur zone de génie pour générer du chiffre d'affaires et déléguer les tâches énergivores/chronophages.
     4. **L'Anamnèse clinique** : outil lead magnet gratuit de diagnostic des problématiques pour porteurs de projets et entreprises.
     5. **La Librairie / Guides** (ex: Tome 1 à 5€ et bundle à 27€) : orienté pour les porteurs de projets qui travaillent sur leur lancement.
     6. **Réseau et Tech** : communauté d'entraide active sur groupe WhatsApp + réseau social business propriétaire **DTC Pulse** (application mobile actuellement en bêta fermée avant sortie App Store / Play Store Android).

9. **COORDONNÉES OFFICIELLES ET STRICTES DE LOÏC VILLERONCE :**
   - **Nom et Titre :** Loïc Villeronce, Fondateur de Domtom Connect
   - **Téléphone / WhatsApp direct officiel :** `+33 6 20 78 33 77` (interdiction d'utiliser tout autre numéro).
   - **Email officiel :** `domtomconnect@gmail.com`
   - **Plateforme web :** `www.domtomconnect.com`
   - **Lien Calendly officiel :** `calendly.com/domtomconnect/30min`

