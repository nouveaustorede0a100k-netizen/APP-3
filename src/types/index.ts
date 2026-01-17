export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  settings: UserSettings;
  created_at: string;
}

export interface UserSettings {
  showProgressLabels: boolean;
  enableAnimations: boolean;
  levelSystemEnabled: boolean;
  particleEffectsEnabled: boolean;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  animation_id: number;
  progression_mode: 'cumulative' | 'weekly' | 'monthly';
  // Cumulative
  target_value?: number;
  current_value?: number;
  target_unit?: string;
  target_end_date?: string;
  // Weekly
  weekly_target_sessions?: number;
  scheduled_days?: string[];
  // Monthly
  monthly_target_value?: number;
  monthly_target_unit?: string;
  // Decay
  decay_enabled: boolean;
  // Relations
  subcategories?: SubCategory[];
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  icon: string;
  color?: string;
  sort_order: number;
  micro_objectives?: MicroObjective[];
  created_at: string;
}

export interface MicroObjective {
  id: string;
  subcategory_id: string;
  name: string;
  description?: string;
  value?: number;
  value_unit?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  scheduled_days?: string[];
  scheduled_time?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
}

export interface ObjectiveCompletion {
  id: string;
  micro_objective_id: string;
  completed_at: string;
  value?: number;
  notes?: string;
  created_at: string;
}

export interface DailyNote {
  id: string;
  user_id: string;
  category_id?: string;
  subcategory_id?: string;
  content: string;
  note_date: string;
  sort_order: number;
  created_at: string;
}

export interface Animation {
  id: number;
  name: string;
  type: 'fill' | 'grow' | 'shrink' | 'reveal' | 'climb' | 'speed' | 'intensity' | 'pulse' | 'stack';
  asset_name: string;
  category_suggestion: string;
  is_premium: boolean;
}

export interface ProgressHistory {
  id: string;
  category_id: string;
  record_date: string;
  progress_value: number;
  cumulative_value?: number;
  regularity_score?: number;
  created_at: string;
}

export type CreateCategoryInput = Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'subcategories'>;
