import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, Lightbulb, CheckCircle } from 'lucide-react-native';
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

export default function PuzzleGame() {
  const { category, puzzleId } = useLocalSearchParams();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userAnswer, setUserAnswer] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

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
  }, [puzzleId]);

  useEffect(() => {
    if (timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameEnded) {
      handleTimeout();
    }
  }, [timeLeft, gameEnded]);

  const fetchPuzzle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('id', puzzleId)
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

  const handleTimeout = () => {
    setGameEnded(true);
    router.replace('/puzzle/timeout');
  };

  const handleUseHint = () => {
    if (puzzle && hintsUsed < puzzle.hints.length) {
      setHintsUsed(hintsUsed + 1);
      setShowHint(true);
    }
  };

  const handleSubmit = () => {
    if (!puzzle) return;

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = puzzle.answer.trim().toLowerCase();

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      const finalPoints = Math.max(puzzle.points - (hintsUsed * 20), 50);
      router.replace({
        pathname: '/puzzle/success',
        params: {
          category: category as string,
          points: finalPoints.toString(),
          timeLeft: timeLeft.toString(),
        },
      });
    } else {
      router.replace('/puzzle/failed');
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
        <Text style={styles.errorText}>Puzzle not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.categoryTitle}>{categoryNames[category as string]}</Text>
        <View style={styles.timerContainer}>
          <Clock size={20} color="#EF4444" />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Puzzle Question */}
        <View style={styles.puzzleCard}>
          <Text style={styles.puzzleTitle}>Solve the Riddle</Text>
          <Text style={styles.puzzleQuestion}>{puzzle.question}</Text>
        </View>

        {/* Hints Section */}
        {puzzle.hints && puzzle.hints.length > 0 && (
          <View style={styles.hintsCard}>
            <View style={styles.hintsHeader}>
              <Lightbulb size={20} color="#F59E0B" />
              <Text style={styles.hintsTitle}>Need a Hint?</Text>
            </View>

            {showHint && hintsUsed > 0 ? (
              <View style={styles.hintContent}>
                <Text style={styles.hintText}>{puzzle.hints[hintsUsed - 1]}</Text>
              </View>
            ) : null}

            {hintsUsed < puzzle.hints.length && (
              <TouchableOpacity style={styles.hintButton} onPress={handleUseHint}>
                <Text style={styles.hintButtonText}>
                  Use Hint ({hintsUsed}/{puzzle.hints.length}) - Costs 20 points
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Answer Input */}
        <View style={styles.answerCard}>
          <Text style={styles.answerLabel}>Your Answer</Text>
          <TextInput
            style={styles.answerInput}
            placeholder="Type your answer here..."
            placeholderTextColor="#64748B"
            value={userAnswer}
            onChangeText={setUserAnswer}
            autoCapitalize="words"
          />

          <TouchableOpacity
            style={[styles.submitButton, !userAnswer.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!userAnswer.trim()}
          >
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        </View>

        {/* Points Info */}
        <View style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Points Breakdown</Text>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Base Points:</Text>
            <Text style={styles.pointsValue}>{puzzle.points}</Text>
          </View>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Hints Used:</Text>
            <Text style={styles.pointsValue}>-{hintsUsed * 20}</Text>
          </View>
          <View style={[styles.pointsRow, styles.pointsTotal]}>
            <Text style={styles.pointsTotalLabel}>Current Total:</Text>
            <Text style={styles.pointsTotalValue}>
              {Math.max(puzzle.points - (hintsUsed * 20), 50)}
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  puzzleCard: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  puzzleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A855F7',
    marginBottom: 12,
  },
  puzzleQuestion: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  hintsCard: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  hintsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hintsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  hintContent: {
    backgroundColor: '#2D2D44',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 14,
    color: '#F59E0B',
    lineHeight: 20,
  },
  hintButton: {
    backgroundColor: '#2D2D44',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  hintButtonText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  answerCard: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  answerInput: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#2D2D44',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  pointsCard: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  pointsValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pointsTotal: {
    borderTopWidth: 1,
    borderTopColor: '#2D2D44',
    paddingTop: 12,
    marginTop: 8,
  },
  pointsTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pointsTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
});
