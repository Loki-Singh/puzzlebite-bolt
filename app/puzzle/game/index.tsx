import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, ChevronRight, CircleCheck as CheckCircle, Lightbulb } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

interface Puzzle {
  id: string;
  question: string;
  options: string[];
  answer: string;
  hints: string[];
  points: number;
  difficulty: string;
}

export default function PuzzleGame() {
  const { theme } = useTheme();
  const { category } = useLocalSearchParams();

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const styles = createStyles(theme);

  useEffect(() => {
    async function fetchPuzzles() {
      try {
        const { data, error } = await supabase
          .from('puzzles')
          .select('*')
          .eq('category', category)
          .eq('type', 'mcq')
          .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {
          Alert.alert('No Puzzles', 'No puzzles found for this category');
          router.back();
          return;
        }

        setPuzzles(data);
      } catch (error) {
        console.error('Error fetching puzzles:', error);
        Alert.alert('Error', 'Failed to load puzzles');
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchPuzzles();
  }, [category]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isGameActive && !loading && puzzles.length > 0) {
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
  }, [isGameActive, loading, puzzles]);

  useEffect(() => {
    return () => {
      setIsGameActive(false);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleUseHint = () => {
    if (hintsUsed < currentPuzzle.hints.length) {
      setShowHint(true);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer', 'You must choose an option before proceeding.');
      return;
    }

    const currentPuzzle = puzzles[currentQuestionIndex];

    if (selectedAnswer !== currentPuzzle.answer) {
      setIsGameActive(false);
      router.push('/puzzle/failed');
      return;
    }

    const earnedPoints = currentPuzzle.points - (hintsUsed * 20);
    setScore(score + earnedPoints);

    if (currentQuestionIndex === puzzles.length - 1) {
      setIsGameActive(false);
      const timeTaken = (puzzles.length * 30) - timeLeft;
      router.push(`/puzzle/success?score=${score + earnedPoints}&timeTaken=${timeTaken}`);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setHintsUsed(0);
      setTimeLeft(30);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading puzzle...</Text>
      </View>
    );
  }

  if (puzzles.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }, styles.centerContent]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>No puzzles available</Text>
      </View>
    );
  }

  const currentPuzzle = puzzles[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / puzzles.length) * 100;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <View style={styles.timerContainer}>
          <Clock size={20} color={theme.colors.error} />
          <Text style={[styles.timerText, { color: theme.colors.error }]}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {currentQuestionIndex + 1} of {puzzles.length}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.secondary }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.colors.primary }]} />
          </View>
        </View>
      </View>

      <View style={[styles.questionCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
        <View style={styles.questionHeader}>
          <View style={[styles.questionNumber, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.questionNumberText}>{currentQuestionIndex + 1}</Text>
          </View>
          <Text style={[styles.questionTitle, { color: theme.colors.textSecondary }]}>Question {currentQuestionIndex + 1}</Text>
        </View>

        <Text style={[styles.questionText, { color: theme.colors.text }]}>{currentPuzzle.question}</Text>

        {showHint && hintsUsed > 0 && (
          <View style={[styles.hintBox, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.border }]}>
            <Lightbulb size={16} color={theme.colors.primary} />
            <Text style={[styles.hintText, { color: theme.colors.text }]}>
              {currentPuzzle.hints[hintsUsed - 1]}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {currentPuzzle.options.map((option, index) => {
          const optionLetter = option.charAt(0);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border },
                selectedAnswer === optionLetter && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
              ]}
              onPress={() => handleAnswerSelect(optionLetter)}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.optionIndicator,
                  { backgroundColor: theme.colors.secondary },
                  selectedAnswer === optionLetter && { backgroundColor: '#FFFFFF' }
                ]}>
                  {selectedAnswer === optionLetter && <CheckCircle size={16} color={theme.colors.primary} />}
                </View>
                <Text style={[
                  styles.optionText,
                  { color: theme.colors.text },
                  selectedAnswer === optionLetter && { color: '#FFFFFF', fontWeight: '600' }
                ]}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actionsContainer}>
        {hintsUsed < currentPuzzle.hints.length && (
          <TouchableOpacity
            style={[styles.hintButton, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.border }]}
            onPress={handleUseHint}
          >
            <Lightbulb size={18} color={theme.colors.primary} />
            <Text style={[styles.hintButtonText, { color: theme.colors.text }]}>
              Hint ({currentPuzzle.hints.length - hintsUsed} left)
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: selectedAnswer === null ? theme.colors.secondary : theme.colors.primary }
          ]}
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null}
        >
          <Text style={[
            styles.nextButtonText,
            { color: selectedAnswer === null ? theme.colors.textSecondary : '#FFFFFF' }
          ]}>
            {currentQuestionIndex === puzzles.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <ChevronRight
            size={20}
            color={selectedAnswer === null ? theme.colors.textSecondary : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: theme.colors.textSecondary }]}>Score: {score}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  questionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  hintText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  optionButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
