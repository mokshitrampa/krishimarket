import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Package
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { farmerService } from '../../services/farmerService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const FarmerAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await farmerService.getAnalytics();
        if (res.success) setAnalytics(res.data);
      } catch (err) {
        console.warn('Error loading analytics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Synthesizing sales performance metrics..." />;
  }

  const {
    totalSales = 0,
    totalOrders = 0,
    avgOrderValue = 0,
    fulfilmentRate = 98,
    monthlyRevenue = [],
    topProducts = [],
    repeatCustomerCount = 0
  } = analytics || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          Farm Sales & Business Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Operational revenue realizations, order trends, product velocity, and customer loyalty.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Farm Realization</span>
          <span className="text-3xl font-extrabold text-slate-900 font-serif block">₹{totalSales}</span>
          <span className="text-[11px] text-emerald-700 font-medium">85%+ of consumer spend</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Volume</span>
          <span className="text-3xl font-extrabold text-slate-900 font-serif block">{totalOrders}</span>
          <span className="text-[11px] text-slate-500 font-medium">Completed & active orders</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Average Order Value</span>
          <span className="text-3xl font-extrabold text-slate-900 font-serif block">₹{avgOrderValue}</span>
          <span className="text-[11px] text-blue-700 font-medium">Direct basket average</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Repeat Customers</span>
          <span className="text-3xl font-extrabold text-slate-900 font-serif block">
            {repeatCustomerCount}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">{fulfilmentRate}% Fulfilment</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-serif">Revenue Realization (Monthly)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c5b45" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2c5b45" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#2c5b45" strokeWidth={2.5} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Bar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-serif">Order Volume Trends</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(v) => [v, 'Orders']} />
                <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Best-Selling Crops Performance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-serif">Top Performing Harvest Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProducts.map((p) => (
            <div key={p._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <img
                src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="truncate">
                <span className="font-bold text-slate-900 text-sm block truncate">{p.name}</span>
                <span className="text-xs text-slate-500 font-serif">₹{p.price} / {p.unit}</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">★ {p.rating} ({p.reviewCount} reviews)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};