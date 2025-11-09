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
import { Puzzle, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const PIECE_SIZE = 70;
const MACHINE_HEIGHT = 200;
const MACHINE_WIDTH = width - 80;
const NUM_PIECES = 9;
const GRID_COLS = 3;

interface PuzzlePiece {
  id: number;
  color: string;
  dropped: boolean;
}

export default function PuzzleDropScreen() {
  const { theme } = useTheme();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [droppedCount, setDroppedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const colors = ['#0066FF', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#3B82F6'];
    const initialPieces = Array.from({ length: NUM_PIECES }, (_, i) => ({
      id: i,
      color: colors[i],
      dropped: false,
    }));
    setPieces(initialPieces);
  }, []);

  const handlePieceDrop = (pieceId: number) => {
    setPieces(prev =>
      prev.map(p => (p.id === pieceId ? { ...p, dropped: true } : p))
    );

    setDroppedCount(prev => {
      const newCount = prev + 1;

      if (newCount === NUM_PIECES) {
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Drop the Pieces</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Puzzle size={32} color={theme.colors.primary} />
          <Text style={[styles.instruction, { color: theme.colors.text }]}>
            Tap each puzzle piece to drop it into the machine
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {droppedCount} / {NUM_PIECES} pieces
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.secondary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary,
                  width: `${(droppedCount / NUM_PIECES) * 100}%`
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.piecesContainer}>
          {pieces.map((piece) => (
            <AnimatedPiece
              key={piece.id}
              piece={piece}
              onDrop={handlePieceDrop}
              theme={theme}
            />
          ))}
        </View>

        <View style={[styles.machine, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <View style={[styles.machineSlot, { backgroundColor: theme.colors.secondary }]}>
            <Text style={[styles.machineText, { color: theme.colors.textSecondary }]}>
              Drop Zone
            </Text>
          </View>

          {isComplete && (
            <View style={styles.completeOverlay}>
              <Text style={styles.completeText}>Complete!</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function AnimatedPiece({
  piece,
  onDrop,
  theme
}: {
  piece: PuzzlePiece;
  onDrop: (id: number) => void;
  theme: any;
}) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePress = () => {
    if (piece.dropped) return;

    translateY.value = withSequence(
      withTiming(-20, { duration: 150, easing: Easing.out(Easing.ease) }),
      withTiming(height, {
        duration: 800,
        easing: Easing.in(Easing.cubic)
      }, () => {
        runOnJS(onDrop)(piece.id);
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

  if (piece.dropped) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.pieceWrapper}>
      <Animated.View
        style={[
          styles.piece,
          { backgroundColor: piece.color },
          animatedStyle
        ]}
      >
        <Puzzle size={32} color="#FFFFFF" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
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
  piecesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  pieceWrapper: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
  },
  piece: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  machine: {
    height: MACHINE_HEIGHT,
    width: MACHINE_WIDTH,
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 3,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineSlot: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 102, 255, 0.9)',
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
