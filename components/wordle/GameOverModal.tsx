import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, RotateCcw, Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameOverModalProps {
  visible: boolean;
  won: boolean;
  attempts: number;
  targetWord: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

function Confetti({ delay, index }: { delay: number; index: number }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  const colors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#A855F7', '#EC4899'];
  const color = colors[index % colors.length];

  useEffect(() => {
    const startX = (Math.random() - 0.5) * SCREEN_WIDTH;
    const endX = startX + (Math.random() - 0.5) * 200;

    translateX.value = startX;
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      delay,
      withTiming(800, {
        duration: 2500,
        easing: Easing.cubic,
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(endX, {
        duration: 2500,
        easing: Easing.out(Easing.ease),
      })
    );
    rotate.value = withDelay(
      delay,
      withTiming(720 + Math.random() * 360, {
        duration: 2500,
        easing: Easing.linear,
      })
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function GameOverModal({
  visible,
  won,
  attempts,
  targetWord,
  onPlayAgain,
  onGoHome,
}: GameOverModalProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(0);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      iconScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.3, { damping: 8 }),
          withSpring(1, { damping: 12 })
        )
      );
    } else {
      scale.value = 0;
      iconScale.value = 0;
    }
  }, [visible]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!visible) return null;

  const confettiCount = won ? 30 : 0;

  return (
    <View style={styles.overlay}>
      {won &&
        Array.from({ length: confettiCount }).map((_, i) => (
          <Confetti key={i} delay={i * 30} index={i} />
        ))}

      <Animated.View style={[styles.modal, modalStyle]}>
        <LinearGradient
          colors={
            won
              ? ['#10B981', '#059669']
              : [theme.colors.error, '#DC2626']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.modalGradient}
        >
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            {won ? (
              <Trophy size={64} color="#FFFFFF" />
            ) : (
              <Text style={styles.sadEmoji}>😔</Text>
            )}
          </Animated.View>

          <Text style={styles.title}>
            {won ? 'Congratulations!' : 'Game Over'}
          </Text>

          <View style={styles.statsContainer}>
            {won ? (
              <>
                <Text style={styles.statsLabel}>You Won!</Text>
                <Text style={styles.attemptsText}>
                  {attempts} {attempts === 1 ? 'Attempt' : 'Attempts'}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.statsLabel}>The word was:</Text>
                <Text style={styles.wordText}>{targetWord}</Text>
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.playAgainButton]}
              onPress={onPlayAgain}
              activeOpacity={0.8}
            >
              <RotateCcw size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.homeButton]}
              onPress={onGoHome}
              activeOpacity={0.8}
            >
              <Home size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Menu</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
    top: -100,
  },
  modal: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sadEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statsLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  attemptsText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wordText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  playAgainButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
