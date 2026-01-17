import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

interface TimelineItem {
  time: Date;
  component: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  // Sort items by time
  const sortedItems = [...items].sort((a, b) => 
    a.time.getTime() - b.time.getTime()
  );

  return (
    <ScrollView className={cn('flex-1', className)}>
      {sortedItems.map((item, index) => {
        const itemTime = item.time.getHours() * 60 + item.time.getMinutes();
        const isPast = itemTime < currentTime;
        const isCurrent = Math.abs(itemTime - currentTime) <= 30; // Within 30 minutes

        return (
          <View key={index} className="flex-row mb-4">
            {/* Time marker */}
            <View className="items-center mr-4">
              <Text className="text-sm font-medium text-gray-600">
                {format(item.time, 'HH:mm')}
              </Text>
              {isCurrent && (
                <View className="w-2 h-2 rounded-full bg-primary-500 mt-1" />
              )}
              {!isCurrent && !isPast && (
                <View className="w-2 h-2 rounded-full bg-gray-300 mt-1" />
              )}
              {index < sortedItems.length - 1 && (
                <View className="w-0.5 bg-gray-200 flex-1 min-h-[60px] mt-2" />
              )}
            </View>

            {/* Content */}
            <View className="flex-1">
              {item.component}
            </View>
          </View>
        );
      })}
      
      {/* Empty state for rest of day */}
      {sortedItems.length === 0 && (
        <View className="items-center justify-center py-8">
          <Text className="text-gray-400 text-center">
            Aucun objectif prévu aujourd'hui
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
