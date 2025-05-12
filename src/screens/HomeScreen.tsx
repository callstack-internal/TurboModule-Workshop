import React from 'react';
import { StyleSheet, View } from 'react-native';
import DogList from '../components/DogList';

function HomeScreen() {
  return (
    <View style={styles.container} testID="home-screen-container">
      <DogList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default HomeScreen;
