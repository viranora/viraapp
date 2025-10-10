import { Header } from '@/components/Header';
import { TabBarIcon } from '@/components/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        header: () => <Header />,
      }}>
      <Tabs.Screen
        name="pano"
        options={{
          title: 'Pano',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'grid' : 'grid-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vira"
        options={{
          title: 'Vira',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals" // <-- BURASI "zaferler" idi, "goals" OLARAK DÜZELTİLDİ
        options={{
          title: 'Görevler',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />,
        }}
      />
    </Tabs>
  );
}