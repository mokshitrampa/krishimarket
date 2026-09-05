const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Dispute = require('../models/Dispute');
const Category = require('../models/Category');

// @desc    Admin KPI Dashboard Summary
// @route   GET /api/admin/dashboard
// @access  Protected (Admin)
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const verifiedFarmers = await FarmerProfile.countDocuments({ verificationStatus: 'approved' });
    const pendingFarmerApprovals = await FarmerProfile.countDocuments({ verificationStatus: 'pending' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'Delivered' });
    const activeDisputes = await Dispute.countDocuments({ status: { $in: ['open', 'under_review'] } });

    // Revenue / GMV from all active non-cancelled orders
    const activeOrders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalGMV = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = activeOrders.length > 0 ? Math.round(totalGMV / activeOrders.length) : 0;

    // Monthly orders & sales chart data (last 6 months dynamically computed from real orders)
    const ordersByMonth = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      }
    ]);
    const monthMap = {};
    ordersByMonth.forEach((m) => {
      monthMap[m._id] = m;
    });

    const now = new Date();
    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mNum = d.getMonth() + 1;
      const mLabel = d.toLocaleString('en-US', { month: 'short' });
      const record = monthMap[mNum];
      monthlySales.push({
        month: mLabel,
        revenue: record ? Math.round(record.revenue) : 0,
        orders: record ? record.orders : 0
      });
    }

    // Category distribution
    const categoryDist = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    // Recent activities
    const recentOrders = await Order.find()
      .populate('customer', 'name avatar')
      .populate('farmer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingApprovalsList = await FarmerProfile.find({ verificationStatus: 'pending' })
      .populate('user', 'name email phone avatar')
      .limit(5);

    const recentDisputes = await Dispute.find()
      .populate('customer', 'name')
      .populate('farmer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalFarmers,
          verifiedFarmers,
          pendingFarmerApprovals,
          totalCustomers,
          totalProducts,
          totalOrders,
          completedOrders,
          totalGMV,
          avgOrderValue,
          activeDisputes
        },
        monthlySales,
        categoryDist,
        recentOrders,
        pendingApprovalsList,
        recentDisputes
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all farmers for administration
// @route   GET /api/admin/farmers
// @access  Protected (Admin)
const getAdminFarmers = async (req, res, next) => {
  try {
    const { status, search, farmingMethod } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.verificationStatus = status;
    }
    if (farmingMethod && farmingMethod !== 'All') {
      query.farmingMethod = farmingMethod;
    }
    if (search) {
      query.$or = [
        { farmName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const farmers = await FarmerProfile.find(query)
      .populate('user', 'name email phone avatar status createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve farmer application
// @route   PATCH /api/admin/farmers/:id/approve
// @access  Protected (Admin)
const approveFarmer = async (req, res, next) => {
  try {
    const profile = await FarmerProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    profile.verificationStatus = 'approved';
    profile.verificationNotes = req.body.notes || 'Application approved by platform administrator.';
    await profile.save();

    return res.status(200).json({
      success: true,
      message: `Farmer '${profile.farmName}' has been verified and approved.`,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject farmer application
// @route   PATCH /api/admin/farmers/:id/reject
// @access  Protected (Admin)
const rejectFarmer = async (req, res, next) => {
  try {
    const profile = await FarmerProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    profile.verificationStatus = 'rejected';
    profile.verificationNotes = req.body.notes || 'Application did not meet verification criteria.';
    await profile.save();

    return res.status(200).json({
      success: true,
      message: `Farmer application rejected.`,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Suspend or Reactivate user account (farmer or customer)
// @route   PATCH /api/admin/users/:id/status
// @access  Protected (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'active' or 'suspended'
    if (!status || !['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is active or suspended.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status;
    await user.save();

    // If farmer, also sync verificationStatus
    if (user.role === 'farmer') {
      if (status === 'suspended') {
        await FarmerProfile.findOneAndUpdate({ user: user._id }, { verificationStatus: 'suspended' });
      } else {
        await FarmerProfile.findOneAndUpdate({ user: user._id }, { verificationStatus: 'approved' });
      }
    }

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all customers for admin
// @route   GET /api/admin/customers
// @access  Protected (Admin)
const getAdminCustomers = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = { role: 'customer' };

    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query).select('-password').sort({ createdAt: -1 });

    const customersWithOrders = await Promise.all(
      customers.map(async (c) => {
        const orderCount = await Order.countDocuments({ customer: c._id });
        const totalSpentResult = await Order.aggregate([
          { $match: { customer: c._id, status: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;
        return {
          ...c.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: customersWithOrders.length,
      data: customersWithOrders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Protected (Admin)
const getAdminProducts = async (req, res, next) => {
  try {
    const { category, search, available } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (available !== undefined && available !== 'All') query.available = available === 'true';
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('farmer', 'name email phone')
      .populate('farmerProfile', 'farmName location district state')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle product availability (Admin moderation)
// @route   PATCH /api/admin/products/:id/status
// @access  Protected (Admin)
const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    product.available = !product.available;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product is now ${product.available ? 'active and listed' : 'disabled'}.`,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Protected (Admin)
const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('farmer', 'name email phone')
      .populate('farmerProfile', 'farmName location district state')
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

// @desc    Get all reviews for admin moderation
// @route   GET /api/admin/reviews
// @access  Protected (Admin)
const getAdminReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;

    const reviews = await Review.find(query)
      .populate('customer', 'name email avatar')
      .populate('farmer', 'name')
      .populate('product', 'name images')
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

// @desc    Moderate review status (approved / hidden)
// @route   PATCH /api/admin/reviews/:id/status
// @access  Protected (Admin)
const toggleReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['approved', 'hidden'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or hidden.' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    review.status = status;
    await review.save();

    return res.status(200).json({
      success: true,
      message: `Review marked as ${status}.`,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get disputes for admin
// @route   GET /api/admin/disputes
// @access  Protected (Admin)
const getAdminDisputes = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;

    const disputes = await Dispute.find(query)
      .populate('customer', 'name email phone')
      .populate('farmer', 'name email phone')
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

// @desc    Update dispute status & admin notes
// @route   PATCH /api/admin/disputes/:id
// @access  Protected (Admin)
const updateDispute = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute not found.' });
    }

    if (status) dispute.status = status;
    if (adminNote !== undefined) dispute.adminNote = adminNote;

    await dispute.save();

    return res.status(200).json({
      success: true,
      message: 'Dispute resolution updated.',
      data: dispute
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Protected (Admin)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const fulfilmentRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 100;
    const cancellationRate = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;

    // Top farmers by sales
    const topFarmers = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: '$farmer', totalSales: { $sum: '$total' }, orderCount: { $sum: 1 } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { farmerName: '$user.name', totalSales: 1, orderCount: 1 } }
    ]);

    // Top selling products
    const topProducts = await Product.find()
      .sort({ reviewCount: -1, rating: -1 })
      .limit(5)
      .select('name category price rating reviewCount stock');

    return res.status(200).json({
      success: true,
      data: {
        fulfilmentRate,
        cancellationRate,
        totalOrders,
        deliveredOrders,
        cancelledOrders,
        topFarmers,
        topProducts
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset platform database to a clean slate (Admin + Categories only, 0 mock orders/users)
// @route   POST /api/admin/system/reset-clean
// @access  Protected (Admin)
const resetCleanDatabase = async (req, res, next) => {
  try {
    const { seedCleanBase } = require('../seed/seeder');
    await seedCleanBase();
    return res.status(200).json({
      success: true,
      message: 'Platform database reset to a clean slate. Zero mock orders or customers remain.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};