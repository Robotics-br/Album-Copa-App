import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

interface StarExplosionProps {
  trigger: number;
  colors: string[];
  radius?: number;
}

const STAR_COUNT = 8;

const ExplosionParticle = ({
  index,
  total,
  color,
  trigger,
  radius,
}: {
  index: number;
  total: number;
  color: string;
  trigger: number;
  radius: number;
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      progress.value = 0;
      progress.value = withSequence(
        withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 })
      );
    }
  }, [trigger, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const angle = (index * 2 * Math.PI) / total;
    const distance = progress.value * radius;

    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;

    const scale = progress.value === 0 ? 0 : 1 - progress.value * 0.5;
    const opacity = progress.value === 0 ? 0 : 1 - progress.value;

    return {
      opacity,
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${progress.value * 180}deg` },
      ],
    };
  });

  return (
    <Animated.Text
      style={[
        {
          color,
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        animatedStyle,
      ]}
      className="absolute text-[16px]">
      ★
    </Animated.Text>
  );
};

export function StarExplosion({ trigger, colors, radius = 120 }: StarExplosionProps) {
  if (trigger === 0) return null;

  return (
    <View className="absolute inset-0 z-10 items-center justify-center" pointerEvents="none">
      {Array.from({ length: STAR_COUNT }).map((_, i) => (
        <ExplosionParticle
          key={`star-${i}`}
          index={i}
          total={STAR_COUNT}
          color={colors[i % colors.length]}
          trigger={trigger}
          radius={radius}
        />
      ))}
    </View>
  );
}
