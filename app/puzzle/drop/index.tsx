import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { ChevronLeft, Shapes } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ShapeComponents, ShapeType } from '@/components/puzzle/PuzzleShapes';
import { generatePuzzle, PuzzleShape } from '@/lib/puzzleGenerator';

const { width, height } = Dimensions.get('window');
const MACHINE_HEIGHT = 280;
const MACHINE_WIDTH = width - 60;

export default function PuzzleDropScreen() {
  const { theme } = useTheme();
  const [puzzle, setPuzzle] = useState<any>(null);
  const [droppedCount, setDroppedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const newPuzzle = generatePuzzle('easy');
    setPuzzle(newPuzzle);
  }, []);

  const handleShapeDrop = (shapeId: number) => {
    setPuzzle((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        shapes: prev.shapes.map((s: PuzzleShape) =>
          s.id === shapeId ? { ...s, used: true } : s
        ),
      };
    });

    setDroppedCount(prev => {
      const newCount = prev + 1;

      if (newCount === puzzle?.shapes.length) {
        setTimeout(() => {
          setIsComplete(true);
          const timeTaken = Math.floor((Date.now() - startTime) / 1000);
          setTimeout(() => {
            router.replace({
              pathname: '/puzzle/success',
              params: { timeTaken: timeTaken.toString() }
            });
          }, 1000);
        }, 500);
      }

      return newCount;
    });
  };

  const styles = createStyles(theme);

  if (!puzzle) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Preparing shapes...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Drop the Shapes</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Shapes size={32} color={theme.colors.primary} />
          <Text style={[styles.instruction, { color: theme.colors.text }]}>
            Tap each shape to drop it into the machine
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {droppedCount} / {puzzle.shapes.length} shapes
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.secondary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary,
                  width: `${(droppedCount / puzzle.shapes.length) * 100}%`
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.shapesContainer}>
          {puzzle.shapes.map((shape: PuzzleShape) => (
            <AnimatedShape
              key={shape.id}
              shape={shape}
              onDrop={handleShapeDrop}
              theme={theme}
              styles={styles}
            />
          ))}
        </View>

        <View style={[styles.machine, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <View style={[styles.machineSlot, { backgroundColor: theme.colors.secondary }]}>
            <View style={styles.machineGrid}>
              {puzzle.slots.map((slot: any) => {
                const correspondingShape = puzzle.shapes.find((s: PuzzleShape) => s.id === slot.id && s.used);
                const ShapeComponent = ShapeComponents[slot.shapeType];

                return (
                  <View key={slot.id} style={[styles.machineSlotCell, { borderColor: theme.colors.border }]}>
                    {correspondingShape ? (
                      <ShapeComponent size={40} color={correspondingShape.color} />
                    ) : (
                      <ShapeComponent size={35} color="#555" />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {isComplete && (
            <View style={[styles.completeOverlay, { backgroundColor: theme.colors.primary + 'E6' }]}>
              <Text style={styles.completeText}>Complete!</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function AnimatedShape({
  shape,
  onDrop,
  theme,
  styles
}: {
  shape: PuzzleShape;
  onDrop: (id: number) => void;
  theme: any;
  styles: any;
}) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePress = () => {
    if (shape.used) return;

    translateY.value = withSequence(
      withTiming(-20, { duration: 150, easing: Easing.out(Easing.ease) }),
      withTiming(height, {
        duration: 800,
        easing: Easing.in(Easing.cubic)
      }, () => {
        runOnJS(onDrop)(shape.id);
      })
    );

    scale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withTiming(0.8, { duration: 800 })
    );

    opacity.value = withTiming(0, { duration: 800 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${translateY.value * 0.5}deg` }
    ],
    opacity: opacity.value,
  }));

  if (shape.used) {
    return null;
  }

  const ShapeComponent = ShapeComponents[shape.shapeType];

  return (
    <TouchableOpacity onPress={handlePress} style={styles.shapeWrapper}>
      <Animated.View
        style={[
          styles.shapeCard,
          {
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.border,
          },
          animatedStyle
        ]}
      >
        <ShapeComponent size={50} color={shape.color} />
        <View style={[styles.numberBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.numberText}>{shape.number}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 12,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 250,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  shapesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  shapeWrapper: {
    width: 80,
    height: 80,
  },
  shapeCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  numberBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  machine: {
    height: MACHINE_HEIGHT,
    width: MACHINE_WIDTH,
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 3,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineSlot: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  machineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  machineSlotCell: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
