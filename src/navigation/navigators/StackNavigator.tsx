import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator.tsx';
import DogDetailsScreen from '../../screens/DogDetailsScreen.tsx';
import HowItWorksScreen from '../../screens/HowItWorksScreen.tsx';
import { RootStackParamList } from '../types.ts';
import { Screens } from '../constants.ts';

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
      <Stack.Screen
        name={Screens.Home.name}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.DogDetails.name}
        component={DogDetailsScreen}
        options={({ route }) => {
          // Add error handling for the case where route.params or route.params.dog is undefined
          return {
            title: route.params?.dog?.nombre ?? 'Detalles del perro',
          };
        }}
      />
      <Stack.Screen
        name={Screens.HowItWorks.name}
        component={HowItWorksScreen}
        options={{ title: Screens.HowItWorks.title }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
