import React from 'react';
import { useCart } from '@/src/features/cart/CartContext';
import { CartItemRow } from '@/src/features/cart/components/CartItemRow';
import { CartSummary } from '@/src/features/cart/components/CartSummary';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from '@/src/lib/router';
import { Button } from '@/src/components/ui/Button';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Your cart is empty."
          description="Discover something delicious from our traditional stews, artisan pizzas, or burgers."
          actionText="Browse Menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            Shopping Cart
            <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">
              ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Review your order before proceeding to delivery checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/menu">
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Add More Food
            </Button>
          </Link>

          <Button
            size="sm"
            variant="ghost"
            onClick={clearCart}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-stone-400" />}
            className="text-stone-500 hover:text-red-500"
          >
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Main Grid: Cart Items List + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={item.dish.id}
              item={item}
              onUpdateQuantity={(delta) => updateQuantity(item.dish.id, delta)}
              onRemove={() => removeFromCart(item.dish.id)}
            />
          ))}
        </div>

        {/* Order Summary & Delivery calculation */}
        <div className="lg:col-span-4 sticky top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
