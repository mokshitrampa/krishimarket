const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAdminFarmers,
  approveFarmer,
  rejectFarmer,
  toggleUserStatus,
  getAdminCustomers,
  getAdminProducts,
  toggleProductStatus,
  getAdminOrders,
  getAdminReviews,
  toggleReviewStatus,
  getAdminDisputes,
  updateDispute,
  getAdminAnalytics,
  resetCleanDatabase
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.post('/system/reset-clean', resetCleanDatabase);
router.get('/farmers', getAdminFarmers);
router.patch('/farmers/:id/approve', approveFarmer);
router.patch('/farmers/:id/reject', rejectFarmer);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/customers', getAdminCustomers);
router.get('/products', getAdminProducts);
router.patch('/products/:id/status', toggleProductStatus);
router.get('/orders', getAdminOrders);
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id/status', toggleReviewStatus);
router.get('/disputes', getAdminDisputes);
router.patch('/disputes/:id', updateDispute);
router.get('/analytics', getAdminAnalytics);

module.exports = router;