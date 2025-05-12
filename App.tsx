import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerNavigator from './src/navigation/navigators/DrawerNavigator.tsx';
import { AdoptionProvider } from './src/context/AdoptionContext';

function App() {
  return (
    <SafeAreaProvider>
      <AdoptionProvider>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </AdoptionProvider>
    </SafeAreaProvider>
  );
}

export default App;
