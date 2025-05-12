import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import DogCard from '../components/DogCard';
import { useAdoption } from '../context/AdoptionContext';
import { PerroConEstado } from '../types/dog';

function AdoptedDogsScreen() {
  // Get adopted dogs from context
  const { adoptedDogs } = useAdoption();

  // Extract unique key for each item
  const keyExtractor = (item: PerroConEstado, index: number) => `${item.nombre}-${index}`;

  // Render each dog card
  const renderDogCard = ({ item }: { item: PerroConEstado }) => <DogCard perro={item} />;

  // Render empty list component
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No has adoptado ningún perro todavía</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <Text style={styles.title}>Mis Perros Adoptados</Text>
      </View>

      <FlatList
        data={adoptedDogs}
        keyExtractor={keyExtractor}
        renderItem={renderDogCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#212529',
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default AdoptedDogsScreen;
