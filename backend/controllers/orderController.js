const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { createOrdersFromCheckout } = require('../services/orderService');

// @desc    Checkout and place order(s)
// @route   POST /api/orders
// @access  Protected (Customer)
const placeOrder = async (req, res, next) => {
  try {
    const {
      deliveryAddress,
      deliverySlot,
      deliveryInstructions,
      paymentMethod,
      items
    } = req.body;

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address is required.'
      });
    }

    let checkoutItems = items;

    // If items not directly supplied in payload, grab from customer cart
    if (!checkoutItems || checkoutItems.length === 0) {
      const cart = await Cart.findOne({ customer: req.user._id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty. Cannot checkout.'
        });
      }
      checkoutItems = cart.items.map((i) => ({
        productId: i.product,
        quantity: i.quantity
      }));
    }

    const createdOrders = await createOrdersFromCheckout(req.user._id, {
      deliveryAddress,
      deliverySlot,
      deliveryInstructions,
      paymentMethod,
      items: checkoutItems
    });

    return res.status(201).json({
      success: true,
      message: 'Order(s) placed successfully.',
      count: createdOrders.length,
      data: createdOrders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get customer orders
// @route   GET /api/orders/customer
// @access  Protected (Customer)
const getCustomerOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { customer: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('farmer', 'name avatar phone')
      .populate('farmerProfile', 'farmName location district state rating')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Protected (Farmer)
const getFarmerOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { farmer: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Protected
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone avatar')
      .populate('farmer', 'name email phone avatar')
      .populate('farmerProfile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Access control: customer, farmer of this order, or admin
    const userId = req.user._id.toString();
    const isCustomer = order.customer._id.toString() === userId;
    const isFarmer = order.farmer._id.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isFarmer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order.'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Protected (Farmer or Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Ready for Dispatch',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Authorization check
    if (order.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this order.'
      });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      updatedAt: new Date(),
      note: note || `Status updated to ${status} by ${req.user.role === 'admin' ? 'Admin' : 'Farmer'}`
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'paid';
    }

    // If cancelled, restore stock
    if (status === 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getCustomerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus
};