import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

interface StarExplosionProps {
  trigger: number;
  colors: string[];
}

const STAR_COUNT = 8;
const RADIUS = 120; // How far stars travel

const ExplosionParticle = ({
  index,
  total,
  color,
  trigger,
}: {
  index: number;
  total: number;
  color: string;
  trigger: number;
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      progress.value = 0;
      progress.value = withSequence(
        withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 }) // Reset silently after
      );
    }
  }, [trigger, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    // Math to spread stars radially
    const angle = (index * 2 * Math.PI) / total;
    const distance = progress.value * RADIUS;

    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;

    const scale = progress.value === 0 ? 0 : 1 - progress.value * 0.5; // Shrinks slightly as it travels
    const opacity = progress.value === 0 ? 0 : 1 - progress.value; // Fades out completely by the end

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
        styles.particle,
        { color },
        animatedStyle,
      ]}>
      ★
    </Animated.Text>
  );
};

export function StarExplosion({ trigger, colors }: StarExplosionProps) {
  // If trigger is 0, hide everything to save performance
  if (trigger === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: STAR_COUNT }).map((_, i) => (
        <ExplosionParticle
          key={`${trigger}-${i}`} // Re-mounts safely or animates reliably based on binding pattern
          index={i}
          total={STAR_COUNT}
          color={colors[i % colors.length]}
          trigger={trigger}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
