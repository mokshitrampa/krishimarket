import React from 'react';
import { CheckCircle2, Clock, Truck, Package, Check, XCircle } from 'lucide-react';

export const OrderTimeline = ({ currentStatus, statusHistory = [] }) => {
  const steps = [
    { label: 'Pending', desc: 'Order Placed' },
    { label: 'Confirmed', desc: 'Accepted by Farmer' },
    { label: 'Preparing', desc: 'Morning Harvest' },
    { label: 'Ready for Dispatch', desc: 'Packed in Crates' },
    { label: 'Out for Delivery', desc: 'On the Road' },
    { label: 'Delivered', desc: 'Delivered Fresh' }
  ];

  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
        <XCircle size={24} className="text-rose-600" />
        <div>
          <h4 className="text-sm font-bold">Order Cancelled</h4>
          <p className="text-xs text-rose-600">This order was cancelled. Restocked in farm inventory.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.label === currentStatus);

  return (
    <div className="py-4">
      {/* Step Circles Bar */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-forest-700 transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`
          }}
        />

        {steps.map((step, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isPassed
                    ? 'bg-forest-700 text-white shadow-md ring-4 ring-forest-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isPassed ? <Check size={14} /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-[11px] font-bold text-center max-w-[80px] hidden sm:block ${
                  isCurrent ? 'text-forest-900' : isPassed ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* History log entries */}
      {statusHistory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Status Activity Log
          </h5>
          <div className="space-y-1.5">
            {statusHistory.map((h, i) => (
              <div key={i} className="text-xs flex items-start gap-2 text-slate-600">
                <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                <span className="font-semibold text-slate-800">{h.status}:</span>
                <span className="text-slate-500">{h.note}</span>
                <span className="ml-auto text-[10px] text-slate-400 shrink-0">
                  {new Date(h.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};