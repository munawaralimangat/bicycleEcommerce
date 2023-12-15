
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  category_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  front_image: {
    filename: {
      type: String,
      required: true,
    },
  },
  // size: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Size',
  //   required: true,
  // },
  // quantity: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  variations: [
    {
      size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        required: true,
      },
      // color:{
      //   type:mongoose.Schema.Types.ObjectId,
      //   ref:'color',
      //   required:true,
      // }
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  product_price: {
    type: Number,
    required: true,
  },
  discount_price: {
    type: Number,
    default: 0,
  },
  product_images: [{
    filename: {
      type: String,
      required: true,
    },
  }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;