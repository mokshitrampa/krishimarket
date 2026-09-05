import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Truck, ShieldCheck, Banknote, Calendar } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await orderService.getOrderById(id);
        if (res.success) setOrder(res.data);
      } catch (err) {
        console.warn('Error fetching order details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading order specifics..." />;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/customer/orders" className="text-sm font-bold text-forest-700 hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const addr = order.deliveryAddress || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Link
          to="/customer/orders"
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-serif">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      {/* Timeline Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Delivery Tracking</h3>
            <span className="text-xs text-slate-500">{order.deliverySlot}</span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <OrderTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
      </div>

      {/* Two columns: Items & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination & Grower */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-xs">
          <h4 className="text-sm font-bold text-slate-900 font-serif pb-2 border-b border-slate-100">
            Farmstead & Destination
          </h4>

          <div>
            <span className="text-slate-400 font-semibold block">Dispatched by:</span>
            <span className="font-bold text-slate-800 text-sm">
              {order.farmerProfile?.farmName || order.farmer?.name}
            </span>
            <p className="text-slate-500">
              {order.farmerProfile?.location}, {order.farmerProfile?.district}, {order.farmerProfile?.state}
            </p>
          </div>

          <div className="pt-2">
            <span className="text-slate-400 font-semibold block">Delivery Address:</span>
            <span className="font-semibold text-slate-800 block">{addr.street}</span>
            <span className="text-slate-600 block">
              {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
            </span>
            <span className="text-slate-500 block mt-1">Contact: {addr.contactNumber}</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-xs">
          <h4 className="text-sm font-bold text-slate-900 font-serif pb-2 border-b border-slate-100">
            Payment & Total
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Produce Subtotal</span>
              <span className="font-bold text-slate-800 font-serif">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-800 font-serif">₹{order.deliveryFee}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm items-baseline">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-extrabold text-forest-950 font-serif text-lg">₹{order.total}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-slate-500">Payment Mode:</span>
            <span className="font-bold text-slate-800">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Payment Status:</span>
            <span
              className={`font-bold capitalize ${
                order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 font-serif">Harvest Items</h4>
        <div className="divide-y divide-slate-100">
          {order.items.map((it, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={it.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{it.name}</span>
                  <span className="text-slate-500 font-serif">
                    ₹{it.price} / {it.unit}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-sm font-serif block">
                  ₹{it.price * it.quantity}
                </span>
                <span className="text-slate-400">Qty: {it.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};