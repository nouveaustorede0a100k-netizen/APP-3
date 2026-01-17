import { useEffect, useMemo } from 'react';
import { useObjectiveStore } from '@/stores/objectiveStore';
import { MicroObjective } from '@/types';

export function useObjectives(microObjectives: MicroObjective[] = []) {
  const { completions, fetchCompletions, completeObjective, uncompleteObjective, getCompletionForToday } = useObjectiveStore();

  useEffect(() => {
    // Fetch completions for all micro-objectives
    microObjectives.forEach(obj => {
      if (obj.id) {
        fetchCompletions(obj.id);
      }
    });
  }, [microObjectives.map(o => o.id).join(',')]);

  const toggleCompletion = async (objectiveId: string) => {
    const todayCompletion = getCompletionForToday(objectiveId);
    
    if (todayCompletion) {
      await uncompleteObjective(todayCompletion.id);
    } else {
      await completeObjective(objectiveId);
    }
  };

  const stats = useMemo(() => {
    const total = microObjectives.length;
    const completed = microObjectives.filter(obj => {
      return getCompletionForToday(obj.id);
    }).length;

    return {
      total,
      completed,
      progress: total > 0 ? completed / total : 0,
    };
  }, [microObjectives, completions]);

  return {
    completions,
    toggleCompletion,
    stats,
    getCompletionForToday,
  };
}
