import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { cn } from '@/utils/cn';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export function Toggle({ value, onValueChange, label, description, className }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className={cn('flex-row items-center justify-between py-3', className)}
    >
      <View className="flex-1 mr-4">
        {label && (
          <Text className="text-base font-medium text-gray-900">
            {label}
          </Text>
        )}
        {description && (
          <Text className="text-sm text-gray-500 mt-1">
            {description}
          </Text>
        )}
      </View>
      <View
        className={cn(
          'w-12 h-7 rounded-full justify-center',
          value ? 'bg-primary-500' : 'bg-gray-300'
        )}
      >
        <View
          className={cn(
            'w-5 h-5 rounded-full bg-white',
            value ? 'ml-auto mr-1' : 'ml-1'
          )}
        />
      </View>
    </Pressable>
  );
}
