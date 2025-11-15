import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const PURPLE = '#7e57c2';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the default header in all tabs
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'white', // White icons when active
        tabBarInactiveTintColor: '#ddd', // Light gray icons when inactive
        tabBarShowLabel: false, // Hide the text label below the icon
      }}
    >
      {/* 1. Home/Today's Tasks Tab (Star Icon - Your Wireframe's Main Page) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="star-outline" color={color} size={28} />
          ),
        }}
      />

      {/* 2. To-Do List Tab (List Icon) */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'To-Do List',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="format-list-checks" color={color} size={28} />
          ),
        }}
      />

      {/* 3. Calendar Tab (Calendar Icon) */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month-outline" color={color} size={28} />
          ),
        }}
      />

      {/* 4. Chat/Messages Tab (Chat Icon) */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat-outline" color={color} size={28} />
          ),
        }}
      />
      
      {/* 5. Settings Tab (Gear Icon) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 80, // Taller bar for better aesthetics
        backgroundColor: PURPLE, // The dark purple bar color from your wireframe
        borderTopWidth: 0,
        elevation: 10,
        borderTopLeftRadius: 30, // Rounded corners on the bar
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 15,
    }
});