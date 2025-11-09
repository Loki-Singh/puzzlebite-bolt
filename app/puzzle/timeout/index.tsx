import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Clock, RotateCcw, Chrome as Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PuzzleTimeout() {
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
      {/* Timeout Icon */}
      <View style={styles.iconContainer}>
        <Clock size={80} color={theme.colors.warning} />
      </View>

      {/* Timeout Message */}
      <View style={styles.messageContainer}>
        <Text style={[styles.timeoutTitle, { color: theme.colors.text }]}>Time's Up!</Text>
        <Text style={[styles.timeoutSubtitle, { color: theme.colors.textSecondary }]}>
          You ran out of time, but don't give up! Speed comes with practice.
        </Text>
      </View>

      {/* Tips Card */}
      <View style={[styles.tipsCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
        <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>⚡ Quick Tips</Text>
        <Text style={[styles.tipsText, { color: theme.colors.textSecondary }]}>
          • Read questions carefully but quickly{'\n'}
          • Trust your first instinct{'\n'}
          • Practice makes you faster!
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
  timeoutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  timeoutSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
  },
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
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