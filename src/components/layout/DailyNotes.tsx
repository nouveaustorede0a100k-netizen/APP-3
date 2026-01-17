import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Plus, SlidersHorizontal } from 'lucide-react-native';
import { DailyNote } from '@/types';
import { FAB } from '@/components/ui/FAB';
import { cn } from '@/utils/cn';

interface DailyNotesProps {
  notes: DailyNote[];
  categoryId?: string;
  onAddNote: () => void;
  snapPoints?: string[];
}

export function DailyNotes({
  notes,
  categoryId,
  onAddNote,
  snapPoints = ['25%', '50%', '80%'],
}: DailyNotesProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const filteredNotes = useMemo(() => {
    if (categoryId) {
      return notes.filter(n => n.category_id === categoryId);
    }
    return notes.filter(n => !n.category_id);
  }, [notes, categoryId]);

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: '#FAFAF8' }}
        handleIndicatorStyle={{ backgroundColor: '#D0D0D0' }}
        enablePanDownToClose={false}
      >
        <View className="px-5 pt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">Daily Notes</Text>
            <Pressable onPress={() => {}}>
              <SlidersHorizontal size={18} color="#888" />
            </Pressable>
          </View>

          {/* Vertical line style */}
          <View className="absolute left-4 top-12 bottom-0 w-0.5 bg-blue-200" />

          <BottomSheetScrollView>
            {filteredNotes.map((note) => (
              <View key={note.id} className="flex-row py-2 ml-4">
                <Text className="text-gray-400 mr-2">-</Text>
                <Text className="text-gray-700 flex-1">{note.content}</Text>
              </View>
            ))}
            {filteredNotes.length === 0 && (
              <Text className="text-gray-400 text-center py-4 ml-4">
                Aucune note pour aujourd'hui
              </Text>
            )}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>

      <FAB onPress={onAddNote} icon={Plus} />
    </>
  );
}
