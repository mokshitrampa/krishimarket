const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart with populated products and farmer grouping
// @route   GET /api/cart
// @access  Protected (Customer)
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ customer: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price unit stock images available harvestDate'
      })
      .populate({
        path: 'items.farmer',
        select: 'name avatar phone'
      });

    if (!cart) {
      cart = await Cart.create({ customer: req.user._id, items: [] });
    }

    // Filter out invalid items (e.g. deleted products)
    const validItems = cart.items.filter((item) => item.product && item.farmer);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Group items by farmer
    const farmerGroups = {};
    let grandSubtotal = 0;

    cart.items.forEach((item) => {
      const farmerId = item.farmer._id.toString();
      if (!farmerGroups[farmerId]) {
        farmerGroups[farmerId] = {
          farmer: {
            id: item.farmer._id,
            name: item.farmer.name,
            avatar: item.farmer.avatar
          },
          items: [],
          farmerSubtotal: 0,
          deliveryFee: 40 // Standard flat local delivery fee per farm dispatch
        };
      }

      const itemTotal = (item.product.price || 0) * item.quantity;
      farmerGroups[farmerId].items.push({
        id: item._id,
        product: item.product,
        quantity: item.quantity,
        itemTotal,
        inStock: item.product.stock >= item.quantity
      });

      farmerGroups[farmerId].farmerSubtotal += itemTotal;
      grandSubtotal += itemTotal;
    });

    const groupsArray = Object.values(farmerGroups);
    const totalDeliveryFee = groupsArray.length * 40;
    const grandTotal = grandSubtotal > 0 ? grandSubtotal + totalDeliveryFee : 0;

    return res.status(200).json({
      success: true,
      data: {
        cartId: cart._id,
        itemsCount: cart.items.reduce((acc, i) => acc + i.quantity, 0),
        farmerGroups: groupsArray,
        subtotal: grandSubtotal,
        deliveryFee: totalDeliveryFee,
        total: grandTotal
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Protected (Customer)
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.'
      });
    }

    const product = await Product.findById(productId);
    if (!product || !product.available) {
      return res.status(404).json({
        success: false,
        message: 'Product not available or out of stock.'
      });
    }

    if (product.stock < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} ${product.unit} available in stock.`
      });
    }

    let cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      cart = await Cart.create({ customer: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Exceeds available stock (${product.stock} ${product.unit}).`
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        farmer: product.farmer,
        quantity: Number(quantity)
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to cart.',
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Protected (Customer)
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.'
      });
    }

    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.'
      });
    }

    const item = cart.items.id(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart.'
      });
    }

    const product = await Product.findById(item.product);
    if (!product) {
      item.deleteOne();
      await cart.save();
      return res.status(404).json({
        success: false,
        message: 'Product no longer exists. Removed from cart.'
      });
    }

    if (product.stock < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} ${product.unit} available in stock.`
      });
    }

    item.quantity = Number(quantity);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart item updated.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Protected (Customer)
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.'
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.id);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Protected (Customer)
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { customer: req.user._id },
      { $set: { items: [] } }
    );

    return res.status(200).json({
      success: true,
      message: 'Cart cleared.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};