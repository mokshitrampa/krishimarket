const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const User = require('../models/User');

// @desc    Get all products with rich multi-parameter filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      farmer,
      location,
      organic,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { available: true };

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (farmer) {
      query.farmer = farmer;
    }

    if (organic === 'true') {
      query.organic = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by farmer location if specified
    if (location) {
      const matchingProfiles = await FarmerProfile.find({
        $or: [
          { location: { $regex: location, $options: 'i' } },
          { district: { $regex: location, $options: 'i' } },
          { state: { $regex: location, $options: 'i' } }
        ]
      }).select('user');

      const userIds = matchingProfiles.map((p) => p.user);
      query.farmer = { $in: userIds };
    }

    const sortOptions = {};
    if (sort === 'price_asc') sortOptions.price = 1;
    else if (sort === 'price_desc') sortOptions.price = -1;
    else if (sort === 'rating_desc') sortOptions.rating = -1;
    else if (sort === 'harvest_recent') sortOptions.harvestDate = -1;
    else sortOptions.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('farmer', 'name avatar email phone')
      .populate('farmerProfile', 'farmName location district state verificationStatus rating reviewCount typicalDeliveryDays')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product details and related products
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name avatar email phone')
      .populate('farmerProfile');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Related products (same category or same farmer, excluding current product)
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      available: true,
      $or: [{ category: product.category }, { farmer: product.farmer._id }]
    })
      .populate('farmer', 'name avatar')
      .populate('farmerProfile', 'farmName district state verificationStatus rating')
      .limit(4);

    return res.status(200).json({
      success: true,
      data: product,
      relatedProducts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get farmer's own products
// @route   GET /api/products/farmer/my-products
// @access  Protected (Farmer only)
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({
      createdAt: -1
    });

    const lowStockCount = products.filter((p) => p.stock < 10).length;
    const activeCount = products.filter((p) => p.available).length;

    return res.status(200).json({
      success: true,
      count: products.length,
      activeCount,
      lowStockCount,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Protected (Farmer only)
const createProduct = async (req, res, next) => {
  try {
    const farmerProfile = await FarmerProfile.findOne({ user: req.user._id });
    if (!farmerProfile) {
      return res.status(400).json({
        success: false,
        message: 'You must complete your farmer profile before listing products.'
      });
    }

    const {
      name,
      category,
      description,
      price,
      unit,
      stock,
      images,
      harvestDate,
      farmingMethod,
      organic,
      minimumOrderQuantity,
      available,
      expectedFreshnessDays
    } = req.body;

    if (!name || !category || !description || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, description, price, and stock are required.'
      });
    }

    const parsedImages = Array.isArray(images)
      ? images
      : typeof images === 'string' && images.trim()
      ? [images.trim()]
      : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'];

    const product = await Product.create({
      farmer: req.user._id,
      farmerProfile: farmerProfile._id,
      name,
      category,
      description,
      price: Number(price),
      unit: unit || 'kg',
      stock: Number(stock),
      images: parsedImages,
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      expectedFreshnessDays: Number(expectedFreshnessDays) || 7,
      farmingMethod: farmingMethod || farmerProfile.farmingMethod || 'Organic',
      organic: organic !== undefined ? !!organic : farmerProfile.organicCertified,
      minimumOrderQuantity: Number(minimumOrderQuantity) || 1,
      available: available !== undefined ? !!available : true
    });

    return res.status(201).json({
      success: true,
      message: 'Product listing created successfully.',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Protected (Farmer only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit another farmer’s product.'
      });
    }

    const {
      name,
      category,
      description,
      price,
      unit,
      stock,
      images,
      harvestDate,
      farmingMethod,
      organic,
      minimumOrderQuantity,
      available,
      expectedFreshnessDays
    } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (unit) product.unit = unit;
    if (stock !== undefined) product.stock = Number(stock);
    if (images) product.images = Array.isArray(images) ? images : [images];
    if (harvestDate) product.harvestDate = new Date(harvestDate);
    if (farmingMethod) product.farmingMethod = farmingMethod;
    if (organic !== undefined) product.organic = !!organic;
    if (minimumOrderQuantity !== undefined) product.minimumOrderQuantity = Number(minimumOrderQuantity);
    if (available !== undefined) product.available = !!available;
    if (expectedFreshnessDays !== undefined) product.expectedFreshnessDays = Number(expectedFreshnessDays);

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Protected (Farmer only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct
};