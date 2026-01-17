# 🚀 Quick Start - Configuration Rapide

## Étapes pour démarrer rapidement

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

#### A. Créer un projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et vos clés

#### B. Configurer le fichier `.env`

Le fichier `.env` existe déjà dans le projet. Éditez-le et remplacez les valeurs par défaut:

```env
# Remplacez ces valeurs par vos vraies clés Supabase

EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ici
```

**Où trouver ces valeurs?**
- **EXPO_PUBLIC_SUPABASE_URL**: Settings > API > Project URL
- **EXPO_PUBLIC_SUPABASE_ANON_KEY**: Settings > API > anon public key
- **SUPABASE_SERVICE_ROLE_KEY**: Settings > API > service_role key ⚠️ (ne partagez JAMAIS cette clé)

### 3. Créer les tables dans Supabase

Vous avez 3 options:

#### Option A: Script Simple (Recommandé pour débuter)

```bash
npm run setup:supabase
```

Puis copiez le SQL affiché dans **SQL Editor** de Supabase.

#### Option B: Via SQL Editor (Manuel)

1. Allez dans **SQL Editor** de votre projet Supabase
2. Ouvrez une nouvelle requête
3. Copiez tout le contenu de `supabase/schema.sql`
4. Collez et exécutez

#### Option C: Automatique via PostgreSQL Direct

```bash
# Installer pg si nécessaire
npm install --save-dev pg

# Ajouter DATABASE_URL dans .env
# Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Exécuter
node scripts/setup-supabase-direct.js
```

### 4. Vérifier les tables

Dans Supabase **Table Editor**, vous devriez voir:
- ✅ profiles
- ✅ categories
- ✅ subcategories
- ✅ micro_objectives
- ✅ objective_completions
- ✅ daily_notes
- ✅ animations
- ✅ progress_history

### 5. Démarrer l'application

```bash
npm start
```

Puis choisissez votre plateforme:
- Appuyez sur `i` pour iOS
- Appuyez sur `a` pour Android
- Appuyez sur `w` pour Web

## 📋 Checklist

- [ ] Dépendances installées (`npm install`)
- [ ] Projet Supabase créé
- [ ] Fichier `.env` configuré avec vos clés
- [ ] Tables créées dans Supabase (via un des scripts ou SQL Editor)
- [ ] Tables vérifiées dans Table Editor
- [ ] Application démarrée (`npm start`)

## ⚠️ Important

- **Ne commitez JAMAIS** le fichier `.env` dans Git (déjà dans `.gitignore`)
- **Ne partagez JAMAIS** votre `SUPABASE_SERVICE_ROLE_KEY` publiquement
- Cette clé contourne toutes les règles RLS et a accès complet à votre base

## 🆘 Dépannage

### Erreur: "Variables d'environnement manquantes"
➡️ Vérifiez que `.env` existe et contient vos clés Supabase

### Erreur: "Cannot connect to Supabase"
➡️ Vérifiez vos clés dans `.env`
➡️ Vérifiez que votre projet Supabase est actif

### Tables n'existent pas
➡️ Exécutez `npm run setup:supabase` et copiez le SQL dans SQL Editor
➡️ Ou utilisez `scripts/setup-supabase-direct.js` pour l'exécution automatique

## 📚 Documentation Complète

Pour plus de détails:
- `supabase/setup.md` - Guide complet de configuration Supabase
- `scripts/README.md` - Documentation des scripts de setup
- `README.md` - Documentation générale du projet

## ✨ Prêt!

Une fois tout configuré, vous pouvez:
1. Créer un compte dans l'application
2. Créer votre première catégorie d'objectifs
3. Commencer à suivre vos objectifs!

Bon développement! 🎉
