export type Category = 'All' | 'Ethiopian' | 'Pizza' | 'Burgers' | 'Drinks';

export interface Dish {
  id: number;
  name: string;
  category: 'Ethiopian' | 'Pizza' | 'Burgers' | 'Drinks';
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  available: boolean;
  spicy?: boolean;
  featured?: boolean;
  prepTime?: string;
  rating?: number;
}
