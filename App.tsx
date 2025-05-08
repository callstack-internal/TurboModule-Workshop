import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import DogList from './src/components/DogList';


function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      <StatusBar />
      <DogList />
    </SafeAreaView>
  );
}

export default App;
