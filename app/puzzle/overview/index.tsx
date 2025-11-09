import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, Target, Trophy, Play } from 'lucide-react-native';

export default function PuzzleOverview() {
  const { category } = useLocalSearchParams();
  const [isBlurred, setIsBlurred] = useState(true);

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

  const samplePuzzleText = "What is the name of the highest individual score in Test cricket by an Indian batsman?";

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
          Test your knowledge and win amazing rewards! Complete all puzzles within the time limit to earn your discount.
        </Text>

        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Target size={20} color="#3B82F6" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Puzzles</Text>
          </View>
          
          <View style={styles.statItem}>
            <Clock size={20} color="#EF4444" />
            <Text style={styles.statNumber}>120</Text>
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
          <Text style={styles.puzzleText}>
            {samplePuzzleText}
          </Text>
          
          {isBlurred && (
            <View style={styles.blurOverlay}>
              <TouchableOpacity style={styles.revealButton} onPress={() => setIsBlurred(false)}>
                <Text style={styles.revealButtonText}>👁️ Preview Puzzle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.difficultyIndicator}>
          <Text style={styles.difficultyLabel}>Difficulty Level:</Text>
          <View style={styles.difficultyStars}>
            <View style={styles.filledStar} />
            <View style={styles.filledStar} />
            <View style={styles.filledStar} />
            <View style={styles.emptyStar} />
            <View style={styles.emptyStar} />
          </View>
        </View>
      </View>

      {/* Rules */}
      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>Challenge Rules</Text>
        <View style={styles.rulesList}>
          <Text style={styles.ruleItem}>• Answer all 5 puzzles correctly</Text>
          <Text style={styles.ruleItem}>• Complete within 120 seconds</Text>
          <Text style={styles.ruleItem}>• No skipping allowed</Text>
          <Text style={styles.ruleItem}>• Wrong answers end the challenge</Text>
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
    minHeight: 80,
    justifyContent: 'center',
  },
  blurredContainer: {
    backgroundColor: '#16213E',
  },
  puzzleText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
  blurredText: {
    color: 'transparent',
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