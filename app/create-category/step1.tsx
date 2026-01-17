import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { Target } from 'lucide-react-native';

const colorOptions = [
  { name: 'Blue', value: colors.categories.finance },
  { name: 'Orange', value: colors.categories.sport },
  { name: 'Green', value: colors.categories.nutrition },
  { name: 'Purple', value: colors.categories.lifestyle },
  { name: 'Red', value: colors.categories.health },
  { name: 'Amber', value: colors.categories.education },
];

export default function CreateCategoryStep1() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors.categories.finance);
  const [icon, setIcon] = useState('target');

  const handleNext = () => {
    // Store in context or navigation params
    router.push({
      pathname: '/create-category/step2',
      params: {
        name,
        color: selectedColor,
        icon,
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Créer une catégorie" showMenu={false} />
      
      <ScrollView className="flex-1 px-4 pt-6">
        <Input
          label="Nom de la catégorie"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Finance, Sport, Nutrition..."
        />

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Couleur
          </Text>
          <View className="flex-row flex-wrap">
            {colorOptions.map(color => (
              <Pressable
                key={color.value}
                onPress={() => setSelectedColor(color.value)}
                className={`
                  w-12 h-12 rounded-full mr-3 mb-3
                  ${selectedColor === color.value ? 'border-4 border-gray-900' : ''}
                `}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Icône
          </Text>
          <Card variant="outlined">
            <View className="items-center py-4">
              <Target size={48} color={selectedColor} />
              <Text className="text-gray-600 mt-2">Icône: {icon}</Text>
            </View>
          </Card>
        </View>

        <Button
          onPress={handleNext}
          disabled={!name}
          className="mb-6"
        >
          Suivant
        </Button>
      </ScrollView>
    </View>
  );
}
