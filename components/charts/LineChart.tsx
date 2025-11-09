import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface LineChartComponentProps {
  title: string;
  data: {
    labels: string[];
    datasets: [{
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }];
  };
}

export default function LineChartComponent({ title, data }: LineChartComponentProps) {
  const chartConfig = {
    backgroundColor: '#1A1A2E',
    backgroundGradientFrom: '#1A1A2E',
    backgroundGradientTo: '#2D2D44',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#A855F7',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#2D2D44',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});