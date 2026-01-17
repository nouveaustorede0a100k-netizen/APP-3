import React from 'react';
import { Pressable, Text, View, Alert } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { SubCategory } from '@/types';
import { cn } from '@/utils/cn';
import { opacity } from '@/utils/colors';

interface SubCategoryPillProps {
  subCategory: SubCategory;
  active?: boolean;
  color?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
}

export function SubCategoryPill({
  subCategory,
  active = false,
  color,
  onPress,
  onLongPress,
  className,
}: SubCategoryPillProps) {
  const pillColor = color || subCategory.color || '#3B82F6';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress || (() => {
        Alert.alert(
          subCategory.name,
          'Que voulez-vous faire ?',
          [
            { text: 'Éditer', onPress: () => {} },
            { text: 'Supprimer', style: 'destructive', onPress: () => {} },
            { text: 'Annuler', style: 'cancel' },
          ]
        );
      })}
      className={cn(
        'flex-row items-center px-4 py-2 rounded-full mr-2',
        active && 'border-2',
        className
      )}
      style={active ? { borderColor: pillColor } : { borderWidth: 1, borderColor: '#E5E7EB' }}
    >
      <Text
        className={cn('font-medium text-sm', active && 'font-semibold')}
        style={{ color: active ? pillColor : '#4B5563' }}
      >
        {subCategory.name}
      </Text>
    </Pressable>
  );
}
