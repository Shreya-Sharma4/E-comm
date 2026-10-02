const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order (Cash on Delivery)
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, items } = req.body;

    // 1. Validate shipping address fields
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
    }

    const { name, phone, address, city, pincode } = shippingAddress;
    if (!name || !phone || !address || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'All shipping address fields (name, phone, address, city, pincode) are required',
      });
    }

    // 2. Validate order items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // 3. Re-verify prices and stock from MongoDB (Never trust frontend prices)
    const verifiedOrderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = item.product?._id || item.product;
      const quantity = Number(item.quantity);

      if (!productId || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item product ID or quantity',
        });
      }

      // Query database for authoritative price and current stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} no longer exists`,
        });
      }

      // Validate stock availability
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Requested ${quantity}, but only ${product.stock} units available.`,
        });
      }

      // Compute item total using authoritative database price
      const itemPrice = Number(product.price);
      calculatedTotal += itemPrice * quantity;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity,
      });
    }

    // 4. Create the Order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      products: verifiedOrderItems,
      totalAmount: Math.round(calculatedTotal * 100) / 100,
      shippingAddress: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      },
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
    });

    // 5. Atomically decrement stock in MongoDB for each product
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully via Cash on Delivery',
      data: order,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message,
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch your orders',
      error: error.message,
    });
  }
};

// @desc    Get all customer orders (Admin)
// @route   GET /api/admin/orders
// @access  Private (Admin Only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch all orders',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin Only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};
