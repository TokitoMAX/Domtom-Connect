# Packs stratégiques porteurs de projets – Segmentation par besoin

## Objectif

Que les porteurs de projets **paient** pour une offre qui **correspond à leur besoin**. Segmenter pour proposer le bon pack au bon moment : des **packs stratégiques** (un pack = un besoin identifié), pas seulement des paliers de prix.

---

## État actuel

- **Côté doc** : plusieurs packs (Découverte 99€, Urgence 199€, Transparence 149€, Starter 500€, Premium 1900€) avec des positionnements par besoin déjà partiellement décrits.
- **Côté site/quiz** : pour porteurs, seule la **question budget** pilote l’affichage (300–1000€ → Starter, 1000€+ → Premium, < 300€ → page « on vous recontacte »). Aucune question de **besoin** (tester, urgent, déléguer, projet complexe, etc.) pour orienter vers un pack précis.
- **Problème** : on ne segmente pas par besoin ; le même pack peut être proposé à des gens avec des attentes très différentes, ce qui dilue le message et la conversion.

---

## Principes des packs stratégiques

1. **Segmentation par besoin** (prioritaire sur le seul budget)  
   Identifier 4–6 besoins typiques du porteur de projet, puis faire correspondre **1 pack (ou 1 offre) par besoin** : nom du pack, message clé, contenu, prix. Le budget reste un filtre (afficher seulement les packs dans sa fourchette) mais ne suffit pas à choisir le pack.

2. **Un pack = un besoin**  
   Chaque pack a un **nom**, un **besoin cible** (« Je veux tester », « J’ai besoin urgent », « Je veux qu’on s’en occupe », « Projet complexe / long terme », etc.), un **contenu** et un **prix**. Pas de doublon : un besoin = un pack.

3. **Ils paient**  
   Tous les packs stratégiques sont payants. Les outils gratuits / appel découverte servent à capter et qualifier ; ensuite on propose le pack adapté au besoin (et au budget).

4. **Parcours qui reflète la segmentation**  
   Quiz et/ou landing posent une **question de besoin** (ou type de projet / urgence / niveau d’accompagnement souhaité). Selon la réponse + budget, on affiche le(s) pack(s) recommandé(s) et la page de résultat adaptée.

---

## Livrables proposés

### 1. Document « Packs stratégiques porteurs de projets » (segmentation par besoin)

- **Fichier** : `docs/PACKS-PORTEURS-PROJETS.md` (nouveau ou refonte).
- **Contenu** :
  - **Liste des besoins** à couvrir (ex. : tester sans s’engager, urgence 48h, comprendre / transparence, déléguer la recherche + mise en relation, projet complexe multi-prestataires, accompagnement long terme). S’appuyer sur les profils déjà dans `PSYCHOLOGIE-UTILISATEUR-PACKS.md`.
  - **Pour chaque besoin** : nom du pack, prix, contenu (ce qu’on fait / ce qu’on ne fait pas), message clé, CTA, et éventuellement « pack suivant » (upsell) si besoin évolue.
  - **Tableau de segmentation** : Besoin | Pack | Prix | Message court.
  - **Règle d’affichage** : quelle(s) question(s) (besoin, urgence, budget) permettent de recommander tel pack. Ex. « Besoin = tester » + budget < 300€ → Pack Découverte 99€ ; « Besoin = urgent » → Pack Urgence 199€ ; « Besoin = déléguer » + budget 300–1000€ → Starter 500€.

### 2. Alignement des docs existants

- `docs/PSYCHOLOGIE-UTILISATEUR-PACKS.md` : faire le lien explicite entre profils / motivations et **packs stratégiques** (quel besoin → quel pack). Option : une section « Segmentation et packs stratégiques » qui pointe vers PACKS-PORTEURS-PROJETS.
- `docs/STRATEGIE-PACKS-ENTREE-GAMME.md` et `docs/strategie-tarifaire-par-profil.md` : s’assurer que les noms, prix et contenus des packs porteurs sont cohérents avec la segmentation besoin dans PACKS-PORTEURS-PROJETS.
- `docs/packs-par-profil.md` : section Porteurs de projets — remplacer ou compléter la logique « budget seul » par « besoin + budget » et renvoyer vers PACKS-PORTEURS-PROJETS pour le détail.

### 3. Parcours quiz + landing : questions pour segmenter par besoin

- **Objectif** : avoir au moins une **question de besoin** (ou type de situation) pour les porteurs de projets, en plus ou à la place d’une logique 100 % budget.
- **Quiz** : pour le profil « porteur de projet », ajouter ou réutiliser une question du type : « Ton besoin principal ? » (tester / urgent / déléguer / projet complexe / pas encore décidé). Passer la réponse en paramètre vers la landing (ex. `besoin=tester` ou `besoin=urgent`).
- **Landing porteurs** :
  - Lire le paramètre `besoin` (et `budget` si déjà présent).
  - Afficher le **pack recommandé** en fonction de besoin + budget (ex. tableau Besoin × Budget → Pack).
  - Adapter le texte de la carte pack et le message de la page de résultat en fonction du **besoin** (pas seulement du budget).
- **Pages de résultat** : adapter les blocs « Prochaines étapes » et CTA en fonction du **pack** (et donc du besoin) ; garder un modèle payant clair (ils paient le pack proposé).

### 4. Synthèse à afficher (site / landing)

- Un **tableau ou liste « Quel pack pour quel besoin ? »** (sur la landing ou une page Tarifs dédiée) : besoin en colonne ou en ligne, pack + prix + message court. Permet au porteur de se reconnaître et de choisir en conscience tout en restant sur un parcours payant.

---

## Ordre de travail recommandé

1. **Définir la segmentation** : rédiger `docs/PACKS-PORTEURS-PROJETS.md` avec les besoins, les packs (nom, prix, contenu, message) et la règle besoin + budget → pack.
2. **Aligner les docs** : psychologie, stratégie entrée de gamme, tarifaire, packs-par-profil.
3. **Ajouter la question de besoin** dans le parcours (quiz puis landing) et la logique « besoin + budget → pack affiché / page de résultat ».
4. **Adapter les pages de résultat** et la landing pour que le message soit cohérent avec le pack stratégique (besoin) et le modèle payant.

---

## Points à trancher

- **Liste finale des besoins** à couvrir (ex. garder Urgence / Transparence en packs distincts ou les fusionner avec Découverte / Starter).
- **Nombre de packs** : 3 (Découverte, Starter, Premium), 4 (+ Urgence), 5 (+ Transparence), ou autre combinaison.
- **Question de besoin dans le quiz** : libellé exact et valeurs (tester, urgent, déléguer, complexe, etc.) pour piloter l’affichage du pack sur la landing.
