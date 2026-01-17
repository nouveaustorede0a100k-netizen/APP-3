import React, { useEffect } from 'react';
import { View, ScrollView, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Toggle } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';
import { useSettingsStore } from '@/stores/settingsStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import { Eye, Sparkles, Medal, Star } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();
  const { user, logout } = useUserStore();
  const {
    showProgressLabels,
    enableAnimations,
    levelSystemEnabled,
    particleEffectsEnabled,
    toggleProgressLabels,
    toggleAnimations,
    toggleLevelSystem,
    toggleParticleEffects,
  } = useSettingsStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Settings" />
      
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Display Preferences */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-primary-500 uppercase text-sm font-bold mb-4">
            Display Preferences
          </Text>
          
          <Toggle
            value={showProgressLabels}
            onValueChange={toggleProgressLabels}
            label="Show Progress Labels"
          />
          
          <Toggle
            value={enableAnimations}
            onValueChange={toggleAnimations}
            label="Enable Animations"
          />
        </Card>

        {/* Category Evolution */}
        {categories.map(category => (
          <Card key={category.id} variant="elevated" className="mb-4">
            <Text className="uppercase text-sm font-bold mb-4" style={{ color: category.color }}>
              {category.name.toUpperCase()} EVOLUTION
            </Text>
            
            <Text className="text-gray-600 mb-2">Icon Variant</Text>
            
            {/* Animation selection placeholder */}
            <View className="p-3 bg-gray-100 rounded-lg">
              <Text className="text-gray-700">Animation: {category.animation_id}</Text>
            </View>
          </Card>
        ))}

        {/* Gamification */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-primary-500 uppercase text-sm font-bold mb-4">
            Gamification
          </Text>
          
          <Toggle
            value={levelSystemEnabled}
            onValueChange={toggleLevelSystem}
            label="Level System"
            description="Unlock tiers based on points"
          />
          
          <Toggle
            value={particleEffectsEnabled}
            onValueChange={toggleParticleEffects}
            label="Particle Effects"
            description="Sparkles on goal completion"
          />
        </Card>

        {/* Account */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-primary-500 uppercase text-sm font-bold mb-4">
            Account
          </Text>
          
          <Pressable className="py-3 border-b border-gray-200">
            <Text className="text-base text-gray-900">Profile</Text>
          </Pressable>
          
          <Pressable className="py-3 border-b border-gray-200">
            <Text className="text-base text-gray-900">Notifications</Text>
          </Pressable>
          
          <Pressable className="py-3 border-b border-gray-200">
            <Text className="text-base text-gray-900">Export Data</Text>
          </Pressable>
          
          <Pressable onPress={handleLogout} className="py-3">
            <Text className="text-base text-red-500">Logout</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}
