
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
  variations: [
    {
      color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
        required: true,
      },
      size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        required: true,
      },
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





// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     product_name: {
//       type: String,
//       required: true,
//     },
//     category_name: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref:'Category',
//       required: true,
//     },
//     front_image: {
//       filename: {
//         type: String,
//         required: true,
//       },
//     },
//     product_colour: {
//       type:  mongoose.Schema.Types.ObjectId,
//       ref: 'Color',
//       required: true,
//     },
//     product_qty: {
//       type: Number,
//       required: true,
//     },
//     product_size: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Size',
//       required: true,
//     },
//     product_price: {
//       type: Number,
//       required: true,
//     },
//     discount_price: {
//       type: Number,
//       default: 0, 
//     },
//     product_images: [{
//       filename: {
//         type: String,
//         required: true,
//       },
//     }],
//   });
  

// const Product = mongoose.model('Product',productSchema);

// module.exports = Product;