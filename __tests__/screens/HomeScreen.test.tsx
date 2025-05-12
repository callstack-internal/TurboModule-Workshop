import { render, waitFor } from '@testing-library/react-native';
import { Screens } from '../../src/navigation/constants.ts';
import { wrapWithAppNavigation } from '../../src/testUtils/navigation/wrapWithAppNavigation.tsx';
import { TestNavigator } from '../../src/testUtils/navigation/TestNavigator.tsx';
import HomeScreen from '../../src/screens/HomeScreen.tsx';

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
              routes: [
                {
                  name: Screens.Adoptar.name,
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const component = () => render(wrapWithAppNavigation({ initialState }));

describe('HomeScreen', () => {
  test('renders correctly', async () => {
    const { getByTestId, findByText } = component();

    await waitFor(() => {
      expect(getByTestId('home-screen-container')).toBeTruthy();
      expect(findByText('Catálogo de Perros')).toBeTruthy();
    });
  });

  test('matches snapshot', async () => {
    const { toJSON } = render(
      <TestNavigator>
        <HomeScreen />
      </TestNavigator>,
    );
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
