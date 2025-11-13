// src/screens/navigation/AppTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import RegisterPhoto from '../home/index';
import Profile from '../home/profile';
import ScanScreen from '../home/scan';

export type RootTabParamList = {
  RegisterPhoto: undefined;
  Scan: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'RegisterPhoto':
              iconName = 'home-outline';
              break;
            case 'Scan':
              iconName = 'scan-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="RegisterPhoto"
        component={RegisterPhoto}
        options={{ title: 'Início' }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{ title: 'Scanner' }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
