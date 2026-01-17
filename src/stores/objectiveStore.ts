import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { MicroObjective, ObjectiveCompletion } from '@/types';

interface ObjectiveState {
  completions: ObjectiveCompletion[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCompletions: (microObjectiveId: string) => Promise<void>;
  completeObjective: (microObjectiveId: string, value?: number, notes?: string) => Promise<void>;
  uncompleteObjective: (completionId: string) => Promise<void>;
  getCompletionForToday: (microObjectiveId: string) => ObjectiveCompletion | undefined;
}

export const useObjectiveStore = create<ObjectiveState>((set, get) => ({
  completions: [],
  loading: false,
  error: null,

  fetchCompletions: async (microObjectiveId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('objective_completions')
        .select('*')
        .eq('micro_objective_id', microObjectiveId)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      
      set(state => ({
        completions: [
          ...state.completions.filter(c => c.micro_objective_id !== microObjectiveId),
          ...(data || []),
        ],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  completeObjective: async (microObjectiveId: string, value?: number, notes?: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('objective_completions')
        .insert({
          micro_objective_id: microObjectiveId,
          value,
          notes,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;

      set(state => ({
        completions: [data, ...state.completions],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  uncompleteObjective: async (completionId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('objective_completions')
        .delete()
        .eq('id', completionId);
      
      if (error) throw error;

      set(state => ({
        completions: state.completions.filter(c => c.id !== completionId),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getCompletionForToday: (microObjectiveId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return get().completions.find(c => {
      if (c.micro_objective_id !== microObjectiveId) return false;
      const completedDate = new Date(c.completed_at);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  },
}));
