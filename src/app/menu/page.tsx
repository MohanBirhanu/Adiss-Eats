import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from '@/src/lib/router';
import { Dish } from '@/src/types/dish';
import { getDishes } from '@/src/lib/api';
import { SearchBar } from '@/src/features/menu/components/SearchBar';
import { CategoryFilter } from '@/src/features/menu/components/CategoryFilter';
import { DishList } from '@/src/features/menu/components/DishList';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDishes = async () => {
      setIsLoading(true);
      const data = await getDishes();
      setDishes(data);
      setIsLoading(false);
    };

    loadDishes();

    // Listen to admin CRUD updates
    const handleDishesUpdated = () => {
      loadDishes();
    };
    window.addEventListener('addis_dishes_updated', handleDishesUpdated);
    return () => window.removeEventListener('addis_dishes_updated', handleDishesUpdated);
  }, []);

  // Filter dishes by active category and search query
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category match
      const categoryMatch =
        activeCategory === 'All' ||
        dish.category.toLowerCase() === activeCategory.toLowerCase();

      // Search match (name, description, ingredients)
      const q = searchQuery.toLowerCase().trim();
      const searchMatch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q) ||
        (dish.ingredients && dish.ingredients.some((i) => i.toLowerCase().includes(q)));

      return categoryMatch && searchMatch;
    });
  }, [dishes, activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-300 dark:border-amber-800">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Our Delicious Culinary Selection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Explore Addis Eats Menu
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl">
          Order traditional Ethiopian delights with injera, wood-fired artisan pizza, double-smashed burgers, and freshly pressed juices.
        </p>
      </div>

      {/* Search and Category Control Bar */}
      <div className="space-y-4 bg-stone-50 dark:bg-stone-900/60 p-4 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search menu by dish name, spice, or ingredient (e.g. Tibs, Shiro, Pizza, Kitfo)..."
        />

        <div className="pt-1">
          <CategoryFilter currentCategory={activeCategory} />
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 dark:text-stone-400">
        <span>
          Showing <strong className="text-stone-900 dark:text-stone-100">{filteredDishes.length}</strong> {filteredDishes.length === 1 ? 'dish' : 'dishes'}
          {activeCategory !== 'All' && <span> in <span className="font-semibold text-amber-600">{activeCategory}</span></span>}
          {searchQuery && <span> matching &ldquo;<span className="font-semibold text-stone-800 dark:text-stone-200">{searchQuery}</span>&rdquo;</span>}
        </span>

        {(activeCategory !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              window.history.pushState({}, '', '/menu');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Dish List */}
      <DishList
        dishes={filteredDishes}
        isLoading={isLoading}
        onResetFilters={() => {
          setSearchQuery('');
          window.history.pushState({}, '', '/menu');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
      />
    </div>
  );
}
