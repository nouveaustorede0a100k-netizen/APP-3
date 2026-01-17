import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { User, UserSettings } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  showProgressLabels: true,
  enableAnimations: true,
  levelSystemEnabled: false,
  particleEffectsEnabled: false,
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await get().fetchUser();
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        set({ user: null, loading: false });
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found

      if (profile) {
        set({ 
          user: {
            ...profile,
            email: authUser.email || '',
            settings: profile.settings || defaultSettings,
          },
          loading: false 
        });
      } else {
        // Create profile if doesn't exist
        const newProfile = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.email?.split('@')[0] || 'User',
          settings: defaultSettings,
        };

        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;

        set({ 
          user: {
            ...created,
            email: authUser.email || '',
            settings: created.settings || defaultSettings,
          },
          loading: false 
        });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateUser: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      set({ user: { ...user, ...data } });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    const { user } = get();
    if (!user) return;

    const newSettings = { ...user.settings, ...settings };
    await get().updateUser({ settings: newSettings });
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.clear();
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
