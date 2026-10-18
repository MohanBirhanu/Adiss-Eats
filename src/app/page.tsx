import React, { useEffect, useState } from 'react';
import { Link } from '@/src/lib/router';
import { Dish } from '@/src/types/dish';
import { getDishes } from '@/src/lib/api';
import { DishCard } from '@/src/features/menu/components/DishCard';
import { Button } from '@/src/components/ui/Button';
import {
  ArrowRight,
  Flame,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Bike,
  Award,
  ChevronRight,
} from 'lucide-react';
import { DELIVERY_ZONES } from '@/src/lib/delivery';

export default function HomePage() {
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDishes()
      .then((dishes) => {
        const featured = dishes.filter((d) => d.featured).slice(0, 6);
        setFeaturedDishes(featured.length > 0 ? featured : dishes.slice(0, 6));
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-500/10 via-stone-50 to-stone-50 dark:from-amber-950/20 dark:via-stone-950 dark:to-stone-950 pt-8 sm:pt-16 pb-12 sm:pb-20 border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold shadow-xs">
                <Flame className="w-4 h-4 text-amber-600 fill-current animate-pulse" />
                <span>Addis Ababa&apos;s #1 Artisanal Food Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.15]">
                Delicious Ethiopian Food,{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-600">
                  Delivered to You.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Taste authentic slow-simmered Doro Wot, sizzling Siga Tibs, fresh fasting Beyaynetu,
                alongside gourmet wood-fired pizza and burgers. Delivered piping hot across Addis Ababa.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/menu" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto shadow-lg shadow-amber-600/25 text-base"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Explore Menu
                  </Button>
                </Link>
                <Link href="/menu?category=Ethiopian" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base"
                  >
                    Traditional Stews
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 dark:border-stone-800 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="font-extrabold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                    25–35 min
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Average ETA</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                    100% Halal
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Fresh Prime Meat</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg sm:text-xl text-amber-600 dark:text-amber-400">
                    4.9 ★
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Over 5,000 Orders</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative blob */}
                <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-amber-500/20 to-orange-500/20 blur-2xl -z-10" />

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 aspect-4/3 sm:aspect-square">
                  <img
                    src="https://i.pinimg.com/1200x/28/ed/65/28ed659fd2e0fb1048d83e2084de4641.jpg"
                    alt="Authentic Ethiopian Doro Wot with Teff Injera"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                  {/* Floating special tag */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        Chef&apos;s Signature
                      </div>
                      <div className="font-extrabold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                        Special Organic Doro Wot
                      </div>
                      <div className="text-xs text-stone-500">With 2 boiled eggs & fresh teff injera</div>
                    </div>
                    <div className="font-extrabold text-amber-600 dark:text-amber-400 text-lg">
                      ETB 450
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked by our Chefs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1">
              Today&apos;s Specials
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Our most popular traditional dishes and contemporary gourmet favorites.
            </p>
          </div>

          <Link href="/menu" className="flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 group">
            <span>View Complete Menu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-4 animate-pulse"
                >
                  <div className="w-full aspect-4/3 bg-stone-200 dark:bg-stone-800 rounded-xl" />
                  <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full" />
                </div>
              ))
            : featuredDishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
        </div>

        {/* Explore Menu Banner CTA */}
        <div className="mt-12 text-center">
          <Link href="/menu">
            <Button size="lg" variant="secondary" className="px-8 shadow-md" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Explore Full Menu (16+ Items)
            </Button>
          </Link>
        </div>
      </section>

      {/* Addis Delivery Zones Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>City-Wide Express Coverage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Fast Delivery Anywhere in Addis Ababa
            </h2>
            <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
              Equipped with insulated hot-delivery bags, our motorcycle and bajaj dispatch fleet delivers
              straight to your doorstep, corporate office, or apartment compound.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {Object.values(DELIVERY_ZONES)
                .slice(0, 4)
                .map((zone) => (
                  <div key={zone.name} className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-3 text-left">
                    <div className="text-xs font-bold text-amber-400">{zone.name}</div>
                    <div className="text-xs text-stone-300 font-mono mt-0.5">ETB {zone.fee}</div>
                    <div className="text-[10px] text-stone-400 mt-1">{zone.minMinutes}–{zone.maxMinutes} min</div>
                  </div>
                ))}
            </div>

            <div className="pt-4">
              <Link href="/checkout">
                <Button size="md" variant="primary" leftIcon={<Bike className="w-4 h-4" />}>
                  Test Interactive Delivery Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
