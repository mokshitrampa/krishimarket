const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: 'kg' },
  image: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmerProfile'
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 40
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      contactNumber: { type: String, required: true }
    },
    deliverySlot: {
      type: String,
      default: 'Morning (7:00 AM - 10:00 AM)'
    },
    deliveryInstructions: {
      type: String,
      default: ''
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Simulated Online Payment'],
      default: 'Cash on Delivery'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Preparing',
        'Ready for Dispatch',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
      ],
      default: 'Pending'
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        note: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);