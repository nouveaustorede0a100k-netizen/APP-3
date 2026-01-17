import { create } from 'zustand';
import { useUserStore } from './userStore';

interface SettingsState {
  // These will sync with userStore
  showProgressLabels: boolean;
  enableAnimations: boolean;
  levelSystemEnabled: boolean;
  particleEffectsEnabled: boolean;
  
  // Actions
  toggleProgressLabels: () => void;
  toggleAnimations: () => void;
  toggleLevelSystem: () => void;
  toggleParticleEffects: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  showProgressLabels: true,
  enableAnimations: true,
  levelSystemEnabled: false,
  particleEffectsEnabled: false,

  toggleProgressLabels: () => {
    const newValue = !get().showProgressLabels;
    set({ showProgressLabels: newValue });
    useUserStore.getState().updateSettings({ showProgressLabels: newValue });
  },

  toggleAnimations: () => {
    const newValue = !get().enableAnimations;
    set({ enableAnimations: newValue });
    useUserStore.getState().updateSettings({ enableAnimations: newValue });
  },

  toggleLevelSystem: () => {
    const newValue = !get().levelSystemEnabled;
    set({ levelSystemEnabled: newValue });
    useUserStore.getState().updateSettings({ levelSystemEnabled: newValue });
  },

  toggleParticleEffects: () => {
    const newValue = !get().particleEffectsEnabled;
    set({ particleEffectsEnabled: newValue });
    useUserStore.getState().updateSettings({ particleEffectsEnabled: newValue });
  },
}));
