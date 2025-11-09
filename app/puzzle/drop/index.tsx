import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Clock, Target } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ShapeComponents } from '@/components/puzzle/PuzzleShapes';
import { generateSequencePuzzle, GridCell, DisplayShape } from '@/lib/puzzleGenerator';

const { width } = Dimensions.get('window');
const CELL_SIZE = 60;

export default function PuzzleDropScreen() {
  const { theme } = useTheme();
  const [puzzle, setPuzzle] = useState<any>(null);
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewTime, setPreviewTime] = useState(5);

  useEffect(() => {
    const newPuzzle = generateSequencePuzzle('medium');
    setPuzzle(newPuzzle);
    setTimeLeft(newPuzzle.timeLimit);
  }, []);

  useEffect(() => {
    if (showPreview && previewTime > 0) {
      const timer = setTimeout(() => {
        setPreviewTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showPreview && previewTime === 0) {
      setShowPreview(false);
    }
  }, [showPreview, previewTime]);

  useEffect(() => {
    if (!showPreview && timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!showPreview && timeLeft === 0 && !isGameOver) {
      handleGameOver(false);
    }
  }, [timeLeft, showPreview, isGameOver]);

  const handleCellPress = (cell: GridCell) => {
    if (isGameOver || showPreview || cell.isClicked) return;

    const currentDisplayShape = puzzle.displaySequence[currentDisplayIndex];

    if (cell.shapeNumber === currentDisplayShape.shapeNumber) {
      setPuzzle((prev: any) => ({
        ...prev,
        grid: prev.grid.map((c: GridCell) =>
          c.id === cell.id ? { ...c, isClicked: true } : c
        ),
      }));

      const newCorrectClicks = correctClicks + 1;
      setCorrectClicks(newCorrectClicks);

      const totalShapesNeeded = puzzle.grid.filter(
        (c: GridCell) => c.shapeNumber === currentDisplayShape.shapeNumber
      ).length;

      const clickedShapesOfThisType = puzzle.grid.filter(
        (c: GridCell) =>
          c.shapeNumber === currentDisplayShape.shapeNumber &&
          (c.isClicked || c.id === cell.id)
      ).length;

      if (clickedShapesOfThisType >= totalShapesNeeded) {
        if (currentDisplayIndex + 1 >= puzzle.displaySequence.length) {
          handleGameOver(true);
        } else {
          setCurrentDisplayIndex(prev => prev + 1);
        }
      }
    } else {
      handleGameOver(false);
    }
  };

  const handleGameOver = (success: boolean) => {
    setIsGameOver(true);
    setTimeout(() => {
      if (success) {
        router.replace({
          pathname: '/puzzle/success',
          params: { timeTaken: (puzzle.timeLimit - timeLeft).toString() }
        });
      } else {
        router.replace('/puzzle/failed');
      }
    }, 1000);
  };

  const styles = createStyles(theme);

  if (!puzzle) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Preparing puzzle...
          </Text>
        </View>
      </View>
    );
  }

  const currentDisplayShape = puzzle.displaySequence[currentDisplayIndex];
  const totalShapesInDisplay = puzzle.displaySequence.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Shape Matcher</Text>
        <View style={styles.placeholder} />
      </View>

      {showPreview ? (
        <View style={styles.previewContainer}>
          <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
            Match the Shapes!
          </Text>
          <Text style={[styles.previewSubtitle, { color: theme.colors.textSecondary }]}>
            Click shapes in the machine that match the display
          </Text>
          <View style={styles.previewTimerContainer}>
            <Clock size={48} color={theme.colors.primary} />
            <Text style={[styles.previewTimer, { color: theme.colors.primary }]}>
              {previewTime}
            </Text>
          </View>
          <Text style={[styles.previewHint, { color: theme.colors.textSecondary }]}>
            Find all matching shapes before time runs out!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsBar}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Clock size={20} color={theme.colors.primary} />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                {timeLeft}s
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Target size={20} color={theme.colors.success} />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                {currentDisplayIndex + 1} / {totalShapesInDisplay}
              </Text>
            </View>
          </View>

          {currentDisplayShape && (
            <View style={[styles.displayCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Text style={[styles.displayLabel, { color: theme.colors.textSecondary }]}>
                Find and click all shapes like this:
              </Text>
              <View style={styles.displayShapeContainer}>
                {React.createElement(ShapeComponents[currentDisplayShape.shapeType], {
                  size: 100,
                  color: currentDisplayShape.color,
                })}
              </View>
              <Text style={[styles.displayHint, { color: theme.colors.textSecondary }]}>
                {puzzle.grid.filter((c: GridCell) =>
                  c.shapeNumber === currentDisplayShape.shapeNumber && !c.isClicked
                ).length} remaining
              </Text>
            </View>
          )}
        </>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.gridContainer, { opacity: showPreview ? 0.5 : 1 }]}>
          {puzzle.grid.map((cell: GridCell) => {
            const ShapeComponent = ShapeComponents[cell.shapeType];
            const isClicked = cell.isClicked;

            return (
              <TouchableOpacity
                key={cell.id}
                onPress={() => handleCellPress(cell)}
                disabled={isClicked || showPreview}
                style={[
                  styles.gridCell,
                  {
                    backgroundColor: isClicked
                      ? theme.colors.border
                      : theme.colors.cardBackground,
                    borderColor: isClicked ? theme.colors.border : theme.colors.border,
                    opacity: isClicked ? 0.4 : 1,
                  },
                ]}
              >
                <ShapeComponent
                  size={40}
                  color={isClicked ? theme.colors.textSecondary : cell.color}
                />
              </TouchableOpacity>
            );
          })}
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
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewSubtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  previewTimerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  previewTimer: {
    fontSize: 64,
    fontWeight: 'bold',
    marginTop: 10,
  },
  previewHint: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
  },
  displayCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  displayLabel: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  displayShapeContainer: {
    marginBottom: 12,
  },
  displayHint: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
