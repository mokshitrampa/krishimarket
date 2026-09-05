import React from 'react';

export const OrderStatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-50 text-amber-800 border-amber-200',
    Confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
    Preparing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    'Ready for Dispatch': 'bg-cyan-50 text-cyan-800 border-cyan-200',
    'Out for Delivery': 'bg-purple-50 text-purple-800 border-purple-200',
    Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-800 border-rose-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
        styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
};