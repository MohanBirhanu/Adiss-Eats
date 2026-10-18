import React from 'react';
import { useCart } from '@/src/features/cart/CartContext';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { DELIVERY_ZONES, getEstimatedDeliveryTime } from '@/src/lib/delivery';
import { Button } from '@/src/components/ui/Button';
import { Link } from '@/src/lib/router';
import { ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';

export function CartSummary() {
  const { subtotal, deliveryFee, total, deliveryArea, setDeliveryArea, items } = useCart();
  const estimatedTime = getEstimatedDeliveryTime(deliveryArea);

  if (items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-4">
        Order Summary
      </h3>

      {/* Delivery Zone Selector for Fee preview */}
      <div className="space-y-2">
        <label
          htmlFor="summary-area-select"
          className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
        >
          <MapPin className="w-4 h-4 text-amber-600" />
          Delivery Destination in Addis:
        </label>
        <select
          id="summary-area-select"
          value={deliveryArea}
          onChange={(e) => setDeliveryArea(e.target.value)}
          className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          {Object.values(DELIVERY_ZONES).map((z) => (
            <option key={z.name} value={z.name}>
              {z.name} — ETB {z.fee} ({z.estimatedTime})
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Estimated arrival: <b>{estimatedTime}</b></span>
        </div>
      </div>

      {/* Cost Breakdowns */}
      <div className="space-y-3 pt-2 text-sm">
        <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
          <span>Subtotal</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
          <span className="flex items-center gap-1">
            Delivery Fee ({deliveryArea})
          </span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {formatCurrency(deliveryFee)}
          </span>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex items-center justify-between">
          <span className="font-bold text-base text-stone-900 dark:text-stone-100">Total</span>
          <span className="font-extrabold text-xl text-amber-600 dark:text-amber-400">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Proceed CTA */}
      <div className="space-y-3 pt-2">
        <Link href="/checkout" className="block w-full">
          <Button size="lg" variant="primary" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Proceed to Checkout
          </Button>
        </Link>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pay with Telebirr, CBE Birr or Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
}
