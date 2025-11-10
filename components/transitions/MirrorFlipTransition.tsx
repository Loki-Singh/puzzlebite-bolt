import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MirrorFlipTransitionProps {
  visible: boolean;
  onAnimationComplete?: () => void;
  duration?: number;
  colors?: [string, string];
}

export function MirrorFlipTransition({
  visible,
  onAnimationComplete,
  duration = 1000,
  colors = ['#F75564', '#FFDEA3'],
}: MirrorFlipTransitionProps) {
  const rotateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });

      rotateY.value = withSequence(
        withTiming(90, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.cubic),
        }),
        withTiming(180, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.cubic),
        })
      );

      scale.value = withSequence(
        withTiming(1.1, {
          duration: duration / 2,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.in(Easing.cubic),
        })
      );

      setTimeout(() => {
        opacity.value = withTiming(
          0,
          { duration: 300 },
          (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      }, duration);
    }
  }, [visible, duration]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value },
    ],
    opacity: rotateY.value < 90 ? opacity.value : 0,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value - 180}deg` },
      { scale: scale.value },
    ],
    opacity: rotateY.value >= 90 ? opacity.value : 0,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.mirror, frontAnimatedStyle]}>
        <View style={[styles.mirrorSurface, { backgroundColor: colors[0] }]}>
          <View style={styles.glint} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.mirror, styles.backMirror, backAnimatedStyle]}>
        <View style={[styles.mirrorSurface, { backgroundColor: colors[1] }]}>
          <View style={styles.glint} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  mirror: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  backMirror: {
    position: 'absolute',
  },
  mirrorSurface: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glint: {
    position: 'absolute',
    top: '20%',
    left: '30%',
    width: '40%',
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 100,
    transform: [{ rotate: '-45deg' }],
    opacity: 0.6,
  },
});
