
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

-- Table animations (données statiques)
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

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objective_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_history ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies pour categories
CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour subcategories
CREATE POLICY "Users can view own subcategories" ON public.subcategories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.categories
      WHERE categories.id = subcategories.category_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create own subcategories" ON public.subcategories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.categories
      WHERE categories.id = subcategories.category_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update own subcategories" ON public.subcategories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.categories
      WHERE categories.id = subcategories.category_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own subcategories" ON public.subcategories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.categories
      WHERE categories.id = subcategories.category_id
      AND categories.user_id = auth.uid()
    )
  );

-- Policies pour micro_objectives
CREATE POLICY "Users can view own micro_objectives" ON public.micro_objectives
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subcategories
      JOIN public.categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = micro_objectives.subcategory_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create own micro_objectives" ON public.micro_objectives
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subcategories
      JOIN public.categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = micro_objectives.subcategory_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update own micro_objectives" ON public.micro_objectives
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.subcategories
      JOIN public.categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = micro_objectives.subcategory_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own micro_objectives" ON public.micro_objectives
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.subcategories
      JOIN public.categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = micro_objectives.subcategory_id
      AND categories.user_id = auth.uid()
    )
  );

-- Policies pour objective_completions
CREATE POLICY "Users can view own completions" ON public.objective_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.micro_objectives
      JOIN public.subcategories ON subcategories.id = micro_objectives.subcategory_id
      JOIN public.categories ON categories.id = subcategories.category_id
      WHERE micro_objectives.id = objective_completions.micro_objective_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create own completions" ON public.objective_completions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.micro_objectives
      JOIN public.subcategories ON subcategories.id = micro_objectives.subcategory_id
      JOIN public.categories ON categories.id = subcategories.category_id
      WHERE micro_objectives.id = objective_completions.micro_objective_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own completions" ON public.objective_completions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.micro_objectives
      JOIN public.subcategories ON subcategories.id = micro_objectives.subcategory_id
      JOIN public.categories ON categories.id = subcategories.category_id
      WHERE micro_objectives.id = objective_completions.micro_objective_id
      AND categories.user_id = auth.uid()
    )
  );

-- Policies pour daily_notes
CREATE POLICY "Users can view own notes" ON public.daily_notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notes" ON public.daily_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.daily_notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.daily_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour progress_history
CREATE POLICY "Users can view own progress_history" ON public.progress_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.categories
      WHERE categories.id = progress_history.category_id
      AND categories.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create own progress_history" ON public.progress_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.categories
      WHERE categories.id = progress_history.category_id
      AND categories.user_id = auth.uid()
    )
  );

-- Données initiales animations
INSERT INTO public.animations (id, name, type, asset_name, category_suggestion, is_premium) VALUES
(1, 'Piggy Bank', 'fill', 'piggy-bank', 'finance', false),
(2, 'Safe', 'fill', 'safe', 'finance', false),
(3, 'Wallet', 'fill', 'wallet', 'finance', false),
(4, 'Biceps', 'grow', 'biceps', 'sport', false),
(5, 'Runner', 'speed', 'runner', 'sport', false),
(6, 'Flame', 'intensity', 'flame', 'sport', false),
(7, 'Plant', 'grow', 'plant', 'lifestyle', false),
(8, 'Water Glass', 'fill', 'water-glass', 'nutrition', false),
(9, 'Heart', 'pulse', 'heart', 'health', false),
(10, 'Book Stack', 'stack', 'book-stack', 'education', false),
(11, 'Trophy', 'reveal', 'trophy', 'general', false),
(12, 'Mountain', 'climb', 'mountain', 'general', false)
ON CONFLICT (id) DO NOTHING;
