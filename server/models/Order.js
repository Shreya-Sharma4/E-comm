const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    products: {
      type: [orderItemSchema],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'Order must contain at least one product item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Order total is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    shippingAddress: {
      name: { type: String, required: [true, 'Recipient name is required'], trim: true },
      phone: { type: String, required: [true, 'Phone number is required'], trim: true },
      address: { type: String, required: [true, 'Street address is required'], trim: true },
      city: { type: String, required: [true, 'City is required'], trim: true },
      pincode: { type: String, required: [true, 'Postal code is required'], trim: true },
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
      enum: ['Cash on Delivery'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
