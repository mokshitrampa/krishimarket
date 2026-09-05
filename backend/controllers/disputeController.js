const Dispute = require('../models/Dispute');
const Order = require('../models/Order');

// @desc    Customer raises dispute on an order
// @route   POST /api/disputes
// @access  Protected (Customer)
const createDispute = async (req, res, next) => {
  try {
    const { orderId, reason, description } = req.body;

    if (!orderId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, reason, and detailed description are required.'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only raise disputes for your own orders.'
      });
    }

    const dispute = await Dispute.create({
      order: order._id,
      orderNumber: order.orderNumber,
      customer: req.user._id,
      farmer: order.farmer,
      reason,
      description: description.trim(),
      status: 'open'
    });

    return res.status(201).json({
      success: true,
      message: 'Dispute submitted. Admin team will review promptly.',
      data: dispute
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer views their disputes
// @route   GET /api/disputes/my-disputes
// @access  Protected (Customer)
const getMyDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({ customer: req.user._id })
      .populate('farmer', 'name avatar')
      .populate('order')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: disputes.length,
      data: disputes
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createDispute,
  getMyDisputes
};