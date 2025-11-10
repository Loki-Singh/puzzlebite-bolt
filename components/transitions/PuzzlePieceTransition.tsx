import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PuzzlePieceTransitionProps {
  visible: boolean;
  onAnimationComplete?: () => void;
  type?: 'assemble' | 'scatter';
}

const PIECE_SIZE = 80;
const PIECES_PER_ROW = 5;
const PIECES_PER_COL = 8;

function PuzzlePiece({
  index,
  visible,
  type,
}: {
  index: number;
  visible: boolean;
  type: 'assemble' | 'scatter';
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  const row = Math.floor(index / PIECES_PER_ROW);
  const col = index % PIECES_PER_ROW;

  useEffect(() => {
    if (visible) {
      const delay = index * 30;

      if (type === 'assemble') {
        const randomX = (Math.random() - 0.5) * SCREEN_WIDTH * 2;
        const randomY = (Math.random() - 0.5) * SCREEN_HEIGHT * 2;
        const randomRotate = (Math.random() - 0.5) * 720;

        translateX.value = randomX;
        translateY.value = randomY;
        rotate.value = randomRotate;
        opacity.value = 0;

        translateX.value = withDelay(
          delay,
          withSpring(0, {
            damping: 12,
            stiffness: 80,
          })
        );
        translateY.value = withDelay(
          delay,
          withSpring(0, {
            damping: 12,
            stiffness: 80,
          })
        );
        rotate.value = withDelay(
          delay,
          withSpring(0, {
            damping: 15,
          })
        );
        opacity.value = withDelay(
          delay,
          withTiming(1, {
            duration: 400,
          })
        );
      } else {
        const randomX = (Math.random() - 0.5) * SCREEN_WIDTH * 2;
        const randomY = (Math.random() - 0.5) * SCREEN_HEIGHT * 2;
        const randomRotate = (Math.random() - 0.5) * 720;

        translateX.value = withDelay(
          delay,
          withTiming(randomX, {
            duration: 800,
            easing: Easing.in(Easing.cubic),
          })
        );
        translateY.value = withDelay(
          delay,
          withTiming(randomY, {
            duration: 800,
            easing: Easing.in(Easing.cubic),
          })
        );
        rotate.value = withDelay(
          delay,
          withTiming(randomRotate, {
            duration: 800,
          })
        );
        opacity.value = withDelay(
          delay,
          withTiming(0, {
            duration: 600,
          })
        );
      }
    }
  }, [visible, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const left = col * PIECE_SIZE;
  const top = row * PIECE_SIZE;

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left,
          top,
          width: PIECE_SIZE,
          height: PIECE_SIZE,
        },
        animatedStyle,
      ]}
    />
  );
}

export function PuzzlePieceTransition({
  visible,
  onAnimationComplete,
  type = 'assemble',
}: PuzzlePieceTransitionProps) {
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      const totalPieces = PIECES_PER_ROW * PIECES_PER_COL;
      const totalDuration = totalPieces * 30 + 800;

      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, totalDuration);

      if (type === 'scatter') {
        containerOpacity.value = withDelay(
          totalDuration - 400,
          withTiming(0, { duration: 400 })
        );
      }
    }
  }, [visible, type]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!visible) return null;

  const totalPieces = PIECES_PER_ROW * PIECES_PER_COL;
  const pieces = Array.from({ length: totalPieces }, (_, i) => i);

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.piecesContainer, containerStyle]}>
        {pieces.map((index) => (
          <PuzzlePiece key={index} index={index} visible={visible} type={type} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  piecesContainer: {
    flex: 1,
    position: 'relative',
  },
  piece: {
    position: 'absolute',
    backgroundColor: '#A855F7',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
});
