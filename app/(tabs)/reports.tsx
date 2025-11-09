import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChartBar as BarChart3, TrendingUp, Users, DollarSign, Target, Clock } from 'lucide-react-native';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periodOptions = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  const todayStats = {
    footfall: 45,
    conversions: 35,
    totalDiscounts: 1240,
    puzzleSuccess: 92,
    avgEngagement: 4.2,
    peakHour: '2:00 PM',
  };

  const weeklyStats = {
    footfall: 312,
    conversions: 245,
    totalDiscounts: 8680,
    puzzleSuccess: 88,
    avgEngagement: 4.1,
    peakHour: 'Sat 2:00 PM',
  };

  const monthlyStats = {
    footfall: 1248,
    conversions: 1034,
    totalDiscounts: 32400,
    puzzleSuccess: 89,
    avgEngagement: 4.3,
    peakHour: 'Weekends',
  };

  const getCurrentStats = () => {
    switch (selectedPeriod) {
      case 'week':
        return weeklyStats;
      case 'month':
        return monthlyStats;
      default:
        return todayStats;
    }
  };

  const handleMetricClick = (metricType: string) => {
    router.push(`/stats/${metricType}`);
  };

  const stats = getCurrentStats();

  const conversionRate = Math.round((stats.conversions / stats.footfall) * 100);
  const avgDiscount = Math.round(stats.totalDiscounts / stats.conversions);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appLogo}>PuzzleBITE</Text>
        <Text style={styles.subtitle}>Analytics & Reports</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.periodButton,
                selectedPeriod === option.key && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(option.key)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === option.key && styles.activePeriodButtonText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          <TouchableOpacity style={styles.metricCard} onPress={() => handleMetricClick('footfall')}>
            <View style={styles.metricHeader}>
              <Users size={24} color="#3B82F6" />
              <TrendingUp size={16} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>{stats.footfall}</Text>
            <Text style={styles.metricLabel}>Total Footfall</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.metricCard} onPress={() => handleMetricClick('conversion')}>
            <View style={styles.metricHeader}>
              <Target size={24} color="#10B981" />
              <TrendingUp size={16} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>{conversionRate}%</Text>
            <Text style={styles.metricLabel}>Conversion Rate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.metricCard} onPress={() => handleMetricClick('discounts')}>
            <View style={styles.metricHeader}>
              <DollarSign size={24} color="#F59E0B" />
              <TrendingUp size={16} color="#EF4444" />
            </View>
            <Text style={styles.metricValue}>${stats.totalDiscounts}</Text>
            <Text style={styles.metricLabel}>Total Discounts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.metricCard} onPress={() => handleMetricClick('success')}>
            <View style={styles.metricHeader}>
              <BarChart3 size={24} color="#8B5CF6" />
              <TrendingUp size={16} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>{stats.puzzleSuccess}%</Text>
            <Text style={styles.metricLabel}>Puzzle Success</Text>
          </TouchableOpacity>
        </View>

        {/* Detailed Analytics */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Detailed Analytics</Text>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.cardTitle}>Customer Engagement</Text>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Average Rating:</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingValue}>{stats.avgEngagement}</Text>
                <Text style={styles.ratingMax}>/5.0</Text>
              </View>
            </View>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Peak Activity:</Text>
              <Text style={styles.engagementValue}>{stats.peakHour}</Text>
            </View>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Avg. Discount:</Text>
              <Text style={styles.engagementValue}>${avgDiscount}</Text>
            </View>
          </View>

          <View style={styles.analyticsCard}>
            <Text style={styles.cardTitle}>Offer Performance</Text>
            <View style={styles.offerRow}>
              <Text style={styles.offerName}>Morning Special</Text>
              <View style={styles.offerStats}>
                <Text style={styles.offerActivations}>28 activations</Text>
                <Text style={styles.offerConversion}>85% success</Text>
              </View>
            </View>
            <View style={styles.offerRow}>
              <Text style={styles.offerName}>Coffee Combo</Text>
              <View style={styles.offerStats}>
                <Text style={styles.offerActivations}>22 activations</Text>
                <Text style={styles.offerConversion}>91% success</Text>
              </View>
            </View>
            <View style={styles.offerRow}>
              <Text style={styles.offerName}>Lunch Deal</Text>
              <View style={styles.offerStats}>
                <Text style={styles.offerActivations}>18 activations</Text>
                <Text style={styles.offerConversion}>78% success</Text>
              </View>
            </View>
          </View>

          <View style={styles.analyticsCard}>
            <Text style={styles.cardTitle}>Live Feed Engagement</Text>
            <View style={styles.feedMetric}>
              <View style={styles.feedMetricRow}>
                <Text style={styles.feedLabel}>Total Likes:</Text>
                <Text style={styles.feedValue}>1,247</Text>
              </View>
              <View style={styles.feedMetricRow}>
                <Text style={styles.feedLabel}>Images Posted:</Text>
                <Text style={styles.feedValue}>156</Text>
              </View>
              <View style={styles.feedMetricRow}>
                <Text style={styles.feedLabel}>Avg. Likes per Image:</Text>
                <Text style={styles.feedValue}>8.0</Text>
              </View>
              <View style={styles.feedMetricRow}>
                <Text style={styles.feedLabel}>Top Performing Cafe:</Text>
                <Text style={styles.feedValue}>Urban Grind</Text>
              </View>
            </View>
          </View>

          <View style={styles.analyticsCard}>
            <Text style={styles.cardTitle}>Puzzle Categories</Text>
            <View style={styles.categoryStats}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryName}>BOLLYWOOD</Text>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryProgress, { width: '85%' }]} />
                </View>
                <Text style={styles.categoryPercent}>85%</Text>
              </View>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryName}>SPORTS</Text>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryProgress, { width: '72%' }]} />
                </View>
                <Text style={styles.categoryPercent}>72%</Text>
              </View>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryName}>MUSIC</Text>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryProgress, { width: '68%' }]} />
                </View>
                <Text style={styles.categoryPercent}>68%</Text>
              </View>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryName}>SCIENCE</Text>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryProgress, { width: '45%' }]} />
                </View>
                <Text style={styles.categoryPercent}>45%</Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A2E',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  appLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#A855F7',
    marginTop: 2,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#EA580C',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  analyticsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  engagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  engagementLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  engagementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  ratingMax: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 2,
  },
  offerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  offerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  offerStats: {
    alignItems: 'flex-end',
  },
  offerActivations: {
    fontSize: 12,
    color: '#64748B',
  },
  offerConversion: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  feedMetric: {
    gap: 8,
  },
  feedMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  feedLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  feedValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  categoryStats: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    width: 80,
  },
  categoryBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  categoryProgress: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 3,
  },
  categoryPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA580C',
    width: 35,
    textAlign: 'right',
  },
});