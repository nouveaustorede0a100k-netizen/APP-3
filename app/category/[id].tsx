import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { AnimationViewer } from '@/components/features/AnimationViewer';
import { SubCategoryPill } from '@/components/features/SubCategoryPill';
import { MicroObjectiveItem } from '@/components/features/MicroObjectiveItem';
import { DailyNotes } from '@/components/layout/DailyNotes';
import { useCategory } from '@/hooks/useCategory';
import { useObjectives } from '@/hooks/useObjectives';
import { useNotes } from '@/hooks/useNotes';
import { formatCurrency } from '@/utils/formatters';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { category, loading } = useCategory(id || '');
  const { notes, addNote } = useNotes({ categoryId: id });
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  // Get micro-objectives for active subcategory or all
  const microObjectives = useMemo(() => {
    if (!category?.subcategories) return [];
    
    if (activeSubCategory) {
      const sub = category.subcategories.find(s => s.id === activeSubCategory);
      return sub?.micro_objectives || [];
    }
    
    // Return all micro-objectives from all subcategories
    return category.subcategories.flatMap(sub => sub.micro_objectives || []);
  }, [category, activeSubCategory]);

  const { toggleCompletion, getCompletionForToday } = useObjectives(microObjectives);

  if (loading || !category) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title={category.name} />
      
      {/* Color bar on left */}
      <View 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: category.color }}
      />

      <ScrollView className="flex-1" style={{ marginLeft: 4 }}>
        {/* Animation Viewer */}
        <AnimationViewer category={category} />

        {/* Main Goal */}
        <View className="px-4 mb-4">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            {category.name}
          </Text>
          {category.progression_mode === 'cumulative' && (
            <Text className="text-lg text-gray-600">
              {formatCurrency(category.current_value || 0)} / {formatCurrency(category.target_value || 0)}
            </Text>
          )}
        </View>

        {/* Sub-categories Pills */}
        {category.subcategories && category.subcategories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 mb-4"
          >
            {category.subcategories.map(sub => (
              <SubCategoryPill
                key={sub.id}
                subCategory={sub}
                active={activeSubCategory === sub.id}
                color={category.color}
                onPress={() => setActiveSubCategory(activeSubCategory === sub.id ? null : sub.id)}
              />
            ))}
          </ScrollView>
        )}

        {/* Daily Goals */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-bold text-gray-700 uppercase mb-3">
            Daily {category.name.toUpperCase()} Goals
          </Text>
          
          <View className="bg-white rounded-xl p-4">
            {microObjectives.length === 0 ? (
              <Text className="text-gray-400 text-center py-4">
                Aucun objectif pour cette sous-catégorie
              </Text>
            ) : (
              microObjectives.map(obj => (
                <MicroObjectiveItem
                  key={obj.id}
                  objective={obj}
                  completion={getCompletionForToday(obj.id)}
                  onToggle={() => toggleCompletion(obj.id)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <DailyNotes notes={notes} categoryId={id} onAddNote={() => {}} />
    </View>
  );
}
