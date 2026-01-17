# Guide de Déploiement sur Vercel

## Configuration pour Vercel

### 1. Fichiers de Configuration

Les fichiers suivants ont été créés pour Vercel :
- `vercel.json` - Configuration Vercel
- `.vercelignore` - Fichiers à ignorer lors du déploiement

### 2. Installation de Vercel CLI (Optionnel)

```bash
npm install -g vercel
```

### 3. Déploiement via l'Interface Web Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez le dépôt : `nouveaustorede0a100k-netizen/APP-3`
4. Vercel détectera automatiquement la configuration

### 4. Configuration dans Vercel Dashboard

**Framework Preset**: `Other` ou `React`  
**Root Directory**: `./` (laisser vide)  
**Build Command**: `npm run build`  
**Output Directory**: `web-build`  
**Install Command**: `npm install`

### 5. Variables d'Environnement

Dans Vercel Dashboard → Settings → Environment Variables, ajoutez :

```
EXPO_PUBLIC_SUPABASE_URL=https://kfymqhujigtzlzvxmdwi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

⚠️ **Important** : Ne mettez PAS `SUPABASE_SERVICE_ROLE_KEY` dans Vercel (c'est une clé privée).

### 6. Déploiement via CLI (Alternative)

Si vous préférez utiliser la CLI :

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### 7. Après le Déploiement

Une fois déployé :
1. Vérifiez que l'application se charge correctement
2. Testez la connexion Supabase
3. Testez l'authentification

### 8. Build Local (Test)

Pour tester le build localement avant de déployer :

```bash
npm run build
```

Cela créera le dossier `web-build` que vous pouvez inspecter.

## Notes Importantes

- **Expo Router** : Expo Router devrait fonctionner avec Vercel grâce à la configuration `vercel.json`
- **Assets** : Les assets sont servis depuis `/assets/` avec cache long
- **Routing** : Toutes les routes sont redirigées vers `/index.html` pour le routing client-side

## Troubleshooting

### Erreur : "Cannot find module"
➡️ Vérifiez que toutes les dépendances sont dans `package.json`

### Erreur : Build échoue
➡️ Vérifiez les logs de build dans Vercel Dashboard

### Erreur : Supabase connection failed
➡️ Vérifiez que les variables d'environnement sont bien configurées dans Vercel

## Prochaines Étapes

Après avoir déployé la version web :
- Testez l'application web sur Vercel
- Pour iOS/Android, utilisez Expo EAS Build

Bon déploiement ! 🚀
