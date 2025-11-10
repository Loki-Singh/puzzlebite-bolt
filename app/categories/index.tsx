import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Gamepad2, Music, Film, Globe, Trophy, BookOpen, Zap, Beaker, Heart, Tv } from 'lucide-react-native';
import { PortalTransition } from '@/components/transitions/PortalTransition';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function Categories() {
  const categories: Category[] = [
    {
      id: 'ipl',
      name: 'IPL',
      icon: <Trophy size={32} color="#FFFFFF" />,
      color: '#F97316',
      description: 'Cricket & Sports',
    },
    {
      id: 'fifa',
      name: 'FIFA',
      icon: <Trophy size={32} color="#FFFFFF" />,
      color: '#10B981',
      description: 'Football & World Cup',
    },
    {
      id: 'music',
      name: 'MUSIC',
      icon: <Music size={32} color="#FFFFFF" />,
      color: '#8B5CF6',
      description: 'Songs & Artists',
    },
    {
      id: 'hollywood',
      name: 'HOLLYWOOD',
      icon: <Film size={32} color="#FFFFFF" />,
      color: '#EF4444',
      description: 'Movies & Celebrities',
    },
    {
      id: 'bollywood',
      name: 'BOLLYWOOD',
      icon: <Heart size={32} color="#FFFFFF" />,
      color: '#F59E0B',
      description: 'Hindi Cinema',
    },
    {
      id: 'history',
      name: 'HISTORY',
      icon: <BookOpen size={32} color="#FFFFFF" />,
      color: '#6366F1',
      description: 'Historical Events',
    },
    {
      id: 'mythology',
      name: 'MYTHOLOGY',
      icon: <Zap size={32} color="#FFFFFF" />,
      color: '#DC2626',
      description: 'Ancient Stories',
    },
    {
      id: 'science',
      name: 'SCIENCE',
      icon: <Beaker size={32} color="#FFFFFF" />,
      color: '#059669',
      description: 'Discovery & Innovation',
    },
    {
      id: 'anime',
      name: 'ANIME',
      icon: <Tv size={32} color="#FFFFFF" />,
      color: '#7C3AED',
      description: 'Japanese Animation',
    },
    {
      id: 'cartoon',
      name: 'CARTOON',
      icon: <Gamepad2 size={32} color="#FFFFFF" />,
      color: '#EC4899',
      description: 'Animated Shows',
    },
    {
      id: 'geography',
      name: 'GEOGRAPHY',
      icon: <Globe size={32} color="#FFFFFF" />,
      color: '#0891B2',
      description: 'Countries & Places',
    },
    {
      id: 'technology',
      name: 'TECHNOLOGY',
      icon: <Zap size={32} color="#FFFFFF" />,
      color: '#374151',
      description: 'Tech & Innovation',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPortal, setShowPortal] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowPortal(true);
  };

  const handlePortalComplete = () => {
    if (selectedCategory) {
      router.push(`/puzzle/overview?category=${selectedCategory}`);
      setShowPortal(false);
      setSelectedCategory(null);
    }
  };

  return (
    <View style={styles.container}>
      <PortalTransition
        visible={showPortal}
        onAnimationComplete={handlePortalComplete}
        type="open"
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Challenge</Text>
        <Text style={styles.subtitle}>Select a category to start solving puzzles</Text>
      </View>

      {/* Categories Grid */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { backgroundColor: category.color },
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => handleCategorySelect(category.id)}
              activeOpacity={0.8}
            >
              <View style={styles.categoryIcon}>
                {category.icon}
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedCategory: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
  },
  categoryIcon: {
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomSpacing: {
    height: 20,
  },
});