import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import DogCard from '../../src/components/DogCard';
import { PerroConEstado } from '../../src/types/dog';
import { TestNavigator } from '../../src/testUtils/navigation/TestNavigator';

describe('DogCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const adoptableDog: PerroConEstado = {
    nombre: 'Max',
    raza: 'labrador',
    foto: 'https://example.com/dog.jpg',
    edad: 3,
    distancia: 2.5,
  };

  const nonAdoptableDog: PerroConEstado = {
    nombre: 'Luna',
    raza: 'golden retriever',
    foto: 'https://example.com/dog2.jpg',
    edad: 1,
    motivo: 'muy joven',
    fechaDisponible: '2023-12-31',
  };

  const nearbyDog: PerroConEstado = {
    nombre: 'Rocky',
    raza: 'bulldog',
    foto: 'https://example.com/dog3.jpg',
    edad: 5,
    distancia: 0.5,
  };

  const unknownAgeDog: PerroConEstado = {
    nombre: 'Bella',
    raza: 'poodle',
    foto: 'https://example.com/dog4.jpg',
  };

  const renderDogCard = (perro: PerroConEstado) =>
    render(
      <TestNavigator name="DogCard" dummyName="DogDetails">
        <DogCard perro={perro} />
      </TestNavigator>,
    );

  test('renders adoptable dog correctly', () => {
    const { getByText, queryByText } = renderDogCard(adoptableDog);

    expect(getByText('Max')).toBeTruthy();
    expect(getByText('labrador')).toBeTruthy();
    expect(getByText('3 años')).toBeTruthy();
    expect(getByText('A 2.5 km de tu ubicación')).toBeTruthy();
    expect(getByText('Disponible para adopción')).toBeTruthy();
    expect(getByText('Max es de raza labrador')).toBeTruthy();
    expect(queryByText(/Motivo:/)).toBeNull();
  });

  test('renders non-adoptable dog correctly', () => {
    const { getByText } = renderDogCard(nonAdoptableDog);

    expect(getByText('Luna')).toBeTruthy();
    expect(getByText('golden retriever')).toBeTruthy();
    expect(getByText('1 año')).toBeTruthy();
    expect(getByText('No adoptable aún')).toBeTruthy();
    expect(getByText('Luna es de raza golden retriever')).toBeTruthy();
    expect(getByText('Motivo: Es muy joven')).toBeTruthy();
  });

  test('renders nearby dog with nearby badge', () => {
    const { getByText } = renderDogCard(nearbyDog);

    expect(getByText('A 0.5 km de tu ubicación')).toBeTruthy();
    expect(getByText('¡Cercano a ti!')).toBeTruthy();
  });

  test('renders dog with unknown age correctly', () => {
    const { getByText } = renderDogCard(unknownAgeDog);

    expect(getByText('Edad desconocida')).toBeTruthy();
  });

  test('navigates to dog details when pressed', async () => {
    const { getByText, findByTestId } = renderDogCard(adoptableDog);

    fireEvent.press(getByText('Max'));

    // Confirm navigation to Dummy (DogDetails) screen
    expect(await findByTestId('dummy-screen')).toBeTruthy();
  });

  test('matches snapshot', () => {
    const { toJSON } = renderDogCard(adoptableDog);

    expect(toJSON()).toMatchSnapshot();
  });
});
