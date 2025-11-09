import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'dark' | 'orange';

interface Theme {
  name: string;
  colors: {
    background: string;
    cardBackground: string;
    headerBackground: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
}

const themes: Record<ThemeType, Theme> = {
  dark: {
    name: 'Dark Purple',
    colors: {
      background: '#0F0F23',
      cardBackground: '#1A1A2E',
      headerBackground: '#1A1A2E',
      primary: '#A855F7',
      secondary: '#2D2D44',
      accent: '#3B82F6',
      text: '#FFFFFF',
      textSecondary: '#94A3B8',
      border: '#2D2D44',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      tabBarBackground: '#1A1A2E',
      tabBarActive: '#A855F7',
      tabBarInactive: '#64748B',
    },
  },
  orange: {
    name: 'Orange Light',
    colors: {
      background: '#FFFFFF',
      cardBackground: '#FFFFFF',
      headerBackground: '#FF5722',
      primary: '#FF5722',
      secondary: '#FFF3E0',
      accent: '#FF9800',
      text: '#1A1A1A',
      textSecondary: '#666666',
      border: '#E0E0E0',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      tabBarBackground: '#FFFFFF',
      tabBarActive: '#FF5722',
      tabBarInactive: '#999999',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('dark');

  const toggleTheme = () => {
    setThemeType(prev => prev === 'dark' ? 'orange' : 'dark');
  };

  const theme = themes[themeType];

  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};