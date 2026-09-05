const FavoriteFarmer = require('../models/FavoriteFarmer');
const FarmerProfile = require('../models/FarmerProfile');

// @desc    Get customer's saved farmers
// @route   GET /api/favorites/farmers
// @access  Protected (Customer)
const getFavoriteFarmers = async (req, res, next) => {
  try {
    const favorites = await FavoriteFarmer.find({ customer: req.user._id })
      .populate('farmer', 'name avatar phone email')
      .populate('farmerProfile')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save/favorite a farmer
// @route   POST /api/favorites/farmers/:farmerId
// @access  Protected (Customer)
const addFavoriteFarmer = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    const profile = await FarmerProfile.findOne({
      $or: [{ user: farmerId }, { _id: farmerId }]
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found.'
      });
    }

    const existing = await FavoriteFarmer.findOne({
      customer: req.user._id,
      farmer: profile.user
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Farmer already saved in your favorites.'
      });
    }

    const fav = await FavoriteFarmer.create({
      customer: req.user._id,
      farmer: profile.user,
      farmerProfile: profile._id
    });

    return res.status(201).json({
      success: true,
      message: 'Farmer added to your saved favorites.',
      data: fav
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove farmer from favorites
// @route   DELETE /api/favorites/farmers/:farmerId
// @access  Protected (Customer)
const removeFavoriteFarmer = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    await FavoriteFarmer.findOneAndDelete({
      customer: req.user._id,
      $or: [{ farmer: farmerId }, { farmerProfile: farmerId }]
    });

    return res.status(200).json({
      success: true,
      message: 'Farmer removed from favorites.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFavoriteFarmers,
  addFavoriteFarmer,
  removeFavoriteFarmer
};