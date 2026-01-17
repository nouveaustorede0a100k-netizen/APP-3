import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAnimationsByCategory } from '@/constants/animations';

export default function CreateCategoryStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedAnimationId, setSelectedAnimationId] = useState(1);
  
  // Get animations for category (simplified - use general for now)
  const animations = getAnimationsByCategory('general');

  const handleNext = () => {
    router.push({
      pathname: '/create-category/step4',
      params: {
        ...params,
        animationId: selectedAnimationId.toString(),
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Choix animation" showMenu={false} />
      
      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="text-sm font-medium text-gray-700 mb-4">
          Choisissez une animation pour cette catégorie
        </Text>

        {animations.map(animation => (
          <Card
            key={animation.id}
            variant={selectedAnimationId === animation.id ? 'elevated' : 'outlined'}
            className={`mb-3 ${selectedAnimationId === animation.id ? 'border-2 border-primary-500' : ''}`}
          >
            <Pressable onPress={() => setSelectedAnimationId(animation.id)}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {animation.name}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Type: {animation.type}
                  </Text>
                </View>
                <Button
                  variant="outline"
                  onPress={() => {}}
                  className="ml-4"
                >
                  Preview
                </Button>
              </View>
            </Pressable>
          </Card>
        ))}

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
