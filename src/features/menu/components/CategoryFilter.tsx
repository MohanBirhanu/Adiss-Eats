import React from 'react';
import { useRouter, useSearchParams } from '@/src/lib/router';
import { Utensils, Pizza, Beef, Wine, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  currentCategory: string;
}

const CATEGORIES = [
  { label: 'All Dishes', value: 'All', icon: Sparkles },
  { label: 'Ethiopian', value: 'Ethiopian', icon: Utensils },
  { label: 'Pizza', value: 'Pizza', icon: Pizza },
  { label: 'Burgers', value: 'Burgers', icon: Beef },
  { label: 'Drinks', value: 'Drinks', icon: Wine },
];

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectCategory = (catValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catValue === 'All') {
      params.delete('category');
    } else {
      params.set('category', catValue);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    router.push(`/menu${query}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected =
          (currentCategory === 'All' && cat.value === 'All') ||
          currentCategory.toLowerCase() === cat.value.toLowerCase();

        const Icon = cat.icon;

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleSelectCategory(cat.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
