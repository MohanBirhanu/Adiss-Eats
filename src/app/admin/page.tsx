import React, { useEffect, useState } from 'react';
import { getOrders, getDishes } from '@/src/lib/api';
import { Order } from '@/src/types/order';
import { Dish } from '@/src/types/dish';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { Link } from '@/src/lib/router';
import { Button } from '@/src/components/ui/Button';
import {
  Banknote,
  ShoppingBag,
  TrendingUp,
  Clock,
  Package,
  Bike,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
  Flame,
  Star,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getDishes()]).then(([oData, dData]) => {
      setOrders(oData);
      setDishes(dData);
      setIsLoading(false);
    });
  }, []);

  // Compute analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Status distributions
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const deliveringCount = orders.filter((o) => o.status === 'delivering').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  // Compute top selling dishes by frequency in order items
  const itemCounts: Record<string, { name: string; count: number; image: string; revenue: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = {
          name: item.name,
          count: 0,
          image: item.image,
          revenue: 0,
        };
      }
      itemCounts[item.name].count += item.quantity;
      itemCounts[item.name].revenue += item.price * item.quantity;
    });
  });

  const topSelling = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Real-Time Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Restaurant Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Monitoring sales, kitchen fulfillment pipelines, and delivery fleets across Addis Ababa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/orders">
            <Button size="sm" variant="primary" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Manage Orders ({pendingCount + preparingCount + deliveringCount} Active)
            </Button>
          </Link>
          <Link href="/admin/menu">
            <Button size="sm" variant="outline" leftIcon={<UtensilsCrossed className="w-4 h-4" />}>
              Menu Items ({dishes.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Platform Revenue
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last week
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Orders Placed
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {totalOrdersCount}
            </div>
            <div className="text-[11px] text-stone-500">Across 8 delivery zones</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Average Order Value (AOV)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {formatCurrency(avgOrderValue)}
            </div>
            <div className="text-[11px] text-stone-500">Includes delivery fee average</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Order Status Distribution + Top Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order Status Breakdown */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Order Status Pipeline
            </h3>
            <span className="text-xs text-stone-400">{totalOrdersCount} total</span>
          </div>

          <div className="space-y-4">
            {/* Pending */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Clock className="w-3.5 h-3.5" /> Pending Kitchen Confirmation
                </span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{pendingCount}</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${totalOrdersCount ? (pendingCount / totalOrdersCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Preparing */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <Package className="w-3.5 h-3.5" /> In Kitchen / Cooking
                </span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{preparingCount}</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${totalOrdersCount ? (preparingCount / totalOrdersCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Delivering */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-purple-600">
                  <Bike className="w-3.5 h-3.5" /> Out for Delivery
                </span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{deliveringCount}</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${totalOrdersCount ? (deliveringCount / totalOrdersCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Delivered */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed & Delivered
                </span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{deliveredCount}</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${totalOrdersCount ? (deliveredCount / totalOrdersCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <Link href="/admin/orders" className="block pt-2">
            <Button size="sm" variant="outline" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Orders Workflow
            </Button>
          </Link>
        </div>

        {/* Top Selling Dishes */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Top Selling Dishes
            </h3>
            <span className="text-xs text-stone-400">By customer orders</span>
          </div>

          {topSelling.length === 0 ? (
            <p className="text-xs text-stone-500">No dish order stats yet.</p>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {topSelling.map((item, idx) => (
                <div key={item.name} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-400 text-xs w-4">#{idx + 1}</span>
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">{item.name}</div>
                      <div className="text-[11px] text-stone-500">{item.count} portions sold</div>
                    </div>
                  </div>
                  <div className="font-extrabold text-amber-600 dark:text-amber-400">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link href="/admin/menu" className="block pt-2">
            <Button size="sm" variant="outline" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Manage Dish Inventory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
