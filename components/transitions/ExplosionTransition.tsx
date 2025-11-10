import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ExplosionTransitionProps {
  visible: boolean;
  onAnimationComplete?: () => void;
  colors?: string[];
}

const PIECE_SIZE = 70;
const PIECES_PER_ROW = 6;
const PIECES_PER_COL = 10;

function ExplosionPiece({
  index,
  visible,
  colors,
}: {
  index: number;
  visible: boolean;
  colors: string[];
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const row = Math.floor(index / PIECES_PER_ROW);
  const col = index % PIECES_PER_ROW;

  useEffect(() => {
    if (visible) {
      const delay = index * 15;
      const explodeDistance = 1.5;

      const centerX = (SCREEN_WIDTH / 2) - ((col * PIECE_SIZE) + PIECE_SIZE / 2);
      const centerY = (SCREEN_HEIGHT / 2) - ((row * PIECE_SIZE) + PIECE_SIZE / 2);

      const explodeX = -centerX * explodeDistance + (Math.random() - 0.5) * 100;
      const explodeY = -centerY * explodeDistance + (Math.random() - 0.5) * 100;
      const explodeRotate = (Math.random() - 0.5) * 360;

      translateX.value = withDelay(
        delay,
        withSequence(
          withTiming(explodeX, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
          }),
          withSpring(0, {
            damping: 15,
            stiffness: 90,
          })
        )
      );

      translateY.value = withDelay(
        delay,
        withSequence(
          withTiming(explodeY, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
          }),
          withSpring(0, {
            damping: 15,
            stiffness: 90,
          })
        )
      );

      rotate.value = withDelay(
        delay,
        withSequence(
          withTiming(explodeRotate, {
            duration: 400,
          }),
          withSpring(0, {
            damping: 20,
          })
        )
      );

      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(0.7, {
            duration: 200,
          }),
          withSpring(1, {
            damping: 10,
          })
        )
      );

      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(0.8, { duration: 200 }),
          withTiming(1, { duration: 400 })
        )
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const left = col * PIECE_SIZE + (SCREEN_WIDTH - PIECES_PER_ROW * PIECE_SIZE) / 2;
  const top = row * PIECE_SIZE + (SCREEN_HEIGHT - PIECES_PER_COL * PIECE_SIZE) / 2;
  const colorIndex = (row + col) % colors.length;

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left,
          top,
          width: PIECE_SIZE,
          height: PIECE_SIZE,
          backgroundColor: colors[colorIndex],
        },
        animatedStyle,
      ]}
    />
  );
}

export function ExplosionTransition({
  visible,
  onAnimationComplete,
  colors = ['#F75564', '#FF6B7A', '#FF8E9E', '#FFDEA3', '#FFE9B8'],
}: ExplosionTransitionProps) {
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      const totalPieces = PIECES_PER_ROW * PIECES_PER_COL;
      const explosionDuration = 400;
      const rebuildDuration = 600;
      const totalDuration = totalPieces * 15 + explosionDuration + rebuildDuration;

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
      }, totalDuration);
    }
  }, [visible]);

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
          <ExplosionPiece
            key={index}
            index={index}
            visible={visible}
            colors={colors}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  piecesContainer: {
    flex: 1,
    position: 'relative',
  },
  piece: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
