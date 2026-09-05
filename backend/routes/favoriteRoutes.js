const express = require('express');
const router = express.Router();
const {
  getFavoriteFarmers,
  addFavoriteFarmer,
  removeFavoriteFarmer
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('customer'));

router.get('/farmers', getFavoriteFarmers);
router.post('/farmers/:farmerId', addFavoriteFarmer);
router.delete('/farmers/:farmerId', removeFavoriteFarmer);

module.exports = router;