import { PerroConEstado } from '../types/dog.ts';

export type RouteNamesParamList = RootStackParamList | DrawerParamList;

export type RootStackParamList = {
  Home: undefined;
  AdoptedDogs: undefined;
  DogDetails: { dog: PerroConEstado };
  HowItWorks: undefined;
};

export type DrawerParamList = {
  Main: undefined;
  HowItWorks: undefined;
};
