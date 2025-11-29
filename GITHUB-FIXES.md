# 🔧 Correctifs pour GitHub Pages

## Problème : Porte qui se décale verticalement sur GitHub

### ✅ Solutions appliquées :

**1. Stabilisation du conteneur #maison**
- Ajout de `min-height: 450px` pour garantir une hauteur minimale avant le chargement de l'image
- Ajout de `aspect-ratio: 7/9` pour maintenir les proportions
- Cela empêche le conteneur de "sauter" quand l'image charge

**2. Image avec dimensions explicites**
- Ajout des attributs `width="350" height="450"` sur la balise `<img>`
- Ajout de `loading="eager"` pour forcer le chargement prioritaire
- Le navigateur réserve l'espace correct AVANT le chargement de l'image

**3. Image avec object-fit**
- Changement de `height: auto` → `height: 100%` + `object-fit: cover`
- L'image remplit toujours son conteneur de manière prévisible
- Pas de saut/décalage pendant le chargement

**4. Service Worker mis à jour**
- Version incrémentée : `avent-cache-v4`
- Force le rechargement de tous les fichiers sur GitHub Pages

---

## 🚀 Déploiement sur GitHub Pages

### Étapes à suivre :

```bash
# 1. Commit et push
git add .
git commit -m "Fix: Stabiliser position porte pour GitHub Pages"
git push origin main

# 2. Attendre 2-3 minutes

# 3. Vider le cache navigateur
# Ouvrez votre site sur GitHub Pages
# Faites Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
```

### Si le problème persiste :

1. Ouvrez `reset-storage.html` sur GitHub Pages
2. Cliquez sur "Réinitialiser tout"
3. Retournez à la page principale
4. Rechargez avec Ctrl+Shift+R

---

## 📝 Pourquoi ça marche maintenant ?

**Avant :**
- Le conteneur `#maison` avait une hauteur calculée par l'image
- Sur GitHub, l'image met plus de temps à charger
- Pendant ce temps, le conteneur est petit → la porte se positionne mal
- Quand l'image charge, le conteneur grandit → la porte reste mal positionnée

**Après :**
- Le conteneur a une taille fixe AVANT le chargement
- L'image respecte cette taille avec `object-fit: cover`
- La porte se positionne toujours au même endroit (50%, 50%)
- Plus de décalage, même si l'image charge lentement

---

## ✅ Checklist avant publication

- [x] `min-height` et `aspect-ratio` sur #maison
- [x] `width` et `height` sur l'image
- [x] `object-fit: cover` sur .maison-img
- [x] Service worker incrémenté (v4)
- [ ] Testé en local avec Ctrl+Shift+R
- [ ] Poussé sur GitHub
- [ ] Testé sur GitHub Pages après 3 minutes
- [ ] Testé sur mobile

---

## 🎯 Tests à faire après déploiement

1. **Desktop** : Ouvrir l'URL GitHub Pages, recharger plusieurs fois
2. **Mobile** : Tester sur téléphone en 4G (connexion lente)
3. **Cache vidé** : Ouvrir en navigation privée
4. **Position de la porte** : Doit rester au centre, pas de décalage vertical

Si tout est OK, la porte reste parfaitement centrée même sur connexion lente ! 🎄
