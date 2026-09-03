import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.warn('Error fetching categories:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await adminService.createCategory({ name, description });
      setName('');
      setDescription('');
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Create failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await adminService.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agricultural Crop Categories</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage marketplace categorization hierarchy.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">{c.name}</span>
              <button
                onClick={() => handleDelete(c._id)}
                className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{c.description || 'Standard agricultural category.'}</p>
            <span className="text-[10px] text-slate-500 block">Slug: /{c.slug}</span>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Crop Category">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Exotic Herbs & Microgreens"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Description of harvest items included..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
          >
            Create Category
          </button>
        </form>
      </Modal>
    </div>
  );
};