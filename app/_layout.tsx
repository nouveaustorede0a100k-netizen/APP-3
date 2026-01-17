import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import '../src/global.css';

export default function RootLayout() {
  const { checkSession } = useUserStore();

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="create-category" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
