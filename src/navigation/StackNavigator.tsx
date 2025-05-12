import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DogDetailsScreen from '../screens/DogDetailsScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import { RootStackParamList } from '../screens/DogDetailsScreen';

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#212529',
        },
        headerTintColor: '#28a745',
      }}
    >
      <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="DogDetails"
        component={DogDetailsScreen}
        options={({ route }) => {
          console.log('[DEBUG] DogDetails route params:', route.params);
          // Add error handling for the case where route.params or route.params.dog is undefined
          return {
            title: route.params?.dog?.nombre || 'Detalles del perro',
          };
        }}
      />
      <Stack.Screen
        name="HowItWorks"
        component={HowItWorksScreen}
        options={{ title: 'Cómo funciona' }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
