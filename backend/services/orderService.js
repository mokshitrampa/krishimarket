const Order = require('../models/Order');
const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const Cart = require('../models/Cart');

/**
 * Creates separate orders per farmer from customer cart items,
 * validates inventory, decrements stock atomically, and logs statusHistory.
 */
const createOrdersFromCheckout = async (customerId, checkoutData) => {
  const {
    deliveryAddress,
    deliverySlot,
    deliveryInstructions,
    paymentMethod = 'Cash on Delivery',
    items // array of { productId, quantity }
  } = checkoutData;

  if (!items || items.length === 0) {
    throw new Error('No items provided for checkout.');
  }

  // 1. Group items by farmer & validate stock
  const farmerItemMap = {};

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (!product.available) {
      throw new Error(`Product '${product.name}' is currently not available.`);
    }
    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${item.quantity}.`
      );
    }

    const farmerId = product.farmer.toString();
    if (!farmerItemMap[farmerId]) {
      farmerItemMap[farmerId] = {
        farmerId: product.farmer,
        items: []
      };
    }

    farmerItemMap[farmerId].items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      unit: product.unit,
      image: product.images && product.images.length > 0 ? product.images[0] : ''
    });
  }

  // 2. Process each farmer group as a separate Order record
  const createdOrders = [];
  const timestamp = Date.now().toString().slice(-5);
  let orderIndex = 1;

  for (const farmerId in farmerItemMap) {
    const group = farmerItemMap[farmerId];
    const farmerProfile = await FarmerProfile.findOne({ user: farmerId });

    const subtotal = group.items.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );
    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KRD-${timestamp}-${orderIndex++}-${randomSuffix}`;

    // Decrement stock for each product
    for (const it of group.items) {
      await Product.findByIdAndUpdate(it.product, {
        $inc: { stock: -it.quantity }
      });
    }

    const order = await Order.create({
      orderNumber,
      customer: customerId,
      farmer: farmerId,
      farmerProfile: farmerProfile ? farmerProfile._id : null,
      items: group.items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      deliverySlot: deliverySlot || 'Morning (7:00 AM - 10:00 AM)',
      deliveryInstructions: deliveryInstructions || '',
      paymentMethod,
      paymentStatus: paymentMethod === 'Simulated Online Payment' ? 'paid' : 'pending',
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          updatedAt: new Date(),
          note: 'Order placed by customer and sent to farmer for confirmation.'
        }
      ]
    });

    createdOrders.push(order);
  }

  // 3. Clear customer cart
  await Cart.findOneAndUpdate(
    { customer: customerId },
    { $set: { items: [] } }
  );

  return createdOrders;
};

module.exports = {
  createOrdersFromCheckout
};