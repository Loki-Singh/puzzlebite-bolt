import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  withRepeat,
} from 'react-native-reanimated';
import { MascotType, MascotAnimation } from '@/lib/mascotTypes';
import { getMascotSVG } from './MascotSVGs';
import {
  generateRandomTarget,
  calculateDirection,
  hasReachedTarget,
  getInitialPosition,
  getRandomWalkDuration,
  getRandomIdleDuration,
  Position,
} from '@/lib/mascotBehavior';

interface AnimatedMascotProps {
  mascotType: MascotType;
  animation?: MascotAnimation;
  onAnimationComplete?: () => void;
}

const MASCOT_SIZE = 80;

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  mascotType,
  animation = 'idle',
  onAnimationComplete,
}) => {
  const MascotSVG = getMascotSVG(mascotType);

  const translateX = useSharedValue(getInitialPosition().x);
  const translateY = useSharedValue(getInitialPosition().y);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [currentAnimation, setCurrentAnimation] = useState<MascotAnimation>(animation);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [targetPosition, setTargetPosition] = useState<Position>(getInitialPosition());
  const [isWalking, setIsWalking] = useState(false);
  const walkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (animation !== 'idle' && animation !== 'walk') {
      setCurrentAnimation(animation);
      triggerReactionAnimation(animation);
    }
  }, [animation]);

  useEffect(() => {
    if (currentAnimation === 'idle' || currentAnimation === 'walk') {
      startRandomWalking();
    }

    return () => {
      if (walkTimerRef.current) clearTimeout(walkTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const startRandomWalking = () => {
    const scheduleNextAction = () => {
      if (isWalking) {
        idleTimerRef.current = setTimeout(() => {
          setIsWalking(false);
          setCurrentAnimation('idle');
          scheduleNextAction();
        }, getRandomIdleDuration());
      } else {
        const newTarget = generateRandomTarget({
          x: translateX.value,
          y: translateY.value,
        });
        setTargetPosition(newTarget);
        const newDirection = calculateDirection(
          { x: translateX.value, y: translateY.value },
          newTarget
        );
        setDirection(newDirection);
        setIsWalking(true);
        setCurrentAnimation('walk');

        walkToTarget(newTarget);

        walkTimerRef.current = setTimeout(() => {
          scheduleNextAction();
        }, getRandomWalkDuration());
      }
    };

    scheduleNextAction();
  };

  const walkToTarget = (target: Position) => {
    const duration = 2000;
    translateX.value = withTiming(target.x, {
      duration,
      easing: Easing.linear,
    });
    translateY.value = withTiming(target.y, {
      duration,
      easing: Easing.linear,
    });
  };

  const triggerReactionAnimation = (reactionType: MascotAnimation) => {
    switch (reactionType) {
      case 'win':
        scale.value = withSequence(
          withSpring(1.3, { damping: 2 }),
          withSpring(1.1, { damping: 2 }),
          withSpring(1, { damping: 3 })
        );
        translateY.value = withSequence(
          withSpring(translateY.value - 50, { damping: 3 }),
          withSpring(translateY.value, { damping: 3 })
        );
        rotation.value = withSequence(
          withTiming(-15, { duration: 100 }),
          withTiming(15, { duration: 100 }),
          withTiming(-15, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
        setTimeout(() => {
          setCurrentAnimation('idle');
          onAnimationComplete?.();
        }, 1500);
        break;

      case 'lose':
        scale.value = withSequence(
          withTiming(0.8, { duration: 200 }),
          withSpring(1, { damping: 3 })
        );
        rotation.value = withSequence(
          withTiming(-10, { duration: 150 }),
          withTiming(0, { duration: 150 })
        );
        opacity.value = withSequence(
          withTiming(0.5, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
        setTimeout(() => {
          setCurrentAnimation('idle');
          onAnimationComplete?.();
        }, 1500);
        break;

      case 'tap_screen':
        translateY.value = withRepeat(
          withSequence(
            withTiming(translateY.value - 10, { duration: 300 }),
            withTiming(translateY.value, { duration: 300 })
          ),
          3,
          false
        );
        scale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 300 }),
            withTiming(1, { duration: 300 })
          ),
          3,
          false
        );
        setTimeout(() => {
          setCurrentAnimation('idle');
          onAnimationComplete?.();
        }, 2000);
        break;

      default:
        break;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotation.value}deg` },
        { scaleX: direction === 'left' ? -1 : 1 },
      ],
      opacity: opacity.value,
    };
  });

  const walkingBounce = useAnimatedStyle(() => {
    if (currentAnimation === 'walk') {
      return {
        transform: [
          {
            translateY: withRepeat(
              withSequence(
                withTiming(-5, { duration: 200 }),
                withTiming(0, { duration: 200 })
              ),
              -1,
              false
            ),
          },
        ],
      };
    }
    return {};
  });

  return (
    <Animated.View style={[styles.mascotContainer, animatedStyle]}>
      <Animated.View style={walkingBounce}>
        <MascotSVG size={MASCOT_SIZE} animation={currentAnimation} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mascotContainer: {
    position: 'absolute',
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    zIndex: 1000,
  },
});
