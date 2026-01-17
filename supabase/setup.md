# Guide de Configuration Supabase

Ce guide vous explique comment configurer le backend Supabase pour l'application de suivi d'objectifs.

## Prérequis

1. Un compte Supabase (gratuit) : [https://supabase.com](https://supabase.com)
2. Un projet Supabase créé

## Étapes de Configuration

### 1. Créer un nouveau projet Supabase

1. Connectez-vous à [https://app.supabase.com](https://app.supabase.com)
2. Cliquez sur "New Project"
3. Renseignez les informations du projet :
   - **Name** : `goal-tracker-app` (ou autre nom)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
4. Cliquez sur "Create new project"

### 2. Exécuter les migrations SQL

#### Option A : Via l'interface Supabase (Recommandé)

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez et exécutez les fichiers dans l'ordre suivant :

   a. **Migration 001** : `supabase/migrations/001_initial_schema.sql`
      - Crée toutes les tables et index
   
   b. **Migration 002** : `supabase/migrations/002_row_level_security.sql`
      - Active RLS et crée toutes les policies de sécurité
   
   c. **Migration 003** : `supabase/migrations/003_functions_and_triggers.sql`
      - Crée les fonctions et triggers
   
   d. **Seed Data** : `supabase/seed.sql`
      - Insère les animations de base

#### Option B : Via le fichier schema.sql complet

1. Dans **SQL Editor**, ouvrez une nouvelle requête
2. Copiez le contenu de `supabase/schema.sql`
3. Exécutez la requête

### 3. Vérifier la configuration

Après avoir exécuté les migrations, vérifiez que :

1. **Tables créées** : Allez dans **Table Editor** et vérifiez que vous voyez :
   - `profiles`
   - `categories`
   - `subcategories`
   - `micro_objectives`
   - `objective_completions`
   - `daily_notes`
   - `animations`
   - `progress_history`

2. **RLS activé** : Vérifiez dans **Authentication > Policies** que RLS est activé pour toutes les tables

3. **Animations insérées** : Dans **Table Editor > animations**, vous devriez voir 12 animations

### 4. Récupérer les clés API

1. Allez dans **Settings > API**
2. Copiez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : La clé publique `anon` ou `public`

### 5. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

⚠️ **Important** : Ne commitez jamais le fichier `.env` dans Git (il est déjà dans `.gitignore`)

### 6. Tester la connexion

1. Démarrez l'application : `npm start`
2. Testez l'inscription d'un nouvel utilisateur
3. Vérifiez dans Supabase **Authentication > Users** que l'utilisateur est créé
4. Vérifiez dans **Table Editor > profiles** qu'un profil a été créé automatiquement

## Structure de la Base de Données

### Tables Principales

- **profiles** : Profils utilisateurs (lié à auth.users)
- **categories** : Catégories d'objectifs (Finance, Sport, etc.)
- **subcategories** : Sous-catégories dans chaque catégorie
- **micro_objectives** : Objectifs individuels (dans une sous-catégorie)
- **objective_completions** : Historique des complétions
- **daily_notes** : Notes quotidiennes
- **animations** : Liste des animations disponibles
- **progress_history** : Historique de progression par catégorie

### Relations

```
profiles
  └── categories (user_id)
        └── subcategories (category_id)
              └── micro_objectives (subcategory_id)
                    └── objective_completions (micro_objective_id)
        └── progress_history (category_id)
```

## Sécurité (RLS)

Toutes les tables utilisent **Row Level Security (RLS)** pour s'assurer que :

- Les utilisateurs ne peuvent voir que leurs propres données
- Les utilisateurs ne peuvent modifier que leurs propres données
- Les données sont automatiquement filtrées par `auth.uid()`

## Fonctions Utilitaires

Le backend inclut plusieurs fonctions PostgreSQL :

- `update_updated_at_column()` : Met à jour automatiquement `updated_at`
- `handle_new_user()` : Crée un profil automatiquement lors de l'inscription
- `calculate_cumulative_progress()` : Calcule la progression cumulative
- `calculate_weekly_progress()` : Calcule la progression hebdomadaire
- `calculate_regularity_score()` : Calcule le score de régularité
- `get_category_stats()` : Retourne les statistiques d'une catégorie

## Triggers

- **update_categories_updated_at** : Met à jour `updated_at` sur `categories`
- **update_profiles_updated_at** : Met à jour `updated_at` sur `profiles`
- **on_auth_user_created** : Crée un profil lors de l'inscription
- **record_progress_after_completion** : Enregistre l'historique après chaque complétion

## Dépannage

### Problème : Erreur lors de l'exécution des migrations

- Vérifiez que vous exécutez les migrations dans l'ordre
- Vérifiez que l'extension `uuid-ossp` est activée
- Assurez-vous d'avoir les permissions nécessaires

### Problème : RLS bloque mes requêtes

- Vérifiez que l'utilisateur est authentifié : `auth.uid()` doit retourner un ID
- Vérifiez que les policies RLS sont bien créées
- Vérifiez dans les logs Supabase pour voir les erreurs exactes

### Problème : Le profil n'est pas créé automatiquement

- Vérifiez que le trigger `on_auth_user_created` est actif
- Vérifiez la fonction `handle_new_user()` dans **Database > Functions**
- Vérifiez les logs Supabase pour les erreurs

## Ressources

- Documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)
- Documentation RLS : [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)
- SQL Editor : [https://app.supabase.com/project/_/sql](https://app.supabase.com/project/_/sql)
