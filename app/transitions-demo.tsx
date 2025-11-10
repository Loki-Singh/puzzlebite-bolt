import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { PortalTransition } from '@/components/transitions/PortalTransition';
import { PuzzlePieceTransition } from '@/components/transitions/PuzzlePieceTransition';
import { MirrorFlipTransition } from '@/components/transitions/MirrorFlipTransition';
import { ExplosionTransition } from '@/components/transitions/ExplosionTransition';
import { EmojiBurstTransition } from '@/components/transitions/EmojiBurstTransition';
import { Sparkles, Zap, FlipHorizontal, Star, Award } from 'lucide-react-native';

export default function TransitionsDemoScreen() {
  const { theme } = useTheme();
  const [activeTransition, setActiveTransition] = useState<string | null>(null);

  const transitions = [
    {
      id: 'portal',
      name: 'Portal Transition',
      description: 'Circular portal with concentric rings',
      icon: Sparkles,
      color: '#A855F7',
    },
    {
      id: 'puzzle',
      name: 'Puzzle Pieces',
      description: 'Pieces scatter and assemble',
      icon: Zap,
      color: '#7C3AED',
    },
    {
      id: 'mirror',
      name: 'Mirror Flip',
      description: '3D flip revealing back side',
      icon: FlipHorizontal,
      color: '#F75564',
    },
    {
      id: 'explosion',
      name: 'Explosion & Rebuild',
      description: 'Pieces explode and reassemble',
      icon: Star,
      color: '#FF6B7A',
    },
    {
      id: 'emoji',
      name: 'Emoji Burst',
      description: 'Emoji confetti celebration',
      icon: Award,
      color: '#FFDEA3',
    },
  ];

  const playTransition = (id: string) => {
    setActiveTransition(id);
  };

  const handleTransitionComplete = () => {
    setActiveTransition(null);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Transition Showcase
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Tap any transition to see it in action
          </Text>
        </View>

        <View style={styles.grid}>
          {transitions.map((transition) => {
            const Icon = transition.icon;
            return (
              <TouchableOpacity
                key={transition.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.cardBackground,
                    borderColor: transition.color,
                  },
                ]}
                onPress={() => playTransition(transition.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${transition.color}20` },
                  ]}
                >
                  <Icon size={32} color={transition.color} />
                </View>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  {transition.name}
                </Text>
                <Text
                  style={[styles.cardDescription, { color: theme.colors.textSecondary }]}
                >
                  {transition.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            💡 Tips
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            • All transitions use native animations (60fps)
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            • Perfect for puzzle game transitions
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            • Fully customizable colors and timing
          </Text>
        </View>
      </ScrollView>

      <PortalTransition
        visible={activeTransition === 'portal'}
        onAnimationComplete={handleTransitionComplete}
        type="open"
      />

      <PuzzlePieceTransition
        visible={activeTransition === 'puzzle'}
        onAnimationComplete={handleTransitionComplete}
        type="assemble"
      />

      <MirrorFlipTransition
        visible={activeTransition === 'mirror'}
        onAnimationComplete={handleTransitionComplete}
        colors={['#F75564', '#FFDEA3']}
      />

      <ExplosionTransition
        visible={activeTransition === 'explosion'}
        onAnimationComplete={handleTransitionComplete}
        colors={['#F75564', '#FF6B7A', '#FF8E9E', '#FFDEA3', '#FFE9B8']}
      />

      <EmojiBurstTransition
        visible={activeTransition === 'emoji'}
        onAnimationComplete={handleTransitionComplete}
        emojis={['🧩', '🎯', '⭐', '🎉', '✨', '💫', '🏆', '🎊']}
        count={40}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  grid: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoBox: {
    padding: 20,
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#A78BFA',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
});
