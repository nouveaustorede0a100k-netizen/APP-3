# Scripts de Setup Supabase

Ce dossier contient des scripts pour configurer automatiquement votre base de données Supabase.

## Scripts Disponibles

### 1. `setup-supabase.js` (Recommandé pour débuter)

**Usage:**
```bash
npm run setup:supabase
```

**Ou directement:**
```bash
SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/setup-supabase.js
```

Ce script:
- Vérifie votre configuration Supabase
- Prépare le fichier SQL pour copier-coller
- Vous guide pour exécuter le SQL dans SQL Editor

**Avantages:**
- ✅ Pas besoin de package supplémentaire (pg)
- ✅ Simple et sûr
- ✅ Fonctionne toujours même si l'API change

### 2. `setup-supabase-direct.js` (Avancé)

**Usage:**
```bash
DATABASE_URL=postgresql://... node scripts/setup-supabase-direct.js
```

Ce script:
- Se connecte directement à PostgreSQL
- Exécute le SQL automatiquement
- Vérifie que les tables sont créées

**Avantages:**
- ✅ Automatique (pas de copier-coller)
- ✅ Feedback en temps réel
- ✅ Vérification automatique

**Prérequis:**
- Package `pg` installé: `npm install --save-dev pg`
- DATABASE_URL dans `.env` ou variables d'environnement

## Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet:

```env
# Pour setup-supabase.js
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Pour setup-supabase-direct.js (optionnel)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Où trouver ces valeurs?

1. **SUPABASE_URL**: Settings > API > Project URL
2. **SUPABASE_SERVICE_ROLE_KEY**: Settings > API > service_role key (⚠️ Ne jamais exposer publiquement!)
3. **DATABASE_URL**: Settings > Database > Connection string > URI

## Choisir le Bon Script

### Utilisez `setup-supabase.js` si:
- C'est votre première fois
- Vous préférez la simplicité
- Vous voulez voir ce qui se passe dans SQL Editor

### Utilisez `setup-supabase-direct.js` si:
- Vous êtes à l'aise avec PostgreSQL
- Vous voulez l'automatisation complète
- Vous avez déjà `pg` installé

## Troubleshooting

### Erreur: "Variables d'environnement manquantes"
➡️ Créez un fichier `.env` avec les valeurs nécessaires (voir `.env.example`)

### Erreur: "pg n'est pas installé"
➡️ Installez-le: `npm install --save-dev pg`
➡️ Ou utilisez `setup-supabase.js` à la place

### Erreur de connexion à la base de données
➡️ Vérifiez que DATABASE_URL est correct
➡️ Vérifiez que le mot de passe est correctement encodé (évitez les caractères spéciaux non échappés)

### Tables déjà existantes
➡️ C'est normal! Les scripts utilisent `IF NOT EXISTS` et ignorent les erreurs de duplication

## Après l'Exécution

1. Vérifiez dans Supabase **Table Editor** que toutes les tables sont créées
2. Vérifiez dans **Authentication > Policies** que RLS est activé
3. Vérifiez dans **Database > Functions** que les fonctions sont créées
4. Testez l'application!

## Sécurité

⚠️ **IMPORTANT**: Ne commitez JAMAIS:
- `.env` (déjà dans `.gitignore`)
- SUPABASE_SERVICE_ROLE_KEY (même dans `.env`, ne la partagez pas publiquement)

La clé `service_role` contourne toutes les règles RLS et a accès complet à votre base de données.
