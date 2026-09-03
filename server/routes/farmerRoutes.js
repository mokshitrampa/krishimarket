const express = require('express');
const router = express.Router();
const {
  getFarmers,
  getFarmerById,
  getFarmerProducts,
  compareFarmers,
  updateFarmerProfile,
  getFarmerAnalytics
} = require('../controllers/farmerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', getFarmers);
router.get('/compare', compareFarmers);
router.get('/analytics', protect, authorize('farmer'), getFarmerAnalytics);
router.put('/profile', protect, authorize('farmer'), updateFarmerProfile);
router.get('/:id', getFarmerById);
router.get('/:id/products', getFarmerProducts);

module.exports = router;