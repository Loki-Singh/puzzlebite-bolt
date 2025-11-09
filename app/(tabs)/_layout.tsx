import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { User, Shield, Camera, ChartBar as BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
          ...(Platform.OS === 'web' && {
            boxShadow: '0 -4px 8px rgba(0,0,0,0.3)',
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? theme.colors.tabBarActive : 'transparent',
              borderRadius: 12,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <User size={size} color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? theme.colors.tabBarActive : 'transparent',
              borderRadius: 12,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Shield size={size} color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Live Feed',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? theme.colors.tabBarActive : 'transparent',
              borderRadius: 12,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Camera size={size} color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? theme.colors.tabBarActive : 'transparent',
              borderRadius: 12,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <BarChart3 size={size} color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}