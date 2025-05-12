import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAdoption } from '../context/AdoptionContext';
import { PerroConEstado } from '../types/dog';
import { esAdoptable } from '../utils/dogUtils';

function DogDetailsScreen() {
  const route = useRoute<{
    key: string;
    name: string;
    params: { dog: PerroConEstado };
  }>();
  const { addAdoptedDog, isAdopted } = useAdoption();

  // Check if route.params exists and has a dog property
  if (!route.params || !route.params.dog) {
    console.error('No dog data in route params');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: No se pudo cargar la información del perro</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { dog } = route.params;

  const adoptable = esAdoptable(dog);
  const alreadyAdopted = isAdopted(dog.nombre);

  // Format dog age text
  const ageText = !dog.edad ? 'Edad desconocida' : dog.edad === 1 ? '1 año' : `${dog.edad} años`;

  // Handle adoption button press
  const handleAdopt = () => {
    if (!adoptable) {
      Alert.alert(
        'No disponible para adopción',
        'Este perro no está disponible para adopción en este momento.',
        [{ text: 'Entendido' }],
      );
      return;
    }

    if (alreadyAdopted) {
      Alert.alert('Ya adoptado', 'Ya has adoptado a este perro.', [{ text: 'Entendido' }]);
      return;
    }

    Alert.alert('Confirmar adopción', `¿Estás seguro de que quieres adoptar a ${dog.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Adoptar',
        onPress: () => {
          addAdoptedDog(dog);
          Alert.alert(
            '¡Felicidades!',
            `Has adoptado a ${dog.nombre}. Puedes ver a tus perros adoptados en la sección "Mis Perros".`,
            [{ text: 'OK' }],
          );
        },
      },
    ]);
  };

  if (!dog.foto) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No se pudo cargar la información del perro</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: dog.foto }} style={styles.image} resizeMode="cover" />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{dog.nombre}</Text>
          <Text style={styles.breed}>{dog.raza}</Text>
          <Text style={styles.age}>{ageText}</Text>

          {dog.distancia != null && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>A {dog.distancia} km de tu ubicación</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                adoptable ? styles.adoptableBadge : styles.notAdoptableBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {adoptable ? 'Disponible para adopción' : 'No adoptable aún'}
              </Text>
            </View>

            {!adoptable && 'motivo' in dog && (
              <Text style={styles.reasonText}>
                Motivo: {dog.motivo === 'enfermo' ? 'Está enfermo' : 'Es muy joven'}
              </Text>
            )}

            {!adoptable && 'fechaDisponible' in dog && (
              <Text style={styles.availableText}>
                Disponible a partir de: {dog.fechaDisponible}
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Sobre {dog.nombre}</Text>
          <Text style={styles.description}>
            {dog.nombre} es un perro de raza {dog.raza?.toLowerCase()}
            {dog.edad ? ` de ${dog.edad} ${dog.edad === 1 ? 'año' : 'años'}` : ''}. Es un compañero
            leal y cariñoso que busca un hogar donde pueda recibir todo el amor que merece.
          </Text>

          <TouchableOpacity
            style={[
              styles.adoptButton,
              !adoptable || alreadyAdopted ? styles.disabledButton : null,
            ]}
            onPress={handleAdopt}
            disabled={!adoptable || alreadyAdopted}
          >
            <Text style={styles.adoptButtonText}>
              {alreadyAdopted
                ? 'Ya has adoptado a este perro'
                : adoptable
                ? 'Adoptar'
                : 'No disponible para adopción'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  breed: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  age: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  adoptableBadge: {
    backgroundColor: '#d4edda',
  },
  notAdoptableBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
  },
  reasonText: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
    fontStyle: 'italic',
  },
  availableText: {
    fontSize: 14,
    color: '#0066cc',
    marginTop: 4,
  },
  distanceContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  distanceText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 16,
  },
  adoptButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  adoptButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
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

export default DogDetailsScreen;
