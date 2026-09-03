import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, AlertCircle, MessageSquare, Package } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

export const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { showToast } = useCart();

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Dispute Modal State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeOrder, setDisputeOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('Damaged produce');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Dispatch',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getCustomerOrders({ status: statusFilter });
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn('Error fetching orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleOpenReview = (order) => {
    setReviewOrder(order);
    setReviewRating(5);
    setReviewComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment) {
      showToast('Please provide a comment.', 'warning');
      return;
    }
    setSubmittingReview(true);
    try {
      const farmerId = reviewOrder.farmer?._id || reviewOrder.farmer;
      const res = await reviewService.createReview({
        farmerId,
        orderId: reviewOrder._id,
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.success) {
        showToast('Review submitted successfully!');
        setReviewModalOpen(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleOpenDispute = (order) => {
    setDisputeOrder(order);
    setDisputeReason('Damaged produce');
    setDisputeDescription('');
    setDisputeModalOpen(true);
  };

  const handleSubmitDispute = async (e) => {
    e.preventDefault();
    if (!disputeDescription) {
      showToast('Please describe the issue.', 'warning');
      return;
    }
    setSubmittingDispute(true);
    try {
      const res = await api.post('/disputes', {
        orderId: disputeOrder._id,
        reason: disputeReason,
        description: disputeDescription
      });
      if (res.success) {
        showToast('Dispute submitted. Platform support will investigate.');
        setDisputeModalOpen(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit dispute.', 'error');
    } finally {
      setSubmittingDispute(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          My Farm Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track active harvest dispatches, view order histories, and rate your producers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === s
                ? 'bg-forest-800 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="md" message="Loading your farm orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description={`You have no orders under '${statusFilter}'. Explore our marketplace to buy direct.`}
          actionText="Shop Marketplace"
          actionLink="/marketplace"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-slate-900">
                    Order #{order.orderNumber}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>

                <p className="text-xs text-slate-600">
                  <strong>Grower:</strong> {order.farmerProfile?.farmName || order.farmer?.name} •{' '}
                  <span className="text-slate-400">{order.deliverySlot}</span>
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
                  {order.items.map((it, idx) => (
                    <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded-md">
                      {it.quantity}x {it.name}
                    </span>
                  ))}
                </div>

                <span className="text-[11px] text-slate-400 block pt-1">
                  Ordered on{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right mr-2">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-xl font-extrabold text-forest-950 font-serif">
                    ₹{order.total}
                  </span>
                </div>

                <Link
                  to={`/customer/orders/${order._id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Track Order
                </Link>

                {order.status === 'Delivered' && (
                  <button
                    onClick={() => handleOpenReview(order)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 flex items-center gap-1"
                  >
                    <Star size={13} className="fill-amber-600" /> Rate Grower
                  </button>
                )}

                <button
                  onClick={() => handleOpenDispute(order)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200"
                >
                  Report Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Rate & Review Your Farmer"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <p className="text-xs text-slate-500">
            Share feedback on produce freshness, packaging, and flavour to support your grower.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Star Rating (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`p-2 rounded-xl border transition-all ${
                    reviewRating >= star ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <Star size={20} className={reviewRating >= star ? 'fill-amber-500' : ''} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Review *</label>
            <textarea
              required
              rows="3"
              placeholder="How was the crispness, taste, and dispatch timing?"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="w-full py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm disabled:opacity-50"
          >
            {submittingReview ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      </Modal>

      {/* Dispute Modal */}
      <Modal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="Report Order Issue / Dispute"
      >
        <form onSubmit={handleSubmitDispute} className="space-y-4">
          <p className="text-xs text-slate-500">
            Platform administrators review every reported issue to coordinate directly with the grower.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Dispute</label>
            <select
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="Damaged produce">Damaged produce</option>
              <option value="Missing item">Missing item</option>
              <option value="Poor quality">Poor quality</option>
              <option value="Wrong quantity">Wrong quantity</option>
              <option value="Delivery problem">Delivery problem</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description *</label>
            <textarea
              required
              rows="3"
              placeholder="Describe what occurred with your delivery..."
              value={disputeDescription}
              onChange={(e) => setDisputeDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submittingDispute}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm disabled:opacity-50"
          >
            {submittingDispute ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </form>
      </Modal>
    </div>
  );
};