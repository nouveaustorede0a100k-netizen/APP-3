import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Category } from '@/types';
import { formatPercentage } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { opacity } from '@/utils/colors';

interface CategoryCardProps {
  category: Category;
  progress?: number;
  onPress?: () => void;
  className?: string;
}

export function CategoryCard({ category, progress = 0, onPress, className }: CategoryCardProps) {
  const backgroundColor = opacity(category.color, 0.1);
  const progressColor = category.color;

  return (
    <Pressable
      onPress={onPress}
      className={cn('p-4 rounded-xl mb-3', className)}
      style={{ backgroundColor }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className="text-lg font-bold mb-1"
            style={{ color: category.color }}
          >
            {category.name}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
              <View
                className="h-2 rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: progressColor,
                }}
              />
            </View>
            <Text className="text-sm font-medium text-gray-600">
              {formatPercentage(progress)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
