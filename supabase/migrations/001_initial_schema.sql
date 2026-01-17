-- Migration 001: Schema initial
-- Ce fichier contient le schéma de base de données complet

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT 'target',
  animation_id INTEGER NOT NULL DEFAULT 1,
  progression_mode TEXT NOT NULL CHECK (progression_mode IN ('cumulative', 'weekly', 'monthly')),
  -- Mode cumulative
  target_value DECIMAL,
  current_value DECIMAL DEFAULT 0,
  target_unit TEXT,
  target_end_date DATE,
  -- Mode weekly
  weekly_target_sessions INTEGER,
  scheduled_days JSONB,
  -- Mode monthly
  monthly_target_value DECIMAL,
  monthly_target_unit TEXT,
  -- Decay
  decay_enabled BOOLEAN DEFAULT false,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table subcategories
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'folder',
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table micro_objectives
CREATE TABLE IF NOT EXISTS public.micro_objectives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  value DECIMAL,
  value_unit TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'once')),
  scheduled_days JSONB,
  scheduled_time TIME,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table objective_completions
CREATE TABLE IF NOT EXISTS public.objective_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  micro_objective_id UUID REFERENCES public.micro_objectives(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  value DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table daily_notes
CREATE TABLE IF NOT EXISTS public.daily_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table animations
CREATE TABLE IF NOT EXISTS public.animations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  category_suggestion TEXT,
  is_premium BOOLEAN DEFAULT false
);

-- Table progress_history
CREATE TABLE IF NOT EXISTS public.progress_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  progress_value DECIMAL NOT NULL,
  cumulative_value DECIMAL,
  regularity_score DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, record_date)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_micro_objectives_subcategory ON public.micro_objectives(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_completions_objective ON public.objective_completions(micro_objective_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON public.objective_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_daily_notes_user_date ON public.daily_notes(user_id, note_date);
CREATE INDEX IF NOT EXISTS idx_progress_history_category ON public.progress_history(category_id, record_date);
