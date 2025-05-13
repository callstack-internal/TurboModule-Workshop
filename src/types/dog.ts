export interface Perro {
  nombre: string;
  raza: string;
  foto: string;
  edad?: number;
  ubicacion?: {
    latitude: number;
    longitude: number;
  };
  distancia?: number; // Distance from user in kilometers
}

export interface Chip {
  chipId: string;
  fechaRegistro: string;
}

export interface NoAdoptable {
  motivo: 'enfermo' | 'muy joven';
  fechaDisponible: string;
}

export type PerroConChip = Perro & Chip;

export type PerroConEstado = Perro | (Perro & NoAdoptable);
