import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, themeType, toggleTheme } = useTheme();

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.colors.secondary }]} onPress={toggleTheme}>
      <View style={[
        styles.toggle,
        { backgroundColor: theme.colors.primary },
        themeType === 'orange' ? styles.toggleRight : styles.toggleLeft
      ]}>
        {themeType === 'dark' ? (
          <Moon size={16} color="#FFFFFF" />
        ) : (
          <Sun size={16} color="#FFFFFF" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLeft: {
    alignSelf: 'flex-start',
  },
  toggleRight: {
    alignSelf: 'flex-end',
  },
});