import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Clock, Star, Gift, History, TrendingUp, Search, MapPin, UserCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  isActivated: boolean;
  isApproved: boolean;
  image: string;
}

interface CustomerHistory {
  pennySaved: number;
  offersAvailed: number;
  puzzlesCompleted: number;
  lastVisit: string;
}

export default function CustomerLanding() {
  const { theme } = useTheme();

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      title: 'Morning Special',
      description: 'Get 20% off on breakfast items',
      discount: '20%',
      isActivated: false,
      isApproved: true,
      image: 'https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
    },
    {
      id: '2',
      title: 'Coffee Combo',
      description: 'Buy 2 coffees, get 1 free pastry',
      discount: 'Free Item',
      isActivated: true,
      isApproved: true,
      image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
    },
    {
      id: '3',
      title: 'Lunch Deal',
      description: '15% off on all main courses',
      discount: '15%',
      isActivated: false,
      isApproved: false,
      image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
    },
  ]);

  const [customerHistory] = useState<CustomerHistory>({
    pennySaved: 245,
    offersAvailed: 8,
    puzzlesCompleted: 12,
    lastVisit: '2025-01-14',
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleActivateOffer = (offerId: string) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId ? { ...offer, isActivated: true } : offer
      )
    );
  };

  const handleGrabDeal = (offerId: string) => {
    router.push('/categories');
  };

  const handleStatClick = (statType: string) => {
    router.push(`/stats/${statType}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={theme.colors.primary} />
            <Text style={[styles.locationText, { color: theme.colors.text }]}>Brew & Bite Cafe</Text>
          </View>
          <View style={[styles.profileContainer, { borderColor: theme.colors.primary }]}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }}
              style={styles.profileImage}
            />
            <View style={styles.themeToggleContainer}>
              <ThemeToggle />
            </View>
          </View>
        </View>
        
        <View style={styles.appLogoContainer}>
          <Text style={[styles.appLogoPuzzle, { color: theme.colors.text }]}>Puzzle</Text>
          <Text style={styles.appLogoBite}>BITE</Text>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.secondary }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search offers or puzzles"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => handleStatClick('saved')}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary }]}>
              <Star size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>${customerHistory.pennySaved}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Saved</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={() => handleStatClick('offers')}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary }]}>
              <Gift size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{customerHistory.offersAvailed}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Offers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={() => handleStatClick('puzzles')}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary }]}>
              <Clock size={20} color="#06B6D4" />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{customerHistory.puzzlesCompleted}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Puzzles</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Offer */}
        <View style={styles.featuredSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🔥 Hot Deal</Text>
          <View style={styles.featuredCard}>
            <Image
              source={{ uri: offers[1].image }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredOverlay}
            >
              <View style={[styles.featuredBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.featuredBadgeText}>ACTIVE</Text>
              </View>
              <Text style={styles.featuredTitle}>{offers[1].title}</Text>
              <Text style={styles.featuredDescription}>{offers[1].description}</Text>
              <TouchableOpacity
                style={[styles.featuredButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => handleGrabDeal(offers[1].id)}
              >
                <Text style={styles.featuredButtonText}>Start Puzzle</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Today's Offers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Offers</Text>
          
          {offers.map((offer) => (
            <View key={offer.id} style={[styles.offerCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
              <Image source={{ uri: offer.image }} style={styles.offerImage} />
              
              <View style={styles.offerContent}>
                <View style={styles.offerInfo}>
                  <Text style={[styles.offerTitle, { color: theme.colors.text }]}>{offer.title}</Text>
                  <Text style={[styles.offerDescription, { color: theme.colors.textSecondary }]}>{offer.description}</Text>
                  <View style={[styles.discountBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.discountText}>{offer.discount}</Text>
                  </View>
                </View>
                
                <View style={styles.offerActions}>
                  {!offer.isActivated ? (
                    <TouchableOpacity
                      style={[styles.activateButton, { backgroundColor: theme.colors.primary }]}
                      onPress={() => handleActivateOffer(offer.id)}
                    >
                      <Text style={styles.activateButtonText}>Activate</Text>
                    </TouchableOpacity>
                  ) : offer.isApproved ? (
                    <TouchableOpacity
                      style={[styles.grabDealButton, { backgroundColor: theme.colors.primary }]}
                      onPress={() => handleGrabDeal(offer.id)}
                    >
                      <Text style={styles.grabDealButtonText}>Play</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.pendingStatus}>
                      <View style={[styles.pendingDot, { backgroundColor: theme.colors.warning }]} />
                      <Text style={[styles.pendingText, { color: theme.colors.warning }]}>Pending</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Puzzle Drop CTA */}
        <TouchableOpacity
          style={[styles.puzzleDropCTA, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/puzzle/game/shape-game')}
        >
          <View style={styles.puzzleDropContent}>
            <View style={styles.puzzleDropIcon}>
              <Gift size={40} color="#FFFFFF" />
            </View>
            <View style={styles.puzzleDropText}>
              <Text style={styles.puzzleDropTitle}>Drop & Win!</Text>
              <Text style={styles.puzzleDropSubtitle}>Play the puzzle game to unlock surprise rewards</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
              <History size={24} color={theme.colors.primary} />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
              <TrendingUp size={24} color="#06B6D4" />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
              <Gift size={24} color="#F59E0B" />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
              onPress={() => router.push('/mascot')}
            >
              <UserCircle size={24} color="#8B5CF6" />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>My Mascot</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  themeToggleContainer: {
    // Theme toggle styling handled in component
  },
  appLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appLogoPuzzle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  appLogoBite: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066FF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  featuredSection: {
    marginBottom: 24,
  },
  featuredCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    height: 200,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  featuredButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  offerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
  },
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  offerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  offerActions: {
    alignItems: 'center',
  },
  activateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  activateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  grabDealButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  grabDealButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pendingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingDot: {
    width: 8,
    height: 8,
    backgroundColor: '#F59E0B',
    marginRight: 6,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  puzzleDropCTA: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  puzzleDropContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzleDropIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  puzzleDropText: {
    flex: 1,
  },
  puzzleDropTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  puzzleDropSubtitle: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});