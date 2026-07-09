# 🎯 Système de Parcours Adapté au Budget

**Date** : 2024-12-19

## ✅ Problème Résolu

**Avant** : 
- La question budget en premier faisait fuir les utilisateurs venant du quiz
- Pas de redirection adaptée selon le budget sélectionné
- Même parcours pour tous, peu importe le budget

**Maintenant** :
- ✅ Parcours différencié selon l'origine (quiz vs landing directe)
- ✅ Questions adaptées (budget en premier seulement si landing directe)
- ✅ Redirection vers page adaptée au budget après soumission
- ✅ Pages de résultats personnalisées pour chaque budget

---

## 🔄 Parcours Utilisateur

### Parcours 1 : Utilisateur vient du Quiz (page d'accueil)

1. **Quiz** → L'utilisateur passe le quiz et sélectionne un budget
2. **Redirection** → Vers `/landing/porteurs-projets?from=quiz&budget=XXX`
3. **Landing Page** → Questions normales (sans budget en premier, budget pré-rempli)
4. **Soumission** → Formulaire complet
5. **Redirection** → Page de résultat adaptée au budget :
   - `resultat-starter.html` si budget 300-1000€
   - `resultat-premium.html` si budget 1000€+
   - `resultat-info.html` si budget < 300€ ou indéfini

**Avantage** : Pas de frustration, l'utilisateur a déjà vu les packs dans le quiz

---

### Parcours 2 : Utilisateur vient directement sur la Landing

1. **Landing Page** → Voit les packs (Starter et Premium) + storytelling
2. **Formulaire** → Budget en première question (qualification en douceur)
3. **Soumission** → Formulaire complet
4. **Redirection** → Page de résultat adaptée au budget

**Avantage** : Qualification précoce, pas de surprise sur le prix

---

## 📄 Pages de Résultats

### 1. `resultat-starter.html` (Budget 300-1000€)

**Contenu** :
- Confirmation Pack Starter (500€ TTC)
- Liste des services inclus
- Prochaines étapes (appel de qualification, validation, paiement)

**Design** : Carte verte avec badge "Pack Starter"

---

### 2. `resultat-premium.html` (Budget 1000€+)

**Contenu** :
- Confirmation Pack Premium (1 900€ TTC)
- Liste des services inclus (tout Starter + recherche, mise en relation, suivi, garantie)
- Prochaines étapes (appel, acompte 950€, recherche proactive)

**Design** : Fond bleu dégradé avec carte blanche

---

### 3. `resultat-info.html` (Budget < 300€ ou indéfini)

**Contenu** :
- Confirmation demande d'informations
- Explication de l'approche (discussion avant proposition)
- Prochaines étapes (échange informel, proposition adaptée)

**Design** : Fond blanc avec encadré jaune explicatif

---

## 🔧 Modifications Techniques

### 1. Détection de l'origine

**Fichier** : `landing/porteurs-projets/index.html`

```javascript
const urlParams = new URLSearchParams(window.location.search);
const fromQuiz = urlParams.get('from') === 'quiz' || sessionStorage.getItem('fromQuiz') === 'true';
const quizBudget = urlParams.get('budget') || sessionStorage.getItem('quizBudget');
```

---

### 2. Questions adaptées

**Deux sets de questions** :
- `porteursProjetsQuestionsBase` : Questions normales (budget à la fin) - pour quiz
- `porteursProjetsQuestionsWithBudget` : Budget en premier - pour landing directe

**Sélection** :
```javascript
const porteursProjetsQuestions = fromQuiz ? porteursProjetsQuestionsBase : porteursProjetsQuestionsWithBudget;
```

---

### 3. Redirection après soumission

**Fichier** : `landing/porteurs-projets/index.html`

```javascript
// Stocker le budget pour la redirection
const budget = data.budget || submitData.budget;
sessionStorage.setItem('submittedBudget', budget);

// Rediriger vers la page adaptée au budget
setTimeout(() => {
    let redirectUrl = '/landing/porteurs-projets/resultat.html';
    if (budget === '300-1000') {
        redirectUrl = '/landing/porteurs-projets/resultat-starter.html';
    } else if (budget === '1000-3000' || budget === 'plus-3000') {
        redirectUrl = '/landing/porteurs-projets/resultat-premium.html';
    } else {
        redirectUrl = '/landing/porteurs-projets/resultat-info.html';
    }
    window.location.href = redirectUrl + '?budget=' + encodeURIComponent(budget);
}, 1000);
```

---

### 4. Quiz passe le budget en paramètre

**Fichier** : `assets/js/quiz.js`

```javascript
// Pour porteurs-projets, ajouter le paramètre from=quiz
if (selectedProfile === 'porteur-projet') {
    const budgetAnswer = answers.find(a => a.question.toLowerCase().includes('budget'));
    if (budgetAnswer) {
        const budgetValue = budgetMap[budgetAnswer.answer.toLowerCase()] || 'non-defini';
        landingPageUrl = `${landingPageUrl}?from=quiz&budget=${budgetValue}`;
    } else {
        landingPageUrl = `${landingPageUrl}?from=quiz`;
    }
}
```

---

## ✅ Résultat

### Avant
- ❌ Question budget en premier → Fait fuir les utilisateurs du quiz
- ❌ Même page de résultat pour tous
- ❌ Pas d'adaptation selon l'origine

### Maintenant
- ✅ Questions adaptées selon l'origine
- ✅ Pages de résultats personnalisées par budget
- ✅ Parcours optimisé pour chaque cas
- ✅ Pas de frustration, qualification en douceur

---

## 📊 Fichiers Modifiés/Créés

### Modifiés
- `landing/porteurs-projets/index.html` - Détection origine + questions adaptées + redirection
- `assets/js/quiz.js` - Passage du budget en paramètre
- `assets/js/landing.js` - Logique de redirection pour porteurs-projets

### Créés
- `landing/porteurs-projets/resultat-starter.html` - Page résultat Pack Starter
- `landing/porteurs-projets/resultat-premium.html` - Page résultat Pack Premium
- `landing/porteurs-projets/resultat-info.html` - Page résultat demande d'infos

---

## 🎯 Prochaines Étapes

1. **Tester** les deux parcours (quiz → landing, landing directe)
2. **Vérifier** que les redirections fonctionnent correctement
3. **Adapter** le contenu des pages de résultats selon retours
4. **Mesurer** l'impact sur le taux de conversion

