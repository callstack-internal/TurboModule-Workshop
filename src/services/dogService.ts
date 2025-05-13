import { fetchJson } from './apiClient';
import { Perro, NoAdoptable, PerroConEstado } from '../types/dog';

// Default center coordinates (can be adjusted based on user location)
const DEFAULT_CENTER = {
  latitude: 40.416775, // Madrid coordinates as default
  longitude: -3.70379,
};

/**
 * Generates a random location within a specified radius from a center point
 * @param center - The center coordinates
 * @param radiusKm - The radius in kilometers
 * @returns Random coordinates within the radius
 */
function generateRandomLocation(center = DEFAULT_CENTER, radiusKm = 10) {
  // Earth's radius in kilometers
  const earthRadius = 6371;

  // Convert radius from kilometers to radians
  const radiusInRadian = radiusKm / earthRadius;

  // Generate a random distance within the radius
  const randomDistance = Math.random() * radiusInRadian;

  // Generate a random angle in radians
  const randomAngle = Math.random() * Math.PI * 2;

  // Calculate the random latitude and longitude
  const lat =
    (Math.asin(
      Math.sin((center.latitude * Math.PI) / 180) * Math.cos(randomDistance) +
        Math.cos((center.latitude * Math.PI) / 180) *
          Math.sin(randomDistance) *
          Math.cos(randomAngle),
    ) *
      180) /
    Math.PI;

  const lng =
    (((center.longitude * Math.PI) / 180 +
      Math.atan2(
        Math.sin(randomAngle) *
          Math.sin(randomDistance) *
          Math.cos((center.latitude * Math.PI) / 180),
        Math.cos(randomDistance) -
          Math.sin((center.latitude * Math.PI) / 180) * Math.sin((lat * Math.PI) / 180),
      )) *
      180) /
    Math.PI;

  return { latitude: lat, longitude: lng };
}

// API URL for fetching random dog images
const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random/10';

// List of dog names for random assignment
const DOG_NAMES = [
  'Firulais',
  'Max',
  'Rocky',
  'Luna',
  'Toby',
  'Bella',
  'Coco',
  'Thor',
  'Nina',
  'Simba',
];

/**
 * Extracts the breed name from a dog image URL
 * @param url - The dog image URL from the API
 * @returns The breed name in a readable format
 */
function extractBreedFromUrl(url: string): string {
  const parts = url.split('/');
  const breedIndex = parts.findIndex((p) => p === 'breeds') + 1;

  // Format the breed name by replacing hyphens with spaces and capitalizing
  const breedName = parts[breedIndex]?.split('-').join(' ') || 'desconocida';
  return breedName.charAt(0).toUpperCase() + breedName.slice(1);
}

/**
 * Generates a random dog name from the predefined list
 * @returns A random dog name
 */
function randomName(): string {
  return DOG_NAMES[Math.floor(Math.random() * DOG_NAMES.length)];
}

/**
 * Generates a random age for a dog between 1 and 15 years
 * @returns A random age
 */
function randomAge(): number {
  return Math.floor(Math.random() * 15) + 1;
}

/**
 * Randomly determines if a dog should be marked as not adoptable
 * @param perro - The dog object to potentially mark as not adoptable
 * @returns Either the original dog or a dog with non-adoptable properties
 */
function assignAdoptionStatus(perro: Perro): PerroConEstado {
  // 30% chance of a dog being not adoptable
  if (Math.random() < 0.3) {
    const motivo: NoAdoptable['motivo'] = Math.random() < 0.5 ? 'enfermo' : 'muy joven';

    // Generate a future date for availability (1-30 days from now)
    const daysToAdd = Math.floor(Math.random() * 30) + 1;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysToAdd);

    return {
      ...perro,
      motivo,
      fechaDisponible: futureDate.toISOString().split('T')[0],
    };
  }

  return perro;
}

/**
 * Fetches random dogs from the Dog API and transforms them into dog objects
 * @returns Promise resolving to an array of dog objects
 */
export async function obtenerPerros(): Promise<PerroConEstado[]> {
  try {
    const data = await fetchJson<{ message: string[] }>(DOG_API_URL);

    // Transform API data into dog objects with random properties
    return data.message.map((url) => {
      const perro: Perro = {
        nombre: randomName(),
        raza: extractBreedFromUrl(url),
        foto: url,
        edad: randomAge(),
        ubicacion: generateRandomLocation(), // Add random location
      };

      // Randomly assign adoption status
      return assignAdoptionStatus(perro);
    });
  } catch (error) {
    console.error('Error fetching dogs:', error);
    throw new Error('Failed to fetch dogs from the API');
  }
}
