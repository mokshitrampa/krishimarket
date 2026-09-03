const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmerProfile'
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required (e.g., kg, bunch, litre)'],
      default: 'kg'
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [{
      type: String
    }],
    harvestDate: {
      type: Date,
      default: Date.now
    },
    expectedFreshnessDays: {
      type: Number,
      default: 7
    },
    farmingMethod: {
      type: String,
      enum: ['Organic', 'Natural / Permaculture', 'Conventional', 'Hydroponic', 'Mixed'],
      default: 'Organic'
    },
    organic: {
      type: Boolean,
      default: false
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: 1
    },
    available: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);