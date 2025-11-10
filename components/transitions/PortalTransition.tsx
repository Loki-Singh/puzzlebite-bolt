import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PortalTransitionProps {
  visible: boolean;
  onAnimationComplete?: () => void;
  duration?: number;
  type?: 'open' | 'close';
}

export function PortalTransition({
  visible,
  onAnimationComplete,
  duration = 800,
  type = 'open',
}: PortalTransitionProps) {
  const scale = useSharedValue(type === 'open' ? 0 : 1);
  const rotation = useSharedValue(type === 'open' ? 180 : 0);
  const opacity = useSharedValue(type === 'open' ? 0 : 1);

  useEffect(() => {
    if (visible) {
      if (type === 'open') {
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 100,
        });
        rotation.value = withTiming(0, {
          duration: duration,
          easing: Easing.out(Easing.cubic),
        });
        opacity.value = withTiming(
          1,
          {
            duration: duration * 0.6,
          },
          (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      } else {
        scale.value = withTiming(0, {
          duration: duration * 0.8,
          easing: Easing.in(Easing.cubic),
        });
        rotation.value = withTiming(180, {
          duration: duration,
          easing: Easing.in(Easing.cubic),
        });
        opacity.value = withTiming(
          0,
          {
            duration: duration * 0.5,
          },
          (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      }
    }
  }, [visible, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { scale: scale.value },
      { rotateY: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!visible && type === 'open') return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.portal, animatedStyle]}>
        <View style={styles.ring1} />
        <View style={styles.ring2} />
        <View style={styles.ring3} />
        <View style={styles.center} />
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
  },
  portal: {
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: SCREEN_WIDTH * 0.75,
    borderWidth: 3,
    borderColor: '#A855F7',
    opacity: 0.3,
  },
  ring2: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: SCREEN_WIDTH * 0.6,
    borderWidth: 3,
    borderColor: '#7C3AED',
    opacity: 0.5,
  },
  ring3: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: SCREEN_WIDTH * 0.45,
    borderWidth: 3,
    borderColor: '#6D28D9',
    opacity: 0.7,
  },
  center: {
    width: '40%',
    height: '40%',
    borderRadius: SCREEN_WIDTH * 0.3,
    backgroundColor: '#5B21B6',
    opacity: 0.9,
  },
});
