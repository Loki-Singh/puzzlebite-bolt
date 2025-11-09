import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Gift, Sparkles, Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

interface Reward {
  id: string;
  title: string;
  description: string;
  discount_value: string;
  image_url: string;
}

export default function PuzzleSuccess() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const timeTaken = params.timeTaken as string;
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRandomReward = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      if (data && data.length > 0) {
        const randomReward = data[Math.floor(Math.random() * data.length)];
        setReward(randomReward);

        const userId = `device_${Date.now()}`;
        await supabase.from('user_rewards').insert({
          user_id: userId,
          reward_id: randomReward.id,
          puzzle_completed: true,
          time_taken: parseInt(timeTaken || '0'),
        });
      }
    } catch (error) {
      console.error('Error fetching reward:', error);
    } finally {
      setLoading(false);
    }
  }, [timeTaken]);

  useEffect(() => {
    fetchRandomReward();
  }, [fetchRandomReward]);

  const styles = createStyles(theme);

  if (loading || !reward) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Revealing your reward...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
            <Gift size={64} color="#FFFFFF" />
          </View>
          <Animated.View entering={ZoomIn.delay(400).springify()} style={styles.sparkle1}>
            <Sparkles size={24} color="#F59E0B" />
          </Animated.View>
          <Animated.View entering={ZoomIn.delay(600).springify()} style={styles.sparkle2}>
            <Sparkles size={20} color="#EC4899" />
          </Animated.View>
          <Animated.View entering={ZoomIn.delay(500).springify()} style={styles.sparkle3}>
            <Sparkles size={28} color="#06B6D4" />
          </Animated.View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(300).springify()}
          style={[styles.congratsText, { color: theme.colors.text }]}
        >
          Congratulations!
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(400).springify()}
          style={[styles.subtitle, { color: theme.colors.textSecondary }]}
        >
          You completed the puzzle in {timeTaken} seconds
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={[styles.rewardCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
        >
          <Image source={{ uri: reward.image_url }} style={styles.rewardImage} />

          <View style={styles.rewardContent}>
            <View style={[styles.discountBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.discountText}>{reward.discount_value}</Text>
            </View>

            <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>
              {reward.title}
            </Text>

            <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]}>
              {reward.description}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.claimButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.claimButtonText}>Claim Reward</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homeButton, { borderColor: theme.colors.border }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Home size={20} color={theme.colors.text} />
            <Text style={[styles.homeButtonText, { color: theme.colors.text }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 10,
    left: -15,
  },
  sparkle3: {
    position: 'absolute',
    top: 20,
    left: -20,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  rewardCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  rewardImage: {
    width: '100%',
    height: 180,
  },
  rewardContent: {
    padding: 20,
  },
  discountBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  discountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rewardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  claimButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});