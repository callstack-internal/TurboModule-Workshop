// This file will be used to set up the testing environment for React Native Testing Library

import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock the react-native-reanimated module
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  __esModule: true,
  default: {
    alert: jest.fn(),
  },
}));

// Mock dogService - MSW would be a better choice.(https://mswjs.io/)
jest.mock('../src/services/dogService', () => ({
  __esModule: true,
  obtenerPerros: jest.fn(() =>
    Promise.resolve([
      {
        nombre: 'Mocky',
        raza: 'labrador',
        foto: 'https://mocked-url.com/mocky.jpg',
        edad: 5,
        ubicacion: {
          latitude: 40.4168,
          longitude: -3.7038,
        },
      },
      {
        nombre: 'Luna',
        raza: 'golden retriever',
        foto: 'https://mocked-url.com/luna.jpg',
        edad: 2,
        motivo: 'muy joven',
        fechaDisponible: '2025-06-01',
      },
      {
        nombre: 'Rex',
        raza: 'beagle',
        foto: 'https://mocked-url.com/rex.jpg',
        edad: 4,
        ubicacion: {
          latitude: 40.417,
          longitude: -3.704,
        },
      },
      {
        nombre: 'Nina',
        raza: 'border collie',
        foto: 'https://mocked-url.com/nina.jpg',
        edad: 1,
        motivo: 'enfermo',
        fechaDisponible: '2025-05-20',
      },
      {
        nombre: 'Simba',
        raza: 'pomerania',
        foto: 'https://mocked-url.com/simba.jpg',
        edad: 3,
        ubicacion: {
          latitude: 40.418,
          longitude: -3.705,
        },
      },
    ]),
  ),
}));

// Mock the react-native-vector-icons module
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedModule');

// Mock any custom modules if needed
jest.mock('../modules/LocationModule', () => ({
  // Add mock implementations as needed
}));

// Set up global variables for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  }),
);
