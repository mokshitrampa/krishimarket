const express = require('express');
const router = express.Router();
const {
  createReview,
  getFarmerReviews,
  getProductReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', protect, authorize('customer'), createReview);
router.get('/farmer/:farmerId', getFarmerReviews);
router.get('/product/:productId', getProductReviews);

module.exports = router;