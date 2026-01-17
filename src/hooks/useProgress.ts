import { useMemo } from 'react';
import { Category, ObjectiveCompletion } from '@/types';
import { calculateProgress } from '@/services/progressCalculator';
import { applyDecay } from '@/services/decayCalculator';

export function useProgress(category: Category | null, completions: ObjectiveCompletion[]) {
  return useMemo(() => {
    if (!category) return 0;

    const rawProgress = calculateProgress({
      mode: category.progression_mode,
      category,
      completions,
    });

    return applyDecay(rawProgress, category, completions);
  }, [category, completions]);
}
