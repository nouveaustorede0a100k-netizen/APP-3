import React from 'react';
import { View, Text } from 'react-native';
import { DynamicAnimation } from '@/components/animations/DynamicAnimation';
import { Category } from '@/types';
import { calculateProgress } from '@/services/progressCalculator';
import { applyDecay } from '@/services/decayCalculator';
import { useObjectiveStore } from '@/stores/objectiveStore';
import { formatPercentage } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface AnimationViewerProps {
  category: Category;
  className?: string;
}

export function AnimationViewer({ category, className }: AnimationViewerProps) {
  const { completions } = useObjectiveStore();
  
  // Calculate raw progress
  const categoryCompletions = completions.filter(c => {
    // Filter completions for this category's micro-objectives
    return category.subcategories?.some(sub => 
      sub.micro_objectives?.some(obj => obj.id === c.micro_objective_id)
    );
  });

  const rawProgress = calculateProgress({
    mode: category.progression_mode,
    category,
    completions: categoryCompletions,
  });

  // Apply decay if enabled
  const finalProgress = applyDecay(rawProgress, category, categoryCompletions);

  // Get animation name from animation_id
  const animation = category.animation_id ? { asset_name: `animation-${category.animation_id}` } : { asset_name: 'placeholder' };

  // Status text based on category type
  const statusText = category.progression_mode === 'cumulative' ? 'SAVED' : 'COMPLETE';

  return (
    <View className={cn('items-center justify-center py-8', className)}>
      <DynamicAnimation
        animationName={animation.asset_name}
        progress={finalProgress}
        size={200}
      />
      
      <View className="mt-4 items-center">
        <Text className="text-4xl font-bold text-gray-900">
          {formatPercentage(finalProgress)}
        </Text>
        <Text className="text-lg font-semibold text-gray-600 mt-1">
          {statusText}
        </Text>
      </View>
    </View>
  );
}
