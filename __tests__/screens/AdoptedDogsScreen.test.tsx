import { act, render, waitFor } from '@testing-library/react-native';
import { Screens } from '../../src/navigation/constants.ts';
import { wrapWithAppNavigation } from '../../src/testUtils/navigation/wrapWithAppNavigation.tsx';
import { TestNavigator } from '../../src/testUtils/navigation/TestNavigator.tsx';
import AdoptedDogsScreen from '../../src/screens/AdoptedDogsScreen';
import { PerroConEstado } from '../../src/types/dog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrapWithAdoptionContext } from '../../src/testUtils/context/wrapWithAdoptionContext.tsx';

const initialState = {
  routes: [
    {
      name: Screens.Main.name,
      state: {
        routes: [
          {
            name: Screens.Home.name,
            state: {
              index: 1,
              routes: [{ name: Screens.Adoptar.name }, { name: Screens.MisPerros.name }],
            },
          },
        ],
      },
    },
  ],
};

const component = () => render(wrapWithAdoptionContext(wrapWithAppNavigation({ initialState })));

describe('AdoptedDogsScreen', () => {
  // Sample adopted dogs
  const adoptedDogs: PerroConEstado[] = [
    {
      nombre: 'Max',
      raza: 'labrador',
      foto: 'https://example.com/dog.jpg',
      edad: 3,
    },
    {
      nombre: 'Luna',
      raza: 'golden retriever',
      foto: 'https://example.com/dog2.jpg',
      edad: 2,
    },
  ];

  beforeEach(async () => {
    await AsyncStorage.clear(); // Clear before each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await AsyncStorage.clear(); // Clear after all test
  });

  test('renders adopted dogs correctly', async () => {
    await AsyncStorage.setItem('adoptedDogs', JSON.stringify([...adoptedDogs]));

    const { getByText } = component();

    await waitFor(() => {
      // Check if the title is displayed
      expect(getByText('Mis Perros Adoptados')).toBeTruthy();

      // Check if the dogs are displayed
      expect(getByText('Max')).toBeTruthy();
      expect(getByText('Luna')).toBeTruthy();
    });
  });

  test('renders empty state when no dogs are adopted', async () => {
    const { getByText } = component();

    await waitFor(() => {
      // Check if the empty state message is displayed
      expect(getByText('No has adoptado ningún perro todavía')).toBeTruthy();
    });
  });

  test('matches snapshot', async () => {
    const { toJSON } = render(
      <TestNavigator>
        <AdoptedDogsScreen />
      </TestNavigator>,
    );
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
