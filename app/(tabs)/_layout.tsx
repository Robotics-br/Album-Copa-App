import React from 'react';
import { Tabs } from 'expo-router';
import { Album, LayoutGrid, Trophy, Calendar, Settings } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();

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
          title: i18n_t('tabs.album'),
          tabBarIcon: ({ color, size }) => <Album size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="general"
        options={{
          title: i18n_t('tabs.general'),
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: i18n_t('tabs.events'),
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: i18n_t('tabs.stats'),
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n_t('tabs.settings'),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
