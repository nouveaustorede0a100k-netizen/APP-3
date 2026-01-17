import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';
// Using simple button selection instead of Picker

export default function CreateCategoryStep2() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name: string; color: string; icon: string }>();
  const [progressionMode, setProgressionMode] = useState<'cumulative' | 'weekly' | 'monthly'>('cumulative');
  const [decayEnabled, setDecayEnabled] = useState(false);
  
  // Cumulative fields
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('$');
  const [targetEndDate, setTargetEndDate] = useState('');
  
  // Weekly fields
  const [weeklyTargetSessions, setWeeklyTargetSessions] = useState('');
  const [scheduledDays, setScheduledDays] = useState<string[]>([]);
  
  // Monthly fields
  const [monthlyTargetValue, setMonthlyTargetValue] = useState('');
  const [monthlyTargetUnit, setMonthlyTargetUnit] = useState('$');

  const handleNext = () => {
    router.push({
      pathname: '/create-category/step3',
      params: {
        ...params,
        progressionMode,
        decayEnabled: decayEnabled.toString(),
        ...(progressionMode === 'cumulative' && {
          targetValue,
          targetUnit,
          targetEndDate,
        }),
        ...(progressionMode === 'weekly' && {
          weeklyTargetSessions,
          scheduledDays: scheduledDays.join(','),
        }),
        ...(progressionMode === 'monthly' && {
          monthlyTargetValue,
          monthlyTargetUnit,
        }),
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Objectif principal" showMenu={false} />
      
      <ScrollView className="flex-1 px-4 pt-6">
        <Card variant="elevated" className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Mode de progression
          </Text>
          <View className="flex-row">
            <Pressable
              onPress={() => setProgressionMode('cumulative')}
              className={`flex-1 p-3 rounded-lg mr-2 ${progressionMode === 'cumulative' ? 'bg-primary-500' : 'bg-gray-100'}`}
            >
              <Text className={`text-center font-medium ${progressionMode === 'cumulative' ? 'text-white' : 'text-gray-700'}`}>
                Cumulative
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setProgressionMode('weekly')}
              className={`flex-1 p-3 rounded-lg mx-1 ${progressionMode === 'weekly' ? 'bg-primary-500' : 'bg-gray-100'}`}
            >
              <Text className={`text-center font-medium ${progressionMode === 'weekly' ? 'text-white' : 'text-gray-700'}`}>
                Hebdomadaire
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setProgressionMode('monthly')}
              className={`flex-1 p-3 rounded-lg ml-2 ${progressionMode === 'monthly' ? 'bg-primary-500' : 'bg-gray-100'}`}
            >
              <Text className={`text-center font-medium ${progressionMode === 'monthly' ? 'text-white' : 'text-gray-700'}`}>
                Mensuel
              </Text>
            </Pressable>
          </View>
        </Card>

        {progressionMode === 'cumulative' && (
          <>
            <Input
              label="Valeur cible"
              value={targetValue}
              onChangeText={setTargetValue}
              placeholder="10000"
              keyboardType="numeric"
            />
            <Input
              label="Unité"
              value={targetUnit}
              onChangeText={setTargetUnit}
              placeholder="$"
            />
            <Input
              label="Date de fin"
              value={targetEndDate}
              onChangeText={setTargetEndDate}
              placeholder="2024-12-31"
            />
          </>
        )}

        {progressionMode === 'weekly' && (
          <>
            <Input
              label="Sessions par semaine"
              value={weeklyTargetSessions}
              onChangeText={setWeeklyTargetSessions}
              placeholder="3"
              keyboardType="numeric"
            />
            <Text className="text-sm text-gray-600 mb-2">
              Jours prévus: (à implémenter)
            </Text>
          </>
        )}

        {progressionMode === 'monthly' && (
          <>
            <Input
              label="Valeur mensuelle cible"
              value={monthlyTargetValue}
              onChangeText={setMonthlyTargetValue}
              placeholder="1000"
              keyboardType="numeric"
            />
            <Input
              label="Unité"
              value={monthlyTargetUnit}
              onChangeText={setMonthlyTargetUnit}
              placeholder="$"
            />
          </>
        )}

        <Toggle
          value={decayEnabled}
          onValueChange={setDecayEnabled}
          label="Activer le déclin (Decay)"
          description="La progression diminue si vous manquez des objectifs"
        />

        <View className="flex-row justify-between mt-6 mb-6">
          <Button
            variant="outline"
            onPress={() => router.back()}
            className="flex-1 mr-2"
          >
            Précédent
          </Button>
          <Button
            onPress={handleNext}
            className="flex-1 ml-2"
          >
            Suivant
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
