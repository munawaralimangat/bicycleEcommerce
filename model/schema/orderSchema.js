const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }

  next();
});

function generateOrderNumber() {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}-${randomString}`;
}

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
