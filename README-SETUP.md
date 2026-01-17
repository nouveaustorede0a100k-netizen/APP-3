# Guide Rapide - Setup Supabase

## 🚀 Méthode Rapide (Recommandée)

### Étape 1: Créer votre projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet
3. Attendez que le projet soit prêt (2-3 minutes)

### Étape 2: Exécuter le SQL

**Option A: Via Script (Simple)**

```bash
# Configurer vos clés dans .env
cp .env.example .env
# Éditez .env et ajoutez vos clés Supabase

# Exécuter le script
npm run setup:supabase
```

**Option B: Via SQL Editor (Manuel mais fiable)**

1. Allez dans **SQL Editor** de Supabase
2. Ouvrez une nouvelle requête
3. Copiez tout le contenu de `supabase/schema.sql`
4. Collez dans SQL Editor
5. Cliquez sur "Run"

**Option C: Via Connexion PostgreSQL Directe (Avancé)**

```bash
# Installer pg si nécessaire
npm install --save-dev pg

# Configurer DATABASE_URL dans .env
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Exécuter
node scripts/setup-supabase-direct.js
```

### Étape 3: Vérifier

1. Allez dans **Table Editor**
2. Vérifiez que vous voyez ces tables:
   - ✅ profiles
   - ✅ categories
   - ✅ subcategories
   - ✅ micro_objectives
   - ✅ objective_completions
   - ✅ daily_notes
   - ✅ animations
   - ✅ progress_history

3. Allez dans **Authentication > Policies**
4. Vérifiez que RLS est activé pour toutes les tables

### Étape 4: Configurer l'application

Créez un fichier `.env` à la racine:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

### Étape 5: Lancer l'application

```bash
npm install
npm start
```

## 📚 Documentation Complète

Pour plus de détails, consultez:
- `supabase/setup.md` - Guide complet de configuration
- `scripts/README.md` - Documentation des scripts

## ⚠️ Dépannage

### "Variables d'environnement manquantes"
➡️ Créez un fichier `.env` avec vos clés Supabase (voir `.env.example`)

### "Tables déjà existent"
➡️ C'est normal! Les scripts gèrent ça automatiquement.

### "Erreur de connexion"
➡️ Vérifiez vos clés dans `.env`
➡️ Vérifiez que votre projet Supabase est actif

## 💡 Astuce

Pour tester rapidement:
1. Créez un compte via l'application
2. Vérifiez dans Supabase **Authentication > Users** que l'utilisateur est créé
3. Vérifiez dans **Table Editor > profiles** qu'un profil est créé automatiquement

Bon développement! 🎉
