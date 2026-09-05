import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sprout,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your harvest basket..." />;
  }

  const { farmerGroups = [], subtotal = 0, deliveryFee = 0, total = 0, itemsCount = 0 } = cart;

  if (farmerGroups.length === 0 || itemsCount === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your harvest basket is empty"
          description="Browse our marketplace of verified local growers and add seasonal fruits, vegetables, grains, or dairy directly to your basket."
          actionText="Explore Marketplace"
          actionLink="/marketplace"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif">
            Your Farm Basket
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {itemsCount} items selected from {farmerGroups.length} independent farm operation{farmerGroups.length > 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={14} /> Clear Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items grouped by farmer */}
        <div className="lg:col-span-8 space-y-6">
          {farmerGroups.map((group, gIdx) => (
            <div
              key={group.farmer?.id || gIdx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden"
            >
              {/* Farmer Header */}
              <div className="bg-forest-900 text-white px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-forest-800 text-harvest-400 flex items-center justify-center font-bold text-xs">
                    <Sprout size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Farm Dispatch: {group.farmer?.name}
                    </h3>
                    <span className="text-[11px] text-slate-300">
                      Standard local delivery: ₹{group.deliveryFee}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-harvest-300">
                  Subtotal: ₹{group.farmerSubtotal}
                </span>
              </div>

              {/* Items List */}
              <div className="p-6 divide-y divide-slate-100 space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.product?.images && item.product.images[0]
                            ? item.product.images[0]
                            : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'
                        }
                        alt=""
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/products/${item.product?._id}`}
                          className="text-sm font-bold text-slate-900 hover:text-forest-700 transition-colors line-clamp-1"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-xs text-slate-500 font-serif">
                          ₹{item.product?.price} / {item.product?.unit}
                        </p>
                        {!item.inStock && (
                          <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                            <AlertTriangle size={12} /> Stock exceeded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-forest-950 font-serif w-16 text-right">
                        ₹{item.itemTotal}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout CTA */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 sticky top-28">
          <h3 className="text-lg font-bold text-slate-900 font-serif pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Produce Subtotal</span>
              <span className="font-bold text-slate-900 font-serif">₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Truck size={14} className="text-forest-700" />
                Farm Dispatch Delivery Fee
              </span>
              <span className="font-bold text-slate-900 font-serif">₹{deliveryFee}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Flat ₹40 per independent farmer dispatch to compensate local farm transport directly.
            </p>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-extrabold text-forest-950 font-serif">
                ₹{total}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/customer/checkout')}
            className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>

          <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Guaranteed Morning Harvest Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};