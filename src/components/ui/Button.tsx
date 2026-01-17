import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { cn } from '@/utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: 'bg-primary-500 active:bg-primary-600',
    secondary: 'bg-gray-200 active:bg-gray-300',
    outline: 'bg-transparent border border-gray-300 active:bg-gray-50',
  };

  const textStyles = {
    primary: 'text-white',
    secondary: 'text-gray-800',
    outline: 'text-gray-700',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        'px-6 py-3 rounded-lg items-center justify-center',
        variantStyles[variant],
        isDisabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? 'white' : '#6B7280'} />
      ) : (
        <Text className={cn('font-semibold text-base', textStyles[variant])}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
