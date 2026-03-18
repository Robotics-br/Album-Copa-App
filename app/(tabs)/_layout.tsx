import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Album, LayoutGrid, Trophy, Calendar, Settings, Repeat } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function TabLayout() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      const buttonStyle = t.statusBar ? 'light' : 'dark';
      NavigationBar.setButtonStyleAsync(buttonStyle);
    }
  }, [t.headerBg, t.statusBar]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.tabsBg,
          elevation: 0,
          borderTopWidth: 2,
          borderColor: t.tabBorderColor,
        },
        tabBarActiveTintColor: t.tabsBgActive,
        tabBarInactiveTintColor: t.tabsBgInactive,
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
        name="trade"
        options={{
          title: i18n_t('tabs.trade'),
          tabBarIcon: ({ color, size }) => <Repeat size={size} color={color} />,
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
