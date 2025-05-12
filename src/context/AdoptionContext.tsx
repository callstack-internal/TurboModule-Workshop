import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PerroConEstado } from '../types/dog';

// Define the context shape
interface AdoptionContextType {
  adoptedDogs: PerroConEstado[];
  addAdoptedDog: (dog: PerroConEstado) => void;
  removeAdoptedDog: (dogName: string) => void;
  isAdopted: (dogName: string) => boolean;
}

// Create the context with a default value
const AdoptionContext = createContext<AdoptionContextType>({
  adoptedDogs: [],
  addAdoptedDog: () => {},
  removeAdoptedDog: () => {},
  isAdopted: () => false,
});

// Custom hook to use the adoption context
export const useAdoption = () => useContext(AdoptionContext);

// Storage key for persisting adopted dogs
const STORAGE_KEY = 'adoptedDogs';

// Provider component
export function AdoptionProvider({ children }: { children: React.ReactNode }) {
  const [adoptedDogs, setAdoptedDogs] = useState<PerroConEstado[]>([]);

  // Load adopted dogs from storage on mount
  useEffect(() => {
    const loadAdoptedDogs = async () => {
      try {
        const savedDogs = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedDogs) {
          setAdoptedDogs(JSON.parse(savedDogs));
        }
      } catch (error) {
        console.error('Failed to load adopted dogs:', error);
        Alert.alert('Error', 'Failed to load adopted dogs');
      }
    };

    loadAdoptedDogs();
  }, []);

  // Save adopted dogs to storage whenever the list changes
  useEffect(() => {
    const saveAdoptedDogs = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(adoptedDogs));
      } catch (error) {
        console.error('Failed to save adopted dogs:', error);
        Alert.alert('Error', 'Failed to save adopted dogs');
      }
    };

    if (adoptedDogs.length > 0) {
      saveAdoptedDogs();
    }
  }, [adoptedDogs]);

  // Add a dog to the adopted list
  const addAdoptedDog = (dog: PerroConEstado) => {
    // Check if dog is already adopted
    if (!isAdopted(dog.nombre)) {
      setAdoptedDogs((prev) => [...prev, dog]);
    }
  };

  // Remove a dog from the adopted list
  const removeAdoptedDog = (dogName: string) => {
    setAdoptedDogs((prev) => prev.filter((dog) => dog.nombre !== dogName));
  };

  // Check if a dog is already adopted
  const isAdopted = (dogName: string) => {
    return adoptedDogs.some((dog) => dog.nombre === dogName);
  };

  return (
    <AdoptionContext.Provider
      value={{
        adoptedDogs,
        addAdoptedDog,
        removeAdoptedDog,
        isAdopted,
      }}
    >
      {children}
    </AdoptionContext.Provider>
  );
}

export default AdoptionContext;
