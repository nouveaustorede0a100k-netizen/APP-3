import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay as dateFnsIsSameDay, addDays, subDays, format } from 'date-fns';

export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
}

export function getEndOfWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 }); // Monday
}

export function getStartOfMonth(date: Date): Date {
  return startOfMonth(date);
}

export function getEndOfMonth(date: Date): Date {
  return endOfMonth(date);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return dateFnsIsSameDay(date1, date2);
}

export function countScheduledDaysBetween(start: Date, end: Date, scheduledDays: string[]): number {
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayName = format(current, 'EEEE').toLowerCase();
    if (scheduledDays.includes(dayName)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

export function countScheduledDaysIn(dates: Date[], scheduledDays: string[]): number {
  return dates.filter(date => {
    const dayName = format(date, 'EEEE').toLowerCase();
    return scheduledDays.includes(dayName);
  }).length;
}

export function getLast7Days(): Date[] {
  const today = new Date();
  const days: Date[] = [];
  
  for (let i = 6; i >= 0; i--) {
    days.push(subDays(today, i));
  }
  
  return days;
}

export function getDaysBetween(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}
