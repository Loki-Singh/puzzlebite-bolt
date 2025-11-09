import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Circle as XCircle, RotateCcw, Chrome as Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PuzzleFailed() {
  const { theme } = useTheme();

  const handleTryAgain = () => {
    router.replace('/categories');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Failure Icon */}
      <View style={styles.iconContainer}>
        <XCircle size={80} color={theme.colors.error} />
      </View>

      {/* Failure Message */}
      <View style={styles.messageContainer}>
        <Text style={[styles.failureTitle, { color: theme.colors.text }]}>Oops! Wrong Answer</Text>
        <Text style={[styles.failureSubtitle, { color: theme.colors.textSecondary }]}>
          Don't worry! Learning is a journey. Try again and show us what you've got!
        </Text>
      </View>

      {/* Encouragement */}
      <View style={[styles.encouragementCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
        <Text style={[styles.encouragementTitle, { color: theme.colors.text }]}>💪 Keep Going!</Text>
        <Text style={[styles.encouragementText, { color: theme.colors.textSecondary }]}>
          Every expert was once a beginner. Practice makes perfect!
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.tryAgainButton, { backgroundColor: theme.colors.primary }]} onPress={handleTryAgain}>
          <RotateCcw size={20} color="#FFFFFF" />
          <Text style={styles.tryAgainButtonText}>Try Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.homeButton, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.primary }]} onPress={handleGoHome}>
          <Home size={20} color={theme.colors.primary} />
          <Text style={[styles.homeButtonText, { color: theme.colors.primary }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  failureTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  failureSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
  },
  encouragementCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  tryAgainButton: {
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
  tryAgainButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  homeButtonText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});