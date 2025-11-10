import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EmojiBurstTransitionProps {
  visible: boolean;
  onAnimationComplete?: () => void;
  emojis?: string[];
  count?: number;
  duration?: number;
}

function EmojiParticle({
  emoji,
  delay,
  duration,
}: {
  emoji: string;
  delay: number;
  duration: number;
}) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const startX = (Math.random() - 0.5) * SCREEN_WIDTH;
    const endX = startX + (Math.random() - 0.5) * 300;
    const rotationAmount = 360 + Math.random() * 720;

    translateX.value = startX;

    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 200 })
    );

    scale.value = withDelay(
      delay,
      withTiming(1 + Math.random() * 0.5, {
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
      })
    );

    translateY.value = withDelay(
      delay,
      withTiming(900, {
        duration: duration,
        easing: Easing.in(Easing.cubic),
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming(endX, {
        duration: duration,
        easing: Easing.out(Easing.ease),
      })
    );

    rotate.value = withDelay(
      delay,
      withTiming(rotationAmount, {
        duration: duration,
        easing: Easing.linear,
      })
    );

    opacity.value = withDelay(
      delay + duration - 500,
      withTiming(0, { duration: 500 })
    );
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.emojiParticle, animatedStyle]}>
      <Text style={styles.emojiText}>{emoji}</Text>
    </Animated.View>
  );
}

export function EmojiBurstTransition({
  visible,
  onAnimationComplete,
  emojis = ['🧩', '🎯', '⭐', '🎉', '✨', '💫', '🏆', '🎊'],
  count = 40,
  duration = 2500,
}: EmojiBurstTransitionProps) {
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      const totalDuration = count * 25 + duration;

      setTimeout(() => {
        containerOpacity.value = withTiming(
          0,
          { duration: 300 },
          (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      }, totalDuration - 500);
    }
  }, [visible, count, duration]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={containerStyle}>
        {Array.from({ length: count }).map((_, i) => (
          <EmojiParticle
            key={i}
            emoji={emojis[i % emojis.length]}
            delay={i * 25}
            duration={duration}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  emojiParticle: {
    position: 'absolute',
    top: -100,
  },
  emojiText: {
    fontSize: 32,
  },
});
