import React from 'react';
import { useFavorites } from '@/src/features/favorites/FavoritesContext';
import { DishCard } from '@/src/features/menu/components/DishCard';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-900/60">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Your Saved Delicacies</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Favorite Dishes
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Easily re-order or review your saved Ethiopian dishes, artisan pizzas, and gourmet burgers.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={<Heart className="w-8 h-8 text-red-500" />}
            title="No favorites yet."
            description="Tap the heart on any dish in the menu to save it here for fast reordering."
            actionText="Explore Dishes"
            actionHref="/menu"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
