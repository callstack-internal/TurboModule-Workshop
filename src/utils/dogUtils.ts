import { Perro, PerroConEstado } from '../types/dog';

/**
 * Calculates the distance between two coordinates using the Haversine formula
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert latitude and longitude from degrees to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return parseFloat(distance.toFixed(2)); // Round to 2 decimal places
}

/**
 * Generates a formatted string with the dog's name and breed
 * @param perro - Dog object with name and breed
 * @returns Formatted string with dog information
 */
export function mostrarInfoPerro(perro: Pick<Perro, 'nombre' | 'raza'>): string {
  return `${perro.nombre} es de raza ${perro.raza}`;
}

/**
 * Checks if a dog is available for adoption
 * @param perro - Dog object with potential adoption status
 * @returns True if the dog is adoptable, false otherwise
 */
export function esAdoptable(perro: PerroConEstado): boolean {
  // A dog is not adoptable if it has a 'motivo' property
  return !('motivo' in perro);
}
