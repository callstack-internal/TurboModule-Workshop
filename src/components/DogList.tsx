import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { obtenerPerros } from '../services/dogService';
import { PerroConEstado } from '../types/dog';
import DogCard from './DogCard';

/**
 * DogList component displays a searchable list of dogs
 */
const DogList: React.FC = () => {
  // State management
  const [perros, setPerros] = useState<PerroConEstado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dogs data on component mount
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setIsLoading(true);
        const dogsData = await obtenerPerros();
        setPerros(dogsData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los perros. Intente nuevamente.');
        console.error('Error fetching dogs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, []);

  // Filter dogs based on search term
  const perrosFiltrados = useMemo(() => {
    return perros.filter(perro =>
      perro.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [perros, busqueda]);

  // Handle search input changes
  const handleSearchChange = useCallback((text: string) => {
    setBusqueda(text);
  }, []);

  // Render each dog card
  const renderDogCard = useCallback(({ item }: { item: PerroConEstado }) => (
    <DogCard perro={item} />
  ), []);

  // Extract unique key for each item
  const keyExtractor = useCallback((item: PerroConEstado, index: number) =>
    `${item.nombre}-${index}`, []);

  // Render empty list component
  const renderEmptyList = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {busqueda ? 'No se encontraron perros con ese nombre' : 'No hay perros disponibles'}
      </Text>
    </View>
  ), [busqueda]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <Text style={styles.title}>Catálogo de Perros</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre"
          placeholderTextColor="#6c757d"
          onChangeText={handleSearchChange}
          value={busqueda}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Cargando perros...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={perrosFiltrados}
          keyExtractor={keyExtractor}
          renderItem={renderDogCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

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
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#212529',
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default DogList;
