# Éléments Manquants - Domtom Connect

**Date de vérification** : 2024-12-19

## ✅ Ce qui est en place

### Fonctionnalités Core
- ✅ Quiz de qualification avec envoi automatique d'email
- ✅ Landing pages en format quiz pour tous les profils
- ✅ Système de validation et détection de fausses informations
- ✅ Protection anti-bot
- ✅ Score de crédibilité
- ✅ Certification checkbox pour tous les profils
- ✅ Questions harmonisées entre quiz et landing pages

---

## ❌ Ce qui manque

### 1. **Pack Accompagnement & Connexions** (PRIORITÉ HAUTE)

**Statut** : ⚠️ **MANQUANT**

**Description** : Le pack "Accompagnement & Connexions" devrait être intégré dans la landing page porteurs-projets selon le plan d'intégration.

**Ce qui devrait être ajouté** :
- Section "Pack Accompagnement & Connexions" avant le formulaire
- Description du pack avec les 5 éléments du socle commun :
  1. Accompagnement personnalisé
  2. Recherche proactive de prestataires
  3. Mise en relation qualifiée
  4. Suivi et médiation
  5. Accès au réseau
- Section "Fonctionnement & acompte" expliquant le processus
- Mention du prix (actuellement : 1 900€ TTC selon `clarification-prix-modele.md`)
- Possibilité de paiement en 2 fois (acompte + solde)

**Fichier concerné** : `landing/porteurs-projets/index.html`

**Impact** : Les porteurs de projets ne voient pas clairement ce qu'ils achètent avant de remplir le formulaire.

---

### 2. **Clarification du Prix** (PRIORITÉ MOYENNE)

**Statut** : ⚠️ **À CLARIFIER**

**Description** : D'après `docs/clarification-prix-modele.md`, il y a une question ouverte :
- **Prix fixe** (1 900€ TTC) vs **Prix variable** selon la demande

**Options à décider** :
- Option A : Prix fixe unique (1 900€ TTC)
- Option B : Prix variable selon :
  - Nombre de prestataires recherchés (1, 2, 3+)
  - Complexité du projet
  - Horizon temporel

**Impact** : Le prix n'est pas clairement communiqué sur le site.

---

### 3. **Dashboard de Suivi** (PRIORITÉ BASSE - Phase 2)

**Statut** : ⏳ **PLANIFIÉ POUR PHASE 2**

**Description** : Interface pour suivre les leads et leurs scores de crédibilité.

**Fonctionnalités prévues** :
- Liste des leads avec scores de crédibilité
- Alertes automatiques pour scores < 60%
- Statistiques sur les incohérences détectées
- Filtres par profil, score, date
- Export des données

**Fichier concerné** : `admin/leads.html` (existe déjà mais peut-être incomplet)

**Impact** : Pas critique pour le lancement, mais utile pour le suivi.

---

### 4. **Vérification API SIRET/URL** (PRIORITÉ BASSE - Phase 2)

**Statut** : ⏳ **PLANIFIÉ POUR PHASE 2**

**Description** : Vérification automatique via API au lieu de seulement validation de format.

**Actuellement** :
- ✅ Validation du format SIRET (algorithme de Luhn)
- ✅ Validation du format URL (HEAD request simple)

**À ajouter** :
- Vérification SIRET via API gouvernementale (API Sirene)
- Vérification URL via service dédié (plus robuste)

**Impact** : Amélioration de la détection de fausses informations, mais pas critique.

---

### 5. **Page qualification.html** (PRIORITÉ BASSE)

**Statut** : ⚠️ **EXISTE MAIS PEUT-ÊTRE NON INTÉGRÉE**

**Description** : La page `landing/porteurs-projets/qualification.html` existe mais n'est peut-être pas intégrée dans le flux principal.

**À vérifier** :
- Est-ce que cette page est utilisée ?
- Est-ce qu'elle est redirigée depuis le quiz ou la landing page ?
- Est-ce qu'elle remplace ou complète le formulaire quiz ?

**Impact** : Risque de confusion si deux formulaires existent pour le même profil.

---

### 6. **Documentation du Script d'Appel** (PRIORITÉ BASSE)

**Statut** : ⚠️ **MANQUANT**

**Description** : D'après le plan d'intégration, un fichier `docs/script-appel-diagnostic.md` devrait exister avec le script d'appel de diagnostic.

**Impact** : Documentation interne, pas critique pour le site.

---

## 📊 Priorisation

### 🔴 PRIORITÉ HAUTE (À faire avant lancement)
1. **Pack Accompagnement & Connexions** - Intégration dans landing page porteurs-projets
2. **Clarification du Prix** - Décision et affichage sur le site

### 🟡 PRIORITÉ MOYENNE (À faire après lancement)
3. **Page qualification.html** - Vérifier l'intégration dans le flux

### 🟢 PRIORITÉ BASSE (Phase 2)
4. **Dashboard de Suivi** - Interface admin complète
5. **Vérification API SIRET/URL** - Amélioration de la validation
6. **Documentation Script d'Appel** - Documentation interne

---

## 🎯 Recommandations

### Immédiat
1. **Intégrer le Pack Accompagnement & Connexions** dans `landing/porteurs-projets/index.html`
   - Ajouter la section avant le formulaire
   - Inclure les 5 éléments du socle
   - Mentionner le prix (fixe ou variable selon décision)
   - Expliquer le fonctionnement et l'acompte

2. **Clarifier le prix** dans `docs/clarification-prix-modele.md`
   - Décider : prix fixe ou variable ?
   - Si variable, définir les critères
   - Mettre à jour les landing pages en conséquence

### Court terme
3. Vérifier l'utilisation de `qualification.html` et l'intégrer si nécessaire

### Moyen terme
4. Développer le dashboard de suivi
5. Implémenter les vérifications API

---

## ✅ Conclusion

**Le site est fonctionnel** mais il manque principalement :
1. **L'intégration du Pack Accompagnement & Connexions** pour les porteurs de projets
2. **La clarification et l'affichage du prix** du pack

Ces deux éléments sont importants pour que les porteurs de projets comprennent clairement ce qu'ils achètent avant de remplir le formulaire.

