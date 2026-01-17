import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Menu, User } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'expo-router';
import { cn } from '@/utils/cn';

interface HeaderProps {
  title: string;
  showMenu?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({ title, showMenu = true, rightAction, className }: HeaderProps) {
  const { user } = useUserStore();
  const router = useRouter();

  return (
    <View className={cn('flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200', className)}>
      {showMenu && (
        <Pressable onPress={() => {}} className="p-2 -ml-2">
          <Menu size={24} color="#374151" />
        </Pressable>
      )}
      
      <Text className="flex-1 text-lg font-bold text-gray-900 text-center">
        {title}
      </Text>

      {rightAction || (
        <Pressable
          onPress={() => {}}
          className="p-2 -mr-2"
        >
          <Avatar uri={user?.avatar_url} name={user?.name} size={32} />
        </Pressable>
      )}
    </View>
  );
}
