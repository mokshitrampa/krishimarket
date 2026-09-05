const mongoose = require('mongoose');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Dispute = require('../models/Dispute');
const FavoriteFarmer = require('../models/FavoriteFarmer');
const Cart = require('../models/Cart');

const {
  categoriesData,
  adminData,
  farmersData,
  customersData
} = require('./seedData');

const sampleProducts = [
  // Ramesh Patel (Nashik) - Organic Veg & Grains
  {
    farmerIdx: 0,
    name: 'Fresh Vine-Ripened Country Tomatoes',
    category: 'Vegetables',
    description: 'Sweet, juicy, field-grown local tomatoes harvested at dawn. Ideal for rich curries, salads, and fresh salsa.',
    price: 45,
    unit: 'kg',
    stock: 120,
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 6,
    rating: 4.9,
    reviewCount: 18
  },
  {
    farmerIdx: 0,
    name: 'Crisp Baby Spinach (Palak)',
    category: 'Vegetables',
    description: 'Tender baby spinach leaves grown with bio-fertilizer and pure well water. Rich in iron and dietary fiber.',
    price: 30,
    unit: 'bunch',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 4,
    rating: 4.8,
    reviewCount: 12
  },
  {
    farmerIdx: 0,
    name: 'Nashik Red Onions (Mild & Crisp)',
    category: 'Vegetables',
    description: 'Geographically renowned Nashik red onions with exceptional pungency and long storage shelf-life.',
    price: 38,
    unit: 'kg',
    stock: 250,
    images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 20,
    rating: 4.9,
    reviewCount: 15
  },
  {
    farmerIdx: 0,
    name: 'Farm-Fresh Green Capsicum (Bell Pepper)',
    category: 'Organic Produce',
    description: 'Glossy, crunchy bell peppers with thick juicy walls. Grown in polyhouse under strict biological pest control.',
    price: 65,
    unit: 'kg',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 8,
    rating: 4.7,
    reviewCount: 9
  },

  // Sunita Devi (Varanasi) - Natural Pulses & Spices
  {
    farmerIdx: 1,
    name: 'Unpolished Arhar / Toor Dal (Pigeon Pea)',
    category: 'Pulses',
    description: '100% natural, unpolished country Toor dal with natural yellow germ intact. Cooks into fragrant, velvety comfort dal.',
    price: 165,
    unit: 'kg',
    stock: 180,
    images: ['https://images.unsplash.com/photo-1585994192700-4eb637a7cb17?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Natural / Permaculture',
    organic: true,
    expectedFreshnessDays: 180,
    rating: 4.9,
    reviewCount: 22
  },
  {
    farmerIdx: 1,
    name: 'Native Desi Chana (Brown Chickpeas)',
    category: 'Pulses',
    description: 'Sun-dried heirloom small brown chickpeas with high fiber and low glycemic index. High germination rate.',
    price: 110,
    unit: 'kg',
    stock: 140,
    images: ['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Natural / Permaculture',
    organic: true,
    expectedFreshnessDays: 180,
    rating: 4.8,
    reviewCount: 14
  },
  {
    farmerIdx: 1,
    name: 'Stone-Ground Whole Coriander Powder',
    category: 'Spices',
    description: 'Hand-picked green coriander seeds gently roasted and stone-ground in micro batches to retain aromatic linalool oil.',
    price: 85,
    unit: 'pack',
    stock: 90,
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Natural / Permaculture',
    organic: true,
    expectedFreshnessDays: 120,
    rating: 4.8,
    reviewCount: 11
  },

  // Gurpreet Singh (Jalandhar) - Generational Grains & Oils
  {
    farmerIdx: 2,
    name: 'Heritage Sharbati Golden Whole Wheat',
    category: 'Grains',
    description: 'Heavy lustrous grains grown in pristine Punjab soil. Yields extraordinarily soft, sweet rotis that remain supple for hours.',
    price: 52,
    unit: 'kg',
    stock: 500,
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Conventional',
    organic: false,
    expectedFreshnessDays: 150,
    rating: 4.8,
    reviewCount: 31
  },
  {
    farmerIdx: 2,
    name: 'Cold-Pressed Pure Yellow Mustard Oil (Kachi Ghani)',
    category: 'Other',
    description: 'Extracted in wooden kohlu at below 40°C. Pungent, golden-tinted oil with authentic sharp flavor and zero preservatives.',
    price: 210,
    unit: 'litre',
    stock: 110,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Conventional',
    organic: false,
    expectedFreshnessDays: 240,
    rating: 4.7,
    reviewCount: 19
  },
  {
    farmerIdx: 2,
    name: 'Traditional Aged Basmati Rice (1121 Extra Long)',
    category: 'Grains',
    description: 'Aged naturally for 24 months. Fluffy, non-sticky grains that expand to over 20mm when cooked.',
    price: 140,
    unit: 'kg',
    stock: 320,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Conventional',
    organic: false,
    expectedFreshnessDays: 360,
    rating: 4.7,
    reviewCount: 24
  },

  // K. Venkatraman (Thanjavur) - Kaveri Heritage Rice & Fruits
  {
    farmerIdx: 3,
    name: 'Indigenous Karuppu Kavuni Black Rice',
    category: 'Organic Produce',
    description: 'Ancient royal Tamil black rice packed with anthocyanins, dietary antioxidants, and natural nutty flavor.',
    price: 190,
    unit: 'kg',
    stock: 95,
    images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 180,
    rating: 5.0,
    reviewCount: 27
  },
  {
    farmerIdx: 3,
    name: 'Traditional Mapillai Samba Red Rice',
    category: 'Grains',
    description: 'Bridegroom rice of Tamil Nadu delta, renowned for boosting stamina, gut health, and mineral vitality.',
    price: 130,
    unit: 'kg',
    stock: 160,
    images: ['https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 180,
    rating: 4.9,
    reviewCount: 16
  },
  {
    farmerIdx: 3,
    name: 'Sweet Tender Coconuts (Sevvalani)',
    category: 'Fruits',
    description: 'Freshly plucked from high-yielding organic palms. 450ml+ of electrolyte-rich natural sweet nectar.',
    price: 55,
    unit: 'pack',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 5,
    rating: 4.9,
    reviewCount: 19
  },

  // Anita Deshmukh (Pune) - Fresh Orchard Fruits
  {
    farmerIdx: 4,
    name: 'Ruby Red Bhagwa Pomegranates',
    category: 'Fruits',
    description: 'Glossy crimson skin with deep red, soft-seeded sweet arils. Plucked tree-ripe on the morning of dispatch.',
    price: 170,
    unit: 'kg',
    stock: 130,
    images: ['https://images.unsplash.com/photo-1541344999736-83eca872f242?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Natural / Permaculture',
    organic: false,
    expectedFreshnessDays: 12,
    rating: 4.7,
    reviewCount: 18
  },
  {
    farmerIdx: 4,
    name: 'Crisp Sardar Guava (Lucknow 49)',
    category: 'Fruits',
    description: 'Sweet white flesh guava with subtle tart finish. Naturally vitamin C rich with tender edible peel.',
    price: 80,
    unit: 'kg',
    stock: 90,
    images: ['https://images.unsplash.com/photo-1536511135899-738cb20d338c?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Natural / Permaculture',
    organic: false,
    expectedFreshnessDays: 5,
    rating: 4.6,
    reviewCount: 11
  },

  // Balaram Gowda (Shivamogga) - Forest Spices
  {
    farmerIdx: 5,
    name: 'Malabar Black Peppercorns (Bold TGSEB)',
    category: 'Spices',
    description: 'Tellicherry Garbled Special Extra Bold whole black peppercorns sun-dried under dense rainforest canopies.',
    price: 240,
    unit: 'pack',
    stock: 150,
    images: ['https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 365,
    rating: 5.0,
    reviewCount: 35
  },
  {
    farmerIdx: 5,
    name: 'Fragrant Green Cardamom (8mm Bold Pods)',
    category: 'Spices',
    description: 'Bright emerald green pods bursting with intense volatile aromatic seeds. Hand-graded for maximum plumpness.',
    price: 420,
    unit: 'pack',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 365,
    rating: 4.9,
    reviewCount: 29
  },
  {
    farmerIdx: 5,
    name: 'Raw Wild Curcuma Turmeric Fingers',
    category: 'Spices',
    description: 'High curcumin (6.8% tested) organic turmeric roots. Sun-cured with no added lead chromate polishing.',
    price: 150,
    unit: 'pack',
    stock: 120,
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 180,
    rating: 4.9,
    reviewCount: 24
  },

  // Rajesh Verma (Shimla) - Mountain Produce
  {
    farmerIdx: 6,
    name: 'Himachal Royal Delicious Apples (Unwaxed)',
    category: 'Fruits',
    description: 'Grown at 7,500 ft elevation. Crunchy, deeply aromatic mountain apples picked directly from tree branches.',
    price: 195,
    unit: 'kg',
    stock: 140,
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 14,
    rating: 4.9,
    reviewCount: 31
  },
  {
    farmerIdx: 6,
    name: 'Himalayan Single-Clove Mountain Garlic',
    category: 'Vegetables',
    description: 'Rare single-clove wild mountain garlic (Kashmiri Lahsun) containing 7x higher allicin content.',
    price: 320,
    unit: 'pack',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1588615419957-86e7c10b7849?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 90,
    rating: 4.8,
    reviewCount: 16
  },

  // Hitesh Barot (Junagadh) - Gir Cow Dairy & Farm
  {
    farmerIdx: 7,
    name: 'Vedic Gir Cow A2 Bilona Cultured Ghee',
    category: 'Dairy',
    description: 'Crafted from indigenous A2 Gir cows grazing on medicinal grasses. Prepared via hand-churned makhan in bronze vessels.',
    price: 1350,
    unit: 'litre',
    stock: 65,
    images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 270,
    rating: 5.0,
    reviewCount: 42
  },
  {
    farmerIdx: 7,
    name: 'Artisanal Fresh Farm Paneer',
    category: 'Dairy',
    description: 'Made within 4 hours of morning milking using organic lemon juice curdling. Pillowy soft with natural whey richness.',
    price: 160,
    unit: 'pack',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 4,
    rating: 4.9,
    reviewCount: 19
  },
  {
    farmerIdx: 7,
    name: 'Raw Organic Unfiltered Gir Forest Honey',
    category: 'Other',
    description: 'Unpasteurized honey collected by native Apis dorsata bees from neem, jamun, and wild acacia blossoms.',
    price: 450,
    unit: 'pack',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 365,
    rating: 4.9,
    reviewCount: 22
  },

  // Meenakshi Sundaram (Ooty) - Hydro Greens
  {
    farmerIdx: 8,
    name: 'Hydroponic Butterhead Lettuce (Living Root)',
    category: 'Vegetables',
    description: 'Gently harvested with intact sponge root system. Incredibly tender, sweet, buttery leaves for salads and gourmet wraps.',
    price: 75,
    unit: 'bunch',
    stock: 90,
    images: ['https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Hydroponic',
    organic: true,
    expectedFreshnessDays: 10,
    rating: 4.9,
    reviewCount: 26
  },
  {
    farmerIdx: 8,
    name: 'Italian Sweet Genovese Basil',
    category: 'Vegetables',
    description: 'Intensely fragrant fresh sweet basil grown in temperature-controlled alpine greenhouses. Zero pesticide residue.',
    price: 40,
    unit: 'bunch',
    stock: 70,
    images: ['https://images.unsplash.com/photo-1618375569909-3c352844e608?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Hydroponic',
    organic: true,
    expectedFreshnessDays: 7,
    rating: 4.8,
    reviewCount: 17
  },
  {
    farmerIdx: 8,
    name: 'Dark Tuscan Lacinato Kale (Dinosaur Kale)',
    category: 'Organic Produce',
    description: 'Deep blue-green wrinkled leaves loaded with vitamin K and lutein. Crisp texture perfect for smoothies and baked chips.',
    price: 85,
    unit: 'bunch',
    stock: 55,
    images: ['https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Hydroponic',
    organic: true,
    expectedFreshnessDays: 8,
    rating: 4.9,
    reviewCount: 14
  },

  // Devendra Choudhary (Jodhpur) - Desert Eco Grains & Spices
  {
    farmerIdx: 9,
    name: 'Desi Marwar Pearl Millet (Bajra Grain)',
    category: 'Grains',
    description: 'Traditional drought-tolerant desert crop. Stone-millable into warming winter rotis with rich iron and zinc.',
    price: 42,
    unit: 'kg',
    stock: 220,
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Natural / Permaculture',
    organic: false,
    expectedFreshnessDays: 180,
    rating: 4.6,
    reviewCount: 14
  },
  {
    farmerIdx: 9,
    name: 'Royal Nagaur Cumin Seeds (Jeera)',
    category: 'Spices',
    description: 'Distinctive large seeds with intense cuminaldehyde fragrance and earthy undertones. Unadulterated.',
    price: 380,
    unit: 'kg',
    stock: 85,
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Natural / Permaculture',
    organic: false,
    expectedFreshnessDays: 365,
    rating: 4.8,
    reviewCount: 20
  },

  // Madhab Das (Jorhat, Assam) - Specialty Harvest
  {
    farmerIdx: 10,
    name: 'Single-Estate Artisanal Green Tea (Hand-Rolled)',
    category: 'Other',
    description: 'Spring flush whole leaf green tea harvested at sunrise. Light grassy liquor with floral finish and high catechins.',
    price: 280,
    unit: 'pack',
    stock: 90,
    images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 360,
    rating: 4.8,
    reviewCount: 18
  },
  {
    farmerIdx: 10,
    name: 'High-Altitude Lakadong Turmeric Powder',
    category: 'Spices',
    description: 'Certified 7.5% curcumin content. World-famous Meghalaya/Assam border variety celebrated for potent anti-inflammatory properties.',
    price: 180,
    unit: 'pack',
    stock: 110,
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Organic',
    organic: true,
    expectedFreshnessDays: 360,
    rating: 4.9,
    reviewCount: 22
  },

  // Laxman Rao (East Godavari) - Andhra Delta Produce
  {
    farmerIdx: 11,
    name: 'Guntur Sannam Hot Red Chilli (Stemless)',
    category: 'Spices',
    description: 'Intense red color and high SHU pungency. Sun-dried without sulfur treatment for authentic Andhra warmth.',
    price: 220,
    unit: 'kg',
    stock: 140,
    images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Conventional',
    organic: false,
    expectedFreshnessDays: 180,
    rating: 4.5,
    reviewCount: 15
  },
  {
    farmerIdx: 11,
    name: 'Tender Green Drumsticks (Moringa Pods)',
    category: 'Vegetables',
    description: 'Freshly cut, fleshy drumsticks filled with tender seeds. Essential for authentic South Indian sambar.',
    price: 50,
    unit: 'bunch',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
    farmingMethod: 'Conventional',
    organic: false,
    expectedFreshnessDays: 5,
    rating: 4.6,
    reviewCount: 10
  }
];

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Starting full database wipe and seed...');

    // Clear collections
    await User.deleteMany({});
    await FarmerProfile.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Dispute.deleteMany({});
    await FavoriteFarmer.deleteMany({});
    await Cart.deleteMany({});

    console.log('[Seeder] Cleared existing records.');

    // 1. Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`[Seeder] Seeded ${categories.length} product categories.`);

    // 2. Seed Admin User
    const adminUser = await User.create(adminData);
    console.log(`[Seeder] Seeded Admin: ${adminUser.email}`);

    // 3. Seed Farmers & FarmerProfiles
    const createdFarmers = [];
    for (const fData of farmersData) {
      const user = await User.create({
        name: fData.name,
        email: fData.email,
        phone: fData.phone,
        password: fData.password,
        role: 'farmer',
        avatar: fData.avatar,
        status: 'active'
      });

      const profile = await FarmerProfile.create({
        user: user._id,
        ...fData.farm
      });

      createdFarmers.push({ user, profile });
    }
    console.log(`[Seeder] Seeded ${createdFarmers.length} Farmers & FarmerProfiles.`);

    // 4. Seed Customers
    const createdCustomers = [];
    for (const cData of customersData) {
      const user = await User.create({
        name: cData.name,
        email: cData.email,
        phone: cData.phone,
        password: 'CustomerPass123!',
        role: 'customer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cData.name)}`,
        status: 'active',
        addresses: [
          {
            street: cData.street,
            city: cData.city,
            district: cData.district,
            state: cData.state,
            pincode: cData.pincode,
            isDefault: true
          }
        ]
      });
      createdCustomers.push(user);
    }
    console.log(`[Seeder] Seeded ${createdCustomers.length} Customers with delivery addresses.`);

    // 5. Seed Products
    const createdProducts = [];
    for (const p of sampleProducts) {
      const farmerObj = createdFarmers[p.farmerIdx];
      if (!farmerObj) continue;

      const product = await Product.create({
        farmer: farmerObj.user._id,
        farmerProfile: farmerObj.profile._id,
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price,
        unit: p.unit,
        stock: p.stock,
        images: p.images,
        harvestDate: new Date(Date.now() - Math.floor(Math.random() * 3) * 86400000), // Today to 2 days ago
        expectedFreshnessDays: p.expectedFreshnessDays,
        farmingMethod: p.farmingMethod,
        organic: p.organic,
        minimumOrderQuantity: 1,
        available: true,
        rating: p.rating,
        reviewCount: p.reviewCount
      });
      createdProducts.push(product);
    }
    console.log(`[Seeder] Seeded ${createdProducts.length} Agricultural Products.`);

    // 6. Seed Realistic Orders
    const orderStatuses = ['Delivered', 'Delivered', 'Out for Delivery', 'Preparing', 'Confirmed', 'Pending'];
    const sampleOrders = [];

    for (let i = 0; i < 15; i++) {
      const customer = createdCustomers[i % createdCustomers.length];
      const product1 = createdProducts[i % createdProducts.length];
      const product2 = createdProducts[(i + 3) % createdProducts.length];
      const farmerUser = product1.farmer;
      const farmerProfile = product1.farmerProfile;

      const qty1 = (i % 3) + 1;
      const qty2 = ((i + 1) % 2) + 1;
      const subtotal = product1.price * qty1 + product2.price * qty2;
      const deliveryFee = 40;
      const total = subtotal + deliveryFee;
      const status = orderStatuses[i % orderStatuses.length];

      const orderNumber = `KRD-2026-${1000 + i}`;
      const address = customer.addresses[0];

      const order = await Order.create({
        orderNumber,
        customer: customer._id,
        farmer: farmerUser,
        farmerProfile,
        items: [
          {
            product: product1._id,
            name: product1.name,
            price: product1.price,
            quantity: qty1,
            unit: product1.unit,
            image: product1.images[0]
          },
          {
            product: product2._id,
            name: product2.name,
            price: product2.price,
            quantity: qty2,
            unit: product2.unit,
            image: product2.images[0]
          }
        ],
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: {
          street: address.street,
          city: address.city,
          district: address.district,
          state: address.state,
          pincode: address.pincode,
          contactNumber: customer.phone
        },
        deliverySlot: 'Morning (7:00 AM - 10:00 AM)',
        deliveryInstructions: 'Leave with security if not at home.',
        paymentMethod: i % 2 === 0 ? 'Cash on Delivery' : 'Simulated Online Payment',
        paymentStatus: status === 'Delivered' || i % 2 !== 0 ? 'paid' : 'pending',
        status,
        statusHistory: [
          { status: 'Pending', updatedAt: new Date(Date.now() - 4 * 86400000), note: 'Order placed by customer.' },
          { status: 'Confirmed', updatedAt: new Date(Date.now() - 3 * 86400000), note: 'Accepted by farmer.' },
          ...(status !== 'Pending' && status !== 'Confirmed'
            ? [{ status: 'Preparing', updatedAt: new Date(Date.now() - 2 * 86400000), note: 'Fresh morning harvest.' }]
            : []),
          ...(status === 'Out for Delivery' || status === 'Delivered'
            ? [{ status: 'Out for Delivery', updatedAt: new Date(Date.now() - 1 * 86400000), note: 'Dispatched with local farm van.' }]
            : []),
          ...(status === 'Delivered'
            ? [{ status: 'Delivered', updatedAt: new Date(), note: 'Delivered to customer doorstep.' }]
            : [])
        ],
        createdAt: new Date(Date.now() - (15 - i) * 86400000)
      });
      sampleOrders.push(order);
    }
    console.log(`[Seeder] Seeded ${sampleOrders.length} Realistic Orders.`);

    // 7. Seed Authentic Reviews
    const reviewComments = [
      'Outstanding freshness! The tomatoes smelled like real garden produce, not supermarket cold storage.',
      'Extremely prompt delivery and the unpolished Toor dal cooked so tenderly without any baking soda.',
      'The A2 Gir Cow Ghee has that authentic nutty aroma we remember from village childhood.',
      'Super crisp butterhead lettuce with living roots. Kept fresh in our fridge for over 8 days.',
      'Deeply aromatic Tellicherry peppercorns. Huge difference compared to commercial brands.',
      'Direct farm buying gave us such confidence in where our family food comes from. Will order weekly!'
    ];

    for (let i = 0; i < 10; i++) {
      const order = sampleOrders[i];
      if (order.status === 'Delivered') {
        const product = createdProducts[i % createdProducts.length];
        await Review.create({
          customer: order.customer,
          customerName: customersData[i].name,
          farmer: order.farmer,
          product: product._id,
          order: order._id,
          rating: 5,
          comment: reviewComments[i % reviewComments.length],
          status: 'approved'
        });
      }
    }
    console.log(`[Seeder] Seeded Authentic Reviews.`);

    // 8. Seed Sample Disputes for Admin resolution demo
    await Dispute.create({
      order: sampleOrders[0]._id,
      orderNumber: sampleOrders[0].orderNumber,
      customer: sampleOrders[0].customer,
      farmer: sampleOrders[0].farmer,
      reason: 'Damaged produce',
      description: 'Two tomatoes in the box were bruised during transit due to bumpy road conditions.',
      status: 'open',
      adminNote: ''
    });

    await Dispute.create({
      order: sampleOrders[1]._id,
      orderNumber: sampleOrders[1].orderNumber,
      customer: sampleOrders[1].customer,
      farmer: sampleOrders[1].farmer,
      reason: 'Delivery problem',
      description: 'Morning slot was chosen but farm van arrived in early afternoon.',
      status: 'resolved',
      adminNote: 'Farmer contacted customer and provided complimentary herb bunch on next scheduled order.'
    });

    console.log(`[Seeder] Seeded Sample Disputes.`);

    // 9. Seed Saved/Favorite Farmers for first 2 customers
    await FavoriteFarmer.create({
      customer: createdCustomers[0]._id,
      farmer: createdFarmers[0].user._id,
      farmerProfile: createdFarmers[0].profile._id
    });
    await FavoriteFarmer.create({
      customer: createdCustomers[0]._id,
      farmer: createdFarmers[1].user._id,
      farmerProfile: createdFarmers[1].profile._id
    });

    console.log('====================================================');
    console.log('✅ KrishiDirect Seed Completed Successfully!');
    console.log('====================================================');
    console.log('👑 Admin: admin@krishidirect.com | AdminPass123!');
    console.log('👨‍🌾 Farmer 1: ramesh.patel@farm.com | FarmerPass123!');
    console.log('👨‍🌾 Farmer 2: sunita.devi@farm.com | FarmerPass123!');
    console.log('🧑 Customer 1: priya.sharma@example.com | CustomerPass123!');
    console.log('🧑 Customer 2: arun.kumar@example.com | CustomerPass123!');
    console.log('====================================================');
  } catch (error) {
    console.error('[Seeder] Error during seed:', error);
    throw error;
  }
};

// Clean Slate: Keeps only Admin and Categories, wipes all mock orders/users/products
const seedCleanBase = async () => {
  try {
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Dispute.deleteMany({});
    await Product.deleteMany({});
    await FarmerProfile.deleteMany({});
    await FavoriteFarmer.deleteMany({});
    await Cart.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } });

    // Ensure 8 product categories exist
    for (const cat of categoriesData) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }

    // Ensure Admin exists
    const adminExists = await User.findOne({ email: adminData.email });
    if (!adminExists) {
      await User.create(adminData);
    }

    console.log('[Seeder] Database initialized to clean state (Admin + 8 Categories, 0 mock orders/users).');
  } catch (err) {
    console.error('[Seeder] Error initializing clean database:', err);
    throw err;
  }
};

const checkAndSeed = async () => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    console.log('[Seeder] Database is empty. Initializing clean base...');
    await seedCleanBase();
  } else {
    console.log(`[Seeder] Database active with Admin account.`);
  }
};

// If run directly from CLI
if (require.main === module) {
  const { connectDB, disconnectDB } = require('../config/db');
  (async () => {
    try {
      await connectDB();
      if (process.argv.includes('--clean')) {
        await seedCleanBase();
      } else {
        await seedDatabase();
      }
      await disconnectDB();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}

module.exports = {
  seedDatabase,
  seedCleanBase,
  checkAndSeed
};