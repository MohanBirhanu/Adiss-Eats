import React, { useEffect, useState, useMemo } from 'react';
import { Order, OrderStatus } from '@/src/types/order';
import { getOrders, updateOrderStatus, deleteOrder } from '@/src/lib/api';
import { formatCurrency } from '@/src/lib/formatCurrency';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { DeliveryTrackerMap } from '@/src/components/map/DeliveryTrackerMap';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Package,
  Bike,
  Timer,
  Trash2,
  Eye,
  AlertTriangle,
  MapPin,
  Phone,
  Calendar,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

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

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    await deleteOrder(orderToDelete.id);
    setDeleteModalOpen(false);
    setOrderToDelete(null);
    if (selectedOrder?.id === orderToDelete.id) {
      setSelectedOrder(null);
    }
    await loadOrders();
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.area.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Order Fulfillment Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Dispatch orders, transition fulfillment statuses, and inspect live courier positions.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900 self-start sm:self-auto">
          {orders.length} total recorded orders
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by ID (e.g. AE-10291), customer name, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'pending', 'preparing', 'delivering', 'delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 text-xs rounded-xl font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider text-stone-500 font-bold">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                      {order.id}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      {order.customer.name}
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      {order.customer.phone}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {order.customer.area}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-xs text-stone-600 dark:text-stone-300">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </div>
                    <div className="text-[11px] text-stone-400 truncate max-w-[140px]">
                      {order.items.map((i) => i.name).join(', ')}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                        order.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : order.status === 'preparing'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : order.status === 'delivering'
                          ? 'bg-purple-50 text-purple-700 border-purple-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivering">Delivering</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                        title="View Order Details & Map Tracker"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderToDelete(order);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Live Courier Tracker Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Management #${selectedOrder.id}`}
          description={`Customer: ${selectedOrder.customer.name} • ${selectedOrder.customer.phone}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Live interactive map */}
            <DeliveryTrackerMap order={selectedOrder} />

            {/* Status change actions in modal */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Update Fulfillment Phase:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['pending', 'preparing', 'delivering', 'delivered'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`py-2 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${
                      selectedOrder.status === st
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Items details */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Order Items</h4>
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {item.quantity} × {item.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address notes if any */}
            {selectedOrder.customer.addressNotes && (
              <div className="text-xs bg-stone-100 dark:bg-stone-800 p-3 rounded-xl text-stone-700 dark:text-stone-300">
                <span className="font-bold">Instructions: </span>
                {selectedOrder.customer.addressNotes}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedOrder(null)}>
                Close Order Inspection
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Order Record"
        description="Are you sure you want to delete this customer order record?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
            <span>
              Order: <strong>{orderToDelete?.id}</strong> ({orderToDelete?.customer.name})
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
