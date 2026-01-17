import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { useCategoryStore } from '@/stores/categoryStore';
import { CreateCategoryInput } from '@/types';

export default function CreateCategoryStep4() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { createCategory } = useCategoryStore();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    try {
      const categoryData: CreateCategoryInput = {
        name: params.name || '',
        color: params.color || '#3B82F6',
        icon: params.icon || 'target',
        animation_id: parseInt(params.animationId || '1'),
        progression_mode: (params.progressionMode as any) || 'cumulative',
        decay_enabled: params.decayEnabled === 'true',
        
        // Cumulative
        ...(params.progressionMode === 'cumulative' && {
          target_value: params.targetValue ? parseFloat(params.targetValue) : undefined,
          target_unit: params.targetUnit,
          target_end_date: params.targetEndDate,
        }),
        
        // Weekly
        ...(params.progressionMode === 'weekly' && {
          weekly_target_sessions: params.weeklyTargetSessions ? parseInt(params.weeklyTargetSessions) : undefined,
          scheduled_days: params.scheduledDays ? params.scheduledDays.split(',') : undefined,
        }),
        
        // Monthly
        ...(params.progressionMode === 'monthly' && {
          monthly_target_value: params.monthlyTargetValue ? parseFloat(params.monthlyTargetValue) : undefined,
          monthly_target_unit: params.monthlyTargetUnit,
        }),
      };

      const newCategory = await createCategory(categoryData);
      router.replace(`/category/${newCategory.id}`);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Paramètres avancés" showMenu={false} />
      
      <ScrollView className="flex-1 px-4 pt-6">
        <View className="mb-6">
          <Text className="text-sm text-gray-600">
            Les sous-catégories peuvent être ajoutées plus tard depuis la page de la catégorie.
          </Text>
        </View>

        <View className="flex-row justify-between mt-6 mb-6">
          <Button
            variant="outline"
            onPress={() => router.back()}
            className="flex-1 mr-2"
          >
            Précédent
          </Button>
          <Button
            onPress={handleCreate}
            loading={loading}
            className="flex-1 ml-2"
          >
            Créer
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
