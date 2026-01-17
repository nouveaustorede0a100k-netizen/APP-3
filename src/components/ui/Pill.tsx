import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { cn } from '@/utils/cn';

interface PillProps {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  color?: string;
  onPress?: () => void;
  className?: string;
}

export function Pill({ label, icon: Icon, active = false, color, onPress, className }: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center px-4 py-2 rounded-full',
        active 
          ? 'bg-primary-500' 
          : 'bg-gray-100 border border-gray-200',
        className
      )}
      style={active && color ? { backgroundColor: color } : undefined}
    >
      {Icon && (
        <Icon 
          size={16} 
          color={active ? 'white' : '#4B5563'} 
          className="mr-2"
        />
      )}
      <Text className={cn(
        'font-medium text-sm',
        active ? 'text-white' : 'text-gray-700'
      )}>
        {label}
      </Text>
    </Pressable>
  );
}
