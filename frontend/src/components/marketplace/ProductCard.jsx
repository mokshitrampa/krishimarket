import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, MapPin, Calendar, Check, Leaf } from 'lucide-react';
import { StarRating } from '../common/StarRating';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const farmerName = product.farmer?.name || 'Local Farmer';
  const farmName = product.farmerProfile?.farmName || '';
  const farmerId = product.farmer?._id || product.farmer;
  const isVerified = product.farmerProfile?.verificationStatus === 'approved';
  const locationStr = product.farmerProfile
    ? `${product.farmerProfile.district}, ${product.farmerProfile.state}`
    : 'Local Region';

  const harvestDateFormatted = product.harvestDate
    ? new Date(product.harvestDate).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      })
    : 'Freshly Picked';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-forest-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Header */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={
            product.images && product.images[0]
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Method / Organic Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.organic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
              <Leaf size={10} /> Organic
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-sm text-white shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Freshness / Harvest Tag */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-[10px] font-medium bg-white/95 backdrop-blur-sm text-slate-700 shadow-xs flex items-center gap-1">
          <Calendar size={11} className="text-forest-600" />
          <span>Harvested: {harvestDateFormatted}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Farmer & Location Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <Link
              to={`/farmers/${farmerId}`}
              className="font-medium text-slate-700 hover:text-forest-700 flex items-center gap-1 truncate max-w-[70%]"
              title={farmName || farmerName}
            >
              <span className="truncate">{farmName || farmerName}</span>
              {isVerified && <ShieldCheck size={13} className="text-emerald-600 shrink-0" />}
            </Link>
            <span className="flex items-center gap-0.5 text-[11px] text-slate-400 shrink-0">
              <MapPin size={10} /> {locationStr}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product._id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-forest-800 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-1.5 flex items-center justify-between">
            <StarRating rating={product.rating || 4.8} count={product.reviewCount || 0} size={14} />
            <span
              className={`text-[11px] font-semibold ${
                product.stock > 10
                  ? 'text-emerald-700'
                  : product.stock > 0
                  ? 'text-amber-700'
                  : 'text-rose-600'
              }`}
            >
              {product.stock > 10
                ? 'In Stock'
                : product.stock > 0
                ? `Only ${product.stock} ${product.unit} left`
                : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Price and Cart Action */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block -mb-0.5">Farmgate Price</span>
            <span className="text-lg font-extrabold text-forest-950 font-serif">
              ₹{product.price}
            </span>
            <span className="text-xs text-slate-500 font-medium"> /{product.unit}</span>
          </div>

          <button
            onClick={() => addToCart(product._id, 1)}
            disabled={product.stock <= 0 || loading}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              product.stock > 0
                ? 'bg-forest-800 text-harvest-300 hover:bg-forest-900 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};