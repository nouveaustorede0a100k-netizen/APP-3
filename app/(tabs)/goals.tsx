import React, { useEffect, useMemo } from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { CategoryCard } from '@/components/features/CategoryCard';
import { FAB } from '@/components/ui/FAB';
import { useCategoryStore } from '@/stores/categoryStore';
import { calculateProgress } from '@/services/progressCalculator';
import { applyDecay } from '@/services/decayCalculator';
import { useObjectiveStore } from '@/stores/objectiveStore';
import { Plus } from 'lucide-react-native';

export default function GoalsScreen() {
  const router = useRouter();
  const { categories, fetchCategories, loading } = useCategoryStore();
  const { completions } = useObjectiveStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoriesWithProgress = useMemo(() => {
    return categories.map(category => {
      const categoryCompletions = completions.filter(c => {
        return category.subcategories?.some(sub => 
          sub.micro_objectives?.some(obj => obj.id === c.micro_objective_id)
        );
      });

      const rawProgress = calculateProgress({
        mode: category.progression_mode,
        category,
        completions: categoryCompletions,
      });

      const progress = applyDecay(rawProgress, category, categoryCompletions);

      return { category, progress };
    });
  }, [categories, completions]);

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Goals" />
      
      <ScrollView className="flex-1 px-4 pt-4">
        {categories.length === 0 && !loading ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 text-center mb-4">
              Aucune catégorie pour le moment
            </Text>
            <Pressable
              onPress={() => router.push('/create-category/step1')}
              className="bg-primary-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Créer une catégorie</Text>
            </Pressable>
          </View>
        ) : (
          categoriesWithProgress.map(({ category, progress }) => (
            <CategoryCard
              key={category.id}
              category={category}
              progress={progress}
              onPress={() => router.push(`/category/${category.id}`)}
            />
          ))
        )}
      </ScrollView>

      <FAB onPress={() => router.push('/create-category/step1')} icon={Plus} />
    </View>
  );
}
