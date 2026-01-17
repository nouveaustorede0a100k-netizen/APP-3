import { colors } from '@/constants/colors';

export function getCategoryColor(categoryName: string): string {
  const normalized = categoryName.toLowerCase();
  
  if (normalized.includes('finance') || normalized.includes('money') || normalized.includes('épargne')) {
    return colors.categories.finance;
  }
  if (normalized.includes('sport') || normalized.includes('fitness') || normalized.includes('gym')) {
    return colors.categories.sport;
  }
  if (normalized.includes('nutrition') || normalized.includes('diet') || normalized.includes('food')) {
    return colors.categories.nutrition;
  }
  if (normalized.includes('lifestyle') || normalized.includes('life')) {
    return colors.categories.lifestyle;
  }
  if (normalized.includes('health') || normalized.includes('santé')) {
    return colors.categories.health;
  }
  if (normalized.includes('education') || normalized.includes('learn') || normalized.includes('étude')) {
    return colors.categories.education;
  }
  
  return colors.primary[500];
}

export function opacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function contrastText(backgroundColor: string): string {
  // Simple contrast calculation - returns 'black' or 'white'
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}
