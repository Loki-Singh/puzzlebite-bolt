import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, ChevronRight, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function PuzzleGame() {
  const { category } = useLocalSearchParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
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
      setIsGameActive(false);
      router.push('/puzzle/failed');
      return;
    }

    setScore(score + 1);

    if (currentQuestionIndex === questions.length - 1) {
      setIsGameActive(false);
      router.push('/puzzle/success');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Clock size={20} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>{currentQuestionIndex + 1}</Text>
          </View>
          <Text style={styles.questionTitle}>Question {currentQuestionIndex + 1}</Text>
        </View>

        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.optionButtonSelected
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionIndicator,
                selectedAnswer === index && styles.optionIndicatorSelected
              ]}>
                {selectedAnswer === index && <CheckCircle size={16} color="#FFFFFF" />}
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedAnswer === null && styles.nextButtonDisabled
          ]}
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null}
        >
          <Text style={[
            styles.nextButtonText,
            selectedAnswer === null && styles.nextButtonTextDisabled
          ]}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <ChevronRight
            size={20}
            color={selectedAnswer === null ? '#64748B' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#1A1A2E',
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
    color: '#EF4444',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#94A3B8',
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D2D44',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#A855F7',
  },
  questionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#1A1A2E',
    borderColor: '#2D2D44',
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
    backgroundColor: '#A855F7',
  },
  questionNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
  },
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  optionButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    backgroundColor: '#1A1A2E',
    borderColor: '#2D2D44',
  },
  optionButtonSelected: {
    backgroundColor: '#1E1535',
    borderColor: '#A855F7',
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
    backgroundColor: '#2D2D44',
  },
  optionIndicatorSelected: {
    backgroundColor: '#A855F7',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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
    backgroundColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#2D2D44',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#64748B',
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
    color: '#94A3B8',
  },
});
