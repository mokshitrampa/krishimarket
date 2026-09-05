const Review = require('../models/Review');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create review for farmer or product
// @route   POST /api/reviews
// @access  Protected (Customer)
const createReview = async (req, res, next) => {
  try {
    const { farmerId, productId, orderId, rating, comment } = req.body;

    if (!farmerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID, rating (1-5), and review text are required.'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5.'
      });
    }

    const review = await Review.create({
      customer: req.user._id,
      customerName: req.user.name,
      farmer: farmerId,
      product: productId || null,
      order: orderId || null,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Recalculate farmer rating dynamically
    const farmerReviews = await Review.find({
      farmer: farmerId,
      status: 'approved'
    });

    if (farmerReviews.length > 0) {
      const avgRating =
        farmerReviews.reduce((sum, r) => sum + r.rating, 0) /
        farmerReviews.length;
      await FarmerProfile.findOneAndUpdate(
        { user: farmerId },
        {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: farmerReviews.length
        }
      );
    }

    // Recalculate product rating if applicable
    if (productId) {
      const productReviews = await Review.find({
        product: productId,
        status: 'approved'
      });
      if (productReviews.length > 0) {
        const avgProdRating =
          productReviews.reduce((sum, r) => sum + r.rating, 0) /
          productReviews.length;
        await Product.findByIdAndUpdate(productId, {
          rating: Math.round(avgProdRating * 10) / 10,
          reviewCount: productReviews.length
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been recorded.',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a farmer
// @route   GET /api/reviews/farmer/:farmerId
// @access  Public
const getFarmerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      farmer: req.params.farmerId,
      status: 'approved'
    })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: 'approved'
    })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getFarmerReviews,
  getProductReviews
};