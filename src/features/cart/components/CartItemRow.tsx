import React from 'react';
import { CartItem } from '@/src/types/order';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from '@/src/lib/router';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (delta: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const itemSubtotal = item.dish.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 gap-4 shadow-xs">
      <div className="flex items-center gap-4">
        <Link href={`/menu/${item.dish.id}`} className="shrink-0">
          <img
            src={item.dish.image}
            alt={item.dish.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-stone-100 dark:border-stone-800"
          />
        </Link>
        <div className="space-y-1">
          <Link
            href={`/menu/${item.dish.id}`}
            className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 hover:text-amber-600 transition-colors line-clamp-1"
          >
            {item.dish.name}
          </Link>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {formatCurrency(item.dish.price)} each
          </div>
          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            {item.dish.category}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 dark:border-stone-800">
        {/* Quantity Controls */}
        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800/80">
          <button
            type="button"
            onClick={() => onUpdateQuantity(-1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            className="p-1.5 sm:p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center font-bold text-sm text-stone-900 dark:text-stone-100 select-none">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(1)}
            aria-label="Increase quantity"
            className="p-1.5 sm:p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[90px]">
          <div className="text-[10px] uppercase font-bold text-stone-400">Subtotal</div>
          <div className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100">
            {formatCurrency(itemSubtotal)}
          </div>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.dish.name} from cart`}
          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
