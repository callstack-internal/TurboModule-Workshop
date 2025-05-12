import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import DogList from '../../src/components/DogList';
import * as dogService from '../../src/services/dogService';
import LocationModule from '../../modules/LocationModule/src';
import { TestNavigator } from '../../src/testUtils/navigation/TestNavigator.tsx';

// Mock dogService and LocationModule
jest.mock('../../src/services/dogService');

jest.mock('../../modules/LocationModule/src', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(),
    getCurrentLocation: jest.fn(),
  },
}));

const mockDogs = [
  {
    nombre: 'Firulais',
    estado: 'disponible',
    ubicacion: { latitude: 10, longitude: 20 },
  },
  {
    nombre: 'Rocky',
    estado: 'adoptado',
    ubicacion: { latitude: 15, longitude: 25 },
  },
];

const component = () =>
  render(
    <TestNavigator>
      <DogList />
    </TestNavigator>,
  );

describe('DogList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    (dogService.obtenerPerros as jest.Mock).mockResolvedValueOnce(mockDogs);

    const { getByText } = component();
    expect(getByText('Cargando perros...')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('Firulais')).toBeTruthy();
      expect(getByText('Rocky')).toBeTruthy();
    });
  });

  it('renders empty state when no dogs are returned', async () => {
    (dogService.obtenerPerros as jest.Mock).mockResolvedValueOnce([]);

    const { getByText } = component();

    await waitFor(() => {
      expect(getByText('No hay perros disponibles')).toBeTruthy();
    });
  });

  it('filters dogs based on search input', async () => {
    (dogService.obtenerPerros as jest.Mock).mockResolvedValueOnce(mockDogs);

    const { getByPlaceholderText, queryByText } = component();

    await waitFor(() => {
      expect(queryByText('Firulais')).toBeTruthy();
    });

    const searchInput = getByPlaceholderText('Buscar por nombre');
    fireEvent.changeText(searchInput, 'rocky');

    await waitFor(() => {
      expect(queryByText('Firulais')).toBeNull();
      expect(queryByText('Rocky')).toBeTruthy();
    });
  });

  it('requests location and updates dogs with distances', async () => {
    (dogService.obtenerPerros as jest.Mock).mockResolvedValue(mockDogs);
    (LocationModule.requestPermission as jest.Mock).mockResolvedValue('granted');
    (LocationModule.getCurrentLocation as jest.Mock).mockResolvedValue({
      latitude: 12,
      longitude: 22,
    });

    const { getByText } = component();

    await waitFor(() => {
      expect(getByText('Firulais')).toBeTruthy();
    });

    fireEvent.press(getByText('Obtener Ubicación'));

    await waitFor(() => {
      expect(LocationModule.requestPermission).toHaveBeenCalled();
      expect(LocationModule.getCurrentLocation).toHaveBeenCalled();
      expect(getByText('Actualizar Ubicación')).toBeTruthy();
      expect(getByText('Mostrando perros ordenados por cercanía a tu ubicación')).toBeTruthy();
    });
  });

  it('shows error message when fetch fails', async () => {
    (dogService.obtenerPerros as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { getByText } = component();

    await waitFor(() => {
      expect(getByText('Error al cargar los perros. Intente nuevamente.')).toBeTruthy();
    });
  });
});
