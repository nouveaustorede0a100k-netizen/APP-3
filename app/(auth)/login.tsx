import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/services/supabase';
import { useUserStore } from '@/stores/userStore';
import { Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { fetchUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        await fetchUser();
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1" contentContainerClassName="flex-grow justify-center px-6 py-12">
        <Card variant="elevated" className="mb-4">
          <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Connexion
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Connectez-vous à votre compte
          </Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            icon={Mail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            icon={Lock}
            secureTextEntry
          />

          <Button
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password}
            className="mt-4"
          >
            Se connecter
          </Button>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Pas de compte ? </Text>
            <Text
              onPress={() => router.push('/(auth)/register')}
              className="text-primary-500 font-semibold"
            >
              S'inscrire
            </Text>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
