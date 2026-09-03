const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const { generateToken } = require('../utils/jwt');

// @desc    Register a Customer
// @route   POST /api/auth/register/customer
// @access  Public
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const addresses = [];
    if (address && (address.street || address.city)) {
      addresses.push({
        street: address.street || '',
        city: address.city || '',
        district: address.district || '',
        state: address.state || '',
        pincode: address.pincode || '',
        isDefault: true
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'customer',
      addresses
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register a Farmer
// @route   POST /api/auth/register/farmer
// @access  Public
const registerFarmer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      farmName,
      location,
      district,
      state,
      pincode,
      cropTypes,
      farmingMethod,
      yearsExperience,
      farmSizeAcres,
      description,
      organicCertified,
      certifications
    } = req.body;

    if (!name || !email || !phone || !password || !farmName || !location || !district || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required farm and personal information.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'farmer'
    });

    const parsedCrops = Array.isArray(cropTypes)
      ? cropTypes
      : typeof cropTypes === 'string'
      ? cropTypes.split(',').map((c) => c.trim())
      : [];

    const parsedCerts = Array.isArray(certifications)
      ? certifications
      : typeof certifications === 'string' && certifications.trim()
      ? certifications.split(',').map((c) => c.trim())
      : [];

    const farmerProfile = await FarmerProfile.create({
      user: user._id,
      farmName,
      location,
      district,
      state,
      pincode,
      description: description || '',
      cropTypes: parsedCrops,
      farmingMethod: farmingMethod || 'Organic',
      organicCertified: !!organicCertified,
      certifications: parsedCerts,
      yearsExperience: Number(yearsExperience) || 3,
      farmSizeAcres: Number(farmSizeAcres) || 5,
      verificationStatus: 'pending'
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Farmer registration submitted. Awaiting administrator verification.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      },
      farmerProfile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact platform support.'
      });
    }

    let farmerProfile = null;
    if (user.role === 'farmer') {
      farmerProfile = await FarmerProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        addresses: user.addresses
      },
      farmerProfile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let farmerProfile = null;

    if (user.role === 'farmer') {
      farmerProfile = await FarmerProfile.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        addresses: user.addresses
      },
      farmerProfile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Protected
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, addresses } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (addresses) user.addresses = addresses;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerCustomer,
  registerFarmer,
  login,
  getMe,
  updateProfile
};