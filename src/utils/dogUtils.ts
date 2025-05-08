import { Perro, PerroConEstado } from '../types/dog';

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
