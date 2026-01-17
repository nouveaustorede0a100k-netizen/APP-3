import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Pill } from '@/components/ui/Pill';
import { Timeline } from '@/components/features/Timeline';
import { ObjectiveCard } from '@/components/features/ObjectiveCard';
import { DailyNotes } from '@/components/layout/DailyNotes';
import { useCategoryStore } from '@/stores/categoryStore';
import { useNotes } from '@/hooks/useNotes';
import { Category, MicroObjective } from '@/types';
import { ForkKnife, User, Dumbbell } from 'lucide-react-native';

export default function DailyScreen() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();
  const { notes, addNote } = useNotes({});
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Get today's objectives
  const todayObjectives = useMemo(() => {
    const allObjectives: Array<{
      time: Date;
      category: Category;
      objective: MicroObjective;
    }> = [];

    categories.forEach(category => {
      category.subcategories?.forEach(sub => {
        sub.micro_objectives?.forEach(obj => {
          if (obj.is_active && obj.scheduled_time) {
            const [hours, minutes] = obj.scheduled_time.split(':').map(Number);
            const time = new Date();
            time.setHours(hours, minutes, 0, 0);
            
            if (!activeCategory || category.id === activeCategory.id) {
              allObjectives.push({ time, category, objective: obj });
            }
          }
        });
      });
    });

    return allObjectives;
  }, [categories, activeCategory]);

  const timelineItems = useMemo(() => {
    return todayObjectives.map((item, index) => ({
      time: item.time,
      component: (
        <ObjectiveCard
          title={item.objective.name}
          timeRange={`${item.time.getHours()}:${String(item.time.getMinutes()).padStart(2, '0')} - ${item.time.getHours() + 1}:${String(item.time.getMinutes()).padStart(2, '0')}`}
          location={item.objective.location}
          category={item.category}
          onPress={() => router.push(`/category/${item.category.id}`)}
        />
      ),
    }));
  }, [todayObjectives, router]);

  const filterCategories = [
    { id: 'nutrition', label: 'Nutrition', icon: ForkKnife },
    { id: 'lifestyle', label: 'Lifestyle', icon: User },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Premium Daily View" />
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3 bg-white border-b border-gray-200"
      >
        {filterCategories.map(filter => {
          const category = categories.find(c => 
            c.name.toLowerCase().includes(filter.id.toLowerCase())
          );
          
          return (
            <Pill
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              active={activeCategory?.id === category?.id}
              color={category?.color}
              onPress={() => {
                if (category) {
                  setActiveCategory(category);
                  router.push(`/category/${category.id}`);
                } else {
                  setActiveCategory(null);
                }
              }}
              className="mr-2"
            />
          );
        })}
      </ScrollView>

      <Timeline items={timelineItems} className="flex-1 px-4 pt-4" />

      <DailyNotes notes={notes} onAddNote={() => {}} />
    </View>
  );
}
