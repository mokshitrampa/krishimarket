const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Farm village/town is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true
    },
    cropTypes: [{
      type: String,
      trim: true
    }],
    farmingMethod: {
      type: String,
      enum: ['Organic', 'Natural / Permaculture', 'Conventional', 'Hydroponic', 'Mixed'],
      default: 'Natural / Permaculture'
    },
    organicCertified: {
      type: Boolean,
      default: false
    },
    certifications: [{
      type: String,
      trim: true
    }],
    yearsExperience: {
      type: Number,
      default: 5,
      min: 0
    },
    farmSizeAcres: {
      type: Number,
      default: 5
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },
    verificationNotes: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    fulfilmentRate: {
      type: Number,
      default: 98
    },
    deliveryOptions: {
      type: [String],
      default: ['Local delivery', 'Scheduled delivery', 'Farm pickup']
    },
    typicalDeliveryDays: {
      type: String,
      default: '1-2 Days'
    },
    minimumOrder: {
      type: Number,
      default: 200,
      min: 0
    },
    profileImage: {
      type: String,
      default: ''
    },
    bannerImage: {
      type: String,
      default: ''
    },
    harvestPractices: {
      type: String,
      default: 'Harvested fresh on the morning of scheduled dispatch. Minimal post-harvest handling.'
    },
    sourcingTransparency: {
      type: String,
      default: '100% grown directly on our registered family farm. Zero third-party aggregation.'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);