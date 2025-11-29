# 🎄 Calendrier de l'Avent Ghibli - Guide de réinitialisation

## ⚠️ Problèmes après modification des images ?

Si après avoir changé/optimisé les images vous rencontrez ces problèmes :
- ❌ Les textes ne s'enregistrent pas
- ❌ La 2ème image (joliecieltotoro.png) ne charge pas
- ❌ Les cases perdent leurs positions
- ❌ Le calendrier ne fonctionne plus correctement

### ✅ Solution : Réinitialisation complète

1. **Ouvrez `reset-storage.html` dans votre navigateur**
2. **Cliquez sur "Réinitialiser tout"**
3. **Retournez à `index.html`**
4. **Rechargez avec Ctrl+Shift+R** (Windows) ou **Cmd+Shift+R** (Mac)

### 📝 Ce que fait la réinitialisation :
- Nettoie le localStorage (positions, textes, cases ouvertes)
- Supprime le cache du Service Worker
- Vide tous les caches du navigateur
- Force le rechargement de toutes les ressources

### 🔧 Alternative manuelle :
1. Ouvrez les outils développeur (F12)
2. Application → Storage → Clear site data
3. Rechargez la page avec Ctrl+Shift+R

---

## 📱 Pour GitHub Pages

Après avoir poussé les nouvelles images sur GitHub :
1. Attendez 2-3 minutes que GitHub Pages se mette à jour
2. Ouvrez l'URL de votre site
3. Faites **Ctrl+Shift+R** pour forcer le rechargement
4. Si le problème persiste, ouvrez `reset-storage.html` directement depuis GitHub Pages

---

## 💡 Conseils pour éviter ces problèmes

- **Ne pas** modifier les noms de fichiers (garder : maison.png, Interieurmaison.png, joliecieltotoro.png)
- Optimiser les images AVANT de les intégrer au projet
- Toujours faire un rechargement forcé après modification
- Pensez à incrémenter la version du cache dans `sw.js` (ligne 1 : `avent-cache-vX`)
