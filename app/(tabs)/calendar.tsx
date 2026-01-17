import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { Header } from '@/components/layout/Header';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#3B82F6',
      selectedTextColor: '#FFFFFF',
    },
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title={`${format(new Date(), 'MMMM yyyy', { locale: fr })}`} />
      
      <View className="flex-1 p-4">
        <RNCalendar
          current={selectedDate}
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            todayTextColor: '#3B82F6',
            arrowColor: '#3B82F6',
            selectedDayBackgroundColor: '#3B82F6',
            selectedDayTextColor: '#FFFFFF',
          }}
        />
        
        <View className="mt-6 p-4 bg-white rounded-xl">
          <Text className="text-lg font-bold mb-2">
            {format(new Date(selectedDate), 'EEEE, MMM d', { locale: fr })}
          </Text>
          <Text className="text-gray-600">
            Objectifs du jour
          </Text>
        </View>
      </View>
    </View>
  );
}
