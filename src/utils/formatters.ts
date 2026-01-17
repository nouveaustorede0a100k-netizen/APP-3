import { format as formatDate, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatCurrency(value: number, unit: string = '$'): string {
  return `${unit}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDate(d, 'EEEE, MMM d', { locale: fr });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDate(d, 'MMM d, yyyy', { locale: fr });
}

export function formatTime(time: string): string {
  // Convert 24h format to 12h format if needed
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}
