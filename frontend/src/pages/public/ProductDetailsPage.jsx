import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Leaf,
  ShoppingBag,
  Heart,
  Truck,
  CheckCircle2,
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { StarRating } from '../../components/common/StarRating';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart, showToast } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        if (res.success) {
          setProduct(res.data);
          setRelated(res.relatedProducts || []);
          // Fetch product reviews
          const revRes = await reviewService.getProductReviews(res.data._id);
          if (revRes.success) setReviews(revRes.data);
        }
      } catch (err) {
        console.warn('Error fetching product details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading harvest specifics..." />;
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">This agricultural harvest item is no longer available.</p>
        <Link to="/marketplace" className="px-5 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-sm">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const farmer = product.farmer || {};
  const farmerProfile = product.farmerProfile || {};
  const isVerified = farmerProfile.verificationStatus === 'approved';

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product._id, quantity);
    if (success) {
      navigate('/customer/cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-forest-700">Home</Link>
        <ChevronRight size={13} />
        <Link to="/marketplace" className="hover:text-forest-700">Marketplace</Link>
        <ChevronRight size={13} />
        <Link to={`/marketplace?category=${product.category}`} className="hover:text-forest-700">{product.category}</Link>
        <ChevronRight size={13} />
        <span className="text-slate-900 truncate">{product.name}</span>
      </nav>

      {/* Main Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs h-96 sm:h-[420px] relative">
            <img
              src={
                product.images && product.images[selectedImg]
                  ? product.images[selectedImg]
                  : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.organic && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                <Leaf size={12} /> Certified Organic
              </span>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImg === idx ? 'border-forest-700 ring-2 ring-forest-200' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Card */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Freshness */}
            <div className="mt-3 flex items-center gap-4">
              <StarRating rating={product.rating || 4.8} count={product.reviewCount || 0} size={16} />
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Calendar size={13} />
                Harvested: {new Date(product.harvestDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Price Strip */}
          <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Direct Farmgate Price</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-forest-950 font-serif">
                  ₹{product.price}
                </span>
                <span className="text-sm font-semibold text-slate-600">/ {product.unit}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 block">Current Inventory</span>
              <span className={`text-sm font-bold ${product.stock > 10 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {product.stock > 0 ? `${product.stock} ${product.unit} available` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Harvest Details</h4>
            <p>{product.description}</p>
          </div>

          {/* Sourcing & Logistics Details */}
          <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-slate-400 block font-medium">Farming Method:</span>
              <span className="font-bold text-slate-800">{product.farmingMethod}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Expected Freshness:</span>
              <span className="font-bold text-slate-800">{product.expectedFreshnessDays || 7} Days</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Min Order Quantity:</span>
              <span className="font-bold text-slate-800">{product.minimumOrderQuantity || 1} {product.unit}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Dispatch Slot:</span>
              <span className="font-bold text-slate-800">Morning 7-10 AM</span>
            </div>
          </div>

          {/* Purchase Controls */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3.5 py-2 font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-sm bg-forest-800 hover:bg-forest-900 text-harvest-300 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <ShoppingBag size={18} />
                <span>Add to Basket</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3 px-6 rounded-xl font-bold text-sm bg-harvest-400 hover:bg-harvest-300 text-forest-950 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Farmer Card Attachment */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  farmerProfile.profileImage ||
                  farmer.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    farmer.name || 'Farmer'
                  )}`
                }
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    {farmerProfile.farmName || farmer.name}
                  </h4>
                  {isVerified && <ShieldCheck size={14} className="text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500">
                  {farmerProfile.location}, {farmerProfile.district}, {farmerProfile.state}
                </p>
              </div>
            </div>

            <Link
              to={`/farmers/${farmerProfile._id || farmer._id}`}
              className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1 shrink-0"
            >
              <span>View Profile</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                More From This Farm & Category
              </h2>
              <p className="text-xs text-slate-500">Fresh recommendations harvested from nearby fields</p>
            </div>
            <Link to="/marketplace" className="text-xs font-bold text-forest-700 hover:underline">
              View All Marketplace →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};