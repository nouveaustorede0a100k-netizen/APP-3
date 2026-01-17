import React from 'react';
import { View, Text, Image } from 'react-native';
import { User } from 'lucide-react-native';
import { cn } from '@/utils/cn';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function Avatar({ uri, name, size = 40, className }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <View
      className={cn(
        'rounded-full bg-primary-100 items-center justify-center overflow-hidden',
        className
      )}
      style={{ width: size, height: size }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : (
        <Text
          className="text-primary-600 font-semibold"
          style={{ fontSize: size * 0.4 }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
