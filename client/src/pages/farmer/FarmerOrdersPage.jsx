import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, Clock, Truck, Check, AlertCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';

export const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useCart();

  const statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Dispatch',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getFarmerOrders({ status: statusFilter });
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.warn('Error loading farmer orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          Incoming Consumer Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, harvest, pack, and transition delivery states for direct household orders.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === s
                ? 'bg-forest-800 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="md" message="Loading customer orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders in this category"
          description="Incoming orders placed by consumers will appear here in real time."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Order #</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Crops & Quantities</th>
                  <th className="p-4 font-semibold">Scheduled Slot</th>
                  <th className="p-4 font-semibold">Total Realization</th>
                  <th className="p-4 font-semibold">Current State</th>
                  <th className="p-4 font-semibold text-right">Advance Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      #{ord.orderNumber}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{ord.customer?.name}</span>
                      <span className="text-slate-400 block">{ord.customer?.phone}</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[140px]">
                        {ord.deliveryAddress?.city}, {ord.deliveryAddress?.district}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-slate-700">
                            <strong>{it.quantity}x</strong> {it.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-600">
                      {ord.deliverySlot}
                      {ord.deliveryInstructions && (
                        <span className="text-[10px] text-amber-700 block italic mt-0.5">
                          Note: {ord.deliveryInstructions}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-extrabold text-forest-950 font-serif text-sm">
                      ₹{ord.total}
                      <span className="text-[10px] font-normal text-slate-400 block">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="p-4 text-right">
                      {/* State transition buttons */}
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Confirmed')}
                            disabled={updatingId === ord._id}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                          >
                            Accept Order
                          </button>
                        )}
                        {ord.status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Preparing')}
                            disabled={updatingId === ord._id}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                          >
                            Start Harvest
                          </button>
                        )}
                        {ord.status === 'Preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Ready for Dispatch')}
                            disabled={updatingId === ord._id}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs"
                          >
                            Ready to Dispatch
                          </button>
                        )}
                        {ord.status === 'Ready for Dispatch' && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Out for Delivery')}
                            disabled={updatingId === ord._id}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                          >
                            Dispatch Vehicle
                          </button>
                        )}
                        {ord.status === 'Out for Delivery' && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Delivered')}
                            disabled={updatingId === ord._id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Cancelled')}
                            disabled={updatingId === ord._id}
                            className="px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                        {ord.status === 'Delivered' && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <Check size={13} /> Complete
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};