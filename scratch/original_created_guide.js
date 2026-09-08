# Plan d'Implémentation : Step-up de Valeur & Rentabilité du Produit Digital

Ce plan détaille la transformation du guide **"Les Fondamentaux de l'Entrepreneur — Tome 1"** en un produit digital complet, packagé et hautement rentable pour l'écosystème **Domtom Connect**.

---

## 1. Persona Type & Positionnement Marketing

Le produit s'adresse à un profil très précis :
* **Cible :** Porteurs de projets, salariés en quête d'indépendance, artisans et freelances de la Caraïbe, l'Afrique et la diaspora (25-45 ans).
* **Le Problème profond :** Idée en tête depuis des mois/années, peur du regard des autres, croyance erronée qu'il faut lever des centaines de milliers d'euros, manque d'accompagnement terrain et isolement géographique.
* **La Solution :** Un format "Consultation sans filtre" (80% action, 20% théorie) avec un **carnet de bord interactif sauvegardé**, des simulateurs financiers et une feuille de route 30 jours.

---

## 2. Décisions Stratégiques & Composants Clés

### A. La Couverture & Présentation Visuelle (E-Cover & Mockup 3D)
* **Couverture officielle :** Réalisation de la couverture haute définition (palette Domtom Connect : vert émeraude `#10b981`, noir abyssal `#020617`, dorures subtiles, typographie percutante *Plus Jakarta Sans*).
* **Mockup 3D immersif :** Intégration en CSS3 3D / canvas d'un rendu livre physique + tablette tactile montrant l'interactivité du produit.

### B. Le Step-up de Valeur (L'Offre Irrésistible)
* Le produit ne sera plus un simple texte web, mais une **"Boîte à Outils d'Accélération"** :
  1. **Le Guide Interactif Tome 1** (19 chapitres + carnet d'exercices auto-sauvegardé).
  2. **Le Simulateur de Rentabilité & Seuil de Rentabilité Express** intégré et exportable.
  3. **Le Générateur de Pitch & Plan 30 Jours** avec export PDF / Carnet de bord personnalisé.
  4. **Passerelle Écosystème :** Accès privilégié à l'annuaire de prestataires et à la communauté Domtom Connect.

### C. La Page de Vente (Landing Page Dédiée & Haute Conversion)
* Création de la landing page `guide-entrepreneur.html` ou mise en avant dynamique complète.
* **Structure AIDA ultra-optimisée :**
  - **Hook / Accroche :** "Arrête d'attendre d'avoir 50 000 € pour entreprendre."
  - **Identification Persona :** Les 3 excuses qui tuent 90% des projets aux Antilles/Afrique.
  - **Démonstration de la valeur :** Aperçu du livre 3D et des 5 histoires réelles d'entrepreneurs.
  - **Stack de Valeur :** Tableau des bonus inclus et valeur totale perçue (Valeur réelle : 147 € → Offre de lancement : 27 €).
  - **Bouton d'achat / Déblocage instantané :** Intégration transparente via Stripe Checkout.

### D. Le Tunnel Freemium / Paywall Stratégique
* **Accès libre :** Chapitre 0 (La Consultation Initiale) et Chapitre 1 (Démystifier l'entrepreneuriat) offerts pour captiver le lecteur et l'amener à remplir son premier exercice.
* **Paywall déclencheur :** Dès le Chapitre 2 et l'accès aux simulateurs financiers, apparition d'un paywall interactif élégant permettant de débloquer l'accès complet en 1 clic ou de saisir une clé d'activation après achat.

---

## 3. Fichiers & Modifications Prévues

### Modèles et Assets Visuels
* `assets/images/couverture-guide-tome1.jpg` (ou SVG/WebP haute fidélité) : Couverture officielle du livre.
* `assets/css/guide-reader.css` : Styles du livre 3D, de la couverture frontispice et des éléments de paywall/conversion.

### Données & Moteur Interactif
* `assets/data/guide-tome1.js` :
  - Intégration de la page de couverture en Chapitre 0 (Cover Show).
  - Ajout des templates d'exercices bonus (Simulateur BFR & Pitch 1-page).
* `assets/js/guide-reader.js` :
  - Support de la couverture interactive au début de la lecture.
  - Gestion du statut d'accès (aperçu gratuit vs version complète débloquée).
  - Connexion avec la session Stripe ou le code d'accès client.

### Pages Utilisateurs & Vente
* `guide-entrepreneur.html` [NEW] : Page de vente dédiée haut de gamme avec mockup 3D, ciblage persona, FAQ et tunnel de commande.
* `guide.html` [MODIFY] : Intégration de la couverture interactive et du système de déblocage premium.
* `ressources/index.html` [MODIFY] : Mise en avant de la nouvelle boîte à outils et lien vers la page de vente.

---

## 4. Plan de Vérification

1. **Vérification Graphique & Responsive :**
   - Rendu parfait de la couverture et du mockup 3D sur mobile et desktop.
   - Fluidité du passage entre la couverture et les chapitres du guide.
2. **Vérification Fonctionnelle du Guide :**
   - Sauvegarde des exercices dans le `localStorage`.
   - Exportation du carnet de bord au format imprimable / PDF.
3. **Vérification du Tunnel de Conversion :**
   - Parcours utilisateur depuis la page de vente jusqu'à la lecture du guide.
   - Clarté du système de paiement / déblocage.
