const mongoose = require('mongoose');

const favoriteFarmerSchema = new mongoose.Schema(
  {
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
    }
  },
  { timestamps: true }
);

favoriteFarmerSchema.index({ customer: 1, farmer: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteFarmer', favoriteFarmerSchema);