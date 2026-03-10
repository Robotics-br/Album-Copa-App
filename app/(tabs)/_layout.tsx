import React from 'react';
import { Tabs } from 'expo-router';
import { Album, LayoutGrid, Trophy, Calendar, Settings } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TabLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopColor: t.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: t.gold,
        tabBarInactiveTintColor: t.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Álbum',
          tabBarIcon: ({ color, size }) => <Album size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="general"
        options={{
          title: 'Geral',
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stadiums"
        options={{
          title: 'Estádios',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Jogos',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
