-- Migration 002: Row Level Security (RLS) Policies

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objective_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_history ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies pour categories
DROP POLICY IF EXISTS "Users can view own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;

CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour subcategories
DROP POLICY IF EXISTS "Users can view own subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Users can create own subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Users can update own subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Users can delete own subcategories" ON public.subcategories;

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
DROP POLICY IF EXISTS "Users can view own micro_objectives" ON public.micro_objectives;
DROP POLICY IF EXISTS "Users can create own micro_objectives" ON public.micro_objectives;
DROP POLICY IF EXISTS "Users can update own micro_objectives" ON public.micro_objectives;
DROP POLICY IF EXISTS "Users can delete own micro_objectives" ON public.micro_objectives;

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
DROP POLICY IF EXISTS "Users can view own completions" ON public.objective_completions;
DROP POLICY IF EXISTS "Users can create own completions" ON public.objective_completions;
DROP POLICY IF EXISTS "Users can delete own completions" ON public.objective_completions;

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
DROP POLICY IF EXISTS "Users can view own notes" ON public.daily_notes;
DROP POLICY IF EXISTS "Users can create own notes" ON public.daily_notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.daily_notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.daily_notes;

CREATE POLICY "Users can view own notes" ON public.daily_notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notes" ON public.daily_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.daily_notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.daily_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour progress_history
DROP POLICY IF EXISTS "Users can view own progress_history" ON public.progress_history;
DROP POLICY IF EXISTS "Users can create own progress_history" ON public.progress_history;

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
