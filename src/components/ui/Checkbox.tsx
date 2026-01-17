import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '@/utils/cn';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onToggle, label, className }: CheckboxProps) {
  return (
    <Pressable
      onPress={onToggle}
      className={cn('flex-row items-center', className)}
    >
      <View
        className={cn(
          'w-6 h-6 rounded-lg border-2 items-center justify-center mr-3',
          checked ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
        )}
      >
        {checked && <Check size={16} color="white" />}
      </View>
      {label && (
        <Text className={cn('text-base flex-1', checked && 'line-through text-gray-400')}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
