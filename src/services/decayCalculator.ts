import { Category, ObjectiveCompletion } from '@/types';
import { getLast7Days, isSameDay } from '@/utils/dates';

export function applyDecay(
  rawProgress: number,
  category: Category,
  completions: ObjectiveCompletion[]
): number {
  if (!category.decay_enabled) return rawProgress;
  
  const regularityScore = calculateRegularity(category, completions);
  
  // Formule: decay_multiplier = 0.7 + (0.3 × regularity)
  // Si 100% régularité → multiplier = 1.0
  // Si 0% régularité → multiplier = 0.7
  const decayMultiplier = 0.7 + (0.3 * regularityScore);
  
  return rawProgress * decayMultiplier;
}

function calculateRegularity(
  category: Category,
  completions: ObjectiveCompletion[]
): number {
  const last7Days = getLast7Days();
  const scheduledDays = category.scheduled_days || [];
  
  // Combien d'objectifs étaient prévus sur les 7 derniers jours
  let scheduled = 0;
  last7Days.forEach(day => {
    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (scheduledDays.includes(dayName)) {
      scheduled++;
    }
  });
  
  if (scheduled === 0) return 1; // Pas de prévision = 100% régularité
  
  // Combien ont été complétés
  const completed = completions.filter(c => {
    const completedDate = new Date(c.completed_at);
    return last7Days.some(d => isSameDay(d, completedDate));
  }).length;
  
  return Math.min(1, completed / scheduled);
}
