import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function HowItWorksScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.goBack()}
            testID="back-button"
          >
            <Icon name="arrow-left" size={24} color="#212529" />
          </TouchableOpacity>
          <Text style={styles.title}>¿Cómo funciona la adopción?</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Explora nuestro catálogo</Text>
          <Text style={styles.sectionText}>
            En la pestaña "Adoptar" encontrarás todos los perros disponibles para adopción. Puedes
            buscar por nombre y ordenarlos por cercanía a tu ubicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Conoce a los perros</Text>
          <Text style={styles.sectionText}>
            Toca en cualquier perro para ver más detalles sobre él. Podrás ver su edad, raza,
            ubicación y si está disponible para adopción.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Adopta un perro</Text>
          <Text style={styles.sectionText}>
            Si un perro está disponible para adopción, verás un botón "Adoptar" en su página de
            detalles. Al presionarlo, confirmarás tu intención de adoptar.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Gestiona tus adopciones</Text>
          <Text style={styles.sectionText}>
            En la pestaña "Mis Perros" podrás ver todos los perros que has adoptado. Esta lista se
            guarda automáticamente, así que no perderás tus adopciones aunque cierres la aplicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perros no disponibles</Text>
          <Text style={styles.sectionText}>
            Algunos perros no están disponibles para adopción inmediata. Esto puede deberse a que
            están enfermos o son muy jóvenes. En estos casos, verás la fecha a partir de la cual
            estarán disponibles.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 24,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
});

export default HowItWorksScreen;
