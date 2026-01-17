import React from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from '@/components/ui/Checkbox';
import { MicroObjective, ObjectiveCompletion } from '@/types';
import { cn } from '@/utils/cn';

interface MicroObjectiveItemProps {
  objective: MicroObjective;
  completion?: ObjectiveCompletion;
  onToggle: () => void;
  className?: string;
}

export function MicroObjectiveItem({
  objective,
  completion,
  onToggle,
  className,
}: MicroObjectiveItemProps) {
  const isCompleted = !!completion;

  return (
    <View className={cn('py-2', className)}>
      <Checkbox
        checked={isCompleted}
        onToggle={onToggle}
        label={objective.name}
      />
      {objective.description && (
        <Text className={cn(
          'text-sm text-gray-500 mt-1 ml-9',
          isCompleted && 'line-through'
        )}>
          {objective.description}
        </Text>
      )}
    </View>
  );
}
