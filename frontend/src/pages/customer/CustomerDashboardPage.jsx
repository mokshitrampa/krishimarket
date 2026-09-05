import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sprout
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { favoriteService } from '../../services/favoriteService';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [savedFarmers, setSavedFarmers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [ordersRes, favsRes, prodRes] = await Promise.all([
          orderService.getCustomerOrders(),
          favoriteService.getFavorites(),
          productService.getProducts({ limit: 4, sort: 'harvest_recent' })
        ]);

        if (ordersRes.success) setOrders(ordersRes.data);
        if (favsRes.success) setSavedFarmers(favsRes.data);
        if (prodRes.success) setRecommended(prodRes.data);
      } catch (err) {
        console.warn('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your customer portal..." />;
  }

  // Calculate metrics
  const totalOrders = orders.length;
  const activeOrder = orders.find(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const totalSpent = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-10">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total Orders</span>
            <span className="text-2xl font-extrabold text-slate-900 font-serif">{totalOrders}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total Spent</span>
            <span className="text-2xl font-extrabold text-slate-900 font-serif">₹{totalSpent}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Saved Farmers</span>
            <span className="text-2xl font-extrabold text-slate-900 font-serif">
              {savedFarmers.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Order Tracker (if any order is in transit) */}
      {activeOrder && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md">
                Active Farm Shipment
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-serif mt-1.5">
                Order #{activeOrder.orderNumber}
              </h3>
              <p className="text-xs text-slate-500">
                Dispatched by {activeOrder.farmerProfile?.farmName || 'Verified Farm'} | {activeOrder.deliverySlot}
              </p>
            </div>
            <OrderStatusBadge status={activeOrder.status} />
          </div>

          <OrderTimeline
            currentStatus={activeOrder.status}
            statusHistory={activeOrder.statusHistory}
          />

          <div className="pt-2 flex justify-end">
            <Link
              to={`/customer/orders/${activeOrder._id}`}
              className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1"
            >
              <span>View Full Order Details</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* 3. Recent Orders & Saved Farmers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Recent Orders</h3>
              <p className="text-xs text-slate-500">Your latest purchases direct from local fields</p>
            </div>
            <Link
              to="/customer/orders"
              className="text-xs font-bold text-forest-700 hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <ShoppingBag size={36} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No orders placed yet</p>
              <Link
                to="/marketplace"
                className="inline-block px-5 py-2 rounded-xl bg-forest-700 text-white font-bold text-xs"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order._id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        #{order.orderNumber}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-slate-600">
                      {order.farmerProfile?.farmName || order.farmer?.name} • {order.items.length} items
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className="text-base font-extrabold text-forest-950 font-serif">
                      ₹{order.total}
                    </span>
                    <Link
                      to={`/customer/orders/${order._id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Farmers (Right 1 col) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Saved Farmers</h3>
              <p className="text-xs text-slate-500">Your favorite growers</p>
            </div>
            <Link
              to="/customer/saved-farmers"
              className="text-xs font-bold text-forest-700 hover:underline"
            >
              Manage
            </Link>
          </div>

          {savedFarmers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Heart size={32} className="mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No saved farmers yet</p>
              <p className="text-[11px] text-slate-400">Save growers to stay notified of harvest schedules.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedFarmers.slice(0, 4).map((fav) => (
                <Link
                  key={fav._id}
                  to={`/farmers/${fav.farmerProfile?._id || fav.farmer?._id}`}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-forest-50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={
                        fav.farmerProfile?.profileImage ||
                        fav.farmer?.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          fav.farmer?.name || 'Farmer'
                        )}`
                      }
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-forest-800 truncate">
                        {fav.farmerProfile?.farmName || fav.farmer?.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {fav.farmerProfile?.district}, {fav.farmerProfile?.state}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-forest-700 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Recommended Fresh Harvest */}
      {recommended.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Recommended For You</h3>
              <p className="text-xs text-slate-500">Peak seasonal picks from verified local fields</p>
            </div>
            <Link to="/marketplace" className="text-xs font-bold text-forest-700 hover:underline">
              Explore All Produce →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};