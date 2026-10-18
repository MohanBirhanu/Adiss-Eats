import React, { useEffect, useState } from 'react';
import { Dish } from '@/src/types/dish';
import { getDishById, getDishes } from '@/src/lib/api';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { useCart } from '@/src/features/cart/CartContext';
import { useFavorites } from '@/src/features/favorites/FavoritesContext';
import { Link, useRouter } from '@/src/lib/router';
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  Clock,
  Star,
  Flame,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { DishCard } from '@/src/features/menu/components/DishCard';

interface DishDetailsPageProps {
  id: string;
}

export default function DishDetailsPage({ id }: DishDetailsPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [dish, setDish] = useState<Dish | null>(null);
  const [relatedDishes, setRelatedDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getDishById(id)
      .then((data) => {
        setDish(data);
        if (data) {
          getDishes().then((all) => {
            const related = all
              .filter((d) => d.category === data.category && d.id !== data.id)
              .slice(0, 3);
            setRelatedDishes(related);
          });
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-28" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-stone-200 dark:bg-stone-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-1/4" />
            <div className="h-20 bg-stone-200 dark:bg-stone-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Dish Not Found"
          description="The dish you are looking for does not exist or may have been removed from our current season menu."
          actionText="Back to Menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  const favorited = isFavorite(dish.id);

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Details Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Large Food Image Container */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-xl border border-stone-200 dark:border-stone-800">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />

            {/* Favorite button */}
            <button
              type="button"
              onClick={() => toggleFavorite(dish)}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md flex items-center justify-center text-stone-700 dark:text-stone-200 hover:text-red-500 shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  favorited ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </button>

            {dish.spicy && (
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                <Flame className="w-3.5 h-3.5 fill-current" /> Authentic Berbere Spiced
              </div>
            )}
          </div>
        </div>

        {/* Content & Ordering Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400">
                {dish.category}
              </span>
              {dish.rating && (
                <span className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {dish.rating} (Verified rating)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {dish.name}
            </h1>

            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 pt-1">
              {formatCurrency(dish.price)}
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            {dish.description}
          </p>

          {/* Ingredients list */}
          <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Ingredients & Preparation:
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {dish.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3 py-1 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium border border-stone-200/60 dark:border-stone-700/60"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Quick info row */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-200 dark:border-stone-800 text-xs">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Prep Time: <b>{dish.prepTime || '20–30 min'}</b></span>
            </div>
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Availability: <b>{dish.available ? 'In Stock (Fresh)' : 'Sold Out'}</b></span>
            </div>
          </div>

          {/* Quantity and Add to Cart Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2 sm:p-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-stone-900 dark:text-stone-100">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 sm:p-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm font-bold text-stone-500">
                Subtotal: <span className="text-stone-900 dark:text-stone-100 font-extrabold">{formatCurrency(dish.price * quantity)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="primary"
                className="flex-1 text-base shadow-md"
                onClick={handleAddToCart}
                disabled={!dish.available}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" /> Added {quantity} to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" /> Add {quantity} to Cart ({formatCurrency(dish.price * quantity)})
                  </>
                )}
              </Button>

              <Link href="/cart">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Dishes */}
      {relatedDishes.length > 0 && (
        <div className="pt-12 border-t border-stone-200 dark:border-stone-800 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              More from {dish.category}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDishes.map((rel) => (
              <DishCard key={rel.id} dish={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
