const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getCustomerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);

router.post('/', authorize('customer'), placeOrder);
router.get('/customer', authorize('customer'), getCustomerOrders);
router.get('/farmer', authorize('farmer'), getFarmerOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', authorize('farmer', 'admin'), updateOrderStatus);

module.exports = router;