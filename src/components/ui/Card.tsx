import React from 'react';
import { View } from 'react-native';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined';
  className?: string;
  style?: any;
}

export function Card({ children, variant = 'elevated', className, style }: CardProps) {
  const variantStyles = {
    elevated: 'bg-white shadow-sm',
    outlined: 'bg-white border border-gray-200',
  };

  return (
    <View
      className={cn(
        'rounded-xl p-4',
        variantStyles[variant],
        className
      )}
      style={style}
    >
      {children}
    </View>
  );
}
