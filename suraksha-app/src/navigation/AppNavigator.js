import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Phone, User, AlertCircle } from 'lucide-react-native';

import { AuthContext } from '../context/AuthContext';

// Import screens (will create next)
import MapScreen from '../screens/MapScreen';
import SOSScreen from '../screens/SOSScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#111' },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#333',
          paddingBottom: 5,
          height: 60
        },
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ 
          title: 'Suraksha',
          tabBarIcon: ({ color }) => <Home color={color} size={24} /> 
        }} 
      />
      <Tab.Screen 
        name="SOS" 
        component={SOSScreen} 
        options={{ 
          title: 'Emergency',
          tabBarIcon: ({ color }) => <AlertCircle color={color} size={24} />,
          tabBarStyle: { display: 'none' } // Hide tab bar on SOS screen
        }} 
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Phone color={color} size={24} /> 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <User color={color} size={24} /> 
        }} 
      />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null; // or a Splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Root" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
