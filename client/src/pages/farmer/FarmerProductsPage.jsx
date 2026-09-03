import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Leaf,
  Calendar,
  Package,
  Search
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const FarmerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useCart();
  const [searchParams] = useSearchParams();

  // Modal State
  const [modalOpen, setModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    category: 'Vegetables',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    images: '',
    harvestDate: new Date().toISOString().split('T')[0],
    farmingMethod: 'Organic',
    organic: true,
    minimumOrderQuantity: 1,
    available: true,
    expectedFreshnessDays: 7
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Grains',
    'Pulses',
    'Spices',
    'Organic Produce',
    'Other'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getMyProducts();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.warn('Error fetching farmer products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      unit: prod.unit,
      stock: prod.stock,
      images: prod.images ? prod.images.join(', ') : '',
      harvestDate: prod.harvestDate ? prod.harvestDate.split('T')[0] : '',
      farmingMethod: prod.farmingMethod,
      organic: prod.organic,
      minimumOrderQuantity: prod.minimumOrderQuantity || 1,
      available: prod.available,
      expectedFreshnessDays: prod.expectedFreshnessDays || 7
    });
    setModalOpen(true);
  };

  const handleDelete = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await productService.deleteProduct(prodId);
      if (res.success) {
        showToast('Product deleted.');
        fetchProducts();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || formData.stock === '') {
      showToast('Please fill in required fields.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        minimumOrderQuantity: Number(formData.minimumOrderQuantity),
        expectedFreshnessDays: Number(formData.expectedFreshnessDays),
        images: formData.images
          ? formData.images.split(',').map((s) => s.trim()).filter(Boolean)
          : []
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        showToast('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        showToast('New harvest product listed!');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Product Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            List, update pricing, monitor harvest freshness, and manage active customer availability.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add Harvest Listing
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-2 max-w-md">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Filter your products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      {/* Table / Grid */}
      {loading ? (
        <LoadingSpinner size="md" message="Loading your harvest items..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products listed"
          description="Create your first harvest listing to make it available to local consumers."
          actionText="Add New Harvest Crop"
          onAction={handleOpenNew}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Farmgate Price</th>
                  <th className="p-4 font-semibold">Available Stock</th>
                  <th className="p-4 font-semibold">Harvest Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prod.images && prod.images[0]
                              ? prod.images[0]
                              : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'
                          }
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{prod.name}</span>
                          {prod.organic && (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                              <Leaf size={10} /> Organic
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{prod.category}</td>
                    <td className="p-4 font-bold text-forest-950 font-serif text-sm">
                      ₹{prod.price} / {prod.unit}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          prod.stock > 10 ? 'text-slate-800' : 'text-rose-600'
                        }`}
                      >
                        {prod.stock} {prod.unit}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(prod.harvestDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.available
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {prod.available ? 'Active' : 'Unlisted'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-forest-700 hover:bg-forest-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Harvest Product' : 'Add New Agricultural Produce'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Country Red Tomatoes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Unit *</label>
              <input
                type="text"
                required
                placeholder="kg, bunch, litre"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Stock *</label>
              <input
                type="number"
                required
                placeholder="Available qty"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Harvest Date</label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Freshness Window (Days)</label>
              <input
                type="number"
                value={formData.expectedFreshnessDays}
                onChange={(e) => setFormData({ ...formData, expectedFreshnessDays: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Image URLs (comma-separated)</label>
            <input
              type="text"
              placeholder="https://..."
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description & Culinary Notes *</label>
            <textarea
              required
              rows="3"
              placeholder="Flavor profile, morning harvesting method, recipe suggestions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.organic}
                onChange={(e) => setFormData({ ...formData, organic: e.target.checked })}
                className="w-4 h-4 text-forest-700 rounded"
              />
              <span className="text-xs font-bold text-slate-700">Certified Organic</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-forest-700 rounded"
              />
              <span className="text-xs font-bold text-slate-700">Listed & Available for Sale</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {submitting ? 'Saving Produce...' : editingProduct ? 'Update Product' : 'Publish Product'}
          </button>
        </form>
      </Modal>
    </div>
  );
};