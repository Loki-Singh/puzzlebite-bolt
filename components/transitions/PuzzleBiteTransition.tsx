import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PuzzleBiteTransitionProps {
  visible: boolean;
  onAnimationComplete?: () => void;
  colors?: string[];
}

const LETTER_WIDTH = 40;
const LETTER_HEIGHT = 60;
const PIECE_SIZE = 12;

const PUZZLEBITE_LETTERS = [
  { char: 'P', x: 0 },
  { char: 'u', x: 1 },
  { char: 'z', x: 2 },
  { char: 'z', x: 3 },
  { char: 'l', x: 4 },
  { char: 'e', x: 5 },
  { char: 'B', x: 6.5 },
  { char: 'I', x: 7.5 },
  { char: 'T', x: 8.5 },
  { char: 'E', x: 9.5 },
];

function PuzzlePiece({
  index,
  letterIndex,
  visible,
  colors,
  totalInLetter,
}: {
  index: number;
  letterIndex: number;
  visible: boolean;
  colors: string[];
  totalInLetter: number;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const glowIntensity = useSharedValue(0);

  const letter = PUZZLEBITE_LETTERS[letterIndex];
  const piecesPerLetter = 16;
  const pieceInLetter = index % piecesPerLetter;
  const pieceRow = Math.floor(pieceInLetter / 4);
  const pieceCol = pieceInLetter % 4;

  const finalX = letter.x * (LETTER_WIDTH + 8) + pieceCol * PIECE_SIZE - (10.5 * (LETTER_WIDTH + 8)) / 2;
  const finalY = pieceRow * PIECE_SIZE - (LETTER_HEIGHT / 2);

  useEffect(() => {
    if (visible) {
      const letterDelay = letterIndex * 120;
      const pieceDelay = letterDelay + pieceInLetter * 25;

      const startX = (Math.random() - 0.5) * SCREEN_WIDTH * 1.8;
      const startY = (Math.random() - 0.5) * SCREEN_HEIGHT * 1.8;
      const startRotate = Math.random() * 720 - 360;

      translateX.value = startX;
      translateY.value = startY;
      rotate.value = startRotate;

      opacity.value = withDelay(pieceDelay, withTiming(1, { duration: 100 }));

      translateX.value = withDelay(
        pieceDelay,
        withSpring(finalX, {
          damping: 18,
          stiffness: 100,
          mass: 0.8,
        })
      );

      translateY.value = withDelay(
        pieceDelay,
        withSpring(finalY, {
          damping: 18,
          stiffness: 100,
          mass: 0.8,
        })
      );

      rotate.value = withDelay(
        pieceDelay,
        withSpring(0, {
          damping: 20,
          stiffness: 80,
        })
      );

      scale.value = withDelay(
        pieceDelay,
        withSequence(
          withSpring(1.3, {
            damping: 8,
            stiffness: 200,
          }),
          withSpring(1, {
            damping: 12,
            stiffness: 100,
          })
        )
      );

      glowIntensity.value = withDelay(
        pieceDelay,
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 500 })
        )
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      glowIntensity.value,
      [0, 1],
      [0.3, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
      shadowOpacity,
    };
  });

  const colorIndex = (letterIndex + pieceInLetter) % colors.length;
  const pieceColor = colors[colorIndex];

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          backgroundColor: pieceColor,
        },
        animatedStyle,
      ]}
    />
  );
}

function ParticleTrail({ delay }: { delay: number }) {
  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const startX = Math.random() * SCREEN_WIDTH;

    opacity.value = withDelay(delay, withTiming(0.8, { duration: 200 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration: 1500,
        easing: Easing.linear,
      })
    );

    opacity.value = withDelay(
      delay + 1000,
      withTiming(0, { duration: 500 })
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const colors = ['#F75564', '#FFDEA3', '#FF6B7A', '#FFE9B8'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          left: Math.random() * SCREEN_WIDTH,
        },
        animatedStyle,
      ]}
    />
  );
}

export function PuzzleBiteTransition({
  visible,
  onAnimationComplete,
  colors = ['#F75564', '#FF6B7A', '#FF8E9E', '#FFDEA3', '#FFE9B8'],
}: PuzzleBiteTransitionProps) {
  const containerOpacity = useSharedValue(1);
  const textScale = useSharedValue(1);
  const textGlow = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      const letterAnimationTime = PUZZLEBITE_LETTERS.length * 120 + 16 * 25 + 800;

      textScale.value = withDelay(
        letterAnimationTime,
        withSequence(
          withSpring(1.15, { damping: 8 }),
          withSpring(1, { damping: 10 })
        )
      );

      textGlow.value = withDelay(
        letterAnimationTime,
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.5, { duration: 600 })
        )
      );

      setTimeout(() => {
        containerOpacity.value = withTiming(
          0,
          { duration: 400 },
          (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          }
        );
      }, letterAnimationTime + 1500);
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
  }));

  if (!visible) return null;

  const allPieces: JSX.Element[] = [];
  PUZZLEBITE_LETTERS.forEach((letter, letterIndex) => {
    const piecesPerLetter = 16;
    for (let i = 0; i < piecesPerLetter; i++) {
      allPieces.push(
        <PuzzlePiece
          key={`${letterIndex}-${i}`}
          index={i}
          letterIndex={letterIndex}
          visible={visible}
          colors={colors}
          totalInLetter={piecesPerLetter}
        />
      );
    }
  });

  const particleCount = 30;
  const particles = Array.from({ length: particleCount }, (_, i) => (
    <ParticleTrail key={`particle-${i}`} delay={i * 80} />
  ));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={containerStyle}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.95)', 'rgba(0, 0, 0, 0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {particles}

        <Animated.View style={[styles.textContainer, textContainerStyle]}>
          {allPieces}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  textContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - LETTER_HEIGHT / 2,
    left: SCREEN_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  piece: {
    position: 'absolute',
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 5,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: -50,
  },
});
