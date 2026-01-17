# Application de Suivi d'Objectifs

Application React Native/Expo pour le suivi d'objectifs personnels avec animations dynamiques Lottie.

## Stack Technique

- **Framework**: React Native + Expo SDK 50+
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Animations**: Lottie (lottie-react-native)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Local Storage**: AsyncStorage

## Installation

1. Installer les dépendances:
```bash
npm install
```

2. Configurer Supabase:
- Créer un projet Supabase
- Exécuter le script SQL dans `supabase/schema.sql` dans le SQL Editor de Supabase
- Créer un fichier `.env` avec vos clés Supabase:
```
EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

3. Démarrer l'application:
```bash
npm start
```

## Structure du Projet

- `/app` - Écrans (Expo Router)
- `/src/components` - Composants réutilisables
- `/src/stores` - Stores Zustand
- `/src/services` - Services (Supabase, calculs)
- `/src/hooks` - Custom hooks
- `/src/utils` - Utilitaires
- `/src/constants` - Constantes
- `/src/types` - Types TypeScript

## Configuration Supabase

Exécutez le script SQL fourni dans `supabase/schema.sql` dans votre projet Supabase pour créer toutes les tables nécessaires avec Row Level Security (RLS) activé.

## Notes

- Les animations Lottie sont actuellement en placeholder. Ajoutez les fichiers `.json` dans `/src/assets/animations/` pour les vraies animations.
- L'application nécessite une connexion Supabase pour fonctionner complètement.
# APP-3
