import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { obtenerPerros } from '../services/dogService';
import { PerroConEstado } from '../types/dog';
import DogCard from './DogCard';
import { calculateDistance } from '../utils/dogUtils';
import Location from '../../modules/LocationModule/src';

/**
 * DogList component displays a searchable list of dogs
 */
function DogList() {
  // State management
  const [perros, setPerros] = useState<PerroConEstado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to fetch dogs and calculate distances if user location is available
  const fetchDogs = useCallback(
    async (refreshing = false) => {
      try {
        if (!refreshing) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const dogsData = await obtenerPerros();

        // If user location is available, calculate distance for each dog
        if (userLocation) {
          const dogsWithDistance = dogsData.map((dog) => {
            if (dog.ubicacion) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                dog.ubicacion.latitude,
                dog.ubicacion.longitude,
              );
              return { ...dog, distancia: distance };
            }
            return dog;
          });

          // Sort dogs by distance (closest first)
          dogsWithDistance.sort((a, b) => {
            if (!a.distancia) {
              return 1;
            }
            if (!b.distancia) {
              return -1;
            }
            return a.distancia - b.distancia;
          });

          setPerros(dogsWithDistance);
        } else {
          setPerros(dogsData);
        }

        setError(null);
      } catch (err) {
        setError('Error al cargar los perros. Intente nuevamente.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userLocation],
  );

  // Request location permission and get current location
  const requestLocationAndFetchDogs = useCallback(async () => {
    try {
      const permissionStatus = await Location.requestPermission();

      if (permissionStatus === 'granted') {
        const location = await Location.getCurrentLocation();
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        // Fetch dogs again with the new location
        await fetchDogs();
      } else {
        Alert.alert(
          'Permiso denegado',
          'No se pudo acceder a la ubicación. Algunas funciones estarán limitadas.',
          [{ text: 'OK' }],
        );
      }
    } catch (err) {
      console.error('Error getting location:', err);
      Alert.alert('Error', 'No se pudo obtener la ubicación. Por favor, inténtalo de nuevo.', [
        { text: 'OK' },
      ]);
    }
  }, [fetchDogs]);

  // Fetch dogs on component mount
  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  // Filter dogs based on search term
  const perrosFiltrados = useMemo(() => {
    return perros.filter((perro) => perro.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }, [perros, busqueda]);

  // Handle search input changes
  const handleSearchChange = useCallback((text: string) => {
    setBusqueda(text);
  }, []);

  // Render each dog card
  const renderDogCard = useCallback(
    ({ item }: { item: PerroConEstado }) => <DogCard perro={item} />,
    [],
  );

  // Extract unique key for each item
  const keyExtractor = useCallback(
    (item: PerroConEstado, index: number) => `${item.nombre}-${index}`,
    [],
  );

  // Render empty list component
  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {busqueda ? 'No se encontraron perros con ese nombre' : 'No hay perros disponibles'}
        </Text>
      </View>
    ),
    [busqueda],
  );

  return (
    <View style={styles.container}>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => fetchDogs(true)}>
            <Text style={styles.buttonText}>Refrescar Perros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.locationButton]}
            onPress={requestLocationAndFetchDogs}
          >
            <Text style={styles.buttonText}>
              {userLocation ? 'Actualizar Ubicación' : 'Obtener Ubicación'}
            </Text>
          </TouchableOpacity>
        </View>

        {userLocation && (
          <Text style={styles.locationText}>
            Mostrando perros ordenados por cercanía a tu ubicación
          </Text>
        )}
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
          refreshing={isRefreshing}
          onRefresh={() => fetchDogs(true)}
        />
      )}
    </View>
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
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#212529',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButton: {
    backgroundColor: '#28a745',
    marginRight: 0,
    marginLeft: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  locationText: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
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
