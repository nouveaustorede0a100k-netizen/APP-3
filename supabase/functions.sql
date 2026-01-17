-- Functions utilitaires pour le backend

-- Function pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour categories
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function pour calculer la progression cumulative
CREATE OR REPLACE FUNCTION calculate_cumulative_progress(
    p_category_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
    v_target_value DECIMAL;
    v_current_value DECIMAL;
    v_progress DECIMAL;
BEGIN
    SELECT target_value, current_value
    INTO v_target_value, v_current_value
    FROM public.categories
    WHERE id = p_category_id;

    IF v_target_value IS NULL OR v_target_value = 0 THEN
        RETURN 0;
    END IF;

    v_progress := LEAST(1.0, (v_current_value / v_target_value));
    RETURN v_progress;
END;
$$ LANGUAGE plpgsql;

-- Function pour calculer la progression hebdomadaire
CREATE OR REPLACE FUNCTION calculate_weekly_progress(
    p_category_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
    v_scheduled_days JSONB;
    v_completions_count INTEGER;
    v_expected_count INTEGER;
    v_progress DECIMAL;
    v_start_of_week DATE;
    v_today DATE;
BEGIN
    SELECT scheduled_days INTO v_scheduled_days
    FROM public.categories
    WHERE id = p_category_id;

    v_today := CURRENT_DATE;
    v_start_of_week := DATE_TRUNC('week', v_today)::DATE;

    -- Compter les complétions cette semaine
    SELECT COUNT(*) INTO v_completions_count
    FROM public.objective_completions oc
    JOIN public.micro_objectives mo ON mo.id = oc.micro_objective_id
    JOIN public.subcategories sc ON sc.id = mo.subcategory_id
    WHERE sc.category_id = p_category_id
    AND DATE(oc.completed_at) >= v_start_of_week
    AND DATE(oc.completed_at) <= v_today;

    -- Calculer le nombre attendu (simplifié - devrait utiliser v_scheduled_days)
    v_expected_count := 3; -- Placeholder

    IF v_expected_count = 0 THEN
        RETURN 0;
    END IF;

    v_progress := LEAST(1.0, (v_completions_count::DECIMAL / v_expected_count));
    RETURN v_progress;
END;
$$ LANGUAGE plpgsql;

-- Function pour calculer la régularité sur 7 jours
CREATE OR REPLACE FUNCTION calculate_regularity_score(
    p_category_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
    v_scheduled_days JSONB;
    v_completions_count INTEGER;
    v_expected_count INTEGER;
    v_regularity DECIMAL;
    v_date_start DATE;
BEGIN
    v_date_start := CURRENT_DATE - INTERVAL '7 days';

    SELECT scheduled_days INTO v_scheduled_days
    FROM public.categories
    WHERE id = p_category_id;

    -- Compter les complétions sur les 7 derniers jours
    SELECT COUNT(DISTINCT DATE(oc.completed_at)) INTO v_completions_count
    FROM public.objective_completions oc
    JOIN public.micro_objectives mo ON mo.id = oc.micro_objective_id
    JOIN public.subcategories sc ON sc.id = mo.subcategory_id
    WHERE sc.category_id = p_category_id
    AND DATE(oc.completed_at) >= v_date_start
    AND DATE(oc.completed_at) <= CURRENT_DATE;

    -- Calculer le nombre attendu (simplifié)
    v_expected_count := 7; -- Placeholder

    IF v_expected_count = 0 THEN
        RETURN 1.0;
    END IF;

    v_regularity := LEAST(1.0, (v_completions_count::DECIMAL / v_expected_count));
    RETURN v_regularity;
END;
$$ LANGUAGE plpgsql;

-- Function pour enregistrer l'historique de progression
CREATE OR REPLACE FUNCTION record_progress_history()
RETURNS TRIGGER AS $$
DECLARE
    v_progress DECIMAL;
    v_regularity DECIMAL;
BEGIN
    -- Calculer la progression selon le mode
    IF (SELECT progression_mode FROM public.categories WHERE id = NEW.category_id) = 'cumulative' THEN
        v_progress := calculate_cumulative_progress(NEW.category_id);
    ELSIF (SELECT progression_mode FROM public.categories WHERE id = NEW.category_id) = 'weekly' THEN
        v_progress := calculate_weekly_progress(NEW.category_id);
    ELSE
        v_progress := 0;
    END IF;

    -- Calculer la régularité si decay est activé
    IF (SELECT decay_enabled FROM public.categories WHERE id = NEW.category_id) THEN
        v_regularity := calculate_regularity_score(NEW.category_id);
    ELSE
        v_regularity := NULL;
    END IF;

    -- Insérer ou mettre à jour l'historique
    INSERT INTO public.progress_history (
        category_id,
        record_date,
        progress_value,
        cumulative_value,
        regularity_score
    ) VALUES (
        NEW.category_id,
        CURRENT_DATE,
        v_progress,
        (SELECT current_value FROM public.categories WHERE id = NEW.category_id),
        v_regularity
    )
    ON CONFLICT (category_id, record_date)
    DO UPDATE SET
        progress_value = EXCLUDED.progress_value,
        cumulative_value = EXCLUDED.cumulative_value,
        regularity_score = EXCLUDED.regularity_score;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour enregistrer l'historique après chaque complétion
CREATE TRIGGER record_progress_after_completion
AFTER INSERT ON public.objective_completions
FOR EACH ROW
EXECUTE FUNCTION record_progress_history();

-- Function pour obtenir les statistiques d'une catégorie
CREATE OR REPLACE FUNCTION get_category_stats(
    p_category_id UUID
)
RETURNS TABLE (
    total_objectives INTEGER,
    completed_today INTEGER,
    completed_this_week INTEGER,
    progress DECIMAL,
    regularity_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT mo.id)::INTEGER as total_objectives,
        COUNT(DISTINCT CASE WHEN DATE(oc.completed_at) = CURRENT_DATE THEN oc.id END)::INTEGER as completed_today,
        COUNT(DISTINCT CASE WHEN DATE(oc.completed_at) >= DATE_TRUNC('week', CURRENT_DATE)::DATE THEN oc.id END)::INTEGER as completed_this_week,
        COALESCE((SELECT calculate_cumulative_progress(p_category_id)), 0) as progress,
        COALESCE((SELECT calculate_regularity_score(p_category_id)), 1.0) as regularity_score
    FROM public.micro_objectives mo
    JOIN public.subcategories sc ON sc.id = mo.subcategory_id
    LEFT JOIN public.objective_completions oc ON oc.micro_objective_id = mo.id
    WHERE sc.category_id = p_category_id
    AND mo.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, settings)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        '{"showProgressLabels": true, "enableAnimations": true, "levelSystemEnabled": false, "particleEffectsEnabled": false}'::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer un profil lors de l'inscription
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
