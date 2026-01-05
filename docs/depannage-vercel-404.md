# 🔧 Dépannage 404 sur Vercel

## 🚨 Problème
Le site retourne une erreur 404 après l'ajout du webhook.

## ✅ Solutions

### Solution 1 : Redéployer sur Vercel

1. Dans le terminal :
   ```bash
   vercel --prod
   ```

2. Ou depuis le dashboard Vercel :
   - Allez sur https://vercel.com
   - Ouvrez votre projet
   - Cliquez sur "Redeploy" ou "Deploy"

### Solution 2 : Vérifier que index.html existe

Le fichier `index.html` doit être à la racine du projet.

✅ Vérifié : `index.html` existe bien à la racine

### Solution 3 : Vérifier vercel.json

Le fichier `vercel.json` actuel est minimal et ne devrait pas casser le site :

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

Si le problème persiste, **supprimez complètement vercel.json** :
- Vercel servira automatiquement les fichiers statiques
- L'API webhook fonctionnera quand même (Vercel détecte automatiquement `api/`)

### Solution 4 : Vérifier les logs Vercel

1. Allez sur https://vercel.com
2. Ouvrez votre projet
3. Allez dans "Deployments"
4. Cliquez sur le dernier déploiement
5. Regardez les "Logs" pour voir les erreurs

### Solution 5 : Vider le cache

1. Dans Vercel dashboard → Settings → Domains
2. Vérifiez que le domaine est bien configuré
3. Attendez quelques minutes (propagation DNS)

---

## 🎯 Action immédiate recommandée

**Supprimez `vercel.json` complètement** et redéployez :

1. Supprimez `vercel.json`
2. Redéployez : `vercel --prod`
3. Vérifiez que le site fonctionne

Vercel détectera automatiquement :
- Les fichiers statiques (HTML, CSS, JS)
- L'API dans `api/` (Serverless Functions)

---

## ✅ Vérification

Après redéploiement, vérifiez :
- ✅ `https://domtomconnect.com/` → Affiche la page d'accueil
- ✅ `https://domtomconnect.com/api/webhook` → Retourne "Méthode non autorisée" (normal, c'est POST uniquement)

---

**Si le problème persiste**, dites-moi ce que vous voyez dans les logs Vercel.

