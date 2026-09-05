const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

/**
 * Service to compute rich, normalized metrics for farmer comparison
 */
const getComparisonMetrics = async (farmerIds) => {
  const objectIds = farmerIds.map((id) => id.toString());

  // Find profiles by user id or profile id
  const profiles = await FarmerProfile.find({
    $or: [{ _id: { $in: objectIds } }, { user: { $in: objectIds } }]
  }).populate('user', 'name email phone avatar status');

  const comparisonData = await Promise.all(
    profiles.map(async (profile) => {
      const userId = profile.user._id;

      // Active products
      const products = await Product.find({
        farmer: userId,
        available: true
      }).sort({ harvestDate: -1 });

      const productCount = products.length;
      const avgProductPrice =
        productCount > 0
          ? Math.round(
              (products.reduce((acc, p) => acc + p.price, 0) / productCount) *
                100
            ) / 100
          : 0;

      const latestHarvest =
        productCount > 0 && products[0].harvestDate
          ? products[0].harvestDate
          : null;

      // Completed orders for fulfilment calculation
      const totalOrders = await Order.countDocuments({ farmer: userId });
      const deliveredOrders = await Order.countDocuments({
        farmer: userId,
        status: 'Delivered'
      });

      const dynamicFulfilmentRate =
        totalOrders > 0
          ? Math.round((deliveredOrders / totalOrders) * 100)
          : profile.fulfilmentRate || 98;

      return {
        id: profile._id,
        userId: profile.user._id,
        farmerName: profile.user.name,
        farmName: profile.farmName,
        profileImage: profile.profileImage || profile.user.avatar || '',
        bannerImage: profile.bannerImage || '',
        verificationStatus: profile.verificationStatus,
        isVerified: profile.verificationStatus === 'approved',
        location: profile.location,
        district: profile.district,
        state: profile.state,
        pincode: profile.pincode,
        fullLocation: `${profile.location}, ${profile.district}, ${profile.state}`,
        farmingMethod: profile.farmingMethod,
        organicCertified: profile.organicCertified,
        certifications: profile.certifications || [],
        cropTypes: profile.cropTypes || [],
        yearsExperience: profile.yearsExperience,
        farmSizeAcres: profile.farmSizeAcres,
        rating: profile.rating,
        reviewCount: profile.reviewCount,
        productCount,
        avgProductPrice,
        latestHarvestDate: latestHarvest,
        fulfilmentRate: dynamicFulfilmentRate,
        typicalDeliveryTime: profile.typicalDeliveryDays || '1-2 Days',
        minimumOrder: profile.minimumOrder || 200,
        deliveryOptions: profile.deliveryOptions || [
          'Local delivery',
          'Scheduled delivery'
        ],
        description: profile.description || '',
        harvestPractices: profile.harvestPractices,
        sourcingTransparency: profile.sourcingTransparency,
        customerSatisfaction: `${Math.round((profile.rating / 5) * 100)}%`
      };
    })
  );

  // Compute best badges across compared farmers
  if (comparisonData.length > 1) {
    let lowestPrice = Infinity;
    let highestRating = -1;
    let mostProducts = -1;

    comparisonData.forEach((f) => {
      if (f.avgProductPrice > 0 && f.avgProductPrice < lowestPrice) {
        lowestPrice = f.avgProductPrice;
      }
      if (f.rating > highestRating) {
        highestRating = f.rating;
      }
      if (f.productCount > mostProducts) {
        mostProducts = f.productCount;
      }
    });

    comparisonData.forEach((f) => {
      f.highlights = {
        isBestPrice: f.avgProductPrice > 0 && f.avgProductPrice === lowestPrice,
        isHighestRating: f.rating === highestRating,
        isMostProducts: f.productCount > 0 && f.productCount === mostProducts,
        isOrganicVerified: f.organicCertified === true,
        isFastestDelivery:
          f.typicalDeliveryTime.toLowerCase().includes('same day') ||
          f.typicalDeliveryTime.toLowerCase().includes('1 day')
      };
    });
  } else if (comparisonData.length === 1) {
    comparisonData[0].highlights = {
      isBestPrice: false,
      isHighestRating: true,
      isMostProducts: true,
      isOrganicVerified: comparisonData[0].organicCertified,
      isFastestDelivery: false
    };
  }

  return comparisonData;
};

module.exports = {
  getComparisonMetrics
};