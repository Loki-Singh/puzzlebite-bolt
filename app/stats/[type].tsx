import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react-native';
import BarChartComponent from '@/components/charts/BarChart';
import PieChartComponent from '@/components/charts/PieChart';
import LineChartComponent from '@/components/charts/LineChart';

export default function StatsDetail() {
  const { type } = useLocalSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const getChartData = () => {
    switch (type) {
      case 'saved':
        return {
          title: 'Money Saved Over Time',
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [12, 25, 18, 35, 42, 28, 45],
            }],
          },
        };
      case 'offers':
        return {
          title: 'Offers by Category',
          type: 'pie',
          data: [
            { name: 'Food', population: 45, color: '#A855F7', legendFontColor: '#FFFFFF', legendFontSize: 12 },
            { name: 'Drinks', population: 30, color: '#3B82F6', legendFontColor: '#FFFFFF', legendFontSize: 12 },
            { name: 'Desserts', population: 25, color: '#10B981', legendFontColor: '#FFFFFF', legendFontSize: 12 },
          ],
        };
      case 'puzzles':
        return {
          title: 'Puzzles Completed Daily',
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [2, 3, 1, 4, 2, 5, 3],
            }],
          },
        };
      case 'footfall':
        return {
          title: 'Daily Footfall',
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [25, 32, 28, 45, 38, 52, 48],
            }],
          },
        };
      case 'conversion':
        return {
          title: 'Conversion Rate Trend',
          type: 'line',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              data: [65, 72, 78, 85],
            }],
          },
        };
      case 'discounts':
        return {
          title: 'Discounts Given',
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [120, 180, 150, 220, 190, 280, 240],
            }],
          },
        };
      case 'success':
        return {
          title: 'Puzzle Success Rate',
          type: 'pie',
          data: [
            { name: 'Success', population: 92, color: '#10B981', legendFontColor: '#FFFFFF', legendFontSize: 12 },
            { name: 'Failed', population: 8, color: '#EF4444', legendFontColor: '#FFFFFF', legendFontSize: 12 },
          ],
        };
      default:
        return {
          title: 'Statistics',
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              data: [20, 45, 28, 80, 99, 43],
            }],
          },
        };
    }
  };

  const chartData = getChartData();

  const renderChart = () => {
    switch (chartData.type) {
      case 'bar':
        return <BarChartComponent title={chartData.title} data={chartData.data} />;
      case 'pie':
        return <PieChartComponent title={chartData.title} data={chartData.data} />;
      case 'line':
        return <LineChartComponent title={chartData.title} data={chartData.data} />;
      default:
        return <BarChartComponent title={chartData.title} data={chartData.data} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chartData.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['day', 'week', 'month'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        {renderChart()}

        {/* Insights */}
        <View style={styles.insightsCard}>
          <View style={styles.insightHeader}>
            <TrendingUp size={24} color="#A855F7" />
            <Text style={styles.insightTitle}>Key Insights</Text>
          </View>
          
          <View style={styles.insightsList}>
            <Text style={styles.insightItem}>• Highest performance on weekends</Text>
            <Text style={styles.insightItem}>• 23% increase from last period</Text>
            <Text style={styles.insightItem}>• Peak activity between 2-4 PM</Text>
            <Text style={styles.insightItem}>• Strong engagement with puzzle challenges</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D2D44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 4,
    margin: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#A855F7',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  insightsCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
});