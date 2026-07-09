# Plan d'Optimisation Mobile - Toutes les Pages

## 📊 État des Lieux

### Pages Principales à Optimiser
1. ✅ **index.html** - Page d'accueil (DÉJÀ OPTIMISÉE)
2. ✅ **tarifs.html** - Page tarifs (EN COURS)
3. ⏳ **services/index.html** - Page services
4. ⏳ **a-propos/index.html** - Page à propos
5. ⏳ **quiz/index.html** - Page quiz
6. ⏳ **blog/index.html** - Page blog
7. ⏳ **landing/** - Landing pages (4 pages)
8. ⏳ **merci.html** - Page de remerciement

## 🎯 Standards d'Optimisation Mobile

### Breakpoints
- **≤ 480px** : Petits mobiles
- **≤ 768px** : Mobiles et petites tablettes
- **769px - 1024px** : Tablettes

### Règles Générales

#### 1. Hero Sections
- Padding : 3rem → 2.5rem (480px: 2rem)
- Font-size titres : clamp(1.5rem, 5vw, 2.5rem)
- Font-size texte : clamp(1rem, 3vw, 1.125rem)

#### 2. Sections
- Padding : 4rem → 3rem (480px: 2.5rem)
- Margin-bottom headers : 3rem → 2rem (480px: 1.5rem)

#### 3. Cards
- Padding : 2.5rem → 1.75rem (480px: 1.5rem)
- Border-radius : 24px → 20px (480px: 16px)

#### 4. Textes
- Titres H2 : clamp(1.5rem, 4vw, 2rem)
- Titres H3 : clamp(1.25rem, 3.5vw, 1.5rem)
- Paragraphes : clamp(0.9rem, 2.5vw, 1rem)

#### 5. Grilles
- Grid : `repeat(auto-fit, minmax(X, 1fr))` → `1fr` sur mobile
- Gap : 2rem → 1.5rem (480px: 1rem)

## 📋 Checklist par Page

### ✅ Page Tarifs (tarifs.html)
- [x] Hero section optimisée
- [x] Pricing cards responsive
- [x] Pack cards optimisées
- [x] Profile headers responsive
- [x] Advantages grid → 1 colonne
- [x] Textes avec clamp()
- [x] Paddings réduits
- [x] Support 480px

### ⏳ Page Services (services/index.html)
- [ ] Hero section
- [ ] Features grid
- [ ] Services grid
- [ ] Cards responsive
- [ ] Textes optimisés
- [ ] Paddings ajustés

### ⏳ Page À Propos (a-propos/index.html)
- [ ] Hero section
- [ ] Sections optimisées
- [ ] Cards/grids responsive
- [ ] Textes optimisés

### ⏳ Page Quiz (quiz/index.html)
- [ ] Container responsive
- [ ] Questions layout
- [ ] Boutons optimisés
- [ ] Résultats responsive

### ⏳ Page Blog (blog/index.html)
- [ ] Grid articles → 1 colonne
- [ ] Cards articles
- [ ] Pagination responsive
- [ ] Sidebar (si existe) → cachée ou en bas

### ⏳ Landing Pages (landing/*/index.html)
- [ ] Hero avec formulaire
- [ ] Sections bénéfices
- [ ] Formulaires (déjà optimisés dans landing.css)
- [ ] Cards responsive

### ⏳ Page Merci (merci.html)
- [ ] Hero section
- [ ] Content centré
- [ ] Boutons responsive

## 🔧 Méthode d'Optimisation

### Pour chaque page :
1. **Identifier les sections critiques**
2. **Vérifier les grilles** (→ 1fr sur mobile)
3. **Réduire les paddings** (standard: -30% mobile, -40% petits mobiles)
4. **Utiliser clamp()** pour les font-sizes
5. **Optimiser les cards** (padding réduit)
6. **Tester sur 768px et 480px**

### CSS Pattern Standard

```css
@media (max-width: 768px) {
    .section {
        padding: 3rem 0; /* Au lieu de 4rem */
    }
    
    .card {
        padding: 1.75rem 1.5rem; /* Au lieu de 2.5rem */
    }
    
    h2 {
        font-size: clamp(1.5rem, 4vw, 2rem);
    }
    
    .grid {
        grid-template-columns: 1fr; /* Au lieu de repeat(3, 1fr) */
        gap: 1.5rem; /* Réduit */
    }
}

@media (max-width: 480px) {
    .section {
        padding: 2.5rem 0;
    }
    
    .card {
        padding: 1.5rem 1.25rem;
    }
}
```

## 📈 Priorités

### Priorité 1 (Urgent - Conversion)
1. ✅ Page Tarifs (DONE)
2. ⏳ Landing Pages (formulaires critiques)
3. ⏳ Page Services (CTAs importants)

### Priorité 2 (Important - Navigation)
4. ⏳ Page À Propos
5. ⏳ Page Blog
6. ⏳ Page Quiz

### Priorité 3 (Secondaire)
7. ⏳ Page Merci
8. ⏳ Autres pages

## ✅ Prochaines Étapes

1. Optimiser services/index.html
2. Optimiser a-propos/index.html
3. Optimiser les landing pages
4. Optimiser quiz/index.html
5. Optimiser blog/index.html
6. Tests finaux sur mobile réel

