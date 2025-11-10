import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, ChevronRight, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function PuzzleGame() {
  const { theme } = useTheme();
  const { category } = useLocalSearchParams();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);

  const questions: Question[] = [
    {
      id: 1,
      question: "Who holds the record for the highest individual score in Test cricket by an Indian batsman?",
      options: ["Virat Kohli", "Sachin Tendulkar", "Karun Nair", "Rohit Sharma"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "In which year was the first IPL tournament held?",
      options: ["2007", "2008", "2009", "2010"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Which team has won the most IPL titles?",
      options: ["Mumbai Indians", "Chennai Super Kings", "Kolkata Knight Riders", "Royal Challengers Bangalore"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Who is known as 'Captain Cool' in Indian cricket?",
      options: ["Virat Kohli", "Rohit Sharma", "MS Dhoni", "Hardik Pandya"],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "Which bowler has taken the most wickets in IPL history?",
      options: ["Lasith Malinga", "Amit Mishra", "Dwayne Bravo", "Yuzvendra Chahal"],
      correctAnswer: 2
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGameActive) {
      timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up
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
  }, [isGameActive]);

  // Cleanup timer when component unmounts or game ends
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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer', 'You must choose an option before proceeding.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer !== currentQuestion.correctAnswer) {
      // Wrong answer - end game
      setIsGameActive(false);
      router.push('/puzzle/failed');
      return;
    }

    // Correct answer
    setScore(score + 1);
    
    if (currentQuestionIndex === questions.length - 1) {
      // Last question - success!
      setIsGameActive(false);
      router.push('/puzzle/success');
    } else {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with timer and progress */}
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <View style={styles.timerContainer}>
          <Clock size={20} color={theme.colors.error} />
          <Text style={[styles.timerText, { color: theme.colors.error }]}>{formatTime(timeLeft)}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.secondary }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.colors.primary }]} />
          </View>
        </View>
      </View>

      {/* Question Card */}
      <View style={[styles.questionCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
        <View style={styles.questionHeader}>
          <View style={[styles.questionNumber, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.questionNumberText}>{currentQuestionIndex + 1}</Text>
          </View>
          <Text style={[styles.questionTitle, { color: theme.colors.textSecondary }]}>Question {currentQuestionIndex + 1}</Text>
        </View>
        
        <Text style={[styles.questionText, { color: theme.colors.text }]}>{currentQuestion.question}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border },
              selectedAnswer === index && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionIndicator,
                { backgroundColor: theme.colors.secondary },
                selectedAnswer === index && { backgroundColor: '#FFFFFF' }
              ]}>
                {selectedAnswer === index && <CheckCircle size={16} color="#FFFFFF" />}
              </View>
              <Text style={[
                styles.optionText,
                { color: theme.colors.text },
                selectedAnswer === index && { color: '#FFFFFF', fontWeight: '600' }
              ]}>
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
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
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <ChevronRight
            size={20}
            color={selectedAnswer === null ? theme.colors.textSecondary : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Score indicator */}
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: theme.colors.textSecondary }]}>Score: {score}/{questions.length}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: theme.colors.primary,
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