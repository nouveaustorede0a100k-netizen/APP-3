import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Category } from '@/types';
import { opacity } from '@/utils/colors';
import { cn } from '@/utils/cn';

interface ObjectiveCardProps {
  title: string;
  timeRange: string;
  location?: string;
  category: Category;
  icon?: LucideIcon;
  onPress?: () => void;
  className?: string;
}

export function ObjectiveCard({
  title,
  timeRange,
  location,
  category,
  icon: Icon,
  onPress,
  className,
}: ObjectiveCardProps) {
  const backgroundColor = opacity(category.color, 0.3);

  return (
    <Pressable
      onPress={onPress}
      className={cn('p-4 rounded-3xl mb-3', className)}
      style={{ backgroundColor }}
    >
      {/* Optional topographic pattern overlay */}
      <View className="absolute inset-0 opacity-10 rounded-3xl" />
      
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text
            className="text-lg font-bold mb-1"
            style={{ color: category.color }}
          >
            {title}
          </Text>
          <Text className="text-sm text-gray-600">
            {timeRange}{location ? ` • ${location}` : ''}
          </Text>
        </View>
        {Icon && (
          <Icon
            size={20}
            color={category.color}
          />
        )}
      </View>
    </Pressable>
  );
}
