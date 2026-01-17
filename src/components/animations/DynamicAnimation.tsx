import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

interface DynamicAnimationProps {
  animationName: string;
  progress: number; // 0 à 1
  size?: number;
  className?: string;
}

// Placeholder component when animation is missing
function PlaceholderAnimation({ size, progress }: { size: number; progress: number }) {
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center bg-gray-100 rounded-2xl"
    >
      <View
        className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-b-2xl"
        style={{
          height: `${progress * 100}%`,
          opacity: 0.7,
        }}
      />
      <Text className="text-2xl font-bold text-primary-600 mt-4">
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

export function DynamicAnimation({
  animationName,
  progress,
  size = 200,
  className,
}: DynamicAnimationProps) {
  const animationProgress = useSharedValue(0);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    progress: animationProgress.value,
  }));

  // Try to load animation, fallback to placeholder if not found
  let animationSource;
  try {
    // This will be a placeholder for now - real animations should be in assets/animations/
    animationSource = require('@/assets/animations/placeholder.json');
  } catch (error) {
    // Animation not found, use placeholder component
    return <PlaceholderAnimation size={size} progress={progress} />;
  }

  return (
    <View className={cn('items-center justify-center', className)}>
      <AnimatedLottieView
        ref={animationRef}
        source={animationSource}
        animatedProps={animatedProps}
        style={{ width: size, height: size }}
        autoPlay={false}
        loop={false}
      />
    </View>
  );
}
