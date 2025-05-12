import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { Screens } from '../../src/navigation/constants.ts';
import { wrapWithAppNavigation } from '../../src/testUtils/navigation/wrapWithAppNavigation.tsx';
import { TestNavigator } from '../../src/testUtils/navigation/TestNavigator.tsx';
import DogDetailsScreen from '../../src/screens/DogDetailsScreen';
import { PerroConEstado } from '../../src/types/dog';
import { wrapWithAdoptionContext } from '../../src/testUtils/context/wrapWithAdoptionContext.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample adoptable dog for initialState
const initialDogDefault: PerroConEstado = {
  nombre: 'Max',
  raza: 'labrador',
  foto: 'https://example.com/dog.jpg',
  edad: 3,
  distancia: 2.5,
};

export const renderWithDogDetails = (initialDog: PerroConEstado | {} = initialDogDefault) => {
  const initialState = {
    routes: [
      {
        name: Screens.Main.name,
        state: {
          routes: [
            {
              name: Screens.DogDetails.name,
              params: { dog: initialDog },
            },
          ],
        },
      },
    ],
  };

  return render(wrapWithAdoptionContext(wrapWithAppNavigation({ initialState })));
};

describe('DogDetailsScreen', () => {
  // Sample adoptable dog
  const adoptableDog: PerroConEstado = {
    nombre: 'Max',
    raza: 'labrador',
    foto: 'https://example.com/dog.jpg',
    edad: 3,
    distancia: 2.5,
  };

  // Sample non-adoptable dog
  const nonAdoptableDog: PerroConEstado = {
    nombre: 'Luna',
    raza: 'golden retriever',
    foto: 'https://example.com/dog2.jpg',
    edad: 1,
    motivo: 'muy joven',
    fechaDisponible: '2023-12-31',
  };

  beforeEach(async () => {
    await AsyncStorage.clear(); // Clear before each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await AsyncStorage.clear(); // Clear after all test
  });

  test('renders adoptable dog details correctly', async () => {
    const { getByText } = renderWithDogDetails();

    await waitFor(() => {
      expect(getByText('Max')).toBeTruthy();
      expect(getByText('labrador')).toBeTruthy();
      expect(getByText('3 años')).toBeTruthy();
      expect(getByText('A 2.5 km de tu ubicación')).toBeTruthy();
      expect(getByText('Disponible para adopción')).toBeTruthy();
      expect(getByText('Adoptar')).toBeTruthy();
    });
  });

  test('renders non-adoptable dog details correctly', () => {
    const { getByText } = renderWithDogDetails(nonAdoptableDog);

    // Check if basic information is displayed
    expect(getByText('Luna')).toBeTruthy();
    expect(getByText('golden retriever')).toBeTruthy();
    expect(getByText('1 año')).toBeTruthy();

    // Check if the correct status is displayed
    expect(getByText('No adoptable aún')).toBeTruthy();
    expect(getByText('Motivo: Es muy joven')).toBeTruthy();
    expect(getByText('Disponible a partir de: 2023-12-31')).toBeTruthy();

    // Check if the adopt button is disabled
    expect(getByText('No disponible para adopción')).toBeTruthy();
  });

  test('renders error when no dog data is provided', () => {
    const { getByText } = renderWithDogDetails({});

    // Check if error message is displayed
    expect(getByText('No se pudo cargar la información del perro')).toBeTruthy();
  });

  test('shows already adopted message when dog is already adopted', async () => {
    // Manually persist the dog into AsyncStorage before rendering
    await AsyncStorage.setItem(
      'adoptedDogs',
      JSON.stringify([adoptableDog]), // simulate previously adopted
    );
    const { getByText } = renderWithDogDetails();

    await waitFor(() => {
      // Check if the already adopted message is displayed
      expect(getByText('Ya has adoptado a este perro')).toBeTruthy();
    });
  });

  test('adopts a dog when adopt button is pressed', () => {
    const { getByText } = renderWithDogDetails();

    // Press the adopt button
    fireEvent.press(getByText('Adoptar'));

    // Check if confirmation alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirmar adopción',
      '¿Estás seguro de que quieres adoptar a Max?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancelar' }),
        expect.objectContaining({ text: 'Adoptar' }),
      ]),
    );

    // Simulate pressing the Adoptar button in the alert
    const adoptHandler = (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress;

    act(() => adoptHandler());

    // Check if success alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      '¡Felicidades!',
      'Has adoptado a Max. Puedes ver a tus perros adoptados en la sección "Mis Perros".',
      expect.arrayContaining([expect.objectContaining({ text: 'OK' })]),
    );
  });

  test('shows message when trying to adopt a non-adoptable dog', () => {
    const { getByText } = renderWithDogDetails(nonAdoptableDog);

    expect(getByText('No disponible para adopción')).toBeTruthy();
  });

  test('matches snapshot', async () => {
    const { toJSON } = render(
      <TestNavigator name="DogDetails" screenParams={{ dog: adoptableDog }}>
        <DogDetailsScreen />
      </TestNavigator>,
    );
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
