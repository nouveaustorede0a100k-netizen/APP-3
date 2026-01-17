import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { Category, CreateCategoryInput } from '@/types';

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  createCategory: (data: CreateCategoryInput) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateProgress: (id: string, value: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          subcategories (
            *,
            micro_objectives (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ categories: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          subcategories (
            *,
            micro_objectives (*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      set({ currentCategory: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCategory: async (data: CreateCategoryInput) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;

      set(state => ({
        categories: [newCategory, ...state.categories],
        loading: false,
      }));

      return newCategory;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    set({ loading: true, error: null });
    try {
      const { data: updated, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      set(state => ({
        categories: state.categories.map(c => c.id === id ? updated : c),
        currentCategory: state.currentCategory?.id === id ? updated : state.currentCategory,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      set(state => ({
        categories: state.categories.filter(c => c.id !== id),
        currentCategory: state.currentCategory?.id === id ? null : state.currentCategory,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProgress: async (id: string, value: number) => {
    try {
      await get().updateCategory(id, { current_value: value });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
