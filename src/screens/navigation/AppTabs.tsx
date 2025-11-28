// src/screens/navigation/AppTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

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

        /** 🔵 CORES */
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#9CA3AF',

        /** 🎨 ESTILO DA TABBAR */
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          borderTopWidth: 0,
          backgroundColor: '#FFFFFF',
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          marginHorizontal: 20,
          borderRadius: 20,
          marginBottom: 15,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 6,
        },

        /** 🔘 ANIMAÇÃO DO ÍCONE ATIVO */
        tabBarIcon: ({ color, size, focused }) => {
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

          return (
            <View
              style={{
                padding: 6,
                backgroundColor: focused ? 'rgba(0,122,255,0.15)' : 'transparent',
                borderRadius: 14,
              }}
            >
              <Ionicons
                name={iconName}
                size={focused ? size + 3 : size}
                color={color}
              />
            </View>
          );
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
