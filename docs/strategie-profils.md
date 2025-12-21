# 🎯 Stratégie de Profils - Domtom Connect

## 📊 ÉTAT ACTUEL (Problèmes identifiés)

### Incohérences détectées :

#### 1. Formulaire d'accueil (`index.html`)
- ✅ Porteur de projet
- ✅ Entrepreneur (séparé)
- ❌ **Entreprise** (MANQUANT)
- ✅ Investisseur
- ✅ Professionnel
- ✅ Prestataire
- ✅ Autre

#### 2. Quiz (`quiz.js`)
- ✅ Porteur de projet / Entrepreneur (combiné)
- ✅ Prestataire
- ✅ Entreprise
- ✅ Investisseur
- ✅ Professionnel
- ✅ Autre

#### 3. Landing pages
- ✅ `/landing/porteurs-projets`
- ✅ `/landing/entrepreneurs` (séparé)
- ✅ `/landing/entreprises`
- ✅ `/landing/investisseurs`
- ✅ `/landing/professionnels`
- ✅ `/landing/prestataires`
- ✅ `/landing/autre`

---

## ⚠️ PROBLÈMES STRATÉGIQUES

### 1. Confusion "Porteur de projet" vs "Entrepreneur"
- **Quiz** : Combinés ("Porteur de projet / Entrepreneur")
- **Formulaire accueil** : Séparés
- **Landing pages** : Séparés
- **Résultat** : L'utilisateur ne sait pas lequel choisir

### 2. "Entreprise" manquant dans le formulaire d'accueil
- Existe dans le quiz et les landing pages
- Mais pas dans le formulaire principal
- **Résultat** : Les entreprises ne peuvent pas s'inscrire depuis la page d'accueil

### 3. Trop de profils = confusion
- 6-7 profils différents
- Certains se chevauchent
- **Résultat** : L'utilisateur hésite, se perd, abandonne

---

## ✅ STRATÉGIE RECOMMANDÉE

### Option 1 : Simplification maximale (RECOMMANDÉE)

**4 profils clairs et distincts** :

1. **🚀 Porteur de projet / Entrepreneur**
   - Personne avec un projet à développer
   - Besoin : Trouver des prestataires
   - Landing : `/landing/porteurs-projets`

2. **🏢 Entreprise**
   - Entreprise établie qui cherche des prestataires
   - Besoin : Prestataires fiables pour l'entreprise
   - Landing : `/landing/entreprises`

3. **💼 Prestataire**
   - Personne/entreprise qui offre des services
   - Besoin : Trouver des clients
   - Landing : `/landing/prestataires`

4. **💰 Investisseur**
   - Personne qui veut investir dans des projets
   - Besoin : Découvrir des opportunités d'investissement
   - Landing : `/landing/investisseurs`

**Profils supprimés** :
- ❌ "Professionnel" → Fusionner avec "Entreprise" ou "Porteur de projet" selon le besoin
- ❌ "Autre" → Option "Autre besoin" dans chaque profil

**Avantages** :
- ✅ Clarté maximale
- ✅ Pas de confusion
- ✅ Chaque profil a un objectif précis
- ✅ Facilite le ciblage marketing

---

### Option 2 : Profils détaillés avec sous-catégories

**5 profils principaux** :

1. **🚀 Porteur de projet**
   - Sous-catégories : Entrepreneur individuel, Association, Collectivité
   - Landing : `/landing/porteurs-projets`

2. **🏢 Entreprise**
   - Sous-catégories : TPE/PME, Grande entreprise, Institution
   - Landing : `/landing/entreprises`

3. **💼 Prestataire**
   - Landing : `/landing/prestataires`

4. **💰 Investisseur**
   - Landing : `/landing/investisseurs`

5. **🤝 Autre**
   - Pour les cas spécifiques
   - Landing : `/landing/autre`

**Avantages** :
- ✅ Plus de granularité
- ✅ Permet de mieux qualifier
- ❌ Plus complexe pour l'utilisateur

---

## 🎯 RECOMMANDATION FINALE

### **Option 1 : 4 profils clairs** (RECOMMANDÉE)

**Justification** :
1. **Simplicité** : L'utilisateur comprend immédiatement où il va
2. **Ciblage** : Chaque profil correspond à un besoin précis
3. **Conversion** : Moins d'hésitation = plus de conversions
4. **Maintenance** : Plus facile à gérer

**Structure proposée** :

```
┌─────────────────────────────────────────┐
│         FORMULAIRE D'ACCUEIL            │
├─────────────────────────────────────────┤
│ 1. 🚀 Porteur de projet / Entrepreneur  │
│ 2. 🏢 Entreprise                        │
│ 3. 💼 Prestataire                        │
│ 4. 💰 Investisseur                       │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│              QUIZ                        │
├─────────────────────────────────────────┤
│ Mêmes 4 profils avec questions          │
│ adaptatives selon le profil             │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│         LANDING PAGES                   │
├─────────────────────────────────────────┤
│ /landing/porteurs-projets                │
│ /landing/entreprises                     │
│ /landing/prestataires                    │
│ /landing/investisseurs                   │
└─────────────────────────────────────────┘
```

---

## 📋 ACTIONS À RÉALISER

### 1. Formulaire d'accueil (`index.html`)
- [ ] Supprimer "Entrepreneur" (fusionner avec "Porteur de projet")
- [ ] Ajouter "Entreprise"
- [ ] Supprimer "Professionnel"
- [ ] Supprimer "Autre" (ou le garder comme option de secours)

### 2. Quiz (`assets/js/quiz.js`)
- [ ] Garder "Porteur de projet / Entrepreneur" (déjà combiné)
- [ ] Vérifier que "Entreprise" est présent
- [ ] Supprimer "Professionnel" (fusionner avec "Entreprise")
- [ ] Supprimer "Autre" (ou le garder)

### 3. Landing pages
- [ ] Garder `/landing/porteurs-projets` (pour porteurs + entrepreneurs)
- [ ] Garder `/landing/entreprises`
- [ ] Garder `/landing/prestataires`
- [ ] Garder `/landing/investisseurs`
- [ ] Supprimer `/landing/entrepreneurs` (fusionner avec porteurs-projets)
- [ ] Supprimer `/landing/professionnels` (fusionner avec entreprises)
- [ ] Garder `/landing/autre` (option de secours)

### 4. JavaScript (`assets/js/script.js` et `landing.js`)
- [ ] Mettre à jour les mappings de redirection
- [ ] Fusionner "entrepreneur" → "porteur-projet"
- [ ] Fusionner "professionnel" → "entreprise"

---

## 🎨 AMÉLIORATION UX

### Ajouter des descriptions courtes sous chaque profil

**Exemple dans le formulaire** :
```
┌─────────────────────────────────────────────┐
│ 🚀 Porteur de projet / Entrepreneur         │
│    Vous avez un projet à développer et      │
│    cherchez des prestataires                │
├─────────────────────────────────────────────┤
│ 🏢 Entreprise                               │
│    Votre entreprise cherche des             │
│    prestataires fiables                     │
├─────────────────────────────────────────────┤
│ 💼 Prestataire                              │
│    Vous offrez des services et cherchez     │
│    des clients                              │
├─────────────────────────────────────────────┤
│ 💰 Investisseur                             │
│    Vous cherchez des opportunités            │
│    d'investissement                         │
└─────────────────────────────────────────────┘
```

---

## ✅ RÉSULTAT ATTENDU

### Avant (confusion)
- 6-7 profils
- Incohérences entre quiz/form/landing
- L'utilisateur hésite, se perd

### Après (clarté)
- 4 profils clairs
- Cohérence totale
- L'utilisateur sait exactement où aller
- Meilleure conversion

---

## 🚀 PROCHAINES ÉTAPES

1. Valider cette stratégie
2. Implémenter les modifications
3. Tester le parcours utilisateur
4. Mesurer l'impact sur les conversions

