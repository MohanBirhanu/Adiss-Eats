import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '@/src/types/order';
import { getOrders } from '@/src/lib/api';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { useCart } from '@/src/features/cart/CartContext';
import { useRouter } from '@/src/lib/router';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Modal } from '@/src/components/ui/Modal';
import { DeliveryTrackerMap } from '@/src/components/map/DeliveryTrackerMap';
import { Button } from '@/src/components/ui/Button';
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  Package,
  Bike,
  Timer,
  MapPin,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { reorderItems } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [reorderedOrderId, setReorderedOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('addis_orders_updated', handleUpdate);
    return () => window.removeEventListener('addis_orders_updated', handleUpdate);
  }, []);

  const handleReorder = (order: Order) => {
    reorderItems(order.items);
    setReorderedOrderId(order.id);
    setTimeout(() => {
      setReorderedOrderId(null);
      router.push('/cart');
    }, 800);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <Timer className="w-3.5 h-3.5" /> Order Placed
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
            <Package className="w-3.5 h-3.5" /> Kitchen Preparing
          </span>
        );
      case 'delivering':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 border border-purple-300 dark:border-purple-800">
            <Bike className="w-3.5 h-3.5" /> On the Way
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={<Clock className="w-8 h-8" />}
          title="You haven't placed any orders yet."
          description="Satisfy your hunger with authentic Ethiopian delicacies, gourmet burgers, and fresh pizzas delivered across Addis."
          actionText="Explore Menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Order History
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Track active food orders or instantly re-order previous meals to your cart.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          const isReordered = reorderedOrderId === order.id;

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4 hover:border-amber-500/40 transition-colors"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-base">
                      Order #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Placed on {orderDate} • Delivery to{' '}
                    <strong className="text-stone-700 dark:text-stone-300">{order.customer.area}</strong>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-stone-400">Total</div>
                  <div className="font-extrabold text-lg text-amber-600 dark:text-amber-400">
                    {formatCurrency(order.total)}
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">
                        {item.quantity} × {item.name}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action bar: Live Tracking + Reorder */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Est. Time: <b>{order.estimatedDeliveryTime}</b> ({order.customer.area})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrderForTracking(order)}
                    leftIcon={<Bike className="w-3.5 h-3.5 text-amber-600" />}
                  >
                    Track on Map
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleReorder(order)}
                    isLoading={isReordered}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    {isReordered ? 'Adding...' : 'Reorder'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Map Tracking Modal */}
      {selectedOrderForTracking && (
        <Modal
          isOpen={!!selectedOrderForTracking}
          onClose={() => setSelectedOrderForTracking(null)}
          title={`Live Courier Tracking — Order #${selectedOrderForTracking.id}`}
          description={`Delivering to ${selectedOrderForTracking.customer.name} in ${selectedOrderForTracking.customer.area}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <DeliveryTrackerMap order={selectedOrderForTracking} />
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedOrderForTracking(null)}>
                Close Tracker
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
