import React from 'react';
import { Pressable, View } from 'react-native';
import { LucideIcon, Plus } from 'lucide-react-native';
import { cn } from '@/utils/cn';

interface FABProps {
  onPress?: () => void;
  icon?: LucideIcon;
  className?: string;
  size?: number;
}

export function FAB({ onPress, icon: Icon, className, size = 56 }: FABProps) {
  const IconComponent = Icon || Plus;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'absolute bottom-5 right-5 w-14 h-14 rounded-2xl bg-primary-500 items-center justify-center shadow-lg active:bg-primary-600',
        className
      )}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <IconComponent size={24} color="white" />
    </Pressable>
  );
}
