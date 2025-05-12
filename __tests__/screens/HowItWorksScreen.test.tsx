import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Screens } from '../../src/navigation/constants.ts';
import { wrapWithAppNavigation } from '../../src/testUtils/navigation/wrapWithAppNavigation.tsx';
import { TestNavigator } from '../../src/testUtils/navigation/TestNavigator.tsx';
import HowItWorksScreen from '../../src/screens/HowItWorksScreen';

const initialState = {
  routes: [
    {
      name: Screens.Main.name,
      state: {
        index: 1,
        routes: [
          {
            name: Screens.Home.name,
          },
          {
            name: Screens.HowItWorks.name,
          },
        ],
      },
    },
  ],
};

const component = () => render(wrapWithAppNavigation({ initialState }));

describe('HowItWorksScreen', () => {
  test('renders correctly with all sections', async () => {
    const { getByText, getByTestId } = component();

    await waitFor(() => {
      expect(getByTestId('back-button')).toBeTruthy();

      // Check if the title is displayed
      expect(getByText('¿Cómo funciona la adopción?')).toBeTruthy();

      // Check if all section titles are displayed
      expect(getByText('1. Explora nuestro catálogo')).toBeTruthy();
      expect(getByText('2. Conoce a los perros')).toBeTruthy();
      expect(getByText('3. Adopta un perro')).toBeTruthy();
      expect(getByText('4. Gestiona tus adopciones')).toBeTruthy();
      expect(getByText('Perros no disponibles')).toBeTruthy();

      // Check if some section text is displayed
      expect(
        getByText(/En la pestaña "Adoptar" encontrarás todos los perros disponibles/),
      ).toBeTruthy();
      expect(getByText(/Toca en cualquier perro para ver más detalles/)).toBeTruthy();
      expect(getByText(/Si un perro está disponible para adopción/)).toBeTruthy();
      expect(getByText(/En la pestaña "Mis Perros" podrás ver todos los perros/)).toBeTruthy();
      expect(getByText(/Algunos perros no están disponibles para adopción inmediata/)).toBeTruthy();
    });
  });

  test('navigates back when back button is pressed', async () => {
    const { getByTestId, getByText } = component();

    await waitFor(() => {
      expect(getByTestId('back-button')).toBeTruthy();
    });

    act(() => fireEvent.press(getByTestId('back-button')));

    await waitFor(() => {
      expect(getByText('Obtener Ubicación')).toBeTruthy();
    });
  });

  test('matches snapshot', async () => {
    const { toJSON } = render(
      <TestNavigator>
        <HowItWorksScreen />
      </TestNavigator>,
    );
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
