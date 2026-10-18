import React, { useState } from 'react';
import { useCart } from '@/src/features/cart/CartContext';
import { useAuth } from '@/src/features/auth/AuthContext';
import { createOrder } from '@/src/lib/api';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { DELIVERY_ZONES, getEstimatedDeliveryTime } from '@/src/lib/delivery';
import { DeliveryMapPicker } from '@/src/components/map/DeliveryMapPicker';
import { DeliveryTrackerMap } from '@/src/components/map/DeliveryTrackerMap';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Link, useRouter } from '@/src/lib/router';
import { Order } from '@/src/types/order';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryArea, setDeliveryArea, deliveryFee, total, clearCart } = useCart();
  const { user, loginCustomer } = useAuth();

  // Form fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressNotes, setAddressNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Cash on Delivery'>('Telebirr');
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number }>({
    lat: DELIVERY_ZONES[deliveryArea]?.lat || 9.0012,
    lng: DELIVERY_ZONES[deliveryArea]?.lng || 38.7845,
  });

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; phone?: string; area?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Authentication requirement check
  const [authNameInput, setAuthNameInput] = useState('');
  const [authPhoneInput, setAuthPhoneInput] = useState('');
  const [authError, setAuthError] = useState('');

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Your cart is empty."
          description="Please add items to your cart before proceeding to checkout."
          actionText="Browse Menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  // Handle Quick Sign-in if not signed in
  if (!user && !confirmedOrder) {
    const handleQuickLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!authNameInput.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      const clean = authPhoneInput.replace(/\s+/g, '');
      const ethRegex = /^(09|07|\+2519|\+2517)\d{8}$/;
      if (!ethRegex.test(clean)) {
        setAuthError('Please enter a valid Ethiopian phone number (e.g. 0911234567).');
        return;
      }
      loginCustomer(authNameInput.trim(), clean);
      setCustomerName(authNameInput.trim());
      setPhone(clean);
      setAuthError('');
    };

    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            Sign In to Checkout
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Checkout requires a customer account so we can link your delivery address and order tracking.
          </p>
        </div>

        <form onSubmit={handleQuickLogin} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Nahom Birhanu"
            value={authNameInput}
            onChange={(e) => setAuthNameInput(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Ethiopian Mobile Number"
            placeholder="09XXXXXXXX or 07XXXXXXXX"
            value={authPhoneInput}
            onChange={(e) => setAuthPhoneInput(e.target.value)}
            helperText="We will SMS you your driver tracking updates."
            required
          />

          {authError && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900">
              {authError}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full">
            Continue to Order Details
          </Button>
        </form>
      </div>
    );
  }

  // Handle Map Pin or Neighborhood change
  const handleAreaChange = (newArea: string, lat: number, lng: number) => {
    setDeliveryArea(newArea);
    setCustomerCoords({ lat, lng });
    if (errors.area) {
      setErrors((prev) => ({ ...prev, area: undefined }));
    }
  };

  // Order Submission Validation & Handler
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; phone?: string; area?: string } = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      newErrors.name = 'Name is required (at least 2 characters).';
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const ethPhoneRegex = /^(09|07|\+2519|\+2517)\d{8}$/;
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!ethPhoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid Ethiopian phone number (e.g. 0911234567 or 0712345678).';
    }

    if (!deliveryArea) {
      newErrors.area = 'Please select a delivery area.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique Order ID AE-XXXXX
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newOrder: Order = {
        id: `AE-${randomNum}`,
        customer: {
          name: customerName.trim(),
          phone: cleanPhone,
          area: deliveryArea,
          addressNotes: addressNotes.trim(),
          lat: customerCoords.lat,
          lng: customerCoords.lng,
        },
        items: items.map((i) => ({
          dishId: i.dish.id,
          name: i.dish.name,
          price: i.dish.price,
          quantity: i.quantity,
          image: i.dish.image,
        })),
        subtotal,
        deliveryFee,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: getEstimatedDeliveryTime(deliveryArea),
        paymentMethod,
      };

      await createOrder(newOrder);

      // Trigger festive confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#10b981', '#ffffff'],
        });
      } catch (err) {
        console.log('Confetti effect:', err);
      }

      clearCart();
      setConfirmedOrder(newOrder);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Order creation error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ORDER CONFIRMED VIEW
  if (confirmedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-in fade-in duration-300">
        <div className="text-center space-y-3 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully!
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            Thank you for ordering from <strong className="text-amber-600">Addis Eats</strong>. Your food is now being prepared fresh in our kitchen.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 pb-2 border-t border-stone-100 dark:border-stone-800 text-left">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400">Order Number</div>
              <div className="text-lg font-mono font-extrabold text-stone-900 dark:text-stone-100">
                {confirmedOrder.id}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400">Estimated Delivery</div>
              <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {confirmedOrder.estimatedDeliveryTime}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400">Total Paid / COD</div>
              <div className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                {formatCurrency(confirmedOrder.total)}
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Map Delivery Tracker */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            Live Delivery Tracking
          </h2>
          <DeliveryTrackerMap order={confirmedOrder} />
        </div>

        {/* Order Items & Customer Details Summary */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm border-b border-stone-100 dark:border-stone-800 pb-3">
            Summary of Items
          </h3>
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {confirmedOrder.items.map((item) => (
              <div key={item.dishId} className="py-2.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{item.name}</span>
                    <span className="text-xs text-stone-500 ml-2">× {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
            <Link href="/orders">
              <Button size="md" variant="primary">
                View in Order History
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="md" variant="outline">
                Order More Food
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Delivery Checkout
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Complete your contact information and pin your location on our Addis Ababa map.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer Details, Interactive Map, Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                1
              </span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                placeholder="Full Name (e.g. Nahom Birhanu)"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
                required
              />

              <Input
                label="Ethiopian Phone Number"
                placeholder="09XXXXXXXX or 07XXXXXXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                error={errors.phone}
                helperText="Required for delivery driver verification"
                required
              />
            </div>
          </div>

          {/* Delivery Location & Interactive Map */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Delivery Location & Map Pin
              </h2>
            </div>

            <DeliveryMapPicker
              selectedArea={deliveryArea}
              onAreaChange={handleAreaChange}
              customerLat={customerCoords.lat}
              customerLng={customerCoords.lng}
            />

            {errors.area && (
              <p className="text-xs text-red-500 font-medium px-2">{errors.area}</p>
            )}

            {/* Address Notes */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-2">
              <label
                htmlFor="checkout-special-instructions"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                id="checkout-special-instructions"
                rows={2}
                value={addressNotes}
                onChange={(e) => setAddressNotes(e.target.value)}
                placeholder="e.g. Near Edna Mall, 3rd floor apartment 302, please call me when you reach the gate."
                className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                3
              </span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Telebirr', name: 'Telebirr', icon: Smartphone, desc: 'Instant mobile pay' },
                { id: 'CBE Birr', name: 'CBE Birr', icon: CreditCard, desc: 'Commercial Bank' },
                { id: 'Cash on Delivery', name: 'Cash on Delivery', icon: Banknote, desc: 'Pay when food arrives' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <m.icon className={`w-5 h-5 ${paymentMethod === m.id ? 'text-amber-600' : 'text-stone-400'}`} />
                  <div>
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100">{m.name}</div>
                    <div className="text-[10px] text-stone-500">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Order Breakdown & Submit Button */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-3">
              Your Order ({items.length} items)
            </h3>

            {/* Items list preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.dish.id} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-600">{i.quantity}×</span>
                    <span className="text-stone-800 dark:text-stone-200 truncate max-w-[170px]">{i.dish.name}</span>
                  </div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {formatCurrency(i.dish.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery specs */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-700/60 text-xs space-y-1">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Selected Destination:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{deliveryArea}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Estimated Arrival Time:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{getEstimatedDeliveryTime(deliveryArea)}</span>
              </div>
            </div>

            {/* Cost rows */}
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between text-base">
                <span className="font-extrabold text-stone-900 dark:text-stone-100">Total</span>
                <span className="font-extrabold text-xl text-amber-600 dark:text-amber-400">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Validation warning banner if any */}
            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 space-y-1">
                {errors.name && <div>• {errors.name}</div>}
                {errors.phone && <div>• {errors.phone}</div>}
                {errors.area && <div>• {errors.area}</div>}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full text-base shadow-lg shadow-amber-600/25"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Confirm & Place Order ({formatCurrency(total)})
            </Button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & contactless delivery in Addis Ababa</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
