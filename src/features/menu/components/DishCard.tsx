import React, { useState } from 'react';
import { Dish } from '@/src/types/dish';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { useCart } from '@/src/features/cart/CartContext';
import { useFavorites } from '@/src/features/favorites/FavoritesContext';
import { Link } from '@/src/lib/router';
import { Heart, Plus, Check, Flame, Clock, Star } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);
  const favorited = isFavorite(dish.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(dish, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(dish);
  };

  return (
    <div className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Floating Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <Link href={`/menu/${dish.id}`} className="block w-full h-full">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-red-500 shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>

        {/* Category & Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-stone-900/80 backdrop-blur-md text-white">
            {dish.category}
          </span>
          {dish.spicy && (
            <span className="px-2 py-1 text-[11px] font-bold rounded-lg bg-red-600/90 text-white flex items-center gap-0.5">
              <Flame className="w-3 h-3 fill-current" /> Berbere
            </span>
          )}
        </div>

        {/* Prep Time or Rating overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium drop-shadow-md">
          {dish.prepTime && (
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" /> {dish.prepTime}
            </span>
          )}
          {dish.rating && (
            <span className="flex items-center gap-1 bg-amber-500/90 text-stone-950 font-bold px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-current" /> {dish.rating}
            </span>
          )}
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link href={`/menu/${dish.id}`} className="block group-hover:text-amber-600 transition-colors">
            <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 line-clamp-1">
              {dish.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>

          {/* Quick ingredients preview */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {dish.ingredients.slice(0, 3).map((ing) => (
                <span
                  key={ing}
                  className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-1.5 py-0.5 rounded-md"
                >
                  {ing}
                </span>
              ))}
              {dish.ingredients.length > 3 && (
                <span className="text-[10px] text-stone-400 self-center">
                  +{dish.ingredients.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Price</span>
            <div className="font-extrabold text-base sm:text-lg text-amber-600 dark:text-amber-400">
              {formatCurrency(dish.price)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/menu/${dish.id}`}
              className="px-2.5 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Details
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${dish.name} to cart`}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 active:scale-95 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
