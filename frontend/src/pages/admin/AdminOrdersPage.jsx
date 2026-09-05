import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({ search, status });
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.warn('Error fetching admin orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Order Governance</h1>
          <p className="text-xs text-slate-400 mt-0.5">Audit orders across all registered farmsteads and buyers.</p>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready for Dispatch">Ready for Dispatch</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner size="md" message="Loading platform orders..." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Farmer / Farm</th>
                  <th className="p-4">Crops</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Delivery Slot</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">#{o.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-200 block">{o.customer?.name}</span>
                      <span className="text-[11px] text-slate-500">{o.customer?.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-200 block">{o.farmerProfile?.farmName || o.farmer?.name}</span>
                      <span className="text-[11px] text-slate-500">{o.farmerProfile?.district}, {o.farmerProfile?.state}</span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-4 font-bold text-emerald-400 font-serif">₹{o.total}</td>
                    <td className="p-4 text-slate-400">{o.deliverySlot}</td>
                    <td className="p-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};