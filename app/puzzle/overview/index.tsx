import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, Target, Trophy, Play, Brain } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface Puzzle {
  id: string;
  category: string;
  type: string;
  question: string;
  answer: string;
  difficulty: string;
  hints: string[];
  points: number;
}

export default function PuzzleOverview() {
  const { category } = useLocalSearchParams();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

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
    fetchPuzzle();
  }, [category]);

  const fetchPuzzle = async () => {
    try {
      setLoading(true);
      const { data, error} = await supabase
        .from('puzzles')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching puzzle:', error);
        return;
      }

      if (data) {
        setPuzzle(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPuzzle = () => {
    if (puzzle) {
      router.push({
        pathname: '/puzzle/game',
        params: {
          category: category as string,
          puzzleId: puzzle.id,
        },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>Loading puzzle...</Text>
      </View>
    );
  }

  if (!puzzle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No puzzle found for this category</Text>
      </View>
    );
  }

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
          <Text style={styles.challengeTitle}>Riddle Challenge</Text>
        </View>

        <Text style={styles.challengeDescription}>
          Test your knowledge about {categoryNames[category as string]}! Read the riddle carefully and try to solve it within the time limit.
        </Text>

        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Brain size={20} color="#3B82F6" />
            <Text style={styles.statNumber}>{puzzle.difficulty}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>

          <View style={styles.statItem}>
            <Clock size={20} color="#EF4444" />
            <Text style={styles.statNumber}>60</Text>
            <Text style={styles.statLabel}>Seconds</Text>
          </View>

          <View style={styles.statItem}>
            <Trophy size={20} color="#10B981" />
            <Text style={styles.statNumber}>{puzzle.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
      </View>

      {/* Preview Puzzle */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Puzzle Preview</Text>

        <View style={styles.puzzleContainer}>
          {!showHint ? (
            <View style={styles.blurOverlay}>
              <Brain size={48} color="#A855F7" />
              <Text style={styles.blurText}>Riddle is hidden</Text>
              <TouchableOpacity style={styles.revealButton} onPress={() => setShowHint(true)}>
                <Text style={styles.revealButtonText}>Preview Riddle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.riddlePreview}>
              <Text style={styles.riddleText}>{puzzle.question}</Text>
            </View>
          )}
        </View>

        <View style={styles.difficultyIndicator}>
          <Text style={styles.difficultyLabel}>Difficulty Level:</Text>
          <View style={styles.difficultyStars}>
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.star,
                  index < (puzzle.difficulty === 'easy' ? 2 : puzzle.difficulty === 'medium' ? 3 : 4)
                    ? styles.filledStar
                    : styles.emptyStar,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Rules */}
      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>Challenge Rules</Text>
        <View style={styles.rulesList}>
          <Text style={styles.ruleItem}>• Read the riddle carefully</Text>
          <Text style={styles.ruleItem}>• Type your answer in the text field</Text>
          <Text style={styles.ruleItem}>• You have 60 seconds to solve it</Text>
          <Text style={styles.ruleItem}>• Use hints if you get stuck (costs points)</Text>
          <Text style={styles.ruleItem}>• Answer must match exactly</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
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
    fontSize: 20,
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
    backgroundColor: '#2D2D44',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  revealButton: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  revealButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  riddlePreview: {
    padding: 16,
  },
  riddleText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
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
  star: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  filledStar: {
    backgroundColor: '#A855F7',
  },
  emptyStar: {
    backgroundColor: '#2D2D44',
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
