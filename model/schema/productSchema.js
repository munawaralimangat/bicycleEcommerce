const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: {
      type: String,
      required: true,
    },
    category_name: {
      type: String,
      required: true,
    },
    product_imgurl: {
      type: String,
      required: true,
    },
    product_colour: {
      type: String,
      required: true,
    },
    product_qty: {
      type: Number,
      required: true,
    },
    product_size: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
      default: 0, // Assuming the default discount is 0
    },
  });
  

const Product = mongoose.model('Product', productSchema);

module.exports = Product