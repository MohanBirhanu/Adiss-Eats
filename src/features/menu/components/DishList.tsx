import React from 'react';
import { Dish } from '@/src/types/dish';
import { DishCard } from './DishCard';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Utensils } from 'lucide-react';

interface DishListProps {
  dishes: Dish[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

export function DishList({ dishes, isLoading, onResetFilters }: DishListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden p-4 space-y-4 animate-pulse"
          >
            <div className="w-full aspect-4/3 bg-stone-200 dark:bg-stone-800 rounded-xl" />
            <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-3/4" />
            <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded-md w-full" />
            <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded-md w-1/2" />
            <div className="pt-2 flex justify-between items-center">
              <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-20" />
              <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-xl w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <EmptyState
        icon={<Utensils className="w-8 h-8" />}
        title="No dishes found."
        description="Try adjusting your search terms or selecting another category to discover delicious meals."
        actionText={onResetFilters ? 'View All Dishes' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
