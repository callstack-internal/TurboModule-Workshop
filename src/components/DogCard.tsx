import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { PerroConEstado } from '../types/dog';
import { mostrarInfoPerro, esAdoptable } from '../utils/dogUtils';

interface DogCardProps {
  perro: PerroConEstado;
}

/**
 * DogCard component displays information about a single dog
 */
const DogCard: React.FC<DogCardProps> = React.memo(({ perro }) => {
  // Get dog information and adoption status
  const info = useMemo(() => mostrarInfoPerro(perro), [perro]);
  const adoptable = useMemo(() => esAdoptable(perro), [perro]);

  // Get dog age display text
  const ageText = useMemo(() => {
    if (perro.edad === undefined) {
      return 'Edad desconocida';
    }
    return perro.edad === 1 ? '1 año' : `${perro.edad} años`;
  }, [perro.edad]);

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: perro.foto }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{perro.nombre}</Text>
          <Text style={styles.breed}>{perro.raza}</Text>
          <Text style={styles.age}>{ageText}</Text>

          <View style={styles.divider} />

          <View style={styles.statusContainer}>
            <Text style={styles.infoText}>{info}</Text>
            <View style={[
              styles.statusBadge,
              adoptable ? styles.adoptableBadge : styles.notAdoptableBadge
            ]}>
              <Text style={styles.statusText}>
                {adoptable ? 'Disponible para adopción' : 'No adoptable aún'}
              </Text>
            </View>

            {!adoptable && 'motivo' in perro && (
              <Text style={styles.reasonText}>
                Motivo: {perro.motivo === 'enfermo' ? 'Está enfermo' : 'Es muy joven'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// No need for Dimensions since we're using relative sizing

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'column',
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  breed: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  age: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  statusContainer: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 12,
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
});

export default DogCard;
