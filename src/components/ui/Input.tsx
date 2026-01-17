import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { cn } from '@/utils/cn';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  icon?: LucideIcon;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  className?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  icon: Icon,
  secureTextEntry,
  keyboardType = 'default',
  className,
}: InputProps) {
  return (
    <View className={cn('mb-4', className)}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}
      <View className="relative">
        {Icon && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Icon size={20} color="#9CA3AF" />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          className={cn(
            'border border-gray-300 rounded-lg px-4 py-3 bg-white',
            Icon && 'pl-10',
            error && 'border-red-500',
            'text-base'
          )}
        />
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
