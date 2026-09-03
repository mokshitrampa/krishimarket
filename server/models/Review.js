const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
      trim: true
    },
    status: {
      type: String,
      enum: ['approved', 'hidden'],
      default: 'approved'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);