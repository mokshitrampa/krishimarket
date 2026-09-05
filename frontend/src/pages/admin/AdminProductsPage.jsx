import React, { useState, useEffect } from 'react';
import { Package, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getProducts({ search });
      if (res.success) setProducts(res.data);
    } catch (err) {
      console.warn('Error loading admin products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggle = async (id) => {
    try {
      await adminService.toggleProductStatus(id);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Toggle failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agricultural Produce Administration</h1>
          <p className="text-xs text-slate-400 mt-0.5">Platform-wide moderation of crop listings and availability.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner size="md" message="Loading platform products..." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Harvest Item</th>
                  <th className="p-4">Farm & Location</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Farmgate Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Listing State</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{p.name}</td>
                    <td className="p-4">
                      <span className="text-slate-200 block font-semibold">{p.farmerProfile?.farmName || p.farmer?.name}</span>
                      <span className="text-[11px] text-slate-500">{p.farmerProfile?.district}, {p.farmerProfile?.state}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">{p.category}</td>
                    <td className="p-4 font-bold text-emerald-400 font-serif">₹{p.price} / {p.unit}</td>
                    <td className="p-4">{p.stock} {p.unit}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.available ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {p.available ? 'Active Listing' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggle(p._id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          p.available
                            ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {p.available ? 'Disable Listing' : 'Activate Listing'}
                      </button>
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