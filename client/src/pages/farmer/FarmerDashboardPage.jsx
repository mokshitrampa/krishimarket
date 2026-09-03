import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  Star,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { farmerService } from '../../services/farmerService';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const FarmerDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [anaRes, ordRes, prodRes] = await Promise.all([
          farmerService.getAnalytics(),
          orderService.getFarmerOrders({ limit: 5 }),
          productService.getMyProducts()
        ]);

        if (anaRes.success) setAnalytics(anaRes.data);
        if (ordRes.success) setRecentOrders(ordRes.data);
        if (prodRes.success) setProducts(prodRes.data);
      } catch (err) {
        console.warn('Error fetching farmer dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your farm operational hub..." />;
  }

  const {
    totalSales = 0,
    totalOrders = 0,
    pendingOrders = 0,
    completedOrders = 0,
    avgOrderValue = 0,
    rating = 4.8,
    monthlyRevenue = []
  } = analytics || {};

  const lowStockCount = products.filter((p) => p.stock < 10).length;
  const activeProductsCount = products.filter((p) => p.available).length;

  return (
    <div className="space-y-8">
      {/* 1. Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Operational Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time harvest inventory, incoming orders, and revenue realization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/farmer/products?action=new"
            className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus size={15} /> Add New Harvest Crop
          </Link>
          <Link
            to="/farmer/orders"
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            Dispatch Orders
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Farm Revenue</span>
            <div className="p-2 rounded-xl bg-forest-50 text-forest-800">
              <DollarSign size={18} />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-serif">₹{totalSales}</span>
          <span className="text-[11px] text-emerald-700 font-medium block">
            Avg Order: ₹{avgOrderValue}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Incoming Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <ShoppingBag size={18} />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-serif">
            {pendingOrders}
          </span>
          <span className="text-[11px] text-amber-700 font-medium block">
            Needs confirmation / harvest
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Active Listings</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <Package size={18} />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-serif">
            {activeProductsCount}
          </span>
          <span className="text-[11px] text-slate-400 font-medium block">
            {lowStockCount > 0 ? (
              <span className="text-rose-600 font-bold">{lowStockCount} low stock alerts</span>
            ) : (
              'All healthy inventory levels'
            )}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Producer Rating</span>
            <div className="p-2 rounded-xl bg-harvest-50 text-harvest-800">
              <Star size={18} className="fill-harvest-500 text-harvest-500" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-serif">
            {rating ? rating.toFixed(1) : '4.8'}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium block">
            {completedOrders} fulfilled deliveries
          </span>
        </div>
      </div>

      {/* 3. Recharts Revenue Trend & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Revenue & Sales Trend</h3>
              <p className="text-xs text-slate-500">Monthly direct farmgate realizations</p>
            </div>
            <Link
              to="/farmer/analytics"
              className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="farmRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c5b45" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2c5b45" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Revenue']}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2c5b45"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#farmRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Quick Status (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 font-serif">Low Stock Notice</h3>
            <Link to="/farmer/products" className="text-xs font-bold text-forest-700 hover:underline">
              Inventory
            </Link>
          </div>

          {products.filter((p) => p.stock < 15).length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
              <p className="text-xs font-bold text-slate-800">Sufficient Harvest Stock</p>
              <p className="text-[11px] text-slate-400">All your active crops have adequate harvest inventory.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products
                .filter((p) => p.stock < 15)
                .slice(0, 4)
                .map((prod) => (
                  <div
                    key={prod._id}
                    className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{prod.name}</span>
                      <span className="text-[11px] text-slate-500 font-serif">₹{prod.price} / {prod.unit}</span>
                    </div>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {prod.stock} left
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Recent Incoming Orders */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Latest Order Activity</h3>
            <p className="text-xs text-slate-500">Orders placed by consumers for your farmstead</p>
          </div>
          <Link to="/farmer/orders" className="text-xs font-bold text-forest-700 hover:underline">
            View All Incoming Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Order #</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Crops</th>
                  <th className="pb-3 font-semibold">Slot</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900">#{ord.orderNumber}</td>
                    <td className="py-3.5 font-semibold text-slate-700">{ord.customer?.name}</td>
                    <td className="py-3.5 text-slate-500 truncate max-w-[180px]">
                      {ord.items.map((i) => i.name).join(', ')}
                    </td>
                    <td className="py-3.5 text-slate-600">{ord.deliverySlot}</td>
                    <td className="py-3.5 font-bold text-forest-950 font-serif text-sm">
                      ₹{ord.total}
                    </td>
                    <td className="py-3.5">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/farmer/orders"
                        className="font-bold text-forest-700 hover:text-forest-900"
                      >
                        Update →
                      </Link>
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