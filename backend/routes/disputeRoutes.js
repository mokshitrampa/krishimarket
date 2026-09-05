const express = require('express');
const router = express.Router();
const {
  createDispute,
  getMyDisputes
} = require('../controllers/disputeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('customer'));

router.post('/', createDispute);
router.get('/my-disputes', getMyDisputes);

module.exports = router;