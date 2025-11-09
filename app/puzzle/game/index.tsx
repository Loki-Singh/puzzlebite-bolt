import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ShapeComponents, ShapeType } from '@/components/puzzle/PuzzleShapes';
import { generatePuzzle, PuzzleFormation, PuzzleShape, PuzzleSlot } from '@/lib/puzzleGenerator';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence } from 'react-native-reanimated';
import { AnimatedMascot } from '@/components/mascot/AnimatedMascot';
import { useMascot } from '@/hooks/useMascot';
import { MascotAnimation } from '@/lib/mascotTypes';

export default function PuzzleGame() {
  const { theme } = useTheme();
  const { category } = useLocalSearchParams();
  const { mascotType, currentAnimation, triggerAnimation } = useMascot();

  const [puzzle, setPuzzle] = useState<PuzzleFormation | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedShape, setSelectedShape] = useState<PuzzleShape | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(true);
  const [filledSlots, setFilledSlots] = useState<Set<number>>(new Set());
  const [mascotReaction, setMascotReaction] = useState<MascotAnimation>('idle');
  const shakeAnimation = useSharedValue(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    const newPuzzle = generatePuzzle('easy');
    setPuzzle(newPuzzle);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isGameActive && puzzle) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameActive(false);
            router.push('/puzzle/timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGameActive, puzzle]);

  useEffect(() => {
    const checkIdleTime = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity > 10000 && isGameActive) {
        setMascotReaction('tap_screen');
        setTimeout(() => {
          setMascotReaction('idle');
        }, 2000);
      }
    };

    idleTimerRef.current = setInterval(checkIdleTime, 10000);

    return () => {
      setIsGameActive(false);
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };
  }, [isGameActive]);

  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, [selectedShape, currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShapeSelect = (shape: PuzzleShape) => {
    if (!shape.used) {
      setSelectedShape(shape);
    }
  };

  const handleSlotPress = (slot: PuzzleSlot) => {
    if (!selectedShape || slot.filled || !puzzle) return;

    const correctSlotId = puzzle.correctSequence[currentStep];

    if (slot.id === correctSlotId && slot.shapeType === selectedShape.shapeType) {
      setFilledSlots(prev => new Set([...prev, slot.id]));

      setPuzzle(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          slots: prev.slots.map(s =>
            s.id === slot.id ? { ...s, filled: true } : s
          ),
          shapes: prev.shapes.map(sh =>
            sh.id === selectedShape.id ? { ...sh, used: true } : sh
          ),
        };
      });

      setSelectedShape(null);
      setCurrentStep(prev => prev + 1);

      if (currentStep + 1 === puzzle.correctSequence.length) {
        setIsGameActive(false);
        setMascotReaction('win');
        setTimeout(() => {
          const timeTaken = 60 - timeLeft;
          router.push(`/puzzle/success?timeTaken=${timeTaken}`);
        }, 1500);
      }
    } else {
      setMascotReaction('lose');
      shakeAnimation.value = withSequence(
        withSpring(-10, { damping: 2 }),
        withSpring(10, { damping: 2 }),
        withSpring(-10, { damping: 2 }),
        withSpring(0, { damping: 2 })
      );

      setTimeout(() => {
        setIsGameActive(false);
        router.push('/puzzle/failed');
      }, 1500);
    }
  };

  const animatedShakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }],
    };
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!puzzle) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Generating puzzle...
          </Text>
        </View>
      </View>
    );
  }

  const progress = (currentStep / puzzle.correctSequence.length) * 100;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedMascot
        mascotType={mascotType}
        animation={mascotReaction}
        onAnimationComplete={() => setMascotReaction('idle')}
      />

      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Clock size={20} color={theme.colors.error} />
          <Text style={[styles.timerText, { color: theme.colors.error }]}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {currentStep} of {puzzle.correctSequence.length}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.secondary }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.colors.primary }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.instructionText, { color: theme.colors.text }]}>
          Fill the formation by selecting shapes in the correct sequence
        </Text>

        <Animated.View style={[styles.formationContainer, animatedShakeStyle]}>
          <View style={styles.gridContainer}>
            {Array.from({ length: puzzle.rows }).map((_, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {Array.from({ length: puzzle.cols }).map((_, colIndex) => {
                  const slot = puzzle.slots.find(s => s.row === rowIndex && s.col === colIndex);

                  if (!slot) {
                    return <View key={colIndex} style={styles.emptyCell} />;
                  }

                  const ShapeComponent = ShapeComponents[slot.shapeType];
                  const correspondingShape = puzzle.shapes.find(sh => sh.id === slot.id);

                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.slotCell,
                        {
                          backgroundColor: slot.filled ? 'transparent' : theme.colors.secondary,
                          borderColor: slot.id === puzzle.correctSequence[currentStep] && selectedShape
                            ? theme.colors.primary
                            : theme.colors.border,
                          borderWidth: slot.id === puzzle.correctSequence[currentStep] && selectedShape ? 3 : 1,
                        }
                      ]}
                      onPress={() => handleSlotPress(slot)}
                      disabled={slot.filled}
                    >
                      {slot.filled && correspondingShape ? (
                        <ShapeComponent size={60} color={correspondingShape.color} />
                      ) : (
                        <View style={styles.slotPlaceholder}>
                          <ShapeComponent size={50} color="#444" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={[styles.instructionBox, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <Text style={[styles.instructionTitle, { color: theme.colors.primary }]}>Next Step:</Text>
          <Text style={[styles.instructionDetail, { color: theme.colors.text }]}>
            {selectedShape
              ? `Place the ${selectedShape.shapeType} (${selectedShape.number}) in the correct position`
              : 'Select a shape from below'}
          </Text>
        </View>

        <View style={[styles.shapesContainer, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <Text style={[styles.shapesTitle, { color: theme.colors.text }]}>Available Shapes</Text>
          <View style={styles.shapesGrid}>
            {puzzle.shapes.map((shape) => {
              const ShapeComponent = ShapeComponents[shape.shapeType];
              return (
                <TouchableOpacity
                  key={shape.id}
                  style={[
                    styles.shapeButton,
                    {
                      backgroundColor: shape.used ? theme.colors.secondary : theme.colors.background,
                      borderColor: selectedShape?.id === shape.id ? theme.colors.primary : theme.colors.border,
                      borderWidth: selectedShape?.id === shape.id ? 3 : 1,
                      opacity: shape.used ? 0.3 : 1,
                    }
                  ]}
                  onPress={() => handleShapeSelect(shape)}
                  disabled={shape.used}
                >
                  <ShapeComponent size={50} color={shape.color} />
                  <View style={[styles.numberBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.numberText}>{shape.number}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  formationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    gap: 8,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyCell: {
    width: 80,
    height: 80,
  },
  slotCell: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotPlaceholder: {
    opacity: 0.3,
  },
  instructionBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
  shapesContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  shapesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  shapesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  shapeButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  numberBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
