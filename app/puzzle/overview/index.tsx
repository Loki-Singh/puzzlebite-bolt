import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, Target, Trophy, Play, Shapes } from 'lucide-react-native';
import { ShapeComponents } from '@/components/puzzle/PuzzleShapes';
import { generatePuzzle } from '@/lib/puzzleGenerator';

export default function PuzzleOverview() {
  const { category } = useLocalSearchParams();
  const [isBlurred, setIsBlurred] = useState(true);
  const [previewPuzzle, setPreviewPuzzle] = useState<any>(null);

  const categoryNames: { [key: string]: string } = {
    ipl: 'IPL',
    fifa: 'FIFA',
    music: 'MUSIC',
    hollywood: 'HOLLYWOOD',
    bollywood: 'BOLLYWOOD',
    history: 'HISTORY',
    mythology: 'MYTHOLOGY',
    science: 'SCIENCE',
    anime: 'ANIME',
    cartoon: 'CARTOON',
    geography: 'GEOGRAPHY',
    technology: 'TECHNOLOGY',
  };

  useEffect(() => {
    const puzzle = generatePuzzle('easy');
    setPreviewPuzzle(puzzle);
  }, []);

  const handleStartPuzzle = () => {
    setIsBlurred(false);
    router.push(`/puzzle/game?category=${category}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.categoryTitle}>{categoryNames[category as string] || 'PUZZLE'}</Text>
        <Text style={styles.subtitle}>Category Challenge</Text>
      </View>

      {/* Challenge Details */}
      <View style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Trophy size={32} color="#F59E0B" />
          <Text style={styles.challengeTitle}>Puzzle Challenge</Text>
        </View>

        <Text style={styles.challengeDescription}>
          Match shapes in the correct sequence to complete the formation! Fill all slots within the time limit to win your reward.
        </Text>

        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Shapes size={20} color="#3B82F6" />
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Shapes</Text>
          </View>

          <View style={styles.statItem}>
            <Clock size={20} color="#EF4444" />
            <Text style={styles.statNumber}>60</Text>
            <Text style={styles.statLabel}>Seconds</Text>
          </View>

          <View style={styles.statItem}>
            <Trophy size={20} color="#10B981" />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>
      </View>

      {/* Preview Puzzle */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Puzzle Preview</Text>

        <View style={[styles.puzzleContainer, isBlurred && styles.blurredContainer]}>
          {previewPuzzle && (
            <View style={styles.previewGrid}>
              {Array.from({ length: previewPuzzle.rows }).map((_, rowIndex) => (
                <View key={rowIndex} style={styles.previewRow}>
                  {Array.from({ length: previewPuzzle.cols }).map((_, colIndex) => {
                    const slot = previewPuzzle.slots.find((s: any) => s.row === rowIndex && s.col === colIndex);
                    if (!slot) {
                      return <View key={colIndex} style={styles.previewEmptyCell} />;
                    }
                    const ShapeComponent = ShapeComponents[slot.shapeType];
                    return (
                      <View key={colIndex} style={styles.previewSlot}>
                        <ShapeComponent size={40} color="#555" />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          )}

          {isBlurred && (
            <View style={styles.blurOverlay}>
              <TouchableOpacity style={styles.revealButton} onPress={() => setIsBlurred(false)}>
                <Text style={styles.revealButtonText}>Preview Puzzle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.difficultyIndicator}>
          <Text style={styles.difficultyLabel}>Difficulty Level:</Text>
          <View style={styles.difficultyStars}>
            <View style={styles.filledStar} />
            <View style={styles.filledStar} />
            <View style={styles.emptyStar} />
            <View style={styles.emptyStar} />
            <View style={styles.emptyStar} />
          </View>
        </View>
      </View>

      {/* Rules */}
      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>Challenge Rules</Text>
        <View style={styles.rulesList}>
          <Text style={styles.ruleItem}>• Select shapes and place them in the correct slots</Text>
          <Text style={styles.ruleItem}>• Follow the numerical sequence (1, 2, 3, 4...)</Text>
          <Text style={styles.ruleItem}>• Match the correct shape to the correct position</Text>
          <Text style={styles.ruleItem}>• Complete within 60 seconds</Text>
          <Text style={styles.ruleItem}>• Wrong placement ends the challenge</Text>
        </View>
      </View>

      {/* Start Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartPuzzle}>
          <Play size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Let's Do It!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  challengeCard: {
    backgroundColor: '#1A1A2E',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 20,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  previewCard: {
    backgroundColor: '#1A1A2E',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  puzzleContainer: {
    position: 'relative',
    backgroundColor: '#2D2D44',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurredContainer: {
    backgroundColor: '#16213E',
  },
  previewGrid: {
    gap: 8,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewEmptyCell: {
    width: 60,
    height: 60,
  },
  previewSlot: {
    width: 60,
    height: 60,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  revealButton: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  revealButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  difficultyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginRight: 8,
  },
  difficultyStars: {
    flexDirection: 'row',
  },
  filledStar: {
    width: 16,
    height: 16,
    backgroundColor: '#A855F7',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  emptyStar: {
    width: 16,
    height: 16,
    backgroundColor: '#2D2D44',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  rulesCard: {
    backgroundColor: '#1A1A2E',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  rulesList: {
    gap: 8,
  },
  ruleItem: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  startButton: {
    backgroundColor: '#A855F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});