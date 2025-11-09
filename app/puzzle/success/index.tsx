import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Trophy, Star, Gift, Chrome as Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PuzzleSuccess() {
  const { theme } = useTheme();

  useEffect(() => {
    // Here you would typically update the backend about puzzle completion
    // and notify the admin system
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleViewOffers = () => {
    router.push('/(tabs)');
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Success Animation Area */}
      <View style={styles.celebrationContainer}>
        <View style={[styles.trophyContainer, { backgroundColor: theme.colors.primary }]}>
          <Trophy size={80} color="#F59E0B" />
        </View>
        
        <View style={styles.starsContainer}>
          <Star size={24} color="#F59E0B" style={styles.star1} />
          <Star size={32} color="#FCD34D" style={styles.star2} />
          <Star size={20} color="#F59E0B" style={styles.star3} />
          <Star size={28} color="#FCD34D" style={styles.star4} />
        </View>
      </View>

      {/* Success Message */}
      <View style={styles.messageContainer}>
        <Text style={[styles.successTitle, { color: theme.colors.text }]}>Booyah!! You have done it!</Text>
        <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
          Congratulations! You've successfully completed all puzzles within the time limit.
        </Text>
      </View>

      {/* Achievement Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>5/5</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Puzzles Solved</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>100%</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Accuracy</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>⚡</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Lightning Fast</Text>
        </View>
      </View>

      {/* Reward Information */}
      <View style={[styles.rewardCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
        <View style={styles.rewardHeader}>
          <Gift size={24} color={theme.colors.success} />
          <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>Your Reward is Ready!</Text>
        </View>
        
        <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]}>
          Great job! Your discount will be applied when the cafe admin processes your order. 
          Wait for the confirmation and enjoy your meal!
        </Text>
        
        <View style={styles.rewardStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: theme.colors.warning }]} />
          <Text style={[styles.statusText, { color: theme.colors.warning }]}>Waiting for admin approval</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]} onPress={handleViewOffers}>
          <Text style={styles.primaryButtonText}>View My Offers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.primary }]} onPress={handleGoHome}>
          <Home size={20} color={theme.colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* Fun Fact */}
      <View style={[styles.funFactContainer, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
        <Text style={[styles.funFactTitle, { color: theme.colors.primary }]}>🎉 Fun Fact</Text>
        <Text style={[styles.funFactText, { color: theme.colors.textSecondary }]}>
          You're among the top 15% of players who complete puzzles on their first try!
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    position: 'relative',
  },
  trophyContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star1: {
    position: 'absolute',
    top: 20,
    left: 30,
  },
  star2: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  star3: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  star4: {
    position: 'absolute',
    bottom: 20,
    right: 40,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  rewardCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  rewardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  rewardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  funFactContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  funFactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 14,
    lineHeight: 20,
  },
});