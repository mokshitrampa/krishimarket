import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CheckoutPage = () => {
  const { cart, refreshCart, showToast } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultAddr = (user?.addresses && user.addresses[0]) || {};

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: defaultAddr.street || '',
    city: defaultAddr.city || '',
    district: defaultAddr.district || '',
    state: defaultAddr.state || '',
    pincode: defaultAddr.pincode || '',
    contactNumber: user?.phone || ''
  });

  const [deliverySlot, setDeliverySlot] = useState('Morning (7:00 AM - 10:00 AM)');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrders, setConfirmedOrders] = useState(null);

  const { farmerGroups = [], subtotal = 0, deliveryFee = 0, total = 0, itemsCount = 0 } = cart;

  const handleAddressChange = (e) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode || !deliveryAddress.contactNumber) {
      setError('Please provide complete delivery street, city, pincode, and contact number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await orderService.placeOrder({
        deliveryAddress,
        deliverySlot,
        deliveryInstructions,
        paymentMethod
      });

      if (res.success) {
        setConfirmedOrders(res.data);
        await refreshCart();
        showToast('Order successfully confirmed!');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmed Success Screen
  if (confirmedOrders) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif">
            Order Confirmed!
          </h2>
          <p className="text-sm text-slate-600">
            Thank you, {user?.name}. Your order has been dispatched directly to the farmer(s) for early morning harvest.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm text-left space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            Created Farm Orders
          </h3>
          {confirmedOrders.map((o) => (
            <div key={o._id} className="flex justify-between items-center text-sm py-1.5 border-b border-slate-50 last:border-0">
              <div>
                <span className="font-bold text-slate-900">#{o.orderNumber}</span>
                <span className="text-xs text-slate-500 block">Slot: {o.deliverySlot}</span>
              </div>
              <span className="font-bold text-forest-950 font-serif">₹{o.total}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/customer/orders"
            className="px-6 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-md"
          >
            Track in My Orders
          </Link>
          <Link
            to="/marketplace"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 font-serif">
          Checkout & Harvest Scheduling
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review dispatch address, delivery window, and complete your direct farm purchase.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <MapPin size={18} className="text-forest-700" />
              <span>1. Delivery Destination</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="House/Flat No., Apartment, Street"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    placeholder="District"
                    value={deliveryAddress.district}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={deliveryAddress.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="Pincode"
                    value={deliveryAddress.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  placeholder="+91 98200 11001"
                  value={deliveryAddress.contactNumber}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Slot & Instructions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <Clock size={18} className="text-forest-700" />
              <span>2. Delivery Slot & Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliverySlot === 'Morning (7:00 AM - 10:00 AM)'
                    ? 'border-forest-700 bg-forest-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">Morning Fresh Slot</span>
                  <input
                    type="radio"
                    name="deliverySlot"
                    checked={deliverySlot === 'Morning (7:00 AM - 10:00 AM)'}
                    onChange={() => setDeliverySlot('Morning (7:00 AM - 10:00 AM)')}
                    className="text-forest-700"
                  />
                </div>
                <span className="text-xs text-slate-500">7:00 AM - 10:00 AM (Recommended for leafy greens)</span>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliverySlot === 'Evening (4:00 PM - 8:00 PM)'
                    ? 'border-forest-700 bg-forest-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">Evening Slot</span>
                  <input
                    type="radio"
                    name="deliverySlot"
                    checked={deliverySlot === 'Evening (4:00 PM - 8:00 PM)'}
                    onChange={() => setDeliverySlot('Evening (4:00 PM - 8:00 PM)')}
                    className="text-forest-700"
                  />
                </div>
                <span className="text-xs text-slate-500">4:00 PM - 8:00 PM (After-work delivery)</span>
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Leave with gate security, ring bell twice..."
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <Banknote size={18} className="text-forest-700" />
              <span>3. Payment Method</span>
            </h3>

            <div className="space-y-3">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-forest-700 bg-forest-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote size={20} className="text-forest-800" />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Cash on Delivery</span>
                    <span className="text-xs text-slate-500">Pay cash or UPI upon inspecting fresh delivery.</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="text-forest-700"
                />
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'Simulated Online Payment'
                    ? 'border-forest-700 bg-forest-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-forest-800" />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Simulated Online Payment</span>
                    <span className="text-xs text-slate-500">Card / UPI / NetBanking instant simulated settlement.</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'Simulated Online Payment'}
                  onChange={() => setPaymentMethod('Simulated Online Payment')}
                  className="text-forest-700"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 sticky top-28">
          <h3 className="text-base font-bold text-slate-900 font-serif pb-3 border-b border-slate-100">
            Dispatch Items ({itemsCount})
          </h3>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {farmerGroups.map((grp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-forest-900 block">
                  Farm: {grp.farmer?.name}
                </span>
                {grp.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-700">
                      {it.quantity}x {it.product?.name}
                    </span>
                    <span className="font-bold text-slate-900 font-serif">₹{it.itemTotal}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-200 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Produce Subtotal</span>
              <span className="font-bold text-slate-900 font-serif">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Local Delivery Fee</span>
              <span className="font-bold text-slate-900 font-serif">₹{deliveryFee}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-extrabold text-forest-950 font-serif">₹{total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Confirming Order...' : 'Confirm & Place Farm Order'}
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};