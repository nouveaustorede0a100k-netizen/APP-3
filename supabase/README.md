# Backend Supabase - Documentation

Ce dossier contient tous les fichiers nécessaires pour configurer le backend Supabase.

## Structure des Fichiers

```
supabase/
├── schema.sql              # Script SQL complet (tout en un)
├── functions.sql           # Fonctions et triggers supplémentaires
├── seed.sql                # Données initiales (animations)
├── setup.md                # Guide de configuration détaillé
├── README.md               # Ce fichier
└── migrations/
    ├── 001_initial_schema.sql          # Tables et index
    ├── 002_row_level_security.sql      # RLS et policies
    └── 003_functions_and_triggers.sql  # Functions et triggers
```

## Installation Rapide

1. **Créer un projet Supabase** sur [https://supabase.com](https://supabase.com)

2. **Exécuter les migrations** dans l'ordre (via SQL Editor) :
   - `001_initial_schema.sql`
   - `002_row_level_security.sql`
   - `003_functions_and_triggers.sql`
   - `seed.sql`

3. **Récupérer les clés API** dans Settings > API

4. **Configurer `.env`** avec vos clés Supabase

5. **Tester** l'application

📖 **Pour plus de détails**, consultez [setup.md](./setup.md)

## Alternative : Script Complet

Si vous préférez exécuter tout d'un coup, utilisez `schema.sql` qui contient :
- Toutes les tables
- Tous les index
- Toutes les policies RLS
- Les fonctions et triggers de base
- Les données initiales

⚠️ **Note** : `schema.sql` ne contient pas toutes les fonctions avancées de `functions.sql`

## Fichiers par Usage

### Pour un nouveau projet

Utilisez `schema.sql` ou les migrations dans l'ordre (001, 002, 003).

### Pour ajouter des fonctionnalités

- Fonctions avancées : `functions.sql`
- Données initiales supplémentaires : `seed.sql`

### Pour comprendre la configuration

Lisez `setup.md` pour un guide complet.
