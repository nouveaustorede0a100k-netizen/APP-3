import { Animation } from '@/types';

export const animations: Animation[] = [
  { id: 1, name: 'Piggy Bank', type: 'fill', asset_name: 'piggy-bank', category_suggestion: 'finance', is_premium: false },
  { id: 2, name: 'Safe', type: 'fill', asset_name: 'safe', category_suggestion: 'finance', is_premium: false },
  { id: 3, name: 'Wallet', type: 'fill', asset_name: 'wallet', category_suggestion: 'finance', is_premium: false },
  { id: 4, name: 'Biceps', type: 'grow', asset_name: 'biceps', category_suggestion: 'sport', is_premium: false },
  { id: 5, name: 'Runner', type: 'speed', asset_name: 'runner', category_suggestion: 'sport', is_premium: false },
  { id: 6, name: 'Flame', type: 'intensity', asset_name: 'flame', category_suggestion: 'sport', is_premium: false },
  { id: 7, name: 'Plant', type: 'grow', asset_name: 'plant', category_suggestion: 'lifestyle', is_premium: false },
  { id: 8, name: 'Water Glass', type: 'fill', asset_name: 'water-glass', category_suggestion: 'nutrition', is_premium: false },
  { id: 9, name: 'Heart', type: 'pulse', asset_name: 'heart', category_suggestion: 'health', is_premium: false },
  { id: 10, name: 'Book Stack', type: 'stack', asset_name: 'book-stack', category_suggestion: 'education', is_premium: false },
  { id: 11, name: 'Trophy', type: 'reveal', asset_name: 'trophy', category_suggestion: 'general', is_premium: false },
  { id: 12, name: 'Mountain', type: 'climb', asset_name: 'mountain', category_suggestion: 'general', is_premium: false },
];

export function getAnimationsByCategory(categorySuggestion: string): Animation[] {
  return animations.filter(anim => 
    anim.category_suggestion === categorySuggestion || anim.category_suggestion === 'general'
  );
}

export function getAnimationById(id: number): Animation | undefined {
  return animations.find(anim => anim.id === id);
}
