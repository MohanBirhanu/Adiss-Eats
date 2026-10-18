import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Dish } from '@/src/types/dish';

interface FavoritesContextType {
  favorites: Dish[];
  isFavorite: (dishId: number) => boolean;
  toggleFavorite: (dish: Dish) => void;
  removeFavorite: (dishId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  removeFavorite: () => {},
});

const FAVORITES_STORAGE_KEY = 'addis_eats_favorites_v1';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Dish[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (dishId: number): boolean => {
    return favorites.some((item) => item.id === dishId);
  };

  const toggleFavorite = (dish: Dish) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === dish.id);
      if (exists) {
        return prev.filter((item) => item.id !== dish.id);
      }
      return [...prev, dish];
    });
  };

  const removeFavorite = (dishId: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== dishId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
