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
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  delivered: {
    type: Boolean,
    default: false 
  },
  totalPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Cancelled'],
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered','Cancelled'],
    default: 'Pending',
  },
  paymentDetails: {
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
  },
  paymentMethod: {
    type: String,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


// orderSchema.pre('save', function (next) {
//   if (!this.orderNumber) {
//     this.orderNumber = generateOrderNumber();
//   }

//   next();
// });

// function generateOrderNumber() {
//   const timestamp = Date.now().toString(36);
//   const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
//   return `${timestamp}-${randomString}`;
// }